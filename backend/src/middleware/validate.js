const { validationResult } = require('express-validator');

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

module.exports = { validate };