// Editorial guide content per model — the long-form half of /models/[id]/ pages.
// Written July 2026; revise when models version-bump.

export const GUIDES = {
  'veo-3-1': {
    intro:
      "Veo 3.1 is Google's flagship video model and, as of mid-2026, the best all-around choice for cinematic output. Its default look sits closer to high-end stock footage than any competitor, it handles fabric, hair and water physics convincingly, and it is the model where JSON prompting pays off most: give it separate blocks for scene, camera, lighting and audio and it respects each one independently.",
    sections: [
      {
        h: 'How to prompt Veo 3.1 with JSON',
        p: "Paste the JSON directly as your text prompt — no wrapper text needed. Veo parses the structure and treats each block as a constraint. The highest-leverage blocks are lighting (Veo's realism comes alive with a named light source and quality) and audio, which is rendered natively and synchronized: dialogue in quotes, ambient sound described plainly, music by genre and intensity. Keep clips to one camera movement; Veo will invent cuts if you stack movements, and they are rarely the cuts you wanted.",
      },
      {
        h: 'Where to run it',
        p: 'Free tier: the Gemini app includes Veo generations with a daily cap — enough to test templates before committing. For serious volume use Flow (Google\'s filmmaking UI, best for chaining 8-second clips into scenes with a shared seed) or the Vertex AI / fal.ai APIs for programmatic work.',
      },
      {
        h: 'Limits to design around',
        p: 'The 8-second cap is the big one: write templates as single shots, not scenes, and chain them in Flow with a locked seed and an identical style block for continuity. Veo also refuses recognizable public figures and copyrighted characters — write archetypes instead ("a late-night host in his 60s", not a name).',
      },
    ],
  },
  'kling-3-0': {
    intro:
      "Kling 3.0 is the value-per-clip leader and the only mainstream model with genuinely native multi-shot generation: describe a three-shot sequence in one prompt and it renders the cuts. Clips run up to 15 seconds at up to 4K/60fps, with multilingual lip-sync that makes it the default for talking-head and dialogue formats.",
    sections: [
      {
        h: 'How to prompt Kling 3.0 with JSON',
        p: 'Kling was built on a scene-aware architecture — it reasons about subjects, spatial relationships and camera position, so write the action block like a director\'s shot note rather than a keyword list. For multi-shot, structure the action as "Shot 1: … Shot 2: … Shot 3: …" and keep the style block identical across shots; Kling holds character identity across the cuts surprisingly well.',
      },
      {
        h: 'Turbo vs. standard',
        p: 'Kling 3.0 Turbo renders the same prompts faster and cheaper at slightly lower fidelity. Iterate on Turbo, do the final render on standard. Both accept identical JSON.',
      },
      {
        h: 'Where to run it',
        p: "The official Kling app has the full feature set including Motion Control. Higgsfield and fal.ai both host Kling 3.0 alongside Seedance and Wan, which is convenient for cross-model testing — your prompts here cross-work with Seedance 2.0 with little translation.",
      },
    ],
  },
  'seedance-2-0': {
    intro:
      "ByteDance's Seedance 2.0 sits at the top of the Artificial Analysis leaderboard and is the strongest image-to-video model available: give it a reference frame plus a structured prompt and it produces the most character-consistent sequences of any current model. It is also the most doctrine-driven prompter on this list — block order genuinely matters.",
    sections: [
      {
        h: 'How to prompt Seedance 2.0 with JSON',
        p: 'Seedance responds best to a strict block order: CAMERA → SUBJECT → ACTION → ENVIRONMENT → LIGHTING → STYLE, which is exactly how our templates order the JSON on the Seedance tab. Keep the camera block to a shot type plus a single movement — stacked movements visibly degrade output. Six tight blocks beat twelve loose ones.',
      },
      {
        h: 'Image-to-video is the superpower',
        p: 'For character-driven content, generate a strong keyframe first (any image model), then feed it to Seedance with your JSON as the motion direction. This is currently the most reliable character-consistency workflow in AI video, and it is how most long-form AI content is actually being chained in 2026.',
      },
      {
        h: 'Where to run it',
        p: 'Dreamina (ByteDance\'s own app) has first-party access; Higgsfield, fal.ai and WaveSpeed host it via API. Prompts written for Kling 3.0 generally run here unchanged, so test on whichever is cheaper for you that week.',
      },
    ],
  },
  'wan-2-2': {
    intro:
      'Wan is the open-source path. Wan 2.2 is the latest version with genuinely downloadable weights — a Mixture-of-Experts video model that runs on a single 24GB GPU — while "Wan 2.5/2.6/2.7" are closed, hosted-API versions on commercial platforms. If you want unlimited free generation and full control, Wan 2.2 in ComfyUI is the only real answer in 2026.',
    sections: [
      {
        h: 'How to prompt Wan with JSON',
        p: 'Keep it leaner than Veo or Kling: lead with subject and action, keep the strongest three style modifiers, and drop the audio block entirely — open-weights Wan renders silent video. Our Wan tab trims the JSON accordingly. Structured prompts still outperform prose here, but Wan rewards brevity more than the hosted models do.',
      },
      {
        h: 'Open weights vs. hosted Wan',
        p: 'Hosted Wan 2.6 (Higgsfield, WaveSpeed) adds multi-shot, audio sync and reference-based character consistency — the fuller JSON from other tabs works there. Self-hosted 2.2 trades those features for zero marginal cost and no content-policy gatekeeping, which is why it dominates certain workflows.',
      },
      {
        h: 'Setup',
        p: 'Grab the weights from the official Wan-Video GitHub or the Wan-AI HuggingFace org and run through ComfyUI. Budget an afternoon for setup and expect slower iteration than any hosted model — the trade is cost, not convenience.',
      },
    ],
  },
  'runway-gen-4-5': {
    intro:
      "Runway Gen-4.5 is the professional's pick — not because raw output beats Veo or Seedance, but because no other tool gives you the same control surface: explicit camera controls, motion brush for directing movement within the frame, and reference-driven character consistency that production teams can actually rely on.",
    sections: [
      {
        h: 'How to use JSON prompts with Runway',
        p: "Runway rewards short text prompts plus heavy use of its UI controls, so use our JSON differently here: the camera block is your settings checklist for Runway's camera controls, the subject block doubles as your reference-image tagging description, and the action block becomes the short text prompt. Think of the JSON as a shot sheet, not a paste-and-go prompt.",
      },
      {
        h: 'Where it wins',
        p: 'Anything requiring take-to-take consistency: brand work, multi-shot narratives with the same cast, and iterating a single shot until the motion is exactly right. No audio — plan sound in post, which production workflows do anyway.',
      },
    ],
  },
};
