import React, { useState, useMemo, useEffect } from 'react';
import usePromptStore from './store';
import { schema } from './schema';
import { allTemplates, isPresetTemplate, getTemplate } from './templates';
import ToggleSwitch from './ToggleSwitch';
import LoadingButton from './LoadingButton';
import aiApiService from './aiApiService';

const SceneBuilderChecklist = ({ onProjectChange, compact = false, isAdvancedMode, setIsAdvancedMode, showToast }) => {
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
    saveCharacter,
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
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [loadCategory, setLoadCategory] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [animatingCategories, setAnimatingCategories] = useState(new Set());
  const [expandSparkles, setExpandSparkles] = useState(new Set());
  const [loadGlowEffects, setLoadGlowEffects] = useState(new Set());
  const [previousSavedCounts, setPreviousSavedCounts] = useState({});
  const [categoryInputs, setCategoryInputs] = useState({
    characters: '',
    actions: '',
    settings: '',
    style: '',
    audio: ''
  });

  // Watch for activation of Load buttons (when content becomes available)
  useEffect(() => {
    const currentCounts = {
      characters: savedCharacters.length,
      actions: savedActions.length, 
      settings: savedSettings.length + savedScenes.length, // Settings can load scenes too
      style: savedStyles.length,
      audio: savedAudio.length
    };
    
    // Only proceed if we have previous counts to compare against
    if (Object.keys(previousSavedCounts).length > 0) {
      // Check for newly activated buttons (count went from 0 to >0)
      Object.keys(currentCounts).forEach(categoryKey => {
        const previousCount = previousSavedCounts[categoryKey] || 0;
        const currentCount = currentCounts[categoryKey];
        
        if (previousCount === 0 && currentCount > 0) {
          // Button just became active - trigger glow effect
          setLoadGlowEffects(prev => new Set([...prev, categoryKey]));
          
          // Remove glow effect after animation completes
          setTimeout(() => {
            setLoadGlowEffects(prev => {
              const newSet = new Set(prev);
              newSet.delete(categoryKey);
              return newSet;
            });
          }, 1000); // Match animation duration
        }
      });
    }
    
    setPreviousSavedCounts(currentCounts);
  }, [savedCharacters.length, savedActions.length, savedSettings.length, savedScenes.length, savedStyles.length, savedAudio.length]);

  // Loading state helpers
  const setLoading = (key, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [key]: isLoading }));
  };

  const isLoading = (key) => {
    return loadingStates[key] || false;
  };

  // Smart placeholder text for better user guidance
  const placeholderText = {
    characters: "e.g., A wise old wizard riding a giant turtle",
    actions: "e.g., Dancing through a field of glowing flowers", 
    settings: "e.g., On a floating island at golden hour",
    style: "e.g., Studio Ghibli animation, soft watercolors",
    audio: "e.g., Whispering wind with ambient synthesizers"
  };

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

      // Show success feedback
      if (showToast?.showSuccess) {
        showToast.showSuccess(`Template "${template.name}" applied successfully!`);
      }
    }
    
    setShowTemplateModal(false);
    setActiveCategory(null);
    setActiveSubcategory('recent'); // Reset to recent for next time
  };
  
  // Handle Load action - show selection modal
  const handleLoad = async (categoryKey) => {
    const loadKey = `load-${categoryKey}`;
    setLoading(loadKey, true);
    
    try {
      const categoryMap = {
        characters: { data: savedCharacters, loader: loadCharacter, label: 'Characters' },
        actions: { data: savedActions, loader: loadAction, label: 'Actions' },
        settings: { data: savedSettings, loader: loadSetting, label: 'Settings' },
        style: { data: savedStyles, loader: loadStyle, label: 'Styles' },
        audio: { data: savedAudio, loader: loadAudio, label: 'Audio' }
      };

      const category = categoryMap[categoryKey];
      
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (category && category.data && category.data.length > 0) {
        setLoadCategory(category);
        setShowLoadModal(true);
      } else if (categoryKey === 'settings' && savedScenes.length > 0) {
        // Fallback: if no saved settings, try loading the first scene for location
        loadScene(savedScenes[0].id);
        if (showToast?.showSuccess) {
          showToast.showSuccess(`Loaded scene as setting reference`);
        }
      } else {
        // Show feedback when no saved items exist
        if (showToast?.showWarning) {
          const messages = {
            characters: 'No saved characters yet. Create and save characters using the Library system or Pro Features.',
            actions: 'No saved actions yet. Create and save actions using the Library system.',
            settings: 'No saved settings or scenes yet. Create and save settings using the Library system.',
            style: 'No saved styles yet. Create and save styles using the Library system.',
            audio: 'No saved audio configurations yet. Create and save audio using the Library system.'
          };
          showToast.showWarning(messages[categoryKey] || `No saved ${category?.label?.toLowerCase() || 'items'} available.`);
        }
      }
    } finally {
      setLoading(loadKey, false);
    }
  };

  // Handle selection from load modal
  const handleLoadSelection = (itemId) => {
    if (loadCategory && loadCategory.loader) {
      const loadedItem = loadCategory.data.find(item => item.id === itemId);
      loadCategory.loader(itemId);
      setShowLoadModal(false);
      setLoadCategory(null);
      
      // Show success feedback
      if (showToast?.showSuccess && loadedItem) {
        showToast.showSuccess(`${loadCategory.label.slice(0, -1)} "${loadedItem.name}" loaded successfully!`);
      }
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

  // Load Modal Component - Shared between modes
  const LoadModal = () => {
    if (!showLoadModal || !loadCategory) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Select {loadCategory.label.slice(0, -1)} to Load
            </h3>
            <button
              onClick={() => {
                setShowLoadModal(false);
                setLoadCategory(null);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-2">
            {loadCategory.data.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLoadSelection(item.id)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {item.name || `${loadCategory.label.slice(0, -1)} ${item.id}`}
                </div>
                {item.description && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {item.description}
                  </div>
                )}
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Created: {new Date(item.timestamp).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                setShowLoadModal(false);
                setLoadCategory(null);
              }}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
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

  // Category input handlers
  const handleCategorySubmit = (categoryKey) => {
    const input = categoryInputs[categoryKey];
    if (input && input.trim()) {
      // Trigger green pulse animation
      setAnimatingCategories(prev => new Set([...prev, categoryKey]));
      setTimeout(() => {
        setAnimatingCategories(prev => {
          const newSet = new Set(prev);
          newSet.delete(categoryKey);
          return newSet;
        });
      }, 600); // Match animation duration
      
      // Direct submit - put exactly what user said into JSON
      // Map category to primary field
      const fieldMap = {
        characters: 'characters',
        actions: 'actions',
        settings: 'setting',
        style: 'style',
        audio: 'ambient_sound'
      };
      
      const field = fieldMap[categoryKey];
      if (field) {
        setFieldValue(field, input.trim());
        
        if (showToast?.showSuccess) {
          const category = sceneCategories[categoryKey];
          showToast.showSuccess(`${category?.label} "${input.trim()}" added to scene!`);
        }
        
        setCategoryInputs(prev => ({ ...prev, [categoryKey]: '' }));
      }
    }
  };

  const handleCategoryExpand = async (categoryKey) => {
    const input = categoryInputs[categoryKey];
    
    // Check if there's existing content to enhance
    const category = sceneCategories[categoryKey];
    const categoryFields = category?.fields || [];
    const hasExistingContent = categoryFields.some(field => 
      fieldValues[field] && fieldValues[field].trim() !== ''
    );
    
    // For progressive expansion, we need either input OR existing content
    if ((!input || !input.trim()) && !hasExistingContent) return;
    
    // Trigger sparkle effect
    setExpandSparkles(prev => new Set([...prev, categoryKey]));
    setTimeout(() => {
      setExpandSparkles(prev => {
        const newSet = new Set(prev);
        newSet.delete(categoryKey);
        return newSet;
      });
    }, 600);
    
    const expandKey = `${categoryKey}-expand`;
    setLoading(expandKey, true);
    
    try {
      // Check if this category already has expanded content (progressive expansion)
      const category = sceneCategories[categoryKey];
      const categoryFields = category?.fields || [];
      const hasExistingContent = categoryFields.some(field => 
        fieldValues[field] && fieldValues[field].trim() !== ''
      );
      
      // For progressive expansion without input, use existing primary field value or generic enhancement
      const enhancementInput = input?.trim() || (() => {
        const primaryFields = ['character', 'actions', 'setting', 'style', 'audio'];
        const primaryField = primaryFields.find(field => fieldValues[field]);
        return primaryField ? fieldValues[primaryField] : 'enhance existing details';
      })();
      
      // Use AI service to expand the description
      const response = await aiApiService.generateCategorySuggestions(categoryKey, {
        field_values: fieldValues
      }, enhancementInput, hasExistingContent);
      
      if (response.success) {
        // Apply expanded suggestions to the store
        Object.entries(response.suggestions).forEach(([field, value]) => {
          if (value && value.trim() !== '') {
            setFieldValue(field, value);
          }
        });
        
        if (showToast?.showSuccess) {
          const category = sceneCategories[categoryKey];
          const expandType = hasExistingContent ? 'enhanced with more detail' : 'expanded into detailed';
          const displayInput = input?.trim() || (hasExistingContent ? 'existing content' : 'details');
          showToast.showSuccess(`${hasExistingContent ? '🔍 Enhanced' : '✨ Expanded'} "${displayInput}" - ${expandType} ${category?.label.toLowerCase()}!`);
        }
        
        setCategoryInputs(prev => ({ ...prev, [categoryKey]: '' }));
      } else {
        if (showToast?.showError) {
          showToast.showError(`Failed to expand ${categoryKey}. Please try again.`);
        }
      }
    } catch (error) {
      console.error(`${categoryKey} expand error:`, error);
      if (showToast?.showError) {
        showToast.showError(`Failed to expand ${categoryKey}. Please try again.`);
      }
    } finally {
      setLoading(expandKey, false);
    }
  };

  
  // If in compact mode (for left panel), render ultra-compact version
  if (compact) {
    return (
      <>
        <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-lg dark:shadow-glow-soft p-4 lg:p-6 border border-transparent dark:border-cinema-border transition-all duration-300 mb-4">
          {/* Header - Matching JSON Output Style */}
          <div className="flex items-center justify-between mb-3 py-2 border-b border-gray-200 dark:border-cinema-border">
            <div className="flex items-center space-x-2 lg:space-x-4">
              <h2 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-cinema-text">
                Scene Builder
              </h2>
              <div className="text-xs text-gray-500 dark:text-cinema-text-muted hidden sm:block">
                Quick creation with templates
              </div>
            </div>
          </div>
          
          {/* Horizontal Category List */}
          <div className="space-y-4">
            {Object.entries(sceneCategories).map(([categoryKey, category]) => {
              const completion = getCategoryCompletion(categoryKey);
              
              return (
                <div key={categoryKey} className="bg-cinema-card rounded-lg shadow-lg dark:shadow-glow-soft p-4 border border-cinema-border transition-all duration-300">
                  {/* Full-width horizontal layout with proper alignment */}
                  <div className="flex items-center space-x-3">
                    {/* Left: Category Info - Fixed width */}
                    <div className="flex items-center space-x-2 w-28 flex-shrink-0">
                      <span className="text-base">{category.icon}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-cinema-text">
                        {category.label}
                      </span>
                    </div>
                    
                    {/* Center: Input Field with Status Indicator - Takes available space */}
                    <div className="flex items-center space-x-2 flex-1">
                      <div className="flex items-center justify-center w-4 flex-shrink-0">
                        <span 
                          className={`text-sm cursor-help transition-all duration-200 ${
                            animatingCategories.has(categoryKey) 
                              ? 'status-pulse' 
                              : completion.filled > 0 
                                ? 'text-cinema-teal dark:text-cinema-teal' 
                                : 'text-gray-400 dark:text-gray-500'
                          }`}
                          title={completion.filled > 0 ? 'Has content - click Submit to add more' : 'Empty section - click Submit to activate'}
                        >
                          {completion.filled > 0 ? '●' : '○'}
                        </span>
                      </div>
                    <div className="flex-1">
                      <textarea
                        value={categoryInputs[categoryKey] || ''}
                        onChange={(e) => setCategoryInputs(prev => ({ ...prev, [categoryKey]: e.target.value }))}
                        placeholder={placeholderText[categoryKey] || `Describe your ${category.label.toLowerCase()}...`}
                        className="w-full px-3 py-3 text-sm border border-gray-300 dark:border-cinema-border rounded bg-white dark:bg-cinema-panel text-gray-700 dark:text-cinema-text placeholder-gray-500 dark:placeholder-cinema-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none"
                        style={{ height: '3.5rem' }}
                        rows={1}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleCategorySubmit(categoryKey);
                          }
                        }}
                      />
                    </div>
                    </div>
                    
                    {/* Right: Action Button Groups with Separation */}
                    <div className="flex items-center space-x-6 flex-shrink-0">
                      {/* Primary Actions Group */}
                      <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleCategorySubmit(categoryKey)}
                        disabled={!categoryInputs[categoryKey]?.trim()}
                        className="px-2 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm rounded font-medium transition-all duration-200"
                        title="Add this element to your prompt"
                      >
                        Submit
                      </button>
                      
                      <LoadingButton
                        onClick={() => handleCategoryExpand(categoryKey)}
                        loading={isLoading(`${categoryKey}-expand`)}
                        disabled={(() => {
                          const hasInput = categoryInputs[categoryKey]?.trim();
                          const category = sceneCategories[categoryKey];
                          const categoryFields = category?.fields || [];
                          const hasExistingContent = categoryFields.some(field => 
                            fieldValues[field] && fieldValues[field].trim() !== ''
                          );
                          // Enable if there's input OR if there's existing content to enhance
                          return !hasInput && !hasExistingContent;
                        })()}
                        className={`relative px-2 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm rounded font-medium transition-all duration-200 ${
                          expandSparkles.has(categoryKey) ? 'expand-sparkle' : ''
                        }`}
                        title={(() => {
                          const category = sceneCategories[categoryKey];
                          const categoryFields = category?.fields || [];
                          const hasExistingContent = categoryFields.some(field => 
                            fieldValues[field] && fieldValues[field].trim() !== ''
                          );
                          return hasExistingContent ? "Enhance with even more detail" : "Let AI add creative details";
                        })()}
                        loadingText="..."
                      >
                        {(() => {
                          const category = sceneCategories[categoryKey];
                          const categoryFields = category?.fields || [];
                          const hasExistingContent = categoryFields.some(field => 
                            fieldValues[field] && fieldValues[field].trim() !== ''
                          );
                          return hasExistingContent ? "Enhance" : "Expand";
                        })()}
                      </LoadingButton>
                      </div>
                      
                      {/* Secondary Actions Group */}
                      <div className="flex items-center space-x-3">
                      <LoadingButton
                        onClick={() => handleLoad(categoryKey)}
                        loading={isLoading(`load-${categoryKey}`)}
                        disabled={
                          (categoryKey === 'characters' && savedCharacters.length === 0) || 
                          (categoryKey === 'actions' && savedActions.length === 0) ||
                          (categoryKey === 'settings' && savedSettings.length === 0 && savedScenes.length === 0) ||
                          (categoryKey === 'style' && savedStyles.length === 0) ||
                          (categoryKey === 'audio' && savedAudio.length === 0)
                        }
                        className={`px-2 py-2 bg-cinema-teal hover:bg-cinema-teal/90 hover:shadow-lg hover:shadow-cinema-teal/30 disabled:bg-cinema-teal/30 disabled:border-cinema-teal/40 disabled:text-cinema-teal disabled:cursor-not-allowed text-white disabled:text-white text-sm rounded font-medium transition-all duration-200 border border-transparent disabled:border disabled:hover:shadow-none ${
                          loadGlowEffects.has(categoryKey) ? 'load-activation-glow' : ''
                        }`}
                        title={(() => {
                          const isDisabled = (categoryKey === 'characters' && savedCharacters.length === 0) || 
                                           (categoryKey === 'actions' && savedActions.length === 0) ||
                                           (categoryKey === 'settings' && savedSettings.length === 0 && savedScenes.length === 0) ||
                                           (categoryKey === 'style' && savedStyles.length === 0) ||
                                           (categoryKey === 'audio' && savedAudio.length === 0);
                          
                          if (isDisabled) {
                            const messages = {
                              'characters': 'Save a character first to load it here',
                              'actions': 'Save an action first to load it here', 
                              'settings': 'Save a setting first to load it here',
                              'style': 'Save a style first to load it here',
                              'audio': 'Save audio settings first to load them here'
                            };
                            return messages[categoryKey] || 'Save something first to load it';
                          }
                          
                          return `Load saved ${sceneCategories[categoryKey]?.label?.toLowerCase() || categoryKey} from your library`;
                        })()}
                        loadingText="..."
                      >
                        Load
                      </LoadingButton>
                      
                      <button
                        onClick={() => {
                          setActiveCategory(categoryKey);
                          setShowTemplateModal(true);
                        }}
                        disabled={Object.keys(category.templates).length === 0}
                        className="px-2 py-2 bg-purple-700 hover:bg-purple-800 hover:shadow-lg hover:shadow-purple-500/20 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm rounded font-medium transition-all duration-200"
                        title="Insert a preset idea"
                      >
                        Template
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Template Selection Modal */}
        <TemplateModal />
        
        {/* Load Selection Modal - Shared between compact and standard modes */}
        <LoadModal />
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
                
                {/* Three Action Buttons - Stack vertically on mobile */}
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                  <LoadingButton
                    onClick={() => handleLoad(categoryKey)}
                    loading={isLoading(`load-${categoryKey}`)}
                    disabled={
                      (categoryKey === 'characters' && savedCharacters.length === 0) || 
                      (categoryKey === 'actions' && savedActions.length === 0) ||
                      (categoryKey === 'settings' && savedSettings.length === 0 && savedScenes.length === 0) ||
                      (categoryKey === 'style' && savedStyles.length === 0) ||
                      (categoryKey === 'audio' && savedAudio.length === 0)
                    }
                    className="flex-1 px-2 py-2 md:py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
                    title={
                      (categoryKey === 'characters' && savedCharacters.length === 0) ? 
                      'No saved characters. Create and save characters first using the Library System.' :
                      `Load saved ${category.label.toLowerCase()}`
                    }
                    loadingText="Loading..."
                  >
                    Load
                  </LoadingButton>
                  <button
                    onClick={() => {
                      setActiveCategory(categoryKey);
                      setShowTemplateModal(true);
                    }}
                    disabled={Object.keys(category.templates).length === 0}
                    className="flex-1 px-2 py-2 md:py-1.5 bg-purple-700 hover:bg-purple-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs rounded transition-colors flex items-center justify-center"
                  >
                    Template
                  </button>
                  <button
                    onClick={() => handleCreate(categoryKey)}
                    className="flex-1 px-2 py-2 md:py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded transition-colors flex items-center justify-center"
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
      
      {/* Load Selection Modal - Shared between compact and standard modes */}
      <LoadModal />
    </>
  );
};

export default SceneBuilderChecklist;