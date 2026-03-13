# Design Document: DTCG & Figma wcagValue Support

**Date**: 2026-03-12
**Spec**: 077 - DTCG & Figma wcagValue Support
**Status**: Design Phase
**Dependencies**: Spec 076 (complete — `d79f4ed5`)

---

## Overview

Two export pipelines need wcagValue support: the DTCG token generator (`DTCGFormatGenerator.ts`) and the Figma variable transformer (`FigmaTransformer.ts`). Both currently throw when encountering wcagValue tokens — guard rails installed by Spec 076 Task 1.4.

This design replaces those guard rails with:
1. A `$extensions.designerpunk.modes` schema in DTCG output (Option C from design outline)
2. A WCAG mode on the Figma Semantics variable collection (Option A from design outline)

Additionally, 10 tests across 4 files were weakened during 076 to accommodate the guard rails. This design restores them.

---

## Architecture

### Layer Model

```
Source Layer                    Export Layer                  Consumer Layer
─────────────                   ────────────                  ──────────────
primitiveReferences: {          $extensions: {                Figma: valuesByMode: {
  value: 'cyan300',      →       designerpunk: {       →       light: resolved,
  wcagValue: 'teal300'            modes: {                      dark: resolved,
}                                   wcag: '{color.teal300}'     wcag: resolvedWcag
                                  }                           }
                                }
                              }
```

- **Source layer**: `wcagValue` on `primitiveReferences` (TypeScript, unchanged by this spec)
- **Export layer**: `$extensions.designerpunk.modes.wcag` in DTCG JSON (new)
- **Consumer layer**: `valuesByMode.wcag` on Figma variables (new)

The source-to-export mapping is `wcagValue` → `modes.wcag`. The export-to-consumer mapping is `modes.wcag` → `valuesByMode.wcag`.

### DTCG Output Schema

```json
{
  "color.action.primary": {
    "$value": "{color.cyan300}",
    "$type": "color",
    "$extensions": {
      "designerpunk": {
        "family": "color",
        "modes": {
          "wcag": "{color.teal300}"
        }
      }
    }
  }
}
```

Key properties:
- `$value` is always the default (non-WCAG) alias — canonical for tools that don't understand modes
- `modes` contains only non-default overrides — no `"default"` key, no empty object
- Mode values use alias syntax (`{color.teal300}`), not resolved RGBA
- Tokens without `wcagValue` have no `modes` key at all

### Figma Variable Structure

```
Collection: "Semantics"
  modes: ['light', 'dark', 'wcag']

  Variable: color/action/primary
    valuesByMode:
      light: { r: 0, g: 0.94, b: 1, a: 1 }    // cyan300 (illustrative)
      dark:  { r: 0, g: 0.94, b: 1, a: 1 }     // same (Phase 1)
      wcag:  { r: 0, g: 0.79, b: 0.65, a: 1 }  // teal300 (illustrative)

  Variable: color/text/default
    valuesByMode:
      light: { r: 0.15, g: 0.20, b: 0.23, a: 1 }  // gray300 (illustrative)
      dark:  { r: 0.15, g: 0.20, b: 0.23, a: 1 }   // same
      wcag:  { r: 0.15, g: 0.20, b: 0.23, a: 1 }   // fallback = light
```

Key properties:
- Only the Semantics collection gets a WCAG mode (primitives are theme-invariant)
- Tokens without a WCAG override fall back to their `light` value (Figma constraint: all variables must have values for all modes)
- This is the first time the mode infrastructure resolves *different* values per mode

---

## Components and Interfaces

### DTCGFormatGenerator Changes

**File**: `src/generators/DTCGFormatGenerator.ts`

**`generateSemanticColorTokens()` (~line 523)**:
- Remove the `throw` guard rail for `wcagValue`
- When `refs.wcagValue` is present, build `modes: { wcag: '{color.${refs.wcagValue}}' }` and attach to `extensions`
- When `refs.wcagValue` is absent, do not add `modes` to extensions
- When `resolveAliases` config is true, resolve `modes.wcag` to RGBA using the same resolution path as `$value`

