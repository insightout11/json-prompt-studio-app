import React, { useState, useRef, useEffect } from 'react';
import ProjectSelector from './ProjectSelector';
import LibrarySystem from './LibrarySystem';
import usePromptStore from './store';

const ProjectManager = ({ showToast }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'library'
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const dropdownRef = useRef(null);

  const { 
    createProject, 
    projects, 
    currentProject,
    exportData,
    importData 
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

  const handleCreateNewProject = () => {
    setShowCreateProject(true);
    setShowDropdown(false);
  };

  const handleCreateProjectSubmit = () => {
    if (newProjectName.trim()) {
      const projectId = createProject(newProjectName.trim());
      setNewProjectName('');
      setShowCreateProject(false);
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
    if (currentProject) {
      exportData('all');
      showToast?.showSuccess('Project saved successfully!');
      setShowDropdown(false);
    } else {
      showToast?.showWarning('No active project to save. Create a project first.');
    }
  };

  const openLibrary = () => {
    setShowLibraryModal(true);
    setShowDropdown(false);
  };

  return (
    <div className="relative overflow-visible" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="px-4 py-2 rounded-md font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-110 shadow-md transition-all duration-200 flex items-center"
        title="Project Manager"
      >
        <span className="mr-1">📁</span>
        <span>Project</span>
        <svg
          className={`ml-1 w-4 h-4 transition-transform duration-200 ${
            showDropdown ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-cinema-panel border border-gray-200 dark:border-cinema-border rounded-lg shadow-lg z-[9999]">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-cinema-border">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 px-4 py-2 text-sm font-medium text-center transition-colors ${
                activeTab === 'projects'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 dark:text-cinema-text-muted hover:text-gray-700 dark:hover:text-cinema-text'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`flex-1 px-4 py-2 text-sm font-medium text-center transition-colors ${
                activeTab === 'library'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 dark:text-cinema-text-muted hover:text-gray-700 dark:hover:text-cinema-text'
              }`}
            >
              Library
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'projects' ? (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-800 dark:text-cinema-text mb-3">
                  Project Management
                </h3>
                
                {/* Project Selector */}
                <div className="mb-4">
                  <ProjectSelector inDropdown={true} />
                </div>

                {/* Project Actions */}
                <div className="space-y-2">
                  <button 
                    onClick={handleCreateNewProject}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border rounded-md transition-colors"
                  >
                    <span className="mr-2">✨</span>
                    Create New Project
                  </button>
                  <button 
                    onClick={handleLoadProject}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border rounded-md transition-colors"
                  >
                    <span className="mr-2">📂</span>
                    Load Project
                  </button>
                  <button 
                    onClick={handleSaveProject}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border rounded-md transition-colors"
                  >
                    <span className="mr-2">💾</span>
                    Save Project
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-800 dark:text-cinema-text mb-3">
                  Content Library
                </h3>
                <button 
                  onClick={openLibrary}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-cinema-text hover:bg-gray-100 dark:hover:bg-cinema-border rounded-md transition-colors"
                >
                  <span className="mr-2">📚</span>
                  Open Library
                </button>
                <p className="text-xs text-gray-500 dark:text-cinema-text-muted px-3">
                  Access your saved characters, scenes, styles, and more
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LibrarySystem Modal */}
      <LibrarySystem 
        showToast={showToast}
        headerMode={false}
        isOpen={showLibraryModal}
        onToggle={setShowLibraryModal}
      />

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-cinema-panel rounded-lg p-6 w-96 border border-transparent dark:border-cinema-border shadow-xl dark:shadow-glow-soft">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-cinema-text">
              Create New Project
            </h3>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 mb-4 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateProjectSubmit()}
              autoFocus
            />
            <div className="flex space-x-3">
              <button
                onClick={handleCreateProjectSubmit}
                disabled={!newProjectName.trim()}
                className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 dark:disabled:bg-cinema-border text-white rounded-md transition-all duration-300"
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
    </div>
  );
};

export default ProjectManager;