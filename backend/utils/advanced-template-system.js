// Sistema template avanzato con vincoli temporali
const crypto = require('crypto');
const timeEstimator = require('./template-time-estimator');
const smartDistributor = require('./smart-template-distributor');

class AdvancedTemplateSystem {
  constructor() {
    this.templates = this.initializeTemplates();
    this.timePresets = {
      '30s': 30,
      '1min': 60, 
      '2min': 120,
      '5min': 300,
      '10min': 600
    };
    this.expiryPresets = {
      '1h': 1/24,
      '1d': 1,
      '3d': 3, 
      '7d': 7
    };
  }

  initializeTemplates() {
    return {
      // Template atomici
      timer_simple: {
        id: 'timer_simple',
        type: 'atomic',
        category: 'timer',
        minDuration: 15,
        maxDuration: 60,
        stepSize: 5,
        estimatedTime: (duration) => duration,
        generateDuration: (targetTime, constraints) => {
          // Usa targetTime come base, poi aggiusta ai vincoli
          let duration = Math.round(targetTime / 5) * 5; // Round to 5s steps
          duration = Math.max(duration, 15); // Min 15s
          duration = Math.min(duration, 60); // Max 60s
          
          // Se targetTime è troppo grande per un singolo timer, usa max
          if (targetTime > 60) duration = 60;
          
          return duration;
        }
      },

      timer_punish: {
        id: 'timer_punish',
        type: 'atomic', 
        category: 'timer',
        minDuration: 20,
        maxDuration: 45,
        stepSize: 5,
        estimatedTime: (duration) => duration * 1.5, // Fattore punizione
        generateDuration: (targetTime, constraints) => {
          // Timer punitivo: usa targetTime ma con limiti più stretti
          let duration = Math.round(targetTime / 5) * 5;
          duration = Math.max(duration, 20); // Min 20s
          duration = Math.min(duration, 45); // Max 45s
          
          if (targetTime > 45) duration = 45;
          
          return duration;
        }
      },

      click_simple: {
        id: 'click_simple',
        type: 'atomic',
        category: 'click',
        clicksPerSecond: 2, // Con delay 0.5s = 2 click/sec reali
        minClicks: 3,
        maxClicks: 60,
        estimatedTime: (clicks) => Math.ceil(clicks * 0.5), // 0.5s per click
        generateClicks: (targetTime, constraints) => {
          // Calcola click basati su targetTime (0.5s per click)
          let clicks = Math.max(Math.floor(targetTime * 2), 3); // Min 3 click
          clicks = Math.min(clicks, 60); // Max 60 click
          return clicks;
        }
      },

      click_drain: {
        id: 'click_drain',
        type: 'atomic',
        category: 'click',
        clicksPerSecond: 1.5, // Più lento per drain
        minClicks: 10,
        maxClicks: 60,
        estimatedTime: (clicks) => Math.ceil(clicks * 0.67), // ~0.67s per click
        generateClicks: (targetTime, constraints) => {
          // Click drain: più lento
          let clicks = Math.max(Math.floor(targetTime * 1.5), 10); // Min 10 click
          clicks = Math.min(clicks, 60); // Max 60 click
          return clicks;
        }
      },

      click_teleport: {
        id: 'click_teleport',
        type: 'atomic',
        category: 'click',
        clicksPerSecond: 2, // Stesso di click_simple
        minClicks: 5,
        maxClicks: 40, // Meno click per compensare difficoltà
        estimatedTime: (clicks) => Math.ceil(clicks * 0.6), // Più veloce per frustrazione
        generateClicks: (targetTime, constraints) => {
          let clicks = Math.max(Math.floor(targetTime * 1.8), 5); // Min 5 click
          clicks = Math.min(clicks, 40); // Max 40 click
          return clicks;
        }
      },

      click_racing: {
        id: 'click_racing',
        type: 'atomic',
        category: 'click',
        clicksPerSecond: 10, // Velocità massima
        minTime: 15,
        maxTime: 45,
        estimatedTime: (targetTime) => targetTime,
        generateDifficulty: (targetTime, constraints) => {
          // 3 difficoltà: easy, medium, hard
          const difficulties = [
            { drain: 0.3 + Math.random() * 0.3, name: 'easy' },    // 0.3-0.6%
            { drain: 0.7 + Math.random() * 0.3, name: 'medium' },  // 0.7-1.0%  
            { drain: 1.1 + Math.random() * 0.2, name: 'hard' }     // 1.1-1.3%
          ];
          const rng = Math.floor(Math.random() * 3);
          return { ...difficulties[rng], duration: Math.max(targetTime, 15) };
        }
      },

      click_racing_rigged: {
        id: 'click_racing_rigged',
        type: 'atomic', 
        category: 'click',
        clicksPerSecond: 10, // Identico al racing normale
        minTime: 10,
        maxTime: 40,
        estimatedTime: (targetTime) => targetTime,
        generateRiggedParams: (targetTime, constraints) => {
          const realDuration = Math.max(Math.min(targetTime, 40), 10);
          const fakeDifficulty = Math.floor(Math.random() * 3); // Finta difficoltà
          return { 
            realDuration,
            fakeDifficulty,
            maxProgress: 80, // Non può superare 80%
            resetPoint: 25   // Riporta al 25%
          };
        }
      },

      // Template compositi
      timer_then_click: {
        id: 'timer_then_click',
        type: 'composite',
        components: ['timer_simple', 'click_simple'],
        estimatedTime: (components) => components.reduce((sum, c) => sum + c.estimatedTime, 0),
        generateSequence: (targetTime, constraints) => {
          const timerTime = Math.floor(targetTime * 0.6); // 60% timer
          const clickTime = targetTime - timerTime;
          
          const timer = this.generateAtomicTemplate('timer_simple', timerTime, constraints);
          const click = this.generateAtomicTemplate('click_simple', clickTime, constraints);
          
          return [timer, click];
        }
      },

      click_then_timer: {
        id: 'click_then_timer',
        type: 'composite', 
        components: ['click_simple', 'timer_simple'],
        estimatedTime: (components) => components.reduce((sum, c) => sum + c.estimatedTime, 0),
        generateSequence: (targetTime, constraints) => {
          const clickTime = Math.floor(targetTime * 0.4); // 40% click
          const timerTime = targetTime - clickTime;
          
          const click = this.generateAtomicTemplate('click_simple', clickTime, constraints);
          const timer = this.generateAtomicTemplate('timer_simple', timerTime, constraints);
          
          return [click, timer];
        }
      },

      double_timer: {
        id: 'double_timer',
        type: 'composite',
        components: ['timer_simple', 'timer_punish'],
        estimatedTime: (components) => components.reduce((sum, c) => sum + c.estimatedTime, 0),
        generateSequence: (targetTime, constraints) => {
          const simpleTime = Math.floor(targetTime * 0.5);
          const punishTime = Math.floor(targetTime * 0.5);
          
          const simple = this.generateAtomicTemplate('timer_simple', simpleTime, constraints);
          const punish = this.generateAtomicTemplate('timer_punish', punishTime, constraints);
          
          return [simple, punish];
        }
      }
    };
  }

