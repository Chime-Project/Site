// node chime-get-started-glp-nad/js/lander-tests.js — checks for the GLP + NAD+ lander (client doc "glp plus nad
// gold pages - 2 product selection versions.docx", 2026-09-28), a new version of chime-get-started-weight-loss/:
// the doc's edits are all in, none of the Microdose offer is left, the brand swap still holds (nothing of
// WellMedoc's name, links, phone, certificate or trackers ships), and every local file resolves. No DOM.
"use strict";
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");

var DIR = path.join(__dirname, "..");
var html = fs.readFileSync(path.join(DIR, "index.html"), "utf8");
var css = fs.readFileSync(path.join(DIR, "css", "lander.css"), "utf8");
var js = fs.readFileSync(path.join(__dirname, "lander.js"), "utf8");
var page = html.replace(/<!--[\s\S]*?-->/g, "");
// visible surface: text nodes + alt/title/href/src/onclick values (class names are not visible)
var visible = page.replace(/\sclass="[^"]*"/g, "");

var pass = 0, fail = 0;
function eq(actual, expected, label) {
  var ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) pass++; else { fail++; console.log("FAIL " + label + "\n  expected " + JSON.stringify(expected) + "\n  got      " + JSON.stringify(actual)); }
}
function count(re, s) { return (s.match(re) || []).length; }

