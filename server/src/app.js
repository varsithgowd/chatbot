const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

const healthRoutes = require('./routes/healthRoutes');
const articleRoutes = require('./routes/articleRoutes');
const chatRoutes = require('./routes/chatRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman, or same-origin)
    if (!origin) return callback(null, true);
    // Allow any localhost port in development
    if (config.nodeEnv === 'development' && /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    if (origin === config.corsOrigin) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for hackathon demo
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing with safe size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Mount API Routes
app.use('/api', healthRoutes);
app.use('/api', articleRoutes);
app.use('/api', chatRoutes);
app.use('/api', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// Serve static frontend files if client dist exists
const path = require('path');
const fs = require('fs');
const clientDistPath = path.resolve(__dirname, '../../client/dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Catch-all 404 handler for undefined routes if no client build
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: `Endpoint not found: ${req.method} ${req.originalUrl}`
    });
  });
}

// Centralized error handler
app.use(errorHandler);

module.exports = app;
