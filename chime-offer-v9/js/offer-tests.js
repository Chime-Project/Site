/* Chime Health offer lander: node checks (node chime-offer-v9/js/offer-tests.js).
   The deadline maths against what their page showed on 2026-10-04 (countdown to 2026-10-05T03:00Z, "October 4th at
   Midnight"), the slider maths against their 305 -> 46, and the built page against the clone rules. */
'use strict';
var fs = require('fs'), path = require('path');
var O = require('./offer.js');
var page = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
var css = fs.readFileSync(path.join(__dirname, '..', 'css', 'offer.css'), 'utf8');

var pass = 0, fail = 0;
function eq(name, got, want) {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else { fail++; console.log('FAIL ' + name + ': got ' + JSON.stringify(got) + ', want ' + JSON.stringify(want)); }
}
var T = function (s) { return Date.parse(s); };

// 1. rolling deadline: every 5 days from 2026-09-15T03:00Z, always the NEXT mark
eq('deadline on 2026-10-04 evening', new Date(O.nextDeadline(T('2026-10-04T23:00:00Z'))).toISOString(), '2026-10-05T03:00:00.000Z');
eq('deadline exactly at a mark moves on', new Date(O.nextDeadline(T('2026-10-05T03:00:00Z'))).toISOString(), '2026-10-10T03:00:00.000Z');
eq('deadline a second before a mark', new Date(O.nextDeadline(T('2026-10-05T02:59:59Z'))).toISOString(), '2026-10-05T03:00:00.000Z');
eq('first cycle', new Date(O.nextDeadline(T('2026-09-15T03:00:01Z'))).toISOString(), '2026-09-20T03:00:00.000Z');
eq('far future still a 5-day mark', (O.nextDeadline(T('2027-03-01T12:00:00Z')) - O.ANCHOR) % O.CYCLE, 0);
// label in New York time: 03:00Z = 11 pm EDT the day before (10 pm EST after 2026-11-01)
eq('label Oct 5 03:00Z', O.endLabel(T('2026-10-05T03:00:00Z')), 'October 4th at Midnight');
eq('label Oct 10 03:00Z', O.endLabel(T('2026-10-10T03:00:00Z')), 'October 9th at Midnight');
eq('label after DST ends', O.endLabel(T('2026-11-04T03:00:00Z')), 'November 3rd at Midnight');
eq('bar text', O.offerEnds(T('2026-10-04T23:00:00Z')), 'OFFER ENDS OCTOBER 4TH AT MIDNIGHT!');
eq('bar text next cycle', O.offerEnds(T('2026-10-05T03:00:01Z')), 'OFFER ENDS OCTOBER 9TH AT MIDNIGHT!');
[[1, 'st'], [2, 'nd'], [3, 'rd'], [4, 'th'], [11, 'th'], [12, 'th'], [13, 'th'], [21, 'st'], [22, 'nd'], [23, 'rd'], [30, 'th'], [31, 'st']]
  .forEach(function (p) { eq('ordinal ' + p[0], O.ordinal(p[0]), p[1]); });
// countdown split (ceil to the second, as theirs)
eq('split 2h55m47s', O.split((2 * 3600 + 55 * 60 + 47) * 1000), { days: 0, hours: 2, minutes: 55, seconds: 47 });
eq('split rounds up', O.split(1500), { days: 0, hours: 0, minutes: 0, seconds: 2 });
eq('split 4d', O.split(4 * 864e5 + 1000), { days: 4, hours: 0, minutes: 0, seconds: 1 });
eq('split zero', O.split(0), { days: 0, hours: 0, minutes: 0, seconds: 0 });
eq('pad2', O.pad2(7), '07');
// 2. slider
eq('305 -> 46', O.couldLose(305), 46);
eq('140 -> 21', O.couldLose(140), 21);
eq('500 -> 76', O.couldLose(500), 76);
eq('thumb at 140', O.thumbLeft(140), 0);
eq('thumb at 500', O.thumbLeft(500), 100);

