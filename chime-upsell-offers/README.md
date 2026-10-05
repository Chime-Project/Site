# chime-upsell-offers/ — post-purchase add-on offers (TrimRx format, choose-treatment-original look)

Client, 2026-10-05: a screen recording of TrimRx's three one-click offers after checkout (NAD+ → Sermorelin → Zofran;
the reference URL is lost), "same text format … but using the style of choose-treatment-original … all the crap they
have: animation, countdown timer, decline price decrease etc". Plan: `UPSELL-OFFERS-PLAN.md` (untracked), with the
copy, prices and timings read off the recording frame by frame.

| File | What it is |
|---|---|
| `index.html`, `sermorelin.html`, `zofran.html` | Offer 1 / 2 / 3. Identical shells (header, step bar, footer) that only name their offer (`data-offer`); the offer is rendered by `js/upsell.js` |
| `done.html` | After offer 3: their patient-portal welcome in this look (welcome card + confetti, three tiles that are not links, the order with every add-on accepted) |
| `js/offers.js` | ONE place for copy and prices: both asks of each offer (30% / 50%), banners with and without the name, decline wording, timings |
| `js/upsell.js` | The engine: countdown, the two-step decline, plan picker, routing, session, confetti (GSAP 3.13 + Physics2DPlugin, from unpkg like the rest of the site) |
| `css/upsell.css` | The look, on top of `../choose-treatment/css/checkout.css` (header and step bar markup reused as is) |
| `js/upsell-tests.js` | `node chime-upsell-offers/js/upsell-tests.js` — every price in both asks, banners named / unnamed, routing, page wiring, the checkout hand-off |

- **Entry:** "Complete" on `../choose-treatment-original/checkout/` (once the browser's own form validation passes) →
  `../choose-treatment-original/js/to-upsells.js` keeps the first name in sessionStorage (`chime:upsell`, never in the URL)
  and opens offer 1 with `?med&term`, which the order line reads ("Semaglutide - 1 month plan" without them).
- **Mechanics, on the recording's timings:** a 10-minute countdown restarted on every ask (it stops at 0:00); "No thanks…"
  → "Declining..." 1.1 s → jump to the top, the after-decline ask (new banner, 30% → 50% off everywhere) → confetti 0.5 s
  later, ~4.5 s; a second "No thanks…" → the next offer (confetti again); "Yes! Add to my plan!" records the offer + plan
  and goes to the next offer. Nothing is charged (no payment backend). Confetti is skipped under reduced motion.
- **Choices on what the recording does not show:** the button shows the per-month figure for 3 / 6 / 12-month plans;
  the "English" language switch is left out; the first word of the name is used, as typed.
- **Product art:** Chime's amber NAD+ and Sermorelin vials (`uploads/vials/amber/`) and the Chime tablet photo
  (`uploads/products/zofran-tablet-chime.webp`), as WebP in `images/`.
- **Flagged, carried from the reference:** TrimRx's prices and unreconciled "saving" figures; the invented scarcity
  ("today's winner", "randomly chosen", "one customer each day", "93% / 92% of patients", the resetting timer, "the
  cheapest you can buy Zofran"); the claims ("turns back the clock at the cellular level", "kills nausea fast — works
  in minutes", "the same anti-nausea med hospitals trust", "years younger", "tighter skin"); "One Click. No extra payment
  info needed" (needs a stored card); the "Patient Portal" on `done.html` (Chime has none). `noindex`.
- The pages were written by the untracked `uploads/upsell-offers-ref/gen_upsell.py` (shell from
  choose-treatment-original); they are plain HTML and can be edited by hand.
