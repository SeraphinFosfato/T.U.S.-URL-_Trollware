// Test per i nuovi click games
const advancedTemplates = require('./backend/utils/advanced-template-system');

function testNewClickGames() {
  console.log('🎮 Test Nuovi Click Games\n');
  
  const userParams = {
    timePreset: '1min',
    steps: 3
  };
  
  // Test con fingerprint che dovrebbe generare i nuovi template
  const testFingerprints = [
    'teleport_test_fp',
    'racing_test_fp', 
    'rigged_test_fp'
  ];
  
  testFingerprints.forEach((fp, index) => {
    console.log(`🧪 Test ${index + 1} - Fingerprint: ${fp}`);
    
    const result = advancedTemplates.generateConstrainedSequence(
      userParams,
      fp,
      'test_shortid'
    );
    
    console.log(`   Seed: ${result.metadata.seed}`);
    console.log('   Sequenza:');
    
    result.sequence.forEach((step, i) => {
      console.log(`     ${i + 1}. ${step.type}_${step.subtype}`);
      if (step.target) console.log(`        Target: ${step.target} clicks`);
      if (step.params) console.log(`        Params:`, step.params);
      console.log(`        Tempo stimato: ${step.estimatedTime}s`);
    });
    
    console.log('');
  });
}

function testSpecificTemplates() {
  console.log('🔍 Test Template Specifici\n');
  
  // Test template teleport
  console.log('📱 Teleporting Click:');
  const teleport = advancedTemplates.generateAtomicTemplate('click_teleport', 20, {});
  console.log('  ', JSON.stringify(teleport, null, 2));
  
  // Test template racing
  console.log('\n🏁 Racing Click:');
  const racing = advancedTemplates.generateAtomicTemplate('click_racing', 30, {});
  console.log('  ', JSON.stringify(racing, null, 2));
  
  // Test template rigged
  console.log('\n🎭 Rigged Racing:');
  const rigged = advancedTemplates.generateAtomicTemplate('click_racing_rigged', 25, {});
  console.log('  ', JSON.stringify(rigged, null, 2));
}

function testTemplateGeneration() {
  console.log('⚙️ Test Generazione Template\n');
  
  // Genera 10 sequenze per vedere varietà
  for (let i = 1; i <= 10; i++) {
    const fp = `test_variety_${i}`;
    const result = advancedTemplates.generateConstrainedSequence(
      { timePreset: '1min', steps: 2 },
      fp,
      'variety_test'
    );
    
    const types = result.sequence.map(s => s.subtype).join(' + ');
    console.log(`${i.toString().padStart(2)}: ${types} (${result.metadata.actualTime}s)`);
  }
}

// Esegui test
if (require.main === module) {
  testNewClickGames();
  console.log('='.repeat(50));
  testSpecificTemplates();
  console.log('='.repeat(50));
  testTemplateGeneration();
  
  console.log('\n🎯 Test completati!');
  console.log('💡 Controlla che i nuovi template appaiano nelle sequenze generate');
}

module.exports = { testNewClickGames, testSpecificTemplates, testTemplateGeneration };