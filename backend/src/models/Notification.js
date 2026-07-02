const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'medication',
        'appointment',
        'report',
        'system',
        'reminder',
        'alert',
        'info',
        'success',
        'warning',
        'error',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    scheduledTime: Date,
    sentAt: Date,
    delivered: {
      type: Boolean,
      default: false,
    },
    deliveryMethod: {
      type: [String],
      enum: ['in-app', 'email', 'sms', 'push'],
      default: ['in-app'],
    },
    deliveryStatus: {
      email: { sent: Boolean, sentAt: Date, error: String },
      sms: { sent: Boolean, sentAt: Date, error: String },
      push: { sent: Boolean, sentAt: Date, error: String },
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedModel',
    },
    relatedModel: {
      type: String,
      enum: ['Medication', 'Appointment', 'MedicalReport', 'User', 'Prescription', 'HealthLog'],
    },
    actionUrl: String,
    actionLabel: String,
    metadata: mongoose.Schema.Types.Mixed,
    expiresAt: Date,
    dismissed: {
      type: Boolean,
      default: false,
    },
    dismissedAt: Date,
    dismissedReason: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ scheduledTime: 1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtuals
NotificationSchema.virtual('isUrgent').get(function () {
  return this.priority === 'urgent' || this.priority === 'high';
});

NotificationSchema.virtual('isExpired').get(function () {
  return this.expiresAt && new Date() > this.expiresAt;
});

// Methods
NotificationSchema.methods.markAsRead = async function () {
  this.read = true;
  this.readAt = new Date();
  await this.save();
  return this;
};

NotificationSchema.methods.markAsDelivered = async function (method = 'in-app') {
  if (!this.delivered) {
    this.delivered = true;
    this.sentAt = new Date();
    if (method !== 'in-app') {
      this.deliveryStatus[method] = {
        sent: true,
        sentAt: new Date(),
      };
    }
    await this.save();
  }
  return this;
};

NotificationSchema.methods.markAsDismissed = async function (reason) {
  this.dismissed = true;
  this.dismissedAt = new Date();
  this.dismissedReason = reason;
  await this.save();
  return this;
};

module.exports = mongoose.model('Notification', NotificationSchema);