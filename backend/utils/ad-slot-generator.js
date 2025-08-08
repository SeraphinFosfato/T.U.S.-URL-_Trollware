// Generatore di slot pubblicitari per template
const adStyleConfig = require('../config/adstyle-config');
const antiAdBlock = require('./anti-adblock-integration');

class AdSlotGenerator {
  constructor() {
    this.slotStyles = {
      header: {
        html: '<script>setTimeout(() => { const headerArea = document.querySelector(".header-area"); if (headerArea) { headerArea.innerHTML = `<div style="text-align:center;padding:10px;background:#f8f9fa;border-radius:5px;margin:5px 0;">📢 Sponsored Content</div>`; console.log("✅ Header ad area ready"); } }, 100);</script>',
        css: '.header-area{min-height:60px;background:rgba(255,255,255,0.1);border-radius:5px;padding:10px}.header-slot{width:100%;text-align:center}'
      },
      sidebar: {
        html: '<script>setTimeout(() => { const sideArea = document.querySelector(".sidebar-area"); if (sideArea) { sideArea.innerHTML = `<div style="text-align:center;padding:5px;background:#f8f9fa;border-radius:5px;font-size:12px;">Ad Space</div>`; console.log("✅ Sidebar ad area ready"); } }, 100);</script>',
        css: '.sidebar-area{background:rgba(255,255,255,0.1);border-radius:5px;padding:5px}'
      },
      footer: {
        html: '<script>setTimeout(() => { const footerArea = document.querySelector(".footer-area"); if (footerArea) { footerArea.innerHTML = `<div style="text-align:center;padding:10px;background:#f8f9fa;border-radius:5px;margin:5px 0;">🚀 Advertisement Space</div>`; console.log("✅ Footer ad area ready"); } }, 100);</script>',
        css: '.ad-footer{background:#f8f9fa;border:1px solid #dee2e6;padding:15px;text-align:center;margin-top:20px;border-radius:5px;z-index:9999;position:relative}'
      },
      interstitial: {
        html: '<div class="ad-interstitial" id="ad-interstitial"><div class="ad-content"><div class="ad-placeholder">Sponsored Content</div><button onclick="this.parentElement.parentElement.style.display=\'none\'" class="ad-close">×</button></div></div>',
        css: '.ad-interstitial{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center}.ad-content{background:#fff;padding:40px;border-radius:10px;position:relative;max-width:400px;text-align:center}.ad-close{position:absolute;top:10px;right:15px;background:none;border:none;font-size:24px;cursor:pointer;color:#999}.ad-placeholder{color:#6c757d;font-size:14px;margin-bottom:20px}'
      },
      sidebar2: {
        html: '<script>setTimeout(() => { const side2Area = document.querySelector(".sidebar2-area"); if (side2Area) { side2Area.innerHTML = `<div style="text-align:center;padding:5px;background:#f8f9fa;border-radius:5px;font-size:12px;">Ad Space</div>`; console.log("✅ Right sidebar ad area ready"); } }, 100);</script>',
        css: '.sidebar2-area{background:rgba(255,255,255,0.1);border-radius:5px;padding:5px}'
      },
      overlay: {
        html: '<div class="ad-overlay" id="ad-overlay"><div class="ad-placeholder">Premium Ad</div><button onclick="this.parentElement.style.display=\'none\'" class="ad-close">×</button></div>',
        css: '.ad-overlay{position:fixed;bottom:20px;right:20px;width:300px;height:250px;background:#fff;border:2px solid #007bff;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center}.ad-close{position:absolute;top:5px;right:10px;background:none;border:none;font-size:18px;cursor:pointer;color:#999}.ad-placeholder{color:#007bff;font-size:13px;font-weight:bold}'
      }
    };
  }

  getAdStyleScript() {
    try {
      console.log('🎯 Loading AdStyle script...');
      const script = adStyleConfig.getAdStyleScript();
      console.log(`✅ AdStyle script loaded, length: ${script.length}`);
      return script;
    } catch (e) {
      console.error('❌ AdStyle script load failed:', e.message);
      return '';
    }
  }

  generateAdSlots(enabledSlots) {
    let html = '';
    let css = '';
    
    // Aggiungi AdStyle script se ci sono ad slots attivi
    const hasActiveSlots = Object.values(enabledSlots).some(enabled => enabled);
    if (hasActiveSlots && adStyleConfig.settings.enabled) {
      html += this.getAdStyleScript();
      html += antiAdBlock.getAntiAdBlockScript();
    }
    
    Object.entries(enabledSlots).forEach(([slotName, enabled]) => {
      if (enabled && this.slotStyles[slotName]) {
        html += this.slotStyles[slotName].html;
        css += this.slotStyles[slotName].css;
      }
    });
    
    return { html, css };
  }

  // Layout creativi per diversi template types
  getCreativeLayout(templateType) {
    const layouts = {
      timer: {
        containerClass: 'timer-layout',
        css: `
          .timer-layout { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          .timer-layout .w {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            border: none;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          }
        `
      },
      click: {
        containerClass: 'click-layout',
        css: `
          .click-layout {
            background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
            background-size: 400% 400%;
            animation: gradientShift 8s ease infinite;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .click-layout .w {
            background: rgba(255,255,255,0.9);
            border: 2px solid rgba(255,255,255,0.3);
          }
        `
      },
      racing: {
        containerClass: 'racing-layout',
        css: `
          .racing-layout {
            background: #1a1a2e;
            background-image: 
              radial-gradient(circle at 25% 25%, #16213e 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, #0f3460 0%, transparent 50%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .racing-layout .w {
            background: rgba(255,255,255,0.95);
            border: 2px solid #00d4ff;
            box-shadow: 0 0 20px rgba(0,212,255,0.3);
          }
        `
      }
    };
    
    return layouts[templateType] || layouts.timer;
  }
}

module.exports = new AdSlotGenerator();