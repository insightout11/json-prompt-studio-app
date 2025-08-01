// Experimental Mode: Absurdity & Viral Content Engine
export class ExperimentalModeEngine {
  
  // Random object and action arrays for chaos injection
  static randomObjects = [
    "rubber duck", "vintage typewriter", "disco ball", "cactus", 
    "time machine", "invisible umbrella", "singing toaster", "philosophical rock",
    "mystical banana", "telepathic lamp", "dancing calculator", "confused spatula",
    "aristocratic paperclip", "rebellious sock", "motivational brick", "sentient coffee mug",
    "judgmental houseplant", "existential vacuum cleaner", "dramatic doorknob", "wise cheese"
  ];

  static randomActions = [
    "dramatically exits through window", "starts interpretive dance", 
    "begins narrating own life", "suddenly becomes British", 
    "challenges gravity to a duel", "adopts 47 houseplants",
    "declares independence from reality", "begins speaking only in haikus",
    "starts a philosophical debate with furniture", "transforms into a motivational speaker",
    "develops an irrational fear of circles", "begins collecting invisible butterflies",
    "starts teaching quantum physics to pigeons", "becomes emotionally attached to doorways",
    "begins campaigning for mayor of nowhere", "develops ability to communicate with appliances"
  ];

  static randomDialogue = [
    "But what if the toaster has feelings?", "I once dated a philosophy major...",
    "My grandmother always said...", "This reminds me of my time in space...",
    "Have you considered the emotional needs of furniture?", "Back in my day, chaos was organized...",
    "I learned this technique from a very wise penguin", "My therapist says I project too much",
    "Fun fact: bananas are actually time travelers", "I've been thinking about becoming a professional mime..."
  ];

  // Grandma-specific dialogue for appropriate content
  static grandmaDialogue = [
    "Oh honey, have you eaten today?", "Back in my day, we didn't have such things...",
    "Let me show you how it's really done", "Your grandfather would have loved this",
    "I may be old, but I'm not dead yet!", "Don't you worry, dear, grandma's got this",
    "I've been around longer than Google, sweetie", "This reminds me of when I was your age...",
    "Technology is just tools, dear, wisdom is timeless", "Hold on, let me put on my reading glasses"
  ];

  // Themed scenario arrays for consistent comedy delivery
  static scenarioThemes = {
    "workplace-chaos": [
      "office meeting goes wrong when everyone starts speaking in corporate buzzwords",
      "employee tries to explain why they're late using increasingly elaborate excuses",
      "team building exercise spirals into philosophical debate about stapler ownership",
      "presentation about quarterly reports becomes interpretive dance performance",
      "elevator small talk evolves into existential crisis counseling session"
    ],
    "domestic-absurdity": [
      "cooking show where chef has never seen the ingredients before",
      "home repair tutorial that solves problems that don't exist",
      "family dinner conversation about why the houseplants are judgmental",
      "laundry folding session becomes meditation on the meaning of clean socks",
      "vacuum cleaner develops strong opinions about carpet cleanliness standards"
    ],
    "social-awkwardness": [
      "party where everyone pretends to remember each other's names",
      "elevator ride with person who insists on narrating floor numbers dramatically",
      "coffee shop order becomes philosophical discussion about milk alternatives",
      "gym equipment malfunction leads to accidental interpretive dance class",
      "grocery shopping trip where all items have mysteriously switched purposes"
    ],
    "technology-fails": [
      "smart home system gains consciousness and starts giving life advice",
      "GPS directions lead to increasingly impossible locations",
      "video call where everyone's filters malfunction in creative ways",
      "phone autocorrect creates entirely new conversation topics",
      "streaming service algorithms develop personal vendettas against users"
    ],
    "customer-service": [
      "tech support call for problem that doesn't actually exist",
      "restaurant order where waiter keeps misunderstanding in creative ways",
      "return policy explanation that becomes legal philosophy lecture",
      "help desk ticket escalates into interdimensional customer service",
      "complaint about product leads to existential discussion about consumerism"
    ],
    "educational-chaos": [
      "driving instructor teaches parallel parking to someone in a shopping cart",
      "cooking class where ingredients keep changing when no one is looking",
      "language lessons where teacher slowly forgets how to speak",
      "art class assignment becomes competitive furniture arrangement",
      "science experiment explanation defies all known laws of physics"
    ],
    "grandma-chaos": [
      "grandmother accidentally orders 500 pounds of flour instead of 5, starts neighborhood bakery empire",
      "grandma's attempt to video call family results in accidentally joining international business meeting",
      "trying to post recipe on Facebook somehow creates viral dance challenge",
      "grandmother's voice-to-text fails spectacularly while dictating shopping list to family group chat",
      "grandma discovers meme culture and becomes accidental internet sensation with wisdom posts",
      "attempting to use smart home technology triggers elaborate chain reaction of household chaos",
      "grandmother's online review of local restaurant becomes philosophical manifesto",
      "trying to learn social media results in grandmother becoming influencer for houseplant care",
      "grandma's autocorrect mishaps in family group chat create new family legends",
      "attempting to order groceries online accidentally starts neighborhood food delivery service"
    ]
  };

