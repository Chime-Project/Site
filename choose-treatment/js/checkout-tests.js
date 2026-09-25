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

// ---- V2 = the MICRODOSE plans (client doc "Chime Microdose Gold Page", 2026-09-24): 1M / 3M / 6M / 12M ----
var D2 = require(path.join(__dirname, 'plans-data-v2.js'));
// the client's table: [per month, due today]
var client = { tirz: { monthly: [149, 149], threeMonth: [139, 417], sixMonth: [129, 774], twelveMonth: [119, 1428] },
               sema: { monthly: [129, 129], threeMonth: [119, 357], sixMonth: [109, 654], twelveMonth: [99, 1188] } };
var names = { tirz: 'Microdose Tirzepatide', sema: 'Microdose Semaglutide' };
ok(D2.heroPlan === 'twelveMonth' && JSON.stringify(D2.rowPlans) === '["sixMonth","threeMonth","monthly"]', 'V2 hero = 12-month, rows = 6 / 3 / monthly');
ok(D2.checkoutHref === 'checkout/', 'V2 plan buttons open the checkout');
ok(C.checkoutUrl('checkout/', 'tirz', 'sixMonth') === 'checkout/?med=tirz&term=6', 'V2 checkout URL carries med + term');
ok(C.checkoutUrl('checkout/', 'sema', 'monthly') === 'checkout/?med=sema&term=1', 'V2 checkout URL, monthly = term 1');
D2.treatments.forEach(function (t) {
  ok(t.name === names[t.key] && t.cardTitle === names[t.key], 'V2 ' + t.key + ' named ' + names[t.key]);
  Object.keys(client[t.key]).forEach(function (k) {
    var p = t.plans[k], e = client[t.key][k];
    ok(p.price === e[0], 'V2 ' + t.key + ' ' + k + ' per month = client ($' + e[0] + ')');
    ok(p.totalPrice === e[1], 'V2 ' + t.key + ' ' + k + ' due today = client ($' + e[1] + ')');
    ok(p.price * p.months === e[1], 'V2 ' + t.key + ' ' + k + ' per-month × months = due today');
    if (k !== 'monthly') ok(p.savingsToday === p.months * t.plans.monthly.price - e[1], 'V2 ' + t.key + ' ' + k + ' savings = months × monthly − total');
  });
  var c2 = C.renderTreatmentCard(t, D2);
  ok(count(c2, 'btn-lilac') === 4 && c2.indexOf('data-plan="twelveMonth"') > -1, 'V2 ' + t.key + ' 4 buttons, hero = twelveMonth');
  ok(c2.indexOf('GET 12 MONTHS + SAVE $360') > -1, 'V2 ' + t.key + ' big button label');
  ok(c2.indexOf(C.fmtMoney(t.plans.twelveMonth.totalPrice) + ' billed today for a full 12 month supply') > -1, 'V2 ' + t.key + ' billed line');
  ok(c2.indexOf('>' + names[t.key] + '</h3>') > -1, 'V2 ' + t.key + ' card title');
  ok(c2.indexOf('monthly savings locked in for life') === -1, 'V2 ' + t.key + ' reference-only savings bullet dropped');
  var s2 = C.renderSelectorCard(t, false, 1);
  ok(s2.indexOf('truncate') === -1 && s2.indexOf('>' + names[t.key] + '</h3>') > -1, 'V2 ' + t.key + ' selector name wraps, not truncated');
});
ok(C.renderSelectorCard(DATA.treatments[0], false, 1).indexOf('leading-tight truncate">Tirzepatide</h3>') > -1, 'V1 selector name still truncates');
ok(C.bigButtonLabel(DATA.treatments[0].plans.twelveMonth) === 'GET 12 MONTHS + SAVE $1,082', 'V1 label unchanged after generalisation');

