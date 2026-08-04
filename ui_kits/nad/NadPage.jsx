// Chime Health — NAD+ upsell landing (nad.html).
// Layout language borrowed from neuemontreal.com (color-blocked bands, giant
// display type, vertical benefit strips, cropped wordmark footer), rebuilt on
// the weight-loss theme tokens and Quicksand.
// All product claims are verbatim from the reviewed copy in
// "uploads/Upsell product pages.md" (NAD+ block only) — do not add claims
// that are not in that document. [PRICE] is a placeholder awaiting the real
// number; the cart CTA routes to the assessment as a stand-in until a cart
// exists.
// Strip colors and inks are wired in nad.html as --nad-* page vars, so this
// file stays free of palette primitives (theme guard).

const NAD_BENEFITS = [
  { label: "Daily energy", bg: "var(--nad-strip-1)", ink: "var(--nad-ink-dark)" },
  { label: "Mental clarity", bg: "var(--nad-strip-2)", ink: "var(--nad-ink-dark)" },
  { label: "Recovery", bg: "var(--nad-strip-3)", ink: "var(--nad-ink-dark)" },
  { label: "Healthy aging", bg: "var(--nad-strip-4)", ink: "var(--nad-ink-dark)" },
  { label: "Overall vitality", bg: "var(--nad-strip-5)", ink: "var(--nad-ink-light)" },
  { label: "Feeling more like themselves again", bg: "var(--nad-strip-6)", ink: "var(--nad-ink-light)" },
];

function NadKicker({ label, num, color, border }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      paddingBottom: "var(--spacing-3)", borderBottom: "1px solid " + border,
      color, fontSize: "var(--text-sm)", letterSpacing: "0.08em",
      textTransform: "uppercase", fontWeight: "var(--font-weight-semibold)",
    }}>
      <span>{label}</span><span>{num}</span>
    </div>
  );
}

function NadSpinBadge() {
  return (
    <svg className="nad-spin nad-badge" width="150" height="150" viewBox="0 0 150 150"
      aria-hidden="true" style={{ flexShrink: 0, display: "block" }}>
      <defs>
        <path id="nad-badge-circle" fill="none"
          d="M75,75 m-56,0 a56,56 0 1,1 112,0 a56,56 0 1,1 -112,0" />
      </defs>
      <text style={{
        fill: "var(--nad-ink-dark)", fontFamily: "var(--font-family-base)",
        fontWeight: 700, fontSize: 13, letterSpacing: "0.26em",
      }}>
        <textPath href="#nad-badge-circle">CHIME · NAD+ · ENERGY · WELLNESS ·</textPath>
      </text>
    </svg>
  );
}

function NadCta({ label, style }) {
  return (
    <a href="#offer" style={{
      display: "inline-block", background: "var(--primary-default)",
      color: "var(--text-on-primary)", textDecoration: "none",
      borderRadius: "var(--radius-4xl)", padding: "16px 30px",
      fontWeight: "var(--font-weight-bold)", fontSize: "var(--text-lg)",
      letterSpacing: "0.01em", ...style,
    }}>{label}</a>
  );
}

function NadChrome() {
  return (
    <header data-screen-label="NAD Chrome" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 60,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "var(--spacing-4) var(--spacing-6)", pointerEvents: "none",
      fontFamily: "var(--font-family-base)",
    }}>
      <a href="index.html" aria-label="Chime Health home" style={{
        pointerEvents: "auto", display: "inline-flex", alignItems: "center",
        background: "var(--bg-elevated)", borderRadius: "var(--radius-4xl)",
        padding: "10px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
      }}>
        <img src="assets/logo-main.svg" alt="Chime" style={{ height: 18, display: "block" }} />
      </a>
      <a href="#offer" style={{
        pointerEvents: "auto", background: "var(--primary-default)",
        color: "var(--text-on-primary)", borderRadius: "var(--radius-4xl)",
        border: "1px solid rgb(255 255 255 / 0.4)",
        padding: "12px 22px", textDecoration: "none", letterSpacing: "0.02em",
        fontWeight: "var(--font-weight-semibold)", fontSize: "var(--text-sm)",
      }}>Add NAD+</a>
    </header>
  );
}

