# DTCG & Figma wcagValue Support

**Date**: 2026-03-12
**Purpose**: Add wcagValue support to DTCG token export and Figma variable import pipelines
**Organization**: spec-guide
**Scope**: 077-dtcg-figma-wcagvalue-support
**Status**: Design outline — needs exploration of DTCG extension conventions and Figma variable modes

---

## Problem Statement

Spec 076 introduced `wcagValue` on semantic token `primitiveReferences` — a theme-conditional primitive reference that allows tokens to resolve to different primitives in WCAG accessibility mode. The three platform generators (web CSS, iOS Swift, Android Kotlin) handle this correctly, but two export pipelines do not:

1. **DTCG export** (`DTCGFormatGenerator.ts`): Throws when encountering a token with `wcagValue`. The `dist/DesignTokens.dtcg.json` file is stale.
2. **Figma import** (`FigmaTransformer.ts`): Throws when encountering `$extensions.designerpunk.wcagValue` in DTCG input. Figma variable sync is blocked for any token set containing `wcagValue` tokens.

Both pipelines currently have guard rails (deliberate throws with descriptive errors) installed by Spec 076 Task 1.4. This spec replaces those guard rails with full support.

### Affected Tokens (as of Spec 076)

| Token | `value` | `wcagValue` |
|-------|---------|-------------|
| `color.action.primary` | `cyan300` | `teal300` |
| `color.background.primary.subtle` | `cyan100` | `teal100` |
| `color.contrast.onAction` | `black500` | `white100` |
| `color.action.navigation` | `cyan500` | `teal500` |
| `color.feedback.info.text` | `teal400` | `purple500` (pending 076 Task 2.6) |
| `color.feedback.info.background` | `teal100` | `purple100` (pending 076 Task 2.6) |
| `color.feedback.info.border` | `teal400` | `purple500` (pending 076 Task 2.6) |

This list will grow as more tokens adopt theme-conditional behavior.

---

## DTCG Export: Exploration Needed

