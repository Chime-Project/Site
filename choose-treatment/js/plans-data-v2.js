/* Chime Health — Choose Your Treatment V2 = the MICRODOSE plans (client, "Chime Microdose Gold Page.docx",
   2026-09-24). Source: the client's table — Microdose Semaglutide 1M $129 / 3M $119 / 6M $109 / 12M $99 a month
   ($129 / $357 / $654 / $1,188 due today); Microdose Tirzepatide 1M $149 / 3M $139 / 6M $129 / 12M $119 a month
   ($149 / $417 / $774 / $1,428 due today). A 12-month option is back, so the 12-month plan takes the highlighted
   "best value" card and 6 / 3 / 1 are the rows (V1's layout). "save" = months × the 1-month price − total
   ($30 / $120 / $360 on both). Names: "Microdose Tirzepatide" / "Microdose Semaglutide" (card titles drop the
   tagline half, as the doc shows). The plan buttons go to checkout/?med=<key>&term=<months>; checkout/ reads this
   same file for its order summary. Copy not named in the doc stays V1's (stand-ins, flagged in v2.html).
   Replaces the 2026-09-17 V2 ladder (Sema $299 / $627 / $1,194, Tirz $359 / $948 / $1,794, no 12-month).
   Loaded by v2.html and checkout/index.html. */
(function (root) {
  var DATA = {
    heroPlan: 'twelveMonth',
    rowPlans: ['sixMonth', 'threeMonth', 'monthly'],
    checkoutHref: 'checkout/',
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
        name: 'Microdose Tirzepatide',
        nameWraps: true,
        cardTitle: 'Microdose Tirzepatide',
        tagline: 'Stronger appetite control. Preferred for faster weight loss.',
        highlights: ['Strongest appetite suppression', 'Fastest results'],
        badgeLabel: 'Fastest Results',
        badgeIcon: 'bolt',
        accent: 'gold',
        patientsToday: 17482,
        image: 'images/tirzepatide.webp',
        plans: {
          twelveMonth: {
            months: 12, label: '12-MONTH PLAN', price: 119, totalPrice: 1428, savingsToday: 360,
            features: ['Maximum savings', 'Best long-term weight loss results', 'Price stays the same regardless of dosage'],
            footerNote: 'Lowest monthly cost · Highest success rate', bestValue: true, popularBadge: true
          },
          sixMonth: {
            months: 6, label: '6-MONTH PLAN', price: 129, totalPrice: 774, savingsToday: 120,
            features: ['Highest long-term success', 'Preferred by patients who want to lose 10%+ of body weight', 'Price stays the same regardless of dosage']
          },
          threeMonth: {
            months: 3, label: '3-MONTH PLAN', price: 139, totalPrice: 417, savingsToday: 30,
            features: ['Same medications, same care', 'Fewer shipments', 'Better consistency', 'Same price regardless of dosage']
          },
          monthly: {
            months: 1, label: 'MONTHLY PLAN', sublabel: 'Lowest industry pricing', price: 149, totalPrice: 149,
            features: ['Same price every month — no increases ever', 'Same price regardless of dose', 'Physician-guided dosing, adjusted as needed'],
            footerNote: 'No surprises. No step-ups. No dosage-based pricing.'
          }
        }
      },
      {
        id: 'injectable-semaglutide',
        key: 'sema',
        name: 'Microdose Semaglutide',
        nameWraps: true,
        cardTitle: 'Microdose Semaglutide',
        tagline: 'Effective appetite control with slower, consistent results.',
        highlights: ['Proven GLP-1 appetite control', 'Lower starting cost'],
        badgeLabel: 'Most Affordable',
        badgeIcon: 'clock',
        accent: 'green',
        patientsToday: 11251,
        image: 'images/semaglutide.webp',
        plans: {
          twelveMonth: {
            months: 12, label: '12-MONTH PLAN', price: 99, totalPrice: 1188, savingsToday: 360,
            features: ['Maximum savings', 'Best long-term weight loss results', 'No monthly billing during your plan, ever'],
            footerNote: 'Lowest monthly cost · Highest success rate', bestValue: true, popularBadge: true
          },
          sixMonth: {
            months: 6, label: '6-MONTH PLAN', price: 109, totalPrice: 654, savingsToday: 120,
            features: ['Highest long-term success', 'Preferred by patients focused on sustainable weight loss', 'No monthly billing during your plan, ever']
          },
          threeMonth: {
            months: 3, label: '3-MONTH PLAN', price: 119, totalPrice: 357, savingsToday: 30,
            features: ['Same medication, same care', 'Fewer shipments', 'Better consistency', 'Same price regardless of dosage']
          },
          monthly: {
            months: 1, label: 'MONTHLY PLAN', sublabel: 'Lowest industry pricing', price: 129, totalPrice: 129,
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
