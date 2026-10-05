# chime-offer-v9/ — GLP-1 offer lander (clone of trinitymeds.com/m1/offer-v9-tm)

Client, 2026-10-04: "Just lander" (a Facebook-ad link to trinitymeds.com/m1/offer-v9-tm). Clone rule: logo and branding
switched, everything else theirs. Plan: `TRINITY-OFFER-V9-LANDER-PLAN.md` (untracked). Asana 1219143290165506.

| File | What it is |
|---|---|
| `index.html` | Their server-rendered markup, classes untouched, with the branding swapped. **Generated**: do not hand-edit |
| `css/offer.css` | Every stylesheet their page loaded, in order, pruned with PurgeCSS. **Generated** |
| `js/offer.js` | What their Nuxt components did, in plain JS (see its head comment) |
| `js/offer-tests.js` | `node chime-offer-v9/js/offer-tests.js`: deadline maths, slider maths, branding, assets |
| `images/`, `fonts/` | Their media, local; Chime logo canvases; repainted step 1 / step 3 photos; four Chime stand-in stills |

- Rebuild: `python3 uploads/trinity-offer-v9-ref/build.py` (untracked, with the capture). It needs PurgeCSS: `npm i purgecss@6`
  somewhere and symlink its `node_modules` to `uploads/node_modules` for the run.
- **The offer never ends:** their bar date and countdown are one rolling deadline, the next 5-day mark after
  2026-09-15T03:00Z, shown in New York time ("October 4th at Midnight", then "October 9th", …). 03:00Z is 11 pm New York
  time (10 pm after DST ends); kept as theirs.
- **Changed:** logo, brand name, the box print and the monitor logo in two photos, LegitScript → the chimehealth.com LegitScript seal, linked to the checker, DMCA badge
  removed, support e-mail and phone, every CTA → `../chimeAssessment.html`, footer links → Chime's pages, the FAQ
  pharmacy answer and the legal block → Chime's text, member videos → four Chime stand-in stills.
- **Flagged, theirs:** $99 / $149, Was $299, "Save Big this FALL", 4.4 rating, 125,000+, the press strip, "up to $200
  off", "Rx within 1 day", "1–2 days" shipping, FSA, 24/7 support, the hero model and section photos, the clinician
  name on the step 1 monitor, and the testimonial disclaimer, which now says the people shown were compensated by
  Chime Health (they are stand-ins). `noindex`.
