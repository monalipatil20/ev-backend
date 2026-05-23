// Lightweight health controller for uptime checks and deployment probes.
const asyncHandler = require('../utils/asyncHandler');

const getHealthStatus = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = {
  getHealthStatus,
};