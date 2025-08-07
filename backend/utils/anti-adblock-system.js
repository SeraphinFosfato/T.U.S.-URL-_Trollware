// Sistema Anti-AdBlock per TrollShortener
class AntiAdBlockSystem {
  constructor() {
    this.detectionScript = this.generateDetectionScript();
    this.warningOverlay = this.generateWarningOverlay();
  }

  generateDetectionScript() {
    return `
<script>
(function() {
  let adBlockDetected = false;
  let detectionComplete = false;
  
  // Test 1: Elemento con classe ad-like
  function testAdClass() {
    const testDiv = document.createElement('div');
    testDiv.className = 'ad advertisement ads banner';
    testDiv.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;';
    document.body.appendChild(testDiv);
    
    setTimeout(() => {
      const computed = window.getComputedStyle(testDiv);
      if (computed.display === 'none' || computed.visibility === 'hidden' || testDiv.offsetHeight === 0) {
        adBlockDetected = true;
      }
      document.body.removeChild(testDiv);
      checkComplete();
    }, 100);
  }
  
  // Test 2: Script esterno bloccato
  function testExternalScript() {
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.onerror = () => {
      adBlockDetected = true;
      checkComplete();
    };
    script.onload = () => checkComplete();
    document.head.appendChild(script);
    
    setTimeout(() => {
      if (!script.readyState && !script.onload) {
        adBlockDetected = true;
        checkComplete();
      }
    }, 3000);
  }
  
  // Test 3: Fetch bloccato
  function testFetch() {
    fetch('https://googleads.g.doubleclick.net/pagead/ads', {mode: 'no-cors'})
      .catch(() => {
        adBlockDetected = true;
        checkComplete();
      });
    
    setTimeout(() => checkComplete(), 2000);
  }
  
  function checkComplete() {
    if (detectionComplete) return;
    detectionComplete = true;
    
    if (adBlockDetected) {
      showAdBlockWarning();
    } else {
      console.log('✅ No AdBlock detected');
    }
  }
  
  function showAdBlockWarning() {
    const overlay = document.createElement('div');
    overlay.id = 'adblock-warning';
    overlay.innerHTML = \`${this.warningOverlay}\`;
    document.body.appendChild(overlay);
    
    // Blocca interazione con la pagina
    document.addEventListener('click', blockInteraction, true);
    document.addEventListener('keydown', blockInteraction, true);
  }
  
  function blockInteraction(e) {
    if (!e.target.closest('#adblock-warning')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }
  
  // Avvia detection dopo DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        testAdClass();
        testExternalScript();
        testFetch();
      }, 1000);
    });
  } else {
    setTimeout(() => {
      testAdClass();
      testExternalScript();
      testFetch();
    }, 1000);
  }
})();
</script>`;
  }

  generateWarningOverlay() {
    return `
<div style="
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.95);
  z-index: 999999;
  display: flex;
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
    <div style="font-size: 60px; margin-bottom: 20px;">🚫</div>
    <h2 style="color: #e74c3c; margin: 0 0 20px 0;">AdBlock Rilevato!</h2>
    <p style="color: #333; line-height: 1.6; margin-bottom: 25px;">
      Per continuare e accedere al link, devi <strong>disattivare AdBlock</strong> per questo sito.
      <br><br>
      Gli annunci ci permettono di mantenere il servizio gratuito! 🙏
    </p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
      <h4 style="margin: 0 0 10px 0; color: #495057;">📋 Come disattivare AdBlock:</h4>
      <ol style="margin: 0; padding-left: 20px; color: #6c757d;">
        <li>Clicca sull'icona AdBlock nel browser</li>
        <li>Seleziona "Disattiva per questo sito"</li>
        <li>Ricarica la pagina</li>
      </ol>
    </div>
    
    <button onclick="location.reload()" style="
      background: #28a745;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      margin-right: 10px;
    ">🔄 Ho disattivato AdBlock</button>
    
    <button onclick="window.close()" style="
      background: #6c757d;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
    ">❌ Chiudi</button>
    
    <p style="font-size: 12px; color: #999; margin-top: 20px;">
      🔒 Nessun malware • Solo annunci sicuri • Supporta il progetto
    </p>
  </div>
</div>`;
  }

  // Genera script per template
  getAntiAdBlockScript() {
    return this.detectionScript;
  }

  // Versione alternativa per utenti premium (futuro)
  generatePremiumBypass() {
    return `
<div style="text-align: center; padding: 20px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; margin: 20px 0;">
  <h4>💎 Salta la Pubblicità</h4>
  <p>Accesso immediato senza AdBlock per soli <strong>€0.99</strong></p>
  <button style="background: #f39c12; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
    🚀 Accesso Premium
  </button>
</div>`;
  }
}

module.exports = new AntiAdBlockSystem();