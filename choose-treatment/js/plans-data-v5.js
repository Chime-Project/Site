/* Chime Health — Choose Your Treatment V5 = the GLP + NAD+ Burn & Boost product selection, VERSION 2 of the client
   doc "glp plus nad gold pages - 2 product selection versions.docx" (2026-09-28): chime-get-started-glp-nad → v5.html →
   checkout-v5/. A new version of V2 (v2.html) with the doc's edits: title "Choose Your Burn & Boost Treatment" / "Weight
   Loss and All Day Energy" (in v5.html), Tirzepatide = "Burn & Boost Plus" ("Compounded Tirzepatide and NAD+ - in one
   plan", "For those looking to lose 20+lbs"), Semaglutide = "Burn & Boost" ("Compounded Semaglutide and NAD+ - in one plan",
   "For those looking to lose up to 20lbs"), each shown as its vial + the NAD+ vial; NO 12-month plan (heroPlan null, the
   6 / 3 / monthly rows alone), monthly sublabel "Pause or Cancel anytime", and the ladder:
     Burn & Boost Plus  6M $249 / month, $1,494 due today - save $660 · 3M $299, $897 - save $180 · monthly $359
     Burn & Boost       6M $199 / month, $1,194 due today - save $600 · 3M $249, $747 - save $150 · monthly $299
   ("save" = (monthly − plan) × months, as the doc's figures are). Same names and prices as chime-burn-boost/.
   VERSION 2 = version 1 plus, on the 3-month plan only: "+ 4TH MONTH ON US" under "3-MONTH PLAN" (labelNote, the "due
   today" type) and "+ EVERY 4TH MONTH FREE, FOREVER" after the save amount, FREE bold green (afterSave).
   `checkoutOffer` + each plan's `checkout` = what checkout-v5/ shows (js/plan-fill.js, NAD+ offer mode): the name
   "Burn & Boost Plan" / "Burn & Boost Plus Plan" (checkoutName), the product + NAD+ vials, "+ FREE NAD+ ($299 value)" and
   a plan box ("Monthly" / "3 Months" / "6 Months", "3 Months + 1 free" on the 3-month plan, whose package line reads "3-Month Treatment Package + 1
   free month" and covers 4 months), coupon FREENAD, crossed-out = the monthly price × months
   (Luis: × 3 on the 3-month plan, the months paid for), "BONUS: NAD+ - both products, one price" ~~$299~~ FREE, no "You save".
   Copy the doc does not name is V2's. Loaded by v5.html and checkout-v5/index.html. */
(function (root) {
  var DATA = {
    heroPlan: null,
    rowPlans: ['sixMonth', 'threeMonth', 'monthly'],
    checkoutHref: 'checkout-v5/',
    productHref: '../v5.html',
    checkoutOffer: {
      badge: '+ FREE NAD+ ($299 value)',
      code: 'FREENAD',
      bonusLabel: 'BONUS: NAD+ - both products, one price',
      bonusValue: 299,
      removedLabel: 'NAD+',
      images: { tirz: 'images/tirzepatide-nad-amber.webp', sema: 'images/semaglutide-nad-amber.webp' }
    },
    urgency: { discountsLeft: 5, minutes: 6, seconds: 57 },
    press: ['Forbes', 'USA TODAY'],
    rating: { value: '4.7', full: 4, half: 1 },
    nextSteps: [
      { icon: '📋', lines: ['Clinician', 'Review'], note: 'Within 24 hours' },
      { icon: '📦', lines: ['Medication', 'Ships'], note: 'Free delivery' },
      { icon: '💬', lines: ['Ongoing', 'Support'], note: "We're here for you" }
    ],
    treatments: [
      {
        id: 'injectable-tirzepatide',
        key: 'tirz',
        name: 'Burn & Boost Plus',
        nameWraps: true,
        cardTitle: 'Burn & Boost Plus',
        checkoutName: 'Burn & Boost Plus Plan',
        recommendedLabel: 'For those looking to lose 20+lbs',
        tagline: 'Compounded Tirzepatide and NAD+ - in one plan',
        highlights: ['Strongest appetite suppression', 'Fastest results'],
        badgeLabel: 'Fastest Results',
        badgeIcon: 'bolt',
        accent: 'gold',
        patientsToday: 17482,
        image: 'images/tirzepatide-nad.webp',
        plans: {
          sixMonth: {
            months: 6, label: '6-MONTH PLAN', price: 249, totalPrice: 1494, savingsToday: 660,
            checkout: { crossed: 2154, termLabel: '6 Months' },
            features: ['Highest long-term success', 'Preferred by patients who want to lose 10%+ of body weight', 'Price stays the same regardless of dosage']
          },
          threeMonth: {
            months: 3, label: '3-MONTH PLAN', price: 299, totalPrice: 897, savingsToday: 180, labelNote: '+ 4TH MONTH ON US', afterSave: '+ EVERY 4TH MONTH *FREE*, FOREVER',
            checkout: { crossed: 1077, termLabel: '3 Months + 1 free', packageLabel: '3-Month Treatment Package + 1 free month', coversMonths: 4 },
            features: ['Same medications, same care', 'Fewer shipments', 'Better consistency', 'Same price regardless of dosage']
          },
          monthly: {
            months: 1, label: 'MONTHLY PLAN', sublabel: 'Pause or Cancel anytime', price: 359, totalPrice: 359,
            checkout: { crossed: 359, termLabel: 'Monthly' },
            features: ['Same price every month — no increases ever', 'Same price regardless of dose', 'Physician-guided dosing, adjusted as needed'],
            footerNote: 'No surprises. No step-ups. No dosage-based pricing.'
          }
        }
      },
      {
        id: 'injectable-semaglutide',
        key: 'sema',
        name: 'Burn & Boost',
        nameWraps: true,
        cardTitle: 'Burn & Boost',
        checkoutName: 'Burn & Boost Plan',
        recommendedLabel: 'For those looking to lose up to 20lbs',
        tagline: 'Compounded Semaglutide and NAD+ - in one plan',
        highlights: ['Proven GLP-1 appetite control', 'Lower starting cost'],
        badgeLabel: 'Most Affordable',
        badgeIcon: 'clock',
        accent: 'green',
        patientsToday: 11251,
        image: 'images/semaglutide-nad.webp',
        plans: {
          sixMonth: {
            months: 6, label: '6-MONTH PLAN', price: 199, totalPrice: 1194, savingsToday: 600,
            checkout: { crossed: 1794, termLabel: '6 Months' },
            features: ['Highest long-term success', 'Preferred by patients focused on sustainable weight loss', 'No monthly billing during your plan, ever']
          },
          threeMonth: {
            months: 3, label: '3-MONTH PLAN', price: 249, totalPrice: 747, savingsToday: 150, labelNote: '+ 4TH MONTH ON US', afterSave: '+ EVERY 4TH MONTH *FREE*, FOREVER',
            checkout: { crossed: 897, termLabel: '3 Months + 1 free', packageLabel: '3-Month Treatment Package + 1 free month', coversMonths: 4 },
            features: ['Same medication, same care', 'Fewer shipments', 'Better consistency', 'Same price regardless of dosage']
          },
          monthly: {
            months: 1, label: 'MONTHLY PLAN', sublabel: 'Pause or Cancel anytime', price: 299, totalPrice: 299,
            checkout: { crossed: 299, termLabel: 'Monthly' },
            features: ['Same price every month — no increases ever', 'Same price regardless of dose', 'Physician-guided dosing, adjusted as needed'],
            footerNote: 'No surprises. No step-ups. No dosage-based pricing.'
          }
        }
      }
    ]
  };
  root.CHIME_CHOOSE_TREATMENT = DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
})(typeof window !== 'undefined' ? window : globalThis);
