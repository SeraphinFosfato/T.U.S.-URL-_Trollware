// PropellerAds Configuration
const propellerAds = {
  // Zone IDs
  zones: {
    vignette: 9677091,
    inPagePush: 9677112,
    directLink: 'https://otieu.com/4/9677119'
  },

  // Script templates (paste obfuscated scripts here)
  // Get scripts from text file
  getVignetteScript: () => {
    const fs = require('fs');
    const path = require('path');
    try {
      const content = fs.readFileSync(path.join(__dirname, 'propeller-scripts.txt'), 'utf8');
      const start = content.indexOf('VIGNETTE_SCRIPT_START') + 'VIGNETTE_SCRIPT_START'.length;
      const end = content.indexOf('VIGNETTE_SCRIPT_END');
      return content.substring(start, end).trim();
    } catch (e) { return ''; }
  },
  
  getInPagePushScript: () => {
    const fs = require('fs');
    const path = require('path');
    try {
      const content = fs.readFileSync(path.join(__dirname, 'propeller-scripts.txt'), 'utf8');
      const start = content.indexOf('IN_PAGE_PUSH_SCRIPT_START') + 'IN_PAGE_PUSH_SCRIPT_START'.length;
      const end = content.indexOf('IN_PAGE_PUSH_SCRIPT_END');
      return content.substring(start, end).trim();
    } catch (e) { return ''; }
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