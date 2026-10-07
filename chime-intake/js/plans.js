/* Plan ladder of the reference funnel, from their promo plans API (captured 2026-10-06): totals per term, unchanged.
   Shared by the recommendation and checkout pages (and the tests). Not confirmed for Chime — flagged in index.html. */
(function (root) {
  "use strict";
  var MEDS = {
    tirzepatide: { name: "Tirzepatide", compound: "Compounded w/ B6 (Pyridoxine)", totals: { 1: 249.97, 3: 599.91, 6: 1049.82, 12: 1439.64 } },
    semaglutide: { name: "Semaglutide", compound: "Compounded w/ B12", totals: { 1: 174.97, 3: 449.91, 6: 749.82, 12: 1079.64 } }
  };
  var TERMS = [1, 3, 6, 12];
  var DEFAULT_TERM = 6;   // their "Popular" row is preselected
  var SUPPLY = {
    1: "Paid monthly with a 3 month commitment. We send 3 months of medication up front. Zero interest. No credit checks.",
    3: "3 month supply delivered up front.",
    6: "3 month supply now, 3 more in 90 days.",
    12: "3 vials every 90 days for a year."
  };
  var PILL = { 6: "Popular", 12: "Recommended" };
  var r2 = function (x) { return Math.round(x * 100) / 100; };
  function plan(med, term) {
    var m = MEDS[med], monthly = r2(m.totals[term] / term), base = m.totals[1];
    return {
      med: med, term: term, medName: m.name, compound: m.compound,
      title: m.name + " " + (term === 1 ? "Monthly" : term + "-Month") + " Plan",
      monthly: monthly, total: m.totals[term], savings: r2((base - monthly) * term),
      pill: PILL[term] || "", huge: term === 12, supply: SUPPLY[term],
      renewal: "By clicking \"Complete Purchase\" you agree to enroll in a " + term + "-month program billed every " + term + " months, with automatic renewal and charges until canceled."
    };
  }
  function minMonthly(med) { return Math.min.apply(null, TERMS.map(function (t) { return plan(med, t).monthly; })); }
  function money(x) { return "$" + Number(x).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  root.CHIME_PLANS = { MEDS: MEDS, TERMS: TERMS, DEFAULT_TERM: DEFAULT_TERM, plan: plan, minMonthly: minMonthly, money: money,
    HANDOFF_KEY: "chime-intake:checkout" };   // sessionStorage: { med, term } from the recommendation page
})(typeof window !== "undefined" ? window : globalThis);
