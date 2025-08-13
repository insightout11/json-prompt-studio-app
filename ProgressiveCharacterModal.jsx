import React, { useState, useEffect } from 'react';
import aiApiService from './aiApiService';
import RelatedGeneratorModal from './RelatedGeneratorModal';
import { useStore } from './store';

const ProgressiveCharacterModal = ({ isOpen, onClose, onResult, currentJson }) => {
  // Store access for builder context tracking
  const setBuilderContext = useStore(state => state.setBuilderContext);
  
  // State management
  const [currentStep, setCurrentStep] = useState(0); // 0 = input, 1-6 = questions
  const [characterDescription, setCharacterDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentOptions, setCurrentOptions] = useState([]);
  const [responses, setResponses] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [finalCharacter, setFinalCharacter] = useState(null);
  const [showRelatedModal, setShowRelatedModal] = useState(false);

  const maxSteps = 6;
  
  // Question topics for progression - Visual-first approach
  const questionTopics = [
    { id: 'physical', name: 'Basic Physical Traits', description: 'What are your character\'s core physical characteristics?' },
    { id: 'facial', name: 'Facial Features & Expression', description: 'How does your character\'s face look and what\'s their typical expression?' },
    { id: 'clothing', name: 'Clothing & Style', description: 'How does your character dress and present themselves?' },
    { id: 'movement', name: 'Movement & Presence', description: 'How does your character carry themselves and move?' },
    { id: 'voice', name: 'Voice & Communication', description: 'How does your character speak and express themselves?' },
    { id: 'background', name: 'Background & Depth', description: 'What\'s your character\'s history and deeper personality?' }
  ];

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen]);

  const resetModal = () => {
    setCurrentStep(0);
    setCharacterDescription('');
    setIsLoading(false);
    setError(null);
    setCurrentQuestion('');
    setCurrentOptions([]);
    setResponses({});
    setIsComplete(false);
    setFinalCharacter(null);
    setShowRelatedModal(false);
  };

  const handleInitialSubmit = async () => {
    if (!characterDescription.trim()) {
      setError('Please provide a character description to get started');
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
      const result = await aiApiService.generateProgressiveCharacterQuestion({
        originalDescription: characterDescription,
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
        selectedOption,
        selectedIndex: optionIndex,
        topic: topic.name
      }
    };
    setResponses(newResponses);

    // Check if we're done
    if (currentStep >= maxSteps) {
      // Generate final character
      await generateFinalCharacter(newResponses);
    } else {
      // Generate next question
      await generateNextQuestion(currentStep + 1);
    }
  };

  const generateFinalCharacter = async (allResponses) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await aiApiService.generateFinalCharacterFromResponses({
        originalDescription: characterDescription,
        responses: allResponses
      });

      if (result.success) {
        setFinalCharacter(result.character);
        setIsComplete(true);
      } else {
        setError(result.error || 'Failed to generate final character');
      }
    } catch (err) {
      console.error('Final character generation error:', err);
      setError('Failed to generate final character. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyCharacter = () => {
    if (finalCharacter && onResult) {
      // Apply character data, merging with current JSON
      const updatedJson = {
        ...currentJson || {},
        ...finalCharacter.formFields || finalCharacter
      };
      onResult(updatedJson);
      
      // Save character context for Storyboard Generator
      setBuilderContext('character', finalCharacter.formFields || finalCharacter);
    }
    onClose();
  };

  const handleRelatedResult = (relatedCharacter) => {
    if (relatedCharacter && onResult) {
      // Apply the related character's form fields to the scene
      const updatedJson = {
        ...currentJson || {},
        ...relatedCharacter.formFields || relatedCharacter
      };
      onResult(updatedJson);
      
      // Save character context for Storyboard Generator
      setBuilderContext('character', relatedCharacter.formFields || relatedCharacter);
    }
    // Close both modals
    setShowRelatedModal(false);
    onClose();
  };

  const handleCompleteEarly = async () => {
    // Clear any existing errors
    setError(null);
    
    // Check if we have minimum required responses (at least 2)
    const responseCount = Object.keys(responses).length;
    if (responseCount < 2) {
      setError('Please answer at least 2 questions before completing your character.');
      return;
    }

    // Generate final character with current responses
    await generateFinalCharacter(responses);
  };

  const goBack = () => {
    if (currentStep > 1) {
      // Remove the last response
      const topic = questionTopics[currentStep - 1];
      const newResponses = { ...responses };
      delete newResponses[topic.id];
      setResponses(newResponses);
      
      // Go back to previous question
      generateNextQuestion(currentStep - 1);
    } else if (currentStep === 1) {
      // Go back to input
      setCurrentStep(0);
      setCurrentOptions([]);
      setCurrentQuestion('');
    }
  };

  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-xl dark:shadow-glow-soft max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-transparent dark:border-cinema-border">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-cinema-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-cinema-text mb-2">
                🎭 Character Builder
              </h2>
              {currentStep > 0 && !isComplete && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-cinema-text-muted mb-1">
                    Question {currentStep} of {maxSteps}: {questionTopics[currentStep - 1]?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {questionTopics[currentStep - 1]?.description}
                  </p>
                </div>
              )}
              {isComplete && (
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  ✅ Character creation complete!
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors"
            >
              ×
            </button>
          </div>
          
          {/* Progress Bar */}
          {currentStep > 0 && !isComplete && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Question {currentStep} of {maxSteps}</span>
                <span>{currentStep}/{maxSteps} (minimum 2)</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-cinema-border rounded-full h-1.5">
                {/* Show minimum threshold */}
                <div className="relative">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / maxSteps) * 100}%` }}
                  ></div>
                  {/* Minimum threshold indicator */}
                  <div 
                    className="absolute top-0 h-1.5 w-0.5 bg-green-500"
                    style={{ left: `${(2 / maxSteps) * 100}%` }}
                    title="Minimum questions needed"
                  ></div>
                </div>
              </div>
              {currentStep >= 2 && (
                <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Ready to complete! Continue for more detail or finish now.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Initial Input Step */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-2">
                  Describe Your Character
                </h3>
                <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                  Tell me about your character idea. I'll ask you 6 targeted questions to build them out completely.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
                  Character Description
                </label>
                <textarea
                  value={characterDescription}
                  onChange={(e) => setCharacterDescription(e.target.value)}
                  placeholder="e.g., A street-smart mechanic in a cyberpunk city who never removes their welding goggles and speaks only in technical metaphors..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-cinema-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text resize-none"
                  disabled={isLoading}
                />
              </div>
              
              {/* Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">💡 Tips for better characters:</p>
                <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Include their role or profession</li>
                  <li>• Mention a key personality trait or quirk</li>
                  <li>• Add some visual details or style preferences</li>
                  <li>• Hint at their background or motivations</li>
                </ul>
              </div>

              <button
                onClick={handleInitialSubmit}
                disabled={isLoading || !characterDescription.trim()}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                  isLoading || !characterDescription.trim()
                    ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Generating first question...
                  </div>
                ) : (
                  'Start Character Building 🚀'
                )}
              </button>
            </div>
          )}

          {/* Question Step */}
          {currentStep > 0 && !isComplete && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-cinema-text-muted">
                    {currentStep === 1 ? 'Generating your first question...' : 'Preparing next question...'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Question Display */}
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-2">
                      {currentQuestion}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                      Choose the option that best fits your vision:
                    </p>
                  </div>
                  
                  {/* Options Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(option, index)}
                        className="p-4 text-left border-2 border-gray-200 dark:border-cinema-border rounded-lg hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 bg-white dark:bg-cinema-card group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                            <span className="text-purple-600 dark:text-purple-400 font-medium text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-cinema-text mb-1">
                              {option.title || option.label || option}
                            </h4>
                            {option.description && (
                              <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                                {option.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Final Character Display */}
          {isComplete && finalCharacter && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-cinema-text mb-2">
                  🎉 Your Character is Ready!
                </h3>
                <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                  Based on your responses, here's your complete character:
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">
                  {finalCharacter.name || 'Your Character'}
                </h4>
                
                <div className="space-y-4 text-sm">
                  {finalCharacter.summary && (
                    <div>
                      <strong className="text-green-700 dark:text-green-400">Overview:</strong>
                      <p className="text-green-600 dark:text-green-300 mt-1">{finalCharacter.summary}</p>
                    </div>
                  )}
                  
                  {finalCharacter.appearance && (
                    <div>
                      <strong className="text-green-700 dark:text-green-400">Appearance:</strong>
                      <p className="text-green-600 dark:text-green-300 mt-1">{finalCharacter.appearance}</p>
                    </div>
                  )}
                  
                  {finalCharacter.personality && (
                    <div>
                      <strong className="text-green-700 dark:text-green-400">Personality:</strong>
                      <p className="text-green-600 dark:text-green-300 mt-1">{finalCharacter.personality}</p>
                    </div>
                  )}
                  
                  {finalCharacter.background && (
                    <div>
                      <strong className="text-green-700 dark:text-green-400">Background:</strong>
                      <p className="text-green-600 dark:text-green-300 mt-1">{finalCharacter.background}</p>
                    </div>
                  )}
                  
                  {finalCharacter.uniqueTraits && (
                    <div>
                      <strong className="text-green-700 dark:text-green-400">Unique Traits:</strong>
                      <p className="text-green-600 dark:text-green-300 mt-1">{finalCharacter.uniqueTraits}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleApplyCharacter}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Apply Character to Scene 🎬
                  </button>
                  <button
                    onClick={resetModal}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Create Another Character
                  </button>
                </div>
                
                {/* Make Related Button */}
                <div className="border-t border-gray-200 dark:border-cinema-border pt-3">
                  <button
                    onClick={() => setShowRelatedModal(true)}
                    className="w-full px-4 py-2 bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-200 dark:hover:bg-purple-800/30 text-purple-700 dark:text-purple-300 font-medium rounded-lg transition-all duration-300 border-2 border-purple-300 dark:border-purple-600 hover:border-purple-400 dark:hover:border-purple-500"
                  >
                    🌟 Make Related Characters
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    Generate siblings, rivals, mentors and more that share this character's DNA
                  </p>
                </div>
                
                {/* Storyboard Integration Button */}
                <div className="border-t border-gray-200 dark:border-cinema-border pt-3">
                  <button
                    onClick={() => {
                      // Apply character and then close to open storyboard
                      if (finalCharacter && onResult) {
                        const updatedJson = {
                          ...currentJson || {},
                          ...finalCharacter.formFields || finalCharacter
                        };
                        onResult(updatedJson);
                        setBuilderContext('character', finalCharacter.formFields || finalCharacter);
                      }
                      onClose();
                      // Trigger storyboard modal opening (need to pass this as prop or use event)
                      setTimeout(() => {
                        // This will be handled by the parent component
                        window.dispatchEvent(new CustomEvent('openStoryboard', { 
                          detail: { withCharacter: true } 
                        }));
                      }, 100);
                    }}
                    className="w-full px-4 py-2 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-300 font-medium rounded-lg transition-all duration-300 border-2 border-blue-300 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-500"
                  >
                    🎬 Create Storyboard with Character
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    Jump to Storyboard Generator with this character automatically imported
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
              </div>
            </div>
          )}

          {/* Navigation */}
          {currentStep > 0 && !isComplete && !isLoading && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-cinema-border">
              <button
                onClick={goBack}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>← Go Back</span>
              </button>
              
              {Object.keys(responses).length >= 2 && (
                <button
                  onClick={handleCompleteEarly}
                  disabled={isLoading}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isLoading 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-green-100 hover:bg-green-200 text-green-700 border border-green-300 hover:border-green-400'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-1">
                      <div className="animate-spin w-3 h-3 border border-green-600 border-t-transparent rounded-full"></div>
                      <span>Completing...</span>
                    </div>
                  ) : (
                    `Complete Now (${Object.keys(responses).length}/${maxSteps})`
                  )}
                </button>
              )}
              
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Step {currentStep} of {maxSteps}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Related Generator Modal */}
      <RelatedGeneratorModal
        isOpen={showRelatedModal}
        onClose={() => setShowRelatedModal(false)}
        baseSpec={finalCharacter}
        specType="character"
        onResult={handleRelatedResult}
      />
    </div>
  );
};

export default ProgressiveCharacterModal;