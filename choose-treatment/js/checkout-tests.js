/* node choose-treatment/js/checkout-tests.js — checks for the Choose Your Treatment port. */
var path = require('path');
var DATA = require(path.join(__dirname, 'plans-data.js'));
var C = require(path.join(__dirname, 'checkout.js'));
var n = 0, fails = 0;
function ok(cond, msg) { n++; if (!cond) { fails++; console.log('  ✗ ' + msg); } }
function count(str, needle) { return str.split(needle).length - 1; }

// money + copy lines
ok(C.fmtMoney(1068) === '$1,068', 'fmtMoney thousands');
ok(C.fmtMoney(89) === '$89', 'fmtMoney small');
var tz = DATA.treatments[0], sm = DATA.treatments[1];
ok(C.bigButtonLabel(tz.plans.twelveMonth) === 'GET 12 MONTHS + SAVE $1,082', 'big button label tirz');
ok(C.bigButtonLabel(sm.plans.twelveMonth) === 'GET 12 MONTHS + SAVE $1,062', 'big button label sema');
ok(C.billedLine(tz.plans.twelveMonth) === '$1,068 billed today for a full 12 month supply — no monthly billing', 'billed line');
ok(C.youSaveLine(sm.plans.twelveMonth) === 'You save $1,062 over month to month pricing.', 'you save line');
ok(C.savingsLine(tz.plans.sixMonth) === '$738 due today - save', 'savings line 6-mo');
ok(C.monthlyLine(sm.plans.monthly) === '$99 due today and forever, your price never goes up, no surprises or changes.', 'monthly line');

// reference literals (the page must show exactly these; they are not derived)
var expect = { tirz: { twelveMonth: [89, 1068, 1082], sixMonth: [123, 738, 306], threeMonth: [126, 378, 113], monthly: [129] },
               sema: { twelveMonth: [49, 588, 1062], sixMonth: [73, 438, 363], threeMonth: [89, 267, 110], monthly: [99] } };
DATA.treatments.forEach(function (t) {
  Object.keys(expect[t.key]).forEach(function (k) {
    var e = expect[t.key][k], p = t.plans[k];
    ok(p.price === e[0], t.key + ' ' + k + ' price');
    if (e[1] !== undefined) ok(p.totalPrice === e[1] && p.savingsToday === e[2], t.key + ' ' + k + ' total/savings');
  });
});

// countdown + discounts
ok(C.clock(417000) === '06:57', 'clock 6:57');
ok(C.clock(0) === '00:00' && C.clock(-5000) === '00:00', 'clock floors at 0');
ok(C.decrementDiscount(5) === 4 && C.decrementDiscount(1) === 1, 'discount decrement floors at 1');
ok((DATA.urgency.minutes * 60 + DATA.urgency.seconds) === 417 && DATA.urgency.discountsLeft === 5, 'urgency defaults = reference');
var d1 = C.firstDelay(function () { return 0; }), d2 = C.firstDelay(function () { return 1; });
ok(d1 === 10000 && d2 === 15000, 'first delay 10–15 s');
ok(C.nextDelay(function () { return 0; }) === 8000 && C.nextDelay(function () { return 1; }) === 15000, 'next delay 8–15 s');

// counters
var c0 = { a: 10, b: 20 };
ok(JSON.stringify(C.bumpCounters(c0, function () { return 0.5; })) === '{"a":11,"b":21}', 'p<.8 → both +1');
var seq = [0.9, 0.9, 0.99]; // none move → pick index floor(.99*2)=1 → b
ok(JSON.stringify(C.bumpCounters(c0, function () { return seq.shift(); })) === '{"a":10,"b":21}', 'none moved → one random bump');
ok(c0.a === 10 && c0.b === 20, 'bumpCounters does not mutate');

