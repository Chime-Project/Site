# choose-treatment/checkout

The payment step of the Choose Treatment funnel. It is a rip of the WellMedoc checkout
(`intake.wellmedr.com/checkout`, Semaglutide 3-Month plan) with the **Chime look and feel** (client, 2026-09-24:
"checkout rip … use amber chime vials"; Luis: "do the chime look and feel"). The layout, copy, prices and behaviour
are theirs. The colours, font and branding are Chime's.

| File | What it is |
|---|---|
| `index.html` | Their rendered markup (classes untouched), plus `<template>`s for their other states: the summary without the coupon and the four reviews |
| `css/checkout.css` | Their compiled Tailwind sheet pruned with PurgeCSS, with every colour value remapped onto the Chime ramp (blue / slate). Then the Chime layer: Quicksand and the card-form look-alike |
| `js/checkout.js` | Their behaviour: Remove / Redeem the 200off coupon, the review carousel and the phone accordions. "Choose" goes back to `../` |
| `js/checkout-tests.js` | `node choose-treatment/checkout/js/checkout-tests.js` |
| `images/`, `fonts/` | The Chime logo, their seal repainted in Chime blue with the Chime wordmark, their van with the Chime wordmark, the amber Chime Semaglutide vial, their three staff and member photos, and Quicksand |

**No payment can happen on this page.** Their Stripe card form is replaced by a static look-alike of the same size.
Its fields have no names, the form has no action, the script sends and stores nothing, and "Complete Intake &
Checkout" does nothing.

**Still theirs, not confirmed for Chime:** every price ($467 → $267, $317 without the coupon), the 200off coupon,
"FSA/HSA eligible", the free benefits and their crossed-out values, "Join 200,000+", Excellent 4.7 and the four
reviews, "FedEx within 48 hours", "Results or you don't pay" and the care guarantee. The phone number is a
`1-XXX-XXX-XXXX` placeholder.

The client's link carried a customer's name, email and address. The page was captured without them, and none of it
is in this folder (the tests check).

The page is rebuilt by scripts kept untracked in `uploads/wellmedoc-checkout-ref/`:
- `art.py` makes the brand art
- `build.py` produces the page and the stylesheet from the capture in the same folder

`build.py` needs PurgeCSS resolvable from its parent folder. The capture must never be committed.
