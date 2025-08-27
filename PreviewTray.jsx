import React, { useState, useEffect } from 'react';
import usePromptStore from './store';
import { useSubscription } from './StripeIntegration';
import { useToast } from './useToast';
import LoadingButton from './LoadingButton';

const PreviewTray = ({ 
  storyboardSlotId = null, 
  onImageGenerated = null, 
  showToast 
}) => {
  const { getJsonOutput, getFieldValue } = usePromptStore();
  const { isPro, user } = useSubscription();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [credits, setCredits] = useState({ currentCredits: 0, monthlyAllocation: 0 });
  const [showAdvancedPrompt, setShowAdvancedPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [enhancePrompt, setEnhancePrompt] = useState(isPro);
  const [lockConsistency, setLockConsistency] = useState(isPro);
  const [variations, setVariations] = useState(1);
  const [lastUsedPrompt, setLastUsedPrompt] = useState('');

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

  // Load user credits on mount
  useEffect(() => {
    if (isPro && user?.id) {
      fetchCredits();
    }
  }, [isPro, user?.id]);

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
          const newImages = data.images.map(img => ({
            id: Date.now() + Math.random(),
            url: img.img || img.imageUrl,
            prompt: lastUsedPrompt,
            provider: data.provider,
            metadata: img
          }));
          
          setGeneratedImages(prev => [...newImages, ...prev]);
          
          // Auto-add to storyboard if from storyboard slot
          if (storyboardSlotId && newImages[0]) {
            handleUseInStoryboard(newImages[0]);
          }
          
          showToast(`Generated ${newImages.length} image${newImages.length > 1 ? 's' : ''}!`, 'success');
          
          if (onImageGenerated) {
            onImageGenerated(newImages[0]);
          }
        }
        
        // Refresh credits if Pro user
        if (isPro) fetchCredits();
        
      } else if (data.status === 'failed') {
        setIsGenerating(false);
        setCurrentJobId(null);
        showToast('Image generation failed. Please try again.', 'error');
        
      } else if (data.status === 'processing') {
        // Continue polling
        setTimeout(() => pollJobStatus(jobId), 3000);
      }
      
    } catch (error) {
      console.error('Polling error:', error);
      setIsGenerating(false);
      setCurrentJobId(null);
      showToast('Failed to check generation status.', 'error');
    }
  };

  const handleGenerate = async () => {
    const prompt = getEffectivePrompt();
    if (!prompt.trim()) {
      showToast('Please enter a prompt or ensure your JSON has character data.', 'warning');
      return;
    }

    setIsGenerating(true);
    setLastUsedPrompt(prompt);
    
    try {
      const requestBody = {
        prompt: enhancePrompt && isPro ? `masterpiece, best quality, ${prompt}, highly detailed, cinematic` : prompt,
        provider: isPro ? 'gemini' : 'horde',
        width: isPro ? 1024 : 512,
        height: isPro ? 1024 : 512,
        variations: isPro ? variations : 1,
        userId: user?.id || null,
        userTier: isPro ? 'pro' : 'free',
        storyboardSlotId,
        seed: lockConsistency ? Date.now() : null
      };

      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Generation failed');
      }

      const data = await response.json();
      setCurrentJobId(data.jobId);
      
      showToast(`Generation started! ${data.estimatedWait}`, 'info');
      
      // Start polling for status
      setTimeout(() => pollJobStatus(data.jobId), 2000);
      
    } catch (error) {
      setIsGenerating(false);
      console.error('Generation error:', error);
      showToast(error.message || 'Failed to generate image.', 'error');
    }
  };

  const handleUseInStoryboard = async (image) => {
    if (!storyboardSlotId) {
      showToast('Use in Storyboard: Please select a scene first', 'info');
      return;
    }

    try {
      const response = await fetch('/api/storyboard/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyboardId: 'default', // You might want to make this dynamic
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
        showToast(data.message || 'Added to storyboard!', 'success');
      }
    } catch (error) {
      console.error('Storyboard error:', error);
      showToast('Failed to add to storyboard.', 'error');
    }
  };

  const handleEnhance = async (image) => {
    if (!isPro) {
      showToast('Enhancement is a Pro feature', 'warning');
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
        showToast(`Enhancement started! Job ID: ${data.jobId}`, 'info');
        // You could add polling for enhancement status here
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      showToast('Failed to enhance image.', 'error');
    }
  };

  return (
    <div className="preview-tray mt-4 p-4 bg-white dark:bg-cinema-navy rounded-lg border border-gray-200 dark:border-cinema-accent/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-cinema-text">
          Image Preview
        </h3>
        
        {isPro && (
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-cinema-gold">
              {credits.currentCredits} credits remaining
            </span>
            <span className="text-gray-500">
              ~$0.039 / gen (1 credit)
            </span>
          </div>
        )}
      </div>

      {/* Prompt Composer */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-cinema-text">
            Prompt
          </label>
          <button
            onClick={() => setShowAdvancedPrompt(!showAdvancedPrompt)}
            className="text-xs text-cinema-blue hover:text-cinema-blue-light transition-colors"
          >
            {showAdvancedPrompt ? 'Hide' : 'Advanced: Edit prompt'}
          </button>
        </div>
        
        {showAdvancedPrompt ? (
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder={composePromptFromJson() || "Enter your custom prompt..."}
            className="w-full p-3 border border-gray-300 dark:border-cinema-accent/30 rounded-lg bg-white dark:bg-cinema-dark text-gray-900 dark:text-cinema-text resize-none focus:ring-2 focus:ring-cinema-blue focus:border-transparent"
            rows={3}
          />
        ) : (
          <div className="p-3 bg-gray-50 dark:bg-cinema-dark rounded-lg text-sm text-gray-700 dark:text-cinema-text-muted">
            {getEffectivePrompt() || "Auto-generated from your JSON data..."}
          </div>
        )}
      </div>

      {/* Pro Controls */}
      {isPro && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={enhancePrompt}
              onChange={(e) => setEnhancePrompt(e.target.checked)}
              className="rounded border-gray-300 text-cinema-blue focus:ring-cinema-blue"
            />
            <span className="text-sm text-gray-700 dark:text-cinema-text">Enhance Prompt</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={lockConsistency}
              onChange={(e) => setLockConsistency(e.target.checked)}
              className="rounded border-gray-300 text-cinema-blue focus:ring-cinema-blue"
            />
            <span className="text-sm text-gray-700 dark:text-cinema-text">Lock Consistency</span>
          </label>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700 dark:text-cinema-text">Variations:</label>
            <select
              value={variations}
              onChange={(e) => setVariations(parseInt(e.target.value))}
              className="px-2 py-1 text-xs border border-gray-300 dark:border-cinema-accent/30 rounded bg-white dark:bg-cinema-dark text-gray-900 dark:text-cinema-text"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="mb-4">
        <LoadingButton
          onClick={handleGenerate}
          loading={isGenerating}
          disabled={isGenerating}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isPro 
              ? 'bg-gradient-to-r from-cinema-gold to-yellow-600 hover:from-yellow-600 hover:to-cinema-gold text-black'
              : 'bg-gradient-to-r from-cinema-blue to-blue-600 hover:from-blue-600 hover:to-cinema-blue text-white'
          }`}
        >
          {isGenerating 
            ? `Generating... ${isPro ? '(Priority Queue)' : '(Community Queue)'}`
            : `Generate ${isPro ? 'Pro' : 'Free'} Preview${isPro && variations > 1 ? `s (${variations})` : ''}`
          }
        </LoadingButton>
      </div>

      {/* Attribution */}
      <div className="text-xs text-gray-500 dark:text-cinema-text-muted text-center mb-4">
        {isPro 
          ? "Powered by Google Gemini 2.5 Flash Image - Nano-Banana model"
          : "Community preview powered by Stable Horde — results may vary"
        }
      </div>

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-cinema-text">
            Recent Generations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedImages.slice(0, 6).map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-cinema-accent/30"
                />
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                  {!storyboardSlotId && (
                    <button
                      onClick={() => handleUseInStoryboard(image)}
                      className="px-3 py-1 bg-cinema-blue text-white text-xs rounded hover:bg-cinema-blue-light transition-colors"
                    >
                      Use in Storyboard
                    </button>
                  )}
                  
                  {isPro && (
                    <button
                      onClick={() => handleEnhance(image)}
                      className="px-3 py-1 bg-cinema-gold text-black text-xs rounded hover:bg-yellow-600 transition-colors"
                    >
                      Enhance
                    </button>
                  )}
                </div>
                
                {/* Provider Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    image.provider === 'gemini'
                      ? 'bg-cinema-gold text-black'
                      : 'bg-cinema-blue text-white'
                  }`}>
                    {image.provider === 'gemini' ? 'Pro' : 'Free'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewTray;