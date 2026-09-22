# Chime Health — online weight loss program landing

Client request, 2026-09-22: "rip this: `sesamecare.com/service/online-weight-loss-program`".
Luis, same day: "rip it with chime information and look and feel", using the screenshots taken from
the saved reference as the design base.

**What this is:** the reference's layout, section for section, rebuilt in Chime's own look with
Chime's products and copy. Not a re-skin of their markup, and not a theme of an existing kit: the
folder is self-contained, one stylesheet and one script, no framework and no CDN.

Plan and capture notes: `../SESAME-WEIGHT-LOSS-RIP-PLAN.md`.

## Preview

    cd ~/Sites/chime && python3 -m http.server 8791

then http://localhost:8791/chime-weight-loss-program/

## Layout

| | |
|---|---|
| `index.html` | the page. Every section carries a `data-screen-label` |
| `css/wlp.css` | the whole design: tokens in `:root` copied from `tokens/colors.css`, then section by section in page order |
| `js/wlp.js` | five behaviours: the rail (one carousel used twice), the filter chips, the price select, the card expand panels, the FAQ accordion. The pure helpers are exported for node |
| `js/wlp-tests.js` | `node chime-weight-loss-program/js/wlp-tests.js` — 159 checks |
| `fonts/quicksand-latin.woff2` | the 28 KB variable file the quiz landings ship. No Google Fonts request stands between the HTML and first paint |
| `images/` | see **Photography** below. Vials from `uploads/vials/amber/` |

## Section map

| # | Section | Notes |
|---|---|---|
| 1 | Header | Chime logo, four nav links, one CTA. Nav appears from 1024px |
| 2 | Hero | Headline, three tick bullets carrying the pricing, one button, the LegitScript chip where the reference puts Trustpilot |
| 3 | Results | Three dark gradient cards, 5 / 10 / 15% at 3 / 6 / 12 months, citation under them |
| 4 | Treatment explorer | Filter chips, a plan length select (the slot the reference gives its insurance toggle), a 6 card carousel, and a `+` on each card that opens Highlights plus two Q&A blocks |
| 5 | Journey | Lede and a photo on the left, a five step timeline on the right. Matched to the reference: 24px step headings, a 24px ringed dot sitting on the rule |
| 6 | What is included | Six tile mosaic: two photos, two colour tiles, a vial tile and a habits trio. See **The includes mosaic, second pass** |
| 7 | The clinician | Replaces the reference's roster of ~100 named providers. Certificate style block |
| 8 | Comparison | Nine rows, the Chime column framed |
| 9 | Reviews | Six quote cards in the same carousel |
| 10 | Closing band | The reference's black app band, repurposed as the last assessment CTA |
| 11 | FAQ | Ten accordion rows |
| 12 | Footer | Brand, LegitScript seal, five legal links, the standing disclaimer |

## What the reference does that this page does not

- **Brand drug names and their photography.** Wegovy, Zepbound, Ozempic, Mounjaro, Rybelsus and
  Foundayo are Novo Nordisk and Lilly marks, and the per-card "FDA approved" seal is true of those
  products, not of a compounded one. This page names molecules and shows Chime vials.
- **The insurance frame.** The reference's third hero bullet, its with/without insurance price
  toggle and its "as low as $25/mo with insurance" row all assume insurance billing. Chime does
  not bill insurance, so the frame is gone and the select switches plan length instead.
- **The provider roster** (patients here are not choosing from a list) and the **"better in the
  app" band** (there is no Chime app).
- **Trustpilot 4.5/5**, the referral link, the BBB badge and the mailing list field. A form with no
  endpoint is worse than no form.
- **The "every 4th month free" offer.** It was on the page in the first build, carried from the
  Chime checkout, and the client removed it on 2026-09-22 to stay consistent with the reference's
  structure. It is not part of that structure, so it is gone from the hero, the price select, all
  six treatment cards, the comparison table and the FAQ. A test keeps it out.

## ⚠️ Flagged, built as written

