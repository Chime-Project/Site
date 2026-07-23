// Chime Health — Homepage UI kit: "What people are saying" testimonials section
// Centered single-column: quote glyph → heading → rotating quote carousel with
// pager dots → 3-up stat row (rating, review count, assessment CTA).
// Styling binds to the design tokens only; the two non-token values are the
// glyph character and the reveal timing, both cosmetic.

// One-time keyframe injection for the per-quote fade/slide-up. Guarded so
// re-loading the script (hot reload) doesn't stack duplicate <style> nodes.
(function () {
  if (typeof document === "undefined") return;
  if (document.getElementById("chime-testimonials-styles")) return;
  const el = document.createElement("style");
  el.id = "chime-testimonials-styles";
  el.textContent =
    "@keyframes testimonialFade { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }";
  document.head.appendChild(el);
})();

const TESTIMONIALS = [
  {
    quote: "For the first time a care team actually listened. My plan felt built around my life, not a template — and six weeks in I finally feel like myself again.",
    name: "Marcus H.",
    meta: "Austin, TX · Started Feb 2026",
  },
  {
    quote: "The coaching kept me accountable without making me feel judged. Having a provider a message away took all the guesswork out of it.",
    name: "Priya N.",
    meta: "Seattle, WA · Started Jan 2026",
  },
  {
    quote: "I'd tried everything before. Chime was the first thing that connected the dots between my labs, my energy, and a plan I could actually follow.",
    name: "Danielle R.",
    meta: "Columbus, OH · Started Mar 2026",
  },
  {
    quote: "Simple, private, and genuinely personal. The whole thing took minutes to start and the support has been there every step since.",
    name: "James O.",
    meta: "Denver, CO · Started Feb 2026",
  },
];

// IntersectionObserver reveal — fade + rise on first entry into view.
// Respects prefers-reduced-motion (shown immediately, no transition) and falls
// back to visible where IO is unavailable. `delay` staggers grouped children.
function useReveal(delay) {
  delay = delay || 0;
  const reduced = React.useMemo(function () {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(reduced);
  React.useEffect(function () {
    if (reduced) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setShown(true); return; }
    const io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.18 });
    io.observe(el);
    return function () { io.disconnect(); };
  }, [reduced]);
  const style = {
    opacity: shown ? 1 : 0,
    transform: shown ? "none" : "translateY(28px)",
    transition: reduced
      ? "none"
      : ("opacity 0.8s var(--ease-out, ease-out) " + delay + "ms, transform 0.8s var(--ease-out, ease-out) " + delay + "ms"),
  };
  return [ref, style];
}

function TestimonialCarousel() {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const count = TESTIMONIALS.length;

  // Auto-advance every 6s; hovering the carousel pauses the rotation.
  React.useEffect(function () {
    if (paused) return;
    const t = setInterval(function () {
      setActive(function (a) { return (a + 1) % count; });
    }, 6000);
    return function () { clearInterval(t); };
  }, [paused, count]);

  const item = TESTIMONIALS[active];
  return (
    <div
      onMouseEnter={function () { setPaused(true); }}
      onMouseLeave={function () { setPaused(false); }}
      style={{
        maxWidth: 820, margin: "0 auto",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-6)",
      }}>
      {/* Keyed by index so the fade/slide-up keyframe retriggers per quote. */}
      <blockquote key={active} style={{
        margin: 0, textAlign: "center", textWrap: "balance",
        fontSize: "var(--text-2xl)", fontWeight: 300, lineHeight: 1.45,
        color: "var(--color-slate-800)",
        animation: "testimonialFade 0.6s var(--ease-out, ease-out) both",
      }}>
        {item.quote}
        <footer style={{
          marginTop: "var(--spacing-4)",
          fontSize: "var(--text-base)", fontWeight: "var(--font-weight-normal)",
          lineHeight: 1.5, color: "var(--color-sand-800)",
        }}>
          <span style={{ fontWeight: "var(--font-weight-semibold)", color: "var(--text-default)" }}>{item.name}</span>
          {" | " + item.meta}
        </footer>
      </blockquote>

      {/* Pager dots */}
      <div role="tablist" aria-label="Testimonials" style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--spacing-3)",
      }}>
        {TESTIMONIALS.map(function (t, i) {
          const isActive = i === active;
          return (
            <button key={i} type="button" role="tab"
              aria-selected={isActive ? "true" : "false"}
              aria-label={"Show testimonial " + (i + 1) + " of " + count}
              onClick={function () { setActive(i); }}
              style={{
                appearance: "none", padding: 0, cursor: "pointer",
                width: 9, height: 9, borderRadius: "var(--radius-full, 9999px)",
                border: "none",
                background: isActive ? "var(--accent-strong)" : "var(--color-sand-300)",
                transform: isActive ? "scale(1.15)" : "scale(1)",
                transition: "background var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out)",
              }} />
          );
        })}
      </div>
    </div>
  );
}

// Shared shell for the two stat tiles below. Kept as a style object rather than a
// component: the pair differ by tag (<div> vs <a>) and behaviour, not by shape, and
// this is their only consumer. Always spread into a fresh object — never mutate it.
// (Not merged with Hero's CategoryCard/StartHereCard: those are flex-row tiles with a
// border, a 52px image-slot and a trailing glyph. The only overlap is radius-2xl +
// minHeight 88 — too little to share. Phase 7.)
const STAT_TILE_SHELL = {
  background: "var(--color-sand-100)", borderRadius: "var(--radius-2xl)",
  padding: "var(--spacing-5) var(--spacing-6)", minHeight: 88, boxSizing: "border-box",
  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  gap: "var(--spacing-1)", textAlign: "center",
};

function TestimonialStat({ children, delay }) {
  const [ref, revealStyle] = useReveal(delay);
  return (
    <div ref={ref} style={Object.assign({}, STAT_TILE_SHELL, revealStyle)}>
      {children}
    </div>
  );
}

function TestimonialStatCTA({ delay }) {
  const [ref, revealStyle] = useReveal(delay);
  const [hover, setHover] = React.useState(false);
  return (
    <a ref={ref} href="assessment.html"
      onClick={function (e) { e.preventDefault(); window.openChimeAssessment && window.openChimeAssessment(); }}
      onMouseEnter={function () { setHover(true); }}
      onMouseLeave={function () { setHover(false); }}
      style={Object.assign({}, STAT_TILE_SHELL, {
        textDecoration: "none",
        boxShadow: hover ? "var(--shadow-md)" : "none",
      }, revealStyle, {
        transform: hover ? (revealStyle.opacity === 1 ? "translateY(-3px)" : revealStyle.transform) : revealStyle.transform,
        transition: revealStyle.transition + ", box-shadow var(--transition-base) var(--ease-in-out)",
      })}>
      <span style={{
        fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-semibold)", lineHeight: 1.2,
        color: hover ? "var(--accent-hover)" : "var(--accent-strong)",
        transition: "color var(--transition-base) var(--ease-in-out)",
      }}>Start your assessment</span>
      <span style={{ fontSize: "var(--text-sm)", color: "var(--color-sand-800)" }}>It takes less than 5 minutes</span>
    </a>
  );
}

// `theme` selects the accent palette (data-theme on the section): default=blue
// on the homepage, "lab"=iris on the Labs page, etc. The glyph, dots, CTA, and
// stat numerals all bind to --accent-* so each page keeps its own palette.
// --accent-active resolves to blue-800 under the default theme, so the homepage
// numerals are unchanged.
function ChimeTestimonialsSection({ theme = "default" }) {
  const [contentRef, contentReveal] = useReveal(0);
  const numeralStyle = {
    fontSize: "var(--text-4xl)", fontWeight: 300, lineHeight: 1,
    color: "var(--accent-active)", fontVariantNumeric: "lining-nums",
  };
  const labelStyle = { fontSize: "var(--text-sm)", color: "var(--color-sand-800)" };
  return (
    <section data-screen-label="Testimonials" data-theme={theme} className="testimonials-section" style={{
      fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-12) var(--spacing-8)",
      maxWidth: "var(--container-xl)", margin: "0 auto", boxSizing: "border-box",
    }}>
      <div ref={contentRef} style={Object.assign({
        display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-6)",
      }, contentReveal)}>
        {/* Decorative closing quote */}
        <span aria-hidden="true" style={{
          display: "block", color: "var(--accent-strong)",
          fontSize: "var(--text-5xl)", fontWeight: 300, lineHeight: 0.6,
        }}>&#8221;</span>

        <h2 className="testimonials-title" style={{
          margin: 0, textAlign: "center", textWrap: "balance",
          fontSize: "var(--text-5xl)", fontWeight: 300, lineHeight: 1.1,
          color: "var(--text-default)",
        }}>What people are saying</h2>

        <TestimonialCarousel />
      </div>

      <div className="testimonials-stats" style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--spacing-4)",
        maxWidth: 940, margin: "var(--spacing-10) auto 0",
      }}>
        <TestimonialStat delay={0}>
          <span style={numeralStyle}>4.8</span>
          <span style={labelStyle}>Average rating</span>
        </TestimonialStat>
        <TestimonialStat delay={100}>
          <span style={numeralStyle}>+500</span>
          <span style={labelStyle}>Verified reviews</span>
        </TestimonialStat>
        <TestimonialStatCTA delay={200} />
      </div>
    </section>
  );
}

Object.assign(window, { ChimeTestimonialsSection });
