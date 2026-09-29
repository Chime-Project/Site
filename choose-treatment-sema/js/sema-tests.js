// node choose-treatment-sema/js/sema-tests.js — checks for the one-product (Semaglutide-only) selection pages and their
// checkouts (client call "requestClient.mp4", 2026-09-29): burn-boost.html (Semaglutide + NAD+) and deep-belly-burn.html
// (Semaglutide + Tesamorelin) are choose-treatment/v4.html and v6.html less the Tirzepatide card, and every Semaglutide
// figure and string is theirs. No DOM: the card comes from choose-treatment's renderer, the checkout summary from its
// plan-fill.js.
"use strict";
var fs = require("fs");
var path = require("path");

var DIR = path.join(__dirname, "..");
var CT = path.join(DIR, "..", "choose-treatment");
var R = require(path.join(CT, "js", "checkout.js"));
var P = require(path.join(CT, "checkout", "js", "plan-fill.js"));

var pass = 0, fail = 0;
function eq(actual, expected, label) {
  var ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) pass++; else { fail++; console.log("FAIL " + label + "\n  expected " + JSON.stringify(expected) + "\n  got      " + JSON.stringify(actual)); }
}
function strip(s) { return s.replace(/<!--[\s\S]*?-->/g, ""); }
function refs(page) {
  var out = [];
  page.replace(/(?:src|href)="([^"#?:]+)(?:\?[^"]*)?"/g, function (_, u) { out.push(u); });
  return out;
}
function fresh(file) { delete require.cache[require.resolve(file)]; return require(file); }

[
  { slug: "burn-boost", v: 4, name: "Burn & Boost", bonus: "NAD+", code: "FREENAD", pair: "nad",
    heading: "Choose Your Burn &amp; Boost Treatment", sub: "Weight Loss and All Day Energy" },
  { slug: "deep-belly-burn", v: 6, name: "Deep Belly Burn", bonus: "Tesamorelin", code: "FREETESA", pair: "tesa",
    heading: "Choose Your Deep Belly Burn Treatment", sub: "Weight Loss &amp; Stubborn Visceral Belly Fat" }
].forEach(function (c) {
  var L = c.slug + " ";
  var D = fresh(path.join(__dirname, "plans-data-" + c.slug + ".js"));
  var SRC = fresh(path.join(CT, "js", "plans-data-v" + c.v + ".js"));

  // data: the Semaglutide entry alone, v4's / v6's to the letter but for the image path
  eq(D.treatments.map(function (t) { return t.key; }), ["sema"], L + "one product: Semaglutide");
  var t = D.treatments[0], src = SRC.treatments.filter(function (x) { return x.key === "sema"; })[0];
  var srcCopy = JSON.parse(JSON.stringify(src));
  srcCopy.image = "../choose-treatment/" + src.image;
  eq(t, srcCopy, L + "the Semaglutide entry is v" + c.v + "'s");
  eq([t.name, t.checkoutName, t.tagline], [c.name, c.name + " Plan", "Compounded Semaglutide and " + c.bonus + " - in one plan"], L + "names");
  eq(fs.existsSync(path.join(DIR, t.image)), true, L + "card image exists: " + t.image);
  eq(t.image.split("/").pop(), "semaglutide-" + c.pair + ".webp", L + "card image = Semaglutide + " + c.bonus);
  eq([D.checkoutHref, D.productHref], ["checkout-" + c.slug + "/", "../" + c.slug + ".html"], L + "hrefs");
  eq(Object.keys(D.checkoutOffer.images), ["sema"], L + "checkout image for sema only");
  var rest = function (d) { var o = JSON.parse(JSON.stringify(d)); delete o.treatments; delete o.checkoutHref; delete o.productHref; delete o.checkoutOffer.images; return o; };
  eq(rest(D), rest(SRC), L + "every other setting is v" + c.v + "'s");
  eq([t.plans.sixMonth.price, t.plans.sixMonth.totalPrice, t.plans.threeMonth.price, t.plans.threeMonth.totalPrice, t.plans.monthly.price],
     [199, 1194, 249, 747, 299], L + "ladder $199 / $1,194 · $249 / $747 · $299");

  // the card as the renderer draws it
  var card = R.renderTreatmentCard(t, D);
  eq(/Tirzepatide|Plus/.test(card), false, L + "no Tirzepatide on the card");
  var plans = []; card.replace(/data-plan="(\w+)"/g, function (_, p) { plans.push(p); });
  eq(plans, ["sixMonth", "threeMonth", "monthly"], L + "3 plan buttons, 6 / 3 / 1 months");
  eq(["sixMonth", "threeMonth", "monthly"].map(function (p) { return R.checkoutUrl(D.checkoutHref, "sema", p); }),
     ["checkout-" + c.slug + "/?med=sema&term=6", "checkout-" + c.slug + "/?med=sema&term=3", "checkout-" + c.slug + "/?med=sema&term=1"],
     L + "buttons open this folder's checkout");
  ["$199", "$1,194", "$249", "$747", "$299"].forEach(function (f) { eq(card.indexOf(f) >= 0, true, L + "card shows " + f); });

  // the page
  var html = fs.readFileSync(path.join(DIR, c.slug + ".html"), "utf8"), page = strip(html);
  refs(page).forEach(function (u) { eq(fs.existsSync(path.join(DIR, u)), true, L + "asset exists: " + u); });
  eq(/Tirzepatide|Plus|v[0-9]\.html/.test(page), false, L + "no Tirzepatide, no link to the two-product page");
  eq(page.indexOf("<title>" + c.heading + " | Chime Health</title>") >= 0 && page.indexOf(">" + c.heading + "</h1>") >= 0, true, L + "title + heading");
  eq(page.indexOf(">" + c.sub + "</p>") >= 0, true, L + "subtitle");
  eq(page.indexOf('<div class="text-center mb-4 md:mb-6" data-screen-label="CT Title">') >= 0, true, L + "title shown on the phone too");
  eq(page.indexOf('<div class="hidden" data-screen-label="CT Select">') >= 0 && page.indexOf('id="ct-selector"') >= 0, true, L + "one-option selector hidden, still mounted");
  eq(/#ct-grid \{ display: block; max-width: calc\(\(100% - 1\.5rem\) \/ 2\); margin: 0 auto; \}/.test(page), true, L + "single card centred at the two-column width");
  eq(page.indexOf('src="js/plans-data-' + c.slug + '.js?v=20260974"') >= 0, true, L + "its data at ?v=20260974");
  eq(strip(fs.readFileSync(path.join(CT, "v" + c.v + ".html"), "utf8")).split("\n").length, page.split("\n").length - 4, L + "= v" + c.v + ".html + the 4-line style block");

  // the checkout
  var dir = path.join(DIR, "checkout-" + c.slug), chtml = fs.readFileSync(path.join(dir, "index.html"), "utf8"), cpage = strip(chtml);
  eq(fs.readdirSync(dir), ["index.html"], L + "checkout holds only its page");
  refs(cpage).forEach(function (u) { eq(fs.existsSync(path.join(dir, u)), true, L + "checkout asset exists: " + u); });
  var same = function (s) { return strip(s).replace(/\.\.\/\.\.\/choose-treatment\/checkout\//g, "../checkout/").replace(/plans-data-[\w-]+\.js/, "DATA").replace(/\?v=\d+/g, ""); };   // scripts: the same files, v4's at an older ?v=
  eq(same(chtml), same(fs.readFileSync(path.join(CT, "checkout-v" + c.v, "index.html"), "utf8")), L + "checkout = checkout-v" + c.v + " with this folder's data");
  eq(cpage.indexOf('src="../js/plans-data-' + c.slug + '.js?v=20260974"') >= 0, true, L + "checkout loads this folder's data");
  var expect = {   // title, plan box, per day, price, crossed-out, crossed shown, no-coupon total, no-coupon per day
    1: [c.name + " Plan", "Monthly", "$9.97", "$299", "$299", false, "$598", "$19.93"],
    3: [c.name + " Plan", "3 Months", "$8.30", "$747", "$897", true, "$1,046", "$11.62"],
    6: [c.name + " Plan", "6 Months", "$6.63", "$1,194", "$1,794", true, "$1,493", "$8.29"]
  };
  Object.keys(expect).forEach(function (term) {
    var s = P.summaryFor(D, "sema", +term), e = expect[term];
    eq([s.title, s.offer.termLabel, s.perDay, s.total, s.crossed, s.offer.showCrossed, s.offer.totalNoCoupon, s.perDayNoCoupon], e, L + "checkout " + term + "-month");
    eq([s.badge, s.code, s.offer.bonusLabel, s.offer.removedLabel, s.alt, s.image.split("/").pop()],
       ["+ FREE " + c.bonus + " ($299 value)", c.code, "BONUS: " + c.bonus + " - both products, one price", c.bonus,
        c.name + " Plan - GLP-1 and " + c.bonus + " vials", "semaglutide-" + c.pair + "-amber.webp"], L + "offer " + term + "-month");
    eq(fs.existsSync(path.join(CT, "checkout", "images", s.image.split("/").pop())), true, L + "checkout vial exists " + term);
  });
  eq(P.summaryFor(D, "tirz", 3), null, L + "no Tirzepatide plan: a stale ?med=tirz falls back to Semaglutide");
  eq(P.pick("?med=tirz&term=3", null), { med: "tirz", term: 3 }, L + "(the fallback is plan-fill's default, sema 3)");
  eq(P.summaryFor(D, "sema", 12), null, L + "no 12-month plan");
});

console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