function NadHero() {
  return (
    <section data-screen-label="NAD Hero" style={{
      position: "relative", overflow: "hidden", background: "var(--accent-default)",
      fontFamily: "var(--font-family-base)", minHeight: "92vh",
      display: "flex", flexDirection: "column",
      padding: "var(--spacing-24) var(--spacing-6) 0",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", gap: "var(--spacing-8)",
      }}>
        {/* Ink, not white: the cadmium ground is too light for white text
            (≈2.2:1) — navy clears AA at any size. */}
        <h1 style={{
          margin: 0, color: "var(--nad-ink-dark)",
          fontSize: "clamp(40px, 5.4vw, 78px)", lineHeight: 0.98,
          fontWeight: "var(--font-weight-bold)", letterSpacing: "-0.02em",
          maxWidth: "11em",
        }}>Add NAD+ To Support Your Energy &amp; Wellness Goals</h1>
        <NadSpinBadge />
      </div>
      <div style={{
        borderTop: "1px solid var(--nad-hairline-dark)",
        marginTop: "var(--spacing-10)", paddingTop: "var(--spacing-5)", maxWidth: 520,
      }}>
        <p style={{
          margin: 0, color: "var(--nad-ink-dark)", fontSize: "var(--text-xl)",
          lineHeight: 1.45, fontWeight: "var(--font-weight-medium)",
        }}>You’ve already taken the first step. Now, you may add NAD+ to your wellness plan.</p>
        <div className="nad-hero-ctas" style={{
          display: "flex", alignItems: "center",
          gap: "var(--spacing-4)", marginTop: "var(--spacing-6)",
        }}>
          {/* pill + "or" as one unit: on a mobile wrap, "or" stays beside the
              button and only the link drops to the next line */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "var(--spacing-4)",
            whiteSpace: "nowrap",
          }}>
            <NadCta label="Add NAD+" />
            <span style={{
              color: "var(--nad-ink-dark)", fontSize: "var(--text-2xl)",
              fontWeight: "var(--font-weight-normal)",
            }}>or</span>
          </span>
          <a href="index.html" style={{
            color: "var(--nad-ink-dark)", fontSize: "var(--text-2xl)",
            fontWeight: "var(--font-weight-semibold)",
            textDecoration: "underline", textUnderlineOffset: 6,
          }}>Continue Without Adding</a>
        </div>
      </div>
      <div className="nad-hero-bottom" style={{ position: "relative", flex: 1, display: "flex", alignItems: "flex-end" }}>
        <div className="nad-hero-word" aria-hidden="true" style={{
          color: "var(--nad-ink-dark)", fontWeight: "var(--font-weight-bold)",
          fontSize: "clamp(110px, 21vw, 300px)", lineHeight: 0.82,
          letterSpacing: "-0.04em", marginLeft: "-0.04em",
          transform: "translateY(6%)", whiteSpace: "nowrap", userSelect: "none",
        }}>NAD+</div>
        <video className="nad-hero-media" src="uploads/nadanivi-web.mp4"
          autoPlay muted loop playsInline style={{
            position: "absolute", right: 0, bottom: "var(--spacing-8)",
            width: "min(480px, 36vw)", display: "block",
          }} />
      </div>
    </section>
  );
}

function NadWhatIs() {
  // Scroll-linked entrance, recreated from neuemontreal.com's hero→section-2
  // transition: the kicker drifts in at half scroll speed (parallax lag) and
  // the display quote scales 0.9→1 while it enters. Plain JS on purpose —
  // CSS scroll timelines don't run in Safari. No "reveal" class here: its
  // fill-mode would pin the transform and fight the inline styles.
  const secRef = React.useRef(null);
  const kickRef = React.useRef(null);
  const quoteRef = React.useRef(null);
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const sec = secRef.current;
      if (!sec) return;
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, 1 - sec.getBoundingClientRect().top / (vh * 0.85)));
      if (quoteRef.current) {
        quoteRef.current.style.transform =
          "translateY(" + ((1 - p) * 96).toFixed(1) + "px) scale(" + (0.9 + 0.1 * p).toFixed(4) + ")";
        quoteRef.current.style.opacity = (0.4 + 0.6 * p).toFixed(3);
      }
      if (kickRef.current) {
        kickRef.current.style.transform = "translateY(" + ((1 - p) * 48).toFixed(1) + "px)";
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <section ref={secRef} data-screen-label="What Is NAD+" style={{
      background: "var(--nad-band-dark)", color: "var(--nad-ink-light)",
      fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-24) var(--spacing-6)", overflow: "hidden",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div ref={kickRef} style={{ willChange: "transform" }}>
          <NadKicker label="What Is NAD+?" num="01"
            color="var(--nad-ink-light)" border="var(--glass-border)" />
        </div>
        <p ref={quoteRef} style={{
          margin: "var(--spacing-12) 0 0", fontSize: "clamp(28px, 3.6vw, 54px)",
          lineHeight: 1.12, fontWeight: "var(--font-weight-medium)",
          letterSpacing: "-0.015em", maxWidth: "22em",
          willChange: "transform, opacity", transformOrigin: "0% 50%",
        }}>NAD+ is one of the most discussed wellness therapies among individuals focused on energy, recovery, and healthy aging.</p>
      </div>
    </section>
  );
}

