// Chime Health — shared weight-loss calculator.
// Single source of truth used by BOTH the homepage (ChimeWeightLossSection) and the
// Weight Loss landing page (WLCalculatorSection). Load this script before either.
// Exposes WLCalculatorCard / WLSlider / wlDerive on window.

function WLSlider({ label, value, min, max, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.85)" }}>{label}</span>
        <span style={{ fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-medium)", color: "var(--color-white)", fontVariantNumeric: "tabular-nums" }}>{value} lb</span>
      </div>
      <input type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "var(--color-tide-300)", cursor: "pointer" }} />
    </div>
  );
}

// Single source of truth for everything the calculator displays.
// Assumes goalWeight ≤ startWeight − 5 (enforced by the slider interlocks).
const WL_PACE_RATES = { steady: 1.0, standard: 1.4, ambitious: 1.8 }; // lb/week

function wlDerive(startWeight, goalWeight, pace) {
  const totalChange = startWeight - goalWeight;
  const rate = WL_PACE_RATES[pace];
  const weeks = Math.ceil(totalChange / rate);
  const months = Math.round((weeks / 4.345) * 10) / 10;

  // Curve: smoothstep descent to goal, then a flat sustain tail ≈ 20% past it.
  const horizon = weeks * 1.2;
  const samples = [];
  for (let i = 0; i <= 60; i++) {
    const w = (i / 60) * horizon;
    const u = Math.min(1, w / weeks);
    const smooth = 3 * u * u - 2 * u * u * u;
    samples.push({ w, weight: w <= weeks ? startWeight - totalChange * smooth : goalWeight });
  }

  // Milestone weeks must be strictly increasing: cap m2 below the final week,
  // and let m1 fall to week 1 when m2 is already at its floor of 2.
  const m2 = Math.min(Math.round(weeks / 2), weeks - 1);
  let m1 = Math.min(4, Math.max(2, Math.round(weeks * 0.22)));
  if (m1 >= m2) m1 = Math.max(1, m2 - 1);
  return { totalChange, rate, weeks, months, horizon, samples, milestoneWeeks: [m1, m2, weeks] };
}

function WLCalculatorCard() {
  const [start, setStart] = React.useState(190);
  const [goal, setGoal] = React.useState(165);
  const [pace, setPace] = React.useState("standard");
  // On mobile the chart column is narrow; a 2.95:1 viewBox collapses the chart
  // to ~66px tall. Switch to a squarer viewBox so it redraws at a readable height.
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 960px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const paces = [
    { id: "steady", label: "Steady", rate: 1.0 },
    { id: "standard", label: "Standard", rate: 1.4 },
    { id: "ambitious", label: "Ambitious", rate: 1.8 },
  ];
  const d = wlDerive(start, goal, pace);
  const change = d.totalChange;
  const weeks = d.weeks;
  const months = d.months.toFixed(1);

  // Project the derived samples into the SVG coordinate space. On mobile a squarer
  // viewBox (and larger label font) keeps the chart legible in the narrow column.
  const W = isMobile ? 380 : 560, H = isMobile ? 300 : 190;
  const padX = 34, padY = isMobile ? 30 : 22;
  const fs = isMobile ? 16 : 11;
  const pts = d.samples.map((s) => [
    padX + (s.w / d.horizon) * (W - 2 * padX),
    padY + ((start - s.weight) / d.totalChange) * (H - 2 * padY),
  ]);
  const goalX = padX + (d.weeks / d.horizon) * (W - 2 * padX);
  const goalY = H - padY;
  const path = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const milestones = [
    { wk: "Week " + d.milestoneWeeks[0], title: "First check-in", body: "Review progress & adjust plan" },
    { wk: "Week " + d.milestoneWeeks[1], title: "Building momentum", body: "Dose optimization phase" },
    { wk: "Week " + d.milestoneWeeks[2], title: "Sustain & thrive", body: "Long-term strategy set" },
  ];

  const panel = {
    background: "rgba(17,30,44,0.55)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "var(--radius-2xl)", padding: "var(--spacing-6)",
  };

  return (
    <div style={{
      background: "rgba(24,42,63,0.35)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "var(--radius-3xl)", padding: "var(--spacing-8)", height: "100%", boxSizing: "border-box",
      display: "flex", flexDirection: "column", gap: "var(--spacing-6)",
    }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "var(--spacing-2)", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: "var(--text-3xl)", fontWeight: 300, lineHeight: 1.15, color: "var(--color-white)" }}>See it before you start</h3>
        <p style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: 1.5, color: "rgba(255,255,255,0.9)", maxWidth: "30em" }}>Adjust targets and preview a timeline. Your clinician personalizes the final plan.</p>
      </div>

      <div className="wl-calc-grid grid grid-cols-1 min-[961px]:grid-cols-[minmax(260px,340px)_1fr]" style={{ gap: "var(--spacing-5)", alignItems: "stretch", flex: 1 }}>
        {/* Controls */}
        <div style={Object.assign({}, panel, { display: "flex", flexDirection: "column", gap: "var(--spacing-5)" })}>
          <WLSlider label="Starting weight" value={start} min={120} max={350} onChange={(v) => { setStart(v); if (goal > v - 5) setGoal(v - 5); }} />
          <WLSlider label="Goal weight" value={goal} min={100} max={start - 5} onChange={(v) => setGoal(Math.min(v, start - 5))} />
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
            <span style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.85)" }}>Pace preference</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, background: "rgba(24,42,63,0.30)", borderRadius: "var(--radius-lg)", padding: 4 }}>
              {paces.map((p) => (
                <button key={p.id} onClick={() => setPace(p.id)} style={{
                  border: "none", cursor: "pointer", borderRadius: "var(--radius-md)",
                  padding: "var(--spacing-2) var(--spacing-1)", textAlign: "center",
                  background: pace === p.id ? "var(--color-tide-300)" : "transparent",
                  color: pace === p.id ? "#12263B" : "rgba(255,255,255,0.85)",
                  fontFamily: "inherit", transition: "background 0.25s var(--ease-in-out), color 0.25s var(--ease-in-out)",
                }}>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)" }}>{p.label}</div>
                  <div style={{ fontSize: "var(--text-xs)", opacity: 0.75 }}>{p.rate.toFixed(1)} lb/week</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{
            background: "var(--color-tide-300)", borderRadius: "var(--radius-xl)",
            padding: "var(--spacing-4) var(--spacing-5)",
            display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--spacing-4)", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: "#12263B", opacity: 0.7 }}>Estimated timeline</div>
              <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)", color: "#12263B", fontVariantNumeric: "tabular-nums" }}>{weeks} wk (~{months} mo)</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: "#12263B", opacity: 0.7 }}>Total change</div>
              <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)", color: "#12263B", fontVariantNumeric: "tabular-nums" }}>−{change} lb</div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: "var(--text-xs)", lineHeight: 1.5, color: "rgba(255,255,255,0.8)" }}>Projections are not guarantees. Your clinician determines eligibility, dosing, and timelines based on your individual profile.</p>
        </div>

        {/* Timeline chart */}
        <div style={Object.assign({}, panel, { display: "flex", flexDirection: "column", gap: "var(--spacing-4)" })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>Estimated timeline</span>
            <span style={{
              fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-white)",
              border: "1px solid rgba(255,255,255,0.25)", borderRadius: "var(--radius-4xl)",
              padding: "2px var(--spacing-3)", background: "rgba(255,255,255,0.08)",
            }}>{paces.find((p) => p.id === pace).label} Pace</span>
          </div>
          <svg viewBox={"0 0 " + W + " " + H} style={{ width: "100%", height: "auto", flex: 1 }} aria-label={"Projected weight from " + start + " to " + goal + " pounds"}>
            <line x1={padX} y1={padY} x2={W - padX} y2={padY} stroke="rgba(255,255,255,0.12)" strokeDasharray="3 4"></line>
            <line x1={padX} y1={H - padY} x2={W - padX} y2={H - padY} stroke="rgba(255,255,255,0.12)" strokeDasharray="3 4"></line>
            <text x={padX - 6} y={padY + 4} textAnchor="end" fontSize={fs} fill="rgba(255,255,255,0.8)">{start}</text>
            <text x={padX - 6} y={H - padY + 4} textAnchor="end" fontSize={fs} fill="rgba(255,255,255,0.8)">{goal}</text>
            <path d={path} fill="none" stroke="var(--color-tide-300)" strokeWidth="2.5" strokeLinecap="round" style={{ transition: "d 0.4s var(--ease-in-out)" }}></path>
            <circle cx={pts[0][0]} cy={pts[0][1]} r="5" fill="var(--color-tide-300)"></circle>
            <circle cx={goalX} cy={goalY} r="5" fill="var(--color-tide-300)" style={{ transition: "cx 0.4s var(--ease-in-out)" }}></circle>
            <text x={goalX} y={H - padY + 16} textAnchor="middle" fontSize={fs} fill="rgba(255,255,255,0.85)" style={{ transition: "x 0.4s var(--ease-in-out)" }}>Wk {weeks}</text>
            <text x={padX} y={H - padY + 16} textAnchor="middle" fontSize={fs} fill="rgba(255,255,255,0.8)">Wk 0</text>
          </svg>
          <div className="wl-calc-milestones grid grid-cols-1 min-[561px]:grid-cols-3" style={{ gap: "var(--spacing-3)" }}>
            {milestones.map((m) => (
              <div key={m.title} style={{
                background: "rgba(24,42,63,0.30)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "var(--radius-xl)", padding: "var(--spacing-4)",
                display: "flex", flexDirection: "column", gap: "var(--spacing-1)",
              }}>
                <div style={{ fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)" }}>{m.wk}</div>
                <div style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-white)" }}>{m.title}</div>
                <div style={{ fontSize: "var(--text-sm)", lineHeight: 1.4, color: "rgba(255,255,255,0.85)" }}>{m.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WLCalculatorCard, WLSlider, wlDerive });
