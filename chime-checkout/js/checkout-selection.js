/* chime-checkout/checkout.html — fills the order summary from the plan chosen on product.html
   (?med=sema|tirz&term=1|3|6, falling back to sessionStorage "chime:checkout-selection").
   Without a selection the page shows Semaglutide, 3 months + 1 free. */
(function () {
  var CHIME_PLANS = {
    sema: { key: "sema", name: "Semaglutide", full: "Compounded Semaglutide (GLP-1)", retail: 279, image: "images/vial-semaglutide.webp",
            terms: { 1: { rate: 249, covers: 1, charge: 249, effective: 249 }, 3: { rate: 149, covers: 4, charge: 447, effective: 112 }, 6: { rate: 139, covers: 8, charge: 834, effective: 104 } } },
    tirz: { key: "tirz", name: "Tirzepatide", full: "Compounded Tirzepatide (GLP-1/GIP)", retail: 389, image: "images/vial-tirzepatide.webp",
            terms: { 1: { rate: 359, covers: 1, charge: 359, effective: 359 }, 3: { rate: 185, covers: 4, charge: 555, effective: 139 }, 6: { rate: 172, covers: 8, charge: 1032, effective: 129 } } }
  };
  var CHIME_TERM_LABEL = { 1: "monthly", 3: "3 months + 1 free", 6: "6 months" };
  function chimeMoney(n) { return "$" + n.toLocaleString("en-US"); }
  
  var q = new URLSearchParams(location.search), med = q.get("med"), term = +q.get("term"), stored = null;
  try { stored = JSON.parse(sessionStorage.getItem("chime:checkout-selection") || "null"); } catch (err) {}
  if (!CHIME_PLANS[med] && stored && CHIME_PLANS[stored.med]) { med = stored.med; term = +stored.term; }
  if (!CHIME_PLANS[med]) med = "sema";
  if (!(term === 1 || term === 3 || term === 6)) term = 3;
  var plan = CHIME_PLANS[med], t = plan.terms[term], perDay = t.charge / (t.covers * 30);
  function setText(sel, text) { document.querySelectorAll(sel).forEach(function (n) { n.textContent = text; }); }
  setText("[data-sel=med]", plan.name);
  setText("[data-sel=term-badge]", CHIME_TERM_LABEL[term]);
  setText("[data-sel=plan-line]", plan.name + " · " + CHIME_TERM_LABEL[term] + (term === 1 ? "" : " (" + t.covers + " months)"));
  setText("[data-sel=charge]", chimeMoney(t.charge));
  setText("[data-sel=perday]", "$" + perDay.toFixed(2));
  document.querySelectorAll("[data-sel=img]").forEach(function (i) { i.src = plan.image; i.alt = plan.name; });
  var back = document.getElementById("chime-back");
  if (back) back.href = "product.html?med=" + med + "&term=" + term + "#plan-stage";
  window.CHIME_SELECTION = { med: med, term: term, charge: t.charge };
})();
