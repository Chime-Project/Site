# chime-upsell-offers/ — post-purchase add-on offers (TrimRx format, choose-treatment-original look)

Client, 2026-10-05: a screen recording of TrimRx's three one-click offers after checkout (NAD+ → Sermorelin → Zofran;
the reference URL is lost), "same text format … but using the style of choose-treatment-original … all the crap they
have: animation, countdown timer, decline price decrease etc". Plan: `UPSELL-OFFERS-PLAN.md` (untracked), with the
copy and timings read off the recording frame by frame.

**Client, 2026-10-06** (plan `UPSELL-OFFERS-PRICING-PLAN.md`, untracked): Chime's own prices, and offer 2 renamed
Sermorelin → **Tesamorelin**. NAD+ Reg $269 → $149 / $119 / $89 a month (save $120 / $450 / $1,080); Tesamorelin Reg $299 →
$169 / $139 / $119 (save $130 / $480 / $1,080); Zofran $59 as a one-time charge (no Reg price, so nothing is crossed out; no plan name, no "/every 1 month" or "/mo" — client 2026-10-06). Monthly, 3-Month and
6-Month only (the 1-Year plan is gone). `sermorelin.html` is now a forward to `tesamorelin.html` (keeps `?med&term`).

| File | What it is |
|---|---|
| `index.html`, `tesamorelin.html`, `zofran.html` | Offer 1 / 2 / 3. Identical shells (header, step bar, footer) that only name their offer (`data-offer`); the offer is rendered by `js/upsell.js` |
| `done.html` | After offer 3: their patient-portal welcome in this look (welcome card + confetti, three tiles that are not links, the order with every add-on accepted) |
| `sermorelin.html` | The old offer-2 URL (live 2026-10-05): forwards to `tesamorelin.html` |
| `js/offers.js` | ONE place for copy and prices: the client's plan prices, both asks of each offer (the second parked, see below), banners with and without the name, decline wording, timings |
| `js/upsell.js` | The engine: countdown, the decline (one step, or the reference's two behind `declineDrop`), plan picker, routing, session, confetti (GSAP 3.13 + Physics2DPlugin, from unpkg like the rest of the site) |
| `css/upsell.css` | The look, on top of `../choose-treatment/css/checkout.css` (header and step bar markup reused as is) |
| `js/upsell-tests.js` | `node chime-upsell-offers/js/upsell-tests.js` — every client price and saving, the parked second asks, banners named / unnamed, the old-URL forward, routing, page wiring, the checkout hand-off |

- **Entry:** "Complete" on `../choose-treatment-original/checkout/` (once the browser's own form validation passes) →
  `../choose-treatment-original/js/to-upsells.js` keeps the first name in sessionStorage (`chime:upsell`, never in the URL)
  and opens offer 1 with `?med&term`, which the order line reads ("Semaglutide - 1 month plan" without them).
- **Mechanics, on the recording's timings:** confetti 0.5 s after every page loads (~4.5 s, skipped under reduced
  motion); a 10-minute countdown (it stops at 0:00); "No thanks…" → "Declining..." 1.1 s → the next offer; "Yes! Add to my
  plan!" records the offer + plan and goes to the next offer. Nothing is charged (no payment backend).
- **The after-decline price drop is parked.** The reference's second ask (jump to the top, the "we just increased your
  discount" banner, lower prices, timer restart, confetti) is still in the engine, but the client sent one price per
  plan, and showing that banner at unchanged prices would be a false claim. Add the second-ask prices to each offer's
  `second.plans` in `js/offers.js` and set `declineDrop: true` to turn it back on.
- **"Lifetime X% Off Applied."** = the Monthly plan's discount off Reg, rounded down (NAD+ 44%, Tesamorelin 43%); hidden
  on Zofran (no Reg). done.html lists each add-on as "$X/mo · You save $Y".
- **Choices on what the recording does not show:** the button shows the per-month figure for 3 / 6-month plans;
  the "English" language switch is left out; the first word of the name is used, as typed.
- **Product art:** Chime's amber NAD+ and Tesamorelin vials (`uploads/vials/amber/`) and the Chime tablet photo
  (`uploads/products/zofran-tablet-chime.webp`), as WebP in `images/`.
- **Flagged, carried from the reference:** the invented scarcity
  ("today's winner", "randomly chosen", "one customer each day", "93% / 92% of patients", the resetting timer, "the
  cheapest you can buy Zofran"); the claims ("turns back the clock at the cellular level", "kills nausea fast — works
  in minutes", "the same anti-nausea med hospitals trust", "years younger", "tighter skin"); "One Click. No extra payment
  info needed" (needs a stored card); the "Patient Portal" on `done.html` (Chime has none). `noindex`.
- The pages were written by the untracked `uploads/upsell-offers-ref/gen_upsell.py` (shell from
  choose-treatment-original); they are plain HTML and can be edited by hand.
