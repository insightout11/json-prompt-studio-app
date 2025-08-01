// Advanced AI Analysis Engine for Aspect Ratio Suggestions
export class AspectRatioAI {
  
  static analyzeContent(jsonContent) {
    if (!jsonContent || typeof jsonContent !== 'object') {
      return [];
    }

    const analyzer = new ContentAnalyzer(jsonContent);
    return analyzer.generateSuggestions();
  }
}

class ContentAnalyzer {
  constructor(content) {
    this.content = content;
    this.suggestions = [];
    this.analysisResults = {};
  }

  generateSuggestions() {
    // Run all analysis phases
    this.analyzeBasicContent();
    this.analyzeEventDriven();
    this.analyzeMemeContent();
    this.analyzeCinematicElements();
    this.analyzeCharacterFocus();
    this.analyzePlatformOptimization();
    this.analyzeMotionAndDynamics();
    
    // Process and rank suggestions
    return this.rankAndDeduplicateSuggestions();
  }

  analyzeBasicContent() {
    const scene = this.getField('scene', '').toLowerCase();
    const setting = this.getField('setting', '').toLowerCase();
    const style = this.getField('style', '').toLowerCase();

    // Environmental analysis
    if (this.hasAny(scene + setting, ['beach', 'ocean', 'coastline', 'surf'])) {
      this.addSuggestion('16:9', 88, 'Widescreen showcases beach landscapes and ocean horizons', ['YouTube', 'Travel', 'Lifestyle'], '🏖️');
    }

    if (this.hasAny(scene + setting, ['forest', 'trees', 'woodland', 'nature'])) {
      this.addSuggestion('3:2', 82, 'Classic photography ratio perfect for nature and forest scenes', ['Photography', 'Nature Docs', 'Prints'], '🌲');
    }

    if (this.hasAny(scene + setting, ['rooftop', 'skyline', 'cityscape', 'urban'])) {
      this.addSuggestion('21:9', 90, 'Ultra-wide format captures expansive urban skylines', ['Cinema', 'Premium', 'Architectural'], '🏙️');
    }
  }

  analyzeEventDriven() {
    const eventType = this.getField('eventType', '');
    const actionSequence = this.getField('actionSequence', '');
    const scene = this.getField('scene', '').toLowerCase();

    // Action event analysis
    if (eventType === 'action' || this.hasAny(actionSequence, ['chase', 'pursuit', 'running', 'escape'])) {
      this.addSuggestion('21:9', 95, 'Ultra-wide maximizes action sequence impact and cinematography', ['Cinema', 'Action Films', 'Premium'], '🏃‍♂️');
      this.addSuggestion('16:9', 90, 'Standard cinematic format for action content', ['YouTube', 'Streaming', 'TV'], '🎬');
    }

    // Drama event analysis  
    if (eventType === 'drama' || this.hasAny(actionSequence, ['confrontation', 'confession', 'revelation'])) {
      this.addSuggestion('9:16', 88, 'Vertical format creates intimacy for dramatic character moments', ['TikTok', 'Instagram Stories', 'Drama'], '🎭');
      this.addSuggestion('1:1', 85, 'Square format focuses on character emotions and reactions', ['Instagram', 'Character Studies', 'Social'], '👥');
    }

    // Rescue/heroic events
    if (this.hasAny(scene + actionSequence, ['rescue', 'saving', 'heroic', 'lifeguard'])) {
      this.addSuggestion('16:9', 92, 'Widescreen captures both hero and environment in rescue scenes', ['YouTube', 'Documentary', 'Heroic Content'], '🦸‍♀️');
      this.addSuggestion('9:16', 87, 'Vertical format perfect for mobile heroic content sharing', ['TikTok', 'Instagram Reels', 'Mobile'], '📱');
    }
  }

  analyzeMemeContent() {
    const memeFormat = this.getField('memeFormat', '');
    const viralElements = this.getField('viralElements', []);
    const scene = this.getField('scene', '').toLowerCase();

    if (memeFormat || viralElements.length > 0 || scene.includes('meme')) {
      
      // Specific meme format analysis
      switch (memeFormat) {
        case 'split-screen-confrontation':
          this.addSuggestion('16:9', 96, 'Widescreen essential for split-screen meme formats', ['Twitter', 'Reddit', 'Meme Platforms'], '😤');
          break;
          
        case 'four-panel-progression':
          this.addSuggestion('1:1', 98, 'Square format optimal for multi-panel progression memes', ['Instagram', 'Twitter', 'Reddit'], '🧠');
          break;
          
        case 'reality-breaking-absurd':
          this.addSuggestion('9:16', 94, 'Vertical maximizes chaos for Gen-Z brainrot content', ['TikTok', 'Instagram Reels', 'Chaotic'], '🤯');
          break;
          
        case 'classic-three-person':
          this.addSuggestion('16:9', 92, 'Widescreen captures all three subjects in choice-based memes', ['Social Media', 'Choice Memes', 'Viral'], '👫');
          break;
          
        case 'choice-pressure':
          this.addSuggestion('1:1', 89, 'Square format intensifies decision pressure visualization', ['Instagram', 'Decision Memes', 'Pressure'], '😰');
          break;
          
        case 'calm-in-chaos':
          this.addSuggestion('16:9', 91, 'Widescreen shows both calm subject and chaotic background', ['Twitter', 'Situational Memes', 'Contrast'], '🔥');
          break;
          
        case 'shocked-reaction':
          this.addSuggestion('1:1', 87, 'Square format perfect for reaction face focus', ['Instagram', 'Reaction Memes', 'Expressions'], '😲');
          break;
          
        default:
          // General meme suggestions
          this.addSuggestion('1:1', 90, 'Square format standard for most meme content', ['Instagram', 'Twitter', 'Universal'], '😂');
          this.addSuggestion('9:16', 85, 'Vertical format for mobile-first meme consumption', ['TikTok', 'Stories', 'Mobile'], '📱');
      }
    }
  }

