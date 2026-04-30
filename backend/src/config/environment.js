// Environment configuration for different deployment environments

const getEnvironmentConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Development configuration
  if (isDevelopment) {
    return {
      NODE_ENV: 'development',
      PORT: process.env.PORT || 3000,
      DB_HOST: process.env.DB_HOST || 'localhost',
      DB_PORT: process.env.DB_PORT || 5432,
      DB_NAME: process.env.DB_NAME || 'yt_clone_dev',
      DB_USER: process.env.DB_USER || 'postgres',
      DB_PASSWORD: process.env.DB_PASSWORD || 'password',
      DB_SSL: process.env.DB_SSL === 'true',
      JWT_SECRET: process.env.JWT_SECRET || 'dev-jwt-secret-key-change-in-production',
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
      FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
      SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
      SMTP_PORT: parseInt(process.env.SMTP_PORT) || 587,
      SMTP_SECURE: process.env.SMTP_SECURE === 'true',
      SMTP_USER: process.env.SMTP_USER || '',
      SMTP_PASS: process.env.SMTP_PASS || '',
      VERIFICATION_TOKEN_EXPIRES_IN: process.env.VERIFICATION_TOKEN_EXPIRES_IN || '24h',
      DEBUG: true,
      LOG_LEVEL: 'debug'
    };
  }
  
  // Production configuration
  if (isProduction) {
    return {
      NODE_ENV: 'production',
      PORT: process.env.PORT || 3000,
      DB_HOST: process.env.DB_HOST,
      DB_PORT: parseInt(process.env.DB_PORT) || 5432,
      DB_NAME: process.env.DB_NAME,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_SSL: process.env.DB_SSL === 'true',
      JWT_SECRET: process.env.JWT_SECRET,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
      FRONTEND_URL: process.env.FRONTEND_URL || 'https://yt-clone-blond.vercel.app',
      SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
      SMTP_PORT: parseInt(process.env.SMTP_PORT) || 587,
      SMTP_SECURE: process.env.SMTP_SECURE === 'true',
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      VERIFICATION_TOKEN_EXPIRES_IN: process.env.VERIFICATION_TOKEN_EXPIRES_IN || '24h',
      DEBUG: false,
      LOG_LEVEL: 'error'
    };
  }
  
  // Fallback configuration
  return {
    NODE_ENV: 'development',
    PORT: 3000,
    DB_HOST: 'localhost',
    DB_PORT: 5432,
    DB_NAME: 'yt_clone',
    DB_USER: 'postgres',
    DB_PASSWORD: 'password',
    DB_SSL: false,
    JWT_SECRET: 'fallback-jwt-secret',
    JWT_EXPIRES_IN: '7d',
    FRONTEND_URL: 'https://yt-clone-blond.vercel.app',
    SMTP_HOST: 'smtp.gmail.com',
    SMTP_PORT: 587,
    SMTP_SECURE: false,
    SMTP_USER: '',
    SMTP_PASS: '',
    VERIFICATION_TOKEN_EXPIRES_IN: '24h',
    DEBUG: false,
    LOG_LEVEL: 'error'
  };
};

const config = getEnvironmentConfig();

// Validate required environment variables
const validateConfig = () => {
  const requiredVars = [];
  
  if (config.NODE_ENV === 'production') {
    requiredVars.push(
      'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD',
      'JWT_SECRET', 'SMTP_USER', 'SMTP_PASS'
    );
  }
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
  
  return missing.length === 0;
};

// Log configuration (only in development)
if (config.DEBUG) {
  console.log('🔧 Backend Environment Configuration:', {
    NODE_ENV: config.NODE_ENV,
    PORT: config.PORT,
    FRONTEND_URL: config.FRONTEND_URL,
    DB_HOST: config.DB_HOST,
    JWT_SECRET: config.JWT_SECRET ? '***' : 'NOT SET',
    SMTP_USER: config.SMTP_USER ? '***' : 'NOT SET'
  });
}

module.exports = {
  config,
  validateConfig,
  getEnvironmentConfig
};
