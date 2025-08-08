// PropellerAds Configuration
const propellerAds = {
  // Zone IDs
  zones: {
    vignette: 9677090,
    inPagePush: 9677112,
    directLink: 'https://otieu.com/4/9677119'
  },

  // Script templates (paste obfuscated scripts here)
  // Get scripts from text file
  getVignetteScript: () => {
    const fs = require('fs');
    const path = require('path');
    try {
      console.log('📁 Reading propeller-scripts.txt for vignette...');
      const filePath = path.join(__dirname, 'propeller-scripts.txt');
      console.log('📂 File path:', filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      console.log('📊 File content length:', content.length);
      const start = content.indexOf('VIGNETTE_SCRIPT_START') + 'VIGNETTE_SCRIPT_START'.length;
      const end = content.indexOf('VIGNETTE_SCRIPT_END');
      console.log('📍 Vignette markers found - start:', start, 'end:', end);
      const script = content.substring(start, end).trim().replace(/^-->\s*/, '');
      console.log('✅ Vignette script extracted, length:', script.length);
      return script;
    } catch (e) { 
      console.error('❌ Vignette script extraction failed:', e.message);
      return ''; 
    }
  },
  
  getInPagePushScript: () => {
    const fs = require('fs');
    const path = require('path');
    try {
      console.log('📁 Reading propeller-scripts.txt for in-page push...');
      const filePath = path.join(__dirname, 'propeller-scripts.txt');
      const content = fs.readFileSync(filePath, 'utf8');
      const start = content.indexOf('IN_PAGE_PUSH_SCRIPT_START') + 'IN_PAGE_PUSH_SCRIPT_START'.length;
      const end = content.indexOf('IN_PAGE_PUSH_SCRIPT_END');
      console.log('📍 InPagePush markers found - start:', start, 'end:', end);
      const script = content.substring(start, end).trim().replace(/^-->\s*/, '');
      console.log('✅ InPagePush script extracted, length:', script.length);
      return script;
    } catch (e) { 
      console.error('❌ InPagePush script extraction failed:', e.message);
      return ''; 
    }
  },

  // Integration settings
  settings: {
    enableVignette: true,
    enableInPagePush: true,
    enableDirectLink: false, // Blocked by AdBlock
    revenueThreshold: 2 // Minimum revenue level to show ads
  },
  
  // Get direct link
  getDirectLink: () => {
    return 'https://otieu.com/4/9677119';
  }
};

module.exports = propellerAds;