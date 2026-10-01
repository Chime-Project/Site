// Chime Health — Assessment v4 flow component.
// One state object (answers + current screen + highest block reached),
// persisted to localStorage under its own versioned key so a v4 rollout never
// tries to restore v1-shaped answers. All routing/scoring goes through the
// pure asmtV4* engine (assessment-v4-logic.js); this file is glue + chrome.
//
// UX contract (behavioral only — copy stays verbatim from the config):
//   - one screen, one topic. SINGLE-select screens advance on the pick itself
//     (config flag `autoAdvance`, client request); every other screen advances
//     on Continue. A mis-tap on an auto-advancing screen costs one Back press,
//     which is why Back is on every screen and preserves the answer.
//   - the Continue/Back row is sticky to the bottom of the window, so a screen
//     taller than the viewport never hides the way forward (client request)
//   - Back on every screen except after D renders; answers preserved; a
//     routing-relevant change recomputes the queue forward (asmtV4Prune)
//   - block-level progress only, and it may never regress (maxBlock)
//   - focus moves to the new screen's heading on every transition;
//     prefers-reduced-motion drops the slide/scroll animation
//   - inline validation on blur/change, kind tone, never on load

// Bumped from "chime_assessment_v4" when A2 changed shape (a multi-select
// array → the legal team's verbatim Yes/No string) and gender moved out of A3.
// A stale session would have restored an array onto a single-select screen:
// nothing would look chosen, yet the answer reads as present, so Continue
// would sail past an unanswered eligibility gate. Discarding beats migrating.
// Bumped for the Vf option/screen changes: B1.2's old answers aside, screens
// B2.2 / B3.1 / B4.1 no longer exist and A3 swapped dob+address for age, so a
// session saved under the previous key could restore onto a deleted screen or
// a field list that is gone. A new key retires those sessions cleanly.
// Bumped again for the medical intake (client, 2026-10-01): A3 swapped age for
// dob + state, B1.4 became an object, and C1–C3 are gone.
// ui_kits/cart/cart-data.js (chimeCartPrefill) reads this key to prefill the
// checkout with A3's name, email and phone — change both together.
const ASMT_V4_STORE_KEY = "chime_assessment_v4_5";
const ASMT_V4_CFG = () => window.CHIME_ASSESSMENT_V4;

// The medical answers (type "form" screens, H7 … H18) are never written to
// localStorage — health information stays in memory only. A reload inside the
// medical block therefore restarts it at its first screen.
function asmtV4Persistable(answers) {
  const out = {};
  for (const k in answers) {
    const scr = asmtV4ScreenById(k);
    if (scr && scr.type === "form") continue;
    out[k] = answers[k];
  }
  return out;
}

// ?step=N in the address bar (client, 2026-10-01: "each step has its own
// [URL] … easier to tell the guys what to integrate where"). The flow keeps
// every other query parameter (?product=, campaign tags) as it found it.
function asmtV4StepUrl(screenId, dq) {
  const q = new URLSearchParams(location.search);
  q.set("step", dq ? "disqualified" : String(asmtV4StepNumber(screenId)));
  return location.pathname + "?" + q.toString() + location.hash;
}

// The screen a ?step=N URL may land on: one in the current queue that is not
// past the first unanswered screen (a URL can't skip questions).
function asmtV4ScreenFromUrl(answers) {
  const step = new URLSearchParams(location.search).get("step");
  const id = step && asmtV4ScreenForStep(step);
  if (!id) return null;
  const q = asmtV4Queue(answers), i = q.indexOf(id);
  if (i < 0) return null;
  return i <= q.indexOf(asmtV4FirstIncomplete(answers)) ? id : null;
}

// Visual order of A3 fields, for focusing the first field needing attention.
// Every entry needs a real DOM id: the walk in advance() breaks at the first
// field with a problem, so an entry with no focusable target would leave the
// user with just the toast. Every field here is a real <input>/<select> now
// that sex has moved to its own screen (A2G).
// Order matters: the toast focuses the FIRST field with a problem, so this must
// track the render order in AsmtV4ContactFields. Vf trimmed the list to five.
const ASMT_V4_FIELD_IDS = [
  ["firstName", "asmt-v4-first"], ["lastName", "asmt-v4-last"],
  ["dob", "asmt-v4-dob"],
  ["email", "asmt-v4-email"], ["phone", "asmt-v4-phone"],
  ["state", "asmt-v4-state"],
];

function asmtV4InitState() {
  let answers = {}, screenId = null, maxBlock = 0;
  try {
    const saved = JSON.parse(localStorage.getItem(ASMT_V4_STORE_KEY) || "null");
    if (saved && saved.answers) {
      answers = asmtV4Prune(saved.answers);
      screenId = saved.screenId || null;
      maxBlock = saved.maxBlock || 0;
    }
  } catch (e) {}
  // ?product= deep links pre-select A1 goal cards only — never skip the screen.
  if (!answers.A1) {
    const goals = asmtV4ProductGoals(location.search);
    if (goals.length) answers = { ...answers, A1: goals };
  }
  if (!screenId) screenId = "A1";
  else if (asmtV4Queue(answers).indexOf(screenId) < 0) screenId = asmtV4FirstIncomplete(answers);
  // A medical screen saved as current lost its answers (they are never saved),
  // so the restore lands on the first unanswered screen instead.
  if (asmtV4Queue(answers).indexOf(screenId) > asmtV4Queue(answers).indexOf(asmtV4FirstIncomplete(answers)))
    screenId = asmtV4FirstIncomplete(answers);
  screenId = asmtV4ScreenFromUrl(answers) || screenId;
  maxBlock = Math.max(maxBlock, asmtV4BlockIndex(screenId));
  return { answers, screenId, maxBlock, dq: null };
}

function ChimeAssessmentFlowV4() {
  const cfg = ASMT_V4_CFG();
  const [state, setState] = React.useState(asmtV4InitState);
  const [flash, setFlash] = React.useState("");
  const [touched, setTouched] = React.useState({});
  const [forceErrors, setForceErrors] = React.useState(false);
  const flashTimer = React.useRef(null);
  const autoTimer = React.useRef(null);
  const topRef = React.useRef(null);
  const headingRef = React.useRef(null);
  const screenRef = React.useRef(null);
  const dirRef = React.useRef(1); // +1 forward, -1 back — steers the slide-in side
  const stateRef = React.useRef(state);
  stateRef.current = state;

  const { answers, screenId, maxBlock, dq } = state;
  const screen = asmtV4ScreenById(screenId);
  const queue = asmtV4Queue(answers);
  const idx = queue.indexOf(screenId);
  const reducedMotion = typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    try { localStorage.setItem(ASMT_V4_STORE_KEY, JSON.stringify({ answers: asmtV4Persistable(answers), screenId, maxBlock })); } catch (e) {}
  }, [answers, screenId, maxBlock]);

  // Per-step URLs: a forward or Back move pushes ?step=N, so the browser's own
  // Back / Forward walk the steps too; the first render only replaces it. A
  // popstate lands on the step in the URL when the answers allow it.
  const fromPop = React.useRef(false);
  const firstUrl = React.useRef(true);
  React.useEffect(() => {
    const url = asmtV4StepUrl(screenId, !!dq);
    if (firstUrl.current || fromPop.current) history.replaceState(null, "", url);
    else if (url !== location.pathname + location.search + location.hash) history.pushState(null, "", url);
    firstUrl.current = false; fromPop.current = false;
  }, [screenId, dq]);
  React.useEffect(() => {
    const onPop = () => {
      fromPop.current = true;
      setState((s) => {
        const id = asmtV4ScreenFromUrl(s.answers);
        if (!id) return { ...s, dq: null };
        const q = asmtV4Queue(s.answers);
        dirRef.current = q.indexOf(id) < q.indexOf(s.screenId) ? -1 : 1;
        return { ...s, screenId: id, dq: null, maxBlock: Math.max(s.maxBlock, asmtV4BlockIndex(id)) };
      });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Backend hook for the integration: called on every completed step (and on
  // the closer-look screen) with the step number, the screen id and the whole
  // payload so far in the qualify funnel's field names. Off unless defined.
  const notify = (id, disqualified, answersNow) => {
    if (typeof window.chimeAssessmentOnStep !== "function") return;
    try {
      window.chimeAssessmentOnStep({
        step: asmtV4StepNumber(id), screen: id, disqualified: !!disqualified,
        payload: asmtV4Payload(answersNow || stateRef.current.answers),
      });
    } catch (e) {}
  };
  React.useEffect(() => {
    window.chimeAssessmentPayload = () => asmtV4Payload(stateRef.current.answers);
    return () => { delete window.chimeAssessmentPayload; };
  }, []);

  // Site chrome CTAs call window.openChimeAssessment(); here the assessment IS
  // the page, so the call scrolls to the flow instead of reloading.
  React.useEffect(() => {
    window.openChimeAssessment = () => {
      if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    return () => { delete window.openChimeAssessment; };
  }, []);

  // Every transition: analytics, scroll, and focus on the new heading.
  React.useEffect(() => {
    asmtV4Track("step_viewed", { screen: dq ? "disqualified" : screenId });
    if (screenId === "D") {
      const rec = asmtV4Recommendation(stateRef.current.answers);
      asmtV4Track("assessment_completed", {
        screen: "D", path: rec.pathId,
        persona: rec.persona && rec.persona.label,
        medicationEligible: rec.medicationEligible,
      });
    }
    setForceErrors(false);
    if (topRef.current) topRef.current.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    const t = setTimeout(() => {
      if (headingRef.current) headingRef.current.focus({ preventScroll: true });
    }, 60);
    return () => { clearTimeout(t); clearTimeout(autoTimer.current); };
  }, [screenId, dq]);

  // GSAP horizontal slide: each question enters from the side it was reached
  // from (right on Continue, left on Back). Layout effect so the first frame
  // is already offset — no unanimated flash. clearProps leaves the DOM free of
  // inline transform/opacity once the tween lands (keeps DOM diffs clean).
  // The .asmt-v4-anim CSS fade stays on as fallback when gsap is absent.
  React.useLayoutEffect(() => {
    if (reducedMotion || !window.gsap || !screenRef.current) return;
    const tween = window.gsap.fromTo(screenRef.current,
      { x: dirRef.current * 80, autoAlpha: 0 },
      // power1.out, not a steeper ease: a hard ease-out front-loads the travel
      // (power3.out finished 90% of it in the first 230ms), so raising the
      // duration only stretched an invisible sub-pixel tail. This spreads the
      // motion across the full duration, which is what actually reads as slower.
      // 0.87 = 0.3 × 1.7 × 1.7 — slowed 70% twice over (user calls, both
      // 2026-08-11), so 2.9× the original 0.3s. The linear-ish ease is what
      // lets that read as a slower slide rather than a longer wait; at this
      // duration a steeper ease would show a visible stall at the end.
      { x: 0, autoAlpha: 1, duration: 0.87, ease: "power1.out",
        clearProps: "transform,opacity,visibility" });
    return () => tween.kill();
  }, [screenId, dq]);

  // Screens flagged pageAccent paint the whole page in the theme's main blue.
  // It goes on <body> rather than on #assessment because the section is a
  // 760px centred column — a background there would be a stripe, not a page.
  // Safe to take over: the footer carries its own dark background and the
  // navbar is 88%-opaque, so neither inherits this. Cleanup clears the inline
  // style, which hands the colour back to the stylesheet rule.
  // The closer-look screen is never painted, even over an accent screen (C.PRE).
  const accent = screen.pageAccent && !dq;
  React.useEffect(() => {
    if (!accent) return;
    document.body.style.background = "var(--accent-strong)";
    return () => { document.body.style.background = ""; };
  }, [accent]);

  const say = (msg) => {
    setFlash(msg);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(""), 3000);
  };

  // ------------------------------------------------------------------ moves
  const stepForward = (s) => {
    const q = asmtV4Queue(s.answers);
    const i = q.indexOf(s.screenId);
    if (i < 0 || i >= q.length - 1) return s;
    asmtV4Track("step_completed", { screen: s.screenId });
    notify(s.screenId, false, s.answers);
    dirRef.current = 1;
    const next = q[i + 1];
    return { ...s, screenId: next, maxBlock: Math.max(s.maxBlock, asmtV4BlockIndex(next)) };
  };

  // A disqualifying answer opens the closer-look screen on top of the screen
  // that triggered it; nothing moves in the queue.
  const disqualify = (s) => {
    asmtV4Track("disqualified", { screen: s.screenId });
    dirRef.current = 1;
    return { ...s, dq: { from: s.screenId } };
  };

  const goBack = () => {
    clearTimeout(autoTimer.current);
    setState((s) => {
      if (s.dq) { dirRef.current = -1; return { ...s, dq: null }; }
      const q = asmtV4Queue(s.answers);
      const i = q.indexOf(s.screenId);
      if (i <= 0) return s;
      asmtV4Track("back_navigated", { from: s.screenId, to: q[i - 1] });
      dirRef.current = -1;
      return { ...s, screenId: q[i - 1] };
    });
  };

  // Opt-in via `autoAdvance` in the config, and currently set by no screen —
  // see the UX contract above. Kept so a screen can opt back in without
  // rebuilding the timer plumbing (the clearTimeout calls around it also guard
  // against a stale advance firing after Back or a re-selection).
  // 425ms = 250 × 1.7, matching the slide tween's 70% slowdown (user call,
  // 2026-08-11). This pause is not dead time: it is how long the card's
  // selected state is on screen before the screen leaves, so the pick visibly
  // registers instead of the answer vanishing under the transition.
  const scheduleAdvance = () => {
    clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(() => setState(stepForward), 425);
  };

  const startOver = () => {
    clearTimeout(autoTimer.current);
    try { localStorage.removeItem(ASMT_V4_STORE_KEY); } catch (e) {}
    setTouched({});
    setForceErrors(false);
    dirRef.current = 1;
    const goals = asmtV4ProductGoals(location.search);
    setState({ answers: goals.length ? { A1: goals } : {}, screenId: "A1", maxBlock: 0, dq: null });
  };

  // ---------------------------------------------------------------- answers
  const toggleMulti = (value) => {
    clearTimeout(autoTimer.current);
    setState((s) => {
      const scr = asmtV4ScreenById(s.screenId);
      const cur = (s.answers[s.screenId] || []).slice();
      const pos = cur.indexOf(value);
      let next;
      if (pos >= 0) next = cur.filter((v) => v !== value);
      else if (scr.exclusive && value === scr.exclusive) next = [value];
      else {
        next = cur.filter((v) => v !== scr.exclusive).concat(value);
        if (scr.maxSelections && next.length > scr.maxSelections) return s;
      }
      const a = { ...s.answers };
      if (next.length) a[s.screenId] = next; else delete a[s.screenId];
      return { ...s, answers: asmtV4Prune(a) };
    });
  };

  const setSingle = (value, noAuto) => {
    setState((s) => {
      const a = { ...s.answers, [s.screenId]: value };
      return { ...s, answers: asmtV4Prune(a) };
    });
    if (screen.autoAdvance && !noAuto) scheduleAdvance();
  };

  // B1.1 · the journey pick. It behaves as a normal auto-advancing single-select
  // EXCEPT when the chosen option opens the inline "Which medication?" reveal —
  // advancing there would carry the sub-question off-screen before it could be
  // answered. So the jump is suppressed for exactly those two options.
  const setJourney = (value) => {
    const opensReveal = cfg.b11RevealValues.indexOf(value) >= 0;
    setState((s) => ({ ...s, answers: asmtV4Prune({ ...s.answers, "B1.1": value }) }));
    if (!opensReveal) scheduleAdvance();
  };

  // A changed medication answer switches the dose ladder, so the old dose would
  // be from the wrong ladder and never survives the change. "Others" opens a
  // free-text field, so that one pick must not jump either.
  const setJourneyMed = (value) => {
    setState((s) => {
      const a = { ...s.answers, "B1.1_med": value };
      if (s.answers["B1.1_med"] !== value) delete a["B1.4"];
      return { ...s, answers: asmtV4Prune(a) };
    });
    if (value !== cfg.b11OtherValue) scheduleAdvance();
  };

  const chooseFork = (value) => {
    asmtV4Track("disqualified_rerouted", { screen: "A2F", choice: value });
    setState((s) => stepForward({ ...s, answers: asmtV4Prune({ ...s.answers, A2F: value }) }));
  };

  const setNested = (id, field, value) =>
    setState((s) => ({
      ...s,
      answers: asmtV4Prune({ ...s.answers, [id]: { ...(s.answers[id] || {}), [field]: value } }),
    }));

  const markTouched = (field) => setTouched((t) => (t[field] ? t : { ...t, [field]: true }));

  // Phrase + placeholder screens store `true` so restore lands after them.
  // C.PRE opens the medical intake, so the age + BMI band is checked here too:
  // a weight-loss path can arrive after A6 (B2.3's cross-sell adds B1 later).
  const completeStatic = () =>
    setState((s) => {
      const next = { ...s, answers: { ...s.answers, [s.screenId]: true } };
      if (s.screenId === "C.PRE" && asmtV4BandDisqualifies(next.answers)) { notify(s.screenId, true, next.answers); return disqualify(next); }
      return stepForward(next);
    });

  // B1.4 · a changed answer closes the questions after it, the way the
  // reference's step 6 resets its follow-ups.
  const setMeds = (field, value) =>
    setState((s) => {
      const cur = { ...(s.answers["B1.4"] || {}), [field]: value };
      if (field === "dose" && (s.answers["B1.4"] || {}).dose !== value) { delete cur.lastTaken; delete cur.continuePlan; }
      return { ...s, answers: { ...s.answers, "B1.4": cur } };
    });

  // Medical forms: one object per screen, keyed by the reference's field names.
  const setFormField = (key, value) =>
    setState((s) => {
      const cur = { ...(s.answers[s.screenId] || {}) };
      if (value === undefined) delete cur[key]; else cur[key] = value;
      return { ...s, answers: { ...s.answers, [s.screenId]: cur } };
    });
  const toggleFormMulti = (item, value) =>
    setState((s) => {
      const cur = { ...(s.answers[s.screenId] || {}) };
      const next = asmtV4ToggleMulti(item, cur[item.key], value);
      if (next.length) cur[item.key] = next; else delete cur[item.key];
      return { ...s, answers: { ...s.answers, [s.screenId]: cur } };
    });

  // ------------------------------------------------------------- validation
  const contactErrors = (() => {
    if (screen.type !== "contact") return {};
    const all = asmtV4ContactProblems(answers.A3) || {};
    if (forceErrors) return all;
    const out = {};
    for (const f in all) if (touched[f]) out[f] = all[f];
    return out;
  })();

  // A6's range check, held back until the user leaves the field it is about
  // (or presses Continue). Judged per keystroke it fires on the way INTO a
  // valid answer — typing 210 is "1", then "21", both outside 50–700 — and the
  // panel that renders it is aria-live, so it was announced twice per entry.
  //
  // The gate is per GROUP, not per screen: height and weight are separate
  // thoughts, and a screen-wide flag meant finishing the height opened the
  // gate on a weight still being typed. Which group a problem belongs to is
  // re-derived from the values rather than sniffed from the message, and
  // weight is tested first to match asmtV4SnapshotProblem's own precedence.
  const snapshotProblem = (() => {
    if (screen.type !== "snapshot") return null;
    const p = asmtV4SnapshotProblem(answers.A6);
    if (!p || forceErrors) return p;
    const r = cfg.snapshotRanges, lbs = parseFloat((answers.A6 || {}).weightLbs);
    const weightBad = !isNaN(lbs) && (lbs < r.weightMin || lbs > r.weightMax);
    return touched[weightBad ? "A6weight" : "A6height"] ? p : null;
  })();

  const advance = () => {
    clearTimeout(autoTimer.current);
    const t = screen.type;
    if (t === "cards" && !(answers[screenId] || []).length)
      return say("Please choose at least one goal to continue.");
    if ((t === "checkboxes" || t === "chips") && !(answers[screenId] || []).length)
      return say("Please choose at least one option to continue.");
    if (t === "contact") {
      const problems = asmtV4ContactProblems(answers.A3);
      if (problems) {
        setForceErrors(true);
        for (const [field, domId] of ASMT_V4_FIELD_IDS) {
          if (!problems[field]) continue;
          const el = domId && document.getElementById(domId);
          if (el) el.focus();
          break;
        }
        return say("A few details above still need a look.");
      }
    }
    if (t === "snapshot") {
      const problem = asmtV4SnapshotProblem(answers.A6);
      // forceErrors so the inline panel shows it too, not just the 3s toast.
      if (problem) { setForceErrors(true); return say(problem); }
      if (!answers.A6 || asmtV4SnapshotTier(answers) === null)
        return say("Please add your height and weight to continue.");
      // The reference's first disqualifier: the age + BMI band (step 7).
      if (asmtV4BandDisqualifies(answers)) { notify(screenId, true); return setState(disqualify); }
    }
    if (t === "meds") {
      const problem = asmtV4MedsProblem(answers[screenId]);
      if (problem) return say(problem);
    }
    if (t === "form") {
      const problem = asmtV4FormProblem(screen, answers[screenId], answers);
      if (problem) return say(problem);
      if (asmtV4FormDisqualifies(screen, answers[screenId], answers)) { notify(screenId, true); return setState(disqualify); }
    }
    if ((t === "list" || t === "gate" || t === "dynlist" || t === "listFree" || t === "journey") && !answers[screenId])
      return say("Please choose an option to continue.");
    // B1.1's inline reveal is part of the SAME screen, so Continue must not pass
    // while it sits open and unanswered — otherwise the merge would quietly lose
    // the medication answer the two old screens used to guarantee.
    if (t === "journey" && cfg.b11RevealValues.indexOf(answers[screenId]) >= 0) {
      if (!answers["B1.1_med"]) return say("Please tell us which medication to continue.");
      if (answers["B1.1_med"] === cfg.b11OtherValue && !String(answers["B1.1_med_other"] || "").trim())
        return say("Please tell us which medication — or choose another option.");
    }
    setState(stepForward);
  };

  // ---------------------------------------------------------------- render
  // The question heading names its own option group: every group role here is
  // a bare <div>, so without this a screen reader announced "group" with no
  // question attached. One id per screen, so back-navigation can't leave a
  // stale reference behind.
  const headingId = "asmt-v4-q-" + screenId;
  const title = (screen.titleByMed && screen.titleByMed[answers["B1.1_med"]]) || screen.title;

  const header = screen.title && screen.type !== "phrase" && (screen.hero ?
    <AsmtV4HeroHeader screen={screen} headingRef={headingRef} headingId={headingId} />
    :
    <header style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
      <h2 id={headingId} ref={headingRef} tabIndex={-1} style={{
        margin: 0, outline: "none", fontSize: "var(--text-3xl)", fontWeight: 400, lineHeight: 1.2,
        fontFamily: "var(--font-family-display, var(--font-family-base))", color: "var(--text-default)",
      }}>{title}</h2>
      {/* The reference's section tag ("Final health check"), below the title —
          house rule: no eyebrows above titles. */}
      {screen.tag &&
        <p style={{ margin: "0 auto", display: "inline-block", alignSelf: "center",
          fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)", letterSpacing: "0.04em",
          color: "var(--accent-onSubtle)", background: "var(--accent-subtle)",
          borderRadius: "var(--radius-4xl)", padding: "var(--spacing-1) var(--spacing-3)",
        }}>{screen.tag}</p>}
      {screen.supportingLine && screen.type !== "fork" &&
        <p style={{ margin: "0 auto", maxWidth: "36em", fontSize: "var(--text-base)", lineHeight: 1.6, color: "var(--text-secondary)" }}>
          {screen.supportingLine}
        </p>}
      {screen.timeNote &&
        <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{screen.timeNote}</p>}
    </header>
  );

  let body = null;
  if (screen.type === "cards")
    body = <AsmtV4MultiSelectCards options={screen.options} value={answers[screenId]} onToggle={toggleMulti}
      labelledBy={headingId} />;
  else if (screen.type === "checkboxes")
    // `cards` is presentation only — the type stays "checkboxes" so validation
    // keeps saying "option" (the "cards" branch says "goal", which is A1's word).
    // Cards need {value, icon} options; the row list takes plain strings.
    body = screen.cards
      ? <AsmtV4MultiSelectCards options={screen.options} value={answers[screenId]} onToggle={toggleMulti}
          labelledBy={headingId} />
      : <AsmtV4Checkboxes options={screen.options} value={answers[screenId]} onToggle={toggleMulti}
          labelledBy={headingId} />;
  else if (screen.type === "fork")
    body = (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-5)" }}>
        <p style={{
          margin: "0 auto", maxWidth: "34em", textAlign: "center",
          fontSize: "var(--text-base)", lineHeight: 1.6, color: "var(--text-secondary)",
        }}>{screen.supportingLine}</p>
        {screen.copyNeeded &&
          <p style={{
            margin: 0, textAlign: "center", fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)",
            letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--warning-default)",
          }}>Placeholder copy — pending copy team</p>}
        <AsmtV4Fork choices={screen.choices} onChoose={chooseFork} />
      </div>
    );
  else if (screen.type === "contact")
    body = (
      <div style={{
        background: "var(--color-white)", border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-xl)", padding: "var(--spacing-6)",
      }}>
        <AsmtV4ContactFields value={answers.A3} errors={contactErrors}
          states={cfg.states} dobHint={screen.dobHint} stateHint={screen.stateHint}
          onField={(f, v) => setNested("A3", f, v)} onBlur={markTouched} />
      </div>
    );
  else if (screen.type === "chips")
    body = screen.cards
      ? <AsmtV4MultiSelectCards options={screen.options} value={answers[screenId]} onToggle={toggleMulti}
          max={screen.maxSelections} labelledBy={headingId} />
      : <AsmtV4Chips options={screen.options} value={answers[screenId]} onToggle={toggleMulti}
          max={screen.maxSelections} bubbles={screen.bubbles} labelledBy={headingId} />;
  else if (screen.type === "list")
    // Same `cards` flag as A2 — presentation only. The card grid normalises
    // its options, so a screen may pass plain strings (no icon) or
    // {value, icon}; scales pass strings.
    body = screen.cards
      ? <AsmtV4SingleSelectCards options={screen.options} value={answers[screenId]} onSelect={setSingle}
          labelledBy={headingId} />
      : <AsmtV4SingleSelectList options={screen.options} value={answers[screenId]} onSelect={setSingle}
          bubbles={screen.bubbles} labelledBy={headingId} />;
  else if (screen.type === "gate")
    body = screen.cards
      ? <AsmtV4SingleSelectCards options={screen.options} value={answers[screenId]} onSelect={setSingle}
          labelledBy={headingId} />
      : <AsmtV4YesNoGate options={screen.options} value={answers[screenId]} onSelect={setSingle}
          bubbles={screen.bubbles} labelledBy={headingId} />;
  else if (screen.type === "journey")
    body = (
      <AsmtV4JourneyWithReveal options={screen.options} value={answers[screenId]}
        onSelect={setJourney} cards={screen.cards} labelledBy={headingId}
        reveal={screen.reveal}
        revealOpen={cfg.b11RevealValues.indexOf(answers[screenId]) >= 0}
        medValue={answers["B1.1_med"]} medOther={answers["B1.1_med_other"]}
        freeValue={cfg.b11OtherValue}
        onMedSelect={setJourneyMed}
        onMedOther={(v) => setState((s) => ({ ...s, answers: { ...s.answers, "B1.1_med_other": v } }))} />
    );
  else if (screen.type === "dynlist")
    body = (
      <AsmtV4DynamicSingleSelect ladders={screen.ladders} dependsOn={answers["B1.1_med"]}
        value={answers[screenId]} onSelect={setSingle} bubbles={screen.bubbles} cards={screen.cards}
        labelledBy={headingId} />
    );
  else if (screen.type === "snapshot")
    body = (
      <AsmtV4Snapshot value={answers.A6} onField={(f, v) => setNested("A6", f, v)}
        content={asmtV4SnapshotContent(answers)} problem={snapshotProblem}
        bmi={asmtV4BmiDisplay(answers)} bmiCopy={cfg.bmiDisplay}
        onBlur={(group) => markTouched("A6" + group)} />
    );
  else if (screen.type === "phrase")
    body = (
      <AsmtV4Phrase title={screen.title} supportingLine={screen.supportingLine}
        cta={screen.cta} onCta={completeStatic} headingRef={headingRef}
        copyNeeded={screen.copyNeeded} accent={screen.pageAccent}
        image={screen.image} imageAlt={screen.imageAlt} imageCutout={screen.imageCutout} />
    );
  else if (screen.type === "placeholder")
    body = <AsmtV4Placeholder note={screen.note} />;
  else if (screen.type === "meds")
    body = <AsmtV4Meds screen={screen} med={answers["B1.1_med"]} value={answers[screenId]}
      onField={setMeds} labelledBy={headingId} />;
  else if (screen.type === "form")
    body = (
      <React.Fragment>
        <AsmtV4Form screenId={screenId} items={asmtV4FormItems(screen, answers)} value={answers[screenId]}
          onField={setFormField} onToggle={toggleFormMulti} labelledBy={headingId} />
        {screen.footnote &&
          <p style={{ margin: 0, textAlign: "center", fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{screen.footnote}</p>}
      </React.Fragment>
    );
  else if (screen.type === "result")
    body = (
      // The CTA opens the cart with the recommendation selected (see
      // asmtV4CartHref). Answers stay in localStorage, so Back from the cart
      // returns to this result rather than to an empty assessment.
      <AsmtV4Result rec={asmtV4Recommendation(answers)} headingRef={headingRef}
        onCreateAccount={() => { window.location.href = asmtV4CartHref(answers); }} />
    );

  const showContinue = !dq && ["cards", "checkboxes", "contact", "chips", "snapshot",
    "list", "gate", "listFree", "dynlist", "journey", "placeholder", "meds", "form"].indexOf(screen.type) >= 0;
  const showBack = !dq && idx > 0 && screen.type !== "result";

  return (
    <section id="assessment" ref={topRef} data-accent-page={accent ? "1" : undefined} style={{
      maxWidth: 760, margin: "0 auto",
      padding: "var(--spacing-10) var(--spacing-5) var(--spacing-20)",
      display: "flex", flexDirection: "column", gap: "var(--spacing-6)",
      // The fixed navbar pill floats over the page top; transition scrolls
      // (scrollIntoView) must land the heading below it, not under it.
      scrollMarginTop: 96,
    }}>
      {/* The page's only h1. Visually hidden because the design opens on the
          A1 hero band, not a page title — but without it the heading tree
          starts at h2 and the document has no name of its own. Not the focus
          target: that stays the per-screen h2, which is what actually
          changes. Clip-path over `display:none`, which would hide it from AT
          as well and defeat the point. */}
      <h1 style={{
        position: "absolute", width: 1, height: 1, margin: -1, padding: 0,
        overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap", border: 0,
      }}>Chime Health Assessment</h1>

      <AsmtV4Progress blocks={cfg.blocks} current={maxBlock} />

      <div className="asmt-v4-viewport">
        <div key={dq ? "dq" : screenId} ref={screenRef} className={window.gsap ? "asmt-v4-screen" : "asmt-v4-screen asmt-v4-anim"}>
          {dq
            ? <AsmtV4Disqualified copy={cfg.disqualified} headingRef={headingRef} onBack={goBack}
                onKeep={() => { window.location.href = cfg.disqualified.keepHref; }} />
            : <section data-screen-label={screen.label} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-5)" }}>
                {header}
                {body}
              </section>}
        </div>
      </div>

      {screen.type !== "result" && (showBack || showContinue) &&
        <div className="asmt-v4-nav" style={{ display: "flex", justifyContent: "space-between", gap: "var(--spacing-4)" }}>
          {showBack ? <AsmtV4Button label="Back" variant="secondary" onClick={goBack} /> : <span></span>}
          {showContinue && (screen.type === "placeholder"
            ? <AsmtV4Button label="Continue" onClick={completeStatic} />
            : <AsmtV4Button label="Continue" onClick={advance} />)}
        </div>}

      <p style={{ margin: 0, textAlign: "center" }}>
        <button type="button" onClick={startOver} className="asmt-v4-startover" style={{
          background: "none", border: "none", cursor: "pointer", font: "inherit",
          fontSize: "var(--text-xs)", color: "var(--text-muted)", textDecoration: "underline",
          padding: "var(--spacing-2)",
        }}>Start over</button>
      </p>

      <AsmtFlash message={flash} />
    </section>
  );
}

Object.assign(window, { ChimeAssessmentFlowV4 });
