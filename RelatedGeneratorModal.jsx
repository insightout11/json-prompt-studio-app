import React, { useState } from 'react';
import aiApiService from './aiApiService';

const RelatedGeneratorModal = ({ isOpen, onClose, baseSpec, specType, onResult }) => {
  const [step, setStep] = useState('select'); // 'select' | 'generating' | 'results'
  const [selectedRelationship, setSelectedRelationship] = useState('');
  const [tweaks, setTweaks] = useState({
    similarity: 70,
    toneShift: 'same',
    paletteShift: 'same',
    ageShift: 'same',
    difficultyShift: 'same'
  });
  const [generatedOptions, setGeneratedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const characterRelationships = [
    { 
      id: 'sibling', 
      name: 'Sibling', 
      icon: '👥',
      description: 'Family member with shared traits but different role' 
    },
    { 
      id: 'ally', 
      name: 'Ally', 
      icon: '🤝',
      description: 'Friendly character with complementary abilities' 
    },
    { 
      id: 'rival', 
      name: 'Rival', 
      icon: '⚔️',
      description: 'Opposing character that contrasts core traits' 
    },
    { 
      id: 'mentor', 
      name: 'Mentor', 
      icon: '🧙',
      description: 'Wiser, older guide with refined characteristics' 
    },
    { 
      id: 'sidekick', 
      name: 'Sidekick', 
      icon: '🐕',
      description: 'Loyal companion with supporting role traits' 
    },
    { 
      id: 'alt_version', 
      name: 'Alt Version', 
      icon: '🌟',
      description: 'Same identity in different outfit/age/timeline' 
    }
  ];

  const worldRelationships = [
    { 
      id: 'adjacent_location', 
      name: 'Adjacent Location', 
      icon: '🗺️',
      description: 'Nearby place with same culture but different function' 
    },
    { 
      id: 'hidden_area', 
      name: 'Hidden Area', 
      icon: '🚪',
      description: 'Secret location within the same world' 
    },
    { 
      id: 'ruin_echo', 
      name: 'Ruin/Echo', 
      icon: '🏛️',
      description: 'Decayed or abandoned version of this place' 
    },
    { 
      id: 'seasonal_variant', 
      name: 'Seasonal Variant', 
      icon: '🍂',
      description: 'Same location in different season/weather' 
    },
    { 
      id: 'time_period_variant', 
      name: 'Time Period Variant', 
      icon: '⏰',
      description: 'Same geography in different historical era' 
    }
  ];

  const relationships = specType === 'character' ? characterRelationships : worldRelationships;

  const resetModal = () => {
    setStep('select');
    setSelectedRelationship('');
    setTweaks({
      similarity: 70,
      toneShift: 'same',
      paletteShift: 'same', 
      ageShift: 'same',
      difficultyShift: 'same'
    });
    setGeneratedOptions([]);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!selectedRelationship) {
      setError('Please select a relationship type');
      return;
    }

    setStep('generating');
    setIsLoading(true);
    setError(null);

    try {
      const result = specType === 'character' 
        ? await aiApiService.generateRelatedCharacter(baseSpec, selectedRelationship, tweaks)
        : await aiApiService.generateRelatedWorld(baseSpec, selectedRelationship, tweaks);

      if (result.success) {
        setGeneratedOptions(result.options);
        setStep('results');
      } else {
        setError(result.error || 'Failed to generate related options');
        setStep('select');
      }
    } catch (err) {
      console.error('Related generation error:', err);
      setError('Failed to generate related options. Please try again.');
      setStep('select');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (option) => {
    if (onResult) {
      onResult(option);
    }
    onClose();
    resetModal();
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/50 flex items-start justify-center z-[9999] p-6">
      <div className="bg-light-panel dark:bg-cinema-panel rounded-lg shadow-xl max-w-3xl w-full max-h-[75vh] overflow-y-auto mt-[15vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-cinema-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-cinema-text mb-2">
                🌟 Make Related {specType === 'character' ? 'Character' : 'World'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                Generate related {specType}s that inherit the DNA of your original while adding unique variations
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Step 1: Relationship Selection */}
          {step === 'select' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-3">
                  Choose Relationship Type
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {relationships.map((relationship) => (
                    <button
                      key={relationship.id}
                      onClick={() => setSelectedRelationship(relationship.id)}
                      className={`p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                        selectedRelationship === relationship.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-cinema-border hover:border-purple-300 dark:hover:border-purple-600'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{relationship.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-cinema-text mb-1">
                            {relationship.name}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-cinema-text-muted">
                            {relationship.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tweaks Section */}
              {selectedRelationship && (
                <div className="bg-gray-50 dark:bg-cinema-card rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-cinema-text mb-3">
                    Fine-tune Generation (Optional)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Similarity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
                        Similarity: {tweaks.similarity}%
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="95"
                        value={tweaks.similarity}
                        onChange={(e) => setTweaks(prev => ({ ...prev, similarity: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Very Different</span>
                        <span>Very Similar</span>
                      </div>
                    </div>

                    {/* Tone Shift */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
                        Tone Shift
                      </label>
                      <select
                        value={tweaks.toneShift}
                        onChange={(e) => setTweaks(prev => ({ ...prev, toneShift: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-cinema-border rounded-md bg-light-panel dark:bg-cinema-panel text-gray-900 dark:text-cinema-text"
                      >
                        <option value="darker">Darker</option>
                        <option value="same">Same</option>
                        <option value="lighter">Lighter</option>
                      </select>
                    </div>

                    {/* Palette Shift */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
                        Color Palette
                      </label>
                      <select
                        value={tweaks.paletteShift}
                        onChange={(e) => setTweaks(prev => ({ ...prev, paletteShift: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-cinema-border rounded-md bg-light-panel dark:bg-cinema-panel text-gray-900 dark:text-cinema-text"
                      >
                        <option value="warmer">Warmer</option>
                        <option value="same">Same</option>
                        <option value="cooler">Cooler</option>
                      </select>
                    </div>

                    {/* Age Shift (Characters only) */}
                    {specType === 'character' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
                          Age Shift
                        </label>
                        <select
                          value={tweaks.ageShift}
                          onChange={(e) => setTweaks(prev => ({ ...prev, ageShift: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-cinema-border rounded-md bg-light-panel dark:bg-cinema-panel text-gray-900 dark:text-cinema-text"
                        >
                          <option value="younger">Younger</option>
                          <option value="same">Same</option>
                          <option value="older">Older</option>
                        </select>
                      </div>
                    )}

                    {/* Difficulty/Hostility (Worlds only) */}
                    {specType === 'world' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
                          Danger Level
                        </label>
                        <select
                          value={tweaks.difficultyShift}
                          onChange={(e) => setTweaks(prev => ({ ...prev, difficultyShift: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-cinema-border rounded-md bg-light-panel dark:bg-cinema-panel text-gray-900 dark:text-cinema-text"
                        >
                          <option value="safer">Safer</option>
                          <option value="same">Same</option>
                          <option value="more_dangerous">More Dangerous</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!selectedRelationship}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    selectedRelationship
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Generate Related {specType === 'character' ? 'Characters' : 'Worlds'}
                </button>
              </div>

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

          {/* Step 2: Generating */}
          {step === 'generating' && (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-2">
                Generating Related {specType === 'character' ? 'Characters' : 'Worlds'}...
              </h3>
              <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                Creating variations that inherit the DNA of your original {specType}
              </p>
            </div>
          )}

          {/* Step 3: Results */}
          {step === 'results' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-3">
                  Choose Your Related {specType === 'character' ? 'Character' : 'World'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-cinema-text-muted mb-4">
                  Each option inherits the style DNA while adding unique {selectedRelationship.replace('_', ' ')} characteristics
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(option)}
                    className="p-4 text-left border border-gray-200 dark:border-cinema-border rounded-lg hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 bg-white dark:bg-cinema-card"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-cinema-text">
                          {option.name || `Option ${index + 1}`}
                        </h4>
                        <div className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                          {selectedRelationship.replace('_', ' ')}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                        {option.summary || option.description}
                      </p>
                      
                      {option.keyDifferences && (
                        <div className="text-xs text-purple-600 dark:text-purple-400">
                          Key changes: {option.keyDifferences.slice(0, 2).join(', ')}
                          {option.keyDifferences.length > 2 && '...'}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('select')}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ← Back to Selection
                </button>
                <button
                  onClick={handleGenerate}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Generate New Options
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatedGeneratorModal;