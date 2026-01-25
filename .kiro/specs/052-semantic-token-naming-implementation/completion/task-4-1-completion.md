# Task 4.1 Completion: Update Rosetta Generators for RGBA Output

**Date**: January 25, 2026
**Spec**: 052 - Semantic Token Naming Implementation
**Task**: 4.1 Update Rosetta generators for RGBA output
**Status**: Complete
**Organization**: spec-completion
**Scope**: 052-semantic-token-naming-implementation

---

## Summary

Updated all three platform format generators (Web, iOS, Android) to properly handle RGBA color output. The generators now:

1. Parse RGBA strings from primitive color tokens
2. Output platform-appropriate color formats
3. Handle baked-in alpha values (e.g., `color.structure.border.subtle`)

---

## Changes Made

### WebFormatGenerator.ts

**New/Updated Methods:**
- `formatCSSValue()` - Updated to handle RGBA strings and mode-aware color objects
- `parseRgbaString()` - New method to parse RGBA strings into component values
- `formatColorValue()` - New method to format color values for CSS output
- `formatSingleReferenceToken()` - Updated to handle baked-in RGBA values directly

**Output Format:**
```css
--color-feedback-success-text: rgba(74, 222, 128, 1);
--color-structure-border-subtle: rgba(184, 182, 200, 0.48);
```

### iOSFormatGenerator.ts

**New/Updated Methods:**
- `formatSwiftValue()` - Updated to detect and convert RGBA strings
- `parseRgbaString()` - New method to parse RGBA strings into component values
- `rgbaStringToUIColor()` - New method to convert RGBA to UIColor format
- `formatUIColor()` - New method to format mode-aware color objects
- `formatSingleReferenceToken()` - Updated to handle baked-in RGBA values

**Output Format:**
```swift
public static let colorFeedbackSuccessText: UIColor = UIColor(red: 0.29, green: 0.87, blue: 0.50, alpha: 1.00)
public static let colorStructureBorderSubtle: UIColor = UIColor(red: 0.72, green: 0.71, blue: 0.78, alpha: 0.48)
```

### AndroidFormatGenerator.ts

**New/Updated Methods:**
- `formatKotlinValue()` - Updated to detect and convert RGBA strings
- `parseRgbaString()` - New method to parse RGBA strings into component values
- `rgbaStringToColorArgb()` - New method to convert RGBA to Color.argb format
- `formatKotlinColor()` - Updated to handle mode-aware color objects
- `formatSingleReferenceToken()` - Updated to handle baked-in RGBA values (Kotlin and XML)

**Output Format (Kotlin):**
```kotlin
val colorFeedbackSuccessText = Color.argb(255, 74, 222, 128)
val colorStructureBorderSubtle = Color.argb(122, 184, 182, 200)
```

**Output Format (XML):**
```xml
<color name="color_structure_border_subtle">#7AB8B6C8</color>
```

---

## Baked-In Alpha Value Handling

The generators now properly handle semantic tokens with baked-in RGBA values (like `color.structure.border.subtle`). When the primitive reference is an RGBA string rather than a token name:

- **Web**: Outputs the RGBA value directly
- **iOS**: Converts to UIColor with explicit type annotation
- **Android (Kotlin)**: Converts to Color.argb format
- **Android (XML)**: Converts to #AARRGGBB hex format

---

## Test Results

All existing tests pass:
- FormatProviders.test.ts: 53 tests passed
- OpacityPlatformTranslation.test.ts: 24 tests passed
- iOSFormatGenerator-semantic.test.ts: All tests passed
- WebFormatGenerator-semantic.test.ts: All tests passed
- AndroidFormatGenerator-semantic.test.ts: All tests passed
- InsetTokenGeneration.test.ts: All tests passed

**Total: 191 tests passed**

---

## Requirements Validated

- ✅ **Requirement 1.3**: Web output uses `rgba(r, g, b, a)` CSS format
- ✅ **Requirement 1.4**: iOS output uses `UIColor(red: r/255, green: g/255, blue: b/255, alpha: a)` format
- ✅ **Requirement 1.4**: Android output uses `Color.argb(a*255, r, g, b)` format
- ✅ **Requirement 5.4**: Generators handle baked-in alpha values correctly

---

## Files Modified

1. `src/providers/WebFormatGenerator.ts`
2. `src/providers/iOSFormatGenerator.ts`
3. `src/providers/AndroidFormatGenerator.ts`

---

## Next Steps

Task 4.2 (Run platform token generation) can now proceed to verify the generated output files contain the correct RGBA formats.
