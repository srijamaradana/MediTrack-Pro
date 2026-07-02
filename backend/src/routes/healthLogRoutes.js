const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  getHealthLogs,
  getHealthLogById,
  addHealthLog,
  updateHealthLog,
  deleteHealthLog,
  getHealthTrends,
} = require('../controllers/healthLogController');

// Validation rules
const addHealthLogValidation = [
  body('symptoms').optional().isArray(),
  body('symptoms.*').isString(),
  body('medications').optional().isArray(),
  body('medications.*.medication').optional().isMongoId(),
  body('medications.*.taken').optional().isBoolean(),
  body('vitals').optional().isObject(),
  body('vitals.bloodPressureSystolic').optional().isInt({ min: 50, max: 300 }),
  body('vitals.bloodPressureDiastolic').optional().isInt({ min: 30, max: 200 }),
  body('vitals.heartRate').optional().isInt({ min: 30, max: 220 }),
  body('vitals.temperature').optional().isFloat({ min: 30, max: 45 }),
  body('vitals.weight').optional().isFloat({ min: 1, max: 500 }),
  body('vitals.height').optional().isFloat({ min: 50, max: 300 }),
  body('vitals.bloodSugar').optional().isFloat({ min: 20, max: 500 }),
  body('vitals.oxygenSaturation').optional().isInt({ min: 70, max: 100 }),
  body('mood').optional().isIn(['happy', 'neutral', 'sad', 'anxious', 'stressed', 'energetic', 'tired', 'depressed']),
  body('sleep.hours').optional().isFloat({ min: 0, max: 24 }),
  body('sleep.quality').optional().isIn(['excellent', 'good', 'fair', 'poor', 'very-poor']),
  body('exercise.type').optional().isIn(['cardiovascular', 'strength', 'flexibility', 'balance', 'none']),
  body('exercise.duration').optional().isInt({ min: 0, max: 180 }),
  body('painLevel').optional().isInt({ min: 0, max: 10 }),
  body('stressLevel').optional().isInt({ min: 0, max: 10 }),
  body('energyLevel').optional().isInt({ min: 0, max: 10 }),
  body('notes').optional().isString(),
];

const updateHealthLogValidation = [
  body('symptoms').optional().isArray(),
  body('medications').optional().isArray(),
  body('vitals').optional().isObject(),
  body('mood').optional().isIn(['happy', 'neutral', 'sad', 'anxious', 'stressed', 'energetic', 'tired', 'depressed']),
  body('sleep').optional().isObject(),
  body('exercise').optional().isObject(),
  body('painLevel').optional().isInt({ min: 0, max: 10 }),
  body('stressLevel').optional().isInt({ min: 0, max: 10 }),
  body('energyLevel').optional().isInt({ min: 0, max: 10 }),
  body('notes').optional().isString(),
];

// All routes require authentication
router.use(protect);

// Main routes
router.get('/', getHealthLogs);
router.get('/trends', getHealthTrends);
router.post('/', addHealthLogValidation, validate, addHealthLog);

// Individual log routes
router.get('/:id', getHealthLogById);
router.put('/:id', updateHealthLogValidation, validate, updateHealthLog);
router.delete('/:id', deleteHealthLog);

module.exports = router;