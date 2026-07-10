// Turns raw template fields into a model-shaped JSON prompt object.
// Fields are grouped semantically, then ordered per the target model's doctrine.

import { MODELS } from './models.js';

// raw field key → semantic group
const FIELD_GROUP = {
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

  lighting_type: 'lighting',
  light_quality: 'lighting',
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
  sound_effects: 'audio',
  background_audio: 'audio',
  environment_audio: 'audio',
  dialogue_style: 'audio',
  voice_tone: 'audio',

  aspect_ratio: 'technical',
  seed: 'technical',
  fps: 'technical',
  duration_s: 'technical',
  creativity: 'technical',
  negative: 'technical',
  lock_identity: 'technical',
  lock_style: 'technical',
};

// raw key → key used inside the output JSON
const KEY_RENAME = {
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
  lighting_type: 'type',
  light_quality: 'quality',
  style: 'aesthetic',
  stylized_style: 'aesthetic',
  music_style: 'music',
  audio: 'description',
  duration_s: 'duration_seconds',
  negative: 'negative_prompt',
};

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

/**
 * Build the JSON prompt object for a given model.
 * @param {object} fields  raw template fields
 * @param {string} modelId key in MODELS
 * @returns {object} ordered, model-adjusted prompt object
 */
export function buildPrompt(fields, modelId) {
  const model = MODELS[modelId];
  const groups = groupFields(fields);

  // model adjustments
  if (!model.audio) delete groups.audio;
  if (groups.technical?.duration_seconds > model.maxDuration) {
    groups.technical.duration_seconds = model.maxDuration;
  }

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

export function promptJson(fields, modelId) {
  return JSON.stringify(buildPrompt(fields, modelId), null, 2);
}

// Plain-language explanation of what each top-level block does, for the on-page field guide.
export const GROUP_DOCS = {
  subject: 'Who or what the shot is about. Keep it to one clear subject — models blur focus when given several.',
  action: 'What visibly happens during the clip. Describe motion the camera can see, not internal states.',
  scene: 'Where it happens: location, time of day, weather, mood of the space.',
  camera: 'Shot framing and movement. One movement per clip reads best on every current model.',
  lighting: 'Light source, quality and shadow behavior. The single highest-leverage block for realism.',
  style: 'Aesthetic direction: film stock, color palette, references, tone.',
  audio: 'Dialogue, ambient sound and music. Only Veo 3.1, Kling 3.0 and Seedance 2.0 render audio natively.',
  technical: 'Render settings: aspect ratio, duration, fps, seed for reproducibility, negative prompt.',
};
