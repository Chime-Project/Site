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
| GLPM Hero | h1 = "Get GLP-1s from $59/month"; **four benefits first** (23 % avg loss*, cravings, blood sugar / BP / energy, doctor + cold shipping; Luis 2026-10-06 "really emphasizing the benefits top of fold"); price card with semaglutide $59 / tirzepatide $69 large, "21 days free" + no multi-month plan; See my price + See if you qualify (first phone screen) | Sesame V2 hero, price hierarchy flipped (client screenshot 07) |
| GLPM Trust | scrolling strip: same price any dose, pharmacies, testing, messaging, shipping, nutrition | Collective marquee |
| GLPM Pricing | two price cards, med price as the hero figure, membership below, $435 anchor struck through on tirzepatide, Learn more panels | Sesame V2 cards (screenshot 07) + Collective products |
| GLPM Why | "Why is the price so low? What's the catch?" beside a **4.5 s seamless loop video** of the running couple (`images/why-loop.mp4`, 916 KB, H.264, muted autoplay; Higgsfield wan3_0 first = last frame from the still; poster `why-poster.webp`; reduced motion shows the still and pauses the video) | Collective (screenshot 01) |
| GLPM Savings | month slider 1–12, Chime vs typical program totals and bars, saving, paid-back pill | Collective calculator (screenshot 02) |
| GLPM How | five steps + "$4,000+ saved a year" bubble | Collective How it Works (screenshot 04) on V2's journey |
| GLPM Results | three green result cards (23 %, 18 %, $4,060) with the study links | V2 result cards |
| GLPM Reviews | review rail | V2 rail, fictional reviews |
| GLPM Benefits | three marquee rows of benefit pills | Collective (screenshot 03) |
| GLPM Compare | V2 table **minus "Provider choice"**, "Cost of medication" → **"Discounted medication"** | client mark-up (screenshot 05) |
| GLPM FAQ | 10 questions on price, membership, trial, safety | new copy |
| GLPM Close | purple band with the prices restated | new |
| — | phone sticky price bar (after the hero, hidden over the closing band) | new |

**Membership less prominent (Luis, 2026-10-06, phone mark-ups):** the "$17/mo membership" line is gone from the hero price card (only the "21 days free" tag stays), both price cards, the phone sticky bar and the tab title; later also out of the pricing intro; "leaving it alone here" = it stays in why-so-low, savings, how it works, the FAQ, the closing band and the fine print.

**Top of fold = no membership (client + Luis 2026-10-06):** like collective.org, nothing above the fold mentions membership or the trial; the first mention is the fine print under the price cards ("Chime membership required. Includes a 21-day free trial; after that, $199/year…"), then why-so-low. Conversion elements borrowed, kept Chime (logo, vials, purple): offer marquee on top (Trinity / NextMeds) and "Takes less than 2 minutes" under the CTA (Collective).

**Left out on the client's instruction:** V2's providers grid (screenshot 06) and every "choose your
provider" claim; "no markups" wording. Client screenshots: `uploads/glp-membership-ref/` (untracked).

## Hero versions (client 2026-10-07)

From the 8-option hero sheet the client picked 2, 4 and 6, at **$49 semaglutide / $89 tirzepatide**, and nothing may
say "no multi-month plan" (they need multi-month plans): gone from the offer bar, hero terms, FAQ and reviews.

| Page | Sheet option | Hero |
|---|---|---|
| `weight-calculator.html` | 2 + option 3's price boxes | "How much weight could you lose?", weight slider 140–400 lbs → "you could lose about N lbs" (23 %, footnoted), See my price, then the semaglutide / tirzepatide price boxes **below the button** |
| `price-card.html` | 4 | background photo removed; two-line headline "Lose the weight. **Feel like yourself again.**" (42 → 72px), $49/month card with both vials, ticks, "Start my 2-minute visit", trust row |
| `price-lock.html` | 6 | the live hero (benefits first, both prices) under a red "Today's $49 price is reserved for 15:00" bar in place of the marquee; the countdown is kept per tab (sessionStorage) and at 0:00 asks to lock the price in rather than claiming it expired |

Generated once from `index.html` (one-off script, not kept), then ordinary hand-edited pages. Below the hero
they are index.html re-priced: the calculator reads `<html data-sema data-tirz>` (js/page.js), so month 6 =
$733 vs $2,475 and a year saves $3,820 (75 %); "$3,800+" / "$3,820" / "up to 75%" replace the $69-era
figures. Hero-only styles in `css/versions.css`, the slider + countdown in `js/versions.js`. `index.html`
itself is unchanged ($59 / $69) and stays as is, and "Cancel anytime" stays on all three (Luis 2026-10-07: "leave the original
page as is, keep cancel anytime").

## Figures (all in `js/page.js` → `PRICES`, flagged stand-ins in the head comment)

$59 semaglutide, $69 tirzepatide (any dose), $199/year membership (= $16.58, shown as "as low as $17"),
21-day free trial: Collective's figures. The calculator uses Collective's formula (membership from month 2)
and its competitor table (Ro / Found / MEDVi tirzepatide, August 2026) as an **average** ("typical
program"): month 6 = $613 vs $2,475, month 12 saves $4,060 (80 %); typical monthly = $435.

## Tests

    node chime-glp-membership/js/page-tests.js

128 checks: savings maths month 1–12, every price on the page matching `PRICES`, medication price before
membership in the hero and on both cards, all CTAs → `../chimeAssessment.html`, the client exclusions, the three hero versions ($49 / $89, no multi-month wording),
noindex, asset versions, images present.
