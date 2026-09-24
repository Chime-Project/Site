/* Chime Health checkout — the behaviour of the WellMedoc checkout it rips, ported to vanilla JS:
   · the 200off coupon: "Remove" swaps the order summary to their no-coupon state (total + $200) with a promo box;
     "Redeem" is disabled while empty, upper-cases what you type, re-applies 200OFF, and otherwise shows
     "Invalid or expired coupon code" (their exact behaviour and prices)
   · the review carousel: arrows wrap round, dots jump; "Read More" does nothing (it does nothing on theirs)
   · the two phone-only accordions (Terms, Guarantees & Details / Reviews & Testimonials)
   · "Choose" goes back to the plan page (../v2.html, the microdose plans)
   · the card form is a look-alike: it formats what you type like Stripe does and nothing else. No payment is
     taken, nothing is sent anywhere, and "Complete Intake & Checkout" does nothing (Luis's pick). */
(function () {
  "use strict";

  var SUMMARY = ".bg-white.rounded-2xl.shadow-sm.border.border-gray-100.overflow-hidden";
  var ERROR_HTML = '<p class="text-sm text-red-500 mt-2">Invalid or expired coupon code</p>';

  function tpl(id) {
    var t = document.getElementById(id);
    return t ? t.innerHTML : "";
  }

  function setSummary(state) {
    var html = tpl(state === "applied" ? "co-summary-applied" : "co-summary-removed");
    Array.prototype.forEach.call(document.querySelectorAll(SUMMARY), function (card) {
      card.outerHTML = html;
    });
  }

  function textOf(el) { return (el.textContent || "").replace(/\s+/g, " ").trim(); }

  // ---- reviews ----
  var REVIEWS = 4;
  function carouselOf(el) {
    var root = el.closest(".relative");
    return root && root.querySelector('[aria-label="Next testimonial"]') ? root : null;
  }
  function showReview(root, i) {
    i = (i + REVIEWS) % REVIEWS;
    root.setAttribute("data-co-review", i);
    var card = root.querySelector(".bg-success-50.rounded-2xl");
    if (card) card.outerHTML = tpl("co-review-" + i);
    Array.prototype.forEach.call(root.querySelectorAll('[aria-label^="Go to testimonial"]'), function (dot, k) {
      dot.className = "w-2 h-2 rounded-full transition-all " + (k === i ? "bg-secondary-500 w-4" : "bg-gray-300");
    });
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("button");
    if (!btn) return;
    var label = btn.getAttribute("aria-label") || "";
    var text = textOf(btn);

    if (label === "Next testimonial" || label === "Previous testimonial" || label.indexOf("Go to testimonial") === 0) {
      var root = carouselOf(btn);
      if (!root) return;
      var cur = +(root.getAttribute("data-co-review") || 0);
      if (label === "Next testimonial") showReview(root, cur + 1);
      else if (label === "Previous testimonial") showReview(root, cur - 1);
      else showReview(root, +label.replace(/\D/g, "") - 1);
      return;
    }
    if (text === "Remove" && btn.closest(SUMMARY)) { e.preventDefault(); setSummary("removed"); return; }
    if (text === "Redeem" && btn.closest(SUMMARY)) {
      e.preventDefault();
      var box = btn.closest(".mt-4");
      var input = box.querySelector("input");
      if (input.value.trim() === "200OFF") { setSummary("applied"); return; }
      if (!box.querySelector(".text-red-500")) box.insertAdjacentHTML("beforeend", ERROR_HTML);
      return;
    }
    if (text === "Terms, Guarantees & Details" || text === "Reviews & Testimonials") {
      var panel = btn.nextElementSibling;
      if (!panel) return;
      var open = panel.hasAttribute("hidden");
      if (open) panel.removeAttribute("hidden"); else panel.setAttribute("hidden", "");
      var chev = btn.querySelector("svg");
      if (chev) chev.classList.toggle("rotate-180", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    if (text === "Choose") { window.location.href = "../v2.html"; return; }
  });

  // Redeem: disabled while empty, upper-case as typed (as theirs)
  document.addEventListener("input", function (e) {
    var el = e.target;
    if (el.matches && el.matches('input[placeholder="Promo code (optional)"]')) {
      var pos = el.selectionStart;
      el.value = el.value.toUpperCase();
      try { el.setSelectionRange(pos, pos); } catch (err) {}
      var redeem = el.parentElement.querySelector("button");
      if (redeem) redeem.disabled = !el.value.trim();
      return;
    }
    // card look-alike: Stripe-style formatting only
    var kind = el.getAttribute && el.getAttribute("data-co");
    if (!kind) return;
    var d = el.value.replace(/\D/g, "");
    if (kind === "cc-number") el.value = d.slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
    else if (kind === "cc-exp") el.value = d.length > 2 ? d.slice(0, 2) + " / " + d.slice(2, 4) : d;
    else if (kind === "cc-cvc") el.value = d.slice(0, 4);
    else if (kind === "cc-zip") el.value = d.slice(0, 5);
  });

  // "Complete Intake & Checkout": no payment on this page
  document.addEventListener("submit", function (e) { e.preventDefault(); });

  // Stripe shows one card brand at a time when the form is narrow, cycling through them
  var brands = document.querySelectorAll(".co-pe-brand");
  var on = 0;
  if (brands.length) {
    setInterval(function () {
      brands[on].classList.remove("is-on");
      on = (on + 1) % brands.length;
      brands[on].classList.add("is-on");
    }, 2000);
  }
})();
