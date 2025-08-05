// Script per creare link di test per i nuovi click games
const https = require('https');

function createTestLink() {
  const postData = JSON.stringify({
    url: 'https://www.google.com',
    timePreset: '1min',
    steps: 3,  // 3 step per più possibilità di nuovi template
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

  console.log('🎮 Creazione link test per NUOVI CLICK GAMES...');
  console.log('📋 Parametri: 3 step, 1min, possibilità nuovi template');

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (res.statusCode === 200) {
          console.log('\n✅ Link di test creato!');
          console.log('\n🌐 LINK TEST NUOVI CLICK GAMES:');
          console.log(response.shortUrl);
          console.log('\n🎯 COSA TESTARE:');
          console.log('- 🔮 Teleporting Click: Button si sposta ad ogni click');
          console.log('- 🏁 Racing Click: Riempi barra vs svuotamento');
          console.log('- 🎭 Rigged Racing: Racing truccato (sembra impossibile)');
          console.log('\n💡 SUGGERIMENTO:');
          console.log('Ricarica il link più volte per ottenere sequenze diverse');
          console.log('e aumentare le possibilità di vedere i nuovi template!');
        } else {
          console.error('❌ Errore:', response.error);
        }
      } catch (error) {
        console.error('❌ Errore parsing:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Errore richiesta:', error.message);
  });

  req.write(postData);
  req.end();
}

createTestLink();