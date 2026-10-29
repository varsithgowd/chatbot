const app = require('./src/app');
const config = require('./src/config/env');
const { connectDB, disconnectDB } = require('./src/config/db');
const { seedDatabase } = require('./src/seed/seed');
const Article = require('./src/models/Article');

async function startServer() {
  try {
    console.log('----------------------------------------------------');
    console.log('  SupportSense AI — Customer Support Knowledge System');
    console.log('----------------------------------------------------');
    
    // Connect to database
    await connectDB();

    // Ensure the active database contains all required sample articles and admin credentials
    console.log('[Init] Synchronizing knowledge base catalog and administrator credentials...');
    await seedDatabase(true);
    const publishedCount = await Article.countDocuments({ status: 'published' });
    console.log(`[Init] Active database ready. Published articles in catalog: ${publishedCount}`);

    const server = app.listen(config.port, () => {
      console.log(`[Server] SupportSense AI server running on http://localhost:${config.port}`);
      console.log(`[Server] Environment: ${config.nodeEnv}`);
      console.log(`[Server] Public Health check: http://localhost:${config.port}/api/health`);
      console.log('----------------------------------------------------');
    });

    // Graceful shutdown
    const handleShutdown = async (signal) => {
      console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        await disconnectDB();
        console.log('[Server] Process exited cleanly.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));

  } catch (err) {
    console.error('[Server] Fatal startup error:', err);
    process.exit(1);
  }
}

startServer();

