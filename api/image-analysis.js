// Gemini Image Analysis API - Pro-only feature using Google Gemini Vision
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, userId, userTier = 'free' } = req.body;

    // Pro-only feature check
    if (userTier !== 'pro') {
      return res.status(403).json({
        error: 'Image analysis is a Pro feature',
        message: 'Upgrade to Pro to analyze images and extract JSON scene data',
        upgradeUrl: '/upgrade',
        feature: 'image_analysis'
      });
    }

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API not configured' });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Extract base64 data without data URL prefix
    const base64Data = imageBase64.includes(',') 
      ? imageBase64.split(',')[1] 
      : imageBase64;

    const systemPrompt = `You are an expert visual scene analysis AI specialized in creating detailed video generation prompts from images. Your focus is on describing scenes, environments, objects, and artistic elements for creative video production.

ANALYSIS FOCUS AREAS:
1. SCENE COMPOSITION: Overall layout, framing, visual elements
2. ENVIRONMENT: Setting, location, background elements
3. OBJECTS & ITEMS: Visible objects, props, decorative elements  
4. VISUAL STYLE: Art style, color palette, lighting, mood
5. TECHNICAL ASPECTS: Camera angle, composition, visual effects

FIELD MAPPING (use these exact field names):
- scene: Overall scene description with specific visual details
- setting: Specific environment type (indoor, outdoor, urban, natural, fantasy, etc.)
- location: More detailed location description (office, forest, space station, etc.)
- objects: Visible objects, props, items in the scene
- style: Visual/artistic style (realistic, animated, cinematic, artistic, etc.)
- color_palette: Dominant colors and color schemes
- lighting_type: Quality and direction of light (natural, artificial, dramatic, soft, etc.)
- time_of_day: Lighting conditions and time indicators
- weather: Weather conditions if visible
- camera_angle: Perspective (close-up, wide shot, aerial, eye-level, etc.)
- mood: Overall emotional tone and atmosphere
- composition: Visual arrangement and framing style

RESPONSE FORMAT:
Return a JSON object with field names as keys and objects containing:
{
  "field_name": {
    "value": "detailed description",
    "confidence": 0.95
  }
}

Confidence levels:
- 0.9-1.0: Very clear and obvious
- 0.7-0.8: Clearly visible with good detail
- 0.5-0.6: Somewhat visible or inferred
- 0.3-0.4: Difficult to determine but likely
- 0.1-0.2: Uncertain or barely visible

Analyze this image and extract video generation parameters:`;

    // Prepare the image for Gemini
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg' // Adjust based on actual image type
      }
    };


    // Generate content using Gemini Vision
    const result = await model.generateContent([systemPrompt, imagePart]);
    const response = await result.response;
    const text = response.text();


    // Parse the JSON response
    let analysisData;
    try {
      // Clean the response - remove markdown code blocks if present
      const cleanedResponse = text
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      
      analysisData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw response:', text);
      
      // Fallback: try to extract JSON from the text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          analysisData = JSON.parse(jsonMatch[0]);
        } catch (fallbackError) {
          return res.status(500).json({
            error: 'Failed to parse AI response',
            details: 'The AI returned invalid JSON format'
          });
        }
      } else {
        return res.status(500).json({
          error: 'No valid JSON found in AI response',
          details: 'The AI response did not contain extractable JSON data'
        });
      }
    }

    // Validate and format the response
    const formattedFields = {};
    
    Object.entries(analysisData).forEach(([fieldKey, fieldData]) => {
      if (fieldData && typeof fieldData === 'object' && fieldData.value) {
        formattedFields[fieldKey] = {
          value: fieldData.value,
          confidence: fieldData.confidence || 0.8,
          source: 'gemini-vision'
        };
      } else if (typeof fieldData === 'string') {
        // Handle simple string responses
        formattedFields[fieldKey] = {
          value: fieldData,
          confidence: 0.8,
          source: 'gemini-vision'
        };
      }
    });

    // Track Pro feature usage
    if (userId) {
      // You could implement usage tracking here
    }

    res.json({
      success: true,
      fields: formattedFields,
      model: 'gemini-2.5-flash',
      provider: 'google-gemini',
      totalFields: Object.keys(formattedFields).length,
      averageConfidence: Object.values(formattedFields)
        .reduce((sum, field) => sum + field.confidence, 0) / Object.keys(formattedFields).length
    });

  } catch (error) {
    console.error('Gemini image analysis error:', error);
    
    let errorMessage = 'Failed to analyze image';
    let statusCode = 500;

    if (error.message?.includes('API key')) {
      errorMessage = 'Gemini API key not configured properly';
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'Rate limit exceeded. Please try again in a moment';
      statusCode = 429;
    } else if (error.message?.includes('invalid') || error.message?.includes('format')) {
      errorMessage = 'Invalid image format. Please use JPEG, PNG, or WebP';
      statusCode = 400;
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      details: error.message
    });
  }
}