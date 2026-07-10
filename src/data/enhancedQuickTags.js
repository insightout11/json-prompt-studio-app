// Enhanced Quick Tags System with 200+ Presets
// Professional-grade quick combinations across all fields
export const enhancedQuickTags = {
  
  // GENRE-BASED PRESET COLLECTIONS (50+ presets organized by genre)
  genreCollections: {
    
    // Horror Genre Collection (12 presets)
    horror: {
      name: "Horror 👻",
      description: "Dark, scary, and suspenseful content",
      presets: {
        "haunted-house-exploration": {
          name: "Haunted House Exploration",
          icon: "🏚️",
          description: "Exploring creepy abandoned house with supernatural elements",
          autoFill: {
            setting: "abandoned house",
            time_of_day: "night",
            environment: "foggy",
            actions: "exploring",
            emotions: "nervous",
            angle: "low angle",
            lighting_type: "dramatic shadows",
            color_palette: "desaturated",
            tone: "dark",
            atmosphere: "eerie",
            vfx: "fog",
            filters: "vintage"
          }
        },
        "midnight-forest-chase": {
          name: "Midnight Forest Chase",
          icon: "🌲",
          description: "Running through dark woods pursued by unknown threat",
          autoFill: {
            setting: "forest",
            time_of_day: "night",
            environment: "misty",
            actions: "running",
            emotions: "fear",
            angle: "handheld",
            movement: "tracking",
            lighting_type: "moonlight",
            shadows: "dramatic shadows",
            tone: "suspenseful",
            speed: "fast motion"
          }
        },
        "basement-investigation": {
          name: "Basement Investigation",
          icon: "🔦",
          description: "Descending into dark basement with flashlight",
          autoFill: {
            setting: "basement",
            time_of_day: "night",
            environment: "damp",
            actions: "investigating",
            emotions: "nervous",
            angle: "dutch angle",
            lighting_type: "harsh shadows",
            color_palette: "cool tones",
            atmosphere: "oppressive",
            grain: "heavy",
            tone: "mysterious"
          }
        },
        "supernatural-encounter": {
          name: "Supernatural Encounter",
          icon: "👻",
          description: "Face-to-face with ghostly apparition",
          autoFill: {
            setting: "abandoned building",
            time_of_day: "midnight",
            environment: "supernatural",
            actions: "confronting",
            emotions: "terrified",
            angle: "eye level",
            distance: "close-up",
            vfx: "energy beams",
            lighting_type: "rim lighting",
            tone: "supernatural",
            filters: "desaturated"
          }
        },
        "creepy-doll-room": {
          name: "Creepy Doll Room",
          icon: "🪆",
          description: "Room filled with unsettling vintage dolls",
          autoFill: {
            setting: "attic",
            time_of_day: "twilight",
            environment: "dusty",
            character_type: "object",
            emotions: "unsettling",
            angle: "high angle",
            lighting_type: "dim lighting",
            color_palette: "muted",
            atmosphere: "disturbing",
            grain: "vintage"
          }
        },
        "graveyard-midnight": {
          name: "Graveyard at Midnight",
          icon: "⚰️",
          description: "Walking through cemetery under moonlight",
          autoFill: {
            setting: "cemetery",
            time_of_day: "midnight",
            environment: "foggy",
            actions: "walking slowly",
            emotions: "solemn",
            angle: "low angle",
            lighting_type: "moonlight",
            vfx: "fog",
            tone: "gothic",
            filters: "black and white"
          }
        },
        "abandoned-hospital": {
          name: "Abandoned Hospital",
          icon: "🏥",
          description: "Exploring decrepit medical facility",
          autoFill: {
            setting: "hospital",
            time_of_day: "late night",
            environment: "decay",
            actions: "exploring cautiously",
            emotions: "dread",
            angle: "wide shots",
            lighting_type: "fluorescent flicker",
            color_palette: "sickly greens",
            atmosphere: "contaminated",
            grain: "heavy"
          }
        },
        "mirror-reflection-horror": {
          name: "Mirror Reflection Horror",
          icon: "🪞",
          description: "Something wrong appears in the mirror",
          autoFill: {
            setting: "bathroom",
            time_of_day: "late night",
            environment: "steamy",
            actions: "looking in mirror",
            emotions: "shocked",
            angle: "over shoulder",
            distance: "close-up",
            lighting_type: "harsh bathroom",
            vfx: "reflections",
            tone: "psychological"
          }
        },
        "demonic-possession": {
          name: "Demonic Possession",
          icon: "😈",
          description: "Character showing signs of supernatural influence",
          autoFill: {
            character_type: "human",
            emotions: "possessed",
            actions: "transforming",
            setting: "bedroom",
            time_of_day: "3am",
            angle: "dutch angle",
            lighting_type: "dramatic shadows",
            vfx: "energy effects",
            color_palette: "ominous reds"
          }
        },
        "ritual-summoning": {
          name: "Ritual Summoning",
          icon: "🕯️",
          description: "Dark occult ceremony in progress",
          autoFill: {
            setting: "ritual chamber",
            time_of_day: "midnight",
            environment: "candlelit",
            actions: "performing ritual",
            emotions: "intense concentration",
            lighting_type: "candlelight",
            vfx: "magic effects",
            color_palette: "deep reds",
            tone: "occult"
          }
        },
        "zombie-apocalypse": {
          name: "Zombie Apocalypse",
          icon: "🧟",
          description: "Surviving undead outbreak",
          autoFill: {
            setting: "destroyed city",
            time_of_day: "overcast day",
            environment: "post-apocalyptic",
            actions: "surviving",
            emotions: "desperate",
            angle: "handheld",
            movement: "erratic",
            color_palette: "desaturated",
            atmosphere: "hopeless",
            grain: "gritty"
          }
        },
        "psychological-breakdown": {
          name: "Psychological Breakdown",
          icon: "🧠",
          description: "Character losing grip on reality",
          autoFill: {
            setting: "anywhere",
            time_of_day: "uncertain",
            environment: "distorted",
            actions: "breaking down",
            emotions: "unhinged",
            angle: "dutch angle",
            vfx: "reality distortion",
            color_palette: "nightmare colors",
            tone: "psychological"
          }
        }
      }
    },

    // Romance Genre Collection (10 presets)
    romance: {
      name: "Romance 💕",
      description: "Love, relationships, and emotional connections",
      presets: {
        "golden-hour-confession": {
          name: "Golden Hour Confession",
          icon: "🌅",
          description: "Romantic love confession during golden hour",
          autoFill: {
            setting: "rooftop",
            time_of_day: "golden hour",
            environment: "perfect weather",
            actions: "confessing love",
            emotions: "romantic",
            angle: "eye level",
            distance: "medium shot",
            lighting_type: "golden light",
            color_palette: "warm tones",
            tone: "romantic",
            atmosphere: "dreamy"
          }
        },
        "beach-sunset-walk": {
          name: "Beach Sunset Walk",
          icon: "🏖️",
          description: "Romantic stroll along shore at sunset",
          autoFill: {
            setting: "beach",
            time_of_day: "sunset",
            environment: "gentle breeze",
            actions: "walking together",
            emotions: "content",
            angle: "wide shot",
            movement: "slow tracking",
            lighting_type: "sunset glow",
            color_palette: "sunset oranges",
            tone: "peaceful"
          }
        },
        "candlelit-dinner": {
          name: "Candlelit Dinner",
          icon: "🕯️",
          description: "Intimate dinner for two",
          autoFill: {
            setting: "restaurant",
            time_of_day: "evening",
            environment: "intimate",
            actions: "dining together",
            emotions: "loving",
            angle: "across table",
            distance: "medium close-up",
            lighting_type: "candlelight",
            color_palette: "warm gold",
            atmosphere: "intimate"
          }
        },
        "first-kiss": {
          name: "First Kiss",
          icon: "💋",
          description: "Tender first kiss moment",
          autoFill: {
            setting: "garden",
            time_of_day: "twilight",
            environment: "magical",
            actions: "kissing",
            emotions: "tender love",
            angle: "close-up",
            depth_of_field: "shallow",
            lighting_type: "soft romantic",
            color_palette: "pastel",
            tone: "tender"
          }
        },
        "proposal-scene": {
          name: "Marriage Proposal",
          icon: "💍",
          description: "Romantic marriage proposal moment",
          autoFill: {
            setting: "special location",
            time_of_day: "golden hour",
            environment: "perfect",
            actions: "proposing",
            emotions: "overwhelming joy",
            angle: "capturing both",
            lighting_type: "magical light",
            color_palette: "dreamy",
            tone: "life-changing"
          }
        },
        "slow-dance": {
          name: "Slow Dance",
          icon: "💃",
          description: "Intimate slow dancing together",
          autoFill: {
            setting: "living room",
            time_of_day: "evening",
            environment: "cozy",
            actions: "dancing",
            emotions: "connected",
            angle: "circling shot",
            movement: "slow orbit",
            lighting_type: "soft warm",
            color_palette: "warm",
            tone: "intimate"
          }
        },
        "morning-after": {
          name: "Morning After",
          icon: "☀️",
          description: "Peaceful morning together",
          autoFill: {
            setting: "bedroom",
            time_of_day: "early morning",
            environment: "peaceful",
            actions: "cuddling",
            emotions: "content",
            angle: "soft angles",
            lighting_type: "morning light",
            color_palette: "soft pastels",
            tone: "serene"
          }
        },
        "airport-reunion": {
          name: "Airport Reunion",
          icon: "✈️",
          description: "Emotional reunion at airport",
          autoFill: {
            setting: "airport",
            time_of_day: "afternoon",
            environment: "busy",
            actions: "embracing",
            emotions: "overwhelming joy",
            angle: "medium shot",
            movement: "rush toward",
            lighting_type: "bright",
            tone: "emotional"
          }
        },
        "picnic-date": {
          name: "Picnic Date",
          icon: "🧺",
          description: "Romantic outdoor picnic",
          autoFill: {
            setting: "park",
            time_of_day: "afternoon",
            environment: "sunny",
            actions: "picnicking",
            emotions: "playful",
            angle: "above looking down",
            lighting_type: "natural daylight",
            color_palette: "fresh greens",
            tone: "joyful"
          }
        },
        "valentine-surprise": {
          name: "Valentine's Surprise",
          icon: "💝",
          description: "Surprise romantic gesture",
          autoFill: {
            setting: "home",
            time_of_day: "evening",
            environment: "decorated",
            actions: "surprising",
            emotions: "delighted",
            angle: "reaction shot",
            lighting_type: "romantic",
            color_palette: "reds and pinks",
            tone: "surprising"
          }
        }
      }
    },

    // Sci-Fi Genre Collection (10 presets)
    scifi: {
      name: "Sci-Fi 🚀",
      description: "Futuristic, technological, and space themes",
      presets: {
        "space-station-corridor": {
          name: "Space Station Corridor",
          icon: "🛸",
          description: "Walking through futuristic space station",
          autoFill: {
            setting: "space station",
            time_of_day: "artificial cycle",
            environment: "sterile",
            actions: "walking",
            emotions: "focused",
            angle: "tracking shot",
            lighting_type: "cool fluorescent",
            color_palette: "cool blues",
            style: "futuristic",
            tone: "clinical"
          }
        },
        "alien-first-contact": {
          name: "Alien First Contact",
          icon: "👽",
          description: "Historic first meeting with alien species",
          autoFill: {
            character_type: "alien",
            setting: "landing site",
            time_of_day: "dawn",
            environment: "otherworldly",
            actions: "communicating",
            emotions: "wonder",
            angle: "wide establishing",
            lighting_type: "alien atmosphere",
            vfx: "energy effects",
            tone: "historic"
          }
        },
        "cyberpunk-street": {
          name: "Cyberpunk Street",
          icon: "🌃",
          description: "Neon-lit dystopian city street",
          autoFill: {
            setting: "cyber city",
            time_of_day: "night",
            environment: "neon-lit",
            actions: "navigating",
            emotions: "street-smart",
            angle: "low angle",
            lighting_type: "neon",
            color_palette: "cyberpunk neon",
            style: "cyberpunk",
            grain: "digital"
          }
        },
        "time-travel-arrival": {
          name: "Time Travel Arrival",
          icon: "⏰",
          description: "Materializing in different time period",
          autoFill: {
            setting: "temporal destination",
            time_of_day: "varies",
            environment: "temporal energy",
            actions: "materializing",
            emotions: "disoriented",
            angle: "dramatic reveal",
            vfx: "energy beams",
            lighting_type: "temporal glow",
            tone: "otherworldly"
          }
        },
        "robot-uprising": {
          name: "Robot Uprising",
          icon: "🤖",
          description: "AI rebellion against humans",
          autoFill: {
            character_type: "robot",
            setting: "tech facility",
            time_of_day: "emergency",
            environment: "chaos",
            actions: "rebelling",
            emotions: "calculating",
            angle: "dramatic angles",
            lighting_type: "harsh red",
            color_palette: "danger reds",
            tone: "apocalyptic"
          }
        },
        "zero-gravity-scene": {
          name: "Zero Gravity Scene",
          icon: "🌌",
          description: "Floating in weightless environment",
          autoFill: {
            setting: "space",
            time_of_day: "eternal",
            environment: "weightless",
            actions: "floating",
            emotions: "serene",
            angle: "floating camera",
            movement: "weightless drift",
            lighting_type: "cosmic",
            color_palette: "deep space",
            style: "ethereal"
          }
        },
        "hologram-meeting": {
          name: "Hologram Meeting",
          icon: "📡",
          description: "Conference with holographic projections",
          autoFill: {
            setting: "conference room",
            time_of_day: "business hours",
            environment: "high-tech",
            actions: "conferencing",
            emotions: "professional",
            angle: "conference setup",
            vfx: "holographic",
            lighting_type: "tech lighting",
            style: "high-tech"
          }
        },
        "mars-exploration": {
          name: "Mars Exploration",
          icon: "🔴",
          description: "Exploring the red planet surface",
          autoFill: {
            setting: "mars surface",
            time_of_day: "martian day",
            environment: "alien atmosphere",
            actions: "exploring",
            emotions: "wonder",
            angle: "epic landscape",
            lighting_type: "alien sun",
            color_palette: "martian reds",
            style: "alien world"
          }
        },
        "virtual-reality-dive": {
          name: "Virtual Reality Dive",
          icon: "🥽",
          description: "Deep immersion into virtual world",
          autoFill: {
            setting: "virtual environment",
            time_of_day: "digital",
            environment: "simulated",
            actions: "experiencing VR",
            emotions: "immersed",
            angle: "POV experience",
            vfx: "digital effects",
            lighting_type: "digital glow",
            style: "virtual"
          }
        },
        "dimensional-portal": {
          name: "Dimensional Portal",
          icon: "🌀",
          description: "Opening gateway between realities",
          autoFill: {
            setting: "laboratory",
            time_of_day: "experiment time",
            environment: "energy charged",
            actions: "opening portal",
            emotions: "breakthrough",
            angle: "dramatic reveal",
            vfx: "energy portal",
            lighting_type: "otherworldly",
            tone: "scientific wonder"
          }
        }
      }
    },

    // Fantasy Genre Collection (10 presets)
    fantasy: {
      name: "Fantasy 🏰",
      description: "Magical, mythical, and enchanted content",
      presets: {
        "enchanted-forest": {
          name: "Enchanted Forest",
          icon: "🧚",
          description: "Magical woodland with mystical creatures",
          autoFill: {
            setting: "mystical forest",
            time_of_day: "twilight",
            environment: "magical",
            actions: "discovering magic",
            emotions: "wonder",
            angle: "mystical perspective",
            lighting_type: "magical glow",
            vfx: "sparkles",
            color_palette: "enchanted greens",
            tone: "magical"
          }
        },
        "dragon-encounter": {
          name: "Dragon Encounter",
          icon: "🐉",
          description: "Face-to-face with mighty dragon",
          autoFill: {
            character_type: "dragon",
            setting: "mountain lair",
            time_of_day: "dramatic",
            environment: "ancient",
            actions: "confronting",
            emotions: "awe",
            angle: "low angle epic",
            lighting_type: "fire glow",
            vfx: "fire",
            color_palette: "dragon gold"
          }
        },
        "wizard-casting-spell": {
          name: "Wizard Casting Spell",
          icon: "🧙",
          description: "Powerful magic user weaving spells",
          autoFill: {
            character_type: "wizard",
            setting: "tower chamber",
            time_of_day: "midnight",
            environment: "arcane",
            actions: "casting spells",
            emotions: "focused power",
            angle: "dramatic angles",
            vfx: "magic effects",
            lighting_type: "spell glow"
          }
        },
        "fairy-ring-dance": {
          name: "Fairy Ring Dance",
          icon: "🍄",
          description: "Mystical creatures dancing in fairy ring",
          autoFill: {
            character_type: "fairy",
            setting: "fairy ring",
            time_of_day: "midnight",
            environment: "enchanted",
            actions: "dancing",
            emotions: "joyful",
            angle: "circling camera",
            vfx: "sparkles",
            lighting_type: "magical moonlight"
          }
        },
        "castle-siege": {
          name: "Castle Siege",
          icon: "⚔️",
          description: "Epic battle at fortress walls",
          autoFill: {
            setting: "castle battlements",
            time_of_day: "dawn of battle",
            environment: "war",
            actions: "fighting",
            emotions: "heroic",
            angle: "epic battle shots",
            lighting_type: "dramatic war",
            color_palette: "battle grays",
            tone: "epic"
          }
        },
        "elven-realm": {
          name: "Elven Realm",
          icon: "🧝",
          description: "Graceful elvish city in the trees",
          autoFill: {
            character_type: "elf",
            setting: "elven city",
            time_of_day: "eternal twilight",
            environment: "ethereal",
            actions: "dwelling peacefully",
            emotions: "serene",
            angle: "graceful shots",
            lighting_type: "ethereal glow",
            style: "elvish beauty"
          }
        },
        "potion-brewing": {
          name: "Potion Brewing",
          icon: "🧪",
          description: "Alchemist creating magical concoctions",
          autoFill: {
            character_type: "alchemist",
            setting: "alchemy lab",
            time_of_day: "candlelit night",
            environment: "bubbling potions",
            actions: "brewing",
            emotions: "concentrated",
            angle: "close-up detail",
            vfx: "smoke",
            lighting_type: "cauldron glow"
          }
        },
        "unicorn-glade": {
          name: "Unicorn Glade",
          icon: "🦄",
          description: "Sacred clearing with pure unicorn",
          autoFill: {
            character_type: "unicorn",
            setting: "sacred glade",
            time_of_day: "dawn",
            environment: "pure",
            actions: "blessing area",
            emotions: "pure",
            angle: "reverent shots",
            lighting_type: "divine light",
            color_palette: "pure whites"
          }
        },
        "magic-portal": {
          name: "Magic Portal",
          icon: "🌀",
          description: "Mystical gateway between realms",
          autoFill: {
            setting: "ancient ruins",
            time_of_day: "ritual time",
            environment: "charged with magic",
            actions: "opening portal",
            emotions: "anticipation",
            angle: "portal reveal",
            vfx: "magic effects",
            lighting_type: "portal glow",
            tone: "mystical"
          }
        },
        "phoenix-rebirth": {
          name: "Phoenix Rebirth",
          icon: "🔥",
          description: "Legendary bird rising from ashes",
          autoFill: {
            character_type: "phoenix",
            setting: "ash field",
            time_of_day: "rebirth moment",
            environment: "transformative",
            actions: "being reborn",
            emotions: "triumphant",
            angle: "rising shot",
            vfx: "fire",
            lighting_type: "rebirth flame"
          }
        }
      }
    },

    // Documentary Genre Collection (8 presets)
    documentary: {
      name: "Documentary 📹",
      description: "Real-life, educational, and informative content",
      presets: {
        "expert-interview": {
          name: "Expert Interview",
          icon: "🎤",
          description: "Authority figure sharing knowledge",
          autoFill: {
            character_type: "expert",
            setting: "office",
            time_of_day: "professional hours",
            environment: "authoritative",
            actions: "explaining",
            emotions: "knowledgeable",
            angle: "interview setup",
            distance: "medium shot",
            lighting_type: "professional",
            style: "documentary"
          }
        },
        "behind-the-scenes": {
          name: "Behind the Scenes",
          icon: "🎬",
          description: "Showing process and production",
          autoFill: {
            setting: "workplace",
            time_of_day: "work hours",
            environment: "active production",
            actions: "working",
            emotions: "focused",
            angle: "observational",
            movement: "handheld",
            style: "documentary realism",
            lighting_type: "natural available"
          }
        },
        "nature-documentary": {
          name: "Nature Documentary",
          icon: "🐘",
          description: "Wildlife in natural habitat",
          autoFill: {
            character_type: "animal",
            setting: "wilderness",
            time_of_day: "golden hour",
            environment: "natural",
            actions: "natural behavior",
            emotions: "instinctual",
            angle: "wildlife shots",
            lens_type: "telephoto",
            style: "nature documentary"
          }
        },
        "historical-recreation": {
          name: "Historical Recreation",
          icon: "🏛️",
          description: "Recreating historical events",
          autoFill: {
            setting: "historical location",
            time_of_day: "period appropriate",
            environment: "authentic",
            clothing: "historical costume",
            actions: "historical activity",
            emotions: "period appropriate",
            style: "historical accuracy",
            color_palette: "period colors"
          }
        },
        "street-interviews": {
          name: "Street Interviews",
          icon: "🚶",
          description: "Random public opinions and reactions",
          autoFill: {
            setting: "busy street",
            time_of_day: "daytime",
            environment: "public",
            actions: "interviewing",
            emotions: "candid",
            angle: "street level",
            movement: "handheld",
            style: "guerrilla documentary",
            lighting_type: "natural daylight"
          }
        },
        "industrial-process": {
          name: "Industrial Process",
          icon: "🏭",
          description: "Manufacturing and production processes",
          autoFill: {
            setting: "factory",
            time_of_day: "work shift",
            environment: "industrial",
            actions: "manufacturing",
            emotions: "professional",
            angle: "process shots",
            movement: "tracking machinery",
            style: "industrial documentary",
            lighting_type: "factory lighting"
          }
        },
        "cultural-ceremony": {
          name: "Cultural Ceremony",
          icon: "🎭",
          description: "Traditional cultural practices",
          autoFill: {
            setting: "ceremonial space",
            time_of_day: "ritual time",
            environment: "cultural",
            clothing: "traditional dress",
            actions: "performing ceremony",
            emotions: "reverent",
            angle: "respectful documentation",
            style: "cultural documentary"
          }
        },
        "scientific-research": {
          name: "Scientific Research",
          icon: "🔬",
          description: "Laboratory research and discovery",
          autoFill: {
            setting: "laboratory",
            time_of_day: "research hours",
            environment: "controlled",
            actions: "researching",
            emotions: "analytical",
            angle: "detailed shots",
            lighting_type: "lab lighting",
            style: "scientific documentation"
          }
        }
      }
    }
  },

  // PROFESSIONAL CINEMATOGRAPHY PRESETS (40+ presets)
  professionalPresets: {
    
    // Famous Director Styles (12 presets)
    directorStyles: {
      "wes-anderson-style": {
        name: "Wes Anderson Style",
        icon: "🎨",
        description: "Symmetrical, whimsical, perfectly framed",
        autoFill: {
          angle: "perfectly centered",
          distance: "medium shot",
          color_palette: "pastel",
          style: "whimsical",
          lighting_type: "soft even",
          movement: "tracking shots",
          influences: "Wes Anderson",
          tone: "quirky"
        }
      },
      "christopher-nolan-epic": {
        name: "Christopher Nolan Epic",
        icon: "⏳",
        description: "Complex, time-bending, epic scale",
        autoFill: {
          angle: "epic angles",
          distance: "IMAX scale",
          lens_type: "anamorphic",
          color_palette: "high contrast",
          style: "cinematic",
          influences: "Christopher Nolan",
          tone: "epic",
          complexity: "mind-bending"
        }
      },
      "kubrick-symmetry": {
        name: "Kubrick Symmetry",
        icon: "👁️",
        description: "Perfect symmetry, haunting precision",
        autoFill: {
          angle: "perfect symmetry",
          distance: "wide shot",
          lens_type: "wide angle",
          color_palette: "stark",
          style: "minimalist",
          influences: "Stanley Kubrick",
          tone: "haunting",
          atmosphere: "clinical precision"
        }
      },
      "tarantino-tension": {
        name: "Tarantino Tension",
        icon: "🔫",
        description: "Low angles, tension, style",
        autoFill: {
          angle: "low angle",
          distance: "close-up",
          color_palette: "saturated",
          style: "stylized",
          influences: "Quentin Tarantino",
          tone: "tense",
          atmosphere: "stylish violence"
        }
      },
      "fincher-precision": {
        name: "Fincher Precision",
        icon: "🎯",
        description: "Cold precision, perfect technique",
        autoFill: {
          angle: "calculated angles",
          distance: "precise framing",
          color_palette: "desaturated",
          style: "clinical",
          influences: "David Fincher",
          tone: "cold",
          atmosphere: "precise"
        }
      },
      "spielberg-wonder": {
        name: "Spielberg Wonder",
        icon: "✨",
        description: "Sense of wonder and adventure",
        autoFill: {
          angle: "low angle hero",
          distance: "establishing shot",
          lighting_type: "magical",
          color_palette: "warm adventure",
          style: "adventurous",
          influences: "Steven Spielberg",
          tone: "wonder"
        }
      },
      "villeneuve-epic": {
        name: "Villeneuve Epic",
        icon: "🌌",
        description: "Epic scale, stunning visuals",
        autoFill: {
          angle: "massive scale",
          distance: "epic wide",
          lens_type: "anamorphic",
          color_palette: "epic",
          style: "sci-fi epic",
          influences: "Denis Villeneuve",
          tone: "awe-inspiring"
        }
      },
      "miyazaki-wonder": {
        name: "Miyazaki Wonder",
        icon: "🌸",
        description: "Magical, nature-focused, whimsical",
        autoFill: {
          style: "anime",
          color_palette: "magical nature",
          environment: "magical",
          emotions: "wonder",
          influences: "Hayao Miyazaki",
          tone: "magical",
          atmosphere: "whimsical"
        }
      },
      "scorsese-energy": {
        name: "Scorsese Energy",
        icon: "🎬",
        description: "Dynamic energy, tracking shots",
        autoFill: {
          movement: "dynamic tracking",
          angle: "energetic angles",
          style: "kinetic",
          influences: "Martin Scorsese",
          tone: "energetic",
          atmosphere: "dynamic"
        }
      },
      "del-toro-gothic": {
        name: "Del Toro Gothic",
        icon: "🦇",
        description: "Gothic beauty, dark fairy tale",
        autoFill: {
          lighting_type: "gothic",
          color_palette: "gothic beauty",
          style: "dark fairy tale",
          influences: "Guillermo del Toro",
          tone: "gothic",
          atmosphere: "dark beauty"
        }
      },
      "snyder-stylized": {
        name: "Snyder Stylized",
        icon: "💥",
        description: "Stylized action, slow motion",
        autoFill: {
          speed: "slow motion",
          style: "heavily stylized",
          color_palette: "desaturated with pops",
          influences: "Zack Snyder",
          tone: "epic action",
          filters: "stylized"
        }
      },
      "gerwig-authentic": {
        name: "Gerwig Authentic",
        icon: "💕",
        description: "Authentic emotion, natural feel",
        autoFill: {
          style: "authentic",
          emotions: "genuine",
          lighting_type: "natural",
          influences: "Greta Gerwig",
          tone: "authentic",
          atmosphere: "real emotion"
        }
      }
    },

    // Camera Technique Presets (15 presets)
    cameraPresets: {
      "dutch-angle-unease": {
        name: "Dutch Angle Unease",
        icon: "📐",
        description: "Tilted frame creating discomfort",
        autoFill: {
          angle: "dutch angle",
          tone: "unsettling",
          atmosphere: "unease"
        }
      },
      "overhead-god-shot": {
        name: "Overhead God Shot",
        icon: "👁️‍🗨️",
        description: "High overhead perspective",
        autoFill: {
          angle: "bird's-eye",
          distance: "extreme wide shot",
          tone: "omniscient"
        }
      },
      "dolly-zoom-vertigo": {
        name: "Dolly Zoom Vertigo",
        icon: "🌀",
        description: "Disorienting camera technique",
        autoFill: {
          movement: "dolly zoom",
          tone: "disorienting",
          atmosphere: "vertigo"
        }
      },
      "handheld-intimacy": {
        name: "Handheld Intimacy",
        icon: "🤝",
        description: "Close, personal handheld feel",
        autoFill: {
          movement: "handheld",
          distance: "close-up",
          tone: "intimate"
        }
      },
      "tracking-shot-reveal": {
        name: "Tracking Shot Reveal",
        icon: "🎯",
        description: "Moving camera revealing information",
        autoFill: {
          movement: "tracking",
          tone: "revealing",
          style: "cinematic"
        }
      },
      "crash-zoom-intensity": {
        name: "Crash Zoom Intensity",
        icon: "⚡",
        description: "Fast zoom for dramatic impact",
        autoFill: {
          movement: "zoom in",
          speed: "fast motion",
          tone: "intense"
        }
      },
      "whip-pan-energy": {
        name: "Whip Pan Energy",
        icon: "💨",
        description: "Fast pan for dynamic energy",
        autoFill: {
          movement: "pan right",
          speed: "fast motion",
          motion_blur: "strong",
          tone: "energetic"
        }
      },
      "rack-focus-attention": {
        name: "Rack Focus Attention",
        icon: "🔍",
        description: "Shifting focus to guide viewer",
        autoFill: {
          depth_of_field: "rack focus",
          tone: "guiding attention"
        }
      },
      "steadicam-flow": {
        name: "Steadicam Flow",
        icon: "🌊",
        description: "Smooth flowing camera movement",
        autoFill: {
          movement: "smooth gimbal",
          tone: "flowing"
        }
      },
      "crash-zoom-comedy": {
        name: "Crash Zoom Comedy",
        icon: "😂",
        description: "Comedic crash zoom technique",
        autoFill: {
          movement: "zoom in",
          speed: "fast motion",
          tone: "comedic"
        }
      },
      "push-in-drama": {
        name: "Push In Drama",
        icon: "🎭",
        description: "Slow push creating drama",
        autoFill: {
          movement: "dolly in",
          speed: "slow motion",
          tone: "dramatic"
        }
      },
      "pull-out-reveal": {
        name: "Pull Out Reveal",
        icon: "🌅",
        description: "Pulling back to reveal scale",
        autoFill: {
          movement: "dolly out",
          distance: "establishing shot",
          tone: "revealing"
        }
      },
      "orbital-hero": {
        name: "Orbital Hero Shot",
        icon: "🚀",
        description: "Circling around subject heroically",
        autoFill: {
          movement: "orbit",
          angle: "low angle",
          tone: "heroic"
        }
      },
      "aerial-establishing": {
        name: "Aerial Establishing",
        icon: "🚁",
        description: "Drone shot establishing location",
        autoFill: {
          movement: "drone",
          distance: "establishing shot",
          angle: "aerial"
        }
      },
      "macro-detail": {
        name: "Macro Detail Shot",
        icon: "🔬",
        description: "Extreme close-up on details",
        autoFill: {
          distance: "extreme close-up",
          lens_type: "macro",
          tone: "detailed"
        }
      }
    },

    // Lighting Style Presets (13 presets)
    lightingPresets: {
      "rembrandt-portrait": {
        name: "Rembrandt Portrait",
        icon: "🎨",
        description: "Classic portrait lighting",
        autoFill: {
          lighting_direction: "Rembrandt lighting",
          light_quality: "dramatic",
          shadows: "soft shadows"
        }
      },
      "butterfly-glamour": {
        name: "Butterfly Glamour",
        icon: "🦋",
        description: "Glamorous butterfly lighting",
        autoFill: {
          lighting_direction: "butterfly lighting",
          light_quality: "soft",
          shadows: "subtle shadows"
        }
      },
      "split-lighting-drama": {
        name: "Split Lighting Drama",
        icon: "⚡",
        description: "Half light, half shadow drama",
        autoFill: {
          lighting_direction: "split lighting",
          light_quality: "hard",
          shadows: "dramatic shadows"
        }
      },
      "rim-lighting-silhouette": {
        name: "Rim Lighting Silhouette",
        icon: "🌅",
        description: "Edge lighting creating silhouette",
        autoFill: {
          lighting_direction: "rim lighting",
          light_quality: "dramatic",
          tone: "silhouette"
        }
      },
      "three-point-classic": {
        name: "Three Point Classic",
        icon: "💡",
        description: "Traditional three-point setup",
        autoFill: {
          lighting_type: "three-point lighting",
          light_quality: "balanced",
          style: "professional"
        }
      },
      "chiaroscuro-contrast": {
        name: "Chiaroscuro Contrast",
        icon: "🌓",
        description: "High contrast light and shadow",
        autoFill: {
          lighting_direction: "chiaroscuro lighting",
          color_palette: "chiaroscuro",
          shadows: "dramatic shadows"
        }
      },
      "practical-ambient": {
        name: "Practical Ambient",
        icon: "🕯️",
        description: "Using available light sources",
        autoFill: {
          lighting_type: "practical lighting",
          light_quality: "warm",
          atmosphere: "natural"
        }
      },
      "neon-cyberpunk": {
        name: "Neon Cyberpunk",
        icon: "🌈",
        description: "Colorful neon lighting scheme",
        autoFill: {
          lighting_type: "neon",
          color_palette: "neon",
          style: "cyberpunk"
        }
      },
      "candlelight-intimate": {
        name: "Candlelight Intimate",
        icon: "🕯️",
        description: "Warm candlelight atmosphere",
        autoFill: {
          lighting_type: "candlelight",
          light_quality: "warm",
          atmosphere: "intimate"
        }
      },
      "harsh-interrogation": {
        name: "Harsh Interrogation",
        icon: "💡",
        description: "Uncomfortable harsh lighting",
        autoFill: {
          lighting_type: "hard light",
          light_quality: "harsh",
          atmosphere: "uncomfortable"
        }
      },
      "golden-hour-magic": {
        name: "Golden Hour Magic",
        icon: "🌅",
        description: "Perfect natural golden light",
        autoFill: {
          time_of_day: "golden hour",
          lighting_type: "natural light",
          light_quality: "golden"
        }
      },
      "blue-hour-mystery": {
        name: "Blue Hour Mystery",
        icon: "🌆",
        description: "Mysterious twilight blue hour",
        autoFill: {
          time_of_day: "blue hour",
          lighting_type: "natural light",
          color_palette: "cool blues"
        }
      },
      "studio-perfection": {
        name: "Studio Perfection",
        icon: "📸",
        description: "Perfect controlled studio lighting",
        autoFill: {
          lighting_type: "studio lighting",
          light_quality: "even",
          style: "professional"
        }
      }
    }
  },

  // CONTENT TYPE PRESETS (30+ presets organized by use case)
  contentTypePresets: {
    
    // Social Media Viral (10 presets)
    socialMediaViral: {
      "tiktok-trending": {
        name: "TikTok Trending",
        icon: "📱",
        description: "Vertical format optimized for viral content",
        autoFill: {
          aspect_ratio: "9:16",
          duration: "15s",
          style: "viral",
          tone: "energetic",
          color_palette: "vibrant",
          music_style: "viral trending"
        }
      },
      "instagram-story": {
        name: "Instagram Story",
        icon: "📸",
        description: "Quick engaging story content",
        autoFill: {
          aspect_ratio: "9:16",
          duration: "5s",
          style: "social media",
          filters: "instagram",
          tone: "casual"
        }
      },
      "youtube-short": {
        name: "YouTube Short",
        icon: "🎬",
        description: "Vertical short-form video",
        autoFill: {
          aspect_ratio: "9:16",
          duration: "30s",
          style: "engaging",
          tone: "entertaining"
        }
      },
      "meme-template": {
        name: "Meme Template",
        icon: "😂",
        description: "Format ready for meme creation",
        autoFill: {
          style: "meme-perfect clarity",
          lighting_type: "even natural light",
          color_palette: "bright and clear",
          tone: "humorous"
        }
      },
      "reaction-video": {
        name: "Reaction Video",
        icon: "😱",
        description: "Perfect for capturing reactions",
        autoFill: {
          distance: "close-up",
          angle: "straight-on",
          emotions: "surprised",
          tone: "reactive"
        }
      },
      "dance-challenge": {
        name: "Dance Challenge",
        icon: "💃",
        description: "Full body dance content",
        autoFill: {
          distance: "full body",
          actions: "dancing",
          emotions: "energetic",
          music_style: "upbeat"
        }
      },
      "before-after": {
        name: "Before/After",
        icon: "🔄",
        description: "Transformation content",
        autoFill: {
          style: "comparison",
          tone: "transformative",
          transition: "quick cuts"
        }
      },
      "tutorial-quick": {
        name: "Quick Tutorial",
        icon: "📚",
        description: "Fast educational content",
        autoFill: {
          style: "educational",
          tone: "instructional",
          transition: "quick cuts"
        }
      },
      "lifestyle-flex": {
        name: "Lifestyle Flex",
        icon: "✨",
        description: "Aspirational lifestyle content",
        autoFill: {
          style: "aspirational",
          color_palette: "luxurious",
          tone: "confident"
        }
      },
      "comedy-sketch": {
        name: "Comedy Sketch",
        icon: "🎭",
        description: "Short comedic performance",
        autoFill: {
          style: "comedic",
          tone: "humorous",
          emotions: "playful"
        }
      }
    },

    // Corporate Professional (8 presets)
    corporateProfessional: {
      "ceo-announcement": {
        name: "CEO Announcement",
        icon: "👔",
        description: "Executive leadership communication",
        autoFill: {
          character_type: "executive",
          setting: "office",
          clothing: "business attire",
          emotions: "confident",
          lighting_type: "professional",
          style: "corporate"
        }
      },
      "product-launch": {
        name: "Product Launch",
        icon: "🚀",
        description: "New product introduction",
        autoFill: {
          setting: "conference room",
          actions: "presenting",
          emotions: "excited",
          lighting_type: "presentation",
          style: "professional"
        }
      },
      "team-meeting": {
        name: "Team Meeting",
        icon: "👥",
        description: "Collaborative business discussion",
        autoFill: {
          setting: "conference room",
          actions: "collaborating",
          emotions: "focused",
          style: "collaborative"
        }
      },
      "customer-testimonial": {
        name: "Customer Testimonial",
        icon: "💬",
        description: "Client success story",
        autoFill: {
          setting: "office",
          actions: "testimonial",
          emotions: "satisfied",
          style: "authentic"
        }
      },
      "training-video": {
        name: "Training Video",
        icon: "🎓",
        description: "Educational corporate training",
        autoFill: {
          setting: "training room",
          actions: "teaching",
          emotions: "instructional",
          style: "educational"
        }
      },
      "company-culture": {
        name: "Company Culture",
        icon: "🏢",
        description: "Workplace culture showcase",
        autoFill: {
          setting: "office",
          actions: "working together",
          emotions: "collaborative",
          style: "authentic workplace"
        }
      },
      "investor-pitch": {
        name: "Investor Pitch",
        icon: "📊",
        description: "Financial presentation to investors",
        autoFill: {
          setting: "boardroom",
          actions: "presenting",
          emotions: "persuasive",
          style: "authoritative"
        }
      },
      "remote-work": {
        name: "Remote Work",
        icon: "💻",
        description: "Home office professional setup",
        autoFill: {
          setting: "home office",
          actions: "video conferencing",
          emotions: "professional",
          style: "remote professional"
        }
      }
    },

    // Educational Content (7 presets)
    educationalContent: {
      "science-experiment": {
        name: "Science Experiment",
        icon: "🔬",
        description: "Laboratory demonstration",
        autoFill: {
          setting: "laboratory",
          actions: "experimenting",
          emotions: "curious",
          style: "educational"
        }
      },
      "cooking-lesson": {
        name: "Cooking Lesson",
        icon: "👨‍🍳",
        description: "Culinary instruction video",
        autoFill: {
          setting: "kitchen",
          actions: "cooking",
          emotions: "instructional",
          style: "educational cooking"
        }
      },
      "math-tutorial": {
        name: "Math Tutorial",
        icon: "🔢",
        description: "Mathematical concept explanation",
        autoFill: {
          setting: "classroom",
          actions: "teaching",
          emotions: "patient",
          style: "academic"
        }
      },
      "language-learning": {
        name: "Language Learning",
        icon: "🗣️",
        description: "Foreign language instruction",
        autoFill: {
          actions: "speaking",
          emotions: "encouraging",
          style: "language instruction"
        }
      },
      "history-lesson": {
        name: "History Lesson",
        icon: "📜",
        description: "Historical event explanation",
        autoFill: {
          setting: "classroom",
          actions: "explaining history",
          emotions: "authoritative",
          style: "historical education"
        }
      },
      "art-tutorial": {
        name: "Art Tutorial",
        icon: "🎨",
        description: "Creative art instruction",
        autoFill: {
          setting: "art studio",
          actions: "creating art",
          emotions: "creative",
          style: "artistic instruction"
        }
      },
      "tech-explainer": {
        name: "Tech Explainer",
        icon: "💻",
        description: "Technology concept breakdown",
        autoFill: {
          setting: "tech environment",
          actions: "explaining technology",
          emotions: "knowledgeable",
          style: "tech education"
        }
      }
    },

    // Entertainment Variety (5 presets)
    entertainmentVariety: {
      "talk-show-segment": {
        name: "Talk Show Segment",
        icon: "🎤",
        description: "Television talk show setup",
        autoFill: {
          setting: "talk show set",
          actions: "interviewing",
          emotions: "entertaining",
          lighting_type: "TV studio",
          style: "talk show"
        }
      },
      "game-show": {
        name: "Game Show",
        icon: "🎮",
        description: "Competitive game format",
        autoFill: {
          setting: "game show set",
          actions: "competing",
          emotions: "competitive",
          style: "game show energy"
        }
      },
      "variety-performance": {
        name: "Variety Performance",
        icon: "🎭",
        description: "Multi-talent showcase",
        autoFill: {
          setting: "stage",
          actions: "performing",
          emotions: "entertaining",
          style: "variety show"
        }
      },
      "comedy-standup": {
        name: "Comedy Standup",
        icon: "🎤",
        description: "Solo comedy performance",
        autoFill: {
          setting: "comedy club",
          actions: "performing comedy",
          emotions: "humorous",
          style: "comedy performance"
        }
      },
      "magic-show": {
        name: "Magic Show",
        icon: "🎩",
        description: "Magical entertainment performance",
        autoFill: {
          setting: "stage",
          actions: "performing magic",
          emotions: "mysterious",
          style: "magical entertainment"
        }
      }
    }
  },

  // QUICK FIELD COMBINATIONS (50+ smart auto-fill presets)
  smartCombinations: {
    
    // Visual Style Combos (12 presets)
    visualStyles: {
      "film-noir-classic": {
        name: "Film Noir Classic",
        icon: "🕴️",
        description: "Classic black and white crime drama",
        autoFill: {
          style: "film noir",
          lighting_type: "chiaroscuro lighting",
          color_palette: "black and white",
          shadows: "dramatic shadows",
          angle: "low angle",
          tone: "dark"
        }
      },
      "pastel-aesthetic": {
        name: "Pastel Aesthetic",
        icon: "🌸",
        description: "Soft dreamy pastel visual style",
        autoFill: {
          color_palette: "pastel",
          lighting_type: "soft light",
          style: "dreamy",
          tone: "serene",
          atmosphere: "ethereal"
        }
      },
      "cyberpunk-neon": {
        name: "Cyberpunk Neon",
        icon: "🌃",
        description: "Futuristic neon-soaked cyberpunk",
        autoFill: {
          style: "cyberpunk",
          color_palette: "neon",
          lighting_type: "neon",
          time_of_day: "night",
          setting: "cyber city"
        }
      },
      "vintage-film": {
        name: "Vintage Film",
        icon: "📽️",
        description: "Classic film photography look",
        autoFill: {
          filters: "vintage",
          grain: "film grain",
          color_palette: "vintage",
          style: "retro"
        }
      },
      "minimalist-clean": {
        name: "Minimalist Clean",
        icon: "⚪",
        description: "Clean minimal aesthetic",
        autoFill: {
          style: "minimalist",
          color_palette: "monochromatic",
          lighting_type: "even",
          atmosphere: "clean"
        }
      },
      "maximalist-vibrant": {
        name: "Maximalist Vibrant",
        icon: "🌈",
        description: "Bold colorful maximalist style",
        autoFill: {
          style: "maximalist",
          color_palette: "vibrant",
          lighting_type: "bright",
          atmosphere: "energetic"
        }
      },
      "sepia-nostalgia": {
        name: "Sepia Nostalgia",
        icon: "📷",
        description: "Warm nostalgic sepia tone",
        autoFill: {
          filters: "sepia",
          color_palette: "sepia",
          tone: "nostalgic",
          atmosphere: "memories"
        }
      },
      "high-contrast-drama": {
        name: "High Contrast Drama",
        icon: "⚡",
        description: "Dramatic high contrast look",
        autoFill: {
          color_palette: "high contrast",
          lighting_type: "dramatic",
          tone: "dramatic",
          atmosphere: "intense"
        }
      },
      "earth-tone-natural": {
        name: "Earth Tone Natural",
        icon: "🌍",
        description: "Natural earthy color palette",
        autoFill: {
          color_palette: "earth tones",
          lighting_type: "natural light",
          style: "organic",
          atmosphere: "natural"
        }
      },
      "cool-blue-tech": {
        name: "Cool Blue Tech",
        icon: "💙",
        description: "Technology-focused cool blue",
        autoFill: {
          color_palette: "cool blue tones",
          lighting_type: "cool",
          style: "futuristic",
          atmosphere: "technological"
        }
      },
      "warm-golden-comfort": {
        name: "Warm Golden Comfort",
        icon: "🧡",
        description: "Comfortable warm golden tones",
        autoFill: {
          color_palette: "warm tones",
          lighting_type: "warm",
          light_quality: "golden",
          atmosphere: "cozy"
        }
      },
      "desaturated-gritty": {
        name: "Desaturated Gritty",
        icon: "🏭",
        description: "Gritty desaturated realism",
        autoFill: {
          color_palette: "desaturated",
          style: "gritty",
          grain: "heavy",
          atmosphere: "harsh"
        }
      }
    },

    // Mood Atmosphere Combos (15 presets)
    moodAtmosphere: {
      "cozy-intimate": {
        name: "Cozy Intimate",
        icon: "🏠",
        description: "Warm comfortable intimate feeling",
        autoFill: {
          atmosphere: "cozy",
          lighting_type: "warm ambient",
          tone: "intimate",
          emotions: "comfortable"
        }
      },
      "epic-adventure": {
        name: "Epic Adventure",
        icon: "⛰️",
        description: "Grand adventurous scale",
        autoFill: {
          tone: "epic",
          atmosphere: "adventurous",
          angle: "epic scale",
          emotions: "heroic"
        }
      },
      "mysterious-suspense": {
        name: "Mysterious Suspense",
        icon: "🔍",
        description: "Building mysterious tension",
        autoFill: {
          tone: "mysterious",
          atmosphere: "suspenseful",
          lighting_type: "dramatic shadows",
          emotions: "mysterious"
        }
      },
      "cheerful-upbeat": {
        name: "Cheerful Upbeat",
        icon: "😊",
        description: "Happy positive energy",
        autoFill: {
          tone: "uplifting",
          atmosphere: "cheerful",
          emotions: "happy",
          color_palette: "bright"
        }
      },
      "melancholic-thoughtful": {
        name: "Melancholic Thoughtful",
        icon: "🤔",
        description: "Reflective contemplative mood",
        autoFill: {
          tone: "melancholic",
          atmosphere: "thoughtful",
          emotions: "contemplative",
          color_palette: "muted"
        }
      },
      "energetic-dynamic": {
        name: "Energetic Dynamic",
        icon: "⚡",
        description: "High energy dynamic feel",
        autoFill: {
          tone: "energetic",
          atmosphere: "dynamic",
          emotions: "energetic",
          movement: "dynamic"
        }
      },
      "peaceful-serene": {
        name: "Peaceful Serene",
        icon: "🕊️",
        description: "Calm peaceful tranquility",
        autoFill: {
          tone: "peaceful",
          atmosphere: "serene",
          emotions: "calm",
          lighting_type: "soft"
        }
      },
      "tense-dramatic": {
        name: "Tense Dramatic",
        icon: "😰",
        description: "High tension dramatic stakes",
        autoFill: {
          tone: "dramatic",
          atmosphere: "tense",
          emotions: "nervous",
          lighting_type: "dramatic"
        }
      },
      "whimsical-playful": {
        name: "Whimsical Playful",
        icon: "🎨",
        description: "Fun imaginative playfulness",
        autoFill: {
          tone: "whimsical",
          atmosphere: "playful",
          emotions: "playful",
          style: "whimsical"
        }
      },
      "dark-foreboding": {
        name: "Dark Foreboding",
        icon: "⚫",
        description: "Ominous threatening atmosphere",
        autoFill: {
          tone: "dark",
          atmosphere: "foreboding",
          emotions: "ominous",
          lighting_type: "dark"
        }
      },
      "inspiring-uplifting": {
        name: "Inspiring Uplifting",
        icon: "🌟",
        description: "Motivational inspiring feeling",
        autoFill: {
          tone: "inspiring",
          atmosphere: "uplifting",
          emotions: "inspired",
          lighting_type: "bright"
        }
      },
      "nostalgic-wistful": {
        name: "Nostalgic Wistful",
        icon: "📸",
        description: "Longing for past memories",
        autoFill: {
          tone: "nostalgic",
          atmosphere: "wistful",
          emotions: "nostalgic",
          filters: "vintage"
        }
      },
      "clinical-sterile": {
        name: "Clinical Sterile",
        icon: "🏥",
        description: "Clean medical precision",
        autoFill: {
          atmosphere: "clinical precision",
          lighting_type: "harsh fluorescent",
          color_palette: "sterile whites",
          tone: "clinical"
        }
      },
      "chaotic-frantic": {
        name: "Chaotic Frantic",
        icon: "🌪️",
        description: "Overwhelming chaotic energy",
        autoFill: {
          atmosphere: "chaotic",
          tone: "frantic",
          emotions: "overwhelmed",
          movement: "chaotic"
        }
      },
      "magical-ethereal": {
        name: "Magical Ethereal",
        icon: "✨",
        description: "Otherworldly magical feeling",
        autoFill: {
          atmosphere: "magical",
          tone: "ethereal",
          emotions: "wonder",
          vfx: "sparkles"
        }
      }
    },

    // Technical Camera Combos (12 presets)
    technicalCombos: {
      "shallow-focus-portrait": {
        name: "Shallow Focus Portrait",
        icon: "👤",
        description: "Isolated subject with blurred background",
        autoFill: {
          distance: "close-up",
          depth_of_field: "shallow",
          lens_type: "85mm",
          angle: "eye level"
        }
      },
      "wide-landscape-epic": {
        name: "Wide Landscape Epic",
        icon: "🏔️",
        description: "Expansive landscape capture",
        autoFill: {
          distance: "extreme wide shot",
          lens_type: "wide angle",
          depth_of_field: "deep",
          angle: "elevated"
        }
      },
      "macro-detail-study": {
        name: "Macro Detail Study",
        icon: "🔬",
        description: "Extreme close-up detail work",
        autoFill: {
          distance: "extreme close-up",
          lens_type: "macro",
          depth_of_field: "shallow",
          lighting_type: "detail lighting"
        }
      },
      "telephoto-compression": {
        name: "Telephoto Compression",
        icon: "🔭",
        description: "Compressed perspective isolation",
        autoFill: {
          lens_type: "telephoto",
          depth_of_field: "shallow",
          distance: "medium shot",
          angle: "compressed perspective"
        }
      },
      "fisheye-distortion": {
        name: "Fisheye Distortion",
        icon: "🐟",
        description: "Extreme wide distorted perspective",
        autoFill: {
          lens_type: "fisheye",
          distance: "wide shot",
          angle: "distorted perspective",
          style: "experimental"
        }
      },
      "anamorphic-cinematic": {
        name: "Anamorphic Cinematic",
        icon: "🎬",
        description: "Widescreen cinematic look",
        autoFill: {
          lens_type: "anamorphic",
          aspect_ratio: "2.39:1",
          style: "cinematic",
          depth_of_field: "shallow"
        }
      },
      "handheld-documentary": {
        name: "Handheld Documentary",
        icon: "📹",
        description: "Raw documentary camera feel",
        autoFill: {
          movement: "handheld",
          style: "documentary",
          lighting_type: "available light",
          tone: "authentic"
        }
      },
      "steadicam-smooth": {
        name: "Steadicam Smooth",
        icon: "🎥",
        description: "Smooth flowing camera movement",
        autoFill: {
          movement: "smooth gimbal",
          style: "cinematic",
          tone: "flowing",
          speed: "normal"
        }
      },
      "drone-aerial-epic": {
        name: "Drone Aerial Epic",
        icon: "🚁",
        description: "Epic overhead aerial perspective",
        autoFill: {
          movement: "drone",
          angle: "aerial",
          distance: "establishing shot",
          tone: "epic"
        }
      },
      "tilt-shift-miniature": {
        name: "Tilt-Shift Miniature",
        icon: "🏘️",
        description: "Miniature effect selective focus",
        autoFill: {
          depth_of_field: "tilt-shift",
          angle: "high angle",
          style: "miniature effect",
          tone: "whimsical"
        }
      },
      "rack-focus-narrative": {
        name: "Rack Focus Narrative",
        icon: "🎯",
        description: "Focus pull for storytelling",
        autoFill: {
          depth_of_field: "rack focus",
          style: "narrative",
          tone: "revealing",
          distance: "medium shot"
        }
      },
      "split-diopter-dual": {
        name: "Split Diopter Dual Focus",
        icon: "👥",
        description: "Two subjects in focus simultaneously",
        autoFill: {
          depth_of_field: "split diopter",
          distance: "medium shot",
          style: "technical precision",
          angle: "dual focus"
        }
      }
    },

    // Time and Speed Combos (11 presets)
    timeSpeedCombos: {
      "slow-motion-dramatic": {
        name: "Slow Motion Dramatic",
        icon: "⏱️",
        description: "Dramatic slow motion emphasis",
        autoFill: {
          speed: "slow motion",
          tone: "dramatic",
          emotions: "intense",
          movement: "emphasized motion"
        }
      },
      "time-lapse-transformation": {
        name: "Time Lapse Transformation",
        icon: "⏩",
        description: "Accelerated change over time",
        autoFill: {
          speed: "time lapse",
          tone: "transformative",
          style: "progression",
          movement: "compressed time"
        }
      },
      "freeze-frame-impact": {
        name: "Freeze Frame Impact",
        icon: "⏸️",
        description: "Frozen moment of impact",
        autoFill: {
          speed: "freeze frame",
          tone: "impactful",
          emotions: "suspended",
          style: "dramatic pause"
        }
      },
      "hyper-lapse-journey": {
        name: "Hyper Lapse Journey",
        icon: "🚄",
        description: "Fast travel through space",
        autoFill: {
          speed: "hyper lapse",
          movement: "tracking",
          tone: "journey",
          style: "travel"
        }
      },
      "variable-speed-emotion": {
        name: "Variable Speed Emotion",
        icon: "🎭",
        description: "Speed changes for emotional impact",
        autoFill: {
          speed: "variable speed",
          tone: "emotional",
          style: "dynamic pacing",
          emotions: "complex"
        }
      },
      "real-time-authentic": {
        name: "Real Time Authentic",
        icon: "⏰",
        description: "Natural real-time pacing",
        autoFill: {
          speed: "normal",
          style: "authentic",
          tone: "realistic",
          atmosphere: "natural"
        }
      },
      "bullet-time-matrix": {
        name: "Bullet Time Matrix",
        icon: "🔄",
        description: "360-degree frozen time effect",
        autoFill: {
          speed: "slow motion",
          movement: "orbit",
          style: "bullet time",
          tone: "supernatural"
        }
      },
      "fast-motion-comedy": {
        name: "Fast Motion Comedy",
        icon: "😂",
        description: "Comedic sped-up action",
        autoFill: {
          speed: "fast motion",
          tone: "comedic",
          emotions: "humorous",
          style: "slapstick"
        }
      },
      "ramping-speed-build": {
        name: "Ramping Speed Build",
        icon: "📈",
        description: "Gradually increasing speed",
        autoFill: {
          speed: "variable speed",
          tone: "building tension",
          style: "escalating",
          emotions: "anticipation"
        }
      },
      "stop-motion-artistic": {
        name: "Stop Motion Artistic",
        icon: "🎨",
        description: "Frame-by-frame artistic animation",
        autoFill: {
          speed: "stop-motion",
          style: "artistic",
          tone: "creative",
          atmosphere: "handcrafted"
        }
      },
      "phantom-slow-science": {
        name: "Phantom Slow Science",
        icon: "🔬",
        description: "Ultra slow motion scientific",
        autoFill: {
          speed: "ultra slow motion",
          style: "scientific",
          tone: "analytical",
          lighting_type: "controlled"
        }
      }
    }
  }
};

