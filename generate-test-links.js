const axios = require('axios');

async function generateTestLinks() {
  const tests = [
    { template: 'timer_simple', revenue: 1, desc: 'Timer Simple (no ads)' },
    { template: 'timer_punish', revenue: 2, desc: 'Timer Punish (header ad)' },
    { template: 'click_teleport', revenue: 3, desc: 'Click Teleport (header + footer)' },
    { template: 'click_racing_rigged', revenue: 4, desc: 'Racing Rigged (header + sidebar + footer)' },
    { template: 'racing_sandwich', revenue: 8, desc: 'Racing Sandwich (ALL ads)' }
  ];
  
  console.log('🎯 LINK DI TEST:\n');
  
  for (const test of tests) {
    try {
      const response = await axios.post('https://tus-tasklink.onrender.com/api/shorten', {
        url: 'https://example.com/' + test.template,
        testTemplate: test.template
      });
      console.log(`📊 ${test.desc}`);
      console.log(`🔗 ${response.data.shortUrl}`);
      console.log('');
    } catch (e) {
      console.log(`❌ Error for ${test.template}: ${e.message}`);
    }
  }
}

generateTestLinks();