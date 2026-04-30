const Joi = require('joi');

/**
 * Validation Middleware
 * Generic validation utilities and middleware
 */

/**
 * Create validation middleware for any schema
 * @param {Object} schema - Joi schema to validate against
 * @param {string} source - Source of data to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];
    
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Return all validation errors
      stripUnknown: true, // Remove unknown fields
      convert: true, // Convert types (e.g., string to number)
      allowUnknown: source === 'query' // Allow unknown query parameters
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
        source
      });
    }

    // Replace the source data with validated and sanitized data
    req[source] = value;
    next();
  };
};

/**
 * Validate request body
 * @param {Object} schema - Joi schema
 * @returns {Function} Express middleware
 */
const validateBody = (schema) => validate(schema, 'body');

/**
 * Validate query parameters
 * @param {Object} schema - Joi schema
 * @returns {Function} Express middleware
 */
const validateQuery = (schema) => validate(schema, 'query');

/**
 * Validate route parameters
 * @param {Object} schema - Joi schema
 * @returns {Function} Express middleware
 */
const validateParams = (schema) => validate(schema, 'params');

/**
 * Sanitize HTML content to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeHtml = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitize middleware - removes potential XSS
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
const sanitizeInput = (req, res, next) => {
  // Sanitize string fields in body
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key]);
      }
    }
  }

  // Sanitize string fields in query
  if (req.query && typeof req.query === 'object') {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeHtml(req.query[key]);
      }
    }
  }

  next();
};

/**
 * Rate limiting validation - check if request is within limits
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
const validateRateLimit = (req, res, next) => {
  // This would integrate with your rate limiting middleware
  // For now, just pass through
  next();
};

/**
 * File upload validation
 * @param {Object} options - Validation options
 * @returns {Function} Express middleware
 */
const validateFileUpload = (options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
    required = false
  } = options;

  return (req, res, next) => {
    if (!req.file && !req.files) {
      if (required) {
        return res.status(400).json({
          success: false,
          message: 'File upload is required'
        });
      }
      return next();
    }

    const file = req.file || req.files[0];
    
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: `File size must be less than ${maxSize / (1024 * 1024)}MB`
      });
    }

    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `File type must be one of: ${allowedTypes.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Pagination validation
 */
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().valid('asc', 'desc').default('desc'),
  sortBy: Joi.string().alphanum().default('createdAt')
});

const validatePagination = validateQuery(paginationSchema);

module.exports = {
  validate,
  validateBody,
  validateQuery,
  validateParams,
  sanitizeInput,
  validateRateLimit,
  validateFileUpload,
  validatePagination,
  sanitizeHtml,
  paginationSchema
};
