// Chime Health — cart price-derivation tests.
//   node ui_kits/cart/cart-tests.js
// Guards the arithmetic the two screens display. The numbers below are not
// copied from the mockups — they are what the real catalog
// (ui_kits/shared/data/products.js) produces under the rules documented in
// chimeCartPlans(). If a catalog price changes, these expectations change with
// it; if the DERIVATION changes, that is the thing to argue about.

"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..", "..");
const sandbox = { console };
sandbox.window = sandbox;
vm.createContext(sandbox);
for (const f of ["ui_kits/shared/data/products.js", "ui_kits/cart/cart-data.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), sandbox, { filename: f });
}

let pass = 0;
const fails = [];
function eq(label, actual, expected) {
  const a = typeof actual === "number" ? Math.round(actual * 100) / 100 : actual;
  if (a === expected) { pass++; return; }
  fails.push(`${label}\n    expected: ${JSON.stringify(expected)}\n    actual:   ${JSON.stringify(a)}`);
}

const byKey = (plans) => Object.fromEntries(plans.map((p) => [p.key, p]));

// ---- money helpers -------------------------------------------------------
eq("money strips currency formatting", sandbox.chimeCartMoney("$1,194.00"), 1194);
eq("money reads through a From prefix", sandbox.chimeCartMoney("From $179.00"), 179);
eq("money on empty is 0", sandbox.chimeCartMoney(null), 0);
eq("USD drops cents when whole", sandbox.chimeCartUSD(209), "$209");
eq("USD keeps cents when partial", sandbox.chimeCartUSD(156.75), "$156.75");
eq("USD groups thousands", sandbox.chimeCartUSD(2148), "$2,148");

// ---- GLP-1: the "From $" shape ------------------------------------------
// Its 1-month row is "From $179.00", a marketing floor equal to the 1-YEAR
// rate. Read literally it would make the 1-month plan the cheapest per month.
// The derivation must instead take the list rate from the 3-month row ($209),
// the shortest term the ladder actually quotes.
const glp = byKey(sandbox.chimeCartPlans(sandbox.chimeCartProduct("prod-glp-1")));
eq("glp-1 quotes four terms", Object.keys(glp).length, 4);
eq("glp-1 list rate ignores the From floor", glp["3mo"].listRate, 209);
eq("glp-1 1mo total is the list rate", glp["1mo"].total, 209);
eq("glp-1 1mo has no savings", glp["1mo"].savings, 0);
eq("glp-1 3mo ships 4 months", glp["3mo"].supplyMonths, 4);
eq("glp-1 3mo shows 16 weeks", glp["3mo"].supplyWeeks, 16);
eq("glp-1 3mo total is the catalog price", glp["3mo"].total, 627);
eq("glp-1 3mo per-month spreads over 4", glp["3mo"].perMonth, 156.75);
eq("glp-1 3mo saves one month at list", glp["3mo"].savings, 209);
eq("glp-1 6mo per-month matches catalog permo", glp["6mo"].perMonth, 199);
eq("glp-1 6mo savings", glp["6mo"].savings, 60);
eq("glp-1 1yr per-month matches catalog permo", glp["1yr"].perMonth, 179);
eq("glp-1 1yr savings", glp["1yr"].savings, 360);
eq("glp-1 1yr label", glp["1yr"].totalLabel, "$2,148");
eq("glp-1 3mo CTA prices the supply, not the billing", glp["3mo"].ctaPrice, "$627/ 4 Month Membership");
eq("glp-1 1mo CTA reads per month", glp["1mo"].ctaPrice, "$209/month Membership");
eq("glp-1 3mo carries the Most Popular badge", glp["3mo"].badge, "Most Popular");

// Every multi-month plan must beat paying month to month. This is the invariant
// that fails loudly if someone "fixes" the list rate back to the From-floor —
// under that reading the 6-month plan costs MORE per month than the 1-month.
["3mo", "6mo", "1yr"].forEach((k) => {
  eq(`glp-1 ${k} beats the month-to-month rate`, glp[k].perMonth < glp["1mo"].perMonth, true);
  eq(`glp-1 ${k} savings are positive`, glp[k].savings > 0, true);
});

// The ladder is NOT monotonic, and that is a property of the offer, not a bug:
// the free 4th month drops the 3-month plan to $156.75/mo, under both the
// 6-month ($199) and the 12-month ($179). The mockup has the same shape — its
// 6-month is dearer per month than its 3-month. Asserted so the fact stays
// visible rather than surfacing later as a surprise.
eq("glp-1 3mo is cheaper per month than 1yr", glp["3mo"].perMonth < glp["1yr"].perMonth, true);
eq("glp-1 3mo is cheaper per month than 6mo", glp["3mo"].perMonth < glp["6mo"].perMonth, true);

// Which is exactly why Best Deal cannot be hardcoded onto the 12-month card.
eq("glp-1 1yr does not claim Best Deal", glp["1yr"].badge, null);
eq("glp-1 no card falsely claims Best Deal",
  Object.values(glp).filter((p) => p.badge === "Best Deal").length, 0);
eq("the cheapest plan is never left dearer than a Best Deal card",
  Object.values(glp).every((p) => p.badge !== "Best Deal"
    || Object.values(glp).every((q) => q.perMonth >= p.perMonth)), true);

// ---- NAD+: the real-1-month shape, and a short ladder --------------------
const nad = byKey(sandbox.chimeCartPlans(sandbox.chimeCartProduct("prod-nad")));
eq("nad+ quotes only two terms", Object.keys(nad).length, 2);
eq("nad+ has no 6-month term", nad["6mo"], undefined);
eq("nad+ list rate is its real 1-month price", nad["1mo"].listRate, 209);
eq("nad+ 1mo total", nad["1mo"].total, 209);
eq("nad+ 3mo total is the catalog price", nad["3mo"].total, 447);
eq("nad+ 3mo per-month spreads over 4", nad["3mo"].perMonth, 111.75);
eq("nad+ 3mo savings", nad["3mo"].savings, 389);

// ---- Products with a clean descending ladder -----------------------------
const glow = byKey(sandbox.chimeCartPlans(sandbox.chimeCartProduct("prod-glow-stack")));
eq("glow stack list rate is its 1-month price", glow["1mo"].listRate, 199);
eq("glow stack 1yr per-month", glow["1yr"].perMonth, 159);
eq("glow stack 1yr savings", glow["1yr"].savings, 2388 - 1908);

// ---- Degenerate input ----------------------------------------------------
eq("a product with no plans yields none",
  sandbox.chimeCartPlans(sandbox.chimeCartProduct("prod-sermorelin")).length, 0);
eq("a missing product resolves to null", sandbox.chimeCartProduct("prod-nope"), null);
eq("null product yields no plans", sandbox.chimeCartPlans(null).length, 0);

// ---- Join code -----------------------------------------------------------
// The code is applied at checkout, not in the ladder, so screen 1 keeps quoting
// the undiscounted plan. These assertions are what make "CODE APPLIED" true.
const promo = sandbox.CHIME_CART_PROMO;
const withCode = (p) => sandbox.chimeCartApplyPromo(p, promo);

const g3 = withCode(glp["3mo"]);
eq("code applies to the 3-month plan", g3.promoApplied, true);
eq("code takes its face value off", g3.promoDiscount, 120);
eq("code total is ladder total minus discount", g3.finalTotal, 627 - 120);
eq("code per-month spreads over the supply", g3.finalPerMonth, 507 / 4);
eq("total savings stack ladder + code", g3.totalSavings, 836 - 507);
eq("total savings label", g3.totalSavingsLabel, "$329");

// The struck figures and the Total Savings row must describe the same gap, or
// the customer can catch the page contradicting itself with a subtraction.
["1mo", "3mo", "6mo", "1yr"].forEach((k) => {
  const p = withCode(glp[k]);
  eq(`glp-1 ${k} savings equal the struck gap`,
    Math.round((p.listTotal - p.finalTotal) * 100) / 100,
    Math.round(p.totalSavings * 100) / 100);
  eq(`glp-1 ${k} never prices below zero`, p.finalTotal > 0, true);
});

// Excluded from the 1-month plan: $120 off $209 is not a join incentive.
const g1 = withCode(glp["1mo"]);
eq("code skips the 1-month plan", g1.promoApplied, false);
eq("skipped plan keeps its total", g1.finalTotal, 209);
eq("skipped plan claims no code savings", g1.totalSavings, 0);

// Disabling the promo must leave every figure at its ladder value.
const off = sandbox.chimeCartApplyPromo(glp["3mo"], Object.assign({}, promo, { enabled: false }));
eq("disabling the promo restores the ladder total", off.finalTotal, 627);
eq("disabling the promo clears the applied flag", off.promoApplied, false);

// A discount that would swallow the order is refused outright.
const huge = sandbox.chimeCartApplyPromo(glp["3mo"], Object.assign({}, promo, { discount: 9999 }));
eq("an oversized discount is refused", huge.promoApplied, false);
eq("an oversized discount leaves the total intact", huge.finalTotal, 627);

// The Best Deal badge is computed pre-code on screen 1. If the code ever
// reordered which plan is cheapest per month, that badge would become a lie —
// so assert the ranking survives the discount rather than assuming it does.
const rankedBefore = Object.values(glp).slice().sort((a, b) => a.perMonth - b.perMonth)[0].key;
const rankedAfter = Object.values(glp).map(withCode)
  .sort((a, b) => a.finalPerMonth - b.finalPerMonth)[0].key;
eq("the cheapest plan is the same before and after the code", rankedAfter, rankedBefore);

eq("the code name still matches its value", promo.code, "JOIN" + promo.discount);

// The checkout ribbon reads plan.badge off the PROMO-APPLIED object, so the
// badge has to survive that pass — drop it and screen 2 silently stops
// confirming which plan the user chose.
eq("the badge survives the promo pass", withCode(glp["3mo"]).badge, "Most Popular");
eq("an unbadged plan stays unbadged through the promo pass", withCode(glp["6mo"]).badge, null);

// Under current pricing the 3-month plan is the cheapest per month for EVERY
// product, so "Most Popular" is the only badge that ever renders and the
// mockup's "Best Deal" tag is unreachable. Asserted so that if a price change
// ever makes it reachable, someone re-reads the ribbon styling that has never
// actually been seen on screen.
const everyBadge = new Set(sandbox.CHIME_PRODUCTS
  .flatMap((p) => sandbox.chimeCartPlans(p)).map((p) => p.badge).filter(Boolean));
eq("only Most Popular is reachable across the catalog",
  [...everyBadge].join(","), "Most Popular");

// ---- Config wiring -------------------------------------------------------
eq("both mockup treatments resolve in the catalog",
  sandbox.CHIME_CART_TREATMENTS.every((t) => !!sandbox.chimeCartProduct(t.id)), true);
eq("every catalog plan key has presentation meta",
  sandbox.CHIME_PRODUCTS.every((p) => (p.plans || [])
    .every((pl) => !!sandbox.CHIME_CART_PLAN_META[pl.key])), true);
eq("the rewritten legal block names no competitor",
  /trimrx|betterly/i.test(sandbox.CHIME_CART_LEGAL), false);

console.log(fails.length
  ? `\nFAIL — ${pass} passed, ${fails.length} failed:\n\n${fails.join("\n\n")}\n`
  : `PASS — ${pass} checks`);
process.exit(fails.length ? 1 : 0);
