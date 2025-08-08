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
    savedItems,
    savedScenePacks
  } = usePromptStore();

  const { isPro, subscription, checkSubscription } = useSubscription();
  const { isFullScreen, toggleFullScreen } = useFullScreen();
  const { toasts, showSuccess, showError, showWarning, showInfo, removeToast } = useToast();
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [showInstantUpgradeModal, setShowInstantUpgradeModal] = useState(false);
  const [showProFeaturesModal, setShowProFeaturesModal] = useState(false);
  const [showViralGenerator, setShowViralGenerator] = useState(false);
  const [showRandomizeDropdown, setShowRandomizeDropdown] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [selectedRandomizeOptions, setSelectedRandomizeOptions] = useState([]);
  const [appliedOptionIndex, setAppliedOptionIndex] = useState(null);
  const [sceneExtenderSuccess, setSceneExtenderSuccess] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Refs
  const randomizeDropdownRef = useRef(null);

  // Effects
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (randomizeDropdownRef.current && !randomizeDropdownRef.current.contains(event.target)) {
        setShowRandomizeDropdown(false);
      }
    };

    if (showRandomizeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showRandomizeDropdown]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (sceneExtenderSuccess) {
      const timer = setTimeout(() => {
        setSceneExtenderSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sceneExtenderSuccess]);

  useEffect(() => {
    analytics.pageView();
    if (import.meta.env.DEV) {
      console.log('App: Component mounted, analytics tracked');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showRandomizeDropdown && !event.target.closest('[data-randomize-container]')) {
        setShowRandomizeDropdown(false);
      }
    };

    if (showRandomizeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showRandomizeDropdown]);

  // Handlers
  const handleRandomize = (category = 'all') => {
    if (category === 'character') {
      randomizeCharacterFields();
    } else if (category === 'scene') {
      randomizeSceneFields();
    } else if (category === 'location-based') {
      randomizeLocationBased();
    } else if (category === 'cinematic-style') {
      randomizeCinematicStyle();
    } else if (category === 'environmental') {
      randomizeEnvironmental();
    } else if (category === 'technical-setup') {
      randomizeTechnicalSetup();
    } else {
      randomizeFields();
    }
    
    setShowRandomizeDropdown(false);
    analytics.track('randomize_used', { category });
  };

  const handleModeChange = (newMode) => {
    setIsAdvancedMode(newMode);
    analytics.track('mode_changed', { mode: newMode ? 'advanced' : 'simple' });
  };

  const handleTemplateSelect = (template) => {
    analytics.track('template_selected', { template: template.name });
  };

  const randomizeOptions = [
    { label: '🎭 Characters', action: () => handleRandomize('character') },
    { label: '🎬 Scene Elements', action: () => handleRandomize('scene') },
    { label: '🌍 Location-Based', action: () => handleRandomize('location-based') },
    { label: '🎨 Cinematic Style', action: () => handleRandomize('cinematic-style') },
    { label: '🌿 Environmental', action: () => handleRandomize('environmental') },
    { label: '📹 Technical Setup', action: () => handleRandomize('technical-setup') },
    { label: '🎲 Full Scene', action: () => handleRandomize('all') }
  ];

  // Show loading screen first
  if (isLoading) {
    if (import.meta.env.DEV) console.log('App: Showing loading screen');
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  if (import.meta.env.DEV) {
    console.log('App: Loading complete, rendering main app');
    console.log('App: isPro =', isPro);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinema-black transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-4 py-3 lg:py-6">
        
        {/* Ideal Header Layout - 3 Sections: Project/Library | Creative Tools | Mode Controls */}
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
                <TemplateSelector onTemplateSelect={handleTemplateSelect} />
                
                <button
                  onClick={() => setShowViralGenerator(true)}
                  className="group relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-pink-500 to-violet-600 text-white hover:from-pink-600 hover:to-violet-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                >
                  <span className="mr-1">📹</span>
                  <span className="hidden sm:inline">Viral</span>
                </button>

                <div className="relative" ref={randomizeDropdownRef} data-randomize-container>
                  <button
                    onClick={() => setShowRandomizeDropdown(!showRandomizeDropdown)}
                    className="group relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                  >
                    <span className="mr-1">🎲</span>
                    <span className="hidden sm:inline">Randomize</span>
                  </button>

                  {showRandomizeDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-cinema-panel border border-gray-200 dark:border-cinema-border rounded-lg shadow-lg z-50 py-1">
                      {randomizeOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={option.action}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors duration-300"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SECTION - Mode & UI Controls */}
            <div className="col-span-4 flex items-center justify-end space-x-3">
              <ModeToggle 
                isAdvancedMode={isAdvancedMode}
                onModeChange={handleModeChange}
              />
              <div className="h-5 w-px header-section-divider"></div>
              <CinematicModeToggle />
            </div>
          </div>

          {/* Mobile Header - Stacked Layout */}
          <div className="md:hidden p-4 space-y-4">
            {/* Top Row - Logo and Mode Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Logo size="small" />
                <ProjectSelector />
              </div>
              <div className="flex items-center space-x-2">
                <CinematicModeToggle />
              </div>
            </div>

            {/* Bottom Row - Creative Tools */}
            <div className="flex items-center justify-center space-x-2 flex-wrap">
              <LibrarySystem showToast={{ showSuccess, showError, showWarning, showInfo }} headerMode={true} />
              <TemplateSelector onTemplateSelect={handleTemplateSelect} />
              <button
                onClick={() => setShowViralGenerator(true)}
                className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-pink-500 to-violet-600 text-white"
              >
                📹 Viral
              </button>
              <div className="relative" data-randomize-container>
                <button
                  onClick={() => setShowRandomizeDropdown(!showRandomizeDropdown)}
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-600 text-white"
                >
                  🎲 Randomize
                </button>
                {showRandomizeDropdown && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-cinema-panel border border-gray-200 dark:border-cinema-border rounded-lg shadow-lg z-50 py-1">
                    {randomizeOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={option.action}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border transition-colors duration-300"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mode Toggle for Mobile */}
            <div className="flex justify-center">
              <ModeToggle 
                isAdvancedMode={isAdvancedMode}
                onModeChange={handleModeChange}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          
          {/* Left Panel - Scene Builder and Configuration */}
          <div className="space-y-4 lg:space-y-6 min-h-[400px] relative">
            {isAdvancedMode ? (
              <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-lg dark:shadow-glow-soft p-4 lg:p-6 space-y-4 lg:space-y-6 border border-transparent dark:border-cinema-border transition-all duration-300">
                <SceneBuilderChecklist 
                  expandedCategories={expandedCategories}
                  toggleCategory={toggleCategory}
                  getJsonOutput={getJsonOutput}
                  showToast={{ showSuccess, showError, showWarning, showInfo }}
                />
                
                <div className="space-y-4">
                  {Object.keys(schema).map((categoryKey) => (
                    <FieldRenderer
                      key={categoryKey}
                      category={categoryKey}
                      categoryData={schema[categoryKey]}
                      isExpanded={expandedCategories[categoryKey]}
                      onToggle={() => toggleCategory(categoryKey)}
                      onFieldChange={(field, value) => setFieldValue(categoryKey, field, value)}
                      isPro={isPro}
                      onUpgrade={() => setShowInstantUpgradeModal(true)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <UniversalInput 
                isPro={isPro}
                onUpgrade={() => setShowInstantUpgradeModal(true)}
                showToast={{ showSuccess, showError, showWarning, showInfo }}
                onSceneExtenderSuccess={() => setSceneExtenderSuccess(true)}
              />
            )}
          </div>

          {/* Right Panel - JSON Preview & Management */}
          <FullScreenToggle isFullScreen={isFullScreen} onToggle={toggleFullScreen}>
            <div data-tutorial="json-output" className="bg-white dark:bg-cinema-panel rounded-lg shadow-lg dark:shadow-glow-soft p-4 lg:p-6 space-y-4 lg:space-y-6 border border-transparent dark:border-cinema-border transition-all duration-300">
              
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

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-cinema-text">
                    JSON Output
                  </h2>
                  <ProBadge isPro={isPro} />
                </div>

                <div className="flex flex-wrap items-center space-x-2 space-y-1 sm:space-y-0">
                  <ImportSystem />
                  
                  {!isPro && (
                    <UpgradeButton
                      variant="compact"
                      onClick={() => setShowInstantUpgradeModal(true)}
                      className="text-xs"
                    >
                      ⚡ Upgrade
                    </UpgradeButton>
                  )}

                  <button
                    onClick={() => setShowTutorial(true)}
                    className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                  >
                    📚 Tutorial
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <textarea
                  value={getJsonOutput()}
                  readOnly
                  className="w-full h-64 lg:h-80 p-3 border border-gray-200 dark:border-cinema-border rounded-lg bg-gray-50 dark:bg-cinema-black text-sm font-mono text-gray-700 dark:text-cinema-text resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                  placeholder="Your JSON prompt will appear here..."
                />

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getJsonOutput());
                      showSuccess('JSON copied to clipboard!');
                      analytics.track('json_copied');
                    }}
                    className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors text-sm font-medium"
                  >
                    📋 Copy JSON
                  </button>

                  <button
                    onClick={clearAll}
                    className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors text-sm font-medium"
                  >
                    🗑️ Clear All
                  </button>
                </div>
              </div>
            </div>
          </FullScreenToggle>
        </div>

        {/* Footer */}
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

        {/* Toast Container */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>

      {/* Modals */}
      {showInstantUpgradeModal && (
        <InstantUpgradeModal onClose={() => setShowInstantUpgradeModal(false)} />
      )}

      {showProFeaturesModal && (
        <ProFeaturesHub onClose={() => setShowProFeaturesModal(false)} />
      )}

      {showViralGenerator && (
        <ViralVideoGeneratorModal 
          onClose={() => setShowViralGenerator(false)}
          showToast={{ showSuccess, showError, showWarning, showInfo }}
        />
      )}

      {showTutorial && (
        <TutorialOverlay onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
};

export default App;