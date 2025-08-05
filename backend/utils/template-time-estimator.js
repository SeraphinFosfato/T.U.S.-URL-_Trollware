// Sistema standardizzato per stime temporali template
class TemplateTimeEstimator {
  constructor() {
    // Database stime temporali per ogni template
    this.timeEstimates = {
      // Timer Templates
      timer_simple: {
        type: 'direct', // Tempo = parametro diretto
        baseTime: (duration) => duration,
        variance: 0.1, // ±10% varianza utente
        frustrationFactor: 1.0
      },
      
      timer_punish: {
        type: 'multiplied',
        baseTime: (duration) => duration,
        variance: 0.2, // ±20% per reload/focus loss
        frustrationFactor: 1.5 // 50% più lento per punizioni
      },
      
      // Click Templates
      click_simple: {
        type: 'calculated',
        baseTime: (clicks) => clicks * 0.5, // 0.5s per click + delay
        variance: 0.15,
        frustrationFactor: 1.0
      },
      
      click_drain: {
        type: 'calculated', 
        baseTime: (clicks) => clicks * 0.67, // Più lento per drain
        variance: 0.2,
        frustrationFactor: 1.1
      },
      
      click_teleport: {
        type: 'calculated',
        baseTime: (clicks) => clicks * 0.8, // Più lento per teleport
        variance: 0.3, // Alta varianza per frustrazione
        frustrationFactor: 1.4
      },
      
      // Racing Templates (tempo-based)
      click_racing: {
        type: 'dynamic',
        baseTime: (params) => {
          // Tempo base + fattore difficoltà
          const baseDuration = params.duration || 30;
          const difficultyMultiplier = this.getDifficultyMultiplier(params.drain);
          return baseDuration * difficultyMultiplier;
        },
        variance: 0.4, // Alta varianza per skill
        frustrationFactor: 1.2
      },
      
      click_racing_rigged: {
        type: 'dynamic',
        baseTime: (params) => {
          // Tempo reale + tempo trucco
          const realDuration = params.realDuration || 20;
          const riggedTime = realDuration * 0.6; // 60% tempo extra per trucco
          return realDuration + riggedTime;
        },
        variance: 0.5, // Altissima varianza per frustrazione
        frustrationFactor: 1.8 // Molto frustrante
      }
    };
  }
  
  // Calcola moltiplicatore difficoltà racing
  getDifficultyMultiplier(drainRate) {
    if (drainRate <= 0.6) return 0.8; // Easy = più veloce
    if (drainRate <= 1.0) return 1.0; // Medium = normale  
    return 1.3; // Hard = più lento
  }
  
  // Stima tempo per template specifico
  estimateTime(templateId, params) {
    const estimate = this.timeEstimates[templateId];
    if (!estimate) return 30; // Fallback
    
    const baseTime = estimate.baseTime(params);
    const withFrustration = baseTime * estimate.frustrationFactor;
    
    return Math.ceil(withFrustration);
  }
  
  // Calcola range temporale (min/max) per distribuzione
  getTimeRange(templateId, params) {
    const baseTime = this.estimateTime(templateId, params);
    const estimate = this.timeEstimates[templateId];
    const variance = estimate.variance;
    
    return {
      min: Math.ceil(baseTime * (1 - variance)),
      max: Math.ceil(baseTime * (1 + variance)),
      expected: baseTime
    };
  }
  
  // Verifica se template è adatto per tempo target
  isTemplateViable(templateId, targetTime, params) {
    const range = this.getTimeRange(templateId, params);
    
    // Template è viable se il tempo target è nel range ±30%
    const tolerance = 0.3;
    const minAcceptable = targetTime * (1 - tolerance);
    const maxAcceptable = targetTime * (1 + tolerance);
    
    return range.min <= maxAcceptable && range.max >= minAcceptable;
  }
  
  // Genera parametri ottimali per tempo target
  generateOptimalParams(templateId, targetTime) {
    const estimate = this.timeEstimates[templateId];
    if (!estimate) return {};
    
    switch (estimate.type) {
      case 'direct':
        return { duration: Math.max(targetTime / estimate.frustrationFactor, 15) };
        
      case 'multiplied':
        return { duration: Math.max(targetTime / estimate.frustrationFactor, 20) };
        
      case 'calculated':
        if (templateId.includes('click')) {
          const clickTime = templateId === 'click_teleport' ? 0.8 : 
                           templateId === 'click_drain' ? 0.67 : 0.5;
          const clicks = Math.max(Math.floor(targetTime / (clickTime * estimate.frustrationFactor)), 3);
          return { clicks: Math.min(clicks, 60) };
        }
        break;
        
      case 'dynamic':
        if (templateId === 'click_racing') {
          return {
            duration: Math.max(targetTime / estimate.frustrationFactor, 15),
            drain: 0.3 + Math.random() * 1.0 // 0.3-1.3 range
          };
        } else if (templateId === 'click_racing_rigged') {
          return {
            realDuration: Math.max(targetTime / estimate.frustrationFactor, 10),
            maxProgress: 80,
            resetPoint: 25
          };
        }
        break;
    }
    
    return {};
  }
}

module.exports = new TemplateTimeEstimator();