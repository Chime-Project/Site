# Chime Health — Website

Marketing and product site for Chime Health (telehealth: GLP‑1 weight loss,
wellness, and at‑home lab testing). Components are authored as `.jsx` and compiled
in the browser by Babel Standalone; the site is served as static files. The
repository root is the deploy target: commits to `main` publish to GitHub Pages.

- Live: https://chime-project.github.io/Site/
- Repo: `Chime-Project/Site` (branch `main`, GitHub Pages root)
- Stack: React 18 (UMD) · Babel Standalone (in‑browser JSX) · Tailwind Play CDN · CSS design tokens

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

| URL | File | `data-theme` |
|---|---|---|
| `/` | `index.html` | `default` (blue) |
| `/weight-loss.html` | `weight-loss.html` | `weight-loss` (tide) |
| `/wellness.html` | `wellness.html` | `wellness` (cadmium/gold) |
| `/labs.html` | `labs.html` | `lab` (iris) |

---

## Project layout

```
chime/
├── index.html              # Homepage (the site root)
├── weight-loss.html        # Weight Loss landing page
├── wellness.html           # Health, Energy & Wellness page
├── labs.html               # Labs & Health Insights page
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
│   └── shared/             #   cross-page building blocks
│       ├── ui/             #     Button, Icon, Eyebrow, Reveal, CheckItem
│       ├── common/         #     FaqAccordion, RxCarousel, MembershipPanel
│       ├── data/           #     products.js, faqs.js  (window.CHIME_* globals)
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
CSS custom properties, with responsive overrides in each page's `<style>` block.

Shared content loads as plain-script globals before the components that use it:

- `products.js` → `window.CHIME_RX_PRODUCTS` (GLP‑1 pricing carousel data)
- `faqs.js` → `window.CHIME_FAQS` (FAQ copy keyed by page theme)

### Assessment flow

The intake assessment is launched with:

```js
window.openChimeAssessment();   // defined in ui_kits/homepage/AssessmentModal.jsx
```

The `chime:open-assessment` CustomEvent has no listener.

---

## Theming

Components reference semantic tokens only (`--accent-default`, `--text-default`,
`--bg-default`, …) and not palette primitives (`--color-iris-500`) or raw brand
hex values. The active palette is inherited from the nearest `data-theme` ancestor,
which each page sets on `<html>`. Changing `data-theme` changes the palette applied
to every component.

| `data-theme` | Accent palette | Page |
|---|---|---|
| `default` | blue | Homepage |
| `weight-loss` | tide | Weight Loss |
| `wellness` / `energy-wellness` | cadmium (gold) | Wellness |
| `lab` | iris | Labs |

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

1. Run the guard: `bash ui_kits/shared/check-theme-agnostic.sh` (0 errors).
2. Preview at desktop and 390px widths. Allow ≥6s (homepage ≥8s) for in‑browser
   Babel to compile before checking a page.
3. Confirm every `<script src>` on a changed page returns 200. A 404 leaves the
   component `undefined`.
4. Increment `?v=` for each changed file, on every page that loads it.

A push to `main` is a live deploy.

---

## Conventions

- `.jsx` files are not modules; there is no `import`/`export`. A component defines a
  global `Chime*` function, and its `<script>` tag is placed after its dependencies.
- Styling uses inline styles and CSS custom properties. Responsive overrides live in
  each page's `<style>` block, keyed to the section's class.
- Each section carries a `data-screen-label` attribute.
- `CLAUDE.md` and `.DS_Store` are git‑ignored; the repository root is served
  publicly by GitHub Pages.
