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
// Its 1-month row is "From $130.00", a marketing floor equal to the 1-YEAR
// rate. Read literally it would make the 1-month plan the cheapest per month.
// The derivation must instead take the list rate from the 3-month row ($200),
// the shortest term the ladder actually quotes.
const glp = byKey(sandbox.chimeCartPlans(sandbox.chimeCartProduct("prod-glp-1")));
eq("glp-1 quotes four terms", Object.keys(glp).length, 4);
eq("glp-1 list rate ignores the From floor", glp["3mo"].listRate, 200);
eq("glp-1 1mo total is the list rate", glp["1mo"].total, 200);
eq("glp-1 1mo has no savings", glp["1mo"].savings, 0);
eq("glp-1 3mo ships 4 months", glp["3mo"].supplyMonths, 4);
eq("glp-1 3mo shows 16 weeks", glp["3mo"].supplyWeeks, 16);
eq("glp-1 3mo total is the catalog price", glp["3mo"].total, 600);
eq("glp-1 3mo per-month spreads over 4", glp["3mo"].perMonth, 150);
eq("glp-1 3mo saves one month at list", glp["3mo"].savings, 200);
eq("glp-1 6mo per-month matches catalog permo", glp["6mo"].perMonth, 130);
eq("glp-1 6mo savings", glp["6mo"].savings, 420);
eq("glp-1 1yr per-month matches catalog permo", glp["1yr"].perMonth, 110);
eq("glp-1 1yr savings", glp["1yr"].savings, 1080);
eq("glp-1 1yr label", glp["1yr"].totalLabel, "$1,320");
eq("glp-1 3mo CTA prices the supply, not the billing", glp["3mo"].ctaPrice, "$600/ 4 Month Membership");
eq("glp-1 1mo CTA reads per month", glp["1mo"].ctaPrice, "$200/month Membership");
eq("glp-1 3mo carries the Most Popular badge", glp["3mo"].badge, "Most Popular");

// Every multi-month plan must beat paying month to month. This is the invariant
// that fails loudly if someone "fixes" the list rate back to the From-floor —
// under that reading the 6-month plan costs MORE per month than the 1-month.
["3mo", "6mo", "1yr"].forEach((k) => {
  eq(`glp-1 ${k} beats the month-to-month rate`, glp[k].perMonth < glp["1mo"].perMonth, true);
  eq(`glp-1 ${k} savings are positive`, glp[k].savings > 0, true);
});

// ---- The ladder must DESCEND ---------------------------------------------
// Repriced 2026-08-14. It used to invert: the free 4th month dropped the
// 3-month plan to $156.75/mo, under both the 6-month ($199) and the 12-month
// ($179), which left the 6-month tier dominated outright — dearer per month
// than the term above it AND the term below it, so no customer had a reason to
// pick it. Longer commitment now always means a lower rate, and these are the
// assertions that keep it that way.
const ladder = ["1mo", "3mo", "6mo", "1yr"];
ladder.slice(1).forEach((k, i) => {
  const prev = glp[ladder[i]];
  eq(`glp-1 ${k} costs less per month than ${ladder[i]}`, glp[k].perMonth < prev.perMonth, true);
  eq(`glp-1 ${k} saves more than ${ladder[i]}`, glp[k].savings > prev.savings, true);
});
// No tier may be dominated: dearer per month than a SHORTER commitment.
eq("no glp-1 tier is dominated by a shorter one",
  ladder.every((k, i) => ladder.slice(0, i).every((j) => glp[j].perMonth > glp[k].perMonth)), true);

// Best Deal is EARNED by the cheapest per-month plan, and post-reprice the
// 12-month card finally earns it. It had never rendered before, so the ribbon
// styling for it had genuinely never been seen on screen.
eq("glp-1 1yr is the cheapest per month", glp["1yr"].perMonth < glp["3mo"].perMonth, true);
eq("glp-1 1yr now earns Best Deal", glp["1yr"].badge, "Best Deal");
eq("no card claims Best Deal without being cheapest",
  Object.values(glp).every((p) => p.badge !== "Best Deal"
    || Object.values(glp).every((q) => q.perMonth >= p.perMonth)), true);

// ---- NAD+: the real-1-month shape, and a short ladder --------------------
// Repriced alongside GLP-1. Its old $209 month-to-month was IDENTICAL to
// GLP-1's, which rendered the two products' 1-month cards character for
// character the same in the cart. It now sits a clear step below.
const nad = byKey(sandbox.chimeCartPlans(sandbox.chimeCartProduct("prod-nad")));
eq("nad+ quotes only two terms", Object.keys(nad).length, 2);
eq("nad+ has no 6-month term", nad["6mo"], undefined);
eq("nad+ list rate is its real 1-month price", nad["1mo"].listRate, 160);
eq("nad+ 1mo total", nad["1mo"].total, 160);
eq("nad+ 3mo total is the catalog price", nad["3mo"].total, 420);
eq("nad+ 3mo per-month spreads over 4", nad["3mo"].perMonth, 105);
eq("nad+ 3mo savings", nad["3mo"].savings, 220);
eq("nad+ 3mo costs less per month than its 1mo", nad["3mo"].perMonth < nad["1mo"].perMonth, true);
// The marketing calls NAD+ the more affordable of the two, and the two cards
// sit side by side on screen 1 — so the catalog has to actually say so.
eq("nad+ undercuts glp-1 month to month", nad["1mo"].perMonth < glp["1mo"].perMonth, true);
eq("nad+ 1mo is not a clone of glp-1's", nad["1mo"].totalLabel === glp["1mo"].totalLabel, false);

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
eq("code total is ladder total minus discount", g3.finalTotal, 600 - 120);
eq("code per-month spreads over the supply", g3.finalPerMonth, 480 / 4);
eq("total savings stack ladder + code", g3.totalSavings, 800 - 480);
eq("total savings label", g3.totalSavingsLabel, "$320");

// The struck figures and the Total Savings row must describe the same gap, or
// the customer can catch the page contradicting itself with a subtraction.
["1mo", "3mo", "6mo", "1yr"].forEach((k) => {
  const p = withCode(glp[k]);
  eq(`glp-1 ${k} savings equal the struck gap`,
    Math.round((p.listTotal - p.finalTotal) * 100) / 100,
    Math.round(p.totalSavings * 100) / 100);
  eq(`glp-1 ${k} never prices below zero`, p.finalTotal > 0, true);
});

// Excluded from the 1-month plan: $120 off $200 is not a join incentive.
const g1 = withCode(glp["1mo"]);
eq("code skips the 1-month plan", g1.promoApplied, false);
eq("skipped plan keeps its total", g1.finalTotal, 200);
eq("skipped plan claims no code savings", g1.totalSavings, 0);

// Disabling the promo must leave every figure at its ladder value.
const off = sandbox.chimeCartApplyPromo(glp["3mo"], Object.assign({}, promo, { enabled: false }));
eq("disabling the promo restores the ladder total", off.finalTotal, 600);
eq("disabling the promo clears the applied flag", off.promoApplied, false);

// A discount that would swallow the order is refused outright.
const huge = sandbox.chimeCartApplyPromo(glp["3mo"], Object.assign({}, promo, { discount: 9999 }));
eq("an oversized discount is refused", huge.promoApplied, false);
eq("an oversized discount leaves the total intact", huge.finalTotal, 600);

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

// Before the 2026-08-14 reprice the 3-month plan was cheapest per month for
// EVERY product, so "Most Popular" was the only badge that could render and the
// mockup's "Best Deal" tag was unreachable — this assertion existed to catch
// exactly the price change that would make it reachable, and it did. Both
// badges now render, so the Best Deal ribbon needed its first real look.
const everyBadge = new Set(sandbox.CHIME_PRODUCTS
  .flatMap((p) => sandbox.chimeCartPlans(p)).map((p) => p.badge).filter(Boolean));
eq("both badges are now reachable across the catalog",
  [...everyBadge].sort().join(","), "Best Deal,Most Popular");
