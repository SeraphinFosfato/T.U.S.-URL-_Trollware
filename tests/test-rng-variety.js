// Test varietà con RNG diversi
const distributor = require('./backend/utils/smart-template-distributor');

console.log('=== TEST VARIETÀ RNG ===');

const testRngs = [0.1, 0.25, 0.4, 0.5, 0.6, 0.75, 0.9];

testRngs.forEach(rngValue => {
  const distribution = distributor.calculateOptimalDistribution(120, 1, () => rngValue);
  const template = distribution[0].templateId;
  const isComposite = template.includes('_then_') || template === 'double_timer';
  console.log(`RNG ${rngValue}: ${template} ${isComposite ? '(COMPOSITO)' : '(singolo)'}`);
});

console.log('\n=== BUCKET ANALYSIS ===');
console.log('timer_then_click: 0-30.3% (RNG 0.0-0.303)');
console.log('click_then_timer: 30.3-60.6% (RNG 0.303-0.606)'); 
console.log('double_timer: 60.6-82.2% (RNG 0.606-0.822)');
console.log('Altri: 82.2-100%');

console.log('\n=== TEST RANDOM REALE ===');
for (let i = 0; i < 10; i++) {
  const distribution = distributor.calculateOptimalDistribution(120, 1, Math.random);
  const template = distribution[0].templateId;
  const isComposite = template.includes('_then_') || template === 'double_timer';
  console.log(`Random ${i+1}: ${template} ${isComposite ? '(COMPOSITO)' : '(singolo)'}`);
}