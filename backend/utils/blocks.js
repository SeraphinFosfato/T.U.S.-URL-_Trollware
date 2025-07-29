// Gestione blocchi e sequenze
const { timerBlocks, generateTimerHTML, generatePunishTimerHTML } = require('../blocks/timer');
const { minigameBlocks, generateClickDecoyHTML, generateClickDrainHTML, generateClickProtectedHTML } = require('../blocks/minigame');
const { modularBlocks, generateModularTimerHTML, generateModularClickGameHTML, generateModularPunishTimerHTML } = require('../blocks/modular-blocks');
const { renderTemplate } = require('../templates/page-templates');

// Pool di tutti i blocchi disponibili - SOLO MODULAR
const allBlocks = {
  ...modularBlocks
};

// Genera sequenza casuale di blocchi
function generateRandomSequence(count = 2, testOverride = null) {
  // Testing override
  if (testOverride) {
    return testOverride;
  }
  
  // Full modular system
  return ['timer_simple', 'click_simple'];
  
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

// Genera HTML per un blocco specifico - SOLO MODULAR
function generateBlockHTML(blockId, nextUrl, templateId = 'simple_center') {
  console.log(`DEBUG: generateBlockHTML called with blockId: ${blockId}, nextUrl: ${nextUrl}`);
  const block = modularBlocks[blockId];
  
  if (!block) {
    return `<h1>Error: Modular block not found: ${blockId}</h1>`;
  }
  
  const modularBlock = { ...block, id: blockId, nextUrl };
  let blockContent;
  
  switch (block.template) {
    case 'timer':
      blockContent = generateModularTimerHTML(modularBlock, nextUrl);
      break;
    case 'timer_punish':
      blockContent = generateModularPunishTimerHTML(modularBlock, nextUrl);
      break;
    case 'click_game':
      blockContent = generateModularClickGameHTML(modularBlock, nextUrl);
      break;
    default:
      blockContent = `<h1>Modular template not implemented: ${block.template}</h1>`;
  }
  
  return renderTemplate(templateId, blockContent);
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