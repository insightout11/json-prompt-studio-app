import React, { useState, useEffect, useRef } from 'react';
import SceneExtender from './SceneExtender';

const TimelineManager = ({ 
  initialScenes = [], 
  onTimelineUpdate, 
  onSceneSelect,
  currentSceneIndex = 0,
  className = ""
}) => {
  const [scenes, setScenes] = useState(initialScenes);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(currentSceneIndex);
  const [timelineMode, setTimelineMode] = useState('horizontal'); // horizontal, vertical, grid
  const [showSceneDetails, setShowSceneDetails] = useState(false);
  const [draggedScene, setDraggedScene] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1000); // ms between scenes
  const [showExtender, setShowExtender] = useState(false);
  const timelineRef = useRef(null);
  const playIntervalRef = useRef(null);

  // Initialize with current scene if scenes array is empty
  useEffect(() => {
    if (scenes.length === 0 && initialScenes.length > 0) {
      setScenes(initialScenes);
    }
  }, [initialScenes]);

  // Notify parent of timeline updates
  useEffect(() => {
    if (onTimelineUpdate) {
      onTimelineUpdate(scenes);
    }
  }, [scenes, onTimelineUpdate]);

  // Handle scene selection
  const selectScene = (index) => {
    setSelectedSceneIndex(index);
    if (onSceneSelect) {
      onSceneSelect(scenes[index], index);
    }
  };

  // Add new scene to timeline
  const addScene = (scene, position = 'end') => {
    const newScene = {
      id: Date.now() + Math.random(),
      content: scene,
      timestamp: Date.now(),
      title: scene.scene?.substring(0, 50) + '...' || 'Untitled Scene',
      continuationType: scene._metadata?.continuationType || 'manual',
      duration: scene.duration || '30s'
    };

    let newScenes = [...scenes];
    
    switch (position) {
      case 'start':
        newScenes.unshift(newScene);
        break;
      case 'before_current':
        newScenes.splice(selectedSceneIndex, 0, newScene);
        break;
      case 'after_current':
        newScenes.splice(selectedSceneIndex + 1, 0, newScene);
        break;
      case 'end':
      default:
        newScenes.push(newScene);
        break;
    }
    
    setScenes(newScenes);
    
    // Select the new scene if it was added relative to current
    if (position === 'after_current') {
      setSelectedSceneIndex(selectedSceneIndex + 1);
    } else if (position === 'before_current') {
      setSelectedSceneIndex(selectedSceneIndex + 1); // Adjust for inserted scene
    }
  };

  // Remove scene from timeline
  const removeScene = (index) => {
    if (scenes.length <= 1) return; // Keep at least one scene
    
    const newScenes = scenes.filter((_, i) => i !== index);
    setScenes(newScenes);
    
    // Adjust selected index
    if (selectedSceneIndex >= index && selectedSceneIndex > 0) {
      setSelectedSceneIndex(selectedSceneIndex - 1);
    }
  };

  // Duplicate scene
  const duplicateScene = (index) => {
    const sceneToDuplicate = scenes[index];
    const duplicatedScene = {
      ...sceneToDuplicate,
      id: Date.now() + Math.random(),
      title: sceneToDuplicate.title + ' (Copy)',
      timestamp: Date.now()
    };
    
    const newScenes = [...scenes];
    newScenes.splice(index + 1, 0, duplicatedScene);
    setScenes(newScenes);
  };

  // Move scene within timeline
  const moveScene = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    
    const newScenes = [...scenes];
    const [movedScene] = newScenes.splice(fromIndex, 1);
    newScenes.splice(toIndex, 0, movedScene);
    
    setScenes(newScenes);
    
    // Adjust selected index if needed
    if (selectedSceneIndex === fromIndex) {
      setSelectedSceneIndex(toIndex);
    } else if (selectedSceneIndex > fromIndex && selectedSceneIndex <= toIndex) {
      setSelectedSceneIndex(selectedSceneIndex - 1);
    } else if (selectedSceneIndex < fromIndex && selectedSceneIndex >= toIndex) {
      setSelectedSceneIndex(selectedSceneIndex + 1);
    }
  };

  // Play timeline automatically
  const playTimeline = () => {
    if (isPlaying) {
      stopTimeline();
      return;
    }
    
    setIsPlaying(true);
    let currentIndex = selectedSceneIndex;
    
    playIntervalRef.current = setInterval(() => {
      currentIndex = (currentIndex + 1) % scenes.length;
      selectScene(currentIndex);
      
      if (currentIndex === 0) {
        // Completed full loop
        stopTimeline();
      }
    }, playSpeed);
  };

  // Stop timeline playback
  const stopTimeline = () => {
    setIsPlaying(false);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
  };

  // Handle scene extension from SceneExtender
  const handleSceneExtended = (extendedScene) => {
    addScene(extendedScene, 'after_current');
  };

  // Handle timeline action from SceneExtender
  const handleTimelineAction = (action) => {
    switch (action.type) {
      case 'add_scene':
        addScene(action.scene, action.position);
        break;
      default:
        console.warn('Unknown timeline action:', action);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedScene(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedScene !== null && draggedScene !== dropIndex) {
      moveScene(draggedScene, dropIndex);
    }
    setDraggedScene(null);
  };

  // Get scene type icon
  const getSceneTypeIcon = (scene) => {
    const type = scene.continuationType;
    const icons = {
      logical: '🔗',
      twist: '🌪️',
      genreShift: '🎭',
      characterDevelopment: '👤',
      flashback: '⏮️',
      timeSkip: '⏭️',
      alternateReality: '🌀',
      environmentalEscalation: '🌍',
      manual: '✏️'
    };
    return icons[type] || '🎬';
  };

  // Get total timeline duration
  const getTotalDuration = () => {
    return scenes.reduce((total, scene) => {
      const duration = scene.duration || '30s';
      const seconds = parseInt(duration.replace(/[^\d]/g, '')) || 30;
      return total + seconds;
    }, 0);
  };

  // Format duration for display
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  return (
    <div className={`timeline-manager ${className}`}>
      {/* Timeline Header */}
      <div className="timeline-header">
        <div className="header-left">
          <h3>Scene Timeline ({scenes.length} scenes)</h3>
          <div className="timeline-stats">
            <span>Total: {formatDuration(getTotalDuration())}</span>
            <span>•</span>
            <span>Current: Scene {selectedSceneIndex + 1}</span>
          </div>
        </div>
        
        <div className="header-controls">
          {/* Timeline Mode Toggle */}
          <select 
            value={timelineMode} 
            onChange={(e) => setTimelineMode(e.target.value)}
            className="mode-select"
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
            <option value="grid">Grid View</option>
          </select>

          {/* Playback Controls */}
          <button
            onClick={playTimeline}
            className={`play-btn ${isPlaying ? 'playing' : ''}`}
            title={isPlaying ? 'Stop playback' : 'Play timeline'}
          >
            {isPlaying ? '⏹️' : '▶️'}
          </button>

          {/* Speed Control */}
          <select 
            value={playSpeed} 
            onChange={(e) => setPlaySpeed(Number(e.target.value))}
            className="speed-select"
            disabled={isPlaying}
          >
            <option value={500}>Fast (0.5s)</option>
            <option value={1000}>Normal (1s)</option>
            <option value={2000}>Slow (2s)</option>
            <option value={3000}>Very Slow (3s)</option>
          </select>

          {/* Scene Extender Toggle */}
          <button
            onClick={() => setShowExtender(!showExtender)}
            className={`extender-toggle ${showExtender ? 'active' : ''}`}
            title="Scene Extender"
          >
            ✨ Extend
          </button>
        </div>
      </div>

      {/* Scene Extender */}
      {showExtender && (
        <div className="scene-extender-panel">
          <SceneExtender
            currentScene={scenes[selectedSceneIndex]?.content}
            onSceneExtended={handleSceneExtended}
            onTimeline={handleTimelineAction}
            showAdvancedOptions={true}
          />
        </div>
      )}

      {/* Timeline Visualization */}
      <div className={`timeline-container ${timelineMode}`} ref={timelineRef}>
        {timelineMode === 'grid' ? (
          // Grid Layout
          <div className="timeline-grid">
            {scenes.map((scene, index) => (
              <div
                key={scene.id}
                className={`scene-card grid-card ${index === selectedSceneIndex ? 'selected' : ''}`}
                onClick={() => selectScene(index)}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="scene-header">
                  <span className="scene-icon">{getSceneTypeIcon(scene)}</span>
                  <span className="scene-number">#{index + 1}</span>
                  <span className="scene-duration">{scene.duration}</span>
                </div>
                <div className="scene-title">{scene.title}</div>
                <div className="scene-preview">
                  {scene.content.scene?.substring(0, 100)}...
                </div>
                <div className="scene-actions">
                  <button onClick={(e) => { e.stopPropagation(); duplicateScene(index); }} title="Duplicate">📋</button>
                  <button onClick={(e) => { e.stopPropagation(); removeScene(index); }} title="Remove">🗑️</button>
                </div>
              </div>
            ))}
            
            {/* Add Scene Button */}
            <div className="add-scene-card" onClick={() => addScene({ scene: 'New scene' })}>
              <div className="add-icon">➕</div>
              <div>Add Scene</div>
            </div>
          </div>
        ) : (
          // Linear Layout (Horizontal/Vertical)
          <div className="timeline-track">
            {scenes.map((scene, index) => (
              <React.Fragment key={scene.id}>
                <div
                  className={`scene-card linear-card ${index === selectedSceneIndex ? 'selected' : ''} ${draggedScene === index ? 'dragging' : ''}`}
                  onClick={() => selectScene(index)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="scene-indicator">
                    <span className="scene-icon">{getSceneTypeIcon(scene)}</span>
                    <span className="scene-number">#{index + 1}</span>
                  </div>
                  
                  <div className="scene-content">
                    <div className="scene-title">{scene.title}</div>
                    <div className="scene-meta">
                      <span>{scene.duration}</span>
                      <span>•</span>
                      <span>{scene.continuationType}</span>
                    </div>
                  </div>
                  
                  <div className="scene-actions">
                    <button onClick={(e) => { e.stopPropagation(); duplicateScene(index); }} title="Duplicate">📋</button>
                    <button onClick={(e) => { e.stopPropagation(); removeScene(index); }} title="Remove">🗑️</button>
                  </div>
                </div>
                
                {/* Connection Arrow */}
                {index < scenes.length - 1 && (
                  <div className="scene-connector">
                    {timelineMode === 'horizontal' ? '→' : '↓'}
                  </div>
                )}
              </React.Fragment>
            ))}
            
            {/* Add Scene Button */}
            <div className="add-scene-button" onClick={() => addScene({ scene: 'New scene' })}>
              <span>➕ Add Scene</span>
            </div>
          </div>
        )}
      </div>

      {/* Scene Details Panel */}
      {showSceneDetails && selectedSceneIndex < scenes.length && (
        <div className="scene-details-panel">
          <div className="details-header">
            <h4>Scene {selectedSceneIndex + 1} Details</h4>
            <button onClick={() => setShowSceneDetails(false)}>×</button>
          </div>
          
          <div className="details-content">
            <div className="detail-group">
              <label>Title:</label>
              <input
                type="text"
                value={scenes[selectedSceneIndex].title}
                onChange={(e) => {
                  const newScenes = [...scenes];
                  newScenes[selectedSceneIndex].title = e.target.value;
                  setScenes(newScenes);
                }}
              />
            </div>
            
            <div className="detail-group">
              <label>Duration:</label>
              <input
                type="text"
                value={scenes[selectedSceneIndex].duration}
                onChange={(e) => {
                  const newScenes = [...scenes];
                  newScenes[selectedSceneIndex].duration = e.target.value;
                  setScenes(newScenes);
                }}
              />
            </div>
            
            <div className="detail-group">
              <label>Type:</label>
              <span>{scenes[selectedSceneIndex].continuationType}</span>
            </div>
            
            <div className="detail-group">
              <label>Scene Content:</label>
              <textarea
                value={scenes[selectedSceneIndex].content.scene || ''}
                onChange={(e) => {
                  const newScenes = [...scenes];
                  newScenes[selectedSceneIndex].content.scene = e.target.value;
                  setScenes(newScenes);
                }}
                rows={4}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Bar */}
      <div className="quick-actions-bar">
        <button
          onClick={() => addScene({ scene: 'New scene' }, 'before_current')}
          className="quick-action"
          title="Add scene before current"
        >
          ⬅️ Add Before
        </button>
        
        <button
          onClick={() => addScene({ scene: 'New scene' }, 'after_current')}
          className="quick-action"
          title="Add scene after current"
        >
          Add After ➡️
        </button>
        
        <button
          onClick={() => setShowSceneDetails(!showSceneDetails)}
          className={`quick-action ${showSceneDetails ? 'active' : ''}`}
          title="Toggle scene details"
        >
          📝 Details
        </button>
        
        <button
          onClick={() => duplicateScene(selectedSceneIndex)}
          className="quick-action"
          title="Duplicate current scene"
        >
          📋 Duplicate
        </button>
        
        <button
          onClick={() => {
            const json = JSON.stringify(scenes.map(s => s.content), null, 2);
            navigator.clipboard.writeText(json);
          }}
          className="quick-action"
          title="Copy timeline as JSON"
        >
          📋 Copy All
        </button>
      </div>

      <style jsx>{`
        .timeline-manager {
          max-width: 1200px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 12px 12px 0 0;
        }

        .header-left h3 {
          margin: 0 0 5px 0;
          font-size: 1.4rem;
        }

        .timeline-stats {
          font-size: 14px;
          opacity: 0.9;
          display: flex;
          gap: 8px;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mode-select,
        .speed-select {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 14px;
        }

        .mode-select option,
        .speed-select option {
          background: #333;
          color: white;
        }

        .play-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .play-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .play-btn.playing {
          background: #ff4757;
          border-color: #ff4757;
        }

        .extender-toggle {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .extender-toggle:hover,
        .extender-toggle.active {
          background: rgba(255, 255, 255, 0.3);
        }

        .scene-extender-panel {
          background: #f8f9fa;
          padding: 20px;
          border-left: 4px solid #667eea;
          margin-bottom: 20px;
        }

        .timeline-container {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 0 0 12px 12px;
          min-height: 200px;
          overflow: auto;
        }

        .timeline-container.horizontal {
          padding: 20px;
        }

        .timeline-container.vertical {
          padding: 20px;
        }

        .timeline-container.grid {
          padding: 20px;
        }

        .timeline-track {
          display: flex;
          align-items: center;
          gap: 15px;
          min-width: min-content;
        }

        .timeline-container.vertical .timeline-track {
          flex-direction: column;
          align-items: stretch;
        }

        .timeline-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }

        .scene-card {
          background: white;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }

        .scene-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          border-color: #667eea;
        }

        .scene-card.selected {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: linear-gradient(135deg, #f8f9ff, #ffffff);
        }

        .scene-card.dragging {
          opacity: 0.5;
          transform: rotate(5deg);
        }

        .linear-card {
          min-width: 200px;
          flex-shrink: 0;
        }

        .grid-card {
          height: 150px;
          display: flex;
          flex-direction: column;
        }

        .scene-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .scene-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .scene-icon {
          font-size: 1.2rem;
        }

        .scene-number {
          background: #667eea;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .scene-duration {
          background: #f8f9fa;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          color: #6c757d;
        }

        .scene-title {
          font-weight: 600;
          color: #343a40;
          margin-bottom: 5px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .scene-meta {
          font-size: 12px;
          color: #6c757d;
          display: flex;
          gap: 5px;
          align-items: center;
        }

        .scene-preview {
          font-size: 12px;
          color: #6c757d;
          line-height: 1.4;
          flex: 1;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .scene-actions {
          display: flex;
          gap: 5px;
          margin-top: 10px;
        }

        .scene-actions button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .scene-actions button:hover {
          background: #f8f9fa;
        }

        .scene-connector {
          font-size: 1.5rem;
          color: #6c757d;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }

        .add-scene-card,
        .add-scene-button {
          border: 2px dashed #dee2e6;
          border-radius: 10px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #6c757d;
          background: #f8f9fa;
        }

        .add-scene-card:hover,
        .add-scene-button:hover {
          border-color: #667eea;
          color: #667eea;
          background: #f8f9ff;
        }

        .add-scene-card {
          height: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .add-icon {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .scene-details-panel {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          z-index: 1000;
          width: 400px;
          max-width: 90vw;
        }

        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          border-radius: 12px 12px 0 0;
        }

        .details-header h4 {
          margin: 0;
          color: #343a40;
        }

        .details-header button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #6c757d;
        }

        .details-content {
          padding: 20px;
        }

        .detail-group {
          margin-bottom: 15px;
        }

        .detail-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          color: #343a40;
        }

        .detail-group input,
        .detail-group textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          font-size: 14px;
        }

        .detail-group textarea {
          resize: vertical;
          font-family: inherit;
        }

        .quick-actions-bar {
          display: flex;
          gap: 10px;
          padding: 15px 20px;
          background: #f8f9fa;
          border-radius: 0 0 12px 12px;
          flex-wrap: wrap;
        }

        .quick-action {
          padding: 8px 12px;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .quick-action:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .quick-action.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        @media (max-width: 768px) {
          .timeline-header {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }

          .header-controls {
            justify-content: space-between;
          }

          .timeline-container.horizontal .timeline-track {
            flex-direction: column;
            align-items: stretch;
          }

          .linear-card {
            min-width: auto;
          }

          .timeline-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions-bar {
            justify-content: space-between;
          }

          .scene-details-panel {
            width: 95vw;
          }
        }
      `}</style>
    </div>
  );
};

export default TimelineManager;