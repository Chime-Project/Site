// Chime Health — Assessment v4 controls (presentational, one per FORMAT in the
// v4 proposal). Semantic/--accent-* tokens only — the page theme owns the
// palette. State + routing live in AssessmentV4Flow.jsx; these render + report.
// Reuses the v1 primitives (AsmtOptionRow, AsmtSegment, AsmtButton, …) loaded
// from ui_kits/assessment/AssessmentControls.jsx.

const ASMT_V4_INPUT = {
  width: "100%", boxSizing: "border-box", display: "block",
  background: "var(--color-white)", color: "var(--text-default)",
  border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)",
  padding: "var(--spacing-3) var(--spacing-4)", minHeight: 44,
  fontSize: "var(--text-base)", fontFamily: "var(--font-family-base)",
  outline: "none",
  transition: "border-color var(--transition-base) var(--ease-in-out), box-shadow var(--transition-base) var(--ease-in-out)",
};

function asmtV4FocusStyle(focused, invalid) {
  if (focused) return { borderColor: "var(--accent-default)", boxShadow: "0 0 0 3px var(--accent-subtle)" };
  if (invalid) return { borderColor: "var(--error-default)" };
  return {};
}

// Icon geometry for the goal cards (lucide-lineage strokes; the shared <Icon>
// atom wraps them). Keep every addition lucide — the repo already carries a
// lucide/feather split elsewhere, and a third geometry inside one card grid
// would read as a mistake.
const ASMT_V4_ICONS = {
  scale: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  search: <React.Fragment><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></React.Fragment>,
  heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  refresh: <React.Fragment><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v6h-6" /></React.Fragment>,
  sparkle: <path d="M12 3l1.9 5.8 5.8 1.9-5.8 1.9L12 18.4l-1.9-5.8-5.8-1.9 5.8-1.9L12 3z" />,
  compass: <React.Fragment><circle cx="12" cy="12" r="10" /><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" /></React.Fragment>,
  // A2 eligibility cards.
  baby: <React.Fragment>
    <path d="M9 12h.01" /><path d="M15 12h.01" />
    <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
    <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
  </React.Fragment>,
  bottle: <React.Fragment>
    <path d="M8 2h8" />
    <path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2" />
    <path d="M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0" />
  </React.Fragment>,
  calendar: <React.Fragment>
    <path d="M8 2v4" /><path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
  </React.Fragment>,
  ban: <React.Fragment><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></React.Fragment>,
  // Pairs with `ban` for the B1.2 yes/no cards — same circle, so the two read
  // as one set rather than two unrelated glyphs. This is lucide's circle-check
  // tick ("m9 12 2 2 4-4"); it is NOT either of the repo's two other check
  // paths, which live in CheckItem.jsx and AssessmentControls.jsx and end at
  // different points. Do not consolidate them.
  checkCircle: <React.Fragment><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></React.Fragment>,
  // A5 starting-point cards. `users` and `shield` also exist elsewhere in the
  // repo in feather geometry (WLBodiesSection.jsx) — these are the lucide
  // drawings, matching the rest of this set. Don't cross-copy between them.
  user: <React.Fragment>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </React.Fragment>,
  users: <React.Fragment>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </React.Fragment>,
  help: <React.Fragment>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
  </React.Fragment>,
  shield: <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />,
  lock: <React.Fragment>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </React.Fragment>,
  // Block B option cards. All lucide, same as the rest of this set.
  clock: <React.Fragment><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></React.Fragment>,
  calendarCheck: <React.Fragment>
    <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" /><path d="m9 16 2 2 4-4" />
  </React.Fragment>,
  syringe: <React.Fragment>
    <path d="m18 2 4 4" /><path d="m17 7 3-3" />
    <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
    <path d="m9 11 4 4" /><path d="m5 19-3 3" /><path d="m14 4 6 6" />
  </React.Fragment>,
  pill: <React.Fragment>
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" />
  </React.Fragment>,
  droplet: <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />,
  utensils: <React.Fragment>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </React.Fragment>,
  trendingDown: <React.Fragment>
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" /><polyline points="16 17 22 17 22 11" />
  </React.Fragment>,
  batteryLow: <React.Fragment>
    <rect width="16" height="10" x="2" y="7" rx="2" ry="2" />
    <line x1="22" x2="22" y1="11" y2="13" /><line x1="6" x2="6" y1="11" y2="13" />
  </React.Fragment>,
  cloud: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />,
  target: <React.Fragment>
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </React.Fragment>,
  gauge: <React.Fragment><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></React.Fragment>,
  briefcase: <React.Fragment>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </React.Fragment>,
  dumbbell: <React.Fragment>
    <path d="M14.4 14.4 9.6 9.6" /><path d="m21.5 21.5-1.4-1.4" /><path d="M3.9 3.9 2.5 2.5" />
    <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
    <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
  </React.Fragment>,
  sun: <React.Fragment>
    <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" /><path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
  </React.Fragment>,
  flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
  waves: <React.Fragment>
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
  </React.Fragment>,
  barChart: <React.Fragment>
    <line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="16" />
  </React.Fragment>,
  // Graded pair for the interest/familiarity scales — the step down in bars is
  // the meaning, so these two must stay visually related.
  signalHigh: <React.Fragment>
    <path d="M2 20h.01" /><path d="M7 20v-4" /><path d="M12 20v-8" /><path d="M17 20V8" />
  </React.Fragment>,
  signalMid: <React.Fragment>
    <path d="M2 20h.01" /><path d="M7 20v-4" /><path d="M12 20v-8" />
  </React.Fragment>,
  // Offer-row fallbacks for the two line items that are services, not vials.
  smartphone: <React.Fragment>
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" />
  </React.Fragment>,
};

// Offer-row thumbnail. `product` resolves through the shared catalog
// (window.CHIME_PRODUCTS) by name so the vial art has exactly one home — the
// catalog file says as much. `image` is for things the catalog does not carry
// (the labs panel), and `icon` covers Coaching and App, which have no physical
// product at all; they still get a tile the same size so every row lines up.
function asmtV4OfferThumbSrc(spec) {
  if (!spec) return null;
  if (spec.image) return spec.image;
  if (spec.product) {
    const cat = window.CHIME_PRODUCTS || [];
    for (let i = 0; i < cat.length; i++) if (cat[i].name === spec.product) return cat[i].img;
  }
  return null;
}

