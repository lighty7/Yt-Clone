const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/database');
const User = require('../models/User');
const LoginLog = require('../models/loginLogs');
const auth = require('../middleware/auth');
const { sendVerificationEmail, sendWelcomeEmail, testEmailConnection } = require('../services/emailService');
const { generateVerificationToken, generateVerificationTokenExpires, isVerificationTokenExpired } = require('../utils/tokenUtils');
const { validateSignup, validateLogin, validateResendVerification, sanitizeInput } = require('../middleware/validation');

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @route   POST /api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', sanitizeInput, validateSignup, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email address' 
      });
    }

    // Hash password with error handling
    let hashedPassword;
    try {
      const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
      hashedPassword = await bcrypt.hash(password, salt);
    } catch (hashError) {
      console.error('Password hashing error:', hashError);
      return res.status(500).json({ 
        success: false,
        message: 'Error processing password' 
      });
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = generateVerificationTokenExpires();

    // Create user with transaction for data consistency
    const transaction = await sequelize.transaction();
    
    try {
      const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires,
      }, { transaction });

      await transaction.commit();

      // Send verification email (non-blocking)
      sendVerificationEmail(email, name, verificationToken)
        .then(result => {
          if (!result.success) {
            console.error('Failed to send verification email:', result.error);
          }
        })
        .catch(emailError => {
          console.error('Email sending error:', emailError);
        });

      res.status(201).json({
        success: true,
        message: 'User created successfully. Please check your email to verify your account.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
        },
      });
    } catch (createError) {
      await transaction.rollback();
      throw createError;
    }
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific database errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email address' 
      });
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user data provided',
        errors: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Internal server error. Please try again later.' 
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(400).json({ 
        message: 'Please verify your email before logging in. Check your email for verification link.' 
      });
    }

    // Log login attempt
    try {
      await LoginLog.create({
        user_id: user.id,
        loginTime: new Date(),
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown',
      });
    } catch (logError) {
      console.error('Failed to log login attempt:', logError);
      // Continue with login even if logging fails
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/verify-email
// @desc    Verify user email
// @access  Public
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    // Find user with verification token
    const user = await User.findOne({ 
      where: { verificationToken: token } 
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    // Check if token is expired
    if (isVerificationTokenExpired(user.verificationTokenExpires)) {
      return res.status(400).json({ message: 'Verification token has expired' });
    }

    // Update user as verified
    await user.update({
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue even if welcome email fails
    }

    res.json({
      message: 'Email verified successfully! You can now log in.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/resend-verification
// @desc    Resend verification email
// @access  Public
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = generateVerificationTokenExpires();

    // Update user with new token
    await user.update({
      verificationToken,
      verificationTokenExpires,
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(email, user.name, verificationToken);
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    res.json({
      message: 'Verification email sent successfully. Please check your email.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  res.json({
    user: req.user,
  });
});

module.exports = router;
