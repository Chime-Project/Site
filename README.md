# Chime Health — Website

Marketing and product site for Chime Health (telehealth: GLP‑1 weight loss,
wellness, and at‑home lab testing). Components are authored as `.jsx` and compiled
in the browser by Babel Standalone; the site is served as static files. The
repository root is the deploy target: commits to `main` publish to GitHub Pages.

- Live: https://chime-project.github.io/Site/
- Repo: `Chime-Project/Site` (branch `main`, GitHub Pages root)
- Stack: React 18 (UMD) · Babel Standalone (in‑browser JSX) · Tailwind Play CDN · CSS design tokens
  · GSAP 3 (ScrollTrigger + SplitText) on the pages that animate — see [Motion](#motion-gsap)

---

## Architecture

There is no bundler or compile step. Each page loads React, ReactDOM, and Babel
from a CDN, then loads each component as a `<script type="text/babel" src="…">`.
Babel compiles the JSX at load time in the browser. Editing a `.jsx` file and
reloading updates the page; committing it to `main` updates the deployed site.

Compilation happens at page load, so a page renders after a short delay
(approximately 8 seconds for the homepage on a cold load).

---

## Running locally

The site is served by any static file server; there is no compile step.

```bash
cd ~/Sites/chime
python3 -m http.server 8791
# open http://localhost:8791/
```

The homepage is `index.html`. Pages:

| URL | What it is |
|---|---|
| `/` (`index.html`) | Homepage — sections carry their own `data-theme` |
| `/weight-loss.html` | Weight Loss landing (tide) |
| `/wellness.html` | Health, Energy & Wellness (cadmium/gold) |
| `/labs.html` | Labs & Health Insights (iris) |
| `/executive-weight-loss.html` | Weight Loss for executives (Persona 1) — `weight-loss` theme, GSAP motion layer (`ui_kits/executive/`). `noindex` + canonical to `weight-loss.html`; reached from paid/email, not the nav |
| `/chimeAssessment.html` | **The** health assessment (v4 build, `ui_kits/chimeAssessment/`) — every CTA on the site lands here. Case‑sensitive URL |
| `/assessment.html` | The retired v1 funnel. Unlinked, but **not deletable** — `chimeAssessment.html` still loads its `AssessmentControls.jsx` |
| `/nad.html` | NAD+ add‑on page, Chime theme (`ui_kits/nad/NadPage.jsx`) |
| `/cart.html` | Plan selection → checkout (`ui_kits/cart/`), bare chrome by design |
| `/chimeUpsell01–03.html` | NAD+ / Tesamorelin / Zofran checkout upsells, Chime theme (token‑wired) |
| `/upsell01–03.html`, `/nad2.html`, `/upsellPopups.html` | Amerilean‑branded twins of the above — self‑contained (own CSS/JS, no site stylesheet, no React) |
| `/faq.html` | Full FAQ, all categories (`ChimeFaqBrowser`) |
| `/privacy-policy.html` etc. | 4 legal pages¹ |

¹ `privacy-policy.html`, `terms-conditions.html`, `hipaa-notice.html`,
`telehealth-consent.html` — same shell, rendered by `LegalPage.jsx` from
`shared/data/legal.js`.

⚠️ GitHub Pages URLs are **case‑sensitive** and macOS's filesystem is not:
`chimeassessment.html` / `chimeupsell01.html` work locally and 404 in
production. Link to the camelCase names exactly.

---

## Project layout

```
chime/
├── index.html              # Homepage (the site root)
├── weight-loss.html        # Weight Loss landing page
├── wellness.html           # Health, Energy & Wellness page
├── labs.html               # Labs & Health Insights page
├── executive-weight-loss.html  # Executive (Persona 1) weight-loss landing — GSAP motion
├── chimeAssessment.html    # Health Assessment (v4 intake funnel) — every CTA lands here
├── assessment.html         # v1 funnel, retired but still supplies AssessmentControls.jsx
├── nad.html                # NAD+ add-on page (Chime)
├── cart.html               # Plan selection → checkout
├── chimeUpsell01..03.html  # Checkout upsells (Chime theme)
├── upsell01..03.html       # …and their Amerilean-branded, self-contained twins,
├── nad2.html / upsellPopups.html   # plus the Amerilean NAD+ page and pop-up variants
├── faq.html                # Full FAQ (all categories, ChimeFaqBrowser)
├── privacy-policy.html     # Legal pages — same shell, content from
├── terms-conditions.html   #   shared/data/legal.js rendered by
├── hipaa-notice.html       #   shared/common/LegalPage.jsx
├── telehealth-consent.html
│
├── styles.css              # Global entry point — @imports the token files
├── tokens/                 # CSS custom-property design tokens
│   ├── colors.css          #   primitives → semantic → theme (4 accent palettes)
│   ├── typography.css      #   --text-*, --font-*
│   ├── spacing.css         #   --spacing-*, --container-*
│   ├── effects.css         #   shadows, easings
│   ├── fonts.css           #   @font-face
│   └── base.css
│
├── tailwind.setup.js       # Tailwind Play CDN config (utility classes)
├── dsbundle.js             # Design-system component bundle (Card, Badge, Dialog, …)
│
├── ui_kits/                # Page-specific React components
│   ├── homepage/           #   Navbar, Hero, Products, Testimonials, Footer, AssessmentModal…
│   ├── weight-loss/        #   WeightLossHero, WLBodies, WLTimeline, WLCalculator sections…
│   ├── wellness/           #   WellnessHero, HWSymptoms, WNTimeline…
│   ├── labs/               #   LabsHero, LabsSignals, InsightStack, BuildPanel…
│   ├── executive/          #   Executive landing
│   │   ├── ExecutiveWLPage.jsx     # the page (sections, copy, motion hooks)
│   │   └── ExecutiveMotion.js      # GSAP layer — plain JS, mounted from the page's layout effect
│   ├── chimeAssessment/    #   THE assessment (v4 spec; "v4" in the file names is the spec version)
│   │   ├── assessment-v4-data.js / -logic.js
│   │   ├── AssessmentV4Controls.jsx / AssessmentV4Flow.jsx
│   │   └── assessment-v4-tests.js  # node ui_kits/chimeAssessment/assessment-v4-tests.js
│   ├── assessment/         #   v1 funnel — retired, kept for AssessmentControls.jsx
│   │   ├── assessment-data.js      # questions, options, coverage, disqualifier keys
│   │   ├── AssessmentControls.jsx  # field components (options, consents, stepper, toast) — still loaded by chimeAssessment.html
│   │   └── AssessmentFlow.jsx      # v1 engine + page component
│   ├── cart/               #   CartFlow, CartControls, cart-data.js, cart-tests.js (node ui_kits/cart/cart-tests.js)
│   ├── nad/                #   NadPage.jsx (nad.html; the layout the executive page is built on)
│   └── shared/             #   cross-page building blocks
│       ├── ui/             #     Button, Icon, Eyebrow, Reveal, CheckItem
│       ├── common/         #     FaqAccordion, RxCarousel, MembershipPanel, LegalPage
│       ├── data/           #     products.js, faqs.js, legal.js  (window.CHIME_* globals)
│       ├── WLCalculator.jsx
│       ├── THEME_CONTRACT.md
│       └── check-theme-agnostic.sh
│
├── assets/                 # Committed brand assets (logos, marks, photos)
└── uploads/                # Media referenced by components (images, mp4)
```

Each page's HTML is a shell: `<head>` links the CDN libraries and `dsbundle.js`,
`<body>` lists the component `<script>` tags in dependency order, and a final
inline script composes them and calls `ReactDOM.createRoot(...).render(...)`.

---

## Components

Components are functions attached to the global scope, prefixed `Chime*` (for
example `ChimeNavbar`, `ChimeHero`, `ChimeWeightLossSection`). There is no module
system, so script order in the HTML defines the dependency graph: a component is
listed after everything it references. Styling is inline `style={{…}}` reading from
CSS custom properties. Responsive overrides for the shared nav/footer chrome live
once in `styles.css`; page‑specific overrides live in that page's `<style>` block.

Shared content loads as plain-script globals before the components that use it:

- `products.js` → `window.CHIME_RX_PRODUCTS` (GLP‑1 pricing carousel data)
- `faqs.js` → `window.CHIME_FAQ_SECTIONS` (the full FAQ, grouped by category;
  answers are block‑structured — paragraphs, bullet lists, optional assessment
  CTA). The per‑page lists (`window.CHIME_FAQS`) and the closing band
  (`window.CHIME_FAQ_CLOSING`) are derived from it, so page FAQ copy and the
  full FAQ page (`faq.html`, rendered by `ChimeFaqBrowser`) cannot drift apart.
- `legal.js` → `window.CHIME_LEGAL` (legal-page documents)
- `assessment-data.js` → `window.CHIME_ASSESSMENT` (intake questions + eligibility keys)

### Assessment

Every CTA on the site funnels to the assessment through one call:

```js
window.openChimeAssessment();
```

On marketing and legal pages that function (defined by the shim in
`ui_kits/homepage/AssessmentModal.jsx` — the old demo modal is retired) navigates
to `chimeAssessment.html`; on that page, `AssessmentV4Flow.jsx` overrides it to
scroll to the form so in‑progress answers survive. CTA anchors also carry a real
`href="chimeAssessment.html"`, so middle‑click and open‑in‑new‑tab work. The
`chime:open-assessment` CustomEvent has no listener.

**The page** is `chimeAssessment.html` — the v4 build in
`ui_kits/chimeAssessment/` (the `v4` in its file names is the spec version, not
a page version). `?product=GLP` (or a comma list) preselects programs; answers
persist in `localStorage` (`chime_assessment_v4`) and nothing is transmitted.
It animates screen changes with GSAP core. Its copy is locked to the reviewed
spec — run the tests before touching routing or wording:

```bash
node ui_kits/chimeAssessment/assessment-v4-tests.js   # 114 checks
```

`assessment.html` / `ui_kits/assessment/` is the retired v1 funnel (the
PortalIntake1 port). Nothing links to it any more, but **do not delete it**:
`chimeAssessment.html` still loads `ui_kits/assessment/AssessmentControls.jsx`
for its field primitives, and removing that kit blanks the live assessment.

---

## Motion (GSAP)

Three pages load GSAP 3 from unpkg with SRI hashes, like the React tags:
`chimeAssessment.html` and `cart.html` (core only — screen transitions) and
`executive-weight-loss.html` (core + ScrollTrigger + SplitText; every GSAP plugin
has been free since 3.13). Everywhere else, reveals are the CSS
`animation-timeline: view()` pattern in each page's `<style>` (Chromium‑only by
design — other browsers rest at the visible end state).

