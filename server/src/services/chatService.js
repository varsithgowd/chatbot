const { searchArticles, tokenize } = require('./searchService');
const Question = require('../models/Question');
const Article = require('../models/Article');
const config = require('../config/env');

const FALLBACK_MESSAGE = "I couldn't find an approved article that reliably answers this question. Please contact customer support for assistance.";

/**
 * Extracts key evidence sentences from text based on query tokens.
 */
function extractEvidenceAnswer(matchedSection, articleContent, queryTokens) {
  const targetText = matchedSection && matchedSection.content ? matchedSection.content : articleContent;
  if (!targetText) return '';

  // Split into sentences
  const rawSentences = targetText
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);

  if (rawSentences.length === 0) {
    return targetText.slice(0, 300);
  }

  // Score sentences by query token density
  const scoredSentences = rawSentences.map(sentence => {
    const sLower = sentence.toLowerCase();
    let hits = 0;
    for (const token of queryTokens) {
      if (sLower.includes(token.toLowerCase())) {
        hits++;
      }
    }
    return { sentence, hits };
  });

  // Pick top 1 to 3 relevant sentences with hits
  const relevantSentences = scoredSentences.filter(s => s.hits > 0);

  if (relevantSentences.length > 0) {
    // Keep order of appearance in original text for natural reading flow
    const selected = rawSentences.filter(s => relevantSentences.some(r => r.sentence === s)).slice(0, 3);
    return selected.join(' ');
  }

  // Fallback to the first 2 sentences of the section
  return rawSentences.slice(0, 2).join(' ');
}

/**
 * Validates citations against actual database records.
 * Never allows fabricated IDs or non-published articles.
 */
async function validateSources(sources) {
  if (!Array.isArray(sources) || sources.length === 0) return [];

  const validSources = [];
  for (const src of sources) {
    if (!src.articleId) continue;
    const article = await Article.findById(src.articleId).lean();
    if (article && article.status === 'published') {
      validSources.push({
        articleId: article._id.toString(),
        title: article.title,
        section: src.section || (article.sections && article.sections[0] ? article.sections[0].heading : 'General'),
        url: `/api/articles/${article._id}`
      });
    }
  }

  return validSources;
}

/**
 * Main evidence-based chat processing pipeline.
 */
async function processChatMessage({ question, category, product }) {
  const trimmedQuestion = question.trim();
  const queryTokens = tokenize(trimmedQuestion, true);

  // 1. Search published articles
  const searchResult = await searchArticles(trimmedQuestion, {
    category,
    product,
    limit: 3,
    minScore: config.minSearchScore
  });

  const topMatch = searchResult.results[0];

  // 2. Check if evidence is sufficient
  // Strict Grounding Rule: If no match or top score is below threshold, return safe fallback
  if (!topMatch || topMatch.score < config.minSearchScore) {
    // Log unanswered question for admin queue
    const questionDoc = await Question.create({
      questionText: trimmedQuestion,
      matchedArticleIds: [],
      answered: false,
      answerStatus: 'fallback'
    });

    return {
      answer: FALLBACK_MESSAGE,
      answered: false,
      sources: [],
      questionId: questionDoc._id.toString()
    };
  }

  // 3. Generate grounded answer strictly from retrieved article content
  const sectionHeading = topMatch.matchedSection ? topMatch.matchedSection.heading : 'Overview';
  const extractedSnippet = extractEvidenceAnswer(
    topMatch.matchedSection,
    topMatch.excerpt,
    queryTokens
  );

  let groundedAnswer = extractedSnippet;
  if (!groundedAnswer || groundedAnswer.length < 10) {
    groundedAnswer = `According to our approved documentation on "${topMatch.title}", ${topMatch.excerpt}`;
  }

  // 4. Construct and validate source citation
  const rawSources = [{
    articleId: topMatch.articleId,
    title: topMatch.title,
    section: sectionHeading,
    url: topMatch.url
  }];

  // If there is a strong second corroborating source with a high score (within 70% of topMatch)
  if (searchResult.results[1] && searchResult.results[1].score >= config.minSearchScore * 1.2) {
    rawSources.push({
      articleId: searchResult.results[1].articleId,
      title: searchResult.results[1].title,
      section: searchResult.results[1].matchedSection ? searchResult.results[1].matchedSection.heading : 'Overview',
      url: searchResult.results[1].url
    });
  }

  const verifiedSources = await validateSources(rawSources);

  // If citation validation fails for any reason, do not return fabricated sources
  if (verifiedSources.length === 0) {
    const questionDoc = await Question.create({
      questionText: trimmedQuestion,
      matchedArticleIds: [],
      answered: false,
      answerStatus: 'fallback'
    });

    return {
      answer: FALLBACK_MESSAGE,
      answered: false,
      sources: [],
      questionId: questionDoc._id.toString()
    };
  }

  // 5. Persist question record with answer status
  const matchedIds = verifiedSources.map(s => s.articleId);
  const questionDoc = await Question.create({
    questionText: trimmedQuestion,
    matchedArticleIds: matchedIds,
    answered: true,
    answerStatus: 'answered'
  });

  return {
    answer: groundedAnswer,
    answered: true,
    sources: verifiedSources,
    questionId: questionDoc._id.toString()
  };
}

module.exports = {
  processChatMessage,
  validateSources,
  extractEvidenceAnswer,
  FALLBACK_MESSAGE
};

