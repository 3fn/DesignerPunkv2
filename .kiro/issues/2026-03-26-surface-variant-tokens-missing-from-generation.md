# Surface Variant Tokens Missing from Token Generation

**Date**: 2026-03-26
**Discovered by**: Ada (Spec 085 Task 2.0 verification)
**Domain**: Ada (token system)
**Severity**: Low
**Status**: Open — Investigation needed
**Related**: `.kiro/specs/085-container-card-base-composition/completion/task-2-0-completion.md`

---

## Issue

The token generation system produces `colorStructureSurface` (singular) but does not produce surface variant tokens: `colorStructureSurfacePrimary`, `colorStructureSurfaceSecondary`, `colorStructureSurfaceTertiary`.

Multiple component native files reference these non-existent generated constants. The code is aspirational — the native files are reference implementations, not compiled artifacts — so there's no runtime failure today. But the gap means:

1. Native platform files reference constants that don't exist in generated output
2. Base's iOS TokenMapping uses placeholder values (`Color.white`, `Color(white: 0.96)`, `Color(white: 0.93)`) instead of generated constants for surface variants
3. Base's Android TokenMapping references `DesignTokens.color_structure_surface_primary/secondary/tertiary` which don't exist in generated output

## Evidence

**Generated output** (`final-verification/DesignTokens.ios.swift`):
```swift
public static let colorStructureSurface = white200  // exists
// colorStructureSurfacePrimary — MISSING
// colorStructureSurfaceSecondary — MISSING
// colorStructureSurfaceTertiary — MISSING
```

**Generated output** (`final-verification/DesignTokens.android.kt`):
```kotlin
val color_structure_surface = white_200  // exists
// color_structure_surface_primary — MISSING
// color_structure_surface_secondary — MISSING
// color_structure_surface_tertiary — MISSING
```

**Generated output** (`final-verification/DesignTokens.web.css`):
```css
--color-surface: var(--white-200);  /* exists */
/* --color-surface-primary — MISSING */
/* --color-surface-secondary — MISSING */
/* --color-surface-tertiary — MISSING */
```

**Components referencing non-existent constants:**
- `Container-Card-Base/platforms/ios/ContainerCardBase.ios.swift` (line 847-849)
- `Container-Card-Base/platforms/android/ContainerCardBase.android.kt` (line 691-693)
- `Container-Base/platforms/ios/TokenMapping.swift` (lines 446-448 — added by Spec 085 Task 2.0, uses placeholders)
- `Container-Base/platforms/android/TokenMapping.kt` (lines 570-572 — added by Spec 085 Task 2.0, references non-existent constants)

## Questions to Investigate

1. **Do surface variants exist in the token source definitions?** Check whether `color.surface.primary`, `color.surface.secondary`, `color.surface.tertiary` are defined in the token source files, or whether they were assumed to exist but never defined.

2. **If they don't exist, should they?** Card's schema defines three surface backgrounds as a curated subset. If the token system only has `color.surface` (singular), what are primary/secondary/tertiary supposed to resolve to?

3. **Web CSS variable resolution.** On web, Card passes `'color.surface.primary'` to Base, which generates `var(--color-surface-primary)`. If that CSS variable isn't defined, the background silently fails. Is this happening in the demos today, or is there a fallback?

4. **Scope of the gap.** Are other components also referencing surface variant tokens that don't exist in generated output?

## Impact

- **Current**: Zero runtime impact. Native files aren't compiled. Web demos may silently fail on surface variant backgrounds (needs investigation).
- **Future**: When native platforms start compiling, these references will be build errors. When the token generation system is extended, surface variants need to be included.

## Recommendation

Investigate questions 1-4 before deciding on a fix. This may be a token definition gap (variants need to be added to the source) or a generation gap (variants exist in source but aren't being generated).
