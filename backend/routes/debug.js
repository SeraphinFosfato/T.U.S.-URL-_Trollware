const express = require('express');
const router = express.Router();
const freeTier = require('../config/free-tier-manager');
const db = require('../config/database');

// GET /debug/status - Status completo sistema
router.get('/status', async (req, res) => {
  const logger = require('../utils/debug-logger');
  
  try {
    // Test connessione DB
    const testUrl = await db.getUrl('test-connection');
    const dbStatus = testUrl !== undefined ? 'CONNECTED' : 'ERROR';
    
    // Statistiche usage
    const usage = freeTier.getUsageReport();
    
    // Info sistema
    const systemInfo = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      env: {
        NODE_ENV: process.env.NODE_ENV || 'development',
        DEBUG_MODE: process.env.DEBUG_MODE !== 'false',
        MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT_SET'
      }
    };
    
    const status = {
      status: 'OK',
      database: dbStatus,
      usage,
      system: systemInfo,
      endpoints: {
        '/api/shorten': 'POST - Create short URL',
        '/v/:shortId': 'GET - Start victim flow',
        '/v/:shortId/:step': 'GET - Process step',
        '/v/:shortId/regenerate': 'POST - Anti-tamper regeneration',
        '/admin/usage': 'GET - Usage report',
        '/debug/status': 'GET - This endpoint'
      }
    };
    
    logger.info('DEBUG', 'Status check requested', { dbStatus, usage: usage.status });
    
    res.json(status);
  } catch (error) {
    logger.error('DEBUG', 'Status check failed', { error: error.message });
    
    res.status(500).json({
      status: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});



module.exports = router;