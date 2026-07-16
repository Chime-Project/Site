# Theme Contract — color agnosticism

**Rule:** components reference **only semantic/theme tokens**. They never name a
palette primitive (`--color-tide-*`, `--color-cadmium-*`, `--color-sage-*`,
`--color-iris-*`, `--color-blue-*` as an accent) or a raw hex/rgba brand color.
Each component inherits its palette from the nearest `data-theme` ancestor, which
the **page/section** sets. The component stays color-blind.

Themes (defined in `tokens/colors.css`, already reconciled — no change needed):

| `data-theme` | accent palette |
|---|---|
| `default` | blue |
| `weight-loss` | tide |
| `wellness` / `energy-wellness` | cadmium (gold) |
| `lab` | iris |

## Allowed in components
- Accent: `--accent-default | -hover | -strong | -active | -subtle | -subtleHover | -border | -onSubtle`
- Text/fg: `--text-default | -secondary | -muted | -on-primary`, `--fg-default | -muted`
- Surfaces: `--bg-default | -secondary | -tertiary | -elevated`, `--border-default | -strong`
- Dark glass: `--glass-surface | -surface-strong | -scrim | -solid | -border | -blur`, or `rgb(var(--glass-rgb) / α)` for a custom alpha
- Neutrals (theme-independent by design): `--color-white`, `--color-black`, `--color-sand-*`, `--color-slate-*`
- Status: `--success-* | --warning-* | --error-* | --info-*`
- Shadows/elevation: `--shadow-*`; neutral scrims `rgba(0,0,0,α)` / `rgba(255,255,255,α)`

## Forbidden in components
- Accent palette primitives: `--color-{tide,cadmium,sage,iris,peach}-*`, and `--color-blue-*` when used as an accent
- Raw brand hex (`#5E93D1`, `#D7AA52`, `#A59FD6`, `#1B263A`, …) and brand rgba (`rgba(94,147,209,…)`, `rgba(24,42,63,…)`, …)

## Mechanical mapping (Bucket 1 — the bulk of the work)
Any accent-palette shade → its accent token (same across all palettes):

| shade | token | tide hex | cadmium hex | iris hex |
|---|---|---|---|---|
| `-100` | `--accent-subtle` | #DFEAF6 | #FAF3E6 | #F3F3F9 |
| `-200` | `--accent-subtleHover` | #C3D7EE | #F3E3C4 | #E4E3F1 |
| `-300` | `--accent-border` | #A0C0E4 | #E4C68B | #D1CFE8 |
| `-500` | `--accent-default` | #5E93D1 | #D7AA52 | #A59FD6 |
| `-600` | `--accent-hover` | #387BC7 | #BE9137 | — |
| `-700` | `--accent-strong` | #2F67A7 | #9C7830 | #7D79A2 |
| `-800` | `--accent-active` | #265487 | #7C6027 | #6A6689 |

Section grounds are accents: `#5E93D1` (WL) / `#D7AA52` (wellness) → `--accent-default`.

## Translucent accent colors (technical requirement)
`rgba()` with brand channels (e.g. gradient masks `rgba(94,147,209,0.45)`) can't point
at `--accent-*`. Use `color-mix` so alpha stays theme-aware:

```
/* accent at 45% alpha */         color-mix(in srgb, var(--accent-default) 45%, transparent)
/* darken accent (glass/ink)  */  color-mix(in srgb, var(--accent-active) 92%, black)
```

## Bucket 2 — semantic, not accent (use the semantic token, not the primitive)
Constant brand ink that must NOT shift per theme:
- `--color-blue-800` as text/ground → `--fg-default` / `--text-default` (Footer, WeightLossHero)
- `#12263B`, `#2A283A` (LABS_INK) dark ink on light → `--text-default`
- `#b3261e` red → `--error-default`

## Bucket 3 — judgment calls (need a decision before extraction)
Flagged so extraction doesn't bake in an arbitrary choice:

1. **Button hover-fill navy.** `--color-blue-800` is the fixed fill for primary-button
   hover on every page (`WLBodiesSection`, `WLTimelineSection` WLTButton, WeightLossHero).
   → *Recommend:* switch to `--accent-active` so the sweep matches the page theme.
2. **Dark "glass" surfaces — RESOLVED.** Kept as a first-class dark surface via the
   `--glass-*` token family (see rule below). Not converted to accent.
3. **Off-scale gold/blue tints & glows** (`#F5E3A8`, `#E6C465`, `#D6ECFF`, `rgba(56,42,10,α)`
   text-shadows, `SIMPLE_PATH_RAMPS`): derive from accent stops or `color-mix`. Notably
   `SimplePathSection.SIMPLE_PATH_RAMPS` is a manual per-theme color table → replace with
   `--accent-active → --accent-default → --accent-subtle` so it needs no per-theme branch.
4. **Phantom token** `var(--color-navy-900, #1B263A)` — `--color-navy-900` doesn't exist
   (it's `--color-blue-950`); the hex fallback is what renders. Fix to a real token.

## Special rule — dark glass surfaces
Dark "smoked glass" is a **surface, not an accent.** It is intentionally a neutral deep
ink (so translucent panels read over any photo/video) and therefore does **not** follow
the accent palette. Express it with the `--glass-*` family (defined in `tokens/colors.css`):

| token | value | use |
|---|---|---|
| `--glass-surface` | navy @ 0.35α | default translucent panel/card |
| `--glass-surface-strong` | navy @ 0.55α | denser / nested panel |
| `--glass-scrim` | navy @ 0.45α | modal & overlay scrim |
| `--glass-solid` | navy @ 1α | solid dark section ground |
| `--glass-border` | white @ 0.08α | hairline edge on glass |
| `--glass-blur` | 6px | `backdrop-filter: blur(var(--glass-blur))` |

- Custom alpha: `background: rgb(var(--glass-rgb) / 0.62)`.
- **Homepage** stays navy (`:root --glass-rgb: 27 38 58`). This is the requested dark glass.
- A theme may **tint** its glass — e.g. `[data-theme="lab"]` uses iris-tinted glass, so
  Labs stays purple with no component change. Note: a tinting theme must re-declare the
  named stops, not only `--glass-rgb` — a stop's nested `var(--glass-rgb)` is substituted
  where the stop is *declared* (`:root`), so overriding just `--glass-rgb` won't re-tint
  `--glass-surface` et al. (The `rgb(var(--glass-rgb)/α)` point-of-use form always tints.)
  Other themes inherit the navy unless they opt in.
- Migration: replace `rgba(24,42,63,α)` / `rgba(27,38,58,α)` / `rgba(42,40,58,α)` and
  `#1B263A` grounds with the matching `--glass-*` token. The white hairline
  `rgba(255,255,255,0.08)` → `--glass-border`.

## Out of scope
`ui_kits/homepage/image-slot.js` (`#c96442`, editor chrome) is design-tool UI, not a
rendered site component.

## Guard
`bash ui_kits/shared/check-theme-agnostic.sh [dir]` — errors on palette primitives,
warns on raw hex/brand-rgba. Run per phase against the shared layer being built.
