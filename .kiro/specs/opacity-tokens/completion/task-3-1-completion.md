# Task 3.1 Completion: Implement Web Opacity Generator

**Date**: October 28, 2025
**Task**: 3.1 Implement web opacity generator
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- `src/providers/WebFormatGenerator.ts` - Added three opacity generation methods
- `src/providers/__tests__/WebFormatGenerator-semantic.test.ts` - Added comprehensive tests for opacity methods

## Implementation Details

### Approach

Added three new methods to the existing `WebFormatGenerator` class to support opacity token generation for web platforms. The methods follow the established patterns in the class and integrate seamlessly with the existing web generator infrastructure.

### Methods Implemented

**1. generateOpacityProperty(opacityValue: number): string**
- Generates CSS opacity property format: `opacity: 0.48;`
- Takes unitless opacity value (0.0 - 1.0)
- Returns formatted CSS property string

**2. generateRgbaAlpha(r: number, g: number, b: number, alpha: number): string**
- Generates RGBA color with alpha channel: `rgba(107, 80, 164, 0.48)`
- Takes RGB values (0-255) and alpha value (0.0 - 1.0)
- Returns formatted RGBA string for use in CSS

**3. generateCustomProperty(tokenName: string, opacityValue: number): string**
- Generates CSS custom property: `--opacity600: 0.48;`
- Takes token name and opacity value
- Handles `--` prefix automatically (adds if missing, doesn't duplicate if present)
- Returns formatted CSS custom property declaration

### Key Decisions

**Decision 1**: Method placement in WebFormatGenerator class
- **Rationale**: These methods are web-specific and belong with other web formatting logic
- **Alternative**: Could have created a separate OpacityGenerator class, but that would add unnecessary complexity for three simple methods
- **Trade-off**: Keeps the class focused on web formatting while adding opacity-specific functionality

**Decision 2**: Simple method signatures with direct parameters
- **Rationale**: Methods are straightforward formatters that don't need complex token objects
- **Alternative**: Could have passed full token objects, but that would couple the methods too tightly to token structure
- **Trade-off**: More flexible methods that can be used with any opacity values, not just token objects

**Decision 3**: Automatic `--` prefix handling in generateCustomProperty
- **Rationale**: Prevents errors from duplicate prefixes and makes the method more forgiving
- **Alternative**: Could have required exact format from caller, but that's error-prone
- **Trade-off**: Slightly more complex logic, but much better developer experience

### Integration Points

The methods integrate with:
- **Opacity tokens** (`src/tokens/OpacityTokens.ts`) - Use opacity token values as input
- **Existing web generator infrastructure** - Follow same patterns as other formatting methods
- **CSS generation workflow** - Can be used in token file generation for web platform

### Usage Examples

```typescript
const generator = new WebFormatGenerator('css');

// CSS opacity property
generator.generateOpacityProperty(0.48);
// Output: "opacity: 0.48;"

// RGBA with alpha channel
generator.generateRgbaAlpha(107, 80, 164, 0.48);
// Output: "rgba(107, 80, 164, 0.48)"

// CSS custom property
generator.generateCustomProperty('opacity600', 0.48);
// Output: "--opacity600: 0.48;"

// Button state example
const purple = { r: 107, g: 80, b: 164 };
generator.generateRgbaAlpha(purple.r, purple.g, purple.b, 1.0);    // Default
generator.generateRgbaAlpha(purple.r, purple.g, purple.b, 0.8);    // Hover
generator.generateRgbaAlpha(purple.r, purple.g, purple.b, 0.72);   // Pressed
generator.generateRgbaAlpha(purple.r, purple.g, purple.b, 0.48);   // Disabled
```

## Validation (Tier 2: Standard)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors
✅ All imports resolve correctly
✅ Type annotations correct

### Functional Validation
✅ `generateOpacityProperty()` produces correct CSS format: `opacity: 0.48;`
✅ `generateRgbaAlpha()` produces correct RGBA format: `rgba(r, g, b, 0.48)`
✅ `generateCustomProperty()` produces correct CSS custom property: `--opacity600: 0.48;`
✅ All methods handle edge cases (0, 1, decimal values)
✅ Methods work with opacity token values

### Integration Validation
✅ Methods integrated into existing WebFormatGenerator class
✅ Methods follow existing code patterns and conventions
✅ No conflicts with existing methods
✅ Methods can be used with opacity tokens seamlessly

### Requirements Compliance
✅ Requirement 7: Unified Token Generator Integration
  - Web opacity generation methods implemented
  - CSS opacity property format supported (`opacity: 0.48;`)
  - RGBA alpha channel format supported (`rgba(r, g, b, 0.48)`)
  - CSS custom property format supported (`--opacity600: 0.48;`)
  - Unitless values (0.0 - 1.0) translate directly to CSS

## Test Coverage

Created comprehensive tests covering:
- CSS opacity property generation with various values (0, 1, decimals)
- RGBA alpha channel generation with various RGB and alpha combinations
- CSS custom property generation with and without `--` prefix
- Edge cases for all three methods

All 24 tests pass successfully.

## Requirements Compliance

**Requirement 7**: Unified Token Generator Integration
- ✅ Web generator translates opacity tokens to CSS opacity property format
- ✅ Web generator translates opacity tokens to RGBA alpha channel format
- ✅ Web generator translates opacity tokens to CSS custom property format
- ✅ Unitless values translate directly to platform alpha values (0.48 → 0.48)
- ✅ Integration with existing web generator infrastructure complete

---

**Organization**: spec-completion
**Scope**: opacity-tokens
