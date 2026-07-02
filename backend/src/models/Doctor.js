const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please provide specialization'],
      enum: [
        'Cardiology',
        'Dermatology',
        'Endocrinology',
        'Gastroenterology',
        'Hematology',
        'Infectious Disease',
        'Nephrology',
        'Neurology',
        'Obstetrics & Gynecology',
        'Oncology',
        'Ophthalmology',
        'Orthopedics',
        'Otolaryngology (ENT)',
        'Pediatrics',
        'Psychiatry',
        'Pulmonology',
        'Radiology',
        'Rheumatology',
        'Surgery',
        'Urology',
        'General Medicine',
        'Family Medicine',
        'Emergency Medicine',
        'Anesthesiology',
        'Pathology',
      ],
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Experience cannot exceed 50 years'],
    },
    education: [
      {
        degree: String,
        institution: String,
        year: Number,
        country: String,
      },
    ],
    certifications: [
      {
        name: String,
        issuingOrganization: String,
        year: Number,
        expiryDate: Date,
      },
    ],
    hospital: {
      name: {
        type: String,
        required: true,
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
      phone: String,
      email: String,
      website: String,
    },
    consultationFee: {
      type: Number,
      required: true,
      min: [0, 'Consultation fee cannot be negative'],
    },
    availability: {
      days: {
        type: [String],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true,
      },
      timeSlots: [
        {
          start: {
            type: String,
            match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          },
          end: {
            type: String,
            match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          },
        },
      ],
      breakTime: {
        start: String,
        end: String,
      },
      timeZone: {
        type: String,
        default: 'Asia/Kolkata',
      },
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    patients: [
      {
        patient: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        assignedDate: {
          type: Date,
          default: Date.now,
        },
        lastVisit: Date,
        medicalHistory: String,
        notes: String,
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    languages: [String],
    about: {
      type: String,
      maxlength: 1000,
    },
    achievements: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
DoctorSchema.index({ specialization: 1, isAvailable: 1 });
DoctorSchema.index({ 'hospital.name': 1 });
DoctorSchema.index({ rating: -1 });

// Virtuals
DoctorSchema.virtual('fullName').get(function () {
  return this.user ? this.user.name : 'Unknown';
});

DoctorSchema.virtual('totalPatients').get(function () {
  return this.patients ? this.patients.length : 0;
});

DoctorSchema.virtual('ratingStars').get(function () {
  if (this.rating === 0) return 'No ratings yet';
  return '★'.repeat(Math.round(this.rating)) + '☆'.repeat(5 - Math.round(this.rating));
});

module.exports = mongoose.model('Doctor', DoctorSchema);