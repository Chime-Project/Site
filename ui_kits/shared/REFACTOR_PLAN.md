# Component refactor plan

Goal: extract the duplicated UI into a shared, **theme-agnostic** component layer
(atoms → molecules → sections → pages), following a standard React structure.

## Rules (every phase)
- **Pure refactor, zero visual change.** Extract, rewire call-sites, confirm identical output.
- **Theme-agnostic by construction** — components use only semantic/theme tokens; see
  [`THEME_CONTRACT.md`](./THEME_CONTRACT.md). Guard: `bash ui_kits/shared/check-theme-agnostic.sh`.
- **Dark glass = surface, not accent** — use the `--glass-*` family (contract "Special rule").
- **Verify** each affected page at desktop + 390px, and each extracted component under
  every theme (`weight-loss` tide, `wellness` cadmium, `default` blue, `lab` iris).
- **Load order:** shared primitives load before the sections that consume them.
- **Bump `?v=`** on changed scripts (runtime-Babel cache). For CSS, cache-bust `colors.css`.

## Phases

### 0 — Foundations
Create `shared/ui`, `shared/common`, `shared/data`; add a shared-layer `<script>` block to
each page (before sections); capture baseline screenshots of all pages. **Ship: yes.**

### 1 — Theme contract & color audit  ✅ DONE
- `THEME_CONTRACT.md` (allowlist, literal→token map, translucent strategy, buckets).
- `check-theme-agnostic.sh` guard.
- Confirmed `colors.css` theme layer already reconciled (default→blue, weight-loss→tide,
  wellness→cadmium, lab→iris). Added `--glass-*` dark-glass surface tokens (homepage=navy,
  Labs=iris tint). Work-list: 59 palette-primitive swaps across 15 files.

### 2 — Consolidation  ✅ COMPLETE
- **2a · Data (DONE):** created `shared/data/products.js` (`window.CHIME_RX_PRODUCTS`), repointed
  the 3 identical Rx-carousel arrays (`WeightLossSection`, `WLTimelineSection`, `WNTimelineSection`)
  at it, and loaded it (plain script, before components) on homepage/weight-loss/wellness. Verified:
  all pages render, carousels show GLP-1/GLP1/GIP from shared data, no old names. (Note: `ProductsSection`
  grid cards and `WLShared` vials hold their own differently-shaped product data — not the Rx array —
  left as-is; centralize later if wanted.)
- **2b · Dark-glass surfaces (DONE for homepage):** migrated the hardcoded glass literals
  onto `--glass-*` tokens in `FeelSection`, `WeightLossSection`, `LabsSection`.
  **`Hero` and `AssessmentModal` intentionally excluded** (per request — left as-is).
  Map used: navy grounds `#1B263A`/`var(--color-navy-900,…)` → `--glass-solid`; panels
  `rgba(24,42,63,α)` → `--glass-surface`; iris ink `rgba(42,40,58,α)` → `rgb(var(--glass-rgb)/α)`
  (exact alpha, tints via `data-theme="lab"`); hairlines `rgba(255,255,255,0.08)` → `--glass-border`.
  Verified: homepage Feel/WL stay navy, Labs stays purple, nothing transparent. WeightLossSection
  panels harmonized 24,42,63 → canonical navy 27,38,58 (imperceptible, intentional).
- **2b′ · Buttons follow theme (DONE):** the 4 fixed-navy button hover-fills
  (`WeightLossHero`, `WLBodiesSection` ×2, `WLTimelineSection`) `--color-blue-800`/`--fg-default`
  → `--accent-active`, so primary-button hover now matches the section theme (verified tide-800
  on the WL page). **Open (Phase 4):** homepage primary CTAs (`Hero`, `ProductsSection`) still use
  `--primary-default` (constant brand blue) — decide whether "primary" buttons also follow the
  accent theme or stay brand-blue when placed in a themed section.

### 3 — `<RxCarousel>`  ✅ COMPLETE
Created `ui_kits/shared/common/RxCarousel.jsx` — one theme-agnostic carousel with
`variant="light|dark"` (light = timeline tinted cards, dark = white-on-navy homepage
cards). Colors bind to `--accent-*` + theme-neutral white/ink; guard passes (0 warnings).
Migrated **4** call-sites (not 3 — `WellnessSection` also used the global `ChimeRxCarousel`):
`WeightLossSection` (dark), `WellnessSection` (dark), `WLTimelineSection` (light),
`WNTimelineSection` (light); loaded the shared script on all 3 pages. Verified: each renders
with its own palette from `data-theme` (WL→tide, wellness→cadmium) — same code, no color props.
- **One intentional harmonization:** the homepage wellness teaser's promo accent was an
  off-scale gold `#E6C465`; it now resolves to `--accent-subtleHover` (cadmium-200). WL's
  `#C3D7EE` was exactly tide-200, so it's unchanged.
