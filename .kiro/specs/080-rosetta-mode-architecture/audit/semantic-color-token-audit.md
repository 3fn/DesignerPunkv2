# Semantic Color Token Audit

**Date**: 2026-03-17
**Spec**: 080 - Rosetta Mode Architecture
**Task**: 3.1
**Agent**: Ada
**Total tokens**: 61

---

## Classification Criteria

- **Level 1**: Primitive handles mode differentiation. Same primitive name in both modes; the primitive's `light`/`dark` slots carry distinct values. No semantic override needed.
- **Level 2**: Semantic override required. Different primitive *name* per mode (role remapping). Override swaps `primitiveReferences` in dark mode.
- **Mode-invariant**: Same value in both modes by design. Either `modeInvariant: true` or semantically mode-independent (print, glow).

### Classification Confidence

- **Confirmed**: Dark mode design exists (Figma-extracted, Nav-TabBar-Base).
- **Projected**: No dark mode design yet. Classification based on semantic role analysis — most tokens will be Level 1 (primitive handles it) once dark primitive values are populated. Level 2 classification requires a design decision that the primitive *name* changes, which only happens when a component spec provides dark mode mappings.

---

## Summary

| Classification | Count | Percentage |
|----------------|-------|------------|
| Level 1 | 52 | 85% |
| Level 2 (confirmed) | 0 | 0% |
| Level 2 (projected) | 0 | 0% |
| Mode-invariant | 9 | 15% |
| **Total** | **61** | **100%** |

**Level 1 : Level 2 ratio**: No confirmed Level 2 tokens at this time.

**Composite token proof case**: `color.structure.border.subtle` — uses `{ color: 'gray100', opacity: 'opacity048' }`. Classified Level 1 (primitive `gray100` carries mode-aware values; opacity unchanged).

---

## Level 2 Tokens: None Confirmed

The Nav-TabBar-Base spec (050) lists confirmed *primitive* references per mode (e.g., `cyan500` Day / `cyan100` Night for active icon), but the semantic token mapping has not been done yet — it's blocked on mode architecture (B1 in 050 feedback). Until Lina completes the semantic token assignment for Nav-TabBar-Base (050 OQ-11), we cannot determine which semantic tokens need Level 2 overrides vs. which are handled by Level 1 primitive dark values.

**What we know from 050:**
- Container background: `white100` (Day) / `gray400` (Night) — primitives differ
- Active icon: `cyan500` (Day) / `cyan100` (Night) — primitives differ
- Inactive icon: `gray300` (Day) / `gray100` (Night) — primitives differ
- Top stroke: `white200` (Day) / `gray500` (Night) — primitives differ
- Indicator dot: `cyan500` (Day) / `cyan100` (Night) — primitives differ

These are primitive-level mappings. Whether they become Level 1 (same semantic token, primitive carries both values) or Level 2 (semantic override swaps the primitive name) depends on which semantic tokens are assigned to each element — a decision that hasn't been made yet.

**Implication for the dark theme file (Task 3.2)**: The theme file skeleton will list all 61 tokens with all entries commented out. No Level 2 overrides can be populated until the Nav-TabBar-Base semantic token mapping is complete.

---

## Mode-Invariant Tokens (9)

Tokens where the value is intentionally identical in both modes.

| Token | Primitive | Rationale |
|-------|-----------|-----------|
| `color.scrim.standard` | `black500` + opacity080 | Scrim dims content regardless of mode. `modeInvariant: true` |
| `color.print.default` | `black100` | Print media is mode-independent |
| `glow.neonPurple` | `purple500` | Glow effects are mode-independent — vibrant neon regardless of background |
| `glow.neonCyan` | `cyan500` | Same rationale |
| `glow.neonYellow` | `yellow500` | Same rationale |
| `glow.neonGreen` | `green500` | Same rationale |
| `glow.neonPink` | `pink500` | Same rationale |
| `color.contrast.onLight` | `black500` | Content-on-light is always dark. Mode doesn't change the background context. |
| `color.contrast.onDark` | `white100` | Content-on-dark is always light. Mode doesn't change the background context. |

**Note on contrast tokens**: `color.contrast.onLight` and `color.contrast.onDark` are mode-invariant because they describe content on a *specific* background color, not on the system background. A dark-on-light-background element stays dark regardless of system mode. If a future design needs mode-aware contrast (e.g., "content on the system canvas"), that would be a new token, not a modification of these.

---

## Level 1 Tokens (52)

Primitive handles mode differentiation. Once dark primitive values are populated, these resolve correctly without semantic overrides.

### Feedback — Success (3)
| Token | Primitive | Notes |
|-------|-----------|-------|
| `color.feedback.success.text` | `green400` | |
| `color.feedback.success.background` | `green100` | |
| `color.feedback.success.border` | `green400` | |

### Feedback — Error (3)
| Token | Primitive | Notes |
|-------|-----------|-------|
| `color.feedback.error.text` | `pink400` | |
| `color.feedback.error.background` | `pink100` | |
| `color.feedback.error.border` | `pink400` | |

### Feedback — Warning (3)
| Token | Primitive | Notes |
|-------|-----------|-------|
| `color.feedback.warning.text` | `orange400` | |
| `color.feedback.warning.background` | `orange100` | |
| `color.feedback.warning.border` | `orange400` | |

### Feedback — Info (3) [WCAG]
| Token | Primitive | wcagValue | Notes |
|-------|-----------|-----------|-------|
| `color.feedback.info.text` | `teal400` | `purple500` | Phase 2: wcagValue migrates to theme file |
| `color.feedback.info.background` | `teal100` | `purple100` | Phase 2 |
| `color.feedback.info.border` | `teal400` | `purple500` | Phase 2 |

