import React, { useState, useRef, useEffect } from 'react';
import usePromptStore from './store';

const UniversalInput = ({ className = "", aiFeatures = null, resetTrigger }) => {
  console.log('🚨🚨🚨 FIXED UniversalInput component loaded - DIRECT API CALLS 🚨🚨🚨');
  
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
    console.log('🎯 FIXED UniversalInput resetTrigger changed:', resetTrigger);
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
      console.log('🚨🚨🚨 FIXED UniversalInput making DIRECT API call for text-to-json');
      
      const prompt = `Convert this scene description into structured JSON prompt fields. Return ONLY a JSON object.

Scene Description: "${textInput}"

Extract relevant details for these fields:
- scene: Overall scene description
- character_type: Type of character (human, animal, etc.)
- setting: Location/environment  
- actions: What's happening
- emotions: Character emotions/mood
- lighting_type: Lighting conditions
- time_of_day: Time setting
- camera_angle: Camera perspective
- camera_distance: Shot type (close-up, medium, wide)
- style: Visual style
- color_palette: Color scheme
- atmosphere: Overall mood
- clothing: Character clothing
- hair_color: Hair color if applicable
- hair_style: Hair style if applicable
- age: Approximate age
- gender: Gender if applicable
- environment: Weather/conditions

Return ONLY valid JSON with fields you're confident about. Use descriptive but concise values.`;

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
      
      console.log('🔥 FIXED API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🚨 FIXED API error:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }
      
      const responseText = await response.text();
      console.log('🔥 FIXED raw response (first 200 chars):', responseText.substring(0, 200));
      
      let apiData;
      try {
        apiData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('🚨 FIXED failed to parse API response:', parseError);
        console.error('🚨 FIXED raw response:', responseText);
        throw new Error(`Invalid JSON response from server: ${parseError.message}`);
      }
      
      console.log('🔥 FIXED API data received:', apiData);
      
      if (!apiData.choices?.[0]?.message?.content) {
        console.error('🚨 FIXED invalid response structure:', apiData);
        throw new Error('Invalid response structure from API');
      }
      
      const aiContent = apiData.choices[0].message.content;
      console.log('🔥 FIXED AI content:', aiContent);

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
        
        console.log('🔍 FIXED cleaned JSON:', cleanedResponse);
        jsonData = JSON.parse(cleanedResponse);
        console.log('🔍 FIXED parsed JSON:', jsonData);
      } catch (parseError) {
        console.error('🚨 FIXED JSON parsing error:', parseError);
        console.error('🚨 FIXED AI content:', aiContent);
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
      console.error('🚨 FIXED text conversion error:', err);
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
      console.log('🚨🚨🚨 FIXED UniversalInput making DIRECT API call for enhancement');
      
      const currentFields = Object.entries(fieldValues)
        .filter(([key, value]) => value && String(value).trim() !== '')
        .map(([key, value]) => `- ${key}: "${String(value)}"`)
        .join('\n');

      const enhancementPrompt = `Enhance these existing JSON fields with more depth and specificity:

Original input: "${textInput}"

Current fields:
${currentFields}

INSTRUCTIONS:
1. Keep all existing content but make it MORE detailed and specific
2. Add new complementary fields that weren't filled before
3. Focus on adding layers of detail, specificity, and richness
4. Return enhanced JSON with ALL fields (existing + new ones)

Return enhanced JSON with richer, more detailed descriptions.`;

      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      
      console.log('🔥 FIXED enhancement response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🚨 FIXED enhancement error:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }
      
      const responseText = await response.text();
      console.log('🔥 FIXED enhancement raw response (first 200 chars):', responseText.substring(0, 200));
      
      let apiData;
      try {
        apiData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('🚨 FIXED enhancement parse error:', parseError);
        console.error('🚨 FIXED raw response:', responseText);
        throw new Error(`Invalid JSON response: ${parseError.message}`);
      }
      
      if (!apiData.choices?.[0]?.message?.content) {
        console.error('🚨 FIXED invalid enhancement response:', apiData);
        throw new Error('Invalid response structure');
      }
      
      const aiContent = apiData.choices[0].message.content;
      console.log('🔥 FIXED enhancement AI content:', aiContent);

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
        
        console.log('🔍 FIXED enhancement cleaned JSON:', cleanedResponse);
        jsonData = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('🚨 FIXED enhancement JSON error:', parseError);
        throw new Error('AI returned invalid JSON format. Please try again.');
      }

      Object.entries(jsonData).forEach(([fieldKey, fieldValue]) => {
        if (fieldValue && typeof fieldValue === 'string' && fieldValue.trim()) {
          setFieldValue(fieldKey, fieldValue.trim());
        }
      });

    } catch (err) {
      console.error('🚨 FIXED enhancement error:', err);
      setError(err.message || 'An error occurred during text enhancement.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleImageToJson = async () => {
    setIsConverting(true);
    setError(null);
    try {
      setError('Image analysis not implemented in this version yet');
    } catch (err) {
      setError(err.message || 'An error occurred during image analysis.');
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

  // Image handling functions
  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Please upload a JPG, PNG, or WebP image file.');
    }

    if (file.size > maxSize) {
      throw new Error('Image file must be smaller than 10MB.');
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file) => {
    try {
      setError(null);
      validateFile(file);
      
      const base64 = await fileToBase64(file);
      setUploadedImage(file);
      setImagePreview(base64);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const modeOptions = [
    { value: 'text-to-json', label: 'Text → JSON', icon: '✨' },
    { value: 'image-to-json', label: 'Image → JSON', icon: '📸' }
  ];

  const currentMode = modeOptions.find(mode => mode.value === inputMode);

  return (
    <div className={`bg-white dark:bg-cinema-card rounded-lg shadow-lg dark:shadow-glow-soft border border-gray-200 dark:border-cinema-border max-sm:mb-0 ${className}`}>
      <div className="p-4 max-sm:p-0 max-sm:pb-1">
        <div className="flex flex-row items-start space-x-3 min-[1024px]:max-[1279px]:flex-col min-[1024px]:max-[1279px]:space-x-0 min-[1024px]:max-[1279px]:space-y-3 max-sm:flex-col max-sm:space-x-0 max-sm:space-y-1 max-sm:items-center">
          {/* Input area - changes based on mode */}
          <div className="flex-1 min-[1024px]:max-[1279px]:w-full max-sm:w-full">
            {inputMode === 'image-to-json' ? (
              // Image upload area
              <div>
                {!imagePreview ? (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-md p-4 text-center transition-colors hover:border-blue-400 dark:hover:border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="space-y-2">
                      <div className="text-2xl">📸</div>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-cinema-text font-medium">
                          Upload Image to Analyze
                        </p>
                        <p className="text-xs text-gray-500 dark:text-cinema-text-muted">
                          Drag & drop or click to select • JPG, PNG, WebP • Max 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Image preview
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Upload preview"
                      className="w-full max-h-32 object-contain rounded-md border border-gray-200 dark:border-cinema-border"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs transition-colors"
                      title="Remove image"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="mt-1 text-xs text-gray-500 dark:text-cinema-text-muted">
                      {uploadedImage.name} • {(uploadedImage.size / 1024).toFixed(1)}KB
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              // Text input area
              <div>
                <textarea
                  ref={textareaRef}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your scene in natural language... e.g., 'A young woman with long brown hair sitting in a cozy coffee shop, reading a book while rain falls outside the window'"
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-cinema-border rounded-md bg-white dark:bg-cinema-panel text-gray-700 dark:text-cinema-text placeholder-gray-500 dark:placeholder-cinema-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none overflow-hidden"
                  style={{ minHeight: '40px' }}
                  disabled={isConverting}
                  rows={1}
                />
              </div>
            )}
          </div>

          {/* Mode toggle and Convert button - stacked vertically */}
          <div className="flex flex-col space-y-2 flex-shrink-0 min-[1024px]:max-[1279px]:flex-row min-[1024px]:max-[1279px]:space-y-0 min-[1024px]:max-[1279px]:space-x-3 min-[1024px]:max-[1279px]:justify-center min-[1024px]:max-[1279px]:w-full max-sm:flex-row max-sm:space-y-0 max-sm:space-x-2 max-sm:justify-center max-sm:items-center">
            {/* Toggle Switch */}
            <div className="flex items-center space-x-2 max-sm:space-x-1 bg-gray-100 dark:bg-cinema-border rounded-md p-1 max-sm:p-0.5">
              <button
                onClick={() => setInputMode('text-to-json')}
                disabled={isConverting}
                className={`px-3 py-1.5 max-sm:px-4 max-sm:py-2 text-sm max-sm:text-sm font-medium rounded transition-all duration-200 flex items-center space-x-1 max-sm:space-x-1 ${
                  inputMode === 'text-to-json'
                    ? 'bg-white dark:bg-cinema-card text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-cinema-text-muted hover:text-gray-800 dark:hover:text-cinema-text'
                }`}
              >
                <span className="max-sm:text-sm">✨</span>
                <span className="max-sm:hidden">Text</span>
              </button>
              <button
                onClick={() => setInputMode('image-to-json')}
                disabled={isConverting}
                className={`px-3 py-1.5 max-sm:px-4 max-sm:py-2 text-sm max-sm:text-sm font-medium rounded transition-all duration-200 flex items-center space-x-1 max-sm:space-x-1 ${
                  inputMode === 'image-to-json'
                    ? 'bg-white dark:bg-cinema-card text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-cinema-text-muted hover:text-gray-800 dark:hover:text-cinema-text'
                }`}
              >
                <span className="max-sm:text-sm">📸</span>
                <span className="max-sm:hidden">Image</span>
              </button>
            </div>

            <button
              data-tutorial="convert-button"
              onClick={handleConvert}
              disabled={isConverting || (inputMode === 'text-to-json' && !textInput.trim()) || (inputMode === 'image-to-json' && !uploadedImage)}
              title={
                inputMode === 'text-to-json' && hasConverted && textInput === lastConvertedInput
                  ? `Enhance existing fields with more detail${enhanceCount > 0 ? ` (Enhanced ${enhanceCount} time${enhanceCount === 1 ? '' : 's'})` : ''}`
                  : inputMode === 'text-to-json'
                  ? 'Convert text description to JSON fields'
                  : 'Analyze image and extract scene details'
              }
              className={`px-4 py-2 max-sm:px-6 max-sm:py-3 rounded-md text-sm max-sm:text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 max-sm:space-x-2 ${
                isConverting || (inputMode === 'text-to-json' && !textInput.trim()) || (inputMode === 'image-to-json' && !uploadedImage)
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : inputMode === 'text-to-json' && hasConverted && textInput === lastConvertedInput
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {isConverting ? (
                <>
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {inputMode === 'text-to-json' && hasConverted && textInput === lastConvertedInput ? 'Enhancing Scene...' : inputMode === 'image-to-json' ? 'Analyzing Image...' : 'Converting Text...'}
                      </span>
                      <span className="text-xs opacity-75">
                        {inputMode === 'text-to-json' && hasConverted && textInput === lastConvertedInput ? 'Adding more detail' : inputMode === 'image-to-json' ? 'Processing with AI vision' : 'Generating JSON fields'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span>{inputMode === 'text-to-json' && hasConverted && textInput === lastConvertedInput ? '🎨' : currentMode?.icon}</span>
                  <span>
                    {inputMode === 'text-to-json' && hasConverted && textInput === lastConvertedInput 
                      ? `Enhance${enhanceCount > 0 ? ` (${enhanceCount})` : ''}` 
                      : 'Convert'
                    }
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Features positioned directly under Text/Image/Convert buttons */}
        {aiFeatures && (
          <div className="flex justify-end mt-2 min-[1024px]:max-[1279px]:justify-center max-sm:justify-center">
            <div className="flex items-center">
              {aiFeatures}
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-md p-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-xs text-red-700 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalInput;