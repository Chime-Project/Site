// Chime Health — Persona 1 (The Executive) · Landing 2 of 3 · Labs & Health Insights.
//
// Built on executive-weight-loss.html / ExecutiveWLPage.jsx: the same layout
// language — fixed pill chrome, a colour-blocked hero with giant display type
// and a cropped wordmark over the same ambient loop of the same executive,
// numbered kickers, a dark statement band with a persona still, a split grid
// with an oversized visual, and a centred dark closer — re-themed from the
// Weight Loss ramp (tide) to the Labs ramp (iris) and re-copied for Landing 2.
//
// COPY SOURCE — "Chime_Health_LandingPages_Persona1_Executive (1).pdf" in
// uploads/ (untracked; uploads/*.pdf is gitignored and this repo's root is
// public). Every headline, subhead and CTA is that document's, verbatim, with
// two deliberate exceptions lifted from the live labs.html so they carry
// approved wording: the 3-Step Close's subtitle and step bodies, and the tier
// NAMES. The IA row writes "Essential (80+)"; the live system — and the
// configurator embedded two sections below, which is the live module — says
// "Comprehensive". The tier cards follow the module rather than contradict it
// on the same screen. One-word change (EXEC_LABS_TIER_ORDER) if the client
// confirms the rename.
//
// ⚙ THE INTERACTIVE MODULES ARE THE LIVE ONES, embedded unmodified in what
// they render by default: ChimeInsightStackSection (cross-link carousel),
// LabsProductDetailSection (panel configurator) and ChimeLabsSignalsSection
// (biomarker carousel). The persona defaults the IA asks for arrive through
// props that did not exist before and default to the old behaviour, so
// labs.html renders exactly what it did: defaultTier="Executive" (site-wide
// default is Complete) and defaultTag="Energy" (Energy & Recovery instead of
// Hormones). The IA's row 8, Build Your Own Panel, was DROPPED from this
// landing on 2026-08-21 at the client's request — it is not a missing section.
//
// Palette lives in executive-labs.html as --exec-* page vars, so this file
// stays free of palette primitives (theme guard). The chrome, CTA, kicker and
// badge come from ui_kits/executive/ExecutiveCore.jsx (the footer is the site
// footer, ui_kits/homepage/Footer.jsx, not ExecCore's); motion from
// ui_kits/executive/ExecutiveMotion.js, mounted from a layout effect at the
// bottom of this file. Hooks this kit exposes for it: `exec-heading` (masked
// line reveal), `exec-fade` (batched fade-up), `exec-cta` (magnetic),
// `exec-scrub` (word-by-word scroll reveal), `exec-still` / `exec-membership-
// figure` (clip reveals), `exec-kicker-grid` + `exec-kicker-rule` (drawn
// hairlines) and the `exec-iceberg-*` parts. Nothing here animates on its own
// except the CSS badge spin — the page renders fully at rest when GSAP is
// absent or reduced motion is on.

// Section 2. Three performance-context recognitions, the IA's "·"-separated
// row drawn as recognition cards (the persona note calls them that): each one
// is the same executive as the hero loop, photographed inside that exact
// moment — the 3 p.m. crash, the slow recovery, the unrested dawn — with the
// statement set over the picture. No numerals: the pictures are the index.
const EXEC_LABS_RECOGNITION = [
  { line: "Afternoon crashes before it matters most",
    image: "uploads/executive-recognition-crash.webp",
    alt: "The executive at his desk mid-afternoon, glasses off, pressing his fingers to his closed eyes",
    focus: "50% 30%" },
  { line: "Recovery that takes longer than it used to",
    image: "uploads/executive-recognition-recovery.webp",
    alt: "The same executive on a gym bench after a workout, towel round his neck, head down, catching his breath",
    focus: "50% 30%" },
  { line: "Sleep that doesn’t translate to rest",
    image: "uploads/executive-recognition-sleep.webp",
    alt: "The same executive at dawn on the edge of his bed, rubbing the back of his neck, awake but not rested",
    focus: "50% 30%" },
];

// Section 9. Titles are the IA's chain (Insights → Guidance → Support); the
// bodies are the live labs.html Simple Path copy, verbatim.
const EXEC_LABS_STEPS = [
  { n: "01", label: "Insights", body: "Understand what may be happening beneath the surface." },
  { n: "02", label: "Guidance", body: "Receive support as you explore your next steps." },
  { n: "03", label: "Support", body: "You don’t have to figure it out alone." },
];

