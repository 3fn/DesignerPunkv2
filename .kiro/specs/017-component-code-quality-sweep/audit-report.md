# Component Token Audit Report

**Date**: 2025-12-10
**Total Components Audited**: 28
**Total Violations Found**: 129

## Violations by Type

- **Color**: 35
- **Spacing**: 92
- **Motion**: 2
- **Typography**: 0

## Violations by Priority

- **High** (Colors, Spacing): 127
- **Medium** (Motion): 2
- **Low** (Edge Cases): 0

## Component Details

### ButtonCTA (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/ButtonCTA/platforms/web/ButtonCTA.web.ts`
**Violations**: 1

#### Line 249: spacing (high priority)

**Current Value**: `? 32 : 24`
**Suggested Token**: `Remove fallback - fail loudly when token missing`
**⚠️ Fallback Pattern**: This uses a hard-coded fallback value

**Context**:
```
    
    // Generate icon HTML if icon prop provided
    const iconSize = size === 'large' ? 32 : 24;
    const iconHTML = icon ? createIcon({ 
      name: icon as any, // Type assertion since IconName is from Icon types
```

### ButtonCTA (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/ButtonCTA/platforms/web/__tests__/ButtonCTA.icon-integration.test.ts`
**Violations**: 0

### ButtonCTA (ios)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/ButtonCTA/platforms/ios/ButtonCTA.ios.swift`
**Violations**: 8

#### Line 194: spacing (high priority)

**Current Value**: `? 0.97 : 1.0`
**Suggested Token**: `Remove fallback - fail loudly when token missing`
**⚠️ Fallback Pattern**: This uses a hard-coded fallback value

**Context**:
```
        .buttonStyle(PlainButtonStyle())
        // Requirement 17.2: Scale transform to 0.97 (97%) on press with 100ms ease-out animation
        .scaleEffect(isPressed ? 0.97 : 1.0)
        .animation(.easeOut(duration: 0.1), value: isPressed)
        // Track pressed state for scale transform
```

#### Line 195: motion (medium priority)

**Current Value**: `0.1`
**Suggested Token**: `motion100 (primitive - consider semantic alternative)`

**Context**:
```
        // Requirement 17.2: Scale transform to 0.97 (97%) on press with 100ms ease-out animation
        .scaleEffect(isPressed ? 0.97 : 1.0)
        .animation(.easeOut(duration: 0.1), value: isPressed)
        // Track pressed state for scale transform
        .simultaneousGesture(
```

#### Line 284: spacing (high priority)

**Current Value**: `44`
**Suggested Token**: `spaceSectionedNormal (No exact match for 44. Closest: space.sectioned.normal (40))`

**Context**:
```
    /// 
    /// Implements WCAG 2.1 AA touch target requirements:
    /// - Small (40px visual): Extended to 44px touch target via .frame(minHeight: 44)
    /// - Medium (48px): Meets 44px minimum naturally
    /// - Large (56px): Exceeds 44px minimum
```

#### Line 330: color (high priority)

**Current Value**: `Color(red: 0.404, green: 0.314, blue: 0.643)`
**Suggested Token**: `colorPrimary or appropriate semantic color token`

**Context**:
```
        switch style {
        case .primary:
            return Color(red: 0.404, green: 0.314, blue: 0.643) // color.primary (#6750A4)
        case .secondary:
            return Color(red: 1.0, green: 1.0, blue: 1.0) // color.background (white)
```

#### Line 332: color (high priority)

**Current Value**: `Color(red: 1.0, green: 1.0, blue: 1.0)`
**Suggested Token**: `colorPrimary or appropriate semantic color token`

**Context**:
```
            return Color(red: 0.404, green: 0.314, blue: 0.643) // color.primary (#6750A4)
        case .secondary:
            return Color(red: 1.0, green: 1.0, blue: 1.0) // color.background (white)
        case .tertiary:
            return Color.clear // transparent
```

#### Line 345: color (high priority)

**Current Value**: `Color(red: 0.404, green: 0.314, blue: 0.643)`
**Suggested Token**: `colorPrimary or appropriate semantic color token`

**Context**:
```
            return Color.white // color.text.onPrimary
        case .secondary, .tertiary:
            return Color(red: 0.404, green: 0.314, blue: 0.643) // color.primary
        }
    }
```

#### Line 356: color (high priority)

**Current Value**: `Color(red: 0.404, green: 0.314, blue: 0.643)`
**Suggested Token**: `colorPrimary or appropriate semantic color token`

**Context**:
```
            return Color.clear // No border
        case .secondary:
            return Color(red: 0.404, green: 0.314, blue: 0.643) // color.primary
        }
    }
```

#### Line 382: color (high priority)

**Current Value**: `Color(red: 0.506, green: 0.424, blue: 0.722)`
**Suggested Token**: `colorPrimary or appropriate semantic color token`

**Context**:
```
            // Optical balance: 20% lighter for visual weight compensation
            // color.icon.opticalBalance = blend200 with BlendDirection.LIGHTER
            return Color(red: 0.506, green: 0.424, blue: 0.722) // Lightened primary color
        }
    }
```

