const { MongoClient } = require('mongodb');

class MongoDB {
  constructor() {
    this.client = null;
    this.db = null;
    this.urls = null;
    this.sessions = null;
  }

  async connect() {
    const logger = require('../utils/debug-logger');
    
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/trollshortener';
      logger.info('MONGODB', 'Attempting connection', { uri: uri.replace(/\/\/.*@/, '//***@') });
      
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db('trollshortener');
      this.urls = this.db.collection('urls');
      this.sessions = this.db.collection('sessions');
      
      // Create indexes
      await this.urls.createIndex({ shortId: 1 }, { unique: true });
      await this.urls.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });
      
      // Client paths indexes
      await this.sessions.createIndex({ pathHash: 1 }, { unique: true });
      await this.sessions.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });
      await this.sessions.createIndex({ shortId: 1, fingerprint: 1 });
      
      logger.info('MONGODB', 'Connected successfully with indexes created');
      return true;
    } catch (error) {
      logger.error('MONGODB', 'Connection failed', { error: error.message, stack: error.stack });
      return false;
    }
  }

  async saveUrl(shortId, data) {
    const logger = require('../utils/debug-logger');
    
    try {
      const urlData = {
        shortId,
        original_url: data.original_url,
        total_steps: data.total_steps || 2,
        expiry_days: data.expiry_days || 7,
        created_at: new Date(),
        expires_at: new Date(Date.now() + (data.expiry_days || 7) * 24 * 60 * 60 * 1000),
        stats: { visits: 0, completed: 0 }
      };
      
      await this.urls.insertOne(urlData);
      logger.database('INSERT', 'urls', { shortId, steps: data.total_steps, expiry: data.expiry_days });
      return urlData;
    } catch (error) {
      logger.error('MONGODB', `Failed to save URL ${shortId}`, { error: error.message });
      return null;
    }
  }

  async getUrl(shortId) {
    try {
      const result = await this.urls.findOne({ shortId });
      console.log(`DEBUG: Getting URL ${shortId} from MongoDB ->`, result ? 'FOUND' : 'NOT FOUND');
      return result;
    } catch (error) {
      console.error(`DEBUG: Failed to get URL ${shortId}:`, error.message);
      return null;
    }
  }

  async updateStats(shortId, field) {
    try {
      await this.urls.updateOne(
        { shortId },
        { $inc: { [`stats.${field}`]: 1 } }
      );
    } catch (error) {
      console.error(`DEBUG: Failed to update stats for ${shortId}:`, error.message);
    }
  }

  async saveClientPath(pathData) {
    const logger = require('../utils/debug-logger');
    
    try {
      await this.sessions.replaceOne(
        { pathHash: pathData.pathHash },
        { 
          pathHash: pathData.pathHash,
          shortId: pathData.shortId,
          fingerprint: pathData.fingerprint,
          currentStep: pathData.currentStep,
          templates: pathData.templates,
          completed: pathData.completed,
          created_at: new Date(pathData.createdAt),
          expires_at: new Date(pathData.expiresAt)
        },
        { upsert: true }
      );
      logger.database('UPSERT', 'client_paths', { 
        pathHash: pathData.pathHash, 
        fingerprint: pathData.fingerprint,
        shortId: pathData.shortId,
        steps: pathData.templates.length
      });
    } catch (error) {
      logger.error('MONGODB', 'Failed to save client path', { 
        pathHash: pathData.pathHash,
        error: error.message 
      });
    }
  }

  async getClientPath(pathHash) {
    try {
      return await this.sessions.findOne({ pathHash });
    } catch (error) {
      console.error(`DEBUG: Failed to get client path:`, error.message);
      return null;
    }
  }

  async updateClientStep(pathHash, step) {
    try {
      await this.sessions.updateOne(
        { pathHash },
        { $set: { currentStep: step } }
      );
    } catch (error) {
      console.error(`DEBUG: Failed to update client step:`, error.message);
    }
  }

  async completeClientPath(pathHash) {
    try {
      await this.sessions.deleteOne({ pathHash });
      console.log(`DEBUG: Completed and deleted path ${pathHash}`);
    } catch (error) {
      console.error(`DEBUG: Failed to complete client path:`, error.message);
    }
  }
}

module.exports = new MongoDB();