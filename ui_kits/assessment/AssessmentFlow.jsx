// Chime Health — Assessment flow (engine + page component).
// Logic ported from uploads/PortalIntake1-main/js/quiz-logic.js, restated on
// React state instead of localStorage + DOM. The invariants preserved:
//
//   - THE ASSESSMENT OPENS ON THE PROGRAM PICKER. The visitor orders one or
//     more programs (multi-select: "combine them into a single intake"), or
//     arrives with ?product=GLP / ?product=GLP,NAD on the URL, which wins, is
//     persisted, and skips the picker. The ordered programs decide exactly two
//     things: which steps the visitor walks (baseline + each ordered program's
//     steps) and which disqualifier keys open on submit (baseline + each
//     ordered program's key). A program they did not order can never fail them.
//   - NOBODY IS DISQUALIFIED AT THE POINT OF QUESTION. Every open key runs
//     ONCE, on submit, against the whole record, producing a per-key verdict.
//     A key with no authored rules (NAD, PEP) passes vacuously and its verdict
//     is tagged unauthored: true — "passed our screen" and "we have no screen"
//     must never read the same.
//   - Each step gates on every visible question being answered.
//   - Hiding a conditional block clears what it holds. Answers is the single
//     source of truth here, so the source's load/change asymmetry (a DOM-restore
//     hazard) does not apply: asmtDerive() re-runs after every change.
//   - "None of these" style options are mutually exclusive with real conditions.
//   - A selected answer named by an ACTIVE key reveals a confirm box, required
//     to advance. An acknowledgement (form[confirm_<qid>]), not an override.
//   - Fail closed: an answered option that is neither safe nor named by any key
//     fails every open key.
//
// Age bands (do NOT round BMI to close the gaps — 22.96 must stay under 23):
//   65+:   BMI < 22 disqualifies; BMI >= 22 needs the elderly consent.
//   18-64: BMI < 20 disqualifies; 20 <= BMI < 23 needs the metabolic consent.
// The two consent boxes belong to whichever key owns the age-bmi rule (GLP),
// derived from the config — a NAD-only order sees neither box nor rule.

const ASMT_STORE_KEY = "chime_assessment_v1";
const ASMT_DOB_MIN_YEAR = 1940;
const ASMT_MIN_AGE = 18;

const ASMT = () => window.CHIME_ASSESSMENT;

// ---------------------------------------------------------------------------
// Ordered programs
// ---------------------------------------------------------------------------
function asmtCatById(id) {
  return ASMT().categories.find((c) => c.id === id) || null;
}

// Every declared non-baseline program is routable, even one whose key is not
// authored yet. An unknown value is not: it names a program we do not have, so
// it is dropped, never guessed at.
function asmtNormalizeProducts(raw) {
  const routable = ASMT().categories.filter((c) => !c.baseline).map((c) => c.id);
  const arr = Array.isArray(raw) ? raw : String(raw || "").split(",");
  const out = [];
  for (const item of arr) {
    const v = String(item).trim().toUpperCase();
    if (routable.indexOf(v) >= 0 && out.indexOf(v) < 0) out.push(v);
  }
  return out;
}

function asmtUrlProducts() {
  try {
    const m = location.search.match(/[?&]product=([^&]*)/);
    return asmtNormalizeProducts(decodeURIComponent(m ? m[1] : ""));
  } catch (e) { return []; }
}

// Baseline steps plus every ordered program's steps. No program: baseline only.
function asmtActiveSteps(products) {
  return ASMT().steps.filter((s) => {
    const c = asmtCatById(s.category);
    return (c && c.baseline) || products.indexOf(s.category) >= 0;
  });
}

// The keys that open on submit: exactly the baseline plus every ordered program.
function asmtActiveKeys(products) {
  const keys = ASMT().baseline.slice();
  for (const p of products) if (keys.indexOf(p) < 0) keys.push(p);
  return keys;
}

// ---------------------------------------------------------------------------
// Date of birth + BMI
// ---------------------------------------------------------------------------
function asmtMaskDob(raw) {
  const digits = String(raw || "").replace(/\D/g, "").slice(0, 8);
  if (digits.length > 4) return digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4);
  if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

function asmtParseDob(str) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(str || "").trim());
  if (!m) return null;
  const mo = +m[1], da = +m[2], yr = +m[3];
  // Round-trip through Date: rejects 02/31 and friends, which the regex allows.
  const dt = new Date(yr, mo - 1, da);
  if (dt.getFullYear() !== yr || dt.getMonth() !== mo - 1 || dt.getDate() !== da) return null;
  return { m: mo, d: da, y: yr };
}

