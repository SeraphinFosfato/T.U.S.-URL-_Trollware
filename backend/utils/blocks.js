// Gestione blocchi modulari
const { modularBlocks, generateModularTimerHTML, generateModularClickGameHTML, generateModularPunishTimerHTML } = require('../blocks/modular-blocks');
const { renderTemplate } = require('../templates/page-templates');

// Pool di blocchi modulari
const allBlocks = modularBlocks;

// Genera sequenza di blocchi modulari
function generateRandomSequence(count = 2, testOverride = null) {
  if (testOverride) {
    return testOverride;
  }
  
  return ['timer_simple', 'click_simple'];
}

// Genera HTML per blocco modulare
function generateBlockHTML(blockId, nextUrl, templateId = 'simple_center') {
  const block = allBlocks[blockId];
  
  if (!block) {
    return `<h1>Block not found: ${blockId}</h1>`;
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
      return `<h1>Template not implemented: ${block.template}</h1>`;
  }
  
  return renderTemplate(templateId, blockContent);
}

module.exports = { 
  allBlocks, 
  generateRandomSequence, 
  generateBlockHTML 
};