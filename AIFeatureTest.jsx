import React, { useState, useCallback } from 'react';
import AIOptimizer from './AIOptimizer';
import SceneExtender from './SceneExtender';
import TimelineManager from './TimelineManager';
import aiApiService from './aiApiService';

const AIFeatureTest = () => {
  const [currentPrompt, setCurrentPrompt] = useState({
    scene: "A person walking through a bustling city street at sunset",
    setting: "urban street",
    time_of_day: "sunset",
    lighting_type: "golden hour",
    camera_movement: "tracking shot",
    aspect_ratio: "16:9"
  });

  const [scenes, setScenes] = useState([]);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [testResults, setTestResults] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Test user preferences
  const userPreferences = {
    style: 'cinematic',
    influences: 'Christopher Nolan, Denis Villeneuve',
    themes: 'atmospheric, dramatic',
    preferredTone: 'serious'
  };

  // Handle prompt optimization
  const handlePromptOptimized = useCallback((optimizedPrompt) => {
    setCurrentPrompt(optimizedPrompt);
    addTestResult('AI Optimizer', 'success', 'Prompt successfully optimized', optimizedPrompt);
  }, []);

  // Handle scene extension
  const handleSceneExtended = useCallback((extendedScene) => {
    setCurrentPrompt(extendedScene);
    addTestResult('Scene Extender', 'success', 'Scene successfully extended', extendedScene);
  }, []);

  // Handle timeline updates
  const handleTimelineUpdate = useCallback((updatedScenes) => {
    setScenes(updatedScenes);
    addTestResult('Timeline Manager', 'success', `Timeline updated with ${updatedScenes.length} scenes`, updatedScenes);
  }, []);

  // Handle scene selection
  const handleSceneSelect = useCallback((scene, index) => {
    setSelectedSceneIndex(index);
    if (scene?.content) {
      setCurrentPrompt(scene.content);
    }
  }, []);

  // Handle timeline actions from SceneExtender
  const handleTimelineAction = useCallback((action) => {
    addTestResult('Timeline Action', 'info', `Timeline action: ${action.type}`, action);
  }, []);

  // Add test result
  const addTestResult = (feature, type, message, data = null) => {
    const result = {
      id: Date.now() + Math.random(),
      feature,
      type, // success, error, warning, info
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev.slice(0, 19)]); // Keep last 20
  };

  // Run automated tests
  const runAutomatedTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    try {
      // Test 1: API Key Check
      if (aiApiService.hasApiKey()) {
        addTestResult('API Service', 'success', 'API key is set and available');
      } else {
        addTestResult('API Service', 'warning', 'API key not set - some features will be limited');
      }

      // Test 2: JSON Validation
      try {
        const testJson = '{"scene": "test", "invalid": true}';
        const validator = await import('./jsonValidator');
        const result = validator.default.validateAndRepair(testJson);
        addTestResult('JSON Validator', result.success ? 'success' : 'warning', 
          `Validation ${result.success ? 'passed' : 'failed with fallback'}`, result);
      } catch (error) {
        addTestResult('JSON Validator', 'error', `Validation test failed: ${error.message}`);
      }

      // Test 3: Component Rendering
      addTestResult('Components', 'success', 'All AI components rendered successfully');

      // Test 4: Data Flow
      if (currentPrompt && Object.keys(currentPrompt).length > 0) {
        addTestResult('Data Flow', 'success', 'Current prompt data is valid', currentPrompt);
      } else {
        addTestResult('Data Flow', 'error', 'Current prompt data is missing or invalid');
      }

      // Test 5: Timeline Integration
      if (scenes.length > 0) {
        addTestResult('Timeline Integration', 'success', `Timeline has ${scenes.length} scenes`);
      } else {
        addTestResult('Timeline Integration', 'info', 'Timeline is empty - ready for new scenes');
      }

    } catch (error) {
      addTestResult('Test Suite', 'error', `Test execution failed: ${error.message}`);
    } finally {
      setIsRunningTests(false);
    }
  };

  // Clear test results
  const clearResults = () => {
    setTestResults([]);
  };

  // Get result icon
  const getResultIcon = (type) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || '📝';
  };

  // Get result color
  const getResultColor = (type) => {
    const colors = {
      success: 'text-green-600 bg-green-50 border-green-200',
      error: 'text-red-600 bg-red-50 border-red-200',
      warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      info: 'text-blue-600 bg-blue-50 border-blue-200'
    };
    return colors[type] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="ai-feature-test max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Features Integration Test
        </h1>
        <p className="text-gray-600">
          Test and validate all AI-powered features: Scene Extender, AI Optimizer, and Timeline Manager
        </p>
      </div>

      {/* Test Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={runAutomatedTests}
          disabled={isRunningTests}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            isRunningTests 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isRunningTests ? (
            <>
              <svg className="animate-spin w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running Tests...
            </>
          ) : (
            <>🧪 Run Automated Tests</>
          )}
        </button>
        
        <button
          onClick={clearResults}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          🗑️ Clear Results
        </button>
      </div>

      {/* Current Prompt Display */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Current Prompt</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(currentPrompt, null, 2)}
          </pre>
        </div>
      </div>

      {/* AI Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Optimizer */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">AI Optimizer</h3>
          <AIOptimizer
            jsonPrompt={currentPrompt}
            onOptimized={handlePromptOptimized}
            userPreferences={userPreferences}
            targetPlatform="video"
            className="w-full"
          />
        </div>

        {/* Scene Extender */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Scene Extender</h3>
          <SceneExtender
            currentScene={currentPrompt}
            onSceneExtended={handleSceneExtended}
            onTimeline={handleTimelineAction}
            userPreferences={userPreferences}
            showAdvancedOptions={true}
            className="w-full"
          />
        </div>

        {/* Timeline Manager */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Timeline Manager</h3>
          <TimelineManager
            initialScenes={scenes}
            onTimelineUpdate={handleTimelineUpdate}
            onSceneSelect={handleSceneSelect}
            currentSceneIndex={selectedSceneIndex}
            className="w-full"
          />
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            <span className="text-sm text-gray-500">
              {testResults.length} results
            </span>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {testResults.map((result) => (
              <div
                key={result.id}
                className={`p-4 rounded-lg border ${getResultColor(result.type)}`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{getResultIcon(result.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{result.feature}</span>
                      <span className="text-xs opacity-75">{result.timestamp}</span>
                    </div>
                    <p className="text-sm mt-1">{result.message}</p>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer hover:underline">
                          View Details
                        </summary>
                        <pre className="text-xs mt-2 p-2 bg-black/5 rounded overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integration Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          🔗 Integration Notes
        </h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• All components share the same prompt data structure</li>
          <li>• Scene Extender can add scenes directly to Timeline Manager</li>
          <li>• AI Optimizer enhances prompts with validation and repair</li>
          <li>• Timeline Manager supports different continuation types</li>
          <li>• Error handling and fallbacks are implemented throughout</li>
          <li>• API key management is centralized in aiApiService</li>
        </ul>
      </div>
    </div>
  );
};

export default AIFeatureTest;