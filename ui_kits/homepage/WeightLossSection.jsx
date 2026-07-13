// Chime Health — Homepage UI kit: Weight Loss section
// Full-bleed band themed with the Weight Loss (sage) palette.
// bg_scenario.png at top, gradient glued into solid sage; title → model → CTAs → 3 cards.

const WL_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";
const WL_SOLID = "#7A9472"; // Muted Sage Green (Accent) — main section ground

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

function ChimeWeightLossSection() {
  return (
    <section id="weight-loss-section" data-screen-label="Weight Loss" data-theme="weight-loss" style={{
      position: "relative", overflow: "hidden",
      background: WL_SOLID,
      fontFamily: "var(--font-family-base)",
      marginTop: "var(--spacing-12)",
    }}>
      {/* Background scenario image, glued to the solid color with a gradient */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 860, pointerEvents: "none" }}>
        <img src={WL_UPLOADS + "/bg_scenario.png"} alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(122,148,114,0.42) 0%, rgba(122,148,114,0.18) 30%, rgba(122,148,114,0.55) 62%, " + WL_SOLID + " 96%)",
        }}></div>
      </div>

      {/* ---- Top: title, model, CTAs ---- */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "var(--container-xl)", margin: "0 auto",
        padding: "var(--spacing-12) var(--spacing-8) 0",
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
          textShadow: "0 1px 18px rgba(24,38,31,0.45)",
        }}>Lasting weight loss, built around your body</h2>
        </WLReveal>

        <WLReveal delay={120} style={{ width: "100%" }}>
        <div style={{ position: "relative", marginTop: "var(--spacing-6)", display: "flex", justifyContent: "center", width: "100%" }}>
          <img className="wl-model" src={WL_UPLOADS + "/model_weight.png"} alt="Woman carrying a yoga mat"
            style={{ width: "min(480px, 74vw)", height: "auto", display: "block", filter: "drop-shadow(0 24px 48px rgba(24,38,31,0.45))" }} />
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
        padding: "0 var(--spacing-8) var(--spacing-10)",
        display: "flex", flexDirection: "column", gap: "var(--spacing-5)",
      }}>
        {/* Row 1 — wide card + product card */}
        <div className="wl-card-pair" style={{ display: "grid", gridTemplateColumns: "1fr calc((100% - 3 * 16px) / 4)", gap: "var(--spacing-5)" }}>
        <WLReveal>
        <div className="wl-card-wide" style={{
          position: "relative",
          height: "100%", boxSizing: "border-box",
          background: "rgba(38,52,34,0.35)",
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
          <div style={{ width: 420, justifySelf: "center", alignSelf: "end" }}>
            <img src={WL_UPLOADS + "/wieght_loss_md.png"} alt="Video visit with a provider on a phone"
              style={{ width: "100%", height: "auto", display: "block", filter: "drop-shadow(0 20px 40px rgba(24,38,31,0.4))" }} />
          </div>
          <div style={{ position: "absolute", left: "var(--spacing-10)", bottom: "var(--spacing-8)" }}>
            <WLButton small label="Discover Your Weight Loss Path" />
          </div>
        </div>
        </WLReveal>

          <WLReveal delay={140}>
          <div style={{
            position: "relative", overflow: "hidden", height: "100%", boxSizing: "border-box",
            background: "rgba(38,52,34,0.35)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "var(--radius-3xl)", padding: "var(--spacing-8)", minHeight: 420,
            display: "flex", flexDirection: "column", gap: "var(--spacing-4)",
          }}>
            <div style={{
              position: "relative", borderRadius: "var(--radius-2xl)", overflow: "hidden",
              flex: 1, minHeight: 200,
            }}>
              <image-slot id="wl-product-semaglutide" shape="rect" fit="contain" placeholder="Drop product photo"
                src={WL_UPLOADS + "/ozempic-pen-aa505b46.png"}
                style={{ position: "absolute", inset: "6%", transform: "rotate(-15deg)" }}></image-slot>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)", alignItems: "center", textAlign: "center" }}>
              <h3 style={{ margin: 0, fontSize: "var(--text-2xl)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-white)", lineHeight: 1.2 }}>Semaglutide</h3>
              <div style={{ fontSize: "var(--text-sm)", display: "flex", alignItems: "baseline", justifyContent: "center", gap: "var(--spacing-2)", flexWrap: "wrap" }}>
                <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: "var(--font-weight-medium)" }}>Weight Loss</span>
                <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.35)" }}>·</span>
                <span style={{ fontWeight: "var(--font-weight-semibold)", color: "var(--color-white)" }}>From $249/mo</span>
              </div>
              <div style={{ display: "flex", gap: "var(--spacing-2)", marginTop: "var(--spacing-2)", justifyContent: "center", flexWrap: "nowrap" }}>
                <WLButton primary tiny label="Get started" />
                <WLButton tiny label="Learn more" />
              </div>
              <a href="#" style={{
                marginTop: "var(--spacing-1)", fontSize: "var(--text-xs)",
                color: "rgba(255,255,255,0.85)", textDecoration: "underline", textUnderlineOffset: 2,
              }}>Important safety information</a>
            </div>
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
        }}>Not available in all 50 states. Eligibility determination and prescription required for all treatments. Individual results vary. Weight loss estimates reflect an average and are not a guarantee. <a href="#" style={{ color: "var(--color-sage-200)" }}>Read more</a></p>
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
        style={{ width: "100%", accentColor: "var(--color-sage-300)", cursor: "pointer" }} />
    </div>
  );
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
  const rate = paces.find((p) => p.id === pace).rate;
  const change = Math.max(0, start - goal);
  const weeks = change > 0 ? Math.ceil(change / rate) : 0;
  const months = (weeks / 4.345).toFixed(1);

  // Curve scales with pace: x-axis is fixed at the slowest (Steady) timeline, so a
  // faster pace reaches goal sooner — the line ends earlier and stays flat after.
  const W = 560, H = 190, padX = 34, padY = 22;
  const slowestWeeks = change > 0 ? Math.ceil(change / paces[0].rate) : 0;
  const frac = slowestWeeks > 0 ? weeks / slowestWeeks : 1; // 1 for Steady, smaller when faster
  const pts = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    pts.push([padX + t * frac * (W - 2 * padX), padY + ease * (H - 2 * padY)]);
  }
  const goalX = pts[24][0];
  let path = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  if (frac < 0.999) path += " L" + (W - padX).toFixed(1) + " " + (H - padY).toFixed(1); // maintenance tail
  const milestones = [
    { wk: "Week 4", title: "First check-in", body: "Review progress & adjust plan" },
    { wk: "Week " + Math.max(8, Math.round(weeks / 2)), title: "Building momentum", body: "Dose optimization phase" },
    { wk: "Week " + Math.max(12, weeks), title: "Sustain & thrive", body: "Long-term strategy set" },
  ];

  const panel = {
    background: "rgba(24,38,31,0.55)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "var(--radius-2xl)", padding: "var(--spacing-6)",
  };

  return (
    <div style={{
      background: "rgba(38,52,34,0.35)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "var(--radius-3xl)", padding: "var(--spacing-8)", height: "100%", boxSizing: "border-box",
      display: "flex", flexDirection: "column", gap: "var(--spacing-6)",
    }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "var(--spacing-2)", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: "var(--text-3xl)", fontWeight: 300, lineHeight: 1.15, color: "var(--color-white)" }}>See it before you start</h3>
        <p style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: 1.5, color: "rgba(255,255,255,0.9)", maxWidth: "30em" }}>Adjust targets and preview a timeline. Your clinician personalizes the final plan.</p>
      </div>

      <div className="wl-calc-grid" style={{ display: "grid", gridTemplateColumns: "minmax(260px, 340px) 1fr", gap: "var(--spacing-5)", alignItems: "stretch", flex: 1 }}>
        {/* Controls */}
        <div style={Object.assign({}, panel, { display: "flex", flexDirection: "column", gap: "var(--spacing-5)" })}>
          <WLSlider label="Starting weight" value={start} min={120} max={350} onChange={(v) => { setStart(v); if (goal > v - 5) setGoal(v - 5); }} />
          <WLSlider label="Goal weight" value={goal} min={100} max={start - 5} onChange={setGoal} />
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
            <span style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.85)" }}>Pace preference</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, background: "rgba(38,52,34,0.30)", borderRadius: "var(--radius-lg)", padding: 4 }}>
              {paces.map((p) => (
                <button key={p.id} onClick={() => setPace(p.id)} style={{
                  border: "none", cursor: "pointer", borderRadius: "var(--radius-md)",
                  padding: "var(--spacing-2) var(--spacing-1)", textAlign: "center",
                  background: pace === p.id ? "var(--color-sage-300)" : "transparent",
                  color: pace === p.id ? "#26341F" : "rgba(255,255,255,0.85)",
                  fontFamily: "inherit", transition: "background 0.25s var(--ease-in-out), color 0.25s var(--ease-in-out)",
                }}>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)" }}>{p.label}</div>
                  <div style={{ fontSize: "var(--text-xs)", opacity: 0.75 }}>{p.rate.toFixed(1)} lb/week</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{
            background: "var(--color-sage-300)", borderRadius: "var(--radius-xl)",
            padding: "var(--spacing-4) var(--spacing-5)",
            display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--spacing-4)", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: "#26341F", opacity: 0.7 }}>Estimated timeline</div>
              <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)", color: "#26341F", fontVariantNumeric: "tabular-nums" }}>{weeks} wk (~{months} mo)</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: "#26341F", opacity: 0.7 }}>Total change</div>
              <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)", color: "#26341F", fontVariantNumeric: "tabular-nums" }}>−{change} lb</div>
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
            <path d={path} fill="none" stroke="var(--color-sage-300)" strokeWidth="2.5" strokeLinecap="round" style={{ transition: "d 0.4s var(--ease-in-out)" }}></path>
            <circle cx={pts[0][0]} cy={pts[0][1]} r="5" fill="var(--color-sage-300)"></circle>
            <circle cx={goalX} cy={pts[24][1]} r="5" fill="var(--color-sage-300)" style={{ transition: "cx 0.4s var(--ease-in-out)" }}></circle>
            <text x={goalX} y={H - padY + 16} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.85)" style={{ transition: "x 0.4s var(--ease-in-out)" }}>Wk {weeks}</text>
            <text x={padX} y={H - padY + 16} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.8)">Wk 0</text>
          </svg>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--spacing-3)" }}>
            {milestones.map((m) => (
              <div key={m.title} style={{
                background: "rgba(38,52,34,0.30)", border: "1px solid rgba(255,255,255,0.08)",
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

function WLButton({ label, primary, small, tiny, large }) {
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
          ? (hover ? "var(--text-on-primary)" : "#26341F")
          : "var(--color-white)",
        backdropFilter: primary ? "none" : "blur(8px)",
        border: primary ? "1px solid transparent" : "1px solid rgba(255,255,255,0.25)",
        borderRadius: "var(--radius-4xl)",
        padding: tiny ? "var(--spacing-1) var(--spacing-3)" : (small ? "var(--spacing-2) var(--spacing-5)" : (large ? "var(--spacing-4) var(--spacing-10)" : "var(--spacing-3) var(--spacing-7)")),
        fontSize: tiny ? "var(--text-sm)" : (large ? "var(--text-lg)" : "var(--text-base)"), fontWeight: "var(--font-weight-semibold)",
        textDecoration: "none", whiteSpace: "nowrap",
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
