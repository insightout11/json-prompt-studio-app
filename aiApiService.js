// Hybrid Groq + OpenAI API Service for JSON Prompt Studio
// Comprehensive error handling, retry logic, and fallback systems

import { buildPrompt } from './aiSystemPrompts.js';

class AIApiService {
  constructor() {
    this.groqApiKey = null;
    this.openaiApiKey = null;
    this.groqBaseURL = 'https://api.groq.com/openai/v1/chat/completions';
    this.openaiBaseURL = 'https://api.openai.com/v1/chat/completions';
    this.maxRetries = 3;
    this.retryDelay = 1000; // ms
    this.timeout = 30000; // 30 seconds
    this.rateLimitDelay = 2000; // ms between requests
    this.lastRequestTime = 0;
    
    // Initialize API keys from environment or localStorage
    this.initializeApiKeys();
  }

  initializeApiKeys(envVars = null) {
    // Try to get API keys from provided environment variables or import.meta.env
    let groqFromEnv, openaiFromEnv;
    
    if (envVars) {
      // Use provided environment variables (passed from component that has access)
      groqFromEnv = envVars.VITE_GROQ_API_KEY;
      openaiFromEnv = envVars.VITE_OPENAI_API_KEY;
    } else {
      // Fallback to import.meta.env (might be undefined in some contexts)
      groqFromEnv = import.meta?.env?.VITE_GROQ_API_KEY;
      openaiFromEnv = import.meta?.env?.VITE_OPENAI_API_KEY;
    }
    
    this.groqApiKey = groqFromEnv || null;
    this.openaiApiKey = openaiFromEnv || null;
    
    // If not in environment, try localStorage (for user-provided keys)
    if (typeof window !== 'undefined') {
      if (!this.groqApiKey) {
        this.groqApiKey = localStorage.getItem('groq_api_key');
      }
      if (!this.openaiApiKey) {
        this.openaiApiKey = localStorage.getItem('openai_api_key');
      }
    }
    
    // Development logging
    if (import.meta?.env?.DEV) {
      console.log('🔑 API Keys initialized:', {
        groq: !!this.groqApiKey,
        openai: !!this.openaiApiKey
      });
    }
  }

  setGroqApiKey(key) {
    this.groqApiKey = key;
    if (typeof window !== 'undefined') {
      localStorage.setItem('groq_api_key', key);
    }
  }

  setOpenaiApiKey(key) {
    this.openaiApiKey = key;
    if (typeof window !== 'undefined') {
      localStorage.setItem('openai_api_key', key);
    }
  }

  // Legacy method for backward compatibility
  setApiKey(key) {
    this.setGroqApiKey(key);
  }

  getGroqApiKey() {
    return this.groqApiKey;
  }

  getOpenaiApiKey() {
    return this.openaiApiKey;
  }

  // Legacy method for backward compatibility  
  getApiKey() {
    return this.groqApiKey || this.openaiApiKey;
  }

  hasGroqApiKey() {
    return !!this.groqApiKey;
  }

  hasOpenaiApiKey() {
    return !!this.openaiApiKey;
  }

  // Legacy method for backward compatibility
  hasApiKey() {
    return this.hasGroqApiKey() || this.hasOpenaiApiKey();
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

  // Helper function to clean and parse JSON responses
  parseJsonResponse(content) {
    try {
      // Clean the response to extract JSON
      let cleanedResponse = content.trim();
      
      // Remove markdown code blocks if present
      cleanedResponse = cleanedResponse.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '');
      cleanedResponse = cleanedResponse.replace(/```\s*/gi, '');
      
      // Find JSON object boundaries
      const jsonStart = cleanedResponse.indexOf('{');
      const jsonEnd = cleanedResponse.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
      }
      
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Original content:', content);
      throw new Error('AI returned invalid JSON format. Please try again.');
    }
  }

  // Core API request with comprehensive error handling - supports both Groq and OpenAI
  async makeRequest(messages, options = {}) {
    // Determine which provider to use
    const useOpenAI = options.forceOpenAI || options.model?.includes('gpt-');
    const provider = useOpenAI ? 'openai' : 'groq';
    
    // Enhanced debug logging for testing
    if (import.meta?.env?.DEV) {
      console.log(`🤖 AI Provider: ${provider.toUpperCase()}`);
      console.log(`📝 Request: ${messages[0]?.content?.substring(0, 100)}...`);
      console.log(`⚙️ Options:`, { 
        model: options.model, 
        forceOpenAI: options.forceOpenAI,
        temperature: options.temperature 
      });
    }
    
    // Check if we have the required API key
    if (useOpenAI && !this.hasOpenaiApiKey()) {
      throw new Error('OpenAI API key is required for this operation. Please set your OpenAI API key in settings.');
    }
    if (!useOpenAI && !this.hasGroqApiKey()) {
      throw new Error('Groq API key is required. Please set your Groq API key in settings.');
    }

    await this.enforceRateLimit();

    // Select appropriate model and API details
    const baseURL = useOpenAI ? this.openaiBaseURL : this.groqBaseURL;
    const apiKey = useOpenAI ? this.openaiApiKey : this.groqApiKey;
    const defaultModel = useOpenAI ? 'gpt-4o-mini' : 'gemma2-9b-it';

    const requestPayload = {
      model: options.model || defaultModel,
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
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestPayload),
      signal: AbortSignal.timeout(options.timeout || this.timeout)
    };

    let lastError;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        if (import.meta?.env?.DEV) console.log(`${provider.toUpperCase()} API Request attempt ${attempt}/${this.maxRetries}`);
        
        const response = await fetch(baseURL, requestOptions);
        
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
          throw new Error(`Invalid response format from ${provider.toUpperCase()} API`);
        }

        // Success logging
        if (import.meta?.env?.DEV) {
          console.log(`✅ ${provider.toUpperCase()} Success:`, {
            model: data.model,
            usage: data.usage,
            responseLength: data.choices[0].message.content.length
          });
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
        maxTokens: 2500,
        timeout: 90000 // 90 seconds for complex scene extensions
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
        maxTokens: 1500,
        timeout: 90000 // 90 seconds for scene extensions
      });

      const result = this.parseJsonResponse(response.content);
      
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
        maxTokens: 2500,
        timeout: 90000 // 90 seconds for generating multiple scene options
      });

      const result = this.parseJsonResponse(response.content);
      
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

      const character = this.parseJsonResponse(response.content);
      
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

      const character = this.parseJsonResponse(response.content);
      
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

      const world = this.parseJsonResponse(response.content);
      
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
  async generateStyleSuggestion(currentScene) {
    try {
      const systemPrompt = `You are an expert cinematographer and film style consultant. Analyze the provided scene and generate intelligent style recommendations that would enhance the visual storytelling.

Current Scene Context:
${JSON.stringify(currentScene, null, 2)}

Based on the scene's content, mood, genre, and setting, suggest appropriate:
- Cinematography style and techniques
- Color palette and lighting approach
- Camera movement and framing
- Overall visual mood and atmosphere
- Specific technical recommendations

Return your response in this EXACT JSON format:
{
  "cinematography_style": "specific cinematography approach and techniques",
  "color_palette": "recommended color scheme and palette",
  "lighting_approach": "lighting style and setup recommendations", 
  "camera_movement": "recommended camera movements and techniques",
  "visual_mood": "overall visual atmosphere and tone",
  "framing_style": "shot composition and framing approach",
  "technical_notes": "specific equipment or technique suggestions"
}

Focus on practical, actionable recommendations that match the scene's narrative needs.`;

      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Analyze this scene and provide smart cinematographic style suggestions that would enhance the visual storytelling.`
        }
      ];

      const response = await this.makeRequest(messages, {
        forceOpenAI: true, // Style suggestions work better with OpenAI
        model: 'gpt-4o-mini',
        temperature: 0.7,
        maxTokens: 1500
      });
      
      // Parse the JSON response
      const styleData = this.parseJsonResponse(response.content);
      
      return {
        success: true,
        style: styleData
      };
    } catch (error) {
      console.error('Style suggestion generation error:', error);
      return {
        success: false,
        error: 'Failed to generate style suggestions. Please try again.'
      };
    }
  }

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

      const storyboard = this.parseJsonResponse(response.content);
      
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
          error: 'Invalid API key. Please check your API keys in settings.',
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
          error: 'AI service is temporarily unavailable. Please try again later.',
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
          error: 'Invalid API key. Please check your API keys in settings.',
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

    // First, try to extract from markdown code blocks
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

    // If we still don't have JSON, try to extract JSON objects from anywhere in the text
    if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
      // Try to find JSON objects anywhere in the response
      const jsonObjectPatterns = [
        /\{[\s\S]*?\}/,  // Find first complete JSON object
        /\[[\s\S]*?\]/   // Find first complete JSON array
      ];

      for (const pattern of jsonObjectPatterns) {
        const match = cleaned.match(pattern);
        if (match && match[0]) {
          // Try to parse it to make sure it's valid
          try {
            JSON.parse(match[0]);
            cleaned = match[0];
            break;
          } catch (e) {
            // Continue to next pattern if this doesn't parse
            continue;
          }
        }
      }
    }

    // More aggressive JSON extraction - find the largest JSON-like structure
    if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
      // Look for balanced braces starting with {
      const braceMatch = this.extractBalancedJson(cleaned, '{', '}');
      if (braceMatch) {
        try {
          JSON.parse(braceMatch);
          cleaned = braceMatch;
        } catch (e) {
          // Continue with bracket extraction
          const bracketMatch = this.extractBalancedJson(cleaned, '[', ']');
          if (bracketMatch) {
            try {
              JSON.parse(bracketMatch);
              cleaned = bracketMatch;
            } catch (e) {
              // Last resort - just take what we have and let it fail downstream
            }
          }
        }
      }
    }

    // Final validation that we have something that looks like JSON
    if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
      throw new Error('Response does not contain valid JSON structure');
    }

    return cleaned;
  }

  // Helper function to extract balanced JSON (handles nested braces/brackets)
  extractBalancedJson(text, openChar, closeChar) {
    const startIndex = text.indexOf(openChar);
    if (startIndex === -1) return null;

    let count = 0;
    let inString = false;
    let escaped = false;

    for (let i = startIndex; i < text.length; i++) {
      const char = text[i];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === openChar) {
          count++;
        } else if (char === closeChar) {
          count--;
          if (count === 0) {
            return text.substring(startIndex, i + 1);
          }
        }
      }
    }

    return null;
  }

  // Image Analysis API - Analyze image and extract JSON fields
  async analyzeImage(imageBase64) {
    try {
      await this.enforceRateLimit();

      // Extract base64 data without data URL prefix
      const base64Data = imageBase64.includes(',') 
        ? imageBase64.split(',')[1] 
        : imageBase64;

      const systemPrompt = `You are an expert visual scene analysis AI specialized in creating detailed video generation prompts from images. Your focus is on describing scenes, environments, objects, and artistic elements for creative video production.

Your mission: Analyze the visual elements, composition, setting, objects, colors, lighting, and artistic style to create comprehensive video generation parameters.

ANALYSIS FOCUS AREAS:
1. SCENE COMPOSITION: Overall layout, framing, visual elements
2. ENVIRONMENT: Setting, location, background elements
3. OBJECTS & ITEMS: Visible objects, props, decorative elements  
4. VISUAL STYLE: Art style, color palette, lighting, mood
5. TECHNICAL ASPECTS: Camera angle, composition, visual effects

SCENE ANALYSIS GUIDE:

**SETTINGS & ENVIRONMENTS**: Describe specific locations (indoor/outdoor, architectural style, natural environments, fantasy realms, sci-fi settings, time period indicators)

**OBJECTS & PROPS**: Focus on visible items, furniture, vehicles, equipment, decorative elements, clothing styles, accessories (avoid personal identification)

**ARTISTIC ELEMENTS**: Color schemes, lighting conditions, artistic style (realistic, animated, painted, photographic), visual effects, textures, materials

**COMPOSITION**: Camera angles, framing, depth of field, focal points, visual hierarchy, symmetry/asymmetry

**MOOD & ATMOSPHERE**: Overall feeling, time of day, weather conditions, lighting quality (dramatic, soft, harsh, colorful, monochrome)

DETAIL EXTRACTION REQUIREMENTS:
- Be SPECIFIC: Instead of "robot" → "steampunk robot with brass plating and Victorian-era pressure gauges"
- Include VISUAL SPECIFICS: Colors, patterns, textures, conditions, proportions
- Note UNIQUE FEATURES: Scars, markings, wear patterns, modifications, decorative elements
- Describe INTERACTIONS: How subjects relate to each other and objects

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
- camera_distance: Distance from subject (extreme close-up, medium, wide, etc.)
- mood: Overall atmosphere and feeling of the scene
- composition: Visual arrangement and framing
- texture: Materials and surface qualities visible
- movement: Any implied motion or dynamic elements
- background: Background elements and details
- foreground: Foreground elements and details

CRITICAL RULES:
- RETURN ONLY VALID JSON - NO EXPLANATORY TEXT BEFORE OR AFTER
- DO NOT include any markdown formatting, backticks, or code blocks
- DO NOT add any commentary, explanations, or text outside the JSON object
- START your response immediately with { and END with }
- FOCUS ON VISUAL ELEMENTS: scenes, objects, settings, not personal identification
- If people are present, describe only general scene elements, clothing styles, and environmental context
- BE EXTREMELY SPECIFIC in descriptions
- Include enough detail for accurate recreation
- Use confidence 0.8+ for clear visual elements
- Use confidence 0.6-0.8 for probable elements  
- Use confidence 0.5-0.6 for possible elements
- Focus on RECREATABLE details, not generic categories

RESPONSE MUST BE PURE JSON ONLY - EXAMPLE:
{"fields":{"scene":{"value":"...","confidence":0.9,"reasoning":"..."}},"overall_analysis":"..."}

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
        forceOpenAI: true, // Force OpenAI for image analysis
        temperature: 0.2, // Lower temperature for more consistent, detailed analysis
        maxTokens: 2500, // Increased for detailed character descriptions
        timeout: 90000 // Override default timeout for image analysis (90 seconds instead of 30)
      });

      // Check for safety refusal responses
      const safetyRefusalPatterns = [
        /I'm sorry, I can't help with identifying or analyzing people/i,
        /I can't identify or describe people/i,
        /I'm not able to identify individuals/i,
        /I cannot provide information about people/i,
        /I'm unable to analyze or identify people/i
      ];

      const isSafetyRefusal = safetyRefusalPatterns.some(pattern => 
        pattern.test(response.content)
      );

      if (isSafetyRefusal) {
        console.log('🚫 Image Analysis - Safety refusal detected, providing generic scene analysis');
        // Return a generic but valid JSON response for scenes with people
        const fallbackResponse = {
          fields: {
            scene: {
              value: "Scene contains human subjects in an indoor/outdoor setting with visible environmental elements",
              confidence: 0.7,
              reasoning: "Image contains people, focusing on general scene description due to safety guidelines"
            },
            setting: {
              value: "General scene setting with human subjects present",
              confidence: 0.8,
              reasoning: "Can observe general environmental context"
            },
            objects: {
              value: "Various objects and environmental elements visible in scene",
              confidence: 0.6,
              reasoning: "Objects can be observed around human subjects"
            },
            lighting_type: {
              value: "Standard lighting conditions",
              confidence: 0.7,
              reasoning: "General lighting assessment possible"
            },
            camera_angle: {
              value: "Standard camera perspective",
              confidence: 0.8,
              reasoning: "Image framing and composition observable"
            }
          },
          overall_analysis: "Image contains human subjects. Analysis focused on general scene elements and environmental context due to safety guidelines. For more detailed analysis, try using images without people."
        };
        return fallbackResponse;
      }

      // Clean the response content to handle markdown formatting
      let cleanedContent;
      try {
        console.log('🖼️ Image Analysis - Raw AI Response:', response.content.substring(0, 500) + '...');
        cleanedContent = this.cleanJsonResponse(response.content);
        console.log('🧹 Image Analysis - Cleaned Content:', cleanedContent.substring(0, 300) + '...');
      } catch (cleanError) {
        console.error('❌ Image Analysis - JSON cleaning error:', cleanError.message);
        console.error('📄 Image Analysis - Full raw response:', response.content);
        console.error('🔍 Image Analysis - Response length:', response.content.length);
        console.error('🔍 Image Analysis - Response starts with:', response.content.substring(0, 100));
        throw new Error(`Failed to extract JSON from AI response: ${cleanError.message}`);
      }

      // Parse the cleaned JSON
      let result;
      try {
        result = JSON.parse(cleanedContent);
        console.log('✅ Image Analysis - Successfully parsed JSON');
      } catch (parseError) {
        console.error('❌ Image Analysis - JSON parsing error:', parseError.message);
        console.error('🧹 Image Analysis - Cleaned content that failed to parse:', cleanedContent);
        console.error('📄 Image Analysis - Original raw response:', response.content);
        console.error('🔍 Image Analysis - Cleaned content length:', cleanedContent.length);
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

  // Category-specific AI suggestions with user seed ideas
  async generateCategorySuggestions(categoryKey, currentScene = {}, userSeedIdea = '', isProgressive = false) {
    try {
      if (!this.hasApiKey()) {
        throw new Error('API key required for category suggestions');
      }

      const categoryPrompts = {
        characters: {
          systemPrompt: `You are an expert character designer for video content. Generate compelling character suggestions that would work well in video scenes.`,
          fieldMap: {
            character: ['user input preserved as main character description'],
            character_type: ['person', 'animal', 'robot', 'fantasy creature', 'stylized character'],
            age: ['child (5-12)', 'teenager (13-19)', 'young adult (20-35)', 'middle-aged (36-55)', 'elderly (55+)'],
            gender: ['male', 'female', 'non-binary'],
            hair_color: ['brown', 'blonde', 'black', 'red', 'gray', 'white', 'unusual color'],
            hair_style: ['short', 'medium', 'long', 'curly', 'straight', 'wavy', 'braided'],
            clothing: ['casual', 'formal', 'business', 'athletic', 'vintage', 'futuristic', 'cultural'],
            emotions: ['happy', 'serious', 'contemplative', 'excited', 'mysterious', 'confident']
          }
        },
        actions: {
          systemPrompt: `You are an expert in video storytelling and action direction. Suggest compelling actions and movements for video scenes.`,
          fieldMap: {
            actions: ['user input preserved as main action description'],
            emotions: ['joyful', 'determined', 'peaceful', 'energetic', 'focused', 'playful'],
            dialogue: ['friendly conversation', 'important announcement', 'quiet reflection', 'animated discussion'],
            performance_style: ['natural', 'theatrical', 'subtle', 'expressive', 'comedic', 'dramatic']
          }
        },
        settings: {
          systemPrompt: `You are an expert location scout and set designer. Suggest visually compelling settings for video content.`,
          fieldMap: {
            setting: ['user input preserved as main setting description'],
            time_of_day: ['golden hour', 'blue hour', 'midday', 'night', 'dawn', 'dusk'],
            weather: ['sunny', 'partly cloudy', 'overcast', 'light rain', 'dramatic clouds'],
            environment: ['indoor', 'outdoor', 'mixed indoor/outdoor'],
            lighting_type: ['natural light', 'artificial light', 'mixed lighting', 'dramatic lighting']
          }
        },
        style: {
          systemPrompt: `You are a cinematographer and visual style expert. Suggest camera angles, lighting, and visual styles for compelling video content.`,
          fieldMap: {
            style: ['user input preserved as main style description'],
            camera_angle: ['eye level', 'low angle', 'high angle', 'dutch angle', 'over shoulder'],
            camera_distance: ['close-up', 'medium shot', 'wide shot', 'establishing shot'],
            lighting_type: ['soft natural', 'dramatic side', 'rim lighting', 'golden hour', 'blue hour'],
            color_palette: ['warm tones', 'cool tones', 'monochromatic', 'high contrast', 'muted colors']
          }
        },
        audio: {
          systemPrompt: `You are an audio designer and music supervisor. Suggest audio elements that enhance video storytelling.`,
          fieldMap: {
            audio: ['user input preserved as main audio description'],
            ambient_sound: ['city ambiance', 'nature sounds', 'indoor atmosphere', 'quiet background'],
            music_style: ['subtle instrumental', 'upbeat', 'emotional', 'minimal', 'cinematic'],
            sound_effects: ['subtle', 'realistic', 'enhanced', 'minimal'],
            audio_mood: ['uplifting', 'contemplative', 'energetic', 'peaceful', 'inspiring']
          }
        }
      };

      const categoryConfig = categoryPrompts[categoryKey];
      if (!categoryConfig) {
        throw new Error(`Unknown category: ${categoryKey}`);
      }

      // Build context from current scene
      const sceneContext = currentScene.field_values ? 
        Object.entries(currentScene.field_values)
          .filter(([key, value]) => value && value.trim() !== '')
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ') : 'No current scene context';

      // Determine if this is expansion or generation
      const isExpansion = userSeedIdea && userSeedIdea.trim().length > 0;
      
      // Check if this is a progressive expansion (existing fields have content)
      const existingFields = currentScene.field_values || {};
      const hasExistingContent = Object.keys(existingFields).some(key => 
        categoryConfig.fieldMap[key] && existingFields[key] && existingFields[key].trim() !== ''
      );
      
      const userPrompt = isExpansion 
        ? (isProgressive && hasExistingContent 
          ? `Given the current scene context: ${sceneContext}

PROGRESSIVE EXPANSION: Enhance existing ${categoryKey} details with more depth and specificity.

Original input: "${userSeedIdea.trim()}"

Current field values to enhance:
${Object.entries(existingFields)
  .filter(([key, value]) => categoryConfig.fieldMap[key] && value && value.trim() !== '')
  .map(([key, value]) => `- ${key}: "${value}"`)
  .join('\n')}

INSTRUCTIONS:
1. Keep all existing content but make it MORE detailed and specific
2. Add new complementary fields that weren't filled before  
3. Preserve the original concept "${userSeedIdea.trim()}" in the primary field
4. Focus on adding layers of detail, specificity, and richness

Available fields to enhance or add:
${Object.entries(categoryConfig.fieldMap).map(([field, options]) => {
  const primaryFieldNames = ['character', 'actions', 'setting', 'style', 'audio'];
  const currentValue = existingFields[field];
  if (primaryFieldNames.includes(field)) {
    return `- ${field}: ${currentValue ? `Enhance "${currentValue}" with more detail` : `MUST be exactly "${userSeedIdea.trim()}"`}`;
  }
  return `- ${field}: ${currentValue ? `Enhance "${currentValue}" with more specificity` : `(choose from: ${options.join(', ')} or suggest similar)`}`;
}).join('\n')}

Return enhanced JSON with richer, more detailed descriptions. Don't remove existing content - build upon it.`
          : `Given the current scene context: ${sceneContext}

Expand this ${categoryKey} idea: "${userSeedIdea.trim()}"

CRITICAL INSTRUCTION: You must preserve the user's exact input "${userSeedIdea.trim()}" as the primary field value. Do not change or interpret it - use it exactly as provided.

Then add complementary details that enhance and describe this specific concept.

Respond with a JSON object containing field suggestions. Use these available fields:
${Object.entries(categoryConfig.fieldMap).map(([field, options]) => {
  const primaryFieldNames = ['character', 'actions', 'setting', 'style', 'audio'];
  if (primaryFieldNames.includes(field)) {
    return `- ${field}: MUST be exactly "${userSeedIdea.trim()}" (preserve user input exactly)`;
  }
  return `- ${field}: (choose from: ${options.join(', ')} or suggest similar that fits "${userSeedIdea.trim()}")`;
}).join('\n')}

Example: If user says "scarecrow", the primary field should be "scarecrow" and other fields should describe scarecrow-specific attributes (straw hair, burlap clothing, etc.).

Focus on expanding "${userSeedIdea.trim()}" while preserving it as the core value. Return only the JSON object, no explanation.`)
        : `Given the current scene context: ${sceneContext}

Please suggest appropriate values for a ${categoryKey} category that would complement the existing scene elements. 

Respond with a JSON object containing field suggestions. Use these available fields and choose values that work well together:
${Object.entries(categoryConfig.fieldMap).map(([field, options]) => 
  `- ${field}: (choose from: ${options.join(', ')} or suggest similar)`
).join('\n')}

Focus on creating cohesive suggestions that enhance the overall scene. Return only the JSON object, no explanation.`;

      const messages = [
        { role: 'system', content: categoryConfig.systemPrompt },
        { role: 'user', content: userPrompt }
      ];

      const response = await this.makeRequest(messages, {
        maxTokens: 500,
        temperature: 0.7
      });

      // Parse JSON response
      let suggestions = {};
      try {
        suggestions = this.parseJsonResponse(response.content);
      } catch (parseError) {
        // If JSON parsing fails, try to extract reasonable defaults
        console.warn('Failed to parse AI suggestions, using defaults');
        const fieldMap = categoryConfig.fieldMap;
        const keys = Object.keys(fieldMap);
        keys.slice(0, 3).forEach(key => {
          suggestions[key] = fieldMap[key][Math.floor(Math.random() * fieldMap[key].length)];
        });
      }

      return {
        success: true,
        category: categoryKey,
        suggestions,
        isExpansion,
        originalIdea: userSeedIdea.trim(),
        model: response.model
      };

    } catch (error) {
      console.error(`Category suggestion error for ${categoryKey}:`, error);
      return {
        success: false,
        error: error.message,
        category: categoryKey
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