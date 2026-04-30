// Test setup file
const { PrismaClient } = require('@prisma/client');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '1h';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';

// Global test timeout
jest.setTimeout(30000);

// Create a single shared Prisma client for all tests
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Setup and teardown
beforeAll(async () => {
  try {
    await prisma.$connect();
    console.log('✅ Test database connected');
  } catch (error) {
    console.error('❌ Test database connection failed:', error);
  }
});

afterAll(async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ Test database disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting from test database:', error);
  }
});

// Clean up test data after each test
afterEach(async () => {
  // Skip cleanup for basic tests to avoid prepared statement conflicts
  // Database tests can be added later with proper setup
});

// Export the shared Prisma client
module.exports = { prisma };
