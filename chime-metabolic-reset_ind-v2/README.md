# chime-metabolic-reset_ind-v2/

## V2: what this folder is

**Luis, 2026-09-21:** "create a second version with this information, i need to pop up the ui taking in consideration
the indian people like". This is a detached copy of `chime-metabolic-reset_ind/` (same copy, quiz, images, script and
tests); V1 is untouched. Everything V2 adds is in two places:

- `css/pop.css`, loaded after `reset-lp.css`. The original sheet is token-based, so most of V2 is a palette swap in
  `:root` (royal indigo ink and dark bands, marigold to saffron for every action, rani pink as the small accent, warm
  ivory grounds) plus component polish: marigold buttons with dark text (about 8:1), a festival stripe on the
  masthead, a marigold ring on the hero photo, white trust chips with a colour per icon, a gradient frame on the quiz
  card, indigo answers that turn marigold when picked, a marigold / rani stepper, a saffron to rani BMI risk bar,
  colour-topped cards, a certificate-style frame on the clinician block, a gradient price, dark bands with a soft dot
  grid. No layout breakpoint, carousel rule or line of copy is changed.
- One new section in `index.html`, the **facts strip** under the trust bar (`data-screen-label="Facts"`): 23 / 7 points
  / 283,000+. Every number is already stated elsewhere on the page, so V2 adds no claim.

### The research behind it (2026-09-21)

The audience is Indian Americans, not users in India: 5.2 million people, median household income $151,200, 77% with
a bachelor's degree or more, 84% proficient in English (Pew, 2023 data). What that means for the UI:

| Finding | What V2 does |
|---|---|
| Indian and other Asian audiences read denser, more colourful interfaces as rich, not cluttered | Saturated palette, colour-coded chips and icon tiles, the facts strip, more visible structure per screen |
| English with cultural cues woven in works better than translated or stereotyped pages | No paisley, no script fonts, no flag colours as decor: the culture is in the people, the family dinner, the cricket, rice and roti, the copy (all already in V1) |
| High deference to authority (India scores 77 on power distance vs a world average of 56); third-party seals are trusted more than star ratings | The clinician block is framed like a certificate and the credential pills are gold on indigo; quality marks are louder than the rating |
| Family and food are shared decisions; stigma comes from relatives | Kept from V1: metabolic risk framing, no body or before / after imagery, no villain foods |
| Value-seeking despite high income | The price block is the loudest element of the offer, with the anchor line right above it |
| ADA screens Asian Americans at BMI 23; South Asians reach white adults' BMI 30 diabetes risk near 23.9; MASALA found 23% diabetes prevalence | The BMI 23 fact leads the facts strip (it was already the result slide's message) |

Evidence quality: Pew, the ADA and the cohort studies are solid; most UI-specific claims come from agency and Medium
posts and are hypotheses to test, which is what a V1 / V2 pair is for.

Sources: pewresearch.org/race-and-ethnicity/fact-sheet/asian-americans-indians-in-the-u-s ·
pmc.ncbi.nlm.nih.gov/articles/PMC4392932 · diabetesjournals.org/care/article/34/8/1741 ·
diabetesjournals.org/care/article/47/1/7 · pubmed.ncbi.nlm.nih.gov/40033844 · pubmed.ncbi.nlm.nih.gov/34382899 ·
internationalbusinesscenter.org/geert-hofstede/hofstede_india.shtml · en.wikipedia.org/wiki/Trust_signals ·
aabri.com/manuscripts/08126.pdf · procreator.design/blog/indian-startups-get-right-about-product-ux

Not done, on purpose: no WhatsApp or chat button (there is no real number behind it), no savings badge on the price
(a "save $X" figure would be a new claim), no new photos.

Everything below is V1's README and still applies to this folder (flagged items, house rules, image sources).

The Chime Metabolic Reset: a cold-traffic quiz landing page.
Live (after the push): https://chime-project.github.io/Site/chime-metabolic-reset_ind-v2/

**Request (client, 2026-09-21):** build the page written up in "Indian LP.pdf" on the format of
https://landing.fh.co/medication-wegovy-discount/. The PDF is the copy, the section order and the image map; the
reference is the format (phone-first single column, image-card hero, stepper + pill answers, result panel).
**Luis, same day:** the page is for Chime (the PDF says AmeriLean throughout, every mention is swapped), the
clinician is a man, and the questions live in a carousel inside the page. Plan: `METABOLIC-RESET-LP-PLAN.md` (repo root).
The PDF stays untracked: it holds personas, scores and launch blockers, and `uploads/` deploys publicly.

## Files

| File | What it is |
|---|---|
| `index.html` | The page: 15 sections, each with a `data-screen-label`. The head comment lists every flagged item. |
| `css/pop.css` | V2's vivid layer: palette tokens + component polish, loaded last |
| `css/reset-lp.css` | Phone-first styles; 768 / 900 / 1024 breakpoints. Palette values copied from `tokens/colors.css`. |
| `js/reset-quiz.js` | The question carousel, the result slide, the sticky bar. The rules are pure functions exported for node. |
| `js/reset-quiz-tests.js` | `node chime-metabolic-reset_ind-v2/js/reset-quiz-tests.js` (97 checks) |
| `images/` | Web exports (webp, two widths each) + the Chime logos. |

