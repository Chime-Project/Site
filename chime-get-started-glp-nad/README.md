# chime-get-started-glp-nad

The GLP + NAD+ version of the get-started lander, following the client's doc "glp plus nad gold pages - 2 product
selection versions.docx" (2026-09-28): "CREATE NEW VERSION OF THIS" of `../chime-get-started-weight-loss/`. It is the
first page of the Burn & Boost funnel: this page → `../choose-treatment/v4.html` (product selection, version 1) →
`../choose-treatment/checkout-v4/`. Version 2 (`v5.html` → `checkout-v5/`) is reached by its own link.

Everything is the Microdose lander's page (itself a clone of wellmedr.com/pages/get-started-weight-loss, see that
folder's README), with the doc's edits:

| Where | Now |
|---|---|
| Banner | "Fall sale discount: 🎉 BONUS: **FREE NAD+ ($299 VALUE)**" (the doc's box leaves the "Fall sale discount" start as it was) |
| Hero | "See if you qualify for this special GLP/NAD+ offer", "Your Complete GLP-1 and NAD+ Program Starts Today" |
| Hero art | `images/hero-glp-nad-2.webp`: the gold-label Tirzepatide vial, a gold-label NAD+ vial made from it (drawn larger, Luis 2026-09-28), and a smaller warranty seal, all inside the original art's area |
| Plan cards | "Choose Your GLP Medication"; "Burn & Boost Plus" (Compounded GLP-1+GIP & NAD+ - both in one plan, For those looking to lose 20+lbs, Starting At $359) and "Burn & Boost" (Compounded GLP-1 & NAD+ - both in one plan, For those looking to lose up to 20lbs, Starting At $299); each gets "Free NAD+ to support energy, focus and recovery while you lose" above "Cancel or change anytime" |
| Card art | `images/tirzepatide-nad-plan.webp`, `images/semaglutide-nad-plan.webp`: the card's vial and a taupe-label NAD+ vial side by side with a "+" disc, on the card's own gold panel |
| Offer band | "New Customer Offer: FREE NAD+ ($299 Value)", "Join today to receive your free NAD+!" |
| CTAs | every "Check Eligibility" and "Take the quiz" → `../choose-treatment/v4.html` |

Kept as the Microdose lander has it: the dose bullets, "Most Powerful Option" / "Proven & Steady", the Ozempic /
Zepbound cards and prices, "Semaglutide & Tirzepatide in-stock", the photos, the FAQ, the footer, and the sideways
scroll at desktop widths.

The NAD+ vials are relabels, not photographs: the label's text is painted out and new text is set in Avenir Next
("Compounded NAD+", "Contains NAD+" / "Nicotinamide adenine dinucleotide", "Supports energy, focus and recovery while you
lose weight, as prescribed by your clinician.", "RX Only", "Injectable").

Rebuilt by untracked scripts in `uploads/get-started-wl-ref/`:
- `glp_nad_art.py` makes the three images above (plus the vial pairs for the selection pages and checkouts)
- `glp_nad.py` copies the Microdose lander and applies the doc's edits, each asserted by count; it also drops the
  single-vial images this page no longer shows and copies in `js/lander-tests.js` (from `glp_nad_tests.js`)

Tests: `node chime-get-started-glp-nad/js/lander-tests.js`. Plan: `GLP-NAD-GOLD-PAGES-PLAN.md` (untracked).
`noindex`.
