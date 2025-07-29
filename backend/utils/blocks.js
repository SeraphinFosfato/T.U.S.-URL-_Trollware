// Gestione blocchi e sequenze
const { timerBlocks, generateTimerHTML } = require('../blocks/timer');

// Pool di tutti i blocchi disponibili
const allBlocks = {
  ...timerBlocks
};

// Genera sequenza casuale di blocchi
function generateRandomSequence(count = 2) {
  const blockIds = Object.keys(allBlocks);
  const sequence = [];
  
  for (let i = 0; i < count; i++) {
    const randomId = blockIds[Math.floor(Math.random() * blockIds.length)];
    sequence.push(randomId);
  }
  
  return sequence;
}

// Genera HTML per un blocco specifico
function generateBlockHTML(blockId, nextUrl) {
  const block = allBlocks[blockId];
  
  if (!block) {
    return `<h1>Errore: Blocco non trovato</h1>`;
  }
  
  switch (block.template) {
    case 'timer':
      return generateTimerHTML(blockId, block.duration, nextUrl);
    default:
      return `<h1>Template non implementato: ${block.template}</h1>`;
  }
}

module.exports = { 
  allBlocks, 
  generateRandomSequence, 
  generateBlockHTML 
};