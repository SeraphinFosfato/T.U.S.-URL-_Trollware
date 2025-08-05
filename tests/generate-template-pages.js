// Generatore pagine di test per tutti i template
const fs = require('fs');
const path = require('path');

const templates = {
  // Timer Templates
  timer_simple: { duration: 30 },
  timer_punish: { duration: 25 },
  
  // Click Templates  
  click_simple: { clicks: 15 },
  click_drain: { clicks: 20 },
  click_teleport: { clicks: 12 },
  click_racing: { duration: 45, drain: 0.8 },
  click_racing_rigged: { realDuration: 30, maxProgress: 80, resetPoint: 25 },
  
  // Compositi Base
  timer_then_click: { totalTime: 60, timerRatio: 0.6 },
  click_then_timer: { totalTime: 60, timerRatio: 0.4 },
  double_timer: { totalTime: 75, timerRatio: 0.5 },
  
  // Compositi Avanzati
  racing_then_teleport: { totalTime: 90, timerRatio: 0.6 },
  teleport_then_racing: { totalTime: 90, timerRatio: 0.4 },
  triple_click: { totalTime: 120, timerRatio: 0.33 },
  racing_sandwich: { totalTime: 150, timerRatio: 0.4 }
};

const testDir = path.join(__dirname, 'template-pages');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir);
}

Object.entries(templates).forEach(([templateId, params]) => {
  const testData = {
    templateId,
    params,
    targetUrl: 'https://example.com',
    fingerprint: 'test-' + templateId,
    step: 1,
    totalSteps: 1
  };
  
  const content = `// Test page for ${templateId}
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const testData = ${JSON.stringify(testData, null, 2)};
  
  // Simula victim route
  res.send(\`
<!DOCTYPE html>
<html>
<head>
  <title>Test ${templateId}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .test-info { background: #f0f0f0; padding: 15px; margin-bottom: 20px; }
    .template-container { border: 1px solid #ccc; padding: 20px; }
  </style>
</head>
<body>
  <div class="test-info">
    <h2>Testing Template: ${templateId}</h2>
    <p><strong>Params:</strong> \${JSON.stringify(testData.params)}</p>
    <p><strong>Target URL:</strong> \${testData.targetUrl}</p>
  </div>
  
  <div class="template-container">
    <div id="game-container">
      <!-- Template will be loaded here -->
      <p>Loading ${templateId} template...</p>
    </div>
  </div>
  
  <script>
    // Simula il caricamento del template
    console.log('Testing template:', '\${templateId}');
    console.log('Params:', \${JSON.stringify(testData.params)});
    
    // Qui andrebbe il codice del template specifico
    document.getElementById('game-container').innerHTML = 
      '<p>Template ${templateId} loaded with params: ' + 
      JSON.stringify(\${JSON.stringify(testData.params)}) + '</p>';
  </script>
</body>
</html>
  \`);
});

const PORT = process.env.PORT || ${3000 + Object.keys(templates).indexOf(templateId)};
app.listen(PORT, () => {
  console.log(\`${templateId} test server running on http://localhost:\${PORT}\`);
});
`;

  fs.writeFileSync(
    path.join(testDir, `test-${templateId}.js`), 
    content
  );
});

console.log(`Generated ${Object.keys(templates).length} template test pages in tests/template-pages/`);
console.log('Run individual tests with: node tests/template-pages/test-[template-name].js');