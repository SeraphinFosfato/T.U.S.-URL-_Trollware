const express = require('express');
const router = express.Router();
const db = require('../config/database');
const clientFingerprint = require('../utils/client-fingerprint');
const advancedTemplates = require('../utils/advanced-template-system');
const { minimalTemplates } = require('../templates/minimal-templates');
const freeTier = require('../config/free-tier-manager');
const adSlotGenerator = require('../utils/ad-slot-generator');
const smartDistributor = require('../utils/smart-template-distributor');

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
  
  // Primo step: genera percorso con sistema avanzato
  if (currentStep === 0) {
    // Genera sequenza con nuovo sistema intelligente
    const sequenceData = advancedTemplates.generateIntelligentSequence(
      urlData.user_params,
      fingerprint,
      shortId
    );
    
    const pathData = {
      pathHash: clientFingerprint.generatePathHash(shortId, fingerprint),
      shortId,
      fingerprint,
      currentStep: 0,
      templates: sequenceData.sequence,
      metadata: sequenceData.metadata,
      completed: false,
      createdAt: Date.now(),
      expiresAt: Date.now() + (urlData.expiry_days * 24 * 60 * 60 * 1000)
    };
    
    // Salva percorso in DB
    await db.saveClientPath(pathData);
    
    // AGGIORNA SUBITO currentStep per evitare race condition
    await db.updateClientStep(pathData.pathHash, 0);
    
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
  
  logger.info('VICTIM', 'Checking session', { 
    hasCookie: !!pathCookie, 
    fingerprint,
    currentStep 
  });
  
  if (pathCookie && clientFingerprint.validatePath(pathCookie)) {
    const cookieData = clientFingerprint.decryptPath(pathCookie);
    if (cookieData && cookieData.shortId === shortId) {
      pathData = await db.getClientPath(cookieData.pathHash);
      logger.info('VICTIM', 'Cookie session found', { pathHash: cookieData.pathHash });
    }
  }
  
  // Fallback robusto: cerca per shortId + fingerprint
  if (!pathData) {
    logger.warn('VICTIM', 'Cookie session failed, trying DB fallback');
    const pathHash = clientFingerprint.generatePathHash(shortId, fingerprint);
    pathData = await db.getClientPath(pathHash);
    
    if (pathData) {
      logger.info('VICTIM', 'DB fallback successful', { pathHash });
    } else {
      // Ultimo tentativo: cerca qualsiasi sessione per questo shortId
      logger.warn('VICTIM', 'Trying emergency fallback by shortId');
      pathData = await db.getClientPathByShortId(shortId);
      if (pathData) {
        logger.info('VICTIM', 'Emergency fallback successful');
      } else {
        logger.error('VICTIM', 'Session completely lost', { shortId, fingerprint });
        return res.status(400).send('<h1>Session expired - <a href="/v/' + shortId + '">restart here</a></h1>');
      }
    }
  }
  
  // Verifica step progression con tolleranza
  if (currentStep !== pathData.currentStep + 1) {
    logger.warn('VICTIM', 'Invalid step sequence', {
      expected: pathData.currentStep + 1,
      received: currentStep,
      pathHash: pathData.pathHash
    });
    
    // Se è solo 1 step indietro, permetti (refresh page)
    if (currentStep === pathData.currentStep) {
      logger.info('VICTIM', 'Allowing same step (page refresh)');
    } else {
      return res.status(400).send('<h1>Invalid step sequence - <a href="/v/' + shortId + '">restart</a></h1>');
    }
  }
  
  // Se completato tutti i step
  if (currentStep >= pathData.templates.length) {
    await db.completeClientPath(pathData.pathHash);
    await db.updateStats(shortId, 'completed');
    return res.redirect(urlData.original_url);
  }
  
  // AGGIORNA step corrente PRIMA di generare HTML
  await db.updateClientStep(pathData.pathHash, currentStep);
  
  const currentTemplate = pathData.templates[currentStep];
  const nextStep = currentStep + 1;
  const nextUrl = nextStep >= pathData.templates.length ? 
    urlData.original_url : `/v/${shortId}/${nextStep}`;
  
  const blockHTML = generateStepHTML(currentTemplate, nextUrl);
  
  freeTier.logRequest(blockHTML.length);
  res.send(blockHTML);
}

// Usa SEMPRE template originali
function generateStepHTML(template, nextUrl, sessionJS = '') {
  // Calcola ad slots basati sul revenue del template
  const revenue = smartDistributor.calculateRevenue(template.subtype || template.type, 1.0);
  const enabledSlots = smartDistributor.calculateEnabledAdSlots(revenue);
  const adSlots = adSlotGenerator.generateAdSlots(enabledSlots);
  
  if (template.type === 'timer') {
    if (template.subtype === 'timer_punish') {
      return minimalTemplates.timer_punish('step', template.duration, nextUrl, adSlots) + sessionJS;
    } else {
      return minimalTemplates.timer('step', template.duration, nextUrl, adSlots) + sessionJS;
    }
  } else if (template.type === 'click') {
    if (template.subtype === 'click_teleport') {
      return minimalTemplates.click_teleport('step', template.target, nextUrl, adSlots) + sessionJS;
    } else if (template.subtype === 'click_racing') {
      return minimalTemplates.click_racing('step', template.params || {drain: 1.2}, nextUrl, adSlots) + sessionJS;
    } else if (template.subtype === 'click_racing_rigged') {
      return minimalTemplates.click_racing_rigged('step', template.params || {realDuration: 20, maxProgress: 80, resetPoint: 25}, nextUrl, adSlots) + sessionJS;
    } else {
      return minimalTemplates.click('step', template.target, nextUrl, adSlots) + sessionJS;
    }
  } else if (template.type === 'composite') {
    // ERRORE CRITICO: I template compositi non dovrebbero mai arrivare qui!
    // Dovrebbero essere già stati espansi in step atomici dal sistema intelligente
    const logger = require('../utils/debug-logger');
    logger.error('VICTIM', 'COMPOSITE TEMPLATE IN generateStepHTML - QUESTO È IL BUG!', {
      template,
      nextUrl
    });
    
    // Fallback di emergenza
    const duration = Math.min(Math.max(Math.round(template.estimatedTime || 60), 15), 60);
    return minimalTemplates.timer('step', duration, nextUrl, adSlots) + sessionJS;
  }
  return `<html><body><script>location.href='${nextUrl}'</script></body></html>`;
}

module.exports = router;