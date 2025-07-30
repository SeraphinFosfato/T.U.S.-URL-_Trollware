const express = require('express');
const router = express.Router();
const db = require('../config/database');
const clientFingerprint = require('../utils/client-fingerprint');
const advancedTemplates = require('../utils/advanced-template-system');
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
  
  // Primo step: genera percorso con sistema avanzato
  if (currentStep === 0) {
    // Genera sequenza con vincoli utente
    const sequenceData = advancedTemplates.generateConstrainedSequence(
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
    
    const pathJS = clientFingerprint.generatePathCookieJS(pathData);
    const currentTemplate = pathData.templates[0];
    
    const nextUrl = `/v/${shortId}/1`;
    const blockHTML = generateAdvancedStepHTML(currentTemplate, nextUrl, pathJS);
    
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
  
  const blockHTML = generateAdvancedStepHTML(currentTemplate, nextUrl);
  
  freeTier.logRequest(blockHTML.length);
  res.send(blockHTML);
}

// Genera HTML avanzato per template
function generateAdvancedStepHTML(template, nextUrl, sessionJS = '') {
  const logger = require('../utils/debug-logger');
  const useMinimal = freeTier.shouldUseMinimalMode();
  
  logger.debug('TEMPLATE', 'Generating HTML', { 
    type: template.type, 
    subtype: template.subtype,
    useMinimal,
    estimatedTime: template.estimatedTime
  });
  
  if (template.type === 'composite') {
    return generateCompositeHTML(template, nextUrl, sessionJS);
  }
  
  if (useMinimal) {
    return generateMinimalHTML(template, nextUrl, sessionJS);
  }
  
  return generateNormalHTML(template, nextUrl, sessionJS);
}

// Genera HTML per template compositi
function generateCompositeHTML(template, nextUrl, sessionJS = '') {
  // Per ora, usa il primo componente della sequenza
  // TODO: Implementare rendering simultaneo per template misti
  const firstComponent = template.sequence[0];
  return generateAdvancedStepHTML(firstComponent, nextUrl, sessionJS);
}

// Genera HTML minimal per bandwidth ridotta
function generateMinimalHTML(template, nextUrl, sessionJS = '') {
  switch(template.type) {
    case 'timer':
      const isPunish = template.subtype === 'timer_punish';
      const resetOnBlur = isPunish ? 'if(document.hidden){s=' + template.duration + ';t.textContent=s;}' : '';
      return `<html><body><h1>Loading...</h1><div id="t">${template.duration}</div>${sessionJS}<script>let s=${template.duration},t=document.getElementById('t');setInterval(()=>{${resetOnBlur}if(!document.hidden){s--;t.textContent=s;if(s<=0)location.href='${nextUrl}'}},1000)</script></body></html>`;
    
    case 'click':
      const isDrain = template.subtype === 'click_drain';
      const drainLogic = isDrain ? 'if(Date.now()-lastClick>2000&&n>0){n--;p.textContent=n+"/'+template.target+'"}' : '';
      return `<html><body><h1>Click ${template.target} times</h1><div id="p">0/${template.target}</div><button onclick="c()">Click</button>${sessionJS}<script>let n=0,lastClick=Date.now(),p=document.getElementById('p');function c(){n++;lastClick=Date.now();p.textContent=n+'/${template.target}';if(n>=${template.target})location.href='${nextUrl}'}${isDrain ? ';setInterval(()=>{' + drainLogic + '},2000)' : ''}</script></body></html>`;
    
    default:
      return `<html><body><script>location.href='${nextUrl}'</script></body></html>`;
  }
}

// Genera HTML normale con styling
function generateNormalHTML(template, nextUrl, sessionJS = '') {
  switch(template.type) {
    case 'timer':
      const duration = template.duration;
      const isPunish = template.subtype === 'timer_punish';
      return minimalTemplates.timer('step', duration, nextUrl) + sessionJS;
    
    case 'click':
      const target = template.target;
      return minimalTemplates.click('step', target, nextUrl) + sessionJS;
    
    default:
      return `<html><body><script>location.href='${nextUrl}'</script></body></html>`;
  }
}

module.exports = router;