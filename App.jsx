import React, { useState, useEffect, useRef } from 'react';
import { schema } from './schema';
import FieldRenderer from './FieldRenderer';
import TemplateSelector from './TemplateSelector';
import ImportSystem from './ImportSystem';
import ThemeToggle from './ThemeToggle';
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
    currentProject,
    projects,
    switchProject,
    applySceneWithMergeStrategy,
    incrementProjectSceneCount
  } = usePromptStore();
  const [copySuccess, setCopySuccess] = useState(false);
  const [showRandomizeDropdown, setShowRandomizeDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [showViralGenerator, setShowViralGenerator] = useState(false);
  const [showSceneExtender, setShowSceneExtender] = useState(false);
  const [sceneExtenderSuccess, setSceneExtenderSuccess] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [isFullScreen, toggleFullScreen] = useFullScreen(false);
  
  // Simple scene extension states
  const [extensionLoading, setExtensionLoading] = useState(false);
  const [extensionResult, setExtensionResult] = useState(null);
  const [extensionError, setExtensionError] = useState(null);
  const [sceneOptions, setSceneOptions] = useState(null);
  const [appliedOptionIndex, setAppliedOptionIndex] = useState(null);
  const [showScenePackModal, setShowScenePackModal] = useState(false);
  const [scenePackName, setScenePackName] = useState('');
  const [mergeStrategy, setMergeStrategy] = useState('smart');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  
  const subscriptionHook = useSubscription();
  const [devProOverride, setDevProOverride] = useState(false);
  
  // Override isPro with dev flag
  const isPro = devProOverride || subscriptionHook.isPro;
  const { subscription, toggleProStatus, forceProStatus, resetUser, refreshUser } = subscriptionHook;
  const randomizeDropdownRef = useRef(null);

  // Expose developer functions to window for console access
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
      console.log('🔧 DEV: Console commands available - devTogglePro(), devForcePro(), devStatus()');
    }
  }, [toggleProStatus, forceProStatus, isPro, subscription]);

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

  // Simple extension handler
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
    if (option.json && typeof option.json === 'object') {
      // Use the specified strategy or the current merge strategy setting
      const usedStrategy = strategy || mergeStrategy;
      
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


  // Track initial page load
  useEffect(() => {
    if (!isLoading) {
      analytics.trackPageView('/', 'AI Video Prompt Generator - Home');
    }
  }, [isLoading]);

  // Show loading screen first
  if (isLoading) {
    console.log('App: Showing loading screen');
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  console.log('App: Loading complete, rendering main app');
  console.log('App: isPro =', isPro);
  
  // PHASE 3: Test header components
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinema-black transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-4 py-3 lg:py-6">
        {/* Header with logo and theme toggle */}
        <div className="flex items-center justify-between mb-2 md:mb-4 lg:mb-6 py-1 md:py-2">
          <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-6">
            <Logo size="small" className="hidden sm:block" />
            <Logo size="small" width={100} height={40} className="sm:hidden" />
          </div>
          <div className="flex items-center space-x-1 md:space-x-2 lg:space-x-4">
            {/* Mobile: Hide project selector on small screens */}
            <div className="hidden sm:block lg:block">
              <ProjectSelector />
            </div>
            <ProBadge />
            <UpgradeButton variant="compact" className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2" />
            
            {/* Development Controls - Hide on mobile */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700/50">
              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">DEV:</span>
              <button
                onClick={() => {
                  const hasApiKey = aiApiService.hasApiKey();
                  const currentKey = aiApiService.getApiKey();
                  
                  console.log('🔧 DEV: Debug info:');
                  console.log('🔧 DEV: Current isPro:', isPro);
                  console.log('🔧 DEV: Has API Key:', hasApiKey);
                  console.log('🔧 DEV: API Key (first 10 chars):', currentKey ? currentKey.substring(0, 10) + '...' : 'None');
                  
                  alert(`Pro Status: ${isPro}\nHas API Key: ${hasApiKey}\nAPI Key: ${currentKey ? 'Set (' + currentKey.substring(0, 10) + '...)' : 'Not Set'}`);
                }}
                className="text-xs px-2 py-1 bg-yellow-200 dark:bg-yellow-800/50 hover:bg-yellow-300 dark:hover:bg-yellow-700/50 text-yellow-800 dark:text-yellow-200 rounded transition-colors"
                title="Debug Pro and API Key Status"
              >
                🔍 Debug
              </button>
              <button
                onClick={() => {
                  const currentOverride = localStorage.getItem('DEV_PRO_OVERRIDE') === 'true';
                  const newOverride = !currentOverride;
                  localStorage.setItem('DEV_PRO_OVERRIDE', newOverride.toString());
                  console.log('🔧 DEV: Set DEV_PRO_OVERRIDE to:', newOverride);
                  
                  // Force refresh to pick up the change
                  refreshUser();
                  
                  // Also update local state for button display
                  setDevProOverride(newOverride);
                }}
                className="text-xs px-2 py-1 bg-green-200 dark:bg-green-800/50 hover:bg-green-300 dark:hover:bg-green-700/50 text-green-800 dark:text-green-200 rounded transition-colors"
                title="Set global dev Pro override flag"
              >
                {localStorage.getItem('DEV_PRO_OVERRIDE') === 'true' ? '✅ DEV PRO ON' : '🚫 DEV PRO OFF'}
              </button>
              <button
                onClick={() => {
                  const testKey = prompt('Enter OpenAI API Key for testing:');
                  if (testKey && testKey.trim()) {
                    aiApiService.setApiKey(testKey.trim());
                    console.log('🔧 DEV: Set API key:', testKey.substring(0, 10) + '...');
                    alert('API Key set! AI features should now be available.');
                  }
                }}
                className="text-xs px-2 py-1 bg-blue-200 dark:bg-blue-800/50 hover:bg-blue-300 dark:hover:bg-blue-700/50 text-blue-800 dark:text-blue-200 rounded transition-colors"
                title="Set OpenAI API Key for testing"
              >
                🔑 Set API Key
              </button>
              <button
                onClick={resetUser}
                className="text-xs px-2 py-1 bg-red-200 dark:bg-red-800/50 hover:bg-red-300 dark:hover:bg-red-700/50 text-red-800 dark:text-red-200 rounded transition-colors"
                title="Reset User Data"
              >
                🔄 Reset
              </button>
            </div>
            
            <ThemeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Left Panel - Form with Compact Scene Builder */}
          <div className="space-y-4 lg:space-y-6">
            {/* Ultra-Compact Scene Builder */}
            <SceneBuilderChecklist 
              compact={true}
              isAdvancedMode={isAdvancedMode}
              setIsAdvancedMode={setIsAdvancedMode}
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
            
            <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-lg dark:shadow-glow-soft p-4 lg:p-6 border border-transparent dark:border-cinema-border transition-all duration-300">
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
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {isAdvancedMode ? '🔧 Advanced Mode' : '📝 Simple Mode'}
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
              {/* Responsive button layout - stacks on mobile, rows on desktop */}
              <div className="flex flex-col md:flex-row md:justify-center space-y-2 md:space-y-0 md:space-x-2 flex-wrap md:gap-y-2">
                <LibrarySystem />
                <TemplateSelector />
                
                {/* Viral Video Generator Button */}
                <button
                  onClick={() => setShowViralGenerator(true)}
                  className="w-full md:w-auto px-2 md:px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-sm font-medium rounded-md transition-all duration-300 flex items-center justify-center md:justify-start space-x-2 h-10 shadow-lg hover:shadow-xl"
                >
                  <span className="text-base">🎬</span>
                  <span>Viral Generator</span>
                </button>
                
                {/* Enhanced Randomize Button with Dropdown */}
                <div className="relative w-full md:w-auto" ref={randomizeDropdownRef}>
                  <button
                    onClick={() => setShowRandomizeDropdown(!showRandomizeDropdown)}
                    className="w-full md:w-auto px-2 md:px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 dark:from-purple-600 dark:to-indigo-700 dark:hover:from-purple-700 dark:hover:to-indigo-800 text-white text-sm font-medium rounded-md transition-all duration-300 flex items-center justify-center md:justify-start space-x-2 h-10 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Randomize</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                    
                    {showRandomizeDropdown && (
                      <div className="absolute top-full mt-1 right-0 bg-white dark:bg-cinema-panel border border-gray-200 dark:border-cinema-border rounded-md shadow-lg dark:shadow-glow-soft z-10 min-w-[220px]">
                        <button
                          onClick={() => {
                            randomizeFields();
                            setShowRandomizeDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors duration-300 rounded-t-md"
                        >
                          🎲 Full Scene Builder
                        </button>
                        <button
                          onClick={() => {
                            randomizeLocationBased();
                            setShowRandomizeDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors duration-300"
                        >
                          📍 Location-Based
                        </button>
                        <button
                          onClick={() => {
                            randomizeCharacterFields();
                            setShowRandomizeDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors duration-300"
                        >
                          👤 Character Focus
                        </button>
                        <button
                          onClick={() => {
                            randomizeCinematicStyle();
                            setShowRandomizeDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors duration-300"
                        >
                          🎬 Cinematic Style
                        </button>
                        <button
                          onClick={() => {
                            randomizeEnvironmental();
                            setShowRandomizeDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors duration-300"
                        >
                          🌿 Environmental
                        </button>
                        <button
                          onClick={() => {
                            randomizeTechnicalSetup();
                            setShowRandomizeDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors duration-300"
                        >
                          📷 Technical Setup
                        </button>
                        <div className="border-t border-gray-200 dark:border-cinema-border my-1"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              
              <div className={`space-y-4 transition-all duration-300 ${isAdvancedMode ? 'block' : 'hidden'}`}>
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
          
          {/* Right Panel - JSON Preview & Management */}
          <FullScreenToggle isFullScreen={isFullScreen} onToggle={toggleFullScreen}>
            <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-lg dark:shadow-glow-soft p-4 lg:p-6 space-y-4 lg:space-y-6 border border-transparent dark:border-cinema-border transition-all duration-300">
            {/* JSON Output Section */}
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
              
              {/* Compact JSON Output Header */}
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
                    onClick={clearAll}
                    className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-xs flex items-center justify-center"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              {/* JSON Container - directly below controls */}
              <div className="bg-gray-900 dark:bg-cinema-black rounded-lg p-4 h-40 md:h-64 max-h-[50vh] overflow-auto border border-gray-700 dark:border-cinema-border relative">
                <pre className="text-green-400 dark:text-cinema-teal text-sm font-mono whitespace-pre-wrap">
                  {getJsonOutput() || '{}'}
                  <span className="animate-cursor-blink text-cinema-teal">▊</span>
                </pre>
              </div>
              
              {/* Universal Input Bar - ChatGPT Style */}
              <div className="mt-3">
                <UniversalInput />
              </div>
              
              {/* Pro Features Hub */}
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
              />
              
            </div>

            </div>
          </FullScreenToggle>
        </div>

        {/* Pricing Modal */}
        {showPricing && (
          <InstantUpgradeModal 
            isOpen={showPricing}
            onClose={() => setShowPricing(false)} 
            trigger="manual"
          />
        )}

        {/* Viral Video Generator Modal */}
        {showViralGenerator && (
          <ViralVideoGeneratorModal onClose={() => setShowViralGenerator(false)} />
        )}

        {/* Scene Pack Save Modal */}
        {showScenePackModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-cinema-panel rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Save Scene Pack</h3>
              <input
                type="text"
                placeholder="Enter pack name..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md mb-4"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    // Save logic here
                    setShowScenePackModal(false);
                  }
                }}
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowScenePackModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowScenePackModal(false)}
                  className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      
      {/* Footer */}
      <footer className="mt-8 pt-6 pb-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4">
          <a 
            href="/privacy-policy.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-purple-500 transition-colors text-xs sm:text-sm"
          >
            Privacy Policy
          </a>
          <a 
            href="/terms-of-service.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-purple-500 transition-colors text-xs sm:text-sm"
          >
            Terms of Service
          </a>
          <a 
            href="mailto:insightout11@gmail.com"
            className="hover:text-purple-500 transition-colors text-xs sm:text-sm"
          >
            Contact
          </a>
        </div>
        <p className="text-xs sm:text-sm">&copy; 2025 JSON Prompt Studio. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
