const { body, validationResult } = require('express-validator');

// Common validation rules
const commonValidators = {
  // ID validation
  id: (field = 'id') => body(field).isMongoId().withMessage(`Invalid ${field}`),
  
  // Email validation
  email: () => body('email').isEmail().withMessage('Please provide a valid email address'),
  
  // Password validation
  password: () => body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  
  // Name validation
  name: () => body('name').isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  // Phone validation
  phone: () => body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  
  // Date validation
  date: (field = 'date') => body(field).isISO8601().withMessage('Invalid date format'),
  
  // Time validation (HH:MM)
  time: (field = 'time') => body(field).matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format (HH:MM)'),
  
  // URL validation
  url: (field) => body(field).isURL().withMessage('Invalid URL format'),
  
  // Enum validation
  enum: (field, values) => body(field).isIn(values).withMessage(`Invalid ${field}. Allowed values: ${values.join(', ')}`),
  
  // Array validation
  array: (field) => body(field).isArray().withMessage(`${field} must be an array`),
  
  // Number validation
  number: (field, min, max) => {
    let validator = body(field).isNumeric().withMessage(`${field} must be a number`);
    if (min !== undefined) validator = validator.isInt({ min });
    if (max !== undefined) validator = validator.isInt({ max });
    return validator;
  },
  
  // String validation
  string: (field, min = 0, max = 1000) => 
    body(field).isString().isLength({ min, max }).withMessage(`${field} must be between ${min} and ${max} characters`),
  
  // Boolean validation
  boolean: (field) => body(field).isBoolean().withMessage(`${field} must be a boolean value`),
};

// Custom validation helpers
const validators = {
  // Validate blood group
  bloodGroup: () => body('bloodGroup')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood group'),
  
  // Validate gender
  gender: () => body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer-not-to-say'])
    .withMessage('Invalid gender'),
  
  // Validate role
  role: () => body('role')
    .optional()
    .isIn(['patient', 'doctor', 'admin'])
    .withMessage('Invalid role'),
  
  // Validate appointment type
  appointmentType: () => body('type')
    .optional()
    .isIn(['consultation', 'follow-up', 'emergency', 'checkup', 'procedure', 'telemedicine'])
    .withMessage('Invalid appointment type'),
  
  // Validate medication frequency
  medicationFrequency: () => body('frequency')
    .isIn([
      'Once daily', 'Twice daily', 'Three times daily', 'Four times daily',
      'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours',
      'As needed', 'Weekly', 'Monthly'
    ])
    .withMessage('Invalid frequency'),
  
  // Validate report type
  reportType: () => body('type')
    .isIn([
      'Lab Report', 'Radiology', 'Prescription', 'Surgery Report',
      'Discharge Summary', 'Vaccination Record', 'Health Checkup',
      'Medical Certificate', 'Insurance Document', 'Other'
    ])
    .withMessage('Invalid report type'),
  
  // Validate doctor specialization
  specialization: () => body('specialization')
    .optional()
    .isIn([
      'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
      'Hematology', 'Infectious Disease', 'Nephrology', 'Neurology',
      'Obstetrics & Gynecology', 'Oncology', 'Ophthalmology', 'Orthopedics',
      'Otolaryngology (ENT)', 'Pediatrics', 'Psychiatry', 'Pulmonology',
      'Radiology', 'Rheumatology', 'Surgery', 'Urology', 'General Medicine',
      'Family Medicine', 'Emergency Medicine', 'Anesthesiology', 'Pathology'
    ])
    .withMessage('Invalid specialization'),
  
  // Validate mood
  mood: () => body('mood')
    .optional()
    .isIn(['happy', 'neutral', 'sad', 'anxious', 'stressed', 'energetic', 'tired', 'depressed'])
    .withMessage('Invalid mood'),
  
  // Validate sleep quality
  sleepQuality: () => body('sleep.quality')
    .optional()
    .isIn(['excellent', 'good', 'fair', 'poor', 'very-poor'])
    .withMessage('Invalid sleep quality'),
  
  // Validate exercise type
  exerciseType: () => body('exercise.type')
    .optional()
    .isIn(['cardiovascular', 'strength', 'flexibility', 'balance', 'none'])
    .withMessage('Invalid exercise type'),
};

// Combine common validators with custom validators
const allValidators = { ...commonValidators, ...validators };

// Validation result handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().forEach((err) => {
    extractedErrors.push({
      field: err.path,
      message: err.msg,
    });
  });

  return res.status(400).json({
    success: false,
    message: 'Validation Error',
    errors: extractedErrors,
  });
};

// Sanitization helpers
const sanitizers = {
  // Trim string
  trim: (field) => body(field).trim().escape(),
  
  // Normalize email
  normalizeEmail: () => body('email').normalizeEmail(),
  
  // Convert to lowercase
  toLowerCase: (field) => body(field).toLowerCase(),
  
  // Convert to uppercase
  toUpperCase: (field) => body(field).toUpperCase(),
};

// Validation chains for common operations
const validationChains = {
  // User registration validation chain
  register: [
    allValidators.name(),
    allValidators.email(),
    allValidators.password(),
    validators.role(),
    allValidators.phone().optional(),
    sanitizers.trim('name'),
    sanitizers.normalizeEmail(),
  ],
  
  // Login validation chain
  login: [
    allValidators.email(),
    body('password').notEmpty().withMessage('Password is required'),
    sanitizers.normalizeEmail(),
  ],
  
  // Appointment booking validation chain
  bookAppointment: [
    allValidators.id('doctorId'),
    allValidators.date('date'),
    allValidators.time('time'),
    validators.appointmentType(),
    allValidators.number('duration', 15, 120).optional(),
    allValidators.array('symptoms').optional(),
    allValidators.string('notes', 0, 500).optional(),
    allValidators.boolean('isVirtual').optional(),
  ],
  
  // Medication validation chain
  addMedication: [
    allValidators.string('name', 2, 100),
    allValidators.string('dosage', 1, 50),
    validators.medicationFrequency(),
    allValidators.array('times'),
    allValidators.date('startDate'),
    allValidators.date('endDate').optional(),
    allValidators.string('instructions', 0, 500).optional(),
    allValidators.id('prescribedBy').optional(),
  ],
  
  // Report upload validation chain
  uploadReport: [
    allValidators.string('title', 2, 100),
    validators.reportType(),
    allValidators.string('description', 0, 1000).optional(),
    allValidators.array('tags').optional(),
    allValidators.id('doctorId').optional(),
  ],
};

// Export all validators
module.exports = {
  commonValidators,
  validators: allValidators,
  validate,
  sanitizers,
  validationChains,
};