// Chime Health — Persona 1 (The Executive) · Landing 3 of 3 · Energy & Wellness.
//
// Built on executive-labs.html / ExecutiveLabsPage.jsx: the same layout
// language — fixed pill chrome, a colour-blocked hero with giant display type
// and a cropped wordmark over the same ambient loop of the same executive,
// numbered kickers, a dark statement band, and a centred dark closer —
// re-themed from the Labs ramp (iris) to the Energy & Wellness ramp (cadmium)
// and re-copied for Landing 3.
//
// COPY SOURCE — "Chime_Health_LandingPages_Persona1_Executive (1).pdf" in
// uploads/ (untracked; uploads/*.pdf is gitignored and this repo's root is
// public). Every headline, subhead and CTA is that document's, verbatim, with
// deliberate exceptions lifted from live pages so they carry approved wording:
// the 3-Step Close's subtitle and step bodies (wellness.html's Simple Path),
// and the "Did You Know?" card facts (the NAD+ line is nad.html's, LIPO-C and
// Provider Oversight are faqs.js / wellness.html wording).
//
// ⚙ INTERACTIVE MODULE: the IA's row 5 carousel started as an embed of
// ChimeInsightStackSection and was redesigned on 2026-08-23 into this page's
// own full-screen marquee wall (ExecWnWall below) — the labs kit stays loaded
// only for INSIGHT_ICONS, and its fan renders unchanged on labs.html /
// executive-labs.html. The IA's rows 2+3 (the ChimeHWSymptomsSection embed
// with performance-framed labels) were CUT on 2026-08-28 (user request); the
// module's optional `cards` prop stays in the wellness kit, defaulting to the
// old behaviour, so wellness.html renders exactly what it did.
//
// Palette lives in executive-wellness.html as --exec-* page vars, so this file
// stays free of palette primitives (theme guard). The chrome, CTA, kicker and
// badge come from ui_kits/executive/ExecutiveCore.jsx (the footer is the site
// footer, ui_kits/homepage/Footer.jsx); motion from
// ui_kits/executive/ExecutiveMotion.js, mounted from a layout effect at the
// bottom of this file. Hooks this kit exposes for it: `exec-heading` (masked
// line reveal), `exec-fade` (batched fade-up), `exec-cta` (magnetic),
// `exec-scrub` (word-by-word scroll reveal), `exec-membership-figure` (clip
// reveal) and `exec-kicker-grid` + `exec-kicker-rule` (drawn hairlines).
// Nothing here animates on its own except the CSS badge spin — the page
// renders fully at rest when GSAP is absent or reduced motion is on.

// Section 4. The IA's six goals, verbatim, in its order — each drawn as the
// executive LIVING that goal (the Recognition-triptych treatment from the labs
// landing, asked for on 2026-08-23): row 1 = goals 1–3, row 2 = goals 4–6.
// "More Energy" reuses the Membership still (the one clearly positive frame
// that already existed); the other five are new nano_banana_pro stills off the
// same character sheet (jobs c929ebd3-…, 8b862263-…, 5a73dfa9-…, 39d6bb72-…,
// e42ce504-… — the first focus take drew an Apple mark on a tablet and was
// re-shot holding a printed brief instead; check devices for logos).
const EXEC_WN_GOALS = [
  { goal: "More Energy", num: "01", image: "uploads/executive-membership.webp",
    alt: "The executive arriving through a bright glass lobby with a gym bag and a coffee",
    focus: "57% 30%" },
  { goal: "Sharper Focus", num: "02", image: "uploads/executive-goal-focus.webp",
    alt: "The same executive at his corner-office window mid-morning, printed brief in hand, clear-eyed",
    focus: "50% 25%" },
  { goal: "Better Recovery", num: "03", image: "uploads/executive-goal-recovery.webp",
    alt: "The same executive sitting tall on a gym bench after a workout, towel round his neck, smiling easily",
    focus: "50% 22%" },
  { goal: "Healthy Aging", num: "04", image: "uploads/executive-goal-aging.webp",
    alt: "The same executive mid-stride on a sunrise jog along a leafy park path",
    focus: "50% 22%" },
  { goal: "Greater Vitality", num: "05", image: "uploads/executive-goal-vitality.webp",
    alt: "The same executive laughing as he throws a football at golden hour, his teenage son behind him",
    focus: "50% 28%" },
  { goal: "Feeling Like Yourself Again", num: "06", image: "uploads/executive-goal-himself.webp",
    alt: "The same executive relaxed at his kitchen window in the early morning with a mug of coffee",
    focus: "50% 25%" },
];

// Section 5. The IA's five items in its order, "each framed as 'Did You
// Know?', never a hard sell" — so the framing is literal (every fact opens
// with it) and nothing here carries a price. Accent stops are positional,
// front to back, exactly as the default stack assigns them.
const EXEC_WN_CARDS = [
  { key: "nad", title: "NAD+",
    sub: "Did you know? NAD+ is one of the most discussed wellness therapies among individuals focused on energy, recovery, and healthy aging.",
    accent: "var(--accent-active)", numColor: "var(--accent-active)", icon: "bolt", anim: "flicker" },
  { key: "lipoc", title: "LIPO-C",
    sub: "Did you know? Chime may offer LIPO-C as part of its wellness solutions.",
    accent: "var(--accent-strong)", numColor: "var(--accent-strong)", icon: "droplet", anim: "beat" },
  { key: "coaching", title: "Wellness Coaching",
    sub: "Did you know? Coaching brings support, accountability, and encouragement along the way.",
    accent: "var(--accent-hover)", numColor: "var(--accent-hover)", icon: "nodes", anim: "wiggle" },
  { key: "labs", title: "Labs & Health Insights",
    sub: "Did you know? Hundreds of biomarkers can be turned into a clear picture.",
    accent: "var(--accent-default)", numColor: "var(--accent-default)", icon: "trendingUp", anim: "draw" },
  { key: "provider", title: "Provider Oversight",
    sub: "Did you know? Providers help guide care decisions and recommendations.",
    accent: "var(--accent-border)", numColor: "var(--accent-strong)", icon: "heart", anim: "beat" },
];

// Section 6. Titles are the IA's chain (Personalized Guidance → Wellness Coach
// Support → Provider Oversight); the bodies are the live wellness.html Simple
// Path copy, verbatim.
const EXEC_WN_STEPS = [
  { n: "01", label: "Personalized Guidance", body: "A path designed around your goals, lifestyle, and needs." },
  { n: "02", label: "Wellness Coach Support", body: "Support, accountability, and encouragement along the way." },
  { n: "03", label: "Provider Oversight", body: "Providers help guide care decisions and recommendations." },
];

// ── 1 · Hero ────────────────────────────────────────────────────────────────
// The same ambient loop as the other two landings — same executive, same four
// scenes — because the persona, not the product, is what carries across these
// three pages (and a reader arriving from either sibling already has it
// cached). Wellness-specific footage is a follow-up, not a blocker.
function ExecWnHero() {
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
      /* No value ribbon on this landing, so the hero keeps a small bottom
         inset and the wordmark is its floor — as on the labs landing. */
      padding: "var(--spacing-24) var(--spacing-6) var(--spacing-6)",
    }}>
      <video ref={videoRef} className="exec-hero-video" src={heroSrc}
        poster="uploads/executive-hero-poster.webp"
        autoPlay muted loop playsInline aria-hidden="true" tabIndex={-1} />
      {/* Cadmium scrim, heavier on the left: the headline needs the contrast
          it gets on the flat ground, and over raw footage it would swing frame
          to frame. The gradient keeps the text side effectively solid and lets
          the footage read on the right, where only the wordmark sits. */}
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
          }}>Feel Like Yourself Again — Without Losing Momentum</h1>
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
          }}>Personalized energy and recovery support, reviewed by a licensed
            provider, built around a schedule that doesn&rsquo;t slow down.</p>
          <ExecCta label="Discover Your Wellness Path" style={{ marginTop: "var(--spacing-6)" }} />
        </div>
        <div className="exec-hero-bottom" style={{
          position: "relative", flex: 1, display: "flex", alignItems: "flex-end",
        }}>
          {/* The page's keyword — the hero hook's own word, the thing this
              landing promises not to cost. */}
          <div className="exec-hero-word" aria-hidden="true" style={{
            color: "var(--exec-ink-dark)", fontWeight: "var(--font-weight-bold)",
            fontSize: "clamp(72px, 12.5vw, 200px)", lineHeight: 0.82,
            letterSpacing: "-0.04em", marginLeft: "-0.04em",
            whiteSpace: "nowrap", userSelect: "none",
          }}>MOMENTUM</div>
        </div>
      </div>
    </section>
  );
}

// ── 4 · Goal strips ─────────────────────────────────────────────────────────
// The IA row is a bare list of six goals with no bodies and no CTA, so the
// pictures do the talking: two full-bleed rows of three panels in the labs
// landing's Recognition-triptych language — slanted seams cut by clip-path,
// the page ground showing through a hairline gap, the photo zooming under the
// pointer — except every frame here is the POSITIVE mirror: the same executive
// living each goal. Row 2 mirrors the slant so the pair reads as one set, not
// a repeat. Same three-nested-boxes structure as the labs strip (panel = clip,
// figure = frame, media = hover zoom); no curtain motion though — that block
// in ExecutiveMotion.js keys off `.exec-recognition-strip`, deliberately NOT
// used here (it would pin the hero, which sits two sections away). The
// captions carry the only entrance motion (exec-fade cascade).
function ExecWnGoals() {
  const rows = [EXEC_WN_GOALS.slice(0, 3), EXEC_WN_GOALS.slice(3)];
  return (
    <section data-screen-label="Goal Cards" className="exec-goals" style={{
      background: "var(--bg-tertiary)", fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-24) 0 0", overflow: "hidden",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 var(--spacing-6)" }}>
        <h2 className="exec-heading" style={{
          margin: 0, color: "var(--text-default)",
          fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.02,
          fontWeight: "var(--font-weight-bold)", letterSpacing: "-0.02em",
          maxWidth: "14em",
        }}>Wellness Means Different Things To Different People</h2>
      </div>
      <div style={{ marginTop: "var(--spacing-12)" }}>
        {rows.map((row, r) => (
          <div key={r} role="list"
            className={"exec-goals-strip" + (r === 1 ? " exec-goals-strip-alt" : "")}>
            {row.map((g) => (
              <div key={g.goal} role="listitem" className="exec-goals-panel">
                <figure className="exec-goals-figure" style={{
                  margin: 0, background: "var(--exec-band-dark)", color: "var(--exec-ink-light)",
                }}>
                  <div className="exec-goals-media">
                    <img src={g.image} alt={g.alt} loading="lazy" decoding="async" style={{
                      position: "absolute", inset: 0, width: "100%", height: "100%",
                      objectFit: "cover", objectPosition: g.focus, display: "block",
                    }} />
                  </div>
                  <div className="exec-goals-scrim" aria-hidden="true" />
                  <figcaption className="exec-fade exec-goals-caption" style={{
                    position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 2,
                  }}>
                    <span style={{
                      display: "block", fontSize: "var(--text-sm)", letterSpacing: "0.08em",
                      textTransform: "uppercase", fontWeight: "var(--font-weight-semibold)",
                      opacity: 0.8,
                    }}>{"Goal " + g.num}</span>
                    <span style={{
                      display: "block", marginTop: "var(--spacing-2)",
                      fontSize: "clamp(22px, 1.9vw, 30px)", lineHeight: 1.2,
                      fontWeight: "var(--font-weight-medium)", letterSpacing: "-0.01em",
                      maxWidth: "12em", textWrap: "balance",
                    }}>{g.goal}</span>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 5 · ⚙ "Did You Know?" wall (full-screen marquee) ────────────────────────
// Redesigned 2026-08-23 (user request): a full-viewport section. The five
// cards keep the fan's exact visual language — 10px accent-stop border,
// radius-3xl, translucent white ground, title + fact top-right, big line icon
// centre, Explore → bottom-right (see InsightCardStack in
// ui_kits/labs/InsightStackSection.jsx) — but stack Pinterest-style in four
// columns of varying card heights that drift vertically in a continuous
// marquee (alternating direction, each column its own period; hover pauses;
// reduced motion holds still). The section title floats over the wall as a
// card of the same language. The labs kit is still LOADED — INSIGHT_ICONS is
// a top-level const of its <script>, i.e. a global lexical binding — but the
// fan component is no longer mounted on this page.
//
// The wall is aria-hidden (its cards repeat many times and move); the five
// facts are rendered once more as a visually-hidden list with real links, so
// assistive tech gets the content exactly once, static.

// Column recipes: [card index into EXEC_WN_CARDS, minHeight px]. Sequences
// are duplicated in the DOM (two .exec-wall-seq halves) so the -50% keyframe
// loops seamlessly. On phones only the first two columns render — between
// them they carry all five cards.
const EXEC_WN_WALL_COLUMNS = [
  { dir: "up", dur: "46s", cards: [[0, 380], [2, 300], [3, 440], [4, 320]] },
  { dir: "down", dur: "58s", cards: [[1, 320], [4, 420], [0, 300], [3, 360]] },
  { dir: "up", dur: "40s", cards: [[2, 400], [1, 300], [4, 340], [0, 440]] },
  { dir: "down", dur: "52s", cards: [[3, 310], [0, 400], [1, 350], [2, 320]] },
];

function ExecWnWallCard({ card, h }) {
  const icons = (typeof INSIGHT_ICONS !== "undefined") ? INSIGHT_ICONS : {};
  // The fan draws every icon at 140; here the icon scales with the card so
  // short masonry cards keep the same three-band composition.
  const iconSize = h >= 420 ? 140 : h >= 360 ? 118 : 96;
  return (
    <div style={{
      boxSizing: "border-box", border: "10px solid " + card.accent,
      borderRadius: "var(--radius-3xl)", background: "rgba(255, 255, 255, 0.72)",
      padding: "var(--spacing-5)", minHeight: h,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      boxShadow: "var(--shadow-sm)",
    }}>
      <div style={{ textAlign: "right" }}>
        <div style={{
          fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-semibold)",
          lineHeight: 1.25, color: "var(--text-default)",
        }}>{card.title}</div>
        <div style={{
          marginTop: "var(--spacing-1)", fontSize: "var(--text-sm)",
          lineHeight: 1.4, color: "var(--fg-muted)",
        }}>{card.sub}</div>
      </div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        color: card.numColor,
      }}>
        <div className="insight-icon">
          {icons[card.icon] ? <Icon size={iconSize} strokeWidth={1.5}>{icons[card.icon]}</Icon> : null}
        </div>
      </div>
      {/* tabIndex -1: the card scrolls by inside an aria-hidden marquee, so
          keyboard users reach the assessment through the static list below
          (and every other CTA on the page) instead of a moving target. */}
      <div style={{ textAlign: "right" }}>
        <a href="chimeAssessment.html" tabIndex={-1} onClick={execOpenAssessment} style={{
          fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)",
          color: card.numColor, textDecoration: "underline", textUnderlineOffset: "3px",
        }}>Explore →</a>
      </div>
    </div>
  );
}

function ExecWnWall() {
  return (
    <section data-screen-label="Did You Know Wall" className="exec-wall" style={{
      position: "relative", overflow: "hidden", minHeight: "100vh",
      background: "var(--bg-default)", fontFamily: "var(--font-family-base)",
      boxSizing: "border-box", display: "flex",
      alignItems: "center", justifyContent: "center",
      padding: "var(--spacing-16) var(--spacing-6)",
    }}>
      <div className="exec-wall-columns" aria-hidden="true">
        {EXEC_WN_WALL_COLUMNS.map((col, ci) => (
          <div key={ci} className="exec-wall-col">
            <div
              className={"exec-wall-track" + (col.dir === "down" ? " exec-wall-track-down" : "")}
              style={{ animationDuration: col.dur }}>
              {[0, 1].map((half) => (
                <div key={half} className="exec-wall-seq">
                  {col.cards.map(([c, h], i) => (
                    <ExecWnWallCard key={half + "-" + i} card={EXEC_WN_CARDS[c]} h={h} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* The title, floated as a card of the same language over the wall. */}
      <div className="exec-fade exec-wall-title" style={{
        position: "relative", zIndex: 3, boxSizing: "border-box",
        background: "var(--bg-elevated)", border: "10px solid var(--accent-default)",
        borderRadius: "var(--radius-3xl)", boxShadow: "var(--shadow-md)",
        padding: "var(--spacing-10) var(--spacing-12)",
        maxWidth: 620, textAlign: "center",
      }}>
        <h2 className="exec-heading" style={{
          margin: "0 0 var(--spacing-3)", color: "var(--text-default)",
          fontSize: "clamp(30px, 3.4vw, 48px)", lineHeight: 1.05,
          fontWeight: "var(--font-weight-bold)", letterSpacing: "-0.02em",
        }}>Discover What&rsquo;s Possible</h2>
        <p style={{
          margin: 0, color: "var(--text-secondary)",
          fontSize: "var(--text-lg)", lineHeight: 1.5,
        }}>Health is connected.</p>
      </div>
      {/* Static copy of the five facts for assistive tech (the wall above is
          aria-hidden and repeats them in motion). */}
      <ul className="exec-sr-only">
        {EXEC_WN_CARDS.map((c) => (
          <li key={c.key}>
            {c.title + " — " + c.sub + " "}
            <a href="chimeAssessment.html" onClick={execOpenAssessment}>Explore</a>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── 6 · 3-Step Close ────────────────────────────────────────────────────────
// The dark statement band (the labs landing's Why Different beat) — this
// landing's only long statement, so it carries the scrubbed word-by-word
// reveal. The CTA flips to the page ground: the pinned --primary-* pill would
// sit a shade above the band, and the hero already established ground-on-ink.
function ExecWnClose() {
  return (
    <section data-screen-label="3-Step Close" style={{
      background: "var(--exec-band-dark)", color: "var(--exec-ink-light)",
      fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-24) var(--spacing-6)", overflow: "hidden",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <h2 className="exec-scrub" style={{
          margin: 0, fontSize: "clamp(28px, 3.6vw, 54px)",
          lineHeight: 1.12, fontWeight: "var(--font-weight-medium)",
          letterSpacing: "-0.015em", maxWidth: "18em", textWrap: "balance",
        }}>Most Wellness Programs Focus On Products. Chime Focuses On People.</h2>
        <p className="exec-fade" style={{
          margin: "var(--spacing-10) 0 0", maxWidth: "34em",
          fontSize: "var(--text-xl)", lineHeight: 1.55,
          color: "var(--exec-ink-light)", opacity: 0.78,
        }}>Wellness should be personal, supportive, and designed around your
          individual goals.</p>
        <div className="exec-kicker-grid exec-close-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "var(--spacing-8)", marginTop: "var(--spacing-12)",
        }}>
          {EXEC_WN_STEPS.map((s) => (
            <div key={s.label} className="exec-fade exec-step">
              <ExecKicker label={s.label} num={s.n}
                color="var(--exec-ink-light)" border="var(--exec-hairline-light)" />
              <p style={{
                margin: "var(--spacing-5) 0 0", color: "var(--exec-ink-light)",
                opacity: 0.75, fontSize: "var(--text-base)", lineHeight: 1.55,
              }}>{s.body}</p>
            </div>
          ))}
        </div>
        <ExecCta label="Discover Your Wellness Path" className="exec-fade" style={{
          marginTop: "var(--spacing-12)",
          background: "var(--exec-ground)", color: "var(--exec-ink-dark)",
        }} />
      </div>
    </section>
  );
}

// ── 7 · Membership ──────────────────────────────────────────────────────────
function ExecWnMembership() {
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
            maxWidth: "12em", textWrap: "balance",
          }}>Support That Keeps Pace With You</h2>
          <p className="exec-fade" style={{
            margin: 0, color: "var(--text-secondary)", fontSize: "var(--text-xl)",
            lineHeight: 1.55, maxWidth: "30em",
          }}>Ongoing coaching and adjustment, not a single visit.</p>
          {/* TODO(membership): no membership page exists yet, so this routes to
              the assessment as a stand-in — same as the other two landings and
              the live category pages. Point it at the real page when one
              exists. */}
          <ExecCta label="Explore The Chime Membership" className="exec-fade" style={{ marginTop: "var(--spacing-8)" }} />
        </div>
        {/* Same executive, the morning after — shared with both siblings. */}
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

// ── 8 · Final CTA ───────────────────────────────────────────────────────────
function ExecWnFinalCta() {
  return (
    <section data-screen-label="Final CTA" style={{
      position: "relative", overflow: "hidden",
      background: "var(--exec-band-dark)", fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-24) var(--spacing-6)",
    }}>
      {/* The executive with his family at golden hour — how he feels, shown.
          Shared with both siblings; empty alt + aria-hidden, the headline
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
        }}>Feel Like Yourself Again</h2>
        <ExecCta label="Discover Your Wellness Path" />
      </div>
    </section>
  );
}

function ExecutiveWellnessPage() {
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
        <ExecWnHero />
        <ExecWnGoals />
        <ExecWnWall />
        <ExecWnClose />
        <ExecWnMembership />
        <ExecWnFinalCta />
      </main>
      {/* The site footer (ui_kits/homepage/Footer.jsx), as on the labs landing
          — asked for on 2026-08-21 so these pages close the way the main pages
          do (nav columns, legal links, disclaimer). */}
      <ChimeFooter />
    </React.Fragment>
  );
}

Object.assign(window, {
  ExecutiveWellnessPage, ExecWnHero, ExecWnGoals,
  ExecWnWall, ExecWnWallCard, ExecWnClose, ExecWnMembership, ExecWnFinalCta,
});
