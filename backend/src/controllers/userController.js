const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Medication = require('../models/Medication');
const Appointment = require('../models/Appointment');
const MedicalReport = require('../models/MedicalReport');
const HealthLog = require('../models/HealthLog');

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    let doctorInfo = null;
    if (user.role === 'doctor') {
      doctorInfo = await Doctor.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        isVerified: user.isVerified,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences,
        doctorInfo,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, dateOfBirth, gender, address, emergencyContact, bloodGroup, allergies, medicalHistory } = req.body;

    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (phone) user.profile.phone = phone;
    if (dateOfBirth) user.profile.dateOfBirth = dateOfBirth;
    if (gender) user.profile.gender = gender;
    if (address) user.profile.address = address;
    if (emergencyContact) user.profile.emergencyContact = emergencyContact;
    if (bloodGroup) user.profile.bloodGroup = bloodGroup;
    if (allergies) user.profile.allergies = allergies;
    if (medicalHistory) user.profile.medicalHistory = medicalHistory;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
  try {
    const { notifications, language, timezone } = req.body;

    const user = await User.findById(req.user.id);

    if (notifications) user.preferences.notifications = notifications;
    if (language) user.preferences.language = language;
    if (timezone) user.preferences.timezone = timezone;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: user.preferences,
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
    });
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard-stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [medications, appointments, reports, healthLogs] = await Promise.all([
      Medication.countDocuments({ patient: userId, status: 'active' }),
      Appointment.countDocuments({ patient: userId, status: { $in: ['scheduled', 'confirmed'] } }),
      MedicalReport.countDocuments({ patient: userId }),
      HealthLog.countDocuments({ patient: userId }),
    ]);

    const upcomingAppointments = await Appointment.find({
      patient: userId,
      status: { $in: ['scheduled', 'confirmed'] },
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(5)
      .populate('doctor', 'user')
      .populate('patient', 'name email');

    const recentMedications = await Medication.find({
      patient: userId,
      status: 'active',
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const adherenceRate = await Medication.aggregate([
      { $match: { patient: userId } },
      { $unwind: '$adherence' },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          taken: { $sum: { $cond: ['$adherence.taken', 1, 0] } },
        },
      },
      {
        $project: {
          rate: {
            $multiply: [{ $divide: ['$taken', '$total'] }, 100],
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        activeMedications: medications,
        upcomingAppointments: appointments,
        totalReports: reports,
        healthLogs: healthLogs,
        adherenceRate: adherenceRate[0]?.rate || 0,
      },
      upcomingAppointments,
      recentMedications,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats',
    });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Delete all related data
    await Promise.all([
      Medication.deleteMany({ patient: user._id }),
      Appointment.deleteMany({ patient: user._id }),
      MedicalReport.deleteMany({ patient: user._id }),
      HealthLog.deleteMany({ patient: user._id }),
    ]);

    await user.remove();

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
    });
  }
};

// @desc    Get user health summary
// @route   GET /api/users/health-summary
// @access  Private
exports.getHealthSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const [latestVitals, recentSymptoms, medications] = await Promise.all([
      HealthLog.findOne({ patient: userId }).sort({ date: -1 }).select('vitals'),
      HealthLog.find({ patient: userId })
        .sort({ date: -1 })
        .limit(7)
        .select('symptoms date'),
      Medication.find({ patient: userId, status: 'active' }).select('name dosage frequency'),
    ]);

    res.status(200).json({
      success: true,
      summary: {
        latestVitals: latestVitals?.vitals || null,
        recentSymptoms: recentSymptoms || [],
        activeMedications: medications || [],
      },
    });
  } catch (error) {
    console.error('Health summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get health summary',
    });
  }
};