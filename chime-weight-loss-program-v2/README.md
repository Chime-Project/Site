# Chime Health — online weight loss program, V2 (the reference's own design and copy)

Client, 2026-09-22: "another version, no changes from original, pure as the base, use screenshot and
files to rip off". Luis chose: **the reference's design AND its copy verbatim**, in its own folder,
with V1 left untouched so the two directions can be compared as live URLs.

| | |
|---|---|
| **V1** | `../chime-weight-loss-program/` — the reference's layout in Chime's own look and words |
| **V2** | this folder — the reference itself, as closely as it can legally be reproduced |

Capture notes and the original plan: `../SESAME-WEIGHT-LOSS-RIP-PLAN.md` (untracked).

## Preview

    cd ~/Sites/chime && python3 -m http.server 8791

then http://localhost:8791/chime-weight-loss-program-v2/

## How the design was reproduced

Nothing here was eyeballed. Every value was measured with `getComputedStyle` on the copy of the
reference that Luis saved, and the numbers are written into the top of `css/v2.css`:

| | Reference | V2 |
|---|---|---|
| Body | 16px, `rgb(64,64,64)` | same |
| h1 | 48px / 60px, weight 670, tracking -0.56px, black | same |
| h2 | 28px / 36px, weight 670, tracking -0.56px, black | same |
| Fine print | 12px / 16px, `rgb(133,136,142)` | same |
| Primary button | `#5921CF`, radius 9999px, padding 0 24px | same |
| Selected chip | `#EEE9FA` on `#7A4DD9` | same |
| Result cards | `#219F63`, radius 8px, figure in the serif at 32px | same |
| Band | `#F5F5F6` | same |
| Column | 1156px | same |

**Fonts.** The reference uses Saans and Concrette, which are licensed to it. Neither is shipped.
V2 declares the rest of the reference's own fallback chains (`"Helvetica Neue", Inter, Roboto,
Arial` and `Georgia, "Times New Roman", serif`), so the shapes stay close without distributing
someone else's typefaces, and nothing is fetched from a third party.

## Four things could not be copied

Each is a deliberate departure, and a test fails if any of them creeps back in.

1. **The source company's name and logo.** Publishing them on a Chime URL would impersonate a real
   business. Every occurrence in the copy is swapped to Chime, the program reads "Success by Chime",
   and the masthead carries Chime's logo.
2. **Brand drug names.** Wegovy, Zepbound, Ozempic, Mounjaro, Rybelsus and Foundayo are Novo
   Nordisk and Lilly trademarks, and the cards' "FDA approved" seals are true of those products and
   not of compounded ones. Every mention became its molecule and the seals are not reproduced.
3. **The provider roster.** The reference lists about 100 real, named, rated clinicians. The grid
   keeps its layout with fictional names.
4. **The Trustpilot rating.** It is the source company's. Showing a 4.5 for Chime would be a
   fabricated claim, so that slot carries Chime's LegitScript certification instead.

Everything else is the reference: section order, components, the hero bullets, the three result
milestones and their citation, the medication cards with their dose ladders, the journey steps, the
mosaic, the comparison table, the reviews, the app band and all 15 FAQ answers, word for word.

## ⚠️ Nothing commercial on this page is Chime's

That is the point of the version, and also why it cannot take traffic as written:

- **The $59/mo care subscription, the $149 to $1,086 medication ladder** and every dose-by-dose
  price are the source company's.
- **"Price with insurance: as low as $25/mo" and the cash-pay / in-network toggle** assume a
  business that bills insurance. Chime does not.
- **The FAQ** carries their subscription tiers, billing cadence, refund policy, HSA/FSA position,
  lab coverage by state and a promotional offer, all verbatim and none of them Chime's terms.
- **The results milestones, the per-product loss ranges and the clinical claims** are theirs.
- **Photography** is the stand-in set from V1. **The reviews** are the source's wording with the
  company name swapped, not Chime members. **The clinician** named in the FAQ byline is fictional.

The footer carries one added line saying the page is a design reference and its figures are not
Chime offers. It is the only sentence on the page that is not from the reference, and it is there
because the page is live on Chime's domain. The page is `noindex`.

## Layout

| | |
|---|---|
| `index.html` | the page; every section carries a `data-screen-label` |
| `css/v2.css` | the measured design, section by section in page order |
| `js/v2.js` | the same five behaviours as V1 (rail, chips, price mode, expand panels, accordion), reading this page's `data-cash` / `data-ins` attributes |
| `js/v2-tests.js` | `node chime-weight-loss-program-v2/js/v2-tests.js` — 105 checks |
| `images/` | carried from V1 |

## Verification

- `node chime-weight-loss-program-v2/js/v2-tests.js` — 105 checks, including that the source
  company name, the brand drug names, the real clinician names and Trustpilot are all absent, that
  no licensed font is declared or shipped, and that the measured design values are the ones in the
  sheet.
- `bash ui_kits/shared/check-theme-agnostic.sh` — 0 warnings.
- Chromium 1440 / 768 / 390: no overflow, 0 broken images; 7,168px, 8,095px and 10,426px tall.
- **WebKit with real touch (Playwright, iPhone 13)**: chips, the `+` panels, the carousel arrows, a
  swipe and the FAQ all respond to taps; the price toggle switches all six cards between the
  cash-pay ladder and the $25 insurance figure.

`?v=20260956`.
