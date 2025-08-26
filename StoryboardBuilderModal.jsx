import React, { useState, useEffect } from 'react';
import aiApiService from './aiApiService';
import { useStore } from './store';
import { useToast } from './useToast';
import RelatedGeneratorModal from './RelatedGeneratorModal';

const StoryboardBuilderModal = ({ isOpen, onClose, onResult, currentJson }) => {
  // Store access for builder context tracking
  const setBuilderContext = useStore(state => state.setBuilderContext);
  const getAvailableContexts = useStore(state => state.getAvailableContexts);
  const { exportData, savedScenes, fieldValues, generateRandomSeed } = useStore();
  const { showSuccess } = useToast();
  
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
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [selectedApplyOption, setSelectedApplyOption] = useState('overview');
  
  // Multi-scene navigation state
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [showSceneOverview, setShowSceneOverview] = useState(true);

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
    setShowSaveModal(false);
    setSaveName('');
    setCurrentSceneIndex(0);
    setShowSceneOverview(true);
  };

  // Scene navigation helpers
  const getScenes = () => {
    return finalStoryboard?.scenes || [];
  };

  const getCurrentScene = () => {
    const scenes = getScenes();
    return scenes[currentSceneIndex] || null;
  };

  const handleSceneNavigation = (direction) => {
    const scenes = getScenes();
    if (direction === 'next' && currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    } else if (direction === 'prev' && currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
    }
  };

  const handleExportScene = (sceneIndex = null) => {
    const scenes = getScenes();
    const targetScene = sceneIndex !== null ? scenes[sceneIndex] : getCurrentScene();
    
    if (targetScene && targetScene.formFields) {
      // Get consistency guide from the storyboard for shared characteristics
      const consistencyGuide = finalStoryboard?.consistency_guide || {};
      
      // Generate or use locked seed for visual consistency across scenes
      const baseSeed = fieldValues.seed || generateRandomSeed();
      const sceneSeed = fieldValues.lock_identity ? baseSeed : baseSeed + targetScene.scene_number;
      
      // Create a complete JSON prompt for this specific scene with full consistency features
      const sceneJson = {
        // Core scene content
        ...targetScene.formFields,
        
        // Consistency features for visual coherence
        seed: sceneSeed,
        lock_identity: fieldValues.lock_identity !== undefined ? fieldValues.lock_identity : true,
        lock_style: fieldValues.lock_style !== undefined ? fieldValues.lock_style : true,
        creativity: fieldValues.creativity || 0.2, // Lower creativity for consistency
        
        // Visual consistency from storyboard
        palette: fieldValues.palette || consistencyGuide.color_palette || 'cinematic, professional',
        negative: fieldValues.negative || 'blurry, distorted, amateur, inconsistent lighting',
        
        // Camera specifications from scene data
        camera_lens_mm: targetScene.formFields?.camera_lens_mm || 35,
        camera_move: targetScene.formFields?.camera_move || 'static',
        camera_speed: targetScene.formFields?.camera_speed || 'normal',
        duration_s: targetScene.duration_seconds || targetScene.formFields?.duration_s || 5,
        fps: fieldValues.fps || 24,
        
        // Scene metadata for organization
        scene_number: targetScene.scene_number,
        scene_title: targetScene.title,
        storyboard_title: finalStoryboard?.title || 'Storyboard Scene',
        total_scenes: scenes.length,
        
        // Additional consistency data
        lighting_style: consistencyGuide.lighting_style || targetScene.lighting || 'cinematic',
        character_consistency: consistencyGuide.character_identity || 'maintain character appearance across scenes',
        
        // Aspect ratio and technical specs
        aspect_ratio: '16:9',
        
        // Scene transitions (helpful for maintaining flow)
        transitions: targetScene.transitions,
        ...(targetScene.scene_number > 1 && { previous_scene_context: `Previous scene: ${scenes[targetScene.scene_number - 2]?.title}` }),
        ...(targetScene.scene_number < scenes.length && { next_scene_context: `Next scene: ${scenes[targetScene.scene_number]?.title}` })
      };

      // Export this scene as JSON
      const blob = new Blob([JSON.stringify(sceneJson, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${finalStoryboard?.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'storyboard'}_scene_${targetScene.scene_number}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showSuccess(`Scene ${targetScene.scene_number} exported with consistency features!`);
    }
  };

  const handleExportAllScenes = () => {
    const scenes = getScenes();
    scenes.forEach((scene, index) => {
      setTimeout(() => handleExportScene(index), index * 500); // Stagger downloads
    });
    showSuccess(`All ${scenes.length} scenes exported!`);
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

  const handleApplyStoryboard = (sceneIndex = null) => {
    if (finalStoryboard && onResult) {
      let dataToApply;
      
      if (sceneIndex !== null) {
        // Apply specific scene data
        const scenes = getScenes();
        const targetScene = scenes[sceneIndex];
        if (targetScene && targetScene.formFields) {
          dataToApply = targetScene.formFields;
        } else {
          console.error('Scene not found or missing formFields:', targetScene);
          return;
        }
      } else {
        // Apply storyboard overview data (original behavior)
        dataToApply = finalStoryboard.formFields || finalStoryboard;
      }

      const updatedJson = {
        ...currentJson || {},
        ...dataToApply
      };
      onResult(updatedJson);
      
      // Save context for future use
      setBuilderContext('storyboard', dataToApply);
    }
    onClose();
  };

  const handleSaveToLibrary = () => {
    setShowSaveModal(true);
  };

  const handleSaveConfirm = () => {
    if (saveName.trim() && finalStoryboard) {
      // Create a comprehensive storyboard entry for the library
      const scenes = getScenes();
      const sceneData = {
        id: Date.now().toString(),
        name: saveName.trim(),
        timestamp: Date.now(),
        type: 'storyboard', // Mark this as a multi-scene storyboard
        data: {
          // Overview data (for backward compatibility with existing scenes)
          ...finalStoryboard.formFields || finalStoryboard,
          // Complete storyboard with all scenes
          storyboard: {
            overview: finalStoryboard,
            scenes: scenes,
            sceneCount: scenes.length,
            totalDuration: finalStoryboard.total_duration || finalStoryboard.target_duration,
            metadata: {
              createdAt: Date.now(),
              generator: 'storyboard-builder',
              version: '2.0'
            }
          }
        },
        projectIds: []
      };

      // Add to saved scenes
      const updatedScenes = [...savedScenes, sceneData].slice(-20);
      
      try {
        localStorage.setItem('savedScenes', JSON.stringify(updatedScenes));
        useStore.setState({ savedScenes: updatedScenes });
        
        showSuccess(`Storyboard "${saveName}" saved to library with ${scenes.length} scenes!`);
        setShowSaveModal(false);
        setSaveName('');
      } catch (error) {
        console.error('Error saving to library:', error);
        showSuccess('Error saving storyboard to library. Please try again.');
      }
    }
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
              /* Multi-Scene Storyboard Completion State */
              <div data-storyboard-results className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎬</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-cinema-text mb-2">
                    {finalStoryboard?.title || 'Storyboard Complete!'}
                  </h3>
                  <p className="text-gray-600 dark:text-cinema-text-muted">
                    {finalStoryboard?.description || 'Your detailed multi-scene storyboard has been generated.'}
                  </p>
                  
                  {finalStoryboard && (
                    <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <span>📽️</span>
                        <span>{getScenes().length} scenes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>⏱️</span>
                        <span>{finalStoryboard.total_duration || finalStoryboard.target_duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>🎯</span>
                        <span>{finalStoryboard.overall_tone}</span>
                      </div>
                    </div>
                  )}
                </div>

                {finalStoryboard && getScenes().length > 0 ? (
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700/50 rounded-xl p-6">
                    {/* Overview/Individual Scene Toggle */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex bg-white dark:bg-cinema-card rounded-lg border p-1">
                        <button
                          onClick={() => setShowSceneOverview(true)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            showSceneOverview
                              ? 'bg-blue-500 text-white shadow-sm'
                              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                          }`}
                        >
                          📋 Overview
                        </button>
                        <button
                          onClick={() => setShowSceneOverview(false)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            !showSceneOverview
                              ? 'bg-blue-500 text-white shadow-sm'
                              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                          }`}
                        >
                          🎬 Scene Details
                        </button>
                      </div>

                      {/* Export All Button */}
                      <button
                        onClick={handleExportAllScenes}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-sm"
                      >
                        📦 Export All Scenes
                      </button>
                    </div>

                    {showSceneOverview ? (
                      /* Scene Overview Grid */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getScenes().map((scene, index) => (
                          <div
                            key={scene.scene_number || index}
                            className="bg-white dark:bg-cinema-card rounded-lg border border-gray-200 dark:border-gray-600 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
                            onClick={() => {
                              setCurrentSceneIndex(index);
                              setShowSceneOverview(false);
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                Scene {scene.scene_number}
                              </h4>
                              <div className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                {scene.duration_seconds || scene.duration}s
                              </div>
                            </div>
                            <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                              {scene.title}
                            </h5>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                              {typeof scene.description === 'string' 
                                ? scene.description 
                                : JSON.stringify(scene.description, null, 2)}
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  📍 {typeof scene.setting === 'string' 
                                    ? scene.setting?.slice(0, 30) + '...' 
                                    : JSON.stringify(scene.setting)?.slice(0, 30) + '...'}
                                </div>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApplyStoryboard(index);
                                  }}
                                  className="flex-1 text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition-all"
                                >
                                  Apply Scene
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleExportScene(index);
                                  }}
                                  className="flex-1 text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-all"
                                >
                                  Export
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Individual Scene Detail View */
                      <div className="space-y-6">
                        {/* Scene Navigation */}
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => handleSceneNavigation('prev')}
                            disabled={currentSceneIndex === 0}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded-lg transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Previous</span>
                          </button>

                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Scene {currentSceneIndex + 1} of {getScenes().length}
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {getCurrentScene()?.title}
                            </h4>
                          </div>

                          <button
                            onClick={() => handleSceneNavigation('next')}
                            disabled={currentSceneIndex === getScenes().length - 1}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded-lg transition-all"
                          >
                            <span>Next</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>

                        {/* Scene Details */}
                        {getCurrentScene() && (
                          <div className="bg-white dark:bg-cinema-card rounded-lg border p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">📝 Description</h5>
                                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                    {typeof getCurrentScene().description === 'string' 
                                      ? getCurrentScene().description 
                                      : JSON.stringify(getCurrentScene().description, null, 2)}
                                  </p>
                                </div>
                                
                                <div>
                                  <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">📍 Setting</h5>
                                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    {typeof getCurrentScene().setting === 'string' 
                                      ? getCurrentScene().setting 
                                      : JSON.stringify(getCurrentScene().setting, null, 2)}
                                  </p>
                                </div>

                                <div>
                                  <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">👥 Characters</h5>
                                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    {typeof getCurrentScene().characters === 'string' 
                                      ? getCurrentScene().characters 
                                      : JSON.stringify(getCurrentScene().characters, null, 2)}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🎭 Mood & Atmosphere</h5>
                                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    {typeof getCurrentScene().mood === 'string' 
                                      ? getCurrentScene().mood 
                                      : JSON.stringify(getCurrentScene().mood, null, 2)}
                                  </p>
                                </div>

                                <div>
                                  <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">📹 Camera Work</h5>
                                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    {typeof getCurrentScene().camera_work === 'string' 
                                      ? getCurrentScene().camera_work 
                                      : JSON.stringify(getCurrentScene().camera_work, null, 2)}
                                  </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">⏱️ Duration</h5>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                      {getCurrentScene().duration_seconds || getCurrentScene().duration} seconds
                                    </p>
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">💡 Lighting</h5>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                      {getCurrentScene().lighting || 'Natural'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {getCurrentScene().key_visual_elements && (
                              <div>
                                <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">✨ Key Visual Elements</h5>
                                <div className="flex flex-wrap gap-2">
                                  {getCurrentScene().key_visual_elements.map((element, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                      {element}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-600 space-y-3">
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Transitions: {getCurrentScene().transitions || 'Cut to next scene'}
                              </div>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleApplyStoryboard(currentSceneIndex)}
                                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                  <span>Apply Scene {getCurrentScene().scene_number}</span>
                                </button>
                                <button
                                  onClick={() => handleExportScene()}
                                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span>Export Scene {getCurrentScene().scene_number}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : finalStoryboard ? (
                  /* Debug Section - Show what we actually have */
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                      Debug Info - Storyboard Data
                    </h4>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300">
                      <p>Scenes found: {getScenes().length}</p>
                      <p>Storyboard keys: {Object.keys(finalStoryboard).join(', ')}</p>
                      <details className="mt-2">
                        <summary className="cursor-pointer">Show Raw Data</summary>
                        <pre className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-800/30 rounded text-xs overflow-auto max-h-64">
                          {JSON.stringify(finalStoryboard, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </div>
                ) : null}

                {/* Scene Selection for Apply */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Choose what to apply to your JSON:</h4>
                  <select
                    value={selectedApplyOption}
                    onChange={(e) => setSelectedApplyOption(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="overview">📋 Storyboard Overview</option>
                    {getScenes().map((scene, index) => (
                      <option key={index} value={`scene-${index}`}>
                        🎬 Scene {scene.scene_number}: {scene.title?.slice(0, 40)}...
                      </option>
                    ))}
                  </select>
                </div>

                {/* Main Action Buttons */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        const sceneIndex = selectedApplyOption.startsWith('scene-') 
                          ? parseInt(selectedApplyOption.split('-')[1]) 
                          : null;
                        handleApplyStoryboard(sceneIndex);
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {selectedApplyOption === 'overview' ? 'Apply Overview to Scene 🎬' : 
                       `Apply ${getScenes()[parseInt(selectedApplyOption.split('-')[1])]?.title || 'Selected Scene'} 🎬`}
                    </button>
                    <button
                      onClick={handleSaveToLibrary}
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-cinema-teal dark:hover:bg-cinema-teal/90 text-white rounded-lg transition-all"
                    >
                      💾 Save to Library
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
      
      {/* Save to Library Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{zIndex: 9999}}>
          <div className="bg-white dark:bg-cinema-panel rounded-lg p-6 w-96 border border-transparent dark:border-cinema-border shadow-xl dark:shadow-glow-soft transition-all duration-300 relative">            
            {/* Close X button - absolute positioned */}
            <button
              onClick={() => setShowSaveModal(false)}
              className="absolute w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all"
              style={{
                top: '16px',
                right: '16px',
                zIndex: 10,
                position: 'absolute'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-cinema-text transition-colors duration-300 pr-10">
              Save Storyboard to Library
            </h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Enter storyboard name..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cinema-teal mb-4 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text transition-all duration-300"
              onKeyPress={(e) => e.key === 'Enter' && handleSaveConfirm()}
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={handleSaveConfirm}
                disabled={!saveName.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-cinema-teal dark:hover:bg-cinema-teal/90 dark:hover:shadow-glow-teal disabled:bg-gray-300 dark:disabled:bg-cinema-border text-white rounded-md transition-all duration-300"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-cinema-card dark:hover:bg-cinema-border dark:border dark:border-cinema-border text-white dark:text-cinema-text rounded-md transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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