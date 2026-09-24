# chime-get-started-weight-loss

A GLP-1 "get started" landing page. It is a clone of `wellmedr.com/pages/get-started-weight-loss`
with the logo and branding switched to Chime Health (client, 2026-09-23). Luis's rule for this
clone: change only what the client asked for (logo and branding), keep everything else the same,
and ask before any other change. The gold and navy are the reference's own, on purpose.

| File | What it is |
|---|---|
| `index.html` | The reference's rendered page markup (Shopify lander + PageFly sections), with the classes untouched |
| `css/lander.css` | Every stylesheet the reference loaded, in the same order, pruned with PurgeCSS. It holds no Chime styling |
| `js/lander.js` | The reference's two inline scripts, verbatim: the "What happens next" timeline and the FAQ accordion |
| `js/lander-tests.js` | `node chime-get-started-weight-loss/js/lander-tests.js` |
| `images/`, `fonts/` | The reference's images as webp (brand art repainted, see below), plus Outfit and Assistant (both OFL) |

**What changed (branding only):**
- the logos
- the brand name wherever it appears
- the Chime wordmark on the gold "Weight Loss Warranty" seal (in two cards and inside the hero art), the delivery van and the doctor's coat
- the LegitScript seal, now Chime's mark
- the phone number, now a `1-XXX-XXX-XXXX` placeholder
- every CTA, first to `../chimeAssessment.html`, now to the microdose plans (see below)
- the footer and legal links, now Chime's pages ("GLP-1 Safety Information" goes to `#`, since Chime has no such page yet)

**Kept exactly as the reference has it:**
- all prices and offers
- the Trustpilot award
- the before/after gallery
- the Ozempic / Zepbound cards
- the journal logos
- the sideways scroll the photo rows cause at desktop widths

## Microdose version (2026-09-24)

It is now the first page of the Microdose funnel, following the client's doc "Chime Microdose Gold Page.docx".
Luis chose to edit it in place. The funnel runs this page → `../choose-treatment/v2.html` (the microdose plans)
→ `../choose-treatment/checkout/`.

| Where | Now |
|---|---|
| Banner | $99/mo Semaglutide and $119/mo Tirzepatide (the 12-month prices) |
| Hero | "See if you qualify for Microdose GLP-1 weight loss medication" |
| Plan cards | "Choose Your GLP Microdose Plan", "Microdose Tirzepatide" / "Microdose Semaglutide", Starting At $149 / $129 |
| Tirzepatide pill | "Recommended for faster results" (Semaglutide's is unchanged) |
| Dose bullets | "Up to 5mg per week" on Tirzepatide and "Up to 1mg per week" on Semaglutide. The doc has them the other way round; Luis swapped them |
| Vials | the hero vial and both card vials repainted to amber glass. Labels, caps and the seal are untouched |
| CTAs | every "Check Eligibility" and "Take the quiz" goes to `../choose-treatment/v2.html` |

Kept as before: the Ozempic / Zepbound prices, "$150 off for Life", "Semaglutide & Tirzepatide in-stock" and the
drug names in the banner. The doc does not mention them.

The page is rebuilt by scripts kept untracked in `uploads/get-started-wl-ref/`:
- `brand_edit.py` repaints the brand art
- `build.py` and `assemble.py` produce the page and the pruned stylesheet
- `microdose.py` then applies the microdose copy and links. Run it after `assemble.py`; it is safe to run twice
- `amber_vials.py` makes the three amber vial photos (`*-amber.webp`)

That folder also holds the captured reference (rendered DOM, stylesheets, originals, screenshots). It must never be committed.
