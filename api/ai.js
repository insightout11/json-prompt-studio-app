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

    // Check request body size (Vercel has ~1MB limit on Hobby plan)
    const bodySize = JSON.stringify(req.body).length;
    if (bodySize > 900000) { // 900KB safety margin
      return res.status(413).json({ 
        error: 'Request payload too large', 
        details: `Request size: ${Math.round(bodySize/1024)}KB, limit: 900KB`,
        suggestion: 'Try reducing image size or breaking request into smaller parts'
      });
    }

    const { provider, messages, model, temperature, max_tokens, prompt } = req.body;

    // Route to appropriate AI service based on provider
    switch (provider) {
      case 'groq':
        return await handleGroqRequest(req, res);
      case 'openai':
        return await handleOpenAIRequest(req, res);
      case 'gemini':
        return await handleGeminiRequest(req, res);
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

async function handleGeminiRequest(req, res) {
  const { messages, model = 'gemini-2.0-flash-exp', temperature = 0.7, max_tokens = 2000 } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Google Gemini API key not configured' });
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    // Convert OpenAI format to Gemini format
    const geminiMessages = messages.map(msg => {
      if (msg.role === 'system') {
        return { role: 'user', parts: [{ text: msg.content }] };
      } else if (msg.role === 'user') {
        // Handle both text and image content
        if (Array.isArray(msg.content)) {
          const parts = msg.content.map(content => {
            if (content.type === 'text') {
              return { text: content.text };
            } else if (content.type === 'image_url') {
              // Extract base64 data from data URL
              const base64Data = content.image_url.url.split(',')[1];
              return {
                inline_data: {
                  mime_type: 'image/jpeg', // Assume JPEG for now
                  data: base64Data
                }
              };
            }
            return content;
          });
          return { role: 'user', parts };
        } else {
          return { role: 'user', parts: [{ text: msg.content }] };
        }
      } else if (msg.role === 'assistant') {
        return { role: 'model', parts: [{ text: msg.content }] };
      }
      return msg;
    });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature,
          maxOutputTokens: max_tokens
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API request failed');
    }

    // Convert Gemini response to OpenAI format for compatibility
    const openAIFormat = {
      choices: [{
        message: {
          role: 'assistant',
          content: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated'
        },
        finish_reason: 'stop'
      }],
      usage: {
        prompt_tokens: 0, // Gemini doesn't provide token counts
        completion_tokens: 0,
        total_tokens: 0
      }
    };

    return res.status(200).json(openAIFormat);

  } catch (error) {
    console.error('Gemini API call failed:', error);
    return res.status(500).json({ error: 'Failed to call Gemini API', details: error.message });
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