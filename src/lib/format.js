// Turns raw template fields into a model-shaped JSON prompt object.
// Fields are grouped semantically, then ordered per the target model's doctrine.

import { MODELS } from './models.js';

// raw field key → semantic group
export const FIELD_GROUP = {
  characters: 'subject',
  character_type: 'subject',
  age_range: 'subject',
  gender: 'subject',
  ethnicity: 'subject',
  body_type: 'subject',
  hair_style: 'subject',
  hair_color: 'subject',
  eye_color: 'subject',
  skin_tone: 'subject',
  skin_color: 'subject',
  clothing: 'subject',
  species: 'subject',
  size: 'subject',
  personality: 'subject',
  fur_color: 'subject',
  feather_color: 'subject',
  body_color: 'subject',

  actions: 'action',
  dialogue: 'action',
  emotional_response: 'action',
  emotions: 'action',

  setting: 'scene',
  scene: 'scene',
  environment: 'scene',
  atmosphere: 'scene',
  time_of_day: 'scene',
  weather: 'scene',
  environmental_details: 'scene',

  angle: 'camera',
  distance: 'camera',
  movement: 'camera',
  camera_move: 'camera',
  camera_lens_mm: 'camera',
  camera_speed: 'camera',
  camera_angle: 'camera',
  camera_distance: 'camera',
  motion_type: 'camera',
  lens_type: 'camera',
  depth_of_field: 'camera',
  speed: 'camera',
  transition: 'camera',

  lighting_type: 'lighting',
  light_quality: 'lighting',
  lighting_direction: 'lighting',
  shadows: 'lighting',

  style: 'style',
  stylized_style: 'style',
  tone: 'style',
  influences: 'style',
  visual_characteristics: 'style',
  animation_reference: 'style',
  filters: 'style',
  vfx: 'style',
  color_palette: 'style',
  palette: 'style',

  audio: 'audio',
  music_style: 'audio',
  audio_mood: 'audio',
  sound_design: 'audio',
  sound_effects: 'audio',
  background_audio: 'audio',
  environment_audio: 'audio',
  dialogue_style: 'audio',
  voice_tone: 'audio',

  aspect_ratio: 'technical',
  seed: 'technical',
  frame_rate: 'technical',
  fps: 'technical',
  duration_s: 'technical',
  creativity: 'technical',
  negative: 'technical',
  lock_identity: 'technical',
  lock_style: 'technical',
  technical_setup: 'technical',

  reference_product: 'references',
  reference_character_face: 'references',
  reference_style_frame: 'references',
  reference_notes: 'references',
  model_reference_handling: 'references',

  brand_colors: 'brand',
  brand_logo: 'brand',
  brand_tone: 'brand',
  brand_typography: 'brand',
  brand_guardrails: 'brand',

  robot_style: 'subject',
  scale: 'subject',
  object_type: 'subject',
  glow: 'lighting',
};

// raw key → key used inside the output JSON
export const KEY_RENAME = {
  characters: 'description',
  character_type: 'type',
  actions: 'description',
  emotional_response: 'emotion',
  setting: 'location',
  scene: 'description',
  atmosphere: 'mood',
  environmental_details: 'details',
  camera_angle: 'angle',
  camera_distance: 'distance',
  motion_type: 'movement',
  lens_type: 'lens',
  depth_of_field: 'depth_of_field',
  audio_mood: 'mood',
  background_audio: 'background',
  environment_audio: 'ambient',
  camera_move: 'movement',
  camera_lens_mm: 'lens_mm',
  camera_speed: 'movement_speed',
  transition: 'transition',
  lighting_type: 'type',
  light_quality: 'quality',
  lighting_direction: 'direction',
  style: 'aesthetic',
  stylized_style: 'aesthetic',
  music_style: 'music',
  audio: 'description',
  sound_design: 'design',
  frame_rate: 'fps',
  duration_s: 'duration_seconds',
  negative: 'negative_prompt',
  technical_setup: 'setup',
  reference_product: 'product_image',
  reference_character_face: 'character_face',
  reference_style_frame: 'style_frame',
  reference_notes: 'notes',
  model_reference_handling: 'model_handling',
  brand_colors: 'hex_colors',
  brand_logo: 'logo_handling',
  brand_tone: 'tone',
  brand_typography: 'typography',
  brand_guardrails: 'guardrails',
};

