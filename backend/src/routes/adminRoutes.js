const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');
const {
  getStats,
  getUsers,
  updateUser,
  deleteUser,
  getDoctors,
  getAppointments,
  getAnalytics,
} = require('../controllers/adminController');

// Validation rules
const updateUserValidation = [
  body('role').optional().isIn(['patient', 'doctor', 'admin', 'superadmin']).withMessage('Invalid role'),
  body('isActive').optional().isBoolean(),
  body('isVerified').optional().isBoolean(),
  body('name').optional().isString().isLength({ min: 2, max: 50 }),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('profile').optional().isObject(),
];

// All admin routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// Dashboard stats
router.get('/stats', getStats);

// User management
router.get('/users', getUsers);
router.put('/users/:id', updateUserValidation, validate, updateUser);
router.delete('/users/:id', deleteUser);

// Doctor management
router.get('/doctors', getDoctors);

// Appointment management
router.get('/appointments', getAppointments);

// Analytics
router.get('/analytics', getAnalytics);

module.exports = router;