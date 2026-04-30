const { 
  AppError, 
  isOperationalError, 
  getErrorResponse, 
  logError,
  createError 
} = require('../utils/errors');
const env = require('../config/env');

/**
 * Global Error Handler Middleware
 * Handles all errors in the application with proper logging and response formatting
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error with context
  logError(err, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Handle specific error types
  if (err.name === 'CastError') {
    error = createError.notFound('Resource not found');
  }

  // Prisma unique constraint error
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    error = createError.duplicate(`${field} already exists`);
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    error = createError.notFound('Record not found');
  }

  // Prisma connection error
  if (err.code === 'P1001') {
    error = createError.database('Database connection failed');
  }

  // Prisma table not found
  if (err.code === 'P2021') {
    error = createError.database('Database table not found');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = createError.authentication('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = createError.authentication('Token has expired');
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message
    }));
    error = createError.validation('Validation failed', errors);
  }

  // Rate limiting errors
  if (err.status === 429) {
    error = createError.rateLimit('Too many requests, please try again later');
  }

  // Ensure error is an AppError instance
  if (!(error instanceof AppError)) {
    // For programming errors, don't leak error details in production
    if (!isOperationalError(error)) {
      if (env.isProduction) {
        error = createError.notFound('Something went wrong');
      } else {
        error = new AppError(err.message, err.statusCode || 500, false);
      }
    } else {
      error = new AppError(error.message, error.statusCode || 500, true);
    }
  }

  // Get error response
  const errorResponse = getErrorResponse(error, !env.isProduction);

  // Set status code
  res.status(error.statusCode || 500);

  // Send error response
  res.json(errorResponse);
};

/**
 * Handle 404 errors for undefined routes
 */
const notFoundHandler = (req, res, next) => {
  const error = createError.notFound(`Route ${req.originalUrl} not found`);
  next(error);
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors and pass them to error handler
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handle unhandled promise rejections
 */
const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Exit the process
    process.exit(1);
  });
};

/**
 * Handle uncaught exceptions
 */
const handleUncaughtException = () => {
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Exit the process
    process.exit(1);
  });
};

/**
 * Initialize error handling
 */
const initErrorHandling = () => {
  handleUnhandledRejection();
  handleUncaughtException();
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  initErrorHandling
};


