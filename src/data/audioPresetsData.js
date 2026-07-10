export const audioPresets = {
  // MUSIC STYLE PRESETS (8 presets)
  "cinematic-orchestral": {
    id: "cinematic-orchestral",
    name: "Cinematic Orchestral",
    description: "Full orchestral score with emotional depth and grandeur",
    category: "music",
    tags: ["orchestral", "cinematic", "emotional", "grand"],
    useCase: "Epic scenes, emotional moments, grand reveals, film scoring",
    fields: {
      music_style: "cinematic orchestral",
      audio_mood: "dramatic",
      sound_effects: "orchestral instruments",
      background_audio: "full orchestra with strings, brass, and percussion"
    },
    customDetails: "Rich orchestral arrangements with sweeping strings, powerful brass, and dynamic percussion creating emotional cinematic moments"
  },

  "ambient-electronic": {
    id: "ambient-electronic",
    name: "Ambient Electronic",
    description: "Atmospheric electronic soundscapes with subtle textures",
    category: "music",
    tags: ["ambient", "electronic", "atmospheric", "subtle"],
    useCase: "Futuristic scenes, contemplative moments, sci-fi backgrounds, meditation content",
    fields: {
      music_style: "ambient electronic",
      audio_mood: "calm",
      sound_effects: "synthesizer pads and textures",
      background_audio: "ethereal electronic soundscapes with subtle beats"
    },
    customDetails: "Floating electronic textures with gentle synthesizer pads, creating spacious and contemplative sonic environments"
  },

  "jazz-noir": {
    id: "jazz-noir",
    name: "Jazz Noir",
    description: "Smoky jazz with saxophone and piano in classic noir style",
    category: "music",
    tags: ["jazz", "noir", "sophisticated", "smoky"],
    useCase: "Detective scenes, sophisticated content, nighttime ambiance, retro aesthetics",
    fields: {
      music_style: "jazz noir",
      audio_mood: "mysterious",
      sound_effects: "saxophone and piano",
      background_audio: "smoky jazz club atmosphere with muted trumpet and walking bass"
    },
    customDetails: "Classic noir jazz with sultry saxophone, moody piano, and the sophisticated atmosphere of smoky jazz clubs"
  },

  "folk-acoustic": {
    id: "folk-acoustic",
    name: "Folk Acoustic",
    description: "Warm acoustic instruments with organic, earthy tones",
    category: "music",
    tags: ["folk", "acoustic", "warm", "organic"],
    useCase: "Nature content, intimate moments, rustic settings, authentic storytelling",
    fields: {
      music_style: "folk acoustic",
      audio_mood: "peaceful",
      sound_effects: "acoustic guitar and natural instruments",
      background_audio: "warm acoustic guitar with gentle percussion and organic textures"
    },
    customDetails: "Earthy acoustic arrangements with fingerpicked guitar, subtle percussion, and the warmth of natural wooden instruments"
  },

  "synthwave-retro": {
    id: "synthwave-retro",
    name: "Synthwave Retro",
    description: "80s-inspired electronic music with nostalgic synthesizers",
    category: "music",
    tags: ["synthwave", "80s", "retro", "electronic"],
    useCase: "Retro content, neon aesthetics, nostalgic scenes, cyberpunk themes",
    fields: {
      music_style: "synthwave retro",
      audio_mood: "energetic",
      sound_effects: "vintage synthesizers and drum machines",
      background_audio: "pulsing synthesizers with nostalgic 80s drum patterns and neon atmosphere"
    },
    customDetails: "Nostalgic 80s electronic sounds with pulsing synthesizers, vintage drum machines, and the glow of neon-soaked nostalgia"
  },

  "minimalist-piano": {
    id: "minimalist-piano",
    name: "Minimalist Piano",
    description: "Simple, elegant piano melodies with space and emotion",
    category: "music",
    tags: ["minimalist", "piano", "elegant", "emotional"],
    useCase: "Emotional scenes, contemplative moments, intimate conversations, artistic content",
    fields: {
      music_style: "minimalist piano",
      audio_mood: "melancholic",
      sound_effects: "solo piano",
      background_audio: "delicate piano melodies with natural room reverb and emotional space"
    },
    customDetails: "Pure piano expression with delicate melodies, natural reverb, and the emotional power of minimalist composition"
  },

  "world-fusion": {
    id: "world-fusion",
    name: "World Fusion",
    description: "Global instruments blended with modern production",
    category: "music",
    tags: ["world", "fusion", "global", "cultural"],
    useCase: "Cultural content, travel scenes, global perspectives, diverse storytelling",
    fields: {
      music_style: "world fusion",
      audio_mood: "uplifting",
      sound_effects: "traditional instruments from various cultures",
      background_audio: "blend of global instruments with modern rhythms and cultural textures"
    },
    customDetails: "Rich cultural tapestry of global instruments including tabla, sitar, djembe, and flutes woven with contemporary production"
  },

  "lo-fi-chill": {
    id: "lo-fi-chill",
    name: "Lo-Fi Chill",
    description: "Relaxed beats with warm, nostalgic vinyl texture",
    category: "music",
    tags: ["lo-fi", "chill", "relaxed", "nostalgic"],
    useCase: "Study scenes, relaxed content, cozy atmospheres, casual moments",
    fields: {
      music_style: "lo-fi chill",
      audio_mood: "calm",
      sound_effects: "vinyl crackle and mellow beats",
      background_audio: "relaxed hip-hop beats with vintage vinyl warmth and cozy atmosphere"
    },
    customDetails: "Cozy lo-fi beats with vinyl crackle, mellow drums, and the warm nostalgia of analog recording imperfections"
  },

  // SOUND EFFECT PRESETS (6 presets)
  "urban-city": {
    id: "urban-city",
    name: "Urban City Sounds",
    description: "Bustling city atmosphere with traffic and urban life",
    category: "sound-effects",
    tags: ["urban", "city", "traffic", "bustling"],
    useCase: "City scenes, urban environments, busy streets, metropolitan content",
    fields: {
      sound_effects: "city traffic and urban ambiance",
      background_audio: "car horns, footsteps, and distant city hum",
      audio_mood: "energetic"
    },
    customDetails: "Dynamic urban soundscape with car engines, pedestrian chatter, construction sounds, and the constant hum of city life"
  },

  "nature-forest": {
    id: "nature-forest",
    name: "Nature Forest Sounds",
    description: "Peaceful forest ambiance with birds and rustling leaves",
    category: "sound-effects",
    tags: ["nature", "forest", "birds", "peaceful"],
    useCase: "Nature content, peaceful scenes, outdoor environments, meditation",
    fields: {
      sound_effects: "bird songs and rustling leaves",
      background_audio: "forest ambiance with gentle wind through trees",
      audio_mood: "peaceful"
    },
    customDetails: "Serene forest environment with chirping birds, rustling leaves, distant woodpecker, and gentle wind through the canopy"
  },

  "ocean-waves": {
    id: "ocean-waves",
    name: "Ocean Waves",
    description: "Rhythmic ocean waves with seagulls and coastal atmosphere",
    category: "sound-effects",
    tags: ["ocean", "waves", "coastal", "rhythmic"],
    useCase: "Beach scenes, coastal content, relaxation, water environments",
    fields: {
      sound_effects: "ocean waves and seagulls",
      background_audio: "rhythmic wave crashes with coastal wind",
      audio_mood: "calm"
    },
    customDetails: "Hypnotic ocean rhythm with crashing waves, distant seagulls, salty breeze, and the timeless sound of water meeting shore"
  },

  "thunderstorm": {
    id: "thunderstorm",
    name: "Thunderstorm",
    description: "Dramatic storm with thunder, rain, and lightning",
    category: "sound-effects",
    tags: ["storm", "thunder", "rain", "dramatic"],
    useCase: "Dramatic scenes, weather content, tension building, natural power",
    fields: {
      sound_effects: "thunder and heavy rain",
      background_audio: "storm atmosphere with wind and lightning",
      audio_mood: "tense"
    },
    customDetails: "Powerful storm environment with rolling thunder, heavy rainfall, howling wind, and the electric atmosphere of lightning"
  },

  "cafe-ambiance": {
    id: "cafe-ambiance",
    name: "Cafe Ambiance",
    description: "Cozy coffee shop atmosphere with chatter and coffee sounds",
    category: "sound-effects",
    tags: ["cafe", "cozy", "coffee", "social"],
    useCase: "Coffee shop scenes, social environments, cozy settings, conversation backgrounds",
    fields: {
      sound_effects: "coffee machine and gentle chatter",
      background_audio: "cafe atmosphere with clinking cups and soft conversation",
      audio_mood: "comfortable"
    },
    customDetails: "Warm cafe environment with espresso machine hissing, friendly chatter, clinking ceramics, and cozy social atmosphere"
  },

  "space-ambient": {
    id: "space-ambient",
    name: "Space Ambient",
    description: "Ethereal space sounds with cosmic atmosphere",
    category: "sound-effects",
    tags: ["space", "cosmic", "ethereal", "sci-fi"],
    useCase: "Sci-fi content, space scenes, futuristic environments, cosmic themes",
    fields: {
      sound_effects: "cosmic ambiance and ethereal tones",
      background_audio: "space atmosphere with distant cosmic sounds",
      audio_mood: "mysterious"
    },
    customDetails: "Otherworldly cosmic soundscape with distant stellar winds, ethereal drones, and the vast silence of infinite space"
  },

  // CINEMATIC SCORE PRESETS (12 presets)
  "epic-battle-score": {
    id: "epic-battle-score",
    name: "Epic Battle Score",
    description: "Intense orchestral music for combat and action sequences",
    category: "cinematic",
    tags: ["epic", "battle", "orchestral", "intense", "action"],
    useCase: "Action scenes, battles, heroic moments, climactic fights",
    fields: {
      music_style: "epic orchestral battle",
      audio_mood: "intense",
      sound_effects: "dramatic percussion and brass",
      background_audio: "powerful orchestra with war drums and heroic themes"
    },
    customDetails: "Thunderous orchestral arrangements with driving percussion, soaring brass, and the musical language of heroic conflict"
  },

  "suspenseful-thriller": {
    id: "suspenseful-thriller",
    name: "Suspenseful Thriller",
    description: "Tense, building music that creates anxiety and anticipation",
    category: "cinematic",
    tags: ["suspense", "thriller", "tense", "building", "anxiety"],
    useCase: "Thriller scenes, building tension, mystery reveals, psychological drama",
    fields: {
      music_style: "suspenseful orchestral",
      audio_mood: "tense",
      sound_effects: "string tremolo and dissonant chords",
      background_audio: "building orchestral tension with ominous undertones"
    },
    customDetails: "Masterful tension building with trembling strings, ominous brass stabs, and the musical architecture of suspense"
  },

  "emotional-heartbreak": {
    id: "emotional-heartbreak",
    name: "Emotional Heartbreak",
    description: "Deeply moving orchestral music for tragic and emotional moments",
    category: "cinematic",
    tags: ["emotional", "heartbreak", "tragic", "moving", "sad"],
    useCase: "Sad scenes, character deaths, heartbreak moments, emotional revelations",
    fields: {
      music_style: "emotional orchestral",
      audio_mood: "melancholic",
      sound_effects: "solo violin and gentle strings",
      background_audio: "heartbreaking orchestral themes with delicate instrumentation"
    },
    customDetails: "Tear-inducing orchestral beauty with solo violin, gentle strings, and the profound emotional weight of musical storytelling"
  },

  "heroic-triumph": {
    id: "heroic-triumph",
    name: "Heroic Triumph",
    description: "Uplifting orchestral music celebrating victory and achievement",
    category: "cinematic",
    tags: ["heroic", "triumph", "victory", "uplifting", "celebration"],
    useCase: "Victory scenes, hero moments, achievements, positive resolutions",
    fields: {
      music_style: "heroic orchestral",
      audio_mood: "triumphant",
      sound_effects: "soaring brass and full orchestra",
      background_audio: "victorious orchestral themes with golden brass and sweeping strings"
    },
    customDetails: "Soaring orchestral celebration with triumphant brass, sweeping strings, and the musical expression of heroic victory"
  },

  "dark-villain-theme": {
    id: "dark-villain-theme",
    name: "Dark Villain Theme",
    description: "Ominous orchestral music representing evil and darkness",
    category: "cinematic",
    tags: ["dark", "villain", "evil", "ominous", "threatening"],
    useCase: "Villain scenes, evil reveals, dark moments, threatening atmospheres",
    fields: {
      music_style: "dark orchestral",
      audio_mood: "menacing",
      sound_effects: "low brass and ominous percussion",
      background_audio: "sinister orchestral themes with dark harmonies and threatening motifs"
    },
    customDetails: "Menacing orchestral darkness with rumbling low brass, ominous percussion, and the musical embodiment of evil presence"
  },

  "romantic-love-theme": {
    id: "romantic-love-theme",
    name: "Romantic Love Theme",
    description: "Beautiful orchestral music for romantic and intimate moments",
    category: "cinematic",
    tags: ["romantic", "love", "beautiful", "intimate", "tender"],
    useCase: "Romance scenes, love moments, intimate conversations, wedding scenes",
    fields: {
      music_style: "romantic orchestral",
      audio_mood: "romantic",
      sound_effects: "warm strings and gentle woodwinds",
      background_audio: "tender orchestral romance with flowing melodies and warm harmonies"
    },
    customDetails: "Tender orchestral romance with flowing strings, gentle woodwinds, and the musical language of love and intimacy"
  },

  "adventure-quest": {
    id: "adventure-quest",
    name: "Adventure Quest",
    description: "Exciting orchestral music for journeys and exploration",
    category: "cinematic",
    tags: ["adventure", "quest", "journey", "exploration", "exciting"],
    useCase: "Adventure scenes, travel montages, exploration, quest beginnings",
    fields: {
      music_style: "adventure orchestral",
      audio_mood: "adventurous",
      sound_effects: "playful woodwinds and rhythmic strings",
      background_audio: "spirited orchestral adventure with driving rhythms and exploratory themes"
    },
    customDetails: "Spirited orchestral adventure with playful woodwinds, driving rhythms, and the musical spirit of exploration and discovery"
  },

  "mystery-investigation": {
    id: "mystery-investigation",
    name: "Mystery Investigation",
    description: "Intriguing orchestral music for detective work and mysteries",
    category: "cinematic",
    tags: ["mystery", "investigation", "detective", "intrigue", "puzzle"],
    useCase: "Detective scenes, investigation montages, mystery solving, clue discoveries",
    fields: {
      music_style: "mystery orchestral",
      audio_mood: "mysterious",
      sound_effects: "pizzicato strings and muted brass",
      background_audio: "intriguing orchestral mystery with subtle percussion and questioning themes"
    },
    customDetails: "Intriguing orchestral mystery with pizzicato strings, muted brass, and the musical language of investigation and discovery"
  },

  "chase-pursuit": {
    id: "chase-pursuit",
    name: "Chase Pursuit",
    description: "Fast-paced orchestral music for chase scenes and urgent action",
    category: "cinematic",
    tags: ["chase", "pursuit", "fast-paced", "urgent", "action"],
    useCase: "Chase scenes, urgent moments, escape sequences, high-speed action",
    fields: {
      music_style: "chase orchestral",
      audio_mood: "urgent",
      sound_effects: "rapid strings and driving percussion",
      background_audio: "relentless orchestral chase with accelerating rhythms and urgent themes"
    },
    customDetails: "Relentless orchestral pursuit with rapid string ostinatos, driving percussion, and the musical embodiment of urgent chase action"
  },

  "magical-wonder": {
    id: "magical-wonder",
    name: "Magical Wonder",
    description: "Enchanting orchestral music for magical and fantastical moments",
    category: "cinematic",
    tags: ["magical", "wonder", "enchanting", "fantasy", "mystical"],
    useCase: "Magic scenes, fantasy moments, wonder reveals, mystical environments",
    fields: {
      music_style: "magical orchestral",
      audio_mood: "enchanted",
      sound_effects: "ethereal harp and celestial chimes",
      background_audio: "mystical orchestral wonder with sparkling textures and magical themes"
    },
    customDetails: "Ethereal orchestral magic with sparkling harp, celestial chimes, and the musical expression of wonder and enchantment"
  },

  "sci-fi-cosmos": {
    id: "sci-fi-cosmos",
    name: "Sci-Fi Cosmos",
    description: "Futuristic orchestral music for space and science fiction",
    category: "cinematic",
    tags: ["sci-fi", "space", "futuristic", "cosmic", "technology"],
    useCase: "Sci-fi scenes, space exploration, futuristic technology, cosmic wonder",
    fields: {
      music_style: "sci-fi orchestral",
      audio_mood: "futuristic",
      sound_effects: "electronic textures and orchestral blend",
      background_audio: "cosmic orchestral soundscape with electronic elements and space themes"
    },
    customDetails: "Futuristic orchestral cosmos with electronic textures, otherworldly harmonies, and the musical language of space exploration"
  },

  "horror-dread": {
    id: "horror-dread",
    name: "Horror Dread",
    description: "Terrifying orchestral music for horror and frightening scenes",
    category: "cinematic",
    tags: ["horror", "dread", "scary", "terrifying", "frightening"],
    useCase: "Horror scenes, scary moments, dread building, frightening reveals",
    fields: {
      music_style: "horror orchestral",
      audio_mood: "terrifying",
      sound_effects: "dissonant strings and ominous brass",
      background_audio: "spine-chilling orchestral horror with unsettling harmonies and dread-inducing themes"
    },
    customDetails: "Spine-chilling orchestral terror with dissonant strings, jarring brass stabs, and the musical embodiment of pure dread"
  },

  // DIALOGUE/VOICE PRESETS (12 presets)
  "dramatic-monologue": {
    id: "dramatic-monologue",
    name: "Dramatic Monologue",
    description: "Powerful, emotional speech delivery with theatrical presence",
    category: "dialogue",
    tags: ["dramatic", "monologue", "emotional", "theatrical", "powerful"],
    useCase: "Important speeches, character revelations, dramatic moments, soliloquies",
    fields: {
      dialogue_style: "dramatic monologue",
      voice_tone: "passionate and emotional",
      audio_mood: "intense",
      sound_effects: "subtle reverb for dramatic emphasis"
    },
    customDetails: "Commanding dramatic delivery with emotional depth, theatrical timing, and the vocal power of important character moments"
  },

  "whispered-secrets": {
    id: "whispered-secrets",
    name: "Whispered Secrets",
    description: "Intimate, hushed dialogue for private and secretive moments",
    category: "dialogue",
    tags: ["whispered", "secrets", "intimate", "hushed", "private"],
    useCase: "Secret conversations, intimate moments, conspiracy scenes, private revelations",
    fields: {
      dialogue_style: "whispered conversation",
      voice_tone: "intimate and secretive",
      audio_mood: "mysterious",
      sound_effects: "close proximity recording with subtle ambient"
    },
    customDetails: "Intimate whispered delivery with close microphone placement, creating the feeling of shared secrets and private moments"
  },

  "sarcastic-wit": {
    id: "sarcastic-wit",
    name: "Sarcastic Wit",
    description: "Sharp, clever dialogue delivery with sarcastic timing",
    category: "dialogue",
    tags: ["sarcastic", "wit", "clever", "sharp", "humorous"],
    useCase: "Comedy scenes, witty banter, sarcastic characters, humorous moments",
    fields: {
      dialogue_style: "sarcastic delivery",
      voice_tone: "witty and sharp",
      audio_mood: "playful",
      sound_effects: "crisp dialogue with comedic timing"
    },
    customDetails: "Sharp sarcastic delivery with perfect comedic timing, emphasizing wit and clever wordplay with vocal precision"
  },

  "authoritative-command": {
    id: "authoritative-command",
    name: "Authoritative Command",
    description: "Strong, commanding voice for leadership and authority",
    category: "dialogue",
    tags: ["authoritative", "command", "leadership", "strong", "powerful"],
    useCase: "Leadership scenes, military commands, boss characters, authority figures",
    fields: {
      dialogue_style: "commanding authority",
      voice_tone: "strong and decisive",
      audio_mood: "confident",
      sound_effects: "clear projection with natural authority"
    },
    customDetails: "Commanding vocal presence with natural authority, clear projection, and the vocal qualities of leadership and decision-making"
  },

  "nervous-stammering": {
    id: "nervous-stammering",
    name: "Nervous Stammering",
    description: "Anxious, hesitant speech patterns showing nervousness",
    category: "dialogue",
    tags: ["nervous", "stammering", "anxious", "hesitant", "uncertain"],
    useCase: "Nervous characters, anxiety scenes, awkward moments, uncertainty",
    fields: {
      dialogue_style: "nervous stammering",
      voice_tone: "anxious and uncertain",
      audio_mood: "uncomfortable",
      sound_effects: "hesitant delivery with natural speech patterns"
    },
    customDetails: "Authentic nervous delivery with natural hesitations, stammers, and the vocal patterns of anxiety and uncertainty"
  },

  "wise-narrator": {
    id: "wise-narrator",
    name: "Wise Narrator",
    description: "Thoughtful, experienced narration with depth and wisdom",
    category: "dialogue",
    tags: ["wise", "narrator", "thoughtful", "experienced", "depth"],
    useCase: "Story narration, wise characters, philosophical moments, storytelling",
    fields: {
      dialogue_style: "wise narration",
      voice_tone: "thoughtful and experienced",
      audio_mood: "contemplative",
      sound_effects: "warm vocal tone with natural wisdom"
    },
    customDetails: "Thoughtful narrative delivery with the vocal weight of experience, natural wisdom, and the storytelling quality of sage guidance"
  },

  "childlike-wonder": {
    id: "childlike-wonder",
    name: "Childlike Wonder",
    description: "Innocent, curious dialogue full of excitement and discovery",
    category: "dialogue",
    tags: ["childlike", "wonder", "innocent", "curious", "excited"],
    useCase: "Child characters, discovery moments, innocent perspectives, wonder scenes",
    fields: {
      dialogue_style: "childlike wonder",
      voice_tone: "innocent and excited",
      audio_mood: "joyful",
      sound_effects: "bright, curious vocal delivery"
    },
    customDetails: "Innocent vocal delivery with natural curiosity, excitement, and the pure wonder of discovering the world through young eyes"
  },

  "villain-menace": {
    id: "villain-menace",
    name: "Villain Menace",
    description: "Threatening, sinister dialogue delivery for antagonists",
    category: "dialogue",
    tags: ["villain", "menace", "threatening", "sinister", "evil"],
    useCase: "Villain scenes, threatening moments, sinister characters, evil reveals",
    fields: {
      dialogue_style: "menacing villain",
      voice_tone: "threatening and sinister",
      audio_mood: "menacing",
      sound_effects: "dark vocal presence with subtle threat"
    },
    customDetails: "Menacing vocal delivery with underlying threat, sinister undertones, and the chilling presence of genuine evil"
  },

  "romantic-tender": {
    id: "romantic-tender",
    name: "Romantic Tender",
    description: "Soft, loving dialogue for romantic and intimate scenes",
    category: "dialogue",
    tags: ["romantic", "tender", "loving", "soft", "intimate"],
    useCase: "Romance scenes, love declarations, tender moments, intimate conversations",
    fields: {
      dialogue_style: "romantic tenderness",
      voice_tone: "soft and loving",
      audio_mood: "romantic",
      sound_effects: "intimate vocal warmth with gentle delivery"
    },
    customDetails: "Tender romantic delivery with vocal warmth, gentle intimacy, and the soft spoken language of love and affection"
  },

  "comedic-timing": {
    id: "comedic-timing",
    name: "Comedic Timing",
    description: "Perfect comedic delivery with rhythm and timing for humor",
    category: "dialogue",
    tags: ["comedic", "timing", "humor", "funny", "rhythm"],
    useCase: "Comedy scenes, jokes, humorous characters, funny moments",
    fields: {
      dialogue_style: "comedic delivery",
      voice_tone: "humorous and playful",
      audio_mood: "funny",
      sound_effects: "precise comedic timing with natural humor"
    },
    customDetails: "Perfect comedic delivery with impeccable timing, natural humor, and the vocal rhythm that makes dialogue genuinely funny"
  },

  "elderly-wisdom": {
    id: "elderly-wisdom",
    name: "Elderly Wisdom",
    description: "Aged, weathered voice carrying years of experience and knowledge",
    category: "dialogue",
    tags: ["elderly", "wisdom", "aged", "experienced", "weathered"],
    useCase: "Elderly characters, wise mentors, experienced guides, generational wisdom",
    fields: {
      dialogue_style: "elderly wisdom",
      voice_tone: "aged and experienced",
      audio_mood: "wise",
      sound_effects: "weathered vocal quality with depth of experience"
    },
    customDetails: "Aged vocal delivery with the weight of years, natural wisdom, and the authentic sound of a life fully lived and experienced"
  },

  "fast-paced-banter": {
    id: "fast-paced-banter",
    name: "Fast-Paced Banter",
    description: "Quick, witty dialogue exchanges with rapid-fire delivery",
    category: "dialogue",
    tags: ["fast-paced", "banter", "witty", "rapid", "quick"],
    useCase: "Quick conversations, witty exchanges, banter scenes, rapid dialogue",
    fields: {
      dialogue_style: "rapid banter",
      voice_tone: "quick and witty",
      audio_mood: "energetic",
      sound_effects: "crisp, fast delivery with perfect timing"
    },
    customDetails: "Lightning-fast dialogue delivery with crisp articulation, perfect timing, and the energetic rhythm of great conversational banter"
  },

  // ATMOSPHERIC/AMBIENT PRESETS (12 presets)
  "forest-morning-mist": {
    id: "forest-morning-mist",
    name: "Forest Morning Mist",
    description: "Peaceful forest atmosphere with morning bird songs and gentle mist",
    category: "atmospheric",
    tags: ["forest", "morning", "peaceful", "birds", "mist"],
    useCase: "Nature scenes, peaceful moments, forest environments, morning atmospheres",
    fields: {
      sound_effects: "morning bird songs and rustling leaves",
      background_audio: "gentle forest ambiance with distant bird calls",
      audio_mood: "peaceful",
      environment_audio: "misty forest morning with natural tranquility"
    },
    customDetails: "Tranquil forest morning with chirping birds, gentle leaf rustling, and the serene atmosphere of dawn in the wilderness"
  },

  "rain-on-window": {
    id: "rain-on-window",
    name: "Rain on Window",
    description: "Gentle rain sounds against glass creating cozy indoor atmosphere",
    category: "atmospheric",
    tags: ["rain", "window", "cozy", "indoor", "gentle"],
    useCase: "Indoor scenes, cozy moments, contemplative atmospheres, weather ambiance",
    fields: {
      sound_effects: "gentle rain against window glass",
      background_audio: "soft rainfall with indoor ambiance",
      audio_mood: "cozy",
      environment_audio: "warm indoor space with gentle rain outside"
    },
    customDetails: "Cozy indoor atmosphere with gentle raindrops against window glass, creating a warm, contemplative environment perfect for reflection"
  },

  "bustling-marketplace": {
    id: "bustling-marketplace",
    name: "Bustling Marketplace",
    description: "Lively market atmosphere with vendors, crowds, and commerce",
    category: "atmospheric",
    tags: ["marketplace", "bustling", "vendors", "crowds", "commerce"],
    useCase: "Market scenes, busy environments, cultural atmospheres, commercial settings",
    fields: {
      sound_effects: "vendor calls and crowd chatter",
      background_audio: "bustling market activity with commerce sounds",
      audio_mood: "lively",
      environment_audio: "vibrant marketplace with cultural energy"
    },
    customDetails: "Dynamic marketplace atmosphere with vendor calls, crowd conversations, and the vibrant energy of commercial and cultural exchange"
  },

  "desert-wind-emptiness": {
    id: "desert-wind-emptiness",
    name: "Desert Wind Emptiness",
    description: "Vast desert atmosphere with wind and sparse, isolated sounds",
    category: "atmospheric",
    tags: ["desert", "wind", "emptiness", "vast", "isolated"],
    useCase: "Desert scenes, isolation moments, vast landscapes, lonely atmospheres",
    fields: {
      sound_effects: "desert wind and sparse environmental sounds",
      background_audio: "vast emptiness with occasional wind gusts",
      audio_mood: "lonely",
      environment_audio: "endless desert with haunting wind patterns"
    },
    customDetails: "Haunting desert atmosphere with persistent wind, vast emptiness, and the profound silence of endless sandy landscapes"
  },

  "mountain-echo-peaks": {
    id: "mountain-echo-peaks",
    name: "Mountain Echo Peaks",
    description: "High altitude atmosphere with echoes and crisp mountain air",
    category: "atmospheric",
    tags: ["mountain", "echo", "peaks", "altitude", "crisp"],
    useCase: "Mountain scenes, high altitude environments, echo effects, majestic landscapes",
    fields: {
      sound_effects: "mountain echoes and wind through peaks",
      background_audio: "high altitude ambiance with natural reverb",
      audio_mood: "majestic",
      environment_audio: "towering peaks with crystal clear mountain air"
    },
    customDetails: "Majestic mountain atmosphere with natural echoes, crisp high-altitude air, and the profound silence of towering peaks"
  },

  "underwater-depths": {
    id: "underwater-depths",
    name: "Underwater Depths",
    description: "Mysterious underwater atmosphere with muffled sounds and pressure",
    category: "atmospheric",
    tags: ["underwater", "depths", "mysterious", "muffled", "pressure"],
    useCase: "Underwater scenes, diving sequences, aquatic environments, submerged atmospheres",
    fields: {
      sound_effects: "muffled underwater acoustics and bubble sounds",
      background_audio: "deep water ambiance with pressure effects",
      audio_mood: "mysterious",
      environment_audio: "submerged environment with aquatic resonance"
    },
    customDetails: "Mysterious underwater atmosphere with muffled acoustics, distant whale songs, and the pressure-laden silence of ocean depths"
  },

  "creaky-old-house": {
    id: "creaky-old-house",
    name: "Creaky Old House",
    description: "Atmospheric old building sounds with creaks, settling, and history",
    category: "atmospheric",
    tags: ["old", "house", "creaky", "settling", "historic"],
    useCase: "Old building scenes, historic atmospheres, haunted house vibes, aged environments",
    fields: {
      sound_effects: "wood creaking and house settling sounds",
      background_audio: "old building ambiance with structural sounds",
      audio_mood: "eerie",
      environment_audio: "aged building with decades of accumulated atmosphere"
    },
    customDetails: "Atmospheric old house with creaking floorboards, settling walls, and the accumulated sonic history of decades past"
  },

  "library-quiet-study": {
    id: "library-quiet-study",
    name: "Library Quiet Study",
    description: "Hushed library atmosphere with subtle page turns and whispers",
    category: "atmospheric",
    tags: ["library", "quiet", "study", "hushed", "academic"],
    useCase: "Study scenes, library environments, quiet moments, academic atmospheres",
    fields: {
      sound_effects: "gentle page turning and subtle footsteps",
      background_audio: "quiet library ambiance with distant whispers",
      audio_mood: "contemplative",
      environment_audio: "scholarly atmosphere with respectful silence"
    },
    customDetails: "Peaceful library atmosphere with gentle page rustling, soft footsteps, and the contemplative silence of dedicated study"
  },

  "factory-industrial-hum": {
    id: "factory-industrial-hum",
    name: "Factory Industrial Hum",
    description: "Mechanical industrial atmosphere with machinery and rhythmic processes",
    category: "atmospheric",
    tags: ["factory", "industrial", "machinery", "mechanical", "rhythmic"],
    useCase: "Industrial scenes, factory environments, mechanical atmospheres, working environments",
    fields: {
      sound_effects: "machinery hum and industrial processes",
      background_audio: "factory ambiance with rhythmic mechanical sounds",
      audio_mood: "productive",
      environment_audio: "busy industrial facility with constant mechanical activity"
    },
    customDetails: "Dynamic industrial atmosphere with machinery humming, conveyor belts moving, and the rhythmic pulse of productive manufacturing"
  },

  "campfire-night-wilderness": {
    id: "campfire-night-wilderness",
    name: "Campfire Night Wilderness",
    description: "Cozy campfire atmosphere with crackling flames and night sounds",
    category: "atmospheric",
    tags: ["campfire", "night", "wilderness", "crackling", "cozy"],
    useCase: "Camping scenes, outdoor nights, cozy gatherings, wilderness atmospheres",
    fields: {
      sound_effects: "crackling campfire and distant night sounds",
      background_audio: "wilderness night ambiance with fire warmth",
      audio_mood: "cozy",
      environment_audio: "intimate campfire gathering in natural wilderness"
    },
    customDetails: "Intimate campfire atmosphere with crackling flames, distant owl calls, and the cozy warmth of fire in the wilderness night"
  },

  "hospital-corridor-sterile": {
    id: "hospital-corridor-sterile",
    name: "Hospital Corridor Sterile",
    description: "Clinical hospital atmosphere with medical equipment and sterile ambiance",
    category: "atmospheric",
    tags: ["hospital", "clinical", "sterile", "medical", "corridor"],
    useCase: "Hospital scenes, medical environments, clinical atmospheres, healthcare settings",
    fields: {
      sound_effects: "medical equipment beeps and footsteps on linoleum",
      background_audio: "sterile hospital ambiance with distant medical activity",
      audio_mood: "clinical",
      environment_audio: "professional medical facility with sterile efficiency"
    },
    customDetails: "Clinical hospital atmosphere with rhythmic beeping, soft-soled footsteps, and the sterile efficiency of modern medical care"
  },

  "spaceship-bridge-hum": {
    id: "spaceship-bridge-hum",
    name: "Spaceship Bridge Hum",
    description: "Futuristic spacecraft atmosphere with electronic systems and space ambiance",
    category: "atmospheric",
    tags: ["spaceship", "futuristic", "electronic", "systems", "space"],
    useCase: "Sci-fi scenes, spaceship environments, futuristic atmospheres, space travel",
    fields: {
      sound_effects: "electronic systems and spaceship operations",
      background_audio: "futuristic spacecraft ambiance with system hums",
      audio_mood: "futuristic",
      environment_audio: "advanced spacecraft with sophisticated electronic systems"
    },
    customDetails: "Advanced spacecraft atmosphere with electronic system hums, computer interfaces, and the technological ambiance of space exploration"
  },

  // COMEDY/QUIRKY PRESETS (12 presets)
  "cartoon-sound-effects": {
    id: "cartoon-sound-effects",
    name: "Cartoon Sound Effects",
    description: "Classic cartoon sounds with exaggerated comedic timing",
    category: "comedy",
    tags: ["cartoon", "comedy", "exaggerated", "classic", "animated"],
    useCase: "Comedy scenes, animated content, slapstick humor, cartoon parodies",
    fields: {
      sound_effects: "cartoon boinks, pops, and comedic sound effects",
      audio_mood: "playful",
      background_audio: "whimsical cartoon atmosphere with bouncy sounds"
    },
    customDetails: "Classic animated comedy with exaggerated boinks, pops, whistles, and the timeless sound language of cartoon humor"
  },

  "sitcom-laugh-track": {
    id: "sitcom-laugh-track",
    name: "Sitcom Laugh Track",
    description: "Traditional sitcom atmosphere with audience laughter and comedic timing",
    category: "comedy",
    tags: ["sitcom", "laugh-track", "audience", "television", "comedic"],
    useCase: "Comedy shows, sitcom content, television parodies, audience comedy",
    fields: {
      sound_effects: "audience laughter and applause",
      audio_mood: "humorous",
      background_audio: "sitcom studio atmosphere with live audience reactions"
    },
    customDetails: "Classic sitcom atmosphere with well-timed audience laughter, applause, and the warm communal feeling of shared comedy"
  },

  "quirky-indie-comedy": {
    id: "quirky-indie-comedy",
    name: "Quirky Indie Comedy",
    description: "Offbeat, whimsical sounds for indie comedy and quirky moments",
    category: "comedy",
    tags: ["quirky", "indie", "whimsical", "offbeat", "unique"],
    useCase: "Indie comedy, quirky characters, whimsical moments, art house humor",
    fields: {
      sound_effects: "quirky instrumental sounds and unique textures",
      audio_mood: "whimsical",
      background_audio: "indie comedy atmosphere with unexpected musical elements"
    },
    customDetails: "Whimsical indie comedy with ukulele, toy instruments, and the charming unpredictability of quirky artistic expression"
  },

  "slapstick-comedy": {
    id: "slapstick-comedy",
    name: "Slapstick Comedy",
    description: "Physical comedy sounds with exaggerated impact and timing",
    category: "comedy",
    tags: ["slapstick", "physical", "comedy", "impact", "exaggerated"],
    useCase: "Physical comedy, slapstick scenes, comedic accidents, visual humor",
    fields: {
      sound_effects: "exaggerated impacts, slaps, and physical comedy sounds",
      audio_mood: "silly",
      background_audio: "bouncy comedy atmosphere with perfectly timed physical sounds"
    },
    customDetails: "Classic slapstick comedy with exaggerated slaps, bonks, crashes, and the perfectly timed audio of physical humor"
  },

  "office-comedy-ambiance": {
    id: "office-comedy-ambiance",
    name: "Office Comedy Ambiance",
    description: "Workplace comedy atmosphere with office sounds and awkward moments",
    category: "comedy",
    tags: ["office", "workplace", "comedy", "awkward", "corporate"],
    useCase: "Office comedy, workplace humor, corporate satire, awkward social moments",
    fields: {
      sound_effects: "office equipment, keyboard typing, and phone rings",
      audio_mood: "awkward",
      background_audio: "workplace ambiance with comedic office atmosphere"
    },
    customDetails: "Workplace comedy atmosphere with copy machine sounds, awkward silences, and the subtle humor of corporate environments"
  },

  "parody-music-stingers": {
    id: "parody-music-stingers",
    name: "Parody Music Stingers",
    description: "Short musical comedy stingers for punchlines and comedic moments",
    category: "comedy",
    tags: ["parody", "stingers", "punchlines", "musical", "comedy"],
    useCase: "Comedy punchlines, parody moments, musical comedy, comedic reveals",
    fields: {
      sound_effects: "comedic musical stingers and parody themes",
      audio_mood: "humorous",
      background_audio: "comedy music with perfect timing for punchlines"
    },
    customDetails: "Sharp comedic musical stingers with perfect punchline timing, parody themes, and the musical language of humor"
  },

  "game-show-sounds": {
    id: "game-show-sounds",
    name: "Game Show Sounds",
    description: "Energetic game show atmosphere with buzzers, bells, and excitement",
    category: "comedy",
    tags: ["game-show", "buzzers", "bells", "energetic", "competition"],
    useCase: "Game show parodies, competition scenes, energetic moments, quiz atmospheres",
    fields: {
      sound_effects: "game show buzzers, bells, and victory sounds",
      audio_mood: "energetic",
      background_audio: "exciting game show atmosphere with competitive energy"
    },
    customDetails: "High-energy game show atmosphere with dramatic buzzers, victory bells, and the exciting tension of competition and prizes"
  },

  "clown-circus-comedy": {
    id: "clown-circus-comedy",
    name: "Clown Circus Comedy",
    description: "Circus comedy atmosphere with clown sounds and carnival music",
    category: "comedy",
    tags: ["clown", "circus", "carnival", "comedy", "whimsical"],
    useCase: "Circus scenes, clown comedy, carnival atmospheres, whimsical moments",
    fields: {
      sound_effects: "clown horns, circus sounds, and carnival atmosphere",
      audio_mood: "whimsical",
      background_audio: "circus comedy with carnival music and playful sounds"
    },
    customDetails: "Playful circus comedy with honking clown horns, carousel music, and the whimsical atmosphere of carnival entertainment"
  },

  "romantic-comedy-awkward": {
    id: "romantic-comedy-awkward",
    name: "Romantic Comedy Awkward",
    description: "Awkward romantic comedy atmosphere with sweet and clumsy moments",
    category: "comedy",
    tags: ["romantic", "comedy", "awkward", "sweet", "clumsy"],
    useCase: "Romantic comedy, awkward dating, sweet moments, relationship humor",
    fields: {
      sound_effects: "awkward pauses and sweet romantic comedy sounds",
      audio_mood: "sweet",
      background_audio: "romantic comedy atmosphere with charming awkwardness"
    },
    customDetails: "Charming romantic comedy with awkward pauses, sweet musical moments, and the endearing clumsiness of new love"
  },

  "action-comedy-parody": {
    id: "action-comedy-parody",
    name: "Action Comedy Parody",
    description: "Over-the-top action comedy with exaggerated heroic and comedic sounds",
    category: "comedy",
    tags: ["action", "comedy", "parody", "over-the-top", "heroic"],
    useCase: "Action comedy, hero parodies, over-the-top scenes, comedic action",
    fields: {
      sound_effects: "exaggerated action sounds with comedic timing",
      audio_mood: "heroic",
      background_audio: "action comedy atmosphere with parody heroic themes"
    },
    customDetails: "Over-the-top action comedy with exaggerated explosions, heroic fanfares, and the perfect balance of action and humor"
  },

  "internet-meme-sounds": {
    id: "internet-meme-sounds",
    name: "Internet Meme Sounds",
    description: "Modern internet culture sounds and meme-inspired audio",
    category: "comedy",
    tags: ["internet", "memes", "modern", "viral", "digital"],
    useCase: "Meme content, internet culture, viral moments, digital comedy",
    fields: {
      sound_effects: "meme-inspired sounds and internet culture audio",
      audio_mood: "viral",
      background_audio: "digital comedy atmosphere with meme culture sounds"
    },
    customDetails: "Modern internet comedy with meme-inspired sounds, viral audio clips, and the digital language of online humor culture"
  },

  "dad-joke-comedy": {
    id: "dad-joke-comedy",
    name: "Dad Joke Comedy",
    description: "Wholesome family comedy atmosphere with groan-worthy pun timing",
    category: "comedy",
    tags: ["dad-jokes", "wholesome", "family", "puns", "groan-worthy"],
    useCase: "Family comedy, dad jokes, wholesome humor, pun-based comedy",
    fields: {
      sound_effects: "wholesome comedy sounds with groan reactions",
      audio_mood: "wholesome",
      background_audio: "family-friendly comedy atmosphere with dad joke timing"
    },
    customDetails: "Wholesome family comedy with perfectly timed dad jokes, groan-inducing puns, and the warm humor of family entertainment"
  },

  // FANTASY/MAGICAL/MYTHIC PRESETS (12 presets)
  "enchanted-forest-magic": {
    id: "enchanted-forest-magic",
    name: "Enchanted Forest Magic",
    description: "Mystical forest atmosphere with magical sounds and fairy presence",
    category: "fantasy",
    tags: ["enchanted", "forest", "magic", "fairy", "mystical"],
    useCase: "Fantasy scenes, magical forests, fairy encounters, enchanted environments",
    fields: {
      sound_effects: "magical chimes and fairy sounds",
      audio_mood: "enchanted",
      background_audio: "mystical forest ambiance with magical creature sounds",
      music_style: "enchanted orchestral"
    },
    customDetails: "Mystical forest atmosphere with tinkling fairy chimes, magical creature sounds, and the otherworldly presence of ancient enchantment"
  },

  "dragon-fire-epic": {
    id: "dragon-fire-epic",
    name: "Dragon Fire Epic",
    description: "Powerful dragon atmosphere with fire breathing and epic scale",
    category: "fantasy",
    tags: ["dragon", "fire", "epic", "powerful", "mythical"],
    useCase: "Dragon scenes, epic fantasy, fire magic, mythical creature encounters",
    fields: {
      sound_effects: "dragon roars and fire breathing",
      audio_mood: "epic",
      background_audio: "powerful dragon presence with flame sounds",
      music_style: "epic fantasy orchestral"
    },
    customDetails: "Epic dragon atmosphere with thunderous roars, crackling flames, and the overwhelming presence of ancient mythical power"
  },

  "wizard-spell-casting": {
    id: "wizard-spell-casting",
    name: "Wizard Spell Casting",
    description: "Magical spell atmosphere with incantations and mystical energy",
    category: "fantasy",
    tags: ["wizard", "spells", "magic", "incantations", "mystical"],
    useCase: "Magic scenes, wizard characters, spell casting, mystical powers",
    fields: {
      sound_effects: "magical energy and spell casting sounds",
      audio_mood: "mystical",
      background_audio: "wizard laboratory atmosphere with magical ambiance",
      music_style: "mystical orchestral"
    },
    customDetails: "Mystical spell-casting atmosphere with crackling magical energy, whispered incantations, and the power of ancient wizardry"
  },

  "celtic-harp-mythology": {
    id: "celtic-harp-mythology",
    name: "Celtic Harp Mythology",
    description: "Ancient Celtic atmosphere with harp melodies and mythological presence",
    category: "fantasy",
    tags: ["celtic", "harp", "mythology", "ancient", "irish"],
    useCase: "Celtic fantasy, mythology scenes, ancient cultures, mystical traditions",
    fields: {
      sound_effects: "celtic harp and traditional instruments",
      audio_mood: "ancient",
      background_audio: "celtic mythology atmosphere with traditional melodies",
      music_style: "celtic orchestral"
    },
    customDetails: "Ancient Celtic atmosphere with haunting harp melodies, traditional instruments, and the mystical weight of mythological heritage"
  },

  "crystal-cave-resonance": {
    id: "crystal-cave-resonance",
    name: "Crystal Cave Resonance",
    description: "Magical crystal cave atmosphere with ethereal tones and resonance",
    category: "fantasy",
    tags: ["crystal", "cave", "ethereal", "resonance", "magical"],
    useCase: "Crystal caves, magical environments, ethereal scenes, mystical locations",
    fields: {
      sound_effects: "crystal resonance and ethereal tones",
      audio_mood: "ethereal",
      background_audio: "magical cave atmosphere with crystal harmonics",
      music_style: "ethereal ambient"
    },
    customDetails: "Ethereal crystal cave with resonant tones, magical harmonics, and the otherworldly beauty of living crystal formations"
  },

  "angel-heavenly-choir": {
    id: "angel-heavenly-choir",
    name: "Angel Heavenly Choir",
    description: "Divine angelic atmosphere with heavenly choir and celestial presence",
    category: "fantasy",
    tags: ["angel", "heavenly", "choir", "divine", "celestial"],
    useCase: "Angel scenes, divine moments, heavenly environments, spiritual atmospheres",
    fields: {
      sound_effects: "angelic voices and heavenly choir",
      audio_mood: "divine",
      background_audio: "celestial atmosphere with angelic presence",
      music_style: "heavenly orchestral"
    },
    customDetails: "Divine celestial atmosphere with angelic choir harmonies, heavenly reverb, and the overwhelming presence of pure spiritual light"
  },

  "demon-underworld-dark": {
    id: "demon-underworld-dark",
    name: "Demon Underworld Dark",
    description: "Dark underworld atmosphere with demonic presence and infernal sounds",
    category: "fantasy",
    tags: ["demon", "underworld", "dark", "infernal", "evil"],
    useCase: "Demon scenes, underworld environments, dark fantasy, evil atmospheres",
    fields: {
      sound_effects: "demonic growls and infernal sounds",
      audio_mood: "dark",
      background_audio: "underworld atmosphere with demonic presence",
      music_style: "dark orchestral"
    },
    customDetails: "Sinister underworld atmosphere with demonic growls, infernal flames, and the oppressive darkness of demonic realms"
  },

  "fairy-tale-wonder": {
    id: "fairy-tale-wonder",
    name: "Fairy Tale Wonder",
    description: "Whimsical fairy tale atmosphere with magical storytelling presence",
    category: "fantasy",
    tags: ["fairy-tale", "wonder", "whimsical", "storytelling", "magical"],
    useCase: "Fairy tale scenes, children's fantasy, storytelling moments, whimsical magic",
    fields: {
      sound_effects: "magical sparkles and fairy tale sounds",
      audio_mood: "whimsical",
      background_audio: "fairy tale atmosphere with storytelling magic",
      music_style: "whimsical orchestral"
    },
    customDetails: "Enchanting fairy tale atmosphere with magical sparkles, whimsical melodies, and the timeless wonder of classic storytelling"
  },

  "viking-norse-mythology": {
    id: "viking-norse-mythology",
    name: "Viking Norse Mythology",
    description: "Epic Norse atmosphere with Viking culture and mythological power",
    category: "fantasy",
    tags: ["viking", "norse", "mythology", "epic", "warriors"],
    useCase: "Viking scenes, Norse mythology, warrior culture, epic fantasy",
    fields: {
      sound_effects: "war horns and viking battle sounds",
      audio_mood: "epic",
      background_audio: "norse mythology atmosphere with warrior culture",
      music_style: "viking orchestral"
    },
    customDetails: "Epic Norse atmosphere with thunderous war horns, Viking chants, and the mythological power of ancient warrior culture"
  },

  "unicorn-pure-magic": {
    id: "unicorn-pure-magic",
    name: "Unicorn Pure Magic",
    description: "Pure magical atmosphere with unicorn presence and innocent wonder",
    category: "fantasy",
    tags: ["unicorn", "pure", "magic", "innocent", "wonder"],
    useCase: "Unicorn scenes, pure magic, innocent wonder, mystical purity",
    fields: {
      sound_effects: "pure magical tones and unicorn presence",
      audio_mood: "pure",
      background_audio: "innocent magical atmosphere with unicorn magic",
      music_style: "pure orchestral"
    },
    customDetails: "Pure magical atmosphere with crystalline tones, innocent wonder, and the untainted magic of unicorn presence and purity"
  },

  "phoenix-rebirth-fire": {
    id: "phoenix-rebirth-fire",
    name: "Phoenix Rebirth Fire",
    description: "Transformative phoenix atmosphere with rebirth fire and renewal",
    category: "fantasy",
    tags: ["phoenix", "rebirth", "fire", "transformation", "renewal"],
    useCase: "Phoenix scenes, rebirth moments, transformation sequences, renewal themes",
    fields: {
      sound_effects: "phoenix fire and rebirth sounds",
      audio_mood: "transformative",
      background_audio: "phoenix atmosphere with renewal fire",
      music_style: "transformative orchestral"
    },
    customDetails: "Transformative phoenix atmosphere with cleansing fire, rebirth energy, and the powerful cycle of death and renewal"
  },

  "ancient-temple-mystery": {
    id: "ancient-temple-mystery",
    name: "Ancient Temple Mystery",
    description: "Mysterious ancient temple atmosphere with sacred echoes and wisdom",
    category: "fantasy",
    tags: ["ancient", "temple", "mystery", "sacred", "wisdom"],
    useCase: "Temple scenes, ancient mysteries, sacred environments, wisdom quests",
    fields: {
      sound_effects: "temple echoes and ancient atmospheric sounds",
      audio_mood: "mysterious",
      background_audio: "sacred temple atmosphere with ancient wisdom",
      music_style: "ancient orchestral"
    },
    customDetails: "Sacred ancient temple with mysterious echoes, stone resonance, and the accumulated wisdom of countless generations of worship"
  }
};

// Category organization for audio presets
export const audioCategories = {
  music: {
    name: "Music Styles",
    icon: "🎵",
    presets: ["cinematic-orchestral", "ambient-electronic", "jazz-noir", "folk-acoustic", "synthwave-retro", "minimalist-piano", "world-fusion", "lo-fi-chill"]
  },
  effects: {
    name: "Sound Effects",
    icon: "🔊", 
    presets: ["urban-city", "nature-forest", "ocean-waves", "thunderstorm", "cafe-ambiance", "space-ambient"]
  },
  cinematic: {
    name: "Cinematic Score",
    icon: "🎥",
    presets: ["epic-battle-score", "suspenseful-thriller", "emotional-heartbreak", "heroic-triumph", "dark-villain-theme", "romantic-love-theme", "adventure-quest", "mystery-investigation", "chase-pursuit", "magical-wonder", "sci-fi-cosmos", "horror-dread"]
  },
  dialogue: {
    name: "Dialogue / Voice Styles",
    icon: "🗣️",
    presets: ["dramatic-monologue", "whispered-secrets", "sarcastic-wit", "authoritative-command", "nervous-stammering", "wise-narrator", "childlike-wonder", "villain-menace", "romantic-tender", "comedic-timing", "elderly-wisdom", "fast-paced-banter"]
  },
  atmospheric: {
    name: "Atmospheric / Ambient",
    icon: "🌌",
    presets: ["forest-morning-mist", "rain-on-window", "bustling-marketplace", "desert-wind-emptiness", "mountain-echo-peaks", "underwater-depths", "creaky-old-house", "library-quiet-study", "factory-industrial-hum", "campfire-night-wilderness", "hospital-corridor-sterile", "spaceship-bridge-hum"]
  },
  comedy: {
    name: "Comedy / Quirky",
    icon: "🎉",
    presets: ["cartoon-sound-effects", "sitcom-laugh-track", "quirky-indie-comedy", "slapstick-comedy", "office-comedy-ambiance", "parody-music-stingers", "game-show-sounds", "clown-circus-comedy", "romantic-comedy-awkward", "action-comedy-parody", "internet-meme-sounds", "dad-joke-comedy"]
  },
  fantasy: {
    name: "Fantasy / Magical / Mythic",
    icon: "🧙‍♂️",
    presets: ["enchanted-forest-magic", "dragon-fire-epic", "wizard-spell-casting", "celtic-harp-mythology", "crystal-cave-resonance", "angel-heavenly-choir", "demon-underworld-dark", "fairy-tale-wonder", "viking-norse-mythology", "unicorn-pure-magic", "phoenix-rebirth-fire", "ancient-temple-mystery"]
  }
};