function asmtAgeOf(d) {
  const y = parseInt(d["form[dob_year]"], 10), m = parseInt(d["form[dob_month]"], 10), day = parseInt(d["form[dob_day]"], 10);
  if (!y || !m || !day) return NaN;
  const now = new Date();
  let age = now.getFullYear() - y;
  const thisMonth = now.getMonth() + 1;
  if (thisMonth < m || (thisMonth === m && now.getDate() < day)) age--;
  return age;
}

function asmtDobError(d) {
  const raw = String(d["form[dob]"] || "").trim();
  if (!raw) return "Please enter your date of birth";
  const p = asmtParseDob(raw);
  if (!p) return "Please enter your date of birth as MM/DD/YYYY";
  if (p.y < ASMT_DOB_MIN_YEAR) return "Please enter a birth year of " + ASMT_DOB_MIN_YEAR + " or later";
  const age = asmtAgeOf({ "form[dob_year]": p.y, "form[dob_month]": p.m, "form[dob_day]": p.d });
  if (age < 0) return "That date is in the future";
  if (age < ASMT_MIN_AGE) return "You must be at least " + ASMT_MIN_AGE + " to continue";
  return "";
}

function asmtBmiRating(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  if (bmi < 35) return "Obese (Class I)";
  if (bmi < 40) return "Obese (Class II)";
  return "Obese (Class III)";
}

function asmtBmiOf(d) {
  const b = parseFloat(d["form[bmi]"]);
  return isNaN(b) ? NaN : b;
}

function asmtElderlyLowBmi(d) {
  const a = asmtAgeOf(d), b = asmtBmiOf(d);
  return a >= 65 && !isNaN(b) && b < 22;
}
function asmtElderlyNeedsConsent(d) {
  const a = asmtAgeOf(d), b = asmtBmiOf(d);
  return a >= 65 && !isNaN(b) && b >= 22;
}
function asmtAdultBand(d) {
  const a = asmtAgeOf(d);
  return a >= 18 && a <= 64;
}
function asmtAdultLowBmi(d) {
  const b = asmtBmiOf(d);
  return asmtAdultBand(d) && !isNaN(b) && b < 20;
}
function asmtAdultNeedsMetabolicConsent(d) {
  const b = asmtBmiOf(d);
  return asmtAdultBand(d) && !isNaN(b) && b >= 20 && b < 23;
}

const ASMT_TESTS = {
  ageBmi: (d) => asmtElderlyLowBmi(d) || asmtAdultLowBmi(d),
};

// The two age-and-BMI consent boxes are the non-fatal half of the age-bmi rule,
// so they belong to whichever key owns it — derived, never hardcoded, so the
// rule and the boxes cannot drift apart.
function asmtAgeBmiKey() {
  const keys = ASMT().dqKeys;
  for (const cat in keys)
    if ((keys[cat] || []).some((r) => r.id === "age-bmi")) return cat;
  return "";
}

function asmtConsentsApply(products) {
  const owner = asmtAgeBmiKey();
  return !!owner && asmtActiveKeys(products).indexOf(owner) >= 0;
}

// ---------------------------------------------------------------------------
// Disqualification — evaluated once, on submit, over the ACTIVE keys only
// ---------------------------------------------------------------------------
function asmtRuleReasons(rule, d) {
  if (rule.kind === "test") {
    const fn = ASMT_TESTS[rule.test];
    return fn && fn(d) ? [rule.label] : [];
  }
  const v = d[rule.field];
  if (v === undefined || v === null || v === "") return [];
  if (rule.kind === "single") return (rule.values || []).indexOf(v) >= 0 ? [rule.label] : [];
  if (!v.length) return [];
  return v.filter((x) => (rule.values || []).indexOf(x) >= 0);
}

function asmtNamedByAnyKey(field, value) {
  const keys = ASMT().dqKeys;
  for (const cat in keys)
    for (const r of keys[cat])
      if (r.field === field && (r.values || []).indexOf(value) >= 0) return true;
  return false;
}

// Fail closed: an option someone added without deciding what it blocks fails
// every key rather than quietly passing.
function asmtUnmappedAnswers(d) {
  const out = [];
  const coverage = ASMT().coverage;
  for (const field in coverage) {
    const cov = coverage[field];
    if (cov.safeAll) continue;
    const v = d[field];
    if (v === undefined || v === null || v === "") continue;
    const vals = Array.isArray(v) ? v : [v];
    for (const val of vals) {
      if ((cov.safe || []).indexOf(val) >= 0) continue;
      if (asmtNamedByAnyKey(field, val)) continue;
      out.push(val);
    }
  }
  return out;
}

