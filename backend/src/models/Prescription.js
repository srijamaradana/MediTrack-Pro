const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    medications: [
      {
        name: {
          type: String,
          required: true,
        },
        genericName: String,
        dosage: {
          type: String,
          required: true,
        },
        frequency: {
          type: String,
          required: true,
        },
        duration: String,
        quantity: Number,
        refills: {
          type: Number,
          default: 0,
        },
        refillsRemaining: {
          type: Number,
          default: 0,
        },
        instructions: String,
        route: {
          type: String,
          enum: ['oral', 'topical', 'inhalation', 'injection', 'sublingual', 'rectal', 'ophthalmic', 'otic'],
          default: 'oral',
        },
        strengths: String,
        notes: String,
      },
    ],
    diagnosis: String,
    symptoms: [String],
    notes: String,
    patientInstructions: String,
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    validUntil: Date,
    status: {
      type: String,
      enum: ['active', 'completed', 'expired', 'cancelled', 'pending'],
      default: 'active',
    },
    isDigital: {
      type: Boolean,
      default: true,
    },
    digitalSignature: {
      type: String,
    },
    signatureDate: Date,
    template: {
      type: String,
      enum: ['standard', 'controlled', 'narcotic', 'custom'],
      default: 'standard',
    },
    pharmacy: {
      name: String,
      address: String,
      phone: String,
    },
    refillHistory: [
      {
        refilledAt: {
          type: Date,
          default: Date.now,
        },
        pharmacy: String,
        quantity: Number,
        notes: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
PrescriptionSchema.index({ patient: 1, issuedDate: -1 });
PrescriptionSchema.index({ doctor: 1 });
PrescriptionSchema.index({ status: 1 });

// Virtuals
PrescriptionSchema.virtual('isExpired').get(function () {
  return this.validUntil && new Date() > this.validUntil;
});

PrescriptionSchema.virtual('totalMedications').get(function () {
  return this.medications ? this.medications.length : 0;
});

// Methods
PrescriptionSchema.methods.addRefill = async function (pharmacy, quantity, notes) {
  this.refillHistory.push({
    refilledAt: new Date(),
    pharmacy,
    quantity,
    notes,
  });
  this.medications.forEach((med) => {
    if (med.refillsRemaining > 0) {
      med.refillsRemaining -= 1;
    }
  });
  await this.save();
  return this;
};

PrescriptionSchema.methods.renew = async function (newValidUntil) {
  this.status = 'active';
  this.validUntil = newValidUntil;
  this.medications.forEach((med) => {
    med.refillsRemaining = med.refills || 0;
  });
  await this.save();
  return this;
};

module.exports = mongoose.model('Prescription', PrescriptionSchema);