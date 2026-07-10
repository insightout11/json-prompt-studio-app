// Comprehensive Viral Video Templates - Trend-Based System
// Real-time JSON updates with preset-driven content

export const viralTemplates = {
  // 🎙️ PODCAST/INTERVIEW CATEGORY
  conspiracy_shock: {
    name: "Conspiracy Shock",
    category: "podcast",
    tagline: "This Changes Everything!",
    description: "Whistleblower reveals hidden truth that breaks the internet",
    fixed_fields: {
      setting: "dimly lit podcast studio with evidence boards in background",
      lighting_type: "dramatic low key lighting with strong shadows",
      tone: "serious turning increasingly urgent",
      atmosphere: "conspiratorial truth-telling session",
      actions: "leaning forward intensely, pointing at documents, glancing around nervously",
      angle: "intimate close-ups with dramatic low angles",
      distance: "medium close-up shots",
      movement: "handheld camera with subtle tension",
      color_palette: "muted earth tones with stark document highlights", 
      music_style: "tense investigative underscore",
      environment: "controlled indoor with hidden location feel"
    },
    user_inputs: {
      guest_character: {
        label: "Guest Character",
        placeholder: "Former government insider with classified access",
        suggestions: [
          "Ex-CIA operative turned whistleblower",
          "Former tech executive who discovered the truth",
          "Scientist who worked on secret programs", 
          "Military contractor with inside knowledge",
          "Corporate insider with damning evidence",
          "Anonymous source with photographic proof"
        ]
      },
      topic_claim: {
        label: "What They're Revealing",
        placeholder: "Social media algorithms are actually mind control experiments",
        suggestions: [
          "The moon landing was faked to hide what's really up there",
          "Big Tech companies are run by AI that became sentient in 2019",
          "Weather modification has been happening since the 1970s",
          "Major corporations have been testing mind control through advertising",
          "The government has been in contact with aliens since 1947",
          "Social media platforms are psychological warfare experiments"
        ]
      },
      evidence: {
        label: "Evidence/Proof They Bring",
        placeholder: "classified documents with official government seals",
        suggestions: [
          "Leaked internal emails proving the conspiracy",
          "Classified photographs showing impossible technology",
          "Audio recordings of secret meetings",
          "Government documents with heavy redactions",
          "Technical schematics that shouldn't exist",
          "Personal testimony backed by insider knowledge"
        ]
      },
      tone_style: {
        label: "Interview Tone",
        placeholder: "conspiratorial",
        suggestions: ["serious", "conspiratorial", "urgent", "shocked", "vindicated"]
      }
    }
  },

  influencer_goes_off: {
    name: "Influencer Goes Off",
    category: "podcast", 
    tagline: "The Truth About Going Viral",
    description: "Failed creator's brutally honest meltdown confession",
    fixed_fields: {
      setting: "messy apartment or basic podcast setup showing decline",
      lighting_type: "harsh unflattering lighting revealing exhaustion",
      tone: "bitter and increasingly unhinged",
      atmosphere: "trainwreck confession getting more chaotic",
      actions: "gesturing wildly, running hands through hair, occasional breakdowns",
      angle: "unflattering straight-on shots",
      distance: "medium shots showing environmental chaos",
      movement: "static shots that feel trapped and claustrophobic",
      color_palette: "washed out colors with stark contrast",
      music_style: "no music, raw audio only",
      environment: "personal space revealing mental state"
    },
    user_inputs: {
      guest_character: {
        label: "Failed Influencer Type",
        placeholder: "Beauty guru who lost everything in a scandal",
        suggestions: [
          "YouTube prankster whose stunts went too far",
          "Lifestyle blogger exposed as complete fraud",
          "Fitness influencer caught using fake transformations", 
          "Gaming streamer who became toxic and lost everything",
          "TikTok dancer who aged out and became irrelevant",
          "Crypto influencer whose coins all crashed"
        ]
      },
      topic_claim: {
        label: "What They're Confessing",
        placeholder: "The entire influencer industry is fake and everyone's broke",
        suggestions: [
          "Most influencers fake their wealth and are actually in massive debt",
          "Brand deals require you to lie about products you've never used",
          "The algorithm is designed to make creators mentally unstable",
          "Influencer houses are just content farms that exploit young people",
          "View counts and engagement are mostly bots and fake accounts",
          "The pressure to stay relevant literally destroys your mental health"
        ]
      },
      evidence: {
        label: "Receipts/Proof They Show",
        placeholder: "bank statements showing massive debt despite millions of followers",
        suggestions: [
          "Screenshots of brands asking them to lie in sponsored posts",
          "Behind-the-scenes videos showing how fake their lifestyle is",
          "Financial records proving they're broke despite appearing wealthy",
          "Messages from management companies exploiting creators",
          "Medical records showing anxiety and depression from the pressure",
          "Contracts revealing how little creators actually make"
        ]
      },
      tone_style: {
        label: "Confession Tone",
        placeholder: "bitter",
        suggestions: ["bitter", "desperate", "vindictive", "broken", "unhinged"]
      }
    }
  },

  weird_expert: {
    name: "Weird Expert Promoting Something",
    category: "podcast",
    tagline: "You've Never Heard This Before",
    description: "Niche specialist pushes bizarre but compelling theory",
    fixed_fields: {
      setting: "cluttered office or laboratory filled with research",
      lighting_type: "bright academic lighting with focused task lamps",
      tone: "passionate and slightly obsessive",
      atmosphere: "intellectual excitement about obscure discovery",
      actions: "animated explaining with props, drawing diagrams, demonstrating concepts",
      angle: "medium shots showing expertise and environment",
      distance: "varied shots including close-ups of demonstrations",
      movement: "following the expert as they move around explaining",
      color_palette: "warm academic colors with pops of research materials",
      music_style: "light investigative or educational background",
      environment: "academic or research space showing deep expertise"
    },
    user_inputs: {
      guest_character: {
        label: "Expert Type",
        placeholder: "Mushroom researcher who discovered fungi can predict the future",
        suggestions: [
          "Linguist who decoded ancient language that predicts modern events",
          "Marine biologist studying octopus intelligence that rivals humans",
          "Food scientist proving chocolate is actually a superfood",
          "Sleep researcher claiming dreams are glimpses into parallel universes", 
          "Plant biologist showing that trees have complex social networks",
          "Sound engineer who found frequencies that can alter mood instantly"
        ]
      },
      topic_claim: {
        label: "Their Groundbreaking Theory",
        placeholder: "Certain mushrooms can actually predict weather patterns with 99% accuracy",
        suggestions: [
          "Ancient languages contain mathematical formulas for predicting earthquakes",
          "Octopuses are actually more intelligent than humans but hide it",
          "Specific chocolate compounds can extend human lifespan by decades",
          "Dreams are quantum connections to parallel versions of ourselves",
          "Trees share information faster than the internet through root networks",
          "Certain sound frequencies can cure depression better than medication"
        ]
      },
      evidence: {
        label: "Their Proof/Research",
        placeholder: "15 years of mushroom behavior data correlated with weather reports",
        suggestions: [
          "Peer-reviewed studies that somehow got overlooked by mainstream science",
          "Live demonstrations that work every single time",
          "Historical examples proving their theory has always been true",
          "Personal experiments with remarkable documented results",
          "Ancient texts or artifacts supporting their claims",
          "Real-time data they can show during the interview"
        ]
      },
      tone_style: {
        label: "Expert's Approach",
        placeholder: "passionate",
        suggestions: ["passionate", "obsessive", "matter-of-fact", "evangelical", "conspiratorial"]
      }
    }
  },

  unexpected_truth: {
    name: "Unexpected Profound Truth",
    category: "podcast",
    tagline: "Wisdom From Nowhere",
    description: "Regular person drops life-changing wisdom nobody saw coming",
    fixed_fields: {
      setting: "simple, unassuming location like kitchen table or park bench",
      lighting_type: "natural, soft lighting that feels authentic",
      tone: "humble but profound",
      atmosphere: "intimate conversation that becomes transcendent",
      actions: "speaking quietly but with conviction, occasional meaningful pauses",
      angle: "respectful eye-level shots",
      distance: "intimate close-ups during profound moments",
      movement: "gentle, respectful camera work",
      color_palette: "warm, natural colors",
      music_style: "subtle emotional underscore",
      environment: "everyday setting that becomes sacred through wisdom shared"
    },
    user_inputs: {
      guest_character: {
        label: "Unexpected Wisdom Source",
        placeholder: "Night shift janitor who's seen everything",
        suggestions: [
          "Uber driver who's heard every life story",
          "Grocery store cashier who understands human nature",
          "School custodian who's watched kids grow up for decades",
          "Bartender who's been everyone's therapist for 30 years",
          "Bus driver who sees the city's heartbeat every day",
          "Hospital security guard who's witnessed life and death"
        ]
      },
      topic_claim: {
        label: "Their Profound Insight",
        placeholder: "People don't really want success, they want to feel needed",
        suggestions: [
          "Everyone is just trying to feel worthy of love, everything else is distraction",
          "The happiest people are those who stopped trying to be happy",
          "Most problems solve themselves if you wait long enough and stay kind",
          "People who seem confident are usually the most scared inside",
          "Time moves differently when you're paying attention to others",
          "The meaning of life is hidden in the mundane moments everyone ignores"
        ]
      },
      evidence: {
        label: "How They Know This",
        placeholder: "30 years of late-night conversations with people at their lowest points",
        suggestions: [
          "Decades of observing people when they think nobody's watching",
          "Thousands of conversations with people in vulnerable moments",
          "Personal experience surviving something that changed their perspective",
          "Growing up in circumstances that taught them what really matters",
          "Witnessing the same patterns repeat across generations",
          "Living through enough loss to understand what actually has value"
        ]
      },
      tone_style: {
        label: "Delivery Style",
        placeholder: "humble",
        suggestions: ["humble", "matter-of-fact", "gentle", "profound", "conversational"]
      }
    }
  },

  // 📢 STREET INTERVIEW CATEGORY
  downtown_chaos: {
    name: "Downtown Chaos",
    category: "street_interview",
    tagline: "Public Freakout Incoming!",
    description: "Ask strangers wild questions and capture unfiltered reactions",
    fixed_fields: {
      setting: "busy downtown street with heavy foot traffic",
      lighting_type: "natural daylight with urban environment",
      tone: "energetic and unpredictable",
      atmosphere: "chaotic street energy with unexpected encounters",
      actions: "approaching strangers, quick interviews, reactions and walk-aways",
      angle: "handheld street-level shots",
      distance: "medium shots capturing both interviewer and subject",
      movement: "mobile, following the action",
      color_palette: "vibrant urban colors",
      music_style: "upbeat street energy background",
      environment: "bustling city street with ambient urban sounds"
    },
    user_inputs: {
      location: {
        label: "Specific Location",
        placeholder: "Times Square during lunch rush",
        suggestions: [
          "Busy shopping district during weekend",
          "College campus between classes",
          "Food truck area during lunch",
          "Outside popular nightclub at closing time",
          "Subway station during rush hour",
          "Beach boardwalk on summer day"
        ]
      },
      interview_question: {
        label: "The Wild Question",
        placeholder: "If you could eliminate one type of person from society, who would it be?",
        suggestions: [
          "What's the most illegal thing you've done that you'd do again?",
          "If you had to choose between your phone and your pet, what would you pick?",
          "What's a lie you tell yourself every day?",
          "If you could read minds for one day, whose mind would you avoid?",
          "What's something everyone does but nobody admits to?",
          "If dating apps showed people's biggest red flag, what would yours be?"
        ]
      },
      sample_answers: {
        label: "Types of Responses Expected",
        placeholder: "Shocked silence, defensive anger, surprisingly honest confessions",
        suggestions: [
          "Uncomfortable laughter followed by walking away quickly",
          "Oversharing personal details that get way too real",
          "Aggressive defensiveness that reveals exactly what you suspected",
          "Completely unexpected wisdom that makes you question everything",
          "Hilarious misunderstanding of the question",
          "Perfect one-liner that becomes the thumbnail quote"
        ]
      },
      tone_style: {
        label: "Interview Vibe",
        placeholder: "provocative",
        suggestions: ["provocative", "playful", "confrontational", "curious", "chaotic"]
      }
    }
  },

  campus_debate: {
    name: "Campus Debate",
    category: "street_interview",
    tagline: "Generation Divided",
    description: "Capture split public opinions on controversial topics",
    fixed_fields: {
      setting: "college campus with diverse student population",
      lighting_type: "bright natural lighting showcasing youth energy",
      tone: "intellectually curious but heated",
      atmosphere: "academic debate spilling into real emotion",
      actions: "interviewing multiple people, capturing passionate responses",
      angle: "respectful medium shots allowing full expression",
      distance: "close enough to catch emotional nuance",
      movement: "steady shots that let subjects speak their truth",
      color_palette: "bright, youthful campus colors",
      music_style: "light background that doesn't interfere with dialogue",
      environment: "academic setting with student life energy"
    },
    user_inputs: {
      location: {
        label: "Campus Location",
        placeholder: "Outside the student union during lunch",
        suggestions: [
          "Library steps where students gather",
          "Quad area during activity period",
          "Dining hall entrance during busy hours",
          "Outside popular lecture halls",
          "Student parking lot",
          "Campus coffee shop patio"
        ]
      },
      interview_question: {
        label: "Debate Question",
        placeholder: "Should student loan debt be completely forgiven?",
        suggestions: [
          "Is college actually worth the debt anymore?",
          "Should social media companies be held responsible for teen mental health?",
          "Is it okay to date someone with completely opposite political views?",
          "Should parents have access to their adult children's therapy sessions?",
          "Is hustle culture toxic or necessary for success?",
          "Should there be an age limit on running for president?"
        ]
      },
      sample_answers: {
        label: "Response Types You'll Get",
        placeholder: "Passionate pro-forgiveness vs. personal responsibility arguments",
        suggestions: [
          "Emotional personal stories about debt vs. logical economic arguments",
          "Generational divide responses showing different value systems",
          "Surprisingly nuanced takes that don't fit typical political boxes",
          "Students who completely change their mind mid-interview",
          "Responses that reveal deeper issues nobody expected",
          "Perfect soundbites from both sides of the issue"
        ]
      },
      tone_style: {
        label: "Debate Energy",
        placeholder: "passionate",
        suggestions: ["passionate", "intellectual", "heated", "respectful", "revealing"]
      }
    }
  },

  truth_or_dare_irl: {
    name: "Truth or Dare IRL",
    category: "street_interview",
    tagline: "No Filter Challenge",
    description: "Provocative street challenges that reveal people's true nature",
    fixed_fields: {
      setting: "public space where people feel safe but exposed",
      lighting_type: "good lighting for capturing genuine reactions",
      tone: "playful but with edge of danger",
      atmosphere: "game show energy meets social experiment",
      actions: "presenting challenges, capturing decisions and reactions",
      angle: "dynamic shots capturing both challenge and response",
      distance: "close enough to see micro-expressions",
      movement: "following the action as challenges unfold",
      color_palette: "bright, engaging colors",
      music_style: "playful but suspenseful background",
      environment: "public setting with audience of passersby"
    },
    user_inputs: {
      location: {
        label: "Challenge Location",
        placeholder: "Busy park where people are relaxed but visible",
        suggestions: [
          "Popular beach or waterfront area",
          "Shopping center food court",
          "University quad during events",
          "Outdoor concert or festival area",
          "Public square with good foot traffic",
          "Popular hiking trail start point"
        ]
      },
      interview_question: {
        label: "Truth or Dare Challenge",
        placeholder: "Truth: What's in your search history that would ruin your reputation? Dare: Text your ex right now",
        suggestions: [
          "Truth: What's the meanest thing you've ever done? Dare: Apologize to someone you've wronged",
          "Truth: What do you really think about your best friend's partner? Dare: Call them and say it",
          "Truth: How much debt are you really in? Dare: Show us your bank balance",
          "Truth: What's your most embarrassing sexual experience? Dare: Recreate your worst pickup line",
          "Truth: Who in your family do you secretly dislike? Dare: Post about it on social media",
          "Truth: What's your biggest lie on dating apps? Dare: Update your profile to be completely honest"
        ]
      },
      sample_answers: {
        label: "How People React",
        placeholder: "Most choose truth then immediately regret it, some do surprisingly bold dares",
        suggestions: [
          "Nervous laughter while revealing way too much personal information",
          "Confident dare acceptance that goes hilariously wrong",
          "Truth confessions that make everyone uncomfortable",
          "People who bail out halfway through and walk away",
          "Unexpectedly wholesome moments that restore faith in humanity",
          "Complete chaos when dares involve other people"
        ]
      },
      tone_style: {
        label: "Challenge Vibe",
        placeholder: "playful",
        suggestions: ["playful", "provocative", "supportive", "mischievous", "boundary-pushing"]
      }
    }
  },

  family_friendly: {
    name: "Family-Friendly",
    category: "street_interview", 
    tagline: "Pure Wholesome Content",
    description: "Kids or elders answering sweet questions that restore faith in humanity",
    fixed_fields: {
      setting: "safe, family-friendly public space",
      lighting_type: "soft, flattering natural light",
      tone: "warm and encouraging",
      atmosphere: "wholesome content that makes people smile",
      actions: "gentle interviewing, capturing authentic sweet moments",
      angle: "respectful, flattering shots",
      distance: "comfortable distance respecting personal space",
      movement: "steady, non-threatening camera work",
      color_palette: "warm, inviting colors",
      music_style: "light, uplifting background music",
      environment: "safe public space with positive energy"
    },
    user_inputs: {
      location: {
        label: "Family-Friendly Spot",
        placeholder: "Local park with playground and walking paths",
        suggestions: [
          "Outside elementary school during pickup (with permission)",
          "Senior center outdoor area",
          "Family-friendly farmers market",
          "Public library during story time",
          "Community center during family events",
          "Ice cream shop with outdoor seating"
        ]
      },
      interview_question: {
        label: "Wholesome Question",
        placeholder: "What's the kindest thing a stranger has ever done for you?",
        suggestions: [
          "What's the best advice your grandparents ever gave you?",
          "If you could give every person in the world one thing, what would it be?",
          "What makes you feel most proud of yourself?",
          "What's something you learned recently that surprised you?",
          "Who's your hero and why?",
          "What would make the world a better place?"
        ]
      },
      sample_answers: {
        label: "Expected Heartwarming Responses",
        placeholder: "Kids giving profound life advice, elders sharing wisdom with twinkling eyes",
        suggestions: [
          "Children's innocent but surprisingly deep insights about life",
          "Elderly people sharing hard-earned wisdom with gentle humor",
          "Unexpected connections between different generations",
          "Simple acts of kindness that had profound impacts",
          "Pure, unfiltered optimism that reminds you why life is beautiful",
          "Moments where innocence and experience create perfect understanding"
        ]
      },
      tone_style: {
        label: "Interview Approach",
        placeholder: "gentle",
        suggestions: ["gentle", "encouraging", "respectful", "warm", "uplifting"]
      }
    }
  },

  // ✂️ ASMR/SATISFYING CATEGORY
  glass_sphere_cutting: {
    name: "Glass Sphere Cutting",
    category: "asmr",
    tagline: "So Satisfying!",
    description: "Perfectly clear glass spheres being cut with heated blade",
    fixed_fields: {
      setting: "clean white studio setup with optimal lighting for glass",
      lighting_type: "bright, even lighting to show glass clarity and cuts",
      tone: "calm and methodical",
      atmosphere: "meditative focus on satisfying destruction",
      actions: "slowly heating blade, precise cutting motions, revealing interior patterns",
      angle: "overhead and extreme close-up macro shots",
      distance: "macro detail shots showing cut precision",
      movement: "slow, deliberate camera movements following the cuts",
      color_palette: "clean whites with glass refractions creating rainbow highlights",
      music_style: "ambient soundscape or pure sound focus",
      environment: "controlled studio with perfect acoustics"
    },
    user_inputs: {
      object: {
        label: "Glass Object Type",
        placeholder: "perfectly clear solid glass spheres",
        suggestions: [
          "Hollow glass ornaments with swirled colors inside",
          "Solid crystal balls with internal fractures",
          "Glass spheres filled with colorful liquids",
          "Vintage glass fishing floats",
          "Laboratory glass equipment spheres",
          "Handblown art glass orbs with inclusions"
        ]
      },
      action: {
        label: "Cutting Method",
        placeholder: "heated ceramic blade cutting clean through",
        suggestions: [
          "Wire heated to glowing red cutting through slowly",
          "Diamond blade creating perfect slices",
          "Laser cutting with visible beam and smoke",
          "Hot knife melting through while cutting",
          "Pressurized water jet cutting",
          "Ultrasonic blade creating micro-vibrations"
        ]
      },
      visual_details: {
        label: "Visual Focus",
        placeholder: "glass separating cleanly, internal stress patterns becoming visible",
        suggestions: [
          "Rainbow refractions splitting as glass separates",
          "Internal stress patterns exploding into spider web cracks",
          "Smooth cut surfaces reflecting light perfectly",
          "Glass dust falling in slow motion",
          "Steam rising from heated cutting tool",
          "Perfect circular cross-sections revealing interior structure"
        ]
      },
      sound_focus: {
        label: "Sound Design",
        placeholder: "crisp cracking, gentle hissing of heated blade",
        suggestions: ["sharp crystalline breaking", "smooth slicing with steam hiss", "delicate tinkling of glass pieces", "satisfying snap of final separation", "gentle crackling of stress relief"]
      }
    }
  },

  powerwash_playground: {
    name: "Powerwashing Playground",
    category: "asmr",
    tagline: "Oddly Satisfying Clean",
    description: "Transforming dirty playground equipment with satisfying pressure washing",
    fixed_fields: {
      setting: "weathered playground with years of accumulated grime",
      lighting_type: "bright daylight showing dramatic before/after contrast",
      tone: "methodical and therapeutic",
      atmosphere: "satisfying transformation and renewal",
      actions: "systematic pressure washing revealing clean surfaces underneath",
      angle: "wide shots showing transformation, close-ups of cleaning action",
      distance: "varied shots from overview to macro water impact",
      movement: "smooth following shots tracking the cleaning progress",
      color_palette: "muted dirty colors transforming to bright, clean ones",
      music_style: "ambient background letting water sounds dominate",
      environment: "outdoor playground with natural acoustics"
    },
    user_inputs: {
      object: {
        label: "Playground Equipment",
        placeholder: "old metal slide covered in years of grime and rust stains",
        suggestions: [
          "Wooden jungle gym blackened with mold and dirt",
          "Plastic play structure faded and covered in algae",
          "Metal swing set with chain rust and seat grime",
          "Concrete tunnels with graffiti and stains",
          "Rubber playground surface with embedded dirt",
          "Basketball court with years of accumulated dirt"
        ]
      },
      action: {
        label: "Cleaning Method",
        placeholder: "high-pressure water cutting through grime in perfect lines",
        suggestions: [
          "Steam pressure washing melting away organic buildup",
          "Chemical pre-treatment dissolving stains before rinsing",
          "Rotating brush attachment scrubbing while spraying",
          "Wide fan spray revealing large clean areas instantly",
          "Precision nozzle cutting detailed cleaning lines",
          "Foam cannon covering everything before final rinse"
        ]
      },
      visual_details: {
        label: "Satisfying Visual Elements",
        placeholder: "dirt streaming away in brown rivers, revealing bright colors underneath",
        suggestions: [
          "Perfect straight cleaning lines showing dramatic contrast",
          "Streams of dirty water running off in satisfying patterns",
          "Hidden bright colors emerging from under grime",
          "Stubborn stains finally giving way to pressure",
          "Water bouncing and misting in beautiful patterns",
          "Before and after sections side by side showing transformation"
        ]
      },
      sound_focus: {
        label: "Audio Elements",
        placeholder: "powerful water spray, splashing, debris washing away",
        suggestions: ["high-pressure water hitting surfaces", "satisfying scrubbing and foaming sounds", "debris washing away in streams", "pressure changes as nozzle adjustments", "echo of water in playground structures"]  
      }
    }
  },

  crush_toys_press: {
    name: "Crushing Toys Press",
    category: "asmr",
    tagline: "Destruction Therapy",  
    description: "Childhood toys meeting their satisfying end under hydraulic press",
    fixed_fields: {
      setting: "industrial workshop with hydraulic press as centerpiece",
      lighting_type: "bright workshop lighting focused on press area",
      tone: "methodical destruction with therapeutic undertones",
      atmosphere: "controlled destruction that's oddly calming",
      actions: "placing toys carefully, activating press, watching slow compression",
      angle: "side view of press action, overhead shots showing compression",
      distance: "close-ups of deformation, wide shots of full press",
      movement: "steady shots letting the press action be the star",
      color_palette: "industrial grays with colorful toy highlights",
      music_style: "minimal background letting mechanical sounds dominate",
      environment: "workshop setting with industrial machinery sounds"
    },
    user_inputs: {
      object: {
        label: "Toys Being Crushed",
        placeholder: "vintage action figures still in packaging",
        suggestions: [
          "Childhood stuffed animals that have seen better days",
          "Plastic toy cars and trucks in various sizes",
          "Old electronic toys with lights and sounds",
          "Board games and puzzle pieces",
          "Vintage dolls with different materials and textures",
          "Building blocks and construction toys"
        ]
      },
      action: {
        label: "Crushing Style",
        placeholder: "slow hydraulic press compression revealing internal structure",
        suggestions: [
          "Fast sudden crush showing explosive destruction",
          "Gradual pressure build-up with creaking and popping sounds",
          "Multiple small toys crushed simultaneously",
          "Freezing toys first then crushing while brittle",
          "Soaking toys in various liquids before crushing",
          "Crushing while toys are still functioning/making sounds"
        ]
      },
      visual_details: {
        label: "Destruction Details",
        placeholder: "plastic cracking, stuffing exploding out, electronic circuits sparking",
        suggestions: [
          "Stuffing bursting out in satisfying clouds",
          "Plastic cracking in spider web patterns",
          "Electronic components sparking and failing",
          "Paint and coatings peeling off under pressure",
          "Internal mechanisms becoming visible as shells crack",
          "Different materials reacting uniquely to pressure"
        ]
      },
      sound_focus: {
        label: "Audio Design",
        placeholder: "hydraulic press hum, plastic cracking, electronic death sounds",
        suggestions: ["mechanical press operation sounds", "satisfying crack and pop of destruction", "electronic toys making final sounds", "hydraulic pressure and release cycles", "different materials failing in unique ways"]
      }
    }
  },

  peel_aloe_leaves: {
    name: "Peeling Aloe Leaves", 
    category: "asmr",
    tagline: "Nature's Satisfaction",
    description: "Massive aloe leaves being peeled to reveal satisfying gel interior",
    fixed_fields: {
      setting: "clean kitchen or outdoor space with natural lighting",
      lighting_type: "bright natural light showing gel transparency and texture",
      tone: "gentle and meditative",
      atmosphere: "natural, organic satisfaction",
      actions: "careful peeling, revealing gel, showing texture and consistency",
      angle: "close-up shots of peeling action and gel texture",
      distance: "macro shots showing gel detail and peeling precision",
      movement: "smooth, following the peeling action naturally",
      color_palette: "natural greens and clear/white gel colors",
      music_style: "natural ambient sounds or gentle background",
      environment: "natural setting emphasizing organic elements"
    },
    user_inputs: {
      object: {
        label: "Aloe Plant Type",
        placeholder: "massive thick aloe vera leaves the size of baseball bats",
        suggestions: [
          "Giant century plant leaves with thick gel layers",
          "Multiple different sized aloe varieties",
          "Aloe leaves that have been refrigerated for firmer gel",
          "Wild-grown aloe with thicker, more fibrous exteriors",
          "Greenhouse-grown perfect aloe with maximum gel content",
          "Ancient aloe plants with massive, aged leaves"
        ]
      },
      action: {
        label: "Peeling Technique",
        placeholder: "sharp knife removing skin in one continuous strip",
        suggestions: [
          "Peeling by hand to show natural separation of skin and gel",
          "Using spoon to scoop out gel in perfect sections",
          "Removing spikes first then peeling skin in sections",
          "Filleting like fish to show clean gel extraction",
          "Removing both sides to create perfect gel rectangles",
          "Demonstration of multiple peeling techniques on different leaves"
        ]
      },
      visual_details: {
        label: "Satisfying Visual Elements",
        placeholder: "translucent gel being revealed, perfect smooth textures, natural patterns",
        suggestions: [
          "Gel wobbling and jiggling with perfect consistency",
          "Clean separation showing natural fiber patterns",
          "Translucent gel catching and refracting light beautifully",
          "Perfect geometric gel pieces maintaining their shape",
          "Natural aloe patterns and textures being revealed",
          "Contrast between rough exterior and smooth interior"
        ]
      },
      sound_focus: {
        label: "Natural Sounds",
        placeholder: "gentle tearing of skin, wet sounds of gel separation",
        suggestions: ["satisfying skin peeling and tearing", "wet gel sounds and natural squishing", "knife cutting through natural fibers", "gentle scraping and scooping sounds", "organic natural separation sounds"]
      }
    }
  },

  melt_crayons_waffle: {
    name: "Melting Crayons Waffle Iron",
    category: "asmr",
    tagline: "Colorful Destruction",
    description: "Brand new crayons being melted in waffle iron creating colorful patterns",
    fixed_fields: {
      setting: "clean kitchen setup with waffle iron as centerpiece",
      lighting_type: "bright lighting to show color mixing and waffle patterns",
      tone: "playful destruction with artistic results",
      atmosphere: "creative chaos meets satisfying transformation",
      actions: "arranging crayons, closing waffle iron, revealing colorful results",
      angle: "overhead shots of waffle iron, close-ups of melting process",
      distance: "macro shots of color mixing, wide shots of full setup",
      movement: "steady shots with dramatic reveals when opening waffle iron",
      color_palette: "bright crayon colors mixing and blending",
      music_style: "playful background music matching the creative energy",
      environment: "kitchen setting with focus on the artistic process"
    },
    user_inputs: {
      object: {
        label: "Crayon Setup",
        placeholder: "brand new 64-pack of crayons arranged by color spectrum",
        suggestions: [
          "Giant oversized crayons for more dramatic melting",
          "Vintage crayons with different wax formulations",
          "Metallic and glitter crayons for special effects",
          "Broken crayon pieces creating random color patterns",
          "Arranged crayons creating planned color gradients",
          "Different crayon brands mixed together"
        ]
      },
      action: {
        label: "Melting Method",
        placeholder: "arranging crayons in waffle iron patterns then closing slowly",
        suggestions: [
          "Rapid closing to create explosive color mixing",
          "Slow compression watching colors blend gradually",
          "Multiple rounds building up layers of color",
          "Pre-melting some crayons then adding solid ones",
          "Creating specific patterns or images with color placement",
          "Using different heat settings for varied melting effects"
        ]
      },
      visual_details: {
        label: "Color Mixing Results",
        placeholder: "wax colors bleeding together in waffle grid patterns, new color combinations forming",
        suggestions: [
          "Perfect waffle grid patterns filled with rainbow colors",
          "Unexpected color combinations creating new hues",
          "Wax flowing and mixing in organic, unpredictable ways",
          "Steam and bubbling as wax reaches melting temperature",
          "Dramatic reveals showing completed colorful waffle patterns",
          "Contrast between solid crayons and final melted artwork"
        ]
      },
      sound_focus: {
        label: "Audio Elements",
        placeholder: "waffle iron heating, wax melting and bubbling, satisfying closure sounds",
        suggestions: ["waffle iron heating and mechanical sounds", "wax melting, bubbling and sizzling", "satisfying click of waffle iron closing", "steam and heating sounds", "dramatic reveals with waffle iron opening"]
      }
    }
  },

  // 😠 JEALOUS BOYFRIEND MEME CATEGORY  
  girlfriend_vs_pizza: {
    name: "Girlfriend vs Pizza",
    category: "jealous_boyfriend",
    tagline: "Ultimate Betrayal",
    description: "Classic meme format: guy choosing between relationship and perfect slice",
    fixed_fields: {
      setting: "typical date setting like restaurant or living room",
      lighting_type: "casual indoor lighting emphasizing the choice conflict",
      tone: "comedically dramatic about trivial decision",
      atmosphere: "relationship tension over absurd priority conflict",
      actions: "torn between two desires, exaggerated internal conflict",
      angle: "classic meme positioning with clear sight lines to both options",
      distance: "medium shots showing all three elements of the meme",
      movement: "static positioning that matches meme format expectations",
      color_palette: "warm relationship colors vs tempting food colors",
      music_style: "dramatic music that makes trivial choice seem epic",
      environment: "relatable domestic or date setting"
    },
    user_inputs: {
      main_character: {
        label: "Guy in the Middle",
        placeholder: "Average boyfriend trying to look loyal while clearly tempted",
        suggestions: [
          "Fitness bro who's been dieting for months",
          "Broke college student who can't afford both",
          "Guy on first date trying to impress",
          "Husband who promised to eat healthier",
          "Foodie who just discovered this amazing place",
          "Guy whose girlfriend is always judging his food choices"
        ]
      },
      cheated_on_subject: {
        label: "The Girlfriend",
        placeholder: "Girlfriend who specifically said 'we're eating healthy tonight'",
        suggestions: [
          "Fitness influencer girlfriend who only eats salads",
          "New girlfriend he's trying to impress with self-control",
          "Long-term girlfriend who knows exactly what he's thinking",
          "Girlfriend who's been complaining about his eating habits",
          "Health-conscious girlfriend who bought groceries for a home meal",
          "Girlfriend who's testing whether he'll choose her over food"
        ]
      },
      object_of_obsession: {
        label: "The Pizza",
        placeholder: "Perfect slice of pepperoni pizza with cheese pull",
        suggestions: [
          "Local legendary pizza place's signature slice",
          "Late-night pizza that represents freedom from healthy eating",
          "Childhood favorite pizza that brings back memories",
          "Limited-time special pizza that might never be available again",
          "Pizza that represents everything she says is bad for him",
          "Free pizza that someone else is offering"
        ]
      },
      meme_caption: {
        label: "Caption/Internal Monologue",
        placeholder: "When she says 'we're eating healthy' but the pizza place has a 2-for-1 special",
        suggestions: [
          "Me: 'I'm committed to this relationship' Also me: *sees pizza*",
          "Her: 'Do you love me more than food?' Me:",
          "When you promised to share a salad but that pizza is calling your name",
          "POV: You have to choose between your diet and your happiness",
          "When she's talking about the future but all you can think about is cheese",
          "Me trying to be the boyfriend she deserves vs. Me seeing that pizza"
        ]
      }
    }
  },

  cat_vs_laser: {
    name: "Cat vs Laser Pointer",
    category: "jealous_boyfriend",
    tagline: "Feline Betrayal",
    description: "Cat abandoning owner's affection for the irresistible red dot",
    fixed_fields: {
      setting: "typical living room where cat usually seeks attention",
      lighting_type: "soft indoor lighting with dramatic laser dot highlight",
      tone: "comedic pet betrayal",
      atmosphere: "domestic scene turned into love triangle",
      actions: "cat torn between human affection and laser dot obsession",
      angle: "positioning that shows cat's divided attention clearly",
      distance: "shots that capture both human disappointment and cat fixation",
      movement: "following cat's attention shift from owner to laser",
      color_palette: "warm home colors with bright red laser accent",
      music_style: "playful pet video music with dramatic undertones",
      environment: "cozy home setting where pet relationships play out"
    },
    user_inputs: {
      main_character: {
        label: "The Cat",
        placeholder: "Spoiled house cat who usually demands constant attention",
        suggestions: [
          "Clingy cat who follows owner everywhere",
          "Aloof cat who rarely shows affection",
          "Playful kitten with infinite energy",
          "Elderly cat who's usually calm and cuddly",
          "Cat who's been indoor-only and craves stimulation",
          "Rescue cat who finally learned to trust humans"
        ]
      },
      cheated_on_subject: {
        label: "The Owner",
        placeholder: "Cat owner who thought they had an unbreakable bond",
        suggestions: [
          "Crazy cat person who treats cat like their child",
          "New cat owner still learning about feline behavior",
          "Person who rescued this cat and expected eternal gratitude",
          "Owner who spoils cat with expensive toys and treats",
          "Someone who works from home and is cat's constant companion",
          "Owner who brags about how much their cat loves them"
        ]
      },
      object_of_obsession: {
        label: "The Laser Dot",
        placeholder: "Irresistible red laser dot moving in unpredictable patterns",
        suggestions: [
          "Classic red laser pointer dot that drives cats insane",
          "Automatic laser toy creating random patterns",
          "Laser dot reflecting off something shiny",
          "Multiple laser dots creating maximum chaos",
          "Laser dot moving in specifically tempting patterns",
          "High-powered laser creating extra bright, irresistible dot"
        ]
      },
      meme_caption: {
        label: "Caption",
        placeholder: "Cat: 'I love you human' *sees laser dot* Cat: 'I must kill the red circle'",
        suggestions: [
          "Me: 'My cat and I have a special bond' My cat when it sees a laser dot:",
          "Cat: 'Humans are just servants' Also cat: *becomes slave to red dot*",
          "When you think you're your cat's favorite but then someone pulls out a laser pointer",
          "Cat owners: 'My cat really loves me' The cat:",
          "POV: You realize your cat's love is conditional based on entertainment value",
          "Me trying to bond with my cat vs. A $5 laser pointer"
        ]
      }
    }
  },

  // 👀 OUT-OF-PLACE CHARACTER CATEGORY
  stormtrooper_therapy: {
    name: "Stormtrooper in Therapy",
    category: "out_of_place",
    tagline: "Empire Has Issues",
    description: "Imperial Stormtrooper working through occupational trauma with therapist",
    fixed_fields: {
      setting: "typical therapist office with couch, tissues, calming decor",
      lighting_type: "soft, therapeutic lighting creating safe space atmosphere",
      tone: "serious therapy session with absurd participant",
      atmosphere: "professional mental health setting disrupted by sci-fi element",
      actions: "therapy session behavior, emotional breakthroughs, professional counseling",
      angle: "traditional therapy session framing",
      distance: "medium shots allowing for emotional expression despite helmet",
      movement: "respectful, therapeutic pacing",
      color_palette: "calming therapeutic colors contrasted with stark white armor",
      music_style: "gentle therapeutic background or silence for authenticity",
      environment: "professional therapy office with all standard elements"
    },
    user_inputs: {
      whos_out_of_place: {
        label: "The Stormtrooper's Background",
        placeholder: "TK-421 struggling with accuracy issues and workplace trauma",
        suggestions: [
          "Stormtrooper with PTSD from Death Star explosion",
          "Imperial soldier questioning the Empire's methods",
          "Trooper dealing with identity crisis behind the mask",
          "Stormtrooper with performance anxiety about missing targets",
          "Clone trooper struggling with individuality issues",
          "Former Stormtrooper trying to reintegrate into civilian life"
        ]
      },
      where: {
        label: "Therapy Office Details",
        placeholder: "Dr. Sarah Mitchell's downtown therapy practice",
        suggestions: [
          "Couples therapy office where he's alone",
          "Group therapy session with other patients staring",
          "Child psychologist's office with colorful decorations",
          "High-end private practice in upscale building",
          "Community mental health center with budget furniture",
          "Online therapy session via video call"
        ]
      },
      public_reaction: {
        label: "How Others React",
        placeholder: "Therapist maintaining professional composure while internally screaming",
        suggestions: [
          "Other patients in waiting room pretending not to stare",
          "Receptionist calmly scheduling follow-up appointments",
          "Security guard debating whether armor counts as weapon",
          "Therapist's kids excited to meet 'Space Soldier' after session",
          "Insurance company representatives trying to process claims",
          "Janitor wondering if armor needs special cleaning protocols"
        ]
      },
      mood: {
        label: "Overall Tone",
        placeholder: "absurdly serious",
        suggestions: ["absurdly serious", "heartwarming breakthrough", "comedically professional", "unexpectedly touching", "bureaucratically surreal"]
      }
    }
  },

  trex_yoga: {
    name: "T-Rex at Yoga Class",
    category: "out_of_place",
    tagline: "Prehistoric Zen",
    description: "Tyrannosaurus Rex attempting to find inner peace through yoga practice",
    fixed_fields: {
      setting: "typical yoga studio with mats, mirrors, calming atmosphere",
      lighting_type: "soft, zen lighting with natural elements",
      tone: "peaceful yoga energy disrupted by prehistoric presence",
      atmosphere: "mindful practice meets ancient predator",
      actions: "attempting yoga poses with obvious physical limitations",
      angle: "showing scale difference and pose attempts",
      distance: "wide shots showing full T-Rex in yoga space, close-ups of expression",
      movement: "slow, yoga-paced movements emphasizing struggle with tiny arms",
      color_palette: "calming yoga studio colors with prehistoric dinosaur highlights",
      music_style: "traditional yoga music with occasional prehistoric sound effects",
      environment: "serene yoga studio with all traditional elements"
    },
    user_inputs: {
      whos_out_of_place: {
        label: "The T-Rex's Situation",
        placeholder: "Stressed apex predator recommended yoga for anger management",
        suggestions: [
          "Dinosaur dealing with modern world adaptation anxiety",
          "T-Rex trying to overcome reputation as mindless killing machine",
          "Prehistoric creature seeking work-life balance",
          "Therapist-recommended yoga for rage issues",
          "T-Rex trying to impress potential mate with new hobby",
          "Dinosaur exploring spirituality after existential crisis"
        ]
      },
      where: {
        label: "Yoga Studio Setting",
        placeholder: "Sacred Lotus Yoga Studio's morning flow class",
        suggestions: [
          "Hot yoga class making dinosaur overheat",
          "Beginner-friendly class with patient instructor",
          "Advanced class where T-Rex is clearly struggling",
          "Outdoor yoga in park with curious onlookers",
          "Private session with understanding instructor",
          "Corporate yoga class during lunch break"
        ]
      },
      public_reaction: {
        label: "Other Yogis' Response",
        placeholder: "Instructor maintaining zen while internally panicking about insurance liability",
        suggestions: [
          "Other students pretending crushing sounds are normal",
          "Yoga instructor adapting poses for 'differently-abled' student",
          "Class members offering to help with poses requiring arms",
          "Studio owner calculating structural damage costs",
          "New students thinking this is advanced intimidation technique",
          "Regular practitioners treating it as ultimate mindfulness test"
        ]
      },
      mood: {
        label: "Class Energy",
        placeholder: "zen chaos",
        suggestions: ["zen chaos", "surprisingly touching", "comedically serene", "absurdly peaceful", "heartwarming acceptance"]
      }
    }
  }
};

