// Test specifico per Racing Click Game
const https = require('https');

function createRacingTest() {
  const postData = JSON.stringify({
    url: 'https://www.google.com',
    timePreset: '30s',
    steps: 1,
    expiryPreset: '1d',
    testTemplate: 'click_racing'  // Forza racing
  });

  const options = {
    hostname: 'tus-tasklink.onrender.com',
    port: 443,
    path: '/api/shorten',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('🏁 Test Racing Click Game...');
  console.log('📋 Parametri: 1 step, 30s, racing focus');
  console.log('');

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        
        if (res.statusCode === 200) {
          console.log('✅ Link racing creato!');
          console.log('');
          console.log('🏁 LINK RACING TEST:');
          console.log(response.shortUrl);
          console.log('');
          console.log('🎮 COSA TESTARE:');
          console.log('- Barra verde si riempie quando clicchi veloce');
          console.log('- Barra rossa si riempie da destra (drain)');
          console.log('- Devi cliccare più veloce del drain');
          console.log('- Vinci quando barra verde arriva a 100%');
          console.log('');
          console.log('🏆 STRATEGIA:');
          console.log('- Tieni premuto il button per click rapidi');
          console.log('- Non mollare mai o la barra si svuota');
          console.log('- Difficoltà: easy/medium/hard casuale');
        } else {
          console.error('❌ Errore:', response.error || 'Errore sconosciuto');
        }
      } catch (error) {
        console.error('❌ Errore parsing:', error.message);
        console.log('Risposta raw:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Errore richiesta:', error.message);
  });

  req.write(postData);
  req.end();
}

if (require.main === module) {
  createRacingTest();
}

module.exports = { createRacingTest };