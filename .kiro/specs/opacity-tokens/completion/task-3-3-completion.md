# Task 3.3 Completion: Implement Android Opacity Generator

**Date**: October 28, 2025
**Task**: 3.3 Implement Android opacity generator
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- `src/providers/AndroidFormatGenerator.ts` - Added three opacity generation methods and helper function
- `src/providers/__tests__/AndroidFormatGenerator-semantic.test.ts` - Added comprehensive test suite for opacity methods

## Implementation Details

### Approach

Implemented three Android-specific opacity generation methods in the `AndroidFormatGenerator` class following the established pattern from the web (Task 3.1) and iOS (Task 3.2) opacity generators. Each method generates platform-appropriate Kotlin/Jetpack Compose syntax for opacity usage.

The implementation integrates seamlessly with the existing Android generator infrastructure, using the same code organization and naming conventions as other Android generation methods.

### Key Methods Implemented

**1. generateAlphaModifier(opacityValue: number): string**
- Generates Jetpack Compose alpha modifier syntax: `Modifier.alpha(0.48f)`
- Used for applying opacity to Jetpack Compose modifiers
- Takes unitless opacity value (0.0 - 1.0)
- Returns Jetpack Compose modifier string with proper float formatting

**2. generateColorWithAlpha(colorHex: string, alpha: number): string**
- Generates Jetpack Compose Color.copy with alpha parameter
- Outputs: `Color(0xFF6B50A4).copy(alpha = 0.48f)`
- Takes hex color value (e.g., 0xFF6B50A4) and alpha value (0.0 - 1.0)
- Used for creating colors with specific opacity values

**3. generateConstant(tokenName: string, opacityValue: number): string**
- Generates Kotlin constant declaration: `const val OPACITY_600 = 0.48f`
- Used for defining opacity token constants in the DesignTokens object
- Takes token name and unitless opacity value
- Converts token names to UPPER_SNAKE_CASE (opacity600 → OPACITY_600)
- Returns Kotlin constant declaration string

**4. formatFloatValue(value: number): string (private helper)**
- Formats float values to preserve decimal places
- Ensures 1.0 stays as "1.0" instead of "1"
- Ensures 0.0 stays as "0.0" instead of "0"
- Used by all three opacity generation methods for consistent formatting

### Key Decisions

**Decision 1**: Token name conversion to UPPER_SNAKE_CASE
- **Rationale**: Kotlin constants follow UPPER_SNAKE_CASE naming convention, and we need to add underscores between letters and numbers (opacity600 → OPACITY_600)
- **Alternative**: Could have kept camelCase, but that violates Kotlin naming conventions
- **Trade-off**: More complex regex logic, but produces idiomatic Kotlin code

**Decision 2**: Float value formatting with decimal preservation
- **Rationale**: Kotlin requires explicit float literals with 'f' suffix, and preserving decimal places (1.0f instead of 1f) improves code readability
- **Alternative**: Could have used JavaScript's default number-to-string conversion, but that drops decimal places for whole numbers
- **Trade-off**: Slightly more complex formatting logic, but produces more readable Kotlin code

**Decision 3**: Separate helper method for float formatting
- **Rationale**: All three methods need the same float formatting logic, so extracting it to a helper method reduces duplication
- **Alternative**: Could have duplicated the formatting logic in each method, but that violates DRY principle
- **Trade-off**: One additional method, but cleaner and more maintainable code

### Integration Points

The methods integrate with the existing Android generator infrastructure:
- Follow the same naming conventions as other Android methods
- Use consistent Kotlin syntax patterns
- Compatible with the DesignTokens object organization
- Support both primitive and semantic opacity tokens

### Usage Examples

```kotlin
// Alpha modifier for Jetpack Compose
Button(
  modifier = Modifier.alpha(0.48f) // opacityDisabled
) {
  Text("Disabled Button")
}

// Color with alpha
val disabledColor = Color(0xFF6B50A4).copy(alpha = 0.48f)

// Opacity constants in DesignTokens object
object DesignTokens {
  const val OPACITY_600 = 0.48f
  const val OPACITY_DISABLED = 0.48f
  const val OPACITY_OVERLAY = 0.32f
}

// Button state example
val purple = 0xFF6B50A4
val defaultColor = Color(purple).copy(alpha = 1.0f)    // Default
val hoverColor = Color(purple).copy(alpha = 0.8f)      // Hover
val pressedColor = Color(purple).copy(alpha = 0.72f)   // Pressed
val disabledColor = Color(purple).copy(alpha = 0.48f)  // Disabled
```

