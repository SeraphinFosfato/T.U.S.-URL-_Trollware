// Generatore di slot pubblicitari per template
const propellerConfig = require('../config/propeller-config');

class AdSlotGenerator {
  constructor() {
    this.slotStyles = {
      header: {
        html: '<div class="ad-header" id="ad-header">' + this.getPropellerAd('vignette') + '<script>setTimeout(()=>{if(!document.querySelector("#ad-header iframe, #ad-header [data-propeller]"))document.querySelector(".ad-fallback").style.display="block"},3000)</script><div class="ad-fallback" style="background:#e3f2fd;padding:8px;font-size:11px;color:#1976d2;display:none;border-left:3px solid #2196f3;">🔄 PropellerAds Loading...</div></div>',
        css: '.ad-header{margin-bottom:20px;min-height:50px;position:relative}'
      },
      sidebar: {
        html: '<div class="ad-sidebar" id="ad-sidebar">' + this.getPropellerAd('inPagePush') + '</div>',
        css: '.ad-sidebar{position:fixed;right:20px;top:50%;transform:translateY(-50%);width:160px;height:600px;z-index:1000}'
      },
      footer: {
        html: '<div class="ad-footer" id="ad-footer"><div style="background:green;color:white;padding:10px;font-weight:bold;margin:10px 0;">🚨 FOOTER AD SLOT</div><a href="' + propellerConfig.getDirectLink() + '" target="_blank" style="display:block;padding:15px;background:#007bff;color:white;text-decoration:none;text-align:center;border-radius:5px;">🚀 Sponsored Link - Click Here</a></div>',
        css: '.ad-footer{background:#f8f9fa;border:1px solid #dee2e6;padding:15px;text-align:center;margin-top:20px;border-radius:5px;z-index:9999;position:relative}'
      },
      interstitial: {
        html: '<div class="ad-interstitial" id="ad-interstitial"><div class="ad-content"><div class="ad-placeholder">Sponsored Content</div><button onclick="this.parentElement.parentElement.style.display=\'none\'" class="ad-close">×</button></div></div>',
        css: '.ad-interstitial{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center}.ad-content{background:#fff;padding:40px;border-radius:10px;position:relative;max-width:400px;text-align:center}.ad-close{position:absolute;top:10px;right:15px;background:none;border:none;font-size:24px;cursor:pointer;color:#999}.ad-placeholder{color:#6c757d;font-size:14px;margin-bottom:20px}'
      },
      overlay: {
        html: '<div class="ad-overlay" id="ad-overlay"><div class="ad-placeholder">Premium Ad</div><button onclick="this.parentElement.style.display=\'none\'" class="ad-close">×</button></div>',
        css: '.ad-overlay{position:fixed;bottom:20px;right:20px;width:300px;height:250px;background:#fff;border:2px solid #007bff;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center}.ad-close{position:absolute;top:5px;right:10px;background:none;border:none;font-size:18px;cursor:pointer;color:#999}.ad-placeholder{color:#007bff;font-size:13px;font-weight:bold}'
      }
    };
  }

  getPropellerAd(type) {
    try {
      console.log(`🎯 Loading PropellerAds script: ${type}`);
      let script = '';
      if (type === 'vignette') {
        script = propellerConfig.getVignetteScript();
        console.log(`📜 Vignette script length: ${script.length}`);
      }
      if (type === 'inPagePush') {
        script = propellerConfig.getInPagePushScript();
        console.log(`📜 InPagePush script length: ${script.length}`);
      }
      console.log(`✅ PropellerAds ${type} loaded successfully`);
      return script;
    } catch (e) {
      console.error(`❌ PropellerAds script load failed for ${type}:`, e.message);
      return '';
    }
  }

  generateAdSlots(enabledSlots) {
    let html = '';
    let css = '';
    
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