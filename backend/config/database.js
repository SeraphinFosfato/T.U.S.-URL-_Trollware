// Storage in-memory per testing (poi sostituiremo con MongoDB)
class InMemoryDB {
  constructor() {
    this.urls = new Map(); // shortId -> {original_url, blocks_sequence, stats}
    this.sessions = new Map(); // fingerprint -> {current_url_id, current_step, etc}
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