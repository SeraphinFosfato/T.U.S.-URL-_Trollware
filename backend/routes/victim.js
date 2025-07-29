const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { generateBlockHTML } = require('../utils/blocks');

// GET /v/:shortId/:step - Gestisce i step dei blocchi
router.get('/v/:shortId/:step?', (req, res) => {
  const { shortId, step } = req.params;
  const currentStep = parseInt(step) || 0;
  
  const urlData = db.getUrl(shortId);
  if (!urlData) {
    return res.status(404).send('<h1>Link non trovato</h1>');
  }
  
  // Se abbiamo completato tutti i blocchi, redirect finale
  if (currentStep >= urlData.blocks_sequence.length) {
    urlData.stats.completed++;
    return res.redirect(urlData.original_url);
  }
  
  // Ottieni il blocco corrente
  const currentBlockId = urlData.blocks_sequence[currentStep];
  const nextStep = currentStep + 1;
  const nextUrl = `/v/${shortId}/${nextStep}`;
  
  // Genera HTML del blocco
  const blockHTML = generateBlockHTML(currentBlockId, nextUrl);
  res.send(blockHTML);
});

module.exports = router;