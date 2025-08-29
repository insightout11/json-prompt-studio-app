// Consolidated AI API endpoint - handles Groq, OpenAI, and simple AI requests
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
        message: 'Consolidated AI API endpoint is working', 
        timestamp: new Date().toISOString(),
        hasGroqApiKey: !!process.env.GROQ_API_KEY,
        hasOpenAIApiKey: !!process.env.OPENAI_API_KEY
      });
    }

    // Only allow POST requests for actual API calls
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { provider, messages, model, temperature, max_tokens, prompt } = req.body;

    // Route to appropriate AI service based on provider
    switch (provider) {
      case 'groq':
        return await handleGroqRequest(req, res);
      case 'openai':
        return await handleOpenAIRequest(req, res);
      case 'simple':
        return await handleSimpleRequest(req, res);
      default:
        return res.status(400).json({ error: 'Invalid provider specified' });
    }

  } catch (error) {
    console.error('AI API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

async function handleGroqRequest(req, res) {
  const { messages, model = 'llama-3.1-70b-versatile', temperature = 0.7, max_tokens = 2000 } = req.body;

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'Groq API key not configured' });
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream: false
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Groq API call failed:', error);
    return res.status(500).json({ error: 'Failed to call Groq API', details: error.message });
  }
}

async function handleOpenAIRequest(req, res) {
  const { messages, model = 'gpt-4o-mini', temperature = 0.7, max_tokens = 2000 } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('OpenAI API call failed:', error);
    return res.status(500).json({ error: 'Failed to call OpenAI API', details: error.message });
  }
}

async function handleSimpleRequest(req, res) {
  const { prompt, model } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required for simple requests' });
  }

  // Use Groq as the backend for simple requests
  const messages = [{ role: 'user', content: prompt }];
  
  return await handleGroqRequest({ body: { messages, model } }, res);
}