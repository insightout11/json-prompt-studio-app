// Health Check API - Vercel serverless function
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Return health status and environment info
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: 'vercel',
      functions: {
        groq: !!process.env.GROQ_API_KEY,
        gemini: !!process.env.GEMINI_API_KEY,
        openai: !!process.env.OPENAI_API_KEY,
        google_oauth: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
      },
      endpoints: [
        '/api/health',
        '/api/groq', 
        '/api/preview',
        '/api/preview-status', 
        '/api/edit-image',
        '/api/storyboard/use',
        '/api/auth/session',
        '/api/auth/magic-link',
        '/api/auth/google',
        '/api/auth/callback'
      ]
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}