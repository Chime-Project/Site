# chime-belly-first-reset_ind-v2/

V2 of the Belly-First Reset landing (`chime-belly-first-reset_ind/`), the vivid look of
`chime-metabolic-reset_ind-v2/`. Live: https://chime-project.github.io/Site/chime-belly-first-reset_ind-v2/

**Luis, 2026-09-21:** "do a v2 version of this colorful as the last landing page". **Client, same day:** "Can you do
the colorful V2 and emphasize the headline; also we can make up peoples names etc so we don't need placeholders on
these or the nad one."

A detached copy of V1 (same copy, quiz, images, script and tests; V1 untouched) plus:

- `css/pop.css`, loaded last: the Metabolic Reset V2 sheet as is (royal indigo + marigold + rani pink, marigold
  buttons, festival stripe, colour-coded trust chips, framed quiz card, certificate-style clinician block, gradient
  price, dot-grid dark bands; the research behind it is in `chime-metabolic-reset_ind-v2/README.md`) with this
  page's additions at the end: the belt line in marigold with indigo standard-chart marks, the cross-section
  figure framed, the two-jobs diagram recoloured, a sixth benefit tile colour.
- **Headline emphasis:** the H1 is set larger (up to 3.9rem on desktop) with "to the belly first." highlighted,
  marigold on the phone photo card, the saffron-to-plum gradient on the ivory desktop ground.
- **Facts strip** under the trust bar: 35 / 31 in · 15-18% · 12-16 weeks. Every number is already on the page.
- **Fictional names in place of the placeholders** (client's call): Dr. Anand Mehta, MD, "Board certified,
  Internal Medicine", "Licensed in 38 states"; testimonials Priya S. (Fremont CA), Rohan K. (Jersey City NJ),
  Vikram D. (Houston TX); micro-testimonial Meera T. (Sunnyvale CA). The [Business address] footer line is
  dropped. **All of these are made up for the preview** and must be replaced by the real physician and real,
  consented members before launch (FTC). The same names went into `chime-metabolic-reset_ind-v2/` (Neha R.,
  Arjun P., Sanjay M., Kiran B. there). The price stays `$[TBD]`: a number only the client can give.

Tests: `node chime-belly-first-reset_ind-v2/js/reset-quiz-tests.js` (110 checks; adds: no name placeholders left,
headline emphasis present, facts strip present). V1's flagged items (off-label tesamorelin language = counsel
critical path, price, dosing and monitoring protocols, citations, NABP wording, 4.7 rating, LegitScript) all still
apply; `noindex`.
