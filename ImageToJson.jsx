import React, { useState, useCallback } from 'react';
import aiApiService from './aiApiService';

const ImageToJson = ({ currentJson, onResult }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFields, setSelectedFields] = useState(new Set());

  // File validation
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

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (file) => {
    try {
      setError(null);
      validateFile(file);
      
      const base64 = await fileToBase64(file);
      setUploadedImage(file);
      setImagePreview(base64);
      setAnalysisResult(null);
      setSelectedFields(new Set());
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Analyze image with AI
  const analyzeImage = async () => {
    if (!uploadedImage || !imagePreview) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await aiApiService.analyzeImage(imagePreview);
      
      if (result.success && result.fields) {
        setAnalysisResult(result);
        
        // Auto-select high and medium confidence fields, user can review low confidence
        const highConfidenceFields = Object.entries(result.fields)
          .filter(([_, fieldData]) => fieldData.confidence >= 0.7)
          .map(([fieldKey, _]) => fieldKey);
        
        setSelectedFields(new Set(highConfidenceFields));
      } else {
        setError(result.error || 'Failed to analyze image. Please try again.');
      }
    } catch (err) {
      console.error('Image analysis error:', err);
      setError('Failed to analyze image. Please check your connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle field selection
  const toggleFieldSelection = (fieldKey) => {
    const newSelected = new Set(selectedFields);
    if (newSelected.has(fieldKey)) {
      newSelected.delete(fieldKey);
    } else {
      newSelected.add(fieldKey);
    }
    setSelectedFields(newSelected);
  };

  // Apply selected fields to JSON
  const applySelectedFields = () => {
    if (!analysisResult || selectedFields.size === 0) return;

    const fieldsToApply = {};
    selectedFields.forEach(fieldKey => {
      if (analysisResult.fields[fieldKey]) {
        fieldsToApply[fieldKey] = analysisResult.fields[fieldKey].value;
      }
    });

    onResult(fieldsToApply);
    
    // Clear current analysis to allow for new upload
    setUploadedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setSelectedFields(new Set());
  };

  // Clear everything
  const clearAll = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setSelectedFields(new Set());
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!imagePreview && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-lg p-8 text-center transition-colors hover:border-purple-400 dark:hover:border-purple-500 bg-purple-50/30 dark:bg-purple-900/10"
        >
          <div className="space-y-4">
            <div className="text-6xl">📸</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-2">
                Upload an Image to Analyze
              </h3>
              <p className="text-sm text-gray-600 dark:text-cinema-text-muted mb-4">
                Drag and drop an image here, or click to select
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg cursor-pointer transition-colors text-sm font-medium">
                  Choose Image
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-cinema-text-muted">
              Supports JPG, PNG, WebP • Max 10MB
            </p>
          </div>
        </div>
      )}

      {/* Image Preview and Analysis */}
      {imagePreview && (
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="bg-white dark:bg-cinema-card rounded-lg p-4 border border-gray-200 dark:border-cinema-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-cinema-text">
                📷 Image Preview
              </h3>
              <button
                onClick={clearAll}
                className="text-sm text-gray-500 hover:text-red-500 dark:text-cinema-text-muted dark:hover:text-red-400 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="relative">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="w-full max-w-md mx-auto rounded-lg shadow-md max-h-64 object-contain"
              />
            </div>
            <div className="mt-3 text-xs text-gray-500 dark:text-cinema-text-muted text-center">
              {uploadedImage.name} • {(uploadedImage.size / 1024).toFixed(1)}KB
            </div>
          </div>

          {/* Analyze Button */}
          {!analysisResult && (
            <div className="text-center">
              <button
                onClick={analyzeImage}
                disabled={isAnalyzing || !aiApiService.hasApiKey()}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${ 
                  isAnalyzing || !aiApiService.hasApiKey()
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isAnalyzing ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing Image...</span>
                  </div>
                ) : !aiApiService.hasApiKey() ? (
                  '🔑 API Key Required'
                ) : (
                  '🔍 Analyze with AI'
                )}
              </button>
              
              {!aiApiService.hasApiKey() && (
                <p className="text-xs text-gray-500 dark:text-cinema-text-muted mt-2">
                  Set your OpenAI API key in settings to use this feature
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="bg-white dark:bg-cinema-card rounded-lg p-4 border border-gray-200 dark:border-cinema-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-cinema-text">
              🎯 Detected Fields
            </h3>
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-cinema-text-muted">
                {selectedFields.size} of {Object.keys(analysisResult.fields).length} selected
              </div>
              {analysisResult.stats && (
                <div className="flex items-center space-x-2 text-xs mt-1">
                  <span className="flex items-center text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    {analysisResult.stats.highConfidence}
                  </span>
                  <span className="flex items-center text-yellow-600 dark:text-yellow-400">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                    {analysisResult.stats.mediumConfidence}
                  </span>
                  <span className="flex items-center text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                    {analysisResult.stats.lowConfidence}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Field Selection */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {Object.entries(analysisResult.fields).map(([fieldKey, fieldData]) => (
              <div 
                key={fieldKey}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedFields.has(fieldKey)
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-cinema-border hover:border-purple-300 dark:hover:border-purple-600'
                }`}
                onClick={() => toggleFieldSelection(fieldKey)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      selectedFields.has(fieldKey)
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300 dark:border-cinema-border'
                    }`}>
                      {selectedFields.has(fieldKey) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-800 dark:text-cinema-text text-sm">
                        {fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      {fieldData.confidence && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          fieldData.confidence > 0.8 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          fieldData.confidence > 0.6 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {Math.round(fieldData.confidence * 100)}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                      {fieldData.value}
                    </p>
                    {fieldData.reasoning && (
                      <p className="text-xs text-gray-500 dark:text-cinema-text-muted mt-1 italic">
                        💡 {fieldData.reasoning}
                      </p>
                    )}
                    {/* Show additional details for character-specific fields */}
                    {(fieldKey.includes('robot_') || fieldKey.includes('animal_') || fieldKey.includes('mythical_') || fieldKey.includes('creature_')) && (
                      <div className="mt-1 text-xs text-purple-600 dark:text-purple-400 font-medium">
                        🎯 Character-specific detail
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Apply Button */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm text-gray-600 dark:text-cinema-text-muted hover:text-gray-800 dark:hover:text-cinema-text transition-colors"
            >
              Try Another Image
            </button>
            <button
              onClick={applySelectedFields}
              disabled={selectedFields.size === 0}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                selectedFields.size === 0
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              Apply {selectedFields.size} Field{selectedFields.size !== 1 ? 's' : ''} to JSON
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-red-500 text-lg">⚠️</span>
            <div>
              <h4 className="font-medium text-red-700 dark:text-red-300 mb-1">
                Upload Error
              </h4>
              <p className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Usage Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700/50">
        <div className="flex items-start space-x-3">
          <span className="text-blue-500 dark:text-blue-400 text-lg">💡</span>
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
              Tips for Best Results
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• Use clear, well-lit images with distinct subjects for best results</li>
              <li>• AI provides detailed analysis for robots, creatures, humans, and fantasy characters</li>
              <li>• Extracts specific details like robot materials, griffin wing patterns, clothing styles</li>
              <li>• Focuses on recreatable details rather than generic descriptions</li>
              <li>• Higher resolution images yield more detailed character analysis</li>
              <li>• Review and customize detected fields before applying to your JSON</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageToJson;