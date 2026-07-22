// Chime Health — shared legal document renderer.
// Drives all four legal pages from window.CHIME_LEGAL (see shared/data/legal.js):
// title band with effective/updated dates, then a single prose column.
// Theme-agnostic: the page sets data-theme, this component only reads semantic tokens.

// Emails and bare URLs are stored as plain text in legal.js so the data stays
// markup-free; they become links here.
const LEGAL_LINK_RE = /([\w.+-]+@[\w-]+\.[\w.]+|(?:https?:\/\/|www\.)[^\s,)]+)/g;

function legalLinkify(text) {
  const parts = text.split(LEGAL_LINK_RE);
  return parts.map((part, i) => {
    // Odd indices are the captured matches; even indices are the plain text between.
    if (i % 2 === 0 || !part) return part;
    const isEmail = part.indexOf("@") !== -1;
    const href = isEmail ? "mailto:" + part
      : (part.indexOf("http") === 0 ? part : "https://" + part);
    return (
      <a key={i} href={href} style={{ color: "var(--accent-strong)", textUnderlineOffset: 3 }}>
        {part}
      </a>
    );
  });
}

function ChimeLegalPage({ doc }) {
  if (!doc) return null;
  return (
    <article data-screen-label={"Legal — " + doc.title}>
      <header style={{
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-default)",
        padding: "var(--spacing-16) var(--spacing-8) var(--spacing-12)",
      }}>
        <div style={{ maxWidth: "var(--container-md)", margin: "0 auto" }}>
          <div style={{
            fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)",
            textTransform: "uppercase", letterSpacing: "0.5px",
            color: "var(--accent-strong)", marginBottom: "var(--spacing-3)",
          }}>Legal</div>

          <h1 style={{
            margin: 0,
            fontFamily: "var(--font-family-base)",
            fontSize: "var(--text-5xl)",
            fontWeight: "var(--font-weight-regular)",
            lineHeight: 1.1,
            color: "var(--text-default)",
          }}>{doc.title}</h1>

          <div style={{
            display: "flex", flexWrap: "wrap", gap: "var(--spacing-3)",
            marginTop: "var(--spacing-6)",
          }}>
            <LegalDate label="Effective" value={doc.effective} />
            {doc.updated ? <LegalDate label="Last updated" value={doc.updated} /> : null}
          </div>
        </div>
      </header>

      {/* Padding lives on the wrapper, not the max-width box, so the prose column
          starts on the same left edge as the title above it. */}
      <div style={{ padding: "var(--spacing-12) var(--spacing-8) var(--spacing-16)" }}>
        <div style={{
          maxWidth: "var(--container-md)", margin: "0 auto",
          fontFamily: "var(--font-family-base)",
          fontSize: "var(--text-base)",
          lineHeight: 1.7,
          color: "var(--text-secondary)",
        }}>
          {doc.blocks.map((b, i) => <LegalBlock key={i} block={b} />)}
        </div>
      </div>
    </article>
  );
}

function LegalDate({ label, value }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "baseline", gap: "var(--spacing-2)",
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-4xl)",
      padding: "var(--spacing-2) var(--spacing-4)",
      fontSize: "var(--text-xs)",
    }}>
      <span style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
      <span style={{ color: "var(--text-default)", fontWeight: "var(--font-weight-semibold)" }}>{value}</span>
    </div>
  );
}

function LegalBlock({ block }) {
  if (block.t === "ul") {
    return (
      <ul style={{
        margin: "0 0 var(--spacing-5) 0",
        paddingInlineStart: "var(--spacing-6)",
        display: "grid", rowGap: "var(--spacing-2)",
      }}>
        {block.items.map((it, i) => <li key={i}>{legalLinkify(it)}</li>)}
      </ul>
    );
  }

  if (block.t === "h2" || block.t === "h3" || block.t === "h4") {
    const scale = { h2: "var(--text-2xl)", h3: "var(--text-lg)", h4: "var(--text-base)" }[block.t];
    const Tag = block.t;
    return (
      <Tag style={{
        margin: "var(--spacing-10) 0 var(--spacing-4) 0",
        fontFamily: "var(--font-family-base)",
        fontSize: scale,
        fontWeight: block.t === "h2" ? "var(--font-weight-regular)" : "var(--font-weight-semibold)",
        lineHeight: 1.25,
        color: "var(--text-default)",
      }}>{block.x}</Tag>
    );
  }

  return <p style={{ margin: "0 0 var(--spacing-5) 0" }}>{legalLinkify(block.x)}</p>;
}

Object.assign(window, { ChimeLegalPage });