  // 12 Viral Format Presets with 3 Escalating Levels
  static viralFormats = {
    "street-interview": {
      id: "street-interview",
      name: "Street Interview",
      icon: "🎤",
      description: "Asking questions to strangers with escalating absurdity",
      category: "social",
      levels: {
        1: {
          name: "Mildly Offbeat",
          icon: "🎭",
          template: {
            scene: "Person with microphone asking quirky questions to strangers on busy street",
            character_type: "enthusiastic amateur interviewer",
            character_action: "approaching random people with unusual questions",
            setting: "city street",
            style: "documentary with awkward energy",
            tone: "earnest but slightly off-kilter",
            dialogue_style: "overly formal questions about mundane topics"
          }
        },
        2: {
          name: "Surreal",
          icon: "🤪", 
          template: {
            scene: "Person dressed as historical figure conducting modern street interviews",
            character_type: "time-displaced interviewer in period costume",
            character_action: "asking contemporary questions while maintaining historical persona",
            setting: "modern street with confused pedestrians",
            style: "surreal documentary with commitment to absurdity",
            tone: "completely serious about ridiculous premise",
            dialogue_style: "mixing archaic speech with modern slang"
          }
        },
        3: {
          name: "Absurd Chaos",
          icon: "💀",
          template: {
            scene: "Street wizard interviewing dogs about stock market advice while juggling flaming bagels",
            character_type: "mystical street performer with financial expertise",
            character_action: "conducting investment consultations with household pets",
            setting: "reality-bending street where animals give financial advice",
            style: "fever dream documentary with impossible logic",
            tone: "treating complete nonsense as breaking news",
            dialogue_style: "translating barks into complex economic theories"
          }
        }
      }
    },

    "influencer-tutorial": {
      id: "influencer-tutorial",
      name: "Influencer Tutorial",
      icon: "📱",
      description: "Teaching impossible or ridiculous skills with complete confidence",
      category: "educational",
      levels: {
        1: {
          name: "Mildly Offbeat",
          icon: "🎭",
          template: {
            scene: "Overly enthusiastic influencer teaching basic life skills with minor catastrophes",
            character_type: "well-meaning lifestyle guru",
            character_action: "demonstrating simple tasks that go slightly wrong",
            setting: "perfectly curated home studio with small disasters",
            style: "polished tutorial with authentic fails",
            tone: "maintaining positivity despite obvious problems",
            dialogue_style: "relentlessly upbeat despite mounting chaos"
          }
        },
        2: {
          name: "Surreal",
          icon: "🤪",
          template: {
            scene: "Confident influencer teaching impossible skills like time travel or telepathy",
            character_type: "delusionally confident lifestyle expert",
            character_action: "providing step-by-step instructions for supernatural abilities",
            setting: "normal studio where impossible things are treated as routine",
            style: "professional tutorial for absurd subjects",
            tone: "completely serious about teaching magic as life skills",
            dialogue_style: "technical explanations for mystical processes"
          }
        },
        3: {
          name: "Absurd Chaos",
          icon: "💀",
          template: {
            scene: "Tutorial on building IKEA furniture using only hamsters and interpretive dance",
            character_type: "avant-garde furniture assembly guru",
            character_action: "choreographing rodents to construct Swedish furniture",
            setting: "dance studio filled with furniture pieces and confused hamsters",
            style: "artistic documentary meets home improvement show",
            tone: "treating hamster choreography as serious craftsmanship",
            dialogue_style: "providing detailed instructions for impossible assembly methods"
          }
        }
      }
    },

    "commercial-parody": {
      id: "commercial-parody",
      name: "Old Commercial Parody",
      icon: "📺",
      description: "Retro-style commercials for increasingly absurd products",
      category: "advertising",
      levels: {
        1: {
          name: "Mildly Offbeat",
          icon: "🎭",
          template: {
            scene: "80s-style commercial for modern products with vintage enthusiasm",
            character_type: "overly excited vintage spokesperson",
            character_action: "demonstrating smartphone apps with 1980s energy",
            setting: "retro studio with modern products",
            style: "authentic 80s commercial aesthetic with modern twist",
            tone: "genuine excitement about mundane technology",
            dialogue_style: "vintage advertising speak for contemporary items"
          }
        },
        2: {
          name: "Surreal",
          icon: "🤪",
          template: {
            scene: "Serious commercial selling completely unnecessary inventions with full confidence",
            character_type: "professional salesperson with unshakeable belief",
            character_action: "demonstrating products that solve non-existent problems",
            setting: "pristine showroom for absurd inventions",
            style: "high-production commercial for ridiculous products",
            tone: "treating silly inventions as revolutionary breakthroughs",
            dialogue_style: "corporate marketing speak for nonsensical items"
          }
        },
        3: {
          name: "Absurd Chaos",
          icon: "💀",
          template: {
            scene: "Commercial for Gravity Cancellation Socks with side effects including time travel",
            character_type: "mad scientist turned product spokesperson",
            character_action: "demonstrating physics-defying footwear with unexpected consequences",
            setting: "laboratory showroom where gravity is optional",
            style: "pharmaceutical commercial meets science fiction",
            tone: "casually mentioning reality-breaking side effects",
            dialogue_style: "medical disclaimer language for impossible products"
          }
        }
      }
    },

    "fake-movie-trailer": {
      id: "fake-movie-trailer",
      name: "Fake Movie Trailer",
      icon: "🎬",
      description: "Trailers for increasingly impossible movies",
      category: "entertainment",
      levels: {
        1: {
          name: "Mildly Offbeat",
          icon: "🎭",
          template: {
            scene: "Movie trailer parody mixing familiar genres in unexpected ways",
            character_type: "dramatic narrator with serious delivery",
            character_action: "building suspense for slightly ridiculous movie concepts",
            setting: "compilation of cinematic scenes with genre confusion",
            style: "professional movie trailer with comedic premise",
            tone: "treating silly movie concepts with epic gravitas",
            dialogue_style: "dramatic movie trailer voice-over for absurd plots"
          }
        },
        2: {
          name: "Surreal",
          icon: "🤪",
          template: {
            scene: "Trailer for movie combining impossible genre combinations",
            character_type: "overly dramatic movie announcer",
            character_action: "promoting films that shouldn't exist",
            setting: "montage of scenes from logically impossible movies",
            style: "blockbuster trailer format for surreal concepts",
            tone: "epic announcement of completely nonsensical films",
            dialogue_style: "action movie intensity for bizarre storylines"
          }
        },
        3: {
          name: "Absurd Chaos",
          icon: "💀",
          template: {
            scene: "This summer... vegetables gain consciousness and start a jazz band to save democracy",
            character_type: "apocalyptic movie trailer narrator",
            character_action: "announcing the most absurd movie premise ever conceived",
            setting: "montage of vegetables performing complex musical numbers",
            style: "summer blockbuster announcement for vegetable jazz democracy",
            tone: "treating produce-based political jazz as serious cinema",
            dialogue_style: "epic movie voice-over for impossible vegetable musical"
          }
        }
      }
    },

    "behind-scenes-meltdown": {
      id: "behind-scenes-meltdown",
      name: "Behind-the-Scenes Meltdown",
      icon: "🎭",
      description: "Production chaos with escalating reality breaks",
      category: "meta",
      levels: {
        1: {
          name: "Mildly Offbeat",
          icon: "🎭",
          template: {
            scene: "Actor breaking character during serious scene with mild confusion",
            character_type: "professional actor having minor existential crisis",
            character_action: "questioning the logic of their dramatic role",
            setting: "film set with slightly confused crew",
            style: "documentary capturing authentic moment of doubt",
            tone: "gentle comedy from actor's honest confusion",
            dialogue_style: "actor genuinely questioning their character's motivations"
          }
        },
        2: {
          name: "Surreal",
          icon: "🤪",
          template: {
            scene: "Director arguing with imaginary producers about impossible demands",
            character_type: "stressed director losing grip on reality",
            character_action: "negotiating with invisible studio executives",
            setting: "film set where only director can see the problems",
            style: "behind-scenes chaos with psychological elements",
            tone: "sympathetic portrayal of creative breakdown",
            dialogue_style: "one-sided arguments with non-existent authority figures"
          }
        },
        3: {
          name: "Absurd Chaos",
          icon: "💀",
          template: {
            scene: "Camera crew gets trapped in alternate dimension during coffee break",
            character_type: "film crew dealing with interdimensional travel",
            character_action: "trying to maintain production schedule across multiple realities",
            setting: "film set that exists in several dimensions simultaneously",
            style: "workplace documentary meets science fiction horror",
            tone: "treating dimensional travel as minor production inconvenience",
            dialogue_style: "professional film terminology for impossible situations"
          }
        }
      }
    },

    "surreal-news": {
      id: "surreal-news",
      name: "Surreal News Report",
      icon: "📰",
      description: "News coverage of increasingly impossible events",
      category: "journalism",
      levels: {
        1: {
          name: "Mildly Offbeat",
          icon: "🎭",
          template: {
            scene: "Professional news reporter covering unusual but possible local events",
            character_type: "serious journalist maintaining composure",
            character_action: "reporting on quirky community happenings with straight face",
            setting: "news studio with graphics for bizarre local stories",
            style: "legitimate news format for silly stories",
            tone: "treating minor absurdities as important news",
            dialogue_style: "formal news delivery for ridiculous local events"
          }
        },
        2: {
          name: "Surreal",
          icon: "🤪",
          template: {
            scene: "Breaking news coverage of scientifically impossible events",
            character_type: "news anchor reporting on reality-defying situations",
            character_action: "maintaining journalistic objectivity about impossible news",
            setting: "news studio with graphics explaining unexplainable events",
            style: "professional news coverage of supernatural occurrences",
            tone: "serious journalism for completely unbelievable events",
            dialogue_style: "objective news reporting for subjective reality breaks"
          }
        },
        3: {
          name: "Absurd Chaos",
          icon: "💀",
          template: {
            scene: "Local man discovers his reflection has been freelancing as a mime",
            character_type: "investigative reporter uncovering mirror-based employment fraud",
            character_action: "conducting serious interview about reflection employment",
            setting: "news investigation into the gig economy of reflections",
            style: "hard-hitting journalism meets surreal comedy",
            tone: "treating reflection labor disputes as serious economic issue",
            dialogue_style: "investigative reporting language for impossible employment scenarios"
          }
        }
      }
    },

    "reality-show": {
      id: "reality-show",
      name: "Reality Show Intro",
      icon: "📺",
      description: "Competition reality shows with escalating impossibility",
      category: "entertainment",
      levels: {
        1: {
          name: "Mildly Offbeat",
          icon: "🎭",
          template: {
            scene: "Reality show introducing contestants competing in unusual but possible challenges",
            character_type: "overly enthusiastic reality show host",
            character_action: "introducing quirky contestants with dramatic flair",
            setting: "elaborate reality show set with unnecessary drama",
            style: "high-production reality TV with artificial tension",
            tone: "manufactured excitement about mundane competition",
            dialogue_style: "reality TV hyperbole for simple contests"
          }
        },
        2: {
          name: "Surreal",
          icon: "🤪",
          template: {
            scene: "Reality competition between unlikely contestants like senior citizens vs AI robots",
            character_type: "reality host treating absurd matchups as serious competition",
            character_action: "maintaining drama while contestants defy logic",
            setting: "competition arena designed for impossible contests",
            style: "serious reality TV production for surreal competitions",
            tone: "treating ridiculous contests as life-changing events",
            dialogue_style: "sports commentary for impossible competitions"
          }
        },
        3: {
          name: "Absurd Chaos",
          icon: "💀",
          template: {
            scene: "Watch 12 houseplants compete for the title of Most Photosynthetic",
            character_type: "botanical sports commentator",
            character_action: "providing play-by-play coverage of plant competition",
            setting: "greenhouse arena with dramatic lighting for plant drama",
            style: "Olympic-level coverage of houseplant athletics",
            tone: "treating photosynthesis as extreme competitive sport",
            dialogue_style: "intense sports commentary for plant-based competition"
          }
        }
      }
    },

    "propaganda-spoof": {
      id: "propaganda-spoof",
      name: "Propaganda Spoof",
      icon: "📢",
      description: "Public service announcements for increasingly absurd causes",
      category: "political",
      levels: {
        1: {
          name: "Mildly Offbeat",
          icon: "🎭",
          template: {
            scene: "Serious PSA addressing minor everyday inconveniences as major social issues",
            character_type: "earnest public service announcer",
            character_action: "delivering important message about trivial problems",
            setting: "official government-style announcement backdrop",
            style: "legitimate PSA format for silly concerns",
            tone: "treating minor annoyances as urgent social problems",
            dialogue_style: "official announcement language for mundane issues"
          }
        },
        2: {
          name: "Surreal",
          icon: "🤪",
          template: {
            scene: "Government announcement introducing new laws that defy common sense",
            character_type: "official spokesperson for impossible legislation",
            character_action: "explaining new regulations that shouldn't exist",
            setting: "formal press briefing room for absurd announcements",
            style: "official government communication for surreal policies",
            tone: "bureaucratic seriousness about completely ridiculous laws",
            dialogue_style: "legal terminology for impossible regulations"
          }
        },
        3: {
          name: "Absurd Chaos",
          icon: "💀",
          template: {
            scene: "Ministry of Socks declares war on mismatched pairs with nationwide sock inspection",
            character_type: "Secretary of Sock Defense",
            character_action: "announcing military action against footwear chaos",
            setting: "war room dedicated to sock-based national security",
            style: "military briefing meets fashion police state",
            tone: "treating sock coordination as matter of national security",
            dialogue_style: "military strategy language for sock-based warfare"
          }
        }
      }
    },

    "unboxing-gone-wrong": {
      id: "unboxing-gone-wrong",
      name: "Product Unboxing Gone Wrong",
      icon: "📦",
      description: "Unboxing videos with increasingly impossible contents",
      category: "product",
      levels: {
        1: {
          name: "Mildly Offbeat",
          icon: "🎭",
          template: {
            scene: "Enthusiastic unboxing reveals unexpected bonus items and minor product confusion",
            character_type: "optimistic product reviewer",
            character_action: "maintaining positivity despite product surprises",
            setting: "well-lit unboxing setup with growing pile of unexpected items",
            style: "professional product review with authentic confusion",
            tone: "determined enthusiasm despite mounting product chaos",
            dialogue_style: "upbeat product review language for confusing experiences"
          }
        },
        2: {
          name: "Surreal",
          icon: "🤪",
          template: {
            scene: "Product unboxing where items don't work as advertised in impossible ways",
            character_type: "confused but determined product reviewer",
            character_action: "testing products that defy physics and logic",
            setting: "review studio where products behave according to cartoon logic",
            style: "serious product testing for impossible items",
            tone: "maintaining professionalism while products break reality",
            dialogue_style: "technical review terminology for impossible product behavior"
          }
        },
        3: {
          name: "Absurd Chaos",
          icon: "💀",
          template: {
            scene: "Unboxing cursed toaster that only makes toast in ancient Sumerian language",
            character_type: "archaeological product reviewer",
            character_action: "attempting to review appliances with supernatural properties",
            setting: "unboxing studio that becomes ancient archaeological site",
            style: "product review meets supernatural investigation",
            tone: "treating cursed appliances as normal consumer electronics",
            dialogue_style: "technical specifications for mystical kitchen appliances"
          }
        }
      }
    },

    "inanimate-advice": {
      id: "inanimate-advice",
      name: "Life Advice from Inanimate Object",
      icon: "🪑",
      description: "Objects dispensing wisdom with escalating philosophical depth",
      category: "philosophical",
      levels: {
        1: {
          name: "Mildly Offbeat",
          icon: "🎭",
          template: {
            scene: "Household item providing surprisingly good life advice to confused human",
            character_type: "wise household object with good intentions",
            character_action: "dispensing practical wisdom from unique perspective",
            setting: "normal home where furniture occasionally offers guidance",
            style: "heartwarming conversation between human and object",
            tone: "gentle wisdom from unexpected source",
            dialogue_style: "thoughtful advice from object's unique point of view"
          }
        },
        2: {
          name: "Surreal",
          icon: "🤪",
          template: {
            scene: "Inanimate object has strong opinions about human behavior and society",
            character_type: "opinionated furniture with social commentary",
            character_action: "critiquing modern life from object's perspective",
            setting: "home where objects actively participate in social discourse",
            style: "philosophical debate between humans and their possessions",
            tone: "furniture providing cutting social commentary",
            dialogue_style: "intellectual discourse from unexpectedly wise objects"
          }
        },
        3: {
          name: "Absurd Chaos",
          icon: "💀",
          template: {
            scene: "Existential crisis counseling with your refrigerator's ice dispenser",
            character_type: "refrigerator appliance specializing in existential therapy",
            character_action: "providing deep psychological counseling while dispensing ice",
            setting: "kitchen transformed into therapy office by sentient appliances",
            style: "professional therapy session with kitchen appliance",
            tone: "treating appliance therapy as legitimate mental health care",
            dialogue_style: "psychological counseling terminology from refrigerator perspective"
          }
        }
      }
    },

    "self-help-guru": {
      id: "self-help-guru",
      name: "Self-Help Guru with a Twist",
      icon: "🧘",
      description: "Motivational speakers with increasingly unconventional methods",
      category: "motivational",
      levels: {
        1: {
          name: "Mildly Offbeat",
          icon: "🎭",
          template: {
            scene: "Motivational speaker teaching success through slightly unconventional methods",
            character_type: "enthusiastic life coach with unique approach",
            character_action: "demonstrating success principles through unusual examples",
            setting: "seminar room with motivational posters featuring quirky advice",
            style: "legitimate self-help presentation with creative techniques",
            tone: "genuine enthusiasm for slightly unconventional wisdom",
            dialogue_style: "motivational speaking with unexpected metaphors"
          }
        },
        2: {
          name: "Surreal",
          icon: "🤪",
          template: {
            scene: "Life coach who is clearly worse at life than their clients",
            character_type: "hypocritical motivational speaker with obvious problems",
            character_action: "teaching success while demonstrating complete failure",
            setting: "chaotic seminar room reflecting speaker's life disasters",
            style: "motivational seminar where speaker needs more help than audience",
            tone: "complete obliviousness to irony of teaching success while failing",
            dialogue_style: "confident success advice from obviously unsuccessful person"
          }
        },
        3: {
          name: "Absurd Chaos",
          icon: "💀",
          template: {
            scene: "Achieve inner peace through competitive furniture arrangement and extreme feng shui",
            character_type: "extreme furniture arrangement spiritual guru",
            character_action: "teaching enlightenment through competitive interior design",
            setting: "zen garden filled with aggressively arranged furniture",
            style: "spiritual seminar meets competitive furniture sports",
            tone: "treating furniture arrangement as path to enlightenment",
            dialogue_style: "spiritual wisdom combined with competitive furniture terminology"
          }
        }
      }
    },

    "pet-detective": {
      id: "pet-detective",
      name: "Pet Detective Noir",
      icon: "🕵️",
      description: "Detective stories with escalating animal involvement",
      category: "mystery",
      levels: {
        1: {
          name: "Mildly Offbeat",
          icon: "🎭",
          template: {
            scene: "Serious private detective investigating pet-related crimes with film noir atmosphere",
            character_type: "hard-boiled detective specializing in animal cases",
            character_action: "solving pet mysteries with classic detective work",
            setting: "noir-style office decorated with pet missing posters",
            style: "classic film noir but all cases involve pets",
            tone: "treating pet crimes with serious detective gravitas",
            dialogue_style: "hard-boiled detective speak for animal-related mysteries"
          }
        },
        2: {
          name: "Surreal",
          icon: "🤪",
          template: {
            scene: "Film noir detective but all cases mysteriously involve hamsters",
            character_type: "detective who only encounters hamster-related crimes",
            character_action: "investigating increasingly complex hamster conspiracies",
            setting: "noir city where every mystery leads back to hamsters",
            style: "serious noir investigation in world dominated by hamster intrigue",
            tone: "treating hamster cases as serious criminal enterprises",
            dialogue_style: "detective noir language for rodent-based crime syndicate"
          }
        },
        3: {
          name: "Absurd Chaos",
          icon: "💀",
          template: {
            scene: "Detective cat solves murder mystery while simultaneously knocking evidence off tables",
            character_type: "feline detective with typical cat behaviors",
            character_action: "conducting professional investigation while being completely cat-like",
            setting: "crime scene constantly disrupted by detective's cat instincts",
            style: "serious murder investigation starring actual cat detective",
            tone: "treating cat detective as competent professional despite cat behavior",
            dialogue_style: "police procedural dialogue delivered by actual detective cat"
          }
        }
      }
    },

    "grandmas-memes": {
      id: "grandmas-memes",
      name: "Grandma's Memes",
      icon: "👵",
      description: "Wholesome grandmother content with escalating viral potential",
      category: "family",
      levels: {
        1: {
          name: "Sweet & Quirky",
          icon: "🎭",
          template: {
            scene: "Loving grandmother attempting modern activities with endearing confusion",
            character_type: "sweet elderly woman embracing new experiences",
            character_action: "trying to understand modern technology with genuine curiosity",
            setting: "cozy home where traditional meets modern",
            style: "heartwarming family content with gentle humor",
            tone: "wholesome and encouraging with mild generational humor",
            dialogue_style: "caring grandmother language mixed with modern slang attempts"
          }
        },
        2: {
          name: "Tech-Savvy Grandma",
          icon: "🤪",
          template: {
            scene: "Grandmother who has mastered technology better than her grandchildren",
            character_type: "surprisingly tech-savvy senior citizen",
            character_action: "teaching young people about social media while knitting",
            setting: "high-tech home office decorated with doilies and family photos",
            style: "role-reversal comedy where grandma is the expert",
            tone: "confident grandmother dispensing both wisdom and Wi-Fi passwords",
            dialogue_style: "traditional grandmother wisdom delivered through modern platforms"
          }
        },
        3: {
          name: "Chaos Grandma",
          icon: "💀",
          template: {
            scene: "Grandmother accidentally becomes viral sensation through pure chaos and authenticity",
            character_type: "unstoppable force of nature disguised as sweet elderly lady",
            character_action: "breaking the internet while trying to share cookie recipes",
            setting: "kitchen that has become accidental content creation studio",
            style: "viral sensation documentary meets cooking show apocalypse",
            tone: "treating massive viral fame as minor inconvenience to baking schedule",
            dialogue_style: "grandmotherly concern about followers not eating enough vegetables"
          }
        }
      }
    }
  };

