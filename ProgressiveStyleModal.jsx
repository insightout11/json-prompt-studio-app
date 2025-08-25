import React, { useState, useEffect } from 'react';
import aiApiService from './aiApiService';
import RelatedGeneratorModal from './RelatedGeneratorModal';
import { useStore } from './store';
import usePromptStore from './store';
import { useToast } from './useToast';

const ProgressiveStyleModal = ({ isOpen, onClose, onResult, currentJson }) => {
  // Store access for builder context tracking
  const setBuilderContext = useStore(state => state.setBuilderContext);
  const { exportData } = usePromptStore();
  const { showSuccess } = useToast();
  
  // State management
  const [currentStep, setCurrentStep] = useState(0); // 0 = input, 1-6 = questions
  const [styleDescription, setStyleDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentOptions, setCurrentOptions] = useState([]);
  const [responses, setResponses] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [finalStyle, setFinalStyle] = useState(null);
  const [showRelatedModal, setShowRelatedModal] = useState(false);

  const maxSteps = 6;
  
  // Question topics for progression - Visual style approach
  const questionTopics = [
    { id: 'mood', name: 'Visual Mood & Aesthetic', description: 'What is the overall emotional tone and visual feeling of your style?' },
    { id: 'cinematography', name: 'Cinematography & Framing', description: 'How should the camera work and shot composition look?' },
    { id: 'lighting', name: 'Lighting & Atmosphere', description: 'What kind of lighting style and atmospheric mood do you want?' },
    { id: 'color', name: 'Color Palette & Treatment', description: 'What colors and visual treatment should dominate the style?' },
    { id: 'technical', name: 'Technical Style & Quality', description: 'What production quality and technical characteristics should it have?' },
    { id: 'influence', name: 'Directorial Influence & Movement', description: 'What directors, films, or artistic movements should inspire the style?' }
  ];

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen]);

  // Auto-scroll to generated style data when created
  useEffect(() => {
    if (finalStyle) {
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
  }, [finalStyle]);

  const resetModal = () => {
    setCurrentStep(0);
    setStyleDescription('');
    setIsLoading(false);
    setError(null);
    setCurrentQuestion('');
    setCurrentOptions([]);
    setResponses({});
    setIsComplete(false);
    setFinalStyle(null);
    setShowRelatedModal(false);
    setShowSaveModal(false);
  };

  const handleInitialSubmit = async () => {
    if (!styleDescription.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate first question
      const result = await aiApiService.generateProgressiveStyleQuestion({
        originalDescription: styleDescription.trim(),
        currentTopic: questionTopics[0],
        stepNumber: 1,
        totalSteps: maxSteps,
        previousResponses: {}
      });
      
      if (result.success) {
        setCurrentQuestion(result.question);
        setCurrentOptions(result.options);
        setCurrentStep(1);
      } else {
        setError(result.error || 'Failed to generate question');
      }
    } catch (err) {
      setError('Failed to start style generation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = async (selectedOption) => {
    const currentTopic = questionTopics[currentStep - 1];
    const newResponses = {
      ...responses,
      [currentTopic.id]: selectedOption
    };
    setResponses(newResponses);
    
    if (currentStep >= maxSteps) {
      // Generate final style
      await generateFinalStyle(newResponses);
    } else {
      // Generate next question
      setIsLoading(true);
      setError(null);
      
      try {
        const nextTopic = questionTopics[currentStep];
        const result = await aiApiService.generateProgressiveStyleQuestion({
          originalDescription: styleDescription.trim(),
          currentTopic: nextTopic,
          stepNumber: currentStep + 1,
          totalSteps: maxSteps,
          previousResponses: newResponses
        });
        
        if (result.success) {
          setCurrentQuestion(result.question);
          setCurrentOptions(result.options);
          setCurrentStep(currentStep + 1);
        } else {
          setError(result.error || 'Failed to generate question');
        }
      } catch (err) {
        setError('Failed to generate next question');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const generateFinalStyle = async (finalResponses) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await aiApiService.generateFinalStyleFromResponses({
        originalDescription: styleDescription.trim(),
        responses: finalResponses
      });
      
      if (result.success) {
        setFinalStyle(result.style);
        setIsComplete(true);
      } else {
        setError(result.error || 'Failed to generate final style');
      }
    } catch (err) {
      setError('Failed to generate final style');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseStyle = () => {
    if (finalStyle && onResult) {
      onResult(finalStyle);
      
      // Save style context for Storyboard Builder
      setBuilderContext('style', finalStyle);
      
      onClose();
    }
  };

  const handleStartOver = () => {
    resetModal();
  };

  const handleShowRelated = () => {
    setShowRelatedModal(true);
  };

  const handleSaveJSON = () => {
    exportData('current');
    showSuccess('Style saved successfully!');
  };


  const handleCompleteEarly = async () => {
    // Clear any existing errors
    setError(null);
    
    // Check if we have minimum required responses (at least 2)
    const responseCount = Object.keys(responses).length;
    if (responseCount < 2) {
      setError('Please answer at least 2 questions before completing your style.');
      return;
    }

    // Generate final style with current responses
    await generateFinalStyle(responses);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 dark:bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-light-panel dark:bg-cinema-panel rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-light-panel dark:bg-cinema-panel border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  🎨 Progressive Style Builder
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {currentStep === 0 && 'Describe your ideal visual style'}
                  {currentStep > 0 && currentStep <= maxSteps && !isComplete && 
                    `Step ${currentStep} of ${maxSteps}: ${questionTopics[currentStep - 1]?.name}`}
                  {isComplete && 'Style Generated Successfully!'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Progress Bar */}
            {currentStep > 0 && !isComplete && (
              <div className="mt-4">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / maxSteps) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Step 0: Initial Input */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Describe your ideal visual style:
                  </label>
                  <textarea
                    value={styleDescription}
                    onChange={(e) => setStyleDescription(e.target.value)}
                    placeholder="e.g., Wes Anderson symmetrical aesthetic with warm pastels, or Dark moody cinematography with dramatic shadows..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none h-24"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInitialSubmit}
                    disabled={isLoading || !styleDescription.trim()}
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border border-white border-t-transparent rounded-full"></div>
                        <span>Starting...</span>
                      </>
                    ) : (
                      <span>Start Building Style</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Steps 1-6: Questions */}
            {currentStep > 0 && currentStep <= maxSteps && !isComplete && (
              <div className="space-y-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {currentQuestion}
                  </p>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin h-8 w-8 border border-purple-600 border-t-transparent rounded-full"></div>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Generating options...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        className="p-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 rounded-lg transition-all duration-200"
                      >
                        <span className="text-gray-800 dark:text-gray-200">{option}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={handleStartOver}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    disabled={isLoading}
                  >
                    Start Over
                  </button>
                  
                  <div className="flex items-center space-x-4">
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
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Question {currentStep} of {maxSteps}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Final Results */}
            {isComplete && finalStyle && (
              <div className="space-y-6" data-style-results>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                    🎉 Your Custom Style is Ready!
                  </h4>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Based on "{styleDescription}" and your preferences
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {finalStyle.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {finalStyle.summary}
                    </p>
                  </div>

                  {finalStyle.formFields && Object.keys(finalStyle.formFields).length > 0 && (
                    <div className="space-y-4">
                      <h5 className="font-semibold text-gray-900 dark:text-white">
                        Style Details:
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(finalStyle.formFields).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 dark:bg-gray-600 rounded p-3">
                            <div className="font-medium text-sm text-gray-700 dark:text-gray-300 capitalize">
                              {key.replace(/_/g, ' ')}
                            </div>
                            <div className="text-gray-900 dark:text-white text-sm mt-1">
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-between">
                  <div className="flex gap-3">
                    <button
                      onClick={handleStartOver}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md"
                    >
                      Create Another
                    </button>
                    <button
                      onClick={handleShowRelated}
                      className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 border border-purple-300 dark:border-purple-700 rounded-md"
                    >
                      Generate Related Styles
                    </button>
                    <button
                      onClick={handleSaveJSON}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-md"
                    >
                      💾 Save JSON
                    </button>
                  </div>
                  
                  <button
                    onClick={handleUseStyle}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                  >
                    Use This Style
                  </button>
                </div>
                
                {/* Storyboard Integration Button */}
                <div className="border-t border-gray-200 dark:border-cinema-border pt-3 mt-3">
                  <button
                    onClick={() => {
                      // Apply style and then close to open storyboard
                      if (finalStyle && onResult) {
                        onResult(finalStyle);
                        setBuilderContext('style', finalStyle);
                      }
                      onClose();
                      // Trigger storyboard modal opening
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('openStoryboard', { 
                          detail: { withStyle: true } 
                        }));
                      }, 100);
                    }}
                    className="w-full px-4 py-2 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-300 font-medium rounded-lg transition-all duration-300 border-2 border-blue-300 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-500"
                  >
                    🎬 Create Storyboard with Style
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    Jump to Storyboard Builder with this style automatically imported
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Generator Modal */}
      {showRelatedModal && finalStyle && (
        <RelatedGeneratorModal
          isOpen={showRelatedModal}
          onClose={() => setShowRelatedModal(false)}
          baseSpec={finalStyle.formFields || finalStyle}
          generatorType="style"
          onResult={(relatedStyle) => {
            if (onResult) {
              onResult(relatedStyle);
              // Save style context for Storyboard Builder
              setBuilderContext('style', relatedStyle);
            }
            setShowRelatedModal(false);
            onClose();
          }}
        />
      )}

    </>
  );
};

export default ProgressiveStyleModal;