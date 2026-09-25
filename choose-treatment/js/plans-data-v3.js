/* Chime Health — Choose Your Treatment V3 = the GOLD product page of the price-lock funnel (client doc "price lock to
   Gold product and checkout.docx", 2026-09-25): chime-price-lock-offer → v3.html → checkout-v3/. A new version of V2
   with the doc's edits: names "Tirzepatide" / "Semaglutide", Tirzepatide's badge "Recommended for faster results",
   NO 12-month plan (so no highlighted card: heroPlan null, the three rows alone), and the doc's ladder:
     Tirzepatide  6M $279 / month, $1,674 due today - LOCK IN THIS PRICE · 3M $299, $897 - EVERY 4TH MONTH FREE, FOREVER ·
                  monthly "Prescribed for only:" ~~$399~~ $279, "$279 due today"
     Semaglutide  6M $179, $1,074 - LOCK IN THIS PRICE · 3M $249, $747 - EVERY 4TH MONTH FREE, FOREVER ·
                  monthly ~~$299~~ $179, "$179 due today"
   Monthly: first tick "Ships every 4 weeks", no footer note. "FREE" is bold green; LOCK IN THIS PRICE green (Luis).
   `checkout` = what checkout-v3/ shows for the plan (doc, checkout page): the crossed-out price (Semaglutide $299 / $996 /
   $1,794, Tirzepatide $399 / $1,196 / $2,394), the badge and the coupon code; discount = crossed-out − price.
   Copy the doc does not name is V2's. Loaded by v3.html and checkout-v3/index.html. */
(function (root) {
  var DATA = {
    heroPlan: null,
    rowPlans: ['sixMonth', 'threeMonth', 'monthly'],
    checkoutHref: 'checkout-v3/',
    productHref: '../v3.html',
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
        nameWraps: true,
        cardTitle: 'Tirzepatide',
        recommendedLabel: 'Recommended for faster results',
        tagline: 'Stronger appetite control. Preferred for faster weight loss.',
        highlights: ['Strongest appetite suppression', 'Fastest results'],
        badgeLabel: 'Fastest Results',
        badgeIcon: 'bolt',
        accent: 'gold',
        patientsToday: 17482,
        image: 'images/tirzepatide.webp',
        plans: {
          sixMonth: {
            months: 6, label: '6-MONTH PLAN', price: 279, totalPrice: 1674, dueTag: 'LOCK IN THIS PRICE', dueTagTone: 'green',
            checkout: { crossed: 2394, badge: 'PRICE LOCKED IN, FOREVER', code: 'LOCKED' },
            features: ['Highest long-term success', 'Preferred by patients who want to lose 10%+ of body weight', 'Price stays the same regardless of dosage']
          },
          threeMonth: {
            months: 3, label: '3-MONTH PLAN', price: 299, totalPrice: 897, dueTag: 'EVERY 4TH MONTH *FREE*, FOREVER',
            checkout: { crossed: 1196, badge: '4TH MONTH FREE, FOREVER', code: '4thMONTH' },
            features: ['Same medications, same care', 'Fewer shipments', 'Better consistency', 'Same price regardless of dosage']
          },
          monthly: {
            months: 1, label: 'MONTHLY PLAN', sublabel: 'Prescribed for only:', wasPrice: 399, price: 279, totalPrice: 279, plainDue: true,
            checkout: { crossed: 399, badge: '$120 off', code: '120off' },
            features: ['Ships every 4 weeks', 'Same price regardless of dose', 'Physician-guided dosing, adjusted as needed']
          }
        }
      },
      {
        id: 'injectable-semaglutide',
        key: 'sema',
        name: 'Semaglutide',
        nameWraps: true,
        cardTitle: 'Semaglutide',
        tagline: 'Effective appetite control with slower, consistent results.',
        highlights: ['Proven GLP-1 appetite control', 'Lower starting cost'],
        badgeLabel: 'Most Affordable',
        badgeIcon: 'clock',
        accent: 'green',
        patientsToday: 11251,
        image: 'images/semaglutide.webp',
        plans: {
          sixMonth: {
            months: 6, label: '6-MONTH PLAN', price: 179, totalPrice: 1074, dueTag: 'LOCK IN THIS PRICE', dueTagTone: 'green',
            checkout: { crossed: 1794, badge: 'PRICE LOCKED IN, FOREVER', code: 'LOCKED' },
            features: ['Highest long-term success', 'Preferred by patients focused on sustainable weight loss', 'No monthly billing during your plan, ever']
          },
          threeMonth: {
            months: 3, label: '3-MONTH PLAN', price: 249, totalPrice: 747, dueTag: 'EVERY 4TH MONTH *FREE*, FOREVER',
            checkout: { crossed: 996, badge: '4TH MONTH FREE, FOREVER', code: '4thMONTH' },
            features: ['Same medication, same care', 'Fewer shipments', 'Better consistency', 'Same price regardless of dosage']
          },
          monthly: {
            months: 1, label: 'MONTHLY PLAN', sublabel: 'Prescribed for only:', wasPrice: 299, price: 179, totalPrice: 179, plainDue: true,
            checkout: { crossed: 299, badge: '$120 off', code: '120off' },
            features: ['Ships every 4 weeks', 'Same price regardless of dose', 'Physician-guided dosing, adjusted as needed']
          }
        }
      }
    ]
  };
  root.CHIME_CHOOSE_TREATMENT = DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
})(typeof window !== 'undefined' ? window : globalThis);