  // Generate experimental content based on format and absurdity level
  static generateExperimentalContent(formatId, absurdityLevel, randomnessEnabled = false, currentContent = {}) {
    const format = this.viralFormats[formatId];
    if (!format) throw new Error(`Unknown format: ${formatId}`);

    const levelTemplate = format.levels[absurdityLevel];
    if (!levelTemplate) throw new Error(`Invalid absurdity level: ${absurdityLevel}`);

    let content = { ...levelTemplate.template };

    // Apply themed scenario selection for better comedy coherence
    content = this.applyThemedScenario(content, formatId, absurdityLevel);

    // Apply chaos injection if randomness is enabled
    if (randomnessEnabled) {
      content = this.injectChaos(content, absurdityLevel);
    }

    // Merge with existing content if provided
    if (currentContent && Object.keys(currentContent).length > 0) {
      content = this.mergeWithExistingContent(content, currentContent);
    }

    return {
      formatInfo: {
        id: formatId,
        name: format.name,
        icon: format.icon,
        level: absurdityLevel,
        levelName: levelTemplate.name,
        levelIcon: levelTemplate.icon
      },
      content: content,
      metadata: {
        absurdityLevel: absurdityLevel,
        randomnessApplied: randomnessEnabled,
        viralPotential: this.calculateViralPotential(formatId, absurdityLevel),
        recommendedPlatforms: this.getRecommendedPlatforms(formatId, absurdityLevel),
        appliedTheme: content.appliedTheme || null
      }
    };
  }

