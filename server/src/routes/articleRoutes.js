const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticleById,
  searchArticlesHandler
} = require('../controllers/articleController');

router.get('/articles', getArticles);
router.get('/articles/:id', getArticleById);
router.get('/search', searchArticlesHandler);

module.exports = router;

