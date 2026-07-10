// Unified catalog built from the legacy data files.
// Normalizes templates.js (154 leveled templates in 50 categories) and
// ViralTemplates.js (viral formats with fill-in variables) into flat,
// slug-addressable collections used by getStaticPaths.

import { templates } from '../data/templates.js';
import { viralTemplates } from '../data/ViralTemplates.js';
import { characterPresets } from '../data/characterPresetsData.js';
import { scenePresets } from '../data/scenePresetsData.js';
import { actionPresets } from '../data/actionPresetsData.js';
import { directorStyles } from '../data/directorStylesData.js';
import { audioPresets } from '../data/audioPresetsData.js';
import { assertKnownFieldKeys, isFullPrompt } from './format.js';

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

// ---------- preset collections → categories ----------
// 342 rich presets from the legacy preset files become first-class prompt pages,
// grouped as "<Type>: <Category>" (e.g. "Scenes: Urban", "Action: Chase").

const PRESET_SOURCES = [
  { data: characterPresets, type: 'Characters', slugPrefix: 'characters', icon: '👤' },
  { data: scenePresets, type: 'Scenes', slugPrefix: 'scenes', icon: '📍' },
  { data: actionPresets, type: 'Action', slugPrefix: 'action', icon: '🎬' },
  { data: directorStyles, type: 'Styles', slugPrefix: 'styles', icon: '🎨' },
  { data: audioPresets, type: 'Audio', slugPrefix: 'audio', icon: '🔊' },
];

function sourceItems(data) {
  return Object.values(data).filter((item) => item.fields);
}

const standardTemplateItems = Object.values(templates).flatMap((cat) =>
  Object.values(cat.levels ?? {}).filter((item) => item.fields)
);

assertKnownFieldKeys(
  [
    ...standardTemplateItems,
    ...sourceItems(characterPresets),
    ...sourceItems(scenePresets),
    ...sourceItems(actionPresets),
    ...sourceItems(directorStyles),
    ...sourceItems(audioPresets),
    ...Object.values(viralTemplates)
      .filter((item) => item.fixed_fields)
      .map((item) => ({ fields: item.fixed_fields })),
  ],
  'catalog data'
);

function presetCategories() {
  const out = [];
  for (const src of PRESET_SOURCES) {
    const byCat = {};
    for (const [key, p] of Object.entries(src.data)) {
      if (!p.fields || Object.keys(p.fields).length < 4) continue;
      (byCat[p.category ?? 'general'] ??= []).push({ key, ...p });
    }
    for (const [cat, items] of Object.entries(byCat)) {
      const catSlug = `${src.slugPrefix}-${slugify(cat)}`;
      const catName = `${src.type}: ${titleFromKey(cat.replace(/-/g, '_'))}`;
      const seen = new Set();
      out.push({
        slug: catSlug,
        name: catName,
        icon: src.icon,
        description: `${items.length} ${titleFromKey(cat.replace(/-/g, '_')).toLowerCase()} ${src.type.toLowerCase()} presets — drop into any template or use standalone.`,
        templates: items.map((p) => {
          let slug = slugify(p.id ?? p.name);
          while (seen.has(slug)) slug = `${slug}-x`;
          seen.add(slug);
          return {
            slug,
            categorySlug: catSlug,
            categoryName: catName,
            name: p.name,
            description: p.description ?? '',
            useCase: p.useCase ?? '',
            tags: p.tags ?? [],
            fields: p.fields,
          };
        }),
      });
    }
  }
  return out;
}

// ---------- standard templates ----------

const templateCategories = Object.entries(templates).map(([key, cat]) => {
  const catSlug = slugify(key);
  const seen = new Set();
  const allItems = Object.entries(cat.levels ?? {}).map(([level, tpl]) => {
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
  const items = allItems.filter((item) => isFullPrompt(item.fields));
  const addOns = allItems.filter((item) => !isFullPrompt(item.fields));
  return {
    slug: catSlug,
    name: cat.name ?? titleFromKey(key),
    icon: cat.icon ?? '🎬',
    description: cat.description ?? '',
    templates: items,
    addOns,
  };
});

export const categories = [...templateCategories, ...presetCategories()];

export const allTemplates = categories.flatMap((c) => c.templates);
export const allAddOns = categories.flatMap((c) => c.addOns ?? []);

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
