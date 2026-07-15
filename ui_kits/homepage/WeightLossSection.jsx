// Chime Health — Homepage UI kit: Weight Loss section
// Full-bleed band themed with the Weight Loss (Tide Blue) palette.
// bg_scenario.png at top, gradient glued into solid tide blue; title → model → CTAs → 3 cards.

const WL_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";
const WL_SOLID = "#5E93D1"; // Tide Blue (Accent) — main section ground

// Scroll-reveal wrapper: fades/slides children in when they enter the viewport.
function WLReveal({ children, delay, style }) {
  const ref = React.useRef(null);
  const reduced = React.useMemo(function () {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const [shown, setShown] = React.useState(reduced);
  React.useEffect(function () {
    if (reduced) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setShown(true); return; }
    const io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return function () { io.disconnect(); };
  }, [reduced]);
  return (
    <div ref={ref} style={Object.assign({
      opacity: shown ? 1 : 0,
      transform: shown ? "none" : "translateY(28px)",
      transition: "opacity 0.8s var(--ease-out, ease-out), transform 0.8s var(--ease-out, ease-out)",
      transitionDelay: (delay || 0) + "ms",
      willChange: "opacity, transform",
    }, style || {})}>{children}</div>
  );
}

function RxArrow({ dir, onClick }) {
  const [h, setH] = React.useState(false);
  return (
    <button type="button" onClick={onClick} aria-label={dir < 0 ? "Previous product" : "Next product"}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        flex: "none", width: 32, height: 32, borderRadius: "var(--radius-4xl)", cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.25)",
        background: h ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.07)",
        color: "var(--color-white)", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "var(--text-lg)", lineHeight: 1, paddingBottom: 3,
        transition: "background var(--transition-base) var(--ease-in-out)",
      }}>{dir < 0 ? "‹" : "›"}</button>
  );
}

// Shared 2-product Rx carousel (Semaglutide + Tirzepatide), reused in Weight Loss & Wellness.
function ChimeRxCarousel({ Button, accentColor, uploads }) {
  const PRODUCTS = [
    { name: "Semaglutide", start: "$249.00", plans: [
      { term: "3 Months", price: "$596.00", promo: true },
      { term: "6 Months", price: "$1,050.00" },
      { term: "1 Year", price: "$1,800.00" },
    ] },
    { name: "Tirzepatide", start: "$359.00", plans: [
      { term: "3 Months", price: "$896.00", promo: true },
      { term: "6 Months", price: "$1,650.00" },
      { term: "1 Year", price: "$2,880.00" },
    ] },
  ];
  const [idx, setIdx] = React.useState(0);
  const [vhover, setVhover] = React.useState(false);
  const p = PRODUCTS[idx];
  const go = (d) => setIdx((idx + d + PRODUCTS.length) % PRODUCTS.length);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--spacing-2)" }}>
        <RxArrow dir={-1} onClick={() => go(-1)} />
        <div style={{ textAlign: "center", minWidth: 0 }}>
          <h3 style={{ margin: 0, fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-white)", lineHeight: 1.2 }}>{p.name}</h3>
          <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
            Starting from <span style={{ color: "var(--color-white)", fontWeight: "var(--font-weight-semibold)" }}>{p.start}/mo</span>
          </div>
        </div>
        <RxArrow dir={1} onClick={() => go(1)} />
      </div>

      <div onMouseEnter={() => setVhover(true)} onMouseLeave={() => setVhover(false)}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 116 }}>
        <img src={uploads + "/vial-solo.png"} alt={p.name + " vial"} style={{
          width: 92, height: "auto", display: "block",
          transform: vhover ? "scale(1.08) rotate(-3deg) translateY(-4px)" : "none",
          filter: vhover ? "drop-shadow(0 22px 34px rgba(0,0,0,0.5))" : "drop-shadow(0 14px 26px rgba(0,0,0,0.38))",
          transition: "transform var(--transition-base) var(--ease-in-out), filter var(--transition-base) var(--ease-in-out)",
        }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
        {p.plans.map((pl) => (
          <div key={pl.term} style={{
            display: "flex", flexDirection: "column", gap: 3,
            background: pl.promo ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.05)",
            border: "1px solid " + (pl.promo ? accentColor : "rgba(255,255,255,0.10)"),
            borderRadius: "var(--radius-lg)", padding: "var(--spacing-2) var(--spacing-3)",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--spacing-2)" }}>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", color: "var(--color-white)" }}>{pl.term}</span>
              <span style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-white)" }}>{pl.price}</span>
            </div>
            {pl.promo ? (
              <span style={{ fontSize: 11, fontWeight: "var(--font-weight-semibold)", color: accentColor }}>{"★ Includes 4th month for free"}</span>
            ) : null}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "auto" }}>
        <Button primary small label="Get started" />
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
        {PRODUCTS.map((_, i) => (
          <button key={i} type="button" aria-label={"Show " + PRODUCTS[i].name} onClick={() => setIdx(i)} style={{
            width: i === idx ? 22 : 7, height: 7, borderRadius: 4, border: "none", padding: 0, cursor: "pointer",
            background: i === idx ? "var(--color-white)" : "rgba(255,255,255,0.35)",
            transition: "all var(--transition-base) var(--ease-in-out)",
          }}></button>
        ))}
      </div>

      <a href="#" style={{ textAlign: "center", fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.85)", textDecoration: "underline", textUnderlineOffset: 2 }}>Important safety information</a>
    </div>
  );
}

function ChimeWeightLossSection() {
  return (
    <section id="weight-loss-section" data-screen-label="Weight Loss" data-theme="weight-loss" style={{
      position: "relative", overflow: "hidden",
      background: WL_SOLID,
      fontFamily: "var(--font-family-base)",
    }}>
      {/* Background scenario image, glued to the solid color with a gradient */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 860, pointerEvents: "none" }}>
        <img src={WL_UPLOADS + "/bg_scenario.png"} alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(94,147,209,0.42) 0%, rgba(94,147,209,0.18) 30%, rgba(94,147,209,0.55) 62%, " + WL_SOLID + " 96%)",
        }}></div>
      </div>

      {/* ---- Top: title, model, CTAs ---- */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "var(--container-xl)", margin: "0 auto",
        padding: "var(--spacing-20) var(--spacing-8) 0",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <WLReveal style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          color: "var(--color-white)", fontSize: "var(--text-sm)",
          fontWeight: "var(--font-weight-semibold)", letterSpacing: "0.12em",
          textTransform: "uppercase", opacity: 0.9, marginBottom: "var(--spacing-3)",
        }}>Weight loss by Chime</div>
        <h2 className="wl-title" style={{
          margin: 0, textAlign: "center", maxWidth: "13em",
          fontSize: "var(--text-5xl)", fontWeight: 300, lineHeight: 1.08,
          color: "var(--color-white)", textWrap: "balance",
          textShadow: "0 1px 18px rgba(17,30,44,0.45)",
        }}>Lasting weight loss, built around your body</h2>
        </WLReveal>

        <WLReveal delay={120} style={{ width: "100%" }}>
        <div style={{ position: "relative", marginTop: "var(--spacing-6)", display: "flex", justifyContent: "center", width: "100%" }}>
          <img className="wl-model" src={WL_UPLOADS + "/model_weight.png"} alt="Woman carrying a yoga mat"
            style={{ width: "min(480px, 74vw)", height: "auto", display: "block", filter: "drop-shadow(0 24px 48px rgba(17,30,44,0.45))" }} />
          {/* CTAs overlapping the bottom of the model */}
          <div style={{
            position: "absolute", bottom: "var(--spacing-8)", left: 0, right: 0,
            display: "flex", justifyContent: "center", gap: "var(--spacing-3)", flexWrap: "wrap",
          }}>
            <WLButton primary large label="Start my visit" />
            <WLButton large label="Learn more" />
          </div>
        </div>
        </WLReveal>
      </div>

      {/* ---- Cards ---- */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "var(--container-xl)", margin: "0 auto",
        padding: "0 var(--spacing-8) var(--spacing-20)",
        display: "flex", flexDirection: "column", gap: "var(--spacing-5)",
      }}>
        {/* Row 1 — wide card + product card */}
        <div className="wl-card-pair" style={{ display: "grid", gridTemplateColumns: "1fr calc((100% - 3 * 16px) / 4)", gap: "var(--spacing-5)" }}>
        <WLReveal>
        <div className="wl-card-wide" style={{
          position: "relative",
          height: "100%", boxSizing: "border-box",
          background: "rgba(24,42,63,0.35)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "var(--radius-3xl)",
          display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center",
          gap: "var(--spacing-8)", padding: "var(--spacing-10) var(--spacing-10) 0",
          minHeight: 520,
          overflow: "hidden",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)", alignItems: "flex-start", textAlign: "left", paddingBottom: "var(--spacing-10)" }}>
            <h3 style={{ margin: 0, fontSize: "var(--text-3xl)", fontWeight: 300, lineHeight: 1.15, color: "var(--color-white)", maxWidth: "12em" }}>Because No Two Bodies Are The Same</h3>
            <p style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: 1.5, color: "rgba(255,255,255,0.9)", maxWidth: "26em" }}>Your goals, lifestyle, and health history all play a role in determining the right path forward.</p>
          </div>
          <div className="w-[420px] max-[960px]:w-full max-[960px]:max-w-[420px]" style={{ justifySelf: "center", alignSelf: "end" }}>
            <img src={WL_UPLOADS + "/wieght_loss_md.png"} alt="Video visit with a provider on a phone"
              style={{ width: "100%", height: "auto", display: "block", filter: "drop-shadow(0 20px 40px rgba(17,30,44,0.4))" }} />
          </div>
          <div className="min-[961px]:absolute min-[961px]:left-10 min-[961px]:bottom-8 max-[960px]:flex max-[960px]:justify-center">
            <WLButton small wrap label="Discover Your Weight Loss Path" />
          </div>
        </div>
        </WLReveal>

          <WLReveal delay={140}>
          <div style={{
            position: "relative", overflow: "hidden", height: "100%", boxSizing: "border-box",
            background: "rgba(24,42,63,0.35)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "var(--radius-3xl)", padding: "var(--spacing-5)", minHeight: 420,
            display: "flex", flexDirection: "column", gap: "var(--spacing-4)",
          }}>
            <ChimeRxCarousel Button={WLButton} accentColor="#C3D7EE" uploads={WL_UPLOADS} />
          </div>
          </WLReveal>
        </div>

        {/* Row 2 — calculator full width */}
        <WLReveal>
        <WLCalculatorCard />
        </WLReveal>

        <WLReveal delay={100}>
        <p style={{
          margin: "var(--spacing-2) auto 0", maxWidth: "52em", textAlign: "center",
          fontSize: "var(--text-xs)", lineHeight: 1.6, color: "rgba(255,255,255,0.8)",
        }}>Not available in all 50 states. Eligibility determination and prescription required for all treatments. Individual results vary. Weight loss estimates reflect an average and are not a guarantee. <a href="#" style={{ color: "var(--color-tide-200)" }}>Read more</a></p>
        </WLReveal>
      </div>
    </section>
  );
}

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
  const paces = [
    { id: "steady", label: "Steady", rate: 1.0 },
    { id: "standard", label: "Standard", rate: 1.4 },
    { id: "ambitious", label: "Ambitious", rate: 1.8 },
  ];
  const d = wlDerive(start, goal, pace);
  const change = d.totalChange;
  const weeks = d.weeks;
  const months = d.months.toFixed(1);

  // Project the derived samples into the existing SVG coordinate space.
  const W = 560, H = 190, padX = 34, padY = 22;
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
            <text x={padX - 6} y={padY + 4} textAnchor="end" fontSize="11" fill="rgba(255,255,255,0.8)">{start}</text>
            <text x={padX - 6} y={H - padY + 4} textAnchor="end" fontSize="11" fill="rgba(255,255,255,0.8)">{goal}</text>
            <path d={path} fill="none" stroke="var(--color-tide-300)" strokeWidth="2.5" strokeLinecap="round" style={{ transition: "d 0.4s var(--ease-in-out)" }}></path>
            <circle cx={pts[0][0]} cy={pts[0][1]} r="5" fill="var(--color-tide-300)"></circle>
            <circle cx={goalX} cy={goalY} r="5" fill="var(--color-tide-300)" style={{ transition: "cx 0.4s var(--ease-in-out)" }}></circle>
            <text x={goalX} y={H - padY + 16} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.85)" style={{ transition: "x 0.4s var(--ease-in-out)" }}>Wk {weeks}</text>
            <text x={padX} y={H - padY + 16} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.8)">Wk 0</text>
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

function WLButton({ label, primary, small, tiny, large, wrap }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#"
      onClick={(e) => { e.preventDefault(); window.openChimeAssessment && window.openChimeAssessment(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-block", position: "relative", overflow: "hidden",
        background: primary ? "var(--color-white)" : "rgba(255,255,255,0.18)",
        color: primary
          ? (hover ? "var(--text-on-primary)" : "#12263B")
          : "var(--color-white)",
        backdropFilter: primary ? "none" : "blur(8px)",
        border: primary ? "1px solid transparent" : "1px solid rgba(255,255,255,0.25)",
        borderRadius: "var(--radius-4xl)",
        padding: tiny ? "var(--spacing-1) var(--spacing-3)" : (small ? "var(--spacing-2) var(--spacing-5)" : (large ? "var(--spacing-4) var(--spacing-10)" : "var(--spacing-3) var(--spacing-7)")),
        fontSize: tiny ? "var(--text-sm)" : (large ? "var(--text-lg)" : "var(--text-base)"), fontWeight: "var(--font-weight-semibold)",
        textDecoration: "none", whiteSpace: wrap ? "normal" : "nowrap", textAlign: "center",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: hover ? "translateY(-3px) scale(1.04)" : "none",
        transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out), color 0.35s var(--ease-in-out)",
      }}>
      <span style={{
        position: "absolute", inset: 0,
        background: "var(--accent-default)",
        transform: hover ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left center",
        transition: "transform 0.35s var(--ease-in-out)",
      }}></span>
      <span style={{ position: "relative" }}>{label}</span>
    </a>
  );
}

Object.assign(window, { ChimeWeightLossSection });
