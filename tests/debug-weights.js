// Debug pesi template per capire perché sempre lo stesso
const distributor = require('./backend/utils/smart-template-distributor');

console.log('=== DEBUG PESI TEMPLATE ===');

const targetTime = 120;
const viable = distributor.getViableTemplates(targetTime);

console.log('\n=== ANALISI PESI DETTAGLIATA ===');

// Simula calcolo pesi come in selectOptimalTemplate
const history = []; // Nessuna storia
const dynamicWeights = viable.map(template => {
  let weight = template.baseWeight;
  console.log(`\n${template.templateId}:`);
  console.log(`  Peso base: ${weight}`);
  
  const timeDiff = Math.abs(template.timeRange.expected - targetTime);
  const precisionBonus = Math.max(0, 1 - (timeDiff / targetTime));
  weight *= (1 + precisionBonus);
  console.log(`  Precision bonus: ${precisionBonus.toFixed(3)} -> peso: ${weight.toFixed(3)}`);
  
  const recentUse = history.filter(h => h.templateId === template.templateId).length;
  const varietyPenalty = Math.pow(0.7, recentUse);
  weight *= varietyPenalty;
  console.log(`  Variety penalty: ${varietyPenalty} -> peso: ${weight.toFixed(3)}`);
  
  // Bonus per compositi quando singoli sono al limite
  const isComposite = template.templateId.includes('_then_') || template.templateId === 'double_timer';
  if (isComposite && targetTime > 45) {
    const compositeBonus = Math.min((targetTime - 45) / 30, 3);
    weight *= (1 + compositeBonus);
    console.log(`  Composite bonus: ${compositeBonus.toFixed(3)} -> peso: ${weight.toFixed(3)}`);
  }
  
  // Penalty per singoli vicini al limite
  if (!isComposite && distributor.templateLimits && distributor.templateLimits[template.templateId]) {
    const limit = distributor.templateLimits[template.templateId];
    if (targetTime > limit * 0.8) {
      const limitPenalty = (targetTime - limit * 0.8) / (limit * 0.2);
      const penaltyFactor = Math.max(0.3, 1 - limitPenalty * 0.7);
      weight *= penaltyFactor;
      console.log(`  Limit penalty: ${penaltyFactor.toFixed(3)} -> peso: ${weight.toFixed(3)}`);
    }
  }
  
  const finalWeight = Math.max(weight, 0.1);
  console.log(`  PESO FINALE: ${finalWeight.toFixed(3)}`);
  
  return {
    templateId: template.templateId,
    finalWeight,
    isComposite
  };
});

console.log('\n=== CLASSIFICA PESI ===');
dynamicWeights
  .sort((a, b) => b.finalWeight - a.finalWeight)
  .forEach((t, i) => {
    console.log(`${i+1}. ${t.templateId}: ${t.finalWeight.toFixed(3)} ${t.isComposite ? '(COMPOSITO)' : '(singolo)'}`);
  });

const totalWeight = dynamicWeights.reduce((sum, t) => sum + t.finalWeight, 0);
console.log(`\nPeso totale: ${totalWeight.toFixed(3)}`);

console.log('\n=== PROBABILITÀ SELEZIONE ===');
dynamicWeights
  .sort((a, b) => b.finalWeight - a.finalWeight)
  .forEach(t => {
    const probability = (t.finalWeight / totalWeight * 100);
    console.log(`${t.templateId}: ${probability.toFixed(1)}%`);
  });