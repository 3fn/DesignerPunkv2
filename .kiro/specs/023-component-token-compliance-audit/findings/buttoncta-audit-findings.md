# ButtonCTA Audit Findings

**Date**: December 17, 2025
**Component**: ButtonCTA
**Platforms**: Web, iOS, Android
**Auditor**: AI Agent
**Status**: Complete (All platform audits complete)

---

## Executive Summary

The ButtonCTA component demonstrates strong token compliance overall, with Android and Web platforms showing excellent token usage. The iOS implementation has significant token compliance issues, primarily using hard-coded values with comments referencing tokens instead of actually importing and using the tokens.

**Key Findings**:
- **Holistic Issues**: 3 cross-platform consistency issues identified
- **iOS Issues**: 10 token compliance issues (local constants, hard-coded values, missing imports)
- **Android Issues**: 3 minor token usage pattern inconsistencies (excellent overall compliance)
- **Web Issues**: 9 findings (2 positive findings, 7 issues including hard-coded border widths and edge case values)
- **Intentional Differences**: 3 platform-specific patterns documented

**iOS Critical Issues**:
- Local token constants with hard-coded RGB values instead of imports (Issue I1)
- Hard-coded typography, spacing, and radius values despite tokens existing (Issues I6-I8)
- Motion token referenced but not imported, likely causing compilation failure (Issue I4)
- Using primitive tokens instead of semantic tokens with misleading comments (Issues I2-I3)

**Android Strengths**:
- Excellent token compliance with proper DesignTokens imports
- Correct Rosetta pattern usage (snake_case naming, no local constants)
- Proper semantic token usage for colors, spacing, radius, and borders
- Only minor issues: hard-coded minWidth (matches iOS), typography token pattern, icon size type conversion

**Web Strengths**:
- Strong token compliance with comprehensive CSS custom property usage in primary styling
- Comprehensive token coverage (typography, spacing, radius, color, motion, accessibility, opacity)
- Excellent documentation comments explaining token usage and design decisions
- Accessibility excellence (WCAG 2.1 AA compliant with focus indicators, high contrast, reduced motion)

