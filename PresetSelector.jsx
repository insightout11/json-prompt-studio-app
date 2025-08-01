import React, { useState } from 'react';
import usePromptStore from './store';
import { characterPresets } from './characterPresetsData';
import { scenePresets, sceneCategories } from './scenePresetsData';
import { actionPresets, actionCategories } from './actionPresetsData';
import { directorStyles, directorCategories } from './directorStylesData';
import { audioPresets, audioCategories } from './audioPresetsData';
import { processRandomElements } from './randomHelpers';

// Preset categorization
const PRESET_CATEGORIES = {
  // Character presets by category
  characters_professional: ['the-executive', 'young-professional', 'customer-service-rep', 'sales-leader', 'startup-founder', 'remote-worker', 'conference-speaker'],
  characters_lifestyle: ['fitness-enthusiast', 'coffee-shop-regular', 'shopping-expert', 'home-chef', 'morning-jogger', 'weekend-parent', 'social-media-user'],
  characters_service: ['restaurant-server', 'hotel-concierge', 'retail-associate', 'healthcare-worker', 'teacher-instructor', 'delivery-driver', 'event-coordinator'],
  characters_creative: ['cyber-artist', 'vr-explorer', 'drone-operator', 'street-artist', 'vintage-photographer', 'night-market-vendor', 'urban-witch', 'steampunk-maker', 'time-traveler'],
  characters_comedy: ['class-clown', 'dad-joke-enthusiast', 'oversharer', 'conspiracy-theorist', 'meme-lord', 'tiktok-dancer', 'influencer-wannabe', 'micromanager', 'office-prankster', 'meeting-rambler', 'lunch-thief', 'gym-show-off', 'parking-lot-vigilante', 'self-checkout-expert', 'weather-complainer'],
  characters_fantasy: ['luna-nightweaver', 'thorin-ironforge', 'lyralei-moonbow', 'pip-brightwhiskers'],
  characters_scifi: ['captain-nova-stark', 'zyx-quantum', 'dr-elena-vortex'],
  characters_historical: ['amara-desert-queen', 'bjorn-wave-walker'],
  characters_quirky: ['professor-bumblewood', 'jazz-midnight-barista'],
  characters_villains: ['shadow-magistrate', 'madame-velvet', 'chronos-breaker'],
  characters_mystical: ['echo-voidwhisper'],
  
  // Scene presets by category (using the new physical location categories)
  scenes_urban: sceneCategories.urban.presets,
  scenes_nature: sceneCategories.nature.presets,
  scenes_indoor: sceneCategories.indoor.presets,
  scenes_entertainment: sceneCategories.entertainment.presets,
  scenes_meme: sceneCategories.meme.presets,
  
  // Action presets by category
  actions_chase: actionCategories.chase.presets,
  actions_dialogue: actionCategories.dialogue.presets,
  actions_combat: actionCategories.combat.presets,
  actions_romance: actionCategories.romance.presets,
  actions_comedy: actionCategories.comedy.presets,
  
  // Director style presets by category
  style_precision: directorCategories.precision.presets,
  style_dialogue: directorCategories.dialogue.presets,
  style_movement: directorCategories.movement.presets,
  style_epic: directorCategories.epic.presets,
  style_genre: directorCategories.genre.presets,
  
  // Audio presets by category
  audio_music: audioCategories.music.presets,
  audio_effects: audioCategories.effects.presets
};

const TAB_LABELS = {
  characters: 'Characters',
  actions: 'Actions',
  scenes: 'Scenes', 
  style: 'Style',
  audio: 'Audio',
  trending: 'Trending'
};

const SUB_TAB_LABELS = {
  // Character sub-tabs
  characters_professional: 'Professional',
  characters_lifestyle: 'Lifestyle', 
  characters_service: 'Service',
  characters_creative: 'Creative',
  characters_comedy: 'Comedy',
  characters_fantasy: 'Fantasy',
  characters_scifi: 'Sci-Fi',
  characters_historical: 'Historical',
  characters_quirky: 'Quirky',
  characters_villains: 'Villains',
  characters_mystical: 'Mystical',
  
  // Action sub-tabs
  actions_chase: 'Chase & Pursuit 🏃‍♂️',
  actions_dialogue: 'Dialogue 💬',
  actions_combat: 'Combat ⚔️',
  actions_romance: 'Romance 💕',
  actions_comedy: 'Comedy 😂',
  
  // Scene sub-tabs (updated to match new categories)
  scenes_urban: 'Urban 🏙️',
  scenes_nature: 'Nature 🌲',
  scenes_indoor: 'Indoor 🏠',
  scenes_entertainment: 'Entertainment 🎭',
  scenes_meme: 'Memes 😂',
  
  // Style sub-tabs (director styles)
  style_precision: 'Precision Masters 🎯',
  style_dialogue: 'Dialogue Driven 💬',
  style_movement: 'Dynamic Movement 🎬',
  style_epic: 'Epic Scale 🌅',
  style_genre: 'Genre Masters 🎭',
  
  // Audio sub-tabs  
  audio_music: 'Music Styles 🎵',
  audio_effects: 'Sound Effects 🔊'
};

