# choose-treatment/checkout

The payment step of the Choose Treatment funnel. It is a rip of the WellMedoc checkout
(`intake.wellmedr.com/checkout`, Semaglutide 3-Month plan) with Chime branding (client, 2026-09-24: "checkout rip …
use amber chime vials"). The layout, copy, prices, behaviour **and colour theme** are theirs: the client asked to keep
"the same color theme as the original", which replaced a first version on the Chime palette. The branding is Chime's,
and so is the font (Quicksand).

| File | What it is |
|---|---|
| `index.html` | Their rendered markup (classes untouched), plus `<template>`s for their other states: the summary without the coupon and the four reviews |
| `css/checkout.css` | Their compiled Tailwind sheet pruned with PurgeCSS, colours untouched. Then a small layer: Quicksand and the card-form look-alike in Stripe's default colours |
| `js/plan-fill.js` | Makes the order summary follow the plan chosen on `../v2.html` (see below) |
| `js/checkout.js` | Their behaviour: Remove / Redeem the 200off coupon, the review carousel and the phone accordions. "Choose" goes back to `../v2.html` |
| `js/checkout-tests.js` | `node choose-treatment/checkout/js/checkout-tests.js` |
| `images/`, `fonts/` | The Chime logo, their gold seal with the Chime wordmark, their van with the Chime wordmark, the amber Chime Semaglutide and Tirzepatide vials, their three staff and member photos, and Quicksand |

**No payment can happen on this page.** Their Stripe card form is replaced by a static look-alike of the same size.
Its fields have no names, the form has no action, the script sends and stores nothing, and "Complete Intake &
Checkout" does nothing.

## Shipping Information (2026-09-25)

The client's doc "checkout page address addition.docx" asked for the Email box (between "OR" and "Payment Method") to be
replaced by a Shipping Information section. It sits in the same spot and has these fields, in the reference's order:

- First name and Last name
- Address line 1
- Address line 2 (optional, with the placeholder "Apt., suite, unit number, etc. (optional)")
- City
- State (50 states + DC, starting on "Select") and ZIP code
- Phone number, with a US +1 prefix
- Email, which moves in here, so the page still has one email field

It uses the card form's look-alike (Stripe's default colours, label and field sizes, Quicksand), and the heading is in the "Payment
Method" style. On phones the two-up rows stack, with the same container rule as Country / ZIP. The phone formats as typed
to `(515) 321-2343` and the ZIP keeps 5 digits. Every field carries an `autocomplete` hint so browser autofill works.

**Nothing is sent or stored.** The fields have no names and sit in no posting form, just like the card form. The fields are
`required`, so the browser's own "fill out this field" hint shows when "Complete Intake & Checkout" is pressed with a field
empty (their Email box already did this). Otherwise the button still does nothing.

It lives in `build.py` (`SHIP_FORM`, which replaces the Email `<div>` the same way `CARD_FORM` replaces Stripe's box) and in
`chime-layer.css`. The formatting is in `js/checkout.js`.

## The order summary follows the chosen plan (2026-09-24)

This follows the client's doc "Chime Microdose Gold Page.docx". The markup still carries their Semaglutide 3-Month numbers.
`js/plan-fill.js` swaps them for the chosen plan in both summaries (desktop and phone) and in both coupon templates.
It prices the plan from `../js/plans-data-v2.js`, the same file the plan page renders from.

The plan comes from the URL, `?med=tirz|sema&term=1|3|6|12`, which is what the plan page's buttons open.
Without one it uses the plan page's sessionStorage record, and failing that, Microdose Semaglutide 3-Month.

| Spot | Rule | Tirzepatide 6-month |
|---|---|---|
| Title + photo | "<name> <N>-Month Plan" and that drug's amber vial and badge | Microdose Tirzepatide 6-Month Plan |
| As low as | the monthly price ÷ 30, to the cent | $129 / 30 = $4.30/day |
| Package line | "<N>-Month Treatment Package", "Covers N months" | 6-Month |
| Package and Total Due Today | crossed-out = total + $200, then the total | ~~$974~~ $774 |
| Per day under the total | same as "As low as" | $4.30/day |

When the coupon is removed, the price is the crossed-out one (total + $200).

**Still theirs, not confirmed for Chime:** the 200off coupon,
"FSA/HSA eligible", the free benefits and their crossed-out values, "Join 200,000+", Excellent 4.7 and the four
reviews, "FedEx within 48 hours", "Results or you don't pay" and the care guarantee. The phone number is a
`1-XXX-XXX-XXXX` placeholder.

The client's link carried a customer's name, email and address. The page was captured without them, and none of it
is in this folder (the tests check).

The page is rebuilt by scripts kept untracked in `uploads/wellmedoc-checkout-ref/`:
- `art.py` makes the brand art
- `build.py` produces the page and the stylesheet from the capture in the same folder

`build.py` needs PurgeCSS resolvable from its parent folder. The capture must never be committed.
