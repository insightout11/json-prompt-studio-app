export const actionPresets = {
  // CHASE & PURSUIT ACTIONS (5 presets)
  "high-speed-chase": {
    id: "high-speed-chase",
    name: "High-Speed Chase",
    description: "Intense vehicular pursuit through urban streets",
    category: "chase",
    tags: ["chase", "vehicles", "action", "pursuit"],
    useCase: "Action sequences, thriller content, high-energy pursuits",
    fields: {
      actions: "high-speed chase",
      scene: "Intense chase scene weaving through traffic and pedestrians",
      dialogue: "Hold on tight! We're not losing them!",
      camera_angle: "low tracking angle",
      camera_distance: "following shot",
      motion_type: "fast tracking"
    },
    customDetails: "High-octane vehicular chase with screeching tires, honking cars, and adrenaline-pumping pursuit energy"
  },

  "foot-chase-parkour": {
    id: "foot-chase-parkour",
    name: "Parkour Foot Chase",
    description: "Athletic pursuit across rooftops and urban obstacles",
    category: "chase",
    tags: ["parkour", "athletic", "rooftops", "chase"],
    useCase: "Action sequences, athletic content, urban exploration",
    fields: {
      actions: "parkour chase",
      scene: "Athletic chase leaping across rooftops and scaling walls",
      dialogue: "You can run, but you can't hide!",
      camera_angle: "dynamic following angles",
      camera_distance: "medium tracking",
      motion_type: "fluid athletic movement"
    },
    customDetails: "Fluid athletic pursuit with gravity-defying leaps, wall runs, and the pure athleticism of parkour movement"
  },

  "underwater-chase": {
    id: "underwater-chase",
    name: "Underwater Chase",
    description: "Submerged pursuit through aquatic environment",
    category: "chase",
    tags: ["underwater", "swimming", "aquatic", "unique"],
    useCase: "Unique action sequences, underwater scenes, aquatic adventures",
    fields: {
      actions: "underwater pursuit",
      scene: "Breathless chase through underwater caves and coral reefs",
      dialogue: "The current is too strong!",
      camera_angle: "floating perspective",
      camera_distance: "immersive medium shots",
      motion_type: "fluid underwater movement"
    },
    customDetails: "Unique aquatic pursuit with bubbles, flowing water, and the weightless grace of underwater movement"
  },

  "motorcycle-escape": {
    id: "motorcycle-escape",
    name: "Motorcycle Escape",
    description: "High-speed bike escape through narrow spaces",
    category: "chase",
    tags: ["motorcycle", "escape", "narrow-spaces", "speed"],
    useCase: "Action sequences, escape scenes, motorcycle content",
    fields: {
      actions: "motorcycle escape",
      scene: "Weaving through traffic on a powerful motorcycle",
      dialogue: "They'll never catch us on this!",
      camera_angle: "low road-level shots",
      camera_distance: "close following",
      motion_type: "high-speed weaving"
    },
    customDetails: "Thrilling motorcycle escape with engine roar, wind effects, and the freedom of two-wheeled speed"
  },

  "forest-pursuit": {
    id: "forest-pursuit",
    name: "Forest Pursuit",
    description: "Chase through dense woodland and natural obstacles",
    category: "chase",
    tags: ["forest", "natural", "terrain", "obstacles"],
    useCase: "Nature action, survival content, outdoor adventures",
    fields: {
      actions: "forest chase",
      scene: "Desperate pursuit through dense trees and undergrowth",
      dialogue: "Stay low and keep moving!",
      camera_angle: "handheld through trees",
      camera_distance: "intimate close shots",
      motion_type: "erratic natural movement"
    },
    customDetails: "Intense woodland pursuit with branches snapping, leaves rustling, and the raw challenge of natural terrain"
  },

  // DIALOGUE & CONVERSATION ACTIONS (5 presets)
  "heated-argument": {
    id: "heated-argument",
    name: "Heated Argument",
    description: "Intense confrontational dialogue with rising tension",
    category: "dialogue",
    tags: ["argument", "confrontation", "tension", "drama"],
    useCase: "Dramatic scenes, relationship content, conflict moments",
    fields: {
      actions: "arguing intensely",
      scene: "Two people in heated debate with escalating emotions",
      dialogue: "You never listen to what I'm actually saying!",
      camera_angle: "alternating close-ups",
      camera_distance: "intimate close shots",
      motion_type: "tension-building static"
    },
    customDetails: "Emotionally charged confrontation with raised voices, dramatic gestures, and palpable tension"
  },

  "heartfelt-confession": {
    id: "heartfelt-confession",
    name: "Heartfelt Confession",
    description: "Vulnerable emotional revelation between characters",
    category: "dialogue",
    tags: ["confession", "emotional", "vulnerable", "intimate"],
    useCase: "Romantic content, emotional scenes, character development",
    fields: {
      actions: "confessing feelings",
      scene: "Intimate moment of vulnerable truth-telling",
      dialogue: "I've been wanting to tell you this for so long...",
      camera_angle: "soft intimate angles",
      camera_distance: "close emotional shots",
      motion_type: "gentle subtle movement"
    },
    customDetails: "Tender emotional moment with soft lighting, genuine vulnerability, and the courage of honest confession"
  },

  "business-negotiation": {
    id: "business-negotiation",
    name: "Business Negotiation",
    description: "Professional high-stakes business discussion",
    category: "dialogue",
    tags: ["business", "negotiation", "professional", "stakes"],
    useCase: "Corporate content, professional scenes, business drama",
    fields: {
      actions: "negotiating deal",
      scene: "High-stakes business meeting with contract discussion",
      dialogue: "This deal could change everything for both our companies.",
      camera_angle: "boardroom perspectives",
      camera_distance: "professional medium shots",
      motion_type: "calculated precise movements"
    },
    customDetails: "Professional business environment with suit-clad executives, contract papers, and calculated corporate strategy"
  },

  "family-reunion": {
    id: "family-reunion",
    name: "Family Reunion",
    description: "Emotional family gathering with mixed feelings",
    category: "dialogue",
    tags: ["family", "reunion", "emotional", "gathering"],
    useCase: "Family content, emotional scenes, holiday gatherings",
    fields: {
      actions: "family gathering",
      scene: "Emotional family reunion with laughter and tears",
      dialogue: "It's been too long since we were all together.",
      camera_angle: "warm group shots",
      camera_distance: "inclusive wide shots",
      motion_type: "warm embracing movement"
    },
    customDetails: "Heartwarming family environment with shared memories, generational connections, and the comfort of belonging"
  },

  "secret-conspiracy": {
    id: "secret-conspiracy",
    name: "Secret Conspiracy",
    description: "Hushed plotting and secretive planning dialogue",
    category: "dialogue",
    tags: ["conspiracy", "secret", "plotting", "whispers"],
    useCase: "Thriller content, mystery scenes, secretive planning",
    fields: {
      actions: "whispering secrets",
      scene: "Secretive meeting in shadowy location discussing plans",
      dialogue: "If anyone finds out about this, we're all finished.",
      camera_angle: "conspiratorial close-ups",
      camera_distance: "intimate secretive shots",
      motion_type: "careful cautious movement"
    },
    customDetails: "Mysterious secretive atmosphere with hushed voices, looking over shoulders, and the tension of hidden agendas"
  },

  // FIGHT & COMBAT ACTIONS (4 presets)
  "martial-arts-duel": {
    id: "martial-arts-duel",
    name: "Martial Arts Duel",
    description: "Choreographed combat between skilled fighters",
    category: "combat",
    tags: ["martial-arts", "choreographed", "skilled", "honor"],
    useCase: "Action sequences, martial arts content, honor duels",
    fields: {
      actions: "martial arts fighting",
      scene: "Elegant martial arts combat with flowing techniques",
      dialogue: "Your technique is impressive, but not enough!",
      camera_angle: "wide combat angles",
      camera_distance: "full-body action shots",
      motion_type: "fluid choreographed combat"
    },
    customDetails: "Graceful martial arts combat with flowing movements, disciplined technique, and the art of fighting"
  },

  "street-brawl": {
    id: "street-brawl",
    name: "Street Brawl",
    description: "Raw unpolished fight in urban environment",
    category: "combat",
    tags: ["street-fight", "raw", "urban", "gritty"],
    useCase: "Gritty action, urban content, realistic fighting",
    fields: {
      actions: "street fighting",
      scene: "Brutal street fight with improvised weapons and raw aggression",
      dialogue: "You picked the wrong person to mess with!",
      camera_angle: "gritty handheld angles",
      camera_distance: "intense close combat",
      motion_type: "chaotic aggressive movement"
    },
    customDetails: "Raw street combat with improvised weapons, environmental hazards, and the brutal reality of fighting"
  },

  "lightsaber-duel": {
    id: "lightsaber-duel",
    name: "Lightsaber Duel",
    description: "Epic sci-fi weapon combat with energy blades",
    category: "combat",
    tags: ["sci-fi", "lightsaber", "epic", "energy"],
    useCase: "Sci-fi content, epic battles, futuristic combat",
    fields: {
      actions: "lightsaber combat",
      scene: "Epic lightsaber duel with crackling energy blades",
      dialogue: "The Force is strong with you, but not strong enough!",
      camera_angle: "epic wide angles",
      camera_distance: "dramatic full shots",
      motion_type: "energy-charged combat"
    },
    customDetails: "Epic sci-fi combat with glowing energy weapons, Force powers, and the drama of galactic conflict"
  },

  "boxing-ring": {
    id: "boxing-ring",
    name: "Boxing Ring",
    description: "Professional boxing match with crowd and rules",
    category: "combat",
    tags: ["boxing", "professional", "sport", "crowd"],
    useCase: "Sports content, boxing matches, competitive fighting",
    fields: {
      actions: "boxing match",
      scene: "Professional boxing ring with cheering crowd",
      dialogue: "Stay focused! Keep your guard up!",
      camera_angle: "ringside perspectives",
      camera_distance: "sports broadcast shots",
      motion_type: "athletic boxing movement"
    },
    customDetails: "Professional boxing environment with referee, crowd noise, and the controlled aggression of sport combat"
  },

  // ROMANTIC & INTIMATE ACTIONS (4 presets)
  "first-kiss": {
    id: "first-kiss",
    name: "First Kiss",
    description: "Tender romantic moment of first physical connection",
    category: "romance",
    tags: ["kiss", "romantic", "tender", "first-time"],
    useCase: "Romantic content, relationship milestones, tender moments",
    fields: {
      actions: "sharing first kiss",
      scene: "Tender moment of first romantic kiss under soft lighting",
      dialogue: "I've been waiting for this moment...",
      camera_angle: "intimate romantic angles",
      camera_distance: "close romantic shots",
      motion_type: "gentle tender movement"
    },
    customDetails: "Romantic atmosphere with soft lighting, gentle music, and the magic of first romantic connection"
  },

  "surprise-proposal": {
    id: "surprise-proposal",
    name: "Surprise Proposal",
    description: "Life-changing marriage proposal moment",
    category: "romance",
    tags: ["proposal", "marriage", "surprise", "life-changing"],
    useCase: "Romantic content, proposal videos, milestone moments",
    fields: {
      actions: "proposing marriage",
      scene: "Surprise marriage proposal in romantic setting",
      dialogue: "Will you marry me and make me the happiest person alive?",
      camera_angle: "emotional proposal angles",
      camera_distance: "intimate life-moment shots",
      motion_type: "emotional revelation movement"
    },
    customDetails: "Life-changing proposal moment with ring reveal, emotional surprise, and the promise of forever"
  },

  "anniversary-dance": {
    id: "anniversary-dance",
    name: "Anniversary Dance",
    description: "Celebrating relationship milestone with intimate dance",
    category: "romance",
    tags: ["anniversary", "dance", "celebration", "milestone"],
    useCase: "Anniversary content, celebration videos, romantic dancing",
    fields: {
      actions: "slow dancing",
      scene: "Intimate anniversary dance in romantic setting",
      dialogue: "After all these years, you still take my breath away.",
      camera_angle: "romantic dancing angles",
      camera_distance: "intimate celebration shots",
      motion_type: "graceful dancing movement"
    },
    customDetails: "Romantic anniversary celebration with slow dancing, shared memories, and the deepening of long-term love"
  },

  "wedding-vows": {
    id: "wedding-vows",
    name: "Wedding Vows",
    description: "Emotional exchange of marriage vows",
    category: "romance",
    tags: ["wedding", "vows", "marriage", "ceremony"],
    useCase: "Wedding content, ceremony videos, marriage moments",
    fields: {
      actions: "exchanging vows",
      scene: "Emotional wedding ceremony with vow exchange",
      dialogue: "I promise to love you in good times and bad, for all the days of my life.",
      camera_angle: "ceremonial wedding angles",
      camera_distance: "intimate ceremony shots",
      motion_type: "ceremonial formal movement"
    },
    customDetails: "Sacred wedding ceremony with formal vows, emotional tears, and the beginning of married life"
  },

  // POSES & GESTURES ACTIONS (12 presets)
  "confident-power-pose": {
    id: "confident-power-pose",
    name: "Confident Power Pose",
    description: "Strong, authoritative stance with hands on hips",
    category: "pose",
    tags: ["pose", "confident", "power", "authority", "stance"],
    useCase: "Leadership content, motivational videos, confidence building",
    fields: {
      actions: "power posing",
      scene: "Standing in confident power pose with feet shoulder-width apart",
      dialogue: "I've got this under control.",
      camera_angle: "low angle to emphasize power",
      camera_distance: "medium full shot",
      motion_type: "static confident pose"
    },
    customDetails: "Superman-style pose with chest out, shoulders back, hands on hips, projecting confidence and authority"
  },

  "professional-handshake": {
    id: "professional-handshake",
    name: "Professional Handshake",
    description: "Firm business handshake with direct eye contact",
    category: "gesture",
    tags: ["handshake", "business", "professional", "greeting", "gesture"],
    useCase: "Business videos, networking content, professional introductions",
    fields: {
      actions: "shaking hands",
      scene: "Professional handshake between two business people",
      dialogue: "It's a pleasure to meet you.",
      camera_angle: "medium close-up",
      camera_distance: "medium shot",
      motion_type: "confident handshake gesture"
    },
    customDetails: "Firm grip, direct eye contact, confident smile, professional business attire, networking energy"
  },

  "thinking-chin-stroke": {
    id: "thinking-chin-stroke",
    name: "Thinking Chin Stroke",
    description: "Contemplative pose with hand stroking chin",
    category: "pose",
    tags: ["thinking", "contemplative", "chin", "gesture", "consideration"],
    useCase: "Decision-making content, analytical videos, thoughtful moments",
    fields: {
      actions: "thinking deeply",
      scene: "Person in thoughtful pose with hand stroking chin",
      dialogue: "Let me think about this...",
      camera_angle: "close-up on face and gesture",
      camera_distance: "close-up shot",
      motion_type: "slow thoughtful gesture"
    },
    customDetails: "Contemplative expression, hand gently stroking chin, furrowed brow, deep in thought, analytical pose"
  },

  "enthusiastic-thumbs-up": {
    id: "enthusiastic-thumbs-up",
    name: "Enthusiastic Thumbs Up",
    description: "Positive gesture with big smile and thumbs up",
    category: "gesture",
    tags: ["thumbs-up", "positive", "enthusiastic", "approval", "gesture"],
    useCase: "Positive content, approval videos, success celebrations",
    fields: {
      actions: "giving thumbs up",
      scene: "Enthusiastic person giving double thumbs up with big smile",
      dialogue: "That's exactly what we needed!",
      camera_angle: "medium angle",
      camera_distance: "medium shot",
      motion_type: "energetic positive gesture"
    },
    customDetails: "Big genuine smile, both thumbs up, energetic body language, positive radiating energy, celebratory mood"
  },

  "crossed-arms-skeptical": {
    id: "crossed-arms-skeptical",
    name: "Crossed Arms Skeptical",
    description: "Defensive pose with arms crossed and skeptical expression",
    category: "pose",
    tags: ["crossed-arms", "skeptical", "defensive", "doubt", "pose"],
    useCase: "Disagreement scenes, skeptical content, defensive reactions",
    fields: {
      actions: "crossing arms defensively",
      scene: "Person with arms crossed looking skeptical and defensive",
      dialogue: "I'm not so sure about that.",
      camera_angle: "straight-on angle",
      camera_distance: "medium shot",
      motion_type: "static defensive pose"
    },
    customDetails: "Arms tightly crossed, raised eyebrow, skeptical expression, defensive body language, closed-off posture"
  },

  "pointing-direction": {
    id: "pointing-direction",
    name: "Pointing Direction",
    description: "Clear directional gesture pointing with extended arm",
    category: "gesture",
    tags: ["pointing", "direction", "guidance", "instruction", "gesture"],
    useCase: "Instructional content, guidance videos, directional information",
    fields: {
      actions: "pointing direction",
      scene: "Person clearly pointing in a specific direction with confident gesture",
      dialogue: "The answer is right over there.",
      camera_angle: "side angle to show gesture",
      camera_distance: "medium wide shot",
      motion_type: "clear directional gesture"
    },
    customDetails: "Extended arm pointing clearly, confident stance, direct gaze, instructional body language, guidance posture"
  },

  "open-palms-welcome": {
    id: "open-palms-welcome",
    name: "Open Palms Welcome",
    description: "Welcoming gesture with open palms and arms spread",
    category: "gesture",
    tags: ["welcome", "open", "inviting", "palms", "gesture"],
    useCase: "Welcome videos, hospitality content, inviting presentations",
    fields: {
      actions: "welcoming with open arms",
      scene: "Person in welcoming pose with open palms and spread arms",
      dialogue: "Welcome! We're so glad you're here.",
      camera_angle: "medium angle",
      camera_distance: "medium wide shot",
      motion_type: "open welcoming gesture"
    },
    customDetails: "Arms spread wide, palms open and visible, warm smile, inviting posture, hospitality energy, inclusive gesture"
  },

  "shrug-uncertainty": {
    id: "shrug-uncertainty",
    name: "Shrug Uncertainty",
    description: "Classic shoulder shrug gesture expressing uncertainty",
    category: "gesture",
    tags: ["shrug", "uncertainty", "confusion", "gesture", "unknown"],
    useCase: "Confusion content, uncertainty moments, 'I don't know' reactions",
    fields: {
      actions: "shrugging shoulders",
      scene: "Person doing classic shoulder shrug with palms up",
      dialogue: "I honestly have no idea.",
      camera_angle: "medium angle",
      camera_distance: "medium shot",
      motion_type: "shoulder shrug gesture"
    },
    customDetails: "Shoulders raised, palms turned up, confused expression, uncertainty body language, 'I don't know' energy"
  },

  "leaning-casual": {
    id: "leaning-casual",
    name: "Leaning Casual",
    description: "Relaxed pose leaning against wall or surface",
    category: "pose",
    tags: ["leaning", "casual", "relaxed", "laid-back", "pose"],
    useCase: "Casual content, relaxed presentations, laid-back interviews",
    fields: {
      actions: "leaning casually",
      scene: "Person in relaxed pose leaning against wall with casual stance",
      dialogue: "Yeah, that sounds about right.",
      camera_angle: "slight side angle",
      camera_distance: "medium shot",
      motion_type: "relaxed leaning pose"
    },
    customDetails: "Leaning against surface, one foot crossed over other, relaxed shoulders, casual comfortable energy, laid-back vibe"
  },

  "facepalm-frustration": {
    id: "facepalm-frustration",
    name: "Facepalm Frustration",
    description: "Hand covering face in frustration or disappointment",
    category: "gesture",
    tags: ["facepalm", "frustration", "disappointment", "gesture", "exasperation"],
    useCase: "Frustration content, disappointment reactions, exasperation moments",
    fields: {
      actions: "facepalming",
      scene: "Person with hand covering face in clear frustration gesture",
      dialogue: "I can't believe this happened again.",
      camera_angle: "close-up angle",
      camera_distance: "close-up shot",
      motion_type: "frustrated facepalm gesture"
    },
    customDetails: "Hand fully covering face, visible frustration, disappointed body language, exasperated energy, 'I give up' gesture"
  },

  "presentation-gesture": {
    id: "presentation-gesture",
    name: "Presentation Gesture",
    description: "Professional presenting pose with open hand gesture",
    category: "gesture",
    tags: ["presentation", "professional", "speaking", "gesture", "explaining"],
    useCase: "Presentation videos, educational content, professional speaking",
    fields: {
      actions: "presenting information",
      scene: "Professional presenter with open hand gesture explaining content",
      dialogue: "As you can see in this example...",
      camera_angle: "medium angle",
      camera_distance: "medium shot",
      motion_type: "professional presentation gesture"
    },
    customDetails: "Open hand gesture, professional stance, engaging eye contact, explanation posture, educational energy"
  },

  "victory-celebration": {
    id: "victory-celebration",
    name: "Victory Celebration",
    description: "Triumphant pose with arms raised in celebration",
    category: "pose",
    tags: ["victory", "celebration", "triumph", "success", "pose"],
    useCase: "Success content, victory moments, achievement celebrations",
    fields: {
      actions: "celebrating victory",
      scene: "Person with arms raised high in triumphant victory pose",
      dialogue: "We did it! We actually did it!",
      camera_angle: "low angle for drama",
      camera_distance: "medium wide shot",
      motion_type: "triumphant victory pose"
    },
    customDetails: "Both arms raised high, huge smile, triumphant energy, celebration posture, winner's stance, pure joy"
  },

  // COMEDY & HUMOROUS ACTIONS (4 presets)
  "slapstick-mishap": {
    id: "slapstick-mishap",
    name: "Slapstick Mishap",
    description: "Physical comedy with exaggerated reactions",
    category: "comedy",
    tags: ["slapstick", "physical", "mishap", "exaggerated"],
    useCase: "Comedy content, physical humor, entertaining mishaps",
    fields: {
      actions: "physical comedy mishap",
      scene: "Exaggerated physical comedy with pratfalls and mishaps",
      dialogue: "This is not how I planned this to go!",
      camera_angle: "comedy timing angles",
      camera_distance: "full-body comedy shots",
      motion_type: "exaggerated physical comedy"
    },
    customDetails: "Classic physical comedy with perfect timing, exaggerated reactions, and the universal humor of mishaps"
  },

  "awkward-encounter": {
    id: "awkward-encounter",
    name: "Awkward Encounter",
    description: "Uncomfortable social situation with cringe humor",
    category: "comedy",
    tags: ["awkward", "social", "cringe", "uncomfortable"],
    useCase: "Cringe comedy, social humor, awkward situations",
    fields: {
      actions: "awkward social interaction",
      scene: "Painfully awkward social encounter with visible discomfort",
      dialogue: "So... this is awkward... should I just...?",
      camera_angle: "uncomfortable close-ups",
      camera_distance: "cringe-inducing intimate shots",
      motion_type: "uncomfortable fidgeting"
    },
    customDetails: "Cringe-worthy social situation with visible discomfort, awkward pauses, and relatable social anxiety"
  },

  "prank-gone-wrong": {
    id: "prank-gone-wrong",
    name: "Prank Gone Wrong",
    description: "Harmless prank escalating into chaos",
    category: "comedy",
    tags: ["prank", "chaos", "escalation", "unintended"],
    useCase: "Prank content, comedy chaos, unintended consequences",
    fields: {
      actions: "prank backfiring",
      scene: "Simple prank escalating into complete chaos",
      dialogue: "That was NOT supposed to happen!",
      camera_angle: "chaos documentation angles",
      camera_distance: "wide chaos-capturing shots",
      motion_type: "escalating chaotic movement"
    },
    customDetails: "Comedy chaos with unintended consequences, escalating mayhem, and the humor of plans going sideways"
  },

  "dad-joke-delivery": {
    id: "dad-joke-delivery",  
    name: "Dad Joke Delivery",
    description: "Perfectly timed dad joke with maximum cheese factor",
    category: "comedy",
    tags: ["dad-joke", "puns", "wholesome", "cheesy"],
    useCase: "Family comedy, wholesome humor, pun-based content",
    fields: {
      actions: "delivering dad joke",
      scene: "Perfectly timed dad joke delivery with maximum cheese",
      dialogue: "Why don't scientists trust atoms? Because they make up everything!",
      camera_angle: "dad-joke timing angles",
      camera_distance: "reaction-capturing shots",
      motion_type: "confident dad-joke gestures"
    },
    customDetails: "Wholesome dad humor with perfect timing, cheesy delivery, and the endearing confidence of paternal comedy"
  },

  // EXPRESSIONS & REACTIONS (12 presets) - Facial & Emotional 🎭
  "laughing-eyes-closed": {
    id: "laughing-eyes-closed",
    name: "Laughing Eyes Closed",
    description: "Uncontrollable laughter with eyes squeezed shut in pure joy",
    category: "expression",
    tags: ["laughter", "joy", "happiness", "infectious"],
    useCase: "Comedy content, joyful moments, infectious laughter, happy scenes",
    fields: {
      actions: "laughing uncontrollably",
      scene: "Person doubled over with laughter, eyes squeezed shut in pure joy",
      dialogue: "I can't stop laughing! This is too funny!",
      camera_angle: "close-up on joyful expression",
      camera_distance: "medium close shot",
      motion_type: "shaking with laughter"
    },
    customDetails: "Eyes squeezed completely shut, huge genuine smile, shoulders shaking, tears of laughter, completely overcome with joy"
  },

  "shocked-hands-on-cheeks": {
    id: "shocked-hands-on-cheeks",
    name: "Shocked Hands on Cheeks",
    description: "Classic home alone shock pose with hands covering cheeks",
    category: "expression",
    tags: ["shock", "surprise", "disbelief", "iconic"],
    useCase: "Surprise reveals, shocking news, disbelief moments, dramatic reactions",
    fields: {
      actions: "expressing shock",
      scene: "Person with hands pressed to cheeks in complete surprise",
      dialogue: "I can't believe this is happening!",
      camera_angle: "front-facing dramatic angle",
      camera_distance: "medium shot",
      motion_type: "frozen in shock"
    },
    customDetails: "Both hands pressed to cheeks, mouth wide open, eyes huge with surprise, classic shocked expression"
  },

  "angry-fist-raised": {
    id: "angry-fist-raised",
    name: "Angry Fist Raised",
    description: "Defiant anger with fist raised in righteous indignation",
    category: "expression",
    tags: ["anger", "defiance", "protest", "righteous"],
    useCase: "Protest content, anger scenes, defiant moments, righteous indignation",
    fields: {
      actions: "raising fist in anger",
      scene: "Person with fist raised high in defiant anger",
      dialogue: "This is completely unacceptable!",
      camera_angle: "low angle for dramatic effect",
      camera_distance: "medium shot",
      motion_type: "powerful fist gesture"
    },
    customDetails: "Fist raised high, face red with anger, jaw clenched, defiant posture, righteous indignation energy"
  },

  "sad-tear-rolling": {
    id: "sad-tear-rolling",
    name: "Sad Tear Rolling",
    description: "Single tear rolling down cheek in quiet sadness",
    category: "expression",
    tags: ["sadness", "emotion", "tear", "melancholy"],
    useCase: "Emotional content, sad moments, touching scenes, heartbreak",
    fields: {
      actions: "crying quietly",
      scene: "Person with a single tear slowly rolling down their cheek",
      dialogue: "I never thought it would end like this...",
      camera_angle: "close-up on emotional expression",
      camera_distance: "tight close-up",
      motion_type: "barely contained emotion"
    },
    customDetails: "Single perfect tear, trembling lip, trying to hold back emotion, quiet sadness, heartbreaking expression"
  },

  "smiling-warmly": {
    id: "smiling-warmly", 
    name: "Smiling Warmly",
    description: "Genuine warm smile that reaches the eyes with kindness",
    category: "expression",
    tags: ["happiness", "warmth", "kindness", "genuine"],
    useCase: "Friendly content, welcoming scenes, kind interactions, positive emotions",
    fields: {
      actions: "smiling warmly",
      scene: "Person with genuine warm smile radiating kindness",
      dialogue: "It's so wonderful to see you!",
      camera_angle: "friendly straight-on angle",
      camera_distance: "medium close shot",
      motion_type: "gentle warm expression"
    },
    customDetails: "Eyes crinkled with genuine smile, warm expression, radiating kindness, approachable energy"
  },

  "rolling-eyes-annoyance": {
    id: "rolling-eyes-annoyance",
    name: "Rolling Eyes Annoyance",
    description: "Exaggerated eye roll expressing complete annoyance",
    category: "expression",
    tags: ["annoyance", "exasperation", "eye-roll", "sarcastic"],
    useCase: "Sarcastic content, annoyed reactions, exasperation moments, attitude",
    fields: {
      actions: "rolling eyes dramatically",
      scene: "Person doing exaggerated eye roll with annoyed expression",
      dialogue: "Oh, here we go again...",
      camera_angle: "slight angle to catch eye roll",
      camera_distance: "close-up shot",
      motion_type: "dramatic eye movement"
    },
    customDetails: "Eyes rolled back dramatically, annoyed expression, slight head tilt, exasperated energy"
  },

  "confused-scratching-head": {
    id: "confused-scratching-head",
    name: "Confused Scratching Head", 
    description: "Puzzled expression while scratching head in confusion",
    category: "expression",
    tags: ["confusion", "puzzled", "thinking", "perplexed"],
    useCase: "Confusion scenes, puzzle content, thinking moments, perplexed reactions",
    fields: {
      actions: "scratching head in confusion",
      scene: "Person scratching head with puzzled, confused expression",
      dialogue: "I have absolutely no idea what's going on...",
      camera_angle: "side angle to show gesture",
      camera_distance: "medium shot",
      motion_type: "confused head scratching"
    },
    customDetails: "Hand scratching head, furrowed brow, puzzled expression, completely perplexed, thinking hard"
  },

  "disgusted-nose-wrinkle": {
    id: "disgusted-nose-wrinkle",
    name: "Disgusted Nose Wrinkle",
    description: "Face scrunched in disgust with wrinkled nose",
    category: "expression", 
    tags: ["disgust", "revulsion", "grossed-out", "repulsed"],
    useCase: "Disgust reactions, gross content, repulsed moments, negative reactions",
    fields: {
      actions: "expressing disgust",
      scene: "Person with face scrunched up in complete disgust",
      dialogue: "That is absolutely disgusting!",
      camera_angle: "close-up on disgusted expression",
      camera_distance: "close-up shot",
      motion_type: "recoiling in disgust"
    },
    customDetails: "Nose wrinkled up, face scrunched, mouth turned down, pulling back from something gross"
  },

  "nervous-biting-lip": {
    id: "nervous-biting-lip",
    name: "Nervous Biting Lip",
    description: "Anxious expression while nervously biting lower lip",
    category: "expression",
    tags: ["nervousness", "anxiety", "worried", "apprehensive"],
    useCase: "Nervous content, anxiety scenes, worried moments, apprehensive situations",
    fields: {
      actions: "biting lip nervously",
      scene: "Person nervously biting lower lip with anxious expression",
      dialogue: "I'm really not sure about this...",
      camera_angle: "close-up on nervous expression",
      camera_distance: "tight close-up",
      motion_type: "nervous fidgeting"
    },
    customDetails: "Teeth gently biting lower lip, worried eyes, tense expression, nervous energy, apprehensive"
  },

  "surprised-gasp": {
    id: "surprised-gasp",
    name: "Surprised Gasp",
    description: "Sudden gasp of surprise with wide eyes and open mouth",
    category: "expression",
    tags: ["surprise", "shock", "gasp", "unexpected"],
    useCase: "Surprise moments, unexpected reveals, shock content, dramatic reactions",
    fields: {
      actions: "gasping in surprise",
      scene: "Person gasping with wide eyes and mouth open in surprise",
      dialogue: "*GASP* I never saw that coming!",
      camera_angle: "front-facing dramatic angle",
      camera_distance: "medium close shot",
      motion_type: "sudden surprised intake"
    },
    customDetails: "Mouth open in gasp, eyes wide with surprise, hand possibly to chest, sudden realization"
  },

  "proud-smirk": {
    id: "proud-smirk",
    name: "Proud Smirk",
    description: "Self-satisfied smirk showing pride in accomplishment",
    category: "expression",
    tags: ["pride", "satisfaction", "smug", "accomplished"],
    useCase: "Achievement content, proud moments, satisfaction scenes, accomplished feelings",
    fields: {
      actions: "smirking proudly",
      scene: "Person with self-satisfied smirk showing pride in achievement",
      dialogue: "I knew I could do it all along.",
      camera_angle: "slight angle for attitude",
      camera_distance: "medium close shot",
      motion_type: "confident proud stance"
    },
    customDetails: "One corner of mouth raised, confident eyes, chest out slightly, self-satisfied energy"
  },

  "excited-jumping": {
    id: "excited-jumping",
    name: "Excited Jumping in Place",
    description: "Bouncing with excitement and pure enthusiasm",
    category: "expression",
    tags: ["excitement", "enthusiasm", "energetic", "thrilled"],
    useCase: "Excitement content, enthusiastic moments, celebration scenes, high energy",
    fields: {
      actions: "jumping with excitement",
      scene: "Person bouncing up and down with pure excitement",
      dialogue: "This is the best news ever!",
      camera_angle: "medium angle to capture movement",
      camera_distance: "full body shot",
      motion_type: "bouncing with excitement"
    },
    customDetails: "Jumping up and down, huge smile, arms possibly raised, pure enthusiasm, infectious energy"
  },

  // DYNAMIC & MOVEMENT (12 presets) - Active Motion 🎮
  "running-through-street": {
    id: "running-through-street",
    name: "Running Through Street",
    description: "Fast-paced running through busy urban street",
    category: "movement",
    tags: ["running", "urban", "fast-paced", "street"],
    useCase: "Action content, chase scenes, urban running, fast movement",
    fields: {
      actions: "running at full speed",
      scene: "Person sprinting through busy city street with determination",
      dialogue: "I have to get there before it's too late!",
      camera_angle: "tracking shot following runner",
      camera_distance: "medium tracking shot",
      motion_type: "fast urban running"
    },
    customDetails: "Arms pumping, focused expression, weaving through pedestrians, urgent pace, city backdrop"
  },

  "jumping-across-gap": {
    id: "jumping-across-gap",
    name: "Jumping Across Gap",
    description: "Dramatic leap across dangerous gap or chasm",
    category: "movement",
    tags: ["jumping", "leap", "dangerous", "dramatic"],
    useCase: "Action sequences, dramatic leaps, adventure content, danger scenes",
    fields: {
      actions: "leaping across gap",
      scene: "Person making dramatic jump across dangerous gap",
      dialogue: "Here goes nothing!",
      camera_angle: "side angle capturing full leap",
      camera_distance: "wide shot showing gap",
      motion_type: "dramatic leap"
    },
    customDetails: "Mid-air leap, arms extended for balance, focused determination, gap visible below"
  },

  "dancing-energetically": {
    id: "dancing-energetically",
    name: "Dancing Energetically",
    description: "High-energy dancing with rhythm and joy",
    category: "movement",
    tags: ["dancing", "energetic", "rhythm", "celebration"],
    useCase: "Dance content, celebration scenes, energetic moments, joyful movement",
    fields: {
      actions: "dancing with energy",
      scene: "Person dancing with infectious energy and rhythm",
      dialogue: "I can't help but move to this beat!",
      camera_angle: "dynamic angles capturing movement",
      camera_distance: "medium shot showing dance",
      motion_type: "rhythmic energetic dancing"
    },
    customDetails: "Arms and body moving to rhythm, joyful expression, energetic movement, infectious enthusiasm"
  },

  "diving-into-water": {
    id: "diving-into-water",
    name: "Diving Into Water",
    description: "Graceful dive into crystal clear water",
    category: "movement",
    tags: ["diving", "water", "graceful", "athletic"],
    useCase: "Swimming content, athletic scenes, graceful movement, water activities",
    fields: {
      actions: "diving into water",
      scene: "Person executing perfect dive into clear blue water",
      dialogue: "The water looks perfect!",
      camera_angle: "side angle capturing dive form",
      camera_distance: "wide shot showing full dive",
      motion_type: "graceful diving motion"
    },
    customDetails: "Perfect diving form, arms extended, graceful entry, water splash, athletic precision"
  },

  "spinning-in-chair": {
    id: "spinning-in-chair",
    name: "Spinning in Chair",
    description: "Playful spinning in office chair with arms out",
    category: "movement",
    tags: ["spinning", "playful", "office", "carefree"],
    useCase: "Office humor, playful content, carefree moments, workplace fun",
    fields: {
      actions: "spinning in chair",
      scene: "Person spinning around in office chair with arms outstretched",
      dialogue: "Sometimes you just need to let loose!",
      camera_angle: "overhead shot capturing spin",
      camera_distance: "medium shot",
      motion_type: "playful spinning motion"
    },
    customDetails: "Arms outstretched, head tilted back, carefree expression, office chair spinning, playful energy"
  },

  "sliding-into-base": {
    id: "sliding-into-base",
    name: "Sliding Into Base",
    description: "Athletic slide into home plate or base",
    category: "movement",
    tags: ["sliding", "sports", "athletic", "baseball"],
    useCase: "Sports content, athletic achievement, competitive scenes, baseball action",
    fields: {
      actions: "sliding into base",
      scene: "Athlete making dramatic slide into home plate",
      dialogue: "Safe!",
      camera_angle: "ground level capturing slide",
      camera_distance: "close action shot",
      motion_type: "athletic sliding motion"
    },
    customDetails: "Legs extended in slide, dust kicking up, determined expression, athletic uniform, competitive energy"
  },

  "dodging-incoming-object": {
    id: "dodging-incoming-object",
    name: "Dodging Incoming Object",
    description: "Quick defensive dodge to avoid incoming projectile",
    category: "movement",
    tags: ["dodging", "defensive", "quick", "reflex"],
    useCase: "Action scenes, quick reflexes, defensive movement, danger avoidance",
    fields: {
      actions: "dodging quickly",
      scene: "Person making quick dodge to avoid incoming object",
      dialogue: "Whoa, that was close!",
      camera_angle: "action angle capturing dodge",
      camera_distance: "medium action shot",
      motion_type: "quick evasive movement"
    },
    customDetails: "Body twisted in dodge, quick reflexes, focused concentration, defensive posture, near miss"
  },

  "leaping-off-rooftop": {
    id: "leaping-off-rooftop",
    name: "Leaping Off Rooftop",
    description: "Dramatic leap from rooftop with urban backdrop",
    category: "movement",
    tags: ["leaping", "rooftop", "dramatic", "urban"],
    useCase: "Action sequences, dramatic escapes, urban parkour, dramatic leaps",
    fields: {
      actions: "leaping from rooftop",
      scene: "Person making dramatic leap from building rooftop",
      dialogue: "This is the only way out!",
      camera_angle: "cinematic angle showing height",
      camera_distance: "wide shot showing scale",
      motion_type: "dramatic rooftop leap"
    },
    customDetails: "Arms spread for balance, city backdrop below, determined expression, dramatic height, urban setting"
  },

  "sprinting-while-carrying": {
    id: "sprinting-while-carrying",
    name: "Sprinting While Carrying",
    description: "Running at full speed while carrying important object",
    category: "movement",
    tags: ["sprinting", "carrying", "urgent", "important"],
    useCase: "Action content, urgent delivery, rescue scenes, important missions",
    fields: {
      actions: "sprinting with object",
      scene: "Person running at full speed while carefully carrying something important",
      dialogue: "I have to get this there safely!",
      camera_angle: "tracking shot following runner",
      camera_distance: "medium tracking shot",
      motion_type: "urgent carrying sprint"
    },
    customDetails: "One arm protecting carried object, focused expression, urgent pace, careful balance while running"
  },

  "swinging-on-rope": {
    id: "swinging-on-rope",
    name: "Swinging on Rope",
    description: "Adventure-style rope swinging across gap or obstacle",
    category: "movement",
    tags: ["swinging", "rope", "adventure", "crossing"],
    useCase: "Adventure content, jungle scenes, obstacle crossing, action sequences",
    fields: {
      actions: "swinging on rope",
      scene: "Person swinging across gap on sturdy rope",
      dialogue: "Just like in the movies!",
      camera_angle: "wide angle showing full swing",
      camera_distance: "wide shot capturing arc",
      motion_type: "swinging arc motion"
    },
    customDetails: "Gripping rope tightly, body arced in swing, adventure setting, gap or obstacle below"
  },

  "skating-skateboarding": {
    id: "skating-skateboarding",
    name: "Skating/Skateboarding",
    description: "Smooth skateboarding with balance and style",
    category: "movement",
    tags: ["skating", "skateboarding", "balance", "style"],
    useCase: "Skateboard content, youth culture, balance sports, street culture",
    fields: {
      actions: "skateboarding smoothly",
      scene: "Person skateboarding with perfect balance and style",
      dialogue: "This is pure freedom!",
      camera_angle: "low angle following skater",
      camera_distance: "medium tracking shot",
      motion_type: "smooth skateboard gliding"
    },
    customDetails: "Perfect balance on board, arms out for stability, confident expression, street setting, smooth motion"
  },

  "flipping-table-dramatically": {
    id: "flipping-table-dramatically",
    name: "Flipping Table Dramatically",
    description: "Dramatic table flip in moment of extreme frustration",
    category: "movement",
    tags: ["dramatic", "table-flip", "frustration", "explosive"],
    useCase: "Dramatic content, extreme frustration, explosive moments, meme references",
    fields: {
      actions: "flipping table dramatically",
      scene: "Person flipping table in moment of extreme frustration",
      dialogue: "That's it! I'm done with this!",
      camera_angle: "wide angle capturing full drama",
      camera_distance: "wide shot showing action",
      motion_type: "explosive table flip"
    },
    customDetails: "Table flying through air, items scattering, explosive frustration, dramatic gesture, chaos moment"
  },

  // THINKING & CREATING (12 presets) - Mental & Creative Actions 🧠
  "writing-in-notebook": {
    id: "writing-in-notebook",
    name: "Writing in Notebook",
    description: "Thoughtful writing in journal or notebook with focused concentration",
    category: "creating",
    tags: ["writing", "notebook", "thoughtful", "creative"],
    useCase: "Writing content, creative process, journaling, thoughtful moments",
    fields: {
      actions: "writing thoughtfully",
      scene: "Person writing in notebook with focused concentration",
      dialogue: "I need to capture this thought before I lose it.",
      camera_angle: "over shoulder showing writing",
      camera_distance: "close-up on writing action",
      motion_type: "deliberate writing motions"
    },
    customDetails: "Pen moving across paper, concentrated expression, notebook open, creative energy, thoughtful posture"
  },

  "painting-on-easel": {
    id: "painting-on-easel",
    name: "Painting on Easel",
    description: "Artist painting on canvas with brush and palette",
    category: "creating",
    tags: ["painting", "art", "creative", "artistic"],
    useCase: "Art content, creative process, artistic expression, painting tutorials",
    fields: {
      actions: "painting on canvas",
      scene: "Artist painting on easel with brush and palette in hand",
      dialogue: "The colors are coming together perfectly.",
      camera_angle: "side angle showing canvas and artist",
      camera_distance: "medium shot showing setup",
      motion_type: "deliberate brush strokes"
    },
    customDetails: "Brush in hand, palette with mixed colors, canvas on easel, focused artistic expression, creative flow"
  },

  "brainstorming-sticky-notes": {
    id: "brainstorming-sticky-notes",
    name: "Brainstorming with Sticky Notes",
    description: "Creative brainstorming session with colorful sticky notes everywhere",
    category: "thinking",
    tags: ["brainstorming", "creative", "planning", "organized"],
    useCase: "Creative planning, brainstorming content, idea generation, organization",
    fields: {
      actions: "organizing ideas",
      scene: "Person surrounded by colorful sticky notes in brainstorming session",
      dialogue: "I think I'm onto something here!",
      camera_angle: "wide angle showing note chaos",
      camera_distance: "medium shot showing workspace",
      motion_type: "animated idea organization"
    },
    customDetails: "Sticky notes covering walls/surfaces, different colors for categories, mind mapping, creative chaos"
  },

  "programming-at-computer": {
    id: "programming-at-computer",
    name: "Programming at Computer",
    description: "Focused coding session with multiple monitors and keyboard",
    category: "creating",
    tags: ["programming", "coding", "technology", "focused"],
    useCase: "Tech content, programming tutorials, developer life, coding process",
    fields: {
      actions: "coding intensely",
      scene: "Programmer focused on multiple screens writing code",
      dialogue: "Just need to fix this one bug...",
      camera_angle: "over shoulder showing screens",
      camera_distance: "medium shot showing setup",
      motion_type: "rapid typing and thinking"
    },
    customDetails: "Multiple monitors with code, keyboard clicking, energy drinks nearby, focused concentration, tech setup"
  },

  "cooking-tasting-dish": {
    id: "cooking-tasting-dish",
    name: "Cooking and Tasting Dish",
    description: "Chef cooking and tasting food to perfect the flavor",
    category: "creating",
    tags: ["cooking", "tasting", "culinary", "creative"],
    useCase: "Cooking content, culinary arts, food preparation, chef skills",
    fields: {
      actions: "cooking and tasting",
      scene: "Chef cooking while tasting and adjusting seasoning",
      dialogue: "It needs just a pinch more salt.",
      camera_angle: "close-up on cooking action",
      camera_distance: "medium shot showing kitchen",
      motion_type: "culinary preparation motions"
    },
    customDetails: "Tasting spoon, ingredients around, chef's concentration, steam rising, culinary creativity"
  },

  "playing-musical-instrument": {
    id: "playing-musical-instrument",
    name: "Playing Musical Instrument",
    description: "Musician lost in the music while playing instrument",
    category: "creating",
    tags: ["music", "instrument", "creative", "passionate"],
    useCase: "Music content, artistic expression, musical performance, creative passion",
    fields: {
      actions: "playing music",
      scene: "Musician playing instrument with passionate expression",
      dialogue: "Music is the language of the soul.",
      camera_angle: "artistic angle capturing emotion",
      camera_distance: "medium shot showing instrument",
      motion_type: "rhythmic musical movement"
    },
    customDetails: "Instrument in hands, eyes closed in concentration, musical passion, body moving with rhythm"
  },

  "sculpting-clay-wheel": {
    id: "sculpting-clay-wheel",
    name: "Sculpting Clay on Wheel",
    description: "Potter shaping clay on spinning wheel with focused hands",
    category: "creating",
    tags: ["sculpting", "pottery", "clay", "handcraft"],
    useCase: "Craft content, pottery tutorials, handmade creation, artistic process",
    fields: {
      actions: "shaping clay",
      scene: "Potter working clay on spinning wheel with wet hands",
      dialogue: "The clay tells me what it wants to become.",
      camera_angle: "close-up on hands and clay",
      camera_distance: "medium shot showing wheel",
      motion_type: "gentle shaping motions"
    },
    customDetails: "Wet clay spinning, hands covered in clay, pottery wheel, focused concentration, artistic creation"
  },

  "designing-clothes-mannequin": {
    id: "designing-clothes-mannequin",
    name: "Designing Clothes on Mannequin",
    description: "Fashion designer draping and pinning fabric on dress form",
    category: "creating",
    tags: ["fashion", "design", "creative", "clothing"],
    useCase: "Fashion content, design process, creative industry, clothing creation",
    fields: {
      actions: "designing clothing",
      scene: "Fashion designer working with fabric on dress form",
      dialogue: "This silhouette is going to be perfect.",
      camera_angle: "side angle showing design process",
      camera_distance: "medium shot showing workspace",
      motion_type: "precise draping and pinning"
    },
    customDetails: "Fabric draped on mannequin, pins in mouth, measuring tape around neck, creative fashion energy"
  },

  "planning-map-on-table": {
    id: "planning-map-on-table",
    name: "Planning Map on Table",
    description: "Strategic planning session with maps and route marking",
    category: "thinking",
    tags: ["planning", "strategy", "maps", "preparation"],
    useCase: "Travel content, adventure planning, strategic thinking, preparation",
    fields: {
      actions: "planning route",
      scene: "Person studying maps and marking routes for upcoming journey",
      dialogue: "If we take this route, we can avoid the traffic.",
      camera_angle: "overhead shot of map planning",
      camera_distance: "medium shot showing table",
      motion_type: "deliberate route marking"
    },
    customDetails: "Maps spread out, markers and pins, routes highlighted, strategic thinking, planning materials"
  },

  "composing-music-headphones": {
    id: "composing-music-headphones",
    name: "Composing Music with Headphones",
    description: "Music producer creating beats and melodies with headphones on",
    category: "creating",
    tags: ["music", "composing", "production", "creative"],
    useCase: "Music production, creative process, beat making, audio content",
    fields: {
      actions: "composing music",
      scene: "Music producer with headphones on creating beats on computer",
      dialogue: "This melody is going to be incredible.",
      camera_angle: "side angle showing equipment",
      camera_distance: "medium shot showing studio",
      motion_type: "rhythmic head nodding to beat"
    },
    customDetails: "Large headphones, audio equipment, computer with music software, nodding to rhythm, creative flow"
  },

  "repairing-mechanical-device": {
    id: "repairing-mechanical-device",
    name: "Repairing Mechanical Device",
    description: "Focused repair work on complex mechanical device with tools",
    category: "creating",
    tags: ["repair", "mechanical", "tools", "problem-solving"],
    useCase: "Repair content, problem-solving, mechanical work, technical skills",
    fields: {
      actions: "repairing device",
      scene: "Person focused on repairing complex mechanical device with tools",
      dialogue: "I think I found the problem.",
      camera_angle: "close-up on repair work",
      camera_distance: "medium shot showing workspace",
      motion_type: "precise tool manipulation"
    },
    customDetails: "Various tools spread around, device partially disassembled, focused concentration, problem-solving"
  },

  "meditating-quietly": {
    id: "meditating-quietly",
    name: "Meditating Quietly",
    description: "Peaceful meditation in serene environment with inner focus",
    category: "thinking",
    tags: ["meditation", "peaceful", "mindfulness", "inner-focus"],
    useCase: "Wellness content, meditation guides, mindfulness, peaceful moments",
    fields: {
      actions: "meditating peacefully",
      scene: "Person sitting in peaceful meditation with eyes closed",
      dialogue: "In this stillness, I find clarity.",
      camera_angle: "serene front angle",
      camera_distance: "medium shot showing posture",
      motion_type: "still and centered"
    },
    customDetails: "Cross-legged position, peaceful expression, hands in mudra position, serene environment, inner calm"
  },

  // CONFLICT & IMPACT (12 presets) - High-Impact Actions 💥
  "throwing-punch": {
    id: "throwing-punch",
    name: "Throwing a Punch",
    description: "Powerful punch being thrown in combat situation",
    category: "conflict",
    tags: ["punch", "fighting", "combat", "aggressive"],
    useCase: "Action sequences, fight scenes, combat training, self-defense",
    fields: {
      actions: "throwing powerful punch",
      scene: "Fighter throwing devastating punch in combat",
      dialogue: "This ends now!",
      camera_angle: "dynamic action angle",
      camera_distance: "medium action shot",
      motion_type: "explosive punching motion"
    },
    customDetails: "Fist extended in punch, focused aggressive expression, combat stance, power behind motion, action moment"
  },

  "blocking-attack-with-shield": {
    id: "blocking-attack-with-shield",
    name: "Blocking Attack with Shield",
    description: "Defensive shield block against incoming attack",
    category: "conflict",
    tags: ["blocking", "shield", "defense", "protection"],
    useCase: "Action content, defensive combat, protection scenes, medieval combat",
    fields: {
      actions: "blocking with shield",
      scene: "Warrior raising shield to block incoming attack",
      dialogue: "Not today!",
      camera_angle: "action angle showing block",
      camera_distance: "medium combat shot",
      motion_type: "defensive blocking motion"
    },
    customDetails: "Shield raised defensively, determined expression, braced stance, incoming attack being blocked"
  },

  "shattering-glass": {
    id: "shattering-glass",
    name: "Shattering Glass",
    description: "Dramatic moment of glass breaking into pieces",
    category: "impact",
    tags: ["glass", "shattering", "breaking", "dramatic"],
    useCase: "Dramatic moments, destruction scenes, impact effects, breaking barriers",
    fields: {
      actions: "shattering glass",
      scene: "Glass exploding into shards in dramatic slow motion",
      dialogue: "Sometimes you have to break things to move forward.",
      camera_angle: "dramatic angle capturing shards",
      camera_distance: "close-up on impact",
      motion_type: "explosive shattering"
    },
    customDetails: "Glass pieces flying, dramatic lighting on shards, moment of impact, destruction energy"
  },

  "crashing-car-into-barrier": {
    id: "crashing-car-into-barrier",
    name: "Crashing Car into Barrier",
    description: "Vehicle collision with barrier in dramatic crash",
    category: "impact",
    tags: ["crash", "collision", "vehicle", "dramatic"],
    useCase: "Action sequences, crash scenes, dramatic impacts, stunt work",
    fields: {
      actions: "crashing vehicle",
      scene: "Car colliding with barrier in spectacular crash",
      dialogue: "Hold on tight!",
      camera_angle: "wide angle capturing full crash",
      camera_distance: "wide shot showing impact",
      motion_type: "high-impact collision"
    },
    customDetails: "Vehicle crumpling on impact, debris flying, dramatic collision moment, crash energy"
  },

  "exploding-out-of-building": {
    id: "exploding-out-of-building",
    name: "Exploding Out of Building",
    description: "Dramatic explosion bursting through building wall",
    category: "impact",
    tags: ["explosion", "building", "dramatic", "burst"],
    useCase: "Action movies, dramatic escapes, explosion scenes, high-impact moments",
    fields: {
      actions: "exploding through wall",
      scene: "Person bursting through building wall in explosion",
      dialogue: "Sometimes you have to make your own exit!",
      camera_angle: "dramatic angle showing explosion",
      camera_distance: "wide shot capturing blast",
      motion_type: "explosive burst motion"
    },
    customDetails: "Wall debris flying, flames and smoke, dramatic exit, explosive force, action movie energy"
  },

  "wrestling-on-ground": {
    id: "wrestling-on-ground",
    name: "Wrestling on Ground",
    description: "Intense ground wrestling match between opponents",
    category: "conflict",
    tags: ["wrestling", "grappling", "ground", "intense"],
    useCase: "Wrestling content, ground combat, sports action, competitive fighting",
    fields: {
      actions: "wrestling on ground",
      scene: "Two opponents locked in intense ground wrestling match",
      dialogue: "I'm not giving up!",
      camera_angle: "low angle showing struggle",
      camera_distance: "close action shot",
      motion_type: "grappling wrestling motion"
    },
    customDetails: "Bodies intertwined in wrestling hold, muscles straining, competitive determination, ground combat"
  },

  "casting-destructive-spell": {
    id: "casting-destructive-spell",
    name: "Casting Destructive Spell",
    description: "Mage casting powerful destructive magic spell",
    category: "conflict",
    tags: ["magic", "spell", "destructive", "mystical"],
    useCase: "Fantasy content, magical combat, spell casting, mystical action",
    fields: {
      actions: "casting spell",
      scene: "Mage channeling destructive magical energy in spell",
      dialogue: "By the power of the ancients!",
      camera_angle: "dramatic angle showing magic",
      camera_distance: "medium shot showing caster",
      motion_type: "magical casting gestures"
    },
    customDetails: "Hands glowing with magical energy, intense concentration, mystical symbols, destructive power"
  },

  "pushing-someone-out-of-harms-way": {
    id: "pushing-someone-out-of-harms-way",
    name: "Pushing Someone Out of Harm's Way",
    description: "Heroic push to save someone from incoming danger",
    category: "conflict",
    tags: ["heroic", "rescue", "protection", "sacrifice"],
    useCase: "Heroic moments, rescue scenes, protection actions, selfless acts",
    fields: {
      actions: "pushing person to safety",
      scene: "Hero pushing someone out of path of incoming danger",
      dialogue: "Look out!",
      camera_angle: "dynamic angle showing rescue",
      camera_distance: "medium action shot",
      motion_type: "urgent protective push"
    },
    customDetails: "Protective arm extended, urgent expression, person being pushed to safety, heroic sacrifice"
  },

  "breaking-door-open": {
    id: "breaking-door-open",
    name: "Breaking Door Open",
    description: "Forceful entry through locked door with shoulder or kick",
    category: "impact",
    tags: ["breaking", "door", "force", "entry"],
    useCase: "Action scenes, forced entry, dramatic entrances, emergency access",
    fields: {
      actions: "breaking down door",
      scene: "Person breaking through door with powerful force",
      dialogue: "We're coming in!",
      camera_angle: "angle showing door impact",
      camera_distance: "medium shot showing action",
      motion_type: "powerful breaking motion"
    },
    customDetails: "Shoulder or foot hitting door, wood splintering, determined expression, forced entry energy"
  },

  "falling-from-great-height": {
    id: "falling-from-great-height",
    name: "Falling from Great Height",
    description: "Dramatic fall from significant height with arms flailing",
    category: "impact",
    tags: ["falling", "height", "dramatic", "danger"],
    useCase: "Action sequences, dramatic falls, danger scenes, cliff hangers",
    fields: {
      actions: "falling through air",
      scene: "Person falling from great height with wind rushing past",
      dialogue: "This is not how I planned this!",
      camera_angle: "aerial angle following fall",
      camera_distance: "wide shot showing height",
      motion_type: "free-fall motion"
    },
    customDetails: "Arms windmilling, hair and clothes whipping in wind, ground far below, dramatic fall energy"
  },

  "sword-clashing-mid-battle": {
    id: "sword-clashing-mid-battle",
    name: "Sword Clashing Mid-Battle",
    description: "Epic sword fight with blades locked in combat",
    category: "conflict",
    tags: ["sword", "battle", "clashing", "epic"],
    useCase: "Medieval combat, sword fighting, epic battles, warrior content",
    fields: {
      actions: "sword fighting",
      scene: "Warriors with swords locked in fierce combat",
      dialogue: "En garde!",
      camera_angle: "dynamic angle showing clash",
      camera_distance: "close action shot",
      motion_type: "sword combat motion"
    },
    customDetails: "Blades locked together, sparks flying, intense eye contact, medieval combat energy, warrior skill"
  },

  "smashing-object-with-hammer": {
    id: "smashing-object-with-hammer",
    name: "Smashing Object with Hammer",
    description: "Powerful hammer blow destroying object completely",
    category: "impact",
    tags: ["hammer", "smashing", "destruction", "powerful"],
    useCase: "Destruction scenes, demolition content, powerful impacts, breaking objects",
    fields: {
      actions: "smashing with hammer",
      scene: "Person bringing hammer down to smash object completely",
      dialogue: "Sometimes destruction is necessary for progress.",
      camera_angle: "overhead angle showing impact",
      camera_distance: "medium shot showing destruction",
      motion_type: "powerful hammer swing"
    },
    customDetails: "Hammer raised high, object shattering on impact, debris flying, powerful destruction energy"
  }
};

