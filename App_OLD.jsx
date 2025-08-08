import React, { useState, useEffect, useRef } from 'react';
import { schema } from './schema';
import FieldRenderer from './FieldRenderer';
import TemplateSelector from './TemplateSelector';
import ImportSystem from './ImportSystem';
import ThemeToggle from './ThemeToggle';
import ModeToggle from './ModeToggle';
import CinematicModeToggle from './CinematicModeToggle';
import Logo from './Logo';
import LoadingScreen from './LoadingScreen';
import InstantUpgradeModal from './InstantUpgradeModal';
import FullScreenToggle, { useFullScreen } from './FullScreenToggle';
import ViralVideoGeneratorModal from './ViralVideoGeneratorModal';
import LibrarySystem from './LibrarySystem';
import ProFeaturesHub from './ProFeaturesHub';
import SceneBuilderChecklist from './SceneBuilderChecklist';
import ProjectSelector from './ProjectSelector';
import { useSubscription } from './StripeIntegration';
import ProBadge from './ProBadge';
import UpgradeButton from './UpgradeButton';
import ToggleSwitch from './ToggleSwitch';
import UniversalInput from './UniversalInput';
import aiApiService from './aiApiService';
import usePromptStore from './store';
import analytics from './analytics';
import TutorialOverlay from './TutorialOverlay';
import { ToastContainer } from './Toast';
import { useToast } from './useToast';

