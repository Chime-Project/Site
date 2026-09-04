/* chime-checkout/product.html — medication -> plan-length stage -> checkout.html.
   Prices are the Chime plans landing ladder (chime-plans-landing/js/plans.js); every 4th month
   free on the 3- and 6-month plans. The selection travels as ?med=sema|tirz&term=1|3|6 and as
   sessionStorage "chime:checkout-selection". */
(function () {
  var CHIME_PLANS = {
    sema: { key: "sema", name: "Semaglutide", full: "Compounded Semaglutide (GLP-1)", retail: 279, image: "images/vial-semaglutide.webp",
            terms: { 1: { rate: 249, covers: 1, charge: 249, effective: 249 }, 3: { rate: 149, covers: 4, charge: 447, effective: 112 }, 6: { rate: 139, covers: 8, charge: 834, effective: 104 } } },
    tirz: { key: "tirz", name: "Tirzepatide", full: "Compounded Tirzepatide (GLP-1/GIP)", retail: 389, image: "images/vial-tirzepatide.webp",
            terms: { 1: { rate: 359, covers: 1, charge: 359, effective: 359 }, 3: { rate: 185, covers: 4, charge: 555, effective: 139 }, 6: { rate: 172, covers: 8, charge: 1032, effective: 129 } } }
  };
  var CHIME_TERM_LABEL = { 1: "monthly", 3: "3 months + 1 free", 6: "6 months" };
  function chimeMoney(n) { return "$" + n.toLocaleString("en-US"); }
  
  var stage = document.getElementById("plan-stage");
  if (!stage) return;
  var state = { med: null, term: 3 };
  function setText(root, sel, text) { root.querySelectorAll(sel).forEach(function (n) { n.textContent = text; }); }
  function fill() {
    var med = CHIME_PLANS[state.med];
    setText(stage, "[data-sv=med]", med.name);
    stage.querySelectorAll(".sv-card").forEach(function (card) {
      var term = +card.dataset.term, t = med.terms[term];
      var monthlySpan = med.terms[1].rate * t.covers;
      setText(card, "[data-sv=price]", String(t.rate));
      setText(card, "[data-sv=per]", term === 1 ? "Billed monthly · retail " + chimeMoney(med.retail) + "/mo"
        : chimeMoney(t.charge) + " every " + t.covers + " months · " + chimeMoney(t.effective) + "/mo effective · retail " + chimeMoney(med.retail) + "/mo");
      setText(card, "[data-sv=btn]", "Start " + (term === 1 ? "monthly" : term + " months") + " – " + med.name);
      setText(card, "[data-sv=save]", term === 1 ? "No free month: over " + med.terms[3].covers + " months you pay " + chimeMoney(med.terms[1].rate * med.terms[3].covers) + "."
        : "Save " + chimeMoney(monthlySpan - t.charge) + " vs monthly over " + t.covers + " months" + (term === 3 ? " · 3 free months a year" : ""));
      setText(card, "[data-sv=note]", term === 1 ? chimeMoney(t.charge) + " billed monthly. Pause or cancel anytime."
        : chimeMoney(t.charge) + " today, covers " + t.covers + " months. Next charge in " + t.covers + " months.");
    });
  }
  function setTerm(term) {
    state.term = term;
    stage.querySelectorAll(".sv-card").forEach(function (card) {
      var on = +card.dataset.term === term, r = card.querySelector(".sv-radio");
      r.setAttribute("aria-checked", on ? "true" : "false"); r.setAttribute("data-state", on ? "checked" : "unchecked");
      r.innerHTML = on ? "<span></span>" : "";
    });
    var label = CHIME_TERM_LABEL[term];
    document.getElementById("svContinue").textContent = "Continue with " + label;
    setText(stage, "[data-sv=foot-title]", term === 3 ? "Start with 3 months and keep the free one forever."
      : term === 6 ? "Six months, two of them free. Best value." : "Monthly, no commitment. Switch to 3 months any time.");
  }
  function select(med, opts) {
    if (!CHIME_PLANS[med]) return;
    state.med = med;
    document.querySelectorAll("[data-med]").forEach(function (c) { if (c.id) c.setAttribute("data-selected", c.dataset.med === med ? "true" : "false"); });
    stage.setAttribute("data-med", med);
    fill(); setTerm(state.term);
    stage.hidden = false;
    var img = document.getElementById("sticky-med-img"), name = document.getElementById("sticky-med-name");
    if (img) img.src = CHIME_PLANS[med].image;
    if (name) name.textContent = "Microdose " + CHIME_PLANS[med].name;
    if (!(opts && opts.quiet)) stage.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  stage.addEventListener("click", function (e) {
    var card = e.target.closest(".sv-card"); if (card) setTerm(+card.dataset.term);
  });
  document.getElementById("svContinue").addEventListener("click", function () {
    if (!state.med) return;
    var med = CHIME_PLANS[state.med], t = med.terms[state.term];
    var sel = { med: state.med, medName: med.name, treatment: med.full, term: state.term, termLabel: CHIME_TERM_LABEL[state.term],
                rate: t.rate, charge: t.charge, covers: t.covers, effective: t.effective };
    try { sessionStorage.setItem("chime:checkout-selection", JSON.stringify(sel)); } catch (err) {}
    location.href = "checkout.html?med=" + state.med + "&term=" + state.term;
  });
  document.querySelectorAll("[data-med][id]").forEach(function (card) {
    card.addEventListener("click", function (e) { if (!e.target.closest("[onclick]")) select(card.dataset.med); });
  });
  // Sticky "Buy Now": the chosen medication, else the page's recommendation (Tirzepatide).
  function sticky() { select(state.med || "tirz"); }
  window.ChimeFlow = { select: select, setTerm: setTerm, sticky: sticky, current: function () { return state.med; } };
  var q = new URLSearchParams(location.search), med = q.get("med"), term = +q.get("term");
  if (term === 1 || term === 3 || term === 6) state.term = term;
  if (med && CHIME_PLANS[med]) select(med, { quiet: true });
})();