  analyzeCinematicElements() {
    const cameraAngle = this.getField('camera_angle', '').toLowerCase();
    const cameraDistance = this.getField('camera_distance', '').toLowerCase();
    const lensType = this.getField('lens_type', '').toLowerCase();
    const style = this.getField('style', '').toLowerCase();

    // Cinematic style detection
    const cinematicWords = ['cinematic', 'dramatic', 'epic', 'film'];
    if (this.hasAny(style, cinematicWords) || lensType.includes('anamorphic')) {
      this.addSuggestion('21:9', 95, 'Ultra-wide anamorphic format for true cinematic experience', ['Cinema', 'Film', 'Premium'], '🎬');
      this.addSuggestion('16:9', 85, 'Standard cinematic format for wide compatibility', ['Streaming', 'TV', 'Video'], '🖥️');
    }

    // Camera work analysis
    if (this.hasAny(cameraDistance, ['wide', 'establishing', 'panoramic'])) {
      this.addSuggestion('21:9', 88, 'Ultra-wide enhances establishing shots and panoramic views', ['Landscape', 'Establishing', 'Wide'], '📐');
    }

    if (this.hasAny(cameraDistance, ['close', 'intimate', 'portrait'])) {
      this.addSuggestion('9:16', 86, 'Vertical format natural for portrait and close-up shots', ['Portrait', 'Intimate', 'Mobile'], '👤');
      this.addSuggestion('3:2', 82, 'Classic portrait ratio for professional character work', ['Photography', 'Professional', 'Portrait'], '📸');
    }
  }

  analyzeCharacterFocus() {
    const hasCharacter = this.getField('character_type') || this.getField('character_description');
    const characterAction = this.getField('character_action', '').toLowerCase();
    const cameraDistance = this.getField('camera_distance', '').toLowerCase();

    if (hasCharacter) {
      // Character action analysis
      if (this.hasAny(characterAction, ['dancing', 'performing', 'presenting'])) {
        this.addSuggestion('9:16', 90, 'Vertical format perfect for performance and dance content', ['TikTok', 'Performance', 'Dance'], '💃');
      }

      if (this.hasAny(characterAction, ['fighting', 'action', 'athletic'])) {
        this.addSuggestion('16:9', 88, 'Widescreen captures full body action and movement', ['Action', 'Sports', 'Dynamic'], '🥊');
      }

      // Portrait vs full body
      if (cameraDistance.includes('close') || cameraDistance.includes('portrait')) {
        this.addSuggestion('9:16', 85, 'Vertical format natural for character portraits', ['Portrait', 'Social', 'Personal'], '🤳');
      }
    }
  }

  analyzePlatformOptimization() {
    const scene = this.getField('scene', '').toLowerCase();
    const style = this.getField('style', '').toLowerCase();

    // Platform-specific content hints
    if (this.hasAny(scene + style, ['tiktok', 'reel', 'story', 'snap'])) {
      this.addSuggestion('9:16', 95, 'Vertical format optimized for TikTok and Stories', ['TikTok', 'Instagram Stories', 'Snapchat'], '📱');
    }

    if (this.hasAny(scene + style, ['youtube', 'stream', 'broadcast'])) {
      this.addSuggestion('16:9', 93, 'Widescreen standard for YouTube and streaming platforms', ['YouTube', 'Twitch', 'Streaming'], '📺');
    }

    if (this.hasAny(scene + style, ['instagram', 'post', 'feed'])) {
      this.addSuggestion('1:1', 91, 'Square format optimized for Instagram feed posts', ['Instagram', 'Social Feed', 'Discovery'], '📸');
    }
  }

  analyzeMotionAndDynamics() {
    const motionType = this.getField('motion_type', '').toLowerCase();
    const cameraMovement = this.getField('camera_movement', '').toLowerCase();

    // Motion-based suggestions
    if (this.hasAny(motionType + cameraMovement, ['tracking', 'following', 'chase', 'fast'])) {
      this.addSuggestion('21:9', 87, 'Ultra-wide captures dynamic motion with cinematic flair', ['Action', 'Dynamic', 'Cinematic'], '🎥');
    }

    if (this.hasAny(motionType + cameraMovement, ['handheld', 'shaky', 'documentary'])) {
      this.addSuggestion('16:9', 84, 'Standard format for documentary-style handheld footage', ['Documentary', 'Realistic', 'Handheld'], '📹');
    }

    if (this.hasAny(motionType + cameraMovement, ['smooth', 'slow', 'gentle'])) {
      this.addSuggestion('3:2', 80, 'Classic ratio for smooth, contemplative movement', ['Artistic', 'Slow', 'Contemplative'], '🎭');
    }
  }

  // Helper methods
  getField(key, defaultValue = '') {
    return this.content[key] || defaultValue;
  }

  hasAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  addSuggestion(ratio, confidence, reason, platforms, icon) {
    this.suggestions.push({
      ratio,
      confidence,
      reason,
      platforms,
      icon
    });
  }

  rankAndDeduplicateSuggestions() {
    // Remove duplicates and merge similar suggestions
    const uniqueRatios = {};
    
    this.suggestions.forEach(suggestion => {
      const existing = uniqueRatios[suggestion.ratio];
      if (!existing || suggestion.confidence > existing.confidence) {
        uniqueRatios[suggestion.ratio] = suggestion;
      }
    });

    // Convert back to array and sort by confidence
    return Object.values(uniqueRatios)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3); // Return top 3 suggestions
  }
}

export default AspectRatioAI;