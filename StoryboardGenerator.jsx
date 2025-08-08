import React, { useState, useEffect } from 'react';
import aiApiService from './aiApiService';

const StoryboardGenerator = ({ currentJson, onResult }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyboard, setStoryboard] = useState(null);
  const [error, setError] = useState(null);
  const [sceneCount, setSceneCount] = useState(3);
  const [narrativeStructure, setNarrativeStructure] = useState('three-act');

  const narrativeStructures = [
    { 
      value: 'three-act', 
      label: '3-Act Structure', 
      description: 'Setup → Conflict → Resolution' 
    },
    { 
      value: 'hero-journey', 
      label: 'Hero\'s Journey', 
      description: 'Call to adventure → Challenge → Return' 
    },
    { 
      value: 'tension-build', 
      label: 'Tension Builder', 
      description: 'Calm → Rising tension → Climax' 
    },
    { 
      value: 'character-arc', 
      label: 'Character Arc', 
      description: 'Introduction → Development → Transformation' 
    },
    { 
      value: 'mystery', 
      label: 'Mystery Structure', 
      description: 'Question → Investigation → Revelation' 
    }
  ];

  // Auto-scroll to generated storyboard when created
  useEffect(() => {
    if (storyboard) {
      const timer = setTimeout(() => {
        const element = document.querySelector('[data-storyboard-results]');
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest' 
          });
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [storyboard]);

  const generateStoryboard = async () => {
    if (!currentJson || Object.keys(currentJson).length === 0) {
      setError('No scene to expand. Please create a scene first.');
      return;
    }

    if (!aiApiService.hasApiKey()) {
      setError('OpenAI API key required. Please set your API key in settings.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setStoryboard(null);

    try {
      const response = await aiApiService.generateStoryboard(
        currentJson, 
        sceneCount, 
        narrativeStructure
      );
      
      if (response.success) {
        setStoryboard(response.storyboard);
      } else {
        setError(response.error || 'Failed to generate storyboard. Please try again.');
      }
    } catch (err) {
      console.error('Storyboard generation error:', err);
      setError('Failed to generate storyboard. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const applySceneToProject = (scene, index) => {
    const updatedJson = {
      ...scene.sceneData,
      scene_number: index + 1,
      narrative_position: scene.position,
      story_context: scene.context
    };
    
    onResult(updatedJson);
  };

  const applyFullStoryboard = () => {
    if (storyboard && storyboard.scenes && storyboard.scenes.length > 0) {
      // Apply the first scene as the current scene
      const firstScene = storyboard.scenes[0];
      const updatedJson = {
        ...firstScene.sceneData,
        storyboard_title: storyboard.title,
        narrative_structure: storyboard.structure,
        total_scenes: storyboard.scenes.length,
        scene_number: 1
      };
      
      onResult(updatedJson);
      setStoryboard(null);
    }
  };

  const getSceneIcon = (position) => {
    const icons = {
      opening: '🎬',
      development: '⚡',
      climax: '🔥',
      resolution: '✨',
      transition: '🔄'
    };
    return icons[position] || '🎯';
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-2">
          Generate Story Sequence
        </h4>
        <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
          Create a multi-scene narrative from your current scene
        </p>
      </div>

      {/* Configuration Options */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
            Number of Scenes
          </label>
          <select
            value={sceneCount}
            onChange={(e) => setSceneCount(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text"
          >
            <option value={3}>3 Scenes</option>
            <option value={4}>4 Scenes</option>
            <option value={5}>5 Scenes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
            Narrative Structure
          </label>
          <div className="space-y-2">
            {narrativeStructures.map((structure) => (
              <label
                key={structure.value}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  narrativeStructure === structure.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-cinema-border hover:border-blue-300'
                }`}
              >
                <input
                  type="radio"
                  name="narrativeStructure"
                  value={structure.value}
                  checked={narrativeStructure === structure.value}
                  onChange={(e) => setNarrativeStructure(e.target.value)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-800 dark:text-cinema-text">
                    {structure.label}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-cinema-text-muted mt-1">
                    {structure.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Current Scene Context */}
      {currentJson?.scene && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-blue-600 dark:text-blue-400">🎬</span>
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Current Scene Preview
            </span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-400 ml-6">
            {currentJson.scene.length > 100 
              ? `${currentJson.scene.substring(0, 100)}...` 
              : currentJson.scene
            }
          </p>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={generateStoryboard}
        disabled={isGenerating}
        className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          isGenerating
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Storyboard...
          </>
        ) : (
          `🎬 Generate ${sceneCount}-Scene Storyboard`
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}
      
      {/* Loading state with scroll hint */}
      {isGenerating && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">Creating storyboard...</span>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-300 mt-2 flex items-center space-x-1">
            <span>⬇️</span>
            <span>Storyboard scenes will appear below - we'll scroll you there automatically</span>
          </div>
        </div>
      )}

      {/* Generated Storyboard Display */}
      {storyboard && (
        <div data-storyboard-results className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-4">
          {/* Success indicator */}
          <div className="bg-green-100 dark:bg-green-800/20 border border-green-300 dark:border-green-600 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg">✅</span>
              <span className="font-medium text-green-800 dark:text-green-200">Storyboard created with {storyboard.scenes?.length || 0} scenes!</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-300 mt-1">
              Review the scene sequence below and apply individual scenes to your project.
            </p>
          </div>
          
          <div className="mb-4">
            <h5 className="font-semibold text-green-800 dark:text-green-300 mb-2">
              Generated Storyboard: {storyboard.title}
            </h5>
            <p className="text-sm text-green-600 dark:text-green-300">
              Structure: {storyboard.structure} • {storyboard.scenes?.length || 0} scenes
            </p>
          </div>
          
          {/* Scene Timeline */}
          {storyboard.scenes && storyboard.scenes.length > 0 && (
            <div className="space-y-3">
              {storyboard.scenes.map((scene, index) => (
                <div key={index} className="bg-white dark:bg-cinema-card p-3 rounded border border-green-200 dark:border-green-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getSceneIcon(scene.position)}</span>
                      <span className="font-medium text-gray-800 dark:text-cinema-text">
                        Scene {index + 1}: {scene.title}
                      </span>
                    </div>
                    <button
                      onClick={() => applySceneToProject(scene, index)}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                    >
                      Use Scene
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-cinema-text-muted mb-2">
                    <strong>Position:</strong> {scene.position}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                    {scene.description}
                  </p>
                  {scene.context && (
                    <p className="text-xs text-gray-500 dark:text-cinema-text-muted mt-1 italic">
                      Context: {scene.context}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
            <button
              onClick={applyFullStoryboard}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Start with Scene 1
            </button>
            <button
              onClick={() => setStoryboard(null)}
              className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* API Key Setup Prompt */}
      {!aiApiService.hasApiKey() && (
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
              OpenAI API Key Required
            </span>
          </div>
          <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
            Storyboard Generator requires an OpenAI API key to create scene sequences.
          </p>
          <button 
            onClick={() => {
              const key = prompt('Enter your OpenAI API key:');
              if (key) {
                aiApiService.setApiKey(key);
              }
            }}
            className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition-colors"
          >
            Set API Key
          </button>
        </div>
      )}
    </div>
  );
};

export default StoryboardGenerator;