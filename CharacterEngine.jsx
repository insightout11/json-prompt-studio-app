import React, { useState } from 'react';
import aiApiService from './aiApiService';
import AvatarCreator from './AvatarCreator';

const CharacterEngine = ({ currentJson, onResult }) => {
  const [characterDescription, setCharacterDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCharacter, setGeneratedCharacter] = useState(null);
  const [error, setError] = useState(null);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // 'description' or 'avatar'


  const generateCharacter = async () => {
    if (!characterDescription.trim()) {
      setError('Please describe your character idea');
      return;
    }

    if (!aiApiService.hasApiKey()) {
      setError('OpenAI API key required. Please set your API key in settings.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedCharacter(null);

    try {
      const response = await aiApiService.generateCharacterFromText(characterDescription);
      
      if (response.success) {
        setGeneratedCharacter(response.character);
      } else {
        setError(response.error || 'Failed to generate character. Please try again.');
      }
    } catch (err) {
      console.error('Character generation error:', err);
      setError('Failed to generate character. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const applyCharacterToScene = () => {
    if (generatedCharacter) {
      // Update the current JSON with character information
      const updatedJson = {
        ...currentJson,
        character_name: generatedCharacter.name,
        character_description: generatedCharacter.appearance,
        character_personality: generatedCharacter.personality,
        character_background: generatedCharacter.background,
        ...generatedCharacter.sceneIntegration
      };

      // Apply form field mappings if available
      if (generatedCharacter.formFieldMappings) {
        Object.entries(generatedCharacter.formFieldMappings).forEach(([field, value]) => {
          if (value && value.trim()) {
            updatedJson[field] = value;
          }
        });
      }
      
      onResult(updatedJson);
      setGeneratedCharacter(null);
    }
  };

  const handleAvatarSave = (avatarData, description) => {
    // Create a character object similar to AI-generated one
    const avatarCharacter = {
      name: 'Custom Avatar Character',
      appearance: description,
      personality: 'Customizable personality traits',
      background: 'Custom character background',
      formFieldMappings: {
        gender: avatarData.gender,
        age_range: avatarData.age_range,
        ethnicity: avatarData.ethnicity,
        body_type: avatarData.body_type,
        skin_tone: avatarData.skin_tone,
        hair_color: avatarData.hair_color,
        hair_style: avatarData.hair_style,
        eye_color: avatarData.eye_color,
        clothing: `${avatarData.clothing_style} attire`,
        character: description,
        ...(avatarData.distinguishing_features && { distinguishing_features: avatarData.distinguishing_features }),
        ...(avatarData.accessories && { accessories: avatarData.accessories })
      }
    };
    
    setGeneratedCharacter(avatarCharacter);
    setShowAvatarCreator(false);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-2">
          AI Character Engine
        </h4>
        <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
          Create characters using AI description or visual avatar builder
        </p>
      </div>

      {/* Character Creation Tabs */}
      <div className="bg-white dark:bg-cinema-card rounded-lg border border-gray-200 dark:border-cinema-border overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-cinema-border">
          <button
            onClick={() => setActiveTab('description')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'description'
                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-b-2 border-purple-500'
                : 'bg-gray-50 dark:bg-cinema-panel text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            📝 AI Description
          </button>
          <button
            onClick={() => setActiveTab('avatar')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'avatar'
                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-b-2 border-purple-500'
                : 'bg-gray-50 dark:bg-cinema-panel text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            🎨 Avatar Creator
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'description' && (
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                  Describe your character idea and AI will create a complete character with detailed form fields
                </p>
              </div>

      {/* Character Input Form */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
            Character Description
          </label>
          <textarea
            value={characterDescription}
            onChange={(e) => setCharacterDescription(e.target.value)}
            placeholder="Describe your character idea... e.g., 'A mysterious detective with a hidden past who speaks in riddles and wears vintage clothing' or 'A comedic chef who's afraid of fire but makes the best desserts in town'"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text resize-none"
          />
        </div>
        
        {/* Example prompts for inspiration */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-3">
          <p className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-2">Example descriptions:</p>
          <div className="space-y-1">
            <button
              onClick={() => setCharacterDescription('A wise old librarian who can speak to books and remembers every story ever written')}
              className="block w-full text-left text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
            >
              • A wise old librarian who can speak to books and remembers every story ever written
            </button>
            <button
              onClick={() => setCharacterDescription('A rebellious street artist with neon-colored hair who only paints at midnight')}
              className="block w-full text-left text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
            >
              • A rebellious street artist with neon-colored hair who only paints at midnight
            </button>
            <button
              onClick={() => setCharacterDescription('A heroic firefighter who is secretly afraid of heights but never shows it')}
              className="block w-full text-left text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
            >
              • A heroic firefighter who is secretly afraid of heights but never shows it
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateCharacter}
          disabled={isGenerating || !characterDescription.trim()}
          className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            isGenerating || !characterDescription.trim()
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Character...
            </>
          ) : (
            '✨ Generate Character'
          )}
        </button>
      </div>

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
            </div>
          )}

          {activeTab === 'avatar' && (
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                  Create your character visually using the avatar creator tool
                </p>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setShowAvatarCreator(true)}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>🎨</span>
                  <span>Open Avatar Creator</span>
                </button>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Customize appearance, style, and features visually
                </p>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Generated Character Display */}
      {generatedCharacter && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-4">
          <div className="mb-3">
            <h5 className="font-semibold text-green-800 dark:text-green-300 mb-2">
              Generated Character: {generatedCharacter.name}
            </h5>
          </div>
          
          <div className="space-y-3 text-sm">
            <div>
              <strong className="text-green-700 dark:text-green-400">Appearance:</strong>
              <p className="text-green-600 dark:text-green-300 mt-1">{generatedCharacter.appearance}</p>
            </div>
            
            <div>
              <strong className="text-green-700 dark:text-green-400">Personality:</strong>
              <p className="text-green-600 dark:text-green-300 mt-1">{generatedCharacter.personality}</p>
            </div>
            
            <div>
              <strong className="text-green-700 dark:text-green-400">Background:</strong>
              <p className="text-green-600 dark:text-green-300 mt-1">{generatedCharacter.background}</p>
            </div>

            {generatedCharacter.quirks && (
              <div>
                <strong className="text-green-700 dark:text-green-400">Notable Quirks:</strong>
                <p className="text-green-600 dark:text-green-300 mt-1">{generatedCharacter.quirks}</p>
              </div>
            )}

            {/* Form Field Mappings for Easy Editing */}
            {generatedCharacter.formFieldMappings && (
              <div className="border-t border-green-200 dark:border-green-700/50 pt-3 mt-3">
                <strong className="text-green-700 dark:text-green-400 mb-2 block">🎛️ Form Field Mappings (for easy editing):</strong>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(generatedCharacter.formFieldMappings).map(([field, value]) => (
                    value && (
                      <div key={field} className="bg-white dark:bg-cinema-card rounded p-2 border border-green-200 dark:border-green-700/30">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-medium text-gray-600 dark:text-cinema-text-muted capitalize">
                            {field.replace('_', ' ')}:
                          </span>
                          <span className="text-xs text-gray-800 dark:text-cinema-text ml-2 flex-1 text-right">
                            {value}
                          </span>
                        </div>
                      </div>
                    )
                  ))}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2 italic">
                  💡 These mappings help you edit the character using the regular form fields after applying to your scene.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
            <button
              onClick={applyCharacterToScene}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Apply to Scene
            </button>
            <button
              onClick={() => setGeneratedCharacter(null)}
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
            Character Engine requires an OpenAI API key to generate characters.
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

      {/* Avatar Creator Modal */}
      <AvatarCreator
        isOpen={showAvatarCreator}
        onClose={() => setShowAvatarCreator(false)}
        onSave={handleAvatarSave}
      />
    </div>
  );
};

export default CharacterEngine;