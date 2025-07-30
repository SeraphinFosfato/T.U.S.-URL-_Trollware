const { MongoClient } = require('mongodb');

class MongoDB {
  constructor() {
    this.client = null;
    this.db = null;
    this.urls = null;
    this.sessions = null;
  }

  async connect() {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/trollshortener';
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db('trollshortener');
      this.urls = this.db.collection('urls');
      this.sessions = this.db.collection('sessions');
      
      // Create indexes
      await this.urls.createIndex({ shortId: 1 }, { unique: true });
      await this.urls.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 }); // Custom TTL
      
      // Client paths indexes
      await this.sessions.createIndex({ pathHash: 1 }, { unique: true });
      await this.sessions.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 }); // TTL per paths
      await this.sessions.createIndex({ shortId: 1, fingerprint: 1 }); // Query optimization
      
      console.log('DEBUG: Connected to MongoDB');
      return true;
    } catch (error) {
      console.error('DEBUG: MongoDB connection failed:', error.message);
      return false;
    }
  }

  async saveUrl(shortId, data) {
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
      console.log(`DEBUG: Saved URL ${shortId} to MongoDB (${data.total_steps} steps, ${data.expiry_days}d TTL)`);
      return urlData;
    } catch (error) {
      console.error(`DEBUG: Failed to save URL ${shortId}:`, error.message);
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
      console.log(`DEBUG: Saved client path ${pathData.pathHash}`);
    } catch (error) {
      console.error(`DEBUG: Failed to save client path:`, error.message);
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