// Category organization for action presets
export const actionCategories = {
  poses: {
    name: "Poses & Gestures",
    icon: "🧍",
    presets: ["confident-power-pose", "professional-handshake", "thinking-chin-stroke", "enthusiastic-thumbs-up", "crossed-arms-skeptical", "pointing-direction", "open-palms-welcome", "shrug-uncertainty", "leaning-casual", "facepalm-frustration", "presentation-gesture", "victory-celebration"]
  },
  expressions: {
    name: "Expressions / Reactions",
    icon: "🎭",
    presets: ["laughing-eyes-closed", "shocked-hands-on-cheeks", "angry-fist-raised", "sad-tear-rolling", "smiling-warmly", "rolling-eyes-annoyance", "confused-scratching-head", "disgusted-nose-wrinkle", "nervous-biting-lip", "surprised-gasp", "proud-smirk", "excited-jumping"]
  },
  dynamic: {
    name: "Dynamic / Movement",
    icon: "🎮",
    presets: ["running-through-street", "jumping-across-gap", "dancing-energetically", "diving-into-water", "spinning-in-chair", "sliding-into-base", "dodging-incoming-object", "leaping-off-rooftop", "sprinting-while-carrying", "swinging-on-rope", "skating-skateboarding", "flipping-table-dramatically"]
  },
  thinking: {
    name: "Thinking / Creating",
    icon: "🧠",
    presets: ["writing-in-notebook", "painting-on-easel", "brainstorming-sticky-notes", "programming-at-computer", "cooking-tasting-dish", "playing-musical-instrument", "sculpting-clay-wheel", "designing-clothes-mannequin", "planning-map-on-table", "composing-music-headphones", "repairing-mechanical-device", "meditating-quietly"]
  },
  conflict: {
    name: "Conflict / Impact",
    icon: "💥",
    presets: ["throwing-punch", "blocking-attack-with-shield", "shattering-glass", "crashing-car-into-barrier", "exploding-out-of-building", "wrestling-on-ground", "casting-destructive-spell", "pushing-someone-out-of-harms-way", "breaking-door-open", "falling-from-great-height", "sword-clashing-mid-battle", "smashing-object-with-hammer"]
  },
  chase: {
    name: "Chase & Pursuit",
    icon: "🏃‍♂️",
    presets: ["high-speed-chase", "foot-chase-parkour", "underwater-chase", "motorcycle-escape", "forest-pursuit"]
  },
  dialogue: {
    name: "Dialogue & Conversation", 
    icon: "💬",
    presets: ["heated-argument", "heartfelt-confession", "business-negotiation", "family-reunion", "secret-conspiracy"]
  },
  combat: {
    name: "Fight & Combat",
    icon: "⚔️",
    presets: ["martial-arts-duel", "street-brawl", "lightsaber-duel", "boxing-ring"]
  },
  romance: {
    name: "Romance & Intimate",
    icon: "💕",
    presets: ["first-kiss", "surprise-proposal", "anniversary-dance", "wedding-vows"]
  },
  comedy: {
    name: "Comedy & Humor",
    icon: "😂",
    presets: ["slapstick-mishap", "awkward-encounter", "prank-gone-wrong", "dad-joke-delivery"]
  }
};