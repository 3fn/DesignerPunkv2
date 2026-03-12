# Task 1.2 Completion: Update Platform Generators

**Date**: 2026-03-12
**Spec**: 076 - Primary Action Color Migration
**Task**: 1.2 - Update platform generators
**Type**: Implementation
**Status**: Complete

---

## What Changed

### `src/generators/TokenFileGenerator.ts`

1. **Added import**: `getPlatformTokenName` from `../naming/PlatformNamingRules`
2. **Modified `generateSemanticSection()`**: Now tracks tokens with `primitiveReferences.wcagValue` during iteration. Stores collected overrides in `lastWcagOverrides` for the caller to retrieve.
3. **Added `lastWcagOverrides` property**: Stores pending WCAG overrides between `generateSemanticSection()` and the platform-specific generate method.
4. **Added `generateWcagOverrides()` method**: Generates platform-specific WCAG theme override blocks:
   - Web: `[data-theme="wcag"] { --semantic: var(--wcag-primitive); }` block after `:root`
   - iOS: `_wcag` suffixed static lets inside the struct
   - Android: `_wcag` suffixed vals inside the object
5. **Modified `generateWebTokens()`**: Appends WCAG override block after `:root` footer
6. **Modified `generateiOSTokens()`**: Inserts WCAG overrides before struct footer
7. **Modified `generateAndroidTokens()`**: Inserts WCAG overrides before object footer

### Architecture Decision

The WCAG override block is generated as a separate CSS selector (`[data-theme="wcag"]`) rather than modifying the existing `:root` output. This is because:

1. Semantic tokens output `var(--primitive-name)` references, not resolved values
2. The `wcagValue` mechanism changes which primitive is referenced, not the primitive's value
3. CSS cascade handles the override: `[data-theme="wcag"]` has higher specificity than `:root`
4. Backward compatible: when no tokens have `wcagValue`, no WCAG block is generated

### No Changes to Format Generators

`WebFormatGenerator`, `iOSFormatGenerator`, and `AndroidFormatGenerator` were NOT modified. The `formatSingleReferenceToken()` method continues to use `primitiveReferences.value` for the standard theme output. The WCAG override is handled at the orchestration level (`TokenFileGenerator`), not the formatting level.

## Validation

- TypeScript compilation: clean (`npx tsc --noEmit` — exit 0)
- Generator tests: 280 suites pass
- Full test suite: 289 suites pass, 7437+ tests pass
- Backward compatibility: no WCAG blocks generated when no tokens have `wcagValue` (verified by all existing generation tests passing unchanged)
- 1 pre-existing failure (`mcp-component-integration.test.ts`) unrelated to this change

## Requirements Covered

- 1.3: WCAG theme uses `wcagValue` primitive when present ✅
- 1.4: Web generator outputs correct primitive per theme context ✅
- 1.5: iOS generator outputs correct primitive per theme context ✅
- 1.6: Android generator outputs correct primitive per theme context ✅
