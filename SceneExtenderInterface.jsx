import React, { useState } from 'react';
import SceneOptionPreviewModal from './SceneOptionPreviewModal';

const SceneExtenderInterface = ({ currentJson, onResult, onSceneExtenderClick, sceneOptions, onApplyOption, onDismissOptions, extensionLoading, extensionError }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewOption, setPreviewOption] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleGenerate = async () => {
    if (onSceneExtenderClick) {
      setIsGenerating(true);
      try {
        await onSceneExtenderClick();
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handlePreview = (option) => {
    setPreviewOption(option);
    setShowPreviewModal(true);
  };

  const handleQuickApply = (option, index) => {
    if (onApplyOption) {
      onApplyOption(option, index);
    }
  };

  const handleApplyFromPreview = (option, mergeStrategy) => {
    if (onApplyOption) {
      onApplyOption(option, 0, mergeStrategy);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-cinema-card rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
          Current Scene Preview:
        </h4>
        {currentJson && Object.keys(currentJson).length > 0 ? (
          <div className="bg-gray-900 dark:bg-cinema-black rounded p-3 text-xs">
            <pre className="text-green-400 dark:text-cinema-teal font-mono whitespace-pre-wrap">
              {JSON.stringify(currentJson, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-cinema-text-muted italic">
            No scene data available. Please create a scene first.
          </p>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700/50">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🎬</div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-cinema-text mb-1">
              AI Scene Extension
            </h4>
            <p className="text-xs text-gray-600 dark:text-cinema-text-muted mb-3">
              Generate 5 different scene continuations using AI. Each option will extend your current scene with new creative directions, character developments, or plot twists.
            </p>
            
            <button
              onClick={handleGenerate}
              disabled={extensionLoading || !currentJson || Object.keys(currentJson).length === 0}
              className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                extensionLoading || !currentJson || Object.keys(currentJson).length === 0
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {extensionLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating Scene Options...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate 5 Scene Options</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {extensionError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm text-red-700 dark:text-red-300">{extensionError}</span>
          </div>
        </div>
      )}

      {/* Generated Scene Options */}
      {sceneOptions && sceneOptions.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700/50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-cinema-text flex items-center space-x-2">
              <span>🎬</span>
              <span>Generated Scene Options</span>
            </h4>
            <button
              onClick={onDismissOptions}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Dismiss options"
            >
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sceneOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white dark:bg-cinema-card rounded-lg p-4 border border-gray-200 dark:border-cinema-border hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl flex-shrink-0">{option.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-gray-800 dark:text-cinema-text mb-1">
                      {option.type}
                    </h5>
                    <p className="text-xs text-gray-600 dark:text-cinema-text-muted mb-3 line-clamp-3">
                      {option.summary}
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePreview(option)}
                        className="flex-1 px-2 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-cinema-border dark:hover:bg-cinema-border/80 text-gray-700 dark:text-cinema-text rounded transition-colors"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleQuickApply(option, index)}
                        className="flex-1 px-2 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-xs text-gray-500 dark:text-cinema-text-muted text-center">
            Preview to see full details or Apply directly to your current scene
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-cinema-text-muted bg-gray-50 dark:bg-cinema-card rounded p-3">
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">How it works:</span>
        </div>
        <ul className="space-y-1 ml-5 list-disc">
          <li>AI analyzes your current scene structure and content</li>
          <li>Generates 5 unique continuation options with different creative directions</li>
          <li>Each option includes scene descriptions, character actions, and narrative elements</li>
          <li>Click any generated option to apply it to your current scene</li>
        </ul>
      </div>

      {/* Preview Modal */}
      <SceneOptionPreviewModal
        option={previewOption}
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setPreviewOption(null);
        }}
        onApply={handleApplyFromPreview}
        currentScene={currentJson}
      />
    </div>
  );
};

export default SceneExtenderInterface;