The executive landing's motion is a separate **plain‑JS layer**,
`ui_kits/executive/ExecutiveMotion.js`, which `ExecutiveWLPage.jsx` mounts from a
`useLayoutEffect` (after the DOM is committed, before first paint, so `from`
states never flash). The kit exposes hooks and nothing else:

| Hook | Treatment |
|---|---|
| `exec-heading` | SplitText masked line reveal (`linesClass: "exec-line"`; the `-mask` wrappers get descender‑safe padding in the page CSS) |
| `exec-fade` | `ScrollTrigger.batch` fade‑up, neighbours cascade |
| `exec-cta` | magnetic lean + lift on `(hover: hover) and (pointer: fine)` only |
| `exec-hero-rule`, `exec-kicker-rule` | 1px blocks (not borders) so they can be drawn `scaleX 0 → 1` |
| `exec-problem-figure`, `exec-membership-figure` | clip‑path wipe + Ken Burns settle |

Scroll‑scrubbed beats on top: hero exit parallax, the Problem band's word‑by‑word
statement, the care‑path strips wiping in like bars, the `≠` glyph/vial drift and
the final‑CTA background. The whole layer sits inside `gsap.matchMedia()` under
`(prefers-reduced-motion: no-preference)`: with reduced motion — or if a CDN
script fails — nothing is created and nothing is hidden; the page renders at rest.

