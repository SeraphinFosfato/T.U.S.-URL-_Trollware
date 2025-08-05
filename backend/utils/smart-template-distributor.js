// Algoritmo intelligente per distribuzione template
const timeEstimator = require('./template-time-estimator');

class SmartTemplateDistributor {
  constructor() {
    // Sistema Revenue per advertising dinamico
    this.revenueSystem = {
      enabled: false, // Flag globale per abilitare revenue
      templateRevenue: {
        // Template singoli - revenue bassa
        timer_simple: 1,
        timer_punish: 2,
        click_simple: 1,
        click_drain: 2,
        click_teleport: 3,
        click_racing: 2,
        click_racing_rigged: 4,
        
        // Template compositi base - revenue media
        timer_then_click: 3,
        click_then_timer: 3,
        double_timer: 4,
        
        // Template compositi avanzati - revenue alta
        racing_then_teleport: 5,
        teleport_then_racing: 5,
        triple_click: 7,
        racing_sandwich: 8
      },
      
      // Slot pubblicitari che si sbloccano per revenue
      adSlots: {
        header: { threshold: 2, enabled: false },
        sidebar: { threshold: 4, enabled: false },
        footer: { threshold: 3, enabled: false },
        interstitial: { threshold: 6, enabled: false },
        overlay: { threshold: 8, enabled: false }
      }
    };
    this.baseWeights = {
      timer_simple: 1.0,
      timer_punish: 0.8,
      click_simple: 1.2,
      click_drain: 1.0,
      click_teleport: 0.9,
      click_racing: 1.1,
      click_racing_rigged: 0.6,
      
      // Template ricombinati base
      timer_then_click: 0.7,
      click_then_timer: 0.7,
      double_timer: 0.5,
      
      // Template compositi avanzati
      racing_then_teleport: 0.6,
      teleport_then_racing: 0.6,
      triple_click: 0.4,
      racing_sandwich: 0.3
    };
    
    // Limiti massimi realistici per template singoli
    this.templateLimits = {
      timer_simple: 60,
      timer_punish: 45,
      click_simple: 20, // 40 click * 0.5s
      click_drain: 30,  // 40 click * 0.67s
      click_teleport: 45, // 40 click * 0.8s * 1.4 frustration
      click_racing: 120, // Può durare di più
      click_racing_rigged: 150 // Può durare ancora di più
    };
  }
  
  calculateOptimalDistribution(targetTime, steps, rng, revenueMultiplier = 1.0) {
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
      
      const revenue = this.calculateRevenue(selectedTemplate, revenueMultiplier);
      
      distribution.push({
        templateId: selectedTemplate,
        params,
        estimatedTime,
        targetTime: stepTime,
        revenue
      });
      
      remainingTime -= estimatedTime;
      remainingSteps--;
    }
    
    return distribution;
  }
  
  getViableTemplates(targetTime) {
    const viable = [];
    
    Object.keys(this.baseWeights).forEach(templateId => {
      // Skip compositi se targetTime troppo piccolo
      if (templateId.includes('_then_') || templateId === 'double_timer') {
        if (targetTime < 45) return;
      }
      
      const testParams = timeEstimator.generateOptimalParams(templateId, targetTime);
      const isViable = timeEstimator.isTemplateViable(templateId, targetTime, testParams);
      
      const timeRange = timeEstimator.getTimeRange(templateId, testParams);
      console.log(`DEBUG: Template ${templateId}, targetTime: ${targetTime}, params:`, testParams, 'timeRange:', timeRange, 'viable:', isViable);
      
      if (isViable) {
        viable.push({
          templateId,
          baseWeight: this.baseWeights[templateId],
          timeRange,
          testParams
        });
      }
    });
    
    console.log(`DEBUG: Found ${viable.length} viable templates for targetTime ${targetTime}`);
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
      
      // Bonus per compositi quando singoli sono al limite
      const isComposite = template.templateId.includes('_then_') || template.templateId === 'double_timer';
      if (isComposite && targetTime > 45) {
        // Bonus crescente per tempi medi-lunghi
        const compositeBonus = Math.min((targetTime - 45) / 30, 3); // Max 3x bonus, inizia da 45s
        weight *= (1 + compositeBonus);
      }
      
      // Penalty per singoli vicini al limite
      if (!isComposite && this.templateLimits[template.templateId]) {
        const limit = this.templateLimits[template.templateId];
        if (targetTime > limit * 0.8) { // Se oltre 80% del limite
          const limitPenalty = (targetTime - limit * 0.8) / (limit * 0.2);
          weight *= Math.max(0.3, 1 - limitPenalty * 0.7); // Max 70% penalty
        }
      }
      
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
  
  // Calcola revenue per template
  calculateRevenue(templateId, multiplier = 1.0) {
    if (!this.revenueSystem.enabled) return 0;
    
    const baseRevenue = this.revenueSystem.templateRevenue[templateId] || 1;
    return Math.ceil(baseRevenue * multiplier);
  }
  
  // Calcola slot pubblicitari abilitati per revenue totale
  calculateEnabledAdSlots(totalRevenue) {
    const enabledSlots = {};
    
    Object.entries(this.revenueSystem.adSlots).forEach(([slot, config]) => {
      enabledSlots[slot] = totalRevenue >= config.threshold;
    });
    
    return enabledSlots;
  }
  
  // Abilita/disabilita sistema revenue
  setRevenueEnabled(enabled) {
    this.revenueSystem.enabled = enabled;
  }
  
  // Ottieni revenue totale da distribuzione
  getTotalRevenue(distribution) {
    return distribution.reduce((total, step) => total + (step.revenue || 0), 0);
  }
}

module.exports = new SmartTemplateDistributor();