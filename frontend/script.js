async function shortenUrl() {
  const urlInput = document.getElementById('urlInput');
  const resultDiv = document.getElementById('result');
  const url = urlInput.value.trim();
  
  if (!url) {
    alert('Please enter a valid URL');
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
        <h3>✅ URL Shortened!</h3>
        <p><strong>Original URL:</strong> ${data.original_url}</p>
        <p><strong>Short URL:</strong> <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a></p>
        <p><em>⚠️ Warning: this link contains "surprises"...</em></p>
      `;
      resultDiv.style.display = 'block';
      urlInput.value = '';
    } else {
      throw new Error(data.error || 'Error creating link');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Enter key support
document.getElementById('urlInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    shortenUrl();
  }
});