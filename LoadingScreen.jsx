import React, { useState, useEffect } from 'react';
import Logo from './Logo';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing JSON Prompt Studio...');
  
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
    <div className="fixed inset-0 bg-white dark:bg-cinema-black flex items-center justify-center z-50 transition-all duration-300">
      <div className="text-center space-y-8 max-w-md w-full px-6">
        {/* Logo with special loading animation */}
        <div className="flex justify-center">
          <div 
            className="animate-pulse"
            style={{
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          >
            <Logo size="large" />
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="space-y-4">
          <div className="bg-gray-200 dark:bg-cinema-border rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-600 to-green-400 h-full rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Animated shine effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                style={{
                  animation: 'shimmer 1.5s ease-in-out infinite'
                }}
              />
            </div>
          </div>
          
          {/* Progress percentage */}
          <div className="text-sm text-gray-600 dark:text-cinema-text-muted font-medium">
            {progress}%
          </div>
        </div>
        
        {/* Loading text */}
        <div className="space-y-2">
          <div className="text-lg font-medium text-gray-900 dark:text-cinema-text">
            {loadingText}
          </div>
          
          {/* Animated dots */}
          <div className="flex justify-center space-x-1">
            <div 
              className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <div 
              className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <div 
              className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>
        
        {/* Brand tagline */}
        <div className="text-sm text-gray-500 dark:text-cinema-text-muted italic">
          Empowering creativity through intelligent prompts
        </div>
      </div>
      
      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;