import React, { useState } from 'react';
import aiApiService from './aiApiService';

const WorldBuilder = ({ currentJson, onResult }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [worldData, setWorldData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedExpansionType, setSelectedExpansionType] = useState('full');

  const expansionTypes = [
    { 
      value: 'full', 
      label: 'Complete World', 
      description: 'Generate locations, lore, rules, and atmosphere' 
    },
    { 
      value: 'locations', 
      label: 'Related Locations', 
      description: 'Create 3 connected locations for this scene' 
    },
    { 
      value: 'lore', 
      label: 'World Lore', 
      description: 'Develop backstory, culture, and history' 
    },
    { 
      value: 'atmosphere', 
      label: 'Atmospheric Details', 
      description: 'Enhance mood, sounds, and environmental elements' 
    }
  ];

  const generateWorld = async () => {
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
    setWorldData(null);

    try {
      const response = await aiApiService.generateWorld(currentJson, selectedExpansionType);
      
      if (response.success) {
        setWorldData(response.world);
      } else {
        setError(response.error || 'Failed to generate world. Please try again.');
      }
    } catch (err) {
      console.error('World generation error:', err);
      setError('Failed to generate world. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const applyLocationToScene = (location) => {
    // Only update scene/setting related fields, preserve everything else
    const updatedJson = { ...currentJson };
    
    // Only change scene description fields
    updatedJson.setting = location.name;
    updatedJson.location_description = location.description;
    updatedJson.atmosphere = location.atmosphere;
    updatedJson.environmental_details = location.details;
    
    onResult(updatedJson);
  };

  const applyFullWorldToScene = () => {
    if (worldData) {
      // Only update world/scene related fields, preserve everything else
      const updatedJson = { ...currentJson };
      
      // Only change world/scene description fields
      if (worldData.name) updatedJson.world_name = worldData.name;
      if (worldData.lore) updatedJson.world_lore = worldData.lore;
      if (worldData.rules) updatedJson.world_rules = worldData.rules;
      if (worldData.atmosphere) updatedJson.atmospheric_elements = worldData.atmosphere;
      if (worldData.sounds) updatedJson.environmental_sounds = worldData.sounds;
      if (worldData.culture) updatedJson.cultural_context = worldData.culture;
      
      onResult(updatedJson);
      setWorldData(null);
    }
  };

  const getExpansionIcon = (type) => {
    const icons = {
      full: '🌍',
      locations: '📍',
      lore: '📜',
      atmosphere: '🌫️'
    };
    return icons[type] || '🌍';
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-2">
          Expand Your World
        </h4>
        <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
          Transform your scene setting into a rich, detailed world
        </p>
      </div>

      {/* Expansion Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
          Expansion Type
        </label>
        <div className="grid grid-cols-1 gap-2">
          {expansionTypes.map((type) => (
            <label
              key={type.value}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                selectedExpansionType === type.value
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-cinema-border hover:border-purple-300'
              }`}
            >
              <input
                type="radio"
                name="expansionType"
                value={type.value}
                checked={selectedExpansionType === type.value}
                onChange={(e) => setSelectedExpansionType(e.target.value)}
                className="mr-3"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getExpansionIcon(type.value)}</span>
                  <span className="font-medium text-gray-800 dark:text-cinema-text">
                    {type.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-cinema-text-muted mt-1">
                  {type.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Current Scene Context */}
      {currentJson?.setting && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-blue-600 dark:text-blue-400">📍</span>
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Current Setting: {currentJson.setting}
            </span>
          </div>
          {currentJson.location_description && (
            <p className="text-sm text-blue-700 dark:text-blue-400 ml-6">
              {currentJson.location_description}
            </p>
          )}
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={generateWorld}
        disabled={isGenerating}
        className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          isGenerating
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Building World...
          </>
        ) : (
          `🌍 Generate ${expansionTypes.find(t => t.value === selectedExpansionType)?.label}`
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

      {/* Generated World Display */}
      {worldData && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-4">
          <div className="mb-4">
            <h5 className="font-semibold text-green-800 dark:text-green-300 mb-2">
              Generated World Expansion
            </h5>
          </div>
          
          <div className="space-y-4 text-sm">
            {/* Locations */}
            {worldData.locations && worldData.locations.length > 0 && (
              <div>
                <strong className="text-green-700 dark:text-green-400">Related Locations:</strong>
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-2 mt-2">
                  {worldData.locations.map((location, index) => (
                    <div key={index} className="bg-white dark:bg-cinema-card p-3 rounded border border-green-200 dark:border-green-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800 dark:text-cinema-text">
                          {location.name}
                        </span>
                        <button
                          onClick={() => applyLocationToScene(location)}
                          className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                        >
                          Use Setting
                        </button>
                      </div>
                      <p className="text-gray-600 dark:text-cinema-text-muted text-xs">
                        {location.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lore */}
            {worldData.lore && (
              <div>
                <strong className="text-green-700 dark:text-green-400">World Lore:</strong>
                <p className="text-green-600 dark:text-green-300 mt-1">{worldData.lore}</p>
              </div>
            )}

            {/* Rules */}
            {worldData.rules && (
              <div>
                <strong className="text-green-700 dark:text-green-400">World Rules:</strong>
                <p className="text-green-600 dark:text-green-300 mt-1">{worldData.rules}</p>
              </div>
            )}

            {/* Atmosphere */}
            {worldData.atmosphere && (
              <div>
                <strong className="text-green-700 dark:text-green-400">Atmosphere:</strong>
                <p className="text-green-600 dark:text-green-300 mt-1">{worldData.atmosphere}</p>
              </div>
            )}

            {/* Culture */}
            {worldData.culture && (
              <div>
                <strong className="text-green-700 dark:text-green-400">Cultural Context:</strong>
                <p className="text-green-600 dark:text-green-300 mt-1">{worldData.culture}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
            <button
              onClick={applyFullWorldToScene}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Apply All to Scene
            </button>
            <button
              onClick={() => setWorldData(null)}
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
            World Builder requires an OpenAI API key to generate world expansions.
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

export default WorldBuilder;