const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { isDoctor, isDoctorOrAdmin } = require('../middleware/roleCheck');
const {
  getDoctorProfile,
  updateDoctorProfile,
  getAllDoctors,
  getDoctorById,
  getPatients,
  getPatientDetails,
  getAppointments,
  updateAppointmentStatus,
  getStats,
} = require('../controllers/doctorController');

// Validation rules
const updateDoctorProfileValidation = [
  body('specialization').optional().isString(),
  body('licenseNumber').optional().isString(),
  body('experience').optional().isInt({ min: 0, max: 50 }).withMessage('Experience must be between 0 and 50 years'),
  body('consultationFee').optional().isInt({ min: 0 }).withMessage('Consultation fee must be a positive number'),
  body('hospital.name').optional().isString(),
  body('hospital.address').optional().isString(),
  body('hospital.city').optional().isString(),
  body('hospital.state').optional().isString(),
  body('hospital.zipCode').optional().isString(),
  body('hospital.country').optional().isString(),
  body('hospital.phone').optional().isString(),
  body('availability.days').optional().isArray(),
  body('availability.timeSlots').optional().isArray(),
  body('about').optional().isString().isLength({ max: 1000 }),
  body('languages').optional().isArray(),
];

const updateAppointmentValidation = [
  body('status').optional().isIn(['scheduled', 'confirmed', 'completed', 'cancelled', 'missed', 'rescheduled']),
  body('vitals').optional().isObject(),
  body('diagnosis').optional().isString(),
  body('treatmentPlan').optional().isString(),
  body('notes').optional().isString(),
];

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

// Doctor only routes
router.use(protect);
router.use(isDoctor);

router.get('/profile', getDoctorProfile);
router.put('/profile', updateDoctorProfileValidation, validate, updateDoctorProfile);
router.get('/patients', getPatients);
router.get('/patients/:patientId', getPatientDetails);
router.get('/appointments', getAppointments);
router.put('/appointments/:id', updateAppointmentValidation, validate, updateAppointmentStatus);
router.get('/stats', getStats);

module.exports = router;