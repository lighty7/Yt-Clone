const request = require('supertest');
const app = require('../index');
const { User } = require('../models/User');
const { sequelize } = require('../config/database');

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'TestPassword123'
};

const invalidUser = {
  name: 'A', // Too short
  email: 'invalid-email', // Invalid format
  password: '123' // Too short
};

describe('Authentication System', () => {
  beforeAll(async () => {
    // Clean up test database
    await User.destroy({ where: {}, force: true });
  });

  afterAll(async () => {
    // Clean up after tests
    await User.destroy({ where: {}, force: true });
    await sequelize.close();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('check your email');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.isVerified).toBe(false);
    });

    it('should reject signup with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'ValidPassword123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation failed');
    });

    it('should reject signup with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test2@example.com',
          password: '123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject signup with duplicate email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should reject signup with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User'
          // Missing email and password
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should sanitize input to prevent XSS', async () => {
      const maliciousUser = {
        name: '<script>alert("xss")</script>Test User',
        email: 'test3@example.com',
        password: 'ValidPassword123'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(maliciousUser)
        .expect(201);

      expect(response.body.user.name).not.toContain('<script>');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should reject login for unverified user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('verify your email');
    });

    it('should reject login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'WrongPassword123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should reject login with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email
          // Missing password
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/verify-email', () => {
    let verificationToken;

    beforeAll(async () => {
      // Get the verification token from the database
      const user = await User.findOne({ where: { email: testUser.email } });
      verificationToken = user.verificationToken;
    });

    it('should verify email with valid token', async () => {
      const response = await request(app)
        .get(`/api/auth/verify-email?token=${verificationToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('verified successfully');
    });

    it('should reject verification with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify-email?token=invalid-token')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid verification token');
    });

    it('should reject verification without token', async () => {
      const response = await request(app)
        .get('/api/auth/verify-email')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Verification token is required');
    });
  });

  describe('POST /api/auth/login (after verification)', () => {
    it('should allow login for verified user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.isVerified).toBe(true);
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken;

    beforeAll(async () => {
      // Login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      authToken = loginResponse.body.token;
    });

    it('should return user data with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('authorization denied');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Token is not valid');
    });
  });

  describe('POST /api/auth/resend-verification', () => {
    it('should resend verification for unverified user', async () => {
      // Create another unverified user
      await User.create({
        name: 'Unverified User',
        email: 'unverified@example.com',
        password: 'hashedpassword',
        verificationToken: 'some-token',
        verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });

      const response = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: 'unverified@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Verification email sent');
    });

    it('should reject resend for verified user', async () => {
      const response = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: testUser.email })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already verified');
    });

    it('should reject resend for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: 'nonexistent@example.com' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('User not found');
    });
  });
});
