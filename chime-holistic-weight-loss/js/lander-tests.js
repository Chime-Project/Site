/* Chime Health holistic weight-loss lander: node checks (node chime-holistic-weight-loss/js/lander-tests.js).
   The calculator maths against what their page showed on 2026-10-05 (month 6: $613 / $3,078 / $2,154 / $2,194, save
   $2,465; 200 lb tirzepatide: 46 lb, 154 lb, 23 %), and the built page against the clone rules. */
'use strict';
var fs = require('fs'), path = require('path');
var L = require('./lander.js');
var page = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'lander.css'), 'utf8');
var body = page.replace(/<!--[\s\S]*?-->/g, '');
// the one remote image/link: the chimehealth.com LegitScript seal as Nick posted it (Asana 1218871555785832)
var SEAL = /<a href="https:\/\/www\.legitscript\.com\/websites\/\?checker_keywords=chimehealth\.com" target="_blank" title="Verify LegitScript Approval for www\.chimehealth\.com"><img alt="Verify Approval for www\.chimehealth\.com"[^>]*src="https:\/\/static\.legitscript\.com\/seals\/51605690\.png"><\/a>/g;

var pass = 0, fail = 0;
function eq(name, got, want) {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else { fail++; console.log('FAIL ' + name + ': got ' + JSON.stringify(got) + ', want ' + JSON.stringify(want)); }
}

// 1. savings calculator: tirzepatide ladder, $69/month + $199 membership from month 2
var m6 = L.savings(6);
eq('month 6 ours', m6.ours, 613);
eq('month 6 theirs', m6.them.map(function (c) { return c.cost; }), [3078, 2154, 2194]);
eq('month 6 save', m6.save, 2465);
eq('month 6 paid back', m6.paidBack, true);
eq('month 6 hides cheapest on narrow', m6.hideOnNarrow, 'Found');
eq('month 6 slider fill', Math.round(m6.fill * 1e6) / 1e6, 45.454545);
var m1 = L.savings(1);
eq('month 1: no membership yet', m1.ours, 69);
eq('month 1 theirs = first month', m1.them.map(function (c) { return c.cost; }), [338, 359, 199]);
eq('month 1 not paid back', m1.paidBack, false);
eq('month 1 cheapest MEDVi', m1.hideOnNarrow, 'MEDVi');
eq('month 1 fill', m1.fill, 0);
var m2 = L.savings(2);
eq('month 2 ours', m2.ours, 337);
eq('month 2 paid back (min margin 199+399-138 >= 199)', m2.paidBack, true);
var m12 = L.savings(12);
eq('month 12 ours', m12.ours, 1027);
eq('month 12 Ro', m12.them[0].cost, 6366);
eq('month 12 save', m12.save, 5339);                       // their "Save up to $5,339 a year"
eq('month 12 fill', m12.fill, 100);
eq('money', L.money(3078), '$3,078');
// 2. treatment calculator
eq('tirz 200', L.treatment(200, 'tirz'), { loss: 46, after: 154, pct: 23 });
eq('sema 200', L.treatment(200, 'sema'), { loss: 36, after: 164, pct: 18 });
eq('tirz 100', L.treatment(100, 'tirz'), { loss: 23, after: 77, pct: 23 });
eq('tirz 400', L.treatment(400, 'tirz'), { loss: 92, after: 308, pct: 23 });
eq('sema 333 rounds', L.treatment(333, 'sema'), { loss: 60, after: 273, pct: 18 });

// 3. the built page: branding only
eq('no Collective left', /collective(?! buying power)/i.test(body), false);
eq('common noun kept', (body.match(/collective buying power/g) || []).length, 5);
eq('chart label', (body.match(/md:uppercase">Chime<\/p>/g) || []).length, 1);
eq('no half-renamed brand elsewhere', /Chime(?! Health)/.test(body.replace('md:uppercase">Chime</p>', '')), false);
eq('no remote hosts', /collective\.org|legitscript\.com|posthog|oursprivacy|dashfi|revoffers|katalys|clerk|bronco|instagram\.com|tiktok\.com|x\.com\//.test(body.replace(SEAL, '')), false);
eq('only our scripts', (page.match(/<script\b[^>]*>/g) || []), ['<script src="js/lenis.min.js?v=20260983">', '<script src="js/lander.js?v=20260983">']);
eq('no Next runtime', /\/_next\/|__next_f|self\.__next/.test(page), false);
eq('every CTA to the assessment', (page.match(/href="\.\.\/chimeAssessment\.html"/g) || []).length, 13);
eq('no pre-qualification links', /pre-qualification/.test(page), false);
eq('Chime logos', /src="images\/logo\.svg"/.test(page) && /src="images\/logo-footer\.svg"/.test(page), true);
eq('support e-mail', /mailto:hello@chimehealth\.com/.test(page), true);
eq('chimehealth.com LegitScript seal, linked', (body.match(SEAL) || []).length, 1);
eq('legal links', ['../privacy-policy.html', '../terms-conditions.html'].every(function (h) { return page.indexOf('href="' + h + '"') > -1; }), true);
eq('noindex', /<meta name="robots" content="noindex">/.test(page), true);
eq('?v= on css and js', (page.match(/\?v=20260983/g) || []).length, 3);
eq('their study links kept', /doi\.org\/10\.1016\/j\.obpill\.2025\.100236/.test(page), true);
// every local asset the page references exists
var refs = (page.match(/(?:src|href|srcset)="((?:images|css|js|fonts)\/[^"?]+)/g) || []).map(function (s) { return s.replace(/^[a-z]+="/, ''); });
refs = refs.concat((css.match(/url\(\.\.\/fonts\/[^)]+\)/g) || []).map(function (s) { return s.slice(7, -1); }));
var missing = refs.filter(function (r) { return !fs.existsSync(path.join(__dirname, '..', r)); });
eq('every asset exists (' + refs.length + ')', missing, []);
// hooks the script needs
['data-sv-title', 'data-sv-month', 'data-sv-range', 'data-sv-by', 'data-sv-save', 'data-sv-payback', 'data-tc-tabs', 'data-tc-range',
 'data-tc-weight', 'data-tc-loss', 'data-tc-after', 'data-tc-pct', 'data-tc-blurb', 'data-tc-study', 'data-tc-tail',
 'data-reveal-delay="80"', 'id="tpl-menu"', 'id="tpl-mobile"', 'id="tpl-x"'].forEach(function (h) {
  eq('hook ' + h, page.indexOf(h) > -1, true);
});
eq('4 savings columns', (page.match(/data-sv-col/g) || []).length, 4);
eq('4 savings costs', (page.match(/data-sv-cost/g) || []).length, 4);
// css kept what the script toggles
['.is-visible', 'grid-rows-\\[1fr\\]', 'rotate-180', 'max-\\[359px\\]\\:hidden', 'bg-\\[\\#423531\\]', 'hover\\:bg-\\[\\#FFF0EB\\]'].forEach(function (c) {
  eq('css ' + c, css.indexOf(c) > -1, true);
});

// Chime blue CTAs (Luis, 2026-10-05)
eq('16 CTAs tagged + template Login', (page.match(/class="chime-cta /g) || []).length, 17);
eq('CTA override is Chime blue-800 / 900', css.indexOf('.chime-cta{--color-brand:#324563;--color-brand-hover:#26354D') > -1, true);

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