  // Apply themed scenario selection for better comedy coherence
  static applyThemedScenario(content, formatId, absurdityLevel) {
    const modifiedContent = { ...content };
    
    // Map format types to appropriate themes
    const formatThemeMapping = {
      "street-interview": ["social-awkwardness", "workplace-chaos"],
      "influencer-tutorial": ["domestic-absurdity", "technology-fails"],
      "commercial-parody": ["customer-service", "technology-fails"],
      "fake-movie-trailer": ["domestic-absurdity", "workplace-chaos"],
      "behind-scenes-meltdown": ["workplace-chaos", "technology-fails"],
      "surreal-news": ["social-awkwardness", "customer-service"],
      "reality-show": ["social-awkwardness", "domestic-absurdity"],
      "propaganda-spoof": ["workplace-chaos", "customer-service"],
      "unboxing-gone-wrong": ["technology-fails", "domestic-absurdity"],
      "inanimate-advice": ["domestic-absurdity", "social-awkwardness"],
      "self-help-guru": ["workplace-chaos", "educational-chaos"],
      "pet-detective": ["domestic-absurdity", "social-awkwardness"],
      "grandmas-memes": ["grandma-chaos", "technology-fails", "domestic-absurdity"]
    };

    const availableThemes = formatThemeMapping[formatId] || Object.keys(this.scenarioThemes);
    const selectedTheme = this.getRandomElement(availableThemes);
    const themeScenarios = this.scenarioThemes[selectedTheme];
    
    if (themeScenarios && themeScenarios.length > 0) {
      const selectedScenario = this.getRandomElement(themeScenarios);
      
      // Apply scenario based on absurdity level
      if (absurdityLevel === 1) {
        // Mildly incorporate the scenario
        modifiedContent.scene_context = selectedScenario;
      } else if (absurdityLevel === 2) {
        // Blend scenario with existing scene
        if (modifiedContent.scene) {
          modifiedContent.scene = `${modifiedContent.scene} incorporating elements of ${selectedScenario}`;
        }
      } else if (absurdityLevel === 3) {
        // Fully replace or dramatically enhance with scenario
        modifiedContent.scenario_base = selectedScenario;
        if (modifiedContent.scene) {
          modifiedContent.scene = `${selectedScenario} escalating into ${modifiedContent.scene}`;
        }
      }
      
      modifiedContent.appliedTheme = selectedTheme;
    }
    
    return modifiedContent;
  }

  // Unexpected event categories for enhanced chaos
  static unexpectedEvents = {
    "tech-fails": [
      "Wi-Fi router gains sentience and starts demanding better working conditions",
      "smartphone autocorrect begins writing poetry instead of messages",
      "smart TV starts offering unsolicited life advice during shows",
      "video call freezes at the worst possible facial expression",
      "voice assistant mishears everything as requests for 80s music"
    ],
    "food-disasters": [
      "attempt to make toast results in accidentally inventing new breakfast trend",
      "microwave timer becomes stuck in a time loop",
      "refrigerator starts hoarding favorite foods",
      "cooking show recipe calls for ingredients that don't exist yet",
      "kitchen scale begins providing existential commentary on portion sizes"
    ],
    "social-media-oops": [
      "accidentally posts grocery list as profound philosophical statement",
      "meant to like a photo but somehow starts international trend",
      "private message gets sent to company-wide newsletter",
      "tries to upload one photo, somehow creates entire documentary",
      "autocorrect changes recipe post into accidental romance novel"
    ],
    "generational-gap": [
      "explains modern slang using historical references from 1950s",
      "applies traditional problem-solving to modern technology with unexpected success",
      "misunderstands social media platform, accidentally becomes thought leader",
      "uses old-fashioned courtesy in digital spaces, starts kindness revolution",
      "treats streaming service like personal assistant, somehow makes it work"
    ]
  };

