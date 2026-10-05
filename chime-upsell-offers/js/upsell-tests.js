/* node chime-upsell-offers/js/upsell-tests.js — the upsell offers against the client's recording (2026-10-05):
   every price in both asks, the banners with and without a name, the order line, the routing, the pages' wiring,
   and the checkout hand-off. No DOM. */
'use strict';
var fs = require('fs'), path = require('path');
var D = require('./offers.js'), U = require('./upsell.js');
var DIR = path.join(__dirname, '..'), V = '20260985';
var pass = 0, fail = 0;
function eq(name, got, want) {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else { fail++; console.log('FAIL ' + name + ': got ' + JSON.stringify(got) + ', want ' + JSON.stringify(want)); }
}
function grid(ask) { return ask.plans.map(function (p) { return [p.label, p.was, p.now, p.save]; }); }

// 1. the recording's ladders, both asks (frames 0-88 s)
var nad = D.offers[0], ser = D.offers[1], zof = D.offers[2];
eq('order of offers', D.offers.map(function (o) { return o.key; }), ['nad', 'sermorelin', 'zofran']);
eq('NAD+ 30%', grid(nad.first), [['Monthly Plan', 299, 209, 89], ['3-Month Plan', 253, 177, 227], ['6-Month Plan', 241, 169, 434], ['1-Year Plan', 233, 163, 839]]);
eq('NAD+ 50%', grid(nad.second), [['Monthly Plan', 299, 149, 149], ['3-Month Plan', 253, 126, 379], ['6-Month Plan', 241, 120, 724], ['1-Year Plan', 233, 116, 1399]]);
eq('Sermorelin 30%', grid(ser.first), [['Monthly Plan', 259, 181, 77], ['3-Month Plan', 216, 151, 194], ['6-Month Plan', 199, 139, 359], ['1-Year Plan', 183, 128, 659]]);
eq('Sermorelin 50%', grid(ser.second), [['Monthly Plan', 259, 129, 129], ['3-Month Plan', 216, 108, 324], ['6-Month Plan', 199, 99, 599], ['1-Year Plan', 183, 91, 1099]]);
eq('Zofran 30%', grid(zof.first), [['Monthly Plan', 99, 69, 29]]);
eq('Zofran 50%', grid(zof.second), [['Monthly Plan', 99, 49, 49]]);
eq('full prices', D.offers.map(function (o) { return o.full; }), [299, 259, 99]);
eq('percentages', D.offers.map(function (o) { return [o.first.pct, o.second.pct]; }), [[30, 50], [30, 50], [30, 50]]);
eq('banner tones', D.offers.map(function (o) { return [o.first.tone, o.second.tone]; }), [['green', 'peach'], ['green', 'pink'], ['yellow', 'lavender']]);
eq('decline wording', D.offers.map(function (o) { return [o.first.decline, o.second.decline]; }),
   [['No thanks, the next customer can have my offer', 'No thanks, the next customer can have my offer'],
    ['No thanks, the next customer can have my offer', 'No thanks, the next customer can have my offer'],
    ["No thanks, I won't experience nausea", 'No thanks, the next customer can have my offer']]);
eq('four benefits each', D.offers.map(function (o) { return o.benefits.length; }), [4, 4, 4]);
eq('timings', [D.timerSeconds, D.decliningMs, D.confettiDelayMs], [600, 1100, 500]);

// 2. banners: with the first name, without it, and no placeholder ever leaks
eq('NAD+ first, named', U.banner(nad.first, 'yvonne'), "Wait yvonne! You were just selected as today's winner! 93% of patients add this to their plan!");
eq('NAD+ second, named', U.banner(nad.second, 'yvonne'), 'Wait! yvonne are you sure? We just increased your personal discount.');
eq('Sermorelin second, named', U.banner(ser.second, 'yvonne'), 'Are you sure yvonne? We just increased the offer discount for you');
eq('Zofran first, named', U.banner(zof.first, 'yvonne'), "yvonne - It's normal to experience nausea while taking GLP-1's");
eq('Zofran second, named', U.banner(zof.second, 'yvonne'), 'We just lowered the price just for you yvonne - This is the cheapest you can buy Zofran on the market!');
eq('first word only, as typed', U.banner(nad.first, '  Yvonne  Smith '), "Wait Yvonne! You were just selected as today's winner! 93% of patients add this to their plan!");
D.offers.forEach(function (o) {
  ['first', 'second'].forEach(function (k) {
    eq(o.key + ' ' + k + ' no-name has no placeholder', /\{name\}/.test(U.banner(o[k], '')), false);
    eq(o.key + ' ' + k + ' named has the name', U.banner(o[k], 'Ana').indexOf('Ana') > -1, true);
  });
});

// 3. helpers
eq('clock', [U.clock(600), U.clock(599), U.clock(61), U.clock(0), U.clock(-5)], ['10:00', '9:59', '1:01', '0:00', '0:00']);
eq('money', [U.money(1399), U.money(49)], ['$1,399', '$49']);
eq('order label', [U.orderLabel(D, 'sema', 1), U.orderLabel(D, 'tirz', 12), U.orderLabel(D, 'x', 7)],
   ['Semaglutide - 1 month plan', 'Tirzepatide - 12 month plan', 'Semaglutide - 1 month plan']);
eq('routing', [U.nextHref(D, 'nad'), U.nextHref(D, 'sermorelin'), U.nextHref(D, 'zofran')], ['sermorelin.html', 'zofran.html', 'done.html']);
eq('CTA price monthly / longer', [U.ctaPrice(nad.first.plans[0]), U.ctaPrice(nad.first.plans[1])],
   [{ was: '$299', now: '$209' }, { was: '$253', now: '$177/mo' }]);

// 4. the pages
var pages = { 'index.html': 'nad', 'sermorelin.html': 'sermorelin', 'zofran.html': 'zofran', 'done.html': null };
Object.keys(pages).forEach(function (f) {
  var html = fs.readFileSync(path.join(DIR, f), 'utf8'), body = html.replace(/<!--[\s\S]*?-->/g, '');
  eq(f + ' offer', (body.match(/data-offer="([^"]+)"/) || [])[1] || null, pages[f]);
  eq(f + ' noindex', /<meta name="robots" content="noindex"/.test(html), true);
  eq(f + ' scripts', (body.match(/<script src="[^"]+"/g) || []).map(function (s) { return s.slice(13, -1); }),
     ['https://unpkg.com/gsap@3.13.0/dist/gsap.min.js', 'https://unpkg.com/gsap@3.13.0/dist/Physics2DPlugin.min.js', 'js/offers.js?v=' + V, 'js/upsell.js?v=' + V]);
  eq(f + ' LegitScript seal (Nick\'s code)', /href="https:\/\/www\.legitscript\.com\/websites\/\?checker_keywords=chimehealth\.com" target="_blank" title="Verify LegitScript Approval for www\.chimehealth\.com"><img src="https:\/\/static\.legitscript\.com\/seals\/51605690\.png" alt="Verify Approval for www\.chimehealth\.com" width="73" height="79"/.test(body), true);
  eq(f + ' 8 legal links', (body.match(/href="\.\.\/(privacy-policy|hipaa-notice|consumer-health-data-privacy-policy|telehealth-consent|shipping-policy|return-refund-policy|terms-conditions)\.html"|href="\.\.\/faq\.html#jurisdictions"/g) || []).length, 8);
  eq(f + ' no TrimRx', /trimrx/i.test(body), false);
  eq(f + ' three steps done', (body.match(/M5 13l4 4L19 7/g) || []).length, 3);
  var remote = (body.match(/(?:src|href)="https?:[^"]+"/g) || []).filter(function (u) {
    return !/fonts\.googleapis|fonts\.gstatic|unpkg\.com\/gsap@3\.13\.0|legitscript\.com\/websites\/\?checker_keywords=chimehealth\.com|static\.legitscript\.com\/seals\/51605690/.test(u);
  });
  eq(f + ' no other remote hosts', remote, []);
  var refs = (body.match(/(?:src|href)="((?:\.\.\/)?[a-z][^":#?]*\.(?:css|js|svg|webp|png|html))/g) || []).map(function (s) { return s.replace(/^[a-z]+="/, ''); });
  eq(f + ' local refs resolve', refs.filter(function (r) { return !fs.existsSync(path.join(DIR, r)); }), []);
});
D.offers.forEach(function (o) { eq(o.key + ' image exists', fs.existsSync(path.join(DIR, o.image)), true); });
eq('done page: their three tiles, not links', (function (h) { return [(h.match(/class="uo-tile /g) || []).length, /<a[^>]*uo-tile/.test(h)]; })(fs.readFileSync(path.join(DIR, 'done.html'), 'utf8')), [3, false]);

// 5. the checkout hand-off (../choose-treatment-original/)
var co = fs.readFileSync(path.join(DIR, '..', 'choose-treatment-original', 'checkout', 'index.html'), 'utf8');
var hand = fs.readFileSync(path.join(DIR, '..', 'choose-treatment-original', 'js', 'to-upsells.js'), 'utf8');
eq('checkout loads the hand-off after checkout.js', /checkout\.js\?v=20260967"><\/script>\n<script src="\.\.\/js\/to-upsells\.js\?v=20260985"><\/script>/.test(co), true);
eq('hand-off goes to offer 1 with med + term', /'\.\.\/\.\.\/chime-upsell-offers\/\?med=' \+ med \+ '&term=' \+ term/.test(hand), true);
eq('name stays out of the URL', /href = [^;]*name/.test(hand), false);

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
