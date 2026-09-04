# AmeriLean — 1 / 3 / 6-month plan landing (Version A)

Design prototype of the AmeriLean GLP-1 landing with a plan-length selector
instead of a single 3-month card. Built on `amerilean-landing/` (the AmeriLean
UI kit: slate / teal / mist / sand / terracotta on porcelain, Noto Serif), using the
before/after photos from the original GLPQuizFR landing. Every button is a blank stub
(`href="javascript:void(0);"`): nothing navigates to the assessment.

## Preview

    cd ~/Sites/chime && python3 -m http.server 8791

then open http://localhost:8791/amerilean-plans-landing/

## What changed versus `amerilean-landing/`

- **Hero**, rebuilt on the CRO findings: plainer lede (5th–7th grade reading
  level), the pre-selected plan priced above the fold in an offer card
  ("$112/mo effective · $447 today, covers 4 months · next charge in 4 months")
  with the monthly price as the anchor and an in-page link to the selector,
  "See If I Qualify" as the single CTA with "if prescribed · cancel anytime"
  fine print, a trust row (licensed providers, discreet shipping, HIPAA), and
  the real rating and volume from the original landing (4.4 · 4,000+ reviews ·
  100K+ patients). The card follows the 1/3/6 toggle. Photos are the original
  landing's before/after (`model-before.jpg`, `model-after.jpg`).
- **Proof strip** aligned to the original's figures: 100K+ patients, 4.4 rating,
  ~15% average weight loss at 1 year, $0 hidden fees.
- **Testimonials**: the six members of the original landing (Hannah, Will,
  Mary, Jay, Nicole, Chanel) with their photos, quotes and results replace the
  template's stand-ins; the share image is the original `og-image.jpg`.
- **Plan section** (`#plans`): a 1 / 3 / 6-month toggle under the intro,
  3 months pre-selected. The two medication cards keep the kit's `.plan`
  components; the offer strip, price label, price, rate/retail note, charge
  line, saving line and button label change with the term. One price table in
  `js/plans.js` drives every figure; `css/plans.css` holds the toggle and the
  charge/saving lines.
- **Copy rule**: "4 months for the price of 3, every cycle" leads; "4th month
  free" supports it; the monthly term states what it lacks ("No free month.
  Over 4 months you pay $996.").

## Page order and cuts (CRO pass)

Order: hero → proof strip → "Month 3 is the turning point" (chart + three
facts) → plan selector → how it works → testimonials → comparison → FAQ →
closing CTA. Reasons, from the research brief in the plan:

- Attention concentrates in the first two screens, so proof and the offer
  moved up and the plan selector sits right after the evidence.
- "Why quitting early sets you up to fail" was merged into the Month 3 section
  (same message, no evidence of its own). Its lead-in survives as the intro.
- The weight-projection calculator was removed: a personalised weight-loss
  claim without trial-grade substantiation, and extra length.
- How it works keeps three short steps and one CTA phrase.
- FAQ is five questions that carry the renewal disclosures: eligibility, cost
  and inclusions, how the free 4th month works, next charge and cancellation,
  shipping.
- Three testimonials with one- or two-sentence quotes, a six-row comparison
  table (the "FDA-registered pharmacies" row was dropped as an FDA-approval
  implication risk), and a one-line closing. Page copy went from about 2,300
  words to about 1,250 (Unbounce's benchmark range is 355–1,020).
- Phone hero: the CTA moves above the offer card so it sits inside the first
  screen (top at about 320px on an iPhone 16).
- One CTA phrase across the page ("See If I Qualify"); plan cards keep
  "Start 3 months – Semaglutide" style labels.
- The footer's "limited time discount on your first order" signup became a
  plain health-tips signup, so it does not compete with the price-lock offer.

## Prices (anchored on this landing's $112 / $139 effective)

| | Semaglutide | Tirzepatide |
| --- | --- | --- |
| Retail anchor | $279/mo | $389/mo |
| 1 month | $249, billed monthly | $359, billed monthly |
| 3 months + 4th free | $149/mo rate · $447 every 4 months · $112 effective | $185/mo rate · $555 every 4 months · $139 effective |
| 6 months + 2 free | $139/mo rate · $834 every 8 months · $104 effective | $172/mo rate · $1,032 every 8 months · $129 effective |

The quiz's step 18 charges $596 and $896 per 3-month cycle today, so one
ladder has to be chosen before anything ships.

## Not in scope here

Quiz steps, Spanish version, LegitScript certification, and wiring the buttons.
