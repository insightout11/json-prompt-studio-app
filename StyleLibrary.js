// StyleLibrary.js - Character style definitions and matching algorithms

export const STYLE_CATEGORIES = {
  CINEMATIC: 'cinematic',
  ANIMATION: 'animation', 
  DOCUMENTARY: 'documentary',
  DIGITAL_ART: 'digital_art',
  VINTAGE: 'vintage'
};

export const CHARACTER_STYLES = {
  'neo-noir-graphic': {
    id: 'neo-noir-graphic',
    label: 'Neo-Noir Graphic',
    category: STYLE_CATEGORIES.CINEMATIC,
    description: 'Rain-slick streets with hard-edged shadows and rim lighting',
    tags: ['High Contrast', 'Streetwear', 'Urban Grit', 'Dramatic Lighting'],
    palette: {
      primary: ['#0e0e10', '#1a1a1d', '#2c2c30'],
      secondary: ['#7a8c9a', '#95a5b3', '#b1c1ce'], 
      accents: ['#e6e6e6', '#ffffff', '#f8f9fa'],
      mood: ['#4a90e2', '#357abd', '#2968a3'] // Cool blues for noir mood
    },
    render_motif: 'hard-edged shadows, rim light, wet asphalt reflections',
    camera_rules: {
      preferred_distances: ['medium-close', 'close-up'],
      preferred_angles: ['low', 'profile', 'three-quarter'],
      lighting_style: 'dramatic chiaroscuro',
      composition: 'rule of thirds with strong diagonals'
    },
    texture_hints: 'leather, concrete, metal, glass with rain streaks',
    era_markers: 'modern urban, 2020s streetwear',
    personality_fit: ['mysterious', 'gritty', 'street-smart', 'urban', 'tough'],
    profession_fit: ['detective', 'courier', 'journalist', 'vigilante', 'street_artist']
  },

  'ghibli-naturalism': {
    id: 'ghibli-naturalism',
    label: 'Ghibli-Adjacent Naturalism', 
    category: STYLE_CATEGORIES.ANIMATION,
    description: 'Soft edges and warm earth tones with natural lighting',
    tags: ['Soft Focus', 'Earth Tones', 'Natural Light', 'Organic Forms'],
    palette: {
      primary: ['#8b7355', '#a68b5b', '#c4a373'],
      secondary: ['#6b8e23', '#8fbc8f', '#a4c29a'],
      accents: ['#f5deb3', '#ffefd5', '#fff8dc'],
      mood: ['#cd853f', '#daa520', '#b8860b'] // Warm golds
    },
    render_motif: 'soft watercolor edges, dappled sunlight, organic textures',
    camera_rules: {
      preferred_distances: ['medium', 'medium-wide'],
      preferred_angles: ['eye-level', 'slightly-high'],
      lighting_style: 'natural golden hour',
      composition: 'balanced with natural elements'
    },
    texture_hints: 'linen, wood, cotton, natural fibers, flowing fabrics',
    era_markers: 'timeless, pastoral, handcrafted elements',
    personality_fit: ['gentle', 'wise', 'nature-loving', 'introspective', 'kind'],
    profession_fit: ['librarian', 'teacher', 'gardener', 'artist', 'healer']
  },

  'retro-anime-90s': {
    id: 'retro-anime-90s',
    label: 'Retro Anime 90s',
    category: STYLE_CATEGORIES.ANIMATION,
    description: 'Film grain with high-key highlights and cel-shaded style',
    tags: ['Cel Shading', 'Film Grain', 'Neon Accents', 'Sharp Lines'],
    palette: {
      primary: ['#2c1810', '#4a2c17', '#8b4513'],
      secondary: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
      accents: ['#ffd93d', '#6bcf7f', '#ff8a80'],
      mood: ['#e91e63', '#9c27b0', '#673ab7'] // Vibrant magentas and purples
    },
    render_motif: 'cel-shaded highlights, speed lines, dramatic poses',
    camera_rules: {
      preferred_distances: ['medium', 'close-up'],
      preferred_angles: ['dramatic-low', 'high', 'dynamic'],
      lighting_style: 'high contrast cel-shading',
      composition: 'dynamic action poses, diagonal emphasis'
    },
    texture_hints: 'synthetic fabrics, leather, metal with highlights',
    era_markers: '90s fashion, technology references, urban environments',
    personality_fit: ['energetic', 'rebellious', 'confident', 'dramatic', 'passionate'],
    profession_fit: ['student', 'fighter', 'hacker', 'musician', 'rebel']
  },

  'cyberpunk-grit': {
    id: 'cyberpunk-grit',
    label: 'Cyber-Punk Grit',
    category: STYLE_CATEGORIES.DIGITAL_ART,
    description: 'Chromatic aberration with neon accents and digital glitches',
    tags: ['Neon Glow', 'Chromatic Aberration', 'Digital Glitch', 'Synthetic'],
    palette: {
      primary: ['#0a0a0a', '#1a0033', '#2d1b69'],
      secondary: ['#00ffff', '#ff00ff', '#00ff41'],
      accents: ['#ffffff', '#f0f0f0', '#e0e0e0'],
      mood: ['#ff073a', '#39ff14', '#bf00ff'] // Electric neons
    },
    render_motif: 'neon light trails, holographic effects, digital static',
    camera_rules: {
      preferred_distances: ['close-up', 'medium-close'],
      preferred_angles: ['low', 'dutch-tilt', 'extreme-close'],
      lighting_style: 'neon backlighting, rim lighting',
      composition: 'asymmetrical with digital elements'
    },
    texture_hints: 'synthetic materials, chrome, holographic surfaces, LED strips',
    era_markers: 'near-future tech, cybernetic implants, urban decay',
    personality_fit: ['tech-savvy', 'edgy', 'underground', 'augmented', 'cynical'],
    profession_fit: ['hacker', 'cybernetic_engineer', 'street_samurai', 'data_broker', 'tech_noir_detective']
  },

  'documentary-street': {
    id: 'documentary-street',
    label: 'Documentary Street',
    category: STYLE_CATEGORIES.DOCUMENTARY,
    description: 'Desaturated realism with handheld camera aesthetics',
    tags: ['Desaturated', 'Handheld', 'Natural', 'Candid'],
    palette: {
      primary: ['#3c3c3c', '#5a5a5a', '#787878'],
      secondary: ['#8b7d6b', '#a0956b', '#b5aa6b'],
      accents: ['#d3d3d3', '#e8e8e8', '#f5f5f5'],
      mood: ['#6b8e23', '#808000', '#9acd32'] // Muted earth greens
    },
    render_motif: 'natural lighting, candid expressions, environmental context',
    camera_rules: {
      preferred_distances: ['medium', 'medium-wide'],
      preferred_angles: ['eye-level', 'slightly-low'],
      lighting_style: 'available light, soft shadows',
      composition: 'rule of thirds, environmental storytelling'
    },
    texture_hints: 'worn fabrics, weathered surfaces, natural materials',
    era_markers: 'contemporary, authentic details, lived-in environments',
    personality_fit: ['authentic', 'grounded', 'relatable', 'working-class', 'genuine'],
    profession_fit: ['worker', 'parent', 'community_leader', 'activist', 'everyday_hero']
  },

  'vintage-portrait': {
    id: 'vintage-portrait',
    label: 'Vintage Portrait',
    category: STYLE_CATEGORIES.VINTAGE,
    description: 'Classic studio lighting with period-appropriate styling',
    tags: ['Classic Lighting', 'Period Details', 'Formal Pose', 'Timeless'],
    palette: {
      primary: ['#2f1b14', '#4a2c20', '#8b4513'],
      secondary: ['#cd853f', '#deb887', '#f5deb3'],
      accents: ['#faf0e6', '#fff8dc', '#fffacd'],
      mood: ['#b8860b', '#daa520', '#ffd700'] // Rich golds
    },
    render_motif: 'studio portrait lighting, formal posing, period details',
    camera_rules: {
      preferred_distances: ['medium', 'medium-close'],
      preferred_angles: ['eye-level', 'slightly-high'],
      lighting_style: 'classic three-point lighting',
      composition: 'formal portrait composition'
    },
    texture_hints: 'fine fabrics, polished surfaces, period-appropriate materials',
    era_markers: '1940s-1960s styling, formal attire, classic accessories',
    personality_fit: ['distinguished', 'formal', 'traditional', 'dignified', 'classic'],
    profession_fit: ['executive', 'professor', 'diplomat', 'artist', 'intellectual']
  }
};

