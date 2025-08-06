// Test per verificare ad slots attivi
const axios = require('axios');

async function testAdSlots() {
  try {
    console.log('🧪 Testing ad slots activation...');
    
    // Crea link con template ad alto revenue
    const response = await axios.post('https://tus-tasklink.onrender.com/api/shorten', {
      url: 'https://example.com',
      testTemplate: 'racing_sandwich' // Template con revenue 8 - dovrebbe attivare tutti gli slot
    });
    
    console.log('✅ Link created:', response.data.shortUrl);
    console.log('📊 Expected revenue: 8 points');
    console.log('🎯 Expected ad slots: ALL (header, sidebar, footer, interstitial, overlay)');
    
    return response.data.shortUrl;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAdSlots();