// Chime Health — Homepage UI kit: Products carousel section
// Horizontal right-to-left carousel of treatment cards (scroll-snap + arrows + progress).

const PRODUCTS_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";

const CHIME_PRODUCTS = [
  { id: "prod-semaglutide", name: "GLP-1", category: "Weight Loss", theme: "weight-loss", price: "From $249/mo", status: "In stock", badge: null,
    plans: [
      { key: "1mo", price: "From $249.00", note: null },
      { key: "3mo", price: "$596.00*", note: "*Includes ", noteBold: "4th month for free" },
      { key: "6mo", price: "$1,050.00", note: null },
      { key: "1yr", price: "$1,800.00", note: null },
    ] },
  { id: "prod-tirzepatide", name: "GLP1/GIP", category: "Weight Loss", theme: "weight-loss", price: "From $359/mo", status: "In stock", badge: "Popular",
    plans: [
      { key: "1mo", price: "From $359.00", note: null },
      { key: "3mo", price: "$896.00*", note: "*Includes ", noteBold: "4th month for free" },
      { key: "6mo", price: "$1,650.00", note: null },
      { key: "1yr", price: "$2,880.00", note: null },
    ] },
  { id: "prod-nad", name: "NAD+", category: "Energy & Wellness", theme: "energy-wellness", price: "From $145/mo", status: "In stock", badge: null },
  { id: "prod-lipoc", name: "Lipo-C", category: "Energy & Wellness", theme: "energy-wellness", price: "From $135/mo", status: "In stock", badge: null },
  { id: "prod-sermorelin", name: "Sermorelin", category: "Energy & Wellness", theme: "energy-wellness", price: "From $190/mo", status: "Coming soon", badge: "Coming soon" },
];

const CHIME_PLAN_KEYS = [
  { key: "1mo", label: "1 Month" },
  { key: "3mo", label: "3 Months" },
  { key: "6mo", label: "6 Months" },
  { key: "1yr", label: "1 Year" },
];

