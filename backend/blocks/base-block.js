// Sistema modulare per blocchi con step interni
class BaseBlock {
  constructor(blockId, config) {
    this.blockId = blockId;
    this.config = config;
    this.currentInternalStep = 0;
    this.completed = false;
  }

  // Genera HTML per lo step interno corrente
  generateHTML(nextUrl, internalStep = 0) {
    this.currentInternalStep = internalStep;
    
    switch (this.config.template) {
      case 'timer':
        return this.generateTimerStep(nextUrl);
      case 'minigame':
        return this.generateMinigameStep(nextUrl);
      default:
        return `<h1>Template non implementato: ${this.config.template}</h1>`;
    }
  }

  // Step interni per timer
  generateTimerStep(nextUrl) {
    if (this.currentInternalStep === 0) {
      // Step 0: Timer countdown
      return this.generateTimerHTML(nextUrl);
    } else {
      // Step 1: Completato, mostra bottone
      return this.generateCompletedHTML(nextUrl);
    }
  }

  // Genera URL per step interno successivo
  getNextInternalUrl(baseUrl) {
    return `${baseUrl}?internal=${this.currentInternalStep + 1}`;
  }

  // Verifica se il blocco è completato
  isCompleted() {
    return this.completed;
  }
}

module.exports = BaseBlock;