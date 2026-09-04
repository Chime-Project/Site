/* chime-checkout/product.html: each medication card carries its own plan-length rows; picking a row
   selects medication + length together and the card's Start button opens checkout.html?med&term.
   Prices are the Chime plans landing ladder (chime-plans-landing/js/plans.js); every 4th month free on
   the 3- and 6-month plans. The selection also lands in sessionStorage "chime:checkout-selection".
   Nothing is preselected (user request 2026-09-04). */
(function () {
  var CHIME_PLANS = {
    sema: { key: "sema", name: "Semaglutide", full: "Compounded Semaglutide (GLP-1)", retail: 279, image: "images/vial-semaglutide.webp",
            terms: { 1: { rate: 249, covers: 1, charge: 249, effective: 249 }, 3: { rate: 149, covers: 4, charge: 447, effective: 112 }, 6: { rate: 139, covers: 8, charge: 834, effective: 104 } } },
    tirz: { key: "tirz", name: "Tirzepatide", full: "Compounded Tirzepatide (GLP-1/GIP)", retail: 389, image: "images/vial-tirzepatide.webp",
            terms: { 1: { rate: 359, covers: 1, charge: 359, effective: 359 }, 3: { rate: 185, covers: 4, charge: 555, effective: 139 }, 6: { rate: 172, covers: 8, charge: 1032, effective: 129 } } }
  };
  var CHIME_TERM_LABEL = { 1: "monthly", 3: "3 months + 1 free", 6: "6 months" };
  function chimeMoney(n) { return "$" + n.toLocaleString("en-US"); }
  
  var state = { med: null, term: null };
  var phone = function () { return window.matchMedia("(max-width: 767px)").matches; };
  function render() {
    document.querySelectorAll("[data-mp]").forEach(function (block) {
      var med = block.dataset.mp, mine = med === state.med, plan = CHIME_PLANS[med];
      block.querySelectorAll(".mp-row").forEach(function (row) {
        var on = mine && +row.dataset.term === state.term, r = row.querySelector(".sv-radio");
        r.setAttribute("aria-checked", on ? "true" : "false"); r.setAttribute("data-state", on ? "checked" : "unchecked");
        r.innerHTML = on ? "<span></span>" : "";
      });
      var cta = block.querySelector("[data-mp-cta]"), note = block.querySelector("[data-mp-note]");
      var card = block.closest("[data-med]"); if (card) card.setAttribute("data-selected", mine ? "true" : "false");
      if (!mine) {
        cta.disabled = true; cta.textContent = "Choose a plan length";
        note.textContent = "Every 4th month is free \u2014 forever \u2014 on the 3- and 6-month plans. Pick a length to see what you pay today.";
        return;
      }
      var t = plan.terms[state.term];
      cta.disabled = false; cta.textContent = "Start " + (state.term === 1 ? "monthly" : state.term + " months") + " \u2013 " + plan.name;
      note.textContent = state.term === 1 ? chimeMoney(t.charge) + " billed monthly. No free month. Pause or cancel anytime."
        : chimeMoney(t.charge) + " today, covers " + t.covers + " months (" + (t.covers - state.term) + " free). Next charge in " + t.covers + " months.";
    });
    var img = document.getElementById("sticky-med-img"), name = document.getElementById("sticky-med-name");
    if (state.med && img) img.src = CHIME_PLANS[state.med].image;
    if (state.med && name) name.textContent = "Microdose " + CHIME_PLANS[state.med].name;
  }
  function select(med, term, opts) {
    if (!CHIME_PLANS[med] || !CHIME_PLANS[med].terms[term]) return;
    state.med = med; state.term = term; render();
    if (!(opts && opts.quiet) && phone()) {
      var cta = document.querySelector('[data-mp="' + med + '"] [data-mp-cta]');
      if (cta) cta.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
  function goCheckout() {
    if (!state.med || !state.term) return;
    var med = CHIME_PLANS[state.med], t = med.terms[state.term];
    var sel = { med: state.med, medName: med.name, treatment: med.full, term: state.term, termLabel: CHIME_TERM_LABEL[state.term],
                rate: t.rate, charge: t.charge, covers: t.covers, effective: t.effective };
    try { sessionStorage.setItem("chime:checkout-selection", JSON.stringify(sel)); } catch (err) {}
    location.href = "checkout.html?med=" + state.med + "&term=" + state.term;
  }
  document.querySelectorAll("[data-mp]").forEach(function (block) {
    block.addEventListener("click", function (e) {
      if (e.target.closest("[data-mp-cta]")) { if (state.med === block.dataset.mp) goCheckout(); return; }
      var row = e.target.closest(".mp-row"); if (row) select(block.dataset.mp, +row.dataset.term);
    });
  });
  function sticky() {
    var target = state.med ? document.querySelector('[data-mp="' + state.med + '"] [data-mp-cta]') : document.getElementById("products");
    if (target) target.scrollIntoView({ behavior: "smooth", block: state.med ? "center" : "start" });
  }
  window.ChimeFlow = { select: select, sticky: sticky, current: function () { return { med: state.med, term: state.term }; } };
  var q = new URLSearchParams(location.search), med = q.get("med"), term = +q.get("term");
  if (CHIME_PLANS[med] && (term === 1 || term === 3 || term === 6)) select(med, term, { quiet: true }); else render();
})();
