// Batch test per creare link di tutti i template su Render
const { generateTestLinks } = require('./generate-real-test-links');
const fs = require('fs');
const path = require('path');

async function batchTest() {
  console.log('🚀 BATCH TEMPLATE TEST - Render Links');
  console.log('====================================');
  
  try {
    const results = await generateTestLinks();
    
    // Salva risultati in file
    const outputFile = path.join(__dirname, 'test-links-output.json');
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    
    console.log(`\n💾 Results saved to: ${outputFile}`);
    
    // Genera HTML per test facile
    const htmlContent = generateTestHTML(results);
    const htmlFile = path.join(__dirname, 'test-links.html');
    fs.writeFileSync(htmlFile, htmlContent);
    
    console.log(`📄 HTML test page: ${htmlFile}`);
    console.log('\n🎯 QUICK TEST COMMANDS:');
    console.log('========================');
    
    results.forEach(result => {
      console.log(`# ${result.templateId}`);
      console.log(`curl "${result.shortUrl}"`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Batch test failed:', error.message);
  }
}

function generateTestHTML(results) {
  const links = results.map(result => `
    <div class="template-test">
      <h3>${result.templateId}</h3>
      <p><strong>Params:</strong> ${JSON.stringify(result.params)}</p>
      <p><a href="${result.shortUrl}" target="_blank">${result.shortUrl}</a></p>
    </div>
  `).join('');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <title>TrollShortener Template Tests</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .template-test { border: 1px solid #ccc; padding: 15px; margin: 10px 0; border-radius: 5px; }
    .template-test h3 { margin-top: 0; color: #333; }
    .template-test a { color: #0066cc; text-decoration: none; }
    .template-test a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>🧌 TrollShortener Template Tests</h1>
  <p><strong>Generated:</strong> ${new Date().toISOString()}</p>
  <p><strong>Total Templates:</strong> ${results.length}</p>
  
  ${links}
  
  <hr>
  <p><em>All links point to Render deployment for real testing</em></p>
</body>
</html>
  `;
}

if (require.main === module) {
  batchTest();
}

module.exports = { batchTest };