/* Chime Health — Choose Your Treatment: page data.
   Rip of intake.wellmedr.com/approval-confirmation (client, 2026-09-16, "as is"). Every number and line
   below is the reference's, copied from its page bundle (app/approval-confirmation/page-*.js) — they are
   STAND-INS until the client sends Chime's prices ("prices I'll look at after"). Edit this file only;
   the cards, the mobile selector, the urgency strip and the counters all render from it.
   NOTE: the reference's `savingsToday` figures are literals that do not reconcile with its own monthly
   price (e.g. Tirzepatide 12-month: 129 × 12 − 1,068 = 480, shown as 1,082). Kept verbatim on purpose. */
(function (root) {
  var DATA = {
    // Mobile-only strip: "ONLY 5 DISCOUNTS LEFT. YOURS IS RESERVED FOR: 06:57" (reference defaults)
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
          twelveMonth: {
            label: '12-MONTH PLAN', price: 89, totalPrice: 1068, savingsToday: 1082,
            features: ['Maximum savings', 'Best long-term weight loss results', 'Price stays the same regardless of dosage'],
            footerNote: 'Lowest monthly cost · Highest success rate', bestValue: true, popularBadge: true
          },
          sixMonth: {
            label: '6-MONTH PLAN', price: 123, totalPrice: 738, savingsToday: 306,
            features: ['Highest long-term success', 'Preferred by patients who want to lose 10%+ of body weight', 'Price stays the same regardless of dosage']
          },
          threeMonth: {
            label: '3-MONTH PLAN', price: 126, totalPrice: 378, savingsToday: 113,
            features: ['Same medications, same care', 'Fewer shipments', 'Better consistency', 'Same price regardless of dosage']
          },
          monthly: {
            label: 'MONTHLY PLAN', sublabel: 'Lowest industry pricing', price: 129,
            features: ['$140 monthly savings locked in for life — reflected automatically at checkout', 'Same price every month — no increases ever', 'Same price regardless of dose', 'Physician-guided dosing, adjusted as needed'],
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
          twelveMonth: {
            label: '12-MONTH PLAN', price: 49, totalPrice: 588, savingsToday: 1062,
            features: ['Maximum savings', 'Best long-term weight loss results', 'No monthly billing during your plan, ever'],
            footerNote: 'Lowest monthly cost · Highest success rate', bestValue: true, popularBadge: true
          },
          sixMonth: {
            label: '6-MONTH PLAN', price: 73, totalPrice: 438, savingsToday: 363,
            features: ['Highest long-term success', 'Preferred by patients focused on sustainable weight loss', 'No monthly billing during your plan, ever']
          },
          threeMonth: {
            label: '3-MONTH PLAN', price: 89, totalPrice: 267, savingsToday: 110,
            features: ['Same medication, same care', 'Fewer shipments', 'Better consistency', 'Same price regardless of dosage']
          },
          monthly: {
            label: 'MONTHLY PLAN', sublabel: 'Lowest industry pricing', price: 99,
            features: ['$70 monthly savings locked in for life — reflected automatically at checkout', 'Same price every month — no increases ever', 'Same price regardless of dose', 'Physician-guided dosing, adjusted as needed'],
            footerNote: 'No surprises. No step-ups. No dosage-based pricing.'
          }
        }
      }
    ]
  };
  root.CHIME_CHOOSE_TREATMENT = DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
})(typeof window !== 'undefined' ? window : globalThis);
