// Confronto rapido revenue system per tutti i template
const distributor = require('../backend/utils/smart-template-distributor');

console.log('💰 REVENUE SYSTEM COMPARISON');
console.log('============================');

const templates = [
  'timer_simple', 'timer_punish',
  'click_simple', 'click_drain', 'click_teleport', 'click_racing', 'click_racing_rigged',
  'timer_then_click', 'click_then_timer', 'double_timer',
  'racing_then_teleport', 'teleport_then_racing', 'triple_click', 'racing_sandwich'
];

console.log('\n📊 Revenue per Template:');
console.log('Template'.padEnd(25) + 'Revenue'.padEnd(10) + 'Category');
console.log('-'.repeat(50));

templates.forEach(templateId => {
  distributor.setRevenueEnabled(true);
  const revenue = distributor.calculateRevenue(templateId, 1.0);
  
  let category = 'Unknown';
  if (templateId.startsWith('timer')) category = 'Timer';
  else if (templateId.startsWith('click') && !templateId.includes('_then_')) category = 'Click';
  else if (templateId.includes('_then_') || templateId === 'double_timer') category = 'Composite Base';
  else if (['racing_then_teleport', 'teleport_then_racing', 'triple_click', 'racing_sandwich'].includes(templateId)) category = 'Composite Advanced';
  
  console.log(templateId.padEnd(25) + revenue.toString().padEnd(10) + category);
});

console.log('\n🎯 Ad Slots Thresholds:');
const adSlots = distributor.revenueSystem.adSlots;
Object.entries(adSlots).forEach(([slot, config]) => {
  console.log(`${slot.padEnd(15)}: ${config.threshold} revenue`);
});

console.log('\n🧪 Test Scenarios:');

const scenarios = [
  { revenue: 2, desc: 'Low revenue (timer_punish)' },
  { revenue: 4, desc: 'Medium revenue (click_racing_rigged)' },
  { revenue: 6, desc: 'High revenue (composite)' },
  { revenue: 8, desc: 'Max revenue (racing_sandwich)' }
];

scenarios.forEach(scenario => {
  const enabledSlots = distributor.calculateEnabledAdSlots(scenario.revenue);
  const activeSlots = Object.entries(enabledSlots).filter(([,enabled]) => enabled).map(([slot]) => slot);
  
  console.log(`\n${scenario.desc} (${scenario.revenue} points):`);
  console.log(`  Active slots: ${activeSlots.join(', ') || 'none'}`);
  console.log(`  Slots count: ${activeSlots.length}/5`);
});

console.log('\n🚀 Test with UI:');
console.log('node tests/test-all-templates.js');
console.log('Open: http://localhost:3100');
console.log('Use revenue toggle buttons to compare!');