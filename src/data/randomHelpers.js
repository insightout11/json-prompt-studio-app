// Randomization helper functions for dynamic scene content
export const randomHelpers = {
  // Get random item from array
  random: (array) => {
    if (!Array.isArray(array)) return array;
    return array[Math.floor(Math.random() * array.length)];
  },

  // Weather transitions
  weatherTransitions: [
    "sunny-to-storm", "fog-clearing", "rainbow-after-rain", 
    "clouds-parting", "mist-rolling-in", "golden-hour-approaching"
  ],

  // Crowd reactions
  crowdReactions: [
    "cheering wildly", "gasping in shock", "applauding enthusiastically", 
    "fleeing in panic", "watching in silence", "recording on phones"
  ],

  // Time pressures
  timePressures: [
    "countdown timer visible", "race against sunset", "before security arrives",
    "last train departure", "closing time approaching", "deadline looming"
  ],

  // Emotional beats
  emotionalBeats: [
    "triumph and victory", "heartbreak and loss", "shocking revelation", 
    "joyful reunion", "bitter confrontation", "peaceful resolution"
  ],

  // Plot twists
  plotTwists: [
    "unexpected ally appears", "hidden identity revealed", "false alarm realized",
    "perfect timing saves day", "secret motive exposed", "backup plan activated"
  ],

  // Intensity levels
  intensityLevels: ["subtle", "moderate", "dramatic", "explosive", "overwhelming"],

  // Pacing styles
  pacingStyles: [
    "slow-build tension", "constant pressure", "burst of action", 
    "rhythmic peaks", "escalating chaos", "sudden calm"
  ],

  // Meme-specific randomizers
  memeRandomizers: {
    intensityLevel: ["mild", "moderate", "extreme", "unhinged", "reality-breaking"],
    timing: ["perfect", "awkward", "too-late", "too-early", "accidentally-perfect"],
    audience: ["no-one", "small-group", "crowd", "entire-internet", "future-generations"],
    outcome: ["success", "failure", "chaos", "unexpected-win", "viral-fame"],
    emotion: ["joy", "cringe", "confusion", "enlightenment", "existential-dread"],
    context: ["work", "school", "family", "online", "public", "private-moment"],
    absurdityLevel: ["mildly-weird", "completely-unhinged", "reality-breaking", "fever-dream"],
    viralPotential: ["instant-classic", "sleeper-hit", "niche-appeal", "universal-relatable"]
  },

  // Character action types
  actionTypes: [
    "chasing", "escaping", "discovering", "confronting", "celebrating", 
    "hiding", "revealing", "protecting", "challenging", "creating"
  ],

  // Environmental chaos
  environmentalChaos: [
    "wind picking up", "lights flickering", "ground shaking", 
    "sirens approaching", "crowd gathering", "technology failing"
  ],

  // Social dynamics
  socialDynamics: [
    "power struggle", "role reversal", "alliance forming", 
    "betrayal unfolding", "leadership emerging", "unity building"
  ]
};

// Helper function to replace "random" placeholders in scene data
export const processRandomElements = (sceneData) => {
  const processed = JSON.parse(JSON.stringify(sceneData)); // Deep clone
  
  const processValue = (value) => {
    if (typeof value === 'string' && value.startsWith('random(')) {
      // Extract array from random() call
      const match = value.match(/random\(\[(.*?)\]\)/);
      if (match) {
        const options = match[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
        return randomHelpers.random(options);
      }
      
      // Handle simple "random" keyword
      if (value === 'random') {
        return 'dynamic-random-element';
      }
    }
    
    if (typeof value === 'object' && value !== null) {
      const result = {};
      for (const [key, val] of Object.entries(value)) {
        result[key] = processValue(val);
      }
      return result;
    }
    
    return value;
  };
  
  return processValue(processed);
};

export default randomHelpers;