// Animation style mappings for clear user understanding
export const animationStyles = {
  south_park_style: {
    name: "South Park Style",
    description: "Paper cutout animation, simple shapes, satirical humor",
    technical_name: "cutout_satire"
  },
  simpsons_style: {
    name: "The Simpsons Style",
    description: "Yellow skin tones, thick black outlines, flat 2D animation",
    technical_name: "springfield_yellow"
  },
  rick_morty_style: {
    name: "Rick & Morty Style",
    description: "Sci-fi cartoon with dark humor and expressive animation",
    technical_name: "sci_fi_toon"
  },
  family_guy_style: {
    name: "Family Guy Style",
    description: "Glossy 2D animation, cutaway gags, suburban sitcom",
    technical_name: "slacker_sitcom"
  },
  studio_ghibli_style: {
    name: "Studio Ghibli Style",
    description: "Beautiful hand-drawn animation, magical realism, nature themes",
    technical_name: "studio_ghibli_magic"
  },
  claymation_style: {
    name: "Claymation Style", 
    description: "Stop-motion clay animation with tactile, handmade feel",
    technical_name: "stop_motion_clay"
  },
  watercolor_style: {
    name: "Watercolor Animation",
    description: "Flowing watercolor painting style with organic movement",
    technical_name: "watercolor_flow"
  },
  hyperrealistic_style: {
    name: "Hyperrealistic CGI",
    description: "Photorealistic 3D animation indistinguishable from reality",
    technical_name: "photorealistic_3d"
  }
};

