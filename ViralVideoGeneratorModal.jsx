import React, { useState, useRef, useEffect } from 'react';
import { viralTemplates, animationStyles, templateCategories, getAllTemplates, getTemplate } from './ViralTemplates';
import { templates } from './templates';
import usePromptStore from './store';

const ViralVideoGeneratorModal = ({ onClose }) => {
  const { clearAll, setFieldValue, getJsonOutput } = usePromptStore();
  const modalRef = useRef(null);
  
  // State management
  const [selectedCategory, setSelectedCategory] = useState('podcast');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [userInputs, setUserInputs] = useState({});
  const [selectedAnimation, setSelectedAnimation] = useState('');
  const [useCurrentCharacter, setUseCurrentCharacter] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateSuccess, setShowGenerateSuccess] = useState(false);
  const [isAutoUpdating, setIsAutoUpdating] = useState(false);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Real-time JSON updates - trigger whenever anything changes
  useEffect(() => {
    if (selectedTemplate) {
      setIsAutoUpdating(true);
      updateJsonOutput();
      
      // Show brief auto-update indicator
      const timer = setTimeout(() => {
        setIsAutoUpdating(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedTemplate, userInputs, selectedAnimation, useCurrentCharacter]);

  const updateJsonOutput = () => {
    try {
      const template = getTemplate(selectedTemplate);
      if (!template) {
        console.warn(`Template not found: ${selectedTemplate}`);
        return;
      }

      // Start with template's fixed fields for complete scene setup
      let content = {
        // Scene description combining template description and user inputs
        scene: buildSceneDescription(template),
        tagline: template.tagline || '',
        // Safely spread fixed_fields only if it exists
        ...(template.fixed_fields && typeof template.fixed_fields === 'object' ? template.fixed_fields : {})
      };

      // Add user inputs to the content with safety checks
      Object.entries(userInputs).forEach(([key, value]) => {
        if (value && typeof value === 'string' && value.trim()) {
          content[key] = value;
        }
      });

      // Integrate current character if selected
      if (useCurrentCharacter) {
        const characterData = getCurrentCharacterData();
        content = { ...content, ...characterData };
      }

      // Add animation style if selected with safety checks
      if (selectedAnimation && animationStyles[selectedAnimation]) {
        const animStyle = animationStyles[selectedAnimation];
        const technicalTemplate = templates[animStyle.technical_name];
        
        if (technicalTemplate && technicalTemplate.levels && technicalTemplate.levels[2]) {
          content = {
            ...content,
            ...technicalTemplate.levels[2].fields,
            animation_style_name: animStyle.name,
            animation_style_description: animStyle.description,
            primary_animation_style: technicalTemplate.levels[2].fields.stylized_style || animStyle.name
          };
        }
      }

      // Add aspect ratio default
      content.aspect_ratio = content.aspect_ratio || "16:9";

      // Immediately apply to JSON output (real-time updates)
      clearAll();
      Object.entries(content).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          setFieldValue(key, value);
        } else if (value && typeof value === 'object') {
          // Handle nested objects safely
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            if (nestedValue && typeof nestedValue === 'string') {
              setFieldValue(nestedKey, nestedValue);
            }
          });
        }
      });
    } catch (error) {
      console.error('Error updating JSON output:', error);
      console.error('Template:', selectedTemplate, 'User inputs:', userInputs);
    }
  };

  const buildSceneDescription = (template) => {
    // Safely access template properties with fallbacks
    let description = template.description || 'Scene description';
    
    // Add tagline if it exists
    if (template.tagline) {
      description += ` ${template.tagline}`;
    }
    
    // Add user inputs to scene description with null safety
    const inputDescriptions = [];
    if (template.user_inputs && typeof template.user_inputs === 'object') {
      Object.entries(userInputs).forEach(([key, value]) => {
        if (value && value.trim()) {
          const inputConfig = template.user_inputs[key];
          if (inputConfig && inputConfig.label) {
            inputDescriptions.push(`${inputConfig.label.toLowerCase()}: ${value}`);
          }
        }
      });
    }
    
    if (inputDescriptions.length > 0) {
      description += `. ${inputDescriptions.join('; ')}.`;
    }
    
    return description;
  };

  const getCurrentCharacterData = () => {
    try {
      const currentJson = getJsonOutput();
      if (currentJson) {
        const parsed = JSON.parse(currentJson);
        return {
          character_type: parsed.character_type || '',
          gender: parsed.gender || '',
          age: parsed.age || '',
          clothing: parsed.clothing || '',
          hair: parsed.hair || '',
          facial_features: parsed.facial_features || '',
          emotions: parsed.emotions || ''
        };
      }
    } catch (error) {
      console.error('Error parsing current character:', error);
    }
    return {};
  };

  const handleTemplateSelect = (templateId) => {
    try {
      setSelectedTemplate(templateId);
      
      // Initialize user inputs for this template with null safety
      const template = getTemplate(templateId);
      if (template) {
        const initialInputs = {};
        // Safely check if user_inputs exists before accessing
        if (template.user_inputs && typeof template.user_inputs === 'object') {
          Object.keys(template.user_inputs).forEach(key => {
            initialInputs[key] = '';
          });
        }
        setUserInputs(initialInputs);
      } else {
        console.warn(`Template not found: ${templateId}`);
        setUserInputs({});
      }
    } catch (error) {
      console.error('Error selecting template:', error);
      console.error('Template ID:', templateId);
      setUserInputs({});
    }
  };

  const handleInputChange = (key, value) => {
    setUserInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSuggestionClick = (key, suggestion) => {
    handleInputChange(key, suggestion);
  };

  const handleManualGenerate = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    setShowGenerateSuccess(false);
    
    try {
      // Add a small delay for better UX feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call the existing updateJsonOutput function
      updateJsonOutput();
      
      // Show success feedback
      setShowGenerateSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowGenerateSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Manual generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getTemplatesForCategory = (category) => {
    if (!templateCategories[category]) return [];
    
    return templateCategories[category].templates.map(templateId => {
      const template = getTemplate(templateId);
      return {
        id: templateId,
        name: template?.name || 'Unknown Template',
        description: template?.description || 'No description available',
        tagline: template?.tagline || '',
        ...template
      };
    }).filter(template => template.name !== 'Unknown Template'); // Filter out broken templates
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-cinema-panel rounded-lg shadow-xl dark:shadow-glow-soft max-w-7xl w-full max-h-[90vh] lg:max-h-[90vh] overflow-hidden border border-transparent dark:border-cinema-border"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-cinema-border bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <span className="text-2xl lg:text-3xl">🔥</span>
            <div>
              <h2 className="text-lg lg:text-2xl font-bold">Viral Video Generator</h2>
              <p className="text-xs lg:text-sm text-purple-100 hidden sm:block">Trend-focused templates with real-time JSON updates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-[75vh]">
          {/* Left Panel - Category & Template Selection */}
          <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-cinema-border overflow-y-auto max-h-[25vh] lg:max-h-none">
            {/* Category Selection */}
            <div className="p-4 border-b border-gray-200 dark:border-cinema-border">
              <h3 className="font-semibold text-gray-900 dark:text-cinema-text mb-3">🎬 Categories</h3>
              <div className="space-y-2">
                {Object.entries(templateCategories).map(([categoryId, category]) => (
                  <button
                    key={categoryId}
                    onClick={() => {
                      setSelectedCategory(categoryId);
                      setSelectedTemplate('');
                      setUserInputs({});
                    }}
                    className={`w-full text-left px-3 py-3 rounded-md transition-all ${
                      selectedCategory === categoryId
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border-2 border-purple-300 dark:border-purple-600'
                        : 'hover:bg-gray-100 dark:hover:bg-cinema-border text-gray-700 dark:text-cinema-text border-2 border-transparent'
                    }`}
                  >
                    <div className="font-medium text-sm">{category.name}</div>
                    <div className="text-xs text-gray-500 dark:text-cinema-text-muted mt-1">
                      {category.tagline}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Template List */}
            <div className="p-4">
              <h4 className="font-medium text-gray-900 dark:text-cinema-text mb-3">
                📋 {templateCategories[selectedCategory]?.name} Templates
              </h4>
              <div className="space-y-2">
                {getTemplatesForCategory(selectedCategory).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedTemplate === template.id
                        ? 'border-purple-500 bg-purple-50 dark:border-purple-500 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-cinema-border hover:border-purple-300 dark:hover:border-purple-500/50 bg-white dark:bg-cinema-card'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-cinema-text text-sm mb-1">
                      {template.name}
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">
                      {template.tagline}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-cinema-text-muted">
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Panel - Customization */}
          <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-cinema-border overflow-y-auto flex-1">
            {selectedTemplate ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-cinema-text">
                    ✨ Customize Your Scene
                  </h3>
                  <div className={`text-xs font-medium transition-all duration-300 ${
                    isAutoUpdating 
                      ? 'text-blue-600 dark:text-blue-400 animate-pulse' 
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {isAutoUpdating ? (
                      <div className="flex items-center space-x-1">
                        <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Updating...</span>
                      </div>
                    ) : (
                      '🔄 Auto-updating JSON'
                    )}
                  </div>
                </div>
                
                {/* Character Builder Integration */}
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      👤 Character Integration
                    </label>
                    <button
                      onClick={() => setUseCurrentCharacter(!useCurrentCharacter)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        useCurrentCharacter ? 'bg-blue-500' : 'bg-gray-300 dark:bg-cinema-border'
                      }`}
                    >
                      <div className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform top-0.5 ${
                        useCurrentCharacter ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Use current Character Builder settings in this viral video
                  </p>
                </div>

                {/* User Input Fields */}
                <div className="space-y-6">
                  {(() => {
                    const template = getTemplate(selectedTemplate);
                    
                    if (!template) {
                      return (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg">
                          <p className="text-red-700 dark:text-red-300">
                            ⚠️ Template "{selectedTemplate}" not found. Please select a different template.
                          </p>
                        </div>
                      );
                    }
                    
                    if (!template.user_inputs || Object.keys(template.user_inputs).length === 0) {
                      return (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg">
                          <p className="text-yellow-700 dark:text-yellow-300">
                            ℹ️ This template doesn't require any user inputs.
                          </p>
                        </div>
                      );
                    }
                    
                    return Object.entries(template.user_inputs).map(([key, config]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
                          {config.label}
                      </label>
                      
                      {/* Text Input */}
                      <textarea
                        value={userInputs[key] || ''}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        placeholder={config.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={2}
                      />
                      
                      {/* Quick Suggestions */}
                      {config.suggestions && config.suggestions.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 dark:text-cinema-text-muted mb-2">
                            💡 Quick suggestions (click to use):
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {config.suggestions.slice(0, 4).map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(key, suggestion)}
                                className="px-2 py-1 bg-gray-100 dark:bg-cinema-border hover:bg-purple-100 dark:hover:bg-purple-900/30 text-xs rounded-full transition-colors border border-transparent hover:border-purple-300 dark:hover:border-purple-600"
                              >
                                {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    ));
                  })()}
                </div>

                {/* Animation Style Selection */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-cinema-border">
                  <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-3">
                    🎨 Animation Style (Optional)
                  </label>
                  <select
                    value={selectedAnimation}
                    onChange={(e) => setSelectedAnimation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text"
                  >
                    <option value="">No animation style</option>
                    {Object.entries(animationStyles).map(([key, style]) => (
                      <option key={key} value={key}>
                        {style.name}
                      </option>
                    ))}
                  </select>
                  {selectedAnimation && (
                    <p className="text-xs text-gray-500 dark:text-cinema-text-muted mt-2">
                      {animationStyles[selectedAnimation].description}
                    </p>
                  )}
                </div>

                {/* Manual Generate JSON Button */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-cinema-border">
                  <div className="text-center">
                    <button
                      onClick={handleManualGenerate}
                      disabled={isGenerating || !selectedTemplate}
                      className={`w-full py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                        isGenerating || !selectedTemplate
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Generating JSON...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-lg">🚀</span>
                          <span>Generate JSON Output</span>
                        </>
                      )}
                    </button>
                    
                    {/* Success Message */}
                    {showGenerateSuccess && (
                      <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">
                            ✨ JSON Generated! Check the main output panel.
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 dark:text-cinema-text-muted mt-3">
                      💡 JSON also updates automatically as you type above
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div className="space-y-4">
                  <div className="text-6xl">🎯</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-cinema-text">
                    Choose Your Viral Format
                  </h3>
                  <p className="text-gray-600 dark:text-cinema-text-muted max-w-md">
                    Select a category and template to start creating viral content. 
                    JSON updates automatically as you customize!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Live JSON Preview */}
          <div className="w-full lg:w-1/4 overflow-y-auto bg-gray-50 dark:bg-cinema-card max-h-[25vh] lg:max-h-none">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-cinema-text">
                  📄 JSON Output Preview
                </h3>
                <div className={`text-xs font-medium transition-all duration-300 ${
                  isAutoUpdating 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : showGenerateSuccess 
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-cinema-text-muted'
                }`}>
                  {isAutoUpdating ? (
                    <div className="flex items-center space-x-1">
                      <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Auto-updating...</span>
                    </div>
                  ) : showGenerateSuccess ? (
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Generated!</span>
                    </div>
                  ) : (
                    '⚡ Ready'
                  )}
                </div>
              </div>

              {selectedTemplate ? (
                <div className="space-y-4">
                  {/* Template Info */}
                  <div className="bg-white dark:bg-cinema-panel p-3 rounded-lg border border-gray-200 dark:border-cinema-border">
                    <div className="text-sm font-medium text-gray-900 dark:text-cinema-text mb-1">
                      📋 {getTemplate(selectedTemplate)?.name}
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-2">
                      {getTemplate(selectedTemplate)?.tagline}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-cinema-text-muted">
                      Category: {templateCategories[selectedCategory]?.name}
                    </div>
                  </div>

                  {/* Live JSON Preview */}
                  <div className="bg-gray-900 dark:bg-cinema-black rounded-lg p-3 border border-gray-700 dark:border-cinema-border">
                    <div className="text-xs text-gray-300 mb-2">Current JSON Output:</div>
                    <div className="text-green-400 dark:text-cinema-teal text-xs font-mono leading-relaxed max-h-80 overflow-y-auto">
                      {getJsonOutput() ? (
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(JSON.parse(getJsonOutput()), null, 2)}
                        </pre>
                      ) : (
                        <div className="text-gray-500 italic">
                          Fill in template fields to see JSON output...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Usage Instructions */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">
                      ✨ How It Works
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                      <div>• JSON updates automatically as you type</div>
                      <div>• Use "Generate JSON" button for manual control</div>
                      <div>• Close modal to keep current JSON</div>
                      <div>• All fields populate instantly in main app</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-center">
                  <div className="space-y-3">
                    <div className="text-4xl">📝</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-cinema-text">
                      JSON Preview
                    </div>
                    <div className="text-xs text-gray-500 dark:text-cinema-text-muted">
                      Select a template to see live JSON output
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViralVideoGeneratorModal;