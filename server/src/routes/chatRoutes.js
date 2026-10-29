const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { handleChat } = require('../controllers/chatController');
const { validateBody } = require('../middleware/validate');
const { chatQuerySchema } = require('../validators/chatValidator');

// Rate limiting for public chat: 60 requests per minute per IP
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: {
    success: false,
    error: 'Too many chat requests from this IP, please try again in a minute.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/chat', chatLimiter, validateBody(chatQuerySchema), handleChat);

module.exports = router;

