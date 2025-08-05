// Test page for racing_sandwich
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const testData = {
  "templateId": "racing_sandwich",
  "params": {
    "totalTime": 150,
    "timerRatio": 0.4
  },
  "targetUrl": "https://example.com",
  "fingerprint": "test-racing_sandwich",
  "step": 1,
  "totalSteps": 1
};
  
  // Simula victim route
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Test racing_sandwich</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .test-info { background: #f0f0f0; padding: 15px; margin-bottom: 20px; }
    .template-container { border: 1px solid #ccc; padding: 20px; }
  </style>
</head>
<body>
  <div class="test-info">
    <h2>Testing Template: racing_sandwich</h2>
    <p><strong>Params:</strong> ${JSON.stringify(testData.params)}</p>
    <p><strong>Target URL:</strong> ${testData.targetUrl}</p>
  </div>
  
  <div class="template-container">
    <div id="game-container">
      <!-- Template will be loaded here -->
      <p>Loading racing_sandwich template...</p>
    </div>
  </div>
  
  <script>
    // Simula il caricamento del template
    console.log('Testing template:', '${templateId}');
    console.log('Params:', ${JSON.stringify(testData.params)});
    
    // Qui andrebbe il codice del template specifico
    document.getElementById('game-container').innerHTML = 
      '<p>Template racing_sandwich loaded with params: ' + 
      JSON.stringify(${JSON.stringify(testData.params)}) + '</p>';
  </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3013;
app.listen(PORT, () => {
  console.log(`racing_sandwich test server running on http://localhost:${PORT}`);
});
