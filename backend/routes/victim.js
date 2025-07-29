const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { generateBlockHTML } = require('../utils/blocks');

// GET /:shortId/:step - Step successivi
router.get('/:shortId/:step', async (req, res) => {
  const currentStep = parseInt(req.params.step) || 0;
  await handleVictimStep(req, res, currentStep);
});

// GET /:shortId - Primo step (step 0)
router.get('/:shortId', async (req, res) => {
  await handleVictimStep(req, res, 0);
});

async function handleVictimStep(req, res, currentStep) {
  const { shortId } = req.params;
  
  let urlData = await db.getUrl(shortId);
  if (!urlData) {
    if (/^\d+$/.test(shortId)) {
      return res.status(404).send('<h1>Session expired - please create a new link</h1>');
    }
    return res.status(404).send('<h1>Link not found</h1>');
  }
  
  // Se abbiamo completato tutti i blocchi, redirect finale
  if (currentStep >= urlData.blocks_sequence.length) {
    await db.updateStats(shortId, 'completed');
    return res.redirect(urlData.original_url);
  }
  
  // Ottieni il blocco/sequenza corrente
  const currentBlock = urlData.blocks_sequence[currentStep];
  const nextStep = currentStep + 1;
  const nextUrl = nextStep >= urlData.blocks_sequence.length ? 
    urlData.original_url : `/v/${shortId}/${nextStep}`;
  
  // Genera HTML del blocco/sequenza
  const templateId = req.query.template || 'simple_center';
  const blockHTML = generateBlockHTML(currentBlock, nextUrl, templateId);
  res.send(blockHTML);
}

module.exports = router;