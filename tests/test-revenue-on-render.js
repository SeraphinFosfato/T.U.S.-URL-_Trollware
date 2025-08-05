// Test sistema revenue su Render con link reali
const axios = require('axios');

const BASE_URL = 'https://tus-tasklink.onrender.com';
const TEST_TARGET = 'https://example.com';

async function testRevenueSystem() {
  console.log('💰 Testing Revenue System on Render');
  console.log('===================================');
  
  const testTemplates = [
    { id: 'timer_simple', revenue: 1, desc: 'Low revenue template' },
    { id: 'click_racing_rigged', revenue: 4, desc: 'Medium revenue template' },
    { id: 'triple_click', revenue: 7, desc: 'High revenue template' },
    { id: 'racing_sandwich', revenue: 8, desc: 'Max revenue template' }
  ];
  
  console.log('\n🎯 Creating test links...');
  
  for (const template of testTemplates) {
    try {
      console.log(`\n📋 ${template.desc} (${template.id}):`);
      
      // Crea link normale
      const normalResponse = await axios.post(`${BASE_URL}/create`, {
        url: TEST_TARGET,
        forceTemplate: template.id
      });
      
      if (normalResponse.data.success) {
        const normalUrl = `${BASE_URL}/${normalResponse.data.shortId}`;
        console.log(`  🔗 Normal: ${normalUrl}`);
        console.log(`  💰 Expected Revenue: ${template.revenue}`);
        console.log(`  📺 Expected Slots: ${getExpectedSlots(template.revenue)}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n🧪 Revenue Slot Mapping:');
  console.log('header (2+), footer (3+), sidebar (4+), interstitial (6+), overlay (8+)');
  
  console.log('\n🌐 Open the generated URLs to see:');
  console.log('- Different ad slot configurations');
  console.log('- Revenue-based layout changes');
  console.log('- Template complexity vs monetization');
}

function getExpectedSlots(revenue) {
  const slots = [];
  if (revenue >= 2) slots.push('header');
  if (revenue >= 3) slots.push('footer');
  if (revenue >= 4) slots.push('sidebar');
  if (revenue >= 6) slots.push('interstitial');
  if (revenue >= 8) slots.push('overlay');
  return slots.join(', ') || 'none';
}

if (require.main === module) {
  testRevenueSystem().catch(console.error);
}

module.exports = { testRevenueSystem };