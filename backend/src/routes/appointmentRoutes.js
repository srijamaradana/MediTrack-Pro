const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  getAppointments,
  getAppointmentById,
  bookAppointment,
  cancelAppointment,
  rescheduleAppointment,
  getAvailableSlots,
} = require('../controllers/appointmentController');

// Validation rules
const bookAppointmentValidation = [
  body('doctorId').isMongoId().withMessage('Valid doctor ID is required'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),
  body('duration').optional().isInt({ min: 15, max: 120 }).withMessage('Duration must be between 15 and 120 minutes'),
  body('type').optional().isIn(['consultation', 'follow-up', 'emergency', 'checkup', 'procedure', 'telemedicine']),
  body('symptoms').optional().isArray(),
  body('notes').optional().isString(),
  body('isVirtual').optional().isBoolean(),
];

const cancelAppointmentValidation = [
  body('reason').optional().isString(),
];

const rescheduleAppointmentValidation = [
  body('newDate').isISO8601().withMessage('Invalid date format'),
  body('newTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),
  body('reason').optional().isString(),
];

// All routes require authentication
router.use(protect);

// Main routes
router.get('/', getAppointments);
router.get('/available-slots/:doctorId', getAvailableSlots);
router.post('/', bookAppointmentValidation, validate, bookAppointment);

// Individual appointment routes
router.get('/:id', getAppointmentById);
router.put('/:id/cancel', cancelAppointmentValidation, validate, cancelAppointment);
router.put('/:id/reschedule', rescheduleAppointmentValidation, validate, rescheduleAppointment);

module.exports = router;