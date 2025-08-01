export const schema = {
  "categories": [
    {
      "id": "scene_description",
      "label": "Scene Description",
      "fields": [
        { "key": "scene", "type": "textarea", "label": "Scene Description" },
        { "key": "setting", "type": "select", "label": "Setting/Location", "options": ["indoor studio", "outdoor park", "city street", "beach", "forest", "mountains", "desert", "rooftop", "bedroom", "kitchen", "office", "restaurant", "cafe", "warehouse", "subway station", "shopping mall", "downtown plaza", "alley", "bridge", "parking garage", "lake", "waterfall", "cave", "meadow", "library", "gym", "concert hall", "stadium", "movie theater", "amusement park", "art museum", "nightclub", "arcade", "castle courtyard", "roman forum", "fjord", "medieval tavern", "pirate ship", "temple garden", "space station", "cyberpunk street", "alien planet", "laboratory", "robot factory", "time portal chamber", "underwater station", "floating islands", "mirror maze", "art studio", "home theater", "wine cellar", "greenhouse", "workshop", "dance studio", "reading nook", "custom..."], "allowDetails": true, "detailConfig": {
          "beach": {
            "label": "Beach Details",
            "fields": [
              { "key": "beach_type", "type": "select", "label": "Beach Type", "options": ["tropical", "rocky coast", "sandy shore", "cliff beach", "secluded cove", "busy boardwalk"] },
              { "key": "beach_features", "type": "text", "label": "Features", "placeholder": "e.g., palm trees, driftwood, rocks, pier" },
              { "key": "beach_description", "type": "textarea", "label": "Description", "placeholder": "Describe the beach atmosphere, wave size, crowd level..." }
            ]
          },
          "forest": {
            "label": "Forest Details",
            "fields": [
              { "key": "forest_type", "type": "select", "label": "Forest Type", "options": ["dense woodland", "pine forest", "tropical rainforest", "autumn forest", "mystical forest", "bamboo grove"] },
              { "key": "forest_lighting", "type": "select", "label": "Lighting", "options": ["dappled sunlight", "misty morning", "deep shadows", "golden rays", "moonlit clearing"] },
              { "key": "forest_description", "type": "textarea", "label": "Description", "placeholder": "Describe the forest density, sounds, vegetation..." }
            ]
          },
          "city street": {
            "label": "City Street Details",
            "fields": [
              { "key": "street_type", "type": "select", "label": "Street Type", "options": ["busy downtown", "quiet residential", "shopping district", "industrial area", "alleyway", "pedestrian zone"] },
              { "key": "street_activity", "type": "select", "label": "Activity Level", "options": ["crowded", "moderate traffic", "empty", "rush hour", "late night", "weekend bustle"] },
              { "key": "street_description", "type": "textarea", "label": "Description", "placeholder": "Describe architecture, signage, street life..." }
            ]
          },
          "mountains": {
            "label": "Mountain Details",
            "fields": [
              { "key": "mountain_type", "type": "select", "label": "Mountain Type", "options": ["snow-capped peaks", "rolling hills", "rocky cliffs", "alpine meadow", "valley vista", "mountain lake"] },
              { "key": "mountain_weather", "type": "select", "label": "Weather", "options": ["clear skies", "misty clouds", "dramatic storm", "golden sunset", "fresh snow"] },
              { "key": "mountain_description", "type": "textarea", "label": "Description", "placeholder": "Describe the mountain landscape, elevation, vegetation..." }
            ]
          },
          "rooftop": {
            "label": "Rooftop Details",
            "fields": [
              { "key": "rooftop_type", "type": "select", "label": "Rooftop Type", "options": ["urban skyline", "penthouse terrace", "industrial rooftop", "garden rooftop", "water tower access", "fire escape"] },
              { "key": "rooftop_view", "type": "text", "label": "View", "placeholder": "e.g., city lights, sunset, ocean, mountains" },
              { "key": "rooftop_description", "type": "textarea", "label": "Description", "placeholder": "Describe the rooftop setup, safety barriers, atmosphere..." }
            ]
          }
        } },
        { "key": "time_of_day", "type": "select", "label": "Time of Day", "options": ["morning", "afternoon", "sunset", "night", "golden hour", "blue hour", "dawn", "dusk", "noon", "custom..."], "allowDetails": true, "detailConfig": {
          "golden hour": {
            "label": "Golden Hour Details",
            "fields": [
              { "key": "golden_timing", "type": "select", "label": "Timing", "options": ["early golden hour", "peak golden light", "late golden hour", "just before sunset"] },
              { "key": "golden_intensity", "type": "select", "label": "Light Intensity", "options": ["soft warm glow", "brilliant golden", "deep amber", "honeyed light"] },
              { "key": "golden_description", "type": "textarea", "label": "Description", "placeholder": "Describe the lighting quality, shadow length, atmosphere..." }
            ]
          },
          "blue hour": {
            "label": "Blue Hour Details",
            "fields": [
              { "key": "blue_phase", "type": "select", "label": "Blue Hour Phase", "options": ["early blue hour", "deep blue", "twilight transition", "near darkness"] },
              { "key": "blue_lighting", "type": "select", "label": "Artificial Lighting", "options": ["city lights emerging", "street lamps on", "window glow", "neon signs", "minimal artificial"] },
              { "key": "blue_description", "type": "textarea", "label": "Description", "placeholder": "Describe the blue tones, contrast with artificial lights..." }
            ]
          },
          "sunset": {
            "label": "Sunset Details",
            "fields": [
              { "key": "sunset_stage", "type": "select", "label": "Sunset Stage", "options": ["early sunset", "sun touching horizon", "sun half-set", "final rays", "afterglow"] },
              { "key": "sunset_colors", "type": "text", "label": "Sky Colors", "placeholder": "e.g., orange, pink, purple, red gradients" },
              { "key": "sunset_description", "type": "textarea", "label": "Description", "placeholder": "Describe the sky colors, cloud formations, lighting..." }
            ]
          },
          "night": {
            "label": "Night Details",
            "fields": [
              { "key": "night_type", "type": "select", "label": "Night Type", "options": ["clear starry night", "moonlit", "city night", "overcast night", "stormy night", "foggy night"] },
              { "key": "night_lighting", "type": "select", "label": "Primary Lighting", "options": ["moonlight", "street lights", "neon signs", "car headlights", "window glow", "minimal lighting"] },
              { "key": "night_description", "type": "textarea", "label": "Description", "placeholder": "Describe the darkness level, artificial lighting, mood..." }
            ]
          },
          "dawn": {
            "label": "Dawn Details",
            "fields": [
              { "key": "dawn_stage", "type": "select", "label": "Dawn Stage", "options": ["pre-dawn", "first light", "sunrise", "early morning", "full daylight"] },
              { "key": "dawn_atmosphere", "type": "select", "label": "Atmosphere", "options": ["misty", "crisp and clear", "humid", "dewy", "foggy"] },
              { "key": "dawn_description", "type": "textarea", "label": "Description", "placeholder": "Describe the emerging light, colors, freshness..." }
            ]
          }
        } },
        { "key": "environment", "type": "select", "label": "Environmental Details", "options": ["sunny", "cloudy", "rainy", "snowy", "foggy", "windy", "stormy", "misty", "humid", "dry", "hot", "cold", "dramatic sky", "clear sky", "custom..."], "allowDetails": true, "detailConfig": {
          "stormy": {
            "label": "Storm Details",
            "fields": [
              { "key": "storm_intensity", "type": "select", "label": "Storm Intensity", "options": ["light storm", "moderate storm", "heavy storm", "severe thunderstorm", "approaching storm"] },
              { "key": "storm_elements", "type": "text", "label": "Storm Elements", "placeholder": "e.g., lightning, heavy rain, wind, hail" },
              { "key": "storm_description", "type": "textarea", "label": "Description", "placeholder": "Describe the storm atmosphere, sky color, dramatic effects..." }
            ]
          },
          "foggy": {
            "label": "Fog Details",
            "fields": [
              { "key": "fog_density", "type": "select", "label": "Fog Density", "options": ["light mist", "moderate fog", "thick fog", "dense fog", "patchy fog"] },
              { "key": "fog_type", "type": "select", "label": "Fog Type", "options": ["morning mist", "sea fog", "ground fog", "radiation fog", "mystical fog"] },
              { "key": "fog_description", "type": "textarea", "label": "Description", "placeholder": "Describe visibility, mood, lighting effects through fog..." }
            ]
          },
          "rainy": {
            "label": "Rain Details",
            "fields": [
              { "key": "rain_intensity", "type": "select", "label": "Rain Intensity", "options": ["light drizzle", "steady rain", "heavy rain", "downpour", "scattered showers"] },
              { "key": "rain_atmosphere", "type": "select", "label": "Atmosphere", "options": ["refreshing", "gloomy", "dramatic", "cozy", "melancholic", "cleansing"] },
              { "key": "rain_description", "type": "textarea", "label": "Description", "placeholder": "Describe puddles, reflections, sound, people's reactions..." }
            ]
          },
          "snowy": {
            "label": "Snow Details",
            "fields": [
              { "key": "snow_intensity", "type": "select", "label": "Snow Intensity", "options": ["light flurries", "steady snowfall", "heavy snow", "blizzard", "fresh powder"] },
              { "key": "snow_condition", "type": "select", "label": "Snow Condition", "options": ["falling snow", "fresh snow on ground", "deep snow", "slushy snow", "ice and snow"] },
              { "key": "snow_description", "type": "textarea", "label": "Description", "placeholder": "Describe snow accumulation, winter atmosphere, visibility..." }
            ]
          },
          "windy": {
            "label": "Wind Details",
            "fields": [
              { "key": "wind_strength", "type": "select", "label": "Wind Strength", "options": ["gentle breeze", "moderate wind", "strong wind", "gusty wind", "gale force"] },
              { "key": "wind_effects", "type": "text", "label": "Wind Effects", "placeholder": "e.g., leaves blowing, hair movement, clothing flutter" },
              { "key": "wind_description", "type": "textarea", "label": "Description", "placeholder": "Describe the wind's impact on the scene, sound, movement..." }
            ]
          },
          "dramatic sky": {
            "label": "Dramatic Sky Details",
            "fields": [
              { "key": "sky_type", "type": "select", "label": "Sky Type", "options": ["dark storm clouds", "colorful sunset", "threatening clouds", "epic cloud formations", "otherworldly sky"] },
              { "key": "sky_colors", "type": "text", "label": "Sky Colors", "placeholder": "e.g., deep purples, fiery oranges, ominous grays" },
              { "key": "sky_description", "type": "textarea", "label": "Description", "placeholder": "Describe cloud formations, lighting contrasts, drama..." }
            ]
          }
        } }
      ]
    },
    {
      "id": "subjects",
      "label": "Characters & People",
      "fields": [
        { "key": "characters", "type": "character_manager", "label": "Characters" },
        { "key": "character_type", "type": "select", "label": "Character Type", "options": ["human", "animal", "robot", "stylized", "object", "creature", "custom..."] },
        { "key": "character_name", "type": "text", "label": "Character Name", "placeholder": "e.g., Sarah, Marcus, Luna, etc." },
        { "key": "secondary_subjects", "type": "text", "label": "Secondary Subjects (comma-separated)" },
        { "key": "number_of_subjects", "type": "number", "label": "Number of Subjects" },
        { "key": "actions", "type": "select", "label": "Actions", "options": ["walking", "running", "dancing", "jumping", "sitting", "standing", "talking", "laughing", "crying", "singing", "working", "eating", "drinking", "sleeping", "fighting", "hugging", "waving", "pointing", "flying", "swimming", "programming", "creating", "performing", "teaching", "healing", "protecting", "exploring", "transforming", "glitching", "powering up", "casting spells", "driving", "cooking", "painting", "custom..."], "allowDetails": true, "detailConfig": {
          "dancing": {
            "label": "Dance Details",
            "fields": [
              { "key": "dance_style", "type": "select", "label": "Dance Style", "options": ["ballet", "hip hop", "contemporary", "ballroom", "freestyle", "breakdancing", "salsa", "jazz", "folk dance"] },
              { "key": "dance_energy", "type": "select", "label": "Energy Level", "options": ["graceful", "energetic", "passionate", "rhythmic", "expressive", "powerful"] },
              { "key": "dance_description", "type": "textarea", "label": "Description", "placeholder": "Describe the dance movements, rhythm, expression..." }
            ]
          },
          "fighting": {
            "label": "Fighting Details",
            "fields": [
              { "key": "fight_style", "type": "select", "label": "Fighting Style", "options": ["martial arts", "boxing", "sword fighting", "hand-to-hand", "defensive", "aggressive", "magic combat"] },
              { "key": "fight_intensity", "type": "select", "label": "Intensity", "options": ["sparring", "intense combat", "defensive stance", "all-out battle", "controlled"] },
              { "key": "fight_description", "type": "textarea", "label": "Description", "placeholder": "Describe combat style, weapons, defensive or offensive..." }
            ]
          },
          "running": {
            "label": "Running Details",
            "fields": [
              { "key": "running_style", "type": "select", "label": "Running Style", "options": ["jogging", "sprinting", "marathon pace", "casual run", "urgent escape", "athletic stride"] },
              { "key": "running_context", "type": "select", "label": "Context", "options": ["exercise", "chase scene", "competitive race", "urgent mission", "playful", "training"] },
              { "key": "running_description", "type": "textarea", "label": "Description", "placeholder": "Describe pace, breathing, determination, purpose..." }
            ]
          },
          "performing": {
            "label": "Performance Details",
            "fields": [
              { "key": "performance_type", "type": "select", "label": "Performance Type", "options": ["singing", "acting", "magic show", "comedy", "music", "poetry", "storytelling"] },
              { "key": "performance_stage", "type": "select", "label": "Setting", "options": ["stage", "street performance", "intimate venue", "grand theater", "casual setting"] },
              { "key": "performance_description", "type": "textarea", "label": "Description", "placeholder": "Describe the performance style, audience, energy..." }
            ]
          },
          "creating": {
            "label": "Creative Details",
            "fields": [
              { "key": "creation_type", "type": "select", "label": "Creative Activity", "options": ["painting", "sculpting", "writing", "crafting", "building", "designing", "composing"] },
              { "key": "creation_focus", "type": "select", "label": "Focus Level", "options": ["deeply concentrated", "inspired flow", "careful precision", "experimental", "passionate"] },
              { "key": "creation_description", "type": "textarea", "label": "Description", "placeholder": "Describe the creative process, tools, inspiration..." }
            ]
          }
        } },
        { "key": "emotions", "type": "select", "label": "Emotions/Mood", "options": ["happy", "sad", "angry", "surprised", "excited", "calm", "nervous", "confident", "thoughtful", "playful", "serious", "romantic", "mysterious", "determined", "frustrated", "joyful", "curious", "wise", "innocent", "mischievous", "heroic", "villainous", "confused", "enlightened", "protective", "friendly", "fierce", "gentle", "majestic", "quirky", "custom..."], "allowDetails": true, "detailConfig": {
          "mysterious": {
            "label": "Mysterious Emotion Details",
            "fields": [
              { "key": "mystery_intensity", "type": "select", "label": "Intensity", "options": ["subtly enigmatic", "deeply mysterious", "intriguingly secretive", "ominously mysterious", "playfully mysterious"] },
              { "key": "mystery_expression", "type": "select", "label": "Expression", "options": ["knowing smile", "distant gaze", "raised eyebrow", "half-hidden face", "piercing stare"] },
              { "key": "mystery_description", "type": "textarea", "label": "Description", "placeholder": "Describe the mysterious aura, body language, hidden knowledge..." }
            ]
          },
          "confident": {
            "label": "Confidence Details",
            "fields": [
              { "key": "confidence_type", "type": "select", "label": "Confidence Type", "options": ["quiet confidence", "bold confidence", "natural assurance", "commanding presence", "self-assured"] },
              { "key": "confidence_posture", "type": "select", "label": "Posture", "options": ["straight shoulders", "head held high", "relaxed stance", "authoritative pose", "graceful bearing"] },
              { "key": "confidence_description", "type": "textarea", "label": "Description", "placeholder": "Describe the confident energy, presence, self-assurance..." }
            ]
          },
          "romantic": {
            "label": "Romantic Emotion Details",
            "fields": [
              { "key": "romance_type", "type": "select", "label": "Romance Type", "options": ["tender love", "passionate romance", "sweet affection", "deep devotion", "playful flirtation"] },
              { "key": "romance_expression", "type": "select", "label": "Expression", "options": ["loving gaze", "gentle smile", "blushing", "soft touch", "dreamy look"] },
              { "key": "romance_description", "type": "textarea", "label": "Description", "placeholder": "Describe the romantic feelings, tenderness, connection..." }
            ]
          },
          "determined": {
            "label": "Determination Details", 
            "fields": [
              { "key": "determination_intensity", "type": "select", "label": "Intensity", "options": ["quietly determined", "fiercely determined", "unwavering resolve", "gritty determination", "focused drive"] },
              { "key": "determination_focus", "type": "select", "label": "Focus", "options": ["goal-oriented", "obstacle-overcoming", "mission-driven", "challenge-facing", "future-focused"] },
              { "key": "determination_description", "type": "textarea", "label": "Description", "placeholder": "Describe the determination, willpower, inner strength..." }
            ]
          },
          "heroic": {
            "label": "Heroic Emotion Details",
            "fields": [
              { "key": "heroic_type", "type": "select", "label": "Heroic Type", "options": ["noble hero", "reluctant hero", "brave protector", "selfless savior", "inspiring leader"] },
              { "key": "heroic_stance", "type": "select", "label": "Stance", "options": ["protective pose", "ready for action", "inspiring presence", "humble strength", "courageous bearing"] },
              { "key": "heroic_description", "type": "textarea", "label": "Description", "placeholder": "Describe the heroic spirit, courage, selflessness..." }
            ]
          }
        } }
      ]
    },
    {
      "id": "character_details",
      "label": "Character Details",
      "fields": [
        { "key": "gender", "type": "select", "label": "Gender", "options": ["male", "female", "non-binary", "unspecified", "custom..."], "dependency": "character_type", "dependsOn": ["human", "stylized"] },
        { "key": "age_range", "type": "select", "label": "Age Range", "options": ["infant", "toddler", "child (5-10)", "preteen (11-13)", "teenager (14-17)", "young adult (18-25)", "adult (26-40)", "middle-aged (41-60)", "elderly (60+)", "ancient (80+)", "custom..."], "dependency": "character_type", "dependsOn": ["human", "stylized"] },
        { "key": "ethnicity", "type": "select", "label": "Ethnicity", "options": ["caucasian", "african", "asian", "hispanic/latino", "middle eastern", "native american", "pacific islander", "indian", "mixed race", "ambiguous ethnicity", "custom..."], "dependency": "character_type", "dependsOn": ["human", "stylized"] },
        { "key": "body_type", "type": "select", "label": "Body Type", "options": ["slim", "athletic", "average", "curvy", "muscular", "stocky", "plus-size", "petite", "tall", "lanky", "custom..."], "dependency": "character_type", "dependsOn": ["human", "stylized"], "allowDetails": true, "detailConfig": {
          "athletic": {
            "label": "Athletic Body Details",
            "fields": [
              { "key": "athletic_type", "type": "select", "label": "Athletic Type", "options": ["runner's build", "swimmer's build", "gymnast", "dancer", "martial artist", "general fitness"] },
              { "key": "athletic_definition", "type": "select", "label": "Muscle Definition", "options": ["toned", "defined", "lean muscle", "well-developed", "subtle definition"] },
              { "key": "athletic_description", "type": "textarea", "label": "Description", "placeholder": "Describe posture, fitness level, specific athletic traits..." }
            ]
          },
          "muscular": {
            "label": "Muscular Body Details", 
            "fields": [
              { "key": "muscle_type", "type": "select", "label": "Muscle Type", "options": ["bodybuilder", "powerlifter", "functional strength", "lean muscle", "bulky muscle"] },
              { "key": "muscle_size", "type": "select", "label": "Muscle Size", "options": ["moderately muscular", "very muscular", "extremely muscular", "naturally strong", "lean and strong"] },
              { "key": "muscle_description", "type": "textarea", "label": "Description", "placeholder": "Describe muscle development, symmetry, overall physique..." }
            ]
          },
          "curvy": {
            "label": "Curvy Body Details",
            "fields": [
              { "key": "curve_type", "type": "select", "label": "Body Shape", "options": ["hourglass", "pear shape", "apple shape", "full figure", "classic curves"] },
              { "key": "curve_proportion", "type": "select", "label": "Proportions", "options": ["balanced curves", "bottom heavy", "top heavy", "full curves", "subtle curves"] },
              { "key": "curve_description", "type": "textarea", "label": "Description", "placeholder": "Describe body proportions, confidence, natural beauty..." }
            ]
          },
          "petite": {
            "label": "Petite Body Details",
            "fields": [
              { "key": "petite_build", "type": "select", "label": "Build Type", "options": ["delicate frame", "compact", "small but strong", "graceful", "fine-boned"] },
              { "key": "petite_proportions", "type": "select", "label": "Proportions", "options": ["well-proportioned", "long-limbed", "compact build", "balanced", "elegant"] },
              { "key": "petite_description", "type": "textarea", "label": "Description", "placeholder": "Describe stature, elegance, presence..." }
            ]
          }
        } },
        { "key": "hair_color", "type": "select", "label": "Hair Color", "options": ["blonde", "brown", "black", "red", "gray", "white", "silver", "auburn", "strawberry blonde", "dirty blonde", "platinum", "rainbow", "blue", "pink", "green", "purple", "custom..."], "dependency": "character_type", "dependsOn": ["human", "stylized"], "allowDetails": true, "detailConfig": {
          "rainbow": {
            "label": "Rainbow Hair Details",
            "fields": [
              { "key": "rainbow_pattern", "type": "select", "label": "Color Pattern", "options": ["traditional rainbow", "pastel rainbow", "ombre rainbow", "rainbow streaks", "rainbow tips"] },
              { "key": "rainbow_colors", "type": "text", "label": "Specific Colors", "placeholder": "e.g., pink, blue, purple, green" },
              { "key": "rainbow_description", "type": "textarea", "label": "Description", "placeholder": "Describe the color transitions, vibrancy, styling..." }
            ]
          },
          "red": {
            "label": "Red Hair Details",
            "fields": [
              { "key": "red_shade", "type": "select", "label": "Red Shade", "options": ["copper red", "auburn", "strawberry blonde", "deep burgundy", "bright red", "ginger"] },
              { "key": "red_intensity", "type": "select", "label": "Intensity", "options": ["natural", "vibrant", "subtle", "bold", "fiery"] },
              { "key": "red_description", "type": "textarea", "label": "Description", "placeholder": "Describe the red tone, natural or dyed, shine..." }
            ]
          },
          "blonde": {
            "label": "Blonde Hair Details",
            "fields": [
              { "key": "blonde_shade", "type": "select", "label": "Blonde Shade", "options": ["platinum blonde", "golden blonde", "honey blonde", "ash blonde", "dirty blonde", "strawberry blonde"] },
              { "key": "blonde_highlights", "type": "select", "label": "Highlights", "options": ["no highlights", "subtle highlights", "chunky highlights", "balayage", "ombre"] },
              { "key": "blonde_description", "type": "textarea", "label": "Description", "placeholder": "Describe the blonde tone, processing, natural look..." }
            ]
          },
          "blue": {
            "label": "Blue Hair Details", 
            "fields": [
              { "key": "blue_shade", "type": "select", "label": "Blue Shade", "options": ["electric blue", "navy blue", "teal", "sky blue", "midnight blue", "pastel blue"] },
              { "key": "blue_coverage", "type": "select", "label": "Coverage", "options": ["full head", "tips only", "streaks", "underneath layer", "ombre"] },
              { "key": "blue_description", "type": "textarea", "label": "Description", "placeholder": "Describe the blue intensity, fade, styling..." }
            ]
          }
        } },
        { "key": "hair_style", "type": "select", "label": "Hair Style", "options": ["long straight", "long curly", "short", "buzz cut", "bob", "pixie cut", "braids", "ponytail", "messy", "afro", "dreadlocks", "bald", "mohawk", "man bun", "custom..."], "dependency": "character_type", "dependsOn": ["human", "stylized"], "allowDetails": true, "detailConfig": {
          "braids": {
            "label": "Braid Details",
            "fields": [
              { "key": "braid_type", "type": "select", "label": "Braid Type", "options": ["single braid", "twin braids", "french braid", "dutch braid", "fishtail braid", "crown braid"] },
              { "key": "braid_length", "type": "select", "label": "Length", "options": ["shoulder length", "mid-back", "waist length", "short braids"] },
              { "key": "braid_description", "type": "textarea", "label": "Description", "placeholder": "Describe braid styling, accessories, texture..." }
            ]
          },
          "long curly": {
            "label": "Curly Hair Details",
            "fields": [
              { "key": "curl_pattern", "type": "select", "label": "Curl Pattern", "options": ["loose waves", "spiral curls", "tight curls", "ringlets", "beach waves", "natural texture"] },
              { "key": "curl_volume", "type": "select", "label": "Volume", "options": ["voluminous", "controlled", "wild and free", "sleek curls", "bouncy"] },
              { "key": "curl_description", "type": "textarea", "label": "Description", "placeholder": "Describe curl definition, shine, movement..." }
            ]
          },
          "ponytail": {
            "label": "Ponytail Details", 
            "fields": [
              { "key": "ponytail_height", "type": "select", "label": "Height", "options": ["high ponytail", "mid ponytail", "low ponytail", "side ponytail"] },
              { "key": "ponytail_style", "type": "select", "label": "Style", "options": ["sleek", "messy", "braided ponytail", "twisted", "voluminous"] },
              { "key": "ponytail_description", "type": "textarea", "label": "Description", "placeholder": "Describe ponytail styling, accessories, texture..." }
            ]
          },
          "afro": {
            "label": "Afro Details",
            "fields": [
              { "key": "afro_size", "type": "select", "label": "Size", "options": ["small afro", "medium afro", "large afro", "shaped afro", "natural afro"] },
              { "key": "afro_texture", "type": "select", "label": "Texture", "options": ["soft and fluffy", "defined texture", "dense", "voluminous", "natural texture"] },
              { "key": "afro_description", "type": "textarea", "label": "Description", "placeholder": "Describe afro shape, definition, natural beauty..." }
            ]
          }
        } },
        { "key": "eye_color", "type": "select", "label": "Eye Color", "options": ["brown", "blue", "green", "hazel", "gray", "amber", "violet", "heterochromia", "black", "light blue", "dark brown", "custom..."], "dependency": "character_type", "dependsOn": ["human", "stylized"] },
        { "key": "skin_tone", "type": "select", "label": "Skin Tone", "options": ["pale", "fair", "light", "medium", "olive", "tan", "dark", "deep", "porcelain", "bronze", "ebony", "custom..."], "dependency": "character_type", "dependsOn": ["human", "stylized"] },
        { "key": "distinguishing_features", "type": "select", "label": "Distinguishing Features", "options": ["freckles", "dimples", "scars", "tattoos", "piercings", "birthmarks", "glasses", "beard", "mustache", "clean-shaven", "none", "custom..."], "dependency": "character_type", "dependsOn": ["human", "stylized"], "allowDetails": true, "detailConfig": {
          "tattoos": {
            "label": "Tattoo Details",
            "fields": [
              { "key": "tattoo_style", "type": "select", "label": "Style", "options": ["tribal", "realistic", "traditional", "geometric", "watercolor", "minimalist", "japanese", "american traditional"] },
              { "key": "tattoo_location", "type": "text", "label": "Location", "placeholder": "e.g., left arm, chest, back" },
              { "key": "tattoo_description", "type": "textarea", "label": "Description", "placeholder": "Describe the tattoo design, colors, size..." }
            ]
          },
          "scars": {
            "label": "Scar Details", 
            "fields": [
              { "key": "scar_type", "type": "select", "label": "Type", "options": ["surgical", "battle", "accident", "burn", "claw marks"] },
              { "key": "scar_location", "type": "text", "label": "Location", "placeholder": "e.g., across face, on hand" },
              { "key": "scar_description", "type": "textarea", "label": "Description", "placeholder": "Describe the scars..." }
            ]
          },
          "piercings": {
            "label": "Piercing Details",
            "fields": [
              { "key": "piercing_type", "type": "select", "label": "Type", "options": ["ear", "nose", "eyebrow", "lip", "tongue", "multiple"] },
              { "key": "piercing_description", "type": "textarea", "label": "Description", "placeholder": "Describe the piercings, jewelry style..." }
            ]
          }
        } },
        { "key": "animal_species", "type": "select", "label": "Animal Species", "options": ["domestic cat", "domestic dog", "wild lion", "tiger", "leopard", "bear", "wolf", "fox", "bird", "eagle", "owl", "fish", "horse", "elephant", "monkey", "dragon", "unicorn", "phoenix", "griffin", "custom..."], "dependency": "character_type", "dependsOn": ["animal"] },
        { "key": "animal_color", "type": "select", "label": "Animal Color", "options": ["black", "white", "brown", "gray", "orange", "golden", "silver", "red", "multicolored", "striped", "spotted", "rainbow", "magical colors", "custom..."], "dependency": "character_type", "dependsOn": ["animal"] },
        { "key": "robot_style", "type": "select", "label": "Robot Style", "options": ["humanoid android", "mechanical robot", "AI assistant", "cyborg", "hologram", "futuristic AI", "steampunk robot", "battle mech", "companion bot", "custom..."], "dependency": "character_type", "dependsOn": ["robot"] },
        { "key": "robot_material", "type": "select", "label": "Robot Material", "options": ["metallic chrome", "matte black", "white plastic", "carbon fiber", "translucent", "holographic", "rusted metal", "steampunk brass", "energy-based", "custom..."], "dependency": "character_type", "dependsOn": ["robot"] },
        { "key": "stylized_style", "type": "select", "label": "Animation Style", "options": ["pixar style", "anime character", "disney style", "cartoon network", "studio ghibli", "comic book", "video game", "claymation", "manga style", "chibi", "custom..."], "dependency": "character_type", "dependsOn": ["stylized"] },
        { "key": "object_type", "type": "select", "label": "Object Type", "options": [
          // VEHICLES & TRANSPORTATION
          "car", "truck", "motorcycle", "bicycle", "scooter", "skateboard", "boat", "ship", "submarine", "yacht", "sailboat", "airplane", "helicopter", "drone", "train", "bus", "taxi", "ambulance", "fire truck", "police car", "sports car", "van", "spacecraft", "rocket",
          
          // BUILDINGS & ARCHITECTURE  
          "house", "apartment", "mansion", "cottage", "castle", "palace", "church", "cathedral", "temple", "school", "university", "library", "hospital", "office building", "skyscraper", "warehouse", "factory", "barn", "lighthouse", "tower", "bridge", "monument", "statue", "fountain", "stadium", "theater", "restaurant", "cafe", "hotel", "shopping mall", "store",
          
          // HOUSEHOLD OBJECTS
          "chair", "table", "sofa", "bed", "dresser", "bookshelf", "desk", "lamp", "mirror", "clock", "vase", "television", "computer", "laptop", "smartphone", "refrigerator", "stove", "microwave", "washing machine", "vacuum cleaner", "toaster", "coffee maker", "plate", "cup", "mug", "spoon", "fork", "knife", "keys", "wallet", "backpack", "umbrella", "sunglasses", "watch", "jewelry",
          
          // MUSICAL INSTRUMENTS
          "piano", "guitar", "violin", "drums", "trumpet", "saxophone", "flute", "harmonica", "microphone", "speaker", "headphones",
          
          // TOOLS & EQUIPMENT
          "hammer", "screwdriver", "wrench", "saw", "drill", "ladder", "flashlight", "camera", "telescope", "microscope", "calculator", "pen", "pencil", "paintbrush", "scissors", "knife",
          
          // TECHNOLOGY & GADGETS
          "robot", "smartphone", "tablet", "computer", "gaming console", "virtual reality headset", "smart watch", "drone", "3D printer", "solar panel", "battery", "circuit board",
          
          // NATURE & ORGANIC
          "tree", "flower", "plant", "rock", "stone", "crystal", "gem", "shell", "feather", "leaf", "fruit", "vegetable", "mushroom", "cloud", "lightning", "fire", "ice", "snow",
          
          // FANTASY & MAGICAL
          "magic wand", "crystal ball", "spell book", "potion bottle", "magical sword", "enchanted armor", "treasure chest", "dragon egg", "unicorn horn", "fairy dust", "magic ring", "portal", "altar", "crown", "staff", "orb",
          
          "custom..."
        ], "dependency": "character_type", "dependsOn": ["object"], "allowDetails": true, "detailConfig": {
          "car": {
            "label": "Car Details",
            "fields": [
              { "key": "car_type", "type": "select", "label": "Car Type", "options": ["sedan", "SUV", "sports car", "convertible", "hatchback", "truck", "van", "electric car", "vintage car", "race car"] },
              { "key": "car_color", "type": "select", "label": "Color", "options": ["red", "blue", "black", "white", "silver", "green", "yellow", "purple", "orange", "pink"] },
              { "key": "car_condition", "type": "select", "label": "Condition", "options": ["brand new", "well-maintained", "slightly worn", "rusty", "damaged", "vintage restored"] },
              { "key": "car_description", "type": "textarea", "label": "Description", "placeholder": "Describe the car's appearance, features, style..." }
            ]
          },
          "skyscraper": {
            "label": "Skyscraper Details",
            "fields": [
              { "key": "building_height", "type": "select", "label": "Height", "options": ["20-30 floors", "30-50 floors", "50-80 floors", "80+ floors", "supertall"] },
              { "key": "building_style", "type": "select", "label": "Architectural Style", "options": ["modern glass", "art deco", "brutalist", "neoclassical", "futuristic", "mixed use"] },
              { "key": "building_condition", "type": "select", "label": "Condition", "options": ["newly built", "well-maintained", "aging", "under construction", "abandoned", "being demolished"] },
              { "key": "building_description", "type": "textarea", "label": "Description", "placeholder": "Describe the building's appearance, features, surroundings..." }
            ]
          },
          "magic wand": {
            "label": "Magic Wand Details",
            "fields": [
              { "key": "wand_material", "type": "select", "label": "Material", "options": ["oak wood", "cherry wood", "holly", "crystal", "metal", "bone", "enchanted wood"] },
              { "key": "wand_core", "type": "select", "label": "Core", "options": ["phoenix feather", "dragon heartstring", "unicorn hair", "crystal shard", "star fragment", "ancient rune"] },
              { "key": "wand_length", "type": "select", "label": "Length", "options": ["short (6-8 inches)", "standard (9-12 inches)", "long (13-15 inches)", "staff-length"] },
              { "key": "wand_power", "type": "text", "label": "Magical Properties", "placeholder": "e.g., fire magic, healing, teleportation, illusion" },
              { "key": "wand_description", "type": "textarea", "label": "Description", "placeholder": "Describe the wand's appearance, engravings, magical aura..." }
            ]
          }
        }, "dependency": "character_type", "dependsOn": ["object"] },
        { "key": "creature_type", "type": "select", "label": "Creature Type", "options": ["mythical", "sci-fi", "fantasy", "supernatural", "custom..."], "dependency": "character_type", "dependsOn": ["creature"], "allowDetails": true, "detailConfig": {
          "mythical": {
            "label": "Mythical Creature Details",
            "fields": [
              { "key": "mythical_species", "type": "select", "label": "Species", "options": ["sasquatch/bigfoot", "unicorn", "dragon", "phoenix", "griffin", "pegasus", "centaur", "minotaur", "sphinx", "kraken", "sea serpent", "thunderbird", "chupacabra", "yeti"] },
              { "key": "mythical_size", "type": "select", "label": "Size", "options": ["tiny", "small", "human-sized", "large", "giant", "colossal"] },
              { "key": "mythical_powers", "type": "text", "label": "Special Powers", "placeholder": "e.g., flight, fire breathing, healing magic, invisibility" },
              { "key": "mythical_appearance", "type": "textarea", "label": "Appearance Details", "placeholder": "Describe coloring, features, magical elements..." }
            ]
          },
          "sci-fi": {
            "label": "Sci-Fi Creature Details",
            "fields": [
              { "key": "scifi_species", "type": "select", "label": "Species", "options": ["storm trooper", "alien (gray)", "alien (reptilian)", "cyborg", "mutant", "android", "space marine", "genetically enhanced", "alien warrior", "bio-mechanical hybrid", "energy being", "synthetic life"] },
              { "key": "scifi_origin", "type": "select", "label": "Origin", "options": ["galactic empire", "rebel alliance", "alien planet", "laboratory experiment", "future earth", "parallel dimension", "space station", "crashed ship"] },
              { "key": "scifi_tech", "type": "text", "label": "Technology/Weapons", "placeholder": "e.g., blaster, energy sword, plasma cannon, force powers" },
              { "key": "scifi_appearance", "type": "textarea", "label": "Appearance Details", "placeholder": "Describe armor, cybernetics, alien features..." }
            ]
          },
          "fantasy": {
            "label": "Fantasy Creature Details",
            "fields": [
              { "key": "fantasy_species", "type": "select", "label": "Species", "options": ["elf", "dwarf", "orc", "goblin", "troll", "ogre", "hobbit/halfling", "tiefling", "dragonborn", "fairy", "pixie", "gnome", "drow", "wood elf", "dark elf", "high elf"] },
              { "key": "fantasy_culture", "type": "select", "label": "Culture/Clan", "options": ["forest dweller", "mountain clan", "underground society", "noble court", "warrior tribe", "magical academy", "ancient civilization", "nomadic group"] },
              { "key": "fantasy_abilities", "type": "text", "label": "Abilities/Magic", "placeholder": "e.g., archery mastery, earth magic, berserker rage, stealth" },
              { "key": "fantasy_appearance", "type": "textarea", "label": "Appearance Details", "placeholder": "Describe ears, height, build, magical markings..." }
            ]
          },
          "supernatural": {
            "label": "Supernatural Creature Details",
            "fields": [
              { "key": "supernatural_species", "type": "select", "label": "Species", "options": ["vampire", "werewolf", "ghost", "demon", "angel", "banshee", "poltergeist", "shadow being", "spirit", "wraith", "incubus/succubus", "reaper", "djinn/genie", "mummy"] },
              { "key": "supernatural_age", "type": "select", "label": "Age", "options": ["newly turned", "decades old", "centuries old", "ancient", "immortal", "ageless", "recently deceased"] },
              { "key": "supernatural_powers", "type": "text", "label": "Supernatural Powers", "placeholder": "e.g., shape shifting, mind control, telekinesis, phasing" },
              { "key": "supernatural_weakness", "type": "text", "label": "Weaknesses", "placeholder": "e.g., silver, holy water, sunlight, iron" },
              { "key": "supernatural_appearance", "type": "textarea", "label": "Appearance Details", "placeholder": "Describe ethereal qualities, transformations, aura..." }
            ]
          }
        } },
        { "key": "clothing", "type": "select", "label": "Clothing/Costume", "options": ["casual wear", "formal wear", "business attire", "sportswear", "vintage clothing", "futuristic outfit", "historical costume", "uniform", "traditional dress", "swimwear", "winter coat", "summer dress", "fantasy armor", "sci-fi suit", "robot chassis", "mechanical parts", "holographic projection", "anime outfit", "cartoon style", "pixar clothing", "magical garments", "no clothing", "natural fur/skin", "scales/feathers", "custom..."], "allowDetails": true, "detailConfig": {
          "casual wear": {
            "label": "Casual Wear Details",
            "fields": [
              { "key": "shirt_type", "type": "select", "label": "Shirt/Top", "options": ["t-shirt", "tank top", "hoodie", "sweatshirt", "button-down shirt", "blouse", "cardigan", "crop top", "long sleeve", "flannel", "polo shirt", "henley"] },
              { "key": "shirt_color", "type": "select", "label": "Top Color", "options": ["white", "black", "gray", "blue", "red", "green", "yellow", "purple", "pink", "orange", "navy", "maroon", "striped", "plaid", "graphic print"] },
              { "key": "shirt_fit", "type": "select", "label": "Top Fit", "options": ["fitted", "loose", "oversized", "slim fit", "regular fit", "baggy", "tailored"] },
              { "key": "pants_type", "type": "select", "label": "Bottoms", "options": ["jeans", "shorts", "sweatpants", "leggings", "joggers", "khakis", "cargo pants", "athletic shorts", "denim shorts", "track pants", "yoga pants"] },
              { "key": "pants_color", "type": "select", "label": "Bottoms Color", "options": ["blue denim", "black", "gray", "khaki", "white", "navy", "brown", "dark wash", "light wash", "faded", "ripped"] },
              { "key": "shoes_type", "type": "select", "label": "Footwear", "options": ["sneakers", "sandals", "flip-flops", "boots", "loafers", "canvas shoes", "running shoes", "high-tops", "slip-ons", "barefoot"] },
              { "key": "accessories", "type": "text", "label": "Accessories", "placeholder": "e.g., baseball cap, backpack, watch, sunglasses" },
              { "key": "style_description", "type": "textarea", "label": "Overall Style", "placeholder": "Describe the casual look, condition, style vibe..." }
            ]
          },
          "formal wear": {
            "label": "Formal Wear Details", 
            "fields": [
              { "key": "formal_type", "type": "select", "label": "Formal Type", "options": ["business suit", "evening gown", "cocktail dress", "tuxedo", "formal dress", "blazer combo", "three-piece suit", "black tie", "white tie"] },
              { "key": "suit_color", "type": "select", "label": "Color", "options": ["black", "navy", "charcoal", "gray", "burgundy", "midnight blue", "white", "cream", "silver", "pinstripe"] },
              { "key": "fabric_type", "type": "select", "label": "Fabric", "options": ["wool", "silk", "satin", "velvet", "cotton", "linen", "cashmere", "polyester blend", "tweed"] },
              { "key": "formal_shoes", "type": "select", "label": "Formal Footwear", "options": ["dress shoes", "high heels", "oxfords", "loafers", "pumps", "stilettos", "dress boots", "patent leather", "suede"] },
              { "key": "formal_accessories", "type": "text", "label": "Formal Accessories", "placeholder": "e.g., tie, bow tie, jewelry, cufflinks, pocket square" },
              { "key": "formal_description", "type": "textarea", "label": "Formal Style", "placeholder": "Describe the formal attire, elegance level, occasion..." }
            ]
          },
          "business attire": {
            "label": "Business Attire Details",
            "fields": [
              { "key": "business_level", "type": "select", "label": "Formality Level", "options": ["business formal", "business casual", "smart casual", "corporate", "startup casual"] },
              { "key": "business_top", "type": "select", "label": "Top", "options": ["dress shirt", "blouse", "blazer", "cardigan", "sweater", "polo shirt", "button-down", "professional top"] },
              { "key": "business_bottom", "type": "select", "label": "Bottom", "options": ["dress pants", "skirt", "slacks", "suit pants", "chinos", "pencil skirt", "a-line skirt", "trouser pants"] },
              { "key": "business_shoes", "type": "select", "label": "Professional Footwear", "options": ["dress shoes", "loafers", "low heels", "flats", "oxford shoes", "professional boots", "pumps"] },
              { "key": "business_colors", "type": "select", "label": "Color Scheme", "options": ["black and white", "navy and white", "gray tones", "earth tones", "conservative colors", "modern neutrals"] },
              { "key": "business_accessories", "type": "text", "label": "Professional Accessories", "placeholder": "e.g., briefcase, laptop bag, watch, minimal jewelry" },
              { "key": "business_description", "type": "textarea", "label": "Professional Style", "placeholder": "Describe the business look, industry appropriateness..." }
            ]
          },
          "sportswear": {
            "label": "Sportswear Details",
            "fields": [
              { "key": "sport_type", "type": "select", "label": "Sport/Activity", "options": ["gym workout", "running", "yoga", "basketball", "soccer", "tennis", "swimming", "cycling", "hiking", "general fitness"] },
              { "key": "athletic_top", "type": "select", "label": "Athletic Top", "options": ["sports bra", "tank top", "t-shirt", "long sleeve", "compression shirt", "jersey", "track jacket", "hoodie"] },
              { "key": "athletic_bottom", "type": "select", "label": "Athletic Bottom", "options": ["leggings", "shorts", "sweatpants", "track pants", "compression shorts", "athletic skirt", "joggers", "bike shorts"] },
              { "key": "athletic_shoes", "type": "select", "label": "Athletic Footwear", "options": ["running shoes", "cross-trainers", "basketball shoes", "cleats", "tennis shoes", "hiking boots", "cycling shoes"] },
              { "key": "athletic_material", "type": "select", "label": "Material", "options": ["moisture-wicking", "breathable", "compression", "cotton blend", "polyester", "spandex blend", "technical fabric"] },
              { "key": "athletic_accessories", "type": "text", "label": "Athletic Gear", "placeholder": "e.g., water bottle, fitness tracker, headband, gloves" },
              { "key": "athletic_description", "type": "textarea", "label": "Athletic Style", "placeholder": "Describe the sportswear look, performance features..." }
            ]
          },
          "fantasy armor": {
            "label": "Armor Details",
            "fields": [
              { "key": "armor_type", "type": "select", "label": "Type", "options": ["plate armor", "chainmail", "leather armor", "scale armor", "magical armor"] },
              { "key": "armor_material", "type": "select", "label": "Material", "options": ["steel", "leather", "dragon scale", "mithril", "enchanted metal", "bone"] },
              { "key": "armor_description", "type": "textarea", "label": "Description", "placeholder": "Describe the armor design, decorations, condition..." }
            ]
          },
          "sci-fi suit": {
            "label": "Sci-Fi Suit Details",
            "fields": [
              { "key": "suit_type", "type": "select", "label": "Type", "options": ["space suit", "power armor", "cyberpunk outfit", "tech suit", "energy suit"] },
              { "key": "suit_features", "type": "text", "label": "Special Features", "placeholder": "e.g., HUD display, energy shields, thrusters" },
              { "key": "suit_description", "type": "textarea", "label": "Description", "placeholder": "Describe the suit's appearance, technology, design..." }
            ]
          }
        } }
      ]
    },
    {
      "id": "camera_details",
      "label": "Camera Details",
      "fields": [
        { "key": "angle", "type": "select", "label": "Camera Angle", "options": ["eye level", "low angle", "high angle", "bird's-eye", "worm's-eye", "dutch angle", "over-the-shoulder", "POV", "aerial", "custom..."], "allowDetails": true, "detailConfig": {
          "low angle": {
            "label": "Low Angle Details",
            "fields": [
              { "key": "low_angle_degree", "type": "select", "label": "Angle Degree", "options": ["slight low angle", "moderate low angle", "extreme low angle", "dramatic upward"] },
              { "key": "low_angle_effect", "type": "select", "label": "Visual Effect", "options": ["powerful/dominant", "heroic", "imposing", "intimidating", "majestic"] },
              { "key": "low_angle_description", "type": "textarea", "label": "Description", "placeholder": "Describe the power dynamic, subject presence, dramatic effect..." }
            ]
          },
          "high angle": {
            "label": "High Angle Details",
            "fields": [
              { "key": "high_angle_degree", "type": "select", "label": "Angle Degree", "options": ["slight high angle", "moderate high angle", "extreme high angle", "dramatic downward"] },
              { "key": "high_angle_effect", "type": "select", "label": "Visual Effect", "options": ["vulnerable", "diminished", "isolated", "overwhelmed", "contemplative"] },
              { "key": "high_angle_description", "type": "textarea", "label": "Description", "placeholder": "Describe the vulnerability, scale, emotional impact..." }
            ]
          },
          "dutch angle": {
            "label": "Dutch Angle Details",
            "fields": [
              { "key": "dutch_tilt_degree", "type": "select", "label": "Tilt Degree", "options": ["subtle tilt (5-10°)", "moderate tilt (15-20°)", "strong tilt (25-35°)", "extreme tilt (40°+)"] },
              { "key": "dutch_mood", "type": "select", "label": "Mood Effect", "options": ["unsettling", "dynamic", "tension", "confusion", "artistic flair"] },
              { "key": "dutch_description", "type": "textarea", "label": "Description", "placeholder": "Describe the disorientation, artistic effect, emotional tone..." }
            ]
          },
          "bird's-eye": {
            "label": "Bird's-Eye Details",
            "fields": [
              { "key": "birds_eye_height", "type": "select", "label": "Height Level", "options": ["moderate overhead", "high overhead", "extreme overhead", "satellite view"] },
              { "key": "birds_eye_scope", "type": "select", "label": "Scope", "options": ["single subject", "small area", "wide landscape", "epic scale"] },
              { "key": "birds_eye_description", "type": "textarea", "label": "Description", "placeholder": "Describe the scale, perspective, geographical overview..." }
            ]
          }
        } },
        { "key": "movement", "type": "select", "label": "Camera Movement", "options": ["static", "pan left", "pan right", "tilt up", "tilt down", "tracking", "dolly in", "dolly out", "dolly zoom", "orbit", "crane", "handheld", "gimbal", "drone", "zoom in", "zoom out", "slow zoom", "tracking shots", "overhead", "trunk camera", "one-point perspective", "quick cuts", "dynamic movement", "smooth gimbal", "custom..."], "allowDetails": true, "detailConfig": {
          "tracking": {
            "label": "Tracking Shot Details",
            "fields": [
              { "key": "tracking_direction", "type": "select", "label": "Direction", "options": ["left to right", "right to left", "forward", "backward", "circular", "figure-8"] },
              { "key": "tracking_speed", "type": "select", "label": "Speed", "options": ["very slow", "slow", "medium", "fast", "variable speed"] },
              { "key": "tracking_description", "type": "textarea", "label": "Description", "placeholder": "Describe the specific tracking movement..." }
            ]
          },
          "dolly zoom": {
            "label": "Dolly Zoom Details",
            "fields": [
              { "key": "dolly_direction", "type": "select", "label": "Direction", "options": ["dolly in, zoom out", "dolly out, zoom in"] },
              { "key": "dolly_intensity", "type": "select", "label": "Intensity", "options": ["subtle", "moderate", "dramatic"] },
              { "key": "dolly_description", "type": "textarea", "label": "Description", "placeholder": "Describe the dolly zoom effect..." }
            ]
          },
          "orbit": {
            "label": "Orbit Shot Details",
            "fields": [
              { "key": "orbit_direction", "type": "select", "label": "Direction", "options": ["clockwise", "counter-clockwise"] },
              { "key": "orbit_angle", "type": "select", "label": "Angle", "options": ["180°", "360°", "partial orbit"] },
              { "key": "orbit_description", "type": "textarea", "label": "Description", "placeholder": "Describe the orbit movement..." }
            ]
          }
        } },
        { "key": "distance", "type": "select", "label": "Camera Distance", "options": ["extreme close-up", "close-up", "medium close-up", "medium shot", "medium wide", "wide shot", "extreme wide shot", "establishing shot", "master shot", "custom..."], "allowDetails": true, "detailConfig": {
          "close-up": {
            "label": "Close-Up Details",
            "fields": [
              { "key": "closeup_framing", "type": "select", "label": "Framing Focus", "options": ["face and shoulders", "head and neck", "facial features", "eyes emphasis", "emotional focus"] },
              { "key": "closeup_purpose", "type": "select", "label": "Purpose", "options": ["emotional intimacy", "detail revelation", "character study", "dramatic tension", "connection"] },
              { "key": "closeup_description", "type": "textarea", "label": "Description", "placeholder": "Describe the intimacy, emotion, specific details captured..." }
            ]
          },
          "extreme close-up": {
            "label": "Extreme Close-Up Details",
            "fields": [
              { "key": "extreme_closeup_focus", "type": "select", "label": "Focus Area", "options": ["eyes only", "mouth", "hands", "specific object", "facial detail"] },
              { "key": "extreme_closeup_effect", "type": "select", "label": "Dramatic Effect", "options": ["intense emotion", "crucial detail", "psychological depth", "tension building", "revelation"] },
              { "key": "extreme_closeup_description", "type": "textarea", "label": "Description", "placeholder": "Describe the specific detail, dramatic impact, psychological effect..." }
            ]
          },
          "wide shot": {
            "label": "Wide Shot Details",
            "fields": [
              { "key": "wide_shot_scope", "type": "select", "label": "Scope", "options": ["full body", "environment context", "relationship dynamics", "action space", "scenic overview"] },
              { "key": "wide_shot_purpose", "type": "select", "label": "Purpose", "options": ["establishing location", "showing scale", "character relationships", "action coverage", "environmental context"] },
              { "key": "wide_shot_description", "type": "textarea", "label": "Description", "placeholder": "Describe the environmental context, scale, relationships..." }
            ]
          },
          "establishing shot": {
            "label": "Establishing Shot Details",
            "fields": [
              { "key": "establishing_scale", "type": "select", "label": "Scale", "options": ["building exterior", "city skyline", "landscape view", "interior space", "neighborhood"] },
              { "key": "establishing_info", "type": "select", "label": "Information Provided", "options": ["location context", "time of day", "scale reference", "mood setting", "story context"] },
              { "key": "establishing_description", "type": "textarea", "label": "Description", "placeholder": "Describe the location, scale, contextual information provided..." }
            ]
          }
        } },
        { "key": "depth_of_field", "type": "select", "label": "Depth of Field", "options": ["shallow", "deep", "bokeh", "tilt-shift", "rack focus", "split diopter", "custom..."], "allowDetails": true, "detailConfig": {
          "shallow": {
            "label": "Shallow DOF Details",
            "fields": [
              { "key": "shallow_aperture", "type": "select", "label": "Aperture Setting", "options": ["f/1.4 (very shallow)", "f/2.0 (shallow)", "f/2.8 (moderate shallow)", "wide open"] },
              { "key": "shallow_focus_point", "type": "select", "label": "Focus Point", "options": ["subject's eyes", "main subject", "foreground element", "specific detail", "moving target"] },
              { "key": "shallow_description", "type": "textarea", "label": "Description", "placeholder": "Describe the subject isolation, background blur, artistic effect..." }
            ]
          },
          "bokeh": {
            "label": "Bokeh Details",
            "fields": [
              { "key": "bokeh_quality", "type": "select", "label": "Bokeh Quality", "options": ["creamy smooth", "circular highlights", "hexagonal", "artistic blur", "dreamy"] },
              { "key": "bokeh_background", "type": "select", "label": "Background", "options": ["city lights", "natural lighting", "studio lights", "colored elements", "textured surfaces"] },
              { "key": "bokeh_description", "type": "textarea", "label": "Description", "placeholder": "Describe the bokeh quality, light circles, artistic blur..." }
            ]
          },
          "rack focus": {
            "label": "Rack Focus Details",
            "fields": [
              { "key": "rack_focus_transition", "type": "select", "label": "Focus Transition", "options": ["foreground to background", "background to foreground", "subject to subject", "reveal technique"] },
              { "key": "rack_focus_speed", "type": "select", "label": "Transition Speed", "options": ["slow reveal", "medium pace", "quick snap", "dramatic pull", "smooth transition"] },
              { "key": "rack_focus_description", "type": "textarea", "label": "Description", "placeholder": "Describe the focus pull, narrative purpose, visual transition..." }
            ]
          },
          "tilt-shift": {
            "label": "Tilt-Shift Details",
            "fields": [
              { "key": "tilt_shift_effect", "type": "select", "label": "Effect Style", "options": ["miniature effect", "selective focus", "dramatic perspective", "architectural correction"] },
              { "key": "tilt_shift_focus_area", "type": "select", "label": "Focus Area", "options": ["horizontal band", "diagonal plane", "small area", "architectural element"] },
              { "key": "tilt_shift_description", "type": "textarea", "label": "Description", "placeholder": "Describe the tilt-shift effect, focus plane, artistic impact..." }
            ]
          }
        } },
        { "key": "lens_type", "type": "select", "label": "Lens Type", "options": ["standard 50mm", "wide angle", "telephoto", "macro", "fisheye", "anamorphic", "vintage", "35mm", "85mm", "24-70mm", "70-200mm", "custom..."], "allowDetails": true, "detailConfig": {
          "wide angle": {
            "label": "Wide Angle Details",
            "fields": [
              { "key": "wide_angle_focal", "type": "select", "label": "Focal Length", "options": ["14mm (ultra-wide)", "16-35mm (wide)", "24mm (moderate wide)", "28mm (standard wide)"] },
              { "key": "wide_angle_effect", "type": "select", "label": "Visual Effect", "options": ["dramatic perspective", "expansive view", "environmental context", "distortion effect", "immersive feeling"] },
              { "key": "wide_angle_description", "type": "textarea", "label": "Description", "placeholder": "Describe the wide perspective, distortion, environmental scope..." }
            ]
          },
          "telephoto": {
            "label": "Telephoto Details",
            "fields": [
              { "key": "telephoto_focal", "type": "select", "label": "Focal Length", "options": ["85mm (short tele)", "135mm (medium tele)", "200mm (long tele)", "300mm+ (super tele)"] },
              { "key": "telephoto_compression", "type": "select", "label": "Compression Effect", "options": ["background compression", "subject isolation", "shallow DOF", "distance collapse", "intimate framing"] },
              { "key": "telephoto_description", "type": "textarea", "label": "Description", "placeholder": "Describe the compression, isolation, intimate perspective..." }
            ]
          },
          "fisheye": {
            "label": "Fisheye Details",
            "fields": [
              { "key": "fisheye_distortion", "type": "select", "label": "Distortion Level", "options": ["circular fisheye", "full-frame fisheye", "moderate distortion", "extreme distortion"] },
              { "key": "fisheye_coverage", "type": "select", "label": "Coverage Angle", "options": ["180° circular", "180° full-frame", "150° coverage", "ultra-wide view"] },
              { "key": "fisheye_description", "type": "textarea", "label": "Description", "placeholder": "Describe the distortion effect, curved perspective, artistic impact..." }
            ]
          },
          "anamorphic": {
            "label": "Anamorphic Details",
            "fields": [
              { "key": "anamorphic_ratio", "type": "select", "label": "Squeeze Ratio", "options": ["1.33x squeeze", "2x squeeze", "1.5x squeeze", "variable squeeze"] },
              { "key": "anamorphic_flares", "type": "select", "label": "Lens Flares", "options": ["horizontal blue flares", "vintage flares", "minimal flares", "dramatic flares", "colored streaks"] },
              { "key": "anamorphic_description", "type": "textarea", "label": "Description", "placeholder": "Describe the cinematic look, flares, widescreen aesthetic..." }
            ]
          },
          "macro": {
            "label": "Macro Details",
            "fields": [
              { "key": "macro_magnification", "type": "select", "label": "Magnification", "options": ["1:1 life size", "2:1 double size", "5:1 extreme macro", "close focus"] },
              { "key": "macro_subject", "type": "select", "label": "Subject Type", "options": ["small objects", "textures", "details", "insects/nature", "jewelry/products"] },
              { "key": "macro_description", "type": "textarea", "label": "Description", "placeholder": "Describe the extreme detail, magnification, subject focus..." }
            ]
          }
        } }
      ]
    },
    {
      "id": "visual_style",
      "label": "Visual Style",
      "fields": [
        { "key": "color_palette", "type": "select", "label": "Color Palette", "options": ["warm tones", "cool tones", "monochromatic", "complementary", "triadic", "vibrant", "muted", "pastel", "pastel colors", "earth tones", "neon", "black and white", "sepia", "desaturated", "high contrast", "low contrast", "saturated", "chiaroscuro", "cool blue tones", "warm vintage palette", "deep reds", "retro meme", "custom..."] },
        { "key": "style", "type": "select", "label": "Style/Look", "options": ["cinematic", "documentary", "vintage", "modern", "futuristic", "retro", "minimalist", "maximalist", "grunge", "clean", "organic", "geometric", "surreal", "realistic", "stylized", "anime", "cartoon", "film noir", "authentic", "viral", "gritty", "whimsical", "clinical", "suburban", "gothic", "painterly", "internet culture", "custom..."] },
        { "key": "influences", "type": "select", "label": "Influences/References", "options": ["Christopher Nolan", "Wes Anderson", "Stanley Kubrick", "David Fincher", "Ridley Scott", "Quentin Tarantino", "Steven Spielberg", "Hayao Miyazaki", "Zack Snyder", "Greta Gerwig", "Guillermo del Toro", "Denis Villeneuve", "Roger Deakins", "Emmanuel Lubezki", "Blade Runner", "Mad Max", "Star Wars", "Marvel", "Studio Ghibli", "Pixar", "custom..."] },
        { "key": "aspect_ratio", "type": "select", "label": "Aspect Ratio", "options": ["16:9", "9:16", "1:1", "21:9", "4:3", "3:2", "2.35:1", "2.39:1", "1.85:1", "custom..."] },
        { "key": "frame_rate", "type": "select", "label": "Frame Rate/Look", "options": ["24fps cinematic", "30fps standard", "60fps smooth", "120fps slow-mo", "stop-motion", "time-lapse", "variable frame rate", "custom..."] }
      ]
    },
    {
      "id": "lighting",
      "label": "Lighting",
      "fields": [
        { "key": "lighting_type", "type": "select", "label": "Lighting Type", "options": ["natural light", "artificial light", "mixed lighting", "key light", "fill light", "rim light", "practical lighting", "three-point lighting", "hard light", "soft light", "ambient light", "directional light", "studio lighting", "available light", "low-key lighting", "gothic lighting", "custom..."] },
        { "key": "lighting_direction", "type": "select", "label": "Lighting Direction", "options": ["front lighting", "side lighting", "back lighting", "top lighting", "bottom lighting", "45-degree lighting", "Rembrandt lighting", "butterfly lighting", "split lighting", "rim lighting", "hair light", "background light", "golden hour", "chiaroscuro lighting", "custom..."] },
        { "key": "light_quality", "type": "select", "label": "Light Quality", "options": ["soft", "hard", "diffused", "harsh", "warm", "cool", "neutral", "golden", "blue", "dramatic", "subtle", "moody", "bright", "dim", "contrasted", "even", "custom..."] },
        { "key": "shadows", "type": "select", "label": "Shadows/Reflections", "options": ["soft shadows", "hard shadows", "no shadows", "dramatic shadows", "subtle shadows", "long shadows", "short shadows", "multiple shadows", "cast shadows", "drop shadows", "reflections", "no reflections", "strong reflections", "subtle reflections", "custom..."] }
      ]
    },
    {
      "id": "sound_music",
      "label": "Sound / Music",
      "fields": [
        { "key": "music_style", "type": "select", "label": "Music Style", "options": ["orchestral", "electronic", "ambient", "rock", "pop", "jazz", "classical", "cinematic", "epic", "upbeat", "melancholic", "dramatic", "suspenseful", "romantic", "energetic", "minimalist", "no music", "emotional cues", "viral trending", "ambient narrative", "custom..."] },
        { "key": "sound_design", "type": "sound_design", "label": "Sound Design" },
        { "key": "dialogue", "type": "dialogue", "label": "Dialogue" }
      ]
    },
    {
      "id": "motion_timing",
      "label": "Motion & Timing",
      "fields": [
        { "key": "speed", "type": "select", "label": "Speed", "options": ["normal", "slow motion", "fast motion", "time lapse", "hyper lapse", "variable speed", "freeze frame", "custom..."] },
        { "key": "transition", "type": "select", "label": "Transition Type", "options": ["cut", "fade in", "fade out", "crossfade", "wipe", "slide", "zoom", "iris", "morph", "dissolve", "flash", "glitch", "none", "quick cuts", "dynamic cuts", "viral pacing", "custom..."] },
        { "key": "duration", "type": "text", "label": "Duration (e.g. 10s)" },
        { "key": "looping", "type": "select", "label": "Looping", "options": ["yes", "no", "seamless loop", "custom..."] }
      ]
    },
    {
      "id": "post_processing",
      "label": "Post-Processing Effects",
      "fields": [
        { "key": "vfx", "type": "select", "label": "VFX", "options": ["particles", "smoke", "fire", "water", "explosions", "magic effects", "lens flares", "light rays", "energy beams", "sparkles", "dust", "fog", "rain", "snow", "lightning", "none", "glitch effects", "viral effects", "custom..."], "allowDetails": true, "detailConfig": {
          "particles": {
            "label": "Particle Effects Details",
            "fields": [
              { "key": "particle_type", "type": "select", "label": "Particle Type", "options": ["dust motes", "floating embers", "snowflakes", "petals", "bubbles", "stars", "energy orbs", "sparks"] },
              { "key": "particle_density", "type": "select", "label": "Density", "options": ["sparse", "moderate", "dense", "heavy", "overwhelming"] },
              { "key": "particle_color", "type": "text", "label": "Color", "placeholder": "e.g., golden, white, multicolored" },
              { "key": "particle_movement", "type": "select", "label": "Movement Pattern", "options": ["floating", "falling", "swirling", "rising", "chaotic", "directional"] },
              { "key": "particle_description", "type": "textarea", "label": "Description", "placeholder": "Describe particle behavior, interaction with light, atmospheric effect..." }
            ]
          },
          "magic effects": {
            "label": "Magic Effects Details",
            "fields": [
              { "key": "magic_spell_type", "type": "select", "label": "Spell Type", "options": ["elemental magic", "healing light", "dark energy", "teleportation", "transformation", "protective shield", "energy blast"] },
              { "key": "magic_energy", "type": "select", "label": "Energy Appearance", "options": ["glowing orbs", "swirling energy", "crackling electricity", "flowing wisps", "pulsing aura", "geometric patterns"] },
              { "key": "magic_visual_style", "type": "select", "label": "Visual Style", "options": ["ethereal glow", "dramatic flashes", "subtle shimmer", "intense power", "mystical atmosphere"] },
              { "key": "magic_description", "type": "textarea", "label": "Description", "placeholder": "Describe magical energy, spell effects, visual manifestation..." }
            ]
          },
          "fire": {
            "label": "Fire Effects Details",
            "fields": [
              { "key": "fire_intensity", "type": "select", "label": "Intensity", "options": ["small flames", "moderate fire", "raging fire", "explosive fire", "controlled flame"] },
              { "key": "fire_color", "type": "select", "label": "Flame Color", "options": ["orange-red", "blue flame", "white hot", "green flame", "purple flame", "multicolored"] },
              { "key": "fire_behavior", "type": "select", "label": "Behavior", "options": ["flickering", "steady burn", "dancing flames", "aggressive spread", "contained"] },
              { "key": "fire_description", "type": "textarea", "label": "Description", "placeholder": "Describe fire dynamics, heat distortion, smoke interaction..." }
            ]
          },
          "explosions": {
            "label": "Explosion Details",
            "fields": [
              { "key": "explosion_scale", "type": "select", "label": "Scale", "options": ["small burst", "medium explosion", "large detonation", "massive blast", "controlled explosion"] },
              { "key": "explosion_type", "type": "select", "label": "Type", "options": ["fireball", "shockwave", "energy burst", "smoke explosion", "debris explosion"] },
              { "key": "explosion_timing", "type": "select", "label": "Timing", "options": ["instant flash", "sustained blast", "delayed reaction", "chain reaction"] },
              { "key": "explosion_description", "type": "textarea", "label": "Description", "placeholder": "Describe blast radius, debris, shockwave effects..." }
            ]
          },
          "smoke": {
            "label": "Smoke Effects Details",
            "fields": [
              { "key": "smoke_density", "type": "select", "label": "Density", "options": ["wispy", "moderate", "thick", "choking", "atmospheric"] },
              { "key": "smoke_color", "type": "select", "label": "Color", "options": ["white", "gray", "black", "colored smoke", "multicolored"] },
              { "key": "smoke_movement", "type": "select", "label": "Movement", "options": ["billowing", "rising", "swirling", "dispersing", "wind-blown"] },
              { "key": "smoke_description", "type": "textarea", "label": "Description", "placeholder": "Describe smoke behavior, atmospheric interaction, visual impact..." }
            ]
          },
          "water": {
            "label": "Water Effects Details",
            "fields": [
              { "key": "water_type", "type": "select", "label": "Water Type", "options": ["splashing", "flowing", "rain drops", "mist", "waves", "underwater bubbles"] },
              { "key": "water_intensity", "type": "select", "label": "Intensity", "options": ["gentle", "moderate", "heavy", "torrential", "dramatic"] },
              { "key": "water_interaction", "type": "select", "label": "Light Interaction", "options": ["reflective", "refractive", "sparkling", "translucent", "crystal clear"] },
              { "key": "water_description", "type": "textarea", "label": "Description", "placeholder": "Describe water movement, light reflection, atmospheric effect..." }
            ]
          }
        } },
        { "key": "motion_blur", "type": "select", "label": "Motion Blur", "options": ["off", "subtle", "moderate", "strong", "directional", "radial", "custom..."], "allowDetails": true, "detailConfig": {
          "directional": {
            "label": "Directional Blur Details",
            "fields": [
              { "key": "direction_angle", "type": "select", "label": "Direction", "options": ["horizontal", "vertical", "diagonal left", "diagonal right", "custom angle"] },
              { "key": "direction_intensity", "type": "select", "label": "Intensity", "options": ["light streak", "moderate blur", "heavy motion", "extreme speed"] },
              { "key": "direction_speed_indication", "type": "select", "label": "Speed Indication", "options": ["slow movement", "moderate speed", "fast action", "extreme velocity", "variable speed"] },
              { "key": "direction_description", "type": "textarea", "label": "Description", "placeholder": "Describe the motion direction, speed feel, dynamic energy..." }
            ]
          },
          "radial": {
            "label": "Radial Blur Details",
            "fields": [
              { "key": "radial_center_point", "type": "select", "label": "Center Point", "options": ["image center", "subject focus", "off-center", "multiple points", "dynamic center"] },
              { "key": "radial_spin_intensity", "type": "select", "label": "Spin Intensity", "options": ["subtle rotation", "moderate spin", "fast spin", "extreme whirl", "variable rotation"] },
              { "key": "radial_energy_type", "type": "select", "label": "Energy Type", "options": ["smooth rotation", "explosive burst", "implosion effect", "vortex energy", "portal effect"] },
              { "key": "radial_description", "type": "textarea", "label": "Description", "placeholder": "Describe the rotational energy, center point dynamics, spiral effect..." }
            ]
          },
          "subtle": {
            "label": "Subtle Blur Details",
            "fields": [
              { "key": "subtle_target", "type": "select", "label": "Blur Target", "options": ["moving subjects only", "background elements", "selective areas", "edge softening", "atmospheric blur"] },
              { "key": "subtle_purpose", "type": "select", "label": "Purpose", "options": ["natural motion", "depth enhancement", "focus attention", "cinematic realism", "dreamy atmosphere"] },
              { "key": "subtle_description", "type": "textarea", "label": "Description", "placeholder": "Describe the subtle motion effects, areas of focus, natural feel..." }
            ]
          },
          "strong": {
            "label": "Strong Blur Details",
            "fields": [
              { "key": "strong_motion_type", "type": "select", "label": "Motion Type", "options": ["high-speed action", "dramatic movement", "impact blur", "chase sequence", "transformation"] },
              { "key": "strong_coverage", "type": "select", "label": "Coverage", "options": ["full frame", "subject-focused", "background streak", "selective areas", "dynamic trails"] },
              { "key": "strong_description", "type": "textarea", "label": "Description", "placeholder": "Describe the intense motion, dramatic impact, speed sensation..." }
            ]
          }
        } },
        { "key": "glow", "type": "select", "label": "Glow/Haze", "options": ["none", "subtle glow", "strong glow", "rim lighting", "atmospheric haze", "lens bloom", "custom..."] },
        { "key": "grain", "type": "select", "label": "Grain Intensity", "options": ["none", "light", "medium", "heavy", "vintage", "digital noise", "film grain", "custom..."] },
        { "key": "filters", "type": "select", "label": "Filters", "options": ["none", "sepia", "black and white", "vintage", "polaroid", "instagram", "VSCO", "cinematic", "desaturated", "high contrast", "low contrast", "warm filter", "cool filter", "70s film grain", "hyper-real", "custom..."], "allowDetails": true, "detailConfig": {
          "vintage": {
            "label": "Vintage Filter Details",
            "fields": [
              { "key": "vintage_era", "type": "select", "label": "Era", "options": ["1950s", "1960s", "1970s", "1980s", "1990s", "early 2000s", "film photography"] },
              { "key": "vintage_grain_level", "type": "select", "label": "Grain Level", "options": ["subtle grain", "moderate grain", "heavy grain", "film texture", "digital vintage"] },
              { "key": "vintage_color_shift", "type": "select", "label": "Color Shift", "options": ["warm tones", "cool fade", "sepia undertones", "faded colors", "saturated retro"] },
              { "key": "vintage_description", "type": "textarea", "label": "Description", "placeholder": "Describe the vintage aesthetic, aging effects, nostalgic feel..." }
            ]
          },
          "cinematic": {
            "label": "Cinematic Filter Details",
            "fields": [
              { "key": "cinematic_lut_style", "type": "select", "label": "LUT Style", "options": ["Hollywood blockbuster", "indie film", "noir style", "sci-fi epic", "romantic drama", "action thriller"] },
              { "key": "cinematic_color_grading", "type": "select", "label": "Color Grading", "options": ["orange and teal", "desaturated", "high contrast", "warm highlights", "cool shadows", "film emulation"] },
              { "key": "cinematic_mood", "type": "select", "label": "Mood", "options": ["epic drama", "intimate storytelling", "high-tech", "gritty realism", "dreamy romance", "intense action"] },
              { "key": "cinematic_description", "type": "textarea", "label": "Description", "placeholder": "Describe the cinematic look, color grading, professional feel..." }
            ]
          },
          "black and white": {
            "label": "B&W Filter Details",
            "fields": [
              { "key": "bw_style", "type": "select", "label": "B&W Style", "options": ["high contrast", "soft contrast", "film noir", "documentary", "artistic", "vintage B&W"] },
              { "key": "bw_tone", "type": "select", "label": "Tone", "options": ["pure B&W", "warm tone", "cool tone", "selenium tone", "sepia hint"] },
              { "key": "bw_grain", "type": "select", "label": "Film Grain", "options": ["no grain", "fine grain", "moderate grain", "heavy grain", "film texture"] },
              { "key": "bw_description", "type": "textarea", "label": "Description", "placeholder": "Describe the B&W aesthetic, contrast level, artistic mood..." }
            ]
          },
          "polaroid": {
            "label": "Polaroid Filter Details",
            "fields": [
              { "key": "polaroid_border", "type": "select", "label": "Border Style", "options": ["white border", "aged border", "no border", "damaged border", "artistic frame"] },
              { "key": "polaroid_fade", "type": "select", "label": "Color Fade", "options": ["slight fade", "moderate fade", "heavy fade", "authentic aging", "modern interpretation"] },
              { "key": "polaroid_imperfections", "type": "select", "label": "Imperfections", "options": ["clean", "light spots", "dust and scratches", "chemical stains", "aged damage"] },
              { "key": "polaroid_description", "type": "textarea", "label": "Description", "placeholder": "Describe the instant photo aesthetic, aging, nostalgic feel..." }
            ]
          },
          "instagram": {
            "label": "Social Media Filter Details",
            "fields": [
              { "key": "instagram_style", "type": "select", "label": "Filter Style", "options": ["Valencia", "X-Pro II", "Amaro", "Rise", "Hudson", "modern preset", "trending filter"] },
              { "key": "instagram_saturation", "type": "select", "label": "Saturation", "options": ["natural", "enhanced", "vibrant", "muted", "desaturated"] },
              { "key": "instagram_brightness", "type": "select", "label": "Brightness", "options": ["normal", "brightened", "high-key", "low-key", "dramatic"] },
              { "key": "instagram_description", "type": "textarea", "label": "Description", "placeholder": "Describe the social media aesthetic, trendy look, engagement appeal..." }
            ]
          },
          "VSCO": {
            "label": "VSCO Filter Details",
            "fields": [
              { "key": "vsco_film_emulation", "type": "select", "label": "Film Emulation", "options": ["Kodak Portra", "Fuji 400H", "Ilford HP5", "Kodak Gold", "Agfa Vista", "custom film"] },
              { "key": "vsco_exposure", "type": "select", "label": "Exposure", "options": ["underexposed", "normal", "overexposed", "pushed film", "pulled film"] },
              { "key": "vsco_fade", "type": "select", "label": "Film Fade", "options": ["no fade", "subtle fade", "lifted blacks", "film crush", "vintage fade"] },
              { "key": "vsco_description", "type": "textarea", "label": "Description", "placeholder": "Describe the film emulation, analog feel, professional aesthetic..." }
            ]
          }
        } }
      ]
    },
    {
      "id": "mood_tone",
      "label": "Mood / Tone",
      "fields": [
        { "key": "tone", "type": "select", "label": "Tone", "options": ["uplifting", "melancholic", "mysterious", "dramatic", "comedic", "romantic", "suspenseful", "peaceful", "energetic", "dark", "light", "serious", "playful", "nostalgic", "futuristic", "vintage", "epic", "intimate", "confident", "emotional", "whimsical", "custom..."] },
        { "key": "atmosphere", "type": "select", "label": "Atmosphere", "options": ["cozy", "tense", "ethereal", "gritty", "dreamy", "harsh", "serene", "chaotic", "magical", "realistic", "surreal", "inviting", "foreboding", "inspiring", "oppressive", "liberating", "authentic", "quirky", "eerie", "nostalgic", "clinical precision", "majestic", "intimate", "viral energy", "custom..."] },
        { "key": "emotional_response", "type": "select", "label": "Emotional Response", "options": ["joy", "sadness", "fear", "excitement", "wonder", "nostalgia", "hope", "anxiety", "comfort", "inspiration", "empowerment", "vulnerability", "awe", "curiosity", "satisfaction", "longing", "humor", "viral engagement", "authentic connection", "custom..."] }
      ]
    },
    {
      "id": "ai_extensions",
      "label": "AI Extensions",
      "fields": [
        { "key": "continuation_type", "type": "select", "label": "Continuation Type", "options": ["logical", "twist", "genreShift", "characterDevelopment", "flashback", "timeSkip", "alternateReality", "environmentalEscalation"] },
        { "key": "character_focus", "type": "text", "label": "Character Focus", "placeholder": "Which character is being developed" },
        { "key": "development_type", "type": "select", "label": "Development Type", "options": ["fear", "desire", "backstory", "relationship", "skill", "vulnerability", "strength", "motivation", "internal_conflict", "growth"] },
        { "key": "internal_state", "type": "textarea", "label": "Internal State", "placeholder": "Character's emotional/psychological condition" },
        { "key": "narrative_connection", "type": "textarea", "label": "Narrative Connection", "placeholder": "How this connects to the previous scene" },
        { "key": "twist_type", "type": "select", "label": "Twist Type", "options": ["unexpected_element", "character_revelation", "plot_reversal", "identity_surprise", "motive_reveal", "situation_flip"] },
        { "key": "optimization_type", "type": "select", "label": "Optimization Type", "options": ["enhance", "platform", "style", "viral", "technical", "visual_spectacle", "emotional_resonance", "narrative_cohesion"] },
        { "key": "quality_improvements", "type": "textarea", "label": "Quality Improvements", "placeholder": "List of key enhancements made" },
        { "key": "creative_additions", "type": "textarea", "label": "Creative Additions", "placeholder": "Artistic improvements made" },
        { "key": "viral_elements", "type": "textarea", "label": "Viral Elements", "placeholder": "Shareability enhancements" },
        { "key": "engagement_hooks", "type": "textarea", "label": "Engagement Hooks", "placeholder": "Attention-grabbing moments" },
        { "key": "platform_adaptations", "type": "textarea", "label": "Platform Adaptations", "placeholder": "Platform-specific changes" },
        { "key": "target_platform", "type": "select", "label": "Target Platform", "options": ["youtube", "tiktok", "instagram", "twitter", "facebook", "linkedin", "snapchat", "general"] },
        { "key": "technical_specifications", "type": "textarea", "label": "Technical Specifications", "placeholder": "Technical improvements made" },
        { "key": "style_elements", "type": "textarea", "label": "Style Elements", "placeholder": "Applied style characteristics" },
        { "key": "aesthetic_enhancements", "type": "textarea", "label": "Aesthetic Enhancements", "placeholder": "Visual style improvements" }
      ]
    }
  ]
};