const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { prisma } = require('../config/prisma');
const { sendVerificationEmail } = require('../services/emailService');
const env = require('../config/env');

/**
 * Authentication Controller
 * Handles all authentication-related business logic
 */

class AuthController {
  /**
   * Generate JWT token for user
   * @param {number|BigInt} userId - User ID
   * @returns {string} JWT token
   */
  static generateToken(userId) {
    // Convert BigInt to string for JWT serialization
    const userIdStr = userId.toString();
    return jwt.sign({ userId: userIdStr }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn
    });
  }

  /**
   * Get user data without sensitive information
   * @param {Object} user - User object from database
   * @returns {Object} Sanitized user data
   */
  static sanitizeUser(user) {
    const { password, verificationToken, verificationTokenExpires, resetPasswordToken, resetPasswordExpires, ...userData } = user;

    // Convert BigInt to string for JSON serialization
    if (userData.id && typeof userData.id === 'bigint') {
      userData.id = userData.id.toString();
    }

    // Convert Date objects to ISO strings
    if (userData.createdAt && userData.createdAt instanceof Date) {
      userData.createdAt = userData.createdAt.toISOString();
    }

    if (userData.updatedAt && userData.updatedAt instanceof Date) {
      userData.updatedAt = userData.updatedAt.toISOString();
    }

    return userData;
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result
   */
  static validatePassword(password) {
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    }

    if (password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters long' };
    }

    return { isValid: true };
  }

  /**
   * Handle user signup
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async signup(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required'
        });
      }

      // Validate email format
      if (!AuthController.isValidEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Validate password
      const passwordValidation = AuthController.validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: passwordValidation.message
        });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create user
      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          verificationToken,
          verificationTokenExpires,
          isVerified: false
        },
        select: {
          id: true,
          name: true,
          email: true,
          isVerified: true,
          createdAt: true
        }
      });

      // Send verification email (don't fail signup if email fails)
      try {
        await sendVerificationEmail(email, verificationToken, name);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Continue with signup even if email fails
      }

      // Generate token
      const token = AuthController.generateToken(user.id);

      res.status(201).json({
        success: true,
        message: 'User created successfully. Please check your email to verify your account.',
        user,
        token
      });

    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error details:', error.message, error.stack);
      res.status(500).json({
        success: false,
        message: 'An error occurred during signup',
        error: error.message
      });
    }
  }

  /**
   * Handle user login
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Validate email format
      if (!AuthController.isValidEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Generate token
      const token = AuthController.generateToken(user.id);

      // Return user data (excluding password)
      const userData = AuthController.sanitizeUser(user);

      res.json({
        success: true,
        message: 'Login successful',
        user: userData,
        token
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred during login'
      });
    }
  }

  /**
   * Handle getting current user info
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getCurrentUser(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, env.jwtSecret);
      } catch (jwtError) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      // Find user (convert string back to BigInt for Prisma)
      const user = await prisma.user.findUnique({
        where: { id: BigInt(decoded.userId) },
        select: {
          id: true,
          name: true,
          email: true,
          isVerified: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user
      });

    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching user data'
      });
    }
  }

  /**
   * Handle email verification
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async verifyEmail(req, res) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Verification token is required'
        });
      }

      // Find user with valid token
      const user = await prisma.user.findFirst({
        where: {
          verificationToken: token,
          verificationTokenExpires: {
            gt: new Date()
          }
        }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification token'
        });
      }

      // Update user as verified
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          verificationToken: null,
          verificationTokenExpires: null
        }
      });

      res.json({
        success: true,
        message: 'Email verified successfully'
      });

    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred during email verification'
      });
    }
  }

  /**
   * Handle password reset request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      if (!AuthController.isValidEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() }
      });

      if (!user) {
        // Don't reveal if email exists or not
        return res.json({
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent'
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Update user with reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpires
        }
      });

      // Send reset email (implement this in email service)
      try {
        // await sendPasswordResetEmail(email, resetToken, user.name);
        console.log(`Password reset token for ${email}: ${resetToken}`);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
      }

      res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while processing your request'
      });
    }
  }
}

module.exports = AuthController;
