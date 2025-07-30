const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
const shortenerRoutes = require('./routes/shortener');
const victimRoutes = require('./routes/victim');
const adminRoutes = require('./routes/admin');
const regenerateRoutes = require('./routes/regenerate');

// Middleware per cookie parsing
app.use(require('cookie-parser')());

// Landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use('/api', shortenerRoutes);
app.use('/admin', adminRoutes); // Admin endpoints
app.use('/v', regenerateRoutes); // Anti-tamper regeneration
app.use('/v', victimRoutes); // Route per vittime con prefisso /v
app.use('/', shortenerRoutes); // Per i redirect /:shortId

app.listen(PORT, () => {
  console.log(`TrollShortener attivo su http://localhost:${PORT}`);
});
