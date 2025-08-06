// Test timer con ad slots
const axios = require('axios');

async function testTimerAds() {
  try {
    const response = await axios.post('https://tus-tasklink.onrender.com/api/shorten', {
      url: 'https://example.com',
      testTemplate: 'timer_simple' // Revenue 1 - dovrebbe attivare solo header
    });
    
    console.log('🎯 Timer test link:', response.data.shortUrl);
    console.log('📊 Expected: header ad slot only');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testTimerAds();