// Category organization for template browser
export const templateCategories = {
  podcast: {
    name: "🎙️ Podcast/Interview",
    tagline: "Viral Conversations",
    templates: ["conspiracy_shock", "influencer_goes_off", "weird_expert", "unexpected_truth"]
  },
  street_interview: {
    name: "📢 Street Interview",
    tagline: "Public Reactions",
    templates: ["downtown_chaos", "campus_debate", "truth_or_dare_irl", "family_friendly"]
  },
  asmr: {
    name: "✂️ ASMR/Satisfying",
    tagline: "So Satisfying!",
    templates: ["glass_sphere_cutting", "powerwash_playground", "crush_toys_press", "peel_aloe_leaves", "melt_crayons_waffle"]
  },
  jealous_boyfriend: {
    name: "😠 Jealous Boyfriend Meme",
    tagline: "Ultimate Betrayal",
    templates: ["girlfriend_vs_pizza", "cat_vs_laser"]
  },
  out_of_place: {
    name: "👀 Out-of-Place Character",
    tagline: "Wrong Place, Right Time",
    templates: ["stormtrooper_therapy", "trex_yoga"]
  }
};

// Helper functions
export const getAllTemplates = () => viralTemplates;

export const getTemplatesByCategory = (category) => {
  if (templateCategories[category]) {
    return templateCategories[category].templates.map(id => ({
      id,
      ...viralTemplates[id]
    }));
  }
  return [];
};

export const getTemplate = (templateId) => viralTemplates[templateId];

export const getAllCategories = () => templateCategories;