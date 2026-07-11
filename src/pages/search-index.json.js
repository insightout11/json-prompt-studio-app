// Build-time search index for the client-side site search.
// Kept intentionally small: title, description, keywords, url, kind.

import { allTemplates, viralItems } from '../lib/catalog.js';
import { MODEL_LIST } from '../lib/models.js';

export function GET() {
  const entries = [
    ...allTemplates.map((t) => ({
      t: t.name,
      d: t.description,
      g: [t.categoryName, t.format, ...(t.tags ?? [])].filter(Boolean).join(' '),
      u: `/prompts/${t.categorySlug}/${t.slug}/`,
      k: t.isAdTemplate ? 'ad template' : 'template',
    })),
    ...viralItems.map((v) => ({
      t: v.name,
      d: v.description,
      g: `${v.categoryName} viral ${v.tagline}`,
      u: `/viral/${v.slug}/`,
      k: 'viral format',
    })),
    ...MODEL_LIST.map((m) => ({
      t: `${m.name} guide`,
      d: m.tagline,
      g: `${m.vendor} model guide specs prompting`,
      u: `/models/${m.id}/`,
      k: 'model guide',
    })),
    { t: 'Prompt builder', d: 'Mix presets and your own text into a model-shaped JSON prompt', g: 'builder tool brand kit', u: '/builder/', k: 'tool' },
    { t: 'Idea converter', d: 'Turn an ad idea into a proven prompt structure', g: 'convert converter idea tool', u: '/convert/', k: 'tool' },
    { t: 'Ad & UGC flagships', d: 'Production-grade ad prompt structures', g: 'ads ugc product commercial', u: '/ads/', k: 'section' },
    { t: 'Sora alternatives', d: 'Sora is discontinued — where to migrate and how', g: 'sora migration openai discontinued', u: '/sora-alternatives/', k: 'guide' },
  ];

  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json' },
  });
}
