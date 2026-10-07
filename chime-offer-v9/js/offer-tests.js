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
// the one remote image/link: the chimehealth.com LegitScript seal as Nick posted it (Asana 1218871555785832)
var SEAL = /<a href="https:\/\/www\.legitscript\.com\/websites\/\?checker_keywords=chimehealth\.com" target="_blank" title="Verify LegitScript Approval for www\.chimehealth\.com"><img src="https:\/\/static\.legitscript\.com\/seals\/51605690\.png" alt="Verify Approval for www\.chimehealth\.com"/g;
eq('chimehealth.com LegitScript seal, linked', (page.match(SEAL) || []).length, 1);
eq('no remote media', /imagekit|trinitymeds\.com|dmca\.com|legitscript\.com/.test(page.replace(/<!--[\s\S]*?-->/g, '').replace(SEAL, '')), false);
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

// 4. the $49 and $59 versions (client 2026-10-04): the same page with every "$99" changed, assets from ../chime-offer-v9/
var body = function (h) { return h.slice(h.indexOf('-->') + 3); };
['49', '59'].forEach(function (price) {
  var dir = path.join(__dirname, '..', '..', 'chime-offer-v9-' + price), v = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  eq(price + ' title', (v.match(/<title>([^<]*)/) || [])[1], 'GLP-1 Weight Loss from $' + price + '/mo | Chime Health');
  eq(price + ' no $99 left', body(v).indexOf('$99'), -1);
  eq(price + ' five price mentions', (body(v).match(new RegExp('\\$' + price + '(?!\\d)', 'g')) || []).length, 5);
  eq(price + ' offer bar', (body(v).match(new RegExp('STARTING at GLP-1: \\$' + price + ' \\| GLP-1 \\+ GIP: \\$149\\.', 'g')) || []).length, 3);
  eq(price + ' closing line', body(v).indexOf('Only $' + price + '/month') > -1, true);
  eq(price + ' was $299 kept', body(v).indexOf('$299') > -1, true);
  // identical to chime-offer-v9 apart from the price and the asset paths
  var norm = function (h) { return body(h).split('../chime-offer-v9/').join(''); };
  if (price !== '49') eq(price + ' same page otherwise', norm(v).split('$' + price).join('$99'), body(page));
  else {
    // Luis 2026-10-06, "dont put any text over titles": the $49 page moves every label above a heading to just below it
    // (uploads/trinity-offer-v9-ref/no_eyebrows.py), so it is the same page re-ordered: the same text, label by label
    var texts = function (h) { return h.split(/<[^>]+>/).map(function (t) { return t.trim(); }).filter(Boolean).sort(); };
    eq('49 same text otherwise', texts(norm(v).split('$49').join('$99')), texts(body(page)));
    [['h1', 'Honest Weight Loss', '>(4.4) Based on member-reported'], ['h2', 'Ready To Reach', '>Your potential<'],
     ['h2', 'How Chime', '>How it works<'], ['h3', 'Start Your', '>Step 1<'], ['h3', 'Get Prescribed', '>Step 2<'],
     ['h3', 'Receive', '>Step 3<'], ['h2', 'Why we', '>The Chime Health difference<'], ['h2', 'Get Started For', '>Feel confident in your skin<']
    ].forEach(function (c) {
      var b_ = body(v), h = b_.indexOf('>' + c[1], b_.search(new RegExp('<' + c[0] + '[ >][^]*?' + c[1].replace(/[()]/g, '\\$&'))));
      var close = b_.indexOf('</' + c[0] + '>', h), lab = b_.indexOf(c[2], close), between = b_.slice(close + 5, lab + 1);
      eq('49 "' + c[2].replace(/[<>]/g, '') + '" sits right below its ' + c[0], h > -1 && lab > close && !/<h[1-6][ >]/.test(between) &&
         !between.replace(/<[^>]+>/g, '').trim(), true);   // nothing but markup between the heading and its label
      var open_ = b_.lastIndexOf('<' + c[0], h), above = b_.slice(Math.max(0, open_ - 400), open_).replace(/<[^>]+>/g, '').trim();
      eq('49 nothing above the ' + c[0] + ' "' + c[1] + '"', above.indexOf(c[2].replace(/[<>]/g, '')), -1);
    });
  }
  var r = (v.match(/(?:src|href|srcset)="(?!https?:|#|mailto:|\.\.\/chimeAssessment|\.\.\/index|\.\.\/(?:privacy|hipaa|consumer|telehealth|shipping|return|terms|faq))([^"?#]+)/g) || []).map(function (m) { return m.replace(/^\w+="/, ''); });
  (v.match(/url\('([^']+)'\)/g) || []).forEach(function (u) { r.push(u.slice(5, -2)); });
  eq(price + ' assets found', r.length > 30, true);
  r.forEach(function (x) { eq(price + ' asset ' + x, fs.existsSync(path.normalize(path.join(dir, x))), true); });
});

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
