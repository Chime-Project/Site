/* Chime Health — select-plan.html + select-plan-v2.html behaviour.
   Ported from the AmeriLean step40.js: the reservation countdown, the
   "discounts left" counter, the per-treatment live counters, the Step 1 →
   Step 2 reveal, and the plan hand-off. The hand-off is the only thing that
   differs: each "Select Plan" is a real link into chime-checkout/checkout.html
   ?med&term, and we also store the choice under the key that checkout reads
   as its fallback ("chime:checkout-selection"). */
(function () {
  "use strict";
  var NAMES = { sema: "Semaglutide", tirz: "Tirzepatide" };
  var fmt = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Reservation countdown (m:ss), from data-seconds. */
  var cd = document.getElementById("countdown");
  if (cd) {
    var end = Date.now() + (parseInt(cd.getAttribute("data-seconds"), 10) || 599) * 1000;
    var tick = function () {
      var left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      cd.textContent = Math.floor(left / 60) + ":" + (left % 60 < 10 ? "0" : "") + (left % 60);
      if (left === 0) clearInterval(cd._t);
    };
    tick(); cd._t = setInterval(tick, 250);
  }

  /* "Only N discounts left": decrements by one every min-s..max-s seconds down to the floor. */
  var dc = document.getElementById("discountCount");
  if (dc) {
    var n = parseInt(dc.getAttribute("data-start"), 10) || 34,
        floor = parseInt(dc.getAttribute("data-floor"), 10) || 9,
        minS = parseInt(dc.getAttribute("data-min-s"), 10) || 3,
        maxS = parseInt(dc.getAttribute("data-max-s"), 10) || 9;
    var drop = function () {
      if (n <= floor) return;
      n -= 1; dc.textContent = n;
      setTimeout(drop, (minS + Math.random() * (maxS - minS)) * 1000);
    };
    setTimeout(drop, (minS + Math.random() * (maxS - minS)) * 1000);
  }

  /* "N patients chose this today": adds 0..max-add every interval, like the source. */
  Array.prototype.forEach.call(document.querySelectorAll(".live-count"), function (el) {
    var v = parseInt(el.getAttribute("data-start"), 10) || 0,
        add = parseInt(el.getAttribute("data-max-add"), 10) || 4,
        every = parseInt(el.getAttribute("data-interval"), 10) || 4500;
    el.textContent = fmt(v);
    setInterval(function () { v += Math.floor(Math.random() * (add + 1)); el.textContent = fmt(v); }, every);
  });

  /* Step 1 (treatment) → [Step 2 (second product), v2 only] → plans */
  var ADDONS = { tesa: "Tesamorelin", nad: "NAD+" };
  var stepPlans = document.getElementById("select-price"),
      stepAddon = document.getElementById("select-addon"),
      planFor = document.getElementById("planFor"),
      planAddon = document.getElementById("planAddon"),
      treats = document.querySelectorAll(".treat[data-treatment]"),
      addons = document.querySelectorAll(".treat[data-addon]"),
      chosenAddon = null;
  function reveal(el, scroll) {
    if (!el) return;
    el.hidden = false;
    if (scroll) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
  function select(med, scroll) {
    if (!NAMES[med]) return;
    Array.prototype.forEach.call(treats, function (b) {
      b.setAttribute("aria-checked", b.getAttribute("data-treatment") === med ? "true" : "false");
    });
    Array.prototype.forEach.call(document.querySelectorAll(".plan-options"), function (o) {
      o.hidden = o.id !== "plan-options-" + med;
    });
    if (planFor) planFor.textContent = NAMES[med];
    /* v2: the plans wait for the second product; v1: the plans come straight after the treatment */
    if (stepAddon) reveal(stepAddon, scroll); else reveal(stepPlans, scroll);
    if (stepAddon && chosenAddon) reveal(stepPlans, false);
    try { sessionStorage.setItem("chime:select-plan-med", med); } catch (e) {}
  }
  function selectAddon(addon, scroll) {
    if (!ADDONS[addon]) return;
    chosenAddon = addon;
    Array.prototype.forEach.call(addons, function (b) {
      b.setAttribute("aria-checked", b.getAttribute("data-addon") === addon ? "true" : "false");
    });
    if (planAddon) { planAddon.querySelector("b").textContent = ADDONS[addon]; planAddon.hidden = false; }
    Array.prototype.forEach.call(document.querySelectorAll("a.plan-cta[data-med]"), function (a) {
      var base = a.getAttribute("data-href") || a.getAttribute("href");
      a.setAttribute("data-href", base);
      a.setAttribute("href", base + "&addon=" + addon);
    });
    reveal(stepPlans, scroll);
    try { sessionStorage.setItem("chime:select-plan-addon", addon); } catch (e) {}
  }
  Array.prototype.forEach.call(treats, function (b) {
    b.addEventListener("click", function () { select(b.getAttribute("data-treatment"), true); });
  });
  Array.prototype.forEach.call(addons, function (b) {
    b.addEventListener("click", function () { selectAddon(b.getAttribute("data-addon"), true); });
  });

  /* Plan hand-off: remember the choice the way checkout.html's fallback expects, then follow the link. */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a.plan-cta[data-med]");
    if (!a) return;
    try {
      var sel = { med: a.getAttribute("data-med"), term: +a.getAttribute("data-term") };
      if (chosenAddon) sel.addon = chosenAddon;
      sessionStorage.setItem("chime:checkout-selection", JSON.stringify(sel));
    } catch (err) {}
  });

  /* ?med=sema|tirz preselects (deep links, and coming back from the checkout). */
  var q = new URLSearchParams(location.search), qm = q.get("med"), qa = q.get("addon");
  if (NAMES[qm]) select(qm, false);
  if (stepAddon && ADDONS[qa]) selectAddon(qa, false);
})();
