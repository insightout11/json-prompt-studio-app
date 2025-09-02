import React, { useState, useRef, useEffect } from 'react';
import usePromptStore from './store';

const UniversalInput = ({ className = "", aiFeatures = null, resetTrigger }) => {
  console.log('🚨🚨🚨 UniversalInput-v9-NOCACHE component loaded - FRESH FILE 🚨🚨🚨');
  
  const [textInput, setTextInput] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [inputMode, setInputMode] = useState('text-to-json');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [hasConverted, setHasConverted] = useState(false);
  const [lastConvertedInput, setLastConvertedInput] = useState('');
  const [enhanceCount, setEnhanceCount] = useState(0);
  const { setFieldValue, fieldValues } = usePromptStore();
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      // Min height: 2 lines (~80px), Max height: 200px (5 lines)
      textarea.style.height = Math.min(Math.max(scrollHeight, 80), 200) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [textInput]);

  // Adjust textarea height when switching back to text mode
  useEffect(() => {
    if (inputMode === 'text-to-json') {
      adjustTextareaHeight();
    }
  }, [inputMode]);

  // Reset conversion state when input changes
  useEffect(() => {
    if (textInput !== lastConvertedInput && hasConverted) {
      setHasConverted(false);
    }
  }, [textInput, lastConvertedInput, hasConverted]);

  // Reset all states when Clear All is triggered
  useEffect(() => {
    console.log('🎯 UniversalInput resetTrigger changed:', resetTrigger);
    if (resetTrigger) {
      console.log('✅ Resetting Convert button and text input state');
      setHasConverted(false);
      setLastConvertedInput('');
      setEnhanceCount(0);
      setTextInput('');
      setUploadedImage(null);
      setImagePreview(null);
      setError(null);
      
      // Reset file input if it exists
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [resetTrigger]);

  const handleConvert = async () => {
    if (inputMode === 'text-to-json') {
      if (!textInput.trim()) {
        setError('Please enter a scene description');
        return;
      }
      
      if (hasConverted && textInput === lastConvertedInput) {
        // Enhancement mode - enhance existing fields
        await handleTextEnhancement();
      } else {
        // Initial conversion mode
        await handleTextToJson();
      }
    } else if (inputMode === 'image-to-json') {
      if (!uploadedImage) {
        setError('Please upload an image first');
        return;
      }
      await handleImageToJson();
    } else {
      setError('Manual mode: Use the form fields below');
    }
  };

  const handleTextToJson = async () => {
    setIsConverting(true);
    setError(null);

    try {
      const prompt = `Convert this scene description into structured JSON prompt fields. Return ONLY a JSON object with field names and values that match typical video generation parameters.

Scene Description: "${textInput}"

Extract relevant details for these types of fields:
- scene: Overall scene description
- character_type: Type of character (human, specific animal like "golden retriever", "tabby cat", "red cardinal bird", etc.)
- animal_type: If character is an animal, specify the exact type (e.g. "golden retriever", "tabby cat", "red cardinal")
- species: Alternative specific animal identifier
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

IMPORTANT: If you detect an animal, be specific about the type (breed, species, color) rather than generic "animal". For example:
- "dog" → "golden retriever" or "german shepherd"
- "cat" → "tabby cat" or "siamese cat"
- "bird" → "red cardinal" or "blue jay"

Return ONLY valid JSON with fields you're confident about. Use descriptive but concise values.`;

      console.log('🔥🔥🔥 v9-NOCACHE making DIRECT API call for text-to-json...');
      
      // Direct API call with extensive logging
      const directResponse = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 800,
          model: 'llama-3.1-8b-instant'
        })
      });
      
      console.log('🔥 v9 Direct API response status:', directResponse.status);
      console.log('🔥 v9 Direct API response headers:', Object.fromEntries(directResponse.headers.entries()));
      
      if (!directResponse.ok) {
        const errorText = await directResponse.text();
        console.error('🚨 v9 Direct API error:', errorText);
        throw new Error(`API request failed: ${directResponse.status} - ${errorText}`);
      }
      
      // Get response as text first to see what we're dealing with
      const responseText = await directResponse.text();
      console.log('🔥 v9 Raw response text (first 500 chars):', responseText.substring(0, 500));
      console.log('🔥 v9 Raw response length:', responseText.length);
      
      let directData;
      try {
        directData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('🚨 v9 Failed to parse response as JSON:', parseError);
        console.error('🚨 v9 Raw response that failed:', responseText);
        throw new Error(`Invalid JSON response from server: ${parseError.message}`);
      }
      
      console.log('🔥 v9 Direct API data received:', directData);
      console.log('🔍 v9 Choices array exists:', !!directData.choices);
      console.log('🔍 v9 First choice exists:', !!directData.choices?.[0]);
      console.log('🔍 v9 Message exists:', !!directData.choices?.[0]?.message);
      console.log('🔍 v9 Content exists:', !!directData.choices?.[0]?.message?.content);
      
      if (!directData.choices?.[0]?.message?.content) {
        console.error('🚨 v9 Invalid response structure:', directData);
        throw new Error('Invalid response structure from API');
      }
      
      const response = {
        content: directData.choices[0].message.content,
        usage: directData.usage,
        model: directData.model
      };

      // Parse the AI response
      let jsonData;
      try {
        // Clean the response to extract JSON
        let cleanedResponse = response.content.trim();
        console.log('🔍 v9 AI response content:', cleanedResponse);
        
        // Remove markdown code blocks if present
        cleanedResponse = cleanedResponse.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '');
        cleanedResponse = cleanedResponse.replace(/```\s*/gi, '');
        
        // Find JSON object boundaries
        const jsonStart = cleanedResponse.indexOf('{');
        const jsonEnd = cleanedResponse.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
        }
        
        console.log('🔍 v9 Cleaned JSON for parsing:', cleanedResponse);
        jsonData = JSON.parse(cleanedResponse);
        console.log('🔍 v9 Successfully parsed JSON:', jsonData);
      } catch (parseError) {
        console.error('🚨 v9 JSON parsing error:', parseError);
        console.error('🚨 v9 Failed content:', response.content);
        throw new Error('AI returned invalid JSON format. Please try again.');
      }

      // Update form fields with the extracted data
      Object.entries(jsonData).forEach(([fieldKey, fieldValue]) => {
        if (fieldValue && typeof fieldValue === 'string' && fieldValue.trim()) {
          setFieldValue(fieldKey, fieldValue.trim());
        }
      });

      // Mark as converted and save the input for enhancement
      setHasConverted(true);
      setLastConvertedInput(textInput);

    } catch (err) {
      console.error('🚨 v9 Text to JSON conversion error:', err);
      const errorMessage = err.message || 'An error occurred during text conversion. Please try again.';
      setError(errorMessage);
    } finally {
      setIsConverting(false);
    }
  };

  const handleTextEnhancement = async () => {
    setIsConverting(true);
    setError(null);
    
    // Increment enhance counter
    setEnhanceCount(prev => prev + 1);

    try {
      // Build current scene context from existing field values
      const currentFields = Object.entries(fieldValues)
        .filter(([key, value]) => value && value.trim() !== '')
        .map(([key, value]) => `- ${key}: "${value}"`)
        .join('\n');

      const enhancementPrompt = `PROGRESSIVE ENHANCEMENT: Enhance existing JSON fields with more depth and specificity.

Original input: "${textInput}"

Current field values to enhance:
${currentFields}

INSTRUCTIONS:
1. Keep all existing content but make it MORE detailed and specific
2. Add new complementary fields that weren't filled before  
3. Preserve the original concept "${textInput}" in core fields
4. Focus on adding layers of detail, specificity, and richness

Available fields (enhance existing or add new ones):
- scene: Main scene description (enhance if exists)
- character_type: Type of character 
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

Return enhanced JSON with richer, more detailed descriptions. Don't remove existing content - build upon it.`;

      console.log('🔥🔥🔥 v9-NOCACHE making DIRECT API call for enhancement...');
      
      // Direct API call with extensive logging
      const directResponse = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are an expert at enhancing and expanding creative content with rich, specific details.' },
            { role: 'user', content: enhancementPrompt }
          ],
          temperature: 0.8,
          max_tokens: 1000,
          model: 'llama-3.1-8b-instant'
        })
      });
      
      console.log('🔥 v9 Enhancement API response status:', directResponse.status);
      console.log('🔥 v9 Enhancement API response headers:', Object.fromEntries(directResponse.headers.entries()));
      
      if (!directResponse.ok) {
        const errorText = await directResponse.text();
        console.error('🚨 v9 Enhancement API error:', errorText);
        throw new Error(`API request failed: ${directResponse.status} - ${errorText}`);
      }
      
      // Get response as text first to see what we're dealing with
      const responseText = await directResponse.text();
      console.log('🔥 v9 Enhancement raw response text (first 500 chars):', responseText.substring(0, 500));
      console.log('🔥 v9 Enhancement raw response length:', responseText.length);
      
      let directData;
      try {
        directData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('🚨 v9 Enhancement failed to parse response as JSON:', parseError);
        console.error('🚨 v9 Enhancement raw response that failed:', responseText);
        throw new Error(`Invalid JSON response from server: ${parseError.message}`);
      }
      
      console.log('🔥 v9 Enhancement API data received:', directData);
      console.log('🔍 v9 Enhancement choices exist:', !!directData.choices);
      
      if (!directData.choices?.[0]?.message?.content) {
        console.error('🚨 v9 Enhancement invalid response structure:', directData);
        throw new Error('Invalid response structure from API');
      }
      
      const response = {
        content: directData.choices[0].message.content,
        usage: directData.usage,
        model: directData.model
      };

      // Parse the enhanced JSON
      let jsonData;
      try {
        let cleanedResponse = response.content.trim();
        console.log('🔍 v9 Enhancement AI response content:', cleanedResponse);
        
        // Remove markdown code blocks if present
        cleanedResponse = cleanedResponse.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '');
        cleanedResponse = cleanedResponse.replace(/```\s*/gi, '');
        
        // Find JSON object boundaries
        const jsonStart = cleanedResponse.indexOf('{');
        const jsonEnd = cleanedResponse.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
        }
        
        console.log('🔍 v9 Enhancement cleaned JSON:', cleanedResponse);
        jsonData = JSON.parse(cleanedResponse);
        console.log('🔍 v9 Enhancement parsed JSON:', jsonData);
      } catch (parseError) {
        console.error('🚨 v9 Enhancement JSON parsing error:', parseError);
        console.error('🚨 v9 Enhancement failed content:', response.content);
        throw new Error('AI returned invalid JSON format. Please try again.');
      }

      // Update form fields with the enhanced data
      Object.entries(jsonData).forEach(([fieldKey, fieldValue]) => {
        if (fieldValue && typeof fieldValue === 'string' && fieldValue.trim()) {
          setFieldValue(fieldKey, fieldValue.trim());
        }
      });

    } catch (err) {
      console.error('🚨 v9 Text enhancement error:', err);
      const errorMessage = err.message || 'An error occurred during text enhancement. Please try again.';
      setError(errorMessage);
    } finally {
      setIsConverting(false);
    }
  };

  const handleImageToJson = async () => {
    setIsConverting(true);
    setError(null);

    try {
      // This would need OpenAI implementation for image analysis
      setError('Image analysis not implemented in this direct version yet');
    } catch (err) {
      console.error('Image to JSON conversion error:', err);
      setError(err.message || 'An error occurred during image analysis. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  // Rest of the component UI code would go here...
  return (
    <div className={`universal-input-container ${className}`}>
      <div className="flex flex-col space-y-4">
        {/* Mode Selection */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setInputMode('text-to-json')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              inputMode === 'text-to-json'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Text to JSON
          </button>
          <button
            onClick={() => setInputMode('image-to-json')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              inputMode === 'image-to-json'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Image to JSON
          </button>
          <button
            onClick={() => setInputMode('manual')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              inputMode === 'manual'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Manual
          </button>
        </div>

        {/* Text Input Mode */}
        {inputMode === 'text-to-json' && (
          <div className="space-y-4">
            <textarea
              ref={textareaRef}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Describe your scene in natural language..."
              className="w-full p-4 border rounded-lg resize-none bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              style={{ minHeight: '80px', maxHeight: '200px' }}
            />
            
            <button
              onClick={handleConvert}
              disabled={isConverting || !textInput.trim()}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                isConverting || !textInput.trim()
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : hasConverted && textInput === lastConvertedInput
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isConverting 
                ? 'Converting...' 
                : hasConverted && textInput === lastConvertedInput
                ? `Enhance (${enhanceCount > 0 ? `${enhanceCount}x` : 'Again'})`
                : 'Convert to JSON'
              }
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalInput;