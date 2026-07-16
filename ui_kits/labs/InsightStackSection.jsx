// Chime Health — Labs UI kit: "One Insight Can Change Everything" card stack.
// Left: headline + subtext. Right: a fanned stack of 5 insight cards that
// auto-cycles (front card flies out down-left, the rest shift forward).
//
// Theme-agnostic per THEME_CONTRACT.md: no palette primitives, no brand hex.
// Each card takes a distinct stop off the page's OWN accent ramp
// (active → strong → hover → default → border), so the fan reads as one
// palette per page — iris on Labs, tide on Weight Loss, cadmium on Wellness —
// with no per-theme branch. `numColor` is split from `accent` so the lightest
// card can keep a readable icon/link against the light panel.

// One-time keyframe injection: the looping per-icon animations plus the
// fly-out/return pair. Guarded so a re-load doesn't stack duplicate <style>s.
// All motion sits behind prefers-reduced-motion: no-preference.
(function () {
  if (typeof document === "undefined") return;
  if (document.getElementById("chime-insight-styles")) return;
  const el = document.createElement("style");
  el.id = "chime-insight-styles";
  el.textContent = [
    "@keyframes insightBeat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }",
    "@keyframes insightFlicker { 0%, 100% { opacity: 1; } 45% { opacity: 0.35; } 55% { opacity: 1; } }",
    "@keyframes insightTick { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(12deg); } }",
    "@keyframes insightWiggle { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }",
    "@keyframes insightDraw { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }",
    "@keyframes insightFlyOut { from { transform: translate(0, 0) rotate(0deg); opacity: 1; } to { transform: translate(-40px, 70px) rotate(-8deg); opacity: 0; } }",
    "@keyframes insightReturn { from { opacity: 0; } to { opacity: 1; } }",
    "@media (prefers-reduced-motion: no-preference) {",
    "  .insight-anim-beat { animation: insightBeat 1.6s var(--ease-in-out) infinite; }",
    "  .insight-anim-flicker { animation: insightFlicker 2s var(--ease-in-out) infinite; }",
    "  .insight-anim-tick { animation: insightTick 2.4s var(--ease-in-out) infinite; }",
    "  .insight-anim-wiggle { animation: insightWiggle 2s var(--ease-in-out) infinite; }",
    "  .insight-anim-draw .insight-draw-path { stroke-dasharray: 100; animation: insightDraw 2.2s var(--ease-in-out) infinite; }",
    "}",
  ].join("\n");
  document.head.appendChild(el);
})();

// Line icons — stroke-only, 24x24 viewBox geometry handed to the shared Icon atom.
const INSIGHT_ICONS = {
  trendingUp: (
    <React.Fragment>
      <polyline className="insight-draw-path" pathLength="100" points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </React.Fragment>
  ),
  bolt: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  clock: (
    <React.Fragment>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </React.Fragment>
  ),
  nodes: (
    <React.Fragment>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </React.Fragment>
  ),
  heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
};

const INSIGHT_CARDS = [
  { key: "weight",    title: "Weight Management",      sub: "Sustainable, clinician-guided progress.", accent: "var(--accent-active)",  numColor: "var(--accent-active)", icon: "trendingUp", anim: "draw" },
  { key: "energy",    title: "Energy & Wellness",      sub: "Feel steady through the whole day.",      accent: "var(--accent-strong)",  numColor: "var(--accent-strong)", icon: "bolt",       anim: "flicker" },
  { key: "aging",     title: "Healthy Aging",          sub: "Stay strong for the long run.",           accent: "var(--accent-hover)",   numColor: "var(--accent-hover)",  icon: "clock",      anim: "tick" },
  { key: "lifestyle", title: "Lifestyle Optimization", sub: "Small habits, compounding returns.",      accent: "var(--accent-default)", numColor: "var(--accent-default)", icon: "nodes",     anim: "wiggle" },
  { key: "care",      title: "Personalized Care",      sub: "A plan built around you.",                accent: "var(--accent-border)",  numColor: "var(--accent-strong)", icon: "heart",      anim: "beat" },
];

// Fan geometry. The page may scale all three together via --insight-w/-h/-depth
// (see labs.html) — the card offset is an inline transform, so CSS cannot shrink
// the fan without them. Keep the ratios in step: depth is 22/340 of the width.
const INSIGHT_W = "var(--insight-w, 340px)";
const INSIGHT_H = "var(--insight-h, 375px)";
const INSIGHT_DEPTH = "var(--insight-depth, 22px)";  // px per depth step, fanned down-left → up-right
const INSIGHT_CYCLE_MS = 3800;
const INSIGHT_FLY_MS = 480;

function rotateOrder(order) {
  return order.slice(1).concat(order[0]);
}

