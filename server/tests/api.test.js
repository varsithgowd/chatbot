const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Article = require('../src/models/Article');
const Question = require('../src/models/Question');
const Feedback = require('../src/models/Feedback');
const sampleArticles = require('../src/seed/sampleArticles');
const config = require('../src/config/env');

let mongoServer;
let adminToken;
let regularUserToken;
let testAdminUser;
let testRegularUser;

test.before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Seed sample admin
  const adminPasswordHash = await User.hashPassword('AdminPass123!');
  testAdminUser = await User.create({
    email: 'admin@supportsense.ai',
    passwordHash: adminPasswordHash,
    role: 'admin'
  });

  // Seed sample regular user (to test authorization boundary)
  const userPasswordHash = await User.hashPassword('UserPass123!');
  testRegularUser = await User.create({
    email: 'user@example.com',
    passwordHash: userPasswordHash,
    role: 'user'
  });

  // Seed sample articles
  for (const art of sampleArticles) {
    await Article.create({
      ...art,
      createdBy: testAdminUser._id,
      updatedBy: testAdminUser._id
    });
  }

  // Obtain admin JWT
  const loginRes = await request(app)
    .post('/api/admin/login')
    .send({
      email: 'admin@supportsense.ai',
      password: 'AdminPass123!'
    });
  adminToken = loginRes.body.token;

  // Sign regular user JWT manually or via token generator for testing
  const jwt = require('jsonwebtoken');
  regularUserToken = jwt.sign(
    { id: testRegularUser._id, email: testRegularUser.email, role: testRegularUser.role },
    config.jwtSecret,
    { expiresIn: '1h' }
  );
});

test.after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// 1. Health check
test('GET /api/health should return status healthy and database connected', async () => {
  const res = await request(app).get('/api/health');
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.status, 'healthy');
  assert.strictEqual(res.body.database, 'connected');
});

// 2. Search for a known article
test('GET /api/search?q=password should return matching password article with high relevance', async () => {
  const res = await request(app).get('/api/search?q=password');
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.results.length > 0);
  const topResult = res.body.results[0];
  assert.ok(topResult.title.toLowerCase().includes('password'));
  assert.ok(topResult.score >= 15);
  assert.ok(topResult.articleId);
});

// 3. Category and product filtering
test('GET /api/search should respect category and product filters', async () => {
  const res = await request(app).get('/api/search?q=order&category=Orders%20and%20Delivery&product=SupportSense%20Store');
  assert.strictEqual(res.statusCode, 200);
  assert.ok(res.body.results.length > 0);
  for (const art of res.body.results) {
    assert.strictEqual(art.category, 'Orders and Delivery');
    assert.strictEqual(art.product, 'SupportSense Store');
  }
});

// 4. Exclusion of draft and archived articles
test('GET /api/search must exclude draft and archived articles', async () => {
  // Query terms from draft article: "Internal Test Features"
  const draftSearch = await request(app).get('/api/search?q=Internal%20Test%20Features');
  assert.strictEqual(draftSearch.body.results.length, 0);

  // Query terms from archived article: "Legacy USB Dongle"
  const archivedSearch = await request(app).get('/api/search?q=Legacy%20USB%20Dongle');
  assert.strictEqual(archivedSearch.body.results.length, 0);
});

// 5. Chat answer with a valid citation
test('POST /api/chat with valid known query should return grounded answer and real citation', async () => {
  const res = await request(app)
    .post('/api/chat')
    .send({
      question: 'How do I reset my password?'
    });

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.answered, true);
  assert.ok(res.body.answer.length > 20);
  assert.ok(Array.isArray(res.body.sources));
  assert.ok(res.body.sources.length >= 1);
  assert.ok(res.body.questionId);

  const source = res.body.sources[0];
  assert.ok(source.articleId);
  assert.strictEqual(source.title, 'How to Reset Your Password');
  assert.ok(source.url.includes(source.articleId));

  // Verify citation against DB directly
  const dbArticle = await Article.findById(source.articleId);
  assert.ok(dbArticle);
  assert.strictEqual(dbArticle.status, 'published');
});

// 6. Chat fallback for an unrelated question
test('POST /api/chat with out-of-scope query should safely return fallback message', async () => {
  const res = await request(app)
    .post('/api/chat')
    .send({
      question: 'What is the recipe for baking chocolate chip cookies in an oven?'
    });

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.answered, false);
  assert.ok(res.body.answer.includes("I couldn't find an approved article"));
  assert.deepStrictEqual(res.body.sources, []);
  assert.ok(res.body.questionId);

  // Check question record was recorded as fallback
  const qDoc = await Question.findById(res.body.questionId);
  assert.strictEqual(qDoc.answered, false);
  assert.strictEqual(qDoc.answerStatus, 'fallback');
});

// 7. Chat fallback for an unsupported refund claim
test('POST /api/chat for an unsupported refund claim should safely return fallback', async () => {
  const res = await request(app)
    .post('/api/chat')
    .send({
      question: 'Can I get a full cash refund after 5 years of heavy usage?'
    });

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.answered, false);
  assert.deepStrictEqual(res.body.sources, []);
});

// 8. Citation validation rejects fabricated IDs
test('Citation validation correctly ensures only existing published articles are cited', async () => {
  const { validateSources } = require('../src/services/chatService');
  const fakeSources = [
    { articleId: new mongoose.Types.ObjectId().toString(), title: 'Fake Article', section: 'None' }
  ];
  const validated = await validateSources(fakeSources);
  assert.strictEqual(validated.length, 0);
});

