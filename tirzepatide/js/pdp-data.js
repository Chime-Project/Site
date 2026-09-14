// Chime Health — product page (PDP) template data: ONE ENTRY PER PRODUCT.
// tirzepatide/index.html is the first instance (rip of ronanrx.com/tirzepatide,
// client request 2026-09-14, plan in TIRZEPATIDE-PDP-RIP-PLAN.md). A second
// product page = a copy of the HTML shell with data-product="<key>" and a new
// entry here; pdp.js renders the buybox receipts, the dose panel, the ladder
// tables, the FAQ and the explore links from this object.
//
// STAND-IN CONTENT — every number and claim marked STAND-IN below is the
// reference's (RonanRx), carried so the mechanics can be reviewed, NOT
// Chime's. Chime's checkout prices Tirzepatide as a term ladder ($359/mo,
// $897 for 3 months, $1,794 for 6 — chime-checkout/js/checkout-selection.js),
// not per dose, and it includes the prescription fee. Replace the numbers in
// `doses`, `membership` and `coupon` with the client's when they arrive; the
// HTML never needs to change.
(function (root) {
  "use strict";

  var PRODUCTS = {
    tirzepatide: {
      key: "tirzepatide",
      name: "Tirzepatide",
      page: "./",
      made: "Prepared for one patient",
      desc: "Taken once weekly at a dose set by a licensed physician.",

      // Receipt labels
      medicineLabel: "Medicine, 30 days",
      membershipLabel: "Monthly physician care",
      membership: 39, // STAND-IN — RonanRx's $39 monthly physician fee, first month free with the code
      freeLabel: "First month free",

      // STAND-IN — RonanRx's launch coupon. `appliedByDefault` = the page
      // lands with the deal on, like the reference.
      coupon: {
        code: "FOUNDERS78",
        strip: "Founders Special Launch Deal Activated",
        pill: "Founders Special",
        appliedByDefault: true
      },

      // STAND-IN — RonanRx's per-dose medicine prices (list → with code).
      // Order = the select order; index 0 is the "starting at" dose.
      doses: [
        { label: "2.5 mg/week", list: 195, promo: 78 },
        { label: "5 mg/week", list: 225, promo: 88 },
        { label: "7.5 mg/week", list: 245, promo: 108 },
        { label: "10 mg/week", list: 295, promo: 128 },
        { label: "12.5 mg/week", list: 325, promo: 148 },
        { label: "15 mg/week", list: 345, promo: 168 }
      ],
      unknownDoseLabel: "Other / I’m not sure",
      unknownDoseNote:
        "Tell your physician your current medication and dose in the intake. Your price depends on the prescription they select.",

      // Copy templates (%{amount} / %{start} are filled by pdp.js)
      introMedicineLabel: "Medicine, 30 days — starting at",
      introTotalLabel: "Starting total",
      thenTemplate: "Then starting at %{amount}/month, depending on prescribed dose.",
      panelDueLabel: "Due today",
      panelMonthlyLabel: "Your monthly price",
      panelThenTemplate: "Starts at %{start}, renewing at %{amount}/month while on treatment.",
      stickyTemplate: "From %{amount}",
      couponError: "We couldn’t apply that code. Check the spelling and try again.",

      // CTA — href intentionally BLANK (Luis, 2026-09-14: "keep blank the
      // primary cta"). When a target is chosen, set it here; pdp.js appends
      // ?treatment=new|current&switch_dose=… like the reference does.
      cta: {
        get: "Get Tirzepatide RX",
        switch: "Switch your prescription to us",
        href: ""
      },
      door: {
        open: "<b>Already on tirzepatide?</b> See your price.",
        back: "<b>No, I’m new to tirzepatide.</b> Go back."
      },

      // Dose ladder section (both coupon states)
      ladder: {
        h2Applied: "Already on tirzepatide? See your discounted price.",
        h2Unapplied: "Already on tirzepatide? See what you could pay.",
        pApplied:
          "If you're coming from another program, find your current prescribed dose below to see what you could pay with your discount.",
        pUnapplied:
          "If you're coming from another program, find your current prescribed dose below to get an idea of what your monthly treatment could cost here.",
        thDose: "If you're currently prescribed",
        thMedicine: "Medicine",
        thWithDoctor: "With your doctor",
        thMonthly: "Monthly price",
        fineApplied:
          "Includes the discounted medicine price plus the $39 physician fee. Your physician determines your prescription and dosing based on your individual needs. These doses are shown as a reference for patients coming from other programs, not as a predetermined dosing schedule.",
        fineUnapplied:
          "Your physician determines your prescription and dosing based on your individual needs. These doses are shown as a reference for patients coming from other programs, not as a predetermined dosing schedule."
      },

      // Common questions — the reference's copy verbatim; the $39 / four-minute
      // / video-visit / same-day-cancel answers are RonanRx process claims
      // (STAND-IN until Chime confirms each).
      faq: [
        {
          q: "Is this the same as the branded injectables?",
          a: "No. This is a patient-specific compounded medication prepared by a licensed pharmacy. It is not Mounjaro or Zepbound, has not been studied, and is not FDA-approved."
        },
        {
          q: "What is the $39 for, exactly?",
          a: "Your doctor. Reading your history, setting and adjusting your dose, the first-injection walkthrough, and the follow-up. It is $39 whether you are at 2.5 mg or 15 mg."
        },
        {
          q: "Does the price go up later?",
          a: "The medicine price steps with your dose, and the table above shows the range, from the lowest strength to the highest, so you can see it before you start. What does not change is your doctor’s fee, and the launch pricing you join at is the pricing that stays; your rate at each strength does not go up after you start."
        },
        {
          q: "What if the doctor says no?",
          a: "Then you are not charged for medicine. Some conditions rule tirzepatide out entirely, and a few mean a doctor wants to talk to you first rather than decide from a form."
        },
        {
          q: "I am already on a GLP-1. Can I switch?",
          a: "Tell the physician what you are taking and the dose prescribed to you. The physician decides whether to prescribe and selects the strength. Pricing at each listed strength is shown above."
        },
        {
          q: "How long does it take to get started?",
          a: "The questions take about four minutes. Whether a doctor reviews in writing or on a 20-minute video visit is your choice at the end."
        },
        {
          q: "How do I stop?",
          a: "Tell us in your message thread or email us. We stop the next charge and confirm it in writing the same day. There is nothing to prepay and no term to serve out."
        }
      ],

      // "Explore" links — only pages that exist in this repo.
      explore: [
        { label: "Tirzepatide", href: "./" },
        { label: "NAD+", href: "../nad.html" },
        { label: "GLP-1 Plan", href: "../glp1-plan.html" },
        { label: "Longevity Plan", href: "../longevity-plan.html" },
        { label: "Weight Loss", href: "../weight-loss.html" },
        { label: "Wellness", href: "../wellness.html" },
        { label: "Labs", href: "../labs.html" }
      ]
    }
  };

  root.CHIME_PDP = PRODUCTS;
  if (typeof module !== "undefined" && module.exports) module.exports = PRODUCTS;
})(typeof window !== "undefined" ? window : this);
