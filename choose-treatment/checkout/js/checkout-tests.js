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

// Shipping Information in place of their Email box (client, 2026-09-25, "checkout page address addition.docx")
var shipAt = page.indexOf('data-co="shipping"');
var ship = page.slice(shipAt, page.indexOf("Payment Method"));
eq(shipAt > page.indexOf(">OR<") && shipAt < page.indexOf("Payment Method"), true, "shipping sits between OR and Payment Method");
eq(/<h2 class="text-xl font-semibold text-secondary-500 mb-4">Shipping Information<\/h2>/.test(ship), true, "heading in the Payment Method style");
var labels = [];
ship.replace(/<span class="co-pe-label">([^<]+)<\/span>/g, function (_, l) { labels.push(l); });
eq(labels, ["First name", "Last name", "Address line 1", "Address line 2", "City", "State", "ZIP code", "Phone number", "Email"], "the reference's fields, in its order");
eq(count(/<input\b/g, ship) + count(/<select\b/g, ship), 9, "9 controls");
eq(/\sname="|<form\b/.test(ship), false, "shipping fields have no names and no form of their own");
var acs = [];
ship.replace(/autocomplete="([^"]+)"/g, function (_, a) { acs.push(a); });
eq(acs, ["given-name", "family-name", "address-line1", "address-line2", "address-level2", "address-level1", "postal-code", "tel-national", "email"], "autofill hints");
eq(ship.indexOf('placeholder="Apt., suite, unit number, etc. (optional)"') > -1 && count(/placeholder=/g, ship), 1, "only Address line 2 has a placeholder");
eq(count(/ required/g, ship), 8, "everything but Address line 2 is required");
eq(count(/<option value="[A-Z]{2}">/g, ship), 51, "50 states + DC");
eq(/<option value="" disabled selected>Select<\/option>/.test(ship), true, "State starts on Select");
eq(ship.indexOf("co-ship-flag") > -1 && ship.indexOf("<span>+1</span>") > -1, true, "US +1 prefix");
eq(count(/>Email</g, page) + count(/type="email"/g, page), 2, "one email field on the page");
eq(page.indexOf("you@example.com"), -1, "their email placeholder is gone");
// the phone and ZIP formatting, run through the page script's own input handler
var handlers = {};
var fakeDoc = { addEventListener: function (t, f) { handlers[t] = f; }, querySelectorAll: function () { return []; } };
new Function("document", "window", js)(fakeDoc, {});
function typed(kind, v) {
  var el = { value: v, matches: function () { return false; }, getAttribute: function () { return kind; } };
  handlers.input({ target: el });
  return el.value;
}
eq([typed("ship-tel", "515"), typed("ship-tel", "5153"), typed("ship-tel", "5153212343"), typed("ship-tel", "(515) 321-23439")],
   ["515", "(515) 3", "(515) 321-2343", "(515) 321-2343"], "phone formats as (515) 321-2343");
eq([typed("ship-zip", "72201-1234"), typed("ship-zip", "7a2b")], ["72201", "72"], "ZIP keeps 5 digits");

// Their states are all there (coupon, reviews, accordions) with their prices
eq(page.indexOf('<template id="co-summary-applied">') > -1 && page.indexOf('<template id="co-summary-removed">') > -1, true, "coupon states");
[0, 1, 2, 3].forEach(function (n) { eq(page.indexOf('<template id="co-review-' + n + '">') > -1, true, "review " + (n + 1)); });
var removed = page.slice(page.indexOf('<template id="co-summary-removed">'));
removed = removed.slice(0, removed.indexOf("</template>"));
eq(removed.indexOf("$317") > -1 && removed.indexOf("Redeem") > -1 && removed.indexOf("200off applied") === -1, true, "no-coupon state: their $317 literal (plan-fill.js swaps it) + Redeem");
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