// 9. Invalid request handling
test('POST /api/chat should reject invalid inputs with 400 Bad Request', async () => {
  // Too short
  const resShort = await request(app).post('/api/chat').send({ question: 'hi' });
  assert.strictEqual(resShort.statusCode, 400);

  // Missing question field
  const resMissing = await request(app).post('/api/chat').send({});
  assert.strictEqual(resMissing.statusCode, 400);
});

// 10. Helpful and not-helpful feedback
test('POST /api/feedback should accept helpful and not_helpful ratings', async () => {
  // First ask a question to obtain a questionId
  const chatRes = await request(app).post('/api/chat').send({ question: 'How to track an order delivery?' });
  const questionId = chatRes.body.questionId;
  assert.ok(questionId);

  // Submit helpful feedback
  const resHelpful = await request(app)
    .post('/api/feedback')
    .send({
      questionId,
      rating: 'helpful',
      comment: 'Very clear instructions'
    });
  assert.strictEqual(resHelpful.statusCode, 201);
  assert.strictEqual(resHelpful.body.success, true);
  assert.strictEqual(resHelpful.body.feedback.rating, 'helpful');

  // Submit updated / not_helpful feedback
  const resNotHelpful = await request(app)
    .post('/api/feedback')
    .send({
      questionId,
      rating: 'not_helpful',
      comment: 'Needed more details on international delivery'
    });
  assert.strictEqual(resNotHelpful.statusCode, 201);
  assert.strictEqual(resNotHelpful.body.feedback.rating, 'not_helpful');
});

// 11. Admin login
test('POST /api/admin/login should authenticate valid admin and reject invalid credentials', async () => {
  const validRes = await request(app)
    .post('/api/admin/login')
    .send({
      email: 'admin@supportsense.ai',
      password: 'AdminPass123!'
    });
  assert.strictEqual(validRes.statusCode, 200);
  assert.ok(validRes.body.token);
  assert.strictEqual(validRes.body.user.role, 'admin');

  const invalidRes = await request(app)
    .post('/api/admin/login')
    .send({
      email: 'admin@supportsense.ai',
      password: 'WrongPassword'
    });
  assert.strictEqual(invalidRes.statusCode, 401);
});

// 12. Admin logout
test('POST /api/admin/logout should terminate session and return success', async () => {
  const res = await request(app)
    .post('/api/admin/logout')
    .set('Authorization', `Bearer ${adminToken}`);
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.success, true);
});

// 13. Rejection of unauthenticated admin access
test('Admin endpoints should reject unauthenticated requests with 401', async () => {
  const res = await request(app).get('/api/admin/dashboard');
  assert.strictEqual(res.statusCode, 401);
});

// 13. Rejection of non-admin write operations
test('Admin endpoints should reject regular users with 403 Forbidden', async () => {
  const res = await request(app)
    .get('/api/admin/dashboard')
    .set('Authorization', `Bearer ${regularUserToken}`);
  assert.strictEqual(res.statusCode, 403);
});

// 14. Article creation, editing, publishing, and archiving
test('Admin can create, edit, publish, and archive an article', async () => {
  // 1. Create Draft
  const createRes = await request(app)
    .post('/api/admin/articles')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      title: 'New Integration Guide for Slack',
      content: 'Learn how to link SupportSense AI directly into your Slack workspace.',
      category: 'Product Troubleshooting',
      product: 'SupportSense Web App',
      tags: ['slack', 'integration', 'notifications'],
      status: 'draft',
      sections: [
        {
          heading: 'Connecting the Bot',
          content: 'Install the SupportSense Slack app from the app directory and authorize OAuth permissions.'
        }
      ]
    });

  assert.strictEqual(createRes.statusCode, 201);
  const newArticleId = createRes.body.article._id;
  assert.strictEqual(createRes.body.article.status, 'draft');

  // Verify it is NOT searchable publicly while in draft
  const publicCheck1 = await request(app).get(`/api/articles/${newArticleId}`);
  assert.strictEqual(publicCheck1.statusCode, 404);

  // 2. Edit Article
  const updateRes = await request(app)
    .patch(`/api/admin/articles/${newArticleId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      title: 'Official Slack Integration Guide'
    });
  assert.strictEqual(updateRes.statusCode, 200);
  assert.strictEqual(updateRes.body.article.title, 'Official Slack Integration Guide');

  // 3. Publish Article
  const publishRes = await request(app)
    .patch(`/api/admin/articles/${newArticleId}/publish`)
    .set('Authorization', `Bearer ${adminToken}`);
  assert.strictEqual(publishRes.statusCode, 200);
  assert.strictEqual(publishRes.body.article.status, 'published');

  // Verify it IS now visible publicly
  const publicCheck2 = await request(app).get(`/api/articles/${newArticleId}`);
  assert.strictEqual(publicCheck2.statusCode, 200);
  assert.strictEqual(publicCheck2.body.article.status, 'published');

  // 4. Archive Article
  const archiveRes = await request(app)
    .patch(`/api/admin/articles/${newArticleId}/archive`)
    .set('Authorization', `Bearer ${adminToken}`);
  assert.strictEqual(archiveRes.statusCode, 200);
  assert.strictEqual(archiveRes.body.article.status, 'archived');

  // Verify it is excluded publicly again
  const publicCheck3 = await request(app).get(`/api/articles/${newArticleId}`);
  assert.strictEqual(publicCheck3.statusCode, 404);
});

