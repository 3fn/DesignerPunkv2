/**
 * Container Component - Android Jetpack Compose Implementation
 * 
 * Jetpack Compose implementation of the Container component using modifier chains.
 * Provides structural wrapping with individual styling capabilities.
 * 
 * Uses blend utilities for hover state colors instead of opacity workarounds.
 * This ensures cross-platform consistency with Web and iOS implementations.
 * 
 * @see ../../../types.ts for ContainerProps interface
 * @see ../../../tokens.ts for token reference mappings
 * @see .kiro/specs/010-container-component/design.md for complete design documentation
 * @see .kiro/specs/031-blend-infrastructure-implementation for blend utilities
 */

package com.designerpunk.components.core

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.hoverable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsHoveredAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import android.util.Log

// Blend token value for hover state (from semantic blend tokens)
// This matches the CSS custom property: --blend-hover-darker
private const val BLEND_HOVER_DARKER: Float = 0.08f    // blend200

/**
 * Apply darker blend to a Color by overlaying black
 * 
 * @param amount Blend amount as decimal (0.0f-1.0f)
 * @return Darkened Color
 * 
 * @example
 * ```kotlin
 * val hoverColor = Color.Blue.darkerBlend(0.08f)
 * // Returns 8% darker blue
 * ```
 */
fun Color.darkerBlend(amount: Float): Color {
    // Clamp amount to valid range
    val clampedAmount = amount.coerceIn(0.0f, 1.0f)
    
    // Blend with black (0, 0, 0)
    return Color(
        red = this.red * (1 - clampedAmount),
        green = this.green * (1 - clampedAmount),
        blue = this.blue * (1 - clampedAmount),
        alpha = this.alpha
    )
}

/**
 * Container Composable
 * 
 * A foundational primitive component that provides structural wrapping with styling capabilities.
 * Uses Jetpack Compose modifier chains to apply styling based on parameters.
 * 
 * Features:
 * - Padding control via space.inset tokens
 * - Background color via semantic color tokens
 * - Shadow via semantic shadow tokens (or elevation via layering)
 * - Border via border width tokens
 * - Border radius via radius tokens
 * - Opacity via semantic opacity tokens
 * - Layering via elevation tokens (handles both z-order and shadow on Android)
 * - Accessibility content description support
 * - Hover state support via blend utilities (desktop/ChromeOS with pointer)
 * 
 * Android-Specific Behavior:
 * - Elevation tokens handle both stacking order and shadow rendering
 * - If both layering and shadow props are provided, layering takes precedence
 * - Development warning logged when both props are used
 * - Hover state uses darkerBlend for cross-platform consistency
 * 
 * @example
 * ```kotlin
 * // Basic usage
 * Container(padding = PaddingValue.P200, background = "color.surface") {
 *     Text("Content")
 * }
 * 
 * // With multiple styling props
 * Container(
 *     padding = PaddingValue.P300,
 *     background = "color.primary",
 *     shadow = "shadow.container",
 *     borderRadius = BorderRadiusValue.Normal,
 *     layering = LayeringValue.Navigation
 * ) {
 *     Text("Content")
 * }
 * 
 * // With hover state enabled
 * Container(
 *     padding = PaddingValue.P200,
 *     background = "color.surface",
 *     hoverable = true
 * ) {
 *     Text("Hoverable content")
 * }
 * 
 * // With accessibility
 * Container(
 *     padding = PaddingValue.P200,
 *     background = "color.surface",
 *     accessibilityLabel = "Product card"
 * ) {
 *     Text("Content")
 * }
 * ```
 * 
 * @param padding Internal padding for the container (default: PaddingValue.None)
 * @param background Background color token name (default: null)
 * @param shadow Shadow token name (default: null)
 * @param border Border width (default: BorderValue.None)
 * @param borderRadius Border radius (default: BorderRadiusValue.None)
 * @param opacity Opacity token name (default: null)
 * @param layering Layering value for elevation (default: null)
 * @param accessibilityLabel Accessibility content description (default: null)
 * @param hoverable Whether hover state is enabled (default: false)
 * @param modifier Additional Compose modifiers (default: Modifier)
 * @param content Child composable content
 */
