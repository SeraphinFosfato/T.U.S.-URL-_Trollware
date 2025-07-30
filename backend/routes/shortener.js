const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { generateShortId, isValidUrl } = require('../utils/shortener');
const advancedTemplates = require('../utils/advanced-template-system');
const freeTier = require('../config/free-tier-manager');

// POST /api/shorten - Crea nuovo short URL con parametri utente
router.post('/shorten', async (req, res) => {
  const { url, timePreset, steps, expiryPreset } = req.body;
  const logger = require('../utils/debug-logger');
  
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  if (!freeTier.checkLimits()) {
    return res.status(429).json({ error: 'Daily limit reached' });
  }

  const shortId = generateShortId();
  
  // Parametri utente con fallback
  const userParams = {
    timePreset: timePreset || '1min',
    steps: steps || null, // null = auto
    expiryPreset: expiryPreset || '1d'
  };
  
  // Calcola expiry days
  const expiryDays = advancedTemplates.expiryPresets[userParams.expiryPreset] || 1;
  
  logger.info('SHORTENER', 'Creating link with user params', {
    shortId,
    userParams,
    expiryDays
  });
  
  freeTier.logDbOperation();
  const saved = await db.saveUrl(shortId, { 
    original_url: url,
    user_params: userParams,
    expiry_days: expiryDays
  });
  
  if (!saved) {
    return res.status(500).json({ error: 'Database error' });
  }
  
  // Genera preview configurazione per risposta
  const targetTime = advancedTemplates.timePresets[userParams.timePreset];
  const maxSteps = advancedTemplates.calculateMaxSteps(targetTime);
  const actualSteps = userParams.steps || maxSteps;
  
  const response = { 
    shortId, 
    shortUrl: `${req.protocol}://${req.get('host')}/${shortId}`,
    original_url: url,
    config: {
      time: userParams.timePreset,
      steps: actualSteps,
      expiry: userParams.expiryPreset,
      estimatedTime: targetTime
    }
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