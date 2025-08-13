// Vercel serverless function for Groq API proxy
export default async function handler(req, res) {
  try {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET requests for testing
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Groq API endpoint is working', 
      timestamp: new Date().toISOString() 
    });
  }

  // Only allow POST requests for actual API calls
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model, temperature, max_tokens } = req.body;
    
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ 
        error: 'Groq API key not configured on server' 
      });
    }

    // Check if fetch is available
    if (typeof fetch === 'undefined') {
      return res.status(500).json({ 
        error: 'fetch is not available in this environment',
        nodeVersion: process.version
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
  } catch (globalError) {
    console.error('Global function error:', globalError);
    res.status(500).json({ 
      error: 'Global function error',
      details: globalError.message,
      stack: globalError.stack
    });
  }
}