const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { generateShortId, isValidUrl } = require('../utils/shortener');
const { generateRandomSequence } = require('../utils/blocks');

// POST /api/shorten - Crea nuovo short URL
router.post('/shorten', (req, res) => {
  const { url } = req.body;
  
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'URL non valido' });
  }

  const shortId = generateShortId();
  const blocksSequence = generateRandomSequence(2); // 2 blocchi casuali
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

// GET /:shortId - Redirect con blocchi
router.get('/:shortId', (req, res) => {
  const { shortId } = req.params;
  const urlData = db.getUrl(shortId);
  
  if (!urlData) {
    return res.status(404).send('Link non trovato');
  }

  // Incrementa visite
  urlData.stats.visits++;
  
  // Inizia la sequenza di blocchi
  res.redirect(`/v/${shortId}`);
});

module.exports = router;