### ButtonCTA (android)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/ButtonCTA/platforms/android/ButtonCTA.android.kt`
**Violations**: 0

### Container (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Container/platforms/web/Container.web.ts`
**Violations**: 3

#### Line 47: spacing (high priority)

**Current Value**: `2px`
**Suggested Token**: `var(--space-grouped-minimal)`

**Context**:
```
  .container:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  
```

#### Line 56: spacing (high priority)

**Current Value**: `2px`
**Suggested Token**: `var(--space-grouped-minimal)`

**Context**:
```
  .container:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  
```

#### Line 68: spacing (high priority)

**Current Value**: `2px`
**Suggested Token**: `var(--space-grouped-minimal)`

**Context**:
```
  @media (prefers-contrast: high) {
    .container {
      border-width: 2px;
    }
  }
```

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
**Violations**: 44

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

#### Line 40: spacing (high priority)

**Current Value**: `16.dp`
**Suggested Token**: `DesignTokens.space_related_normal.dp`

**Context**:
```
 * @example
 * ```kotlin
 * mapPaddingToDp(PaddingValue.P200) // Returns 16.dp
 * mapPaddingToDp(PaddingValue.None) // Returns 0.dp
 * ```
```

#### Line 41: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
 * ```kotlin
 * mapPaddingToDp(PaddingValue.P200) // Returns 16.dp
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

#### Line 71: spacing (high priority)

**Current Value**: `1.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 1. Closest: space.grouped.minimal (2))`

**Context**:
```
 * @example
 * ```kotlin
 * mapBorderToWidth(BorderValue.Default) // Returns 1.dp
 * mapBorderToWidth(BorderValue.None) // Returns 0.dp
 * ```
```

#### Line 72: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
 * ```kotlin
 * mapBorderToWidth(BorderValue.Default) // Returns 1.dp
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

#### Line 118: spacing (high priority)

**Current Value**: `8.dp`
**Suggested Token**: `DesignTokens.space_grouped_normal.dp`

**Context**:
```
 * @example
 * ```kotlin
 * getRoundedCornerShape(BorderRadiusValue.Normal) // Returns RoundedCornerShape(8.dp)
 * getRoundedCornerShape(BorderRadiusValue.None) // Returns RoundedCornerShape(0.dp)
 * ```
```

#### Line 119: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
 * ```kotlin
 * getRoundedCornerShape(BorderRadiusValue.Normal) // Returns RoundedCornerShape(8.dp)
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

#### Line 196: spacing (high priority)

**Current Value**: `8.dp`
**Suggested Token**: `DesignTokens.space_grouped_normal.dp`

**Context**:
```
 * @example
 * ```kotlin
 * mapShadowToElevation("shadow.container") // Returns 8.dp
 * mapShadowToElevation("shadow.modal") // Returns 16.dp
 * mapShadowToElevation(null) // Returns 0.dp
```

#### Line 197: spacing (high priority)

**Current Value**: `16.dp`
**Suggested Token**: `DesignTokens.space_related_normal.dp`

**Context**:
```
 * ```kotlin
 * mapShadowToElevation("shadow.container") // Returns 8.dp
 * mapShadowToElevation("shadow.modal") // Returns 16.dp
 * mapShadowToElevation(null) // Returns 0.dp
 * ```
```

#### Line 198: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
 * mapShadowToElevation("shadow.container") // Returns 8.dp
 * mapShadowToElevation("shadow.modal") // Returns 16.dp
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

#### Line 295: spacing (high priority)

**Current Value**: `16.dp`
**Suggested Token**: `DesignTokens.space_related_normal.dp`

**Context**:
```
 * @example
 * ```kotlin
 * mapLayeringToElevation(LayeringValue.Modal) // Returns 16.dp
 * mapLayeringToElevation(LayeringValue.Navigation) // Returns 4.dp
 * mapLayeringToElevation(null) // Returns 0.dp
```

#### Line 296: spacing (high priority)

**Current Value**: `4.dp`
**Suggested Token**: `DesignTokens.space_grouped_tight.dp`

**Context**:
```
 * ```kotlin
 * mapLayeringToElevation(LayeringValue.Modal) // Returns 16.dp
 * mapLayeringToElevation(LayeringValue.Navigation) // Returns 4.dp
 * mapLayeringToElevation(null) // Returns 0.dp
 * ```
```

#### Line 297: spacing (high priority)

**Current Value**: `0.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 0. Closest: space.grouped.minimal (2))`

**Context**:
```
 * mapLayeringToElevation(LayeringValue.Modal) // Returns 16.dp
 * mapLayeringToElevation(LayeringValue.Navigation) // Returns 4.dp
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

#### Line 339: spacing (high priority)

**Current Value**: `1.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp (No exact match for 1. Closest: space.grouped.minimal (2))`

**Context**:
```

// Border tokens
private val borderDefault: Dp = 1.dp   // 1dp
private val borderEmphasis: Dp = 2.dp  // 2dp
private val borderHeavy: Dp = 4.dp     // 4dp
```

#### Line 340: spacing (high priority)

**Current Value**: `2.dp`
**Suggested Token**: `DesignTokens.space_grouped_minimal.dp`

**Context**:
```
// Border tokens
private val borderDefault: Dp = 1.dp   // 1dp
private val borderEmphasis: Dp = 2.dp  // 2dp
private val borderHeavy: Dp = 4.dp     // 4dp

```

#### Line 341: spacing (high priority)

**Current Value**: `4.dp`
**Suggested Token**: `DesignTokens.space_grouped_tight.dp`

**Context**:
```
private val borderDefault: Dp = 1.dp   // 1dp
private val borderEmphasis: Dp = 2.dp  // 2dp
private val borderHeavy: Dp = 4.dp     // 4dp

// Radius tokens
```

#### Line 344: spacing (high priority)

**Current Value**: `4.dp`
**Suggested Token**: `DesignTokens.space_grouped_tight.dp`

**Context**:
```

// Radius tokens
private val radius050: Dp = 4.dp   // 4dp
private val radius100: Dp = 8.dp   // 8dp
private val radius200: Dp = 16.dp  // 16dp
```

#### Line 345: spacing (high priority)

**Current Value**: `8.dp`
**Suggested Token**: `DesignTokens.space_grouped_normal.dp`

**Context**:
```
// Radius tokens
private val radius050: Dp = 4.dp   // 4dp
private val radius100: Dp = 8.dp   // 8dp
private val radius200: Dp = 16.dp  // 16dp

```

#### Line 346: spacing (high priority)

**Current Value**: `16.dp`
**Suggested Token**: `DesignTokens.space_related_normal.dp`

**Context**:
```
private val radius050: Dp = 4.dp   // 4dp
private val radius100: Dp = 8.dp   // 8dp
private val radius200: Dp = 16.dp  // 16dp

// Elevation tokens (layering - Android-specific)
```

#### Line 350: spacing (high priority)

**Current Value**: `8.dp`
**Suggested Token**: `DesignTokens.space_grouped_normal.dp`

**Context**:
```
// Elevation tokens (layering - Android-specific)
// On Android, elevation handles both stacking order and shadow rendering
private val elevationContainer: Dp = 8.dp    // elevation.container
private val elevationNavigation: Dp = 4.dp   // elevation.navigation
private val elevationDropdown: Dp = 8.dp     // elevation.dropdown
```

#### Line 351: spacing (high priority)

**Current Value**: `4.dp`
**Suggested Token**: `DesignTokens.space_grouped_tight.dp`

**Context**:
```
// On Android, elevation handles both stacking order and shadow rendering
private val elevationContainer: Dp = 8.dp    // elevation.container
private val elevationNavigation: Dp = 4.dp   // elevation.navigation
private val elevationDropdown: Dp = 8.dp     // elevation.dropdown
private val elevationModal: Dp = 16.dp       // elevation.modal
```

#### Line 352: spacing (high priority)

**Current Value**: `8.dp`
**Suggested Token**: `DesignTokens.space_grouped_normal.dp`

**Context**:
```
private val elevationContainer: Dp = 8.dp    // elevation.container
private val elevationNavigation: Dp = 4.dp   // elevation.navigation
private val elevationDropdown: Dp = 8.dp     // elevation.dropdown
private val elevationModal: Dp = 16.dp       // elevation.modal
private val elevationToast: Dp = 24.dp       // elevation.toast
```

#### Line 353: spacing (high priority)

**Current Value**: `16.dp`
**Suggested Token**: `DesignTokens.space_related_normal.dp`

**Context**:
```
private val elevationNavigation: Dp = 4.dp   // elevation.navigation
private val elevationDropdown: Dp = 8.dp     // elevation.dropdown
private val elevationModal: Dp = 16.dp       // elevation.modal
private val elevationToast: Dp = 24.dp       // elevation.toast
private val elevationTooltip: Dp = 24.dp     // elevation.tooltip
```

#### Line 354: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
private val elevationDropdown: Dp = 8.dp     // elevation.dropdown
private val elevationModal: Dp = 16.dp       // elevation.modal
private val elevationToast: Dp = 24.dp       // elevation.toast
private val elevationTooltip: Dp = 24.dp     // elevation.tooltip

```

#### Line 355: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
private val elevationModal: Dp = 16.dp       // elevation.modal
private val elevationToast: Dp = 24.dp       // elevation.toast
private val elevationTooltip: Dp = 24.dp     // elevation.tooltip

// Color tokens
```

#### Line 358: color (high priority)

**Current Value**: `Color(0xFFE5E7EB)`
**Suggested Token**: `DesignTokens.color_primary or appropriate semantic color token`

**Context**:
```

// Color tokens
private val colorBorder: Color = Color(0xFFE5E7EB)

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
**Violations**: 1

#### Line 220: spacing (high priority)

**Current Value**: `? 32 : 24`
**Suggested Token**: `Remove fallback - fail loudly when token missing`
**⚠️ Fallback Pattern**: This uses a hard-coded fallback value

**Context**:
```
      const buttonIcon = 'arrow-right';
      const buttonSize = 'medium' as 'small' | 'medium' | 'large';
      const iconSize: IconSize = buttonSize === 'large' ? 32 : 24;
      
      const iconHTML = createIcon({ 
```

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
**Violations**: 1

#### Line 165: spacing (high priority)

**Current Value**: `8px`
**Suggested Token**: `var(--space-grouped-normal)`

**Context**:
```
      // Check that style attribute is present with converted kebab-case properties
      expect(result).toContain('style="');
      expect(result).toContain('margin-right: 8px');
      expect(result).toContain('color: blue');
    });
