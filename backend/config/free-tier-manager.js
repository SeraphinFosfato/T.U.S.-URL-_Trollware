// Gestione intelligente dei limiti free tier
class FreeTierManager {
  constructor() {
    this.stats = {
      dailyRequests: 0,
      dailyBandwidth: 0,
      dbOperations: 0,
      lastReset: new Date().toDateString()
    };
    this.limits = {
      maxDailyRequests: 1000,
      maxDailyBandwidth: 50 * 1024 * 1024, // 50MB
      maxDbOperations: 500
    };
  }

  checkLimits() {
    const today = new Date().toDateString();
    if (today !== this.stats.lastReset) {
      this.resetDailyStats();
    }
    
    return this.stats.dailyRequests < this.limits.maxDailyRequests &&
           this.stats.dailyBandwidth < this.limits.maxDailyBandwidth;
  }

  resetDailyStats() {
    this.stats = {
      dailyRequests: 0,
      dailyBandwidth: 0,
      dbOperations: 0,
      lastReset: new Date().toDateString()
    };
  }

  logRequest(responseSize = 0) {
    this.stats.dailyRequests++;
    this.stats.dailyBandwidth += responseSize;
    
    const logger = require('../utils/debug-logger');
    logger.usage('REQUESTS', this.stats.dailyRequests, this.limits.maxDailyRequests);
    logger.usage('BANDWIDTH', Math.round(this.stats.dailyBandwidth/1024) + 'KB', Math.round(this.limits.maxDailyBandwidth/1024) + 'KB');
    
    if (this.shouldUseMinimalMode()) {
      logger.warn('FREE-TIER', 'Switching to minimal mode due to high usage');
    }
  }

  logDbOperation() {
    this.stats.dbOperations++;
    const logger = require('../utils/debug-logger');
    logger.usage('DB_OPS', this.stats.dbOperations, this.limits.maxDbOperations);
  }

  shouldUseMinimalMode() {
    return this.stats.dailyRequests > (this.limits.maxDailyRequests * 0.8) ||
           this.stats.dailyBandwidth > (this.limits.maxDailyBandwidth * 0.8);
  }

  getUsageReport() {
    const requestsPercent = Math.round((this.stats.dailyRequests / this.limits.maxDailyRequests) * 100);
    const bandwidthPercent = Math.round((this.stats.dailyBandwidth / this.limits.maxDailyBandwidth) * 100);
    
    return {
      requests: `${this.stats.dailyRequests}/${this.limits.maxDailyRequests} (${requestsPercent}%)`,
      bandwidth: `${Math.round(this.stats.dailyBandwidth/1024)}KB/${Math.round(this.limits.maxDailyBandwidth/1024)}KB (${bandwidthPercent}%)`,
      dbOps: this.stats.dbOperations,
      status: this.shouldUseMinimalMode() ? 'MINIMAL_MODE' : 'NORMAL'
    };
  }
}

module.exports = new FreeTierManager();