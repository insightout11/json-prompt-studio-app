import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';

const ColorWheelPicker = ({ 
  color, 
  onColorChange, 
  onRemove, 
  className = "",
  size = "medium",
  showRemove = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempColor, setTempColor] = useState(color);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8", 
    large: "w-10 h-10"
  };

  // Update temp color when prop color changes
  useEffect(() => {
    setTempColor(color);
  }, [color]);

  // Debug: Log state changes
  useEffect(() => {
    console.log('🎨 ColorWheelPicker: isOpen state changed to:', isOpen, 'for color:', color);
  }, [isOpen]);

  // Debug: Log component mounting/unmounting
  useEffect(() => {
    console.log('🎨 ColorWheelPicker: Component mounted for color:', color);
    return () => {
      console.log('🎨 ColorWheelPicker: Component unmounting for color:', color);
    };
  }, []);

  // Debug: Log when color prop changes
  useEffect(() => {
    console.log('🎨 ColorWheelPicker: Color prop changed to:', color);
  }, [color]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current && 
        !pickerRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleColorSelect = (newColor) => {
    setTempColor(newColor.toUpperCase());
    onColorChange(newColor.toUpperCase());
  };

  const handleInputChange = (newColor) => {
    setTempColor(newColor.toUpperCase());
    onColorChange(newColor.toUpperCase());
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemove();
  };

  const togglePicker = (e) => {
    console.log('🎨 ColorWheelPicker: Button clicked!', { isOpen, color });
    e?.preventDefault();
    e?.stopPropagation();
    setIsOpen(!isOpen);
    console.log('🎨 ColorWheelPicker: Setting isOpen to:', !isOpen);
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Color Swatch Button */}
      <button
        ref={buttonRef}
        onClick={togglePicker}
        onMouseDown={(e) => console.log('🎨 Mouse down on button')}
        onMouseUp={(e) => console.log('🎨 Mouse up on button')}
        className={`${sizeClasses[size]} rounded-md border-2 ${
          isOpen 
            ? 'border-teal-500 dark:border-teal-400' 
            : 'border-light-border dark:border-cinema-border hover:border-teal-400 dark:hover:border-teal-500'
        } transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md relative focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
        style={{ backgroundColor: color, pointerEvents: 'auto' }}
        title={`Color: ${color} - Click to change`}
        type="button"
      >
        {/* Color preview with subtle inner border for light colors */}
        <div 
          className="w-full h-full rounded-sm"
          style={{ 
            backgroundColor: color,
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
          }}
        />
        
        {/* Small indicator that it's clickable */}
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-white dark:bg-gray-800 rounded-tl-md opacity-70">
          <div className="w-full h-full rounded-tl-sm border-l border-t border-gray-400 dark:border-gray-600"></div>
        </div>
      </button>

      {/* Remove Button */}
      {showRemove && (
        <button
          onClick={handleRemoveClick}
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-20"
          title="Remove color"
          type="button"
        >
          ×
        </button>
      )}

      {/* Color Picker Popover */}
      {isOpen && (
        <div
          ref={pickerRef}
          className="absolute top-full left-0 mt-2 z-30 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-4 min-w-[250px]"
          style={{
            // Ensure it doesn't go off-screen
            transform: 'translateX(min(0px, calc(100vw - 100% - 20px)))'
          }}
        >
          {/* Color Wheel */}
          <div className="mb-4">
            <HexColorPicker 
              color={tempColor} 
              onChange={handleColorSelect}
              style={{ width: '200px', height: '200px' }}
            />
          </div>

          {/* Hex Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hex Color
            </label>
            <HexColorInput
              color={tempColor}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="#000000"
            />
          </div>

          {/* Current vs New Color Preview */}
          <div className="mt-4 flex items-center space-x-2">
            <div className="flex-1">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current</div>
              <div 
                className="w-full h-8 rounded border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: color }}
              />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">New</div>
              <div 
                className="w-full h-8 rounded border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: tempColor }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => {
                setTempColor(color);
                setIsOpen(false);
              }}
              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 bg-teal-500 text-white text-sm rounded hover:bg-teal-600 transition-colors"
              type="button"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Color Code Tooltip on Hover (when picker is closed) */}
      {!isOpen && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {color}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800 dark:border-t-gray-200"></div>
        </div>
      )}
    </div>
  );
};

export default ColorWheelPicker;