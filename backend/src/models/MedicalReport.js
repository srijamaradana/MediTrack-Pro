const mongoose = require('mongoose');

const MedicalReportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    title: {
      type: String,
      required: [true, 'Please provide report title'],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'Lab Report',
        'Radiology',
        'Prescription',
        'Surgery Report',
        'Discharge Summary',
        'Vaccination Record',
        'Health Checkup',
        'Medical Certificate',
        'Insurance Document',
        'Other',
      ],
    },
    category: {
      type: String,
      enum: ['diagnostic', 'treatment', 'preventive', 'administrative'],
      default: 'diagnostic',
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    filePublicId: String,
    fileType: {
      type: String,
      required: true,
      enum: ['pdf', 'image', 'doc', 'docx', 'txt'],
    },
    fileSize: Number,
    fileName: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    uploadedByRole: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
    },
    reviewed: {
      type: Boolean,
      default: false,
    },
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    reviewNotes: String,
    isShared: {
      type: Boolean,
      default: false,
    },
    sharedWith: [
      {
        doctor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Doctor',
        },
        sharedAt: {
          type: Date,
          default: Date.now,
        },
        permission: {
          type: String,
          enum: ['view', 'edit', 'comment'],
          default: 'view',
        },
      },
    ],
    tags: [String],
    expiryDate: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationHash: String,
    metadata: {
      labName: String,
      labAddress: String,
      collectionDate: Date,
      reportDate: Date,
      referenceRange: String,
      abnormalities: [String],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
MedicalReportSchema.index({ patient: 1, createdAt: -1 });
MedicalReportSchema.index({ type: 1 });
MedicalReportSchema.index({ tags: 1 });

// Virtuals
MedicalReportSchema.virtual('isExpired').get(function () {
  return this.expiryDate && new Date() > this.expiryDate;
});

MedicalReportSchema.virtual('fileExtension').get(function () {
  if (!this.fileName) return '';
  return this.fileName.split('.').pop();
});

// Methods
MedicalReportSchema.methods.shareWith = async function (doctorId, permission = 'view') {
  if (!this.sharedWith.some((s) => s.doctor.toString() === doctorId.toString())) {
    this.sharedWith.push({
      doctor: doctorId,
      permission: permission,
    });
    this.isShared = true;
    await this.save();
  }
  return this;
};

MedicalReportSchema.methods.revokeAccess = async function (doctorId) {
  this.sharedWith = this.sharedWith.filter(
    (s) => s.doctor.toString() !== doctorId.toString()
  );
  if (this.sharedWith.length === 0) {
    this.isShared = false;
  }
  await this.save();
  return this;
};

module.exports = mongoose.model('MedicalReport', MedicalReportSchema);