/* node chime-upsell-offers/js/upsell-tests.js — the upsell offers against the client's recording (2026-10-05) and the
   client's prices + Tesamorelin rename (2026-10-06): every price, the banners with and without a name, the order line,
   the routing, the pages' wiring, the old sermorelin.html forward, and the checkout hand-off. No DOM. */
'use strict';
var fs = require('fs'), path = require('path');
var D = require('./offers.js'), U = require('./upsell.js');
var DIR = path.join(__dirname, '..'), V = '20260986';
var pass = 0, fail = 0;
function eq(name, got, want) {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else { fail++; console.log('FAIL ' + name + ': got ' + JSON.stringify(got) + ', want ' + JSON.stringify(want)); }
}
function grid(ask) { return ask.plans.map(function (p) { return [p.label, p.was, p.now, p.save]; }); }

// 1. the client's prices (2026-10-06): Monthly / 3-Month / 6-Month, [label, Reg per month, price per month, You Save]
var nad = D.offers[0], tes = D.offers[1], zof = D.offers[2];
eq('order of offers', D.offers.map(function (o) { return o.key; }), ['nad', 'tesamorelin', 'zofran']);
eq('names', D.offers.map(function (o) { return o.name; }), ['NAD+', 'Tesamorelin', 'Zofran (Ondansetron)']);
eq('NAD+', grid(nad.first), [['Monthly Plan', 269, 149, 120], ['3-Month Plan', 269, 119, 450], ['6-Month Plan', 269, 89, 1080]]);
eq('Tesamorelin', grid(tes.first), [['Monthly Plan', 299, 169, 130], ['3-Month Plan', 299, 139, 480], ['6-Month Plan', 299, 119, 1080]]);
eq('Zofran: $59, no Reg', grid(zof.first), [['Monthly Plan', null, 59, null]]);
eq('Reg (full) prices', D.offers.map(function (o) { return o.full; }), [269, 299, null]);
eq('months', D.offers.map(function (o) { return o.first.plans.map(function (p) { return p.months; }); }), [[1, 3, 6], [1, 3, 6], [1]]);
D.offers.forEach(function (o) {
  o.first.plans.forEach(function (p) {
    if (p.was) eq(o.key + ' ' + p.label + ': You Save = (Reg - price) x months', p.save, (p.was - p.now) * p.months);
    eq(o.key + ' ' + p.label + ': Reg = the offer Reg', p.was, o.full);
  });
});
eq('Lifetime % off (Monthly, rounded down)', D.offers.map(function (o) { return U.lifetimePct(o, o.first.plans[0]); }), [44, 43, 0]);
eq('decline price drop off (one price per plan)', [D.declineDrop, D.offers.map(function (o) { return U.hasSecondAsk(D, o); })], [false, [false, false, false]]);
eq('second asks parked without prices', D.offers.map(function (o) { return o.second.plans; }), [null, null, null]);
eq('drop switches back on once second-ask prices exist', U.hasSecondAsk({ declineDrop: true }, { second: { plans: [{}] } }), true);
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
eq('Tesamorelin second, named', U.banner(tes.second, 'yvonne'), 'Are you sure yvonne? We just increased the offer discount for you');
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
eq('money', [U.money(1080), U.money(59)], ['$1,080', '$59']);
eq('order label', [U.orderLabel(D, 'sema', 1), U.orderLabel(D, 'tirz', 12), U.orderLabel(D, 'x', 7)],
   ['Semaglutide - 1 month plan', 'Tirzepatide - 12 month plan', 'Semaglutide - 1 month plan']);
eq('routing', [U.nextHref(D, 'nad'), U.nextHref(D, 'tesamorelin'), U.nextHref(D, 'zofran')], ['tesamorelin.html', 'zofran.html', 'done.html']);
eq('CTA price monthly / longer / no Reg', [U.ctaPrice(nad.first.plans[0]), U.ctaPrice(tes.first.plans[1]), U.ctaPrice(zof.first.plans[0])],
   [{ was: '$269', now: '$149' }, { was: '$299', now: '$139/mo' }, { was: '', now: '$59' }]);

// 4. the pages
var pages = { 'index.html': 'nad', 'tesamorelin.html': 'tesamorelin', 'zofran.html': 'zofran', 'done.html': null };
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
var stub = fs.readFileSync(path.join(DIR, 'sermorelin.html'), 'utf8');
eq('old sermorelin.html forwards to tesamorelin.html with the query', [/location\.replace\('tesamorelin\.html' \+ location\.search/.test(stub), /url=tesamorelin\.html/.test(stub), /noindex/.test(stub)], [true, true, true]);
eq('no Sermorelin left on the offers or data', ['index.html', 'tesamorelin.html', 'zofran.html', 'done.html', 'js/offers.js', 'css/upsell.css'].filter(function (f) {
  return /sermorelin/i.test(fs.readFileSync(path.join(DIR, f), 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, ''));
}), []);
eq('done page: their three tiles, not links', (function (h) { return [(h.match(/class="uo-tile /g) || []).length, /<a[^>]*uo-tile/.test(h)]; })(fs.readFileSync(path.join(DIR, 'done.html'), 'utf8')), [3, false]);

// 5. the checkout hand-off (../choose-treatment-original/)
var co = fs.readFileSync(path.join(DIR, '..', 'choose-treatment-original', 'checkout', 'index.html'), 'utf8');
var hand = fs.readFileSync(path.join(DIR, '..', 'choose-treatment-original', 'js', 'to-upsells.js'), 'utf8');
eq('checkout loads the hand-off after checkout.js', /checkout\.js\?v=20260967"><\/script>\n<script src="\.\.\/js\/to-upsells\.js\?v=20260985"><\/script>/.test(co), true);
eq('hand-off goes to offer 1 with med + term', /'\.\.\/\.\.\/chime-upsell-offers\/\?med=' \+ med \+ '&term=' \+ term/.test(hand), true);
eq('name stays out of the URL', /href = [^;]*name/.test(hand), false);

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
