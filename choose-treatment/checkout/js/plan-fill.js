/* Chime Health checkout: the order summary follows the plan chosen on the plan page (client doc "Chime Microdose
   Gold Page", 2026-09-24). The markup keeps their Semaglutide 3-Month numbers; this swaps them, in the two live
   summaries (desktop + phone) and in both coupon <template>s, for the chosen plan from ../js/plans-data-v2.js:
     1. title "<name> <N>-Month Plan" + that drug's amber vial and badge
     2. "As low as $X/day" = the plan's monthly price ÷ 30, to the cent (Tirzepatide 6-month: $129 / 30 = $4.30)
     3. "<N>-Month Treatment Package" · "Covers N months of medication"
     4. package line: crossed-out = total due + $200, then the total due
     5. Total Due Today = #4        6. the per-day under it = #2
   Without the 200off coupon (their "Remove" state) the price is the crossed-out one, total + $200, and its per-day
   is that ÷ (months × 30), as theirs computes it.
   The choice comes from the URL (?med=tirz|sema&term=1|3|6|12, what the plan page's buttons open), else from the
   plan page's sessionStorage record, else Microdose Semaglutide 3-Month. Must run before js/checkout.js.
   V3 (checkout-v3/, client doc "price lock to Gold product and checkout", 2026-09-25) reads ../js/plans-data-v3.js,
   whose plans carry a `checkout` block: the crossed-out price is the client's (not total + $200), the badge and the
   coupon code follow the term (1 month "$120 off" / 120off, 3 months "4TH MONTH FREE, FOREVER" / 4thMONTH, 6 months
   "PRICE LOCKED IN, FOREVER" / LOCKED), and the discount, "You save" and the Remove state all come from
   crossed-out − price. Without that block the V2 rules above apply. checkout-v3/ loads the images from ../checkout/,
   so the vial swap keeps the page's own path and changes only the file name. */
(function (root) {
  "use strict";

  var TERM_PLAN = { 1: "monthly", 3: "threeMonth", 6: "sixMonth", 12: "twelveMonth" };
  var IMAGE = { tirz: "images/tirzepatide-amber.webp", sema: "images/semaglutide-amber.webp" };
  var CAPTURED_IMAGE = "semaglutide-amber.webp";
  var COUPON = 200;
  var DEFAULT = { med: "sema", term: 3 };

  function money(n) { return "$" + Number(n).toLocaleString("en-US"); }
  function perDay(amount, days) { return "$" + (Math.round(amount * 100 / days) / 100).toFixed(2); }

  // The chosen plan → every string the summary shows. null when the data has no such plan.
  function summaryFor(data, med, term) {
    var t = null;
    data.treatments.forEach(function (x) { if (x.key === med) t = x; });
    var key = TERM_PLAN[term];
    if (!t || !key || !t.plans[key]) return null;
    var p = t.plans[key], total = p.totalPrice || p.price * p.months, rules = p.checkout;
    var full = rules ? rules.crossed : total + COUPON;
    return {
      med: med, term: term,
      title: t.name + " " + term + "-Month Plan",
      alt: t.name + " Injection - " + term + " Month Supply",
      image: IMAGE[med],
      badge: rules ? rules.badge : t.badgeLabel,
      code: rules ? rules.code : "200off",
      discount: money(full - total),
      perDay: perDay(p.price, 30),
      packageLabel: term + "-Month Treatment Package",
      covers: "One-time payment · Covers " + term + (term === 1 ? " month" : " months") + " of medication",
      total: money(total),
      crossed: money(full),
      perDayNoCoupon: perDay(full, term * 30)
    };
  }

  function pick(search, stored) {
    var q = {};
    String(search || "").replace(/^\?/, "").split("&").forEach(function (kv) {
      var i = kv.indexOf("="); if (i > 0) q[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1));
    });
    if (q.med && q.term) return { med: q.med, term: +q.term };
    if (stored && stored.med && stored.term) return { med: stored.med, term: +stored.term };
    return DEFAULT;
  }

  // Their literals (the Semaglutide 3-Month capture) → the chosen plan's strings. Exact text-node matches only.
  function replacements(s) {
    return {
      "Semaglutide 3-Month Plan": s.title,
      "Most Affordable": s.badge,
      "200off applied": s.code + " applied",
      "-$200": "-" + s.discount,
      "You save $200!": "You save " + s.discount + "!",
      "$2.97": s.perDay,
      "$2.97/day": s.perDay + "/day",
      "3-Month Treatment Package": s.packageLabel,
      "One-time payment · Covers 3 months of medication": s.covers,
      "$467": s.crossed,
      "$267": s.total,
      "$317": s.crossed,
      "$3.52": s.perDayNoCoupon,
      "$3.52/day": s.perDayNoCoupon + "/day"
    };
  }

  function fill(rootNode, s) {
    var map = replacements(s);
    var doc = rootNode.ownerDocument || rootNode;
    var walker = doc.createTreeWalker(rootNode, 4 /* NodeFilter.SHOW_TEXT */, null);
    var node, hits = [];
    while ((node = walker.nextNode())) {
      var k = node.nodeValue.trim();
      if (Object.prototype.hasOwnProperty.call(map, k)) hits.push(node);
    }
    hits.forEach(function (n) { n.nodeValue = n.nodeValue.replace(n.nodeValue.trim(), map[n.nodeValue.trim()]); });
    Array.prototype.forEach.call(rootNode.querySelectorAll('img[src$="' + CAPTURED_IMAGE + '"]'), function (img) {
      var src = img.getAttribute("src");
      img.setAttribute("src", src.slice(0, src.length - CAPTURED_IMAGE.length) + s.image.split("/").pop());
      img.setAttribute("alt", s.alt);
    });
  }

  var api = { summaryFor: summaryFor, pick: pick, replacements: replacements, TERM_PLAN: TERM_PLAN };
  root.ChimeCheckoutPlan = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;

  if (typeof document === "undefined" || !root.CHIME_CHOOSE_TREATMENT) return;
  var stored = null;
  try { stored = JSON.parse(sessionStorage.getItem("chime.chooseTreatment") || "null"); } catch (e) { /* private mode */ }
  var choice = pick(root.location.search, stored);
  var s = summaryFor(root.CHIME_CHOOSE_TREATMENT, choice.med, choice.term) ||
          summaryFor(root.CHIME_CHOOSE_TREATMENT, DEFAULT.med, DEFAULT.term);
  document.documentElement.setAttribute("data-co-plan", s.med + "-" + s.term);
  root.CHIME_COUPON_CODE = s.code.toUpperCase();   // what "Redeem" accepts (js/checkout.js)
  fill(document.body, s);
  Array.prototype.forEach.call(document.querySelectorAll("template"), function (t) { fill(t.content, s); });
})(typeof window !== "undefined" ? window : globalThis);
