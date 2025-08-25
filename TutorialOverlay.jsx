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
  const { setFieldValue, clearAll } = usePromptStore();

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
          <p className="mb-2">Describe your scene in plain English. Watch AI create structured prompts instantly.</p>
          <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-2 mb-2">
            <p className="text-xs font-medium text-green-800 dark:text-green-300 mb-1">💡 Try this example:</p>
            <p className="text-xs text-green-700 dark:text-green-200 italic">"A dragon sleeping on a crystal mountain under the stars"</p>
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
            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-2 border border-green-200 dark:border-green-700">
              <p className="text-sm text-green-800 dark:text-green-300">
                ✅ <strong>Perfect!</strong> Text converted to structured JSON. The button now shows "Enhance" for richer descriptions.
              </p>
            </div>
          )}
        </div>
      ),
      target: '[data-tutorial="text-input"]',
      position: 'right',
      disableScroll: true
    },
    {
      id: 'json-output',
      title: '📊 Watch Your JSON Populate!',
      content: () => (
        <div>
          <p className="mb-2">Perfect! See how JSON fields populated with structured data from your description.</p>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-2 mb-2">
            <p className="text-xs font-medium text-green-800 dark:text-green-300 mb-1">✅ AI analyzed → extracted elements → populated JSON → ready to enhance</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-2 mb-2">
            <p className="text-xs text-purple-700 dark:text-purple-200">
              🎨 Convert became <strong>Enhance</strong> - click it for richer, more detailed descriptions!
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
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 mt-2 border border-blue-200 dark:border-blue-700">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              💡 <strong>Core workflow:</strong> Start simple, then enhance with more detail!
            </p>
          </div>
        </div>
      ),
      target: '[data-tutorial="json-output"]',
      position: 'top',
      disableScroll: false
    },
    {
      id: 'quick-tools',
      title: '🔧 Essential JSON Tools',
      content: () => (
        <div>
          <p className="mb-2">Try the essential tools for managing your JSON:</p>
          <div className="space-y-1 mb-2">
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">📋</span>
              <span><strong>Copy to Clipboard</strong> — Export your JSON instantly for use anywhere</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">🗑️</span>
              <span><strong>Clear All</strong> — Start fresh with one click</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">💾</span>
              <span><strong>Save Scene</strong> — Store your creations for reuse</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">↶</span>
              <span><strong>Undo</strong> — Reverse any changes safely</span>
            </div>
          </div>
          
          {/* Interactive Demo Buttons */}
          <div className="space-y-2 mb-2">
            {!tutorialState.hasCopiedJSON && (
              <button
                onClick={() => {
                  // Find and click the Copy to Clipboard button
                  const copyButton = document.querySelector('[aria-label="Copy JSON to clipboard"]') ||
                                   Array.from(document.querySelectorAll('button')).find(btn => 
                                     (btn.textContent.includes('Copy to Clipboard') || btn.textContent.includes('Copy')) && !btn.disabled
                                   );
                  
                  if (copyButton) {
                    copyButton.click();
                    
                    // Show copy success indicator
                    setTimeout(() => {
                      const indicator = document.createElement('div');
                      indicator.className = 'fixed z-[10002] bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg animate-bounce';
                      indicator.textContent = '📋 JSON copied to clipboard!';
                      indicator.style.top = '20px';
                      indicator.style.right = '20px';
                      document.body.appendChild(indicator);
                      
                      setTimeout(() => {
                        if (document.body.contains(indicator)) {
                          document.body.removeChild(indicator);
                        }
                      }, 3000);
                    }, 500);
                    
                    setTutorialState(prev => ({ ...prev, hasCopiedJSON: true }));
                  }
                }}
                className="w-full px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 font-medium"
              >
                📋 Try Copy to Clipboard
              </button>
            )}
            
            {!tutorialState.hasClearedAll && (
              <button
                onClick={() => {
                  // Directly call clearAll function to bypass confirmation modal
                  if (typeof clearAll === 'function') {
                    clearAll();
                  } else {
                    // Fallback: find and click the Clear All button
                    const clearButton = document.querySelector('[aria-label="Clear all scene data"]') ||
                                      Array.from(document.querySelectorAll('button')).find(btn => 
                                        (btn.textContent.includes('Clear All') || btn.textContent.includes('Clear')) && !btn.disabled
                                      );
                    if (clearButton) clearButton.click();
                  }
                  
                  // Show clear success indicator
                  setTimeout(() => {
                    const indicator = document.createElement('div');
                    indicator.className = 'fixed z-[10002] bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg animate-pulse';
                    indicator.textContent = '🗑️ All fields cleared! Ready for new content.';
                    indicator.style.top = '20px';
                    indicator.style.right = '20px';
                    document.body.appendChild(indicator);
                    
                    setTimeout(() => {
                      if (document.body.contains(indicator)) {
                        document.body.removeChild(indicator);
                      }
                    }, 3000);
                  }, 500);
                  
                  setTutorialState(prev => ({ ...prev, hasClearedAll: true }));
                }}
                className="w-full px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 font-medium"
              >
                🗑️ Try Clear All
              </button>
            )}
          </div>
          
          {(tutorialState.hasCopiedJSON || tutorialState.hasClearedAll) && (
            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-2 border border-green-200 dark:border-green-700">
              <p className="text-xs text-green-800 dark:text-green-300">
                ✅ <strong>Great!</strong> You've learned essential JSON management. These header tools give you complete control.
              </p>
            </div>
          )}
          
          {!tutorialState.hasCopiedJSON && !tutorialState.hasClearedAll && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-2">
              <p className="text-xs text-blue-800 dark:text-blue-300">
                💡 <strong>Try the buttons above!</strong> Experience Copy and Clear All features.
              </p>
            </div>
          )}
        </div>
      ),
      target: '[data-tutorial="advanced-features-full"]',
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
          <p className="mb-2">Supercharge your creativity with AI tools below the text input:</p>
          <div className="space-y-1 mb-2">
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-5">🎭</span>
              <span><strong>Character Builder</strong> — Generate detailed personas and profiles</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-5">🌍</span>
              <span><strong>World Builder</strong> — Create immersive environments and settings</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-5">🎨</span>
              <span><strong>Style Builder</strong> — Generate art styles and visual aesthetics</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-5">🎬</span>
              <span><strong>Storyboard Builder</strong> — Break scenes into camera sequences</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-5">✨</span>
              <span><strong>Scene Extender</strong> — Generate multiple scene variations</span>
            </div>
          </div>
          <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-2 border border-pink-200 dark:border-pink-700">
            <p className="text-xs text-pink-800 dark:text-pink-200">
              💡 These compact buttons appear below Convert/Enhance in the text area.
            </p>
          </div>
        </div>
      ),
      target: '[data-tutorial="ai-tools"]',
      position: 'right',
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
      title: '🧠 Creative Inspiration Hub',
      content: () => (
        <div>
          <p className="mb-3">Need instant inspiration? These tools jumpstart your creativity:</p>
          <div className="space-y-2 mb-3">
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">📋</span>
              <span><strong>Templates & Presets</strong> — Genre-based starting points (horror, romance, sci-fi)</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">🔥</span>
              <span><strong>Viral</strong> — Trending formats optimized for social media success</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">🎲</span>
              <span><strong>Randomize</strong> — AI surprises perfect for breaking creative blocks</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-6">📐</span>
              <span><strong>Aspect Ratio Controls</strong> — Optimize for any platform (Instagram, TikTok, etc.)</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-3">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              💡 <strong>Pro Tip:</strong> Click any of these header buttons when you need fresh ideas or want to optimize your content for specific platforms!
            </p>
          </div>
        </div>
      ),
      target: '[data-tutorial="quick-tools"]',
      position: 'bottom'
    },
    {
      id: 'consistency-controls',
      title: '⚙️ Master Consistency & Control',
      content: () => (
        <div>
          <p className="mb-3">Perfect for content creators who need reliable, repeatable results:</p>
          <div className="space-y-3 mb-4">
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">🎲</span>
                <span className="font-medium text-teal-800 dark:text-teal-300">Seed Controls</span>
              </div>
              <ul className="text-sm text-teal-700 dark:text-teal-200 space-y-1 ml-6">
                <li>• Same seed = similar results every time</li>
                <li>• Tap the dice for fresh variations</li>
                <li>• Perfect for A/B testing ideas</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">🔒</span>
                <span className="font-medium text-orange-800 dark:text-orange-300">Smart Locks</span>
              </div>
              <ul className="text-sm text-orange-700 dark:text-orange-200 space-y-1 ml-6">
                <li>• <strong>Lock Identity:</strong> Keep same character/look across retries</li>
                <li>• <strong>Lock Style:</strong> Maintain visual grade/palette</li>
                <li>• Prevent unwanted changes during iteration</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">🎨</span>
                <span className="font-medium text-purple-800 dark:text-purple-300">Creative Control</span>
              </div>
              <ul className="text-sm text-purple-700 dark:text-purple-200 space-y-1 ml-6">
                <li>• Creativity slider: Lower = steadier, Higher = wilder</li>
                <li>• Brand color palettes with visual color picker</li>
                <li>• Camera and timing controls for precision</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>💡 Pro Tip:</strong> Use consistency controls for content series, brand campaigns, or when you need to iterate on a concept while maintaining key visual elements!
            </p>
          </div>
        </div>
      ),
      target: '[data-tutorial="consistency-panel"]',
      position: 'left'
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
              <li>• Master Consistency controls for repeatable results</li>
              <li>• Organize everything with Projects</li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3 border border-blue-200 dark:border-blue-700">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">🔬 Advanced Mode Tips:</p>
            <ul className="text-xs text-blue-700 dark:text-blue-200 space-y-1">
              <li>• Switch to Advanced Mode for full JSON control</li>
              <li>• Edit JSON directly in Advanced Mode</li>
              <li>• Use Consistency panel for seeds, locks, and creative control</li>
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
      // Special positioning for consistency step - balanced left position
      if (stepData && stepData.id === 'consistency-controls') {
        return {
          top: '0px',
          left: '15%',
          transform: 'translateX(-50%)'
        };
      }
      // Center position for welcome/complete steps
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const tooltipWidth = 400; // Slightly wider for new content
    
    // Dynamic height calculation based on content and buttons
    const baseHeight = 280;
    const buttonAreaHeight = 60; // Reserve space for navigation buttons
    const tooltipHeight = baseHeight + buttonAreaHeight;
    
    const padding = 20;
    const targetPadding = 60; // Increased padding from target to avoid covering it
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Extra padding to ensure buttons are always visible
    const buttonSafetyPadding = 80;
    
    // Define step type checks first
    const isLargeTarget = targetPos.height > 300;
    const isTextInput = stepData && stepData.id === 'text-input';
    const isAiTools = stepData && stepData.id === 'ai-tools';
    const isJsonOutput = stepData && stepData.id === 'json-output';
    const isConsistencyControls = stepData && stepData.id === 'consistency-controls';
    
    // Enhanced spacing for AI tools to ensure complete clearance
    const aiToolsTargetPadding = isAiTools ? 120 : targetPadding;
    const aiToolsButtonSafety = isAiTools ? 120 : buttonSafetyPadding;
    
    const targetCenterY = isLargeTarget ? targetPos.top + 50 : 
                         isTextInput ? targetPos.top - 50 : // Position much higher for text input
                         isAiTools ? 150 : // EMERGENCY: Force AI tools tooltip to TOP of viewport
                         isConsistencyControls ? 50 : // EMERGENCY: Force consistency controls tooltip to TOP of viewport
                         isJsonOutput ? Math.max(targetPos.top - 100, 100) : // Special positioning for JSON output step
                         targetPos.top + (targetPos.height / 2);
    
    // Calculate positions for each direction with extra padding to avoid covering target
    const positions = {
      right: {
        top: targetCenterY - (tooltipHeight / 2),
        left: targetPos.right + aiToolsTargetPadding,
      },
      left: {
        top: targetCenterY - (tooltipHeight / 2),
        left: targetPos.left - tooltipWidth - (isTextInput ? aiToolsTargetPadding * 2 : aiToolsTargetPadding),
      },
      bottom: {
        top: targetPos.bottom + aiToolsTargetPadding,
        left: targetPos.left + (targetPos.width / 2) - (tooltipWidth / 2),
      },
      top: {
        top: targetPos.top - tooltipHeight - aiToolsTargetPadding,
        left: targetPos.left + (targetPos.width / 2) - (tooltipWidth / 2),
      }
    };
    
    // Check if position fits in viewport with button safety area
    const fitsInViewport = (pos) => {
      const tooltipBottom = pos.top + tooltipHeight;
      const tooltipRight = pos.left + tooltipWidth;
      
      // Ensure tooltip and especially buttons are fully visible
      return pos.top >= padding && 
             tooltipBottom <= viewportHeight - aiToolsButtonSafety &&
             pos.left >= padding && 
             tooltipRight <= viewportWidth - padding;
    };
    
    // NUCLEAR OPTION for AI Tools - Force DEAD CENTER like welcome step
    if (isAiTools) {
      // Use exact same positioning as welcome/completion steps - GUARANTEED to work
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }
    
    // Special handling for json-output step - prefer top positioning to avoid cutoff
    if (isJsonOutput) {
      const jsonFallbackOrder = ['top', 'left', 'bottom', 'right'];
      for (const position of jsonFallbackOrder) {
        if (positions[position] && fitsInViewport(positions[position])) {
          return positions[position];
        }
      }
    }
    
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
    
    // If nothing fits, force position within viewport bounds with button safety
    const forcedPosition = positions[preferredPosition] || positions.right;
    return {
      top: Math.max(padding, Math.min(forcedPosition.top, viewportHeight - tooltipHeight - aiToolsButtonSafety)),
      left: Math.max(padding, Math.min(forcedPosition.left, viewportWidth - tooltipWidth - padding))
    };
  };

  // Auto-scroll to ensure tutorial is visible with improved calculations
  const scrollToTutorial = (targetPos, tooltipPos) => {
    if (!targetPos && !tooltipPos) return;
    
    const padding = 80; // Increased padding for better visibility
    const buttonSafetyPadding = 100; // Extra padding to ensure buttons are visible
    const aiToolsButtonSafety = 120; // Enhanced safety for AI tools
    const viewportHeight = window.innerHeight;
    let scrollTarget = null;
    
    if (tooltipPos && typeof tooltipPos.top === 'number') {
      // Prioritize tooltip visibility with button safety area
      const tooltipTop = tooltipPos.top + window.pageYOffset;
      const tooltipHeight = 340; // Updated to match our dynamic height calculation
      const tooltipBottom = tooltipTop + tooltipHeight;
      const viewportTop = window.pageYOffset;
      const viewportBottom = viewportTop + viewportHeight;
      
      // Use enhanced button safety for AI tools step
      const currentButtonSafety = currentStep === 6 ? aiToolsButtonSafety : buttonSafetyPadding; // Step 6 is AI Tools Hub
      
      // Special scroll handling for AI tools - ensure both tooltip (high) and AI tools (lower) are visible
      if (currentStep === 6) { // AI Tools Hub step
        // AI tools tooltip is positioned high, ensure page is scrolled so both tooltip and tools are visible
        const minScrollForTooltip = Math.max(0, tooltipTop - 100); // Keep tooltip near top
        const maxScrollForTarget = targetPos ? Math.max(0, (targetPos.top + window.pageYOffset) - (viewportHeight * 0.7)) : 0; // Keep AI tools in bottom 30%
        scrollTarget = Math.min(minScrollForTooltip, maxScrollForTarget);
      } else {
        // Check if tooltip (especially buttons) would be cut off
        if (tooltipTop < viewportTop + padding || tooltipBottom > viewportBottom - currentButtonSafety) {
          // Position tooltip in center of viewport with safety margins
          scrollTarget = Math.max(0, tooltipTop - ((viewportHeight - tooltipHeight) / 2));
        }
      }
    }
    
    // Fallback to target-based scrolling if tooltip positioning didn't set scroll target
    if (scrollTarget === null && targetPos) {
      const targetTop = targetPos.top + window.pageYOffset;
      const targetBottom = targetPos.bottom + window.pageYOffset;
      const targetCenter = targetTop + (targetPos.height / 2);
      const viewportTop = window.pageYOffset;
      const viewportBottom = viewportTop + viewportHeight;
      
      // Use enhanced button safety for AI tools step
      const currentButtonSafety = currentStep === 6 ? aiToolsButtonSafety : buttonSafetyPadding; // Step 6 is AI Tools Hub
      
      // Only scroll if target is not reasonably visible
      if (targetTop < viewportTop + padding || targetBottom > viewportBottom - currentButtonSafety) {
        // Try to center the target in the viewport with button safety
        scrollTarget = Math.max(0, targetCenter - (viewportHeight / 2));
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
    // For AI Tools Hub (centered), no arrow needed
    if (currentStepData.id === 'ai-tools') return '';
    
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
        className={`tutorial-tooltip-container absolute bg-light-panel dark:bg-cinema-panel rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 p-6 max-w-xl z-[10001] ${getArrowClass()}`}
        style={{
          ...tooltipPosition,
          maxHeight: `${Math.min(window.innerHeight * 0.95, 700)}px`,
          minHeight: 'auto',
          overflowY: 'visible'
        }}
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
        <div className="tutorial-tooltip-content text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          {typeof currentStepData.content === 'function' ? currentStepData.content() : (
            <p>{currentStepData.content}</p>
          )}
        </div>

        {/* Footer */}
        <div className="tutorial-tooltip-buttons flex items-center justify-between">
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