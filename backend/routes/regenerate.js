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
  
  // Genera nuovo percorso con penalità (step extra)
  const penaltySteps = Math.min(urlData.total_steps + 1, 5); // Max 5 step
  const pathData = clientFingerprint.generateClientPath(
    shortId, 
    fingerprint,
    penaltySteps, // Step extra come punizione
    urlData.expiry_days
  );
  
  // Salva nuovo percorso
  await db.saveClientPath(pathData);
  
  console.log(`[ANTI-TAMPER] Regenerated path for ${fingerprint} with ${penaltySteps} steps (penalty: +${penaltySteps - urlData.total_steps})`);
  
  res.json({ 
    status: 'regenerated',
    penalty_steps: penaltySteps - urlData.total_steps,
    message: 'Path regenerated due to tampering detection'
  });
});

module.exports = router;