function asmtEvaluateKeys(d, products) {
  const keys = asmtActiveKeys(products);
  const unmapped = asmtUnmappedAnswers(d);
  const out = { products: products.slice(), product: products.join(","), keys };
  for (const cat of keys) {
    const catDef = asmtCatById(cat);
    const verdict = { pass: true, reasons: [] };
    // A vacuous pass is byte-identical to a real one; the tag is what keeps the
    // back end from reading "no NAD screen exists" as "passed our NAD screen".
    if (catDef && !catDef.keyAuthored) verdict.unauthored = true;
    for (const r of ASMT().dqKeys[cat] || []) {
      for (const reason of asmtRuleReasons(r, d)) {
        verdict.pass = false;
        verdict.reasons.push({ id: r.id, reason });
      }
    }
    for (const u of unmapped) {
      verdict.pass = false;
      verdict.reasons.push({ id: "unmapped-option", reason: u });
    }
    out[cat] = verdict;
  }
  return out;
}

function asmtAnyKeyFailed(result) {
  return (result.keys || []).some((k) => result[k] && !result[k].pass);
}

// The options/single rules on ACTIVE keys that put a confirm box under their
// question. A GLP-only contraindication raises no box for a NAD-only order.
// kind "test" (age-bmi) is excluded: it owns the consent boxes instead.
function asmtConfirmRules(products) {
  const out = [];
  for (const cat of asmtActiveKeys(products))
    for (const r of ASMT().dqKeys[cat] || [])
      if ((r.kind === "options" || r.kind === "single") && r.qid) out.push(r);
  return out;
}

function asmtConfirmTriggers(d, products) {
  const on = {};
  for (const r of asmtConfirmRules(products))
    if (!on[r.qid] && asmtRuleReasons(r, d).length) on[r.qid] = true;
  return on;
}

function asmtConfirmName(qid) { return "form[confirm_" + qid + "]"; }

// ---------------------------------------------------------------------------
// Derived record. Runs after every change: recomputes BMI + DOB parts and
// clears everything whose controlling condition no longer holds, so a stale
// answer (pregnancy answers on a male record, a semaglutide dose after
// switching to "None", an acknowledgement for an answer that changed back to
// safe or for a program no longer ordered) can never ride along to submit.
// ---------------------------------------------------------------------------
function asmtDerive(prev, products) {
  const d = { ...prev };

  // BMI from height + weight (703 * lbs / in^2). Stored at two decimals: the
  // stored value feeds the age-and-BMI rules; the readout prints one.
  const ft = parseFloat(d["form[height_feet]"]);
  const inch = parseFloat(d["form[height_inches]"]);
  const lbs = parseFloat(d["form[weight]"]);
  const totalIn = (ft > 0 ? ft * 12 + (isNaN(inch) ? 0 : inch) : 0);
  if (ft > 0 && lbs > 0 && totalIn > 0) {
    const bmi = (703 * lbs) / (totalIn * totalIn);
    d["form[bmi]"] = bmi.toFixed(2);
    d["form[bmi_rating]"] = asmtBmiRating(bmi);
  } else {
    delete d["form[bmi]"];
    delete d["form[bmi_rating]"];
  }

  // DOB parts. An unparseable date leaves no trace — a stale age must never
  // survive an edit and drive the age rules.
  const p = asmtParseDob(d["form[dob]"]);
  if (p) {
    d["form[dob_month]"] = String(p.m);
    d["form[dob_day]"] = String(p.d);
    d["form[dob_year]"] = String(p.y);
  } else {
    delete d["form[dob_month]"];
    delete d["form[dob_day]"];
    delete d["form[dob_year]"];
  }

  // Conditional blocks clear when hidden.
  if (d["form[gender]"] !== "female") delete d["form[female_health_status][]"];

  for (const step of ASMT().steps) {
    for (const q of step.questions) {
      if (q.control === "select" && q.reveal && d[q.name] !== q.reveal.value) delete d[q.reveal.name];
      if (q.control === "radio" && q.arms) {
        for (const armValue in q.arms) {
          if (d[q.name] === armValue) continue;
          for (const sub of q.arms[armValue].questions) delete d[sub.name];
        }
      }
    }
  }

  // Age-and-BMI consents: only when their owner key is open for this order, and
  // at most one band applies; anything else deletes the stored acknowledgement
  // so it can never submit stale.
  const consentsApply = asmtConsentsApply(products);
  if (!consentsApply || !asmtElderlyNeedsConsent(d)) delete d["form[elderly_consent]"];
  if (!consentsApply || !asmtAdultNeedsMetabolicConsent(d)) delete d["form[metabolic_consent]"];

  // Confirm acknowledgements only survive while their rule still fires on an
  // active key. Clearing sweeps EVERY key's confirmable rules so dropping a
  // program also drops its acknowledgements.
  const on = asmtConfirmTriggers(d, products);
  for (const cat in ASMT().dqKeys) {
    for (const r of ASMT().dqKeys[cat] || []) {
      if ((r.kind !== "options" && r.kind !== "single") || !r.qid) continue;
      if (!on[r.qid]) delete d[asmtConfirmName(r.qid)];
    }
  }
  return d;
}

// ---------------------------------------------------------------------------
// Per-step validation. Returns { qid, message } for the first unanswered
// question, or null when the step can advance.
// ---------------------------------------------------------------------------
function asmtStepProblem(step, d, products) {
  for (const q of step.questions) {
    if (q.showWhen && d[q.showWhen.name] !== q.showWhen.value) continue;

    if (q.control === "identity") {
      for (const f of q.fields) {
        if (f.optional) continue;
        if (f.type === "dob") {
          const msg = asmtDobError(d);
          if (msg) return { qid: q.qid, message: msg };
          continue;
        }
        if (!String(d[f.name] || "").trim())
          return { qid: q.qid, message: "Please fill in " + f.label.toLowerCase().replace(/[:?]$/, "") };
      }
    } else if (q.control === "heightweight") {
      if (!(parseFloat(d["form[height_feet]"]) > 0) || !(parseFloat(d["form[weight]"]) > 0))
        return { qid: q.qid, message: "Please enter your height and weight" };
    } else if (q.control === "checkbox") {
      if (!(d[q.name] || []).length)
        return { qid: q.qid, message: "Please answer every question on this page" };
    } else if (q.control === "select" || q.control === "radio") {
      if (!d[q.name])
        return { qid: q.qid, message: "Please answer every question on this page" };
      if (q.reveal && d[q.name] === q.reveal.value && !String(d[q.reveal.name] || "").trim())
        return { qid: q.qid, message: "Please fill in the highlighted follow-up to continue" };
      if (q.arms && q.arms[d[q.name]]) {
        for (const sub of q.arms[d[q.name]].questions)
          if (!d[sub.name]) return { qid: q.qid, message: "Please answer every question on this page" };
      }
    } else if (q.control === "consent") {
      if (!q.optional && !d[q.name])
        return { qid: q.qid, message: "Please read and acknowledge to continue" };
    }
  }

  // Age-and-BMI consents live on step STDP1 and only bind when their owner key
  // is open for this order.
  if (step.id === "STDP1" && asmtConsentsApply(products)) {
    if (asmtElderlyNeedsConsent(d) && !d["form[elderly_consent]"])
      return { qid: "STDP1Q4", message: "Please read and acknowledge to continue" };
    if (asmtAdultNeedsMetabolicConsent(d) && !d["form[metabolic_consent]"])
      return { qid: "STDP1Q4", message: "Please read and acknowledge to continue" };
  }

  // A flagged answer awaiting its confirmation gates this step.
  const on = asmtConfirmTriggers(d, products);
  const stepQids = step.questions.map((q) => q.qid);
  for (const qid in on) {
    if (stepQids.indexOf(qid) >= 0 && !d[asmtConfirmName(qid)])
      return { qid, message: "Please review and confirm the highlighted answer to continue" };
  }
  return null;
}

