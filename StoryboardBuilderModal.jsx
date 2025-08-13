import React, { useState, useEffect } from 'react';
import aiApiService from './aiApiService';
import { useStore } from './store';
import RelatedGeneratorModal from './RelatedGeneratorModal';

const StoryboardBuilderModal = ({ isOpen, onClose, onResult, currentJson }) => {
  // Store access for builder context tracking
  const setBuilderContext = useStore(state => state.setBuilderContext);
  const getAvailableContexts = useStore(state => state.getAvailableContexts);
  
  // State management following progressive pattern
  const [currentStep, setCurrentStep] = useState(0); // 0 = input, 1-6 = questions
  const [storyDescription, setStoryDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentOptions, setCurrentOptions] = useState([]);
  const [responses, setResponses] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [finalStoryboard, setFinalStoryboard] = useState(null);
  const [showRelatedModal, setShowRelatedModal] = useState(false);

  const maxSteps = 6;
  
  // Question topics for progression - Story-first approach
  const questionTopics = [
    { id: 'premise', name: 'Story Premise', description: 'What is the core concept and main conflict of your story?' },
    { id: 'protagonist', name: 'Main Character Journey', description: 'Who is your protagonist and what do they want?' },
    { id: 'structure', name: 'Narrative Structure', description: 'How should your story unfold and what pacing do you prefer?' },
    { id: 'scenes', name: 'Key Scenes & Moments', description: 'What are the most important scenes that must be included?' },
    { id: 'tone', name: 'Visual Style & Tone', description: 'What mood, atmosphere, and visual style should guide your storyboard?' },
    { id: 'details', name: 'Production Details', description: 'What technical and creative specifics will enhance your storyboard?' }
  ];

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen]);

  // Auto-scroll to generated storyboard when created
  useEffect(() => {
    if (finalStoryboard) {
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
  }, [finalStoryboard]);

  const resetModal = () => {
    setCurrentStep(0);
    setStoryDescription('');
    setIsLoading(false);
    setError(null);
    setCurrentQuestion('');
    setCurrentOptions([]);
    setResponses({});
    setIsComplete(false);
    setFinalStoryboard(null);
    setShowRelatedModal(false);
  };

  const handleInitialSubmit = async () => {
    if (!storyDescription.trim()) {
      setError('Please describe your story concept first.');
      return;
    }

    setCurrentStep(1);
    await generateNextQuestion(1);
  };

  const generateNextQuestion = async (stepNumber) => {
    setIsLoading(true);
    setError(null);

    try {
      const topic = questionTopics[stepNumber - 1];
      const availableContexts = getAvailableContexts();
      
      const result = await aiApiService.generateProgressiveStoryboardQuestion({
        originalDescription: storyDescription,
        currentTopic: topic,
        stepNumber,
        totalSteps: maxSteps,
        previousResponses: responses,
        builderContexts: availableContexts,
        currentJson
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

    // If this was the last step, generate final storyboard
    if (currentStep >= maxSteps) {
      await generateFinalStoryboard(newResponses);
    } else {
      // Generate next question
      await generateNextQuestion(currentStep + 1);
    }
  };

  const generateFinalStoryboard = async (allResponses) => {
    setIsLoading(true);
    setError(null);

    try {
      const availableContexts = getAvailableContexts();
      
      const result = await aiApiService.generateFinalStoryboardFromResponses({
        originalDescription: storyDescription,
        responses: allResponses,
        builderContexts: availableContexts,
        currentJson
      });

      if (result.success) {
        setFinalStoryboard(result.storyboard);
        setIsComplete(true);
      } else {
        setError(result.error || 'Failed to generate final storyboard');
      }
    } catch (err) {
      console.error('Final storyboard generation error:', err);
      setError('Failed to generate final storyboard. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyStoryboard = () => {
    if (finalStoryboard && onResult) {
      // Apply storyboard data, merging with current JSON
      const updatedJson = {
        ...currentJson || {},
        ...finalStoryboard.formFields || finalStoryboard
      };
      onResult(updatedJson);
      
      // Save storyboard context for future use
      setBuilderContext('storyboard', finalStoryboard.formFields || finalStoryboard);
    }
    onClose();
  };

  const handleRelatedResult = (relatedStoryboard) => {
    if (relatedStoryboard && onResult) {
      // Apply the related storyboard's form fields to the scene
      const updatedJson = {
        ...currentJson || {},
        ...relatedStoryboard.formFields || relatedStoryboard
      };
      onResult(updatedJson);
      
      // Save storyboard context
      setBuilderContext('storyboard', relatedStoryboard.formFields || relatedStoryboard);
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
      setError('Please answer at least 2 questions before completing your storyboard.');
      return;
    }

    // Generate final storyboard with current responses
    await generateFinalStoryboard(responses);
  };

  const goBack = () => {
    if (currentStep > 1) {
      // Remove the last response
      const topic = questionTopics[currentStep - 1];
      const newResponses = { ...responses };
      delete newResponses[topic.id];
      setResponses(newResponses);
      
      // Go back to previous step
      setCurrentStep(currentStep - 1);
      generateNextQuestion(currentStep - 1);
    } else if (currentStep === 1) {
      // Go back to initial input
      setCurrentStep(0);
      setCurrentQuestion('');
      setCurrentOptions([]);
    }
  };

  const handleStartOver = () => {
    resetModal();
  };

  const handleShowRelated = () => {
    setShowRelatedModal(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 dark:bg-black/50 flex items-center justify-center z-[9999] p-4">
        <div className="bg-light-panel dark:bg-cinema-panel rounded-lg shadow-xl dark:shadow-glow-soft max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-transparent dark:border-cinema-border">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-cinema-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🎬</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-cinema-text">
                    Progressive Storyboard Builder
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-cinema-text-muted mt-1">
                    Build your storyboard through AI-guided questions
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {!isComplete ? (
              <div className="space-y-6">
                {/* Initial Input Step */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-2">
                        Describe Your Story Concept
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-cinema-text-muted mb-4">
                        Start with a brief description of your story idea. Our AI will ask follow-up questions to build a detailed storyboard.
                      </p>
                      
                      {/* Show detected builder contexts */}
                      {Object.keys(getAvailableContexts()).length > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-3 mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-green-600 dark:text-green-400">✨</span>
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                              Detected completed builders - will be used to enhance your storyboard
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 text-xs">
                            {Object.keys(getAvailableContexts()).map((contextType) => (
                              <div key={contextType} className="flex items-center space-x-1">
                                <span>
                                  {contextType === 'character' && '🎭'}
                                  {contextType === 'world' && '🌍'}
                                  {contextType === 'style' && '🎥'}
                                </span>
                                <span className="text-green-700 dark:text-green-300 capitalize">
                                  {contextType}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <textarea
                        value={storyDescription}
                        onChange={(e) => setStoryDescription(e.target.value)}
                        placeholder="Example: A detective investigates a series of mysterious disappearances in a small coastal town, only to discover the supernatural truth..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-cinema-border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text resize-none"
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleInitialSubmit}
                        disabled={!storyDescription.trim() || isLoading}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all"
                      >
                        {isLoading ? 'Starting...' : 'Start Building Storyboard'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Question Steps */}
                {currentStep > 0 && currentStep <= maxSteps && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-2">
                        {questionTopics[currentStep - 1]?.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                        {questionTopics[currentStep - 1]?.description}
                      </p>
                    </div>

                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-cinema-text-muted">Generating your next question...</p>
                      </div>
                    ) : (
                      <>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
                            {currentQuestion}
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            {currentOptions.map((option, index) => (
                              <button
                                key={index}
                                onClick={() => handleOptionSelect(option, index)}
                                className="text-left p-3 bg-white dark:bg-cinema-card border border-blue-200 dark:border-cinema-border rounded-md hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200"
                              >
                                <div className="font-medium text-gray-900 dark:text-cinema-text mb-1">
                                  {option.title}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-cinema-text-muted">
                                  {option.description}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <button
                            onClick={goBack}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                          >
                            ← Back
                          </button>
                          
                          <div className="flex items-center space-x-4">
                            {currentStep >= 2 && (
                              <button
                                onClick={handleCompleteEarly}
                                disabled={isLoading}
                                className="px-4 py-2 bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-800/30 text-green-700 dark:text-green-300 font-medium rounded-lg transition-all duration-300 border-2 border-green-300 dark:border-green-600 hover:border-green-400 dark:hover:border-green-500 disabled:opacity-50"
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
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Completion State */
              <div data-storyboard-results className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎬</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-cinema-text mb-2">
                    Storyboard Complete!
                  </h3>
                  <p className="text-gray-600 dark:text-cinema-text-muted">
                    Your detailed storyboard has been generated based on your responses.
                  </p>
                </div>

                {finalStoryboard && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-6">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-4">
                      Generated Storyboard
                    </h4>
                    <div className="bg-white dark:bg-cinema-card rounded border p-4 max-h-64 overflow-y-auto">
                      <pre className="text-sm text-gray-800 dark:text-cinema-text whitespace-pre-wrap">
                        {JSON.stringify(finalStoryboard.formFields || finalStoryboard, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleApplyStoryboard}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Apply Storyboard to Scene 🎬
                    </button>
                    <button
                      onClick={handleStartOver}
                      className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Create Another Storyboard
                    </button>
                  </div>
                  
                  {/* Make Related Button */}
                  <div className="border-t border-gray-200 dark:border-cinema-border pt-3">
                    <button
                      onClick={() => setShowRelatedModal(true)}
                      className="w-full px-4 py-2 bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-200 dark:hover:bg-purple-800/30 text-purple-700 dark:text-purple-300 font-medium rounded-lg transition-all duration-300 border-2 border-purple-300 dark:border-purple-600 hover:border-purple-400 dark:hover:border-purple-500"
                    >
                      🌟 Make Related Storyboards
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                      Generate alternative versions, sequels, or variations based on this storyboard
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
          </div>
        </div>
      </div>
      
      {/* Related Generator Modal */}
      {showRelatedModal && finalStoryboard && (
        <RelatedGeneratorModal
          isOpen={showRelatedModal}
          onClose={() => setShowRelatedModal(false)}
          baseSpec={finalStoryboard}
          specType="storyboard"
          onResult={handleRelatedResult}
        />
      )}
    </>
  );
};

export default StoryboardBuilderModal;