import React, { useState, useEffect } from 'react';
import usePromptStore from './store';
import { useSubscription } from './StripeIntegration';
import { useToast } from './useToast';
import LoadingButton from './LoadingButton';
import SignupPrompt from './SignupPrompt';

// Tiny component: PreviewControls
const PreviewControls = ({ model, onChangeModel, onPreview, proCredits, isGenerating, isPro }) => {
  const [showUpsell, setShowUpsell] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Check screen size for responsive text
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 370);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
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
              className="appearance-none bg-cinema-card border border-cinema-border rounded-lg px-3 py-2 text-sm font-medium text-cinema-text focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-8"
            >
              <option value="auto">{isSmallScreen ? 'Auto' : 'Auto (Recommended)'}</option>
              <option value="horde">Standard Quality</option>
              <option value="gemini">Premium Quality</option>
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
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 max-[370px]:py-1.5 max-[370px]:px-3 max-[370px]:text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
      <p className="text-xs text-cinema-text-muted">
        Composed from your JSON.
      </p>

      {/* Upsell Popover */}
      {showUpsell && (
        <div className="bg-cinema-card border border-cinema-border rounded-lg shadow-lg p-4 mt-2">
          <div className="text-sm">
            <p className="font-medium text-cinema-text mb-2">
              Get 150 premium generations per month + natural language editing (~$0.10/gen value). 
            </p>
            <div className="flex space-x-2">
              <button 
                className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                onClick={() => setShowUpsell(false)}
              >
                See plans
              </button>
              <button 
                className="px-3 py-1.5 bg-cinema-border text-cinema-text text-xs rounded-lg hover:bg-cinema-card transition-colors"
                onClick={() => {
                  setShowUpsell(false);
                  onChangeModel('auto');
                }}
              >
                Use Auto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Tiny component: ActionBar
const ActionBar = ({ onRegenerate, onUseInStoryboard, onDownload, onEdit, isPro, isEditMode, setIsEditMode, userTier }) => {
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
      {/* Edit Feature for Pro and Free Trial */}
      {(isPro || userTier === 'anonymous' || userTier === 'new_user') && !isEditMode && (
        <div className="flex justify-center">
          <button 
            onClick={() => setIsEditMode(true)}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-full hover:bg-purple-700 transition-colors"
          >
            Edit with natural language
          </button>
        </div>
      )}

      {/* Edit Input for Pro and Free Trial */}
      {(isPro || userTier === 'anonymous' || userTier === 'new_user') && isEditMode && (
        <div className="space-y-3">
          <input
            type="text"
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
            placeholder="Describe a tweak… e.g., 'make the scene rainy at night'"
            className="w-full px-3 py-2 border border-cinema-border rounded-lg bg-cinema-card text-cinema-text text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleApplyEdit();
              if (e.key === 'Escape') setIsEditMode(false);
            }}
            autoFocus
          />
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={handleApplyEdit}
              disabled={!editInput.trim() || isApplying}
              className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApplying ? 'Applying...' : 'Apply'}
            </button>
            <button
              onClick={() => setIsEditMode(false)}
              className="px-4 py-2 bg-cinema-border text-cinema-text text-sm font-medium rounded-full hover:bg-cinema-card transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Tiny component: PreviewResult
const PreviewResult = ({ image, onRegenerate, onUseInStoryboard, onDownload, onEdit, onCloseImage, isPro, model, userTier }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  if (!image) return null;

  return (
    <div className="space-y-3 border-t border-cinema-border pt-4">
      {/* Image Tile */}
      <div className="relative group">
        {/* Consistent Aspect Ratio Container */}
        <div className="aspect-square bg-cinema-card rounded-lg border border-cinema-border overflow-hidden relative">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
          
          <img
            src={image.url}
            alt={image.prompt}
            className="w-full h-full object-contain"
          />
          
          {/* Provider Badge - Top Left */}
          <div className="absolute top-2 left-2 z-10">
            <span 
              className={`px-2 py-1 text-xs font-medium rounded ${
                image.provider === 'gemini'
                  ? 'bg-purple-600 text-white'
                  : 'bg-cinema-teal text-white'
              }`}
              title={image.provider === 'gemini' 
                ? "Pro previews use Google Gemini 2.5 Flash (Nano-Banana) for sharper details, consistent characters, and instant results."
                : "Community queue results"
              }
            >
              {image.provider === 'gemini' ? 'Pro' : 'Free'}
            </span>
          </div>

          {/* Close Button - Top Right */}
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={onCloseImage}
              className="w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-lg font-bold transition-colors shadow-lg"
              title="Close image"
            >
              ×
            </button>
          </div>
          
          {/* Hover Actions Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={onRegenerate}
                className="px-3 py-1.5 bg-white/90 text-gray-900 text-xs font-medium rounded-lg hover:bg-white transition-colors"
                title="Regenerate with same settings"
              >
                Regenerate
              </button>
              <button
                onClick={onDownload}
                className="px-3 py-1.5 bg-cinema-border text-cinema-text text-xs font-medium rounded-lg hover:bg-cinema-card transition-colors"
                title="Download image"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <ActionBar 
        onRegenerate={onRegenerate}
        onDownload={onDownload}
        onEdit={onEdit}
        isPro={isPro}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        userTier={userTier}
      />

      {/* Helper Text */}
      <div className="text-xs text-cinema-text-muted text-center">
        {image.provider === 'gemini' 
          ? "Generated with premium quality Google Gemini 2.5 Flash Image."
          : "Community queue — results may vary. Sign up for premium quality results instantly."
        }
      </div>
    </div>
  );
};

// Main PreviewTray component
const PreviewTray = ({ 
  aspectRatio = '16:9',
  storyboardSlotId = 'slot-1', 
  onImageGenerated = null
}) => {
  const { getJsonOutput } = usePromptStore();
  const { isPro, user } = useSubscription();
  const { addToast } = useToast();
  
  // Determine user tier for access control
  const userTier = isPro ? 'pro' : user ? 'new_user' : 'anonymous';
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [proCredits, setProCredits] = useState(150);
  const [selectedModel, setSelectedModel] = useState('auto');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [lastSceneSeed, setLastSceneSeed] = useState(null);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [signupPromptDismissed, setSignupPromptDismissed] = useState(false);

  // Calculate dimensions based on aspect ratio
  const getDimensionsForAspectRatio = (ratio, provider = 'gemini') => {
    const baseSize = provider === 'gemini' ? 1024 : 512;
    
    switch (ratio) {
      case '16:9':
        return provider === 'gemini' 
          ? { width: 1408, height: 792 }  // Close to 16:9 at high quality
          : { width: 768, height: 432 };  // 16:9 for Horde
      case '9:16':
        return provider === 'gemini'
          ? { width: 792, height: 1408 }  // Portrait 9:16
          : { width: 432, height: 768 };  // Portrait for Horde
      case '1:1':
        return { width: baseSize, height: baseSize }; // Square
      case '4:3':
        return provider === 'gemini'
          ? { width: 1024, height: 768 }   // 4:3 landscape
          : { width: 512, height: 384 };   // 4:3 for Horde
      case '3:4':
        return provider === 'gemini'
          ? { width: 768, height: 1024 }   // 3:4 portrait
          : { width: 384, height: 512 };   // 3:4 for Horde
      default:
        return { width: baseSize, height: baseSize }; // Default square
    }
  };

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
    
    // Calculate dimensions based on aspect ratio
    const dimensions = getDimensionsForAspectRatio(aspectRatio, selectedModel);
    
    try {
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          prompt: prompt.trim(),
          provider: selectedModel === 'auto' ? null : selectedModel, // Let API decide for 'auto'
          width: dimensions.width,
          height: dimensions.height,
          seed: sceneSeed,
          variations: 1,
          userId: user?.id,
          userTier: user?.tier || (isPro ? 'pro' : (user ? 'free' : 'anonymous')),
          storyboardSlotId
        })
      });

      if (!response.ok) {
        // Handle rate limiting for anonymous users
        if (response.status === 429) {
          try {
            const errorData = await response.json();
            if (errorData.suggestedAction === 'signup' && !signupPromptDismissed) {
              setShowSignupPrompt(true);
              // Analytics
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'signup_prompt_viewed', {
                  exhausted_at_count: errorData.current || 3
                });
              }
              return; // Don't show error toast, let signup prompt handle it
            }
            throw new Error(errorData.error || 'Rate limit reached');
          } catch (parseError) {
            throw new Error('Rate limit reached');
          }
        }
        throw new Error('Failed to generate preview');
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      if (data.jobId) {
        setCurrentJobId(data.jobId);
        
        // Check if results are available immediately (Gemini)
        if (data.status === 'completed' && data.images && data.images.length > 0) {
          // Handle immediate results
          const newImage = {
            id: data.jobId,
            url: data.images[0].img, // API returns base64 data directly in 'img' field
            prompt: composePromptFromJson(),
            provider: data.provider,
            model: data.images[0].model || 'gemini-2.5-flash-image-preview',
            seed: data.images[0].seed,
            width: data.images[0].width || 1024,
            height: data.images[0].height || 1024,
            metadata: data.metadata,
            createdAt: new Date().toISOString()
          };
          setCurrentImage(newImage);
          setIsGenerating(false);
          addToast('Image generated successfully!', 'success');
          
          if (onImageGenerated) {
            onImageGenerated(newImage);
          }
        } else {
          // Start polling for async results (Horde)
          addToast('Generation started! This may take 30-120 seconds...', 'info');
          setTimeout(() => pollJobStatus(data.jobId), 2000);
        }
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

  const handleDownload = async () => {
    if (!currentImage) return;
    
    try {
      // Fetch the image data
      const response = await fetch(currentImage.url);
      const blob = await response.blob();
      
      // Create a blob URL and download
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `preview-${currentImage.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
      
      addToast('Image downloaded successfully', 'success');
    } catch (error) {
      console.error('Download failed:', error);
      addToast('Failed to download image', 'error');
    }
  };

  const handleCloseImage = () => {
    setCurrentImage(null);
  };

  const handleEdit = async (editDescription) => {
    if (!currentImage || (!isPro && userTier !== 'anonymous' && userTier !== 'new_user')) return;

    try {
      setProCredits(prev => Math.max(0, prev - 1));
      
      const requestData = {
        originalImageUrl: currentImage.url,
        originalPrompt: currentImage.prompt,
        editDescription,
        userId: user?.id,
        userTier: isPro ? 'pro' : userTier
      };
      
      console.log('[EDIT DEBUG] Sending request with:', {
        userTier: requestData.userTier,
        isPro,
        actualUserTier: userTier,
        hasUser: !!user,
        originalImageUrl: requestData.originalImageUrl,
        originalPrompt: requestData.originalPrompt,
        editDescription: requestData.editDescription,
        currentImage: currentImage
      });
      
      const response = await fetch('/api/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[EDIT DEBUG] API Response:', data);
        addToast('Edit applied successfully!', 'success');
        
        // Replace current image with edited version
        setCurrentImage(prev => ({
          ...prev,
          url: data.editedImage.img,
          id: data.jobId,
          editHistory: [...(prev.editHistory || []), {
            original: prev.url,
            description: editDescription,
            timestamp: new Date().toISOString()
          }]
        }));
      } else {
        console.log('[EDIT DEBUG] API Error Response:', await response.text());
      }
    } catch (error) {
      console.error('Edit error:', error);
      addToast('Failed to apply edit.', 'error');
      setProCredits(prev => prev + 1); // Refund on error
    }
  };

  return (
    <div className="preview-tray bg-cinema-panel rounded-lg border border-cinema-border" data-tutorial="preview-tray">
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

        {/* Signup Prompt for Anonymous Users */}
        {showSignupPrompt && !signupPromptDismissed && (
          <SignupPrompt
            isVisible={true}
            onDismiss={() => setSignupPromptDismissed(true)}
            exhaustedCount={3}
            className="mb-4"
          />
        )}

        {/* Preview Result */}
        <PreviewResult 
          image={currentImage}
          onRegenerate={handleRegenerate}
          onUseInStoryboard={handleUseInStoryboard}
          onDownload={handleDownload}
          onEdit={handleEdit}
          onCloseImage={handleCloseImage}
          isPro={isPro}
          model={selectedModel}
          userTier={userTier}
        />
      </div>
    </div>
  );
};

export default PreviewTray;