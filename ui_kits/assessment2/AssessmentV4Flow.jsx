// Chime Health — Assessment v4 flow component.
// One state object (answers + current screen + highest block reached),
// persisted to localStorage under its own versioned key so a v4 rollout never
// tries to restore v1-shaped answers. All routing/scoring goes through the
// pure asmtV4* engine (assessment-v4-logic.js); this file is glue + chrome.
//
// UX contract (behavioral only — copy stays verbatim from the config):
//   - one screen, one topic; EVERY screen advances on Continue only. Choosing
//     an option never moves the user on by itself — picking and proceeding are
//     separate acts, so a mis-tap costs a correction rather than a screen.
//   - Back on every screen except after D renders; answers preserved; a
//     routing-relevant change recomputes the queue forward (asmtV4Prune)
//   - block-level progress only, and it may never regress (maxBlock)
//   - focus moves to the new screen's heading on every transition;
//     prefers-reduced-motion drops the slide/scroll animation
//   - inline validation on blur/change, kind tone, never on load

const ASMT_V4_STORE_KEY = "chime_assessment_v4";
const ASMT_V4_CFG = () => window.CHIME_ASSESSMENT_V4;

// Visual order of A3 fields, for focusing the first field needing attention.
const ASMT_V4_FIELD_IDS = [
  ["firstName", "asmt-v4-first"], ["lastName", "asmt-v4-last"],
  ["email", "asmt-v4-email"], ["phone", "asmt-v4-phone"],
  ["address1", "asmt-v4-address1"], ["city", "asmt-v4-city"],
  ["zip", "asmt-v4-zip"], ["state", "asmt-v4-state"],
  ["sex", null], ["dob", "asmt-v4-dob"],
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
  maxBlock = Math.max(maxBlock, asmtV4BlockIndex(screenId));
  return { answers, screenId, maxBlock };
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

  const { answers, screenId, maxBlock } = state;
  const screen = asmtV4ScreenById(screenId);
  const queue = asmtV4Queue(answers);
  const idx = queue.indexOf(screenId);
  const reducedMotion = typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    try { localStorage.setItem(ASMT_V4_STORE_KEY, JSON.stringify({ answers, screenId, maxBlock })); } catch (e) {}
  }, [answers, screenId, maxBlock]);

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
    asmtV4Track("step_viewed", { screen: screenId });
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
  }, [screenId]);

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
      { x: 0, autoAlpha: 1, duration: 0.3, ease: "power1.out",
        clearProps: "transform,opacity,visibility" });
    return () => tween.kill();
  }, [screenId]);

  // Screens flagged pageAccent paint the whole page in the theme's main blue.
  // It goes on <body> rather than on #assessment because the section is a
  // 760px centred column — a background there would be a stripe, not a page.
  // Safe to take over: the footer carries its own dark background and the
  // navbar is 88%-opaque, so neither inherits this. Cleanup clears the inline
  // style, which hands the colour back to the stylesheet rule.
  React.useEffect(() => {
    if (!screen.pageAccent) return;
    document.body.style.background = "var(--accent-strong)";
    return () => { document.body.style.background = ""; };
  }, [screen.pageAccent]);

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
    dirRef.current = 1;
    const next = q[i + 1];
    return { ...s, screenId: next, maxBlock: Math.max(s.maxBlock, asmtV4BlockIndex(next)) };
  };

  const goBack = () => {
    clearTimeout(autoTimer.current);
    setState((s) => {
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
  const scheduleAdvance = () => {
    clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(() => setState(stepForward), 250);
  };

  const startOver = () => {
    clearTimeout(autoTimer.current);
    try { localStorage.removeItem(ASMT_V4_STORE_KEY); } catch (e) {}
    setTouched({});
    setForceErrors(false);
    dirRef.current = 1;
    const goals = asmtV4ProductGoals(location.search);
    setState({ answers: goals.length ? { A1: goals } : {}, screenId: "A1", maxBlock: 0 });
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
      // A changed B1.3 answer switches the dose ladder — the old dose would be
      // from the wrong ladder, so it never survives the change.
      if (s.screenId === "B1.3" && s.answers["B1.3"] !== value) delete a["B1.4"];
      return { ...s, answers: asmtV4Prune(a) };
    });
    if (screen.autoAdvance && !noAuto) scheduleAdvance();
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
  const completeStatic = () =>
    setState((s) => stepForward({ ...s, answers: { ...s.answers, [s.screenId]: true } }));

  // ------------------------------------------------------------- validation
  const contactErrors = (() => {
    if (screen.type !== "contact") return {};
    const all = asmtV4ContactProblems(answers.A3) || {};
    if (forceErrors) return all;
    const out = {};
    for (const f in all) if (touched[f]) out[f] = all[f];
    return out;
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
      if (problem) return say(problem);
      if (!answers.A6 || asmtV4SnapshotTier(answers) === null)
        return say("Please add your height and weight to continue.");
    }
    if ((t === "list" || t === "gate" || t === "dynlist" || t === "listFree") && !answers[screenId])
      return say("Please choose an option to continue.");
    if (t === "listFree" && answers[screenId] === cfg.b13OtherValue && !String(answers["B1.3_other"] || "").trim())
      return say("Please tell us which medication — or choose another option.");
    setState(stepForward);
  };

  // ---------------------------------------------------------------- render
  const header = screen.title && screen.type !== "phrase" && (screen.hero ?
    <AsmtV4HeroHeader screen={screen} headingRef={headingRef} />
    :
    <header style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
      <h2 ref={headingRef} tabIndex={-1} style={{
        margin: 0, outline: "none", fontSize: "var(--text-3xl)", fontWeight: 400, lineHeight: 1.2,
        fontFamily: "var(--font-family-display, var(--font-family-base))", color: "var(--text-default)",
      }}>{screen.title}</h2>
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
    body = <AsmtV4MultiSelectCards options={screen.options} value={answers[screenId]} onToggle={toggleMulti} />;
  else if (screen.type === "checkboxes")
    // `cards` is presentation only — the type stays "checkboxes" so validation
    // keeps saying "option" (the "cards" branch says "goal", which is A1's word).
    // Cards need {value, icon} options; the row list takes plain strings.
    body = screen.cards
      ? <AsmtV4MultiSelectCards options={screen.options} value={answers[screenId]} onToggle={toggleMulti} />
      : <AsmtV4Checkboxes options={screen.options} value={answers[screenId]} onToggle={toggleMulti} />;
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
          onField={(f, v) => setNested("A3", f, v)} onBlur={markTouched}
          states={screen.shippingStates} maskDob={asmtV4MaskDob} />
      </div>
    );
  else if (screen.type === "chips")
    body = screen.cards
      ? <AsmtV4MultiSelectCards options={screen.options} value={answers[screenId]} onToggle={toggleMulti}
          max={screen.maxSelections} />
      : <AsmtV4Chips options={screen.options} value={answers[screenId]} onToggle={toggleMulti}
          max={screen.maxSelections} bubbles={screen.bubbles} />;
  else if (screen.type === "list")
    // Same `cards` flag as A2 — presentation only. The card grid normalises
    // its options, so a screen may pass plain strings (no icon) or
    // {value, icon}; scales pass strings.
    body = screen.cards
      ? <AsmtV4SingleSelectCards options={screen.options} value={answers[screenId]} onSelect={setSingle} />
      : <AsmtV4SingleSelectList options={screen.options} value={answers[screenId]} onSelect={setSingle}
          bubbles={screen.bubbles} />;
  else if (screen.type === "gate")
    body = screen.cards
      ? <AsmtV4SingleSelectCards options={screen.options} value={answers[screenId]} onSelect={setSingle} />
      : <AsmtV4YesNoGate options={screen.options} value={answers[screenId]} onSelect={setSingle}
          bubbles={screen.bubbles} />;
  else if (screen.type === "listFree")
    body = (
      <AsmtV4SingleSelectWithFreeText options={screen.options} freeValue={cfg.b13OtherValue}
        value={answers[screenId]} freeText={answers["B1.3_other"]}
        onSelect={(v) => setSingle(v, v === cfg.b13OtherValue)} bubbles={screen.bubbles} cards={screen.cards}
        onFreeText={(v) => setState((s) => ({ ...s, answers: { ...s.answers, "B1.3_other": v } }))} />
    );
  else if (screen.type === "dynlist")
    body = (
      <AsmtV4DynamicSingleSelect ladders={screen.ladders} dependsOn={answers["B1.3"]}
        value={answers[screenId]} onSelect={setSingle} bubbles={screen.bubbles} cards={screen.cards} />
    );
  else if (screen.type === "snapshot")
    body = (
      <AsmtV4Snapshot value={answers.A6} onField={(f, v) => setNested("A6", f, v)}
        content={asmtV4SnapshotContent(answers)} problem={asmtV4SnapshotProblem(answers.A6)} />
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
  else if (screen.type === "result")
    body = (
      <AsmtV4Result rec={asmtV4Recommendation(answers)} headingRef={headingRef}
        onCreateAccount={() => say("PLACEHOLDER — account creation lands here.")} />
    );

  const showContinue = ["cards", "checkboxes", "contact", "chips", "snapshot",
    "list", "gate", "listFree", "dynlist", "placeholder"].indexOf(screen.type) >= 0;
  const showBack = idx > 0 && screen.type !== "result";

  return (
    <section id="assessment" ref={topRef} data-accent-page={screen.pageAccent ? "1" : undefined} style={{
      maxWidth: 760, margin: "0 auto",
      padding: "var(--spacing-10) var(--spacing-5) var(--spacing-20)",
      display: "flex", flexDirection: "column", gap: "var(--spacing-6)",
      // The fixed navbar pill floats over the page top; transition scrolls
      // (scrollIntoView) must land the heading below it, not under it.
      scrollMarginTop: 96,
    }}>
      <AsmtV4Progress blocks={cfg.blocks} current={maxBlock} />

      <div className="asmt-v4-viewport">
        <div key={screenId} ref={screenRef} className={window.gsap ? "asmt-v4-screen" : "asmt-v4-screen asmt-v4-anim"}>
          <section data-screen-label={screen.label} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-5)" }}>
            {header}
            {body}
          </section>
        </div>
      </div>

      {screen.type !== "result" && (showBack || showContinue) &&
        <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--spacing-4)" }}>
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