// ---- V3 = the Gold product page (client doc "price lock to Gold product and checkout", 2026-09-25): no 12-month ----
var D3 = require(path.join(__dirname, 'plans-data-v3.js'));
var doc3 = { tirz: { sixMonth: [279, 1674], threeMonth: [299, 897], monthly: [279, 279, 399] },
             sema: { sixMonth: [179, 1074], threeMonth: [249, 747], monthly: [179, 179, 299] } };
ok(D3.heroPlan === null && JSON.stringify(D3.rowPlans) === '["sixMonth","threeMonth","monthly"]', 'V3: no highlighted card, rows 6 / 3 / monthly');
ok(D3.checkoutHref === 'checkout-v3/' && D3.productHref === '../v3.html', 'V3 buttons open checkout-v3, which comes back to v3');
D3.treatments.forEach(function (t) {
  var nm = t.key === 'tirz' ? 'Tirzepatide' : 'Semaglutide';
  ok(t.name === nm && t.cardTitle === nm, 'V3 ' + t.key + ' named ' + nm);
  ok(!t.plans.twelveMonth, 'V3 ' + t.key + ' has no 12-month plan');
  Object.keys(doc3[t.key]).forEach(function (k) {
    var p = t.plans[k], e = doc3[t.key][k];
    ok(p.price === e[0] && p.totalPrice === e[1] && p.price * p.months === e[1], 'V3 ' + t.key + ' ' + k + ' = doc ($' + e[0] + ' / $' + e[1] + ')');
  });
  var c3 = C.renderTreatmentCard(t, D3);
  ok(count(c3, 'btn-lilac') === 3 && c3.indexOf('twelveMonth') === -1 && c3.indexOf('Best value') === -1, 'V3 ' + t.key + ' 3 Select buttons, no hero card');
  ok(c3.indexOf('>' + nm + '</h3>') > -1, 'V3 ' + t.key + ' card title');
  ok(c3.indexOf(t.key === 'tirz' ? 'Recommended for faster results' : 'Recommended for most patients') > -1, 'V3 ' + t.key + ' recommended badge');
  var six = t.plans.sixMonth, three = t.plans.threeMonth, mo = t.plans.monthly;
  ok(c3.indexOf(C.fmtMoney(six.totalPrice) + ' due today -</span> <span class="text-brand-green">LOCK IN THIS PRICE</span>') > -1, 'V3 ' + t.key + ' 6-month: LOCK IN THIS PRICE (green)');
  ok(c3.indexOf(C.fmtMoney(three.totalPrice) + ' due today -</span> <span class="text-secondary-500">EVERY 4TH MONTH <span class="text-brand-green font-black">FREE</span>, FOREVER</span>') > -1, 'V3 ' + t.key + ' 3-month: FREE bold green');
  ok(c3.indexOf('text-gray-400 line-through mr-2">' + C.fmtMoney(doc3[t.key].monthly[2]) + '</span><span class="text-3xl font-bold" style="color: rgb(184, 146, 46);">' + C.fmtMoney(mo.price) + '<') > -1, 'V3 ' + t.key + ' monthly: grey crossed-out then gold price');
  ok(c3.indexOf('>Prescribed for only:<') > -1 && c3.indexOf('>' + C.fmtMoney(mo.price) + ' due today</p>') > -1, 'V3 ' + t.key + ' monthly sublabel + plain due line');
  ok(c3.indexOf('Ships every 4 weeks') > -1 && c3.indexOf('no increases ever') === -1 && c3.indexOf('No surprises') === -1 && c3.indexOf('your price never goes up') === -1, 'V3 ' + t.key + ' monthly copy edits');
  ok(c3.indexOf('save $') === -1 && c3.indexOf('Lowest industry pricing') === -1, 'V3 ' + t.key + ' no save figures, no old sublabel');
});
ok(C.renderTreatmentCard(D2.treatments[0], D2).indexOf('Recommended for most patients') > -1, 'V2 badge unchanged');

console.log((fails ? 'FAIL ' : 'OK ') + (n - fails) + '/' + n + ' checks');
process.exit(fails ? 1 : 0);
