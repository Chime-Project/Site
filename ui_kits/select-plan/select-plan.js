/* Chime Health — select-plan.html behaviour.
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

  /* Step 1 → Step 2 */
  var step2 = document.getElementById("select-price"),
      planFor = document.getElementById("planFor"),
      treats = document.querySelectorAll(".treat[data-treatment]");
  function select(med, scroll) {
    if (!NAMES[med]) return;
    Array.prototype.forEach.call(treats, function (b) {
      b.setAttribute("aria-checked", b.getAttribute("data-treatment") === med ? "true" : "false");
    });
    Array.prototype.forEach.call(document.querySelectorAll(".plan-options"), function (o) {
      o.hidden = o.id !== "plan-options-" + med;
    });
    if (planFor) planFor.textContent = NAMES[med];
    if (step2) {
      step2.hidden = false;
      if (scroll) step2.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
    try { sessionStorage.setItem("chime:select-plan-med", med); } catch (e) {}
  }
  Array.prototype.forEach.call(treats, function (b) {
    b.addEventListener("click", function () { select(b.getAttribute("data-treatment"), true); });
  });

  /* Plan hand-off: remember the choice the way checkout.html's fallback expects, then follow the link. */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a.plan-cta[data-med]");
    if (!a) return;
    try {
      sessionStorage.setItem("chime:checkout-selection", JSON.stringify({ med: a.getAttribute("data-med"), term: +a.getAttribute("data-term") }));
    } catch (err) {}
  });

  /* ?med=sema|tirz preselects (deep links, and coming back from the checkout). */
  var q = new URLSearchParams(location.search).get("med");
  if (NAMES[q]) select(q, false);
})();
