import React, { useState, useEffect, useRef } from 'react';

const TutorialOverlay = ({ onComplete, onSkip, onTutorialAction, isAdvancedMode, expandedCategories }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hasTriggeredAction, setHasTriggeredAction] = useState(false);
  const [tutorialState, setTutorialState] = useState({
    hasToggledMode: false,
    hasExpandedCategory: false
  });
  const overlayRef = useRef(null);

  // Tutorial steps configuration with interactive elements
  const tutorialSteps = [
    {
      id: 'welcome',
      title: '🎬 Welcome to JSON Prompt Studio!',
      content: 'Let\'s take a quick tour of the key features that will help you create amazing video prompts.',
      target: null,
      position: 'center'
    },
    {
      id: 'mode-toggle',
      title: '🔄 Simple vs Advanced Mode',
      content: () => {
        const currentMode = isAdvancedMode ? 'Advanced' : 'Simple';
        const nextMode = isAdvancedMode ? 'Simple' : 'Advanced';
        return (
          <div>
            <p className="mb-3">You're currently in <strong>{currentMode} Mode</strong>. {isAdvancedMode ? 'Advanced mode gives you detailed control over every aspect of your prompt.' : 'Simple mode provides the essential fields to get started quickly.'}</p>
            {!tutorialState.hasToggledMode && (
              <button
                onClick={() => {
                  onTutorialAction('toggleMode');
                  setTutorialState(prev => ({ ...prev, hasToggledMode: true }));
                }}
                className="px-3 py-1.5 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
              >
                Try switching to {nextMode} Mode
              </button>
            )}
            {tutorialState.hasToggledMode && (
              <div className="text-green-600 dark:text-green-400 text-sm font-medium">✓ Great! Notice how the interface adapts to different complexity levels.</div>
            )}
          </div>
        );
      },
      target: '[data-tutorial="mode-toggle"]',
      position: 'bottom'
    },
    {
      id: 'scene-builder',
      title: '🎭 Scene Builder',
      content: () => {
        const hasExpanded = expandedCategories && Object.values(expandedCategories).some(expanded => expanded);
        return (
          <div>
            <p className="mb-3">Start here! Use these categories to build your scene: Characters, Settings, Actions, Style, and Audio. Each category has Load, Template, and Create options.</p>
            {!hasExpanded && !tutorialState.hasExpandedCategory && (
              <button
                onClick={() => {
                  onTutorialAction('expandCategory', 'characters');
                  setTutorialState(prev => ({ ...prev, hasExpandedCategory: true }));
                }}
                className="px-3 py-1.5 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
              >
                Click to expand Characters category
              </button>
            )}
            {(hasExpanded || tutorialState.hasExpandedCategory) && (
              <div className="text-green-600 dark:text-green-400 text-sm font-medium">✓ Perfect! You can see the form fields and options available.</div>
            )}
          </div>
        );
      },
      target: '[data-tutorial="scene-builder"]',
      position: 'right'
    },
    {
      id: 'form-fields',
      title: '📝 Form Fields',
      content: 'Fill out these fields to customize your prompt. Many fields have autocomplete suggestions to help you get started quickly.',
      target: '[data-tutorial="form-fields"]',
      position: 'top'
    },
    {
      id: 'json-output',
      title: '📋 JSON Output',
      content: 'Your completed prompt appears here in JSON format. Use Copy to Clipboard, Save to library, or Clear to start fresh.',
      target: '[data-tutorial="json-output"]',
      position: 'left'
    },
    {
      id: 'pro-features',
      title: '✨ Pro Features',
      content: 'Upgrade to Pro for AI-powered optimization, advanced templates, and enhanced features to supercharge your video creation.',
      target: '[data-tutorial="pro-features"]',
      position: 'bottom'
    },
    {
      id: 'library-system',
      title: '📚 Library System',
      content: 'Save and organize your work! Access your saved characters, scenes, and templates anytime through the library.',
      target: '[data-tutorial="library-system"]',
      position: 'bottom'
    },
    {
      id: 'complete',
      title: '🎉 You\'re Ready!',
      content: 'That\'s it! You now know the basics of JSON Prompt Studio. Start creating amazing video prompts!',
      target: null,
      position: 'center'
    }
  ];

  const currentStepData = tutorialSteps[currentStep];

  // Get target element position for spotlight
  const getTargetPosition = (selector) => {
    if (!selector) return null;
    
    const element = document.querySelector(selector);
    if (!element) return null;
    
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom,
      right: rect.right
    };
  };

  // Calculate tooltip position with viewport boundary detection
  const getTooltipPosition = (targetPos, preferredPosition) => {
    if (!targetPos) {
      // Center position for welcome/complete steps
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const tooltipWidth = 350;
    const tooltipHeight = 200;
    const padding = 20;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // For large target elements (height > 300px), position relative to top instead of center
    const isLargeTarget = targetPos.height > 300;
    const targetCenterY = isLargeTarget ? targetPos.top + 50 : targetPos.top + (targetPos.height / 2);
    
    // Calculate positions for each direction
    const positions = {
      right: {
        top: targetCenterY - (tooltipHeight / 2),
        left: targetPos.right + padding,
      },
      left: {
        top: targetCenterY - (tooltipHeight / 2),
        left: targetPos.left - tooltipWidth - padding,
      },
      bottom: {
        top: targetPos.bottom + padding,
        left: targetPos.left + (targetPos.width / 2) - (tooltipWidth / 2),
      },
      top: {
        top: targetPos.top - tooltipHeight - padding,
        left: targetPos.left + (targetPos.width / 2) - (tooltipWidth / 2),
      }
    };
    
    // Check if position fits in viewport
    const fitsInViewport = (pos) => {
      return pos.top >= padding && 
             pos.top + tooltipHeight <= viewportHeight - padding &&
             pos.left >= padding && 
             pos.left + tooltipWidth <= viewportWidth - padding;
    };
    
    // Try preferred position first
    if (positions[preferredPosition] && fitsInViewport(positions[preferredPosition])) {
      return positions[preferredPosition];
    }
    
    // Fallback order based on preferred position
    const fallbackOrder = {
      right: ['top', 'bottom', 'left'],
      left: ['top', 'bottom', 'right'],
      top: ['bottom', 'right', 'left'],
      bottom: ['top', 'right', 'left']
    };
    
    // Try fallback positions
    for (const fallback of fallbackOrder[preferredPosition] || ['top', 'bottom', 'right', 'left']) {
      if (fitsInViewport(positions[fallback])) {
        return positions[fallback];
      }
    }
    
    // If nothing fits, force position within viewport bounds
    const forcedPosition = positions[preferredPosition] || positions.top;
    return {
      top: Math.max(padding, Math.min(forcedPosition.top, viewportHeight - tooltipHeight - padding)),
      left: Math.max(padding, Math.min(forcedPosition.left, viewportWidth - tooltipWidth - padding))
    };
  };

  // Auto-scroll to ensure tutorial is visible
  const scrollToTutorial = (targetPos, tooltipPos) => {
    if (!targetPos && !tooltipPos) return;
    
    const padding = 50;
    let scrollTarget = null;
    
    if (targetPos) {
      // Scroll to target element
      const targetTop = targetPos.top + window.pageYOffset;
      const targetBottom = targetPos.bottom + window.pageYOffset;
      const viewportTop = window.pageYOffset;
      const viewportBottom = viewportTop + window.innerHeight;
      
      if (targetTop < viewportTop + padding || targetBottom > viewportBottom - padding) {
        scrollTarget = targetTop - padding;
      }
    }
    
    if (tooltipPos && typeof tooltipPos.top === 'number') {
      // Also ensure tooltip is visible
      const tooltipTop = tooltipPos.top + window.pageYOffset;
      const tooltipBottom = tooltipTop + 200; // tooltip height
      const viewportTop = window.pageYOffset;
      const viewportBottom = viewportTop + window.innerHeight;
      
      if (tooltipTop < viewportTop + padding || tooltipBottom > viewportBottom - padding) {
        scrollTarget = Math.max(0, tooltipTop - padding);
      }
    }
    
    if (scrollTarget !== null) {
      window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
      });
    }
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Auto-scroll when step changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const targetPosition = getTargetPosition(currentStepData.target);
      const tooltipPosition = getTooltipPosition(targetPosition, currentStepData.position);
      scrollToTutorial(targetPosition, tooltipPosition);
    }, 100); // Small delay to ensure DOM has updated
    
    return () => clearTimeout(timer);
  }, [currentStep]);

  const skipTutorial = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setIsVisible(false);
    onSkip && onSkip();
  };

  const completeTutorial = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setIsVisible(false);
    onComplete && onComplete();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        skipTutorial();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  if (!isVisible) return null;

  const targetPosition = getTargetPosition(currentStepData.target);
  const tooltipPosition = getTooltipPosition(targetPosition, currentStepData.position);

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-[9999] pointer-events-auto"
      style={{ zIndex: 9999 }}
    >
      {/* Backdrop with spotlight cutout */}
      <div className="absolute inset-0 bg-black bg-opacity-75">
        {targetPosition && (
          <div
            className="absolute bg-transparent border-4 border-purple-400 rounded-lg shadow-lg"
            style={{
              top: targetPosition.top - 8,
              left: targetPosition.left - 8,
              width: targetPosition.width + 16,
              height: targetPosition.height + 16,
              boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 20px rgba(139, 92, 246, 0.5)`,
              zIndex: 10000
            }}
          />
        )}
      </div>

      {/* Tutorial tooltip */}
      <div
        className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-6 max-w-sm z-[10001]"
        style={tooltipPosition}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentStepData.title}
          </h3>
          <button
            onClick={skipTutorial}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Close tutorial"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          {typeof currentStepData.content === 'function' ? currentStepData.content() : (
            <p>{currentStepData.content}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Step indicator */}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentStep + 1} of {tutorialSteps.length}
          </span>

          {/* Navigation buttons */}
          <div className="flex space-x-2">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
              >
                Previous
              </button>
            )}
            
            {currentStep === 0 && (
              <button
                onClick={skipTutorial}
                className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
              >
                Skip Tutorial
              </button>
            )}

            <button
              onClick={nextStep}
              className="px-4 py-1.5 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors font-medium"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;