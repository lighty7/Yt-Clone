// Environment configuration for different deployment environments

const getEnvironmentConfig = () => {
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  
  // Development configuration
  if (isDevelopment) {
    return {
      API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      APP_NAME: 'YouTube Clone (Dev)',
      VERSION: '1.0.0-dev',
      DEBUG: true,
      LOG_LEVEL: 'debug'
    };
  }
  
  // Production configuration
  if (isProduction) {
    return {
      API_URL: import.meta.env.VITE_API_URL || 'https://yt-clone-il3g.onrender.com',
      APP_NAME: 'YouTube Clone',
      VERSION: '1.0.0',
      DEBUG: false,
      LOG_LEVEL: 'error'
    };
  }
  
  // Fallback configuration
  return {
    API_URL: 'https://yt-clone-il3g.onrender.com',
    APP_NAME: 'YouTube Clone',
    VERSION: '1.0.0',
    DEBUG: false,
    LOG_LEVEL: 'error'
  };
};

export const config = getEnvironmentConfig();

// Helper function to get API URL with proper protocol
export const getApiUrl = () => {
  return config.API_URL;
};

// Helper function to check if we're in development
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

// Helper function to check if we're in production
export const isProduction = () => {
  return import.meta.env.PROD;
};

// Log configuration (only in development)
if (isDevelopment()) {
  console.log('🔧 Environment Configuration:', config);
}
