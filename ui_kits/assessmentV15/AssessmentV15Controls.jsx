// Chime Health — Assessment v15 controls: only the screen types v15 adds.
// Everything else (cards, pills, rows, fields, phrase, hero, progress, button)
// is the live V4 kit, loaded by the same page, so both assessments share one
// look. Styles are tokens only (the theme guard runs over this folder too).

// Status tag for copy the document has not approved. Always rendered BELOW
// the heading it qualifies — never as an eyebrow above it.
function AsmtV15Tag({ children }) {
  return (
    <span style={{
      display: "inline-block", alignSelf: "center",
      fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)",
      letterSpacing: "0.06em", textTransform: "uppercase",
      color: "var(--warning-default)", background: "var(--warning-subtle)",
      borderRadius: "var(--radius-4xl)", padding: "var(--spacing-1) var(--spacing-3)",
    }}>{children}</span>
  );
}

// Turns the named phrases of a sentence into links (P0.2 names the Notice of
// Privacy Practices, the Consumer Health Data Privacy Policy and the Terms).
// New tab, so following one never loses the assessment.
function AsmtV15LinkedText({ text, links }) {
  if (!links || !links.length) return text;
  const parts = [];
  let rest = text, key = 0;
  while (rest) {
    let hit = null;
    for (const l of links) {
      const at = rest.indexOf(l.text);
      if (at >= 0 && (!hit || at < hit.at)) hit = { at, l };
    }
    if (!hit) { parts.push(rest); break; }
    if (hit.at) parts.push(rest.slice(0, hit.at));
    parts.push(<a key={key++} href={hit.l.href} target="_blank" rel="noopener">{hit.l.text}</a>);
    rest = rest.slice(hit.at + hit.l.text.length);
  }
  return parts;
}

// One checkbox statement. The whole row is the label, so the tap target is
// the full width; links inside it stop the tap from toggling the box.
function AsmtV15CheckRow({ id, checked, onToggle, children, optional }) {
  return (
    <label htmlFor={id} style={{
      display: "flex", alignItems: "flex-start", gap: "var(--spacing-3)", cursor: "pointer",
      background: "var(--color-white)", border: "1px solid " + (checked ? "var(--accent-strong)" : "var(--border-default)"),
      borderRadius: "var(--radius-lg)", padding: "var(--spacing-4) var(--spacing-5)",
      transition: "border-color var(--transition-base) var(--ease-in-out)",
    }}>
      <input id={id} type="checkbox" checked={!!checked} onChange={onToggle}
        style={{ marginTop: 3, width: 20, height: 20, accentColor: "var(--accent-strong)", flex: "none" }} />
      <span onClick={(e) => { if (e.target.tagName === "A") e.stopPropagation(); }}
        style={{ fontSize: "var(--text-base)", lineHeight: 1.55, color: "var(--text-default)" }}>
        {children}
        {optional && <span style={{ color: "var(--text-muted)" }}> (optional)</span>}
      </span>
    </label>
  );
}

// ---------------------------------------------------------------------------
// P0.1 · date of birth + state
// ---------------------------------------------------------------------------
function AsmtV15Basics({ screen, value, onField, states, problem }) {
  const d = value || {};
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
      <div className="asmt-v4-grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-4)" }}>
        <AsmtV4Field id="asmt-v15-dob" label={screen.dobLabel} inputMode="numeric" placeholder="MM/DD/YYYY"
          autoComplete="bday" required value={d.dob}
          onChange={(v) => onField("dob", asmtV15MaskDob(v))} />
        <AsmtV4Select id="asmt-v15-state" label={screen.stateLabel} placeholder="Select a state"
          options={states} autoComplete="address-level1" required value={d.state}
          onChange={(v) => onField("state", v)} />
      </div>
      <p style={{ margin: 0, fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text-secondary)" }}>{screen.helper}</p>
      {problem && <AsmtV15Notice>{problem}</AsmtV15Notice>}
    </div>
  );
}

