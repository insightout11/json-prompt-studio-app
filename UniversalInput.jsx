import React, { useState, useRef, useEffect } from 'react';
import aiApiService from './aiApiService';
import usePromptStore from './store';

const UniversalInput = ({ className = "" }) => {
  const [textInput, setTextInput] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [inputMode, setInputMode] = useState('text-to-json');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { setFieldValue } = usePromptStore();
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      // Min height: single line (~40px), Max height: 120px (3 lines)
      textarea.style.height = Math.min(Math.max(scrollHeight, 40), 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [textInput]);

  const handleConvert = async () => {
    if (inputMode === 'text-to-json') {
      if (!textInput.trim()) {
        setError('Please enter a scene description');
        return;
      }
      await handleTextToJson();
    } else if (inputMode === 'image-to-json') {
      if (!uploadedImage) {
        setError('Please upload an image first');
        return;
      }
      if (!aiApiService.hasApiKey()) {
        setError('OpenAI API key required. Please set your API key in settings.');
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
        model: 'gpt-4o-mini',
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
          setFieldValue(fieldKey, fieldValue.trim());
        }
      });

      // Clear the input after successful conversion
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

  const handleImageToJson = async () => {
    if (!uploadedImage || !imagePreview) {
      setError('Please upload an image first');
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      const result = await aiApiService.analyzeImage(imagePreview);
      
      if (result.success && result.fields) {
        // Auto-select high confidence fields and apply them
        Object.entries(result.fields).forEach(([fieldKey, fieldData]) => {
          if (fieldData.confidence >= 0.7 && fieldData.value && typeof fieldData.value === 'string') {
            setFieldValue(fieldKey, fieldData.value.trim());
          }
        });

        // Clear the uploaded image after successful conversion
        setUploadedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
      } else {
        setError(result.error || 'Failed to analyze image. Please try again.');
      }
    } catch (err) {
      console.error('Image analysis error:', err);
      if (err.message.includes('timed out') || err.name === 'AbortError') {
        setError('Image analysis timed out after 90 seconds. Please try a smaller image or check your connection.');
      } else if (err.message.includes('API key')) {
        setError('OpenAI API key required. Please set your API key in settings.');
      } else {
        setError('Failed to analyze image. Please check your connection and try again.');
      }
    } finally {
      setIsConverting(false);
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
    { value: 'image-to-json', label: 'Image → JSON', icon: '📸' },
    { value: 'manual', label: 'Manual', icon: '✏️' }
  ];

  const currentMode = modeOptions.find(mode => mode.value === inputMode);

  return (
    <div className={`bg-white dark:bg-cinema-card rounded-lg border border-gray-200 dark:border-cinema-border ${className}`}>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Input area - changes based on mode */}
          <div className="flex-1">
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
                
                {/* Input helpers */}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500 dark:text-cinema-text-muted">
                    Ctrl+Enter to convert
                  </span>
                  <span className="text-xs text-gray-500 dark:text-cinema-text-muted">
                    {textInput.length}/500
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Mode dropdown */}
          <div className="flex-shrink-0">
            <select
              value={inputMode}
              onChange={(e) => setInputMode(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 dark:border-cinema-border rounded-md bg-white dark:bg-cinema-panel text-gray-700 dark:text-cinema-text focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              disabled={isConverting}
            >
              {modeOptions.map(mode => (
                <option key={mode.value} value={mode.value}>
                  {mode.icon} {mode.label}
                </option>
              ))}
            </select>
          </div>

          {/* Convert button */}
          <button
            onClick={handleConvert}
            disabled={isConverting || (inputMode === 'text-to-json' && !textInput.trim()) || (inputMode === 'image-to-json' && !uploadedImage)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center space-x-2 flex-shrink-0 ${
              isConverting || (inputMode === 'text-to-json' && !textInput.trim()) || (inputMode === 'image-to-json' && !uploadedImage)
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg'
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
                <span>{currentMode?.icon}</span>
                <span>Convert</span>
              </>
            )}
          </button>
        </div>

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