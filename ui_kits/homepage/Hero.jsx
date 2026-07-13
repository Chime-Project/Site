// Chime Health — Homepage UI kit: Hero bento
// Headline + 2 media cards (drag your photos onto the slots) + 4 category cards.

const HERO_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";

function ChimeHero() {
  return (
    <section className="hero-section" style={{
      maxWidth: "var(--container-xl)", margin: "0 auto",
      padding: "var(--spacing-6) var(--spacing-8) var(--spacing-12)",
      fontFamily: "var(--font-family-base)",
    }}>
      <div className="hero-enter hero-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-4)", alignItems: "stretch" }}>
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
      <h1 className="hero-title" style={{
            margin: "var(--spacing-4) 0 var(--spacing-8)",
            fontSize: "var(--text-6xl)", fontWeight: 300,
            lineHeight: 1.08, color: "var(--text-default)",
          }}>
            <span style={{ whiteSpace: "nowrap" }}>Health That’s</span><br />Tuned To You
          </h1>
          <ProductHeroCard
            slotId="hero-weight-loss"
            brand="SEMAGLUTIDE"
            product="Boost"
            price="Start from $179.00"
            src={HERO_UPLOADS + "/pen.png"}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)", minWidth: 0 }}>
          <TreatmentPathCard
            slotId="hero-results"
            src={HERO_UPLOADS + "/hf_20260709_235042_d5fcb10f-0daf-4a3f-a324-6c1333d8210d.png"}
          />
          <div className="hero-chips-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-3)" }}>
            <TrustChip label="Dedicated Wellness Coaches" icon="coach" />
            <TrustChip label="Licensed US Providers" icon="shield" />
            <TrustChip label="HIPAA Protected" icon="zap" />
            <TrustChip label="Next-Day Shipping Available" icon="clock" />
          </div>
        </div>
      </div>

      <div className="hero-enter hero-cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--spacing-4)", marginTop: "var(--spacing-4)", animationDelay: "240ms" }}>
        <CategoryCard slotId="cat-weight" theme="weight-loss" pre="Lose" accent="weight" src={HERO_UPLOADS + "/weight-c31b5849.jpg"} targetId="weight-loss-section" />
        <CategoryCard slotId="cat-energy" theme="energy-wellness" pre="Boost" accent="energy & wellness" accentColor="#B08A28" hoverBg="linear-gradient(135deg, #FBF3DC, #F5E7BE)" hoverBorder="#E6C465" src={HERO_UPLOADS + "/wellness-aa5b5325.jpg"} targetId="wellness-section" />
        <CategoryCard slotId="cat-labs" theme="lab" pre="Get" accent="a lab check" src={HERO_UPLOADS + "/labs-74591640.jpg"} targetId="labs-section" />
        <StartHereCard slotId="cat-start" src={HERO_UPLOADS + "/start-07599cc8.jpg"} />
      </div>
    </section>
  );
}

function ProductHeroCard({ slotId, brand, product, price, src }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#" data-theme="default"
      onClick={(e) => { e.preventDefault(); window.openChimeAssessment && window.openChimeAssessment(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", display: "block", height: 340,
        borderRadius: "var(--radius-3xl)", overflow: "hidden",
        textDecoration: "none",
        background: "#A6C4DF",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-xs)",
        transition: "box-shadow var(--transition-base) var(--ease-in-out)",
      }}>
      <image-slot id={slotId} shape="rect" fit="cover" placeholder="Drop product photo" class="hero-float" src={src}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", willChange: "transform" }}></image-slot>
      <div style={{ position: "absolute", top: "var(--spacing-5)", right: "var(--spacing-6)", pointerEvents: "none" }}>
        <span style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--font-weight-bold)", letterSpacing: "0.02em" }}>
          <span style={{ color: "var(--accent-default)" }}>{brand}</span>{" "}
          <span style={{ color: "var(--text-default)" }}>{product}</span>
        </span>
      </div>
      <div style={{
        position: "absolute", right: "var(--spacing-5)", bottom: "var(--spacing-5)",
        background: "var(--color-white)", borderRadius: "var(--radius-4xl)",
        padding: "var(--spacing-3) var(--spacing-5)",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)",
        color: hover ? "var(--text-on-primary)" : "var(--text-default)", pointerEvents: "none",
        overflow: "hidden",
        transform: hover ? "translateY(-3px) scale(1.04)" : "none",
        transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out), color 0.35s var(--ease-in-out)",
      }}>
        <span style={{
          position: "absolute", inset: 0, background: "var(--accent-default)",
          transform: hover ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left center",
          transition: "transform 0.35s var(--ease-in-out)",
        }}></span>
        <span style={{ position: "relative" }}>{price}</span>
      </div>
    </a>
  );
}