- `WLProductCarousel` (WLShared vial rotator) is a *different* component/data shape — not
  part of RxCarousel; left as-is.
- Lesson logged: grep ALL references before deleting a global (the 4th call-site + a
  brace-count bug each broke render mid-way; both caught by verification and fixed).

### 4 — `<Button>`  ✅ COMPLETE
Created `ui_kits/shared/ui/Button.jsx` — one theme-agnostic pill: `variant` (primary/
secondary/ghost) × `tone` (onLight/onDark) × `size` (6 presets). Guard passes (0 warnings).
Low-risk migration: turned **11** local buttons into thin **adapters** to `<Button>`
(WLButton×2, HWButton, FeelCTA, WLHeroCTA, WLBodiesCTA, WLBannerCTA, WLTButton, WNTButton,
WNHeroCTA, HWSSoundFamiliarCTA) — call-sites untouched, styling unified in one place.
Loaded Button.jsx on homepage/weight-loss/wellness. All 3 render; variants verified
(onDark-primary=white, onLight-primary=accent-default, ghost=accent-subtle).
- **Harmonizations** (documented): white-pill ink now `--text-default` everywhere (wellness
  hero/teaser went gold→navy — most visible); HWButton sweep `#D9A62E`→`--accent-default`
  (≈ same gold); hero/WNT sweep targets normalized to accent tokens; `WLBannerCTA` was a
  dead button (no onClick) → now opens the assessment.
- **Left as special cases:** `ProductBtn` (no hover-sweep, uses `--primary-*`) and
  `LabsButton` (fixed 52px hero spec) — not migrated.
- Removed 3 hardcoded brand colors from components as a bonus.

### 5 — `<Reveal>`  ✅ COMPLETE
Created `ui_kits/shared/ui/Reveal.jsx` (pure-CSS `.reveal` wrapper, supports `className`).
Converted the **8 active** wrappers to thin adapters (`SimplePathReveal`, `GuideReveal`,
`LabsReveal`, `WLReveal`×2, `HWReveal`, `WNTReveal`, `WNHReveal`); loaded Reveal.jsx on all
**4** pages (homepage/weight-loss/wellness/labs). Zero visual change — verified all render
with `.reveal` elements present (22/15/11/11). Orphaned `PathReveal` (dead `PathSection`,
not loaded anywhere) left as-is.

### 6 — `<FaqAccordion>` (+ `shared/data/faqs.js`)  ✅ COMPLETE
Created `ui_kits/shared/common/FaqAccordion.jsx` (FaqItem + FaqAccordion, grid-rows 0fr→1fr
reveal) and `ui_kits/shared/data/faqs.js` (`window.CHIME_FAQS` keyed weight-loss / wellness).
The WL and WN trios were identical except data + the closed-chevron bg (`--color-tide-100` /
`--color-cadmium-100`) → tokenized to `--accent-subtle` (exact under each theme). Removed the
local FaqItem + data; `WLFaqCard`/`WNFaqCard` are now adapters to `<FaqAccordion>` (keeps the
section wrappers + the `WNFaqCard` used inside the wellness timeline). Loaded faqs.js +
FaqAccordion.jsx on weight-loss/wellness. Zero visual change — verified both render (7 items,
first open, correct tide/cadmium theming).

### 7 — Atoms & card family  🚧 IN PROGRESS
A survey of all 30 kit files corrected several of this phase's original assumptions
(they named *concepts*, not existing symbols — only `ProductCard` existed literally).

