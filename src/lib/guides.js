// Editorial guide content per model for /models/[id]/ pages.
// Keep factual claims aligned with src/lib/models.js.

export const GUIDES = {
  'veo-3-1': {
    intro:
      "Veo 3.1 is Google's flagship video model and one of the strongest all-around choices for cinematic output. Its default look sits close to high-end stock footage, it handles fabric, hair and water physics convincingly, and it is the model where structured prompting pays off most: separate scene, camera, lighting and audio into distinct blocks.",
    sections: [
      {
        h: 'How to prompt Veo 3.1 with JSON',
        p: "Paste the JSON directly as your text prompt. Veo treats each block as a constraint. The highest-leverage blocks are lighting, where a named light source and quality affect realism, and audio, which is rendered natively and synchronized. Keep clips to one camera movement; stacked moves often produce unintended cuts.",
      },
      {
        h: 'Where to run it',
        p: 'Free tier: the Gemini app includes Veo generations with a daily cap, enough to test templates before committing. For serious volume use Flow or the Vertex AI / fal.ai APIs. Treat 8-second clips as the safest production default because 1080p, 4K and reference-image workflows require 8 seconds.',
      },
      {
        h: 'Limits to design around',
        p: 'Veo durations are 4, 6 or 8 seconds, with 8 seconds required for 1080p, 4K and reference images. Write templates as single shots, not scenes, and chain shots with a locked style block for continuity. Veo also refuses recognizable public figures and copyrighted characters; write archetypes instead ("a late-night host in his 60s", not a name).',
      },
    ],
  },
  'kling-3-0': {
    intro:
      'Kling 3.0 is strongest when you treat the prompt like a directed scene: subject, movement, scene, camera language and lighting. Its official guides emphasize native audio-visual output, element references and multi-shot storyboarding; exact duration and resolution caps vary by mode, so keep this site conservative where the public docs are not explicit.',
    sections: [
      {
        h: 'How to prompt Kling 3.0 with JSON',
        p: "Kling prompt guidance is scene-aware: write the action block like a director's shot note rather than a keyword list. For multi-shot work, structure the action as concise shot beats and keep the style block identical across beats.",
      },
      {
        h: 'Where references help',
        p: 'Use element references when the product, outfit, character or scene must stay stable across movement. If a brand object matters, a real reference image is more reliable than text alone.',
      },
      {
        h: 'Where to run it',
        p: 'The official Kling app has the full feature set. Some third-party hosts expose Kling alongside Seedance and Wan, which is useful for cross-model testing, but public specs can vary by host and mode.',
      },
    ],
  },
  'seedance-2-0': {
    intro:
      "ByteDance's Seedance 2.0 is a strong multimodal video model with image, video and audio reference workflows exposed through hosted APIs. Give it a reference frame plus a structured prompt when character, product or brand consistency matters. It is also one of the more doctrine-driven prompters on this list: block order genuinely matters.",
    sections: [
      {
        h: 'How to prompt Seedance 2.0 with JSON',
        p: 'Seedance responds best to a strict block order: CAMERA -> SUBJECT -> ACTION -> ENVIRONMENT -> LIGHTING -> STYLE, which is how this site orders the JSON on the Seedance tab. Keep the camera block to a shot type plus a single movement; stacked movements visibly degrade output.',
      },
      {
        h: 'References are the superpower',
        p: 'For character-driven or product-driven content, pair the JSON with a strong reference frame. The text should describe the motion and scene behavior; the reference should carry identity, product shape or brand look.',
      },
      {
        h: 'Where to run it',
        p: 'Dreamina is ByteDance-owned, and several hosted APIs expose Seedance 2 workflows. Check the host before rendering because duration, resolution, audio and reference support can vary by integration.',
      },
    ],
  },
  'wan-2-2': {
    intro:
      'Wan is the open-weights path. Wan 2.2 has downloadable weights and a practical text/image-to-video workflow, while later hosted Wan variants on commercial platforms may expose extra controls. If you want local generation and full control, Wan 2.2 in ComfyUI is the relevant baseline.',
    sections: [
      {
        h: 'How to prompt Wan with JSON',
        p: 'Keep it leaner than Veo or Kling: lead with subject and action, keep the strongest three style modifiers, and drop the audio block entirely for open-weights Wan. The Wan tab trims the JSON accordingly.',
      },
      {
        h: 'Open weights vs. hosted Wan',
        p: 'Hosted Wan variants may add controls that the open-weights 2.2 baseline does not have. Use this site as a conservative text/image-to-video prompt shape, then adapt to the host controls available.',
      },
      {
        h: 'Setup',
        p: 'Grab the weights from the official Wan-Video GitHub or the Wan-AI HuggingFace org and run through ComfyUI. Budget an afternoon for setup and expect slower iteration than hosted models.',
      },
    ],
  },
  'runway-gen-4-5': {
    intro:
      "Runway Gen-4.5 is a production-control choice: clear text prompts, image-to-video workflows, camera controls and reference-driven consistency. Use this site's JSON as a shot sheet for the Runway controls as much as a text prompt.",
    sections: [
      {
        h: 'How to use JSON prompts with Runway',
        p: "Runway rewards short text prompts plus heavy use of its UI controls. The camera block is your settings checklist, the subject block doubles as your reference-image tagging description, and the action block becomes the short text prompt.",
      },
      {
        h: 'Where it wins',
        p: 'Anything requiring take-to-take consistency: brand work, multi-shot narratives with the same cast, and iterating a single shot until the motion is right. No native video audio; plan sound in post.',
      },
    ],
  },
};
