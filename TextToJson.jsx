import React, { useState } from 'react';
import aiApiService from './aiApiService';
import usePromptStore from './store';

const TextToJson = ({ onResult, className = "" }) => {
  const [textInput, setTextInput] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const { updateFieldValue } = usePromptStore();

  const handleConvert = async () => {
    if (!textInput.trim()) {
      setError('Please enter a scene description');
      return;
    }

    if (!aiApiService.hasGroqApiKey()) {
      setError('Groq API key required for text conversion. Please set your Groq API key in settings.');
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      const prompt = `Convert this scene description into structured JSON prompt fields. Return ONLY a JSON object with field names and values that match typical video generation parameters.

Scene Description: "${textInput}"

Extract relevant details for these types of fields:
- scene: Overall scene description
- character_type: Type of character (human, animal, etc.)
- setting: Location/environment
- actions: What's happening
- emotions: Character emotions
- lighting_type: Lighting conditions
- time_of_day: Time setting
- camera_angle: Camera perspective
- camera_distance: Shot type
- style: Visual style
- color_palette: Color scheme
- atmosphere: Overall mood
- clothing: Character clothing
- hair_color, hair_style: Character appearance
- age, gender: Character demographics
- environment: Weather/conditions

Return ONLY valid JSON with fields you're confident about. Use descriptive but concise values.`;

      const response = await aiApiService.makeRequest([
        { role: 'user', content: prompt }
      ], {
        // No model specified - will default to Groq's mixtral-8x7b-32768
        temperature: 0.3,
        maxTokens: 800
      });

      // Parse the AI response
      let jsonData;
      try {
        // Clean the response to extract JSON
        let cleanedResponse = response.content.trim();
        
        // Remove markdown code blocks if present
        cleanedResponse = cleanedResponse.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '');
        cleanedResponse = cleanedResponse.replace(/```\s*/gi, '');
        
        // Find JSON object boundaries
        const jsonStart = cleanedResponse.indexOf('{');
        const jsonEnd = cleanedResponse.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
        }
        
        jsonData = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        throw new Error('AI returned invalid JSON format. Please try again.');
      }

      // Update form fields with the extracted data
      Object.entries(jsonData).forEach(([fieldKey, fieldValue]) => {
        if (fieldValue && typeof fieldValue === 'string' && fieldValue.trim()) {
          updateFieldValue(fieldKey, fieldValue.trim());
        }
      });

      // Call the onResult callback if provided
      if (onResult && typeof onResult === 'function') {
        onResult({
          success: true,
          fieldsUpdated: Object.keys(jsonData).length,
          data: jsonData
        });
      }

      // Clear the input
      setTextInput('');
      
    } catch (err) {
      console.error('Text to JSON conversion error:', err);
      const errorMessage = err.message.includes('API key') 
        ? 'OpenAI API key required. Please set your API key in settings.'
        : err.message.includes('rate limit')
        ? 'Rate limit exceeded. Please wait a moment before trying again.'
        : err.message || 'Failed to convert text to JSON. Please try again.';
      
      setError(errorMessage);
    } finally {
      setIsConverting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleConvert();
    }
  };

  return (
    <div className={`bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700/50 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">✨</span>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-cinema-text">
            Text → JSON
          </h3>
        </div>
        <span className="text-xs text-purple-600 dark:text-purple-400 font-medium px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
          AI-Powered
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your scene in natural language... e.g., 'A young woman with long brown hair sitting in a cozy coffee shop, reading a book while rain falls outside the window'"
            className="w-full px-3 py-2 text-sm border border-purple-200 dark:border-purple-700/50 rounded-md bg-white dark:bg-cinema-panel text-gray-700 dark:text-cinema-text placeholder-gray-500 dark:placeholder-cinema-text-muted focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent resize-none"
            rows={3}
            disabled={isConverting}
          />
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500 dark:text-cinema-text-muted">
              Ctrl+Enter to convert
            </span>
            <span className="text-xs text-gray-500 dark:text-cinema-text-muted">
              {textInput.length}/500
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-md p-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-xs text-red-700 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleConvert}
          disabled={isConverting || !textInput.trim()}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
            isConverting || !textInput.trim()
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {isConverting ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Converting...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Convert to JSON</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TextToJson;