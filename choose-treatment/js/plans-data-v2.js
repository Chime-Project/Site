/* Chime Health — Choose Your Treatment V2: the CLIENT'S price points (2026-09-17).
   Source: the client's offer table — Semaglutide 1M $299 / 3M $627 / 6M $1,194; Tirzepatide 1M $359 /
   3M $948 / 6M $1,794. No 12-month plan. Per-month price = total ÷ months (all whole dollars); "save" =
   months × monthly price − total. Copy and everything else = V1 (js/plans-data.js) minus the 12-month
   plan; the monthly plan's "$140 / $70 monthly savings locked in for life" bullet is dropped (the number
   was the reference's and is false at these prices). Loaded by v2.html. */
(function (root) {
  var DATA = {
    heroPlan: 'sixMonth',
    rowPlans: ['threeMonth', 'monthly'],
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
        image: 'images/tirzepatide.webp',
        plans: {
          sixMonth: {
            months: 6, label: '6-MONTH PLAN', price: 299, totalPrice: 1794, savingsToday: 360,
            features: ['Maximum savings', 'Best long-term weight loss results', 'Price stays the same regardless of dosage'],
            footerNote: 'Lowest monthly cost · Highest success rate', bestValue: true, popularBadge: true
          },
          threeMonth: {
            months: 3, label: '3-MONTH PLAN', price: 316, totalPrice: 948, savingsToday: 129,
            features: ['Same medications, same care', 'Fewer shipments', 'Better consistency', 'Same price regardless of dosage']
          },
          monthly: {
            months: 1, label: 'MONTHLY PLAN', sublabel: 'Lowest industry pricing', price: 359,
            features: ['Same price every month — no increases ever', 'Same price regardless of dose', 'Physician-guided dosing, adjusted as needed'],
            footerNote: 'No surprises. No step-ups. No dosage-based pricing.'
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
        image: 'images/semaglutide.webp',
        plans: {
          sixMonth: {
            months: 6, label: '6-MONTH PLAN', price: 199, totalPrice: 1194, savingsToday: 600,
            features: ['Maximum savings', 'Best long-term weight loss results', 'No monthly billing during your plan, ever'],
            footerNote: 'Lowest monthly cost · Highest success rate', bestValue: true, popularBadge: true
          },
          threeMonth: {
            months: 3, label: '3-MONTH PLAN', price: 209, totalPrice: 627, savingsToday: 270,
            features: ['Same medication, same care', 'Fewer shipments', 'Better consistency', 'Same price regardless of dosage']
          },
          monthly: {
            months: 1, label: 'MONTHLY PLAN', sublabel: 'Lowest industry pricing', price: 299,
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
