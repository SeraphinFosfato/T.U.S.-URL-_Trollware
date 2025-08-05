// Script per creare un link di test via API
const https = require('https');

function createTestLink() {
  const postData = JSON.stringify({
    url: 'https://www.google.com',
    timePreset: '30s',
    steps: 2,  // Solo 2 step per test rapido
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

  console.log('🔗 Creazione link di test...');
  console.log('📋 Parametri: 2 step, 30s, redirect a Google');
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
          console.log('✅ Link di test creato con successo!');
          console.log('');
          console.log('🌐 LINK DI TEST:');
          console.log(response.shortUrl);
          console.log('');
          console.log('🧪 ISTRUZIONI TEST MANUALE:');
          console.log('1. Apri il link sopra in un browser');
          console.log('2. Completa il primo step (timer o click)');
          console.log('3. Completa il secondo step (timer o click)');
          console.log('4. ✅ VERIFICA: Dopo il secondo step dovresti essere reindirizzato a Google');
          console.log('');
          console.log('🎯 COSA TESTARE:');
          console.log('- Il continue button appare alla fine di ogni step');
          console.log('- L\'ultimo step reindirizza direttamente a Google (non mostra continue button)');
          console.log('- Il percorso è consistente se ricarichi la pagina');
          console.log('');
          console.log('📊 Configurazione:');
          console.log(`- Tempo stimato: ${response.config.estimatedTime}s`);
          console.log(`- Step: ${response.config.steps}`);
          console.log(`- Scadenza: ${response.config.expiry}`);
        } else {
          console.error('❌ Errore creazione link:', response.error || 'Errore sconosciuto');
        }
      } catch (error) {
        console.error('❌ Errore parsing risposta:', error.message);
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

// Esegui creazione link
if (require.main === module) {
  createTestLink();
}

module.exports = { createTestLink };