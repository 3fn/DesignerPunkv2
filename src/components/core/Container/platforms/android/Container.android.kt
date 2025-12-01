/**
 * Container Component - Android Jetpack Compose Implementation
 * 
 * Jetpack Compose implementation of the Container component using modifier chains.
 * Provides structural wrapping with individual styling capabilities.
 * 
 * @see ../../../types.ts for ContainerProps interface
 * @see ../../../tokens.ts for token reference mappings
 * @see .kiro/specs/010-container-component/design.md for complete design documentation
 */

package com.designerpunk.components.core

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import android.util.Log

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
 * 
 * Android-Specific Behavior:
 * - Elevation tokens handle both stacking order and shadow rendering
 * - If both layering and shadow props are provided, layering takes precedence
 * - Development warning logged when both props are used
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
    
    // Build modifier chain with all styling
    val containerModifier = modifier
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
            // Apply background color
            if (background != null) {
                Modifier.background(
                    color = resolveColorToken(background),
                    shape = getRoundedCornerShape(borderRadius)
                )
            } else {
                Modifier
            }
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
