const express = require('express');
const router = express.Router();
const freeTier = require('../config/free-tier-manager');

// GET /admin/usage - Report utilizzo risorse
router.get('/usage', (req, res) => {
  const report = freeTier.getUsageReport();
  
  res.json({
    status: 'ok',
    date: new Date().toISOString(),
    usage: report,
    recommendations: generateRecommendations(report)
  });
});

function generateRecommendations(report) {
  const recommendations = [];
  
  if (report.status === 'MINIMAL_MODE') {
    recommendations.push('🚨 MINIMAL MODE ACTIVE - Consider upgrading or reducing traffic');
  }
  
  const requestsPercent = parseInt(report.requests.match(/\((\d+)%\)/)[1]);
  const bandwidthPercent = parseInt(report.bandwidth.match(/\((\d+)%\)/)[1]);
  
  if (requestsPercent > 70) {
    recommendations.push('⚠️ High request usage - Consider caching or rate limiting');
  }
  
  if (bandwidthPercent > 70) {
    recommendations.push('⚠️ High bandwidth usage - Minimal templates active');
  }
  
  if (report.dbOps > 400) {
    recommendations.push('⚠️ High DB operations - Client-side sessions helping');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ All systems operating normally');
  }
  
  return recommendations;
}

module.exports = router;