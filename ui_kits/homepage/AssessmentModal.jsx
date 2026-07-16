// Chime Health — Assessment modal (dummy)
// Layout guide: uploads/pasted-1783961485984-0.png (breadcrumb, check stepper,
// one question at a time with lettered answers). Chime tokens throughout.
// Opened via window.openChimeAssessment(). No nav links inside the modal.

// The small circle used twice below: the progress stepper's dots and each
// answer row's letter. Kept local rather than promoted to shared/ui — this file
// is its only consumer, and AssessmentModal already loads on all four pages, so
// a shared file would cost four <script> tags for no reuse. Phase 7.
//   size:     px (26 stepper dot · 28 answer letter)
//   state:    "done" | "current" | "todo"
//   elevated: lift the "done" state (answer rows only)
function StepBadge({ size = 26, state = "todo", elevated, ariaLabel, children }) {
  const done = state === "done";
  return (
    <span aria-label={ariaLabel} style={{
      width: size, height: size, borderRadius: "50%", flex: "none", boxSizing: "border-box",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: done ? "var(--accent-strong)" : "var(--color-white)",
      border: done ? "1px solid var(--accent-strong)"
        : (state === "current" ? "2px solid var(--accent-strong)" : "1px solid var(--border-strong)"),
      color: done ? "var(--color-white)" : "var(--text-secondary)",
      fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)",
      boxShadow: (done && elevated) ? "var(--shadow-sm)" : "none",
    }}>{children}</span>
  );
}

const ASSESSMENT_SECTIONS = [
  {
    name: "About you",
    questions: [
      { id: "age", label: "What's your age range?", options: ["18–29", "30–44", "45–59", "60+"] },
      { id: "health", label: "How would you describe your overall health?", options: ["Excellent", "Good", "Fair", "Not sure"] },
      { id: "meds", label: "Do you take any medications regularly?", options: ["Yes", "No", "Prefer not to say"] },
      { id: "activity", label: "How active are you in a typical week?", options: ["Very active", "Somewhat active", "Mostly sedentary"] },
    ],
  },
  {
    name: "Your goals",
    questions: [
      { id: "goal", label: "What's your primary goal?", options: ["Weight loss", "Energy & wellness", "Lab insights", "Not sure yet"] },
      { id: "timeline", label: "When would you like to see progress?", options: ["1–3 months", "3–6 months", "No rush"] },
      { id: "tried", label: "What have you tried before?", options: ["Diet & exercise", "Medication", "Coaching", "Nothing yet"] },
      { id: "support", label: "What kind of support sounds right?", options: ["Coaching", "Medication", "Both", "Unsure"] },
    ],
  },
  {
    name: "Your lifestyle",
    questions: [
      { id: "sleep", label: "How many hours do you sleep most nights?", options: ["Less than 6", "6–7", "7–9", "9+"] },
      { id: "stress", label: "How would you rate your stress lately?", options: ["Low", "Moderate", "High"] },
      { id: "eating", label: "How would you describe your eating habits?", options: ["Consistent", "Up and down", "Could use help"] },
      { id: "ready", label: "How ready are you to start?", options: ["Ready now", "Within a month", "Just exploring"] },
    ],
  },
];

const ASSESSMENT_FLAT = ASSESSMENT_SECTIONS.flatMap((s, si) =>
  s.questions.map((q, qi) => ({ ...q, section: s.name, sectionIndex: si, indexInSection: qi }))
);

