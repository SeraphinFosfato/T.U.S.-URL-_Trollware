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
          const baseDuration = params.duration || 30;
          const drainRate = params.drain || 1.0;
          const difficultyMultiplier = drainRate <= 0.6 ? 0.8 : drainRate <= 1.0 ? 1.0 : 1.3;
          return baseDuration * difficultyMultiplier;
        },
        variance: 0.4,
        frustrationFactor: 1.2
      },
      
      click_racing_rigged: {
        type: 'dynamic',
        baseTime: (params) => {
          // Tempo base come racing medio + tempo falso/10
          const baseDuration = params.realDuration || 20;
          const mediumRacingTime = baseDuration * 1.0; // Difficoltà media
          const fakeTimeBonus = baseDuration / 10; // Tempo falso diviso 10
          return mediumRacingTime + fakeTimeBonus;
        },
        variance: 0.4,
        frustrationFactor: 1.2
      },
      
      // Template Compositi
      timer_then_click: {
        type: 'composite',
        baseTime: (params) => {
          const totalTime = params.totalTime || 60;
          const timerTime = totalTime * (params.timerRatio || 0.6);
          const clickTime = totalTime * (1 - (params.timerRatio || 0.6));
          // Timer: tempo diretto, Click: tempo/2 (0.5s per click)
          return timerTime + (clickTime / 0.5) * 0.5;
        },
        variance: 0.25,
        frustrationFactor: 1.0 // Nessuna forzatura
      },
      
      click_then_timer: {
        type: 'composite', 
        baseTime: (params) => {
          const totalTime = params.totalTime || 60;
          const clickTime = totalTime * (params.timerRatio || 0.4); // timerRatio = click ratio qui
          const timerTime = totalTime * (1 - (params.timerRatio || 0.4));
          return (clickTime / 0.5) * 0.5 + timerTime;
        },
        variance: 0.25,
        frustrationFactor: 1.0
      },
      
      double_timer: {
        type: 'composite',
        baseTime: (params) => {
          // Due timer: primo normale, secondo punitivo (1.5x)
          const totalTime = params.totalTime || 60;
          const firstTimer = totalTime * 0.5;
          const secondTimer = totalTime * 0.5 * 1.5; // Fattore punitivo
          return firstTimer + secondTimer;
        },
        variance: 0.3,
        frustrationFactor: 1.0
      },
      
      // Nuovi Template Compositi Avanzati
      racing_then_teleport: {
        type: 'composite',
        baseTime: (params) => {
          const totalTime = params.totalTime || 90;
          const racingTime = totalTime * 0.6; // 60% racing
          const teleportTime = totalTime * 0.4; // 40% teleport
          return racingTime * 1.2 + (teleportTime / 0.8) * 0.8 * 1.4;
        },
        variance: 0.35,
        frustrationFactor: 1.0
      },
      
      teleport_then_racing: {
        type: 'composite', 
        baseTime: (params) => {
          const totalTime = params.totalTime || 90;
          const teleportTime = totalTime * 0.4;
          const racingTime = totalTime * 0.6;
          return (teleportTime / 0.8) * 0.8 * 1.4 + racingTime * 1.2;
        },
        variance: 0.35,
        frustrationFactor: 1.0
      },
      
      triple_click: {
        type: 'composite',
        baseTime: (params) => {
          const totalTime = params.totalTime || 120;
          // Simple -> Drain -> Teleport (escalation)
          return totalTime * 0.33 * 0.5 + totalTime * 0.33 * 0.67 + totalTime * 0.34 * 0.8 * 1.4;
        },
        variance: 0.4,
        frustrationFactor: 1.0
      },
      
      racing_sandwich: {
        type: 'composite',
        baseTime: (params) => {
          const totalTime = params.totalTime || 150;
          // Racing -> Timer -> Racing Rigged
          return totalTime * 0.4 * 1.2 + totalTime * 0.2 + totalTime * 0.4 * 1.2;
        },
        variance: 0.45,
        frustrationFactor: 1.0
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
    
    let baseTime;
    if (estimate.type === 'direct') {
      baseTime = params.duration || 30;
    } else if (estimate.type === 'multiplied') {
      baseTime = params.duration || 30;
    } else if (estimate.type === 'calculated') {
      baseTime = estimate.baseTime(params.clicks || 10);
    } else if (estimate.type === 'dynamic') {
      baseTime = estimate.baseTime(params);
    } else if (estimate.type === 'composite') {
      baseTime = params.totalTime || 60;
    } else {
      baseTime = 30;
    }
    
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
    
    // Template è viable se può essere ragionevolmente vicino al target
    const tolerance = 0.5; // Aumentato a 50% per più flessibilità
    const minAcceptable = targetTime * (1 - tolerance);
    const maxAcceptable = targetTime * (1 + tolerance);
    
    return range.expected >= minAcceptable && range.expected <= maxAcceptable;
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
          return { clicks: Math.min(clicks, 40) }; // Ridotto max click
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
        
      case 'composite':
        return {
          totalTime: targetTime,
          timerRatio: templateId === 'double_timer' ? 0.5 : 
                     templateId === 'timer_then_click' ? 0.6 : 
                     templateId === 'racing_then_teleport' ? 0.6 :
                     templateId === 'teleport_then_racing' ? 0.4 :
                     templateId === 'triple_click' ? 0.33 :
                     templateId === 'racing_sandwich' ? 0.4 : 0.4
        };
    }
    
    return {};
  }
}

module.exports = new TemplateTimeEstimator();