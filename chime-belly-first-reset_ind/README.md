# chime-belly-first-reset_ind/

The Belly-First Reset (GLP-1 + tesamorelin): a cold-traffic quiz landing page, sister of
`chime-metabolic-reset_ind/`. Live: https://chime-project.github.io/Site/chime-belly-first-reset_ind/

**Request (client, 2026-09-21):** a clone of the Metabolic Reset landing with the copy of "Indian LP - Tesa.pdf",
in its own folder. The PDF stays untracked (it holds personas, scores, launch blockers and ad prompts; `uploads/`
deploys publicly). Same format, same question carousel, same clinician; everything the PDF does not change is
reused from the sister page, whose README and `METABOLIC-RESET-LP-PLAN.md` describe the shared build.

## What differs from the sister page

| Where | Belly-First Reset |
|---|---|
| Program | The Belly-First Reset™, locked descriptor "Built for South Asian metabolism"; Reset Vial (GLP-1) + **Target Vial (tesamorelin)** |
| Hero | New headline / sub / label; the clinician photo carries an abstract torso cross-section in line art (the "precision" signal the PDF asks for) |
| Result slide | "Doctors have a name for it: the thin-fat body." Stat tiles 35 in / 31 in and 15-18%; the **belt line** (two rows, the marker slides from the standard chart's 40 / 35 to 35 / 31, its label reads the inches under it); the torso cross-section illustration with its two keys; the chip lists belly-first first |
| Bridge | Mirror / waistband photo (fully clothed, no pinching), new copy |
| Mechanism | New copy; the two-vial shot is GLP-1 + Tesamorelin (callouts "the scale" / "the waistline"); the two-jobs diagram (whole-body glow vs abdominal core) in inline SVG; off-label footnote |
| Quality | 4th check adds "with ongoing monitoring built into your plan" |
| How it works | Step 3 "Reset deep" (weekly Reset Vial, daily Target Vial); third icon = tape measure + calendar |
| Benefits | 6 items (adds "Goes after the fat that matters", "Built for the thin-fat body", "Honest timelines"); kurta-at-a-gathering photo |
| Proof | Provider quote adds the belly-first line; 3 new testimonials (placeholders) |
| Offer | Includes list with waist-pattern screening and the Target Vial; **price $[TBD]**, a visible placeholder |
| FAQ | 8 new questions (tesamorelin, cosmetic?, GLP-1 vs tesamorelin, daily injection, timeline, stopping, privacy, vegetarian) |
| Closing | "The belly is not a flaw. It is a signal. Answer it."; next-steps and micro-testimonial copy |
| Sticky bar | "Target the deep fat" |
| Footer | Adds the tesamorelin off-label sentence and "ongoing monitoring may be required" |
| Storage | `sessionStorage` key `chime:belly-first-reset` (separate from the sister page) |

Files: `index.html`, `css/reset-lp.css`, `js/reset-quiz.js`, `js/reset-quiz-tests.js`
(`node chime-belly-first-reset_ind/js/reset-quiz-tests.js`, 106 checks), `images/`.

## Images

New for this page (Higgsfield, 2026-09-21; sources in the untracked `uploads/metabolic-reset/`, exported with
`python3 uploads/metabolic-reset/export.py tesa`):

| File | Job | Notes |
|---|---|---|
| `bridge-mirror-*` | `12d37748-308a-4a7f-87d3-432da020fec0` | Arjun (same face as the sister page) at a mirror adjusting his belt, clothed, waist-up |
| `benefits-kurta-*` | `d0001f58-53f6-49e3-9acf-5881f9eb6c2f` | Arjun in a kurta at a family gathering, holding a plate |
| `cross-section-*` | `b2625108-49bf-4837-a32f-caf14bb8cd92` | Abstract torso cross-section, outer layer blue, visceral layer amber; labels are HTML |
| `mechanism-vials-*` | surface `41a1f6d9-…` (sister page) | Real Chime GLP-1 art + the Tesamorelin vial cut out of `uploads/Tesamorelin-chime.png` (`uploads/vials/tesamorelin-cutout.png`; the old `tesamorelin.webp` cutout has holes in its label) |

A tape-measure still (`9bccc5c6-7354-435c-9fce-ae80cc3403ee`, the PDF's Concept 5) was made and not used: the
belt line is drawn in CSS so the numbers are real text. Hero, quality, provider, flat-lay, dinner, logos and the
LegitScript badge are the sister page's files.

## Flagged, built as written (the PDF's own launch blockers)

**Healthcare counsel is the critical path on this page:** the off-label tesamorelin language ("FDA-approved for a
specific condition and prescribed off-label here", the 15-18% figure over 26 weeks, "selectively reduced deep
visceral fat", the mechanism footnote and the footer sentence) is verbatim from the PDF, and the regulatory status
of compounded tesamorelin needs confirming · **price $[TBD]** everywhere, "Cancel anytime" awaits policy · the
dosing protocol (Target Vial daily, Reset Vial weekly) and the lab / glucose monitoring protocol are the PDF's
assumptions · the MASALA visceral-fat statement is left unquantified on purpose; the waist thresholds 35 / 31 vs
40 / 35 and "measurable at 12-16 weeks" need citations · carried from the sister page: "Excellent 4.7", NABP
wording (text badge only), "tested 4 times", Dr. [NAME] placeholders and the AI-generated provider photo,
placeholder testimonials, the LegitScript badge (certification must be held before traffic), [Business address]
· the vial art reads GLP-1 and Tesamorelin, the Reset / Target names live in the callouts · question 1 has no
result variant for the three non South Asian answers.

**Fix 2026-09-21 (client: "It's not advancing the questions"):** on iPhone / Safari a tap on an answer reached the radio as a click with `detail` 0, which the script read as a keyboard selection, so the carousel stood still. The script now tells a tap from a key by the pointer / touch event that precedes the click (arrow keys still only move the selection, Enter confirms). Reproduced and verified in WebKit with touch (Playwright): a tap now advances, a full run reaches the result.

**Speed, 2026-09-21 (client: "Are they speed optimized for mobile?"):** Quicksand is self-hosted (`fonts/quicksand-latin.woff2`, one 28 KB variable file, preloaded, `font-display: swap`), so the page makes no request to Google Fonts before it can paint. The rest was already in place: phone-size images (800 px) with 1600 px only for wider screens, the hero image preloaded and every other photo lazy, no framework, one 13 KB script, inline SVG icons.
