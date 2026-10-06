/* Chime Health — choose-treatment-original/checkout/ -> the post-purchase upsell offers (client 2026-10-05, plan
   UPSELL-OFFERS-PLAN.md §4.2). The checkout form submits only once the browser's own validation passes (the shipping
   fields are `required`); the shared checkout.js still cancels the real submit (nothing is charged). Here: keep the
   first name for the offers' "Wait {name}!" (sessionStorage only, never in the URL) and open offer 1 with the plan
   that was bought (?med&term, the same params this checkout was opened with). */
(function () {
  'use strict';
  document.addEventListener('submit', function (e) {
    var form = e.target, q = new URLSearchParams(window.location.search);
    var first = form.querySelector('input[autocomplete="given-name"]');
    if (!first) return;   // only the checkout form itself
    var med = q.get('med') === 'tirz' ? 'tirz' : 'sema';
    var term = ({ 1: 1, 3: 3, 6: 6, 12: 12 })[q.get('term')] || 1;
    try {
      sessionStorage.setItem('chime:upsell', JSON.stringify({
        name: first ? first.value.trim().split(/\s+/)[0] : '', med: med, term: term, items: [], declined: []
      }));
    } catch (err) { /* private mode: the offers fall back to the no-name copy */ }
    window.location.href = '../../chime-upsell-offers/?med=' + med + '&term=' + term;
  });
}());