// ---------------------------------------------------------------------------
// The page component. Screen index 0 is the program picker; 1..N are the
// active steps for the current order; a stored ?product= skips the picker.
// ---------------------------------------------------------------------------
function ChimeAssessmentFlow() {
  const cfg = ASMT();
  const [state, setState] = React.useState(() => {
    let answers = {}, screen = 0, products = [];
    try {
      const saved = JSON.parse(localStorage.getItem(ASMT_STORE_KEY) || "null");
      if (saved && saved.answers) {
        answers = saved.answers;
        screen = saved.screen || 0;
        products = asmtNormalizeProducts(saved.products || []);
      }
    } catch (e) {}
    // ?product= on the URL wins, is persisted (via the save effect), and skips
    // the picker — the entry-router behaviour of the source funnel.
    const fromUrl = asmtUrlProducts();
    if (fromUrl.length) {
      products = fromUrl;
      if (screen === 0) screen = 1;
    }
    // A changed order can shrink the walk; never restore past its end.
    screen = Math.min(screen, asmtActiveSteps(products).length);
    return { answers: asmtDerive(answers, products), screen, products, result: null };
  });
  const [flash, setFlash] = React.useState("");
  const flashTimer = React.useRef(null);
  const topRef = React.useRef(null);

  const { answers, screen, products, result } = state;
  const activeSteps = asmtActiveSteps(products);

  React.useEffect(() => {
    try { localStorage.setItem(ASMT_STORE_KEY, JSON.stringify({ answers, screen, products })); } catch (e) {}
  }, [answers, screen, products]);

  // Site chrome CTAs call window.openChimeAssessment(); on this page the
  // assessment is the page, so the call scrolls to the form.
  React.useEffect(() => {
    window.openChimeAssessment = () => {
      if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    return () => { delete window.openChimeAssessment; };
  }, []);

  const say = (msg) => {
    setFlash(msg);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(""), 2600);
  };

  const setField = (name, value) =>
    setState((s) => ({ ...s, answers: asmtDerive({ ...s.answers, [name]: value }, s.products) }));

  const toggleConsent = (name) =>
    setState((s) => {
      const next = { ...s.answers };
      // An unchecked box is absent, not empty: no trace that could read as agreement.
      if (next[name]) delete next[name]; else next[name] = "1";
      return { ...s, answers: asmtDerive(next, s.products) };
    });

  // "None of these" cannot coexist with a real condition.
  const toggleCheck = (name, value, exclusive) =>
    setState((s) => {
      const cur = (s.answers[name] || []).slice();
      const pos = cur.indexOf(value);
      let next;
      if (pos >= 0) next = cur.filter((v) => v !== value);
      else if (exclusive && value === exclusive) next = [value];
      else next = cur.filter((v) => v !== exclusive).concat(value);
      const answers = { ...s.answers };
      if (next.length) answers[name] = next; else delete answers[name];
      return { ...s, answers: asmtDerive(answers, s.products) };
    });

  const toggleProduct = (id) =>
    setState((s) => {
      const products = s.products.indexOf(id) >= 0
        ? s.products.filter((p) => p !== id)
        : s.products.concat(id);
      // Re-derive against the new order: acknowledgements and consents scoped
      // to a dropped program clear here.
      return { ...s, products, answers: asmtDerive(s.answers, products) };
    });

  const scrollToQid = (qid) => {
    const el = document.querySelector('[data-qid="' + qid + '"]');
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const goto = (i) => {
    setState((s) => ({ ...s, screen: i, result: null }));
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const advance = () => {
    if (screen === 0) {
      if (!products.length) { say(cfg.picker.flash); return; }
      goto(1);
      return;
    }
    const problem = asmtStepProblem(activeSteps[screen - 1], answers, products);
    if (problem) {
      scrollToQid(problem.qid);
      say(problem.message);
      return;
    }
    if (screen < activeSteps.length) { goto(screen + 1); return; }
    // Final step: every open key runs here, and only here.
    setState((s) => ({ ...s, result: asmtEvaluateKeys(s.answers, s.products) }));
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const startOver = () => {
    try { localStorage.removeItem(ASMT_STORE_KEY); } catch (e) {}
    setState({ answers: {}, screen: 0, products: [], result: null });
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const confirms = asmtConfirmTriggers(answers, products);
  const stepperSteps = [{ id: "PICK", title: cfg.picker.title }].concat(activeSteps);
  const cur = screen > 0 ? activeSteps[screen - 1] : null;

  return (
    <section data-screen-label="Assessment Flow" ref={topRef} style={{
      maxWidth: 760, margin: "0 auto",
      padding: "var(--spacing-10) var(--spacing-5) var(--spacing-20)",
      display: "flex", flexDirection: "column", gap: "var(--spacing-5)",
    }}>

      {/* Intro */}
      <header style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
        <p style={{
          margin: 0, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)",
          letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent-strong)",
        }}>Health Assessment</p>
        <h1 style={{
          margin: 0, fontSize: "var(--text-4xl)", fontWeight: 400,
          fontFamily: "var(--font-family-display, var(--font-family-base))", color: "var(--text-default)",
        }}>Find the path that fits your body</h1>
        <p style={{ margin: "0 auto", maxWidth: "36em", fontSize: "var(--text-base)", lineHeight: 1.6, color: "var(--text-secondary)" }}>
          A few questions about you and your health history. A licensed provider reviews
          every intake — nothing here rejects you on the spot.
        </p>
      </header>

      {result ?
        <AsmtResults result={result} answers={answers} products={products}
          onReview={() => goto(activeSteps.length)} onStartOver={startOver} />
        :
        <React.Fragment>
          <AsmtStepper steps={stepperSteps} current={screen} />

          {screen === 0 ?
            <AsmtProductPicker products={products} onToggle={toggleProduct} />
            :
            <React.Fragment>
              <h2 style={{ margin: "var(--spacing-2) 0 0", fontSize: "var(--text-2xl)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-default)" }}>
                {cur.heading}
              </h2>

              {cur.questions.map((q) => (
                <AsmtQuestion key={q.qid} q={q} answers={answers}
                  confirmOn={!!confirms[q.qid]}
                  confirmChecked={!!answers[asmtConfirmName(q.qid)]}
                  onConfirmToggle={() => toggleConsent(asmtConfirmName(q.qid))}
                  setField={setField} toggleCheck={toggleCheck} toggleConsent={toggleConsent} />
              ))}

              {cur.id === "STDP1" && asmtConsentsApply(products) &&
                <AsmtAgeBmiConsents answers={answers} toggleConsent={toggleConsent} />}
            </React.Fragment>}

          {/* Step controls */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--spacing-4)", marginTop: "var(--spacing-2)" }}>
            <AsmtButton label="Back" variant="secondary" disabled={screen === 0} onClick={() => goto(screen - 1)} />
            <AsmtButton label={screen === 0 ? "Continue" : (screen === activeSteps.length ? "Submit" : "Next")} onClick={advance} />
          </div>

          <p style={{ margin: 0, textAlign: "center", fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
            Your answers are private and reviewed only by your care team.
          </p>
        </React.Fragment>}

      <AsmtFlash message={flash} />
    </section>
  );
}

// The entry picker: one card per orderable program, multi-select.
function AsmtProductPicker({ products, onToggle }) {
  const cfg = ASMT();
  const routable = cfg.categories.filter((c) => !c.baseline);
  return (
    <React.Fragment>
      <h2 style={{ margin: "var(--spacing-2) 0 0", fontSize: "var(--text-2xl)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-default)" }}>
        {cfg.picker.heading}
      </h2>
      <AsmtCard qid="PICK" hint={null}>
        <p style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: 1.6, color: "var(--text-secondary)" }}>{cfg.picker.sub}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
          {routable.map((c) => (
            <AsmtOptionRow key={c.id} kind="checkbox"
              label={c.label + (c.description ? " — " + c.description : "")}
              checked={products.indexOf(c.id) >= 0}
              onToggle={() => onToggle(c.id)} />
          ))}
        </div>
      </AsmtCard>
    </React.Fragment>
  );
}

// One question, dispatched by control type, with its confirm box directly under it.
function AsmtQuestion({ q, answers, confirmOn, confirmChecked, onConfirmToggle, setField, toggleCheck, toggleConsent }) {
  if (q.showWhen && answers[q.showWhen.name] !== q.showWhen.value) return null;

  let body = null;
  if (q.control === "identity") {
    body = (
      <AsmtCard qid={q.qid}>
        <div className="asmt-grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-4)" }}>
          {q.fields.map((f) => {
            const wide = f.span === 2 ? { gridColumn: "1 / -1" } : null;
            if (f.type === "select") return (
              <div key={f.name} style={wide}>
                <AsmtSelectField id={f.name} label={f.label} value={answers[f.name]} options={f.options}
                  placeholder="Select a state" onChange={(v) => setField(f.name, v)} />
              </div>
            );
            if (f.type === "segment") return (
              <div key={f.name} style={wide}>
                <AsmtFieldLabel text={f.label} />
                <AsmtSegment options={f.options} value={answers[f.name]} ariaLabel={f.label}
                  onChange={(v) => setField(f.name, v)} />
                {f.hint && <p style={{ margin: "var(--spacing-1) 0 0", fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{f.hint}</p>}
              </div>
            );
            if (f.type === "dob") return (
              <div key={f.name} style={wide}>
                <AsmtTextField id={f.name} label={f.label} value={answers[f.name]} placeholder={f.placeholder}
                  inputMode="numeric" onChange={(v) => setField(f.name, asmtMaskDob(v))} />
              </div>
            );
            return (
              <div key={f.name} style={wide}>
                <AsmtTextField id={f.name} label={f.label} type={f.type} value={answers[f.name]}
                  onChange={(v) => setField(f.name, v)} />
              </div>
            );
          })}
        </div>
      </AsmtCard>
    );
  } else if (q.control === "heightweight") {
    body = (
      <AsmtCard qid={q.qid} label={q.label}>
        <div className="asmt-grid3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--spacing-4)" }}>
          <AsmtTextField id="form[height_feet]" label="Feet" type="number" inputMode="numeric" placeholder="5"
            value={answers["form[height_feet]"]} onChange={(v) => setField("form[height_feet]", v)} />
          <AsmtTextField id="form[height_inches]" label="Inches" type="number" inputMode="numeric" placeholder="6"
            value={answers["form[height_inches]"]} onChange={(v) => setField("form[height_inches]", v)} />
          <AsmtTextField id="form[weight]" label="Weight (in lbs)" type="number" inputMode="numeric" placeholder="250"
            value={answers["form[weight]"]} onChange={(v) => setField("form[weight]", v)} />
        </div>
        <AsmtBmiReadout bmi={answers["form[bmi]"] && parseFloat(answers["form[bmi]"]).toFixed(1)} rating={answers["form[bmi_rating]"]} />
      </AsmtCard>
    );
  } else if (q.control === "checkbox") {
    const picked = answers[q.name] || [];
    body = (
      <AsmtCard qid={q.qid} label={q.label}
        hint={q.hipaa ? "Your answers are protected health information under HIPAA." : null}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
          {q.options.map((opt) => (
            <AsmtOptionRow key={opt} kind="checkbox" label={opt} checked={picked.indexOf(opt) >= 0}
              onToggle={() => toggleCheck(q.name, opt, q.exclusive)} />
          ))}
        </div>
      </AsmtCard>
    );
  } else if (q.control === "select") {
    body = (
      <AsmtCard qid={q.qid} label={q.label}>
        <AsmtSelectField id={q.name} value={answers[q.name]} options={q.options}
          onChange={(v) => setField(q.name, v)} />
        {q.reveal && answers[q.name] === q.reveal.value &&
          <AsmtTextarea id={q.reveal.name} label={q.reveal.label} value={answers[q.reveal.name]}
            onChange={(v) => setField(q.reveal.name, v)} />}
      </AsmtCard>
    );
  } else if (q.control === "radio") {
    const arm = q.arms && q.arms[answers[q.name]];
    body = (
      <AsmtCard qid={q.qid} label={q.label}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
          {q.options.map((opt) => (
            <AsmtOptionRow key={opt} kind="radio" label={opt} checked={answers[q.name] === opt}
              onToggle={() => setField(q.name, opt)} />
          ))}
        </div>
        {arm &&
          <div style={{
            borderTop: "1px solid var(--border-default)", paddingTop: "var(--spacing-4)",
            display: "flex", flexDirection: "column", gap: "var(--spacing-4)",
          }}>
            <p style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-default)" }}>{arm.heading}</p>
            {arm.questions.map((sub) => (
              <div key={sub.name}>
                <AsmtFieldLabel text={sub.label} />
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
                  {sub.options.map((opt) => (
                    <AsmtOptionRow key={opt} kind="radio" label={opt} checked={answers[sub.name] === opt}
                      onToggle={() => setField(sub.name, opt)} />
                  ))}
                </div>
              </div>
            ))}
          </div>}
      </AsmtCard>
    );
  } else if (q.control === "consent") {
    body = (
      <AsmtCard qid={q.qid} label={q.label}>
        <AsmtConsentCard body={q.body} ack={q.ack} optional={q.optional} placeholderNote={q.placeholder}
          checked={!!answers[q.name]} onToggle={() => toggleConsent(q.name)} />
      </AsmtCard>
    );
  }

  return (
    <React.Fragment>
      {body}
      {confirmOn && <AsmtConfirmBox qid={q.qid} checked={confirmChecked} onToggle={onConfirmToggle} />}
    </React.Fragment>
  );
}

