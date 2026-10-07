# Chime Health — GLP membership page

A new Chime page (not a clone), from the client sheet of 2026-10-06: Collective's price story
(`../chime-holistic-weight-loss/`) told in the Sesame V2 design (`../chime-weight-loss-program-v2/`).

- **Devin:** "combine elements of #1 & #2 together in a clean marketing package … I like the sesame style
  better, but I want the initial focus to be on the lower prices and then the cost of membership."
- **Luis:** Sesame V2 as the base; "membership as low as $17/month"; pricing is the focal point; the
  medication price in bold with the membership below it; Collective's content sections designed for
  conversion with one regular CTA and aggressive marketing. GLP-1 first, a broader version later
  (planned folder: `../chime-membership/`).

## Preview

    cd ~/Sites/chime && python3 -m http.server 8791

then http://localhost:8791/chime-glp-membership/

## Sections (`data-screen-label`)

| Label | What it is | Source |
|---|---|---|
| GLPM Hero | h1 = "Get GLP-1s from $59/month"; price card with semaglutide $59 / tirzepatide $69 large, "+ Membership as low as $17/mo" underneath; ticks; See my price + See if you qualify | Sesame V2 hero, price hierarchy flipped (client screenshot 07) |
| GLPM Trust | scrolling strip: same price any dose, pharmacies, testing, messaging, shipping, nutrition | Collective marquee |
| GLPM Pricing | two price cards, med price as the hero figure, membership below, $435 anchor struck through on tirzepatide, Learn more panels | Sesame V2 cards (screenshot 07) + Collective products |
| GLPM Why | "Why is the price so low? What's the catch?" | Collective (screenshot 01) |
| GLPM Savings | month slider 1–12, Chime vs typical program totals and bars, saving, paid-back pill | Collective calculator (screenshot 02) |
| GLPM How | five steps + "$4,000+ saved a year" bubble | Collective How it Works (screenshot 04) on V2's journey |
| GLPM Results | three green result cards (23 %, 18 %, $4,060) with the study links | V2 result cards |
| GLPM Reviews | review rail | V2 rail, fictional reviews |
| GLPM Benefits | three marquee rows of benefit pills | Collective (screenshot 03) |
| GLPM Compare | V2 table **minus "Provider choice"**, "Cost of medication" → **"Discounted medication"** | client mark-up (screenshot 05) |
| GLPM FAQ | 10 questions on price, membership, trial, safety | new copy |
| GLPM Close | purple band with the prices restated | new |
| — | phone sticky price bar (after the hero, hidden over the closing band) | new |

**Left out on the client's instruction:** V2's providers grid (screenshot 06) and every "choose your
provider" claim; "no markups" wording. Client screenshots: `uploads/glp-membership-ref/` (untracked).

## Figures (all in `js/page.js` → `PRICES`, flagged stand-ins in the head comment)

$59 semaglutide, $69 tirzepatide (any dose), $199/year membership (= $16.58, shown as "as low as $17"),
21-day free trial: Collective's figures. The calculator uses Collective's formula (membership from month 2)
and its competitor table (Ro / Found / MEDVi tirzepatide, August 2026) as an **average** ("typical
program"): month 6 = $613 vs $2,475, month 12 saves $4,060 (80 %); typical monthly = $435.

## Tests

    node chime-glp-membership/js/page-tests.js

82 checks: savings maths month 1–12, every price on the page matching `PRICES`, medication price before
membership in the hero and on both cards, all CTAs → `../chimeAssessment.html`, the client exclusions,
noindex, asset versions, images present.
