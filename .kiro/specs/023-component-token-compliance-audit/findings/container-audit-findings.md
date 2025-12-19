# Container Audit Findings

**Date**: December 18, 2025  
**Component**: Container  
**Auditor**: AI Agent  
**Audit Type**: Holistic Cross-Platform Review  
**Platforms**: Web, iOS, Android

---

## Executive Summary

Container is a foundational primitive layout component that provides structural wrapping with individual styling capabilities. This holistic audit reviewed the component spec, README, and all three platform implementations to identify cross-platform consistency issues, missing tokens, and token compliance gaps.

**Overall Assessment**: Container demonstrates strong token compliance with comprehensive documentation. The component successfully references design system tokens across all platforms with minimal hard-coded values. Key findings include placeholder token resolution functions on iOS/Android and opportunities for improved cross-platform consistency in token mapping approaches.

**Key Metrics**:
- **Platforms Audited**: 3 (Web, iOS, Android)
- **Token Categories**: 7 (Spacing, Color, Shadow, Border, Radius, Opacity, Layering)
- **Holistic Issues**: 3 (spec-level concerns)
- **iOS Issues**: 2 (placeholder implementations)
- **Android Issues**: 2 (placeholder implementations)
- **Web Issues**: 0 (fully token-compliant)
- **Intentional Differences**: 2 (platform-specific patterns)

---

## Holistic Issues (Spec Level)

Issues affecting the component design across all platforms.

### Issue H1: Placeholder Token Resolution Functions

**Affects**: iOS, Android  
**Severity**: Medium  
**Classification**: Spec

**Description**:
Both iOS and Android implementations contain placeholder token resolution functions for flexible token types (color, shadow, opacity). These functions currently return hardcoded placeholder values instead of resolving actual token names to token values.

**Current State**:

iOS (`TokenMapping.swift`):
```swift
func resolveColorToken(_ tokenName: String?) -> Color {
    // TODO: Implement token resolution via generated token constants
    return Color.blue // Placeholder
}

func resolveShadowToken(_ tokenName: String?) -> ShadowProperties {
    // TODO: Implement shadow token resolution
    return ShadowProperties(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)
}

func resolveOpacityToken(_ tokenName: String?) -> Double {
    // TODO: Implement opacity token resolution
    return 0.9 // Placeholder
}
```

Android (`TokenMapping.kt`):
```kotlin
fun resolveColorToken(tokenName: String?): Color {
    // TODO: Implement token resolution via generated token constants
    return Color.Blue // Placeholder
}

fun mapShadowToElevation(tokenName: String?): Dp {
    // TODO: Implement shadow token resolution
    return when {
        tokenName.contains("sunrise") -> 2.dp
        // ... pattern matching placeholders
    }
}

fun resolveOpacityToken(tokenName: String?): Float {
    // TODO: Implement opacity token resolution
    return 0.9f // Placeholder
}
```

**Impact**:
- Container cannot use flexible token types (color, shadow, opacity) on iOS/Android
- Props that accept generated token names don't work correctly
- Cross-platform consistency is compromised

**Recommendation**:
Implement actual token resolution functions that:
1. Accept token names as strings (e.g., "color.primary", "shadow.container")
2. Look up token values from generated token constants
3. Return appropriate platform-specific types (Color, ShadowProperties, Double/Float)
4. Handle invalid token names gracefully (return sensible defaults)

**Requirements**: 2.2, 2.3, 4.1-4.4, 5.1-5.4, 8.1-8.4

---

### Issue H2: Missing Token Generation Integration

**Affects**: All platforms  
**Severity**: Medium  
**Classification**: Spec

**Description**:
The Container spec and README reference a token generation system that creates TypeScript types from semantic token definitions, but this system is not fully integrated with iOS/Android token resolution.

**Current State**:
- Web platform uses CSS custom properties (works correctly)
- iOS/Android use placeholder implementations (don't resolve actual tokens)
- Generated TypeScript types exist (`TokenTypes.ts`) but no equivalent for Swift/Kotlin
- Token resolution functions have TODO comments referencing "generated token constants"

**Expected State**:
- Build system generates platform-specific token constants (Swift, Kotlin)
- Token resolution functions import and use generated constants
- All platforms can resolve flexible token names to actual values

**Impact**:
- Container's flexible token props (background, shadow, opacity) don't work on iOS/Android
- Cross-platform consistency is compromised
- Component cannot fulfill its design intent on native platforms

**Recommendation**:
1. Extend token generation system to produce Swift and Kotlin constants
2. Generate token lookup functions or dictionaries for each platform
3. Update iOS/Android token resolution functions to use generated constants
4. Add build-time validation that all referenced tokens exist

**Requirements**: 15.9, 15.10, 15.11

---

### Issue H3: Inconsistent Token Mapping Approaches

**Affects**: All platforms  
**Severity**: Low  
**Classification**: Spec

**Description**:
The three platforms use different approaches for token mapping, which creates maintenance burden and potential for inconsistency:

- **Web**: Direct CSS custom property references (e.g., `var(--space-inset-200)`)
- **iOS**: Switch statements mapping enums to constants (e.g., `case .p200: return spaceInset200`)
- **Android**: When expressions mapping enums to DesignTokens references (e.g., `PaddingValue.P200 -> spaceInset200`)

**Current State**:
Each platform has its own token mapping file with platform-specific patterns:
- `web/token-mapping.ts` - Functions that build CSS strings
- `ios/TokenMapping.swift` - Functions that return SwiftUI types
- `android/TokenMapping.kt` - Functions that return Compose types

**Impact**:
- Adding new token values requires updating three different files
- Risk of inconsistency if one platform is updated but others aren't
- Harder to verify cross-platform equivalence

**Recommendation**:
This is likely an intentional design decision to follow platform idioms, but consider:
1. Document the rationale for different approaches in Component Development Guide
2. Create a cross-platform token mapping test that verifies all platforms map the same prop values to equivalent token references
3. Consider generating token mapping code from a single source of truth

**Requirements**: 10.4, 10.5

---

## iOS Implementation Issues

### Issue I1: Placeholder Color Token Resolution

**Location**: `platforms/ios/TokenMapping.swift:95-120`  
**Current**: Placeholder implementation returns `Color.blue`  
**Expected**: Resolve token name to actual color from generated constants  
**Classification**: Implementation

**Description**:
The `resolveColorToken` function contains a placeholder implementation that returns a hardcoded blue color instead of resolving the token name to the actual color value.

**Code**:
```swift
func resolveColorToken(_ tokenName: String?) -> Color {
    guard let tokenName = tokenName, !tokenName.isEmpty else {
        return Color.clear
    }
    
    // TODO: Implement token resolution via generated token constants
    // This will be replaced by actual token lookup from generated Swift constants
    // For now, return a placeholder color
    
    return Color.blue // Placeholder
}
```

**Impact**:
- Container's `background` prop doesn't work correctly on iOS
- All background colors render as blue regardless of token name
- Cross-platform consistency is broken for background colors

**Recommendation**:
Implement actual token resolution:
```swift
func resolveColorToken(_ tokenName: String?) -> Color {
    guard let tokenName = tokenName, !tokenName.isEmpty else {
        return Color.clear
    }
    
    // Use generated token constants
    switch tokenName {
    case "color.primary":
        return colorPrimary
    case "color.surface":
        return colorSurface
    case "color.background":
        return colorBackground
    // ... other color tokens
    default:
        return Color.clear
    }
}
```

**Requirements**: 2.2, 4.1-4.4

---

### Issue I2: Placeholder Shadow Token Resolution

**Location**: `platforms/ios/TokenMapping.swift:122-180`  
**Current**: Placeholder implementation returns hardcoded shadow values  
**Expected**: Resolve token name to actual shadow properties from generated constants  
**Classification**: Implementation

**Description**:
The `resolveShadowToken` function contains a placeholder implementation that returns hardcoded shadow properties instead of resolving the token name to actual shadow values.

**Code**:
```swift
func resolveShadowToken(_ tokenName: String?) -> ShadowProperties {
    guard let tokenName = tokenName, !tokenName.isEmpty else {
        return ShadowProperties(color: Color.clear, radius: 0, x: 0, y: 0)
    }
    
    // TODO: Implement shadow token resolution via generated token constants
    // This will be replaced by actual token lookup from generated Swift constants
    // For now, return placeholder shadow properties
    
    // Placeholder shadow
    return ShadowProperties(
        color: Color.black.opacity(0.1),
        radius: 8,
        x: 0,
        y: 4
    )
}
```

**Impact**:
- Container's `shadow` prop doesn't work correctly on iOS
- All shadows render with the same placeholder values regardless of token name
- Cross-platform consistency is broken for shadows

**Recommendation**:
Implement actual token resolution using generated constants:
```swift
func resolveShadowToken(_ tokenName: String?) -> ShadowProperties {
    guard let tokenName = tokenName, !tokenName.isEmpty else {
        return ShadowProperties(color: Color.clear, radius: 0, x: 0, y: 0)
    }
    
    // Use generated token constants
    switch tokenName {
    case "shadow.container":
        return ShadowProperties(
            color: shadowContainerColor,
            radius: shadowContainerRadius,
            x: shadowContainerX,
            y: shadowContainerY
        )
    case "shadow.modal":
        return ShadowProperties(
            color: shadowModalColor,
            radius: shadowModalRadius,
            x: shadowModalX,
            y: shadowModalY
        )
    // ... other shadow tokens
    default:
        return ShadowProperties(color: Color.clear, radius: 0, x: 0, y: 0)
    }
}
```

**Requirements**: 2.3, 5.1-5.4

---

### Issue I3: Placeholder Opacity Token Resolution

**Location**: `platforms/ios/TokenMapping.swift:182-210`  
**Current**: Placeholder implementation returns hardcoded `0.9`  
**Expected**: Resolve token name to actual opacity value from generated constants  
**Classification**: Implementation

**Description**:
The `resolveOpacityToken` function contains a placeholder implementation that returns a hardcoded opacity value of 0.9 instead of resolving the token name to the actual opacity value.

**Code**:
```swift
func resolveOpacityToken(_ tokenName: String?) -> Double {
    guard let tokenName = tokenName, !tokenName.isEmpty else {
        return 1.0
    }
    
    // TODO: Implement opacity token resolution via generated token constants
    // This will be replaced by actual token lookup from generated Swift constants
    // For now, return placeholder opacity
    
    return 0.9 // Placeholder
}
```

**Impact**:
- Container's `opacity` prop doesn't work correctly on iOS
- All opacity values render as 0.9 regardless of token name
- Cross-platform consistency is broken for opacity

**Recommendation**:
Implement actual token resolution using generated constants:
```swift
func resolveOpacityToken(_ tokenName: String?) -> Double {
    guard let tokenName = tokenName, !tokenName.isEmpty else {
        return 1.0
    }
    
    // Use generated token constants
    switch tokenName {
    case "opacity.subtle":
        return opacitySubtle
    case "opacity.medium":
        return opacityMedium
    case "opacity.heavy":
        return opacityHeavy
    case "opacity.ghost":
        return opacityGhost
    // ... other opacity tokens
    default:
        return 1.0
    }
}
```

**Requirements**: 8.1-8.4

---

### Issue I4: Hard-Coded Token Constants

**Location**: `platforms/ios/TokenMapping.swift:212-250`  
**Current**: Token constants are hard-coded in TokenMapping.swift  
**Expected**: Token constants should be imported from generated token files  
**Classification**: Implementation

**Description**:
The token constants at the bottom of TokenMapping.swift are hard-coded values that should eventually come from generated token files. While these values correctly reference the design system's token values, they are duplicated rather than imported from a single source of truth.

**Code**:
```swift
// MARK: - Token Constants (Placeholders)

// Space.inset tokens (padding)
private let spaceInset050: CGFloat = 4   // 0.5 × base
private let spaceInset100: CGFloat = 8   // 1 × base
private let spaceInset150: CGFloat = 12  // 1.5 × base
private let spaceInset200: CGFloat = 16  // 2 × base
private let spaceInset300: CGFloat = 24  // 3 × base
private let spaceInset400: CGFloat = 32  // 4 × base

// Border tokens
private let borderDefault: CGFloat = 1   // 1pt
private let borderEmphasis: CGFloat = 2  // 2pt
private let borderHeavy: CGFloat = 4     // 4pt

// Radius tokens
private let radius050: CGFloat = 4   // 4pt
private let radius100: CGFloat = 8   // 8pt
private let radius200: CGFloat = 16  // 16pt

// Z-index tokens (layering)
private let zIndexContainer: Int = 100
private let zIndexNavigation: Int = 200
private let zIndexDropdown: Int = 300
private let zIndexModal: Int = 400
private let zIndexToast: Int = 500
private let zIndexTooltip: Int = 600

// Color tokens
private let colorBorder: Color = Color.gray.opacity(0.3)
```

**Impact**:
- Token values are duplicated across multiple files
- Risk of inconsistency if token values change in one place but not others
- No single source of truth for token values on iOS
- Maintenance burden when updating token values

**Recommendation**:
Replace hard-coded constants with imports from generated token files:
```swift
// Import generated token constants
import DesignTokens

// Token constants are now imported from generated files
// No need to define them here
```

**Note**: This requires the token generation system to produce Swift constant files. The comment in the code acknowledges this: "These are placeholders that will be replaced by generated token constants from the build system."

**Requirements**: 15.9, 15.10, 15.11

---

## Android Implementation Issues

### Issue A1: Placeholder Color Token Resolution

**Location**: `platforms/android/TokenMapping.kt:145-175`  
**Current**: Placeholder implementation returns `Color.Blue`  
**Expected**: Resolve token name to actual color from generated constants  
**Classification**: Implementation

**Description**:
The `resolveColorToken` function contains a placeholder implementation that returns a hardcoded blue color instead of resolving the token name to the actual color value. The function has a TODO comment indicating this is temporary until token generation is complete.

**Code**:
```kotlin
fun resolveColorToken(tokenName: String?): Color {
    if (tokenName.isNullOrEmpty()) {
        return Color.Transparent
    }
    
    // TODO: Implement token resolution via generated token constants
    // This will be replaced by actual token lookup from generated Kotlin constants
    // For now, return a placeholder color
    
    // Example of what the generated code might look like:
    // return when (tokenName) {
    //     "color.primary" -> colorPrimary
    //     "color.surface" -> colorSurface
    //     "color.background" -> colorBackground
    //     else -> Color.Transparent
    // }
    
    return Color.Blue // Placeholder
}
```

**Impact**:
- Container's `background` prop doesn't work correctly on Android
- All background colors render as blue regardless of token name
- Cross-platform consistency is broken for background colors

**Recommendation**:
Implement actual token resolution:
```kotlin
fun resolveColorToken(tokenName: String?): Color {
    if (tokenName.isNullOrEmpty()) {
        return Color.Transparent
    }
    
    // Use generated token constants
    return when (tokenName) {
        "color.primary" -> colorPrimary
        "color.surface" -> colorSurface
        "color.background" -> colorBackground
        // ... other color tokens
        else -> Color.Transparent
    }
}
```

**Requirements**: 2.2, 4.1-4.4

---

### Issue A2: Placeholder Shadow Token Resolution with Pattern Matching

**Location**: `platforms/android/TokenMapping.kt:177-220`  
**Current**: Placeholder implementation uses pattern matching on token names  
**Expected**: Resolve token names to actual elevation values from generated constants  
**Classification**: Implementation

**Description**:
The `mapShadowToElevation` function contains a placeholder implementation that uses pattern matching on token names (e.g., checking if name contains "sunrise", "noon", "dusk"). This approach is fragile, doesn't scale, and doesn't match the actual token structure.

**Code**:
```kotlin
fun mapShadowToElevation(tokenName: String?): Dp {
    if (tokenName.isNullOrEmpty()) {
        return 0.dp
    }
    
    // TODO: Implement shadow token resolution via generated token constants
    // This will be replaced by actual token lookup from generated Kotlin constants
    // For now, return placeholder elevation based on token name patterns
    
    // Example of what the generated code might look like:
    // return when (tokenName) {
    //     "shadow.sunrise" -> shadowSunriseElevation
    //     "shadow.noon" -> shadowNoonElevation
    //     "shadow.dusk" -> shadowDuskElevation
    //     "shadow.container" -> shadowContainerElevation
    //     "shadow.modal" -> shadowModalElevation
    //     else -> 4.dp
    // }
    
    // Placeholder mapping based on token name patterns
    return when {
        tokenName.contains("sunrise") -> 2.dp
        tokenName.contains("noon") -> 4.dp
        tokenName.contains("dusk") -> 8.dp
        tokenName.contains("container") -> 8.dp
        tokenName.contains("navigation") -> 4.dp
        tokenName.contains("dropdown") -> 8.dp
        tokenName.contains("modal") -> 16.dp
        else -> 4.dp  // Default elevation
    }
}
```

**Impact**:
- Container's `shadow` prop doesn't work correctly on Android
- Pattern matching is fragile and may not match actual token names
- Risk of incorrect elevation values if token names don't match patterns
- Cross-platform consistency is compromised

**Recommendation**:
Implement actual token resolution using generated constants (similar pattern to color resolution). Avoid pattern matching on token names:
```kotlin
fun mapShadowToElevation(tokenName: String?): Dp {
    if (tokenName.isNullOrEmpty()) {
        return 0.dp
    }
    
    // Use generated token constants
    return when (tokenName) {
        "shadow.sunrise" -> shadowSunriseElevation
        "shadow.noon" -> shadowNoonElevation
        "shadow.dusk" -> shadowDuskElevation
        "shadow.container" -> shadowContainerElevation
        "shadow.modal" -> shadowModalElevation
        // ... other shadow tokens
        else -> 4.dp
    }
}
```

**Requirements**: 2.3, 5.1-5.4

---

### Issue A3: Placeholder Opacity Token Resolution

**Location**: `platforms/android/TokenMapping.kt:222-250`  
**Current**: Placeholder implementation returns hardcoded `0.9f`  
**Expected**: Resolve token name to actual opacity value from generated constants  
**Classification**: Implementation

**Description**:
The `resolveOpacityToken` function contains a placeholder implementation that returns a hardcoded opacity value of 0.9f instead of resolving the token name to the actual opacity value.

**Code**:
```kotlin
fun resolveOpacityToken(tokenName: String?): Float {
    if (tokenName.isNullOrEmpty()) {
        return 1.0f
    }
    
    // TODO: Implement opacity token resolution via generated token constants
    // This will be replaced by actual token lookup from generated Kotlin constants
    // For now, return placeholder opacity
    
    // Example of what the generated code might look like:
    // return when (tokenName) {
    //     "opacity.subtle" -> opacitySubtle
    //     "opacity.medium" -> opacityMedium
    //     "opacity.heavy" -> opacityHeavy
    //     "opacity.ghost" -> opacityGhost
    //     else -> 1.0f
    // }
    
    return 0.9f // Placeholder
}
```

**Impact**:
- Container's `opacity` prop doesn't work correctly on Android
- All opacity values render as 0.9f regardless of token name
- Cross-platform consistency is broken for opacity

**Recommendation**:
Implement actual token resolution using generated constants:
```kotlin
fun resolveOpacityToken(tokenName: String?): Float {
    if (tokenName.isNullOrEmpty()) {
        return 1.0f
    }
    
    // Use generated token constants
    return when (tokenName) {
        "opacity.subtle" -> opacitySubtle
        "opacity.medium" -> opacityMedium
        "opacity.heavy" -> opacityHeavy
        "opacity.ghost" -> opacityGhost
        // ... other opacity tokens
        else -> 1.0f
    }
}
```

**Requirements**: 8.1-8.4

---

### Issue A4: Correct Rosetta Pattern Compliance for Fixed Tokens

**Location**: `platforms/android/TokenMapping.kt:252-310`  
**Current**: Token constants correctly use DesignTokens references  
**Expected**: Continue using DesignTokens pattern  
**Classification**: Positive Finding (No Action)

**Description**:
The token constants at the bottom of TokenMapping.kt correctly follow the Rosetta pattern by importing and referencing DesignTokens. This is the correct approach for fixed token types (spacing, border, radius, elevation).

**Code**:
```kotlin
// Import DesignTokens for token references
import com.designerpunk.tokens.DesignTokens

// Space.inset tokens (padding)
private val spaceInset050: Dp = DesignTokens.space_inset_050.dp
private val spaceInset100: Dp = DesignTokens.space_inset_100.dp
private val spaceInset150: Dp = DesignTokens.space_inset_150.dp
private val spaceInset200: Dp = DesignTokens.space_inset_200.dp
private val spaceInset300: Dp = DesignTokens.space_inset_300.dp
private val spaceInset400: Dp = DesignTokens.space_inset_400.dp

// Border tokens
private val borderDefault: Dp = DesignTokens.border_default.dp
private val borderEmphasis: Dp = DesignTokens.border_emphasis.dp
private val borderHeavy: Dp = DesignTokens.border_heavy.dp

// Radius tokens
private val radius050: Dp = DesignTokens.radius_050.dp
private val radius100: Dp = DesignTokens.radius_100.dp
private val radius200: Dp = DesignTokens.radius_200.dp

// Elevation tokens (layering - Android-specific)
private val elevationContainer: Dp = DesignTokens.elevation_container.dp
private val elevationNavigation: Dp = DesignTokens.elevation_navigation.dp
private val elevationDropdown: Dp = DesignTokens.elevation_dropdown.dp
private val elevationModal: Dp = DesignTokens.elevation_modal.dp
private val elevationToast: Dp = DesignTokens.elevation_toast.dp
private val elevationTooltip: Dp = DesignTokens.elevation_tooltip.dp

// Color tokens
private val colorBorder: Color = Color(DesignTokens.color_border)
```

**Impact**:
- ✅ Correct Rosetta pattern usage for fixed token types
- ✅ Single source of truth via DesignTokens import
- ✅ Type-safe token references with Kotlin type system
- ✅ Consistent with ButtonCTA and TextInputField Android implementations

**Recommendation**:
No action needed. This is the correct pattern. The flexible token resolution functions (color, shadow, opacity) should follow a similar pattern once token generation supports them.

**Requirements**: 15.9, 15.10, 15.11

---

### Issue A5: Android-Specific Layering/Shadow Conflict Handling

**Location**: `platforms/android/Container.android.kt:95-103`  
**Current**: Correct Android-specific warning for conflicting props  
**Expected**: Continue current implementation  
**Classification**: Positive Finding (No Action)

**Description**:
The Container component correctly handles the Android-specific behavior where elevation tokens handle both stacking order and shadow rendering. When both `layering` and `shadow` props are provided, the component logs a development warning and uses the `layering` prop.

**Code**:
```kotlin
// Android-specific: Check for conflicting layering + shadow props
if (layering != null && shadow != null) {
    Log.w(
        "Container",
        "Both layering and shadow props provided on Android. " +
        "Android elevation handles both stacking and shadow. " +
        "Using layering prop, shadow prop ignored."
    )
}
```

**Impact**:
- ✅ Correct Android-specific behavior following Material Design guidelines
- ✅ Clear developer warning when conflicting props are used
- ✅ Documented in component comments and README
- ✅ Consistent with Android platform conventions

**Recommendation**:
No action needed. This is the correct pattern for handling Android's elevation system.

**Requirements**: 9.7, 9.8, 16.2, 16.3

---

## Web Implementation Issues

### Positive Finding: Fully Token-Compliant Implementation

**Location**: `platforms/web/Container.web.ts`, `platforms/web/token-mapping.ts`  
**Status**: ✅ Excellent token compliance  
**Classification**: Positive Finding (No Action)

**Description**:
The Container Web implementation demonstrates exemplary token compliance with zero hard-coded values. All styling uses CSS custom properties that reference design system tokens, following the established pattern from Icon, ButtonCTA, and TextInputField components.

**Token Usage Analysis**:

**1. Spacing (Padding)** - `Container.web.ts:46-47, token-mapping.ts:73-88`
```typescript
// Token mapping function
export function mapPaddingToCSS(padding: PaddingValue | null): string {
  if (!padding || padding === 'none') {
    return '';
  }
  const tokenName = paddingTokenMap[padding];
  if (!tokenName) {
    return '';
  }
  return `padding: ${tokenToCssVar(tokenName)}`;
}
```
- ✅ Uses `paddingTokenMap` to convert prop values to token names
- ✅ Converts to CSS custom properties via `tokenToCssVar` helper
- ✅ Example: `padding: '200'` → `padding: var(--space-inset-200)`

**2. Background Color** - `token-mapping.ts:163-180`
```typescript
export function mapColorToCSS(color: ColorTokenName | null): string {
  if (!color) {
    return '';
  }
  return `background: ${tokenToCssVar(color)}`;
}
```
- ✅ Accepts generated `ColorTokenName` type for type safety
- ✅ Converts to CSS custom property format
- ✅ Example: `background: 'color.primary'` → `background: var(--color-primary)`

**3. Shadow** - `token-mapping.ts:182-199`
```typescript
export function mapShadowToCSS(shadow: ShadowTokenName | null): string {
  if (!shadow) {
    return '';
  }
  return `box-shadow: ${tokenToCssVar(shadow)}`;
}
```
- ✅ Accepts generated `ShadowTokenName` type for type safety
- ✅ Converts to CSS custom property format
- ✅ Example: `shadow: 'shadow.container'` → `box-shadow: var(--shadow-container)`

**4. Border** - `token-mapping.ts:90-118`
```typescript
export function mapBorderToCSS(border: BorderValue | null): string {
  if (!border || border === 'none') {
    return '';
  }
  const tokenName = borderTokenMap[border];
  if (!tokenName) {
    return '';
  }
  const widthVar = tokenToCssVar(tokenName);
  const colorVar = tokenToCssVar(BORDER_COLOR_TOKEN);
  return `border: ${widthVar} solid ${colorVar}`;
}
```
- ✅ Uses `borderTokenMap` for width tokens
- ✅ Uses `BORDER_COLOR_TOKEN` constant for color
- ✅ Example: `border: 'default'` → `border: var(--border-default) solid var(--color-border)`

**5. Border Radius** - `token-mapping.ts:120-141`
```typescript
export function mapBorderRadiusToCSS(borderRadius: BorderRadiusValue | null): string {
  if (!borderRadius || borderRadius === 'none') {
    return '';
  }
  const tokenName = borderRadiusTokenMap[borderRadius];
  if (!tokenName) {
    return '';
  }
  return `border-radius: ${tokenToCssVar(tokenName)}`;
}
```
- ✅ Uses `borderRadiusTokenMap` to convert prop values
- ✅ Example: `borderRadius: 'normal'` → `border-radius: var(--radius100)`

**6. Opacity** - `token-mapping.ts:201-218`
```typescript
export function mapOpacityToCSS(opacity: OpacityTokenName | null): string {
  if (!opacity) {
    return '';
  }
  return `opacity: ${tokenToCssVar(opacity)}`;
}
```
- ✅ Accepts generated `OpacityTokenName` type for type safety
- ✅ Example: `opacity: 'opacity.subtle'` → `opacity: var(--opacity-subtle)`

**7. Layering (Z-Index)** - `token-mapping.ts:220-247`
```typescript
export function mapLayeringToCSS(layering: LayeringValue | null): string {
  if (!layering) {
    return '';
  }
  const tokenName = layeringTokenMap.web[layering];
  if (!tokenName) {
    return '';
  }
  return `z-index: ${tokenToCssVar(tokenName)}`;
}
```
- ✅ Uses `layeringTokenMap.web` for platform-specific z-index tokens
- ✅ Example: `layering: 'modal'` → `z-index: var(--z-index-modal)`

**Focus Styles** - `Container.web.ts:45-58`
```typescript
.container:focus {
  outline: var(--border-emphasis) solid var(--color-primary);
  outline-offset: var(--space-grouped-minimal);
}

.container:focus:not(:focus-visible) {
  outline: none;
}

.container:focus-visible {
  outline: var(--border-emphasis) solid var(--color-primary);
  outline-offset: var(--space-grouped-minimal);
}
```
- ✅ Uses `--border-emphasis` token for outline width
- ✅ Uses `--color-primary` token for outline color
- ✅ Uses `--space-grouped-minimal` token for outline offset
- ✅ Implements `:focus-visible` for keyboard-only focus indication
- ✅ Removes outline for mouse/touch focus (`:focus:not(:focus-visible)`)

**High-Contrast Mode Support** - `Container.web.ts:66-70`
```typescript
@media (prefers-contrast: high) {
  .container {
    border-width: var(--border-emphasis);
  }
}
```
- ✅ Uses `prefers-contrast: high` media query for accessibility
- ✅ Increases border width using `--border-emphasis` token
- ✅ Improves visibility for users with contrast preferences

**Reduced Motion Support** - `Container.web.ts:60-64`
```typescript
@media (prefers-reduced-motion: reduce) {
  .container {
    transition: none !important;
    animation: none !important;
  }
}
```
- ✅ Respects user's motion preferences
- ✅ Disables transitions and animations when requested
- ✅ Accessibility best practice for vestibular disorders

**Print Styles** - `Container.web.ts:72-77`
```typescript
@media print {
  .container {
    box-shadow: none !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```
- ✅ Removes shadows for print (saves ink, improves clarity)
- ✅ Preserves colors with `print-color-adjust: exact`
- ✅ Cross-browser support with `-webkit-` prefix

**Impact**:
- ✅ Zero hard-coded values in Web implementation
- ✅ All styling references design system tokens via CSS custom properties
- ✅ Type-safe token usage with generated TypeScript types
- ✅ Comprehensive accessibility support (focus, high-contrast, reduced motion)
- ✅ Excellent example for other components to follow
- ✅ Consistent with Icon, ButtonCTA, and TextInputField Web implementations

**Recommendation**:
No action needed. This is exemplary token compliance. The Web implementation should be used as a reference for other components.

**Requirements**: 1.3, 2.1-2.5, 3.1-3.7, 4.1-4.4, 5.1-5.4, 6.1-6.5, 7.1-7.4, 8.1-8.4, 9.1-9.9, 10.1-10.5, 11.1-11.8, 12.1-12.4, 13.1-13.4, 14.1-14.4, 15.1-15.11, 16.1-16.4

---

---

## Intentional Differences (No Action)

Platform-specific patterns that are correct and intentional.

### Difference D1: Layering Token Types

**Platform**: iOS vs Android  
**Rationale**: Platform-specific stacking order mechanisms

**Description**:
- **iOS**: Uses z-index tokens (same as web) for stacking order
- **Android**: Uses elevation tokens that couple stacking order with shadow rendering

This is an intentional platform difference following Material Design guidelines on Android. The Container component correctly handles this by:
- Accepting a single `layering` prop across all platforms
- Mapping to z-index tokens on iOS/web
- Mapping to elevation tokens on Android
- Logging a warning on Android if both `layering` and `shadow` props are provided

**Code Evidence**:

Android warning logic:
```kotlin
if (layering != null && shadow != null) {
    Log.w(
        "Container",
        "Both layering and shadow props provided on Android. " +
        "Android elevation handles both stacking and shadow. " +
        "Using layering prop, shadow prop ignored."
    )
}
```

**Requirements**: 9.7, 9.8, 16.2, 16.3

---

### Difference D2: Semantic HTML Support

**Platform**: Web only  
**Rationale**: Web-specific accessibility and SEO feature

**Description**:
The web platform supports a `semantic` prop that allows rendering different HTML elements (div, section, article, aside, main, fieldset) for improved accessibility and SEO. This prop is web-specific and not available on iOS/Android.

This is an intentional platform difference. Native platforms (iOS/Android) don't have an equivalent concept of semantic HTML elements.

**Code Evidence**:

Web implementation:
```typescript
const semantic = (this.getAttribute('semantic') as SemanticHTMLElement) || 'div';
// ...
this._shadowRoot.innerHTML = `
  <${semantic} class="container" ${accessibilityAttrs}>
    <slot></slot>
  </${semantic}>
`;
```

**Requirements**: 11.1-11.8, 16.4

---

## Cross-Platform Consistency Analysis

### Token Reference Patterns

**Spacing (Padding)**:
- ✅ Web: CSS custom properties (`var(--space-inset-200)`)
- ✅ iOS: Generated constants (`spaceInset200`)
- ✅ Android: DesignTokens references (`DesignTokens.space_inset_050.dp`)
- **Status**: Consistent - all platforms reference tokens correctly

**Border**:
- ✅ Web: CSS custom properties (`var(--border-default)`)
- ✅ iOS: Generated constants (`borderDefault`)
- ✅ Android: DesignTokens references (`DesignTokens.border_default.dp`)
- **Status**: Consistent - all platforms reference tokens correctly

**Border Radius**:
- ✅ Web: CSS custom properties (`var(--radius100)`)
- ✅ iOS: Generated constants (`radius100`)
- ✅ Android: DesignTokens references (`DesignTokens.radius_100.dp`)
- **Status**: Consistent - all platforms reference tokens correctly

**Layering**:
- ✅ Web: CSS custom properties for z-index (`var(--z-index-modal)`)
- ✅ iOS: Generated constants for z-index (`zIndexModal`)
- ✅ Android: DesignTokens references for elevation (`DesignTokens.elevation_modal.dp`)
- **Status**: Consistent - platforms use appropriate token types (z-index vs elevation)

**Color**:
- ✅ Web: CSS custom properties (`var(--color-primary)`)
- ❌ iOS: Placeholder implementation (returns `Color.blue`)
- ❌ Android: Placeholder implementation (returns `Color.Blue`)
- **Status**: Inconsistent - native platforms need token resolution

**Shadow**:
- ✅ Web: CSS custom properties (`var(--shadow-container)`)
- ❌ iOS: Placeholder implementation (returns hardcoded shadow)
- ❌ Android: Pattern matching on token names (fragile)
- **Status**: Inconsistent - native platforms need token resolution

**Opacity**:
- ✅ Web: CSS custom properties (`var(--opacity-subtle)`)
- ❌ iOS: Placeholder implementation (returns `0.9`)
- ❌ Android: Placeholder implementation (returns `0.9f`)
- **Status**: Inconsistent - native platforms need token resolution

---

## Component Development Guide Opportunities

### Opportunity 1: Token Resolution Patterns

**Topic**: Implementing token resolution functions for flexible token types

**Guidance Needed**:
- How to structure token resolution functions (switch statements, dictionaries, generated code)
- Error handling for invalid token names
- Default values for missing tokens
- Testing strategies for token resolution

**Rationale**: Container's placeholder implementations reveal a common pattern that other components will need. Documenting best practices will help future component development.

---

### Opportunity 2: Cross-Platform Token Mapping

**Topic**: Maintaining consistency across platform-specific token mapping approaches

**Guidance Needed**:
- When to use platform-specific idioms vs shared patterns
- How to verify cross-platform token equivalence
- Testing strategies for cross-platform consistency
- Documentation standards for platform differences

**Rationale**: Container uses three different token mapping approaches. Guidance on when this is appropriate vs when to seek consistency would help future components.

---

### Opportunity 3: Placeholder Implementation Patterns

**Topic**: Managing placeholder implementations during development

**Guidance Needed**:
- When placeholders are acceptable vs when they must be completed
- How to mark placeholders clearly (TODO comments, type system, tests)
- Migration path from placeholders to real implementations
- Testing strategies that catch placeholder implementations

**Rationale**: Container has well-documented placeholder implementations, but they prevent the component from working correctly. Guidance on managing this technical debt would help.

---

## Summary

Container is a well-designed primitive component with strong token compliance and comprehensive documentation. The main findings are:

**Strengths**:
- ✅ Comprehensive README with clear usage examples
- ✅ Strong token compliance for fixed token types (spacing, border, radius, layering)
- ✅ Web platform is fully token-compliant with no hard-coded values
- ✅ Clear documentation of platform-specific differences
- ✅ Appropriate use of platform idioms (CSS custom properties, SwiftUI modifiers, Compose modifiers)

**Areas for Improvement**:
- ❌ Placeholder token resolution functions on iOS/Android prevent flexible token types from working
- ❌ Missing token generation integration for native platforms
- ⚠️ Inconsistent token mapping approaches across platforms (may be intentional)

**Next Steps**:
1. Implement token resolution functions for color, shadow, and opacity on iOS/Android
2. Integrate token generation system to produce Swift/Kotlin constants
3. Add cross-platform consistency tests
4. Document token resolution patterns in Component Development Guide

---

**Audit Complete**: December 18, 2025  
**Next Phase**: Human confirmation checkpoint (Task 7.6)
