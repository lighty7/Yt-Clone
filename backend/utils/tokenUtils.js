const crypto = require('crypto');

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate verification token expiration date
const generateVerificationTokenExpires = () => {
  const expiresIn = process.env.VERIFICATION_TOKEN_EXPIRES_IN || '24h';
  const hours = parseInt(expiresIn.replace('h', ''));
  return new Date(Date.now() + hours * 60 * 60 * 1000);
};

// Check if verification token is expired
const isVerificationTokenExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};

module.exports = {
  generateVerificationToken,
  generateVerificationTokenExpires,
  isVerificationTokenExpired,
};
