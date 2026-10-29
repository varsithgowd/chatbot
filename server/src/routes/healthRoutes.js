const express = require('express');
const mongoose = require('mongoose');
const { getDbInfo } = require('../config/db');
const Article = require('../models/Article');
const router = express.Router();

router.get('/health', async (req, res) => {
  const dbInfo = getDbInfo();
  let publishedCount = 0;
  try {
    if (dbInfo.connected) {
      publishedCount = await Article.countDocuments({ status: 'published' });
    }
  } catch (err) {
    // ignore
  }

  res.json({
    status: 'healthy',
    service: 'SupportSense AI',
    timestamp: new Date().toISOString(),
    database: dbInfo.connected ? 'connected' : 'disconnected',
    databaseType: dbInfo.type,
    publishedArticles: publishedCount,
    uptimeSeconds: Math.floor(process.uptime())
  });
});

module.exports = router;

