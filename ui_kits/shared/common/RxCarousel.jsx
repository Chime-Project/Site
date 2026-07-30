// Chime Health — shared Rx product slider.
// One implementation for all placements:
//   variant="dark"  — homepage Weight Loss / Wellness sections (white-on-navy card)
//   variant="light" — Weight Loss / Wellness timeline cards (ink-on-tint card)
// Colors bind to --accent-* + theme-neutral white/ink only, so each page keeps its
// own palette via the section's data-theme (tide, cadmium, …). Products come from
// window.CHIME_PRODUCTS (load ui_kits/shared/data/products.js first), filtered by
// the `category` prop ("weight-loss" | "energy-wellness"; omit for all) — "Coming
// soon" products are excluded since the card's CTA is a purchase path.
// The `Button` prop lets each page pass its own button (shared <Button> lands in Phase 4).

const RX_VARIANTS = {
  light: {
    arrowBorder: "var(--accent-border)", arrowBg: "var(--accent-subtleHover)", arrowBgHover: "var(--accent-border)", arrowText: "var(--accent-strong)",
    name: "var(--text-default)", muted: "var(--fg-muted)", price: "var(--text-default)",
    planPromoBg: "var(--accent-subtleHover)", planBg: "var(--color-white)",
    planPromoBorder: "var(--accent-default)", planBorder: "var(--accent-border)",
    planText: "var(--text-default)", star: "var(--accent-strong)",
    dotOn: "var(--accent-default)", dotOff: "var(--accent-border)", safety: "var(--accent-strong)",
  },
  dark: {
    arrowBorder: "rgba(255,255,255,0.25)", arrowBg: "rgba(255,255,255,0.07)", arrowBgHover: "rgba(255,255,255,0.20)", arrowText: "var(--color-white)",
    name: "var(--color-white)", muted: "rgba(255,255,255,0.7)", price: "var(--color-white)",
    planPromoBg: "rgba(255,255,255,0.16)", planBg: "rgba(255,255,255,0.05)",
    planPromoBorder: "var(--accent-subtleHover)", planBorder: "rgba(255,255,255,0.10)",
    planText: "var(--color-white)", star: "var(--accent-subtleHover)",
    dotOn: "var(--color-white)", dotOff: "rgba(255,255,255,0.35)", safety: "rgba(255,255,255,0.85)",
  },
};

function RxArrow({ dir, onClick, v }) {
  const [h, setH] = React.useState(false);
  return (
    <button type="button" onClick={onClick} aria-label={dir < 0 ? "Previous product" : "Next product"}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        flex: "none", width: 32, height: 32, borderRadius: "var(--radius-4xl)", cursor: "pointer",
        border: "1px solid " + v.arrowBorder,
        background: h ? v.arrowBgHover : v.arrowBg,
        color: v.arrowText, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "var(--text-lg)", lineHeight: 1, paddingBottom: 3,
        transition: "background var(--transition-base) var(--ease-in-out)",
      }}>{dir < 0 ? "‹" : "›"}</button>
  );
}

// Slides the incoming product's content in from the direction of travel.
// Direct style mutation + a forced reflow (offsetWidth) between the start and
// end states — no @keyframes needed, so it stays self-contained in this file.
// First render (and dir 0) skips the animation so initial paint is stable.
function RxSlide({ k, dir, children, style }) {
  const ref = React.useRef(null);
  const first = React.useRef(true);
  React.useLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = ref.current;
    if (!el || !dir) return;
    el.style.transition = "none";
    el.style.transform = "translateX(" + dir * 28 + "px)";
    el.style.opacity = "0";
    void el.offsetWidth;
    el.style.transition = "transform var(--transition-base) var(--ease-in-out), opacity var(--transition-base) var(--ease-in-out)";
    el.style.transform = "translateX(0)";
    el.style.opacity = "1";
  }, [k]);
  return <div ref={ref} style={style}>{children}</div>;
}

