// Genera link reali per testare template su Render
const axios = require('axios');

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

async function generateTestLinks() {
  console.log('🧌 Generating Real Test Links on Render');
  console.log('======================================');
  
  const results = [];
  
  for (const [templateId, params] of Object.entries(templates)) {
    try {
      console.log(`\n📋 Creating link for ${templateId}...`);
      
      const response = await axios.post(`${BASE_URL}/api/create`, {
        url: TEST_TARGET,
        forceTemplate: templateId,
        forceParams: params
      });
      
      if (response.data.success) {
        const shortUrl = `${BASE_URL}/${response.data.shortId}`;
        results.push({
          templateId,
          params,
          shortUrl,
          shortId: response.data.shortId
        });
        
        console.log(`✅ ${templateId}: ${shortUrl}`);
      } else {
        console.log(`❌ ${templateId}: Failed`);
      }
      
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
    console.log(`  Params: ${JSON.stringify(result.params)}`);
  });
  
  console.log(`\n✅ Generated ${results.length}/${Object.keys(templates).length} test links`);
  console.log('\n🌐 Open these URLs in browser to test templates on Render!');
  
  return results;
}

if (require.main === module) {
  generateTestLinks().catch(console.error);
}

module.exports = { generateTestLinks, templates, BASE_URL };