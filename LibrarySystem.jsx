import React, { useState, useRef, useEffect } from 'react';
import usePromptStore from './store';
import RelatedGeneratorModal from './RelatedGeneratorModal';

const LibrarySystem = ({ showToast, headerMode = false, isOpen = false, onToggle }) => {
  const { 
    savedCharacters, savedScenes, savedScenePacks, savedActions, 
    savedSettings, savedStyles, savedAudio,
    saveCharacter, saveScene, saveAction, saveSetting, saveStyle, saveAudio,
    loadCharacter, loadScene, loadAction, loadSetting, loadStyle, loadAudio,
    addCharacterToScene, loadCharacterWithMergeMode, deleteCharacter, deleteScene, deleteAction, deleteSetting, deleteStyle, deleteAudio,
    exportData, loadScenePack, deleteScenePack, setFieldValue, clearAll, 
    applySceneWithMergeStrategy, fieldValues,
    // Project management
    projects, currentProject, createProject, switchProject, deleteProject,
    // Asset-project relationship management
    assignAssetToProject, removeAssetFromProject, isAssetInProject
  } = usePromptStore();
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveType, setSaveType] = useState('character');
  const [saveName, setSaveName] = useState('');
  const [selectedProjectsForSave, setSelectedProjectsForSave] = useState([]);
  const [activeTab, setActiveTab] = useState('projects'); // Start with projects tab
  const [showScenePackModal, setShowScenePackModal] = useState(false);
  const [selectedScenePack, setSelectedScenePack] = useState(null);
  const [showRelatedModal, setShowRelatedModal] = useState(false);
  const [selectedItemForRelated, setSelectedItemForRelated] = useState(null);
  const [relatedSpecType, setRelatedSpecType] = useState('character'); // 'character' or 'world'
  const [selectedProject, setSelectedProject] = useState('global'); // 'global' or project ID
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const dropdownRef = useRef(null);

  // Sync selectedProject with currentProject from store
  useEffect(() => {
    if (currentProject) {
      setSelectedProject(currentProject.id);
    } else {
      setSelectedProject('global');
    }
  }, [currentProject]);

  // Utility functions for converting library items to RelatedGenerator format
  const convertLibraryItemToSpec = (item, categoryKey) => {
    if (categoryKey === 'characters') {
      // Convert character library item to character spec
      return {
        name: item.name,
        summary: item.data?.summary || `Character: ${item.name}`,
        appearance: item.data?.appearance || item.data?.character || item.data?.character_type || 'Character appearance',
        personality: item.data?.personality || item.data?.emotions || 'Character personality',
        background: item.data?.background || item.data?.actions || 'Character background',
        uniqueTraits: item.data?.uniqueTraits || item.data?.style || 'Unique characteristics',
        // Include raw data for AI processing
        formFields: item.data || {}
      };
    } else if (categoryKey === 'settings') {
      // Convert setting library item to world spec
      return {
        name: item.name,
        summary: item.data?.summary || `Setting: ${item.name}`,
        geography: item.data?.geography || item.data?.setting || item.data?.environment || 'Geographic features',
        architecture: item.data?.architecture || item.data?.location_description || 'Architectural details',
        culture: item.data?.culture || item.data?.atmosphere || 'Cultural atmosphere',
        atmosphere: item.data?.atmospheric_elements || item.data?.lighting_type || 'Environmental mood',
        uniqueFeatures: item.data?.uniqueFeatures || item.data?.style || 'Distinctive characteristics',
        // Include raw data for AI processing
        formFields: item.data || {}
      };
    }
    return null;
  };

  // Handle related generation from library items
  const handleMakeRelated = (item, categoryKey) => {
    const spec = convertLibraryItemToSpec(item, categoryKey);
    if (!spec) return;

    setSelectedItemForRelated(spec);
    setRelatedSpecType(categoryKey === 'characters' ? 'character' : 'world');
    setShowRelatedModal(true);
  };

  // Handle related generation results
  const handleRelatedResult = (relatedItem) => {
    if (relatedItem) {
      // Apply the related item to current scene
      if (relatedItem.formFields) {
        Object.entries(relatedItem.formFields).forEach(([key, value]) => {
          if (value && value.trim && value.trim() !== '') {
            setFieldValue(key, value);
          }
        });
      }

      // Ask if user wants to save this related item to library
      const shouldSave = window.confirm(
        `Related ${relatedSpecType} applied to scene! Would you like to save this generated ${relatedSpecType} to your library for future use?`
      );

      if (shouldSave) {
        // Generate a name for the related item
        const baseName = selectedItemForRelated?.name || 'Generated';
        const relationshipType = relatedItem.keyDifferences?.[0] || 'Variant';
        const suggestedName = `${baseName} (${relationshipType})`;
        
        const customName = window.prompt(
          `Enter a name for this ${relatedSpecType}:`,
          suggestedName
        );

        if (customName && customName.trim()) {
          // Save to appropriate library category
          const categoryKey = relatedSpecType === 'character' ? 'characters' : 'settings';
          const category = libraryCategories[categoryKey];
          
          if (category && category.saveHandler) {
            // Temporarily set the current form data to the related item data
            const originalData = {};
            if (relatedItem.formFields) {
              Object.entries(relatedItem.formFields).forEach(([key, value]) => {
                originalData[key] = fieldValues[key]; // Store original values
                if (value && value.trim && value.trim() !== '') {
                  setFieldValue(key, value); // Set related item data
                }
              });
            }
            
            // Save the related item
            category.saveHandler(customName.trim());
            
            // Restore original form data
            Object.entries(originalData).forEach(([key, value]) => {
              setFieldValue(key, value);
            });

            if (showToast?.showSuccess) {
              showToast.showSuccess(`Related ${relatedSpecType} "${customName.trim()}" saved to library!`);
            }
          }
        }
      } else {
        // Just show success feedback for applying to scene
        if (showToast?.showSuccess) {
          showToast.showSuccess(`Related ${relatedSpecType} applied to scene successfully!`);
        }
      }

      // Close modals
      setShowRelatedModal(false);
      onToggle?.(false); // Close library
    }
  };

  // Close library when clicking outside (if in modal mode)
  useEffect(() => {
    if (!isOpen || headerMode) return;
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, headerMode, onToggle]);

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
      label: 'Audios',
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
        // Pass selected projects to save handler
        category.saveHandler(saveName.trim(), selectedProjectsForSave);
        
        // Show success feedback with project info
        let successMessage = `${category.label.slice(0, -1)} "${saveName.trim()}" saved successfully!`;
        if (selectedProjectsForSave.length > 0) {
          const projectNames = selectedProjectsForSave.map(id => projects.find(p => p.id === id)?.name || id).join(', ');
          successMessage += ` Added to project${selectedProjectsForSave.length > 1 ? 's' : ''}: ${projectNames}`;
        }
        
        if (showToast?.showSuccess) {
          showToast.showSuccess(successMessage);
        }
      }
      setSaveName('');
      setSelectedProjectsForSave([]);
      setShowSaveModal(false);
    }
  };

  const openSaveModal = (type) => {
    setSaveType(type);
    setSaveName('');
    setSelectedProjectsForSave([]);
    setShowSaveModal(true);
  };

  const handleLoadItem = (categoryKey, id, mode = 'replace') => {
    const category = libraryCategories[categoryKey];
    if (category && category.loadHandler) {
      const loadedItem = category.data.find(item => item.id === id);
      
      // Handle character loading with merge mode
      if (categoryKey === 'characters' && mode) {
        loadCharacterWithMergeMode(id, mode);
        const modeText = mode === 'add' ? 'added to scene' : 'replaced main character';
        if (showToast?.showSuccess && loadedItem) {
          showToast.showSuccess(`Character "${loadedItem.name}" ${modeText}!`);
        }
      } else {
        category.loadHandler(id);
        if (showToast?.showSuccess && loadedItem) {
          showToast.showSuccess(`${category.label.slice(0, -1)} "${loadedItem.name}" loaded successfully!`);
        }
      }
    }
  };

  const handleDeleteItem = (categoryKey, id) => {
    const category = libraryCategories[categoryKey];
    if (category && category.deleteHandler) {
      const itemToDelete = category.data.find(item => item.id === id);
      category.deleteHandler(id);
      
      // Show success feedback
      if (showToast?.showSuccess && itemToDelete) {
        showToast.showSuccess(`${category.label.slice(0, -1)} "${itemToDelete.name}" deleted successfully.`);
      }
    }
  };

  // Handle scene pack operations
  const handleLoadScenePack = (packId) => {
    const pack = loadScenePack(packId);
    if (pack) {
      setSelectedScenePack(pack);
      setShowScenePackModal(true);
    }
  };

  const handleApplySceneFromPack = (scene, strategy = 'smart') => {
    if (scene.json && typeof scene.json === 'object') {
      applySceneWithMergeStrategy(scene.json, strategy);
      setShowScenePackModal(false);
      
      // Show success feedback
      if (showToast?.showSuccess) {
        const strategyLabels = {
          smart: 'Smart merge',
          merge: 'Added to scene',
          replace: 'Scene replaced'
        };
        showToast.showSuccess(`${strategyLabels[strategy] || 'Scene applied'} successfully!`);
      }
      
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

  // Filter items based on selected project
  const filterItemsByProject = (items) => {
    if (selectedProject === 'global') {
      return items; // Show all items in global view
    }
    
    // Filter items that belong to the selected project
    return items.filter(item => {
      // Handle legacy items that don't have projectIds
      if (!item.projectIds) {
        return false; // Don't show legacy items in project view
      }
      
      return item.projectIds.includes(selectedProject);
    });
  };

  // Handle project assignment
  const handleAssignToProject = (categoryKey, itemId, projectId) => {
    const assetType = categoryKey.slice(0, -1); // Remove 's' from end (characters -> character)
    const success = assignAssetToProject(assetType, itemId, projectId);
    
    if (success && showToast?.showSuccess) {
      const project = projects.find(p => p.id === projectId);
      showToast.showSuccess(`Item assigned to project "${project?.name || projectId}"!`);
    }
  };

  const handleRemoveFromProject = (categoryKey, itemId, projectId) => {
    const assetType = categoryKey.slice(0, -1); // Remove 's' from end
    const success = removeAssetFromProject(assetType, itemId, projectId);
    
    if (success && showToast?.showSuccess) {
      const project = projects.find(p => p.id === projectId);
      showToast.showSuccess(`Item removed from project "${project?.name || projectId}"!`);
    }
  };

  const renderCategoryItems = (categoryKey) => {
    const category = libraryCategories[categoryKey];
    if (!category) return null;
    
    // Filter items based on selected project
    const filteredData = filterItemsByProject(category.data);

    if (categoryKey === 'scene-packs') {
      return (
        <div className="space-y-2">
          {filteredData.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-cinema-text-muted py-4 text-sm">
              No scene packs saved yet.
              <br />
              <span className="text-xs">Generate 5 scenes and save as a pack!</span>
            </div>
          ) : (
            filteredData.map((pack) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-cinema-text-muted py-8 text-sm">
            <div className="text-4xl mb-2">{category.icon}</div>
            {selectedProject === 'global' ? (
              <>
                <p>No saved {category.label.toLowerCase()} yet.</p>
                <p className="text-xs mt-1">Start creating and save your first {category.label.slice(0, -1).toLowerCase()}!</p>
              </>
            ) : (
              <>
                <p>No {category.label.toLowerCase()} in this project yet.</p>
                <p className="text-xs mt-1">Switch to Global view to see all items, or create new ones in this project!</p>
              </>
            )}
          </div>
        ) : (
          filteredData.map((item) => (
            <div key={item.id} className="bg-gray-50 dark:bg-cinema-card rounded-lg p-4 border border-gray-200 dark:border-cinema-border hover:border-gray-300 dark:hover:border-cinema-border-hover transition-all duration-200 hover:shadow-md">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <span className="text-lg">{category.icon}</span>
                  <h4 className="font-medium text-sm text-gray-900 dark:text-cinema-text truncate">
                    {item.name}
                  </h4>
                </div>
                <button
                  onClick={() => handleDeleteItem(categoryKey, item.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex-shrink-0"
                  title="Delete this item"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Preview Content */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-cinema-text-muted mb-2">
                  {formatDate(item.timestamp)}
                </p>
                {/* Show a preview of the content */}
                {item.data && (
                  <div className="text-xs text-gray-600 dark:text-cinema-text-muted bg-gray-100 dark:bg-cinema-panel rounded p-2 max-h-16 overflow-hidden">
                    {(() => {
                      if (categoryKey === 'characters') {
                        return item.data.character || item.data.character_type || item.data.summary || 'Character details...';
                      } else if (categoryKey === 'settings') {
                        return item.data.setting || item.data.location_description || item.data.summary || 'Setting details...';
                      } else if (categoryKey === 'actions') {
                        return item.data.actions || item.data.summary || 'Action details...';
                      } else if (categoryKey === 'styles') {
                        return item.data.style || item.data.camera_angle || item.data.summary || 'Style details...';
                      } else if (categoryKey === 'scenes') {
                        return item.data.scene || item.data.summary || 'Scene details...';
                      }
                      return 'Preview available...';
                    })()}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {/* Primary Actions Row - Special handling for characters */}
                <div className="flex space-x-1">
                  {categoryKey === 'characters' ? (
                    <>
                      <button
                        onClick={() => handleLoadItem(categoryKey, item.id, 'replace')}
                        className={`flex-1 px-3 py-2 ${getColorClasses(category.color)} text-white text-xs font-medium rounded-md transition-all hover:shadow-md`}
                        title="Replace main character with this one"
                      >
                        Replace
                      </button>
                      <button
                        onClick={() => handleLoadItem(categoryKey, item.id, 'add')}
                        className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-md transition-all hover:shadow-md"
                        title="Add this character to the scene"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          exportData(categoryKey === 'scenes' ? 'scene' : categoryKey.slice(0, -1), item.id);
                        }}
                        className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium rounded-md transition-all hover:shadow-md"
                      >
                        Export
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleLoadItem(categoryKey, item.id)}
                        className={`flex-1 px-3 py-2 ${getColorClasses(category.color)} text-white text-xs font-medium rounded-md transition-all hover:shadow-md`}
                      >
                        Load
                      </button>
                      <button
                        onClick={() => {
                          exportData(categoryKey === 'scenes' ? 'scene' : categoryKey.slice(0, -1), item.id);
                        }}
                        className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium rounded-md transition-all hover:shadow-md"
                      >
                        Export
                      </button>
                    </>
                  )}
                </div>
                
                {/* Make Related Button - only for characters and settings */}
                {(categoryKey === 'characters' || categoryKey === 'settings') && (
                  <button
                    onClick={() => handleMakeRelated(item, categoryKey)}
                    className="w-full px-3 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800/40 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-md transition-all duration-300 border border-purple-300 dark:border-purple-600 hover:border-purple-400 dark:hover:border-purple-500 flex items-center justify-center space-x-1 hover:shadow-md"
                    title={`Generate related ${categoryKey === 'characters' ? 'characters' : 'worlds'} from this ${categoryKey.slice(0, -1)}`}
                  >
                    <span>🌟</span>
                    <span>Make Related</span>
                  </button>
                )}

                {/* Project Management Section */}
                <div className="border-t border-gray-200 dark:border-cinema-border pt-2">
                  {/* Show project assignments */}
                  {item.projectIds && item.projectIds.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 dark:text-cinema-text-muted mb-1">
                        In projects:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.projectIds.map(projectId => {
                          const project = projects.find(p => p.id === projectId);
                          return (
                            <span
                              key={projectId}
                              className="inline-flex items-center space-x-1 px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs rounded-full"
                            >
                              <span>{project?.name || 'Unknown'}</span>
                              {selectedProject === 'global' && (
                                <button
                                  onClick={() => handleRemoveFromProject(categoryKey, item.id, projectId)}
                                  className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200"
                                  title="Remove from project"
                                >
                                  ×
                                </button>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Project assignment controls */}
                  {selectedProject === 'global' ? (
                    // Global view - show "Assign to Project" dropdown
                    projects.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAssignToProject(categoryKey, item.id, e.target.value);
                              e.target.value = ''; // Reset selection
                            }
                          }}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-cinema-border rounded bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text"
                        >
                          <option value="">Assign to project...</option>
                          {projects
                            .filter(project => !item.projectIds?.includes(project.id))
                            .map(project => (
                              <option key={project.id} value={project.id}>
                                {project.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    )
                  ) : (
                    // Project view - show "Remove from Project" button
                    item.projectIds?.includes(selectedProject) && (
                      <button
                        onClick={() => handleRemoveFromProject(categoryKey, item.id, selectedProject)}
                        className="w-full px-3 py-1 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 text-red-700 dark:text-red-300 text-xs font-medium rounded-md transition-all duration-300 border border-red-300 dark:border-red-600 hover:border-red-400 dark:hover:border-red-500"
                      >
                        Remove from Project
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  // If used as a button (header mode), return just the button
  if (headerMode) {
    return (
      <button
        onClick={() => onToggle?.(!isOpen)}
        className="flex items-center space-x-2 px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl"
        title="View saved content and manage your library"
      >
        <span className="text-base">📚</span>
        <span>Library</span>
      </button>
    );
  }

  // If not open, return null (hidden)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[9998] p-4 pt-8" ref={dropdownRef}>
      <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-xl dark:shadow-glow-soft max-w-6xl w-full max-h-[85vh] overflow-hidden border border-teal-200 dark:border-teal-700/50 mt-4">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-cinema-border">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📚</span>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-cinema-text">Library</h2>
              {selectedProject !== 'global' && currentProject && (
                <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-cinema-text-muted">
                  <span>📁</span>
                  <span>Filtering by: {currentProject.name}</span>
                  <button
                    onClick={() => setSelectedProject('global')}
                    className="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-cinema-border hover:bg-gray-300 dark:hover:bg-cinema-border-hover rounded text-xs transition-colors"
                    title="Switch to Global view"
                  >
                    Show All
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => onToggle?.(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-cinema-border px-6">
          {/* Projects Tab - First */}
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'projects'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text'
            }`}
          >
            <span className="flex items-center space-x-2">
              <span>📁</span>
              <span>Projects</span>
              <span className="text-xs bg-gray-200 dark:bg-cinema-border px-2 py-1 rounded-full">
                {projects?.length || 0}
              </span>
            </span>
          </button>
          
          {/* Quick Actions Tab */}
          <button
            onClick={() => setActiveTab('quick-actions')}
            className={`px-4 py-3 text-sm font-medium transition-all ${
              activeTab === 'quick-actions'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text'
            }`}
          >
            Actions
          </button>
          
          {/* Library Category Tabs */}
          {Object.entries(libraryCategories).map(([key, category]) => {
            const filteredCount = filterItemsByProject(category.data).length;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === key
                    ? 'border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                  <span className="text-xs bg-gray-200 dark:bg-cinema-border px-2 py-1 rounded-full">
                    {selectedProject === 'global' ? category.data.length : filteredCount}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Project Filter Header */}
              <div>
                <div className="border-b border-gray-200 dark:border-cinema-border pb-3 mb-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-cinema-text-muted uppercase tracking-wide">
                    📁 Project Management
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-cinema-text-muted mt-1">
                    Manage projects and filter library content by project
                  </p>
                </div>
                
                {/* Project Filter Selection */}
                <div className="flex items-center space-x-3 mb-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-cinema-text">
                    View:
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedProject('global')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                        selectedProject === 'global'
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-200 dark:bg-cinema-border text-gray-600 dark:text-cinema-text-muted hover:bg-gray-300'
                      }`}
                    >
                      🌐 Global (All Items)
                    </button>
                    {currentProject && (
                      <button
                        onClick={() => setSelectedProject(currentProject.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                          selectedProject === currentProject.id
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-200 dark:bg-cinema-border text-gray-600 dark:text-cinema-text-muted hover:bg-gray-300'
                        }`}
                      >
                        📁 {currentProject.name}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Actions */}
              <div>
                <div className="border-b border-gray-200 dark:border-cinema-border pb-3 mb-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-cinema-text-muted uppercase tracking-wide">
                    ✨ Quick Actions
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowCreateProject(true)}
                    className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg"
                  >
                    <span>✨</span>
                    <span>Create New Project</span>
                  </button>
                  
                  {currentProject && (
                    <button
                      onClick={() => {
                        // Export current project
                        exportData('all');
                        if (showToast?.showSuccess) {
                          showToast.showSuccess(`Project "${currentProject.name}" exported successfully!`);
                        }
                      }}
                      className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg"
                    >
                      <span>💾</span>
                      <span>Export Current Project</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Project List */}
              <div>
                <div className="border-b border-gray-200 dark:border-cinema-border pb-3 mb-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-cinema-text-muted uppercase tracking-wide">
                    📋 All Projects ({projects?.length || 0})
                  </h4>
                </div>
                
                {projects && projects.length > 0 ? (
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div key={project.id} className={`bg-gray-50 dark:bg-cinema-card rounded-lg p-4 border transition-all duration-200 ${
                        currentProject?.id === project.id 
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                          : 'border-gray-200 dark:border-cinema-border hover:border-gray-300 dark:hover:border-cinema-border-hover'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h5 className="font-medium text-sm text-gray-900 dark:text-cinema-text truncate">
                                {project.name}
                              </h5>
                              {currentProject?.id === project.id && (
                                <span className="px-2 py-1 bg-indigo-500 text-white text-xs rounded-full">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-cinema-text-muted mb-2">
                              Created: {formatDate(project.timestamp)}
                            </p>
                            {project.description && (
                              <p className="text-xs text-gray-600 dark:text-cinema-text-muted">
                                {project.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {currentProject?.id !== project.id && (
                              <button
                                onClick={() => {
                                  switchProject(project.id);
                                  // Auto-switch to characters tab to show project assets
                                  setActiveTab('characters');
                                  if (showToast?.showSuccess) {
                                    showToast.showSuccess(`Switched to project "${project.name}" - showing project assets`);
                                  }
                                }}
                                className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium rounded transition-all"
                              >
                                Open Project
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete project "${project.name}"? This cannot be undone.`)) {
                                  deleteProject(project.id);
                                  if (showToast?.showSuccess) {
                                    showToast.showSuccess(`Project "${project.name}" deleted`);
                                  }
                                }
                              }}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📁</div>
                    <h5 className="font-medium text-gray-700 dark:text-cinema-text mb-2">No projects yet</h5>
                    <p className="text-sm text-gray-500 dark:text-cinema-text-muted mb-4">
                      Create your first project to organize your scenes and assets
                    </p>
                    <button
                      onClick={() => setShowCreateProject(true)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-all"
                    >
                      Create Your First Project
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'quick-actions' && (
            <div className="space-y-6">
              {/* Save Actions Section */}
              <div>
                <div className="border-b border-gray-200 dark:border-cinema-border pb-3 mb-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-cinema-text-muted uppercase tracking-wide">
                    💾 Save Current Elements
                  </h4>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(libraryCategories).filter(([key]) => key !== 'scene-packs').map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => openSaveModal(key)}
                      className={`px-4 py-3 ${getColorClasses(category.color)} text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg`}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span>Save {category.label.slice(0, -1)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Section */}
              <div>
                <div className="border-b border-gray-200 dark:border-cinema-border pb-3 mb-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-cinema-text-muted uppercase tracking-wide">
                    📦 Export & Backup
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => exportData('current')}
                    className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Export Current</span>
                  </button>

                  <button
                    onClick={() => exportData('all')}
                    className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Export All (Backup)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'quick-actions' && renderCategoryItems(activeTab)}
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
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

            {/* Project Selection */}
            {projects.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
                  Add to Projects (optional)
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {projects.map((project) => (
                    <label key={project.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedProjectsForSave.includes(project.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProjectsForSave([...selectedProjectsForSave, project.id]);
                          } else {
                            setSelectedProjectsForSave(selectedProjectsForSave.filter(id => id !== project.id));
                          }
                        }}
                        className="text-indigo-500 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-cinema-text">{project.name}</span>
                      {project.id === currentProject?.id && (
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">(current)</span>
                      )}
                    </label>
                  ))}
                </div>
                {selectedProjectsForSave.length > 0 && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-cinema-text-muted">
                    Will be added to {selectedProjectsForSave.length} project{selectedProjectsForSave.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )}

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
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
              <div className="grid grid-cols-1 gap-4">
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

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white dark:bg-cinema-panel rounded-lg p-6 w-96 border border-transparent dark:border-cinema-border shadow-xl dark:shadow-glow-soft">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-cinema-text flex items-center space-x-2">
              <span>✨</span>
              <span>Create New Project</span>
            </h3>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 mb-4 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newProjectName.trim()) {
                  const projectId = createProject(newProjectName.trim());
                  if (showToast?.showSuccess) {
                    showToast.showSuccess(`Project "${newProjectName.trim()}" created successfully!`);
                  }
                  setNewProjectName('');
                  setShowCreateProject(false);
                }
              }}
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  if (newProjectName.trim()) {
                    const projectId = createProject(newProjectName.trim());
                    if (showToast?.showSuccess) {
                      showToast.showSuccess(`Project "${newProjectName.trim()}" created successfully!`);
                    }
                    setNewProjectName('');
                    setShowCreateProject(false);
                  }
                }}
                disabled={!newProjectName.trim()}
                className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-cinema-border text-white rounded-md transition-all duration-300"
              >
                Create Project
              </button>
              <button
                onClick={() => {
                  setShowCreateProject(false);
                  setNewProjectName('');
                }}
                className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Related Generator Modal */}
      <RelatedGeneratorModal
        isOpen={showRelatedModal}
        onClose={() => {
          setShowRelatedModal(false);
          setSelectedItemForRelated(null);
        }}
        baseSpec={selectedItemForRelated}
        specType={relatedSpecType}
        onResult={handleRelatedResult}
      />
    </div>
  );
};

export default LibrarySystem;