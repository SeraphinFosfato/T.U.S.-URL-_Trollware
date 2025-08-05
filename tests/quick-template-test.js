// Quick test per verificare tutti i template con il sistema reale
const distributor = require('../backend/utils/smart-template-distributor');
const estimator = require('../backend/utils/template-time-estimator');

console.log('🧌 QUICK TEMPLATE TEST - Sistema Reale');
console.log('=====================================');

const allTemplates = [
  'timer_simple', 'timer_punish',
  'click_simple', 'click_drain', 'click_teleport', 'click_racing', 'click_racing_rigged',
  'timer_then_click', 'click_then_timer', 'double_timer',
  'racing_then_teleport', 'teleport_then_racing', 'triple_click', 'racing_sandwich'
];

// Test 1: Verifica tutti i template esistono
console.log('\n📋 Template Verification:');
allTemplates.forEach(templateId => {
  const params = estimator.generateOptimalParams(templateId, 60);
  const timeRange = estimator.getTimeRange(templateId, params);
  const viable = estimator.isTemplateViable(templateId, 60, params);
  
  console.log(`✅ ${templateId}: ${timeRange.expected}s (${viable ? 'viable' : 'not viable'} for 60s)`);
});

// Test 2: Sistema revenue
console.log('\n💰 Revenue System Test:');
distributor.setRevenueEnabled(true);

allTemplates.forEach(templateId => {
  const revenue = distributor.calculateRevenue(templateId, 1.0);
  console.log(`💵 ${templateId}: ${revenue} revenue`);
});

// Test 3: Distribuzione intelligente
console.log('\n🧠 Smart Distribution Test:');
const testCases = [
  { time: 60, steps: 1, desc: '60s/1step' },
  { time: 120, steps: 1, desc: '120s/1step' },
  { time: 180, steps: 2, desc: '180s/2step' }
];

testCases.forEach(testCase => {
  console.log(`\n--- ${testCase.desc} ---`);
  const distribution = distributor.calculateOptimalDistribution(
    testCase.time, 
    testCase.steps, 
    Math.random
  );
  
  distribution.forEach((step, i) => {
    const isComposite = step.templateId.includes('_then_') || 
                       step.templateId === 'double_timer' ||
                       step.templateId === 'triple_click' ||
                       step.templateId === 'racing_sandwich';
    
    console.log(`  Step ${i+1}: ${step.templateId} ${isComposite ? '(COMPOSITO)' : '(singolo)'} - ${step.revenue || 0} revenue`);
  });
  
  const totalRevenue = distributor.getTotalRevenue(distribution);
  const enabledSlots = distributor.calculateEnabledAdSlots(totalRevenue);
  const activeSlots = Object.entries(enabledSlots).filter(([,enabled]) => enabled).map(([slot]) => slot);
  
  console.log(`  💰 Total Revenue: ${totalRevenue}`);
  console.log(`  📺 Active Ad Slots: ${activeSlots.join(', ') || 'none'}`);
});

console.log('\n✅ All tests completed! Sistema funzionante.');
console.log('\n🚀 Per testare UI: node tests/test-all-templates.js');
console.log('🌐 Poi apri: http://localhost:3100');