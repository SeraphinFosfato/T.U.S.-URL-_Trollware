const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { generateBlockHTML } = require('../utils/blocks');

// GET /v/:shortId/:step - Step successivi (PRIMA per priorità)
router.get('/v/:shortId/:step', (req, res) => {
  const currentStep = parseInt(req.params.step) || 0;
  console.log(`DEBUG: /v/:shortId/:step route called with shortId: ${req.params.shortId}, step: ${req.params.step}`);
  handleVictimStep(req, res, currentStep);
});

// GET /v/:shortId - Primo step (step 0) (DOPO)
router.get('/v/:shortId', (req, res) => {
  console.log(`DEBUG: /v/:shortId route called with shortId: ${req.params.shortId}`);
  handleVictimStep(req, res, 0);
});

function handleVictimStep(req, res, currentStep) {
  const { shortId } = req.params;
  
  let urlData = db.getUrl(shortId);
  if (!urlData) {
    console.log(`DEBUG: URL not found for shortId: ${shortId}`);
    console.log('Available URLs:', Array.from(db.urls.keys()));
    
    // Fallback: se il shortId sembra essere un numero, potrebbe essere un parsing error
    if (/^\d+$/.test(shortId)) {
      console.log('DEBUG: Numeric shortId detected, possible parsing error');
      return res.status(404).send('<h1>Session expired - please create a new link</h1>');
    }
    
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
  
  console.log(`DEBUG: Generating block ${currentBlockId} with nextUrl: ${nextUrl}`);
  
  // Genera HTML del blocco con template
  const templateId = req.query.template || 'simple_center';
  const blockHTML = generateBlockHTML(currentBlockId, nextUrl, templateId);
  res.send(blockHTML);
}

module.exports = router;