// Export category organization for UI
export const enhancedTagCategories = {
  genre: {
    name: "Genre Collections",
    icon: "🎭",
    description: "Complete genre-based preset collections",
    collections: ["horror", "romance", "scifi", "fantasy", "documentary"]
  },
  professional: {
    name: "Professional Cinematography", 
    icon: "🎬",
    description: "Director styles and professional techniques",
    collections: ["directorStyles", "cameraPresets", "lightingPresets"]
  },
  contentType: {
    name: "Content Type Presets",
    icon: "📱",
    description: "Optimized for specific content types",
    collections: ["socialMediaViral", "corporateProfessional", "educationalContent", "entertainmentVariety"]
  },
  smartCombos: {
    name: "Smart Field Combinations",
    icon: "⚡",
    description: "Intelligent auto-fill combinations",
    collections: ["visualStyles", "moodAtmosphere", "technicalCombos", "timeSpeedCombos"]
  }
};

// Quick access trending presets
export const trendingPresets = [
  "tiktok-trending",
  "ohio-brainrot", 
  "wes-anderson-style",
  "cyberpunk-neon",
  "golden-hour-magic",
  "slow-motion-dramatic",
  "film-noir-classic",
  "viral-meme-template"
];

// Search functionality helpers
export const searchableFields = {
  tags: ["viral", "cinematic", "professional", "artistic", "comedy", "drama", "action", "horror", "romance", "sci-fi", "fantasy", "documentary"],
  styles: ["minimalist", "maximalist", "vintage", "modern", "cyberpunk", "film-noir", "whimsical", "gritty"],
  emotions: ["happy", "sad", "mysterious", "energetic", "peaceful", "dramatic", "comedic", "romantic"],
  technical: ["shallow-focus", "wide-angle", "macro", "slow-motion", "time-lapse", "handheld", "drone", "studio"]
};