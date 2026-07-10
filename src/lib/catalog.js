// Unified catalog built from the legacy data files.
// Normalizes templates.js (154 leveled templates in 50 categories) and
// ViralTemplates.js (viral formats with fill-in variables) into flat,
// slug-addressable collections used by getStaticPaths.

import { templates } from '../data/templates.js';
import { viralTemplates } from '../data/ViralTemplates.js';

export function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function titleFromKey(key) {
  return key
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ---------- standard templates ----------

export const categories = Object.entries(templates).map(([key, cat]) => {
  const catSlug = slugify(key);
  const seen = new Set();
  const items = Object.entries(cat.levels ?? {}).map(([level, tpl]) => {
    let slug = slugify(tpl.name);
    while (seen.has(slug)) slug = `${slug}-${level}`;
    seen.add(slug);
    return {
      slug,
      categorySlug: catSlug,
      categoryName: cat.name ?? titleFromKey(key),
      level: Number(level),
      name: tpl.name,
      description: tpl.description ?? '',
      fields: tpl.fields ?? {},
    };
  });
  return {
    slug: catSlug,
    name: cat.name ?? titleFromKey(key),
    icon: cat.icon ?? '🎬',
    description: cat.description ?? '',
    templates: items,
  };
});

export const allTemplates = categories.flatMap((c) => c.templates);

export function getCategory(slug) {
  return categories.find((c) => c.slug === slug);
}

export function getTemplate(categorySlug, slug) {
  return getCategory(categorySlug)?.templates.find((t) => t.slug === slug);
}

// ---------- viral templates ----------

const VIRAL_CATEGORY_NAMES = {
  podcast: 'Fake Podcast Clips',
  street_interview: 'Street Interviews',
  asmr: 'ASMR & Satisfying',
  jealous_boyfriend: 'Reaction Formats',
  out_of_place: 'Out-of-Place Comedy',
};

export const viralItems = Object.entries(viralTemplates)
  .filter(([, v]) => v.fixed_fields) // skip style-only entries
  .map(([key, v]) => {
    // fill-in variables become {{placeholders}} in the JSON, listed with suggestions on-page
    const variables = Object.entries(v.user_inputs ?? {}).map(([vk, input]) => ({
      key: vk,
      label: input.label ?? titleFromKey(vk),
      placeholder: input.placeholder ?? '',
      suggestions: input.suggestions ?? [],
    }));
    const fields = { ...v.fixed_fields };
    for (const variable of variables) {
      fields[variable.key] = `{{${variable.key}}}`;
    }
    return {
      slug: slugify(key),
      name: v.name,
      category: v.category ?? 'other',
      categoryName: VIRAL_CATEGORY_NAMES[v.category] ?? titleFromKey(v.category ?? 'other'),
      tagline: v.tagline ?? '',
      description: v.description ?? '',
      fields,
      variables,
    };
  });

export function getViral(slug) {
  return viralItems.find((t) => t.slug === slug);
}

export const viralCategories = [...new Set(viralItems.map((t) => t.category))].map((c) => ({
  slug: slugify(c),
  key: c,
  name: VIRAL_CATEGORY_NAMES[c] ?? titleFromKey(c),
  items: viralItems.filter((t) => t.category === c),
}));
