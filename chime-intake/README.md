# chime-intake/ — GLP-1 intake flow (branding-only clone)

Clone of a competitor's GLP-1 intake funnel, "RIP The Entire Flow" (client sheet, 2026-10-06). Plan:
`GLP-MEMBERSHIP-AND-FLOW-RIPS-PLAN.md`, Part B (repo root, untracked). Their colours, fonts, layout, copy, questions,
DQ rules, prices and plan ladder are kept; only the branding is switched (see the head comment of `index.html` for the
full changed / kept / flagged list).

| Page | What it is |
|---|---|
| `index.html` | Screening (21 questions on one page, live BMI card, DQ alerts) → "You're a Great Fit" → "Your medical profile" + contact form, like theirs |
| `recommendation/index.html` | "Congrats {name}!", weight projection chart, Semaglutide / Tirzepatide cards (Tirzepatide preselected) |
| `checkout/index.html` | HIPAA "Before You Continue" sheet → shipping address → choose your plan + payment (look-alike, takes no payment) |

| File | What it is |
|---|---|
| `js/intake-config.js` | Their step config: every question, option, show/hide rule, DQ rule, projection formula; 5 dormant steps kept, filtered out as theirs |
| `js/intake-rules.js` | Their pure rules: validation, phone mask, DOB, address checks, months-to-goal and projection maths |
| `js/intake.js` | Intake engine (their markup and behaviour: scroll-to-error, auto-scroll to the next question, step phases) |
| `js/plans.js` | Their promo plan ladder (monthly / 3 / 6 / 12 months, both medications) |
| `js/recommendation.js`, `js/checkout.js` | The two later pages |
| `js/intake-tests.js` | `node chime-intake/js/intake-tests.js` (237 checks) |
| `css/base.css`, `intake.css`, `recommendation.css`, `checkout.css` | **Generated.** Their compiled sheets, unchanged (fonts self-hosted, latin subset) |
| `css/chime-checkout.css` | Inert look-alikes of their Stripe Link button and card form |
| `images/`, `fonts/` | Chime logos in their logo canvas, Chime vials, Chime-owned people stand-ins (higgsfield-avatars/ + a generated before/after pair), their 4 fonts |

Regenerate the generated files with the build script kept (untracked) next to the capture in `uploads/`.

- **Nothing is sent or stored server-side.** Answers ride in `sessionStorage` from page to page. No request leaves the
  page except Chime's LegitScript seal image (Nick's code, as on every Chime footer).
- **Stand-ins / flagged:** their claims (18,000+ reviews, 100,000+ patients, 94.6 %, Weight Loss Warranty, 4-hour
  approval, ~16 % / ~22 %, testimonials), their prices, the required SMS-marketing consent (TCPA question), Trustpilot
  buttons (inert), the people photos (stand-ins, review names theirs).
- **§4c:** review-card titles now lead (avatar / name / badge / stars below). Two of their disclaimers still sit
  directly above a heading: the "*" footnote of the great-fit copy above "What Happens Next:" and the graph's estimate
  caption above "Let's proceed to check your eligibility" — they close the block above, they are not labels; kept as
  theirs, flagged for Luis.
- Rendered checks (agent-browser, 390 + 1440): no text node within 60 px above a visible h1–h3 apart from those two,
  no horizontal scroll, no console errors, no external requests but the seal.
