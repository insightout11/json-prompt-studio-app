import React, { useState, useEffect } from 'react';
import aiApiService from './aiApiService';
import jsonValidator from './jsonValidator';
import { CONTINUATION_TYPES } from './aiSystemPrompts';

const SceneExtenderModal = ({ isOpen, onClose, onResult, currentJson }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = config, 1 = generating, 2 = results
  const [selectedType, setSelectedType] = useState('logical');
  const [extensionMode, setExtensionMode] = useState('single'); // single or multiple
  const [contextSettings, setContextSettings] = useState({
    preserveStyle: true,
    enhanceVisuals: false,
    maintainTone: true,
    addDetails: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [extensionResults, setExtensionResults] = useState([]);
  const [error, setError] = useState(null);

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen]);

  const resetModal = () => {
    setCurrentStep(0);
    setSelectedType('logical');
    setExtensionMode('single');
    setContextSettings({
      preserveStyle: true,
      enhanceVisuals: false,
      maintainTone: true,
      addDetails: true
    });
    setIsGenerating(false);
    setExtensionResults([]);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!currentJson || Object.keys(currentJson).length === 0) {
      setError('No scene to extend. Please create a scene first.');
      return;
    }

    if (!aiApiService.hasApiKey()) {
      setError('Groq API key required. Please set your API key in settings.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentStep(1);
    setExtensionResults([]);

    try {
      if (extensionMode === 'multiple') {
        await generateMultipleExtensions();
      } else {
        await generateSingleExtension(selectedType);
      }
      setCurrentStep(2);
    } catch (err) {
      console.error('Scene extension error:', err);
      setError('Failed to generate scene extension. Please try again.');
      setCurrentStep(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSingleExtension = async (continuationType) => {
    const additionalContext = {
      contextSettings: contextSettings,
      preserveStyle: contextSettings.preserveStyle,
      enhanceVisuals: contextSettings.enhanceVisuals,
      maintainTone: contextSettings.maintainTone,
      addDetails: contextSettings.addDetails
    };

    const response = await aiApiService.extendScene(
      currentJson, 
      continuationType, 
      additionalContext
    );

    if (response.success) {
      const validationResult = jsonValidator.validateAndRepair(
        response.scene, 
        currentJson
      );

      const extendedScene = {
        ...validationResult.data,
        _metadata: {
          continuationType: continuationType,
          originalScene: currentJson,
          aiGenerated: true,
          timestamp: Date.now(),
          usage: response.usage,
          validationWarnings: validationResult.warnings,
          validationRepairs: validationResult.repairs
        }
      };

      setExtensionResults([{
        id: Date.now(),
        type: continuationType,
        scene: extendedScene,
        success: true,
        metadata: response.metadata
      }]);
    } else {
      throw new Error(response.error || 'Failed to generate extension');
    }
  };

  const generateMultipleExtensions = async () => {
    const types = ['logical', 'twist', 'genreShift', 'characterDevelopment'];
    const results = [];
    
    for (const type of types) {
      try {
        await generateSingleExtension(type);
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.warn(`Failed to generate ${type} extension:`, error);
        // Continue with other types even if one fails
      }
    }
  };

  const handleApplyExtension = (result) => {
    if (onResult) {
      onResult(result.scene);
    }
    onClose();
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  // Get icon for continuation type
  const getTypeIcon = (type) => {
    const icons = {
      logical: '🔗',
      twist: '🌪️',
      genreShift: '🎭',
      characterDevelopment: '👤',
      flashback: '⏮️',
      timeSkip: '⏭️',
      alternateReality: '🌀',
      environmentalEscalation: '🌍'
    };
    return icons[type] || '🎬';
  };

  // Get color for continuation type
  const getTypeColor = (type) => {
    const colors = {
      logical: 'blue',
      twist: 'purple',
      genreShift: 'orange',
      characterDevelopment: 'green',
      flashback: 'indigo',
      timeSkip: 'cyan',
      alternateReality: 'pink',
      environmentalEscalation: 'emerald'
    };
    return colors[type] || 'gray';
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
                ✨ Scene Extender
              </h2>
              <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                Extend your current scene with AI-generated variations and continuations
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
          {/* Step 0: Configuration */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-3">
                  Configure Scene Extension
                </h3>
                
                {/* Extension Mode Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-3">
                    Extension Mode
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setExtensionMode('single')}
                      className={`p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                        extensionMode === 'single'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-cinema-border hover:border-purple-300 dark:hover:border-purple-600'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">🎯</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-cinema-text mb-1">
                            Single Extension
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-cinema-text-muted">
                            Generate one targeted extension based on your selected continuation type
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setExtensionMode('multiple')}
                      className={`p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                        extensionMode === 'multiple'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-cinema-border hover:border-purple-300 dark:hover:border-purple-600'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">✨</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-cinema-text mb-1">
                            Multiple Extensions
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-cinema-text-muted">
                            Generate 4 different extensions automatically for variety
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Extension Type Selection (for single mode) */}
                {extensionMode === 'single' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-3">
                      Choose Extension Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {CONTINUATION_TYPES.slice(0, 6).map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`p-3 text-left border-2 rounded-lg transition-all duration-200 ${
                            selectedType === type.id
                              ? `border-${getTypeColor(type.id)}-500 bg-${getTypeColor(type.id)}-50 dark:bg-${getTypeColor(type.id)}-900/20`
                              : 'border-gray-200 dark:border-cinema-border hover:border-purple-300 dark:hover:border-purple-600'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-xl">{getTypeIcon(type.id)}</span>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-cinema-text text-sm mb-1">
                                {type.name}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-cinema-text-muted">
                                {type.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Context Settings */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-3">
                    Extension Settings
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center p-3 border border-gray-200 dark:border-cinema-border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-cinema-card transition-colors">
                      <input
                        type="checkbox"
                        checked={contextSettings.preserveStyle}
                        onChange={(e) => setContextSettings(prev => ({
                          ...prev,
                          preserveStyle: e.target.checked
                        }))}
                        className="mr-3"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-cinema-text">Preserve Visual Style</span>
                        <p className="text-xs text-gray-600 dark:text-cinema-text-muted">Keep the same visual aesthetic</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 border border-gray-200 dark:border-cinema-border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-cinema-card transition-colors">
                      <input
                        type="checkbox"
                        checked={contextSettings.maintainTone}
                        onChange={(e) => setContextSettings(prev => ({
                          ...prev,
                          maintainTone: e.target.checked
                        }))}
                        className="mr-3"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-cinema-text">Maintain Tone & Mood</span>
                        <p className="text-xs text-gray-600 dark:text-cinema-text-muted">Keep consistent emotional atmosphere</p>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-200 dark:border-cinema-border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-cinema-card transition-colors">
                      <input
                        type="checkbox"
                        checked={contextSettings.enhanceVisuals}
                        onChange={(e) => setContextSettings(prev => ({
                          ...prev,
                          enhanceVisuals: e.target.checked
                        }))}
                        className="mr-3"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-cinema-text">Enhance Visual Details</span>
                        <p className="text-xs text-gray-600 dark:text-cinema-text-muted">Add richer visual descriptions</p>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-200 dark:border-cinema-border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-cinema-card transition-colors">
                      <input
                        type="checkbox"
                        checked={contextSettings.addDetails}
                        onChange={(e) => setContextSettings(prev => ({
                          ...prev,
                          addDetails: e.target.checked
                        }))}
                        className="mr-3"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-cinema-text">Add Rich Details</span>
                        <p className="text-xs text-gray-600 dark:text-cinema-text-muted">Include additional descriptive elements</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Current Scene Preview */}
              {currentJson?.scene && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-purple-600 dark:text-purple-400">🎬</span>
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                      Current Scene Preview
                    </span>
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-400">
                    {currentJson.scene.length > 150 
                      ? `${currentJson.scene.substring(0, 150)}...` 
                      : currentJson.scene
                    }
                  </p>
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
                  onClick={handleGenerate}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all shadow-lg"
                >
                  {extensionMode === 'multiple' ? 'Generate 4 Extensions' : 'Generate Extension'}
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Generating */}
          {currentStep === 1 && (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-2">
                Extending Your Scene
              </h3>
              <p className="text-sm text-gray-600 dark:text-cinema-text-muted mb-4">
                {extensionMode === 'multiple' 
                  ? 'Generating multiple scene extensions...' 
                  : `Generating ${CONTINUATION_TYPES.find(t => t.id === selectedType)?.name} extension...`
                }
              </p>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center space-x-2">
                  <span>⬇️</span>
                  <span className="text-sm text-purple-700 dark:text-purple-300">
                    Extension results will appear below when complete
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Results */}
          {currentStep === 2 && extensionResults.length > 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-3">
                  Scene Extension Complete!
                </h3>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">✅</span>
                    <span className="font-medium text-green-800 dark:text-green-200">
                      Generated {extensionResults.length} extension{extensionResults.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Extension Results */}
              <div className="space-y-4">
                {extensionResults.map((result) => (
                  <div key={result.id} className="bg-white dark:bg-cinema-card border border-gray-200 dark:border-cinema-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getTypeIcon(result.type)}</span>
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-cinema-text">
                            {CONTINUATION_TYPES.find(t => t.id === result.type)?.name || result.type}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                            {CONTINUATION_TYPES.find(t => t.id === result.type)?.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleApplyExtension(result)}
                        className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        Apply Extension
                      </button>
                    </div>
                    
                    {/* Scene Preview */}
                    <div className="bg-gray-50 dark:bg-cinema-card rounded-lg p-3">
                      <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                        <strong>Extended Scene:</strong> {result.scene.scene?.substring(0, 200)}...
                      </p>
                      {result.scene.setting && (
                        <p className="text-sm text-gray-600 dark:text-cinema-text-muted mt-2">
                          <strong>Setting:</strong> {result.scene.setting}
                        </p>
                      )}
                    </div>

                    {/* Metadata */}
                    {result.scene._metadata && result.scene._metadata.validationWarnings?.length > 0 && (
                      <div className="mt-3 text-xs text-orange-600 dark:text-orange-400">
                        ⚠️ {result.scene._metadata.validationWarnings.length} validation warnings
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                  Done
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

export default SceneExtenderModal;