// The age-and-BMI acknowledgements (STDP1Q4). At most one band applies, and the
// caller has already checked the owner key is open for this order.
function AsmtAgeBmiConsents({ answers, toggleConsent }) {
  const consents = ASMT().ageBmiConsents;
  const showElderly = asmtElderlyNeedsConsent(answers);
  const showMetabolic = asmtAdultNeedsMetabolicConsent(answers);
  if (!showElderly && !showMetabolic) return null;
  const c = showElderly ? consents.elderly : consents.metabolic;
  return (
    <div data-qid="STDP1Q4">
      <AsmtCard label={c.title}>
        <AsmtConsentCard body={c.body} ack={c.ack}
          checked={!!answers[c.name]} onToggle={() => toggleConsent(c.name)} />
      </AsmtCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Results. Mirrors the source funnel's two exits: a clean record confirms, a
// failing key redirects to "your care deserves a closer look".
// ---------------------------------------------------------------------------
const ASMT_KEY_LABELS = {
  STD: "Standard health screen",
  GLP: "GLP-1 program screen",
  NAD: "NAD+ program screen",
  PEP: "Peptides program screen",
};

function AsmtResults({ result, answers, products, onReview, onStartOver }) {
  const failed = asmtAnyKeyFailed(result);
  const programNames = products.map((p) => (asmtCatById(p) || { label: p }).label);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-5)" }}>

      {/* Verdict banner */}
      <div style={{
        background: "var(--color-white)", border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-xl)", padding: "var(--spacing-8) var(--spacing-6)",
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "var(--spacing-3)",
      }}>
        <span style={{
          width: 64, height: 64, borderRadius: "50%",
          background: failed ? "var(--warning-subtle)" : "var(--accent-strong)",
          color: failed ? "var(--warning-default)" : "var(--color-white)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          {failed ?
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 7v6m0 4v.5"></path></svg>
            : <AsmtCheckGlyph size={26} />}
        </span>
        <h2 style={{ margin: 0, fontSize: "var(--text-3xl)", fontWeight: 400, color: "var(--text-default)" }}>
          {failed ? "Your answers tell us your care deserves a closer look" : "You’re a candidate — pending provider review"}
        </h2>
        {programNames.length > 0 &&
          <p style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--accent-strong)" }}>
            {programNames.join(" + ")}
          </p>}
        <p style={{ margin: 0, maxWidth: "34em", fontSize: "var(--text-base)", lineHeight: 1.6, color: "var(--text-secondary)" }}>
          {failed
            ? "Based on what you shared, we think you’d be better served by a provider who can evaluate you in person. It’s not a no — it’s a redirect to the kind of care that fits you best right now."
            : "Thanks — a licensed Chime provider will review your answers and confirm the right plan for you. This is a demo assessment; no data was submitted."}
        </p>
      </div>

      {/* Per-key verdicts */}
      <div style={{
        background: "var(--color-white)", border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-xl)", padding: "var(--spacing-5) var(--spacing-6)",
        display: "flex", flexDirection: "column", gap: "var(--spacing-3)",
      }}>
        <p style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)" }}>
          Eligibility screens
        </p>
        {result.keys.map((k) => {
          const v = result[k];
          return (
            <div key={k} style={{
              border: "1px solid " + (v.pass ? "var(--border-default)" : "var(--warning-default)"),
              background: v.pass ? "var(--success-subtle)" : "var(--warning-subtle)",
              borderRadius: "var(--radius-md)", padding: "var(--spacing-3) var(--spacing-4)",
            }}>
              <p style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-default)" }}>
                {(ASMT_KEY_LABELS[k] || k) + " — " + (v.pass ? "passed" : "needs a closer look")}
              </p>
              {v.unauthored &&
                <p style={{ margin: "var(--spacing-1) 0 0", fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text-secondary)" }}>
                  This program has no screen of its own yet — you were screened by the standard intake only.
                </p>}
              {!v.pass &&
                <ul style={{ margin: "var(--spacing-2) 0 0", paddingLeft: "var(--spacing-5)", display: "flex", flexDirection: "column", gap: "var(--spacing-1)" }}>
                  {v.reasons.map((r, i) => (
                    <li key={i} style={{ fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text-secondary)" }}>{r.reason}</li>
                  ))}
                </ul>}
            </div>
          );
        })}
      </div>

      <AsmtAnswerSummary answers={answers} products={products} />

      <div style={{ display: "flex", justifyContent: "center", gap: "var(--spacing-4)", flexWrap: "wrap" }}>
        {failed && <AsmtButton label="Review my answers" variant="secondary" onClick={onReview} />}
        <AsmtButton label="Start over" variant={failed ? "primary" : "secondary"} onClick={onStartOver} />
      </div>
    </div>
  );
}

