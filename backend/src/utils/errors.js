/**
 * Custom Error Classes
 * Provides structured error handling with proper HTTP status codes
 */

/**
 * Base application error class
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
    
    // Set error name
    this.name = this.constructor.name;
    
    // Add timestamp
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Authentication related errors
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
  }
}

class TokenExpiredError extends AppError {
  constructor(message = 'Token has expired') {
    super(message, 401);
  }
}

class InvalidTokenError extends AppError {
  constructor(message = 'Invalid token') {
    super(message, 401);
  }
}

/**
 * Validation related errors
 */
class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

class DuplicateError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

/**
 * Resource related errors
 */
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}

class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429);
  }
}

/**
 * External service errors
 */
class ExternalServiceError extends AppError {
  constructor(service, message = 'External service error') {
    super(`${service}: ${message}`, 502);
    this.service = service;
  }
}

class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, 500);
  }
}

class EmailServiceError extends ExternalServiceError {
  constructor(message = 'Email service error') {
    super('EmailService', message);
  }
}

/**
 * Business logic errors
 */
class BusinessLogicError extends AppError {
  constructor(message = 'Business logic error') {
    super(message, 422);
  }
}

class InsufficientPermissionsError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
  }
}

/**
 * Rate limiting error
 */
class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded', retryAfter = 60) {
    super(message, 429);
    this.retryAfter = retryAfter;
  }
}

/**
 * File upload errors
 */
class FileUploadError extends AppError {
  constructor(message = 'File upload failed') {
    super(message, 400);
  }
}

class FileSizeError extends FileUploadError {
  constructor(maxSize) {
    super(`File size exceeds maximum allowed size of ${maxSize}`);
  }
}

class FileTypeError extends FileUploadError {
  constructor(allowedTypes) {
    super(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
}

/**
 * Error factory functions
 */
const createError = {
  authentication: (message) => new AuthenticationError(message),
  authorization: (message) => new AuthorizationError(message),
  validation: (message, errors) => new ValidationError(message, errors),
  notFound: (message) => new NotFoundError(message),
  conflict: (message) => new ConflictError(message),
  duplicate: (message) => new DuplicateError(message),
  database: (message) => new DatabaseError(message),
  externalService: (service, message) => new ExternalServiceError(service, message),
  emailService: (message) => new EmailServiceError(message),
  businessLogic: (message) => new BusinessLogicError(message),
  rateLimit: (message, retryAfter) => new RateLimitError(message, retryAfter),
  fileUpload: (message) => new FileUploadError(message),
  fileSize: (maxSize) => new FileSizeError(maxSize),
  fileType: (allowedTypes) => new FileTypeError(allowedTypes)
};

/**
 * Check if error is operational (expected) or programming error
 * @param {Error} error - Error to check
 * @returns {boolean} True if operational error
 */
const isOperationalError = (error) => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
};

/**
 * Get error response object for client
 * @param {Error} error - Error object
 * @param {boolean} includeStack - Whether to include stack trace
 * @returns {Object} Error response object
 */
const getErrorResponse = (error, includeStack = false) => {
  const response = {
    success: false,
    message: error.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  };

  // Add status code if available
  if (error.statusCode) {
    response.statusCode = error.statusCode;
  }

  // Add errors array for validation errors
  if (error.errors && Array.isArray(error.errors)) {
    response.errors = error.errors;
  }

  // Add service name for external service errors
  if (error.service) {
    response.service = error.service;
  }

  // Add retry after for rate limit errors
  if (error.retryAfter) {
    response.retryAfter = error.retryAfter;
  }

  // Add stack trace in development
  if (includeStack && error.stack) {
    response.stack = error.stack;
  }

  return response;
};

/**
 * Log error with appropriate level
 * @param {Error} error - Error to log
 * @param {Object} context - Additional context
 */
const logError = (error, context = {}) => {
  const errorInfo = {
    name: error.name,
    message: error.message,
    statusCode: error.statusCode || 500,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...context
  };

  if (isOperationalError(error)) {
    console.warn('Operational Error:', errorInfo);
  } else {
    console.error('Programming Error:', errorInfo);
  }
};

module.exports = {
  // Error classes
  AppError,
  AuthenticationError,
  AuthorizationError,
  TokenExpiredError,
  InvalidTokenError,
  ValidationError,
  DuplicateError,
  NotFoundError,
  ConflictError,
  TooManyRequestsError,
  ExternalServiceError,
  DatabaseError,
  EmailServiceError,
  BusinessLogicError,
  InsufficientPermissionsError,
  RateLimitError,
  FileUploadError,
  FileSizeError,
  FileTypeError,
  
  // Factory functions
  createError,
  
  // Utility functions
  isOperationalError,
  getErrorResponse,
  logError
};
