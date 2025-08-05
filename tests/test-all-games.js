// Test per tutti i nuovi games - Iterazione 22
const https = require('https');

function createMultiGameTest() {
  const postData = JSON.stringify({
    url: 'https://www.google.com',
    timePreset: '2min',  // Più tempo per più games
    steps: 3,  // 3 step per testare varietà
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

  console.log('🎮 Test Multi-Game Sequence...');
  console.log('📋 Parametri: 3 step, 2min, mix games');
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
          console.log('✅ Link multi-game creato!');
          console.log('');
          console.log('🎯 LINK MULTI-GAME TEST:');
          console.log(response.shortUrl);
          console.log('');
          console.log('🎮 POSSIBILI COMBINAZIONI:');
          console.log('- Teleporting → Racing → Timer');
          console.log('- Racing → Rigged → Click');
          console.log('- Timer → Teleporting → Racing');
          console.log('- Click → Racing → Teleporting');
          console.log('');
          console.log('🎯 COSA VERIFICARE:');
          console.log('- Ogni step è diverso e funzionante');
          console.log('- Progress tra step è consistente');
          console.log('- Ultimo step reindirizza a Google');
          console.log('- RNG deterministico (reload = stessa sequenza)');
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
  createMultiGameTest();
}

module.exports = { createMultiGameTest };