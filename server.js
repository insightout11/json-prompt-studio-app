// Full-stack server with API proxy for AI services
import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Import our available API handlers
import previewHandler from './api/preview.js';
import previewStatusHandler from './api/preview-status.js';
import storyboardUseHandler from './api/storyboard/use.js';
import groqHandler from './api/groq.js';
import editImageHandler from './api/edit-image.js';
// Import auth handlers
import sessionHandler from './api/auth/session.js';
import googleHandler, { initiateGoogleAuth } from './api/auth/google.js';
import magicLinkHandler from './api/auth/magic-link.js';
import callbackHandler from './api/auth/callback.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5188;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes for AI services
app.post('/api/groq', groqHandler);
app.get('/api/groq', groqHandler);

// Image Preview API Routes
app.post('/api/preview', previewHandler);
app.get('/api/preview', previewHandler); // Allow GET for status check
app.get('/api/preview-status', previewStatusHandler);
app.post('/api/storyboard/use', storyboardUseHandler);

// Image Editing API Routes
app.post('/api/edit-image', editImageHandler);
app.get('/api/edit-image', editImageHandler);

// Authentication API Routes
app.get('/api/auth/session', sessionHandler);
app.post('/api/auth/magic-link', magicLinkHandler);
app.get('/api/auth/magic-link', magicLinkHandler);
app.get('/api/auth/callback', callbackHandler);
app.get('/api/auth/google', initiateGoogleAuth);
app.get('/api/auth/google/callback', googleHandler);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    apis: {
      groq: !!process.env.GROQ_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY
    }
  });
});

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

// 404 handler for non-API routes
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints: /api/groq, /api/preview, /api/preview-status, /api/edit-image, /api/storyboard/use, /api/auth/*, /api/health`);
});

export default app;