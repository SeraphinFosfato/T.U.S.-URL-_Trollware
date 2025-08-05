// Test page for triple_click
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const testData = {
  "templateId": "triple_click",
  "params": {
    "totalTime": 120,
    "timerRatio": 0.33
  },
  "targetUrl": "https://example.com",
  "fingerprint": "test-triple_click",
  "step": 1,
  "totalSteps": 1
};
  
  // Simula victim route
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Test triple_click</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .test-info { background: #f0f0f0; padding: 15px; margin-bottom: 20px; }
    .template-container { border: 1px solid #ccc; padding: 20px; }
  </style>
</head>
<body>
  <div class="test-info">
    <h2>Testing Template: triple_click</h2>
    <p><strong>Params:</strong> ${JSON.stringify(testData.params)}</p>
    <p><strong>Target URL:</strong> ${testData.targetUrl}</p>
  </div>
  
  <div class="template-container">
    <div id="game-container">
      <!-- Template will be loaded here -->
      <p>Loading triple_click template...</p>
    </div>
  </div>
  
  <script>
    // Simula il caricamento del template
    console.log('Testing template:', '${templateId}');
    console.log('Params:', ${JSON.stringify(testData.params)});
    
    // Qui andrebbe il codice del template specifico
    document.getElementById('game-container').innerHTML = 
      '<p>Template triple_click loaded with params: ' + 
      JSON.stringify(${JSON.stringify(testData.params)}) + '</p>';
  </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3012;
app.listen(PORT, () => {
  console.log(`triple_click test server running on http://localhost:${PORT}`);
});
