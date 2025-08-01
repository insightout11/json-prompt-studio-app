import React, { useState, useEffect } from 'react';
import { AspectRatioAI } from './AspectRatioAI';

const SmartAspectRatioSuggester = ({ jsonContent, currentRatio, onSuggestionApply, isPro = false }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // AI Analysis using sophisticated engine
  const analyzeContent = (content) => {
    return AspectRatioAI.analyzeContent(content);
  };

  // Trigger analysis when JSON content changes
  useEffect(() => {
    if (jsonContent && Object.keys(jsonContent).length > 0) {
      setIsAnalyzing(true);
      // Simulate AI processing delay for better UX
      const timeout = setTimeout(() => {
        const newSuggestions = analyzeContent(jsonContent);
        setSuggestions(newSuggestions);
        setIsAnalyzing(false);
        if (newSuggestions.length > 0) {
          setShowSuggestions(true);
        }
      }, 500);

      return () => clearTimeout(timeout);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [jsonContent]);

  const handleApplySuggestion = (ratio) => {
    onSuggestionApply(ratio);
    setShowSuggestions(false);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600 dark:text-green-400';
    if (confidence >= 80) return 'text-blue-600 dark:text-blue-400';
    if (confidence >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getConfidenceBorder = (confidence) => {
    if (confidence >= 90) return 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/10';
    if (confidence >= 80) return 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10';
    if (confidence >= 70) return 'border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/10';
    return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/10';
  };

  if (!isPro) {
    return (
      <div className="p-4 border border-gray-200 dark:border-cinema-border rounded-lg bg-gray-50 dark:bg-cinema-card/50">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg">🤖</span>
          <h4 className="font-medium text-gray-700 dark:text-cinema-text">AI Aspect Ratio Suggestions</h4>
          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full">Pro</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-cinema-text-muted mb-3">
          Get intelligent aspect ratio recommendations based on your content analysis.
        </p>
        <button className="text-sm text-green-600 dark:text-green-400 hover:underline">
          Upgrade to Pro for AI Suggestions →
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Analysis Status */}
      {isAnalyzing && (
        <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <span className="text-sm text-blue-700 dark:text-blue-300">🤖 Analyzing content for optimal aspect ratios...</span>
        </div>
      )}

      {/* Suggestions Display */}
      {!isAnalyzing && suggestions.length > 0 && showSuggestions && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🎯</span>
              <h4 className="font-medium text-gray-700 dark:text-cinema-text">AI Recommendations</h4>
            </div>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-xs text-gray-500 dark:text-cinema-text-muted hover:text-gray-700 dark:hover:text-cinema-text"
            >
              Hide
            </button>
          </div>

          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div 
                key={suggestion.ratio}
                className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${getConfidenceBorder(suggestion.confidence)}`}
                onClick={() => handleApplySuggestion(suggestion.ratio)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{suggestion.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-cinema-text">{suggestion.ratio}</span>
                      <span className={`text-xs font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                        {suggestion.confidence}% match
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                          Best Match
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-cinema-text-muted mb-2">
                      {suggestion.reason}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {suggestion.platforms.map(platform => (
                        <span 
                          key={platform}
                          className="px-2 py-0.5 bg-gray-100 dark:bg-cinema-border text-gray-600 dark:text-cinema-text-muted text-xs rounded"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button 
                    className="ml-3 px-3 py-1 bg-white dark:bg-cinema-panel border border-gray-300 dark:border-cinema-border hover:bg-gray-50 dark:hover:bg-cinema-card text-gray-700 dark:text-cinema-text text-xs rounded-md transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplySuggestion(suggestion.ratio);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Suggestions State */}
      {!isAnalyzing && suggestions.length === 0 && Object.keys(jsonContent || {}).length > 0 && (
        <div className="p-3 bg-gray-50 dark:bg-cinema-card/50 rounded-lg border border-gray-200 dark:border-cinema-border">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🤔</span>
            <span className="text-sm text-gray-600 dark:text-cinema-text-muted">
              Add more scene details for personalized aspect ratio suggestions
            </span>
          </div>
        </div>
      )}

      {/* Quick Re-analyze Button */}
      {!isAnalyzing && suggestions.length > 0 && !showSuggestions && (
        <button
          onClick={() => setShowSuggestions(true)}
          className="w-full p-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 transition-colors"
        >
          🎯 Show AI Aspect Ratio Suggestions
        </button>
      )}
    </div>
  );
};

export default SmartAspectRatioSuggester;