import React, { useState, useRef, useEffect } from 'react';
import usePromptStore from './store';

const EditableJsonOutput = ({ showToast }) => {
  const { getJsonOutput, setJsonFromText, validateJsonInput, getJsonDiff, undo } = usePromptStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedJson, setEditedJson] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(null);
  const textareaRef = useRef(null);

  // Get current JSON output
  const currentJson = getJsonOutput();
  const formattedJson = currentJson ? JSON.stringify(JSON.parse(currentJson), null, 2) : '{}';

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(textarea.scrollHeight, 200) + 'px';
    }
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      adjustTextareaHeight();
    }
  }, [editedJson, isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedJson(formattedJson);
    setValidationError('');
    // Focus and resize after state update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        adjustTextareaHeight();
      }
    }, 10);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedJson('');
    setValidationError('');
    setShowConfirmDialog(false);
    setPendingChanges(null);
  };

  const handleJsonChange = (e) => {
    const value = e.target.value;
    setEditedJson(value);
    
    // Real-time validation
    const validation = validateJsonInput(value);
    setValidationError(validation.valid ? '' : validation.error);
    
    // Auto-resize
    adjustTextareaHeight();
  };

  const handleSaveClick = () => {
    // Validate JSON first
    const validation = validateJsonInput(editedJson);
    if (!validation.valid) {
      setValidationError(validation.error);
      if (showToast?.showError) {
        showToast.showError(`Invalid JSON: ${validation.error}`);
      }
      return;
    }

    // Check for significant changes
    const diff = getJsonDiff(editedJson);
    if (!diff.valid) {
      setValidationError(diff.error);
      return;
    }

    const totalChanges = diff.changes.added.length + diff.changes.modified.length + diff.changes.removed.length;
    
    // Show confirmation for significant changes
    if (totalChanges >= 5) {
      setPendingChanges(diff.changes);
      setShowConfirmDialog(true);
      return;
    }

    // Apply changes directly for minor edits
    applyJsonChanges();
  };

  const applyJsonChanges = () => {
    const result = setJsonFromText(editedJson);
    
    if (result.success) {
      setIsEditing(false);
      setEditedJson('');
      setValidationError('');
      setShowConfirmDialog(false);
      setPendingChanges(null);
      
      if (showToast?.showSuccess) {
        showToast.showSuccess(result.message);
      }
    } else {
      setValidationError(result.error);
      if (showToast?.showError) {
        showToast.showError(result.error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      handleCancelEdit();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSaveClick();
    }
  };

  // Confirmation dialog component
  const ConfirmationDialog = () => {
    if (!showConfirmDialog || !pendingChanges) return null;

    const { added, modified, removed } = pendingChanges;

    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/50 flex items-center justify-center z-50 p-fluid-sm">
        <div className="bg-light-panel dark:bg-cinema-panel rounded-lg shadow-light-elevated dark:shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
          <div className="p-fluid-md">
            <h3 className="text-fluid-lg font-semibold text-gray-900 dark:text-white mb-fluid-sm">
              🔄 Confirm JSON Changes
            </h3>
            
            <p className="text-fluid-sm text-gray-600 dark:text-gray-300 mb-fluid-sm">
              You're about to make {added.length + modified.length + removed.length} changes to your scene. Review the changes below:
            </p>

            <div className="max-h-60 overflow-y-auto space-y-fluid-xs mb-fluid-md">
              {added.length > 0 && (
                <div>
                  <h4 className="text-fluid-sm font-medium text-green-700 dark:text-green-400 mb-2">
                    ✅ Added ({added.length})
                  </h4>
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-fluid-xs">
                    {added.map(({ key, value }, i) => (
                      <div key={i} className="text-green-800 dark:text-green-300 truncate">
                        <strong>{key}:</strong> "{String(value).substring(0, 50)}{String(value).length > 50 ? '...' : ''}"
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modified.length > 0 && (
                <div>
                  <h4 className="text-fluid-sm font-medium text-orange-700 dark:text-orange-400 mb-2">
                    🔄 Modified ({modified.length})
                  </h4>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded text-fluid-xs space-y-1">
                    {modified.map(({ key, oldValue, newValue }, i) => (
                      <div key={i} className="text-orange-800 dark:text-orange-300">
                        <strong>{key}:</strong>
                        <div className="ml-2">
                          <span className="line-through opacity-60">"{String(oldValue).substring(0, 30)}{String(oldValue).length > 30 ? '...' : ''}"</span>
                          <br />
                          <span>"{String(newValue).substring(0, 30)}{String(newValue).length > 30 ? '...' : ''}"</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {removed.length > 0 && (
                <div>
                  <h4 className="text-fluid-sm font-medium text-red-700 dark:text-red-400 mb-2">
                    ❌ Removed ({removed.length})
                  </h4>
                  <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-fluid-xs">
                    {removed.map(({ key, value }, i) => (
                      <div key={i} className="text-red-800 dark:text-red-300 truncate">
                        <strong>{key}:</strong> "{String(value).substring(0, 50)}{String(value).length > 50 ? '...' : ''}"
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-fluid-xs">
              <button
                onClick={applyJsonChanges}
                className="flex-1 px-fluid-sm py-fluid-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                ✅ Apply Changes
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setPendingChanges(null);
                }}
                className="flex-1 px-fluid-sm py-fluid-xs bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="relative">
        {!isEditing ? (
          // View Mode - Read-only formatted JSON
          <>
            <div 
              className="bg-light-card dark:bg-cinema-black rounded-lg p-3 sm:p-4 min-h-32 sm:min-h-40 md:min-h-48 lg:min-h-64 max-h-[40vh] sm:max-h-[50vh] overflow-auto border border-light-border dark:border-cinema-border"
              role="textbox"
              aria-readonly="true"
              aria-label="Generated JSON output"
              tabIndex="0"
            >
              <pre className="text-green-400 dark:text-cinema-teal text-xs sm:text-sm font-mono whitespace-pre-wrap" aria-live="polite">
                {currentJson || '{}'}
                <span className="animate-cursor-blink text-cinema-teal">▊</span>
              </pre>
            </div>
            
            {/* Edit Button - positioned in top-right outside scrollable area */}
            <button
              onClick={handleEditClick}
              className="absolute top-2 right-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md font-medium transition-all duration-200 opacity-80 hover:opacity-100 hover:scale-105 shadow-lg hover:shadow-xl z-20"
              title="Edit JSON directly (Ctrl+E)"
            >
              ✏️ Edit JSON
            </button>
          </>
        ) : (
          // Edit Mode - Editable textarea
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={editedJson}
              onChange={handleJsonChange}
              onKeyDown={handleKeyPress}
              className={`w-full p-3 sm:p-4 bg-light-card dark:bg-cinema-black text-light-primary dark:text-cinema-teal text-xs sm:text-sm font-mono rounded-lg border ${
                validationError 
                  ? 'border-red-500 focus:border-red-400' 
                  : 'border-gray-700 dark:border-cinema-border focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none`}
              style={{ minHeight: '192px', height: 'auto' }}
              placeholder="Enter valid JSON..."
              spellCheck={false}
            />
            
            {/* Validation Error */}
            {validationError && (
              <div className="absolute top-2 left-2 right-16 bg-red-600 text-white text-fluid-xs px-fluid-xs py-1 rounded opacity-90">
                ❌ {validationError}
              </div>
            )}
            
            {/* Edit Controls */}
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={handleSaveClick}
                disabled={!!validationError}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors min-h-8 sm:min-h-9 ${
                  validationError 
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                title="Save changes (Ctrl+Enter)"
              >
                💾 Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-2 sm:px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-xs sm:text-sm font-medium rounded-md transition-colors min-h-8 sm:min-h-9"
                title="Cancel editing (Escape)"
              >
                ✖️ Cancel
              </button>
            </div>
            
            {/* Keyboard Shortcuts Hint */}
            <div className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
              <span>💡 Tip: You can edit the JSON directly to add, modify, or remove fields</span>
              <span>⌨️ Ctrl+Enter to save, Escape to cancel</span>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog />
    </>
  );
};

export default EditableJsonOutput;