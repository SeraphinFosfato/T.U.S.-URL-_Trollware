const express = require('express');
const router = express.Router();
const advancedTemplates = require('../utils/advanced-template-system');
const clientFingerprint = require('../utils/client-fingerprint');

// GET /debug/test-generation - Test generazione template
router.get('/test-generation', (req, res) => {
  const logger = require('../utils/debug-logger');
  
  const testCases = [
    { timePreset: '30s', steps: null, expiryPreset: '1h' },
    { timePreset: '1min', steps: 2, expiryPreset: '1d' },
    { timePreset: '2min', steps: null, expiryPreset: '3d' },
    { timePreset: '5min', steps: 4, expiryPreset: '7d' }
  ];
  
  const results = [];
  
  testCases.forEach((userParams, index) => {
    const fingerprint = `test_fp_${index}`;
    const shortId = `test_${index}`;
    
    const sequenceData = advancedTemplates.generateConstrainedSequence(
      userParams,
      fingerprint,
      shortId
    );
    
    results.push({
      userParams,
      fingerprint,
      shortId,
      sequence: sequenceData.sequence.map(s => ({
        type: s.type,
        subtype: s.subtype,
        duration: s.duration,
        target: s.target,
        estimatedTime: s.estimatedTime
      })),
      metadata: sequenceData.metadata
    });
    
    logger.info('DEBUG_TEMPLATE', `Test case ${index}`, {
      userParams,
      totalEstimatedTime: sequenceData.metadata.actualTime,
      targetTime: sequenceData.metadata.targetTime,
      efficiency: Math.round((sequenceData.metadata.actualTime / sequenceData.metadata.targetTime) * 100) + '%'
    });
  });
  
  res.json({
    status: 'OK',
    testCases: results,
    summary: {
      totalTests: testCases.length,
      avgEfficiency: Math.round(
        results.reduce((sum, r) => sum + (r.metadata.actualTime / r.metadata.targetTime), 0) / results.length * 100
      ) + '%'
    }
  });
});

// GET /debug/test-seed - Test seed randomization
router.get('/test-seed', (req, res) => {
  const logger = require('../utils/debug-logger');
  
  const fingerprint = 'test_fingerprint';
  const shortId = 'test123';
  const userParams = { timePreset: '1min', steps: 3, expiryPreset: '1d' };
  
  const generations = [];
  
  // Genera 5 volte la stessa configurazione
  for (let i = 0; i < 5; i++) {
    const sequenceData = advancedTemplates.generateConstrainedSequence(
      userParams,
      fingerprint + '_' + i, // Fingerprint diverso
      shortId
    );
    
    generations.push({
      iteration: i,
      seed: sequenceData.metadata.seed,
      sequence: sequenceData.sequence.map(s => ({
        type: s.type,
        subtype: s.subtype,
        duration: s.duration,
        target: s.target
      }))
    });
  }
  
  // Verifica diversità
  const uniqueSequences = new Set(generations.map(g => JSON.stringify(g.sequence)));
  const diversity = (uniqueSequences.size / generations.length) * 100;
  
  logger.info('DEBUG_SEED', 'Seed randomization test', {
    generations: generations.length,
    uniqueSequences: uniqueSequences.size,
    diversity: Math.round(diversity) + '%'
  });
  
  res.json({
    status: 'OK',
    generations,
    diversity: {
      total: generations.length,
      unique: uniqueSequences.size,
      percentage: Math.round(diversity) + '%'
    }
  });
});

module.exports = router;