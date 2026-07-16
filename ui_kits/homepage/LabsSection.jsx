// Chime Health — Homepage UI kit: Labs section
// Full-bleed band themed with the Lab (iris) palette.
// Mirrors WeightLossSection structure: bg scenario at top glued into solid iris;
// title → hero visual → CTAs → 3 cards. Assets are image-slot placeholders
// until the Labs uploads arrive.

const LABS_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";
const LABS_SOLID = "#A59FD6"; // Iris Signal (Accent) — main section ground
const LABS_INK = "#2A283A"; // dark neutral ink for text on light surfaces

// Scroll-reveal wrapper — pure-CSS scroll-driven animation (see `.reveal`);
// `delay` accepted for API compatibility.
function LabsReveal({ children, delay, style }) {
  return <div className="reveal" style={style}>{children}</div>;
}

function ChimeLabsSection() {
  return (
    <section id="labs-section" data-screen-label="Labs" data-theme="lab" style={{
      position: "relative", overflow: "clip",
      background: LABS_SOLID,
      fontFamily: "var(--font-family-base)",
    }}>
      {/* Background video treatment, glued to the solid color with a gradient */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 860, pointerEvents: "none" }}>
        <video src={LABS_UPLOADS + "/weight_loss_bg.mp4"} autoPlay muted loop playsInline
          ref={function (el) { if (el) { el.muted = true; el.defaultMuted = true; el.volume = 0; } }}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}></video>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(165,159,214,0.42) 0%, rgba(165,159,214,0.12) 26%, rgba(165,159,214,0.12) 55%, rgba(165,159,214,0.6) 78%, " + LABS_SOLID + " 96%)",
        }}></div>
      </div>

      {/* ---- Top: title over the video, subtitle + CTAs at the bottom of the products ---- */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "var(--container-xl)", margin: "0 auto",
        padding: "var(--spacing-20) var(--spacing-8) 0",
        minHeight: 700,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
      }}>
        <LabsReveal style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 className="labs-title" style={{
          margin: 0, textAlign: "center", maxWidth: "15em",
          fontSize: "var(--text-5xl)", fontWeight: 300, lineHeight: 1.12,
          color: "var(--color-white)", textWrap: "balance",
          textShadow: "0 1px 18px rgb(var(--glass-rgb) / 0.45)",
        }}>Your Body Has Been Trying<br></br><span style={{ color: "var(--color-white)" }}>To Tell You Something</span></h2>
        </LabsReveal>

        {/* Subtitle + CTAs at the bottom of the products shown in the video */}
        <LabsReveal delay={120} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-5)", paddingBottom: "var(--spacing-10)" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <LabsButton hero label="Discover Your Health Path" />
        </div>
        </LabsReveal>
      </div>

      {/* ---- Cards ---- */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "var(--container-xl)", margin: "0 auto",
        padding: "0 var(--spacing-8) var(--spacing-20)",
        display: "flex", flexDirection: "column", gap: "var(--spacing-5)",
      }}>
        {/* Card 1 — signals explorer: rail | detail panel */}
        <LabsReveal>
        <div style={{
          position: "relative",
          background: "rgb(var(--glass-rgb) / 0.45)",
          border: "1px solid var(--glass-border)",
          borderRadius: "var(--radius-3xl)",
          padding: "var(--spacing-10)",
          display: "flex", flexDirection: "column", gap: "var(--spacing-8)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-3)" }}>
            <h3 style={{
              margin: 0, textAlign: "center", maxWidth: "18em",
              fontSize: "var(--text-4xl)", fontWeight: 300, lineHeight: 1.12,
              color: "var(--color-white)", textWrap: "balance",
            }}>Discover Some Of The Signals Your Body May Be Sending</h3>
            <p style={{
              margin: 0, textAlign: "center", maxWidth: "38em",
              fontSize: "var(--text-base)", lineHeight: 1.55,
              color: "rgba(255,255,255,0.85)", textWrap: "pretty",
            }}>Health insights help uncover biomarkers that may support conversations around wellness, energy, recovery, metabolism, healthy aging, and overall health.</p>
          </div>
          <LabsSignals />
        </div>
        </LabsReveal>

        {/* Health Insights tiers */}
        <LabsReveal>
        <div className="labs-tiers" style={{
          background: "rgb(var(--glass-rgb) / 0.45)",
          border: "1px solid var(--glass-border)",
          borderRadius: "var(--radius-3xl)",
          padding: "var(--spacing-12) var(--spacing-10)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-8)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-3)" }}>
            <h3 style={{
              margin: 0, textAlign: "center", maxWidth: "18em",
              fontSize: "var(--text-4xl)", fontWeight: 300, lineHeight: 1.12,
              color: "var(--color-white)", textWrap: "balance",
            }}>Discover A Deeper Understanding Of Your Health</h3>
            <p style={{
              margin: 0, textAlign: "center", maxWidth: "42em",
              fontSize: "var(--text-base)", lineHeight: 1.55,
              color: "rgba(255,255,255,0.85)", textWrap: "pretty",
            }}>Whether you are beginning your wellness journey or seeking the most comprehensive picture possible, Chime offers multiple levels of health insights designed to help guide your path.</p>
          </div>
          <div className="labs-tier-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--spacing-6)", width: "100%" }}>
            <LabsTierCard name="Essential Health Insights" markers="80+" />
            <LabsTierCard name="Complete Health Insights" markers="100+" upgraded />
            <LabsTierCard name="Executive Health Insights" markers="130+" upgraded />
          </div>
          <p style={{
            margin: 0, textAlign: "center",
            fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)",
            color: "rgba(255,255,255,0.8)",
          }}>Hundreds Of Data Points. One Personalized Path.</p>
        </div>
        </LabsReveal>

        <LabsReveal delay={100}>
        <p style={{
          margin: "var(--spacing-2) auto 0", maxWidth: "52em", textAlign: "center",
          fontSize: "var(--text-xs)", lineHeight: 1.6, color: "rgba(255,255,255,0.8)",
        }}>Not available in all 50 states. Lab tests are ordered and reviewed by licensed providers. Results are informational and not a diagnosis. <a href="#" style={{ color: "var(--color-white)" }}>Read more</a></p>
        </LabsReveal>
      </div>
    </section>
  );
}

const LABS_SIGNALS = [
  { tag: "Hormones", title: "Hormonal Health & Vitality",
    body: "Hormones influence far more than body composition. They may also play a role in energy, recovery, motivation, and overall vitality.",
    markers: "Testosterone · Free Testosterone · Estradiol" },
  { tag: "Metabolism", title: "Metabolism & Weight Management",
    body: "Metabolic markers may reflect how your body processes energy, manages blood sugar, and stores fuel over time.",
    markers: "HbA1c · Fasting Insulin · Glucose" },
  { tag: "Energy", title: "Energy & Recovery",
    body: "Day-to-day energy and recovery can connect to nutrient status, iron levels, and how your body handles stress.",
    markers: "Ferritin · Vitamin D · Cortisol" },
  { tag: "Heart Health", title: "Advanced Heart Health Insights",
    body: "A closer look at cardiovascular markers that go beyond a standard cholesterol test.",
    markers: "ApoB · Lp(a) · hs-CRP" },
  { tag: "Healthy Aging", title: "Healthy Aging",
    body: "Markers associated with long-term wellness that may support conversations around healthy aging.",
    markers: "HbA1c · hs-CRP · DHEA-S" },
  { tag: "And More", title: "And Much More…",
    body: "Thyroid, liver, kidney, nutrients, and beyond — a fuller picture across your body's systems.",
    markers: "TSH · ALT · eGFR" },
];

function LabsSignals() {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [fade, setFade] = React.useState(true);
  const reduced = React.useMemo(function () {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const go = React.useCallback(function (i) {
    setFade(false);
    setTimeout(function () { setActive(i); setFade(true); }, 450);
  }, []);
  React.useEffect(function () {
    if (reduced || paused) return;
    const t = setInterval(function () {
      setFade(false);
      setTimeout(function () {
        setActive(function (a) { return (a + 1) % LABS_SIGNALS.length; });
        setFade(true);
      }, 450);
    }, 5000);
    return function () { clearInterval(t); };
  }, [reduced, paused]);
  const item = LABS_SIGNALS[active];
  const num = function (i) { return (i + 1 < 10 ? "0" : "") + (i + 1); };
  return (
    <div className="labs-signals-grid"
      onMouseEnter={function () { setPaused(true); }}
      onMouseLeave={function () { setPaused(false); }}
      style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "var(--spacing-6)", alignItems: "stretch" }}>
      {/* Rail */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
        {LABS_SIGNALS.map(function (s, i) {
          const isActive = i === active;
          return (
            <button key={s.tag} onClick={function () { go(i); }} style={{
              textAlign: "left", cursor: "pointer", font: "inherit",
              background: isActive ? "var(--color-iris-200)" : "rgba(255,255,255,0.05)",
              color: isActive ? LABS_INK : "var(--color-white)",
              border: isActive ? "1px solid var(--color-iris-300)" : "1px solid rgba(255,255,255,0.12)",
              borderRadius: "var(--radius-xl)", padding: "var(--spacing-3) var(--spacing-4)",
              display: "flex", flexDirection: "column", gap: "var(--spacing-1)",
              transition: "background var(--transition-base) var(--ease-in-out), color var(--transition-base) var(--ease-in-out), border-color var(--transition-base) var(--ease-in-out)",
            }}>
              <span style={{
                fontSize: "var(--text-xs)", letterSpacing: "0.08em",
                color: isActive ? "rgb(var(--glass-rgb) / 0.7)" : "rgba(255,255,255,0.7)",
              }}>{num(i)} — {s.tag}</span>
              <span style={{ fontSize: "var(--text-base)", lineHeight: 1.3 }}>{s.title}</span>
            </button>
          );
        })}
      </div>
      {/* Detail panel */}
      <div style={{
        background: "rgb(var(--glass-rgb) / 0.55)", border: "1px solid var(--glass-border)",
        borderRadius: "var(--radius-2xl)", padding: "var(--spacing-8)", minHeight: 420,
        display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "var(--spacing-8)",
        opacity: fade ? 1 : 0, transform: fade ? "none" : "translateY(10px)",
        transition: "opacity 0.9s var(--ease-out, ease-out), transform 0.9s var(--ease-out, ease-out)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{
            background: "var(--color-white)", color: LABS_INK,
            borderRadius: "var(--radius-4xl)", padding: "var(--spacing-1) var(--spacing-4)",
            fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)",
          }}>{item.tag}</span>
          <span style={{ fontSize: "var(--text-lg)", color: "rgba(255,255,255,0.7)" }}>{num(active)}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
          <div style={{ fontSize: "var(--text-xs)", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>Did you know?</div>
          <h4 style={{ margin: 0, fontSize: "var(--text-3xl)", fontWeight: 300, lineHeight: 1.15, color: "var(--color-white)" }}>{item.title}</h4>
          <p style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: 1.55, color: "rgba(255,255,255,0.85)", maxWidth: "34em" }}>{item.body}</p>
          <p style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: 1.55, color: "rgba(255,255,255,0.75)" }}>Featured biomarkers: {item.markers}.</p>
        </div>
      </div>
    </div>
  );
}

function LabsTierCard({ name, markers, upgraded }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
      position: "relative", background: "rgb(var(--glass-rgb) / 0.45)",
      border: "1px solid " + (hover ? "rgba(255,255,255,0.22)" : "var(--glass-border)"), borderRadius: "var(--radius-2xl)",
      padding: "var(--spacing-6)",
      display: "flex", flexDirection: "column", gap: "var(--spacing-5)",
      transform: hover ? "translateY(-4px)" : "none",
      boxShadow: hover ? "0 22px 44px rgb(var(--glass-rgb) / 0.5)" : "none",
      transition: "transform var(--transition-base) var(--ease-in-out), box-shadow var(--transition-base) var(--ease-in-out), border-color var(--transition-base) var(--ease-in-out)",
    }}>
      {/* Biomarkers badge */}
      <div style={{
        position: "absolute", top: "var(--spacing-4)", right: "var(--spacing-4)",
        background: "rgb(var(--glass-rgb) / 0.55)", border: "1px solid var(--glass-border)",
        color: "var(--color-white)",
        borderRadius: "var(--radius-lg)", padding: "var(--spacing-2) var(--spacing-3)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-1)",
      }}>
        <div style={{ fontSize: "var(--text-2xl)", fontWeight: 300, lineHeight: 1 }}>{markers}</div>
        <div style={{ fontSize: "var(--text-xs)", opacity: 0.85 }}>Biomarkers</div>
        {upgraded ? (
          <div style={{
            background: "var(--color-iris-700)", color: "var(--color-white)",
            borderRadius: "var(--radius-4xl)", padding: "2px 10px", fontSize: 11,
          }}>Upgraded Panel</div>
        ) : null}
      </div>
      <img src={LABS_UPLOADS + "/vial-solo.png"} alt={name + " sample vial"}
        style={{
          width: 120, height: "auto", display: "block", margin: "var(--spacing-4) auto 0",
          transform: hover ? "scale(1.12) rotate(-3deg) translateY(-6px)" : "none",
          filter: hover ? "drop-shadow(0 24px 42px rgb(var(--glass-rgb) / 0.6))" : "drop-shadow(0 16px 32px rgb(var(--glass-rgb) / 0.4))",
          transition: "transform var(--transition-base) var(--ease-in-out), filter var(--transition-base) var(--ease-in-out)",
        }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
        <h4 style={{ margin: 0, fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-medium)", color: "var(--color-white)", lineHeight: 1.25 }}>{name}</h4>
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--spacing-2)" }}>
          <span style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.8)" }}>From</span>
          <span style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-white)" }}>$—</span>
        </div>
      </div>
    </div>
  );
}

function LabsButton({ label, primary, small, tiny, large, hero }) {
  const [hover, setHover] = React.useState(false);
  if (hero) {
    // Fixed spec: 52px-tall pill, content-hugging — no stretch.
    return (
      <a href="#"
        onClick={(e) => { e.preventDefault(); window.openChimeAssessment && window.openChimeAssessment(); }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: "fit-content", height: 52, padding: "0 28px", boxSizing: "border-box",
          background: "var(--color-white)", color: LABS_INK,
          borderRadius: 26, border: "1px solid transparent",
          fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)",
          lineHeight: 1, textDecoration: "none", whiteSpace: "nowrap",
          boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
          transform: hover ? "translateY(-3px) scale(1.04)" : "none",
          transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out)",
        }}>{label}</a>
    );
  }
  return (
    <a href="#"
      onClick={(e) => { e.preventDefault(); window.openChimeAssessment && window.openChimeAssessment(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-block", position: "relative", overflow: "hidden",
        background: primary ? "var(--color-white)" : "rgba(255,255,255,0.18)",
        color: primary
          ? (hover ? "var(--text-on-primary)" : LABS_INK)
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

Object.assign(window, { ChimeLabsSection });
