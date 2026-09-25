# chime-quiz/ — GLP-1 quiz (RemedyMeds quiz clone, Chime branding)

Clone of remedymeds.com/quiz (client, 2026-09-24), branding switched only. Plan: `REMEDY-QUIZ-CLONE-PLAN.md` (repo root, untracked).
Live: https://chime-project.github.io/Site/chime-quiz/

| File | What it is |
|---|---|
| `index.html` | Their page shell (main / container markup, body font classes), `noindex` |
| `js/quiz-config.js` | **Generated.** Their quiz config (25 steps, templates, rules, triggers, styles), brand switched |
| `js/quiz.js` | The engine: runs the config like their runtime (Eta templates, when-rules, triggers, validators, input protocol) |
| `js/quiz-components.js` | Their 3 React screens rebuilt: stats, "58% better results", the state map (d3-geo) |
| `js/vendor/` | Eta, tailwind-merge, d3-array, d3-geo, topojson-client (MIT / ISC), unchanged |
| `css/quiz.css` | **Generated.** Their compiled sheets, PurgeCSS-pruned, fonts self-hosted |
| `data/usa-topo.json` | Their US topology for the map |
| `js/quiz-tests.js` | `node chime-quiz/js/quiz-tests.js` (140 checks) |

Regenerate: `python3 uploads/remedy-quiz-ref/build.py` (untracked; captures, source config and the seal repaint `seal.py` are there).

- **Nothing is sent or stored.** The contact form's Continue opens `../choose-treatment/v2.html`; their 3 after-contact screens are not built (they only show after their page sends the details).
- **Changed:** logo (header, hero, chart bubble), Care+ warranty seal wordmark, "Remedy" / "Remedy Meds" → "Chime Health", Terms → Chime's, Sign In → `#`.
- **Kept, not confirmed for Chime:** every claim (250,000+ members, 58% / JAMA, ~300,000 members, Forbes #1, 94.6% / 91% / $0 warranty, "Likely", 94%), Trustpilot 4.7, the Ozempic / Zepbound pens in the product art.