export const KNOWN_FIELD_KEYS = new Set(Object.keys(FIELD_GROUP));

export function unknownFieldKeysFrom(items) {
  const unknown = new Map();
  for (const item of items) {
    for (const key of Object.keys(item.fields ?? {})) {
      if (!KNOWN_FIELD_KEYS.has(key)) {
        unknown.set(key, (unknown.get(key) ?? 0) + 1);
      }
    }
  }
  return [...unknown.entries()].sort((a, b) => b[1] - a[1]);
}

export function assertKnownFieldKeys(items, sourceName = 'prompt data') {
  const unknown = unknownFieldKeysFrom(items);
  if (unknown.length === 0) return;
  const list = unknown.map(([key, count]) => `${key} (${count})`).join(', ');
  throw new Error(`Unmapped prompt field keys in ${sourceName}: ${list}`);
}

export function groupsForFields(fields) {
  return new Set(
    Object.keys(fields ?? {})
      .filter((key) => KNOWN_FIELD_KEYS.has(key))
      .map((key) => FIELD_GROUP[key])
  );
}

export function isFullPrompt(fields) {
  const keys = Object.keys(fields ?? {});
  if (keys.length < 4) return false;
  const groups = groupsForFields(fields);
  return ['subject', 'action', 'scene'].some((group) => groups.has(group));
}

const DESCRIPTIVE_STYLE_MAP = [
  ['Christopher Nolan', 'large-format practical-thriller cinematography, grounded spectacle, temporal tension, hard contrast'],
  ['Wes Anderson', 'symmetrical planimetric framing, pastel palette, centered staging, meticulous production design'],
  ['Steven Spielberg', 'warm backlight, motivated camera movement, wide-eyed reaction shots, classical adventure blocking'],
  ['Quentin Tarantino', 'high-tension dialogue staging, retro genre texture, bold color contrast, slow-burn close-ups'],
  ['Hayao Miyazaki', 'hand-painted storybook animation, gentle naturalism, whimsical motion, soft environmental detail'],
  ['Studio Ghibli', 'hand-painted storybook animation, gentle naturalism, whimsical motion, soft environmental detail'],
  ['Zack Snyder', 'high-contrast heroic tableaux, stylized slow motion, dramatic rim light, graphic composition'],
  ['David Fincher', 'controlled cool-toned precision, low-key lighting, exact camera placement, procedural tension'],
  ['Greta Gerwig', 'bright contemporary warmth, expressive ensemble staging, playful color, emotional naturalism'],
  ['Guillermo del Toro', 'gothic fairytale texture, ornate practical sets, amber-blue contrast, creature-feature detail'],
  ['Stanley Kubrick', 'one-point perspective, controlled symmetry, slow deliberate camera moves, clinical tension'],
  ['Denis Villeneuve', 'monumental scale, atmospheric minimalism, stark silhouettes, slow contemplative movement'],
  ['Jordan Peele', 'social-thriller unease, clean suburban realism, controlled reveals, uncomfortable negative space'],
  ['Rian Johnson', 'sleek mystery staging, crisp blocking, puzzle-box composition, colorful genre polish'],
  ['Edgar Wright', 'kinetic montage, rhythmic camera moves, precise visual comedy, punchy transitions'],
  ['Bong Joon-ho', 'class-conscious realism, tonal contrast, layered ensemble blocking, dark comic tension'],
  ['Chloé Zhao', 'natural-light intimacy, handheld lyricism, golden-hour landscapes, quiet observational realism'],
  ['Barry Jenkins', 'lush intimate close-ups, saturated color, tender natural light, poetic realism'],
  ['Lulu Wang', 'restrained family realism, soft cultural detail, composed interiors, bittersweet warmth'],
  ['Martin Scorsese', 'kinetic street-level realism, restless camera movement, saturated practical light, ensemble tension'],
  ['Ridley Scott', 'smoky atmospheric production design, hard shafts of light, industrial scale, tactile sci-fi realism'],
  ['Paul Thomas Anderson', 'American ensemble naturalism, elegant long takes, textured period detail, restless character blocking'],
  ['Coen Brothers', 'dry comic framing, precise regional texture, offbeat noir composition, deadpan tension'],
  ['Alfonso Cuarón', 'immersive long takes, naturalistic handheld motion, environmental realism, elegant spatial choreography'],
  ['Disney', 'classic family animation polish, expressive character acting, musical storybook staging'],
  ['Pixar', 'polished 3D family animation, expressive character acting, soft tactile materials, emotional clarity'],
  ['The Simpsons', 'flat-color adult sitcom animation, suburban satire, simple bold silhouettes'],
  ['South Park', 'satirical cutout animation, flat paper-like shapes, deliberately crude motion'],
  ['Family Guy', 'flat adult sitcom animation, broad comedic staging, clean TV-cartoon outlines'],
  ['Cartoon Network', 'bold 2D television animation, elastic poses, simplified shapes, energetic timing'],
  ['Nickelodeon', "bright 90s children's animation energy, exaggerated shapes, messy comic texture"],
];