// Style matching and recommendation algorithms
export class StyleMatcher {
  
  /**
   * Parse character seed description to extract key attributes
   */
  static parseCharacterSeed(description) {
    const lower = description.toLowerCase();
    
    // Extract era/setting indicators
    const eraMarkers = {
      modern: ['modern', 'contemporary', '2020s', 'current', 'today'],
      futuristic: ['cyber', 'tech', 'digital', 'future', 'neon', 'holographic'],
      vintage: ['vintage', 'classic', '1940s', '1950s', '1960s', 'retro', 'old'],
      timeless: ['timeless', 'pastoral', 'natural', 'organic', 'traditional']
    };
    
    // Extract profession/role indicators
    const professionMarkers = {
      tech: ['hacker', 'engineer', 'programmer', 'tech', 'cyber'],
      creative: ['artist', 'musician', 'writer', 'designer', 'creative'],
      street: ['courier', 'street', 'urban', 'punk', 'rebel'],
      academic: ['professor', 'teacher', 'librarian', 'scholar', 'student'],
      authority: ['detective', 'cop', 'investigator', 'agent', 'security']
    };
    
    // Extract personality/vibe indicators  
    const personalityMarkers = {
      mysterious: ['mysterious', 'secretive', 'enigmatic', 'shadowy', 'hidden'],
      gentle: ['gentle', 'kind', 'soft', 'caring', 'nurturing'],
      tough: ['tough', 'gritty', 'hard', 'street-smart', 'resilient'],
      energetic: ['energetic', 'dynamic', 'vibrant', 'passionate', 'intense'],
      authentic: ['authentic', 'real', 'genuine', 'honest', 'down-to-earth']
    };
    
    const extracted = {
      era: null,
      profession: null,
      personality: [],
      explicitStyleRefs: [],
      ageHint: null,
      settingHint: null
    };
    
    // Match era
    for (const [era, markers] of Object.entries(eraMarkers)) {
      if (markers.some(marker => lower.includes(marker))) {
        extracted.era = era;
        break;
      }
    }
    
    // Match profession
    for (const [prof, markers] of Object.entries(professionMarkers)) {
      if (markers.some(marker => lower.includes(marker))) {
        extracted.profession = prof;
        break;
      }
    }
    
    // Match personality traits (can have multiple)
    for (const [trait, markers] of Object.entries(personalityMarkers)) {
      if (markers.some(marker => lower.includes(marker))) {
        extracted.personality.push(trait);
      }
    }
    
    // Extract age hints
    if (lower.includes('teen') || lower.includes('young')) extracted.ageHint = 'young';
    else if (lower.includes('old') || lower.includes('elderly')) extracted.ageHint = 'old';
    else if (lower.includes('middle-aged')) extracted.ageHint = 'middle';
    
    // Extract setting hints
    if (lower.includes('city') || lower.includes('urban')) extracted.settingHint = 'urban';
    else if (lower.includes('nature') || lower.includes('forest')) extracted.settingHint = 'natural';
    else if (lower.includes('office') || lower.includes('studio')) extracted.settingHint = 'indoor';
    
    return extracted;
  }
  
