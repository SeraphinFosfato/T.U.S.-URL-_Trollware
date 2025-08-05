// Test runner per tutti i template con server integrato
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static('public'));

const templates = {
  timer_simple: { duration: 30 },
  timer_punish: { duration: 25 },
  click_simple: { clicks: 15 },
  click_drain: { clicks: 20 },
  click_teleport: { clicks: 12 },
  click_racing: { duration: 45, drain: 0.8 },
  click_racing_rigged: { realDuration: 30, maxProgress: 80, resetPoint: 25 },
  timer_then_click: { totalTime: 60, timerRatio: 0.6 },
  click_then_timer: { totalTime: 60, timerRatio: 0.4 },
  double_timer: { totalTime: 75, timerRatio: 0.5 },
  racing_then_teleport: { totalTime: 90, timerRatio: 0.6 },
  teleport_then_racing: { totalTime: 90, timerRatio: 0.4 },
  triple_click: { totalTime: 120, timerRatio: 0.33 },
  racing_sandwich: { totalTime: 150, timerRatio: 0.4 }
};

// Homepage con lista template
app.get('/', (req, res) => {
  const templateList = Object.keys(templates).map(templateId => 
    `<li>
      <strong>${templateId}</strong> - ${JSON.stringify(templates[templateId])}<br>
      <a href="/test/${templateId}?revenue=false" style="margin-right: 10px; color: #dc3545;">❌ No Revenue</a>
      <a href="/test/${templateId}?revenue=true" style="color: #28a745;">💰 With Revenue</a>
    </li>`
  ).join('');
  
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>TrollShortener Template Tester</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #333; }
    ul { list-style-type: none; padding: 0; }
    li { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
    a { text-decoration: none; color: #0066cc; font-weight: bold; }
    a:hover { color: #004499; }
    .info { background: #e7f3ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>🧌 TrollShortener Template Tester</h1>
  
  <div class="info">
    <p><strong>13 Template Disponibili</strong> - Clicca per testare con/senza revenue</p>
    <p>Server running on: <code>http://localhost:3100</code></p>
    <p><strong>💰 Revenue System:</strong> Controlla slot pubblicitari dinamici (header/sidebar/footer/interstitial/overlay)</p>
  </div>
  
  <h2>📋 Template List</h2>
  <ul>
    ${templateList}
  </ul>
  
  <h2>🎮 Template Categories</h2>
  <ul>
    <li><strong>Timer (2):</strong> timer_simple, timer_punish</li>
    <li><strong>Click (5):</strong> click_simple, click_drain, click_teleport, click_racing, click_racing_rigged</li>
    <li><strong>Compositi Base (3):</strong> timer_then_click, click_then_timer, double_timer</li>
    <li><strong>Compositi Avanzati (4):</strong> racing_then_teleport, teleport_then_racing, triple_click, racing_sandwich</li>
  </ul>
</body>
</html>
  `);
});

// Route per testare template specifico
app.get('/test/:templateId', (req, res) => {
  const templateId = req.params.templateId;
  const params = templates[templateId];
  const revenueEnabled = req.query.revenue === 'true';
  
  if (!params) {
    return res.status(404).send('Template not found');
  }
  
  // Configura sistema revenue
  const distributor = require('../backend/utils/smart-template-distributor');
  distributor.setRevenueEnabled(revenueEnabled);
  
  const revenue = distributor.calculateRevenue(templateId, 1.0);
  const enabledSlots = distributor.calculateEnabledAdSlots(revenue);
  const activeSlots = Object.entries(enabledSlots).filter(([,enabled]) => enabled).map(([slot]) => slot);
  
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Test ${templateId}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .header { background: #333; color: white; padding: 15px; margin: -20px -20px 20px -20px; }
    .test-info { background: #f0f0f0; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
    .template-container { border: 2px solid #ccc; padding: 20px; border-radius: 5px; min-height: 300px; }
    .back-link { display: inline-block; margin-bottom: 20px; color: #0066cc; text-decoration: none; }
    .back-link:hover { text-decoration: underline; }
    pre { background: #f8f8f8; padding: 10px; border-radius: 3px; overflow-x: auto; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧌 TrollShortener Template Tester</h1>
  </div>
  
  <a href="/" class="back-link">← Back to Template List</a>
  
  <div class="test-info">
    <h2>Testing Template: <code>${templateId}</code></h2>
    <p><strong>Parameters:</strong></p>
    <pre>${JSON.stringify(params, null, 2)}</pre>
    <p><strong>Target URL:</strong> https://example.com</p>
    <p><strong>Revenue System:</strong> ${revenueEnabled ? '✅ ENABLED' : '❌ DISABLED'}</p>
    ${revenueEnabled ? `<p><strong>Revenue:</strong> ${revenue} | <strong>Active Slots:</strong> ${activeSlots.join(', ') || 'none'}</p>` : ''}
    
    <div style="margin-top: 10px;">
      <a href="/test/${templateId}?revenue=false" style="margin-right: 10px; padding: 5px 10px; background: #dc3545; color: white; text-decoration: none; border-radius: 3px;">❌ No Revenue</a>
      <a href="/test/${templateId}?revenue=true" style="padding: 5px 10px; background: #28a745; color: white; text-decoration: none; border-radius: 3px;">💰 With Revenue</a>
    </div>
  </div>
  
  <div class="template-container">
    <div id="game-container">
      <h3>Template: ${templateId}</h3>
      <p>🎮 This would load the actual ${templateId} template</p>
      <p>📊 Parameters: ${JSON.stringify(params)}</p>
      <p>⚠️ <em>Note: This is a test page. Actual template implementation would be loaded from the backend.</em></p>
      
      <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px;">
        <strong>Template Type:</strong> ${getTemplateType(templateId)}<br>
        <strong>Expected Duration:</strong> ${getExpectedDuration(templateId, params)}<br>
        <strong>Difficulty:</strong> ${getDifficulty(templateId)}<br>
        <strong>Revenue:</strong> ${revenueEnabled ? revenue + ' points' : 'Disabled'}
      </div>
      
      ${revenueEnabled && activeSlots.length > 0 ? `
      <div style="margin-top: 15px; padding: 15px; background: #d1ecf1; border-radius: 5px;">
        <h4>📺 Active Ad Slots (${activeSlots.length}/5):</h4>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${['header', 'sidebar', 'footer', 'interstitial', 'overlay'].map(slot => 
            `<span style="padding: 5px 10px; border-radius: 3px; background: ${activeSlots.includes(slot) ? '#28a745' : '#6c757d'}; color: white; font-size: 12px;">${slot}</span>`
          ).join('')}
        </div>
      </div>` : ''}
    </div>
  </div>
  
  <script>
    console.log('Testing template:', '${templateId}');
    console.log('Params:', ${JSON.stringify(params)});
    
    // Simula comportamento template
    setTimeout(() => {
      document.getElementById('game-container').innerHTML += 
        '<p style="color: green; margin-top: 20px;">✅ Template ${templateId} simulation complete!</p>';
    }, 2000);
  </script>
</body>
</html>
  `);
});

function getTemplateType(templateId) {
  if (templateId.startsWith('timer')) return 'Timer-based';
  if (templateId.startsWith('click')) return 'Click-based';
  if (templateId.includes('_then_') || templateId.includes('triple') || templateId.includes('sandwich')) return 'Composite';
  return 'Unknown';
}

function getExpectedDuration(templateId, params) {
  if (params.duration) return params.duration + 's';
  if (params.totalTime) return params.totalTime + 's';
  if (params.clicks) return (params.clicks * 0.5) + 's (estimated)';
  return 'Variable';
}

function getDifficulty(templateId) {
  const difficulties = {
    timer_simple: 'Easy',
    timer_punish: 'Medium',
    click_simple: 'Easy', 
    click_drain: 'Medium',
    click_teleport: 'Hard',
    click_racing: 'Medium',
    click_racing_rigged: 'Very Hard',
    timer_then_click: 'Medium',
    click_then_timer: 'Medium',
    double_timer: 'Hard',
    racing_then_teleport: 'Very Hard',
    teleport_then_racing: 'Very Hard',
    triple_click: 'Extreme',
    racing_sandwich: 'Nightmare'
  };
  return difficulties[templateId] || 'Unknown';
}

const PORT = 3100;
app.listen(PORT, () => {
  console.log(`🧌 TrollShortener Template Tester running on http://localhost:${PORT}`);
  console.log(`📋 ${Object.keys(templates).length} templates available for testing`);
  console.log('🎮 Open browser and navigate to test individual templates');
});