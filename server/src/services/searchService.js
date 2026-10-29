const Article = require('../models/Article');
const config = require('../config/env');

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but',
  'by', 'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for',
  'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself',
  'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
  'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off',
  'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to',
  'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where',
  'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'you', 'your', 'yours',
  'yourself', 'yourselves', 'please', 'tell', 'help', 'want', 'need', 'get', 'got', 'give',
  'make', 'know', 'see', 'find', 'also', 'like'
]);

/**
 * Escapes regex special characters to prevent ReDoS / injection
 */
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Normalizes text: trims, lowercases, removes non-alphanumeric (except spaces/hyphens)
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenizes text, optionally filtering stop words
 */
function tokenize(text, filterStopWords = true) {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  const rawTokens = normalized.split(/\s+/).filter(Boolean);
  if (!filterStopWords) return rawTokens;

  const filtered = rawTokens.filter(t => !STOP_WORDS.has(t) && t.length > 1);
  return filtered.length > 0 ? filtered : rawTokens;
}

/**
 * Finds a relevant excerpt from text around the matched keywords
 */
function extractExcerpt(text, tokens, maxChars = 220) {
  if (!text) return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxChars) return clean;

  const lower = clean.toLowerCase();
  let firstIdx = -1;

  for (const token of tokens) {
    const idx = lower.indexOf(token.toLowerCase());
    if (idx !== -1 && (firstIdx === -1 || idx < firstIdx)) {
      firstIdx = idx;
    }
  }

  if (firstIdx === -1) {
    return clean.slice(0, maxChars) + '...';
  }

  const start = Math.max(0, firstIdx - 40);
  const end = Math.min(clean.length, start + maxChars);
  let excerpt = clean.slice(start, end);

  if (start > 0) excerpt = '...' + excerpt;
  if (end < clean.length) excerpt = excerpt + '...';

  return excerpt;
}

/**
 * Transparent relevance scoring algorithm:
 * - Exact full phrase match in Title: +50
 * - Exact full phrase match in Section Heading: +30
 * - Exact full phrase match in Tags: +25
 * - Title token match: +15 per token
 * - Section Heading token match: +10 per token
 * - Tag exact token match: +12 per token
 * - Section Content token match: +4 per token
 * - Content token match: +2 per token
 * - Category / Product exact match: +15
 * - Token Coverage Multiplier: (matchedUniqueTokens / totalQueryTokens) * boost
 */
function scoreArticle(article, query, tokens, options = {}) {
  const normQuery = normalizeText(query);
  const titleNorm = normalizeText(article.title);
  const contentNorm = normalizeText(article.content);
  const tagsNorm = (article.tags || []).map(t => normalizeText(t));
  const categoryNorm = normalizeText(article.category);
  const productNorm = normalizeText(article.product);

  let score = 0;
  const matchedTokens = new Set();
  let bestSection = null;
  let highestSectionScore = -1;

  // 1. Full phrase matches
  if (normQuery.length > 3) {
    if (titleNorm.includes(normQuery)) {
      score += 50;
    }
    if (tagsNorm.some(t => t.includes(normQuery))) {
      score += 25;
    }
    if (contentNorm.includes(normQuery)) {
      score += 15;
    }
  }

  // 2. Token matches across Title, Content, and Tags
  for (const token of tokens) {
    let tokenMatchedInArticle = false;

    // Title
    if (titleNorm.includes(token)) {
      score += 15;
      tokenMatchedInArticle = true;
    }

    // Tags
    if (tagsNorm.some(t => t.includes(token))) {
      score += 12;
      tokenMatchedInArticle = true;
    }

    // Main content
    const contentMatches = (contentNorm.match(new RegExp(`\\b${escapeRegex(token)}\\b`, 'g')) || []).length;
    if (contentMatches > 0) {
      score += Math.min(contentMatches * 2, 12); // cap token content contribution
      tokenMatchedInArticle = true;
    }

    if (tokenMatchedInArticle) {
      matchedTokens.add(token);
    }
  }

  // 3. Section-level evaluation (Sections carry critical granular evidence)
  if (Array.isArray(article.sections) && article.sections.length > 0) {
    for (const section of article.sections) {
      let secScore = 0;
      const headingNorm = normalizeText(section.heading);
      const secContentNorm = normalizeText(section.content);

      if (normQuery.length > 3 && headingNorm.includes(normQuery)) {
        secScore += 30;
      }

      for (const token of tokens) {
        if (headingNorm.includes(token)) {
          secScore += 10;
          matchedTokens.add(token);
        }
        const secMatches = (secContentNorm.match(new RegExp(`\\b${escapeRegex(token)}\\b`, 'g')) || []).length;
        if (secMatches > 0) {
          secScore += Math.min(secMatches * 4, 20);
          matchedTokens.add(token);
        }
      }

      if (secScore > highestSectionScore) {
        highestSectionScore = secScore;
        bestSection = section;
      }
    }
    // Add the best section score to the overall article score
    if (highestSectionScore > 0) {
      score += highestSectionScore;
    }
  }

  // 4. Category & Product filters or query matching
  if (options.category && categoryNorm === normalizeText(options.category)) {
    score += 15;
  } else if (normQuery.includes(categoryNorm)) {
    score += 10;
  }

  if (options.product && productNorm === normalizeText(options.product)) {
    score += 15;
  } else if (normQuery.includes(productNorm)) {
    score += 10;
  }

  // 5. Coverage Multiplier: Reward articles matching a high fraction of query terms,
  // heavily penalize peripheral hits on multi-term questions with unsupported constraints.
  if (tokens.length > 0) {
    const coverageRatio = matchedTokens.size / tokens.length;
    if (tokens.length >= 3 && matchedTokens.size < 2) {
      // Out of 3+ meaningful tokens, matching only 1 is weak/isolated keyword collision
      score = score * 0.2;
    } else if (tokens.length >= 5 && coverageRatio <= 0.55) {
      // When a query has 5+ specific constraint tokens but over 45% are missing from the article,
      // the article lacks sufficient evidence to support the specific inquiry
      score = score * 0.25;
    } else {
      score = score * Math.pow(coverageRatio, 0.75);
    }
  }

  // Determine best excerpt
  const sourceTextForExcerpt = bestSection ? `${bestSection.heading}: ${bestSection.content}` : article.content;
  const excerpt = extractExcerpt(sourceTextForExcerpt, tokens);

  return {
    score: Math.round(score * 10) / 10,
    matchedTokensCount: matchedTokens.size,
    bestSection: bestSection || (article.sections && article.sections[0]) || null,
    excerpt
  };
}

/**
 * Searches published articles using deterministic keyword matching
 * Excludes draft and archived articles.
 */
async function searchArticles(query, options = {}) {
  const {
    category,
    product,
    limit = 10,
    page = 1,
    minScore = config.minSearchScore
  } = options;

  if (!query || typeof query !== 'string' || !query.trim()) {
    return {
      results: [],
      total: 0,
      page,
      limit,
      query: ''
    };
  }

  const tokens = tokenize(query, true);
  if (tokens.length === 0) {
    return { results: [], total: 0, page, limit, query };
  }

  // Build safe MongoDB query filter
  // STRICT RULE: Only published articles can be searched
  const mongoFilter = { status: 'published' };

  if (category && typeof category === 'string' && category.trim()) {
    mongoFilter.category = category.trim();
  }
  if (product && typeof product === 'string' && product.trim()) {
    mongoFilter.product = product.trim();
  }

  // Candidate retrieval: query articles matching any tokens in title, tags, category, or content
  // using safe regex or direct text search
  const regexConditions = tokens.map(tok => ({
    $or: [
      { title: { $regex: escapeRegex(tok), $options: 'i' } },
      { tags: { $regex: escapeRegex(tok), $options: 'i' } },
      { category: { $regex: escapeRegex(tok), $options: 'i' } },
      { 'sections.heading': { $regex: escapeRegex(tok), $options: 'i' } },
      { 'sections.content': { $regex: escapeRegex(tok), $options: 'i' } },
      { content: { $regex: escapeRegex(tok), $options: 'i' } }
    ]
  }));

  const candidateFilter = {
    ...mongoFilter,
    $or: regexConditions.flatMap(c => c.$or)
  };

  // Fetch candidate published articles
  const candidates = await Article.find(candidateFilter)
    .select('_id title slug content sections category product tags status createdAt updatedAt')
    .lean();

  // Score each candidate with transparent algorithm
  const scoredResults = [];
  for (const article of candidates) {
    const { score, bestSection, excerpt, matchedTokensCount } = scoreArticle(article, query, tokens, { category, product });
    
    // Only keep if meets minimum relevance threshold and matched at least one query token
    if (score >= minScore && matchedTokensCount > 0) {
      scoredResults.push({
        articleId: article._id.toString(),
        slug: article.slug,
        title: article.title,
        category: article.category,
        product: article.product,
        tags: article.tags,
        score,
        matchedSection: bestSection ? {
          heading: bestSection.heading,
          content: bestSection.content
        } : null,
        excerpt,
        url: `/api/articles/${article._id}`
      });
    }
  }

  // Sort by relevance score descending
  scoredResults.sort((a, b) => b.score - a.score);

  // Pagination
  const total = scoredResults.length;
  const startIndex = (page - 1) * limit;
  const paginatedResults = scoredResults.slice(startIndex, startIndex + limit);

  return {
    results: paginatedResults,
    total,
    page,
    limit,
    query
  };
}

module.exports = {
  searchArticles,
  scoreArticle,
  tokenize,
  normalizeText,
  extractExcerpt
};