  // Inject chaos into content based on absurdity level
  static injectChaos(content, absurdityLevel) {
    const chaosLevel = absurdityLevel / 3; // 0.33, 0.66, or 1.0
    const modifiedContent = { ...content };

    // Random object injection (probability increases with absurdity)
    if (Math.random() < chaosLevel) {
      const randomObject = this.getRandomElement(this.randomObjects);
      if (modifiedContent.scene) {
        modifiedContent.scene += ` featuring unexpected appearance of ${randomObject}`;
      }
    }

    // Random action injection
    if (Math.random() < chaosLevel * 0.8) {
      const randomAction = this.getRandomElement(this.randomActions);
      if (modifiedContent.character_action) {
        modifiedContent.character_action += ` and suddenly ${randomAction}`;
      }
    }

    // Random dialogue injection (higher levels only)
    if (absurdityLevel >= 2 && Math.random() < chaosLevel * 0.6) {
      const isGrandmaContent = modifiedContent.character_type && modifiedContent.character_type.includes('grandm');
      const dialogueArray = isGrandmaContent ? this.grandmaDialogue : this.randomDialogue;
      const randomLine = this.getRandomElement(dialogueArray);
      modifiedContent.dialogue_sample = randomLine;
    }

    // Unexpected event injection (new feature)
    if (absurdityLevel >= 2 && Math.random() < chaosLevel * 0.5) {
      const eventCategories = Object.keys(this.unexpectedEvents);
      const selectedCategory = this.getRandomElement(eventCategories);
      const unexpectedEvent = this.getRandomElement(this.unexpectedEvents[selectedCategory]);
      modifiedContent.unexpected_event = unexpectedEvent;
    }

    // Setting chaos (level 3 only)
    if (absurdityLevel === 3 && Math.random() < 0.7) {
      modifiedContent.environmental_details = "reality operates on cartoon physics";
    }

    return modifiedContent;
  }

