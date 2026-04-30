const rateLimit = require('express-rate-limit');
const env = require('../config/env');

function applyRateLimit(app) {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use(limiter);
}

function buildCorsOrigin() {
  if (env.nodeEnv === 'production') {
    // Allow multiple Vercel deployment patterns and custom frontend URL
    const productionOrigins = [
      'https://yt-clone-blond.vercel.app',
      'https://yt-clone-git-main-lighty7s-projects.vercel.app',
      'https://yt-clone-lighty7s-projects.vercel.app',
      'https://yt-clone-*.vercel.app', // Wildcard for Vercel deployments
      env.frontendUrl
    ].filter(Boolean);
    
    // If frontendUrl is set, add it to allowed origins
    if (env.frontendUrl && !productionOrigins.includes(env.frontendUrl)) {
      productionOrigins.push(env.frontendUrl);
    }
    
    return productionOrigins;
  }
  return [env.frontendUrl, 'http://localhost:3000','http://192.168.30.5:5174','http://192.168.30.5:5175'].filter(Boolean);
}

module.exports = { applyRateLimit, buildCorsOrigin };


