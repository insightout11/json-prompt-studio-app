// Image Preview API - Generate images via Stable Horde (Free) or Gemini/Nano-Banana (Pro)
import crypto from 'crypto';

// Simple in-memory cache for development - in production use Redis
const imageCache = new Map();
const jobStatusCache = new Map();

// Rate limiting storage (in production use Redis/database)
const rateLimitStore = new Map();

// Helper to generate cache key
function generateCacheKey(provider, prompt, seed, resolution, ratio) {
  const data = `${provider}:${prompt}:${seed}:${resolution}:${ratio}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Helper to get device fingerprint from request
function getDeviceFingerprint(req) {
  const userAgent = req.headers['user-agent'] || '';
  const acceptLanguage = req.headers['accept-language'] || '';
  const ip = req.ip || req.connection.remoteAddress || '';
  
  const fingerprint = crypto.createHash('sha256')
    .update(`${userAgent}:${acceptLanguage}:${ip}`)
    .digest('hex')
    .slice(0, 16);
    
  return fingerprint;
}

// Rate limiting check
function checkRateLimit(fingerprint, userId = null) {
  const today = new Date().toDateString();
  const key = userId ? `user:${userId}:${today}` : `device:${fingerprint}:${today}`;
  
  const current = rateLimitStore.get(key) || 0;
  const limit = 10; // 10 per day for free users
  
  return {
    allowed: current < limit,
    current,
    limit,
    remaining: Math.max(0, limit - current)
  };
}

// Increment usage counter
function incrementUsage(fingerprint, userId = null) {
  const today = new Date().toDateString();
  const key = userId ? `user:${userId}:${today}` : `device:${fingerprint}:${today}`;
  
  const current = rateLimitStore.get(key) || 0;
  rateLimitStore.set(key, current + 1);
}

// Stable Horde API integration
async function generateWithHorde(prompt, options = {}) {
  if (!process.env.HORDE_API_KEY) {
    throw new Error('Stable Horde API key not configured');
  }

  const {
    width = 512,
    height = 512,
    seed = null
  } = options;

  // Enhanced prompt for better quality
  const enhancedPrompt = `${prompt}, high quality, detailed, masterpiece`;

  // Submit job to Stable Horde
  const submitResponse = await fetch('https://stablehorde.net/api/v2/generate/async', {
    method: 'POST',
    headers: {
      'apikey': process.env.HORDE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: enhancedPrompt,
      params: {
        width,
        height,
        steps: 25, // Increased steps for better quality
        cfg_scale: 8.0, // Slightly higher CFG for better adherence
        seed: seed || undefined,
        sampler_name: 'k_dpmpp_2m',
        karras: true,
        clip_skip: 1
      },
      nsfw: false,
      trusted_workers: true,
      slow_workers: true, // Allow slower workers for better quality
      censor_nsfw: true,
      models: ['AlbedoBase XL (SDXL)'], // Use SDXL for better quality
      r2: true, // Enable R2 storage for better reliability
      shared: false
    })
  });

  if (!submitResponse.ok) {
    const error = await submitResponse.text();
    console.error('Horde API error:', error);
    throw new Error(`Horde submission failed: ${submitResponse.status}`);
  }

  const data = await submitResponse.json();
  const jobId = data.id;
  
  if (!jobId) {
    throw new Error('No job ID returned from Horde API');
  }

  // Store job status for polling
  jobStatusCache.set(jobId, {
    status: 'processing',
    provider: 'horde',
    submittedAt: Date.now(),
    prompt: enhancedPrompt,
    originalPrompt: prompt
  });

  return { jobId, status: 'processing' };
}

// Google Gemini/Nano-Banana integration
async function generateWithGemini(prompt, options = {}) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Google Gemini API key not configured');
  }

  const {
    width = 1024,
    height = 1024,
    seed = null,
    variations = 1,
    enhancementType = 'quality'
  } = options;

  // Enhanced prompt for Pro tier
  const enhancedPrompt = enhancePromptForPro(prompt, enhancementType);

  // Generate job ID
  const jobId = `gemini_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  
  // Store job status for polling
  jobStatusCache.set(jobId, {
    status: 'processing',
    provider: 'gemini',
    submittedAt: Date.now(),
    prompt: enhancedPrompt,
    originalPrompt: prompt,
    variations
  });

  // Placeholder Gemini API call
  // TODO: Replace with actual Google Gemini Image API when available
  try {
    console.log(`[GEMINI PLACEHOLDER] Generating ${variations} image(s) with Nano-Banana model:`, {
      jobId,
      prompt: enhancedPrompt,
      width,
      height,
      seed
    });

    // Simulate Pro tier processing with high quality results
    setTimeout(() => {
      const images = [];
      for (let i = 0; i < variations; i++) {
        images.push({
          img: `https://picsum.photos/${width}/${height}?random=${Date.now() + i}&pro=true`,
          seed: seed || Math.floor(Math.random() * 1000000),
          model: 'nano-banana-v2.5',
          width,
          height,
          quality_score: 0.95 + (Math.random() * 0.05), // 95-100% quality
          enhancement: enhancementType
        });
      }

      jobStatusCache.set(jobId, {
        status: 'completed',
        provider: 'gemini',
        images,
        submittedAt: Date.now() - 8000,
        completedAt: Date.now(),
        metadata: {
          model: 'nano-banana-v2.5',
          variations: variations,
          enhanced: true,
          quality: 'premium'
        }
      });
    }, Math.random() * 5000 + 5000); // 5-10 seconds for Pro tier

    return { jobId, status: 'processing' };

  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Gemini generation failed: ${error.message}`);
  }
}

// Helper function to enhance prompts for Pro tier
function enhancePromptForPro(originalPrompt, enhancementType = 'quality') {
  const enhancements = {
    quality: 'masterpiece, best quality, ultra detailed, sharp focus, professional photography, 8k resolution, high definition',
    style: 'artistic masterpiece, enhanced artistic style, dramatic lighting, cinematic composition, professional artwork, trending on artstation',
    detail: 'extremely detailed, intricate details, fine textures, hyper-realistic, ultra high definition, photorealistic, studio lighting'
  };

  const enhancement = enhancements[enhancementType] || enhancements.quality;
  return `${originalPrompt}, ${enhancement}`;
}

// Main preview endpoint
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      prompt,
      provider = 'horde', // 'horde' for free, 'gemini' for pro
      width = 512,
      height = 512,
      seed = null,
      variations = 1,
      userId = null,
      userTier = 'free',
      storyboardSlotId = null
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Valid prompt is required' });
    }

    // Get device fingerprint for rate limiting
    const fingerprint = getDeviceFingerprint(req);

    // Check rate limits for free users
    if (userTier === 'free') {
      const rateCheck = checkRateLimit(fingerprint, userId);
      
      if (!rateCheck.allowed) {
        return res.status(429).json({
          error: 'Daily limit reached',
          limit: rateCheck.limit,
          current: rateCheck.current,
          resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
      }

      // Show soft limit warning at 8/10
      if (rateCheck.current >= 8) {
        res.setHeader('X-Soft-Limit-Warning', 'true');
        res.setHeader('X-Remaining-Credits', rateCheck.remaining.toString());
      }
    }

    // Generate cache key
    const cacheKey = generateCacheKey(provider, prompt, seed, `${width}x${height}`, '1:1');
    
    // Check cache first
    if (imageCache.has(cacheKey)) {
      const cached = imageCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 12 * 60 * 60 * 1000) { // 12 hours
        return res.json({
          ...cached.data,
          cached: true
        });
      } else {
        imageCache.delete(cacheKey);
      }
    }

    let result;

    // Route to appropriate provider
    if (provider === 'horde' || userTier === 'free') {
      result = await generateWithHorde(prompt, { width: 512, height: 512, seed });
    } else if (provider === 'gemini' && userTier === 'pro') {
      result = await generateWithGemini(prompt, { width, height, seed, variations });
    } else {
      return res.status(400).json({ error: 'Invalid provider for user tier' });
    }

    // Increment usage for free users
    if (userTier === 'free') {
      incrementUsage(fingerprint, userId);
    }

    // Return job info for polling
    res.json({
      jobId: result.jobId,
      status: result.status,
      provider,
      storyboardSlotId,
      estimatedWait: provider === 'horde' ? '30-120 seconds' : '5-15 seconds'
    });

  } catch (error) {
    console.error('Preview generation error:', error);
    res.status(500).json({
      error: 'Failed to generate preview',
      details: error.message
    });
  }
}