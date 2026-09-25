// node chime-price-lock-offer/js/offer-tests.js — checks for the price-lock offer clone: the brand swap is
// complete (nothing of TrimRX's name, links or trackers ships), everything else is the reference's, and every
// local file resolves. No DOM.
"use strict";
var fs = require("fs");
var path = require("path");

var DIR = path.join(__dirname, "..");
var html = fs.readFileSync(path.join(DIR, "index.html"), "utf8");
var css = fs.readFileSync(path.join(DIR, "css", "offer.css"), "utf8");
var page = html.replace(/<!--[\s\S]*?-->/g, "");
var cssCode = css.replace(/\/\*[\s\S]*?\*\//g, "");

var pass = 0, fail = 0;
function eq(actual, expected, label) {
  var ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) pass++; else { fail++; console.log("FAIL " + label + "\n  expected " + JSON.stringify(expected) + "\n  got      " + JSON.stringify(actual)); }
}
function count(re, s) { return (s.match(re) || []).length; }

// Brand swap
eq(count(/trim ?rx/gi, page), 0, "no TrimRX anywhere in the markup");
eq(count(/trim ?rx/gi, cssCode), 0, "no TrimRX in the stylesheet");
eq(/<title>[^<]*\| Chime Health<\/title>/.test(page), true, "title");
eq(count(/href="images\/favicon\.png"/g, page), 2, "Chime favicon + touch icon");

// Their links and trackers are gone; CTAs go to the Chime assessment
eq(count(/href="\.\.\/choose-treatment\/v3\.html"/g, page), 7, "every Lock the Price / Lock My Price Now → the Gold product page (both breakpoints)");
eq(count(/href="#">/g, page), 2, "Safety Information → # (both breakpoints)");
eq(/(src|href|srcset)="https?:/.test(page), false, "no external src/href");
eq(/url\(["']?https?:/.test(cssCode), false, "no external url() in the stylesheet");
eq(fs.readdirSync(path.join(DIR, "..", "choose-treatment")).indexOf("v3.html") > -1, true, "choose-treatment/v3.html exists with exact case");
["figpii", "mjkkj8trk", "EF.click", "events.framer", "bat.bing", "googletagmanager", "trustpilot", "framerusercontent",
 "fonts.gstatic", "<script", "modulepreload", "data-framer-hydrate"].forEach(function (w) {
  eq(page.indexOf(w) + cssCode.indexOf(w), -2, "no '" + w + "'");
});
eq(/noindex/.test(page), true, "noindex");

// Nothing else changed: their prices (as the price-lock link shows them), copy, colours and fonts
eq(count(/>\$179</g, page), 2, "GLP-1 $179 (desktop + phone; client 2026-09-25)");
eq(count(/>\$174</g, page), 0, "the old $174 is gone");
eq(count(/>\$279</g, page), 2, "GLP-1 + GIP $279 (desktop + phone)");
eq(count(/\$149|\$249/g, page), 0, "their built-in default prices replaced as the link shows");
["LIMITED-TIME PRICE LOCK OFFER", "START YOUR PLAN", "This price is available for a limited time.", "STATE", "LICENSED",
 "PHARMACY", "Your price stays put while you&#x27;re on this plan", "What you sign up for is what you pay.",
 "Lock My Price Now", "Ready when you are — lock in your price."].forEach(function (t) {
  eq(page.indexOf(t) > -1 || page.indexOf(t.replace("&#x27;", "'")) > -1, true, "copy kept: " + t);
});
eq(/rgb\(200, 16, 46\)/.test(page) && /rgb\(12, 36, 64\)/.test(page), true, "their red and navy");
eq(/font-family:\s*'Roboto Condensed'/.test(css) && /font-family:\s*"Inter";/.test(css), true, "their fonts");
eq(/framer-v-13dtk81:hover\{background-color:rgb\(245,29,65\)/.test(css), true, "their hover variants ported");
eq(/hidden-1as4yo6\{display:none/.test(cssCode) && /hidden-6n52y1\{display:none/.test(cssCode), true, "breakpoint switch (≥1200 / phone-tablet)");

// Every local asset resolves
var refs = [];
page.replace(/(?:src|href)="([^"#?]+)(?:\?[^"]*)?"/g, function (_, u) { if (!/^\.\.\//.test(u)) refs.push(u); });
css.replace(/url\(["']?([^"')]+)["']?\)/g, function (_, u) { if (!/^local\(|^data:/.test(u)) refs.push(path.join("css", u)); });
refs.forEach(function (u) { eq(fs.existsSync(path.join(DIR, u)), true, "asset exists: " + u); });
eq(count(/src="images\/[a-z0-9-]+\.webp"/g, page), 8, "all 8 images local (4 per breakpoint)");

var vs = {};
page.replace(/\?v=(\d+)/g, function (_, v) { vs[v] = 1; });
eq(Object.keys(vs).length, 1, "single ?v= value");

console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
