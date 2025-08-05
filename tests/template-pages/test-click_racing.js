// Test page for click_racing
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const testData = {
  "templateId": "click_racing",
  "params": {
    "duration": 45,
    "drain": 0.8
  },
  "targetUrl": "https://example.com",
  "fingerprint": "test-click_racing",
  "step": 1,
  "totalSteps": 1
};
  
  // Simula victim route
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Test click_racing</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .test-info { background: #f0f0f0; padding: 15px; margin-bottom: 20px; }
    .template-container { border: 1px solid #ccc; padding: 20px; }
  </style>
</head>
<body>
  <div class="test-info">
    <h2>Testing Template: click_racing</h2>
    <p><strong>Params:</strong> ${JSON.stringify(testData.params)}</p>
    <p><strong>Target URL:</strong> ${testData.targetUrl}</p>
  </div>
  
  <div class="template-container">
    <div id="game-container">
      <!-- Template will be loaded here -->
      <p>Loading click_racing template...</p>
    </div>
  </div>
  
  <script>
    // Simula il caricamento del template
    console.log('Testing template:', '${templateId}');
    console.log('Params:', ${JSON.stringify(testData.params)});
    
    // Qui andrebbe il codice del template specifico
    document.getElementById('game-container').innerHTML = 
      '<p>Template click_racing loaded with params: ' + 
      JSON.stringify(${JSON.stringify(testData.params)}) + '</p>';
  </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`click_racing test server running on http://localhost:${PORT}`);
});
