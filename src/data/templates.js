export const templates = {
  // Consistency Examples
  consistency_examples: {
    name: "Consistency Examples",
    icon: "⚙️",
    description: "Showcase consistency features with locks, seeds, and advanced controls",
    levels: {
      1: {
        name: "Young Woman Walking",
        description: "Cinematic scene with identity lock and seed",
        fields: {
          characters: "Young woman with brown hair and denim jacket",
          actions: "Walks toward camera through light traffic",
          setting: "Downtown street at golden hour, soft haze",
          style: "Cinematic, natural light, gentle contrast",
          audio: "Soft indie guitar",
          aspect_ratio: "16:9",
          seed: 137421,
          lock_identity: true,
          lock_style: true,
          negative: "extra people, text overlays, hands",
          camera_lens_mm: 35,
          camera_move: "dolly_in",
          camera_speed: "slow",
          duration_s: 8,
          fps: 24,
          creativity: 0.4
        }
      },
      2: {
        name: "Product Spin with Brand Colors",
        description: "Commercial product shot with color lock",
        fields: {
          characters: "Red running shoe on turntable",
          actions: "Smooth 360° spin, subtle highlight sweep",
          setting: "Black studio cyclorama",
          style: "Clean commercial, glossy reflections",
          audio: "Mute",
          aspect_ratio: "16:9",
          seed: 884212,
          lock_style: true,
          palette: "#111111, #FF1A2E, #E6E6E6",
          negative: "hands, dust, text overlays",
          camera_lens_mm: 70,
          camera_move: "static",
          camera_speed: "normal",
          duration_s: 8,
          fps: 24,
          creativity: 0.3
        }
      },
      3: {
        name: "Vertical Vlog Intro",
        description: "Social-first content with exact timing",
        fields: {
          characters: "Creator talking to camera, cozy room",
          actions: "Waves hello and smiles",
          setting: "Soft window light, plants in background",
          style: "Vlog, naturalistic, shallow depth of field",
          audio: "Lo-fi beat, very light",
          aspect_ratio: "9:16",
          seed: 612090,
          lock_identity: true,
          camera_lens_mm: 35,
          camera_move: "static",
          camera_speed: "normal",
          duration_s: 12,
          fps: 30,
          creativity: 0.45
        }
      },
      4: {
        name: "Whimsical Animation",
        description: "Controlled creativity with palette",
        fields: {
          characters: "Wise old wizard riding a giant turtle",
          actions: "Raises staff; glowing runes swirl",
          setting: "Foggy coast at dawn",
          style: "Studio Ghibli, soft watercolor",
          audio: "Whispering wind and gentle synths",
          aspect_ratio: "16:9",
          seed: 17351,
          lock_identity: true,
          lock_style: true,
          palette: "#0F1418, #CADBE7, #65D6C6",
          camera_lens_mm: 50,
          camera_move: "dolly_in",
          camera_speed: "slow",
          duration_s: 8,
          fps: 24,
          creativity: 0.5
        }
      },
      5: {
        name: "Educational Close-up",
        description: "Steady framing with low variance",
        fields: {
          characters: "Teacher at whiteboard, marker in hand",
          actions: "Points to formula, nods once",
          setting: "Bright classroom, neutral wall",
          style: "Clean instructional, soft contrast",
          audio: "Light ambient classroom tone",
          aspect_ratio: "1:1",
          seed: 90214,
          lock_identity: true,
          lock_style: true,
          negative: "crowd, background text, decorative posters",
          camera_lens_mm: 85,
          camera_move: "static",
          camera_speed: "normal",
          duration_s: 8,
          fps: 24,
          creativity: 0.25
        }
      },
      6: {
        name: "Nature Mood",
        description: "Color discipline with slow movement",
        fields: {
          characters: "Coastal cliffs and waves",
          actions: "Slow push over shoreline; mist drifts",
          setting: "Overcast blue hour",
          style: "Atmospheric, desaturated blues",
          audio: "Ocean surf and wind",
          aspect_ratio: "16:9",
          seed: 445566,
          palette: "#0B1D2A, #6FA6C9, #BFD6E6",
          camera_lens_mm: 35,
          camera_move: "dolly_in",
          camera_speed: "slow",
          duration_s: 8,
          fps: 24,
          creativity: 0.35
        }
      },
      7: {
        name: "Minimal Reproducible",
        description: "Just seed for basic consistency",
        fields: {
          characters: "Golden retriever in a field",
          actions: "Runs toward camera",
          setting: "Sunset meadow with tall grass",
          style: "Warm, filmic, soft flares",
          audio: "Acoustic guitar",
          aspect_ratio: "16:9",
          seed: 321987
        }
      }
    }
  },

  horror: {
    name: "Horror/Thriller",
    icon: "👻",
    description: "Dark, suspenseful, fear-inducing atmosphere",
    levels: {
      1: {
        name: "Essential",
        description: "Core horror mood",
        fields: {
          tone: "dark",
          lighting_type: "hard light",
          atmosphere: "tense"
        }
      },
      2: {
        name: "Standard",
        description: "Classic horror cinematography",
        fields: {
          tone: "dark",
          lighting_type: "hard light",
          atmosphere: "tense",
          shadows: "dramatic shadows",
          color_palette: "desaturated",
          angle: "low angle",
          emotional_response: "fear"
        }
      },
      3: {
        name: "Detailed",
        description: "Full horror production setup",
        fields: {
          tone: "dark",
          lighting_type: "hard light",
          atmosphere: "tense",
          shadows: "dramatic shadows",
          color_palette: "desaturated",
          angle: "low angle",
          emotional_response: "fear",
          lighting_direction: "bottom lighting",
          music_style: "suspenseful",
          filters: "high contrast",
          movement: "handheld",
          sound_design: "electronic sounds"
        }
      }
    }
  },

  cinematic: {
    name: "Cinematic",
    icon: "🎬",
    description: "Professional film-style video",
    levels: {
      1: {
        name: "Essential",
        description: "Basic cinematic look",
        fields: {
          style: "cinematic",
          frame_rate: "24fps cinematic",
          aspect_ratio: "21:9"
        }
      },
      2: {
        name: "Standard",
        description: "Professional film setup",
        fields: {
          style: "cinematic",
          frame_rate: "24fps cinematic",
          aspect_ratio: "21:9",
          lighting_type: "three-point lighting",
          depth_of_field: "shallow",
          color_palette: "cinematic",
          lighting_direction: "golden hour"
        }
      },
      3: {
        name: "Detailed",
        description: "Director-level cinematography",
        fields: {
          style: "cinematic",
          frame_rate: "24fps cinematic",
          aspect_ratio: "21:9",
          lighting_type: "three-point lighting",
          depth_of_field: "shallow",
          color_palette: "cinematic",
          lighting_direction: "golden hour",
          movement: "dolly in",
          distance: "medium shot",
          light_quality: "dramatic",
          tone: "epic",
          color_palette: "chiaroscuro"
        }
      }
    }
  },

  christopher_nolan: {
    name: "Christopher Nolan",
    icon: "🌀",
    description: "Dark, dramatic lighting, time distortion, IMAX-style wide shots",
    levels: {
      1: {
        name: "Essential",
        description: "Core Nolan aesthetics",
        fields: {
          lighting_type: "low-key lighting",
          atmosphere: "tense",
          tone: "dramatic"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Nolan cinematography",
        fields: {
          lighting_type: "low-key lighting",
          atmosphere: "tense",
          tone: "dramatic",
          influences: "Christopher Nolan",
          shadows: "dramatic shadows",
          distance: "wide shot"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Nolan production",
        fields: {
          lighting_type: "low-key lighting",
          atmosphere: "tense",
          tone: "dramatic",
          influences: "Christopher Nolan",
          shadows: "dramatic shadows",
          distance: "wide shot",
          aspect_ratio: "21:9",
          color_palette: "cool tones",
          style: "cinematic",
          music_style: "epic",
          emotional_response: "awe",
          transition: "none"
        }
      }
    }
  },

  social_media: {
    name: "Social Media",
    icon: "📱",
    description: "Mobile-optimized, engaging content",
    levels: {
      1: {
        name: "Essential",
        description: "Mobile-first basics",
        fields: {
          aspect_ratio: "9:16",
          style: "modern",
          tone: "energetic"
        }
      },
      2: {
        name: "Standard",
        description: "Engaging social content",
        fields: {
          aspect_ratio: "9:16",
          style: "modern",
          tone: "energetic",
          lighting_type: "bright",
          distance: "close-up",
          color_palette: "vibrant"
        }
      },
      3: {
        name: "Detailed",
        description: "Viral-ready production",
        fields: {
          aspect_ratio: "9:16",
          style: "modern",
          tone: "energetic",
          lighting_type: "bright",
          distance: "close-up",
          color_palette: "vibrant",
          movement: "handheld",
          speed: "fast motion",
          music_style: "upbeat",
          emotional_response: "excitement",
          filters: "instagram"
        }
      }
    }
  },

  realistic_gritty: {
    name: "Realistic/Gritty",
    icon: "📹",
    description: "Authentic, gritty documentary style",
    levels: {
      1: {
        name: "Essential",
        description: "Raw realistic feel",
        fields: {
          style: "gritty",
          lighting_type: "natural light",
          atmosphere: "authentic"
        }
      },
      2: {
        name: "Standard",
        description: "Gritty documentary style",
        fields: {
          style: "gritty",
          lighting_type: "natural light",
          atmosphere: "authentic",
          movement: "handheld",
          angle: "eye level",
          tone: "serious"
        }
      },
      3: {
        name: "Detailed",
        description: "Full authentic production",
        fields: {
          style: "gritty",
          lighting_type: "natural light",
          atmosphere: "authentic",
          movement: "handheld",
          angle: "eye level",
          tone: "serious",
          color_palette: "desaturated",
          distance: "medium shot",
          sound_design: "ambient sounds",
          emotional_response: "authentic connection",
          frame_rate: "24fps cinematic"
        }
      }
    }
  },

  commercial: {
    name: "Commercial",
    icon: "🛍️",
    description: "Clean, product-focused advertising",
    levels: {
      1: {
        name: "Essential",
        description: "Clean commercial look",
        fields: {
          style: "clean",
          lighting_type: "studio lighting",
          tone: "uplifting"
        }
      },
      2: {
        name: "Standard",
        description: "Professional advertising",
        fields: {
          style: "clean",
          lighting_type: "studio lighting",
          tone: "uplifting",
          color_palette: "bright",
          movement: "tracking",
          light_quality: "even"
        }
      },
      3: {
        name: "Detailed",
        description: "Premium brand commercial",
        fields: {
          style: "clean",
          lighting_type: "studio lighting",
          tone: "uplifting",
          color_palette: "bright",
          movement: "tracking",
          light_quality: "even",
          distance: "medium shot",
          shadows: "soft shadows",
          music_style: "upbeat",
          emotional_response: "satisfaction",
          filters: "clean"
        }
      }
    }
  },

  music_video: {
    name: "Music Video",
    icon: "🎵",
    description: "Creative, rhythm-driven visuals",
    levels: {
      1: {
        name: "Essential",
        description: "Music video basics",
        fields: {
          style: "stylized",
          color_palette: "vibrant",
          tone: "energetic"
        }
      },
      2: {
        name: "Standard",
        description: "Dynamic music visuals",
        fields: {
          style: "stylized",
          color_palette: "vibrant",
          tone: "energetic",
          movement: "orbit",
          lighting_type: "dramatic",
          speed: "variable speed"
        }
      },
      3: {
        name: "Detailed",
        description: "Award-winning music video",
        fields: {
          style: "stylized",
          color_palette: "vibrant",
          tone: "energetic",
          movement: "orbit",
          lighting_type: "dramatic",
          speed: "variable speed",
          angle: "dutch angle",
          filters: "high contrast",
          vfx: "particles",
          emotional_response: "excitement",
          music_style: "electronic"
        }
      }
    }
  },

  travel: {
    name: "Travel/Nature",
    icon: "🌍",
    description: "Adventurous, scenic exploration",
    levels: {
      1: {
        name: "Essential",
        description: "Travel essentials",
        fields: {
          setting: "outdoor park",
          time_of_day: "golden hour",
          tone: "inspiring"
        }
      },
      2: {
        name: "Standard",
        description: "Adventure cinematography",
        fields: {
          setting: "outdoor park",
          time_of_day: "golden hour",
          tone: "inspiring",
          distance: "wide shot",
          movement: "drone",
          color_palette: "warm tones"
        }
      },
      3: {
        name: "Detailed",
        description: "Epic travel documentary",
        fields: {
          setting: "outdoor park",
          time_of_day: "golden hour",
          tone: "inspiring",
          distance: "wide shot",
          movement: "drone",
          color_palette: "warm tones",
          lighting_type: "natural light",
          atmosphere: "majestic",
          music_style: "epic",
          emotional_response: "wonder",
          sound_design: "natural sounds"
        }
      }
    }
  },

  corporate: {
    name: "Corporate",
    icon: "💼",
    description: "Professional business content",
    levels: {
      1: {
        name: "Essential",
        description: "Business basics",
        fields: {
          style: "professional",
          angle: "eye level",
          tone: "confident"
        }
      },
      2: {
        name: "Standard",
        description: "Corporate presentation",
        fields: {
          style: "professional",
          angle: "eye level",
          tone: "confident",
          lighting_type: "studio lighting",
          distance: "medium shot",
          color_palette: "neutral"
        }
      },
      3: {
        name: "Detailed",
        description: "Executive-level production",
        fields: {
          style: "professional",
          angle: "eye level",
          tone: "confident",
          lighting_type: "studio lighting",
          distance: "medium shot",
          color_palette: "neutral",
          movement: "static",
          light_quality: "soft",
          atmosphere: "professional",
          music_style: "minimalist",
          emotional_response: "trust"
        }
      }
    }
  },

  viral_short: {
    name: "Viral Short Clips",
    icon: "📱⚡",
    description: "Trending viral content for social media",
    levels: {
      1: {
        name: "Essential",
        description: "Basic viral elements",
        fields: {
          movement: "handheld",
          lighting_type: "natural light",
          color_palette: "vibrant",
          character_type: "human",
          gender: "unspecified",
          age_range: "young adult (18-25)"
        }
      },
      2: {
        name: "Standard",
        description: "Engaging viral content",
        fields: {
          movement: "handheld",
          lighting_type: "natural light",
          color_palette: "vibrant",
          music_style: "upbeat",
          speed: "fast motion",
          emotional_response: "excitement",
          character_type: "human",
          gender: "unspecified", 
          age_range: "teenager (14-17)"
        }
      },
      3: {
        name: "Detailed",
        description: "Full viral production",
        fields: {
          movement: "handheld",
          lighting_type: "natural light",
          color_palette: "vibrant",
          music_style: "upbeat",
          speed: "fast motion",
          emotional_response: "excitement",
          sound_design: "layered",
          transition: "quick cuts",
          tone: "energetic",
          atmosphere: "viral energy",
          style: "viral",
          character_type: "human",
          gender: "unspecified",
          age_range: "young adult (18-25)",
          ethnicity: "mixed race"
        }
      }
    }
  },

  character_narrative: {
    name: "Character Narrative",
    icon: "🎭",
    description: "AI character dialogue and storytelling",
    levels: {
      1: {
        name: "Essential",
        description: "Basic character setup",
        fields: {
          dialogue: "meaningful conversation",
          tone: "emotional",
          character_type: "robot",
          robot_style: "sentient AI"
        }
      },
      2: {
        name: "Standard",
        description: "Character storytelling",
        fields: {
          dialogue: "meaningful conversation",
          tone: "emotional",
          character_type: "robot",
          robot_style: "AI assistant",
          music_style: "ambient",
          lighting_type: "natural light",
          distance: "medium shot"
        }
      },
      3: {
        name: "Detailed",
        description: "Full narrative production",
        fields: {
          dialogue: "meaningful conversation",
          tone: "emotional",
          character_type: "robot",
          robot_style: "AI assistant",
          music_style: "ambient",
          lighting_type: "natural light",
          distance: "medium shot",
          sound_design: "synchronized audio",
          emotional_response: "authentic connection",
          atmosphere: "intimate",
          music_style: "emotional cues",
          angle: "eye level"
        }
      }
    }
  },

  stylized_meme: {
    name: "Stylized Meme",
    icon: "🎨😂",
    description: "Surreal humor and parody content",
    levels: {
      1: {
        name: "Essential",
        description: "Basic meme aesthetics",
        fields: {
          style: "surreal",
          color_palette: "high contrast",
          tone: "playful",
          character_type: "stylized",
          stylized_style: "cartoon network"
        }
      },
      2: {
        name: "Standard",
        description: "Creative meme content",
        fields: {
          style: "surreal",
          color_palette: "high contrast",
          tone: "playful",
          influences: "internet culture",
          atmosphere: "quirky",
          emotional_response: "humor",
          character_type: "object",
          object_type: "animated furniture"
        }
      },
      3: {
        name: "Detailed",
        description: "Viral meme production",
        fields: {
          style: "surreal",
          color_palette: "high contrast",
          tone: "playful",
          influences: "internet culture",
          atmosphere: "quirky",
          emotional_response: "humor",
          filters: "vintage",
          vfx: "glitch effects",
          transition: "flash",
          color_palette: "retro meme",
          music_style: "viral trending",
          character_type: "object",
          object_type: "living toy"
        }
      }
    }
  },

  wes_anderson: {
    name: "Wes Anderson",
    icon: "🎨",
    description: "Symmetrical, pastel palettes, quirky characters",
    levels: {
      1: {
        name: "Essential",
        description: "Core Anderson aesthetics",
        fields: {
          movement: "one-point perspective",
          color_palette: "pastel colors",
          style: "whimsical"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Anderson cinematography",
        fields: {
          movement: "one-point perspective",
          color_palette: "pastel colors",
          style: "whimsical",
          distance: "medium shot",
          influences: "Wes Anderson",
          tone: "whimsical"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Anderson production",
        fields: {
          movement: "one-point perspective",
          color_palette: "pastel colors",
          style: "whimsical",
          distance: "medium shot",
          influences: "Wes Anderson",
          tone: "whimsical",
          movement: "slow zoom",
          filters: "vintage",
          aspect_ratio: "4:3",
          atmosphere: "nostalgic",
          emotional_response: "wonder"
        }
      }
    }
  },

  steven_spielberg: {
    name: "Steven Spielberg",
    icon: "🌟",
    description: "Emotional close-ups, lens flares, childlike wonder",
    levels: {
      1: {
        name: "Essential",
        description: "Spielberg basics",
        fields: {
          distance: "close-up",
          vfx: "lens flares",
          tone: "emotional"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Spielberg style",
        fields: {
          distance: "close-up",
          vfx: "lens flares",
          tone: "emotional",
          movement: "tracking shots",
          lighting_type: "natural light",
          influences: "Steven Spielberg"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Spielberg production",
        fields: {
          distance: "close-up",
          vfx: "lens flares",
          tone: "emotional",
          movement: "tracking shots",
          lighting_type: "natural light",
          influences: "Steven Spielberg",
          light_quality: "warm",
          emotional_response: "wonder",
          style: "cinematic",
          music_style: "orchestral",
          atmosphere: "inspiring"
        }
      }
    }
  },

  quentin_tarantino: {
    name: "Quentin Tarantino",
    icon: "🔫",
    description: "Grindhouse style, trunk shots, intense dialogue",
    levels: {
      1: {
        name: "Essential",
        description: "Tarantino basics",
        fields: {
          movement: "trunk camera",
          filters: "70s film grain",
          style: "gritty"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Tarantino style",
        fields: {
          movement: "trunk camera",
          filters: "70s film grain",
          style: "gritty",
          movement: "overhead",
          influences: "Quentin Tarantino",
          tone: "dramatic"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Tarantino production",
        fields: {
          movement: "trunk camera",
          filters: "70s film grain",
          style: "gritty",
          movement: "overhead",
          influences: "Quentin Tarantino",
          tone: "dramatic",
          dialogue: "snappy dialogue",
          music_style: "rock",
          color_palette: "high contrast",
          atmosphere: "tense",
          emotional_response: "excitement"
        }
      }
    }
  },

  hayao_miyazaki: {
    name: "Hayao Miyazaki",
    icon: "🌸",
    description: "Soft painterly backgrounds, nature, magical realism",
    levels: {
      1: {
        name: "Essential",
        description: "Miyazaki basics",
        fields: {
          color_palette: "pastel colors",
          style: "painterly",
          setting: "outdoor park"
        }
      },
      2: {
        name: "Standard",
        description: "Studio Ghibli style",
        fields: {
          color_palette: "pastel colors",
          style: "painterly",
          setting: "outdoor park",
          influences: "Hayao Miyazaki",
          atmosphere: "magical",
          environment: "windy"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Ghibli production",
        fields: {
          color_palette: "pastel colors",
          style: "painterly",
          setting: "outdoor park",
          influences: "Hayao Miyazaki",
          atmosphere: "magical",
          environment: "windy",
          tone: "peaceful",
          movement: "dolly in",
          emotional_response: "wonder",
          music_style: "orchestral",
          stylized_style: "studio ghibli"
        }
      }
    }
  },

  zack_snyder: {
    name: "Zack Snyder",
    icon: "⚡",
    description: "Desaturation, slow-mo action, mythic hero framing",
    levels: {
      1: {
        name: "Essential",
        description: "Snyder basics",
        fields: {
          color_palette: "desaturated",
          speed: "slow motion",
          angle: "low angle"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Snyder style",
        fields: {
          color_palette: "desaturated",
          speed: "slow motion",
          angle: "low angle",
          influences: "Zack Snyder",
          distance: "wide shot",
          tone: "epic"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Snyder production",
        fields: {
          color_palette: "desaturated",
          speed: "slow motion",
          angle: "low angle",
          influences: "Zack Snyder",
          distance: "wide shot",
          tone: "epic",
          style: "stylized",
          filters: "high contrast",
          music_style: "epic",
          atmosphere: "majestic",
          emotional_response: "awe"
        }
      }
    }
  },

  david_fincher: {
    name: "David Fincher",
    icon: "🔍",
    description: "Moody colors, precise blocking, cool palettes",
    levels: {
      1: {
        name: "Essential",
        description: "Fincher basics",
        fields: {
          color_palette: "cool blue tones",
          movement: "static",
          angle: "low angle"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Fincher style",
        fields: {
          color_palette: "cool blue tones",
          movement: "static",
          angle: "low angle",
          influences: "David Fincher",
          filters: "hyper-real",
          atmosphere: "tense"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Fincher production",
        fields: {
          color_palette: "cool blue tones",
          movement: "static",
          angle: "low angle",
          influences: "David Fincher",
          filters: "hyper-real",
          atmosphere: "tense",
          style: "clinical",
          lighting_type: "hard light",
          tone: "dark",
          music_style: "electronic",
          emotional_response: "anxiety"
        }
      }
    }
  },

  greta_gerwig: {
    name: "Greta Gerwig",
    icon: "💕",
    description: "Warm retro colors, theatrical framing, emotional intimacy",
    levels: {
      1: {
        name: "Essential",
        description: "Gerwig basics",
        fields: {
          color_palette: "warm vintage palette",
          style: "suburban",
          tone: "nostalgic"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Gerwig style",
        fields: {
          color_palette: "warm vintage palette",
          style: "suburban",
          tone: "nostalgic",
          influences: "Greta Gerwig",
          lens_type: "wide angle",
          light_quality: "soft"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Gerwig production",
        fields: {
          color_palette: "warm vintage palette",
          style: "suburban",
          tone: "nostalgic",
          influences: "Greta Gerwig",
          lens_type: "wide angle",
          light_quality: "soft",
          glow: "subtle glow",
          atmosphere: "nostalgic",
          emotional_response: "nostalgia",
          music_style: "indie",
          distance: "medium shot"
        }
      }
    }
  },

  guillermo_del_toro: {
    name: "Guillermo del Toro",
    icon: "🌙",
    description: "Gothic lighting, creature focus, baroque detail",
    levels: {
      1: {
        name: "Essential",
        description: "Del Toro basics",
        fields: {
          lighting_type: "gothic lighting",
          color_palette: "deep reds",
          atmosphere: "magical"
        }
      },
      2: {
        name: "Standard",
        description: "Classic del Toro style",
        fields: {
          lighting_type: "gothic lighting",
          color_palette: "deep reds",
          atmosphere: "magical",
          influences: "Guillermo del Toro",
          shadows: "dramatic shadows",
          style: "gothic"
        }
      },
      3: {
        name: "Detailed",
        description: "Full del Toro production",
        fields: {
          lighting_type: "gothic lighting",
          color_palette: "deep reds",
          atmosphere: "magical",
          influences: "Guillermo del Toro",
          shadows: "dramatic shadows",
          style: "gothic",
          tone: "dark",
          vfx: "magic effects",
          music_style: "orchestral",
          emotional_response: "wonder",
          character_type: "stylized"
        }
      }
    }
  },

  stanley_kubrick: {
    name: "Stanley Kubrick",
    icon: "👁️",
    description: "Long static takes, cold symmetry, clinical precision",
    levels: {
      1: {
        name: "Essential",
        description: "Kubrick basics",
        fields: {
          movement: "one-point perspective",
          movement: "static",
          atmosphere: "eerie"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Kubrick style",
        fields: {
          movement: "one-point perspective",
          movement: "static",
          atmosphere: "eerie",
          influences: "Stanley Kubrick",
          style: "clinical",
          distance: "wide shot"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Kubrick production",
        fields: {
          movement: "one-point perspective",
          movement: "static",
          atmosphere: "eerie",
          influences: "Stanley Kubrick",
          style: "clinical",
          distance: "wide shot",
          atmosphere: "clinical precision",
          color_palette: "cool tones",
          tone: "mysterious",
          music_style: "classical",
          emotional_response: "curiosity"
        }
      }
    }
  },

  denis_villeneuve: {
    name: "Denis Villeneuve",
    icon: "🌌",
    description: "Atmospheric sci-fi, minimalist beauty, existential weight",
    levels: {
      1: {
        name: "Essential",
        description: "Villeneuve basics",
        fields: {
          color_palette: "monochromatic",
          atmosphere: "contemplative",
          style: "minimalist"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Villeneuve style",
        fields: {
          color_palette: "monochromatic",
          atmosphere: "contemplative",
          style: "minimalist",
          influences: "Denis Villeneuve",
          lighting_type: "natural light",
          distance: "wide shot"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Villeneuve production",
        fields: {
          color_palette: "monochromatic",
          atmosphere: "contemplative",
          style: "minimalist",
          influences: "Denis Villeneuve",
          lighting_type: "natural light",
          distance: "wide shot",
          tone: "existential",
          movement: "slow reveal",
          music_style: "ambient",
          emotional_response: "awe",
          setting: "vast landscape"
        }
      }
    }
  },

  jordan_peele: {
    name: "Jordan Peele",
    icon: "😨",
    description: "Social horror, uncomfortable tension, subversive storytelling",
    levels: {
      1: {
        name: "Essential",
        description: "Peele basics",
        fields: {
          atmosphere: "uncomfortable",
          lighting_type: "suburban normal",
          tone: "subversive"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Peele style",
        fields: {
          atmosphere: "uncomfortable",
          lighting_type: "suburban normal",
          tone: "subversive",
          influences: "Jordan Peele",
          angle: "unsettling close-ups",
          style: "social realism"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Peele production",
        fields: {
          atmosphere: "uncomfortable",
          lighting_type: "suburban normal",
          tone: "subversive",
          influences: "Jordan Peele",
          angle: "unsettling close-ups",
          style: "social realism",
          movement: "slow stalking",
          color_palette: "normal turned threatening",
          emotional_response: "unease",
          music_style: "discordant"
        }
      }
    }
  },

  rian_johnson: {
    name: "Rian Johnson",
    icon: "🕵️",
    description: "Genre subversion, clever plotting, visual wit",
    levels: {
      1: {
        name: "Essential",
        description: "Johnson basics",
        fields: {
          style: "genre pastiche",
          tone: "playfully subversive",
          movement: "smooth camera"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Johnson style",
        fields: {
          style: "genre pastiche",
          tone: "playfully subversive",
          movement: "smooth camera",
          influences: "Rian Johnson",
          lighting_type: "genre-appropriate",
          color_palette: "genre palettes"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Johnson production",
        fields: {
          style: "genre pastiche",
          tone: "playfully subversive",
          movement: "smooth camera",
          influences: "Rian Johnson",
          lighting_type: "genre-appropriate",
          color_palette: "genre palettes",
          atmosphere: "clever misdirection",
          music_style: "genre-bending",
          emotional_response: "surprise",
          distance: "layered composition"
        }
      }
    }
  },

  edgar_wright: {
    name: "Edgar Wright",
    icon: "⚡",
    description: "Kinetic editing, visual comedy, pop culture energy",
    levels: {
      1: {
        name: "Essential",
        description: "Wright basics",
        fields: {
          movement: "whip pans",
          speed: "rapid-fire editing",
          color_palette: "bold primary colors"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Wright style",
        fields: {
          movement: "whip pans",
          speed: "rapid-fire editing",
          color_palette: "bold primary colors",
          influences: "Edgar Wright",
          style: "kinetic",
          music_style: "synchronized to music"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Wright production",
        fields: {
          movement: "whip pans",
          speed: "rapid-fire editing",
          color_palette: "bold primary colors",
          influences: "Edgar Wright",
          style: "kinetic",
          music_style: "synchronized to music",
          tone: "energetically comedic",
          transition: "match cuts",
          emotional_response: "comedic energy",
          vfx: "visual puns"
        }
      }
    }
  },

  bong_joon_ho: {
    name: "Bong Joon-ho",
    icon: "🏠",
    description: "Architectural framing, class commentary, tonal shifts",
    levels: {
      1: {
        name: "Essential",
        description: "Bong basics",
        fields: {
          movement: "architectural framing",
          lighting_type: "class-conscious lighting",
          atmosphere: "social tension"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Bong style",
        fields: {
          movement: "architectural framing",
          lighting_type: "class-conscious lighting",
          atmosphere: "social tension",
          influences: "Bong Joon-ho",
          angle: "vertical movement",
          style: "social realism"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Bong production",
        fields: {
          movement: "architectural framing",
          lighting_type: "class-conscious lighting",
          atmosphere: "social tension",
          influences: "Bong Joon-ho",
          angle: "vertical movement",
          style: "social realism",
          tone: "darkly comedic",
          color_palette: "class-divided palette",
          emotional_response: "social awareness",
          music_style: "genre-shifting"
        }
      }
    }
  },

  chloe_zhao: {
    name: "Chloé Zhao",
    icon: "🌅",
    description: "Natural light mastery, intimate landscapes, authentic emotion",
    levels: {
      1: {
        name: "Essential",
        description: "Zhao basics",
        fields: {
          lighting_type: "golden hour natural",
          atmosphere: "contemplative",
          style: "intimate realism"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Zhao style",
        fields: {
          lighting_type: "golden hour natural",
          atmosphere: "contemplative",
          style: "intimate realism",
          influences: "Chloé Zhao",
          distance: "wide landscape shots",
          movement: "handheld intimacy"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Zhao production",
        fields: {
          lighting_type: "golden hour natural",
          atmosphere: "contemplative",
          style: "intimate realism",
          influences: "Chloé Zhao",
          distance: "wide landscape shots",
          movement: "handheld intimacy",
          tone: "melancholic beauty",
          color_palette: "earth tones",
          emotional_response: "authentic connection",
          music_style: "minimal ambient"
        }
      }
    }
  },

  barry_jenkins: {
    name: "Barry Jenkins",
    icon: "💙",
    description: "Intimate close-ups, dreamlike color, emotional vulnerability",
    levels: {
      1: {
        name: "Essential",
        description: "Jenkins basics",
        fields: {
          distance: "intimate close-ups",
          color_palette: "saturated blues and purples",
          lighting_type: "soft emotional"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Jenkins style",
        fields: {
          distance: "intimate close-ups",
          color_palette: "saturated blues and purples",
          lighting_type: "soft emotional",
          influences: "Barry Jenkins",
          movement: "floating camera",
          style: "dreamlike realism"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Jenkins production",
        fields: {
          distance: "intimate close-ups",
          color_palette: "saturated blues and purples",
          lighting_type: "soft emotional",
          influences: "Barry Jenkins",
          movement: "floating camera",
          style: "dreamlike realism",
          tone: "emotionally vulnerable",
          atmosphere: "tender intimacy",
          emotional_response: "deep empathy",
          music_style: "classical emotional"
        }
      }
    }
  },

  lulu_wang: {
    name: "Lulu Wang",
    icon: "🏮",
    description: "Cultural authenticity, warm family dynamics, bilingual storytelling",
    levels: {
      1: {
        name: "Essential",
        description: "Wang basics",
        fields: {
          lighting_type: "warm family lighting",
          atmosphere: "cultural authenticity",
          style: "intimate family"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Wang style",
        fields: {
          lighting_type: "warm family lighting",
          atmosphere: "cultural authenticity",
          style: "intimate family",
          influences: "Lulu Wang",
          color_palette: "warm cultural tones",
          distance: "family gathering shots"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Wang production",
        fields: {
          lighting_type: "warm family lighting",
          atmosphere: "cultural authenticity",
          style: "intimate family",
          influences: "Lulu Wang",
          color_palette: "warm cultural tones",
          distance: "family gathering shots",
          tone: "bittersweet family",
          movement: "observational camera",
          emotional_response: "cultural connection",
          music_style: "cultural fusion"
        }
      }
    }
  },

  // ANIMATION STYLES - Comprehensive collection inspired by famous cartoons and studios
  
  // Classic American Cartoons
  springfield_yellow: {
    name: "The Simpsons Style",
    icon: "🟡",
    description: "Classic Simpsons animation - yellow skin tones, thick black outlines, flat 2D suburban comedy style",
    levels: {
      1: {
        name: "Essential",
        description: "Basic cartoon look",
        fields: {
          character_type: "stylized",
          stylized_style: "The Simpsons",
          animation_reference: "The Simpsons TV show",
          visual_characteristics: "yellow skin tones, thick black outlines",
          color_palette: "vibrant yellow and bright colors"
        }
      },
      2: {
        name: "Standard", 
        description: "Classic sitcom cartoon",
        fields: {
          character_type: "stylized",
          stylized_style: "The Simpsons",
          animation_reference: "The Simpsons TV show",
          visual_characteristics: "yellow skin tones, thick black outlines, flat 2D animation",
          color_palette: "vibrant yellow and bright colors",
          style: "animated sitcom",
          tone: "suburban comedy",
          setting: "Springfield suburban setting"
        }
      },
      3: {
        name: "Detailed",
        description: "Full animated sitcom production",
        fields: {
          character_type: "stylized",
          stylized_style: "The Simpsons",
          animation_reference: "The Simpsons TV show",
          visual_characteristics: "yellow skin tones, thick black outlines, flat 2D suburban comedy animation",
          color_palette: "vibrant yellow and bright colors",
          style: "animated sitcom",
          tone: "suburban comedy",
          setting: "Springfield suburban setting",
          lighting_type: "bright cartoon lighting",
          atmosphere: "family friendly comedy",
          dialogue: "witty animated banter",
          music_style: "upbeat sitcom theme",
          emotional_response: "comedic humor"
        }
      }
    }
  },

  cutout_satire: {
    name: "South Park Style",
    icon: "✂️",
    description: "South Park paper cutout animation - construction paper look, stiff movement, satirical comedy",
    levels: {
      1: {
        name: "Essential",
        description: "Basic paper-cut animation",
        fields: {
          character_type: "stylized",
          stylized_style: "South Park",
          animation_reference: "South Park TV show",
          visual_characteristics: "paper cutout construction paper look",
          style: "satirical paper animation"
        }
      },
      2: {
        name: "Standard",
        description: "Satirical paper animation", 
        fields: {
          character_type: "stylized",
          stylized_style: "South Park",
          animation_reference: "South Park TV show",
          visual_characteristics: "paper cutout construction paper look, stiff movement",
          style: "satirical paper animation",
          tone: "satirical comedy",
          color_palette: "bright primary colors on white background",
          atmosphere: "irreverent humor"
        }
      },
      3: {
        name: "Detailed",
        description: "Full satirical animation production",
        fields: {
          character_type: "stylized",
          stylized_style: "cartoon network",
          style: "minimalist", 
          tone: "satirical",
          color_palette: "bright",
          atmosphere: "irreverent",
          dialogue: "sharp comedy",
          music_style: "comedic",
          emotional_response: "humor",
          setting: "small town",
          movement: "static"
        }
      }
    }
  },

  slacker_sitcom: {
    name: "Family Guy Style",
    icon: "🛋️",
    description: "Family Guy animation - glossy 2D style, expressive characters, cutaway gags, suburban sitcom",
    levels: {
      1: {
        name: "Essential",
        description: "Modern cartoon sitcom basics",
        fields: {
          character_type: "stylized",
          stylized_style: "Family Guy",
          animation_reference: "Family Guy TV show",
          visual_characteristics: "glossy 2D animation, expressive characters",
          color_palette: "vibrant suburban colors"
        }
      },
      2: {
        name: "Standard",
        description: "Family sitcom animation",
        fields: {
          character_type: "stylized",
          stylized_style: "cartoon network",
          color_palette: "vibrant",
          style: "modern",
          tone: "comedic",
          atmosphere: "chaotic"
        }
      },
      3: {
        name: "Detailed", 
        description: "Full animated family comedy",
        fields: {
          character_type: "stylized",
          stylized_style: "cartoon network",
          color_palette: "vibrant",
          style: "modern",
          tone: "comedic",
          atmosphere: "chaotic",
          dialogue: "rapid-fire comedy",
          music_style: "orchestral",
          emotional_response: "laughter",
          setting: "suburban home",
          movement: "dynamic"
        }
      }
    }
  },

  sci_fi_toon: {
    name: "Sci-Fi Toon Universe", 
    icon: "🛸",
    description: "Slick sci-fi animation with portal effects and multiverse comedy",
    levels: {
      1: {
        name: "Essential",
        description: "Basic sci-fi cartoon",
        fields: {
          character_type: "stylized",
          stylized_style: "anime character",
          color_palette: "neon"
        }
      },
      2: {
        name: "Standard",
        description: "Multiverse comedy animation",
        fields: {
          character_type: "stylized", 
          stylized_style: "anime character",
          color_palette: "neon",
          style: "futuristic",
          tone: "dark comedy",
          setting: "laboratory"
        }
      },
      3: {
        name: "Detailed",
        description: "Full sci-fi animated series",
        fields: {
          character_type: "stylized",
          stylized_style: "anime character", 
          color_palette: "neon",
          style: "futuristic",
          tone: "dark comedy",
          setting: "laboratory",
          atmosphere: "surreal",
          dialogue: "scientific banter",
          music_style: "electronic", 
          vfx: "portal effects",
          emotional_response: "dark humor"
        }
      }
    }
  },

  spy_noir_animation: {
    name: "Spy Noir Animation",
    icon: "🕴️",
    description: "Sleek vector-based espionage animation with sophisticated styling",
    levels: {
      1: {
        name: "Essential",
        description: "Basic spy animation style",
        fields: {
          character_type: "stylized",
          stylized_style: "comic book",
          style: "stylized"
        }
      },
      2: {
        name: "Standard",
        description: "Espionage animation",
        fields: {
          character_type: "stylized",
          stylized_style: "comic book", 
          style: "stylized",
          tone: "sophisticated",
          color_palette: "cool tones",
          atmosphere: "mysterious"
        }
      },
      3: {
        name: "Detailed",
        description: "Full spy thriller animation",
        fields: {
          character_type: "stylized",
          stylized_style: "comic book",
          style: "stylized",
          tone: "sophisticated", 
          color_palette: "cool tones",
          atmosphere: "mysterious",
          dialogue: "witty espionage",
          music_style: "jazz",
          lighting_type: "dramatic",
          shadows: "dramatic shadows",
          emotional_response: "intrigue"
        }
      }
    }
  },

  // Anime & Japanese Styles
  studio_ghibli_magic: {
    name: "Studio Ghibli Style",
    icon: "🌸",
    description: "Studio Ghibli animation - beautiful hand-drawn style, soft painterly backgrounds, magical realism, nature themes",
    levels: {
      1: {
        name: "Essential", 
        description: "Basic Ghibli aesthetic",
        fields: {
          character_type: "stylized",
          stylized_style: "Studio Ghibli",
          animation_reference: "Studio Ghibli films",
          visual_characteristics: "hand-drawn animation, soft painterly backgrounds, magical realism",
          color_palette: "soft pastel colors with nature themes"
        }
      },
      2: {
        name: "Standard",
        description: "Magical nature animation",
        fields: {
          character_type: "stylized",
          stylized_style: "studio ghibli",
          color_palette: "pastel colors",
          style: "painterly", 
          atmosphere: "magical",
          setting: "outdoor park"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Ghibli production",
        fields: {
          character_type: "stylized",
          stylized_style: "studio ghibli",
          color_palette: "pastel colors",
          style: "painterly",
          atmosphere: "magical",
          setting: "outdoor park",
          tone: "peaceful",
          music_style: "orchestral",
          lighting_type: "natural light",
          environment: "windy",
          emotional_response: "wonder"
        }
      }
    }
  },

  shonen_battle: {
    name: "Shonen Battle Style", 
    icon: "⚔️",
    description: "High-energy anime with dynamic action and power-up sequences",
    levels: {
      1: {
        name: "Essential",
        description: "Basic battle anime style",
        fields: {
          character_type: "stylized",
          stylized_style: "anime character",
          color_palette: "vibrant"
        }
      },
      2: {
        name: "Standard",
        description: "Action anime",
        fields: {
          character_type: "stylized",
          stylized_style: "anime character",
          color_palette: "vibrant",
          tone: "epic",
          actions: "fighting",
          atmosphere: "intense"
        }
      },
      3: {
        name: "Detailed",
        description: "Full battle anime production",
        fields: {
          character_type: "stylized",
          stylized_style: "anime character", 
          color_palette: "vibrant",
          tone: "epic",
          actions: "fighting",
          atmosphere: "intense",
          dialogue: "battle shouts",
          music_style: "epic",
          vfx: "energy effects",
          movement: "dynamic",
          emotional_response: "excitement"
        }
      }
    }
  },

  cyberpunk_anime: {
    name: "Cyberpunk Anime",
    icon: "🌆",
    description: "Neon-lit future cities with high-tech anime aesthetics",
    levels: {
      1: {
        name: "Essential",
        description: "Basic cyberpunk anime",
        fields: {
          character_type: "stylized",
          stylized_style: "anime character",
          color_palette: "neon"
        }
      },
      2: {
        name: "Standard", 
        description: "Futuristic anime",
        fields: {
          character_type: "stylized",
          stylized_style: "anime character",
          color_palette: "neon",
          style: "futuristic",
          setting: "urban city",
          time_of_day: "night"
        }
      },
      3: {
        name: "Detailed",
        description: "Full cyberpunk anime production",
        fields: {
          character_type: "stylized",
          stylized_style: "anime character",
          color_palette: "neon", 
          style: "futuristic",
          setting: "urban city",
          time_of_day: "night",
          atmosphere: "cyberpunk",
          lighting_type: "neon lighting",
          music_style: "electronic",
          tone: "dystopian",
          emotional_response: "tension"
        }
      }
    }
  },

  // Disney & Pixar
  classic_disney_2d: {
    name: "Classic Disney Style",
    icon: "🏰",
    description: "Classic Disney animation - traditional hand-drawn 2D style, expressive characters, musical storytelling",
    levels: {
      1: {
        name: "Essential",
        description: "Basic Disney style",
        fields: {
          character_type: "stylized",
          stylized_style: "disney style",
          color_palette: "warm tones"
        }
      },
      2: {
        name: "Standard",
        description: "Disney animated feature",
        fields: {
          character_type: "stylized",
          stylized_style: "disney style", 
          color_palette: "warm tones",
          style: "cinematic",
          tone: "uplifting",
          atmosphere: "magical"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Disney production",
        fields: {
          character_type: "stylized",
          stylized_style: "disney style",
          color_palette: "warm tones",
          style: "cinematic",
          tone: "uplifting",
          atmosphere: "magical",
          dialogue: "musical storytelling",
          music_style: "orchestral",
          lighting_type: "golden hour",
          emotional_response: "wonder",
          setting: "fairy tale"
        }
      }
    }
  },

  pixar_3d_style: {
    name: "Pixar 3D Style",
    icon: "🧸",
    description: "Pixar animation - modern 3D computer animation, soft textures, emotional storytelling, detailed environments",
    levels: {
      1: {
        name: "Essential", 
        description: "Basic 3D animation",
        fields: {
          character_type: "stylized",
          stylized_style: "pixar style",
          color_palette: "warm tones"
        }
      },
      2: {
        name: "Standard",
        description: "3D animated feature",
        fields: {
          character_type: "stylized",
          stylized_style: "pixar style",
          color_palette: "warm tones",
          style: "cinematic",
          lighting_type: "three-point lighting",
          atmosphere: "heartwarming"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Pixar production",
        fields: {
          character_type: "stylized",
          stylized_style: "pixar style",
          color_palette: "warm tones", 
          style: "cinematic",
          lighting_type: "three-point lighting",
          atmosphere: "heartwarming",
          tone: "emotional",
          dialogue: "heartfelt",
          music_style: "orchestral",
          light_quality: "soft",
          emotional_response: "authentic connection"
        }
      }
    }
  },

  // TV Animation Styles
  cartoon_network_classic: {
    name: "Cartoon Network Style",
    icon: "📺",
    description: "Cartoon Network animation - bold simple shapes, bright colors, experimental style, unique character designs",
    levels: {
      1: {
        name: "Essential",
        description: "Basic cartoon network style",
        fields: {
          character_type: "stylized",
          stylized_style: "cartoon network",
          color_palette: "vibrant"
        }
      },
      2: {
        name: "Standard",
        description: "TV cartoon series",
        fields: {
          character_type: "stylized",
          stylized_style: "cartoon network",
          color_palette: "vibrant",
          style: "cartoon",
          tone: "playful",
          atmosphere: "energetic"
        }
      },
      3: {
        name: "Detailed",
        description: "Full cartoon series production",
        fields: {
          character_type: "stylized",
          stylized_style: "cartoon network",
          color_palette: "vibrant",
          style: "cartoon", 
          tone: "playful",
          atmosphere: "energetic",
          dialogue: "snappy",
          music_style: "upbeat",
          movement: "bouncy",
          emotional_response: "fun"
        }
      }
    }
  },

  nickelodeon_90s: {
    name: "Nickelodeon 90s",
    icon: "🟠",
    description: "Wobbly outlines, grunge palettes, and urban kid adventures",
    levels: {
      1: {
        name: "Essential",
        description: "Basic 90s cartoon style",
        fields: {
          character_type: "stylized",
          stylized_style: "cartoon network",
          color_palette: "desaturated"
        }
      },
      2: {
        name: "Standard",
        description: "90s kids cartoon",
        fields: {
          character_type: "stylized",
          stylized_style: "cartoon network",
          color_palette: "desaturated",
          style: "retro",
          tone: "nostalgic",
          setting: "urban city"
        }
      },
      3: {
        name: "Detailed",
        description: "Full 90s cartoon production",
        fields: {
          character_type: "stylized",
          stylized_style: "cartoon network",
          color_palette: "desaturated", 
          style: "retro",
          tone: "nostalgic",
          setting: "urban city",
          atmosphere: "childhood adventure",
          dialogue: "kid-friendly",
          music_style: "alternative rock",
          emotional_response: "nostalgia"
        }
      }
    }
  },

  // Experimental & Indie
  paper_cutout: {
    name: "Paper Cut-Out",
    icon: "📄",
    description: "Mixed media layered paper textures and stop-motion feel",
    levels: {
      1: {
        name: "Essential",
        description: "Basic paper animation",
        fields: {
          character_type: "stylized",
          stylized_style: "claymation",
          style: "minimalist"
        }
      },
      2: {
        name: "Standard",
        description: "Paper craft animation",
        fields: {
          character_type: "stylized",
          stylized_style: "claymation",
          style: "minimalist",
          color_palette: "earth tones",
          movement: "stop-motion",
          atmosphere: "handcrafted"
        }
      },
      3: {
        name: "Detailed",
        description: "Full paper craft production",
        fields: {
          character_type: "stylized",
          stylized_style: "claymation",
          style: "minimalist",
          color_palette: "earth tones",
          movement: "stop-motion",
          atmosphere: "handcrafted",
          tone: "artistic",
          lighting_type: "natural light",
          music_style: "acoustic",
          emotional_response: "wonder"
        }
      }
    }
  },

  stop_motion_clay: {
    name: "Stop Motion Clay",
    icon: "🏺",
    description: "Tactile claymation with choppy movement and sculptural characters",
    levels: {
      1: {
        name: "Essential",
        description: "Basic claymation",
        fields: {
          character_type: "stylized",
          stylized_style: "claymation",
          movement: "stop-motion"
        }
      },
      2: {
        name: "Standard",
        description: "Clay animation",
        fields: {
          character_type: "stylized",
          stylized_style: "claymation",
          movement: "stop-motion",
          style: "organic",
          color_palette: "earth tones",
          atmosphere: "tactile"
        }
      },
      3: {
        name: "Detailed",
        description: "Full claymation production",
        fields: {
          character_type: "stylized",
          stylized_style: "claymation",
          movement: "stop-motion",
          style: "organic",
          color_palette: "earth tones",
          atmosphere: "tactile",
          tone: "whimsical",
          lighting_type: "studio lighting",
          music_style: "quirky",
          emotional_response: "charm"
        }
      }
    }
  },

  flash_animation: {
    name: "Flash Animation",
    icon: "⚡",
    description: "Vector-based web animation with tweened movement",
    levels: {
      1: {
        name: "Essential",
        description: "Basic vector animation",
        fields: {
          character_type: "stylized",
          stylized_style: "cartoon network",
          style: "clean"
        }
      },
      2: {
        name: "Standard",
        description: "Web animation series",
        fields: {
          character_type: "stylized",
          stylized_style: "cartoon network",
          style: "clean",
          color_palette: "bright",
          movement: "smooth",
          atmosphere: "digital"
        }
      },
      3: {
        name: "Detailed",
        description: "Full web animation production",
        fields: {
          character_type: "stylized",
          stylized_style: "cartoon network",
          style: "clean",
          color_palette: "bright",
          movement: "smooth",
          atmosphere: "digital",
          tone: "modern",
          dialogue: "internet culture",
          music_style: "electronic",
          emotional_response: "viral energy"
        }
      }
    }
  },

  martin_scorsese: {
    name: "Martin Scorsese",
    icon: "🎲",
    description: "Dynamic tracking shots, moral complexity, urban energy",
    levels: {
      1: {
        name: "Essential",
        description: "Scorsese basics",
        fields: {
          movement: "dynamic tracking",
          music_style: "period rock/jazz",
          atmosphere: "urban intensity"
        }
      },
      2: {
        name: "Standard",  
        description: "Classic Scorsese style",
        fields: {
          movement: "dynamic tracking",
          music_style: "period rock/jazz",
          atmosphere: "urban intensity",
          influences: "Martin Scorsese",
          style: "kinetic realism",
          tone: "morally complex"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Scorsese production",
        fields: {
          movement: "dynamic tracking",
          music_style: "period rock/jazz",
          atmosphere: "urban intensity",
          influences: "Martin Scorsese",
          style: "kinetic realism",
          tone: "morally complex",
          color_palette: "saturated urban",
          lighting_type: "dramatic contrast",
          emotional_response: "visceral energy",
          dialogue: "rapid-fire naturalistic"
        }
      }
    }
  },

  ridley_scott: {
    name: "Ridley Scott",
    icon: "⚔️",
    description: "Epic scale, atmospheric world-building, visual grandeur",
    levels: {
      1: {
        name: "Essential",
        description: "Scott basics",
        fields: {
          scale: "epic",
          atmosphere: "atmospheric grandeur",
          lighting_type: "dramatic atmospheric"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Scott style", 
        fields: {
          scale: "epic",
          atmosphere: "atmospheric grandeur",
          lighting_type: "dramatic atmospheric",
          influences: "Ridley Scott",
          style: "epic realism",
          distance: "sweeping wide shots"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Scott production",
        fields: {
          scale: "epic",
          atmosphere: "atmospheric grandeur", 
          lighting_type: "dramatic atmospheric",
          influences: "Ridley Scott",
          style: "epic realism",
          distance: "sweeping wide shots",
          tone: "mythic",
          color_palette: "golden and steel",
          movement: "sweeping camera",
          emotional_response: "awe and dread"
        }
      }
    }
  },

  paul_thomas_anderson: {
    name: "Paul Thomas Anderson",
    icon: "🎭",
    description: "Long takes, ensemble dynamics, American character studies",
    levels: {
      1: {
        name: "Essential",
        description: "PTA basics",
        fields: {
          movement: "long flowing takes",
          style: "American ensemble",
          atmosphere: "character intensity"
        }
      },
      2: {
        name: "Standard",
        description: "Classic PTA style",
        fields: {
          movement: "long flowing takes",
          style: "American ensemble", 
          atmosphere: "character intensity",
          influences: "Paul Thomas Anderson",
          distance: "medium ensemble shots",
          music_style: "eclectic period"
        }
      },
      3: {
        name: "Detailed",
        description: "Full PTA production",
        fields: {
          movement: "long flowing takes",
          style: "American ensemble",
          atmosphere: "character intensity",
          influences: "Paul Thomas Anderson",
          distance: "medium ensemble shots",
          music_style: "eclectic period",
          tone: "darkly comedic",
          lighting_type: "naturalistic complex",
          color_palette: "period authentic",
          emotional_response: "uncomfortable intimacy"
        }
      }
    }
  },

  coen_brothers: {
    name: "Coen Brothers",
    icon: "🎪",
    description: "Quirky dialogue, symmetrical framing, dark comedy",
    levels: {
      1: {
        name: "Essential",
        description: "Coen basics",
        fields: {
          style: "symmetrical framing",
          tone: "darkly comedic",
          dialogue: "quirky distinctive"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Coen style",
        fields: {
          style: "symmetrical framing",
          tone: "darkly comedic", 
          dialogue: "quirky distinctive",
          influences: "Coen Brothers",
          atmosphere: "eccentric americana",
          music_style: "folk/period"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Coen production",
        fields: {
          style: "symmetrical framing",
          tone: "darkly comedic",
          dialogue: "quirky distinctive", 
          influences: "Coen Brothers",
          atmosphere: "eccentric americana",
          music_style: "folk/period",
          color_palette: "muted americana",
          movement: "precise geometric",
          lighting_type: "controlled natural",
          emotional_response: "bemused detachment"
        }
      }
    }
  },

  alfonso_cuaron: {
    name: "Alfonso Cuarón",
    icon: "🌍",
    description: "Long take mastery, intimate epics, technical virtuosity",
    levels: {
      1: {
        name: "Essential",
        description: "Cuarón basics",
        fields: {
          movement: "virtuoso long takes",
          style: "intimate epic",
          technical_setup: "complex choreography"
        }
      },
      2: {
        name: "Standard",
        description: "Classic Cuarón style",
        fields: {
          movement: "virtuoso long takes",
          style: "intimate epic",
          technical_setup: "complex choreography",
          influences: "Alfonso Cuarón",
          lighting_type: "naturalistic precise",
          atmosphere: "immersive realism"
        }
      },
      3: {
        name: "Detailed",
        description: "Full Cuarón production",
        fields: {
          movement: "virtuoso long takes",
          style: "intimate epic",
          technical_setup: "complex choreography",
          influences: "Alfonso Cuarón",
          lighting_type: "naturalistic precise", 
          atmosphere: "immersive realism",
          tone: "humanistic",
          color_palette: "earth and sky",
          distance: "flowing perspective",
          emotional_response: "visceral empathy"
        }
      }
    }
  }
};

// Import preset data for consolidation
import { characterPresets } from './characterPresetsData.js';
import { scenePresets } from './scenePresetsData.js';
import { actionPresets } from './actionPresetsData.js';
import { directorStyles } from './directorStylesData.js';
import { audioPresets } from './audioPresetsData.js';

// Convert preset to template format
const convertPresetToTemplate = (preset) => ({
  name: preset.name,
  icon: "⭐", // Default icon, can be customized per category
  description: preset.description,
  category: preset.category,
  tags: preset.tags,
  useCase: preset.useCase,
  customDetails: preset.customDetails,
  fields: preset.fields, // Direct field mapping - no levels needed for presets
  isPreset: true // Flag to identify converted presets
});

// Convert all presets and add to templates
const convertedPresets = {};

// Add character presets
Object.entries(characterPresets).forEach(([key, preset]) => {
  convertedPresets[key] = {
    ...convertPresetToTemplate(preset),
    icon: "👤"
  };
});

// Add scene presets  
Object.entries(scenePresets).forEach(([key, preset]) => {
  convertedPresets[key] = {
    ...convertPresetToTemplate(preset),
    icon: "📍"
  };
});

// Add action presets
Object.entries(actionPresets).forEach(([key, preset]) => {
  convertedPresets[key] = {
    ...convertPresetToTemplate(preset),
    icon: "🎬"
  };
});

// Add director style presets
Object.entries(directorStyles).forEach(([key, preset]) => {
  convertedPresets[key] = {
    ...convertPresetToTemplate(preset),
    icon: "🎨"
  };
});

// Add audio presets
Object.entries(audioPresets).forEach(([key, preset]) => {
  convertedPresets[key] = {
    ...convertPresetToTemplate(preset),
    icon: "🔊"
  };
});

// Merge original templates with converted presets
export const allTemplates = {
  ...templates,
  ...convertedPresets
};

export const getTemplateFieldCount = (templateKey, level) => {
  const template = allTemplates[templateKey];
  if (!template) return 0;
  
  // For converted presets (no levels)
  if (template.isPreset) {
    return Object.keys(template.fields).length;
  }
  
  // For original templates (with levels)
  if (!template.levels[level]) return 0;
  return Object.keys(template.levels[level].fields).length;
};

export const getAllTemplateKeys = () => {
  return Object.keys(allTemplates);
};

// Helper to check if template is a converted preset
export const isPresetTemplate = (templateKey) => {
  return allTemplates[templateKey]?.isPreset || false;
};

// Get template data (handles both original templates and converted presets)
export const getTemplate = (templateKey) => {
  return allTemplates[templateKey];
};