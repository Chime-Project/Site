/* Chime Health — Choose Your Treatment, ORIGINAL PRICES: node checks (node choose-treatment-original/js/original-tests.js).
   Every expected figure below was read off the reference on 2026-10-04: its plan page and its /checkout for each of
   the 8 plans (applied coupon and "Remove"). */
'use strict';
var data = require('./plans-data.js');
var ct = require('../../choose-treatment/js/checkout.js');
var pf = require('../../choose-treatment/checkout/js/plan-fill.js');
var v1 = require('../../choose-treatment/js/plans-data.js');

var pass = 0, fail = 0;
function eq(name, got, want) {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else { fail++; console.log('FAIL ' + name + ': got ' + JSON.stringify(got) + ', want ' + JSON.stringify(want)); }
}
function count(s, x) { return s.split(x).length - 1; }

// plan page: price / total due / save, as the reference shows them
var PAGE = {
  tirz: { twelveMonth: [89, 1068, 1082], sixMonth: [123, 738, 306], threeMonth: [126, 378, 113], monthly: [129, undefined, undefined] },
  sema: { twelveMonth: [49, 588, 1062], sixMonth: [73, 438, 363], threeMonth: [89, 267, 110], monthly: [99, undefined, undefined] }
};
data.treatments.forEach(function (t) {
  Object.keys(PAGE[t.key]).forEach(function (k) {
    var p = t.plans[k];
    eq(t.key + ' ' + k + ' page figures', [p.price, p.totalPrice, p.savingsToday], PAGE[t.key][k]);
  });
});
// the plan page carries V1's copy unchanged: only images and the checkout blocks differ
data.treatments.forEach(function (t, i) {
  var o = v1.treatments[i];
  Object.keys(o.plans).forEach(function (k) {
    var a = Object.assign({}, t.plans[k]); delete a.checkout;
    eq(t.key + ' ' + k + ' = V1 copy', a, o.plans[k]);
  });
  eq(t.key + ' card title = V1', t.cardTitle, o.cardTitle);
});

// the two upsell boxes: 12-month total − 6-month total
eq('tirz upgrade delta', ct.upgradeDelta(data.treatments[0]), 330);
eq('sema upgrade delta', ct.upgradeDelta(data.treatments[1]), 150);
data.treatments.forEach(function (t) {
  var html = ct.renderTreatmentCard(t, data), d = ct.upgradeDelta(t);
  eq(t.key + ' two blue boxes', count(html, 'border-blue-600 bg-blue-50'), 2);
  eq(t.key + ' hero line', count(html, 'Only <span class="whitespace-nowrap rounded-md bg-blue-600 px-1.5 py-0.5 text-white">$' + d + '</span> more than the 6-month plan — for an additional 6 months.'), 1);
  eq(t.key + ' six-month line', count(html, 'and get another 6 months for only <span class="whitespace-nowrap rounded-md bg-blue-600 px-1.5 py-0.5 text-white">$' + d + '</span>'), 1);
  // hero box after "You save", six-month box after its "due today" line and before its ticks
  eq(t.key + ' hero box order', html.indexOf('over month to month pricing.') < html.indexOf('more than the 6-month plan'), true);
  var six = html.indexOf('6-MONTH PLAN'), box = html.indexOf('Upgrade to a 12-month plan'), three = html.indexOf('3-MONTH PLAN');
  eq(t.key + ' six box inside the 6-month row', six < box && box < three, true);
  eq(t.key + ' six box after due line', html.indexOf('due today - save', six) < box, true);
  eq(t.key + ' ping hidden for reduced motion', count(html, 'animate-ping rounded-full bg-blue-400 opacity-60 motion-reduce:hidden'), 2);
  // V1 (no flag) renders no boxes
  var o = v1.treatments.filter(function (x) { return x.key === t.key; })[0];
  eq(t.key + ' V1 unchanged: no boxes', count(ct.renderTreatmentCard(o, v1), 'border-blue-600'), 0);
});
eq('plan buttons open checkout/', ct.checkoutUrl(data.checkoutHref, 'tirz', 'twelveMonth'), 'checkout/?med=tirz&term=12');
eq('monthly button', ct.checkoutUrl(data.checkoutHref, 'sema', 'monthly'), 'checkout/?med=sema&term=1');

// checkout: their order summary per plan (applied state, then "Remove")
var CO = [
  // med, term, title, perDay, code, crossed, total, discount, noCoupon, perDayNoCoupon, packageLabel
  ['tirz', 1, 'Tirzepatide Monthly Plan', '$4.30', '', '$129', '$129', '$0', '$129', '$4.30', 'Standard Monthly Plan'],
  ['tirz', 3, 'Tirzepatide 3-Month Plan', '$4.20', '200off', '$578', '$378', '$200', '$428', '$4.76', '3-Month Treatment Package'],
  ['tirz', 6, 'Tirzepatide 6-Month Plan', '$4.10', '250off', '$988', '$738', '$250', '$838', '$4.66', '6-Month Treatment Package'],
  ['tirz', 12, 'Tirzepatide 12-Month Plan', '$2.97', '500off', '$1,568', '$1,068', '$500', '$1,418', '$3.94', '12-Month Treatment Package (Best Value)'],
  ['sema', 1, 'Semaglutide Monthly Plan', '$3.30', '', '$99', '$99', '$0', '$99', '$3.30', 'Standard Monthly Plan'],
  ['sema', 3, 'Semaglutide 3-Month Plan', '$2.97', '200off', '$467', '$267', '$200', '$317', '$3.52', '3-Month Treatment Package'],
  ['sema', 6, 'Semaglutide 6-Month Plan', '$2.43', '250off', '$688', '$438', '$250', '$538', '$2.99', '6-Month Treatment Package'],
  ['sema', 12, 'Semaglutide 12-Month Plan', '$1.63', '500off', '$1,088', '$588', '$500', '$938', '$2.61', '12-Month Treatment Package (Best Value)']
];
CO.forEach(function (r) {
  var s = pf.summaryFor(data, r[0], r[1]), n = r[0] + ' ' + r[1] + 'M checkout ';
  eq(n + 'figures', [s.title, s.perDay, s.code, s.crossed, s.total, s.discount, s.noCoupon, s.perDayNoCoupon, s.packageLabel], r.slice(2));
  eq(n + 'badge', s.badge, 'Most Affordable');
  eq(n + 'subscription', s.subscription, r[1] === 1);
  eq(n + 'covers', s.covers, 'One-time payment · Covers ' + r[1] + (r[1] === 1 ? ' month' : ' months') + ' of medication');
  var m = pf.replacements(s);
  eq(n + 'Remove total', m['$317'], r[8]);
  eq(n + 'Remove per day', m['$3.52/day'], r[9] + '/day');
});
// V2 (microdose) keeps its rules: no checkout block → Remove = total + $200
var v2 = require('../../choose-treatment/js/plans-data-v2.js');
var s2 = pf.summaryFor(v2, 'sema', 3);
eq('V2 Remove unchanged', pf.replacements(s2)['$317'], s2.crossed);
eq('V2 not a subscription', s2.subscription, false);
eq('subscribe disclaimer', pf.SUBSCRIBE.to.indexOf('By subscribing, you authorize Chime Health to charge you monthly until you cancel.'), 0);

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