// 3. the built page: branding only
eq('no Trinity left', /trinity/i.test(page.replace(/<!--[\s\S]*?-->/g, '')), false);
eq('How Chime Health Works', page.indexOf('>How Chime<span class="font-v9tmDisplay italic text-v9tm-orange"> Health Works.</span>') > -1, true);
eq('no half-renamed brand', /Chime(?! Health| does not)/.test(page.replace(/<!--[\s\S]*?-->/g, '').replace('>How Chime<span', '')), false);
eq('no OpenLoop', /openloop/i.test(page.replace(/<!--[\s\S]*?-->/g, '')), false);
eq('no remote media', /imagekit|trinitymeds\.com|dmca\.com|legitscript\.com/.test(page.replace(/<!--[\s\S]*?-->/g, '')), false);
eq('no trackers', /clarity|northbeam|funnelytics|googletagmanager|attn\.tv|cptn/.test(page.replace(/<!--[\s\S]*?-->/g, '')), false);
eq('no scripts but ours', (page.match(/<script\b/g) || []).length, 1);
eq('every CTA to the assessment', (page.match(/href="\.\.\/chimeAssessment\.html"/g) || []).length >= 7, true);
eq('no consultation links', /\/consultation/.test(page), false);
eq('Chime logo in their canvas', (page.match(/src="images\/logo-(header|footer)\.svg"/g) || []).length, 2);
eq('support e-mail', /hello@chimehealth\.com/.test(page) && !/care@/.test(page), true);
eq('phone placeholder', page.indexOf('1-XXX-XXX-XXXX') > -1 && !/253-650/.test(page), true);
eq('Chime pharmacy answer', page.indexOf('it may be fulfilled by a licensed U.S. pharmacy partner') > -1 && !/RedRock|Triad Rx|Health Warehouse/.test(page), true);
eq('three Chime legal paragraphs', (page.match(/Compounded medications are not approved by the U\.S\. Food and Drug Administration/g) || []).length, 1);
['privacy-policy.html', 'hipaa-notice.html', 'consumer-health-data-privacy-policy.html', 'telehealth-consent.html',
 'shipping-policy.html', 'return-refund-policy.html', 'terms-conditions.html', 'faq.html#jurisdictions'].forEach(function (h) {
  eq('legal link ' + h, page.indexOf('href="../' + h + '"') > -1, true);
  if (h.indexOf('#') < 0) eq('legal page exists ' + h, fs.existsSync(path.join(__dirname, '..', '..', h)), true);
});
eq('member stills, no video', (page.match(/images\/member-\d\.webp/g) || []).length === 4 && !/<video|play-btn|Play testimonial/.test(page), true);
eq('three offer-bar hooks', (page.match(/data-offer-ends/g) || []).length, 3);
eq('countdown hook', (page.match(/data-countdown/g) || []).length, 1);
eq('slider hook', (page.match(/data-weight/g) || []).length, 1);
eq('nine FAQ items', (page.match(/aria-controls="faq-panel-\d"/g) || []).length, 9);
eq('menu + sticky templates', /id="tpl-menu"/.test(page) && /id="tpl-sticky"/.test(page), true);
// every local asset the page and its CSS reference exists
var refs = (page.match(/(?:src|href|srcset)="(?!https?:|#|mailto:|\.\.\/)([^"?#]+)/g) || []).map(function (m) { return m.replace(/^\w+="/, ''); });
(page.match(/url\('([^']+)'\)/g) || []).forEach(function (u) { refs.push(u.slice(5, -2)); });   // inline mask-image urls
eq('no root-absolute paths', /["'(]\/assets\//.test(page), false);
(css.match(/url\((?!data:)([^)]+)\)/g) || []).forEach(function (u) { refs.push('css/' + u.slice(4, -1).replace(/["']/g, '')); });
refs.forEach(function (r) { eq('asset ' + r, fs.existsSync(path.normalize(path.join(__dirname, '..', r))), true); });
eq('scoped rules kept', /\[data-v-2d6b9e33\]/.test(css) && /\.faq-panel\[data-v-cb465815\]/.test(css), true);

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
