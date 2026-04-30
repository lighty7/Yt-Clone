const Joi = require('joi');

/**
 * Authentication Validation Schemas
 * Using Joi for input validation and sanitization
 */

// Common validation rules
const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .lowercase()
  .trim()
  .required()
  .messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty'
  });

const passwordSchema = Joi.string()
  .min(6)
  .max(128)
  .required()
  .messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password cannot exceed 128 characters',
    'any.required': 'Password is required',
    'string.empty': 'Password cannot be empty'
  });

const nameSchema = Joi.string()
  .min(2)
  .max(50)
  .trim()
  .pattern(/^[a-zA-Z\s]+$/)
  .required()
  .messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters',
    'string.pattern.base': 'Name can only contain letters and spaces',
    'any.required': 'Name is required',
    'string.empty': 'Name cannot be empty'
  });

// Signup validation schema
const signupSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema
});

// Login validation schema
const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema
});

// Email verification schema
const verifyEmailSchema = Joi.object({
  token: Joi.string()
    .length(64)
    .pattern(/^[a-f0-9]+$/)
    .required()
    .messages({
      'string.length': 'Verification token must be 64 characters long',
      'string.pattern.base': 'Verification token must be a valid hex string',
      'any.required': 'Verification token is required'
    })
});

// Forgot password schema
const forgotPasswordSchema = Joi.object({
  email: emailSchema
});

// Reset password schema
const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .length(64)
    .pattern(/^[a-f0-9]+$/)
    .required()
    .messages({
      'string.length': 'Reset token must be 64 characters long',
      'string.pattern.base': 'Reset token must be a valid hex string',
      'any.required': 'Reset token is required'
    }),
  password: passwordSchema,
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required'
    })
});

// Validation middleware factory
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all validation errors
      stripUnknown: true, // Remove unknown fields
      convert: true // Convert types (e.g., string to number)
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Export validation middleware
module.exports = {
  validateSignup: validateRequest(signupSchema),
  validateLogin: validateRequest(loginSchema),
  validateVerifyEmail: validateRequest(verifyEmailSchema),
  validateForgotPassword: validateRequest(forgotPasswordSchema),
  validateResetPassword: validateRequest(resetPasswordSchema),
  
  // Export schemas for testing
  schemas: {
    signup: signupSchema,
    login: loginSchema,
    verifyEmail: verifyEmailSchema,
    forgotPassword: forgotPasswordSchema,
    resetPassword: resetPasswordSchema
  }
};