// Everything the visitor told us, grouped by the steps they actually walked —
// the record a provider would receive.
function AsmtAnswerSummary({ answers, products }) {
  const rows = [];
  for (const step of asmtActiveSteps(products)) {
    const items = [];
    for (const q of step.questions) {
      if (q.control === "identity") {
        for (const f of q.fields) {
          const v = answers[f.name];
          if (v) items.push([f.label.replace(/[:?]$/, ""), f.type === "segment" ? (f.options.find((o) => o.value === v) || {}).label || v : v]);
        }
      } else if (q.control === "heightweight") {
        if (answers["form[bmi]"])
          items.push(["Height / weight / BMI",
            (answers["form[height_feet]"] || "?") + "′" + (answers["form[height_inches]"] || 0) + "″ · " +
            (answers["form[weight]"] || "?") + " lbs · BMI " + parseFloat(answers["form[bmi]"]).toFixed(1) + " (" + answers["form[bmi_rating]"] + ")"]);
      } else if (q.control === "checkbox") {
        const v = answers[q.name];
        if (v && v.length) items.push([q.label, v.join("; ")]);
      } else if (q.control === "select" || q.control === "radio") {
        const v = answers[q.name];
        if (v) {
          let text = v;
          if (q.reveal && answers[q.reveal.name]) text += " — " + answers[q.reveal.name];
          items.push([q.label, text]);
          if (q.arms && q.arms[v])
            for (const sub of q.arms[v].questions)
              if (answers[sub.name]) items.push([sub.label, answers[sub.name]]);
        }
      } else if (q.control === "consent") {
        items.push([q.ack.split(".")[0], answers[q.name] ? "Agreed" : "Not agreed"]);
      }
    }
    if (items.length) rows.push({ step: step.heading, items });
  }
  return (
    <div style={{
      background: "var(--color-white)", border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-xl)", padding: "var(--spacing-5) var(--spacing-6)",
      display: "flex", flexDirection: "column", gap: "var(--spacing-4)",
    }}>
      <p style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)" }}>
        Your answers
      </p>
      {rows.map((r) => (
        <div key={r.step}>
          <p style={{ margin: "0 0 var(--spacing-2)", fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)", color: "var(--accent-strong)" }}>{r.step}</p>
          <dl style={{ margin: 0, display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
            {r.items.map(([label, value], i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(120px, 2fr) 3fr", gap: "var(--spacing-3)" }}>
                <dt style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{label}</dt>
                <dd style={{ margin: 0, fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text-default)" }}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { ChimeAssessmentFlow });
