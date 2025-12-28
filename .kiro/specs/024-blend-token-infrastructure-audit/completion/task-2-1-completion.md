# Task 2.1 Completion: Document Generator Patterns

**Date**: December 28, 2025
**Task**: 2.1 Document generator patterns
**Type**: Implementation
**Validation**: Tier 2 - Standard
**Status**: Complete

---

## Task Requirements

- [x] Review `src/generators/` directory structure
- [x] Document how unified generator works (or if it exists)
- [x] Document platform-specific generation patterns
- [x] Identify extension points for new token types
- [x] **KEY: Note how other token families (opacity, color) integrate and whether their output appears in build artifacts**
- [x] **KEY: Determine if blend generators' output is in build pipeline or orphaned**

---

## Findings Summary

### Unified Generator: TokenFileGenerator

The unified generator exists as `TokenFileGenerator` in `src/generators/TokenFileGenerator.ts`. It orchestrates:
- Platform-specific token file generation (web, iOS, Android)
- Primitive and semantic token coordination
- Cross-platform consistency validation
- Special token handling (icons, motion, layering)

### Platform-Specific Generation Patterns

| Platform | Generator | Output |
|----------|-----------|--------|
| Web | WebFormatGenerator | CSS custom properties |
| iOS | iOSFormatGenerator | Swift constants |
| Android | AndroidFormatGenerator | Kotlin constants |

All generators implement the `FormatProvider` interface from `src/providers/FormatProvider.ts`.

### Extension Points Identified

1. **New Primitive Token Family**: Add to `src/tokens/`, export from index, add to `getAllPrimitiveTokens()`
2. **New Semantic Token Family**: Add to `src/tokens/semantic/`, export from index, add to `getAllSemanticTokens()`
3. **Special Token Handling**: Create specialized method in TokenFileGenerator
4. **Runtime Utilities**: No established pattern (this is the gap)

### KEY Finding: Other Token Families Integration

| Token Family | Primitives in Output | Semantics in Output | Runtime Utilities |
|--------------|---------------------|---------------------|-------------------|
| Opacity | ✅ Yes | ✅ Yes | ❌ None needed |
| Color | ✅ Yes | ✅ Yes | ❌ None in output |
| Shadow | ✅ Yes | ✅ Yes | ❌ None needed |
| Blend | ✅ Yes | ✅ Yes | ❌ **Exist but orphaned** |

**Key insight**: Other token families (opacity, color, shadow) don't require runtime utilities because:
- Opacity is a simple multiplier applied directly
- Colors are referenced directly
- Shadows are composed from primitives at definition time

Blend tokens are unique in requiring **runtime color calculation**.

### KEY Finding: Blend Generators Status

| Generator | Exists | In Build Pipeline | In Build Output |
|-----------|--------|-------------------|-----------------|
| BlendValueGenerator | ✅ Yes | ❌ No | ❌ No |
| BlendUtilityGenerator | ✅ Yes | ❌ No | ❌ No |

**Both blend generators are ORPHANED** - they exist and produce valid platform code, but are never called by TokenFileGenerator.

However, the **blend calculation infrastructure** (BlendCalculator, ColorSpaceUtils) IS in the dist output at `dist/blend/`, but only as TypeScript/JavaScript modules, not as platform-native code.

---

## Artifacts Created

- `findings/generator-patterns.md` - Comprehensive generator patterns documentation

---

## Key Insights for Phase 2

1. **The gap is narrower than expected**: Blend tokens (primitive and semantic) ARE in the build output
2. **The gap is in runtime utilities**: The generators exist but aren't integrated
3. **No precedent for runtime utilities**: Other token families don't need them, so no pattern exists
4. **Platform-native code exists**: BlendUtilityGenerator produces Swift/Kotlin code that could be integrated

---

## Next Steps

Task 2.2 will document token output patterns to understand:
- How runtime utilities could be added to generated files
- What the component consumption pattern should look like
- Whether the gap is unique to blends or systemic

---

*Task 2.1 complete. Proceeding to Task 2.2.*
