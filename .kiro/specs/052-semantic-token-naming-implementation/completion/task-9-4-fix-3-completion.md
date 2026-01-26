# Task 9.4.FIX.3 Completion: Update Generators to Resolve Opacity Composition to RGBA Output

**Date**: January 25, 2026
**Task**: 9.4.FIX.3 Update generators to resolve opacity composition to RGBA output
**Status**: Complete
**Organization**: spec-completion
**Scope**: 052-semantic-token-naming-implementation

---

## Summary

Updated all three platform generators (Web, iOS, Android) to detect and resolve opacity composition references (`{ color: 'gray100', opacity: 'opacity600' }`) to platform-specific RGBA output. Also updated the TokenFileGenerator to recognize opacity composition as a valid single-reference token pattern.

---

## Changes Made

### 1. WebFormatGenerator.ts

**Imports Added:**
- `getColorToken` from `../tokens/ColorTokens`
- `getOpacityToken` from `../tokens/OpacityTokens`

**Methods Updated:**
- `formatSingleReferenceToken()`: Added detection for opacity composition pattern (has `color` and `opacity` keys)
- Added new private method `formatOpacityCompositionToken()` that:
  - Resolves color primitive to get RGB values
  - Resolves opacity primitive to get alpha value
  - Outputs: `rgba(r, g, b, alpha)`

### 2. iOSFormatGenerator.ts

**Imports Added:**
- `getColorToken` from `../tokens/ColorTokens`
- `getOpacityToken` from `../tokens/OpacityTokens`

**Methods Updated:**
- `formatSingleReferenceToken()`: Added detection for opacity composition pattern
- Added new private method `formatOpacityCompositionToken()` that:
  - Resolves color primitive to get RGB values
  - Resolves opacity primitive to get alpha value
  - Outputs: `UIColor(red: r/255, green: g/255, blue: b/255, alpha: alpha)`

### 3. AndroidFormatGenerator.ts

**Imports Added:**
- `getColorToken` from `../tokens/ColorTokens`
- `getOpacityToken` from `../tokens/OpacityTokens`

**Methods Updated:**
- `formatSingleReferenceToken()`: Added detection for opacity composition pattern
- Added new private method `formatOpacityCompositionToken()` that:
  - Resolves color primitive to get RGB values
  - Resolves opacity primitive to get alpha value
  - Kotlin output: `Color.argb(alpha*255, r, g, b)`
  - XML output: `#AARRGGBB` hex format

### 4. TokenFileGenerator.ts

**Logic Updated:**
- Updated single-reference detection to recognize opacity composition pattern
- Added `isOpacityComposition` check: `refs.includes('color') && refs.includes('opacity') && refs.length === 2`
- Opacity composition tokens are now correctly routed to `formatSingleReferenceToken()`

---

## Test Coverage

Added comprehensive tests in `src/providers/__tests__/PlatformOutputFormat.test.ts`:

### New Test Suite: "Opacity Composition Resolution"

**Web Platform Tests:**
- `should resolve opacity composition to rgba format`
- `should produce correct CSS output format`

**iOS Platform Tests:**
- `should resolve opacity composition to UIColor format`
- `should produce correct Swift output format`

**Android Platform Tests:**
- `should resolve opacity composition to Color.argb format`
- `should produce correct Kotlin output format`
- `should produce correct XML output format`

**Cross-Platform Tests:**
- `all platforms should resolve same opacity composition to equivalent values`

---

## Validation

### Test Results
```
npm test -- --testNamePattern="Opacity Composition" --no-coverage

Test Suites: 4 passed
Tests: 30 passed
```

### Platform Output Examples

For `color.structure.border.subtle` with `{ color: 'gray100', opacity: 'opacity600' }`:

| Platform | Output |
|----------|--------|
| Web | `--color-structure-border-subtle: rgba(184, 182, 200, 0.48);` |
| iOS | `public static let colorStructureBorderSubtle: UIColor = UIColor(red: 0.72, green: 0.71, blue: 0.78, alpha: 0.48)` |
| Android (Kotlin) | `val color_structure_border_subtle = Color.argb(122, 184, 182, 200)` |
| Android (XML) | `<color name="color_structure_border_subtle">#7AB8B6C8</color>` |

---

## Requirements Validated

- **Requirement 1.3**: Platform generators produce correct RGBA output
- **Requirement 5.4**: RGBA format implemented with correct platform-specific output

---

## Files Modified

1. `src/providers/WebFormatGenerator.ts`
2. `src/providers/iOSFormatGenerator.ts`
3. `src/providers/AndroidFormatGenerator.ts`
4. `src/generators/TokenFileGenerator.ts`
5. `src/providers/__tests__/PlatformOutputFormat.test.ts`