## Validation (Tier 2: Standard)

### Syntax Validation
✅ getDiagnostics passed - no syntax errors
✅ All imports resolve correctly
✅ Type annotations correct

### Functional Validation
✅ `generateAlphaModifier()` produces correct Jetpack Compose syntax: `Modifier.alpha(0.48f)`
✅ `generateColorWithAlpha()` produces correct Color.copy syntax: `Color(0xFF6B50A4).copy(alpha = 0.48f)`
✅ `generateConstant()` produces correct Kotlin constant syntax: `const val OPACITY_600 = 0.48f`
✅ All methods handle edge cases (0.0, 1.0, decimal values)
✅ Float formatting preserves decimal places (1.0f instead of 1f)
✅ Token name conversion to UPPER_SNAKE_CASE works correctly

### Integration Validation
✅ Methods integrated into existing AndroidFormatGenerator class
✅ Methods follow existing code patterns and conventions
✅ No conflicts with existing methods
✅ Methods can be used with opacity tokens seamlessly
✅ Compatible with DesignTokens object organization

### Requirements Compliance
✅ Requirement 7: Unified Token Generator Integration
  - Android generator translates opacity tokens to Jetpack Compose alpha modifier format
  - Android generator translates opacity tokens to Color.copy with alpha parameter format
  - Android generator translates opacity tokens to Kotlin constant format
  - Unitless values (0.0 - 1.0) translate directly to Android alpha values
  - Integration with existing Android generator infrastructure complete

## Test Coverage

Created comprehensive test suite with 13 tests covering:

**generateAlphaModifier tests (4 tests)**:
- Correct Jetpack Compose alpha modifier syntax generation
- Full opacity (1.0) handling with decimal preservation
- Full transparency (0.0) handling with decimal preservation
- Various opacity values (0.08, 0.16, 0.32, 0.64, 0.88)

**generateColorWithAlpha tests (4 tests)**:
- Jetpack Compose Color.copy with alpha parameter syntax
- Full opacity color handling with decimal preservation
- Fully transparent color handling with decimal preservation
- Various color hex and alpha combinations

**generateConstant tests (5 tests)**:
- Kotlin constant syntax generation with UPPER_SNAKE_CASE
- Full opacity constant handling with decimal preservation
- Full transparency constant handling with decimal preservation
- Various primitive opacity token constants (opacity100, opacity200, etc.)
- Semantic opacity token constants (opacityDisabled, opacityPressed, etc.)

All 34 tests (13 new opacity tests + 21 existing semantic token tests) pass successfully.

## Implementation Notes

### Platform-Specific Considerations

**Jetpack Compose Alpha Modifier**:
- `Modifier.alpha()` applies to entire composable hierarchy
- Values outside 0.0-1.0 are clamped by Jetpack Compose
- Alpha is composable (multiple modifiers multiply)
- Requires 'f' suffix for float literals in Kotlin

**Jetpack Compose Color Alpha**:
- `Color(...).copy(alpha = ...)` creates color with specific opacity
- Color hex values use 0xFF prefix for ARGB format
- Alpha parameter is separate from RGB channels
- Requires 'f' suffix for float literals

**Kotlin Constants**:
- `const val` provides compile-time constants
- UPPER_SNAKE_CASE is the Kotlin naming convention for constants
- Float literals require 'f' suffix
- Constants are optimized by Kotlin compiler

### Float Formatting Strategy

The `formatFloatValue()` helper method ensures consistent float formatting:
- Whole numbers (0, 1) are formatted with decimal places (0.0, 1.0)
- Decimal numbers are formatted as-is (0.48, 0.16, etc.)
- All values get 'f' suffix when used in Kotlin code
- This improves code readability and follows Kotlin best practices

### Token Name Conversion

The `generateConstant()` method converts token names to UPPER_SNAKE_CASE:
- Handles camelCase: `opacityDisabled` → `OPACITY_DISABLED`
- Handles numbers: `opacity600` → `OPACITY_600`
- Handles kebab-case: `opacity-disabled` → `OPACITY_DISABLED`
- Uses regex patterns for reliable conversion

## Next Steps

This completes the Android opacity generator implementation. The next task (3.4) will create integration tests for platform translation to verify that all three platforms (web, iOS, Android) generate correct opacity values.

---

**Organization**: spec-completion
**Scope**: opacity-tokens
