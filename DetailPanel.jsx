import React from 'react';
import usePromptStore from './store';

const DetailPanel = ({ field, selectedValue }) => {
  const { detailValues, updateDetailValue } = usePromptStore();
  
  // Get detail configuration for the selected value
  const detailConfig = field.detailConfig?.[selectedValue];
  
  if (!detailConfig) return null;

  // Quick tags for common combinations
  const getQuickTags = () => {
    const tagSets = {
      tattoos: [
        { label: '🐉 Dragon', values: { tattoo_style: 'traditional', tattoo_description: 'Dragon design with flames' } },
        { label: '🌹 Rose', values: { tattoo_style: 'realistic', tattoo_description: 'Red rose with thorns' } },
        { label: '⚓ Anchor', values: { tattoo_style: 'american traditional', tattoo_description: 'Classic anchor design' } },
        { label: '🔥 Tribal', values: { tattoo_style: 'tribal', tattoo_description: 'Bold tribal patterns' } }
      ],
      'fantasy armor': [
        { label: '🛡️ Knight', values: { armor_type: 'plate armor', armor_material: 'steel', armor_description: 'Shining knight\'s plate armor' } },
        { label: '🐲 Dragon', values: { armor_type: 'scale armor', armor_material: 'dragon scale', armor_description: 'Dark dragon scale armor' } },
        { label: '✨ Magical', values: { armor_type: 'magical armor', armor_material: 'enchanted metal', armor_description: 'Glowing magical armor with runes' } }
      ],
      'sci-fi suit': [
        { label: '🚀 Space', values: { suit_type: 'space suit', suit_features: 'oxygen system, radiation shielding', suit_description: 'White space suit with blue highlights' } },
        { label: '⚡ Power', values: { suit_type: 'power armor', suit_features: 'enhanced strength, energy shields', suit_description: 'Metallic power armor with glowing elements' } },
        { label: '🌆 Cyber', values: { suit_type: 'cyberpunk outfit', suit_features: 'neural interface, holo display', suit_description: 'Black leather with neon accents' } }
      ],
      beach: [
        { label: '🏝️ Tropical', values: { beach_type: 'tropical', beach_features: 'palm trees, white sand, crystal water', beach_description: 'Perfect tropical paradise with gentle waves' } },
        { label: '🌊 Dramatic', values: { beach_type: 'rocky coast', beach_features: 'crashing waves, sea spray, rocks', beach_description: 'Powerful waves crashing against dramatic cliffs' } },
        { label: '🏖️ Peaceful', values: { beach_type: 'secluded cove', beach_features: 'calm water, soft sand, privacy', beach_description: 'Hidden peaceful cove with gentle lapping waves' } }
      ],
      forest: [
        { label: '🌲 Mystical', values: { forest_type: 'mystical forest', forest_lighting: 'dappled sunlight', forest_description: 'Enchanted forest with ethereal lighting and ancient trees' } },
        { label: '🍂 Autumn', values: { forest_type: 'autumn forest', forest_lighting: 'golden rays', forest_description: 'Beautiful fall colors with warm golden sunlight' } },
        { label: '🌴 Tropical', values: { forest_type: 'tropical rainforest', forest_lighting: 'deep shadows', forest_description: 'Dense jungle with exotic plants and filtered light' } }
      ],
      'city street': [
        { label: '🌃 Night Life', values: { street_type: 'busy downtown', street_activity: 'late night', street_description: 'Vibrant nightlife with neon lights and bustling crowds' } },
        { label: '🏙️ Rush Hour', values: { street_type: 'busy downtown', street_activity: 'rush hour', street_description: 'Busy commercial district during peak traffic hours' } },
        { label: '🏘️ Quiet', values: { street_type: 'quiet residential', street_activity: 'empty', street_description: 'Peaceful suburban street with tree-lined sidewalks' } }
      ],
      'golden hour': [
        { label: '✨ Peak Golden', values: { golden_timing: 'peak golden light', golden_intensity: 'brilliant golden', golden_description: 'Perfect golden hour lighting with warm, brilliant glow' } },
        { label: '🌅 Soft Glow', values: { golden_timing: 'early golden hour', golden_intensity: 'soft warm glow', golden_description: 'Gentle morning golden light with soft shadows' } },
        { label: '🌇 Deep Amber', values: { golden_timing: 'late golden hour', golden_intensity: 'deep amber', golden_description: 'Rich amber lighting just before sunset' } }
      ],
      stormy: [
        { label: '⛈️ Thunder', values: { storm_intensity: 'severe thunderstorm', storm_elements: 'lightning, heavy rain, thunder', storm_description: 'Dramatic thunderstorm with frequent lightning and heavy downpour' } },
        { label: '🌪️ Approaching', values: { storm_intensity: 'approaching storm', storm_elements: 'dark clouds, wind, distant thunder', storm_description: 'Ominous storm clouds gathering with increasing wind' } },
        { label: '🌧️ Heavy Rain', values: { storm_intensity: 'heavy storm', storm_elements: 'torrential rain, wind, occasional lightning', storm_description: 'Intense rainstorm with powerful winds and heavy precipitation' } }
      ],
      // Character Hair Styles
      braids: [
        { label: '👸 French', values: { braid_type: 'french braid', braid_length: 'shoulder length', braid_description: 'Elegant french braid with neat, structured styling' } },
        { label: '✨ Twin', values: { braid_type: 'twin braids', braid_length: 'mid-back', braid_description: 'Cute twin braids with playful, youthful energy' } },
        { label: '🌊 Fishtail', values: { braid_type: 'fishtail braid', braid_length: 'waist length', braid_description: 'Intricate fishtail braid with detailed weaving pattern' } }
      ],
      'long curly': [
        { label: '🌊 Beach Waves', values: { curl_pattern: 'beach waves', curl_volume: 'voluminous', curl_description: 'Natural-looking beach waves with sun-kissed movement' } },
        { label: '💫 Spiral', values: { curl_pattern: 'spiral curls', curl_volume: 'bouncy', curl_description: 'Defined spiral curls with beautiful bounce and shine' } },
        { label: '✨ Loose Waves', values: { curl_pattern: 'loose waves', curl_volume: 'controlled', curl_description: 'Elegant loose waves with sophisticated styling' } }
      ],
      rainbow: [
        { label: '🌈 Classic', values: { rainbow_pattern: 'traditional rainbow', rainbow_colors: 'red, orange, yellow, green, blue, purple', rainbow_description: 'Classic rainbow hair with vibrant traditional colors' } },
        { label: '🦄 Pastel', values: { rainbow_pattern: 'pastel rainbow', rainbow_colors: 'soft pink, lavender, mint, peach', rainbow_description: 'Dreamy pastel rainbow with soft, ethereal colors' } },
        { label: '⚡ Ombre', values: { rainbow_pattern: 'ombre rainbow', rainbow_colors: 'blue to purple to pink', rainbow_description: 'Stunning ombre rainbow with smooth color transitions' } }
      ],
      // Character Body Types
      athletic: [
        { label: '🏃 Runner', values: { athletic_type: "runner's build", athletic_definition: 'lean muscle', athletic_description: 'Lean, efficient build with excellent endurance and natural grace' } },
        { label: '🏊 Swimmer', values: { athletic_type: "swimmer's build", athletic_definition: 'toned', athletic_description: 'Strong shoulders and core with fluid, powerful movement' } },
        { label: '🥋 Martial Artist', values: { athletic_type: 'martial artist', athletic_definition: 'defined', athletic_description: 'Balanced strength and flexibility with disciplined posture' } }
      ],
      // Character Actions
      dancing: [
        { label: '🩰 Ballet', values: { dance_style: 'ballet', dance_energy: 'graceful', dance_description: 'Elegant ballet movements with perfect form and artistic expression' } },
        { label: '🕺 Hip Hop', values: { dance_style: 'hip hop', dance_energy: 'energetic', dance_description: 'Dynamic hip hop moves with rhythm and street style confidence' } },
        { label: '💃 Salsa', values: { dance_style: 'salsa', dance_energy: 'passionate', dance_description: 'Fiery salsa dancing with Latin flair and romantic energy' } }
      ],
      // Character Emotions
      mysterious: [
        { label: '🔮 Enigmatic', values: { mystery_intensity: 'deeply mysterious', mystery_expression: 'knowing smile', mystery_description: 'Captivating mysterious aura with hidden depths and secrets' } },
        { label: '👁️ Piercing', values: { mystery_intensity: 'intriguingly secretive', mystery_expression: 'piercing stare', mystery_description: 'Intense mysterious presence with penetrating, knowing gaze' } },
        { label: '😏 Playful', values: { mystery_intensity: 'playfully mysterious', mystery_expression: 'half-hidden face', mystery_description: 'Playfully mysterious with hints of mischief and hidden knowledge' } }
      ],
      // Camera Angles
      'low angle': [
        { label: '⚡ Heroic', values: { low_angle_degree: 'moderate low angle', low_angle_effect: 'heroic', low_angle_description: 'Heroic low angle showcasing strength and determination' } },
        { label: '👑 Powerful', values: { low_angle_degree: 'extreme low angle', low_angle_effect: 'powerful/dominant', low_angle_description: 'Dramatic low angle emphasizing power and dominance' } },
        { label: '🏰 Majestic', values: { low_angle_degree: 'dramatic upward', low_angle_effect: 'majestic', low_angle_description: 'Majestic upward angle creating awe and grandeur' } }
      ],
      'high angle': [
        { label: '🕊️ Vulnerable', values: { high_angle_degree: 'moderate high angle', high_angle_effect: 'vulnerable', high_angle_description: 'High angle showing vulnerability and humanity' } },
        { label: '🌅 Contemplative', values: { high_angle_degree: 'slight high angle', high_angle_effect: 'contemplative', high_angle_description: 'Gentle high angle for thoughtful, introspective mood' } },
        { label: '🌊 Overwhelmed', values: { high_angle_degree: 'extreme high angle', high_angle_effect: 'overwhelmed', high_angle_description: 'Dramatic high angle showing overwhelming circumstances' } }
      ],
      // Camera Distances
      'close-up': [
        { label: '💖 Intimate', values: { closeup_framing: 'face and shoulders', closeup_purpose: 'emotional intimacy', closeup_description: 'Intimate close-up capturing emotional connection and warmth' } },
        { label: '🎭 Dramatic', values: { closeup_framing: 'facial features', closeup_purpose: 'dramatic tension', closeup_description: 'Dramatic close-up highlighting intense emotion and tension' } },
        { label: '👁️ Eyes Focus', values: { closeup_framing: 'eyes emphasis', closeup_purpose: 'connection', closeup_description: 'Close-up focused on eyes for deep emotional connection' } }
      ],
      // Depth of Field
      bokeh: [
        { label: '✨ Dreamy', values: { bokeh_quality: 'dreamy', bokeh_background: 'natural lighting', bokeh_description: 'Dreamy bokeh with soft, ethereal background blur' } },
        { label: '🌃 City Lights', values: { bokeh_quality: 'circular highlights', bokeh_background: 'city lights', bokeh_description: 'Beautiful bokeh from city lights creating magical atmosphere' } },
        { label: '🎨 Artistic', values: { bokeh_quality: 'artistic blur', bokeh_background: 'colored elements', bokeh_description: 'Artistic bokeh with creative color blur and highlights' } }
      ],
      // Lenses
      'wide angle': [
        { label: '🌍 Epic', values: { wide_angle_focal: '14mm (ultra-wide)', wide_angle_effect: 'dramatic perspective', wide_angle_description: 'Epic ultra-wide perspective capturing vast, dramatic scope' } },
        { label: '🏢 Architectural', values: { wide_angle_focal: '24mm (moderate wide)', wide_angle_effect: 'environmental context', wide_angle_description: 'Architectural wide angle showing environmental context and scale' } },
        { label: '🎬 Cinematic', values: { wide_angle_focal: '28mm (standard wide)', wide_angle_effect: 'immersive feeling', wide_angle_description: 'Cinematic wide angle creating immersive, engaging perspective' } }
      ],
      telephoto: [
        { label: '📸 Portrait', values: { telephoto_focal: '85mm (short tele)', telephoto_compression: 'subject isolation', telephoto_description: 'Perfect portrait telephoto with beautiful subject isolation' } },
        { label: '🎯 Compressed', values: { telephoto_focal: '200mm (long tele)', telephoto_compression: 'background compression', telephoto_description: 'Dramatic telephoto compression flattening perspective' } },
        { label: '💫 Intimate', values: { telephoto_focal: '135mm (medium tele)', telephoto_compression: 'intimate framing', telephoto_description: 'Intimate telephoto framing with natural compression' } }
      ],
      anamorphic: [
        { label: '🎬 Cinematic', values: { anamorphic_ratio: '2x squeeze', anamorphic_flares: 'horizontal blue flares', anamorphic_description: 'Classic cinematic anamorphic with signature blue flares' } },
        { label: '✨ Vintage', values: { anamorphic_ratio: '1.5x squeeze', anamorphic_flares: 'vintage flares', anamorphic_description: 'Vintage anamorphic look with warm, nostalgic flares' } },
        { label: '🌟 Dramatic', values: { anamorphic_ratio: '1.33x squeeze', anamorphic_flares: 'dramatic flares', anamorphic_description: 'Dramatic anamorphic with bold, expressive lens flares' } }
      ]
    };
    return tagSets[selectedValue] || [];
  };

  const quickTags = getQuickTags();

  const applyQuickTag = (tagValues) => {
    Object.entries(tagValues).forEach(([key, value]) => {
      const detailKey = `${field.key}_${key}`;
      updateDetailValue(detailKey, value);
    });
  };

  const renderDetailField = (detailField) => {
    const detailKey = `${field.key}_${detailField.key}`;
    const value = detailValues[detailKey] || '';
    
    const baseClasses = "w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cinema-teal focus:border-transparent bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text transition-all duration-300 text-sm";

    switch (detailField.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => updateDetailValue(detailKey, e.target.value)}
            placeholder={detailField.placeholder || detailField.label}
            rows={2}
            className={baseClasses}
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => updateDetailValue(detailKey, e.target.value)}
            className={baseClasses}
          >
            <option value="">Select {detailField.label}</option>
            {detailField.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => updateDetailValue(detailKey, e.target.value)}
            placeholder={detailField.placeholder || detailField.label}
            className={baseClasses}
          />
        );
    }
  };

  return (
    <div className="mt-3 p-4 bg-blue-50 dark:bg-cinema-card/30 border border-blue-200 dark:border-cinema-border rounded-lg transition-all duration-300">
      <div className="flex items-center space-x-2 mb-3">
        <svg className="w-4 h-4 text-blue-600 dark:text-cinema-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <h4 className="text-sm font-semibold text-blue-800 dark:text-cinema-teal">
          {detailConfig.label}
        </h4>
      </div>
      
      {/* Quick Tags */}
      {quickTags.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-600 dark:text-cinema-text-muted mb-2">Quick presets:</div>
          <div className="flex flex-wrap gap-2">
            {quickTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => applyQuickTag(tag.values)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-cinema-card dark:hover:bg-cinema-border text-gray-700 dark:text-cinema-text rounded-full transition-colors duration-200 border border-gray-200 dark:border-cinema-border"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {detailConfig.fields.map((detailField) => (
          <div key={detailField.key}>
            <label className="block text-xs font-medium text-gray-700 dark:text-cinema-text-muted mb-1">
              {detailField.label}
            </label>
            {renderDetailField(detailField)}
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-blue-600 dark:text-cinema-text-muted">
        💡 Add specific details to enhance your prompt
      </div>
    </div>
  );
};

export default DetailPanel;