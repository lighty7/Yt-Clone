const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const routes = require('./routes');
const { errorHandler, notFoundHandler, initErrorHandling } = require('./middleware/error');
const { applyRateLimit } = require('./libs/security');

const app = express();

// Security and limits
app.use(helmet());
applyRateLimit(app);

// Import CORS configuration
const { corsMiddleware } = require('./config/cors.config');

// Apply CORS middleware
app.use(corsMiddleware);

// Ensure CORS headers are always set, even on errors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma, X-API-Key');
  next();
});

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root and health
app.get('/', (req, res) => {
  res.json({ message: 'YT Clone API is running!', version: '1.0.0', status: 'healthy' });
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api', routes);

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize error handling
initErrorHandling();

module.exports = app;


