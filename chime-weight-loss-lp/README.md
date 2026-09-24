# chime-weight-loss-lp

A weight-loss pre-quiz landing page. It is a clone of `startaspen.com/lp/weight-loss2` with the
Chime logo and branding (client, 2026-09-23). Every element, class, spacing value, line of copy
and motion timing is the reference's own, so the team can study how the funnel is built. The copy
team rewrites the words later.

| File | What it is |
|---|---|
| `index.html` | The reference's rendered markup (Tailwind classes kept), with inline brand colours moved to CSS variables |
| `css/lp.css` | The reference's compiled Tailwind v4 sheet pruned with PurgeCSS, then the **Chime brand layer** at the bottom |
| `js/lp.js` | The 4-step quiz, the "Great News!" reveal and the phone sticky button, ported from their React source. `INTAKE_URL` is the CTA target |
| `js/lp-tests.js` | `node chime-weight-loss-lp/js/lp-tests.js` |
| `images/`, `fonts/` | The hero creative, product thumbnail and rating badge (the reference's), the Chime logo, favicon and LegitScript mark, plus Plus Jakarta Sans and Lora |

**To change the brand colour:** edit the `--lp-brand*`, `--primary` and `--secondary` variables in
the brand layer. Aspen's original values are noted beside each one.

**Chime's vials (2026-09-23):** Aspen's Semaglutide / Tirzepatide vials in the hero image and the 3-tile
product thumbnail are replaced with Chime's vials (`uploads/vials`). The background behind them was
rebuilt from the surrounding gradient and the rest of both images is untouched. The script is
`uploads/weight-loss-lp-ref/vials.py` (untracked), next to their original PNGs.

**Still the reference's, and not Chime's:** the rest of the hero image (Aspen's ad, "$179 Includes
Medication"), the "Excellent 4.8" Trustpilot badge, and all of the copy.

The reference material (rendered HTML, their full stylesheet, the component source and
screenshots) is in `uploads/weight-loss-lp-ref/`. It is untracked and must never be committed.
