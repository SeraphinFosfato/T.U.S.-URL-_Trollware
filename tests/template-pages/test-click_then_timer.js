// Test page for click_then_timer
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const testData = {
  "templateId": "click_then_timer",
  "params": {
    "totalTime": 60,
    "timerRatio": 0.4
  },
  "targetUrl": "https://example.com",
  "fingerprint": "test-click_then_timer",
  "step": 1,
  "totalSteps": 1
};
  
  // Simula victim route
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Test click_then_timer</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .test-info { background: #f0f0f0; padding: 15px; margin-bottom: 20px; }
    .template-container { border: 1px solid #ccc; padding: 20px; }
  </style>
</head>
<body>
  <div class="test-info">
    <h2>Testing Template: click_then_timer</h2>
    <p><strong>Params:</strong> ${JSON.stringify(testData.params)}</p>
    <p><strong>Target URL:</strong> ${testData.targetUrl}</p>
  </div>
  
  <div class="template-container">
    <div id="game-container">
      <!-- Template will be loaded here -->
      <p>Loading click_then_timer template...</p>
    </div>
  </div>
  
  <script>
    // Simula il caricamento del template
    console.log('Testing template:', '${templateId}');
    console.log('Params:', ${JSON.stringify(testData.params)});
    
    // Qui andrebbe il codice del template specifico
    document.getElementById('game-container').innerHTML = 
      '<p>Template click_then_timer loaded with params: ' + 
      JSON.stringify(${JSON.stringify(testData.params)}) + '</p>';
  </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`click_then_timer test server running on http://localhost:${PORT}`);
});
