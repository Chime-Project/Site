// Chime Health — Homepage UI kit: Navbar
// Logo left · links center · Log in right. Sticky, cream, hairline on scroll.

const NAV_ASSETS = window.CHIME_ASSETS_BASE || "../../assets";

// Map nav labels to their destination pages. Labels without an entry fall back to "#".
const NAV_HREFS = window.CHIME_NAV_HREFS || {
  "Weight Loss": "weight-loss.html",
};
const navHref = (label) => NAV_HREFS[label] || "#";

function ChimeNavbar({ links = ["Weight Loss", "Health, Energy & Wellness", "Labs"], homeHref = "homepage.html" }) {
  const { Button } = window.ChimeHealthDesignSystem_b350cf;
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const headerRef = React.useRef(null);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // Mobile menu: close on an outside tap. Growing back to desktop no longer
  // needs a JS resize listener — CSS (.nav-hamburger / .nav-mobile-menu at
  // min-width:961px) hides both the toggle and the menu on desktop.
  React.useEffect(() => {
    if (!menuOpen) return;
    const onDocDown = (e) => { if (headerRef.current && !headerRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("touchstart", onDocDown);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("touchstart", onDocDown);
    };
  }, [menuOpen]);
  return (
    <header ref={headerRef} style={{
      position: "fixed", zIndex: "var(--z-sticky)",
      top: scrolled ? "var(--spacing-3)" : 0,
      left: "50%", transform: "translateX(-50%)",
      width: scrolled ? "min(calc(var(--container-xl) - var(--spacing-16)), calc(100% - var(--spacing-8)))" : "100%",
      background: scrolled ? "rgba(50, 69, 99, 0.92)" : "rgba(255, 254, 251, 0.88)",
      backdropFilter: "blur(var(--blur-md))",
      WebkitBackdropFilter: "blur(var(--blur-md))",
      border: "1px solid " + (scrolled ? "rgba(255,255,255,0.14)" : "transparent"),
      borderRadius: scrolled ? "var(--radius-4xl)" : 0,
      boxShadow: scrolled ? "var(--shadow-md)" : "none",
      transition: "top var(--transition-base) var(--ease-in-out), width var(--transition-base) var(--ease-in-out), background var(--transition-base) var(--ease-in-out), border-color var(--transition-base) var(--ease-in-out), border-radius var(--transition-base) var(--ease-in-out), box-shadow var(--transition-base) var(--ease-in-out)",
    }}>
      <nav className="nav-bar" style={{
        maxWidth: "var(--container-xl)", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
        gap: "var(--spacing-6)",
        padding: scrolled ? "0 var(--spacing-5)" : "0 var(--spacing-8)",
        height: scrolled ? 80 : 72,
        transition: "height var(--transition-base) var(--ease-in-out), padding var(--transition-base) var(--ease-in-out)",
        fontFamily: "var(--font-family-base)",
      }}>
        <a href={homeHref} aria-label="Chime Health home" className="nav-logo" style={{ display: "inline-flex", alignItems: "center", justifySelf: "start", position: "relative", marginLeft: "var(--spacing-4)" }}>
          <img src={NAV_ASSETS + "/logo-slate.png"} alt="Chime Health" style={{ height: 44, width: "auto", display: "block", opacity: scrolled ? 0 : 1, transition: "opacity var(--transition-base) var(--ease-in-out)" }} />
          <img src={NAV_ASSETS + "/logo-white.png"} alt="" aria-hidden="true" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: 44, width: "auto", display: "block", opacity: scrolled ? 1 : 0, transition: "opacity var(--transition-base) var(--ease-in-out)" }} />
        </a>
        <div className="nav-links" style={{ display: "flex", gap: "var(--spacing-2)", justifySelf: "center" }}>
          {links.map((label) => <NavLink key={label} label={label} href={navHref(label)} onDark={scrolled} />)}
        </div>
        <div className="nav-actions" style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: "var(--spacing-2)" }}>
          <button
            type="button"
            className="nav-hamburger flex flex-col justify-center gap-1"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              width: 40, height: 40, padding: 9, boxSizing: "border-box",
              background: "transparent", border: "none", cursor: "pointer", borderRadius: "var(--radius-md)",
            }}>
            {[0, 1, 2].map((i) => (
              <span key={i} aria-hidden="true" style={{
                display: "block", height: 2, width: "100%", borderRadius: 2,
                background: scrolled ? "var(--color-white)" : "var(--text-secondary)",
                transition: "transform 0.25s var(--ease-in-out), opacity 0.2s var(--ease-in-out), background var(--transition-base) var(--ease-in-out)",
                transform: menuOpen ? (i === 0 ? "translateY(6px) rotate(45deg)" : i === 2 ? "translateY(-6px) rotate(-45deg)" : "none") : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
          <Button variant="outline" size="sm" className="nav-login" style={{
            borderRadius: "var(--radius-4xl)", padding: "0 var(--spacing-4)",
            color: scrolled ? "var(--color-white)" : undefined,
            borderColor: scrolled ? "rgba(255,255,255,0.4)" : undefined,
            background: scrolled ? "transparent" : undefined,
            transition: "color var(--transition-base) var(--ease-in-out), border-color var(--transition-base) var(--ease-in-out), background var(--transition-base) var(--ease-in-out)",
          }}>Log in</Button>
        </div>
      </nav>
      {menuOpen ? (
        <div className="nav-mobile-menu" style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          marginTop: scrolled ? "var(--spacing-1)" : 0,
          background: scrolled ? "rgba(50, 69, 99, 0.98)" : "rgba(255, 254, 251, 0.98)",
          backdropFilter: "blur(var(--blur-md))", WebkitBackdropFilter: "blur(var(--blur-md))",
          borderRadius: scrolled ? "var(--radius-2xl)" : "0 0 var(--radius-2xl) var(--radius-2xl)",
          borderTop: scrolled ? "none" : "1px solid var(--border-default)",
          boxShadow: "var(--shadow-lg)",
          padding: "var(--spacing-3)",
          display: "flex", flexDirection: "column", gap: "var(--spacing-1)",
        }}>
          {links.map((label) => (
            <a key={label} href={navHref(label)} onClick={() => setMenuOpen(false)} style={{
              textDecoration: "none", fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)",
              color: scrolled ? "var(--color-white)" : "var(--text-default)",
              padding: "var(--spacing-3) var(--spacing-4)", borderRadius: "var(--radius-lg)",
            }}>{label}</a>
          ))}
        </div>
      ) : null}
    </header>
  );
}

function NavLink({ label, href = "#", onDark }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textDecoration: "none",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--font-weight-semibold)",
        color: onDark
          ? "var(--color-white)"
          : (hover ? "var(--accent-strong)" : "var(--text-secondary)"),
        background: hover
          ? (onDark ? "rgba(255,255,255,0.14)" : "var(--accent-subtle)")
          : "transparent",
        padding: "var(--spacing-2) var(--spacing-4)",
        borderRadius: "var(--radius-4xl)",
        transition: "background var(--transition-fast) var(--ease-in-out), color var(--transition-fast) var(--ease-in-out)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </a>
  );
}

Object.assign(window, { ChimeNavbar });
