import React from 'react';

const ToggleSwitch = ({ 
  enabled, 
  onToggle, 
  label,
  labelPosition = 'right', // 'left', 'right', 'none'
  size = 'medium', // 'small', 'medium', 'large'
  className = "",
  disabled = false,
  color = 'blue' // 'blue', 'green', 'purple', 'gray'
}) => {
  const sizeClasses = {
    small: {
      container: 'w-8 h-4',
      circle: 'w-3 h-3',
      translate: 'translate-x-4'
    },
    medium: {
      container: 'w-10 h-5',
      circle: 'w-4 h-4',
      translate: 'translate-x-5'
    },
    large: {
      container: 'w-12 h-6',
      circle: 'w-5 h-5',
      translate: 'translate-x-6'
    }
  };

  const colorClasses = {
    blue: {
      enabled: 'bg-blue-600 dark:bg-blue-500',
      disabled: 'bg-gray-300 dark:bg-gray-600'
    },
    green: {
      enabled: 'bg-green-600 dark:bg-green-500',
      disabled: 'bg-gray-300 dark:bg-gray-600'
    },
    purple: {
      enabled: 'bg-purple-600 dark:bg-purple-500',
      disabled: 'bg-gray-300 dark:bg-gray-600'
    },
    gray: {
      enabled: 'bg-gray-600 dark:bg-gray-400',
      disabled: 'bg-gray-300 dark:bg-gray-600'
    }
  };

  const currentSize = sizeClasses[size];
  const currentColor = colorClasses[color];

  const handleToggle = () => {
    if (!disabled && onToggle) {
      onToggle(!enabled);
    }
  };

  const switchElement = (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={handleToggle}
      disabled={disabled}
      className={`
        relative inline-flex flex-shrink-0 border-2 border-transparent rounded-full cursor-pointer 
        transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-blue-500 dark:focus:ring-offset-gray-800
        ${currentSize.container}
        ${enabled ? currentColor.enabled : currentColor.disabled}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 
          transition ease-in-out duration-200
          ${currentSize.circle}
          ${enabled ? currentSize.translate : 'translate-x-0'}
        `}
      />
    </button>
  );

  if (labelPosition === 'none') {
    return <div className={className}>{switchElement}</div>;
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {labelPosition === 'left' && label && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
      {switchElement}
      {labelPosition === 'right' && label && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
    </div>
  );
};

export default ToggleSwitch;