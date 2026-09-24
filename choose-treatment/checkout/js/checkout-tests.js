// node choose-treatment/checkout/js/checkout-tests.js — checks for the WellMedoc checkout rip (Chime branding, their colours):
// the brand swap is complete, nothing of theirs ships (links, phone, trackers, Stripe), no personal data from the
// client's link exists anywhere, the card form cannot take a payment, their states are all there, and every local
// file resolves. No DOM.
"use strict";
var fs = require("fs");
var path = require("path");

var DIR = path.join(__dirname, "..");
var html = fs.readFileSync(path.join(DIR, "index.html"), "utf8");
var css = fs.readFileSync(path.join(DIR, "css", "checkout.css"), "utf8");
var js = fs.readFileSync(path.join(__dirname, "checkout.js"), "utf8");
var page = html.replace(/<!--[\s\S]*?-->/g, "");
var cssCode = css.replace(/\/\*[\s\S]*?\*\//g, "");

var pass = 0, fail = 0;
function eq(actual, expected, label) {
  var ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) pass++; else { fail++; console.log("FAIL " + label + "\n  expected " + JSON.stringify(expected) + "\n  got      " + JSON.stringify(actual)); }
}
function count(re, s) { return (s.match(re) || []).length; }

// No personal data from the client's link, in any file of the folder (comments included). Checked by pattern so
// this file never has to spell the data out: no e-mail address but the form's placeholder, none of the link's fields.
var all = "";
(function walk(d) {
  fs.readdirSync(d).forEach(function (f) {
    var p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(html|css|js|md)$/.test(f) && f !== "checkout-tests.js") all += fs.readFileSync(p, "utf8");  // this file holds only the patterns
  });
})(DIR);
var emails = (all.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/gi) || []).filter(function (e) { return e !== "you@example.com" && e !== "noreply@anthropic.com"; });
eq(emails, [], "no e-mail address but the placeholder");
eq(/userid=|[?&]email=|addressl[12]=|firstName=|lastName=|[?&]zip=/.test(all), false, "none of the link's personal fields");

// Brand swap
eq(count(/well ?med(oc|r)/gi, page), 0, "no WellMedoc / Wellmedr in the markup");
eq(count(/well ?med(oc|r)/gi, cssCode + js.replace(/\/\*[\s\S]*?\*\//g, "")), 0, "none in the CSS or JS");
eq(count(/Chime Health/g, page) >= 10, true, "Chime Health in place of the name");
eq(/<title>Checkout \| Chime Health<\/title>/.test(page), true, "title");
eq(count(/src="images\/logo-chime\.svg"/g, page), 1, "Chime logo");
eq(count(/src="images\/seal-gold\.webp"/g, page) >= 3, true, "the seal with the Chime wordmark in place of theirs");
eq(count(/src="images\/semaglutide-amber\.webp"/g, page) >= 2, true, "the amber Chime vial in the plan card");
eq(page.indexOf('src="images/refills-van.webp"') > -1, true, "the repainted van");
eq(count(/1-XXX-XXX-XXXX/g, page), 1, "phone placeholder");

// Their links, phone, trackers and Stripe are gone
eq(/tel:|iframe|js\.stripe\.com|StripeElement[^"]*__Private/.test(page), false, "no call link, iframe or Stripe");
eq(/(src|href)="https?:/.test(page), false, "no external src/href");
["posthog", "googletagmanager", "gtag(", "revoffers", "criteo", "mathtag", "doubleclick", "maps.googleapis", "stackadapt",
 "_next/", "fonts.googleapis", "openloophealth"].forEach(function (w) {
  eq(page.indexOf(w) + cssCode.indexOf(w) + js.indexOf(w), -3, "no '" + w + "'");
});
eq(count(/href="\.\.\/\.\.\/(terms-conditions|privacy-policy|telehealth-consent)\.html"/g, page) >= 8, true, "legal links → Chime pages");
["terms-conditions", "privacy-policy", "telehealth-consent"].forEach(function (f) {
  eq(fs.existsSync(path.join(DIR, "..", "..", f + ".html")), true, "Chime page exists: " + f);
});
eq(/noindex/.test(page), true, "noindex");

// The card form cannot take a payment
var pe = page.slice(page.indexOf('data-co="card-form"'), page.indexOf("co-pe-mandate"));
eq(count(/<input\b/g, pe), 4, "card look-alike: 4 fields");
eq(/\sname="/.test(pe), false, "card fields have no names");
eq(/<form\b[^>]*\saction=/.test(page), false, "no form action");
eq(/addEventListener\("submit", function \(e\) \{ e\.preventDefault\(\); \}\)/.test(js), true, "submit does nothing");
eq(/fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage/.test(js), false, "the script sends and stores nothing");
eq(page.indexOf("By subscribing, you authorize Chime Health") > -1, true, "mandate line renamed");

// Their states are all there (coupon, reviews, accordions) with their prices
eq(page.indexOf('<template id="co-summary-applied">') > -1 && page.indexOf('<template id="co-summary-removed">') > -1, true, "coupon states");
[0, 1, 2, 3].forEach(function (n) { eq(page.indexOf('<template id="co-review-' + n + '">') > -1, true, "review " + (n + 1)); });
var removed = page.slice(page.indexOf('<template id="co-summary-removed">'));
removed = removed.slice(0, removed.indexOf("</template>"));
eq(removed.indexOf("$317") > -1 && removed.indexOf("Redeem") > -1 && removed.indexOf("200off applied") === -1, true, "no-coupon state: $317 + Redeem");
eq(count(/\$267/g, page) >= 4 && count(/\$467/g, page) >= 4, true, "their prices ($467 → $267)");
eq(count(/<div class="mt-4 space-y-4" hidden>/g, page), 2, "two phone accordions, closed");
eq(/Invalid or expired coupon code/.test(js) && /200OFF/.test(js), true, "Redeem: 200OFF or their error");

// Their colour theme stays (client 2026-09-24), with Chime's font
eq(/font-family:"Quicksand"/.test(css) && /--font-outfit:"Quicksand"/.test(cssCode), true, "Quicksand");
eq(/Outfit/.test(cssCode.replace(/--font-outfit/g, "")), false, "no Outfit face");
eq(/193 159 104/.test(cssCode), true, "their gold");
eq(/38 175 89/.test(cssCode), true, "their green");
eq(/123, 149, 169/.test(cssCode) && /12, 38, 49/.test(cssCode), true, "their grey-blue button and its hover");
eq(/65 54 42/.test(cssCode), true, "their brown ink");
eq(/255, 223, 173/.test(page) && /239, 200, 138/.test(page), true, "their gold benefits card");
eq(/101 128 188|50 69 99/.test(cssCode), false, "no Chime palette remap");

// Every local asset resolves
var refs = [];
page.replace(/(?:src|href)="([^"#?]+)(?:\?[^"]*)?"/g, function (_, u) { if (!/^\.\.\//.test(u)) refs.push(u); });
css.replace(/url\(["']?([^"')]+)["']?\)/g, function (_, u) { refs.push(path.join("css", u)); });
refs.forEach(function (u) { eq(fs.existsSync(path.join(DIR, u)), true, "asset exists: " + u); });
var vs = {};
page.replace(/\?v=(\d+)/g, function (_, v) { vs[v] = 1; });
eq(Object.keys(vs).length, 1, "single ?v= value");

console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
