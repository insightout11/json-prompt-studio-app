import React, { useState } from 'react';
import { allTemplates, getAllTemplateKeys, isPresetTemplate, getTemplate } from './templates';
import ExperimentalModeEngine from './ExperimentalModeEngine';
import usePromptStore from './store';
import { characterPresets } from './characterPresetsData';
import { scenePresets } from './scenePresetsData';
import { actionPresets } from './actionPresetsData';
import { directorStyles } from './directorStylesData';
import { audioPresets } from './audioPresetsData';

// Template categorization
const TEMPLATE_CATEGORIES = {
  all: getAllTemplateKeys(),
  directors: [
    'wes_anderson', 'christopher_nolan', 'steven_spielberg', 'quentin_tarantino', 
    'hayao_miyazaki', 'zack_snyder', 'david_fincher', 'greta_gerwig', 
    'guillermo_del_toro', 'stanley_kubrick'
  ],
  genres: [
    'horror', 'cinematic', 'social_media', 'realistic_gritty', 
    'commercial', 'music_video', 'travel', 'corporate'
  ],
  trending: ['viral_short', 'character_narrative', 'stylized_meme'],
  animation: [
    'springfield_yellow', 'cutout_satire', 'slacker_sitcom', 'sci_fi_toon', 'spy_noir_animation',
    'studio_ghibli_magic', 'shonen_battle', 'cyberpunk_anime',
    'classic_disney_2d', 'pixar_3d_style',
    'cartoon_network_classic', 'nickelodeon_90s',
    'paper_cutout', 'stop_motion_clay', 'flash_animation'
  ],
  experimental: ExperimentalModeEngine.getAllFormats().map(format => format.id),
  
  // New preset categories
  characters: Object.keys(characterPresets),
  scenes: Object.keys(scenePresets), 
  actions: Object.keys(actionPresets),
  styles: Object.keys(directorStyles),
  audio: Object.keys(audioPresets)
};

const TAB_LABELS = {
  all: 'All Templates',
  directors: 'Directors',
  genres: 'Genres', 
  trending: 'Trending',
  animation: '🎨 Animation Styles',
  experimental: '🧪 Experimental',
  
  // New preset category labels
  characters: '👤 Characters',
  scenes: '📍 Scenes', 
  actions: '🎬 Actions',
  styles: '🎨 Styles',
  audio: '🔊 Audio'
};

