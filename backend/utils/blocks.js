// Gestione blocchi e sequenze
const { timerBlocks, generateTimerHTML, generatePunishTimerHTML } = require('../blocks/timer');
const { renderTemplate } = require('../templates/page-templates');

// Pool di tutti i blocchi disponibili
const allBlocks = {
  ...timerBlocks
};

// Genera sequenza casuale di blocchi
function generateRandomSequence(count = 2, testOverride = null) {
  // Testing override
  if (testOverride) {
    return testOverride;
  }
  
  // TEMP: Forza timer punitivi per test
  return ['timer_punish_15s', 'timer_punish_30s'];
  
  /* Codice originale per dopo:
  const blockIds = Object.keys(allBlocks);
  const sequence = [];
  
  for (let i = 0; i < count; i++) {
    const randomId = blockIds[Math.floor(Math.random() * blockIds.length)];
    sequence.push(randomId);
  }
  
  return sequence;
  */
}

// Genera HTML per un blocco specifico
function generateBlockHTML(blockId, nextUrl, templateId = 'simple_center') {
  const block = allBlocks[blockId];
  
  if (!block) {
    return `<h1>Error: Block not found</h1>`;
  }
  
  let blockContent;
  switch (block.template) {
    case 'timer':
      blockContent = generateTimerHTML(blockId, block.duration, nextUrl);
      break;
    case 'timer_punish':
      blockContent = generatePunishTimerHTML(blockId, block.duration, nextUrl);
      break;
    default:
      blockContent = `<h1>Template not implemented: ${block.template}</h1>`;
  }
  
  // Estrai solo il contenuto del widget dal blocco completo
  const widgetMatch = blockContent.match(/<div class="[^"]*(?:timer-container|loading-widget)[^"]*"[^>]*>.*?<\/div>/s);
  const widgetOnly = widgetMatch ? widgetMatch[0] : blockContent;
  
  return renderTemplate(templateId, widgetOnly);
}

module.exports = { 
  allBlocks, 
  generateRandomSequence, 
  generateBlockHTML 
};

// Testing helper - per forzare sequenze specifiche
function setTestSequence(sequence) {
  module.exports.testSequence = sequence;
}

module.exports.setTestSequence = setTestSequence;