/* node chime-weight-loss-program/js/wlp-tests.js
   Checks the pure carousel/pricing helpers and the house rules on the page:
   no em dashes, no brand drug names, no eyebrow above a title, every CTA
   resolves, every flagged stand-in is visible, and the markup the script
   depends on is present. */

"use strict";

var fs = require("fs");
var path = require("path");
var api = require("./wlp.js");

var DIR = path.join(__dirname, "..");
var html = fs.readFileSync(path.join(DIR, "index.html"), "utf8");
var css = fs.readFileSync(path.join(DIR, "css", "wlp.css"), "utf8");
var js = fs.readFileSync(path.join(DIR, "js", "wlp.js"), "utf8");

var pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass += 1; return; }
  fail += 1;
  console.error("FAIL: " + name);
}
function eq(name, got, want) { ok(name + " (got " + JSON.stringify(got) + ")", got === want); }

/* ---------- 1. pure helpers ---------- */
eq("perView phone", api.perView(390), 2);
eq("perView tablet", api.perView(768), 3);
eq("perView desktop", api.perView(1440), 4);
eq("perViewQuotes phone", api.perViewQuotes(390), 1);
eq("perViewQuotes desktop", api.perViewQuotes(1440), 3);

eq("pageCount 6 by 4", api.pageCount(6, 4), 2);
eq("pageCount 6 by 2", api.pageCount(6, 2), 3);
eq("pageCount 4 by 4", api.pageCount(4, 4), 1);
eq("pageCount 0 items", api.pageCount(0, 4), 1);
eq("pageCount bad per", api.pageCount(6, 0), 1);

eq("clampPage low", api.clampPage(-3, 3), 0);
eq("clampPage high", api.clampPage(9, 3), 2);
eq("clampPage inside", api.clampPage(1, 3), 1);
eq("clampPage no pages", api.clampPage(2, 0), 0);

eq("fmt plain", api.fmt("249"), "$249");
eq("fmt thousands", api.fmt(1086), "$1,086");
eq("fmt junk", api.fmt("abc"), "");

ok("visibleFor match", api.visibleFor("featured glp1", "glp1"));
ok("visibleFor miss", !api.visibleFor("featured glp1", "combo"));
ok("visibleFor all", api.visibleFor("combo", "all"));
ok("visibleFor no filter", api.visibleFor("combo", ""));
ok("visibleFor is not a substring match", !api.visibleFor("featured", "feat"));

/* ---------- 2. house rules ---------- */
ok("no em dashes in html", html.indexOf("—") === -1);
ok("no em dashes in css", css.indexOf("—") === -1);
ok("no em dashes in js", js.indexOf("—") === -1);

// The head comment lists what was deliberately dropped and why, so every
// "is it gone" check runs against the body only.
var body = html.slice(html.indexOf("<body"));

["Wegovy", "Zepbound", "Ozempic", "Mounjaro", "Rybelsus", "Foundayo", "Saxenda", "Victoza"].forEach(function (brand) {
  ok("no brand name in the page body: " + brand, body.indexOf(brand) === -1);
});

ok("no Trustpilot in the body", body.indexOf("Trustpilot") === -1);
ok("no Sesame in the body", body.indexOf("Sesame") === -1);
ok("no before/after wording in the body", !/before\s*(and|&|\/)\s*after/i.test(body));

// Headline first: inside each section the first heading must precede any
// <p class="...lede..."> label, which is where an eyebrow would live.
var sections = html.split(/<section\b/).slice(1);
sections.forEach(function (sec, i) {
  var h = sec.search(/<h[123]\b/);
  var lede = sec.search(/class="[^"]*__lede/);
  ok("section " + (i + 1) + " puts its headline before any label", h !== -1 && (lede === -1 || h < lede));
});

/* ---------- 3. flagged stand-ins are visible ---------- */
ok("care price is a visible TBD", html.indexOf("$[TBD]") !== -1);
ok("results band carries a citation flag", html.indexOf("[CITATION TO CONFIRM]") !== -1);
ok("per-product claims are flagged", (html.match(/\[TO CONFIRM\]/g) || []).length >= 6);
ok("commercial FAQ answers are flagged", (html.match(/\[CLIENT TO CONFIRM\]/g) || []).length >= 4);
ok("clinician is flagged as a stand in", /Fictional physician/.test(html));
ok("reviews are flagged as illustrative", /illustrative/.test(html));
ok("safety copy is flagged for counsel", /REVIEWED BY COUNSEL/.test(html));
ok("tesamorelin off label use is flagged", /off label/.test(html));