function AsmtV15Notice({ children }) {
  return (
    <p role="status" style={{
      margin: 0, fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text-default)",
      background: "var(--warning-subtle)", borderRadius: "var(--radius-md)",
      padding: "var(--spacing-3) var(--spacing-4)",
    }}>{children}</p>
  );
}

// ---------------------------------------------------------------------------
// P0.2 · three required, unchecked boxes + a way to decline
// ---------------------------------------------------------------------------
function AsmtV15Privacy({ screen, value, onToggle, onDecline }) {
  const d = value || {};
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
      {screen.boxes.map((b) => (
        <AsmtV15CheckRow key={b.key} id={"asmt-v15-p02-" + b.key} checked={d[b.key]} onToggle={() => onToggle(b.key)}>
          <AsmtV15LinkedText text={b.text} links={b.links} />
        </AsmtV15CheckRow>
      ))}
      <p style={{ margin: "var(--spacing-2) 0 0", textAlign: "center" }}>
        <button type="button" onClick={onDecline} style={{
          background: "none", border: "none", cursor: "pointer", font: "inherit",
          fontSize: "var(--text-sm)", color: "var(--text-secondary)", textDecoration: "underline",
          padding: "var(--spacing-2)",
        }}>{screen.declineLabel}</button>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Consent screen: the full text in a card, one unchecked box.
// ---------------------------------------------------------------------------
function AsmtV15Consent({ consent, value, onToggle, id }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
      <div style={{
        background: "var(--color-white)", border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-xl)", padding: "var(--spacing-6)",
        display: "flex", flexDirection: "column", gap: "var(--spacing-3)",
      }}>
        {consent.body.map((p, i) => (
          <p key={i} style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: 1.65, color: "var(--text-secondary)" }}>{p}</p>
        ))}
      </div>
      <AsmtV15CheckRow id={"asmt-v15-consent-" + id} checked={value && value.agreed} onToggle={onToggle}>
        {consent.ack}
      </AsmtV15CheckRow>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Free text opened by an answer on the same screen (B2–B5, C-WL.8).
// aria-live on the always-mounted wrapper, so the new field is announced.
// ---------------------------------------------------------------------------
function AsmtV15Textarea({ id, label, value, onChange, placeholder }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div>
      <AsmtFieldLabel text={label} htmlFor={id} />
      <textarea id={id} rows={3} value={value || ""} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ ...ASMT_V4_INPUT, ...asmtV4FocusStyle(focus, false), minHeight: 96, resize: "vertical", lineHeight: 1.5 }} />
    </div>
  );
}

function AsmtV15Reveal({ open, children }) {
  return (
    <div aria-live="polite">
      {open && <div className="asmt-v4-anim">{children}</div>}
    </div>
  );
}

// Single-select in the shape the config asks for: cards or plain rows.
function AsmtV15Single({ screen, value, onSelect, labelledBy }) {
  return screen.cards
    ? <AsmtV4SingleSelectCards options={screen.options} value={value} onSelect={onSelect} labelledBy={labelledBy} />
    : <AsmtV4SingleSelectList options={screen.options} value={value} onSelect={onSelect} labelledBy={labelledBy} />;
}

