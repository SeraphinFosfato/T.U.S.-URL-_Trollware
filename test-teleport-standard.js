// Test Teleport Game con Standard Dual Layer
const fetch = require('node-fetch');

async function testTeleportGame() {
  console.log('🧪 Testing Teleport Game with Standard Dual Layer...');
  
  try {
    const response = await fetch('https://tus-tasklink.onrender.com/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://example.com',
        testTemplate: 'click_teleport',
        timePreset: '1min'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Teleport test link created:');
      console.log('🔗 URL:', data.shortUrl);
      console.log('🎯 Template:', data.config.templates);
      console.log('⏱️ Estimated time:', data.config.estimatedTime + 's');
      
      console.log('\n🧪 TESTING CHECKLIST:');
      console.log('- [ ] Button appears and is clickable');
      console.log('- [ ] Button teleports on click');
      console.log('- [ ] Button teleports on hover (35% chance)');
      console.log('- [ ] Progress bar updates correctly');
      console.log('- [ ] Ads display in header/footer areas');
      console.log('- [ ] No event listener conflicts');
      console.log('- [ ] Game completes and redirects');
      
      console.log('\n⚠️ TEMPORARY CHANGES FOR TESTING:');
      console.log('- AdBlock disabled for ad testing');
      console.log('- Dual layer standard applied');
      console.log('- Event listeners standardized');
      
    } else {
      console.error('❌ Test failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testTeleportGame();