const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const evaluationDataset = require('./evaluationDataset');
const Article = require('../src/models/Article');
const User = require('../src/models/User');
const sampleArticles = require('../src/seed/sampleArticles');
const { processChatMessage } = require('../src/services/chatService');
const { searchArticles } = require('../src/services/searchService');

async function runEvaluation() {
  console.log('================================================================');
  console.log('   SupportSense AI — Benchmark & Evaluation Suite');
  console.log('================================================================');
  console.log(`Running evaluation on ${evaluationDataset.length} curated benchmark queries...\n`);

  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Setup admin and articles
  const admin = await User.create({
    email: 'admin@supportsense.ai',
    passwordHash: 'dummyhash',
    role: 'admin'
  });

  const articleMap = {};
  for (const art of sampleArticles) {
    const doc = await Article.create({
      ...art,
      createdBy: admin._id,
      updatedBy: admin._id
    });
    articleMap[doc.slug] = doc;
  }

  let totalQueries = evaluationDataset.length;
  let inDomainQueries = 0;
  let outOfDomainQueries = 0;

  let correctInDomainRetrievals = 0;
  let correctCitations = 0;
  let correctFallbacks = 0;
  let totalEvaluations = 0;

  const results = [];

  for (const testCase of evaluationDataset) {
    totalEvaluations++;
    const isExpectedAnswered = testCase.expectedAnswered;
    if (isExpectedAnswered) {
      inDomainQueries++;
    } else {
      outOfDomainQueries++;
    }

    const response = await processChatMessage({ question: testCase.query });
    const answered = response.answered;
    const sources = response.sources;
    const answerText = response.answer;

    let passed = false;
    let notes = '';

    if (isExpectedAnswered) {
      if (answered && sources.length > 0) {
        const topSource = sources[0];
        const matchedSlug = Object.keys(articleMap).find(
          slug => articleMap[slug]._id.toString() === topSource.articleId
        );

        const isSlugMatch = matchedSlug === testCase.expectedArticleSlug;
        const hasKeywords = testCase.expectedKeywords.some(kw =>
          answerText.toLowerCase().includes(kw.toLowerCase())
        );

        if (isSlugMatch) {
          correctInDomainRetrievals++;
        }
        if (topSource.url && topSource.title && isSlugMatch) {
          correctCitations++;
        }

        passed = isSlugMatch && hasKeywords;
        notes = isSlugMatch ? `Matched: ${matchedSlug}` : `Mismatch: expected ${testCase.expectedArticleSlug}, got ${matchedSlug}`;
      } else {
        notes = 'Expected answer, but received fallback';
      }
    } else {
      // Expected Fallback
      if (!answered && sources.length === 0) {
        correctFallbacks++;
        passed = true;
        notes = 'Safely returned fallback message';
      } else {
        notes = 'Expected fallback, but returned unverified answer';
      }
    }

    results.push({
      id: testCase.id,
      description: testCase.description,
      query: testCase.query,
      expected: isExpectedAnswered ? `Answer from [${testCase.expectedArticleSlug}]` : 'Safe Fallback',
      actual: answered ? `Answered (${sources[0]?.title})` : 'Fallback',
      status: passed ? 'PASS' : 'FAIL',
      notes
    });
  }

  // Print results table
  console.table(results.map(r => ({
    ID: r.id,
    Query: r.query.length > 40 ? r.query.slice(0, 37) + '...' : r.query,
    Expected: r.expected,
    Actual: r.actual,
    Status: r.status
  })));

  const retrievalAccuracy = inDomainQueries > 0 ? (correctInDomainRetrievals / inDomainQueries) * 100 : 0;
  const citationAccuracy = correctInDomainRetrievals > 0 ? (correctCitations / correctInDomainRetrievals) * 100 : 0;
  const fallbackPrecision = outOfDomainQueries > 0 ? (correctFallbacks / outOfDomainQueries) * 100 : 0;
  const overallAccuracy = ((correctInDomainRetrievals + correctFallbacks) / totalQueries) * 100;

  console.log('\n================================================================');
  console.log('   EVALUATION METRICS & QUALITY REPORT');
  console.log('================================================================');
  console.log(`Total Test Queries:           ${totalQueries}`);
  console.log(`- In-domain inquiries:        ${inDomainQueries}`);
  console.log(`- Out-of-scope / Unsupported: ${outOfDomainQueries}`);
  console.log('----------------------------------------------------------------');
  console.log(`Retrieval Top-1 Accuracy:     ${retrievalAccuracy.toFixed(1)}% (${correctInDomainRetrievals}/${inDomainQueries})`);
  console.log(`Citation Validity Rate:       ${citationAccuracy.toFixed(1)}% (${correctCitations}/${correctInDomainRetrievals})`);
  console.log(`Fallback Precision:           ${fallbackPrecision.toFixed(1)}% (${correctFallbacks}/${outOfDomainQueries})`);
  console.log(`Overall Benchmark Score:      ${overallAccuracy.toFixed(1)}% (${correctInDomainRetrievals + correctFallbacks}/${totalQueries})`);
  console.log('================================================================\n');

  await mongoose.disconnect();
  await mongoServer.stop();

  if (overallAccuracy < 90) {
    process.exit(1);
  }
}

runEvaluation().catch(err => {
  console.error('Evaluation failed:', err);
  process.exit(1);
});

