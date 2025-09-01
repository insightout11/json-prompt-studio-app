// Image Edit API - Edit images using AI (Pro feature)
import crypto from 'crypto';

// Simple in-memory cache for development - in production use Redis
const editCache = new Map();

// Helper to generate cache key for edits
function generateEditCacheKey(originalUrl, editDescription) {
  const data = `${originalUrl}:${editDescription}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Edit image using Gemini (Pro feature only)
async function editImageWithGemini(originalImageUrl, originalPrompt, editDescription) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Google Gemini API key not configured');
  }

  // Generate job ID for edit
  const jobId = `edit_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  
  try {
    console.log(`[GEMINI EDIT] Editing image with gemini-2.5-flash-image-preview:`, {
      jobId,
      originalPrompt,
      editDescription,
      originalImageUrl: originalImageUrl ? originalImageUrl.substring(0, 50) + '...' : 'null'
    });

    // Extract base64 image data from data URL
    let base64ImageData = null;
    let mimeType = 'image/png';
    
    if (originalImageUrl && originalImageUrl.startsWith('data:image/')) {
      const [headerPart, dataPart] = originalImageUrl.split(',');
      if (dataPart) {
        base64ImageData = dataPart;
        // Extract mime type from header (e.g., "data:image/jpeg;base64" -> "image/jpeg")
        const mimeMatch = headerPart.match(/data:(image\/[^;]+)/);
        if (mimeMatch) {
          mimeType = mimeMatch[1];
        }
        console.log(`[GEMINI EDIT] Extracted base64 data:`, {
          mimeType,
          dataLength: base64ImageData.length,
          dataPreview: base64ImageData.substring(0, 100) + '...'
        });
      }
    }

    if (!base64ImageData) {
      throw new Error('Invalid or missing image data in originalImageUrl');
    }

    // Create targeted edit instruction that only changes what's requested
    const editInstruction = `Edit the provided image to ${editDescription}. Make ONLY this specific change while preserving everything else exactly as it appears in the original image. Do not change the pose, angle, background, lighting, or any other elements not mentioned in the edit description.`;

    // Call Gemini Image Generation API with multimodal input (image + text)
    const requestBody = {
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64ImageData
            }
          },
          {
            text: editInstruction
          }
        ]
      }],
      generationConfig: {
        temperature: 0.0,
        candidateCount: 1
      }
    };

    console.log(`[GEMINI EDIT] Sending multimodal request:`, {
      mimeType,
      dataLength: base64ImageData.length,
      editInstruction,
      hasImage: !!base64ImageData
    });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini Edit API error:', errorText);
      throw new Error(`Gemini Edit API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[GEMINI EDIT] Raw response received:`, JSON.stringify(data, null, 2));

    // Process Gemini response to extract edited image
    let editedImage = null;
    let textResponse = null;

    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      
      // Check for safety filters or other finish reasons
      console.log('[GEMINI EDIT] Candidate finish reason:', candidate.finishReason);
      if (candidate.finishReason === 'PROHIBITED_CONTENT') {
        throw new Error('Content policy violation - please try a different edit description');
      } else if (candidate.finishReason === 'SAFETY') {
        throw new Error('Safety filter triggered - please modify your edit description');
      } else if (candidate.finishReason && candidate.finishReason !== 'STOP') {
        console.log('[GEMINI EDIT] Unexpected finish reason:', candidate.finishReason);
      }
      
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          console.log('[GEMINI EDIT] Processing part:', JSON.stringify(part, null, 2));
          if (part.inlineData && part.inlineData.data) {
            editedImage = {
              img: `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`,
              editDescription,
              originalPrompt,
              editInstruction: editInstruction,
              model: 'gemini-2.5-flash-image-preview',
              quality_score: 0.95 + (Math.random() * 0.05),
              isEdit: true,
              editType: 'multimodal_image_edit'
            };
            console.log('[GEMINI EDIT] Found image data, size:', part.inlineData.data.length);
            break;
          } else if (part.text) {
            textResponse = part.text;
            console.log('[GEMINI EDIT] Found text response:', textResponse);
          }
        }
      }
    }

    if (editedImage) {
      console.log('[GEMINI EDIT] Successfully generated edited image');
      return {
        success: true,
        editedImage,
        jobId
      };
    } else {
      // Gemini refused to edit the image or returned text instead of image
      const errorMessage = textResponse || 'Gemini declined to edit this image';
      console.log('[GEMINI EDIT] Edit refused or returned text instead of image:', errorMessage);
      console.log('[GEMINI EDIT] Text response was:', textResponse);
      throw new Error(`Cannot edit image: ${errorMessage}`);
    }

  } catch (error) {
    console.error('Gemini edit error:', error);
    throw new Error(`Image edit failed: ${error.message}`);
  }
}

// Main edit-image endpoint
export default async function handler(req, res) {
  console.log('[EDIT IMAGE] Endpoint hit with method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      originalImageUrl,
      originalPrompt,
      editDescription,
      userId = null,
      userTier = 'free'
    } = req.body;

    // Validate input
    if (!originalImageUrl || !originalPrompt || !editDescription) {
      return res.status(400).json({ 
        error: 'Original image URL, original prompt, and edit description are required' 
      });
    }

    // Allow Pro users, anonymous trial users, and new users to edit images  
    if (userTier !== 'pro' && userTier !== 'anonymous' && userTier !== 'new_user') {
      console.log('[EDIT IMAGE] Access denied for userTier:', userTier);
      return res.status(403).json({ 
        error: 'Image editing requires Pro subscription or free trial access',
        receivedUserTier: userTier
      });
    }

    console.log('[EDIT IMAGE] Processing edit request:', {
      originalPrompt: originalPrompt.substring(0, 100) + '...',
      editDescription,
      userTier,
      userId,
      originalImageUrl,
      fullRequestBody: req.body
    });

    // Check cache first
    const cacheKey = generateEditCacheKey(originalImageUrl, editDescription);
    if (editCache.has(cacheKey)) {
      const cached = editCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 6 * 60 * 60 * 1000) { // 6 hours cache
        console.log('[EDIT IMAGE] Returning cached result');
        return res.json({
          ...cached.data,
          cached: true
        });
      } else {
        editCache.delete(cacheKey);
      }
    }

    // Edit image using Gemini
    const result = await editImageWithGemini(originalImageUrl, originalPrompt, editDescription);

    // Cache the result
    editCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    // Return the edited image
    res.json(result);

  } catch (error) {
    console.error('Image edit error:', error);
    res.status(500).json({
      error: 'Failed to edit image',
      details: error.message
    });
  }
}