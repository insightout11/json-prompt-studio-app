import React, { useState } from 'react';
import SmartAspectRatioSuggester from './SmartAspectRatioSuggester';

const AspectRatioToggle = ({ value = "16:9", onChange, className = "", jsonContent = null, isPro = false }) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");

  const aspectRatios = [
    { value: "1:1", label: "Square", icon: "🔳", description: "Instagram posts, profile pictures" },
    { value: "16:9", label: "Widescreen", icon: "🖥️", description: "YouTube, TV, monitors" },
    { value: "9:16", label: "Vertical", icon: "📱", description: "TikTok, Instagram Stories, Reels" },
    { value: "4:3", label: "Classic", icon: "📺", description: "Traditional TV, presentations" },
    { value: "21:9", label: "Cinematic", icon: "🎬", description: "Ultra-wide, movie theater" },
    { value: "3:2", label: "Photo", icon: "📸", description: "DSLR cameras, prints" }
  ];

  const handleRatioSelect = (ratio) => {
    setShowCustom(false);
    onChange(ratio);
  };

  const handleCustomSubmit = () => {
    if (customWidth && customHeight) {
      const customRatio = `${customWidth}:${customHeight}`;
      onChange(customRatio);
      setShowCustom(false);
      setCustomWidth("");
      setCustomHeight("");
    }
  };

  const getPlatformRecommendation = (ratio) => {
    switch (ratio) {
      case "9:16":
        return "💡 Perfect for TikTok, Instagram Reels, YouTube Shorts";
      case "16:9":
        return "💡 Ideal for YouTube, streaming, desktop viewing";
      case "1:1":
        return "💡 Great for Instagram posts, social media sharing";
      case "21:9":
        return "💡 Cinematic look, perfect for dramatic scenes";
      case "4:3":
        return "💡 Classic format, great for presentations";
      case "3:2":
        return "💡 Professional photography standard";
      default:
        return "💡 Custom aspect ratio";
    }
  };

  const isCompact = className.includes('compact-mode');

  return (
    <div className={`aspect-ratio-toggle ${className}`}>
      {!isCompact && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-cinema-text">
            Aspect Ratio
          </h3>
          <div className="text-xs text-gray-500 dark:text-cinema-text-muted">
            Current: {value}
          </div>
        </div>
      )}
      
      {isCompact && (
        <div className="mb-3">
          <div className="text-xs text-gray-500 dark:text-cinema-text-muted mb-1">
            Current: {value}
          </div>
        </div>
      )}

      {/* Quick Select Buttons */}
      <div className={`grid gap-1 mb-3 ${isCompact ? 'grid-cols-3' : 'grid-cols-6'}`}>
        {aspectRatios.map((ratio) => (
          <button
            key={ratio.value}
            onClick={() => handleRatioSelect(ratio.value)}
            className={`${isCompact ? 'p-2' : 'p-2'} text-center rounded-md border transition-all duration-200 text-xs ${
              value === ratio.value
                ? 'border-green-600 bg-green-50 dark:bg-green-900/20 dark:border-green-400 text-green-700 dark:text-green-400'
                : 'border-gray-200 dark:border-cinema-border hover:border-green-400 dark:hover:border-green-500 bg-white dark:bg-cinema-card text-gray-600 dark:text-cinema-text-muted'
            }`}
            title={ratio.description}
          >
            <div className={`${isCompact ? 'text-sm' : 'text-sm'} mb-0.5`}>{ratio.icon}</div>
            <div className={`font-medium ${isCompact ? 'text-[10px]' : 'text-[10px]'} leading-none`}>{ratio.value}</div>
          </button>
        ))}
      </div>

      {/* Custom Ratio Button */}
      <button
        onClick={() => setShowCustom(!showCustom)}
        className={`w-full ${isCompact ? 'p-1.5 text-xs' : 'p-2 text-sm'} rounded-lg border transition-all ${
          showCustom
            ? 'border-green-600 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
            : 'border-gray-300 dark:border-cinema-border hover:border-green-400 text-gray-600 dark:text-cinema-text-muted'
        }`}
      >
        + Custom Ratio
      </button>

      {/* Custom Ratio Input */}
      {showCustom && (
        <div className={`mt-3 ${isCompact ? 'p-3' : 'p-4'} bg-gray-50 dark:bg-cinema-card rounded-lg border border-gray-200 dark:border-cinema-border`}>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Width"
              value={customWidth}
              onChange={(e) => setCustomWidth(e.target.value)}
              className={`flex-1 ${isCompact ? 'px-2 py-1.5 text-sm' : 'px-3 py-2'} border border-gray-300 dark:border-cinema-border rounded-md focus:ring-2 focus:ring-green-600 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-cinema-panel text-gray-900 dark:text-cinema-text`}
            />
            <span className="text-gray-500 dark:text-cinema-text-muted">:</span>
            <input
              type="number"
              placeholder="Height"
              value={customHeight}
              onChange={(e) => setCustomHeight(e.target.value)}
              className={`flex-1 ${isCompact ? 'px-2 py-1.5 text-sm' : 'px-3 py-2'} border border-gray-300 dark:border-cinema-border rounded-md focus:ring-2 focus:ring-green-600 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-cinema-panel text-gray-900 dark:text-cinema-text`}
            />
            <button
              onClick={handleCustomSubmit}
              disabled={!customWidth || !customHeight}
              className={`${isCompact ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm'} bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors`}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Platform Recommendation */}
      <div className={`mt-3 ${isCompact ? 'p-2' : 'p-3'} bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50`}>
        <div className={`${isCompact ? 'text-[10px]' : 'text-xs'} text-blue-700 dark:text-blue-300`}>
          {getPlatformRecommendation(value)}
        </div>
      </div>

      {/* Smart Aspect Ratio Button */}
      {isPro && jsonContent && (
        <button
          onClick={() => {
            // Simple smart logic based on content
            const scene = jsonContent.scene || '';
            const setting = jsonContent.setting || '';
            
            if (scene.toLowerCase().includes('vertical') || scene.toLowerCase().includes('phone') || setting.includes('social')) {
              onChange('9:16');
            } else if (scene.toLowerCase().includes('cinematic') || scene.toLowerCase().includes('movie')) {
              onChange('21:9');
            } else if (scene.toLowerCase().includes('square') || setting.includes('instagram')) {
              onChange('1:1');
            } else {
              onChange('16:9');
            }
          }}
          className={`w-full ${isCompact ? 'p-1.5 text-[10px]' : 'p-2 text-xs'} bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-700/50 text-purple-700 dark:text-purple-300 rounded-md transition-all duration-200 font-medium mt-2`}
        >
          ✨ Smart Suggest
        </button>
      )}
    </div>
  );
};

export default AspectRatioToggle;