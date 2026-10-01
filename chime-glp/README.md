# Chime Health — GLP-1 plans: product → checkout (`chime-glp/`)

The page the Chime assessment opens at the end of the weight-loss path
(`chimeAssessment.html` → "Choose My Treatment" → `chime-glp/product.html?med=sema|tirz`),
2026-10-01 (Asana 1219083464874177). Same Chime product + checkout pages as
`chime-checkout/` (look, chrome, Care+ badge, delivery van, vials — see that README),
with the **price points of the client's main GLP funnel**
(qualify.chimehealth.com/mainglp): straight 1 / 3 / 6-month plans, **no free month
anywhere** (no "+1" seal, no "every 4th month free" line, no "FREE FOR LIFE" button line).

**Generated — do not hand-edit.** Edit the script and re-run:

    cd ~/Sites/chime && python3 uploads/inv-checkout-flow/build-chime-checkout.py glp

(never run it with no argument against the repo: MODE `full` rebuilds
`chime-checkout/` and would wipe its neuropathy plan.)

## Price ladder + CRM CIDs

| Medication | Plan | Per month | Due today | CID |
|---|---|---|---|---|
| Semaglutide | Monthly | $299 | $299 | 1 |
| Semaglutide | 3 months | $209 | $627 | 2 |
| Semaglutide | 6 months | $199 | $1,194 | 3 |
| Tirzepatide | Monthly | $359 | $359 | 4 |
| Tirzepatide | 3 months | $316 | $948 | 7 |
| Tirzepatide | 6 months | $299 | $1,794 | 8 |

Each plan row carries `data-cid`; the CID also travels in sessionStorage
`chime:checkout-selection` (`cid`) and, on checkout, in `window.CHIME_SELECTION.cid` —
ready for the client's CRM integration (nothing submits yet).

## URLs

- `product.html` — nothing preselected.
- `product.html?med=sema|tirz` — that medication's card is marked and scrolled into view;
  no plan is preselected (the assessment's hand-off).
- `product.html?med=sema|tirz&term=1|3|6` — preselects that plan (the checkout's Back link).
- `checkout.html?med=sema|tirz&term=1|3|6` — fills the order summary; without a
  selection it shows Semaglutide, 3 months.

`?v=20260977`.
