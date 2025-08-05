// Test page for click_racing_rigged
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const testData = {
  "templateId": "click_racing_rigged",
  "params": {
    "realDuration": 30,
    "maxProgress": 80,
    "resetPoint": 25
  },
  "targetUrl": "https://example.com",
  "fingerprint": "test-click_racing_rigged",
  "step": 1,
  "totalSteps": 1
};
  
  // Simula victim route
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Test click_racing_rigged</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .test-info { background: #f0f0f0; padding: 15px; margin-bottom: 20px; }
    .template-container { border: 1px solid #ccc; padding: 20px; }
  </style>
</head>
<body>
  <div class="test-info">
    <h2>Testing Template: click_racing_rigged</h2>
    <p><strong>Params:</strong> ${JSON.stringify(testData.params)}</p>
    <p><strong>Target URL:</strong> ${testData.targetUrl}</p>
  </div>
  
  <div class="template-container">
    <div id="game-container">
      <!-- Template will be loaded here -->
      <p>Loading click_racing_rigged template...</p>
    </div>
  </div>
  
  <script>
    // Simula il caricamento del template
    console.log('Testing template:', '${templateId}');
    console.log('Params:', ${JSON.stringify(testData.params)});
    
    // Qui andrebbe il codice del template specifico
    document.getElementById('game-container').innerHTML = 
      '<p>Template click_racing_rigged loaded with params: ' + 
      JSON.stringify(${JSON.stringify(testData.params)}) + '</p>';
  </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`click_racing_rigged test server running on http://localhost:${PORT}`);
});
