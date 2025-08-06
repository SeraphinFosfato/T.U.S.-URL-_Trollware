// Debug completo del sistema ad slots
const axios = require('axios');

async function debugAdSlots() {
  console.log('🔍 DEBUG: Testing ad slots system...\n');
  
  try {
    // Test 1: Timer simple (revenue 1)
    console.log('📊 Test 1: timer_simple (expected revenue: 1)');
    const response1 = await axios.post('https://tus-tasklink.onrender.com/api/shorten', {
      url: 'https://example.com/test1',
      testTemplate: 'timer_simple'
    });
    
    console.log('Link:', response1.data.shortUrl);
    
    const html1 = await axios.get(response1.data.shortUrl);
    console.log('HTML length:', html1.data.length);
    console.log('Has gradient:', html1.data.includes('linear-gradient'));
    console.log('Has ad-header:', html1.data.includes('ad-header'));
    console.log('Has Advertisement:', html1.data.includes('Advertisement'));
    console.log('');
    
    // Test 2: Timer punish (revenue 2)
    console.log('📊 Test 2: timer_punish (expected revenue: 2)');
    const response2 = await axios.post('https://tus-tasklink.onrender.com/api/shorten', {
      url: 'https://example.com/test2',
      testTemplate: 'timer_punish'
    });
    
    console.log('Link:', response2.data.shortUrl);
    
    const html2 = await axios.get(response2.data.shortUrl);
    console.log('HTML length:', html2.data.length);
    console.log('Has Windows 95 style:', html2.data.includes('MS Sans Serif'));
    console.log('Has ad-header:', html2.data.includes('ad-header'));
    console.log('Has ad-footer:', html2.data.includes('ad-footer'));
    console.log('');
    
    // Test 3: Click simple (revenue 1)
    console.log('📊 Test 3: click_simple (expected revenue: 1)');
    const response3 = await axios.post('https://tus-tasklink.onrender.com/api/shorten', {
      url: 'https://example.com/test3',
      testTemplate: 'click_simple'
    });
    
    console.log('Link:', response3.data.shortUrl);
    
    const html3 = await axios.get(response3.data.shortUrl);
    console.log('HTML length:', html3.data.length);
    console.log('Has click challenge:', html3.data.includes('Click Challenge'));
    console.log('Has ad-header:', html3.data.includes('ad-header'));
    console.log('');
    
    console.log('✅ Debug tests completed. Check server logs for detailed ad slots debug info.');
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

debugAdSlots();