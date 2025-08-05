// Test specifico per Rigged Racing Click Game
const https = require('https');

function createRiggedTest() {
  const postData = JSON.stringify({
    url: 'https://www.google.com',
    timePreset: '30s',
    steps: 1,  // Solo 1 step per testare rigged
    expiryPreset: '1d'
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

  console.log('🎭 Test Rigged Racing Click Game...');
  console.log('📋 Parametri: 1 step, 30s, rigged focus');
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
          console.log('✅ Link rigged racing creato!');
          console.log('');
          console.log('🎭 LINK RIGGED TEST:');
          console.log(response.shortUrl);
          console.log('');
          console.log('🎪 COSA TESTARE (TRUCCATO):');
          console.log('- Barra si riempie normalmente fino a ~80%');
          console.log('- Poi si resetta improvvisamente al 25%');
          console.log('- Dopo ~20s il trucco si disattiva');
          console.log('- Solo allora puoi vincere davvero');
          console.log('');
          console.log('🎭 COMPORTAMENTO TROLLOSO:');
          console.log('- Sembra un racing normale');
          console.log('- Ma è impossibile vincere subito');
          console.log('- Timer nascosto controlla il trucco');
          console.log('- Massima frustrazione garantita!');
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
  createRiggedTest();
}

module.exports = { createRiggedTest };