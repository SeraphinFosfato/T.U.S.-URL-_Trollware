// Storage in-memory per testing (poi sostituiremo con MongoDB)
class InMemoryDB {
  constructor() {
    this.urls = new Map(); // shortId -> {original_url, blocks_sequence, stats}
    this.sessions = new Map(); // fingerprint -> {current_url_id, current_step, etc}
    
    // Simple persistence to prevent data loss on restart
    this.dataFile = '/tmp/trollshortener_data.json';
    this.loadData();
    
    // Save data every 30 seconds
    setInterval(() => this.saveData(), 30000);
  }
  
  loadData() {
    try {
      const fs = require('fs');
      if (fs.existsSync(this.dataFile)) {
        const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
        this.urls = new Map(data.urls || []);
        console.log(`DEBUG: Loaded ${this.urls.size} URLs from persistence`);
      }
    } catch (error) {
      console.log('DEBUG: No persistent data found, starting fresh');
    }
  }
  
  saveData() {
    try {
      const fs = require('fs');
      const data = {
        urls: Array.from(this.urls.entries()),
        timestamp: new Date().toISOString()
      };
      fs.writeFileSync(this.dataFile, JSON.stringify(data));
    } catch (error) {
      console.log('DEBUG: Failed to save data:', error.message);
    }
  }

  // URL shortening
  saveUrl(shortId, data) {
    const urlData = {
      original_url: data.original_url,
      blocks_sequence: data.blocks_sequence || ['timer_5s'],
      created_at: new Date(),
      stats: { visits: 0, completed: 0 }
    };
    this.urls.set(shortId, urlData);
    console.log(`DEBUG: Saved URL ${shortId} ->`, urlData);
    this.saveData(); // Save immediately
  }

  getUrl(shortId) {
    const result = this.urls.get(shortId);
    console.log(`DEBUG: Getting URL ${shortId} ->`, result ? 'FOUND' : 'NOT FOUND');
    return result;
  }

  // User sessions
  saveSession(fingerprint, sessionData) {
    this.sessions.set(fingerprint, sessionData);
  }

  getSession(fingerprint) {
    return this.sessions.get(fingerprint);
  }
}

module.exports = new InMemoryDB();