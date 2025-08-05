// Test per verificare consistenza percorso su reload
const advancedTemplates = require('./backend/utils/advanced-template-system');

function testReloadConsistency() {
  console.log('Test Consistenza Percorso su Reload\n');
  
  // Simula parametri utente fissi
  const userParams = {
    timePreset: '1min',
    steps: 3
  };
  
  // Simula fingerprint fisso (stesso utente)
  const testFingerprint = 'test_fingerprint_123';
  const testShortId = 'abc123';
  
  console.log('Parametri Test:');
  console.log(`- Fingerprint: ${testFingerprint}`);
  console.log(`- ShortId: ${testShortId}`);
  console.log('- UserParams:', userParams);
  console.log('');
  
  // Genera 5 sequenze con stesso fingerprint (simula 5 reload)
  const sequences = [];
  
  for (let i = 1; i <= 5; i++) {
    console.log(`Reload ${i}:`);
    
    const result = advancedTemplates.generateConstrainedSequence(
      userParams,
      testFingerprint,
      testShortId
    );
    
    sequences.push(result);
    
    // Mostra sequenza generata
    const sequenceInfo = result.sequence.map(step => ({
      type: step.type,
      subtype: step.subtype,
      duration: step.duration,
      target: step.target,
      estimatedTime: step.estimatedTime
    }));
    
    console.log('  Sequenza:', JSON.stringify(sequenceInfo, null, 2));
    console.log(`  Seed: ${result.metadata.seed}`);
    console.log(`  Tempo totale: ${result.metadata.actualTime}s`);
    console.log('');
  }
  
  // Verifica consistenza
  console.log('Verifica Consistenza:');
  
  const firstSequence = sequences[0];
  let allConsistent = true;
  
  for (let i = 1; i < sequences.length; i++) {
    const currentSequence = sequences[i];
    
    // Verifica seed identico
    if (firstSequence.metadata.seed !== currentSequence.metadata.seed) {
      console.log(`ERRORE: Seed diverso al reload ${i + 1}: ${firstSequence.metadata.seed} vs ${currentSequence.metadata.seed}`);
      allConsistent = false;
    }
    
    // Verifica sequenza identica
    if (firstSequence.sequence.length !== currentSequence.sequence.length) {
      console.log(`ERRORE: Lunghezza sequenza diversa al reload ${i + 1}`);
      allConsistent = false;
      continue;
    }
    
    for (let j = 0; j < firstSequence.sequence.length; j++) {
      const firstStep = firstSequence.sequence[j];
      const currentStep = currentSequence.sequence[j];
      
      if (firstStep.type !== currentStep.type || 
          firstStep.subtype !== currentStep.subtype ||
          firstStep.duration !== currentStep.duration ||
          firstStep.target !== currentStep.target) {
        console.log(`ERRORE: Step ${j} diverso al reload ${i + 1}:`);
        console.log(`   Primo:   ${JSON.stringify(firstStep)}`);
        console.log(`   Corrente: ${JSON.stringify(currentStep)}`);
        allConsistent = false;
      }
    }
  }
  
  if (allConsistent) {
    console.log('SUCCESSO: Tutti i reload hanno prodotto la stessa sequenza!');
    console.log(`   Seed consistente: ${firstSequence.metadata.seed}`);
    console.log(`   Sequenza: ${firstSequence.sequence.length} step`);
  } else {
    console.log('FALLIMENTO: I reload hanno prodotto sequenze diverse!');
  }
  
  return allConsistent;
}

// Test con fingerprint diversi
function testDifferentFingerprints() {
  console.log('\nTest Fingerprint Diversi\n');
  
  const userParams = { timePreset: '1min', steps: 3 };
  const testShortId = 'abc123';
  
  const fingerprints = ['user1_fp', 'user2_fp', 'user3_fp'];
  const results = [];
  
  fingerprints.forEach((fp, index) => {
    console.log(`Utente ${index + 1} (${fp}):`);
    
    const result = advancedTemplates.generateConstrainedSequence(
      userParams,
      fp,
      testShortId
    );
    
    results.push(result);
    
    console.log(`   Seed: ${result.metadata.seed}`);
    console.log(`   Sequenza: ${result.sequence.map(s => s.type + '_' + s.subtype).join(' -> ')}`);
    console.log('');
  });
  
  // Verifica che fingerprint diversi producano sequenze diverse
  const allDifferent = results.every((result, i) => 
    results.every((other, j) => 
      i === j || result.metadata.seed !== other.metadata.seed
    )
  );
  
  if (allDifferent) {
    console.log('SUCCESSO: Fingerprint diversi producono sequenze diverse!');
  } else {
    console.log('FALLIMENTO: Alcuni fingerprint producono la stessa sequenza!');
  }
  
  return allDifferent;
}

// Esegui test
if (require.main === module) {
  const test1 = testReloadConsistency();
  const test2 = testDifferentFingerprints();
  
  console.log('\nRisultato Finale:');
  console.log(`- Test Reload Consistenza: ${test1 ? 'PASS' : 'FAIL'}`);
  console.log(`- Test Fingerprint Diversi: ${test2 ? 'PASS' : 'FAIL'}`);
  
  if (test1 && test2) {
    console.log('\nTUTTI I TEST SUPERATI! Il sistema RNG deterministico funziona correttamente.');
  } else {
    console.log('\nAlcuni test sono falliti. Controllare implementazione.');
  }
}

module.exports = { testReloadConsistency, testDifferentFingerprints };