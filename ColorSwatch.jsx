import React from 'react';

const ColorSwatch = ({ 
  color, 
  onColorChange, 
  onRemove, 
  className = "",
  size = "medium",
  showRemove = true
}) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8", 
    large: "w-10 h-10"
  };

  const handleColorChange = (e) => {
    onColorChange(e.target.value.toUpperCase());
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Color Picker Input */}
      <label className="cursor-pointer block">
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="sr-only"
        />
        <div 
          className={`${sizeClasses[size]} rounded-md border-2 border-light-border dark:border-cinema-border hover:border-teal-400 dark:hover:border-teal-500 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md`}
          style={{ backgroundColor: color }}
          title={`Color: ${color}`}
        >
          {/* Color preview with subtle inner border for light colors */}
          <div 
            className="w-full h-full rounded-sm"
            style={{ 
              backgroundColor: color,
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
            }}
          />
        </div>
      </label>

      {/* Remove Button */}
      {showRemove && (
        <button
          onClick={handleRemove}
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          title="Remove color"
        >
          ×
        </button>
      )}

      {/* Color Code Tooltip on Hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {color}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800 dark:border-t-gray-200"></div>
      </div>
    </div>
  );
};

export default ColorSwatch;