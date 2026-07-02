const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect, optionalAuth } = require('../middleware/auth');
const { allowIfOwnUser } = require('../middleware/roleCheck');
const {
  getMe,
  getUserById,
  updateProfile,
  updatePreferences,
  getDashboardStats,
  changePassword,
  deleteAccount,
  getHealthSummary,
} = require('../controllers/userController');

// Validation rules
const updateProfileValidation = [
  body('name').optional().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say']).withMessage('Invalid gender'),
  body('bloodGroup').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood group'),
  body('allergies').optional().isArray(),
  body('medicalHistory').optional().isString(),
  body('address.street').optional().isString(),
  body('address.city').optional().isString(),
  body('address.state').optional().isString(),
  body('address.zipCode').optional().isString(),
  body('address.country').optional().isString(),
  body('emergencyContact.name').optional().isString(),
  body('emergencyContact.relationship').optional().isString(),
  body('emergencyContact.phone').optional().isMobilePhone().withMessage('Invalid emergency contact phone'),
];

const updatePreferencesValidation = [
  body('notifications.email').optional().isBoolean(),
  body('notifications.sms').optional().isBoolean(),
  body('notifications.push').optional().isBoolean(),
  body('language').optional().isString().isLength({ min: 2, max: 5 }),
  body('timezone').optional().isString(),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
];

// All routes require authentication
router.use(protect);

// Current user routes
router.get('/me', getMe);
router.put('/profile', updateProfileValidation, validate, updateProfile);
router.put('/preferences', updatePreferencesValidation, validate, updatePreferences);
router.put('/change-password', changePasswordValidation, validate, changePassword);
router.delete('/account', deleteAccount);
router.get('/dashboard-stats', getDashboardStats);
router.get('/health-summary', getHealthSummary);

// User by ID (with ownership check)
router.get('/:id', allowIfOwnUser('id'), getUserById);

module.exports = router;