import React, { useState, useRef } from 'react';
import aiApiService from './aiApiService';
import jsonValidator from './jsonValidator';

const AIOptimizer = ({ 
  jsonPrompt, 
  onOptimized, 
  userPreferences = {},
  targetPlatform = 'video',
  className = "" 
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [optimizationHistory, setOptimizationHistory] = useState([]);
  const abortControllerRef = useRef(null);

  const optimizationModes = [
    { id: 'enhance', label: 'Enhance Quality', icon: '✨', description: 'Improve clarity and creativity' },
    { id: 'platform', label: 'Platform Optimize', icon: '📱', description: 'Optimize for specific platform' },
    { id: 'style', label: 'Style Match', icon: '🎨', description: 'Match your creative style' },
    { id: 'viral', label: 'Viral Potential', icon: '🔥', description: 'Maximize engagement potential' },
    { id: 'technical', label: 'Technical Polish', icon: '⚙️', description: 'Improve technical specifications' }
  ];

  const [selectedMode, setSelectedMode] = useState('enhance');

  const generateOptimizationPrompt = (mode) => {
    const basePrompt = `You are an expert AI prompt optimizer for ${targetPlatform} generation. Analyze and improve the following JSON prompt to make it more effective, creative, and engaging.

Original JSON prompt:
${JSON.stringify(jsonPrompt, null, 2)}

User preferences: ${JSON.stringify(userPreferences)}

Optimization mode: ${mode}

Instructions based on mode:`;

    const modeInstructions = {
      enhance: `
- Improve clarity and descriptiveness
- Add creative details that enhance visual appeal
- Ensure all fields work harmoniously together
- Suggest better camera angles, lighting, or composition
- Maintain the original intent while elevating quality`,

      platform: `
- Optimize for ${targetPlatform} best practices
- Suggest ideal aspect ratio and framing
- Recommend platform-specific elements
- Consider audience engagement patterns
- Adapt technical specifications for optimal output`,

      style: `
- Apply user's preferred creative style: ${userPreferences.style || 'cinematic'}
- Match preferred directors/influences: ${userPreferences.influences || 'various'}
- Incorporate preferred themes: ${userPreferences.themes || 'dynamic'}
- Ensure consistency with user's aesthetic preferences`,

      viral: `
- Identify elements that could increase shareability
- Suggest hooks or surprising elements
- Recommend trending visual styles or themes
- Add elements that encourage rewatching
- Balance viral potential with quality`,

      technical: `
- Optimize technical specifications
- Improve camera settings and movement
- Enhance lighting and color descriptions
- Refine timing and pacing elements
- Ensure professional production quality`
    };

    return basePrompt + modeInstructions[mode] + `

Return only the improved JSON object with the same structure. Add a "optimization_notes" field explaining key improvements made.`;
  };

  const optimizePrompt = async (mode = selectedMode) => {
    if (!jsonPrompt || Object.keys(jsonPrompt).length === 0) {
      setError('No prompt to optimize. Please create a prompt first.');
      return;
    }

    if (!aiApiService.hasApiKey()) {
      setError('OpenAI API key required. Please set your API key in settings.');
      return;
    }

    // Debug and validate mode parameter
    console.log('Raw mode parameter:', mode, 'Type:', typeof mode);
    
    // Ensure mode is a string and valid
    let validMode = mode;
    if (typeof mode !== 'string') {
      console.error('Mode is not a string:', mode);
      validMode = 'enhance'; // fallback to default
    }
    
    // Validate mode exists in our list
    const validModes = ['enhance', 'platform', 'style', 'viral', 'technical'];
    if (!validModes.includes(validMode)) {
      console.error('Invalid mode:', validMode);
      validMode = 'enhance'; // fallback to default
    }

    console.log('Using validated mode:', validMode);

    setIsOptimizing(true);
    setError(null);
    setOptimizationResult(null);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      console.log(`Optimizing prompt with mode: ${validMode}`);
      const response = await aiApiService.optimizePrompt(
        jsonPrompt, 
        validMode, 
        {
          ...userPreferences,
          platform: targetPlatform
        }
      );

      if (response.success) {
        // Validate and parse the AI response
        const validationResult = jsonValidator.validateAndRepair(
          response.optimizedPrompt, 
          jsonPrompt
        );

        const optimizedPrompt = {
          ...validationResult.data,
          _metadata: {
            optimizationType: mode,
            originalPrompt: jsonPrompt,
            aiGenerated: true,
            timestamp: Date.now(),
            usage: response.usage,
            validationWarnings: validationResult.warnings,
            validationRepairs: validationResult.repairs
          }
        };

        setOptimizationResult(optimizedPrompt);
        
        // Add to history
        setOptimizationHistory(prev => [{
          id: Date.now(),
          mode,
          result: optimizedPrompt,
          timestamp: Date.now()
        }, ...prev.slice(0, 4)]); // Keep last 5

        onOptimized && onOptimized(optimizedPrompt);

      } else {
        setError(response.error || 'Optimization failed. Please try again.');
      }
      
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Optimization cancelled by user');
      } else {
        setError(err.message || 'Optimization failed. Please try again.');
        console.error('Optimization error:', err);
      }
    } finally {
      setIsOptimizing(false);
      abortControllerRef.current = null;
    }
  };

  // Cancel ongoing optimization
  const cancelOptimization = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsOptimizing(false);
      setError('Optimization cancelled by user');
    }
  };

  // Apply optimization from history
  const applyFromHistory = (historyItem) => {
    setOptimizationResult(historyItem.result);
    onOptimized && onOptimized(historyItem.result);
  };

  return (
    <div className={`ai-optimizer ${className}`}>
      {/* Main Optimize Button */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowOptions(!showOptions)}
          disabled={isOptimizing}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 h-10 shadow-lg hover:shadow-xl ${
            isOptimizing
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
          }`}
        >
          {isOptimizing ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Optimizing...</span>
              <button 
                onClick={cancelOptimization}
                className="ml-2 px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>AI Optimize</span>
              <svg className={`w-4 h-4 transition-transform ${showOptions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>

        {!showOptions && (
          <button
            onClick={optimizePrompt}
            disabled={isOptimizing}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-md transition-all duration-300 h-10 shadow-lg hover:shadow-xl"
          >
            Quick Optimize
          </button>
        )}
      </div>

      {/* Optimization Options */}
      {showOptions && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-cinema-card rounded-lg border border-gray-200 dark:border-cinema-border">
          <h3 className="text-sm font-medium text-gray-900 dark:text-cinema-text mb-3">
            Choose Optimization Mode:
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {optimizationModes.map((mode) => (
              <label
                key={mode.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedMode === mode.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-cinema-border hover:border-purple-300'
                }`}
              >
                <input
                  type="radio"
                  name="optimization-mode"
                  value={mode.id}
                  checked={selectedMode === mode.id}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{mode.icon}</span>
                    <span className="font-medium text-gray-900 dark:text-cinema-text">
                      {mode.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-cinema-text-muted mt-1">
                    {mode.description}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={optimizePrompt}
            disabled={isOptimizing}
            className="w-full py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl h-10"
          >
            {isOptimizing ? 'Optimizing...' : `Optimize with ${optimizationModes.find(m => m.id === selectedMode)?.label}`}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Optimization Result */}
      {optimizationResult && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Optimization Complete!
            </span>
          </div>
          {optimizationResult.optimization_notes && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {optimizationResult.optimization_notes}
            </p>
          )}
          
          {/* Metadata Info */}
          {optimizationResult._metadata && (
            <div className="mt-2 text-xs text-green-500 dark:text-green-400">
              {optimizationResult._metadata.validationWarnings?.length > 0 && (
                <p>⚠️ {optimizationResult._metadata.validationWarnings.length} validation warnings</p>
              )}
              {optimizationResult._metadata.validationRepairs?.length > 0 && (
                <p>🔧 {optimizationResult._metadata.validationRepairs.length} repairs made</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Optimization History */}
      {optimizationHistory.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-cinema-card rounded-lg border border-gray-200 dark:border-cinema-border">
          <h4 className="text-sm font-medium text-gray-900 dark:text-cinema-text mb-2">
            Recent Optimizations
          </h4>
          <div className="space-y-2">
            {optimizationHistory.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-2 bg-white dark:bg-cinema-bg rounded border cursor-pointer hover:border-purple-300"
                onClick={() => applyFromHistory(item)}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded">
                    {optimizationModes.find(m => m.id === item.mode)?.label || item.mode}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <button className="text-xs text-purple-600 hover:text-purple-700">
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Key Setup Prompt */}
      {!aiApiService.hasApiKey() && (
        <div className="mt-4 p-4 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-700/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h4 className="font-medium text-orange-800 dark:text-orange-200">
              OpenAI API Key Required
            </h4>
          </div>
          <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
            AI Optimizer requires an OpenAI API key to generate optimizations.
          </p>
          <button 
            onClick={() => {
              const key = prompt('Enter your OpenAI API key:');
              if (key) {
                aiApiService.setApiKey(key);
              }
            }}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl h-10"
          >
            Set API Key
          </button>
        </div>
      )}
    </div>
  );
};

export default AIOptimizer;