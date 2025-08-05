// Algoritmo intelligente per distribuzione template
const timeEstimator = require('./template-time-estimator');

class SmartTemplateDistributor {
  constructor() {
    this.baseWeights = {
      timer_simple: 1.0,
      timer_punish: 0.8,
      click_simple: 1.2,
      click_drain: 1.0,
      click_teleport: 0.9,
      click_racing: 1.1,
      click_racing_rigged: 0.6
    };
  }
  
  calculateOptimalDistribution(targetTime, steps, rng) {
    const timePerStep = targetTime / steps;
    const distribution = [];
    
    const viableTemplates = this.getViableTemplates(timePerStep);
    
    let remainingTime = targetTime;
    let remainingSteps = steps;
    
    for (let i = 0; i < steps; i++) {
      const stepTime = i === steps - 1 ? remainingTime : Math.floor(remainingTime / remainingSteps);
      
      const selectedTemplate = this.selectOptimalTemplate(stepTime, viableTemplates, distribution, rng);
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
  
  getViableTemplates(targetTime) {
    const viable = [];
    
    Object.keys(this.baseWeights).forEach(templateId => {
      const testParams = timeEstimator.generateOptimalParams(templateId, targetTime);
      
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
    
    return viable;
  }
  
  selectOptimalTemplate(targetTime, viableTemplates, history, rng) {
    if (viableTemplates.length === 0) {
      return 'timer_simple';
    }
    
    const dynamicWeights = viableTemplates.map(template => {
      let weight = template.baseWeight;
      
      const timeDiff = Math.abs(template.timeRange.expected - targetTime);
      const precisionBonus = Math.max(0, 1 - (timeDiff / targetTime));
      weight *= (1 + precisionBonus);
      
      const recentUse = history.filter(h => h.templateId === template.templateId).length;
      const varietyPenalty = Math.pow(0.7, recentUse);
      weight *= varietyPenalty;
      
      return {
        ...template,
        finalWeight: Math.max(weight, 0.1)
      };
    });
    
    const totalWeight = dynamicWeights.reduce((sum, t) => sum + t.finalWeight, 0);
    let random = rng() * totalWeight;
    
    for (const template of dynamicWeights) {
      random -= template.finalWeight;
      if (random <= 0) {
        return template.templateId;
      }
    }
    
    return dynamicWeights[0].templateId;
  }
}

module.exports = new SmartTemplateDistributor();