// A product may never show the same badge twice, or the superlative is a lie.
sandbox.CHIME_PRODUCTS.forEach((p) => {
  const badges = sandbox.chimeCartPlans(p).map((x) => x.badge).filter(Boolean);
  eq(`${p.id} shows no duplicate badge`, badges.length, new Set(badges).size);
});

// ---- Config wiring -------------------------------------------------------
eq("both mockup treatments resolve in the catalog",
  sandbox.CHIME_CART_TREATMENTS.every((t) => !!sandbox.chimeCartProduct(t.id)), true);
eq("every catalog plan key has presentation meta",
  sandbox.CHIME_PRODUCTS.every((p) => (p.plans || [])
    .every((pl) => !!sandbox.CHIME_CART_PLAN_META[pl.key])), true);
eq("the rewritten legal block names no competitor",
  /trimrx|betterly/i.test(sandbox.CHIME_CART_LEGAL), false);

// ---- Order: more than one treatment --------------------------------------
// The basket holds several treatments, each on its own term, and the code is an
// ORDER-level discount taken once. These guard the two ways that goes wrong:
// double-charging the discount, and letting a cheap basket unlock it.
const line = (id, key) => {
  const product = sandbox.chimeCartProduct(id);
  return { product, plan: byKey(sandbox.chimeCartPlans(product))[key] };
};
const order = (...ls) => sandbox.chimeCartOrder(ls);

const oneLine = order(line("prod-nad", "3mo"));
eq("a single line subtotals to its plan", oneLine.subtotal, 420);
eq("a single qualifying line takes the code once", oneLine.promoDiscount, 120);
eq("single-line total is subtotal minus the code", oneLine.total, 300);

const twoLines = order(line("prod-nad", "3mo"), line("prod-glp-1", "1yr"));
eq("two lines are both counted", twoLines.count, 2);
eq("subtotal sums the lines", twoLines.subtotal, 420 + 1320);
// The whole point of the order-level rule: $120, NOT $240.
eq("the code is taken ONCE across the basket", twoLines.promoDiscount, 120);
eq("order total is subtotal minus one discount", twoLines.total, 420 + 1320 - 120);
eq("savings fold ladder and code into one figure",
  twoLines.totalSavings, twoLines.listTotal - twoLines.total);
// Per-line figures stay at the ladder price — the discount belongs to the
// order, so smearing it across lines would print totals no plan card quoted.
eq("lines keep their undiscounted plan totals",
  twoLines.lines.map((l) => l.plan.total).join(","), "420,1320");

// Supply is summed across the basket, so a basket of month-to-month plans still
// cannot unlock $120 — the rule chimeCartApplyPromo enforced per plan.
eq("one 1-month plan does not qualify", order(line("prod-nad", "1mo")).promoApplied, false);
eq("two 1-month plans still do not qualify",
  order(line("prod-nad", "1mo"), line("prod-glp-1", "1mo")).promoApplied, false);
eq("mixing a 1-month plan with a qualifying one still discounts once",
  order(line("prod-nad", "1mo"), line("prod-glp-1", "3mo")).promoDiscount, 120);

// The order's per-month equivalent is only meaningful on ONE line. Across two
// treatments on different terms the customer buys 4 months of one and 12 of the
// other, so dividing by the summed supply months would quote a rate for a
// duration nobody is buying — and understate the early months, when both are
// being paid for at once. It must come back null rather than plausible.
// NAD+ 3-month: $420 ladder − $120 code = $300, over 4 months of supply.
eq("a single line quotes a per-month equivalent", oneLine.perMonth, 300 / 4);
eq("and labels it", oneLine.perMonthLabel, "$75");
eq("single-line per-month is total over its supply",
  oneLine.perMonth, oneLine.total / oneLine.lines[0].plan.supplyMonths);
eq("a two-line basket quotes NO order per-month", twoLines.perMonth, null);
eq("and no label for it either", twoLines.perMonthLabel, null);
eq("an empty basket quotes none", order().perMonth, null);

// ---- Customer-entered discount codes -------------------------------------
// Matching has to survive what people actually paste: wrong case, stray spaces.
eq("a code resolves case-insensitively",
  sandbox.chimeCartResolveCode("discount01").code, "DISCOUNT01");
