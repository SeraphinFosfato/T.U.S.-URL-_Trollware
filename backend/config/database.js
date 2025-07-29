// MongoDB Database
const mongodb = require('./mongodb');

// Initialize MongoDB connection
let dbReady = false;
mongodb.connect().then(success => {
  dbReady = success;
});

// Wrapper to ensure DB is ready
class DatabaseWrapper {
  async saveUrl(shortId, data) {
    if (!dbReady) {
      console.log('DEBUG: MongoDB not ready, attempting reconnect...');
      dbReady = await mongodb.connect();
    }
    return await mongodb.saveUrl(shortId, data);
  }

  async getUrl(shortId) {
    if (!dbReady) {
      console.log('DEBUG: MongoDB not ready, attempting reconnect...');
      dbReady = await mongodb.connect();
    }
    return await mongodb.getUrl(shortId);
  }

  async updateStats(shortId, field) {
    if (!dbReady) return;
    return await mongodb.updateStats(shortId, field);
  }

  async saveSession(fingerprint, sessionData) {
    if (!dbReady) return;
    return await mongodb.saveSession(fingerprint, sessionData);
  }

  async getSession(fingerprint) {
    if (!dbReady) return null;
    return await mongodb.getSession(fingerprint);
  }
}

module.exports = new DatabaseWrapper();