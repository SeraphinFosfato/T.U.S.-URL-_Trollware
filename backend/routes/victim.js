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
  console.log(`DEBUG: Route called with shortId: ${req.params.shortId}, step: ${req.params.step}`);
  handleVictimStep(req, res, currentStep);
});

function handleVictimStep(req, res, currentStep) {
  const { shortId } = req.params;
  
  const urlData = db.getUrl(shortId);
  if (!urlData) {
    console.log(`DEBUG: URL not found for shortId: ${shortId}`);
    console.log('Available URLs:', Object.keys(db.urls || {}));
    return res.status(404).send('<h1>Link not found</h1>');
  }
  
  // Se abbiamo completato tutti i blocchi, redirect finale
  if (currentStep >= urlData.blocks_sequence.length) {
    if (urlData.stats) urlData.stats.completed++;
    console.log(`DEBUG: Redirecting to: ${urlData.original_url}`);
    return res.redirect(urlData.original_url);
  }
  
  // Ottieni il blocco corrente
  const currentBlockId = urlData.blocks_sequence[currentStep];
  const nextStep = currentStep + 1;
  const nextUrl = nextStep >= urlData.blocks_sequence.length ? 
    urlData.original_url : `/v/${shortId}/${nextStep}`;
  
  // Genera HTML del blocco con template
  const templateId = req.query.template || 'simple_center';
  const blockHTML = generateBlockHTML(currentBlockId, nextUrl, templateId);
  res.send(blockHTML);
}

module.exports = router;