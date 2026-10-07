/* Chime Health intake — the step config of the reference intake (captured 2026-10-06), brand switched.
   Every question, option, show/hide rule, DQ rule and projection formula is theirs, unchanged; only the brand name in
   the copy is Chime Health. The five dormant steps (pace, pace-confirmed, formulation, preference, further-info) stay
   in ALL_STEPS and are filtered out of FLOW exactly as the reference does — flip DORMANT to bring one back (the
   engine only renders screening / interstitial / results-contact, so a revived step also needs its renderer). */
(function (root) {
  "use strict";
  var hasIn = function (a, f, v) { return Array.isArray(a[f]) && a[f].indexOf(v) > -1; };
  var is = function (a, f, v) { return a[f] === v; };

  var HEALTH_1 = [
    { label: "None of the below", value: "none" },
    { label: "Severe kidney disease (on or about to be on dialysis)", value: "severe_kidney_disease" },
    { label: "Severe liver disease (including cirrhosis or any other severe liver disease)", value: "severe_liver_disease" },
    { label: "Current or prior eating disorder", value: "eating_disorder" },
    { label: "Current suicidal thoughts and/or prior suicidal attempt", value: "current_suicidal_thoughts" },
    { label: "Cancer (active diagnosis, active treatment, or in remission/cancer-free for less than 5 continuous years; does not apply to non-melanoma skin cancer cured via simple excision alone)", value: "cancer" },
    { label: "History of organ transplant on anti-rejection medication", value: "history_organ_transplant" },
    { label: "Severe gastrointestinal condition (gastroparesis, blockage, bowel resection, etc.)", value: "severe_gi_condition" },
    { label: "Currently untreated/unmonitored opioid, alcohol (including binge drinking), or substance use disorder/dependence", value: "untreated_substance_use_disorder" },
    { label: "Personal or family history of medullary thyroid cancer or multiple endocrine neoplasia syndrome type 2", value: "history_mtc_men2" },
    { label: "Type 2 diabetes on insulin or with an A1c greater than 10%", value: "type_2_diabetes_insulin_or_high_a1c" },
    { label: "Type 1 diabetes", value: "type_1_diabetes" },
    { label: "Diabetic retinopathy (diabetic eye disease), damage to the optic nerve from trauma or reduced blood flow, macular degeneration, or blindness", value: "diabetic_retinopathy" },
    { label: "Use of the blood thinner warfarin (Coumadin/Jantoven)", value: "warfarin" },
    { label: "History of or current pancreatitis", value: "pancreatitis" },
    { label: "Use of street drugs or any prescription medication without a valid prescription", value: "street_drugs_or_unprescribed_meds" },
    { label: "Heart attack or stroke in the past 1 year", value: "recent_heart_attack_or_stroke" },
    { label: "Current or average blood pressure range greater than 160/100 (High)", value: "high_blood_pressure_160_100" },
    { label: "Current or average resting heart rate range above 110 beats per minute (High)", value: "resting_heart_rate_over_110" },
    { label: "Coronary artery disease", value: "coronary_artery_disease" },
    { label: "Congestive heart failure", value: "congestive_heart_failure" },
    { label: "Untreated hypothyroidism", value: "untreated_hypothyroidism" },
    { label: "Gallbladder disease", value: "gall_bladder_disease" }
  ];
  var PREGNANCY = [
    { label: "None of the below", value: "none" },
    { label: "Pregnant, or possibly pregnant", value: "pregnant" },
    { label: "Breastfeeding", value: "breastfeeding" },
    { label: "Gave birth recently", value: "recent_birth" }
  ];
  var YES_NO = [{ label: "Yes", value: "yes" }, { label: "No", value: "no" }];

  var SCREENING = [
    { kind: "measurements", id: "measurements", q: "What is your current height and weight?" },
    { kind: "goal-weight", id: "goal-weight", q: "What is your goal weight?", sub: "We're in this together. Your goal is our goal." },
    { kind: "state", id: "state", q: "What state will your medication be shipped to?" },
    { kind: "dob", id: "dob", q: "What is your date of birth?" },
    { kind: "choice", id: "sex", field: "sex", q: "Are you male or female?",
      options: [{ label: "Female", value: "female", icon: "female" }, { label: "Male", value: "male", icon: "male" }] },
    { kind: "multi", id: "pregnancy", field: "pregnancy_conditions", q: "Do any of these apply to you right now?", noneValue: "none",
      options: PREGNANCY, showIf: function (a) { return is(a, "sex", "female"); },
      info: "contraception", infoIf: function (a) { return hasIn(a, "pregnancy_conditions", "none"); } },
    { kind: "multi", id: "health-1", field: "health_conditions_1", q: "Do any of the following apply to you?", noneValue: "none", options: HEALTH_1 },
    { kind: "choice", id: "gallbladder-removed", field: "gallbladder_removed", q: "Has your gallbladder been removed?", options: YES_NO,
      showIf: function (a) { return hasIn(a, "health_conditions_1", "gall_bladder_disease"); } },
    { kind: "multi", id: "health-2", field: "health_conditions_2", q: "Do any of these health conditions or situations apply to you?", noneValue: "none",
      options: [
        { label: "None of the below", value: "none" },
        { label: "Inflammatory bowel disease or IBD (Crohn's disease, ulcerative colitis, etc.)", value: "ibd" },
        { label: "Bariatric or abdominal/pelvic surgery within the past 1 year", value: "bariatric_surgery_past_year" },
        { label: "Low sodium levels or a diagnosis of SIADH (syndrome of inappropriate antidiuretic hormone secretion)", value: "low_sodium_siadh" },
        { label: "Ongoing chronic use of opiate pain medications", value: "chronic_opiate_use" },
        { label: "Current or routine use of opiate medications", value: "routine_opiate_use" },
        { label: "Personal history of thyroid cancer (other than medullary thyroid carcinoma)", value: "thyroid_cancer_non_medullary" },
        { label: "Other thyroid disease (hyperthyroidism, Graves', goiter, nodules, etc.)", value: "thyroid_disease_other" },
        { label: "History of active, suspected, or prior cancer of any kind", value: "prior_cancer_any" },
        { label: "Binge drinking (4 or more drinks for women, 5 or more for men, on a single occasion)", value: "binge_drinking" },
        { label: "Prior bariatric (weight loss) surgery", value: "prior_bariatric_surgery" }
      ] },
    { kind: "details", id: "chronic-opiate-details", field: "chronic_opiate_details", q: "Which opiate medication, and how long have you been taking it?",
      showIf: function (a) { return hasIn(a, "health_conditions_2", "chronic_opiate_use") || hasIn(a, "health_conditions_2", "routine_opiate_use"); } },
    { kind: "details", id: "bariatric-details", field: "bariatric_surgery_details", q: "Which surgery did you have, and when?",
      showIf: function (a) { return hasIn(a, "health_conditions_2", "prior_bariatric_surgery") || hasIn(a, "health_conditions_2", "bariatric_surgery_past_year"); } },
    { kind: "choice", id: "taking-meds", field: "taking_meds", q: "Are you currently taking any medications?", options: YES_NO },
    { kind: "details", id: "taking-meds-details", field: "taking_meds_details", q: "Which medications, and at what dose?", placeholder: "List each medication and dose",
      showIf: function (a) { return is(a, "taking_meds", "yes"); } },
    { kind: "choice", id: "allergies", field: "medication_allergies", q: "Do you have any medication allergies?", options: YES_NO },
    { kind: "details", id: "allergies-details", field: "medication_allergies_details", q: "Which medications, and what happens?", placeholder: "List each allergy and the reaction",
      showIf: function (a) { return is(a, "medication_allergies", "yes"); } },
    { kind: "choice", id: "glp-history", field: "glp_history", q: "Are you currently or have recently taken a GLP-1 medication?",
      options: [{ label: "Yes", value: "yes_currently_glp_1" }, { label: "No", value: "no" }] },
    { kind: "choice", id: "glp-med-type", field: "glp1_medication_type", q: "Which medication?",
      options: [{ label: "Semaglutide (Ozempic, Wegovy, Rybelsus)", value: "semaglutide" }, { label: "Tirzepatide (Zepbound, Mounjaro)", value: "tirzepatide" }, { label: "Something else", value: "other" }],
      showIf: function (a) { return is(a, "glp_history", "yes_currently_glp_1"); } },
    { kind: "details", id: "glp-other-details", field: "glp1_other_details", q: "Which medication are you taking?",
      showIf: function (a) { return is(a, "glp1_medication_type", "other"); } },
    { kind: "choice", id: "glp-dose", field: "glp1_dose", q: "What was your last dose?",
      options: [{ label: "0.25 mg", value: "0.25mg" }, { label: "0.5 mg", value: "0.5mg" }, { label: "1 mg", value: "1mg" }, { label: "1.5 mg", value: "1.5mg" },
        { label: "2 mg", value: "2mg" }, { label: "2.5 mg", value: "2.5mg" }, { label: "5 mg", value: "5mg" }, { label: "7.5 mg", value: "7.5mg" },
        { label: "10 mg", value: "10mg" }, { label: "12.5 mg", value: "12.5mg" }, { label: "15 mg", value: "15mg" }, { label: "I'm not sure", value: "unsure" },
        { label: "Not listed here", value: "not_listed" }],
      showIf: function (a) { return is(a, "glp1_medication_type", "semaglutide") || is(a, "glp1_medication_type", "tirzepatide"); } },
    { kind: "choice", id: "glp-last-dose-date", field: "glp1_last_dose_date", q: "When was that last dose?",
      options: [{ label: "In the last 7 days", value: "days_0_7_ago" }, { label: "8 – 14 days ago", value: "days_8_14_ago" },
        { label: "15 – 30 days ago", value: "days_15_to_30_ago" }, { label: "More than 30 days ago", value: "days_30_plus_ago" }],
      showIf: function (a) { return is(a, "glp_history", "yes_currently_glp_1"); } },
    { kind: "choice", id: "glp-next-preference", field: "glp1_next_preference", q: "What would you like to do next?",
      options: [{ label: "Stay on my current dose", value: "same_dosage" }, { label: "Go up a dose", value: "increase_dosage" },
        { label: "Go down a dose", value: "decrease_dosage" }, { label: "Switch medication", value: "change_medications" },
        { label: "Let my provider decide", value: "provider_decide" }],
      showIf: function (a) { return is(a, "glp_history", "yes_currently_glp_1"); } }
  ];

  var ALL_STEPS = [
    { kind: "screening", id: "screening", q: "Reach your goal weight fast", qAccent: "without restrictive diets and exercise.",
      sub: "Please answer the following questions so we can qualify you for medical weight loss.", cta: "Next →", blocks: SCREENING },
    { kind: "interstitial", id: "qualified", q: "You're a Great Fit for Chime Health.",
      body: ["You're minutes away from starting doctor-guided GLP-1 weight loss care — at the lowest locked-in price you'll find.",
        "Members using GLP-1 medications alongside diet and exercise typically see meaningful results in their first months.*"],
      cta: "I'm ready — let's go", showcase: true },
    { kind: "single", id: "pace", field: "weight_loss_pace", q: "How does that pace work for you?", sub: "There's no single right answer — your provider sets the pace with you.",
      lead: "pace", variant: "cards3", options: [{ label: "That works for me", value: "works_for_me", icon: "check" }, { label: "I want it faster", value: "i_want_faster", icon: "run" },
        { label: "That's too fast", value: "too_fast", icon: "hourglass" }], autoAdvance: true },
    { kind: "interstitial", id: "pace-confirmed", q: "Good — that's the pace we'll aim for.",
      body: ["Losing {toLose} is more achievable than it sounds, and it doesn't take a restrictive diet."], cta: "Next →", branchOn: "weight_loss_pace",
      variants: { works_for_me: { q: "Perfect!", body: ["Losing {toLose} is more achievable than it sounds, and it doesn't take a restrictive diet."] },
        i_want_faster: { q: "Not a problem — we can move faster.", body: ["It takes work, but with GLP-1 medication your goal of losing {toLose} is well within reach, and it doesn't take a restrictive diet."] },
        too_fast: { q: "We'll move at your pace.", body: ["With GLP-1 medication, losing {toLose} is more achievable than it sounds, and it doesn't take a restrictive diet."] } } },
    { kind: "multi", id: "formulation", field: "formulation", q: "Beyond losing weight, what matters most to you?",
      sub: "Choose as many as apply. Your provider uses these when choosing your formulation.",
      options: [{ label: "Holding onto muscle", value: "muscle_mass" }, { label: "Keeping side effects like nausea manageable", value: "concern_about_side_effects" },
        { label: "Healthy aging and longevity", value: "aging_longevity" }, { label: "Focus and mental clarity", value: "mental_clarity" },
        { label: "Steady energy through the day", value: "low_energy" }, { label: "Insulin resistance and hormones", value: "insulin_resistance" },
        { label: "Sleeping better", value: "sleep_quality" }] },
    { kind: "single", id: "preference", field: "affordability_or_potency_preference", q: "Which of these is more important to you?",
      sub: "You'll still be able to choose either medication on the next screen.", lead: "match", variant: "cards",
      options: [{ label: "Affordability", value: "affordability", sub: "Lowest price", icon: "affordable" }, { label: "Potency", value: "potency", sub: "Stronger dose", icon: "potent" }],
      autoAdvance: true },
    { kind: "single", id: "further-info", field: "further_info_yes_no", q: "Is there anything else you'd like your provider to know?",
      sub: "You'll also be able to message your provider after your visit.", lead: "review", variant: "grid", options: YES_NO, autoAdvance: true,
      details: { on: "yes", field: "further_info_text", placeholder: "Add any detail your provider should know" } },
    { kind: "results-contact", id: "results", q: "Your medical profile", sub: "Let's proceed to check your eligibility" }
  ];
  var DORMANT = ["pace", "pace-confirmed", "formulation", "preference", "further-info"];
  var FLOW = ALL_STEPS.filter(function (s) { return DORMANT.indexOf(s.id) === -1; });

  // DQ: answers that disqualify, and the one exception (gallbladder disease is fine if the gallbladder was removed).
  var DQ = {
    pregnancy_conditions: ["pregnant", "breastfeeding"],
    health_conditions_1: ["history_mtc_men2", "eating_disorder", "severe_kidney_disease", "severe_liver_disease", "current_suicidal_thoughts", "cancer",
      "severe_gi_condition", "untreated_substance_use_disorder", "untreated_hypothyroidism", "gall_bladder_disease", "type_2_diabetes_insulin_or_high_a1c",
      "type_1_diabetes", "diabetic_retinopathy", "warfarin", "pancreatitis", "high_blood_pressure_160_100", "resting_heart_rate_over_110"]
  };
  var DQ_EXCEPT = { gall_bladder_disease: function (a) { return String(a.gallbladder_removed || "") === "yes"; } };
  var DQ_MESSAGE = { gall_bladder_disease: "Active gallbladder disease without surgical removal of the gallbladder is a contraindication for GLP-1 medication. We are unable to prescribe weight loss medication at this time." };
  var LABELS = {};
  HEALTH_1.concat(PREGNANCY).forEach(function (o) { LABELS[o.value] = o.label; });

  function dqHits(field, a) {
    var list = DQ[field]; if (!list) return [];
    var v = a[field], arr = Array.isArray(v) ? v : v ? [String(v)] : [];
    return arr.filter(function (x) { return list.indexOf(x) > -1 && !(DQ_EXCEPT[x] && DQ_EXCEPT[x](a)); });
  }
  function isDisqualifying(field, a) { return dqHits(field, a).length > 0; }
  function hasDisqualifyingAnswer(a) { return Object.keys(DQ).some(function (f) { return isDisqualifying(f, a); }); }
  function disqualifyReason(a) {
    var fs = Object.keys(DQ);
    for (var i = 0; i < fs.length; i++) {
      var hit = dqHits(fs[i], a)[0];
      if (hit) {
        if (DQ_MESSAGE[hit]) return DQ_MESSAGE[hit];
        var l = LABELS[hit];
        return l ? "Based on your answer — “" + l + "” — we are unable to prescribe weight loss medication at this time."
                 : "Based on your answers, we are unable to prescribe weight loss medication at this time.";
      }
    }
    return null;
  }
  function visibleBlocks(blocks, a) { return blocks.filter(function (b) { return !b.showIf || b.showIf(a); }); }
  // Clear answers of blocks that are hidden now (their pruneAnswers)
  function pruneAnswers(prev) {
    var a = Object.assign({}, prev);
    SCREENING.forEach(function (b) {
      if (!b.showIf || b.showIf(a)) return;
      var f = b.field;
      if (f && a[f] !== undefined && a[f] !== "") a[f] = Array.isArray(a[f]) ? [] : "";
    });
    FLOW.forEach(function (s) {
      if (s.kind === "single" && s.details && a[s.field] !== s.details.on && a[s.details.field]) a[s.details.field] = "";
    });
    return a;
  }
  // Multi-select toggle with the exclusive "None of the below"
  function toggleMulti(cur, v, none) {
    var arr = Array.isArray(cur) ? cur : [];
    if (v === none) return arr.indexOf(none) > -1 ? [] : [none];
    if (arr.indexOf(v) > -1) return arr.filter(function (x) { return x !== v; });
    return arr.filter(function (x) { return x !== none; }).concat([v]);
  }

  var STATES = [["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],["CO","Colorado"],["CT","Connecticut"],
    ["DE","Delaware"],["DC","District of Columbia"],["FL","Florida"],["GA","Georgia"],["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],
    ["IA","Iowa"],["KS","Kansas"],["KY","Kentucky"],["ME","Maine"],["MD","Maryland"],["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],
    ["MO","Missouri"],["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],["NM","New Mexico"],["NY","New York"],
    ["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],
    ["SC","South Carolina"],["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],["VA","Virginia"],["WA","Washington"],
    ["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],["AS","American Samoa"],["GU","Guam"],["MP","Northern Mariana Islands"],["PR","Puerto Rico"],
    ["UM","U.S. Minor Outlying Islands"],["VI","U.S. Virgin Islands"]].map(function (s) { return { code: s[0], name: s[1] }; });
  var BLOCKED_STATES = ["LA", "MS"];   // theirs: LA and MS are left out of the picker list, and blocked if they arrive anyway (e.g. restored answers)
  function blockedStateMessage(s) { return BLOCKED_STATES.indexOf(String(s == null ? "" : s).trim().toUpperCase()) > -1 ? "Service is not available in this state" : ""; }
  function isServiceableState(s) {
    var c = String(s == null ? "" : s).trim().toUpperCase();
    return !!c && !blockedStateMessage(c) && STATES.some(function (x) { return x.code === c; });
  }

  // Projections (their computeBmi / computeProjections)
  function computeBmi(a) {
    var w = Number(a.weight), h = 12 * Number(a.feet) + Number(a.inches);
    return w > 0 && h > 0 ? Math.round(w / (h * h) * 7030) / 10 : null;
  }
  var r1 = function (x) { return Math.round(10 * x) / 10; };
  function computeProjections(a) {
    var w = Number(a.weight) || 0, g = Number(a.goal_weight) || 0, toLose = w > 0 && g > 0 ? Math.max(0, w - g) : 0;
    var lo = w > 0 ? r1(0.015 * w) : 0, hi = w > 0 ? r1(0.02 * w) : 0;
    return { startWeight: w, goalWeight: g, weightToLose: toLose, bmi: computeBmi(a), weeklyLossLow: lo, weeklyLossHigh: hi,
      weeksToGoal: toLose > 0 && lo > 0 ? Math.max(1, Math.round(toLose / lo)) : 0 };
  }

  root.CHIME_INTAKE = {
    SCREENING: SCREENING, ALL_STEPS: ALL_STEPS, DORMANT: DORMANT, FLOW: FLOW, DQ: DQ,
    ANSWERS_KEY: "chime-intake-answers-v1",      // sessionStorage: screening → recommendation → checkout
    PROGRESS_KEY: "chime-intake:progress",       // sessionStorage: answers + step, so Back / reload keep them
    STATES: STATES, BLOCKED_STATES: BLOCKED_STATES, blockedStateMessage: blockedStateMessage, isServiceableState: isServiceableState,
    isDisqualifying: isDisqualifying, hasDisqualifyingAnswer: hasDisqualifyingAnswer, disqualifyReason: disqualifyReason,
    visibleBlocks: visibleBlocks, pruneAnswers: pruneAnswers, toggleMulti: toggleMulti,
    computeBmi: computeBmi, computeProjections: computeProjections
  };
})(typeof window !== "undefined" ? window : globalThis);