### Feedback — Select (6)
| Token | Primitive | Notes |
|-------|-----------|-------|
| `color.feedback.select.text.rest` | `cyan400` | |
| `color.feedback.select.text.default` | `gray200` | |
| `color.feedback.select.background.rest` | `cyan100` | |
| `color.feedback.select.background.default` | `gray100` | |
| `color.feedback.select.border.rest` | `cyan400` | |
| `color.feedback.select.border.default` | `gray200` | |

### Feedback — Notification (2)
| Token | Primitive | Notes |
|-------|-----------|-------|
| `color.feedback.notification.background` | `pink400` | |
| `color.feedback.notification.text` | `white100` | |

### Identity (2)
| Token | Primitive | Notes |
|-------|-----------|-------|
| `color.identity.human` | `orange300` | |
| `color.identity.agent` | `teal200` | |

### Action (3) [WCAG on 2]
| Token | Primitive | wcagValue | Notes |
|-------|-----------|-----------|-------|
| `color.action.primary` | `cyan300` | `teal300` | Phase 2: wcagValue migrates |
| `color.action.secondary` | `gray400` | | |
| `color.action.navigation` | `cyan500` | `teal500` | Phase 2: wcagValue migrates |

### Attention / Highlight (2)
| Token | Primitive | Notes |
|-------|-----------|-------|
| `color.attention` | `yellow400` | |
| `color.highlight` | `yellow300` | |

### Tech / Data (2)
| Token | Primitive | Notes |
|-------|-----------|-------|
| `color.tech` | `purple400` | |
| `color.data` | `purple300` | |

### Text Hierarchy (3)
| Token | Primitive | Notes |
|-------|-----------|-------|
| `color.text.default` | `gray300` | |
| `color.text.muted` | `gray200` | |
| `color.text.subtle` | `gray100` | |

### Contrast (1 of 3 — 2 are mode-invariant) [WCAG]
| Token | Primitive | wcagValue | Notes |
|-------|-----------|-----------|-------|
| `color.contrast.onAction` | `black500` | `white100` | Phase 2: wcagValue migrates |

### Structure (7)
| Token | Primitive | Notes |
|-------|-----------|-------|
| `color.structure.canvas` | `white100` | |
| `color.structure.surface` | `white200` | |
| `color.structure.surface.primary` | `white200` | |
| `color.structure.surface.secondary` | `white300` | |
| `color.structure.surface.tertiary` | `white400` | |
| `color.structure.border` | `gray100` | |
| `color.structure.border.subtle` | `{ color: gray100, opacity: opacity048 }` | **Composite proof case** |

### Background (1) [WCAG]
| Token | Primitive | wcagValue | Notes |
|-------|-----------|-----------|-------|
| `color.background.primary.subtle` | `cyan100` | `teal100` | Phase 2: wcagValue migrates |

### Icon (1)
| Token | Primitive | Notes |
|-------|-----------|-------|
| `color.icon.default` | `gray200` | |

### Progress (10)
| Token | Primitive | Notes |
|-------|-----------|-------|
| `color.progress.current.background` | `cyan300` | |
| `color.progress.current.text` | `cyan400` | |
| `color.progress.pending.background` | `white300` | |
| `color.progress.pending.text` | `gray300` | |
| `color.progress.pending.connector` | `white200` | |
| `color.progress.completed.background` | `green100` | |
| `color.progress.completed.text` | `green400` | |
| `color.progress.completed.connector` | `green100` | |
| `color.progress.error.background` | `pink100` | |
| `color.progress.error.text` | `pink400` | |

---

## Cross-Reference: Nav-TabBar-Base Primitive Mappings

From Spec 050 design-outline § "Confirmed Primitives (from Figma + Ada R1)". These are *primitive* references per mode — semantic token assignment is pending (050 OQ-11, blocked on mode architecture B1).

| Nav-TabBar Element | Day Primitive | Night Primitive |
|--------------------|---------------|-----------------|
| Container background | `white100` | `gray400` |
| Active icon fill | `cyan500` | `cyan100` |
| Inactive icon fill | `gray300` | `gray100` |
| Indicator dot | `cyan500` | `cyan100` |
| Top stroke | `white200` | `gray500` |
| Active gradient center | `cyan100` | `cyan500` |
| Inactive gradient center | `white100` | `gray400` |

**Note**: The semantic token mapping (which semantic tokens these elements consume) has not been determined yet. That work resumes after mode architecture is implemented (050 OQ-11). Level 2 overrides, if any, will be identified at that point.

---

## Notes

1. **52 Level 1 tokens will "just work"** once their primitives have distinct dark values (Task 4). No semantic overrides needed.
2. **No confirmed Level 2 tokens at this time.** The Nav-TabBar-Base spec (050) has confirmed primitive mappings per mode, but the semantic token assignment hasn't been done yet (blocked on mode architecture, 050 OQ-11). Level 2 overrides will be identified when component specs assign semantic tokens to mode-differentiated elements.
3. **7 tokens have `wcagValue`** — these are Phase 2 migration candidates (Task 9-11). Not relevant to Phase 1 dark mode.
4. **1 composite token** (`color.structure.border.subtle`) serves as the proof case for composite-reference handling. It's Level 1 — the `gray100` primitive carries mode-aware values, and `opacity048` is mode-independent.
5. **Glow tokens classified mode-invariant** — neon glow effects are designed to be vibrant regardless of background. If a future spec needs mode-aware glow, new tokens would be created.
6. **The dark theme file (Task 3.2) will be a complete skeleton with all entries commented out.** Overrides will be populated incrementally as component specs complete their semantic token assignments.
