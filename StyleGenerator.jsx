import React, { useState, useEffect } from 'react';
import aiApiService from './aiApiService';

const StyleGenerator = ({ currentJson, onResult }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [styleData, setStyleData] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('presets');

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
      description: 'Clean, high-tech aesthetic with neon accents',
      style: {
        cinematography: 'Clean compositions, neon lighting, lens flares',
        mood: 'Sleek, technological, otherworldly',
        color_palette: 'Cool blues, electric teals, pure whites, neon accents',
        camera_movement: 'Smooth tracking shots, orbital movements'
      }
    },
    {
      id: 'indie-naturalistic',
      name: 'Indie Naturalistic',
      icon: '🌿',
      description: 'Raw, authentic feel with natural lighting',
      style: {
        cinematography: 'Natural lighting, handheld camera, medium shots',
        mood: 'Intimate, authentic, grounded',
        color_palette: 'Natural earth tones, soft pastels, realistic colors',
        camera_movement: 'Handheld, organic movement, following action'
      }
    },
    {
      id: 'fantasy-magical',
      name: 'Fantasy Magical',
      icon: '✨',
      description: 'Enchanted atmosphere with ethereal lighting',
      style: {
        cinematography: 'Soft focus, practical effects, magical lighting',
        mood: 'Whimsical, enchanting, mystical',
        color_palette: 'Rich purples, warm golds, ethereal blues',
        camera_movement: 'Floating movements, graceful transitions'
      }
    }
  ];

  // Camera Angles
  const cameraAngles = [
    { id: 'extreme-wide', name: 'Extreme Wide Shot', icon: '🌍', description: 'Vast landscape or cityscape establishing shot' },
    { id: 'wide', name: 'Wide Shot', icon: '🏠', description: 'Full body with environment context' },
    { id: 'medium-wide', name: 'Medium Wide Shot', icon: '👥', description: 'Waist up, good for conversations' },
    { id: 'medium', name: 'Medium Shot', icon: '👤', description: 'Chest up, standard dialogue shot' },
    { id: 'medium-close', name: 'Medium Close-up', icon: '😊', description: 'Shoulders up, emotional intimacy' },
    { id: 'close-up', name: 'Close-up', icon: '👁️', description: 'Face fills frame, maximum emotion' },
    { id: 'extreme-close', name: 'Extreme Close-up', icon: '🔍', description: 'Eyes, lips, or specific details' },
    { id: 'bird-eye', name: 'Bird\'s Eye View', icon: '🦅', description: 'Directly overhead perspective' },
    { id: 'high-angle', name: 'High Angle', icon: '📐', description: 'Camera above subject, looking down' },
    { id: 'eye-level', name: 'Eye Level', icon: '👀', description: 'Natural human perspective' },
    { id: 'low-angle', name: 'Low Angle', icon: '⬆️', description: 'Camera below subject, looking up' },
    { id: 'dutch-angle', name: 'Dutch Angle', icon: '📱', description: 'Tilted camera for unease or dynamism' }
  ];

  // Director Style Combos
  const directorStyles = [
    {
      id: 'wes-anderson',
      name: 'Wes Anderson Style',
      icon: '🎨',
      description: 'Symmetrical framing, pastel colors, whimsical storytelling',
      characteristics: 'Centered compositions, static camera, dollhouse aesthetic, quirky characters'
    },
    {
      id: 'christopher-nolan',
      name: 'Christopher Nolan Style',
      icon: '🌀',
      description: 'Complex narratives, IMAX scale, practical effects',
      characteristics: 'Non-linear storytelling, grand scale, minimal CGI, time manipulation'
    },
    {
      id: 'quentin-tarantino',
      name: 'Tarantino Style',
      icon: '🔫',
      description: 'Pop culture references, non-linear narrative, stylized violence',
      characteristics: 'Dialogue-heavy, retro soundtrack, chapter structure, close-ups on details'
    },
    {
      id: 'david-fincher',
      name: 'David Fincher Style',
      icon: '🕳️',
      description: 'Dark themes, meticulous detail, digital perfection',
      characteristics: 'Precise camera movements, cold color palette, obsessive detail, psychological depth'
    },
    {
      id: 'stanley-kubrick',
      name: 'Kubrick Style',
      icon: '👁️',
      description: 'Symmetrical compositions, long takes, psychological tension',
      characteristics: 'One-point perspective, tracking shots, classical music, meticulous planning'
    },
    {
      id: 'miyazaki',
      name: 'Miyazaki Style',
      icon: '🌸',
      description: 'Environmental storytelling, hand-drawn beauty, magical realism',
      characteristics: 'Nature integration, flying sequences, strong female leads, environmental themes'
    }
  ];

  // Auto-scroll to generated style data when created
  useEffect(() => {
    if (styleData) {
      const timer = setTimeout(() => {
        const element = document.querySelector('[data-style-results]');
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
  }, [styleData]);

  const generateSmartStyleSuggestion = async () => {
    if (!currentJson || Object.keys(currentJson).length === 0) {
      setError('No scene to analyze. Please create a scene first.');
      return;
    }

    if (!aiApiService.hasGroqApiKey()) {
      setError('Groq API key required for Smart Style Suggestions. Please set your Groq API key in settings.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setStyleData(null);

    try {
      console.log('Generating smart style suggestions for:', currentJson);
      const response = await aiApiService.generateStyleSuggestion(currentJson);
      console.log('Style generation response:', response);
      
      if (response.success) {
        setStyleData(response.style);
      } else {
        setError(response.error || 'Failed to generate style suggestions. Please try again.');
      }
    } catch (err) {
      console.error('Style generation error:', err);
      setError(`Failed to generate style suggestions: ${err.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const applyPresetStyle = (preset) => {
    const updatedJson = {
      ...currentJson,
      cinematography_style: preset.name,
      ...preset.style
    };
    console.log('StyleGenerator: Applying preset style:', preset.name, updatedJson);
    onResult(updatedJson);
  };

  const applyCameraAngle = (angle) => {
    const updatedJson = {
      ...currentJson,
      camera_angle: angle.name,
      shot_description: angle.description,
      framing_notes: `${angle.name}: ${angle.description}`
    };
    console.log('StyleGenerator: Applying camera angle:', angle.name, updatedJson);
    onResult(updatedJson);
  };

  const applyDirectorStyle = (director) => {
    const updatedJson = {
      ...currentJson,
      director_style: director.name,
      style_notes: director.characteristics,
      aesthetic_approach: director.description
    };
    console.log('StyleGenerator: Applying director style:', director.name, updatedJson);
    onResult(updatedJson);
  };

  const applyGeneratedStyle = () => {
    if (styleData) {
      const updatedJson = {
        ...currentJson,
        ...styleData
      };
      console.log('StyleGenerator: Applying generated style:', styleData, updatedJson);
      onResult(updatedJson);
      setStyleData(null);
    }
  };

  const renderPresetStyles = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {presetStyles.map((preset) => (
        <div key={preset.id} className="bg-gray-50 dark:bg-cinema-card rounded-lg p-4 border border-gray-200 dark:border-cinema-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{preset.icon}</span>
              <h4 className="font-medium text-gray-800 dark:text-cinema-text">{preset.name}</h4>
            </div>
            <button
              onClick={() => applyPresetStyle(preset)}
              className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-md transition-colors"
            >
              Apply
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-cinema-text-muted mb-2">{preset.description}</p>
          <div className="text-xs text-gray-500 dark:text-cinema-text-muted">
            <div><strong>Cinematography:</strong> {preset.style.cinematography}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCameraAngles = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {cameraAngles.map((angle) => (
        <button
          key={angle.id}
          onClick={() => applyCameraAngle(angle)}
          className="p-3 bg-gray-50 dark:bg-cinema-card hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg border border-gray-200 dark:border-cinema-border hover:border-blue-300 dark:hover:border-blue-600 transition-all text-left"
        >
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lg">{angle.icon}</span>
            <span className="font-medium text-sm text-gray-800 dark:text-cinema-text">{angle.name}</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-cinema-text-muted">{angle.description}</p>
        </button>
      ))}
    </div>
  );

  const renderDirectorStyles = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {directorStyles.map((director) => (
        <div key={director.id} className="bg-gray-50 dark:bg-cinema-card rounded-lg p-4 border border-gray-200 dark:border-cinema-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{director.icon}</span>
              <h4 className="font-medium text-gray-800 dark:text-cinema-text">{director.name}</h4>
            </div>
            <button
              onClick={() => applyDirectorStyle(director)}
              className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs rounded-md transition-colors"
            >
              Apply
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-cinema-text-muted mb-2">{director.description}</p>
          <p className="text-xs text-gray-500 dark:text-cinema-text-muted">{director.characteristics}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-2">
          🎥 Style Generator
        </h4>
        <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
          Apply cinematic styles, camera angles, and director aesthetics to your scene
        </p>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 dark:border-cinema-border">
        <button
          onClick={() => setActiveSection('presets')}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            activeSection === 'presets'
              ? 'border-b-2 border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text'
          }`}
        >
          🎨 Preset Styles
        </button>
        <button
          onClick={() => setActiveSection('angles')}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            activeSection === 'angles'
              ? 'border-b-2 border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text'
          }`}
        >
          📐 Camera Angles
        </button>
        <button
          onClick={() => setActiveSection('directors')}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            activeSection === 'directors'
              ? 'border-b-2 border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text'
          }`}
        >
          🎬 Director Styles
        </button>
        <button
          onClick={() => setActiveSection('smart')}
          className={`px-4 py-2 text-sm font-medium transition-all ${
            activeSection === 'smart'
              ? 'border-b-2 border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text'
          }`}
        >
          🧠 Smart Suggestions
        </button>
      </div>

      {/* Section Content */}
      <div className="mt-6">
        {activeSection === 'presets' && renderPresetStyles()}
        {activeSection === 'angles' && renderCameraAngles()}
        {activeSection === 'directors' && renderDirectorStyles()}
        {activeSection === 'smart' && (
          <div className="space-y-4">
            {/* Current Scene Context */}
            {currentJson?.scene && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-blue-600 dark:text-blue-400">🎬</span>
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Current Scene Analysis
                  </span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  {currentJson.scene.length > 150 
                    ? `${currentJson.scene.substring(0, 150)}...` 
                    : currentJson.scene
                  }
                </p>
              </div>
            )}

            {/* Smart Generate Button */}
            <button
              onClick={generateSmartStyleSuggestion}
              disabled={isGenerating}
              className={`w-full py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                isGenerating
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Scene...
                </>
              ) : (
                '🧠 Generate Smart Style Suggestions'
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
                  <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">Analyzing your scene for optimal style...</span>
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-300 mt-2 flex items-center space-x-1">
                  <span>⬇️</span>
                  <span>Style suggestions will appear below - we'll scroll you there automatically</span>
                </div>
              </div>
            )}

            {/* Generated Style Display */}
            {styleData && (
              <div data-style-results className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-4">
                {/* Success indicator */}
                <div className="bg-green-100 dark:bg-green-800/20 border border-green-300 dark:border-green-600 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">✅</span>
                    <span className="font-medium text-green-800 dark:text-green-200">Smart style suggestions generated!</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    AI-analyzed recommendations based on your scene content and context.
                  </p>
                </div>
                
                <div className="space-y-4 text-sm">
                  {Object.entries(styleData).map(([key, value]) => (
                    <div key={key}>
                      <strong className="text-green-700 dark:text-green-400 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </strong>
                      <p className="text-green-600 dark:text-green-300 mt-1">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                  <button
                    onClick={applyGeneratedStyle}
                    className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    Apply Style to Scene
                  </button>
                  <button
                    onClick={() => setStyleData(null)}
                    className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* API Key Setup Prompt */}
      {!aiApiService.hasGroqApiKey() && activeSection === 'smart' && (
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
              Groq API Key Required
            </span>
          </div>
          <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
            Smart Style Suggestions require a Groq API key to analyze your scene and generate recommendations.
          </p>
          <button 
            onClick={() => {
              const key = prompt('Enter your Groq API key:');
              if (key) {
                aiApiService.setGroqApiKey(key);
              }
            }}
            className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition-colors"
          >
            Set Groq API Key
          </button>
        </div>
      )}
    </div>
  );
};

export default StyleGenerator;