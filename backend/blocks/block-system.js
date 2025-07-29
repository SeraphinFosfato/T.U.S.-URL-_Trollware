// Sistema modulare per blocchi puzzle
class BlockSystem {
  constructor(containerId) {
    this.containerId = containerId;
    this.blocks = new Map();
    this.activeBlocks = new Set();
    this.completedBlocks = new Set();
    this.eventListeners = new Map();
  }

  // Registra un blocco nel sistema
  registerBlock(blockId, blockConfig) {
    this.blocks.set(blockId, {
      ...blockConfig,
      id: blockId,
      enabled: false,
      completed: false,
      visible: false,
      data: {}
    });
  }

  // Abilita un blocco
  enableBlock(blockId, inputData = {}) {
    const block = this.blocks.get(blockId);
    if (!block) return false;

    block.enabled = true;
    block.data = { ...block.data, ...inputData };
    this.activeBlocks.add(blockId);
    
    this.renderBlock(blockId);
    this.emit('blockEnabled', { blockId, block });
    return true;
  }

  // Completa un blocco
  completeBlock(blockId, outputData = {}) {
    const block = this.blocks.get(blockId);
    if (!block) return false;

    block.completed = true;
    block.data = { ...block.data, ...outputData };
    this.completedBlocks.add(blockId);
    this.activeBlocks.delete(blockId);

    this.emit('blockCompleted', { blockId, block, outputData });
    
    // Trigger onComplete actions
    if (block.onComplete) {
      block.onComplete.forEach(action => {
        this.executeAction(action, outputData);
      });
    }

    return true;
  }

  // Esegue azioni (enable altri blocchi, etc)
  executeAction(action, data) {
    if (typeof action === 'string') {
      // Semplice enable
      this.enableBlock(action, data);
    } else if (typeof action === 'object') {
      switch (action.type) {
        case 'enable':
          this.enableBlock(action.target, data);
          break;
        case 'redirect':
          window.location.href = action.url;
          break;
        case 'callback':
          if (action.callback) action.callback(data);
          break;
      }
    }
  }

  // Renderizza un blocco nel container
  renderBlock(blockId) {
    const block = this.blocks.get(blockId);
    if (!block || !block.enabled) return;

    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Crea wrapper per il blocco
    const blockWrapper = document.createElement('div');
    blockWrapper.id = `block-${blockId}`;
    blockWrapper.className = 'block-wrapper';
    blockWrapper.style.cssText = `
      margin: 10px 0;
      max-width: 500px;
      min-height: 200px;
    `;

    // Genera HTML del blocco
    const blockHTML = this.generateBlockHTML(block);
    blockWrapper.innerHTML = blockHTML;

    container.appendChild(blockWrapper);
    block.visible = true;

    // Setup event handlers per questo blocco
    this.setupBlockEvents(blockId, blockWrapper);
  }

  // Genera HTML specifico per tipo di blocco
  generateBlockHTML(block) {
    const blockSystem = this; // Reference per callback

    switch (block.template) {
      case 'timer':
        return this.generateTimerHTML(block, blockSystem);
      case 'click_game':
        return this.generateClickGameHTML(block, blockSystem);
      default:
        return `<div>Unknown block type: ${block.template}</div>`;
    }
  }

  // Setup eventi specifici del blocco
  setupBlockEvents(blockId, wrapper) {
    // Gli eventi vengono gestiti tramite data attributes e event delegation
    wrapper.addEventListener('click', (e) => {
      if (e.target.dataset.blockAction) {
        this.handleBlockAction(blockId, e.target.dataset.blockAction, e.target.dataset);
      }
    });
  }

  // Gestisce azioni dei blocchi
  handleBlockAction(blockId, action, data) {
    const block = this.blocks.get(blockId);
    if (!block) return;

    switch (action) {
      case 'complete':
        this.completeBlock(blockId, { result: data.result || 'completed' });
        break;
      case 'increment':
        block.data.progress = (block.data.progress || 0) + 1;
        this.updateBlockDisplay(blockId);
        break;
    }
  }

  // Aggiorna display di un blocco
  updateBlockDisplay(blockId) {
    const wrapper = document.getElementById(`block-${blockId}`);
    if (wrapper) {
      const block = this.blocks.get(blockId);
      // Trigger custom update se definito
      if (block.onUpdate) {
        block.onUpdate(block, wrapper);
      }
    }
  }

  // Sistema eventi
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  emit(event, data) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(callback => callback(data));
  }

  // Nascondi blocco
  hideBlock(blockId) {
    const wrapper = document.getElementById(`block-${blockId}`);
    if (wrapper) {
      wrapper.style.display = 'none';
    }
  }

  // Mostra blocco
  showBlock(blockId) {
    const wrapper = document.getElementById(`block-${blockId}`);
    if (wrapper) {
      wrapper.style.display = 'block';
    }
  }
}

// Export per uso globale
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BlockSystem;
} else {
  window.BlockSystem = BlockSystem;
}