// ---------------------------------------------------------------------------
// C-WL.1 · journey + inline "Which medication?" (two free-text options now:
// "Another weight-loss medication (please specify)" and "Other").
// ---------------------------------------------------------------------------
function AsmtV15Journey({ screen, value, med, medText, onSelect, onMed, onMedText, labelledBy }) {
  const r = screen.reveal;
  const open = r.when.indexOf(value) >= 0;
  const headingId = "asmt-v15-journey-reveal";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
      <AsmtV4SingleSelectCards options={screen.options} value={value} onSelect={onSelect} labelledBy={labelledBy} />
      <AsmtV15Reveal open={open}>
        <section aria-labelledby={headingId} style={{
          display: "flex", flexDirection: "column", gap: "var(--spacing-3)",
          borderTop: "1px solid var(--border-subtle)", paddingTop: "var(--spacing-5)",
        }}>
          <h3 id={headingId} style={{
            margin: 0, fontSize: "var(--text-lg)", lineHeight: 1.3, fontWeight: "var(--font-weight-semibold)",
            fontFamily: "var(--font-family-display, var(--font-family-base))", color: "var(--text-default)",
          }}>{r.title}</h3>
          <AsmtV4SingleSelectList options={r.options} value={med} onSelect={onMed} labelledBy={headingId} />
          {r.freeText.indexOf(med) >= 0 &&
            <AsmtV4Field id="asmt-v15-journey-med-text" label="Please tell us which medication"
              value={medText} onChange={onMedText} />}
        </section>
      </AsmtV15Reveal>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A2 · contact (four fields) + the two optional marketing consents
// ---------------------------------------------------------------------------
function AsmtV15Contact({ screen, value, errors, onField, onBlur }) {
  const d = value || {}, e = errors || {};
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
      <div className="asmt-v4-grid2" style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-4)",
        background: "var(--color-white)", border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-xl)", padding: "var(--spacing-6)",
      }}>
        <AsmtV4Field id="asmt-v15-first" label="First name" autoComplete="given-name" required
          value={d.firstName} error={e.firstName} onChange={(v) => onField("firstName", v)} onBlur={() => onBlur("firstName")} />
        <AsmtV4Field id="asmt-v15-last" label="Last name" autoComplete="family-name" required
          value={d.lastName} error={e.lastName} onChange={(v) => onField("lastName", v)} onBlur={() => onBlur("lastName")} />
        <AsmtV4Field id="asmt-v15-email" label="Email" type="email" autoComplete="email" required
          value={d.email} error={e.email} onChange={(v) => onField("email", v)} onBlur={() => onBlur("email")} />
        <AsmtV4Field id="asmt-v15-phone" label="Phone" type="tel" inputMode="tel" autoComplete="tel" required
          value={d.phone} error={e.phone} onChange={(v) => onField("phone", v)} onBlur={() => onBlur("phone")} />
      </div>
      {screen.optional.map((o) => (
        <AsmtV15CheckRow key={o.key} id={"asmt-v15-a2-" + o.key} optional
          checked={d[o.key]} onToggle={() => onField(o.key, !d[o.key])}>
          <strong style={{ fontWeight: "var(--font-weight-semibold)" }}>{o.title}.</strong> {o.text}
        </AsmtV15CheckRow>
      ))}
    </div>
  );
}

// A2.4 · display only: the tier headline + message, never a number.
function AsmtV15SnapshotPanel({ content }) {
  if (!content) return null;
  return (
    <div style={{
      background: "var(--accent-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--spacing-6)",
      display: "flex", flexDirection: "column", gap: "var(--spacing-2)", textAlign: "center",
    }}>
      <p style={{
        margin: 0, fontSize: "var(--text-2xl)", fontWeight: "var(--font-weight-semibold)",
        fontFamily: "var(--font-family-display, var(--font-family-base))", color: "var(--accent-onSubtle)",
      }}>{content.headline}</p>
      <p style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: 1.6, color: "var(--text-default)" }}>{content.message}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A2.5 · password. The value lives in the flow's memory only — never in the
