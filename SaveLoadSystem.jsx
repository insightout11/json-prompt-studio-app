import React, { useState } from 'react';
import usePromptStore from './store';

const SaveLoadSystem = () => {
  const { 
    savedCharacters, savedScenes, saveCharacter, saveScene, 
    loadCharacter, loadScene, deleteCharacter, deleteScene, exportData 
  } = usePromptStore();
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveType, setSaveType] = useState('character'); // 'character' or 'scene'
  const [saveName, setSaveName] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryTab, setLibraryTab] = useState('characters');

  const handleSave = () => {
    if (saveName.trim()) {
      if (saveType === 'character') {
        saveCharacter(saveName.trim());
      } else {
        saveScene(saveName.trim());
      }
      setSaveName('');
      setShowSaveModal(false);
    }
  };

  const openSaveModal = (type) => {
    setSaveType(type);
    setSaveName('');
    setShowSaveModal(true);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Main Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => openSaveModal('character')}
          className="px-3 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white text-sm font-medium rounded-md transition-all duration-300 flex items-center justify-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Save Character</span>
        </button>
        
        <button
          onClick={() => openSaveModal('scene')}
          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-cinema-teal dark:hover:bg-cinema-teal/90 dark:hover:shadow-glow-teal text-white text-sm font-medium rounded-md transition-all duration-300 flex items-center justify-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
          </svg>
          <span>Save Scene</span>
        </button>

        <button
          onClick={() => setShowLibrary(true)}
          className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 dark:bg-cinema-purple dark:hover:bg-cinema-purple/90 dark:hover:shadow-glow-purple text-white text-sm font-medium rounded-md transition-all duration-300 flex items-center justify-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
          </svg>
          <span>My Library</span>
        </button>

        <button
          onClick={() => exportData('current')}
          className="px-3 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-cinema-card dark:hover:bg-cinema-border dark:border dark:border-cinema-border text-white dark:text-cinema-text text-sm font-medium rounded-md transition-all duration-300 flex items-center justify-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export</span>
        </button>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-cinema-panel rounded-lg p-6 w-96 border border-transparent dark:border-cinema-border shadow-xl dark:shadow-glow-soft transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-cinema-text transition-colors duration-300">
              Save {saveType === 'character' ? 'Character' : 'Scene'}
            </h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder={`Enter ${saveType} name...`}
              className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cinema-teal mb-4 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text transition-all duration-300"
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                disabled={!saveName.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-cinema-teal dark:hover:bg-cinema-teal/90 dark:hover:shadow-glow-teal disabled:bg-gray-300 dark:disabled:bg-cinema-border text-white rounded-md transition-all duration-300"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-cinema-card dark:hover:bg-cinema-border dark:border dark:border-cinema-border text-white dark:text-cinema-text rounded-md transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-cinema-panel rounded-lg w-full max-w-4xl h-3/4 flex flex-col border border-transparent dark:border-cinema-border shadow-xl dark:shadow-glow-soft transition-all duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-cinema-border transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-cinema-text transition-colors duration-300">My Library</h3>
              <button
                onClick={() => setShowLibrary(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-cinema-text-muted dark:hover:text-cinema-text transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex border-b border-gray-200 dark:border-cinema-border transition-colors duration-300">
              <button
                onClick={() => setLibraryTab('characters')}
                className={`px-6 py-3 font-medium transition-all duration-300 ${
                  libraryTab === 'characters'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:border-cinema-teal dark:text-cinema-teal'
                    : 'text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text'
                }`}
              >
                Characters ({savedCharacters.length})
              </button>
              <button
                onClick={() => setLibraryTab('scenes')}
                className={`px-6 py-3 font-medium transition-all duration-300 ${
                  libraryTab === 'scenes'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:border-cinema-teal dark:text-cinema-teal'
                    : 'text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text'
                }`}
              >
                Scenes ({savedScenes.length})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-cinema-panel/30 transition-colors duration-300">
              {libraryTab === 'characters' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedCharacters.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 dark:text-cinema-text-muted py-8 transition-colors duration-300">
                      No saved characters yet. Save your first character to get started!
                    </div>
                  ) : (
                    savedCharacters.map((character) => (
                      <div key={character.id} className="border border-gray-200 dark:border-cinema-border rounded-lg p-4 hover:shadow-md dark:hover:shadow-glow-soft transition-all duration-300 bg-white dark:bg-cinema-card">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium truncate text-gray-900 dark:text-cinema-text transition-colors duration-300">{character.name}</h4>
                          <button
                            onClick={() => deleteCharacter(character.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-cinema-text-muted mb-3 transition-colors duration-300">{formatDate(character.timestamp)}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              loadCharacter(character.id);
                              setShowLibrary(false);
                            }}
                            className="flex-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 dark:bg-cinema-teal dark:hover:bg-cinema-teal/90 dark:hover:shadow-glow-teal text-white text-sm rounded-md transition-all duration-300"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => exportData('character', character.id)}
                            className="px-3 py-1 bg-gray-500 hover:bg-gray-600 dark:bg-cinema-card dark:hover:bg-cinema-border dark:border dark:border-cinema-border text-white dark:text-cinema-text text-sm rounded-md transition-all duration-300"
                          >
                            Export
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {libraryTab === 'scenes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedScenes.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 dark:text-cinema-text-muted py-8 transition-colors duration-300">
                      No saved scenes yet. Save your first scene to get started!
                    </div>
                  ) : (
                    savedScenes.map((scene) => (
                      <div key={scene.id} className="border border-gray-200 dark:border-cinema-border rounded-lg p-4 hover:shadow-md dark:hover:shadow-glow-soft transition-all duration-300 bg-white dark:bg-cinema-card">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium truncate text-gray-900 dark:text-cinema-text transition-colors duration-300">{scene.name}</h4>
                          <button
                            onClick={() => deleteScene(scene.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-cinema-text-muted mb-3 transition-colors duration-300">{formatDate(scene.timestamp)}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              loadScene(scene.id);
                              setShowLibrary(false);
                            }}
                            className="flex-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 dark:bg-cinema-teal dark:hover:bg-cinema-teal/90 dark:hover:shadow-glow-teal text-white text-sm rounded-md transition-all duration-300"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => exportData('scene', scene.id)}
                            className="px-3 py-1 bg-gray-500 hover:bg-gray-600 dark:bg-cinema-card dark:hover:bg-cinema-border dark:border dark:border-cinema-border text-white dark:text-cinema-text text-sm rounded-md transition-all duration-300"
                          >
                            Export
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-cinema-border p-4 bg-gray-50 dark:bg-cinema-card transition-colors duration-300">
              <button
                onClick={() => exportData('all')}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-800 dark:bg-cinema-border dark:hover:bg-cinema-card dark:border dark:border-cinema-border text-white dark:text-cinema-text rounded-md transition-all duration-300"
              >
                Export All Data (Backup)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SaveLoadSystem;