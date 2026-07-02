const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  getMedications,
  getMedicationById,
  addMedication,
  updateMedication,
  deleteMedication,
  markAsTaken,
  getAdherenceStats,
} = require('../controllers/medicationController');

// Validation rules
const addMedicationValidation = [
  body('name').notEmpty().withMessage('Medication name is required'),
  body('dosage').notEmpty().withMessage('Dosage is required'),
  body('frequency').isIn(['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'As needed', 'Weekly', 'Monthly'])
    .withMessage('Invalid frequency'),
  body('times').isArray({ min: 1 }).withMessage('At least one time is required'),
  body('times.*').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),
  body('startDate').isISO8601().withMessage('Invalid start date'),
  body('endDate').optional().isISO8601().withMessage('Invalid end date'),
  body('instructions').optional().isString().isLength({ max: 500 }),
  body('prescribedBy').optional().isMongoId().withMessage('Invalid doctor ID'),
  body('category').optional().isIn(['prescription', 'over-the-counter', 'supplement', 'vaccine']),
  body('refillReminder.enabled').optional().isBoolean(),
  body('refillReminder.daysBefore').optional().isInt({ min: 1, max: 30 }),
];

const updateMedicationValidation = [
  body('name').optional().notEmpty().withMessage('Medication name cannot be empty'),
  body('dosage').optional().notEmpty().withMessage('Dosage cannot be empty'),
  body('frequency').optional().isIn(['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'As needed', 'Weekly', 'Monthly']),
  body('times').optional().isArray({ min: 1 }),
  body('status').optional().isIn(['active', 'completed', 'discontinued', 'paused', 'pending']),
  body('endDate').optional().isISO8601(),
];

const markAsTakenValidation = [
  body('time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('notes').optional().isString(),
];

// All routes require authentication
router.use(protect);

// Main routes
router.get('/', getMedications);
router.get('/adherence', getAdherenceStats);
router.post('/', addMedicationValidation, validate, addMedication);

// Individual medication routes
router.get('/:id', getMedicationById);
router.put('/:id', updateMedicationValidation, validate, updateMedication);
router.delete('/:id', deleteMedication);
router.post('/:id/take', markAsTakenValidation, validate, markAsTaken);

module.exports = router;