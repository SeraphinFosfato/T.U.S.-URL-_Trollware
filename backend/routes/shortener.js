const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { generateShortId, isValidUrl } = require('../utils/shortener');
const clientSession = require('../utils/client-session');
const freeTier = require('../config/free-tier-manager');

// POST /api/shorten - Crea nuovo short URL
router.post('/shorten', async (req, res) => {
  const { url, steps = 2, days = 7 } = req.body;
  
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  if (!freeTier.checkLimits()) {
    return res.status(429).json({ error: 'Daily limit reached' });
  }

  const shortId = generateShortId();
  const totalSteps = Math.min(Math.max(parseInt(steps) || 2, 1), 5); // 1-5 steps
  const expiryDays = Math.min(Math.max(parseInt(days) || 7, 1), 7); // 1-7 days
  
  freeTier.logDbOperation();
  const saved = await db.saveUrl(shortId, { 
    original_url: url,
    total_steps: totalSteps,
    expiry_days: expiryDays
  });
  
  if (!saved) {
    return res.status(500).json({ error: 'Database error' });
  }
  
  const response = { 
    shortId, 
    shortUrl: `${req.protocol}://${req.get('host')}/${shortId}`,
    original_url: url,
    steps: totalSteps,
    expires_in_days: expiryDays
  };
  
  freeTier.logRequest(JSON.stringify(response).length);
  res.json(response);
});

// GET /:shortId - Redirect con blocchi
router.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;
  
  if (shortId === 'v' || shortId === 'api') {
    return res.status(404).send('Not found');
  }
  
  freeTier.logDbOperation();
  const urlData = await db.getUrl(shortId);
  
  if (!urlData) {
    return res.status(404).send('Link not found');
  }

  // Incrementa visite
  await db.updateStats(shortId, 'visits');
  
  // Inizia la sequenza di blocchi con sessione client-side
  res.redirect(`/v/${shortId}`);
});

module.exports = router;