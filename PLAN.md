# JSON Prompt Studio — Product Plan

Last updated: 2026-07-11 · Branch: `rebuild-2026` · Status: Phase 1 partially done, Phase 2 next

## Positioning

**Who it's for:** UGC/ad creators — performance marketers, e-com brands, small agencies
producing AI video ad variants at volume. NOT filmmakers (they live in Flow/Higgsfield/Runway).

**Wedge:** a model-aware translation layer. One structured prompt → correctly shaped,
spec-valid JSON for Veo 3.1, Kling 3.0, Seedance 2.0, Wan, Runway — with sourced,
dated model facts and (eventually) tested receipts. The promise: *repeatability* —
lock style/lighting/framing, vary the product and hook.

**Content roles:**
- Film/director/viral templates = **acquisition** (long-tail SEO). KEEP THEM.
- New ad/UGC flagship tier = **conversion** (the product core).

## Standing decisions (do not relitigate)

1. **Static-only, $0/month.** No auth, no accounts, no server, no LLM calls on our bill.
   Brand kit via localStorage; any LLM feature is BYOK-only, later.
2. **Director/studio names stay.** Core product point + SEO. Descriptive-cinematography
   variants are ADDITIVE (a toggle), never a replacement.
3. **Monetization order:** affiliate links → ads (later, at traffic) → one-time packs
   (Gumroad-style, evidence-gated). No SaaS, no subscriptions.
4. **Every model claim needs a source + last-verified date.** Monthly re-verification
   pass (~20 min). Evidence tiers: official docs > hard specs > our renders > community
   folklore (hypothesis only, never stated as fact).
5. **Money is evidence-gated.** Render pilot (~$25) at deploy +2 weeks; full gallery
   (~$120) only on Search Console signal (comparison pages drawing impressions,
   outbound "run this prompt" clicks).

## Phases

### Phase 1 — Credibility & correctness (in progress)
- [x] Map all raw field keys; build-time `assertKnownFieldKeys` fails loudly on unknowns
- [x] `isFullPrompt` floor; descriptive-style variant map; builder validation/collision
      tracking (verify in-tree work, then commit)
- [ ] Thin templates (<4 fields or no subject/action/scene) demoted: no standalone URL,
      shown as "add-on blocks" on category pages
- [ ] Source-backed model cards: exact official specs (Veo 4/6/8s + 720p/1080p/4K;
      Runway 5/10s; etc. — re-verify against primary docs at implementation time),
      `sources[]` links, `lastVerified` date rendered on model pages + prompt viewer

### Phase 2 — The product core (next stage)
- [ ] **Schema v2:** add `references` block (image slots: product / character-face /
      style-frame, with per-model handling notes) and `brand` block (colors as hex,
      logo handling, brand tone). Honest on-page caveat: models approximate hex,
      can't render exact logos — use reference image or post overlay.
- [ ] **Flagship ad/UGC tier:** 12–20 NEW templates on full production schema —
      quality bar: "better than what the user would have written themselves."
      Formats: product hero, UGC testimonial, unboxing, before/after, app demo,
      food/bev, fashion, real estate, founder-to-camera, problem-agitate-solve.
      Technical values sourced at model level in models.js (sources[] + dates);
      per-template comments only where a specific official recommendation is used.
      Expand toward 30–50 ONLY after the first set feels strong. This REPLACES
      the old "retrofit 50 film flagships" task.
- [ ] **Depth levels:** Compact / Production / Advanced output modes (same formatter,
      field-inclusion policy). Production = default.
- [ ] **Brand kit in builder:** localStorage persistence, feeds palette/style/
      logo-reference fields. UI form (column vs panel vs drawer) decided against
      the actual layout, not prescribed here.
- [ ] **/convert/:** template-anchored conversion — free text matched client-side to
      nearest flagship (keyword/tag scoring), user's subject/action slotted in.
      Honest framing: "your idea in a proven structure." NO deterministic NLP parsing
      pretending to be an LLM; BYOK Gemini enhancement is a later add.
- [ ] **Use-case-first nav:** "What are you making?" entry (ad type → templates).
- [ ] **Client-side search/filter** across all templates (build-time index).
- [ ] Capability warnings kept current (audio dropped, duration clamped, named-style
      block risk per model).

### Phase 3 — Ship & wire money (needs user)
- [ ] USER: renew domain; approve merge to `main` (replaces live site)
- [ ] Deploy → Search Console → submit sitemap; GA4 or Vercel Analytics
- [ ] USER: affiliate signups (fal.ai, Higgsfield, Runway); swap `links.js`,
      add outbound-click tracking
- [ ] Ignition: 2–3 posts (Reddit/Medium) targeting comparison/model queries
- [ ] Optional newsletter capture (only if user will send)

### Phase 4 — Evidence-gated
- [ ] Render script (one command, aggregator API — write it now, run it later)
- [ ] Pilot: 3–5 ad-shaped scenes × 4 models (~$25) → comparison pages with
      "tested on <model> · <date>" badges
- [ ] Full gallery (20 scenes) on signal; BYOK "comparison kit" for user prompts
- [ ] Deep guides (10–20), paid packs — only at real impressions

## Signals that unlock spending
- Comparison pilot pages: disproportionate impressions/clicks in Search Console
- Outbound "run this prompt" clicks (affiliate intent)
- An ignition post that visibly drove traffic
- Review at deploy +6–8 weeks; if flat, rethink wedge before spending more.
