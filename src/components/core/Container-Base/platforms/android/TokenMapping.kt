/**
 * Token-to-Compose Mapping Functions for Container-Base
 * 
 * Converts Container-Base component props to Jetpack Compose values that reference
 * design system tokens. These functions handle the translation from platform-agnostic
 * token names to Android-specific Compose types (Dp, Color, Shape, etc.).
 * 
 * Token Resolution:
 * - Input: Token name (e.g., 'color.primary', 'shadow.container')
 * - Output: Compose type (Color, Dp, Shape, etc.)
 * 
 * Note: This file contains placeholder implementations that will be replaced
 * by actual token lookups from generated Kotlin constants when the token
 * generation system is complete.
 * 
 * Ported from: src/components/core/Container/platforms/android/TokenMapping.kt
 * @see .kiro/specs/010-container-component/design.md for token consumption strategy
 * @see Requirements 2.1-2.5, 3.1-3.3, 4.1-4.3, 5.1-5.3, 6.1-6.3, 7.1-7.3, 8.1-8.4, 9.1-9.6
 */

package com.designerpunk.components.core

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

// MARK: - Padding Mapping

/**
 * Map padding value to Compose Dp
 * 
 * Converts padding prop value to Dp using space.inset tokens.
 * Returns 0.dp for PaddingValue.None.
 * 
 * @param padding Padding prop value
 * @return Dp value for padding
 * 
 * @example
 * ```kotlin
 * mapPaddingToDp(PaddingValue.P200) // Returns spaceInset200
 * mapPaddingToDp(PaddingValue.None) // Returns 0.dp
 * ```
 * 
 * @see Requirements 2.1, 3.1-3.7
 */
fun mapPaddingToDp(padding: PaddingValue): Dp {
    return when (padding) {
        PaddingValue.None -> 0.dp
        PaddingValue.P050 -> spaceInset050
        PaddingValue.P100 -> spaceInset100
        PaddingValue.P150 -> spaceInset150
        PaddingValue.P200 -> spaceInset200
        PaddingValue.P300 -> spaceInset300
        PaddingValue.P400 -> spaceInset400
    }
}

// MARK: - Border Mapping

/**
 * Map border value to Compose Dp width
 * 
 * Converts border prop value to Dp using border width tokens.
 * Returns 0.dp for BorderValue.None.
 * 
 * @param border Border prop value
 * @return Border width as Dp
 * 
 * @example
 * ```kotlin
 * mapBorderToWidth(BorderValue.Default) // Returns borderDefault
 * mapBorderToWidth(BorderValue.None) // Returns 0.dp
 * ```
 * 
 * @see Requirements 2.4, 6.1-6.5
 */
fun mapBorderToWidth(border: BorderValue): Dp {
    return when (border) {
        BorderValue.None -> 0.dp
        BorderValue.Default -> borderDefault
        BorderValue.Emphasis -> borderEmphasis
        BorderValue.Heavy -> borderHeavy
    }
}

/**
 * Get border color from token
 * 
 * Returns the color.border token value for border styling.
 * This is a constant color used for all borders.
 * 
 * @return Border color as Compose Color
 * 
 * @example
 * ```kotlin
 * getBorderColor() // Returns color.border token value
 * ```
 * 
 * @see Requirements 6.5
 */
fun getBorderColor(): Color {
    return colorBorder
}

// MARK: - Border Radius Mapping

/**
 * Get RoundedCornerShape from border radius value
 * 
 * Converts borderRadius prop value to RoundedCornerShape using radius tokens.
 * Returns RoundedCornerShape(0.dp) for BorderRadiusValue.None.
 * 
 * @param borderRadius Border radius prop value
 * @return RoundedCornerShape for the border radius
 * 
 * @example
 * ```kotlin
 * getRoundedCornerShape(BorderRadiusValue.Normal) // Returns RoundedCornerShape(radius100)
 * getRoundedCornerShape(BorderRadiusValue.None) // Returns RoundedCornerShape(0.dp)
 * ```
 * 
 * @see Requirements 2.5, 7.1-7.4
 */
fun getRoundedCornerShape(borderRadius: BorderRadiusValue): RoundedCornerShape {
    val radius = when (borderRadius) {
        BorderRadiusValue.None -> 0.dp
        BorderRadiusValue.Tight -> radius050
        BorderRadiusValue.Normal -> radius100
        BorderRadiusValue.Loose -> radius200
    }
    return RoundedCornerShape(radius)
}

// MARK: - Color Mapping

/**
 * Resolve color token name to Compose Color
 * 
 * Converts color token name to Compose Color.
 * Returns Color.Transparent if token name is null or empty.
 * 
 * Token Resolution:
 * - Uses generated token constants from DesignTokens
 * - Defaults to colorCanvas (white100) for invalid token names
 * - Returns Color.Transparent for null/empty input
 * 
 * Note: Tokens regenerated Dec 18, 2025 to include color.canvas (Task 8.1) and all semantic tokens.
 * See dist/DesignTokens.android.kt for complete list of generated tokens.
 * 
 * @param tokenName Color token name (e.g., "color.primary")
 * @return Compose Color
 * 
 * @example
 * ```kotlin
 * resolveColorToken("color.primary") // Returns primary color
 * resolveColorToken("color.surface") // Returns surface color
 * resolveColorToken(null) // Returns Color.Transparent
 * resolveColorToken("invalid") // Returns colorCanvas (white100)
 * ```
 * 
 * @see Requirements 2.2, 4.1-4.4
 * @see Confirmed Actions: A1, M3 (Escalate - requires color.canvas token)
 */
