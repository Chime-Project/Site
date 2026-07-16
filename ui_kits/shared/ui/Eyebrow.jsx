// Chime Health — shared section eyebrow / kicker.
// The small uppercase label above a section headline. The typographic triplet
// (text-sm · semibold · 0.12em · uppercase) is fixed; only surface and spacing vary.
//   tone:         "onDark" (white, over a photo/glass ground) | "onLight" (accent-strong)
//   opacity:      optional dimming (heroes use 0.9 / 0.85)
//   marginBottom: optional; omit when the parent supplies the gap
function Eyebrow({ label, tone = "onLight", opacity, marginBottom }) {
  return (
    <div style={{
      color: tone === "onDark" ? "var(--color-white)" : "var(--accent-strong)",
      fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)",
      letterSpacing: "0.12em", textTransform: "uppercase",
      opacity, marginBottom,
    }}>{label}</div>
  );
}

Object.assign(window, { Eyebrow });
