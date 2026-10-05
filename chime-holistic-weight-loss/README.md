# chime-holistic-weight-loss/ — holistic GLP-1 weight-loss lander (clone of www.collective.org)

Client, 2026-10-05: "Landing Page Only" (an influencer-campaign link to www.collective.org; their route is
`/holistic-weight-loss`). Clone rule: logo and branding switched, everything else theirs. Plan:
`COLLECTIVE-LANDER-PLAN.md` (untracked). Asana 1219175104635014.

| File | What it is |
|---|---|
| `index.html` | Their hydrated Next.js markup, classes untouched, with the branding swapped. **Generated**: do not hand-edit |
| `css/lander.css` | Their one stylesheet (Tailwind build), pruned with PurgeCSS (94 KB to 44 KB). **Generated** |
| `js/lander.js` | What their React components did, in plain JS (see its head comment) |
| `js/lenis.min.js` | Lenis 1.3.25 (MIT), their smooth wheel scrolling, same options (lerp 0.1, touch native) |
| `js/lander-tests.js` | `node chime-holistic-weight-loss/js/lander-tests.js`: calculator maths, branding, assets, hooks |
| `images/`, `fonts/` | Their photos and vials (WebP), Chime logo canvases, the Chime mark in each of their mark boxes, their Hanken Grotesk / Geist Mono |

- Rebuild: `python3 uploads/collective-ref/brand_art.py && python3 uploads/collective-ref/build.py` (untracked, with the
  capture). It needs PurgeCSS and Lenis: `npm i purgecss@6 lenis@1.3.25` somewhere and point `PURGE_DIR` at it.
- **Calculators (their maths):** savings = tirzepatide ladder, $69/month + the $199 membership from month 2, against Ro /
  Found / MEDVi first month + ongoing (their "as of August 2026" prices); month 12 gives their "$5,339 a year". Treatment =
  tirzepatide 23 %, semaglutide 18 %, 100–400 lb.
- **Changed:** logos, the brand name ("collective buying power", the common noun, left as written; the savings chart
  label is "Chime", one word like theirs, because "Chime Health" wraps in that grid), their dotted mark redrawn as the
  Chime mark everywhere it appears and painted out of the phone How it Works photo, LegitScript → Chime's mark
  (unlinked), hello@chimehealth.com, every CTA → `../chimeAssessment.html`, Login and their HSA/FSA link → #, Privacy /
  Terms / Your Privacy Choices → Chime's pages, social links removed.
- **CTAs in Chime blue** (Luis, 2026-10-05): every pill button (`.chime-cta`) is Chime blue-800 `#324563`, hover
  blue-900 `#26354D`; the override sits at the end of `css/lander.css`. Their coral stays everywhere else.
- **Founder section kept as theirs (Luis, 2026-10-05: "Keep it the founder, we will change it later"):** Gunnar Lovelace,
  his photos and first-person story, and the hero pill "Brought to you by the founder of Thrive Market", renamed like the
  rest of the page, so it currently names a real person as Chime Health's CEO. Replace before the page takes real traffic.
- **Flagged, theirs:** $59 / $69, the $199 membership and 21-day trial, the competitor figures, "84 %" / "$5,339", the
  study figures and DOI links, "44 states", the give-one membership claim, twice-weekly dosing, Zofran, unlimited doctor
  messaging, dietitians, 2-day cold shipping, HSA/FSA, the refund, and every photo. `noindex`.
