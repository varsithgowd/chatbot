const mongoose = require('mongoose');
const config = require('./env');

let memoryServer = null;

async function connectDB() {
  if (config.useInMemoryDb) {
    console.log('[DB] USE_IN_MEMORY_DB is set to true. Starting in-memory MongoDB...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    await mongoose.connect(uri);
    console.log(`[DB] Connected to In-Memory MongoDB at ${uri}`);
    return;
  }

  try {
    // Attempt standard connection with 3-second timeout
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[DB] Successfully connected to MongoDB at ${config.mongodbUri}`);
  } catch (err) {
    console.warn(`[DB] Could not connect to local MongoDB at ${config.mongodbUri} (${err.message}).`);
    console.log('[DB] Falling back to In-Memory MongoDB instance so the app runs out-of-the-box...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const uri = memoryServer.getUri();
      await mongoose.connect(uri);
      console.log(`[DB] Connected to In-Memory MongoDB at ${uri}`);
    } catch (fallbackErr) {
      console.error('[DB] Failed to initialize in-memory MongoDB fallback:', fallbackErr);
      throw fallbackErr;
    }
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
  console.log('[DB] Disconnected from MongoDB');
}

function getDbInfo() {
  return {
    connected: mongoose.connection.readyState === 1,
    type: memoryServer ? 'embedded-memory' : 'external-mongodb'
  };
}

module.exports = { connectDB, disconnectDB, getDbInfo };

