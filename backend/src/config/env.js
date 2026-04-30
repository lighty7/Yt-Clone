require('dotenv').config();

/**
 * Environment Configuration with Validation
 * Validates required environment variables and provides defaults
 */

// Validation schema for environment variables
const validateEnv = () => {
  const errors = [];
  const warnings = [];

  // Required variables for production
  const requiredInProduction = [
    'DATABASE_URL',
    'JWT_SECRET',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASS'
  ];

  // Check required variables in production
  if (process.env.NODE_ENV === 'production') {
    requiredInProduction.forEach(varName => {
      if (!process.env[varName]) {
        errors.push(`Missing required environment variable: ${varName}`);
      }
    });
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    warnings.push('JWT_SECRET should be at least 32 characters long for security');
  }

  // Validate DATABASE_URL format
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgres')) {
    errors.push('DATABASE_URL must start with postgres:// or postgresql://');
  }

  // Validate PORT
  const port = parseInt(process.env.PORT || '3000', 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    errors.push('PORT must be a valid number between 1 and 65535');
  }

  // Validate SMTP_PORT
  if (process.env.SMTP_PORT) {
    const smtpPort = parseInt(process.env.SMTP_PORT, 10);
    if (isNaN(smtpPort) || smtpPort < 1 || smtpPort > 65535) {
      errors.push('SMTP_PORT must be a valid number between 1 and 65535');
    }
  }

  // Log warnings
  warnings.forEach(warning => console.warn(`⚠️ ${warning}`));

  // Throw errors
  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach(error => console.error(`   - ${error}`));
    throw new Error('Environment validation failed');
  }

  console.log('✅ Environment validation passed');
};

// Run validation
try {
  validateEnv();
} catch (error) {
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  } else {
    console.warn('⚠️ Environment validation failed in development mode');
  }
}

// Environment configuration
const env = {
  // Application settings
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Database configuration
  databaseUrl: process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRESQL_URL,

  // Supabase configuration (optional)
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // Authentication
  jwtSecret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'development' ? 'dev-secret-change-in-production' : ''),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Email configuration
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || 'no-reply@example.com',
  },

  // CORS configuration
  cors: {
    productionOrigins: process.env.PRODUCTION_ORIGINS ? process.env.PRODUCTION_ORIGINS.split(',').map(origin => origin.trim()) : [],
    developmentOrigins: process.env.DEVELOPMENT_ORIGINS ? process.env.DEVELOPMENT_ORIGINS.split(',').map(origin => origin.trim()) : [],
  },

  // Security
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // limit each IP to 100 requests per windowMs
  },

  // Development helpers
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

// Log configuration in development
if (env.isDevelopment && !env.isTest) {
  console.log('🔧 Environment Configuration:');
  console.log(`   - NODE_ENV: ${env.nodeEnv}`);
  console.log(`   - PORT: ${env.port}`);
  console.log(`   - FRONTEND_URL: ${env.frontendUrl}`);
  console.log(`   - DATABASE_URL: ${env.databaseUrl ? '✅ Set' : '❌ Not set'}`);
  console.log(`   - JWT_SECRET: ${env.jwtSecret ? '✅ Set' : '❌ Not set'}`);
  console.log(`   - SMTP: ${env.smtp.host ? '✅ Configured' : '❌ Not configured'}`);
}

module.exports = env;


