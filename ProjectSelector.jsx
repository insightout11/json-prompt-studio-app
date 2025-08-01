import React, { useState } from 'react';
import usePromptStore from './store';

const ProjectSelector = () => {
  const { 
    projects, 
    currentProject, 
    switchProject, 
    createProject, 
    deleteProject,
    updateProject
  } = usePromptStore();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName.trim(), newProjectDescription.trim());
      setNewProjectName('');
      setNewProjectDescription('');
      setShowCreateModal(false);
      setShowDropdown(false);
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

  return (
    <div className="relative">
      {/* Project Selector Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm font-medium rounded-md transition-all duration-300 h-10 shadow-lg hover:shadow-xl"
      >
        <span className="text-base">📁</span>
        <span>{currentProject ? currentProject.name : 'No Project'}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-cinema-panel border border-gray-200 dark:border-cinema-border rounded-lg shadow-xl dark:shadow-glow-soft z-50 w-80 max-h-96 overflow-hidden">
          <div className="p-3 border-b border-gray-200 dark:border-cinema-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800 dark:text-cinema-text">Projects</h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition-colors"
              >
                + New
              </button>
            </div>
            {currentProject && (
              <div className="text-xs text-gray-600 dark:text-cinema-text-muted">
                Current: {currentProject.name} • {currentProject.sceneCount || 0} scenes
              </div>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {/* No Project Option */}
            <button
              onClick={() => {
                switchProject(null);
                setShowDropdown(false);
              }}
              className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-cinema-border transition-colors ${
                !currentProject ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="font-medium text-gray-700 dark:text-cinema-text">
                🚫 No Project
              </div>
              <div className="text-xs text-gray-500 dark:text-cinema-text-muted">
                Work without project organization
              </div>
            </button>

            {/* Project List */}
            {projects.map((project) => (
              <div
                key={project.id}
                className={`border-t border-gray-200 dark:border-cinema-border ${
                  currentProject?.id === project.id ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                }`}
              >
                <button
                  onClick={() => {
                    switchProject(project.id);
                    setShowDropdown(false);
                  }}
                  className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-cinema-border transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-700 dark:text-cinema-text">
                        📁 {project.name}
                      </div>
                      {project.description && (
                        <div className="text-xs text-gray-600 dark:text-cinema-text-muted mt-1">
                          {project.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 dark:text-cinema-text-muted mt-1">
                        {formatDate(project.timestamp)} • {project.sceneCount || 0} scenes
                      </div>
                    </div>
                    {currentProject?.id === project.id && (
                      <div className="text-purple-500 dark:text-purple-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
                
                {/* Project Actions */}
                {currentProject?.id === project.id && (
                  <div className="px-3 pb-2 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Open project settings
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Settings
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete project "${project.name}"?`)) {
                          deleteProject(project.id);
                        }
                      }}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}

            {projects.length === 0 && (
              <div className="p-6 text-center text-gray-500 dark:text-cinema-text-muted">
                <div className="text-4xl mb-2">📁</div>
                <div className="text-sm">No projects created yet</div>
                <div className="text-xs mt-1">Create a project to organize your scenes</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-cinema-panel rounded-lg p-6 w-96 border border-transparent dark:border-cinema-border shadow-xl dark:shadow-glow-soft">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-cinema-text">
              Create New Project
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g., Fantasy Series, Product Photos, etc."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Brief description of this project..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text resize-none"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 dark:disabled:bg-cinema-border text-white rounded-md transition-all duration-300"
              >
                Create Project
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewProjectName('');
                  setNewProjectDescription('');
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

export default ProjectSelector;