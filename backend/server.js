const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
const shortenerRoutes = require('./routes/shortener');
app.use('/api', shortenerRoutes);
app.use('/', shortenerRoutes);
app.use('/api', shortenerRoutes);
app.use('/', shortenerRoutes); // Per i redirect /:shortId

// Landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`TrollShortener attivo su http://localhost:${PORT}`);
});
