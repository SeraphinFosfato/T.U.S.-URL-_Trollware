// Gestione blocchi e sequenze
const { timerBlocks, generateTimerHTML, generatePunishTimerHTML } = require('../blocks/timer');
const { minigameBlocks, generateClickDecoyHTML, generateClickDrainHTML, generateClickProtectedHTML } = require('../blocks/minigame');
const { modularBlocks, generateModularTimerHTML, generateModularClickGameHTML, generateModularPunishTimerHTML } = require('../blocks/modular-blocks');
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
  
  // TEMP: Test with normal timer to avoid reload issues
  return ['timer_5s', 'click_decoy_popup'];
  
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
  // Check if it's a modular block (from modularBlocks)
  if (modularBlocks[blockId]) {
    // Use modular system
    const modularBlock = { ...block, id: blockId };
    switch (block.template) {
      case 'timer':
        blockContent = generateModularTimerHTML(modularBlock, null);
        break;
      case 'timer_punish':
        blockContent = generateModularPunishTimerHTML(modularBlock, null);
        break;
      case 'click_game':
        blockContent = generateModularClickGameHTML(modularBlock, null);
        break;
      default:
        blockContent = `<h1>Modular template not implemented: ${block.template}</h1>`;
    }
  } else {
    // Use legacy system
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
        blockContent = `<h1>Legacy template not implemented: ${block.template}</h1>`;
    }
  }
  
  // Handle different block content formats
  if (modularBlocks[blockId]) {
    // Modular blocks use template system
    const widgetWithStyles = blockContent;
    return renderTemplate(templateId, widgetWithStyles);
  } else {
    // Legacy blocks are complete HTML pages - return directly
    return blockContent;
  }
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