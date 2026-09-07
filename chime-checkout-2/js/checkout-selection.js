/* chime-checkout-2/checkout.html: fills the order summary from the plan chosen on product.html
   (?med=sema|tirz&term=1|3, falling back to sessionStorage "chime:checkout-selection").
   Without a selection the page shows Semaglutide, 3 months + 1 free. */
(function () {
  var CHIME_PLANS = {
    sema: { key: "sema", name: "Semaglutide", full: "Compounded Semaglutide (GLP-1)", image: "images/vial-semaglutide.webp",
            terms: { 1: { rate: 299, charge: 299, covers: 1, retail: 349, retailTotal: 349, effective: 299 },
                     3: { rate: 249, charge: 747, covers: 4, retail: 349, retailTotal: 1396, effective: 186.75 } } },
    tirz: { key: "tirz", name: "Tirzepatide", full: "Compounded Tirzepatide (GLP-1/GIP)", image: "images/vial-tirzepatide.webp",
            terms: { 1: { rate: 359, charge: 359, covers: 1, retail: 399, retailTotal: 399, effective: 359 },
                     3: { rate: 299, charge: 897, covers: 4, retail: 399, retailTotal: 1596, effective: 224.25 } } }
  };
  var CHIME_TERM_LABEL = { 1: "monthly", 3: "3 months + 1 free" };
  function chimeMoney(n) { return "$" + (Number.isInteger(n) ? n.toLocaleString("en-US") : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })); }
  
  var q = new URLSearchParams(location.search), med = q.get("med"), term = +q.get("term"), stored = null;
  try { stored = JSON.parse(sessionStorage.getItem("chime:checkout-selection") || "null"); } catch (err) {}
  if (!CHIME_PLANS[med] && stored && CHIME_PLANS[stored.med]) { med = stored.med; term = +stored.term; }
  if (!CHIME_PLANS[med]) med = "sema";
  if (!CHIME_PLANS[med].terms[term]) term = 3;
  var plan = CHIME_PLANS[med], t = plan.terms[term], perDay = t.charge / (t.covers * 30);
  function setText(sel, text) { document.querySelectorAll(sel).forEach(function (n) { n.textContent = text; }); }
  setText("[data-sel=med]", plan.name);
  setText("[data-sel=term-badge]", CHIME_TERM_LABEL[term]);
  setText("[data-sel=plan-line]", plan.name + " \u00b7 " + CHIME_TERM_LABEL[term] + (term === 3 ? " (" + t.covers + " months)" : ""));
  setText("[data-sel=charge]", chimeMoney(t.charge));
  setText("[data-sel=perday]", "$" + perDay.toFixed(2));
  document.querySelectorAll("[data-sel=img]").forEach(function (i) { i.src = plan.image; i.alt = plan.name; });
  var back = document.getElementById("chime-back");
  if (back) back.href = "product.html?med=" + med + "&term=" + term + "#products";
  window.CHIME_SELECTION = { med: med, term: term, charge: t.charge };
})();
