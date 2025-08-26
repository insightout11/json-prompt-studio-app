import React, { useState } from 'react';

const SceneSelectionModal = ({ isOpen, onClose, storyboardData, onLoadScene }) => {
  const [selectedScene, setSelectedScene] = useState(null);

  if (!isOpen || !storyboardData) return null;

  // Debug logging to understand the data structure
  console.log('SceneSelectionModal - storyboardData:', storyboardData);
  console.log('SceneSelectionModal - storyboardData.data:', storyboardData.data);
  console.log('SceneSelectionModal - storyboardData.data?.storyboard:', storyboardData.data?.storyboard);

  const { overview, scenes, sceneCount, totalDuration } = storyboardData.data?.storyboard || {};
  const storyboardTitle = storyboardData.name || 'Storyboard';

  const handleLoadOverview = () => {
    // Load the overview data (all scenes combined or summary)
    onLoadScene(overview?.formFields || overview, 'overview');
    onClose();
  };

  const handleLoadSpecificScene = (sceneIndex) => {
    const scene = scenes[sceneIndex];
    if (scene && scene.formFields) {
      onLoadScene(scene.formFields, `scene-${sceneIndex + 1}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-8" style={{zIndex: 9999}}>
      <div className="bg-white dark:bg-cinema-panel rounded-lg p-6 w-full max-w-4xl max-h-[85vh] overflow-y-auto border border-transparent dark:border-cinema-border shadow-xl transition-all duration-300 relative m-4">
        {/* Close X button */}
        <button
          onClick={onClose}
          className="absolute w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all"
          style={{
            top: '16px',
            right: '16px',
            zIndex: 10,
            position: 'absolute'
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="pr-10 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-cinema-text mb-2">
            Load from "{storyboardTitle}"
          </h2>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center space-x-1">
              <span>🎬</span>
              <span>{sceneCount || scenes?.length || 0} scenes</span>
            </span>
            {totalDuration && (
              <span className="flex items-center space-x-1">
                <span>⏱️</span>
                <span>{totalDuration}</span>
              </span>
            )}
          </div>
        </div>

        {/* Overview Option */}
        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-cinema-text mb-1">
                📋 Complete Storyboard Overview
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Load the combined storyboard data with all scenes merged
              </p>
            </div>
            <button
              onClick={handleLoadOverview}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all font-medium"
            >
              Load Overview
            </button>
          </div>
        </div>

        {/* Individual Scenes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-cinema-text mb-4">
            Individual Scenes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenes?.map((scene, index) => (
              <div key={index} className="bg-gray-50 dark:bg-cinema-card rounded-lg p-4 border border-gray-200 dark:border-cinema-border hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-cinema-text">
                      Scene {scene.scene_number || index + 1}: {scene.title}
                    </h4>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {scene.duration_seconds && (
                        <span>⏱️ {scene.duration_seconds}s</span>
                      )}
                      {scene.setting && (
                        <span>📍 {typeof scene.setting === 'string' ? scene.setting.slice(0, 20) + '...' : 'Location set'}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {typeof scene.description === 'string' 
                    ? scene.description 
                    : 'Scene description available'}
                </p>

                {/* Scene tags/elements */}
                {scene.key_visual_elements && scene.key_visual_elements.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {scene.key_visual_elements.slice(0, 3).map((element, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                          {element}
                        </span>
                      ))}
                      {scene.key_visual_elements.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{scene.key_visual_elements.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleLoadSpecificScene(index)}
                  className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md transition-all"
                >
                  Load Scene {scene.scene_number || index + 1}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneSelectionModal;