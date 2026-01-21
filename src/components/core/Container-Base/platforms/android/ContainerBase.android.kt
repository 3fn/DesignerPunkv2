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
 * Features:
 * - Padding control via space.inset tokens (uniform, axis, and individual edges)
 * - Directional padding with override hierarchy (individual > axis > uniform)
 * - Background color via semantic color tokens
 * - Shadow via semantic shadow tokens (or elevation via layering)
 * - Border via border width tokens with configurable border color
 * - Border radius via radius tokens
 * - Opacity via semantic opacity tokens
 * - Layering via elevation tokens (handles both z-order and shadow on Android)
 * - Accessibility content description support
 * - Hover state support via blend utilities (desktop/ChromeOS with pointer)
 * 
 * @see ../../../types.ts for ContainerBaseProps interface
 * @see ../../../tokens.ts for token reference mappings
 * @see .kiro/specs/010-container-component/design.md for complete design documentation
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 * @see .kiro/specs/031-blend-infrastructure-implementation for blend utilities
 * @see .kiro/specs/043-container-card-base for directional padding requirements
 */

package com.designerpunk.components.core

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.hoverable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsHoveredAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
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
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.platform.LocalLayoutDirection
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
 * - Padding control via space.inset tokens (uniform, axis, and individual edges)
 * - Directional padding with override hierarchy (individual > axis > uniform)
 * - Background color via semantic color tokens
 * - Shadow via semantic shadow tokens (or elevation via layering)
 * - Border via border width tokens with configurable border color
 * - Border radius via radius tokens
 * - Opacity via semantic opacity tokens
 * - Layering via elevation tokens (handles both z-order and shadow on Android)
 * - Accessibility content description support
 * - Hover state support via blend utilities (desktop/ChromeOS with pointer)
 * 
 * Directional Padding:
 * - paddingVertical/paddingHorizontal: Axis-level padding
 * - paddingBlockStart/paddingBlockEnd: Individual vertical edges
 * - paddingInlineStart/paddingInlineEnd: Individual horizontal edges (respects RTL)
 * - Override hierarchy: individual edges > axis props > uniform padding
 * 
 * Android-Specific Behavior:
 * - Elevation tokens handle both stacking order and shadow rendering
 * - If both layering and shadow props are provided, layering takes precedence
 * - Development warning logged when both props are used
 * - Hover state uses darkerBlend for cross-platform consistency
 * - Inline padding respects layout direction (LTR/RTL)
 * 
 * @example
 * ```kotlin
 * // Basic usage
 * ContainerBase(padding = ContainerBasePaddingValue.P200, background = "color.surface") {
 *     Text("Content")
 * }
 * 
 * // With directional padding
 * ContainerBase(
 *     padding = ContainerBasePaddingValue.P200,
 *     paddingVertical = ContainerBasePaddingValue.P100,
 *     paddingBlockStart = ContainerBasePaddingValue.P050
 * ) {
 *     Text("Content with asymmetric padding")
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
 * // With border color
 * ContainerBase(
 *     padding = ContainerBasePaddingValue.P200,
 *     border = ContainerBaseBorderValue.Default,
 *     borderColor = "color.border.subtle"
 * ) {
 *     Text("Content with subtle border")
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
 * @param paddingVertical Vertical (block-axis) padding - overrides uniform padding for vertical axis
 * @param paddingHorizontal Horizontal (inline-axis) padding - overrides uniform padding for horizontal axis
 * @param paddingBlockStart Block-start padding (top) - highest priority, overrides paddingVertical
 * @param paddingBlockEnd Block-end padding (bottom) - highest priority, overrides paddingVertical
 * @param paddingInlineStart Inline-start padding (start/left in LTR) - highest priority, overrides paddingHorizontal
 * @param paddingInlineEnd Inline-end padding (end/right in LTR) - highest priority, overrides paddingHorizontal
 * @param background Background color token name (default: null)
 * @param shadow Shadow token name (default: null)
 * @param border Border width (default: ContainerBaseBorderValue.None)
 * @param borderColor Border color token name (default: null, uses color.border.default)
 * @param borderRadius Border radius (default: ContainerBaseBorderRadiusValue.None)
 * @param opacity Opacity token name (default: null)
 * @param layering Layering value for elevation (default: null)
 * @param accessibilityLabel Accessibility content description (default: null)
 * @param hoverable Whether hover state is enabled (default: false)
 * @param modifier Additional Compose modifiers (default: Modifier)
 * @param content Child composable content
 * 
 * @see Requirements 1.1-1.10 - Directional padding
 * @see Requirements 2.1-2.3 - Border color
 */
@Composable
fun ContainerBase(
    padding: ContainerBasePaddingValue = ContainerBasePaddingValue.None,
    paddingVertical: ContainerBasePaddingValue? = null,
    paddingHorizontal: ContainerBasePaddingValue? = null,
    paddingBlockStart: ContainerBasePaddingValue? = null,
    paddingBlockEnd: ContainerBasePaddingValue? = null,
    paddingInlineStart: ContainerBasePaddingValue? = null,
    paddingInlineEnd: ContainerBasePaddingValue? = null,
    background: String? = null,
    shadow: String? = null,
    border: ContainerBaseBorderValue = ContainerBaseBorderValue.None,
    borderColor: String? = null,
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
    
    // Get layout direction for inline padding calculations
    val layoutDirection = LocalLayoutDirection.current
    
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
    
    // Calculate directional padding with override hierarchy
    // @see Requirements 1.1-1.10 - Directional padding
    val calculatedPadding = calculateContainerBaseDirectionalPadding(
        uniform = padding,
        vertical = paddingVertical,
        horizontal = paddingHorizontal,
        blockStart = paddingBlockStart,
        blockEnd = paddingBlockEnd,
        inlineStart = paddingInlineStart,
        inlineEnd = paddingInlineEnd,
        layoutDirection = layoutDirection
    )
    
    // Resolve border color (defaults to color.border.default when null)
    // @see Requirements 2.1-2.3 - Border color
    val resolvedBorderColor = resolveContainerBaseBorderColor(borderColor)
    
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
            // Apply directional padding using PaddingValues
            Modifier.padding(calculatedPadding)
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
            // Apply border with configurable color
            if (border != ContainerBaseBorderValue.None) {
                Modifier.border(
                    width = mapContainerBaseBorderToWidth(border),
                    color = resolvedBorderColor,
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

/**
 * Calculate directional padding with override hierarchy
 * 
 * Implements the padding override hierarchy:
 * 1. Individual edges (paddingBlockStart, etc.) - highest priority
 * 2. Axis props (paddingVertical, paddingHorizontal) - medium priority
 * 3. Uniform padding (padding prop) - lowest priority
 * 
 * Maps logical properties to physical edges:
 * - blockStart -> top
 * - blockEnd -> bottom
 * - inlineStart -> start (respects layout direction)
 * - inlineEnd -> end (respects layout direction)
 * 
 * @param uniform Base uniform padding (lowest priority)
 * @param vertical Vertical axis padding (overrides uniform for top/bottom)
 * @param horizontal Horizontal axis padding (overrides uniform for start/end)
 * @param blockStart Top edge padding (highest priority)
 * @param blockEnd Bottom edge padding (highest priority)
 * @param inlineStart Start edge padding (highest priority)
 * @param inlineEnd End edge padding (highest priority)
 * @param layoutDirection Current layout direction for RTL support
 * @returns PaddingValues with calculated padding values
 * 
 * @see Requirements 1.1-1.10 - Directional padding
 */
fun calculateContainerBaseDirectionalPadding(
    uniform: ContainerBasePaddingValue,
    vertical: ContainerBasePaddingValue?,
    horizontal: ContainerBasePaddingValue?,
    blockStart: ContainerBasePaddingValue?,
    blockEnd: ContainerBasePaddingValue?,
    inlineStart: ContainerBasePaddingValue?,
    inlineEnd: ContainerBasePaddingValue?,
    layoutDirection: LayoutDirection
): PaddingValues {
    // Start with uniform padding as base
    val uniformDp = mapContainerBasePaddingToDp(uniform)
    
    // Calculate top (block-start) with override hierarchy
    var top = uniformDp
    if (vertical != null && vertical != ContainerBasePaddingValue.None) {
        top = mapContainerBasePaddingToDp(vertical)
    }
    if (blockStart != null) {
        top = mapContainerBasePaddingToDp(blockStart)
    }
    
    // Calculate bottom (block-end) with override hierarchy
    var bottom = uniformDp
    if (vertical != null && vertical != ContainerBasePaddingValue.None) {
        bottom = mapContainerBasePaddingToDp(vertical)
    }
    if (blockEnd != null) {
        bottom = mapContainerBasePaddingToDp(blockEnd)
    }
    
    // Calculate start (inline-start) with override hierarchy
    // In Compose, start/end automatically respect layout direction
    var start = uniformDp
    if (horizontal != null && horizontal != ContainerBasePaddingValue.None) {
        start = mapContainerBasePaddingToDp(horizontal)
    }
    if (inlineStart != null) {
        start = mapContainerBasePaddingToDp(inlineStart)
    }
    
    // Calculate end (inline-end) with override hierarchy
    var end = uniformDp
    if (horizontal != null && horizontal != ContainerBasePaddingValue.None) {
        end = mapContainerBasePaddingToDp(horizontal)
    }
    if (inlineEnd != null) {
        end = mapContainerBasePaddingToDp(inlineEnd)
    }
    
    // Return PaddingValues with start/end which respects layout direction
    return PaddingValues(start = start, top = top, end = end, bottom = bottom)
}

fun resolveContainerBaseColorToken(tokenName: String): Color {
    // Implementation would resolve token to Color
    return Color.Gray
}

/**
 * Resolve border color from token name
 * 
 * Returns the color for the border based on the borderColor prop.
 * If borderColor is null, defaults to color.border.default.
 * 
 * @param borderColor Optional border color token name
 * @returns Compose Color for the border
 * 
 * @see Requirements 2.1, 2.2, 2.3 - Border color
 */
fun resolveContainerBaseBorderColor(borderColor: String?): Color {
    if (borderColor.isNullOrEmpty()) {
        // Default to color.border.default when not specified
        return colorBorder
    }
    
    // Resolve the border color token
    return when (borderColor) {
        "color.border.default" -> colorBorder
        "color.border.subtle" -> colorBorderSubtle
        "color.border.emphasis" -> colorBorderEmphasis
        else -> colorBorder  // Fall back to default border color for unknown tokens
    }
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
