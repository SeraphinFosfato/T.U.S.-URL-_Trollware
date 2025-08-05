// Algoritmo intelligente per distribuzione template
const timeEstimator = require('./template-time-estimator');

class SmartTemplateDistributor {
  constructor() {
    // Pesi base per varietà
    this.baseWeights = {
      timer_simple: 1.0,
      timer_punish: 0.8, // Meno frequente (frustrante)
      click_simple: 1.2,
      click_drain: 1.0,
      click_teleport: 0.9, // Meno frequente (molto frustrante)
      click_racing: 1.1,
      click_racing_rigged: 0.6, // Raro (estremamente frustrante)
      
      // Compositi
      timer_then_click: 0.7,
      click_then_timer: 0.7,
      double_timer: 0.5
    };
  }
  
  // Calcola distribuzione ottimale per sequenza
  calculateOptimalDistribution(targetTime, steps, rng) {
    const timePerStep = targetTime / steps;
    const distribution = [];
    
    // Analizza ogni template per viabilità
    const viableTemplates = this.getViableTemplates(timePerStep);
    
    // Distribuzione intelligente basata su tempo
    let remainingTime = targetTime;
    let remainingSteps = steps;
    
    for (let i = 0; i < steps; i++) {
      const stepTime = i === steps - 1 ? remainingTime : 
                      Math.floor(remainingTime / remainingSteps);
      
      // Seleziona template ottimale per questo step
      const selectedTemplate = this.selectOptimalTemplate(
        stepTime, 
        viableTemplates, 
        distribution, // Storia per varietà
        rng
      );
      
      // Genera parametri ottimali
      const params = timeEstimator.generateOptimalParams(selectedTemplate, stepTime);
      const estimatedTime = timeEstimator.estimateTime(selectedTemplate, params);
      
      distribution.push({
        templateId: selectedTemplate,
        params,
        estimatedTime,
        targetTime: stepTime
      });
      
      remainingTime -= estimatedTime;
      remainingSteps--;
    }
    
    return distribution;
  }
  
  // Trova template viabili per tempo target
  getViableTemplates(targetTime) {
    const viable = [];
    
    Object.keys(this.baseWeights).forEach(templateId => {
      // Skip compositi per ora (logica separata)
      if (templateId.includes('_then_') || templateId === 'double_timer') {
        return;
      }
      
      // Genera parametri di test
      const testParams = timeEstimator.generateOptimalParams(templateId, targetTime);
      
      // Verifica viabilità
      if (timeEstimator.isTemplateViable(templateId, targetTime, testParams)) {
        const timeRange = timeEstimator.getTimeRange(templateId, testParams);
        
        viable.push({
          templateId,
          baseWeight: this.baseWeights[templateId],
          timeRange,
          testParams
        });
      }
    });
    
    return viable;\n  }\n  \n  // Seleziona template ottimale con varietà\n  selectOptimalTemplate(targetTime, viableTemplates, history, rng) {\n    if (viableTemplates.length === 0) {\n      return 'timer_simple'; // Fallback sicuro\n    }\n    \n    // Calcola pesi dinamici\n    const dynamicWeights = viableTemplates.map(template => {\n      let weight = template.baseWeight;\n      \n      // Bonus per precisione temporale\n      const timeDiff = Math.abs(template.timeRange.expected - targetTime);\n      const precisionBonus = Math.max(0, 1 - (timeDiff / targetTime));\n      weight *= (1 + precisionBonus);\n      \n      // Penalty per ripetizione (varietà)\n      const recentUse = history.filter(h => h.templateId === template.templateId).length;\n      const varietyPenalty = Math.pow(0.7, recentUse);\n      weight *= varietyPenalty;\n      \n      // Bonus per bilanciamento categoria\n      const categoryBalance = this.getCategoryBalance(template.templateId, history);\n      weight *= categoryBalance;\n      \n      return {\n        ...template,\n        finalWeight: Math.max(weight, 0.1) // Min weight\n      };\n    });\n    \n    // Selezione pesata\n    const totalWeight = dynamicWeights.reduce((sum, t) => sum + t.finalWeight, 0);\n    let random = rng() * totalWeight;\n    \n    for (const template of dynamicWeights) {\n      random -= template.finalWeight;\n      if (random <= 0) {\n        return template.templateId;\n      }\n    }\n    \n    // Fallback\n    return dynamicWeights[0].templateId;\n  }\n  \n  // Calcola bilanciamento categorie\n  getCategoryBalance(templateId, history) {\n    const categories = {\n      timer: ['timer_simple', 'timer_punish'],\n      click: ['click_simple', 'click_drain', 'click_teleport'],\n      racing: ['click_racing', 'click_racing_rigged']\n    };\n    \n    const currentCategory = Object.keys(categories).find(cat => \n      categories[cat].includes(templateId)\n    );\n    \n    if (!currentCategory || history.length === 0) return 1.0;\n    \n    // Conta uso per categoria\n    const categoryCount = {};\n    categories[currentCategory].forEach(id => {\n      categoryCount[id] = history.filter(h => h.templateId === id).length;\n    });\n    \n    const totalInCategory = Object.values(categoryCount).reduce((sum, count) => sum + count, 0);\n    const totalSteps = history.length;\n    \n    // Bonus se categoria è sotto-rappresentata\n    const expectedRatio = categories[currentCategory].length / Object.keys(this.baseWeights).length;\n    const actualRatio = totalInCategory / totalSteps;\n    \n    return actualRatio < expectedRatio ? 1.3 : 0.9;\n  }\n}\n\nmodule.exports = new SmartTemplateDistributor();