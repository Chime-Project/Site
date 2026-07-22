// Chime Health — shared weight-loss calculator.
// Single source of truth used by BOTH the homepage (ChimeWeightLossSection) and the
// Weight Loss landing page (WLCalculatorSection). Load this script before either.
// Exposes WLCalculatorCard / WLSlider / wlDerive on window.
//
// Two placements, same idiom as RxCarousel:
//   variant="light" — Weight Loss landing: ink-on-white card on an accent band.
//   variant="dark"  — homepage: dark glass card matching its sibling cards.
// Colors bind to --accent-* / --glass-* / white+ink only, so both variants still
// follow whatever palette the enclosing data-theme sets.

// The dark variant leans on --accent-subtleHover (tide-200), NOT --accent-default:
// on the homepage --accent-default IS the band's ground (tide-500), so it
// would sink into the card it's drawn on. Same reasoning as RxCarousel's dark stops.
const WL_CALC_VARIANTS = {
  light: {
    cardBg: "var(--color-white)", cardBorder: "var(--accent-border)", cardShadow: "var(--shadow-md)",
    panelBg: "var(--accent-subtle)", panelBorder: "var(--accent-border)",
    title: "var(--text-default)", body: "var(--fg-muted)", muted: "var(--fg-muted)",
    accent: "var(--accent-default)", grid: "var(--accent-border)",
    tileBg: "var(--color-white)", tileBorder: "var(--accent-border)", tileLabel: "var(--accent-strong)",
    segBg: "var(--color-white)", segBorder: "var(--accent-border)",
    segOnBg: "var(--accent-default)", segOnText: "var(--color-white)", segOffText: "var(--fg-muted)",
    statBg: "var(--accent-border)", statText: "var(--accent-active)", statLabel: "var(--accent-active)", statLabelOpacity: 0.7,
    badgeBg: "var(--color-white)", badgeBorder: "var(--accent-border)", badgeText: "var(--accent-strong)",
  },
  dark: {
    cardBg: "var(--glass-surface)", cardBorder: "var(--glass-border)", cardShadow: "none",
    panelBg: "rgba(255,255,255,0.05)", panelBorder: "rgba(255,255,255,0.10)",
    title: "var(--color-white)", body: "rgba(255,255,255,0.9)", muted: "rgba(255,255,255,0.7)",
    accent: "var(--accent-subtleHover)", grid: "rgba(255,255,255,0.20)",
    tileBg: "rgba(255,255,255,0.05)", tileBorder: "rgba(255,255,255,0.10)", tileLabel: "var(--accent-subtleHover)",
    segBg: "rgba(255,255,255,0.05)", segBorder: "rgba(255,255,255,0.10)",
    segOnBg: "var(--accent-subtleHover)", segOnText: "var(--accent-active)", segOffText: "rgba(255,255,255,0.7)",
    statBg: "rgba(255,255,255,0.10)", statText: "var(--color-white)", statLabel: "var(--color-white)", statLabelOpacity: 0.7,
    badgeBg: "rgba(255,255,255,0.10)", badgeBorder: "rgba(255,255,255,0.25)", badgeText: "var(--color-white)",
  },
};

function WLSlider({ label, value, min, max, onChange, v = WL_CALC_VARIANTS.light }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: "var(--text-sm)", color: v.muted }}>{label}</span>
        <span style={{ fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-medium)", color: v.title, fontVariantNumeric: "tabular-nums" }}>{value} lb</span>
      </div>
      {/* aria-label, not a <label> wrapper: the visible text above is a styled
          span in a flex row, so associating it would change the DOM structure. */}
      <input type="range" min={min} max={max} value={value} aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: v.accent, cursor: "pointer" }} />
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

