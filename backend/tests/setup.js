// Test setup file
const { sequelize } = require('../config/database');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '1h';

// Global test timeout
jest.setTimeout(10000);

// Setup and teardown
beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Test database connected');
  } catch (error) {
    console.error('❌ Test database connection failed:', error);
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
    console.log('✅ Test database connection closed');
  } catch (error) {
    console.error('❌ Error closing test database:', error);
  }
});