// answers, never in localStorage. The account is created server-side.
// ---------------------------------------------------------------------------
function AsmtV15Password({ screen, email, password, confirm, onPassword, onConfirm, mfa, onMfa, problem }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
      <div style={{
        display: "flex", flexDirection: "column", gap: "var(--spacing-4)",
        background: "var(--color-white)", border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-xl)", padding: "var(--spacing-6)",
      }}>
        {/* Hidden username field so password managers file the new password
            under the right account. */}
        <input type="email" autoComplete="username" value={email || ""} readOnly hidden />
        <AsmtV4Field id="asmt-v15-pw" label="Password" type="password" autoComplete="new-password" required
          value={password} onChange={onPassword} />
        <AsmtV4Field id="asmt-v15-pw2" label="Confirm password" type="password" autoComplete="new-password" required
          value={confirm} onChange={onConfirm} />
        <p style={{ margin: 0, fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text-secondary)" }}>
          At least 8 characters, with a letter and a number. {screen.emailNote}
        </p>
      </div>
      <AsmtV15CheckRow id="asmt-v15-mfa" optional checked={mfa} onToggle={onMfa}>{screen.mfaLabel}</AsmtV15CheckRow>
      {problem && <AsmtV15Notice>{problem}</AsmtV15Notice>}
    </div>
  );
}

// B8 · two dropdowns sharing one proposed value list.
function AsmtV15Selects({ screen, value, onField }) {
  const d = value || {};
  return (
    <div className="asmt-v4-grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-4)" }}>
      {screen.selects.map((s) => (
        <AsmtV4Select key={s.key} id={"asmt-v15-b8-" + s.key} label={s.label} required
          options={screen.options} value={d[s.key]} onChange={(v) => onField(s.key, v)} />
      ))}
    </div>
  );
}

// C-WL.9 · the verbatim ladder as rows, then the two history fields.
function AsmtV15Dose({ screen, value, onSelect, last, onLast, duration, onDuration, labelledBy }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-5)" }}>
      <AsmtV4SingleSelectList options={screen.options} value={value} onSelect={onSelect} labelledBy={labelledBy} />
      <div className="asmt-v4-grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-4)" }}>
        <AsmtV4Field id="asmt-v15-last-dose" label={screen.lastDoseLabel} inputMode="numeric" placeholder="MM/DD/YYYY"
          required value={last} onChange={(v) => onLast(asmtV15MaskDob(v))} />
        <AsmtV4Field id="asmt-v15-duration" label={screen.durationLabel} placeholder="e.g. 3 months"
          required value={duration} onChange={onDuration} />
      </div>
    </div>
  );
}

