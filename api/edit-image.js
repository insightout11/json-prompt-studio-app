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
      }
    }

    if (!base64ImageData) {
      throw new Error('Invalid or missing image data in originalImageUrl');
    }

    // Create enhanced edit instruction that emphasizes modifying the existing image
    const editInstruction = `Using the provided image, ${editDescription}. Keep all other elements of the image the same unless specifically mentioned in the edit request. Maintain the original composition, style, and quality.`;

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
        temperature: 0.7,
        candidateCount: 1
      }
    };


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

    // Process Gemini response to extract edited image
    let editedImage = null;
    let textResponse = null;

    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      
      // Check for safety filters or other finish reasons
      if (candidate.finishReason === 'PROHIBITED_CONTENT') {
        throw new Error('Content policy violation - please try a different edit description');
      } else if (candidate.finishReason === 'SAFETY') {
        throw new Error('Safety filter triggered - please modify your edit description');
      }
      
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
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
            break;
          } else if (part.text) {
            textResponse = part.text;
          }
        }
      }
    }

    if (editedImage) {
      return {
        success: true,
        editedImage,
        jobId
      };
    } else {
      // Gemini refused to edit the image or returned text instead of image
      const errorMessage = textResponse || 'Gemini declined to edit this image';
      throw new Error(`Cannot edit image: ${errorMessage}`);
    }

  } catch (error) {
    console.error('Gemini edit error:', error);
    throw new Error(`Image edit failed: ${error.message}`);
  }
}

// Main edit-image endpoint
export default async function handler(req, res) {
  
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
      return res.status(403).json({ 
        error: 'Image editing requires Pro subscription or free trial access',
        receivedUserTier: userTier
      });
    }


    // Check cache first
    const cacheKey = generateEditCacheKey(originalImageUrl, editDescription);
    if (editCache.has(cacheKey)) {
      const cached = editCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 6 * 60 * 60 * 1000) { // 6 hours cache
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