fun resolveColorToken(tokenName: String?): Color {
    if (tokenName.isNullOrEmpty()) {
        return Color.Transparent
    }
    
    // Use generated token constants from DesignTokens
    return when (tokenName) {
        "color.primary" -> colorPrimary
        "color.surface" -> colorSurface
        "color.background" -> colorBackground
        "color.error.strong" -> colorErrorStrong
        "color.error.subtle" -> colorErrorSubtle
        "color.success.strong" -> colorSuccessStrong
        "color.success.subtle" -> colorSuccessSubtle
        "color.warning.strong" -> colorWarningStrong
        "color.warning.subtle" -> colorWarningSubtle
        "color.info.strong" -> colorInfoStrong
        "color.info.subtle" -> colorInfoSubtle
        "color.canvas" -> colorCanvas  // New token (white100)
        "color.border" -> colorBorder
        "color.text.default" -> colorTextDefault
        "color.text.muted" -> colorTextMuted
        "color.text.subtle" -> colorTextSubtle
        "color.contrast.onPrimary" -> colorContrastOnPrimary
        "color.icon.default" -> colorIconDefault
        else -> colorCanvas  // Default to canvas (white100)
    }
}

// MARK: - Shadow Mapping

/**
 * Resolve shadow token to elevation Dp
 * 
 * Converts shadow token name to Compose elevation Dp.
 * Returns 0.dp if token name is null or empty.
 * 
 * On Android, elevation handles both stacking order and shadow rendering.
 * This function maps shadow tokens to appropriate elevation values.
 * 
 * Note: This is a placeholder implementation. The actual implementation
 * will use generated token constants from the build system.
 * 
 * @param tokenName Shadow token name (e.g., "shadow.container")
 * @return Elevation value as Dp
 * 
 * @example
 * ```kotlin
 * mapShadowToElevation("shadow.container") // Returns shadowContainerElevation
 * mapShadowToElevation("shadow.modal") // Returns shadowModalElevation
 * mapShadowToElevation(null) // Returns 0.dp
 * ```
 * 
 * @see Requirements 2.3, 5.1-5.4
 */
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

// MARK: - Opacity Mapping

/**
 * Resolve opacity token name to Float
 * 
 * Converts opacity token name to Float value (0.0 to 1.0).
 * Returns 1.0f (fully opaque) if token name is null or empty.
 * 
 * Token Resolution:
 * - Uses generated token constants from DesignTokens
 * - Defaults to opacitySubtle (0.88f) for invalid token names
 * - Returns 1.0f for null/empty input
 * 
 * Note: Tokens regenerated Dec 18, 2025 to include semantic opacity tokens.
 * Semantic tokens map to primitives: opacity.subtle→opacity1100, opacity.medium→opacity900,
 * opacity.heavy→opacity600, opacity.ghost→opacity400.
 * 
 * @param tokenName Opacity token name (e.g., "opacity.subtle")
 * @return Opacity value as Float (0.0 to 1.0)
 * 
 * @example
 * ```kotlin
 * resolveOpacityToken("opacity.subtle") // Returns 0.88f (opacity1100)
 * resolveOpacityToken("opacity.ghost") // Returns 0.32f (opacity400)
 * resolveOpacityToken(null) // Returns 1.0f
 * resolveOpacityToken("invalid") // Returns 0.88f (opacity.subtle)
 * ```
 * 
 * @see Requirements 8.1-8.4
 * @see Confirmed Actions: M5 (Use opacity.subtle as default)
 */
fun resolveOpacityToken(tokenName: String?): Float {
    if (tokenName.isNullOrEmpty()) {
        return 1.0f
    }
    
    // Use generated token constants from DesignTokens
    return when (tokenName) {
        "opacity.subtle" -> opacitySubtle    // Maps to opacity1100 (0.88f)
        "opacity.medium" -> opacityMedium    // Maps to opacity900 (0.72f)
        "opacity.heavy" -> opacityHeavy      // Maps to opacity600 (0.48f)
        "opacity.ghost" -> opacityGhost      // Maps to opacity400 (0.32f)
        else -> opacitySubtle  // Default to opacity.subtle (0.88f)
    }
}

// MARK: - Layering Mapping

/**
 * Map layering value to elevation Dp
 * 
 * Converts layering prop value to Compose elevation Dp using elevation tokens.
 * Returns 0.dp if layering is null.
 * 
 * On Android, elevation tokens handle both stacking order and shadow rendering,
 * following Material Design guidelines.
 * 
 * @param layering Layering prop value
 * @return Elevation value as Dp
 * 
 * @example
 * ```kotlin
 * mapLayeringToElevation(LayeringValue.Modal) // Returns elevationModal
 * mapLayeringToElevation(LayeringValue.Navigation) // Returns elevationNavigation
 * mapLayeringToElevation(null) // Returns 0.dp
 * ```
 * 
 * @see Requirements 9.1-9.9
 */
