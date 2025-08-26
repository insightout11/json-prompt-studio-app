import React from 'react';

const Logo = ({ 
  width, 
  height, 
  className = "",
  size = "medium"
}) => {
  // Size configurations
  const sizeConfig = {
    small: { width: 240, height: 80 },
    medium: { width: 360, height: 120 },
    large: { width: 480, height: 160 }
  };

  const config = sizeConfig[size] || sizeConfig.medium;
  const logoWidth = width || config.width;
  const logoHeight = height || config.height;

  return (
    <div className={`inline-block ${className}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 360 120" 
        width={logoWidth} 
        height={logoHeight}
        aria-label="JSON Prompt Studio"
      >
        <g fill="currentColor" fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" textAnchor="middle" className="text-light-text dark:text-cinema-text">
          <text x="180" y="58" fontSize="44" fontWeight="800" dominantBaseline="middle">
            JSON <tspan fill="#34E2D3">{'{}'}</tspan>
          </text>
          <text x="180" y="95" fontSize="14" fontWeight="600" letterSpacing="3" className="fill-light-text-muted dark:fill-cinema-text-muted">PROMPT STUDIO</text>
        </g>
      </svg>
    </div>
  );
};

export default Logo;