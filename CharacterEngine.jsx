import React, { useState } from 'react';

const CharacterEngine = ({ currentJson, onResult }) => {
  // This component now just serves as a simple button to open the Progressive Character Modal
  // The actual functionality has been moved to ProgressiveCharacterModal.jsx

  return (
    <div className="text-center">
      <h4 className="text-lg font-semibold text-light-text dark:text-cinema-text mb-2">
        AI Character Engine
      </h4>
      <p className="text-sm text-light-text-muted dark:text-cinema-text-muted mb-4">
        Create characters using progressive AI questioning with visual-first approach
      </p>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4 mb-4">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          🎭 Progressive Character Builder
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-400">
          Describe your character and I'll guide you through 6 targeted questions focusing on visual elements, movement, voice, and personality to build them out completely.
        </p>
      </div>

      <p className="text-xs text-light-text-muted dark:text-cinema-text-muted">
        This will open in a modal overlay for the best experience
      </p>
    </div>
  );
};

export default CharacterEngine;