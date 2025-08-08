import React from 'react';

const LoadingButton = ({ 
  loading = false, 
  disabled = false, 
  children, 
  className = '', 
  onClick,
  loadingText = 'Loading...',
  ...props 
}) => {
  const isDisabled = loading || disabled;
  
  const baseClasses = "inline-flex items-center justify-center transition-all duration-200 relative";
  const disabledClasses = isDisabled ? "opacity-60 cursor-not-allowed" : "hover:opacity-90";
  
  return (
    <button
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      className={`${baseClasses} ${disabledClasses} ${className}`}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className={loading ? 'opacity-75' : ''}>
        {loading ? loadingText : children}
      </span>
    </button>
  );
};

export default LoadingButton;