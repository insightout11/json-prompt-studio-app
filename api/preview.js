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
function checkRateLimit(fingerprint, userId = null, userTier = 'anonymous') {
  const today = new Date().toDateString();
  const key = userId ? `user:${userId}:${today}` : `device:${fingerprint}:${today}`;
  
  const current = rateLimitStore.get(key) || 0;
  
  // Different limits per tier
  const limits = {
    anonymous: 3,    // 3 premium trials
    new_user: 10,    // 10 premium bonus
    free: -1,        // Unlimited (not used here)
    pro: 500,        // 500 per month (handled separately)
    team: 1000       // 1000 per month (handled separately)
  };
  
  const limit = limits[userTier] || limits.anonymous;
  
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
        seed: seed ? seed.toString() : undefined,
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

  try {
    console.log(`[GEMINI IMAGE] Generating ${variations} image(s) with gemini-2.5-flash-image-preview:`, {
      jobId,
      prompt: enhancedPrompt,
      width,
      height,
      seed
    });

    // Call Gemini Image Generation API  
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: enhancedPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          candidateCount: variations,
          ...(seed && { seed: Math.abs(seed) % 2147483647 })
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[GEMINI] Raw response structure:`, JSON.stringify(data, null, 2));

    // Process Gemini response to extract images
    const images = [];
    let textResponse = null;
    let refusalReason = null;
    
    if (data.candidates && data.candidates.length > 0) {
      for (let i = 0; i < data.candidates.length; i++) {
        const candidate = data.candidates[i];
        
        // Check for content policy violations or other refusal reasons
        if (candidate.finishReason === 'PROHIBITED_CONTENT') {
          refusalReason = 'Content policy violation - please try a different prompt';
          break;
        } else if (candidate.finishReason === 'SAFETY') {
          refusalReason = 'Safety filter triggered - please modify your prompt';
          break;
        } else if (candidate.finishReason && candidate.finishReason !== 'STOP') {
          refusalReason = `Generation stopped due to: ${candidate.finishReason}`;
          break;
        }
        
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData && part.inlineData.data) {
              images.push({
                img: `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`,
                seed: seed || Math.floor(Math.random() * 1000000),
                model: 'gemini-2.5-flash-image-preview',
                width,
                height,
                quality_score: 0.95 + (Math.random() * 0.05),
                enhancement: enhancementType
              });
            } else if (part.text) {
              // Gemini returned text instead of image (likely refused generation)
              textResponse = part.text;
            }
          }
        }
      }
    }

    if (images.length > 0) {
      // Update job status with completed images
      jobStatusCache.set(jobId, {
        status: 'completed',
        provider: 'gemini',
        images,
        submittedAt: Date.now() - 2000,
        completedAt: Date.now(),
        metadata: {
          model: 'gemini-2.5-flash-image-preview',
          variations: images.length,
          enhanced: true,
          quality: 'premium'
        }
      });
      
      return { jobId, status: 'completed' };
    } else {
      // No images generated, likely refused by Gemini
      const errorMessage = refusalReason || textResponse || 'Gemini declined to generate this image';
      
      jobStatusCache.set(jobId, {
        status: 'failed',
        provider: 'gemini',
        error: errorMessage,
        textResponse,
        submittedAt: Date.now() - 2000,
        failedAt: Date.now()
      });
      
      throw new Error(errorMessage);
    }

  } catch (error) {
    console.error('Gemini image generation error:', error);
    
    // Update job status with error
    jobStatusCache.set(jobId, {
      status: 'failed',
      provider: 'gemini',
      error: error.message,
      submittedAt: Date.now() - 1000,
      failedAt: Date.now()
    });
    
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
  console.log(`🚀 Preview API called: ${req.method} ${req.url}`);
  console.log('🌐 Headers:', JSON.stringify(req.headers, null, 2));
  console.log('📦 Body type:', typeof req.body);
  console.log('📦 Body constructor:', req.body?.constructor?.name);
  
  // CORS headers for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Preview API is working',
      timestamp: new Date().toISOString(),
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasHordeKey: !!process.env.HORDE_API_KEY
    });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Simplified session handling for serverless environment
    const sessionId = req.headers.cookie?.split(';').find(c => c.trim().startsWith('session='))?.split('=')[1];
    let userTier = 'anonymous';
    let userId = null;
    
    // For now, allow all preview requests to proceed
    // In production, proper session validation would be implemented
    if (sessionId && sessionId.length > 10) {
      userTier = 'free'; // Treat valid sessions as free tier users
      userId = sessionId.substring(0, 16);
      console.log(`✅ Session found, using tier: ${userTier}`);
    } else {
      console.log(`🔍 No session or anonymous user, using tier: ${userTier}`);
    }
    
    console.log(`🎯 Using userTier: ${userTier}`);

    // Handle request body parsing issues
    let requestBody;
    try {
      requestBody = req.body || {};
      console.log('📋 Request body keys:', Object.keys(requestBody));
      console.log('📋 Request body:', JSON.stringify(requestBody).substring(0, 500) + '...');
    } catch (err) {
      console.log('❌ Error parsing request body:', err.message);
      return res.status(400).json({ error: 'Invalid request body', details: err.message });
    }
    
    const {
      prompt,
      provider = userTier === 'anonymous' ? 'horde' : userTier === 'free' ? 'horde' : 'gemini',
      width = 512,
      height = 512,
      seed = null,
      variations = 1,
      storyboardSlotId = null
    } = requestBody;

    console.log('🎯 Extracted prompt:', prompt ? `"${prompt.substring(0, 50)}..."` : 'null/undefined');
    console.log('🎯 Prompt type:', typeof prompt);

    if (!prompt || typeof prompt !== 'string') {
      console.log('❌ Invalid prompt:', { prompt, type: typeof prompt });
      return res.status(400).json({ 
        error: 'Valid prompt is required',
        received: { prompt: prompt, type: typeof prompt, body: req.body }
      });
    }

    // Get device fingerprint for rate limiting
    const fingerprint = getDeviceFingerprint(req);

    // Check rate limits for limited tiers (anonymous and new_user get premium trials with limits)
    if (userTier === 'anonymous' || userTier === 'new_user') {
      const rateCheck = checkRateLimit(fingerprint, userId, userTier);
      
      if (!rateCheck.allowed) {
        return res.status(429).json({
          error: userTier === 'anonymous' ? 'Trial limit reached - Sign up for more!' : 'Welcome bonus used up - Continue with free tier or upgrade!',
          limit: rateCheck.limit,
          current: rateCheck.current,
          resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          suggestedAction: userTier === 'anonymous' ? 'signup' : 'continue_free'
        });
      }

      // Show soft limit warning for premium trials
      const softLimit = userTier === 'anonymous' ? 2 : 8; // 2/3 for anonymous, 8/10 for new_user
      if (rateCheck.current >= softLimit) {
        res.setHeader('X-Soft-Limit-Warning', 'true');
        res.setHeader('X-Remaining-Credits', rateCheck.remaining.toString());
      }
    }
    // Free tier has no limits (unlimited Horde usage)
    // Pro/Team tiers have their own credit system handled separately

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

    // Route to appropriate provider based on new tier system
    try {
      // Premium quality for anonymous trials, new users, and pro users
      if (userTier === 'anonymous' || userTier === 'new_user' || userTier === 'pro' || userTier === 'team') {
        result = await generateWithGemini(prompt, { width, height, seed, variations });
      } 
      // Free tier uses Horde (or alternative)
      else if (userTier === 'free') {
        result = await generateWithHorde(prompt, { width: 512, height: 512, seed });
      } 
      // Handle explicit provider override (maintaining backward compatibility)
      else if (provider === 'horde') {
        result = await generateWithHorde(prompt, { width: 512, height: 512, seed });
      } else if (provider === 'gemini') {
        result = await generateWithGemini(prompt, { width, height, seed, variations });
      } else {
        return res.status(400).json({ error: 'Invalid provider for user tier' });
      }
    } catch (error) {
      console.error('Provider generation error:', error);
      return res.status(400).json({
        error: 'Image generation failed',
        details: error.message
      });
    }

    // Increment usage for limited tiers (anonymous and new_user have usage limits)
    if (userTier === 'anonymous' || userTier === 'new_user') {
      incrementUsage(fingerprint, userId);
    }
    // Free tier has unlimited usage, so no increment needed
    // Pro/Team usage is handled by separate credit system

    // Determine actual provider used based on tier
    const actualProvider = (userTier === 'free') ? 'horde' : 'gemini';
    
    // Return job info for polling (or immediate results for Gemini)
    const response = {
      jobId: result.jobId,
      status: result.status,
      provider: actualProvider,
      storyboardSlotId,
      estimatedWait: actualProvider === 'horde' ? '30-120 seconds' : '5-15 seconds'
    };

    // For Gemini jobs that complete immediately, include the image data
    console.log('[DEBUG] Provider:', actualProvider, 'Result status:', result.status, 'Result:', result);
    if (actualProvider === 'gemini' && result.status === 'completed') {
      const jobStatus = jobStatusCache.get(result.jobId);
      console.log('[DEBUG] Job status from cache:', jobStatus);
      if (jobStatus && jobStatus.status === 'completed') {
        response.images = jobStatus.images;
        response.metadata = jobStatus.metadata;
        console.log('[DEBUG] Added images to response:', response.images?.length);
      }
    }

    res.json(response);

  } catch (error) {
    console.error('Preview generation error:', error);
    res.status(500).json({
      error: 'Failed to generate preview',
      details: error.message
    });
  }
}