// Section 5. Tier order and biomarker counts are the IA's; prices are read
// from the live configurator's LABS_TIERS at render time so the two can never
// disagree on one page (and the cards simply omit the price line if that kit
// is not loaded). Top-level consts of an earlier <script type="text/babel">
// are global lexical bindings, hence the typeof guard rather than window.
const EXEC_LABS_TIER_ORDER = ["Comprehensive", "Complete", "Executive"];
const EXEC_LABS_TIER_MARKERS = { Comprehensive: "80+", Complete: "100+", Executive: "130+" };
function execLabsTiers() {
  const src = (typeof LABS_TIERS !== "undefined" && LABS_TIERS) ? LABS_TIERS : null;
  return EXEC_LABS_TIER_ORDER.map(function (tier) {
    const d = src && src[tier] ? src[tier] : {};
    return { tier, markers: d.markers || EXEC_LABS_TIER_MARKERS[tier], price: d.price || null };
  });
}

// ── 1 · Hero ────────────────────────────────────────────────────────────────
// The same ambient loop as the Weight Loss landing — same executive, same
// four scenes — because the persona, not the product, is what carries across
// these three pages (and a reader arriving from the WL page already has it
// cached). Labs-specific footage is a follow-up, not a blocker.
function ExecLabsHero() {
  // Reduced motion: hold the poster frame. autoplay is an attribute the browser
  // acts on before any CSS media query can intervene, so this has to be done to
  // the element itself — pause it and rewind to frame one.
  const videoRef = React.useRef(null);
  const heroSrc = window.matchMedia("(max-width: 700px)").matches
    ? "uploads/executive-hero-mobile.mp4" : "uploads/executive-hero.mp4";
  React.useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const v = videoRef.current;
    if (!v) return;
    v.removeAttribute("autoplay");
    v.pause();
    v.currentTime = 0;
  }, []);
  return (
    <section data-screen-label="Exec Hero" style={{
      position: "relative", overflow: "hidden", background: "var(--exec-ground)",
      fontFamily: "var(--font-family-base)", minHeight: "100vh",
      boxSizing: "border-box", display: "flex", flexDirection: "column",
      /* No value ribbon on this landing (the IA's row 2 is Recognition, a
         section of its own), so the hero keeps a small bottom inset and the
         wordmark is its floor. */
      padding: "var(--spacing-24) var(--spacing-6) var(--spacing-6)",
    }}>
      <video ref={videoRef} className="exec-hero-video" src={heroSrc}
        poster="uploads/executive-hero-poster.webp"
        autoPlay muted loop playsInline aria-hidden="true" tabIndex={-1} />
      {/* Iris scrim, heavier on the left: the headline needs the contrast it
          gets on the flat ground, and over raw footage it would swing frame to
          frame. The gradient keeps the text side effectively solid and lets the
          footage read on the right, where only the wordmark sits. */}
      <div className="exec-hero-scrim" aria-hidden="true" />
      <div className="exec-hero-copy" style={{
        position: "relative", zIndex: 2, flex: 1,
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", gap: "var(--spacing-8)",
        }}>
          <h1 style={{
            margin: 0, color: "var(--exec-ink-dark)",
            fontSize: "clamp(40px, 5.4vw, 78px)", lineHeight: 0.98,
            fontWeight: "var(--font-weight-bold)", letterSpacing: "-0.02em",
            maxWidth: "11em",
          }}>Know What&rsquo;s Actually Driving Your Performance</h1>
          <ExecSpinBadge />
        </div>
        <div className="exec-hero-sub" style={{ marginTop: "var(--spacing-10)", maxWidth: 560 }}>
          <i className="exec-hero-rule" aria-hidden="true" style={{
            display: "block", height: 1, background: "var(--exec-hairline-dark)",
            transformOrigin: "0 50%",
          }} />
          <p style={{
            margin: "var(--spacing-5) 0 0", color: "var(--exec-ink-dark)", fontSize: "var(--text-xl)",
            lineHeight: 1.45, fontWeight: "var(--font-weight-medium)",
          }}>Hundreds of biomarkers, reviewed by a licensed provider, turned into a
            clear picture — not another app to check.</p>
          <ExecCta label="Discover Your Health Path" style={{ marginTop: "var(--spacing-6)" }} />
        </div>
        <div className="exec-hero-bottom" style={{
          position: "relative", flex: 1, display: "flex", alignItems: "flex-end",
        }}>
          {/* The page's keyword — it is the category name, the carousel's
              headline and the Why Different headline. */}
          <div className="exec-hero-word" aria-hidden="true" style={{
            color: "var(--exec-ink-dark)", fontWeight: "var(--font-weight-bold)",
            fontSize: "clamp(72px, 12.5vw, 200px)", lineHeight: 0.82,
            letterSpacing: "-0.04em", marginLeft: "-0.04em",
            whiteSpace: "nowrap", userSelect: "none",
          }}>INSIGHT</div>
        </div>
      </div>
    </section>
  );
}

