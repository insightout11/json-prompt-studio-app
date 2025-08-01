// Unified ChatGPT API Service for JSON Prompt Studio
// Comprehensive error handling, retry logic, and fallback systems

import { buildPrompt } from './aiSystemPrompts.js';

class AIApiService {
  constructor() {
    this.apiKey = null;
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
    this.maxRetries = 3;
    this.retryDelay = 1000; // ms
    this.timeout = 30000; // 30 seconds
    this.rateLimitDelay = 2000; // ms between requests
    this.lastRequestTime = 0;
    
    // Initialize API key from environment or localStorage
    this.initializeApiKey();
  }

  initializeApiKey() {
    // Try to get API key from environment variables first (Vite style)
    this.apiKey = import.meta?.env?.VITE_OPENAI_API_KEY || null;
    
    // If not in environment, try localStorage (for user-provided keys)
    if (!this.apiKey && typeof window !== 'undefined') {
      this.apiKey = localStorage.getItem('openai_api_key');
    }
  }

  setApiKey(key) {
    this.apiKey = key;
    if (typeof window !== 'undefined') {
      localStorage.setItem('openai_api_key', key);
    }
  }

  getApiKey() {
    return this.apiKey;
  }

  hasApiKey() {
    return !!this.apiKey;
  }

  // Rate limiting to prevent API abuse
  async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const waitTime = this.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  // Core API request with comprehensive error handling
  async makeRequest(messages, options = {}) {
    if (!this.hasApiKey()) {
      throw new Error('OpenAI API key is required. Please set your API key in settings.');
    }

    await this.enforceRateLimit();

    const requestPayload = {
      model: options.model || 'gpt-4o-mini',
      messages: messages,
      max_tokens: options.maxTokens || 2000,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 1,
      frequency_penalty: options.frequencyPenalty || 0,
      presence_penalty: options.presencePenalty || 0,
      ...options.additionalParams
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(requestPayload),
      signal: AbortSignal.timeout(options.timeout || this.timeout)
    };

    let lastError;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`AI API Request attempt ${attempt}/${this.maxRetries}`);
        
        const response = await fetch(this.baseURL, requestOptions);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new APIError(
            response.status,
            errorData.error?.message || `HTTP ${response.status}`,
            errorData.error?.type,
            attempt === this.maxRetries // isLastAttempt
          );
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error('Invalid response format from OpenAI API');
        }

        return {
          content: data.choices[0].message.content,
          usage: data.usage,
          model: data.model,
          finishReason: data.choices[0].finish_reason
        };

      } catch (error) {
        lastError = error;
        console.warn(`AI API Request attempt ${attempt} failed:`, error.message);
        
        // Don't retry on certain error types
        if (error instanceof APIError) {
          if (error.shouldNotRetry()) {
            throw error;
          }
        }
        
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }

        // Wait before retrying (exponential backoff)
        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('All retry attempts failed');
  }

  // Scene Extension API
  async extendScene(originalScene, continuationType, additionalContext = {}) {
    try {
      const systemPrompt = buildPrompt('sceneExtender', continuationType, originalScene, additionalContext);
      
      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: 'Please create the continuation scene as specified in the system instructions.'
        }
      ];

      const response = await this.makeRequest(messages, {
        temperature: this.getTemperatureForContinuationType(continuationType),
        maxTokens: 2500
      });

      return {
        success: true,
        scene: response.content,
        continuationType: continuationType,
        usage: response.usage,
        metadata: {
          originalSceneFields: Object.keys(originalScene).length,
          processingTime: Date.now(),
          model: response.model
        }
      };

    } catch (error) {
      console.error('Scene extension failed:', error);
      return this.handleSceneExtensionError(error, originalScene, continuationType);
    }
  }

  // Simple Scene Extension API - Returns plain text summary + updated JSON
  async extendSceneSimple(originalScene, extensionType) {
    try {
      // Wait for rate limiting
      await this.enforceRateLimit();
      
      const prompt = this.buildSimpleExtensionPrompt(originalScene, extensionType);
      
      const messages = [
        {
          role: 'system',
          content: prompt
        },
        {
          role: 'user',
          content: `Extend this scene with a ${extensionType}:\n\n${JSON.stringify(originalScene, null, 2)}`
        }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.7,
        maxTokens: 1500
      });

      const result = JSON.parse(response.content);
      
      return {
        success: true,
        summary: result.summary,
        updatedJson: result.json,
        usage: response.usage
      };

    } catch (error) {
      console.error(`Simple scene extension error (${extensionType}):`, error);
      
      return {
        success: false,
        error: error.message,
        summary: `Failed to generate ${extensionType}. Please try again.`,
        updatedJson: originalScene
      };
    }
  }

  // Generate 5 Scene Options API - Returns array of 5 different scene extensions
  async generateSceneOptions(originalScene, count = 5) {
    try {
      // Wait for rate limiting
      await this.enforceRateLimit();
      
      const prompt = this.build5OptionsPrompt(originalScene, count);
      
      const messages = [
        {
          role: 'system',
          content: prompt
        },
        {
          role: 'user',
          content: `Generate ${count} different scene extensions for:\n\n${JSON.stringify(originalScene, null, 2)}`
        }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.8,
        maxTokens: 2500
      });

      const result = JSON.parse(response.content);
      
      return {
        success: true,
        options: result.options,
        usage: response.usage
      };

    } catch (error) {
      console.error('5 Options generation error:', error);
      
      return {
        success: false,
        error: error.message,
        options: []
      };
    }
  }

  // Build 5 options generation prompt
  build5OptionsPrompt(originalScene, count) {
    return `You are a creative AI assistant that generates multiple scene continuation options for video scenes.

Your task is to create ${count} DIFFERENT and DISTINCT scene extensions from the given JSON scene.

Return your response in this EXACT JSON format:
{
  "options": [
    {
      "type": "Continue",
      "icon": "🔗", 
      "summary": "1-2 sentence plain English description",
      "json": { /* complete updated JSON scene */ }
    },
    {
      "type": "Twist",
      "icon": "🌪️",
      "summary": "1-2 sentence plain English description", 
      "json": { /* complete updated JSON scene */ }
    },
    // ... ${count} total options
  ]
}

Generate exactly ${count} options with these types:
1. **Continue** (🔗) - Natural, logical progression
2. **Twist** (🌪️) - Unexpected plot development  
3. **Develop** (👤) - Character-focused emotional depth
4. **Surprise** (✨) - Creative unexpected element
5. **Escalate** (🔥) - Increase tension/drama

REQUIREMENTS:
- Each option must be significantly different from others
- Each must have a compelling, readable summary
- Each JSON must be complete and valid
- Preserve core scene elements while adding extensions
- Make summaries engaging and clear for user selection`;
  }

  // Build simple extension prompts (keeping for backward compatibility)
  buildSimpleExtensionPrompt(originalScene, extensionType) {
    const basePrompt = `You are a creative AI assistant that helps extend video scene descriptions. 

Your task is to take a JSON scene description and extend it with a ${extensionType}.

Return your response in this EXACT JSON format:
{
  "summary": "A 1-2 sentence plain English description of what you added/changed",
  "json": { /* the complete updated JSON scene */ }
}

Guidelines for ${extensionType}:`;

    const typeSpecificGuidelines = {
      continue: `
- Create a natural, logical progression of the current scene
- Add new action or developments that feel like the next moment
- Keep the same characters, setting, and tone
- Example summary: "The character walks toward the mysterious door and slowly opens it."`,

      twist: `
- Add an unexpected element that changes the scene's direction
- Keep it believable within the scene's context
- Can introduce new elements, revelations, or surprises
- Example summary: "A hidden trapdoor suddenly opens beneath the character's feet."`,

      develop: `
- Focus on character emotions, motivations, or backstory
- Add internal thoughts, reactions, or character-driven details
- Deepen the psychological or emotional aspects
- Example summary: "The character hesitates, remembering their childhood fear of dark spaces."`
    };

    return basePrompt + typeSpecificGuidelines[extensionType] + `

IMPORTANT: 
- Always include both "summary" and "json" fields in your response
- The JSON must be valid and complete
- Keep the summary concise but descriptive
- Preserve the original scene's core elements while adding your extension`;
  }

  // Prompt Optimization API
  async optimizePrompt(originalPrompt, optimizationMode, userPreferences = {}) {
    try {
      const systemPrompt = buildPrompt('optimizer', optimizationMode, originalPrompt, { 
        userPreferences,
        targetPlatform: userPreferences.platform || 'video'
      });

      const messages = [
        {
          role: 'system', 
          content: systemPrompt
        },
        {
          role: 'user',
          content: 'Please optimize this prompt according to the specified mode and return the enhanced JSON.'
        }
      ];

      const response = await this.makeRequest(messages, {
        temperature: this.getTemperatureForOptimizationMode(optimizationMode),
        maxTokens: 3000
      });

      return {
        success: true,
        optimizedPrompt: response.content,
        optimizationMode: optimizationMode,
        usage: response.usage,
        metadata: {
          originalPromptFields: Object.keys(originalPrompt).length,
          processingTime: Date.now(),
          model: response.model
        }
      };

    } catch (error) {
      console.error('Prompt optimization failed:', error);
      return this.handleOptimizationError(error, originalPrompt, optimizationMode);
    }
  }

  // Character Generation API (legacy method)
  async generateCharacter(name, trait) {
    try {
      const systemPrompt = `You are an expert character creator for video and storytelling. Generate a complete, detailed character based on the provided name and primary trait.

Create a character with:
- Rich physical appearance details
- Deep personality traits and quirks
- Compelling background/backstory
- Unique mannerisms or speech patterns
- How they would integrate into video scenes

Return your response in this EXACT JSON format:
{
  "name": "${name}",
  "appearance": "Detailed physical description including clothing, build, distinctive features",
  "personality": "Core personality traits, motivations, fears, desires",
  "background": "Personal history, occupation, important life events",
  "quirks": "Unique mannerisms, speech patterns, or behavioral traits",
  "sceneIntegration": {
    "acting_style": "How they move and behave on camera",
    "dialogue_style": "How they speak (formal, casual, accent, etc.)",
    "emotional_range": "Their typical emotional expressions"
  }
}

Character Details:
- Name: ${name}
- Primary Trait: ${trait}

Make the character feel authentic, three-dimensional, and visually interesting for video production.`;

      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Create a ${trait} character named ${name}.`
        }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.8,
        maxTokens: 1500
      });

      const character = JSON.parse(response.content);
      
      return {
        success: true,
        character: character,
        usage: response.usage
      };

    } catch (error) {
      console.error('Character generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate character',
        character: null
      };
    }
  }

  // Enhanced Character Generation from Free-form Text
  async generateCharacterFromText(description) {
    try {
      const systemPrompt = `You are an expert character creator for video and storytelling. Generate a complete, detailed character based on the provided free-form description.

Parse the description and create a character with:
- Rich physical appearance details
- Deep personality traits and quirks  
- Compelling background/backstory
- Unique mannerisms or speech patterns
- How they would integrate into video scenes
- Form field mappings for easy editing

Return your response in this EXACT JSON format:
{
  "name": "Character name (extract or create from description)",
  "appearance": "Detailed physical description including clothing, build, distinctive features",
  "personality": "Core personality traits, motivations, fears, desires", 
  "background": "Personal history, occupation, important life events",
  "quirks": "Unique mannerisms, speech patterns, or behavioral traits",
  "sceneIntegration": {
    "acting_style": "How they move and behave on camera",
    "dialogue_style": "How they speak (formal, casual, accent, etc.)",
    "emotional_range": "Their typical emotional expressions"
  },
  "formFieldMappings": {
    "character": "Primary character name",
    "age": "Character age (if mentioned or inferred)",
    "personality": "Brief personality summary",
    "clothing": "Main clothing/style description",
    "hair": "Hair description",
    "build": "Body build/physique",
    "occupation": "Job or role",
    "distinctive_features": "Notable physical features",
    "mannerisms": "Key behavioral traits",
    "speech_pattern": "How they talk",
    "motivation": "Primary drive/goal",
    "fear": "Main fear or weakness"
  }
}

Character Description: ${description}

Extract details from the description and expand them into a full character. If details are missing, create appropriate ones that fit the description's tone and style. Make the character feel authentic, three-dimensional, and visually interesting for video production.`;

      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Create a character from this description: ${description}`
        }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.8,
        maxTokens: 2000
      });

      const character = JSON.parse(response.content);
      
      return {
        success: true,
        character: character,
        usage: response.usage
      };

    } catch (error) {
      console.error('Character from text generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate character from description',
        character: null
      };
    }
  }

  // World Building API
  async generateWorld(currentScene, expansionType) {
    try {
      const systemPrompt = `You are an expert world builder for video and storytelling. Analyze the provided scene and create a rich world expansion based on the requested type.

Current Scene Context:
${JSON.stringify(currentScene, null, 2)}

Expansion Type: ${expansionType}

Return your response in this EXACT JSON format based on expansion type:

For "full" expansion:
{
  "name": "World/Setting name",
  "lore": "Rich backstory and history of this world",
  "rules": "How this world works, what makes it unique",
  "atmosphere": "Overall mood and environmental feeling",
  "culture": "Social norms, customs, way of life",
  "locations": [
    {
      "name": "Location name",
      "description": "Detailed description",
      "atmosphere": "Mood and feeling",
      "details": "Specific visual and environmental elements"
    }
  ]
}

For "locations" expansion:
{
  "locations": [
    {
      "name": "Location name",
      "description": "Detailed description",
      "atmosphere": "Mood and feeling", 
      "details": "Specific visual and environmental elements",
      "relationship": "How this connects to the original scene"
    }
  ]
}

For "lore" expansion:
{
  "lore": "Rich backstory and history",
  "culture": "Social norms and customs",
  "significance": "Why this matters to the story"
}

For "atmosphere" expansion:
{
  "atmosphere": "Enhanced atmospheric description",
  "sounds": "Environmental and ambient sounds",
  "lighting": "Detailed lighting and mood elements",
  "weather": "Weather and climate effects"
}

Create a world that feels lived-in, authentic, and visually compelling for video production.`;

      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Generate a ${expansionType} world expansion for this scene.`
        }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.7,
        maxTokens: 2000
      });

      const world = JSON.parse(response.content);
      
      return {
        success: true,
        world: world,
        usage: response.usage
      };

    } catch (error) {
      console.error('World generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate world',
        world: null
      };
    }
  }

  // Storyboard Generation API
  async generateStoryboard(currentScene, sceneCount, narrativeStructure) {
    try {
      const systemPrompt = `You are an expert storyboard creator and narrative designer. Create a compelling ${sceneCount}-scene sequence using ${narrativeStructure} structure, building from the provided starting scene.

Starting Scene:
${JSON.stringify(currentScene, null, 2)}

Create ${sceneCount} scenes that form a complete narrative arc using ${narrativeStructure} structure.

Return your response in this EXACT JSON format:
{
  "title": "Compelling title for this story sequence",
  "structure": "${narrativeStructure}",
  "scenes": [
    {
      "title": "Scene title",
      "position": "opening|development|climax|resolution|transition",
      "description": "Detailed scene description for video production",
      "context": "How this scene connects to the overall story",
      "sceneData": {
        "scene": "Complete scene description",
        "setting": "Location/environment",
        "character_action": "What characters are doing",
        "mood": "Emotional tone",
        "camera_work": "Suggested camera angles/movements",
        "lighting": "Lighting suggestions",
        "pacing": "Scene rhythm and timing"
      }
    }
  ]
}

Structure Guidelines:
- three-act: Setup → Conflict → Resolution  
- hero-journey: Call → Challenge → Return
- tension-build: Calm → Rising tension → Climax
- character-arc: Introduction → Development → Transformation
- mystery: Question → Investigation → Revelation

Make each scene visually distinct, emotionally engaging, and suitable for video production.`;

      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Create a ${sceneCount}-scene storyboard using ${narrativeStructure} structure.`
        }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.8,
        maxTokens: 3000
      });

      const storyboard = JSON.parse(response.content);
      
      return {
        success: true,
        storyboard: storyboard,
        usage: response.usage
      };

    } catch (error) {
      console.error('Storyboard generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate storyboard',
        storyboard: null
      };
    }
  }

  // Multi-scene extension for timeline building
  async extendMultipleScenes(scenes, globalContext = {}) {
    const results = [];
    
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const context = {
        ...globalContext,
        sceneIndex: i,
        totalScenes: scenes.length,
        previousScenes: scenes.slice(0, i)
      };

      try {
        const result = await this.extendScene(scene.content, scene.continuationType, context);
        results.push({
          ...result,
          sceneId: scene.id,
          sceneIndex: i
        });
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          sceneId: scene.id,
          sceneIndex: i
        });
      }
    }

    return results;
  }

  // Batch optimization for multiple prompts
  async optimizeMultiplePrompts(prompts, sharedSettings = {}) {
    const results = [];
    
    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      
      try {
        const result = await this.optimizePrompt(
          prompt.content, 
          prompt.optimizationMode, 
          { ...sharedSettings, ...prompt.userPreferences }
        );
        results.push({
          ...result,
          promptId: prompt.id,
          promptIndex: i
        });
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          promptId: prompt.id,
          promptIndex: i
        });
      }
    }

    return results;
  }

  // Error handling for scene extension
  handleSceneExtensionError(error, originalScene, continuationType) {
    if (error instanceof APIError) {
      if (error.status === 401) {
        return {
          success: false,
          error: 'Invalid API key. Please check your OpenAI API key in settings.',
          fallback: null
        };
      } else if (error.status === 429) {
        return {
          success: false,
          error: 'Rate limit exceeded. Please wait a moment before trying again.',
          fallback: null
        };
      } else if (error.status === 500) {
        return {
          success: false,
          error: 'OpenAI service is temporarily unavailable. Please try again later.',
          fallback: this.generateFallbackExtension(originalScene, continuationType)
        };
      }
    }

    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      fallback: this.generateFallbackExtension(originalScene, continuationType)
    };
  }

  // Error handling for optimization
  handleOptimizationError(error, originalPrompt, optimizationMode) {
    if (error instanceof APIError) {
      if (error.status === 401) {
        return {
          success: false,
          error: 'Invalid API key. Please check your OpenAI API key in settings.',
          fallback: null
        };
      } else if (error.status === 429) {
        return {
          success: false,
          error: 'Rate limit exceeded. Please wait a moment before trying again.',
          fallback: null
        };
      }
    }

    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      fallback: this.generateFallbackOptimization(originalPrompt, optimizationMode)
    };
  }

  // Fallback scene generation when API fails
  generateFallbackExtension(originalScene, continuationType) {
    const fallbackExtensions = {
      logical: {
        continuation_type: 'logical',
        narrative_connection: 'Automatic fallback continuation',
        ai_message: 'This is a fallback scene generated when AI service was unavailable.'
      },
      twist: {
        continuation_type: 'twist',
        twist_type: 'unexpected_element',
        ai_message: 'This is a fallback scene generated when AI service was unavailable.'
      },
      genreShift: {
        continuation_type: 'genre_shift',
        original_genre: 'unknown',
        target_genre: 'enhanced',
        ai_message: 'This is a fallback scene generated when AI service was unavailable.'
      }
    };

    return {
      ...originalScene,
      ...fallbackExtensions[continuationType] || fallbackExtensions.logical
    };
  }

  // Fallback optimization when API fails
  generateFallbackOptimization(originalPrompt, optimizationMode) {
    const basicEnhancements = {
      optimization_type: optimizationMode,
      optimization_notes: 'Basic fallback optimization applied when AI service was unavailable.',
      ai_message: 'This is a fallback optimization generated when AI service was unavailable.'
    };

    return {
      ...originalPrompt,
      ...basicEnhancements
    };
  }

  // Get appropriate temperature for different continuation types
  getTemperatureForContinuationType(type) {
    const temperatures = {
      logical: 0.5,        // More deterministic for logical progression
      twist: 0.9,          // Higher creativity for unexpected twists
      genreShift: 0.8,     // High creativity for genre changes
      characterDevelopment: 0.6, // Moderate creativity for character work
      flashback: 0.7,      // Creative but grounded in character history
      timeSkip: 0.6,       // Moderate creativity for consequence exploration
      alternateReality: 0.9, // High creativity for parallel possibilities
      environmentalEscalation: 0.8 // Creative environmental storytelling
    };
    
    return temperatures[type] || 0.7;
  }

  // Get appropriate temperature for optimization modes
  getTemperatureForOptimizationMode(mode) {
    const temperatures = {
      visualSpectacle: 0.8,     // Creative visual enhancements
      emotionalResonance: 0.7,  // Balanced creativity for emotional depth
      platformSpecific: 0.5,    // More deterministic for platform requirements
      narrativeCohesion: 0.6,    // Moderate creativity for story logic
      technicalExcellence: 0.4   // Low creativity for technical precision
    };
    
    return temperatures[mode] || 0.6;
  }

  // Utility function to clean JSON responses that may be wrapped in markdown
  cleanJsonResponse(content) {
    if (!content || typeof content !== 'string') {
      throw new Error('Invalid response content');
    }

    // Remove leading/trailing whitespace
    let cleaned = content.trim();

    // Check for markdown code blocks and extract JSON
    const codeBlockPatterns = [
      /```json\s*([\s\S]*?)\s*```/i,  // ```json ... ```
      /```\s*([\s\S]*?)\s*```/i,      // ``` ... ```
      /`([\s\S]*?)`/i                 // `...` (single backticks)
    ];

    for (const pattern of codeBlockPatterns) {
      const match = cleaned.match(pattern);
      if (match && match[1]) {
        cleaned = match[1].trim();
        break;
      }
    }

    // Additional cleaning - remove any remaining markdown artifacts
    cleaned = cleaned
      .replace(/^```json/i, '')
      .replace(/^```/i, '')
      .replace(/```$/i, '')
      .trim();

    // Validate that we have something that looks like JSON
    if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
      throw new Error('Response does not contain valid JSON structure');
    }

    return cleaned;
  }

  // Image Analysis API - Analyze image and extract JSON fields
  async analyzeImage(imageBase64) {
    try {
      await this.enforceRateLimit();

      // Extract base64 data without data URL prefix
      const base64Data = imageBase64.includes(',') 
        ? imageBase64.split(',')[1] 
        : imageBase64;

      const systemPrompt = `You are an elite visual analysis AI specialized in extracting extremely detailed, recreatable descriptions from images for video/image generation prompts.

Your mission: Provide the level of detail needed to recreate these exact characters and scenes, not generic descriptions.

ANALYSIS METHODOLOGY:
1. IDENTIFY each subject/character and their specific type
2. EXTRACT character-specific details using the appropriate detailed fields
3. CAPTURE distinguishing features that make each subject unique
4. DESCRIBE technical and environmental elements with precision

CHARACTER TYPE ANALYSIS GUIDE:

**HUMAN CHARACTERS**: Extract gender, age_range, ethnicity, body_type, hair_color, hair_style, eye_color, skin_tone, distinguishing_features, clothing details

**ROBOTS**: Focus on robot_style (humanoid android, mechanical robot, steampunk robot, battle mech, etc.), robot_material (metallic chrome, matte black, carbon fiber, rusted metal, steampunk brass, etc.), specific mechanical features, condition, unique markings

**ANIMALS/CREATURES**: For mythical creatures like griffins, use animal_species, animal_color, plus detailed physical descriptions including:
- Size relative to environment  
- Specific body parts (wing patterns, fur/feather colors, facial features)
- Distinguishing marks or unique characteristics
- Proportions and build

**FANTASY/MYTHICAL**: Use creature_type with mythical_species (griffin, dragon, phoenix, etc.), mythical_size, detailed appearance including coat patterns, wing details, facial characteristics

DETAIL EXTRACTION REQUIREMENTS:
- Be SPECIFIC: Instead of "robot" → "steampunk robot with brass plating and Victorian-era pressure gauges"
- Include VISUAL SPECIFICS: Colors, patterns, textures, conditions, proportions
- Note UNIQUE FEATURES: Scars, markings, wear patterns, modifications, decorative elements
- Describe INTERACTIONS: How subjects relate to each other and objects

FIELD MAPPING (use these exact field names):
- scene: Overall scene description with specific details
- character_type: human, robot, animal, creature, etc.
- secondary_subjects: Additional characters (comma-separated)
- actions: Specific actions being performed
- robot_style: For robots - humanoid android, mechanical robot, steampunk robot, etc.
- robot_material: For robots - metallic chrome, matte black, steampunk brass, etc.
- animal_species: For animals - griffin, dragon, domestic cat, etc.
- animal_color: Specific colors and patterns
- creature_type: mythical, fantasy, supernatural
- mythical_species: griffin, dragon, phoenix, unicorn, etc.
- clothing: Detailed clothing descriptions
- setting: Specific environment type
- time_of_day: Lighting conditions
- lighting_type: Quality and direction of light
- camera_angle, camera_distance: Technical composition
- distinguishing_features: Scars, markings, unique characteristics
- emotions: Facial expressions and mood

CRITICAL RULES:
- Return ONLY pure JSON, no markdown formatting
- BE EXTREMELY SPECIFIC in descriptions
- Include enough detail for accurate recreation
- Use confidence 0.8+ for clear visual elements
- Use confidence 0.6-0.8 for probable elements  
- Use confidence 0.5-0.6 for possible elements
- Focus on RECREATABLE details, not generic categories

JSON FORMAT:
{
  "fields": {
    "field_name": {
      "value": "extremely detailed, specific description",
      "confidence": 0.85,
      "reasoning": "specific visual evidence observed"
    }
  },
  "overall_analysis": "Detailed 2-3 sentence summary focusing on what makes this scene unique and recreatable"
}`;

      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this image with extreme attention to detail. Focus on extracting specific, recreatable characteristics of each subject. For robots: note exact style, materials, mechanical details, and condition. For creatures like griffins: describe size, proportions, coloring patterns, wing details, and distinguishing features. For all subjects: capture what makes them unique and visually distinct.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Data}`,
                detail: 'high'
              }
            }
          ]
        }
      ];

      const response = await this.makeRequest(messages, {
        model: 'gpt-4o', // Use GPT-4o for vision capabilities
        temperature: 0.2, // Lower temperature for more consistent, detailed analysis
        maxTokens: 2500, // Increased for detailed character descriptions
        timeout: 90000 // Override default timeout for image analysis (90 seconds instead of 30)
      });

      // Clean the response content to handle markdown formatting
      let cleanedContent;
      try {
        cleanedContent = this.cleanJsonResponse(response.content);
      } catch (cleanError) {
        console.error('JSON cleaning error:', cleanError);
        console.error('Raw response:', response.content);
        throw new Error(`Failed to extract JSON from AI response: ${cleanError.message}`);
      }

      // Parse the cleaned JSON
      let result;
      try {
        result = JSON.parse(cleanedContent);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Cleaned content:', cleanedContent);
        console.error('Raw response:', response.content);
        throw new Error(`AI returned invalid JSON format. Please try again.`);
      }

      // Validate the response structure
      if (!result || typeof result !== 'object') {
        throw new Error('AI response is not a valid object');
      }

      // Validate and enhance field data
      const validatedFields = {};
      const fieldStats = { high: 0, medium: 0, low: 0, total: 0 };

      if (result.fields && typeof result.fields === 'object') {
        Object.entries(result.fields).forEach(([fieldKey, fieldData]) => {
          if (fieldData && typeof fieldData === 'object' && fieldData.value) {
            // Ensure confidence is a number
            const confidence = typeof fieldData.confidence === 'number' 
              ? fieldData.confidence 
              : 0.7; // Default confidence if not provided
            
            // Only include fields with reasonable confidence
            if (confidence >= 0.5) {
              validatedFields[fieldKey] = {
                value: fieldData.value,
                confidence: Math.min(Math.max(confidence, 0), 1), // Clamp between 0 and 1
                reasoning: fieldData.reasoning || 'Visual analysis detected this feature'
              };

              // Track confidence statistics
              fieldStats.total++;
              if (confidence >= 0.8) fieldStats.high++;
              else if (confidence >= 0.6) fieldStats.medium++;
              else fieldStats.low++;
            }
          }
        });
      }

      return {
        success: true,
        fields: validatedFields,
        analysis: result.overall_analysis || result.analysis || 'Image analyzed successfully',
        usage: response.usage,
        stats: {
          totalFields: fieldStats.total,
          highConfidence: fieldStats.high,
          mediumConfidence: fieldStats.medium,
          lowConfidence: fieldStats.low
        }
      };

    } catch (error) {
      console.error('Image analysis error:', error);
      
      // Handle specific API errors
      if (error.message.includes('API key')) {
        return {
          success: false,
          error: 'OpenAI API key is required for image analysis. Please set your API key in settings.',
          fields: {}
        };
      } else if (error.message.includes('rate limit')) {
        return {
          success: false,
          error: 'Rate limit exceeded. Please wait a moment before analyzing another image.',
          fields: {}
        };
      } else if (error.message.includes('model')) {
        return {
          success: false,
          error: 'Image analysis requires GPT-4o model access. Please check your API key permissions.',
          fields: {}
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to analyze image. Please try again.',
        fields: {}
      };
    }
  }

  // Health check for API connectivity
  async healthCheck() {
    try {
      const messages = [
        {
          role: 'user',
          content: 'Please respond with just the word "healthy" to confirm API connectivity.'
        }
      ];

      const response = await this.makeRequest(messages, {
        maxTokens: 10,
        temperature: 0
      });

      return {
        healthy: response.content.toLowerCase().includes('healthy'),
        responseTime: Date.now() - this.lastRequestTime,
        model: response.model
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    }
  }
}

// Custom error class for API-specific errors
class APIError extends Error {
  constructor(status, message, type, isLastAttempt = false) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.type = type;
    this.isLastAttempt = isLastAttempt;
  }

  shouldNotRetry() {
    // Don't retry on authentication, permission, or client errors
    return this.status === 401 || this.status === 403 || this.status === 400;
  }
}

// Create and export singleton instance
const aiApiService = new AIApiService();
export default aiApiService;

// Export class for testing or multiple instances
export { AIApiService, APIError };