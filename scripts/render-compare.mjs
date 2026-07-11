#!/usr/bin/env node
// Model-comparison render script (PLAN.md Phase 4).
//
// Renders the same flagship prompts across models via fal.ai's queue API and
// saves clips + metadata for the comparison gallery. Costs real money per run
// (~$1-3 per scene-model pair) — it never runs implicitly.
//
// Usage:
//   FAL_KEY=<your fal.ai key> node scripts/render-compare.mjs [--dry-run] [--scene <id>]
//
//   --dry-run  print the prompts and endpoints without submitting anything
//   --scene    render a single scene id from compare-scenes.json
//
// Output: renders/<date>/<scene>/<model>.mp4 + meta.json (prompt, endpoint,
// model version, timestamps, request ids) — everything a comparison page needs.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { getTemplate } = await import(pathToFileURL(join(ROOT, 'src/lib/catalog.js')));
const { buildPrompt } = await import(pathToFileURL(join(ROOT, 'src/lib/format.js')));

// fal.ai endpoint per site model id. VERIFY against https://fal.ai/models before
// the first paid run — endpoint ids change when models version-bump.
// veo3.1 and seedance-2.0 confirmed 2026-07-11; kling/wan ids need confirmation.
const ENDPOINTS = {
  'veo-3-1': { id: 'fal-ai/veo3.1', verified: '2026-07-11' },
  'seedance-2-0': { id: 'bytedance/seedance-2.0/text-to-video', verified: '2026-07-11' },
  'kling-3-0': { id: 'fal-ai/kling-video/v3/pro/text-to-video', verified: 'UNVERIFIED — check fal.ai/models' },
  'wan-2-2': { id: 'fal-ai/wan/v2.2-a14b/text-to-video', verified: 'UNVERIFIED — check fal.ai/models' },
};

const FAL_KEY = process.env.FAL_KEY;
const DRY_RUN = process.argv.includes('--dry-run');
const onlyScene = process.argv.includes('--scene')
  ? process.argv[process.argv.indexOf('--scene') + 1]
  : null;

const config = JSON.parse(await readFile(join(ROOT, 'scripts/compare-scenes.json'), 'utf8'));
const scenes = config.scenes.filter((s) => !onlyScene || s.id === onlyScene);
if (scenes.length === 0) {
  console.error(`No scenes matched${onlyScene ? ` --scene ${onlyScene}` : ''}.`);
  process.exit(1);
}
if (!DRY_RUN && !FAL_KEY) {
  console.error('FAL_KEY is not set. Run with --dry-run to preview, or export FAL_KEY to render.');
  process.exit(1);
}

const headers = { Authorization: `Key ${FAL_KEY}`, 'Content-Type': 'application/json' };

async function submit(endpoint, prompt) {
  const res = await fetch(`https://queue.fal.run/${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error(`submit ${endpoint}: ${res.status} ${await res.text()}`);
  return res.json(); // { request_id, status_url, response_url }
}

async function awaitResult(statusUrl, responseUrl, label) {
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 10_000));
    const status = await (await fetch(statusUrl, { headers })).json();
    process.stdout.write(`\r  ${label}: ${status.status}          `);
    if (status.status === 'COMPLETED') {
      console.log();
      return (await fetch(responseUrl, { headers })).json();
    }
    if (status.status === 'FAILED' || status.status === 'ERROR') {
      console.log();
      throw new Error(`${label} failed: ${JSON.stringify(status)}`);
    }
  }
  throw new Error(`${label} timed out after 20 minutes`);
}

function extractVideoUrl(result) {
  return result?.video?.url ?? result?.videos?.[0]?.url ?? result?.output?.video?.url ?? null;
}

const date = new Date().toISOString().slice(0, 10);

for (const scene of scenes) {
  const tpl = getTemplate(scene.category, scene.slug);
  if (!tpl) {
    console.error(`Template not found: ${scene.category}/${scene.slug} — skipping.`);
    continue;
  }
  const outDir = join(ROOT, 'renders', date, scene.id);
  console.log(`\n=== ${scene.id} (${tpl.name}) ===`);

  const meta = { scene: scene.id, template: `${scene.category}/${scene.slug}`, date, runs: [] };

  for (const modelId of config.models) {
    const endpoint = ENDPOINTS[modelId];
    if (!endpoint) {
      console.warn(`  no endpoint mapped for ${modelId}, skipping`);
      continue;
    }
    const prompt = buildPrompt(tpl.fields, modelId, { depth: 'production' });
    // The references block is workflow guidance for humans (what image to attach),
    // not renderable prompt text. These runs are text-only, so strip it and say so.
    delete prompt.references;
    const promptJson = JSON.stringify(prompt, null, 2);

    if (DRY_RUN) {
      console.log(`\n--- ${modelId} → ${endpoint.id} (${endpoint.verified}) ---`);
      console.log(promptJson.slice(0, 400) + (promptJson.length > 400 ? '\n  …' : ''));
      continue;
    }
    if (endpoint.verified.startsWith('UNVERIFIED')) {
      console.warn(`  SKIPPING ${modelId}: endpoint id unverified (${endpoint.id}). Confirm at fal.ai/models and update ENDPOINTS.`);
      continue;
    }

    try {
      console.log(`  ${modelId}: submitting to ${endpoint.id}`);
      const submitted = await submit(endpoint.id, promptJson);
      const result = await awaitResult(submitted.status_url, submitted.response_url, modelId);
      const videoUrl = extractVideoUrl(result);
      if (!videoUrl) throw new Error(`no video url in result: ${JSON.stringify(result).slice(0, 300)}`);

      await mkdir(outDir, { recursive: true });
      const clip = Buffer.from(await (await fetch(videoUrl)).arrayBuffer());
      const file = join(outDir, `${modelId}.mp4`);
      await writeFile(file, clip);
      console.log(`  saved ${file} (${(clip.length / 1e6).toFixed(1)} MB)`);

      meta.runs.push({
        model: modelId,
        endpoint: endpoint.id,
        request_id: submitted.request_id,
        prompt: JSON.parse(promptJson),
        mode: 'text-to-video (references block stripped; no reference image attached)',
        video_file: `${modelId}.mp4`,
        rendered_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error(`  ${modelId} FAILED: ${err.message}`);
      meta.runs.push({ model: modelId, endpoint: endpoint.id, error: String(err.message) });
    }
  }

  if (!DRY_RUN && meta.runs.length > 0) {
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, 'meta.json'), JSON.stringify(meta, null, 2));
    console.log(`  wrote ${join(outDir, 'meta.json')}`);
  }
}

console.log(DRY_RUN ? '\nDry run complete — nothing submitted, nothing spent.' : '\nDone.');