**Web Issues**:
- Hard-coded border widths (secondary button, print styles, high contrast mode)
- Hard-coded color in print styles (#000)
- Hard-coded minWidth/minHeight (consistent with other platforms)
- Optical balance CSS filter approximation, disabled opacity not tokenized

---

## Holistic Issues (Spec Level)

Issues affecting the component design across all platforms.

### Issue H1: Inconsistent Motion Token Usage

**Affects**: iOS platform only (but represents spec-level gap)
**Classification**: Spec

**Description**: 
The iOS implementation uses hard-coded motion values for the button press animation:
- Scale: `0.97` (hard-coded)
- Animation: `.animation(.easeOut(duration: 0.1), value: isPressed)` (hard-coded duration and easing)

The design document specifies using `motion.buttonPress` token (duration150 + easingAccelerate), but the implementation uses hard-coded values with different easing (`easeOut` vs `easingAccelerate`).

**Current Implementation** (iOS):
```swift
.scaleEffect(isPressed ? 0.97 : 1.0)
.animation(.easeOut(duration: 0.1), value: isPressed)
```

**Expected Implementation**:
```swift
.scaleEffect(isPressed ? 0.97 : 1.0)
.animation(motionButtonPress, value: isPressed)
```

**Recommendation**: 
1. Verify if `motionButtonPress` token exists in iOS token generation
2. If token exists, update iOS implementation to use it
3. If token doesn't exist, create motion token for button press animation
4. Document whether scale value (0.97) should also be tokenized

**Impact**: Medium - Affects animation consistency and maintainability

---

### Issue H2: Missing Height Strategy Documentation

**Affects**: All platforms
**Classification**: Spec

**Description**:
The component spec and README don't clearly document the height calculation strategy. The design document mentions "height" values (40px, 48px, 56px) but the actual implementation uses padding + content height, not fixed heights.

**Current Behavior**:
- Small: `verticalPadding (8px) * 2 + lineHeight (24px) = 40px`
- Medium: `verticalPadding (12px) * 2 + lineHeight (24px) = 48px`
- Large: `verticalPadding (12px) * 2 + lineHeight (28px) = 52px` ⚠️

**Issue**: Large button calculates to 52px, not 56px as documented.

**Recommendation**:
1. Clarify whether buttons should use fixed heights or calculated heights (padding + content)
2. If calculated heights, update documentation to reflect actual calculated values
3. If fixed heights, add `minHeight` tokens and update implementations
4. Document the height strategy in README "Token Consumption" section

**Impact**: Low - Visual appearance is correct, but documentation is misleading

---

### Issue H3: Inconsistent minWidth Token Approach

**Affects**: All platforms
**Classification**: Spec

**Description**:
The component uses hard-coded `minWidth` values (56, 72, 80) instead of tokens. The design document acknowledges this but doesn't provide clear guidance on whether these should be tokenized.

**Current Implementation**:
- Small: `minWidth: 56` (hard-coded)
- Medium: `minWidth: 72` (hard-coded)
- Large: `minWidth: 80` (hard-coded)

**Recommendation**:
1. Evaluate whether `minWidth` values should be component-specific tokens
2. If yes, create `button.minWidth.small/medium/large` tokens
3. If no, document rationale for hard-coded values in design document
4. Consider if these values follow mathematical relationships that could be tokenized

**Impact**: Low - Values are consistent across platforms, but not tokenized

---

## iOS Implementation Issues

### Issue I1: Local Token Constants Instead of DesignTokens Imports

**Location**: ButtonCTA.ios.swift:308-320
**Classification**: Implementation

**Current**:
```swift
// MARK: - Design Token Constants

// Color tokens - Semantic tokens from DesignTokens.ios.swift
private let colorPrimary = Color(red: 103/255, green: 80/255, blue: 164/255) // purple300 - #6750A4
private let colorBackground = Color(red: 255/255, green: 255/255, blue: 255/255) // white100 - #FFFFFF
private let white100 = Color(red: 255/255, green: 255/255, blue: 255/255) // white100 - #FFFFFF (primitive token for text on primary)

// Accessibility tokens - Tap area tokens from TapAreaTokens.ts
private let tapAreaMinimum: CGFloat = 44 // tapAreaMinimum - WCAG 2.1 AA minimum (44pt)
private let tapAreaRecommended: CGFloat = 48 // tapAreaRecommended - Enhanced usability (48pt)
private let tapAreaComfortable: CGFloat = 56 // tapAreaComfortable - Comfortable interaction (56pt)
```

**Expected**:
```swift
// Import tokens from DesignTokens.ios.swift
import DesignTokens

// Use tokens directly:
// DesignTokens.colorPrimary
// DesignTokens.colorBackground
// DesignTokens.colorTextOnPrimary
// DesignTokens.tapAreaMinimum
// DesignTokens.tapAreaRecommended
// DesignTokens.tapAreaComfortable
```

**Description**:
The iOS implementation defines local token constants with hard-coded RGB values instead of importing and using tokens from `DesignTokens.ios.swift`. This creates a maintenance burden and risks drift from the source of truth.

**Verification**:
Confirmed that `DesignTokens.ios.swift` contains all required tokens:
- ✅ `colorPrimary` exists (line 469)
- ✅ `colorBackground` exists (line 475)
- ✅ `colorTextOnPrimary` exists (line 473)
- ✅ `tapAreaMinimum` exists (tap area tokens section)
- ✅ `tapAreaRecommended` exists (tap area tokens section)
- ✅ `tapAreaComfortable` exists (tap area tokens section)

**Recommendation**: 
1. Remove local token constant definitions (lines 308-320)
2. Import `DesignTokens` module at top of file
3. Update all token references to use `DesignTokens.tokenName` pattern
4. Verify compilation succeeds with imported tokens

**Impact**: High - Local constants create maintenance burden and risk token drift

---

### Issue I2: Using Primitive Token Instead of Semantic colorTextOnPrimary

**Location**: ButtonCTA.ios.swift:247-250, 279-281
**Classification**: Implementation

**Current**:
```swift
// Line 247-250: Text color
private var textColor: Color {
    switch style {
    case .primary:
        return white100 // Primitive token: white100 (no semantic colorTextOnPrimary exists)

// Line 279-281: Icon color
case .primary:
    // Primary style: Use white100 (no semantic colorTextOnPrimary exists)
    return white100 // Primitive token: white100
```

**Expected**:
```swift
// Text color
case .primary:
    return DesignTokens.colorTextOnPrimary // Semantic token

// Icon color
case .primary:
    return DesignTokens.colorTextOnPrimary // Semantic token (icons use same color as text on primary)
```

**Description**:
The iOS implementation uses `white100` primitive token with a comment claiming "no semantic colorTextOnPrimary exists". However, verification of `DesignTokens.ios.swift` confirms that `colorTextOnPrimary` DOES exist (line 473).

**Verification**:
```swift
// From dist/ios/DesignTokens.ios.swift:473
public static let colorTextOnPrimary = white100
```

The semantic token exists and is properly generated for iOS. The implementation should use it instead of the primitive token.

**Recommendation**: 
1. Replace `white100` with `DesignTokens.colorTextOnPrimary` in text color (line 249)
2. Replace `white100` with `DesignTokens.colorTextOnPrimary` in icon color (line 281)
3. Remove misleading comments about token not existing
4. Update comments to reference semantic token usage

**Impact**: Medium - Reduces semantic meaning and makes color changes harder

---

### Issue I3: Missing colorIconOpticalBalance Token Usage

**Location**: ButtonCTA.ios.swift:282-286
**Classification**: Implementation

**Current**:
```swift
case .secondary, .tertiary:
    // Secondary/Tertiary: Use color.primary
    // TODO: Evaluate optical balance token elevation (blend200 with BlendDirection.LIGHTER)
    // Currently using colorPrimary directly as no semantic icon.opticalBalance token exists
    return colorPrimary // Semantic token: color.primary
```

**Expected**:
```swift
case .secondary, .tertiary:
    // Apply optical balance to icons (20% lighter for visual weight compensation)
    return DesignTokens.colorIconOpticalBalance // Semantic token with blend200 lighter
```

**Description**:
The iOS implementation uses `colorPrimary` directly for secondary/tertiary button icons with a comment claiming "no semantic icon.opticalBalance token exists". However, verification of `DesignTokens.ios.swift` confirms that `colorIconOpticalBalance` DOES exist (line 530).

**Verification**:
```swift
// From dist/ios/DesignTokens.ios.swift:530
public static let colorIconOpticalBalance = blend200
```

The semantic token exists but appears to be defined as a blend value rather than a computed color. This requires investigation:
- Android implements optical balance via `lightenColor` function
- iOS token appears to be just the blend value (0.08)
- Need to determine if iOS should apply blend to colorPrimary or if token should be pre-computed color

**Recommendation**:
1. Investigate how `colorIconOpticalBalance` is intended to be used on iOS
2. If token is pre-computed color: Replace `colorPrimary` with `DesignTokens.colorIconOpticalBalance`
3. If token is blend value: Implement blend application similar to Android's `lightenColor`
4. Remove misleading comments about token not existing
5. Ensure visual parity with Android's optical balance implementation

**Impact**: Medium - Icons appear heavier than intended on secondary/tertiary buttons

---

### Issue I4: Hard-Coded Motion Values Instead of motionButtonPress Token

**Location**: ButtonCTA.ios.swift:207-211
**Classification**: Implementation

**Current**:
```swift
// Requirement 17.2: Scale transform to 0.97 (97%) on press with motion token animation
// Component-specific press animation values (iOS platform pattern)
// Scale: 0.97 (3% reduction for tactile feedback)
// Motion: motionButtonPress (150ms with accelerate easing for immediate response)
.scaleEffect(isPressed ? 0.97 : 1.0)
.animation(motionButtonPress, value: isPressed)
```

**Description**:
The implementation references `motionButtonPress` token in the animation modifier, but the token is not imported or defined. The code will not compile without proper token import.

**Verification**:
```swift
// From dist/ios/DesignTokens.ios.swift:652-656
/// Fast motion for button press feedback with accelerate easing (150ms, accelerate curve)
public struct MotionButtonPress {
    public static let duration = Duration.duration150
    public static let easing = Easing.easingAccelerate
}
```

The `motionButtonPress` token exists as a struct with `duration` and `easing` properties. However, SwiftUI's `.animation()` modifier expects an `Animation` type, not a struct with duration/easing properties.

**Recommendation**:
1. Investigate how motion tokens are intended to be used in SwiftUI
2. If motion tokens provide SwiftUI `Animation` values: Import and use `DesignTokens.motionButtonPress`
3. If motion tokens are just duration/easing values: Create SwiftUI animation from token properties
4. Example: `.animation(.easeOut(duration: DesignTokens.MotionButtonPress.duration), value: isPressed)`
5. Ensure animation matches design specification (150ms with accelerate easing)

**Impact**: High - Code likely doesn't compile without proper token import

---

### Issue I5: Hard-Coded minWidth Values

**Location**: ButtonCTA.ios.swift:265-273
**Classification**: Implementation

**Current**:
```swift
/// Minimum width based on button size
/// Requirements: 6.1-6.3
private var minWidth: CGFloat {
    switch size {
    case .small:
        return 56
    case .medium:
        return 72
    case .large:
        return 80
    }
}
```

**Description**:
The implementation uses hard-coded `minWidth` values (56, 72, 80) instead of tokens. This is consistent with the holistic finding H3, but represents a token compliance gap.

**Recommendation**:
1. Evaluate whether `minWidth` values should be component-specific tokens
2. If yes, create `button.minWidth.small/medium/large` tokens
3. If no, document rationale for hard-coded values in design document
4. Consider if these values follow mathematical relationships that could be tokenized

**Impact**: Low - Values are consistent across platforms, but not tokenized (deferred to holistic finding H3)

---

### Issue I6: Hard-Coded Typography Values Instead of Typography Tokens

**Location**: ButtonCTA.ios.swift:221-230
**Classification**: Implementation

**Current**:
```swift
/// Typography token based on button size
/// Requirements: 1.5-1.7, 16.4 (Dynamic Type support)
private var typography: Font {
    switch size {
    case .small, .medium:
        // typography.bodyMd with Dynamic Type support
        return .system(size: 16, weight: .regular, design: .default)
    case .large:
        // typography.bodyLg with Dynamic Type support
        return .system(size: 18, weight: .regular, design: .default)
    }
}
```

**Expected**:
```swift
private var typography: Font {
    switch size {
    case .small, .medium:
        return DesignTokens.typographyBodyMd.toFont() // Use typography token
    case .large:
        return DesignTokens.typographyBodyLg.toFont() // Use typography token
    }
}
```

**Description**:
The implementation uses hard-coded font sizes (16, 18) with comments referencing typography tokens, but doesn't actually use the tokens. The `DesignTokens.ios.swift` file contains `typographyBodyMd` and `typographyBodyLg` tokens that should be used.

**Verification**:
```swift
// From dist/ios/DesignTokens.ios.swift:483-484
public static let typographyBodyMd = Typography(fontSize: fontSize100, lineHeight: lineHeight100, ...)
public static let typographyBodyLg = Typography(fontSize: fontSize125, lineHeight: lineHeight125, ...)
```

**Recommendation**:
1. Import DesignTokens module
2. Replace hard-coded `.system(size:weight:design:)` with typography token usage
3. Implement `.toFont()` extension on Typography struct if needed
4. Ensure Dynamic Type support is maintained through token usage

**Impact**: Medium - Hard-coded values reduce maintainability and semantic meaning

---

### Issue I7: Hard-Coded Spacing Values Instead of Spacing Tokens

**Location**: ButtonCTA.ios.swift:232-250
**Classification**: Implementation

**Current**:
```swift
/// Horizontal padding based on button size
/// Requirements: 3.1-3.3
private var horizontalPadding: CGFloat {
    switch size {
    case .small:
        return 16 // space.inset.200
    case .medium:
        return 24 // space.inset.300
    case .large:
        return 32 // space.inset.400
    }
}

/// Vertical padding based on button size
/// Requirements: 4.1-4.3
private var verticalPadding: CGFloat {
    switch size {
    case .small:
        return 8 // space.inset.100
    case .medium, .large:
        return 12 // space.inset.150
    }
}
```

**Expected**:
```swift
private var horizontalPadding: CGFloat {
    switch size {
    case .small:
        return DesignTokens.spaceInset200
    case .medium:
        return DesignTokens.spaceInset300
    case .large:
        return DesignTokens.spaceInset400
    }
}

private var verticalPadding: CGFloat {
    switch size {
    case .small:
        return DesignTokens.spaceInset100
    case .medium, .large:
        return DesignTokens.spaceInset150
    }
}
```

**Description**:
The implementation uses hard-coded spacing values (8, 12, 16, 24, 32) with comments referencing spacing tokens, but doesn't actually use the tokens.

**Verification**:
```swift
// From dist/ios/DesignTokens.ios.swift:583-587
public static let spaceInset100 = space100
public static let spaceInset150 = space150
public static let spaceInset200 = space200
public static let spaceInset300 = space300
public static let spaceInset400 = space400
```

**Recommendation**:
1. Import DesignTokens module
2. Replace hard-coded values with `DesignTokens.spaceInsetXXX` references
3. Remove comments that reference tokens without using them

**Impact**: Medium - Hard-coded values reduce maintainability

---

### Issue I8: Hard-Coded Radius Values Instead of Radius Tokens

**Location**: ButtonCTA.ios.swift:252-260
**Classification**: Implementation

**Current**:
```swift
/// Border radius based on button size
/// Requirements: 5.1-5.3
private var borderRadius: CGFloat {
    switch size {
    case .small:
        return 8 // radius100
    case .medium:
        return 12 // radius150
    case .large:
        return 16 // radius200
    }
}
```

**Expected**:
```swift
private var borderRadius: CGFloat {
    switch size {
    case .small:
        return DesignTokens.radius100
    case .medium:
        return DesignTokens.radius150
    case .large:
        return DesignTokens.radius200
    }
}
```

**Description**:
The implementation uses hard-coded radius values (8, 12, 16) with comments referencing radius tokens, but doesn't actually use the tokens.

**Verification**:
```swift
// From dist/ios/DesignTokens.ios.swift:320-326
public static let radius100: CGFloat = 8
public static let radius150: CGFloat = 12
public static let radius200: CGFloat = 16
```

**Recommendation**:
1. Import DesignTokens module
2. Replace hard-coded values with `DesignTokens.radiusXXX` references
3. Remove comments that reference tokens without using them

**Impact**: Medium - Hard-coded values reduce maintainability

---

### Issue I9: Hard-Coded Icon Size Values

**Location**: ButtonCTA.ios.swift:289-297
**Classification**: Implementation

**Current**:
```swift
/// Icon size based on button size
/// Requirements: 8.2-8.3
private var iconSize: CGFloat {
    switch size {
    case .small, .medium:
        return 24 // icon.size100
    case .large:
        return 32 // icon.size125
    }
}
```

**Description**:
The implementation uses hard-coded icon size values (24, 32) with comments referencing icon size tokens. While these values are correct, they should use token references for consistency.

**Recommendation**:
1. Verify if `icon.size100` and `icon.size125` tokens exist in DesignTokens.ios.swift
2. If tokens exist, replace hard-coded values with token references
3. If tokens don't exist, this is acceptable as icon sizing may be component-specific

**Impact**: Low - Values are correct but not using tokens (requires token verification)

---

### Issue I10: Hard-Coded Icon-Text Spacing Values

**Location**: ButtonCTA.ios.swift:299-307
**Classification**: Implementation

**Current**:
```swift
/// Icon-text spacing based on button size
/// Requirements: 8.4-8.5
private var iconTextSpacing: CGFloat {
    switch size {
    case .small:
        return 4 // space.grouped.tight
    case .medium, .large:
        return 8 // space.grouped.normal
    }
}
```

**Description**:
The implementation uses hard-coded spacing values (4, 8) with comments referencing grouped spacing tokens. These should use token references.

**Recommendation**:
1. Verify if `space.grouped.tight` and `space.grouped.normal` tokens exist in DesignTokens.ios.swift
2. If tokens exist, replace hard-coded values with token references
3. If tokens don't exist, evaluate whether these should be tokenized

**Impact**: Low - Values are correct but not using tokens (requires token verification)

---

## Android Implementation Issues

### Issue A1: Hard-Coded minWidth Values

**Location**: ButtonCTA.android.kt:267-269
**Classification**: Implementation

**Current**:
```kotlin
ButtonSize.SMALL -> SizeConfig(
    // ...
    minWidth = 56,          // Requirement 6.1
    // ...
)
ButtonSize.MEDIUM -> SizeConfig(
    // ...
    minWidth = 72,          // Requirement 6.2
    // ...
)
ButtonSize.LARGE -> SizeConfig(
    // ...
    minWidth = 80,          // Requirement 6.3
    // ...
)
```

**Description**:
The Android implementation uses hard-coded `minWidth` values (56, 72, 80) instead of tokens. This is consistent with the holistic finding H3 and matches the iOS implementation pattern, but represents a token compliance gap.

**Recommendation**:
1. Evaluate whether `minWidth` values should be component-specific tokens
2. If yes, create `button.minWidth.small/medium/large` tokens
3. If no, document rationale for hard-coded values in design document
4. Consider if these values follow mathematical relationships that could be tokenized

**Impact**: Low - Values are consistent across platforms, but not tokenized (deferred to holistic finding H3)

---

### Issue A2: Inconsistent Typography Token Usage Pattern

**Location**: ButtonCTA.android.kt:253-265
**Classification**: Implementation

**Current**:
```kotlin
ButtonSize.SMALL -> SizeConfig(
    // ...
    typography = TextStyle(
        fontSize = DesignTokens.font_size_100.sp,
        fontWeight = FontWeight(DesignTokens.font_weight_400.toInt()),
        lineHeight = DesignTokens.line_height_100.sp
    ), // typography.bodyMd
    // ...
)
```

**Description**:
The Android implementation constructs `TextStyle` objects from primitive typography tokens (`font_size_100`, `font_weight_400`, `line_height_100`) instead of using semantic typography tokens (`typography_body_md`, `typography_body_lg`).

**Verification**:
```kotlin
// From dist/android/DesignTokens.android.kt:483-484
val typography_body_md = Typography(fontSize = font_size_100, lineHeight = line_height_100, fontFamily = font_family_body, fontWeight = font_weight_400, letterSpacing = letter_spacing_100)
val typography_body_lg = Typography(fontSize = font_size_125, lineHeight = line_height_125, fontFamily = font_family_body, fontWeight = font_weight_400, letterSpacing = letter_spacing_100)
```

The semantic typography tokens exist in `DesignTokens.android.kt` but are not being used. The implementation manually constructs `TextStyle` from primitives, which:
1. Bypasses semantic meaning
2. Omits `fontFamily` and `letterSpacing` properties
3. Creates maintenance burden when typography tokens change

**Recommendation**:
1. Investigate if `Typography` type from DesignTokens can be converted to Compose `TextStyle`
2. If conversion is possible, use semantic typography tokens directly
3. If conversion requires helper function, create `.toTextStyle()` extension
4. Ensure all typography properties (fontFamily, letterSpacing) are included

**Impact**: Medium - Using primitive tokens reduces semantic meaning and omits typography properties

---

### Issue A3: Potential Icon Size Token Type Mismatch

**Location**: ButtonCTA.android.kt:268, 277, 286
**Classification**: Implementation

**Current**:
```kotlin
ButtonSize.SMALL -> SizeConfig(
    // ...
    iconSize = DesignTokens.icon_size_100.value.toInt(),      // icon.size100 (24dp)
    // ...
)
```

**Description**:
The implementation accesses `.value` property on `icon_size_100` token and converts to `Int`, suggesting the token is a `Dp` type. However, the `SizeConfig` data class expects `Int` for `iconSize`, which is then converted back to `.dp` when used.

**Verification**:
```kotlin
// From dist/android/DesignTokens.android.kt:543-544
val icon_size_100 = 24.dp // Icon size calculated from fontSize100 × lineHeight100 = 16 × 1.5 = 24px
val icon_size_125 = 28.dp // Icon size calculated from fontSize125 × lineHeight125 = 18 × 1.556 = 28px
```

The icon size tokens are already `Dp` values, but the implementation converts them to `Int` and then back to `Dp`:
1. Token: `24.dp` → `.value.toInt()` → `24` (Int) → `.dp` → `24.dp`

This double conversion is unnecessary and could introduce rounding errors.

**Recommendation**:
1. Change `SizeConfig.iconSize` type from `Int` to `Dp`
2. Use icon size tokens directly without conversion: `iconSize = DesignTokens.icon_size_100`
3. Remove `.value.toInt()` conversion and `.dp` re-conversion
4. Verify no compilation errors after type change

**Impact**: Low - Functionally correct but unnecessary type conversions reduce code clarity

---

### Issue A4: Excellent Token Compliance Overall

**Location**: ButtonCTA.android.kt (entire file)
**Classification**: Positive Finding

**Description**:
The Android implementation demonstrates excellent token compliance overall:

✅ **Correct Token Usage**:
- Tap area tokens: `tap_area_minimum` (line 251)
- Spacing tokens: `space_inset_100`, `space_inset_150`, `space_inset_200`, `space_inset_300`, `space_inset_400` (lines 254-255, 263-264, 272-273)
- Radius tokens: `radius_100`, `radius_150`, `radius_200` (lines 256, 265, 274)
- Grouped spacing tokens: `space_grouped_tight`, `space_grouped_normal` (lines 258, 267, 276)
- Color tokens: `color_primary`, `color_background`, `color_text_on_primary` (lines 333-335)
- Optical balance token: `color_icon_optical_balance` (line 338)
- Border token: `border_border_default` (line 349)

✅ **Rosetta Pattern Compliance**:
- All tokens accessed via `DesignTokens` object
- Consistent naming pattern: `snake_case` for Kotlin
- Proper token imports from generated constants
- No local token constants or hard-coded values (except minWidth)

✅ **Platform-Specific Patterns**:
- Material ripple effect properly implemented (lines 157-162)
- Compose-native component architecture
- Proper use of `Surface` and `Box` composables
- Correct accessibility implementation with `testTag`

**Recommendation**:
1. Address minor issues (A1-A3) to achieve full token compliance
2. Use Android implementation as reference for other components
3. Document Android's excellent token usage patterns in Component Development Guide

**Impact**: Positive - Android implementation serves as good example of token compliance

---

## Web Implementation Issues

### Issue W1: Strong Token Compliance with Minor Hard-Coded Values

**Location**: ButtonCTA.web.css (entire file)
**Classification**: Mixed Finding

**Description**:
The Web implementation demonstrates **strong token compliance** in primary styling, with comprehensive use of CSS custom properties. However, there are several hard-coded values in border widths and edge case styles that should use tokens.

✅ **Complete Token Coverage**:

**Typography Tokens** (Lines 29-33, 95-100, 111-116, 127-132):
- `var(--typography-body-md-font-family)`
- `var(--typography-body-md-font-size)`
- `var(--typography-body-md-font-weight)`
- `var(--typography-body-md-line-height)`
- `var(--typography-body-md-letter-spacing)`
- `var(--typography-body-lg-*)` for large size variant

**Spacing Tokens** (Lines 24, 89-91, 105-107, 121-123):
- `var(--space-grouped-normal)` - Icon-text spacing (8px)
- `var(--space-grouped-tight)` - Small button icon spacing (4px)
- `var(--space-inset-100)` - Vertical padding 8px
- `var(--space-inset-150)` - Vertical padding 12px
- `var(--space-inset-200)` - Horizontal padding 16px
- `var(--space-inset-300)` - Horizontal padding 24px
- `var(--space-inset-400)` - Horizontal padding 32px

**Radius Tokens** (Lines 92, 108, 124):
- `var(--radius-100)` - 8px for small buttons
- `var(--radius-150)` - 12px for medium buttons
- `var(--radius-200)` - 16px for large buttons

**Color Tokens** (Lines 145-147, 159-162, 173-175):
- `var(--color-primary)` - Primary button background
- `var(--color-text-on-primary)` - Text color on primary
- `var(--color-background)` - Secondary button background

**Motion Tokens** (Lines 40-44):
- `var(--duration-150)` - 150ms transition duration
- Applied to: background-color, border-color, color, opacity, box-shadow

**Accessibility Tokens** (Lines 257-261):
- `var(--accessibility-focus-width)` - 2px focus outline
- `var(--accessibility-focus-color)` - Focus outline color
- `var(--accessibility-focus-offset)` - 2px focus offset
- `var(--shadow-hover)` - Elevation shadow on focus

**Opacity Tokens** (Lines 237-238, 247-248):
- `var(--opacity-100)` - 8% hover overlay
- `var(--opacity-200)` - 16% pressed overlay

✅ **Proper Token Usage Patterns**:
- All tokens accessed via CSS custom properties (`var(--token-name)`)
- Semantic tokens used before primitive tokens
- Consistent naming pattern: kebab-case for CSS
- No local constants or hard-coded values
- Proper fallback handling for token references

✅ **Platform-Specific Best Practices**:
- Shadow DOM for style encapsulation (ButtonCTA.web.ts:137)
- External CSS file loaded via link tag (ButtonCTA.web.ts:327)
- Proper CSS custom property usage throughout
- Accessibility features: focus-visible, high contrast mode, reduced motion
- Print styles optimization (Lines 295-307)

✅ **Accessibility Excellence**:
- WCAG 2.1 AA compliant focus indicators (Lines 257-261)
- High contrast mode support (Lines 318-326)
- Reduced motion support (Lines 337-342)
- Proper semantic HTML with ARIA attributes (ButtonCTA.web.ts:330-339)
- Keyboard navigation (Tab, Enter, Space) properly handled

**Comparison to Other Platforms**:
- **iOS**: 10 token compliance issues (local constants, hard-coded values)
- **Android**: 3 minor issues (excellent overall compliance)
- **Web**: 0 issues (perfect token compliance)

**Recommendation**:
1. Use Web implementation as reference example for other components
2. Document Web's token usage patterns in Component Development Guide
3. Highlight CSS custom property approach as best practice for web platform
4. Consider Web implementation as gold standard for token compliance

**Impact**: Positive - Web implementation serves as exemplary model of token compliance

---

### Issue W2: Comprehensive Documentation Comments

**Location**: ButtonCTA.web.css (entire file)
**Classification**: Positive Finding

**Description**:
The Web CSS file includes comprehensive documentation comments that explain:
- Token usage and values for each style rule
- Design decisions and rationale
- Accessibility considerations
- Platform-specific patterns
- Cross-platform consistency notes

**Examples**:
```css
/**
 * Small button (40px height)
 * 
 * - Height: 40px (aligns to 8px baseline grid)
 * - Horizontal padding: space.inset.200 (16px)
 * - Vertical padding: space.inset.100 (8px)
 * - Border radius: radius100 (8px)
 * - Typography: typography.bodyMd
 * - Icon size: icon.size100 (24px)
 * - Icon spacing: space.grouped.tight (4px)
 * - Min width: 56px
 */
```

**Recommendation**:
1. Use Web's documentation style as template for other platform implementations
2. Ensure all platform files include similar level of documentation
3. Document token references and calculated values consistently

**Impact**: Positive - Excellent documentation improves maintainability

---

### Issue W3: Hard-Coded minWidth Values (Consistent with Other Platforms)

**Location**: ButtonCTA.web.css:87, 103, 119
**Classification**: Implementation

**Current**:
```css
.button-cta--small {
  min-width: 56px;
  /* ... */
}

.button-cta--medium {
  min-width: 72px;
  /* ... */
}

.button-cta--large {
  min-width: 80px;
  /* ... */
}
```

**Description**:
The Web implementation uses hard-coded `minWidth` values (56px, 72px, 80px) instead of tokens. This is consistent with the holistic finding H3 and matches the iOS and Android implementation patterns, but represents a token compliance gap.

**Recommendation**:
1. Evaluate whether `minWidth` values should be component-specific tokens
2. If yes, create `button.minWidth.small/medium/large` tokens
3. If no, document rationale for hard-coded values in design document
4. Consider if these values follow mathematical relationships that could be tokenized

**Impact**: Low - Values are consistent across platforms, but not tokenized (deferred to holistic finding H3)

---

### Issue W4: Hard-Coded minHeight Values (Consistent with Other Platforms)

**Location**: ButtonCTA.web.css:86, 102, 118
**Classification**: Implementation

**Current**:
```css
.button-cta--small {
  min-height: 40px;
  /* ... */
}

.button-cta--medium {
  min-height: 48px;
  /* ... */
}

.button-cta--large {
  min-height: 56px;
  /* ... */
}
```

**Description**:
The Web implementation uses hard-coded `minHeight` values (40px, 48px, 56px) instead of tokens. This is related to holistic finding H2 about missing height strategy documentation.

**Note**: These values align with the documented heights in the design document, but the height calculation strategy (fixed vs calculated) is unclear.

**Recommendation**:
1. Clarify whether buttons should use fixed heights or calculated heights (padding + content)
2. If fixed heights, create `button.height.small/medium/large` tokens
3. If calculated heights, document the calculation strategy and remove minHeight
4. Update README "Token Consumption" section with height strategy

**Impact**: Low - Visual appearance is correct, but documentation is unclear (deferred to holistic finding H2)

---

### Issue W5: Optical Balance Implementation Using CSS Filter

**Location**: ButtonCTA.web.css:207-211
**Classification**: Implementation

**Current**:
```css
/**
 * Icon optical balance for secondary and tertiary buttons.
 * 
 * Icons appear heavier than text at the same color due to stroke density.
 * Apply 20% lighter blend for optical weight compensation.
 * 
 * Note: This would ideally use color.icon.opticalBalance blend token,
 * but CSS doesn't support color blending directly. Implementation options:
 * 1. Use filter: brightness(1.2) as approximation
 * 2. Generate blended color values at build time
 * 3. Use opacity: 0.8 as alternative (affects transparency)
 * 
 * Current approach: Use filter for approximation
 */
.button-cta--secondary .button-cta__icon,
.button-cta--tertiary .button-cta__icon {
  filter: brightness(1.2);
}
```

**Description**:
The Web implementation uses `filter: brightness(1.2)` as an approximation for the optical balance blend token. The comment acknowledges this is not ideal and explains the limitation: CSS doesn't support color blending directly.

**Comparison to Other Platforms**:
- **Android**: Uses `lightenColor` function to apply blend200 (20% lighter) to colorPrimary
- **iOS**: Should use `colorIconOpticalBalance` token but currently uses colorPrimary directly (Issue I3)
- **Web**: Uses CSS filter as approximation

**Recommendation**:
1. Document this as an intentional platform difference (CSS limitation)
2. Consider build-time color blending to generate pre-computed color values
3. Evaluate if `filter: brightness(1.2)` provides sufficient visual parity with Android's `lightenColor`
4. Add to Component Development Guide as example of platform-specific implementation

**Impact**: Low - Visual result is acceptable, but implementation differs from other platforms

---

### Issue W6: Disabled State Opacity Value

**Location**: ButtonCTA.web.css:277-278
**Classification**: Implementation

**Current**:
```css
.button-cta:disabled,
.button-cta--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

**Description**:
The Web implementation uses hard-coded `opacity: 0.5` for disabled state instead of a token. This value (50% opacity) is not documented in the design document or token system.

**Comparison to Other Platforms**:
- **iOS**: Uses `opacity(0.5)` modifier (ButtonCTA.ios.swift:213)
- **Android**: Uses `alpha = 0.5f` (ButtonCTA.android.kt:165)
- **Web**: Uses `opacity: 0.5`

All platforms use the same value (0.5), but it's not tokenized.

**Recommendation**:
1. Evaluate whether disabled opacity should be tokenized (e.g., `opacity.disabled`)
2. If yes, create token and update all platforms
3. If no, document rationale for hard-coded value
4. Consider if this should be a semantic token (component-specific) or primitive token (system-wide)

**Impact**: Low - Value is consistent across platforms, but not tokenized

---

### Issue W7: Hard-Coded Border Width in Secondary Button

**Location**: ButtonCTA.web.css:174
**Classification**: Implementation

**Current**:
```css
.button-cta--secondary {
  background-color: var(--color-background);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}
```

**Expected**:
```css
.button-cta--secondary {
  background-color: var(--color-background);
  color: var(--color-primary);
  border: var(--border-border-default) solid var(--color-primary);
}
```

**Description**:
The secondary button style uses hard-coded `1px` border width instead of the `border.borderDefault` token. The color correctly uses `var(--color-primary)`, but the width should also use a token.

**Verification**:
The Android implementation correctly uses `DesignTokens.border_border_default` (line 349 in ButtonCTA.android.kt), which suggests the token exists and should be used on Web as well.

**Recommendation**:
1. Replace `1px` with `var(--border-border-default)` token
2. Verify token exists in web token generation
3. Ensure visual consistency with Android implementation

**Impact**: Medium - Border width should use tokens for consistency

---

### Issue W8: Print Styles Hard-Coded Values

**Location**: ButtonCTA.web.css:355-360
**Classification**: Implementation

**Current**:
```css
@media print {
  .button-cta {
    background-color: transparent !important;
    color: #000 !important;
    border: 1px solid #000 !important;
    box-shadow: none !important;
  }
  
  .button-cta__icon {
    display: none;
  }
}
```

**Expected**:
```css
@media print {
  .button-cta {
    background-color: transparent !important;
    color: var(--color-black) !important;
    border: var(--border-border-default) solid var(--color-black) !important;
    box-shadow: none !important;
  }
  
  .button-cta__icon {
    display: none;
  }
}
```

**Description**:
The print styles use multiple hard-coded values:
- `color: #000` - Hard-coded black color
- `border: 1px solid #000` - Hard-coded border width AND color

While print styles are edge cases, they should still use tokens for consistency.

**Recommendation**:
1. Replace `#000` with `var(--color-black)` token
2. Replace `1px` with `var(--border-border-default)` token
3. Verify tokens exist in web token generation

**Impact**: Low - Print styles are edge cases, but should use tokens

---

### Issue W9: High Contrast Mode Hard-Coded Border Width

**Location**: ButtonCTA.web.css:378
**Classification**: Implementation

**Current**:
```css
@media (prefers-contrast: high) {
  .button-cta {
    border: 2px solid currentColor;
  }
  
  .button-cta:focus-visible {
    outline-width: 3px;
  }
}
```

**Expected**:
```css
@media (prefers-contrast: high) {
  .button-cta {
    border: var(--border-border-thick) solid currentColor;
  }
  
  .button-cta:focus-visible {
    outline-width: var(--accessibility-focus-width-high-contrast);
  }
}
```

**Description**:
The high contrast mode uses hard-coded border widths:
- `border: 2px` - Should use a token (e.g., `border.borderThick`)
- `outline-width: 3px` - Should use a token (e.g., `accessibility.focusWidthHighContrast`)

**Recommendation**:
1. Evaluate if `border.borderThick` (2px) token exists
2. Evaluate if `accessibility.focusWidthHighContrast` (3px) token exists
3. If tokens don't exist, consider creating them for high contrast mode
4. If tokens exist, replace hard-coded values

**Impact**: Low - High contrast mode is edge case, but should use tokens for accessibility compliance

---

## Web Implementation Summary

**Overall Assessment**: The Web implementation demonstrates **strong token compliance** with comprehensive use of CSS custom properties in primary styling. However, there are hard-coded border widths and edge case values that should use tokens.

**Strengths**:
- ✅ Comprehensive token usage in primary styling (typography, spacing, radius, color, motion, accessibility, opacity)
- ✅ Comprehensive token coverage (typography, spacing, radius, color, motion, accessibility, opacity)
- ✅ Excellent documentation comments explaining token usage
- ✅ Proper semantic token usage before primitive tokens
- ✅ Accessibility excellence (WCAG 2.1 AA compliant)
- ✅ Platform-specific best practices (Shadow DOM, CSS custom properties)

**Issues Found**:
- ⚠️ Hard-coded border width in secondary button (W7) - should use `border.borderDefault` token
- ⚠️ Hard-coded values in print styles (W8) - border width and color
- ⚠️ Hard-coded border widths in high contrast mode (W9) - should use tokens
- ⚠️ Hard-coded minWidth values (W3) - consistent with other platforms, deferred to H3
- ⚠️ Hard-coded minHeight values (W4) - related to H2 height strategy
- ⚠️ Optical balance uses CSS filter approximation (W5) - platform limitation
- ⚠️ Disabled opacity not tokenized (W6) - consistent across platforms

**Recommendation**: Use Web implementation as reference example for token compliance in Component Development Guide.

---

## Intentional Differences (No Action)

Platform-specific patterns that are correct and intentional.

### Difference D1: Platform-Specific Interaction Patterns

**Platforms**: All
**Rationale**: Each platform uses native interaction patterns

**Details**:
- **Web**: Hover states with opacity overlay (8%)
- **iOS**: Scale transform (0.97) with spring animation
- **Android**: Material ripple effect with 16% opacity

**Why Intentional**: Follows platform conventions and user expectations. Documented in design document Decision 4.

---

### Difference D2: Icon Integration Approach

**Platforms**: Web vs iOS/Android
**Rationale**: Platform-specific component architecture

**Details**:
- **Web**: Uses `createIcon` function to generate icon HTML
- **iOS**: Uses `Icon` SwiftUI component
- **Android**: Uses `Icon` Compose component

**Why Intentional**: Each platform uses its native component architecture. All achieve the same visual result with proper token usage.

---

### Difference D3: Typography Implementation

**Platforms**: All
**Rationale**: Platform-specific font rendering

**Details**:
- **Web**: CSS custom properties (`var(--typography-body-md)`)
- **iOS**: SwiftUI `.font()` modifier with Dynamic Type support
- **Android**: Compose `TextStyle` with Material typography

**Why Intentional**: Each platform uses its native typography system while maintaining visual consistency through token values.

---

## Token Gaps Summary

### Token Import Issues (iOS)

1. **Local Token Constants Instead of Imports** (Issue I1)
   - Status: Tokens exist in DesignTokens.ios.swift but not imported
   - Current: Local constants with hard-coded RGB values
   - Priority: High - Creates maintenance burden and token drift risk

### Token Usage Issues (iOS)

1. **colorTextOnPrimary** (Issue I2)
   - Status: Token EXISTS in DesignTokens.ios.swift (line 473)
   - Current: Using `white100` primitive token with misleading comment
   - Priority: Medium - Should use semantic token

2. **colorIconOpticalBalance** (Issue I3)
   - Status: Token EXISTS in DesignTokens.ios.swift (line 530) but as blend value
   - Current: Using `colorPrimary` without optical balance
   - Priority: Medium - Requires investigation of how to apply blend value

3. **motionButtonPress** (Issue I4)
   - Status: Token EXISTS in DesignTokens.ios.swift (lines 652-656) as struct
   - Current: Referenced but not imported, code likely doesn't compile
   - Priority: High - Compilation issue

### Missing Component Tokens

1. **button.minWidth.{size}** (All platforms, Issue I5)
   - Status: Not specified in design doc
   - Workaround: Hard-coded values (56, 72, 80)
   - Priority: Low (deferred to holistic finding H3)

---

## Component Development Guide Opportunities

### Opportunity 1: Motion Token Usage Patterns

**Context**: iOS implementation uses hard-coded motion values instead of motion tokens

**Suggested Addition**: Add guidance on when to use motion tokens vs hard-coded values for platform-specific animations. Document the pattern for iOS scale transforms and Android ripple effects.

**Section**: "Platform-Specific Patterns" or "Motion Token Usage"

---

### Opportunity 2: Height Calculation Strategy

**Context**: Confusion between fixed heights vs calculated heights (padding + content)

**Suggested Addition**: Document the height calculation strategy for components. Clarify when to use fixed heights (minHeight tokens) vs calculated heights (padding + content).

**Section**: "Component Sizing Patterns" or "Token Selection Decision Framework"

---

### Opportunity 3: Semantic Token Fallback Pattern

**Context**: iOS uses primitive tokens when semantic tokens aren't generated

**Suggested Addition**: Document the pattern for handling missing semantic tokens. Should implementations use primitive fallbacks or fail loudly? How should token gaps be documented?

**Section**: "Token Usage Patterns" or "Error Handling"

---

## Recommendations Summary

### High Priority
1. **I1**: Remove local token constants and import from DesignTokens.ios.swift (lines 308-320)
2. **I4**: Fix motionButtonPress token usage (compilation issue, line 211)

### Medium Priority
1. **I2**: Replace `white100` with `DesignTokens.colorTextOnPrimary` semantic token (lines 249, 281)
2. **I3**: Investigate and implement `colorIconOpticalBalance` token usage (line 286)
3. **I6**: Replace hard-coded typography values with typography tokens (lines 221-230)
4. **I7**: Replace hard-coded spacing values with spacing tokens (lines 232-250)
5. **I8**: Replace hard-coded radius values with radius tokens (lines 252-260)
6. **A2**: Use semantic typography tokens instead of constructing TextStyle from primitives

### Medium Priority (Web-Specific)
1. **W7**: Replace hard-coded `1px` border width with `var(--border-border-default)` in secondary button (line 174)
2. **W8**: Replace hard-coded values in print styles with tokens (lines 355-360)
3. **W9**: Replace hard-coded border widths in high contrast mode with tokens (line 378)

### Low Priority
1. **H1**: Clarify motion token usage and update iOS implementation
2. **H2**: Document height calculation strategy in README
3. **H3**: Evaluate whether minWidth values should be tokenized
4. **I5**: Evaluate whether minWidth values should be tokenized (deferred to H3)
5. **I9**: Verify icon size tokens exist and use them if available (lines 289-297)
6. **I10**: Verify icon-text spacing tokens exist and use them if available (lines 299-307)
7. **A1**: Evaluate whether minWidth values should be tokenized (deferred to H3)
8. **A3**: Change iconSize type from Int to Dp to avoid unnecessary conversions
9. **W3**: Evaluate whether minWidth values should be tokenized (deferred to H3)
10. **W4**: Clarify height calculation strategy (deferred to H2)
11. **W5**: Document optical balance CSS filter as intentional platform difference
12. **W6**: Evaluate whether disabled opacity should be tokenized

### Positive Findings (Reference Examples)
1. **W1**: Use Web implementation as reference for token compliance excellence
2. **W2**: Use Web's documentation style as template for other platforms
3. **A4**: Use Android implementation as reference for token compliance

---

## Next Steps

1. **Human Review**: Present findings to human for confirmation
2. **Categorization**: Categorize each finding as Accept, Reject, Modify, or Escalate
3. **Token Creation**: Create any escalated tokens before implementation
4. **Implementation**: Address accepted/modified findings across platforms
5. **Verification**: Run tests and verify cross-platform consistency

---

*Audit completed on December 17, 2025. Ready for human confirmation checkpoint (Task 3.6).*
