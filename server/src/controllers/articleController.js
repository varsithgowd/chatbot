const Article = require('../models/Article');
const { searchArticles } = require('../services/searchService');

async function getArticles(req, res, next) {
  try {
    const { category, product, q, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

    // STRICT RULE: Public API only returns published articles
    const filter = { status: 'published' };

    if (category && typeof category === 'string' && category.trim()) {
      filter.category = category.trim();
    }
    if (product && typeof product === 'string' && product.trim()) {
      filter.product = product.trim();
    }

    if (q && typeof q === 'string' && q.trim()) {
      const searchResult = await searchArticles(q.trim(), {
        category,
        product,
        page: pageNum,
        limit: limitNum
      });
      return res.json({
        success: true,
        articles: searchResult.results,
        total: searchResult.total,
        page: searchResult.page,
        limit: searchResult.limit
      });
    }

    const skip = (pageNum - 1) * limitNum;
    const [articles, total] = await Promise.all([
      Article.find(filter)
        .select('_id title slug category product tags createdAt updatedAt sections')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Article.countDocuments(filter)
    ]);

    return res.json({
      success: true,
      articles,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    next(error);
  }
}

async function getArticleById(req, res, next) {
  try {
    const { id } = req.params;
    let article;

    // Check if valid ObjectId or slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      article = await Article.findById(id).lean();
    } else {
      article = await Article.findOne({ slug: id.toLowerCase().trim() }).lean();
    }

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    // Exclude draft and archived articles from public access unless authenticated as admin
    if (article.status !== 'published') {
      return res.status(404).json({
        success: false,
        error: 'Article not found or not published'
      });
    }

    return res.json({
      success: true,
      article
    });
  } catch (error) {
    next(error);
  }
}

async function searchArticlesHandler(req, res, next) {
  try {
    const { q, category, product, page = 1, limit = 10 } = req.query;
    if (!q || typeof q !== 'string' || !q.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Search query parameter "q" is required'
      });
    }

    const results = await searchArticles(q.trim(), {
      category,
      product,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10
    });

    return res.json({
      success: true,
      ...results
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getArticles,
  getArticleById,
  searchArticlesHandler
};