eq("and through surrounding whitespace",
  sandbox.chimeCartResolveCode("  DISCOUNT01  ").code, "DISCOUNT01");
eq("and through interior spaces", sandbox.chimeCartResolveCode("dis count01").code, "DISCOUNT01");
eq("an unknown code resolves to null", sandbox.chimeCartResolveCode("NOPE"), null);
eq("an empty code resolves to null", sandbox.chimeCartResolveCode("   "), null);
eq("a null input does not throw", sandbox.chimeCartResolveCode(null), null);

const code01 = sandbox.chimeCartResolveCode("DISCOUNT01");
const withEntered = sandbox.chimeCartOrder([line("prod-nad", "3mo")], null, code01);
// NAD+ 3-month: $420 ladder, less the automatic $120, THEN 24% of the $300 that
// is left. The percentage is taken off the final price, not the subtotal — a
// customer reading "24% off" applies it to what they were about to pay.
eq("the entered code is applied", withEntered.codeApplied, true);
eq("it names the code it matched", withEntered.code, "DISCOUNT01");
eq("it reports its percentage", withEntered.codePercent, 24);
eq("the percentage comes off the POST-promo figure", withEntered.codeDiscount, 72);
eq("the total is subtotal, less promo, less the code", withEntered.total, 420 - 120 - 72);
eq("savings still reconcile against list",
  withEntered.totalSavings, withEntered.listTotal - withEntered.total);
eq("the per-month equivalent follows the discounted total",
  withEntered.perMonth, (420 - 120 - 72) / 4);

// An order with no code must be untouched by the new path.
eq("no code leaves codeApplied false", oneLine.codeApplied, false);
eq("no code takes nothing off", oneLine.codeDiscount, 0);
eq("no code total is unchanged", oneLine.total, 300);

// A code the customer got wrong must change nothing at all.
const badCode = sandbox.chimeCartOrder([line("prod-nad", "3mo")], null,
  sandbox.chimeCartResolveCode("WRONG"));
eq("an unknown code discounts nothing", badCode.codeDiscount, 0);
eq("and leaves the total alone", badCode.total, 300);

// Percentages are rounded to the cent, so the figure shown is the figure
// charged — a two-treatment basket is where the fraction would otherwise show.
const twoWithCode = sandbox.chimeCartOrder(
  [line("prod-nad", "3mo"), line("prod-glp-1", "1yr")], null, code01);
eq("percentage discounts round to the cent",
  Math.round(twoWithCode.codeDiscount * 100) / 100, twoWithCode.codeDiscount);
eq("a two-line basket discounts off its post-promo total",
  twoWithCode.codeDiscount, Math.round((1740 - 120) * 24) / 100);
eq("and totals correctly", twoWithCode.total, 1740 - 120 - 388.8);

// Guards: a code must never zero or invert an order.
const wild = sandbox.chimeCartOrder([line("prod-nad", "3mo")], null, { code: "X", percent: 100 });
eq("a 100% code is refused", wild.codeApplied, false);
eq("and the order still charges", wild.total, 300);
eq("a code on an empty basket is refused",
  sandbox.chimeCartOrder([], null, code01).codeApplied, false);

// Degenerate baskets must not produce a discount, a negative total, or a throw.
eq("an empty order has no discount", order().promoApplied, false);
eq("an empty order totals zero", order().total, 0);
eq("an empty order counts zero lines", order().count, 0);
eq("lines with no plan chosen are dropped",
  sandbox.chimeCartOrder([{ product: sandbox.chimeCartProduct("prod-nad"), plan: null }]).count, 0);
eq("the discount never reaches the subtotal",
  sandbox.chimeCartOrder([line("prod-nad", "3mo")], { enabled: true, code: "X", discount: 447 }).promoApplied,
  false);

console.log(fails.length
  ? `\nFAIL — ${pass} passed, ${fails.length} failed:\n\n${fails.join("\n\n")}\n`
  : `PASS — ${pass} checks`);
process.exit(fails.length ? 1 : 0);
