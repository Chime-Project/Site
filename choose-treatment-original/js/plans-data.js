/* Chime Health — Choose Your Treatment, ORIGINAL PRICES: page data (choose-treatment-original/).
   Client, 2026-10-04: "we have a version of this — intake.wellmedr.com/approval-confirmation — but can you rip this
   with the exact price points etc". Every price, saving and line below is the reference's own, re-checked against its
   live page bundle and its checkout on 2026-10-04 (unchanged since the 2026-09-16 rip): plan page = the
   choose-treatment/ V1 data; `checkout` = what their /checkout shows for each plan. These are NOT stand-ins.
   NOTE: their `savingsToday` figures are literals that do not reconcile with their own monthly price (Tirzepatide
   12-month: 129 x 12 - 1,068 = 480, shown as 1,082); their checkout's crossed-out price is the total + the coupon,
   while "Remove" shows a third figure (noCoupon). All kept verbatim on purpose.
   checkout (read by ../choose-treatment/checkout/js/plan-fill.js on checkout/):
     packages: badge, code (applied on arrival), crossed (= total + coupon), noCoupon (the "Remove" total), and
               packageLabel where theirs differs ("12-Month Treatment Package (Best Value)");
     monthly:  subscription: no coupon, "Standard Monthly Plan", the "By subscribing" disclaimer. */
(function (root) {
  var DATA = {
    // Mobile-only strip: "ONLY 5 DISCOUNTS LEFT. YOURS IS RESERVED FOR: 06:57" (reference defaults)
    upsell12: true,                    // the two blue "12 months for $X more" boxes (their J(): 12-month total - 6-month total)
    checkoutHref: 'checkout/',         // plan buttons -> checkout/?med=tirz|sema&term=1|3|6|12
    productHref: '../index.html',      // the checkout's "Choose" -> back here
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
        name: 'Tirzepatide',
        cardTitle: 'Tirzepatide - Most Powerful Option',
        tagline: 'Stronger appetite control. Preferred for faster weight loss.',
        highlights: ['Strongest appetite suppression', 'Fastest results'],
        badgeLabel: 'Fastest Results',
        badgeIcon: 'bolt',
        accent: 'gold',
        patientsToday: 17482,
        image: '../choose-treatment/images/tirzepatide.webp',
        plans: {
          twelveMonth: {
            months: 12, label: '12-MONTH PLAN', price: 89, totalPrice: 1068, savingsToday: 1082,
            features: ['Maximum savings', 'Best long-term weight loss results', 'Price stays the same regardless of dosage'],
            footerNote: 'Lowest monthly cost · Highest success rate', bestValue: true, popularBadge: true,
            checkout: { badge: 'Most Affordable', code: '500off', crossed: 1568, noCoupon: 1418, packageLabel: '12-Month Treatment Package (Best Value)' }
          },
          sixMonth: {
            months: 6, label: '6-MONTH PLAN', price: 123, totalPrice: 738, savingsToday: 306,
            features: ['Highest long-term success', 'Preferred by patients who want to lose 10%+ of body weight', 'Price stays the same regardless of dosage'],
            checkout: { badge: 'Most Affordable', code: '250off', crossed: 988, noCoupon: 838 }
          },
          threeMonth: {
            months: 3, label: '3-MONTH PLAN', price: 126, totalPrice: 378, savingsToday: 113,
            features: ['Same medications, same care', 'Fewer shipments', 'Better consistency', 'Same price regardless of dosage'],
            checkout: { badge: 'Most Affordable', code: '200off', crossed: 578, noCoupon: 428 }
          },
          monthly: {
            months: 1, label: 'MONTHLY PLAN', sublabel: 'Lowest industry pricing', price: 129,
            features: ['$140 monthly savings locked in for life — reflected automatically at checkout', 'Same price every month — no increases ever', 'Same price regardless of dose', 'Physician-guided dosing, adjusted as needed'],
            footerNote: 'No surprises. No step-ups. No dosage-based pricing.',
            checkout: { badge: 'Most Affordable', subscription: true }
          }
        }
      },
      {
        id: 'injectable-semaglutide',
        key: 'sema',
        name: 'Semaglutide',
        cardTitle: 'Semaglutide - Proven & Steady',
        tagline: 'Effective appetite control with slower, consistent results.',
        highlights: ['Proven GLP-1 appetite control', 'Lower starting cost'],
        badgeLabel: 'Most Affordable',
        badgeIcon: 'clock',
        accent: 'green',
        patientsToday: 11251,
        image: '../choose-treatment/images/semaglutide.webp',
        plans: {
          twelveMonth: {
            months: 12, label: '12-MONTH PLAN', price: 49, totalPrice: 588, savingsToday: 1062,
            features: ['Maximum savings', 'Best long-term weight loss results', 'No monthly billing during your plan, ever'],
            footerNote: 'Lowest monthly cost · Highest success rate', bestValue: true, popularBadge: true,
            checkout: { badge: 'Most Affordable', code: '500off', crossed: 1088, noCoupon: 938, packageLabel: '12-Month Treatment Package (Best Value)' }
          },
          sixMonth: {
            months: 6, label: '6-MONTH PLAN', price: 73, totalPrice: 438, savingsToday: 363,
            features: ['Highest long-term success', 'Preferred by patients focused on sustainable weight loss', 'No monthly billing during your plan, ever'],
            checkout: { badge: 'Most Affordable', code: '250off', crossed: 688, noCoupon: 538 }
          },
          threeMonth: {
            months: 3, label: '3-MONTH PLAN', price: 89, totalPrice: 267, savingsToday: 110,
            features: ['Same medication, same care', 'Fewer shipments', 'Better consistency', 'Same price regardless of dosage'],
            checkout: { badge: 'Most Affordable', code: '200off', crossed: 467, noCoupon: 317 }
          },
          monthly: {
            months: 1, label: 'MONTHLY PLAN', sublabel: 'Lowest industry pricing', price: 99,
            features: ['$70 monthly savings locked in for life — reflected automatically at checkout', 'Same price every month — no increases ever', 'Same price regardless of dose', 'Physician-guided dosing, adjusted as needed'],
            footerNote: 'No surprises. No step-ups. No dosage-based pricing.',
            checkout: { badge: 'Most Affordable', subscription: true }
          }
        }
      }
    ]
  };
  root.CHIME_CHOOSE_TREATMENT = DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
})(typeof window !== 'undefined' ? window : globalThis);
