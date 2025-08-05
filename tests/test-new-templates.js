// Test nuovi template compositi avanzati
const distributor = require('./backend/utils/smart-template-distributor');
const estimator = require('./backend/utils/template-time-estimator');

console.log('=== TEST NUOVI TEMPLATE COMPOSITI ===');

const newTemplates = [
  'racing_then_teleport',
  'teleport_then_racing', 
  'triple_click',
  'racing_sandwich'
];

// Test stime temporali
console.log('\n=== STIME TEMPORALI NUOVI TEMPLATE ===');
newTemplates.forEach(templateId => {
  const params = estimator.generateOptimalParams(templateId, 120);
  const timeRange = estimator.getTimeRange(templateId, params);
  const viable = estimator.isTemplateViable(templateId, 120, params);
  
  console.log(`${templateId}:`);
  console.log(`  Params:`, params);
  console.log(`  Range: ${timeRange.min}-${timeRange.max}s (expected: ${timeRange.expected}s)`);
  console.log(`  Viable per 120s: ${viable}`);
});

// Test distribuzione con nuovi template
console.log('\n=== TEST DISTRIBUZIONE CON NUOVI TEMPLATE ===');

const testCases = [
  { steps: 1, time: 90, desc: "1 step, 90s - dovrebbe includere nuovi compositi" },
  { steps: 1, time: 150, desc: "1 step, 150s - dovrebbe preferire template avanzati" },
  { steps: 2, time: 180, desc: "2 step, 90s/step - mix template" }
];

testCases.forEach(testCase => {
  console.log(`\n--- ${testCase.desc} ---`);
  
  const distribution = distributor.calculateOptimalDistribution(
    testCase.time, 
    testCase.steps, 
    Math.random
  );
  
  distribution.forEach((step, i) => {
    const isNew = newTemplates.includes(step.templateId);
    const isComposite = step.templateId.includes('_then_') || 
                       step.templateId === 'double_timer' ||
                       step.templateId === 'triple_click' ||
                       step.templateId === 'racing_sandwich';
    
    console.log(`  Step ${i+1}: ${step.templateId} ${isNew ? '(NUOVO)' : ''} ${isComposite ? '(COMPOSITO)' : '(singolo)'}`);
    console.log(`    Target: ${step.targetTime}s, Stimato: ${step.estimatedTime}s`);
  });
});

// Test varietà con più generazioni
console.log('\n=== TEST VARIETÀ NUOVI TEMPLATE (10 generazioni) ===');
const templateCounts = {};

for (let i = 0; i < 10; i++) {
  const distribution = distributor.calculateOptimalDistribution(120, 1, Math.random);
  const template = distribution[0].templateId;
  templateCounts[template] = (templateCounts[template] || 0) + 1;
}

console.log('Distribuzione template (10 generazioni):');
Object.entries(templateCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([template, count]) => {
    const isNew = newTemplates.includes(template);
    console.log(`  ${template}: ${count}/10 ${isNew ? '(NUOVO)' : ''}`);
  });