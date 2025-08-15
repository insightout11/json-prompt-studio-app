import React, { useState, useEffect } from 'react';

const ProgressiveLoadingIndicator = ({ 
  isLoading = false,
  operationType = 'processing', // 'text', 'image', 'style', 'character', 'world', 'processing'
  currentStep = 0,
  totalSteps = 3,
  onRetry = null,
  showRetryAfter = 15000, // Show retry after 15 seconds
  customSteps = null
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showRetry, setShowRetry] = useState(false);

  // Operation-specific configurations
  const operationConfigs = {
    text: {
      steps: ['Processing text', 'Analyzing content', 'Generating JSON'],
      duration: 4000,
      icon: '📝'
    },
    image: {
      steps: ['Uploading image', 'AI analysis', 'Extracting details', 'Building JSON'],
      duration: 12000,
      icon: '🖼️'
    },
    style: {
      steps: ['Analyzing preferences', 'Generating variations', 'Applying style rules'],
      duration: 8000,
      icon: '🎨'
    },
    character: {
      steps: ['Creating foundation', 'Adding personality', 'Generating variations'],
      duration: 10000,
      icon: '👤'
    },
    world: {
      steps: ['Building environment', 'Adding atmosphere', 'Creating details'],
      duration: 10000,
      icon: '🌍'
    },
    processing: {
      steps: ['Initializing', 'Processing', 'Finalizing'],
      duration: 6000,
      icon: '⚙️'
    }
  };

  const config = operationConfigs[operationType] || operationConfigs.processing;
  const steps = customSteps || config.steps;
  const estimatedDuration = config.duration;
  const stepDuration = estimatedDuration / steps.length;

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      setCurrentStepIndex(0);
      setElapsedTime(0);
      setShowRetry(false);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);
      
      // Calculate progress based on time
      const timeProgress = Math.min((elapsed / estimatedDuration) * 100, 95);
      setProgress(timeProgress);
      
      // Update current step
      const newStepIndex = Math.min(Math.floor(elapsed / stepDuration), steps.length - 1);
      setCurrentStepIndex(newStepIndex);
      
      // Show retry option after specified time
      if (elapsed > showRetryAfter && onRetry) {
        setShowRetry(true);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading, estimatedDuration, stepDuration, showRetryAfter, onRetry]);

  // Complete progress when step changes from outside
  useEffect(() => {
    if (currentStep > 0) {
      const stepProgress = (currentStep / totalSteps) * 100;
      setProgress(stepProgress);
      setCurrentStepIndex(Math.min(currentStep - 1, steps.length - 1));
    }
  }, [currentStep, totalSteps, steps.length]);

  if (!isLoading) return null;

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    return seconds < 10 ? `${seconds}s` : `${seconds}s`;
  };

  const estimatedRemaining = Math.max(0, estimatedDuration - elapsedTime);

  return (
    <div className="w-full space-y-4 p-4 bg-gray-50 dark:bg-cinema-card rounded-lg border border-gray-200 dark:border-cinema-border">
      {/* Header with icon and operation type */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{config.icon}</span>
          <span className="text-sm font-medium text-gray-700 dark:text-cinema-text capitalize">
            {operationType} Operation
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-cinema-text-muted">
          {formatTime(elapsedTime)}
          {estimatedRemaining > 1000 && (
            <span className="ml-1">
              / ~{formatTime(estimatedDuration)}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-gray-200 dark:bg-cinema-border rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600 dark:text-cinema-text-muted">
            {Math.round(progress)}% complete
          </span>
          <span className="text-gray-600 dark:text-cinema-text-muted">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
        </div>
      </div>

      {/* Current Step Description */}
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 dark:text-cinema-text">
            {steps[currentStepIndex]}...
          </p>
          {progress > 80 && (
            <p className="text-xs text-gray-500 dark:text-cinema-text-muted mt-1">
              Almost done, finalizing results
            </p>
          )}
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-2 h-2 rounded-full transition-colors ${
              index <= currentStepIndex 
                ? 'bg-purple-500' 
                : 'bg-gray-300 dark:bg-cinema-border'
            }`} />
            {index < steps.length - 1 && (
              <div className={`w-4 h-px transition-colors ${
                index < currentStepIndex
                  ? 'bg-purple-500'
                  : 'bg-gray-300 dark:bg-cinema-border'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Long operation warning and retry */}
      {elapsedTime > showRetryAfter && (
        <div className="pt-2 border-t border-gray-200 dark:border-cinema-border">
          <div className="flex items-center justify-between">
            <p className="text-xs text-amber-600 dark:text-amber-400">
              ⏰ This is taking longer than usual
            </p>
            {onRetry && showRetry && (
              <button
                onClick={onRetry}
                className="text-xs px-2 py-1 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressiveLoadingIndicator;