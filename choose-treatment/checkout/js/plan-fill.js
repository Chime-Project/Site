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
   so the vial swap keeps the page's own path and changes only the file name.
   NAD+ OFFER MODE (checkout-v4/ and checkout-v5/, client doc "glp plus nad gold pages - 2 product selection versions",
   2026-09-28): data with a `checkoutOffer` (../js/plans-data-v4.js, -v5.js). Then:
     title = the treatment's checkoutName ("Burn & Boost Plan" / "Burn & Boost Plus Plan"), the vial = the product + NAD+
     pair, the badge = "+ FREE NAD+ ($299 value)" plus a second box with the plan ("Monthly" / "3 Months" / "6 Months" /
     "3 Months + 1 free"), coupon FREENAD, package line and Total = the plan's crossed-out price (monthly × months) then
     the package price, the crossed-out figure hidden when it equals the price (the monthly plan), "New Patient Discount
     -$200" → "BONUS: NAD+ - both products, one price" ~~$299~~ FREE, "You save" removed, the package label and months
     from the plan (V5's 3 + 1: "3-Month Treatment Package + 1 free month", covers 4 months, and its per day is the
     total ÷ 120 days, not monthly ÷ 30: client, 2026-09-28).
     Without the coupon ("Remove"): the package line is unchanged, an "NAD+ $299" row takes the bonus row's place, and
     the total is the package price + $299 (per day = that ÷ (months × 30)).
     The same mode runs checkout-v6/ and checkout-v7/ (client doc "glp plus tesa.docx", 2026-09-29: NAD+ swapped for
     Tesamorelin; ../js/plans-data-v6.js, -v7.js): every offer string comes from `checkoutOffer`, and its optional
     `pairAlt` names the vials in the thumbnail's alt ("GLP-1 and NAD+ vials" without it).
   Without a `checkoutOffer` nothing here runs and every string is as above.
   ORIGINAL PRICES (choose-treatment-original/checkout/, client 2026-10-04: "rip this with the exact price points etc"):
   ../js/plans-data.js, the reference's own figures. A plan `checkout` block with noCoupon gives "Remove" their
   no-coupon total (Semaglutide 3-month $317, not crossed-out $467) and its per day = noCoupon / (months x 30). One with
   subscription (the monthly plans) shows their monthly summary from the start: no coupon, "Standard Monthly Plan
   $X", no "One-time payment" line, total = the price, any code "Invalid or expired" (theirs takes none), and the
   "By subscribing" disclaimer. Without those fields every string is as above. */
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
    var offer = data.checkoutOffer || null;
    var covered = (rules && rules.coversMonths) || term;
    var s = {
      med: med, term: term,
      title: offer ? t.checkoutName : t.name + " " + term + "-Month Plan",
      alt: offer ? t.checkoutName + " - " + (offer.pairAlt || "GLP-1 and NAD+ vials") : t.name + " Injection - " + term + " Month Supply",
      image: offer ? offer.images[med] : IMAGE[med],
      badge: offer ? offer.badge : rules ? rules.badge : t.badgeLabel,
      code: offer ? offer.code : rules ? rules.code : "200off",
      discount: money(full - total),
      // a plan with free months (V5's 3 + 1: coversMonths 4) = its total over the days it covers (client 2026-09-28:
      // "the total price divided by 120"); every other plan = its monthly price ÷ 30
      perDay: rules && rules.coversMonths ? perDay(total, covered * 30) : perDay(p.price, 30),
      packageLabel: (rules && rules.packageLabel) || term + "-Month Treatment Package",
      subscription: !!(rules && rules.subscription),
      covers: "One-time payment · Covers " + covered + (covered === 1 ? " month" : " months") + " of medication",
      total: money(total),
      crossed: money(full),
      perDayNoCoupon: perDay(full, term * 30)
    };
    if (rules && rules.noCoupon) { s.noCoupon = money(rules.noCoupon); s.perDayNoCoupon = perDay(rules.noCoupon, term * 30); }
    if (s.subscription) {
      s.title = t.name + " Monthly Plan";
      s.packageLabel = "Standard Monthly Plan";
      s.noCoupon = money(p.price);
      s.perDayNoCoupon = s.perDay;
      s.code = ""; s.crossed = s.total; s.discount = money(0);   // no coupon on a monthly plan
    }
    if (offer) {
      s.offer = {
        termLabel: rules.termLabel,
        bonusLabel: offer.bonusLabel,
        bonusValue: money(offer.bonusValue),
        removedLabel: offer.removedLabel,
        showCrossed: full !== total,
        totalNoCoupon: money(total + offer.bonusValue)
      };
      s.perDayNoCoupon = perDay(total + offer.bonusValue, covered * 30);
    }
    return s;
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
    if (s.offer) return {
      "Semaglutide 3-Month Plan": s.title,
      "Most Affordable": s.badge,
      "200off applied": s.code + " applied",
      "New Patient Discount": s.offer.bonusLabel,
      "$2.97": s.perDay,
      "$2.97/day": s.perDay + "/day",
      "3-Month Treatment Package": s.packageLabel,
      "One-time payment · Covers 3 months of medication": s.covers,
      "$467": s.crossed,
      "$267": s.total,
      "$3.52": s.perDayNoCoupon,
      "$3.52/day": s.perDayNoCoupon + "/day"
    };
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
      "$317": s.noCoupon || s.crossed,
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
    if (s.offer) offerRows(rootNode, doc, s);
    if (s.subscription) subscriptionRows(rootNode);
  }

  // ORIGINAL PRICES, monthly plans: their summary has no "One-time payment · Covers N months" line, and their
  // disclaimer is the subscription one
  var SUBSCRIBE = { from: "By continuing, you authorize a one-time charge today for your selected plan. No recurring billing during your plan period. See our ",
                    to: "By subscribing, you authorize Chime Health to charge you monthly until you cancel. You may cancel at any time through your account settings as described in the " };
  function subscriptionRows(rootNode) {
    Array.prototype.forEach.call(rootNode.querySelectorAll("p"), function (x) {
      if (/^One-time payment · Covers /.test(x.textContent.trim())) x.parentNode.removeChild(x);
    });
    var doc = rootNode.ownerDocument || rootNode;
    var walker = doc.createTreeWalker(rootNode, 4, null), n;
    while ((n = walker.nextNode())) if (n.nodeValue === SUBSCRIBE.from) n.nodeValue = SUBSCRIBE.to;
  }
  // the live summaries start in the no-coupon state, and Redeem can only ever lead back to it
  var SUMMARY = ".bg-white.rounded-2xl.shadow-sm.border.border-gray-100.overflow-hidden";
  function startWithoutCoupon(doc) {
    var removed = doc.getElementById("co-summary-removed"), applied = doc.getElementById("co-summary-applied");
    if (!removed) return;
    if (applied) applied.innerHTML = removed.innerHTML;
    Array.prototype.forEach.call(doc.querySelectorAll(SUMMARY), function (card) { card.outerHTML = removed.innerHTML; });
  }

  // NAD+ offer mode: the parts that are more than a text swap
  function spansWith(rootNode, text) {
    return Array.prototype.filter.call(rootNode.querySelectorAll("span, p"), function (el) {
      return el.children.length === 0 && el.textContent.trim() === text;
    });
  }
  function el(doc, tag, cls, text) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function offerRows(rootNode, doc, s) {
    var o = s.offer;
    // the plan box, a second badge beside "+ FREE NAD+ ($299 value)"
    spansWith(rootNode, s.badge).forEach(function (b) {
      if (!/inline-block/.test(b.className)) return;
      var box = el(doc, "span", b.className, o.termLabel);
      box.setAttribute("data-co-term", "");
      // a space between the two inline-blocks: side by side when they fit, a clean wrap (no indent) on phones
      b.parentNode.insertBefore(box, b.nextSibling);
      b.parentNode.insertBefore(doc.createTextNode(" "), box);
    });
    // "-$200" → ~~$299~~ FREE
    spansWith(rootNode, "-$200").forEach(function (d) {
      var wrap = el(doc, "div"), was = el(doc, "span", "text-gray-400 line-through mr-2", o.bonusValue);
      was.setAttribute("data-co-bonus", "");   // never the plan's crossed-out price, even when the figures match
      wrap.appendChild(was);
      wrap.appendChild(el(doc, "span", "text-brand-green font-medium", "FREE"));
      d.parentNode.replaceChild(wrap, d);
    });
    spansWith(rootNode, "You save $200!").forEach(function (p) { p.parentNode.removeChild(p); });
    // no coupon: package line as with it, an "NAD+ $299" row, total + $299
    spansWith(rootNode, "$317").forEach(function (n) {
      if (/text-2xl/.test(n.className)) { n.textContent = o.totalNoCoupon; return; }
      n.textContent = s.total;
      if (o.showCrossed) n.parentNode.insertBefore(el(doc, "span", "text-gray-400 line-through mr-2", s.crossed), n);
      spansWith(rootNode, "Overnight Shipping").forEach(function (ship) {
        var row = el(doc, "div", "flex justify-between text-sm");
        row.appendChild(el(doc, "span", "text-gray-700", o.removedLabel));
        row.appendChild(el(doc, "span", "font-medium", o.bonusValue));
        ship.parentNode.parentNode.insertBefore(row, ship.parentNode);
      });
    });
    // the monthly plan: crossed-out = the price, so no crossed-out figure (Semaglutide's $299 = the NAD+ value: skip that one)
    if (!o.showCrossed) {
      Array.prototype.forEach.call(rootNode.querySelectorAll("span.line-through"), function (x) {
        if (x.textContent.trim() === s.crossed && !x.hasAttribute("data-co-bonus")) x.parentNode.removeChild(x);
      });
    }
  }

  var api = { summaryFor: summaryFor, pick: pick, replacements: replacements, TERM_PLAN: TERM_PLAN, SUBSCRIBE: SUBSCRIBE };
  root.ChimeCheckoutPlan = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;

  if (typeof document === "undefined" || !root.CHIME_CHOOSE_TREATMENT) return;
  var stored = null;
  try { stored = JSON.parse(sessionStorage.getItem("chime.chooseTreatment") || "null"); } catch (e) { /* private mode */ }
  var choice = pick(root.location.search, stored);
  var s = summaryFor(root.CHIME_CHOOSE_TREATMENT, choice.med, choice.term) ||
          summaryFor(root.CHIME_CHOOSE_TREATMENT, DEFAULT.med, DEFAULT.term);
  document.documentElement.setAttribute("data-co-plan", s.med + "-" + s.term);
  root.CHIME_COUPON_CODE = s.subscription ? "\u0000" : s.code.toUpperCase();   // what "Redeem" accepts (js/checkout.js); monthly: nothing
  fill(document.body, s);
  Array.prototype.forEach.call(document.querySelectorAll("template"), function (t) { fill(t.content, s); });
  if (s.subscription) startWithoutCoupon(document);
})(typeof window !== "undefined" ? window : globalThis);
