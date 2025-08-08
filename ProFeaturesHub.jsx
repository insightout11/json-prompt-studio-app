import React, { useState } from 'react';
import CharacterEngine from './CharacterEngine';
import WorldBuilder from './WorldBuilder';
import StoryboardGenerator from './StoryboardGenerator';
import StyleGenerator from './StyleGenerator';
import SceneExtender from './SceneExtender';
import SceneExtenderInterface from './SceneExtenderInterface';
import UsageMeter from './UsageMeter';
import UpgradeButton from './UpgradeButton';
import InlineAuth from './InlineAuth';
import { useSubscription } from './StripeIntegration';
import { useAuth } from './useAuth';
import { userService } from './userService';

const ProFeaturesHub = ({ isPro, onShowPricing, currentJson, onJsonUpdate, onSceneExtenderClick, sceneOptions, onApplySceneOption, onDismissSceneOptions, extensionLoading, extensionError, compact = false }) => {
  const [activeFeature, setActiveFeature] = useState(null);
  const { trackFeatureUsage, getUsageStats } = useSubscription();
  const { isAuthenticated, isEmailVerified, user } = useAuth();

  const proFeatures = [
    {
      id: 'character-engine',
      name: 'AI Character Engine',
      icon: '🎭',
      description: 'Generate detailed characters with backstories and traits',
      benefits: ['Consistent character details', 'Rich backstories', 'Reusable character templates'],
      sampleOutput: '{\n  "character": "Elena_Martinez",\n  "age": 28,\n  "background": "Former marine biologist",\n  "personality": "Determined yet empathetic",\n  "motivation": "Save ocean ecosystems"\n}',
      component: CharacterEngine
    },
    {
      id: 'world-builder',
      name: 'AI World Builder',
      icon: '🌍',
      description: 'Create immersive environments with consistent lore',
      benefits: ['Detailed world-building', 'Consistent environments', 'Rich atmospheric details'],
      sampleOutput: '{\n  "setting": "Neo_Tokyo_2087",\n  "atmosphere": "Neon-lit cyberpunk metropolis",\n  "weather": "Perpetual rain",\n  "landmarks": ["Digital_Shrine", "Corporate_Towers"]\n}',
      component: WorldBuilder
    },
    {
      id: 'style-generator',
      name: 'Style Generator',
      icon: '🎥',
      description: 'Apply cinematic styles, camera angles, and director aesthetics',
      benefits: ['Preset style library', 'Camera angle guides', 'Director style combos', 'Smart AI suggestions'],
      sampleOutput: 'Applied Wes Anderson style:\nSymmetrical framing, pastel colors, whimsical storytelling...',
      component: StyleGenerator
    },
    {
      id: 'storyboard-generator',
      name: 'Storyboard Generator',
      icon: '🎬',
      description: 'Break a script or JSON into a full storyboard sequence',
      benefits: ['Multi-scene planning', 'Shot-by-shot breakdown', 'Visual continuity'],
      sampleOutput: 'Scene 1: Wide establishing shot\nScene 2: Medium close-up\nScene 3: Dramatic reveal...',
      component: StoryboardGenerator
    },
    {
      id: 'scene-extender',
      name: 'Scene Extender',
      icon: '✨',
      description: 'Extend existing scenes with AI-generated variations',
      benefits: ['Multiple scene options', 'Creative variations', 'Smart merging'],
      sampleOutput: 'Generated 5 scene variations:\n1. Action sequence\n2. Dialogue focus\n3. Environmental details...',
      component: SceneExtender
    },
  ];

  // Handler functions for feature results
  const handleCharacterGenerated = (result) => {
    if (result && onJsonUpdate) {
      onJsonUpdate(result);
    }
  };

  const handleWorldGenerated = (result) => {
    if (result && onJsonUpdate) {
      onJsonUpdate(result);
    }
  };

  const handleStoryboardGenerated = (result) => {
    if (result && onJsonUpdate) {
      onJsonUpdate(result);
    }
  };

  const handleStyleGenerated = (result) => {
    if (result && onJsonUpdate) {
      onJsonUpdate(result);
    }
  };

  const handleJsonGenerated = (result) => {
    if (result && onJsonUpdate) {
      onJsonUpdate(result);
    }
  };

  const handleFeatureClick = (featureId) => {
    // All users can now use features
    setActiveFeature(activeFeature === featureId ? null : featureId);
  };




  // Compact layout for integration with UniversalInput - larger buttons spanning text to convert width
  if (compact) {
    return (
      <div>
        {/* Row of 5 AI feature buttons - sized similar to Convert button */}
        <div className="flex space-x-2">
          {proFeatures.slice(0, 5).map((feature) => (
            <button
              key={feature.id}
              onClick={() => handleFeatureClick(feature.id)}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-1 ${
                activeFeature === feature.id
                  ? 'bg-cinema-teal text-white shadow-md'
                  : 'bg-gray-100 dark:bg-cinema-border text-gray-700 dark:text-cinema-text hover:bg-gray-200 dark:hover:bg-cinema-card shadow-sm hover:shadow-md'
              }`}
              title={feature.name}
            >
              <span className="text-base">{feature.icon}</span>
              <span className="text-xs font-medium">{feature.name}</span>
            </button>
          ))}
        </div>
        
        {/* Active Feature Content - Inline */}
        {activeFeature && (
          <div className="mt-2 p-2 bg-cinema-teal/5 rounded border border-cinema-teal/20">
            {(() => {
              const feature = proFeatures.find(f => f.id === activeFeature);
              if (!feature) return null;
              
              if (activeFeature === 'scene-extender') {
                return (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-cinema-text">{feature.name}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={onSceneExtenderClick}
                        disabled={extensionLoading}
                        className="px-3 py-1 bg-cinema-teal text-white rounded text-xs font-medium hover:bg-cinema-teal/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {extensionLoading ? 'Generating...' : 'Generate'}
                      </button>
                      <button
                        onClick={() => setActiveFeature(null)}
                        className="text-gray-400 hover:text-gray-600 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              }
              
              // For other features, show full component in compact mode
              return (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-cinema-text font-medium">{feature.name}</span>
                    <button
                      onClick={() => setActiveFeature(null)}
                      className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* Render the actual AI tool component */}
                  <div className="bg-white dark:bg-cinema-card rounded-lg p-3 border border-cinema-border">
                    {activeFeature === 'character-engine' && (
                      <CharacterEngine currentJson={currentJson} onResult={handleCharacterGenerated} />
                    )}
                    {activeFeature === 'world-builder' && (
                      <WorldBuilder currentJson={currentJson} onResult={handleWorldGenerated} />
                    )}
                    {activeFeature === 'storyboard-generator' && (
                      <StoryboardGenerator currentJson={currentJson} onResult={handleStoryboardGenerated} />
                    )}
                    {activeFeature === 'style-generator' && (
                      <StyleGenerator currentJson={currentJson} onResult={handleStyleGenerated} />
                    )}
                  </div>
                </div>
              );
            })()}
            {extensionError && (
              <p className="text-red-500 text-xs mt-1">{extensionError}</p>
            )}
            {extensionLoading && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mt-2 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">Generating 5 scene options...</span>
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-300 mt-2 flex items-center space-x-1">
                  <span>⬇️</span>
                  <span>Options will appear below - we'll scroll you there automatically</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Full layout for standalone use
  return (
    <div className="mt-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="text-2xl mr-2">🤖</span>  
            <h3 className="text-2xl font-bold text-cinema-text">AI Features</h3>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-3 py-1 rounded-full text-white text-sm font-semibold">
            ✨ Active
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {proFeatures.map((feature) => {
            const isActive = activeFeature === feature.id;
            
            return (
              <div 
                key={feature.id}
                className={`bg-cinema-card rounded-lg p-3 border transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'border-cinema-teal shadow-glow-teal' 
                    : 'border-cinema-border hover:border-cinema-teal hover:shadow-glow-soft'
                }`}
                onClick={() => handleFeatureClick(feature.id)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h4 className="font-medium text-cinema-text text-sm leading-tight mb-1">
                    {feature.name}
                  </h4>
                  
                  {isActive && (
                    <div className="flex items-center justify-center space-x-1 text-xs text-cinema-teal font-medium">
                      <div className="w-1 h-1 bg-cinema-teal rounded-full animate-pulse"></div>
                      <span>Active</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Active Feature Panel */}
        {activeFeature && (
          <div className="mt-4">
            {activeFeature === 'character-engine' && (
              <CharacterEngine currentJson={currentJson} onResult={handleCharacterGenerated} />
            )}
            {activeFeature === 'world-builder' && (
              <WorldBuilder currentJson={currentJson} onResult={handleWorldGenerated} />
            )}
            {activeFeature === 'storyboard-generator' && (
              <StoryboardGenerator currentJson={currentJson} onResult={handleStoryboardGenerated} />
            )}
            {activeFeature === 'style-generator' && (
              <StyleGenerator currentJson={currentJson} onResult={handleStyleGenerated} />
            )}
            {activeFeature === 'scene-extender' && sceneOptions && (
              <div className="space-y-4">
                {sceneOptions.map((option, index) => (
                  <div key={index} className="bg-cinema-card rounded-lg p-4 border border-cinema-border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-cinema-text">{option.type}</h4>
                      <button
                        onClick={() => onApplySceneOption(option, index)}
                        className="bg-cinema-teal text-white px-3 py-1 rounded text-sm hover:bg-cinema-teal-bright transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="text-sm text-cinema-text-muted">{option.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProFeaturesHub;