// Test sistema revenue e advertising dinamico
const distributor = require('./backend/utils/smart-template-distributor');

console.log('=== TEST SISTEMA REVENUE ===');

// Test 1: Sistema revenue disabilitato (default)
console.log('\n--- Sistema Revenue DISABILITATO ---');
const distributionNoRevenue = distributor.calculateOptimalDistribution(120, 2, Math.random);
console.log('Revenue per step:');
distributionNoRevenue.forEach((step, i) => {
  console.log(`  Step ${i+1} (${step.templateId}): ${step.revenue || 0} revenue`);
});

// Test 2: Abilita sistema revenue
console.log('\n--- Sistema Revenue ABILITATO ---');
distributor.setRevenueEnabled(true);

const distributionWithRevenue = distributor.calculateOptimalDistribution(120, 2, Math.random, 1.5);
console.log('Revenue per step (multiplier 1.5x):');
distributionWithRevenue.forEach((step, i) => {
  console.log(`  Step ${i+1} (${step.templateId}): ${step.revenue} revenue`);
});

const totalRevenue = distributor.getTotalRevenue(distributionWithRevenue);
console.log(`Revenue totale: ${totalRevenue}`);

// Test 3: Slot pubblicitari abilitati
console.log('\n--- Slot Pubblicitari Abilitati ---');
const enabledSlots = distributor.calculateEnabledAdSlots(totalRevenue);
console.log('Slot abilitati per revenue', totalRevenue + ':');
Object.entries(enabledSlots).forEach(([slot, enabled]) => {
  const threshold = distributor.revenueSystem.adSlots[slot].threshold;
  console.log(`  ${slot} (soglia ${threshold}): ${enabled ? '✅ ABILITATO' : '❌ disabilitato'}`);
});

// Test 4: Confronto revenue template
console.log('\n--- Confronto Revenue Template ---');
const templateTests = [
  { template: 'timer_simple', time: 60 },
  { template: 'click_racing_rigged', time: 60 },
  { template: 'timer_then_click', time: 90 },
  { template: 'racing_then_teleport', time: 120 },
  { template: 'triple_click', time: 150 },
  { template: 'racing_sandwich', time: 180 }
];

templateTests.forEach(test => {
  const revenue = distributor.calculateRevenue(test.template, 1.0);
  const revenueBonus = distributor.calculateRevenue(test.template, 2.0);
  console.log(`${test.template}: ${revenue} revenue (base), ${revenueBonus} revenue (2x multiplier)`);
});

// Test 5: Simulazione piani a pagamento
console.log('\n--- Simulazione Piani a Pagamento ---');
console.log('Piano FREE (revenue 1.0x):');
const freePlan = distributor.calculateOptimalDistribution(150, 1, Math.random, 1.0);
const freeRevenue = distributor.getTotalRevenue(freePlan);
const freeSlots = distributor.calculateEnabledAdSlots(freeRevenue);
console.log(`  Template: ${freePlan[0].templateId}, Revenue: ${freeRevenue}`);
console.log(`  Slot abilitati: ${Object.entries(freeSlots).filter(([,enabled]) => enabled).map(([slot]) => slot).join(', ')}`);

console.log('\nPiano PREMIUM (revenue 0.5x):');
const premiumPlan = distributor.calculateOptimalDistribution(150, 1, Math.random, 0.5);
const premiumRevenue = distributor.getTotalRevenue(premiumPlan);
const premiumSlots = distributor.calculateEnabledAdSlots(premiumRevenue);
console.log(`  Template: ${premiumPlan[0].templateId}, Revenue: ${premiumRevenue}`);
console.log(`  Slot abilitati: ${Object.entries(premiumSlots).filter(([,enabled]) => enabled).map(([slot]) => slot).join(', ')}`);

console.log('\nPiano VIP (revenue 0x - solo minigioco):');
distributor.setRevenueEnabled(false);
const vipPlan = distributor.calculateOptimalDistribution(150, 1, Math.random);
const vipRevenue = distributor.getTotalRevenue(vipPlan);
console.log(`  Template: ${vipPlan[0].templateId}, Revenue: ${vipRevenue} (sistema disabilitato)`);

// Riabilita per altri test
distributor.setRevenueEnabled(true);