Verifying it: `agent-browser set media reduced-motion`, reload, and expect
`ScrollTrigger.getAll().length === 0` with no `.exec-fade` at opacity 0; reset
with `agent-browser set media no-preference`.

---

## Theming

Components reference semantic tokens only (`--accent-default`, `--text-default`,
`--bg-default`, …) and not palette primitives (`--color-iris-500`) or raw brand
hex values. The active palette is inherited from the nearest `data-theme` ancestor.
Single‑theme pages (Labs, FAQ, legal, NAD+, the executive landing) set it on
`<html>`; the homepage and the category pages set it **per section**, so one page
can carry several palettes. Changing `data-theme` changes the palette applied to
every component beneath it.

| `data-theme` | Accent palette | Where |
|---|---|---|
| `default` | blue | FAQ, legal pages, `nad.html`, homepage default sections |
| `weight-loss` | tide | Weight Loss, Executive Weight Loss, homepage WL section |
| `wellness` / `energy-wellness` | cadmium (gold) | Wellness, homepage wellness section, Chime upsells |
| `lab` | iris | Labs, homepage labs section |

The Amerilean pages (`upsell01–03`, `nad2`, `upsellPopups`) are outside this
system on purpose: they load no site stylesheet and carry their own palette.
Page‑level palette tweaks live in the page's `<style>` as `--exec-*`‑style vars
(see `executive-weight-loss.html`) rather than in the kit, which keeps kits
guard‑clean.

