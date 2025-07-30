const express = require('express');
const router = express.Router();
const db = require('../config/database');
const clientFingerprint = require('../utils/client-fingerprint');
const freeTier = require('../config/free-tier-manager');

// POST /v/:shortId/regenerate - Rigenera percorso per cookie tamperato
router.post('/:shortId/regenerate', async (req, res) => {
  const { shortId } = req.params;
  
  freeTier.logDbOperation();
  const urlData = await db.getUrl(shortId);
  if (!urlData) {
    return res.status(404).json({ error: 'Link not found' });
  }
  
  const fingerprint = clientFingerprint.generateFingerprint(req);
  
  // DISABILITA ANTI-TAMPER per ora - causa loop infinito
  console.log(`[ANTI-TAMPER] Disabled to prevent infinite loop for ${fingerprint}`);
  
  res.json({ 
    status: 'disabled',
    message: 'Anti-tamper temporarily disabled'
  });
});

module.exports = router;