function NadBenefits() {
  return (
    <section data-screen-label="Why Add NAD+" style={{
      background: "var(--bg-default)", fontFamily: "var(--font-family-base)",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "var(--spacing-16) var(--spacing-6) var(--spacing-10)",
      }}>
        <NadKicker label="Why Add NAD+?" num="02"
          color="var(--text-muted)" border="var(--border-default)" />
        <h2 className="reveal" style={{
          margin: "var(--spacing-8) 0 0", color: "var(--text-default)",
          fontSize: "clamp(28px, 3.4vw, 48px)", lineHeight: 1.05,
          fontWeight: "var(--font-weight-bold)", letterSpacing: "-0.02em",
          maxWidth: "18em",
        }}>NAD+ may be a good fit for people who want to support:</h2>
      </div>
      <div className="nad-strips" role="list">
        {NAD_BENEFITS.map((b) => (
          <div key={b.label} role="listitem" className="nad-strip" style={{ background: b.bg }}>
            <span className="nad-strip-label" style={{ color: b.ink }}>{b.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function NadPlus() {
  return (
    <section data-screen-label="A More Complete Wellness Path" style={{
      position: "relative", overflow: "hidden", background: "var(--bg-tertiary)",
      fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-20) var(--spacing-6)",
    }}>
      <div className="nad-plus-grid" style={{
        maxWidth: 1280, margin: "0 auto", display: "grid",
        gridTemplateColumns: "minmax(300px, 560px) 1fr",
        gap: "var(--spacing-12)", alignItems: "center",
      }}>
        <div>
          <NadKicker label="A More Complete Wellness Path" num="03"
            color="var(--text-muted)" border="var(--border-default)" />
          <h2 className="reveal" style={{
            margin: "var(--spacing-8) 0 var(--spacing-5)", color: "var(--text-default)",
            fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.02,
            fontWeight: "var(--font-weight-bold)", letterSpacing: "-0.02em",
          }}>Your wellness journey is personal.</h2>
          <p style={{
            margin: 0, color: "var(--text-secondary)", fontSize: "var(--text-xl)",
            lineHeight: 1.55, maxWidth: "26em",
          }}>Adding NAD+ may help support the way you want to feel as you move forward with your Chime plan.</p>
          <NadCta label="Add NAD+ To My Plan" style={{ marginTop: "var(--spacing-8)" }} />
        </div>
        <div className="reveal nad-plus-visual" style={{
          position: "relative", minHeight: 460, display: "flex",
          alignItems: "center", justifyContent: "center", overflow: "hidden",
        }}>
          <span aria-hidden="true" style={{
            position: "absolute", fontWeight: "var(--font-weight-bold)",
            fontSize: "clamp(340px, 34vw, 560px)", lineHeight: 0.7,
            color: "var(--accent-default)", userSelect: "none",
            transform: "translateY(-4%)",
          }}>+</span>
          {/* Vial rides the right arm of the plus — keep the offset or the
              vial hides the glyph's vertical stroke entirely. */}
          <img src="uploads/vials/nad-plus.webp" alt="NAD+ vial" style={{
            position: "relative", height: "min(400px, 56vw)", marginLeft: "34%",
            filter: "drop-shadow(0 24px 32px rgba(0,0,0,0.18))",
          }} />
        </div>
      </div>
    </section>
  );
}

function NadProvider() {
  return (
    <section data-screen-label="Guided By Providers" style={{
      background: "var(--accent-subtle)", fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-24) var(--spacing-6)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <NadKicker label="Guided By Providers" num="04"
          color="var(--accent-onSubtle)" border="var(--accent-border)" />
        <p className="reveal" style={{
          margin: "var(--spacing-12) 0 0", color: "var(--text-default)",
          fontSize: "clamp(28px, 3.6vw, 54px)", lineHeight: 1.12,
          fontWeight: "var(--font-weight-medium)", letterSpacing: "-0.015em",
          maxWidth: "20em",
        }}>Like every part of your Chime experience, your care is guided by providers and designed around your individual goals.</p>
      </div>
    </section>
  );
}

function NadOffer() {
  const goAssessment = (e) => {
    e.preventDefault();
    if (window.openChimeAssessment) window.openChimeAssessment();
  };
  return (
    <section id="offer" data-screen-label="Add NAD+ Offer" style={{
      background: "var(--nad-band-dark)", fontFamily: "var(--font-family-base)",
      padding: "var(--spacing-24) var(--spacing-6)",
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{
          margin: "0 0 var(--spacing-4)", color: "var(--nad-ink-light)",
          fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 0.95,
          fontWeight: "var(--font-weight-bold)", letterSpacing: "-0.02em",
        }}>Add NAD+</h2>
        <p style={{
          margin: "0 0 var(--spacing-10)", color: "var(--nad-ink-light)",
          opacity: 0.78, fontSize: "var(--text-lg)", lineHeight: 1.5,
        }}>
          Now, you may add NAD+ to your wellness plan for just{" "}
          <span style={{
            background: "var(--warning-subtle)", color: "var(--warning-default)",
            borderRadius: "var(--radius-md)", padding: "2px 8px",
            fontWeight: "var(--font-weight-bold)",
          }}>[PRICE]</span>.
        </p>
        <div className="reveal" style={{
          background: "var(--bg-elevated)", borderRadius: "var(--radius-3xl)",
          padding: "var(--spacing-8) var(--spacing-8) var(--spacing-6)",
          overflow: "hidden",
        }}>
          <img src="uploads/vials/nad-plus.webp" alt="NAD+ vial" style={{
            height: 190, margin: "0 auto var(--spacing-4)", display: "block",
            filter: "drop-shadow(0 16px 22px rgba(0,0,0,0.16))",
          }} />
          <div style={{
            color: "var(--text-default)", fontWeight: "var(--font-weight-bold)",
            fontSize: "var(--text-3xl)", letterSpacing: "-0.01em",
          }}>NAD+</div>
          <div style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginTop: 4 }}>
            Guided by providers, designed around your goals
          </div>
          <div style={{
            borderTop: "2px dashed var(--border-default)",
            margin: "var(--spacing-6) calc(-1 * var(--spacing-8))",
          }} />
          <a href="assessment.html" onClick={goAssessment} style={{
            display: "block", background: "var(--primary-default)",
            color: "var(--text-on-primary)", textDecoration: "none",
            borderRadius: "var(--radius-4xl)", padding: "16px 24px",
            fontWeight: "var(--font-weight-bold)", fontSize: "var(--text-lg)",
          }}>Add NAD+ To My Cart</a>
        </div>
        <a href="index.html" style={{
          display: "inline-block", marginTop: "var(--spacing-8)",
          color: "var(--nad-ink-light)", opacity: 0.7,
          textDecoration: "underline", fontSize: "var(--text-base)",
        }}>Continue Without Adding</a>
      </div>
    </section>
  );
}

function NadFooter() {
  const footLink = { color: "var(--nad-ink-dark)", textDecoration: "none" };
  return (
    <footer data-screen-label="NAD Footer" style={{
      background: "var(--accent-default)", fontFamily: "var(--font-family-base)",
      paddingTop: "var(--spacing-16)", overflow: "hidden",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 var(--spacing-6)" }}>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "var(--spacing-6)",
          justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid var(--nad-hairline-dark)",
          paddingBottom: "var(--spacing-4)", color: "var(--nad-ink-dark)",
          fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)",
        }}>
          <span>© 2026 Chime Health</span>
          <nav style={{ display: "flex", gap: "var(--spacing-6)" }}>
            <a href="faq.html" style={footLink}>FAQ</a>
            <a href="privacy-policy.html" style={footLink}>Privacy Policy</a>
            <a href="terms-conditions.html" style={footLink}>Terms &amp; Conditions</a>
          </nav>
        </div>
      </div>
      <div aria-hidden="true" style={{
        color: "var(--nad-ink-dark)", fontWeight: "var(--font-weight-bold)",
        fontSize: "clamp(150px, 28vw, 400px)", lineHeight: 0.72,
        letterSpacing: "-0.04em", whiteSpace: "nowrap", textAlign: "center",
        transform: "translateY(18%)", userSelect: "none",
      }}>NAD+</div>
    </footer>
  );
}

function NadPage() {
  return (
    <React.Fragment>
      <NadChrome />
      <main>
        <NadHero />
        <NadWhatIs />
        <NadOffer />
        <NadBenefits />
        <NadPlus />
        <NadProvider />
      </main>
      <NadFooter />
    </React.Fragment>
  );
}

Object.assign(window, {
  NadPage, NadChrome, NadHero, NadWhatIs, NadBenefits,
  NadPlus, NadProvider, NadOffer, NadFooter,
});
