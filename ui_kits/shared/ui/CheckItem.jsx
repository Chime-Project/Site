// Chime Health — shared check-list items. Two shapes, kept deliberately separate
// because they are different components, not one component with a variant:
//   <CheckItem>   — hero checklist row: 24px icon column, rule between rows,
//                   copy led by an underlined link. (WL + Wellness heroes)
//   <CheckBullet> — membership benefit bullet: filled accent disc + white tick.
//                   (WL + Wellness timeline panels)
// Both bind to semantic/accent tokens only, so they follow the page data-theme
// with no color props: tide on weight-loss, cadmium on wellness.
// Requires Icon.jsx to load first.

function CheckItem({ icon, strong, rest, last }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "24px 1fr", gap: "var(--spacing-3)",
      alignItems: "start", padding: "var(--spacing-4) 0",
      borderBottom: last ? "none" : "1px solid var(--border-default)",
    }}>
      <span aria-hidden="true" style={{ color: "var(--fg-default)", display: "flex", marginTop: 2 }}>{icon}</span>
      <p style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: 1.5, color: "var(--fg-default)" }}>
        <a href="#" style={{ color: "var(--accent-strong)", fontWeight: "var(--font-weight-semibold)", textDecoration: "underline", textUnderlineOffset: 3 }}>{strong}</a>
        {" "}{rest}
      </p>
    </div>
  );
}

function CheckBullet({ label }) {
  return (
    <li style={{ display: "flex", alignItems: "center", gap: "var(--spacing-3)", padding: "var(--spacing-2) 0" }}>
      <span aria-hidden="true" style={{
        flex: "none", width: 24, height: 24, borderRadius: "var(--radius-4xl)",
        background: "var(--accent-default)", color: "var(--color-white)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={14} strokeWidth={3}><path d="M4 12.5l5 5 11-12" /></Icon>
      </span>
      <span style={{ fontSize: "var(--text-base)", color: "var(--fg-default)", fontWeight: "var(--font-weight-medium)" }}>{label}</span>
    </li>
  );
}

Object.assign(window, { CheckItem, CheckBullet });
