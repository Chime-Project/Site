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
// Provider Oversight are faqs.js / wellness.html wording). The IA gives three
// of the five symptom labels; the last two ("Mornings that start in a fog",
// "Not performing at your best") are the live stack's "Mental Fog" and "Not
// Performing At Your Best" reframed into the same register — flagged to the
// client rather than invented silently.
//
// ⚙ THE TWO INTERACTIVE MODULES ARE THE LIVE ONES, embedded unmodified in what
// they render by default: ChimeHWSymptomsSection (the symptom card stack —
// whose Part 2 IS the IA's row 3 Reframe, same headline) and
// ChimeInsightStackSection (the auto-cycling card stack, reused as the IA's
// row 5 carousel). The persona overrides arrive through props that did not
// exist before and default to the old behaviour, so wellness.html, labs.html
// and executive-labs.html render exactly what they did.
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

// Section 2. The IA gives the first three verbatim and says "only the 5 labels
// change to performance framing"; see the copy-source note above for where the
// last two come from. Sentence case is the IA's own, kept as written.
const EXEC_WN_SYMPTOMS = [
  "Running on caffeine by 2pm",
  "Recovery that lags behind training",
  "Focus that fades before the day does",
  "Mornings that start in a fog",
  "Not performing at your best",
];

// Section 4. The IA's six goals, verbatim, in its order.
const EXEC_WN_GOALS = [
  "More Energy",
  "Sharper Focus",
  "Better Recovery",
  "Healthy Aging",
  "Greater Vitality",
  "Feeling Like Yourself Again",
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
      /* No value ribbon on this landing (the IA's row 2 is the symptom stack,
         a section of its own), so the hero keeps a small bottom inset and the
         wordmark is its floor — as on the labs landing. */
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

// ── 2 + 3 · ⚙ Symptom card stack + Reframe (live module) ───────────────────
// One embed covers both IA rows: the live module's Part 1 is the stacked-card
// "Does Any of This Sound Familiar?" (row 2, labels overridden to the
// performance framing) and its Part 2 is "What If Feeling Tired Isn't
// Normal?" — the IA's row 3 headline, word for word, with the live page's
// approved supporting copy. Mounted bare, not inside an `exec-fade` wrapper:
// the module is scroll-driven (position: sticky over several viewports) and
// carries its own ground, so a batched fade-up of the whole thing would fight
// its own motion.
function ExecWnSymptoms() {
  return <ChimeHWSymptomsSection cards={EXEC_WN_SYMPTOMS} />;
}

// ── 4 · Goal cards ──────────────────────────────────────────────────────────
// The IA row is a bare list of six goals with no bodies and no CTA, so the
// cards are deliberately spare: a numbered kicker and the goal in display
// type. The kicker hairlines draw in sequence (exec-kicker-grid), which is
// what makes six otherwise-static tiles read as a set being counted out.
function ExecWnGoals() {
  return (
    <section data-screen-label="Goal Cards" style={{
      background: "var(--bg-tertiary)", fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-24) var(--spacing-6)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <h2 className="exec-heading" style={{
          margin: 0, color: "var(--text-default)",
          fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.02,
          fontWeight: "var(--font-weight-bold)", letterSpacing: "-0.02em",
          maxWidth: "14em",
        }}>Wellness Means Different Things To Different People</h2>
        <div className="exec-kicker-grid exec-goals-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "var(--spacing-6)", marginTop: "var(--spacing-12)",
        }}>
          {EXEC_WN_GOALS.map((g, i) => (
            <div key={g} className="exec-fade exec-goal" style={{
              background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-2xl)", padding: "var(--spacing-6)",
              minHeight: 168, boxSizing: "border-box",
              display: "flex", flexDirection: "column",
              justifyContent: "space-between", gap: "var(--spacing-8)",
            }}>
              <ExecKicker label="Goal" num={"0" + (i + 1)}
                color="var(--text-muted)" border="var(--border-default)" />
              <span style={{
                fontSize: "clamp(22px, 2vw, 30px)", lineHeight: 1.15,
                fontWeight: "var(--font-weight-semibold)", letterSpacing: "-0.01em",
                color: "var(--text-default)", textWrap: "balance",
              }}>{g}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 5 · ⚙ "Did You Know?" carousel (live module) ────────────────────────────
// The labs kit's auto-cycling card stack, re-copied through its new props: the
// IA's headline, its five items, every fact opening with "Did you know?" and
// none carrying a price. The sub keeps the module's own approved line — it is
// exactly why these five sit in one stack. Each card's Explore → link opens
// the assessment, as the module always did.
function ExecWnCarousel() {
  return (
    <section data-screen-label="Did You Know Carousel" style={{
      background: "var(--bg-default)", fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-8) 0",
    }}>
      <div className="exec-fade">
        <ChimeInsightStackSection theme="wellness"
          title="Discover What&rsquo;s Possible" sub="Health is connected."
          cards={EXEC_WN_CARDS} />
      </div>
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
        <ExecWnSymptoms />
        <ExecWnGoals />
        <ExecWnCarousel />
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
  ExecutiveWellnessPage, ExecWnHero, ExecWnSymptoms, ExecWnGoals,
  ExecWnCarousel, ExecWnClose, ExecWnMembership, ExecWnFinalCta,
});
