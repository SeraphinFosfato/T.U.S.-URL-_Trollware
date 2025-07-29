const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { generateShortId, isValidUrl } = require('../utils/shortener');
const { generateRandomSequence } = require('../utils/blocks');

// POST /api/shorten - Crea nuovo short URL
router.post('/shorten', async (req, res) => {
  const { url } = req.body;
  console.log(`DEBUG: Received URL: '${url}', type: ${typeof url}`);
  
  if (!url || !isValidUrl(url)) {
    console.log(`DEBUG: URL validation failed for: '${url}'`);
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const shortId = generateShortId();
  // Check for test override
  const testBlocks = req.query.test ? req.query.test.split(',') : null;
  const blocksSequence = generateRandomSequence(2, testBlocks);
  
  const saved = await db.saveUrl(shortId, { 
    original_url: url,
    blocks_sequence: blocksSequence 
  });
  
  if (!saved) {
    return res.status(500).json({ error: 'Database error' });
  }
  
  res.json({ 
    shortId, 
    shortUrl: `${req.protocol}://${req.get('host')}/${shortId}`,
    original_url: url 
  });
});

// GET /:shortId - Redirect con blocchi (solo se non inizia con 'v')
router.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;
  console.log(`DEBUG: /:shortId route called with shortId: ${shortId}, full URL: ${req.url}`);
  
  // Skip se è una route /v/...
  if (shortId === 'v') {
    console.log('DEBUG: Skipping /v route');
    return res.status(404).send('Not found');
  }
  
  const urlData = await db.getUrl(shortId);
  
  if (!urlData) {
    return res.status(404).send('Link not found');
  }

  // Incrementa visite
  await db.updateStats(shortId, 'visits');
  
  // Inizia la sequenza di blocchi
  res.redirect(`/v/${shortId}`);
});

module.exports = router;