const PresetSelector = () => {
  const { applyCharacterPresetData, applyScenePresetData, setFieldValue } = usePromptStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [activeTab, setActiveTab] = useState('characters');
  const [activeSubTab, setActiveSubTab] = useState('characters_professional');

  // Get all presets data
  const allPresets = { ...characterPresets, ...actionPresets, ...scenePresets, ...directorStyles, ...audioPresets };

  const handlePresetSelect = (presetKey) => {
    setSelectedPreset(presetKey);
    const preset = allPresets[presetKey];
    setPreviewData(preset);
  };

  const handleApply = () => {
    if (selectedPreset && previewData) {
      // Process random elements before applying
      const processedData = processRandomElements(previewData);
      
      // Determine preset type and apply accordingly
      if (characterPresets[selectedPreset]) {
        applyCharacterPresetData(processedData);
      } else if (scenePresets[selectedPreset]) {
        applyScenePresetData(processedData);
      } else if (actionPresets[selectedPreset] || directorStyles[selectedPreset] || audioPresets[selectedPreset]) {
        // Apply action preset, director style, or audio preset fields directly to store
        Object.entries(processedData.fields || {}).forEach(([field, value]) => {
          setFieldValue(field, value);
        });
      }
      
      setShowModal(false);
      setSelectedPreset(null);
      setPreviewData(null);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedPreset(null);
    setPreviewData(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Set default sub-tab when main tab changes
    if (tab === 'characters') {
      setActiveSubTab('characters_professional');
    } else if (tab === 'actions') {
      setActiveSubTab('actions_chase');  
    } else if (tab === 'scenes') {
      setActiveSubTab('scenes_urban');
    } else if (tab === 'style') {
      setActiveSubTab('style_precision');
    } else if (tab === 'audio') {
      setActiveSubTab('audio_music');
    } else if (tab === 'trending') {
      // Mix of popular presets from both categories
      setActiveSubTab('trending');
    }
    setSelectedPreset(null);
    setPreviewData(null);
  };

  const handleSubTabChange = (subTab) => {
    setActiveSubTab(subTab);
    setSelectedPreset(null);
    setPreviewData(null);
  };

  const getFilteredPresets = () => {
    if (activeTab === 'trending') {
      // Return a mix of popular presets from all categories
      return [
        'the-executive', 'fitness-enthusiast', 'social-media-user', 'cyber-artist',
        'high-speed-chase', 'heartfelt-confession', 'first-kiss', 'slapstick-mishap',
        'city-street-chase', 'beach-rescue', 'coffee-shop', 'rooftop-confrontation',
        'kubrick-symmetry', 'tarantino-dialogue', 'nolan-complexity',
        'cinematic-orchestral', 'jazz-noir', 'urban-city'
      ];
    }
    
    return PRESET_CATEGORIES[activeSubTab] || [];
  };

  const getSubTabs = () => {
    if (activeTab === 'characters') {
      return ['characters_professional', 'characters_lifestyle', 'characters_service', 'characters_creative', 'characters_comedy', 'characters_fantasy', 'characters_scifi', 'characters_historical', 'characters_quirky', 'characters_villains', 'characters_mystical'];
    } else if (activeTab === 'actions') {
      return ['actions_chase', 'actions_dialogue', 'actions_combat', 'actions_romance', 'actions_comedy'];
    } else if (activeTab === 'scenes') {
      return ['scenes_urban', 'scenes_nature', 'scenes_indoor', 'scenes_entertainment', 'scenes_meme'];
    } else if (activeTab === 'style') {
      return ['style_precision', 'style_dialogue', 'style_movement', 'style_epic', 'style_genre'];
    } else if (activeTab === 'audio') {
      return ['audio_music', 'audio_effects'];
    }
    return [];
  };

  const getCategoryIcon = (category) => {
    const icons = {
      professional: '🏢',
      lifestyle: '🌟',
      service: '🤝', 
      creative: '🎨',
      comedy: '😂',
      fantasy: '🏰',
      scifi: '🚀',
      historical: '📜',
      quirky: '🎭',
      villains: '🦹',
      mystical: '🔮',
      urban: '🏙️',
      nature: '🌲',
      indoor: '🏠',
      entertainment: '🎭',
      meme: '😂',
      chase: '🏃‍♂️',
      dialogue: '💬',
      combat: '⚔️',
      romance: '💕',
      comedy: '😂',
      directors: '🎬',
      precision: '🎯',
      movement: '🎬',
      epic: '🌅',
      genre: '🎭',
      music: '🎵',
      'sound-effects': '🔊'
    };
    return icons[category] || '⭐';
  };

  const getCategoryColor = (category) => {
    const colors = {
      professional: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      lifestyle: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      service: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      creative: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      comedy: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      fantasy: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
      scifi: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
      historical: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      quirky: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      villains: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      mystical: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      urban: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300',
      nature: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      indoor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      entertainment: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
      meme: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      chase: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      dialogue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      combat: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      romance: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      comedy: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      directors: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      precision: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
      movement: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      epic: 'bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300',
      genre: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300',
      music: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
      'sound-effects': 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
  };

  return (
    <>
      {/* Preset Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white text-sm font-medium rounded-md transition-all duration-300 flex items-center space-x-2 h-10"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>Presets</span>
      </button>

      {/* Preset Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-xl dark:shadow-glow-soft max-w-5xl w-full max-h-[90vh] overflow-hidden border border-transparent dark:border-cinema-border transition-all duration-300">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-cinema-border">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-cinema-text">
                Choose a Preset
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

            {/* Main Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-cinema-border">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {Object.entries(TAB_LABELS).map(([tabKey, label]) => {
                  const presetCount = tabKey === 'trending' ? 18 : 
                    tabKey === 'characters' ? 45 : 
                    tabKey === 'actions' ? 22 :
                    tabKey === 'scenes' ? 38 :
                    tabKey === 'style' ? 12 :
                    tabKey === 'audio' ? 14 : 0;
                  return (
                    <button
                      key={tabKey}
                      onClick={() => handleTabChange(tabKey)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                        activeTab === tabKey
                          ? 'border-green-600 text-green-600 dark:border-green-400 dark:text-green-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text hover:border-gray-300 dark:hover:border-cinema-border'
                      }`}
                    >
                      {label}
                      <span className="ml-2 bg-gray-100 text-gray-900 dark:bg-cinema-card dark:text-cinema-text py-0.5 px-2.5 rounded-full text-xs transition-colors duration-300">
                        {presetCount}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sub-tab Navigation */}
            {activeTab !== 'trending' && (
              <div className="border-b border-gray-200 dark:border-cinema-border bg-gray-50 dark:bg-cinema-card/30">
                <nav className="flex flex-wrap space-x-4 px-6 py-2" aria-label="Sub-tabs">
                  {getSubTabs().map((subTabKey) => {
                    const label = SUB_TAB_LABELS[subTabKey];
                    const count = PRESET_CATEGORIES[subTabKey]?.length || 0;
                    return (
                      <button
                        key={subTabKey}
                        onClick={() => handleSubTabChange(subTabKey)}
                        className={`py-2 px-3 text-xs font-medium rounded-md transition-all duration-300 ${
                          activeSubTab === subTabKey
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'text-gray-600 hover:text-gray-800 dark:text-cinema-text-muted dark:hover:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border/50'
                        }`}
                      >
                        {label} ({count})
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}

            <div className="flex h-[60vh]">
              {/* Preset Grid */}
              <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-cinema-panel/30 transition-colors duration-300">
                {getFilteredPresets().length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getFilteredPresets().map((presetKey) => {
                      const preset = allPresets[presetKey];
                      if (!preset) return null;
                      
                      return (
                        <button
                          key={presetKey}
                          onClick={() => handlePresetSelect(presetKey)}
                          className={`p-4 border-2 rounded-lg transition-all duration-300 group text-left ${
                            selectedPreset === presetKey
                              ? 'border-green-600 bg-green-50 dark:border-green-400 dark:bg-green-900/10'
                              : 'border-gray-200 hover:border-gray-300 dark:border-cinema-border dark:hover:border-green-400/50 bg-white dark:bg-cinema-card hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl flex-shrink-0">{getCategoryIcon(preset.category)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 dark:text-cinema-text text-sm mb-1 truncate">
                                {preset.name}
                              </div>
                              <span className={`inline-block px-2 py-0.5 text-xs rounded-full mb-2 ${getCategoryColor(preset.category)}`}>
                                {preset.category}
                              </span>
                              <div className="text-xs text-gray-500 dark:text-cinema-text-muted line-clamp-2">
                                {preset.description}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {preset.tags.slice(0, 2).map((tag) => (
                                  <span key={tag} className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-cinema-border text-gray-600 dark:text-cinema-text-muted rounded">
                                    {tag}
                                  </span>
                                ))}
                                {preset.tags.length > 2 && (
                                  <span className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-cinema-border text-gray-600 dark:text-cinema-text-muted rounded">
                                    +{preset.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500 dark:text-cinema-text-muted">
                      <div className="text-4xl mb-4">⭐</div>
                      <div className="text-lg font-medium mb-2">No presets found</div>
                      <div className="text-sm">Try selecting a different category</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Panel */}
              {selectedPreset && previewData && (
                <div className="w-80 border-l border-gray-200 dark:border-cinema-border bg-gray-50 dark:bg-cinema-card flex flex-col transition-colors duration-300">
                  {/* Scrollable Content */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Preset Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-cinema-text flex items-center space-x-2">
                          <span className="text-2xl">{getCategoryIcon(previewData.category)}</span>
                          <span>{previewData.name}</span>
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-cinema-text-muted mt-1 transition-colors duration-300">
                          {previewData.description}
                        </p>
                      </div>

                      {/* Use Case */}
                      <div className="bg-white dark:bg-cinema-panel p-3 rounded-md border border-gray-200 dark:border-cinema-border transition-colors duration-300">
                        <div className="text-sm font-medium text-gray-900 dark:text-cinema-text mb-2">
                          Use Case:
                        </div>
                        <div className="text-sm text-gray-600 dark:text-cinema-text-muted">
                          {previewData.useCase}
                        </div>
                      </div>

                      {/* Custom Details */}
                      <div className="bg-white dark:bg-cinema-panel p-3 rounded-md border border-gray-200 dark:border-cinema-border transition-colors duration-300">
                        <div className="text-sm font-medium text-gray-900 dark:text-cinema-text mb-2">
                          Details:
                        </div>
                        <div className="text-sm text-gray-600 dark:text-cinema-text-muted">
                          {previewData.customDetails}
                        </div>
                      </div>

                      {/* Field Preview */}
                      <div className="bg-white dark:bg-cinema-panel p-3 rounded-md border border-gray-200 dark:border-cinema-border transition-colors duration-300">
                        <div className="text-sm font-medium text-gray-900 dark:text-cinema-text mb-2">
                          Will apply {Object.keys(previewData.fields).length} fields:
                        </div>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {Object.entries(previewData.fields).slice(0, 8).map(([key, value]) => (
                            <div key={key} className="text-xs text-gray-600 dark:text-cinema-text-muted">
                              <span className="font-medium">{key.replace(/_/g, ' ')}:</span> {value}
                            </div>
                          ))}
                          {Object.keys(previewData.fields).length > 8 && (
                            <div className="text-xs text-gray-500 dark:text-cinema-text-muted italic">
                              + {Object.keys(previewData.fields).length - 8} more fields...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sticky Apply Button */}
                  <div className="p-6 border-t border-gray-200 dark:border-cinema-border bg-gray-50 dark:bg-cinema-card transition-colors duration-300">
                    <button
                      onClick={handleApply}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium rounded-md transition-all duration-300"
                    >
                      Apply {
                        characterPresets[selectedPreset] ? 'Character' : 
                        actionPresets[selectedPreset] ? 'Action' :
                        directorStyles[selectedPreset] ? 'Style' :
                        audioPresets[selectedPreset] ? 'Audio' : 'Scene'
                      } Preset
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

export default PresetSelector;