// The order summary follows the chosen plan (client doc "Chime Microdose Gold Page", 2026-09-24): js/plan-fill.js
// prices it from ../js/plans-data-v2.js. Client rules: per day = monthly ÷ 30, crossed-out = total + $200.
var P = require("./plan-fill.js");
var D2 = require("../../js/plans-data-v2.js");
var fillJs = fs.readFileSync(path.join(__dirname, "plan-fill.js"), "utf8");
var expectPlans = {
  "sema-1": ["Microdose Semaglutide 1-Month Plan", "$4.30", "$129", "$329"],
  "sema-3": ["Microdose Semaglutide 3-Month Plan", "$3.97", "$357", "$557"],
  "sema-6": ["Microdose Semaglutide 6-Month Plan", "$3.63", "$654", "$854"],
  "sema-12": ["Microdose Semaglutide 12-Month Plan", "$3.30", "$1,188", "$1,388"],
  "tirz-1": ["Microdose Tirzepatide 1-Month Plan", "$4.97", "$149", "$349"],
  "tirz-3": ["Microdose Tirzepatide 3-Month Plan", "$4.63", "$417", "$617"],
  "tirz-6": ["Microdose Tirzepatide 6-Month Plan", "$4.30", "$774", "$974"],
  "tirz-12": ["Microdose Tirzepatide 12-Month Plan", "$3.97", "$1,428", "$1,628"]
};
Object.keys(expectPlans).forEach(function (id) {
  var e = expectPlans[id], med = id.split("-")[0], term = +id.split("-")[1];
  var s = P.summaryFor(D2, med, term);
  eq([s.title, s.perDay, s.total, s.crossed], e, "summary " + id);
  eq(s.packageLabel, term + "-Month Treatment Package", "package label " + id);
  eq(s.image, "images/" + (med === "tirz" ? "tirzepatide" : "semaglutide") + "-amber.webp", "vial " + id);
});
eq(P.summaryFor(D2, "tirz", 1).covers, "One-time payment · Covers 1 month of medication", "1 month, singular");
eq(P.summaryFor(D2, "tirz", 6).badge, "Fastest Results", "Tirzepatide badge");
eq(P.summaryFor(D2, "sema", 3).badge, "Most Affordable", "Semaglutide badge");
eq(P.summaryFor(D2, "sema", 3).perDayNoCoupon, "$6.19", "no-coupon per day = (total + 200) ÷ days");
eq(P.summaryFor(D2, "tirz", 2), null, "unknown term → null");
eq(P.summaryFor(D2, "nad", 3), null, "unknown drug → null");
eq(P.pick("?med=tirz&term=6", { med: "sema", term: 1 }), { med: "tirz", term: 6 }, "URL wins");
eq(P.pick("", { med: "sema", term: 12 }), { med: "sema", term: 12 }, "else the plan page's record");
eq(P.pick("", null), { med: "sema", term: 3 }, "else Semaglutide 3-Month");
// every literal it swaps is really on the page as a whole text node (so no plan ever shows their numbers)
Object.keys(P.replacements(P.summaryFor(D2, "sema", 3))).forEach(function (lit) {
  eq(page.indexOf(">" + lit + "<") > -1, true, "literal on the page: " + lit);
});
eq(page.indexOf('src="images/tirzepatide-amber.webp"') === -1 && fs.existsSync(path.join(DIR, "images", "tirzepatide-amber.webp")), true, "Tirzepatide vial ships (swapped in by the script)");
eq(fs.existsSync(path.join(DIR, "..", "js", "plans-data-v2.js")), true, "../js/plans-data-v2.js exists");
eq(page.indexOf("../js/plans-data-v2.js") < page.indexOf("js/plan-fill.js") && page.indexOf('src="js/plan-fill.js') < page.indexOf('src="js/checkout.js'), true, "script order: data → plan-fill → checkout");
eq(/fetch\(|XMLHttpRequest|sendBeacon|localStorage|setItem/.test(fillJs), false, "plan-fill only reads the choice");
eq(/productHref\) \|\| "\.\.\/v2\.html"/.test(js), true, "Choose → the plan page (V2 unless the data names another)");

