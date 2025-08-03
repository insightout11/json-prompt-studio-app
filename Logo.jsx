import React, { useState, useEffect } from 'react';

const Logo = ({ 
  width, 
  height, 
  className = "",
  showBackground = false,
  size = "medium",
  theme = "auto", // auto, light, dark
  submark = false // if true, shows only the iconic braces symbol
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('idle'); // idle, typing, braces, completed
  const [visibleLetters, setVisibleLetters] = useState(4); // Start with all letters for static state
  const [showCursor, setShowCursor] = useState(false);
  const [leftBraceVisible, setLeftBraceVisible] = useState(true);
  const [rightBraceVisible, setRightBraceVisible] = useState(true);
  
  // Size variants with optimized dimensions
  const sizeConfig = {
    small: { 
      width: 180, 
      height: 80, 
      mainFontSize: 28, 
      subFontSize: 10, 
      spacing: { main: 35, sub: 50, bracket: 62 },
      letterSpacing: { main: '0.02em', sub: '0.1em' }
    },
    medium: { 
      width: 280, 
      height: 100, 
      mainFontSize: 36, 
      subFontSize: 12, 
      spacing: { main: 55, sub: 75, bracket: 90 },
      letterSpacing: { main: '0.03em', sub: '0.12em' }
    },
    large: { 
      width: 400, 
      height: 140, 
      mainFontSize: 42, 
      subFontSize: 14, 
      spacing: { main: 70, sub: 95, bracket: 110 },
      letterSpacing: { main: '0.05em', sub: '0.15em' }
    }
  };

  // Submark configuration for icon-only version
  const submarkConfig = {
    small: { width: 32, height: 32, fontSize: 16 },
    medium: { width: 48, height: 48, fontSize: 24 },
    large: { width: 64, height: 64, fontSize: 32 }
  };

  const config = sizeConfig[size] || sizeConfig.medium;
  const subConfig = submarkConfig[size] || submarkConfig.medium;
  const logoWidth = width || (submark ? subConfig.width : config.width);
  const logoHeight = height || (submark ? subConfig.height : config.height);
  
  // Determine if we're in dark mode
  const isDarkMode = theme === "auto" ? 
    (typeof window !== 'undefined' && document.documentElement.classList.contains('dark')) :
    theme === "dark";
  
  // Clean neon teal/electric blue colors
  const neonTeal = "#06b6d4"; // Clean neon teal
  const electricBlue = "#3b82f6"; // Electric blue
  const neonColor = isHovered ? "#00d4ff" : neonTeal; // Brighter neon on hover
  const glowIntensity = isHovered ? (size === 'small' ? 4 : 8) : (size === 'small' ? 1 : 2); // Much brighter glow
  
  // Clean neon gradients
  const textGradient = isDarkMode ? `
    <linearGradient id="text-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#e0f7fa;stop-opacity:1" />
      <stop offset="80%" style="stop-color:${neonTeal};stop-opacity:0.95" />
      <stop offset="100%" style="stop-color:${electricBlue};stop-opacity:0.9" />
    </linearGradient>
  ` : `
    <linearGradient id="text-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1f2937;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#374151;stop-opacity:1" />
      <stop offset="80%" style="stop-color:${neonTeal};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${electricBlue};stop-opacity:1" />
    </linearGradient>
  `;

  const subtitleGradient = isDarkMode ? `
    <linearGradient id="subtitle-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#f0f9ff;stop-opacity:0.9" />
      <stop offset="70%" style="stop-color:#bae6fd;stop-opacity:0.85" />
      <stop offset="100%" style="stop-color:${neonTeal};stop-opacity:0.8" />
    </linearGradient>
  ` : `
    <linearGradient id="subtitle-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#374151;stop-opacity:0.9" />
      <stop offset="70%" style="stop-color:#6b7280;stop-opacity:0.85" />
      <stop offset="100%" style="stop-color:${electricBlue};stop-opacity:0.8" />
    </linearGradient>
  `;

  const subtleGlowFilter = `
    <filter id="subtle-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="${glowIntensity}" flood-color="${neonColor}" flood-opacity="${isHovered ? '0.9' : '0.6'}"/>
      ${isHovered ? `<feDropShadow dx="0" dy="0" stdDeviation="${glowIntensity * 2}" flood-color="${neonColor}" flood-opacity="0.4"/>` : ''}
      <feDropShadow dx="0" dy="0" stdDeviation="${glowIntensity * 0.5}" flood-color="${electricBlue}" flood-opacity="${isHovered ? '0.3' : '0.2'}"/>
    </filter>
  `;

  const braceDepthFilter = `
    <filter id="brace-depth" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="${isDarkMode ? '#000000' : '#ffffff'}" flood-opacity="0.3"/>
      <feDropShadow dx="-0.5" dy="-0.5" stdDeviation="0.5" flood-color="${isDarkMode ? '#ffffff' : '#000000'}" flood-opacity="0.2"/>
      <feDropShadow dx="0" dy="0" stdDeviation="${isHovered ? '3' : '1.5'}" flood-color="${neonColor}" flood-opacity="${isHovered ? '0.6' : '0.3'}"/>
    </filter>
  `;

  const braceGradient = isDarkMode ? `
    <linearGradient id="brace-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e0f7fa;stop-opacity:0.9" />
      <stop offset="50%" style="stop-color:${neonTeal};stop-opacity:0.85" />
      <stop offset="100%" style="stop-color:${electricBlue};stop-opacity:0.8" />
    </linearGradient>
  ` : `
    <linearGradient id="brace-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e0f7fa;stop-opacity:0.9" />
      <stop offset="50%" style="stop-color:${neonTeal};stop-opacity:0.85" />
      <stop offset="100%" style="stop-color:${electricBlue};stop-opacity:0.8" />
    </linearGradient>
  `;

  const completionGlowFilter = `
    <filter id="completion-glow" x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="${neonColor}" flood-opacity="${animationPhase === 'completed' ? '1.0' : '0'}"/>
      <feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="${neonColor}" flood-opacity="${animationPhase === 'completed' ? '0.7' : '0'}"/>
      <feDropShadow dx="0" dy="0" stdDeviation="20" flood-color="${electricBlue}" flood-opacity="${animationPhase === 'completed' ? '0.4' : '0'}"/>
      <feDropShadow dx="0" dy="0" stdDeviation="30" flood-color="${neonColor}" flood-opacity="${animationPhase === 'completed' ? '0.2' : '0'}"/>
    </filter>
  `;

  // Animation logic
  useEffect(() => {
    let timeouts = [];
    
    const startAnimation = () => {
      if (animationPhase !== 'idle') return;
      
      setAnimationPhase('typing');
      setVisibleLetters(0);
      setShowCursor(true);
      setLeftBraceVisible(false);
      setRightBraceVisible(false);
      
      // Type each letter with delay
      'JSON'.split('').forEach((letter, index) => {
        const timeout = setTimeout(() => {
          setVisibleLetters(index + 1);
        }, 150 * index);
        timeouts.push(timeout);
      });
      
      // Show left brace with bounce
      const leftBraceTimeout = setTimeout(() => {
        setAnimationPhase('braces');
        setLeftBraceVisible(true);
      }, 150 * 4 + 200);
      timeouts.push(leftBraceTimeout);
      
      // Show right brace with bounce
      const rightBraceTimeout = setTimeout(() => {
        setRightBraceVisible(true);
      }, 150 * 4 + 400);
      timeouts.push(rightBraceTimeout);
      
      // Complete animation
      const completeTimeout = setTimeout(() => {
        setAnimationPhase('completed');
        setShowCursor(false);
      }, 150 * 4 + 800);
      timeouts.push(completeTimeout);
      
      // Reset to idle after delay
      const resetTimeout = setTimeout(() => {
        setAnimationPhase('idle');
      }, 150 * 4 + 3000);
      timeouts.push(resetTimeout);
    };

    // Auto-trigger animation on mount
    const mountTimeout = setTimeout(startAnimation, 500);
    timeouts.push(mountTimeout);
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []); // Empty dependency to run only on mount

  // Cursor blinking effect
  useEffect(() => {
    if (!showCursor) return;
    
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(interval);
  }, [showCursor]);

  // Click to replay animation
  const handleClick = () => {
    if (animationPhase === 'idle') {
      setAnimationPhase('typing');
      setVisibleLetters(0);
      setShowCursor(true);
      setLeftBraceVisible(false);
      setRightBraceVisible(false);
      
      // Repeat the same animation sequence
      let timeouts = [];
      'JSON'.split('').forEach((letter, index) => {
        const timeout = setTimeout(() => {
          setVisibleLetters(index + 1);
        }, 150 * index);
        timeouts.push(timeout);
      });
      
      setTimeout(() => {
        setAnimationPhase('braces');
        setLeftBraceVisible(true);
      }, 150 * 4 + 200);
      
      setTimeout(() => {
        setRightBraceVisible(true);
      }, 150 * 4 + 400);
      
      setTimeout(() => {
        setAnimationPhase('completed');
        setShowCursor(false);
      }, 150 * 4 + 800);
      
      setTimeout(() => {
        setAnimationPhase('idle');
      }, 150 * 4 + 3000);
    }
  };

  return (
    <div 
      className={`inline-block cursor-pointer transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1.0)', // Bigger scale on hover
        transition: 'transform 300ms ease-in-out'
      }}
    >
      <svg 
        width={logoWidth} 
        height={logoHeight} 
        viewBox={`0 0 ${logoWidth} ${logoHeight}`} 
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-300 ease-in-out"
      >
      <defs dangerouslySetInnerHTML={{
        __html: `
          ${textGradient}
          ${subtitleGradient}
          ${subtleGlowFilter}
          ${braceDepthFilter}
          ${braceGradient}
          ${completionGlowFilter}
        `
      }} />
      
      {/* Conditional rendering based on submark prop */}
      {submark ? (
        // Submark version - just the iconic braces
        <g transform={`translate(${logoWidth / 2}, ${logoHeight / 2})`}>
          {/* Compact geometric frame */}
          <rect 
            x={-subConfig.fontSize * 0.5} 
            y={-subConfig.fontSize * 0.5} 
            width={subConfig.fontSize} 
            height={subConfig.fontSize} 
            rx={subConfig.fontSize * 0.1}
            fill="none" 
            stroke="url(#brace-gradient)" 
            strokeWidth="1" 
            opacity={isHovered ? 0.7 : 0.4}
            filter="url(#brace-depth)"
            className="transition-all duration-300"
          />
          
          {/* Compact pixelated left brace */}
          <g className="transition-all duration-300">
            <rect x={-subConfig.fontSize * 0.2} y={-subConfig.fontSize * 0.3} width="2" height={subConfig.fontSize * 0.6} fill="url(#brace-gradient)" filter="url(#brace-depth)" />
            <rect x={-subConfig.fontSize * 0.2} y={-subConfig.fontSize * 0.3} width={subConfig.fontSize * 0.06} height="2" fill="url(#brace-gradient)" filter="url(#brace-depth)" />
            <rect x={-subConfig.fontSize * 0.22} y={-subConfig.fontSize * 0.28} width="2" height="2" fill="url(#brace-gradient)" filter="url(#brace-depth)" />
            <rect x={-subConfig.fontSize * 0.25} y={-subConfig.fontSize * 0.02} width="2" height="3" fill="url(#brace-gradient)" filter="url(#brace-depth)" />
            <rect x={-subConfig.fontSize * 0.27} y={-subConfig.fontSize * 0.01} width="2" height="2" fill="url(#brace-gradient)" filter="url(#brace-depth)" />
            <rect x={-subConfig.fontSize * 0.22} y={subConfig.fontSize * 0.26} width="2" height="2" fill="url(#brace-gradient)" filter="url(#brace-depth)" />
            <rect x={-subConfig.fontSize * 0.2} y={subConfig.fontSize * 0.28} width={subConfig.fontSize * 0.06} height="2" fill="url(#brace-gradient)" filter="url(#brace-depth)" />
          </g>
          
          {/* Compact pixelated right brace */}
          <g className="transition-all duration-300">
            <rect x={subConfig.fontSize * 0.18} y={-subConfig.fontSize * 0.3} width="2" height={subConfig.fontSize * 0.6} fill="url(#brace-gradient)" filter="url(#brace-depth)" />
            <rect x={subConfig.fontSize * 0.14} y={-subConfig.fontSize * 0.3} width={subConfig.fontSize * 0.06} height="2" fill="url(#brace-gradient)" filter="url(#brace-depth)" />
            <rect x={subConfig.fontSize * 0.2} y={-subConfig.fontSize * 0.28} width="2" height="2" fill="url(#brace-gradient)" filter="url(#brace-depth)" />
            <rect x={subConfig.fontSize * 0.23} y={-subConfig.fontSize * 0.02} width="2" height="3" fill="url(#brace-gradient)" filter="url(#brace-depth)" />
            <rect x={subConfig.fontSize * 0.25} y={-subConfig.fontSize * 0.01} width="2" height="2" fill="url(#brace-gradient)" filter="url(#brace-depth)" />
            <rect x={subConfig.fontSize * 0.2} y={subConfig.fontSize * 0.26} width="2" height="2" fill="url(#brace-gradient)" filter="url(#brace-depth)" />
            <rect x={subConfig.fontSize * 0.14} y={subConfig.fontSize * 0.28} width={subConfig.fontSize * 0.06} height="2" fill="url(#brace-gradient)" filter="url(#brace-depth)" />
          </g>
        </g>
      ) : (
        // Full logo version
        <>
      {/* Animated JSON text */}
      <g>
        <text 
          x={logoWidth / 2} 
          y={config.spacing.main} 
          fontFamily="'Montserrat', 'Inter', system-ui, -apple-system, sans-serif" 
          fontSize={config.mainFontSize} 
          fontWeight="600" 
          textAnchor="middle" 
          fill="url(#text-gradient)" 
          filter={animationPhase === 'completed' ? "url(#completion-glow)" : "url(#subtle-glow)"}
          className="transition-all duration-500"
          style={{
            letterSpacing: '0.05em'
          }}
        >
          {'JSON'.substring(0, visibleLetters)}
        </text>
        
        {/* Blinking cursor */}
        {(animationPhase === 'typing' && showCursor) && (
          <text 
            x={logoWidth / 2 + (visibleLetters * config.mainFontSize * 0.35) - (1.5 * config.mainFontSize * 0.35)} 
            y={config.spacing.main} 
            fontFamily="'Montserrat', 'Inter', system-ui, -apple-system, sans-serif" 
            fontSize={config.mainFontSize} 
            fontWeight="600" 
            textAnchor="middle" 
            fill="url(#text-gradient)" 
            filter="url(#subtle-glow)"
            className="animate-pulse"
          >
            |
          </text>
        )}
      </g>
      
      {/* PROMPT STUDIO text */}
      <text 
        x={logoWidth / 2} 
        y={config.spacing.sub} 
        fontFamily="'Inter', 'Montserrat', system-ui, -apple-system, sans-serif" 
        fontSize={config.subFontSize} 
        fontWeight="300" 
        textAnchor="middle" 
        fill="url(#subtitle-gradient)" 
        filter="url(#subtle-glow)"
        className="transition-all duration-300"
        style={{
          letterSpacing: '0.15em'
        }}
      >
        PROMPT STUDIO
      </text>
      
      {/* Enhanced braces with geometric frame */}
      <g transform={`translate(${logoWidth / 2}, ${config.spacing.bracket})`}>
        {/* Clean Left Bracket { */}
        <g 
          className="transition-all duration-300" 
          style={{ 
            opacity: leftBraceVisible ? (isHovered ? 0.95 : 0.8) : 0
          }}
        >
          <path 
            d={`M ${-config.mainFontSize * 0.18} ${-config.mainFontSize * 0.28} 
                L ${-config.mainFontSize * 0.28} ${-config.mainFontSize * 0.28} 
                L ${-config.mainFontSize * 0.28} ${-config.mainFontSize * 0.05} 
                L ${-config.mainFontSize * 0.32} ${-config.mainFontSize * 0.05} 
                L ${-config.mainFontSize * 0.32} ${config.mainFontSize * 0.05} 
                L ${-config.mainFontSize * 0.28} ${config.mainFontSize * 0.05} 
                L ${-config.mainFontSize * 0.28} ${config.mainFontSize * 0.28} 
                L ${-config.mainFontSize * 0.18} ${config.mainFontSize * 0.28}`}
            stroke="url(#brace-gradient)" 
            strokeWidth="2" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            filter="url(#brace-depth)"
          />
        </g>
        
        {/* Clean Right Bracket } */}
        <g 
          className="transition-all duration-300" 
          style={{ 
            opacity: rightBraceVisible ? (isHovered ? 0.95 : 0.8) : 0
          }}
        >
          <path 
            d={`M ${config.mainFontSize * 0.18} ${-config.mainFontSize * 0.28} 
                L ${config.mainFontSize * 0.28} ${-config.mainFontSize * 0.28} 
                L ${config.mainFontSize * 0.28} ${-config.mainFontSize * 0.05} 
                L ${config.mainFontSize * 0.32} ${-config.mainFontSize * 0.05} 
                L ${config.mainFontSize * 0.32} ${config.mainFontSize * 0.05} 
                L ${config.mainFontSize * 0.28} ${config.mainFontSize * 0.05} 
                L ${config.mainFontSize * 0.28} ${config.mainFontSize * 0.28} 
                L ${config.mainFontSize * 0.18} ${config.mainFontSize * 0.28}`}
            stroke="url(#brace-gradient)" 
            strokeWidth="2" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            filter="url(#brace-depth)"
          />
        </g>
      </g>
        </>
      )}
      </svg>
    </div>
  );
};

export default Logo; 