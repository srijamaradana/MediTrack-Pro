const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['patient', 'doctor', 'admin', 'superadmin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'patient',
    },
    profile: {
      phone: {
        type: String,
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
      },
      dateOfBirth: Date,
      gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer-not-to-say'],
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: { type: String, default: 'India' },
        coordinates: {
          latitude: Number,
          longitude: Number,
        },
      },
      emergencyContact: {
        name: String,
        relationship: String,
        phone: String,
      },
      bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      },
      allergies: [String],
      medicalHistory: String,
      profilePicture: {
        url: String,
        publicId: String,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    lastLogin: Date,
    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
      },
      language: { type: String, default: 'en' },
      timezone: { type: String, default: 'Asia/Kolkata' },
    },
    deviceInfo: [
      {
        deviceId: String,
        deviceType: String,
        browser: String,
        os: String,
        lastLogin: Date,
        isActive: { type: Boolean, default: true },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ 'profile.bloodGroup': 1 });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware for email verification
UserSchema.pre('save', function (next) {
  if (this.isNew && !this.isEmailVerified) {
    const token = crypto.randomBytes(32).toString('hex');
    this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  }
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Generate password reset token
UserSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Generate email verification token
UserSchema.methods.generateEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  return token;
};

// Check if token is expired
UserSchema.methods.isTokenExpired = function (tokenType) {
  const tokenExpiry = tokenType === 'reset' ? this.resetPasswordExpire : this.emailVerificationExpires;
  return Date.now() > tokenExpiry;
};

// Virtuals
UserSchema.virtual('fullName').get(function () {
  return this.name;
});

UserSchema.virtual('age').get(function () {
  if (!this.profile.dateOfBirth) return null;
  const age = new Date().getFullYear() - new Date(this.profile.dateOfBirth).getFullYear();
  return age;
});

UserSchema.virtual('isAdmin').get(function () {
  return this.role === 'admin' || this.role === 'superadmin';
});

UserSchema.virtual('isDoctor').get(function () {
  return this.role === 'doctor';
});

module.exports = mongoose.model('User', UserSchema);