## The questions

One carousel, one slide on screen: start card, five questions, result. Answering a single-choice question slides to
the next one; the page never scrolls or navigates (the only scroll is on Start, which brings the card to the top of
the screen). Question 4 is "select all that apply": "This is my first serious attempt" clears the other answers and
the reverse, and Continue enables with one answer. Back and a right-swipe return to answered slides; going forward
is only possible by answering. Keyboard: arrow keys move the selection, Enter confirms. Hidden slides are `inert`.
With reduced motion there is no slide animation, no count-up, and the BMI marker starts at 23.

The result slide counts up to 5.9x / 8.0x, slides the BMI marker from 30 to 23 (its label reads the BMI under it on
every frame) and builds the "noted for your clinical review" chip from the answers:

| Chip item | Shown when |
|---|---|
| family history of type 2 diabetes | question 2 is anything but "Not that I know of" |
| belly-first weight pattern | question 3 is "Mostly around my middle" |
| prior weight loss attempts | question 4 is anything but "This is my first serious attempt" |

No items, no chip. Answers are saved to `sessionStorage` under `chime:metabolic-reset` (a reload resumes on the same
slide). "Continue My Assessment" goes to `../chimeAssessment.html`, which does not read the record today.

## Layout notes (Luis, 2026-09-21)

- From 1024px the questions section is two cells: the heading and its line on the left (sticky, top-aligned so it
  holds still while the card's height follows each slide), the carousel card on the right.
- From 1024px the two-vial image sits inside the mechanism band with 112px above it. On phones and tablets it still
  breaks the band's top edge, as the PDF's image note asks.

## House rules (from the PDF, enforced by the tests)

Zero em dashes anywhere in the page, the stylesheet or the script · headline first, any label below it · no
"AmeriLean" in visible copy · no before/after imagery, no body imagery, no food villain language.

## Images

All photos are AI-generated with Higgsfield (2026-09-21). Sources, rejected takes and the export script live in the
untracked `uploads/metabolic-reset/`; regenerate the web files with `python3 uploads/metabolic-reset/export.py`.

| File | Higgsfield job | Notes |
|---|---|---|
| `hero-clinician-*` | `59011272-5c48-4d19-8edb-485da0c63dca` | The face reference for the provider shot |
| `bridge-arjun-*` | `5c6068ce-ff12-4329-bb33-c45f70ef82cc` | Cropped 10% right and bottom (a pale laptop-like corner). The face reference for the cricket shot |
| `mechanism-vials-*` | `41a1f6d9-fe2b-4ca4-8d9e-38ed3743698a` | Only the empty surface is generated; the real Chime GLP-1 and NAD+ vial art is composited on it, so the labels are correct |
| `quality-hood-*` | `62469527-01f5-4d78-9936-bd2270ec577c` | |
| `benefits-cricket-*` | `99a6d2a3-cd42-4cdc-9421-3a05db8fb157` | |
| `provider-consult-*` | `1baa8563-5456-4907-9260-6cb560e62013` | STAND-IN: replace with the real physician's photo before launch |
| `offer-flatlay-*` | `1a6139cc-3aef-4711-a503-b0eac5616cf4` | No phone in the shot (the model draws brand marks on devices) |
| `close-dinner-*` | `77ed984d-c955-45f6-9711-8a20f158219e` | |

Badges, question motifs, step icons and the BMI scale are inline SVG / CSS.

## Flagged, built as written

The copy was written and "validated" for AmeriLean; none of this is confirmed for Chime. The PDF lists most of these
itself as launch blockers, so the page is a preview, not a page ready for ad traffic: the "Excellent 4.7" rating ·
"NABP-accredited pharmacy" (text badge only, never the official mark) · "tested 4 separate times" · Dr. [NAME],
[Credential], "Licensed in [XX] states" · placeholder testimonials (text cards, no faces) · $249/month (not on
Chime's price ladder), "Cancel anytime", the "$1,000+ per month" anchor · the statistics (5.9x, 8.0x, 283,000+
patients, 16.7% of over 29,000 users, "7 points behind") need full citations · the vial art reads GLP-1 and NAD+
(no Reset / Restore label art; the Restore copy adds glutathione) · question 1 has no result variant for the three
non South Asian answers · the footer disclaimer awaits counsel and the business address is missing · the LegitScript badge in the footer
(Luis, 2026-09-21; the same mark the other Chime landings carry) needs the certification to be held before launch.

Not carried from the reference: Wegovy, "FDA-approved", "Real medication. No compounds." (this program is
compounded), its study footnote, LegitScript seal, Trustpilot and App Store links, phone line, tracking, cookie banner.
