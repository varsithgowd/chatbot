const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const serverEnvPath = path.resolve(__dirname, '../../.env');
const rootEnvPath = path.resolve(__dirname, '../../../.env');

if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/supportsense',
  jwtSecret: process.env.JWT_SECRET || 'supportsense_dev_super_secret_jwt_key_2026_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminEmail: (process.env.ADMIN_EMAIL || 'admin@supportsense.ai').toLowerCase().trim(),
  adminPassword: process.env.ADMIN_PASSWORD || 'AdminPass123!',
  minSearchScore: parseFloat(process.env.MIN_SEARCH_SCORE) || 15,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  useInMemoryDb: process.env.USE_IN_MEMORY_DB === 'true'
};

module.exports = config;

