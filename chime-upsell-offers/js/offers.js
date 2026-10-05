/* Chime Health — post-purchase upsell offers: the data (ONE place for copy and prices).
   Client 2026-10-05: a screen recording of TrimRx's three one-click offers after checkout (NAD+, Sermorelin, Zofran),
   "same text format … but using the style of choose-treatment-original … all the crap they have: animation, countdown
   timer, decline price decrease". Copy and prices are theirs, read off the recording frame by frame (plan:
   UPSELL-OFFERS-PLAN.md, untracked). Their "saving" figures do not all reconcile with their prices (NAD+ monthly:
   $299 - $209 = $90, shown as $89); kept as shown. Only the stray space before "!" / "?" after the name is not kept.
   Each offer has two asks: `first` (30% off) and `second` (after one decline, 50% off). {name} = the first name from
   the checkout; `noName` is the same line without it. */
(function (root, factory) {
  var data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.CHIME_UPSELL_OFFERS = data;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function plans(rows) {   // [label, months, was (per month), now (per month), save]
    return rows.map(function (r) { return { label: r[0], months: r[1], was: r[2], now: r[3], save: r[4] }; });
  }

  return {
    timerSeconds: 600,          // "This offer expires in 9:59": 10 minutes, restarted on every new ask
    decliningMs: 1100,          // "Declining..." stays ~1.1 s before the next ask (16.7 -> 17.8 s in the recording)
    confettiDelayMs: 500,       // the burst lands 0.5-0.8 s after the new ask is on screen
    orderFallback: { med: 'sema', term: 1 },   // "Semaglutide - 1 month plan", as in the recording
    medNames: { sema: 'Semaglutide', tirz: 'Tirzepatide' },
    doneHref: 'done.html',

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
        full: 299,
        first: {
          pct: 30, tone: 'green',
          head: "Wait {name}! You were just selected as today's winner! 93% of patients add this to their plan!",
          noName: "Wait! You were just selected as today's winner! 93% of patients add this to their plan!",
          sub: 'One Click. No extra payment info needed. Lock in your exclusive discount with a single click.',
          decline: 'No thanks, the next customer can have my offer',
          plans: plans([['Monthly Plan', 1, 299, 209, 89], ['3-Month Plan', 3, 253, 177, 227],
                        ['6-Month Plan', 6, 241, 169, 434], ['1-Year Plan', 12, 233, 163, 839]])
        },
        second: {
          pct: 50, tone: 'peach', icon: 'warn',
          head: 'Wait! {name} are you sure? We just increased your personal discount.',
          noName: 'Wait! Are you sure? We just increased your personal discount.',
          sub: "You were randomly chosen to receive this offer, don't miss out!",
          decline: 'No thanks, the next customer can have my offer',
          plans: plans([['Monthly Plan', 1, 299, 149, 149], ['3-Month Plan', 3, 253, 126, 379],
                        ['6-Month Plan', 6, 241, 120, 724], ['1-Year Plan', 12, 233, 116, 1399]])
        }
      },
      {
        key: 'sermorelin',
        href: 'sermorelin.html',
        name: 'Sermorelin',
        image: 'images/sermorelin.webp', imageW: 280, imageH: 520, imageAlt: 'Chime Health Sermorelin vial',
        accent: 'sermorelin',
        pitch: 'Supercharge your weight loss — this growth hormone peptide helps you burn fat faster, build lean muscle, and wake up feeling years younger.',
        benefits: ['Torch stubborn fat while preserving muscle', 'Deep, restorative sleep from night one',
                   'Tighter skin & younger-looking appearance', 'Faster recovery — bounce back like you used to'],
        full: 259,
        first: {
          pct: 30, tone: 'green',
          head: "Wait {name}! You were just selected as today's winner! 93% of patients add this to their plan!",
          noName: "Wait! You were just selected as today's winner! 93% of patients add this to their plan!",
          sub: 'One Click. No extra payment info needed. Lock in your exclusive discount with a single click.',
          decline: 'No thanks, the next customer can have my offer',
          plans: plans([['Monthly Plan', 1, 259, 181, 77], ['3-Month Plan', 3, 216, 151, 194],
                        ['6-Month Plan', 6, 199, 139, 359], ['1-Year Plan', 12, 183, 128, 659]])
        },
        second: {
          pct: 50, tone: 'pink', icon: 'bell', tail: '🎉',
          head: 'Are you sure {name}? We just increased the offer discount for you',
          noName: 'Are you sure? We just increased the offer discount for you',
          sub: 'This offer is only given to a single customer each day, we hope this new price works for you.',
          decline: 'No thanks, the next customer can have my offer',
          plans: plans([['Monthly Plan', 1, 259, 129, 129], ['3-Month Plan', 3, 216, 108, 324],
                        ['6-Month Plan', 6, 199, 99, 599], ['1-Year Plan', 12, 183, 91, 1099]])
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
        full: 99,
        first: {
          pct: 30, tone: 'yellow',
          head: "{name} - It's normal to experience nausea while taking GLP-1's",
          noName: "It's normal to experience nausea while taking GLP-1's",
          sub: '92% of patients choose to also add Zofran to their plan',
          decline: "No thanks, I won't experience nausea",
          plans: plans([['Monthly Plan', 1, 99, 69, 29]])
        },
        second: {
          pct: 50, tone: 'lavender',
          head: 'We just lowered the price just for you {name} - This is the cheapest you can buy Zofran on the market!',
          noName: 'We just lowered the price just for you - This is the cheapest you can buy Zofran on the market!',
          sub: 'Make your weightloss journey even easier and more enjoyable with prescription grade anti-nausea meds',
          decline: 'No thanks, the next customer can have my offer',
          plans: plans([['Monthly Plan', 1, 99, 49, 49]])
        }
      }
    ]
  };
}));
