async function shortenUrl() {
  const urlInput = document.getElementById('urlInput');
  const resultDiv = document.getElementById('result');
  const url = urlInput.value.trim();
  
  if (!url) {
    alert('Inserisci un URL valido');
    return;
  }
  
  try {
    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      resultDiv.innerHTML = `
        <h3>✅ URL Accorciato!</h3>
        <p><strong>URL Originale:</strong> ${data.original_url}</p>
        <p><strong>Short URL:</strong> <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a></p>
        <p><em>⚠️ Attenzione: questo link contiene "sorprese"...</em></p>
      `;
      resultDiv.style.display = 'block';
      urlInput.value = '';
    } else {
      throw new Error(data.error || 'Errore nella creazione del link');
    }
  } catch (error) {
    alert('Errore: ' + error.message);
  }
}

// Enter key support
document.getElementById('urlInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    shortenUrl();
  }
});