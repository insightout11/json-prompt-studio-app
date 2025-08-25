import { create } from 'zustand';
import { schema } from './schema';
import { templates } from './templates';
// import { characterPresets } from './characterPresets';

const usePromptStore = create((set, get) => ({
  expandedCategories: new Set(),
  enabledFields: new Set(),
  fieldValues: {},
  // New state for detail management
  expandedDetails: new Set(), // Tracks which fields have their detail panels expanded
  detailValues: {}, // Stores detail field values (e.g., tattoo_style, tattoo_location, etc.)
  // Universal custom details for ALL fields
  customDetails: {}, // Stores custom description text for any field (e.g., { hair_color: "custom description" })
  expandedCustomDetails: new Set(), // Tracks which fields have custom detail areas expanded
  
  // Undo functionality
  undoStack: [], // Stack to store previous states for undo
  
  // Aspect ratio for video generation
  aspectRatio: '16:9',

  // Builder completion tracking and context for Storyboard Generator
  builderContext: {
    character: null,      // Completed character data from Character Builder
    world: null,          // Completed world data from World Builder  
    style: null,          // Completed style data from Style Builder
    scene: null,          // Current scene from Scene Builder
    lastUpdated: {},      // Track when each context was last updated
  },

  toggleCategory: (categoryId) => set((state) => {
    const newExpanded = new Set(state.expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    return { expandedCategories: newExpanded };
  }),

  toggleField: (fieldKey) => {
    const { saveStateForUndo } = get();
    saveStateForUndo(); // Save state before making changes
    
    set((state) => {
      const newEnabled = new Set(state.enabledFields);
      const newValues = { ...state.fieldValues };
      
      if (newEnabled.has(fieldKey)) {
        newEnabled.delete(fieldKey);
        delete newValues[fieldKey];
      } else {
        newEnabled.add(fieldKey);
        newValues[fieldKey] = '';
      }
      
      return { enabledFields: newEnabled, fieldValues: newValues };
    });
  },

  updateFieldValue: (fieldKey, value) => {
    const { saveStateForUndo } = get();
    saveStateForUndo(); // Save state before making changes
    
    set((state) => {
      const newFieldValues = {
        ...state.fieldValues,
        [fieldKey]: value
      };
    
    // Auto-expand Character Details when any character_type is selected
    let newExpandedCategories = state.expandedCategories;
    if (fieldKey === 'character_type' && value && value !== 'custom...') {
      newExpandedCategories = new Set(state.expandedCategories);
      newExpandedCategories.add('character_details');
    }
    
    // Auto-expand detail panel for certain complex selections
    let newExpandedDetails = state.expandedDetails;
    const autoExpandFields = [
      // Character details
      'tattoos', 'fantasy armor', 'sci-fi suit', 
      // Hair styles & colors
      'braids', 'long curly', 'ponytail', 'afro', 'rainbow', 'red', 'blonde', 'blue',
      // Body types
      'athletic', 'muscular', 'curvy', 'petite',
      // Actions
      'dancing', 'fighting', 'running', 'performing', 'creating',
      // Emotions
      'mysterious', 'confident', 'romantic', 'determined', 'heroic',
      // Camera movement & technical
      'tracking', 'dolly zoom', 'orbit',
      // Camera angles & distances
      'low angle', 'high angle', 'dutch angle', "bird's-eye",
      'close-up', 'extreme close-up', 'wide shot', 'establishing shot',
      // Depth of field & lenses
      'shallow', 'bokeh', 'rack focus', 'tilt-shift',
      'wide angle', 'telephoto', 'fisheye', 'anamorphic', 'macro',
      // Scene & Environment
      'beach', 'forest', 'city street', 'mountains', 'rooftop',
      'golden hour', 'blue hour', 'sunset', 'night', 'dawn',
      'stormy', 'foggy', 'rainy', 'snowy', 'windy', 'dramatic sky'
    ];
    if (autoExpandFields.includes(value)) {
      newExpandedDetails = new Set(state.expandedDetails);
      newExpandedDetails.add(fieldKey);
    }
    
      return {
        fieldValues: newFieldValues,
        expandedCategories: newExpandedCategories,
        expandedDetails: newExpandedDetails
      };
    });
  },

  // Simplified field value setter for external components like viral video generator
  setFieldValue: (fieldKey, value) => {
    const { saveStateForUndo } = get();
    saveStateForUndo(); // Save state before making changes
    
    set((state) => {
      const newEnabledFields = new Set([...state.enabledFields, fieldKey]);
      const newFieldValues = {
        ...state.fieldValues,
        [fieldKey]: value
      };
    
      return {
        enabledFields: newEnabledFields,
        fieldValues: newFieldValues
      };
    });
  },

  // New methods for detail management
  toggleDetailExpansion: (fieldKey) => set((state) => {
    const newExpandedDetails = new Set(state.expandedDetails);
    if (newExpandedDetails.has(fieldKey)) {
      newExpandedDetails.delete(fieldKey);
    } else {
      newExpandedDetails.add(fieldKey);
    }
    return { expandedDetails: newExpandedDetails };
  }),

  updateDetailValue: (detailKey, value) => set((state) => ({
    detailValues: {
      ...state.detailValues,
      [detailKey]: value
    }
  })),

  clearFieldDetails: (fieldKey) => set((state) => {
    const newExpandedDetails = new Set(state.expandedDetails);
    newExpandedDetails.delete(fieldKey);
    
    // Clear all detail values for this field
    const newDetailValues = { ...state.detailValues };
    Object.keys(newDetailValues).forEach(key => {
      if (key.startsWith(fieldKey.replace('_', '') + '_')) {
        delete newDetailValues[key];
      }
    });
    
    return {
      expandedDetails: newExpandedDetails,
      detailValues: newDetailValues
    };
  }),

  // Universal custom details methods
  toggleCustomDetailExpansion: (fieldKey) => set((state) => {
    const newExpandedCustomDetails = new Set(state.expandedCustomDetails);
    if (newExpandedCustomDetails.has(fieldKey)) {
      newExpandedCustomDetails.delete(fieldKey);
    } else {
      newExpandedCustomDetails.add(fieldKey);
    }
    return { expandedCustomDetails: newExpandedCustomDetails };
  }),

  updateCustomDetail: (fieldKey, value) => set((state) => ({
    customDetails: {
      ...state.customDetails,
      [fieldKey]: value
    }
  })),

  clearCustomDetail: (fieldKey) => set((state) => {
    const newCustomDetails = { ...state.customDetails };
    delete newCustomDetails[fieldKey];
    
    const newExpandedCustomDetails = new Set(state.expandedCustomDetails);
    newExpandedCustomDetails.delete(fieldKey);
    
    return {
      customDetails: newCustomDetails,
      expandedCustomDetails: newExpandedCustomDetails
    };
  }),

  getJsonOutput: () => {
    const { fieldValues, detailValues, customDetails, aspectRatio } = get();
    const filtered = {};
    
    // Consistency field keys that should go in advanced object
    const consistencyFields = [
      'seed', 'lock_identity', 'lock_style', 'creativity', 'palette', 'negative',
      'camera_lens_mm', 'camera_move', 'camera_speed', 'duration_s', 'fps'
    ];
    
    // Advanced object to hold consistency features
    const advanced = {};
    
    // Include main field values (excluding consistency fields)
    Object.entries(fieldValues).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        if (consistencyFields.includes(key)) {
          // Handle consistency fields specially
          if (key === 'negative' && value) {
            // Convert negative list to array if it's a string
            advanced.negative = value.split(',').map(item => item.trim()).filter(item => item);
          } else if (key === 'palette' && value) {
            // Convert palette to array of color codes
            advanced.palette = value.split(',').map(color => color.trim()).filter(color => color);
          } else if (key === 'camera_lens_mm' || key === 'camera_move' || key === 'camera_speed') {
            // Group camera settings
            if (!advanced.camera) advanced.camera = {};
            if (key === 'camera_lens_mm') advanced.camera.lens_mm = parseInt(value);
            else if (key === 'camera_move') advanced.camera.move = value;
            else if (key === 'camera_speed') advanced.camera.speed = value;
          } else if (key === 'duration_s' || key === 'fps') {
            // Group timing settings
            if (!advanced.timing) advanced.timing = {};
            if (key === 'duration_s') advanced.timing.duration_s = parseInt(value);
            else if (key === 'fps') advanced.timing.fps = parseInt(value);
          } else if (key === 'creativity') {
            // Map creativity to temperature
            if (!advanced.creativity) advanced.creativity = {};
            advanced.creativity.temperature = parseFloat(value);
          } else {
            // Direct mapping for seed, lock_identity, lock_style
            advanced[key] = key === 'seed' ? parseInt(value) : value;
          }
        } else {
          // Regular fields go in main object
          filtered[key] = value;
        }
      }
    });
    
    // Include detail values
    Object.entries(detailValues).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        filtered[key] = value;
      }
    });
    
    // Include custom details
    Object.entries(customDetails).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        filtered[`${key}_custom_details`] = value;
      }
    });
    
    // Include aspect ratio
    if (aspectRatio) {
      filtered.aspect_ratio = aspectRatio;
    }
    
    // Only include advanced object if it has content
    if (Object.keys(advanced).length > 0) {
      filtered.advanced = advanced;
    }
    
    return JSON.stringify(filtered, null, 2);
  },

  // Helper function to check if consistency features are active
  hasActiveConsistencyFeatures: () => {
    const { fieldValues } = get();
    const consistencyFields = [
      'seed', 'lock_identity', 'lock_style', 'creativity', 'palette', 'negative',
      'camera_lens_mm', 'camera_move', 'camera_speed', 'duration_s', 'fps'
    ];
    
    return consistencyFields.some(field => {
      const value = fieldValues[field];
      return value !== '' && value !== null && value !== undefined;
    });
  },

  // Helper function to check if locks are active specifically
  hasActiveLocks: () => {
    const { fieldValues } = get();
    return fieldValues.lock_identity === true || fieldValues.lock_style === true;
  },

  // Generate random seed
  generateRandomSeed: () => {
    const randomSeed = Math.floor(Math.random() * 999999) + 1;
    get().setFieldValue('seed', randomSeed);
    return randomSeed;
  },

  // Aspect ratio management
  setAspectRatio: (ratio) => set(() => ({
    aspectRatio: ratio
  })),

  // Advanced randomization system with scene coherence logic
  randomizeFields: () => {
    // Full Scene Builder - creates complete, logical scenes (20-30 fields)
    const { randomizeFullScene } = get();
    randomizeFullScene();
  },

  randomizeFullScene: () => {
    const allFields = [];
    
    // Collect all fields from schema
    schema.categories.forEach(category => {
      category.fields.forEach(field => {
        allFields.push({ ...field, categoryId: category.id });
      });
    });
    
    // Select 20-30 fields for a complete scene
    const numFieldsToSelect = Math.floor(Math.random() * 11) + 20;
    const shuffledFields = allFields.sort(() => 0.5 - Math.random());
    const selectedFields = shuffledFields.slice(0, numFieldsToSelect);
    
    const newEnabledFields = new Set();
    const newFieldValues = {};
    const newExpandedCategories = new Set();
    
    // Scene coherence variables
    let selectedSetting = null;
    let selectedTimeOfDay = null;
    let selectedWeather = null;
    
    selectedFields.forEach(field => {
      newEnabledFields.add(field.key);
      newExpandedCategories.add(field.categoryId);
      
      let randomValue = get().generateSmartFieldValue(field, selectedSetting, selectedTimeOfDay, selectedWeather);
      
      // Track key environmental choices for coherence
      if (field.key === 'setting') selectedSetting = randomValue;
      if (field.key === 'time_of_day') selectedTimeOfDay = randomValue;
      if (field.key === 'weather') selectedWeather = randomValue;
      
      newFieldValues[field.key] = randomValue;
    });
    
    set({
      enabledFields: newEnabledFields,
      fieldValues: newFieldValues,
      expandedCategories: newExpandedCategories
    });
  },

  randomizeLocationBased: () => {
    // Import scene presets
    import('./scenePresetsData.js').then(({ scenePresets, sceneCategories }) => {
      // Pick a random location preset first
      const presetKeys = Object.keys(scenePresets);
      const randomPresetKey = presetKeys[Math.floor(Math.random() * presetKeys.length)];
      const locationPreset = scenePresets[randomPresetKey];
      
      // Apply the location preset
      const { applyScenePresetData } = get();
      applyScenePresetData(locationPreset);
      
      // Add 8-15 additional compatible fields
      const allFields = [];
      schema.categories.forEach(category => {
        category.fields.forEach(field => {
          allFields.push({ ...field, categoryId: category.id });
        });
      });
      
      // Filter out fields already set by preset
      const availableFields = allFields.filter(field => 
        !locationPreset.fields.hasOwnProperty(field.key)
      );
      
      const numAdditionalFields = Math.floor(Math.random() * 8) + 8;
      const shuffledFields = availableFields.sort(() => 0.5 - Math.random());
      const additionalFields = shuffledFields.slice(0, numAdditionalFields);
      
      const { enabledFields, fieldValues, expandedCategories } = get();
      const newEnabledFields = new Set([...enabledFields]);
      const newFieldValues = { ...fieldValues };
      const newExpandedCategories = new Set([...expandedCategories]);
      
      additionalFields.forEach(field => {
        newEnabledFields.add(field.key);
        newExpandedCategories.add(field.categoryId);
        
        const compatibleValue = get().generateLocationCompatibleValue(
          field, 
          locationPreset.fields.setting,
          locationPreset.fields.time_of_day,
          locationPreset.fields.weather
        );
        
        newFieldValues[field.key] = compatibleValue;
      });
      
      set({
        enabledFields: newEnabledFields,
        fieldValues: newFieldValues,
        expandedCategories: newExpandedCategories
      });
    });
  },

  randomizeCinematicStyle: () => {
    // Focus on camera, lighting, and visual style (12-18 fields)
    const cinematicCategories = ['camera_details', 'visual_style', 'lighting', 'motion_timing'];
    const cinematicFields = [];
    
    schema.categories.forEach(category => {
      if (cinematicCategories.includes(category.id)) {
        category.fields.forEach(field => {
          cinematicFields.push({ ...field, categoryId: category.id });
        });
      }
    });
    
    // Add some scene fields for context
    const sceneFields = [];
    schema.categories.forEach(category => {
      if (category.id === 'scene_description') {
        category.fields.forEach(field => {
          sceneFields.push({ ...field, categoryId: category.id });
        });
      }
    });
    
    // Select 12-18 fields with emphasis on cinematic elements
    const numCinematicFields = Math.floor(Math.random() * 7) + 12;
    const cinematicSelection = cinematicFields.sort(() => 0.5 - Math.random()).slice(0, Math.floor(numCinematicFields * 0.7));
    const sceneSelection = sceneFields.sort(() => 0.5 - Math.random()).slice(0, Math.floor(numCinematicFields * 0.3));
    
    const selectedFields = [...cinematicSelection, ...sceneSelection];
    
    const newEnabledFields = new Set();
    const newFieldValues = {};
    const newExpandedCategories = new Set();
    
    selectedFields.forEach(field => {
      newEnabledFields.add(field.key);
      newExpandedCategories.add(field.categoryId);
      
      let randomValue = get().generateCinematicValue(field);
      newFieldValues[field.key] = randomValue;
    });
    
    set({
      enabledFields: newEnabledFields,
      fieldValues: newFieldValues,
      expandedCategories: newExpandedCategories
    });
  },

  randomizeEnvironmental: () => {
    // Focus on environmental and atmospheric elements (15-22 fields)
    const environmentalCategories = ['scene_description', 'lighting', 'subjects'];
    const environmentalFields = [];
    
    schema.categories.forEach(category => {
      if (environmentalCategories.includes(category.id)) {
        category.fields.forEach(field => {
          environmentalFields.push({ ...field, categoryId: category.id });
        });
      }
    });
    
    const numFields = Math.floor(Math.random() * 8) + 15;
    const selectedFields = environmentalFields.sort(() => 0.5 - Math.random()).slice(0, numFields);
    
    const newEnabledFields = new Set();
    const newFieldValues = {};
    const newExpandedCategories = new Set();
    
    // Generate a cohesive environment first
    const environments = ['urban', 'nature', 'indoor', 'night', 'day', 'stormy', 'peaceful'];
    const chosenEnvironment = environments[Math.floor(Math.random() * environments.length)];
    
    selectedFields.forEach(field => {
      newEnabledFields.add(field.key);
      newExpandedCategories.add(field.categoryId);
      
      let randomValue = get().generateEnvironmentalValue(field, chosenEnvironment);
      newFieldValues[field.key] = randomValue;
    });
    
    set({
      enabledFields: newEnabledFields,
      fieldValues: newFieldValues,
      expandedCategories: newExpandedCategories
    });
  },

  randomizeTechnicalSetup: () => {
    // Focus on technical camera and production elements (10-16 fields)
    const technicalCategories = ['camera_details', 'motion_timing'];
    const technicalFields = [];
    
    schema.categories.forEach(category => {
      if (technicalCategories.includes(category.id)) {
        category.fields.forEach(field => {
          technicalFields.push({ ...field, categoryId: category.id });
        });
      }
    });
    
    const numFields = Math.floor(Math.random() * 7) + 10;
    const selectedFields = technicalFields.sort(() => 0.5 - Math.random()).slice(0, numFields);
    
    const newEnabledFields = new Set();
    const newFieldValues = {};
    const newExpandedCategories = new Set();
    
    selectedFields.forEach(field => {
      newEnabledFields.add(field.key);
      newExpandedCategories.add(field.categoryId);
      
      let randomValue = get().generateTechnicalValue(field);
      newFieldValues[field.key] = randomValue;
    });
    
    set({
      enabledFields: newEnabledFields,
      fieldValues: newFieldValues,
      expandedCategories: newExpandedCategories
    });
  },

  // Smart value generation with scene coherence logic
  generateSmartFieldValue: (field, setting, timeOfDay, weather) => {
    if (field.type === 'select' && field.options) {
      const validOptions = field.options.filter(option => option !== 'custom...');
      
      // Apply location-appropriate filtering
      if (setting && get().isLocationSpecificField(field.key)) {
        const compatibleOptions = get().getLocationCompatibleOptions(field.key, setting, validOptions);
        if (compatibleOptions.length > 0) {
          return compatibleOptions[Math.floor(Math.random() * compatibleOptions.length)];
        }
      }
      
      // Apply time-of-day filtering
      if (timeOfDay && get().isTimeSpecificField(field.key)) {
        const timeCompatibleOptions = get().getTimeCompatibleOptions(field.key, timeOfDay, validOptions);
        if (timeCompatibleOptions.length > 0) {
          return timeCompatibleOptions[Math.floor(Math.random() * timeCompatibleOptions.length)];
        }
      }
      
      // Apply weather filtering
      if (weather && get().isWeatherSpecificField(field.key)) {
        const weatherCompatibleOptions = get().getWeatherCompatibleOptions(field.key, weather, validOptions);
        if (weatherCompatibleOptions.length > 0) {
          return weatherCompatibleOptions[Math.floor(Math.random() * weatherCompatibleOptions.length)];
        }
      }
      
      // Fallback to any valid option
      if (validOptions.length > 0) {
        return validOptions[Math.floor(Math.random() * validOptions.length)];
      }
    } else if (field.type === 'number') {
      return Math.floor(Math.random() * 10) + 1;
    } else if (field.type === 'textarea') {
      return get().generateDetailedSceneDescription(setting, timeOfDay, weather);
    }
    
    return '';
  },

  generateLocationCompatibleValue: (field, setting, timeOfDay, weather) => {
    return get().generateSmartFieldValue(field, setting, timeOfDay, weather);
  },

  generateCinematicValue: (field) => {
    if (field.type === 'select' && field.options) {
      const validOptions = field.options.filter(option => option !== 'custom...');
      
      // Prefer cinematic options
      const cinematicPreferences = {
        camera_angle: ['low angle', 'high angle', 'dutch angle'],
        camera_distance: ['close-up', 'wide shot', 'establishing shot'],
        lens_type: ['wide angle', 'telephoto', 'anamorphic'],
        depth_of_field: ['shallow', 'bokeh', 'rack focus'],
        lighting_type: ['dramatic', 'golden hour', 'blue hour', 'rim lighting'],
        style: ['cinematic', 'dramatic', 'epic']
      };
      
      if (cinematicPreferences[field.key]) {
        const preferred = cinematicPreferences[field.key].filter(pref => validOptions.includes(pref));
        if (preferred.length > 0) {
          return preferred[Math.floor(Math.random() * preferred.length)];
        }
      }
      
      return validOptions[Math.floor(Math.random() * validOptions.length)];
    }
    
    return get().generateSmartFieldValue(field, null, null, null);
  },

  generateEnvironmentalValue: (field, environment) => {
    if (field.type === 'select' && field.options) {
      const validOptions = field.options.filter(option => option !== 'custom...');
      
      const environmentalPreferences = {
        urban: {
          setting: ['city street', 'rooftop', 'downtown plaza', 'office'],
          lighting_type: ['neon', 'street lighting', 'fluorescent'],
          environmental_details: ['traffic sounds', 'city noise', 'urban atmosphere']
        },
        nature: {
          setting: ['forest', 'beach', 'mountains', 'meadow', 'lake'],
          lighting_type: ['natural', 'golden hour', 'dappled sunlight'],
          environmental_details: ['wind', 'bird songs', 'natural sounds']
        },
        indoor: {
          setting: ['coffee shop', 'library', 'restaurant', 'office', 'bedroom'],
          lighting_type: ['warm ambient', 'soft overhead', 'intimate warm'],
          environmental_details: ['quiet ambiance', 'indoor comfort']
        }
      };
      
      if (environmentalPreferences[environment] && environmentalPreferences[environment][field.key]) {
        const preferred = environmentalPreferences[environment][field.key].filter(pref => validOptions.includes(pref));
        if (preferred.length > 0) {
          return preferred[Math.floor(Math.random() * preferred.length)];
        }
      }
      
      return validOptions[Math.floor(Math.random() * validOptions.length)];
    }
    
    return get().generateSmartFieldValue(field, null, null, null);
  },

  generateTechnicalValue: (field) => {
    if (field.type === 'select' && field.options) {
      const validOptions = field.options.filter(option => option !== 'custom...');
      return validOptions[Math.floor(Math.random() * validOptions.length)];
    }
    
    return get().generateSmartFieldValue(field, null, null, null);
  },

  // Utility functions for scene coherence
  isLocationSpecificField: (fieldKey) => {
    return ['clothing', 'actions', 'environmental_details', 'camera_distance'].includes(fieldKey);
  },

  isTimeSpecificField: (fieldKey) => {
    return ['lighting_type', 'color_palette', 'environmental_details'].includes(fieldKey);
  },

  isWeatherSpecificField: (fieldKey) => {
    return ['clothing', 'environmental_details', 'lighting_type'].includes(fieldKey);
  },

  getLocationCompatibleOptions: (fieldKey, setting, options) => {
    const locationCompatibility = {
      beach: {
        clothing: ['swimwear', 'casual summer', 'light clothing'],
        actions: ['swimming', 'surfing', 'walking', 'relaxing'],
        environmental_details: ['ocean breeze', 'wave sounds', 'sandy texture'],
        camera_distance: ['wide shot', 'medium shot', 'establishing shot']
      },
      forest: {
        clothing: ['outdoor gear', 'hiking attire', 'natural colors'],
        actions: ['hiking', 'walking', 'exploring', 'camping'],
        environmental_details: ['rustling leaves', 'bird songs', 'forest sounds'],
        camera_distance: ['medium shot', 'close-up', 'tracking shot']
      }
      // Add more location compatibility rules as needed
    };
    
    if (locationCompatibility[setting] && locationCompatibility[setting][fieldKey]) {
      return options.filter(option => 
        locationCompatibility[setting][fieldKey].some(compatible => 
          option.toLowerCase().includes(compatible.toLowerCase())
        )
      );
    }
    
    return options;
  },

  getTimeCompatibleOptions: (fieldKey, timeOfDay, options) => {
    const timeCompatibility = {
      'golden hour': {
        lighting_type: ['golden hour', 'warm sunlight', 'dramatic side lighting'],
        color_palette: ['warm golden', 'sunset oranges', 'warm tones']
      },
      'blue hour': {
        lighting_type: ['blue hour', 'twilight', 'ambient evening'],
        color_palette: ['cool blues', 'twilight purples', 'moody tones']
      },
      night: {
        lighting_type: ['neon', 'street lighting', 'dramatic artificial'],
        color_palette: ['neon colors', 'night blues', 'dramatic contrasts']
      }
    };
    
    if (timeCompatibility[timeOfDay] && timeCompatibility[timeOfDay][fieldKey]) {
      return options.filter(option => 
        timeCompatibility[timeOfDay][fieldKey].some(compatible => 
          option.toLowerCase().includes(compatible.toLowerCase())
        )
      );
    }
    
    return options;
  },

  getWeatherCompatibleOptions: (fieldKey, weather, options) => {
    const weatherCompatibility = {
      rainy: {
        clothing: ['raincoat', 'waterproof', 'umbrella'],
        environmental_details: ['rain sounds', 'wet surfaces', 'puddles'],
        lighting_type: ['overcast', 'moody', 'dramatic']
      },
      sunny: {
        clothing: ['light clothing', 'summer wear', 'sunglasses'],
        environmental_details: ['bright sunshine', 'clear skies', 'warm atmosphere'],
        lighting_type: ['bright sunlight', 'natural daylight', 'golden hour']
      }
    };
    
    if (weatherCompatibility[weather] && weatherCompatibility[weather][fieldKey]) {
      return options.filter(option => 
        weatherCompatibility[weather][fieldKey].some(compatible => 
          option.toLowerCase().includes(compatible.toLowerCase())
        )
      );
    }
    
    return options;
  },

  generateDetailedSceneDescription: (setting, timeOfDay, weather) => {
    const sceneTemplates = {
      'beach-sunny-day': 'Wide sandy beach with crystal clear turquoise water, gentle waves lapping the shore, bright blue sky with scattered white clouds, warm golden sand, and the sound of seabirds in the distance',
      'forest-morning-clear': 'Misty forest path winding through tall pine trees, dappled morning sunlight filtering through the canopy, moss-covered ground, dewdrops on ferns, and the peaceful sounds of awakening nature',
      'city-night-clear': 'Bustling city street illuminated by neon signs and street lights, reflections on wet pavement, moving traffic creating light trails, towering skyscrapers against the night sky',
      'rooftop-sunset-clear': 'Modern rooftop terrace overlooking city skyline, golden hour light casting long shadows, glass railings reflecting the setting sun, comfortable outdoor furniture, urban sprawl extending to the horizon'
    };
    
    // Try to find a specific template
    const templateKey = `${setting}-${timeOfDay}-${weather}`.replace(/\s+/g, '-').toLowerCase();
    if (sceneTemplates[templateKey]) {
      return sceneTemplates[templateKey];
    }
    
    // Fallback to generic detailed descriptions
    const genericTemplates = [
      'Carefully composed scene with rich environmental details, atmospheric lighting, and engaging visual elements that draw the viewer into the narrative',
      'Dynamic environment with layered visual depth, natural lighting transitions, and authentic atmospheric elements that enhance the storytelling',
      'Immersive setting with thoughtful attention to environmental storytelling, mood-appropriate lighting, and realistic details that create emotional connection',
      'Compelling visual scene with natural movement, organic lighting, and environmental elements that support the narrative focus and emotional tone'
    ];
    
    return genericTemplates[Math.floor(Math.random() * genericTemplates.length)];
  },

  // Save current state for undo functionality
  saveStateForUndo: () => {
    const state = get();
    const currentState = {
      enabledFields: new Set(state.enabledFields),
      fieldValues: { ...state.fieldValues },
      expandedCategories: new Set(state.expandedCategories),
      expandedDetails: new Set(state.expandedDetails),
      detailValues: { ...state.detailValues },
      customDetails: { ...state.customDetails },
      expandedCustomDetails: new Set(state.expandedCustomDetails)
    };
    
    set((state) => ({
      undoStack: [...state.undoStack.slice(-9), currentState] // Keep last 10 states
    }));
  },
  
  // Undo last action
  undo: () => {
    const state = get();
    if (state.undoStack.length > 0) {
      const previousState = state.undoStack[state.undoStack.length - 1];
      const newUndoStack = state.undoStack.slice(0, -1);
      
      set({
        enabledFields: previousState.enabledFields,
        fieldValues: previousState.fieldValues,
        expandedCategories: previousState.expandedCategories,
        expandedDetails: previousState.expandedDetails,
        detailValues: previousState.detailValues,
        customDetails: previousState.customDetails,
        expandedCustomDetails: previousState.expandedCustomDetails,
        undoStack: newUndoStack
      });
      
      return true; // Successfully undid
    }
    return false; // Nothing to undo
  },
  
  clearAll: () => {
    const { saveStateForUndo } = get();
    saveStateForUndo(); // Save state before clearing
    
    set({
      enabledFields: new Set(),
      fieldValues: {},
      expandedCategories: new Set(),
      expandedDetails: new Set(),
      detailValues: {},
      customDetails: {},
      expandedCustomDetails: new Set()
    });
  },

  applyTemplate: (templateKey, level = 2) => {
    const template = templates[templateKey];
    if (!template || !template.levels[level]) return;

    const templateFields = template.levels[level].fields;
    const newEnabledFields = new Set();
    const newFieldValues = {};
    const newExpandedCategories = new Set();

    // Find which categories contain the template fields and expand them
    schema.categories.forEach(category => {
      let categoryHasTemplateFields = false;
      
      category.fields.forEach(field => {
        if (templateFields.hasOwnProperty(field.key)) {
          newEnabledFields.add(field.key);
          newFieldValues[field.key] = templateFields[field.key];
          categoryHasTemplateFields = true;
        }
      });

      if (categoryHasTemplateFields) {
        newExpandedCategories.add(category.id);
      }
    });

    // Merge with existing state (don't override existing user selections)
    const { enabledFields, fieldValues, expandedCategories } = get();
    
    const mergedEnabledFields = new Set([...enabledFields, ...newEnabledFields]);
    const mergedFieldValues = { ...fieldValues, ...newFieldValues };
    const mergedExpandedCategories = new Set([...expandedCategories, ...newExpandedCategories]);

    set({
      enabledFields: mergedEnabledFields,
      fieldValues: mergedFieldValues,
      expandedCategories: mergedExpandedCategories
    });
  },

  getTemplatePreview: (templateKey, level = 2) => {
    const template = templates[templateKey];
    if (!template || !template.levels[level]) return null;

    const templateFields = template.levels[level].fields;
    const fieldCount = Object.keys(templateFields).length;
    const categoriesAffected = new Set();

    // Find which categories will be affected
    schema.categories.forEach(category => {
      category.fields.forEach(field => {
        if (templateFields.hasOwnProperty(field.key)) {
          categoriesAffected.add(category.label);
        }
      });
    });

    return {
      name: template.name,
      level: template.levels[level].name,
      description: template.levels[level].description,
      fieldCount,
      categoriesAffected: Array.from(categoriesAffected),
      fields: templateFields
    };
  },

  // Character Presets System
  applyCharacterPresetData: (presetData) => {
    const newEnabledFields = new Set();
    const newFieldValues = {};
    const newExpandedCategories = new Set();
    const newCustomDetails = {};

    // Apply preset field values
    Object.entries(presetData.fields).forEach(([key, value]) => {
      newEnabledFields.add(key);
      newFieldValues[key] = value;
    });

    // Add custom details if present
    if (presetData.customDetails) {
      // Find the primary character field to attach custom details to
      const primaryField = presetData.fields.character_type ? 'character_type' : 
                          presetData.fields.clothing ? 'clothing' :
                          Object.keys(presetData.fields)[0];
      
      if (primaryField) {
        newCustomDetails[primaryField] = presetData.customDetails;
      }
    }

    // Find which categories contain the preset fields and expand them
    schema.categories.forEach(category => {
      let categoryHasPresetFields = false;
      
      category.fields.forEach(field => {
        if (presetData.fields.hasOwnProperty(field.key)) {
          categoryHasPresetFields = true;
        }
      });

      if (categoryHasPresetFields) {
        newExpandedCategories.add(category.id);
      }
    });

    // Auto-expand character details when character preset is applied
    newExpandedCategories.add('character_details');

    // Merge with existing state (don't override existing user selections)
    const { enabledFields, fieldValues, expandedCategories, customDetails } = get();
    
    const mergedEnabledFields = new Set([...enabledFields, ...newEnabledFields]);
    const mergedFieldValues = { ...fieldValues, ...newFieldValues };
    const mergedExpandedCategories = new Set([...expandedCategories, ...newExpandedCategories]);
    const mergedCustomDetails = { ...customDetails, ...newCustomDetails };

    set({
      enabledFields: mergedEnabledFields,
      fieldValues: mergedFieldValues,
      expandedCategories: mergedExpandedCategories,
      customDetails: mergedCustomDetails
    });
  },

  // Scene Presets System
  applyScenePresetData: (presetData) => {
    const newEnabledFields = new Set();
    const newFieldValues = {};
    const newExpandedCategories = new Set();
    const newCustomDetails = {};

    // Apply preset field values
    Object.entries(presetData.fields).forEach(([key, value]) => {
      newEnabledFields.add(key);
      newFieldValues[key] = value;
    });

    // Add custom details if present
    if (presetData.customDetails) {
      // Find the primary scene field to attach custom details to
      const primaryField = presetData.fields.scene ? 'scene' : 
                          presetData.fields.setting ? 'setting' :
                          Object.keys(presetData.fields)[0];
      
      if (primaryField) {
        newCustomDetails[primaryField] = presetData.customDetails;
      }
    }

    // Find which categories contain the preset fields and expand them
    schema.categories.forEach(category => {
      let categoryHasPresetFields = false;
      
      category.fields.forEach(field => {
        if (presetData.fields.hasOwnProperty(field.key)) {
          categoryHasPresetFields = true;
        }
      });

      if (categoryHasPresetFields) {
        newExpandedCategories.add(category.id);
      }
    });

    // Auto-expand scene-related categories
    newExpandedCategories.add('scene_description');
    newExpandedCategories.add('camera_details');
    newExpandedCategories.add('visual_style');

    // Merge with existing state (don't override existing user selections)
    const { enabledFields, fieldValues, expandedCategories, customDetails } = get();
    
    const mergedEnabledFields = new Set([...enabledFields, ...newEnabledFields]);
    const mergedFieldValues = { ...fieldValues, ...newFieldValues };
    const mergedExpandedCategories = new Set([...expandedCategories, ...newExpandedCategories]);
    const mergedCustomDetails = { ...customDetails, ...newCustomDetails };

    set({
      enabledFields: mergedEnabledFields,
      fieldValues: mergedFieldValues,
      expandedCategories: mergedExpandedCategories,
      customDetails: mergedCustomDetails
    });
  },

  // Enhanced Randomization Methods
  randomizeCharacterFields: () => {
    console.log('🎲 randomizeCharacterFields called!');
    const characterCategories = ['subjects', 'character_details'];
    const characterFields = [];
    
    // Collect character-related fields
    schema.categories.forEach(category => {
      if (characterCategories.includes(category.id)) {
        category.fields.forEach(field => {
          characterFields.push({ ...field, categoryId: category.id });
        });
      }
    });
    
    const newEnabledFields = new Set();
    const newFieldValues = {};
    const newExpandedCategories = new Set();
    
    // First, ensure character_type is set to enable dependent fields
    const characterTypeField = characterFields.find(f => f.key === 'character_type');
    if (characterTypeField && characterTypeField.options) {
      const validCharacterTypes = characterTypeField.options.filter(option => option !== 'custom...');
      if (validCharacterTypes.length > 0) {
        const randomCharacterType = validCharacterTypes[Math.floor(Math.random() * validCharacterTypes.length)];
        newEnabledFields.add('character_type');
        newFieldValues['character_type'] = randomCharacterType;
        newExpandedCategories.add('subjects');
      }
    }
    
    // Filter fields based on dependencies
    const availableFields = characterFields.filter(field => {
      if (!field.dependency || !field.dependsOn) {
        return true; // No dependency, always available
      }
      
      // Check if dependency is satisfied
      const dependencyValue = newFieldValues[field.dependency];
      return dependencyValue && field.dependsOn.includes(dependencyValue);
    });
    
    // Randomly select 3-8 more character fields
    const numFieldsToSelect = Math.floor(Math.random() * 6) + 3;
    const shuffledFields = availableFields
      .filter(f => f.key !== 'character_type') // Exclude character_type since we already set it
      .sort(() => 0.5 - Math.random());
    const selectedFields = shuffledFields.slice(0, numFieldsToSelect);
    
    selectedFields.forEach(field => {
      newEnabledFields.add(field.key);
      newExpandedCategories.add(field.categoryId);
      
      // Generate random value
      let randomValue = '';
      if (field.type === 'select' && field.options) {
        const validOptions = field.options.filter(option => option !== 'custom...');
        if (validOptions.length > 0) {
          randomValue = validOptions[Math.floor(Math.random() * validOptions.length)];
        }
      }
      newFieldValues[field.key] = randomValue;
    });
    
    // Merge with existing state
    const { enabledFields, fieldValues, expandedCategories } = get();
    
    set({
      enabledFields: new Set([...enabledFields, ...newEnabledFields]),
      fieldValues: { ...fieldValues, ...newFieldValues },
      expandedCategories: new Set([...expandedCategories, ...newExpandedCategories])
    });
  },

  randomizeSceneFields: () => {
    const sceneCategories = ['scene_description', 'camera_details', 'visual_style', 'lighting', 'motion_timing'];
    const sceneFields = [];
    
    // Collect scene-related fields
    schema.categories.forEach(category => {
      if (sceneCategories.includes(category.id)) {
        category.fields.forEach(field => {
          sceneFields.push({ ...field, categoryId: category.id });
        });
      }
    });
    
    // Randomly select 4-10 scene fields
    const numFieldsToSelect = Math.floor(Math.random() * 7) + 4;
    const shuffledFields = sceneFields.sort(() => 0.5 - Math.random());
    const selectedFields = shuffledFields.slice(0, numFieldsToSelect);
    
    const newEnabledFields = new Set();
    const newFieldValues = {};
    const newExpandedCategories = new Set();
    
    selectedFields.forEach(field => {
      newEnabledFields.add(field.key);
      newExpandedCategories.add(field.categoryId);
      
      // Generate random value
      let randomValue = '';
      if (field.type === 'select' && field.options) {
        const validOptions = field.options.filter(option => option !== 'custom...');
        if (validOptions.length > 0) {
          randomValue = validOptions[Math.floor(Math.random() * validOptions.length)];
        }
      } else if (field.type === 'textarea') {
        const sceneTemplates = [
          'A mysterious figure walking through a foggy landscape',
          'Vibrant colors dancing in slow motion',
          'An intimate conversation between two characters',
          'Dynamic action sequence with dramatic lighting',
          'Peaceful natural setting with gentle movement'
        ];
        randomValue = sceneTemplates[Math.floor(Math.random() * sceneTemplates.length)];
      }
      newFieldValues[field.key] = randomValue;
    });
    
    // Merge with existing state
    const { enabledFields, fieldValues, expandedCategories } = get();
    
    set({
      enabledFields: new Set([...enabledFields, ...newEnabledFields]),
      fieldValues: { ...fieldValues, ...newFieldValues },
      expandedCategories: new Set([...expandedCategories, ...newExpandedCategories])
    });
  },

  // Save/Load System
  savedCharacters: JSON.parse(localStorage.getItem('savedCharacters') || '[]'),
  savedScenes: JSON.parse(localStorage.getItem('savedScenes') || '[]'),
  savedScenePacks: JSON.parse(localStorage.getItem('savedScenePacks') || '[]'),
  savedActions: JSON.parse(localStorage.getItem('savedActions') || '[]'),
  savedSettings: JSON.parse(localStorage.getItem('savedSettings') || '[]'),
  savedStyles: JSON.parse(localStorage.getItem('savedStyles') || '[]'),
  savedAudio: JSON.parse(localStorage.getItem('savedAudio') || '[]'),

  // Template Usage Tracking
  templateUsage: JSON.parse(localStorage.getItem('templateUsage') || '{}'),

  // Project Management System
  projects: JSON.parse(localStorage.getItem('projects') || '[]'),
  currentProject: JSON.parse(localStorage.getItem('currentProject') || 'null'),

  saveCharacter: (name, projectIds = []) => {
    const { fieldValues, savedCharacters, currentProject } = get();
    
    // Extract character-related fields
    const characterFields = {};
    const characterKeys = ['character_type', 'gender', 'age_range', 'ethnicity', 'body_type', 'hair_color', 
                          'hair_style', 'eye_color', 'skin_tone', 'distinguishing_features',
                          'animal_species', 'animal_color', 'robot_style', 'robot_material',
                          'stylized_style', 'object_type', 'clothing', 'actions', 'emotions'];
    
    characterKeys.forEach(key => {
      if (fieldValues[key]) {
        characterFields[key] = fieldValues[key];
      }
    });

    // Auto-assign to current project if no projects specified and current project exists
    const finalProjectIds = projectIds.length === 0 && currentProject 
      ? [currentProject.id] 
      : projectIds;

    const newCharacter = {
      id: Date.now().toString(),
      name: name || `Character ${savedCharacters.length + 1}`,
      timestamp: Date.now(),
      data: characterFields,
      projectIds: finalProjectIds
    };

    const updatedCharacters = [...savedCharacters, newCharacter].slice(-20); // Keep last 20
    localStorage.setItem('savedCharacters', JSON.stringify(updatedCharacters));
    
    set({ savedCharacters: updatedCharacters });
    return newCharacter.id;
  },

  saveScene: (name, projectIds = []) => {
    const { fieldValues, savedScenes, currentProject } = get();
    
    // Auto-assign to current project if no projects specified and current project exists
    const finalProjectIds = projectIds.length === 0 && currentProject 
      ? [currentProject.id] 
      : projectIds;
    
    const newScene = {
      id: Date.now().toString(),
      name: name || `Scene ${savedScenes.length + 1}`,
      timestamp: Date.now(),
      data: { ...fieldValues },
      projectIds: finalProjectIds
    };

    const updatedScenes = [...savedScenes, newScene].slice(-20); // Keep last 20
    localStorage.setItem('savedScenes', JSON.stringify(updatedScenes));
    
    set({ savedScenes: updatedScenes });
    return newScene.id;
  },

  loadCharacter: (characterId) => {
    const { savedCharacters } = get();
    const character = savedCharacters.find(c => c.id === characterId);
    
    if (import.meta && import.meta.env && import.meta.env.DEV) {
      console.log('Loading character ID:', characterId);
      console.log('Found character:', character);
    }
    
    if (character) {
      const newEnabledFields = new Set();
      const newExpandedCategories = new Set();
      
      // Enable fields and expand categories for character data
      Object.keys(character.data).forEach(key => {
        newEnabledFields.add(key);
        
        // Find which category this field belongs to and expand it
        schema.categories.forEach(category => {
          if (category.fields.some(field => field.key === key)) {
            newExpandedCategories.add(category.id);
          }
        });
      });

      if (import.meta && import.meta.env && import.meta.env.DEV) {
        console.log('Setting field values:', character.data);
        console.log('Enabled fields:', newEnabledFields);
      }

      set({
        fieldValues: { ...character.data },
        enabledFields: newEnabledFields,
        expandedCategories: newExpandedCategories
      });
    } else {
      if (import.meta && import.meta.env && import.meta.env.DEV) {
        console.log('Character not found with ID:', characterId);
        console.log('Available characters:', savedCharacters);
      }
    }
  },

  // Add character to scene (append to existing characters)
  addCharacterToScene: (characterId) => {
    const { savedCharacters, fieldValues, setFieldValue } = get();
    const character = savedCharacters.find(c => c.id === characterId);
    
    if (!character) return;
    
    // Get character's key information for secondary subjects
    const characterInfo = [];
    if (character.data.character_name) {
      characterInfo.push(character.data.character_name);
    }
    if (character.data.character_type && character.data.character_type !== 'custom...') {
      characterInfo.push(character.data.character_type);
    }
    if (character.data.age_range && character.data.age_range !== 'custom...') {
      characterInfo.push(character.data.age_range);
    }
    if (character.data.gender && character.data.gender !== 'custom...') {
      characterInfo.push(character.data.gender);
    }
    
    // Create character description
    const newCharacterDesc = characterInfo.length > 0 ? characterInfo.join(', ') : character.name;
    
    // Add to secondary_subjects field
    const currentSecondary = fieldValues.secondary_subjects || '';
    const updatedSecondary = currentSecondary 
      ? `${currentSecondary}, ${newCharacterDesc}`
      : newCharacterDesc;
    
    setFieldValue('secondary_subjects', updatedSecondary);
    
    // Update number_of_subjects if it exists
    const currentSubjects = fieldValues.secondary_subjects || '';
    const totalSubjects = currentSubjects.split(',').filter(s => s.trim()).length + 1; // +1 for main character
    setFieldValue('number_of_subjects', totalSubjects);
    
    // Enable relevant fields
    const newEnabledFields = new Set(get().enabledFields);
    newEnabledFields.add('secondary_subjects');
    newEnabledFields.add('number_of_subjects');
    
    // Expand character category
    const newExpandedCategories = new Set(get().expandedCategories);
    newExpandedCategories.add('characters');
    
    set({
      enabledFields: newEnabledFields,
      expandedCategories: newExpandedCategories
    });
  },

  // New method for character loading with merge options
  loadCharacterWithMergeMode: (characterId, mode = 'replace') => {
    if (mode === 'add') {
      // Use existing addCharacterToScene logic
      get().addCharacterToScene(characterId);
    } else {
      // Use existing loadCharacter logic (replace mode)
      get().loadCharacter(characterId);
    }
  },

  loadScene: (sceneId) => {
    const { savedScenes } = get();
    const scene = savedScenes.find(s => s.id === sceneId);
    
    if (scene) {
      const newEnabledFields = new Set();
      const newExpandedCategories = new Set();
      
      // Enable fields and expand categories for scene data
      Object.keys(scene.data).forEach(key => {
        newEnabledFields.add(key);
        
        // Find which category this field belongs to and expand it
        schema.categories.forEach(category => {
          if (category.fields.some(field => field.key === key)) {
            newExpandedCategories.add(category.id);
          }
        });
      });

      set({
        fieldValues: { ...scene.data },
        enabledFields: newEnabledFields,
        expandedCategories: newExpandedCategories
      });
    }
  },

  deleteCharacter: (characterId) => {
    const { savedCharacters } = get();
    const updatedCharacters = savedCharacters.filter(c => c.id !== characterId);
    localStorage.setItem('savedCharacters', JSON.stringify(updatedCharacters));
    set({ savedCharacters: updatedCharacters });
  },

  deleteScene: (sceneId) => {
    const { savedScenes } = get();
    const updatedScenes = savedScenes.filter(s => s.id !== sceneId);
    localStorage.setItem('savedScenes', JSON.stringify(updatedScenes));
    set({ savedScenes: updatedScenes });
  },

  // Actions Category Management
  saveAction: (name, projectIds = []) => {
    const { fieldValues, savedActions, currentProject } = get();
    
    // Extract action-related fields
    const actionFields = {};
    const actionFieldKeys = ['actions', 'dialogue', 'scene', 'emotions', 'performance_style'];
    
    actionFieldKeys.forEach(key => {
      if (fieldValues[key] !== undefined && fieldValues[key] !== '') {
        actionFields[key] = fieldValues[key];
      }
    });

    // Auto-assign to current project if no projects specified and current project exists
    const finalProjectIds = projectIds.length === 0 && currentProject 
      ? [currentProject.id] 
      : projectIds;

    const newAction = {
      id: Date.now().toString(),
      name: name || `Action ${savedActions.length + 1}`,
      timestamp: Date.now(),
      data: actionFields,
      projectIds: finalProjectIds
    };

    const updatedActions = [...savedActions, newAction].slice(-20);
    localStorage.setItem('savedActions', JSON.stringify(updatedActions));
    
    set({ savedActions: updatedActions });
    return newAction.id;
  },

  loadAction: (actionId) => {
    const { savedActions } = get();
    const action = savedActions.find(a => a.id === actionId);
    
    if (action) {
      const newEnabledFields = new Set();
      const newExpandedCategories = new Set();
      
      Object.keys(action.data).forEach(key => {
        newEnabledFields.add(key);
        
        schema.categories.forEach(category => {
          if (category.fields.some(field => field.key === key)) {
            newExpandedCategories.add(category.id);
          }
        });
      });

      set((state) => ({
        fieldValues: { ...state.fieldValues, ...action.data },
        enabledFields: new Set([...state.enabledFields, ...newEnabledFields]),
        expandedCategories: new Set([...state.expandedCategories, ...newExpandedCategories])
      }));
    }
  },

  deleteAction: (actionId) => {
    const { savedActions } = get();
    const updatedActions = savedActions.filter(a => a.id !== actionId);
    localStorage.setItem('savedActions', JSON.stringify(updatedActions));
    set({ savedActions: updatedActions });
  },

  // Settings Category Management
  saveSetting: (name, projectIds = []) => {
    const { fieldValues, savedSettings, currentProject } = get();
    
    // Extract setting-related fields
    const settingFields = {};
    const settingFieldKeys = ['setting', 'time_of_day', 'environment', 'weather', 'lighting_type', 'scene_elements'];
    
    settingFieldKeys.forEach(key => {
      if (fieldValues[key] !== undefined && fieldValues[key] !== '') {
        settingFields[key] = fieldValues[key];
      }
    });

    // Auto-assign to current project if no projects specified and current project exists
    const finalProjectIds = projectIds.length === 0 && currentProject 
      ? [currentProject.id] 
      : projectIds;

    const newSetting = {
      id: Date.now().toString(),
      name: name || `Setting ${savedSettings.length + 1}`,
      timestamp: Date.now(),
      data: settingFields,
      projectIds: finalProjectIds
    };

    const updatedSettings = [...savedSettings, newSetting].slice(-20);
    localStorage.setItem('savedSettings', JSON.stringify(updatedSettings));
    
    set({ savedSettings: updatedSettings });
    return newSetting.id;
  },

  loadSetting: (settingId) => {
    const { savedSettings } = get();
    const setting = savedSettings.find(s => s.id === settingId);
    
    if (setting) {
      const newEnabledFields = new Set();
      const newExpandedCategories = new Set();
      
      Object.keys(setting.data).forEach(key => {
        newEnabledFields.add(key);
        
        schema.categories.forEach(category => {
          if (category.fields.some(field => field.key === key)) {
            newExpandedCategories.add(category.id);
          }
        });
      });

      set((state) => ({
        fieldValues: { ...state.fieldValues, ...setting.data },
        enabledFields: new Set([...state.enabledFields, ...newEnabledFields]),
        expandedCategories: new Set([...state.expandedCategories, ...newExpandedCategories])
      }));
    }
  },

  deleteSetting: (settingId) => {
    const { savedSettings } = get();
    const updatedSettings = savedSettings.filter(s => s.id !== settingId);
    localStorage.setItem('savedSettings', JSON.stringify(updatedSettings));
    set({ savedSettings: updatedSettings });
  },

  // Styles Category Management
  saveStyle: (name, projectIds = []) => {
    const { fieldValues, savedStyles, currentProject } = get();
    
    // Extract style-related fields
    const styleFields = {};
    const styleFieldKeys = ['style', 'color_palette', 'camera_angle', 'camera_distance', 'lens_type', 'depth_of_field', 'stylized_style'];
    
    styleFieldKeys.forEach(key => {
      if (fieldValues[key] !== undefined && fieldValues[key] !== '') {
        styleFields[key] = fieldValues[key];
      }
    });

    // Auto-assign to current project if no projects specified and current project exists
    const finalProjectIds = projectIds.length === 0 && currentProject 
      ? [currentProject.id] 
      : projectIds;

    const newStyle = {
      id: Date.now().toString(),
      name: name || `Style ${savedStyles.length + 1}`,
      timestamp: Date.now(),
      data: styleFields,
      projectIds: finalProjectIds
    };

    const updatedStyles = [...savedStyles, newStyle].slice(-20);
    localStorage.setItem('savedStyles', JSON.stringify(updatedStyles));
    
    set({ savedStyles: updatedStyles });
    return newStyle.id;
  },

  loadStyle: (styleId) => {
    const { savedStyles } = get();
    const style = savedStyles.find(s => s.id === styleId);
    
    if (style) {
      const newEnabledFields = new Set();
      const newExpandedCategories = new Set();
      
      Object.keys(style.data).forEach(key => {
        newEnabledFields.add(key);
        
        schema.categories.forEach(category => {
          if (category.fields.some(field => field.key === key)) {
            newExpandedCategories.add(category.id);
          }
        });
      });

      set((state) => ({
        fieldValues: { ...state.fieldValues, ...style.data },
        enabledFields: new Set([...state.enabledFields, ...newEnabledFields]),
        expandedCategories: new Set([...state.expandedCategories, ...newExpandedCategories])
      }));
    }
  },

  deleteStyle: (styleId) => {
    const { savedStyles } = get();
    const updatedStyles = savedStyles.filter(s => s.id !== styleId);
    localStorage.setItem('savedStyles', JSON.stringify(updatedStyles));
    set({ savedStyles: updatedStyles });
  },

  // Audio Category Management
  saveAudio: (name, projectIds = []) => {
    const { fieldValues, savedAudio, currentProject } = get();
    
    // Extract audio-related fields
    const audioFields = {};
    const audioFieldKeys = ['music_style', 'sound_effects', 'audio_mood', 'ambient_sound', 'voice_direction'];
    
    audioFieldKeys.forEach(key => {
      if (fieldValues[key] !== undefined && fieldValues[key] !== '') {
        audioFields[key] = fieldValues[key];
      }
    });

    // Auto-assign to current project if no projects specified and current project exists
    const finalProjectIds = projectIds.length === 0 && currentProject 
      ? [currentProject.id] 
      : projectIds;

    const newAudio = {
      id: Date.now().toString(),
      name: name || `Audio ${savedAudio.length + 1}`,
      timestamp: Date.now(),
      data: audioFields,
      projectIds: finalProjectIds
    };

    const updatedAudio = [...savedAudio, newAudio].slice(-20);
    localStorage.setItem('savedAudio', JSON.stringify(updatedAudio));
    
    set({ savedAudio: updatedAudio });
    return newAudio.id;
  },

  loadAudio: (audioId) => {
    const { savedAudio } = get();
    const audio = savedAudio.find(a => a.id === audioId);
    
    if (audio) {
      const newEnabledFields = new Set();
      const newExpandedCategories = new Set();
      
      Object.keys(audio.data).forEach(key => {
        newEnabledFields.add(key);
        
        schema.categories.forEach(category => {
          if (category.fields.some(field => field.key === key)) {
            newExpandedCategories.add(category.id);
          }
        });
      });

      set((state) => ({
        fieldValues: { ...state.fieldValues, ...audio.data },
        enabledFields: new Set([...state.enabledFields, ...newEnabledFields]),
        expandedCategories: new Set([...state.expandedCategories, ...newExpandedCategories])
      }));
    }
  },

  deleteAudio: (audioId) => {
    const { savedAudio } = get();
    const updatedAudio = savedAudio.filter(a => a.id !== audioId);
    localStorage.setItem('savedAudio', JSON.stringify(updatedAudio));
    set({ savedAudio: updatedAudio });
  },

  // Template Usage Tracking
  recordTemplateUsage: (templateKey, categoryType) => {
    const { templateUsage } = get();
    const now = Date.now();
    
    // Create or update usage record
    const newUsageData = {
      ...templateUsage,
      [templateKey]: {
        count: (templateUsage[templateKey]?.count || 0) + 1,
        lastUsed: now,
        categoryType: categoryType, // 'characters', 'actions', 'settings', 'styles', 'audio'
        firstUsed: templateUsage[templateKey]?.firstUsed || now
      }
    };
    
    // Save to localStorage and update state
    localStorage.setItem('templateUsage', JSON.stringify(newUsageData));
    set({ templateUsage: newUsageData });
  },

  getRecentTemplates: (categoryType, limit = 10) => {
    const { templateUsage } = get();
    
    // Filter templates by category type and sort by last used
    const recentTemplates = Object.entries(templateUsage)
      .filter(([_, usage]) => usage.categoryType === categoryType)
      .sort((a, b) => b[1].lastUsed - a[1].lastUsed)
      .slice(0, limit)
      .map(([templateKey, usage]) => ({
        templateKey,
        ...usage
      }));
    
    return recentTemplates;
  },

  getMostUsedTemplates: (categoryType, limit = 10) => {
    const { templateUsage } = get();
    
    // Filter templates by category type and sort by usage count
    const mostUsedTemplates = Object.entries(templateUsage)
      .filter(([_, usage]) => usage.categoryType === categoryType)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, limit)
      .map(([templateKey, usage]) => ({
        templateKey,
        ...usage
      }));
    
    return mostUsedTemplates;
  },

  // Scene Pack Management
  saveScenePack: (name, sceneOptions, originalScene) => {
    const { savedScenePacks } = get();
    
    const newScenePack = {
      id: Date.now().toString(),
      name: name || `Scene Pack ${savedScenePacks.length + 1}`,
      timestamp: Date.now(),
      originalScene: originalScene ? { ...originalScene } : null,
      scenes: sceneOptions.map((option, index) => ({
        id: `${Date.now()}_${index}`,
        type: option.type,
        icon: option.icon,
        summary: option.summary,
        json: option.json
      }))
    };

    const updatedScenePacks = [...savedScenePacks, newScenePack].slice(-10); // Keep last 10 packs
    localStorage.setItem('savedScenePacks', JSON.stringify(updatedScenePacks));
    
    set({ savedScenePacks: updatedScenePacks });
    return newScenePack.id;
  },

  loadScenePack: (packId) => {
    const { savedScenePacks } = get();
    const pack = savedScenePacks.find(p => p.id === packId);
    return pack || null;
  },

  deleteScenePack: (packId) => {
    const { savedScenePacks } = get();
    const updatedScenePacks = savedScenePacks.filter(p => p.id !== packId);
    localStorage.setItem('savedScenePacks', JSON.stringify(updatedScenePacks));
    set({ savedScenePacks: updatedScenePacks });
  },

  exportData: (type, id = null) => {
    const { fieldValues, savedCharacters, savedScenes } = get();
    
    let exportData;
    let filename;
    
    if (type === 'current') {
      exportData = {
        type: 'scene',
        version: '1.0',
        timestamp: Date.now(),
        data: fieldValues
      };
      filename = 'current-scene.json';
    } else if (type === 'character' && id) {
      const character = savedCharacters.find(c => c.id === id);
      exportData = {
        type: 'character',
        version: '1.0',
        ...character
      };
      filename = `${character.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    } else if (type === 'scene' && id) {
      const scene = savedScenes.find(s => s.id === id);
      exportData = {
        type: 'scene',
        version: '1.0',
        ...scene
      };
      filename = `${scene.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    } else if (type === 'all') {
      exportData = {
        type: 'backup',
        version: '1.0',
        timestamp: Date.now(),
        characters: savedCharacters,
        scenes: savedScenes
      };
      filename = 'prompt-generator-backup.json';
    }
    
    if (exportData) {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  },

  importData: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result);
          const { savedCharacters, savedScenes } = get();

          if (importData.type === 'character') {
            // Import single character
            const newCharacter = {
              ...importData,
              id: Date.now().toString() // Generate new ID to avoid conflicts
            };
            const updatedCharacters = [...savedCharacters, newCharacter].slice(-20);
            localStorage.setItem('savedCharacters', JSON.stringify(updatedCharacters));
            set({ savedCharacters: updatedCharacters });
            resolve({ type: 'character', name: newCharacter.name });
            
          } else if (importData.type === 'scene') {
            // Import single scene
            const newScene = {
              ...importData,
              id: Date.now().toString() // Generate new ID to avoid conflicts
            };
            const updatedScenes = [...savedScenes, newScene].slice(-20);
            localStorage.setItem('savedScenes', JSON.stringify(updatedScenes));
            set({ savedScenes: updatedScenes });
            resolve({ type: 'scene', name: newScene.name });
            
          } else if (importData.type === 'backup') {
            // Import backup (multiple characters and scenes)
            const newCharacters = importData.characters.map(char => ({
              ...char,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
            }));
            const newScenes = importData.scenes.map(scene => ({
              ...scene,
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
            }));
            
            const updatedCharacters = [...savedCharacters, ...newCharacters].slice(-20);
            const updatedScenes = [...savedScenes, ...newScenes].slice(-20);
            
            localStorage.setItem('savedCharacters', JSON.stringify(updatedCharacters));
            localStorage.setItem('savedScenes', JSON.stringify(updatedScenes));
            
            set({ 
              savedCharacters: updatedCharacters,
              savedScenes: updatedScenes 
            });
            
            resolve({ 
              type: 'backup', 
              count: {
                characters: newCharacters.length,
                scenes: newScenes.length
              }
            });
          } else {
            reject(new Error('Invalid file format'));
          }
        } catch (error) {
          reject(new Error('Failed to parse JSON file'));
        }
      };
      reader.readAsText(file);
    });
  },

  // Project Management Functions
  createProject: (name, description = '', defaultStyle = {}) => {
    const { projects } = get();
    
    const newProject = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      timestamp: Date.now(),
      defaultStyle, // Consistent style settings for this project
      sceneCount: 0,
      settings: {
        autoApplyStyle: true,
        mergeStrategy: 'smart' // 'replace', 'merge', 'smart'
      }
    };

    const updatedProjects = [...projects, newProject];
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    
    set({ 
      projects: updatedProjects,
      currentProject: newProject
    });
    localStorage.setItem('currentProject', JSON.stringify(newProject));
    
    return newProject.id;
  },

  switchProject: (projectId) => {
    const { projects } = get();
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      set({ currentProject: project });
      localStorage.setItem('currentProject', JSON.stringify(project));
      
      // Auto-apply project's default style if enabled
      if (project.settings?.autoApplyStyle && project.defaultStyle) {
        get().applyProjectStyle(project.defaultStyle);
      }
    }
  },

  updateProject: (projectId, updates) => {
    const { projects, currentProject } = get();
    
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const updatedProject = { ...project, ...updates };
        return updatedProject;
      }
      return project;
    });

    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    
    // Update current project if it's the one being modified
    const updatedCurrentProject = currentProject?.id === projectId 
      ? updatedProjects.find(p => p.id === projectId)
      : currentProject;

    set({ 
      projects: updatedProjects,
      currentProject: updatedCurrentProject
    });
    
    if (updatedCurrentProject) {
      localStorage.setItem('currentProject', JSON.stringify(updatedCurrentProject));
    }
  },

  deleteProject: (projectId) => {
    const { projects, currentProject } = get();
    
    const updatedProjects = projects.filter(p => p.id !== projectId);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    
    // Clear current project if it's being deleted
    const updatedCurrentProject = currentProject?.id === projectId ? null : currentProject;
    
    set({ 
      projects: updatedProjects,
      currentProject: updatedCurrentProject
    });
    
    if (updatedCurrentProject) {
      localStorage.setItem('currentProject', JSON.stringify(updatedCurrentProject));
    } else {
      localStorage.removeItem('currentProject');
    }
  },

  applyProjectStyle: (styleSettings) => {
    const { setFieldValue } = get();
    
    // Apply style-related fields from project defaults
    Object.entries(styleSettings).forEach(([field, value]) => {
      if (value && value.trim() !== '') {
        setFieldValue(field, value);
      }
    });
  },

  incrementProjectSceneCount: (projectId) => {
    const { projects } = get();
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      get().updateProject(projectId, { 
        sceneCount: (project.sceneCount || 0) + 1 
      });
    }
  },

  // Smart scene merging with context preservation
  applySceneWithMergeStrategy: (sceneData, strategy = 'smart') => {
    const { fieldValues, enabledFields, setFieldValue, clearAll } = get();
    
    if (strategy === 'replace') {
      // Complete replacement (current behavior)
      clearAll();
      Object.entries(sceneData).forEach(([key, value]) => {
        if (value !== undefined) {
          setFieldValue(key, value);
        }
      });
      return;
    }
    
    if (strategy === 'merge') {
      // Simple merge - add new fields without clearing existing
      Object.entries(sceneData).forEach(([key, value]) => {
        if (value !== undefined) {
          setFieldValue(key, value);
        }
      });
      return;
    }
    
    if (strategy === 'smart') {
      // Smart merge - preserve context, update selectively
      const legacyCharacterFields = ['character_type', 'character_name', 'age', 'gender', 'hair_color', 'hair_style', 'eye_color', 'skin_tone', 'clothing_type', 'clothing_color'];
      const settingFields = ['setting', 'time_of_day', 'environment', 'scene'];
      const styleFields = ['camera_angle', 'camera_distance', 'lighting', 'style', 'color_palette', 'mood'];
      
      // Analyze what's changing in the new scene data
      const hasNewCharacters = sceneData.hasOwnProperty('characters');
      const hasNewLegacyCharacter = legacyCharacterFields.some(field => sceneData.hasOwnProperty(field));
      const hasNewSetting = settingFields.some(field => sceneData.hasOwnProperty(field));
      const hasNewStyle = styleFields.some(field => sceneData.hasOwnProperty(field));
      
      // Handle character merging specially
      if (hasNewCharacters && Array.isArray(sceneData.characters)) {
        const currentCharacters = fieldValues.characters || [];
        const newCharacters = sceneData.characters;
        
        // Smart character merging: add new characters, update existing ones by name
        let mergedCharacters = [...currentCharacters];
        
        newCharacters.forEach(newChar => {
          const existingIndex = mergedCharacters.findIndex(existing => 
            existing.name && newChar.name && existing.name.toLowerCase() === newChar.name.toLowerCase()
          );
          
          if (existingIndex >= 0) {
            // Update existing character
            mergedCharacters[existingIndex] = { ...mergedCharacters[existingIndex], ...newChar };
          } else {
            // Add new character
            mergedCharacters.push(newChar);
          }
        });
        
        setFieldValue('characters', mergedCharacters);
      } else if (hasNewLegacyCharacter) {
        // Clear existing legacy character data before adding new
        legacyCharacterFields.forEach(field => {
          if (enabledFields.has(field)) {
            setFieldValue(field, '');
          }
        });
      }
      
      // Apply new scene data (excluding characters which we handled above)
      Object.entries(sceneData).forEach(([key, value]) => {
        if (key !== 'characters' && value !== undefined) {
          setFieldValue(key, value);
        }
      });
      
      return;
    }
  },

  // JSON validation and editing functions for EditableJsonOutput
  validateJsonInput: (jsonString) => {
    // Handle empty or whitespace-only strings
    if (!jsonString || jsonString.trim() === '') {
      return { valid: true, error: '' }; // Empty JSON is valid (will become {})
    }

    try {
      JSON.parse(jsonString);
      return { valid: true, error: '' };
    } catch (error) {
      // Provide more descriptive error messages based on common JSON errors
      let errorMessage = error.message;
      
      if (errorMessage.includes('Unexpected token')) {
        const match = errorMessage.match(/Unexpected token (.+?) in JSON at position (\d+)/);
        if (match) {
          const [, token, position] = match;
          errorMessage = `Unexpected character '${token}' at position ${position}`;
        }
      } else if (errorMessage.includes('Expected property name')) {
        errorMessage = 'Missing property name (key) - keys must be in quotes';
      } else if (errorMessage.includes('Unterminated string')) {
        errorMessage = 'Unterminated string - missing closing quote';
      } else if (errorMessage.includes('Unexpected end of JSON')) {
        errorMessage = 'Incomplete JSON - missing closing brace or bracket';
      }
      
      return { valid: false, error: errorMessage };
    }
  },

  getJsonDiff: (newJsonString) => {
    try {
      const currentJson = JSON.parse(get().getJsonOutput() || '{}');
      const newJson = JSON.parse(newJsonString);
      
      const changes = {
        added: [],
        modified: [],
        removed: []
      };
      
      // Check for added and modified fields
      Object.entries(newJson).forEach(([key, value]) => {
        if (!currentJson.hasOwnProperty(key)) {
          changes.added.push({ key, value });
        } else if (JSON.stringify(currentJson[key]) !== JSON.stringify(value)) {
          changes.modified.push({ key, oldValue: currentJson[key], newValue: value });
        }
      });
      
      // Check for removed fields
      Object.entries(currentJson).forEach(([key, value]) => {
        if (!newJson.hasOwnProperty(key)) {
          changes.removed.push({ key, value });
        }
      });
      
      return { valid: true, changes };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  },

  setJsonFromText: (jsonString) => {
    try {
      const newJson = JSON.parse(jsonString);
      const { setFieldValue } = get();
      
      // Save state for undo
      get().saveStateForUndo();
      
      // Clear existing field values
      set((state) => ({
        fieldValues: {},
        enabledFields: new Set()
      }));
      
      // Apply new JSON values
      Object.entries(newJson).forEach(([key, value]) => {
        setFieldValue(key, value);
      });
      
      return { 
        success: true, 
        message: `Applied ${Object.keys(newJson).length} fields from JSON edit` 
      };
    } catch (error) {
      return { 
        success: false, 
        error: `Invalid JSON: ${error.message}` 
      };
    }
  },

  // Asset-Project Relationship Management
  assignAssetToProject: (assetType, assetId, projectId) => {
    const state = get();
    const assetKey = `saved${assetType.charAt(0).toUpperCase() + assetType.slice(1)}s`;
    const assets = state[assetKey];
    
    if (!assets) return false;
    
    const assetIndex = assets.findIndex(asset => asset.id === assetId);
    if (assetIndex === -1) return false;
    
    const asset = assets[assetIndex];
    const currentProjectIds = asset.projectIds || [];
    
    // Add project if not already assigned
    if (!currentProjectIds.includes(projectId)) {
      const updatedProjectIds = [...currentProjectIds, projectId];
      const updatedAsset = { ...asset, projectIds: updatedProjectIds };
      const updatedAssets = [...assets];
      updatedAssets[assetIndex] = updatedAsset;
      
      // Save to localStorage and update state
      localStorage.setItem(assetKey, JSON.stringify(updatedAssets));
      set({ [assetKey]: updatedAssets });
      
      return true;
    }
    
    return false;
  },

  removeAssetFromProject: (assetType, assetId, projectId) => {
    const state = get();
    const assetKey = `saved${assetType.charAt(0).toUpperCase() + assetType.slice(1)}s`;
    const assets = state[assetKey];
    
    if (!assets) return false;
    
    const assetIndex = assets.findIndex(asset => asset.id === assetId);
    if (assetIndex === -1) return false;
    
    const asset = assets[assetIndex];
    const currentProjectIds = asset.projectIds || [];
    
    // Remove project if assigned
    if (currentProjectIds.includes(projectId)) {
      const updatedProjectIds = currentProjectIds.filter(id => id !== projectId);
      const updatedAsset = { ...asset, projectIds: updatedProjectIds };
      const updatedAssets = [...assets];
      updatedAssets[assetIndex] = updatedAsset;
      
      // Save to localStorage and update state
      localStorage.setItem(assetKey, JSON.stringify(updatedAssets));
      set({ [assetKey]: updatedAssets });
      
      return true;
    }
    
    return false;
  },

  // Get assets for a specific project
  getAssetsForProject: (projectId) => {
    const state = get();
    const assetTypes = ['Characters', 'Scenes', 'Actions', 'Settings', 'Styles', 'Audio'];
    const projectAssets = {};
    
    assetTypes.forEach(type => {
      const assetKey = `saved${type}`;
      const assets = state[assetKey] || [];
      projectAssets[type.toLowerCase()] = assets.filter(asset => 
        asset.projectIds && asset.projectIds.includes(projectId)
      );
    });
    
    return projectAssets;
  },

  // Check if asset belongs to project
  isAssetInProject: (assetType, assetId, projectId) => {
    const state = get();
    const assetKey = `saved${assetType.charAt(0).toUpperCase() + assetType.slice(1)}s`;
    const assets = state[assetKey] || [];
    const asset = assets.find(a => a.id === assetId);
    
    return asset && asset.projectIds && asset.projectIds.includes(projectId);
  },

  // Builder Context Management for Storyboard Generator
  setBuilderContext: (type, data) => set((state) => ({
    builderContext: {
      ...state.builderContext,
      [type]: data,
      lastUpdated: {
        ...state.builderContext.lastUpdated,
        [type]: Date.now()
      }
    }
  })),

  getBuilderContext: (type) => {
    const state = get();
    return state.builderContext[type];
  },

  hasBuilderContext: (type) => {
    const state = get();
    return !!state.builderContext[type];
  },

  clearBuilderContext: (type) => set((state) => ({
    builderContext: {
      ...state.builderContext,
      [type]: null,
      lastUpdated: {
        ...state.builderContext.lastUpdated,
        [type]: null
      }
    }
  })),

  // Get all available builder contexts for storyboard generation
  getAvailableContexts: () => {
    const state = get();
    const contexts = {};
    
    ['character', 'world', 'style', 'scene'].forEach(type => {
      if (state.builderContext[type]) {
        contexts[type] = {
          data: state.builderContext[type],
          lastUpdated: state.builderContext.lastUpdated[type]
        };
      }
    });
    
    return contexts;
  },

  // Auto-detect current scene context from field values
  getCurrentSceneContext: () => {
    const state = get();
    const { fieldValues, enabledFields } = state;
    
    // Only include enabled fields in the scene context
    const sceneData = {};
    enabledFields.forEach(fieldKey => {
      if (fieldValues[fieldKey]) {
        sceneData[fieldKey] = fieldValues[fieldKey];
      }
    });
    
    return Object.keys(sceneData).length > 0 ? sceneData : null;
  }
}));

export default usePromptStore;
export { usePromptStore as useStore };