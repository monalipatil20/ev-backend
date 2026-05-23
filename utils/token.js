// Shared JWT token utilities for signing and verifying auth tokens.
const jwt = require('jsonwebtoken');
const ApiError = require('./ApiError');

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, 'JWT_SECRET is not defined', 'JWT_SECRET_MISSING');
  }

  return process.env.JWT_SECRET;
};

const generateToken = (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token expired', 'TOKEN_EXPIRED');
    }

    throw new ApiError(401, 'Invalid token', 'INVALID_TOKEN');
  }
};

module.exports = {
  generateToken,
  verifyToken,
};