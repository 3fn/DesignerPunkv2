# Component Token Audit Report

**Date**: 2025-12-11
**Total Components Audited**: 28
**Total Violations Found**: 39

## Violations by Type

- **Color**: 3
- **Spacing**: 33
- **Motion**: 3
- **Typography**: 0

## Violations by Priority

- **High** (Colors, Spacing): 36
- **Medium** (Motion): 3
- **Low** (Edge Cases): 0

## Component Details

### ButtonCTA (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/ButtonCTA/platforms/web/ButtonCTA.web.ts`
**Violations**: 0

### ButtonCTA (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/ButtonCTA/platforms/web/__tests__/ButtonCTA.icon-integration.test.ts`
**Violations**: 0

### ButtonCTA (ios)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/ButtonCTA/platforms/ios/ButtonCTA.ios.swift`
**Violations**: 5

#### Line 199: spacing (high priority)

**Current Value**: `? 0.97 : 1.0`
**Suggested Token**: `Remove fallback - fail loudly when token missing`
**⚠️ Fallback Pattern**: This uses a hard-coded fallback value

**Context**:
```
        // Easing: easeOut (snappy deceleration)
        // Not tokenized: Platform-specific interaction pattern used only by ButtonCTA
        .scaleEffect(isPressed ? 0.97 : 1.0)
        .animation(.easeOut(duration: 0.1), value: isPressed)
        // Track pressed state for scale transform
```

#### Line 200: motion (medium priority)

**Current Value**: `0.1`
**Suggested Token**: `motion100 (primitive - consider semantic alternative)`

**Context**:
```
        // Not tokenized: Platform-specific interaction pattern used only by ButtonCTA
        .scaleEffect(isPressed ? 0.97 : 1.0)
        .animation(.easeOut(duration: 0.1), value: isPressed)
        // Track pressed state for scale transform
        .simultaneousGesture(
```

#### Line 395: color (high priority)

**Current Value**: `Color(red: 103/255, green: 80/255, blue: 164/255)`
**Suggested Token**: `colorPrimary or appropriate semantic color token`

**Context**:
```

// Color tokens - Semantic tokens from DesignTokens.ios.swift
private let colorPrimary = Color(red: 103/255, green: 80/255, blue: 164/255) // purple300 - #6750A4
private let colorBackground = Color(red: 255/255, green: 255/255, blue: 255/255) // white100 - #FFFFFF
private let white100 = Color(red: 255/255, green: 255/255, blue: 255/255) // white100 - #FFFFFF (primitive token for text on primary)
```

#### Line 396: color (high priority)

**Current Value**: `Color(red: 255/255, green: 255/255, blue: 255/255)`
**Suggested Token**: `colorPrimary or appropriate semantic color token`

**Context**:
```
// Color tokens - Semantic tokens from DesignTokens.ios.swift
private let colorPrimary = Color(red: 103/255, green: 80/255, blue: 164/255) // purple300 - #6750A4
private let colorBackground = Color(red: 255/255, green: 255/255, blue: 255/255) // white100 - #FFFFFF
private let white100 = Color(red: 255/255, green: 255/255, blue: 255/255) // white100 - #FFFFFF (primitive token for text on primary)

```

#### Line 397: color (high priority)

**Current Value**: `Color(red: 255/255, green: 255/255, blue: 255/255)`
**Suggested Token**: `colorPrimary or appropriate semantic color token`

**Context**:
```
private let colorPrimary = Color(red: 103/255, green: 80/255, blue: 164/255) // purple300 - #6750A4
private let colorBackground = Color(red: 255/255, green: 255/255, blue: 255/255) // white100 - #FFFFFF
private let white100 = Color(red: 255/255, green: 255/255, blue: 255/255) // white100 - #FFFFFF (primitive token for text on primary)

// Accessibility tokens - Tap area tokens from TapAreaTokens.ts
```

### ButtonCTA (android)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/ButtonCTA/platforms/android/ButtonCTA.android.kt`
**Violations**: 0

### Container (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Container/platforms/web/Container.web.ts`
**Violations**: 0

### Container (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Container/platforms/web/__tests__/Container.web.test.ts`
**Violations**: 0

### Container (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Container/platforms/web/__tests__/token-mapping.test.ts`
**Violations**: 0

### Container (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Container/platforms/web/token-mapping.ts`
**Violations**: 0

### Container (ios)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Container/platforms/ios/Container.ios.swift`
**Violations**: 0

### Container (ios)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Container/platforms/ios/TokenMapping.swift`
**Violations**: 0

### Container (ios)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Container/platforms/ios/__tests__/Container.ios.swift`
**Violations**: 0

### Container (android)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Container/platforms/android/Container.android.kt`
**Violations**: 0

### Container (android)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Container/platforms/android/TokenMapping.kt`
**Violations**: 27

#### Line 33: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
 * 
 * Converts padding prop value to Dp using space.inset tokens.
 * Returns 0.dp for PaddingValue.None.
 * 
 * @param padding Padding prop value
```

#### Line 41: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
 * ```kotlin
 * mapPaddingToDp(PaddingValue.P200) // Returns spaceInset200
 * mapPaddingToDp(PaddingValue.None) // Returns 0.dp
 * ```
 * 
```

#### Line 48: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
fun mapPaddingToDp(padding: PaddingValue): Dp {
    return when (padding) {
        PaddingValue.None -> 0.dp
        PaddingValue.P050 -> spaceInset050
        PaddingValue.P100 -> spaceInset100
```

#### Line 64: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
 * 
 * Converts border prop value to Dp using border width tokens.
 * Returns 0.dp for BorderValue.None.
 * 
 * @param border Border prop value
```

#### Line 72: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
 * ```kotlin
 * mapBorderToWidth(BorderValue.Default) // Returns borderDefault
 * mapBorderToWidth(BorderValue.None) // Returns 0.dp
 * ```
 * 
```

#### Line 79: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
fun mapBorderToWidth(border: BorderValue): Dp {
    return when (border) {
        BorderValue.None -> 0.dp
        BorderValue.Default -> borderDefault
        BorderValue.Emphasis -> borderEmphasis
```

#### Line 111: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
 * 
 * Converts borderRadius prop value to RoundedCornerShape using radius tokens.
 * Returns RoundedCornerShape(0.dp) for BorderRadiusValue.None.
 * 
 * @param borderRadius Border radius prop value
```

#### Line 119: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
 * ```kotlin
 * getRoundedCornerShape(BorderRadiusValue.Normal) // Returns RoundedCornerShape(radius100)
 * getRoundedCornerShape(BorderRadiusValue.None) // Returns RoundedCornerShape(0.dp)
 * ```
 * 
```

#### Line 126: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
fun getRoundedCornerShape(borderRadius: BorderRadiusValue): RoundedCornerShape {
    val radius = when (borderRadius) {
        BorderRadiusValue.None -> 0.dp
        BorderRadiusValue.Tight -> radius050
        BorderRadiusValue.Normal -> radius100
```

#### Line 183: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
 * 
 * Converts shadow token name to Compose elevation Dp.
 * Returns 0.dp if token name is null or empty.
 * 
 * On Android, elevation handles both stacking order and shadow rendering.
```

#### Line 198: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
 * mapShadowToElevation("shadow.container") // Returns shadowContainerElevation
 * mapShadowToElevation("shadow.modal") // Returns shadowModalElevation
 * mapShadowToElevation(null) // Returns 0.dp
 * ```
 * 
```

#### Line 205: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
fun mapShadowToElevation(tokenName: String?): Dp {
    if (tokenName.isNullOrEmpty()) {
        return 0.dp
    }
    
```

#### Line 219: spacing (high priority)

**Current Value**: `4.dp`
**Suggested Token**: `DesignTokens.space_grouped_tight.dp`

**Context**:
```
    //     "shadow.container" -> shadowContainerElevation
    //     "shadow.modal" -> shadowModalElevation
    //     else -> 4.dp
    // }
    
```

#### Line 224: spacing (high priority)

**Current Value**: `2.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp`

**Context**:
```
    // Placeholder mapping based on token name patterns
    return when {
        tokenName.contains("sunrise") -> 2.dp
        tokenName.contains("noon") -> 4.dp
        tokenName.contains("dusk") -> 8.dp
```

#### Line 225: spacing (high priority)

**Current Value**: `4.dp`
**Suggested Token**: `DesignTokens.space_grouped_tight.dp`

**Context**:
```
    return when {
        tokenName.contains("sunrise") -> 2.dp
        tokenName.contains("noon") -> 4.dp
        tokenName.contains("dusk") -> 8.dp
        tokenName.contains("container") -> 8.dp
```

#### Line 226: spacing (high priority)

**Current Value**: `8.dp`
**Suggested Token**: `DesignTokens.space_grouped_normal.dp`

**Context**:
```
        tokenName.contains("sunrise") -> 2.dp
        tokenName.contains("noon") -> 4.dp
        tokenName.contains("dusk") -> 8.dp
        tokenName.contains("container") -> 8.dp
        tokenName.contains("navigation") -> 4.dp
```

#### Line 227: spacing (high priority)

**Current Value**: `8.dp`
**Suggested Token**: `DesignTokens.space_grouped_normal.dp`

**Context**:
```
        tokenName.contains("noon") -> 4.dp
        tokenName.contains("dusk") -> 8.dp
        tokenName.contains("container") -> 8.dp
        tokenName.contains("navigation") -> 4.dp
        tokenName.contains("dropdown") -> 8.dp
```

#### Line 228: spacing (high priority)

**Current Value**: `4.dp`
**Suggested Token**: `DesignTokens.space_grouped_tight.dp`

**Context**:
```
        tokenName.contains("dusk") -> 8.dp
        tokenName.contains("container") -> 8.dp
        tokenName.contains("navigation") -> 4.dp
        tokenName.contains("dropdown") -> 8.dp
        tokenName.contains("modal") -> 16.dp
```

#### Line 229: spacing (high priority)

**Current Value**: `8.dp`
**Suggested Token**: `DesignTokens.space_grouped_normal.dp`

**Context**:
```
        tokenName.contains("container") -> 8.dp
        tokenName.contains("navigation") -> 4.dp
        tokenName.contains("dropdown") -> 8.dp
        tokenName.contains("modal") -> 16.dp
        else -> 4.dp  // Default elevation
```

#### Line 230: spacing (high priority)

**Current Value**: `16.dp`
**Suggested Token**: `DesignTokens.space_related_normal.dp`

**Context**:
```
        tokenName.contains("navigation") -> 4.dp
        tokenName.contains("dropdown") -> 8.dp
        tokenName.contains("modal") -> 16.dp
        else -> 4.dp  // Default elevation
    }
```

#### Line 231: spacing (high priority)

**Current Value**: `4.dp`
**Suggested Token**: `DesignTokens.space_grouped_tight.dp`

**Context**:
```
        tokenName.contains("dropdown") -> 8.dp
        tokenName.contains("modal") -> 16.dp
        else -> 4.dp  // Default elevation
    }
}
```

#### Line 285: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
 * 
 * Converts layering prop value to Compose elevation Dp using elevation tokens.
 * Returns 0.dp if layering is null.
 * 
 * On Android, elevation tokens handle both stacking order and shadow rendering,
```

#### Line 297: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
 * mapLayeringToElevation(LayeringValue.Modal) // Returns elevationModal
 * mapLayeringToElevation(LayeringValue.Navigation) // Returns elevationNavigation
 * mapLayeringToElevation(null) // Returns 0.dp
 * ```
 * 
```

#### Line 304: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
fun mapLayeringToElevation(layering: LayeringValue?): Dp {
    return when (layering) {
        null -> 0.dp
        LayeringValue.Container -> elevationContainer
        LayeringValue.Navigation -> elevationNavigation
```

#### Line 347: spacing (high priority)

**Current Value**: `050.dp`
**Suggested Token**: `DesignTokens.space_sectioned_loose.dp (No exact match for 50. Closest: space.sectioned.loose (48))`

**Context**:
```

// Radius tokens
private val radius050: Dp = DesignTokens.radius_050.dp
private val radius100: Dp = DesignTokens.radius_100.dp
private val radius200: Dp = DesignTokens.radius_200.dp
```

#### Line 348: spacing (high priority)

**Current Value**: `100.dp`
**Suggested Token**: `DesignTokens.space_sectioned_loose.dp (No exact match for 100. Closest: space.sectioned.loose (48))`

**Context**:
```
// Radius tokens
private val radius050: Dp = DesignTokens.radius_050.dp
private val radius100: Dp = DesignTokens.radius_100.dp
private val radius200: Dp = DesignTokens.radius_200.dp

```

#### Line 349: spacing (high priority)

**Current Value**: `200.dp`
**Suggested Token**: `DesignTokens.space_sectioned_loose.dp (No exact match for 200. Closest: space.sectioned.loose (48))`

**Context**:
```
private val radius050: Dp = DesignTokens.radius_050.dp
private val radius100: Dp = DesignTokens.radius_100.dp
private val radius200: Dp = DesignTokens.radius_200.dp

// Elevation tokens (layering - Android-specific)
```

### Container (android)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Container/platforms/android/__tests__/Container.android.kt`
**Violations**: 0

### Icon (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Icon/platforms/web/Icon.web.ts`
**Violations**: 0

### Icon (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Icon/platforms/web/__tests__/Icon.accessibility.test.ts`
**Violations**: 0

### Icon (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Icon/platforms/web/__tests__/Icon.backward-compatibility.test.ts`
**Violations**: 0

### Icon (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Icon/platforms/web/__tests__/Icon.buttonCTA-integration.test.ts`
**Violations**: 0

### Icon (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Icon/platforms/web/__tests__/Icon.lifecycle.test.ts`
**Violations**: 0

### Icon (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Icon/platforms/web/__tests__/Icon.rendering.test.ts`
**Violations**: 0

### Icon (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Icon/platforms/web/__tests__/Icon.stylesheet.test.ts`
**Violations**: 0

### Icon (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Icon/platforms/web/__tests__/Icon.web.test.ts`
**Violations**: 0

### Icon (ios)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Icon/platforms/ios/Icon.ios.swift`
**Violations**: 0

### Icon (android)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Icon/platforms/android/Icon.android.kt`
**Violations**: 0

### TextInputField (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/TextInputField/platforms/web/TextInputField.browser.ts`
**Violations**: 0

### TextInputField (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/TextInputField/platforms/web/TextInputField.web.ts`
**Violations**: 0

### TextInputField (ios)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/TextInputField/platforms/ios/TextInputField.ios.swift`
**Violations**: 3

#### Line 370: spacing (high priority)

**Current Value**: `? 1 : 0`
**Suggested Token**: `Remove fallback - fail loudly when token missing`
**⚠️ Fallback Pattern**: This uses a hard-coded fallback value

**Context**:
```
                    .stroke(accessibilityFocusColor, lineWidth: accessibilityFocusWidth)
                    .padding(-accessibilityFocusOffset)
                    .opacity(isFocused ? 1 : 0)
                    .animation(
                        reduceMotion ? .none : .easeInOut(duration: duration150),
```

#### Line 372: motion (medium priority)

**Current Value**: `150`
**Suggested Token**: `motionFocus`

**Context**:
```
                    .opacity(isFocused ? 1 : 0)
                    .animation(
                        reduceMotion ? .none : .easeInOut(duration: duration150),
                        value: isFocused
                    )
```

#### Line 430: motion (medium priority)

**Current Value**: `150`
**Suggested Token**: `motionFocus`

**Context**:
```

// Duration tokens - primitive tokens (generated by build system)
private let duration150: TimeInterval // duration150 (150ms) - Fast interactions (focus states)

// Border tokens - primitive tokens (generated by build system)
```

### TextInputField (android)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/TextInputField/platforms/android/TextInputField.android.kt`
**Violations**: 4

#### Line 170: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
        } else {
            // Center inside input
            0.dp
        },
        animationSpec = animationSpec,
```

#### Line 257: spacing (high priority)

**Current Value**: `150.dp`
**Suggested Token**: `DesignTokens.space_sectioned_loose.dp (No exact match for 150. Closest: space.sectioned.loose (48))`

**Context**:
```
                    .background(
                        color = colorBackground,
                        shape = RoundedCornerShape(radius150.dp)
                    )
                    .border(
```

#### Line 262: spacing (high priority)

**Current Value**: `150.dp`
**Suggested Token**: `DesignTokens.space_sectioned_loose.dp (No exact match for 150. Closest: space.sectioned.loose (48))`

**Context**:
```
                        width = borderDefault.dp,
                        color = borderColor,
                        shape = RoundedCornerShape(radius150.dp)
                    )
                    // Focus ring for keyboard navigation (WCAG 2.4.7 Focus Visible)
```

#### Line 271: spacing (high priority)

**Current Value**: `150.dp`
**Suggested Token**: `DesignTokens.space_sectioned_loose.dp (No exact match for 150. Closest: space.sectioned.loose (48))`

**Context**:
```
                                width = accessibilityFocusWidth.dp,
                                color = accessibilityFocusColor,
                                shape = RoundedCornerShape(radius150.dp)
                            )
                            .padding(accessibilityFocusOffset.dp)
```