  // Calcola limiti step dinamici basati su tempo
  calculateMaxSteps(targetTimeSeconds) {
    if (targetTimeSeconds <= 30) return 2;
    if (targetTimeSeconds <= 60) return 3;
    if (targetTimeSeconds <= 120) return 4;
    return 5;
  }

  // Genera seed deterministico per RNG (SOLO fingerprint + shortId)
  generateImprovedSeed(fingerprint, shortId) {
    const components = [
      fingerprint,
      shortId,
      'troll_rng_salt_2024' // Salt fisso per sicurezza
    ];
    
    const rawSeed = components.join('|');
    return crypto.createHash('sha256').update(rawSeed).digest('hex');
  }

  // RNG con seed migliorato
  createSeededRNG(seed) {
    let state = parseInt(seed.substring(0, 8), 16);
    return function() {
      state = (state * 1664525 + 1013904223) % Math.pow(2, 32);
      return state / Math.pow(2, 32);
    };
  }

  // Genera template atomico con vincoli
  generateAtomicTemplate(templateId, targetTime, constraints = {}) {
    const template = this.templates[templateId];
    if (!template || template.type !== 'atomic') return null;

    const logger = require('./debug-logger');
    
    if (template.category === 'timer') {
      const duration = template.generateDuration(targetTime, constraints);
      logger.debug('TEMPLATE', `Generated ${templateId}`, { targetTime, duration, constraints });
      
      return {
        type: template.category,
        subtype: templateId,
        duration,
        estimatedTime: template.estimatedTime(duration)
      };
    }
    
    if (template.category === 'click') {
      if (templateId === 'click_racing') {
        const params = template.generateDifficulty(targetTime, constraints);
        logger.debug('TEMPLATE', `Generated ${templateId}`, { targetTime, params, constraints });
        
        return {
          type: template.category,
          subtype: templateId,
          params,
          estimatedTime: template.estimatedTime(params.duration)
        };
      } else if (templateId === 'click_racing_rigged') {
        const params = template.generateRiggedParams(targetTime, constraints);
        logger.debug('TEMPLATE', `Generated ${templateId}`, { targetTime, params, constraints });
        
        return {
          type: template.category,
          subtype: templateId,
          params,
          estimatedTime: template.estimatedTime(params.realDuration)
        };
      } else {
        const clicks = template.generateClicks(targetTime, constraints);
        const estimatedTime = template.estimatedTime(clicks);
        
        logger.debug('TEMPLATE', `Generated ${templateId}`, { targetTime, clicks, estimatedTime, constraints });
        
        return {
          type: template.category,
          subtype: templateId,
          target: clicks,
          estimatedTime
        };
      }
    }

    return null;
  }

  // Genera sequenza completa con nuovo sistema intelligente
  generateIntelligentSequence(userParams, fingerprint, shortId) {
    const logger = require('./debug-logger');
    
    try {
      const targetTime = this.timePresets[userParams.timePreset] || 60;
      const maxSteps = this.calculateMaxSteps(targetTime);
      const requestedSteps = Math.min(userParams.steps || maxSteps, maxSteps);
      
      // Test override: usa sistema intelligente anche per test
      if (userParams.testTemplate) {
        // Forza il template nel sistema intelligente
        const distribution = [{
          templateId: userParams.testTemplate,
          params: timeEstimator.generateOptimalParams(userParams.testTemplate, targetTime),
          estimatedTime: timeEstimator.estimateTime(userParams.testTemplate, timeEstimator.generateOptimalParams(userParams.testTemplate, targetTime)),
          targetTime: targetTime
        }];
        
        // Espandi compositi
        const sequence = distribution.map(item => {
          if (item.templateId.includes('_then_') || item.templateId === 'double_timer' || 
              item.templateId === 'triple_click' || item.templateId === 'racing_sandwich' ||
              item.templateId === 'racing_then_teleport' || item.templateId === 'teleport_then_racing') {
            
            logger.info('TEMPLATE', 'TEST: Expanding composite template', {
              templateId: item.templateId,
              targetTime: item.targetTime,
              params: item.params
            });
            
            const expanded = this.expandCompositeTemplate(item.templateId, item.targetTime, item.params);
            
            logger.info('TEMPLATE', 'TEST: Composite expanded', {
              templateId: item.templateId,
              expanded: expanded.map(s => ({ type: s.type, subtype: s.subtype, estimatedTime: s.estimatedTime }))
            });
            
            return expanded;
          }
          
          const template = this.templates[item.templateId];
          if (!template) {
            return {
              type: 'timer',
              subtype: 'timer_simple',
              duration: 30,
              estimatedTime: 30
            };
          }
          
          if (template.category === 'timer') {
            return {
              type: template.category,
              subtype: item.templateId,
              duration: item.params.duration || 30,
              estimatedTime: item.estimatedTime
            };
          } else if (template.category === 'click') {
            if (item.templateId.includes('racing')) {
              return {
                type: template.category,
                subtype: item.templateId,
                params: item.params || { duration: 30, drain: 1.0 },
                estimatedTime: item.estimatedTime
              };
            } else {
              return {
                type: template.category,
                subtype: item.templateId,
                target: item.params.clicks || 10,
                estimatedTime: item.estimatedTime
              };
            }
          }
          
          return {
            type: 'timer',
            subtype: 'timer_simple',
            duration: 30,
            estimatedTime: 30
          };
        }).filter(Boolean);
        
        // Flatten compositi espansi
        const flatSequence = [];
        sequence.forEach(item => {
          if (Array.isArray(item)) {
            flatSequence.push(...item);
          } else {
            flatSequence.push(item);
          }
        });
        
        const totalEstimatedTime = flatSequence.reduce((sum, s) => sum + s.estimatedTime, 0);
        
        logger.info('TEMPLATE', 'Generated test template sequence', {
          testTemplate: userParams.testTemplate,
          sequence: flatSequence.map(s => ({ type: s.type, subtype: s.subtype, estimatedTime: s.estimatedTime })),
          totalEstimatedTime,
          targetTime
        });
        
        return {
          sequence: flatSequence,
          metadata: {
            targetTime,
            actualTime: totalEstimatedTime,
            steps: flatSequence.length,
            algorithm: 'test_forced',
            testTemplate: userParams.testTemplate
          }
        };
      }
    
    logger.info('TEMPLATE', 'Generating intelligent sequence', {
      targetTime,
      requestedSteps,
      maxSteps,
      userParams
    });

    // Genera seed deterministico
    const seed = this.generateImprovedSeed(fingerprint, shortId);
    const rng = this.createSeededRNG(seed);
    
    // Usa nuovo algoritmo intelligente
    const distribution = smartDistributor.calculateOptimalDistribution(
      targetTime, 
      requestedSteps, 
      rng
    );
    
    // Converte in formato compatibile con fallback robusto
    const sequence = distribution.map(item => {
      const template = this.templates[item.templateId];
      
      // Template compositi: espandi in step multipli
      if (item.templateId.includes('_then_') || item.templateId === 'double_timer' || 
          item.templateId === 'triple_click' || item.templateId === 'racing_sandwich' ||
          item.templateId === 'racing_then_teleport' || item.templateId === 'teleport_then_racing') {
        
        logger.info('TEMPLATE', 'Expanding composite template', {
          templateId: item.templateId,
          targetTime: item.targetTime,
          params: item.params
        });
        
        // Espandi compositi in step atomici
        const subSteps = this.expandCompositeTemplate(item.templateId, item.targetTime, item.params);
        
        logger.info('TEMPLATE', 'Composite expanded to steps', {
          templateId: item.templateId,
          subSteps: subSteps.map(s => ({ type: s.type, subtype: s.subtype, estimatedTime: s.estimatedTime }))
        });
        
        return subSteps; // Ritorna array di step atomici
      }
      
      if (!template) {
        return {
          type: 'timer',
          subtype: 'timer_simple',
          duration: 30,
          estimatedTime: 30
        };
      }
      
      if (template.category === 'timer') {
        return {
          type: template.category,
          subtype: item.templateId,
          duration: item.params.duration || 30,
          estimatedTime: item.estimatedTime
        };
      } else if (template.category === 'click') {
        if (item.templateId.includes('racing')) {
          return {
            type: template.category,
            subtype: item.templateId,
            params: item.params || { duration: 30, drain: 1.0 },
            estimatedTime: item.estimatedTime
          };
        } else {
          return {
            type: template.category,
            subtype: item.templateId,
            target: item.params.clicks || 10,
            estimatedTime: item.estimatedTime
          };
        }
      }
      
      return {
        type: 'timer',
        subtype: 'timer_simple',
        duration: 30,
        estimatedTime: 30
      };
    }).filter(Boolean);
    
    // Flatten compositi espansi
    const flatSequence = [];
    sequence.forEach(item => {
      if (Array.isArray(item)) {
        flatSequence.push(...item); // Espandi compositi
      } else {
        flatSequence.push(item);
      }
    });
    
    const totalEstimatedTime = flatSequence.reduce((sum, s) => sum + s.estimatedTime, 0);
    
    logger.info('TEMPLATE', 'Generated intelligent sequence', {
      sequence: flatSequence.map(s => ({ type: s.type, subtype: s.subtype, estimatedTime: s.estimatedTime })),
      totalEstimatedTime,
      targetTime,
      accuracy: Math.abs(totalEstimatedTime - targetTime) / targetTime,
      seed: seed.substring(0, 8)
    });
    
    return {
      sequence: flatSequence,
      metadata: {
        targetTime,
        actualTime: totalEstimatedTime,
        steps: flatSequence.length,
        accuracy: Math.abs(totalEstimatedTime - targetTime) / targetTime,
        algorithm: 'intelligent',
        seed: seed.substring(0, 8)
      }
    };
    
    } catch (error) {
      logger.error('TEMPLATE', 'Intelligent system failed', { error: error.message });
      throw error; // Forza il fix invece di nascondere il problema
    }
  }