@Composable
fun Container(
    padding: PaddingValue = PaddingValue.None,
    background: String? = null,
    shadow: String? = null,
    border: BorderValue = BorderValue.None,
    borderRadius: BorderRadiusValue = BorderRadiusValue.None,
    opacity: String? = null,
    layering: LayeringValue? = null,
    accessibilityLabel: String? = null,
    hoverable: Boolean = false,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    // Android-specific: Check for conflicting layering + shadow props
    if (layering != null && shadow != null) {
        Log.w(
            "Container",
            "Both layering and shadow props provided on Android. " +
            "Android elevation handles both stacking and shadow. " +
            "Using layering prop, shadow prop ignored."
        )
    }
    
    // Set up hover interaction source for hover state tracking
    val interactionSource = remember { MutableInteractionSource() }
    val isHovered by interactionSource.collectIsHoveredAsState()
    
    // Calculate background color with hover state
    val baseBackgroundColor = if (background != null) resolveColorToken(background) else Color.Transparent
    val currentBackgroundColor = if (hoverable && isHovered) {
        baseBackgroundColor.darkerBlend(BLEND_HOVER_DARKER)
    } else {
        baseBackgroundColor
    }
    
    // Build modifier chain with all styling
    val containerModifier = modifier
        .then(
            // Apply hoverable modifier if enabled
            if (hoverable) {
                Modifier.hoverable(interactionSource = interactionSource)
            } else {
                Modifier
            }
        )
        .then(
            // Apply padding
            if (padding != PaddingValue.None) {
                Modifier.padding(mapPaddingToDp(padding))
            } else {
                Modifier
            }
        )
        .then(
            // Apply elevation (handles both z-order and shadow on Android)
            // Layering takes precedence over shadow prop
            when {
                layering != null -> Modifier.shadow(
                    elevation = mapLayeringToElevation(layering),
                    shape = getRoundedCornerShape(borderRadius)
                )
                shadow != null -> Modifier.shadow(
                    elevation = mapShadowToElevation(shadow),
                    shape = getRoundedCornerShape(borderRadius)
                )
                else -> Modifier
            }
        )
        .then(
            // Apply background color (with hover state consideration)
            Modifier.background(
                color = currentBackgroundColor,
                shape = getRoundedCornerShape(borderRadius)
            )
        )
        .then(
            // Apply border
            if (border != BorderValue.None) {
                Modifier.border(
                    width = mapBorderToWidth(border),
                    color = getBorderColor(),
                    shape = getRoundedCornerShape(borderRadius)
                )
            } else {
                Modifier
            }
        )
        .then(
            // Apply opacity
            if (opacity != null) {
                Modifier.alpha(resolveOpacityToken(opacity))
            } else {
                Modifier
            }
        )
        .then(
            // Apply accessibility content description
            if (accessibilityLabel != null) {
                Modifier.semantics {
                    contentDescription = accessibilityLabel
                }
            } else {
                Modifier
            }
        )
    
    // Render Box with modifier chain and content
    Box(modifier = containerModifier) {
        content()
    }
}

// MARK: - Supporting Types

/**
 * Padding value enumeration
 * 
 * Maps to PaddingValue type from types.ts.
 * Provides type-safe padding options.
 */
enum class PaddingValue {
    None,
    P050,  // 4dp
    P100,  // 8dp
    P150,  // 12dp
    P200,  // 16dp
    P300,  // 24dp
    P400   // 32dp
}

/**
 * Border value enumeration
 * 
 * Maps to BorderValue type from types.ts.
 * Provides type-safe border width options.
 */
enum class BorderValue {
    None,
    Default,  // 1dp
    Emphasis, // 2dp
    Heavy     // 4dp
}

/**
 * Border radius value enumeration
 * 
 * Maps to BorderRadiusValue type from types.ts.
 * Provides type-safe border radius options.
 */
enum class BorderRadiusValue {
    None,
    Tight,   // 4dp
    Normal,  // 8dp
    Loose    // 16dp
}

/**
 * Layering value enumeration
 * 
 * Maps to LayeringValue type from types.ts.
 * Provides type-safe layering options.
 * 
 * On Android, these map to elevation tokens that handle both
 * stacking order and shadow rendering.
 */
enum class LayeringValue {
    Container,
    Navigation,
    Dropdown,
    Modal,
    Toast,
    Tooltip
}

// MARK: - Token Mapping
// Token resolution functions are in TokenMapping.kt
// All token mapping functions are now imported from TokenMapping.kt
