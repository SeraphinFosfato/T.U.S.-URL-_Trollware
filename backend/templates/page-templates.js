// Template di pagine per inserire i blocchi
const pageTemplates = {
  simple_center: {
    name: "Simple Center Layout",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Loading...</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            background: #ffffff;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .block-container {
            max-width: 600px;
            width: 100%;
            min-height: 500px;
          }
          .block-wrapper {
            margin: 15px 0;
            padding: 10px;
          }
        </style>
        <script src="data:text/javascript;base64,${btoa(`
          // Block system event handling
          document.addEventListener('blockComplete', function(e) {
            const { blockId, result } = e.detail;
            // Simple completion - redirect to next step
            const currentUrl = window.location.href;
            const nextUrl = currentUrl.includes('/v/') ? 
              currentUrl.replace(/(\/v\\/[^\\/]+)(\/\\d+)?/, '$1/' + (parseInt(currentUrl.split('/').pop()) + 1 || 1)) :
              currentUrl + '/1';
            window.location.href = nextUrl;
          });
        `)}"></script>
      </head>
      <body>
        <div class="block-container" id="blockContainer">
          {{BLOCK_CONTENT}}
        </div>
      </body>
      </html>
    `
  },
  
  fake_download: {
    name: "Fake Download Page",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Download - Please Wait</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            background: #f5f5f5;
            margin: 0;
            padding: 20px;
          }
          .header { 
            background: #2c3e50; 
            color: white; 
            padding: 15px; 
            margin-bottom: 20px;
          }
          .content { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white;
            padding: 20px;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔽 Download Center</h1>
        </div>
        <div class="content">
          <h2>Preparing your download...</h2>
          <p>Your file is being prepared. Please wait while we process your request.</p>
          {{BLOCK_CONTENT}}
        </div>
      </body>
      </html>
    `
  }
};

function renderTemplate(templateId, blockContent) {
  const template = pageTemplates[templateId];
  if (!template) {
    return blockContent; // Fallback: solo il blocco
  }
  
  return template.html.replace('{{BLOCK_CONTENT}}', blockContent);
}

// Helper per encoding base64
function btoa(str) {
  return Buffer.from(str).toString('base64');
}

module.exports = { pageTemplates, renderTemplate };