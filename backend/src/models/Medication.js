const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide medication name'],
      trim: true,
    },
    genericName: String,
    dosage: {
      type: String,
      required: [true, 'Please provide dosage'],
      trim: true,
    },
    frequency: {
      type: String,
      required: true,
      enum: [
        'Once daily',
        'Twice daily',
        'Three times daily',
        'Four times daily',
        'Every 4 hours',
        'Every 6 hours',
        'Every 8 hours',
        'Every 12 hours',
        'As needed',
        'Weekly',
        'Monthly',
      ],
    },
    times: {
      type: [String],
      required: true,
      validate: {
        validator: function (times) {
          return times && times.length > 0;
        },
        message: 'Please provide at least one time',
      },
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    duration: {
      value: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months'],
      },
    },
    instructions: {
      type: String,
      maxlength: 500,
    },
    prescribedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'discontinued', 'paused', 'pending'],
      default: 'active',
    },
    category: {
      type: String,
      enum: ['prescription', 'over-the-counter', 'supplement', 'vaccine'],
      default: 'prescription',
    },
    stock: {
      quantity: Number,
      unit: String,
      reorderLevel: Number,
    },
    adherence: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        time: String,
        taken: {
          type: Boolean,
          default: false,
        },
        notes: String,
        reasonForMiss: {
          type: String,
          enum: ['forgot', 'side-effects', 'out-of-stock', 'other'],
        },
      },
    ],
    refillReminder: {
      enabled: {
        type: Boolean,
        default: false,
      },
      daysBefore: {
        type: Number,
        default: 3,
      },
      lastRefilled: Date,
      nextRefillDate: Date,
    },
    sideEffects: [
      {
        effect: String,
        severity: {
          type: String,
          enum: ['mild', 'moderate', 'severe'],
        },
        dateReported: Date,
      },
    ],
    interactions: [
      {
        medication: String,
        severity: {
          type: String,
          enum: ['minor', 'moderate', 'major'],
        },
        description: String,
      },
    ],
    notes: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
MedicationSchema.index({ patient: 1, status: 1 });
MedicationSchema.index({ 'adherence.date': -1 });
MedicationSchema.index({ name: 1, patient: 1 });

// Virtuals
MedicationSchema.virtual('todayAdherence').get(function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return this.adherence.filter(
    (a) => new Date(a.date).setHours(0, 0, 0, 0) === today.getTime()
  );
});

MedicationSchema.virtual('adherenceRate').get(function () {
  if (this.adherence.length === 0) return 0;
  const taken = this.adherence.filter((a) => a.taken).length;
  return Math.round((taken / this.adherence.length) * 100);
});

MedicationSchema.virtual('missedDoses').get(function () {
  return this.adherence.filter((a) => !a.taken).length;
});

// Methods
MedicationSchema.methods.markTaken = async function (time) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingEntry = this.adherence.find(
    (a) =>
      new Date(a.date).setHours(0, 0, 0, 0) === today.getTime() &&
      a.time === time
  );

  if (existingEntry) {
    existingEntry.taken = true;
  } else {
    this.adherence.push({
      date: new Date(),
      time: time,
      taken: true,
    });
  }

  await this.save();
  return this;
};

module.exports = mongoose.model('Medication', MedicationSchema);