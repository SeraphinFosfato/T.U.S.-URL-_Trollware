// Standard Dual Layer Template System
const dualLayerStandard = {
  // Standard CSS per dual layer
  getStandardCSS: () => `
    /* DUAL LAYER STANDARD */
    .ad-layer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: auto;
    }
    
    .game-layer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
      pointer-events: none;
    }
    
    .game-interactive {
      pointer-events: auto;
      z-index: 110;
    }
    
    .layout {
      display: grid;
      grid-template-areas: "header header" "main main" "footer footer";
      grid-template-rows: auto 1fr auto;
      grid-template-columns: 1fr 1fr;
      min-height: 100vh;
      gap: 10px;
      padding: 10px;
    }
    
    .header-area { grid-area: header; }
    .main-area { grid-area: main; display: flex; align-items: center; justify-content: center; }
    .footer-area { grid-area: footer; }
  `,
  
  // Standard HTML structure
  getStandardHTML: (gameContent, adSlots) => `
    <div class="ad-layer">
      <div class="layout">
        <div class="header-area"></div>
        <div class="main-area"></div>
        <div class="footer-area"></div>
      </div>
    </div>
    <div class="game-layer">
      ${gameContent}
    </div>
    ${adSlots.html}
  `,
  
  // Standard event listener setup
  getStandardJS: () => `
    // STANDARD EVENT LISTENER SETUP
    function setupStandardEvents() {
      // Cleanup existing listeners
      document.removeEventListener('click', globalClickHandler);
      document.removeEventListener('keydown', globalKeyHandler);
      
      // Setup new listeners
      document.addEventListener('click', globalClickHandler);
      document.addEventListener('keydown', globalKeyHandler);
      
      console.log('✅ Standard events setup complete');
    }
    
    function globalClickHandler(e) {
      // Handle clicks on game elements only
      if (e.target.closest('.game-interactive')) {
        e.stopPropagation();
      }
    }
    
    function globalKeyHandler(e) {
      // Prevent common shortcuts that break games
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
      }
    }
    
    // Initialize on load
    document.addEventListener('DOMContentLoaded', setupStandardEvents);
  `
};

module.exports = dualLayerStandard;