const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { generateBlockHTML } = require('../utils/blocks');

// GET /v/:shortId - Primo step (step 0)
router.get('/v/:shortId', (req, res) => {
  handleVictimStep(req, res, 0);
});

// GET /v/:shortId/:step - Step successivi
router.get('/v/:shortId/:step', (req, res) => {
  const currentStep = parseInt(req.params.step) || 0;
  handleVictimStep(req, res, currentStep);
});

function handleVictimStep(req, res, currentStep) {
  const { shortId } = req.params;
  
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
  const nextUrl = nextStep >= urlData.blocks_sequence.length ? 
    urlData.original_url : `/v/${shortId}/${nextStep}`;
  
  // Genera HTML del blocco
  const blockHTML = generateBlockHTML(currentBlockId, nextUrl);
  res.send(blockHTML);
}

module.exports = router;