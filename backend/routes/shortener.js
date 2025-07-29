const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { generateShortId, isValidUrl } = require('../utils/shortener');
const { generateRandomSequence } = require('../utils/blocks');

// POST /api/shorten - Crea nuovo short URL
router.post('/shorten', (req, res) => {
  const { url } = req.body;
  
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const shortId = generateShortId();
  // Check for test override
  const testBlocks = req.query.test ? req.query.test.split(',') : null;
  const blocksSequence = generateRandomSequence(2, testBlocks);
  db.saveUrl(shortId, { 
    original_url: url,
    blocks_sequence: blocksSequence 
  });
  
  res.json({ 
    shortId, 
    shortUrl: `${req.protocol}://${req.get('host')}/${shortId}`,
    original_url: url 
  });
});

// GET /:shortId - Redirect con blocchi (solo se non inizia con 'v')
router.get('/:shortId', (req, res) => {
  const { shortId } = req.params;
  
  // Skip se è una route /v/...
  if (shortId === 'v') {
    return res.status(404).send('Not found');
  }
  
  const urlData = db.getUrl(shortId);
  
  if (!urlData) {
    return res.status(404).send('Link not found');
  }

  // Incrementa visite
  urlData.stats.visits++;
  
  // Inizia la sequenza di blocchi
  res.redirect(`/v/${shortId}`);
});

module.exports = router;