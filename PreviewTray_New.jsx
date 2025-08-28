import React, { useState, useEffect } from 'react';
import usePromptStore from './store';
import { useSubscription } from './StripeIntegration';
import { useToast } from './useToast';
import LoadingButton from './LoadingButton';

const PreviewTray = ({ 
  storyboardSlotId = null, 
  onImageGenerated = null
}) => {
  const { getJsonOutput, getFieldValue } = usePromptStore();
  const { isPro, user } = useSubscription();
  const { addToast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [credits, setCredits] = useState({ currentCredits: 150, monthlyAllocation: 150 });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [enhancePrompt, setEnhancePrompt] = useState(isPro);
  const [lockConsistency, setLockConsistency] = useState(isPro);
  const [variations, setVariations] = useState(1);
  const [selectedModel, setSelectedModel] = useState(isPro ? 'gemini' : 'horde');
  const [showUpsellPopover, setShowUpsellPopover] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(generatedImages.length === 0);

  // Auto-compose prompt from current JSON
  const composePromptFromJson = () => {
    const jsonData = getJsonOutput();
    if (!jsonData) return '';

    try {
      const data = JSON.parse(jsonData);
      const parts = [];

      // Character description
      if (data.character_type) parts.push(`${data.character_type}`);
      if (data.age_range) parts.push(`${data.age_range}`);
      if (data.gender) parts.push(`${data.gender}`);
      if (data.ethnicity) parts.push(`${data.ethnicity}`);
      
      // Physical attributes
      if (data.hair_style || data.hair_color) {
        const hair = [data.hair_style, data.hair_color].filter(Boolean).join(' ');
        if (hair) parts.push(`${hair} hair`);
      }
      if (data.clothing) parts.push(`wearing ${data.clothing}`);
      
      // Actions and emotions
      if (data.actions) parts.push(`${data.actions}`);
      if (data.emotions) parts.push(`looking ${data.emotions}`);
      
      // Scene/location
      if (data.location) parts.push(`in ${data.location}`);
      if (data.lighting) parts.push(`with ${data.lighting} lighting`);
      
      // Technical
      if (data.camera_angle) parts.push(`${data.camera_angle} shot`);
      
      return parts.join(', ');
    } catch (error) {
      return 'A cinematic scene';
    }
  };

  // Get effective prompt (custom or auto-generated)
  const getEffectivePrompt = () => {
    return customPrompt.trim() || composePromptFromJson();
  };

  // Get composed prompt summary (one line, muted)
  const getPromptSummary = () => {
    const prompt = getEffectivePrompt();
    return prompt.length > 80 ? `${prompt.substring(0, 80)}...` : prompt;
  };

  // Load user credits on mount
  useEffect(() => {
    if (isPro && user?.id) {
      fetchCredits();
    }
  }, [isPro, user?.id]);

  // Auto-expand after first image
  useEffect(() => {
    if (generatedImages.length > 0 && isCollapsed) {
      setIsCollapsed(false);
    }
  }, [generatedImages.length]);

  const fetchCredits = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/credits?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setCredits(data);
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  const handleModelChange = (model) => {
    if (model === 'gemini' && !isPro) {
      setShowUpsellPopover(true);
      return;
    }
    setSelectedModel(model);
    setShowUpsellPopover(false);
  };

  // Poll for job status
  const pollJobStatus = async (jobId) => {
    try {
      const response = await fetch(`/api/preview-status?jobId=${jobId}`);
      if (!response.ok) throw new Error('Failed to check status');
      
      const data = await response.json();
      
      if (data.status === 'completed') {
        setIsGenerating(false);
        setCurrentJobId(null);
        
        if (data.images && data.images.length > 0) {
          const newImages = data.images.map((img, index) => ({
            id: `${jobId}_${index}`,
            url: img.img,
            prompt: getEffectivePrompt(),
            provider: data.provider,
            model: img.model,
            seed: img.seed,
            width: img.width,
            height: img.height,
            createdAt: new Date().toISOString()
          }));
          
          setGeneratedImages(prev => [...newImages, ...prev]);
          
          // Call callback if provided
          if (onImageGenerated && newImages.length > 0) {
            onImageGenerated(newImages[0]);
          }
          
          addToast(
            `Generated ${newImages.length} image${newImages.length > 1 ? 's' : ''} successfully!`, 
            'success'
          );
        }
      } else if (data.status === 'failed') {
        setIsGenerating(false);
        setCurrentJobId(null);
        addToast(data.error || 'Image generation failed', 'error');
      } else if (data.status === 'processing') {
        // Continue polling
        setTimeout(() => pollJobStatus(jobId), 3000);
      }
    } catch (error) {
      console.error('Polling error:', error);
      setTimeout(() => pollJobStatus(jobId), 5000);
    }
  };

  const handleGenerate = async () => {
    const prompt = getEffectivePrompt();
    if (!prompt.trim()) {
      addToast('Please enter a prompt or ensure your JSON has character data', 'warning');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          provider: selectedModel,
          width: selectedModel === 'gemini' ? 1024 : 512,
          height: selectedModel === 'gemini' ? 1024 : 512,
          seed: Date.now(),
          variations: selectedModel === 'gemini' ? variations : 1,
          userId: user?.id,
          userTier: isPro ? 'pro' : 'free',
          storyboardSlotId,
          enhancePrompt,
          lockConsistency
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const data = await response.json();
      
      if (data.jobId) {
        setCurrentJobId(data.jobId);
        addToast('Generation started! This may take 30-120 seconds...', 'info');
        
        // Start polling for results
        setTimeout(() => pollJobStatus(data.jobId), 2000);
      }
    } catch (error) {
      console.error('Generation error:', error);
      setIsGenerating(false);
      addToast('Failed to generate preview', 'error');
    }
  };

  const handleUseInStoryboard = async (image) => {
    if (!storyboardSlotId) {
      addToast('No storyboard slot specified', 'warning');
      return;
    }

    try {
      const response = await fetch('/api/storyboard/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyboardId: 'default',
          slotId: storyboardSlotId,
          imageUrl: image.url,
          prompt: image.prompt,
          provider: image.provider,
          jobId: currentJobId,
          userId: user?.id,
          action: 'replace'
        })
      });

      if (response.ok) {
        const data = await response.json();
        addToast(data.message || 'Added to storyboard!', 'success');
      }
    } catch (error) {
      console.error('Storyboard error:', error);
      addToast('Failed to add to storyboard.', 'error');
    }
  };

  const handleEnhance = async (image) => {
    if (!isPro) {
      addToast('Enhancement is a Pro feature', 'warning');
      return;
    }

    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalPrompt: image.prompt,
          userId: user?.id,
          userTier: 'pro',
          enhancementType: 'quality',
          originalImageUrl: image.url
        })
      });

      if (response.ok) {
        const data = await response.json();
        addToast(`Enhancement started! Job ID: ${data.jobId}`, 'info');
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      addToast('Failed to enhance image.', 'error');
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleDownload = (image) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `preview-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Model options
  const modelOptions = [
    { value: 'horde', label: 'Stable Horde', tier: 'Free' },
    { value: 'gemini', label: 'Gemini 2.5 Flash Image', tier: 'Pro' }
  ];

  const currentModel = modelOptions.find(m => m.value === selectedModel);

  return (
    <div className="preview-tray bg-white dark:bg-cinema-navy rounded-lg border border-gray-200 dark:border-cinema-accent/30">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-cinema-accent/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-cinema-text hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <span>Preview</span>
              <svg 
                className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Model Pill */}
            <div className="px-2 py-1 bg-gray-100 dark:bg-cinema-dark rounded-full text-xs font-medium">
              <span className="text-gray-600 dark:text-cinema-text-muted">
                {currentModel?.label} • {currentModel?.tier}
              </span>
            </div>
          </div>
          
          {/* Credits Pill */}
          <div className="flex items-center space-x-3 text-sm">
            <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-xs font-medium">
              <span className="text-purple-700 dark:text-purple-300">
                {credits.currentCredits} left
              </span>
            </div>
            <span className="text-gray-500 dark:text-cinema-text-muted text-xs">
              ~$0.039
            </span>
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {/* Main Controls */}
          <div className="flex items-center space-x-3">
            {/* Model Picker Dropdown */}
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                className="appearance-none bg-white dark:bg-cinema-dark border border-gray-300 dark:border-cinema-accent/30 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 dark:text-cinema-text focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8"
              >
                {modelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.tier})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Upsell Popover */}
              {showUpsellPopover && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-cinema-dark border border-gray-200 dark:border-cinema-accent/30 rounded-lg shadow-lg p-4 z-50">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-cinema-text mb-2">
                      Sharper details & consistent characters
                    </p>
                    <p className="text-gray-600 dark:text-cinema-text-muted mb-3">
                      Get ~$0.039/gen with 150 images/month included.
                    </p>
                    <div className="flex space-x-2">
                      <button 
                        className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                        onClick={() => setShowUpsellPopover(false)}
                      >
                        See Plans
                      </button>
                      <button 
                        className="px-3 py-1.5 bg-gray-100 dark:bg-cinema-accent/30 text-gray-700 dark:text-cinema-text text-xs rounded-lg hover:bg-gray-200 dark:hover:bg-cinema-accent/50 transition-colors"
                        onClick={() => setShowUpsellPopover(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Button */}
            <LoadingButton
              onClick={handleGenerate}
              loading={isGenerating}
              disabled={isGenerating}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {isGenerating 
                ? `Generating...`
                : selectedModel === 'gemini' ? 'Generate Pro Preview' : 'Preview Image'
              }
            </LoadingButton>
          </div>

          {/* Advanced Section (Collapsible) */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 text-sm text-gray-600 dark:text-cinema-text-muted hover:text-gray-900 dark:hover:text-cinema-text transition-colors"
            >
              <span>Advanced</span>
              <svg 
                className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-180' : 'rotate-0'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Summary Line */}
            {!showAdvanced && (
              <p className="text-xs text-gray-500 dark:text-cinema-text-muted mt-1">
                {getPromptSummary()}
              </p>
            )}

            {/* Advanced Controls */}
            {showAdvanced && (
              <div className="mt-3 space-y-4 p-4 bg-gray-50 dark:bg-cinema-dark rounded-lg">
                {/* Prompt Textarea */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-cinema-text mb-2">
                    Prompt
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder={composePromptFromJson() || "Enter your custom prompt..."}
                    className="w-full p-3 border border-gray-300 dark:border-cinema-accent/30 rounded-lg bg-white dark:bg-cinema-navy text-gray-900 dark:text-cinema-text text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Toggle Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={enhancePrompt}
                      onChange={(e) => setEnhancePrompt(e.target.checked)}
                      disabled={!isPro}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 disabled:opacity-50"
                    />
                    <span className={`text-sm ${isPro ? 'text-gray-700 dark:text-cinema-text' : 'text-gray-400 dark:text-cinema-text-muted'}`}>
                      Enhance prompt {isPro && '(Pro default ON)'}
                    </span>
                    {!isPro && (
                      <div className="relative group">
                        <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="invisible group-hover:visible absolute -top-8 left-0 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          Available with Pro
                        </div>
                      </div>
                    )}
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={lockConsistency}
                      onChange={(e) => setLockConsistency(e.target.checked)}
                      disabled={!isPro}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 disabled:opacity-50"
                    />
                    <span className={`text-sm ${isPro ? 'text-gray-700 dark:text-cinema-text' : 'text-gray-400 dark:text-cinema-text-muted'}`}>
                      Lock consistency {isPro && '(Pro default ON)'}
                    </span>
                    {!isPro && (
                      <div className="relative group">
                        <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="invisible group-hover:visible absolute -top-8 left-0 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          Available with Pro
                        </div>
                      </div>
                    )}
                  </label>
                </div>

                {/* Variations (Pro only) */}
                {isPro && selectedModel === 'gemini' && (
                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-cinema-text">
                      Variations:
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setVariations(Math.max(1, variations - 1))}
                        className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-cinema-accent/30 rounded text-gray-600 dark:text-cinema-text hover:bg-gray-300 dark:hover:bg-cinema-accent/50 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-gray-900 dark:text-cinema-text">
                        {variations}
                      </span>
                      <button
                        onClick={() => setVariations(Math.min(4, variations + 1))}
                        className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-cinema-accent/30 rounded text-gray-600 dark:text-cinema-text hover:bg-gray-300 dark:hover:bg-cinema-accent/50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Free Mode Helper Text */}
                {!isPro && (
                  <p className="text-xs text-gray-500 dark:text-cinema-text-muted">
                    Community preview — results may vary. Pro gives sharper, consistent results.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Generated Images */}
          {generatedImages.length > 0 && (
            <div className="space-y-4 border-t border-gray-200 dark:border-cinema-accent/30 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedImages.slice(0, 4).map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-cinema-accent/30"
                    />
                    
                    {/* Provider Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        image.provider === 'gemini'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
                          : 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200'
                      }`}>
                        {image.provider === 'gemini' ? 'Pro' : 'Free'}
                      </span>
                    </div>

                    {/* Post-Generate Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                        <button
                          onClick={handleRegenerate}
                          className="px-2 py-1 bg-white/90 text-gray-900 text-xs font-medium rounded hover:bg-white transition-colors"
                        >
                          Regenerate
                        </button>
                        
                        {isPro && (
                          <button
                            onClick={() => handleEnhance(image)}
                            className="px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 transition-colors"
                          >
                            Enhance
                          </button>
                        )}
                        
                        <button
                          className="px-2 py-1 bg-teal-600 text-white text-xs font-medium rounded hover:bg-teal-700 transition-colors"
                        >
                          Compare
                        </button>
                        
                        <button
                          onClick={() => handleUseInStoryboard(image)}
                          className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                        >
                          Use in Storyboard
                        </button>
                        
                        <button
                          onClick={() => handleDownload(image)}
                          className="px-2 py-1 bg-gray-600 text-white text-xs font-medium rounded hover:bg-gray-700 transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Attribution */}
          <div className="text-xs text-gray-500 dark:text-cinema-text-muted text-center pt-2 border-t border-gray-100 dark:border-cinema-accent/20">
            {selectedModel === 'gemini' 
              ? "Powered by Google Gemini 2.5 Flash Image – Nano-Banana model"
              : "Powered by Stable Horde"
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewTray;