/*
 * Plan selector: 1 / 3 / 6-month terms for two medications.
 * One price table drives every figure on the cards. The card buttons open the
 * questionnaire (questionnaire/step1.html) and carry the medication and term
 * as ?med=sema|tirz&term=1|3|6 so the choice made here is not lost.
 *
 * Rule: commit to 3 months or more and every 4th month is free, for as long
 * as the patient stays enrolled. "effective" = charge ÷ months covered.
 */
(function () {
  "use strict";

  var PLANS = {
    sema: {
      short: "Semaglutide",
      retail: 279,
      terms: {
        1: { rate: 249, covers: 1, charge: 249, effective: 249 },
        3: { rate: 149, covers: 4, charge: 447, effective: 112 },
        6: { rate: 139, covers: 8, charge: 834, effective: 104 },
      },
    },
    tirz: {
      short: "Tirzepatide",
      retail: 389,
      terms: {
        1: { rate: 359, covers: 1, charge: 359, effective: 359 },
        3: { rate: 185, covers: 4, charge: 555, effective: 139 },
        6: { rate: 172, covers: 8, charge: 1032, effective: 129 },
      },
    },
  };

  var TERM_COPY = {
    1: {
      offer: "Flexible monthly plan",
      offerStrong: "No free month",
      label: "Per month",
      note: "Pay as you go. The free month comes with the 3- and 6-month plans.",
      cta: "Start monthly – ",
      unit: "/mo",
    },
    3: {
      offer: "Commit to 3 Months",
      offerStrong: "& Get EVERY 4TH MONTH FREE",
      label: "Effective price with your free month",
      note: "Most popular. 4 months for the price of 3, every cycle, for as long as you stay enrolled.",
      cta: "Start 3 months – ",
      unit: "/mo",
    },
    6: {
      offer: "Commit to 6 Months",
      offerStrong: "& Get MONTHS 4 AND 8 FREE",
      label: "Effective price with 2 free months",
      note: "Best value. 8 months for the price of 6, every cycle, for as long as you stay enrolled.",
      cta: "Start 6 months – ",
      unit: "/mo",
    },
  };

  function money(n) { return "$" + n.toLocaleString("en-US"); }

  function setText(root, sel, text) {
    var node = root.querySelector(sel);
    if (node) node.textContent = text;
  }

  function renderCard(card, term) {
    var med = PLANS[card.getAttribute("data-plan")];
    if (!med) return;
    var t = med.terms[term];
    var copy = TERM_COPY[term];
    var monthlySameSpan = med.terms[1].rate * t.covers;

    var offer = card.querySelector(".plan__offer");
    if (offer) offer.classList.toggle("is-plain", term === 1);
    setText(card, "[data-offer]", copy.offer);
    setText(card, "[data-offer-strong]", copy.offerStrong);
    setText(card, "[data-price-label]", copy.label);
    setText(card, "[data-price]", money(t.effective));
    setText(
      card, "[data-note]",
      term === 1
        ? "retail " + money(med.retail) + "/mo"
        : "rate " + money(t.rate) + "/mo · retail " + money(med.retail) + "/mo"
    );
    setText(
      card, "[data-bill]",
      term === 1
        ? money(t.charge) + " billed monthly. Pause or cancel anytime."
        : money(t.charge) + " today, covers " + t.covers + " months. Next charge in " + t.covers + " months."
    );
    var save = card.querySelector("[data-save]");
    if (save) {
      if (term === 1) {
        var span = med.terms[3].covers;
        save.textContent = "No free month. Over " + span + " months you pay " + money(med.terms[1].rate * span) + ".";
        save.className = "is-lose";
      } else {
        save.textContent =
          "Save " + money(monthlySameSpan - t.charge) + " vs monthly over " + t.covers + " months" +
          (term === 3 ? " · 3 free months a year" : "");
        save.className = "is-save";
      }
    }
    setText(card, "[data-cta]", copy.cta + med.short);
    var cta = card.querySelector("[data-cta]");
    if (cta) {
      cta.setAttribute(
        "href",
        "questionnaire/step1.html?med=" + card.getAttribute("data-plan") + "&term=" + term
      );
    }
    card.setAttribute("data-term", String(term));
  }

  /* Hero offer card mirrors the selected term, priced on semaglutide */
  var HERO_BADGE = { 1: "Flexible", 3: "Most popular", 6: "Best value" };
  function renderHero(term) {
    var box = document.querySelector("[data-hero-offer]");
    if (!box) return;
    var med = PLANS.sema;
    var t = med.terms[term];
    var termLabel = term === 1 ? "Monthly plan" : term + "-month plan";
    setText(box, "[data-hero-badge]", HERO_BADGE[term]);
    setText(box, "[data-hero-term]", termLabel + " · " + med.short);
    setText(box, "[data-hero-price]", money(t.effective));
    setText(box, "[data-hero-rate]", term === 1 ? "retail " + money(med.retail) + "/mo" : "effective · rate " + money(t.rate) + "/mo");
    setText(
      box, "[data-hero-bill]",
      term === 1
        ? money(t.charge) + " billed monthly. Pause or cancel anytime."
        : money(t.charge) + " today, covers " + t.covers + " months. Next charge in " + t.covers + " months."
    );
    setText(
      box, "[data-hero-anchor]",
      term === 1
        ? "No free month on monthly. The 3-month plan works out to " + money(med.terms[3].effective) + "/mo."
        : "Monthly without commitment: " + money(med.terms[1].rate) + "/mo, no free month."
    );
  }

  function init() {
    var root = document.querySelector("[data-plans]");
    if (!root) return;
    var terms = Array.prototype.slice.call(root.querySelectorAll(".term"));
    var cards = Array.prototype.slice.call(root.querySelectorAll(".plan[data-plan]"));
    var note = root.querySelector("[data-term-note]");
    var current = 3;

    function apply(term) {
      current = term;
      terms.forEach(function (b) {
        var on = parseInt(b.getAttribute("data-term"), 10) === term;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-checked", on ? "true" : "false");
      });
      cards.forEach(function (c) { renderCard(c, term); });
      if (note) note.textContent = TERM_COPY[term].note;
      renderHero(term);
    }

    terms.forEach(function (b) {
      b.addEventListener("click", function () { apply(parseInt(b.getAttribute("data-term"), 10)); });
      b.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        var i = terms.indexOf(b);
        var next = terms[(i + (e.key === "ArrowRight" ? 1 : terms.length - 1)) % terms.length];
        next.focus();
        apply(parseInt(next.getAttribute("data-term"), 10));
      });
    });

    apply(current);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.AmeriLeanPlans = PLANS;
})();
