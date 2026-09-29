// Chime Health — Assessment v15 flow (Weight Loss launch edition).
// Same UX contract as the live V4 flow (AssessmentV4Flow.jsx): one topic per
// screen, sticky Back/Continue, block-level progress that never regresses,
// focus to the new heading on every move, reduced motion respected. Routing
// lives in the pure asmtV15* engine; this file is glue + chrome.
//
// v15 differences on top of that contract:
//   - auto-advance only where the config sets it (A2.1, A4)
//   - exits are terminal screens with their own CTAs
//   - SENSITIVE answers (A2.2, B6b), the password and the prescription photo
//     stay in memory — asmtV15Persistable decides what reaches localStorage
//   - DS-1 footer on every screen
//   - "Go To My Account" hands the whole assessment to
//     window.chimeAssessmentSubmit(payload, extras), the backend's hook

// Its own key: the preview never touches the live assessment's saved state
// (chime_assessment_v4_4, which the cart's prefill also reads).
const ASMT_V15_STORE_KEY = "chime_assessment_v15_preview";
const ASMT_V15_CFG = () => window.CHIME_ASSESSMENT_V15;

function asmtV15InitState() {
  let answers = {}, screenId = null, maxBlock = 0;
  try {
    const saved = JSON.parse(localStorage.getItem(ASMT_V15_STORE_KEY) || "null");
    if (saved && saved.answers) {
      answers = asmtV15Prune(saved.answers);
      screenId = saved.screenId || null;
      maxBlock = saved.maxBlock || 0;
    }
  } catch (e) {}
  const q = asmtV15Queue(answers);
  // A restore can never land past an unanswered sensitive gate: those answers
  // were not saved, so the first incomplete screen is the gate itself.
  if (!screenId || q.indexOf(screenId) < 0 || q.indexOf(screenId) > q.indexOf(asmtV15FirstIncomplete(answers)))
    screenId = asmtV15FirstIncomplete(answers);
  maxBlock = Math.max(maxBlock, asmtV15BlockIndex(screenId));
  return { answers, screenId, maxBlock };
}

