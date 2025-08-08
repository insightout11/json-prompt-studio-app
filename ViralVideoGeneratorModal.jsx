import React, { useState, useRef, useEffect } from 'react';
import usePromptStore from './store';

const ViralVideoGeneratorModal = ({ onClose }) => {
  const { clearAll, setFieldValue } = usePromptStore();
  const modalRef = useRef(null);
  
  // State management
  const [selectedFormat, setSelectedFormat] = useState('');
  const [userInputs, setUserInputs] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateSuccess, setShowGenerateSuccess] = useState(false);
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [enhancingField, setEnhancingField] = useState(null);
  const [useAIEnhancement, setUseAIEnhancement] = useState(false);

  // Viral format definitions with dropdown options
  const viralFormats = {
    podcastInterview: {
      name: 'Podcast Interview',
      icon: '🎤',
      description: 'Two people talking — viral when there\'s tension, truth bombs, or bizarre behavior',
      fields: [
        {
          key: 'hostType',
          label: 'Host Type',
          type: 'dropdown',
          options: ['Calm expert', 'Outraged host', 'Comedian', 'Conspiracy theorist', 'Self-help guru']
        },
        {
          key: 'guestType',
          label: 'Guest Type',
          type: 'dropdown',
          options: ['Insider', 'Troublemaker', 'Shocking expert', 'Random person', 'Influencer']
        },
        {
          key: 'topic',
          label: 'Topic',
          type: 'dropdown',
          options: ['AI fears', 'Celebrity secrets', 'Life advice', 'Government coverups', 'Dating horror stories']
        },
        {
          key: 'toneDynamic',
          label: 'Tone/Dynamic',
          type: 'dropdown',
          options: ['Tense', 'Surprising', 'Emotional', 'Combative', 'Funny']
        }
      ]
    },
    streetInterview: {
      name: 'Street Interview',
      icon: '📢',
      description: 'Host asks strangers questions with shocking, silly, or heartfelt answers',
      fields: [
        {
          key: 'setting',
          label: 'Setting',
          type: 'dropdown',
          options: ['Busy market', 'Rainy street', 'High school', 'Nightclub line', 'Rooftop party']
        },
        {
          key: 'hostStyle',
          label: 'Host Style',
          type: 'dropdown',
          options: ['Chill interviewer', 'Aggressive troll', 'Curious child', 'Witty comedian']
        },
        {
          key: 'questionType',
          label: 'Question Type',
          type: 'dropdown',
          options: ['Relationship', 'Deep/fake-philosophical', 'Political', 'Prank', 'Would You Rather']
        },
        {
          key: 'responseStyle',
          label: 'Response Style',
          type: 'dropdown',
          options: ['Serious', 'Hilarious', 'Unhinged', 'Tearful', 'Unexpected']
        }
      ]
    },
    asmrLoop: {
      name: 'ASMR / Satisfying Loop',
      icon: '🎧',
      description: 'Hypnotic visuals/sounds, used for relaxation or to trigger sensory satisfaction',
      fields: [
        {
          key: 'satisfyingElement',
          label: 'Satisfying Element',
          type: 'dropdown',
          options: ['Pressure washing', 'Paint mixing', 'Soap carving', 'Crunchy food eating', 'Looping animation']
        },
        {
          key: 'cameraType',
          label: 'Camera Type',
          type: 'dropdown',
          options: ['Macro lens', 'Overhead', 'Ultra slow-mo', 'One-shot']
        },
        {
          key: 'soundStyle',
          label: 'Sound Style',
          type: 'dropdown',
          options: ['Natural', 'Amplified', 'Loop only', 'Whispered voiceover']
        },
        {
          key: 'colorAesthetic',
          label: 'Color Aesthetic',
          type: 'dropdown',
          options: ['Monochrome', 'Pastel dream', 'Neon pop', 'Earthy tones']
        }
      ]
    },
    creatureReacts: {
      name: 'Creature Reacts to Human World',
      icon: '👾',
      description: 'A non-human character is bewildered or amazed by humans',
      fields: [
        {
          key: 'creatureType',
          label: 'Creature Type',
          type: 'dropdown',
          options: ['Alien', 'Talking cat', 'Caveman', 'Ghost', 'Robot', 'Custom']
        },
        {
          key: 'humanThing',
          label: 'Human Thing They\'re Reacting To',
          type: 'dropdown',
          options: ['Escalators', 'Coffee shops', 'Dating apps', 'Grocery stores', 'TikTok dances']
        },
        {
          key: 'tone',
          label: 'Tone',
          type: 'dropdown',
          options: ['Curious', 'Horrified', 'Deeply moved', 'Angry rant']
        },
        {
          key: 'narrationStyle',
          label: 'Narration Style',
          type: 'dropdown',
          options: ['Internal monologue', 'Found footage', 'Mockumentary']
        }
      ]
    },
    danceLoop: {
      name: 'Dance Loop Challenge',
      icon: '💃',
      description: 'Designed for TikTok/Reels — short, punchy dance or motion synced to audio',
      fields: [
        {
          key: 'vibe',
          label: 'Vibe',
          type: 'dropdown',
          options: ['Hype', 'Chill', 'Goofy', 'Cringe', 'Epic']
        },
        {
          key: 'environment',
          label: 'Environment',
          type: 'dropdown',
          options: ['School hallway', 'Parking garage', 'Neon club', 'Rainy street']
        },
        {
          key: 'character',
          label: 'Character',
          type: 'dropdown',
          options: ['Teen', 'Grandma', 'Dinosaur suit', 'Robot', 'Fashionista']
        },
        {
          key: 'twist',
          label: 'Twist/Surprise Element',
          type: 'dropdown',
          options: ['Crowd joins in', 'Fireworks go off', 'Phone gets stolen', 'Dramatic fail']
        }
      ]
    },
    oneSentenceDrama: {
      name: 'One-Sentence Drama',
      icon: '🎭',
      description: 'Hyper-condensed story in one epic moment. Can be serious or over-the-top',
      fields: [
        {
          key: 'setting',
          label: 'Setting',
          type: 'dropdown',
          options: ['Wedding', 'Hospital', 'Family dinner', 'Graduation', 'Jail cell']
        },
        {
          key: 'mainCharacter',
          label: 'Main Character',
          type: 'dropdown',
          options: ['Bride', 'Estranged dad', 'Sibling', 'Student', 'Detective']
        },
        {
          key: 'shockingSentence',
          label: 'Shocking Sentence',
          type: 'dropdown',
          options: ['He\'s not your real father.', 'I switched the test scores.', 'This is all a simulation.']
        },
        {
          key: 'reaction',
          label: 'Reaction',
          type: 'dropdown',
          options: ['Slap', 'Crying', 'Walks out', 'Laughter', 'Arrest']
        }
      ]
    },
    conspiracyBreakdown: {
      name: 'Conspiracy Breakdown',
      icon: '🧠',
      description: 'One person explaining "the truth" — works well with animation, visuals, tension',
      fields: [
        {
          key: 'narratorStyle',
          label: 'Narrator Style',
          type: 'dropdown',
          options: ['Whispering theorist', 'Professor with diagrams', 'Over-edited TikToker']
        },
        {
          key: 'conspiracyType',
          label: 'Conspiracy Type',
          type: 'dropdown',
          options: ['Time travel cover-up', 'AI already controls us', 'Ancient aliens built smartphones']
        },
        {
          key: 'visualStyle',
          label: 'Visual Style',
          type: 'dropdown',
          options: ['Red-string board', 'Retro VHS', 'Educational parody']
        },
        {
          key: 'tone',
          label: 'Tone',
          type: 'dropdown',
          options: ['Serious', 'Satirical', 'Building tension', 'Deadpan']
        }
      ]
    },
    viralAd: {
      name: 'Viral Ad Template',
      icon: '📺',
      description: 'Fake or exaggerated ad for a weird product or idea',
      fields: [
        {
          key: 'productType',
          label: 'Product Type',
          type: 'dropdown',
          options: ['Emotional support rock', 'Memory wipe spray', 'Dating app for introverts', 'Write your own']
        },
        {
          key: 'adTone',
          label: 'Ad Tone',
          type: 'dropdown',
          options: ['90s cheesy', 'Modern sleek', 'Parody PSA', 'Creepy minimalism']
        },
        {
          key: 'narratorType',
          label: 'Narrator Type',
          type: 'dropdown',
          options: ['Robotic voice', 'Screaming TikTok voiceover', 'Calm whisper', 'Annoying teen']
        },
        {
          key: 'visualGimmick',
          label: 'Visual Gimmick',
          type: 'dropdown',
          options: ['Infomercial popups', 'Glitchy VHS', 'Surreal transitions', 'Stock footage mashup']
        }
      ]
    }
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleFormatSelect = (formatId) => {
    setSelectedFormat(formatId);
    const format = viralFormats[formatId];
    if (format) {
      const initialInputs = {};
      format.fields.forEach(field => {
        initialInputs[field.key] = '';
      });
      setUserInputs(initialInputs);
    }
  };

  const handleInputChange = (key, value) => {
    setUserInputs(prev => ({
      ...prev,
      [key]: value
    }));
    
    if (liveUpdates) {
      // Update JSON live
      setTimeout(() => generateComprehensiveJson(), 100);
    }
  };

  const handleEnhance = async (fieldKey) => {
    if (!userInputs[fieldKey]) return;
    
    setEnhancingField(fieldKey);
    
    try {
      const currentValue = userInputs[fieldKey];
      const enhancedValue = await enhanceValue(currentValue, fieldKey);
      
      setUserInputs(prev => ({
        ...prev,
        [fieldKey]: enhancedValue
      }));
      
      if (liveUpdates) {
        setTimeout(() => generateComprehensiveJson(), 100);
      }
    } catch (error) {
      console.error('Enhancement failed:', error);
      // Fallback to original value on error
    } finally {
      setEnhancingField(null);
    }
  };

  const enhanceValue = async (value, fieldKey) => {
    // Use AI service to enhance the value with viral improvements
    try {
      const aiService = (await import('./aiApiService')).default;
      
      const enhancementPrompt = `🔧 Prompt for Claude Code:
You are modifying a viral video scene element to make it more engaging, surprising, or emotionally resonant — without removing user intent. When a user clicks the "Enhance" button, enrich and modify the element by making clever, viral-style enhancements.

✅ Rules:
- Never just add the word "enhanced"  
- Use natural, vivid language suitable for viral videos
- Retain the core intent of the original value
- Make it more specific, visual, or outrageous
- Add viral twist, conflict, emotion, or humor where appropriate

Field type: ${fieldKey}
Current value: "${value}"

Return only the enhanced value, nothing else.`;

      const response = await aiService.makeRequest([
        { role: 'user', content: enhancementPrompt }
      ], {
        temperature: 0.8,
        max_tokens: 150
      });

      const enhancedValue = response.choices[0]?.message?.content?.trim();
      return enhancedValue || getViralEnhancement(value, fieldKey);
      
    } catch (error) {
      console.log('AI enhancement failed, using fallback:', error);
      return getViralEnhancement(value, fieldKey);
    }
  };

  const getViralEnhancement = (value, fieldKey) => {
    // Fallback viral enhancements when AI is unavailable
    const viralEnhancements = {
      // Podcast Interview enhancements
      hostType: {
        'Calm expert': 'Eerily calm expert with hidden agenda and piercing stare',
        'Outraged host': 'Explosively outraged host who interrupts constantly and throws papers',
        'Comedian': 'Unhinged comedian who makes everything awkwardly personal',
        'Conspiracy theorist': 'Wild-eyed conspiracy theorist with string charts behind them',
        'Self-help guru': 'Overly intense self-help guru who gets too close to the camera'
      },
      guestType: {
        'Insider': 'Paranoid insider who speaks in cryptic riddles and checks over shoulder',
        'Troublemaker': 'Chaotic troublemaker who drops shocking truth bombs every 30 seconds',
        'Shocking expert': 'Controversial expert who makes everyone uncomfortable with brutal honesty',
        'Random person': 'Surprisingly wise random person who delivers profound one-liners',
        'Influencer': 'Desperate influencer who plugs their content every other sentence'
      },
      topic: {
        'AI fears': 'Why AI is already controlling your daily coffee choices',
        'Celebrity secrets': 'Which A-list celebrity secretly runs a conspiracy theory blog',
        'Life advice': 'Why everything you learned about success is completely backwards',
        'Government coverups': 'The real reason your GPS always takes you past Starbucks',
        'Dating horror stories': 'When your Tinder date turned out to be your therapist\'s ex'
      },
      toneDynamic: {
        'Tense': 'So tense you can cut it with a knife while someone\'s eating loudly',
        'Surprising': 'Plot twists that make M. Night Shyamalan jealous',
        'Emotional': 'Ugly crying that makes everyone uncomfortable but can\'t look away',
        'Combative': 'Passive-aggressive arguing disguised as polite conversation',
        'Funny': 'Accidentally hilarious in ways that shouldn\'t be legal'
      },
      
      // Street Interview enhancements  
      setting: {
        'Busy market': 'Chaotic Bangkok street market during monsoon season with flying umbrellas',
        'Rainy street': 'Neon-soaked Tokyo alley at 3am with mysterious steam rising from manholes',
        'High school': 'Overly dramatic high school hallway during prom proposal season',
        'Nightclub line': 'Pretentious nightclub line where everyone\'s pretending they\'re not cold',
        'Rooftop party': 'Rooftop party where the Wi-Fi is down and everyone\'s having actual conversations'
      },
      hostStyle: {
        'Chill interviewer': 'So chill they make everyone spill their deepest secrets',
        'Aggressive troll': 'Aggressive troll who somehow makes people more honest than therapy',
        'Curious child': 'Innocent child asking questions that destroy adult egos',
        'Witty comedian': 'Razor-sharp comedian who turns every answer into comedy gold'
      },
      
      // ASMR/Satisfying enhancements
      satisfyingElement: {
        'Pressure washing': 'Pressure washing decades of grime off mysterious surfaces',
        'Paint mixing': 'Hypnotic paint mixing that creates colors that don\'t exist in nature',
        'Soap carving': 'Therapeutic soap carving with unnaturally perfect precision',
        'Crunchy food eating': 'ASMR eating of the crunchiest foods known to humanity',
        'Looping animation': 'Mesmerizing loop that breaks your brain in the best way'
      },
      
      // Generic fallbacks for any field
      vibe: {
        'Hype': 'Energy so hype it could power a small city',
        'Chill': 'Deceptively chill with underlying chaos bubbling beneath',
        'Goofy': 'Endearingly goofy in ways that make you question reality',
        'Cringe': 'So cringe it loops back to being accidentally cool',
        'Epic': 'Cinematically epic like a Marvel movie but for everyday life'
      },
      environment: {
        'School hallway': 'Dramatic high school hallway with movie-level lighting',
        'Parking garage': 'Underground parking garage that looks like a music video set',
        'Neon club': 'Retro-futuristic club with lights that sync to heartbeats',
        'Rainy street': 'Cinematic rainy street where every puddle reflects neon dreams'
      }
    };
    
    // Try specific field enhancement first
    const fieldEnhancements = viralEnhancements[fieldKey];
    if (fieldEnhancements && fieldEnhancements[value]) {
      return fieldEnhancements[fieldKey][value];
    }
    
    // Fallback to generic viral enhancement
    const viralPrefixes = [
      'Unexpectedly viral',
      'Internet-breaking',
      'Cinematically dramatic',  
      'Suspiciously perfect',
      'Mysteriously compelling',
      'Accidentally iconic'
    ];
    
    const viralSuffixes = [
      'that makes everyone stop scrolling',
      'with main character energy',
      'that belongs in a music video',
      'that breaks the fourth wall',
      'with plot armor levels of confidence',
      'that spawns a thousand memes'
    ];
    
    const randomPrefix = viralPrefixes[Math.floor(Math.random() * viralPrefixes.length)];
    const randomSuffix = viralSuffixes[Math.floor(Math.random() * viralSuffixes.length)];
    
    return `${randomPrefix} ${value.toLowerCase()} ${randomSuffix}`;
  };

  const generateComprehensiveJson = () => {
    if (!selectedFormat || !viralFormats[selectedFormat]) return;
    
    const format = viralFormats[selectedFormat];
    console.log('Generating JSON for format:', selectedFormat);
    console.log('Current userInputs:', userInputs);
    
    const content = buildViralSceneJson(format);
    console.log('Generated content:', content);

    // Clear existing JSON and set new content
    clearAll();
    Object.entries(content).forEach(([key, value]) => {
      if (value && typeof value === 'string' && value.trim()) {
        setFieldValue(key, value);
        console.log(`Set field ${key}: ${value}`);
      }
    });
  };

  const buildViralSceneJson = (format) => {
    const inputs = userInputs;
    let sceneDescription = '';
    let tagline = '';
    
    // Build comprehensive JSON based on format
    switch (selectedFormat) {
      case 'podcastInterview':
        sceneDescription = `${inputs.hostType || 'Host'} interviews ${inputs.guestType || 'guest'} about ${inputs.topic || 'topic'} with ${inputs.toneDynamic || 'neutral'} energy`;
        tagline = 'Truth bombs and heated debates in intimate conversation';
        return {
          scene: sceneDescription,
          tagline,
          format: selectedFormat,
          formatName: format.name,
          hostType: inputs.hostType || '',
          guestType: inputs.guestType || '',
          topic: inputs.topic || '',
          tone: inputs.toneDynamic || '',
          cameraStyle: 'Two-shot with periodic close-ups during intense moments',
          lighting: 'Warm intimate lighting with subtle drama shadows',
          music: 'Low ambient tension track with silence during key reveals',
          dialogue: `Host: "So tell me about ${inputs.topic || 'this situation'}..." Guest: [Responds with ${inputs.toneDynamic || 'neutral'} energy]`,
          atmosphere: 'Intimate but charged with underlying tension',
          environment: 'Professional podcast studio with subtle mood lighting',
          aspect_ratio: "16:9"
        };
        
      case 'streetInterview':
        sceneDescription = `Street interview in ${inputs.setting || 'busy location'} with ${inputs.hostStyle || 'interviewer'} asking ${inputs.questionType || 'questions'} getting ${inputs.responseStyle || 'responses'}`;
        return {
          scene: sceneDescription,
          tagline: 'Raw authentic reactions from real people',
          format: selectedFormat,
          formatName: format.name,
          setting: inputs.setting || '',
          hostStyle: inputs.hostStyle || '',
          questionType: inputs.questionType || '',
          responseStyle: inputs.responseStyle || '',
          cameraStyle: 'Handheld tracking shots with quick reaction zooms',
          lighting: 'Natural outdoor lighting with dynamic movement',
          music: 'Upbeat background with comedic stingers for reactions',
          atmosphere: 'Energy of spontaneous discovery and surprise',
          environment: inputs.setting || 'Urban street setting',
          aspect_ratio: "16:9"
        };

      case 'danceLoop':
        sceneDescription = `${inputs.character || 'Person'} performs ${inputs.vibe || 'dance'} moves in ${inputs.environment || 'location'} with ${inputs.twist || 'surprise element'}`;
        return {
          scene: sceneDescription,
          tagline: 'Short-form dance content designed for maximum engagement',
          format: selectedFormat,
          formatName: format.name,
          vibe: inputs.vibe || '',
          environment: inputs.environment || '',
          character: inputs.character || '',
          twist: inputs.twist || '',
          cameraStyle: 'Quick cuts with rhythm matching, close-ups on moves',
          lighting: 'High-contrast lighting that pops on mobile screens',
          music: 'Trending TikTok audio with perfect beat drops',
          atmosphere: 'High-energy with infectious enthusiasm',
          aspect_ratio: "9:16"
        };

      case 'asmrLoop':
        sceneDescription = `Satisfying ${inputs.satisfyingElement || 'activity'} filmed with ${inputs.cameraType || 'camera'} featuring ${inputs.soundStyle || 'audio'} in ${inputs.colorAesthetic || 'aesthetic'}`;
        return {
          scene: sceneDescription,
          tagline: 'Oddly satisfying content that triggers ASMR responses',
          format: selectedFormat,
          formatName: format.name,
          satisfyingElement: inputs.satisfyingElement || '',
          cameraType: inputs.cameraType || '',
          soundStyle: inputs.soundStyle || '',
          colorAesthetic: inputs.colorAesthetic || '',
          cameraStyle: 'Macro close-ups with smooth, hypnotic movements',
          lighting: 'Soft, even lighting that highlights textures',
          music: 'Minimal ambient sounds or whispered narration',
          atmosphere: 'Calm, meditative, and deeply satisfying',
          aspect_ratio: "16:9"
        };

      case 'creatureReacts':
        sceneDescription = `${inputs.creatureType || 'Creature'} discovers and reacts to ${inputs.humanThing || 'human behavior'} with ${inputs.tone || 'curiosity'} in ${inputs.narrationStyle || 'style'}`;
        return {
          scene: sceneDescription,
          tagline: 'Non-human perspective on everyday human life',
          format: selectedFormat,
          formatName: format.name,
          creatureType: inputs.creatureType || '',
          humanThing: inputs.humanThing || '',
          tone: inputs.tone || '',
          narrationStyle: inputs.narrationStyle || '',
          cameraStyle: 'POV shots mixed with reaction close-ups',
          lighting: 'Contrasting lighting to highlight the culture clash',
          music: 'Whimsical or dramatic score based on creature reaction',
          atmosphere: 'Fish-out-of-water comedy with heart',
          aspect_ratio: "16:9"
        };

      case 'oneSentenceDrama':
        sceneDescription = `${inputs.mainCharacter || 'Character'} delivers shocking revelation "${inputs.shockingSentence || 'dramatic line'}" in ${inputs.setting || 'location'} resulting in ${inputs.reaction || 'reaction'}`;
        return {
          scene: sceneDescription,
          tagline: 'Maximum drama in minimum time',
          format: selectedFormat,
          formatName: format.name,
          setting: inputs.setting || '',
          mainCharacter: inputs.mainCharacter || '',
          shockingSentence: inputs.shockingSentence || '',
          reaction: inputs.reaction || '',
          cameraStyle: 'Tight close-ups building to wide reaction shots',
          lighting: 'Dramatic lighting with strategic shadows',
          music: 'Tension-building score with dramatic sting',
          atmosphere: 'Soap opera intensity compressed into seconds',
          aspect_ratio: "9:16"
        };

      case 'conspiracyBreakdown':
        sceneDescription = `${inputs.narratorStyle || 'Narrator'} explains ${inputs.conspiracyType || 'conspiracy'} using ${inputs.visualStyle || 'visuals'} with ${inputs.tone || 'serious'} delivery`;
        return {
          scene: sceneDescription,
          tagline: 'Truth-seeking content that makes you question everything',
          format: selectedFormat,
          formatName: format.name,
          narratorStyle: inputs.narratorStyle || '',
          conspiracyType: inputs.conspiracyType || '',
          visualStyle: inputs.visualStyle || '',
          tone: inputs.tone || '',
          cameraStyle: 'Documentary-style with quick cuts to evidence',
          lighting: 'Mysterious mood lighting with selective illumination',
          music: 'Suspenseful ambient track with investigative feel',
          atmosphere: 'Investigative thriller meets social media',
          aspect_ratio: "16:9"
        };

      case 'viralAd':
        sceneDescription = `${inputs.narratorType || 'Narrator'} presents ${inputs.productType || 'product'} in ${inputs.adTone || 'tone'} style with ${inputs.visualGimmick || 'visual effects'}`;
        return {
          scene: sceneDescription,
          tagline: 'Parody advertising that becomes accidentally viral',
          format: selectedFormat,
          formatName: format.name,
          productType: inputs.productType || '',
          adTone: inputs.adTone || '',
          narratorType: inputs.narratorType || '',
          visualGimmick: inputs.visualGimmick || '',
          cameraStyle: 'High-production value with deliberate cheese factor',
          lighting: 'Overlit commercial lighting with dramatic flair',
          music: 'Catchy jingle that gets stuck in your head',
          atmosphere: 'So bad it\'s good commercial energy',
          aspect_ratio: "16:9"
        };
        
      default:
        return {
          scene: `${format.name} scene with user-defined elements`,
          format: selectedFormat,
          formatName: format.name,
          ...inputs,
          cameraStyle: 'Dynamic cinematography matching viral format',
          lighting: 'Professional lighting optimized for social media',
          music: 'Trending audio that matches format energy',
          aspect_ratio: "16:9"
        };
    }
  };

  // Add comprehensive JSON enhancement function
  const enhanceEntireJson = async () => {
    if (!selectedFormat || !viralFormats[selectedFormat]) return;
    
    setIsGenerating(true);
    
    try {
      const currentJson = buildViralSceneJson(viralFormats[selectedFormat]);
      const aiService = (await import('./aiApiService')).default;
      
      const enhancementPrompt = `🔧 Prompt for Claude Code:
You are modifying a viral video scene JSON object to make it more engaging, surprising, or emotionally resonant — without removing user intent. When a user clicks the "Enhance" button, enrich and modify the scene by making clever, viral-style enhancements to the values.

Update the JSON by adjusting some or all of the following fields:
- scene: Make it more specific, visual, or outrageous
- vibe: Add a viral twist, conflict, emotion, or humor  
- character: Add quirky, exaggerated, or unexpected details
- environment: Make it vivid or cinematic
- cameraStyle, lighting, music: Boost stylization for short-form video

✅ Rules:
- Never just add the word "enhanced"
- Use natural, vivid language suitable for viral videos
- Retain the structure of the original JSON
- Leave fields untouched if already high quality
- Each time Enhance is clicked, apply a new layer of enrichment

Input JSON:
${JSON.stringify(currentJson, null, 2)}

Return only the enhanced JSON object, properly formatted.`;

      const response = await aiService.makeRequest([
        { role: 'user', content: enhancementPrompt }
      ], {
        temperature: 0.8,
        max_tokens: 800
      });

      const enhancedResponse = response.choices[0]?.message?.content?.trim();
      
      try {
        // Try to parse the AI response as JSON
        const enhancedJson = JSON.parse(enhancedResponse);
        
        // Clear existing JSON and set enhanced content
        clearAll();
        Object.entries(enhancedJson).forEach(([key, value]) => {
          if (value && typeof value === 'string' && value.trim()) {
            setFieldValue(key, value);
          }
        });
        
        setShowGenerateSuccess(true);
        setTimeout(() => setShowGenerateSuccess(false), 3000);
        
      } catch (parseError) {
        console.log('Failed to parse AI response, using fallback enhancement');
        generateComprehensiveJson();
      }
      
    } catch (error) {
      console.error('Full JSON enhancement failed:', error);
      generateComprehensiveJson();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualGenerate = async () => {
    if (!selectedFormat) return;
    
    if (useAIEnhancement) {
      // Use AI-enhanced generation
      await enhanceEntireJson();
    } else {
      // Use standard generation
      setIsGenerating(true);
      setShowGenerateSuccess(false);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        generateComprehensiveJson();
        
        setShowGenerateSuccess(true);
        setTimeout(() => setShowGenerateSuccess(false), 3000);
      } catch (error) {
        console.error('Generation error:', error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[3000] p-4">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-cinema-panel rounded-lg shadow-xl dark:shadow-glow-soft max-w-7xl w-full max-h-[90vh] overflow-hidden border border-transparent dark:border-cinema-border"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-cinema-border bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <span className="text-2xl lg:text-3xl">🔥</span>
            <div>
              <h2 className="text-lg lg:text-2xl font-bold">Viral Video Generator</h2>
              <p className="text-xs lg:text-sm text-purple-100 hidden sm:block">Dropdown inputs • Manual override • AI enhance • Live JSON</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* AI Enhancement Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-purple-100">AI Enhance</span>
              <button
                onClick={() => setUseAIEnhancement(!useAIEnhancement)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  useAIEnhancement ? 'bg-gradient-to-r from-pink-400 to-purple-400' : 'bg-purple-700'
                }`}
              >
                <div className={`absolute w-4 h-4 bg-white rounded-full shadow-md transition-transform top-0.5 ${
                  useAIEnhancement ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            {/* Live Updates Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-purple-100">Live Updates</span>
              <button
                onClick={() => setLiveUpdates(!liveUpdates)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  liveUpdates ? 'bg-purple-300' : 'bg-purple-700'
                }`}
              >
                <div className={`absolute w-4 h-4 bg-white rounded-full shadow-md transition-transform top-0.5 ${
                  liveUpdates ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-auto lg:h-[75vh]">
          {/* Left Panel - Format Selection */}
          <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-cinema-border overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-cinema-text mb-4">🎬 Viral Formats</h3>
              
              {/* Format List */}
              <div className="space-y-2">
                {Object.entries(viralFormats).map(([formatId, format]) => (
                  <button
                    key={formatId}
                    onClick={() => handleFormatSelect(formatId)}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      selectedFormat === formatId
                        ? 'border-purple-500 bg-purple-50 dark:border-purple-500 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-cinema-border hover:border-purple-300 dark:hover:border-purple-500/50 bg-white dark:bg-cinema-card'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-lg mt-0.5">{format.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-cinema-text text-sm">
                          {format.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-cinema-text-muted mt-1 leading-relaxed">
                          {format.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Panel - Input Fields */}
          <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-cinema-border overflow-y-auto">
            <div className="p-4">
              {selectedFormat ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-cinema-text">
                      ✨ {viralFormats[selectedFormat].name} Fields
                    </h3>
                  </div>
                  
                  {viralFormats[selectedFormat].fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text">
                        {field.label}
                      </label>
                      
                      {/* Dropdown with options */}
                      <select
                        value={userInputs[field.key] || ''}
                        onChange={(e) => {
                          handleInputChange(field.key, e.target.value);
                          // Clear any previous manual input when dropdown is selected
                          if (e.target.value) {
                            // This ensures the dropdown selection is preserved
                            console.log(`Dropdown selected for ${field.key}: ${e.target.value}`);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select {field.label.toLowerCase()}...</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      
                      <div className="text-center my-2">
                        <span className="text-xs text-gray-500 dark:text-cinema-text-muted">OR</span>
                      </div>
                      
                      {/* Manual text input */}
                      <div className="relative">
                        <input
                          type="text"
                          value={userInputs[field.key] || ''}
                          onChange={(e) => {
                            handleInputChange(field.key, e.target.value);
                            console.log(`Manual input for ${field.key}: ${e.target.value}`);
                          }}
                          placeholder={`Write your own ${field.label.toLowerCase()}...`}
                          className="w-full px-3 py-2 pr-20 border border-gray-300 dark:border-cinema-border rounded-md bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        
                        {/* Enhance Button */}
                        <button
                          onClick={() => handleEnhance(field.key)}
                          disabled={!userInputs[field.key] || enhancingField === field.key}
                          className={`absolute right-1 top-1 bottom-1 px-2 text-xs font-medium rounded transition-colors ${
                            !userInputs[field.key] || enhancingField === field.key
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-purple-500 hover:bg-purple-600 text-white'
                          }`}
                        >
                          {enhancingField === field.key ? (
                            <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            '✨ Enhance'
                          )}
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Generate Button */}
                  {!liveUpdates && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-cinema-border">
                      <button
                        onClick={handleManualGenerate}
                        disabled={isGenerating || !selectedFormat}
                        className={`w-full py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                          isGenerating || !selectedFormat
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                        }`}
                      >
                        {isGenerating ? (
                          <>
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Generating JSON...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-lg">{useAIEnhancement ? '🎯' : '🚀'}</span>
                            <span>{useAIEnhancement ? 'AI Enhance & Generate' : 'Generate JSON Output'}</span>
                          </>
                        )}
                      </button>
                      
                      {/* Success Message */}
                      {showGenerateSuccess && (
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg">
                          <div className="flex items-center justify-center space-x-2">
                            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                              ✨ JSON Generated Successfully!
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="space-y-4">
                    <div className="text-4xl">👈</div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text">
                      Select a Format
                    </h3>
                    <p className="text-gray-600 dark:text-cinema-text-muted text-sm max-w-xs">
                      Choose one of the 8 viral video formats to get started with your structured prompt
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - JSON Preview */}
          <div className="w-full lg:w-1/3 overflow-y-auto bg-gray-50 dark:bg-cinema-card">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-cinema-text">
                  📄 JSON Output
                </h3>
                <div className={`text-xs font-medium px-2 py-1 rounded ${
                  liveUpdates 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {liveUpdates ? '🔄 Live' : '⚡ Manual'}
                </div>
              </div>

              {selectedFormat ? (
                <div className="space-y-4">
                  {/* Format Info */}
                  <div className="bg-white dark:bg-cinema-panel p-3 rounded-lg border border-gray-200 dark:border-cinema-border">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{viralFormats[selectedFormat].icon}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-cinema-text">
                          {viralFormats[selectedFormat].name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-cinema-text-muted">
                          Complete structured prompt
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* JSON Preview */}
                  <div className="bg-gray-900 dark:bg-cinema-black rounded-lg p-3 border border-gray-700 dark:border-cinema-border">
                    <div className="text-xs text-gray-300 mb-2">JSON Output:</div>
                    <div className="text-green-400 dark:text-cinema-teal text-xs font-mono leading-relaxed max-h-96 overflow-y-auto">
                      {(() => {
                        try {
                          const jsonOutput = usePromptStore.getState().getJsonOutput();
                          if (jsonOutput && jsonOutput.trim()) {
                            return (
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(JSON.parse(jsonOutput), null, 2)}
                              </pre>
                            );
                          }
                        } catch (e) {
                          // Fall back to empty state
                        }
                        return (
                          <div className="text-gray-500 italic">
                            {selectedFormat 
                              ? 'Fill in fields above to see comprehensive JSON output...' 
                              : 'Select a format to begin'}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">
                      💡 How to Use
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                      <div>• Select from dropdowns or write custom values</div>
                      <div>• Click "✨ Enhance" to make content more viral</div>
                      <div>• Toggle live updates on/off in header</div>
                      <div>• JSON includes scene, camera, lighting, music</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="space-y-3">
                    <div className="text-4xl">📝</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-cinema-text">
                      JSON Preview
                    </div>
                    <div className="text-xs text-gray-500 dark:text-cinema-text-muted max-w-xs">
                      Choose a viral format to see comprehensive JSON output with scene description, camera work, lighting, and more
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViralVideoGeneratorModal;