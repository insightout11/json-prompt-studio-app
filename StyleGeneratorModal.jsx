import React, { useState, useEffect } from 'react';
import aiApiService from './aiApiService';

const StyleGeneratorModal = ({ isOpen, onClose, onResult, currentJson }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = category, 1 = config, 2 = results
  const [selectedCategory, setSelectedCategory] = useState('presets');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStyle, setGeneratedStyle] = useState(null);
  const [error, setError] = useState(null);

  // Preset Styles
  const presetStyles = [
    {
      id: 'cinematic-epic',
      name: 'Cinematic Epic',
      icon: '🎬',
      description: 'Grand, sweeping cinematography with dramatic lighting',
      style: {
        cinematography: 'Wide establishing shots, dramatic low angles, golden hour lighting',
        mood: 'Epic, heroic, larger-than-life',
        color_palette: 'Warm golds, deep blues, high contrast',
        camera_movement: 'Slow, deliberate camera movements, crane shots'
      }
    },
    {
      id: 'noir-classic',
      name: 'Film Noir',
      icon: '🕵️',
      description: 'Classic noir with high contrast lighting and shadows',
      style: {
        cinematography: 'High contrast black and white, venetian blind shadows',
        mood: 'Dark, mysterious, atmospheric',
        color_palette: 'Monochromatic, stark contrasts, deep shadows',
        camera_movement: 'Static shots, dramatic angles, close-ups'
      }
    },
    {
      id: 'horror-atmospheric',
      name: 'Atmospheric Horror',
      icon: '👻',
      description: 'Psychological horror with unsettling atmosphere',
      style: {
        cinematography: 'Low key lighting, practical shadows, handheld camera',
        mood: 'Tense, unsettling, claustrophobic',
        color_palette: 'Desaturated, cool blues, sickly greens',
        camera_movement: 'Shaky cam, slow zoom-ins, dutch angles'
      }
    },
    {
      id: 'sci-fi-futuristic',
      name: 'Sci-Fi Futuristic',
      icon: '🚀',
      description: 'High-tech futuristic with clean lines and neon',
      style: {
        cinematography: 'Clean compositions, LED lighting, chrome reflections',
        mood: 'Clinical, advanced, otherworldly',
        color_palette: 'Cool blues, bright whites, neon accents',
        camera_movement: 'Smooth tracking shots, precise framing'
      }
    },
    {
      id: 'vintage-film',
      name: 'Vintage Film',
      icon: '📼',
      description: 'Classic film stock with warm, nostalgic feel',
      style: {
        cinematography: 'Film grain, warm practical lighting, soft focus',
        mood: 'Nostalgic, romantic, timeless',
        color_palette: 'Sepia tones, warm ambers, soft contrasts',
        camera_movement: 'Traditional camera work, steady compositions'
      }
    },
    {
      id: 'documentary-style',
      name: 'Documentary Style',
      icon: '🎥',
      description: 'Realistic, handheld documentary aesthetic',
      style: {
        cinematography: 'Natural lighting, handheld camera, realistic framing',
        mood: 'Authentic, immediate, raw',
        color_palette: 'Natural colors, minimal color grading',
        camera_movement: 'Handheld, following action, organic movement'
      }
    }
  ];

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen]);

  const resetModal = () => {
    setCurrentStep(0);
    setSelectedCategory('presets');
    setSelectedPreset(null);
    setCustomPrompt('');
    setIsGenerating(false);
    setGeneratedStyle(null);
    setError(null);
  };

  const handleCategoryNext = () => {
    if (selectedCategory === 'presets' || (selectedCategory === 'ai' && customPrompt.trim())) {
      setCurrentStep(1);
    }
  };

  const handleGenerateAIStyle = async () => {
    if (!customPrompt.trim()) {
      setError('Please enter a style description');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await aiApiService.generateStyleFromDescription(customPrompt, currentJson);
      if (result.success && result.style) {
        setGeneratedStyle(result.style);
        setCurrentStep(2);
      } else {
        setError(result.error || 'Failed to generate style');
      }
    } catch (err) {
      console.error('Style generation error:', err);
      setError('Failed to generate style. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyPreset = () => {
    if (selectedPreset) {
      setCurrentStep(2);
    }
  };

  const handleApplyStyle = () => {
    let styleToApply = null;
    
    if (selectedCategory === 'presets' && selectedPreset) {
      styleToApply = {
        ...selectedPreset.style,
        applied_style: selectedPreset.name
      };
    } else if (selectedCategory === 'ai' && generatedStyle) {
      styleToApply = generatedStyle;
    }

    if (styleToApply && onResult) {
      onResult(styleToApply);
    }
    
    onClose();
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-xl dark:shadow-glow-soft max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-transparent dark:border-cinema-border">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-cinema-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-cinema-text mb-2">
                🎥 Style Generator
              </h2>
              <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                Apply cinematic styles, camera angles, and director aesthetics to your scene
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors"
            >
              ×
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center space-x-2 mt-4">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  step <= currentStep
                    ? 'bg-purple-500'
                    : 'bg-gray-200 dark:bg-cinema-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 0: Category Selection */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-3">
                  Choose Style Approach
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedCategory('presets')}
                    className={`p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                      selectedCategory === 'presets'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-cinema-border hover:border-purple-300 dark:hover:border-purple-600'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">🎭</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-cinema-text mb-1">
                          Preset Styles
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-cinema-text-muted">
                          Choose from curated cinematic styles like Film Noir, Sci-Fi, Horror, and more
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedCategory('ai')}
                    className={`p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                      selectedCategory === 'ai'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-cinema-border hover:border-purple-300 dark:hover:border-purple-600'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">🤖</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-cinema-text mb-1">
                          AI Generation
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-cinema-text-muted">
                          Describe your desired style and let AI generate custom cinematic elements
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* AI Style Input */}
              {selectedCategory === 'ai' && (
                <div className="bg-gray-50 dark:bg-cinema-card rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-cinema-text mb-3">
                    Describe Your Style
                  </h4>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g., 'Wes Anderson style with symmetrical framing and pastel colors' or 'Christopher Nolan dark and gritty with practical effects'"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-cinema-panel text-gray-900 dark:text-cinema-text"
                    rows={3}
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCategoryNext}
                  disabled={selectedCategory === 'ai' && !customPrompt.trim()}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    (selectedCategory === 'presets' || (selectedCategory === 'ai' && customPrompt.trim()))
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Configuration */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {selectedCategory === 'presets' && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-3">
                      Choose Preset Style
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {presetStyles.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => setSelectedPreset(preset)}
                          className={`p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                            selectedPreset?.id === preset.id
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : 'border-gray-200 dark:border-cinema-border hover:border-purple-300 dark:hover:border-purple-600'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl">{preset.icon}</span>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-cinema-text mb-1">
                                {preset.name}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-cinema-text-muted mb-2">
                                {preset.description}
                              </p>
                              {selectedPreset?.id === preset.id && (
                                <div className="text-xs text-purple-600 dark:text-purple-400 space-y-1">
                                  <div><strong>Mood:</strong> {preset.style.mood}</div>
                                  <div><strong>Palette:</strong> {preset.style.color_palette}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handleBack}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleApplyPreset}
                      disabled={!selectedPreset}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        selectedPreset
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Apply Style
                    </button>
                  </div>
                </>
              )}

              {selectedCategory === 'ai' && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-3">
                      Generate AI Style
                    </h3>
                    <div className="bg-gray-50 dark:bg-cinema-card rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-cinema-text-muted mb-2">
                        <strong>Your Style Request:</strong>
                      </p>
                      <p className="text-gray-800 dark:text-cinema-text italic">
                        "{customPrompt}"
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handleBack}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleGenerateAIStyle}
                      disabled={isGenerating}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        !isGenerating
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg'
                          : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      {isGenerating ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          <span>Generating...</span>
                        </div>
                      ) : (
                        'Generate Style'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Results */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-3">
                  Style Generated
                </h3>
                <div className="bg-gray-50 dark:bg-cinema-card rounded-lg p-6">
                  {selectedCategory === 'presets' && selectedPreset && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{selectedPreset.icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-cinema-text">
                            {selectedPreset.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                            {selectedPreset.description}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div>
                          <strong className="text-gray-900 dark:text-cinema-text">Cinematography:</strong>
                          <p className="text-gray-600 dark:text-cinema-text-muted">{selectedPreset.style.cinematography}</p>
                        </div>
                        <div>
                          <strong className="text-gray-900 dark:text-cinema-text">Mood:</strong>
                          <p className="text-gray-600 dark:text-cinema-text-muted">{selectedPreset.style.mood}</p>
                        </div>
                        <div>
                          <strong className="text-gray-900 dark:text-cinema-text">Color Palette:</strong>
                          <p className="text-gray-600 dark:text-cinema-text-muted">{selectedPreset.style.color_palette}</p>
                        </div>
                        <div>
                          <strong className="text-gray-900 dark:text-cinema-text">Camera Movement:</strong>
                          <p className="text-gray-600 dark:text-cinema-text-muted">{selectedPreset.style.camera_movement}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedCategory === 'ai' && generatedStyle && (
                    <div className="space-y-3 text-sm">
                      {Object.entries(generatedStyle).map(([key, value]) => (
                        <div key={key}>
                          <strong className="text-gray-900 dark:text-cinema-text capitalize">
                            {key.replace(/_/g, ' ')}:
                          </strong>
                          <p className="text-gray-600 dark:text-cinema-text-muted">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleApplyStyle}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all shadow-lg"
                >
                  Apply to Scene
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StyleGeneratorModal;