// C-WL.11 · Yes/No, then a photo picker on Yes. The file stays in memory;
// nothing is uploaded from this page (the upload endpoint is backend work).
function AsmtV15Upload({ screen, value, onSelect, file, onFile, labelledBy }) {
  const [preview, setPreview] = React.useState(null);
  React.useEffect(() => {
    if (!file || !/^image\//.test(file.type)) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-5)" }}>
      <AsmtV4SingleSelectCards options={screen.options} value={value} onSelect={onSelect} labelledBy={labelledBy} />
      <AsmtV15Reveal open={value === "Yes"}>
        <div style={{
          display: "flex", flexDirection: "column", gap: "var(--spacing-3)", alignItems: "flex-start",
          background: "var(--color-white)", border: "2px dashed var(--border-strong)",
          borderRadius: "var(--radius-xl)", padding: "var(--spacing-6)",
        }}>
          <label htmlFor="asmt-v15-rx-file" style={{ fontSize: "var(--text-base)", lineHeight: 1.5, color: "var(--text-default)" }}>
            {screen.uploadLabel}
          </label>
          <input id="asmt-v15-rx-file" type="file" accept="image/*,application/pdf"
            onChange={(e) => onFile(e.target.files && e.target.files[0] || null)}
            style={{ font: "inherit", fontSize: "var(--text-sm)", maxWidth: "100%" }} />
          {file &&
            <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--text-secondary)", overflowWrap: "anywhere" }}>
              Added: {file.name}
            </p>}
          {preview &&
            <img src={preview} alt="Your prescription photo" style={{
              maxWidth: 220, maxHeight: 220, objectFit: "contain",
              borderRadius: "var(--radius-md)", border: "1px solid var(--border-default)",
            }} />}
        </div>
      </AsmtV15Reveal>
    </div>
  );
}

// D1 · mailing/shipping address (state must match P0.1).
function AsmtV15Address({ value, errors, onField, onBlur, states }) {
  const d = value || {}, e = errors || {};
  return (
    <div className="asmt-v4-grid2" style={{
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-4)",
      background: "var(--color-white)", border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-xl)", padding: "var(--spacing-6)",
    }}>
      <div style={{ gridColumn: "1 / -1" }}>
        <AsmtV4Field id="asmt-v15-address1" label="Street address" autoComplete="address-line1" required
          value={d.address1} error={e.address1} onChange={(v) => onField("address1", v)} onBlur={() => onBlur("address1")} />
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <AsmtV4Field id="asmt-v15-address2" label="Apartment, suite, unit (optional)" autoComplete="address-line2"
          value={d.address2} onChange={(v) => onField("address2", v)} />
      </div>
      <AsmtV4Field id="asmt-v15-city" label="City" autoComplete="address-level2" required
        value={d.city} error={e.city} onChange={(v) => onField("city", v)} onBlur={() => onBlur("city")} />
      <AsmtV4Field id="asmt-v15-zip" label="ZIP code" inputMode="numeric" autoComplete="postal-code" required
        value={d.zip} error={e.zip} onChange={(v) => onField("zip", v.replace(/\D/g, "").slice(0, 5))} onBlur={() => onBlur("zip")} />
      <div style={{ gridColumn: "1 / -1" }}>
        <AsmtV4Select id="asmt-v15-ship-state" label="State" placeholder="Select a state" options={states}
          autoComplete="address-level1" required
          value={d.state} error={e.state} onChange={(v) => onField("state", v)} onBlur={() => onBlur("state")} />
      </div>
    </div>
  );
}

// Dashed slot for a vendor integration the backend team plugs in.
function AsmtV15VendorSlot({ title, note }) {
  return (
    <div style={{
      border: "2px dashed var(--border-strong)", borderRadius: "var(--radius-xl)",
      background: "var(--color-white)", minHeight: 160, padding: "var(--spacing-6)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      textAlign: "center", gap: "var(--spacing-2)",
    }}>
      <p style={{
        margin: 0, fontSize: "var(--text-xs)", fontWeight: "var(--font-weight-semibold)",
        letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)",
      }}>{title}</p>
      <p style={{ margin: 0, maxWidth: "30em", fontSize: "var(--text-sm)", lineHeight: 1.6, color: "var(--text-secondary)" }}>{note}</p>
    </div>
  );
}

// D1.5 · biometric consent + the non-biometric alternative the doc requires
// (IL BIPA / TX CUBI / WA).
function AsmtV15IdVerify({ screen, value, onChange }) {
  const d = value || {};
  const other = d.method === "other";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
      <p style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: 1.65, color: "var(--text-secondary)" }}>{screen.body}</p>
      {!other && <React.Fragment>
        <AsmtV15CheckRow id="asmt-v15-biometric" checked={d.biometricConsent}
          onToggle={() => onChange({ method: "selfie", biometricConsent: !d.biometricConsent })}>
          {screen.consent}
        </AsmtV15CheckRow>
        <AsmtV15VendorSlot title="ID + selfie check"
          note="The verification partner's capture opens here once it is connected. Nothing is captured on this page." />
      </React.Fragment>}
      {other &&
        <AsmtV15VendorSlot title="Verify another way"
          note="The non-biometric verification opens here once it is connected (for example, a document review by the care team)." />}
      <p style={{ margin: 0, textAlign: "center" }}>
        <button type="button" onClick={() => onChange(other ? { method: "selfie" } : { method: "other" })} style={{
          background: "none", border: "none", cursor: "pointer", font: "inherit",
          fontSize: "var(--text-sm)", color: "var(--accent-strong)", textDecoration: "underline", padding: "var(--spacing-2)",
        }}>{other ? "Use the ID + selfie check instead" : screen.otherWay}</button>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exit screens (disqualification, BMI fail, age, state, privacy, scope).