function ChimeAssessmentModal() {
  const [open, setOpen] = React.useState(false);
  const [qIndex, setQIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    window.openChimeAssessment = () => { setOpen(true); setQIndex(0); setDone(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => { delete window.openChimeAssessment; document.removeEventListener("keydown", onKey); };
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const total = ASSESSMENT_FLAT.length;
  const q = ASSESSMENT_FLAT[Math.min(qIndex, total - 1)];
  const pick = (opt) => setAnswers((a) => ({ ...a, [q.id]: opt }));
  const next = () => { if (qIndex < total - 1) setQIndex(qIndex + 1); else setDone(true); };
  const back = () => { if (qIndex > 0) setQIndex(qIndex - 1); };

  return (
    <div role="dialog" aria-modal="true" aria-label="Health assessment"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      style={{
        position: "fixed", inset: 0, zIndex: "var(--z-modal)",
        background: "rgba(27,38,58,0.45)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "var(--spacing-5)",
      }}>
      <div style={{
        background: "var(--color-white)", borderRadius: "var(--radius-3xl)",
        width: "min(920px, 100%)", height: "min(820px, calc(100vh - 64px))",
        display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: "var(--shadow-xl, 0 24px 64px rgba(27,38,58,0.35))",
      }}>

        {/* Header — logo left, close right */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "var(--spacing-4)", padding: "var(--spacing-5) var(--spacing-10)",
          borderBottom: "1px solid var(--border-default)", flex: "none",
        }}>
          <img src={(window.CHIME_ASSETS_BASE || "../../assets") + "/logo-slate.png"} alt="Chime Health" style={{ height: 36, width: "auto", display: "block" }} />
          <button type="button" onClick={() => setOpen(false)} aria-label="Close assessment"
            style={{
              width: 36, height: 36, borderRadius: "50%", cursor: "pointer",
              border: "1px solid var(--border-default)", background: "var(--color-white)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-default)", flex: "none",
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>
          </button>
        </div>

        {done ?
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "var(--spacing-4)", padding: "var(--spacing-10)" }}>
            <span style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "var(--accent-strong)", color: "var(--color-white)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5L20 7"></path></svg>
            </span>
            <h2 style={{ margin: 0, fontSize: "var(--text-3xl)", fontWeight: 400, color: "var(--text-default)" }}>You're all set</h2>
            <p style={{ margin: 0, maxWidth: "28em", fontSize: "var(--text-base)", lineHeight: 1.6, color: "var(--text-secondary)" }}>
              Thanks — a licensed provider will review your answers and recommend the right path for you. This is a demo assessment; no data was submitted.
            </p>
            <button type="button" onClick={() => setOpen(false)}
              style={{
                marginTop: "var(--spacing-2)",
                background: "var(--primary-default)", color: "var(--text-on-primary)",
                border: "1px solid transparent", borderRadius: "var(--radius-4xl)",
                padding: "var(--spacing-3) var(--spacing-8)", cursor: "pointer",
                fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)",
              }}>Close</button>
          </div>
          :
          <div style={{ flex: 1, overflowY: "auto", padding: "var(--spacing-6) var(--spacing-10) var(--spacing-8)", display: "flex", flexDirection: "column", gap: "var(--spacing-5)", background: "var(--bg-default)" }}>

            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)", fontSize: "var(--text-sm)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-strong)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5m6-6-6 6 6 6"></path></svg>
              <span style={{ color: "var(--accent-strong)", fontWeight: "var(--font-weight-semibold)" }}>Health Assessment</span>
              <span style={{ color: "var(--text-secondary)" }}>/</span>
              <span style={{ color: "var(--text-default)", fontWeight: "var(--font-weight-medium)" }}>{"Section " + (q.sectionIndex + 1) + ": " + q.section}</span>
            </div>

            {/* Stepper */}
            <div style={{
              display: "flex", alignItems: "center",
              background: "var(--color-white)", border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-xl)", padding: "var(--spacing-4) var(--spacing-6)",
            }}>
              {ASSESSMENT_FLAT.map((fq, i) => {
                const complete = i < qIndex || (i === qIndex && !!answers[fq.id]);
                const current = i === qIndex;
                return (
                  <React.Fragment key={fq.id}>
                    {i > 0 &&
                      <span style={{ flex: 1, height: 2, minWidth: 10, background: i <= qIndex ? "var(--accent-strong)" : "var(--border-default)" }}></span>}
                    <StepBadge size={26} ariaLabel={"Question " + (i + 1)}
                      state={complete ? "done" : (current ? "current" : "todo")}>
                      {complete ?
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5L20 7"></path></svg>
                        : (i + 1)}
                    </StepBadge>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Title row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--spacing-4)", flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: "var(--text-2xl)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-default)" }}>
                {q.section + " : Assessment"}
              </h2>
              <button type="button" onClick={back} disabled={qIndex === 0}
                style={{
                  background: qIndex === 0 ? "var(--bg-secondary)" : "var(--color-white)",
                  color: qIndex === 0 ? "var(--text-muted, var(--text-secondary))" : "var(--text-default)",
                  border: "1px solid var(--border-default)", borderRadius: "var(--radius-4xl)",
                  padding: "var(--spacing-2) var(--spacing-6)", cursor: qIndex === 0 ? "default" : "pointer",
                  fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)",
                  opacity: qIndex === 0 ? 0.6 : 1,
                }}>Back</button>
            </div>

            {/* Question card */}
            <div style={{
              background: "var(--color-white)", border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-xl)", padding: "var(--spacing-6) var(--spacing-8)",
              display: "flex", flexDirection: "column", gap: "var(--spacing-4)",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--spacing-4)", flexWrap: "wrap" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
                  <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{"Question " + (qIndex + 1) + " of " + total}</span>
                  <p style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)", color: "var(--text-default)", maxWidth: "34em" }}>{q.label}</p>
                </div>
                <button type="button" onClick={next}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "var(--spacing-2)", flex: "none",
                    background: "var(--primary-default)", color: "var(--text-on-primary)",
                    border: "1px solid transparent", borderRadius: "var(--radius-4xl)",
                    padding: "var(--spacing-3) var(--spacing-6)", cursor: "pointer",
                    fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)",
                    boxShadow: "var(--shadow-sm)",
                  }}>
                  {qIndex === total - 1 ? "Finish" : "Next Question"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"></path></svg>
                </button>
              </div>

              {/* Instruction banner */}
              <div style={{
                background: "var(--accent-muted, var(--color-iris-200))",
                color: "var(--accent-strong)",
                borderRadius: "var(--radius-md)", padding: "var(--spacing-2) var(--spacing-4)",
                fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)",
                letterSpacing: "0.04em", textTransform: "uppercase",
              }}>Choose one answer that most applies to you</div>

              {/* Lettered answers */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {q.options.map((opt, oi) => {
                  const selected = answers[q.id] === opt;
                  return (
                    <AssessmentAnswerRow key={opt} letter={String.fromCharCode(97 + oi)} label={opt}
                      selected={selected} last={oi === q.options.length - 1} onSelect={() => pick(opt)} />
                  );
                })}
              </div>
            </div>

          </div>}
      </div>
    </div>
  );
}

function AssessmentAnswerRow({ letter, label, selected, last, onSelect }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onSelect} aria-pressed={selected}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: "var(--spacing-4)",
        width: "100%", textAlign: "left", cursor: "pointer", font: "inherit",
        background: hover ? "var(--bg-secondary)" : "transparent",
        border: "none", borderBottom: last ? "none" : "1px solid var(--border-default)",
        padding: "var(--spacing-4) var(--spacing-2)",
        transition: "background var(--transition-base) var(--ease-in-out)",
      }}>
      <StepBadge size={28} state={selected ? "done" : "todo"} elevated>{letter}</StepBadge>
      <span style={{ fontSize: "var(--text-base)", color: "var(--text-default)", fontWeight: selected ? "var(--font-weight-semibold)" : "var(--font-weight-normal)" }}>{label}</span>
    </button>
  );
}

Object.assign(window, { ChimeAssessmentModal });
