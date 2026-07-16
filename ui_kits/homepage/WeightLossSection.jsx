// Chime Health — Homepage UI kit: Weight Loss section
// Full-bleed band themed with the Weight Loss (Tide Blue) palette.
// bg_scenario.png at top, gradient glued into solid tide blue; title → model → CTAs → 3 cards.

const WL_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";
const WL_SOLID = "#5E93D1"; // Tide Blue (Accent) — main section ground

// Scroll-reveal wrapper: fades/slides children in as they enter the viewport.
// Now a pure-CSS scroll-driven animation (see `.reveal` in the page <style>) —
// no IntersectionObserver or React state. `delay` is accepted for API
// compatibility; staggering now comes from each element's own scroll position.
function WLReveal({ children, delay, style }) {
  return <div className="reveal" style={style}>{children}</div>;
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

// Shared 2-product Rx carousel (GLP-1 + GLP1/GIP), reused in Weight Loss & Wellness.
function ChimeRxCarousel({ Button, accentColor, uploads }) {
  const PRODUCTS = window.CHIME_RX_PRODUCTS;
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
      position: "relative", overflow: "clip",
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
          background: "var(--glass-surface)",
          border: "1px solid var(--glass-border)",
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
          <div className="w-wl-model max-nav:w-full max-nav:max-w-wl-model" style={{ justifySelf: "center", alignSelf: "end" }}>
            <img src={WL_UPLOADS + "/wieght_loss_md.png"} alt="Video visit with a provider on a phone"
              style={{ width: "100%", height: "auto", display: "block", filter: "drop-shadow(0 20px 40px rgba(17,30,44,0.4))" }} />
          </div>
          <div className="nav:absolute nav:start-10 nav:bottom-8 max-nav:flex max-nav:justify-center">
            <WLButton small wrap label="Discover Your Weight Loss Path" />
          </div>
        </div>
        </WLReveal>

          <WLReveal delay={140}>
          <div style={{
            position: "relative", overflow: "hidden", height: "100%", boxSizing: "border-box",
            background: "var(--glass-surface)", border: "1px solid var(--glass-border)",
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

// WLCalculatorCard / WLSlider / wlDerive now live in ui_kits/shared/WLCalculator.jsx
// (shared by the homepage and the Weight Loss landing page). Load that script first.

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
