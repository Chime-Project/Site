import fs from 'node:fs';

// Load funnel-state.js into a fake window
const src = fs.readFileSync(new URL("../js/funnel-state.js", import.meta.url), "utf8");
const store = {};
const w = { localStorage: {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; },
}};
new Function('window', src + '\nreturn;')(w);
const { bmi, bmiCategory, plan, addMonths, shortDate, MAX_LBS_PER_MONTH } = w.FunnelCalc;

let pass = 0, fail = 0;
const eq = (label, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}  got=${JSON.stringify(got)}${ok ? '' : ` want=${JSON.stringify(want)}`}`);
};

console.log('--- BMI ---');
// 5'10" 180lbs -> 703*180/70^2 = 25.8
eq("5'10\" 180lbs", bmi(5, 10, 180), 25.8);
eq("5'4\" 150lbs", bmi(5, 4, 150), 25.7);
eq("6'0\" 200lbs", bmi(6, 0, 200), 27.1);
eq("5'7\" 130lbs (was impossible before)", bmi(5, 7, 130), 20.4);
eq('empty inches', bmi(5, '', 180), null);
eq('no weight', bmi(5, 10, ''), null);
eq('zero weight', bmi(5, 10, 0), null);
eq('garbage', bmi('x', 'y', 'z'), null);

console.log('\n--- BMI categories ---');
eq('17', bmiCategory(17), 'underweight range');
eq('22', bmiCategory(22), 'healthy range');
eq('27', bmiCategory(27), 'overweight range');
eq('35', bmiCategory(35), 'obese range');
eq('boundary 25', bmiCategory(25), 'overweight range');
eq('boundary 30', bmiCategory(30), 'obese range');

console.log('\n--- PLAN: the 15 lbs/month guard rail ---');
// 30 lbs in 3 months = 10/mo, fine
eq('30 lbs, 3-months (10/mo, ok)', plan(230, 200, '3-months'), { lbs: 30, months: 3, maintenance: false, capped: false, requestedMonths: 3, perMonth: 10 });
// 100 lbs in 3 months = 33/mo, must stretch to ceil(100/15)=7
eq('100 lbs, 3-months (33/mo, capped)', plan(300, 200, '3-months'), { lbs: 100, months: 7, maintenance: false, capped: true, requestedMonths: 3, perMonth: 14.3 });
// 50 lbs in 3 months = 16.7/mo, must stretch to ceil(50/15)=4
eq('50 lbs, 3-months (16.7/mo, capped)', plan(250, 200, '3-months'), { lbs: 50, months: 4, maintenance: false, capped: true, requestedMonths: 3, perMonth: 12.5 });
// exactly 15/mo is allowed, not capped
eq('45 lbs, 3-months (exactly 15/mo)', plan(245, 200, '3-months'), { lbs: 45, months: 3, maintenance: false, capped: false, requestedMonths: 3, perMonth: 15 });
// 46 lbs in 3 = 15.33/mo -> capped
eq('46 lbs, 3-months (15.3/mo, capped)', plan(246, 200, '3-months'), { lbs: 46, months: 4, maintenance: false, capped: true, requestedMonths: 3, perMonth: 11.5 });
// slow pace never gets shortened
eq('20 lbs, 12-months (never shortened)', plan(220, 200, '12-months'), { lbs: 20, months: 12, maintenance: false, capped: false, requestedMonths: 12, perMonth: 1.7 });

console.log('\n--- PLAN: help me choose ---');
eq('30 lbs, help-me-choose', plan(230, 200, 'help-me-choose'), { lbs: 30, months: 5, maintenance: false, capped: false, requestedMonths: null, perMonth: 6 });
eq('12 lbs, help-me-choose (floors at 3)', plan(212, 200, 'help-me-choose'), { lbs: 12, months: 3, maintenance: false, capped: false, requestedMonths: null, perMonth: 4 });
eq('200 lbs, help-me-choose (ceils at 12, 16.7/mo!)', plan(400, 200, 'help-me-choose'), { lbs: 200, months: 14, maintenance: false, capped: true, requestedMonths: null, perMonth: 14.3 });

console.log('\n--- PLAN: edge cases ---');
eq('goal above current', plan(180, 200, '6-months'), { lbs: 0, months: 0, maintenance: true, capped: false });
eq('goal equals current', plan(200, 200, '6-months'), { lbs: 0, months: 0, maintenance: true, capped: false });
eq('missing weight', plan(null, 200, '6-months'), null);
eq('missing goal', plan(200, null, '6-months'), null);
eq('unknown pace treated as choose', plan(230, 200, 'nonsense')?.months, 5);
eq('empty pace treated as choose', plan(230, 200, '')?.months, 5);

console.log('\n--- date rolling ---');
const jan31 = new Date(2026, 0, 31);
eq('Jan 31 + 1 month stays in Feb', shortDate(addMonths(jan31, 1)), 'Feb 28');
eq('Jan 31 + 3 months', shortDate(addMonths(jan31, 3)), 'Apr 30');
const jul21 = new Date(2026, 6, 21);
eq('Jul 21 + 6 months', shortDate(addMonths(jul21, 6)), 'Jan 21');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
