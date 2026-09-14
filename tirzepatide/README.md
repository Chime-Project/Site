# Tirzepatide product page (TOF)

Live: https://chime-project.github.io/Site/tirzepatide/

Rip of https://ronanrx.com/tirzepatide/ (client, 2026-09-14; plan in the repo root
`TIRZEPATIDE-PDP-RIP-PLAN.md`) on the Chime palette, Noto Serif + Quicksand. Self-contained —
one folder per landing page / funnel (Luis, 2026-09-14):

| Path | What |
|---|---|
| `index.html` | The page. Sections carry `data-screen-label`s; site links go `../`. |
| `css/pdp.css` | The reference's product-page rules, `.web-signup` → `.pdp-body`, RonanRx teal re-tokened to Chime slate/teal/mist; Chime additions (value-prop row, logo, reveal, kicker-below-title) in the last block. |
| `js/pdp-data.js` | `window.CHIME_PDP` — ONE ENTRY PER PRODUCT: prices per dose, physician fee, coupon, CTA labels + target, ladder copy, FAQ, explore links. Receipts, dose panel, ladder tables, FAQ and explore render from it. |
| `js/pdp.js` | Vanilla port of the reference's nine Stimulus controllers: gallery, film, switch door + dose picker + CTA params, coupon (client-side) with receipt roll + confetti, sticky bar, menu, helix draw-in, statement parallax, reveal. Pure math exported for node. |
| `js/pdp-tests.js` | `node tirzepatide/js/pdp-tests.js` — 32 checks (price math, coupon, CTA params, templating, second-product isolation). |
| `images/` | Stills composed from the client's amber Chime vial set (front, label, cap, Semaglutide + Tirzepatide pair), the film loop + poster (push-in on the pair), lifestyle frame, logo. The full ten-vial set is in `../uploads/vials/amber/`. |

**Second product page:** copy this folder, set `<body data-product="<key>">`, add a `<key>` entry in
`js/pdp-data.js`, swap `images/`. Nothing else changes.

**Intentional:** the primary CTA is blank (`cta.href: ""` → `href="#"`, clicks do nothing) until Luis
picks a target. **Stand-ins** (flagged in the head comment of `index.html`): the price ladder, the $39
physician fee, the FOUNDERS78 coupon, the process claims and the footer note are the reference's;
Chime's checkout prices Tirzepatide $359 / $897 / $1,794 per term. `noindex` until signed off.

Verify: serve the repo root (`python3 -m http.server 8791`), open `/tirzepatide/`, wait ≥ 2 s, check 1440
and 390 (`scrollintoview` the `.reveal` sections — they never show in a full-page screenshot).
