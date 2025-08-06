const axios = require('axios');

async function testAds() {
  try {
    // Crea link
    const response = await axios.post('https://tus-tasklink.onrender.com/api/shorten', {
      url: 'https://example.com',
      testTemplate: 'timer_simple'
    });
    
    console.log('Link:', response.data.shortUrl);
    
    // Testa HTML
    const htmlResponse = await axios.get(response.data.shortUrl);
    const html = htmlResponse.data;
    
    console.log('HTML length:', html.length);
    console.log('Has ad-header:', html.includes('ad-header'));
    console.log('Has Advertisement:', html.includes('Advertisement'));
    console.log('Has gradient background:', html.includes('linear-gradient'));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAds();