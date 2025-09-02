// FRESH AI API Service - No Browser Cache Issues
// Direct copy of working configuration

import { buildPrompt } from './aiSystemPrompts.js';

class AIApiService {
  constructor() {
    console.log('🔥 FRESH aiApiService loaded successfully! v5.0');
    console.log('🔥 Current time:', new Date().toISOString());
    
    this.maxRetries = 3;
    this.retryDelay = 1000;
    this.timeout = 30000;
    this.rateLimitDelay = 2000;
    this.lastRequestTime = 0;
  }

  async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const waitTime = this.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  async makeRequest(messages, options = {}) {
    console.log('🚀 FRESH makeRequest called!', { messages: messages.length + ' messages', options });
    
    // Determine provider - restore OpenAI for better JSON
    const useOpenAI = options.forceOpenAI || options.model?.includes('gpt-');
    const useGemini = options.forceGemini || options.model?.includes('gemini-');
    const provider = useOpenAI ? 'openai' : useGemini ? 'gemini' : 'groq';
    
    await this.enforceRateLimit();

    // Use direct endpoints like the original working version
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseURL = isLocal 
      ? (useOpenAI ? '/api/openai' : '/api/groq')
      : (useOpenAI ? 'https://jsonpromptstudio.com/api/openai' : 'https://jsonpromptstudio.com/api/groq');
    const defaultModel = useOpenAI ? 'gpt-4o-mini' : 'llama-3.1-8b-instant';

    console.log('🎯 FRESH API call:', { provider, baseURL, model: options.model || defaultModel });

    const requestPayload = {
      model: options.model || defaultModel,
      messages: messages,
      max_tokens: options.maxTokens || 2000,
      temperature: options.temperature || 0.7,
      ...(options.topP && options.topP !== 1 && { top_p: options.topP }),
      ...(options.frequencyPenalty && options.frequencyPenalty !== 0 && { frequency_penalty: options.frequencyPenalty }),
      ...(options.presencePenalty && options.presencePenalty !== 0 && { presence_penalty: options.presencePenalty }),
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
        console.log(`🌐 FRESH fetch attempt ${attempt} to:`, baseURL);
        
        const response = await fetch(baseURL, requestOptions);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`HTTP ${response.status}: ${errorData.error || 'API Error'}`);
        }

        const data = await response.json();
        
        console.log('✅ FRESH API Response received:', {
          hasChoices: !!data.choices,
          contentLength: data.choices?.[0]?.message?.content?.length || 0,
          contentPreview: data.choices?.[0]?.message?.content?.substring(0, 100) || 'No content'
        });
        
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
        console.warn(`🚨 FRESH API attempt ${attempt} failed:`, error.message);
        
        if (attempt < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        }
      }
    }
    
    throw new Error(`All ${this.maxRetries} API attempts failed. Last error: ${lastError.message}`);
  }
}

// Export singleton instance
const aiApiService = new AIApiService();
export default aiApiService;