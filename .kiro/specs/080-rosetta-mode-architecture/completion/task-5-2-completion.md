# Task 5.2 Completion: Update Web Generator for Mode-Aware Output

**Date**: 2026-03-17
**Task**: 5.2 Update web generator for mode-aware output
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- `src/resolvers/SemanticValueResolver.ts` (new — Level 1 primitive value resolution)

## Artifacts Modified

- `src/generators/TokenFileGenerator.ts` (modified — `darkSemanticTokens` in options, `light-dark()` output, `color-scheme` declaration)
- `src/generators/generateTokenFiles.ts` (modified — Level 1 value resolution step added)

## Implementation Details

### Level 1 Value Resolution (SemanticValueResolver)

The design outline's two-level resolution flow specifies that generators receive "fully resolved token sets" with concrete values, not primitive reference names. This required a new resolution step between the override resolver (Level 2) and the generators.

`SemanticValueResolver.resolveSemanticTokenValue()` takes a semantic token and mode, resolves `primitiveReferences` to concrete rgba values:
- Simple references: `{ value: 'gray300' }` → `{ value: 'rgba(38, 50, 58, 1)' }`
- Opacity composition: `{ color: 'gray100', opacity: 'opacity048' }` → `{ value: 'rgba(178, 188, 196, 0.48)' }`
- Modifier-based opacity: `{ value: 'black500' }` + modifier `opacity080` → `{ value: 'rgba(0, 0, 0, 0.8)' }`
- Non-color tokens (typography, shadow, spacing): pass through unchanged

Uses `getColorToken()` and `getOpacityToken()` directly (not `PrimitiveTokenRegistry`, which doesn't auto-populate color tokens).

### Pipeline Flow (Updated)

```
Definition → Validation → Registry → Level 2 Override → Level 1 Value Resolution → Generation
                                      (name swaps)       (name → rgba)
```

### Web Generator Changes

- `GenerationOptions.darkSemanticTokens` — optional dark mode resolved tokens
- `generateWebTokens` adds `color-scheme: light dark;` when dark tokens provided
- `generateSemanticSection` accepts optional dark token array, builds name→token lookup
- For each token: formats both light and dark versions, compares CSS values
  - Different values → `light-dark(lightValue, darkValue);`
  - Identical values → single value (mode-invariant optimization, R6 AC4)
- Helper methods `extractCssValue()` and `extractCssPropName()` parse formatted lines

### Current Output (All Values Identical)

Since no primitives have distinct dark values yet (Task 4 deferred), all tokens output single resolved values:
```css
:root {
  color-scheme: light dark;
  --color-text-default: rgba(38, 50, 58, 1);
  --color-structure-border-subtle: rgba(178, 188, 196, 0.48);
  --color-scrim-standard: rgba(0, 0, 0, 0.8);
}
```

When Task 4 populates distinct dark values, `light-dark()` will appear automatically:
```css
  --color-text-default: light-dark(rgba(38, 50, 58, 1), rgba(178, 188, 196, 1));
```

## Validation

### Compilation
- `npx tsc --noEmit` — clean

### Test Results
- 435/435 generator tests pass
- 7827/7831 full suite pass (4 pre-existing demo-system failures)

### End-to-End Verification
- Pipeline produces valid CSS with `color-scheme: light dark`
- All semantic color tokens output resolved rgba values
- Opacity composition tokens correctly composed
- Modifier-based opacity (scrim) correctly composed
- Zero `light-dark()` occurrences (correct — all values currently identical)
- Cross-platform consistency validation passes
- iOS and Android output unchanged

### Requirements Trace
- R6 AC1: Web output uses CSS `light-dark()` function (wired, activates when values differ) ✅
- R6 AC4: Mode-invariant tokens produce single value ✅
