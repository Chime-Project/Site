# chime-get-started-glp-tesa

The GLP + Tesamorelin version of the get-started lander, following the client's doc "glp plus tesa.docx" (2026-09-29):
"EXACT SAME VERSIONS AND PAGES AS THE ONE YOU DID FOR THE GLP + NAD, ALL WE WILL BE DOING IS SWAPPING OUT THE NAD FOR
TESAMORELIN". It is the first page of the Deep Belly Burn funnel: this page → `../choose-treatment/v6.html` (product
selection, version 1) → `../choose-treatment/checkout-v6/`. Version 2 (`v7.html` → `checkout-v7/`) is reached by its own link.

It is `../chime-get-started-glp-nad/` (see its README) with the NAD+ offer swapped:

| Where | Now |
|---|---|
| Banner | "Fall sale discount: 🎉 BONUS: **FREE TESAMORELIN ($299 VALUE)**" |
| Hero | "See if you qualify for this special GLP/Tesamorelin offer", "Your Complete GLP-1 and Tesamorelin Program Starts Today" |
| Hero art | `images/hero-glp-tesa.webp`: the NAD+ page's layout, the bonus vial's gold label now "Tesamorelin" (no "Compounded", as the client asked), "Contains Tesamorelin", "Supports lean mass and metabolism while you lose weight, as prescribed by your clinician." |
| Plan cards | "Deep Belly Burn Plus" (Compounded GLP-1+GIP & Tesamorelin - both in one plan, $359) and "Deep Belly Burn" (Compounded GLP-1 & Tesamorelin - both in one plan, $299); the tick reads "Free Tesamorelin to support lean mass and metabolism while you lose" |
| Card art | `images/tirzepatide-tesa-plan.webp`, `images/semaglutide-tesa-plan.webp`: the taupe-label bonus vial relabelled "Tesamorelin" / "Tesamorelin acetate" |
| Offer band | "New Customer Offer: FREE Tesamorelin ($299 Value)", "Join today to receive your free Tesamorelin!" |
| CTAs | every "Check Eligibility" and "Take the quiz" → `../choose-treatment/v6.html` |

Everything else is the NAD+ page's, unchanged.

Rebuilt by untracked scripts in `uploads/get-started-wl-ref/`:
- `glp_tesa_art.py` makes the three images above, the amber blue-label Tesamorelin vial
  (`uploads/vials/amber/tesamorelin.webp`) and the vial pairs for the selection pages and checkouts
- `glp_tesa.py` copies the NAD+ lander and swaps the offer, each edit asserted by count, and writes `js/lander-tests.js`
  (from `glp_tesa_tests.js`) and this README

Tests: `node chime-get-started-glp-tesa/js/lander-tests.js`. Plan: `GLP-TESA-GOLD-PAGES-PLAN.md` (untracked).
`noindex`.
