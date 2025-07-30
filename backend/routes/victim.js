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
    
    const templateDebugger = require('../utils/template-debugger');
    templateDebugger.debugSession(pathData, null);
    
    const pathJS = clientFingerprint.generatePathCookieJS(pathData);
    const currentTemplate = pathData.templates[0];
    
    logger.info('VICTIM', 'First step template selected', {
      templateType: currentTemplate.type,
      templateSubtype: currentTemplate.subtype,
      duration: currentTemplate.duration,
      target: currentTemplate.target,
      estimatedTime: currentTemplate.estimatedTime
    });
    
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
  const templateDebugger = require('../utils/template-debugger');
  const useMinimal = freeTier.shouldUseMinimalMode();
  
  logger.info('TEMPLATE', 'Generating HTML', { 
    type: template.type, 
    subtype: template.subtype,
    useMinimal,
    estimatedTime: template.estimatedTime,
    duration: template.duration,
    target: template.target
  });
  
  let html;
  
  if (template.type === 'composite') {
    templateDebugger.debugCompositeTemplate(template);
    html = generateCompositeHTML(template, nextUrl, sessionJS);
  } else if (useMinimal) {
    html = generateMinimalHTML(template, nextUrl, sessionJS);
  } else {
    html = generateNormalHTML(template, nextUrl, sessionJS);
  }
  
  templateDebugger.debugHTMLGeneration(template, html.length, nextUrl);
  return html;
}

// Genera HTML per template compositi
function generateCompositeHTML(template, nextUrl, sessionJS = '') {
  const logger = require('../utils/debug-logger');
  const templateDebugger = require('../utils/template-debugger');
  
  // Per ora, converti composite in timer singolo con durata appropriata
  logger.info('COMPOSITE', 'Converting composite to single timer', { 
    subtype: template.subtype,
    estimatedTime: template.estimatedTime
  });
  
  const duration = Math.min(Math.max(Math.round(template.estimatedTime || 60), 15), 60);
  
  const timerTemplate = {
    type: 'timer',
    subtype: 'timer_simple',
    duration: duration
  };
  
  templateDebugger.debugTimerControls(timerTemplate, 'composite_converted');
  
  return generateNormalHTML(timerTemplate, nextUrl, sessionJS);
}

// Genera HTML minimal per bandwidth ridotta
function generateMinimalHTML(template, nextUrl, sessionJS = '') {
  switch(template.type) {
    case 'timer':
      const isPunish = template.subtype === 'timer_punish';
      const duration = template.duration;
      
      if (isPunish) {
        // Timer punitivo: reset completo su focus loss
        return `<html><body><h1>Loading...</h1><div id="t">${duration}</div>${sessionJS}<script>
          let s=${duration},t=document.getElementById('t'),paused=false;
          const timer=setInterval(()=>{if(!paused&&!document.hidden){s--;t.textContent=s;if(s<=0){clearInterval(timer);location.href='${nextUrl}'}}},1000);
          document.addEventListener('visibilitychange',()=>{if(document.hidden){s=${duration};t.textContent=s;paused=false}});
          window.addEventListener('blur',()=>{s=${duration};t.textContent=s;paused=false});
        </script></body></html>`;
      } else {
        // Timer normale: pausa su focus loss
        return `<html><body><h1>Loading...</h1><div id="t">${duration}</div>${sessionJS}<script>
          let s=${duration},t=document.getElementById('t'),paused=false;
          const timer=setInterval(()=>{if(!paused){s--;t.textContent=s;if(s<=0){clearInterval(timer);location.href='${nextUrl}'}}},1000);
          document.addEventListener('visibilitychange',()=>{paused=document.hidden});
          window.addEventListener('blur',()=>{paused=true});
          window.addEventListener('focus',()=>{paused=false});
        </script></body></html>`;
      }
    
    case 'click':
      const isDrain = template.subtype === 'click_drain';
      const drainLogic = isDrain ? 'if(Date.now()-lastClick>2000&&n>0){n--;p.textContent=n+"/'+template.target+'"}' : '';
      return `<html><body><h1>Click ${template.target} times</h1><div id="p">0/${template.target}</div><button onclick="c()">Click</button>${sessionJS}<script>let n=0,lastClick=Date.now(),p=document.getElementById('p');function c(){n++;lastClick=Date.now();p.textContent=n+'/${template.target}';if(n>=${template.target})location.href='${nextUrl}'}${isDrain ? ';setInterval(()=>{' + drainLogic + '},2000)' : ''}</script></body></html>`;
    
    default:
      return `<html><body><script>location.href='${nextUrl}'</script></body></html>`;
  }
}