// ── 2 · Recognition ─────────────────────────────────────────────────────────
// No headline and no CTA in the IA for this row — three statements the reader
// either recognises or does not, each set over a still of the executive living
// it. Drawn as a FULL-BLEED TRIPTYCH: the three panels run edge to edge, cut by
// two slanted seams (the page ground shows through a hairline gap as the
// dividing line), and the picture zooms under the pointer.
//
// Three nested boxes, on purpose, because three different things happen to
// them and each needs its own node: the PANEL carries the slanted clip-path
// and the overlap that makes the seam one continuous line (page CSS) and is
// what the motion layer slides along the seam on scroll; the MEDIA wrapper is
// what scales on hover (CSS); the IMG — cut 16% taller than its figure — is
// what the motion layer drifts for parallax. Put any two of those on one
// element and the inline transform GSAP writes would cancel the stylesheet's.
// (No `exec-still` here: the slide IS the reveal.)
function ExecLabsRecognition() {
  return (
    <section data-screen-label="Recognition" className="exec-recognition" style={{
      /* Transparent on purpose: the motion layer pins the hero and slides the
         slabs up over it, so until they arrive the hero (not a cream band)
         is what shows through the strip. At rest the body ground is the same
         --bg-default, so nothing reads differently. */
      background: "transparent", fontFamily: "var(--font-family-base)",
    }}>
      <div className="exec-recognition-strip" role="list">
        {EXEC_LABS_RECOGNITION.map((r) => (
          <div key={r.line} role="listitem" className="exec-recognition-panel">
            <figure className="exec-recognition-figure" style={{
              margin: 0, background: "var(--exec-band-dark)", color: "var(--exec-ink-light)",
            }}>
              <div className="exec-recognition-media">
                <img src={r.image} alt={r.alt} loading="lazy" decoding="async" style={{
                  position: "absolute", left: 0, right: 0, top: "-8%", height: "116%",
                  width: "100%", objectFit: "cover", objectPosition: r.focus, display: "block",
                }} />
              </div>
              <div className="exec-recognition-scrim" aria-hidden="true" />
              <figcaption className="exec-recognition-caption" style={{
                position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 2,
                fontSize: "clamp(22px, 1.9vw, 30px)", lineHeight: 1.2,
                fontWeight: "var(--font-weight-medium)", letterSpacing: "-0.01em",
                maxWidth: "15em", textWrap: "balance",
              }}>{r.line}</figcaption>
            </figure>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 3 · Iceberg ─────────────────────────────────────────────────────────────
// The split grid with an oversized visual (the WL page's "≠" moment). The
// visual is the IA's own metaphor drawn literally: a waterline, a small tip
// above it, a far larger mass beneath. Geometry only, in the page's tokens —
// the motion layer scrolls the mass up out of the deep.
function ExecIcebergGraphic() {
  return (
    <svg className="exec-iceberg-svg" viewBox="0 0 520 560" role="img"
      aria-label="An iceberg: a small tip above the waterline, a far larger mass beneath it"
      style={{ width: "100%", maxWidth: 520, height: "auto", display: "block" }}>
      <defs>
        <clipPath id="exec-iceberg-frame"><rect x="0" y="0" width="520" height="560" rx="24" /></clipPath>
        <clipPath id="exec-iceberg-water"><rect x="0" y="180" width="520" height="380" /></clipPath>
      </defs>
      <g clipPath="url(#exec-iceberg-frame)">
        <rect x="0" y="0" width="520" height="180" style={{ fill: "var(--bg-elevated)" }} />
        <rect x="0" y="180" width="520" height="380" style={{ fill: "var(--accent-subtle)" }} />
        <g clipPath="url(#exec-iceberg-water)">
          <polygon className="exec-iceberg-deep"
            points="168,180 112,300 146,436 246,522 338,498 412,404 386,282 352,180"
            style={{ fill: "var(--accent-default)" }} />
        </g>
        <polygon className="exec-iceberg-tip" points="196,180 236,92 262,122 296,64 338,180"
          style={{ fill: "var(--exec-ink-dark)" }} />
        <line className="exec-iceberg-line" x1="0" y1="180" x2="520" y2="180"
          style={{ stroke: "var(--exec-ink-dark)", strokeOpacity: 0.45, strokeWidth: 1.5 }} />
        <text className="exec-iceberg-label" x="28" y="150" style={{
          fill: "var(--exec-ink-dark)", fontFamily: "var(--font-family-base)",
          fontSize: 16, fontWeight: 600, letterSpacing: "0.1em",
        }}>VISIBLE SYMPTOMS</text>
        <text className="exec-iceberg-label" x="28" y="220" style={{
          fill: "var(--accent-active)", fontFamily: "var(--font-family-base)",
          fontSize: 16, fontWeight: 600, letterSpacing: "0.1em",
        }}>BIOMARKERS</text>
      </g>
    </svg>
  );
}

function ExecLabsIceberg() {
  return (
    <section data-screen-label="Iceberg" className="exec-iceberg" style={{
      position: "relative", overflow: "hidden", background: "var(--bg-tertiary)",
      fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-20) var(--spacing-6)",
    }}>
      <div className="exec-split-grid" style={{
        maxWidth: 1280, margin: "0 auto", display: "grid",
        gridTemplateColumns: "minmax(300px, 560px) 1fr",
        gap: "var(--spacing-12)", alignItems: "center",
      }}>
        <div>
          <h2 className="exec-heading" style={{
            margin: "0 0 var(--spacing-5)", color: "var(--text-default)",
            fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.02,
            fontWeight: "var(--font-weight-bold)", letterSpacing: "-0.02em",
          }}>What If The Problem Isn&rsquo;t What You Think?</h2>
          <p className="exec-fade" style={{
            margin: 0, color: "var(--text-secondary)", fontSize: "var(--text-xl)",
            lineHeight: 1.55, maxWidth: "26em",
          }}>Visible symptoms are the surface. The biomarkers underneath are the real signal.</p>
          <ExecCta label="Discover Your Health Path" className="exec-fade" style={{ marginTop: "var(--spacing-8)" }} />
        </div>
        <div className="exec-glyph-visual exec-iceberg-visual" style={{
          position: "relative", minHeight: 460, display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <ExecIcebergGraphic />
        </div>
      </div>
    </section>
  );
}

// ── 4 · ⚙ Cross-link carousel (live module) ─────────────────────────────────
// "One Insight Can Change Everything" — the module carries that headline and
// the Explore → links itself, so the band is just ground + fade.
function ExecLabsInsight() {
  return (
    <section data-screen-label="Cross-Link Carousel" style={{
      background: "var(--bg-default)", fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-8) 0",
    }}>
      <div className="exec-fade">
        <ChimeInsightStackSection theme="lab" />
      </div>
    </section>
  );
}

// ── 5 · Tiers + Configurator ────────────────────────────────────────────────
// The IA's rows 5 (Tiers) and 6 (⚙ Panel Configurator) as ONE section — built
// first as a candidate beside the two separate sections, chosen over them on
// 2026-08-21, the pair removed. Rendering-wise the live configurator module
// (LabsProductDetailSection) is therefore NOT mounted on this page; its kit is
// still loaded because this section reads its data and option primitives.
//
// Here the three tier cards ARE the tier selector — a radiogroup, the dark
// featured card = selected — so the live module's own "Tier" pill row is not
// repeated. The configurator beside them reads its data from the live
// module's LABS_TIERS (photo, markers, price) and renders Sex / Lab review
// with the live module's own LabsOptionGroup, so the two stay in lock-step;
// both are top-level bindings of LabsProductDetailSection.jsx (loaded first)
// and are typeof-guarded in case that kit is ever not on the page. The
// description is that module's default copy, verbatim. The CTA is the IA's
// "Book My Health Test" and opens the assessment like every other CTA.
//
// DESKTOP GEOMETRY: the tier column stretches to the configurator panel's
// height and splits it 1 : 1.3 : 1.7 between the three cards, so the card
// grows with the tier (page CSS, ≥901px). Each card spreads its rows —
// name / count / (Executive line) — across whatever height it gets.
const EXEC_LABS_PDP_DESCRIPTION = "A comprehensive look at the biomarkers behind your energy, metabolism, hormones, and long-term health. Your sample is collected at a nearby lab and reviewed by a licensed provider. Results are informational and designed to guide your next conversation about care.";

function ExecLabsTierRow({ tier, markers, price, selected, onSelect }) {
  const ink = selected ? "var(--exec-ink-light)" : "var(--text-default)";
  const muted = selected ? "var(--exec-ink-light)" : "var(--text-secondary)";
  // Three stacked blocks — name + radio / the count / label + price (+ the
  // Executive line) — justified space-between, so on desktop, where the card
  // is as tall as its share of the panel, the count sits in the middle and the
  // price on the floor; on phones (content height) they simply stack.
  return (
    <button type="button" role="radio" aria-checked={selected} onClick={onSelect}
      className="exec-fade exec-combo-row" style={{
        appearance: "none", cursor: "pointer", textAlign: "left", width: "100%",
        font: "inherit", fontFamily: "var(--font-family-base)", color: ink,
        background: selected ? "var(--exec-band-dark)" : "var(--bg-elevated)",
        border: selected ? "1px solid transparent" : "1px solid var(--border-default)",
        borderRadius: "var(--radius-2xl)", padding: "var(--spacing-5) var(--spacing-6)",
        boxSizing: "border-box", minHeight: 0,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        gap: "var(--spacing-3)",
        boxShadow: selected ? "var(--shadow-md)" : "none",
        transition: "background var(--transition-base) var(--ease-in-out), color var(--transition-base) var(--ease-in-out), box-shadow var(--transition-base) var(--ease-in-out)",
      }}>
      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--spacing-4)" }}>
        <span style={{
          fontSize: "var(--text-sm)", letterSpacing: "0.08em", textTransform: "uppercase",
          fontWeight: "var(--font-weight-semibold)", color: selected ? ink : "var(--text-muted)",
        }}>{tier}</span>
        <span aria-hidden="true" style={{
          flex: "none", width: 22, height: 22, borderRadius: "50%", boxSizing: "border-box",
          border: "2px solid " + (selected ? "var(--exec-ground)" : "var(--border-strong)"),
          background: selected ? "var(--exec-ground)" : "transparent",
          boxShadow: selected ? "inset 0 0 0 4px var(--exec-band-dark)" : "none",
        }} />
      </span>
      <span style={{
        display: "block", fontSize: "clamp(36px, 3.4vw, 56px)", lineHeight: 0.95,
        fontWeight: "var(--font-weight-bold)", letterSpacing: "-0.03em",
      }}>{markers}</span>
      <span style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
        <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--spacing-4)", flexWrap: "wrap" }}>
          <span style={{
            fontSize: "var(--text-sm)", letterSpacing: "0.08em", textTransform: "uppercase",
            fontWeight: "var(--font-weight-semibold)", color: muted, opacity: selected ? 0.8 : 1,
          }}>Biomarkers</span>
          {price ? (
            <span style={{ fontSize: "var(--text-base)", color: muted }}>
              <span style={{ opacity: 0.75 }}>From </span>
              <strong style={{ color: ink, fontWeight: "var(--font-weight-semibold)" }}>{price}</strong>
            </span>
          ) : null}
        </span>
        {tier === "Executive" ? (
          <span style={{
            fontSize: "var(--text-base)", lineHeight: 1.4, fontWeight: "var(--font-weight-medium)",
            color: ink, opacity: selected ? 1 : 0.85, maxWidth: "18em",
          }}>Built for exactly this level of scrutiny.</span>
        ) : null}
      </span>
    </button>
  );
}

function ExecLabsTiersConfigurator() {
  const tiers = execLabsTiers();
  const src = (typeof LABS_TIERS !== "undefined" && LABS_TIERS) ? LABS_TIERS : null;
  const sexes = (typeof LABS_SEXES !== "undefined" && LABS_SEXES) ? LABS_SEXES : ["Male", "Female"];
  const reviews = (typeof LABS_REVIEWS !== "undefined" && LABS_REVIEWS) ? LABS_REVIEWS : ["45 min lab review", "No lab review"];
  const OptionGroup = (typeof LabsOptionGroup === "function") ? LabsOptionGroup : null;
  const [tier, setTier] = React.useState("Executive");
  const [sex, setSex] = React.useState(sexes[0]);
  const [review, setReview] = React.useState(reviews[0]);
  const d = (src && src[tier]) || {};
  const markers = d.markers || EXEC_LABS_TIER_MARKERS[tier];
  return (
    <section data-screen-label="Tiers + Configurator" style={{
      background: "var(--accent-subtle)", fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-24) var(--spacing-6)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <h2 className="exec-heading" style={{
          margin: "0 0 var(--spacing-4)", color: "var(--text-default)",
          fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.02,
          fontWeight: "var(--font-weight-bold)", letterSpacing: "-0.02em",
          maxWidth: "14em",
        }}>Choose The Depth Of Insight You Need</h2>
        {/* The IA's own description of what this step does. */}
        <p className="exec-fade" style={{
          margin: 0, color: "var(--text-secondary)", fontSize: "var(--text-lg)",
          lineHeight: 1.55, maxWidth: "30em",
        }}>Tier, sex, and lab-review preference — selected before checkout.</p>

        <div className="exec-combo-grid" style={{
          display: "grid", gridTemplateColumns: "minmax(300px, 440px) minmax(0, 1fr)",
          gap: "var(--spacing-8)", alignItems: "stretch", marginTop: "var(--spacing-10)",
        }}>
          <div role="radiogroup" aria-label="Tier" className="exec-combo-tiers" style={{
            display: "grid", gap: "var(--spacing-4)",
          }}>
            {tiers.map((t) => (
              <ExecLabsTierRow key={t.tier} tier={t.tier} markers={t.markers} price={t.price}
                selected={t.tier === tier} onSelect={() => setTier(t.tier)} />
            ))}
          </div>

          <div className="exec-fade exec-combo-panel" style={{
            background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-2xl)", padding: "var(--spacing-8)",
            display: "grid", gridTemplateColumns: "minmax(200px, 320px) minmax(0, 1fr)",
            gap: "var(--spacing-8)", alignItems: "start",
          }}>
            <div className="exec-combo-photo" style={{
              position: "relative", aspectRatio: "16 / 15", overflow: "clip",
              borderRadius: "var(--radius-xl)", background: "var(--accent-subtle)",
            }}>
              {d.image ? (
                <img key={tier} src={d.image} alt={d.alt || ("Total Health Panel " + tier + " sample vials")}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : null}
              <div style={{
                position: "absolute", top: "var(--spacing-4)", right: "var(--spacing-4)",
                background: "var(--glass-solid)", color: "var(--color-white)",
                borderRadius: "var(--radius-lg)", padding: "var(--spacing-2) var(--spacing-4)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-1)",
              }}>
                <span style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--font-weight-semibold)", lineHeight: 1 }}>{markers}</span>
                <span style={{ fontSize: "var(--text-xs)", opacity: 0.85 }}>Biomarkers</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-5)", minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--spacing-5)" }}>
                <h3 style={{
                  margin: 0, fontSize: "var(--text-3xl)", lineHeight: 1.15,
                  fontWeight: "var(--font-weight-semibold)", color: "var(--text-default)",
                  textWrap: "balance",
                }}>{"Total Health Panel — " + tier}</h3>
                {d.price ? (
                  <div style={{
                    flexShrink: 0, fontSize: "var(--text-3xl)", lineHeight: 1.1,
                    fontWeight: "var(--font-weight-semibold)", color: "var(--text-default)",
                  }}>{d.price}</div>
                ) : null}
              </div>
              <div>
                <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)", color: "var(--text-default)" }}>{markers} Biomarkers tested</div>
                <p style={{ margin: "var(--spacing-2) 0 0", fontSize: "var(--text-base)", lineHeight: 1.55, color: "var(--fg-muted)", maxWidth: "40em" }}>{EXEC_LABS_PDP_DESCRIPTION}</p>
              </div>
              {OptionGroup ? <OptionGroup label="Sex" options={sexes} value={sex} onChange={setSex} /> : null}
              {OptionGroup ? <OptionGroup label="Lab review" options={reviews} value={review} onChange={setReview} /> : null}
              <ExecCta label="Book My Health Test" style={{ marginTop: "var(--spacing-2)", alignSelf: "flex-start" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 6 · ⚙ Biomarker carousel (live module) ──────────────────────────────────
function ExecLabsSignals() {
  return (
    <section data-screen-label="Biomarker Carousel" style={{
      background: "var(--bg-tertiary)", fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-8) 0",
    }}>
      <div className="exec-fade">
        <ChimeLabsSignalsSection theme="lab" defaultTag="Energy" />
      </div>
    </section>
  );
}

// ── 7 · Why different ───────────────────────────────────────────────────────
// The dark statement band with the persona still (the WL page's Problem band).
function ExecLabsWhy() {
  return (
    <section data-screen-label="Why Different" style={{
      background: "var(--exec-band-dark)", color: "var(--exec-ink-light)",
      fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-24) var(--spacing-6)", overflow: "hidden",
    }}>
      <div className="exec-problem-grid" style={{
        maxWidth: 1280, margin: "0 auto", display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 400px)",
        gap: "var(--spacing-12)", alignItems: "center",
      }}>
        <div>
          {/* 14em (not the Problem band's 18em): at 1440 the wider box broke
              the line after "Just" and orphaned "Read". */}
          <h2 className="exec-scrub" style={{
            margin: 0, fontSize: "clamp(28px, 3.6vw, 54px)",
            lineHeight: 1.12, fontWeight: "var(--font-weight-medium)",
            letterSpacing: "-0.015em", maxWidth: "14em", textWrap: "balance",
          }}>Insight You Can Act On, Not Just Read</h2>
          <p className="exec-fade" style={{
            margin: "var(--spacing-10) 0 0", maxWidth: "34em",
            fontSize: "var(--text-xl)", lineHeight: 1.55,
            color: "var(--exec-ink-light)", opacity: 0.78,
          }}>Every panel is reviewed by a licensed provider and translated into next
            steps, not just numbers.</p>
        </div>
        {/* The same executive as the hero loop, after hours, reading his own
            results — the still is the claim. Dusk so it sits inside the band. */}
        <figure className="exec-still exec-figure" style={{ margin: 0 }}>
          <img src="uploads/executive-labs-review.webp" loading="lazy" decoding="async"
            alt="The executive at his desk after hours, reading a printed lab report beside a tablet"
            style={{
              display: "block", width: "100%", aspectRatio: "4 / 5",
              objectFit: "cover", objectPosition: "50% 40%",
              borderRadius: "var(--radius-2xl)",
            }} />
        </figure>
      </div>
    </section>
  );
}

