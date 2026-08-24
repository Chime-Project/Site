// Chime Health — Persona 1 (The Executive) · Landing 1 of 3 · Weight Loss.
//
// Built on nad.html / ui_kits/nad/NadPage.jsx: same layout language — fixed
// pill chrome, a colour-blocked hero with giant display type and a cropped
// wordmark, numbered kickers, a scroll-parallax dark band, vertical benefit
// strips, a split grid with an oversized glyph, and a centred dark closer.
// Re-themed from cadmium to the Weight Loss ramp (celeste/tide) and re-copied
// for the Executive.
//
// COPY SOURCE — "Chime_Health_LandingPages_Persona1_Executive (1).pdf" in
// uploads/ (untracked; uploads/*.pdf is gitignored and this repo's root is
// public). Every headline, subhead and CTA is that document's, verbatim. The
// only copy NOT from it is the four step bodies in ExecSteps, which are lifted
// from the live weight-loss.html so they carry the same approved wording.
//
// Palette lives in executive-weight-loss.html as --exec-* page vars, so this
// file stays free of palette primitives (theme guard). The chrome, CTA, kicker,
// badge and footer are shared with the other Persona 1 landings and live in
// ui_kits/executive/ExecutiveCore.jsx (the page loads it first).
//
// MOTION lives in ui_kits/executive/ExecutiveMotion.js (GSAP: ScrollTrigger +
// SplitText), mounted from a layout effect at the bottom of this file. This
// kit only exposes hooks for it: `exec-heading` (masked line reveal),
// `exec-fade` (batched fade-up), `exec-cta` (magnetic), `exec-hero-*` /
// `exec-kicker-rule` (drawn hairlines), and the figure classes (clip reveals).
// Nothing here animates on its own except the CSS badge spin — the page
// renders fully at rest when GSAP is absent or reduced motion is on.

// The five steps of section 5, as a colour ramp. Ink flips to light on the last
// two: navy clears AA on strips 1-3, white clears it on 4-5. The flip is
// POSITIONAL — reorder these and the contrast breaks.
// (The --exec-strip-* ramp vars keep their name — they are the page's tokens —
// even though the panels are now .exec-wlpath-*, see ExecPath below.)
const EXEC_PATH = [
  { label: "You", bg: "var(--exec-strip-1)", ink: "var(--exec-ink-dark)" },
  { label: "Wellness Coach", bg: "var(--exec-strip-2)", ink: "var(--exec-ink-dark)" },
  { label: "Provider", bg: "var(--exec-strip-3)", ink: "var(--exec-ink-dark)" },
  { label: "Personalized Plan", bg: "var(--exec-strip-4)", ink: "var(--exec-ink-light)" },
  { label: "Ongoing Support", bg: "var(--exec-strip-5)", ink: "var(--exec-ink-light)" },
];

const EXEC_VALUES = [
  "Personalized Plans",
  "Licensed Provider Oversight",
  "Membership",
  "Efficient Process",
  "Ongoing Insights",
];

const EXEC_STEPS = [
  { n: "01", label: "Discover", body: "Tell us about your goals." },
  { n: "02", label: "Connect", body: "Meet your care team." },
  { n: "03", label: "Personalize", body: "Receive your personalized plan." },
  { n: "04", label: "Move Forward", body: "Stay supported along the way." },
];

// execOpenAssessment, ExecKicker, ExecSpinBadge, ExecCta, ExecChrome and
// ExecFooter moved verbatim to ui_kits/executive/ExecutiveCore.jsx (loaded
// before this kit) when the labs landing needed the same pieces.

