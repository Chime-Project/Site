/* node chime-offer-u10/js/lander-tests.js : slider maths + rail maths, and static checks over the whole folder
   (links, cache version, noindex, no competitor names, network: nothing external but LegitScript's seal). */
var L = require('./lander.js'), fs = require('fs'), path = require('path');
var ROOT = path.join(__dirname, '..'), V = '20260994';
var n = 0, bad = 0;
function ok(c, m) { n++; if (!c) { bad++; console.log('FAIL', m); } }
function eq(a, b, m) { ok(JSON.stringify(a) === JSON.stringify(b), m + ' (got ' + JSON.stringify(a) + ')'); }
eq(L.couldLose(305), 46, 'slider default 305 -> 46 lb'); eq(L.couldLose(140), 21, '140 -> 21'); eq(L.couldLose(500), 76, '500 -> 76');
eq(L.thumbLeft(140), 0, 'thumb at 0%'); eq(L.thumbLeft(500), 100, 'thumb at 100%'); eq(Math.round(L.thumbLeft(305) * 100) / 100, 45.83, 'thumb at 45.83% (theirs)');
eq(L.wrap(990, 20, 1000), 10, 'rail loops at half width'); eq(L.pxPerSecond(305, 24, 3.5), 94, 'stats rail: one card per 3.5 s');
// every file
function walk(d) { return fs.readdirSync(d).reduce(function (a, f) { var p = path.join(d, f); return a.concat(fs.statSync(p).isDirectory() ? walk(p) : [p]); }, []); }
var files = walk(ROOT), text = files.filter(function (f) { return /\.(html|js|css|svg|md|json)$/.test(f); });
text.forEach(function (f) {
  var s = fs.readFileSync(f, 'utf8'), rel = path.relative(ROOT, f);
  var BAD = new RegExp(['next' + 'meds', 'next' + '\\s+meds', 'next' + 'med\\b', 'trin' + 'ity', 'alt' + 'rx', 'open' + 'loop', 'telle' + 'scope'].join('|'), 'i');
  ok(!BAD.test(s), 'no competitor / partner names in ' + rel + ' ' + ((s.match(BAD) || [''])[0]));
  ok(s.indexOf('202609' + '90') < 0 && s.indexOf('22-56' + '-21') < 0, 'no retired cache version / ruled-out still in ' + rel);
});
var pages = files.filter(function (f) { return /index\.html$/.test(f); });
eq(pages.length, 5, 'five pages: lander, consultation, checkout, not-eligible, welcome');
pages.forEach(function (f) {
  var s = fs.readFileSync(f, 'utf8'), rel = path.relative(ROOT, f), dir = path.dirname(f);
  ok(/<meta name="robots" content="noindex">/.test(s), 'noindex: ' + rel);
  ok(/<title>[^<]*Chime Health<\/title>/.test(s), 'title: ' + rel);
  (s.match(/<(?:link|script)\b[^>]*(?:href|src)="([^"]+\.(?:css|js)[^"]*)"/g) || []).forEach(function (t) {
    ok(t.indexOf('?v=' + V) > 0, 'versioned asset in ' + rel + ': ' + t.slice(0, 90));
  });
  var urls = []; s.replace(/\s(?:href|src|srcset)="([^"]+)"/g, function (_, u) { urls.push(u); });
  s.replace(/url\(['"]?([^'")]+)/g, function (_, u) { urls.push(u); });
  urls.forEach(function (u) {
    if (/^(#|mailto:|data:)/.test(u)) return;
    if (/^https?:/.test(u)) { ok(/^https:\/\/(www|static)\.legitscript\.com\//.test(u), 'only LegitScript may be external (' + rel + '): ' + u); return; }
    var p = path.resolve(dir, u.split(/[?#]/)[0]); if (/\/$/.test(u.split(/[?#]/)[0])) p = path.join(p, 'index.html');
    ok(fs.existsSync(p), 'link resolves (' + rel + '): ' + u);
  });
  ok(!/<iframe|<video|googletagmanager|clarity\.ms|attn\.tv|js\.stripe\.com|stripe\.network|activecampaign/i.test(s.replace(/<!--[\s\S]*?-->/g, '')), 'no trackers / iframes / videos / Stripe in ' + rel);
});
var lander = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
ok((lander.match(/href="consultation\/"/g) || []).length >= 15, 'all lander CTAs -> consultation/ (' + (lander.match(/href="consultation\/"/g) || []).length + ')');
ok(/legitscript\.com\/websites\/\?checker_keywords=chimehealth\.com/.test(lander), 'Chime LegitScript seal');
['privacy-policy.html', 'hipaa-notice.html', 'terms-conditions.html', 'faq.html#jurisdictions'].forEach(function (h) { ok(lander.indexOf('href="../' + h + '"') > 0, 'footer legal link ' + h); });
var co = fs.readFileSync(path.join(ROOT, 'checkout/index.html'), 'utf8');
ok(!/<input[^>]*\sname=/.test(co.replace(/name="pe-bnpl-x"/g, '')), 'payment look-alike inputs carry no names');
ok(!/<form\b/.test(co), 'checkout has no form');
console.log(n + ' checks, ' + bad + ' failed'); process.exit(bad ? 1 : 0);
