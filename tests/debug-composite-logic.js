// Test logica compositi
const distributor = require('./backend/utils/smart-template-distributor');

console.log('=== TEST LOGICA COMPOSITI ===');

// Test caso: 1 step, 120 secondi
const targetTime = 120;
const steps = 1;
const timePerStep = targetTime / steps; // 120s

console.log(`\nScenario: ${steps} step, ${targetTime}s totali`);
console.log(`Tempo per step: ${timePerStep}s`);

// Simula RNG deterministico
const rng = () => 0.5;

const distribution = distributor.calculateOptimalDistribution(targetTime, steps, rng);

console.log('\n=== RISULTATO ===');
distribution.forEach((step, i) => {
  console.log(`Step ${i+1}: ${step.templateId} (target: ${step.targetTime}s, stimato: ${step.estimatedTime}s)`);
});

// Test manuale getViableTemplates
console.log('\n=== TEMPLATE VIABILI PER 120s ===');
const viable = distributor.getViableTemplates(120);
console.log('Template compositi trovati:', viable.filter(t => 
  t.templateId.includes('_then_') || t.templateId === 'double_timer'
).map(t => t.templateId));