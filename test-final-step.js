// Test per verificare che l'ultimo step funzioni correttamente
const express = require('express');
const app = express();

// Simula creazione link di test
async function createTestLink() {
  const db = require('./backend/config/database');
  
  const testData = {
    original_url: 'https://www.google.com',
    user_params: {
      timePreset: '30s',
      steps: 2  // Solo 2 step per test rapido
    },
    expiry_days: 1,
    created_at: Date.now()
  };
  
  const shortId = 'test' + Date.now().toString().slice(-6);
  
  try {
    await db.saveUrl(shortId, testData);
    console.log(`✅ Link di test creato: https://tus-tasklink.onrender.com/v/${shortId}`);
    console.log(`📋 Parametri: ${testData.user_params.steps} step, ${testData.user_params.timePreset}`);
    console.log(`🎯 Redirect finale: ${testData.original_url}`);
    console.log('');
    console.log('🧪 Test manuale:');
    console.log('1. Apri il link sopra');
    console.log('2. Completa tutti gli step');
    console.log('3. Verifica che l\'ultimo step mostri il continue button');
    console.log('4. Verifica che il continue button reindirizza a Google');
    
    return shortId;
  } catch (error) {
    console.error('❌ Errore creazione link test:', error);
    return null;
  }
}

// Test automatico della logica ultimo step
function testFinalStepLogic() {
  console.log('🔍 Test Logica Ultimo Step\n');
  
  // Simula pathData con 3 step
  const mockPathData = {
    templates: [
      { type: 'timer', duration: 15 },
      { type: 'click', target: 5 },
      { type: 'timer', duration: 10 }
    ]
  };
  
  console.log(`📊 PathData simulato: ${mockPathData.templates.length} step totali`);
  
  // Test vari currentStep
  const testCases = [
    { currentStep: 0, expected: 'step normale' },
    { currentStep: 1, expected: 'step normale' },
    { currentStep: 2, expected: 'step normale' },
    { currentStep: 3, expected: 'redirect finale' },
    { currentStep: 4, expected: 'redirect finale' }
  ];
  
  testCases.forEach(testCase => {
    const isComplete = testCase.currentStep >= mockPathData.templates.length;
    const result = isComplete ? 'redirect finale' : 'step normale';
    const status = result === testCase.expected ? '✅' : '❌';
    
    console.log(`${status} Step ${testCase.currentStep}: ${result} (atteso: ${testCase.expected})`);
  });
  
  console.log('\n📝 Logica corretta: currentStep >= templates.length = redirect finale');
}

// Esegui test
if (require.main === module) {
  console.log('🧪 Test Continue Button Ultimo Step\\n');
  
  testFinalStepLogic();
  
  console.log('\n' + '='.repeat(50));
  console.log('🌐 Creazione Link Test per Verifica Manuale\\n');
  
  createTestLink().then(shortId => {
    if (shortId) {
      console.log('\n✅ Test setup completato!');
      console.log('💡 Usa il link sopra per testare manualmente il continue button');
    }
    process.exit(0);
  });
}

module.exports = { testFinalStepLogic, createTestLink };