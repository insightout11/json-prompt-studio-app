import React, { useState, useEffect } from 'react';
import ColorWheelPicker from './ColorWheelPicker';

const PaletteInput = ({ 
  value = '', 
  onChange, 
  placeholder = "e.g., #FF1A2E, #111111, #E6E6E6",
  className = "" 
}) => {
  const [visualMode, setVisualMode] = useState(false);
  const [colors, setColors] = useState([]);

  // Color validation utility
  const isValidHexColor = (color) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  // Parse text input to color array
  const parseColorsFromText = (text) => {
    if (!text) return [];
    return text
      .split(',')
      .map(color => color.trim().toUpperCase())
      .filter(color => isValidHexColor(color));
  };

  // Convert color array to text
  const colorsToText = (colorArray) => {
    return colorArray.filter(color => isValidHexColor(color)).join(', ');
  };

  // Sync colors array with text value when text changes externally
  useEffect(() => {
    const parsedColors = parseColorsFromText(value);
    setColors(parsedColors);
  }, [value]);

  // Handle text input changes
  const handleTextChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Update colors array for visual mode
    const parsedColors = parseColorsFromText(newValue);
    setColors(parsedColors);
  };

  // Handle color changes from visual mode
  const handleColorChange = (index, newColor) => {
    const newColors = [...colors];
    newColors[index] = newColor.toUpperCase();
    setColors(newColors);
    
    // Update text value
    const newTextValue = colorsToText(newColors);
    onChange(newTextValue);
  };

  // Add new color
  const handleAddColor = () => {
    const newColors = [...colors, '#FF0000'];
    setColors(newColors);
    
    // Update text value
    const newTextValue = colorsToText(newColors);
    onChange(newTextValue);
  };

  // Remove color
  const handleRemoveColor = (index) => {
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
    
    // Update text value
    const newTextValue = colorsToText(newColors);
    onChange(newTextValue);
  };

  // Toggle between visual and text modes
  const toggleMode = () => {
    setVisualMode(!visualMode);
  };

  // Common brand color presets
  const brandPresets = [
    { name: 'Classic', colors: ['#FF1A2E', '#111111', '#E6E6E6'] },
    { name: 'Ocean', colors: ['#0B1D2A', '#6FA6C9', '#BFD6E6'] },
    { name: 'Forest', colors: ['#0F1418', '#CADBE7', '#65D6C6'] },
    { name: 'Sunset', colors: ['#FF6B35', '#F7931E', '#FFD23F'] },
    { name: 'Purple', colors: ['#4C1D95', '#8B5CF6', '#DDD6FE'] }
  ];

  const handlePresetClick = (preset) => {
    setColors(preset.colors);
    const newTextValue = colorsToText(preset.colors);
    onChange(newTextValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header with mode toggle */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-light-text dark:text-cinema-text">
          Brand Colors
        </label>
        <button
          type="button"
          onClick={toggleMode}
          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
        >
          {visualMode ? '📝 Text' : '🎨 Visual'}
        </button>
      </div>

      {visualMode ? (
        /* Visual Mode */
        <div className="space-y-3">
          {/* Color Swatches */}
          <div className="flex flex-wrap items-center gap-2">
            {colors.map((color, index) => (
              <ColorWheelPicker
                key={`picker-${index}`}
                color={color}
                onColorChange={(newColor) => handleColorChange(index, newColor)}
                onRemove={() => handleRemoveColor(index)}
                showRemove={colors.length > 1}
              />
            ))}
            
            {/* Add Color Button */}
            <button
              type="button"
              onClick={handleAddColor}
              className="w-8 h-8 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-500 rounded-md flex items-center justify-center text-gray-400 hover:text-teal-500 transition-colors"
              title="Add new color"
            >
              +
            </button>
          </div>

          {/* Brand Presets */}
          <div className="space-y-1">
            <div className="text-xs text-gray-500 dark:text-gray-400">Quick presets:</div>
            <div className="flex flex-wrap gap-1">
              {brandPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-300 rounded transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Text representation for reference */}
          {colors.length > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {colorsToText(colors)}
            </div>
          )}
        </div>
      ) : (
        /* Text Mode */
        <input
          type="text"
          value={value}
          onChange={handleTextChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-light-border dark:border-cinema-border rounded-md bg-light-card dark:bg-cinema-card text-light-text dark:text-cinema-text focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      )}

      {/* Color count and validation info */}
      {colors.length > 0 && (
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{colors.length} color{colors.length !== 1 ? 's' : ''}</span>
          {!visualMode && value && parseColorsFromText(value).length !== value.split(',').length && (
            <span className="text-orange-500">Some colors may be invalid</span>
          )}
        </div>
      )}
    </div>
  );
};

export default PaletteInput;