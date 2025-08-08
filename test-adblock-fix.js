// Test fix anti-adblock
const propellerConfig = require('./backend/config/propeller-config');

console.log('🧪 Testing PropellerAds script extraction...');

console.log('\n📊 Vignette Script:');
const vignetteScript = propellerConfig.getVignetteScript();
console.log('Length:', vignetteScript.length);
console.log('Content:', vignetteScript.substring(0, 100) + '...');

console.log('\n📊 InPage Push Script:');
const inPageScript = propellerConfig.getInPagePushScript();
console.log('Length:', inPageScript.length);
console.log('Content:', inPageScript.substring(0, 100) + '...');

console.log('\n✅ Test completed');