// Hybrid Groq + OpenAI API Service for JSON Prompt Studio
// Comprehensive error handling, retry logic, and fallback systems

import { buildPrompt } from './aiSystemPrompts.js';

class AIApiService {
  constructor() {
    // API keys are now handled server-side
    this.groqApiKey = null;
    this.openaiApiKey = null;
    this.maxRetries = 3;
    this.retryDelay = 1000; // ms
    this.timeout = 30000; // 30 seconds
    this.rateLimitDelay = 2000; // ms between requests
    this.lastRequestTime = 0;
    
    // Keep for backward compatibility, but server handles API keys
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
    return true; // Server handles Groq API key
  }

  hasOpenaiApiKey() {
    return true; // Server handles OpenAI API key
  }

  // Legacy method for backward compatibility - always return true for server-side mode
  hasApiKey() {
    return true; // Server handles API keys, so always available
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

  // Simple but effective JSON repair for common AI response issues
  simpleJsonRepair(jsonString) {
    
    let repaired = jsonString
      // Convert common measurement patterns to avoid quote issues
      .replace(/(\d)'(\d+)"/g, '$1 feet $2 inches')
      .replace(/(\d)'(\d)"/g, '$1 foot $2 inches') // singular foot
      // Fix common quote patterns in descriptions
      .replace(/:\s*"([^"]*?)(\d)'(\d+)"([^"]*?)"/g, ': "$1$2 feet $3 inches$4"')
      // More aggressive quote fixing within string values
      .replace(/:\s*"([^"]*?)"([^",:}]*?)"([^"]*?)"/g, (match, start, middle, end) => {
        // This handles cases where there are unescaped quotes in the middle of strings
        const escaped = middle.replace(/"/g, '\\"');
        return `: "${start}\\"${escaped}\\"${end}"`;
      })
      // Fix trailing commas and other common issues
      .replace(/,(\s*[}\]])/g, '$1')
      // Handle incomplete JSON strings
      .replace(/:\s*"([^"]*?)$/g, ': "$1"')
      // Ensure proper closing
      .replace(/([^}])\s*$/, '$1}');
    
    try {
      JSON.parse(repaired);
      return repaired;
    } catch (e) {
      return jsonString;
    }
  }

  // Helper function to clean and parse JSON responses
  // Robust JSON repair function using state machine parsing
  repairJsonQuotes(jsonString) {
    
    try {
      // First try a simple parse to see if it's already valid
      JSON.parse(jsonString);
      return jsonString;
    } catch (e) {
      // JSON needs repair
    }
    
    let result = '';
    let inString = false;
    let inProperty = false;
    let braceDepth = 0;
    let i = 0;
    
    while (i < jsonString.length) {
      const char = jsonString[i];
      const nextChar = jsonString[i + 1];
      const prevChar = i > 0 ? jsonString[i - 1] : '';
      
      if (char === '"' && prevChar !== '\\') {
        if (!inString) {
          // Starting a string
          inString = true;
          // Check if this is a property name (followed by colon after closing quote)
          let lookahead = i + 1;
          let foundClosingQuote = false;
          while (lookahead < jsonString.length && !foundClosingQuote) {
            if (jsonString[lookahead] === '"' && jsonString[lookahead - 1] !== '\\') {
              foundClosingQuote = true;
              // Check what comes after the closing quote
              let afterQuote = lookahead + 1;
              while (afterQuote < jsonString.length && /\s/.test(jsonString[afterQuote])) {
                afterQuote++;
              }
              inProperty = jsonString[afterQuote] === ':';
              break;
            }
            lookahead++;
          }
          result += char;
        } else {
          // Ending a string
          inString = false;
          inProperty = false;
          result += char;
        }
      } else if (inString && !inProperty) {
        // Inside a string value (not property name) - escape problematic characters
        if (char === '"') {
          result += '\\"'; // Escape unescaped quote
        } else if (char === "'" && (nextChar === '"' || /\d/.test(nextChar))) {
          result += "\\'"; // Escape quotes in measurements like 5'8"
        } else {
          result += char;
        }
      } else {
        // Outside string or in property name - keep as is
        if (char === '{') braceDepth++;
        else if (char === '}') braceDepth--;
        result += char;
      }
      
      i++;
    }
    
    try {
      JSON.parse(result);
      return result;
    } catch (e) {
      
      // Fallback: enhanced pattern-based escape approach
      let fallback = jsonString
        // First, handle common measurement patterns
        .replace(/(\d)'(\d+)"/g, '$1 feet $2 inches')  // Convert measurements to safer text
        .replace(/(\w+)'s\s/g, '$1\'s ')  // Fix possessives
        // Handle quotes within string values (not property names)
        .replace(/"([^"]*)"(\s*:\s*"[^"]*)"([^"]*?)"/g, (match, prop, middle, content) => {
          // This is a property with quoted content - escape internal quotes
          const escapedContent = content.replace(/"/g, '\\"');
          return `"${prop}"${middle}${escapedContent}"`;
        })
        // More aggressive quote fixing for content within JSON string values
        .replace(/:\s*"([^"]*)"([^",}\]]*)"([^"]*?)"/g, (match, start, middle, end) => {
          // Handle quotes in the middle of string values
          return `: "${start}\\"${middle}\\"${end}"`;
        });
      
      try {
        JSON.parse(fallback);
        return fallback;
      } catch (e2) {
        return jsonString; // Return original if all repairs fail
      }
    }
  }

  parseJsonResponse(content) {
    try {
      
      // Clean the response to extract JSON
      let cleanedResponse = content.trim();
      
      // Remove markdown code blocks if present - more aggressive
      cleanedResponse = cleanedResponse.replace(/```json\s*/gi, '');
      cleanedResponse = cleanedResponse.replace(/```\s*$/gi, ''); 
      cleanedResponse = cleanedResponse.replace(/```[\s\S]*$/gi, ''); // Remove any trailing markdown
      cleanedResponse = cleanedResponse.replace(/^[\s\S]*?```json\s*/gi, ''); // Remove leading content before ```json
      
      // Remove any leading explanatory text before the JSON
      const jsonPatterns = [
        /.*?(\{[\s\S]*\})/,  // Find everything from first { to last }
        /.*?(\[[\s\S]*\])/   // Or from first [ to last ]
      ];
      
      for (const pattern of jsonPatterns) {
        const match = cleanedResponse.match(pattern);
        if (match && match[1]) {
          cleanedResponse = match[1];
          break;
        }
      }
      
      // Find JSON object boundaries as fallback - with balance checking
      const jsonStart = cleanedResponse.indexOf('{');
      if (jsonStart !== -1) {
        let braceCount = 0;
        let jsonEnd = -1;
        
        for (let i = jsonStart; i < cleanedResponse.length; i++) {
          if (cleanedResponse[i] === '{') {
            braceCount++;
          } else if (cleanedResponse[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
              jsonEnd = i;
              break;
            }
          }
        }
        
        if (jsonEnd !== -1) {
          cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
        } else {
          // Fallback to simple last brace if balance check fails
          const lastBrace = cleanedResponse.lastIndexOf('}');
          if (lastBrace > jsonStart) {
            cleanedResponse = cleanedResponse.substring(jsonStart, lastBrace + 1);
          }
        }
      }
      
      // Additional cleaning for common AI response issues
      cleanedResponse = cleanedResponse
        .replace(/^\s*Here's the.*?:\s*/i, '') // Remove "Here's the JSON:" type text
        .replace(/^\s*```.*?\n/g, '') // Remove any remaining code block markers
        .replace(/\n```\s*$/g, '') // Remove trailing code block markers
        .trim();
      
      
      // Try simple repair first, then comprehensive repair if needed
      let repairedResponse = this.simpleJsonRepair(cleanedResponse);
      
      // If simple repair failed, try comprehensive repair
      if (repairedResponse === cleanedResponse) {
        repairedResponse = this.repairJsonQuotes(cleanedResponse);
      }
      
      const result = JSON.parse(repairedResponse);
      return result;
      
    } catch (parseError) {
      console.error('❌ JSON parsing error:', parseError.message);
      
      // Try multiple desperate attempts to find valid JSON
      const desperatePatterns = [
        /\{[\s\S]*"formFields"[\s\S]*\}/, // Original pattern for form data
        /\{[\s\S]*"results"[\s\S]*"options"[\s\S]*\}/, // Pattern for related generator
        /\{[\s\S]*"options"[\s\S]*\}/, // Pattern for simple options
        /\{[\s\S]*\}/ // Any JSON object
      ];
      
      for (let i = 0; i < desperatePatterns.length; i++) {
        let candidateJson = '';
        try {
          const desperateMatch = content.match(desperatePatterns[i]);
          if (desperateMatch) {
            candidateJson = desperateMatch[0];
            
            // Try simple repair first, then comprehensive repair if needed
            candidateJson = this.simpleJsonRepair(candidateJson);
            
            // If simple repair didn't work, try comprehensive repair
            if (candidateJson === desperateMatch[0]) {
              candidateJson = this.repairJsonQuotes(candidateJson);
            }
            
            // Fix incomplete JSON by attempting to close it properly
            if (!candidateJson.trim().endsWith('}')) {
              // Count open vs closed braces
              const openBraces = (candidateJson.match(/\{/g) || []).length;
              const closeBraces = (candidateJson.match(/\}/g) || []).length;
              const missingBraces = openBraces - closeBraces;
              
              if (missingBraces > 0) {
                candidateJson += '}'.repeat(missingBraces);
              }
            }
            
            const desperateResult = JSON.parse(candidateJson);
            return desperateResult;
          }
        } catch (desperateError) {
          continue; // Try next pattern
        }
      }
      
      throw new Error('AI returned invalid JSON format. Raw response: ' + content.substring(0, 500) + '...');
    }
  }

  // Core API request with comprehensive error handling - supports both Groq and OpenAI
  async makeRequest(messages, options = {}) {
    // Determine which provider to use
    const useOpenAI = options.forceOpenAI || options.model?.includes('gpt-');
    const provider = useOpenAI ? 'openai' : 'groq';
    

    await this.enforceRateLimit();

    // Use deployed server endpoints instead of direct API calls
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseURL = isLocal 
      ? '/api/ai'
      : 'https://jsonpromptstudio.com/api/ai';
    const defaultModel = useOpenAI ? 'gpt-4o-mini' : 'llama-3.1-8b-instant';

    const requestPayload = {
      provider: useOpenAI ? 'openai' : 'groq',
      model: options.model || defaultModel,
      messages: messages,
      max_tokens: options.maxTokens || 2000,
      temperature: options.temperature || 0.7,
      // Only include advanced parameters if they have non-default values
      ...(options.topP && options.topP !== 1 && { top_p: options.topP }),
      ...(options.frequencyPenalty && options.frequencyPenalty !== 0 && { frequency_penalty: options.frequencyPenalty }),
      ...(options.presencePenalty && options.presencePenalty !== 0 && { presence_penalty: options.presencePenalty }),
      // Include seed if provided for consistency
      ...(options.seed && { seed: options.seed }),
      ...options.additionalParams
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestPayload),
      signal: AbortSignal.timeout(options.timeout || this.timeout)
    };

    let lastError;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        
        const response = await fetch(baseURL, requestOptions);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new APIError(
            response.status,
            errorData.error || `HTTP ${response.status}`,
            errorData.details,
            attempt === this.maxRetries // isLastAttempt
          );
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error(`Invalid response format from ${provider.toUpperCase()} API`);
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
        maxTokens: 4000, // Increased for more detailed scene descriptions with 8B model
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
  async extendSceneSimple(originalScene, extensionType, consistencyOptions = {}) {
    try {
      // Wait for rate limiting
      await this.enforceRateLimit();
      
      const prompt = this.buildSimpleExtensionPrompt(originalScene, extensionType, consistencyOptions);
      
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

      // Extract consistency parameters
      const requestOptions = {
        temperature: consistencyOptions.creativity?.temperature || 0.7,
        maxTokens: 1500,
        timeout: 90000, // 90 seconds for scene extensions
        ...(consistencyOptions.seed && { seed: consistencyOptions.seed })
      };

      const response = await this.makeRequest(messages, requestOptions);

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
  async generateSceneOptions(originalScene, count = 5, consistencyOptions = {}) {
    try {
      // Wait for rate limiting
      await this.enforceRateLimit();
      
      const prompt = this.build5OptionsPrompt(originalScene, count, consistencyOptions);
      
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

      // Extract consistency parameters
      const requestOptions = {
        temperature: consistencyOptions.creativity?.temperature || 0.8,
        maxTokens: 4000, // Increased for more detailed scene options with 8B model
        timeout: 90000, // 90 seconds for generating multiple scene options
        ...(consistencyOptions.seed && { seed: consistencyOptions.seed })
      };

      const response = await this.makeRequest(messages, requestOptions);

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
  build5OptionsPrompt(originalScene, count, consistencyOptions = {}) {
    let consistencyInstructions = '';
    
    if (consistencyOptions.lock_identity) {
      consistencyInstructions += '\n- PRESERVE character identity and appearance exactly as described in ALL options';
    }
    
    if (consistencyOptions.lock_style) {
      consistencyInstructions += '\n- MAINTAIN the exact visual style, mood, and aesthetic from the original scene in ALL options';
    }
    
    if (consistencyOptions.palette && consistencyOptions.palette.length > 0) {
      consistencyInstructions += `\n- USE ONLY these brand colors in ALL options: ${consistencyOptions.palette.join(', ')}`;
    }
    
    if (consistencyOptions.negative && consistencyOptions.negative.length > 0) {
      consistencyInstructions += `\n- AVOID these elements in ALL options: ${consistencyOptions.negative.join(', ')}`;
    }

    return `You are a creative AI assistant that generates multiple scene continuation options for video scenes.

Your task is to create ${count} DIFFERENT and DISTINCT scene extensions from the given JSON scene.
${consistencyInstructions}

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

  // Build simple extension prompts (updated with consistency support)
  buildSimpleExtensionPrompt(originalScene, extensionType, consistencyOptions = {}) {
    let consistencyInstructions = '';
    
    if (consistencyOptions.lock_identity) {
      consistencyInstructions += '\n- PRESERVE character identity and appearance exactly as described in the original scene';
    }
    
    if (consistencyOptions.lock_style) {
      consistencyInstructions += '\n- MAINTAIN the exact visual style, mood, and aesthetic from the original scene';
    }
    
    if (consistencyOptions.palette && consistencyOptions.palette.length > 0) {
      consistencyInstructions += `\n- USE ONLY these brand colors: ${consistencyOptions.palette.join(', ')}`;
    }
    
    if (consistencyOptions.negative && consistencyOptions.negative.length > 0) {
      consistencyInstructions += `\n- AVOID these elements: ${consistencyOptions.negative.join(', ')}`;
    }

    const basePrompt = `You are a creative AI assistant that helps extend video scene descriptions. 

Your task is to take a JSON scene description and extend it with a ${extensionType}.
${consistencyInstructions}

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

  // Style Suggestion Generation API
  async generateStyleSuggestion(currentScene) {
    try {
      console.log('🎬 Style Generation Request - Input Scene:', currentScene);
      
      // Create a concise scene summary for better AI processing
      const sceneText = typeof currentScene === 'string' ? currentScene :
        currentScene.scene || currentScene.description || 
        JSON.stringify(currentScene, null, 2);

      console.log('🎬 Processed Scene Text:', sceneText);

      const systemPrompt = `You are an expert cinematographer. Analyze this scene and provide cinematographic style suggestions.

SCENE TO ANALYZE: "${sceneText}"

RESPOND WITH ONLY THIS JSON FORMAT (no explanation, no markdown):
{
  "visual_style": "overall cinematic approach and genre style",
  "lighting": "lighting setup and mood recommendations",
  "camera_work": "shot types, angles, and movement suggestions",
  "color_mood": "color palette and visual tone"
}

EXAMPLE:
{
  "visual_style": "Film noir with high contrast shadows",
  "lighting": "Low-key dramatic lighting with venetian blind patterns",
  "camera_work": "Dutch angles, close-ups, static shots",
  "color_mood": "Monochromatic with stark black and white contrasts"
}`;

      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: 'Provide cinematographic style suggestions for this scene.'
        }
      ];

      console.log('🎬 AI Request Configuration:', {
        model: 'gpt-4o',
        temperature: 0.3,
        maxTokens: 800
      });

      const response = await this.makeRequest(messages, {
        // Use Groq by default (user's existing API key)
        model: 'llama-3.1-8b-instant', // Good Groq model for structured output
        temperature: 0.3, // Lower temperature for consistent JSON
        maxTokens: 800    // Reduced tokens for focused response
      });
      
      console.log('🎬 Raw AI Response:', response.content);
      console.log('🎬 Response length:', response.content.length);
      
      // Enhanced JSON parsing with detailed logging
      let styleData;
      try {
        styleData = this.parseJsonResponse(response.content);
        console.log('🎬 Parsed Style Data:', styleData);
        
        // Validate that we got the expected structure
        const requiredFields = ['visual_style', 'lighting', 'camera_work', 'color_mood'];
        const missingFields = requiredFields.filter(field => !styleData[field]);
        
        if (missingFields.length > 0) {
          console.warn('🎬 Missing fields in response:', missingFields);
          // Fill in missing fields with defaults
          missingFields.forEach(field => {
            styleData[field] = 'Style recommendation not available';
          });
        }
        
      } catch (parseError) {
        console.error('🎬 JSON Parsing Failed:', parseError);
        console.error('🎬 Raw content that failed:', response.content);
        
        // Provide fallback style suggestions
        styleData = {
          visual_style: 'Cinematic storytelling with dramatic composition',
          lighting: 'Natural lighting with controlled shadows',
          camera_work: 'Medium shots with smooth camera movements',
          color_mood: 'Balanced color palette with emotional warmth'
        };
        console.log('🎬 Using fallback style data:', styleData);
      }
      
      return {
        success: true,
        style: styleData
      };
      
    } catch (error) {
      console.error('🎬 Style Generation Error:', error);
      console.error('🎬 Error stack:', error.stack);
      
      return {
        success: false,
        error: `Style generation failed: ${error.message || 'Unknown error'}. Check console for details.`
      };
    }
  }

  async generateStoryboard(currentScene, sceneCount, narrativeStructure, contextData = {}) {
    try {
      // Build context section if available
      let contextSection = '';
      if (Object.keys(contextData).length > 0) {
        contextSection = '\n\nADDITIONAL CONTEXT FROM BUILDERS:\n';
        if (contextData.character) {
          contextSection += `\nCharacter Context:\n${JSON.stringify(contextData.character, null, 2)}`;
        }
        if (contextData.world) {
          contextSection += `\nWorld Context:\n${JSON.stringify(contextData.world, null, 2)}`;
        }
        if (contextData.style) {
          contextSection += `\nStyle Context:\n${JSON.stringify(contextData.style, null, 2)}`;
        }
        contextSection += '\n\nUSE THIS CONTEXT to create more cohesive, detailed scenes that align with the established character, world, and style elements.';
      }

      const systemPrompt = `You are an expert storyboard creator and narrative designer. Create a compelling ${sceneCount}-scene sequence using ${narrativeStructure} structure, building from the provided starting scene.

Starting Scene:
${JSON.stringify(currentScene, null, 2)}${contextSection}

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

  // Progressive scene-by-scene generation with per-scene configuration
  async generateProgressiveScene(currentSceneData, sceneNumber, totalScenes, narrativeStructure, sceneConfig, contextData = {}, previousScenes = []) {
    try {
      // Build context section if available
      let contextSection = '';
      if (Object.keys(contextData).length > 0) {
        contextSection = '\n\nADDITIONAL CONTEXT FROM BUILDERS:\n';
        if (contextData.character) {
          contextSection += `\nCharacter Context:\n${JSON.stringify(contextData.character, null, 2)}`;
        }
        if (contextData.world) {
          contextSection += `\nWorld Context:\n${JSON.stringify(contextData.world, null, 2)}`;
        }
        if (contextData.style) {
          contextSection += `\nStyle Context:\n${JSON.stringify(contextData.style, null, 2)}`;
        }
        contextSection += '\n\nUSE THIS CONTEXT to create more cohesive, detailed scenes that align with the established character, world, and style elements.';
      }

      // Build previous scenes context
      let previousScenesSection = '';
      if (previousScenes.length > 0) {
        previousScenesSection = '\n\nPREVIOUS SCENES:\n';
        previousScenes.forEach((scene, index) => {
          previousScenesSection += `\nScene ${index + 1}:\n${JSON.stringify(scene.sceneData || scene, null, 2)}`;
        });
        previousScenesSection += '\n\nENSURE CONTINUITY and narrative flow from these previous scenes.';
      }

      const systemPrompt = `You are an expert scene creator and narrative designer. Generate Scene ${sceneNumber} of ${totalScenes} using ${narrativeStructure} structure.

Current Scene Data (starting point):
${JSON.stringify(currentSceneData, null, 2)}${contextSection}${previousScenesSection}

SCENE ${sceneNumber} CONFIGURATION:
- Tone: ${sceneConfig.tone}
- Event Type: ${sceneConfig.eventType} 
- Location: ${sceneConfig.location}

Create Scene ${sceneNumber} that:
1. Follows naturally from the current scene
2. Matches the specified tone (${sceneConfig.tone})
3. Contains the specified event type (${sceneConfig.eventType})
4. Uses the specified location approach (${sceneConfig.location})
5. Fits the ${narrativeStructure} narrative structure position for scene ${sceneNumber} of ${totalScenes}

Return your response in this EXACT JSON format:
{
  "title": "Scene ${sceneNumber} title",
  "position": "opening|development|climax|resolution|transition",
  "description": "Detailed scene description for video production",
  "context": "How this scene connects to the overall story",
  "sceneData": {
    "scene": "Complete scene description",
    "setting": "Location/environment details",
    "character_action": "What characters are doing",
    "mood": "Emotional tone matching ${sceneConfig.tone}",
    "camera_work": "Suggested camera angles/movements",
    "lighting": "Lighting suggestions",
    "pacing": "Scene rhythm and timing",
    "tone": "${sceneConfig.tone}",
    "event_type": "${sceneConfig.eventType}",
    "location_type": "${sceneConfig.location}"
  }
}

Make the scene visually distinct, emotionally engaging, and suitable for video production.`;

      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Generate Scene ${sceneNumber} with ${sceneConfig.tone} tone, ${sceneConfig.eventType} event, and ${sceneConfig.location} location.`
        }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.8,
        maxTokens: 2000
      });

      const scene = this.parseJsonResponse(response.content);
      
      return {
        success: true,
        scene: scene,
        title: scene.title,
        usage: response.usage
      };

    } catch (error) {
      console.error('Progressive scene generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate scene',
        scene: null
      };
    }
  }

  // Progressive storyboard question generation - following same pattern as character/world
  async generateProgressiveStoryboardQuestion({ originalDescription, currentTopic, stepNumber, totalSteps, previousResponses, builderContexts = {}, currentJson = {} }) {
    try {
      await this.enforceRateLimit();

      // Build context from previous responses
      const responseContext = Object.entries(previousResponses)
        .map(([topic, response]) => topic + ': "' + (response.selectedOption.title || response.selectedOption) + '"')
        .join('\n');

      // Build builder context section if available
      let builderContextSection = '';
      if (Object.keys(builderContexts).length > 0) {
        builderContextSection = '\n\nAVAILABLE BUILDER CONTEXTS:\n';
        if (builderContexts.character) {
          builderContextSection += `Character: ${JSON.stringify(builderContexts.character.data, null, 2)}\n`;
        }
        if (builderContexts.world) {
          builderContextSection += `World: ${JSON.stringify(builderContexts.world.data, null, 2)}\n`;
        }
        if (builderContexts.style) {
          builderContextSection += `Style: ${JSON.stringify(builderContexts.style.data, null, 2)}\n`;
        }
        builderContextSection += '\nUSE THESE CONTEXTS to make questions more specific and relevant to the established elements.\n';
      }

      let systemPrompt = 'You are an expert storyboard development AI that creates contextual follow-up questions to build rich, detailed storyboards progressively. This is for a VIDEO PROMPT GENERATOR, so focus heavily on visual storytelling and cinematic elements.\n\n';
      systemPrompt += 'CURRENT TASK: Generate a targeted question about "' + currentTopic.name + '" for storyboard development.\n\n';
      systemPrompt += 'ORIGINAL STORY CONCEPT: "' + originalDescription + '"\n\n';
      systemPrompt += 'PREVIOUS RESPONSES:\n';
      systemPrompt += (responseContext || 'None yet - this is the first question') + '\n\n';
      systemPrompt += builderContextSection;
      systemPrompt += '\nCONTEXT:\n';
      systemPrompt += '- This is question ' + stepNumber + ' of ' + totalSteps + ' total questions\n';
      systemPrompt += '- Topic focus: ' + currentTopic.name + ' - ' + currentTopic.description + '\n';
      systemPrompt += '- Build upon the original concept and previous responses\n';
      systemPrompt += '- Make this question feel natural and conversational\n';
      systemPrompt += '- STORYBOARD-FIRST APPROACH: Questions should focus on visual narrative structure\n';
      systemPrompt += '- Questions 1-2 establish premise and protagonist journey\n';
      systemPrompt += '- Questions 3-4 define structure and key scenes\n';
      systemPrompt += '- Questions 5-6 refine tone, style, and production details\n\n';
      systemPrompt += 'RESPONSE FORMAT (JSON only, no markdown):\n';
      systemPrompt += '{\n';
      systemPrompt += '  "question": "A natural, conversational question that builds on previous responses",\n';
      systemPrompt += '  "options": [\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 1 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    },\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 2 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    },\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 3 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    },\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 4 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    },\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 5 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    },\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 6 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    }\n';
      systemPrompt += '  ]\n';
      systemPrompt += '}\n\n';
      systemPrompt += 'Make the question highly relevant to storyboard creation and visual storytelling. Ensure options are distinct and meaningful for video production.';

      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Generate question ${stepNumber} about "${currentTopic.name}" for my storyboard.`
        }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.8,
        maxTokens: 1000
      });

      const result = this.parseJsonResponse(response.content);
      
      return {
        success: true,
        question: result.question,
        options: result.options,
        usage: response.usage
      };

    } catch (error) {
      console.error('Progressive storyboard question generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate storyboard question',
        question: null,
        options: []
      };
    }
  }

  // Generate final storyboard from all responses
  async generateFinalStoryboardFromResponses({ originalDescription, responses, builderContexts = {}, currentJson = {} }) {
    try {
      await this.enforceRateLimit();

      // Build response summary
      const responseSummary = Object.entries(responses)
        .map(([topic, response]) => `${response.topic}: ${response.selectedOption.title || response.selectedOption}`)
        .join('\n');

      // Build builder context section if available
      let builderContextSection = '';
      if (Object.keys(builderContexts).length > 0) {
        builderContextSection = '\n\nBUILDER CONTEXTS TO INTEGRATE:\n';
        if (builderContexts.character) {
          builderContextSection += `Character: ${JSON.stringify(builderContexts.character.data, null, 2)}\n`;
        }
        if (builderContexts.world) {
          builderContextSection += `World: ${JSON.stringify(builderContexts.world.data, null, 2)}\n`;
        }
        if (builderContexts.style) {
          builderContextSection += `Style: ${JSON.stringify(builderContexts.style.data, null, 2)}\n`;
        }
        builderContextSection += '\nINTEGRATE these elements into the storyboard to create cohesive narrative.\n';
      }

      const systemPrompt = `You are an expert storyboard creator specializing in commercial video production. Generate a comprehensive multi-scene storyboard that tells a complete story with professional production specifications.

ORIGINAL STORY CONCEPT: "${originalDescription}"

USER RESPONSES:
${responseSummary}
${builderContextSection}

Create a detailed storyboard that breaks down into individual scenes, each production-ready with specific timing, camera work, and visual consistency. Focus on:
- Complete scene-by-scene breakdown (aim for 3-7 scenes based on concept)
- Professional camera specifications and movements
- Exact timing for commercial/video production
- Visual consistency across all scenes
- Character continuity and emotional progression
- Commercial pacing and narrative flow

Return your response in this EXACT JSON format:
{
  "title": "Compelling storyboard title",
  "description": "Brief overview of the complete storyboard",
  "scenes": [
    {
      "scene_number": 1,
      "title": "Descriptive scene title",
      "description": "Detailed scene description with specific actions and dialogue",
      "setting": "Specific location and environment details",
      "characters": "Characters present, their positions, actions, and expressions",
      "mood": "Emotional tone and atmosphere",
      "camera_work": "Specific camera angle, movement, and framing (e.g., 'Wide shot, 24mm lens, slow dolly in')",
      "duration_seconds": 4.5,
      "lighting": "Lighting setup and mood",
      "key_visual_elements": ["Specific visual element 1", "Key prop or detail 2", "Important color or texture 3"],
      "transitions": "How this scene transitions to the next",
      "formFields": {
        "scene": "Complete scene description for JSON prompt generation",
        "setting": "Detailed setting for this specific scene",
        "character": "Character details and actions in this scene",
        "mood": "Scene-specific mood",
        "style": "Visual style for this scene",
        "camera_lens_mm": 24,
        "camera_move": "dolly_in",
        "camera_speed": "slow",
        "duration_s": 4.5,
        "actions": "Specific character actions",
        "emotions": "Character emotions in this scene"
      }
    }
  ],
  "overall_tone": "Overall mood and visual style",
  "total_duration": "Exact total duration in seconds",
  "production_notes": "Important notes for maintaining consistency across scenes",
  "consistency_guide": {
    "character_identity": "Key details to maintain character consistency",
    "visual_style": "Style elements to keep consistent",
    "color_palette": "Primary colors to use throughout",
    "lighting_style": "Lighting approach for all scenes"
  },
  "formFields": {
    "scene": "Overview description combining all scenes",
    "setting": "Primary setting",
    "character": "Main character details",
    "mood": "Overall mood",
    "style": "Visual style notes",
    "storyboard_title": "Storyboard title",
    "scene_count": "Number of scenes",
    "aspect_ratio": "16:9"
  }
}

CRITICAL: Generate 3-7 detailed scenes based on the concept. Each scene must have complete formFields for individual JSON prompt generation. Ensure scenes flow together as a cohesive narrative with proper pacing for the target duration.`;

      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Create my complete storyboard based on these specifications.`
        }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.7,
        maxTokens: 3000
      });

      const storyboard = this.parseJsonResponse(response.content);
      
      return {
        success: true,
        storyboard: storyboard,
        usage: response.usage
      };

    } catch (error) {
      console.error('Final storyboard generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate final storyboard',
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

  // Get appropriate temperature for different continuation types (optimized for 8B model)
  getTemperatureForContinuationType(type) {
    const temperatures = {
      logical: 0.7,        // Increased for more detailed logical progression with 8B model
      twist: 0.9,          // High creativity for unexpected twists
      genreShift: 0.8,     // High creativity for genre changes
      characterDevelopment: 0.8, // Increased creativity for character work and detail
      flashback: 0.7,      // Creative but grounded in character history
      timeSkip: 0.7,       // Increased creativity for consequence exploration
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

  // Progressive Character Question Generation API
  async generateProgressiveCharacterQuestion({ originalDescription, currentTopic, stepNumber, totalSteps, previousResponses }) {
    try {
      await this.enforceRateLimit();

      // Build context from previous responses
      const responseContext = Object.entries(previousResponses)
        .map(([topic, response]) => topic + ': "' + (response.selectedOption.title || response.selectedOption) + '"')
        .join('\n');

      let systemPrompt = 'You are an expert character development AI that creates contextual follow-up questions to build rich, detailed characters progressively. This is for a VIDEO PROMPT GENERATOR, so focus heavily on visual and observable elements.\n\n';
      systemPrompt += 'CURRENT TASK: Generate a targeted question about "' + currentTopic.name + '" for character development.\n\n';
      systemPrompt += 'ORIGINAL CHARACTER CONCEPT: "' + originalDescription + '"\n\n';
      systemPrompt += 'PREVIOUS RESPONSES:\n';
      systemPrompt += (responseContext || 'None yet - this is the first question') + '\n\n';
      systemPrompt += 'CONTEXT:\n';
      systemPrompt += '- This is question ' + stepNumber + ' of ' + totalSteps + ' total questions\n';
      systemPrompt += '- Topic focus: ' + currentTopic.name + ' - ' + currentTopic.description + '\n';
      systemPrompt += '- Build upon the original concept and previous responses\n';
      systemPrompt += '- Make this question feel natural and conversational\n';
      systemPrompt += '- VISUAL-FIRST APPROACH: Questions 1-3 should focus on what you can see on screen\n';
      systemPrompt += '- Questions 4-5 add behavioral elements (movement, voice)\n';
      systemPrompt += '- Question 6 is for deeper psychological background\n\n';
      systemPrompt += 'RESPONSE FORMAT (JSON only, no markdown):\n';
      systemPrompt += '{\n';
      systemPrompt += '  "question": "A natural, conversational question that builds on previous responses",\n';
      systemPrompt += '  "options": [\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 1 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    },\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 2 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    },\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 3 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    },\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 4 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    },\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 5 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    },\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 6 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    }\n';
      systemPrompt += '  ]\n';
      systemPrompt += '}\n\n';
      systemPrompt += 'GUIDELINES:\n';
      systemPrompt += '- Question should be conversational and build naturally from previous responses\n';
      systemPrompt += '- Provide exactly 6 distinct options that offer meaningful character development choices\n';
      systemPrompt += '- Each option should be specific and evocative, not generic\n';
      systemPrompt += '- Options should feel like natural extensions of the character concept\n';
      systemPrompt += '- Focus on the specific topic: ' + currentTopic.name + '\n';
      systemPrompt += '- Make options feel like genuine character choices, not multiple choice test answers\n\n';
      systemPrompt += 'TOPIC-SPECIFIC FOCUS:\n';
      systemPrompt += '- Physical Traits: Age range, gender, ethnicity, body type, height - foundation elements\n';
      systemPrompt += '- Facial Features: Face shape, eyes, hair, expression, facial hair - what you see up close\n';
      systemPrompt += '- Clothing & Style: Fashion sense, colors, accessories, overall aesthetic - visual presentation\n';
      systemPrompt += '- Movement & Presence: Posture, gestures, energy level, confidence - how they carry themselves\n';
      systemPrompt += '- Voice & Communication: Tone, accent, speaking style, vocabulary - how they sound\n';
      systemPrompt += '- Background & Depth: History, motivations, psychology - deeper character elements';

      const messages = [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: 'Generate a ' + currentTopic.name.toLowerCase() + ' question for this character. Make it feel natural and build on what we know so far.'
        }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.8, // Higher creativity for diverse options
        maxTokens: 1200,
        timeout: 60000 // 60 seconds for question generation
      });

      const result = this.parseJsonResponse(response.content);
      
      // Validate the response structure
      if (!result.question || !result.options || !Array.isArray(result.options) || result.options.length !== 6) {
        throw new Error('Invalid response format from AI service');
      }

      return {
        success: true,
        question: result.question,
        options: result.options,
        topic: currentTopic.name,
        stepNumber,
        usage: response.usage
      };

    } catch (error) {
      console.error('Progressive character question generation error:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to generate character question',
        question: '',
        options: []
      };
    }
  }

  // Generate Final Character from Progressive Responses
  async generateFinalCharacterFromResponses({ originalDescription, responses }) {
    try {
      await this.enforceRateLimit();

      // Build comprehensive response summary
      const responsesSummary = Object.entries(responses)
        .map(([topic, response]) => {
          return `${response.topic}: ${response.selectedOption.title || response.selectedOption}${
            response.selectedOption.description ? ` - ${response.selectedOption.description}` : ''
          }`;
        })
        .join('\n');

      const responseCount = Object.keys(responses).length;
      let systemPrompt = `Create a video-ready character from the concept and responses below.

ORIGINAL: "${originalDescription}"
RESPONSES (${responseCount}/6):
${responsesSummary}

PRIORITIZE: Visual details (appearance, clothing, movement) over psychology. Fill gaps logically.

JSON FORMAT:
{
  "name": "Full name",
  "summary": "2-3 sentence overview",
  "appearance": "Detailed physical description",
  "personality": "Key personality traits",
  "background": "Brief backstory",
  "uniqueTraits": "Distinctive characteristics",
  "formFields": {
    "character": "Primary description",
    "character_type": "person/animal/robot/etc",
    "age": "Age or range",
    "gender": "Gender",
    "clothing": "Clothing details",
    "emotions": "Primary emotions",
    "actions": "Typical actions",
    "character_motivation": "Core motivation",
    "visual_style": "Visual aesthetic"
  }
}`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: 'Synthesize these responses into a complete, cohesive character.' 
        }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.7, // Balanced creativity for synthesis
        maxTokens: 3000, // Increased from 2000 to prevent JSON truncation
        timeout: 90000 // 90 seconds for character synthesis
      });

      const result = this.parseJsonResponse(response.content);
      
      // Validate required fields
      if (!result.name || !result.summary || !result.formFields) {
        throw new Error('Invalid character response format');
      }

      return {
        success: true,
        character: result,
        usage: response.usage
      };

    } catch (error) {
      console.error('Final character generation error:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to generate final character',
        character: null
      };
    }
  }

  // Category-specific AI suggestions with user seed ideas
  async generateCategorySuggestions(categoryKey, currentScene = {}, userSeedIdea = '', isProgressive = false) {
    try {
      // Server-side API handling - no client-side API key validation needed

      const categoryPrompts = {
        characters: {
          systemPrompt: `You are an expert character designer for video content. Generate compelling character suggestions that would work well in video scenes.`,
          fieldMap: {
            characters: ['elegant person with expressive features and thoughtful demeanor'],
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
            actions: ['graceful movements with purposeful energy and natural flow'],
            emotions: ['joyful', 'determined', 'peaceful', 'energetic', 'focused', 'playful'],
            dialogue: ['friendly conversation', 'important announcement', 'quiet reflection', 'animated discussion'],
            performance_style: ['natural', 'theatrical', 'subtle', 'expressive', 'comedic', 'dramatic']
          }
        },
        settings: {
          systemPrompt: `You are an expert location scout and set designer. Suggest visually compelling settings for video content.`,
          fieldMap: {
            setting: ['atmospheric environment with compelling visual elements'],
            time_of_day: ['golden hour', 'blue hour', 'midday', 'night', 'dawn', 'dusk'],
            weather: ['sunny', 'partly cloudy', 'overcast', 'light rain', 'dramatic clouds'],
            environment: ['indoor', 'outdoor', 'mixed indoor/outdoor'],
            lighting_type: ['natural light', 'artificial light', 'mixed lighting', 'dramatic lighting']
          }
        },
        style: {
          systemPrompt: `You are a cinematographer and visual style expert. Suggest camera angles, lighting, and visual styles for compelling video content.`,
          fieldMap: {
            style: ['cinematic visual approach with artistic composition and mood'],
            camera_angle: ['eye level', 'low angle', 'high angle', 'dutch angle', 'over shoulder'],
            camera_distance: ['close-up', 'medium shot', 'wide shot', 'establishing shot'],
            lighting_type: ['soft natural', 'dramatic side', 'rim lighting', 'golden hour', 'blue hour'],
            color_palette: ['warm tones', 'cool tones', 'monochromatic', 'high contrast', 'muted colors']
          }
        },
        audio: {
          systemPrompt: `You are an audio designer and music supervisor. Suggest audio elements that enhance video storytelling.`,
          fieldMap: {
            ambient_sound: ['layered atmospheric audio with complementary background sounds'],
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
      const isGenericEnhancement = userSeedIdea && userSeedIdea.includes('enhance existing details');
      
      // Check if this is a progressive expansion (existing fields have content)
      const existingFields = currentScene.field_values || {};
      const hasExistingContent = Object.keys(existingFields).some(key => 
        categoryConfig.fieldMap[key] && existingFields[key] && existingFields[key].trim() !== ''
      );
      
      let userPrompt;
      if (isExpansion) {
        if ((isProgressive && hasExistingContent) || isGenericEnhancement) {
          // Build current fields description
          const currentFieldsDesc = Object.entries(existingFields)
            .filter(([key, value]) => categoryConfig.fieldMap[key] && value && value.trim() !== '')
            .map(([key, value]) => '- ' + key + ': "' + value + '"')
            .join('\n');
          
          // Build available fields description
          const availableFieldsDesc = Object.entries(categoryConfig.fieldMap).map(([field, options]) => {
            const primaryFieldNames = ['characters', 'actions', 'setting', 'style', 'audio'];
            const currentValue = existingFields[field];
            if (primaryFieldNames.includes(field)) {
              return '- ' + field + ': ' + (currentValue ? 'Keep the core concept from "' + currentValue + '" but make it more detailed and specific' : 'MUST be exactly "' + userSeedIdea.trim() + '"');
            }
            return '- ' + field + ': ' + (currentValue ? 'Enhance "' + currentValue + '" with more specificity' : '(choose from: ' + options.join(', ') + ' or suggest similar)');
          }).join('\n');
          
          if (isGenericEnhancement) {
            userPrompt = 'CORE CONCEPT PRESERVATION: Enhance existing ' + categoryKey + ' while preserving the original user intent.\n\n' +
              'Current field values:\n' + currentFieldsDesc + '\n\n' +
              'CRITICAL INSTRUCTIONS:\n' +
              '1. Identify the SIMPLE USER CONCEPT in the primary field (e.g., "mall", "dog", "forest", "happy")\n' +
              '2. NEVER replace simple concepts with generic descriptions (NO "atmospheric environment", "compelling character", etc.)\n' +
              '3. Keep the simple concept as the core and ADD specific details around it\n' +
              '4. Example: "mall" → "bustling shopping mall" → "modern indoor shopping mall with glass skylights"\n' +
              '5. Example: "cute dog" → "adorable golden retriever puppy" → "playful golden retriever puppy with soft fur"\n\n' +
              'Available fields to enhance:\n' + availableFieldsDesc + '\n\n' +
              'Return JSON that PRESERVES the simple user concept while adding rich details.';
          } else {
            userPrompt = 'Given the current scene context: ' + sceneContext + '\n\n' +
              'PROGRESSIVE EXPANSION: Enhance existing ' + categoryKey + ' details with more depth and specificity.\n\n' +
              'Original input: "' + userSeedIdea.trim() + '"\n\n' +
              'Current field values to enhance:\n' + currentFieldsDesc + '\n\n' +
              'INSTRUCTIONS:\n' +
              '1. For the primary field, preserve the CORE CONCEPT from the existing value but make it more specific and detailed\n' +
              '2. If the existing primary field contains obvious user input (like "mall", "dog", etc.), keep that core concept intact\n' +
              '3. Add new complementary fields that were not filled before\n' +
              '4. Focus on adding layers of detail, specificity, and richness without losing the original intent\n' +
              '5. Do NOT replace simple user concepts with generic descriptions\n\n' +
              'Available fields to enhance or add:\n' + availableFieldsDesc + '\n\n' +
              'Return enhanced JSON with richer, more detailed descriptions. Don\'t remove existing content - build upon it.';
          }
        } else {
          // Build available fields description
          const availableFieldsDesc = Object.entries(categoryConfig.fieldMap).map(([field, options]) => {
            const primaryFieldNames = ['characters', 'actions', 'setting', 'style', 'audio'];
            if (primaryFieldNames.includes(field)) {
              return '- ' + field + ': MUST be exactly "' + userSeedIdea.trim() + '" (preserve user input exactly)';
            }
            return '- ' + field + ': (choose from: ' + options.join(', ') + ' or suggest similar that fits "' + userSeedIdea.trim() + '")';
          }).join('\n');
          
          userPrompt = 'Given the current scene context: ' + sceneContext + '\n\n' +
            'Expand this ' + categoryKey + ' idea: "' + userSeedIdea.trim() + '"\n\n' +
            'CRITICAL INSTRUCTION: You must preserve the user\'s exact input "' + userSeedIdea.trim() + '" as the primary field value. Do not change or interpret it - use it exactly as provided.\n\n' +
            'Then add complementary details that enhance and describe this specific concept.\n\n' +
            'Respond with a JSON object containing field suggestions. Use these available fields:\n' + availableFieldsDesc + '\n\n' +
            'Example: If user says "scarecrow", the primary field should be "scarecrow" and other fields should describe scarecrow-specific attributes (straw hair, burlap clothing, etc.).\n\n' +
            'Focus on expanding "' + userSeedIdea.trim() + '" while preserving it as the core value. Return only the JSON object, no explanation.';
        }
      } else {
        // Build available fields description
        const availableFieldsDesc = Object.entries(categoryConfig.fieldMap).map(([field, options]) => 
          '- ' + field + ': (choose from: ' + options.join(', ') + ' or suggest similar)'
        ).join('\n');
        
        userPrompt = 'Given the current scene context: ' + sceneContext + '\n\n' +
          'Please suggest appropriate values for a ' + categoryKey + ' category that would complement the existing scene elements.\n\n' +
          'Respond with a JSON object containing field suggestions. Use these available fields and choose values that work well together:\n' + availableFieldsDesc + '\n\n' +
          'Focus on creating cohesive suggestions that enhance the overall scene. Return only the JSON object, no explanation.';
      }

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

  // Generate Related Character API - with DNA inheritance logic
  async generateRelatedCharacter(baseSpec, relationship, tweaks) {
    try {
      await this.enforceRateLimit();

      // Build context from base character
      const baseContext = JSON.stringify(baseSpec, null, 2);

      const systemPrompt = `You are an expert character designer specializing in creating related characters with DNA inheritance. Your job is to generate 3-5 related characters that inherit the original character's "DNA" (core style, tone, visual palette) while varying role-appropriate traits based on the relationship type.

RELATIONSHIP: ${relationship}
ORIGINAL CHARACTER:
${baseContext}

DNA INHERITANCE SYSTEM:
- CORE DNA (always inherit): Visual style, color palette, art direction, world setting, genre tone
- SIMILARITY LEVEL: ${tweaks.similarity}% (how much to inherit vs. vary)
- TONE SHIFT: ${tweaks.toneShift}
- PALETTE SHIFT: ${tweaks.paletteShift}  
- AGE SHIFT: ${tweaks.ageShift}

RELATIONSHIP-SPECIFIC VARIATIONS:
- SIBLING: Shared family traits but different personality/role, similar age range
- ALLY: Complementary abilities/skills, supportive personality traits
- RIVAL: Contrasting personality, opposing goals, similar skill level
- MENTOR: Older/wiser version, refined characteristics, guiding nature
- SIDEKICK: Younger/smaller, supporting role traits, loyal personality
- ALT VERSION: Same core identity but different outfit/age/timeline/circumstances

VARIATION GUIDELINES:
- At ${tweaks.similarity}% similarity: Keep ${Math.floor(tweaks.similarity/10)} out of 10 base traits
- Tone shift "${tweaks.toneShift}": ${tweaks.toneShift === 'darker' ? 'Make personality more serious/dramatic' : tweaks.toneShift === 'lighter' ? 'Make personality more upbeat/positive' : 'Keep same emotional tone'}
- Palette shift "${tweaks.paletteShift}": ${tweaks.paletteShift === 'warmer' ? 'Shift colors toward reds/oranges/yellows' : tweaks.paletteShift === 'cooler' ? 'Shift colors toward blues/greens/purples' : 'Keep same color scheme'}
- Age shift "${tweaks.ageShift}": ${tweaks.ageShift === 'younger' ? 'Make noticeably younger' : tweaks.ageShift === 'older' ? 'Make noticeably older' : 'Keep similar age'}

Return EXACTLY 3-5 character options in this JSON format:
{
  "options": [
    {
      "name": "Character name",
      "summary": "2-3 sentence character description",
      "appearance": "Physical description with inherited visual DNA",
      "personality": "Personality traits fitting the relationship",
      "background": "Brief history explaining the relationship",
      "keyDifferences": ["Major difference 1", "Major difference 2", "Major difference 3"],
      "inheritedTraits": ["Inherited trait 1", "Inherited trait 2", "Inherited trait 3"],
      "formFields": {
        "character": "Main character description",
        "character_type": "person/animal/robot/etc",
        "age": "Character age",
        "personality": "Key personality traits",
        "clothing": "Outfit description",
        "emotions": "Primary emotional state"
      }
    }
  ]
}

CRITICAL REQUIREMENTS:
- Generate exactly 3-5 distinct options (not just 3)
- Each must have clear relationship connection to original
- Maintain visual DNA inheritance while varying appropriately
- Include specific keyDifferences and inheritedTraits lists
- Make each option genuinely different from the others
- Ensure formFields are complete and production-ready`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `Generate ${relationship} characters related to the provided base character. Apply the specified tweaks and maintain DNA inheritance.`
        }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.8, // Higher creativity for character variations
        maxTokens: 2500,
        timeout: 90000 // 90 seconds for multiple character generation
      });

      const result = this.parseJsonResponse(response.content);
      
      // Validate response structure
      if (!result.options || !Array.isArray(result.options) || result.options.length < 3) {
        throw new Error('Invalid response format - expected 3-5 character options');
      }

      return {
        success: true,
        options: result.options,
        relationship,
        tweaks,
        usage: response.usage
      };

    } catch (error) {
      console.error('Related character generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate related characters',
        options: []
      };
    }
  }

  // Generate Related World API - with DNA inheritance logic
  async generateRelatedWorld(baseSpec, relationship, tweaks) {
    try {
      await this.enforceRateLimit();

      // Build context from base world
      const baseContext = JSON.stringify(baseSpec, null, 2);

      const systemPrompt = `You are an expert world builder specializing in creating related locations with DNA inheritance. Your job is to generate 3-5 related world locations that inherit the original world's "DNA" (core style, tone, visual palette, architectural elements) while varying location-appropriate traits based on the relationship type.

RELATIONSHIP: ${relationship}
ORIGINAL WORLD/LOCATION:
${baseContext}

DNA INHERITANCE SYSTEM:
- CORE DNA (always inherit): Architectural style, color palette, cultural elements, technology level, genre atmosphere
- SIMILARITY LEVEL: ${tweaks.similarity}% (how much to inherit vs. vary)
- TONE SHIFT: ${tweaks.toneShift}
- PALETTE SHIFT: ${tweaks.paletteShift}
- DANGER LEVEL: ${tweaks.difficultyShift}

RELATIONSHIP-SPECIFIC VARIATIONS:
- ADJACENT LOCATION: Nearby place with same culture but different function (market vs temple in same city)
- HIDDEN AREA: Secret location within the same world (hidden chamber, concealed garden, underground passage)
- RUIN/ECHO: Decayed or abandoned version (ruins of the same building type, post-apocalyptic version)
- SEASONAL VARIANT: Same location in different season/weather (winter palace, storm-battered harbor)
- TIME PERIOD VARIANT: Same geography in different historical era (ancient vs modern version)

VARIATION GUIDELINES:
- At ${tweaks.similarity}% similarity: Keep ${Math.floor(tweaks.similarity/10)} out of 10 base environmental traits
- Tone shift "${tweaks.toneShift}": ${tweaks.toneShift === 'darker' ? 'Make atmosphere more ominous/dangerous' : tweaks.toneShift === 'lighter' ? 'Make atmosphere more welcoming/peaceful' : 'Keep same emotional tone'}
- Palette shift "${tweaks.paletteShift}": ${tweaks.paletteShift === 'warmer' ? 'Shift colors toward reds/oranges/earth tones' : tweaks.paletteShift === 'cooler' ? 'Shift colors toward blues/greens/stone tones' : 'Keep same color scheme'}
- Danger level "${tweaks.difficultyShift}": ${tweaks.difficultyShift === 'more_dangerous' ? 'Add hazards/threats/hostile elements' : tweaks.difficultyShift === 'safer' ? 'Make more peaceful/protected/welcoming' : 'Keep same danger level'}

Return EXACTLY 3-5 location options in this JSON format:
{
  "options": [
    {
      "name": "Location name",
      "summary": "2-3 sentence location description",
      "description": "Detailed environmental description with inherited visual DNA",
      "atmosphere": "Mood and feeling of this place",
      "purpose": "What this location is used for",
      "keyDifferences": ["Major difference 1", "Major difference 2", "Major difference 3"],
      "inheritedTraits": ["Inherited trait 1", "Inherited trait 2", "Inherited trait 3"],
      "formFields": {
        "setting": "Main setting description", 
        "location": "Specific location details",
        "atmosphere": "Environmental mood",
        "time_of_day": "Lighting conditions",
        "weather": "Weather/climate",
        "environmental_details": "Specific environmental elements"
      }
    }
  ]
}

CRITICAL REQUIREMENTS:
- Generate exactly 3-5 distinct location options (not just 3)
- Each must have clear relationship connection to original location
- Maintain architectural/cultural DNA inheritance while varying appropriately
- Include specific keyDifferences and inheritedTraits lists
- Make each option genuinely different from the others
- Ensure formFields are complete and production-ready`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `Generate ${relationship} world locations related to the provided base world. Apply the specified tweaks and maintain DNA inheritance.`
        }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.8, // Higher creativity for world variations
        maxTokens: 2500,
        timeout: 90000 // 90 seconds for multiple world generation
      });

      const result = this.parseJsonResponse(response.content);
      
      // Validate response structure
      if (!result.options || !Array.isArray(result.options) || result.options.length < 3) {
        throw new Error('Invalid response format - expected 3-5 world options');
      }

      return {
        success: true,
        options: result.options,
        relationship,
        tweaks,
        usage: response.usage
      };

    } catch (error) {
      console.error('Related world generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate related worlds',
        options: []
      };
    }
  }

  // Progressive World Question Generation API
  async generateProgressiveWorldQuestion({ originalDescription, currentTopic, stepNumber, totalSteps, previousResponses }) {
    try {
      await this.enforceRateLimit();

      // Build context from previous responses
      const responseContext = Object.entries(previousResponses)
        .map(([topic, response]) => topic + ': "' + (response.selectedOption.title || response.selectedOption) + '"')
        .join('\n');

      let systemPrompt = 'You are an expert world-building AI that creates contextual follow-up questions to build rich, detailed worlds progressively. This is for a VIDEO PROMPT GENERATOR, so focus heavily on visual and observable environmental elements.\n\n';
      systemPrompt += 'CURRENT TASK: Generate a targeted question about "' + currentTopic.name + '" for world development.\n\n';
      systemPrompt += 'ORIGINAL WORLD CONCEPT: "' + originalDescription + '"\n\n';
      systemPrompt += 'PREVIOUS RESPONSES:\n';
      systemPrompt += (responseContext || 'None yet - this is the first question') + '\n\n';
      systemPrompt += 'CRITICAL REQUIREMENT - CONTEXTUAL CONSISTENCY:\n';
      systemPrompt += '⚠️ ALL 6 OPTIONS MUST STAY WITHIN THE SAME WORLD TYPE AND ENVIRONMENT AS THE ORIGINAL CONCEPT\n';
      systemPrompt += '⚠️ If original concept is "city street" → ALL options must be variations of city streets\n';
      systemPrompt += '⚠️ If original concept is "forest" → ALL options must be variations of forests\n';
      systemPrompt += '⚠️ If original concept is "space station" → ALL options must be variations of space stations\n';
      systemPrompt += '⚠️ NEVER change to completely different environments (city street ≠ floating market ≠ enchanted woodland)\n\n';
      systemPrompt += 'CONCRETE EXAMPLES OF CONTEXTUAL CONSISTENCY:\n';
      systemPrompt += 'Original Concept: "city street" ✅ Good options: "Busy commercial avenue", "Quiet residential street", "Industrial back alley"\n';
      systemPrompt += 'Original Concept: "city street" ❌ Bad options: "Floating market", "Enchanted woodland", "Space station corridor"\n\n';
      systemPrompt += 'Original Concept: "mystical forest" ✅ Good options: "Ancient grove with glowing mushrooms", "Dense thicket with twisted vines", "Moonlit clearing with fairy rings"\n';
      systemPrompt += 'Original Concept: "mystical forest" ❌ Bad options: "Cyberpunk city", "Desert oasis", "Underwater cave"\n\n';
      systemPrompt += 'Original Concept: "space station" ✅ Good options: "Command bridge with holographic displays", "Engineering bay with plasma conduits", "Observation deck overlooking Earth"\n';
      systemPrompt += 'Original Concept: "space station" ❌ Bad options: "Medieval castle", "Tropical beach", "Underground cavern"\n\n';
      systemPrompt += 'CONTEXT:\n';
      systemPrompt += '- This is question ' + stepNumber + ' of ' + totalSteps + ' total questions\n';
      systemPrompt += '- Topic focus: ' + currentTopic.name + ' - ' + currentTopic.description + '\n';
      systemPrompt += '- Build upon the original concept and previous responses\n';
      systemPrompt += '- Make this question feel natural and conversational\n';
      systemPrompt += '- VISUAL-FIRST APPROACH: Questions 1-3 should focus on what you can see in this environment\n';
      systemPrompt += '- Questions 4-5 add cultural/technological elements (systems, society)\n';
      systemPrompt += '- Question 6 is for deeper historical/atmospheric background\n\n';
      systemPrompt += 'RESPONSE FORMAT (JSON only, no markdown):\n';
      systemPrompt += '{\n';
      systemPrompt += '  "question": "A natural, conversational question that builds on previous responses",\n';
      systemPrompt += '  "options": [\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 1 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    },\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 2 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    },\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 3 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    },\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 4 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    },\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 5 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    },\n';
      systemPrompt += '    {\n';
      systemPrompt += '      "title": "Option 6 title",\n';
      systemPrompt += '      "description": "Brief description of what this choice represents"\n';
      systemPrompt += '    }\n';
      systemPrompt += '  ]\n';
      systemPrompt += '}\n\n';
      systemPrompt += 'GUIDELINES:\n';
      systemPrompt += '- Question should be conversational and build naturally from previous responses\n';
      systemPrompt += '- Provide exactly 6 distinct options that offer meaningful world-building development choices\n';
      systemPrompt += '- Each option must be a VARIATION of the original concept, never a different environment\n';
      systemPrompt += '- Each option should be specific and evocative, not generic\n';
      systemPrompt += '- Options should feel like natural VARIATIONS within the same world type\n';
      systemPrompt += '- Focus on the specific topic: ' + currentTopic.name + '\n';
      systemPrompt += '- Maintain the same basic setting type while varying specific characteristics\n';
      systemPrompt += '- If original is [X], provide different types/aspects/styles of [X], never [Y] or [Z]\n';
      systemPrompt += '- Make options feel like genuine world-building choices within the established environment\n\n';
      systemPrompt += 'TOPIC-SPECIFIC FOCUS (ALWAYS WITHIN ORIGINAL WORLD TYPE):\n';
      systemPrompt += '- Geography & Scale: Different AREAS/REGIONS within the same environment type (if city→different districts, if forest→different groves)\n';
      systemPrompt += '- Architecture & Structures: Different BUILDING STYLES/AGES within the same setting type (if medieval→different castle styles, if modern→different building eras)\n';
      systemPrompt += '- Culture & Society: Different GROUPS/FACTIONS within the same world (if urban→different social classes, if fantasy→different magical traditions)\n';
      systemPrompt += '- Technology & Systems: Different TECH LEVELS/SYSTEMS within the same genre (if sci-fi→different tech approaches, if fantasy→different magic types)\n';
      systemPrompt += '- History & Atmosphere: Different TIME PERIODS/MOODS within the same setting (if ancient→different historical eras, if dark→different sources of darkness)\n';
      systemPrompt += '- Economy & Conflicts: Different RESOURCE TYPES/TENSIONS within the same world (if trading→different goods/markets, if war-torn→different conflicts)';

      const messages = [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: 'Generate a ' + currentTopic.name.toLowerCase() + ' question for this world. CRITICAL: Keep all 6 options as variations within the "' + originalDescription + '" concept - never change to different environment types. Make it feel natural and build on what we know so far.'
        }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.8, // Higher creativity for diverse options
        maxTokens: 1200,
        timeout: 60000 // 60 seconds for question generation
      });

      const result = this.parseJsonResponse(response.content);
      
      // Validate the response structure
      if (!result.question || !result.options || !Array.isArray(result.options) || result.options.length !== 6) {
        throw new Error('Invalid response format from AI service');
      }

      return {
        success: true,
        question: result.question,
        options: result.options,
        topic: currentTopic.name,
        stepNumber,
        usage: response.usage
      };

    } catch (error) {
      console.error('Progressive world question generation error:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to generate world question',
        question: null,
        options: []
      };
    }
  }

  // Generate Final World from Progressive Responses
  async generateFinalWorldFromResponses({ originalDescription, responses }) {
    try {
      await this.enforceRateLimit();

      // Build comprehensive response summary
      const responsesSummary = Object.entries(responses)
        .map(([topic, response]) => {
          return `${response.topic}: ${response.selectedOption.title || response.selectedOption}${
            response.selectedOption.description ? ` - ${response.selectedOption.description}` : ''
          }`;
        })
        .join('\n');

      const responseCount = Object.keys(responses).length;
      let systemPrompt = `Create a video-ready world from the concept and responses below.

ORIGINAL: "${originalDescription}"
RESPONSES (${responseCount}/6):
${responsesSummary}

PRIORITIZE: Visual elements (geography, architecture, atmosphere) over abstract concepts. Fill gaps logically.

JSON FORMAT:
{
  "name": "Distinctive world name",
  "summary": "2-3 sentence overview",
  "geography": "Detailed physical description",
  "architecture": "Building and structural styles",
  "culture": "Observable cultural elements",
  "atmosphere": "Environmental mood",
  "uniqueFeatures": "Distinctive characteristics",
  "formFields": {
    "setting": "Primary description",
    "location": "Specific location",
    "atmosphere": "Environmental mood",
    "time_of_day": "Lighting conditions",
    "weather": "Weather/climate",
    "environmental_details": "Environmental elements",
    "world_type": "Fantasy/sci-fi/modern/historical",
    "architectural_style": "Building aesthetic",
    "cultural_context": "Cultural elements"
  }
}`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: 'Synthesize these responses into a complete, cohesive world.' 
        }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.7, // Balanced creativity for synthesis
        maxTokens: 3000, // Increased from 2000 to prevent JSON truncation
        timeout: 90000 // 90 seconds for world synthesis
      });

      const result = this.parseJsonResponse(response.content);
      
      // Validate required fields
      if (!result.name || !result.summary || !result.formFields) {
        throw new Error('Invalid world response format');
      }

      return {
        success: true,
        world: result,
        usage: response.usage
      };

    } catch (error) {
      console.error('Final world generation error:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to generate final world',
        world: null
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

  // Progressive Style Question Generation API
  async generateProgressiveStyleQuestion({ originalDescription, currentTopic, stepNumber, totalSteps, previousResponses }) {
    try {
      await this.enforceRateLimit();

      const responsesList = Object.entries(previousResponses)
        .map(([topic, response]) => `${topic}: "${response}"`)
        .join('\n');

      const systemPrompt = `You are an expert cinematographer and visual style designer. Your job is to help users develop their perfect visual style through targeted questions. You must generate EXACTLY 6 diverse, compelling options that explore different aspects of the current topic.

CRITICAL INSTRUCTIONS:
- Generate exactly 6 options, no more, no less
- Keep each option under 100 characters
- Make options distinct and diverse within the topic
- Focus on visual, technical, and aesthetic aspects
- Build upon the original description: "${originalDescription}"
- Consider previous responses but don't repeat them`;

      const userPrompt = `Original style description: "${originalDescription}"

Current topic: ${currentTopic.name} - ${currentTopic.description}
Step ${stepNumber} of ${totalSteps}

Previous responses:
${responsesList || 'None yet'}

Generate a ${currentTopic.name.toLowerCase()} question for this style. CRITICAL: Keep all 6 options as variations within the "${originalDescription}" concept - never change to different style types. Make it feel natural and build on what we know so far.

Return JSON format:
{
  "question": "What kind of [topic aspect] should this style have?",
  "options": [
    "Option 1 (specific to original concept)",
    "Option 2 (specific to original concept)",  
    "Option 3 (specific to original concept)",
    "Option 4 (specific to original concept)",
    "Option 5 (specific to original concept)",
    "Option 6 (specific to original concept)"
  ]
}`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.8, // Higher creativity for diverse options
        maxTokens: 1200,
        timeout: 60000 // 60 seconds for question generation
      });

      const result = this.parseJsonResponse(response.content);
      
      // Validate the response structure
      if (!result.question || !result.options || !Array.isArray(result.options) || result.options.length !== 6) {
        throw new Error('Invalid response format from AI service');
      }

      return {
        success: true,
        question: result.question,
        options: result.options,
        usage: response.usage
      };

    } catch (error) {
      console.error('Progressive style question generation error:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to generate style question'
      };
    }
  }

  // Generate Final Style from Progressive Responses
  async generateFinalStyleFromResponses({ originalDescription, responses }) {
    try {
      await this.enforceRateLimit();

      const responsesList = Object.entries(responses)
        .map(([topic, response]) => `- ${topic}: "${response}"`)
        .join('\n');

      const systemPrompt = `Create a cinematographic style from the concept and preferences below.

ORIGINAL: "${originalDescription}"
PREFERENCES:
${responsesList}

JSON FORMAT:
{
  "name": "Style name (3-5 words)",
  "summary": "2-3 sentence overview",
  "formFields": {
    "style": "Main description",
    "camera_angle": "Camera work",
    "lighting_type": "Lighting approach",
    "color_palette": "Color scheme",
    "cinematography": "Overall approach",
    "mood": "Visual tone",
    "technical_quality": "Production quality",
    "visual_references": "Director/film influences"
  }
}`;

      const messages = [
        { role: 'user', content: systemPrompt }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.7, // Balanced creativity for synthesis
        maxTokens: 3000, // Increased from 2000 to prevent JSON truncation
        timeout: 90000 // 90 seconds for style synthesis
      });

      const result = this.parseJsonResponse(response.content);
      
      // Validate required fields
      if (!result.name || !result.summary || !result.formFields) {
        throw new Error('Invalid style response format');
      }

      return {
        success: true,
        style: result,
        usage: response.usage
      };

    } catch (error) {
      console.error('Final style generation error:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to generate final style',
        style: null
      };
    }
  }

  // Progressive Related Question Generation API
  async generateProgressiveRelatedQuestion({ baseSpec, specType, selectedRelationship, currentTopic, stepNumber, totalSteps, previousResponses }) {
    try {
      await this.enforceRateLimit();

      // Build context from base spec and previous responses
      const baseContext = JSON.stringify(baseSpec, null, 2);
      const responseContext = Object.entries(previousResponses)
        .map(([topic, response]) => `${topic}: "${response.answer}"`)
        .join('\n');

      const relationshipType = selectedRelationship.replace('_', ' ');
      const isCharacter = specType === 'character';

      const systemPrompt = `You are an expert ${isCharacter ? 'character designer' : 'world builder'} specializing in creating related ${isCharacter ? 'characters' : 'worlds'} through progressive questioning. You're building a ${relationshipType} relationship with deep DNA inheritance.

RELATIONSHIP TYPE: ${relationshipType}
CURRENT TOPIC: ${currentTopic.name} (${currentTopic.description})
STEP: ${stepNumber} of ${totalSteps}

BASE ${isCharacter ? 'CHARACTER' : 'WORLD'}:
${baseContext}

PREVIOUS RESPONSES:
${responseContext || 'None yet - this is the first question'}

TASK: Generate a targeted question about "${currentTopic.name}" to develop the ${relationshipType} relationship. The question should build on previous responses while maintaining DNA inheritance.

${isCharacter ? `
CHARACTER RELATIONSHIP GUIDANCE:
- sibling: Shared family traits, different roles/personalities
- ally: Complementary abilities, shared goals
- rival: Contrasting traits, opposing motivations  
- mentor: Older/wiser, refined characteristics
- sidekick: Supporting role, loyal traits
- romantic_interest: Complementary chemistry, emotional connection
- alt_version: Same identity, different context/timeline

FOCUS AREAS BY TOPIC:
- connection: Emotional bond, chemistry type, attraction
- personality: Trait interactions, complementary/contrasting aspects
- visual: Appearance harmony, visual chemistry, styling
- history: Shared past, origin story, background connection
- role: Narrative function, story purpose, dramatic role
- refinement: Similarity level, tone adjustments, final tweaks
` : `
WORLD RELATIONSHIP GUIDANCE:
- adjacent_location: Nearby with same culture, different function
- hidden_area: Secret location within same world
- ruin_echo: Decayed/abandoned version
- seasonal_variant: Same location, different season/weather
- time_period_variant: Same geography, different era

FOCUS AREAS BY TOPIC:
- spatial: Geographic connection, physical relationship
- cultural: Society/culture relationship, inhabitants
- visual: Shared visual DNA, distinctive elements
- historical: Timeline connection, shared history
- functional: Different narrative purposes, story roles
- refinement: Similarity level, atmospheric adjustments
`}

RESPONSE FORMAT:
{
  "question": "A specific, engaging question about ${currentTopic.name}",
  "options": [
    "Option 1 - specific and detailed",
    "Option 2 - specific and detailed", 
    "Option 3 - specific and detailed",
    "Option 4 - specific and detailed"
  ]
}

Generate 4 distinct options that explore different aspects of ${currentTopic.name} while building the ${relationshipType} relationship. Make options specific, not generic.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a ${currentTopic.name} question for building a ${relationshipType} ${specType}.` }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.7,
        maxTokens: 800,
        timeout: 90000
      });

      const result = this.parseJsonResponse(response.content);

      if (!result.question || !result.options || !Array.isArray(result.options) || result.options.length < 4) {
        throw new Error('Invalid question response format');
      }

      return {
        success: true,
        question: result.question,
        options: result.options,
        usage: response.usage
      };

    } catch (error) {
      console.error('Progressive related question generation error:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to generate progressive question',
        question: '',
        options: []
      };
    }
  }

  // Progressive Related Final Generation API
  async generateProgressiveRelatedFinal({ baseSpec, specType, selectedRelationship, responses, questionTopics, refinementSettings }) {
    try {
      await this.enforceRateLimit();

      const baseContext = JSON.stringify(baseSpec, null, 2);
      const relationshipType = selectedRelationship.replace('_', ' ');
      const isCharacter = specType === 'character';

      // Build detailed context from all responses
      const responseDetails = questionTopics.map(topic => {
        const response = responses[topic.id];
        if (response) {
          return `${topic.name}: ${response.answer}`;
        }
        return null;
      }).filter(Boolean).join('\n');

      const systemPrompt = `You are an expert ${isCharacter ? 'character designer' : 'world builder'} creating final related ${isCharacter ? 'characters' : 'worlds'} based on progressive questioning responses.

RELATIONSHIP TYPE: ${relationshipType}
BASE ${isCharacter ? 'CHARACTER' : 'WORLD'}:
${baseContext}

PROGRESSIVE RESPONSES:
${responseDetails}

REFINEMENT SETTINGS:
- SIMILARITY LEVEL: ${refinementSettings?.similarity || 70}% (how much to inherit vs. vary)
- TONE SHIFT: ${refinementSettings?.toneShift || 'same'}
- PALETTE SHIFT: ${refinementSettings?.paletteShift || 'same'}
${isCharacter ? `- AGE SHIFT: ${refinementSettings?.ageShift || 'same'}` : `- DANGER LEVEL: ${refinementSettings?.difficultyShift || 'same'}`}

TASK: Generate 3-4 distinct related ${isCharacter ? 'characters' : 'worlds'} that inherit the original's DNA while exploring the ${relationshipType} relationship based on the progressive answers AND refinement settings.

DNA INHERITANCE RULES:
1. PRESERVE: Core visual style, color palette, genre tone, art direction
2. VARY: Role-specific traits based on relationship and progressive answers
3. ENHANCE: Use progressive responses to add depth and specificity
4. REFINE: Apply similarity and adjustment settings to control variation level

VARIATION GUIDELINES:
- At ${refinementSettings?.similarity || 70}% similarity: Keep ${Math.floor((refinementSettings?.similarity || 70)/10)} out of 10 base traits
- Tone shift "${refinementSettings?.toneShift || 'same'}": ${
  (refinementSettings?.toneShift || 'same') === 'darker' ? 
    (isCharacter ? 'Make personality more serious/dramatic' : 'Make atmosphere more ominous/dangerous') :
  (refinementSettings?.toneShift || 'same') === 'lighter' ? 
    (isCharacter ? 'Make personality more upbeat/positive' : 'Make atmosphere more welcoming/peaceful') : 
    'Keep same emotional tone'
}
- Palette shift "${refinementSettings?.paletteShift || 'same'}": ${
  (refinementSettings?.paletteShift || 'same') === 'warmer' ? 
    (isCharacter ? 'Shift colors toward reds/oranges/yellows' : 'Shift colors toward reds/oranges/earth tones') :
  (refinementSettings?.paletteShift || 'same') === 'cooler' ? 
    (isCharacter ? 'Shift colors toward blues/greens/purples' : 'Shift colors toward blues/greens/stone tones') : 
    'Keep same color scheme'
}
${isCharacter ? 
  `- Age shift "${refinementSettings?.ageShift || 'same'}": ${
    (refinementSettings?.ageShift || 'same') === 'younger' ? 'Make noticeably younger' :
    (refinementSettings?.ageShift || 'same') === 'older' ? 'Make noticeably older' : 'Keep similar age'
  }` :
  `- Danger level "${refinementSettings?.difficultyShift || 'same'}": ${
    (refinementSettings?.difficultyShift || 'same') === 'more_dangerous' ? 'Add hazards/threats/hostile elements' :
    (refinementSettings?.difficultyShift || 'same') === 'safer' ? 'Make more peaceful/protected/welcoming' : 'Keep same danger level'
  }`
}

${isCharacter ? `
CHARACTER OUTPUT FORMAT:
{
  "results": {
    "relationship": "${relationshipType}",
    "summary": "Brief overview of how the relationship was developed"
  },
  "options": [
    {
      "name": "Character Name",
      "summary": "2-3 sentence character description",
      "keyDifferences": ["Key trait 1", "Key trait 2", "Key trait 3"],
      "formFields": {
        "character_type": "value",
        "age": "value", 
        "gender": "value",
        "hair_color": "value",
        "hair_style": "value",
        "clothing": "value",
        "emotions": "value",
        "actions": "value",
        "scene": "Scene with both characters if relevant"
      }
    }
  ]
}
` : `
WORLD OUTPUT FORMAT:
{
  "results": {
    "relationship": "${relationshipType}",
    "summary": "Brief overview of how the relationship was developed"
  },
  "options": [
    {
      "name": "Location Name",
      "summary": "2-3 sentence location description", 
      "keyDifferences": ["Key aspect 1", "Key aspect 2", "Key aspect 3"],
      "formFields": {
        "setting": "value",
        "environment": "value",
        "lighting_type": "value",
        "time_of_day": "value",
        "atmosphere": "value",
        "architecture": "value if relevant",
        "weather": "value if relevant"
      }
    }
  ]
}
`}

Generate ${isCharacter ? 'characters' : 'worlds'} that feel authentically related through the ${relationshipType} connection while incorporating all progressive response insights.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate final related ${specType}s based on the progressive responses.` }
      ];

      const response = await this.makeRequest(messages, {
        temperature: 0.8,
        maxTokens: 4000, // Increased from 2500 to handle longer responses
        timeout: 90000
      });

      const result = this.parseJsonResponse(response.content);

      if (!result.results || !result.options || !Array.isArray(result.options) || result.options.length < 3) {
        throw new Error('Invalid final response format - expected results and 3+ options');
      }

      return {
        success: true,
        results: result.results,
        options: result.options,
        usage: response.usage
      };

    } catch (error) {
      console.error('Progressive related final generation error:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to generate final related options',
        results: null,
        options: []
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