import React, { useState, useRef } from 'react';
import aiApiService from './aiApiService';
import jsonValidator from './jsonValidator';
import { CONTINUATION_TYPES } from './aiSystemPrompts';

const SceneExtender = ({ 
  currentScene, 
  onSceneExtended, 
  onTimeline, 
  className = "",
  showAdvancedOptions = true,
  userPreferences = {}
}) => {
  const [isExtending, setIsExtending] = useState(false);
  const [extendingType, setExtendingType] = useState(null); // Track which specific type is loading
  const [showOptions, setShowOptions] = useState(false);
  const [selectedType, setSelectedType] = useState('logical');
  const [extensionResults, setExtensionResults] = useState([]);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [quickMode, setQuickMode] = useState(false);
  const [contextSettings, setContextSettings] = useState({
    preserveStyle: true,
    enhanceVisuals: false,
    maintainTone: true,
    addDetails: true
  });
  const abortControllerRef = useRef(null);

  // Handle scene extension with comprehensive error handling
  const extendScene = async (continuationType = selectedType, options = {}) => {
    if (!currentScene || Object.keys(currentScene).length === 0) {
      setError('No scene to extend. Please create a scene first.');
      return;
    }

    if (!aiApiService.hasApiKey()) {
      setError('OpenAI API key required. Please set your API key in settings.');
      return;
    }

    setIsExtending(true);
    setExtendingType(continuationType);
    setError(null);
    setExtensionResults([]);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      // Build additional context from settings and preferences
      const additionalContext = {
        userPreferences: userPreferences,
        contextSettings: contextSettings,
        preserveStyle: contextSettings.preserveStyle,
        enhanceVisuals: contextSettings.enhanceVisuals,
        maintainTone: contextSettings.maintainTone,
        addDetails: contextSettings.addDetails,
        quickMode: quickMode,
        ...options.additionalContext
      };

      console.log(`Extending scene with type: ${continuationType}`);
      const response = await aiApiService.extendScene(
        currentScene, 
        continuationType, 
        additionalContext
      );

      if (response.success) {
        // Validate and parse the AI response
        const validationResult = jsonValidator.validateAndRepair(
          response.scene, 
          currentScene
        );

        const extendedScene = {
          ...validationResult.data,
          _metadata: {
            continuationType: continuationType,
            originalScene: currentScene,
            aiGenerated: true,
            timestamp: Date.now(),
            usage: response.usage,
            validationWarnings: validationResult.warnings,
            validationRepairs: validationResult.repairs
          }
        };

        setExtensionResults([{
          id: Date.now(),
          type: continuationType,
          scene: extendedScene,
          success: true,
          metadata: response.metadata
        }]);

        setShowResults(true);
        
        // Auto-apply if in quick mode
        if (quickMode) {
          onSceneExtended(extendedScene);
        }

      } else {
        // Handle API failure with fallback
        if (response.fallback) {
          const fallbackScene = {
            ...response.fallback,
            _metadata: {
              continuationType: continuationType,
              originalScene: currentScene,
              fallbackGenerated: true,
              timestamp: Date.now(),
              fallbackReason: response.error
            }
          };

          setExtensionResults([{
            id: Date.now(),
            type: continuationType,
            scene: fallbackScene,
            success: false,
            fallback: true,
            error: response.error
          }]);

          setShowResults(true);
        } else {
          setError(response.error);
        }
      }

    } catch (err) {
      console.error('Scene extension error:', err);
      setError(err.message || 'Unknown error occurred during scene extension');
    } finally {
      setIsExtending(false);
      setExtendingType(null);
      abortControllerRef.current = null;
    }
  };

  // Generate multiple extensions at once
  const generateMultipleExtensions = async () => {
    const types = ['logical', 'twist', 'genreShift', 'characterDevelopment'];
    const results = [];
    
    setIsExtending(true);
    setError(null);
    setExtensionResults([]);

    for (const type of types) {
      try {
        await extendScene(type, { 
          additionalContext: { 
            batchMode: true, 
            batchIndex: results.length 
          }
        });
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.warn(`Failed to generate ${type} extension:`, error);
      }
    }
  };

  // Cancel ongoing extension
  const cancelExtension = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsExtending(false);
      setExtendingType(null);
      setError('Extension cancelled by user');
    }
  };

  // Apply an extension result
  const applyExtension = (result) => {
    onSceneExtended(result.scene);
    setShowResults(false);
  };

  // Add to timeline if timeline manager is available
  const addToTimeline = (result) => {
    if (onTimeline) {
      onTimeline({
        type: 'add_scene',
        scene: result.scene,
        continuationType: result.type,
        position: 'after_current'
      });
    }
  };

  // Get icon for continuation type
  const getTypeIcon = (type) => {
    const icons = {
      logical: '🔗',
      twist: '🌪️',
      genreShift: '🎭',
      characterDevelopment: '👤',
      flashback: '⏮️',
      timeSkip: '⏭️',
      alternateReality: '🌀',
      environmentalEscalation: '🌍'
    };
    return icons[type] || '🎬';
  };

  // Get color for continuation type
  const getTypeColor = (type) => {
    const colors = {
      logical: 'blue',
      twist: 'purple',
      genreShift: 'orange',
      characterDevelopment: 'green',
      flashback: 'indigo',
      timeSkip: 'cyan',
      alternateReality: 'pink',
      environmentalEscalation: 'emerald'
    };
    return colors[type] || 'gray';
  };

  return (
    <div className={`scene-extender ${className}`}>
      {/* Main Extension Button */}
      <div className="extension-header">
        <button
          onClick={() => setShowOptions(!showOptions)}
          disabled={isExtending}
          className={`main-extend-btn ${isExtending ? 'extending' : ''}`}
        >
          {isExtending ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Extending Scene...</span>
              <button 
                onClick={cancelExtension}
                className="cancel-btn"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span className="btn-icon">🎬</span>
              <span>Scene Extender</span>
              <svg className={`w-4 h-4 transition-transform ${showOptions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>

        {/* Quick Actions */}
        {!showOptions && !isExtending && (
          <div className="quick-actions">
            <button
              onClick={() => extendScene('logical')}
              className="quick-btn logical"
              title="Logical continuation"
            >
              🔗 Continue
            </button>
            <button
              onClick={() => extendScene('twist')}
              className="quick-btn twist"
              title="Add unexpected twist"
            >
              🌪️ Twist
            </button>
            <button
              onClick={generateMultipleExtensions}
              className="quick-btn multiple"
              title="Generate 4 different extensions"
            >
              ✨ Multi
            </button>
          </div>
        )}
      </div>

      {/* Advanced Extension Options */}
      {showOptions && (
        <div className="extension-options">
          {/* Quick Mode Toggle */}
          <div className="mode-toggle">
            <label className="quick-mode-label">
              <input
                type="checkbox"
                checked={quickMode}
                onChange={(e) => setQuickMode(e.target.checked)}
              />
              <span>Quick Mode (auto-apply results)</span>
            </label>
          </div>

          {/* Continuation Type Selection */}
          <div className="continuation-types">
            <h4>Choose Extension Type:</h4>
            <div className="type-grid">
              {CONTINUATION_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id);
                    if (!isExtending) {
                      extendScene(type.id);
                    }
                  }}
                  disabled={isExtending}
                  className={`type-option ${selectedType === type.id ? 'selected' : ''} ${isExtending && extendingType === type.id ? 'extending' : ''} color-${getTypeColor(type.id)}`}
                >
                  <div className="type-content">
                    <div className="type-header">
                      <span className="type-icon">
                        {isExtending && extendingType === type.id ? (
                          <span className="animate-pulse">⏳</span>
                        ) : (
                          getTypeIcon(type.id)
                        )}
                      </span>
                      <span className="type-name">
                        {type.name}
                        {isExtending && extendingType === type.id && <span className="text-xs ml-1">(Processing...)</span>}
                      </span>
                    </div>
                    <p className="type-description">{type.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Context Settings */}
          {showAdvancedOptions && (
            <div className="context-settings">
              <h4>Extension Settings:</h4>
              <div className="settings-grid">
                <label className="setting-item">
                  <input
                    type="checkbox"
                    checked={contextSettings.preserveStyle}
                    onChange={(e) => setContextSettings(prev => ({
                      ...prev,
                      preserveStyle: e.target.checked
                    }))}
                  />
                  <span>Preserve Visual Style</span>
                </label>
                <label className="setting-item">
                  <input
                    type="checkbox"
                    checked={contextSettings.maintainTone}
                    onChange={(e) => setContextSettings(prev => ({
                      ...prev,
                      maintainTone: e.target.checked
                    }))}
                  />
                  <span>Maintain Tone & Mood</span>
                </label>
                <label className="setting-item">
                  <input
                    type="checkbox"
                    checked={contextSettings.enhanceVisuals}
                    onChange={(e) => setContextSettings(prev => ({
                      ...prev,
                      enhanceVisuals: e.target.checked
                    }))}
                  />
                  <span>Enhance Visual Details</span>
                </label>
                <label className="setting-item">
                  <input
                    type="checkbox"
                    checked={contextSettings.addDetails}
                    onChange={(e) => setContextSettings(prev => ({
                      ...prev,
                      addDetails: e.target.checked
                    }))}
                  />
                  <span>Add Rich Details</span>
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              onClick={() => extendScene(selectedType)}
              disabled={isExtending}
              className="extend-selected-btn"
            >
              🎬 Generate {CONTINUATION_TYPES.find(t => t.id === selectedType)?.name}
            </button>
            
            <button
              onClick={generateMultipleExtensions}
              disabled={isExtending}
              className="extend-multiple-btn"
            >
              ✨ Generate 4 Extensions
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-display">
          <div className="error-content">
            <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <button 
            onClick={() => setError(null)}
            className="dismiss-error"
          >
            ×
          </button>
        </div>
      )}

      {/* Extension Results */}
      {showResults && extensionResults.length > 0 && (
        <div className="extension-results">
          <div className="results-header">
            <h4>Generated Extensions ({extensionResults.length})</h4>
            <button 
              onClick={() => setShowResults(false)}
              className="close-results"
            >
              ×
            </button>
          </div>
          
          <div className="results-grid">
            {extensionResults.map((result) => (
              <div 
                key={result.id} 
                className={`result-card ${result.success ? 'success' : 'fallback'} color-${getTypeColor(result.type)}`}
              >
                <div className="result-header">
                  <span className="result-icon">{getTypeIcon(result.type)}</span>
                  <span className="result-type">
                    {CONTINUATION_TYPES.find(t => t.id === result.type)?.name}
                  </span>
                  {result.fallback && (
                    <span className="fallback-badge">Fallback</span>
                  )}
                </div>
                
                {/* Scene Preview */}
                <div className="scene-preview">
                  <p><strong>Scene:</strong> {result.scene.scene?.substring(0, 150)}...</p>
                  {result.scene.setting && (
                    <p><strong>Setting:</strong> {result.scene.setting}</p>
                  )}
                  {result.scene.tone && (
                    <p><strong>Tone:</strong> {result.scene.tone}</p>
                  )}
                </div>

                {/* Metadata */}
                {result.scene._metadata && (
                  <div className="metadata-preview">
                    {result.scene._metadata.validationWarnings?.length > 0 && (
                      <p className="warnings">
                        ⚠️ {result.scene._metadata.validationWarnings.length} warnings
                      </p>
                    )}
                    {result.scene._metadata.validationRepairs?.length > 0 && (
                      <p className="repairs">
                        🔧 {result.scene._metadata.validationRepairs.length} repairs made
                      </p>
                    )}
                  </div>
                )}

                {/* Error Display */}
                {result.error && (
                  <div className="result-error">
                    <p>⚠️ {result.error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="result-actions">
                  <button
                    onClick={() => applyExtension(result)}
                    className="apply-btn"
                  >
                    ✅ Apply Scene
                  </button>
                  {onTimeline && (
                    <button
                      onClick={() => addToTimeline(result)}
                      className="timeline-btn"
                    >
                      📽️ Add to Timeline
                    </button>
                  )}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(result.scene, null, 2));
                    }}
                    className="copy-btn"
                  >
                    📋 Copy JSON
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Key Setup Prompt */}
      {!aiApiService.hasApiKey() && (
        <div className="api-key-prompt">
          <div className="prompt-content">
            <h4>🔑 OpenAI API Key Required</h4>
            <p>Scene Extender requires an OpenAI API key to generate continuations.</p>
            <button 
              onClick={() => {
                const key = prompt('Enter your OpenAI API key:');
                if (key) {
                  aiApiService.setApiKey(key);
                }
              }}
              className="setup-key-btn"
            >
              Set API Key
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .scene-extender {
          width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .extension-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .main-extend-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          flex: 1;
          font-size: 14px;
        }

        .main-extend-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .main-extend-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .main-extend-btn.extending {
          background: linear-gradient(135deg, #f093fb, #f5576c);
        }

        .btn-icon {
          font-size: 1.2rem;
        }

        .cancel-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          margin-left: 8px;
        }

        .quick-actions {
          display: flex;
          gap: 8px;
        }

        .quick-btn {
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .quick-btn.logical {
          background: #3b82f6;
          color: white;
        }

        .quick-btn.twist {
          background: #8b5cf6;
          color: white;
        }

        .quick-btn.multiple {
          background: #f59e0b;
          color: white;
        }

        .quick-btn:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }

        .extension-options {
          background: var(--bg-secondary, #f8f9fa);
          padding: 16px;
          border-radius: 8px;
          border: 1px solid var(--border-color, #e9ecef);
          margin-bottom: 16px;
        }
        
        .dark .extension-options {
          background: #1f2937;
          border-color: #374151;
        }

        .mode-toggle {
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-light, #dee2e6);
        }
        
        .dark .mode-toggle {
          border-bottom-color: #4b5563;
        }

        .quick-mode-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .continuation-types h4 {
          margin: 0 0 12px 0;
          color: var(--text-primary, #343a40);
          font-size: 14px;
        }
        
        .dark .continuation-types h4 {
          color: #f3f4f6;
        }

        .type-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 6px;
          margin-bottom: 12px;
        }

        .type-option {
          display: block;
          padding: 8px 10px;
          border: 1px solid transparent;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--bg-card, white);
          text-align: left;
          width: 100%;
        }
        
        .type-option:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .type-option.extending {
          background: linear-gradient(135deg, #f093fb, #f5576c);
          color: white;
          border-color: #f093fb;
        }
        
        .dark .type-option {
          background: #374151;
        }
        
        .dark .type-option.extending {
          background: linear-gradient(135deg, #f093fb, #f5576c);
        }

        .type-option:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .type-option.selected {
          border-color: currentColor;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }

        .type-option input {
          display: none;
        }

        .type-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .type-icon {
          font-size: 1.2rem;
        }

        .type-name {
          font-weight: 600;
          color: var(--text-primary, #343a40);
          font-size: 14px;
        }
        
        .dark .type-name {
          color: #f3f4f6;
        }

        .type-description {
          margin: 0;
          color: var(--text-secondary, #6c757d);
          font-size: 11px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .dark .type-description {
          color: #9ca3af;
        }

        .context-settings h4 {
          margin: 0 0 12px 0;
          color: var(--text-primary, #343a40);
          font-size: 14px;
        }
        
        .dark .context-settings h4 {
          color: #f3f4f6;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 8px;
          margin-bottom: 16px;
        }

        .setting-item {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: background 0.2s;
          font-size: 14px;
        }

        .setting-item:hover {
          background: rgba(0,0,0,0.05);
        }
        
        .dark .setting-item:hover {
          background: rgba(255,255,255,0.05);
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .extend-selected-btn,
        .extend-multiple-btn {
          flex: 1;
          min-width: 140px;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .extend-selected-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .extend-multiple-btn {
          background: linear-gradient(135deg, #f093fb, #f5576c);
          color: white;
        }

        .extend-selected-btn:hover:not(:disabled),
        .extend-multiple-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        .error-display {
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 8px;
          padding: 12px;
          margin: 15px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .error-content {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #c53030;
        }

        .error-icon {
          width: 20px;
          height: 20px;
        }

        .dismiss-error {
          background: none;
          border: none;
          color: #c53030;
          cursor: pointer;
          font-size: 18px;
          padding: 4px;
        }

        .extension-results {
          background: var(--bg-card, white);
          border: 1px solid var(--border-color, #e9ecef);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .dark .extension-results {
          background: #374151;
          border-color: #4b5563;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: var(--bg-secondary, #f8f9fa);
          border-bottom: 1px solid var(--border-color, #e9ecef);
        }
        
        .dark .results-header {
          background: #1f2937;
          border-bottom-color: #4b5563;
        }

        .results-header h4 {
          margin: 0;
          color: var(--text-primary, #343a40);
          font-size: 14px;
        }
        
        .dark .results-header h4 {
          color: #f3f4f6;
        }

        .close-results {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #6c757d;
        }

        .results-grid {
          padding: 16px;
          display: grid;
          gap: 12px;
        }

        .result-card {
          border: 1px solid var(--border-color, #e9ecef);
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s;
          background: var(--bg-card, white);
        }
        
        .dark .result-card {
          background: #4b5563;
          border-color: #6b7280;
        }

        .result-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }

        .result-card.fallback {
          background: #fff3cd;
          border-color: #ffeaa7;
        }

        .result-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
        }

        .result-icon {
          font-size: 1.5rem;
        }

        .result-type {
          font-weight: 600;
          color: var(--text-primary, #343a40);
          flex: 1;
          font-size: 14px;
        }
        
        .dark .result-type {
          color: #f3f4f6;
        }

        .fallback-badge {
          background: #f0ad4e;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
        }

        .scene-preview {
          margin-bottom: 15px;
        }

        .scene-preview p {
          margin: 6px 0;
          color: var(--text-secondary, #495057);
          font-size: 12px;
        }
        
        .dark .scene-preview p {
          color: #d1d5db;
        }

        .metadata-preview {
          margin-bottom: 15px;
          font-size: 12px;
        }

        .warnings {
          color: #f0ad4e;
        }

        .repairs {
          color: #5cb85c;
        }

        .result-error {
          background: #fee;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 15px;
        }

        .result-error p {
          margin: 0;
          color: #c53030;
          font-size: 14px;
        }

        .result-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .apply-btn,
        .timeline-btn,
        .copy-btn {
          padding: 6px 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
          font-weight: 500;
        }

        .apply-btn {
          background: #28a745;
          color: white;
        }

        .timeline-btn {
          background: #17a2b8;
          color: white;
        }

        .copy-btn {
          background: #6c757d;
          color: white;
        }

        .apply-btn:hover,
        .timeline-btn:hover,
        .copy-btn:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }

        .api-key-prompt {
          background: linear-gradient(135deg, #ffecd2, #fcb69f);
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          margin: 20px 0;
        }

        .prompt-content h4 {
          margin: 0 0 10px 0;
          color: #8b4513;
        }

        .prompt-content p {
          margin: 0 0 15px 0;
          color: #a0522d;
        }

        .setup-key-btn {
          background: #8b4513;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        /* Color variants for continuation types */
        .color-blue { border-color: #3b82f6; }
        .color-purple { border-color: #8b5cf6; }
        .color-orange { border-color: #f59e0b; }
        .color-green { border-color: #10b981; }
        .color-indigo { border-color: #6366f1; }
        .color-cyan { border-color: #06b6d4; }
        .color-pink { border-color: #ec4899; }
        .color-emerald { border-color: #059669; }

        @media (max-width: 768px) {
          .extension-header {
            flex-direction: column;
            align-items: stretch;
          }

          .quick-actions {
            justify-content: space-between;
          }

          .type-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .extend-selected-btn,
          .extend-multiple-btn {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default SceneExtender;