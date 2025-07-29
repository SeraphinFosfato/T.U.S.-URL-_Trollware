// Gestione blocchi modulari
const { modularBlocks, generateModularTimerHTML, generateModularClickGameHTML, generateModularPunishTimerHTML, generateModularCompositeHTML, generateAtomicSequenceHTML } = require('../blocks/modular-blocks');
const { renderTemplate } = require('../templates/page-templates');

// Pool di blocchi modulari
const allBlocks = modularBlocks;

// Genera sequenza di blocchi atomici
function generateRandomSequence(count = 2, testOverride = null) {
  if (testOverride) {
    return testOverride;
  }
  
  return [
    // Step 1: Timer Punitivo + Click Challenge
    [
      { id: 'timer_punish', type: 'atomic' },
      { id: 'click_simple', type: 'atomic' }
    ],
    // Step 2: Timer normale singolo
    'timer_simple'
  ];
}

// Genera HTML per sequenza di blocchi
function generateBlockHTML(blockSequence, nextUrl, templateId = 'simple_center') {
  // Se è una sequenza atomica
  if (Array.isArray(blockSequence) && blockSequence[0]?.type === 'atomic') {
    return generateAtomicSequenceHTML(blockSequence, nextUrl);
  }
  
  // Fallback per blocchi singoli (legacy)
  const blockId = Array.isArray(blockSequence) ? blockSequence[0]?.id || blockSequence[0] : blockSequence;
  const block = allBlocks[blockId];
  
  if (!block) {
    return `<h1>Block not found: ${blockId}</h1>`;
  }
  
  // Risolvi durate dinamiche
  const modularBlock = { ...block, id: blockId, nextUrl };
  if (typeof block.duration === 'function') {
    modularBlock.duration = block.duration();
  }
  
  let blockContent;
  
  switch (block.template) {
    case 'timer':
      blockContent = generateModularTimerHTML(modularBlock, { nextUrl, enabled: true });
      break;
    case 'timer_punish':
      blockContent = generateModularPunishTimerHTML(modularBlock, { nextUrl, enabled: true });
      break;
    case 'click_game':
      blockContent = generateModularClickGameHTML(modularBlock, { nextUrl, enabled: true });
      break;
    case 'composite':
      blockContent = generateModularCompositeHTML(modularBlock, nextUrl);
      break;
    default:
      return `<h1>Template not implemented: ${block.template}</h1>`;
  }
  
  // Per blocchi singoli, aggiungi event system
  const { BlockEventSystem } = require('../blocks/block-event-system');
  const fullHTML = `
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <title>Loading...</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f0f0f0;
          margin: 0;
          padding: 20px;
        }
      </style>
    </head>
    <body>
      ${BlockEventSystem.generateEventSystemJS()}
      ${blockContent}
    </body>
    </html>
  `;
  
  return fullHTML;
}

module.exports = { 
  allBlocks, 
  generateRandomSequence, 
  generateBlockHTML 
};