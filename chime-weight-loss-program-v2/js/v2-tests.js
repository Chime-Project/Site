/* node chime-weight-loss-program-v2/js/v2-tests.js
   V2 follows the reference's design and copy, so the house rules that shape
   the Chime pages (no eyebrow above a title, Chime's own copy) deliberately do
   not apply here. What IS checked: the four things that could not be copied
   stayed out, the structure the script needs is present, and nothing links or
   refers back to the source company. */

"use strict";

var fs = require("fs");
var path = require("path");
var api = require("./v2.js");

var DIR = path.join(__dirname, "..");
var html = fs.readFileSync(path.join(DIR, "index.html"), "utf8");
var css = fs.readFileSync(path.join(DIR, "css", "v2.css"), "utf8");
var js = fs.readFileSync(path.join(DIR, "js", "v2.js"), "utf8");
var body = html.slice(html.indexOf("<body"));

var pass = 0, fail = 0;
function ok(name, cond) { if (cond) { pass += 1; return; } fail += 1; console.error("FAIL: " + name); }
function eq(name, got, want) { ok(name + " (got " + JSON.stringify(got) + ")", got === want); }

/* 1. helpers */
eq("perView desktop", api.perView(1440), 4);
eq("perView phone", api.perView(390), 2);
eq("pageCount 6 by 4", api.pageCount(6, 4), 2);
eq("clampPage high", api.clampPage(9, 3), 2);
eq("fmt thousands", api.fmt(1086), "$1,086");
ok("visibleFor match", api.visibleFor("featured oral", "oral"));
ok("visibleFor miss", !api.visibleFor("featured oral", "glp1"));

/* 2. the four deliberate departures */
ok("source company name is absent from the body", !/sesame/i.test(body));
ok("source company name is absent from the css", !/sesame/i.test(css));
ok("no link to the source site", !/sesamecare/i.test(html));
["Wegovy", "Zepbound", "Ozempic", "Mounjaro", "Rybelsus", "Foundayo", "Saxenda", "Victoza", "Trulicity"].forEach(function (b) {
  ok("brand drug name absent from the body: " + b, body.indexOf(b) === -1);
});
ok("no FDA approved seal claim on the cards", !/FDA[- ]approved/i.test(body.slice(body.indexOf("V2 Meds"), body.indexOf("V2 Journey"))));
ok("no Trustpilot", !/trustpilot/i.test(body));
ok("LegitScript stands in for the rating", /LegitScript certified/.test(body));

/* the provider roster must be fictional, so none of the real names survive */
["Maninder Kaur", "Muhammad Usman", "Shola Akinfiresoye", "Ngono Elonge", "Rajeshwary Nair",
 "Liselotte Addea-Amoako", "Milan Radojicic", "Georgiette Brown"].forEach(function (n) {
  ok("real clinician name absent: " + n, body.indexOf(n) === -1);
});
ok("provider grid is present", (html.match(/class="doc"/g) || []).length >= 20);

/* 3. the page says what it is */
ok("footer flags the page as a design reference", /design reference built from a competitor layout/.test(body));
ok("head comment flags the commercial terms", /NONE OF IT IS APPROVED/.test(html));
ok("page is noindex", /name="robots" content="noindex"/.test(html));

/* 4. structure the script needs */
ok("two rails", (html.match(/data-rail/g) || []).length === 2);
ok("two tracks", (html.match(/data-track/g) || []).length === 2);
ok("three chips", (html.match(/class="chip[^"]*" type="button"/g) || []).length === 3);
ok("price mode select", html.indexOf("data-price-mode") !== -1);
var cards = html.match(/<li class="card"[^>]*>/g) || [];
ok("six medication cards", cards.length === 6);
cards.forEach(function (c, i) {
  ok("card " + (i + 1) + " declares both prices", /data-cash="\d+"/.test(c) && /data-ins="\d+"/.test(c));
});
ok("every card has a price slot", (html.match(/ data-price>/g) || []).length === 6);
ok("every card has an expand button", (html.match(/class="more"/g) || []).length === 6);
ok("every panel exists", (html.match(/class="detail" id="d/g) || []).length === 6);
ok("fifteen FAQ rows, as the reference has", (html.match(/class="acc__q"/g) || []).length === 15);
ok("FAQ rows start closed", (html.match(/class="acc__q" aria-expanded="false"/g) || []).length === 15);
ok("nine comparison rows", (html.match(/<tr><th scope="row"/g) || []).length === 9);
ok("seven reviews, as the reference has", (html.match(/class="quote"/g) || []).length === 7);
ok("five journey steps", (html.match(/<li><h4>/g) || []).length === 5);
ok("three result cards", (html.match(/class="res__card"/g) || []).length === 3);

/* 5. the reference's measured design is what the sheet declares */
ok("primary purple", css.indexOf("#5921cf") !== -1);
ok("result-card green", css.indexOf("#219f63") !== -1);
ok("chip fill", css.indexOf("#eee9fa") !== -1);
ok("grey band", css.indexOf("#f5f5f6") !== -1);
ok("1156px column", /--max:\s*1156px/.test(css));
ok("h1 is 48/60 on desktop", /h1 \{ font-size: 48px; line-height: 60px; \}/.test(css));
ok("h2 is 28/36 on desktop", /h2 \{ font-size: 28px; line-height: 36px; \}/.test(css));
// The header comment names the reference's two licensed faces to explain why
// they are absent, so check the declarations rather than the whole file.
var fontDecls = (css.match(/--(?:font|serif):[^;]+;/g) || []).join(" ");
ok("font declarations exist", fontDecls.length > 0);
ok("no licensed face is declared", !/Saans|Concrette/.test(fontDecls));
ok("no font file is shipped or fetched", !/\.woff2?/.test(css) && !/@font-face/.test(css));
ok("no third-party font request", !/fonts\.googleapis|fonts\.gstatic/.test(html) && !/@import/.test(css));

/* 6. links and assets */
var hrefs = (html.match(/href="([^"]+)"/g) || []).map(function (h) { return h.slice(6, -1); });
hrefs.filter(function (h) { return h.indexOf("../") === 0; }).forEach(function (h) {
  ok("local link resolves: " + h, fs.existsSync(path.join(DIR, h.split("#")[0])));
});
ok("CTAs open the assessment", hrefs.filter(function (h) { return h === "../chimeAssessment.html"; }).length >= 4);
(html.match(/src="images\/[^"]+"/g) || []).map(function (s) { return s.slice(5, -1); }).forEach(function (s) {
  ok("asset exists: " + s, fs.existsSync(path.join(DIR, s)));
});
ok("every img has alt", (html.match(/<img\b/g) || []).length === (html.match(/<img[^>]*\balt="/g) || []).length);
ok("every img declares width and height", (html.match(/<img\b/g) || []).length === (html.match(/<img[^>]*width="\d+"[^>]*height="\d+"/g) || []).length);

/* 7. versioning and taps */
var vs = (html.match(/\?v=(\d+)/g) || []).map(function (v) { return v.slice(3); });
ok("both assets cache busted at the same version", vs.length === 2 && vs[0] === vs[1]);
ok("version is 20260956 or later", Number(vs[0]) >= 20260956);
ok("script does not branch on a click's detail", !/\.detail\b/.test(js));
ok("every section carries a screen label", (html.match(/data-screen-label/g) || []).length >= 11);

console.log((fail ? "FAILED " : "OK ") + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
