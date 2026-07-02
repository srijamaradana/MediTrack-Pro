const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { isDoctor } = require('../middleware/roleCheck');
const { upload, handleUploadError } = require('../middleware/upload');
const {
  getReports,
  getReportById,
  uploadReport,
  deleteReport,
  shareReport,
  reviewReport,
} = require('../controllers/reportController');

// Validation rules
const uploadReportValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('type').isIn(['Lab Report', 'Radiology', 'Prescription', 'Surgery Report', 'Discharge Summary', 'Vaccination Record', 'Health Checkup', 'Medical Certificate', 'Insurance Document', 'Other'])
    .withMessage('Invalid report type'),
  body('description').optional().isString(),
  body('tags').optional().isString(),
  body('doctorId').optional().isMongoId().withMessage('Invalid doctor ID'),
];

const shareReportValidation = [
  body('doctorId').isMongoId().withMessage('Valid doctor ID is required'),
  body('permission').optional().isIn(['view', 'edit', 'comment']).withMessage('Invalid permission type'),
];

const reviewReportValidation = [
  body('reviewNotes').notEmpty().withMessage('Review notes are required'),
];

// All routes require authentication
router.use(protect);

// Main routes
router.get('/', getReports);
router.post(
  '/',
  upload.single('file'),
  handleUploadError,
  uploadReportValidation,
  validate,
  uploadReport
);

// Individual report routes
router.get('/:id', getReportById);
router.delete('/:id', deleteReport);
router.post('/:id/share', shareReportValidation, validate, shareReport);

// Doctor only routes
router.put('/:id/review', isDoctor, reviewReportValidation, validate, reviewReport);

module.exports = router;