  /**
   * Score style compatibility with character seed
   */
  static scoreStyleFit(style, parsedSeed) {
    let score = 0;
    const maxScore = 100;
    
    // Era compatibility (25 points)
    if (parsedSeed.era) {
      const eraFit = {
        'modern': ['neo-noir-graphic', 'documentary-street'],
        'futuristic': ['cyberpunk-grit', 'retro-anime-90s'],
        'vintage': ['vintage-portrait'],
        'timeless': ['ghibli-naturalism', 'vintage-portrait']
      };
      
      if (eraFit[parsedSeed.era]?.includes(style.id)) {
        score += 25;
      }
    }
    
    // Profession compatibility (25 points)
    if (parsedSeed.profession && style.profession_fit.includes(parsedSeed.profession)) {
      score += 25;
    }
    
    // Personality compatibility (30 points)
    if (parsedSeed.personality.length > 0) {
      const personalityMatches = parsedSeed.personality.filter(trait => 
        style.personality_fit.includes(trait)
      );
      score += (personalityMatches.length / parsedSeed.personality.length) * 30;
    }
    
    // Base appeal (20 points) - some styles are more universally appealing
    const baseAppeal = {
      'neo-noir-graphic': 18,
      'ghibli-naturalism': 20,
      'retro-anime-90s': 16,
      'cyberpunk-grit': 15,
      'documentary-street': 17,
      'vintage-portrait': 14
    };
    
    score += baseAppeal[style.id] || 10;
    
    return Math.min(score, maxScore);
  }
  
