const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    duration: {
      type: Number,
      default: 30,
      min: 15,
      max: 120,
    },
    type: {
      type: String,
      enum: ['consultation', 'follow-up', 'emergency', 'checkup', 'procedure', 'telemedicine'],
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'missed', 'rescheduled', 'pending'],
      default: 'scheduled',
    },
    symptoms: [String],
    notes: String,
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
    },
    medicalReports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalReport',
      },
    ],
    vitals: {
      bloodPressureSystolic: Number,
      bloodPressureDiastolic: Number,
      heartRate: {
        type: Number,
        min: 30,
        max: 200,
      },
      temperature: {
        type: Number,
        min: 30,
        max: 45,
      },
      weight: Number,
      height: Number,
      bmi: Number,
      bloodSugar: Number,
      oxygenSaturation: {
        type: Number,
        min: 70,
        max: 100,
      },
      respiratoryRate: {
        type: Number,
        min: 8,
        max: 40,
      },
    },
    diagnosis: String,
    treatmentPlan: String,
    followUpDate: Date,
    reminders: {
      sent: {
        type: Boolean,
        default: false,
      },
      sentAt: Date,
      reminderCount: {
        type: Number,
        default: 0,
      },
      lastReminderSent: Date,
    },
    cancelledBy: {
      type: String,
      enum: ['patient', 'doctor', 'admin', 'system'],
    },
    cancellationReason: String,
    cancellationDate: Date,
    rescheduleHistory: [
      {
        oldDate: Date,
        oldTime: String,
        newDate: Date,
        newTime: String,
        reason: String,
        changedBy: String,
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    payment: {
      amount: Number,
      currency: {
        type: String,
        default: 'INR',
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'refunded', 'failed'],
        default: 'pending',
      },
      paymentId: String,
      paymentMethod: String,
      paymentDate: Date,
    },
    isVirtual: {
      type: Boolean,
      default: false,
    },
    meetingLink: String,
    meetingId: String,
    waitingTime: Number,
    actualStartTime: Date,
    actualEndTime: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
AppointmentSchema.index({ patient: 1, date: -1 });
AppointmentSchema.index({ doctor: 1, date: 1 });
AppointmentSchema.index({ status: 1, date: 1 });
AppointmentSchema.index({ 'payment.status': 1 });

// Virtuals
AppointmentSchema.virtual('isUpcoming').get(function () {
  return ['scheduled', 'confirmed'].includes(this.status) && new Date(this.date) > new Date();
});

AppointmentSchema.virtual('isToday').get(function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const appointmentDate = new Date(this.date);
  appointmentDate.setHours(0, 0, 0, 0);
  return appointmentDate.getTime() === today.getTime();
});

AppointmentSchema.virtual('isPast').get(function () {
  return new Date(this.date) < new Date() && this.status !== 'cancelled';
});

// Methods
AppointmentSchema.methods.cancel = async function (reason, cancelledBy) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledBy = cancelledBy;
  this.cancellationDate = new Date();
  await this.save();
  return this;
};

AppointmentSchema.methods.reschedule = async function (newDate, newTime, reason, changedBy) {
  this.rescheduleHistory.push({
    oldDate: this.date,
    oldTime: this.time,
    newDate: newDate,
    newTime: newTime,
    reason: reason,
    changedBy: changedBy,
  });

  this.date = newDate;
  this.time = newTime;
  this.status = 'rescheduled';
  await this.save();
  return this;
};

AppointmentSchema.methods.complete = async function (vitals, diagnosis, treatmentPlan) {
  this.status = 'completed';
  if (vitals) this.vitals = vitals;
  if (diagnosis) this.diagnosis = diagnosis;
  if (treatmentPlan) this.treatmentPlan = treatmentPlan;
  this.actualEndTime = new Date();
  await this.save();
  return this;
};

module.exports = mongoose.model('Appointment', AppointmentSchema);