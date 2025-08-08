// PropellerAds Configuration
const propellerAds = {
  // Zone IDs
  zones: {
    inPagePush1: 9686517,
    inPagePush2: 9677112,
    directLink: 'https://otieu.com/4/9677119'
  },

  // Script templates (paste obfuscated scripts here)
  // Get scripts from text file
  getInPagePush1Script: () => {
    const fs = require('fs');
    const path = require('path');
    try {
      const filePath = path.join(__dirname, 'propeller-scripts.txt');
      const content = fs.readFileSync(filePath, 'utf8');
      const start = content.indexOf('IN_PAGE_PUSH_START') + 'IN_PAGE_PUSH_START'.length;
      const end = content.indexOf('IN_PAGE_PUSH_END');
      const script = content.substring(start, end).trim().replace(/^-->\s*/, '');
      return script;
    } catch (e) { 
      return ''; 
    }
  },
  
  getInPagePush2Script: () => {
    const fs = require('fs');
    const path = require('path');
    try {
      const filePath = path.join(__dirname, 'propeller-scripts.txt');
      const content = fs.readFileSync(filePath, 'utf8');
      const start = content.indexOf('IN_PAGE_PUSH_SCRIPT_START') + 'IN_PAGE_PUSH_SCRIPT_START'.length;
      const end = content.indexOf('IN_PAGE_PUSH_SCRIPT_END');
      const script = content.substring(start, end).trim().replace(/^-->\s*/, '');
      return script;
    } catch (e) { 
      return ''; 
    }
  },

  // Integration settings
  settings: {
    enableInPagePush1: true,
    enableInPagePush2: true,
    enableDirectLink: false, // Blocked by AdBlock
    revenueThreshold: 2 // Minimum revenue level to show ads
  },
  
  // Get direct link
  getDirectLink: () => {
    return 'https://otieu.com/4/9677119';
  }
};

module.exports = propellerAds;