  /**
   * Calculate diversity score between styles (higher = more different)
   */
  static calculateDiversity(style1, style2) {
    let diversity = 0;
    
    // Category difference (40 points)
    if (style1.category !== style2.category) {
      diversity += 40;
    }
    
    // Palette difference (30 points)
    const palette1 = [...style1.palette.primary, ...style1.palette.secondary];
    const palette2 = [...style2.palette.primary, ...style2.palette.secondary];
    
    // Simple color distance (could be enhanced with proper color space math)
    let colorDiff = 0;
    for (let i = 0; i < Math.min(palette1.length, palette2.length); i++) {
      if (palette1[i] !== palette2[i]) colorDiff++;
    }
    diversity += (colorDiff / Math.max(palette1.length, palette2.length)) * 30;
    
    // Era/personality difference (30 points)
    const personality1 = style1.personality_fit;
    const personality2 = style2.personality_fit;
    const commonTraits = personality1.filter(trait => personality2.includes(trait));
    const totalTraits = [...new Set([...personality1, ...personality2])];
    
    if (totalTraits.length > 0) {
      diversity += (1 - commonTraits.length / totalTraits.length) * 30;
    }
    
    return Math.min(diversity, 100);
  }
  
  /**
   * Generate 5 diverse style recommendations for a character seed
   */
  static generateStyleRecommendations(description, excludeStyles = []) {
    const parsedSeed = this.parseCharacterSeed(description);
    const availableStyles = Object.values(CHARACTER_STYLES)
      .filter(style => !excludeStyles.includes(style.id));
    
    // Score all styles for fit
    const scoredStyles = availableStyles.map(style => ({
      ...style,
      fitScore: this.scoreStyleFit(style, parsedSeed)
    }));
    
    // Sort by fit score
    scoredStyles.sort((a, b) => b.fitScore - a.fitScore);
    
    // Select 5 styles optimizing for both fit and diversity
    const selected = [];
    const candidates = [...scoredStyles];
    
    // Always include the best fit
    if (candidates.length > 0) {
      selected.push(candidates.shift());
    }
    
    // Select remaining 4 to maximize diversity while maintaining decent fit
    while (selected.length < 5 && candidates.length > 0) {
      let bestCandidate = null;
      let bestScore = -1;
      let bestIndex = -1;
      
      for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        
        // Calculate minimum diversity to already selected styles
        let minDiversity = 100;
        for (const selectedStyle of selected) {
          const diversity = this.calculateDiversity(candidate, selectedStyle);
          minDiversity = Math.min(minDiversity, diversity);
        }
        
        // Combined score: fit score + diversity bonus
        const combinedScore = candidate.fitScore + (minDiversity * 0.5);
        
        if (combinedScore > bestScore) {
          bestScore = combinedScore;
          bestCandidate = candidate;
          bestIndex = i;
        }
      }
      
      if (bestCandidate) {
        selected.push(bestCandidate);
        candidates.splice(bestIndex, 1);
      } else {
        break;
      }
    }
    
    // Fill remaining slots if needed
    while (selected.length < 5 && candidates.length > 0) {
      selected.push(candidates.shift());
    }
    
    return selected.slice(0, 5);
  }
  
  /**
   * Generate shuffled alternatives (different from previous recommendations)
   */
  static shuffleStyleRecommendations(description, previouslyShown = []) {
    return this.generateStyleRecommendations(description, previouslyShown);
  }
}

export default StyleMatcher;