/* node chime-glp-membership/js/page-tests.js
   Checks the savings maths, that every price on the page matches PRICES, the
   CTA targets, and the client's 2026-10-06 exclusions (no providers grid, no
   provider-choice claim, "discounted" not "no markups", price before membership). */
"use strict";
var fs = require("fs");
var path = require("path");
var api = require("./page.js");

var pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) pass++; else { fail++; console.log("FAIL " + name); }
}

var html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
var text = html.replace(/<!--[\s\S]*?-->/g, "").replace(/<script[\s\S]*?<\/script>/g, "");
var visible = text.replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#8209;/g, " ").replace(/\s+/g, " ");
var P = api.PRICES;

/* ---------- savings maths ---------- */
ok(api.membershipMonthly(199) === 17, "membership rounds 16.58 up to 17");
ok(api.ourCum(1) === 69, "month 1 is inside the free trial (no membership)");
ok(api.ourCum(2) === 69 * 2 + 199, "membership charged from month 2");
ok(api.ourCum(6) === 613, "month 6 = 613 (Collective's figure)");
ok(api.theirCum(api.COMPETITORS[0], 6) === 3078, "Ro month 6 = 3078 as on Collective");
ok(api.theirCum(api.COMPETITORS[1], 6) === 2154, "Found month 6 = 2154");
ok(api.theirCum(api.COMPETITORS[2], 6) === 2194, "MEDVi month 6 = 2194");
ok(api.typicalCum(6) === 2475, "typical average month 6 = 2475");
ok(api.typicalMonthly() === 435, "typical monthly tirzepatide = 435");
var s6 = api.savings(6), s12 = api.savings(12), s1 = api.savings(1);
ok(s6.save === 1862 && s6.pct === 75 && s6.paidBack, "month 6 saves 1862 (75%), paid back");
ok(s12.save === 4060 && s12.pct === 80, "month 12 saves 4060 (80%)");
ok(!s1.paidBack, "month 1 never shows the paid-back pill");
for (var m = 1; m <= 12; m++) {
  var r = api.savings(m);
  ok(r.save === r.theirs - r.ours && r.save > 0, "month " + m + " saving is positive and consistent");
  ok(r.oursBar > 0 && r.oursBar <= 100, "month " + m + " bar width in range");
}
ok(api.money(4060) === "$4,060", "money formats thousands");
ok(api.pageCount(6, 3) === 2 && api.pageCount(6, 1) === 6 && api.clampPage(9, 2) === 1, "rail paging");

/* ---------- the page quotes the same numbers ---------- */
ok(/\$4,000\+/.test(visible) && /\$4,060/.test(visible), "$4,000+ / $4,060 quoted");
ok(/up to 80%/.test(visible), "up to 80% quoted (month 12)");
ok(/\$435/.test(visible), "$435 anchor quoted");
ok(/data-out="ours">\$613</.test(html) && /data-out="theirs">\$2,475</.test(html) && /data-out="save">\$1,862</.test(html), "calculator's no-JS defaults match month 6");
ok(new RegExp('value="' + api.DEFAULT_MONTH + '"').test(html), "slider default = DEFAULT_MONTH");
var prices = visible.match(/\$\d+(?=\/mo| \/mo|\s*\/mo)/g) || [];
ok((visible.match(/\$59/g) || []).length >= 5, "$59 shown in hero, card, close, sticky, FAQ");
ok((visible.match(/\$69/g) || []).length >= 5, "$69 shown in hero, card, close, FAQ, anchor");
ok((visible.match(/\$17/g) || []).length >= 6, "$17 membership still disclosed lower on the page (pricing intro, why, savings, how, FAQ, close)");
ok(!/\$(149|299|1,086|25)\b/.test(visible), "no V2 (Sesame) prices left");
ok(/\$199/.test(visible) && /21-day/.test(visible), "annual billing + trial disclosed");

