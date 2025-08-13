import React, { useState } from 'react';
import ProgressiveCharacterModal from './ProgressiveCharacterModal';
import ProgressiveWorldModal from './ProgressiveWorldModal';
import ProgressiveStyleModal from './ProgressiveStyleModal';
import StoryboardGeneratorModal from './StoryboardGeneratorModal';
import SceneExtenderModal from './SceneExtenderModal';
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
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [showWorldModal, setShowWorldModal] = useState(false);
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [showStoryboardModal, setShowStoryboardModal] = useState(false);
  const [showSceneExtenderModal, setShowSceneExtenderModal] = useState(false);
  const { trackFeatureUsage, getUsageStats } = useSubscription();
  const { isAuthenticated, isEmailVerified, user } = useAuth();

  // Listen for storyboard integration events from builders
  React.useEffect(() => {
    const handleOpenStoryboard = (event) => {
      const { detail } = event;
      // Open the storyboard modal when triggered from builders
      setShowStoryboardModal(true);
    };

    window.addEventListener('openStoryboard', handleOpenStoryboard);
    
    return () => {
      window.removeEventListener('openStoryboard', handleOpenStoryboard);
    };
  }, []);

  // Debug: Log every render (remove after testing)
  // console.log('🎭 ProFeaturesHub render: showCharacterModal =', showCharacterModal, 'compact =', compact);

  // Legacy button components removed - all functionality moved to modal components

  const proFeatures = [
    {
      id: 'character-engine',
      name: 'Character Builder',
      icon: '🎭',
      description: 'Generate detailed characters with progressive AI questioning',
      benefits: ['Visual-first approach', 'Progressive questioning', 'Early completion option', 'Rich character details'],
      sampleOutput: '{\n  "character": "Elena Martinez, street-smart mechanic",\n  "age": "28",\n  "clothing": "Oil-stained coveralls, welding goggles",\n  "personality": "Determined yet empathetic",\n  "actions": "Fixing vintage motorcycles"\n}',
      component: null
    },
    {
      id: 'world-builder',
      name: 'World Builder',
      icon: '🌍',
      description: 'Create immersive environments with progressive AI expansion',
      benefits: ['Progressive world building', 'Multiple expansion types', 'Rich environmental details', 'Related world generation'],
      sampleOutput: '{\n  "setting": "Neo_Tokyo_2087",\n  "atmosphere": "Neon-lit cyberpunk metropolis",\n  "weather": "Perpetual rain",\n  "landmarks": ["Digital_Shrine", "Corporate_Towers"]\n}',
      component: null
    },
    {
      id: 'style-generator',
      name: 'Style Builder',
      icon: '🎥',
      description: 'Apply cinematic styles, camera angles, and director aesthetics',
      benefits: ['Preset style library', 'Camera angle guides', 'Director style combos', 'Smart AI suggestions'],
      sampleOutput: 'Applied Wes Anderson style:\nSymmetrical framing, pastel colors, whimsical storytelling...',
      component: null
    },
    {
      id: 'storyboard-generator',
      name: 'Storyboard Generator',
      icon: '🎬',
      description: 'Break a script or JSON into a full storyboard sequence',
      benefits: ['Multi-scene planning', 'Shot-by-shot breakdown', 'Visual continuity'],
      sampleOutput: 'Scene 1: Wide establishing shot\nScene 2: Medium close-up\nScene 3: Dramatic reveal...',
      component: null
    },
    {
      id: 'scene-extender',
      name: 'Scene Extender',
      icon: '✨',
      description: 'Extend existing scenes with AI-generated variations',
      benefits: ['Multiple scene options', 'Creative variations', 'Smart merging'],
      sampleOutput: 'Generated 5 scene variations:\n1. Action sequence\n2. Dialogue focus\n3. Environmental details...',
      component: null
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
    // All AI features now use modal-based approach
    if (featureId === 'character-engine') {
      setShowCharacterModal(true);
      return;
    }
    
    if (featureId === 'world-builder') {
      setShowWorldModal(true);
      return;
    }
    
    if (featureId === 'style-generator') {
      setShowStyleModal(true);
      return;
    }
    
    if (featureId === 'storyboard-generator') {
      setShowStoryboardModal(true);
      return;
    }
    
    if (featureId === 'scene-extender') {
      setShowSceneExtenderModal(true);
      return;
    }
    
    // Fallback for any remaining inline features
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
        
        {/* Extension Loading/Error States for legacy Scene Extender fallback */}
        {extensionError && (
          <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-700">
            <p className="text-red-600 dark:text-red-400 text-xs">{extensionError}</p>
          </div>
        )}
        {extensionLoading && (
          <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
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
        
        {/* Progressive Character Modal - Add to compact mode */}
        <ProgressiveCharacterModal 
          isOpen={showCharacterModal}
          onClose={() => setShowCharacterModal(false)}
          onResult={handleCharacterGenerated}
          currentJson={currentJson}
        />
        
        {/* Progressive World Modal - Add to compact mode */}
        <ProgressiveWorldModal 
          isOpen={showWorldModal}
          onClose={() => setShowWorldModal(false)}
          onResult={handleWorldGenerated}
          currentJson={currentJson}
        />
        
        {/* Style Generator Modal - Add to compact mode */}
        <ProgressiveStyleModal
          isOpen={showStyleModal}
          onClose={() => setShowStyleModal(false)}
          onResult={handleStyleGenerated}
          currentJson={currentJson}
        />
        
        {/* Storyboard Generator Modal - Add to compact mode */}
        <StoryboardGeneratorModal
          isOpen={showStoryboardModal}
          onClose={() => setShowStoryboardModal(false)}
          onResult={handleStoryboardGenerated}
          currentJson={currentJson}
        />
        
        {/* Scene Extender Modal - Add to compact mode */}
        <SceneExtenderModal
          isOpen={showSceneExtenderModal}
          onClose={() => setShowSceneExtenderModal(false)}
          onResult={handleJsonGenerated}
          currentJson={currentJson}
        />
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
        
        {/* Legacy Scene Extender Options Display - for backwards compatibility */}
        {sceneOptions && (
          <div className="mt-4 space-y-4">
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
      
      {/* Progressive Character Modal */}
      <ProgressiveCharacterModal 
        isOpen={showCharacterModal}
        onClose={() => setShowCharacterModal(false)}
        onResult={handleCharacterGenerated}
        currentJson={currentJson}
      />
      
      {/* Progressive World Modal */}
      <ProgressiveWorldModal 
        isOpen={showWorldModal}
        onClose={() => setShowWorldModal(false)}
        onResult={handleWorldGenerated}
        currentJson={currentJson}
      />
      
      {/* Style Generator Modal */}
      <ProgressiveStyleModal
        isOpen={showStyleModal}
        onClose={() => setShowStyleModal(false)}
        onResult={handleStyleGenerated}
        currentJson={currentJson}
      />
      
      {/* Storyboard Generator Modal */}
      <StoryboardGeneratorModal
        isOpen={showStoryboardModal}
        onClose={() => setShowStoryboardModal(false)}
        onResult={handleStoryboardGenerated}
        currentJson={currentJson}
      />
      
      {/* Scene Extender Modal */}
      <SceneExtenderModal
        isOpen={showSceneExtenderModal}
        onClose={() => setShowSceneExtenderModal(false)}
        onResult={handleJsonGenerated}
        currentJson={currentJson}
      />
    </div>
  );
};

export default ProFeaturesHub;