// `theme` is optional: omit it and the card inherits the accent palette from the
// nearest data-theme ancestor (the usual case — the enclosing section sets it).
// Pass one only to pin the card to a palette regardless of where it sits.
// `variant` picks the ground: "light" (white card) or "dark" (glass card).
function WLCalculatorCard({ theme, variant = "light" }) {
  const v = WL_CALC_VARIANTS[variant] || WL_CALC_VARIANTS.light;
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

  // Inner panels: a tint of the card's own ground (light tide on white, or a
  // lift of white on glass). Tinted via variant + accent tokens so it adapts to
  // whatever band it sits on (weight-loss tide, wellness cadmium, …).
  const panel = {
    background: v.panelBg, border: "1px solid " + v.panelBorder,
    borderRadius: "var(--radius-2xl)", padding: "var(--spacing-6)",
  };

  return (
    <div data-theme={theme} style={{
      background: v.cardBg, border: "1px solid " + v.cardBorder,
      boxShadow: v.cardShadow,
      borderRadius: "var(--radius-3xl)", padding: "var(--spacing-8)", height: "100%", boxSizing: "border-box",
      display: "flex", flexDirection: "column", gap: "var(--spacing-6)",
    }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "var(--spacing-2)", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: "var(--text-3xl)", fontWeight: 300, lineHeight: 1.15, color: v.title }}>See it before you start</h3>
        <p style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: 1.5, color: v.body, maxWidth: "30em" }}>Adjust targets and preview a timeline. Your clinician personalizes the final plan.</p>
      </div>

      <div className="wl-calc-grid grid" style={{ gap: "var(--spacing-5)", alignItems: "stretch", flex: 1 }}>
        {/* Controls */}
        <div style={Object.assign({}, panel, { display: "flex", flexDirection: "column", gap: "var(--spacing-5)" })}>
          <WLSlider v={v} label="Starting weight" value={start} min={120} max={350} onChange={(n) => { setStart(n); if (goal > n - 5) setGoal(n - 5); }} />
          <WLSlider v={v} label="Goal weight" value={goal} min={100} max={start - 5} onChange={(n) => setGoal(Math.min(n, start - 5))} />
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
            <span style={{ fontSize: "var(--text-sm)", color: v.muted }}>Pace preference</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, background: v.segBg, border: "1px solid " + v.segBorder, borderRadius: "var(--radius-lg)", padding: 4 }}>
              {paces.map((p) => (
                <button key={p.id} onClick={() => setPace(p.id)} style={{
                  border: "none", cursor: "pointer", borderRadius: "var(--radius-md)",
                  padding: "var(--spacing-2) var(--spacing-1)", textAlign: "center",
                  background: pace === p.id ? v.segOnBg : "transparent",
                  color: pace === p.id ? v.segOnText : v.segOffText,
                  fontFamily: "inherit", transition: "background 0.25s var(--ease-in-out), color 0.25s var(--ease-in-out)",
                }}>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)" }}>{p.label}</div>
                  <div style={{ fontSize: "var(--text-xs)", opacity: 0.75 }}>{p.rate.toFixed(1)} lb/week</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{
            background: v.statBg, borderRadius: "var(--radius-xl)",
            padding: "var(--spacing-4) var(--spacing-5)",
            display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--spacing-4)", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: v.statLabel, opacity: v.statLabelOpacity }}>Estimated timeline</div>
              <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)", color: v.statText, fontVariantNumeric: "tabular-nums" }}>{weeks} wk (~{months} mo)</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: v.statLabel, opacity: v.statLabelOpacity }}>Total change</div>
              <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)", color: v.statText, fontVariantNumeric: "tabular-nums" }}>−{change} lb</div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: "var(--text-xs)", lineHeight: 1.5, color: v.muted }}>Projections are not guarantees. Your clinician determines eligibility, dosing, and timelines based on your individual profile.</p>
        </div>

        {/* Timeline chart */}
        <div style={Object.assign({}, panel, { display: "flex", flexDirection: "column", gap: "var(--spacing-4)" })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: v.muted }}>Estimated timeline</span>
            <span style={{
              fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)", color: v.badgeText,
              border: "1px solid " + v.badgeBorder, borderRadius: "var(--radius-4xl)",
              padding: "2px var(--spacing-3)", background: v.badgeBg,
            }}>{paces.find((p) => p.id === pace).label} Pace</span>
          </div>
          <svg viewBox={"0 0 " + W + " " + H} style={{ width: "100%", height: "auto", flex: 1 }} aria-label={"Projected weight from " + start + " to " + goal + " pounds"}>
            <line x1={padX} y1={padY} x2={W - padX} y2={padY} stroke={v.grid} strokeDasharray="3 4"></line>
            <line x1={padX} y1={H - padY} x2={W - padX} y2={H - padY} stroke={v.grid} strokeDasharray="3 4"></line>
            <text x={padX - 6} y={padY + 4} textAnchor="end" fontSize={fs} fill={v.muted}>{start}</text>
            <text x={padX - 6} y={H - padY + 4} textAnchor="end" fontSize={fs} fill={v.muted}>{goal}</text>
            <path d={path} fill="none" stroke={v.accent} strokeWidth="2.5" strokeLinecap="round" style={{ transition: "d 0.4s var(--ease-in-out)" }}></path>
            <circle cx={pts[0][0]} cy={pts[0][1]} r="5" fill={v.accent}></circle>
            <circle cx={goalX} cy={goalY} r="5" fill={v.accent} style={{ transition: "cx 0.4s var(--ease-in-out)" }}></circle>
            <text x={goalX} y={H - padY + 16} textAnchor="middle" fontSize={fs} fill={v.muted} style={{ transition: "x 0.4s var(--ease-in-out)" }}>Wk {weeks}</text>
            <text x={padX} y={H - padY + 16} textAnchor="middle" fontSize={fs} fill={v.muted}>Wk 0</text>
          </svg>
          <div className="wl-calc-milestones grid" style={{ gap: "var(--spacing-3)" }}>
            {milestones.map((m) => (
              <div key={m.title} style={{
                background: v.tileBg, border: "1px solid " + v.tileBorder,
                borderRadius: "var(--radius-xl)", padding: "var(--spacing-4)",
                display: "flex", flexDirection: "column", gap: "var(--spacing-1)",
              }}>
                <div style={{ fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: v.tileLabel }}>{m.wk}</div>
                <div style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)", color: v.title }}>{m.title}</div>
                <div style={{ fontSize: "var(--text-sm)", lineHeight: 1.4, color: v.muted }}>{m.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WLCalculatorCard, WLSlider, wlDerive, WL_CALC_VARIANTS });
