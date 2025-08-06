// Test locale per espansione template compositi
const advancedTemplates = require('../backend/utils/advanced-template-system');

console.log('🧌 Testing Composite Template Expansion\n');

// Test parametri
const userParams = {
  timePreset: '2min',
  steps: 1,
  testTemplate: 'racing_then_teleport'
};

const fingerprint = 'test_fingerprint_123';
const shortId = 'TEST123';

console.log('📋 Input Parameters:');
console.log('- Template:', userParams.testTemplate);
console.log('- Target Time:', 120, 'seconds');
console.log('- Fingerprint:', fingerprint);
console.log('- ShortId:', shortId);
console.log();

try {
  // Genera sequenza intelligente
  const result = advancedTemplates.generateIntelligentSequence(
    userParams,
    fingerprint,
    shortId
  );
  
  console.log('✅ Generated Sequence:');
  console.log('- Total Steps:', result.sequence.length);
  console.log('- Total Estimated Time:', result.metadata.actualTime, 'seconds');
  console.log('- Target Time:', result.metadata.targetTime, 'seconds');
  console.log('- Algorithm:', result.metadata.algorithm);
  console.log();
  
  console.log('📋 Step Details:');
  result.sequence.forEach((step, index) => {
    console.log(`Step ${index + 1}:`, {
      type: step.type,
      subtype: step.subtype,
      duration: step.duration,
      target: step.target,
      params: step.params,
      estimatedTime: step.estimatedTime
    });
  });
  
  console.log();
  
  // Test espansione diretta
  console.log('🔧 Testing Direct Expansion:');
  const expanded = advancedTemplates.expandCompositeTemplate('racing_then_teleport', 120, {});
  console.log('- Expanded Steps:', expanded.length);
  expanded.forEach((step, index) => {
    console.log(`Expanded Step ${index + 1}:`, {
      type: step.type,
      subtype: step.subtype,
      duration: step.duration,
      target: step.target,
      params: step.params,
      estimatedTime: step.estimatedTime
    });
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
}