function ChimeAssessmentFlowV15() {
  const cfg = ASMT_V15_CFG();
  const [state, setState] = React.useState(asmtV15InitState);
  const [flash, setFlash] = React.useState("");
  const [touched, setTouched] = React.useState({});
  const [forceErrors, setForceErrors] = React.useState(false);
  // Memory-only values.
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [rxFile, setRxFile] = React.useState(null);
  const [identityOpen, setIdentityOpen] = React.useState(false);
  const [recurring, setRecurring] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const flashTimer = React.useRef(null);
  const autoTimer = React.useRef(null);
  const topRef = React.useRef(null);
  const headingRef = React.useRef(null);
  const screenRef = React.useRef(null);
  const dirRef = React.useRef(1);

  const { answers, screenId, maxBlock } = state;
  const screen = asmtV15Screen(screenId);
  const consent = screen.type === "consent" ? cfg.consents[screen.consent] : null;
  const queue = asmtV15Queue(answers);
  const idx = queue.indexOf(screenId);
  const reducedMotion = typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    try {
      const keep = asmtV15Persistable(answers);
      if (!keep) localStorage.removeItem(ASMT_V15_STORE_KEY);
      else localStorage.setItem(ASMT_V15_STORE_KEY, JSON.stringify({ answers: keep, screenId, maxBlock }));
    } catch (e) {}
  }, [answers, screenId, maxBlock]);

  // Site chrome CTAs call window.openChimeAssessment(); here the assessment IS
  // the page, so the call scrolls to the flow instead of navigating away.
  React.useEffect(() => {
    window.openChimeAssessment = () => {
      if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    return () => { delete window.openChimeAssessment; };
  }, []);

  React.useEffect(() => {
    asmtV15Track("step_viewed", { screen: screenId });
    setForceErrors(false);
    // A toast belongs to the screen that raised it.
    setFlash(""); clearTimeout(flashTimer.current);
    if (topRef.current) topRef.current.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    const t = setTimeout(() => { if (headingRef.current) headingRef.current.focus({ preventScroll: true }); }, 60);
    return () => { clearTimeout(t); clearTimeout(autoTimer.current); };
  }, [screenId]);

  React.useLayoutEffect(() => {
    if (reducedMotion || !window.gsap || !screenRef.current) return;
    const tween = window.gsap.fromTo(screenRef.current,
      { x: dirRef.current * 80, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.87, ease: "power1.out", clearProps: "transform,opacity,visibility" });
    return () => tween.kill();
  }, [screenId]);

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
    const q = asmtV15Queue(s.answers);
    const i = q.indexOf(s.screenId);
    if (i < 0 || i >= q.length - 1) return s;
    asmtV15Track("step_completed", { screen: s.screenId });
    dirRef.current = 1;
    const next = q[i + 1];
    return { ...s, screenId: next, maxBlock: Math.max(s.maxBlock, asmtV15BlockIndex(next)) };
  };

  const goBack = () => {
    clearTimeout(autoTimer.current);
    setState((s) => {
      const q = asmtV15Queue(s.answers);
      const i = q.indexOf(s.screenId);
      if (i <= 0) return s;
      dirRef.current = -1;
      return { ...s, screenId: q[i - 1] };
    });
  };

  const scheduleAdvance = () => {
    clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(() => setState(stepForward), 425);
  };

  const startOver = () => {
    clearTimeout(autoTimer.current);
    try { localStorage.removeItem(ASMT_V15_STORE_KEY); } catch (e) {}
    setTouched({}); setForceErrors(false);
    setPassword(""); setConfirm(""); setRxFile(null); setRecurring(false); setSubmitted(false);
    dirRef.current = 1;
    setState({ answers: {}, screenId: "P0.0", maxBlock: 0 });
  };

  // ---------------------------------------------------------------- answers
  const put = (patch) => setState((s) => ({ ...s, answers: asmtV15Prune({ ...s.answers, ...patch }) }));

  const setNested = (id, field, value) =>
    setState((s) => ({ ...s, answers: asmtV15Prune({ ...s.answers, [id]: { ...(s.answers[id] || {}), [field]: value } }) }));

  const toggleMulti = (value) => {
    clearTimeout(autoTimer.current);
    setState((s) => {
      const scr = asmtV15Screen(s.screenId);
      const cur = (s.answers[s.screenId] || []).slice();
      let next;
      if (cur.indexOf(value) >= 0) next = cur.filter((v) => v !== value);
      else if (scr.exclusive && value === scr.exclusive) next = [value];
      else {
        next = cur.filter((v) => v !== scr.exclusive).concat(value);
        if (scr.maxSelections && next.length > scr.maxSelections) return s;
      }
      const a = { ...s.answers };
      if (next.length) a[s.screenId] = next; else delete a[s.screenId];
      return { ...s, answers: asmtV15Prune(a) };
    });
  };

  const setSingle = (value) => {
    put({ [screenId]: value });
    const opensReveal = screen.reveal && screen.reveal.when.indexOf(value) >= 0;
    if (screen.autoAdvance && !opensReveal && !identityOpen) scheduleAdvance();
  };

  const stamp = () => ({ version: cfg.consentVersion, ts: new Date().toISOString() });

  // Phrase screens store `true` so a restore lands after them.
  const completeStatic = () =>
    setState((s) => stepForward({ ...s, answers: { ...s.answers, [s.screenId]: true } }));

  const exitAction = (action) => {
    if (action === "continue") setState((s) => stepForward({ ...s, answers: asmtV15Prune({ ...s.answers, [s.screenId]: "continue" }) }));
  };

  const declinePrivacy = () => {
    asmtV15Track("privacy_declined", { screen: "P0.2" });
    setState((s) => stepForward({ ...s, answers: asmtV15Prune({ ...s.answers, "P0.2": { declined: true } }) }));
  };

  const togglePrivacy = (key) => setState((s) => {
    const cur = { ...(s.answers["P0.2"] || {}) };
    delete cur.declined;
    cur[key] = !cur[key];
    return { ...s, answers: asmtV15Prune({ ...s.answers, "P0.2": cur }) };
  });

  const markTouched = (field) => setTouched((t) => (t[field] ? t : { ...t, [field]: true }));

  // ------------------------------------------------------------- validation
  const ctx = { password, confirm, hasFile: !!rxFile };
  const advance = () => {
    clearTimeout(autoTimer.current);
    const problem = asmtV15ScreenProblem(screenId, answers, ctx);
    if (problem) { setForceErrors(true); return say(problem); }
    setState((s) => {
      let a = s.answers;
      // Stamp what the ledger needs at the moment of agreement.
      if (screen.type === "privacy") a = { ...a, "P0.2": { ...a["P0.2"], ...stamp() } };
      if (screen.type === "password") a = { ...a, "A2.5": { set: true, mfa: !!(a["A2.5"] || {}).mfa } };
      return stepForward({ ...s, answers: a });
    });
  };

  const fieldErrors = (all, prefix) => {
    if (!all) return {};
    if (forceErrors) return all;
    const out = {};
    for (const f in all) if (touched[prefix + f]) out[f] = all[f];
    return out;
  };

  const bodyProblem = screen.type === "body" && (forceErrors || touched.body) ? asmtV15BodyProblem(answers["A2.3"]) : null;

  // ---------------------------------------------------------------- render
  const headingId = "asmt-v15-q-" + screenId.replace(/[^\w-]/g, "-");
  const title = screen.title || (consent && consent.title);
  const isDraft = screen.draft || (consent && consent.draft);
  const tags = [];
  if (isDraft) tags.push(consent ? "Draft — pending Legal / Medical Director review" : "Draft copy");
  if (screen.proposed) tags.push("Proposed — pending Legal approval");
  if (screen.titleDraft) tags.push("Draft headline");
  if (screen.supportingDraft) tags.push("Draft helper line");

  const header = title && screen.type !== "phrase" && screen.type !== "result" && (screen.hero
    ? <AsmtV4HeroHeader screen={{ ...screen, title }} headingRef={headingRef} headingId={headingId} />
    : <header style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
        <h2 id={headingId} ref={headingRef} tabIndex={-1} style={{
          margin: 0, outline: "none", fontSize: "var(--text-3xl)", fontWeight: 400, lineHeight: 1.2,
          fontFamily: "var(--font-family-display, var(--font-family-base))", color: "var(--text-default)",
        }}>{title}</h2>
        {screen.supportingLine &&
          <p style={{ margin: "0 auto", maxWidth: "36em", fontSize: "var(--text-base)", lineHeight: 1.6, color: "var(--text-secondary)" }}>
            {screen.supportingLine}
          </p>}
        {tags.length > 0 &&
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "var(--spacing-2)" }}>
            {tags.map((t) => <AsmtV15Tag key={t}>{t}</AsmtV15Tag>)}
          </div>}
      </header>);

  const reveal = (id, label) => (
    <AsmtV15Reveal open={!!screen.reveal && screen.reveal.when.indexOf(answers[id]) >= 0}>
      <AsmtV15Textarea id={"asmt-v15-" + headingId + "-text"} label={label}
        value={answers[id + "__text"]} onChange={(v) => put({ [id + "__text"]: v })} />
    </AsmtV15Reveal>
  );

  let body = null;
  const t = screen.type;
  if (t === "basics")
    body = <AsmtV15Basics screen={screen} value={answers["P0.1"]} states={cfg.states}
      onField={(f, v) => setNested("P0.1", f, v)} />;
  else if (t === "privacy")
    body = <AsmtV15Privacy screen={screen} value={answers["P0.2"]} onToggle={togglePrivacy} onDecline={declinePrivacy} />;
  else if (t === "cards")
    body = <AsmtV4MultiSelectCards options={screen.options} value={answers[screenId]} onToggle={toggleMulti} labelledBy={headingId} />;
  else if (t === "multi")
    body = screen.cards
      ? <AsmtV4MultiSelectCards options={screen.options} value={answers[screenId]} onToggle={toggleMulti}
          max={screen.maxSelections} labelledBy={headingId} />
      : screen.bubbles
        ? <AsmtV4Chips options={screen.options} value={answers[screenId]} onToggle={toggleMulti} bubbles labelledBy={headingId} />
        : <AsmtV4Checkboxes options={screen.options} value={answers[screenId]} onToggle={toggleMulti} labelledBy={headingId} />;
  else if (t === "single")
    body = (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
        {screen.intro && <AsmtV15Notice>{screen.intro}</AsmtV15Notice>}
        <AsmtV15Single screen={screen} value={answers[screenId]} onSelect={setSingle} labelledBy={headingId} />
        {screen.reveal && reveal(screenId, screen.reveal.label)}
        {screen.identityLink &&
          (identityOpen || answers[screenId + "__identity"]
            ? <AsmtV4Field id="asmt-v15-identity" label={screen.identityLink + " (optional)"}
                value={answers[screenId + "__identity"]} onChange={(v) => put({ [screenId + "__identity"]: v })} />
            : <p style={{ margin: 0, textAlign: "center" }}>
                <button type="button" onClick={() => setIdentityOpen(true)} style={{
                  background: "none", border: "none", cursor: "pointer", font: "inherit",
                  fontSize: "var(--text-sm)", color: "var(--accent-strong)", textDecoration: "underline", padding: "var(--spacing-2)",
                }}>{screen.identityLink}</button>
              </p>)}
        {screen.shareConsent && answers[screenId] === screen.shareConsent.when &&
          <AsmtV15CheckRow id="asmt-v15-share-pcp" optional checked={answers[screenId + "__share"]}
            onToggle={() => put({ [screenId + "__share"]: !answers[screenId + "__share"] })}>
            {screen.shareConsent.text}
          </AsmtV15CheckRow>}
      </div>
    );
  else if (t === "journey")
    body = <AsmtV15Journey screen={screen} value={answers[screenId]} labelledBy={headingId}
      med={answers[screenId + "__med"]} medText={answers[screenId + "__medText"]}
      onSelect={(v) => put({ [screenId]: v })}
      onMed={(v) => put({ [screenId + "__med"]: v })}
      onMedText={(v) => put({ [screenId + "__medText"]: v })} />;
  else if (t === "body")
    body = <AsmtV4Snapshot value={answers["A2.3"]} onField={(f, v) => setNested("A2.3", f, v)}
      content={null} problem={bodyProblem} onBlur={() => markTouched("body")} />;
  else if (t === "contact")
    body = <AsmtV15Contact screen={screen} value={answers.A2}
      errors={fieldErrors(asmtV15ContactProblems(answers.A2), "A2.")}
      onField={(f, v) => setNested("A2", f, v)} onBlur={(f) => markTouched("A2." + f)} />;
  else if (t === "snapshot")
    body = <AsmtV15SnapshotPanel content={asmtV15SnapshotContent(answers)} />;
  else if (t === "password")
    body = <AsmtV15Password screen={screen} email={(answers.A2 || {}).email}
      password={password} confirm={confirm} onPassword={setPassword} onConfirm={setConfirm}
      mfa={(answers["A2.5"] || {}).mfa} onMfa={() => setNested("A2.5", "mfa", !(answers["A2.5"] || {}).mfa)}
      problem={forceErrors ? asmtV15PasswordProblem(password, confirm) : null} />;
  else if (t === "selects")
    body = <AsmtV15Selects screen={screen} value={answers[screenId]} onField={(f, v) => setNested(screenId, f, v)} />;
  else if (t === "dose")
    body = <AsmtV15Dose screen={screen} value={answers[screenId]} labelledBy={headingId}
      onSelect={(v) => put({ [screenId]: v })}
      last={answers[screenId + "__last"]} onLast={(v) => put({ [screenId + "__last"]: v })}
      duration={answers[screenId + "__duration"]} onDuration={(v) => put({ [screenId + "__duration"]: v })} />;
  else if (t === "upload")
    body = <AsmtV15Upload screen={screen} value={answers[screenId]} labelledBy={headingId}
      onSelect={(v) => { put({ [screenId]: v }); if (v !== "Yes") setRxFile(null); }}
      file={rxFile} onFile={setRxFile} />;
  else if (t === "consent")
    body = <AsmtV15Consent consent={consent} id={screen.consent} value={answers[screenId]}
      onToggle={() => put({ [screenId]: answers[screenId] && answers[screenId].agreed ? undefined : { agreed: true, ...stamp() } })} />;
  else if (t === "address")
    body = <AsmtV15Address value={answers.D1} states={cfg.states}
      errors={fieldErrors(asmtV15AddressProblems(answers.D1, (answers["P0.1"] || {}).state), "D1.")}
      onField={(f, v) => setNested("D1", f, v)} onBlur={(f) => markTouched("D1." + f)} />;
  else if (t === "idverify")
    body = <AsmtV15IdVerify screen={screen} value={answers[screenId]}
      onChange={(v) => put({ [screenId]: v.biometricConsent ? { ...v, ...stamp() } : v })} />;
  else if (t === "scheduler")
    body = <AsmtV15VendorSlot title="Video visit scheduler"
      note="The scheduling tool opens here once it is connected. It appears only in states the modality matrix marks as live video; until the matrix exists, every state is treated as video-required." />;
  else if (t === "exit")
    body = <AsmtV15Exit screen={screen} onAction={exitAction} />;
  else if (t === "phrase")
    body = <AsmtV4Phrase title={screen.title} supportingLine={screen.supportingLine}
      cta={screen.cta} onCta={completeStatic} headingRef={headingRef} accent={screen.pageAccent}
      image={screen.image} imageAlt={screen.imageAlt} imageCutout={screen.imageCutout} />;
  else if (t === "result")
    body = <AsmtV15Result rec={asmtV15Result(answers)} headingRef={headingRef}
      recurring={recurring} onRecurring={() => setRecurring(!recurring)} submitted={submitted}
      onCta={() => {
        const payload = asmtV15Payload(answers);
        const extras = { password, prescriptionFile: rxFile, recurringChargesAgreed: recurring };
        asmtV15Track("assessment_submitted", { providerFlags: payload.providerFlags.length, suppressed: payload.suppression.suppress });
        if (typeof window.chimeAssessmentSubmit === "function") window.chimeAssessmentSubmit(payload, extras);
        else setSubmitted(true);
      }} />;

  // Continue is shown wherever the screen has something to confirm.
  const noContinue = ["phrase", "exit", "result"];
  const showContinue = noContinue.indexOf(t) < 0;
  const showBack = idx > 0 && t !== "result";

  return (
    <section id="assessment" ref={topRef} data-accent-page={screen.pageAccent ? "1" : undefined} style={{
      maxWidth: 760, margin: "0 auto",
      padding: "var(--spacing-10) var(--spacing-5) var(--spacing-12)",
      display: "flex", flexDirection: "column", gap: "var(--spacing-6)",
      scrollMarginTop: 96,
    }}>
      <h1 style={{
        position: "absolute", width: 1, height: 1, margin: -1, padding: 0,
        overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap", border: 0,
      }}>Chime Health Assessment</h1>

      <AsmtV4Progress blocks={cfg.blocks} current={maxBlock} />

      <div className="asmt-v4-viewport">
        <div key={screenId} ref={screenRef} className={window.gsap ? "asmt-v4-screen" : "asmt-v4-screen asmt-v4-anim"}>
          <section data-screen-label={screen.label} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-5)" }}>
            {header}
            {body}
          </section>
        </div>
      </div>

      {(showBack || showContinue) &&
        <div className="asmt-v4-nav" style={{ display: "flex", justifyContent: "space-between", gap: "var(--spacing-4)" }}>
          {showBack ? <AsmtV4Button label="Back" variant="secondary" onClick={goBack} /> : <span></span>}
          {showContinue && <AsmtV4Button label="Continue" onClick={advance} />}
        </div>}

      <p style={{ margin: 0, textAlign: "center" }}>
        <button type="button" onClick={startOver} className="asmt-v4-startover" style={{
          background: "none", border: "none", cursor: "pointer", font: "inherit",
          fontSize: "var(--text-xs)", color: "var(--text-muted)", textDecoration: "underline",
          padding: "var(--spacing-2)",
        }}>Start over</button>
      </p>

      <AsmtV15Footer notice={cfg.footerNotice} links={cfg.footerLinks} />

      <AsmtFlash message={flash} />
    </section>
  );
}

Object.assign(window, { ChimeAssessmentFlowV15 });
