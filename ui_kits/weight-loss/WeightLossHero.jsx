// Chime Health — Weight Loss landing: Hero (bento)
// Two image tiles on top · headline + CTAs and qualify checklist tiles below ·
// full-width benefits tile. Themed via data-theme="weight-loss" (tide).

const WLH_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";

function WLHeroCTA({ label, primary, onClick }) {
  return <Button label={label} onClick={onClick} tone="onDark" variant="primary" size="cta" />;
}

function WLHeroCheckItem(props) {
  return <CheckItem {...props} />;
}

function WLHeroBenefit({ icon, label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-3)", textAlign: "center" }}>
      <span aria-hidden="true" style={{ color: "var(--accent-strong)", display: "flex" }}>{icon}</span>
      <p style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: 1.45, color: "var(--fg-default)", maxWidth: "14em" }}>{label}</p>
    </div>
  );
}

const wlhIcon = (d) => <Icon size={28} strokeWidth={1.5}>{d}</Icon>;

function ChimeWeightLossHero() {
  const open = () => { window.openChimeAssessment && window.openChimeAssessment(); };
  return (
    <section data-theme="weight-loss" data-screen-label="WL Hero" style={{ background: "var(--bg-default)" }}>
      {/* Bento grid: images on top, headline + checklist tiles below */}
      <WLReveal>
      <div className="wlh-bento" style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "var(--spacing-8) var(--spacing-6) 0",
        display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "var(--spacing-3)",
      }}>
        {/* Row 1 — headline + CTAs tile */}
        <div className="wlh-tile-text" style={{
          gridColumn: "span 8", boxSizing: "border-box",
          background: "var(--accent-default)", borderRadius: "var(--radius-2xl)",
          padding: "var(--spacing-10) var(--spacing-8)",
          display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start",
          gap: "var(--spacing-6)",
        }}>
          <h1 style={{
            margin: 0, fontSize: "var(--text-5xl)", fontWeight: 300,
            lineHeight: 1.12, color: "var(--color-white)", maxWidth: "14em",
            textWrap: "pretty",
          }}>Weight Loss That Works With You</h1>
          <p style={{
            margin: 0, fontSize: "var(--text-lg)", lineHeight: 1.5,
            color: "var(--color-tide-100)", maxWidth: "26em",
          }}>A path designed around your goals, lifestyle, and health.</p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "var(--spacing-3)" }}>
            <div style={{ display: "flex", gap: "var(--spacing-3)", flexWrap: "wrap" }}>
              <WLHeroCTA label="Discover Your Weight Loss Path" onClick={open}></WLHeroCTA>
            </div>
            <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-tide-100)", maxWidth: "38em" }}>Takes only a few minutes. No obligation. Just a better understanding of what may be right for you.</p>
          </div>
        </div>
        <div className="wlh-tile-video" style={{
          gridColumn: "span 4", position: "relative", aspectRatio: "3 / 4",
          background: "var(--color-tide-100)", borderRadius: "var(--radius-2xl)", overflow: "hidden",
        }}>
          <video autoPlay muted loop playsInline
            src={WLH_UPLOADS + "/hf_20260715_160545_3aeeeecb-c72d-4f5c-b1ad-17c091d16103.mp4"}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}></video>
        </div>

        {/* Row 2 — first image tile */}
        <div className="wlh-tile-img" style={{
          gridColumn: "span 7", position: "relative", aspectRatio: "4 / 3",
          background: "var(--color-tide-200)", borderRadius: "var(--radius-2xl)", overflow: "hidden",
        }}>
          <video autoPlay muted loop playsInline
            src={WLH_UPLOADS + "/hf_20260715_163723_83fa738a-20bb-45d3-a8c2-954d56a8e400.mp4"}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}></video>
        </div>

        {/* Row 2 — checklist tile */}
        <div className="wlh-tile-check" style={{
          gridColumn: "span 5", boxSizing: "border-box",
          background: "var(--bg-surface)", borderRadius: "var(--radius-2xl)",
          padding: "var(--spacing-4) var(--spacing-6)",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
        }}>
          <WLHeroCheckItem
            icon={wlhIcon(<React.Fragment><circle cx="12" cy="7" r="3" /><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" /></React.Fragment>)}
            strong="Personalized Plans" rest="built around your goals and lifestyle"></WLHeroCheckItem>
          <WLHeroCheckItem
            icon={wlhIcon(<React.Fragment><circle cx="9" cy="8" r="3" /><path d="M3 21c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5a3 3 0 0 1 0 6M21 21c0-2.8-1.9-5.1-4.5-5.8" /></React.Fragment>)}
            strong="Wellness Coaches" rest="support, accountability, and guidance"></WLHeroCheckItem>
          <WLHeroCheckItem
            icon={wlhIcon(<React.Fragment><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></React.Fragment>)}
            strong="Provider Oversight" rest="recommendations tailored to your needs"></WLHeroCheckItem>
          <WLHeroCheckItem
            icon={wlhIcon(<path d="M21 12a8 8 0 0 1-8 8H5l2-3a8 8 0 1 1 14-5z" />)}
            strong="Ongoing Support" rest="a team that stays with you throughout your journey"></WLHeroCheckItem>
          <WLHeroCheckItem last
            icon={wlhIcon(<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />)}
            strong="Fast &amp; Convenient" rest="online visits on your schedule"></WLHeroCheckItem>
        </div>
      </div>
      </WLReveal>

      <WLReveal delay={140}>
      <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "var(--spacing-3) var(--spacing-6) var(--spacing-12)" }}>
        <p style={{
          margin: "0 auto", maxWidth: 960, padding: 0,
          fontSize: "var(--text-xs)", lineHeight: 1.6, color: "var(--fg-muted)",
        }}><strong style={{ color: "var(--fg-default)" }}>Safety info:</strong> GLP-1 medications may have serious side effects. Eligibility determination and prescription required for all treatments. Individual results vary; *average reflects clinical study data, not a guarantee. <a href="#" style={{ color: "var(--accent-strong)" }}>See serious warnings &amp; safety info</a>.</p>
      </div>
      </WLReveal>
    </section>
  );
}

Object.assign(window, { ChimeWeightLossHero });
