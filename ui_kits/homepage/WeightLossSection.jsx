// Chime Health — Homepage UI kit: Weight Loss section
// Full-bleed band themed with the Weight Loss (Tide Blue) palette.
// bg_scenario.webp at top, gradient glued into solid tide blue; title → model → CTAs → 3 cards.

const WL_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";
const WL_SOLID = "#5E93D1"; // Tide Blue (Accent) — main section ground

// Scroll-reveal wrapper: fades/slides children in as they enter the viewport.
// Now a pure-CSS scroll-driven animation (see `.reveal` in the page <style>) —
// no IntersectionObserver or React state. `delay` is accepted for API
// compatibility; staggering now comes from each element's own scroll position.
function WLReveal(props) {
  return <Reveal {...props} />;
}

// Shared 2-product Rx carousel (GLP-1 + GLP1/GIP), reused in Weight Loss & Wellness.
function ChimeWeightLossSection() {
  return (
    <section id="weight-loss-section" data-screen-label="Weight Loss" data-theme="weight-loss" style={{
      position: "relative", overflow: "clip",
      background: WL_SOLID,
      fontFamily: "var(--font-family-base)",
    }}>
      {/* Background scenario image, glued to the solid color with a gradient */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 860, pointerEvents: "none" }}>
        <img src={WL_UPLOADS + "/bg_scenario.webp"} alt=""
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
        <Eyebrow tone="onDark" opacity={0.9} marginBottom="var(--spacing-3)" label="Weight loss by Chime" />
        <h2 className="wl-title" style={{
          margin: 0, textAlign: "center", maxWidth: "13em",
          fontSize: "var(--text-5xl)", fontWeight: 300, lineHeight: 1.08,
          color: "var(--color-white)", textWrap: "balance",
          textShadow: "0 1px 18px rgba(17,30,44,0.45)",
        }}>Lasting weight loss, built around your body</h2>
        </WLReveal>

        <WLReveal delay={120} style={{ width: "100%" }}>
        <div style={{ position: "relative", marginTop: "var(--spacing-6)", display: "flex", justifyContent: "center", width: "100%" }}>
          <img className="wl-model" src={WL_UPLOADS + "/model_weight.webp"} alt="Woman carrying a yoga mat"
            style={{ width: "min(480px, 74vw)", height: "auto", display: "block", filter: "drop-shadow(0 24px 48px rgba(17,30,44,0.45))" }} />
          {/* CTAs overlapping the bottom of the model */}
          <div style={{
            position: "absolute", bottom: "var(--spacing-8)", left: 0, right: 0,
            display: "flex", justifyContent: "center", gap: "var(--spacing-3)", flexWrap: "wrap",
          }}>
            <WLButton primary large label="Start my visit" />
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
            <img src={WL_UPLOADS + "/wieght_loss_md.webp"} alt="Video visit with a provider on a phone"
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
            <RxCarousel variant="dark" Button={WLButton} uploads={WL_UPLOADS} />
          </div>
          </WLReveal>
        </div>

        {/* Row 2 — calculator full width */}
        <WLReveal>
        <WLCalculatorCard variant="dark" />
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
  return <Button label={label} tone="onDark" variant={primary ? "primary" : "secondary"}
    size={tiny ? "tiny" : (small ? "small" : (large ? "large" : "default"))} wrap={wrap} />;
}

Object.assign(window, { ChimeWeightLossSection });
