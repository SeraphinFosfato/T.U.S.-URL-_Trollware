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
      dbReady = await mongodb.connect();
    }
    return await mongodb.saveUrl(shortId, data);
  }

  async getUrl(shortId) {
    if (!dbReady) {
      dbReady = await mongodb.connect();
    }
    return await mongodb.getUrl(shortId);
  }

  async updateStats(shortId, field) {
    if (!dbReady) return;
    return await mongodb.updateStats(shortId, field);
  }

  async saveClientPath(pathData) {
    if (!dbReady) return;
    return await mongodb.saveClientPath(pathData);
  }

  async getClientPath(pathHash) {
    if (!dbReady) return null;
    return await mongodb.getClientPath(pathHash);
  }

  async updateClientStep(pathHash, step) {
    if (!dbReady) return;
    return await mongodb.updateClientStep(pathHash, step);
  }

  async completeClientPath(pathHash) {
    if (!dbReady) return;
    return await mongodb.completeClientPath(pathHash);
  }
}

module.exports = new DatabaseWrapper();