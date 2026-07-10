// Outbound "run this prompt" links. Swap the href values for affiliate/ref
// URLs as programs are joined — every template page renders these.

export const RUN_LINKS = [
  { id: 'gemini', label: 'Veo 3.1 — free in Gemini', href: 'https://gemini.google.com/', models: ['veo-3-1'] },
  { id: 'flow', label: 'Veo 3.1 — Google Flow', href: 'https://labs.google/flow', models: ['veo-3-1'] },
  { id: 'kling', label: 'Kling 3.0 — official app', href: 'https://app.klingai.com/', models: ['kling-3-0'] },
  { id: 'higgsfield', label: 'Higgsfield — Kling, Seedance & Wan', href: 'https://higgsfield.ai/', models: ['kling-3-0', 'seedance-2-0', 'wan-2-2'] },
  { id: 'fal', label: 'fal.ai — API playground', href: 'https://fal.ai/models', models: ['veo-3-1', 'kling-3-0', 'seedance-2-0'] },
  { id: 'dreamina', label: 'Seedance 2.0 — Dreamina', href: 'https://dreamina.capcut.com/', models: ['seedance-2-0'] },
  { id: 'runway', label: 'Runway Gen-4.5', href: 'https://runwayml.com/', models: ['runway-gen-4-5'] },
];

export function linksForModel(modelId) {
  return RUN_LINKS.filter((l) => l.models.includes(modelId));
}