function TreatmentPathCard({ slotId, src }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#" data-theme="default"
      onClick={(e) => { e.preventDefault(); window.openChimeAssessment && window.openChimeAssessment(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", display: "block", flex: 1, minHeight: 340,
        borderRadius: "var(--radius-3xl)", overflow: "hidden",
        textDecoration: "none",
        background: "var(--color-navy-900, #1B263A)",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-xs)",
        transition: "box-shadow var(--transition-base) var(--ease-in-out)",
      }}>
      <video className="hero-card-video"
        src={HERO_UPLOADS + "/hf_20260712_215808_12876c8b-1eda-48be-9200-1414fa5686e7.mp4"}
        autoPlay muted loop playsInline
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}></video>
      <div className="hero-card-content" style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        justifyContent: "space-between", alignItems: "flex-start",
        padding: "var(--spacing-6)",
      }}>
        <div className="hero-card-title" style={{
          color: "var(--color-white)", fontSize: "var(--text-xl)",
          fontWeight: "var(--font-weight-semibold)", lineHeight: 1.3,
          textWrap: "balance", maxWidth: "55%",
          textShadow: "0 1px 12px rgba(27,38,58,0.4)",
        }}>Explore treatments designed around you</div>
        <span style={{
          display: "inline-block", position: "relative", overflow: "hidden",
          background: "var(--color-white)",
          color: hover ? "var(--text-on-primary)" : "var(--text-default)", borderRadius: "var(--radius-4xl)",
          padding: "var(--spacing-3) var(--spacing-5)",
          fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)",
          boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
          transform: hover ? "translateY(-3px) scale(1.04)" : "none",
          transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out), color 0.35s var(--ease-in-out)",
        }}>
          <span style={{
            position: "absolute", inset: 0, background: "var(--accent-default)",
            transform: hover ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left center",
            transition: "transform 0.35s var(--ease-in-out)",
          }}></span>
          <span style={{ position: "relative" }}>Discover Your Health Path</span>
        </span>
      </div>
    </a>
  );
}

function CategoryCard({ slotId, theme, pre, accent, accentColor, hoverBg, hoverBorder, src, targetId }) {
  const [hover, setHover] = React.useState(false);
  const handleClick = (e) => {
    if (!targetId) return;
    const el = document.getElementById(targetId);
    if (!el) return;
    e.preventDefault();
    const top = el.getBoundingClientRect().top + window.pageYOffset - 72;
    window.scrollTo({ top: top, behavior: "smooth" });
  };
  return (
    <a href={targetId ? "#" + targetId : "#"} data-theme={theme}
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: "var(--spacing-3)",
        background: hover ? (hoverBg || "linear-gradient(135deg, var(--accent-subtle), var(--accent-subtleHover))") : "var(--bg-elevated)",
        border: "1px solid " + (hover ? (hoverBorder || "var(--accent-default)") : "var(--border-default)"),
        borderRadius: "var(--radius-2xl)", padding: "var(--spacing-4) var(--spacing-5)",
        textDecoration: "none", minHeight: 88, boxSizing: "border-box",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-xs)",
        transform: hover ? "translateY(-4px)" : "none",
        transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out), background var(--transition-base) var(--ease-in-out), border-color var(--transition-base) var(--ease-in-out)",
      }}>
      <span style={{ flex: 1, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-default)", lineHeight: 1.35 }}>
        {pre} <span style={{ color: accentColor || "var(--accent-strong)" }}>{accent}</span>
      </span>
      <image-slot id={slotId} shape="circle" placeholder="" src={src}
        style={{ width: 52, height: 52, flex: "none", transform: hover ? "scale(1.12)" : "scale(1)", transition: "transform var(--transition-base) var(--ease-in-out)" }}></image-slot>
      <Chevron dark={true} raised={hover} />
    </a>
  );
}

function StartHereCard({ slotId, src }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#"
      onClick={(e) => { e.preventDefault(); window.openChimeAssessment && window.openChimeAssessment(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: "var(--spacing-3)",
        background: "var(--bg-secondary)", border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-2xl)", padding: "var(--spacing-4) var(--spacing-5)",
        textDecoration: "none", minHeight: 88, boxSizing: "border-box",
        boxShadow: hover ? "var(--shadow-md)" : "none",
        transform: hover ? "translateY(-4px)" : "none",
        transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out)",
      }}>
      <span style={{ flex: 1, fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)", color: "var(--text-secondary)", lineHeight: 1.4 }}>
        Unsure where to begin?<br />
        <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-bold)", color: "var(--text-default)" }}>Start here</span>
      </span>
      <image-slot id={slotId} shape="circle" placeholder="" src={src}
        style={{ width: 52, height: 52, flex: "none", transform: hover ? "scale(1.12)" : "scale(1)", transition: "transform var(--transition-base) var(--ease-in-out)" }}></image-slot>
      <span style={{
        width: 32, height: 32, borderRadius: "50%", flex: "none",
        background: "var(--primary-default)", color: "var(--text-on-primary)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"></path></svg>
      </span>
    </a>
  );
}

function TrustChip({ label, icon }) {
  const [hover, setHover] = React.useState(false);
  const paths = {
    coach: <React.Fragment><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15"></path><circle cx="12" cy="12" r="3"></circle></React.Fragment>,
    shield: <React.Fragment><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></React.Fragment>,
    zap: <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>,
    clock: <React.Fragment><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></React.Fragment>,
  };
  return (
    <span className="trust-chip"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "var(--spacing-2)",
        background: "var(--color-white)", border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-4xl)", padding: "var(--spacing-2) var(--spacing-4)",
        fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)",
        color: "var(--text-default)",
        boxShadow: hover ? "var(--shadow-sm)" : "var(--shadow-xs)",
        transform: hover ? "translateY(-2px)" : "none",
        transition: "box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out)",
      }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-strong)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[icon]}</svg>
      {label}
    </span>
  );
}

function Chevron({ dark, raised }) {
  return (
    <span style={{
      width: 32, height: 32, borderRadius: "50%", flex: "none",
      background: dark ? "var(--bg-secondary)" : "rgba(255,255,255,0.9)",
      color: "var(--text-default)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      transform: raised ? "translateX(2px)" : "none",
      transition: "transform var(--transition-base) var(--ease-in-out)",
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
    </span>
  );
}

Object.assign(window, { ChimeHero });
