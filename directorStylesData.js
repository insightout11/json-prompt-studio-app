export const directorStyles = {
  // AUTEUR DIRECTOR STYLES (12 presets)
  "kubrick-symmetry": {
    id: "kubrick-symmetry",
    name: "Kubrick Symmetry",
    description: "Perfectly symmetrical compositions with one-point perspective",
    category: "directors",
    tags: ["kubrick", "symmetrical", "precise", "geometric"],
    useCase: "Artistic films, precise compositions, psychological content",
    fields: {
      camera_angle: "perfectly centered one-point perspective",
      camera_distance: "wide symmetrical shot",
      lens_type: "wide angle for geometric precision",
      depth_of_field: "deep focus",
      style: "symmetrical geometric precision",
      color_palette: "controlled monochromatic",
      lighting_type: "precise directional lighting",
      motion_type: "slow methodical zoom"
    },
    customDetails: "Kubrick's obsessive symmetry with perfect central framing, geometric precision, and psychological intensity through visual order"
  },

  "tarantino-dialogue": {
    id: "tarantino-dialogue",
    name: "Tarantino Dialogue Scene",
    description: "Character-driven dialogue with pop culture references and tension",
    category: "directors",
    tags: ["tarantino", "dialogue", "tension", "pop-culture"],
    useCase: "Character studies, dialogue-heavy scenes, pop culture content",
    fields: {
      camera_angle: "medium close-ups emphasizing dialogue",
      camera_distance: "intimate conversation shots",
      lens_type: "standard for natural perspective",
      depth_of_field: "shallow focus on speakers",
      style: "gritty realistic with pop flair",
      color_palette: "saturated warm tones",
      lighting_type: "natural motivated lighting",
      motion_type: "static with occasional whip pans"
    },
    customDetails: "Tarantino's signature dialogue style with pop culture references, building tension, and characters talking past each other"
  },

  "nolan-complexity": {
    id: "nolan-complexity",
    name: "Nolan Complexity",
    description: "Multi-layered narrative with time manipulation and IMAX scale",
    category: "directors",
    tags: ["nolan", "complex", "time", "imax"],
    useCase: "Complex narratives, time-based content, epic scale stories",
    fields: {
      camera_angle: "IMAX-scale epic angles",
      camera_distance: "sweeping establishing shots",
      lens_type: "IMAX 70mm equivalent wide",
      depth_of_field: "everything in sharp focus",
      style: "epic realistic complexity",
      color_palette: "desaturated blues and golds",
      lighting_type: "practical source lighting",
      motion_type: "rotating perspectives and time shifts"
    },
    customDetails: "Nolan's signature complexity with non-linear time, IMAX grandeur, and practical effects creating puzzle-like narratives"
  },

  "spielberg-family": {
    id: "spielberg-family",
    name: "Spielberg Family Drama",
    description: "Warm family moments with nostalgic suburban atmosphere",
    category: "directors",
    tags: ["spielberg", "family", "nostalgic", "warm"],
    useCase: "Family content, nostalgic scenes, heartwarming moments",
    fields: {
      camera_angle: "warm eye-level family perspectives",
      camera_distance: "inclusive medium shots",
      lens_type: "standard for natural family feel",
      depth_of_field: "moderate focus",
      style: "warm nostalgic Americana",
      color_palette: "golden hour warm tones",
      lighting_type: "soft natural family lighting",
      motion_type: "gentle camera movements"
    },
    customDetails: "Spielberg's warm family dynamics with suburban nostalgia, golden hour lighting, and the magic of ordinary family moments"
  },

  "scorsese-tracking": {
    id: "scorsese-tracking",
    name: "Scorsese Tracking Shot",
    description: "Long fluid tracking shots through crowded environments",
    category: "directors",
    tags: ["scorsese", "tracking", "fluid", "crowded"],
    useCase: "Dynamic movement, crowded scenes, immersive environments",
    fields: {
      camera_angle: "fluid moving perspective",
      camera_distance: "immersive tracking shots",
      lens_type: "standard for natural movement",
      depth_of_field: "deep focus to catch everything",
      style: "gritty urban realism",
      color_palette: "rich saturated colors",
      lighting_type: "mixed practical sources",
      motion_type: "signature long tracking movements"
    },
    customDetails: "Scorsese's famous tracking shots weaving through crowded spaces, capturing the energy and chaos of urban life"
  },

  "anderson-centered": {
    id: "anderson-centered",
    name: "Wes Anderson Centered",
    description: "Perfectly centered symmetrical frames with whimsical detail",
    category: "directors",
    tags: ["anderson", "centered", "whimsical", "symmetrical"],
    useCase: "Quirky content, art direction focused, whimsical storytelling",
    fields: {
      camera_angle: "perfectly centered symmetrical",
      camera_distance: "precisely framed medium shots",
      lens_type: "standard for geometric precision",
      depth_of_field: "everything in sharp focus",
      style: "whimsical symmetrical perfection",
      color_palette: "pastel color coordination",
      lighting_type: "even flat lighting",
      motion_type: "static with precise pans"
    },
    customDetails: "Wes Anderson's meticulous symmetry with perfect centering, whimsical color palettes, and dollhouse-like precision"
  },

  "fincher-precision": {
    id: "fincher-precision",
    name: "Fincher Precision",
    description: "Clinical precise cinematography with controlled color grading",
    category: "directors",
    tags: ["fincher", "precise", "clinical", "controlled"],
    useCase: "Thriller content, psychological scenes, precise control",
    fields: {
      camera_angle: "precisely calculated angles",
      camera_distance: "clinically precise framing",
      lens_type: "telephoto for compression",
      depth_of_field: "precise selective focus",
      style: "clinical digital precision",
      color_palette: "controlled desaturated tones",
      lighting_type: "controlled artificial lighting",
      motion_type: "perfectly smooth mechanical moves"
    },
    customDetails: "Fincher's digital precision with clinical color grading, perfect camera movements, and obsessive technical control"
  },

  "wright-dynamic": {
    id: "wright-dynamic",
    name: "Edgar Wright Dynamic",
    description: "Rapid-fire visual comedy with kinetic editing energy",
    category: "directors",
    tags: ["wright", "dynamic", "comedy", "kinetic"],
    useCase: "Comedy content, energetic scenes, visual humor",
    fields: {
      camera_angle: "dynamic shifting perspectives",
      camera_distance: "rapid cutting distances",
      lens_type: "varied for visual punch",
      depth_of_field: "sharp focus for clarity",
      style: "kinetic visual comedy",
      color_palette: "bold saturated colors",
      lighting_type: "punchy high-contrast",
      motion_type: "rapid kinetic movements"
    },
    customDetails: "Edgar Wright's visual comedy style with rapid-fire editing, dynamic camera work, and kinetic energy"
  },

  "villeneuve-epic": {
    id: "villeneuve-epic",
    name: "Villeneuve Epic Scale",
    description: "Vast cinematic landscapes with human intimacy",
    category: "directors",
    tags: ["villeneuve", "epic", "vast", "intimate"],
    useCase: "Epic sci-fi, vast landscapes, intimate human drama",
    fields: {
      camera_angle: "epic wide establishing shots",
      camera_distance: "vast landscape shots",
      lens_type: "wide angle for epic scale",
      depth_of_field: "deep focus landscape",
      style: "epic cinematic realism",
      color_palette: "muted earth tones",
      lighting_type: "natural epic lighting",
      motion_type: "slow majestic movements"
    },
    customDetails: "Villeneuve's epic scale with vast landscapes, intimate human moments, and the weight of sci-fi concepts made real"
  },

  "wright-cornetto": {
    id: "wright-cornetto",
    name: "Cornetto Trilogy Style",
    description: "British comedy with genre-bending elements and visual gags",
    category: "directors",
    tags: ["british", "comedy", "genre-bending", "visual-gags"],
    useCase: "British comedy, genre mashups, visual humor",
    fields: {
      camera_angle: "comedic timing angles",
      camera_distance: "genre-appropriate framing",
      lens_type: "standard for natural comedy",
      depth_of_field: "sharp for visual gags",
      style: "British genre-bending comedy",
      color_palette: "warm British suburban tones",
      lighting_type: "natural British lighting",
      motion_type: "genre-appropriate movement"
    },
    customDetails: "Edgar Wright's Cornetto trilogy style mixing British comedy with genre elements, visual gags, and suburban settings"
  },

  "bay-explosion": {
    id: "bay-explosion",
    name: "Michael Bay Explosions",
    description: "High-octane action with rotating cameras and massive explosions",
    category: "directors",
    tags: ["bay", "explosions", "action", "rotating"],
    useCase: "Action blockbusters, explosion scenes, high-energy content",
    fields: {
      camera_angle: "rotating dramatic angles",
      camera_distance: "dynamic action shots",
      lens_type: "wide for maximum spectacle",
      depth_of_field: "sharp focus on action",
      style: "blockbuster action spectacle",
      color_palette: "orange and teal blockbuster",
      lighting_type: "explosive dramatic lighting",
      motion_type: "rotating around action"
    },
    customDetails: "Michael Bay's signature style with rotating cameras around explosions, orange/teal color grading, and maximum spectacle"
  },

  "carpenter-horror": {
    id: "carpenter-horror",
    name: "John Carpenter Horror",
    description: "Atmospheric horror with synth score and practical effects",
    category: "directors",
    tags: ["carpenter", "horror", "atmospheric", "synth"],
    useCase: "Horror content, atmospheric tension, retro horror aesthetics",
    fields: {
      camera_angle: "ominous low angles",
      camera_distance: "tension-building wide shots",
      lens_type: "wide angle for paranoia",
      depth_of_field: "deep focus for lurking threats",
      style: "retro atmospheric horror",
      color_palette: "cold blues and stark whites",
      lighting_type: "harsh practical lighting",
      motion_type: "slow stalking movements"
    },
    customDetails: "John Carpenter's horror atmosphere with synth scores, practical effects, and the mounting dread of unseen threats"
  },

  // AESTHETIC STYLES (12 presets)
  "gothic-dark": {
    id: "gothic-dark",
    name: "Gothic Dark",
    description: "Dark romantic aesthetic with deep shadows and ornate details",
    category: "aesthetic",
    tags: ["gothic", "dark", "romantic", "ornate", "shadows"],
    useCase: "Gothic content, dark romance, mysterious storytelling",
    fields: {
      style: "gothic dark romanticism",
      color_palette: "deep blacks, rich purples, blood reds",
      lighting_type: "dramatic chiaroscuro lighting",
      camera_angle: "dramatic low angles",
      lens_type: "wide angle for gothic architecture",
      depth_of_field: "selective focus on ornate details"
    },
    customDetails: "Victorian gothic aesthetic with ornate architecture, dramatic shadows, rich textures, and romantic darkness"
  },

  "pastel-soft": {
    id: "pastel-soft",
    name: "Pastel Soft",
    description: "Gentle pastel aesthetic with soft lighting and dreamy atmosphere",
    category: "aesthetic",
    tags: ["pastel", "soft", "dreamy", "gentle", "light"],
    useCase: "Soft content, dreamy visuals, gentle storytelling",
    fields: {
      style: "soft pastel dreaminess",
      color_palette: "soft pinks, baby blues, lavender",
      lighting_type: "soft diffused natural light",
      camera_angle: "gentle eye-level shots",
      lens_type: "standard for natural softness",
      depth_of_field: "soft focus with gentle blur"
    },
    customDetails: "Dreamy pastel world with soft textures, gentle lighting, and ethereal romantic atmosphere"
  },

  "cyberpunk-neon": {
    id: "cyberpunk-neon",
    name: "Cyberpunk Neon",
    description: "High-tech aesthetic with neon lights and urban futurism",
    category: "aesthetic",
    tags: ["cyberpunk", "neon", "futuristic", "tech", "urban"],
    useCase: "Sci-fi content, futuristic visuals, tech storytelling",
    fields: {
      style: "cyberpunk futurism",
      color_palette: "electric blues, hot pinks, neon greens",
      lighting_type: "harsh neon artificial lighting",
      camera_angle: "dynamic urban angles",
      lens_type: "wide angle for urban scale",
      depth_of_field: "sharp focus on neon details"
    },
    customDetails: "High-tech urban future with glowing neon, rain-slicked streets, and digital enhancement aesthetic"
  },

  "minimalist-clean": {
    id: "minimalist-clean",
    name: "Minimalist Clean",
    description: "Clean minimalist aesthetic with white space and geometric forms",
    category: "aesthetic",
    tags: ["minimalist", "clean", "geometric", "white", "simple"],
    useCase: "Modern content, clean visuals, sophisticated storytelling",
    fields: {
      style: "minimalist geometric clarity",
      color_palette: "pure whites, soft grays, accent colors",
      lighting_type: "even clean lighting",
      camera_angle: "precise geometric angles",
      lens_type: "standard for clean precision",
      depth_of_field: "everything in clean focus"
    },
    customDetails: "Ultra-clean aesthetic with geometric precision, abundant white space, and sophisticated simplicity"
  },

  "vintage-retro": {
    id: "vintage-retro",
    name: "Vintage Retro",
    description: "Nostalgic retro aesthetic with warm tones and classic elements",
    category: "aesthetic",
    tags: ["vintage", "retro", "nostalgic", "warm", "classic"],
    useCase: "Nostalgic content, retro visuals, classic storytelling",
    fields: {
      style: "vintage nostalgic charm",
      color_palette: "warm browns, golden yellows, faded reds",
      lighting_type: "warm golden hour lighting",
      camera_angle: "classic film angles",
      lens_type: "vintage lens characteristics",
      depth_of_field: "classic film depth"
    },
    customDetails: "Nostalgic retro world with vintage textures, warm color grading, and classic film aesthetic"
  },

  "industrial-gritty": {
    id: "industrial-gritty",
    name: "Industrial Gritty",
    description: "Raw industrial aesthetic with metal textures and harsh lighting",
    category: "aesthetic",
    tags: ["industrial", "gritty", "metal", "harsh", "raw"],
    useCase: "Gritty content, industrial visuals, raw storytelling",
    fields: {
      style: "industrial grittiness",
      color_palette: "steel grays, rust oranges, dark browns",
      lighting_type: "harsh industrial lighting",
      camera_angle: "gritty handheld angles",
      lens_type: "wide angle for industrial scale",
      depth_of_field: "sharp industrial details"
    },
    customDetails: "Raw industrial environment with metal textures, harsh shadows, and unforgiving urban realism"
  },

  "bohemian-artistic": {
    id: "bohemian-artistic",
    name: "Bohemian Artistic",
    description: "Free-spirited bohemian aesthetic with artistic flair and creative chaos",
    category: "aesthetic",
    tags: ["bohemian", "artistic", "creative", "free-spirited", "eclectic"],
    useCase: "Artistic content, creative visuals, bohemian storytelling",
    fields: {
      style: "bohemian artistic freedom",
      color_palette: "rich jewel tones, earthy browns, artistic splashes",
      lighting_type: "natural artistic lighting",
      camera_angle: "creative artistic angles",
      lens_type: "standard for artistic expression",
      depth_of_field: "artistic selective focus"
    },
    customDetails: "Free-spirited artistic world with eclectic textures, creative chaos, and bohemian self-expression"
  },

  "luxury-opulent": {
    id: "luxury-opulent",
    name: "Luxury Opulent",
    description: "High-end luxury aesthetic with gold accents and premium materials",
    category: "aesthetic",
    tags: ["luxury", "opulent", "gold", "premium", "elegant"],
    useCase: "Luxury content, premium visuals, elegant storytelling",
    fields: {
      style: "luxury opulence",
      color_palette: "rich golds, deep blacks, ivory whites",
      lighting_type: "sophisticated accent lighting",
      camera_angle: "elegant refined angles",
      lens_type: "standard for luxury detail",
      depth_of_field: "luxurious selective focus"
    },
    customDetails: "Premium luxury environment with gold accents, rich textures, and sophisticated elegance"
  },

  "nature-organic": {
    id: "nature-organic",
    name: "Nature Organic",
    description: "Natural organic aesthetic with earth tones and flowing forms",
    category: "aesthetic",
    tags: ["nature", "organic", "earth", "natural", "flowing"],
    useCase: "Natural content, organic visuals, earth-friendly storytelling",
    fields: {
      style: "natural organic harmony",
      color_palette: "earth browns, forest greens, sky blues",
      lighting_type: "natural organic lighting",
      camera_angle: "natural flowing angles",
      lens_type: "standard for natural beauty",
      depth_of_field: "natural depth transitions"
    },
    customDetails: "Organic natural world with flowing forms, earth textures, and harmonious natural beauty"
  },

  "pop-art-vibrant": {
    id: "pop-art-vibrant",
    name: "Pop Art Vibrant",
    description: "Bold pop art aesthetic with vibrant colors and graphic elements",
    category: "aesthetic",
    tags: ["pop-art", "vibrant", "bold", "graphic", "colorful"],
    useCase: "Vibrant content, pop art visuals, bold storytelling",
    fields: {
      style: "pop art vibrancy",
      color_palette: "electric yellows, pop reds, vibrant blues",
      lighting_type: "bold graphic lighting",
      camera_angle: "dynamic pop art angles",
      lens_type: "standard for graphic clarity",
      depth_of_field: "graphic sharp focus"
    },
    customDetails: "Bold pop art world with vibrant colors, graphic elements, and playful artistic expression"
  },

  "steampunk-vintage": {
    id: "steampunk-vintage",
    name: "Steampunk Vintage",
    description: "Victorian steampunk aesthetic with brass gears and mechanical elements",
    category: "aesthetic",
    tags: ["steampunk", "victorian", "brass", "mechanical", "gears"],
    useCase: "Steampunk content, vintage sci-fi visuals, mechanical storytelling",
    fields: {
      style: "steampunk mechanical artistry",
      color_palette: "brass golds, copper browns, steel grays",
      lighting_type: "warm gaslight illumination",
      camera_angle: "mechanical detail angles",
      lens_type: "standard for mechanical precision",
      depth_of_field: "mechanical detail focus"
    },
    customDetails: "Victorian steampunk world with brass mechanisms, intricate gears, and mechanical ingenuity"
  },

  "ethereal-mystical": {
    id: "ethereal-mystical",
    name: "Ethereal Mystical",
    description: "Mystical ethereal aesthetic with soft glows and magical atmosphere",
    category: "aesthetic",
    tags: ["ethereal", "mystical", "magical", "glowing", "spiritual"],
    useCase: "Mystical content, ethereal visuals, spiritual storytelling",
    fields: {
      style: "ethereal mysticism",
      color_palette: "soft purples, ethereal whites, mystical blues",
      lighting_type: "soft ethereal glowing light",
      camera_angle: "mystical floating angles",
      lens_type: "soft focus for ethereal quality",
      depth_of_field: "dreamy ethereal blur"
    },
    customDetails: "Mystical ethereal realm with soft glowing light, floating elements, and spiritual transcendence"
  },

  // ART & ILLUSTRATION STYLES (12 presets)
  "watercolor-painting": {
    id: "watercolor-painting",
    name: "Watercolor Painting",
    description: "Soft watercolor aesthetic with flowing colors and paper texture",
    category: "art",
    tags: ["watercolor", "painting", "soft", "flowing", "artistic"],
    useCase: "Artistic content, painting visuals, soft storytelling",
    fields: {
      style: "watercolor painting artistry",
      color_palette: "flowing watercolor blends, soft transitions",
      lighting_type: "soft natural artistic light",
      camera_angle: "artistic composition angles",
      lens_type: "soft focus for painting quality",
      depth_of_field: "artistic watercolor blur"
    },
    customDetails: "Flowing watercolor painting with soft color transitions, paper texture, and organic artistic flow"
  },

  "3d-rendered": {
    id: "3d-rendered",
    name: "3D Rendered",
    description: "Clean 3D rendered aesthetic with smooth surfaces and perfect lighting",
    category: "art",
    tags: ["3d", "rendered", "digital", "clean", "smooth"],
    useCase: "3D content, digital art visuals, clean storytelling",
    fields: {
      style: "3D digital rendering",
      color_palette: "clean digital colors, perfect gradients",
      lighting_type: "perfect 3D studio lighting",
      camera_angle: "precise 3D camera angles",
      lens_type: "digital lens perfection",
      depth_of_field: "3D depth of field control"
    },
    customDetails: "Perfect 3D rendered world with smooth surfaces, clean textures, and digital precision"
  },

  "pencil-sketch": {
    id: "pencil-sketch",
    name: "Pencil Sketch",
    description: "Hand-drawn pencil sketch aesthetic with graphite textures and paper grain",
    category: "art",
    tags: ["pencil", "sketch", "drawing", "graphite", "hand-drawn"],
    useCase: "Sketch content, drawing visuals, artistic storytelling",
    fields: {
      style: "pencil sketch artistry",
      color_palette: "graphite grays, paper whites, sketch tones",
      lighting_type: "natural drawing light",
      camera_angle: "sketch composition angles",
      lens_type: "standard for sketch clarity",
      depth_of_field: "sketch drawing focus"
    },
    customDetails: "Hand-drawn pencil world with graphite textures, paper grain, and artistic sketch energy"
  },

  "oil-painting": {
    id: "oil-painting",
    name: "Oil Painting",
    description: "Rich oil painting aesthetic with thick brushstrokes and canvas texture",
    category: "art",
    tags: ["oil", "painting", "brushstrokes", "canvas", "rich"],
    useCase: "Classical art content, painting visuals, rich storytelling",
    fields: {
      style: "oil painting mastery",
      color_palette: "rich oil paint colors, deep saturation",
      lighting_type: "classical painting light",
      camera_angle: "classical composition angles",
      lens_type: "standard for painting detail",
      depth_of_field: "painting depth layers"
    },
    customDetails: "Classical oil painting with thick impasto brushstrokes, canvas texture, and rich artistic tradition"
  },

  "digital-illustration": {
    id: "digital-illustration",
    name: "Digital Illustration",
    description: "Modern digital illustration with clean lines and vibrant colors",
    category: "illustration",
    tags: ["digital", "illustration", "clean", "modern", "vibrant"],
    useCase: "Digital art content, illustration visuals, modern storytelling",
    fields: {
      style: "digital illustration artistry",
      color_palette: "vibrant digital colors, clean gradients",
      lighting_type: "digital illustration lighting",
      camera_angle: "illustration composition angles",
      lens_type: "digital lens clarity",
      depth_of_field: "illustration depth control"
    },
    customDetails: "Modern digital illustration with clean vector lines, vibrant colors, and contemporary artistic style"
  },

  "ink-wash": {
    id: "ink-wash",
    name: "Ink Wash",
    description: "Traditional ink wash aesthetic with flowing black ink and water effects",
    category: "art",
    tags: ["ink", "wash", "traditional", "flowing", "monochrome"],
    useCase: "Traditional art content, ink visuals, flowing storytelling",
    fields: {
      style: "ink wash tradition",
      color_palette: "black ink gradients, water flow tones",
      lighting_type: "natural ink wash light",
      camera_angle: "traditional composition angles",
      lens_type: "standard for ink detail",
      depth_of_field: "ink wash flow focus"
    },
    customDetails: "Traditional ink wash painting with flowing black ink, water effects, and meditative artistic flow"
  },

  "vector-graphics": {
    id: "vector-graphics",
    name: "Vector Graphics",
    description: "Clean vector graphic aesthetic with geometric shapes and bold colors",
    category: "illustration",
    tags: ["vector", "graphics", "geometric", "clean", "bold"],
    useCase: "Graphic design content, vector visuals, clean storytelling",
    fields: {
      style: "vector graphic design",
      color_palette: "bold flat colors, clean gradients",
      lighting_type: "even graphic lighting",
      camera_angle: "graphic design angles",
      lens_type: "digital vector clarity",
      depth_of_field: "vector graphic sharpness"
    },
    customDetails: "Clean vector graphic world with geometric precision, bold flat colors, and graphic design clarity"
  },

  "charcoal-drawing": {
    id: "charcoal-drawing",
    name: "Charcoal Drawing",
    description: "Dramatic charcoal drawing aesthetic with deep blacks and soft smudging",
    category: "art",
    tags: ["charcoal", "drawing", "dramatic", "smudging", "contrast"],
    useCase: "Dramatic art content, drawing visuals, contrast storytelling",
    fields: {
      style: "charcoal drawing drama",
      color_palette: "charcoal blacks, paper whites, soft grays",
      lighting_type: "dramatic drawing light",
      camera_angle: "dramatic composition angles",
      lens_type: "standard for charcoal texture",
      depth_of_field: "charcoal drawing focus"
    },
    customDetails: "Dramatic charcoal drawing with deep blacks, soft smudging, and powerful contrast effects"
  },

  "collage-mixed": {
    id: "collage-mixed",
    name: "Collage Mixed Media",
    description: "Mixed media collage aesthetic with layered textures and diverse materials",
    category: "art",
    tags: ["collage", "mixed-media", "layered", "textured", "diverse"],
    useCase: "Mixed media content, collage visuals, layered storytelling",
    fields: {
      style: "mixed media collage",
      color_palette: "diverse material colors, layered tones",
      lighting_type: "mixed media lighting",
      camera_angle: "collage composition angles",
      lens_type: "standard for texture detail",
      depth_of_field: "layered media focus"
    },
    customDetails: "Creative mixed media collage with layered textures, diverse materials, and artistic experimentation"
  },

  "pastel-drawing": {
    id: "pastel-drawing",
    name: "Pastel Drawing",
    description: "Soft pastel drawing aesthetic with blended colors and gentle textures",
    category: "art",
    tags: ["pastel", "drawing", "soft", "blended", "gentle"],
    useCase: "Soft art content, pastel visuals, gentle storytelling",
    fields: {
      style: "pastel drawing softness",
      color_palette: "soft pastel colors, gentle blends",
      lighting_type: "soft pastel light",
      camera_angle: "gentle composition angles",
      lens_type: "soft focus for pastel quality",
      depth_of_field: "pastel drawing softness"
    },
    customDetails: "Gentle pastel drawing with soft color blending, textured paper, and delicate artistic touch"
  },

  "comic-book": {
    id: "comic-book",
    name: "Comic Book",
    description: "Bold comic book aesthetic with strong outlines and pop art colors",
    category: "illustration",
    tags: ["comic", "book", "bold", "outlines", "pop"],
    useCase: "Comic content, graphic novel visuals, bold storytelling",
    fields: {
      style: "comic book artistry",
      color_palette: "bold comic colors, high contrast",
      lighting_type: "dramatic comic lighting",
      camera_angle: "dynamic comic angles",
      lens_type: "standard for comic clarity",
      depth_of_field: "comic book focus"
    },
    customDetails: "Dynamic comic book world with bold outlines, speech bubbles, and superhero visual energy"
  },

  "abstract-expressionism": {
    id: "abstract-expressionism",
    name: "Abstract Expressionism",
    description: "Expressive abstract aesthetic with bold brushstrokes and emotional color",
    category: "art",
    tags: ["abstract", "expressionism", "bold", "emotional", "painterly"],
    useCase: "Abstract art content, expressive visuals, emotional storytelling",
    fields: {
      style: "abstract expressionist painting",
      color_palette: "bold expressive colors, emotional tones",
      lighting_type: "expressive artistic light",
      camera_angle: "abstract composition angles",
      lens_type: "standard for abstract detail",
      depth_of_field: "expressive painting focus"
    },
    customDetails: "Bold abstract expressionist painting with emotional brushstrokes, expressive color, and artistic freedom"
  }
};

// Style category organization for director styles
export const directorCategories = {
  precision: {
    name: "Precision Masters",
    icon: "🎯",
    presets: ["kubrick-symmetry", "anderson-centered", "fincher-precision"]
  },
  dialogue: {
    name: "Dialogue Driven", 
    icon: "💬",
    presets: ["tarantino-dialogue", "spielberg-family"]
  },
  movement: {
    name: "Dynamic Movement",
    icon: "🎬",
    presets: ["scorsese-tracking", "wright-dynamic", "bay-explosion"]
  },
  epic: {
    name: "Epic Scale",
    icon: "🌅",
    presets: ["nolan-complexity", "villeneuve-epic"]
  },
  genre: {
    name: "Genre Masters",
    icon: "🎭",
    presets: ["wright-cornetto", "carpenter-horror"]
  },
  aesthetic: {
    name: "Visual Aesthetics",
    icon: "🎨",
    presets: ["gothic-dark", "pastel-soft", "cyberpunk-neon", "minimalist-clean", "vintage-retro", "industrial-gritty", "bohemian-artistic", "luxury-opulent", "nature-organic", "pop-art-vibrant", "steampunk-vintage", "ethereal-mystical"]
  },
  art: {
    name: "Art & Illustration",
    icon: "🖼️",
    presets: ["watercolor-painting", "3d-rendered", "pencil-sketch", "oil-painting", "digital-illustration", "ink-wash", "vector-graphics", "charcoal-drawing", "collage-mixed", "pastel-drawing", "comic-book", "abstract-expressionism"]
  }
};