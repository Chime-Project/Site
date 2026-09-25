# Chime Health — Choose Your Treatment (plan-selection checkout step)

Rip of **https://intake.wellmedr.com/approval-confirmation** (client, 2026-09-16, via Luis: "rip this as is,
don't change colors or anything, just swap logo; vials can swap, prices I'll look at after"). Plan:
`CHOOSE-TREATMENT-RIP-PLAN.md` (repo root, untracked). Asana 1218566380294259.

**As is** means the opposite of every earlier rip: this page is **not** on `chime-theme.css` / the Chime
tokens. It carries the reference's own palette (ink `#41362a`, green `#26af59`, gold `#c19f68`, slate-blue
buttons `#7b95a9`), its font (Outfit, from Google Fonts; "Forbes" in Bodoni Moda standing in for the
reference's self-hosted Bodoni), its copy, layout and motion. Only two things are Chime's: the logo
(`images/logo-chime.svg`) and the vials (`images/*.webp`, the client's amber set from `uploads/vials/amber/`).

## Preview

    cd ~/Sites/chime && python3 -m http.server 8791

then http://localhost:8791/choose-treatment/ — check 1440 and 390 (the urgency strip and the "STEP 1"
treatment selector are phone-only, `md:hidden`; the "Choose Your Treatment" title is desktop-only).

## Files

| File | What |
|---|---|
| `index.html` | Static shell: header (Chime logo + "Secure Checkout"), Quiz ✓ → Shipping ✓ → Payment steps, urgency strip, title, selector and grid mount points. Head comment carries the stand-in list. |
| `css/checkout.css` | The reference's Tailwind 3.4 output reduced to the rules this page's DOM uses (extracted from its 59 KB `app.css`), class names kept so the DOM can be diffed 1:1 against the reference. Hand additions at the bottom: the selected-treatment state (`border-brand-gold`, the 0.9 rem radio dot), `.site-logo` width cap, and the grouped selectors the extractor dropped. |
| `js/plans-data.js` | **One place for every price, label and bullet** — `window.CHIME_CHOOSE_TREATMENT`. The client's ladder goes here when it arrives. Also the urgency defaults (5 discounts, 6:57), press names, rating, "what happens next" steps. |
| `js/checkout.js` | Vanilla port of the reference's React page: renders both medication cards and the mobile selector from the data with the reference's exact class strings; countdown (1 s) + "discounts left" decrement (8–15 s, first after 10–15 s, floor 1); "chose this today" counters (+1 with p = .8 per tick, same cadence, one random bump if none moved); selector click → `aria-pressed`, accent border + radio dot, smooth scroll to `#treatment-<id>` (`scroll-mt-20`). Timers stop on `pagehide`. |
| `js/checkout-tests.js` | `node choose-treatment/js/checkout-tests.js` — 100 checks (V1 + V2): money/copy lines, the reference's price literals, countdown and counter maths, renderer shape (4 buttons, 14 ticks, 4.5 stars, no hrefs, press strip, selected/unselected selector states). |
| `images/` | `logo-chime.svg` (= `assets/logo-main.svg`), `tirzepatide.webp`, `semaglutide.webp`. |

## V2 — the client's price points (2026-09-17, replaced by the Microdose plans below)

`v2.html` = the same page on the client's offer table ("only 6m/3m/1m, no 12M; push out the per month
price as well"): Semaglutide 1M $299 / 3M $627 / 6M $1,194, Tirzepatide 1M $359 / 3M $948 / 6M $1,794.
The 6-month plan takes the highlighted "best value" card, 3-month and monthly are the rows. Per-month =
total ÷ months (all whole dollars: $199 / $209 / $299 and $299 / $316 / $359); "save" = months × monthly −
total ($600 / $270 and $360 / $129). Data: `js/plans-data-v2.js` (`heroPlan`, `rowPlans`, `months` per
plan); css/js shared with V1 — `checkout.js` reads those three from data, so V1's output is unchanged.
The monthly plan's "$140 / $70 monthly savings locked in for life" bullet is dropped on V2 (the number
was the reference's and is false at these prices). Other copy and the stand-in claims are V1's.

## V2 = the Microdose plans (2026-09-24)

The client's doc "Chime Microdose Gold Page.docx" turned V2 into the microdose plan page. Luis chose to edit it in place,
so the questionnaire, which ends here, now lands on these prices.

- Names: "Microdose Tirzepatide" and "Microdose Semaglutide", on the cards and in the phone selector. The selector
  names wrap instead of truncating (`nameWraps`), so they are not cut off at 390 px.
- A 12-month option is back. The 12-month plan takes the highlighted card and 6 / 3 / monthly are the rows,
  which is V1's layout.
- "Save" = months × the 1-month price − total, which is $30 / $120 / $360 on both drugs.

| | 1 month | 3 months | 6 months | 12 months |
|---|---|---|---|---|
| Microdose Semaglutide, per month | $129 | $119 | $109 | $99 |
| Due today | $129 | $357 | $654 | $1,188 |
| Microdose Tirzepatide, per month | $149 | $139 | $129 | $119 |
| Due today | $149 | $417 | $774 | $1,428 |

Every plan button now opens `checkout/?med=<tirz|sema>&term=<months>`. That comes from `checkoutHref` in the data.
V1's buttons stay blank, and V1's rendered markup is byte-identical to before.

The section above describes the V2 ladder this replaced.

## V3 = the Gold product page of the price-lock funnel (2026-09-25)

This follows the client's doc "price lock to Gold product and checkout.docx". The funnel runs `chime-price-lock-offer/` (every button) →
`v3.html` → `checkout-v3/`. `v3.html` is V2's page on `js/plans-data-v3.js`, with these changes:

- the names are "Tirzepatide" / "Semaglutide"
- Tirzepatide's badge reads "Recommended for faster results"
- there is **no 12-month plan**, so there is no highlighted card, only the three rows

| Plan | Tirzepatide | Semaglutide | Line under the price |
|---|---|---|---|
| 6 months | $279 / month, $1,674 today | $179, $1,074 | "LOCK IN THIS PRICE" (green) |
| 3 months | $299, $897 | $249, $747 | "EVERY 4TH MONTH **FREE**, FOREVER" (FREE bold green) |
| Monthly | ~~$399~~ $279, "$279 due today" | ~~$299~~ $179, "$179 due today" | "Prescribed for only:" above; first tick "Ships every 4 weeks"; no footer note |

The renderer's new data fields are optional and default to the old output: `heroPlan: null`, `recommendedLabel`, `dueTag` /
`dueTagTone` (`*WORD*` = bold green), `wasPrice` and `plainDue`. The V1 and V2 renders are byte-identical to live.
`checkout-v3/` is the checkout page from the same build, sharing `checkout/`'s assets. Its order summary follows each plan's
`checkout` block (crossed-out price, badge, coupon code); see the root README. Flagged: the 3-month price per month is above
the monthly plan's, so its "As low as" per day is too. The free 4th month explains it, but the page doesn't say so.

## Luis's picks (2026-09-16)

- **Page one only.** The reference's buttons go to `/checkout` (a Stripe payment step with an order
  summary). That page is **not built** — "next step open". Captured for later in the session scratchpad
  (`checkout-body.html`, `checkout-desktop-full.png`).
