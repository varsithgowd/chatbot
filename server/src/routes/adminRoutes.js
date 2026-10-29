const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { login, getMe } = require('../controllers/authController');
const {
  getDashboard,
  getAdminArticles,
  getAdminArticleById,
  createArticle,
  updateArticle,
  publishArticle,
  archiveArticle,
  getAdminQuestions,
  getAdminUnanswered,
  getAdminFeedback
} = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { loginSchema } = require('../validators/authValidator');
const { createArticleSchema, updateArticleSchema } = require('../validators/articleValidator');

// Strict rate limiter for admin login: 10 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    error: 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Authentication routes
router.post('/login', loginLimiter, validateBody(loginSchema), login);

// Protected Admin Routes (Requires valid JWT AND Admin role)
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/me', getMe);
router.get('/dashboard', getDashboard);

// Article management
router.get('/articles', getAdminArticles);
router.post('/articles', validateBody(createArticleSchema), createArticle);
router.get('/articles/:id', getAdminArticleById);
router.patch('/articles/:id', validateBody(updateArticleSchema), updateArticle);
router.patch('/articles/:id/publish', publishArticle);
router.patch('/articles/:id/archive', archiveArticle);

// Analytics & queues
router.get('/questions', getAdminQuestions);
router.get('/unanswered', getAdminUnanswered);
router.get('/feedback', getAdminFeedback);

module.exports = router;

