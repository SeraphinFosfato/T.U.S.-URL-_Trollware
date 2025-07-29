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
      console.log(`DEBUG: MongoDB URI: '${uri}'`);
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db('trollshortener');
      this.urls = this.db.collection('urls');
      this.sessions = this.db.collection('sessions');
      
      // Create indexes
      await this.urls.createIndex({ shortId: 1 }, { unique: true });
      await this.urls.createIndex({ created_at: 1 }, { expireAfterSeconds: 86400 }); // 24h TTL
      
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
        blocks_sequence: data.blocks_sequence || ['timer_5s'],
        created_at: new Date(),
        stats: { visits: 0, completed: 0 }
      };
      
      await this.urls.insertOne(urlData);
      console.log(`DEBUG: Saved URL ${shortId} to MongoDB`);
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

  async saveSession(fingerprint, sessionData) {
    try {
      await this.sessions.replaceOne(
        { fingerprint },
        { fingerprint, ...sessionData, updated_at: new Date() },
        { upsert: true }
      );
    } catch (error) {
      console.error(`DEBUG: Failed to save session:`, error.message);
    }
  }

  async getSession(fingerprint) {
    try {
      return await this.sessions.findOne({ fingerprint });
    } catch (error) {
      console.error(`DEBUG: Failed to get session:`, error.message);
      return null;
    }
  }
}

module.exports = new MongoDB();