/* ---------- 4. structure the script depends on ---------- */
ok("two rails", (html.match(/data-rail/g) || []).length === 2);
ok("two tracks", (html.match(/data-track/g) || []).length === 2);
ok("two dot holders", (html.match(/data-dots/g) || []).length === 2);
ok("three filter chips", (html.match(/class="chip[^"]*" type="button"/g) || []).length === 3);
ok("price mode select", html.indexOf("data-price-mode") !== -1);

var cards = html.match(/<li class="card"[^>]*>/g) || [];
ok("six treatment cards", cards.length === 6);
cards.forEach(function (c, i) {
  ok("card " + (i + 1) + " declares its categories", /data-cat="/.test(c));
  ok("card " + (i + 1) + " declares both prices", /data-p3="\d+"/.test(c) && /data-p1="\d+"/.test(c));
});
ok("every card has a price slot", (html.match(/ data-price>/g) || []).length === 6);
ok("every card has an expand button", (html.match(/class="more"/g) || []).length === 6);
ok("every expand button is wired to a panel", (html.match(/aria-controls="d-/g) || []).length === 6);
ok("every panel exists", (html.match(/class="detail" id="d-/g) || []).length === 6);

ok("ten FAQ rows", (html.match(/class="acc__q"/g) || []).length === 10);
ok("FAQ rows start closed", (html.match(/class="acc__q" aria-expanded="false"/g) || []).length === 10);
ok("comparison table has nine rows", (html.match(/<tr><th scope="row"/g) || []).length === 9);
ok("comparison marks every row yes and no", (html.match(/class="y"/g) || []).length === 9 && (html.match(/class="n"/g) || []).length === 9);
ok("six reviews", (html.match(/class="quote"/g) || []).length === 6);
ok("five journey steps", (html.match(/<li><h3>/g) || []).length === 5);

/* ---------- 5. CTAs and links ---------- */
var hrefs = (html.match(/href="([^"]+)"/g) || []).map(function (h) { return h.slice(6, -1); });
var assessment = hrefs.filter(function (h) { return /chimeAssessment\.html$/.test(h); });
ok("at least four CTAs open the assessment", assessment.length >= 4);
ok("assessment case matches the file on disk (Pages is case sensitive)",
  assessment.every(function (h) { return h === "../chimeAssessment.html"; }));
ok("the assessment page exists", fs.existsSync(path.join(DIR, "..", "chimeAssessment.html")));
ok("no link points at the reference site", !/sesamecare\.com/.test(body));

hrefs.filter(function (h) { return h.indexOf("../") === 0; }).forEach(function (h) {
  ok("local link resolves: " + h, fs.existsSync(path.join(DIR, h.split("#")[0])));
});

/* ---------- 6. assets ---------- */
var srcs = (html.match(/src="(images|fonts)\/[^"]+"/g) || []).map(function (s) { return s.slice(5, -1); });
srcs.concat(["fonts/quicksand-latin.woff2"]).forEach(function (s) {
  ok("asset exists: " + s, fs.existsSync(path.join(DIR, s)));
});
ok("every img declares width and height", (html.match(/<img\b/g) || []).length === (html.match(/<img[^>]*width="\d+"[^>]*height="\d+"/g) || []).length);
ok("the hero image is eager, the rest lazy", /fetchpriority="high"/.test(html) && (html.match(/loading="lazy"/g) || []).length >= 8);
ok("no Google Fonts request", !/fonts\.googleapis|fonts\.gstatic/.test(html) && !/fonts\.googleapis/.test(css));
ok("self hosted font is declared", /@font-face/.test(css) && /quicksand-latin\.woff2/.test(css));

/* ---------- 7. versioning and bookkeeping ---------- */
var vs = (html.match(/\?v=(\d+)/g) || []).map(function (v) { return v.slice(3); });
ok("both assets are cache busted", vs.length === 2);
ok("both use the same version", vs[0] === vs[1]);
ok("version is 20260955 or later", Number(vs[0]) >= 20260955);
ok("page is noindex", /name="robots" content="noindex"/.test(html));
ok("every section carries a screen label", (html.match(/data-screen-label/g) || []).length >= 11);

/* ---------- 8. accessibility basics ---------- */
ok("one h1", (html.match(/<h1\b/g) || []).length === 1);
ok("skip link", /class="skip"/.test(html));
ok("every img has alt", (html.match(/<img\b/g) || []).length === (html.match(/<img[^>]*\balt="/g) || []).length);
ok("decorative svgs are hidden", (html.match(/<svg class="ico"/g) || []).length === (html.match(/<svg class="ico" aria-hidden="true"/g) || []).length);
ok("expand buttons name themselves for screen readers", (html.match(/class="more"[\s\S]{0,220}?sr-only/g) || []).length === 6);
ok("the select has a label", /class="sr-only">Pricing shown/.test(html));
ok("reduced motion is handled", /prefers-reduced-motion/.test(css));

/* ---------- 9. the script never reads click.detail ---------- */
ok("script does not branch on click detail (the WebKit tap bug)", !/\.detail\b/.test(js));
ok("touch swipe is passive", (js.match(/passive: true/g) || []).length >= 2);

console.log((fail ? "FAILED " : "OK ") + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
