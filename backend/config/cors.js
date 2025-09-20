const cors = require('cors');

// Get allowed origins from environment variables
const getAllowedOrigins = () => {
  const allowedOrigins = [];
  
  // Add production origins
  if (process.env.PRODUCTION_ORIGINS) {
    allowedOrigins.push(...process.env.PRODUCTION_ORIGINS.split(','));
  }
  
  // Add development origins
  if (process.env.DEVELOPMENT_ORIGINS) {
    allowedOrigins.push(...process.env.DEVELOPMENT_ORIGINS.split(','));
  }
  
  return allowedOrigins;
};

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (process.env.NODE_ENV === "production") {
      // Production: Only allow specific domains
      const defaultProductionOrigins = [
        "https://yt-clone-blond.vercel.app",
        "https://www.yt-clone-blond.vercel.app"
      ];
      
      const allowedOrigins = [
        ...defaultProductionOrigins,
        ...getAllowedOrigins().filter(origin => 
          origin.includes('https://') || origin.includes('http://')
        )
      ];
      
      if (allowedOrigins.includes(origin)) {
        console.log(`✅ CORS allowed origin in production: ${origin}`);
        return callback(null, true);
      } else {
        console.log(`🔒 CORS blocked origin in production: ${origin}`);
        console.log(`📋 Allowed origins: ${allowedOrigins.join(', ')}`);
        return callback(new Error('Not allowed by CORS'));
      }
    } else {
      // Development: Allow localhost and local network IPs
      const allowedPatterns = [
        // Localhost patterns
        /^http:\/\/localhost:\d+$/,
        /^https:\/\/localhost:\d+$/,
        /^http:\/\/127\.0\.0\.1:\d+$/,
        /^https:\/\/127\.0\.0\.1:\d+$/,
        
        // Private network ranges
        /^http:\/\/192\.168\.\d+\.\d+:\d+$/,  // 192.168.x.x
        /^https:\/\/192\.168\.\d+\.\d+:\d+$/, // 192.168.x.x (HTTPS)
        /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,   // 10.x.x.x
        /^https:\/\/10\.\d+\.\d+\.\d+:\d+$/,  // 10.x.x.x (HTTPS)
        /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:\d+$/,  // 172.16-31.x.x
        /^https:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:\d+$/, // 172.16-31.x.x (HTTPS)
        
        // Custom development origins from environment
        ...(process.env.DEVELOPMENT_ORIGINS ? 
          process.env.DEVELOPMENT_ORIGINS.split(',').map(origin => 
            new RegExp('^' + origin.replace(/\*/g, '.*') + '$')
          ) : []
        )
      ];
      
      // Check if origin matches any allowed pattern
      const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));
      
      if (isAllowed) {
        console.log(`✅ CORS allowed origin: ${origin}`);
        return callback(null, true);
      } else {
        console.log(`🔒 CORS blocked origin: ${origin}`);
        console.log(`💡 Add this origin to DEVELOPMENT_ORIGINS in .env if needed`);
        return callback(new Error('Not allowed by CORS'));
      }
    }
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
};

// Create CORS middleware
const corsMiddleware = cors(corsOptions);

// Helper function to add custom origins at runtime
const addCustomOrigin = (origin) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`➕ Adding custom origin: ${origin}`);
    // This would require restarting the server to take effect
    // For dynamic origins, you'd need a more complex solution
  }
};

module.exports = {
  corsMiddleware,
  corsOptions,
  addCustomOrigin,
  getAllowedOrigins
};
