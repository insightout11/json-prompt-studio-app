import React, { useState, useRef } from 'react';
import aiApiService from './aiApiService';
import jsonValidator from './jsonValidator';
import { OPTIMIZATION_MODES } from './aiSystemPrompts';

const EnhancedAIOptimizer = ({ 
  jsonPrompt, 
  onOptimized, 
  userPreferences = {},
  targetPlatform = 'video',
  className = "",
  showAdvancedOptions = true
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedMode, setSelectedMode] = useState('visualSpectacle');
  const [quickMode, setQuickMode] = useState(false);
  const [optimizationHistory, setOptimizationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedBatchModes, setSelectedBatchModes] = useState(['visualSpectacle', 'emotionalResonance']);
  const abortControllerRef = useRef(null);

  // Enhanced optimization modes with new professional options
  const enhancedOptimizationModes = [
    // Original modes (updated)
    { id: 'enhance', label: 'General Enhancement', icon: '✨', description: 'Improve overall quality and clarity', category: 'basic' },
    { id: 'platform', label: 'Platform Optimize', icon: '📱', description: 'Optimize for specific platform requirements', category: 'basic' },
    { id: 'viral', label: 'Viral Potential', icon: '🔥', description: 'Maximize engagement and shareability', category: 'basic' },
    
    // New professional modes
    { id: 'visualSpectacle', label: 'Visual Spectacle', icon: '🎇', description: 'Maximize visual drama and cinematic impact', category: 'professional' },
    { id: 'emotionalResonance', label: 'Emotional Resonance', icon: '💫', description: 'Deepen emotional impact and audience connection', category: 'professional' },
    { id: 'platformSpecific', label: 'Platform-Specific', icon: '🎯', description: 'Advanced platform optimization and targeting', category: 'professional' },
    { id: 'narrativeCohesion', label: 'Narrative Cohesion', icon: '📚', description: 'Improve story structure and narrative flow', category: 'professional' },
    { id: 'technicalExcellence', label: 'Technical Excellence', icon: '⚙️', description: 'Professional-grade technical specifications', category: 'professional' },

    // Quick enhancement modes
    { id: 'clarity', label: 'Clarity Boost', icon: '🔍', description: 'Quick clarity and readability improvements', category: 'quick' },
    { id: 'creativity', label: 'Creative Boost', icon: '🎨', description: 'Add creative flair and artistic elements', category: 'quick' },
    { id: 'engagement', label: 'Engagement Boost', icon: '👥', description: 'Quick engagement and interest optimization', category: 'quick' }
  ];

  // Handle single optimization
  const optimizePrompt = async (mode = selectedMode, options = {}) => {
    if (!jsonPrompt || Object.keys(jsonPrompt).length === 0) {
      setError('No prompt to optimize. Please create a prompt first.');
      return;
    }

    if (!aiApiService.hasApiKey()) {
      setError('OpenAI API key required. Please set your API key in settings.');
      return;
    }

    setIsOptimizing(true);
    setError(null);
    setOptimizationResult(null);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      console.log(`Optimizing prompt with mode: ${mode}`);
      
      const optimizationPreferences = {
        ...userPreferences,
        platform: targetPlatform,
        quickMode: quickMode,
        preserveIntent: true,
        enhanceDetails: true,
        ...options.additionalPreferences
      };

      const response = await aiApiService.optimizePrompt(
        jsonPrompt,
        mode,
        optimizationPreferences
      );

      if (response.success) {
        // Validate and parse the AI response
        const validationResult = jsonValidator.validateAndRepair(
          response.optimizedPrompt,
          jsonPrompt
        );

        const optimizedPrompt = {
          ...validationResult.data,
          _metadata: {
            optimizationType: mode,
            originalPrompt: jsonPrompt,
            aiOptimized: true,
            timestamp: Date.now(),
            usage: response.usage,
            validationWarnings: validationResult.warnings,
            validationRepairs: validationResult.repairs
          }
        };

        setOptimizationResult({
          id: Date.now(),
          mode: mode,
          prompt: optimizedPrompt,
          success: true,
          metadata: response.metadata
        });

        // Add to history
        addToHistory({
          id: Date.now(),
          mode: mode,
          timestamp: Date.now(),
          prompt: optimizedPrompt,
          originalPrompt: jsonPrompt
        });

        // Auto-apply if in quick mode
        if (quickMode) {
          onOptimized(optimizedPrompt);
        }

      } else {
        // Handle API failure with fallback
        if (response.fallback) {
          const fallbackPrompt = {
            ...response.fallback,
            _metadata: {
              optimizationType: mode,
              originalPrompt: jsonPrompt,
              fallbackGenerated: true,
              timestamp: Date.now(),
              fallbackReason: response.error
            }
          };

          setOptimizationResult({
            id: Date.now(),
            mode: mode,
            prompt: fallbackPrompt,
            success: false,
            fallback: true,
            error: response.error
          });
        } else {
          setError(response.error);
        }
      }

    } catch (err) {
      console.error('Optimization error:', err);
      setError(err.message || 'Unknown error occurred during optimization');
    } finally {
      setIsOptimizing(false);
      abortControllerRef.current = null;
    }
  };

  // Handle batch optimization
  const optimizeBatch = async () => {
    if (selectedBatchModes.length === 0) {
      setError('Please select at least one optimization mode for batch processing.');
      return;
    }

    setBatchMode(true);
    setIsOptimizing(true);
    setError(null);

    const results = [];

    for (const mode of selectedBatchModes) {
      try {
        await optimizePrompt(mode, { 
          additionalPreferences: { 
            batchMode: true, 
            batchIndex: results.length 
          }
        });
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.warn(`Failed to optimize with ${mode}:`, error);
      }
    }

    setBatchMode(false);
  };

  // Cancel ongoing optimization
  const cancelOptimization = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsOptimizing(false);
      setBatchMode(false);
      setError('Optimization cancelled by user');
    }
  };

  // Apply optimization result
  const applyOptimization = (result) => {
    onOptimized(result.prompt);
    setOptimizationResult(null);
  };

  // Add to optimization history
  const addToHistory = (item) => {
    setOptimizationHistory(prev => [item, ...prev.slice(0, 9)]); // Keep last 10
  };

  // Load from history
  const loadFromHistory = (historyItem) => {
    setOptimizationResult({
      id: Date.now(),
      mode: historyItem.mode,
      prompt: historyItem.prompt,
      success: true,
      fromHistory: true
    });
  };

  // Get mode by ID
  const getModeById = (id) => {
    return enhancedOptimizationModes.find(mode => mode.id === id) || 
           { label: id, icon: '🔧', description: 'Custom optimization mode' };
  };

  // Get mode color
  const getModeColor = (mode) => {
    const colors = {
      basic: 'blue',
      professional: 'purple',
      quick: 'green'
    };
    const modeData = getModeById(mode);
    return colors[modeData.category] || 'gray';
  };

  // Group modes by category
  const groupedModes = enhancedOptimizationModes.reduce((groups, mode) => {
    const category = mode.category || 'other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(mode);
    return groups;
  }, {});

  return (
    <div className={`enhanced-ai-optimizer ${className}`}>
      {/* Main Optimization Button */}
      <div className="optimization-header">
        <button
          onClick={() => setShowOptions(!showOptions)}
          disabled={isOptimizing}
          className={`main-optimize-btn ${isOptimizing ? 'optimizing' : ''}`}
        >
          {isOptimizing ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{batchMode ? 'Batch Optimizing...' : 'Optimizing...'}</span>
              <button 
                onClick={cancelOptimization}
                className="cancel-btn"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span className="btn-icon">🛠️</span>
              <span>AI Optimizer Pro</span>
              <svg className={`w-4 h-4 transition-transform ${showOptions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>

        {/* Quick Actions */}
        {!showOptions && !isOptimizing && (
          <div className="quick-actions">
            <button
              onClick={() => optimizePrompt('visualSpectacle')}
              className="quick-btn visual"
              title="Enhance visual impact"
            >
              🎇 Visual
            </button>
            <button
              onClick={() => optimizePrompt('emotionalResonance')}
              className="quick-btn emotional"
              title="Deepen emotional connection"
            >
              💫 Emotional
            </button>
            <button
              onClick={() => optimizePrompt('technicalExcellence')}
              className="quick-btn technical"
              title="Professional technical quality"
            >
              ⚙️ Technical
            </button>
          </div>
        )}
      </div>

      {/* Advanced Optimization Options */}
      {showOptions && (
        <div className="optimization-options">
          {/* Mode Settings */}
          <div className="mode-settings">
            <div className="settings-row">
              <label className="quick-mode-label">
                <input
                  type="checkbox"
                  checked={quickMode}
                  onChange={(e) => setQuickMode(e.target.checked)}
                />
                <span>Quick Mode (auto-apply results)</span>
              </label>

              <label className="batch-mode-label">
                <input
                  type="checkbox"
                  checked={selectedBatchModes.length > 1}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedBatchModes(['visualSpectacle', 'emotionalResonance', 'technicalExcellence']);
                    } else {
                      setSelectedBatchModes([selectedMode]);
                    }
                  }}
                />
                <span>Batch Mode (multiple optimizations)</span>
              </label>
            </div>
          </div>

          {/* Optimization Mode Selection */}
          <div className="optimization-modes">
            <h4>Choose Optimization Mode(s):</h4>
            
            {Object.entries(groupedModes).map(([category, modes]) => (
              <div key={category} className="mode-category">
                <h5 className="category-title">
                  {category === 'basic' && '🚀 Basic Optimizations'}
                  {category === 'professional' && '💎 Professional Modes'}
                  {category === 'quick' && '⚡ Quick Enhancements'}
                </h5>
                
                <div className="mode-grid">
                  {modes.map((mode) => (
                    <label
                      key={mode.id}
                      className={`mode-option ${
                        selectedBatchModes.length > 1 
                          ? (selectedBatchModes.includes(mode.id) ? 'selected' : '')
                          : (selectedMode === mode.id ? 'selected' : '')
                      } color-${getModeColor(mode.id)}`}
                    >
                      <input
                        type={selectedBatchModes.length > 1 ? "checkbox" : "radio"}
                        name="optimization-mode"
                        value={mode.id}
                        checked={
                          selectedBatchModes.length > 1 
                            ? selectedBatchModes.includes(mode.id)
                            : selectedMode === mode.id
                        }
                        onChange={(e) => {
                          if (selectedBatchModes.length > 1) {
                            // Batch mode - toggle checkbox
                            if (e.target.checked) {
                              setSelectedBatchModes(prev => [...prev, mode.id]);
                            } else {
                              setSelectedBatchModes(prev => prev.filter(id => id !== mode.id));
                            }
                          } else {
                            // Single mode - radio button
                            setSelectedMode(mode.id);
                          }
                        }}
                      />
                      <div className="mode-content">
                        <div className="mode-header">
                          <span className="mode-icon">{mode.icon}</span>
                          <span className="mode-name">{mode.label}</span>
                        </div>
                        <p className="mode-description">{mode.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Platform-Specific Settings */}
          {showAdvancedOptions && (
            <div className="platform-settings">
              <h4>Platform & Preferences:</h4>
              <div className="settings-grid">
                <div className="setting-group">
                  <label>Target Platform:</label>
                  <select 
                    value={targetPlatform}
                    onChange={(e) => {
                      // This would need to be passed up to parent component
                      console.log('Platform changed to:', e.target.value);
                    }}
                  >
                    <option value="video">General Video</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                  </select>
                </div>
                
                <div className="setting-group">
                  <label>Enhancement Level:</label>
                  <select>
                    <option value="subtle">Subtle</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            {selectedBatchModes.length > 1 ? (
              <button
                onClick={optimizeBatch}
                disabled={isOptimizing}
                className="optimize-batch-btn"
              >
                🚀 Generate {selectedBatchModes.length} Optimizations
              </button>
            ) : (
              <button
                onClick={() => optimizePrompt(selectedMode)}
                disabled={isOptimizing}
                className="optimize-selected-btn"
              >
                🛠️ Optimize with {getModeById(selectedMode).label}
              </button>
            )}
            
            {optimizationHistory.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="history-btn"
              >
                📚 History ({optimizationHistory.length})
              </button>
            )}
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

      {/* Optimization Result */}
      {optimizationResult && (
        <div className="optimization-result">
          <div className="result-header">
            <h4>
              <span className="result-icon">{getModeById(optimizationResult.mode).icon}</span>
              {getModeById(optimizationResult.mode).label} Result
              {optimizationResult.fallback && (
                <span className="fallback-badge">Fallback</span>
              )}
              {optimizationResult.fromHistory && (
                <span className="history-badge">From History</span>
              )}
            </h4>
            <button 
              onClick={() => setOptimizationResult(null)}
              className="close-result"
            >
              ×
            </button>
          </div>
          
          {/* Optimization Preview */}
          <div className="result-preview">
            <div className="preview-section">
              <h5>Enhanced Scene:</h5>
              <p>{optimizationResult.prompt.scene?.substring(0, 200)}...</p>
            </div>
            
            {optimizationResult.prompt.optimization_notes && (
              <div className="preview-section">
                <h5>AI Improvements:</h5>
                <p>{optimizationResult.prompt.optimization_notes}</p>
              </div>
            )}

            {optimizationResult.prompt._metadata && (
              <div className="metadata-section">
                {optimizationResult.prompt._metadata.validationWarnings?.length > 0 && (
                  <p className="warnings">
                    ⚠️ {optimizationResult.prompt._metadata.validationWarnings.length} warnings
                  </p>
                )}
                {optimizationResult.prompt._metadata.validationRepairs?.length > 0 && (
                  <p className="repairs">
                    🔧 {optimizationResult.prompt._metadata.validationRepairs.length} repairs made
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Error Display for Result */}
          {optimizationResult.error && (
            <div className="result-error">
              <p>⚠️ {optimizationResult.error}</p>
            </div>
          )}

          {/* Result Actions */}
          <div className="result-actions">
            <button
              onClick={() => applyOptimization(optimizationResult)}
              className="apply-btn"
            >
              ✅ Apply Optimization
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(optimizationResult.prompt, null, 2));
              }}
              className="copy-btn"
            >
              📋 Copy JSON
            </button>
            <button
              onClick={() => {
                // Compare with original
                console.log('Original:', jsonPrompt);
                console.log('Optimized:', optimizationResult.prompt);
              }}
              className="compare-btn"
            >
              🔍 Compare
            </button>
          </div>
        </div>
      )}

      {/* Optimization History */}
      {showHistory && optimizationHistory.length > 0 && (
        <div className="optimization-history">
          <div className="history-header">
            <h4>Optimization History</h4>
            <button onClick={() => setShowHistory(false)}>×</button>
          </div>
          
          <div className="history-list">
            {optimizationHistory.map((item) => (
              <div key={item.id} className="history-item">
                <div className="history-content">
                  <span className="history-icon">{getModeById(item.mode).icon}</span>
                  <div className="history-details">
                    <div className="history-mode">{getModeById(item.mode).label}</div>
                    <div className="history-time">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => loadFromHistory(item)}
                  className="load-history-btn"
                >
                  Load
                </button>
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
            <p>AI Optimizer requires an OpenAI API key to enhance your prompts.</p>
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
        .enhanced-ai-optimizer {
          max-width: 900px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .optimization-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .main-optimize-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          flex: 1;
        }

        .main-optimize-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
        }

        .main-optimize-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .main-optimize-btn.optimizing {
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
          color: white;
        }

        .quick-btn.visual {
          background: #f59e0b;
        }

        .quick-btn.emotional {
          background: #ec4899;
        }

        .quick-btn.technical {
          background: #6b7280;
        }

        .quick-btn:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }

        .optimization-options {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e9ecef;
          margin-bottom: 20px;
        }

        .mode-settings {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #dee2e6;
        }

        .settings-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .quick-mode-label,
        .batch-mode-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .optimization-modes h4 {
          margin: 0 0 15px 0;
          color: #343a40;
        }

        .mode-category {
          margin-bottom: 25px;
        }

        .category-title {
          margin: 0 0 12px 0;
          color: #6c757d;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mode-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .mode-option {
          display: block;
          padding: 15px;
          border: 2px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }

        .mode-option:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .mode-option.selected {
          border-color: currentColor;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }

        .mode-option input {
          display: none;
        }

        .mode-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .mode-icon {
          font-size: 1.5rem;
        }

        .mode-name {
          font-weight: 600;
          color: #343a40;
        }

        .mode-description {
          margin: 0;
          color: #6c757d;
          font-size: 14px;
          line-height: 1.4;
        }

        .platform-settings h4 {
          margin: 0 0 15px 0;
          color: #343a40;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .setting-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #343a40;
        }

        .setting-group select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          background: white;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .optimize-selected-btn,
        .optimize-batch-btn,
        .history-btn {
          flex: 1;
          min-width: 200px;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .optimize-selected-btn {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          color: white;
        }

        .optimize-batch-btn {
          background: linear-gradient(135deg, #f093fb, #f5576c);
          color: white;
        }

        .history-btn {
          background: #6c757d;
          color: white;
          flex: none;
          min-width: auto;
        }

        .optimize-selected-btn:hover:not(:disabled),
        .optimize-batch-btn:hover:not(:disabled),
        .history-btn:hover {
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

        .optimization-result {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          overflow: hidden;
          margin: 15px 0;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .result-header h4 {
          margin: 0;
          color: #343a40;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .result-icon {
          font-size: 1.2rem;
        }

        .fallback-badge,
        .history-badge {
          background: #f0ad4e;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          margin-left: 8px;
        }

        .history-badge {
          background: #17a2b8;
        }

        .close-result {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #6c757d;
        }

        .result-preview {
          padding: 20px;
        }

        .preview-section {
          margin-bottom: 15px;
        }

        .preview-section h5 {
          margin: 0 0 8px 0;
          color: #343a40;
          font-size: 14px;
        }

        .preview-section p {
          margin: 0;
          color: #495057;
          font-size: 14px;
          line-height: 1.4;
        }

        .metadata-section {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e9ecef;
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
          padding: 10px 20px;
          margin: 0;
        }

        .result-error p {
          margin: 0;
          color: #c53030;
          font-size: 14px;
        }

        .result-actions {
          display: flex;
          gap: 8px;
          padding: 15px 20px;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
          flex-wrap: wrap;
        }

        .apply-btn,
        .copy-btn,
        .compare-btn {
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .apply-btn {
          background: #28a745;
          color: white;
        }

        .copy-btn {
          background: #6c757d;
          color: white;
        }

        .compare-btn {
          background: #17a2b8;
          color: white;
        }

        .apply-btn:hover,
        .copy-btn:hover,
        .compare-btn:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }

        .optimization-history {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          overflow: hidden;
          margin: 15px 0;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .history-header h4 {
          margin: 0;
          color: #343a40;
        }

        .history-header button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #6c757d;
        }

        .history-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          border-bottom: 1px solid #f8f9fa;
        }

        .history-item:last-child {
          border-bottom: none;
        }

        .history-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .history-icon {
          font-size: 1.2rem;
        }

        .history-mode {
          font-weight: 500;
          color: #343a40;
        }

        .history-time {
          font-size: 12px;
          color: #6c757d;
        }

        .load-history-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .load-history-btn:hover {
          background: #0056b3;
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

        /* Color variants for optimization modes */
        .color-blue { border-color: #3b82f6; }
        .color-purple { border-color: #8b5cf6; }
        .color-green { border-color: #10b981; }
        .color-gray { border-color: #6b7280; }

        @media (max-width: 768px) {
          .optimization-header {
            flex-direction: column;
            align-items: stretch;
          }

          .quick-actions {
            justify-content: space-between;
          }

          .mode-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .optimize-selected-btn,
          .optimize-batch-btn {
            min-width: auto;
          }

          .settings-row {
            flex-direction: column;
            gap: 10px;
          }

          .result-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedAIOptimizer;