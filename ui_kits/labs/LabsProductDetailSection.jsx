// Chime Health — Labs UI kit: product-detail hero for a lab-testing panel.
// Left: product photo in a rounded card with a dark biomarker-count badge.
// Right: title + price, subhead + description, three option groups, book CTA.
//
// Theme-agnostic per THEME_CONTRACT.md — no palette primitives, no brand hex.
// The dark badge/CTA use the --glass-*/--primary-* surfaces (the `lab` theme
// tints its glass to a near-black iris ink).

const LABS_PDP_UPLOADS = window.CHIME_UPLOADS_BASE || "../../uploads";

// Tier → panel data. Selecting a tier drives the price and biomarker count off
// this map — nothing downstream is hardcoded.
// Tier names follow the confirmed system (Essential / Complete / Executive),
// matching the cards in ChimeLabsBandSection. Monthly pricing, no compare-at
// prices, per the 2026-07 copy doc (uploads/Chime_Health_Labs_.pdf).
// NOTE: Complete's $399/mo comes from that doc; Essential/Executive are still
// PLACEHOLDERS (ChimeLabsSection deliberately renders "From $—" because their
// real pricing isn't set yet) — swap these once it is.
// A tier may override the product photo with `image`/`alt`; tiers that omit them
// fall back to the section's `image`/`alt` props.
const LABS_TIERS = {
  Essential: { markers: "80+",  price: "$299/mo" },
  Complete:  {
    markers: "100+", price: "$399/mo",
    image: LABS_PDP_UPLOADS + "/2vials.png",
    alt: "Two capped blood collection vials beside a white specimen box",
  },
  Executive: { markers: "130+", price: "$599/mo" },
};

const LABS_TIER_NAMES = Object.keys(LABS_TIERS);
const LABS_SEXES = ["Male", "Female"];
const LABS_REVIEWS = ["45 min lab review", "No lab review"];

// Pill option button — selected takes the dark border + inset ring, unselected a
// light hairline. Border width is constant so selection never shifts layout.
function LabsOptionButton({ label, selected, onSelect }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" role="radio" aria-checked={selected} onClick={onSelect}
      onMouseEnter={function () { setHover(true); }}
      onMouseLeave={function () { setHover(false); }}
      style={{
        appearance: "none", cursor: "pointer",
        font: "inherit", fontFamily: "var(--font-family-base)",
        fontSize: "var(--text-sm)",
        fontWeight: selected ? "var(--font-weight-semibold)" : "var(--font-weight-medium)",
        // Selection chrome follows the page accent (--accent-active is blue-800
        // under the default theme, so the homepage look is unchanged).
        color: selected ? "var(--accent-active)" : "var(--fg-muted)",
        background: "var(--bg-elevated)",
        border: "2px solid " + (selected ? "var(--accent-active)" : "var(--border-default)"),
        boxShadow: selected ? "inset 0 0 0 1px var(--accent-active)" : "none",
        borderRadius: "var(--radius-4xl)",
        padding: "var(--spacing-2) var(--spacing-5)",
        transform: hover && !selected ? "translateY(-1px)" : "none",
        transition: "border-color var(--transition-base) var(--ease-in-out), color var(--transition-base) var(--ease-in-out), box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out)",
      }}>{label}</button>
  );
}

// A labelled row of options: "Tier: Comprehensive" above the pills.
function LabsOptionGroup({ label, options, value, onChange }) {
  return (
    <div>
      <div style={{
        fontSize: "var(--text-sm)", color: "var(--fg-muted)",
        marginBottom: "var(--spacing-2)",
      }}>
        {label}: <span style={{ color: "var(--text-default)", fontWeight: "var(--font-weight-medium)" }}>{value}</span>
      </div>
      <div role="radiogroup" aria-label={label} style={{
        display: "flex", flexWrap: "wrap", gap: "var(--spacing-2)",
      }}>
        {options.map(function (o) {
          return <LabsOptionButton key={o} label={o} selected={o === value}
            onSelect={function () { onChange(o); }} />;
        })}
      </div>
    </div>
  );
}

function LabsProductDetailSection({
  theme = "lab",
  name = "Total Health Panel",
  image = LABS_PDP_UPLOADS + "/blog-banner-efficient-blood-vial-label-printing-with-desktop-printers.jpg",
  alt = "Labeled blood sample vials",
  // Landscape banner photo bled to fill the near-square frame.
  fit = "cover",
  description = "A comprehensive look at the biomarkers behind your energy, metabolism, hormones, and long-term health. Your sample is collected at a nearby lab and reviewed by a licensed provider. Results are informational and designed to guide your next conversation about care.",
}) {
  const [tier, setTier] = React.useState("Complete");
  const [sex, setSex] = React.useState(LABS_SEXES[0]);
  const [review, setReview] = React.useState(LABS_REVIEWS[0]);
  const [ctaHover, setCtaHover] = React.useState(false);
  const panel = LABS_TIERS[tier];
  const panelImage = panel.image || image;
  const panelAlt = panel.image ? panel.alt : alt;

  return (
    <section data-screen-label="Labs Product Detail" data-theme={theme}
      className="labs-pdp-section" style={{
        fontFamily: "var(--font-family-base)",
        padding: "var(--spacing-12) var(--spacing-8)",
        maxWidth: "var(--container-xl)", margin: "0 auto", boxSizing: "border-box",
      }}>
      <div className="labs-pdp-grid" style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "var(--spacing-12)", alignItems: "start",
      }}>
        {/* ---- Left: product photo + biomarker badge ---- */}
        <Reveal>
          <div style={{
            position: "relative", aspectRatio: "16 / 15", overflow: "clip",
            borderRadius: "var(--radius-2xl)", background: "var(--accent-subtle)",
          }}>
            <img src={panelImage} alt={panelAlt} style={{
              width: "100%", height: "100%", objectFit: fit, display: "block",
            }} />
            {/* Dark badge pinned top-right: count over label */}
            <div style={{
              position: "absolute", top: "var(--spacing-4)", right: "var(--spacing-4)",
              background: "var(--glass-solid)", color: "var(--color-white)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--spacing-2) var(--spacing-4)",
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: "var(--spacing-1)",
            }}>
              <span style={{
                fontSize: "var(--text-2xl)", fontWeight: "var(--font-weight-semibold)",
                lineHeight: 1, fontVariantNumeric: "lining-nums",
              }}>{panel.markers}</span>
              <span style={{ fontSize: "var(--text-xs)", opacity: 0.85 }}>Biomarkers</span>
            </div>
          </div>
        </Reveal>

        {/* ---- Right: title/price, copy, options, CTA ---- */}
        <Reveal delay={150}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
            {/* Title + price */}
            <div style={{
              display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              gap: "var(--spacing-5)",
            }}>
              <h2 style={{
                margin: 0, fontSize: "var(--text-4xl)",
                fontWeight: "var(--font-weight-semibold)", lineHeight: 1.15,
                color: "var(--text-default)", textWrap: "balance",
              }}>{name + " — " + tier}</h2>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{
                  fontSize: "var(--text-3xl)", fontWeight: "var(--font-weight-semibold)",
                  lineHeight: 1.1, color: "var(--text-default)",
                  fontVariantNumeric: "lining-nums",
                }}>{panel.price}</div>
              </div>
            </div>

            {/* Subheading + description */}
            <div>
              <div style={{
                fontSize: "var(--text-lg)", fontWeight: "var(--font-weight-medium)",
                color: "var(--text-default)",
              }}>{panel.markers} Biomarkers tested</div>
              <p style={{
                margin: "var(--spacing-2) 0 0", fontSize: "var(--text-base)",
                lineHeight: 1.55, color: "var(--fg-muted)", maxWidth: "40em",
              }}>{description}</p>
            </div>

            {/* Option groups */}
            <LabsOptionGroup label="Tier" options={LABS_TIER_NAMES} value={tier} onChange={setTier} />
            <LabsOptionGroup label="Sex" options={LABS_SEXES} value={sex} onChange={setSex} />
            <LabsOptionGroup label="Lab review" options={LABS_REVIEWS} value={review} onChange={setReview} />

            {/* CTA */}
            <button type="button"
              onClick={function () { window.openChimeAssessment && window.openChimeAssessment(); }}
              onMouseEnter={function () { setCtaHover(true); }}
              onMouseLeave={function () { setCtaHover(false); }}
              style={{
                appearance: "none", cursor: "pointer", width: "100%",
                marginTop: "var(--spacing-2)",
                // Dark CTA fill = the page's darkest accent stop, not the fixed
                // navy --primary-* (see THEME_CONTRACT "Button hover-fill navy").
                // Hover darkens via color-mix so the alpha/tint stays theme-aware.
                background: ctaHover
                  ? "color-mix(in srgb, var(--accent-active) 88%, black)"
                  : "var(--accent-active)",
                color: "var(--text-on-primary)", border: "none",
                borderRadius: "var(--radius-4xl)",
                padding: "var(--spacing-4) var(--spacing-6)",
                fontFamily: "var(--font-family-base)", fontSize: "var(--text-base)",
                fontWeight: "var(--font-weight-semibold)",
                boxShadow: ctaHover ? "var(--shadow-md)" : "var(--shadow-sm)",
                transform: ctaHover ? "translateY(-2px)" : "none",
                transition: "background var(--transition-base) var(--ease-in-out), box-shadow var(--transition-base) var(--ease-in-out), transform var(--transition-base) var(--ease-in-out)",
              }}>Book my health test</button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

Object.assign(window, { LabsProductDetailSection });