const App = () => {
  const { 
    expandedCategories, 
    toggleCategory, 
    getJsonOutput, 
    randomizeFields, 
    randomizeCharacterFields, 
    randomizeSceneFields,
    randomizeLocationBased,
    randomizeCinematicStyle,
    randomizeEnvironmental,
    randomizeTechnicalSetup,
    clearAll,
    setFieldValue,
    saveScenePack,
    saveCharacter,
    saveAction,
    saveAudio,
    saveSetting,
    saveStyle,
    saveScene,
    currentProject,
    projects,
    switchProject,
    applySceneWithMergeStrategy,
    incrementProjectSceneCount,
    aspectRatio,
    setAspectRatio,
    undo,
    undoStack
  } = usePromptStore();

  // State Management
  const [copySuccess, setCopySuccess] = useState(false);
  const [showRandomizeDropdown, setShowRandomizeDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [showViralGenerator, setShowViralGenerator] = useState(false);
  const [showSceneExtender, setShowSceneExtender] = useState(false);
  const [sceneExtenderSuccess, setSceneExtenderSuccess] = useState(false);
  const [isFullScreen, toggleFullScreen] = useFullScreen(false);
  
  // Scene extension states
  const [extensionLoading, setExtensionLoading] = useState(false);
  const [extensionResult, setExtensionResult] = useState(null);
  const [extensionError, setExtensionError] = useState(null);
  const [sceneOptions, setSceneOptions] = useState(null);
  const [appliedOptionIndex, setAppliedOptionIndex] = useState(null);
  const [showScenePackModal, setShowScenePackModal] = useState(false);
  const [scenePackName, setScenePackName] = useState('');
  const [mergeStrategy, setMergeStrategy] = useState('smart');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  
  // Modal and UI states
  const subscriptionHook = useSubscription();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveCategory, setSaveCategory] = useState('');
  const [saveName, setSaveName] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  
  // Toast notifications
  const { toasts, removeToast, showSuccess, showError, showWarning, showInfo } = useToast();
  
  // All users now have pro access
  const isPro = true;
  const { subscription, toggleProStatus, forceProStatus, resetUser, refreshUser } = subscriptionHook;
  const randomizeDropdownRef = useRef(null);

  // Tutorial action handler
  const handleTutorialAction = (action, params) => {
    switch (action) {
      case 'toggleMode':
        setIsAdvancedMode(!isAdvancedMode);
        break;
      case 'expandCategory':
        if (params && !expandedCategories[params]) {
          toggleCategory(params);
        }
        break;
      default:
        console.log('Unknown tutorial action:', action);
    }
  };

  // Confirmation preferences utilities
  const getConfirmationPreference = (actionType) => {
    return localStorage.getItem(`jsonPromptStudio_skip${actionType}Confirm`) === 'true';
  };

  const setConfirmationPreference = (actionType, skipConfirm) => {
    localStorage.setItem(`jsonPromptStudio_skip${actionType}Confirm`, skipConfirm.toString());
  };

  const resetConfirmationPreference = (actionType) => {
    localStorage.removeItem(`jsonPromptStudio_skip${actionType}Confirm`);
  };

  const resetAllConfirmations = () => {
    resetConfirmationPreference('ClearAll');
    resetConfirmationPreference('Randomize');
  };

  // Confirmation modal handlers
  const handleClearAllClick = () => {
    if (getConfirmationPreference('ClearAll')) {
      clearAll();
      return;
    }
    setDontShowAgain(false);
    setShowConfirmModal({
      type: 'clearAll',
      actionType: 'ClearAll',
      title: 'Clear All Data?',
      message: 'This will permanently delete your current scene and reset all fields. This action cannot be undone.',
      confirmText: 'Clear All',
      confirmClass: 'bg-red-500 hover:bg-red-600',
      onConfirm: () => {
        if (dontShowAgain) {
          setConfirmationPreference('ClearAll', true);
        }
        clearAll();
        setShowConfirmModal(null);
        setDontShowAgain(false);
      }
    });
  };

  const handleFullSceneRandomizeClick = () => {
    if (getConfirmationPreference('Randomize')) {
      randomizeFields();
      setShowRandomizeDropdown(false);
      return;
    }
    setDontShowAgain(false);
    setShowConfirmModal({
      type: 'fullRandomize',
      actionType: 'Randomize',
      title: 'Randomize Full Scene?',
      message: 'This will replace all your current scene settings with randomly generated values. Your current work will be lost.',
      confirmText: 'Randomize Scene',
      confirmClass: 'bg-purple-500 hover:bg-purple-600',
      onConfirm: () => {
        if (dontShowAgain) {
          setConfirmationPreference('Randomize', true);
        }
        randomizeFields();
        setShowRandomizeDropdown(false);
        setShowConfirmModal(null);
        setDontShowAgain(false);
      }
    });
  };

  // Initialize API service with environment variables
  useEffect(() => {
    if (import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_OPENAI_API_KEY) {
      console.log('🔧 Initializing API service with environment variables from App.jsx');
      aiApiService.initializeApiKeys(import.meta.env);
    }
  }, []);

  // Developer functions for console access (development only)
  useEffect(() => {
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
      window.devTogglePro = () => {
        console.log('🔧 DEV: Console command - toggling Pro status');
        return toggleProStatus();
      };
      window.devForcePro = () => {
        console.log('🔧 DEV: Console command - forcing Pro status');
        return forceProStatus();
      };
      window.devStatus = () => {
        console.log('🔧 DEV: Current status - isPro:', isPro);
        return { isPro, subscription };
      };
      window.devResetTutorial = () => {
        console.log('🔧 DEV: Resetting tutorial');
        localStorage.removeItem('hasSeenTutorial');
        setShowTutorial(true);
        return 'Tutorial reset and shown';
      };
      window.devShowTutorial = () => {
        console.log('🔧 DEV: Showing tutorial directly');
        setShowTutorial(true);
        return 'Tutorial shown';
      };
      console.log('🔧 DEV: Console commands available - devTogglePro(), devForcePro(), devStatus(), devResetTutorial(), devShowTutorial()');
    }
  }, [toggleProStatus, forceProStatus, isPro, subscription]);

  // Check if user should see tutorial
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial && !isLoading) {
      setShowTutorial(true);
    }
  }, [isLoading]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (randomizeDropdownRef.current && !randomizeDropdownRef.current.contains(event.target)) {
        setShowRandomizeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Track initial page load
  useEffect(() => {
    if (!isLoading) {
      analytics.trackPageView('/', 'AI Video Prompt Generator - Home');
    }
  }, [isLoading]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getJsonOutput());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      
      // Track export action
      analytics.trackExport('json');
    } catch (err) {
      console.error('Failed to copy: ', err);
      analytics.trackError('clipboard_copy_failed', err.message);
    }
  };

  // Generate 5 scene options handler
  const handleGenerate5Options = async () => {
    if (!isPro) {
      setShowPricing(true);
      return;
    }

    if (!aiApiService.hasApiKey()) {
      setExtensionError('OpenAI API key required. Please set your API key in settings.');
      return;
    }

    const currentScene = getJsonOutput() ? JSON.parse(getJsonOutput() || '{}') : {};
    
    if (Object.keys(currentScene).length === 0) {
      setExtensionError('No scene to extend. Please create a scene first.');
      return;
    }

    setExtensionLoading(true);
    setExtensionError(null);
    setSceneOptions(null);
    setAppliedOptionIndex(null);

    try {
      const response = await aiApiService.generateSceneOptions(currentScene, 5);
      
      if (response.success && response.options && response.options.length > 0) {
        setSceneOptions(response.options);
      } else {
        setExtensionError(response.error || 'Failed to generate scene options. Please try again.');
      }
      
    } catch (error) {
      console.error('Scene options generation error:', error);
      setExtensionError('Failed to generate scene options. Please try again.');
    } finally {
      setExtensionLoading(false);
    }
  };

  // Apply selected scene option with smart merging
  const handleApplySceneOption = (option, optionIndex, strategy = null) => {
    console.log('Applying scene option:', option);
    
    if (option.json && typeof option.json === 'object') {
      // Use the specified strategy or the current merge strategy setting
      const usedStrategy = strategy || mergeStrategy;
      
      console.log('Applying JSON with strategy:', usedStrategy, option.json);
      
      // Apply scene with the chosen merge strategy
      applySceneWithMergeStrategy(option.json, usedStrategy);
      
      // Track which option was applied (keep options visible)
      setAppliedOptionIndex(optionIndex);
      
      // Increment project scene count if we have a current project
      if (currentProject) {
        incrementProjectSceneCount(currentProject.id);
      }
      
      // Show brief success message
      setExtensionResult({
        type: option.type.toLowerCase(),
        summary: `Applied: ${option.summary} (${usedStrategy} merge)`
      });
      
      // Auto-hide result after 3 seconds
      setTimeout(() => {
        setExtensionResult(null);
      }, 3000);
      
      // Smooth scroll to JSON output
      setTimeout(() => {
        const jsonSection = document.querySelector('.json-output-section');
        if (jsonSection) {
          jsonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      console.error('Scene option missing json property:', option);
      setExtensionError('Scene option is missing JSON data. Please try generating new options.');
    }
  };

  // Dismiss scene options manually
  const handleDismissSceneOptions = () => {
    setSceneOptions(null);
    setAppliedOptionIndex(null);
    setExtensionResult(null);
  };

  // Handle scene pack saving
  const handleSaveScenePack = () => {
    if (!sceneOptions || sceneOptions.length === 0) return;
    
    const currentScene = getJsonOutput() ? JSON.parse(getJsonOutput() || '{}') : {};
    const packName = scenePackName.trim() || `Scene Pack ${new Date().toLocaleDateString()}`;
    
    try {
      const packId = saveScenePack(packName, sceneOptions, currentScene);
      
      // Show success message
      setExtensionResult({
        type: 'pack_saved',
        summary: `Scene pack "${packName}" saved successfully!`
      });
      
      // Close modal and reset
      setShowScenePackModal(false);
      setScenePackName('');
      
      // Auto-hide success message
      setTimeout(() => {
        setExtensionResult(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving scene pack:', error);
      setExtensionError('Failed to save scene pack. Please try again.');
    }
  };

  // Legacy simple extension handler (keeping for backward compatibility)
  const handleSimpleExtension = async (extensionType) => {
    if (!isPro) {
      setShowPricing(true);
      return;
    }

    if (!aiApiService.hasApiKey()) {
      setExtensionError('OpenAI API key required. Please set your API key in settings.');
      return;
    }

    const currentScene = getJsonOutput() ? JSON.parse(getJsonOutput() || '{}') : {};
    
    if (Object.keys(currentScene).length === 0) {
      setExtensionError('No scene to extend. Please create a scene first.');
      return;
    }

    setExtensionLoading(true);
    setExtensionError(null);
    setExtensionResult(null);

    try {
      const response = await aiApiService.extendSceneSimple(currentScene, extensionType);
      
      if (response.success) {
        // Update the store with the extended scene data
        if (response.updatedJson && typeof response.updatedJson === 'object') {
          Object.keys(response.updatedJson).forEach(key => {
            if (response.updatedJson[key] !== undefined) {
              setFieldValue(key, response.updatedJson[key]);
            }
          });
        }
        
        // Show the result summary
        setExtensionResult({
          type: extensionType,
          summary: response.summary
        });
        
        // Auto-hide result after 5 seconds
        setTimeout(() => {
          setExtensionResult(null);
        }, 5000);
        
      } else {
        setExtensionError(response.error || 'Extension failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Extension error:', error);
      setExtensionError('Extension failed. Please try again.');
    } finally {
      setExtensionLoading(false);
    }
  };

  const handleSceneExtended = (extendedScene) => {
    // Update the store with the extended scene data
    if (extendedScene && typeof extendedScene === 'object') {
      Object.keys(extendedScene).forEach(key => {
        if (key !== '_metadata' && extendedScene[key] !== undefined) {
          setFieldValue(key, extendedScene[key]);
        }
      });
      
      // Show success feedback
      setSceneExtenderSuccess(true);
      setShowSceneExtender(false);
      
      // Smooth scroll to JSON output
      setTimeout(() => {
        const jsonSection = document.querySelector('.json-output-section');
        if (jsonSection) {
          jsonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
      // Hide success feedback after 3 seconds
      setTimeout(() => {
        setSceneExtenderSuccess(false);
      }, 3000);
    }
  };

  // Show loading screen first
  if (isLoading) {
    if (import.meta.env.DEV) console.log('App: Showing loading screen');
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  if (import.meta.env.DEV) {
    console.log('App: Loading complete, rendering main app');
    console.log('App: isPro =', isPro);
  }

  // Render randomize dropdown
  const renderRandomizeDropdown = () => (
    <div className="absolute top-full mt-1 right-0 bg-white dark:bg-cinema-panel border border-gray-200 dark:border-cinema-border rounded-md shadow-lg dark:shadow-glow-soft z-10 min-w-[220px]">
      <button
        onClick={() => {
          randomizeCharacterFields();
          setShowRandomizeDropdown(false);
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors duration-300 rounded-t-md"
      >
        👤 Character
      </button>
      <button
        onClick={() => {
          randomizeLocationBased();
          setShowRandomizeDropdown(false);
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors duration-300"
      >
        📍 Setting
      </button>
      <button
        onClick={() => {
          const audioFields = ['sound_effects', 'background_music', 'ambient_sound'];
          audioFields.forEach(field => {
            const randomOptions = ['cinematic', 'dramatic', 'upbeat', 'mysterious', 'calm', 'intense'];
            setFieldValue(field, randomOptions[Math.floor(Math.random() * randomOptions.length)]);
          });
          setShowRandomizeDropdown(false);
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors duration-300"
      >
        🎵 Audio
      </button>
      <button
        onClick={() => {
          const actionFields = ['action', 'movement', 'activity'];
          actionFields.forEach(field => {
            const randomOptions = ['walking', 'running', 'dancing', 'talking', 'working', 'playing', 'sleeping', 'eating'];
            setFieldValue(field, randomOptions[Math.floor(Math.random() * randomOptions.length)]);
          });
          setShowRandomizeDropdown(false);
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors duration-300"
      >
        🎬 Action
      </button>
      <button
        onClick={() => {
          randomizeCinematicStyle();
          setShowRandomizeDropdown(false);
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors duration-300"
      >
        🎨 Style
      </button>
      <button
        onClick={handleFullSceneRandomizeClick}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors duration-300"
      >
        🎲 Full Scene
      </button>
    </div>
  );

  // Render Scene Options
  const renderSceneOptions = () => {
    if (!sceneOptions || sceneOptions.length === 0) return null;

    return (
      <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-lg dark:shadow-glow-soft p-4 lg:p-6 border border-transparent dark:border-cinema-border transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text flex items-center">
            <span className="mr-2">🎬</span>
            AI Scene Options
          </h3>
          <button
            onClick={handleDismissSceneOptions}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
          >
            ✕ Close
          </button>
        </div>
        
        <div className="space-y-3">
          {sceneOptions.map((option, index) => (
            <div key={index} className="bg-gray-50 dark:bg-cinema-card rounded-lg p-3 border border-gray-200 dark:border-cinema-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {option.type}
                    </span>
                    {appliedOptionIndex === index && (
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                        Applied
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-cinema-text mb-2">
                    {option.summary}
                  </p>
                </div>
                <button
                  onClick={() => handleApplySceneOption(option, index)}
                  disabled={appliedOptionIndex === index}
                  className={`ml-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    appliedOptionIndex === index
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 cursor-not-allowed'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                >
                  {appliedOptionIndex === index ? 'Applied' : 'Apply'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Main app render
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinema-black transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-4 py-3 lg:py-6">
        
        {/* HEADER SECTION */}
        <div className="mb-6 bg-white/90 dark:bg-cinema-panel/90 backdrop-blur-md border border-cinema-border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Desktop Header - 3 Column Grid */}
          <div className="hidden md:grid md:grid-cols-12 md:gap-4 items-center py-3 px-4 transition-all duration-300">
            {/* LEFT SECTION - Project & Navigation Context */}
            <div className="col-span-4 flex items-center space-x-3">
              <Logo size="small" />
              <div className="flex items-center space-x-3">
                <ProjectSelector />
                <div className="h-5 w-px header-section-divider"></div>
                <LibrarySystem showToast={{ showSuccess, showError, showWarning, showInfo }} headerMode={true} />
              </div>
            </div>

            {/* CENTER SECTION - Persistent Creative Tools */}
            <div className="col-span-4 flex items-center justify-center">
              <div className="flex items-center space-x-1 md:space-x-2 flex-wrap justify-center">
                {/* Templates & Presets */}
                <TemplateSelector />
                
                {/* Viral Generator */}
                <button
                  onClick={() => setShowViralGenerator(true)}
                  className="px-2 md:px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs md:text-sm font-medium rounded-md transition-all duration-300 flex items-center space-x-1 md:space-x-2 shadow-md hover:shadow-lg"
                  title="Viral Video Generator"
                >
                  <span>📹</span>
                  <span className="hidden sm:inline">Viral</span>
                </button>
                
                {/* Randomize Tools */}
                <div className="relative" ref={randomizeDropdownRef}>
                  <button
                    onClick={() => setShowRandomizeDropdown(!showRandomizeDropdown)}
                    className="px-2 md:px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs md:text-sm font-medium rounded-md transition-all duration-300 flex items-center space-x-1 md:space-x-2 shadow-md hover:shadow-lg"
                    title="Randomize Elements"
                  >
                    <span>🎲</span>
                    <span className="hidden sm:inline">Randomize</span>
                  </button>
                  {showRandomizeDropdown && renderRandomizeDropdown()}
                </div>
              </div>
            </div>

            {/* RIGHT SECTION - Mode & UI Controls */}
            <div className="col-span-4 flex items-center justify-end space-x-3">
              <ModeToggle 
                isAdvancedMode={isAdvancedMode} 
                onModeChange={setIsAdvancedMode}
              />
              <div className="h-6 w-px header-section-divider"></div>
              <CinematicModeToggle />
            </div>
          </div>

          {/* Mobile Header - Stacked Layout */}
          <div className="md:hidden space-y-3 py-3 px-4 transition-all duration-300">
            {/* Top Row: Logo, Project, Mode Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Logo size="small" width={100} height={40} />
                <ProjectSelector />
              </div>
              <div className="flex items-center space-x-2">
                <ModeToggle 
                  isAdvancedMode={isAdvancedMode} 
                  onModeChange={setIsAdvancedMode}
                  className="scale-90"
                />
                <CinematicModeToggle className="scale-90" />
              </div>
            </div>
            
            {/* Bottom Row: Library and Creative Tools */}
            <div className="flex items-center justify-between">
              <LibrarySystem showToast={{ showSuccess, showError, showWarning, showInfo }} headerMode={true} />
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setShowViralGenerator(true)}
                  className="px-2 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs font-medium rounded-md transition-all duration-300"
                  title="Viral Generator"
                >
                  📹
                </button>
                <button
                  onClick={() => setShowRandomizeDropdown(!showRandomizeDropdown)}
                  className="px-2 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs font-medium rounded-md transition-all duration-300"
                  title="Randomize"
                >
                  🎲
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MODE INDICATOR */}
        <div className="mb-4 flex items-center justify-center">
          <div className={`
            inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300
            ${isAdvancedMode 
              ? 'bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700' 
              : 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
            }
          `}>
            <div className={`
              w-2 h-2 rounded-full mr-2 transition-colors duration-300
              ${isAdvancedMode ? 'bg-purple-500' : 'bg-blue-500'}
            `} />
            {isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          
          {/* LEFT PANEL */}
          <div className="space-y-4 lg:space-y-6 min-h-[400px] relative">
            {/* Simple Mode: Scene Builder Only */}
            {!isAdvancedMode && (
              <div data-tutorial="scene-builder" className="transition-all duration-500 ease-in-out transform">
                <SceneBuilderChecklist 
                  compact={true}
                  isAdvancedMode={isAdvancedMode}
                  setIsAdvancedMode={setIsAdvancedMode}
                  showToast={{ showSuccess, showError, showWarning, showInfo }}
                  onProjectChange={(data) => {
                    if (data && data.type === 'switchToAdvanced') {
                      setIsAdvancedMode(true);
                      // Scroll to the relevant category if specified
                      if (data.category) {
                        setTimeout(() => {
                          const categoryElement = document.querySelector(`[data-category="${data.category}"]`);
                          if (categoryElement) {
                            categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }, 100);
                      }
                    } else {
                      switchProject(data);
                    }
                  }}
                />
              </div>
            )}
            
            {/* Advanced Mode: Configuration Panel Only */}
            {isAdvancedMode && (
              <div data-tutorial="form-fields" className="bg-white dark:bg-cinema-panel rounded-lg shadow-lg dark:shadow-glow-soft p-4 lg:p-6 border border-transparent dark:border-cinema-border transition-all duration-500 ease-in-out transform">
                <div className="mb-4 lg:mb-6">
                  <div className="mb-3 lg:mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-cinema-text">
                          Configure Your Prompt
                        </h2>
                        {isAdvancedMode && (
                          <p className="text-xs text-gray-600 dark:text-cinema-text-muted mt-1">
                            Detailed manual configuration for all scene elements
                          </p>
                        )}
                      </div>
                      
                      {/* Advanced Mode Toggle */}
                      <div data-tutorial="mode-toggle" className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {isAdvancedMode ? '🔧 Advanced ↔ Simple' : '📝 Simple ↔ Advanced'}
                        </span>
                        <ToggleSwitch
                          enabled={isAdvancedMode}
                          onToggle={setIsAdvancedMode}
                          size="medium"
                          color="blue"
                          labelPosition="none"
                        />
                      </div>
                    </div>
                  </div>
                
                  <div className="space-y-4 transition-all duration-300">
                    {schema.categories.map((category) => (
                      <div key={category.id} data-category={category.id} className="border border-gray-200 dark:border-cinema-border rounded-lg transition-colors duration-300">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-cinema-card hover:bg-gray-100 dark:hover:bg-cinema-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cinema-teal transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-cinema-text">
                              {category.label}
                            </span>
                            <svg
                              className={`w-5 h-5 text-gray-500 dark:text-cinema-text-muted transition-all duration-300 ${
                                expandedCategories.has(category.id) ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </button>
                        
                        {expandedCategories.has(category.id) && (
                          <div className="p-4 border-t border-gray-200 dark:border-cinema-border bg-white dark:bg-cinema-panel/50">
                            {category.fields.map((field) => (
                              <FieldRenderer key={field.key} field={field} />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* RIGHT PANEL */}
          <FullScreenToggle isFullScreen={isFullScreen} onToggle={toggleFullScreen}>
            <div data-tutorial="json-output" className="bg-white dark:bg-cinema-panel rounded-lg shadow-lg dark:shadow-glow-soft p-4 lg:p-6 space-y-4 lg:space-y-6 border border-transparent dark:border-cinema-border transition-all duration-300">
              
              {/* JSON OUTPUT SECTION */}
              <div className="json-output-section">
                {/* Success Notification */}
                {sceneExtenderSuccess && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg animate-pulse">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        🎬 Scene extended successfully! Your JSON has been updated.
                      </span>
                    </div>
                  </div>
                )}
                
                {/* JSON Output Header */}
                <div className="flex items-center justify-between mb-3 py-2 border-b border-gray-200 dark:border-cinema-border">
                  <div className="flex items-center space-x-2 lg:space-x-4">
                    <h2 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-cinema-text">
                      JSON Output
                    </h2>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500 dark:text-cinema-text-muted">Ratio:</span>
                      <select
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value)}
                        className="text-xs px-2 py-1 bg-white dark:bg-cinema-panel border border-gray-300 dark:border-cinema-border rounded text-gray-700 dark:text-cinema-text h-6"
                      >
                        <option value="1:1">🔳 1:1</option>
                        <option value="16:9">🖥️ 16:9</option>
                        <option value="9:16">📱 9:16</option>
                        <option value="4:3">📺 4:3</option>
                        <option value="21:9">🎬 21:9</option>
                        <option value="3:2">📸 3:2</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className={`px-3 py-2 text-xs rounded transition-all duration-300 flex items-center justify-center ${
                        copySuccess 
                          ? 'bg-green-500 text-white' 
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                      }`}
                    >
                      {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                    
                    <button
                      onClick={() => setShowSaveModal(true)}
                      className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-xs flex items-center justify-center"
                    >
                      💾 Save
                    </button>
                    
                    <button
                      onClick={() => {
                        const success = undo();
                        if (success) {
                          showSuccess('Previous state restored!');
                        } else {
                          showInfo('Nothing to undo');
                        }
                      }}
                      disabled={undoStack.length === 0}
                      className="px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors text-xs flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Undo last action"
                    >
                      ↶ Undo
                    </button>
                    
                    <button
                      onClick={handleClearAllClick}
                      className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-xs flex items-center justify-center"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                
                {/* JSON Container */}
                <div className="bg-gray-900 dark:bg-cinema-black rounded-lg p-4 h-40 md:h-64 max-h-[50vh] overflow-auto border border-gray-700 dark:border-cinema-border relative">
                  <pre className="text-green-400 dark:text-cinema-teal text-sm font-mono whitespace-pre-wrap">
                    {getJsonOutput() || '{}'}
                    <span className="animate-cursor-blink text-cinema-teal">▊</span>
                  </pre>
                </div>
              </div>
              
              {/* UNIVERSAL INPUT + AI FEATURES */}
              <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-lg dark:shadow-glow-soft p-4 lg:p-6 border border-transparent dark:border-cinema-border transition-all duration-300">
                <UniversalInput 
                  aiFeatures={
                    <ProFeaturesHub 
                      isPro={isPro}
                      onShowPricing={() => setShowPricing(true)}
                      onSceneExtenderClick={() => handleGenerate5Options()}
                      currentJson={JSON.parse(getJsonOutput() || '{}')}
                      onJsonUpdate={(updatedJson) => {
                        // Update the store with the new JSON data
                        if (updatedJson && typeof updatedJson === 'object') {
                          Object.keys(updatedJson).forEach(key => {
                            if (key !== '_metadata' && updatedJson[key] !== undefined) {
                              setFieldValue(key, updatedJson[key]);
                            }
                          });
                        }
                      }}
                      sceneOptions={sceneOptions}
                      onApplySceneOption={handleApplySceneOption}
                      onDismissSceneOptions={handleDismissSceneOptions}
                      extensionLoading={extensionLoading}
                      extensionError={extensionError}
                      compact={true}
                    />
                  }
                />
              </div>
              
              {/* AI SCENE OPTIONS */}
              {renderSceneOptions()}

            </div>
          </FullScreenToggle>
        </div>

        {/* FOOTER */}
        <footer className="mt-12 pt-8 pb-6 border-t border-gray-200 dark:border-cinema-border">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
            <a 
              href="/privacy-policy.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 px-4 py-2 bg-white dark:bg-cinema-card border border-gray-200 dark:border-cinema-border rounded-lg hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md transition-all duration-300 text-gray-700 dark:text-cinema-text"
            >
              <span className="text-purple-500">🔒</span>
              <span className="text-sm font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Privacy Policy</span>
            </a>
            <a 
              href="/terms-of-service.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 px-4 py-2 bg-white dark:bg-cinema-card border border-gray-200 dark:border-cinema-border rounded-lg hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md transition-all duration-300 text-gray-700 dark:text-cinema-text"
            >
              <span className="text-purple-500">📜</span>
              <span className="text-sm font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Terms of Service</span>
            </a>
            <a 
              href="mailto:insightout11@gmail.com"
              className="group flex items-center space-x-2 px-4 py-2 bg-white dark:bg-cinema-card border border-gray-200 dark:border-cinema-border rounded-lg hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md transition-all duration-300 text-gray-700 dark:text-cinema-text"
            >
              <span className="text-purple-500">✉️</span>
              <span className="text-sm font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Contact</span>
            </a>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-cinema-text-muted">&copy; 2025 JSON Prompt Studio. All rights reserved.</p>
          </div>
        </footer>

        {/* TOAST CONTAINER */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />

      </div>
    </div>
  );
};

export default App;