// ── 1 · Hero ────────────────────────────────────────────────────────────────
function ExecHero() {
  // Reduced motion: hold the poster frame. autoplay is an attribute the browser
  // acts on before any CSS media query can intervene, so this has to be done to
  // the element itself — pause it and rewind to frame one.
  const videoRef = React.useRef(null);
  // Phones get the 640×360 rendition (0.7 MB) instead of the 1280×720 loop
  // (1.75 MB): autoplay fetches the file whatever preload says, so the only
  // lever is which file. Decided once at mount; the hero is object-fit: cover
  // either way, so a rotate mid-visit just shows the other crop, never breaks.
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
      position: "relative", overflow: "hidden", background: "var(--accent-default)",
      fontFamily: "var(--font-family-base)", minHeight: "100vh",
      /* border-box, explicitly. Nothing on this page sets box-sizing globally,
         so min-height was sizing the CONTENT box and the 96px of top padding
         was added on top of it — the hero measured 924px against a 900px
         viewport and pushed the value ribbon below the fold. */
      boxSizing: "border-box",
      display: "flex", flexDirection: "column",
      padding: "var(--spacing-24) var(--spacing-6) 0",
    }}>
      {/* Ambient loop behind everything. muted + playsInline are what let it
          autoplay at all on iOS; the poster carries the first frame so the band
          is never briefly empty on a slow connection. aria-hidden because it
          says nothing the copy does not — it is atmosphere, not content. */}
      <video ref={videoRef} className="exec-hero-video" src={heroSrc}
        poster="uploads/executive-hero-poster.webp"
        autoPlay muted loop playsInline aria-hidden="true" tabIndex={-1} />
      {/* Celeste scrim, heavier on the left. The headline needs the ~8:1 it gets
          on flat tide-300; over raw footage it would swing with every frame. The
          gradient keeps the text side effectively solid and lets the footage
          read on the right, where nothing but the wordmark sits. */}
      <div className="exec-hero-scrim" aria-hidden="true" />
      {/* A real positioned box, not display:contents. The video and scrim are
          absolutely positioned, and positioned elements paint above static ones
          whatever the DOM order — so the copy has to be positioned too or the
          scrim covers it. It also has to carry the section's flex column, or
          .exec-hero-bottom loses the flex:1 that pushes the wordmark down. */}
      <div className="exec-hero-copy" style={{
        position: "relative", zIndex: 2, flex: 1,
        display: "flex", flexDirection: "column",
      }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", gap: "var(--spacing-8)",
      }}>
        {/* Navy, not white. The page pins --accent-default one stop lighter than
            the theme's tide-500 for exactly this reason — see the note in
            executive-weight-loss.html. */}
        <h1 style={{
          margin: 0, color: "var(--exec-ink-dark)",
          fontSize: "clamp(40px, 5.4vw, 78px)", lineHeight: 0.98,
          fontWeight: "var(--font-weight-bold)", letterSpacing: "-0.02em",
          maxWidth: "11em",
        }}>Weight Loss Built For How You Perform</h1>
        <ExecSpinBadge />
      </div>
      {/* The hairline is a 1px block, not a border-top, so the motion layer can
          draw it left → right. 1px + the paragraph's top margin reproduces the
          old border + padding exactly. */}
      <div className="exec-hero-sub" style={{ marginTop: "var(--spacing-10)", maxWidth: 560 }}>
        <i className="exec-hero-rule" aria-hidden="true" style={{
          display: "block", height: 1, background: "var(--exec-hairline-dark)",
          transformOrigin: "0 50%",
        }} />
        <p style={{
          margin: "var(--spacing-5) 0 0", color: "var(--exec-ink-dark)", fontSize: "var(--text-xl)",
          lineHeight: 1.45, fontWeight: "var(--font-weight-medium)",
        }}>A personalized path, reviewed by a licensed provider, designed to fit
          the life you&rsquo;ve already built — not interrupt it.</p>
        <ExecCta label="Discover Your Weight Loss Path" style={{ marginTop: "var(--spacing-6)" }} />
      </div>
      <div className="exec-hero-bottom" style={{
        position: "relative", flex: 1, display: "flex", alignItems: "flex-end",
      }}>
        <div className="exec-hero-word" aria-hidden="true" style={{
          color: "var(--exec-ink-dark)", fontWeight: "var(--font-weight-bold)",
          fontSize: "clamp(72px, 12.5vw, 200px)", lineHeight: 0.82,
          letterSpacing: "-0.04em", marginLeft: "-0.04em",
          whiteSpace: "nowrap", userSelect: "none",
        }}>PERFORM</div>{/* sized against the frame — see the clamp above */}
      </div>
      </div>
      <ExecValueBar />
    </section>
  );
}

// ── 2 · Value bar ───────────────────────────────────────────────────────────
// Rendered INSIDE the hero, pinned to its bottom edge — see .exec-valuebar in
// executive-weight-loss.html. The hero is 92vh, so the ribbon lands above the
// fold, which is the whole point of it: five proof points the reader crosses
// before deciding whether to keep scrolling.
function ExecValueBar() {
  return (
    <section className="exec-valuebar" data-screen-label="Value Bar" style={{
      background: "var(--bg-elevated)",
      borderTop: "1px solid var(--border-default)",
      fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-5) var(--spacing-6)",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center",
        columnGap: "var(--spacing-5)", rowGap: "var(--spacing-3)",
      }}>
        {EXEC_VALUES.map((v, i) => (
          <React.Fragment key={v}>
            {/* Drawn, not typed: a "·" between items is read aloud as
                punctuation on every gap. */}
            {i > 0 ? (
              <span aria-hidden="true" className="exec-value-dot" style={{
                width: 4, height: 4, borderRadius: "50%", flex: "none",
                background: "var(--accent-default)",
              }}></span>
            ) : null}
            <span className="exec-value-item" style={{
              fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)",
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: "var(--text-muted)", whiteSpace: "nowrap",
            }}>{v}</span>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

// ── 3 · Problem identification ──────────────────────────────────────────────
function ExecProblem() {
  // The statement's scroll-linked reveal (word by word, scrubbed) lives in
  // ExecutiveMotion.js — it replaced the hand-rolled rAF scale this section
  // used to carry. The h2 is deliberately NOT `exec-heading`: the motion layer
  // targets it directly for the scrub treatment rather than the masked reveal.
  return (
    <section data-screen-label="Problem ID" style={{
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
          <h2 style={{
            margin: 0, fontSize: "clamp(28px, 3.6vw, 54px)",
            lineHeight: 1.12, fontWeight: "var(--font-weight-medium)",
            letterSpacing: "-0.015em", maxWidth: "18em",
          }}>You Don&rsquo;t Need Another Program. You Need One That Fits.</h2>
          <p className="exec-fade" style={{
            margin: "var(--spacing-10) 0 0", maxWidth: "34em",
            fontSize: "var(--text-xl)", lineHeight: 1.55,
            color: "var(--exec-ink-light)", opacity: 0.78,
          }}>Most plans assume you have hours for guesswork. Chime starts from your
            goals, labs, and schedule — and builds around them.</p>
        </div>
        {/* The same executive as the hero loop — the persona carried through
            the page, not stock. Dusk, not daylight: the band is dark and the
            picture has to sit inside it rather than punch a hole in it. */}
        <figure className="exec-problem-figure" style={{ margin: 0 }}>
          <img src="uploads/executive-problem.webp" loading="lazy" decoding="async"
            alt="An executive at his office window after hours, the city lit behind him"
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

// ── 4 · Solutions ───────────────────────────────────────────────────────────
function ExecSolutions() {
  return (
    <section data-screen-label="No Two Bodies" style={{
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
          }}>Because No Two Bodies Are The Same</h2>
          <p className="exec-fade" style={{
            margin: 0, color: "var(--text-secondary)", fontSize: "var(--text-xl)",
            lineHeight: 1.55, maxWidth: "26em",
          }}>Personalized Weight Loss Solutions — never &ldquo;pick your medication.&rdquo;</p>
          <ExecCta label="Discover Your Weight Loss Path" className="exec-fade" style={{ marginTop: "var(--spacing-8)" }} />
        </div>
        {/* The oversized glyph is "≠", not NAD's "+": this section's whole claim
            is that two bodies are NOT the same, and the mark states it before
            the headline is read. */}
        <div className="exec-glyph-visual" style={{
          position: "relative", minHeight: 460, display: "flex",
          alignItems: "center", justifyContent: "center", overflow: "hidden",
        }}>
          <span aria-hidden="true" style={{
            position: "absolute", fontWeight: "var(--font-weight-bold)",
            fontSize: "clamp(300px, 30vw, 500px)", lineHeight: 0.7,
            color: "var(--accent-default)", userSelect: "none",
            transform: "translateY(-4%)",
          }}>≠</span>
          <img src="uploads/vials/glp-1.webp" alt="A GLP-1 treatment vial" style={{
            position: "relative", height: "min(380px, 52vw)", marginLeft: "30%",
            filter: "drop-shadow(0 24px 32px rgb(0 0 0 / 0.18))",
          }} />
        </div>
      </div>
    </section>
  );
}

// ── 5 · Why different ───────────────────────────────────────────────────────
function ExecPath() {
  return (
    <section data-screen-label="Why Different" style={{
      background: "var(--bg-default)", fontFamily: "var(--font-family-base)",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "var(--spacing-16) var(--spacing-6) var(--spacing-10)",
      }}>
        <h2 className="exec-heading" style={{
          margin: "0 0 var(--spacing-4)", color: "var(--text-default)",
          fontSize: "clamp(28px, 3.4vw, 48px)", lineHeight: 1.05,
          fontWeight: "var(--font-weight-bold)", letterSpacing: "-0.02em",
          maxWidth: "18em",
        }}>Provider-Reviewed. Efficiently Delivered.</h2>
        <p className="exec-fade" style={{
          margin: 0, color: "var(--text-secondary)", fontSize: "var(--text-lg)",
          lineHeight: 1.55, maxWidth: "30em",
        }}>Every step built to respect your time.</p>
      </div>
      {/* The IA writes this row's subhead as an arrow chain
          (You → Wellness Coach → Provider → Personalized Plan → Ongoing
          Support). Drawn as the colour ramp cut into slanted-seam panels —
          restyled 2026-08-23 to the wellness landing's goal-strip language
          (lite: flat ramp grounds and numbered captions, no photos). The
          widening colour still does the work the arrows did, and a hovered
          panel still widens (this section's own beat, kept from the strip
          design). Classes are exec-wlpath-*, NOT exec-strip: the motion
          layer's care-path wipe writes inline clip-path insets that would
          flatten these seam polygons — that block now no-ops on this page,
          and the captions cascade in via exec-fade instead. */}
      <div className="exec-wlpath" role="list">
        {EXEC_PATH.map((s, i) => (
          <div key={s.label} role="listitem" className="exec-wlpath-panel"
            style={{ background: s.bg, color: s.ink, fontFamily: "var(--font-family-base)" }}>
            <div className="exec-fade exec-wlpath-caption">
              <span style={{
                display: "block", fontSize: "var(--text-sm)", letterSpacing: "0.08em",
                textTransform: "uppercase", fontWeight: "var(--font-weight-semibold)",
                opacity: 0.8,
              }}>{"Step 0" + (i + 1)}</span>
              <span style={{
                display: "block", marginTop: "var(--spacing-2)",
                fontSize: "clamp(20px, 1.7vw, 26px)", lineHeight: 1.2,
                fontWeight: "var(--font-weight-medium)", letterSpacing: "-0.01em",
                textWrap: "balance",
              }}>{s.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 6 · Calculator (⚙ live module) ──────────────────────────────────────────
// NO data-theme ON THIS SECTION, deliberately. The attribute re-triggers the
// [data-theme="weight-loss"] block in tokens/colors.css AT THAT ELEMENT, which
// redefines --accent-default back to tide-500 and silently defeats the lighter
// pin the page sets on :root — the band rendered a stop darker than the hero
// and footer it is supposed to match. The page already declares the theme on
// <html>, so the attribute was redundant as well as harmful.
function ExecCalculator() {
  return (
    <section data-screen-label="Calculator" style={{
      background: "var(--accent-default)", fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-20) var(--spacing-6)",
    }}>
      <div style={{ maxWidth: 1104, margin: "0 auto" }}>
        <h2 className="exec-heading" style={{
          margin: "0 0 var(--spacing-4)", color: "var(--exec-ink-dark)",
          fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.02,
          fontWeight: "var(--font-weight-bold)", letterSpacing: "-0.02em",
        }}>See Your Path Before You Start</h2>
        <p className="exec-fade" style={{
          margin: "0 0 var(--spacing-10)", color: "var(--exec-ink-dark)",
          fontSize: "var(--text-lg)", lineHeight: 1.55, maxWidth: "34em",
        }}>Enter a starting point and a goal — get an estimated timeline in under
          a minute. Your provider builds the actual plan from there.</p>
        {/* The live module, unmodified. It already defaults to the Standard pace
            the IA asks for, and its milestone labels ("First check-in" /
            "Building momentum" / "Sustain & thrive") already read efficient —
            verified before this page was written. Do not "fix" what complies. */}
        <div className="exec-fade">
          <WLCalculatorCard />
        </div>
      </div>
    </section>
  );
}

// ── 7 · How it works ────────────────────────────────────────────────────────
function ExecSteps() {
  return (
    <section data-screen-label="How It Works" style={{
      background: "var(--bg-default)", fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-24) var(--spacing-6)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <h2 className="exec-heading" style={{
          margin: "0 0 var(--spacing-12)", color: "var(--text-default)",
          fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.02,
          fontWeight: "var(--font-weight-bold)", letterSpacing: "-0.02em",
          maxWidth: "14em",
        }}>A Path That Moves As Fast As You Do</h2>
        <div className="exec-steps-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--spacing-8)",
        }}>
          {EXEC_STEPS.map((s) => (
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
      </div>
    </section>
  );
}

// ── 8 · Membership ──────────────────────────────────────────────────────────
function ExecMembership() {
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
            maxWidth: "16em",
          }}>Ongoing — Without Becoming One More Thing To Manage</h2>
          <p className="exec-fade" style={{
            margin: 0, color: "var(--text-secondary)", fontSize: "var(--text-xl)",
            lineHeight: 1.55, maxWidth: "30em",
          }}>Chime&rsquo;s Membership carries the ongoing part, the way a well-run
            operation would.</p>
          {/* TODO(membership): there is no membership page on this site yet, so
              this CTA routes to the assessment as a stand-in — the same thing the
              live category pages' membership buttons do. Point it at the real
              page when one exists. */}
          <ExecCta label="Explore The Chime Membership" className="exec-fade" style={{ marginTop: "var(--spacing-8)" }} />
        </div>
        {/* Same executive, the morning after the "ongoing part" is handled:
            gym bag, coffee, on his way in. 3:2 so it reads as a still beside
            the two-line statement, not a second portrait. */}
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

// ── 9 · Final CTA ───────────────────────────────────────────────────────────
function ExecFinalCta() {
  return (
    <section data-screen-label="Final CTA" style={{
      position: "relative", overflow: "hidden",
      background: "var(--exec-band-dark)", fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-24) var(--spacing-6)",
    }}>
      {/* The executive with his family at golden hour — "the life you're
          building", shown rather than asserted. The family sits in the right
          half of the frame on purpose: the headline is centred, so the scrim
          stays heaviest where the text is and lets the picture read at the
          edge. Empty alt + aria-hidden: the headline already says it. */}
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
        }}>Your Health Should Support The Life You&rsquo;re Building</h2>
        <ExecCta label="Discover Your Weight Loss Path" />
      </div>
    </section>
  );
}

function ExecutiveWLPage() {
  // Layout effect, not effect: it runs after the DOM is committed and BEFORE
  // the browser paints, so the motion layer's initial `from` states are in
  // place for the very first frame — no flash of the resting page. The
  // returned cleanup reverts every tween/trigger/split on unmount.
  React.useLayoutEffect(() => {
    if (!window.ExecMotion) return undefined;
    return window.ExecMotion.mount(document);
  }, []);
  return (
    <React.Fragment>
      <ExecChrome />
      <main>
        <ExecHero />
        <ExecProblem />
        <ExecSolutions />
        <ExecPath />
        <ExecCalculator />
        <ExecSteps />
        <ExecMembership />
        <ExecFinalCta />
      </main>
      <ExecFooter />
    </React.Fragment>
  );
}

Object.assign(window, {
  ExecutiveWLPage, ExecHero, ExecValueBar, ExecProblem,
  ExecSolutions, ExecPath, ExecCalculator, ExecSteps, ExecMembership,
  ExecFinalCta,
});