fun mapLayeringToElevation(layering: LayeringValue?): Dp {
    return when (layering) {
        null -> 0.dp
        LayeringValue.Container -> elevationContainer
        LayeringValue.Navigation -> elevationNavigation
        LayeringValue.Dropdown -> elevationDropdown
        LayeringValue.Modal -> elevationModal
        LayeringValue.Toast -> elevationToast
        LayeringValue.Tooltip -> elevationTooltip
    }
}

// MARK: - Token Constants (Placeholders)

/**
 * Token constants
 * 
 * These are placeholders that will be replaced by generated token constants
 * from the build system. The actual values will come from:
 * - Space tokens: src/tokens/SpacingTokens.ts
 * - Border tokens: src/tokens/BorderTokens.ts
 * - Radius tokens: src/tokens/RadiusTokens.ts
 * - Elevation tokens: src/tokens/semantic/LayeringTokens.ts (Android-specific)
 * - Color tokens: src/tokens/semantic/ColorTokens.ts
 * - Opacity tokens: src/tokens/semantic/OpacityTokens.ts
 * - Shadow tokens: src/tokens/semantic/ShadowTokens.ts
 */

// Import DesignTokens for token references
import com.designerpunk.tokens.DesignTokens

// Space.inset tokens (padding) - Dp type (generator handles unit conversion)
private val spaceInset050: Dp = DesignTokens.space_inset_050
private val spaceInset100: Dp = DesignTokens.space_inset_100
private val spaceInset150: Dp = DesignTokens.space_inset_150
private val spaceInset200: Dp = DesignTokens.space_inset_200
private val spaceInset300: Dp = DesignTokens.space_inset_300
private val spaceInset400: Dp = DesignTokens.space_inset_400

// Border tokens - Dp type (generator handles unit conversion)
private val borderDefault: Dp = DesignTokens.border_default
private val borderEmphasis: Dp = DesignTokens.border_emphasis
private val borderHeavy: Dp = DesignTokens.border_heavy

// Radius tokens - Dp type (generator handles unit conversion)
private val radius050: Dp = DesignTokens.radius_050
private val radius100: Dp = DesignTokens.radius_100
private val radius200: Dp = DesignTokens.radius_200

// Elevation tokens (layering - Android-specific)
// On Android, elevation handles both stacking order and shadow rendering
// Dp type (generator handles unit conversion)
private val elevationContainer: Dp = DesignTokens.elevation_container
private val elevationNavigation: Dp = DesignTokens.elevation_navigation
private val elevationDropdown: Dp = DesignTokens.elevation_dropdown
private val elevationModal: Dp = DesignTokens.elevation_modal
private val elevationToast: Dp = DesignTokens.elevation_toast
private val elevationTooltip: Dp = DesignTokens.elevation_tooltip

// Color tokens
// Regenerated Dec 18, 2025 - includes color.canvas (Task 8.1) and all semantic tokens
private val colorBorder: Color = Color(DesignTokens.color_border)
private val colorPrimary: Color = Color(DesignTokens.color_primary)
private val colorSurface: Color = Color(DesignTokens.color_surface)
private val colorBackground: Color = Color(DesignTokens.color_background)
private val colorErrorStrong: Color = Color(DesignTokens.color_error_strong)
private val colorErrorSubtle: Color = Color(DesignTokens.color_error_subtle)
private val colorSuccessStrong: Color = Color(DesignTokens.color_success_strong)
private val colorSuccessSubtle: Color = Color(DesignTokens.color_success_subtle)
private val colorWarningStrong: Color = Color(DesignTokens.color_warning_strong)
private val colorWarningSubtle: Color = Color(DesignTokens.color_warning_subtle)
private val colorInfoStrong: Color = Color(DesignTokens.color_info_strong)
private val colorInfoSubtle: Color = Color(DesignTokens.color_info_subtle)
private val colorCanvas: Color = Color(DesignTokens.color_canvas)  // New in Task 8.1
private val colorTextDefault: Color = Color(DesignTokens.color_text_default)
private val colorTextMuted: Color = Color(DesignTokens.color_text_muted)
private val colorTextSubtle: Color = Color(DesignTokens.color_text_subtle)
private val colorContrastOnPrimary: Color = Color(DesignTokens.color_contrast_on_primary)
private val colorIconDefault: Color = Color(DesignTokens.color_icon_default)

// Opacity tokens
// Regenerated Dec 18, 2025 - includes all semantic opacity tokens
private val opacitySubtle: Float = DesignTokens.opacity_subtle    // Maps to opacity1100 (0.88f)
private val opacityMedium: Float = DesignTokens.opacity_medium    // Maps to opacity900 (0.72f)
private val opacityHeavy: Float = DesignTokens.opacity_heavy      // Maps to opacity600 (0.48f)
private val opacityGhost: Float = DesignTokens.opacity_ghost      // Maps to opacity400 (0.32f)
