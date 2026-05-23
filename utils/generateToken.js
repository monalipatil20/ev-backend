// Backward-compatible export for code that still imports generateToken directly.
const { generateToken } = require('./token');

module.exports = generateToken;