/* ---------- price first, membership below ---------- */
var hero = html.slice(html.indexOf('class="hero"'), html.indexOf('class="trust"'));
ok(hero.indexOf("price__meds") > -1 && !/\$17/.test(hero), "hero: medication prices only, no $17 membership line (Luis 2026-10-06 mark-up)");
ok(/class="price__memb"><span class="tag">21 days free<\/span>/.test(hero), "hero: the 21 days free tag sits where the membership line was");
ok(/<h1>[^<]*<b>\$59\/month<\/b><\/h1>/.test(hero), "hero h1 is the medication price");
var cards = html.match(/<article class="pcard[\s\S]*?<\/article>/g) || [];
ok(cards.length === 2, "two GLP-1 price cards (semaglutide, tirzepatide)");
cards.forEach(function (c, i) {
  ok(c.indexOf("pcard__price") > -1 && c.indexOf("pcard__memb") === -1 && !/membership from/.test(c.replace(/<dl[\s\S]*<\/dl>/, "")), "card " + i + ": med price, no membership line under it");
});
var sticky = html.slice(html.indexOf('data-sticky'), html.indexOf('</div>', html.indexOf('sticky__in')) + 6);
ok(/GLP&#8209;1s from \$59\/mo/.test(sticky) && !/\$17|membership/.test(sticky), "sticky bar: price only, no membership line");
ok(/<title>GLP-1s from \$59\/month \| Chime Health<\/title>/.test(html), "tab title without the membership price");
ok(/pcard__price"><b>\$59</.test(html) && /pcard__price"><b>\$69</.test(html), "card prices = PRICES.sema / PRICES.tirz");
ok(P.sema === 59 && P.tirz === 69 && P.membershipYear === 199, "PRICES constants");

/* ---------- client exclusions (screenshots 05 / 06) ---------- */
ok(!/class="docs/.test(html), "no providers grid section");
ok(!/Pick the best online weight loss doctor/i.test(visible), "providers heading gone");
ok(!/Provider choice/i.test(visible), "no Provider choice row");
ok(!/any provider|provider you choose|provider of your choice|choose your provider/i.test(visible), "no provider-choice claim anywhere");
ok(!/mark-?ups?/i.test(visible), "no markups claim");
ok(/<td class="y">Discounted medication<\/td>/.test(html), "compare: Discounted medication");
var rows = (html.match(/<tr><th scope="row">/g) || []).length;
ok(rows === 8, "compare table has 8 rows (V2's 9 minus Provider choice)");
ok(!/FDA-approved GLP/i.test(visible), "no 'FDA-approved GLP-1' claim for compounded meds");
ok(/not FDA-approved/.test(visible), "compounded disclaimer present");

/* ---------- CTAs ---------- */
var hrefs = (html.match(/<a class="btn[^"]*"[^>]*href="([^"]+)"/g) || []).map(function (a) { return a.match(/href="([^"]+)"/)[1]; });
ok(hrefs.length >= 10, "at least 10 CTA buttons (" + hrefs.length + ")");
ok(hrefs.every(function (h) { return h === "../chimeAssessment.html"; }), "every CTA opens ../chimeAssessment.html (camelCase)");
var labels = (html.match(/<a class="btn(?! btn--ghost)[^"]*"[^>]*>([^<]+)/g) || []).map(function (a) { return a.replace(/<[^>]+>/, "").trim(); });
ok(labels.filter(function (l) { return l === "See my price"; }).length >= 8, "one regular CTA label: See my price");

/* ---------- house rules ---------- */
ok(/<meta name="robots" content="noindex"/.test(html), "noindex");
ok(/css\/page\.css\?v=20260999/.test(html) && /js\/page\.js\?v=20260995/.test(html), "assets versioned (css 20260999, js 20260995)");
ok(!/eyebrow/.test(html), "no eyebrow labels");
ok(!/sesame|collective\.org|Thrive Market|Gunnar/i.test(text), "no competitor names in visible markup");
ok(fs.existsSync(path.join(__dirname, "..", "images", "hero-800.webp")), "hero image present");
var imgs = html.match(/src="images\/[^"?]+/g) || [];
imgs.forEach(function (s) { ok(fs.existsSync(path.join(__dirname, "..", s.slice(5))), "image exists: " + s.slice(5)); });

console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