Token rules, the shade→token mapping, and the dark "glass" surface family are
documented in [`ui_kits/shared/THEME_CONTRACT.md`](ui_kits/shared/THEME_CONTRACT.md).

### Guard: theme agnosticism

```bash
bash ui_kits/shared/check-theme-agnostic.sh            # scans ui_kits/shared
bash ui_kits/shared/check-theme-agnostic.sh ui_kits    # scan everything
```

- ERROR — an accent‑palette primitive appears in a component. Exits non‑zero.
- WARN — a raw brand hex / rgba that needs review (some are neutrals).

---

## Cache busting (`?v=`)

Component and data `<script>` URLs carry a `?v=NNNNNNNN` query string. It is a
monotonic counter formatted to resemble a date; values only increase. When a file
changes, its `?v=` is incremented on every page that loads it so browsers refetch
it. Values that have already been served are not reused.

`?v=` applies to `<script>` and `<link>` URLs only. The design tokens are pulled in
through an unversioned `@import` inside `styles.css`, so a token edit ships without
an explicit cache bust. GitHub Pages serves `colors.css` with a `max-age` of
approximately 10 minutes. To force an immediate refetch of a token change, version
the `@import` line.

---

## Deploying

Commits to `main` publish to GitHub Pages; there is no separate production
environment. Before pushing:

1. Run the guard: `bash ui_kits/shared/check-theme-agnostic.sh` (0 errors) — and
   pass the kit directory you touched (`… ui_kits/executive`) to scan it too.
2. Preview at desktop and 390px widths. Allow ≥6s (homepage ≥8s) for in‑browser
   Babel to compile before checking a page.
3. Confirm every `<script src>` on a changed page returns 200. A 404 leaves the
   component `undefined`.
4. Increment `?v=` for each changed file, on every page that loads it. Find the
   current maximum with
   `grep -rhoE '\?v=2026[0-9]+' --include='*.html' . | sort -u | tail -1`
   and go one higher — never reset it to today's date.
5. If the page has a test file, run it: `node ui_kits/chimeAssessment/assessment-v4-tests.js`,
   `node ui_kits/cart/cart-tests.js`.
6. If the page has a GSAP layer, check it once more with reduced motion emulated
   (see [Motion](#motion-gsap)) — nothing may stay hidden.

A push to `main` is a live deploy. Pages serves with `max-age=600`, so a change
is live within seconds but cached copies can linger ~10 minutes; `curl` the page
with a cache‑busting query to confirm the new `?v=` is being served.

---

## Conventions

- `.jsx` files are not modules; there is no `import`/`export`. A component defines a
  global function — `Chime*` on the homepage/category kits, a kit prefix on the
  newer page kits (`Exec*`, `Cart*`) — and its `<script>` tag is placed after its
  dependencies. Non‑JSX helpers (e.g. `ExecutiveMotion.js`) are classic scripts
  loaded before the kit that calls them.
- A page's copy is often locked to a reviewed source (PDF / docx / Google Doc
  named in the file's head comment). Re‑read that source before changing wording;
  do not strengthen product claims.
- Styling uses inline styles and CSS custom properties. The shared nav/footer
  responsive rules live in `styles.css` (single source — do not copy them into
  pages); page‑specific responsive overrides live in that page's `<style>` block,
  keyed to the section's class.
- Each section carries a `data-screen-label` attribute.
- `CLAUDE.md` and `.DS_Store` are git‑ignored; the repository root is served
  publicly by GitHub Pages.
