import React from 'react';
import usePromptStore from './store';
import PaletteInput from './PaletteInput';

const ConsistencyPanel = ({ 
  isExpanded, 
  onToggleExpanded, 
  className = "" 
}) => {
  const { 
    fieldValues, 
    setFieldValue, 
    hasActiveConsistencyFeatures,
    hasActiveLocks,
    generateRandomSeed
  } = usePromptStore();

  // Handler functions for consistency controls
  const handleSeedChange = (value) => {
    setFieldValue('seed', value ? parseInt(value) : '');
  };

  const handleLockIdentityToggle = () => {
    setFieldValue('lock_identity', !fieldValues.lock_identity);
  };

  const handleLockStyleToggle = () => {
    setFieldValue('lock_style', !fieldValues.lock_style);
  };

  const handleCreativityChange = (value) => {
    setFieldValue('creativity', parseFloat(value));
  };

  const handlePaletteChange = (value) => {
    setFieldValue('palette', value);
  };

  const handleNegativeChange = (value) => {
    setFieldValue('negative', value);
  };

  const handleCameraLensChange = (value) => {
    setFieldValue('camera_lens_mm', value ? parseInt(value) : '');
  };

  const handleCameraMoveChange = (value) => {
    setFieldValue('camera_move', value);
  };

  const handleCameraSpeedChange = (value) => {
    setFieldValue('camera_speed', value);
  };

  const handleDurationChange = (value) => {
    setFieldValue('duration_s', value ? parseInt(value) : '');
  };

  const handleFpsChange = (value) => {
    setFieldValue('fps', value);
  };

  const handleGenerateRandomSeed = () => {
    generateRandomSeed();
  };

  return (
    <div 
      className={`bg-light-panel dark:bg-cinema-panel rounded-lg border border-light-border dark:border-cinema-border transition-all duration-300 ${className}`}
      data-tutorial="consistency-panel"
    >
      {/* Panel Header */}
      <button
        onClick={onToggleExpanded}
        className="w-full px-4 py-3 text-left hover:bg-light-card dark:hover:bg-cinema-card transition-colors duration-200 flex items-center justify-between rounded-lg"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">⚙️</span>
          <div>
            <h3 className="font-medium text-light-text dark:text-cinema-text">
              Consistency
            </h3>
            <p className="text-xs text-light-text-muted dark:text-cinema-text-muted">
              Control repeatability and stability
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Active features badge */}
          {hasActiveConsistencyFeatures() && (
            <span className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-2 py-1 rounded-full">
              {hasActiveLocks() ? 'locks on' : 'active'}
            </span>
          )}
          {/* Expand/collapse chevron */}
          <svg
            className={`w-5 h-5 text-light-text-muted dark:text-cinema-text-muted transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Panel Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-light-border dark:border-cinema-border">
          <div className="pt-4 space-y-6">
            
            {/* Core Consistency Controls */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-light-text dark:text-cinema-text border-b border-light-border dark:border-cinema-border pb-2">
                Core Controls
              </h4>
              
              {/* Seed Input with Dice Button */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-light-text dark:text-cinema-text">
                  Seed
                </label>
                <p className="text-xs text-light-text-muted dark:text-cinema-text-muted -mt-1 mb-2">
                  Random starting point. Same seed = similar results each time.
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={fieldValues.seed || ''}
                    onChange={(e) => handleSeedChange(e.target.value)}
                    placeholder="e.g., 137421"
                    min="1"
                    max="999999"
                    className="flex-1 px-3 py-2 text-sm border border-light-border dark:border-cinema-border rounded-md bg-light-card dark:bg-cinema-card text-light-text dark:text-cinema-text focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={handleGenerateRandomSeed}
                    className="px-3 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-md hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors text-sm font-medium"
                    title="Generate random seed"
                  >
                    🎲
                  </button>
                </div>
              </div>

              {/* Lock Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Lock Identity */}
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={fieldValues.lock_identity || false}
                      onChange={handleLockIdentityToggle}
                      className="sr-only"
                    />
                    <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                      fieldValues.lock_identity 
                        ? 'bg-teal-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        fieldValues.lock_identity ? 'translate-x-5' : 'translate-x-0.5'
                      }`} style={{ marginTop: '2px' }} />
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-light-text dark:text-cinema-text">
                      Lock Identity
                    </span>
                    <p className="text-xs text-light-text-muted dark:text-cinema-text-muted">
                      Keep the same character/look across retries.
                    </p>
                  </div>
                </label>

                {/* Lock Style */}
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={fieldValues.lock_style || false}
                      onChange={handleLockStyleToggle}
                      className="sr-only"
                    />
                    <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                      fieldValues.lock_style 
                        ? 'bg-teal-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                        fieldValues.lock_style ? 'translate-x-5' : 'translate-x-0.5'
                      }`} style={{ marginTop: '2px' }} />
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-light-text dark:text-cinema-text">
                      Lock Style
                    </span>
                    <p className="text-xs text-light-text-muted dark:text-cinema-text-muted">
                      Keep the same visual grade/palette.
                    </p>
                  </div>
                </label>
              </div>

              {/* Creativity Slider */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-light-text dark:text-cinema-text">
                  Creativity
                  <span className="text-light-text-muted dark:text-cinema-text-muted text-xs ml-2">
                    (lower = steadier, higher = wilder)
                  </span>
                </label>
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={fieldValues.creativity || 0.4}
                    onChange={(e) => handleCreativityChange(e.target.value)}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-light-text-muted dark:text-cinema-text-muted">
                    <span>Steady</span>
                    <span className="font-medium">{fieldValues.creativity || 0.4}</span>
                    <span>Wild</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Advanced Controls */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-light-text dark:text-cinema-text border-b border-light-border dark:border-cinema-border pb-2">
                Optional Controls
              </h4>
              
              {/* Brand Colors */}
              <PaletteInput
                value={fieldValues.palette || ''}
                onChange={handlePaletteChange}
                placeholder="e.g., #FF1A2E, #111111, #E6E6E6"
              />

              {/* Negative List */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-light-text dark:text-cinema-text">
                  Negative List
                </label>
                <textarea
                  value={fieldValues.negative || ''}
                  onChange={(e) => handleNegativeChange(e.target.value)}
                  placeholder="Things to avoid (e.g., extra people, text overlays, hands)"
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-light-border dark:border-cinema-border rounded-md bg-light-card dark:bg-cinema-card text-light-text dark:text-cinema-text focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Camera Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-light-text dark:text-cinema-text">
                    Lens (mm)
                  </label>
                  <input
                    type="number"
                    value={fieldValues.camera_lens_mm || ''}
                    onChange={(e) => handleCameraLensChange(e.target.value)}
                    placeholder="e.g., 35"
                    min="10"
                    max="400"
                    className="w-full px-3 py-2 text-sm border border-light-border dark:border-cinema-border rounded-md bg-light-card dark:bg-cinema-card text-light-text dark:text-cinema-text focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-light-text dark:text-cinema-text">
                    Movement
                  </label>
                  <select
                    value={fieldValues.camera_move || ''}
                    onChange={(e) => handleCameraMoveChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-light-border dark:border-cinema-border rounded-md bg-light-card dark:bg-cinema-card text-light-text dark:text-cinema-text focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">None</option>
                    <option value="static">Static</option>
                    <option value="dolly_in">Dolly In</option>
                    <option value="dolly_out">Dolly Out</option>
                    <option value="pan_left">Pan Left</option>
                    <option value="pan_right">Pan Right</option>
                    <option value="tilt_up">Tilt Up</option>
                    <option value="tilt_down">Tilt Down</option>
                    <option value="orbit">Orbit</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-light-text dark:text-cinema-text">
                    Speed
                  </label>
                  <select
                    value={fieldValues.camera_speed || ''}
                    onChange={(e) => handleCameraSpeedChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-light-border dark:border-cinema-border rounded-md bg-light-card dark:bg-cinema-card text-light-text dark:text-cinema-text focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Default</option>
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                    <option value="variable">Variable</option>
                  </select>
                </div>
              </div>

              {/* Timing Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-light-text dark:text-cinema-text">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={fieldValues.duration_s || ''}
                    onChange={(e) => handleDurationChange(e.target.value)}
                    placeholder="e.g., 8"
                    min="1"
                    max="60"
                    className="w-full px-3 py-2 text-sm border border-light-border dark:border-cinema-border rounded-md bg-light-card dark:bg-cinema-card text-light-text dark:text-cinema-text focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-light-text dark:text-cinema-text">
                    Frame Rate
                  </label>
                  <select
                    value={fieldValues.fps || ''}
                    onChange={(e) => handleFpsChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-light-border dark:border-cinema-border rounded-md bg-light-card dark:bg-cinema-card text-light-text dark:text-cinema-text focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Default</option>
                    <option value="24">24 FPS</option>
                    <option value="30">30 FPS</option>
                    <option value="60">60 FPS</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for slider styling */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #14b8a6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #14b8a6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ConsistencyPanel;