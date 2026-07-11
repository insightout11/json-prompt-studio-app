// Model registry: the single source of truth for supported AI video models.
// Every factual claim here should have a primary or official source and a current
// lastVerified date. Last pass: 2026-07-11.

export const MODELS = {
  'veo-3-1': {
    id: 'veo-3-1',
    name: 'Veo 3.1',
    vendor: 'Google',
    tagline: 'Best all-around cinematic quality with native synchronized audio',
    maxDuration: 8,
    resolution: '720p / 1080p / 4K',
    specs: {
      durations: '8s',
      resolution: '720p, 1080p, or 4K',
      fps: '24fps',
      audio: 'native',
      inputs: 'text, image, first/last keyframes, references',
    },
    lastVerified: '2026-07-11',
    sources: [
      { label: 'Google AI for Developers: Veo 3.1', href: 'https://ai.google.dev/gemini-api/docs/veo' },
      { label: 'Google Cloud: Veo video generation', href: 'https://cloud.google.com/vertex-ai/generative-ai/docs/video/generate-videos' },
    ],
    audio: true,
    multiShot: false,
    referenceNotes: 'Supports image inputs and reference-driven workflows; use product or style frames when exact object appearance matters.',
    access: ['Gemini app', 'Flow', 'Vertex AI API', 'fal.ai'],
    strengths: ['photorealism', 'physics accuracy', 'native audio & dialogue', 'prompt fidelity'],
    notes: [
      'Veo 3.1 follows structured prompts unusually well: lock camera, lighting and audio as separate JSON fields.',
      'Native audio: describe dialogue, ambient sound and music directly in the audio field.',
      'Gemini API documentation describes Veo 3.1 as generating 8-second videos; use separate clips for longer pieces.',
      'Use reference images for products, people or style frames where visual consistency matters.',
    ],
    fieldOrder: ['references', 'brand', 'scene', 'subject', 'action', 'camera', 'lighting', 'style', 'audio', 'technical', 'production_notes'],
  },
  'kling-3-0': {
    id: 'kling-3-0',
    name: 'Kling 3.0',
    vendor: 'Kuaishou',
    tagline: 'Native audio, element references and multi-shot storyboarding',
    maxDuration: 15,
    resolution: 'mode-dependent',
    specs: {
      durations: 'expanded limits; exact caps vary by mode',
      resolution: 'mode-dependent',
      fps: 'mode-dependent',
      audio: 'native audio-visual output',
      inputs: 'text, image, audio, video, element references',
    },
    lastVerified: '2026-07-11',
    sources: [
      { label: 'Kling: VIDEO 3.0 Omni model guide', href: 'https://app.klingai.com/global/quickstart/klingai-video-3-omni-model-user-guide' },
      { label: 'Kling: VIDEO 3.0 model guide', href: 'https://app.klingai.com/global/quickstart/klingai-video-3-model-user-guide' },
      { label: 'Kling: text-to-video prompt guide', href: 'https://app.klingai.com/global/quickstart/text-to-video-prompt-guide' },
    ],
    audio: true,
    multiShot: true,
    referenceNotes: 'Use element references for products, outfits, characters or scenes when consistency matters.',
    access: ['Kling app', 'Higgsfield', 'fal.ai', 'Pollo AI'],
    strengths: ['multi-shot sequences', 'lip-sync', 'motion control', 'element consistency'],
    notes: [
      'Kling prompt guidance emphasizes Subject, Movement, Scene, Camera Language and Lighting.',
      'Write the action field as a shot note, not a keyword list.',
      'For multi-shot work, separate the action into concise shot beats rather than one long prose paragraph.',
      'Element references are useful when the product or character must stay stable across movement.',
    ],
    fieldOrder: ['references', 'brand', 'subject', 'action', 'scene', 'camera', 'lighting', 'style', 'audio', 'technical', 'production_notes'],
  },
  'seedance-2-0': {
    id: 'seedance-2-0',
    name: 'Seedance 2.0',
    vendor: 'ByteDance',
    tagline: 'Multimodal audio-video generation with strong reference support',
    maxDuration: 15,
    resolution: '480p / 720p / 1080p / 4K via hosted tiers',
    specs: {
      durations: '4-15s',
      resolution: '480p, 720p, 1080p, 4K ratios in Runway API',
      fps: 'provider-dependent',
      audio: 'native synchronized audio on supported hosts',
      inputs: 'text, image, video, audio references',
    },
    lastVerified: '2026-07-11',
    sources: [
      { label: 'Runway API changelog: Seedance 2.0', href: 'https://docs.dev.runwayml.com/api-details/api_changelog/' },
      { label: 'Runway API input parameters', href: 'https://docs.dev.runwayml.com/assets/inputs/' },
      { label: 'BytePlus: Dreamina Seedance API', href: 'https://www.byteplus.com/en/product/seedance' },
      { label: 'Seedance 2.0 technical report', href: 'https://arxiv.org/abs/2604.14148' },
    ],
    audio: true,
    multiShot: true,
    referenceNotes: 'Hosted Seedance 2 workflows support reference image, video and audio inputs; keep reference intent explicit.',
    access: ['Dreamina', 'Higgsfield', 'Runway API', 'fal.ai', 'WaveSpeed'],
    strengths: ['multi-modal references', 'image-to-video', 'native audio', 'multi-shot structure'],
    notes: [
      'Use a strict block order: CAMERA -> SUBJECT -> ACTION -> ENVIRONMENT -> LIGHTING -> STYLE.',
      'Keep the camera block to a shot type plus one movement; stacking moves degrades output.',
      'Reference frames are valuable for product, character and brand consistency.',
      'Runway API documentation lists Seedance 2.0 duration support as 4-15 seconds.',
    ],
    fieldOrder: ['references', 'brand', 'camera', 'subject', 'action', 'scene', 'lighting', 'style', 'audio', 'technical', 'production_notes'],
  },
  'wan-2-2': {
    id: 'wan-2-2',
    name: 'Wan 2.2',
    vendor: 'Alibaba',
    tagline: 'The open-weights option for self-hosted text/image-to-video',
    maxDuration: 10,
    resolution: '720p @ 24fps open weights',
    specs: {
      durations: 'workflow-dependent',
      resolution: '720p open-weights TI2V',
      fps: '24fps',
      audio: 'none in base text/image-to-video pipeline',
      inputs: 'text-to-video and image-to-video',
    },
    lastVerified: '2026-07-11',
    sources: [
      { label: 'Wan-Video/Wan2.2 GitHub', href: 'https://github.com/Wan-Video/Wan2.2' },
      { label: 'Wan-Video/Wan2.1 GitHub', href: 'https://github.com/Wan-Video/Wan2.1' },
    ],
    audio: false,
    multiShot: false,
    referenceNotes: 'Open-weights Wan 2.2 supports text-to-video and image-to-video; treat product/style references as image-to-video setup notes.',
    access: ['ComfyUI', 'HuggingFace', 'Higgsfield hosted variants', 'WaveSpeed hosted variants'],
    strengths: ['open weights', 'self-hostable', '720p/24fps', 'image-to-video'],
    notes: [
      'Wan 2.2 is the latest version with genuinely open, downloadable weights.',
      'Open-weights Wan 2.2 has no native audio track in the base text/image-to-video pipeline.',
      'Keep prompts shorter than for Veo or Kling: lead with subject and action, trim style to the strongest three modifiers.',
      'Use image-to-video when exact product shape or character appearance matters.',
    ],
    fieldOrder: ['references', 'brand', 'subject', 'action', 'scene', 'camera', 'lighting', 'style', 'technical', 'production_notes'],
  },
  'runway-gen-4-5': {
    id: 'runway-gen-4-5',
    name: 'Runway Gen-4.5',
    vendor: 'Runway',
    tagline: 'The pro pick for image-driven consistency and control surfaces',
    maxDuration: 10,
    resolution: '720p',
    specs: {
      durations: '2-10s',
      resolution: '720p; output dimensions vary by aspect ratio',
      fps: '24fps or 25fps',
      audio: 'none in video generation',
      inputs: 'text-to-video and image-to-video',
    },
    lastVerified: '2026-07-11',
    sources: [
      { label: 'Runway: Creating with Gen-4.5', href: 'https://help.runwayml.com/hc/en-us/articles/46974685288467-Creating-with-Gen-4-5' },
      { label: 'Runway API input parameters', href: 'https://docs.dev.runwayml.com/assets/inputs/' },
      { label: 'Runway API changelog: Gen-4.5', href: 'https://docs.dev.runwayml.com/api-details/api_changelog/' },
    ],
    audio: false,
    multiShot: false,
    referenceNotes: 'Gen-4.5 supports text-to-video and image-to-video; reference images are often more important than long prompt text for consistency.',
    access: ['Runway web app', 'Runway API'],
    strengths: ['camera control', 'image-to-video', 'reference-driven consistency', 'production workflows'],
    notes: [
      'Runway recommends clear, direct language; text-to-video should describe both visual elements and motion.',
      'Image-to-video prompts should focus on describing the motion of the scene.',
      'No native audio in Gen-4.5 video generation: plan sound in post.',
      'Keep the text prompt tight and use Runway controls for camera and motion where available.',
    ],
    fieldOrder: ['references', 'brand', 'subject', 'action', 'camera', 'scene', 'lighting', 'style', 'technical', 'production_notes'],
  },
};

export const MODEL_LIST = Object.values(MODELS);
export const DEFAULT_MODEL = 'veo-3-1';

export function modelSpecLine(model) {
  const specs = model.specs ?? {};
  return [
    model.vendor,
    specs.durations ? `duration ${specs.durations}` : `max ${model.maxDuration}s`,
    specs.resolution ?? model.resolution,
    specs.audio ? `audio ${specs.audio}` : `audio ${model.audio ? 'native' : 'none'}`,
    model.lastVerified ? `verified ${model.lastVerified}` : '',
  ]
    .filter(Boolean)
    .join(' · ');
}

// Sora is retired but still searched for heavily: kept for the migration page only.
export const SORA_STATUS = {
  appDiscontinued: 'April 26, 2026',
  apiDiscontinued: 'September 24, 2026',
};