// Links styled as the kit's pill buttons.
// ---------------------------------------------------------------------------
function AsmtV15LinkButton({ href, label, variant = "primary" }) {
  const primary = variant === "primary";
  return (
    <a href={href} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 48,
      textDecoration: "none", boxSizing: "border-box",
      background: primary ? "var(--primary-default)" : "var(--color-white)",
      color: primary ? "var(--text-on-primary)" : "var(--text-default)",
      border: primary ? "1px solid transparent" : "1px solid var(--border-default)",
      borderRadius: "var(--radius-4xl)", padding: "var(--spacing-3) var(--spacing-8)",
      fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)",
      boxShadow: primary ? "var(--shadow-sm)" : "none",
    }}>{label}</a>
  );
}

function AsmtV15Exit({ screen, onAction }) {
  return (
    <div style={{
      background: "var(--bg-secondary)", borderRadius: "var(--radius-3xl)",
      padding: "var(--spacing-12) var(--spacing-6)",
      display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "var(--spacing-5)",
    }}>
      <p style={{ margin: 0, maxWidth: "34em", fontSize: "var(--text-lg)", lineHeight: 1.6, color: "var(--text-secondary)" }}>
        {screen.message}
      </p>
      {screen.signOff && <AsmtV15Tag>{screen.signOff}</AsmtV15Tag>}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "var(--spacing-3)" }}>
        {screen.ctas.map((c) => c.action
          ? <AsmtV4Button key={c.label} label={c.label} onClick={() => onAction(c.action)} />
          : <AsmtV15LinkButton key={c.label} href={c.href} label={c.label} variant={c.variant} />)}
      </div>
      {screen.ctas.some((c) => c.standIn) && <AsmtV15Tag>Destination pending</AsmtV15Tag>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// E · result. The offer module is the doc's list of required terms (pricing
// is Open Item 15); the disclosure module sits next to it.
// ---------------------------------------------------------------------------
function AsmtV15Result({ rec, headingRef, recurring, onRecurring, onCta, submitted }) {
  const card = {
    background: "var(--color-white)", border: "1px solid var(--border-default)",
    borderRadius: "var(--radius-xl)", padding: "var(--spacing-6)",
    display: "flex", flexDirection: "column", gap: "var(--spacing-4)",
  };
  const sectionTitle = {
    margin: 0, fontSize: "var(--text-xl)", fontWeight: "var(--font-weight-semibold)",
    fontFamily: "var(--font-family-display, var(--font-family-base))", color: "var(--text-default)",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-5)" }}>
      <div style={{ ...card, alignItems: "center", textAlign: "center", padding: "var(--spacing-10) var(--spacing-6)" }}>
        <h2 ref={headingRef} tabIndex={-1} style={{
          margin: 0, outline: "none", fontSize: "var(--text-4xl)", fontWeight: 400, lineHeight: 1.15,
          fontFamily: "var(--font-family-display, var(--font-family-base))", color: "var(--text-default)",
        }}>{rec.headline}</h2>
        <p style={{ margin: 0, maxWidth: "32em", fontSize: "var(--text-base)", lineHeight: 1.6, color: "var(--text-secondary)" }}>
          {rec.underHeadline}
        </p>
      </div>

      {rec.bullets.length > 0 &&
        <div style={card}>
          <h3 style={sectionTitle}>Why This Path May Fit</h3>
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
            {rec.bullets.map((b, i) => (
              <li key={i} style={{ display: "flex", gap: "var(--spacing-3)", alignItems: "flex-start" }}>
                <span aria-hidden="true" style={{
                  width: 24, height: 24, flex: "none", borderRadius: "50%", marginTop: 1,
                  background: "var(--accent-strong)", color: "var(--color-white)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}><AsmtCheckGlyph size={12} /></span>
                <span style={{ fontSize: "var(--text-base)", lineHeight: 1.55, color: "var(--text-default)" }}>{b}</span>
              </li>
            ))}
          </ul>
          <AsmtV15Tag>Draft copy</AsmtV15Tag>
        </div>}

      <div style={card}>
        <h3 style={sectionTitle}>Next Steps</h3>
        <ol style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
          {rec.nextSteps.map((s, i) => (
            <li key={i} style={{ display: "flex", gap: "var(--spacing-3)", alignItems: "flex-start" }}>
              <AsmtBadge size={24} state="todo">{i + 1}</AsmtBadge>
              <span style={{ fontSize: "var(--text-base)", lineHeight: 1.5, color: "var(--text-default)", paddingTop: 1 }}>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div style={card}>
        <h3 style={sectionTitle}>Your Offer</h3>
        <AsmtV15Tag>Pending pricing and terms</AsmtV15Tag>
        <ul style={{ margin: 0, paddingLeft: "var(--spacing-5)", display: "flex", flexDirection: "column", gap: "var(--spacing-1)",
          fontSize: "var(--text-sm)", lineHeight: 1.55, color: "var(--text-secondary)" }}>
          {rec.offerItems.map((o) => <li key={o}>{o}</li>)}
        </ul>
        <AsmtV15CheckRow id="asmt-v15-recurring" checked={recurring} onToggle={onRecurring}>{rec.recurringAck}</AsmtV15CheckRow>
        <div style={{
          background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", padding: "var(--spacing-4) var(--spacing-5)",
          display: "flex", flexDirection: "column", gap: "var(--spacing-2)",
        }}>
          {rec.disclosures.map((d) => (
            <p key={d} style={{ margin: 0, fontSize: "var(--text-xs)", lineHeight: 1.6, color: "var(--text-secondary)" }}>{d}</p>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-3)", marginTop: "var(--spacing-2)" }}>
        <AsmtV4Button label={rec.cta} onClick={onCta} />
        {submitted &&
          <AsmtV15VendorSlot title="Account portal"
            note="The account portal opens here once it is connected. Your answers, consents and provider-review flags are handed over through window.chimeAssessmentSubmit." />}
      </div>
    </div>
  );
}

// DS-1 on every assessment screen, plus Privacy · Terms · Language assistance.
function AsmtV15Footer({ notice, links }) {
  return (
    <footer style={{
      borderTop: "1px solid var(--border-subtle)", paddingTop: "var(--spacing-4)",
      display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-2)", textAlign: "center",
    }}>
      <p style={{ margin: 0, fontSize: "var(--text-sm)", lineHeight: 1.5, color: "var(--text-secondary)" }}>{notice}</p>
      <p className="asmt-v15-footer-links" style={{ margin: 0, fontSize: "var(--text-sm)" }}>
        {links.map((l, i) => (
          <React.Fragment key={l.label}>
            {i > 0 && <span aria-hidden="true" style={{ color: "var(--text-muted)" }}> · </span>}
            <a href={l.href} target="_blank" rel="noopener">{l.label}</a>
          </React.Fragment>
        ))}
      </p>
    </footer>
  );
}

Object.assign(window, {
  AsmtV15Tag, AsmtV15LinkedText, AsmtV15CheckRow, AsmtV15Basics, AsmtV15Notice, AsmtV15Privacy,
  AsmtV15Consent, AsmtV15Textarea, AsmtV15Reveal, AsmtV15Single, AsmtV15Journey, AsmtV15Contact,
  AsmtV15SnapshotPanel, AsmtV15Password, AsmtV15Selects, AsmtV15Dose, AsmtV15Upload, AsmtV15Address,
  AsmtV15VendorSlot, AsmtV15IdVerify, AsmtV15LinkButton, AsmtV15Exit, AsmtV15Result, AsmtV15Footer,
});