**`generate()` (~line 143-152)**:
- Remove the try/catch that swallows the wcagValue error
- Call `generateSemanticColorTokens()` directly: `output.semanticColor = this.generateSemanticColorTokens();`

### FigmaTransformer Changes

**File**: `src/generators/transformers/FigmaTransformer.ts`

**Semantics collection construction**:
- Add `'wcag'` to the `modes` array: `modes: ['light', 'dark', 'wcag']`

**`extractVariablesFromGroup()` (~line 318-325)**:
- Remove the `throw` guard rail for `wcagValue`
- Read `$extensions.designerpunk.modes.wcag` from the DTCG token
- If present, resolve the alias value and set `valuesByMode.wcag`
- If absent, set `valuesByMode.wcag` = same as `valuesByMode.light` (fallback)

**Current code** (to be replaced):
```typescript
valuesByMode: {
  light: resolvedValue,
  dark: resolvedValue,
},
```

**New code** (conceptual):
```typescript
valuesByMode: {
  light: resolvedValue,
  dark: resolvedValue,
  wcag: wcagResolvedValue ?? resolvedValue,
},
```

---

## Data Models

### DesignerPunkExtensions (existing, extended)

The `DesignerPunkExtensions` interface in `DTCGFormatGenerator.ts` needs a `modes` field:

```typescript
interface DesignerPunkExtensions {
  family?: string;
  deprecated?: boolean;
  primitiveRefs?: Record<string, string>;
  modifiers?: unknown[];
  modes?: Record<string, string>;  // NEW — mode overrides (e.g., { wcag: '{color.teal300}' })
}
```

No changes to `FigmaVariable`, `FigmaVariableCollection`, or `SemanticToken` interfaces.

---

## Error Handling

### Guard Rail Removal

Both guard rails are replaced with functional code. No new error paths are introduced — the generator either emits modes data or doesn't, based on whether `wcagValue` is present.

### Edge Cases

| Case | DTCG Behavior | Figma Behavior |
|------|---------------|----------------|
| Token has `wcagValue` | Emit `modes.wcag` with alias | Resolve alias, set `valuesByMode.wcag` |
| Token has no `wcagValue` | No `modes` key | `valuesByMode.wcag` = `valuesByMode.light` |
| Token has `wcagValue` pointing to nonexistent primitive | Existing primitive validation catches this upstream | Same — DTCG input would already be invalid |
| `resolveAliases` config is true | Resolve `modes.wcag` to RGBA (same as `$value` behavior) | N/A — Figma always resolves |

> **Implementation note (Ada F1 / Lina C7)**: Verify during implementation whether the existing `resolveAliases` code path walks into `$extensions.designerpunk.modes` to resolve aliases. If it only resolves `$value`, the mode resolution needs to be added to `generateSemanticColorTokens()` alongside the alias construction. If resolved DTCG output is never consumed by anything that reads modes, document why it's safe to skip.

---

## Testing Strategy

### Test Restoration (10 tests across 4 files)

All weakened tests are restored to their pre-076 assertion strength:

| File | Restoration |
|------|-------------|
| `DTCGFormatGenerator.test.ts` | Re-add `semanticColor` to expected groups, restore threshold ≥180 |
| `DTCGConfigOptions.test.ts` | Remove early-return guards, assert semantic color alias resolution |
| `DTCGFormatGenerator.integration.test.ts` | Re-add `semanticColor` to expected groups and category mapping |
| `DTCGFormatGenerator.property.test.ts` | Re-add `semanticColor` to expected groups, restore threshold ≥350 |

### Guard Rail Test Transformation

`WcagValueExportGuardRails.test.ts` → renamed to `WcagValueExportSupport.test.ts`:

| Current Assertion | New Assertion |
|-------------------|---------------|
| DTCG: wcagValue token → throws | DTCG: wcagValue token → `$extensions.designerpunk.modes.wcag` present |
| DTCG: wcagValue tokens omitted | DTCG: wcagValue tokens present with modes extension |
| Figma: wcagValue in extensions → throws | Figma: wcagValue → `valuesByMode.wcag` populated with resolved value |

Source token fixtures (mock `SemanticToken` objects with `wcagValue` on `primitiveReferences`) are preserved. DTCG structure fixtures fed to the Figma transformer are updated to the new `modes` shape.

### New Tests

| Test | Verifies |
|------|----------|
| DTCG: modes object absent when no wcagValue | Req 1 AC 2 — no empty modes |
| DTCG: modes uses alias syntax | Req 1 AC 5 |
| DTCG: $value unchanged by wcagValue presence | Req 1 AC 3 |
| Figma: wcag mode in Semantics collection | Req 3 AC 2 |
| Figma: wcag fallback for non-wcagValue tokens | Req 3 AC 3 |
| Figma: Primitives collection has no wcag mode | Req 3 AC 5 |

---

## Design Decisions

### Decision 1: Modes Schema Over Flat wcagValue Extension

**Selected**: `$extensions.designerpunk.modes.wcag` (Option C)
**Rejected**: `$extensions.designerpunk.wcagValue` (Option A), separate `.wcag` tokens (Option B)
**Rationale**: Multi-mode is inevitable (Peter's assessment). The generalized `modes` object accepts arbitrary string keys, making future modes (high-contrast, reduced-motion) additive. Migration to DTCG native `$modes` (#210) is mechanical. Option B breaks token identity model.

### Decision 2: No Default Key in Modes

**Selected**: `modes` contains only non-default overrides
**Rejected**: Including `"default": "{color.cyan300}"` alongside `"wcag": "{color.teal300}"`
**Rationale**: `$value` is already the default. Duplicating it in `modes` creates drift risk with zero benefit. Aligns with DTCG #210's pattern where `$value` is the fallback.

### Decision 3: Figma WCAG Fallback = Light Value

**Selected**: Tokens without WCAG override get `valuesByMode.wcag` = `valuesByMode.light`
**Rejected**: Omitting `valuesByMode.wcag` for non-WCAG tokens
**Rationale**: Figma platform constraint — all variables in a collection must have values for all modes. Known UX trade-off: designers may interpret fallback values as "reviewed for WCAG" when they're actually "no WCAG differentiation needed."

### Decision 4: Hardcoded wcagValue → wcag Mapping

**Selected**: Generator explicitly maps `primitiveReferences.wcagValue` → `modes.wcag`
**Rejected**: Generic mode key discovery on `primitiveReferences`
**Rationale**: `primitiveReferences` is `Record<string, string>` mixing structural keys (`value`, `fontSize`, `multiplier`) with mode keys (`wcagValue`). No reliable way to distinguish them without a convention. Convention deferred until second mode materializes. DTCG output schema is extensible regardless.

### Decision 5: Guard Rail Tests Transformed, Not Deleted

**Selected**: Rename file, preserve inputs, flip assertions
**Rejected**: Delete guard rail tests and write new ones from scratch
**Rationale**: Guard rail tests already have the right token fixtures and test structure. Transforming preserves coverage intent while reflecting new behavior. File rename (`GuardRails` → `Support`) prevents confusion about what the tests verify.

### Decision 6: Primitives Collection Excluded from WCAG Mode

**Selected**: Only Semantics collection gets WCAG mode
**Rejected**: Adding WCAG mode to Primitives collection
**Rationale**: Primitives are theme-invariant — `cyan300` is `cyan300` regardless of mode. Theme-conditional behavior is a semantic-layer concept. Adding WCAG mode to Primitives would create meaningless duplication.

### Decision 7: Steering Doc Updates Deferred to End of Spec

**Selected**: Document mode architecture in steering docs after implementation
**Rejected**: Updating steering docs before or during implementation
**Rationale**: Token-Semantic-Structure.md, Rosetta-System-Architecture.md, and rosetta-system-principles.md all need updates to document the mode mechanism. Writing from working code is more accurate than writing from design intent. One pass at the end avoids double-updating if implementation reveals adjustments.
