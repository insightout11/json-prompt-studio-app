// Simple development server routing helper
// This file can be used with express for more advanced routing if needed

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Route for the main app
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// Route for landing page (default)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback for SPA routes within the app
app.get('/app/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// 404 handler
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;