function AsmtV4OfferThumb({ spec, label }) {
  const src = asmtV4OfferThumbSrc(spec);
  const box = {
    width: 52, height: 52, flex: "none", borderRadius: "var(--radius-md)",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden", background: "var(--color-white)",
    border: "1px solid var(--border-default)",
  };
  if (src) {
    return (
      <span style={box}>
        {/* contain, not cover: the vials are alpha cut-outs shot tall (422x800),
            so cover would crop them to a slice of glass. */}
        <img src={(window.CHIME_UPLOADS_BASE || "uploads") + "/" + src} alt=""
          decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4, boxSizing: "border-box" }} />
      </span>
    );
  }
  const icon = spec && spec.icon && ASMT_V4_ICONS[spec.icon];
  if (!icon) return null;
  return (
    <span aria-hidden="true" style={{ ...box, background: "var(--accent-subtle)", color: "var(--accent-onSubtle)", border: "none" }}>
      <Icon size={24}>{icon}</Icon>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Block-level progress — the ONLY progress indicator. Four segments, derived
// from the highest block reached; it can only ever advance (never screen
// counts, percentages, or "step X of Y").
// ---------------------------------------------------------------------------
function AsmtV4Progress({ blocks, current }) {
  return (
    <div role="img" aria-label={"Progress: " + blocks[current].title} style={{
      display: "flex", gap: "var(--spacing-2)", alignItems: "stretch",
    }}>
      {blocks.map((b, i) => {
        const reached = i <= current;
        return (
          <div key={b.id} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--spacing-1)" }}>
            <span className="asmt-v4-block-label" style={{
              fontSize: "var(--text-xs)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              color: reached ? "var(--text-default)" : "var(--text-muted)",
              fontWeight: i === current ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
            }}>{b.title}</span>
            {/* class + data-on so the accent-page rule can re-colour these:
                a reached bar is --accent-strong, which IS the accent page's
                background, so it would otherwise vanish entirely. */}
            <span aria-hidden="true" className="asmt-v4-block-bar" data-on={reached ? "1" : "0"} style={{
              height: 6, borderRadius: "var(--radius-4xl)",
              background: reached ? "var(--accent-strong)" : "var(--border-default)",
              transition: "background var(--transition-slow) var(--ease-in-out)",
            }}></span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// A1 · MultiSelectCards — card grid with an icon slot per card
// ---------------------------------------------------------------------------
// Goal-card hover, matching the homepage idiom (lift + shadow + icon pop).
// GSAP drives the transforms ONLY. The shadow half of that idiom swaps
// --shadow-xs for --shadow-md, and those tokens have different structures —
// one shadow vs two — which GSAP cannot interpolate, so shadow and border stay
// on CSS transitions. Skipped on touch (no hover), where mouseenter fires on
// tap and would leave a card stuck in its lifted state.
function asmtV4CardHover(el, entering) {
  if (!window.gsap || typeof matchMedia !== "function") return;
  if (!matchMedia("(hover: hover)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.gsap.to(el, {
    y: entering ? -4 : 0,
    duration: entering ? 0.15 : 0.2,
    ease: entering ? "power2.out" : "power2.inOut",
    overwrite: "auto",
  });
  const icon = el.querySelector("[data-card-icon]");
  if (icon) window.gsap.to(icon, {
    scale: entering ? 1.12 : 1,
    duration: entering ? 0.18 : 0.15,
    ease: entering ? "back.out(2.2)" : "power2.out",
    overwrite: "auto",
  });
}

// Animated Back/Continue. A separate component ON PURPOSE: the v1 AsmtButton
// it mirrors lives in ui_kits/assessment/AssessmentControls.jsx, which this page
// still loads and assessment.html shares, so adding motion there would change
// both. Same rest styling, so the two pages still look identical when neither
// is hovered.
function asmtV4BtnMotion(btn, fill, entering, disabled) {
  const g = window.gsap;
  if (disabled || !g || typeof matchMedia !== "function") return;
  if (!matchMedia("(hover: hover)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if (fill) g.set(fill, { scaleX: entering ? 1 : 0, transformOrigin: "left center" });
    return;
  }
  g.to(btn, {
    y: entering ? -3 : 0,
    duration: entering ? 0.15 : 0.2,
    ease: entering ? "power2.out" : "power2.inOut",
    overwrite: "auto",
  });
  // Sweeps in from the left and continues out to the right, so a quick
  // in-and-out reads as one pass rather than snapping back on itself.
  if (fill) g.to(fill, {
    scaleX: entering ? 1 : 0,
    transformOrigin: entering ? "left center" : "right center",
    duration: 0.2, ease: "power2.out", overwrite: "auto",
  });
}

// variant "onAccent" is the primary button inverted, for use on a page painted
// --accent-strong. The normal primary is --primary-default (#324563) which sits
// at roughly 1.5:1 against that background — its white label stays readable but
// the pill itself stops reading as a button. White-on-blue restores the shape.
function AsmtV4Button({ label, variant = "primary", disabled, onClick }) {
  const btnRef = React.useRef(null);
  const fillRef = React.useRef(null);
  const onAccent = variant === "onAccent";
  const primary = variant === "primary";

  const press = (down) => {
    const g = window.gsap;
    if (disabled || !g) return;
    if (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // scale and y are independent transform channels, so this rides alongside
    // the hover lift instead of cancelling it.
    g.to(btnRef.current, {
      scale: down ? 0.96 : 1,
      duration: down ? 0.08 : 0.18,
      ease: down ? "power2.out" : "back.out(3)",
      overwrite: "auto",
    });
  };

  return (
    <button ref={btnRef} type="button" disabled={disabled} onClick={onClick}
      onMouseEnter={(e) => asmtV4BtnMotion(e.currentTarget, fillRef.current, true, disabled)}
      onMouseLeave={(e) => asmtV4BtnMotion(e.currentTarget, fillRef.current, false, disabled)}
      onPointerDown={() => press(true)}
      onPointerUp={() => press(false)}
      onPointerCancel={() => press(false)}
      style={{
        position: "relative", overflow: "hidden",
        cursor: disabled ? "default" : "pointer", font: "inherit",
        background: primary ? "var(--primary-default)" : "var(--color-white)",
        color: onAccent ? "var(--accent-strong)" : primary ? "var(--text-on-primary)" : "var(--text-default)",
        border: primary || onAccent ? "1px solid transparent" : "1px solid var(--border-default)",
        borderRadius: "var(--radius-4xl)",
        padding: "var(--spacing-3) var(--spacing-8)",
        fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)",
        opacity: disabled ? "var(--opacity-disabled, 0.5)" : 1,
        boxShadow: (primary || onAccent) && !disabled ? "var(--shadow-sm)" : "none",
      }}>
      <span aria-hidden="true" ref={fillRef} style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: primary ? "var(--primary-hover)" : "var(--bg-secondary)",
        transform: "scaleX(0)", transformOrigin: "left center",
      }}></span>
      <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
    </button>
  );
}

// One goal card. Selecting it wipes a solid --accent-strong across the card
// from the left, the same fill idiom the homepage uses on its price pills.
// The label/icon colours cross-fade over the same duration rather than waiting
// for the wipe: mid-transition they land on a readable mid-tone, which is how
// the homepage pill handles the identical overlap.
// `radio` swaps the ARIA role only — A5 is single-select, but it gets the exact
// same card, fill wipe, glyph stamp and hover as A1's multi-select. Cloning the
// component for the sake of one attribute would fork two sets of tweens that
// have to stay identical.
function AsmtV4GoalCard({ o, on, onToggle, radio, blocked }) {
  const fillRef = React.useRef(null);
  const glyphRef = React.useRef(null);
  const loopRef = React.useRef(null);
  const mounted = React.useRef(false);

  React.useLayoutEffect(() => {
    const fill = fillRef.current;
    const glyph = glyphRef.current;
    const g = window.gsap;
    const reduced = typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Restored answers must not replay the wipe on mount — only a real click
    // should animate, so the first pass just sets the end state.
    const first = !mounted.current;
    mounted.current = true;

    if (!g) {
      if (fill) fill.style.transform = on ? "scaleX(1)" : "scaleX(0)";
      return;
    }
    if (fill) {
      if (reduced || first) g.set(fill, { scaleX: on ? 1 : 0, transformOrigin: "left center" });
      else g.to(fill, {
        scaleX: on ? 1 : 0, transformOrigin: "left center",
        duration: on ? 0.24 : 0.17,
        ease: on ? "power2.out" : "power2.in",
        overwrite: "auto",
      });
    }

    // The glyph, not the circle: hover already owns the circle's scale, and two
    // tweens on one property would fight (click usually happens mid-hover).
    if (!glyph) return;
    // Always retire the previous loop first — otherwise toggling a card leaves
    // an orphaned repeat:-1 tween running forever on a hidden state.
    if (loopRef.current) { loopRef.current.kill(); loopRef.current = null; }
    if (reduced) { g.set(glyph, { scale: 1, rotate: 0 }); return; }
    if (!on) {
      if (first) g.set(glyph, { scale: 1, rotate: 0 });
      else g.fromTo(glyph, { scale: 0.8 },
        { scale: 1, rotate: 0, duration: 0.15, ease: "power2.out", overwrite: "auto" });
      return;
    }
    // Selected: stamp in (real click only), then keep breathing for as long as
    // the option stays chosen. Slow and shallow on purpose — several cards can
    // be selected at once, and anything sharper turns the grid into a strobe.
    const tl = g.timeline();
    if (first) g.set(glyph, { scale: 1, rotate: 0 });
    else tl.fromTo(glyph, { scale: 0.5, rotate: -35 },
      { scale: 1, rotate: 0, duration: 0.27, ease: "back.out(2.5)", delay: 0.05 });
    tl.to(glyph, { scale: 1.08, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: -1 });
    loopRef.current = tl;
  }, [on]);

  // An infinite tween outlives its component unless killed explicitly.
  React.useEffect(() => () => { if (loopRef.current) loopRef.current.kill(); }, []);

  const colorFade = "background 0.2s var(--ease-in-out), color 0.2s var(--ease-in-out)";

  return (
    <button type="button" role={radio ? "radio" : "checkbox"} aria-checked={on} disabled={blocked}
      className="asmt-v4-card"
      onClick={onToggle}
      onMouseEnter={(e) => !blocked && asmtV4CardHover(e.currentTarget, true)}
      onMouseLeave={(e) => !blocked && asmtV4CardHover(e.currentTarget, false)}
      style={{
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: "var(--spacing-3)",
        textAlign: "center", cursor: blocked ? "default" : "pointer", font: "inherit",
        opacity: blocked ? "var(--opacity-disabled, 0.5)" : 1,
        // An icon-less card is mostly empty at 150px, so it takes a shorter
        // box. Grid rows stretch, so every card in a row still matches.
        minHeight: o.icon ? 150 : 92,
        background: "var(--color-white)",
        border: on ? "2px solid var(--accent-strong)" : "1px solid var(--border-default)",
        padding: on ? "calc(var(--spacing-5) - 1px)" : "var(--spacing-5)",
        borderRadius: "var(--radius-lg)",
        transition: "border-color var(--transition-base) var(--ease-in-out), box-shadow var(--transition-base) var(--ease-in-out)",
      }}>
      <span aria-hidden="true" ref={fillRef} style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "var(--accent-strong)",
        transform: "scaleX(0)", transformOrigin: "left center",
      }}></span>
      {o.icon &&
        <span aria-hidden="true" data-card-icon="1" style={{
          position: "relative", zIndex: 1,
          width: 48, height: 48, flex: "none", borderRadius: "50%",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: on ? "var(--color-white)" : "var(--bg-secondary)",
          color: "var(--accent-strong)",
          transition: colorFade,
        }}>
          <span ref={glyphRef} data-card-glyph="1" style={{ display: "inline-flex" }}>
            <Icon size={24}>{ASMT_V4_ICONS[o.icon]}</Icon>
          </span>
        </span>}
      <span style={{
        position: "relative", zIndex: 1,
        fontSize: "var(--text-base)", lineHeight: 1.4, textWrap: "balance",
        color: on ? "var(--text-on-primary)" : "var(--text-default)",
        fontWeight: on ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
        transition: colorFade,
      }}>{o.value}</span>
    </button>
  );
}

// Options may be plain strings or {value, icon}. Screens whose options denote a
// thing (a goal, a medication) carry icons; scales like "Very interested /
// Somewhat interested" do not, because any glyph there would be decoration
// standing in for meaning the copy does not have. Normalising here lets those
// screens keep their bare string options untouched.
function asmtV4NormOption(o) { return typeof o === "string" ? { value: o } : o; }

function AsmtV4MultiSelectCards({ options, value, onToggle, max, labelledBy }) {
  const picked = value || [];
  const full = max && picked.length >= max;
  return (
    <div>
      {max &&
        <p style={{ margin: "0 0 var(--spacing-3)", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
          Choose up to {max}.
        </p>}
      <div className="asmt-v4-cards" role="group" aria-labelledby={labelledBy} style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-3)",
      }}>
        {options.map(asmtV4NormOption).map((o) => (
          <AsmtV4GoalCard key={o.value} o={o}
            on={picked.indexOf(o.value) >= 0}
            blocked={picked.indexOf(o.value) < 0 && full}
            onToggle={() => onToggle(o.value)} />
        ))}
      </div>
    </div>
  );
}

// A5 · the same grid, single-select. radiogroup rather than group, and picking
// replaces the answer instead of toggling it.
function AsmtV4SingleSelectCards({ options, value, onSelect, labelledBy }) {
  return (
    <div className="asmt-v4-cards" role="radiogroup" aria-labelledby={labelledBy} style={{
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-3)",
    }}>
      {options.map(asmtV4NormOption).map((o) => (
        <AsmtV4GoalCard key={o.value} o={o} radio
          on={value === o.value}
          onToggle={() => onSelect(o.value)} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// A2 · MultiSelectCheckboxes ("None of the above" exclusivity lives in the flow)
// ---------------------------------------------------------------------------
function AsmtV4Checkboxes({ options, value, onToggle, labelledBy }) {
  return (
    <div role="group" aria-labelledby={labelledBy} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
      {options.map((opt) => (
        <AsmtOptionRow key={opt} kind="checkbox" label={opt}
          checked={(value || []).indexOf(opt) >= 0} onToggle={() => onToggle(opt)} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MultiSelectChips (A4 + Block B multi-selects; supports the B1.5 max limit)
// ---------------------------------------------------------------------------
// Arrival sweep pacing. The base delay clears the screen's own 0.5s slide-in
// (AssessmentV4Flow.jsx) so the two motions read as a sequence, not a pile-up;
// the stagger is small because A5-sized option sets run to 9 pills and anything
// slower leaves the last one still washing after the user has started reading.
const ASMT_V4_PILL_DELAY = 0.1;
const ASMT_V4_PILL_STAGGER = 0.03;

// A pill in the A1 goal-card interaction model — GSAP fill, hover lift, colour
// inversion — with two deliberate differences:
//   - the fill runs bottom-to-top rather than left-to-right;
//   - on arrival the pills themselves rise into place, staggered.
function AsmtV4PillCard({ label, on, blocked, index, onToggle }) {
  const btnRef = React.useRef(null);
  const fillRef = React.useRef(null);
  const mounted = React.useRef(false);
  const reduced = typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Arrival. Mount-only by design: the flow keys the screen wrapper on
  // screenId, so a remount IS "the user just arrived at this screen".
  React.useLayoutEffect(() => {
    const el = btnRef.current;
    if (!window.gsap || !el || reduced) return;
    // from() renders its start state immediately (immediateRender), so the pill
    // is already down and hidden on the first frame — the stagger delay cannot
    // leak a flash of the settled row.
    // clearProps matters here: hover tweens this same `y`, so the entrance has
    // to hand the element back with no inline transform of its own.
    const tween = window.gsap.from(el, {
      y: 26, autoAlpha: 0, duration: 0.27, ease: "power2.out",
      delay: ASMT_V4_PILL_DELAY + index * ASMT_V4_PILL_STAGGER,
      clearProps: "transform,opacity,visibility",
    });
    return () => tween.kill();
  }, []);

  // Selection fill — same "don't replay on mount" rule as AsmtV4GoalCard, so a
  // restored answer renders already-filled instead of animating itself in.
  React.useLayoutEffect(() => {
    const fill = fillRef.current;
    const g = window.gsap;
    const first = !mounted.current;
    mounted.current = true;
    if (!fill) return;
    if (!g) { fill.style.transform = on ? "scaleY(1)" : "scaleY(0)"; return; }
    if (reduced || first) g.set(fill, { scaleY: on ? 1 : 0, transformOrigin: "center bottom" });
    else g.to(fill, {
      scaleY: on ? 1 : 0, transformOrigin: "center bottom",
      duration: on ? 0.2 : 0.15,
      ease: on ? "power2.out" : "power2.in",
      overwrite: "auto",
    });
  }, [on]);

  return (
    <button type="button" ref={btnRef} role="checkbox" aria-checked={on} disabled={blocked}
      className="asmt-v4-card"
      onClick={onToggle}
      onMouseEnter={(e) => !blocked && asmtV4CardHover(e.currentTarget, true)}
      onMouseLeave={(e) => !blocked && asmtV4CardHover(e.currentTarget, false)}
      style={{
        position: "relative", overflow: "hidden",
        cursor: blocked ? "default" : "pointer", font: "inherit", minHeight: 56,
        background: "var(--color-white)",
        // 1px in both states, unlike the goal card's 2px-when-selected: pills
        // sit in a wrapping flex row, so a border that changes width reflows
        // every pill after it.
        border: "1px solid " + (on ? "var(--accent-strong)" : "var(--border-strong)"),
        borderRadius: "var(--radius-4xl)",
        padding: "var(--spacing-3) var(--spacing-6)",
        fontSize: "var(--text-lg)", lineHeight: 1.4,
        opacity: blocked ? "var(--opacity-disabled, 0.5)" : 1,
        transition: "border-color var(--transition-base) var(--ease-in-out), box-shadow var(--transition-base) var(--ease-in-out)",
      }}>
      <span aria-hidden="true" ref={fillRef} style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "var(--accent-strong)",
        transform: "scaleY(0)", transformOrigin: "center bottom",
      }}></span>
      <span style={{
        position: "relative", zIndex: 1,
        color: on ? "var(--text-on-primary)" : "var(--text-default)",
        fontWeight: on ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
        transition: "color 0.2s var(--ease-in-out)",
      }}>{label}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Bubble variant — opt in per screen with `bubbles` in the config. Same
// control, same interaction model; the silhouette is a circle and the motion is
// soda. Still opt-in rather than the default for `chips`, because a circle has
// to fit its label inside an inscribed chord — the group diameter is dictated
// by the longest option, so a screen of long options means very large discs.
// ---------------------------------------------------------------------------

// Deterministic per-index jitter. Bubbles have to look uncorrelated, but the
// values must survive a re-render — a fresh Math.random() on every state change
// would make the whole glass twitch on each click.
function asmtV4BubbleRnd(index, salt) {
  const x = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Uniform circles per screen (user call, 2026-08-06): every bubble in a group
// takes ONE diameter, sized by the screen's most demanding label, and one
// 20px (--text-xl) font. The earlier varied-size ladder is gone — the need
// function below still grades by length, but only the group MAX is used.
//
// The longest-word floor stays: total length is the wrong measure for a single
// unbreakable word ("Skin health" and "Performance" are both 11 characters,
// but only the first can wrap). ~11px per glyph at 20px; dividing by 0.72
// rather than the true 0.76 content ratio leaves slack past the 12% padding.
function asmtV4BubbleNeed(label) {
  const n = label.length;
  let d;
  if (n <= 7) d = 116;
  else if (n <= 12) d = 144;
  else if (n <= 24) d = 176;
  else if (n <= 36) d = 212;
  else if (n <= 52) d = 240;
  else d = 272;
  const longest = label.split(/\s+/).reduce((m, w) => (w.length > m ? w.length : m), 0);
  return Math.max(d, Math.ceil(longest * 11 / 0.72));
}

function asmtV4BubbleGroupDiameter(options) {
  let d = 0;
  for (let i = 0; i < options.length; i++) {
    const o = options[i];
    const need = asmtV4BubbleNeed(typeof o === "string" ? o : o.value);
    if (need > d) d = need;
  }
  return d;
}

// `radio` swaps the ARIA role only, exactly as on AsmtV4GoalCard — a bubble
// behaves identically whether the screen takes one answer or many.
function AsmtV4BubbleCard({ label, on, blocked, index, onToggle, radio, diameter }) {
  const wrapRef = React.useRef(null);
  const fillRef = React.useRef(null);
  const mounted = React.useRef(false);
  const reduced = typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Rise, then drift. Both live on the WRAPPER, never the button: the hover
  // lift tweens the button's y with overwrite:"auto", and an idle loop sharing
  // that property would be killed on first hover and never restart.
  React.useLayoutEffect(() => {
    const el = wrapRef.current;
    const g = window.gsap;
    if (!g || !el || reduced) return;
    const r1 = asmtV4BubbleRnd(index, 1);
    const r2 = asmtV4BubbleRnd(index, 2);
    const r3 = asmtV4BubbleRnd(index, 3);
    const tl = g.timeline({ delay: index * 0.045 + r1 * 0.12 });
    // Up from below the glass, small and faint — a bubble breaking the surface.
    tl.from(el, {
      y: 150 + r2 * 90, autoAlpha: 0, scale: 0.7,
      duration: 0.55 + r1 * 0.3, ease: "power2.out",
    })
    // Then it just hangs and drifts. Each bubble gets its own period and
    // amplitude so the group never pulses in unison, which is the tell that
    // separates "carbonation" from "everything bobbing on one timer".
    .to(el, {
      y: -(7 + r3 * 8), x: (r2 - 0.5) * 14,
      duration: 2.2 + r1 * 1.6, ease: "sine.inOut",
      yoyo: true, repeat: -1,
    });
    return () => tl.kill();
  }, []);

  // Selection fill — bottom-to-top, same rule as the pill: no replay on mount,
  // so a restored answer renders already-filled.
  React.useLayoutEffect(() => {
    const fill = fillRef.current;
    const g = window.gsap;
    const first = !mounted.current;
    mounted.current = true;
    if (!fill) return;
    if (!g) { fill.style.transform = on ? "scaleY(1)" : "scaleY(0)"; return; }
    if (reduced || first) g.set(fill, { scaleY: on ? 1 : 0, transformOrigin: "center bottom" });
    else g.to(fill, {
      scaleY: on ? 1 : 0, transformOrigin: "center bottom",
      duration: on ? 0.2 : 0.15,
      ease: on ? "power2.out" : "power2.in",
      overwrite: "auto",
    });
  }, [on]);

  return (
    <div ref={wrapRef} style={{ display: "inline-flex" }}>
      <button type="button" role={radio ? "radio" : "checkbox"} aria-checked={on} disabled={blocked}
        className="asmt-v4-card asmt-v4-bubble"
        onClick={onToggle}
        onMouseEnter={(e) => !blocked && asmtV4CardHover(e.currentTarget, true)}
        onMouseLeave={(e) => !blocked && asmtV4CardHover(e.currentTarget, false)}
        style={{
          // Diameter and type size both ride custom properties so a media query
          // can rescale the whole set without this file knowing about viewports.
          // They need SEPARATE factors: shrinking the circle without shrinking
          // the label is what pushed "Confidence" onto its own border at 390px.
          "--bubble-d": diameter + "px",
          // No selection growth (user call, 2026-08-06 — it fought the uniform
          // group size): selection reads through the fill wipe and inverted
          // label alone, and every circle keeps the group diameter at all
          // times. The FLIP field above stays — it still animates reflows from
          // wrapping changes, and simply never fires when nothing moves.
          width: "calc(var(--bubble-d) * var(--bubble-scale, 1))",
          height: "calc(var(--bubble-d) * var(--bubble-scale, 1))",
          flex: "none", position: "relative", overflow: "hidden",
          borderRadius: "50%", boxSizing: "border-box",
          display: "flex", alignItems: "center", justifyContent: "center",
          textAlign: "center", cursor: blocked ? "default" : "pointer", font: "inherit",
          background: "var(--color-white)",
          border: "1px solid " + (on ? "var(--accent-strong)" : "var(--border-strong)"),
          // Percentage padding keeps the text inside the inscribed square at
          // every diameter, including the rescaled mobile one.
          padding: "0 12%",
          fontSize: "calc(var(--text-xl) * var(--bubble-font-scale, 1))",
          lineHeight: 1.3,
          opacity: blocked ? "var(--opacity-disabled, 0.5)" : 1,
          transition: "border-color var(--transition-base) var(--ease-in-out), box-shadow var(--transition-base) var(--ease-in-out)",
        }}>
        <span aria-hidden="true" ref={fillRef} style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "var(--accent-strong)",
          transform: "scaleY(0)", transformOrigin: "center bottom",
        }}></span>
        <span style={{
          position: "relative", zIndex: 1, textWrap: "balance",
          color: on ? "var(--text-on-primary)" : "var(--text-default)",
          fontWeight: on ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
          transition: "color 0.2s var(--ease-in-out)",
        }}>{label}</span>
      </button>
    </div>
  );
}

// The bubble field owns the FLIP pass. Selecting a bubble changes its diameter,
// which reflows the whole wrapping row; without this the neighbours would
// teleport to their new places. Instead they animate there.
//
// Each bubble therefore sits under THREE transform layers, one per owner, so no
// two tweens ever contend for the same property:
//   slot   (here)             — FLIP: x/y/scale, on layout change
//   wrapper (AsmtV4BubbleCard) — arrival rise + idle drift: x/y, forever
//   button  (AsmtV4BubbleCard) — hover lift: y, on pointer
// `single` switches the field between multi-select (a `group` of checkboxes,
// `picked` is an array) and single-select (a `radiogroup`, `value` is a string).
// Everything else — sizing, rise, drift, FLIP — is shared, so a scale screen
// and a multi-select screen are the same object to the eye.
function AsmtV4BubbleField({ options, picked, value, full, single, onPick, labelledBy }) {
  const diameter = asmtV4BubbleGroupDiameter(options);
  const rootRef = React.useRef(null);
  const prev = React.useRef(null);
  const reduced = typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  // No dependency array on purpose: any render can change the layout, and the
  // comparison against the previous geometry is what decides whether to move.
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const slots = Array.prototype.slice.call(root.children);
    const now = new Map();
    // offsetLeft/offsetTop, not getBoundingClientRect: the inner wrapper is
    // mid-drift on every frame, and rect would fold that wobble into the
    // measurement. Offsets are pure layout and ignore transforms entirely.
    // Subtracting the root's own offsets keeps this about movement WITHIN the
    // field, so a field that shifts as a whole doesn't animate every bubble.
    slots.forEach((s) => now.set(s.dataset.k, {
      x: s.offsetLeft - root.offsetLeft,
      y: s.offsetTop - root.offsetTop,
      w: s.offsetWidth,
    }));
    const before = prev.current;
    prev.current = now;
    if (!before || !window.gsap || reduced) return;
    slots.forEach((s) => {
      const b = before.get(s.dataset.k);
      const n = now.get(s.dataset.k);
      if (!b || !n || !n.w) return;
      const dx = b.x - n.x, dy = b.y - n.y, sc = b.w / n.w;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(sc - 1) < 0.01) return;
      window.gsap.fromTo(s, { x: dx, y: dy, scale: sc },
        { x: 0, y: 0, scale: 1, duration: 0.3, ease: "power3.out",
          overwrite: "auto", clearProps: "transform" });
    });
  });

  return (
    <div ref={rootRef} role={single ? "radiogroup" : "group"} aria-labelledby={labelledBy} style={{
      display: "flex", flexWrap: "wrap", gap: "var(--spacing-3)",
      alignItems: "center", justifyContent: "center",
    }}>
      {options.map((opt, i) => (
        <div key={opt} data-k={opt} style={{ display: "inline-flex" }}>
          <AsmtV4BubbleCard label={opt} index={i} radio={single} diameter={diameter}
            on={single ? value === opt : picked.indexOf(opt) >= 0}
            blocked={!single && picked.indexOf(opt) < 0 && full}
            onToggle={() => onPick(opt)} />
        </div>
      ))}
    </div>
  );
}

function AsmtV4Chips({ options, value, onToggle, max, bubbles, labelledBy }) {
  const picked = value || [];
  const full = max && picked.length >= max;
  return (
    <div>
      {max ?
        <p style={{ margin: "0 0 var(--spacing-3)", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
          Choose up to {max}.
        </p>
      : bubbles ?
        // Multi-select legend for the bubble screens; centred because the
        // field itself centres. A capped screen keeps the more specific
        // "Choose up to N." note instead — never both.
        <p style={{ margin: "0 0 var(--spacing-4)", textAlign: "center", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
          Choose all the options that apply to you
        </p>
      : null}
      {bubbles
        ? <AsmtV4BubbleField options={options} picked={picked} full={full} onPick={onToggle} labelledBy={labelledBy} />
        : <div role="group" aria-labelledby={labelledBy} style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-2)" }}>
            {options.map((opt, i) => (
              <AsmtV4PillCard key={opt} label={opt} index={i}
                on={picked.indexOf(opt) >= 0}
                blocked={picked.indexOf(opt) < 0 && full}
                onToggle={() => onToggle(opt)} />
            ))}
          </div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SingleSelectList (A5, B-block single-selects) + DynamicSingleSelect (B1.4)
// ---------------------------------------------------------------------------
// `bubbles` routes the whole single-select family — list, dynlist, listFree and
// the yes/no gate all reach the field through here or through a component that
// forwards the flag, so one prop keeps every scale screen on the same visual.
function AsmtV4SingleSelectList({ options, value, onSelect, bubbles, cards, labelledBy }) {
  if (cards) return <AsmtV4SingleSelectCards options={options} value={value} onSelect={onSelect} labelledBy={labelledBy} />;
  if (bubbles) return <AsmtV4BubbleField options={options} value={value} single onPick={onSelect} labelledBy={labelledBy} />;
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
      {options.map((opt) => (
        <AsmtOptionRow key={opt} kind="radio" label={opt}
          checked={value === opt} onToggle={() => onSelect(opt)} />
      ))}
    </div>
  );
}

// B1.4 — options injected from config based on the B1.3 answer.
function AsmtV4DynamicSingleSelect({ ladders, dependsOn, value, onSelect, bubbles, cards, labelledBy }) {
  const options = ladders[dependsOn] || [];
  return <AsmtV4SingleSelectList options={options} value={value} onSelect={onSelect} bubbles={bubbles} cards={cards} labelledBy={labelledBy} />;
}

// ---------------------------------------------------------------------------
// B1.2 · YesNoGate — two large targets
// ---------------------------------------------------------------------------
function AsmtV4YesNoGate({ options, value, onSelect, bubbles, labelledBy }) {
  if (bubbles) return <AsmtV4BubbleField options={options} value={value} single onPick={onSelect} labelledBy={labelledBy} />;
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} style={{ display: "flex", gap: "var(--spacing-3)" }}>
      {options.map((opt) => {
        const on = value === opt;
        return (
          <button key={opt} type="button" role="radio" aria-checked={on}
            onClick={() => onSelect(opt)}
            style={{
              flex: 1, cursor: "pointer", font: "inherit", minHeight: 56,
              background: on ? "var(--accent-strong)" : "var(--color-white)",
              color: on ? "var(--color-white)" : "var(--text-default)",
              border: "1px solid " + (on ? "var(--accent-strong)" : "var(--border-strong)"),
              borderRadius: "var(--radius-lg)",
              fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-semibold)",
              transition: "background var(--transition-base) var(--ease-in-out), color var(--transition-base) var(--ease-in-out)",
            }}>{opt}</button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// B1.3 · SingleSelectWithFreeText — "Others" reveals a text field
// ---------------------------------------------------------------------------
function AsmtV4SingleSelectWithFreeText({ options, freeValue, value, freeText, onSelect, onFreeText, bubbles, cards, labelledBy }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
      <AsmtV4SingleSelectList options={options} value={value} onSelect={onSelect} bubbles={bubbles} cards={cards} labelledBy={labelledBy} />
      {value === freeValue &&
        <AsmtV4Field id="asmt-v4-b13-other" label="Please tell us which medication" value={freeText}
          onChange={onFreeText} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// A3 · field primitives with inline validation (kind tone, on blur/change)
// ---------------------------------------------------------------------------
function AsmtV4Field({ id, label, type = "text", value, placeholder, inputMode, error, onChange, onBlur, autoComplete, required }) {
  const [focus, setFocus] = React.useState(false);
  const errId = id + "-error";
  return (
    <div>
      <AsmtFieldLabel text={label} htmlFor={id} />
      <input id={id} type={type} value={value || ""} placeholder={placeholder} inputMode={inputMode}
        autoComplete={autoComplete}
        // aria-required, not the `required` attribute: validation is ours and
        // runs on Continue, so the native bubble would fire first and in a
        // different voice. This only tells AT which fields are mandatory —
        // the visible cue is the "(optional)" suffix on the one that isn't.
        aria-required={required ? "true" : undefined}
        aria-invalid={error ? "true" : undefined} aria-describedby={error ? errId : undefined}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => { setFocus(false); if (onBlur) onBlur(); }}
        style={{ ...ASMT_V4_INPUT, ...asmtV4FocusStyle(focus, !!error) }} />
      {error &&
        <p id={errId} style={{ margin: "var(--spacing-1) 0 0", fontSize: "var(--text-xs)", lineHeight: 1.4, color: "var(--error-default)" }}>
          {error}
        </p>}
    </div>
  );
}

function AsmtV4Select({ id, label, value, options, placeholder, error, onChange, onBlur, autoComplete, required }) {
  const [focus, setFocus] = React.useState(false);
  const errId = id + "-error";
  return (
    <div>
      <AsmtFieldLabel text={label} htmlFor={id} />
      <select id={id} value={value || ""} autoComplete={autoComplete}
        aria-required={required ? "true" : undefined}
        aria-invalid={error ? "true" : undefined} aria-describedby={error ? errId : undefined}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => { setFocus(false); if (onBlur) onBlur(); }}
        style={{
          ...ASMT_V4_INPUT, ...asmtV4FocusStyle(focus, !!error),
          color: value ? "var(--text-default)" : "var(--text-muted)",
        }}>
        <option value="" disabled>{placeholder || "Select an option"}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error &&
        <p id={errId} style={{ margin: "var(--spacing-1) 0 0", fontSize: "var(--text-xs)", lineHeight: 1.4, color: "var(--error-default)" }}>
          {error}
        </p>}
    </div>
  );
}

// Contact/shipping group — a SELF-CONTAINED sub-component (email, phone,
// street address, apartment, city, ZIP, state) so it can be relocated later
// in the flow without touching routing. Rendered inside A3 for now — do NOT
// relocate it; the document places it here.
function AsmtV4ContactShippingFields({ value, errors, onField, onBlur, states }) {
  const d = value || {}, e = errors || {};
  return (
    <React.Fragment>
      <div style={{ gridColumn: "1 / -1" }}>
        <AsmtV4Field id="asmt-v4-email" label="Email" type="email" autoComplete="email" required
          value={d.email} error={e.email} onChange={(v) => onField("email", v)} onBlur={() => onBlur("email")} />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <AsmtV4Field id="asmt-v4-phone" label="Phone" type="tel" inputMode="tel" autoComplete="tel" required
          value={d.phone} error={e.phone} onChange={(v) => onField("phone", v)} onBlur={() => onBlur("phone")} />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <AsmtV4Field id="asmt-v4-address1" label="Street address" autoComplete="address-line1" required
          value={d.address1} error={e.address1} onChange={(v) => onField("address1", v)} onBlur={() => onBlur("address1")} />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <AsmtV4Field id="asmt-v4-address2" label="Apartment, suite, unit (optional)" autoComplete="address-line2"
          value={d.address2} error={e.address2} onChange={(v) => onField("address2", v)} onBlur={() => onBlur("address2")} />
      </div>
      <AsmtV4Field id="asmt-v4-city" label="City" autoComplete="address-level2" required
        value={d.city} error={e.city} onChange={(v) => onField("city", v)} onBlur={() => onBlur("city")} />
      <AsmtV4Field id="asmt-v4-zip" label="ZIP code" inputMode="numeric" autoComplete="postal-code" required
        value={d.zip} error={e.zip} onChange={(v) => onField("zip", v)} onBlur={() => onBlur("zip")} />
      <div style={{ gridColumn: "1 / -1" }}>
        <AsmtV4Select id="asmt-v4-state" label="What state will your medication be shipped to?"
          placeholder="Select a state" options={states} autoComplete="address-level1" required
          value={d.state} error={e.state} onChange={(v) => onField("state", v)} onBlur={() => onBlur("state")} />
      </div>
    </React.Fragment>
  );
}

// A3 · ContactFields — identity fields + the movable contact/shipping group.
// Height and weight are NOT here — they live in A6. Sex is no longer here
// either: it became its own screen (A2G) so the pregnancy question could sit
// directly after it, per the client's request.
function AsmtV4ContactFields({ value, errors, onField, onBlur, states, maskDob }) {
  const d = value || {}, e = errors || {};
  return (
    <div className="asmt-v4-grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-4)" }}>
      <AsmtV4Field id="asmt-v4-first" label="First name" autoComplete="given-name" required
        value={d.firstName} error={e.firstName} onChange={(v) => onField("firstName", v)} onBlur={() => onBlur("firstName")} />
      <AsmtV4Field id="asmt-v4-last" label="Last name" autoComplete="family-name" required
        value={d.lastName} error={e.lastName} onChange={(v) => onField("lastName", v)} onBlur={() => onBlur("lastName")} />

      <AsmtV4ContactShippingFields value={d} errors={e} onField={onField} onBlur={onBlur} states={states} />

      <AsmtV4Field id="asmt-v4-dob" label="Date of Birth" placeholder="MM/DD/YYYY" inputMode="numeric"
        autoComplete="bday" required
        value={d.dob} error={e.dob} onChange={(v) => onField("dob", maskDob(v))} onBlur={() => onBlur("dob")} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// A6 · SnapshotCalculator — weight/height with a live, aria-live result region.
// The region shows the tier's headline + message ONLY — never a number, never
// a label. Tier "flag" renders nothing here (A6P handles it).
// ---------------------------------------------------------------------------
function AsmtV4Snapshot({ value, onField, content, problem, onBlur }) {
  const d = value || {};
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
      <div className="asmt-v4-grid3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--spacing-4)" }}>
        {/* onBlur, so the range check waits for a finished number. Judged per
            keystroke it fires on the way INTO a valid answer — typing 210
            reads "1" then "21", both outside 50–700 — and the panel below is
            aria-live, so a screen reader announced that twice per entry.
            The group name goes with it: height and weight gate separately, so
            finishing one cannot open the gate on the other. */}
        <AsmtV4Field id="asmt-v4-ft" label="Height (feet)" type="number" inputMode="numeric" placeholder="5" required
          value={d.heightFt} onChange={(v) => onField("heightFt", v)} onBlur={() => onBlur && onBlur("height")} />
        <AsmtV4Field id="asmt-v4-in" label="Height (inches)" type="number" inputMode="numeric" placeholder="6" required
          value={d.heightIn} onChange={(v) => onField("heightIn", v)} onBlur={() => onBlur && onBlur("height")} />
        <AsmtV4Field id="asmt-v4-lbs" label="Weight (lbs)" type="number" inputMode="numeric" placeholder="180" required
          value={d.weightLbs} onChange={(v) => onField("weightLbs", v)} onBlur={() => onBlur && onBlur("weight")} />
      </div>
      <div aria-live="polite" style={{ minHeight: 44 }}>
        {problem &&
          <p style={{
            margin: 0, fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text-default)",
            background: "var(--warning-subtle)", borderRadius: "var(--radius-md)",
            padding: "var(--spacing-3) var(--spacing-4)",
          }}>{problem}</p>}
        {!problem && content &&
          <div style={{
            background: "var(--accent-subtle)", borderRadius: "var(--radius-lg)",
            padding: "var(--spacing-5) var(--spacing-5)",
            display: "flex", flexDirection: "column", gap: "var(--spacing-2)",
          }}>
            <p style={{
              margin: 0, fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-semibold)",
              fontFamily: "var(--font-family-display, var(--font-family-base))", color: "var(--accent-onSubtle)",
            }}>{content.headline}</p>
            <p style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: 1.6, color: "var(--text-default)" }}>
              {content.message}
            </p>
          </div>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ✦ · PhraseScreen — full-bleed statement + single CTA, sand background,
// no inputs. (Bleed is container-wide, not viewport-wide, on purpose: a
// 100vw bleed re-opens the horizontal-scroll trap this repo has already
// been burned by.)
// ---------------------------------------------------------------------------
// `accent` is for screens that repaint the whole page (pageAccent in the
// config). The panel drops its own background entirely rather than picking a
// second blue: the point of those screens is one uninterrupted field of colour,
// and a tinted card would just re-draw the edge this is meant to remove. Its
// text has to invert with it — dark-on-sand becomes unreadable on the blue.
function AsmtV4Phrase({ title, supportingLine, cta, onCta, headingRef, copyNeeded, accent, image, imageAlt, imageCutout }) {
  const mediaRef = React.useRef(null);

  // The photo is the one element on this screen that is new rather than moved,
  // so it gets its own gentle reveal on top of the screen's slide-in. Settling
  // out of a slight over-scale reads as the image arriving, not sliding.
  React.useLayoutEffect(() => {
    const el = mediaRef.current;
    if (!el || !window.gsap) return;
    if (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = window.gsap.from(el, {
      autoAlpha: 0, scale: 1.06, duration: 0.55, ease: "power2.out", delay: 0.1,
      clearProps: "transform,opacity,visibility",
    });
    return () => tween.kill();
  }, [image]);

  const heading = (
    <h2 ref={headingRef} tabIndex={-1} style={{
      margin: 0, maxWidth: "16em", outline: "none",
      fontSize: "var(--text-4xl)", fontWeight: 400, lineHeight: 1.15,
      fontFamily: "var(--font-family-display, var(--font-family-base))",
      color: accent ? "var(--color-white)" : "var(--text-default)",
    }}>{title}</h2>
  );
  const support = supportingLine && (
    <p style={{
      margin: 0, maxWidth: "30em", fontSize: "var(--text-lg)", lineHeight: 1.6,
      color: accent ? "var(--color-white)" : "var(--text-secondary)",
      opacity: accent ? 0.92 : 1,
    }}>{supportingLine}</p>
  );
  const flag = copyNeeded && (
    <p style={{
      margin: 0, fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)",
      letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--warning-default)",
    }}>Placeholder copy — pending copy team</p>
  );
  const button = cta && <AsmtV4Button label={cta} variant={accent ? "onAccent" : "primary"} onClick={onCta} />;

  const shell = {
    background: accent ? "transparent" : "var(--bg-secondary)",
    borderRadius: "var(--radius-3xl)",
    minHeight: "46vh", padding: "var(--spacing-16) var(--spacing-6)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    textAlign: "center", gap: "var(--spacing-5)",
  };

  // No image — the original centred stack, unchanged.
  if (!image) {
    return (
      <div style={shell}>
        {flag}{heading}{support}{button}
      </div>
    );
  }

  // With an image the screen becomes a two-column composition. Copy sits LEFT
  // and the photo RIGHT on purpose: the subject is looking down and to her
  // left, so from that side her gaze falls into the message rather than off
  // the edge of the screen. On narrow viewports the columns stack and the
  // photo takes the lead (see .asmt-v4-phrase-media order in chimeAssessment.html)
  // — the mood should land before the words on a phone.
  return (
    <div style={{ ...shell, padding: "var(--spacing-10) var(--spacing-2)", display: "block" }}>
      <div className="asmt-v4-phrase-split">
        <div className="asmt-v4-phrase-copy">
          {flag}{heading}{support}{button}
        </div>
        <div className="asmt-v4-phrase-media" ref={mediaRef}>
          {/* imageCutout is for sources with an alpha channel rather than a
              full-bleed scene. `cover` would crop into the subject, so contain
              it and let it float on the page — no card at all.

              The card treatment is all-or-nothing here, which is why several
              properties move together: a radius and a shadow are drawn on the
              element BOX, not on the visible pixels, so keeping either one
              without a ground would outline a rectangle of mostly-transparent
              image. The padding goes with them — it only existed to inset the
              subject from the white card's edge, and there is no edge now. */}
          <img src={(window.CHIME_UPLOADS_BASE || "uploads") + "/" + image} alt={imageAlt || ""}
            decoding="async" style={{
              display: "block", width: "100%", aspectRatio: "3 / 4", boxSizing: "border-box",
              objectFit: imageCutout ? "contain" : "cover",
              borderRadius: imageCutout ? undefined : "var(--radius-3xl)",
              boxShadow: imageCutout ? undefined : "var(--shadow-lg, var(--shadow-md))",
            }} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// C1/C2/C3 · PlaceholderSection — a slot component the live fields will drop
// into; clearly labeled, no content changes.
// ---------------------------------------------------------------------------
function AsmtV4Placeholder({ note, children }) {
  return (
    <div style={{
      border: "2px dashed var(--border-strong)", borderRadius: "var(--radius-xl)",
      background: "var(--color-white)", minHeight: 220,
      padding: "var(--spacing-8) var(--spacing-6)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      textAlign: "center", gap: "var(--spacing-3)",
    }}>
      <p style={{
        margin: 0, fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)",
        letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)",
      }}>Placeholder — existing content, unchanged</p>
      <p style={{ margin: 0, maxWidth: "32em", fontSize: "var(--text-base)", lineHeight: 1.6, color: "var(--text-secondary)" }}>
        {note}
      </p>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// A2F · the eligibility fork — warm message + two path choices
// ---------------------------------------------------------------------------
function AsmtV4Fork({ choices, onChoose }) {
  return (
    <div className="asmt-v4-grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-3)" }}>
      {choices.map((c) => (
        <button key={c.value} type="button" onClick={() => onChoose(c.value)}
          style={{
            cursor: "pointer", font: "inherit", minHeight: 56,
            background: "var(--color-white)", color: "var(--text-default)",
            border: "1px solid var(--border-strong)", borderRadius: "var(--radius-lg)",
            padding: "var(--spacing-4) var(--spacing-5)",
            fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)",
            transition: "background var(--transition-base) var(--ease-in-out)",
          }}>{c.label}</button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// D · ResultScreen — primary recommendation, "Why This Path May Fit",
// Next Steps, Offer (first pricing in the flow), final CTA.
// ---------------------------------------------------------------------------
function AsmtV4Result({ rec, headingRef, onCreateAccount }) {
  const thumbs = (window.CHIME_ASSESSMENT_V4 && window.CHIME_ASSESSMENT_V4.offerThumbs) || {};
  const card = {
    background: "var(--color-white)", border: "1px solid var(--border-default)",
    borderRadius: "var(--radius-xl)", padding: "var(--spacing-6)",
    display: "flex", flexDirection: "column", gap: "var(--spacing-4)",
  };
  const sectionTag = {
    margin: 0, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)",
    letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-5)" }}>

      {/* 1 · Primary Recommendation */}
      <div style={{ ...card, alignItems: "center", textAlign: "center", padding: "var(--spacing-10) var(--spacing-6)" }}>
        <p style={{
          margin: 0, fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)",
          letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent-strong)",
        }}>Your Health Path</p>
        <h2 ref={headingRef} tabIndex={-1} style={{
          margin: 0, outline: "none", fontSize: "var(--text-4xl)", fontWeight: 400, lineHeight: 1.15,
          fontFamily: "var(--font-family-display, var(--font-family-base))", color: "var(--text-default)",
        }}>{rec.headline}</h2>
      </div>

      {/* 2 · Why This Path May Fit */}
      <div style={card}>
        <p style={sectionTag}>Why This Path May Fit</p>
        {/* One small card per reason, in the A1 goal-card idiom: same grid,
            same radius, medallion above a centred label. Solid --accent-strong
            rather than white — these are the affirming half of the result, and
            a filled card reads as a conclusion rather than another choice.
            Static by design: no fill wipe or hover, because nothing here is
            selectable. Keeps the .asmt-v4-cards class so the existing
            single-column rule below 560px applies unchanged. */}
        <ul className="asmt-v4-cards" style={{
          margin: 0, paddingLeft: 0, listStyle: "none",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-3)",
        }}>
          {rec.bullets.map((b, i) => (
            <li key={i} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: "var(--spacing-3)",
              textAlign: "center", minHeight: 120,
              background: "var(--accent-strong)", borderRadius: "var(--radius-lg)",
              padding: "var(--spacing-5)",
            }}>
              <span aria-hidden="true" style={{
                width: 36, height: 36, flex: "none", borderRadius: "50%",
                background: "var(--color-white)", color: "var(--accent-strong)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}><AsmtCheckGlyph size={16} /></span>
              <span style={{
                fontSize: "var(--text-base)", lineHeight: 1.5, textWrap: "balance",
                color: "var(--text-on-primary)",
              }}>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3 · Next Steps */}
      <div style={card}>
        <p style={sectionTag}>Next Steps</p>
        <ol style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
          {rec.nextSteps.map((s, i) => (
            <li key={i} style={{ display: "flex", gap: "var(--spacing-3)", alignItems: "flex-start" }}>
              <AsmtBadge size={24} state="todo">{i + 1}</AsmtBadge>
              <span style={{ fontSize: "var(--text-base)", lineHeight: 1.5, color: "var(--text-default)", paddingTop: 1 }}>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* 4 · Offer — pricing appears here for the first time */}
      <div style={card}>
        <p style={sectionTag}>Your Offer</p>
        <p style={{
          margin: 0, fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)",
          letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--warning-default)",
        }}>Placeholder pricing — pending final pricing config</p>
        {/* flexWrap + no minWidth on the name group: the price is nowrap and
            ~212px wide, so at 375px it left the group 17px and the thumb and
            name spilled out from under it. Wrapping drops the price onto its
            own line instead, and marginLeft keeps it right-aligned there. */}
        <div style={{
          display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center",
          gap: "var(--spacing-4)", rowGap: "var(--spacing-2)",
          background: "var(--accent-subtle)", borderRadius: "var(--radius-md)",
          padding: "var(--spacing-4) var(--spacing-5)",
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: "var(--spacing-4)" }}>
            <AsmtV4OfferThumb spec={thumbs[rec.pathId]} />
            <span style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-semibold)", color: "var(--accent-onSubtle)" }}>
              {rec.offer.plan.name}{rec.offer.labsTier ? " — " + rec.offer.labsTier : ""}
            </span>
          </span>
          <span style={{ fontSize: "var(--text-base)", color: "var(--accent-onSubtle)", whiteSpace: "nowrap", marginLeft: "auto" }}>{rec.offer.plan.price}</span>
        </div>
        {rec.offer.labsPanelNote &&
          <p style={{ margin: 0, fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text-secondary)" }}>
            {rec.offer.labsPanelNote}
          </p>}
        {rec.offer.addOns.map((a) => (
          <div key={a.name} style={{
            display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center",
            gap: "var(--spacing-4)", rowGap: "var(--spacing-2)",
            border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)",
            padding: "var(--spacing-3) var(--spacing-5)",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: "var(--spacing-4)" }}>
              <AsmtV4OfferThumb spec={thumbs[a.name]} />
              <span style={{ fontSize: "var(--text-base)", color: "var(--text-default)" }}>Add-on: {a.name}</span>
            </span>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", whiteSpace: "nowrap", marginLeft: "auto" }}>{a.price}</span>
          </div>
        ))}
      </div>

      {/* 5 · Final CTA */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-2)", marginTop: "var(--spacing-2)" }}>
        <AsmtV4Button label={rec.cta} onClick={onCreateAccount} />
        <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{rec.ctaSupport}</p>
      </div>
    </div>
  );
}

// Hero header for `hero: true` screens — the homepage "hero-section feel-section"
// band (video + gradient wash, bottom-anchored copy) carrying the screen's
// title, supporting line, and time note.
function AsmtV4HeroHeader({ screen, headingRef, headingId }) {
  const uploads = window.CHIME_UPLOADS_BASE || "../../uploads";
  return (
    <header className="hero-section feel-section" style={{ fontFamily: "var(--font-family-base)" }}>
      <div style={{
        position: "relative", borderRadius: "var(--radius-3xl)", overflow: "hidden",
        // Was 400, then 300 (to fit the 960px question box), now 220 by user
        // call — the band is a min-height, so its own copy can never clip; the
        // video just crops tighter vertically. A1's block lands ~878, inside
        // the box, so the Back/Continue row stays pinned.
        background: "var(--glass-solid)", minHeight: 220,
        display: "flex", alignItems: "stretch", boxShadow: "var(--shadow-xs)",
      }}>
        <video className="feel-video"
          src={uploads + "/assesstV1-web.mp4"}
          autoPlay muted loop playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}></video>
        {/* Classed so the narrow-viewport rule in chimeAssessment.html can deepen
            the left end. The clip carries a baked-in "Chime Health" wordmark
            on its left third and no crop can clear it at 390px — see the
            .feel-scrim rule there for why. */}
        <div className="feel-scrim" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(100deg, rgb(var(--glass-rgb) / 0.62) 0%, rgb(var(--glass-rgb) / 0.32) 48%, rgb(var(--glass-rgb) / 0.08) 100%)",
        }}></div>
        <div className="feel-content" style={{
          position: "relative", zIndex: 1, flex: 1,
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          padding: "var(--spacing-10)", gap: "var(--spacing-3)",
        }}>
          <h2 id={headingId} ref={headingRef} tabIndex={-1} className="feel-title" style={{
            margin: 0, outline: "none", maxWidth: "14em",
            fontSize: "var(--text-5xl)", fontWeight: 300, lineHeight: 1.1,
            color: "var(--color-white)", textWrap: "balance",
            textShadow: "0 1px 16px rgb(var(--glass-rgb) / 0.35)",
          }}>{screen.title}</h2>
          {screen.supportingLine &&
            <p style={{
              margin: 0, maxWidth: "30em", fontSize: "var(--text-lg)", lineHeight: 1.5,
              color: "var(--color-white)", opacity: 0.92,
              textShadow: "0 1px 12px rgb(var(--glass-rgb) / 0.35)",
            }}>{screen.supportingLine}</p>}
          {screen.timeNote &&
            <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-white)", opacity: 0.75 }}>
              {screen.timeNote}
            </p>}
        </div>
      </div>
    </header>
  );
}

Object.assign(window, {
  AsmtV4Progress, AsmtV4MultiSelectCards, AsmtV4Checkboxes, AsmtV4Chips,
  AsmtV4SingleSelectList, AsmtV4SingleSelectCards, AsmtV4DynamicSingleSelect, AsmtV4YesNoGate,
  AsmtV4SingleSelectWithFreeText, AsmtV4Field, AsmtV4Select,
  AsmtV4ContactShippingFields, AsmtV4ContactFields, AsmtV4Snapshot,
  AsmtV4Phrase, AsmtV4Placeholder, AsmtV4Fork, AsmtV4Result, AsmtV4HeroHeader,
  AsmtV4Button, AsmtV4GoalCard, AsmtV4PillCard, AsmtV4BubbleCard, AsmtV4BubbleField,
});
