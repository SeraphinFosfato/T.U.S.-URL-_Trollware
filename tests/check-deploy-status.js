// Verifica se il deploy del fix compositi è attivo
const https = require('https');

function checkDeployStatus() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      url: 'https://example.com',
      timePreset: '2min',
      testTemplate: 'racing_then_teleport'
    });

    const req = https.request({
      hostname: 'tus-tasklink.onrender.com',
      path: '/api/shorten',
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response.shortUrl);
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

async function testCompositeExpansion() {
  console.log('🔍 Checking Deploy Status...');
  console.log('============================');
  
  try {
    const testUrl = await checkDeployStatus();
    console.log(`✅ Test link created: ${testUrl}`);
    console.log('');
    console.log('🧪 MANUAL TEST:');
    console.log('1. Open the link above');
    console.log('2. If you see RACING game first → Deploy is ACTIVE ✅');
    console.log('3. If you see TELEPORT game only → Deploy is PENDING ⏳');
    console.log('');
    console.log('Expected sequence: Racing → Teleport → Redirect');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

testCompositeExpansion();