import { randomHelpers } from './randomHelpers';

export const scenePresets = {
  // URBAN LOCATIONS (8 scenes) - City and metropolitan environments 🏙️
  "city-street-chase": {
    id: "city-street-chase",
    name: "Street Chase Scene",
    description: "High-speed pursuit through busy city streets with dynamic action",
    category: "urban",
    tags: ["street", "chase", "action", "pursuit", "urban"],
    useCase: "Action sequences, thriller content, high-energy pursuits, dynamic street scenes",
    eventType: "action",
    actionSequence: "High-speed chase weaving through traffic and pedestrians",
    fields: {
      scene: "Intense chase scene through busy city streets with random(['car', 'motorcycle', 'parkour']) pursuit",
      setting: "city street",
      time_of_day: "random(['afternoon', 'golden hour', 'night'])",
      environmental_details: "honking cars, screeching tires, and random(['crowd-screaming', 'sirens-approaching', 'glass-breaking'])",
      weather: "random(['clear', 'light-rain', 'foggy'])",
      camera_angle: "low tracking angle",
      camera_distance: "following shot",
      lens_type: "wide angle",
      depth_of_field: "deep focus",
      style: "action cinematic",
      color_palette: "high contrast urban",
      lighting_type: "harsh directional",
      motion_type: "fast tracking"
    },
    randomElements: {
      chaseType: "random(['car-chase', 'foot-chase', 'motorcycle-pursuit', 'parkour-escape'])",
      intensity: "random(['moderate', 'high', 'extreme'])",
      outcome: "random(['escape-success', 'capture', 'crash', 'narrow-miss'])"
    },
    customDetails: "High-octane chase sequence with vehicles weaving through traffic, people diving for cover, and the adrenaline-pumping energy of urban pursuit"
  },

  "rooftop-confrontation": {
    id: "rooftop-confrontation",
    name: "Rooftop Confrontation",
    description: "Dramatic rooftop meeting with city skyline backdrop and high emotional stakes",
    category: "urban",
    tags: ["rooftop", "confrontation", "drama", "elevated", "tension"],
    useCase: "Dramatic scenes, confrontational content, high-stakes meetings, climactic moments",
    eventType: "drama",
    actionSequence: "Tense confrontation on rooftop with city as witness",
    fields: {
      scene: "Dramatic rooftop confrontation with random(['confession', 'betrayal', 'proposal', 'ultimatum']) against city skyline",
      setting: "rooftop",
      time_of_day: "random(['golden-hour', 'night', 'stormy-sunset'])",
      environmental_details: "random(['wind-picking-up', 'city-noise-below', 'helicopter-circling', 'thunder-approaching'])",
      weather: "random(['clear-tension', 'gathering-storm', 'dramatic-clouds'])",
      camera_angle: "dynamic angles showing elevation",
      camera_distance: "medium to close-up",
      lens_type: "telephoto for compression",
      depth_of_field: "subjects sharp, city blurred",
      style: "dramatic cinematic",
      color_palette: "high contrast drama",
      lighting_type: "dramatic directional",
      motion_type: "tension-building movement"
    },
    randomElements: {
      confrontationType: "random(['love-confession', 'business-betrayal', 'family-secret', 'criminal-reveal'])",
      emotionalIntensity: "random(['building-tension', 'explosive-revelation', 'quiet-devastation'])",
      outcome: "random(['resolution', 'escalation', 'interruption', 'revelation'])"
    },
    customDetails: "High-stakes rooftop drama with the city as backdrop, perfect for climactic confrontations and life-changing moments"
  },

  "subway-station": {
    id: "subway-station",
    name: "Subway Station",
    description: "Underground transit station with commuters and urban atmosphere",
    category: "urban",
    tags: ["subway", "underground", "commuters", "transit"],
    useCase: "Urban documentary, commuter life, underground aesthetic, transportation content",
    fields: {
      scene: "Busy subway platform with arriving trains and waiting passengers",
      setting: "subway station",
      time_of_day: "rush hour",
      environmental_details: "train sounds and underground acoustics",
      weather: "indoor",
      camera_angle: "low angle",
      camera_distance: "wide shot",
      lens_type: "wide angle",
      depth_of_field: "deep focus",
      style: "gritty realistic",
      color_palette: "cool blues",
      lighting_type: "fluorescent",
      motion_type: "handheld"
    },
    customDetails: "Underground urban environment with industrial lighting, moving trains, and the constant flow of city commuters creating dynamic movement"
  },

  "shopping-mall": {
    id: "shopping-mall",
    name: "Shopping Mall",
    description: "Large indoor shopping center with stores and shoppers",
    category: "urban", 
    tags: ["mall", "shopping", "retail", "indoor"],
    useCase: "Commercial content, lifestyle shopping, consumer culture, retail environments",
    fields: {
      scene: "Multi-level shopping mall with storefronts and walking shoppers",
      setting: "shopping mall",
      time_of_day: "afternoon",
      environmental_details: "ambient mall music and crowd chatter",
      weather: "indoor climate controlled",
      camera_angle: "high angle",
      camera_distance: "wide shot",
      lens_type: "wide angle",
      depth_of_field: "deep focus",
      style: "bright commercial",
      color_palette: "bright whites",
      lighting_type: "bright fluorescent",
      motion_type: "elevated tracking"
    },
    customDetails: "Modern retail environment with gleaming storefronts, escalators, and the busy flow of shoppers throughout multiple levels"
  },

  "downtown-plaza": {
    id: "downtown-plaza",
    name: "Downtown Plaza",
    description: "Central city square with office buildings and business district energy",
    category: "urban",
    tags: ["downtown", "plaza", "business", "square"],
    useCase: "Business content, urban planning, city center documentation, professional environments",
    fields: {
      scene: "Open plaza surrounded by tall office buildings and business activity",
      setting: "downtown plaza",
      time_of_day: "mid-morning",
      environmental_details: "business professionals and urban sounds",
      weather: "partly cloudy",
      camera_angle: "eye level",
      camera_distance: "establishing shot",
      lens_type: "standard",
      depth_of_field: "deep focus",
      style: "professional",
      color_palette: "corporate blues",
      lighting_type: "overcast daylight",
      motion_type: "steady dolly"
    },
    customDetails: "Professional urban environment showcasing the heart of the business district with modern architecture and corporate activity"
  },

  "urban-alley": {
    id: "urban-alley",
    name: "Urban Alley",
    description: "Narrow city alley with brick walls and urban character",
    category: "urban",
    tags: ["alley", "brick", "narrow", "atmospheric"],
    useCase: "Artistic content, urban exploration, moody scenes, character studies",
    fields: {
      scene: "Narrow brick-lined alley with fire escapes and urban textures",
      setting: "alley",
      time_of_day: "late afternoon",
      environmental_details: "distant city sounds and echoes",
      weather: "overcast",
      camera_angle: "low angle",
      camera_distance: "medium shot",
      lens_type: "telephoto",
      depth_of_field: "shallow",
      style: "moody atmospheric",
      color_palette: "warm browns",
      lighting_type: "soft overcast",
      motion_type: "slow forward push"
    },
    customDetails: "Intimate urban setting with rich textures of aged brick, metal fire escapes, and the compressed perspective of city architecture"
  },

  "city-bridge": {
    id: "city-bridge",
    name: "City Bridge",
    description: "Urban bridge spanning river or highway with structural elements",
    category: "urban",
    tags: ["bridge", "infrastructure", "crossing", "structural"],
    useCase: "Infrastructure content, urban engineering, transition scenes, architectural focus",
    fields: {
      scene: "Modern city bridge with traffic and pedestrian walkways",
      setting: "bridge",
      time_of_day: "golden hour",
      environmental_details: "traffic flow and wind sounds",
      weather: "clear",
      camera_angle: "slight low angle",
      camera_distance: "wide shot",
      lens_type: "wide angle",
      depth_of_field: "deep focus",
      style: "architectural",
      color_palette: "steel blues",
      lighting_type: "dramatic side lighting",
      motion_type: "lateral tracking"
    },
    customDetails: "Impressive urban infrastructure with geometric steel and concrete forms creating strong leading lines and architectural drama"
  },

  "parking-garage": {
    id: "parking-garage",
    name: "Parking Garage",
    description: "Multi-level concrete parking structure with urban industrial feel",
    category: "urban",
    tags: ["parking", "concrete", "industrial", "geometric"],
    useCase: "Urban industrial aesthetic, geometric compositions, stark architectural content",
    fields: {
      scene: "Concrete parking garage with geometric columns and parked cars",
      setting: "parking garage",
      time_of_day: "afternoon",
      environmental_details: "echoing footsteps and car engines",
      weather: "covered indoor",
      camera_angle: "low angle",
      camera_distance: "wide shot", 
      lens_type: "wide angle",
      depth_of_field: "deep focus",
      style: "industrial minimalist",
      color_palette: "concrete grays",
      lighting_type: "harsh fluorescent",
      motion_type: "steady tracking"
    },
    customDetails: "Stark concrete environment with repetitive architectural elements, harsh lighting, and the geometric beauty of functional urban spaces"
  },

  // NATURE LOCATIONS (8 scenes) - Natural outdoor environments 🌲
  "beach-rescue": {
    id: "beach-rescue",
    name: "Beach Rescue Scene",
    description: "Dramatic lifeguard rescue operation in rough surf conditions",
    category: "nature",
    tags: ["beach", "rescue", "action", "heroic", "emergency"],
    useCase: "Action content, heroic moments, emergency scenarios, dramatic water scenes",
    eventType: "action",
    actionSequence: "Lifeguard rushing into dangerous waves to save swimmer",
    fields: {
      scene: "Dramatic beach rescue with lifeguard running into random(['rough-surf', 'storm-waves', 'riptide']) to save struggling swimmer",
      setting: "beach",
      time_of_day: "random(['afternoon', 'golden-hour', 'stormy-day'])",
      environmental_details: "random(['crashing-waves', 'emergency-whistles', 'crowd-gathering', 'rescue-sirens'])",
      weather: "random(['stormy', 'windy', 'rough-seas'])",
      camera_angle: "dynamic action angles",
      camera_distance: "medium to wide shots",
      lens_type: "telephoto compression",
      depth_of_field: "subject focus",
      style: "heroic action",
      color_palette: "dramatic ocean blues",
      lighting_type: "dramatic natural",
      motion_type: "fast tracking"
    },
    randomElements: {
      emergencyType: "random(['drowning', 'riptide', 'shark-sighting', 'storm-evacuation'])",
      heroicIntensity: "random(['calm-professional', 'urgent-sprint', 'life-or-death'])",
      outcome: "random(['successful-rescue', 'narrow-escape', 'team-effort'])"
    },
    customDetails: "High-stakes beach rescue with lifeguard heroically battling dangerous conditions to save someone in distress, capturing both human drama and nature's power"
  },

  "forest-path": {
    id: "forest-path",
    name: "Forest Path",
    description: "Winding trail through dense woodland with dappled sunlight",
    category: "nature",
    tags: ["forest", "trail", "trees", "woodland"],
    useCase: "Nature documentaries, hiking content, peaceful environments, natural beauty",
    fields: {
      scene: "Narrow dirt path winding through tall trees and dense foliage",
      setting: "forest",
      time_of_day: "morning",
      environmental_details: "bird songs and rustling leaves",
      weather: "partly cloudy",
      camera_angle: "eye level",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "moderate",
      style: "natural documentary",
      color_palette: "forest greens",
      lighting_type: "dappled sunlight",
      motion_type: "forward tracking"
    },
    customDetails: "Serene woodland environment with filtered light creating patterns through the canopy, moss-covered ground, and the peaceful sounds of nature"
  },

  "mountain-peak": {
    id: "mountain-peak",
    name: "Mountain Peak",
    description: "High altitude mountain summit with panoramic valley views",
    category: "nature",
    tags: ["mountain", "peak", "summit", "panoramic"],
    useCase: "Adventure content, achievement moments, landscape photography, outdoor recreation",
    fields: {
      scene: "Rocky mountain summit with sweeping views of valleys below",
      setting: "mountains",
      time_of_day: "sunrise",
      environmental_details: "wind and distant echoes",
      weather: "clear",
      camera_angle: "high angle",
      camera_distance: "establishing shot",
      lens_type: "wide angle",
      depth_of_field: "deep focus",
      style: "epic landscape",
      color_palette: "earth tones",
      lighting_type: "dramatic sunrise",
      motion_type: "slow aerial-style"
    },
    customDetails: "Majestic high-altitude environment with rugged rock formations, thin air clarity, and vast panoramic vistas stretching to the horizon"
  },

  "lake-shore": {
    id: "lake-shore",
    name: "Lake Shore",
    description: "Peaceful lakeside with calm water and natural shoreline",
    category: "nature",
    tags: ["lake", "water", "shore", "peaceful"],
    useCase: "Tranquil content, reflection scenes, meditation visuals, calm nature content",
    fields: {
      scene: "Calm lake with gentle lapping waves against natural shoreline",
      setting: "lake",
      time_of_day: "sunset",
      environmental_details: "gentle water sounds and evening birdsong",
      weather: "calm",
      camera_angle: "low angle",
      camera_distance: "wide shot",
      lens_type: "standard",
      depth_of_field: "deep focus",
      style: "serene natural",
      color_palette: "sunset oranges",
      lighting_type: "warm sunset",
      motion_type: "subtle drift"
    },
    customDetails: "Tranquil lakeside setting with mirror-like water reflections, gentle shoreline, and the peaceful transition from day to evening"
  },

  "desert-landscape": {
    id: "desert-landscape", 
    name: "Desert Landscape",
    description: "Vast desert expanse with sand dunes and arid beauty",
    category: "nature",
    tags: ["desert", "sand", "dunes", "arid"],
    useCase: "Dramatic landscapes, isolation themes, natural extremes, adventure content",
    fields: {
      scene: "Rolling sand dunes extending to distant horizon",
      setting: "desert",
      time_of_day: "late afternoon",
      environmental_details: "wind-blown sand and vast silence",
      weather: "clear",
      camera_angle: "low angle",
      camera_distance: "wide shot",
      lens_type: "telephoto",
      depth_of_field: "deep focus",
      style: "dramatic natural",
      color_palette: "warm sand tones",
      lighting_type: "harsh directional",
      motion_type: "slow push forward"
    },
    customDetails: "Stark desert environment with flowing sand formations, intense heat shimmer, and the profound silence of vast open spaces"
  },

  "waterfall": {
    id: "waterfall",
    name: "Waterfall",
    description: "Cascading waterfall with mist and surrounding vegetation",
    category: "nature",
    tags: ["waterfall", "cascade", "mist", "rocks"],
    useCase: "Nature power demonstrations, refreshing content, natural beauty, outdoor adventure",
    fields: {
      scene: "Powerful waterfall cascading over rocks into pool below",
      setting: "waterfall",
      time_of_day: "afternoon",
      environmental_details: "thundering water and mist spray",
      weather: "humid",
      camera_angle: "low angle looking up",
      camera_distance: "medium shot",
      lens_type: "wide angle",
      depth_of_field: "deep focus",
      style: "dynamic natural",
      color_palette: "fresh blues",
      lighting_type: "filtered through mist",
      motion_type: "slow motion capture"
    },
    customDetails: "Powerful natural feature with cascading water creating mist and rainbows, surrounded by lush vegetation and the constant sound of falling water"
  },

  "cave-entrance": {
    id: "cave-entrance",
    name: "Cave Entrance",
    description: "Rocky cave opening with mysterious depths and natural formations",
    category: "nature",
    tags: ["cave", "rock", "mysterious", "geological"],
    useCase: "Mystery content, geological features, exploration themes, natural formations",
    fields: {
      scene: "Dark cave entrance framed by weathered rock formations",
      setting: "cave",
      time_of_day: "afternoon",
      environmental_details: "echoing sounds and cool air flow",
      weather: "shaded",
      camera_angle: "eye level",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "deep focus",
      style: "mysterious natural",
      color_palette: "earth browns",
      lighting_type: "dramatic contrast",
      motion_type: "slow approach"
    },
    customDetails: "Mysterious geological formation with dramatic light contrast between bright exterior and dark interior, creating sense of discovery and exploration"
  },

  "meadow-field": {
    id: "meadow-field",
    name: "Meadow Field",
    description: "Open grass meadow with wildflowers and gentle rolling hills",
    category: "nature",
    tags: ["meadow", "grass", "flowers", "pastoral"],
    useCase: "Peaceful content, pastoral scenes, natural beauty, relaxation visuals",
    fields: {
      scene: "Rolling meadow filled with wildflowers and tall grass",
      setting: "meadow",
      time_of_day: "morning",
      environmental_details: "gentle breeze and insect sounds",
      weather: "partly sunny",
      camera_angle: "eye level",
      camera_distance: "wide shot",
      lens_type: "standard",
      depth_of_field: "moderate",
      style: "pastoral natural",
      color_palette: "meadow greens",
      lighting_type: "soft morning light",
      motion_type: "gentle breeze movement"
    },
    customDetails: "Idyllic pastoral setting with swaying grasses, colorful wildflowers, and gentle rolling terrain creating perfect peaceful countryside atmosphere"
  },

  // INDOOR LOCATIONS (7 scenes) - Interior spaces and buildings 🏠
  "coffee-shop": {
    id: "coffee-shop",
    name: "Coffee Shop",
    description: "Cozy cafe with warm lighting and comfortable seating",
    category: "indoor",
    tags: ["cafe", "cozy", "social", "warm"],
    useCase: "Lifestyle content, social scenes, work environments, casual meetings",
    fields: {
      scene: "Warm coffee shop with customers at tables and barista behind counter",
      setting: "coffee shop",
      time_of_day: "morning",
      environmental_details: "coffee machine sounds and soft conversation",
      weather: "indoor comfortable",
      camera_angle: "eye level",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "shallow",
      style: "warm lifestyle",
      color_palette: "warm browns",
      lighting_type: "warm ambient",
      motion_type: "subtle handheld"
    },
    customDetails: "Inviting cafe atmosphere with rich coffee aromas, comfortable seating areas, and the gentle buzz of social interaction"
  },

  "library": {
    id: "library",
    name: "Library",
    description: "Quiet library with tall bookshelves and reading areas",
    category: "indoor",
    tags: ["books", "quiet", "study", "academic"],
    useCase: "Educational content, quiet study scenes, academic environments, intellectual pursuits",
    fields: {
      scene: "Tall bookshelves with reading tables and soft overhead lighting",
      setting: "library",
      time_of_day: "afternoon",
      environmental_details: "quiet whispers and page turning",
      weather: "indoor climate controlled",
      camera_angle: "slight high angle",
      camera_distance: "wide shot",
      lens_type: "standard",
      depth_of_field: "deep focus",
      style: "academic peaceful",
      color_palette: "warm neutrals",
      lighting_type: "soft overhead",
      motion_type: "slow dolly"
    },
    customDetails: "Serene academic environment with towering book collections, comfortable reading spaces, and the hushed atmosphere of learning and contemplation"
  },

  "gym-workout": {
    id: "gym-workout",
    name: "Gym Workout",
    description: "Modern fitness center with equipment and active atmosphere",
    category: "indoor",
    tags: ["fitness", "exercise", "equipment", "active"],
    useCase: "Fitness content, health and wellness, workout demonstrations, active lifestyle",
    fields: {
      scene: "Modern gym with weight equipment and people exercising",
      setting: "gym",
      time_of_day: "evening",
      environmental_details: "equipment sounds and energetic music",
      weather: "indoor air conditioned",
      camera_angle: "low angle",
      camera_distance: "medium shot",
      lens_type: "wide angle",
      depth_of_field: "moderate",
      style: "dynamic energetic",
      color_palette: "bold primaries",
      lighting_type: "bright fluorescent",
      motion_type: "dynamic movement"
    },
    customDetails: "High-energy fitness environment with modern equipment, motivational atmosphere, and the focused intensity of people pursuing their health goals"
  },

  "restaurant-dining": {
    id: "restaurant-dining",
    name: "Restaurant Dining",
    description: "Upscale restaurant with elegant table settings and ambiance",
    category: "indoor",
    tags: ["dining", "restaurant", "elegant", "culinary"],
    useCase: "Food content, dining experiences, culinary showcases, social dining",
    fields: {
      scene: "Elegant restaurant dining room with set tables and ambient lighting",
      setting: "restaurant",
      time_of_day: "evening",
      environmental_details: "soft conversation and clinking dishes",
      weather: "indoor comfortable",
      camera_angle: "eye level",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "shallow",
      style: "elegant atmospheric",
      color_palette: "warm gold",
      lighting_type: "intimate warm",
      motion_type: "smooth gliding"
    },
    customDetails: "Sophisticated dining atmosphere with carefully crafted ambiance, elegant table settings, and the refined energy of culinary experiences"
  },

  "office-workspace": {
    id: "office-workspace",
    name: "Office Workspace",
    description: "Modern office environment with desks and professional activity",
    category: "indoor",
    tags: ["office", "work", "professional", "business"],
    useCase: "Business content, professional environments, workplace documentation, corporate culture",
    fields: {
      scene: "Open office workspace with desks, computers, and working professionals",
      setting: "office",
      time_of_day: "mid-morning",
      environmental_details: "keyboard typing and phone conversations",
      weather: "indoor climate controlled",
      camera_angle: "slight high angle",
      camera_distance: "wide shot",
      lens_type: "standard",
      depth_of_field: "deep focus",
      style: "clean professional",
      color_palette: "corporate blues",
      lighting_type: "bright office",
      motion_type: "steady tracking"
    },
    customDetails: "Professional work environment with modern technology, collaborative spaces, and the focused energy of productive business activity"
  },

  "bedroom-intimate": {
    id: "bedroom-intimate",
    name: "Bedroom Intimate",
    description: "Cozy bedroom with soft lighting and personal atmosphere",
    category: "indoor",
    tags: ["bedroom", "intimate", "personal", "cozy"],
    useCase: "Lifestyle content, personal moments, intimate scenes, home environments",
    fields: {
      scene: "Comfortable bedroom with soft bedding and warm personal touches",
      setting: "bedroom",
      time_of_day: "early morning",
      environmental_details: "quiet stillness and soft fabric sounds",
      weather: "indoor comfortable",
      camera_angle: "eye level",
      camera_distance: "close-up",
      lens_type: "standard",
      depth_of_field: "shallow",
      style: "intimate natural",
      color_palette: "soft pastels",
      lighting_type: "soft natural window",
      motion_type: "gentle slow motion"
    },
    customDetails: "Personal intimate space with soft textures, warm lighting, and the peaceful quiet of private moments and restful environments"
  },

  "kitchen-cooking": {
    id: "kitchen-cooking",
    name: "Kitchen Cooking",
    description: "Active kitchen with cooking preparation and culinary activity",
    category: "indoor",
    tags: ["kitchen", "cooking", "culinary", "preparation"],
    useCase: "Food preparation, cooking shows, culinary content, domestic scenes",
    fields: {
      scene: "Busy kitchen with cooking preparation and steaming pans",
      setting: "kitchen",
      time_of_day: "dinner time",
      environmental_details: "sizzling sounds and cooking aromas",
      weather: "indoor warm",
      camera_angle: "overhead",
      camera_distance: "close-up",
      lens_type: "macro",
      depth_of_field: "shallow",
      style: "dynamic culinary",
      color_palette: "warm food tones",
      lighting_type: "task lighting",
      motion_type: "quick cuts"
    },
    customDetails: "Dynamic culinary environment with active food preparation, aromatic steam, and the energetic rhythm of cooking and meal creation"
  },

  // MEME TEMPLATES (20 scenes) - Popular internet memes for viral content 😂
  "distracted-boyfriend": {
    id: "distracted-boyfriend",
    name: "Distracted Boyfriend Meme",
    description: "Person walking with partner but turning to look at something else",
    category: "meme",
    tags: ["meme", "choice", "distraction", "viral", "relationship"],
    useCase: "Viral content, choice comparisons, relationship humor, decision-making content",
    memeFormat: "classic-three-person",
    fields: {
      scene: "Person walking with companion but dramatically turning to look at random(['new-opportunity', 'tempting-offer', 'shiny-object', 'competitor'])",
      setting: "random(['street', 'mall', 'office', 'park'])",
      time_of_day: "random(['afternoon', 'morning', 'evening'])",
      environmental_details: "random(['busy-crowd', 'quiet-space', 'professional-setting'])",
      weather: "clear",
      camera_angle: "side angle capturing all three subjects",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "all subjects in focus",
      style: "meme-perfect clarity",
      color_palette: "bright and clear",
      lighting_type: "even natural light",
      motion_type: "frozen moment"
    },
    memeContext: "choosing between loyalty and temptation",
    viralElements: ["dramatic-turn", "pointing-gesture", "shocked-expression"],
    customDetails: "Classic meme setup with person torn between current commitment and new attractive option, perfect for viral choice-based content"
  },

  "woman-yelling-cat": {
    id: "woman-yelling-cat",
    name: "Woman Yelling at Cat",
    description: "Split scene with angry person pointing and confused subject defending",
    category: "meme",
    tags: ["meme", "argument", "confusion", "viral", "confrontation"],
    useCase: "Argument scenarios, accusation content, confusion humor, confrontational memes",
    memeFormat: "split-screen-confrontation",
    fields: {
      scene: "Split screen with angry person pointing accusingly at confused subject who looks random(['innocent', 'bewildered', 'defensive'])",
      setting: "random(['kitchen', 'living-room', 'office', 'restaurant'])",
      time_of_day: "random(['afternoon', 'evening', 'morning'])",
      environmental_details: "tense atmosphere with random(['background-chaos', 'witnesses-watching', 'awkward-silence'])",
      weather: "indoor",
      camera_angle: "split screen perspective",
      camera_distance: "medium close-up",
      lens_type: "standard",
      depth_of_field: "subjects in sharp focus",
      style: "dramatic confrontation",
      color_palette: "contrasting emotions",
      lighting_type: "dramatic indoor",
      motion_type: "static tension"
    },
    memeContext: "accusation met with confused innocence",
    viralElements: ["pointing-finger", "confused-expression", "defensive-posture"],
    randomElements: {
      accusationType: "random(['minor-offense', 'major-betrayal', 'absurd-claim'])",
      defenseStyle: "random(['total-confusion', 'guilty-innocence', 'righteous-indignation'])"
    },
    customDetails: "Perfect confrontation meme with dramatic pointing and confused defensive reaction, ideal for accusation-based viral content"
  },

  "drake-pointing": {
    id: "drake-pointing",
    name: "Drake Pointing Meme",
    description: "Person rejecting first option, enthusiastically approving second",
    category: "meme",
    tags: ["meme", "choice", "preference", "viral", "approval"],
    useCase: "Preference comparisons, choice content, approval/rejection themes, viral decision memes",
    memeFormat: "two-panel-choice",
    fields: {
      scene: "Person dramatically rejecting first option with random(['hand-wave', 'head-shake', 'disgusted-look']), then enthusiastically approving second with random(['pointing', 'thumbs-up', 'chef-kiss'])",
      setting: "random(['studio', 'office', 'home', 'public-space'])",
      time_of_day: "random(['afternoon', 'evening'])",
      environmental_details: "clean background focusing on random(['choice-presentation', 'comparison-setup', 'decision-moment'])",
      weather: "indoor controlled",
      camera_angle: "straight-on profile",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "subject in focus",
      style: "clean meme format",
      color_palette: "bold and clear",
      lighting_type: "even studio lighting",
      motion_type: "two-beat gesture sequence"
    },
    memeContext: "clear preference demonstration",
    viralElements: ["rejection-gesture", "approval-gesture", "confident-expression"],
    customDetails: "Classic preference meme with clear rejection of first option and enthusiastic approval of second, perfect for comparison content"
  },

  "this-is-fine": {
    id: "this-is-fine",
    name: "This Is Fine Meme",
    description: "Person sitting calmly while chaos erupts around them",
    category: "meme",
    tags: ["meme", "chaos", "denial", "viral", "crisis"],
    useCase: "Crisis content, denial themes, chaos management, relatable disaster scenarios",
    memeFormat: "calm-in-chaos",
    fields: {
      scene: "Person sitting calmly with forced smile while random(['small-fires', 'complete-chaos', 'workplace-disaster', 'relationship-drama']) erupts around them",
      setting: "random(['office', 'home', 'coffee-shop', 'meeting-room'])",
      time_of_day: "random(['morning', 'afternoon', 'late-night'])",
      environmental_details: "random(['smoke-filling-room', 'alarms-blaring', 'people-panicking', 'systems-failing'])",
      weather: "indoor crisis",
      camera_angle: "straight-on showing contrast",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "person in focus, chaos around",
      style: "surreal calm",
      color_palette: "warm subject, chaotic background",
      lighting_type: "calm spot lighting with chaotic background",
      motion_type: "static calm amid movement"
    },
    memeContext: "denial or acceptance of uncontrollable disaster",
    viralElements: ["forced-smile", "contrasting-calm", "background-chaos"],
    randomElements: {
      chaosLevel: "random(['minor-inconvenience', 'major-disaster', 'apocalyptic-scenario'])",
      calmLevel: "random(['slight-tension', 'forced-serenity', 'complete-dissociation'])"
    },
    customDetails: "Iconic meme showing person maintaining composure while everything falls apart, perfect for crisis denial content"
  },

  "surprised-pikachu": {
    id: "surprised-pikachu",
    name: "Surprised Pikachu Reaction",
    description: "Character with exaggerated surprise at predictable consequences",
    category: "meme",
    tags: ["meme", "surprise", "reaction", "viral", "consequences"],
    useCase: "Reaction content, consequence humor, surprise themes, predictable outcome memes",
    memeFormat: "shocked-reaction",
    fields: {
      scene: "Character with exaggerated surprise expression reacting to random(['obvious-outcome', 'predictable-consequence', 'inevitable-result'])",
      setting: "random(['anywhere', 'office', 'home', 'public'])",
      time_of_day: "random(['any-time'])",
      environmental_details: "aftermath of random(['poor-decision', 'ignored-warning', 'obvious-mistake'])",
      weather: "any",
      camera_angle: "close-up on expression",
      camera_distance: "close-up",
      lens_type: "standard",
      depth_of_field: "face in sharp focus",
      style: "exaggerated reaction",
      color_palette: "bright and clear",
      lighting_type: "clear facial lighting",
      motion_type: "frozen surprise moment"
    },
    memeContext: "shock at predictable consequences",
    viralElements: ["wide-eyes", "open-mouth", "genuine-surprise"],
    randomElements: {
      surpriseIntensity: "random(['mild-shock', 'jaw-drop', 'complete-disbelief', 'existential-crisis'])",
      predictability: "random(['somewhat-obvious', 'completely-obvious', 'warned-about-it'])"
    },
    customDetails: "Perfect surprised reaction to consequences that should have been obvious, ideal for 'what did you expect' content"
  },

  "expanding-brain": {
    id: "expanding-brain",
    name: "Expanding Brain Meme",
    description: "Four-panel progression from basic to galaxy-brain thinking",
    category: "meme",
    tags: ["meme", "intelligence", "progression", "viral", "evolution"],
    useCase: "Intelligence progression, idea evolution, complexity scaling, thought development",
    memeFormat: "four-panel-progression",
    fields: {
      scene: "Four-panel sequence showing progression from random(['basic-thought', 'simple-idea']) to random(['galaxy-brain', 'cosmic-intelligence', 'transcendent-wisdom'])",
      setting: "clean progression layout",
      time_of_day: "timeless",
      environmental_details: "increasing cosmic energy and random(['brain-glow', 'thought-particles', 'intelligence-aura'])",
      weather: "conceptual space",
      camera_angle: "consistent framing across panels",
      camera_distance: "medium shot progression",
      lens_type: "standard clarity",
      depth_of_field: "all panels equally sharp",
      style: "ascending intelligence visualization",
      color_palette: "evolving from simple to cosmic",
      lighting_type: "increasing luminosity",
      motion_type: "panel-to-panel evolution"
    },
    memeContext: "escalating intelligence or absurdity levels",
    viralElements: ["brain-expansion", "cosmic-glow", "progression-clarity"],
    randomElements: {
      progressionType: "random(['logical-evolution', 'absurd-escalation', 'philosophical-ascension'])",
      finalStage: "random(['galaxy-brain', 'cosmic-consciousness', 'meme-transcendence'])"
    },
    customDetails: "Classic intelligence progression meme showing evolution from basic to cosmic-level thinking, perfect for idea development content"
  },

  "two-buttons": {
    id: "two-buttons",
    name: "Two Buttons Dilemma",
    description: "Person sweating over impossible choice between two difficult options",
    category: "meme",
    tags: ["meme", "choice", "dilemma", "viral", "pressure"],
    useCase: "Difficult decisions, moral dilemmas, impossible choices, pressure situations",
    memeFormat: "choice-pressure",
    fields: {
      scene: "Person visibly sweating and stressed while facing two buttons representing random(['impossible-choice', 'moral-dilemma', 'lose-lose-situation'])",
      setting: "decision chamber or pressure room",
      time_of_day: "moment of truth",
      environmental_details: "pressure building with random(['ticking-clock', 'watching-crowd', 'rising-stakes'])",
      weather: "internal pressure",
      camera_angle: "showing person and both options",
      camera_distance: "medium shot capturing stress",
      lens_type: "standard clear view",
      depth_of_field: "person and buttons in focus",
      style: "pressure-cooker tension",
      color_palette: "stress-inducing contrast",
      lighting_type: "harsh decision spotlight",
      motion_type: "nervous-energy"
    },
    memeContext: "impossible decision paralysis",
    viralElements: ["visible-sweat", "impossible-choice", "decision-paralysis"],
    randomElements: {
      dilemmaType: "random(['moral-conflict', 'practical-impossibility', 'absurd-choice'])",
      pressureLevel: "random(['mild-stress', 'extreme-anxiety', 'existential-crisis'])"
    },
    customDetails: "Classic decision pressure meme with visible stress over impossible choice, perfect for dilemma-based content"
  },

  "ohio-brainrot": {
    id: "ohio-brainrot",
    name: "Ohio Brainrot Scene",
    description: "Completely absurd and surreal scenario that defies logic",
    category: "meme",
    tags: ["meme", "absurd", "surreal", "viral", "chaos"],
    useCase: "Absurdist content, surreal humor, chaos memes, Gen-Z content",
    memeFormat: "reality-breaking-absurd",
    fields: {
      scene: "Completely nonsensical scenario with random(['flying-toilets', 'backwards-gravity', 'sentient-objects', 'time-loop-chaos']) and random(['dancing-furniture', 'reality-glitches', 'dimensional-rifts'])",
      setting: "reality-broken landscape",
      time_of_day: "time-has-no-meaning",
      environmental_details: "random(['physics-defying-events', 'impossible-geometry', 'reality-bugs', 'simulation-errors'])",
      weather: "random(['inside-out-rain', 'solid-air', 'liquid-wind', 'geometric-storms'])",
      camera_angle: "impossible perspectives",
      camera_distance: "reality-warped framing",
      lens_type: "dimension-bending",
      depth_of_field: "everything and nothing in focus",
      style: "peak-absurdist-chaos",
      color_palette: "reality-error-rainbow",
      lighting_type: "impossible-physics-lighting",
      motion_type: "chaos-incarnate"
    },
    memeContext: "peak internet absurdity and chaos",
    viralElements: ["reality-breaking", "impossible-events", "chaos-energy"],
    randomElements: {
      absurdityLevel: "random(['mildly-weird', 'completely-unhinged', 'reality-breaking', 'dimension-destroying'])",
      chaosType: "random(['physics-broken', 'logic-destroyed', 'reality-virus', 'simulation-crash'])"
    },
    customDetails: "Ultimate chaos meme with reality-breaking absurdity, perfect for peak internet brainrot content"
  },

  // ENTERTAINMENT VENUES (7 scenes) - Recreation and entertainment spaces 🎭
  "concert-hall": {
    id: "concert-hall",
    name: "Concert Hall",
    description: "Grand performance hall with stage and audience seating",
    category: "entertainment",
    tags: ["concert", "performance", "stage", "audience"],
    useCase: "Live performance, music content, entertainment industry, cultural events",
    fields: {
      scene: "Elegant concert hall with illuminated stage and seated audience",
      setting: "concert hall",
      time_of_day: "evening",
      environmental_details: "live music and audience applause",
      weather: "indoor climate controlled",
      camera_angle: "audience perspective",
      camera_distance: "wide shot",
      lens_type: "standard",
      depth_of_field: "deep focus",
      style: "dramatic performance",
      color_palette: "rich reds",
      lighting_type: "stage lighting",
      motion_type: "slow zoom"
    },
    customDetails: "Majestic performance venue with ornate architecture, dramatic stage lighting, and the electric energy of live entertainment"
  },

  "sports-stadium": {
    id: "sports-stadium",
    name: "Sports Stadium",
    description: "Large sports arena with field and crowded stands",
    category: "entertainment",
    tags: ["stadium", "sports", "crowd", "arena"],
    useCase: "Sports content, crowd energy, athletic events, large venue experiences",
    fields: {
      scene: "Massive stadium with playing field and packed stands of cheering fans",
      setting: "stadium",
      time_of_day: "afternoon",
      environmental_details: "crowd roar and stadium announcements",
      weather: "partly cloudy",
      camera_angle: "high angle",
      camera_distance: "establishing shot",
      lens_type: "telephoto",
      depth_of_field: "deep focus",
      style: "epic sports",
      color_palette: "team colors",
      lighting_type: "bright daylight",
      motion_type: "sweeping aerial"
    },
    customDetails: "Massive sports venue with thousands of passionate fans, expansive playing field, and the overwhelming energy of major athletic competition"
  },

  "movie-theater": {
    id: "movie-theater",
    name: "Movie Theater",
    description: "Cinema auditorium with large screen and comfortable seating",
    category: "entertainment",
    tags: ["cinema", "movie", "screen", "audience"],
    useCase: "Entertainment content, movie experiences, cinema culture, shared viewing",
    fields: {
      scene: "Dark movie theater with large glowing screen and seated audience",
      setting: "movie theater",
      time_of_day: "evening",
      environmental_details: "movie soundtrack and quiet audience",
      weather: "indoor dark",
      camera_angle: "audience perspective",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "shallow",
      style: "cinematic immersive",
      color_palette: "screen blues",
      lighting_type: "screen glow",
      motion_type: "subtle slow push"
    },
    customDetails: "Immersive cinema environment with the hypnotic glow of the big screen, comfortable seating, and the shared experience of movie magic"
  },

  "amusement-park": {
    id: "amusement-park",
    name: "Amusement Park",
    description: "Colorful theme park with rides and carnival atmosphere",
    category: "entertainment",
    tags: ["rides", "carnival", "colorful", "fun"],
    useCase: "Family content, fun experiences, colorful entertainment, joyful moments",
    fields: {
      scene: "Bright amusement park with spinning rides and excited visitors",
      setting: "amusement park",
      time_of_day: "afternoon",
      environmental_details: "ride sounds and joyful screaming",
      weather: "sunny",
      camera_angle: "eye level",
      camera_distance: "wide shot",
      lens_type: "wide angle",
      depth_of_field: "deep focus",
      style: "vibrant energetic",
      color_palette: "bright carnival",
      lighting_type: "bright cheerful",
      motion_type: "dynamic movement"
    },
    customDetails: "Exhilarating carnival environment with colorful rides, excited crowds, and the infectious energy of pure fun and entertainment"
  },

  "art-museum": {
    id: "art-museum",
    name: "Art Museum",
    description: "Gallery space with artwork displays and cultural atmosphere",
    category: "entertainment",
    tags: ["museum", "art", "gallery", "cultural"],
    useCase: "Cultural content, art appreciation, educational environments, sophisticated spaces",
    fields: {
      scene: "Elegant museum gallery with framed artwork and viewing visitors",
      setting: "art museum",
      time_of_day: "afternoon",
      environmental_details: "quiet footsteps and soft whispers",
      weather: "indoor climate controlled",
      camera_angle: "eye level",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "moderate",
      style: "sophisticated cultural",
      color_palette: "gallery whites",
      lighting_type: "soft gallery",
      motion_type: "slow contemplative"
    },
    customDetails: "Refined cultural space with carefully curated artwork, sophisticated lighting, and the quiet contemplative atmosphere of artistic appreciation"
  },

  "nightclub": {
    id: "nightclub",
    name: "Nightclub",
    description: "Energetic nightclub with DJ booth and dancing crowd",
    category: "entertainment",
    tags: ["nightclub", "dancing", "music", "nightlife"],
    useCase: "Nightlife content, party scenes, music culture, energetic social environments",
    fields: {
      scene: "Pulsing nightclub with DJ booth and dancing crowd under colored lights",
      setting: "nightclub",
      time_of_day: "late night",
      environmental_details: "thumping bass and crowd energy",
      weather: "indoor hot",
      camera_angle: "low angle",
      camera_distance: "close-up",
      lens_type: "wide angle",
      depth_of_field: "shallow",
      style: "dynamic nightlife",
      color_palette: "neon colors",
      lighting_type: "strobe and laser",
      motion_type: "rapid cutting"
    },
    customDetails: "High-energy nightlife environment with pulsing music, colorful lighting effects, and the electric atmosphere of people dancing and celebrating"
  },

  "arcade-games": {
    id: "arcade-games",
    name: "Arcade Games",
    description: "Retro arcade with gaming machines and nostalgic atmosphere",
    category: "entertainment",
    tags: ["arcade", "games", "retro", "nostalgic"],
    useCase: "Gaming content, nostalgic entertainment, retro culture, interactive fun",
    fields: {
      scene: "Retro arcade with glowing game machines and focused players",
      setting: "arcade",
      time_of_day: "evening",
      environmental_details: "game sounds and electronic music",
      weather: "indoor comfortable",
      camera_angle: "eye level",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "moderate",
      style: "retro nostalgic",
      color_palette: "neon bright",
      lighting_type: "colorful screen glow",
      motion_type: "steady tracking"
    },
    customDetails: "Nostalgic gaming environment with glowing screens, electronic sounds, and the focused concentration of players immersed in digital worlds"
  },

  // ADDITIONAL URBAN/MODERN SETTINGS (4 more presets)
  "bustling-downtown-intersection": {
    id: "bustling-downtown-intersection",
    name: "Bustling Downtown Intersection",
    description: "Busy city crossroads with traffic lights and pedestrian crossings",
    category: "urban",
    tags: ["intersection", "traffic", "crosswalk", "busy", "downtown"],
    useCase: "Urban energy, city life, traffic scenes, metropolitan atmosphere",
    fields: {
      scene: "Busy downtown intersection with pedestrians crossing and cars waiting at traffic lights",
      setting: "city intersection",
      time_of_day: "rush hour",
      environmental_details: "car horns, footsteps, and traffic signals",
      weather: "clear",
      camera_angle: "high angle overview",
      camera_distance: "wide shot",
      lens_type: "wide angle",
      depth_of_field: "deep focus",
      style: "urban documentary",
      color_palette: "high contrast city",
      lighting_type: "harsh urban daylight",
      motion_type: "dynamic city movement"
    },
    customDetails: "Dynamic urban crossroads with constant flow of people and vehicles, capturing the pulse and energy of metropolitan life"
  },

  "high-rise-office-interior": {
    id: "high-rise-office-interior",
    name: "High-Rise Office Interior",
    description: "Modern corporate office with floor-to-ceiling windows and city views",
    category: "urban",
    tags: ["office", "corporate", "high-rise", "windows", "modern"],
    useCase: "Business content, corporate environments, professional settings, modern workplace",
    fields: {
      scene: "Sleek office interior with glass walls and panoramic city views",
      setting: "corporate office",
      time_of_day: "mid-morning",
      environmental_details: "quiet productivity and distant city hum",
      weather: "clear outside",
      camera_angle: "eye level",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "office in focus, city blurred",
      style: "clean corporate",
      color_palette: "professional neutrals",
      lighting_type: "natural window light",
      motion_type: "steady professional"
    },
    customDetails: "Modern corporate environment with stunning city views, glass architecture, and the sophisticated atmosphere of high-level business"
  },

  "street-market-food-stalls": {
    id: "street-market-food-stalls",
    name: "Street Market with Food Stalls",
    description: "Vibrant outdoor market with food vendors and local atmosphere",
    category: "urban",
    tags: ["market", "food", "vendors", "street", "local"],
    useCase: "Food culture, local markets, cultural atmosphere, community gathering",
    fields: {
      scene: "Colorful street market with food stalls and browsing customers",
      setting: "street market",
      time_of_day: "afternoon",
      environmental_details: "vendor calls, sizzling food, and crowd chatter",
      weather: "partly sunny",
      camera_angle: "eye level",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "stalls in focus",
      style: "vibrant cultural",
      color_palette: "warm food colors",
      lighting_type: "natural market lighting",
      motion_type: "bustling market energy"
    },
    customDetails: "Vibrant community marketplace with aromatic food stalls, local vendors, and the authentic energy of cultural food traditions"
  },

  "construction-site-cranes": {
    id: "construction-site-cranes",
    name: "Construction Site with Cranes",
    description: "Active construction zone with towering cranes and building progress",
    category: "urban",
    tags: ["construction", "cranes", "building", "industrial", "progress"],
    useCase: "Urban development, progress themes, construction industry, growth content",
    fields: {
      scene: "Active construction site with towering cranes and workers building",
      setting: "construction site",
      time_of_day: "morning",
      environmental_details: "machinery sounds and construction activity",
      weather: "clear working conditions",
      camera_angle: "low angle looking up",
      camera_distance: "wide shot",
      lens_type: "wide angle",
      depth_of_field: "deep focus",
      style: "industrial progress",
      color_palette: "steel and concrete grays",
      lighting_type: "bright working light",
      motion_type: "construction activity"
    },
    customDetails: "Dynamic construction environment with towering cranes, active workers, and the visible progress of urban development"
  },

  // ADDITIONAL NATURE/SCENIC SETTINGS (4 more presets)
  "quiet-suburban-street-sunset": {
    id: "quiet-suburban-street-sunset",
    name: "Quiet Suburban Street at Sunset",
    description: "Peaceful residential street with houses and golden hour lighting",
    category: "nature",
    tags: ["suburban", "residential", "sunset", "peaceful", "neighborhood"],
    useCase: "Residential life, peaceful moments, neighborhood atmosphere, golden hour beauty",
    fields: {
      scene: "Tree-lined suburban street with cozy houses during golden hour",
      setting: "suburban street",
      time_of_day: "sunset",
      environmental_details: "distant lawn mowers and evening birds",
      weather: "clear",
      camera_angle: "eye level",
      camera_distance: "wide shot",
      lens_type: "standard",
      depth_of_field: "street in focus",
      style: "warm residential",
      color_palette: "golden sunset tones",
      lighting_type: "warm golden hour",
      motion_type: "peaceful stillness"
    },
    customDetails: "Tranquil residential neighborhood with tree-lined streets, cozy homes, and the warm golden glow of evening light"
  },

  "coffee-shop-rainy-day": {
    id: "coffee-shop-rainy-day",
    name: "Coffee Shop on a Rainy Day",
    description: "Cozy cafe interior with rain-streaked windows and warm atmosphere",
    category: "nature",
    tags: ["coffee", "rain", "cozy", "indoor", "weather"],
    useCase: "Cozy atmosphere, rainy day moods, comfortable indoor spaces, weather ambiance",
    fields: {
      scene: "Warm coffee shop interior with customers watching rain through windows",
      setting: "coffee shop",
      time_of_day: "afternoon",
      environmental_details: "rain on windows and coffee shop ambiance",
      weather: "heavy rain outside",
      camera_angle: "eye level",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "interior in focus",
      style: "cozy atmospheric",
      color_palette: "warm browns and golds",
      lighting_type: "warm interior lighting",
      motion_type: "gentle rain movement"
    },
    customDetails: "Cozy indoor refuge with rain creating atmosphere outside, warm lighting, and the comforting sounds of coffee culture"
  },

  "urban-park-joggers": {
    id: "urban-park-joggers",
    name: "Urban Park with Joggers",
    description: "City park with running paths and recreational activities",
    category: "nature",
    tags: ["park", "jogging", "recreation", "urban", "fitness"],
    useCase: "Fitness content, urban recreation, healthy lifestyle, park activities",
    fields: {
      scene: "Green urban park with joggers on paths and recreational activities",
      setting: "city park",
      time_of_day: "early morning",
      environmental_details: "footsteps on paths and outdoor activity sounds",
      weather: "clear",
      camera_angle: "eye level",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "joggers in focus",
      style: "healthy lifestyle",
      color_palette: "fresh greens",
      lighting_type: "fresh morning light",
      motion_type: "running movement"
    },
    customDetails: "Active urban green space with joggers, recreational activities, and the healthy energy of people enjoying outdoor fitness"
  },

  "trendy-art-gallery-opening": {
    id: "trendy-art-gallery-opening",
    name: "Trendy Art Gallery Opening",
    description: "Modern gallery space with artistic displays and cultural gathering",
    category: "nature",
    tags: ["gallery", "art", "opening", "cultural", "modern"],
    useCase: "Art culture, gallery events, cultural gatherings, sophisticated social scenes",
    fields: {
      scene: "Contemporary art gallery with artwork displays and socializing visitors",
      setting: "art gallery",
      time_of_day: "evening",
      environmental_details: "cultured conversation and gallery ambiance",
      weather: "indoor controlled",
      camera_angle: "eye level",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "gallery and people in focus",
      style: "sophisticated cultural",
      color_palette: "gallery whites with art accents",
      lighting_type: "refined gallery lighting",
      motion_type: "cultured social movement"
    },
    customDetails: "Sophisticated cultural environment with contemporary art, refined lighting, and the intellectual energy of art appreciation"
  },

  // HISTORICAL/FANTASY SETTINGS (12 presets)
  "medieval-castle-courtyard": {
    id: "medieval-castle-courtyard",
    name: "Medieval Castle Courtyard",
    description: "Ancient stone castle with towering walls and medieval architecture",
    category: "historical",
    tags: ["medieval", "castle", "stone", "ancient", "fortress"],
    useCase: "Historical content, medieval themes, fantasy settings, ancient architecture",
    fields: {
      scene: "Imposing castle courtyard with stone walls and medieval atmosphere",
      setting: "castle courtyard",
      time_of_day: "afternoon",
      environmental_details: "echoing footsteps and distant banner flapping",
      weather: "overcast",
      camera_angle: "low angle showing castle height",
      camera_distance: "wide shot",
      lens_type: "wide angle",
      depth_of_field: "deep focus",
      style: "epic medieval",
      color_palette: "stone grays and earth tones",
      lighting_type: "dramatic overcast",
      motion_type: "steady majestic"
    },
    customDetails: "Imposing medieval fortress with weathered stone walls, ancient architecture, and the weight of centuries of history"
  },

  "ancient-roman-forum": {
    id: "ancient-roman-forum",
    name: "Ancient Roman Forum",
    description: "Classical Roman ruins with marble columns and historical grandeur",
    category: "historical",
    tags: ["roman", "ancient", "ruins", "columns", "classical"],
    useCase: "Historical education, ancient civilizations, classical architecture, archaeological content",
    fields: {
      scene: "Majestic Roman forum ruins with marble columns and ancient stonework",
      setting: "roman forum",
      time_of_day: "golden hour",
      environmental_details: "wind through ruins and historical silence",
      weather: "clear",
      camera_angle: "eye level",
      camera_distance: "wide shot",
      lens_type: "standard",
      depth_of_field: "ruins in focus",
      style: "classical historical",
      color_palette: "marble whites and gold",
      lighting_type: "dramatic golden light",
      motion_type: "reverent slow movement"
    },
    customDetails: "Magnificent ancient Roman architecture with weathered marble columns, classical proportions, and the grandeur of lost civilization"
  },

  "viking-longship-fjord": {
    id: "viking-longship-fjord",
    name: "Viking Longship in Fjord",
    description: "Norse longship sailing through dramatic fjord landscape",
    category: "historical",
    tags: ["viking", "longship", "fjord", "norse", "sailing"],
    useCase: "Historical adventure, Norse culture, maritime history, dramatic landscapes",
    fields: {
      scene: "Viking longship with dragon prow sailing through misty fjord waters",
      setting: "fjord",
      time_of_day: "dawn",
      environmental_details: "wind in sails and water against hull",
      weather: "misty",
      camera_angle: "low angle from water level",
      camera_distance: "medium shot",
      lens_type: "telephoto",
      depth_of_field: "ship in focus",
      style: "epic viking adventure",
      color_palette: "nordic blues and grays",
      lighting_type: "dramatic dawn light",
      motion_type: "sailing through mist"
    },
    customDetails: "Legendary Norse vessel cutting through misty fjord waters with dramatic cliffs, capturing the adventurous spirit of Viking exploration"
  },

  "egyptian-pyramid-desert": {
    id: "egyptian-pyramid-desert",
    name: "Egyptian Pyramid in Desert",
    description: "Ancient pyramid rising from golden desert sands",
    category: "historical",
    tags: ["pyramid", "egyptian", "desert", "ancient", "monumental"],
    useCase: "Ancient civilizations, archaeological wonders, desert landscapes, monumental architecture",
    fields: {
      scene: "Massive pyramid structure rising from endless desert sands",
      setting: "desert pyramid",
      time_of_day: "late afternoon",
      environmental_details: "wind-blown sand and vast silence",
      weather: "clear desert",
      camera_angle: "low angle emphasizing scale",
      camera_distance: "wide shot",
      lens_type: "wide angle",
      depth_of_field: "pyramid sharp against sky",
      style: "monumental ancient",
      color_palette: "desert golds and stone",
      lighting_type: "harsh desert sun",
      motion_type: "slow reverent approach"
    },
    customDetails: "Monumental ancient architecture rising from desert sands, embodying the mystery and grandeur of Egyptian civilization"
  },

  "enchanted-fairy-forest": {
    id: "enchanted-fairy-forest",
    name: "Enchanted Fairy Forest",
    description: "Magical woodland with glowing lights and mystical atmosphere",
    category: "fantasy",
    tags: ["enchanted", "fairy", "magical", "forest", "mystical"],
    useCase: "Fantasy content, magical environments, fairy tale settings, mystical atmospheres",
    fields: {
      scene: "Mystical forest with glowing fairy lights and magical creatures",
      setting: "enchanted forest",
      time_of_day: "twilight",
      environmental_details: "magical chimes and fairy sounds",
      weather: "misty magical",
      camera_angle: "eye level through trees",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "magical depth",
      style: "fantasy magical",
      color_palette: "magical greens and golds",
      lighting_type: "soft magical glow",
      motion_type: "floating magical movement"
    },
    customDetails: "Mystical woodland environment with glowing fairy lights, magical creatures, and the otherworldly atmosphere of enchanted realms"
  },

  "dragon-mountain-lair": {
    id: "dragon-mountain-lair",
    name: "Dragon Mountain Lair",
    description: "Ancient dragon's cave filled with treasure and mystical power",
    category: "fantasy",
    tags: ["dragon", "lair", "treasure", "cave", "mountain"],
    useCase: "Fantasy adventure, dragon encounters, treasure themes, epic fantasy settings",
    fields: {
      scene: "Vast mountain cave filled with glittering treasure and dragon presence",
      setting: "dragon lair",
      time_of_day: "eternal twilight",
      environmental_details: "echoing cave sounds and treasure glints",
      weather: "cave atmosphere",
      camera_angle: "low angle showing scale",
      camera_distance: "wide shot",
      lens_type: "wide angle",
      depth_of_field: "treasure and cave in focus",
      style: "epic fantasy adventure",
      color_palette: "gold treasure and dark cave",
      lighting_type: "treasure gleam and fire glow",
      motion_type: "ominous presence"
    },
    customDetails: "Legendary dragon's hoard with glittering treasure, ancient cave architecture, and the overwhelming presence of mythical power"
  },

  "wizard-tower-library": {
    id: "wizard-tower-library",
    name: "Wizard Tower Library",
    description: "Mystical tower filled with ancient books and magical artifacts",
    category: "fantasy",
    tags: ["wizard", "tower", "library", "magic", "ancient"],
    useCase: "Magic content, wizard settings, mystical knowledge, fantasy libraries",
    fields: {
      scene: "Tall wizard tower filled with floating books and magical artifacts",
      setting: "wizard tower",
      time_of_day: "mystical time",
      environmental_details: "magical humming and floating objects",
      weather: "magical atmosphere",
      camera_angle: "looking up through tower",
      camera_distance: "wide shot",
      lens_type: "wide angle",
      depth_of_field: "magical depth",
      style: "mystical magical",
      color_palette: "magical purples and golds",
      lighting_type: "soft magical illumination",
      motion_type: "floating magical objects"
    },
    customDetails: "Mystical tower of knowledge with floating books, glowing artifacts, and the accumulated wisdom of magical ages"
  },

  "medieval-tavern-inn": {
    id: "medieval-tavern-inn",
    name: "Medieval Tavern Inn",
    description: "Cozy medieval tavern with stone hearth and rustic atmosphere",
    category: "historical",
    tags: ["tavern", "medieval", "inn", "cozy", "rustic"],
    useCase: "Medieval settings, tavern scenes, rustic atmospheres, historical hospitality",
    fields: {
      scene: "Warm medieval tavern with stone fireplace and wooden tables",
      setting: "medieval tavern",
      time_of_day: "evening",
      environmental_details: "crackling fire and jovial conversation",
      weather: "cozy indoor",
      camera_angle: "eye level",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "tavern interior in focus",
      style: "warm medieval",
      color_palette: "warm browns and firelight",
      lighting_type: "fireplace and candle glow",
      motion_type: "cozy tavern atmosphere"
    },
    customDetails: "Authentic medieval hospitality with stone hearth, wooden furnishings, and the warm community atmosphere of historical inns"
  },

  "pirate-ship-deck": {
    id: "pirate-ship-deck",
    name: "Pirate Ship Deck",
    description: "Weathered pirate vessel deck with sails and maritime adventure",
    category: "historical",
    tags: ["pirate", "ship", "deck", "maritime", "adventure"],
    useCase: "Pirate adventures, maritime history, seafaring content, nautical themes",
    fields: {
      scene: "Weathered pirate ship deck with billowing sails and ocean views",
      setting: "pirate ship",
      time_of_day: "afternoon",
      environmental_details: "creaking wood and ocean wind",
      weather: "sea breeze",
      camera_angle: "deck level",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "ship in focus",
      style: "adventure maritime",
      color_palette: "weathered wood and ocean blues",
      lighting_type: "bright ocean sun",
      motion_type: "ship movement on waves"
    },
    customDetails: "Authentic pirate vessel with weathered deck, billowing sails, and the adventurous spirit of maritime exploration"
  },

  "samurai-temple-garden": {
    id: "samurai-temple-garden",
    name: "Samurai Temple Garden",
    description: "Serene Japanese temple with traditional architecture and zen garden",
    category: "historical",
    tags: ["samurai", "temple", "japanese", "zen", "traditional"],
    useCase: "Japanese culture, zen content, traditional architecture, peaceful settings",
    fields: {
      scene: "Traditional Japanese temple with zen garden and peaceful atmosphere",
      setting: "temple garden",
      time_of_day: "early morning",
      environmental_details: "wind chimes and gentle water sounds",
      weather: "serene",
      camera_angle: "eye level",
      camera_distance: "wide shot",
      lens_type: "standard",
      depth_of_field: "garden and temple in focus",
      style: "zen peaceful",
      color_palette: "traditional japanese colors",
      lighting_type: "soft morning light",
      motion_type: "meditative stillness"
    },
    customDetails: "Tranquil Japanese temple setting with zen garden, traditional architecture, and the peaceful spirit of contemplation"
  },

  "aztec-pyramid-temple": {
    id: "aztec-pyramid-temple",
    name: "Aztec Pyramid Temple",
    description: "Ancient Mesoamerican pyramid with ceremonial architecture",
    category: "historical",
    tags: ["aztec", "pyramid", "temple", "mesoamerican", "ancient"],
    useCase: "Ancient civilizations, ceremonial content, archaeological sites, cultural heritage",
    fields: {
      scene: "Imposing Aztec pyramid temple with ceremonial steps and ancient carvings",
      setting: "aztec temple",
      time_of_day: "late afternoon",
      environmental_details: "wind through ancient stones and ceremonial echoes",
      weather: "clear",
      camera_angle: "low angle showing temple height",
      camera_distance: "wide shot",
      lens_type: "wide angle",
      depth_of_field: "temple in sharp focus",
      style: "ancient monumental",
      color_palette: "stone grays and jungle greens",
      lighting_type: "dramatic ancient light",
      motion_type: "reverent ancient presence"
    },
    customDetails: "Monumental Mesoamerican architecture with ceremonial steps, ancient carvings, and the sacred atmosphere of lost civilizations"
  },

  "elven-tree-city": {
    id: "elven-tree-city",
    name: "Elven Tree City",
    description: "Magical elven city built into ancient forest trees",
    category: "fantasy",
    tags: ["elven", "tree", "city", "magical", "forest"],
    useCase: "Fantasy content, elven culture, magical cities, tree-based architecture",
    fields: {
      scene: "Graceful elven city with buildings woven into massive ancient trees",
      setting: "elven tree city",
      time_of_day: "golden hour",
      environmental_details: "elven music and magical forest sounds",
      weather: "magical forest atmosphere",
      camera_angle: "looking up through tree city",
      camera_distance: "wide shot",
      lens_type: "wide angle",
      depth_of_field: "magical city depth",
      style: "elegant fantasy",
      color_palette: "forest greens and elven gold",
      lighting_type: "magical dappled light",
      motion_type: "graceful elven movement"
    },
    customDetails: "Elegant elven civilization integrated with ancient forest, featuring graceful architecture and the harmony of nature and magic"
  },

  // ADDITIONAL SCI-FI/FUTURISTIC SETTINGS (8 presets)
  "space-station-interior": {
    id: "space-station-interior",
    name: "Space Station Interior",
    description: "High-tech space station with curved corridors and advanced technology",
    category: "scifi",
    tags: ["space", "station", "futuristic", "technology", "interior"],
    useCase: "Sci-fi content, space exploration, futuristic technology, space habitation",
    fields: {
      scene: "Sleek space station corridor with curved walls and holographic displays",
      setting: "space station",
      time_of_day: "artificial day cycle",
      environmental_details: "humming technology and life support systems",
      weather: "controlled atmosphere",
      camera_angle: "eye level down corridor",
      camera_distance: "medium shot",
      lens_type: "wide angle",
      depth_of_field: "corridor in focus",
      style: "futuristic clean",
      color_palette: "cool blues and whites",
      lighting_type: "soft LED lighting",
      motion_type: "floating zero gravity"
    },
    customDetails: "Advanced space habitat with curved architecture, holographic interfaces, and the contained atmosphere of human space exploration"
  },

  "cyberpunk-street-neon": {
    id: "cyberpunk-street-neon",
    name: "Cyberpunk Street with Neon",
    description: "Rain-soaked cyberpunk street with neon signs and futuristic atmosphere",
    category: "scifi",
    tags: ["cyberpunk", "neon", "rain", "futuristic", "street"],
    useCase: "Cyberpunk content, futuristic dystopia, neon aesthetics, urban sci-fi",
    fields: {
      scene: "Rain-soaked street with towering neon signs and cyberpunk atmosphere",
      setting: "cyberpunk street",
      time_of_day: "night",
      environmental_details: "rain on neon and distant city hum",
      weather: "light rain",
      camera_angle: "low angle looking up",
      camera_distance: "wide shot",
      lens_type: "wide angle",
      depth_of_field: "street and neon in focus",
      style: "cyberpunk noir",
      color_palette: "neon colors and rain reflections",
      lighting_type: "neon lighting",
      motion_type: "rain and neon flicker"
    },
    customDetails: "Dystopian future cityscape with towering neon advertisements, rain-slicked streets, and the gritty atmosphere of cyberpunk noir"
  },

  "alien-planet-landscape": {
    id: "alien-planet-landscape",
    name: "Alien Planet Landscape",
    description: "Exotic alien world with strange formations and otherworldly atmosphere",
    category: "scifi",
    tags: ["alien", "planet", "otherworldly", "exotic", "landscape"],
    useCase: "Sci-fi exploration, alien worlds, exotic landscapes, space exploration",
    fields: {
      scene: "Alien landscape with bizarre rock formations and strange atmospheric effects",
      setting: "alien planet",
      time_of_day: "alien sunset",
      environmental_details: "strange atmospheric sounds and alien wind",
      weather: "alien atmosphere",
      camera_angle: "wide vista angle",
      camera_distance: "wide shot",
      lens_type: "ultra wide",
      depth_of_field: "alien landscape in focus",
      style: "exotic alien",
      color_palette: "otherworldly colors",
      lighting_type: "alien sun lighting",
      motion_type: "otherworldly movement"
    },
    customDetails: "Extraordinary alien environment with impossible geology, strange atmospheric effects, and the wonder of discovering new worlds"
  },

  "laboratory-experiment": {
    id: "laboratory-experiment",
    name: "High-Tech Laboratory",
    description: "Advanced scientific laboratory with experiments and futuristic equipment",
    category: "scifi",
    tags: ["laboratory", "science", "experiment", "technology", "research"],
    useCase: "Scientific content, research environments, technology showcases, experimental settings",
    fields: {
      scene: "Advanced laboratory with glowing experiments and high-tech equipment",
      setting: "laboratory",
      time_of_day: "continuous work cycle",
      environmental_details: "humming equipment and bubbling experiments",
      weather: "controlled laboratory environment",
      camera_angle: "eye level through lab",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "equipment in focus",
      style: "high-tech scientific",
      color_palette: "sterile whites and glowing accents",
      lighting_type: "bright laboratory lighting",
      motion_type: "precise scientific movement"
    },
    customDetails: "Cutting-edge research facility with advanced equipment, ongoing experiments, and the focused energy of scientific discovery"
  },

  "hover-car-highway": {
    id: "hover-car-highway",
    name: "Hover Car Highway",
    description: "Futuristic transportation system with flying cars and elevated roadways",
    category: "scifi",
    tags: ["hover", "cars", "highway", "flying", "transportation"],
    useCase: "Futuristic transportation, flying vehicles, advanced infrastructure, sci-fi cityscapes",
    fields: {
      scene: "Multi-level highway system with hovering vehicles and futuristic traffic",
      setting: "hover highway",
      time_of_day: "afternoon",
      environmental_details: "humming hover engines and traffic flow",
      weather: "clear futuristic sky",
      camera_angle: "tracking with traffic",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "vehicles in focus",
      style: "sleek futuristic",
      color_palette: "metallic silvers and blues",
      lighting_type: "bright futuristic daylight",
      motion_type: "smooth hover movement"
    },
    customDetails: "Advanced transportation network with silent hovering vehicles, multi-level roadways, and the efficient flow of future mobility"
  },

  "robot-factory-assembly": {
    id: "robot-factory-assembly",
    name: "Robot Factory Assembly Line",
    description: "Automated factory with robots building advanced technology",
    category: "scifi",
    tags: ["robot", "factory", "assembly", "automation", "manufacturing"],
    useCase: "Industrial automation, robotics content, manufacturing processes, futuristic production",
    fields: {
      scene: "Vast automated factory with robot arms assembling futuristic devices",
      setting: "robot factory",
      time_of_day: "continuous operation",
      environmental_details: "mechanical whirring and assembly sounds",
      weather: "controlled industrial environment",
      camera_angle: "high angle showing assembly line",
      camera_distance: "wide shot",
      lens_type: "wide angle",
      depth_of_field: "factory floor in focus",
      style: "industrial futuristic",
      color_palette: "metallic grays and warning oranges",
      lighting_type: "bright industrial lighting",
      motion_type: "precise robotic movement"
    },
    customDetails: "Highly automated production facility with precise robot workers, efficient assembly processes, and the organized chaos of future manufacturing"
  },

  "time-portal-chamber": {
    id: "time-portal-chamber",
    name: "Time Portal Chamber",
    description: "Sci-fi laboratory with swirling time portal and advanced temporal technology",
    category: "scifi",
    tags: ["time", "portal", "chamber", "temporal", "sci-fi"],
    useCase: "Time travel content, sci-fi adventures, temporal mechanics, portal technology",
    fields: {
      scene: "High-tech chamber with swirling temporal portal and advanced control systems",
      setting: "time portal chamber",
      time_of_day: "outside normal time",
      environmental_details: "temporal energy crackling and time distortion sounds",
      weather: "temporal field disturbance",
      camera_angle: "centered on portal",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "portal in sharp focus",
      style: "advanced sci-fi",
      color_palette: "electric blues and temporal purples",
      lighting_type: "portal energy glow",
      motion_type: "swirling temporal energy"
    },
    customDetails: "Advanced temporal research facility with active time portal, crackling energy fields, and the awesome power of time manipulation technology"
  },

  "underwater-research-station": {
    id: "underwater-research-station",
    name: "Underwater Research Station",
    description: "Submerged scientific facility with ocean views and marine research",
    category: "scifi",
    tags: ["underwater", "research", "station", "ocean", "marine"],
    useCase: "Marine research, underwater exploration, oceanic science, aquatic environments",
    fields: {
      scene: "Underwater research facility with large viewing windows showing ocean life",
      setting: "underwater station",
      time_of_day: "filtered ocean light",
      environmental_details: "pressurized environment and ocean sounds",
      weather: "deep ocean currents",
      camera_angle: "through viewing windows",
      camera_distance: "medium shot",
      lens_type: "wide angle",
      depth_of_field: "station and ocean in focus",
      style: "marine scientific",
      color_palette: "ocean blues and facility whites",
      lighting_type: "filtered underwater light",
      motion_type: "floating marine life"
    },
    customDetails: "Advanced underwater research facility with panoramic ocean views, marine life observation, and the frontier atmosphere of deep sea exploration"
  },

  // ADDITIONAL ABSTRACT/SURREAL SETTINGS (10 presets)
  "floating-islands-sky": {
    id: "floating-islands-sky",
    name: "Floating Islands in Sky",
    description: "Impossible floating landmasses suspended in endless sky",
    category: "abstract",
    tags: ["floating", "islands", "sky", "impossible", "surreal"],
    useCase: "Surreal content, impossible worlds, dreamlike sequences, abstract environments",
    fields: {
      scene: "Massive floating islands suspended in infinite sky with waterfalls cascading into clouds",
      setting: "floating islands",
      time_of_day: "eternal golden hour",
      environmental_details: "wind through floating rocks and distant water sounds",
      weather: "impossible sky weather",
      camera_angle: "floating perspective",
      camera_distance: "wide shot",
      lens_type: "ultra wide",
      depth_of_field: "islands and sky in focus",
      style: "surreal dreamlike",
      color_palette: "sky blues and cloud whites",
      lighting_type: "magical sky lighting",
      motion_type: "gentle floating movement"
    },
    customDetails: "Impossible landscape with gravity-defying islands, cascading waterfalls into endless sky, and the dreamlike beauty of surreal worlds"
  },

  "mirror-maze-reflections": {
    id: "mirror-maze-reflections",
    name: "Infinite Mirror Maze",
    description: "Endless maze of mirrors creating infinite reflections and optical illusions",
    category: "abstract",
    tags: ["mirrors", "maze", "reflections", "infinite", "illusion"],
    useCase: "Abstract art, psychological content, optical illusions, mind-bending visuals",
    fields: {
      scene: "Infinite corridor of mirrors creating endless reflections and visual complexity",
      setting: "mirror maze",
      time_of_day: "timeless reflection",
      environmental_details: "echoing reflections and spatial distortion",
      weather: "controlled reflection environment",
      camera_angle: "through mirror reflections",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "infinite reflection focus",
      style: "geometric abstract",
      color_palette: "silver mirrors and light refractions",
      lighting_type: "multiple reflection lighting",
      motion_type: "reflection multiplication"
    },
    customDetails: "Mind-bending mirror environment with infinite reflections, spatial disorientation, and the hypnotic beauty of recursive imagery"
  },

  "gravity-defying-rooms": {
    id: "gravity-defying-rooms",
    name: "Gravity-Defying Architecture",
    description: "Impossible architectural spaces where gravity works in multiple directions",
    category: "abstract",
    tags: ["gravity", "architecture", "impossible", "spatial", "surreal"],
    useCase: "Surreal architecture, impossible spaces, mind-bending environments, abstract design",
    fields: {
      scene: "Impossible room where furniture exists on walls and ceiling with multiple gravity directions",
      setting: "impossible architecture",
      time_of_day: "spatial time",
      environmental_details: "objects falling in multiple directions and spatial confusion",
      weather: "controlled impossible environment",
      camera_angle: "impossible perspective",
      camera_distance: "wide shot",
      lens_type: "fisheye",
      depth_of_field: "impossible depth",
      style: "surreal architectural",
      color_palette: "neutral architecture with impossible shadows",
      lighting_type: "multi-directional lighting",
      motion_type: "impossible gravity movement"
    },
    customDetails: "Mind-bending architectural space where gravity exists in multiple directions, creating impossible room layouts and spatial confusion"
  },

  "kaleidoscope-tunnel": {
    id: "kaleidoscope-tunnel",
    name: "Kaleidoscope Tunnel",
    description: "Psychedelic tunnel with constantly shifting geometric patterns and colors",
    category: "abstract",
    tags: ["kaleidoscope", "tunnel", "psychedelic", "patterns", "geometric"],
    useCase: "Psychedelic content, geometric art, pattern design, abstract visuals",
    fields: {
      scene: "Endless tunnel with shifting kaleidoscopic patterns and brilliant colors",
      setting: "kaleidoscope tunnel",
      time_of_day: "pattern time",
      environmental_details: "shifting pattern sounds and color harmony",
      weather: "geometric pattern environment",
      camera_angle: "tunnel perspective",
      camera_distance: "medium shot",
      lens_type: "wide angle",
      depth_of_field: "pattern tunnel in focus",
      style: "psychedelic geometric",
      color_palette: "rainbow spectrum patterns",
      lighting_type: "pattern internal lighting",
      motion_type: "constant pattern shifting"
    },
    customDetails: "Hypnotic geometric environment with constantly shifting kaleidoscopic patterns, brilliant colors, and the mesmerizing beauty of abstract art"
  },

  "liquid-crystal-cavern": {
    id: "liquid-crystal-cavern",
    name: "Liquid Crystal Cavern",
    description: "Fantastical cave filled with flowing liquid crystals and prismatic light",
    category: "abstract",
    tags: ["liquid", "crystal", "cavern", "prismatic", "fantastical"],
    useCase: "Fantasy abstracts, crystal environments, magical caves, prismatic lighting",
    fields: {
      scene: "Magical cavern with flowing liquid crystals and rainbow light refractions",
      setting: "crystal cavern",
      time_of_day: "eternal crystal glow",
      environmental_details: "crystal resonance and flowing liquid sounds",
      weather: "magical crystal atmosphere",
      camera_angle: "through crystal formations",
      camera_distance: "medium shot",
      lens_type: "macro",
      depth_of_field: "crystal detail focus",
      style: "magical crystalline",
      color_palette: "prismatic rainbow crystals",
      lighting_type: "refracted crystal light",
      motion_type: "flowing liquid crystal"
    },
    customDetails: "Enchanted underground realm with flowing liquid crystals, prismatic light effects, and the otherworldly beauty of magical geology"
  },

  "dream-bubble-landscape": {
    id: "dream-bubble-landscape",
    name: "Dream Bubble Landscape",
    description: "Surreal landscape made of giant floating soap bubbles with dream imagery",
    category: "abstract",
    tags: ["dream", "bubbles", "surreal", "floating", "imagery"],
    useCase: "Dream sequences, surreal art, bubble effects, fantasy landscapes",
    fields: {
      scene: "Landscape of giant floating bubbles containing dream scenes and memories",
      setting: "dream bubble world",
      time_of_day: "dream time",
      environmental_details: "gentle bubble sounds and dream whispers",
      weather: "dream atmosphere",
      camera_angle: "floating through bubbles",
      camera_distance: "medium shot",
      lens_type: "macro to wide",
      depth_of_field: "bubble surfaces in focus",
      style: "dreamlike surreal",
      color_palette: "iridescent bubble colors",
      lighting_type: "soft dream lighting",
      motion_type: "gentle bubble floating"
    },
    customDetails: "Fantastical dream realm with floating soap bubbles containing memories and dreams, creating a surreal landscape of consciousness"
  },

  "geometric-void-space": {
    id: "geometric-void-space",
    name: "Geometric Void Space",
    description: "Abstract void filled with floating geometric shapes and mathematical precision",
    category: "abstract",
    tags: ["geometric", "void", "shapes", "mathematical", "abstract"],
    useCase: "Mathematical art, geometric design, abstract concepts, minimal art",
    fields: {
      scene: "Infinite void space with precisely floating geometric shapes and mathematical harmony",
      setting: "geometric void",
      time_of_day: "mathematical time",
      environmental_details: "geometric resonance and mathematical harmony",
      weather: "pure mathematical environment",
      camera_angle: "floating through geometry",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "geometric shapes in focus",
      style: "pure geometric abstract",
      color_palette: "primary geometric colors",
      lighting_type: "geometric edge lighting",
      motion_type: "precise geometric movement"
    },
    customDetails: "Pure abstract environment with floating geometric forms, mathematical precision, and the elegant beauty of pure geometric relationships"
  },

  "texture-morphing-walls": {
    id: "texture-morphing-walls",
    name: "Texture Morphing Walls",
    description: "Abstract space where walls constantly shift between different textures and materials",
    category: "abstract",
    tags: ["texture", "morphing", "walls", "shifting", "materials"],
    useCase: "Abstract art, texture studies, morphing effects, material transformation",
    fields: {
      scene: "Room with walls that continuously morph between wood, metal, fabric, and organic textures",
      setting: "morphing texture room",
      time_of_day: "texture time",
      environmental_details: "texture transformation sounds and material shifts",
      weather: "controlled texture environment",
      camera_angle: "close to morphing walls",
      camera_distance: "close-up",
      lens_type: "macro",
      depth_of_field: "texture detail focus",
      style: "texture abstract",
      color_palette: "material-based color shifts",
      lighting_type: "texture-revealing lighting",
      motion_type: "continuous texture morphing"
    },
    customDetails: "Fascinating abstract environment where surfaces continuously transform between different materials and textures, creating ever-changing tactile landscapes"
  },

  "particle-storm-chamber": {
    id: "particle-storm-chamber",
    name: "Particle Storm Chamber",
    description: "Abstract space filled with swirling particle effects and energy patterns",
    category: "abstract",
    tags: ["particle", "storm", "chamber", "energy", "swirling"],
    useCase: "Particle effects, energy visualizations, abstract motion, dynamic patterns",
    fields: {
      scene: "Enclosed space with millions of particles creating swirling storm patterns and energy flows",
      setting: "particle chamber",
      time_of_day: "energy time",
      environmental_details: "particle collision sounds and energy crackling",
      weather: "particle storm environment",
      camera_angle: "within particle storm",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "particle streams in focus",
      style: "dynamic particle abstract",
      color_palette: "energy spectrum colors",
      lighting_type: "particle self-illumination",
      motion_type: "swirling particle dynamics"
    },
    customDetails: "Dynamic abstract environment with millions of particles creating storm-like patterns, energy flows, and the hypnotic beauty of particle physics"
  },

  "color-bleeding-landscape": {
    id: "color-bleeding-landscape",
    name: "Color Bleeding Landscape",
    description: "Surreal landscape where colors bleed and flow like paint across the environment",
    category: "abstract",
    tags: ["color", "bleeding", "landscape", "paint", "flowing"],
    useCase: "Color studies, artistic abstracts, paint effects, surreal environments",
    fields: {
      scene: "Landscape where colors flow and bleed across surfaces like liquid paint",
      setting: "color bleeding world",
      time_of_day: "color time",
      environmental_details: "color flowing sounds and paint mixing",
      weather: "liquid color atmosphere",
      camera_angle: "through color flows",
      camera_distance: "wide shot",
      lens_type: "wide angle",
      depth_of_field: "color flows in focus",
      style: "liquid color abstract",
      color_palette: "flowing paint spectrum",
      lighting_type: "color-revealing lighting",
      motion_type: "liquid color movement"
    },
    customDetails: "Artistic abstract landscape where colors behave like liquid paint, flowing and bleeding across surfaces to create ever-changing color compositions"
  },

  // ADDITIONAL INDOOR SPACES (8 presets)
  "recording-studio-booth": {
    id: "recording-studio-booth",
    name: "Recording Studio Booth",
    description: "Professional recording studio with soundproofing and audio equipment",
    category: "indoor",
    tags: ["recording", "studio", "music", "audio", "professional"],
    useCase: "Music production, audio content, recording sessions, creative studios",
    fields: {
      scene: "Professional recording booth with microphones and soundproofing panels",
      setting: "recording studio",
      time_of_day: "session time",
      environmental_details: "quiet isolation and equipment hum",
      weather: "controlled studio environment",
      camera_angle: "through studio glass",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "equipment in focus",
      style: "professional audio",
      color_palette: "studio grays and equipment blacks",
      lighting_type: "controlled studio lighting",
      motion_type: "subtle recording activity"
    },
    customDetails: "Professional audio environment with high-end recording equipment, acoustic treatment, and the focused atmosphere of music creation"
  },

  "art-studio-easel": {
    id: "art-studio-easel",
    name: "Artist Studio with Easel",
    description: "Creative art studio with painting easel and artistic supplies",
    category: "indoor",
    tags: ["art", "studio", "easel", "painting", "creative"],
    useCase: "Art creation, creative processes, studio environments, artistic content",
    fields: {
      scene: "Artist studio with paint-covered easel and scattered creative supplies",
      setting: "art studio",
      time_of_day: "creative afternoon",
      environmental_details: "quiet creativity and paint mixing sounds",
      weather: "comfortable creative environment",
      camera_angle: "over artist shoulder",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "easel and painting in focus",
      style: "artistic creative",
      color_palette: "artist paint colors",
      lighting_type: "north-facing window light",
      motion_type: "creative painting movements"
    },
    customDetails: "Inspiring creative workspace with natural light, art supplies, and the contemplative atmosphere of artistic creation"
  },

  "home-theater-room": {
    id: "home-theater-room",
    name: "Home Theater Room",
    description: "Private home cinema with comfortable seating and large screen",
    category: "indoor",
    tags: ["home", "theater", "cinema", "entertainment", "private"],
    useCase: "Home entertainment, movie watching, private cinema experiences, luxury interiors",
    fields: {
      scene: "Luxurious home theater with reclining seats and large projection screen",
      setting: "home theater",
      time_of_day: "movie night",
      environmental_details: "surround sound and comfortable silence",
      weather: "controlled indoor environment",
      camera_angle: "from seating area",
      camera_distance: "wide shot",
      lens_type: "wide angle",
      depth_of_field: "theater room and screen in focus",
      style: "luxury entertainment",
      color_palette: "theater dark blues and screen glow",
      lighting_type: "ambient theater lighting",
      motion_type: "reclining comfort"
    },
    customDetails: "Premium home entertainment space with professional theater seating, high-end audio/visual equipment, and the comfort of private cinema"
  },

  "wine-cellar-collection": {
    id: "wine-cellar-collection",
    name: "Wine Cellar Collection",
    description: "Traditional wine cellar with aged bottles and stone architecture",
    category: "indoor",
    tags: ["wine", "cellar", "collection", "aged", "traditional"],
    useCase: "Wine culture, luxury lifestyles, traditional storage, sophisticated environments",
    fields: {
      scene: "Stone wine cellar with wooden racks filled with aged wine bottles",
      setting: "wine cellar",
      time_of_day: "cellar twilight",
      environmental_details: "quiet aging and cork scents",
      weather: "cool cellar environment",
      camera_angle: "down wine cellar corridor",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "wine racks in focus",
      style: "traditional luxury",
      color_palette: "stone grays and wine bottle greens",
      lighting_type: "soft cellar lighting",
      motion_type: "still aging process"
    },
    customDetails: "Traditional underground wine storage with stone architecture, wooden racks, and the patient atmosphere of wine aging"
  },

  "greenhouse-garden-indoor": {
    id: "greenhouse-garden-indoor",
    name: "Indoor Greenhouse Garden",
    description: "Glass greenhouse filled with lush plants and controlled growing environment",
    category: "indoor",
    tags: ["greenhouse", "garden", "plants", "growing", "glass"],
    useCase: "Gardening content, plant cultivation, sustainable living, natural indoor spaces",
    fields: {
      scene: "Glass greenhouse interior with lush plants and growing systems",
      setting: "greenhouse",
      time_of_day: "bright growing light",
      environmental_details: "plant sounds and water systems",
      weather: "controlled growing environment",
      camera_angle: "through plant canopy",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "plants in focus",
      style: "natural growing",
      color_palette: "lush plant greens",
      lighting_type: "filtered greenhouse light",
      motion_type: "gentle plant growth"
    },
    customDetails: "Thriving indoor garden environment with controlled climate, diverse plant life, and the productive atmosphere of cultivation"
  },

  "workshop-crafting-table": {
    id: "workshop-crafting-table",
    name: "Workshop Crafting Table",
    description: "Artisan workshop with tools and handcrafted projects in progress",
    category: "indoor",
    tags: ["workshop", "crafting", "tools", "handmade", "artisan"],
    useCase: "Craftsmanship content, DIY projects, artisan work, traditional skills",
    fields: {
      scene: "Artisan workshop with wooden workbench covered in tools and projects",
      setting: "workshop",
      time_of_day: "productive afternoon",
      environmental_details: "tool sounds and crafting activity",
      weather: "workshop comfortable",
      camera_angle: "over workbench",
      camera_distance: "close-up",
      lens_type: "macro",
      depth_of_field: "tools and work in focus",
      style: "artisan craftsmanship",
      color_palette: "wood tones and tool metals",
      lighting_type: "task lighting",
      motion_type: "precise craftwork"
    },
    customDetails: "Authentic artisan workspace with hand tools, wood shavings, and the focused atmosphere of traditional craftsmanship"
  },

  "dance-studio-mirrors": {
    id: "dance-studio-mirrors",
    name: "Dance Studio with Mirrors",
    description: "Professional dance studio with mirrored walls and practice space",
    category: "indoor",
    tags: ["dance", "studio", "mirrors", "practice", "movement"],
    useCase: "Dance content, movement training, performance preparation, artistic expression",
    fields: {
      scene: "Professional dance studio with wall-to-wall mirrors and hardwood floors",
      setting: "dance studio",
      time_of_day: "practice session",
      environmental_details: "music and footwork sounds",
      weather: "controlled studio environment",
      camera_angle: "reflected in mirrors",
      camera_distance: "wide shot",
      lens_type: "wide angle",
      depth_of_field: "dancers and reflections in focus",
      style: "dynamic movement",
      color_palette: "mirror reflections and studio colors",
      lighting_type: "bright studio lighting",
      motion_type: "fluid dance movement"
    },
    customDetails: "Professional dance environment with mirrored walls, spring-loaded floors, and the dynamic energy of movement and artistic expression"
  },

  "cozy-reading-nook": {
    id: "cozy-reading-nook",
    name: "Cozy Reading Nook",
    description: "Comfortable reading corner with soft lighting and books",
    category: "indoor",
    tags: ["reading", "cozy", "books", "comfortable", "quiet"],
    useCase: "Quiet moments, reading culture, comfort spaces, peaceful interiors",
    fields: {
      scene: "Comfortable reading corner with soft chair, good lighting, and stacked books",
      setting: "reading nook",
      time_of_day: "quiet evening",
      environmental_details: "page turning and peaceful quiet",
      weather: "comfortable indoor",
      camera_angle: "cozy corner view",
      camera_distance: "medium shot",
      lens_type: "standard",
      depth_of_field: "reading area in focus",
      style: "cozy comfortable",
      color_palette: "warm reading light and book spines",
      lighting_type: "soft reading light",
      motion_type: "peaceful stillness"
    },
    customDetails: "Perfect reading retreat with comfortable seating, warm lighting, and the peaceful atmosphere of quiet literary escape"
  }
};

