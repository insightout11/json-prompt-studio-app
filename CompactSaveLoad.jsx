import React, { useState, useRef, useEffect } from 'react';
import usePromptStore from './store';

const CompactSaveLoad = () => {
  const { 
    savedCharacters, savedScenes, savedScenePacks, saveCharacter, saveScene, 
    loadCharacter, loadScene, deleteCharacter, deleteScene, exportData,
    loadScenePack, deleteScenePack, setFieldValue, clearAll, applySceneWithMergeStrategy
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

  const handleSave = () => {
    if (saveName.trim()) {
      if (saveType === 'character') {
        saveCharacter(saveName.trim());
      } else {
        saveScene(saveName.trim());
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
      // Use smart merging by default for scene packs
      applySceneWithMergeStrategy(scene.json, strategy);
      setShowScenePackModal(false);
      
      // Scroll to JSON output
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

  const handleLoadItem = (type, id) => {
    if (type === 'character') {
      loadCharacter(id);
    } else {
      loadScene(id);
    }
    setShowDropdown(false);
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
          <div className="flex border-b border-gray-200 dark:border-cinema-border">
            <button
              onClick={() => setActiveTab('quick-actions')}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-all ${
                activeTab === 'quick-actions'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text'
              }`}
            >
              Actions
            </button>
            <button
              onClick={() => setActiveTab('characters')}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-all ${
                activeTab === 'characters'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text'
              }`}
            >
              Characters ({savedCharacters.length})
            </button>
            <button
              onClick={() => setActiveTab('scenes')}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-all ${
                activeTab === 'scenes'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text'
              }`}
            >
              Scenes ({savedScenes.length})
            </button>
            <button
              onClick={() => setActiveTab('scene-packs')}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-all ${
                activeTab === 'scene-packs'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text'
              }`}
            >
              Packs ({savedScenePacks.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-3 max-h-80 overflow-y-auto">
            {activeTab === 'quick-actions' && (
              <div className="space-y-2">
                <button
                  onClick={() => openSaveModal('character')}
                  className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Save Character</span>
                </button>
                
                <button
                  onClick={() => openSaveModal('scene')}
                  className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                  </svg>
                  <span>Save Scene</span>
                </button>

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

            {activeTab === 'characters' && (
              <div className="space-y-2">
                {savedCharacters.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-cinema-text-muted py-4 text-sm">
                    No saved characters yet.
                  </div>
                ) : (
                  savedCharacters.map((character) => (
                    <div key={character.id} className="bg-gray-50 dark:bg-cinema-card rounded-lg p-3 border border-gray-200 dark:border-cinema-border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-cinema-text truncate">
                          {character.name}
                        </h4>
                        <button
                          onClick={() => deleteCharacter(character.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-cinema-text-muted mb-2">
                        {formatDate(character.timestamp)}
                      </p>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleLoadItem('character', character.id)}
                          className="flex-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-all"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => {
                            exportData('character', character.id);
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
            )}

            {activeTab === 'scenes' && (
              <div className="space-y-2">
                {savedScenes.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-cinema-text-muted py-4 text-sm">
                    No saved scenes yet.
                  </div>
                ) : (
                  savedScenes.map((scene) => (
                    <div key={scene.id} className="bg-gray-50 dark:bg-cinema-card rounded-lg p-3 border border-gray-200 dark:border-cinema-border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-cinema-text truncate">
                          {scene.name}
                        </h4>
                        <button
                          onClick={() => deleteScene(scene.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-cinema-text-muted mb-2">
                        {formatDate(scene.timestamp)}
                      </p>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleLoadItem('scene', scene.id)}
                          className="flex-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-all"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => {
                            exportData('scene', scene.id);
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
            )}

            {activeTab === 'scene-packs' && (
              <div className="space-y-2">
                {savedScenePacks.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-cinema-text-muted py-4 text-sm">
                    No scene packs saved yet.
                    <br />
                    <span className="text-xs">Generate 5 scenes and save as a pack!</span>
                  </div>
                ) : (
                  savedScenePacks.map((pack) => (
                    <div key={pack.id} className="bg-gray-50 dark:bg-cinema-card rounded-lg p-3 border border-gray-200 dark:border-cinema-border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-cinema-text truncate">
                          💾 {pack.name}
                        </h4>
                        <button
                          onClick={() => deleteScenePack(pack.id)}
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
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleLoadScenePack(pack.id)}
                          className="flex-1 px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-md transition-all"
                        >
                          View Pack
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-cinema-panel rounded-lg p-6 w-96 border border-transparent dark:border-cinema-border shadow-xl dark:shadow-glow-soft">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-cinema-text">
              Save {saveType === 'character' ? 'Character' : 'Scene'}
            </h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder={`Enter ${saveType} name...`}
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

export default CompactSaveLoad;