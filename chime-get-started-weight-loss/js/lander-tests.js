// node chime-get-started-weight-loss/js/lander-tests.js — checks for the get-started clone:
// the brand swap is complete (nothing of WellMedoc's name, links, phone, certificate or
// trackers ships), everything else is the reference's, and every local file resolves. No DOM.
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
["images/logo-header.webp", "images/logo-footer.webp", "images/warranty-badge.webp", "images/hero-offer.webp",
 "images/refills-van.webp", "images/clinician-phone.webp", "images/legitscript.webp"].forEach(function (f) {
  eq(page.indexOf('src="' + f + '"') > -1, true, "brand-swapped art used: " + f);
});
eq(count(/src="images\/warranty-badge\.webp"/g, page), 2, "warranty seal in both gold cards (the third is inside the hero art)");

// Their links, phone and certificate are gone; CTAs go to the Chime assessment
eq(count(/intake\.wellmedr|legitscript\.com|tel:/g, page), 0, "no intake, LegitScript checker or tel: link");
eq(count(/1-888-397-6905/g, page), 0, "their phone number removed");
eq(count(/1-XXX-XXX-XXXX/g, visible), 2, "phone placeholder in the footer pill and the legal block");
eq(count(/href="\.\.\/chimeAssessment\.html"/g, page), 3, "anchor CTAs → assessment (header, hero, phone bar)");
eq(count(/window\.location\.href='\.\.\/chimeAssessment\.html'/g, page), 6, "button CTAs → assessment");
eq(/(src|href)="https?:/.test(page), false, "no external src/href");
eq(fs.existsSync(path.join(DIR, "..", "chimeAssessment.html")), true, "assessment exists with exact case");
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