**Done:**
- **`SIMPLE_PATH_RAMPS` → accent derivation (DONE):** one `SIMPLE_PATH_RAMP` bound to
  `--accent-*`; `simplePathSteps()` handles any list length. Measured resolved colors on
  every page: **weight-loss, wellness and labs are pixel-identical** (wellness renders only
  3 cards, so the old `cadmium-600` rung was unreachable; WL's 5 cards reuse rung 2).
  **Only the homepage changed** — card 1 `blue-950 #1B263A → blue-800 #324563`, card 2
  `blue-800 → blue-700`, card 4 numeral `sand-400 #C8C3B0 → blue-200 #BDD2F6`, body
  opacity `.78 → .82/.85`. No `--accent-*` token equals `blue-950`, so the deep navy anchor
  could not be preserved by derivation. **Harmonization approved** — the homepage now
  matches the other pages.
- **`Icon` (DONE):** `shared/ui/Icon.jsx` — standardizes the `<svg>` wrapper only.
  Deliberately **lineage-neutral**: the bundle mixes **lucide** (`Hero`) and **feather**
  (`WLBodiesSection`) artwork for the same concepts (`zap`, `shield-check`, `users`).
  Unifying the drawings is a visual decision, deferred. ⚠️ Trap logged: `M4 12.5l5 5L20 7`
  and `M4 12.5l5 5 11-12` look like duplicate checks but end at **(20,7)** vs **(20,5.5)**
  (`11-12` is a relative continuation) — never merge them.
- **`CheckItem` (DONE):** `shared/ui/CheckItem.jsx` — `CheckItem` (hero row) + `CheckBullet`
  (membership bullet). Kept as **two components, not one with a variant** — different
  structure (grid + rule + link vs flex + filled disc). Migrated 4 call-sites (WL/WN heroes
  were byte-identical forks; `WLTimelineSection`'s copy was inlined in a `.map`).
  Verified: rendered DOM **byte-identical** to prod (7176/7176 and 12523/12523 bytes).
- **`Eyebrow` (DONE):** `shared/ui/Eyebrow.jsx` — `tone` × `opacity` × `marginBottom`.
  Migrated 4 live call-sites (`WeightLossSection`, `WellnessSection`, `FeelSection`,
  `ProductsSection`). 3 render byte-identically; **1 intentional fix** — `WellnessSection`
  set `rgba(255,255,255,0.9)` *and* `opacity: 0.9`, double-dimming to an effective **0.81**
  where its siblings render 0.9. Now `--color-white` + 0.9.

**Part 2 — done:**
- **Dead code removed (DONE):** deleted `PathSection.jsx` (119 lines, loaded by no page — its
  `PATH_STEPS` was the last pre-tokenization palette table). Cut `WLShared.jsx` 220 → 18 lines:
  its `ChimeWeightLossSection` + `WLProductCarousel` + `WLButton` + `WL_UPLOADS`/`WL_SOLID` were a
  stale fork that no page rendered — `homepage/WeightLossSection.jsx` defines all four itself, and
  every WL section uses its own `WLTButton`/`WLT_UPLOADS`. The file now supplies only `WLReveal`,
  which is all `weight-loss.html` ever loaded it for. ⚠️ Note `_ds_bundle.js` (loaded first on every
  page) still defines its own stale `ChimeWeightLossSection`/`WLSlider` — a real shadowing hazard
  that only load order defeats. Worth killing when Phase 8 lands.
- **`StepBadge` (DONE, local):** merged the 2 circles in `AssessmentModal` behind
  `size` × `state` ("done"/"current"/"todo") × `elevated`. **Kept local, not promoted to
  shared/ui** — that file is its only consumer and already loads on all 4 pages, so a shared file
  would cost 4 `<script>` tags for zero reuse. One fix: the stepper numeral was a raw
  `fontSize: 11` → now `--text-xs` (12px).
- **`MembershipPanel` (DONE):** `shared/common/MembershipPanel.jsx` — the ~45-line panel that WL and
  WN each carried a copy of. Tint now binds to `--accent-subtle`, killing the
  `--color-tide-100`/`--color-cadmium-100` contract violations (both resolve to the exact same
  literals — measured `rgb(223,234,246)` / `rgb(250,243,230)`, unchanged). The `.wlt-panel` and
  `.wnt-panel` mobile hooks had **byte-identical** CSS, so they collapse to one `.membership-panel`
  rule per page. Media bands stayed local (false friends, as surveyed). Verified: rendered DOM
  differs only by the class name + token name; 390px collapse identical.
- **`TileCard` — REJECTED (false unification):** `CategoryCard`/`StartHereCard` are flex-**row**
  tiles (padding 4/5, border, 52px image-slot, trailing glyph); `TestimonialStat`/`TestimonialStatCTA`
  are centered flex-**column** stats (padding 5/6, sand-100, no border/image/glyph). Their only
  overlap is `radius-2xl` + `minHeight:88` + `box-sizing` — two numbers and a radius is not a
  component, and the groups live in different files with no shared consumer. Did the defensible
  part instead: the stat pair's wrapper style object was byte-identical → deduped locally as
  `STAT_TILE_SHELL`.

**Not doing (and why):**
- `MilestoneCard`, `ProductCard`, `TierCard` — one call-site each, no second consumer; moving them
  adds indirection without removing duplication.
- **`Slider` needs no work** — `WLCalculator.jsx` holds the only one, themed solely by
  `accent-color`; there is no thumb CSS anywhere in the repo. "Promote" would be a file move.
- Unifying the **lucide vs feather** icon artwork — a visual decision, not a refactor.

**Known bug (unrelated, not fixed here):** `WeightLossHero.jsx` opens the assessment via the
`chime:open-assessment` event, which nothing listens for — so the WL hero CTA is a no-op in
production. `WellnessHero` correctly calls `window.openChimeAssessment()`.

### 8 — (optional) Vite + ES modules
Replace `window.*` globals + runtime Babel with `import`/`export` + a build. Changes the
production deploy model — a deliberate decision. Phases 1–7 are valuable with or without it.

## Open decisions (Bucket 3)
- ✅ Dark glass → `--glass-*` surface tokens (resolved).
- ⏳ Primary-button hover-fill → `--accent-active` (recommended) — applied in Phase 4.
- ⏳ Translucent accents → `color-mix(... transparent)` (recommended) — applied as encountered.
