// Full-stack server with API proxy for AI services
import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Import our new API handlers
import previewHandler from './api/preview.js';
import previewStatusHandler from './api/preview-status.js';
import creditsHandler from './api/credits.js';
import enhanceHandler from './api/enhance.js';
import storyboardUseHandler from './api/storyboard/use.js';
import imageAnalysisHandler from './api/image-analysis.js';
import editImageHandler from './api/edit-image.js';
import magicLinkHandler from './api/auth/magic-link.js';
import callbackHandler from './api/auth/callback.js';
import sessionHandler from './api/auth/session.js';
import googleHandler, { initiateGoogleAuth } from './api/auth/google.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes for AI services
app.post('/api/groq', async (req, res) => {
  try {
    const { messages, model, temperature, max_tokens, seed, top_p, frequency_penalty, presence_penalty } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ 
        error: 'Groq API key not configured on server' 
      });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'llama-3.1-8b-instant',
        messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 1000,
        ...(seed && { seed }),
        ...(top_p && { top_p }),
        ...(frequency_penalty && { frequency_penalty }),
        ...(presence_penalty && { presence_penalty })
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      return res.status(response.status).json({ 
        error: `Groq API error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Groq API proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

app.post('/api/openai', async (req, res) => {
  try {
    const { messages, model, temperature, max_tokens, seed, top_p, frequency_penalty, presence_penalty } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured on server' 
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 1000,
        ...(seed && { seed }),
        ...(top_p && { top_p }),
        ...(frequency_penalty && { frequency_penalty }),
        ...(presence_penalty && { presence_penalty })
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return res.status(response.status).json({ 
        error: `OpenAI API error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('OpenAI API proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Image Preview API Routes
app.post('/api/preview', previewHandler);
app.get('/api/preview-status', previewStatusHandler);
app.all('/api/credits', creditsHandler);
app.post('/api/enhance', enhanceHandler);
app.post('/api/storyboard/use', storyboardUseHandler);
app.post('/api/image-analysis', imageAnalysisHandler);
app.post('/api/edit-image', editImageHandler);

// Authentication API Routes
app.post('/api/auth/magic-link', magicLinkHandler);
app.get('/api/auth/callback', callbackHandler);
app.get('/api/auth/session', sessionHandler);
app.get('/api/auth/google', initiateGoogleAuth);
app.get('/api/auth/google/callback', googleHandler);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    apis: {
      groq: !!process.env.GROQ_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
      horde: !!process.env.HORDE_API_KEY,
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
  console.log(`API endpoints: /api/groq, /api/openai, /api/health`);
});

export default app;