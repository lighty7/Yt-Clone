const express = require('express');
const AuthController = require('../controllers/auth.controller');
const asyncHandler = require('../utils/asyncHandler');
const {
  validateSignup,
  validateLogin,
  validateVerifyEmail,
  validateForgotPassword
} = require('../validators/auth.validator');
const { sanitizeInput } = require('../middleware/validation');

const router = express.Router();

/**
 * Authentication Routes
 * All routes use validation, sanitization, and asyncHandler for consistent error handling
 */

// POST /api/auth/signup
router.post('/signup',
  sanitizeInput,
  validateSignup,
  asyncHandler(AuthController.signup)
);

// POST /api/auth/login
router.post('/login',
  sanitizeInput,
  validateLogin,
  asyncHandler(AuthController.login)
);

// GET /api/auth/me
router.get('/me', asyncHandler(AuthController.getCurrentUser));

// POST /api/auth/verify-email
router.post('/verify-email',
  sanitizeInput,
  validateVerifyEmail,
  asyncHandler(AuthController.verifyEmail)
);

// POST /api/auth/forgot-password
router.post('/forgot-password',
  sanitizeInput,
  validateForgotPassword,
  asyncHandler(AuthController.forgotPassword)
);

module.exports = router;
