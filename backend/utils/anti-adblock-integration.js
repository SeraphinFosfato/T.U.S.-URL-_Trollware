// Integrazione BlockAdBlock per TrollShortener
const fs = require('fs');
const path = require('path');

class AntiAdBlockIntegration {
  constructor() {
    // Carica il file BlockAdBlock
    this.blockAdBlockScript = this.loadBlockAdBlockScript();
    this.warningOverlay = this.generateWarningOverlay();
  }

  loadBlockAdBlockScript() {
    try {
      const scriptPath = path.join(__dirname, 'blockadblock.js');
      return fs.readFileSync(scriptPath, 'utf8');
    } catch (error) {
      console.error('❌ Error loading BlockAdBlock script:', error.message);
      return '';
    }
  }

  generateWarningOverlay() {
    return `
<div id="adblock-warning" style="
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.95);
  z-index: 999999;
  display: none;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
">
  <div style="
    background: #fff;
    padding: 40px;
    border-radius: 15px;
    max-width: 500px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  ">
    <div style="font-size: 60px; margin-bottom: 20px;">🧌</div>
    <h2 style="color: #e74c3c; margin: 0 0 20px 0;">NICE TRY, SMARTASS!</h2>
    <p style="color: #333; line-height: 1.6; margin-bottom: 25px;">
      <strong>Oh look!</strong> Another genius trying to outsmart <strong>TrollShortener</strong> with AdBlock.
      <br><br>
      Did you really think we wouldn't notice? <strong>Disable your AdBlock</strong> and face the ads like everyone else, you sneaky little troll. 😏
    </p>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left; border-left: 4px solid #ffc107;">
      <h4 style="margin: 0 0 10px 0; color: #856404;">🎭 GAME RULES FOR SMARTASSES:</h4>
      <ol style="margin: 0; padding-left: 20px; color: #856404;">
        <li>Disable AdBlock for this site (yes, YOU have to do it)</li>
        <li>Refresh the page and watch our beautiful ads</li>
        <li>Complete the frustrating mini-game we prepared</li>
        <li>Earn your precious link through PAIN</li>
        <li>Learn that there's no free lunch on the internet</li>
      </ol>
      <p style="margin: 10px 0 0 0; font-size: 13px; color: #dc3545; font-weight: bold;">
        ⚠️ Using browsers with built-in adblock (Opera GX, Brave) is PROHIBITED. 
        Switch to a normal browser or suffer the consequences.
      </p>
    </div>
    
    <button onclick="location.reload()" style="
      background: #dc3545;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      margin-right: 10px;
    ">😠 Fine, I disabled AdBlock</button>
    
    <button onclick="window.close()" style="
      background: #6c757d;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
    ">🏃 I'm outta here</button>
    
    <p style="font-size: 12px; color: #999; margin-top: 20px;">
      🧌 TrollShortener: Where smartasses learn patience • No shortcuts for cheaters • Git gud
    </p>
  </div>
</div>`;
  }

  generateIntegrationScript() {
    return `
<script>
${this.blockAdBlockScript}
</script>
${this.warningOverlay}
<script>
// Integrazione TrollShortener con BlockAdBlock
(function() {
  function showAdBlockWarning() {
    const warning = document.getElementById('adblock-warning');
    if (warning) {
      warning.style.display = 'flex';
      // Blocca interazione con la pagina
      document.addEventListener('click', blockInteraction, true);
      document.addEventListener('keydown', blockInteraction, true);
    }
  }
  
  function blockInteraction(e) {
    if (!e.target.closest('#adblock-warning')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }
  
  // Controllo raccomandato dalla documentazione BlockAdBlock
  if(typeof blockAdBlock === 'undefined') {
    // Il file blockadblock.js è stato bloccato da AdBlock
    console.log('❌ BlockAdBlock file blocked - AdBlock detected');
    showAdBlockWarning();
  } else {
    console.log('✅ BlockAdBlock loaded, setting up detection');
    
    // Configura opzioni con bait PropellerAds specifico
    blockAdBlock.setOption({
      debug: true,
      checkOnLoad: true,
      resetOnEnd: false,
      baitClass: 'propellerads_ad propeller-ad ads-by-propeller banner-ad',
      baitStyle: 'width: 300px !important; height: 250px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;'
    });
    
    // Test aggiuntivo PropellerAds
    setTimeout(function() {
      var testScript = document.createElement('script');
      testScript.src = 'https://cdn.propellerads.com/tags.js';
      testScript.onerror = function() {
        console.log('🚫 PropellerAds script blocked - showing warning');
        showAdBlockWarning();
      };
      testScript.onload = function() {
        console.log('✅ PropellerAds script loaded');
      };
      document.head.appendChild(testScript);
    }, 1000);
    
    // Eventi come da documentazione
    blockAdBlock.onDetected(function() {
      console.log('🚫 AdBlock detected by BlockAdBlock');
      showAdBlockWarning();
    });
    
    blockAdBlock.onNotDetected(function() {
      console.log('✅ No AdBlock detected by BlockAdBlock');
    });
  }
})();
</script>`;
  }

  getAntiAdBlockScript() {
    return this.generateIntegrationScript();
  }
}

module.exports = new AntiAdBlockIntegration();