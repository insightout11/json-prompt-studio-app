import React from 'react';
import usePromptStore from './store';

const ConsistencyBadge = ({ className = "" }) => {
  const { hasActiveConsistencyFeatures, hasActiveLocks } = usePromptStore();

  // Don't render if no consistency features are active
  if (!hasActiveConsistencyFeatures()) {
    return null;
  }

  const isLocked = hasActiveLocks();

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
      isLocked 
        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-700/50' 
        : 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700/50'
    } ${className}`}>
      <span className="text-xs">
        {isLocked ? '🔒' : '⚙️'}
      </span>
      <span>
        {isLocked ? 'locks on' : 'consistency'}
      </span>
    </div>
  );
};

export default ConsistencyBadge;