// renderers → the reference DOM shape
var card = C.renderTreatmentCard(tz, DATA);
ok(card.indexOf('id="treatment-injectable-tirzepatide"') > -1, 'card id');
ok(count(card, 'btn-lilac') === 4, '4 buttons per card');
ok(count(card, 'data-plan="') === 4 && card.indexOf('data-plan="twelveMonth"') > -1, 'plan keys on buttons');
ok(count(card, 'text-yellow-400') === 4 && count(card, 'text-yellow-200') === 1, '4.5 stars');
ok(card.indexOf('⭐ Best value') > -1 && card.indexOf('⭐ Most patients choose this plan') > -1, 'badges');
ok(count(card, 'flex-shrink-0 font-bold">✓') === 3 + 3 + 4 + 4, 'tick count 14');
ok(card.indexOf('href=') === -1, 'buttons are blank (no hrefs)');
ok(card.indexOf('Forbes') > -1 && card.indexOf('USA TODAY') > -1, 'press strip kept');
ok(count(card, 'WHAT HAPPENS NEXT?') === 1 && count(card, 'w-4 h-4 text-brand-green') === 2, 'next steps with 2 chevrons');
ok(card.indexOf('images/tirzepatide.webp') > -1, 'Chime vial');
var sc = C.renderSelectorCard(sm, false, 11251);
ok(sc.indexOf('aria-pressed="false"') > -1 && sc.indexOf('border-gray-200') > -1 && sc.indexOf('11,251') > -1, 'selector unselected');
var scs = C.renderSelectorCard(tz, true, 17482);
ok(scs.indexOf('aria-pressed="true"') > -1 && scs.indexOf('border-brand-gold shadow-sm') > -1 && scs.indexOf('border-brand-gold bg-brand-gold') > -1 && scs.indexOf('w-[0.9rem]') > -1, 'selector selected gold');
ok(C.renderSelectorCard(sm, true, 1).indexOf('border-brand-green bg-brand-green') > -1, 'selector selected green');
ok(sc.indexOf('<circle') > -1 && scs.indexOf('M13 2 3 14h7') > -1, 'clock vs bolt icon');
var u = C.renderUrgency(DATA.urgency, 417000);
ok(u.indexOf('>5<') > -1 && u.indexOf('discounts') > -1 && u.indexOf('06:57') > -1, 'urgency strip');
ok(/<\/span> discount left\./.test(C.renderUrgency({ discountsLeft: 1 }, 1000)), 'singular discount');
ok(u.indexOf('data-discounts') === -1 && count(u, '<span') === 2, 'urgency node shape = reference (two spans)');
ok(count(sc, '<span') === count(C.renderSelectorCard(sm, false, 11251), '<span') && sc.indexOf('11,251 chose this today</span>') > -1, 'counter span shape = reference');
ok(C.PLAN_TERM.twelveMonth === 12 && C.PLAN_TERM.monthly === 1, 'plan terms');

// ---- V2 (client price points, 2026-09-17): 1M / 3M / 6M, no 12-month, per-month = total ÷ months ----
var D2 = require(path.join(__dirname, 'plans-data-v2.js'));
var client = { tirz: { monthly: 359, threeMonth: 948, sixMonth: 1794 }, sema: { monthly: 299, threeMonth: 627, sixMonth: 1194 } };
ok(D2.heroPlan === 'sixMonth' && JSON.stringify(D2.rowPlans) === '["threeMonth","monthly"]', 'V2 hero = 6-month, rows = 3-month + monthly');
D2.treatments.forEach(function (t) {
  ok(!t.plans.twelveMonth, 'V2 ' + t.key + ' has no 12-month plan');
  ok(t.plans.monthly.price === client[t.key].monthly, 'V2 ' + t.key + ' monthly = client');
  ['threeMonth', 'sixMonth'].forEach(function (k) {
    var p = t.plans[k], total = client[t.key][k];
    ok(p.totalPrice === total, 'V2 ' + t.key + ' ' + k + ' total = client');
    ok(p.price * p.months === total, 'V2 ' + t.key + ' ' + k + ' per-month × months = total (' + p.price + ' × ' + p.months + ')');
    ok(p.savingsToday === p.months * t.plans.monthly.price - total, 'V2 ' + t.key + ' ' + k + ' savings = months × monthly − total');
  });
  var c2 = C.renderTreatmentCard(t, D2);
  ok(c2.indexOf('12') === -1 || !/12[- ]MONTH|12 month/.test(c2), 'V2 ' + t.key + ' card mentions no 12-month');
  ok(count(c2, 'btn-lilac') === 3 && c2.indexOf('data-plan="sixMonth"') > -1 && c2.indexOf('data-plan="twelveMonth"') === -1, 'V2 ' + t.key + ' 3 buttons, hero = sixMonth');
  ok(c2.indexOf('GET 6 MONTHS + SAVE ' + C.fmtMoney(t.plans.sixMonth.savingsToday)) > -1, 'V2 ' + t.key + ' big button label');
  ok(c2.indexOf('billed today for a full 6 month supply') > -1, 'V2 ' + t.key + ' billed line says 6 month');
  ok(c2.indexOf('monthly savings locked in for life') === -1, 'V2 ' + t.key + ' reference-only savings bullet dropped');
});
ok(C.bigButtonLabel(DATA.treatments[0].plans.twelveMonth) === 'GET 12 MONTHS + SAVE $1,082', 'V1 label unchanged after generalisation');

console.log((fails ? 'FAIL ' : 'OK ') + (n - fails) + '/' + n + ' checks');
process.exit(fails ? 1 : 0);