// ---------- checkout-v3/ (client doc "price lock to Gold product and checkout", 2026-09-25) ----------
var DIR3 = path.join(DIR, "..", "checkout-v3");
var html3 = fs.readFileSync(path.join(DIR3, "index.html"), "utf8");
var page3 = html3.replace(/<!--[\s\S]*?-->/g, "");
var D3 = require("../../js/plans-data-v3.js");
var strip = function (h) { return h.replace(/<!--[\s\S]*?-->/g, "").replace(/\n{2,}/g, "\n").replace(/\.\.\/checkout\//g, "").replace(/plans-data-v[23]/g, "plans-data"); };
eq(strip(html3), strip(html), "checkout-v3 = the same page, with checkout/'s assets and the V3 data");
var refs3 = [];
page3.replace(/(?:src|href)="([^"#?]+)(?:\?[^"]*)?"/g, function (_, u) { refs3.push(u); });
refs3.forEach(function (u) { eq(fs.existsSync(path.join(DIR3, u)), true, "v3 asset exists: " + u); });
eq(/(src|href)="(images|css|js|fonts)\//.test(page3), false, "v3 loads nothing from its own folder");
eq(fs.readdirSync(DIR3), ["index.html"], "checkout-v3 holds only its page");
eq(/[\w.+-]+@[\w-]+\.[a-z]{2,}|userid=|[?&]email=|addressl[12]=/.test(html3), false, "v3: no personal data");
var expect3 = {   // title, per day, price, crossed-out, discount, badge, code
  "sema-1": ["Semaglutide 1-Month Plan", "$5.97", "$179", "$299", "$120", "$120 off", "120off"],
  "sema-3": ["Semaglutide 3-Month Plan", "$8.30", "$747", "$996", "$249", "4TH MONTH FREE, FOREVER", "4thMONTH"],
  "sema-6": ["Semaglutide 6-Month Plan", "$5.97", "$1,074", "$1,794", "$720", "PRICE LOCKED IN, FOREVER", "LOCKED"],
  "tirz-1": ["Tirzepatide 1-Month Plan", "$9.30", "$279", "$399", "$120", "$120 off", "120off"],
  "tirz-3": ["Tirzepatide 3-Month Plan", "$9.97", "$897", "$1,196", "$299", "4TH MONTH FREE, FOREVER", "4thMONTH"],
  "tirz-6": ["Tirzepatide 6-Month Plan", "$9.30", "$1,674", "$2,394", "$720", "PRICE LOCKED IN, FOREVER", "LOCKED"]
};
Object.keys(expect3).forEach(function (id) {
  var e = expect3[id], med = id.split("-")[0], term = +id.split("-")[1];
  var s = P.summaryFor(D3, med, term);
  eq([s.title, s.perDay, s.total, s.crossed, s.discount, s.badge, s.code], e, "v3 summary " + id);
  var r = P.replacements(s);
  eq([r["200off applied"], r["-$200"], r["You save $200!"], r["$467"], r["$267"], r["$317"]],
     [e[6] + " applied", "-" + e[4], "You save " + e[4] + "!", e[3], e[2], e[3]], "v3 swaps " + id);
});
eq(P.summaryFor(D3, "sema", 12), null, "v3 has no 12-month plan");
var v2s = P.summaryFor(D2, "sema", 3);
eq([v2s.code, v2s.discount, v2s.badge], ["200off", "$200", "Most Affordable"], "V2 keeps its coupon rules");
eq(D3.productHref, "../v3.html", "v3 Choose → ../v3.html");
["200off applied", "-$200", "You save $200!", "Most Affordable"].forEach(function (lit) {
  eq(page.indexOf(">" + lit + "<") > -1, true, "literal on the page: " + lit);
});
eq(/CHIME_COUPON_CODE = s\.code\.toUpperCase\(\)/.test(fillJs) && /CHIME_COUPON_CODE \|\| "200OFF"/.test(js), true, "Redeem takes the plan's code");

console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
