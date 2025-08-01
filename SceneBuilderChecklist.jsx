import React, { useState, useMemo } from 'react';
import usePromptStore from './store';
import { schema } from './schema';
import { allTemplates, isPresetTemplate, getTemplate } from './templates';
import ToggleSwitch from './ToggleSwitch';

const SceneBuilderChecklist = ({ onProjectChange, compact = false, isAdvancedMode, setIsAdvancedMode }) => {
  const { 
    enabledFields, 
    fieldValues, 
    expandedCategories,
    savedCharacters, 
    savedScenes,
    savedActions,
    savedSettings,
    savedStyles,
    savedAudio,
    currentProject,
    toggleCategory,
    loadCharacter,
    loadScene,
    loadAction,
    loadSetting,
    loadStyle,
    loadAudio,
    setFieldValue,
    randomizeCharacterFields,
    randomizeLocationBased,
    randomizeCinematicStyle,
    applyProjectStyle,
    applyCharacterPresetData,
    applyScenePresetData,
    recordTemplateUsage,
    getRecentTemplates,
    getMostUsedTemplates
  } = usePromptStore();
  
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState('recent');

  // Define the 5 main categories for the compact scene builder
  const sceneCategories = {
    characters: {
      icon: '🧍',
      label: 'Characters',
      description: 'People in your scene',
      templates: Object.fromEntries(
        Object.entries(allTemplates).filter(([key, template]) => 
          template.isPreset && template.icon === '👤'
        )
      ),
      fields: ['characters', 'character_type', 'character_name', 'age', 'gender']
    },
    actions: {
      icon: '🎬', 
      label: 'Actions',
      description: 'What\'s happening',
      templates: Object.fromEntries(
        Object.entries(allTemplates).filter(([key, template]) => 
          template.isPreset && template.icon === '🎬'
        )
      ),
      fields: ['actions', 'dialogue', 'scene']
    },
    settings: {
      icon: '📍',
      label: 'Setting', 
      description: 'Where it takes place',
      templates: Object.fromEntries(
        Object.entries(allTemplates).filter(([key, template]) => 
          template.isPreset && template.icon === '📍'
        )
      ),
      fields: ['setting', 'time_of_day', 'environment', 'weather']
    },
    style: {
      icon: '🎨',
      label: 'Style',
      description: 'Visual aesthetic & directors',
      templates: Object.fromEntries(
        Object.entries(allTemplates).filter(([key, template]) => 
          template.isPreset && template.icon === '🎨'
        )
      ),
      fields: ['camera_angle', 'lighting_type', 'style', 'color_palette']
    },
    audio: {
      icon: '🔊',
      label: 'Audio',
      description: 'Sound design',
      templates: Object.fromEntries(
        Object.entries(allTemplates).filter(([key, template]) => 
          template.isPreset && template.icon === '🔊'
        )
      ),
      fields: ['music_style', 'sound_effects', 'audio_mood']
    }
  };

  // Template subcategory definitions for enhanced discovery
  const templateSubcategories = {
    characters: {
      recent: { icon: '🕘', label: 'Recent / Most Used', description: 'Your recently used character templates' },
      humans: { icon: '🧑', label: 'Humans', description: 'Human characters and people', categories: ['humans', 'human', 'professional', 'casual'], tags: ['human', 'person', 'people', 'realistic', 'everyday'] },
      commercial: { icon: '💼', label: 'Commercial / Professional', description: 'Business and professional characters', categories: ['commercial', 'professional', 'business'], tags: ['business', 'corporate', 'professional', 'executive', 'commercial', 'workplace'] },
      fun: { icon: '😜', label: 'Fun / Meme / Whimsical', description: 'Playful and humorous characters', categories: ['fun', 'meme', 'whimsical'], tags: ['fun', 'meme', 'whimsical', 'silly', 'cartoon', 'playful', 'humorous', 'quirky'] },
      creatures: { icon: '👾', label: 'Creatures / Supernatural', description: 'Fantasy and supernatural beings', categories: ['creatures', 'creature', 'supernatural', 'fantasy'], tags: ['creature', 'supernatural', 'fantasy', 'monster', 'alien', 'mythical', 'magical', 'otherworldly'] },
      animals: { icon: '🐶', label: 'Animals / Nature', description: 'Animals and nature-based characters', categories: ['animals', 'animal', 'nature'], tags: ['animal', 'pet', 'wildlife', 'nature', 'creature', 'mammal', 'bird', 'wild'] }
    },
    actions: {
      recent: { icon: '🕘', label: 'Recent / Most Used', description: 'Your recently used action templates' },
      poses: { icon: '🧍', label: 'Poses & Gestures', description: 'Static poses and hand gestures', categories: ['pose', 'gesture'], tags: ['pose', 'gesture', 'stance', 'posture', 'static', 'position', 'standing', 'sitting'] },
      expressions: { icon: '🎭', label: 'Expressions / Reactions', description: 'Facial expressions and emotional reactions', categories: ['expression', 'reaction', 'emotion'], tags: ['expression', 'emotion', 'reaction', 'facial', 'feeling', 'mood', 'emotional'] },
      dynamic: { icon: '🎮', label: 'Dynamic / Movement', description: 'Active movements and motion', categories: ['movement', 'dynamic', 'chase', 'motion'], tags: ['movement', 'dynamic', 'action', 'chase', 'running', 'jumping', 'dancing', 'active'] },
      thinking: { icon: '🧠', label: 'Thinking / Creating', description: 'Thoughtful and creative actions', categories: ['thinking', 'creating', 'working'], tags: ['thinking', 'creative', 'working', 'studying', 'writing', 'painting', 'designing', 'contemplating'] },
      conflict: { icon: '💥', label: 'Conflict / Impact', description: 'Combat and high-impact actions', categories: ['conflict', 'combat', 'impact'], tags: ['conflict', 'combat', 'fight', 'impact', 'battle', 'violence', 'aggressive', 'destructive'] }
    },
    settings: {
      recent: { icon: '🕘', label: 'Recent / Most Used', description: 'Your recently used setting templates' },
      urban: { icon: '🏙', label: 'Urban / Modern', description: 'City and modern environments', categories: ['urban', 'modern', 'city'], tags: ['urban', 'city', 'modern', 'street', 'building', 'downtown', 'metropolitan', 'contemporary'] },
      nature: { icon: '🏞', label: 'Nature / Scenic', description: 'Natural landscapes and scenic views', categories: ['nature', 'scenic', 'landscape'], tags: ['nature', 'scenic', 'landscape', 'outdoor', 'forest', 'mountain', 'beach', 'wilderness'] },
      historical: { icon: '🏛', label: 'Historical / Fantasy', description: 'Historical and fantasy settings', categories: ['historical', 'fantasy', 'period'], tags: ['historical', 'fantasy', 'medieval', 'ancient', 'castle', 'period', 'mythical', 'legendary'] },
      scifi: { icon: '🚀', label: 'Sci-Fi / Futuristic', description: 'Science fiction and futuristic environments', categories: ['scifi', 'futuristic', 'space'], tags: ['scifi', 'futuristic', 'space', 'technology', 'cyberpunk', 'alien', 'spaceship', 'high-tech'] },
      abstract: { icon: '📦', label: 'Abstract / Surreal', description: 'Abstract and surreal environments', categories: ['abstract', 'surreal', 'conceptual'], tags: ['abstract', 'surreal', 'dreamlike', 'conceptual', 'impossible', 'floating', 'geometric', 'otherworldly'] }
    },
    style: {
      recent: { icon: '🕘', label: 'Recent / Most Used', description: 'Your recently used style templates' },
      directors: { icon: '🎬', label: 'Directors / Influences', description: 'Famous director styles and influences', categories: ['directors', 'auteur'], tags: ['kubrick', 'tarantino', 'anderson', 'nolan', 'miyazaki', 'spielberg', 'fincher', 'burton', 'scorsese'] },
      aesthetics: { icon: '🎭', label: 'Visual Aesthetics', description: 'Visual aesthetic styles', categories: ['aesthetic', 'visual', 'mood'], tags: ['gothic', 'pastel', 'cyberpunk', 'minimalist', 'vintage', 'industrial', 'bohemian', 'luxury'] },
      art: { icon: '🖼️', label: 'Art & Illustration Styles', description: 'Artistic and illustration styles', categories: ['art', 'illustration', 'artistic'], tags: ['watercolor', '3d', 'sketch', 'painting', 'digital', 'pencil', 'oil', 'vector', 'comic'] },
      genre: { icon: '🎞️', label: 'Genre-Based Styles', description: 'Genre-specific visual styles', categories: ['genre', 'cinematic'], tags: ['noir', 'anime', 'vaporwave', 'horror', 'western', 'musical', 'documentary', 'thriller'] },
      popculture: { icon: '👕', label: 'Pop Culture / Brand Parodies', description: 'Pop culture and brand-inspired styles', categories: ['popculture', 'brand', 'parody'], tags: ['parody', 'brand', 'meme', 'trending', 'viral', 'superhero', 'mascot', 'celebrity'] }
    },
    audio: {
      recent: { icon: '🕘', label: 'Recent / Most Used', description: 'Your recently used audio templates' },
      cinematic: { icon: '🎥', label: 'Cinematic Score', description: 'Epic, orchestral, and suspenseful music', categories: ['cinematic', 'score', 'orchestral'], tags: ['epic', 'orchestral', 'suspense', 'dramatic', 'cinematic', 'heroic', 'battle', 'emotional'] },
      dialogue: { icon: '🗣️', label: 'Dialogue / Voice Styles', description: 'Narration, dialogue, and voice styles', categories: ['dialogue', 'voice', 'narration'], tags: ['narration', 'dialogue', 'voice', 'sarcastic', 'whispered', 'commentary', 'storytelling'] },
      atmospheric: { icon: '🌌', label: 'Atmospheric / Ambient', description: 'Environmental and ambient sounds', categories: ['atmospheric', 'ambient', 'environmental'], tags: ['wind', 'crowd', 'forest', 'ambient', 'atmospheric', 'rain', 'ocean', 'nature'] },
      comedy: { icon: '🎉', label: 'Comedy / Quirky', description: 'Comedic and quirky sound effects', categories: ['comedy', 'quirky', 'humorous'], tags: ['comedy', 'cartoon', 'sitcom', 'funny', 'quirky', 'silly', 'whimsical', 'playful'] },
      fantasy: { icon: '🧙‍♂️', label: 'Fantasy / Magical / Mythic', description: 'Magical and mythical audio', categories: ['fantasy', 'magical', 'mythic'], tags: ['fantasy', 'magical', 'spells', 'harp', 'mythic', 'enchanted', 'mystical', 'otherworldly'] }
    }
  };

  // Function to categorize templates based on category and tags
  const categorizeTemplates = (categoryKey, subcategoryKey, templates) => {
    if (subcategoryKey === 'recent') {
      // Get recent/most used templates
      const recentTemplates = getRecentTemplates(categoryKey, 12);
      const mostUsedTemplates = getMostUsedTemplates(categoryKey, 12);
      
      // Combine and deduplicate, prioritizing recent over most used
      const combinedTemplates = [...recentTemplates];
      mostUsedTemplates.forEach(mostUsed => {
        if (!combinedTemplates.find(recent => recent.templateKey === mostUsed.templateKey)) {
          combinedTemplates.push(mostUsed);
        }
      });
      
      // Return template objects
      return combinedTemplates
        .slice(0, 12)
        .map(usage => templates[usage.templateKey])
        .filter(template => template);
    }
    
    const subcategory = templateSubcategories[categoryKey][subcategoryKey];
    if (!subcategory) return [];
    
    return Object.entries(templates).filter(([key, template]) => {
      // Check if template category matches
      const categoryMatch = subcategory.categories?.includes(template.category);
      
      // Check if template tags match
      const tagMatch = subcategory.tags?.some(tag => 
        template.tags?.some(templateTag => 
          templateTag.toLowerCase().includes(tag.toLowerCase()) || 
          tag.toLowerCase().includes(templateTag.toLowerCase())
        )
      );
      
      return categoryMatch || tagMatch;
    }).map(([key, template]) => template);
  };

  // Calculate simple completion percentage for each category
  const getCategoryCompletion = (categoryKey) => {
    const category = sceneCategories[categoryKey];
    if (!category) return { filled: 0, total: 0, percentage: 0 };
    
    const categoryFields = category.fields.filter(field => enabledFields.has && enabledFields.has(field));
    const filledFields = categoryFields.filter(field => {
      const value = fieldValues[field];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.trim() !== '';
      return value !== null && value !== undefined;
    });
    
    return {
      filled: filledFields.length,
      total: categoryFields.length, 
      percentage: categoryFields.length > 0 ? Math.round((filledFields.length / categoryFields.length) * 100) : 0
    };
  };

  // Handle template selection
  const handleTemplateSelect = (categoryKey, templateKey) => {
    const category = sceneCategories[categoryKey];
    const template = category.templates[templateKey];
    
    if (template && template.fields) {
      // Record template usage for recent/most used tracking
      recordTemplateUsage(templateKey, categoryKey);
      
      // Track which categories should be expanded based on template fields
      const categoriesToExpand = new Set();
      
      // Apply template fields and find their categories
      Object.entries(template.fields).forEach(([field, value]) => {
        setFieldValue(field, value);
        
        // Find which category this field belongs to and mark for expansion
        schema.categories.forEach(schemaCategory => {
          if (schemaCategory.fields.some(schemaField => schemaField.key === field)) {
            categoriesToExpand.add(schemaCategory.id);
          }
        });
      });
      
      // Expand the relevant categories in the dropdown if they're not already expanded
      categoriesToExpand.forEach(categoryId => {
        if (!expandedCategories.has(categoryId)) {
          toggleCategory(categoryId);
        }
      });
    }
    
    setShowTemplateModal(false);
    setActiveCategory(null);
    setActiveSubcategory('recent'); // Reset to recent for next time
  };
  
  // Handle Load action
  const handleLoad = (categoryKey) => {
    const categoryMap = {
      characters: { data: savedCharacters, loader: loadCharacter },
      actions: { data: savedActions, loader: loadAction },
      settings: { data: savedSettings, loader: loadSetting },
      style: { data: savedStyles, loader: loadStyle },
      audio: { data: savedAudio, loader: loadAudio }
    };

    const category = categoryMap[categoryKey];
    if (category && category.data && category.data.length > 0) {
      category.loader(category.data[0].id);
    } else if (categoryKey === 'settings' && savedScenes.length > 0) {
      // Fallback: if no saved settings, try loading the first scene for location
      loadScene(savedScenes[0].id);
    }
  };
  
  // Handle Create action - expand relevant form fields
  const handleCreate = (categoryKey) => {
    const category = sceneCategories[categoryKey];
    // This would expand/focus the relevant form sections
    // For now, we'll just scroll to the form area
    const formSection = document.querySelector('.json-output-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Enhanced Template Modal Component with Categories
  const TemplateModal = () => {
    if (!showTemplateModal || !activeCategory) return null;
    
    const category = sceneCategories[activeCategory];
    const subcategories = templateSubcategories[activeCategory] || {};
    const categorizedTemplates = categorizeTemplates(activeCategory, activeSubcategory, category.templates);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-cinema-border">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-cinema-text">
                {category.icon} {category.label} Templates
              </h3>
              <p className="text-xs text-gray-600 dark:text-cinema-text-muted mt-1">
                {subcategories[activeSubcategory]?.description || 'Browse available templates'}
              </p>
            </div>
            <button
              onClick={() => {
                setShowTemplateModal(false);
                setActiveSubcategory('recent');
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-cinema-text"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Subcategory Tabs */}
          <div className="border-b border-gray-200 dark:border-cinema-border">
            <div className="flex flex-wrap px-4">
              {Object.entries(subcategories).map(([subcategoryKey, subcategory]) => {
                const templateCount = categorizeTemplates(activeCategory, subcategoryKey, category.templates).length;
                
                return (
                  <button
                    key={subcategoryKey}
                    onClick={() => setActiveSubcategory(subcategoryKey)}
                    className={`flex-shrink-0 px-3 py-3 text-sm font-medium border-b-2 transition-all duration-200 flex items-center space-x-2 ${
                      activeSubcategory === subcategoryKey
                        ? 'border-green-500 text-green-600 dark:border-green-400 dark:text-green-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text hover:border-gray-300'
                    }`}
                  >
                    <span className="text-base">{subcategory.icon}</span>
                    <span className="hidden sm:inline">{subcategory.label}</span>
                    <span className="text-xs bg-gray-100 dark:bg-cinema-border px-1.5 py-0.5 rounded-full">
                      {templateCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Template Grid */}
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            {categorizedTemplates.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-3">
                {categorizedTemplates.map((template, index) => {
                  // Handle both template objects and template key strings
                  const templateKey = template.id || Object.keys(category.templates).find(key => category.templates[key] === template);
                  
                  return (
                    <button
                      key={templateKey || index}
                      onClick={() => handleTemplateSelect(activeCategory, templateKey)}
                      className="p-3 border border-gray-200 dark:border-cinema-border rounded-lg hover:border-green-400 transition-colors text-left"
                    >
                      <div className="font-medium text-sm text-gray-900 dark:text-cinema-text mb-1">
                        {template.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-cinema-text-muted line-clamp-2 mb-2">
                        {template.description}
                      </div>
                      {template.useCase && (
                        <div className="text-xs text-blue-600 dark:text-blue-400 mb-2 font-medium">
                          💡 {template.useCase}
                        </div>
                      )}
                      {template.tags && (
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-cinema-border text-gray-600 dark:text-cinema-text-muted rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h4 className="text-lg font-medium text-gray-700 dark:text-cinema-text mb-2">
                  No templates found
                </h4>
                <p className="text-sm text-gray-500 dark:text-cinema-text-muted max-w-md">
                  {activeSubcategory === 'recent' 
                    ? `No recent ${category.label.toLowerCase()} templates yet. Use some templates to see them here!`
                    : `No templates available in this category yet. Try browsing other categories.`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Removed redundant mode switching - handled by main App component
  
  const handleAdvancedCreate = (categoryKey) => {
    // Notify parent to switch to advanced mode
    if (onProjectChange && typeof onProjectChange === 'function') {
      onProjectChange({ type: 'switchToAdvanced', category: categoryKey });
    }
    
    // Small delay to let the state update, then scroll
    setTimeout(() => {
      const formSection = document.querySelector('.json-output-section');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  // If in compact mode (for left panel), render ultra-compact version
  if (compact) {
    return (
      <>
        <div className="bg-white dark:bg-cinema-card rounded-lg border border-gray-200 dark:border-cinema-border p-3 shadow-sm mb-4">
          {/* Ultra-Compact Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-base">🎬</span>
              <div>
                <span className="text-sm font-semibold text-gray-800 dark:text-cinema-text">
                  Scene Builder
                </span>
                <div className="text-xs text-gray-500 dark:text-cinema-text-muted">
                  Quick creation with templates
                </div>
              </div>
            </div>
            
            {/* Simple/Advanced Mode Toggle */}
            {setIsAdvancedMode && (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {isAdvancedMode ? '🔧 Advanced' : '📝 Simple'}
                </span>
                <ToggleSwitch
                  enabled={isAdvancedMode}
                  onToggle={setIsAdvancedMode}
                  size="small"
                  color="blue"
                  labelPosition="none"
                />
              </div>
            )}
          </div>
          
          {/* Ultra-Compact Horizontal Category List */}
          <div className="space-y-2">
            {Object.entries(sceneCategories).map(([categoryKey, category]) => {
              const completion = getCategoryCompletion(categoryKey);
              
              return (
                <div key={categoryKey} className="bg-gray-50 dark:bg-cinema-panel rounded-md p-2">
                  {/* Single Row Layout */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                      <span className="text-sm">{category.icon}</span>
                      <div className="flex-1">
                        <span className="text-xs font-medium text-gray-700 dark:text-cinema-text">
                          {category.label}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-cinema-text-muted ml-2">
                          {completion.percentage}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleLoad(categoryKey)}
                        disabled={
                          (categoryKey === 'characters' && savedCharacters.length === 0) || 
                          (categoryKey === 'actions' && savedActions.length === 0) ||
                          (categoryKey === 'settings' && savedSettings.length === 0 && savedScenes.length === 0) ||
                          (categoryKey === 'style' && savedStyles.length === 0) ||
                          (categoryKey === 'audio' && savedAudio.length === 0)
                        }
                        className="px-3 py-3 lg:py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm lg:text-xs rounded transition-colors min-h-[44px] lg:min-h-0 flex items-center justify-center"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => {
                          setActiveCategory(categoryKey);
                          setShowTemplateModal(true);
                        }}
                        disabled={Object.keys(category.templates).length === 0}
                        className="px-3 py-3 lg:py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm lg:text-xs rounded transition-colors min-h-[44px] lg:min-h-0 flex items-center justify-center"
                      >
                        Template
                      </button>
                      <button
                        onClick={() => handleAdvancedCreate(categoryKey)}
                        className="px-3 py-3 lg:py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-sm lg:text-xs rounded transition-colors min-h-[44px] lg:min-h-0 flex items-center justify-center"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Template Selection Modal */}
        <TemplateModal />
      </>
    );
  }
  
  // Standard mode (for right panel)
  return (
    <>
      <div className="bg-white dark:bg-cinema-card rounded-lg border border-gray-200 dark:border-cinema-border p-4 shadow-sm">
        {/* Standard Header */}
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-cinema-text flex items-center justify-center">
            <span className="mr-2">🎬</span>
            Scene Builder
          </h3>
          <p className="text-xs text-gray-600 dark:text-cinema-text-muted mt-1">
            Build your scene with templates, saved content, or manual creation
          </p>
        </div>

        {/* Standard 5-Category Grid */}
        <div className="space-y-3">
          {Object.entries(sceneCategories).map(([categoryKey, category]) => {
            const completion = getCategoryCompletion(categoryKey);
            
            return (
              <div key={categoryKey} className="border border-gray-200 dark:border-cinema-border rounded-md p-3">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{category.icon}</span>
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-cinema-text">
                        {category.label}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-cinema-text-muted">
                        {category.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-cinema-text-muted text-right">
                    <div className="font-medium">{completion.percentage}%</div>
                    <div>{completion.filled}/{completion.total}</div>
                  </div>
                </div>
                
                {/* Three Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleLoad(categoryKey)}
                    disabled={
                      (categoryKey === 'characters' && savedCharacters.length === 0) || 
                      (categoryKey === 'actions' && savedActions.length === 0) ||
                      (categoryKey === 'settings' && savedSettings.length === 0 && savedScenes.length === 0) ||
                      (categoryKey === 'style' && savedStyles.length === 0) ||
                      (categoryKey === 'audio' && savedAudio.length === 0)
                    }
                    className="flex-1 px-2 py-3 lg:py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm lg:text-xs rounded transition-colors min-h-[44px] lg:min-h-0 flex items-center justify-center"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => {
                      setActiveCategory(categoryKey);
                      setShowTemplateModal(true);
                    }}
                    disabled={Object.keys(category.templates).length === 0}
                    className="flex-1 px-2 py-3 lg:py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm lg:text-xs rounded transition-colors min-h-[44px] lg:min-h-0 flex items-center justify-center"
                  >
                    Template
                  </button>
                  <button
                    onClick={() => handleCreate(categoryKey)}
                    className="flex-1 px-2 py-3 lg:py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-sm lg:text-xs rounded transition-colors min-h-[44px] lg:min-h-0 flex items-center justify-center"
                  >
                    Create
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Template Selection Modal */}
      <TemplateModal />
    </>
  );
};

export default SceneBuilderChecklist;