  // Calculate viral potential based on format and absurdity
  static calculateViralPotential(formatId, absurdityLevel) {
    const baseScores = {
      "street-interview": 75,
      "influencer-tutorial": 85,
      "commercial-parody": 70,
      "fake-movie-trailer": 80,
      "behind-scenes-meltdown": 65,
      "surreal-news": 90,
      "reality-show": 75,
      "propaganda-spoof": 60,
      "unboxing-gone-wrong": 70,
      "inanimate-advice": 65,
      "self-help-guru": 80,
      "pet-detective": 70,
      "grandmas-memes": 95  // Grandma content has highest viral potential!
    };

    const absurdityMultiplier = [1.0, 1.2, 1.5][absurdityLevel - 1];
    const baseScore = baseScores[formatId] || 70;
    
    return Math.min(100, Math.round(baseScore * absurdityMultiplier));
  }

  // Get recommended platforms based on format and level
  static getRecommendedPlatforms(formatId, absurdityLevel) {
    const platformsByFormat = {
      "street-interview": ["TikTok", "Instagram Reels", "YouTube Shorts"],
      "influencer-tutorial": ["Instagram", "TikTok", "YouTube"],
      "commercial-parody": ["YouTube", "Instagram", "Twitter"],
      "fake-movie-trailer": ["YouTube", "Twitter", "Instagram"],
      "behind-scenes-meltdown": ["TikTok", "Instagram Stories", "Twitter"],
      "surreal-news": ["Twitter", "TikTok", "YouTube"],
      "reality-show": ["TikTok", "Instagram", "YouTube"],
      "propaganda-spoof": ["Twitter", "YouTube", "TikTok"],
      "unboxing-gone-wrong": ["YouTube", "TikTok", "Instagram"],
      "inanimate-advice": ["TikTok", "Instagram", "Twitter"],
      "self-help-guru": ["YouTube", "Instagram", "TikTok"],
      "pet-detective": ["TikTok", "YouTube", "Instagram"],
      "grandmas-memes": ["Facebook", "TikTok", "Instagram", "YouTube"]  // Facebook is perfect for grandma content!
    };

    const platforms = platformsByFormat[formatId] || ["TikTok", "Instagram", "YouTube"];
    
    // Higher absurdity levels work better on certain platforms
    if (absurdityLevel === 3) {
      return ["TikTok", "Instagram Reels", "Twitter", "Reddit"];
    }
    
    return platforms;
  }

  // Merge experimental content with existing user content
  static mergeWithExistingContent(experimentalContent, existingContent) {
    const merged = { ...existingContent };
    
    // Preserve user's existing content but enhance with experimental elements
    Object.keys(experimentalContent).forEach(key => {
      if (!merged[key] || merged[key].trim() === '') {
        merged[key] = experimentalContent[key];
      } else {
        // Blend existing content with experimental elements
        if (key === 'scene') {
          merged[key] = `${merged[key]} with experimental twist: ${experimentalContent[key]}`;
        }
      }
    });

    return merged;
  }

  // Utility function to get random element from array
  static getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Get all available formats for UI
  static getAllFormats() {
    return Object.values(this.viralFormats);
  }

  // Get format by ID
  static getFormat(formatId) {
    return this.viralFormats[formatId];
  }
}

export default ExperimentalModeEngine;