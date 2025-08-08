import React, { useState, useRef, useEffect } from 'react';
import usePromptStore from './store';

const IntegratedHeader = ({ showToast }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'library'
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const dropdownRef = useRef(null);

  const { 
    // Project management
    projects, 
    currentProject, 
    createProject, 
    switchProject, 
    deleteProject,
    exportData,
    importData,
    // Library data
    savedCharacters, 
    savedScenes, 
    savedActions, 
    savedSettings, 
    savedStyles, 
    savedAudio,
    savedScenePacks,
    // Library functions
    saveCharacter,
    saveScene, 
    saveAction,
    saveSetting,
    saveStyle,
    saveAudio,
    loadCharacter,
    loadScene,
    loadAction,
    loadSetting,
    loadStyle,
    loadAudio,
    deleteCharacter,
    deleteScene,
    deleteAction,
    deleteSetting,
    deleteStyle,
    deleteAudio,
    deleteScenePack,
    loadScenePack
  } = usePromptStore();

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

  // Project management functions
  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName.trim());
      setNewProjectName('');
      setShowCreateProject(false);
      setShowDropdown(false);
      showToast?.showSuccess(`Project "${newProjectName.trim()}" created successfully!`);
    }
  };

  const handleLoadProject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          await importData(file);
          showToast?.showSuccess('Project loaded successfully!');
          setShowDropdown(false);
        } catch (error) {
          showToast?.showError('Failed to load project: ' + error.message);
        }
      }
    };
    input.click();
  };

  const handleSaveProject = () => {
    exportData('all');
    showToast?.showSuccess('Project saved successfully!');
    setShowDropdown(false);
  };

  // Library management functions
  const handleLoadItem = (type, id) => {
    const loaders = {
      character: loadCharacter,
      scene: loadScene,
      action: loadAction,
      setting: loadSetting,
      style: loadStyle,
      audio: loadAudio
    };
    
    const data = {
      character: savedCharacters,
      scene: savedScenes,
      action: savedActions,
      setting: savedSettings,
      style: savedStyles,
      audio: savedAudio
    };

    const item = data[type]?.find(item => item.id === id);
    if (loaders[type] && item) {
      loaders[type](id);
      showToast?.showSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} "${item.name}" applied to workspace!`);
      setShowDropdown(false);
    }
  };

  const handleDeleteItem = (type, id) => {
    const deleters = {
      character: deleteCharacter,
      scene: deleteScene,
      action: deleteAction,
      setting: deleteSetting,
      style: deleteStyle,
      audio: deleteAudio
    };

    if (deleters[type]) {
      deleters[type](id);
      showToast?.showSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
    }
  };

  const handleExportItem = (type, id) => {
    exportData(type, id);
    showToast?.showSuccess('Item exported successfully!');
  };

  // Calculate total library items
  const totalLibraryItems = (savedCharacters?.length || 0) + 
                           (savedScenes?.length || 0) + 
                           (savedActions?.length || 0) + 
                           (savedSettings?.length || 0) + 
                           (savedStyles?.length || 0) + 
                           (savedAudio?.length || 0) + 
                           (savedScenePacks?.length || 0);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const libraryCategories = [
    { 
      key: 'character', 
      label: 'Characters', 
      icon: '👤', 
      data: savedCharacters || [],
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-700/50',
      description: 'Reusable character templates'
    },
    { 
      key: 'action', 
      label: 'Actions', 
      icon: '🎬', 
      data: savedActions || [],
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700/50',
      description: 'Movement & behavior presets'
    },
    { 
      key: 'setting', 
      label: 'Locations', 
      icon: '📍', 
      data: savedSettings || [],
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-700/50',
      description: 'Environment & location setups'
    },
    { 
      key: 'style', 
      label: 'Visual Styles', 
      icon: '🎨', 
      data: savedStyles || [],
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-700/50',
      description: 'Lighting & camera presets'
    },
    { 
      key: 'audio', 
      label: 'Audio', 
      icon: '🔊', 
      data: savedAudio || [],
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      borderColor: 'border-pink-200 dark:border-pink-700/50',
      description: 'Sound & music settings'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`relative inline-flex items-center px-3 py-2 rounded-md font-medium text-sm transition-all duration-300 group ${
          showDropdown
            ? 'bg-cinema-teal text-white shadow-glow-teal border border-cinema-teal'
            : 'bg-cinema-panel text-cinema-text border border-cinema-border hover:bg-cinema-card hover:shadow-glow-teal'
        }`}
        title="Project & Library Menu"
      >
        {/* Hamburger Icon */}
        <div className="w-5 h-5 mr-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        
        <span className="relative z-10">Menu</span>
        
        {/* Subtle glow effect when active */}
        {showDropdown && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-md pointer-events-none" />
        )}
      </button>

      {/* Unified Dropdown Menu */}
      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-cinema-panel border border-cinema-teal/20 rounded-lg shadow-xl dark:shadow-glow-soft z-50 max-h-96 overflow-hidden">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-cinema-border">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                activeTab === 'projects'
                  ? 'border-b-2 border-cinema-teal text-cinema-teal bg-cinema-teal/5'
                  : 'text-gray-500 hover:text-cinema-text dark:text-cinema-text-muted dark:hover:text-cinema-text'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>📁</span>
                <span>Projects</span>
                <span className="text-xs bg-gray-200 dark:bg-cinema-border px-2 py-1 rounded-full">
                  {projects?.length || 0}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                activeTab === 'library'
                  ? 'border-b-2 border-cinema-teal text-cinema-teal bg-cinema-teal/5'
                  : 'text-gray-500 hover:text-cinema-text dark:text-cinema-text-muted dark:hover:text-cinema-text'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>🧩</span>
                <span>Components</span>
                <span className="text-xs bg-gray-200 dark:bg-cinema-border px-2 py-1 rounded-full">
                  {totalLibraryItems}
                </span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="max-h-80 overflow-y-auto">
            {activeTab === 'projects' ? (
              <div>
                {/* Project Header */}
                <div className="p-4 border-b border-gray-200 dark:border-cinema-border">
                  <h3 className="font-semibold text-cinema-text mb-1">📁 Workspace Management</h3>
                  <p className="text-xs text-cinema-text-muted">Save/load complete scenes • Current: {currentProject ? currentProject.name : 'New Workspace'}</p>
                </div>

                {/* Project Quick Actions */}
                <div className="p-3 border-b border-gray-200 dark:border-cinema-border">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setShowCreateProject(true)}
                      className="px-2 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded transition-colors flex flex-col items-center space-y-1"
                    >
                      <span>✨</span>
                      <span>New</span>
                    </button>
                    <button
                      onClick={handleLoadProject}
                      className="px-2 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors flex flex-col items-center space-y-1"
                    >
                      <span>📂</span>
                      <span>Load</span>
                    </button>
                    <button
                      onClick={handleSaveProject}
                      disabled={!currentProject}
                      className="px-2 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs font-medium rounded transition-colors flex flex-col items-center space-y-1"
                    >
                      <span>💾</span>
                      <span>Save</span>
                    </button>
                  </div>
                </div>

                {/* Project List */}
                <div>
                  {projects && projects.length > 0 ? (
                    projects.map(project => (
                      <div key={project.id} className={`p-3 border-b border-gray-100 dark:border-cinema-border/50 hover:bg-gray-50 dark:hover:bg-cinema-card transition-colors ${currentProject?.id === project.id ? 'bg-cinema-teal/10' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-sm text-cinema-text">{project.name}</h4>
                              {currentProject?.id === project.id && (
                                <span className="px-2 py-1 bg-cinema-teal text-white text-xs rounded-full">Active</span>
                              )}
                            </div>
                            <p className="text-xs text-cinema-text-muted">{formatDate(project.timestamp)}</p>
                          </div>
                          <div className="flex space-x-1">
                            {currentProject?.id !== project.id && (
                              <button
                                onClick={() => {
                                  switchProject(project.id);
                                  setShowDropdown(false);
                                  showToast?.showSuccess(`Switched to project "${project.name}"`);
                                }}
                                className="px-2 py-1 bg-cinema-teal text-white text-xs rounded hover:bg-cinema-teal-bright transition-colors"
                              >
                                Switch
                              </button>
                            )}
                            <button
                              onClick={() => {
                                deleteProject(project.id);
                                showToast?.showSuccess(`Project "${project.name}" deleted`);
                              }}
                              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-cinema-text-muted">
                      <span className="text-2xl block mb-2">📁</span>
                      <p className="text-sm">No projects yet</p>
                      <p className="text-xs">Create your first project to get started</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {/* Library Header */}
                <div className="p-4 border-b border-gray-200 dark:border-cinema-border">
                  <h3 className="font-semibold text-cinema-text mb-1">🧩 Component Library</h3>
                  <p className="text-xs text-cinema-text-muted">Reusable building blocks • {totalLibraryItems} components saved</p>
                </div>

                {/* Quick Save Components */}
                <div className="p-3 border-b border-gray-200 dark:border-cinema-border bg-gray-50 dark:bg-cinema-card/50">
                  <h4 className="text-xs font-medium text-cinema-text mb-2">💾 Save Current Components</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const name = prompt('Character name:');
                        if (name?.trim()) {
                          saveCharacter(name.trim());
                          showToast?.showSuccess(`Character "${name.trim()}" saved to library!`);
                        }
                      }}
                      className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>👤</span>
                      <span>Character</span>
                    </button>
                    <button
                      onClick={() => {
                        const name = prompt('Action name:');
                        if (name?.trim()) {
                          saveAction(name.trim());
                          showToast?.showSuccess(`Action "${name.trim()}" saved to library!`);
                        }
                      }}
                      className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>🎬</span>
                      <span>Action</span>
                    </button>
                    <button
                      onClick={() => {
                        const name = prompt('Location name:');
                        if (name?.trim()) {
                          saveSetting(name.trim());
                          showToast?.showSuccess(`Location "${name.trim()}" saved to library!`);
                        }
                      }}
                      className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>📍</span>
                      <span>Location</span>
                    </button>
                    <button
                      onClick={() => {
                        const name = prompt('Style name:');
                        if (name?.trim()) {
                          saveStyle(name.trim());
                          showToast?.showSuccess(`Style "${name.trim()}" saved to library!`);
                        }
                      }}
                      className="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>🎨</span>
                      <span>Style</span>
                    </button>
                  </div>
                </div>

                {/* Library Categories */}
                <div>
                  {libraryCategories.map(category => (
                    <div key={category.key} className="border-b border-gray-100 dark:border-cinema-border/50 last:border-b-0">
                      
                      {/* Category Header */}
                      <div className={`p-3 ${category.bgColor} ${category.borderColor} border-l-4`}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{category.icon}</span>
                            <span className={`font-medium text-sm ${category.color}`}>{category.label}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full bg-white dark:bg-cinema-card ${category.color}`}>
                              {category.data.length}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-cinema-text-muted ml-7">
                          {category.description}
                        </p>
                      </div>

                      {/* Category Items */}
                      {category.data.length > 0 && (
                        <div className="max-h-32 overflow-y-auto">
                          {category.data.slice(-5).reverse().map(item => (
                            <div key={item.id} className="p-2 hover:bg-gray-50 dark:hover:bg-cinema-card/50 transition-colors flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-medium text-cinema-text truncate">{item.name}</h5>
                                <p className="text-xs text-cinema-text-muted">{formatDate(item.timestamp)}</p>
                              </div>
                              <div className="flex space-x-1 ml-2">
                                <button
                                  onClick={() => handleLoadItem(category.key, item.id)}
                                  className="px-2 py-1 bg-cinema-teal text-white text-xs rounded hover:bg-cinema-teal-bright transition-colors"
                                  title="Apply to current workspace"
                                >
                                  Apply
                                </button>
                                <button
                                  onClick={() => handleExportItem(category.key, item.id)}
                                  className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                                  title="Export"
                                >
                                  Export
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(category.key, item.id)}
                                  className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                                  title="Delete"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                          {category.data.length > 5 && (
                            <div className="p-2 text-center">
                              <span className="text-xs text-cinema-text-muted">
                                ...and {category.data.length - 5} more
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Empty State */}
                      {category.data.length === 0 && (
                        <div className="p-3 text-center text-cinema-text-muted">
                          <p className="text-xs">No {category.label.toLowerCase()} saved yet</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-cinema-panel rounded-lg p-6 w-96 border border-cinema-teal/20 shadow-xl dark:shadow-glow-soft">
            <h3 className="text-lg font-semibold mb-4 text-cinema-text flex items-center space-x-2">
              <span>✨</span>
              <span>Create New Project</span>
            </h3>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="w-full px-3 py-2 border border-cinema-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cinema-teal focus:border-cinema-teal mb-4 bg-cinema-card text-cinema-text"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className="flex-1 px-4 py-2 bg-cinema-teal hover:bg-cinema-teal-bright disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
              >
                Create Project
              </button>
              <button
                onClick={() => {
                  setShowCreateProject(false);
                  setNewProjectName('');
                }}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegratedHeader;