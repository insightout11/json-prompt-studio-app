// Model registry — the single source of truth for supported AI video models.
// Facts verified July 2026. Update `notes` and specs when models version-bump.

export const MODELS = {
  'veo-3-1': {
    id: 'veo-3-1',
    name: 'Veo 3.1',
    vendor: 'Google',
    tagline: 'Best all-around cinematic quality with native synchronized audio',
    maxDuration: 8,
    resolution: '1080p (4K upscale)',
    audio: true,
    multiShot: false,
    access: ['Gemini app', 'Flow', 'Vertex AI API', 'fal.ai'],
    strengths: ['photorealism', 'physics accuracy', 'native audio & dialogue', 'prompt fidelity'],
    notes: [
      'Veo 3.1 follows structured prompts unusually well — lock camera, lighting and audio as separate JSON fields and it respects each one.',
      'Native audio: describe dialogue, ambient sound and music directly in the audio field.',
      'Clips cap at 8 seconds. For longer pieces, chain clips in Flow using a shared seed and identical style block.',
      'Vertical 9:16 is natively supported — no cropping needed for Shorts and TikTok.',
    ],
    fieldOrder: ['scene', 'subject', 'action', 'camera', 'lighting', 'style', 'audio', 'technical'],
  },
  'kling-3-0': {
    id: 'kling-3-0',
    name: 'Kling 3.0',
    vendor: 'Kuaishou',
    tagline: 'Multi-shot native, 4K/60fps, up to 15s — the best value per clip',
    maxDuration: 15,
    resolution: '4K / 60fps',
    audio: true,
    multiShot: true,
    access: ['Kling app', 'Higgsfield', 'fal.ai', 'Pollo AI'],
    strengths: ['multi-shot sequences', 'lip-sync (multilingual)', 'motion control', 'price/performance'],
    notes: [
      'Kling 3.0 reasons about the scene like a director — write the action field as a shot note, not a keyword list.',
      'Multi-shot is the signature feature: split the action into "Shot 1: … Shot 2: …" inside the action field for cuts within one generation.',
      'Turbo variant renders faster and cheaper at slightly lower fidelity — same prompt works on both.',
      'Kling prompts cross-work with Seedance 2.0 with little translation; both respond to structured scene-level description.',
    ],
    fieldOrder: ['subject', 'action', 'scene', 'camera', 'lighting', 'style', 'audio', 'technical'],
  },
  'seedance-2-0': {
    id: 'seedance-2-0',
    name: 'Seedance 2.0',
    vendor: 'ByteDance',
    tagline: 'Top of the Artificial Analysis leaderboard; strongest image-to-video',
    maxDuration: 12,
    resolution: '2K native',
    audio: true,
    multiShot: true,
    access: ['Dreamina', 'Higgsfield', 'fal.ai', 'WaveSpeed'],
    strengths: ['leaderboard-top quality', 'image-to-video', 'long-form chaining', 'character consistency'],
    notes: [
      'Seedance responds best to a strict block order: CAMERA → SUBJECT → ACTION → ENVIRONMENT → LIGHTING → STYLE. The JSON below is ordered to match.',
      'Keep the camera block to a shot type plus one movement — stacking movements degrades output.',
      'Strongest image-to-video model available: pair this JSON with a reference frame for character-consistent sequences.',
      'Prompts written for Kling 3.0 generally work here unchanged.',
    ],
    fieldOrder: ['camera', 'subject', 'action', 'scene', 'lighting', 'style', 'audio', 'technical'],
  },
  'wan-2-2': {
    id: 'wan-2-2',
    name: 'Wan 2.2 / 2.6',
    vendor: 'Alibaba',
    tagline: 'The open-weights option — self-host free, or use Wan 2.6 via API',
    maxDuration: 10,
    resolution: '1080p',
    audio: false,
    multiShot: false,
    access: ['ComfyUI (open weights)', 'HuggingFace', 'Higgsfield (2.6)', 'WaveSpeed (2.6)'],
    strengths: ['free & self-hostable (2.2)', 'MoE architecture', 'no content filter lock-in', 'runs on 24GB GPUs'],
    notes: [
      'Wan 2.2 is the latest version with genuinely open, downloadable weights. "Wan 2.5/2.6/2.7" are hosted API-only versions on commercial platforms.',
      'Open-weights Wan 2.2 has no audio track — drop the audio field or move sound design to post.',
      'Keep prompts shorter than for Veo or Kling: lead with subject and action, trim stylistic modifiers to the strongest three.',
      'Wan 2.6 (hosted) adds multi-shot and audio sync — the fuller JSON works there.',
    ],
    fieldOrder: ['subject', 'action', 'scene', 'camera', 'style', 'technical'],
  },
  'runway-gen-4-5': {
    id: 'runway-gen-4-5',
    name: 'Runway Gen-4.5',
    vendor: 'Runway',
    tagline: 'The pro pick for granular control: camera, motion brush, references',
    maxDuration: 10,
    resolution: '1080p',
    audio: false,
    multiShot: false,
    access: ['Runway web app', 'Runway API'],
    strengths: ['camera control', 'motion brush', 'reference-driven consistency', 'production workflows'],
    notes: [
      'Runway exposes camera controls in the UI — use the camera block here as your settings checklist rather than prompt text.',
      'Gen-4.5 excels with reference images: the subject field doubles as your reference-tagging description.',
      'No native audio — plan sound in post.',
      'Keep the text prompt tight; Runway rewards short prompts plus heavy use of its control surfaces.',
    ],
    fieldOrder: ['subject', 'action', 'camera', 'scene', 'lighting', 'style', 'technical'],
  },
};

export const MODEL_LIST = Object.values(MODELS);
export const DEFAULT_MODEL = 'veo-3-1';

// Sora is retired but still searched for heavily — kept for the migration page only.
export const SORA_STATUS = {
  appDiscontinued: 'April 26, 2026',
  apiDiscontinued: 'September 24, 2026',
};
