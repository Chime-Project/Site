/* node chime-offer-u10/js/checkout-tests.js : prices, ladder, offer sheet, copy tokens. */
var K = require('./checkout.js');
var n = 0, bad = 0;
function eq(a, b, m) { n++; if (JSON.stringify(a) !== JSON.stringify(b)) { bad++; console.log('FAIL', m, JSON.stringify(a), '!=', JSON.stringify(b)); } }
// their ladder (offer "99FOREVER"): totals, per month, savings, "save $X every month"
eq([1, 3, 6, 12].map(function (m) { return K.TOTAL.sema[m]; }), [79, 228, 438, 588], 'semaglutide totals');
eq([1, 3, 6, 12].map(function (m) { return K.TOTAL.tirz[m]; }), [129, 378, 738, 1428], 'tirzepatide totals');
eq([1, 3, 6, 12].map(function (m) { return K.perMonth('sema', m); }), [79, 76, 73, 49], 'semaglutide per month ($49 = 12-month)');
eq([1, 3, 6, 12].map(function (m) { return K.perMonth('tirz', m); }), [129, 126, 123, 119], 'tirzepatide per month');
eq([1, 3, 6, 12].map(function (m) { return K.savings('sema', m); }), [110, 339, 696, 1680], 'semaglutide savings (was $189/mo)');
eq([1, 3, 6, 12].map(function (m) { return K.savings('tirz', m); }), [140, 429, 876, 1800], 'tirzepatide savings (was $269/mo)');
eq([1, 3, 6, 12].map(function (m) { return K.monthSave('sema', m); }), [110, 113, 116, 140], 'semaglutide "Save $X Every Month"');
eq([1, 3, 6, 12].map(function (m) { return K.monthSave('tirz', m); }), [140, 143, 146, 150], 'tirzepatide "Save $X Every Month"');
// order review for the default (tirzepatide 3-month)
var t = K.tokens('tirz', 3, { firstName: 'Jane', weight: 220, goalWeight: 170, gender: 'Female' });
eq([t.total, t.subtotal, t.save, t.planName, t.planLower, t.payLine, t.pill, t.med], ['378', '807', '429', '3 Month Plan', '3-Month plan', 'Pay 3 months at a time.', 'Most Weight Loss Potential', 'Tirzepatide'], 'default review');
eq([t.first, t.weight, t.goal, t.lose, t.gender], ['Jane', '220', '170', '50', 'Female'], 'quiz answers in the copy');
var s1 = K.tokens('sema', 1, {});
eq([s1.total, s1.subtotal, s1.save, s1.every, s1.planName, s1.planLower, s1.payLine, s1.pill], ['79', '189', '110', 'every month', '1 Month Plan', 'Monthly plan', 'Pay month to month.', 'Most Popular'], 'semaglutide monthly review');
eq(K.tokens('sema', 12, {}).every, 'every 12 months', '12-month summary wording');
// the ONE TIME SPECIAL OFFER sheet: below 12 months -> next tier
eq(K.offer('tirz', 6), { next: 12, dmo: 4, curpm: 123, nextpm: 119, nextMonths: 12, nextLabel: '12-month plan' }, 'tirz 6 -> 12 ($4/mo)');
eq(K.offer('tirz', 1).dmo, 3, 'tirz 1 -> 3 ($3/mo)'); eq(K.offer('sema', 3).nextpm, 73, 'sema 3 -> 6 ($73)');
eq(K.offer('sema', 6).dmo, 24, 'sema 6 -> 12 ($24/mo)'); eq(K.offer('sema', 12), null, 'no sheet on 12-month'); eq(K.offer('tirz', 12), null, 'no sheet on 12-month (tirz)');
eq(K.clock(600), '10:00', 'timer starts at 10:00'); eq(K.clock(-5), '00:00', 'timer stops at 00:00'); eq(K.clock(61), '01:01', 'mm:ss');
eq(K.fill('Save ${{save}} {{every}}', K.tokens('tirz', 3, {})), 'Save $429 every 3 months', 'token fill');
console.log(n + ' checks, ' + bad + ' failed'); process.exit(bad ? 1 : 0);
