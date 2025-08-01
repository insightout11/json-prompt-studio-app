import React, { useState, useRef, useEffect } from 'react';
import usePromptStore from './store';

const SoundDesignBuilder = ({ fieldKey, value, onChange }) => {
  const { fieldValues } = usePromptStore();
  const [soundMode, setSoundMode] = useState('simple'); // simple, layered, templates
  const [soundLayers, setSoundLayers] = useState([]);
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);

  // Initialize sound design from existing value
  useEffect(() => {
    if (value && typeof value === 'string' && value.trim()) {
      // Convert simple text to structured format
      setSoundLayers([{
        id: 1,
        type: 'ambient',
        description: value,
        volume: 'medium',
        timing: 'continuous',
        position: 'background',
        processing: 'none'
      }]);
    } else if (value && typeof value === 'object' && value.layers) {
      setSoundLayers(value.layers);
    } else {
      setSoundLayers([]);
    }
  }, [value]);

  const soundTypes = [
    'ambient', 'dialogue', 'foley', 'music', 'effects', 'atmosphere', 
    'mechanical', 'natural', 'electronic', 'voice-over', 'crowd', 'vehicle'
  ];

  const volumeLevels = [
    'silent', 'whisper', 'quiet', 'low', 'medium', 'loud', 'very loud', 'dominant'
  ];

  const timingOptions = [
    'continuous', 'intermittent', 'single hit', 'fade in', 'fade out', 
    'crescendo', 'diminuendo', 'rhythmic', 'random', 'synchronized'
  ];

  const positionOptions = [
    'foreground', 'midground', 'background', 'left channel', 'right channel', 
    'center', 'surround', 'overhead', 'underwater', 'distant'
  ];

  const processingEffects = [
    'none', 'reverb', 'echo', 'delay', 'chorus', 'flanger', 'distortion', 
    'filter', 'pitch shift', 'time stretch', 'granular', 'reverse'
  ];

  const soundTemplates = {
    'Urban Environment': {
      layers: [
        { type: 'ambient', description: 'City traffic hum', volume: 'medium', timing: 'continuous', position: 'background' },
        { type: 'foley', description: 'Footsteps on concrete', volume: 'low', timing: 'rhythmic', position: 'foreground' },
        { type: 'atmosphere', description: 'Distant car horns', volume: 'quiet', timing: 'intermittent', position: 'distant' }
      ]
    },
    'Forest Scene': {
      layers: [
        { type: 'natural', description: 'Wind through trees', volume: 'medium', timing: 'continuous', position: 'surround' },
        { type: 'natural', description: 'Bird calls', volume: 'low', timing: 'intermittent', position: 'overhead' },
        { type: 'foley', description: 'Leaves rustling underfoot', volume: 'quiet', timing: 'rhythmic', position: 'foreground' }
      ]
    },
    'Sci-Fi Laboratory': {
      layers: [
        { type: 'electronic', description: 'Computer systems humming', volume: 'low', timing: 'continuous', position: 'background' },
        { type: 'mechanical', description: 'Equipment beeping', volume: 'quiet', timing: 'intermittent', position: 'midground' },
        { type: 'effects', description: 'Energy discharge sounds', volume: 'medium', timing: 'single hit', position: 'center' }
      ]
    },
    'Romantic Dinner': {
      layers: [
        { type: 'ambient', description: 'Soft restaurant chatter', volume: 'whisper', timing: 'continuous', position: 'background' },
        { type: 'foley', description: 'Cutlery on plates', volume: 'quiet', timing: 'intermittent', position: 'foreground' },
        { type: 'music', description: 'Piano jazz', volume: 'low', timing: 'continuous', position: 'distant' }
      ]
    }
  };

  const addSoundLayer = () => {
    const newLayer = {
      id: Date.now(),
      type: soundTypes[0],
      description: '',
      volume: 'medium',
      timing: 'continuous',
      position: 'background',
      processing: 'none'
    };
    
    const newLayers = [...soundLayers, newLayer];
    setSoundLayers(newLayers);
    setActiveLayerIndex(newLayers.length - 1);
    updateValue(newLayers);
  };

  const updateSoundLayer = (index, field, value) => {
    const newLayers = [...soundLayers];
    newLayers[index] = { ...newLayers[index], [field]: value };
    setSoundLayers(newLayers);
    updateValue(newLayers);
  };

  const removeSoundLayer = (index) => {
    const newLayers = soundLayers.filter((_, i) => i !== index);
    setSoundLayers(newLayers);
    setActiveLayerIndex(Math.max(0, Math.min(activeLayerIndex, newLayers.length - 1)));
    updateValue(newLayers);
  };

  const applyTemplate = (templateName) => {
    const template = soundTemplates[templateName];
    if (template) {
      const newLayers = template.layers.map((layer, index) => ({
        ...layer,
        id: Date.now() + index
      }));
      setSoundLayers(newLayers);
      updateValue(newLayers);
      setSoundMode('layered');
    }
  };

  const updateValue = (layers) => {
    if (soundMode === 'simple' && layers.length === 1) {
      // For simple mode, just return the description
      onChange(layers[0]?.description || '');
    } else {
      // For complex mode, return structured object
      onChange({
        mode: soundMode,
        layers: layers,
        metadata: {
          totalLayers: layers.length,
          layerTypes: [...new Set(layers.map(layer => layer.type))],
          complexity: layers.length > 3 ? 'complex' : layers.length > 1 ? 'moderate' : 'simple'
        }
      });
    }
  };

  const switchToSimpleMode = () => {
    setSoundMode('simple');
    if (soundLayers.length > 0) {
      const combinedDescription = soundLayers.map(layer => 
        `${layer.type}: ${layer.description}`
      ).join(', ');
      onChange(combinedDescription);
    }
  };

  const switchToLayeredMode = () => {
    setSoundMode('layered');
    if (typeof value === 'string' && value.trim()) {
      const layers = [{
        id: 1,
        type: 'ambient',
        description: value,
        volume: 'medium',
        timing: 'continuous',
        position: 'background',
        processing: 'none'
      }];
      setSoundLayers(layers);
      updateValue(layers);
    } else if (soundLayers.length === 0) {
      addSoundLayer();
    }
  };

  const getVolumeIcon = (volume) => {
    const icons = {
      'silent': '🔇',
      'whisper': '🔈',
      'quiet': '🔈',
      'low': '🔉',
      'medium': '🔊',
      'loud': '🔊',
      'very loud': '📢',
      'dominant': '📢'
    };
    return icons[volume] || '🔊';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'ambient': '🌫️',
      'dialogue': '💬',
      'foley': '👟',
      'music': '🎵',
      'effects': '✨',
      'atmosphere': '🌊',
      'mechanical': '⚙️',
      'natural': '🌿',
      'electronic': '🤖',
      'voice-over': '🎙️',
      'crowd': '👥',
      'vehicle': '🚗'
    };
    return icons[type] || '🔊';
  };

  return (
    <div className="sound-design-builder space-y-4">
      {/* Mode Selector */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={switchToSimpleMode}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            soundMode === 'simple'
              ? 'bg-green-600 text-white dark:bg-green-600'
              : 'bg-gray-200 text-gray-700 dark:bg-cinema-card dark:text-cinema-text hover:bg-gray-300 dark:hover:bg-cinema-border'
          }`}
        >
          Simple Audio
        </button>
        <button
          onClick={switchToLayeredMode}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            soundMode === 'layered'
              ? 'bg-green-600 text-white dark:bg-green-600'
              : 'bg-gray-200 text-gray-700 dark:bg-cinema-card dark:text-cinema-text hover:bg-gray-300 dark:hover:bg-cinema-border'
          }`}
        >
          Layered Audio
        </button>
        <button
          onClick={() => setSoundMode('templates')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            soundMode === 'templates'
              ? 'bg-green-600 text-white dark:bg-green-600'
              : 'bg-gray-200 text-gray-700 dark:bg-cinema-card dark:text-cinema-text hover:bg-gray-300 dark:hover:bg-cinema-border'
          }`}
        >
          Templates
        </button>
      </div>

      {/* Simple Mode */}
      {soundMode === 'simple' && (
        <div className="space-y-2">
          <textarea
            value={typeof value === 'string' ? value : (soundLayers[0]?.description || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Describe the sound design: ambient noise, effects, audio atmosphere..."
            className="w-full p-3 border border-gray-300 dark:border-cinema-border rounded-md focus:ring-2 focus:ring-green-600 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-cinema-panel text-gray-900 dark:text-cinema-text resize-vertical min-h-[100px]"
            rows={4}
          />
          <div className="text-sm text-gray-500 dark:text-cinema-text-muted">
            Characters: {(typeof value === 'string' ? value : soundLayers[0]?.description || '').length}
          </div>
        </div>
      )}

      {/* Layered Mode */}
      {soundMode === 'layered' && (
        <div className="space-y-4">
          {soundLayers.map((layer, index) => (
            <div 
              key={layer.id} 
              className={`border rounded-lg p-4 transition-all ${
                activeLayerIndex === index 
                  ? 'border-green-600 dark:border-green-400 bg-green-50 dark:bg-green-900/10' 
                  : 'border-gray-200 dark:border-cinema-border bg-white dark:bg-cinema-panel'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-cinema-text-muted">
                    Layer {index + 1}
                  </span>
                  <span className="text-lg">{getTypeIcon(layer.type)}</span>
                  <select
                    value={layer.type}
                    onChange={(e) => updateSoundLayer(index, 'type', e.target.value)}
                    className="text-sm border border-gray-300 dark:border-cinema-border rounded px-2 py-1 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                  >
                    {soundTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => removeSoundLayer(index)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  title="Remove layer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <textarea
                value={layer.description}
                onChange={(e) => updateSoundLayer(index, 'description', e.target.value)}
                placeholder={`Describe the ${layer.type} sound...`}
                className="w-full p-3 border border-gray-300 dark:border-cinema-border rounded-md focus:ring-2 focus:ring-green-600 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text resize-vertical min-h-[80px]"
                rows={3}
                onFocus={() => setActiveLayerIndex(index)}
              />

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
                    Volume {getVolumeIcon(layer.volume)}
                  </label>
                  <select
                    value={layer.volume}
                    onChange={(e) => updateSoundLayer(index, 'volume', e.target.value)}
                    className="w-full text-sm border border-gray-300 dark:border-cinema-border rounded px-2 py-1 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text focus:ring-2 focus:ring-green-600 dark:focus:ring-green-400"
                  >
                    {volumeLevels.map(volume => (
                      <option key={volume} value={volume}>
                        {volume.charAt(0).toUpperCase() + volume.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
                    Timing
                  </label>
                  <select
                    value={layer.timing}
                    onChange={(e) => updateSoundLayer(index, 'timing', e.target.value)}
                    className="w-full text-sm border border-gray-300 dark:border-cinema-border rounded px-2 py-1 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text focus:ring-2 focus:ring-green-600 dark:focus:ring-green-400"
                  >
                    {timingOptions.map(timing => (
                      <option key={timing} value={timing}>
                        {timing.charAt(0).toUpperCase() + timing.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
                    Position
                  </label>
                  <select
                    value={layer.position}
                    onChange={(e) => updateSoundLayer(index, 'position', e.target.value)}
                    className="w-full text-sm border border-gray-300 dark:border-cinema-border rounded px-2 py-1 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text focus:ring-2 focus:ring-green-600 dark:focus:ring-green-400"
                  >
                    {positionOptions.map(position => (
                      <option key={position} value={position}>
                        {position.charAt(0).toUpperCase() + position.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
                    Processing
                  </label>
                  <select
                    value={layer.processing}
                    onChange={(e) => updateSoundLayer(index, 'processing', e.target.value)}
                    className="w-full text-sm border border-gray-300 dark:border-cinema-border rounded px-2 py-1 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text focus:ring-2 focus:ring-green-600 dark:focus:ring-green-400"
                  >
                    {processingEffects.map(effect => (
                      <option key={effect} value={effect}>
                        {effect.charAt(0).toUpperCase() + effect.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs text-gray-500 dark:text-cinema-text-muted mt-2">
                {layer.description.length} characters | {layer.volume} {layer.timing} {layer.type}
              </div>
            </div>
          ))}

          <button
            onClick={addSoundLayer}
            className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-cinema-border rounded-lg text-gray-500 dark:text-cinema-text-muted hover:border-gray-400 dark:hover:border-cinema-text-muted hover:text-gray-700 dark:hover:text-cinema-text transition-colors"
          >
            + Add Sound Layer
          </button>

          {soundLayers.length > 0 && (
            <div className="bg-gray-50 dark:bg-cinema-card rounded-lg p-3">
              <div className="text-sm text-gray-700 dark:text-cinema-text">
                <strong>Audio Summary:</strong>
              </div>
              <div className="text-sm text-gray-600 dark:text-cinema-text-muted mt-1">
                {soundLayers.length} layers | Types: {[...new Set(soundLayers.map(layer => layer.type))].join(', ')} |
                Complexity: {soundLayers.length > 3 ? 'Complex' : soundLayers.length > 1 ? 'Moderate' : 'Simple'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Template Mode */}
      {soundMode === 'templates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(soundTemplates).map(([templateName, template]) => (
              <button
                key={templateName}
                onClick={() => applyTemplate(templateName)}
                className="p-4 border border-gray-200 dark:border-cinema-border rounded-lg hover:border-green-600 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all text-left"
              >
                <div className="font-medium text-gray-900 dark:text-cinema-text mb-2">
                  {templateName}
                </div>
                <div className="text-sm text-gray-600 dark:text-cinema-text-muted space-y-1">
                  {template.layers.map((layer, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span>{getTypeIcon(layer.type)}</span>
                      <span>{layer.description}</span>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SoundDesignBuilder;