// ── 8 · 3-step close ───────────────────────────────────────────────────────
function ExecLabsClose() {
  return (
    <section data-screen-label="3-Step Close" style={{
      background: "var(--bg-default)", fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-24) var(--spacing-6)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <h2 className="exec-heading" style={{
          margin: "0 0 var(--spacing-4)", color: "var(--text-default)",
          fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.02,
          fontWeight: "var(--font-weight-bold)", letterSpacing: "-0.02em",
          maxWidth: "14em",
        }}>Receiving Information Is Only One Step</h2>
        <p className="exec-fade" style={{
          margin: 0, color: "var(--text-secondary)", fontSize: "var(--text-lg)",
          lineHeight: 1.55, maxWidth: "30em",
        }}>Understanding what comes next is where real value begins.</p>
        <div className="exec-kicker-grid exec-close-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "var(--spacing-8)", marginTop: "var(--spacing-12)",
        }}>
          {EXEC_LABS_STEPS.map((s) => (
            <div key={s.label} className="exec-fade exec-step">
              <ExecKicker label={s.label} num={s.n}
                color="var(--text-muted)" border="var(--border-default)" />
              <p style={{
                margin: "var(--spacing-5) 0 0", color: "var(--text-secondary)",
                fontSize: "var(--text-base)", lineHeight: 1.55,
              }}>{s.body}</p>
            </div>
          ))}
        </div>
        <ExecCta label="Discover Your Health Path" className="exec-fade" style={{ marginTop: "var(--spacing-12)" }} />
      </div>
    </section>
  );
}

