# choose-treatment-sema/ — Semaglutide-only combo product selection

Client call `uploads/requestClient.mp4` (2026-09-29, untracked; transcript `uploads/requestClient-2026-09-29-transcript.txt`):
"a version of each of the SEMA and NAD and SEMA and Tesamorelin ... just take out like the Tirzepatide ... one, three, and
six ... we're going to create new versions of this. We're not editing this." Reference links: `choose-treatment/v4.html`
(Semaglutide + NAD+) and `choose-treatment/v6.html` (Semaglutide + Tesamorelin). Plan: `SEMA-ONLY-COMBO-PAGES-PLAN.md`.

| Page | What it is |
|---|---|
| `burn-boost.html` | Burn & Boost, Semaglutide + NAD+: `choose-treatment/v4.html` less the Tirzepatide card |
| `deep-belly-burn.html` | Deep Belly Burn, Semaglutide + Tesamorelin: `choose-treatment/v6.html` less the Tirzepatide card |
| `checkout-burn-boost/` | `choose-treatment/checkout-v4/` on this folder's data: "Burn & Boost Plan", FREE NAD+, coupon FREENAD |
| `checkout-deep-belly-burn/` | `choose-treatment/checkout-v6/` on this folder's data: "Deep Belly Burn Plan", FREE Tesamorelin, coupon FREETESA |

- One card, 6-month $199 / month ($1,194 today, save $600), 3-month $249 ($747, save $150), monthly $299: v4 / v6's
  Semaglutide entry, unchanged. Nothing links here; the pages are reached by their own URLs.
- With one product: the card is centred on desktop at the width it has in the two-column grid (a page `<style>`, since
  the CSS is purged Tailwind), and on the phone the one-option "STEP 1 · Select Treatment" selector is hidden (still
  mounted: `js/checkout.js` renders into it) and the title + subtitle show instead.
- Only the HTML and `js/plans-data-*.js` live here. The CSS, the renderer (`js/checkout.js`), the vial images and the
  checkout's CSS, font, images and scripts load from `../choose-treatment/`, so a fix there reaches these pages too.
- Generated, do not hand-edit: the pages + data by untracked `uploads/get-started-wl-ref/sema_only_select.py`, the
  checkouts by `uploads/wellmedoc-checkout-ref/build.py` section 6e.
- Tests: `node choose-treatment-sema/js/sema-tests.js` (186 checks: one product, the figures, v4 / v6 parity, every
  asset resolves, the checkout summaries).