// Category organization for the preset selector
export const sceneCategories = {
  urban: {
    name: "Urban",
    icon: "🏙️",
    presets: ["city-street-chase", "rooftop-confrontation", "subway-station", "shopping-mall", "downtown-plaza", "urban-alley", "city-bridge", "parking-garage", "bustling-downtown-intersection", "high-rise-office-interior", "street-market-food-stalls", "construction-site-cranes"]
  },
  nature: {
    name: "Nature", 
    icon: "🌲",
    presets: ["beach-rescue", "forest-path", "mountain-peak", "lake-shore", "desert-landscape", "waterfall", "cave-entrance", "meadow-field", "quiet-suburban-street-sunset", "coffee-shop-rainy-day", "urban-park-joggers", "trendy-art-gallery-opening"]
  },
  indoor: {
    name: "Indoor",
    icon: "🏠", 
    presets: ["coffee-shop", "library", "gym-workout", "restaurant-dining", "office-workspace", "bedroom-intimate", "kitchen-cooking", "recording-studio-booth", "art-studio-easel", "home-theater-room", "wine-cellar-collection", "greenhouse-garden-indoor", "workshop-crafting-table", "dance-studio-mirrors", "cozy-reading-nook"]
  },
  entertainment: {
    name: "Entertainment",
    icon: "🎭",
    presets: ["concert-hall", "sports-stadium", "movie-theater", "amusement-park", "art-museum", "nightclub", "arcade-games"]
  },
  meme: {
    name: "Meme Templates",
    icon: "😂",
    presets: ["distracted-boyfriend", "woman-yelling-cat", "drake-pointing", "this-is-fine", "surprised-pikachu", "expanding-brain", "two-buttons", "ohio-brainrot"]
  },
  historical: {
    name: "Historical",
    icon: "🏛",
    presets: ["medieval-castle-courtyard", "ancient-roman-forum", "viking-longship-fjord", "egyptian-pyramid-desert", "medieval-tavern-inn", "pirate-ship-deck", "samurai-temple-garden", "aztec-pyramid-temple"]
  },
  fantasy: {
    name: "Fantasy / Magical",
    icon: "🧙‍♂️",
    presets: ["enchanted-fairy-forest", "dragon-mountain-lair", "wizard-tower-library", "elven-tree-city"]
  },
  scifi: {
    name: "Sci-Fi / Futuristic",
    icon: "🚀",
    presets: ["space-station-interior", "cyberpunk-street-neon", "alien-planet-landscape", "laboratory-experiment", "hover-car-highway", "robot-factory-assembly", "time-portal-chamber", "underwater-research-station"]
  },
  abstract: {
    name: "Abstract / Surreal",
    icon: "📦",
    presets: ["floating-islands-sky", "mirror-maze-reflections", "gravity-defying-rooms", "kaleidoscope-tunnel", "liquid-crystal-cavern", "dream-bubble-landscape", "geometric-void-space", "texture-morphing-walls", "particle-storm-chamber", "color-bleeding-landscape"]
  }
};