The [DTCG (W3C Design Tokens)](https://tr.designtokens.org/format/) spec has no native concept of theme-conditional values. The standard `$value` field holds a single resolved value or alias.

### Option A: `$extensions` with DesignerPunk namespace

```json
"color.action.primary": {
  "$value": "{color.cyan300}",
  "$type": "color",
  "$extensions": {
    "designerpunk": {
      "wcagValue": "{color.teal300}"
    }
  }
}
```

Pros:
- `$extensions` is the DTCG-sanctioned mechanism for vendor-specific data
- Standard-compliant tools ignore unknown extensions gracefully
- `$value` remains the canonical value — tools that don't understand `wcagValue` still get a valid token

Cons:
- No interop — other tools won't know what `wcagValue` means
- Extension schema is our own invention, not a community convention
- Consumers must know to look in `$extensions.designerpunk` for WCAG overrides

### Option B: Separate token entries with naming convention

```json
"color.action.primary": {
  "$value": "{color.cyan300}",
  "$type": "color"
},
"color.action.primary.wcag": {
  "$value": "{color.teal300}",
  "$type": "color"
}
```

Pros:
- Pure DTCG — no extensions needed
- Every tool can read both tokens

Cons:
- Doubles the token count for every wcagValue token
- Consumers must know the `.wcag` suffix convention
- Breaks the 1:1 mapping between semantic token names and DTCG entries
- Harder to enforce that `.wcag` tokens are always paired

### Option C: DTCG `$extensions` with mode concept

```json
"color.action.primary": {
  "$value": "{color.cyan300}",
  "$type": "color",
  "$extensions": {
    "designerpunk": {
      "modes": {
        "default": "{color.cyan300}",
        "wcag": "{color.teal300}"
      }
    }
  }
}
```

Pros:
- Forward-looking — if DTCG ever adds native mode support, migration is straightforward
- Extensible to other modes beyond wcag (e.g., high-contrast, reduced-motion color shifts)
- `$value` remains canonical for tools that don't understand modes

Cons:
- More complex schema
- `$value` duplicates the `default` mode — potential for drift
- Over-engineering if wcag is the only mode we'll ever need

### Ada's Initial Recommendation

Option A is the simplest path that solves the problem. Option C is more future-proof but adds complexity we may not need. Option B is a non-starter — it breaks the token identity model.

**Needs Peter's input**: Is multi-mode support a realistic future need, or is wcag the only theme-conditional case we foresee?

---

## Figma Import: Exploration Needed

Figma Variables support "modes" natively — a variable collection can have multiple modes, and each mode can hold a different value. This maps naturally to `wcagValue`.

### Option A: Single collection with modes

Map `value` → default mode, `wcagValue` → "WCAG" mode within the same Figma variable collection.

```
Collection: "Semantic Colors"
  Mode: "Default"  → color.action.primary = cyan300
  Mode: "WCAG"     → color.action.primary = teal300
```

Pros:
- Native Figma concept — designers switch modes in the UI
- 1:1 token-to-variable mapping preserved
- Figma's mode switching is exactly what wcagValue represents

Cons:
- Requires the Figma file to have the "WCAG" mode pre-configured on the collection
- Figma free plan limits modes to 1 per collection (paid plans allow more)
- Transformer needs to understand mode mapping

### Option B: Separate variables with suffix

```
color-action-primary        = cyan300
color-action-primary-wcag   = teal300
```

Pros:
- Works on any Figma plan
- Simple implementation

Cons:
- Same problems as DTCG Option B — doubles variables, breaks identity model
- Designers must manually pick the right variable

### Ada's Initial Recommendation

Option A (Figma modes) is the natural fit. Figma's variable mode system was designed for exactly this use case. The plan limitation is a constraint worth documenting but shouldn't drive the architecture.

**Needs exploration**: How does the current `FigmaTransformer` handle variable collections and modes? Does it already have mode infrastructure we can extend?

---

## Scope

### In Scope
- Replace DTCG guard rail (`throw`) with wcagValue-aware generation
- Replace Figma guard rail (`throw`) with wcagValue-aware variable import
- Update `dist/DesignTokens.dtcg.json` to include wcagValue data
- Tests for both pipelines with wcagValue tokens

### Out of Scope
- Figma plugin development (this spec covers the data format, not a sync tool)
- DTCG community standardization of theme-conditional tokens
- Non-color wcagValue tokens (if they ever exist)

---

## Dependencies

- **Spec 076**: Must be complete — provides the `wcagValue` infrastructure and guard rails this spec replaces
- **DTCG spec knowledge**: Need to verify current `$extensions` conventions in the community
- **Figma API**: Need to verify variable mode creation/update capabilities

---

## Open Questions

1. Is multi-mode support (beyond wcag) a realistic future need?
2. Does the current FigmaTransformer have any mode infrastructure?
3. Should the DTCG file omit wcagValue tokens entirely (skip instead of throw) as an interim option, or is full support the only acceptable path?
4. Are there other DTCG consumers in the ecosystem we should consider for interop?

---

## Test Coverage Debt (from Spec 076)

When Spec 076 Task 2 migrated tokens with `wcagValue`, the DTCG `generate()` method was made to catch the guard rail error and skip `semanticColor` rather than abort. This kept the test suite green but created a coverage gap: 10 tests across 4 files lost their semantic color assertions.

### Affected Tests

| File | Test | What Happened |
|------|------|---------------|
| `DTCGFormatGenerator.test.ts` | "should use alias syntax in semantic color tokens" | Early return when semanticColor absent |
| `DTCGFormatGenerator.test.ts` | "should contain all expected top-level token groups" | semanticColor removed from expected list |
| `DTCGFormatGenerator.test.ts` | "should produce at least 180 semantic tokens" | Threshold lowered 180→120 |
| `DTCGConfigOptions.test.ts` | "should resolve semantic color aliases" | Early return when semanticColor absent |
| `DTCGConfigOptions.test.ts` | "should preserve alias syntax in semantic tokens" | Early return when semanticColor absent |
| `DTCGFormatGenerator.integration.test.ts` | "should include both primitive and semantic groups" | semanticColor removed from expected list |
| `DTCGFormatGenerator.integration.test.ts` | "should have a DTCG group for every semantic token category" | semanticColor removed from mapping |
| `DTCGFormatGenerator.property.test.ts` | "semantic color tokens use alias syntax" | Early return when semanticColor absent |
| `DTCGFormatGenerator.property.test.ts` | "total token count meets minimum thresholds" | Threshold lowered 350→290 |
| `DTCGFormatGenerator.property.test.ts` | "every expected semantic group exists" | semanticColor removed from expected list |

### What Spec 077 Must Do

1. Replace the guard rail in `generateSemanticColorTokens()` with real wcagValue-aware DTCG generation
2. Remove the try/catch in `generate()` that swallows the semantic color error
3. Restore `semanticColor` to all expected group lists in the 4 test files
4. Restore thresholds (120→original+new, 290→original+new)
5. Remove all early-return guards (`if (!semanticColors) return`)
6. Add new tests verifying wcagValue data appears correctly in DTCG output

### Source Files to Restore

- `src/generators/DTCGFormatGenerator.ts` — remove try/catch around `generateSemanticColorTokens()`
- `src/generators/__tests__/DTCGFormatGenerator.test.ts`
- `src/generators/__tests__/DTCGConfigOptions.test.ts`
- `src/generators/__tests__/DTCGFormatGenerator.integration.test.ts`
- `src/generators/__tests__/DTCGFormatGenerator.property.test.ts`
- `src/generators/__tests__/WcagValueExportGuardRails.test.ts` — DTCG test currently verifies omission; restore to verify correct output

---

## Origin

- Guard rails installed: Spec 076, Task 1.4
- Gap analysis: `.kiro/specs/076-primary-action-color-migration/findings/lina-dtcg-figma-wcagvalue-gap.md`
- Design decision: Spec 076, Decision 8 (guard rails now, full support as follow-up)
