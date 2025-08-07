const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// Routes
const shortenerRoutes = require('./routes/shortener');
const victimRoutes = require('./routes/victim');
const adminRoutes = require('./routes/admin');
const regenerateRoutes = require('./routes/regenerate');
const debugRoutes = require('./routes/debug');
const debugTemplatesRoutes = require('./routes/debug-templates');

// Middleware per cookie parsing
app.use(require('cookie-parser')());

// PropellerAds verification file
app.get('/sw.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../sw.js'));
});

// Landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use('/api', shortenerRoutes);
app.use('/admin', adminRoutes); // Admin endpoints
app.use('/debug', debugRoutes); // Debug endpoints
app.use('/debug', debugTemplatesRoutes); // Template debug endpoints
app.use('/v', regenerateRoutes); // Anti-tamper regeneration
app.use('/v', victimRoutes); // Route per vittime con prefisso /v
app.use('/', shortenerRoutes); // Per i redirect /:shortId

app.listen(PORT, () => {
  const logger = require('./utils/debug-logger');
  
  logger.info('SERVER', `TrollShortener started on port ${PORT}`, {
    port: PORT,
    env: process.env.NODE_ENV || 'development',
    debug: process.env.DEBUG_MODE !== 'false',
    mongodb: process.env.MONGODB_URI ? 'CONFIGURED' : 'LOCAL_FALLBACK'
  });
  
  console.log(`🚀 TrollShortener attivo su http://localhost:${PORT}`);
  console.log(`🧌 Ready to troll with natural RNG!`);
  console.log(`📊 Monitoring: /debug/status, /admin/usage`);
});
