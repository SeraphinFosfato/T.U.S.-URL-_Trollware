// Gestione blocchi e sequenze
const { timerBlocks, generateTimerHTML, generatePunishTimerHTML } = require('../blocks/timer');
const { minigameBlocks, generateClickDecoyHTML, generateClickDrainHTML, generateClickProtectedHTML } = require('../blocks/minigame');
const { modularBlocks, generateModularTimerHTML, generateModularClickGameHTML } = require('../blocks/modular-blocks');
const { renderTemplate } = require('../templates/page-templates');

// Pool di tutti i blocchi disponibili
const allBlocks = {
  ...timerBlocks,
  ...minigameBlocks,
  ...modularBlocks
};

// Genera sequenza casuale di blocchi
function generateRandomSequence(count = 2, testOverride = null) {
  // Testing override
  if (testOverride) {
    return testOverride;
  }
  
  // TEMP: Test modular blocks
  return ['timer_5s', 'click_simple'];
  
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
    case 'click_decoy':
      blockContent = generateClickDecoyHTML(blockId, block.target_clicks, nextUrl);
      break;
    case 'click_drain':
      blockContent = generateClickDrainHTML(blockId, block.target_clicks, block.drain_speed, nextUrl);
      break;
    case 'click_protected':
      blockContent = generateClickProtectedHTML(blockId, block.timer_duration, block.target_clicks, nextUrl);
      break;
    default:
      blockContent = `<h1>Template not implemented: ${block.template}</h1>`;
  }
  
  // Estrai CSS dal head
  const styleMatch = blockContent.match(/<style[^>]*>(.*?)<\/style>/s);
  const styles = styleMatch ? styleMatch[0] : '';
  
  // Estrai contenuto body
  const bodyMatch = blockContent.match(/<body[^>]*>(.*?)<\/body>/s);
  const bodyContent = bodyMatch ? bodyMatch[1] : blockContent;
  
  // Combina stili + contenuto
  const widgetWithStyles = styles + bodyContent;
  
  return renderTemplate(templateId, widgetWithStyles);
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