function ChimeProductsSection() {
  const trackRef = React.useRef(null);
  const [progress, setProgress] = React.useState(0);
  const [planIdx, setPlanIdx] = React.useState(0);

  // Auto-advance treatment length every 25s; manual click resets the timer.
  const planTimer = React.useRef(null);
  const startPlanTimer = React.useCallback(() => {
    if (planTimer.current) clearInterval(planTimer.current);
    planTimer.current = setInterval(() => {
      setPlanIdx((i) => (i + 1) % CHIME_PLAN_KEYS.length);
    }, 25000);
  }, []);
  React.useEffect(() => {
    startPlanTimer();
    return () => clearInterval(planTimer.current);
  }, [startPlanTimer]);
  const pickPlan = (i) => { setPlanIdx(i); startPlanTimer(); };
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(true);

  const update = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  React.useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const step = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-product-card]");
    const w = card ? card.getBoundingClientRect().width + 16 : 320;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  return (
    <section data-screen-label="Products carousel" className="hero-section products-section" style={{
      maxWidth: "var(--container-xl)", margin: "0 auto",
      padding: "0 var(--spacing-8) var(--spacing-12)",
      fontFamily: "var(--font-family-base)",
    }}>
      <div className="products-head" style={{
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        gap: "var(--spacing-6)", flexWrap: "wrap",
        marginBottom: "var(--spacing-8)",
      }}>
        <div>
          <div style={{
            color: "var(--accent-strong)", fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-semibold)", letterSpacing: "0.12em",
            textTransform: "uppercase", marginBottom: "var(--spacing-3)",
          }}>Treatments</div>
          <h2 className="products-title" style={{
            margin: 0, fontSize: "var(--text-5xl)", fontWeight: 300,
            lineHeight: 1.1, color: "var(--text-default)", textWrap: "balance",
          }}>Care that works, delivered</h2>
        </div>
        <p style={{
          margin: 0, maxWidth: "26em", fontSize: "var(--text-base)",
          color: "var(--text-secondary)", lineHeight: 1.55,
        }}>Provider-prescribed treatments, shipped from licensed US pharmacies to your door.</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-3)", flexWrap: "wrap", marginBottom: "var(--spacing-6)" }}>
        <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", fontWeight: "var(--font-weight-medium)" }}>Treatment length</span>
        <div role="tablist" aria-label="Treatment length" style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2,
          background: "var(--bg-secondary)", borderRadius: "var(--radius-4xl)",
          padding: 3,
        }}>
          {CHIME_PLAN_KEYS.map((pl, i) => (
            <button key={pl.key} type="button" role="tab" aria-selected={i === planIdx}
              onClick={() => pickPlan(i)}
              style={{
                border: "none", cursor: "pointer",
                background: i === planIdx ? "var(--primary-default)" : "transparent",
                color: i === planIdx ? "var(--text-on-primary)" : "var(--text-secondary)",
                boxShadow: i === planIdx ? "var(--shadow-sm)" : "none",
                borderRadius: "var(--radius-4xl)",
                padding: "var(--spacing-2) var(--spacing-4)",
                fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)",
                fontFamily: "inherit", whiteSpace: "nowrap",
                transition: "all var(--transition-base) var(--ease-in-out)",
              }}>{pl.label}</button>
          ))}
        </div>
      </div>

      <div ref={trackRef} onScroll={update} className="products-track" style={{
        display: "grid", gridAutoFlow: "column",
        gridAutoColumns: "calc((100% - 3 * 16px) / 4)",
        gap: 16,
        overflowX: "auto", scrollSnapType: "x mandatory",
        scrollbarWidth: "none", msOverflowStyle: "none",
        paddingBottom: "var(--spacing-2)",
      }}>
        {CHIME_PRODUCTS.map((p) => <ProductCard key={p.id} p={p} planIdx={planIdx} />)}
      </div>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        gap: "var(--spacing-3)", marginTop: "var(--spacing-5)",
      }}>
        <span style={{
          position: "relative", width: 72, height: 10,
          background: "var(--bg-tertiary)", borderRadius: "var(--radius-4xl)",
          overflow: "hidden", marginRight: "var(--spacing-2)",
        }}>
          <span style={{
            position: "absolute", top: 2, bottom: 2,
            left: 2 + progress * (72 - 4 - 28) + "px", width: 28,
            background: "var(--primary-default)", borderRadius: "var(--radius-4xl)",
            transition: "left 80ms linear",
          }}></span>
        </span>
        <CarouselArrow dir={-1} enabled={canPrev} onClick={() => step(-1)} />
        <CarouselArrow dir={1} enabled={canNext} onClick={() => step(1)} />
      </div>

      <p style={{
        margin: "var(--spacing-8) 0 0", maxWidth: "72em",
        fontSize: "var(--text-xs)", lineHeight: 1.6, color: "var(--text-muted)",
      }}>
        Compounded medications are prescribed at a licensed provider’s discretion and are not FDA-approved.{" "}
        <strong style={{ color: "var(--text-secondary)" }}>Safety info:</strong> GLP-1 medications may have serious side effects, including possible thyroid tumors. Do not use if you or your family have a history of a type of thyroid cancer called MTC or MEN 2. See full safety information on each treatment page.
      </p>
    </section>
  );
}

function ProductCard({ p, planIdx }) {
  const [hover, setHover] = React.useState(false);
  const future = p.status === "Coming soon";
  const plan = p.plans ? p.plans[planIdx] : null;
  return (
    <article data-product-card data-theme={p.theme}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ scrollSnapAlign: "start", display: "flex", flexDirection: "column", minWidth: 0 }}>
      <div style={{
        position: "relative", borderRadius: "var(--radius-3xl)", overflow: "hidden",
        background: "linear-gradient(160deg, #FFFFFF 0%, #D6ECFF 60%, #BDD2F6 100%)",
        aspectRatio: "1 / 1.05",
        boxShadow: hover ? "var(--shadow-lg)" : "var(--shadow-xs)",
        transition: "box-shadow var(--transition-base) var(--ease-in-out)",
      }}>
        <image-slot id={p.id} shape="rect" fit="contain" placeholder="Drop product photo"
          src={PRODUCTS_UPLOADS + "/vial-solo.png"}
          style={{
            position: "absolute", inset: "9%",
            transform: hover ? "scale(1.14) rotate(-3deg) translateY(-6px)" : "none",
            transition: "transform var(--transition-base) var(--ease-in-out), filter var(--transition-base) var(--ease-in-out)",
            filter: future ? "grayscale(0.35) opacity(0.75)" : (hover ? "drop-shadow(0 16px 22px rgba(50,69,99,0.30))" : "none"),
          }}></image-slot>
        <div style={{
          position: "absolute", top: "var(--spacing-4)", left: "var(--spacing-4)", right: "var(--spacing-4)",
          display: "flex", gap: "var(--spacing-2)", flexWrap: "wrap",
        }}>
          {p.badge && !(plan && plan.noteBold) && (
            <span style={{
              background: "var(--accent-subtle)", color: "var(--accent-onSubtle)",
              border: "1px solid var(--accent-border)",
              borderRadius: "var(--radius-4xl)", padding: "var(--spacing-1) var(--spacing-3)",
              fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)",
            }}>{p.badge}</span>
          )}
          {plan && plan.noteBold && (
            <span style={{
              background: "var(--primary-default)", color: "var(--text-on-primary)",
              borderRadius: "var(--radius-4xl)", padding: "var(--spacing-1) var(--spacing-3)",
              fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)",
            }}>*Includes 4th month for free</span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)", padding: "var(--spacing-4) var(--spacing-1) 0" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "var(--spacing-2)", alignSelf: "flex-start",
          background: future ? "var(--bg-secondary)" : "var(--success-subtle)",
          color: future ? "var(--text-secondary)" : "var(--color-green-800)",
          borderRadius: "var(--radius-4xl)", padding: "2px var(--spacing-3)",
          fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-medium)",
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: future ? "var(--color-slate-400)" : "var(--success-default)",
          }}></span>
          {p.status}
        </span>
        <h3 style={{ margin: 0, fontSize: "var(--text-2xl)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-default)", lineHeight: 1.2 }}>{p.name}</h3>
        <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", display: "flex", alignItems: "baseline", gap: "var(--spacing-2)", flexWrap: "wrap" }}>
          <span style={{ color: p.theme === "energy-wellness" ? "#B08A28" : "var(--accent-strong)", fontWeight: "var(--font-weight-medium)" }}>{p.category}</span>
          <span style={{ fontWeight: "var(--font-weight-semibold)", color: "var(--text-default)", marginLeft: "auto" }}>{plan ? plan.price : p.price}</span>
        </div>
        <div style={{ display: "flex", gap: "var(--spacing-2)", marginTop: "var(--spacing-2)", flexWrap: "wrap" }}>
          <ProductBtn primary={true} disabled={future} label={future ? "Join waitlist" : "Get started"} />
          <ProductBtn primary={false} label="Learn more" />
        </div>
        <a href="#" style={{
          marginTop: "var(--spacing-1)", fontSize: "var(--text-xs)",
          color: "var(--text-muted)", textDecoration: "underline", textUnderlineOffset: 2,
        }}>Important safety information</a>
      </div>
    </article>
  );
}

function ProductBtn({ primary, label, disabled }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#"
      onClick={(e) => { e.preventDefault(); if (!disabled) window.openChimeAssessment && window.openChimeAssessment(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-block",
        background: primary ? (hover ? "var(--primary-hover)" : "var(--primary-default)") : "var(--color-white)",
        color: primary ? "var(--text-on-primary)" : "var(--text-default)",
        border: primary ? "1px solid transparent" : "1px solid " + (hover ? "var(--border-strong)" : "var(--border-default)"),
        borderRadius: "var(--radius-4xl)",
        padding: "var(--spacing-2) var(--spacing-4)",
        fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)",
        textDecoration: "none",
        boxShadow: hover ? "var(--shadow-sm)" : "none",
        transform: hover ? "translateY(-2px)" : "none",
        transition: "all var(--transition-base) var(--ease-in-out)",
      }}>{label}</a>
  );
}

function CarouselArrow({ dir, enabled, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onClick} disabled={!enabled}
      aria-label={dir < 0 ? "Previous products" : "Next products"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 44, height: 44, borderRadius: "50%",
        border: "1px solid " + (enabled ? "var(--border-strong)" : "var(--border-default)"),
        background: enabled && hover ? "var(--primary-default)" : "var(--color-white)",
        color: enabled ? (hover ? "var(--text-on-primary)" : "var(--text-default)") : "var(--color-slate-300)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        cursor: enabled ? "pointer" : "default",
        transition: "all var(--transition-base) var(--ease-in-out)",
      }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {dir < 0 ? <path d="M19 12H5m6-6-6 6 6 6"></path> : <path d="M5 12h14m-6-6 6 6-6 6"></path>}
      </svg>
    </button>
  );
}

Object.assign(window, { ChimeProductsSection });
