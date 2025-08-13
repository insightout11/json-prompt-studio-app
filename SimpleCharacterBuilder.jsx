import React, { useState } from 'react';
import aiApiService from './aiApiService';

const SimpleCharacterBuilder = ({ isOpen, onClose, currentJson, onResult }) => {
  console.log('🎭 SimpleCharacterBuilder rendered with props:', { isOpen, hasOnClose: !!onClose, hasCurrentJson: !!currentJson, hasOnResult: !!onResult });
  
  const [step, setStep] = useState('input'); // 'input', 'building', 'complete'
  const [characterDescription, setCharacterDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStepNumber, setCurrentStepNumber] = useState(1);
  const [maxSteps] = useState(5); // Approximate
  const [options, setOptions] = useState([]);
  const [buildingPhase, setBuildingPhase] = useState('appearance'); // appearance, personality, voice, background, style
  const [characterData, setCharacterData] = useState({});

  const phases = [
    { id: 'appearance', name: 'Appearance', description: 'How does your character look?' },
    { id: 'personality', name: 'Personality', description: 'What drives your character?' },
    { id: 'voice', name: 'Voice & Speech', description: 'How does your character speak?' },
    { id: 'background', name: 'Background', description: 'What\'s your character\'s story?' },
    { id: 'style', name: 'Visual Style', description: 'What\'s the overall aesthetic?' }
  ];

  const handleSubmit = async () => {
    if (!characterDescription.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await aiApiService.generateDynamicCharacterOptions({
        description: characterDescription,
        phase: 'appearance',
        previousSelections: {}
      });

      if (result.success) {
        setOptions(result.options);
        setStep('building');
        setBuildingPhase('appearance');
        setCurrentStepNumber(1);
      } else {
        setError(result.error || 'Failed to generate character options');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = async (selectedOption) => {
    setIsLoading(true);
    setError(null);

    // Save the selection
    const newCharacterData = {
      ...characterData,
      [buildingPhase]: selectedOption
    };
    setCharacterData(newCharacterData);

    // Determine next phase
    const currentPhaseIndex = phases.findIndex(p => p.id === buildingPhase);
    const nextPhaseIndex = currentPhaseIndex + 1;

    if (nextPhaseIndex >= phases.length) {
      // Character building complete
      handleComplete(newCharacterData);
      return;
    }

    const nextPhase = phases[nextPhaseIndex];
    
    try {
      // Generate options for next phase
      const result = await aiApiService.generateDynamicCharacterOptions({
        description: characterDescription,
        phase: nextPhase.id,
        previousSelections: newCharacterData
      });

      if (result.success) {
        setOptions(result.options);
        setBuildingPhase(nextPhase.id);
        setCurrentStepNumber(currentStepNumber + 1);
      } else {
        setError(result.error || 'Failed to generate next options');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = (finalCharacterData) => {
    // Convert character data to form fields
    const characterFields = convertToFormFields(finalCharacterData, characterDescription);
    
    // Merge with current JSON
    const updatedJson = {
      ...currentJson,
      ...characterFields
    };

    if (onResult) {
      onResult(updatedJson);
    }
    
    onClose();
  };

  const convertToFormFields = (characterData, description) => {
    const fields = {
      character: description,
    };

    // Map appearance to form fields
    if (characterData.appearance) {
      fields.character_description = characterData.appearance.summary || characterData.appearance.title;
      if (characterData.appearance.age) fields.age = characterData.appearance.age;
      if (characterData.appearance.build) fields.body_type = characterData.appearance.build;
      if (characterData.appearance.hair) fields.hair_style = characterData.appearance.hair;
      if (characterData.appearance.clothing) fields.clothing = characterData.appearance.clothing;
    }

    // Map personality to form fields
    if (characterData.personality) {
      fields.character_motivation = characterData.personality.motivation || characterData.personality.summary;
      fields.character_flaw = characterData.personality.flaw;
      fields.emotional_state = characterData.personality.mood;
    }

    // Map voice to form fields
    if (characterData.voice) {
      fields.voice_tone = characterData.voice.tone || characterData.voice.summary;
      fields.speech_pace = characterData.voice.pace;
      fields.vocabulary_style = characterData.voice.style;
    }

    // Map background to form fields
    if (characterData.background) {
      fields.character_background = characterData.background.summary || characterData.background.title;
      fields.character_role = characterData.background.role;
    }

    // Map style to form fields
    if (characterData.style) {
      fields.visual_style = characterData.style.summary || characterData.style.title;
      fields.lighting = characterData.style.lighting;
      fields.color_palette = characterData.style.colors;
      fields.camera_angle = characterData.style.camera;
    }

    return fields;
  };

  const handleReset = () => {
    setStep('input');
    setCharacterDescription('');
    setCharacterData({});
    setOptions([]);
    setCurrentStepNumber(1);
    setBuildingPhase('appearance');
    setError(null);
  };

  // TEMP: Always render for debugging
  console.log('🎭 SimpleCharacterBuilder component called, isOpen:', isOpen);
  
  if (!isOpen) {
    console.log('🎭 SimpleCharacterBuilder not rendering, isOpen is false');
    // TEMP: Force render for testing
    // return null;
  }
  
  console.log('🎭 SimpleCharacterBuilder rendering modal');

  const currentPhase = phases.find(p => p.id === buildingPhase);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                🎭 AI Character Builder
              </h2>
              {step === 'building' && currentPhase && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Step {currentStepNumber} of {maxSteps}: {currentPhase.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentPhase.description}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-xl font-bold w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
          
          {/* Progress bar */}
          {step === 'building' && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStepNumber / maxSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Input Step */}
          {step === 'input' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Describe your character
                </label>
                <textarea
                  value={characterDescription}
                  onChange={(e) => setCharacterDescription(e.target.value)}
                  placeholder="e.g., A young street-smart courier in a rainy cyberpunk city, tough exterior but secretly kind..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">💡 Tips for better results:</p>
                <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Include age, setting, and general appearance</li>
                  <li>• Mention personality traits or background</li>
                  <li>• Add any specific style or genre preferences</li>
                </ul>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading || !characterDescription.trim()}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                  isLoading || !characterDescription.trim()
                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Generating options...
                  </div>
                ) : (
                  'Generate Character Options'
                )}
              </button>
            </div>
          )}

          {/* Building Step */}
          {step === 'building' && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Generating next options...</p>
                </div>
              ) : (
                <>
                  <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    Choose the option that best fits your vision:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        className="p-4 text-left border-2 border-gray-200 dark:border-slate-600 rounded-lg hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 bg-white dark:bg-slate-700"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {option.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {option.summary}
                        </p>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              ← Start over
            </button>
            
            {step === 'building' && (
              <button
                onClick={() => handleComplete(characterData)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
              >
                Complete character
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCharacterBuilder;