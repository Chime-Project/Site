// Chime Health — Health, Energy & Wellness landing: Hero (bento)
// Mirrors the Weight Loss hero layout (headline + CTA tile · media tiles ·
// qualify checklist). Themed via data-theme="wellness" (Soft Cadmium).

const WNH_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";

// Scroll-reveal wrapper — pure-CSS scroll-driven animation (see `.reveal`);
// `delay` accepted for API compatibility with the WL hero.
function WNHReveal(props) {
  return <Reveal {...props} />;
}

function WNHeroCTA({ label, onClick }) {
  return <Button label={label} onClick={onClick} tone="onDark" variant="primary" size="cta" />;
}

function WNHeroCheckItem({ icon, strong, rest, last }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "24px 1fr", gap: "var(--spacing-3)",
      alignItems: "start", padding: "var(--spacing-4) 0",
      borderBottom: last ? "none" : "1px solid var(--border-default)",
    }}>
      <span aria-hidden="true" style={{ color: "var(--fg-default)", display: "flex", marginTop: 2 }}>{icon}</span>
      <p style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: 1.5, color: "var(--fg-default)" }}>
        <a href="#" style={{ color: "var(--accent-strong)", fontWeight: "var(--font-weight-semibold)", textDecoration: "underline", textUnderlineOffset: 3 }}>{strong}</a>
        {" "}{rest}
      </p>
    </div>
  );
}

const wnhIcon = (d) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

function ChimeWellnessHero() {
  const open = () => { window.openChimeAssessment && window.openChimeAssessment(); };
  return (
    <section data-theme="wellness" data-screen-label="Wellness Hero" style={{ background: "var(--bg-default)" }}>
      {/* Bento grid: headline + media on top, media + checklist below */}
      <WNHReveal>
      <div className="wnh-bento" style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "var(--spacing-8) var(--spacing-6) 0",
        display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "var(--spacing-3)",
      }}>
        {/* Row 1 — headline + CTA tile */}
        <div className="wnh-tile-text" style={{
          gridColumn: "span 8", boxSizing: "border-box",
          background: "var(--accent-default)", borderRadius: "var(--radius-2xl)",
          padding: "var(--spacing-10) var(--spacing-8)",
          display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start",
          gap: "var(--spacing-6)",
        }}>
          <div>
            <h1 style={{
              margin: 0, fontSize: "var(--text-5xl)", fontWeight: 300,
              lineHeight: 1.12, color: "var(--color-white)", maxWidth: "14em",
              textWrap: "pretty",
            }}>Feel More Like Yourself Again</h1>
            <p style={{
              margin: "var(--spacing-4) 0 0", fontSize: "var(--text-xl)",
              lineHeight: 1.5, color: "var(--color-cadmium-100)", maxWidth: "22em",
            }}>Energy, wellness, and vitality are deeply personal.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "var(--spacing-3)" }}>
            <div style={{ display: "flex", gap: "var(--spacing-3)", flexWrap: "wrap" }}>
              <WNHeroCTA label="Discover Your Wellness Path" onClick={open}></WNHeroCTA>
            </div>
            <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-cadmium-100)", maxWidth: "38em" }}>Takes only a few minutes. No obligation. Just a clearer picture of what may help you feel your best.</p>
          </div>
        </div>

        {/* Row 1 — portrait video tile */}
        <div className="wnh-tile-video" style={{
          gridColumn: "span 4", position: "relative", aspectRatio: "3 / 4",
          background: "var(--color-cadmium-100)", borderRadius: "var(--radius-2xl)", overflow: "hidden",
        }}>
          <video autoPlay muted loop playsInline
            src={WNH_UPLOADS + "/chime-wellness.mp4"}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}></video>
        </div>

        {/* Row 2 — landscape image tile */}
        <div className="wnh-tile-img" style={{
          gridColumn: "span 7", position: "relative", aspectRatio: "4 / 3",
          background: "var(--color-cadmium-200)", borderRadius: "var(--radius-2xl)", overflow: "hidden",
        }}>
          <video src={WNH_UPLOADS + "/wellnes_vide_01.mp4"}
            autoPlay muted loop playsInline aria-label="A person feeling energized and well"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}></video>
        </div>

        {/* Row 2 — checklist tile */}
        <div className="wnh-tile-check" style={{
          gridColumn: "span 5", boxSizing: "border-box",
          background: "var(--bg-surface)", borderRadius: "var(--radius-2xl)",
          padding: "var(--spacing-4) var(--spacing-6)",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
        }}>
          <WNHeroCheckItem
            icon={wnhIcon(<React.Fragment><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></React.Fragment>)}
            strong="Personalized Plans" rest="built around your energy, focus, and recovery goals"></WNHeroCheckItem>
          <WNHeroCheckItem
            icon={wnhIcon(<React.Fragment><circle cx="9" cy="8" r="3" /><path d="M3 21c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5a3 3 0 0 1 0 6M21 21c0-2.8-1.9-5.1-4.5-5.8" /></React.Fragment>)}
            strong="Wellness Coaches" rest="support, accountability, and guidance"></WNHeroCheckItem>
          <WNHeroCheckItem
            icon={wnhIcon(<React.Fragment><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></React.Fragment>)}
            strong="Provider Oversight" rest="recommendations tailored to your needs"></WNHeroCheckItem>
          <WNHeroCheckItem last
            icon={wnhIcon(<path d="M21 12a8 8 0 0 1-8 8H5l2-3a8 8 0 1 1 14-5z" />)}
            strong="Ongoing Support" rest="a team that stays with you throughout your journey"></WNHeroCheckItem>
        </div>
      </div>
      </WNHReveal>

      <WNHReveal delay={140}>
      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "var(--spacing-3) var(--spacing-6) var(--spacing-12)" }}>
        <p style={{
          margin: "0 auto", maxWidth: 960, padding: 0,
          fontSize: "var(--text-xs)", lineHeight: 1.6, color: "var(--fg-muted)",
        }}><strong style={{ color: "var(--fg-default)" }}>Safety info:</strong> Not available in all 50 states. Eligibility determination and prescription required for all treatments. Individual results vary. <a href="#" style={{ color: "var(--accent-strong)" }}>Read more &amp; safety info</a>.</p>
      </div>
      </WNHReveal>
    </section>
  );
}

Object.assign(window, { ChimeWellnessHero });
