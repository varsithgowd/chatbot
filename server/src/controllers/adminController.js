const Article = require('../models/Article');
const Question = require('../models/Question');
const Feedback = require('../models/Feedback');
const { slugify } = require('../utils/slugify');

/**
 * Live Dashboard Analytics
 */
async function getDashboard(req, res, next) {
  try {
    const [
      publishedCount,
      draftCount,
      archivedCount,
      totalQuestions,
      answeredCount,
      unansweredCount,
      helpfulCount,
      notHelpfulCount,
      recentQuestions,
      recentFeedback
    ] = await Promise.all([
      Article.countDocuments({ status: 'published' }),
      Article.countDocuments({ status: 'draft' }),
      Article.countDocuments({ status: 'archived' }),
      Question.countDocuments(),
      Question.countDocuments({ answered: true }),
      Question.countDocuments({ answered: false }),
      Feedback.countDocuments({ rating: 'helpful' }),
      Feedback.countDocuments({ rating: 'not_helpful' }),
      Question.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate('matchedArticleIds', 'title slug')
        .lean(),
      Feedback.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('questionId', 'questionText')
        .lean()
    ]);

    const totalFeedback = helpfulCount + notHelpfulCount;
    const helpfulRatio = totalFeedback > 0 ? Math.round((helpfulCount / totalFeedback) * 100) : 0;
    const answeredRatio = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

    return res.json({
      success: true,
      stats: {
        articles: {
          published: publishedCount,
          draft: draftCount,
          archived: archivedCount,
          total: publishedCount + draftCount + archivedCount
        },
        questions: {
          total: totalQuestions,
          answered: answeredCount,
          unanswered: unansweredCount,
          answeredRatio
        },
        feedback: {
          total: totalFeedback,
          helpful: helpfulCount,
          notHelpful: notHelpfulCount,
          helpfulRatio
        }
      },
      recentQuestions,
      recentFeedback
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin Article Management - List
 */
async function getAdminArticles(req, res, next) {
  try {
    const { status, category, q, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status && ['draft', 'published', 'archived'].includes(status)) {
      filter.status = status;
    }
    if (category && typeof category === 'string' && category.trim()) {
      filter.category = category.trim();
    }
    if (q && typeof q === 'string' && q.trim()) {
      filter.$or = [
        { title: { $regex: q.trim(), $options: 'i' } },
        { tags: { $regex: q.trim(), $options: 'i' } },
        { content: { $regex: q.trim(), $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'email')
        .populate('updatedBy', 'email')
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

/**
 * Admin Article Management - Get by ID
 */
async function getAdminArticleById(req, res, next) {
  try {
    const { id } = req.params;
    const article = await Article.findById(id)
      .populate('createdBy', 'email')
      .populate('updatedBy', 'email')
      .lean();

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
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

/**
 * Admin Article Management - Create
 */
async function createArticle(req, res, next) {
  try {
    const { title, content, sections, category, product, tags, status } = req.body;

    let baseSlug = slugify(title);
    let slug = baseSlug;
    let count = 1;
    while (await Article.exists({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const article = await Article.create({
      title,
      slug,
      content,
      sections: sections || [],
      category,
      product,
      tags: tags || [],
      status: status || 'draft',
      createdBy: req.user._id,
      updatedBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: 'Article created successfully',
      article
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin Article Management - Update
 */
async function updateArticle(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedBy: req.user._id };

    if (updateData.title) {
      // If title changed, we can update or preserve slug
      updateData.slug = slugify(updateData.title);
      // Ensure unique slug if changed
      const slugClash = await Article.findOne({ slug: updateData.slug, _id: { $ne: id } });
      if (slugClash) {
        updateData.slug = `${updateData.slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const article = await Article.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    return res.json({
      success: true,
      message: 'Article updated successfully',
      article
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin Article Management - Publish
 */
async function publishArticle(req, res, next) {
  try {
    const { id } = req.params;
    const article = await Article.findByIdAndUpdate(
      id,
      { $set: { status: 'published', updatedBy: req.user._id } },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    return res.json({
      success: true,
      message: 'Article published successfully',
      article
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin Article Management - Archive
 */
async function archiveArticle(req, res, next) {
  try {
    const { id } = req.params;
    const article = await Article.findByIdAndUpdate(
      id,
      { $set: { status: 'archived', updatedBy: req.user._id } },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    return res.json({
      success: true,
      message: 'Article archived successfully',
      article
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin Questions Analytics
 */
async function getAdminQuestions(req, res, next) {
  try {
    const { page = 1, limit = 20, answered } = req.query;
    const filter = {};
    if (answered !== undefined) {
      filter.answered = answered === 'true';
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [questions, total] = await Promise.all([
      Question.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('matchedArticleIds', 'title slug')
        .lean(),
      Question.countDocuments(filter)
    ]);

    return res.json({
      success: true,
      questions,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin Unanswered Questions
 */
async function getAdminUnanswered(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const filter = { answered: false };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [questions, total] = await Promise.all([
      Question.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Question.countDocuments(filter)
    ]);

    return res.json({
      success: true,
      questions,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Admin Feedback List
 */
async function getAdminFeedback(req, res, next) {
  try {
    const { page = 1, limit = 20, rating } = req.query;
    const filter = {};
    if (rating && ['helpful', 'not_helpful'].includes(rating)) {
      filter.rating = rating;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [feedback, total] = await Promise.all([
      Feedback.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('questionId', 'questionText answered answerStatus')
        .lean(),
      Feedback.countDocuments(filter)
    ]);

    return res.json({
      success: true,
      feedback,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
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
};

