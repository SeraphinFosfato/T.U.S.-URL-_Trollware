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
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        </style>
      </head>
      <body>
        {{BLOCK_CONTENT}}
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

module.exports = { pageTemplates, renderTemplate };