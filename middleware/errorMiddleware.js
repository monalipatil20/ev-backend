// Centralized error handler that normalizes API, validation, and database failures.
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let details;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    code = 'VALIDATION_ERROR';
    details = Object.values(err.errors).map((error) => error.message);
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate resource detected';
    code = 'DUPLICATE_KEY_ERROR';
    details = err.keyValue;
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  }

  console.error(`[ERROR] ${statusCode} ${code}: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(details ? { details } : {}),
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};

module.exports = errorMiddleware;
