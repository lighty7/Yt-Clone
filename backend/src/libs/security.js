const rateLimit = require('express-rate-limit');
const env = require('../config/env');

function applyRateLimit(app) {
  // General API limiter
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased to 1000 requests per 15 minutes
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  // stricter limiter for Auth routes
  const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 attempts per hour
    message: 'Too many authentication attempts, please try again after an hour.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/', apiLimiter);
  app.use('/api/auth/', authLimiter);
}

function buildCorsOrigin() {
  if (env.nodeEnv === 'production') {
    const productionOrigins = [
      'https://yt-clone-blond.vercel.app',
      'https://yt-clone-git-main-lighty7s-projects.vercel.app',
      'https://yt-clone-lighty7s-projects.vercel.app',
      'https://yt-clone-*.vercel.app',
      env.frontendUrl
    ].filter(Boolean);
    
    if (env.frontendUrl && !productionOrigins.includes(env.frontendUrl)) {
      productionOrigins.push(env.frontendUrl);
    }
    
    return productionOrigins;
  }
  return [env.frontendUrl, 'http://localhost:3000','http://192.168.30.5:5174','http://192.168.30.5:5175'].filter(Boolean);
}

module.exports = { applyRateLimit, buildCorsOrigin };