function InsightCardStack() {
  const reduced = React.useMemo(function () {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const [order, setOrder] = React.useState(function () {
    return INSIGHT_CARDS.map(function (_, i) { return i; });
  });
  const [leaving, setLeaving] = React.useState(null);   // index mid fly-out
  const [returning, setReturning] = React.useState(null); // index fading back in at the rear
  const [paused, setPaused] = React.useState(false);
  const timers = React.useRef([]);

  React.useEffect(function () {
    return function () { timers.current.forEach(clearTimeout); };
  }, []);

  // Advance one position. The rest of the stack shifts forward immediately so
  // the fly-out and the shift read as a single motion.
  const advance = React.useCallback(function () {
    setOrder(function (cur) {
      if (reduced) return rotateOrder(cur);
      const front = cur[0];
      setLeaving(front);
      timers.current.push(setTimeout(function () {
        setLeaving(null);
        setReturning(front);
        timers.current.push(setTimeout(function () { setReturning(null); }, 320));
      }, INSIGHT_FLY_MS));
      return rotateOrder(cur);
    });
  }, [reduced]);

  React.useEffect(function () {
    if (paused) return;
    const t = setInterval(advance, INSIGHT_CYCLE_MS);
    return function () { clearInterval(t); };
  }, [paused, advance]);

  return (
    <div
      role="button" tabIndex={0}
      aria-label="Insight cards — activate to show the next insight"
      onMouseEnter={function () { setPaused(true); }}
      onMouseLeave={function () { setPaused(false); }}
      onClick={advance}
      onKeyDown={function (e) {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); advance(); }
      }}
      className="insight-stack"
      style={{
        position: "relative", width: INSIGHT_W, height: INSIGHT_H,
        // The fan pushes deeper cards right AND up, so reserve that extent on
        // both axes — otherwise the rear cards break out of the panel's top edge.
        // Overriding margin-right to auto re-centres the box and drops this
        // reservation, which pushes the fan back out of the panel.
        margin: "0 auto",
        marginRight: "calc(" + INSIGHT_DEPTH + " * " + (INSIGHT_CARDS.length - 1) + ")",
        marginTop: "calc(" + INSIGHT_DEPTH + " * " + (INSIGHT_CARDS.length - 1) + ")",
        cursor: "pointer", outlineOffset: 6,
      }}>
      {INSIGHT_CARDS.map(function (card, i) {
        const pos = order.indexOf(i);
        const depth = pos;
        const isFront = pos === 0;
        const isLeaving = leaving === i;
        const isReturning = returning === i;
        // The leaving card keeps its content lit while it flies; everything
        // behind the front shows only its colored border edge.
        const contentLit = isFront || isLeaving;
        return (
          <div key={card.key} style={{
            position: "absolute", inset: 0, boxSizing: "border-box",
            border: "10px solid " + card.accent,
            borderRadius: "var(--radius-3xl)",
            background: "rgba(255, 255, 255, 0.72)",
            padding: "var(--spacing-5)",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            transform: isLeaving ? undefined : "translate(calc(" + INSIGHT_DEPTH + " * " + depth + "), calc(" + INSIGHT_DEPTH + " * " + (-depth) + "))",
            zIndex: isLeaving ? 99 : INSIGHT_CARDS.length - pos,
            boxShadow: isFront ? "var(--shadow-md)" : "var(--shadow-sm)",
            transition: reduced ? "none" : "transform " + INSIGHT_FLY_MS + "ms var(--ease-in-out), box-shadow " + INSIGHT_FLY_MS + "ms var(--ease-in-out)",
            animation: isLeaving
              ? "insightFlyOut " + INSIGHT_FLY_MS + "ms var(--ease-in-out) both"
              : (isReturning ? "insightReturn 320ms var(--ease-in-out) both" : undefined),
          }}>
            {/* Top-right: title + one-line sub */}
            <div style={{
              textAlign: "right", opacity: contentLit ? 1 : 0,
              transition: reduced ? "none" : "opacity 320ms var(--ease-in-out)",
            }}>
              <div style={{
                fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-semibold)",
                lineHeight: 1.25, color: "var(--text-default)",
              }}>{card.title}</div>
              <div style={{
                marginTop: "var(--spacing-1)", fontSize: "var(--text-sm)",
                lineHeight: 1.4, color: "var(--fg-muted)",
              }}>{card.sub}</div>
            </div>

            {/* Middle: the big line icon */}
            <div aria-hidden="true" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              color: card.numColor, opacity: contentLit ? 1 : 0,
              transition: reduced ? "none" : "opacity 320ms var(--ease-in-out)",
            }}>
              <div className={isFront ? "insight-icon insight-anim-" + card.anim : "insight-icon"}>
                <Icon size={140} strokeWidth={1.5}>{INSIGHT_ICONS[card.icon]}</Icon>
              </div>
            </div>

            {/* Bottom-right: explore link */}
            <div style={{
              textAlign: "right", opacity: contentLit ? 1 : 0,
              pointerEvents: contentLit ? "auto" : "none",
              transition: reduced ? "none" : "opacity 320ms var(--ease-in-out)",
            }}>
              <a href="#" tabIndex={isFront ? 0 : -1}
                onClick={function (e) {
                  e.preventDefault(); e.stopPropagation();
                  window.openChimeAssessment && window.openChimeAssessment();
                }}
                style={{
                  fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)",
                  color: card.numColor, textDecoration: "underline", textUnderlineOffset: "3px",
                }}>Explore →</a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChimeInsightStackSection({ theme = "default" }) {
  return (
    <section data-screen-label="One Insight Can Change Everything" data-theme={theme}
      className="insight-section" style={{
        fontFamily: "var(--font-family-base)",
        padding: "var(--spacing-12) var(--spacing-8)",
        maxWidth: "var(--container-xl)", margin: "0 auto", boxSizing: "border-box",
      }}>
      <div className="insight-panel" style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center",
        gap: "var(--spacing-8)", padding: "var(--spacing-10)",
        borderRadius: "var(--radius-3xl)", background: "var(--bg-secondary)",
      }}>
        <Reveal>
          <h2 className="insight-title" style={{
            margin: 0, fontSize: "var(--text-5xl)", fontWeight: 300,
            lineHeight: 1.1, color: "var(--text-default)", textWrap: "balance",
          }}>One Insight Can Change Everything</h2>
          <p style={{
            margin: "var(--spacing-4) 0 0", fontSize: "var(--text-base)",
            lineHeight: 1.5, color: "var(--fg-muted)",
          }}>Health is connected.</p>
        </Reveal>

        <Reveal delay={150}>
          <InsightCardStack />
        </Reveal>
      </div>
    </section>
  );
}

Object.assign(window, { ChimeInsightStackSection });
