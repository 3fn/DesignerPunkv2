# wcagValue Token Inventory

**Date**: 2026-03-18
**Spec**: 080-rosetta-mode-architecture
**Task**: 9.2
**Purpose**: Document all semantic tokens using inline `wcagValue` and their equivalent theme file overrides for Phase 2 migration.

---

## Inventory

7 semantic color tokens use `primitiveReferences.wcagValue`. Phase 2 migrates each to a `wcag/SemanticOverrides.ts` theme file entry.

| Token | Base Primitive | wcagValue Primitive | WCAG Theme File Override |
|-------|---------------|--------------------|-----------------------|
| `color.feedback.info.text` | teal400 | purple500 | `{ value: 'purple500' }` |
| `color.feedback.info.background` | teal100 | purple100 | `{ value: 'purple100' }` |
| `color.feedback.info.border` | teal400 | purple500 | `{ value: 'purple500' }` |
| `color.action.primary` | cyan300 | teal300 | `{ value: 'teal300' }` |
| `color.action.navigation` | cyan500 | teal500 | `{ value: 'teal500' }` |
| `color.contrast.onAction` | black500 | white100 | `{ value: 'white100' }` |
| `color.background.primary.subtle` | cyan100 | teal100 | `{ value: 'teal100' }` |

## Swap Patterns

Three distinct WCAG swap patterns:

1. **Info feedback: teal → purple** (3 tokens) — Color family change for WCAG distinguishability. Info uses teal in base, purple in WCAG to differentiate from success (green) and action (cyan).

2. **Action: cyan → teal** (2 tokens) — Contrast improvement. Cyan primitives swap to higher-contrast teal equivalents in WCAG theme.

3. **Contrast inversion: black → white** (1 token) — `onAction` content color inverts because the WCAG action background (teal) is darker than the base action background (cyan), requiring white content for contrast compliance.

4. **Background: cyan → teal** (1 token) — Subtle primary background follows the action color family swap for consistency.

## Interaction with Dark Overrides

2 of the 7 wcagValue tokens also have dark overrides:

| Token | Dark Override | Implication |
|-------|-------------|-------------|
| `color.action.navigation` | `{ value: 'cyan100' }` | Phase 2 needs a `dark-wcag` override: `{ value: 'teal100' }` (teal equivalent of cyan100) |
| `color.background.primary.subtle` | `{ value: 'cyan500' }` | Phase 2 needs a `dark-wcag` override: `{ value: 'teal500' }` (teal equivalent of cyan500) |

The remaining 5 wcagValue tokens have no dark overrides — their `dark-wcag` context resolves the wcag primitive against the dark theme slot (same primitive name, dark mode value).
