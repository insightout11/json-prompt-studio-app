import React, { useState, useRef, useEffect } from 'react';
import usePromptStore from './store';

const LibrarySystem = () => {
  const { 
    savedCharacters, savedScenes, savedScenePacks, savedActions, 
    savedSettings, savedStyles, savedAudio,
    saveCharacter, saveScene, saveAction, saveSetting, saveStyle, saveAudio,
    loadCharacter, loadScene, loadAction, loadSetting, loadStyle, loadAudio,
    deleteCharacter, deleteScene, deleteAction, deleteSetting, deleteStyle, deleteAudio,
    exportData, loadScenePack, deleteScenePack, setFieldValue, clearAll, 
    applySceneWithMergeStrategy
  } = usePromptStore();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveType, setSaveType] = useState('character');
  const [saveName, setSaveName] = useState('');
  const [activeTab, setActiveTab] = useState('quick-actions');
  const [showScenePackModal, setShowScenePackModal] = useState(false);
  const [selectedScenePack, setSelectedScenePack] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Library categories with their respective data and handlers
  const libraryCategories = {
    characters: {
      icon: '👤',
      label: 'Characters',
      data: savedCharacters || [],
      saveHandler: saveCharacter,
      loadHandler: loadCharacter,
      deleteHandler: deleteCharacter,
      color: 'green'
    },
    actions: {
      icon: '🎬',
      label: 'Actions',
      data: savedActions || [],
      saveHandler: saveAction,
      loadHandler: loadAction,
      deleteHandler: deleteAction,
      color: 'blue'
    },
    settings: {
      icon: '📍',
      label: 'Settings',
      data: savedSettings || [],
      saveHandler: saveSetting,
      loadHandler: loadSetting,
      deleteHandler: deleteSetting,
      color: 'yellow'
    },
    styles: {
      icon: '🎨',
      label: 'Styles',
      data: savedStyles || [],
      saveHandler: saveStyle,
      loadHandler: loadStyle,
      deleteHandler: deleteStyle,
      color: 'purple'
    },
    audio: {
      icon: '🔊',
      label: 'Audio',
      data: savedAudio || [],
      saveHandler: saveAudio,
      loadHandler: loadAudio,
      deleteHandler: deleteAudio,
      color: 'pink'
    },
    scenes: {
      icon: '🎭',
      label: 'Scenes',
      data: savedScenes || [],
      saveHandler: saveScene,
      loadHandler: loadScene,
      deleteHandler: deleteScene,
      color: 'indigo'
    },
    'scene-packs': {
      icon: '📦',
      label: 'Packs',
      data: savedScenePacks || [],
      saveHandler: null, // Scene packs are handled differently
      loadHandler: null,
      deleteHandler: deleteScenePack,
      color: 'gray'
    }
  };

  const handleSave = () => {
    if (saveName.trim()) {
      const category = libraryCategories[saveType];
      if (category && category.saveHandler) {
        category.saveHandler(saveName.trim());
      }
      setSaveName('');
      setShowSaveModal(false);
      setShowDropdown(false);
    }
  };

  const openSaveModal = (type) => {
    setSaveType(type);
    setSaveName('');
    setShowSaveModal(true);
  };

  const handleLoadItem = (categoryKey, id) => {
    const category = libraryCategories[categoryKey];
    if (category && category.loadHandler) {
      category.loadHandler(id);
    }
    setShowDropdown(false);
  };

  const handleDeleteItem = (categoryKey, id) => {
    const category = libraryCategories[categoryKey];
    if (category && category.deleteHandler) {
      category.deleteHandler(id);
    }
  };

  // Handle scene pack operations
  const handleLoadScenePack = (packId) => {
    const pack = loadScenePack(packId);
    if (pack) {
      setSelectedScenePack(pack);
      setShowScenePackModal(true);
      setShowDropdown(false);
    }
  };

  const handleApplySceneFromPack = (scene, strategy = 'smart') => {
    if (scene.json && typeof scene.json === 'object') {
      applySceneWithMergeStrategy(scene.json, strategy);
      setShowScenePackModal(false);
      
      setTimeout(() => {
        const jsonSection = document.querySelector('.json-output-section');
        if (jsonSection) {
          jsonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getColorClasses = (color) => {
    const colorMap = {
      green: 'bg-green-500 hover:bg-green-600',
      blue: 'bg-blue-500 hover:bg-blue-600',
      yellow: 'bg-yellow-500 hover:bg-yellow-600',
      purple: 'bg-purple-500 hover:bg-purple-600',
      pink: 'bg-pink-500 hover:bg-pink-600',
      indigo: 'bg-indigo-500 hover:bg-indigo-600',
      gray: 'bg-gray-500 hover:bg-gray-600'
    };
    return colorMap[color] || 'bg-gray-500 hover:bg-gray-600';
  };

  const renderCategoryItems = (categoryKey) => {
    const category = libraryCategories[categoryKey];
    if (!category) return null;

    if (categoryKey === 'scene-packs') {
      return (
        <div className="space-y-2">
          {category.data.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-cinema-text-muted py-4 text-sm">
              No scene packs saved yet.
              <br />
              <span className="text-xs">Generate 5 scenes and save as a pack!</span>
            </div>
          ) : (
            category.data.map((pack) => (
              <div key={pack.id} className="bg-gray-50 dark:bg-cinema-card rounded-lg p-3 border border-gray-200 dark:border-cinema-border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-gray-900 dark:text-cinema-text truncate flex items-center space-x-2">
                    <span>{category.icon}</span>
                    <span>{pack.name}</span>
                  </h4>
                  <button
                    onClick={() => handleDeleteItem(categoryKey, pack.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-cinema-text-muted mb-2">
                  {formatDate(pack.timestamp)} • {pack.scenes.length} scenes
                </p>
                <button
                  onClick={() => handleLoadScenePack(pack.id)}
                  className="w-full px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-md transition-all"
                >
                  View Pack
                </button>
              </div>
            ))
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {category.data.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-cinema-text-muted py-4 text-sm">
            No saved {category.label.toLowerCase()} yet.
          </div>
        ) : (
          category.data.map((item) => (
            <div key={item.id} className="bg-gray-50 dark:bg-cinema-card rounded-lg p-3 border border-gray-200 dark:border-cinema-border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm text-gray-900 dark:text-cinema-text truncate flex items-center space-x-2">
                  <span>{category.icon}</span>
                  <span>{item.name}</span>
                </h4>
                <button
                  onClick={() => handleDeleteItem(categoryKey, item.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-cinema-text-muted mb-2">
                {formatDate(item.timestamp)}
              </p>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleLoadItem(categoryKey, item.id)}
                  className={`flex-1 px-2 py-1 ${getColorClasses(category.color)} text-white text-xs rounded-md transition-all`}
                >
                  Load
                </button>
                <button
                  onClick={() => {
                    exportData(categoryKey === 'scenes' ? 'scene' : categoryKey.slice(0, -1), item.id);
                    setShowDropdown(false);
                  }}
                  className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded-md transition-all"
                >
                  Export
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Dropdown Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-sm font-medium rounded-md transition-all duration-300 h-10 shadow-lg hover:shadow-xl"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
        </svg>
        <span>Library</span>
        <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Content */}
      {showDropdown && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-cinema-panel border border-gray-200 dark:border-cinema-border rounded-lg shadow-xl dark:shadow-glow-soft z-50 w-80 max-h-96 overflow-hidden">
          {/* Tabs */}
          <div className="flex flex-wrap border-b border-gray-200 dark:border-cinema-border">
            <button
              onClick={() => setActiveTab('quick-actions')}
              className={`px-2 py-2 text-xs font-medium transition-all ${
                activeTab === 'quick-actions'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text'
              }`}
            >
              Actions
            </button>
            {Object.entries(libraryCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-2 py-2 text-xs font-medium transition-all ${
                  activeTab === key
                    ? 'border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text'
                }`}
              >
                <span className="flex items-center space-x-1">
                  <span>{category.icon}</span>
                  <span className="hidden sm:inline">{category.label}</span>
                  <span className="text-xs">({category.data.length})</span>
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-3 max-h-80 overflow-y-auto">
            {activeTab === 'quick-actions' && (
              <div className="space-y-2">
                {/* Save Actions Row */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {Object.entries(libraryCategories).filter(([key]) => key !== 'scene-packs').map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => openSaveModal(key)}
                      className={`px-3 py-2 ${getColorClasses(category.color)} text-white text-xs font-medium rounded-md transition-all duration-200 flex items-center space-x-2`}
                    >
                      <span>{category.icon}</span>
                      <span>Save {category.label.slice(0, -1)}</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-cinema-border pt-2 mt-2">
                  <button
                    onClick={() => {
                      exportData('current');
                      setShowDropdown(false);
                    }}
                    className="w-full px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Export Current</span>
                  </button>

                  <button
                    onClick={() => {
                      exportData('all');
                      setShowDropdown(false);
                    }}
                    className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-all duration-200 flex items-center space-x-2 mt-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Export All (Backup)</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab !== 'quick-actions' && renderCategoryItems(activeTab)}
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-cinema-panel rounded-lg p-6 w-96 border border-transparent dark:border-cinema-border shadow-xl dark:shadow-glow-soft">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-cinema-text flex items-center space-x-2">
              <span>{libraryCategories[saveType]?.icon}</span>
              <span>Save {libraryCategories[saveType]?.label.slice(0, -1)}</span>
            </h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder={`Enter ${libraryCategories[saveType]?.label.slice(0, -1).toLowerCase()} name...`}
              className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 mb-4 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text"
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                disabled={!saveName.trim()}
                className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-cinema-border text-white rounded-md transition-all duration-300"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scene Pack Viewer Modal */}
      {showScenePackModal && selectedScenePack && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-xl dark:shadow-glow-soft max-w-4xl w-full max-h-[90vh] overflow-hidden border border-transparent dark:border-cinema-border">
            <div className="p-6 border-b border-gray-200 dark:border-cinema-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text">
                    💾 {selectedScenePack.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                    {formatDate(selectedScenePack.timestamp)} • {selectedScenePack.scenes.length} scenes
                  </p>
                </div>
                <button
                  onClick={() => setShowScenePackModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedScenePack.scenes.map((scene, index) => (
                  <div key={scene.id} className="bg-gray-50 dark:bg-cinema-card rounded-lg p-4 border border-gray-200 dark:border-cinema-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{scene.icon}</span>
                        <span className="font-medium text-gray-800 dark:text-cinema-text">{scene.type}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-cinema-text-muted">
                        Scene {index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-cinema-text-muted mb-4 line-clamp-3">
                      {scene.summary}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApplySceneFromPack(scene, 'smart')}
                        className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-md transition-all duration-200"
                        title="Smart merge - preserves context"
                      >
                        🧠 Smart
                      </button>
                      <button
                        onClick={() => handleApplySceneFromPack(scene, 'merge')}
                        className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-md transition-all duration-200"
                        title="Add to scene - keeps existing elements"
                      >
                        🔗 Add
                      </button>
                      <button
                        onClick={() => handleApplySceneFromPack(scene, 'replace')}
                        className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-md transition-all duration-200"
                        title="Replace all - clears current scene"
                      >
                        🔄 Replace
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibrarySystem;