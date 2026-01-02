/**
 * Container-Base Component - Android Jetpack Compose Implementation
 * 
 * Stemma System naming: [Family]-[Type] = Container-Base
 * Type: Primitive (foundational component)
 * 
 * Jetpack Compose implementation of the Container-Base component using modifier chains.
 * Provides structural wrapping with individual styling capabilities.
 * 
 * Uses blend utilities for hover state colors instead of opacity workarounds.
 * This ensures cross-platform consistency with Web and iOS implementations.
 * 
 * @see ../../../types.ts for ContainerBaseProps interface
 * @see ../../../tokens.ts for token reference mappings
 * @see .kiro/specs/010-container-component/design.md for complete design documentation
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
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
// Import theme-aware blend utilities for hover state color calculations
// Uses hoverBlend() semantic extension for consistent state styling across components
// @see Requirements: 11.1, 11.2, 11.3 - Theme-aware utilities
import com.designerpunk.tokens.hoverBlend

/**
 * Container-Base Composable
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
 * ContainerBase(padding = ContainerBasePaddingValue.P200, background = "color.surface") {
 *     Text("Content")
 * }
 * 
 * // With multiple styling props
 * ContainerBase(
 *     padding = ContainerBasePaddingValue.P300,
 *     background = "color.primary",
 *     shadow = "shadow.container",
 *     borderRadius = ContainerBaseBorderRadiusValue.Normal,
 *     layering = ContainerBaseLayeringValue.Navigation
 * ) {
 *     Text("Content")
 * }
 * 
 * // With hover state enabled
 * ContainerBase(
 *     padding = ContainerBasePaddingValue.P200,
 *     background = "color.surface",
 *     hoverable = true
 * ) {
 *     Text("Hoverable content")
 * }
 * 
 * // With accessibility
 * ContainerBase(
 *     padding = ContainerBasePaddingValue.P200,
 *     background = "color.surface",
 *     accessibilityLabel = "Product card"
 * ) {
 *     Text("Content")
 * }
 * ```
 * 
 * @param padding Internal padding for the container (default: ContainerBasePaddingValue.None)
 * @param background Background color token name (default: null)
 * @param shadow Shadow token name (default: null)
 * @param border Border width (default: ContainerBaseBorderValue.None)
 * @param borderRadius Border radius (default: ContainerBaseBorderRadiusValue.None)
 * @param opacity Opacity token name (default: null)
 * @param layering Layering value for elevation (default: null)
 * @param accessibilityLabel Accessibility content description (default: null)
 * @param hoverable Whether hover state is enabled (default: false)
 * @param modifier Additional Compose modifiers (default: Modifier)
 * @param content Child composable content
 */
@Composable
fun ContainerBase(
    padding: ContainerBasePaddingValue = ContainerBasePaddingValue.None,
    background: String? = null,
    shadow: String? = null,
    border: ContainerBaseBorderValue = ContainerBaseBorderValue.None,
    borderRadius: ContainerBaseBorderRadiusValue = ContainerBaseBorderRadiusValue.None,
    opacity: String? = null,
    layering: ContainerBaseLayeringValue? = null,
    accessibilityLabel: String? = null,
    hoverable: Boolean = false,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    // Android-specific: Check for conflicting layering + shadow props
    if (layering != null && shadow != null) {
        Log.w(
            "ContainerBase",
            "Both layering and shadow props provided on Android. " +
            "Android elevation handles both stacking and shadow. " +
            "Using layering prop, shadow prop ignored."
        )
    }
    
    // Set up hover interaction source for hover state tracking
    val interactionSource = remember { MutableInteractionSource() }
    val isHovered by interactionSource.collectIsHoveredAsState()
    
    // Calculate background color with hover state
    // Uses hoverBlend() semantic extension from ThemeAwareBlendUtilities.android.kt
    // which applies darkerBlend(color.surface, blend.hoverDarker) - 8% darker
    // @see Requirements: 9.1 - Container hover state
    // @see Requirements: 11.1, 11.2, 11.3 - Theme-aware utilities
    val baseBackgroundColor = if (background != null) resolveContainerBaseColorToken(background) else Color.Transparent
    val currentBackgroundColor = if (hoverable && isHovered) {
        baseBackgroundColor.hoverBlend()
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
            if (padding != ContainerBasePaddingValue.None) {
                Modifier.padding(mapContainerBasePaddingToDp(padding))
            } else {
                Modifier
            }
        )
        .then(
            // Apply elevation (handles both z-order and shadow on Android)
            // Layering takes precedence over shadow prop
            when {
                layering != null -> Modifier.shadow(
                    elevation = mapContainerBaseLayeringToElevation(layering),
                    shape = getContainerBaseRoundedCornerShape(borderRadius)
                )
                shadow != null -> Modifier.shadow(
                    elevation = mapContainerBaseShadowToElevation(shadow),
                    shape = getContainerBaseRoundedCornerShape(borderRadius)
                )
                else -> Modifier
            }
        )
        .then(
            // Apply background color (with hover state consideration)
            Modifier.background(
                color = currentBackgroundColor,
                shape = getContainerBaseRoundedCornerShape(borderRadius)
            )
        )
        .then(
            // Apply border
            if (border != ContainerBaseBorderValue.None) {
                Modifier.border(
                    width = mapContainerBaseBorderToWidth(border),
                    color = getContainerBaseBorderColor(),
                    shape = getContainerBaseRoundedCornerShape(borderRadius)
                )
            } else {
                Modifier
            }
        )
        .then(
            // Apply opacity
            if (opacity != null) {
                Modifier.alpha(resolveContainerBaseOpacityToken(opacity))
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
 * Padding value enumeration for Container-Base
 * 
 * Maps to PaddingValue type from types.ts.
 * Provides type-safe padding options.
 */
enum class ContainerBasePaddingValue {
    None,
    P050,  // 4dp
    P100,  // 8dp
    P150,  // 12dp
    P200,  // 16dp
    P300,  // 24dp
    P400   // 32dp
}

/**
 * Border value enumeration for Container-Base
 * 
 * Maps to BorderValue type from types.ts.
 * Provides type-safe border width options.
 */
enum class ContainerBaseBorderValue {
    None,
    Default,  // 1dp
    Emphasis, // 2dp
    Heavy     // 4dp
}

/**
 * Border radius value enumeration for Container-Base
 * 
 * Maps to BorderRadiusValue type from types.ts.
 * Provides type-safe border radius options.
 */
enum class ContainerBaseBorderRadiusValue {
    None,
    Tight,   // 4dp
    Normal,  // 8dp
    Loose    // 16dp
}

/**
 * Layering value enumeration for Container-Base
 * 
 * Maps to LayeringValue type from types.ts.
 * Provides type-safe layering options.
 * 
 * On Android, these map to elevation tokens that handle both
 * stacking order and shadow rendering.
 */
enum class ContainerBaseLayeringValue {
    Container,
    Navigation,
    Dropdown,
    Modal,
    Toast,
    Tooltip
}

// MARK: - Token Mapping Functions
// These functions would be implemented in TokenMapping.kt

fun mapContainerBasePaddingToDp(padding: ContainerBasePaddingValue): Dp {
    // Token references: space.inset.050 through space.inset.400
    return when (padding) {
        ContainerBasePaddingValue.None -> 0.dp
        ContainerBasePaddingValue.P050 -> spaceInset050 /* space.inset.050 */
        ContainerBasePaddingValue.P100 -> spaceInset100 /* space.inset.100 */
        ContainerBasePaddingValue.P150 -> spaceInset150 /* space.inset.150 */
        ContainerBasePaddingValue.P200 -> spaceInset200 /* space.inset.200 */
        ContainerBasePaddingValue.P300 -> spaceInset300 /* space.inset.300 */
        ContainerBasePaddingValue.P400 -> spaceInset400 /* space.inset.400 */
    }
}

fun resolveContainerBaseColorToken(tokenName: String): Color {
    // Implementation would resolve token to Color
    return Color.Gray
}

fun mapContainerBaseBorderToWidth(border: ContainerBaseBorderValue): Dp {
    // Token references: border.border.default, border.border.emphasis, border.border.heavy
    return when (border) {
        ContainerBaseBorderValue.None -> 0.dp
        ContainerBaseBorderValue.Default -> borderDefault /* border.border.default */
        ContainerBaseBorderValue.Emphasis -> borderEmphasis /* border.border.emphasis */
        ContainerBaseBorderValue.Heavy -> borderHeavy /* border.border.heavy */
    }
}

fun getContainerBaseRoundedCornerShape(borderRadius: ContainerBaseBorderRadiusValue): RoundedCornerShape {
    // Token references: radius-050, radius-100, radius-200
    return when (borderRadius) {
        ContainerBaseBorderRadiusValue.None -> RoundedCornerShape(0.dp)
        ContainerBaseBorderRadiusValue.Tight -> RoundedCornerShape(radius050) /* radius-050 */
        ContainerBaseBorderRadiusValue.Normal -> RoundedCornerShape(radius100) /* radius-100 */
        ContainerBaseBorderRadiusValue.Loose -> RoundedCornerShape(radius200) /* radius-200 */
    }
}

fun getContainerBaseBorderColor(): Color {
    // Implementation would return color.border token value
    return Color.Gray
}

fun mapContainerBaseLayeringToElevation(layering: ContainerBaseLayeringValue): Dp {
    // Token references: elevation.container through elevation.tooltip
    return when (layering) {
        ContainerBaseLayeringValue.Container -> elevationContainer /* elevation.container */
        ContainerBaseLayeringValue.Navigation -> elevationNavigation /* elevation.navigation */
        ContainerBaseLayeringValue.Dropdown -> elevationDropdown /* elevation.dropdown */
        ContainerBaseLayeringValue.Modal -> elevationModal /* elevation.modal */
        ContainerBaseLayeringValue.Toast -> elevationToast /* elevation.toast */
        ContainerBaseLayeringValue.Tooltip -> elevationTooltip /* elevation.tooltip */
    }
}

fun mapContainerBaseShadowToElevation(shadow: String): Dp {
    // Implementation maps shadow token to elevation
    // Token reference: shadow tokens map to elevation values
    return shadowElevation /* shadow.container */
}

fun resolveContainerBaseOpacityToken(tokenName: String): Float {
    // Implementation would resolve opacity token
    return 1.0f
}
