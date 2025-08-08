import React, { useState, useEffect, useRef } from 'react';
import usePromptStore from './store';

const TutorialOverlay = ({ onComplete, onSkip, onTutorialAction, isAdvancedMode, expandedCategories }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [tutorialState, setTutorialState] = useState({
    hasTriedExample: false,
    hasOpenedTemplates: false,
    hasExpandedSceneBuilder: false,
    hasToggledAdvanced: false,
    hasOpenedAiTools: false,
    hasOpenedProjects: false
  });
  const overlayRef = useRef(null);
  const { setFieldValue } = usePromptStore();

  // Tutorial steps configuration with new user journey flow
  const tutorialSteps = [
    {
      id: 'welcome',
      title: '🎬 Welcome to JSON Prompt Studio',
      content: () => (
        <div>
          <p className="mb-4 text-base leading-relaxed">Transform ideas into AI-generated scenes in seconds.</p>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">🚀 We'll show you the 3 fastest ways to create:</p>
            <ul className="text-sm text-purple-700 dark:text-purple-200 space-y-1">
              <li>• Start with plain English (30 seconds)</li>
              <li>• Use viral templates (instant)</li>  
              <li>• Build custom scenes (unlimited control)</li>
            </ul>
          </div>
        </div>
      ),
      target: null,
      position: 'center',
      buttons: [
        { text: 'Let\'s Go →', action: 'next', style: 'primary' },
        { text: 'Skip Tour', action: 'skip', style: 'secondary' }
      ]
    },
    {
      id: 'text-input',
      title: '✨ Fastest Start — Text to JSON',
      content: () => (
        <div>
          <p className="mb-3">Describe your scene in plain English. Watch AI create structured prompts instantly.</p>
          <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-3 mb-3">
            <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">💡 Try this example:</p>
            <p className="text-sm text-green-700 dark:text-green-200 italic">"A dragon sleeping on a crystal mountain under the stars"</p>
          </div>
          {!tutorialState.hasTriedExample && (
            <button
              onClick={() => {
                // Complete 3-step demonstration: Fill text -> Convert -> Enhance
                const textInput = document.querySelector('textarea[placeholder*="Describe your scene"]') ||
                                document.querySelector('[data-tutorial="text-input"] textarea');
                
                if (textInput) {
                  // Step 1: Fill the text input
                  textInput.focus();
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                  nativeInputValueSetter.call(textInput, 'A dragon sleeping on a crystal mountain under the stars');
                  
                  const events = ['input', 'change', 'keyup'];
                  events.forEach(eventType => {
                    const event = new Event(eventType, { bubbles: true });
                    textInput.dispatchEvent(event);
                  });
                  
                  setTimeout(() => {
                    textInput.blur();
                    textInput.focus();
                    
                    // Step 2: Click Convert button after 1.5 seconds
                    setTimeout(() => {
                      // Find Convert button using proper DOM API (not invalid :contains selector)
                      const convertButton = document.querySelector('[data-tutorial="convert-button"]') ||
                                          Array.from(document.querySelectorAll('button')).find(btn => 
                                            btn.textContent.includes('Convert') && !btn.disabled
                                          );
                      
                      if (convertButton && !convertButton.disabled) {
                        convertButton.click();
                        
                        // Populate actual JSON fields to show real output
                        setTimeout(() => {
                          const exampleData = {
                            scene: 'A dragon sleeping on a crystal mountain under the stars',
                            character_type: 'dragon',
                            setting: 'crystal mountain',
                            actions: 'sleeping peacefully',
                            lighting_type: 'starlight',
                            atmosphere: 'mystical and serene',
                            time_of_day: 'night',
                            camera_angle: 'wide shot',
                            style: 'fantasy illustration',
                            color_palette: 'deep blues and crystal whites'
                          };
                          
                          // Populate fields one by one with a slight delay for visual effect
                          Object.entries(exampleData).forEach(([fieldKey, fieldValue], index) => {
                            setTimeout(() => {
                              setFieldValue(fieldKey, fieldValue);
                            }, index * 150); // Stagger field population
                          });
                        }, 500);
                        
                        // Show "Watch the JSON populate!" indicator after Convert
                        setTimeout(() => {
                          const jsonSection = document.querySelector('[data-tutorial="json-output"]') || 
                                            document.querySelector('.bg-gray-50.dark\\:bg-gray-800') ||
                                            document.querySelector('[class*="json"]');
                          if (jsonSection) {
                            // Create temporary indicator
                            const indicator = document.createElement('div');
                            indicator.className = 'fixed z-[10002] bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg animate-bounce';
                            indicator.textContent = '👀 Watch the JSON populate!';
                            indicator.style.top = '20px';
                            indicator.style.right = '20px';
                            document.body.appendChild(indicator);
                            
                            // Highlight JSON section
                            jsonSection.style.transition = 'all 0.5s ease';
                            jsonSection.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.5)';
                            jsonSection.style.transform = 'scale(1.02)';
                            
                            // Remove highlight after 2 seconds
                            setTimeout(() => {
                              jsonSection.style.boxShadow = '';
                              jsonSection.style.transform = '';
                              document.body.removeChild(indicator);
                            }, 2000);
                          }
                        }, 1000);
                        
                      }
                    }, 1500);
                  }, 10);
                }
                setTutorialState(prev => ({ ...prev, hasTriedExample: true }));
              }}
              className="w-full px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg transition-all duration-200 font-medium"
            >
              ✨ Try Example
            </button>
          )}
          {tutorialState.hasTriedExample && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
              <div className="text-green-600 dark:text-green-400 text-sm font-medium mb-2">
                ✓ Perfect! Watch the text-to-JSON conversion:
              </div>
              <div className="text-xs text-blue-800 dark:text-blue-200 space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>Text filled in input area</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>Convert button clicked → <strong>JSON fields populate with structured data</strong> 👀</span>
                  </div>
                </div>
                <p className="pt-1 border-t border-blue-200 dark:border-blue-700">✨ <strong>Perfect!</strong> The next step will show you the JSON output and demonstrate the enhancement workflow!</p>
              </div>
            </div>
          )}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2 mt-2 border border-amber-200 dark:border-amber-700">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              🎯 <strong>KEY FEATURE:</strong> The Convert button intelligently transforms into Enhance after first use, enabling progressive enhancement workflow!
            </p>
          </div>
        </div>
      ),
      target: '[data-tutorial="text-input"]',
      position: 'left',
      disableScroll: true
    },
    {
      id: 'json-output',
      title: '📊 Watch Your JSON Populate!',
      content: () => (
        <div>
          <p className="mb-3">Perfect! Now look at how the JSON fields populated with structured data from your description.</p>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 mb-3">
            <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">✅ What just happened:</p>
            <ul className="text-sm text-green-700 dark:text-green-200 space-y-1">
              <li>• AI analyzed your scene description</li>
              <li>• Extracted key elements (character, setting, mood, etc.)</li>
              <li>• Populated structured JSON fields automatically</li>
              <li>• Created a foundation you can now enhance</li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 mb-3">
            <p className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">🎨 Try Enhancement:</p>
            <p className="text-sm text-purple-700 dark:text-purple-200">
              The Convert button transformed into <strong>Enhance</strong> - click it to add richer, more detailed descriptions to existing fields!
            </p>
          </div>
          <button
            onClick={() => {
              // Find and click the Enhance button
              const enhanceButton = document.querySelector('[data-tutorial="convert-button"]') ||
                                  Array.from(document.querySelectorAll('button')).find(btn => 
                                    btn.textContent.includes('Enhance') && !btn.disabled
                                  );
              
              if (enhanceButton && !enhanceButton.disabled) {
                enhanceButton.click();
                
                // Populate enhanced JSON fields after a delay
                setTimeout(() => {
                  const enhancedData = {
                    scene: 'A majestic ancient dragon with shimmering scales sleeping peacefully on a towering crystal mountain peak under a blanket of countless stars',
                    character_type: 'ancient crystal dragon',
                    setting: 'mystical crystal mountain peak with glowing formations',
                    actions: 'sleeping peacefully with gentle breathing, scales glinting softly',
                    lighting_type: 'ethereal starlight with crystal reflections',
                    atmosphere: 'deeply mystical and profoundly serene, otherworldly tranquility',
                    time_of_day: 'deep night with celestial brilliance',
                    camera_angle: 'cinematic wide establishing shot from below',
                    style: 'high fantasy digital art with luminous details',
                    color_palette: 'rich midnight blues, silver starlight, and iridescent crystal whites',
                    emotions: 'peaceful contentment and ancient wisdom',
                    environment: 'crisp mountain air with magical energy'
                  };
                  
                  // Populate enhanced fields with staggered timing
                  Object.entries(enhancedData).forEach(([fieldKey, fieldValue], index) => {
                    setTimeout(() => {
                      setFieldValue(fieldKey, fieldValue);
                    }, index * 100);
                  });
                  
                  // Show enhancement indicator
                  setTimeout(() => {
                    const jsonSection = document.querySelector('[data-tutorial="json-output"]');
                    if (jsonSection) {
                      const indicator = document.createElement('div');
                      indicator.className = 'fixed z-[10002] bg-purple-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg animate-pulse';
                      indicator.textContent = '✨ Fields enhanced with richer details!';
                      indicator.style.top = '20px';
                      indicator.style.right = '20px';
                      document.body.appendChild(indicator);
                      
                      setTimeout(() => {
                        document.body.removeChild(indicator);
                      }, 3000);
                    }
                  }, 800);
                }, 500);
              }
            }}
            className="w-full px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 font-medium"
          >
            🎨 Try Enhance Now
          </button>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mt-3 border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Progressive Enhancement:</strong> This is the core workflow - start simple, then enhance with more detail as needed!
            </p>
          </div>
        </div>
      ),
      target: '[data-tutorial="json-output"]',
      position: 'right',
      disableScroll: false
    },
    {
      id: 'quick-tools',
      title: '🧠 Quick Inspiration Tools',
      content: () => (
        <div>
          <p className="mb-3">Need instant inspiration? These tools jumpstart your creativity:</p>
          <div className="space-y-2 mb-3">
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">📋</span>
              <span><strong>Templates & Presets</strong> — Genre-based starting points (horror, romance, etc.)</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">🔥</span>
              <span><strong>Viral</strong> — Trending formats optimized for social media</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">🎲</span>
              <span><strong>Randomize</strong> — AI surprises (perfect for breaking creative blocks)</span>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              💡 <strong>Pro Tip:</strong> Click any of these buttons in the header to access these powerful creativity tools when you're ready to use them.
            </p>
          </div>
        </div>
      ),
      target: '[data-tutorial="quick-tools"]',
      position: 'bottom'
    },
    {
      id: 'scene-builder',
      title: '🛠️ Scene Builder — The Power Tool',
      content: () => {
        const hasExpanded = expandedCategories && Object.values(expandedCategories).some(expanded => expanded);
        return (
          <div>
            <p className="mb-3">Want precision control? Build scenes element by element.</p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 mb-3">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">🎭 Each category has smart AI helpers:</p>
              <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                <li>• Load saved elements • Apply templates • AI enhancement</li>
                <li>• Characters → Actions → Style → Audio</li>
              </ul>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3 border border-teal-200 dark:border-teal-700">
              <p className="text-sm text-teal-800 dark:text-teal-200 mb-2">
                <strong>🎯 Key Features:</strong>
              </p>
              <ul className="text-xs text-teal-700 dark:text-teal-300 space-y-1">
                <li>• <strong>Load buttons turn teal</strong> when you have saved content to load</li>
                <li>• <strong>Enhance buttons</strong> use AI to improve existing content</li>
                <li>• <strong>Template buttons</strong> provide quick starting points</li>
                <li>• Each category builds on the others for complete scenes</li>
              </ul>
            </div>
          </div>
        );
      },
      target: '[data-tutorial="scene-builder"]',
      position: 'right',
      disableScroll: true
    },
    {
      id: 'advanced-mode',
      title: isAdvancedMode ? '🔬 Advanced Mode in Action!' : '🔬 Advanced Mode',
      content: () => {
        const currentMode = isAdvancedMode ? 'Advanced' : 'Simple';
        const nextMode = isAdvancedMode ? 'Simple' : 'Advanced';
        return (
          <div>
            {isAdvancedMode ? (
              // User is in Advanced Mode - demonstrate it
              <div>
                <p className="mb-3">🎉 Excellent! You're now in Advanced Mode. Notice how the interface has changed:</p>
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium text-teal-800 dark:text-teal-300 mb-2">🔍 Look at what's now available:</p>
                  <ul className="text-sm text-teal-700 dark:text-teal-200 space-y-1">
                    <li>• <strong>Detailed category sections</strong> you can expand/collapse</li>
                    <li>• <strong>Direct field editing</strong> for precise control</li>  
                    <li>• <strong>Full JSON structure</strong> access</li>
                    <li>• <strong>Professional-grade controls</strong> for advanced users</li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 <strong>Try this:</strong> Click on any category (Characters, Settings, etc.) to see the expanded field controls that weren't visible in Simple Mode!
                  </p>
                </div>
              </div>
            ) : (
              // User is still in Simple Mode - explain Advanced Mode
              <div>
                <p className="mb-3">Advanced Mode unlocks the full JSON structure.</p>
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium text-teal-800 dark:text-teal-300 mb-2">📊 Perfect for:</p>
                  <ul className="text-sm text-teal-700 dark:text-teal-200 space-y-1">
                    <li>• Fine-tuning AI output</li>
                    <li>• Custom field control</li>  
                    <li>• Professional workflows</li>
                    <li>• API integrations</li>
                  </ul>
                </div>
                <p className="mb-3 text-sm">You're currently in <strong>{currentMode} Mode</strong>.</p>
              </div>
            )}
            {!tutorialState.hasToggledAdvanced && (
              <button
                onClick={() => {
                  // Actually click the Advanced Mode toggle button
                  const advancedToggle = document.querySelector('[data-tutorial="advanced-mode-toggle"]') ||
                                        document.querySelector('button[title*="Switch between simple and advanced"]') ||
                                        document.querySelector('button:contains("Advanced Mode")') ||
                                        document.querySelector('button:contains("Simple Mode")');
                  
                  if (advancedToggle) {
                    advancedToggle.click();
                    setTutorialState(prev => ({ ...prev, hasToggledAdvanced: true }));
                  } else {
                    // Fallback to onTutorialAction if direct click doesn't work
                    if (onTutorialAction) {
                      onTutorialAction('toggleMode');
                    }
                    setTutorialState(prev => ({ ...prev, hasToggledAdvanced: true }));
                  }
                }}
                className="w-full px-4 py-2 text-sm bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 font-medium"
              >
                🔬 Try {nextMode} Mode →
              </button>
            )}
            {tutorialState.hasToggledAdvanced && (
              <div className="text-teal-600 dark:text-teal-400 text-sm font-medium bg-teal-50 dark:bg-teal-900/20 rounded-lg p-2">
                ✓ Great! Notice how the interface adapts to different complexity levels.
              </div>
            )}
          </div>
        );
      },
      target: '[data-tutorial="advanced-mode-toggle"]',
      position: 'bottom',
      disableScroll: true
    },
    {
      id: 'ai-tools',
      title: '🤖 AI Tools Hub',
      content: () => (
        <div>
          <p className="mb-3">Supercharge your creativity with compact AI tools located right below the text input:</p>
          <div className="space-y-2 mb-3">
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">🎭</span>
              <span><strong>Character Engine</strong> — Generate detailed personas</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">🌍</span>
              <span><strong>World Builder</strong> — Create immersive environments</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">🎬</span>
              <span><strong>Storyboard Generator</strong> — Break scenes into sequences</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">✨</span>
              <span><strong>Scene Extender</strong> — Generate multiple scene variations</span>
            </div>
          </div>
          <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3 border border-pink-200 dark:border-pink-700">
            <p className="text-sm text-pink-800 dark:text-pink-200">
              💡 <strong>Location:</strong> These AI tools appear as compact buttons right below the Convert/Enhance button in the text input area.
            </p>
          </div>
        </div>
      ),
      target: '[data-tutorial="ai-tools"]',
      position: 'left',
      disableScroll: true
    },
    {
      id: 'project-system',
      title: '💾 Projects & Organization',
      content: () => (
        <div>
          <p className="mb-3">Organize everything with Projects. Never lose your work.</p>
          <div className="space-y-2 mb-3">
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">📁</span>
              <span><strong>Projects</strong> keep related scenes together</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">💿</span>
              <span><strong>Save/Load</strong> individual elements or full scenes</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">🔄</span>
              <span><strong>Undo/Redo</strong> for safe experimentation</span>
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              💡 <strong>Look for:</strong> The project dropdown and management buttons are located in the top-left area of the header, along with the logo.
            </p>
          </div>
        </div>
      ),
      target: '[data-tutorial="project-system"]',
      position: 'top'
    },
    {
      id: 'advanced-features',
      title: '⚙️ Advanced Features',
      content: () => (
        <div>
          <p className="mb-3">Professional tools for advanced users:</p>
          <div className="space-y-2 mb-3">
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">📋</span>
              <span><strong>Live JSON preview</strong> with copy/export</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">📐</span>
              <span><strong>Aspect ratio controls</strong> (16:9, 9:16, etc.)</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">🔧</span>
              <span><strong>Direct JSON editing</strong> in Advanced Mode</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-lg p-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              💡 <strong>Pro Tip:</strong> Use the aspect ratio dropdown to optimize your prompts for different platforms and formats.
            </p>
          </div>
        </div>
      ),
      target: '[data-tutorial="advanced-controls"]',
      position: 'bottom'
    },
    {
      id: 'completion',
      title: '🚀 Ready to Create!',
      content: () => (
        <div>
          <p className="mb-4 text-base leading-relaxed">You're ready to create amazing AI prompts!</p>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 mb-3">
            <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">🎯 Quick reminder:</p>
            <ul className="text-sm text-green-700 dark:text-green-200 space-y-1">
              <li>• Start simple with Text → JSON</li>
              <li>• Use Templates & Quick Tools for instant results</li>  
              <li>• Build detailed prompts with Scene Builder</li>
              <li>• Use AI Tools for creative enhancement</li>
              <li>• Organize everything with Projects</li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3 border border-blue-200 dark:border-blue-700">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">🔬 Advanced Mode Tips:</p>
            <ul className="text-xs text-blue-700 dark:text-blue-200 space-y-1">
              <li>• Switch to Advanced Mode for full JSON control</li>
              <li>• Edit JSON directly in Advanced Mode</li>
              <li>• Use aspect ratio controls for different platforms</li>
              <li>• Copy/export your finished prompts</li>
            </ul>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            💡 You can replay this tutorial anytime by pressing Ctrl+? or from the Help menu.
          </p>
        </div>
      ),
      target: null,
      position: 'center',
      buttons: [
        { text: '🎬 Start Creating', action: 'complete', style: 'primary' },
        { text: '🔄 Replay Tutorial', action: 'replay', style: 'secondary' }
      ]
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
  const getTooltipPosition = (targetPos, preferredPosition, stepData = null) => {
    if (!targetPos) {
      // Center position for welcome/complete steps
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const tooltipWidth = 400; // Slightly wider for new content
    const tooltipHeight = 280; // Taller for more detailed content
    const padding = 20;
    const targetPadding = 60; // Increased padding from target to avoid covering it
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // For large target elements (height > 300px), position relative to top instead of center
    // Also adjust for text-input and ai-tools to position higher
    const isLargeTarget = targetPos.height > 300;
    const isTextInput = stepData && stepData.id === 'text-input';
    const isAiTools = stepData && stepData.id === 'ai-tools';
    const targetCenterY = isLargeTarget ? targetPos.top + 50 : 
                         isTextInput ? targetPos.top - 50 : // Position much higher for text input
                         isAiTools ? targetPos.top - 80 : // Position much higher for AI tools to avoid cutoff
                         targetPos.top + (targetPos.height / 2);
    
    // Calculate positions for each direction with extra padding to avoid covering target
    const positions = {
      right: {
        top: targetCenterY - (tooltipHeight / 2),
        left: targetPos.right + targetPadding,
      },
      left: {
        top: targetCenterY - (tooltipHeight / 2),
        left: targetPos.left - tooltipWidth - targetPadding,
      },
      bottom: {
        top: targetPos.bottom + targetPadding,
        left: targetPos.left + (targetPos.width / 2) - (tooltipWidth / 2),
      },
      top: {
        top: targetPos.top - tooltipHeight - targetPadding,
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

  // Auto-scroll to ensure tutorial is visible with improved calculations
  const scrollToTutorial = (targetPos, tooltipPos) => {
    if (!targetPos && !tooltipPos) return;
    
    const padding = 80; // Increased padding for better visibility
    const viewportHeight = window.innerHeight;
    let scrollTarget = null;
    
    if (targetPos) {
      // Scroll to target element with better center calculation
      const targetTop = targetPos.top + window.pageYOffset;
      const targetBottom = targetPos.bottom + window.pageYOffset;
      const targetCenter = targetTop + (targetPos.height / 2);
      const viewportTop = window.pageYOffset;
      const viewportBottom = viewportTop + viewportHeight;
      const viewportCenter = viewportTop + (viewportHeight / 2);
      
      // Only scroll if target is not reasonably visible
      if (targetTop < viewportTop + padding || targetBottom > viewportBottom - padding) {
        // Try to center the target in the viewport
        scrollTarget = Math.max(0, targetCenter - (viewportHeight / 2));
      }
    }
    
    if (tooltipPos && typeof tooltipPos.top === 'number') {
      // Ensure tooltip is visible but don't override target positioning
      const tooltipTop = tooltipPos.top + window.pageYOffset;
      const tooltipBottom = tooltipTop + 280; // tooltip height
      const viewportTop = window.pageYOffset;
      const viewportBottom = viewportTop + viewportHeight;
      
      // Only adjust for tooltip if target positioning didn't already set a scroll target
      if (scrollTarget === null && (tooltipTop < viewportTop + padding || tooltipBottom > viewportBottom - padding)) {
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

  // Handle button actions
  const handleAction = (action, data = null) => {
    switch (action) {
      case 'next':
        nextStep();
        break;
      case 'skip':
        skipTutorial();
        break;
      case 'skip-to':
        if (data && typeof data === 'number') {
          setCurrentStep(data);
        }
        break;
      case 'complete':
        completeTutorial();
        break;
      case 'replay':
        setCurrentStep(0);
        setTutorialState({
          hasTriedExample: false,
          hasOpenedTemplates: false,
          hasExpandedSceneBuilder: false,
          hasToggledAdvanced: false,
          hasOpenedAiTools: false,
          hasOpenedProjects: false
        });
        break;
      case 'expand-category':
        if (data && onTutorialAction) {
          onTutorialAction('expandCategory', data);
        }
        break;
      case 'scroll-to-json':
        const jsonSection = document.querySelector('[data-tutorial="json-output"]');
        if (jsonSection) {
          jsonSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        break;
      default:
        break;
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

  // Auto-scroll when step changes with better timing
  useEffect(() => {
    const timer = setTimeout(() => {
      // Skip scrolling if the current step has disableScroll flag
      if (currentStepData.disableScroll) {
        return;
      }
      
      const targetPosition = getTargetPosition(currentStepData.target);
      const tooltipPosition = getTooltipPosition(targetPosition, currentStepData.position, currentStepData);
      scrollToTutorial(targetPosition, tooltipPosition);
    }, 300); // Increased delay to ensure proper DOM updates and positioning
    
    return () => clearTimeout(timer);
  }, [currentStep, currentStepData.disableScroll]);

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
  const tooltipPosition = getTooltipPosition(targetPosition, currentStepData.position, currentStepData);
  
  // Determine arrow direction based on tooltip position relative to target
  const getArrowClass = () => {
    if (!targetPosition || !tooltipPosition || typeof tooltipPosition.top === 'string') return '';
    
    const tooltipCenterX = (typeof tooltipPosition.left === 'string' ? 200 : tooltipPosition.left) + 200;
    const tooltipCenterY = (typeof tooltipPosition.top === 'string' ? 200 : tooltipPosition.top) + 140;
    const targetCenterX = targetPosition.left + (targetPosition.width / 2);
    const targetCenterY = targetPosition.top + (targetPosition.height / 2);
    
    if (tooltipCenterX > targetCenterX + 100) return 'arrow-left';
    if (tooltipCenterX < targetCenterX - 100) return 'arrow-right';
    if (tooltipCenterY > targetCenterY + 50) return 'arrow-top';
    if (tooltipCenterY < targetCenterY - 50) return 'arrow-bottom';
    return '';
  };

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-[9999] pointer-events-auto"
      style={{ zIndex: 9999 }}
    >
      {/* Backdrop with spotlight cutout */}
      <div className="absolute inset-0 bg-black bg-opacity-45">
        {targetPosition && (
          <div
            className="absolute bg-transparent border-4 border-purple-400 rounded-lg shadow-lg"
            style={{
              top: targetPosition.top - 8,
              left: targetPosition.left - 8,
              width: targetPosition.width + 16,
              height: targetPosition.height + 16,
              boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.45), 0 0 20px rgba(139, 92, 246, 0.5)`,
              zIndex: 10000
            }}
          />
        )}
      </div>

      {/* Tutorial tooltip */}
      <div
        className={`absolute bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 p-6 max-w-md z-[10001] ${getArrowClass()}`}
        style={tooltipPosition}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {currentStepData.title}
          </h3>
          <button
            onClick={skipTutorial}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg"
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
                className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                Previous
              </button>
            )}
            
            {/* Custom buttons from step configuration */}
            {currentStepData.buttons ? (
              currentStepData.buttons.map((button, index) => (
                <button
                  key={index}
                  onClick={() => handleAction(button.action, button.step || button.category)}
                  className={`px-4 py-1.5 text-sm rounded-lg transition-colors font-medium ${
                    button.style === 'primary'
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {button.text}
                </button>
              ))
            ) : (
              <button
                onClick={nextStep}
                className="px-4 py-1.5 text-sm bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg transition-colors font-medium"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;