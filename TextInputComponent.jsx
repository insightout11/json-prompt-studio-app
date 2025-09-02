import React, { useState, useRef, useEffect } from 'react';
import usePromptStore from './store';

const TextInputComponent = ({ className = "", aiFeatures = null, resetTrigger }) => {
  console.log('🚨🚨🚨 TextInputComponent BRAND NEW COMPONENT LOADED 🚨🚨🚨');
  
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
      textarea.style.height = Math.min(Math.max(scrollHeight, 80), 200) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [textInput]);

  useEffect(() => {
    if (inputMode === 'text-to-json') {
      adjustTextareaHeight();
    }
  }, [inputMode]);

  useEffect(() => {
    if (textInput !== lastConvertedInput && hasConverted) {
      setHasConverted(false);
    }
  }, [textInput, lastConvertedInput, hasConverted]);

  useEffect(() => {
    console.log('🎯 TextInputComponent resetTrigger changed:', resetTrigger);
    if (resetTrigger) {
      console.log('✅ Resetting Convert button and text input state');
      setHasConverted(false);
      setLastConvertedInput('');
      setEnhanceCount(0);
      setTextInput('');
      setUploadedImage(null);
      setImagePreview(null);
      setError(null);
      
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
        await handleTextEnhancement();
      } else {
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
      console.log('🚨🚨🚨 TextInputComponent making DIRECT API call - NO CACHE!');
      
      const prompt = `Convert this scene description into structured JSON prompt fields. Return ONLY a JSON object.

Scene Description: "${textInput}"

Available fields: scene, character_type, setting, actions, emotions, lighting_type, time_of_day, camera_angle, camera_distance, style, color_palette, atmosphere, clothing, hair_color, hair_style, age, gender, environment.

Return ONLY valid JSON.`;

      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 800,
          model: 'llama-3.1-8b-instant'
        })
      });
      
      console.log('🔥 TextInputComponent API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🚨 TextInputComponent API error:', errorText);
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('🔥 TextInputComponent raw response (first 200 chars):', responseText.substring(0, 200));
      console.log('🔥 TextInputComponent response length:', responseText.length);
      
      let apiData;
      try {
        apiData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('🚨 TextInputComponent failed to parse API response:', parseError);
        console.error('🚨 TextInputComponent raw response:', responseText);
        throw new Error(`Invalid JSON response from server: ${parseError.message}`);
      }
      
      console.log('🔥 TextInputComponent API data received:', apiData);
      
      if (!apiData.choices?.[0]?.message?.content) {
        console.error('🚨 TextInputComponent invalid response structure:', apiData);
        throw new Error('Invalid response structure from API');
      }
      
      const aiContent = apiData.choices[0].message.content;
      console.log('🔥 TextInputComponent AI content:', aiContent);

      // Parse the AI response
      let jsonData;
      try {
        let cleanedResponse = aiContent.trim();
        cleanedResponse = cleanedResponse.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '');
        cleanedResponse = cleanedResponse.replace(/```\s*/gi, '');
        
        const jsonStart = cleanedResponse.indexOf('{');
        const jsonEnd = cleanedResponse.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
        }
        
        console.log('🔍 TextInputComponent cleaned JSON:', cleanedResponse);
        jsonData = JSON.parse(cleanedResponse);
        console.log('🔍 TextInputComponent parsed JSON:', jsonData);
      } catch (parseError) {
        console.error('🚨 TextInputComponent JSON parsing error:', parseError);
        console.error('🚨 TextInputComponent AI content:', aiContent);
        throw new Error('AI returned invalid JSON format. Please try again.');
      }

      // Update form fields
      Object.entries(jsonData).forEach(([fieldKey, fieldValue]) => {
        if (fieldValue && typeof fieldValue === 'string' && fieldValue.trim()) {
          setFieldValue(fieldKey, fieldValue.trim());
        }
      });

      setHasConverted(true);
      setLastConvertedInput(textInput);

    } catch (err) {
      console.error('🚨 TextInputComponent text conversion error:', err);
      setError(err.message || 'An error occurred during text conversion. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleTextEnhancement = async () => {
    setIsConverting(true);
    setError(null);
    setEnhanceCount(prev => prev + 1);

    try {
      console.log('🚨🚨🚨 TextInputComponent making ENHANCEMENT API call - NO CACHE!');
      
      const currentFields = Object.entries(fieldValues)
        .filter(([key, value]) => value && value.trim() !== '')
        .map(([key, value]) => `- ${key}: "${value}"`)
        .join('\n');

      const enhancementPrompt = `Enhance these existing JSON fields with more detail:

Original input: "${textInput}"
Current fields:
${currentFields}

Return enhanced JSON with richer descriptions.`;

      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are an expert at enhancing creative content with rich details.' },
            { role: 'user', content: enhancementPrompt }
          ],
          temperature: 0.8,
          max_tokens: 1000,
          model: 'llama-3.1-8b-instant'
        })
      });
      
      console.log('🔥 TextInputComponent enhancement response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🚨 TextInputComponent enhancement error:', errorText);
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('🔥 TextInputComponent enhancement raw response (first 200 chars):', responseText.substring(0, 200));
      
      let apiData;
      try {
        apiData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('🚨 TextInputComponent enhancement parse error:', parseError);
        console.error('🚨 TextInputComponent raw response:', responseText);
        throw new Error(`Invalid JSON response: ${parseError.message}`);
      }
      
      if (!apiData.choices?.[0]?.message?.content) {
        console.error('🚨 TextInputComponent invalid enhancement response:', apiData);
        throw new Error('Invalid response structure');
      }
      
      const aiContent = apiData.choices[0].message.content;
      console.log('🔥 TextInputComponent enhancement AI content:', aiContent);

      let jsonData;
      try {
        let cleanedResponse = aiContent.trim();
        cleanedResponse = cleanedResponse.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '');
        cleanedResponse = cleanedResponse.replace(/```\s*/gi, '');
        
        const jsonStart = cleanedResponse.indexOf('{');
        const jsonEnd = cleanedResponse.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
        }
        
        console.log('🔍 TextInputComponent enhancement cleaned JSON:', cleanedResponse);
        jsonData = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('🚨 TextInputComponent enhancement JSON error:', parseError);
        throw new Error('AI returned invalid JSON format. Please try again.');
      }

      Object.entries(jsonData).forEach(([fieldKey, fieldValue]) => {
        if (fieldValue && typeof fieldValue === 'string' && fieldValue.trim()) {
          setFieldValue(fieldKey, fieldValue.trim());
        }
      });

    } catch (err) {
      console.error('🚨 TextInputComponent enhancement error:', err);
      setError(err.message || 'An error occurred during text enhancement.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleImageToJson = async () => {
    setIsConverting(true);
    setError(null);
    try {
      setError('Image analysis not implemented yet');
    } catch (err) {
      setError(err.message || 'An error occurred during image analysis.');
    } finally {
      setIsConverting(false);
    }
  };

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

export default TextInputComponent;