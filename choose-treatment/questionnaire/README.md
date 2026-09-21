# Chime Health — questionnaire (Choose Your Treatment funnel)

The client's 16-step GLP-1 questionnaire (client, 2026-09-21: "tie this questionnaire with the
checkout page"), rebranded to Chime and wired to the plan-selection step:

    questionnaire/step1.html → … → step16.html → ../v2.html (Choose Your Treatment V2)

**Generated — do not hand-edit the screens.** Everything in this folder is written by
`uploads/remedy-questionnaire/build-chime-questionnaire.py` from the client's source zip (both
untracked). Change the script, `chime-theme.css` or the badge next to it, then re-run:

    python3 uploads/remedy-questionnaire/build-chime-questionnaire.py

## Preview

    cd ~/Sites/chime && python3 -m http.server 8791

http://localhost:8791/choose-treatment/questionnaire/step1.html — check 1440 and 390.

## What is Chime's, what is the source's

| | |
|---|---|
| Chime | logo, favicon, Quicksand, the blue / slate palette (`css/chime-theme.css`, loaded after the source sheet and only overriding), the vial pair on step 5, the Care+ badge on step 9, the white logo on the step 4 chart |
| Source, kept | every question, option, validation rule and consent text; the header's Trustpilot "Excellent 4.7" widget (Luis: keep it); the screening engine (`js/quiz-dq.js`, ON: 8 disqualifiers + the age / BMI floor on step 7 → `disqualified.html`); the projection maths (`js/funnel-state.js`, 15 lbs / month cap) |
| Dropped | the source landing, loading page, old checkout copy, videos and its internal flow / comparison docs |

## Changed behaviour

- **Step 16 → `../v2.html`.** The source ended on an old checkout copy.
- **Step 6 now saves** `glp1_history` (`semaglutide` / `tirzepatide` / `none`), dose, last taken and
  continue-plan. The source stored nothing here.
- Storage key is `chime_funnel` (one `localStorage` record, read by the checkout).
- Step 9's Terms link opens the site's terms page. The disqualified exit goes to the homepage.

## Stand-ins carried from the source (flagged, not verified)

"58% better results than standard GLP-1 alone" + its JAMA citation (step 5), the Forbes "#1 weight
loss program" laurel (step 5), "94% success probability" (step 13), the clinician portraits, the
delivery promise by state (step 8), the Care+ warranty wording (step 9). Nothing is transmitted:
answers, contact details included, stay in the visitor's browser.

## Tests

    node choose-treatment/questionnaire/tests/calc-test.mjs     # 32 — BMI, plan maths, monthly cap
    node choose-treatment/questionnaire/tests/bands-test.mjs    # 32 — age / BMI bands
