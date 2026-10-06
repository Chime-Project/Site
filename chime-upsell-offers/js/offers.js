/* Chime Health — post-purchase upsell offers: the data (ONE place for copy and prices).
   Client 2026-10-05: a screen recording of TrimRx's three one-click offers after checkout (NAD+, Sermorelin, Zofran),
   "same text format … but using the style of choose-treatment-original … all the crap they have: animation, countdown
   timer, decline price decrease". Copy is theirs, read off the recording frame by frame (plan: UPSELL-OFFERS-PLAN.md,
   untracked). Only the stray space before "!" / "?" after the name is not kept.
   PRICES: the client's, 2026-10-06 (UPSELL-OFFERS-PRICING-PLAN.md), which also renamed offer 2 Sermorelin ->
   Tesamorelin: Monthly / 3-Month / 6-Month only, `was` = the "Reg" price per month, `save` = their "You Save" (every one
   = (Reg - price) x months). Zofran has no Reg price: `full` / `was` / `save` are null and the card hides those rows.
   Each offer has two asks: `first` and `second` (after one decline: the lower-price banner). The client sent one price
   per plan, so `declineDrop` is false: one decline goes straight to the next offer and the `second` asks are not shown
   (their `plans` are null until the client sends second-ask prices; set declineDrop back to true then).
   {name} = the first name from the checkout; `noName` is the same line without it. */
(function (root, factory) {
  var data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.CHIME_UPSELL_OFFERS = data;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function plans(rows) {   // [label, months, was (Reg, per month), now (per month), save (total)]
    return rows ? rows.map(function (r) { return { label: r[0], months: r[1], was: r[2], now: r[3], save: r[4] }; }) : null;
  }

  return {
    timerSeconds: 600,          // "This offer expires in 9:59": 10 minutes, restarted on every new ask
    decliningMs: 1100,          // "Declining..." stays ~1.1 s before the next ask (16.7 -> 17.8 s in the recording)
    confettiDelayMs: 500,       // the burst lands 0.5-0.8 s after the new ask is on screen
    orderFallback: { med: 'sema', term: 1 },   // "Semaglutide - 1 month plan", as in the recording
    medNames: { sema: 'Semaglutide', tirz: 'Tirzepatide' },
    doneHref: 'done.html',
    declineDrop: false,         // true = the reference's two-step decline (needs `second.plans`); false = one decline -> next offer

    offers: [
      {
        key: 'nad',
        href: 'index.html',
        name: 'NAD+',
        image: 'images/nad.webp', imageW: 268, imageH: 520, imageAlt: 'Chime Health NAD+ vial',
        accent: 'nad',
        pitch: "The energy molecule your body's been starving for. NAD+ flips the switch on brain fog, fatigue, and aging — so you feel as good as you look.",
        benefits: ['All-day energy without the crash', 'Laser-sharp focus & mental clarity',
                   'Turns back the clock at the cellular level', 'Supercharges your metabolism'],
        full: 269,
        first: {
          tone: 'green',
          head: "Wait {name}! You were just selected as today's winner! 93% of patients add this to their plan!",
          noName: "Wait! You were just selected as today's winner! 93% of patients add this to their plan!",
          sub: 'One Click. No extra payment info needed. Lock in your exclusive discount with a single click.',
          decline: 'No thanks, the next customer can have my offer',
          plans: plans([['Monthly Plan', 1, 269, 149, 120], ['3-Month Plan', 3, 269, 119, 450],
                        ['6-Month Plan', 6, 269, 89, 1080]])
        },
        second: {
          tone: 'peach', icon: 'warn',
          head: 'Wait! {name} are you sure? We just increased your personal discount.',
          noName: 'Wait! Are you sure? We just increased your personal discount.',
          sub: "You were randomly chosen to receive this offer, don't miss out!",
          decline: 'No thanks, the next customer can have my offer',
          plans: null   // awaiting the client's second-ask prices (declineDrop)
        }
      },
      {
        key: 'tesamorelin',
        href: 'tesamorelin.html',
        name: 'Tesamorelin',
        image: 'images/tesamorelin.webp', imageW: 270, imageH: 520, imageAlt: 'Chime Health Tesamorelin vial',
        accent: 'tesamorelin',
        pitch: 'Supercharge your weight loss — this growth hormone peptide helps you burn fat faster, build lean muscle, and wake up feeling years younger.',
        benefits: ['Torch stubborn fat while preserving muscle', 'Deep, restorative sleep from night one',
                   'Tighter skin & younger-looking appearance', 'Faster recovery — bounce back like you used to'],
        full: 299,
        first: {
          tone: 'green',
          head: "Wait {name}! You were just selected as today's winner! 93% of patients add this to their plan!",
          noName: "Wait! You were just selected as today's winner! 93% of patients add this to their plan!",
          sub: 'One Click. No extra payment info needed. Lock in your exclusive discount with a single click.',
          decline: 'No thanks, the next customer can have my offer',
          plans: plans([['Monthly Plan', 1, 299, 169, 130], ['3-Month Plan', 3, 299, 139, 480],
                        ['6-Month Plan', 6, 299, 119, 1080]])
        },
        second: {
          tone: 'pink', icon: 'bell', tail: '🎉',
          head: 'Are you sure {name}? We just increased the offer discount for you',
          noName: 'Are you sure? We just increased the offer discount for you',
          sub: 'This offer is only given to a single customer each day, we hope this new price works for you.',
          decline: 'No thanks, the next customer can have my offer',
          plans: null   // awaiting the client's second-ask prices (declineDrop)
        }
      },
      {
        key: 'zofran',
        href: 'zofran.html',
        name: 'Zofran (Ondansetron)',
        image: 'images/zofran.webp', imageW: 560, imageH: 700, imageAlt: 'Chime Health ondansetron tablet',
        accent: 'zofran',
        pitch: 'Zero nausea, zero excuses. The same anti-nausea med hospitals trust — so nothing slows down your weight loss journey.',
        benefits: ['Kills nausea fast — works in minutes', 'Eat normally while your GLP-1 does its job',
                   'No more skipping doses because you feel sick', 'Doctor-trusted, clinically proven relief'],
        full: null,             // the client gave no Reg price for Zofran: $59, nothing crossed out
        first: {
          tone: 'yellow',
          head: "{name} - It's normal to experience nausea while taking GLP-1's",
          noName: "It's normal to experience nausea while taking GLP-1's",
          sub: '92% of patients choose to also add Zofran to their plan',
          decline: "No thanks, I won't experience nausea",
          plans: plans([['Monthly Plan', 1, null, 59, null]])
        },
        second: {
          tone: 'lavender',
          head: 'We just lowered the price just for you {name} - This is the cheapest you can buy Zofran on the market!',
          noName: 'We just lowered the price just for you - This is the cheapest you can buy Zofran on the market!',
          sub: 'Make your weightloss journey even easier and more enjoyable with prescription grade anti-nausea meds',
          decline: 'No thanks, the next customer can have my offer',
          plans: null   // awaiting the client's second-ask price (declineDrop)
        }
      }
    ]
  };
}));
