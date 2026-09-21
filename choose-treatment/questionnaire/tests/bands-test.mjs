import fs from 'node:fs';

const w = {};
new Function('window', fs.readFileSync(new URL('../js/screening-bands.js', import.meta.url), 'utf8') + '\nreturn;')(w);
new Function('window', fs.readFileSync(new URL('../js/input-format.js', import.meta.url), 'utf8') + '\nreturn;')(w);
const { band } = w.ScreeningBands;
const { ageFromDOB } = w.InputFormat;

let pass = 0, fail = 0;
const eq = (label, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}  got=${JSON.stringify(got)}${ok ? '' : ` want=${JSON.stringify(want)}`}`);
};

console.log('--- elderly band (65+) ---');
eq('65, BMI 21.9 -> disqualify', band(65, 21.9), { band: 'disqualify', reason: 'elderly-low-bmi' });
eq('65, BMI 22 -> elderly consent', band(65, 22), { band: 'consent', consent: 'elderly' });
eq('80, BMI 34 -> elderly consent (no BMI ceiling)', band(80, 34), { band: 'consent', consent: 'elderly' });
eq('64, BMI 22 -> NOT elderly', band(64, 22), { band: 'consent', consent: 'metabolic' });

console.log('--- adult band (18-64) ---');
eq('40, BMI 19.99 -> disqualify', band(40, 19.99), { band: 'disqualify', reason: 'adult-low-bmi' });
eq('40, BMI 20 -> metabolic consent', band(40, 20), { band: 'consent', consent: 'metabolic' });
eq('40, BMI 22.99 -> metabolic consent', band(40, 22.99), { band: 'consent', consent: 'metabolic' });
eq('40, BMI 23 -> clear', band(40, 23), { band: 'clear' });
eq('40, BMI 31 -> clear', band(40, 31), { band: 'clear' });

console.log('--- the two boundaries the reference got wrong ---');
// Age exactly 65 is elderly, never adult, so the two consents can never both fire.
eq('65 exactly is elderly, not adult', band(65, 22.5).consent, 'elderly');
eq('64 exactly is adult', band(64, 22.5).consent, 'metabolic');
// 22.91-22.99 fell through the reference's original `<= 22.9` test.
eq('22.91 still needs consent', band(45, 22.91), { band: 'consent', consent: 'metabolic' });
eq('22.99 still needs consent', band(45, 22.99), { band: 'consent', consent: 'metabolic' });
eq('23.00 does not', band(45, 23.0), { band: 'clear' });

console.log('--- under 18 and unknown ---');
eq('17 -> under18', band(17, 30), { band: 'under18' });
eq('no BMI -> unknown', band(40, NaN), { band: 'unknown' });
eq('no age -> unknown', band(NaN, 25), { band: 'unknown' });
eq('BMI 0 -> unknown', band(40, 0), { band: 'unknown' });
eq('empty strings -> unknown', band('', ''), { band: 'unknown' });

console.log('--- only ever one consent at a time ---');
for (const [a, b] of [[65, 22], [64, 21], [70, 30], [30, 20], [18, 22.5]]) {
  const r = band(a, b);
  const n = r.band === 'consent' ? 1 : 0;
  eq(`age ${a} bmi ${b}: at most one consent`, n <= 1, true);
}

console.log('--- age from DOB, evaluated against a fixed "today" ---');
const today = new Date(2026, 6, 22); // 2026-07-22
eq('birthday already passed this year', ageFromDOB('01/15/1960', today), 66);
eq('birthday later this year', ageFromDOB('12/25/1960', today), 65);
eq('birthday is today', ageFromDOB('07/22/1961', today), 65);
eq('birthday tomorrow -> still younger', ageFromDOB('07/23/1961', today), 64);
eq('incomplete date -> NaN', Number.isNaN(ageFromDOB('12/25', today)), true);
eq('impossible date -> NaN', Number.isNaN(ageFromDOB('02/30/1990', today)), true);

console.log('--- the boundary that decides which consent shows ---');
eq('turns 65 tomorrow, BMI 22.5 -> metabolic', band(ageFromDOB('07/23/1961', today), 22.5).consent, 'metabolic');
eq('turned 65 today, BMI 22.5 -> elderly', band(ageFromDOB('07/22/1961', today), 22.5).consent, 'elderly');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