- **Every price on this page is a placeholder.** Client, 2026-09-22: "we don't need any of the 4th
  month free on there, I want to stay consistent with their page structure, I'll manually edit costs
  etc for you to change after". The numbers standing are the `chime-checkout` ladder used as layout
  stand ins until the client sends the real ones. The care subscription figure stays a visible
  **`$[TBD]`**: the reference sells care separately and Chime never has.
  **To change a price**, edit the two places it appears on that treatment card: `data-p3` (3 month)
  and `data-p1` (month to month) on the list item, which `js/wlp.js` reads for the select, and the
  `Price:` line inside the panel. A test fails if the two drift apart.
- **The results band** carries the published semaglutide 2.4 mg trial figures the reference cites,
  with `[CITATION TO CONFIRM]` on the page. The client must confirm the citation, and confirm it
  may be shown beside a compounded product.
- **Per-product expected loss ranges** are from the same drug literature, marked `[TO CONFIRM]`.
- **Billing, refunds, HSA/FSA and labs by state** are the reference's commercial terms. Here they
  are visible `[CLIENT TO CONFIRM]` answers: only the client can set them.
- **The clinician is fictional** (Dr. Ryan Calder) and the photo is a stock/AI portrait.
  **The six reviews are fictional**, flagged on the page as illustrative.
- **"Licensed in 38 states"** and the labs line are carried from the `_ind` landings, unconfirmed.
- **Tesamorelin off label use** is called out in its own card panel, as everywhere else on the site.
- **Safety copy** is a summary and is marked for counsel review.
- Every photo is a layout stand in, not a Chime patient or employee.

## Photography

Luis, 2026-09-22: "use white people assets". The first pass borrowed the
`chime-metabolic-reset_ind/` set, which was cast for a South Asian audience and belongs to those
pages. This page now uses its own cast, all sourced from assets already in the repo:

| Where | File | Source |
|---|---|---|
| Hero, a member | `hero-800/1600.webp` | `uploads/emily.png`, cropped 4:3 |
| Clinician block | `care-800/1600.webp` | `uploads/mark.png`, cropped 4:3. The fictional name matches the portrait: **Dr. Ryan Calder, MD** |
| Mosaic, support tile | `incl-clinician-800.webp` | `assets/photo-start.jpg` |
| Mosaic, stay on track | `incl-track-800.webp` | `uploads/executive-goal-recovery.webp` |
| Mosaic, treatment tile | the three vial renders | `uploads/vials/amber/` |
| Journey | `journey-800/1200.webp` | `uploads/executive-goal-vitality.webp`, cropped 4:3. The reference puts a photo here with a "down 26 lbs" overlay chip; the chip is a before/after style results claim and was not carried |

The two portraits share the same warm sand ground, which is also the page canvas, so the hero and
the clinician block read as one set. Watermarked stock in `assets/` (`photo-weight.jpg`,
`photo-labs.jpg`) was not used.

## The includes mosaic, second pass

Luis, same day: the first mosaic "is not look well at all". What was wrong and what changed:

- **Tiles were too short** (a 150px `min-height` with `object-fit: cover`), so people were cropped
  at the chin and the vial photo read as noise. The desktop grid now sets explicit row heights and
  the photo tiles are two rows tall; `object-position` keeps both faces clear of the caption.
- **The last row was a tall empty band**, because `grid-auto-rows` applied its fixed height to the
  habits strip too. The grid now declares `grid-template-rows` with `auto` for that last row.
- **The third photo tile is gone.** A cropped product shot could not survive that size, so
  "Find the treatment that fits" is now a light tile carrying the three vial renders, laid out
  copy-left / vials-right on desktop so nothing is clipped.

## Verification

- `node chime-weight-loss-program/js/wlp-tests.js` — 159 checks, including zero em dashes, no brand
  names in the body, headline before any label, every local link resolving, every stand in visible,
  and that the script never branches on a click event's `detail`.
- `bash ui_kits/shared/check-theme-agnostic.sh` — 0 warnings.
- Chromium 1440 / 768 / 390: no horizontal overflow, 0 broken images; 7,126px, 8,191px and 9,586px tall.
- **WebKit with real touch (Playwright, iPhone 13)**: filter chips, the `+` panels, the carousel
  arrows, a swipe on the reviews rail, the FAQ rows and the price select all respond to taps. This
  pass exists because of the 2026-09-21 Safari bug, where a tap arrived as a click with `detail` 0
  and the quiz never advanced.

`?v=20260955`.
