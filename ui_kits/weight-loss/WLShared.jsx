// Chime Health — Homepage UI kit: Weight Loss section
// Full-bleed band themed with the Weight Loss (tide blue) palette.
// bg_scenario.png at top, gradient glued into solid tide blue; title → model → CTAs → 3 cards.

const WL_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";
const WL_SOLID = "#5E93D1"; // Tide Blue (Accent) — main section ground

// Scroll-reveal wrapper — pure-CSS scroll-driven animation (see `.reveal`);
// `delay` accepted for API compatibility.
function WLReveal({ children, delay, style, className }) {
  const cls = className ? "reveal " + className : "reveal";
  return <div className={cls} style={style}>{children}</div>;
}

function ChimeWeightLossSection() {
  return (
    <section id="weight-loss-section" data-screen-label="Weight Loss" data-theme="weight-loss" style={{
      position: "relative", overflow: "clip",
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
          textShadow: "0 1px 18px rgba(23,36,54,0.45)",
        }}>Lasting weight loss, built around your body</h2>
        </WLReveal>

        <WLReveal delay={120} style={{ width: "100%" }}>
        <div style={{ position: "relative", marginTop: "var(--spacing-6)", display: "flex", justifyContent: "center", width: "100%" }}>
          <img className="wl-model" src={WL_UPLOADS + "/model_weight.png"} alt="Woman carrying a yoga mat"
            style={{ width: "min(480px, 74vw)", height: "auto", display: "block", filter: "drop-shadow(0 24px 48px rgba(23,36,54,0.45))" }} />
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
          <WLProductCarousel />
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

// WLSlider / WLCalculatorCard now live in ui_kits/shared/WLCalculator.jsx
// (shared by the homepage and this Weight Loss landing page). Load that script first.

// Product carousel — cycles treatments in the product card slot.
// theme="light" renders it for light surfaces (Weight Loss page panel); default is the dark homepage card.
function WLProductCarousel({ theme, bare }) {
  const light = theme === "light";
  const Btn = light && window.WLTButton ? window.WLTButton : WLButton;
  const products = [
    { id: "semaglutide", name: "Semaglutide", price: "From $249/mo", src: WL_UPLOADS + "/ozempic-pen-aa505b46.png", rotate: "-15deg" },
    { id: "tirzepatide", name: "Tirzepatide", price: "From $329/mo", src: null, rotate: "-8deg" },
    { id: "oral-semaglutide", name: "Oral Semaglutide", price: "From $199/mo", src: null, rotate: "0deg" },
  ];
  const [idx, setIdx] = React.useState(0);
  const go = (d) => setIdx((i) => (i + d + products.length) % products.length);
  const p = products[idx];

  const arrowStyle = {
    width: 36, height: 36, borderRadius: "50%",
    border: light ? "1px solid var(--border-strong)" : "1px solid rgba(255,255,255,0.25)",
    background: light ? "var(--color-white)" : "rgba(255,255,255,0.12)",
    color: light ? "var(--fg-default)" : "var(--color-white)", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "var(--text-base)", lineHeight: 1, fontFamily: "inherit",
    backdropFilter: "blur(6px)", flex: "none",
    transition: "background 0.25s var(--ease-in-out)",
  };

  return (
    <div style={{
      position: "relative", overflow: "hidden", height: "100%", boxSizing: "border-box",
      background: bare ? "transparent" : "rgba(38,52,34,0.35)",
      border: bare ? "none" : "1px solid rgba(255,255,255,0.08)",
      borderRadius: "var(--radius-3xl)", padding: bare ? 0 : "var(--spacing-8)", minHeight: 420,
      display: "flex", flexDirection: "column", gap: "var(--spacing-4)",
    }}>
      <div style={{ position: "relative", borderRadius: "var(--radius-2xl)", overflow: "hidden", flex: 1, minHeight: 200, background: light ? "var(--color-white)" : "transparent" }}>
        {products.map((prod, i) => (
          <div key={prod.id} style={{
            position: "absolute", inset: 0,
            opacity: i === idx ? 1 : 0,
            transform: i === idx ? "none" : (i < idx ? "translateX(-16px)" : "translateX(16px)"),
            pointerEvents: i === idx ? "auto" : "none",
            transition: "opacity 0.4s var(--ease-in-out), transform 0.4s var(--ease-in-out)",
          }}>
            <image-slot id={"wl-product-" + prod.id} shape="rect" fit="contain" placeholder="Drop product photo"
              src={prod.src || undefined}
              style={{ position: "absolute", inset: "6%", transform: "rotate(" + prod.rotate + ")" }}></image-slot>
          </div>
        ))}
        {/* Arrows */}
        <button aria-label="Previous product" onClick={() => go(-1)}
          style={Object.assign({}, arrowStyle, { position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" })}>‹</button>
        <button aria-label="Next product" onClick={() => go(1)}
          style={Object.assign({}, arrowStyle, { position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" })}>›</button>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: "var(--spacing-2)" }}>
        {products.map((prod, i) => (
          <button key={prod.id} aria-label={"Show " + prod.name} onClick={() => setIdx(i)} style={{
            width: i === idx ? 22 : 8, height: 8, borderRadius: 999, border: "none", cursor: "pointer", padding: 0,
            background: i === idx
              ? (light ? "var(--accent-default)" : "var(--color-tide-200)")
              : (light ? "var(--border-strong)" : "rgba(255,255,255,0.35)"),
            transition: "width 0.3s var(--ease-in-out), background 0.3s var(--ease-in-out)",
          }}></button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)", alignItems: "center", textAlign: "center" }}>
        <h3 style={{ margin: 0, fontSize: "var(--text-2xl)", fontWeight: "var(--font-weight-semibold)", color: light ? "var(--fg-default)" : "var(--color-white)", lineHeight: 1.2 }}>{p.name}</h3>
        <div style={{ fontSize: "var(--text-sm)", display: "flex", alignItems: "baseline", justifyContent: "center", gap: "var(--spacing-2)", flexWrap: "wrap" }}>
          <span style={{ color: light ? "var(--fg-muted)" : "rgba(255,255,255,0.85)", fontWeight: "var(--font-weight-medium)" }}>Weight Loss</span>
          <span aria-hidden="true" style={{ color: light ? "var(--border-strong)" : "rgba(255,255,255,0.35)" }}>·</span>
          <span style={{ fontWeight: "var(--font-weight-semibold)", color: light ? "var(--fg-default)" : "var(--color-white)" }}>{p.price}</span>
        </div>
        <div style={{ display: "flex", gap: "var(--spacing-2)", marginTop: "var(--spacing-2)", justifyContent: "center", flexWrap: "nowrap" }}>
          <Btn primary tiny label="Get started" />
          <Btn tiny label="Learn more" />
        </div>
        <a href="#" style={{
          marginTop: "var(--spacing-1)", fontSize: "var(--text-xs)",
          color: light ? "var(--fg-muted)" : "rgba(255,255,255,0.85)", textDecoration: "underline", textUnderlineOffset: 2,
        }}>Important safety information</a>
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
          ? (hover ? "var(--text-on-primary)" : "#1C3049")
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

Object.assign(window, { ChimeWeightLossSection, WLReveal, WLProductCarousel });