const TemplateSelector = () => {
  const { applyTemplate, getTemplatePreview, clearAll, setFieldValue, applyCharacterPresetData, applyScenePresetData } = usePromptStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(2);
  const [preview, setPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Experimental mode controls
  const [absurdityLevel, setAbsurdityLevel] = useState(1);
  const [randomnessEnabled, setRandomnessEnabled] = useState(false);
  const [experimentalPreview, setExperimentalPreview] = useState(null);

  const handleTemplateSelect = (templateKey) => {
    setSelectedTemplate(templateKey);
    
    // Check if this is an experimental format
    if (activeTab === 'experimental') {
      // Generate experimental preview
      try {
        const result = ExperimentalModeEngine.generateExperimentalContent(
          templateKey,
          absurdityLevel,
          randomnessEnabled
        );
        setExperimentalPreview(result);
        setPreview(null);
      } catch (error) {
        console.error('Error generating experimental preview:', error);
      }
    } else {
      // Regular template preview
      const templatePreview = getTemplatePreview(templateKey, selectedLevel);
      setPreview(templatePreview);
      setExperimentalPreview(null);
    }
    
    setShowModal(true);
  };

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    if (selectedTemplate) {
      const templatePreview = getTemplatePreview(selectedTemplate, level);
      setPreview(templatePreview);
    }
  };

  const handleApply = () => {
    if (selectedTemplate) {
      if (activeTab === 'experimental' && experimentalPreview) {
        // Apply experimental content
        clearAll();
        Object.entries(experimentalPreview.content).forEach(([key, value]) => {
          if (value && typeof value === 'string') {
            setFieldValue(key, value);
          }
        });
      } else if (isPresetTemplate(selectedTemplate)) {
        // Handle converted presets - apply fields directly
        const template = getTemplate(selectedTemplate);
        if (template.fields) {
          Object.entries(template.fields).forEach(([field, value]) => {
            setFieldValue(field, value);
          });
        }
      } else {
        // Apply regular template with levels
        applyTemplate(selectedTemplate, selectedLevel);
      }
      
      setShowModal(false);
      setSelectedTemplate(null);
      setPreview(null);
      setExperimentalPreview(null);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedTemplate(null);
    setPreview(null);
    setExperimentalPreview(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedTemplate(null);
    setPreview(null);
    setExperimentalPreview(null);
  };

  // Experimental mode handlers
  const handleAbsurdityChange = (level) => {
    setAbsurdityLevel(level);
    if (selectedTemplate && activeTab === 'experimental') {
      try {
        const result = ExperimentalModeEngine.generateExperimentalContent(
          selectedTemplate,
          level,
          randomnessEnabled
        );
        setExperimentalPreview(result);
      } catch (error) {
        console.error('Error updating experimental preview:', error);
      }
    }
  };

  const handleRandomnessToggle = () => {
    const newRandomness = !randomnessEnabled;
    setRandomnessEnabled(newRandomness);
    if (selectedTemplate && activeTab === 'experimental') {
      try {
        const result = ExperimentalModeEngine.generateExperimentalContent(
          selectedTemplate,
          absurdityLevel,
          newRandomness
        );
        setExperimentalPreview(result);
      } catch (error) {
        console.error('Error updating experimental preview:', error);
      }
    }
  };

  const getFilteredTemplates = () => {
    if (activeTab === 'experimental') {
      return TEMPLATE_CATEGORIES[activeTab]; // Experimental formats don't need filtering
    }
    return TEMPLATE_CATEGORIES[activeTab].filter(key => allTemplates[key]);
  };

  return (
    <>
      {/* Template Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-sm font-medium rounded-md transition-all duration-300 flex items-center space-x-2 h-10 shadow-lg hover:shadow-xl"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5M3 7h18M3 17h18" />
        </svg>
        <span>Templates & Presets</span>
      </button>

      {/* Template Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-xl dark:shadow-glow-soft max-w-4xl w-full max-h-[90vh] overflow-hidden border border-transparent dark:border-cinema-border transition-all duration-300">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-cinema-border">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-cinema-text">
                Choose a Template or Preset
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:text-cinema-text-muted dark:hover:text-cinema-text transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-cinema-border">
              <nav className="flex flex-wrap sm:space-x-8 px-6" aria-label="Tabs">
                {Object.entries(TAB_LABELS).map(([tabKey, label]) => {
                  const templateCount = tabKey === 'experimental' 
                    ? TEMPLATE_CATEGORIES[tabKey].length 
                    : TEMPLATE_CATEGORIES[tabKey].filter(key => allTemplates[key]).length;
                  return (
                    <button
                      key={tabKey}
                      onClick={() => handleTabChange(tabKey)}
                      className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                        activeTab === tabKey
                          ? 'border-indigo-500 text-indigo-600 dark:border-cinema-teal dark:text-cinema-teal'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text hover:border-gray-300 dark:hover:border-cinema-border'
                      }`}
                    >
                      <span className="hidden sm:inline">{label}</span>
                      <span className="sm:hidden">{label.split(' ')[0]}</span>
                      <span className="ml-1 sm:ml-2 bg-gray-100 text-gray-900 dark:bg-cinema-card dark:text-cinema-text py-0.5 px-1.5 sm:px-2.5 rounded-full text-xs transition-colors duration-300">
                        {templateCount}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex h-[60vh]">
              {/* Template Grid */}
              <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-cinema-panel/30 transition-colors duration-300">
                {getFilteredTemplates().length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getFilteredTemplates().map((templateKey) => {
                      // Handle experimental formats differently
                      if (activeTab === 'experimental') {
                        const experimentalFormat = ExperimentalModeEngine.getFormat(templateKey);
                        if (!experimentalFormat) return null;
                        
                        return (
                          <button
                            key={templateKey}
                            onClick={() => handleTemplateSelect(templateKey)}
                            className={`p-4 border-2 rounded-lg transition-all duration-300 group ${
                              selectedTemplate === templateKey
                                ? 'border-purple-500 bg-purple-50 dark:border-purple-500 dark:bg-purple-900/20 dark:shadow-glow-purple'
                                : 'border-gray-200 hover:border-purple-300 dark:border-cinema-border dark:hover:border-purple-500/50 bg-white dark:bg-cinema-card hover:shadow-md dark:hover:shadow-glow-soft dark:hover:transform dark:hover:translateY(-2px)'
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">{experimentalFormat.icon}</div>
                              <div className="font-medium text-gray-900 dark:text-cinema-text text-sm mb-1 transition-colors duration-300">
                                {experimentalFormat.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-cinema-text-muted transition-colors duration-300">
                                {experimentalFormat.description}
                              </div>
                              <div className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium">
                                🧪 Experimental
                              </div>
                            </div>
                          </button>
                        );
                      } else {
                        // Regular template rendering
                        const template = allTemplates[templateKey];
                        const isDirectorTemplate = TEMPLATE_CATEGORIES.directors.includes(templateKey);
                        
                        return (
                          <button
                            key={templateKey}
                            onClick={() => handleTemplateSelect(templateKey)}
                            className={`p-4 border-2 rounded-lg transition-all duration-300 group ${
                              selectedTemplate === templateKey
                                ? 'border-indigo-500 bg-indigo-50 dark:border-cinema-teal dark:bg-cinema-teal/10 dark:shadow-glow-teal'
                                : `border-gray-200 hover:border-gray-300 dark:border-cinema-border dark:hover:border-cinema-teal/50 bg-white dark:bg-cinema-card hover:shadow-md dark:hover:shadow-glow-soft dark:hover:transform dark:hover:translateY(-2px) ${
                                    isDirectorTemplate ? 'dark:hover:shadow-glow-purple dark:hover:border-cinema-purple/50' : ''
                                  }`
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">{template.icon}</div>
                              <div className="font-medium text-gray-900 dark:text-cinema-text text-sm mb-1 transition-colors duration-300">
                                {template.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-cinema-text-muted transition-colors duration-300">
                                {template.description}
                              </div>
                            </div>
                          </button>
                        );
                      }
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500 dark:text-cinema-text-muted">
                      <div className="text-4xl mb-4 animate-float">🎬</div>
                      <div className="text-lg font-medium mb-2">No templates found</div>
                      <div className="text-sm">Try selecting a different category</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Panel */}
              {selectedTemplate && preview && (
                <div className="w-80 border-l border-gray-200 dark:border-cinema-border bg-gray-50 dark:bg-cinema-card flex flex-col transition-colors duration-300">
                  {/* Scrollable Content */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Template Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-cinema-text flex items-center space-x-2">
                          <span className="text-2xl">{allTemplates[selectedTemplate].icon}</span>
                          <span>{preview.name}</span>
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-cinema-text-muted mt-1 transition-colors duration-300">
                          {preview.description}
                        </p>
                      </div>

                      {/* Level Selector - Only for non-preset templates */}
                      {!isPresetTemplate(selectedTemplate) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-2 transition-colors duration-300">
                            Complexity Level
                          </label>
                          <div className="space-y-2">
                            {[1, 2, 3].map((level) => {
                              const levelData = allTemplates[selectedTemplate].levels[level];
                              const fieldCount = Object.keys(levelData.fields).length;
                              
                              return (
                                <button
                                  key={level}
                                  onClick={() => handleLevelChange(level)}
                                  className={`w-full p-3 text-left border rounded-md transition-all duration-300 ${
                                    selectedLevel === level
                                      ? 'border-indigo-500 bg-indigo-50 dark:border-cinema-teal dark:bg-cinema-teal/10'
                                      : 'border-gray-200 hover:border-gray-300 dark:border-cinema-border dark:hover:border-cinema-teal/50 bg-white dark:bg-cinema-panel'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium text-sm text-gray-900 dark:text-cinema-text transition-colors duration-300">
                                        {levelData.name}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-cinema-text-muted transition-colors duration-300">
                                        {levelData.description}
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-400 dark:text-cinema-text-muted transition-colors duration-300">
                                      {fieldCount} fields
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* Preset Metadata - Only for presets */}
                      {isPresetTemplate(selectedTemplate) && (
                        <div className="space-y-3">
                          {/* Category & Tags */}
                          <div className="bg-white dark:bg-cinema-panel p-3 rounded-md border border-gray-200 dark:border-cinema-border transition-colors duration-300">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700 dark:text-cinema-text">Category:</span>
                              <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                                {allTemplates[selectedTemplate].category}
                              </span>
                            </div>
                            {allTemplates[selectedTemplate].tags && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {allTemplates[selectedTemplate].tags.slice(0, 4).map(tag => (
                                  <span key={tag} className="text-xs bg-gray-100 dark:bg-cinema-border text-gray-600 dark:text-cinema-text-muted px-1.5 py-0.5 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Use Case */}
                          {allTemplates[selectedTemplate].useCase && (
                            <div className="bg-white dark:bg-cinema-panel p-3 rounded-md border border-gray-200 dark:border-cinema-border transition-colors duration-300">
                              <div className="text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">Use Case:</div>
                              <div className="text-sm text-gray-600 dark:text-cinema-text-muted">
                                {allTemplates[selectedTemplate].useCase}
                              </div>
                            </div>
                          )}
                          
                          {/* Custom Details */}
                          {allTemplates[selectedTemplate].customDetails && (
                            <div className="bg-white dark:bg-cinema-panel p-3 rounded-md border border-gray-200 dark:border-cinema-border transition-colors duration-300">
                              <div className="text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">Details:</div>
                              <div className="text-sm text-gray-600 dark:text-cinema-text-muted">
                                {allTemplates[selectedTemplate].customDetails}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Preview Summary */}
                      <div className="bg-white dark:bg-cinema-panel p-3 rounded-md border border-gray-200 dark:border-cinema-border transition-colors duration-300">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-cinema-text mb-2 transition-colors duration-300">
                            Will apply {preview.fieldCount} fields across:
                          </div>
                          <div className="text-gray-600 dark:text-cinema-text-muted transition-colors duration-300">
                            {preview.categoriesAffected.join(', ')}
                          </div>
                        </div>
                      </div>

                      {/* Field List */}
                      <div className="bg-white dark:bg-cinema-panel p-3 rounded-md border border-gray-200 dark:border-cinema-border transition-colors duration-300">
                        <div className="text-sm font-medium text-gray-900 dark:text-cinema-text mb-2 transition-colors duration-300">
                          Fields to be set:
                        </div>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {Object.entries(preview.fields).map(([key, value]) => (
                            <div key={key} className="text-xs text-gray-600 dark:text-cinema-text-muted transition-colors duration-300">
                              <span className="font-medium">{key}:</span> {value}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sticky Apply Button */}
                  <div className="p-6 border-t border-gray-200 dark:border-cinema-border bg-gray-50 dark:bg-cinema-card transition-colors duration-300">
                    <button
                      onClick={handleApply}
                      className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 dark:bg-cinema-teal dark:hover:bg-cinema-teal/90 dark:hover:shadow-glow-teal text-white font-medium rounded-md transition-all duration-300"
                    >
                      {isPresetTemplate(selectedTemplate) ? 'Apply Preset' : 'Apply Template'}
                    </button>
                  </div>
                </div>
              )}

              {/* Experimental Preview Panel */}
              {selectedTemplate && experimentalPreview && activeTab === 'experimental' && (
                <div className="w-80 border-l border-gray-200 dark:border-cinema-border bg-gray-50 dark:bg-cinema-card flex flex-col transition-colors duration-300">
                  {/* Scrollable Content */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Experimental Format Info */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl">{experimentalPreview.formatInfo.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-cinema-text">
                              {experimentalPreview.formatInfo.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{experimentalPreview.formatInfo.levelIcon}</span>
                              <span className="text-sm text-gray-600 dark:text-cinema-text-muted">
                                {experimentalPreview.formatInfo.levelName}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Viral Potential */}
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-cinema-text">
                            Viral Potential:
                          </span>
                          <div className="flex-1 bg-gray-200 dark:bg-cinema-border rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${experimentalPreview.metadata.viralPotential}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                            {experimentalPreview.metadata.viralPotential}%
                          </span>
                        </div>

                        {/* Recommended Platforms */}
                        <div className="flex flex-wrap gap-2">
                          {experimentalPreview.metadata.recommendedPlatforms.map(platform => (
                            <span 
                              key={platform}
                              className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Absurdity Level Controls */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
                          🎚️ Absurdity Level
                        </label>
                        <div className="space-y-2">
                          {[
                            { id: 1, name: "Mildly Offbeat", icon: "🎭", description: "Gentle humor" },
                            { id: 2, name: "Surreal", icon: "🤪", description: "Reality-bending" },
                            { id: 3, name: "Absurd Chaos", icon: "💀", description: "Complete chaos" }
                          ].map((level) => (
                            <button
                              key={level.id}
                              onClick={() => handleAbsurdityChange(level.id)}
                              className={`w-full p-3 text-left border rounded-md transition-all duration-300 ${
                                absurdityLevel === level.id
                                  ? 'border-purple-500 bg-purple-50 dark:border-purple-500 dark:bg-purple-900/20'
                                  : 'border-gray-200 hover:border-purple-300 dark:border-cinema-border dark:hover:border-purple-500/50 bg-white dark:bg-cinema-panel'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-xl">{level.icon}</span>
                                <div>
                                  <div className="font-medium text-sm text-gray-900 dark:text-cinema-text">
                                    {level.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-cinema-text-muted">
                                    {level.description}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Chaos Injection Toggle */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-cinema-text">
                            🎲 Chaos Injection
                          </label>
                          <button
                            onClick={handleRandomnessToggle}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              randomnessEnabled ? 'bg-purple-500' : 'bg-gray-300 dark:bg-cinema-border'
                            }`}
                          >
                            <div className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform top-0.5 ${
                              randomnessEnabled ? 'translate-x-6' : 'translate-x-0.5'
                            }`} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-cinema-text-muted">
                          Add random objects and actions for maximum unpredictability
                        </p>
                      </div>

                      {/* Content Preview */}
                      <div className="bg-gray-900 dark:bg-cinema-black rounded-lg p-4 border border-gray-700 dark:border-cinema-border">
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Generated Content:</h4>
                        <pre className="text-green-400 dark:text-cinema-teal text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-32 overflow-y-auto">
                          {JSON.stringify(experimentalPreview.content, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Sticky Apply Button */}
                  <div className="p-6 border-t border-gray-200 dark:border-cinema-border bg-gray-50 dark:bg-cinema-card transition-colors duration-300">
                    <button
                      onClick={handleApply}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      🚀 Apply Experimental Content
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TemplateSelector;