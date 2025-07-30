const express = require('express');
const router = express.Router();
const db = require('../config/database');
const clientFingerprint = require('../utils/client-fingerprint');
const { minimalTemplates } = require('../templates/minimal-templates');
const freeTier = require('../config/free-tier-manager');

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
  const logger = require('../utils/debug-logger');
  
  logger.info('VICTIM', `Step ${currentStep} requested for ${shortId}`);
  
  freeTier.logDbOperation();
  let urlData = await db.getUrl(shortId);
  if (!urlData) {
    logger.warn('VICTIM', `Link not found: ${shortId}`);
    return res.status(404).send('<h1>Link not found or expired</h1>');
  }
  
  // Genera fingerprint client
  const fingerprint = clientFingerprint.generateFingerprint(req);
  logger.info('VICTIM', `Processing step ${currentStep} for fingerprint ${fingerprint}`, { shortId });
  
  // Primo step: genera percorso client specifico
  if (currentStep === 0) {
    const pathData = clientFingerprint.generateClientPath(
      shortId, 
      fingerprint,
      urlData.total_steps, 
      urlData.expiry_days
    );
    
    // Salva percorso in DB
    await db.saveClientPath(pathData);
    
    const pathJS = clientFingerprint.generatePathCookieJS(pathData);
    const currentTemplate = pathData.templates[0];
    
    const nextUrl = `/v/${shortId}/1`;
    const blockHTML = generateStepHTML(currentTemplate, nextUrl, pathJS);
    
    freeTier.logRequest(blockHTML.length);
    return res.send(blockHTML);
  }
  
  // Step successivi: recupera percorso da cookie o DB
  let pathData = null;
  const pathCookie = req.cookies.troll_path;
  
  if (pathCookie && clientFingerprint.validatePath(pathCookie)) {
    const cookieData = clientFingerprint.decryptPath(pathCookie);
    if (cookieData && cookieData.shortId === shortId) {
      pathData = await db.getClientPath(cookieData.pathHash);
    }
  }
  
  // Fallback: cerca per shortId + fingerprint
  if (!pathData) {
    return res.status(400).send('<h1>Session expired - please restart</h1>');
  }
  
  // Verifica step progression
  if (currentStep !== pathData.currentStep + 1) {
    return res.status(400).send('<h1>Invalid step sequence</h1>');
  }
  
  // Se completato tutti i step
  if (currentStep >= pathData.templates.length) {
    await db.completeClientPath(pathData.pathHash);
    await db.updateStats(shortId, 'completed');
    return res.redirect(urlData.original_url);
  }
  
  // Aggiorna step corrente
  await db.updateClientStep(pathData.pathHash, currentStep);
  
  const currentTemplate = pathData.templates[currentStep];
  const nextStep = currentStep + 1;
  const nextUrl = nextStep >= pathData.templates.length ? 
    urlData.original_url : `/v/${shortId}/${nextStep}`;
  
  const blockHTML = generateStepHTML(currentTemplate, nextUrl);
  
  freeTier.logRequest(blockHTML.length);
  res.send(blockHTML);
}

// Genera HTML per step usando template minimal
function generateStepHTML(template, nextUrl, sessionJS = '') {
  const useMinimal = freeTier.shouldUseMinimalMode();
  
  if (useMinimal) {
    // Modalità ultra-minimal per risparmiare bandwidth
    switch(template.type) {
      case 'timer':
      case 'timer_punish':
        return `<html><body><h1>Loading...</h1><div id="t">${template.duration}</div>${sessionJS}<script>let s=${template.duration};setInterval(()=>{if(!document.hidden){s--;document.getElementById('t').textContent=s;if(s<=0)location.href='${nextUrl}'}},1000)</script></body></html>`;
      case 'click':
      case 'click_drain':
        return `<html><body><h1>Click ${template.target} times</h1><div id="p">0/${template.target}</div><button onclick="c()">Click</button>${sessionJS}<script>let n=0;function c(){n++;document.getElementById('p').textContent=n+'/${template.target}';if(n>=${template.target})location.href='${nextUrl}'}</script></body></html>`;
    }
  }
  
  // Modalità normale con template minimal
  switch(template.type) {
    case 'timer':
    case 'timer_punish':
      return minimalTemplates.timer('step', template.duration, nextUrl) + sessionJS;
    case 'click':
    case 'click_drain':
      return minimalTemplates.click('step', template.target, nextUrl) + sessionJS;
    default:
      return `<html><body><script>location.href='${nextUrl}'</script></body></html>`;
  }
}

module.exports = router;