- **Plan buttons are blank.** Real `<button>`s like the reference's; `onPlanSelect()` writes
  `sessionStorage.chime.chooseTreatment = {med, term, plan}` and nothing else. No `href`.
- **Counters and countdown tick** exactly like the reference ("counter component, keep it as the reference").
- **"Forbes · USA TODAY" stays.**

## Verified (2026-09-16, agent-browser)

- 1440: page height **2458 px = the reference's**, buttons 52 px, DOM outline (tag + classes + text, counters
  normalised) diff against the reference's rendered DOM = **0 lines**; no console errors.
- 390: no horizontal overflow; every section's height equals the reference's (header 53, steps 53, urgency 39,
  selector 446, Tirzepatide card 2429, Semaglutide card 2401); selector tap sets `aria-pressed`, green/gold
  border + radio dot, scrolls the card to 80 px from the top; counters and the discount count tick; a plan
  button click stays on the page and records the selection.
- `node choose-treatment/js/checkout-tests.js` → 78/78 (V2 checks added 2026-09-17).

## Stand-ins (flagged, need the client's yes/no)

Every price, "billed today" and "save" figure (the reference's — Chime's checkout ladder is $359 / $897 /
$1,794 per 1 / 3 / 6 months; note the reference's savings numbers are literals that do not reconcile with
its own monthly price); "Forbes · USA TODAY"; the 4.7 rating; "17,482 / 11,251 chose this today"; "Only 5
discounts left" + countdown; "Recommended for most patients"; "Lowest industry pricing"; "Highest success
rate"; "$140 / $70 monthly savings locked in for life"; "Clinician review within 24 hours"; "Free delivery".
`noindex` until signed off.

## Questionnaire tie-in (client, 2026-09-21)

`questionnaire/` (generated — see its README) ends on `v2.html`. `js/quiz-handoff.js` is loaded by
`v2.html` only, before `checkout.js`: no quiz record → it does nothing (V2 cold DOM diff vs the
pre-quiz build = 0 lines); `dq_enforced` → `questionnaire/disqualified.html`; `glp1_history` →
`window.CHIME_CT_PRESELECT`, which `checkout.js` reads at mount to mark the phone selector (state
only, no scroll; unknown ids ignored, so V1 is unchanged). `node choose-treatment/js/quiz-handoff-tests.js` — 8 checks.
