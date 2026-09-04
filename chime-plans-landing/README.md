# Chime Health — 1 / 3 / 6-month plan landing (Version A)

Chime-brand sibling of `amerilean-plans-landing/`, the same way
`glp1-plan-landing/` is the sibling of `amerilean-landing/`. Same structure,
same plan selector and CRO changes; `css/chime-theme.css` loads after the kit
CSS and restates the palette tokens with the Chime ramps (blue / sand / peach on
cream, Quicksand). The "See If I Qualify" CTAs and the two plan-card buttons
open the questionnaire (see below); nav, footer and legal links are still blank
stubs.

## Preview

    cd ~/Sites/chime && python3 -m http.server 8791

then open http://localhost:8791/chime-plans-landing/

## What is Chime-specific here

- Logos (`logo-slate.png`, `logo-white.png`), Chime vials
  (`semaglutide.webp`, `tirzepatide.webp`), and the hero order of the existing
  Chime landing (h1 first, pill and kicker below).
- Hero: restyled in the Chime site's bento language (`css/chime-hero.css`):
  cream canvas and masthead, blue tile for the message with a white offer
  card and white pill CTA, trust chips, photo tile on a soft blue gradient.
  The before/after photos are the same as the AmeriLean landing
  (`model-before.jpg`, `model-after.jpg`).
- Rating and volume figures are the ones the existing Chime landing uses
  ("4.9 • 2,000+ reviews", "1000's of patients treated every month"). They are
  stand-ins there too; replace before launch.
- Testimonials: Sarah M., David S. and Nicole B. from the existing Chime
  landing, quotes cut to two sentences.
- Copy says Chime Health throughout, including the fine print and the
  comparison table.

- **As featured in** press strip (Bloomberg, Forbes, Healthline, WebMD, Fortune,
  Fast Company, The New York Times) restored from the original landing, under
  the hero.

## Prices

Identical to the AmeriLean version (semaglutide $112/mo and tirzepatide
$139/mo effective on the 3-month plan; every 4th month free on 3- and 6-month
plans). `ui_kits/shared/data/products.js` notes that Chime's own GLP-1 numbers
have not landed yet, so these are borrowed until they do.

## Questionnaire (`questionnaire/`)

The 19-step GLPQuizFR assessment, copied from
`uploads/GLPQuizFR-main/questionnaire/` (the funnel the original landing's
"continue" buttons opened) and wired in the same way: every "See If I Qualify"
CTA (masthead, hero, how-it-works, comparison bar, FAQ, closing, mobile sticky
bar) goes to `questionnaire/step1.html`. The plan-card buttons go there too
and carry the selection as `?med=sema|tirz&term=1|3|6`; `js/plans.js` rewrites
the href whenever the 1/3/6 toggle changes. The quiz does not read those
parameters yet (its step 18 has its own plan cards at $596 / $896 per 3-month
cycle), so the price ladder still has to be reconciled before launch.

What the copy leaves out, following the funnel's own deploy bundle
(`scripts/deploy-stage.mjs`): the `.php` sources (Pages cannot run them; the
`.html` renders are the live pages), `css/footer-links.css` (a 596KB unused
third-party sheet) and the `.gitkeep` files. The Spanish mirror
(`questionnaire/es/`) comes along so the EN/ES switcher on every step keeps
working.

Changes made to the copied pages:

- Every page is `noindex, nofollow` (the source shipped `index, follow`, and
  step 19 carries card fields). `step16.html` had no robots tag at all; one was
  added.
- `<link rel="canonical">` and `og:url` pointed at the old preview host
  (`livepainfreeagain.com/glpquizfr-preview/`); they now point at this
  bundle's Pages path.
- The disqualified page's "Keep Answer" exit and `js/quiz-logic.js` send
  Spanish visitors to `../../index.html` (this landing) instead of a Spanish
  landing that does not exist here. The English exit (`../index.html`) already
  resolved to this page.

### Step 18, the plan stage (2026-09-04)

`questionnaire/step18.html` no longer shows the funnel's five-row plan list. The
plan radio group is now the "SavvyCal stage" from the plan doc (treatment 12): a
forest hero carrying the landing's headline ("Every 4th Month is Free —
Forever."), three floating cards for 1 / 3 / 6 months with the 3-month card
raised and stamped with a "4th month free · for life" seal, "Everything in
1 MONTH, plus:" lists, the landing's "Start 3 months – Semaglutide" button
labels, a terracotta continue button, and the landing's "Every plan includes"
fine print. Styles live in `css/questionnaire.css` under `.sv-*`; the display
face is Fraunces, imported next to DM Sans at the top of that file.

