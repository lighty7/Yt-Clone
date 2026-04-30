const cors = require('cors');

/**
 * CORS Configuration
 * Handles cross-origin requests based on environment
 */

// Get allowed origins from environment
const getAllowedOrigins = () => {
  const allowedOrigins = [];
  
  // Production origins
  if (process.env.PRODUCTION_ORIGINS) {
    allowedOrigins.push(...process.env.PRODUCTION_ORIGINS.split(',').map(origin => origin.trim()));
  }
  
  // Development origins
  if (process.env.DEVELOPMENT_ORIGINS) {
    allowedOrigins.push(...process.env.DEVELOPMENT_ORIGINS.split(',').map(origin => origin.trim()));
  }
  
  return allowedOrigins;
};

// Check if origin is allowed in development
const isDevelopmentOrigin = (origin) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!origin) return false;
    
    return (
      origin.startsWith('http://localhost') ||
      origin.startsWith('https://localhost') ||
      origin.includes('127.0.0.1') ||
      /^https?:\/\/192\.168\.30\.\d+/.test(origin)
    );
  }
  return false;
};

// Check if origin is allowed in production
const isProductionOrigin = (origin) => {
  if (process.env.NODE_ENV !== 'production') {
    return false;
  }

  const allowedOrigins = [
    'https://yt-clone-blond.vercel.app',
    'https://www.yt-clone-blond.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean);

  // Check exact matches
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  // Check Vercel deployment patterns
  if (origin && origin.includes('.vercel.app')) {
    return true;
  }

  // Check custom origins from environment
  const customOrigins = getAllowedOrigins();
  return customOrigins.includes(origin);
};

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }

    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    // Development mode: Allow localhost origins
    if (isDevelopment && isDevelopmentOrigin(origin)) {
      console.log(`✅ CORS allowed origin (development): ${origin}`);
      return callback(null, true);
    }

    // Production mode: Check allowed origins
    if (process.env.NODE_ENV === 'production' && isProductionOrigin(origin)) {
      console.log(`✅ CORS allowed origin (production): ${origin}`);
      return callback(null, true);
    }

    // Log blocked origins
    console.log(`🔒 CORS blocked origin: ${origin}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📋 Frontend URL: ${process.env.FRONTEND_URL || 'not set'}`);
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'X-API-Key'
  ],
  exposedHeaders: ['Authorization', 'X-Total-Count'],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  maxAge: 86400, // 24 hours
  preflightContinue: false // Let CORS handle preflight requests
};

// Create CORS middleware
const corsMiddleware = cors(corsOptions);

// Helper function to test CORS configuration
const testCorsOrigin = (origin) => {
  return new Promise((resolve) => {
    corsOptions.origin(origin, (err, result) => {
      resolve({ allowed: !err, error: err?.message });
    });
  });
};

module.exports = {
  corsMiddleware,
  corsOptions,
  testCorsOrigin,
  isDevelopmentOrigin,
  isProductionOrigin,
  getAllowedOrigins
};
