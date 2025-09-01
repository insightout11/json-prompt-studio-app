import React, { useState, useEffect } from 'react';
import Logo from './Logo';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing JSON Prompt Studio...');
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Fade in content after component mounts
    const contentTimer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(contentTimer);
  }, []);
  
  useEffect(() => {
    const messages = [
      'Initializing JSON Prompt Studio...',
      'Loading creative components...',
      'Preparing dialogue systems...',
      'Setting up sound design tools...',
      'Configuring presets library...',
      'Almost ready...'
    ];
    
    let messageIndex = 0;
    let progressValue = 0;
    
    const interval = setInterval(() => {
      progressValue += 1;
      setProgress(progressValue);
      
      // Update loading message based on progress
      const newMessageIndex = Math.floor((progressValue / 100) * messages.length);
      if (newMessageIndex !== messageIndex && newMessageIndex < messages.length) {
        messageIndex = newMessageIndex;
        setLoadingText(messages[messageIndex]);
      }
      
      if (progressValue >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, 30); // Complete in about 3 seconds
    
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black flex items-center justify-center z-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-teal-400 to-blue-500 dark:from-teal-500 dark:to-purple-500 rounded-full blur-3xl animate-float-orb" />
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-500 dark:from-purple-500 dark:to-amber-500 rounded-full blur-3xl animate-float-orb-delayed" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-cyan-400 to-teal-500 dark:from-teal-500 dark:to-green-500 rounded-full blur-2xl animate-breathe" />
        
        {/* Geometric Shapes */}
        <div className="absolute top-32 right-32 w-16 h-16 border-2 border-teal-400/30 dark:border-teal-500/30 animate-shape-morph" />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-blue-500/20 dark:from-purple-500/20 dark:to-teal-500/20 animate-rotate-slow" />
      </div>

      {/* Main Content */}
      <div className={`text-center space-y-8 max-w-md w-full px-6 relative z-10 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Logo with enhanced animation */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-purple-500 dark:from-teal-500 dark:to-purple-500 rounded-full blur-xl opacity-30 animate-glow-pulse" />
            <div 
              className="relative transform transition-all duration-500 hover:scale-105"
              style={{
                animation: 'breathe 3s ease-in-out infinite, gentle-float 4s ease-in-out infinite'
              }}
            >
              <Logo size="large" />
            </div>
          </div>
        </div>
        
        {/* Enhanced Progress bar */}
        <div className="space-y-4">
          <div className="relative">
            {/* Progress bar background with glow */}
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden relative shadow-inner">
              <div 
                className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 dark:from-teal-500 dark:via-purple-500 dark:to-amber-500 h-full rounded-full transition-all duration-500 ease-out relative"
                style={{ 
                  width: `${progress}%`,
                  boxShadow: `0 0 ${Math.max(progress / 5, 5)}px rgba(20, 184, 166, 0.4)`
                }}
              >
                {/* Multiple shimmer effects */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
                  style={{
                    animation: 'shimmer 2s ease-in-out infinite'
                  }}
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-200/30 to-transparent animate-shimmer-slow"
                  style={{
                    animation: 'shimmer-slow 3s ease-in-out infinite',
                    animationDelay: '0.5s'
                  }}
                />
                
                {/* Progress trail particles */}
                {progress > 10 && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2">
                    <div className="w-2 h-2 bg-teal-400 dark:bg-teal-500 rounded-full animate-ping" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Surrounding glow effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-purple-500/20 dark:from-teal-500/20 dark:to-purple-500/20 rounded-full blur-md -z-10 opacity-60"
              style={{
                transform: `scaleX(${progress / 100})`,
                transformOrigin: 'left center'
              }}
            />
          </div>
          
          {/* Progress percentage with animation */}
          <div className="text-sm font-medium">
            <span className="bg-gradient-to-r from-teal-600 to-purple-600 dark:from-teal-500 dark:to-purple-500 bg-clip-text text-transparent animate-pulse-gentle">
              {progress}%
            </span>
          </div>
        </div>
        
        {/* Enhanced Loading text */}
        <div className="space-y-3">
          <div className="relative">
            <div 
              className="text-lg font-medium bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent transition-all duration-500"
              style={{
                textShadow: '0 0 10px rgba(20, 184, 166, 0.2)'
              }}
            >
              {loadingText}
            </div>
            {/* Subtle accent line */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-teal-400 to-purple-500 dark:from-teal-500 dark:to-purple-500 rounded-full opacity-60" />
          </div>
          
          {/* Enhanced animated dots */}
          <div className="flex justify-center space-x-2">
            <div 
              className="w-2.5 h-2.5 bg-gradient-to-r from-teal-500 to-blue-500 dark:from-teal-500 dark:to-purple-500 rounded-full animate-bounce shadow-sm"
              style={{ animationDelay: '0ms', animationDuration: '1.2s' }}
            />
            <div 
              className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-500 dark:to-amber-500 rounded-full animate-bounce shadow-sm"
              style={{ animationDelay: '200ms', animationDuration: '1.2s' }}
            />
            <div 
              className="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-amber-500 dark:to-green-500 rounded-full animate-bounce shadow-sm"
              style={{ animationDelay: '400ms', animationDuration: '1.2s' }}
            />
          </div>
        </div>
        
        {/* Enhanced Brand tagline */}
        <div className="relative">
          <div className="text-sm text-gray-600 dark:text-gray-400 italic opacity-80 transition-all duration-700">
            Empowering creativity through intelligent prompts
          </div>
          {/* Decorative elements */}
          <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-teal-400 dark:bg-teal-500 rounded-full animate-ping opacity-40" />
          <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-purple-400 dark:bg-purple-500 rounded-full animate-ping opacity-40" style={{ animationDelay: '1s' }} />
        </div>
      </div>
      
      {/* CSS for custom animations */}
      <style>{`
        /* Cinema-inspired keyframe animations */
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        
        @keyframes shimmer-slow {
          0% {
            transform: translateX(-150%);
          }
          100% {
            transform: translateX(250%);
          }
        }
        
        @keyframes float-orb {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% { 
            transform: translate(30px, -20px) rotate(90deg) scale(1.1);
          }
          50% { 
            transform: translate(10px, -40px) rotate(180deg) scale(0.9);
          }
          75% { 
            transform: translate(-20px, -10px) rotate(270deg) scale(1.05);
          }
        }
        
        @keyframes float-orb-delayed {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% { 
            transform: translate(-25px, 15px) rotate(-90deg) scale(0.9);
          }
          50% { 
            transform: translate(15px, 35px) rotate(-180deg) scale(1.1);
          }
          75% { 
            transform: translate(20px, -15px) rotate(-270deg) scale(0.95);
          }
        }
        
        @keyframes breathe {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
          }
          50% { 
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        
        @keyframes gentle-float {
          0%, 100% { 
            transform: translateY(0px);
          }
          50% { 
            transform: translateY(-8px);
          }
        }
        
        @keyframes glow-pulse {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        
        @keyframes shape-morph {
          0%, 100% { 
            transform: rotate(0deg) scale(1);
            border-radius: 20%;
          }
          25% { 
            transform: rotate(90deg) scale(1.2);
            border-radius: 50%;
          }
          50% { 
            transform: rotate(180deg) scale(0.8);
            border-radius: 20%;
          }
          75% { 
            transform: rotate(270deg) scale(1.1);
            border-radius: 50%;
          }
        }
        
        @keyframes rotate-slow {
          0% { 
            transform: rotate(0deg);
          }
          100% { 
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { 
            opacity: 1;
          }
          50% { 
            opacity: 0.7;
          }
        }
        
        /* Animation classes */
        .animate-float-orb {
          animation: float-orb 8s ease-in-out infinite;
        }
        
        .animate-float-orb-delayed {
          animation: float-orb-delayed 10s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-breathe {
          animation: breathe 4s ease-in-out infinite;
        }
        
        .animate-glow-pulse {
          animation: glow-pulse 3s ease-in-out infinite;
        }
        
        .animate-shape-morph {
          animation: shape-morph 6s ease-in-out infinite;
        }
        
        .animate-rotate-slow {
          animation: rotate-slow 15s linear infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animate-shimmer-slow {
          animation: shimmer-slow 3s ease-in-out infinite;
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .absolute.top-20.left-20 {
            top: 10px;
            left: 10px;
            width: 80px;
            height: 80px;
          }
          
          .absolute.bottom-32.right-20 {
            bottom: 10px;
            right: 10px;
            width: 100px;
            height: 100px;
          }
          
          .absolute.top-32.right-32 {
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
          }
        }
        
        /* Accessibility - respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;