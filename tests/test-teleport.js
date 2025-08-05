// Test specifico per Teleporting Click Game
const https = require('https');

function createTeleportTest() {
  const postData = JSON.stringify({
    url: 'https://www.google.com',
    timePreset: '30s',
    steps: 1,
    expiryPreset: '1d',
    testTemplate: 'click_teleport'  // Forza teleporting
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

  console.log('🔮 Test Teleporting Click Game...');
  console.log('📋 Parametri: 1 step, 30s, teleporting focus');
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
          console.log('✅ Link teleporting creato!');
          console.log('');
          console.log('🎯 LINK TELEPORTING TEST:');
          console.log(response.shortUrl);
          console.log('');
          console.log('🔮 COSA TESTARE:');
          console.log('- Il button si sposta quando ci passi sopra (10% chance)');
          console.log('- Il button si teletrasporta dopo ogni click');
          console.log('- Orb decorativo che fluttua in background');
          console.log('- Progress bar che si riempie');
          console.log('- Alla fine redirect diretto a Google');
          console.log('');
          console.log('🎮 COMPORTAMENTO ATTESO:');
          console.log('- Button inizia in posizione casuale');
          console.log('- Ogni click = teleport + progress');
          console.log('- Hover casuale = teleport (frustrazione)');
          console.log('- Completato = button fisso + continue');
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
  createTeleportTest();
}

module.exports = { createTeleportTest };