function RxCarousel({ variant = "light", Button, uploads, category }) {
  const v = RX_VARIANTS[variant] || RX_VARIANTS.light;
  const PRODUCTS = window.CHIME_PRODUCTS.filter(function (p) {
    return (!category || p.theme === category) && p.status !== "Coming soon";
  });
  const [idx, setIdx] = React.useState(0);
  const [dir, setDir] = React.useState(0);
  const [vhover, setVhover] = React.useState(false);
  const p = PRODUCTS[idx];
  const many = PRODUCTS.length > 1;
  const go = (d) => { setDir(d); setIdx((idx + d + PRODUCTS.length) % PRODUCTS.length); };
  const pick = (i) => { if (i === idx) return; setDir(i > idx ? 1 : -1); setIdx(i); };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: many ? "space-between" : "center", gap: "var(--spacing-2)" }}>
        {many && <RxArrow dir={-1} onClick={() => go(-1)} v={v} />}
        <RxSlide k={idx} dir={dir} style={{ textAlign: "center", minWidth: 0 }}>
          <h3 style={{ margin: 0, fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-semibold)", color: v.name, lineHeight: 1.2 }}>{p.name}</h3>
          <div style={{ fontSize: "var(--text-xs)", color: v.muted, marginTop: 2 }}>
            Starting from <span style={{ color: v.price, fontWeight: "var(--font-weight-semibold)" }}>{p.start}/mo</span>
          </div>
        </RxSlide>
        {many && <RxArrow dir={1} onClick={() => go(1)} v={v} />}
      </div>

      <div onMouseEnter={() => setVhover(true)} onMouseLeave={() => setVhover(false)}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 116 }}>
        <RxSlide k={idx} dir={dir}>
        <img src={uploads + "/" + p.img} alt={p.name + " vial"} style={{
          height: 116, width: "auto", display: "block",
          transform: vhover ? "scale(1.08) rotate(-3deg) translateY(-4px)" : "none",
          filter: vhover ? "drop-shadow(0 22px 34px rgba(0,0,0,0.5))" : "drop-shadow(0 14px 26px rgba(0,0,0,0.38))",
          transition: "transform var(--transition-base) var(--ease-in-out), filter var(--transition-base) var(--ease-in-out)",
        }} />
        </RxSlide>
      </div>

      {/* Multi-month rows only — the "1mo" rate is already the header's "Starting from". */}
      <RxSlide k={idx} dir={dir} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
        {p.plans.filter((pl) => pl.key !== "1mo").map((pl) => (
          <div key={pl.term} style={{
            display: "flex", flexDirection: "column", gap: 3,
            background: pl.promo ? v.planPromoBg : v.planBg,
            border: "1px solid " + (pl.promo ? v.planPromoBorder : v.planBorder),
            borderRadius: "var(--radius-lg)", padding: "var(--spacing-2) var(--spacing-3)",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--spacing-2)" }}>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", color: v.planText }}>{pl.term}</span>
              <span style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)", color: v.planText }}>{pl.price}</span>
            </div>
            {pl.permo ? (
              <span style={{ fontSize: 11, color: v.muted, alignSelf: "flex-end" }}>{pl.permo + "/mo"}</span>
            ) : null}
            {pl.promo ? (
              <span style={{ fontSize: 11, fontWeight: "var(--font-weight-semibold)", color: v.star }}>{"★ Includes 4th month for free"}</span>
            ) : null}
          </div>
        ))}
      </RxSlide>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "auto" }}>
        <Button primary small label="Get started" />
      </div>

      {/* The button is the 24x24 touch target (WCAG 2.2 target-size); the dot you
          actually see is the inner span, still 22x7 / 7x7. gap drops 6 -> 0 so the
          wider boxes don't push the visible dots apart. The 8.5px of transparent
          padding above/below stays inside the column's --spacing-4 gap, so it
          cannot overlap -- and steal clicks from -- the CTA or the link below. */}
      <div style={{ display: many ? "flex" : "none", justifyContent: "center", gap: 0 }}>
        {PRODUCTS.map((_, i) => (
          <button key={i} type="button" aria-label={"Show " + PRODUCTS[i].name} onClick={() => pick(i)} style={{
            width: 24, height: 24, border: "none", padding: 0, cursor: "pointer",
            background: "none", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span aria-hidden="true" style={{
              display: "block",
              width: i === idx ? 22 : 7, height: 7, borderRadius: 4,
              background: i === idx ? v.dotOn : v.dotOff,
              transition: "all var(--transition-base) var(--ease-in-out)",
            }}></span>
          </button>
        ))}
      </div>

      <a href="terms-conditions.html" style={{ textAlign: "center", fontSize: "var(--text-xs)", color: v.safety, textDecoration: "underline", textUnderlineOffset: 2 }}>Important safety information</a>
    </div>
  );
}

Object.assign(window, { RxCarousel });
