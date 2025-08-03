import React, { useState } from 'react';

const SceneOptionPreviewModal = ({ option, isOpen, onClose, onApply, currentScene }) => {
  const [mergeStrategy, setMergeStrategy] = useState('smart');

  if (!isOpen || !option) return null;

  const handleApply = () => {
    onApply(option, mergeStrategy);
    onClose();
  };

  // Calculate JSON differences for preview
  const getFieldChanges = () => {
    if (!option.json || !currentScene) return [];
    
    const changes = [];
    Object.entries(option.json).forEach(([key, value]) => {
      if (currentScene[key] !== value) {
        changes.push({
          field: key,
          from: currentScene[key] || '(empty)',
          to: value,
          type: currentScene[key] ? 'modified' : 'added'
        });
      }
    });
    return changes;
  };

  const fieldChanges = getFieldChanges();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-cinema-border">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{option.icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-cinema-text">
                {option.type}
              </h3>
              <p className="text-sm text-gray-500 dark:text-cinema-text-muted">
                Scene Extension Preview
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-cinema-card rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[60vh]">
          {/* Left Panel - Description */}
          <div className="flex-1 p-6 overflow-y-auto border-r border-gray-200 dark:border-cinema-border">
            <div className="space-y-4">
              {/* Summary */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
                  Summary
                </h4>
                <p className="text-sm text-gray-600 dark:text-cinema-text-muted leading-relaxed">
                  {option.summary}
                </p>
              </div>

              {/* Full Description */}
              {option.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
                    Full Description
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-cinema-text-muted leading-relaxed">
                    {option.description}
                  </p>
                </div>
              )}

              {/* Expected Changes */}
              {fieldChanges.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
                    Expected Changes ({fieldChanges.length} fields)
                  </h4>
                  <div className="space-y-2">
                    {fieldChanges.slice(0, 5).map((change, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-cinema-card rounded p-3 text-xs">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            change.type === 'added' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          }`}>
                            {change.type}
                          </span>
                          <span className="font-medium text-gray-700 dark:text-cinema-text">
                            {change.field}
                          </span>
                        </div>
                        <div className="text-gray-600 dark:text-cinema-text-muted">
                          {change.type === 'modified' && (
                            <>
                              <div className="text-red-600 dark:text-red-400">- {change.from}</div>
                              <div className="text-green-600 dark:text-green-400">+ {change.to}</div>
                            </>
                          )}
                          {change.type === 'added' && (
                            <div className="text-green-600 dark:text-green-400">+ {change.to}</div>
                          )}
                        </div>
                      </div>
                    ))}
                    {fieldChanges.length > 5 && (
                      <p className="text-xs text-gray-500 dark:text-cinema-text-muted">
                        ...and {fieldChanges.length - 5} more changes
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Merge Strategy */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
                  Merge Strategy
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      value: 'smart',
                      label: 'Smart merge',
                      description: 'Intelligently combines scenes, preserving existing characters while updating settings and style'
                    },
                    {
                      value: 'replace',
                      label: 'Replace merge',
                      description: 'Completely replaces current scene with the new extension'
                    },
                    {
                      value: 'merge',
                      label: 'Additive merge',
                      description: 'Adds new fields without removing existing content'
                    }
                  ].map((strategy) => (
                    <label key={strategy.value} className="block cursor-pointer">
                      <div className="flex items-start space-x-2">
                        <input
                          type="radio"
                          name="mergeStrategy"
                          value={strategy.value}
                          checked={mergeStrategy === strategy.value}
                          onChange={(e) => setMergeStrategy(e.target.value)}
                          className="text-purple-500 focus:ring-purple-500 mt-1"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700 dark:text-cinema-text">
                            {strategy.label}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-cinema-text-muted mt-1">
                            {strategy.description}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - JSON Preview */}
          <div className="w-96 p-6 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
              JSON Preview
            </h4>
            <div className="bg-gray-900 dark:bg-cinema-black rounded p-3 text-xs">
              <pre className="text-green-400 dark:text-cinema-teal font-mono whitespace-pre-wrap">
                {JSON.stringify(option.json || {}, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-cinema-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-cinema-text-muted hover:text-gray-800 dark:hover:text-cinema-text transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-md transition-colors"
          >
            Apply Scene Extension
          </button>
        </div>
      </div>
    </div>
  );
};

export default SceneOptionPreviewModal;