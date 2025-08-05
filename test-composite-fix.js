// Test specifico per template compositi
const https = require('https');

function createCompositeTestLink(templateId) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      url: 'https://example.com',
      timePreset: '2min',
      steps: 1,
      expiryPreset: '1d',
      testTemplate: templateId
    });

    const options = {
      hostname: 'tus-tasklink.onrender.com',
      port: 443,
      path: '/api/shorten',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200) {
            resolve(response.shortUrl);
          } else {
            reject(new Error(response.error || 'API Error'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function testComposites() {
  console.log('🧪 Testing Composite Template Fix');
  console.log('=================================');
  
  const composites = [
    'timer_then_click',
    'click_then_timer', 
    'double_timer',
    'racing_then_teleport',
    'triple_click'
  ];
  
  for (const templateId of composites) {
    try {
      console.log(`\n📋 Creating ${templateId}...`);
      const url = await createCompositeTestLink(templateId);
      console.log(`✅ ${templateId}: ${url}`);
      console.log(`   Expected: Multiple steps (not single timer)`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log(`❌ ${templateId}: ${error.message}`);
    }
  }
  
  console.log('\n🎯 TEST INSTRUCTIONS:');
  console.log('1. Open each URL above');
  console.log('2. Complete first step');
  console.log('3. VERIFY: Second step appears (not redirect to example.com)');
  console.log('4. Complete all steps');
  console.log('5. VERIFY: Final redirect to example.com');
}

testComposites().catch(console.error);