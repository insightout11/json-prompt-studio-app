import React, { useState, useEffect } from 'react';
import usePromptStore from './store';
import { useSubscription } from './StripeIntegration';
import { useToast } from './useToast';
import LoadingButton from './LoadingButton';

// Tiny component: PreviewControls
const PreviewControls = ({ model, onChangeModel, onPreview, proCredits, isGenerating, isPro }) => {
  const [showUpsell, setShowUpsell] = useState(false);
  
  const handleModelChange = (newModel) => {
    if (newModel === 'gemini' && !isPro) {
      setShowUpsell(true);
      return;
    }
    setShowUpsell(false);
    onChangeModel(newModel);
  };

  return (
    <div className="space-y-2">
      {/* Main Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Model Dropdown */}
          <div className="relative">
            <select
              value={model}
              onChange={(e) => handleModelChange(e.target.value)}
              className="appearance-none bg-white dark:bg-cinema-dark border border-gray-300 dark:border-cinema-accent/30 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 dark:text-cinema-text focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8"
            >
              <option value="horde">Stable Horde (Free)</option>
              <option value="gemini">Nano-Banana (Pro)</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Preview Button */}
          <LoadingButton
            onClick={onPreview}
            loading={isGenerating}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            {isGenerating ? 'Generating...' : 'Preview Image'}
          </LoadingButton>
        </div>

        {/* Credits Pill (Pro only) */}
        {isPro && proCredits && (
          <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-xs font-medium">
            <span className="text-purple-700 dark:text-purple-300">
              {proCredits} left
            </span>
          </div>
        )}
      </div>

      {/* Composed prompt line */}
      <p className="text-xs text-gray-500 dark:text-cinema-text-muted">
        Composed from your JSON.
      </p>

      {/* Upsell Popover */}
      {showUpsell && (
        <div className="bg-white dark:bg-cinema-dark border border-gray-200 dark:border-cinema-accent/30 rounded-lg shadow-lg p-4 mt-2">
          <div className="text-sm">
            <p className="font-medium text-gray-900 dark:text-cinema-text mb-2">
              Sharper details & better prompt adherence (~$0.039/gen). Get 150 images/month.
            </p>
            <div className="flex space-x-2">
              <button 
                className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                onClick={() => setShowUpsell(false)}
              >
                See plans
              </button>
              <button 
                className="px-3 py-1.5 bg-gray-100 dark:bg-cinema-accent/30 text-gray-700 dark:text-cinema-text text-xs rounded-lg hover:bg-gray-200 dark:hover:bg-cinema-accent/50 transition-colors"
                onClick={() => {
                  setShowUpsell(false);
                  onChangeModel('horde');
                }}
              >
                Use Free preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Tiny component: ActionBar
const ActionBar = ({ onRegenerate, onUseInStoryboard, onDownload, onEdit, isPro, isEditMode, setIsEditMode }) => {
  const [editInput, setEditInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyEdit = async () => {
    if (!editInput.trim()) return;
    setIsApplying(true);
    try {
      await onEdit(editInput.trim());
      setEditInput('');
      setIsEditMode(false);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Main Actions */}
      <div className="flex items-center space-x-1 text-sm">
        <button 
          onClick={onRegenerate}
          className="text-gray-700 dark:text-cinema-text hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          Regenerate
        </button>
        <span className="text-gray-400">•</span>
        <button 
          onClick={onUseInStoryboard}
          className="text-gray-700 dark:text-cinema-text hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          Use in Storyboard
        </button>
        <span className="text-gray-400">•</span>
        <button 
          onClick={onDownload}
          className="text-gray-700 dark:text-cinema-text hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          Download
        </button>
        
        {/* Natural Language Edit (Pro only) */}
        {isPro && !isEditMode && (
          <>
            <span className="text-gray-400">•</span>
            <button 
              onClick={() => setIsEditMode(true)}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium"
            >
              Edit with natural language
            </button>
          </>
        )}
      </div>

      {/* Edit Input (Pro only) */}
      {isPro && isEditMode && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
            placeholder="Describe a tweak… e.g., 'make the scene rainy at night'"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-cinema-accent/30 rounded-lg bg-white dark:bg-cinema-navy text-gray-900 dark:text-cinema-text text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleApplyEdit();
              if (e.key === 'Escape') setIsEditMode(false);
            }}
            autoFocus
          />
          <button
            onClick={handleApplyEdit}
            disabled={!editInput.trim() || isApplying}
            className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? 'Applying...' : 'Apply'}
          </button>
          <button
            onClick={() => setIsEditMode(false)}
            className="px-3 py-2 bg-gray-100 dark:bg-cinema-accent/30 text-gray-700 dark:text-cinema-text text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-cinema-accent/50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

// Tiny component: PreviewResult
const PreviewResult = ({ image, onRegenerate, onUseInStoryboard, onDownload, onEdit, isPro, model }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  if (!image) return null;

  return (
    <div className="space-y-3 border-t border-gray-200 dark:border-cinema-accent/30 pt-4">
      {/* Image Tile */}
      <div className="relative">
        <img
          src={image.url}
          alt={image.prompt}
          className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-cinema-accent/30"
        />
        
        {/* Tiny Provider Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${
            image.provider === 'gemini'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
              : 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200'
          }`}>
            {image.provider === 'gemini' ? 'Pro' : 'Free'}
          </span>
        </div>
      </div>

      {/* Action Bar */}
      <ActionBar 
        onRegenerate={onRegenerate}
        onUseInStoryboard={onUseInStoryboard}
        onDownload={onDownload}
        onEdit={onEdit}
        isPro={isPro}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
      />

      {/* Helper Text */}
      <div className="text-xs text-gray-500 dark:text-cinema-text-muted text-center">
        {model === 'gemini' 
          ? "Generated with Google Gemini 2.5 Flash Image (Nano-Banana)."
          : "Community queue — results may vary."
        }
      </div>
    </div>
  );
};

// Main PreviewTray component
const PreviewTray = ({ 
  storyboardSlotId = null, 
  onImageGenerated = null
}) => {
  const { getJsonOutput } = usePromptStore();
  const { isPro, user } = useSubscription();
  const { addToast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [proCredits, setProCredits] = useState(150);
  const [selectedModel, setSelectedModel] = useState(isPro ? 'gemini' : 'horde');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [lastSceneSeed, setLastSceneSeed] = useState(null);

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

  // Generate deterministic seed for same scene/character
  const generateDeterministicSeed = (prompt) => {
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  // Auto-expand after first image
  useEffect(() => {
    if (currentImage && isCollapsed) {
      setIsCollapsed(false);
    }
  }, [currentImage]);

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
          const newImage = {
            id: jobId,
            url: data.images[0].img,
            prompt: composePromptFromJson(),
            provider: data.provider,
            model: data.images[0].model,
            seed: data.images[0].seed,
            width: data.images[0].width,
            height: data.images[0].height,
            createdAt: new Date().toISOString()
          };
          
          setCurrentImage(newImage);
          
          // Call callback if provided
          if (onImageGenerated) {
            onImageGenerated(newImage);
          }
          
          addToast('Image generated successfully!', 'success');
        }
      } else if (data.status === 'failed') {
        setIsGenerating(false);
        setCurrentJobId(null);
        const errorMsg = data.error || 'Image generation failed';
        
        if (selectedModel === 'horde' && errorMsg.includes('worker')) {
          addToast('Community worker unavailable. Retry or switch to Pro for instant preview.', 'error');
        } else {
          addToast(errorMsg, 'error');
        }
      } else if (data.status === 'processing') {
        setTimeout(() => pollJobStatus(jobId), 3000);
      }
    } catch (error) {
      console.error('Polling error:', error);
      setTimeout(() => pollJobStatus(jobId), 5000);
    }
  };

  const handlePreview = async () => {
    const prompt = composePromptFromJson();
    if (!prompt.trim()) {
      addToast('Please generate your JSON first to create a preview', 'warning');
      return;
    }

    // Generate deterministic seed for same scene
    const sceneSeed = generateDeterministicSeed(prompt);
    setLastSceneSeed(sceneSeed);

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
          seed: sceneSeed,
          variations: 1,
          userId: user?.id,
          userTier: isPro ? 'pro' : 'free',
          storyboardSlotId
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

  const handleRegenerate = () => {
    // Use same seed for consistent regeneration
    const prompt = composePromptFromJson();
    if (lastSceneSeed) {
      handlePreview();
    }
  };

  const handleUseInStoryboard = async () => {
    if (!storyboardSlotId) {
      addToast('No storyboard slot specified', 'warning');
      return;
    }

    if (!currentImage) return;

    try {
      const response = await fetch('/api/storyboard/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyboardId: 'default',
          slotId: storyboardSlotId,
          imageUrl: currentImage.url,
          prompt: currentImage.prompt,
          provider: currentImage.provider,
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

  const handleDownload = () => {
    if (!currentImage) return;
    
    const link = document.createElement('a');
    link.href = currentImage.url;
    link.download = `preview-${currentImage.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = async (editDescription) => {
    if (!currentImage || !isPro) return;

    try {
      setProCredits(prev => Math.max(0, prev - 1));
      
      const response = await fetch('/api/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalImageUrl: currentImage.url,
          originalPrompt: currentImage.prompt,
          editDescription,
          userId: user?.id,
          userTier: 'pro'
        })
      });

      if (response.ok) {
        const data = await response.json();
        addToast('Edit applied successfully!', 'success');
        
        // Replace current image with edited version
        setCurrentImage(prev => ({
          ...prev,
          url: data.editedImageUrl,
          id: data.jobId,
          editHistory: [...(prev.editHistory || []), {
            original: prev.url,
            description: editDescription,
            timestamp: new Date().toISOString()
          }]
        }));
      }
    } catch (error) {
      console.error('Edit error:', error);
      addToast('Failed to apply edit.', 'error');
      setProCredits(prev => prev + 1); // Refund on error
    }
  };

  return (
    <div className="preview-tray bg-white dark:bg-cinema-navy rounded-lg border border-gray-200 dark:border-cinema-accent/30">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-cinema-accent/30">
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
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {/* Preview Controls */}
          <PreviewControls 
            model={selectedModel}
            onChangeModel={setSelectedModel}
            onPreview={handlePreview}
            proCredits={proCredits}
            isGenerating={isGenerating}
            isPro={isPro}
          />

          {/* Preview Result */}
          <PreviewResult 
            image={currentImage}
            onRegenerate={handleRegenerate}
            onUseInStoryboard={handleUseInStoryboard}
            onDownload={handleDownload}
            onEdit={handleEdit}
            isPro={isPro}
            model={selectedModel}
          />
        </div>
      )}
    </div>
  );
};

export default PreviewTray;