  // Genera sequenza completa con vincoli (legacy)
  generateConstrainedSequence(userParams, fingerprint, shortId) {
    const logger = require('./debug-logger');
    
    const targetTime = this.timePresets[userParams.timePreset] || 60;
    const maxSteps = this.calculateMaxSteps(targetTime);
    const requestedSteps = Math.min(userParams.steps || maxSteps, maxSteps);
    
    // Test override: forza template specifico
    const constraints = {
      forceTemplate: userParams.testTemplate || null
    };
    
    logger.info('TEMPLATE', 'Generating constrained sequence', {
      targetTime,
      requestedSteps,
      maxSteps,
      userParams
    });

    // Genera seed migliorato
    const seed = this.generateImprovedSeed(fingerprint, shortId);
    const rng = this.createSeededRNG(seed);
    
    // Calcola tempo per step
    const timePerStep = Math.floor(targetTime / requestedSteps);
    
    // Seleziona template con peso basato su vincoli
    const availableTemplates = this.getWeightedTemplates(timePerStep, requestedSteps, rng);
    const sequence = [];
    
    let remainingTime = targetTime;
    let remainingSteps = requestedSteps;
    
    for (let i = 0; i < requestedSteps; i++) {
      const stepTime = i === requestedSteps - 1 ? remainingTime : Math.floor(remainingTime / remainingSteps);
      
      // Seleziona template pesato
      const templateId = this.selectWeightedTemplate(availableTemplates, rng, constraints.forceTemplate);
      const template = this.templates[templateId];
      
      let stepTemplate;
      
      if (template.type === 'atomic') {
        stepTemplate = this.generateAtomicTemplate(templateId, stepTime, constraints);
      } else if (template.type === 'composite') {
        // Per compositi, genera sotto-sequenza
        const subSequence = template.generateSequence(stepTime, constraints);
        stepTemplate = {
          type: 'composite',
          subtype: templateId,
          sequence: subSequence,
          estimatedTime: subSequence.reduce((sum, s) => sum + s.estimatedTime, 0)
        };
      }
      
      if (stepTemplate) {
        sequence.push(stepTemplate);
        remainingTime -= stepTemplate.estimatedTime;
        remainingSteps--;
      }
    }
    
    logger.info('TEMPLATE', 'Generated sequence', {
      sequence: sequence.map(s => ({ type: s.type, subtype: s.subtype, estimatedTime: s.estimatedTime })),
      totalEstimatedTime: sequence.reduce((sum, s) => sum + s.estimatedTime, 0),
      targetTime,
      seed: seed.substring(0, 8)
    });
    
    return {
      sequence,
      metadata: {
        targetTime,
        actualTime: sequence.reduce((sum, s) => sum + s.estimatedTime, 0),
        steps: requestedSteps,
        seed: seed.substring(0, 8)
      }
    };
  }

  // Calcola peso template basato su vincoli
  getWeightedTemplates(timePerStep, remainingSteps, rng) {
    const weights = {};
    
    Object.keys(this.templates).forEach(templateId => {
      const template = this.templates[templateId];
      let weight = 1;
      
      // Peso basato su tempo disponibile
      if (template.type === 'atomic') {
        if (template.category === 'timer') {
          weight = timePerStep >= 15 && timePerStep <= 60 ? 2 : 0.5;
        } else if (template.category === 'click') {
          const maxClicks = timePerStep * (template.clicksPerSecond || 5);
          weight = maxClicks >= template.minClicks ? 2 : 0.5;
        }
      } else if (template.type === 'composite') {
        // Compositi preferiti per step singoli con molto tempo
        weight = remainingSteps === 1 && timePerStep > 45 ? 3 : 1;
      }
      
      weights[templateId] = Math.max(weight, 0.1); // Min weight 0.1
    });
    
    return weights;
  }

  // Selezione template con peso
  selectWeightedTemplate(weights, rng, forceTemplate = null) {
    // Test override: forza template specifico
    if (forceTemplate && this.templates[forceTemplate]) {
      return forceTemplate;
    }
    
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    let random = rng() * totalWeight;
    
    for (const [templateId, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) {
        return templateId;
      }
    }
    
    // Fallback
    return Object.keys(weights)[0];
  }
  
  // Espandi template compositi in step atomici
  expandCompositeTemplate(templateId, targetTime, params) {
    const estimator = require('./template-time-estimator');
    
    switch (templateId) {
      case 'timer_then_click':
        const timerTime1 = Math.round(targetTime * 0.6 / 5) * 5;
        const clickTime1 = targetTime - timerTime1;
        const clicks1 = Math.round(clickTime1 * 2 / 5) * 5;
        return [
          {
            type: 'timer',
            subtype: 'timer_simple',
            duration: Math.min(Math.max(timerTime1, 5), 60),
            estimatedTime: Math.min(Math.max(timerTime1, 5), 60)
          },
          {
            type: 'click',
            subtype: 'click_simple',
            target: Math.min(Math.max(clicks1, 5), 30),
            estimatedTime: Math.min(Math.max(clicks1, 5), 30) * 0.5
          }
        ];
        
      case 'click_then_timer':
        const clickTime2 = Math.round(targetTime * 0.4 / 5) * 5;
        const timerTime2 = targetTime - clickTime2;
        const clicks2 = Math.round(clickTime2 * 2 / 5) * 5;
        return [
          {
            type: 'click',
            subtype: 'click_simple',
            target: Math.min(Math.max(clicks2, 5), 30),
            estimatedTime: Math.min(Math.max(clicks2, 5), 30) * 0.5
          },
          {
            type: 'timer',
            subtype: 'timer_simple',
            duration: Math.min(Math.max(timerTime2, 5), 60),
            estimatedTime: Math.min(Math.max(timerTime2, 5), 60)
          }
        ];
        
      case 'double_timer':
        const timer1Time = Math.round(targetTime * 0.5 / 5) * 5;
        const timer2Time = Math.round((targetTime - timer1Time) / 5) * 5;
        return [
          {
            type: 'timer',
            subtype: 'timer_simple',
            duration: Math.min(Math.max(timer1Time, 5), 60),
            estimatedTime: Math.min(Math.max(timer1Time, 5), 60)
          },
          {
            type: 'timer',
            subtype: 'timer_punish',
            duration: Math.min(Math.max(timer2Time, 5), 45),
            estimatedTime: Math.min(Math.max(timer2Time, 5), 45)
          }
        ];
        
      case 'racing_then_teleport':
        const racingTime1 = Math.round(targetTime * 0.6 / 5) * 5;
        const teleportTime1 = targetTime - racingTime1;
        const teleportClicks1 = Math.round(teleportTime1 * 1.25 / 5) * 5;
        return [
          {
            type: 'click',
            subtype: 'click_racing',
            params: { duration: Math.min(Math.max(racingTime1, 5), 60), drain: 0.8 },
            estimatedTime: Math.min(Math.max(racingTime1, 5), 60)
          },
          {
            type: 'click',
            subtype: 'click_teleport',
            target: Math.min(Math.max(teleportClicks1, 5), 30),
            estimatedTime: Math.min(Math.max(teleportClicks1, 5), 30) * 0.8
          }
        ];
        
      case 'teleport_then_racing':
        const teleportTime2 = Math.round(targetTime * 0.4 / 5) * 5;
        const racingTime2 = targetTime - teleportTime2;
        const teleportClicks2 = Math.round(teleportTime2 * 1.25 / 5) * 5;
        return [
          {
            type: 'click',
            subtype: 'click_teleport',
            target: Math.min(Math.max(teleportClicks2, 5), 30),
            estimatedTime: Math.min(Math.max(teleportClicks2, 5), 30) * 0.8
          },
          {
            type: 'click',
            subtype: 'click_racing',
            params: { duration: Math.min(Math.max(racingTime2, 5), 60), drain: 0.8 },
            estimatedTime: Math.min(Math.max(racingTime2, 5), 60)
          }
        ];
        
      case 'triple_click':
        const step1Time = Math.round(targetTime * 0.33 / 5) * 5;
        const step2Time = Math.round(targetTime * 0.33 / 5) * 5;
        const step3Time = Math.round((targetTime - step1Time - step2Time) / 5) * 5;
        return [
          {
            type: 'click',
            subtype: 'click_simple',
            target: Math.min(Math.max(Math.round(step1Time * 2 / 5) * 5, 5), 30),
            estimatedTime: Math.min(Math.max(step1Time, 5), 60)
          },
          {
            type: 'click',
            subtype: 'click_drain',
            target: Math.min(Math.max(Math.round(step2Time * 1.5 / 5) * 5, 5), 30),
            estimatedTime: Math.min(Math.max(step2Time, 5), 60)
          },
          {
            type: 'click',
            subtype: 'click_teleport',
            target: Math.min(Math.max(Math.round(step3Time * 1.25 / 5) * 5, 5), 30),
            estimatedTime: Math.min(Math.max(step3Time, 5), 60)
          }
        ];
        
      case 'racing_sandwich':
        const racing1Time = Math.round(targetTime * 0.4 / 5) * 5;
        const timerMiddleTime = Math.round(targetTime * 0.2 / 5) * 5;
        const racing2Time = Math.round((targetTime - racing1Time - timerMiddleTime) / 5) * 5;
        return [
          {
            type: 'click',
            subtype: 'click_racing',
            params: { duration: Math.min(Math.max(racing1Time, 5), 60), drain: 0.6 },
            estimatedTime: Math.min(Math.max(racing1Time, 5), 60)
          },
          {
            type: 'timer',
            subtype: 'timer_simple',
            duration: Math.min(Math.max(timerMiddleTime, 5), 60),
            estimatedTime: Math.min(Math.max(timerMiddleTime, 5), 60)
          },
          {
            type: 'click',
            subtype: 'click_racing_rigged',
            params: { realDuration: Math.min(Math.max(racing2Time, 5), 60), maxProgress: 80, resetPoint: 25 },
            estimatedTime: Math.min(Math.max(racing2Time, 5), 60)
          }
        ];
        
      default:
        return [{
          type: 'timer',
          subtype: 'timer_simple',
          duration: Math.max(targetTime, 15),
          estimatedTime: targetTime
        }];
    }
  }
}

module.exports = new AdvancedTemplateSystem();