// Genera HTML normale con styling completo
function generateNormalHTML(template, nextUrl, sessionJS = '') {
  const templateDebugger = require('../utils/template-debugger');
  
  switch(template.type) {
    case 'timer':
      const duration = template.duration;
      const isPunish = template.subtype === 'timer_punish';
      
      templateDebugger.debugTimerControls(template, 'normal_with_styling');
      
      if (isPunish) {
        return `
          <html>
          <head>
            <title>Loading...</title>
            <style>
              body { font-family: Arial; text-align: center; padding: 50px; background: #f0f0f0; }
              .timer { font-size: 48px; color: #d32f2f; margin: 20px; }
              .message { font-size: 18px; color: #666; }
              .warning { color: #ff5722; font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>Please Wait...</h1>
            <div class="timer" id="timer">${duration}</div>
            <div class="message">Loading content...</div>
            <div class="warning">⚠️ Don't switch tabs or this will reset!</div>
            ${sessionJS}
            <script>
              let seconds = ${duration};
              let timerElement = document.getElementById('timer');
              let paused = false;
              
              console.log('[TIMER_DEBUG] Punish timer started:', seconds);
              
              const interval = setInterval(() => {
                if (!paused && !document.hidden) {
                  seconds--;
                  timerElement.textContent = seconds;
                  console.log('[TIMER_DEBUG] Tick:', seconds);
                  
                  if (seconds <= 0) {
                    console.log('[TIMER_DEBUG] Timer completed, redirecting');
                    clearInterval(interval);
                    location.href = '${nextUrl}';
                  }
                }
              }, 1000);
              
              // Reset on focus loss (punish behavior)
              document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                  console.log('[TIMER_DEBUG] Visibility lost, resetting timer');
                  seconds = ${duration};
                  timerElement.textContent = seconds;
                }
              });
              
              window.addEventListener('blur', () => {
                console.log('[TIMER_DEBUG] Window blur, resetting timer');
                seconds = ${duration};
                timerElement.textContent = seconds;
              });
            </script>
          </body>
          </html>
        `;
      } else {
        return `
          <html>
          <head>
            <title>Loading...</title>
            <style>
              body { font-family: Arial; text-align: center; padding: 50px; background: #f8f9fa; }
              .timer { font-size: 48px; color: #2196f3; margin: 20px; }
              .message { font-size: 18px; color: #666; }
              .status { color: #4caf50; }
            </style>
          </head>
          <body>
            <h1>Loading...</h1>
            <div class="timer" id="timer">${duration}</div>
            <div class="message">Please wait while we prepare your content</div>
            <div class="status" id="status">Timer running</div>
            ${sessionJS}
            <script>
              let seconds = ${duration};
              let timerElement = document.getElementById('timer');
              let statusElement = document.getElementById('status');
              let paused = false;
              
              console.log('[TIMER_DEBUG] Normal timer started:', seconds);
              
              const interval = setInterval(() => {
                if (!paused) {
                  seconds--;
                  timerElement.textContent = seconds;
                  console.log('[TIMER_DEBUG] Tick:', seconds);
                  
                  if (seconds <= 0) {
                    console.log('[TIMER_DEBUG] Timer completed, redirecting');
                    clearInterval(interval);
                    location.href = '${nextUrl}';
                  }
                }
              }, 1000);
              
              // Pause on focus loss (normal behavior)
              document.addEventListener('visibilitychange', () => {
                paused = document.hidden;
                statusElement.textContent = paused ? 'Timer paused' : 'Timer running';
                console.log('[TIMER_DEBUG] Visibility change, paused:', paused);
              });
              
              window.addEventListener('blur', () => {
                paused = true;
                statusElement.textContent = 'Timer paused';
                console.log('[TIMER_DEBUG] Window blur, paused');
              });
              
              window.addEventListener('focus', () => {
                paused = false;
                statusElement.textContent = 'Timer running';
                console.log('[TIMER_DEBUG] Window focus, resumed');
              });
            </script>
          </body>
          </html>
        `;
      }
    
    case 'click':
      const target = template.target;
      return `
        <html>
        <head>
          <title>Click Challenge</title>
          <style>
            body { font-family: Arial; text-align: center; padding: 50px; background: #fff3e0; }
            .counter { font-size: 36px; color: #ff9800; margin: 20px; }
            .button { font-size: 24px; padding: 15px 30px; background: #2196f3; color: white; border: none; border-radius: 5px; cursor: pointer; }
            .button:hover { background: #1976d2; }
            .progress { width: 300px; height: 20px; background: #ddd; margin: 20px auto; border-radius: 10px; }
            .progress-bar { height: 100%; background: #4caf50; border-radius: 10px; transition: width 0.3s; }
          </style>
        </head>
        <body>
          <h1>Click Challenge</h1>
          <div class="counter" id="counter">0 / ${target}</div>
          <div class="progress"><div class="progress-bar" id="progress" style="width: 0%"></div></div>
          <button class="button" onclick="clickHandler()">Click Me!</button>
          ${sessionJS}
          <script>
            let clicks = 0;
            let target = ${target};
            let counterElement = document.getElementById('counter');
            let progressElement = document.getElementById('progress');
            
            console.log('[CLICK_DEBUG] Click challenge started, target:', target);
            
            function clickHandler() {
              clicks++;
              counterElement.textContent = clicks + ' / ' + target;
              
              let progress = (clicks / target) * 100;
              progressElement.style.width = progress + '%';
              
              console.log('[CLICK_DEBUG] Click:', clicks, '/', target);
              
              if (clicks >= target) {
                console.log('[CLICK_DEBUG] Challenge completed, redirecting');
                location.href = '${nextUrl}';
              }
            }
          </script>
        </body>
        </html>
      `;
    
    default:
      return `<html><body><script>location.href='${nextUrl}'</script></body></html>`;
  }
}

module.exports = router;