// ── 9 · Membership ─────────────────────────────────────────────────────────
function ExecLabsMembership() {
  return (
    <section data-screen-label="Membership" style={{
      background: "var(--accent-subtle)", fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-24) var(--spacing-6)",
    }}>
      <div className="exec-membership-grid" style={{
        maxWidth: 1280, margin: "0 auto", display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 520px)",
        gap: "var(--spacing-12)", alignItems: "center",
      }}>
        <div>
          <h2 className="exec-heading" style={{
            margin: "0 0 var(--spacing-6)", color: "var(--text-default)",
            fontSize: "clamp(28px, 3.6vw, 54px)", lineHeight: 1.12,
            fontWeight: "var(--font-weight-medium)", letterSpacing: "-0.015em",
            /* 12em: at 16em the line broke before "Do". */
            maxWidth: "12em", textWrap: "balance",
          }}>Insights That Update As You Do</h2>
          <p className="exec-fade" style={{
            margin: 0, color: "var(--text-secondary)", fontSize: "var(--text-xl)",
            lineHeight: 1.55, maxWidth: "30em",
          }}>Ongoing panels and provider review, not a one-time snapshot.</p>
          {/* TODO(membership): no membership page exists yet, so this routes to
              the assessment as a stand-in — same as the WL landing and the live
              category pages. Point it at the real page when one exists. */}
          <ExecCta label="Explore The Chime Membership" className="exec-fade" style={{ marginTop: "var(--spacing-8)" }} />
        </div>
        {/* Same executive, the morning after — shared with the WL landing. */}
        <figure className="exec-membership-figure" style={{ margin: 0 }}>
          <img src="uploads/executive-membership.webp" loading="lazy" decoding="async"
            alt="The same executive walking through an office lobby with a gym bag and a coffee"
            style={{
              display: "block", width: "100%", aspectRatio: "3 / 2",
              objectFit: "cover", objectPosition: "50% 30%",
              borderRadius: "var(--radius-2xl)",
            }} />
        </figure>
      </div>
    </section>
  );
}

