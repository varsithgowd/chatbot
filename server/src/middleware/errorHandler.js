const config = require('../config/env');

function errorHandler(err, req, res, next) {
  // Safe logging: avoid logging sensitive headers or payload
  console.error(`[Error] ${req.method} ${req.url} - ${err.name || 'Error'}: ${err.message}`);

  // Handle Mongoose Bad ObjectId / CastError
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Resource not found with invalid ID format: ${err.value}`
    });
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: 'Database validation failed',
      details
    });
  }

  // Handle Mongoose Duplicate Key (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      error: `Duplicate entry for ${field}. Value already exists.`
    });
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    error: err.message || 'Internal Server Error'
  };

  if (config.nodeEnv === 'development' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;

