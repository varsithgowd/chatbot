const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const config = require('../config/env');
const User = require('../models/User');
const Article = require('../models/Article');
const sampleArticles = require('./sampleArticles');

async function seedDatabase(keepConnected = false) {
  console.log('[Seed] Starting database seed process...');
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }

  // 1. Seed Initial Admin Account
  const normalizedEmail = (config.adminEmail || 'admin@supportsense.ai').toLowerCase().trim();
  const passwordHash = await User.hashPassword(config.adminPassword || 'AdminPass123!');
  let admin = await User.findOne({ email: normalizedEmail });

  if (!admin) {
    admin = await User.create({
      email: normalizedEmail,
      passwordHash,
      role: 'admin'
    });
    console.log(`[Seed] Initial admin user created: ${normalizedEmail}`);
  } else {
    // Ensure admin role and password hash are synchronized with configuration
    admin.passwordHash = passwordHash;
    admin.role = 'admin';
    await admin.save();
    console.log(`[Seed] Admin user verified and synchronized: ${normalizedEmail}`);
  }

  // 2. Seed Sample Articles Idempotently
  let createdCount = 0;
  let updatedCount = 0;

  for (const articleData of sampleArticles) {
    const existing = await Article.findOne({ slug: articleData.slug });
    if (!existing) {
      await Article.create({
        ...articleData,
        createdBy: admin._id,
        updatedBy: admin._id
      });
      createdCount++;
    } else {
      await Article.updateOne(
        { _id: existing._id },
        {
          $set: {
            title: articleData.title,
            content: articleData.content,
            sections: articleData.sections,
            category: articleData.category,
            product: articleData.product,
            tags: articleData.tags,
            status: articleData.status,
            updatedBy: admin._id
          }
        }
      );
      updatedCount++;
    }
  }

  console.log(`[Seed] Completed article sync: ${createdCount} created, ${updatedCount} updated.`);
  const totalPublished = await Article.countDocuments({ status: 'published' });
  console.log(`[Seed] Total published knowledge-base articles: ${totalPublished}`);

  if (!keepConnected) {
    await disconnectDB();
  }

  return { adminId: admin._id, createdCount, updatedCount, totalPublished };
}

// If run directly from CLI
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('[Seed] Seeding finished successfully.');
      process.exit(0);
    })
    .catch(err => {
      console.error('[Seed] Seeding failed with error:', err);
      process.exit(1);
    });
}

module.exports = { seedDatabase };

