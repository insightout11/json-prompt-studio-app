import React, { useState, useEffect } from 'react';
import aiApiService from './aiApiService';
import { useStore } from './store';

const RelatedGeneratorModal = ({ isOpen, onClose, baseSpec, specType, onResult }) => {
  // Store access for builder context tracking
  const setBuilderContext = useStore(state => state.setBuilderContext);
  
  // State management for progressive system
  const [currentStep, setCurrentStep] = useState(0); // 0 = relationship selection, 1-6 = progressive questions
  const [selectedRelationship, setSelectedRelationship] = useState('');
  const [baseDescription, setBaseDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentOptions, setCurrentOptions] = useState([]);
  const [responses, setResponses] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [finalResults, setFinalResults] = useState(null);
  const [generatedOptions, setGeneratedOptions] = useState([]);
  
  // Refinement settings for similarity and adjustments (Step 6)
  const [refinementSettings, setRefinementSettings] = useState({
    similarity: 70,
    toneShift: 'same',
    paletteShift: 'same',
    ageShift: 'same',        // for characters
    difficultyShift: 'same'  // for worlds
  });

  const maxSteps = 6;
  
  // Progressive question topics for characters
  const characterQuestionTopics = [
    { id: 'connection', name: 'Core Connection & Chemistry', description: 'What type of emotional bond and chemistry do they share?' },
    { id: 'personality', name: 'Personality Dynamic', description: 'How do their personalities interact and complement each other?' },
    { id: 'visual', name: 'Visual Chemistry & Appearance', description: 'How do they look together and what visual harmony do they have?' },
    { id: 'history', name: 'Backstory & Shared History', description: 'What\'s their background connection and origin story?' },
    { id: 'role', name: 'Story Role & Function', description: 'What\'s their narrative purpose and dramatic function?' },
    { id: 'refinement', name: 'Final Refinement & Style', description: 'How similar should they be and what tone adjustments?' }
  ];

  // Progressive question topics for worlds  
  const worldQuestionTopics = [
    { id: 'spatial', name: 'Spatial Relationship', description: 'How are these locations connected geographically and spatially?' },
    { id: 'cultural', name: 'Cultural Connection', description: 'How do their societies, cultures, and inhabitants relate?' },
    { id: 'visual', name: 'Visual DNA & Harmony', description: 'How do they share visual characteristics while being distinct?' },
    { id: 'historical', name: 'Historical Timeline & Link', description: 'What\'s their shared history and temporal connection?' },
    { id: 'functional', name: 'Functional Relationship', description: 'How do they serve different narrative and story purposes?' },
    { id: 'refinement', name: 'Final Refinement & Atmosphere', description: 'How similar should they be and what atmospheric adjustments?' }
  ];

  const questionTopics = specType === 'character' ? characterQuestionTopics : worldQuestionTopics;

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
      id: 'romantic_interest', 
      name: 'Romantic Interest', 
      icon: '💕',
      description: 'Love interest with complementary chemistry and appeal' 
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

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen]);

  const resetModal = () => {
    setCurrentStep(0);
    setSelectedRelationship('');
    setBaseDescription('');
    setIsLoading(false);
    setError(null);
    setCurrentQuestion('');
    setCurrentOptions([]);
    setResponses({});
    setIsComplete(false);
    setFinalResults(null);
    setGeneratedOptions([]);
    setRefinementSettings({
      similarity: 70,
      toneShift: 'same',
      paletteShift: 'same',
      ageShift: 'same',
      difficultyShift: 'same'
    });
  };

  const handleInitialSubmit = async () => {
    if (!selectedRelationship) {
      setError('Please select a relationship type to continue');
      return;
    }

    if (!aiApiService.hasApiKey()) {
      setError('Groq API key required. Please set your API key in settings.');
      return;
    }

    await generateNextQuestion(1);
  };

  const generateNextQuestion = async (stepNumber) => {
    setIsLoading(true);
    setError(null);

    try {
      const topic = questionTopics[stepNumber - 1];
      const result = await aiApiService.generateProgressiveRelatedQuestion({
        baseSpec,
        specType,
        selectedRelationship,
        currentTopic: topic,
        stepNumber,
        totalSteps: maxSteps,
        previousResponses: responses
      });

      if (result.success) {
        setCurrentStep(stepNumber);
        setCurrentQuestion(result.question);
        setCurrentOptions(result.options);
      } else {
        setError(result.error || 'Failed to generate question. Please try again.');
      }
    } catch (err) {
      console.error('Question generation error:', err);
      setError('Failed to generate question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = async (selectedOption, optionIndex) => {
    // Save the response
    const topic = questionTopics[currentStep - 1];
    const newResponses = {
      ...responses,
      [topic.id]: {
        question: currentQuestion,
        answer: selectedOption,
        optionIndex: optionIndex,
        stepNumber: currentStep
      }
    };

    setResponses(newResponses);

    // Move to next step or show refinement controls
    if (currentStep < maxSteps - 1) {
      // Generate next question (steps 1-5)
      await generateNextQuestion(currentStep + 1);
    } else if (currentStep === maxSteps - 1) {
      // Move to refinement step (step 6) - don't generate question, show controls
      setCurrentStep(maxSteps);
    } else {
      // This shouldn't happen, but fallback to generate final result
      await generateFinalRelated(newResponses);
    }
  };

  const generateFinalRelated = async (allResponses) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await aiApiService.generateProgressiveRelatedFinal({
        baseSpec,
        specType,
        selectedRelationship,
        responses: allResponses,
        questionTopics,
        refinementSettings
      });

      if (result.success) {
        setFinalResults(result.results);
        setGeneratedOptions(result.options);
        setIsComplete(true);
      } else {
        setError(result.error || 'Failed to generate final related options. Please try again.');
      }
    } catch (err) {
      console.error('Final generation error:', err);
      setError('Failed to generate final related options. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefinementGenerate = async () => {
    await generateFinalRelated(responses);
  };

  const handleSelectOption = (option) => {
    if (onResult) {
      onResult(option);
    }
    handleClose();
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  const handleBackStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
      
      if (currentStep === 1) {
        // Back to relationship selection
        setCurrentQuestion('');
        setCurrentOptions([]);
      } else {
        // Regenerate previous question
        const prevTopic = questionTopics[currentStep - 2];
        generateNextQuestion(currentStep - 1);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/50 flex items-start justify-center z-[9999] p-6">
      <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-cinema-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-cinema-text mb-2">
                🌟 Make Related {specType === 'character' ? 'Character' : 'World'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                {currentStep === 0 
                  ? `Choose the relationship type and build through progressive questions`
                  : `Step ${currentStep} of ${maxSteps}: ${questionTopics[currentStep - 1]?.name}`
                }
              </p>
              
              {/* Progress indicator */}
              {currentStep > 0 && (
                <div className="mt-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 dark:bg-cinema-border rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / maxSteps) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-cinema-text-muted">
                      {currentStep}/{maxSteps}
                    </span>
                  </div>
                </div>
              )}
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
          
          {/* Step 0: Relationship Selection */}
          {currentStep === 0 && (
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

              {/* Start Progressive Questions Button */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInitialSubmit}
                  disabled={!selectedRelationship || isLoading}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    selectedRelationship && !isLoading
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Starting...' : 'Start Progressive Questions'}
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

          {/* Progressive Questions Steps 1-5 */}
          {currentStep > 0 && currentStep < maxSteps && (
            <div className="space-y-6">
              {/* Current Question */}
              <div className="bg-gray-50 dark:bg-cinema-card rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {currentStep}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-cinema-text">
                      {questionTopics[currentStep - 1]?.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                      {questionTopics[currentStep - 1]?.description}
                    </p>
                  </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                      Generating question for {questionTopics[currentStep - 1]?.name.toLowerCase()}...
                    </p>
                  </div>
                )}

                {/* Question and Options */}
                {!isLoading && currentQuestion && (
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-cinema-panel p-4 rounded-lg border border-gray-200 dark:border-cinema-border">
                      <p className="text-gray-800 dark:text-cinema-text font-medium">
                        {currentQuestion}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionSelect(option, index)}
                          className="p-4 text-left border-2 border-gray-200 dark:border-cinema-border rounded-lg hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 bg-white dark:bg-cinema-card"
                        >
                          <p className="text-sm text-gray-800 dark:text-cinema-text">
                            {option}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handleBackStep}
                  disabled={currentStep <= 1 || isLoading}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentStep <= 1 || isLoading
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>

                <div className="text-sm text-gray-500 dark:text-cinema-text-muted">
                  Question {currentStep} of {maxSteps}
                </div>

                <div className="w-20"></div> {/* Spacer for layout balance */}
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

          {/* Step 6: Refinement Controls */}
          {currentStep === maxSteps && !isComplete && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:bg-gradient-to-r dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {maxSteps}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-cinema-text">
                      Final Refinement & Similarity
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                      Adjust how similar the generated {specType === 'character' ? 'characters' : 'worlds'} should be to your original
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Similarity Slider */}
                  <div className="bg-white dark:bg-cinema-panel p-4 rounded-lg border border-gray-200 dark:border-cinema-border">
                    <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-3">
                      Similarity Level: {refinementSettings.similarity}%
                    </label>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-500 dark:text-gray-400">More Different</span>
                      <input
                        type="range"
                        min="20"
                        max="95"
                        value={refinementSettings.similarity}
                        onChange={(e) => setRefinementSettings(prev => ({ ...prev, similarity: parseInt(e.target.value) }))}
                        className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #9333ea 0%, #9333ea ${(refinementSettings.similarity - 20) / 75 * 100}%, #e5e7eb ${(refinementSettings.similarity - 20) / 75 * 100}%, #e5e7eb 100%)`
                        }}
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">More Similar</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Lower values create more variation, higher values stay closer to the original
                    </p>
                  </div>

                  {/* Tone & Style Adjustments */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tone Shift */}
                    <div className="bg-white dark:bg-cinema-panel p-4 rounded-lg border border-gray-200 dark:border-cinema-border">
                      <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
                        Tone Shift
                      </label>
                      <select
                        value={refinementSettings.toneShift}
                        onChange={(e) => setRefinementSettings(prev => ({ ...prev, toneShift: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text text-sm"
                      >
                        <option value="darker">Darker/Edgier</option>
                        <option value="same">Keep Same Tone</option>
                        <option value="lighter">Lighter/Friendlier</option>
                      </select>
                    </div>

                    {/* Palette Shift */}
                    <div className="bg-white dark:bg-cinema-panel p-4 rounded-lg border border-gray-200 dark:border-cinema-border">
                      <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
                        Color Palette
                      </label>
                      <select
                        value={refinementSettings.paletteShift}
                        onChange={(e) => setRefinementSettings(prev => ({ ...prev, paletteShift: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text text-sm"
                      >
                        <option value="warmer">Warmer Colors</option>
                        <option value="same">Keep Same Palette</option>
                        <option value="cooler">Cooler Colors</option>
                      </select>
                    </div>

                    {/* Character-specific: Age/Danger Shift */}
                    {specType === 'character' && (
                      <div className="bg-white dark:bg-cinema-panel p-4 rounded-lg border border-gray-200 dark:border-cinema-border">
                        <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
                          Age & Danger Level
                        </label>
                        <select
                          value={refinementSettings.ageShift}
                          onChange={(e) => setRefinementSettings(prev => ({ ...prev, ageShift: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text text-sm"
                        >
                          <option value="younger">Younger/Safer</option>
                          <option value="same">Keep Same Age/Risk</option>
                          <option value="older">Older/More Dangerous</option>
                        </select>
                      </div>
                    )}

                    {/* World-specific: Difficulty Shift */}
                    {specType === 'world' && (
                      <div className="bg-white dark:bg-cinema-panel p-4 rounded-lg border border-gray-200 dark:border-cinema-border">
                        <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
                          Difficulty & Danger
                        </label>
                        <select
                          value={refinementSettings.difficultyShift}
                          onChange={(e) => setRefinementSettings(prev => ({ ...prev, difficultyShift: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text text-sm"
                        >
                          <option value="easier">Safer/Easier</option>
                          <option value="same">Keep Same Difficulty</option>
                          <option value="harder">More Dangerous/Challenging</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Generate Button */}
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={handleRefinementGenerate}
                      disabled={isLoading}
                      className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                        isLoading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                          <span>Generating Related {specType === 'character' ? 'Characters' : 'Worlds'}...</span>
                        </div>
                      ) : (
                        `Generate Related ${specType === 'character' ? 'Characters' : 'Worlds'} 🎉`
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation for Step 6 */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handleBackStep}
                  disabled={isLoading}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isLoading
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>

                <div className="text-sm text-gray-500 dark:text-cinema-text-muted">
                  Ready to generate with {refinementSettings.similarity}% similarity
                </div>

                <div className="w-20"></div> {/* Spacer for layout balance */}
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

          {/* Final Results */}
          {isComplete && finalResults && (
            <div className="space-y-6" data-related-results>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-3">
                  🎉 Your Related {specType === 'character' ? 'Characters' : 'Worlds'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-cinema-text-muted mb-4">
                  Generated based on your progressive answers. Each option inherits the DNA while exploring the {selectedRelationship.replace('_', ' ')} relationship.
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
                          {option.name || `Related ${specType} ${index + 1}`}
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
                          Key aspects: {option.keyDifferences.slice(0, 2).join(', ')}
                          {option.keyDifferences.length > 2 && '...'}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setCurrentStep(0);
                    setIsComplete(false);
                    setFinalResults(null);
                    setGeneratedOptions([]);
                    setResponses({});
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ← Start Over
                </button>
                <button
                  onClick={() => generateFinalRelated(responses)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Generating...' : 'Generate New Variations'}
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