```

### Icon (ios)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Icon/platforms/ios/Icon.ios.swift`
**Violations**: 0

### Icon (android)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Icon/platforms/android/Icon.android.kt`
**Violations**: 32

#### Line 22: spacing (high priority)

**Current Value**: `16.dp`
**Suggested Token**: `DesignTokens.space_related_normal.dp`

**Context**:
```
 * 
 * @param name Icon name (e.g., "arrow-right", "check", "settings")
 * @param size Icon size in Dp (16.dp, 24.dp, 32.dp, 40.dp)
 * @param color Optional color override for optical weight compensation (null = inherit)
 * @param modifier Optional modifier for additional styling
```

#### Line 22: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
 * 
 * @param name Icon name (e.g., "arrow-right", "check", "settings")
 * @param size Icon size in Dp (16.dp, 24.dp, 32.dp, 40.dp)
 * @param color Optional color override for optical weight compensation (null = inherit)
 * @param modifier Optional modifier for additional styling
```

#### Line 22: spacing (high priority)

**Current Value**: `32.dp`
**Suggested Token**: `DesignTokens.space_separated_loose.dp`

**Context**:
```
 * 
 * @param name Icon name (e.g., "arrow-right", "check", "settings")
 * @param size Icon size in Dp (16.dp, 24.dp, 32.dp, 40.dp)
 * @param color Optional color override for optical weight compensation (null = inherit)
 * @param modifier Optional modifier for additional styling
```

#### Line 22: spacing (high priority)

**Current Value**: `40.dp`
**Suggested Token**: `DesignTokens.space_sectioned_normal.dp`

**Context**:
```
 * 
 * @param name Icon name (e.g., "arrow-right", "check", "settings")
 * @param size Icon size in Dp (16.dp, 24.dp, 32.dp, 40.dp)
 * @param color Optional color override for optical weight compensation (null = inherit)
 * @param modifier Optional modifier for additional styling
```

#### Line 88: spacing (high priority)

**Current Value**: `16.dp`
**Suggested Token**: `DesignTokens.space_related_normal.dp`

**Context**:
```
 * 
 * Demonstrates:
 * - All four size variants (16.dp, 24.dp, 32.dp, 40.dp)
 * - Multiple icon types at standard size
 * - Color inheritance with different tint colors
```

#### Line 88: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
 * 
 * Demonstrates:
 * - All four size variants (16.dp, 24.dp, 32.dp, 40.dp)
 * - Multiple icon types at standard size
 * - Color inheritance with different tint colors
```

#### Line 88: spacing (high priority)

**Current Value**: `32.dp`
**Suggested Token**: `DesignTokens.space_separated_loose.dp`

**Context**:
```
 * 
 * Demonstrates:
 * - All four size variants (16.dp, 24.dp, 32.dp, 40.dp)
 * - Multiple icon types at standard size
 * - Color inheritance with different tint colors
```

#### Line 88: spacing (high priority)

**Current Value**: `40.dp`
**Suggested Token**: `DesignTokens.space_sectioned_normal.dp`

**Context**:
```
 * 
 * Demonstrates:
 * - All four size variants (16.dp, 24.dp, 32.dp, 40.dp)
 * - Multiple icon types at standard size
 * - Color inheritance with different tint colors
```

#### Line 96: spacing (high priority)

**Current Value**: `16.dp`
**Suggested Token**: `DesignTokens.space_related_normal.dp`

**Context**:
```
fun IconPreview() {
    androidx.compose.foundation.layout.Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(16.dp)
    ) {
```

#### Line 99: spacing (high priority)

**Current Value**: `16.dp`
**Suggested Token**: `DesignTokens.space_related_normal.dp`

**Context**:
```
        verticalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(16.dp)
    ) {
        // Different sizes (16.dp, 24.dp, 32.dp, 40.dp)
        androidx.compose.material3.Text(
            text = "Size Variants",
```

