// Chime Health — Membership plan selector (membership.html) — behavior.
// The selection state itself is pure CSS (sibling selectors off the radio
// input, see membership.css); this file only owns the "Select plan" CTA and
// a data-selected hook for QA. Zero dependencies, ES5 on purpose to match the
// other static funnel pages (chimeUpsell0*.html, longevity-plan.js).
//
// CTA routing: cart.html cannot preselect a membership term yet, so the
// chosen plan is stored in sessionStorage under "chime:membership-plan"
// (same pattern longevity-plan.js uses with "chime:longevity-plan") and the
// page then navigates to the button's data-href. Read it back with
//   JSON.parse(sessionStorage.getItem("chime:membership-plan"))
//   → { term, label, monthly, dueToday, save, source }
(function () {
  "use strict";

  var STORAGE_KEY = "chime:membership-plan";

  var radios = Array.prototype.slice.call(
    document.querySelectorAll('input[name="plan"]'),
  );
  var group = document.getElementById("plans");
  var cta = document.getElementById("selectPlan");
  if (!radios.length || !cta) return;

  var selected = function () {
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i];
    }
    return null;
  };

  // Mirror the checked term onto the fieldset so a test or analytics hook can
  // read it without walking the inputs: <fieldset data-selected="3mo">.
  var sync = function () {
    var r = selected();
    if (group) group.setAttribute("data-selected", r ? r.value : "");
  };
  radios.forEach(function (radio) {
    radio.addEventListener("change", sync);
  });
  sync();

  cta.addEventListener("click", function () {
    var r = selected();
    if (!r) {
      // Not reachable with a default-checked option, but keep the button honest.
      radios[0].focus();
      return;
    }
    var payload = {
      term: r.value,
      label: r.getAttribute("data-label"),
      monthly: Number(r.getAttribute("data-monthly")),
      dueToday: Number(r.getAttribute("data-due")),
      save: Number(r.getAttribute("data-save")),
      source: "membership.html",
    };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      /* private mode / storage disabled — the navigation still happens */
    }
    var href = cta.getAttribute("data-href");
    if (href) window.location.href = href;
  });
})();
