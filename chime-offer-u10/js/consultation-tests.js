/* node chime-offer-u10/js/consultation-tests.js : the quiz rules (config + engine helpers), no browser needed. */
var C = require('./consultation-config.js'), Q = require('./consultation.js');
var n = 0, bad = 0;
function ok(c, m) { n++; if (!c) { bad++; console.log('FAIL', m); } }
function eq(a, b, m) { ok(JSON.stringify(a) === JSON.stringify(b), m + ' (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')'); }
function A(o) { var a = Q.defaults(); for (var k in o) a[k] = o[k]; return a; }
function ids(a) { return Q.visibleSteps(a).map(function (s) { return s.id; }); }

// step counts / show-if paths
var male = A({ gender: 'Male', currentGlp1: 'No' }), female = A({ gender: 'Female', currentGlp1: 'No' });
eq(ids(male).length, 16, 'man, no GLP-1: 16 screens');
eq(ids(female).length, 17, 'woman, no GLP-1: 17 screens');
['Compounded Semaglutide', 'Compounded Tirzepatide', 'Mounjaro', 'Wegovy', 'Zepbound', 'Ozempic'].forEach(function (d) {
  var f = A({ gender: 'Female', currentGlp1: 'Yes, GLP-1 medication', currentGlp1Type: d });
  var v = ids(f);
  eq(v.length, 20, 'woman on ' + d + ': 20 screens');
  ok(v.indexOf('lastDoseStrength' + d.replace(/\s/g, '')) >= 0, 'last-dose screen for ' + d);
  eq(v.filter(function (x) { return /^lastDoseStrength/.test(x); }).length, 1, 'exactly one last-dose screen for ' + d);
});
eq(ids(A({ gender: 'Male', currentGlp1: 'Yes, GLP-1 medication', currentGlp1Type: 'Wegovy' })).length, 19, 'man on Wegovy: 19 screens');
ok(ids(male).indexOf('pregnancyStatus') < 0 && ids(female).indexOf('pregnancyStatus') === 2, 'pregnancy screen: women only, 3rd');
eq(ids(male)[0], 'heightWeight', 'first screen'); eq(ids(male)[15], 'contactInfo', 'last screen (man)');
var g = C.steps.filter(function (s) { return s.id === 'currentGlp1'; })[0];
eq(Q.visibleQuestions(g, A({ currentGlp1: 'No', opiates: 'No' })).map(function (q) { return q.id; }), ['currentGlp1', 'opiates'], 'medication screen, no GLP-1');
eq(Q.visibleQuestions(g, A({ currentGlp1: 'Yes, GLP-1 medication', opiates: 'Yes' })).length, 4, 'medication screen, GLP-1 + opiates: 4 questions');

// BMI
eq(Q.bmiText(A({ feet: 5, inches: 6, weight: 220 })), '35.5', 'BMI 5\'6" 220 lb');
eq(Q.bmiText(A({ feet: 6, inches: 0, weight: 130 })), '17.6', 'BMI 6\'0" 130 lb');
eq(Q.bmiText(A({ feet: 5, inches: null, weight: 200 })), '', 'BMI hidden until height + weight');
eq(C.bmiDecision(19.99).kind, 'reject', 'BMI < 20 rejected'); eq(C.bmiDecision(20).kind, 'route', 'BMI 20 allowed');

// weight validators
var hw = C.steps[0];
function qv(step, id, v, a) { var q = step.questions.filter(function (x) { return x.id === id; })[0]; return Q.validate(q, v, a || A({})); }
eq(qv(hw, 'weight', 50), 'Please enter a valid weight between 100 and 500 lbs.', 'weight < 100');
eq(qv(hw, 'weight', 220), '', 'weight ok');
eq(qv(hw, 'goalWeight', 230, A({ weight: 220 })), 'Your goal weight must be less than your current weight.', 'goal >= weight');
eq(qv(hw, 'goalWeight', 90, A({ weight: 220 })), 'Please enter a valid goal weight between 100 and 400 lbs.', 'goal < 100');

// 18+
var y = new Date().getFullYear();
eq(C.DOB_YEARS[0], y - 18, 'youngest year offered = this year - 18');
var gs = C.steps[1], tomorrow = new Date(Date.now() + 864e5);
ok(qv(gs, 'dobYear', y - 18, A({ dobMonth: tomorrow.getMonth() + 1, dobDay: tomorrow.getDate() })) !== '' || tomorrow.getFullYear() !== y, '17 years 364 days -> under 18 message');
eq(qv(gs, 'dobYear', 1985, A({ dobMonth: 3, dobDay: 14 })), '', 'adult ok');
eq(qv(gs, 'dobDay', 31, A({ dobMonth: 2, dobYear: 1990 })), 'This date is not valid for the selected month.', 'Feb 31 invalid');

// contact validators + mask
var ci = C.steps[C.steps.length - 1];
eq(qv(ci, 'email', 'jane@example'), 'Please enter a valid email address.', 'bad e-mail');
eq(qv(ci, 'email', 'jane@example.com'), '', 'good e-mail');
eq(Q.maskPhone('5555555555'), '(555) 555-5555', 'phone mask'); eq(qv(ci, 'phone', '(555) 555-5'), 'Please enter a valid US phone number.', 'short phone');
eq(qv(C.steps.filter(function (s) { return s.id === 'personalInfo'; })[0], 'firstName', 'J4ne'), 'Please enter a valid name (letters, spaces, hyphens, or apostrophes).', 'name pattern');
eq(Q.defaults().consent && Q.defaults().smsConsent ? 'pre-ticked' : 'no', 'pre-ticked', 'both consents start ticked (as theirs)');

// timeline + dynamic copy
eq(Q.weeksToGoal(A({ weight: 220, goalWeight: 170 })), 50, 'goal in 50 weeks (1 lb/week lower bound)');
var pace = C.steps.filter(function (s) { return s.id === 'pace'; })[0];
eq(Q.subtext(pace, A({ weight: 220, goalWeight: 170 })), 'Based on your profile, you may lose approximately 1-2 lbs per week, reaching your goal in about 50 weeks.', 'timeline copy');
var me = C.steps.filter(function (s) { return s.id === 'menEffects'; })[0];
eq(Q.heading(me, A({ gender: 'Male' })), 'Men experience unique effects from weight gain.', 'men heading');
eq(Q.heading(me, A({ gender: 'Female' })), 'Women experience unique effects from weight gain.', 'women heading');
eq(Q.heading(ci, A({ firstName: 'Jane' })), 'Jane, how should we reach you?', 'contact heading');
eq(Q.heading(ci, A({})), 'How should we reach you?', 'contact heading without a name');

// auto-advance + "None" exclusivity
eq(Q.toggleMulti(['Hair Loss'], 'None of these', true), ['None of these'], 'None clears others');
eq(Q.toggleMulti(['None of these'], 'Hair Loss', true), ['Hair Loss'], 'another pick clears None');
eq(Q.toggleMulti(['Adjust your caloric intake'], 'Neither at this time', true), ['Adjust your caloric intake', 'Neither at this time'], '"Neither" is not exclusive (as theirs)');
var pr = C.steps.filter(function (s) { return s.id === 'priority'; })[0], mc1 = C.steps.filter(function (s) { return s.id === 'medicalConditions1'; })[0];
ok(Q.autoAdvances(pr, A({ priority: 'Lose Weight' })), 'single-choice screen auto-advances');
ok(Q.autoAdvances(mc1, A({ medicalConditions1: ['None of these'] })), 'None auto-advances');
ok(!Q.autoAdvances(mc1, A({ medicalConditions1: ['Hypertension'] })), 'other multi picks wait for Next');
ok(!Q.autoAdvances(gs, A({ gender: 'Male' })), 'multi-question screen waits for Next');

// DQ rules + Finish routing
eq(Object.keys(C.DQ_RULES).sort(), ['medicalConditions1', 'medicalConditions2', 'pregnancyStatus', 'suicidal'], 'DQ fields');
var okA = A({ feet: 5, inches: 6, weight: 220, shippingState: 'Texas' });
eq(Q.finishRoute(okA).go, '../checkout/', 'clean answers -> checkout');
eq(Q.finishRoute(A({ feet: 5, inches: 6, weight: 220, shippingState: 'Louisiana' })).go, '../not-eligible/?reason=state_louisiana', 'Louisiana');
eq(Q.finishRoute(A({ feet: 6, inches: 0, weight: 130, shippingState: 'Texas' })).go, '../not-eligible/?reason=bmi_too_low', 'BMI < 20');
[['pregnancyStatus', ['Currently or possibly pregnant']], ['pregnancyStatus', ['Breastfeeding or bottle-feeding with breastmilk']],
 ['medicalConditions1', ['Type 1 diabetes']], ['medicalConditions1', ['Type 2 Diabetes (on insulin or sulfonylureas)']], ['suicidal', 'Yes'],
 ['medicalConditions2', ['Gallbladder disease']], ['medicalConditions2', ['Cirrhosis or end-stage liver disease']],
 ['medicalConditions2', ['History of or current pancreatitis']], ['medicalConditions2', ['On blood thinners/warfarin']]].forEach(function (x) {
  var a = A({ feet: 5, inches: 6, weight: 220, shippingState: 'Texas' }); a[x[0]] = x[1];
  eq(Q.concerns(a).length, 1, 'DQ: ' + JSON.stringify(x[1])); ok(Q.finishRoute(a).lockout === true, 'lockout: ' + JSON.stringify(x[1]));
});
['Have given birth to a child within the last 6 months'].forEach(function (o) { var a = A({ pregnancyStatus: [o] }); eq(Q.concerns(a).length, 0, 'not DQ: ' + o); });
eq(Q.concerns(A({ medicalConditions2: ['Pancreatitis (history or current)'] })).length, 0, 'their rule: only "History of or current pancreatitis" disqualifies');
eq(Q.finishRoute(A({ feet: 5, inches: 6, weight: 220, shippingState: 'Louisiana', suicidal: 'Yes' })).go, '../not-eligible/?reason=state_louisiana', 'Louisiana checked before DQ (as theirs)');

// resume
var half = A({ feet: 5, inches: 6, weight: 220, goalWeight: 170, dobMonth: 3, dobDay: 14, dobYear: 1985, gender: 'Female' });
eq(Q.startIndex(half), 2, 'resume at the first unfinished screen');
eq(Q.progressIndex('pace'), 2, 'progress: timeline is under Health'); eq(Q.progressIndex('contactInfo'), 4, 'progress: contact under Eligibility');

console.log(n + ' checks, ' + bad + ' failed'); process.exit(bad ? 1 : 0);