#### Line 99: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
        verticalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(16.dp)
    ) {
        // Different sizes (16.dp, 24.dp, 32.dp, 40.dp)
        androidx.compose.material3.Text(
            text = "Size Variants",
```

#### Line 99: spacing (high priority)

**Current Value**: `32.dp`
**Suggested Token**: `DesignTokens.space_separated_loose.dp`

**Context**:
```
        verticalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(16.dp)
    ) {
        // Different sizes (16.dp, 24.dp, 32.dp, 40.dp)
        androidx.compose.material3.Text(
            text = "Size Variants",
```

#### Line 99: spacing (high priority)

**Current Value**: `40.dp`
**Suggested Token**: `DesignTokens.space_sectioned_normal.dp`

**Context**:
```
        verticalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(16.dp)
    ) {
        // Different sizes (16.dp, 24.dp, 32.dp, 40.dp)
        androidx.compose.material3.Text(
            text = "Size Variants",
```

#### Line 108: spacing (high priority)

**Current Value**: `16.dp`
**Suggested Token**: `DesignTokens.space_related_normal.dp`

**Context**:
```
            verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
        ) {
            Icon(name = "arrow-right", size = 16.dp)
            Icon(name = "arrow-right", size = 24.dp)
            Icon(name = "arrow-right", size = 32.dp)
```

#### Line 109: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
        ) {
            Icon(name = "arrow-right", size = 16.dp)
            Icon(name = "arrow-right", size = 24.dp)
            Icon(name = "arrow-right", size = 32.dp)
            Icon(name = "arrow-right", size = 40.dp)
```

#### Line 110: spacing (high priority)

**Current Value**: `32.dp`
**Suggested Token**: `DesignTokens.space_separated_loose.dp`

**Context**:
```
            Icon(name = "arrow-right", size = 16.dp)
            Icon(name = "arrow-right", size = 24.dp)
            Icon(name = "arrow-right", size = 32.dp)
            Icon(name = "arrow-right", size = 40.dp)
        }
```

#### Line 111: spacing (high priority)

**Current Value**: `40.dp`
**Suggested Token**: `DesignTokens.space_sectioned_normal.dp`

**Context**:
```
            Icon(name = "arrow-right", size = 24.dp)
            Icon(name = "arrow-right", size = 32.dp)
            Icon(name = "arrow-right", size = 40.dp)
        }
        
```

#### Line 114: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
        }
        
        // Different icons at standard size (24.dp)
        androidx.compose.material3.Text(
            text = "Icon Variety",
```

#### Line 122: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(16.dp)
        ) {
            Icon(name = "check", size = 24.dp)
            Icon(name = "x", size = 24.dp)
            Icon(name = "plus", size = 24.dp)
```

#### Line 123: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
        ) {
            Icon(name = "check", size = 24.dp)
            Icon(name = "x", size = 24.dp)
            Icon(name = "plus", size = 24.dp)
            Icon(name = "heart", size = 24.dp)
```

#### Line 124: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
            Icon(name = "check", size = 24.dp)
            Icon(name = "x", size = 24.dp)
            Icon(name = "plus", size = 24.dp)
            Icon(name = "heart", size = 24.dp)
            Icon(name = "settings", size = 24.dp)
```

#### Line 125: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
            Icon(name = "x", size = 24.dp)
            Icon(name = "plus", size = 24.dp)
            Icon(name = "heart", size = 24.dp)
            Icon(name = "settings", size = 24.dp)
        }
```

#### Line 126: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
            Icon(name = "plus", size = 24.dp)
            Icon(name = "heart", size = 24.dp)
            Icon(name = "settings", size = 24.dp)
        }
        
```

#### Line 140: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
                horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(16.dp)
            ) {
                Icon(name = "arrow-right", size = 24.dp)
                Icon(name = "check", size = 24.dp)
                Icon(name = "heart", size = 24.dp)
```

#### Line 141: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
            ) {
                Icon(name = "arrow-right", size = 24.dp)
                Icon(name = "check", size = 24.dp)
                Icon(name = "heart", size = 24.dp)
            }
```

#### Line 142: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
                Icon(name = "arrow-right", size = 24.dp)
                Icon(name = "check", size = 24.dp)
                Icon(name = "heart", size = 24.dp)
            }
        }
```

#### Line 154: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(16.dp)
        ) {
            Icon(name = "x", size = 24.dp, color = Color.Red)
            Icon(name = "minus", size = 24.dp, color = Color.Red)
            Icon(name = "circle", size = 24.dp, color = Color.Red)
```

#### Line 155: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
        ) {
            Icon(name = "x", size = 24.dp, color = Color.Red)
            Icon(name = "minus", size = 24.dp, color = Color.Red)
            Icon(name = "circle", size = 24.dp, color = Color.Red)
        }
```

#### Line 156: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
            Icon(name = "x", size = 24.dp, color = Color.Red)
            Icon(name = "minus", size = 24.dp, color = Color.Red)
            Icon(name = "circle", size = 24.dp, color = Color.Red)
        }
        
```

#### Line 167: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(16.dp)
        ) {
            Icon(name = "check", size = 24.dp, color = Color.Green)
            Icon(name = "plus", size = 24.dp, color = Color.Green)
            Icon(name = "arrow-up", size = 24.dp, color = Color.Green)
```

#### Line 168: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
        ) {
            Icon(name = "check", size = 24.dp, color = Color.Green)
            Icon(name = "plus", size = 24.dp, color = Color.Green)
            Icon(name = "arrow-up", size = 24.dp, color = Color.Green)
        }
```

#### Line 169: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
            Icon(name = "check", size = 24.dp, color = Color.Green)
            Icon(name = "plus", size = 24.dp, color = Color.Green)
            Icon(name = "arrow-up", size = 24.dp, color = Color.Green)
        }
    }
```

### TextInputField (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/TextInputField/platforms/web/TextInputField.browser.ts`
**Violations**: 13

#### Line 107: color (high priority)

**Current Value**: `#FFFFFF`
**Suggested Token**: `var(--color-primary) or appropriate semantic color token`

**Context**:
```
          align-items: center;
          min-height: var(--tap-area-recommended, 48px);
          background: var(--color-background, #FFFFFF);
          border: var(--border-default, 1px) solid var(--color-border, #D1D5DB);
          border-radius: var(--radius-150, 12px);
```

#### Line 108: color (high priority)

**Current Value**: `#D1D5DB`
**Suggested Token**: `var(--color-primary) or appropriate semantic color token`

**Context**:
```
          min-height: var(--tap-area-recommended, 48px);
          background: var(--color-background, #FFFFFF);
          border: var(--border-default, 1px) solid var(--color-border, #D1D5DB);
          border-radius: var(--radius-150, 12px);
          padding: var(--space-inset-100, 8px);
```

#### Line 115: color (high priority)

**Current Value**: `#3B82F6`
**Suggested Token**: `var(--color-primary) or appropriate semantic color token`

**Context**:
```

        .input-container.focused {
          border-color: var(--color-primary, #3B82F6);
        }

```

#### Line 119: color (high priority)

**Current Value**: `#EF4444`
**Suggested Token**: `var(--color-primary) or appropriate semantic color token`

**Context**:
```

        .input-container.error {
          border-color: var(--color-error, #EF4444);
          background: rgba(239, 68, 68, 0.05);
        }
```

#### Line 120: color (high priority)

**Current Value**: `rgba(239, 68, 68, 0.05)`
**Suggested Token**: `var(--color-primary) or appropriate semantic color token`

**Context**:
```
        .input-container.error {
          border-color: var(--color-error, #EF4444);
          background: rgba(239, 68, 68, 0.05);
        }

```

#### Line 124: color (high priority)

**Current Value**: `#10B981`
**Suggested Token**: `var(--color-primary) or appropriate semantic color token`

**Context**:
```

        .input-container.success {
          border-color: var(--color-success-strong, #10B981);
        }

```

#### Line 141: color (high priority)

**Current Value**: `#000000`
**Suggested Token**: `var(--color-primary) or appropriate semantic color token`

**Context**:
```
          line-height: var(--typography-input-line-height, 24px);
          font-weight: var(--typography-input-font-weight, 400);
          color: var(--color-text-default, #000000);
          padding: var(--space-grouped-tight, 4px) 0;
        }
```

#### Line 158: color (high priority)

**Current Value**: `#6B7280`
**Suggested Token**: `var(--color-primary) or appropriate semantic color token`

**Context**:
```
          line-height: var(--typography-label-md-line-height, 24px);
          font-weight: var(--typography-label-md-font-weight, 500);
          color: var(--color-text-muted, #6B7280);
          pointer-events: none;
          transition: all var(--motion-float-label-duration, 250ms) var(--motion-float-label-easing, cubic-bezier(0.4, 0.0, 0.2, 1.0));
```

#### Line 169: color (high priority)

**Current Value**: `#3B82F6`
**Suggested Token**: `var(--color-primary) or appropriate semantic color token`

**Context**:
```
          font-size: var(--typography-label-md-float-font-size, 14px);
          line-height: var(--typography-label-md-float-line-height, 20px);
          color: var(--color-primary, #3B82F6);
        }

```

#### Line 173: color (high priority)

**Current Value**: `#EF4444`
**Suggested Token**: `var(--color-primary) or appropriate semantic color token`

**Context**:
```

        .input-container.error label {
          color: var(--color-error, #EF4444);
        }

```

#### Line 189: color (high priority)

**Current Value**: `#6B7280`
**Suggested Token**: `var(--color-primary) or appropriate semantic color token`

**Context**:
```
          font-size: var(--typography-caption-font-size, 13px);
          line-height: var(--typography-caption-line-height, 18px);
          color: var(--color-text-muted, #6B7280);
        }

```

#### Line 193: color (high priority)

**Current Value**: `#EF4444`
**Suggested Token**: `var(--color-primary) or appropriate semantic color token`

**Context**:
```

        .error-message {
          color: var(--color-error, #EF4444);
        }

```

#### Line 197: color (high priority)

**Current Value**: `#3B82F6`
**Suggested Token**: `var(--color-primary) or appropriate semantic color token`

**Context**:
```

        :host(:focus-within) .input-container {
          outline: var(--accessibility-focus-width, 2px) solid var(--accessibility-focus-color, #3B82F6);
          outline-offset: var(--accessibility-focus-offset, 2px);
        }
```

### TextInputField (web)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/TextInputField/platforms/web/TextInputField.web.ts`
**Violations**: 0

### TextInputField (ios)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/TextInputField/platforms/ios/TextInputField.ios.swift`
**Violations**: 10

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
                        reduceMotion ? .none : .easeInOut(duration: 0.15),
```

#### Line 372: motion (medium priority)

**Current Value**: `0.15`
**Suggested Token**: `motionFocus`

**Context**:
```
                    .opacity(isFocused ? 1 : 0)
                    .animation(
                        reduceMotion ? .none : .easeInOut(duration: 0.15),
                        value: isFocused
                    )
```

#### Line 406: color (high priority)

**Current Value**: `Color(red: 107/255, green: 114/255, blue: 128/255)`
**Suggested Token**: `colorPrimary or appropriate semantic color token`

**Context**:
```

// Color tokens
private let colorTextMuted = Color(red: 107/255, green: 114/255, blue: 128/255) // #6B7280
private let colorTextDefault = Color(red: 0/255, green: 0/255, blue: 0/255) // #000000
private let colorPrimary = Color(red: 59/255, green: 130/255, blue: 246/255) // #3B82F6
```

#### Line 407: color (high priority)

**Current Value**: `Color(red: 0/255, green: 0/255, blue: 0/255)`
**Suggested Token**: `colorPrimary or appropriate semantic color token`

**Context**:
```
// Color tokens
private let colorTextMuted = Color(red: 107/255, green: 114/255, blue: 128/255) // #6B7280
private let colorTextDefault = Color(red: 0/255, green: 0/255, blue: 0/255) // #000000
private let colorPrimary = Color(red: 59/255, green: 130/255, blue: 246/255) // #3B82F6
private let colorError = Color(red: 239/255, green: 68/255, blue: 68/255) // #EF4444
```

#### Line 408: color (high priority)

**Current Value**: `Color(red: 59/255, green: 130/255, blue: 246/255)`
**Suggested Token**: `colorPrimary or appropriate semantic color token`

**Context**:
```
private let colorTextMuted = Color(red: 107/255, green: 114/255, blue: 128/255) // #6B7280
private let colorTextDefault = Color(red: 0/255, green: 0/255, blue: 0/255) // #000000
private let colorPrimary = Color(red: 59/255, green: 130/255, blue: 246/255) // #3B82F6
private let colorError = Color(red: 239/255, green: 68/255, blue: 68/255) // #EF4444
private let colorSuccessStrong = Color(red: 16/255, green: 185/255, blue: 129/255) // #10B981
```

#### Line 409: color (high priority)

**Current Value**: `Color(red: 239/255, green: 68/255, blue: 68/255)`
**Suggested Token**: `colorPrimary or appropriate semantic color token`

**Context**:
```
private let colorTextDefault = Color(red: 0/255, green: 0/255, blue: 0/255) // #000000
private let colorPrimary = Color(red: 59/255, green: 130/255, blue: 246/255) // #3B82F6
private let colorError = Color(red: 239/255, green: 68/255, blue: 68/255) // #EF4444
private let colorSuccessStrong = Color(red: 16/255, green: 185/255, blue: 129/255) // #10B981
private let colorBorder = Color(red: 209/255, green: 213/255, blue: 219/255) // #D1D5DB
```

#### Line 410: color (high priority)

**Current Value**: `Color(red: 16/255, green: 185/255, blue: 129/255)`
**Suggested Token**: `colorPrimary or appropriate semantic color token`

**Context**:
```
private let colorPrimary = Color(red: 59/255, green: 130/255, blue: 246/255) // #3B82F6
private let colorError = Color(red: 239/255, green: 68/255, blue: 68/255) // #EF4444
private let colorSuccessStrong = Color(red: 16/255, green: 185/255, blue: 129/255) // #10B981
private let colorBorder = Color(red: 209/255, green: 213/255, blue: 219/255) // #D1D5DB
private let colorBackground = Color(red: 255/255, green: 255/255, blue: 255/255) // #FFFFFF
```

#### Line 411: color (high priority)

**Current Value**: `Color(red: 209/255, green: 213/255, blue: 219/255)`
**Suggested Token**: `colorPrimary or appropriate semantic color token`

**Context**:
```
private let colorError = Color(red: 239/255, green: 68/255, blue: 68/255) // #EF4444
private let colorSuccessStrong = Color(red: 16/255, green: 185/255, blue: 129/255) // #10B981
private let colorBorder = Color(red: 209/255, green: 213/255, blue: 219/255) // #D1D5DB
private let colorBackground = Color(red: 255/255, green: 255/255, blue: 255/255) // #FFFFFF

```

#### Line 412: color (high priority)

**Current Value**: `Color(red: 255/255, green: 255/255, blue: 255/255)`
**Suggested Token**: `colorPrimary or appropriate semantic color token`

**Context**:
```
private let colorSuccessStrong = Color(red: 16/255, green: 185/255, blue: 129/255) // #10B981
private let colorBorder = Color(red: 209/255, green: 213/255, blue: 219/255) // #D1D5DB
private let colorBackground = Color(red: 255/255, green: 255/255, blue: 255/255) // #FFFFFF

// Spacing tokens
```

#### Line 431: color (high priority)

**Current Value**: `Color(red: 59/255, green: 130/255, blue: 246/255)`
**Suggested Token**: `colorPrimary or appropriate semantic color token`

**Context**:
```
private let accessibilityFocusWidth: CGFloat = 2 // Focus ring width
private let accessibilityFocusOffset: CGFloat = 2 // Focus ring offset
private let accessibilityFocusColor = Color(red: 59/255, green: 130/255, blue: 246/255) // #3B82F6