What did not change: the radio buttons, their `value`s (99 / 101 / 102 / 103 /
209) and `data-slot` attributes, so `js/checkout.js` still handles selection and
the inline script still writes `selectedPlan:<treatment>`,
`selectedPlanName:<treatment>` and `selectedPlanPrice:<treatment>` for step 19.
Two behaviours were added: the default 3-month plan is recorded on load (before,
reaching step 19 without clicking carried no plan), and step 1 now keeps the
landing's `?term=1|3|6` (and `?med=`) in sessionStorage as `landingTerm` /
`landingMed`, which step 18 uses to pre-select the same plan length.

Prices: the 1 / 3 / 6-month figures are the landing's ladder for both
medications (`TREATMENT_PRICING` in the page's inline script mirrors
`js/plans.js`; the stored price is the charge today, e.g. `$447.00`). The
12-month supply and medication-only plans keep the funnel's own figures under a
collapsed "More plans" row. That is the one open item: if the funnel's old
ladder ($596 per 3 months) is the real one, only that table changes.

The Spanish mirror (`questionnaire/es/step18.html`) carries the same stage
(2026-09-04): the radiogroup element and the inline script were copied from
`step18.html` and translated; radio values, `data-slot`s and the pricing table
are identical. Captions and the stored `selectedPlanName` are Spanish
("3 meses + 1 gratis"); the treatment heading shows the Spanish name from
step 17 while the `selectedPlan*:` keys stay on the English treatment name,
which is what `es/step19.html` looks up.

### Chime theme (2026-09-04)

The quiz is now Chime-branded on every page (EN and ES):

- **Colours.** `questionnaire/css/questionnaire.css` is the funnel's compiled
  Tailwind sheet, and its class names already lied about their values (e.g.
  `.bg-[#4B5647]` painted teal), so instead of an override sheet every funnel
  colour *value* was remapped in place to a Chime primitive from
  `tokens/colors.css`: teals → blue-500 `#6580bc` / blue-700 `#485e89` /
  blue-400 `#7fa0d9`; the sage greens and navies → blue-900 `#26354d` and
  blue-800 `#324563`; light greens and sage tints → blue-50/100/200; the
  `#f9f9f7` panel ground → sand-100 `#f7f3e4`; terracotta → peach-800
  `#8b5948` (text, CTA) and peach-500 `#d98a6f`; hairlines → slate-300
  `#cad5e2`. Semantic reds/ambers (errors, warnings) were left alone. The same
  map ran over `fill=` / `stroke=` / `style=` attributes and `<style>` blocks
  in the pages, never over `class=""`. The step 18 stage keeps its
  construction (forest stage → slate, lime → the accent blue, the seal in
  sand-100 and blue-800).
- **Type.** Quicksand replaces DM Sans and Fraunces everywhere (`--font-body`,
  the `.sv-*` serif/mono tokens, the seal SVG).
- **Chrome.** `images/logo-chime.svg` (the site navbar's `assets/logo-main.svg`)
  at an explicit 26/32px height, `images/favicon-chime.png`
  (`assets/mark-slate.png`) for every icon link, the share image is the
  landing's `logo-slate.png`, `theme-color` is blue-900. Chime publishes no
  phone number, so the header's "Call us" slot and the mobile call button were
  removed rather than left pointing at AmeriLean's line. The `amerilean-logo`
  `data-slot` hook stays: the header grid classes key on it.
- **Copy.** "AmeriLean" → "Chime Health" in titles, meta, consent text and
  the compounding disclaimer; step 19's Terms and Privacy links now open the
  site's `terms-conditions.html` and `privacy-policy.html` (they were
  `javascript:void(0)`).
- **Vials.** Steps 17 and 18 show the landing's Chime vials
  (`images/vial-semaglutide.webp`, `images/vial-tirzepatide.webp`, copies of
  `../images/semaglutide.webp` / `tirzepatide.webp`) instead of the funnel's
  square product shots on AmeriLean's green backdrop. They are tall cut-outs,
  so a rule at the end of the sheet sets `object-fit: contain` on a mist
  gradient tile for any `img[src*="vial-"]`; step 18's inline script maps
  each treatment to the matching file.
- **Trap (fixed 2026-09-04, same day):** the first remap also rewrote the hex
  inside Tailwind's escaped arbitrary-value *selectors* (`.bg-\[\#4B5647\]`
  became `.bg-\[\#324563\]`), so those classes stopped matching the markup —
  the sticky Continue button went transparent and headings fell back to black.
  The sheet was rebuilt from the funnel original with a values-only remap
  (`(?<!\\)#hex`); the escaped selector hexes must always stay exactly as the
  markup writes them (case included). Step headings (`.text-[#606D5B]`) are
  pinned to blue-900 rather than the ramp's blue-400.
- The css link is at `?v=20260886`. `css/landing.css`, `slick*.css` and the
  old AmeriLean favicon/logo/product images are unreferenced leftovers from
  the copy.

Still open: step 19 posts to `ajax.php?method=new_order_prospect`, which
needs a backend. Not a blocker for reviewing the flow.

## Everything else

See `../amerilean-plans-landing/README.md` for the selector, the CRO pass and
what is out of scope.