// Brand swap
eq(count(/well ?med(oc|r)/gi, visible), 0, "no WellMedoc / wellmedr in text, alt, title, links or image paths");
eq(count(/well ?med(oc|r)/gi, js), 0, "no WellMedoc in the script");
eq(count(/wellmedr\.com/gi, css.replace(/\/\*[\s\S]*?\*\//g, "")), 0, "no wellmedr.com URL in the stylesheet");
eq(count(/Chime Health/g, visible) >= 18, true, "Chime Health in place of every brand mention");
eq(visible.indexOf("© 2026 Chime Health") > -1, true, "copyright line");
eq(visible.indexOf("Is Chime Health legitimate?") > -1, true, "FAQ question renamed");
eq(/<title>[^<]*\| Chime Health<\/title>/.test(page), true, "title");
["images/logo-header.webp", "images/logo-footer.webp", "images/warranty-badge.webp", "images/hero-glp-nad.webp",
 "images/refills-van.webp", "images/clinician-phone.webp", "images/legitscript.webp"].forEach(function (f) {
  eq(page.indexOf('src="' + f + '"') > -1, true, "brand-swapped art used: " + f);
});
eq(count(/src="images\/warranty-badge\.webp"/g, page), 2, "warranty seal in both gold cards (the third is inside the hero art)");

// Their links, phone and certificate are gone; CTAs go to the product selection, version 1 (v4.html)
eq(count(/intake\.wellmedr|legitscript\.com|tel:/g, page), 0, "no intake, LegitScript checker or tel: link");
eq(count(/1-888-397-6905/g, page), 0, "their phone number removed");
eq(count(/1-XXX-XXX-XXXX/g, visible), 2, "phone placeholder in the footer pill and the legal block");
eq(count(/href="\.\.\/choose-treatment\/v4\.html"/g, page), 3, "anchor CTAs → the plans (header, hero, phone bar)");
eq(count(/window\.location\.href='\.\.\/choose-treatment\/v4\.html'/g, page), 6, "button CTAs → the plans");
eq(/(href="|href=')[^"']*chimeAssessment/.test(page), false, "no link to the assessment");
eq(/(src|href)="https?:/.test(page), false, "no external src/href");
eq(fs.existsSync(path.join(DIR, "..", "choose-treatment", "v4.html")), true, "the plan page exists with exact case");

// The GLP + NAD+ version (client doc, 2026-09-28)
[["BONUS: <strong>FREE NAD+ ($299 VALUE)</strong>", "banner"],
 ["<h1>See if you qualify for this special GLP/NAD+ offer</h1>", "hero title"],
 ["<div>Your Complete GLP-1 and NAD+ Program Starts Today</div>", "hero box title"],
 ["<h3>Choose Your GLP Medication</h3>", "plans title"],
 ['<h2 class="plan-title">Burn &amp; Boost Plus</h2>', "Tirzepatide card name"],
 ['<h2 class="plan-title">Burn &amp; Boost</h2>', "Semaglutide card name"],
 ['<p class="plan-description">Compounded GLP-1+GIP &amp; NAD+ - both in one plan</p>', "Tirzepatide description"],
 ['<p class="plan-description">Compounded GLP-1 &amp; NAD+ - both in one plan</p>', "Semaglutide description"],
 ['<span class="badge green">⭐ For those looking to lose 20+lbs</span>', "Tirzepatide pill"],
 ['<span class="badge gray">⭐ For those looking to lose up to 20lbs</span>', "Semaglutide pill"],
 ['$359 a <span class="price-note">month</span>', "Tirzepatide starting price"],
 ['$299 a <span class="price-note">month</span>', "Semaglutide starting price"],
 ["New Customer Offer: FREE NAD+ ($299 Value)", "offer band title"],
 ["<p>Join today to receive your free NAD+!</p>", "offer band line"]
].forEach(function (c) { eq(page.indexOf(c[0]) > -1, true, "glp + nad: " + c[1]); });
eq(count(/<li>✔ Free NAD\+ to support energy, focus and recovery while you lose<\/li>\s*<li>✔ Cancel or change anytime<\/li>/g, page), 2, "the NAD+ tick sits above \"Cancel or change anytime\" on both cards");
eq(/Microdose|\$(49|89|99|119|129|149|150)\b|Most Affordable Entry|Applied at Checkout|lock in \$150/.test(page), false, "none of the Microdose offer left");
["hero-glp-nad", "tirzepatide-nad-plan", "semaglutide-nad-plan"].forEach(function (f) {
  eq(page.indexOf('src="images/' + f + '.webp"') > -1, true, "GLP + NAD+ art used: " + f);
});
eq(count(/src="images\/hero-glp-nad\.webp"/g, page), 2, "the hero art on desktop and phone");
eq(/src="images\/(hero-offer|semaglutide-plan|compounded-glp-1)[-a-z]*\.webp"|plan-amber/.test(page), false, "no single-vial photo left");
var chimeSeal = crypto.createHash("md5").update(fs.readFileSync(path.join(DIR, "..", "chime-weight-loss-lp", "images", "legitscript.png"))).digest("hex");
eq(chimeSeal, "697d329a6658ba1ec251c0ae24c12e12", "the LegitScript mark source is Chime's");

// Nothing else changed: their colours and fonts are still the page's
eq(/194,\s*155,\s*93|#c29b5d/i.test(css), true, "their gold is untouched");
eq(/Outfit/.test(css) && /Assistant/.test(css), true, "their fonts");
eq(count(/Ozempic|Zepbound/g, visible) >= 2, true, "brand comparison cards kept as the reference has them");

// No trackers, no Shopify runtime, no third-party fonts
["stackadapt", "googletagmanager", "gtag(", "klaviyo", "shopify-analytics", "Shopify.", "fbq(", "fonts.googleapis", "fonts.gstatic", "cdn.shopify", "jsdelivr"].forEach(function (w) {
  eq(page.indexOf(w) + css.indexOf(w) + js.indexOf(w), -3, "no '" + w + "'");
});
eq(/noindex/.test(page), true, "noindex");

// The reference's two behaviours are present
eq(/\.faq-question/.test(js) && /steps-line-top/.test(js), true, "FAQ accordion + steps timeline scripts");

// Every local asset resolves
var refs = [];
page.replace(/(?:src|href)="([^"#?]+)(?:\?[^"]*)?"/g, function (_, u) { if (!/^\.\.\//.test(u)) refs.push(u); });
css.replace(/url\(["']?([^"')]+)["']?\)/g, function (_, u) { refs.push(path.join("css", u)); });
refs.forEach(function (u) { eq(fs.existsSync(path.join(DIR, u)), true, "asset exists: " + u); });
var up = [];
page.replace(/href="(\.\.\/[^"#?]+)"/g, function (_, u) { up.push(u); });
up.forEach(function (u) { eq(fs.existsSync(path.join(DIR, u)), true, "Chime page exists: " + u); });

var vs = {};
page.replace(/\?v=(\d+)/g, function (_, v) { vs[v] = 1; });
eq(Object.keys(vs).length, 1, "single ?v= value");

console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
