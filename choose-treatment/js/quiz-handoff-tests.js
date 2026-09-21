// node choose-treatment/js/quiz-handoff-tests.js — the questionnaire → V2 hand-off decisions
const assert = require('assert');
const h = require('./quiz-handoff.js');
let n = 0; const ok = (name, fn) => { fn(); n++; };
ok('no record: nothing happens', () => assert.deepStrictEqual(h.decide(null), { redirect: null, preselect: null }));
ok('garbage record: nothing happens', () => assert.deepStrictEqual(h.decide('x'), { redirect: null, preselect: null }));
ok('took Tirzepatide → Tirzepatide preselected', () => assert.strictEqual(h.decide({ glp1_history: 'tirzepatide' }).preselect, 'injectable-tirzepatide'));
ok('took Semaglutide → Semaglutide preselected', () => assert.strictEqual(h.decide({ glp1_history: 'semaglutide' }).preselect, 'injectable-semaglutide'));
ok('no GLP-1 history → no preselect', () => assert.strictEqual(h.decide({ glp1_history: 'none' }).preselect, null));
ok('screened out → back to the closer-look page, no preselect', () => assert.deepStrictEqual(h.decide({ dq_enforced: true, glp1_history: 'tirzepatide' }), { redirect: 'questionnaire/disqualified.html', preselect: null }));
ok('dq recorded but not enforced → stays', () => assert.strictEqual(h.decide({ dq_enforced: false }).redirect, null));
ok('storage key matches the questionnaire', () => assert.strictEqual(h.KEY, 'chime_funnel'));
console.log('OK ' + n + '/' + n + ' checks');
