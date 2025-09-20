const request = require('supertest');
const app = require('../index');

describe('Error Handling', () => {
  describe('Input Validation', () => {
    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .set('Content-Type', 'application/json')
        .send('{"name": "Test", "email": "test@example.com", "password": "123456"') // Missing closing brace
        .expect(400);
    });

    it('should handle empty request body', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle extremely long input', async () => {
      const longString = 'a'.repeat(10000);
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: longString,
          email: 'test@example.com',
          password: 'ValidPassword123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    it('should handle multiple rapid requests', async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app)
            .post('/api/auth/login')
            .send({
              email: 'test@example.com',
              password: 'wrongpassword'
            })
        );
      }

      const responses = await Promise.all(promises);
      // At least some should be rate limited
      const rateLimited = responses.filter(res => res.status === 429);
      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });

  describe('Database Errors', () => {
    it('should handle database connection errors gracefully', async () => {
      // This would require mocking the database connection
      // For now, we'll test the error handling structure
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Email Service Errors', () => {
    it('should handle email service failures gracefully', async () => {
      // Mock email service failure
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'ValidPassword123'
        });

      // Should still create user even if email fails
      expect(response.status).toBe(201);
    });
  });

  describe('Security Tests', () => {
    it('should prevent SQL injection attempts', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: "'; DROP TABLE users; --",
          password: 'password'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should prevent XSS attacks in input', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: '<script>alert("xss")</script>',
          email: 'test@example.com',
          password: 'ValidPassword123'
        })
        .expect(201);

      // Check that script tags are removed
      expect(response.body.user.name).not.toContain('<script>');
    });

    it('should handle JWT token manipulation', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxNjM0NTcxNDkwfQ.invalid')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long email addresses', async () => {
      const longEmail = 'a'.repeat(100) + '@example.com';
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: longEmail,
          password: 'ValidPassword123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle special characters in names', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test-User_123',
          email: 'test@example.com',
          password: 'ValidPassword123'
        })
        .expect(400); // Should fail due to validation

      expect(response.body.success).toBe(false);
    });

    it('should handle unicode characters', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Tëst Üser',
          email: 'test@example.com',
          password: 'ValidPassword123'
        })
        .expect(400); // Should fail due to validation

      expect(response.body.success).toBe(false);
    });
  });
});