function descriptiveStyleValue(value) {
  if (typeof value !== 'string') return value;
  let out = value;
  for (const [name, replacement] of DESCRIPTIVE_STYLE_MAP) {
    out = out.replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), replacement);
  }
  return out;
}

export function hasDescriptiveStyleVariant(fields) {
  return Object.entries(fields ?? {}).some(
    ([key, value]) => FIELD_GROUP[key] === 'style' && descriptiveStyleValue(value) !== value
  );
}

export function descriptiveStyleFields(fields) {
  return Object.fromEntries(
    Object.entries(fields ?? {}).map(([key, value]) => [
      key,
      FIELD_GROUP[key] === 'style' ? descriptiveStyleValue(value) : value,
    ])
  );
}

// Legacy preset values embed `random(['a', 'b'])` placeholders that the old app
// resolved at runtime. Resolve them deterministically (hash-picked) so static
// pages are stable across builds and server/client output matches.
function resolveDynamic(value) {
  if (typeof value !== 'string' || !value.includes('random(')) return value;
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return value.replace(/random\(\[([^\]]*)\]\)/g, (_, list) => {
    const options = list
      .split(',')
      .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
    return options.length ? options[hash % options.length] : '';
  });
}

function groupFields(fields) {
  const groups = {};
  for (const [key, rawValue] of Object.entries(fields)) {
    const value = resolveDynamic(rawValue);
    if (value === undefined || value === null || value === '') continue;
    const group = FIELD_GROUP[key] ?? 'style';
    const outKey = KEY_RENAME[key] ?? key;
    groups[group] ??= {};
    // avoid clobbering when two raw keys rename to the same output key
    let k = outKey;
    while (k in groups[group]) k = `${k}_detail`;
    groups[group][k] = value;
  }
  return groups;
}

// collapse single-entry groups holding only a description-like value to a plain string
function collapse(groupObj) {
  const keys = Object.keys(groupObj);
  if (keys.length === 1 && ['description', 'aesthetic', 'location'].includes(keys[0])) {
    return groupObj[keys[0]];
  }
  return groupObj;
}

export const DEPTH_LEVELS = {
  compact: {
    label: 'Compact',
    groups: ['subject', 'action', 'scene', 'camera', 'lighting', 'style', 'technical'],
    keys: {
      subject: ['description', 'type', 'object_type'],
      action: ['description', 'dialogue'],
      scene: ['location', 'description', 'mood'],
      camera: ['angle', 'distance', 'movement'],
      lighting: ['type', 'quality', 'direction'],
      style: ['aesthetic', 'palette'],
      technical: ['aspect_ratio', 'duration_seconds', 'negative_prompt'],
    },
  },
  production: {
    label: 'Production',
    groups: ['references', 'brand', 'subject', 'action', 'scene', 'camera', 'lighting', 'style', 'audio', 'technical'],
  },
  advanced: {
    label: 'Advanced',
    groups: ['references', 'brand', 'subject', 'action', 'scene', 'camera', 'lighting', 'style', 'audio', 'technical'],
  },
};