// ── 10 · Final CTA ──────────────────────────────────────────────────────────
function ExecLabsFinalCta() {
  return (
    <section data-screen-label="Final CTA" style={{
      position: "relative", overflow: "hidden",
      background: "var(--exec-band-dark)", fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-24) var(--spacing-6)",
    }}>
      {/* The executive with his family at golden hour — how he feels, shown.
          Shared with the WL landing; empty alt + aria-hidden, the headline
          already says it. */}
      <img className="exec-final-bg" src="uploads/executive-final.webp" alt=""
        aria-hidden="true" loading="lazy" decoding="async" />
      <div className="exec-final-scrim" aria-hidden="true" />
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 720, margin: "0 auto", textAlign: "center",
      }}>
        <h2 className="exec-heading" style={{
          margin: "0 0 var(--spacing-8)", color: "var(--exec-ink-light)",
          fontSize: "clamp(36px, 5.2vw, 68px)", lineHeight: 0.98,
          fontWeight: "var(--font-weight-bold)", letterSpacing: "-0.02em",
        }}>The Data Behind How You Feel</h2>
        <ExecCta label="Discover Your Health Path" />
      </div>
    </section>
  );
}

function ExecutiveLabsPage() {
  // Layout effect, not effect: runs after the DOM is committed and BEFORE the
  // browser paints, so the motion layer's initial `from` states are in place
  // for the first frame. The returned cleanup reverts everything on unmount.
  React.useLayoutEffect(() => {
    if (!window.ExecMotion) return undefined;
    return window.ExecMotion.mount(document);
  }, []);
  return (
    <React.Fragment>
      <ExecChrome />
      <main>
        <ExecLabsHero />
        <ExecLabsRecognition />
        <ExecLabsIceberg />
        <ExecLabsInsight />
        <ExecLabsTiersConfigurator />
        <ExecLabsSignals />
        <ExecLabsWhy />
        <ExecLabsClose />
        <ExecLabsMembership />
        <ExecLabsFinalCta />
      </main>
      {/* The site footer (ui_kits/homepage/Footer.jsx), not the WL landing's
          thin ExecFooter — asked for on 2026-08-21 so this page closes the way
          the main pages do (nav columns, legal links, disclaimer). */}
      <ChimeFooter />
    </React.Fragment>
  );
}

Object.assign(window, {
  ExecutiveLabsPage, ExecLabsHero, ExecLabsRecognition, ExecLabsIceberg,
  ExecIcebergGraphic, ExecLabsInsight, ExecLabsTiersConfigurator,
  ExecLabsTierRow, ExecLabsSignals, ExecLabsWhy,
  ExecLabsClose, ExecLabsMembership, ExecLabsFinalCta,
});
