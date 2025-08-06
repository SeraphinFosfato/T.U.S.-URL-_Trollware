// Test PropellerAds integration
const propellerConfig = require('./backend/config/propeller-config');
const adSlotGenerator = require('./backend/utils/ad-slot-generator');

console.log('🧪 Testing PropellerAds Integration...\n');

// Test config loading
console.log('📋 Config zones:', propellerConfig.zones);
console.log('⚙️ Settings:', propellerConfig.settings);

// Test script extraction (without showing obfuscated code)
const vignetteScript = propellerConfig.getVignetteScript();
const inPageScript = propellerConfig.getInPagePushScript();

console.log('📜 Vignette script loaded:', vignetteScript.length > 0 ? '✅' : '❌');
console.log('📜 In-page push loaded:', inPageScript.length > 0 ? '✅' : '❌');
console.log('🔗 Direct link:', propellerConfig.getDirectLink());

// Test ad slot generation
const enabledSlots = {
  header: true,
  sidebar: true
};

const adSlots = adSlotGenerator.generateAdSlots(enabledSlots);
console.log('\n🎯 Ad slots generated:');
console.log('- HTML length:', adSlots.html.length);
console.log('- CSS length:', adSlots.css.length);
console.log('- Contains vignette:', adSlots.html.includes('9677091') ? '✅' : '❌');
console.log('- Contains in-page push:', adSlots.html.includes('9677112') ? '✅' : '❌');

console.log('\n✅ PropellerAds integration test complete!');