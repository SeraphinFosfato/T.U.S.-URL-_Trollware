// Genera link reali per testare template su Render usando API esistente
const https = require('https');

const BASE_URL = 'https://tus-tasklink.onrender.com';
const TEST_TARGET = 'https://example.com';

const templates = {
  timer_simple: { duration: 30 },
  timer_punish: { duration: 25 },
  click_simple: { clicks: 15 },
  click_drain: { clicks: 20 },
  click_teleport: { clicks: 12 },
  click_racing: { duration: 45, drain: 0.8 },
  click_racing_rigged: { realDuration: 30, maxProgress: 80, resetPoint: 25 },
  timer_then_click: { totalTime: 60, timerRatio: 0.6 },
  click_then_timer: { totalTime: 60, timerRatio: 0.4 },
  double_timer: { totalTime: 75, timerRatio: 0.5 },
  racing_then_teleport: { totalTime: 90, timerRatio: 0.6 },
  teleport_then_racing: { totalTime: 90, timerRatio: 0.4 },
  triple_click: { totalTime: 120, timerRatio: 0.33 },
  racing_sandwich: { totalTime: 150, timerRatio: 0.4 }
};

function createTestLink(templateId) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      url: TEST_TARGET,
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
            resolve({
              templateId,
              shortUrl: response.shortUrl,
              shortId: response.shortId
            });
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

async function generateTestLinks() {
  console.log('🧌 Generating Real Test Links on Render');
  console.log('======================================');
  
  const results = [];
  
  for (const templateId of Object.keys(templates)) {
    try {
      console.log(`\n📋 Creating link for ${templateId}...`);
      
      const result = await createTestLink(templateId);
      results.push(result);
      
      console.log(`✅ ${templateId}: ${result.shortUrl}`);
      
      // Delay per non sovraccaricare
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.log(`❌ ${templateId}: Error - ${error.message}`);
    }
  }
  
  console.log('\n🎯 TEST LINKS GENERATED:');
  console.log('========================');
  
  results.forEach(result => {
    console.log(`\n${result.templateId}:`);
    console.log(`  URL: ${result.shortUrl}`);
    console.log(`  Revenue: ${getRevenue(result.templateId)}`);
  });
  
  console.log(`\n✅ Generated ${results.length}/${Object.keys(templates).length} test links`);
  console.log('\n🌐 Open these URLs in browser to test templates on Render!');
  
  return results;
}

function getRevenue(templateId) {
  const revenues = {
    timer_simple: 1, timer_punish: 2,
    click_simple: 1, click_drain: 2, click_teleport: 3, click_racing: 2, click_racing_rigged: 4,
    timer_then_click: 3, click_then_timer: 3, double_timer: 4,
    racing_then_teleport: 5, teleport_then_racing: 5, triple_click: 7, racing_sandwich: 8
  };
  return revenues[templateId] || 0;
}

function getTemplateType(templateId) {
  if (templateId.startsWith('timer')) return 'Timer';
  if (templateId.startsWith('click') && !templateId.includes('_then_')) return 'Click';
  if (templateId.includes('_then_') || templateId === 'double_timer') return 'Composite Base';
  return 'Composite Advanced';
}

if (require.main === module) {
  generateTestLinks().catch(console.error);
}

module.exports = { generateTestLinks, templates, BASE_URL, getRevenue, getTemplateType };