// MARK: - Preview
```

### TextInputField (android)

**File**: `/Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/TextInputField/platforms/android/TextInputField.android.kt`
**Violations**: 16

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

#### Line 335: spacing (high priority)

**Current Value**: `4.dp`
**Suggested Token**: `DesignTokens.space_grouped_tight.dp`

**Context**:
```
                            y = labelOffsetY
                        )
                        .padding(horizontal = 4.dp) // Small padding for better readability
                )
            }
```

#### Line 348: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
                    showErrorIcon -> Icon(
                        name = "x",
                        size = 24.dp,
                        color = colorError
                    )
```

#### Line 353: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
                    showSuccessIcon -> Icon(
                        name = "check",
                        size = 24.dp,
                        color = colorSuccessStrong
                    )
```

#### Line 358: spacing (high priority)

**Current Value**: `24.dp`
**Suggested Token**: `DesignTokens.space_related_loose.dp`

**Context**:
```
                    showInfoIconVisible -> Icon(
                        name = "info",
                        size = 24.dp,
                        color = colorTextMuted
                    )
```

#### Line 439: color (high priority)

**Current Value**: `Color(0xFF6B7280)`
**Suggested Token**: `DesignTokens.color_primary or appropriate semantic color token`

**Context**:
```

// Color tokens
private val colorTextMuted = Color(0xFF6B7280) // #6B7280
private val colorTextDefault = Color(0xFF000000) // #000000
private val colorPrimary = Color(0xFF3B82F6) // #3B82F6
```

#### Line 440: color (high priority)

**Current Value**: `Color(0xFF000000)`
**Suggested Token**: `DesignTokens.color_primary or appropriate semantic color token`

**Context**:
```
// Color tokens
private val colorTextMuted = Color(0xFF6B7280) // #6B7280
private val colorTextDefault = Color(0xFF000000) // #000000
private val colorPrimary = Color(0xFF3B82F6) // #3B82F6
private val colorError = Color(0xFFEF4444) // #EF4444
```

#### Line 441: color (high priority)

**Current Value**: `Color(0xFF3B82F6)`
**Suggested Token**: `DesignTokens.color_primary or appropriate semantic color token`

**Context**:
```
private val colorTextMuted = Color(0xFF6B7280) // #6B7280
private val colorTextDefault = Color(0xFF000000) // #000000
private val colorPrimary = Color(0xFF3B82F6) // #3B82F6
private val colorError = Color(0xFFEF4444) // #EF4444
private val colorSuccessStrong = Color(0xFF10B981) // #10B981
```

#### Line 442: color (high priority)

**Current Value**: `Color(0xFFEF4444)`
**Suggested Token**: `DesignTokens.color_primary or appropriate semantic color token`

**Context**:
```
private val colorTextDefault = Color(0xFF000000) // #000000
private val colorPrimary = Color(0xFF3B82F6) // #3B82F6
private val colorError = Color(0xFFEF4444) // #EF4444
private val colorSuccessStrong = Color(0xFF10B981) // #10B981
private val colorBorder = Color(0xFFD1D5DB) // #D1D5DB
```

#### Line 443: color (high priority)

**Current Value**: `Color(0xFF10B981)`
**Suggested Token**: `DesignTokens.color_primary or appropriate semantic color token`

**Context**:
```
private val colorPrimary = Color(0xFF3B82F6) // #3B82F6
private val colorError = Color(0xFFEF4444) // #EF4444
private val colorSuccessStrong = Color(0xFF10B981) // #10B981
private val colorBorder = Color(0xFFD1D5DB) // #D1D5DB
private val colorBackground = Color(0xFFFFFFFF) // #FFFFFF
```

#### Line 444: color (high priority)

**Current Value**: `Color(0xFFD1D5DB)`
**Suggested Token**: `DesignTokens.color_primary or appropriate semantic color token`

**Context**:
```
private val colorError = Color(0xFFEF4444) // #EF4444
private val colorSuccessStrong = Color(0xFF10B981) // #10B981
private val colorBorder = Color(0xFFD1D5DB) // #D1D5DB
private val colorBackground = Color(0xFFFFFFFF) // #FFFFFF

```

#### Line 445: color (high priority)

**Current Value**: `Color(0xFFFFFFFF)`
**Suggested Token**: `DesignTokens.color_primary or appropriate semantic color token`

**Context**:
```
private val colorSuccessStrong = Color(0xFF10B981) // #10B981
private val colorBorder = Color(0xFFD1D5DB) // #D1D5DB
private val colorBackground = Color(0xFFFFFFFF) // #FFFFFF

// Spacing tokens
```

#### Line 464: color (high priority)

**Current Value**: `Color(0xFF3B82F6)`
**Suggested Token**: `DesignTokens.color_primary or appropriate semantic color token`

**Context**:
```
private const val accessibilityFocusWidth = 2f // Focus ring width
private const val accessibilityFocusOffset = 2f // Focus ring offset
private val accessibilityFocusColor = Color(0xFF3B82F6) // #3B82F6

```