export const DEFAULT_DEPTH = 'production';

function depthConfig(depth) {
  return DEPTH_LEVELS[depth] ?? DEPTH_LEVELS[DEFAULT_DEPTH];
}

function applyDepth(groups, depth) {
  const config = depthConfig(depth);
  const next = {};
  for (const group of config.groups) {
    if (!groups[group]) continue;
    const value = groups[group];
    if (!config.keys?.[group]) {
      next[group] = value;
      continue;
    }
    const filtered = {};
    for (const key of config.keys[group]) {
      if (key in value) filtered[key] = value[key];
    }
    if (Object.keys(filtered).length > 0) next[group] = filtered;
  }
  if (depth === 'advanced') {
    next.production_notes = {
      prompt_level: 'advanced',
      operator_checklist:
        'Confirm reference inputs, brand/logo handling, duration, audio support, and aspect ratio inside the target model before rendering.',
    };
  }
  return next;
}

/**
 * Build the JSON prompt object for a given model.
 * @param {object} fields  raw template fields
 * @param {string} modelId key in MODELS
 * @returns {object} ordered, model-adjusted prompt object
 */
export function buildPrompt(fields, modelId, options = {}) {
  const model = MODELS[modelId];
  const inputFields = options.styleMode === 'descriptive' ? descriptiveStyleFields(fields) : fields;
  let groups = groupFields(inputFields);

  // model adjustments
  if (!model.audio) delete groups.audio;
  if (groups.technical?.duration_seconds > model.maxDuration) {
    groups.technical.duration_seconds = model.maxDuration;
  }
  if (groups.references && model.referenceNotes) {
    groups.references.model_handling ??= model.referenceNotes;
  }
  groups = applyDepth(groups, options.depth ?? DEFAULT_DEPTH);

  const out = {};
  for (const group of model.fieldOrder) {
    if (groups[group]) out[group] = collapse(groups[group]);
  }
  // any group not in the model's order still gets appended (never silently dropped)
  for (const [group, value] of Object.entries(groups)) {
    if (!(group in out) && model.fieldOrder.includes(group) === false && (model.audio || group !== 'audio')) {
      out[group] = collapse(value);
    }
  }
  return out;
}

export function promptJson(fields, modelId, options = {}) {
  return JSON.stringify(buildPrompt(fields, modelId, options), null, 2);
}

// Plain-language explanation of what each top-level block does, for the on-page field guide.
export const GROUP_DOCS = {
  subject: 'Who or what the shot is about. Keep it to one clear subject — models blur focus when given several.',
  action: 'What visibly happens during the clip. Describe motion the camera can see, not internal states.',
  scene: 'Where it happens: location, time of day, weather, mood of the space.',
  camera: 'Shot framing and movement. One movement per clip reads best on every current model.',
  lighting: 'Light source, quality and shadow behavior. The single highest-leverage block for realism.',
  style: 'Aesthetic direction: film stock, color palette, references, tone.',
  references: 'Optional image inputs: product, character face, or style frame. Use these where the model supports references; otherwise treat them as setup notes.',
  brand: 'Brand constraints: colors, logo handling and voice. Models approximate hex colors and cannot render exact logos reliably; use a reference image or add exact logos in post.',
  audio: 'Dialogue, ambient sound and music. Only Veo 3.1, Kling 3.0 and Seedance 2.0 render audio natively.',
  technical: 'Render settings: aspect ratio, duration, fps, seed for reproducibility, negative prompt.',
  production_notes: 'Advanced operator checklist for settings the generator may expose outside the prompt box.',
};
