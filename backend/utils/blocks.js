// Gestione blocchi modulari
const { modularBlocks, generateModularTimerHTML, generateModularClickGameHTML, generateModularPunishTimerHTML, generateModularCompositeHTML, generateAtomicSequenceHTML } = require('../blocks/modular-blocks');
const { renderTemplate } = require('../templates/page-templates');

// Pool di blocchi modulari
const allBlocks = modularBlocks;

// Genera sequenza di blocchi atomici (RNG ATTIVO)
function generateRandomSequence(count = 2, testOverride = null) {
  if (testOverride) {
    return testOverride;
  }
  
  // RNG FORZATO per debug
  return [
    { type: 'timer', subtype: 'timer_simple', duration: 15, estimatedTime: 15 },
    { type: 'click', subtype: 'click_simple', target: 5, estimatedTime: 2.5 },
    { type: 'timer', subtype: 'timer_punish', duration: 20, estimatedTime: 30 }
  ];
}

// Genera HTML per sequenza di blocchi (USA SISTEMA AVANZATO)
function generateBlockHTML(template, nextUrl, templateId = 'simple_center') {
  // Usa sempre minimal templates per compatibilità
  const { minimalTemplates } = require('../templates/minimal-templates');
  
  if (template.type === 'timer') {
    return minimalTemplates.timer('step', template.duration, nextUrl);
  } else if (template.type === 'click') {
    return minimalTemplates.click('step', template.target, nextUrl);
  } else if (template.type === 'composite') {
    // Per compositi, usa il primo elemento della sequenza
    const firstStep = template.sequence[0];
    if (firstStep.type === 'timer') {
      return minimalTemplates.timer('step', firstStep.duration, nextUrl);
    } else if (firstStep.type === 'click') {
      return minimalTemplates.click('step', firstStep.target, nextUrl);
    }
  }
  
  return `<html><body><script>location.href='${nextUrl}'</script></body></html>`;
}

module.exports = { 
  allBlocks, 
  generateRandomSequence, 
  generateBlockHTML 
};