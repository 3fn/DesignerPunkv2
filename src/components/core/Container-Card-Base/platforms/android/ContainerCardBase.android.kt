/**
 * Container-Card-Base Component - Android Jetpack Compose Implementation
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Container-Card-Base
 * Type: Type Primitive (Card)
 * 
 * Jetpack Compose implementation that composes ContainerBase internally and exposes
 * a curated subset of props appropriate for card use cases.
 * 
 * Key Features:
 * - Zero-config card rendering with opinionated defaults
 * - Curated prop subset (only card-appropriate values)
 * - Interactive behavior (hover, press, focus)
 * - Accessibility semantics based on interactive and role props
 * 
 * Uses blend utilities for hover/press state colors instead of opacity workarounds.
 * This ensures cross-platform consistency with Web and iOS implementations.
 * 
 * @see ../../../types.ts for ContainerCardBaseProps interface
 * @see ../../../tokens.ts for token reference mappings
 * @see .kiro/specs/043-container-card-base/design.md for complete design documentation
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 * @see Requirements 3.1-3.14, 4.1-4.7, 5.1-5.10, 6.1-6.5, 7.1-7.6
 */

package com.designerpunk.components.core

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.hoverable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsHoveredAsState
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
// Import theme-aware blend utilities for hover/press state color calculations
// Uses hoverBlend() and pressedBlend() semantic extensions for consistent state styling
// @see Requirements: 5.2, 5.3 - Hover and press feedback
import com.designerpunk.tokens.hoverBlend
import com.designerpunk.tokens.pressedBlend
import com.designerpunk.tokens.DesignTokens

// MARK: - Card-Specific Enums (Curated Subsets)

/**
 * Curated padding values for Container-Card-Base
 * 
 * Subset of Container-Base padding values appropriate for cards.
 * Excludes '050', '300', '400' as they're rarely appropriate for cards.
 * 
 * @see Requirements 3.1, 4.1
 */
enum class CardPadding {
    None,
    P100,  // 8dp - space.inset.100
    P150,  // 12dp - space.inset.150 [DEFAULT]
    P200   // 16dp - space.inset.200
}

/**
 * Curated vertical padding values for Container-Card-Base
 * 
 * Includes '050' for fine-tuning vertical rhythm with typography.
 * 
 * @see Requirements 3.2, 3.4, 3.5
 */
enum class CardVerticalPadding {
    None,
    P050,  // 4dp - space.inset.050 (for typography fine-tuning)
    P100,  // 8dp - space.inset.100
    P150,  // 12dp - space.inset.150
    P200   // 16dp - space.inset.200
}

/**
 * Curated horizontal padding values for Container-Card-Base
 * 
 * Same as CardPadding (excludes '050' as it's rarely needed horizontally).
 * 
 * @see Requirements 3.3, 3.6, 3.7
 */
enum class CardHorizontalPadding {
    None,
    P100,  // 8dp - space.inset.100
    P150,  // 12dp - space.inset.150
    P200   // 16dp - space.inset.200
}

/**
 * Curated background values for Container-Card-Base
 * 
 * Limited to surface colors appropriate for cards.
 * 
 * @see Requirements 3.8, 4.2
 */
enum class CardBackground {
    SurfacePrimary,    // color.surface.primary [DEFAULT]
    SurfaceSecondary,  // color.surface.secondary
    SurfaceTertiary    // color.surface.tertiary
}

/**
 * Curated shadow values for Container-Card-Base
 * 
 * Limited to container shadow only.
 * 
 * @see Requirements 3.9, 4.3
 */
enum class CardShadow {
    None,
    Container  // shadow.container [DEFAULT]
}

/**
 * Curated border values for Container-Card-Base
 * 
 * Limited to subtle border only.
 * 
 * @see Requirements 3.10, 4.4
 */
enum class CardBorder {
    None,      // No border [DEFAULT]
    Default    // 1dp border using borderColor
}

/**
 * Curated border color values for Container-Card-Base
 * 
 * Limited to card-appropriate colors.
 * 
 * @see Requirements 3.11
 */
enum class CardBorderColor {
    BorderDefault,  // color.border.default [DEFAULT]
    BorderSubtle    // color.border.subtle
}

/**
 * Curated border radius values for Container-Card-Base
 * 
 * Limited to rounded values only (no sharp corners for cards).
 * 
 * @see Requirements 3.12, 4.5
 */
enum class CardBorderRadius {
    Normal,  // 8dp - radius-100 [DEFAULT]
    Loose    // 16dp - radius-200
}

/**
 * ARIA role for interactive cards
 * 
 * Determines accessibility semantics and keyboard activation behavior.
 * 
 * @see Requirements 6.1-6.5
 */
enum class CardRole {
    Button,  // Card acts as a button [DEFAULT]
    Link     // Card acts as a link
}

// MARK: - Container-Card-Base Composable

/**
 * Container-Card-Base Composable
 * 
 * A type primitive component that provides card-specific styling and behaviors.
 * Composes ContainerBase internally and exposes a curated subset of props.
 * 
 * Features:
 * - Zero-config card rendering with opinionated defaults
 * - Curated prop subset (only card-appropriate values)
 * - Interactive behavior (hover, press, focus)
 * - Accessibility semantics based on interactive and role props
 * 
 * Opinionated Defaults:
 * - padding: CardPadding.P150 (12dp)
 * - background: CardBackground.SurfacePrimary
 * - shadow: CardShadow.Container
 * - border: CardBorder.None
 * - borderRadius: CardBorderRadius.Normal (8dp)
 * - interactive: false
 * 
 * @example
 * ```kotlin
 * // Zero-config card (uses all defaults)
 * ContainerCardBase {
 *     Text("Card content")
 * }
 * 
 * // Interactive card
 * ContainerCardBase(
 *     interactive = true,
 *     accessibilityLabel = "View details",
 *     onPress = { println("Card pressed") }
 * ) {
 *     Column {
 *         Text("Card Title")
 *         Text("Card description")
 *     }
 * }
 * 
 * // Custom styling
 * ContainerCardBase(
 *     padding = CardPadding.P200,
 *     background = CardBackground.SurfaceSecondary,
 *     border = CardBorder.Default,
 *     borderColor = CardBorderColor.BorderSubtle
 * ) {
 *     Text("Styled card content")
 * }
 * ```
 * 
 * @param padding Uniform padding for the card (default: CardPadding.P150)
 * @param paddingVertical Vertical (block-axis) padding - overrides uniform padding for vertical axis
 * @param paddingHorizontal Horizontal (inline-axis) padding - overrides uniform padding for horizontal axis
 * @param paddingBlockStart Block-start padding (top) - highest priority, overrides paddingVertical
 * @param paddingBlockEnd Block-end padding (bottom) - highest priority, overrides paddingVertical
 * @param paddingInlineStart Inline-start padding (start) - highest priority, overrides paddingHorizontal
 * @param paddingInlineEnd Inline-end padding (end) - highest priority, overrides paddingHorizontal
 * @param background Background color for the card (default: CardBackground.SurfacePrimary)
 * @param shadow Shadow for the card (default: CardShadow.Container)
 * @param border Border for the card (default: CardBorder.None)
 * @param borderColor Border color for the card (default: CardBorderColor.BorderDefault)
 * @param borderRadius Border radius for the card (default: CardBorderRadius.Normal)
 * @param accessibilityLabel Accessibility content description (default: null)
 * @param interactive Whether the card is interactive (default: false)
 * @param onPress Callback when card is pressed/clicked (default: null)
 * @param role ARIA role for interactive cards (default: CardRole.Button)
 * @param testTag Test identifier for automated testing (default: null)
 * @param modifier Additional Compose modifiers (default: Modifier)
 * @param content Child composable content
 * 
 * @see Requirements 3.1-3.14, 4.1-4.7, 5.1-5.10, 6.1-6.5, 7.1-7.6
 */
@Composable
fun ContainerCardBase(
    padding: CardPadding = CardPadding.P150,
    paddingVertical: CardVerticalPadding? = null,
    paddingHorizontal: CardHorizontalPadding? = null,
    paddingBlockStart: CardVerticalPadding? = null,
    paddingBlockEnd: CardVerticalPadding? = null,
    paddingInlineStart: CardHorizontalPadding? = null,
    paddingInlineEnd: CardHorizontalPadding? = null,
    background: CardBackground = CardBackground.SurfacePrimary,
    shadow: CardShadow = CardShadow.Container,
    border: CardBorder = CardBorder.None,
    borderColor: CardBorderColor = CardBorderColor.BorderDefault,
    borderRadius: CardBorderRadius = CardBorderRadius.Normal,
    accessibilityLabel: String? = null,
    interactive: Boolean = false,
    onPress: (() -> Unit)? = null,
    role: CardRole = CardRole.Button,
    testTag: String? = null,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    // Get layout direction for inline padding calculations
    val layoutDirection = LocalLayoutDirection.current
    
    // Set up interaction source for hover and press state tracking
    val interactionSource = remember { MutableInteractionSource() }
    val isHovered by interactionSource.collectIsHoveredAsState()
    val isPressed by interactionSource.collectIsPressedAsState()
    
    // Calculate background color with hover and press states
    // Uses hoverBlend() (8% darker) and pressedBlend() (12% darker) semantic extensions
    // @see Requirements: 5.2, 5.3 - Hover and press feedback
    val baseBackgroundColor = mapCardBackgroundToColor(background)
    val currentBackgroundColor = when {
        interactive && isPressed -> baseBackgroundColor.pressedBlend()
        interactive && isHovered -> baseBackgroundColor.hoverBlend()
        else -> baseBackgroundColor
    }
    
    // Calculate directional padding with override hierarchy
    // @see Requirements 3.1-3.7 - Curated padding values
    val calculatedPadding = calculateCardDirectionalPadding(
        uniform = padding,
        vertical = paddingVertical,
        horizontal = paddingHorizontal,
        blockStart = paddingBlockStart,
        blockEnd = paddingBlockEnd,
        inlineStart = paddingInlineStart,
        inlineEnd = paddingInlineEnd,
        layoutDirection = layoutDirection
    )
    
    // Get corner shape for border radius
    val cornerShape = getCardRoundedCornerShape(borderRadius)
    
    // Build modifier chain with all styling
    val containerModifier = modifier
        .then(
            // Apply test tag if provided
            if (testTag != null) {
                Modifier.testTag(testTag)
            } else {
                Modifier
            }
        )
        .then(
            // Apply hoverable modifier if interactive
            if (interactive) {
                Modifier.hoverable(interactionSource = interactionSource)
            } else {
                Modifier
            }
        )
        .then(
            // Apply clickable modifier if interactive
            if (interactive && onPress != null) {
                Modifier.clickable(
                    interactionSource = interactionSource,
                    indication = null, // We handle visual feedback via background color
                    onClick = onPress
                )
            } else {
                Modifier
            }
        )
        .then(
            // Apply shadow/elevation
            if (shadow != CardShadow.None) {
                Modifier.shadow(
                    elevation = mapCardShadowToElevation(shadow),
                    shape = cornerShape
                )
            } else {
                Modifier
            }
        )
        .then(
            // Apply background color (with hover/press state consideration)
            Modifier.background(
                color = currentBackgroundColor,
                shape = cornerShape
            )
        )
        .then(
            // Apply border with configurable color
            if (border != CardBorder.None) {
                Modifier.border(
                    width = mapCardBorderToWidth(border),
                    color = mapCardBorderColorToColor(borderColor),
                    shape = cornerShape
                )
            } else {
                Modifier
            }
        )
        .then(
            // Apply directional padding
            Modifier.padding(calculatedPadding)
        )
        .then(
            // Apply accessibility semantics
            Modifier.semantics {
                if (accessibilityLabel != null) {
                    contentDescription = accessibilityLabel
                }
                if (interactive) {
                    this.role = when (role) {
                        CardRole.Button -> Role.Button
                        CardRole.Link -> Role.Button // Compose doesn't have Role.Link, use Button
                    }
                }
            }
        )
    
    // Render Box with modifier chain and content
    Box(modifier = containerModifier) {
        content()
    }
}

// MARK: - Token Mapping Functions

/**
 * Map CardPadding to Dp
 * 
 * @param padding Card padding value
 * @return Dp padding value
 * 
 * @see Requirements 3.1, 4.1
 */
fun mapCardPaddingToDp(padding: CardPadding): Dp {
    return when (padding) {
        CardPadding.None -> 0.dp
        CardPadding.P100 -> spaceInset100 /* space.inset.100 */
        CardPadding.P150 -> spaceInset150 /* space.inset.150 */
        CardPadding.P200 -> spaceInset200 /* space.inset.200 */
    }
}

/**
 * Map CardVerticalPadding to Dp
 * 
 * @param padding Card vertical padding value
 * @return Dp padding value
 * 
 * @see Requirements 3.2, 3.4, 3.5
 */
fun mapCardVerticalPaddingToDp(padding: CardVerticalPadding): Dp {
    return when (padding) {
        CardVerticalPadding.None -> 0.dp
        CardVerticalPadding.P050 -> spaceInset050 /* space.inset.050 */
        CardVerticalPadding.P100 -> spaceInset100 /* space.inset.100 */
        CardVerticalPadding.P150 -> spaceInset150 /* space.inset.150 */
        CardVerticalPadding.P200 -> spaceInset200 /* space.inset.200 */
    }
}

/**
 * Map CardHorizontalPadding to Dp
 * 
 * @param padding Card horizontal padding value
 * @return Dp padding value
 * 
 * @see Requirements 3.3, 3.6, 3.7
 */
fun mapCardHorizontalPaddingToDp(padding: CardHorizontalPadding): Dp {
    return when (padding) {
        CardHorizontalPadding.None -> 0.dp
        CardHorizontalPadding.P100 -> spaceInset100 /* space.inset.100 */
        CardHorizontalPadding.P150 -> spaceInset150 /* space.inset.150 */
        CardHorizontalPadding.P200 -> spaceInset200 /* space.inset.200 */
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
 * @param uniform Base uniform padding (lowest priority)
 * @param vertical Vertical axis padding (overrides uniform for top/bottom)
 * @param horizontal Horizontal axis padding (overrides uniform for start/end)
 * @param blockStart Top edge padding (highest priority)
 * @param blockEnd Bottom edge padding (highest priority)
 * @param inlineStart Start edge padding (highest priority)
 * @param inlineEnd End edge padding (highest priority)
 * @param layoutDirection Current layout direction for RTL support
 * @return PaddingValues with calculated padding values
 * 
 * @see Requirements 3.1-3.7
 */
fun calculateCardDirectionalPadding(
    uniform: CardPadding,
    vertical: CardVerticalPadding?,
    horizontal: CardHorizontalPadding?,
    blockStart: CardVerticalPadding?,
    blockEnd: CardVerticalPadding?,
    inlineStart: CardHorizontalPadding?,
    inlineEnd: CardHorizontalPadding?,
    layoutDirection: LayoutDirection
): PaddingValues {
    // Start with uniform padding as base
    val uniformDp = mapCardPaddingToDp(uniform)
    
    // Calculate top (block-start) with override hierarchy
    var top = uniformDp
    if (vertical != null && vertical != CardVerticalPadding.None) {
        top = mapCardVerticalPaddingToDp(vertical)
    }
    if (blockStart != null) {
        top = mapCardVerticalPaddingToDp(blockStart)
    }
    
    // Calculate bottom (block-end) with override hierarchy
    var bottom = uniformDp
    if (vertical != null && vertical != CardVerticalPadding.None) {
        bottom = mapCardVerticalPaddingToDp(vertical)
    }
    if (blockEnd != null) {
        bottom = mapCardVerticalPaddingToDp(blockEnd)
    }
    
    // Calculate start (inline-start) with override hierarchy
    // In Compose, start/end automatically respect layout direction
    var start = uniformDp
    if (horizontal != null && horizontal != CardHorizontalPadding.None) {
        start = mapCardHorizontalPaddingToDp(horizontal)
    }
    if (inlineStart != null) {
        start = mapCardHorizontalPaddingToDp(inlineStart)
    }
    
    // Calculate end (inline-end) with override hierarchy
    var end = uniformDp
    if (horizontal != null && horizontal != CardHorizontalPadding.None) {
        end = mapCardHorizontalPaddingToDp(horizontal)
    }
    if (inlineEnd != null) {
        end = mapCardHorizontalPaddingToDp(inlineEnd)
    }
    
    // Return PaddingValues with start/end which respects layout direction
    return PaddingValues(start = start, top = top, end = end, bottom = bottom)
}

/**
 * Map CardBackground to Color
 * 
 * @param background Card background value
 * @return Compose Color for the background
 * 
 * @see Requirements 3.8, 4.2
 */
fun mapCardBackgroundToColor(background: CardBackground): Color {
    return when (background) {
        CardBackground.SurfacePrimary -> colorSurfacePrimary /* color.surface.primary */
        CardBackground.SurfaceSecondary -> colorSurfaceSecondary /* color.surface.secondary */
        CardBackground.SurfaceTertiary -> colorSurfaceTertiary /* color.surface.tertiary */
    }
}

/**
 * Map CardBorderRadius to RoundedCornerShape
 * 
 * @param borderRadius Card border radius value
 * @return RoundedCornerShape for the border radius
 * 
 * @see Requirements 3.12, 4.5
 */
fun getCardRoundedCornerShape(borderRadius: CardBorderRadius): RoundedCornerShape {
    return when (borderRadius) {
        CardBorderRadius.Normal -> RoundedCornerShape(radius100) /* radius-100 */
        CardBorderRadius.Loose -> RoundedCornerShape(radius200) /* radius-200 */
    }
}

/**
 * Map CardBorder to line width
 * 
 * @param border Card border value
 * @return Dp line width
 * 
 * @see Requirements 3.10, 4.4
 */
fun mapCardBorderToWidth(border: CardBorder): Dp {
    return when (border) {
        CardBorder.None -> 0.dp
        CardBorder.Default -> borderDefault /* border.border.default */
    }
}

/**
 * Map CardBorderColor to Color
 * 
 * @param borderColor Card border color value
 * @return Compose Color for the border
 * 
 * @see Requirements 3.11
 */
fun mapCardBorderColorToColor(borderColor: CardBorderColor): Color {
    return when (borderColor) {
        CardBorderColor.BorderDefault -> colorBorder /* color.border.default */
        CardBorderColor.BorderSubtle -> colorBorderSubtle /* color.border.subtle */
    }
}

/**
 * Map CardShadow to elevation Dp
 * 
 * @param shadow Card shadow value
 * @return Elevation value as Dp
 * 
 * @see Requirements 3.9, 4.3
 */
fun mapCardShadowToElevation(shadow: CardShadow): Dp {
    return when (shadow) {
        CardShadow.None -> 0.dp
        CardShadow.Container -> shadowContainerElevation /* shadow.container */
    }
}

// MARK: - Token Constants
// These reference the generated DesignTokens

// Space tokens (space.inset.*)
private val spaceInset050: Dp = DesignTokens.space_inset_050
private val spaceInset100: Dp = DesignTokens.space_inset_100
private val spaceInset150: Dp = DesignTokens.space_inset_150
private val spaceInset200: Dp = DesignTokens.space_inset_200

// Radius tokens
private val radius100: Dp = DesignTokens.radius_100 /* radius-100 */
private val radius200: Dp = DesignTokens.radius_200 /* radius-200 */

// Border tokens
private val borderDefault: Dp = DesignTokens.border_default /* border.border.default */

// Color tokens
private val colorSurfacePrimary: Color = Color(DesignTokens.color_surface_primary) /* color.surface.primary */
private val colorSurfaceSecondary: Color = Color(DesignTokens.color_surface_secondary) /* color.surface.secondary */
private val colorSurfaceTertiary: Color = Color(DesignTokens.color_surface_tertiary) /* color.surface.tertiary */
private val colorBorder: Color = Color(DesignTokens.color_border) /* color.border.default */
private val colorBorderSubtle: Color = Color(DesignTokens.color_border_subtle) /* color.border.subtle */

// Shadow tokens (elevation on Android)
private val shadowContainerElevation: Dp = DesignTokens.elevation_container /* shadow.container */

// Motion tokens
// Note: Duration value 150 corresponds to motion.focusTransition token (150ms)
private const val motionFocusTransitionDuration: Int = 150 /* motion.focusTransition */

// MARK: - Preview

/**
 * Preview composable for ContainerCardBase component.
 * 
 * Shows cards with different configurations to demonstrate
 * component variants and interaction patterns.
 */
@androidx.compose.ui.tooling.preview.Preview(showBackground = true)
@Composable
fun ContainerCardBasePreview() {
    // Preview uses spaceInset200 (space.inset.200 = 16dp) for padding and spacing
    androidx.compose.foundation.layout.Column(
        modifier = Modifier.padding(spaceInset200), // space.inset.200
        verticalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(spaceInset200) // space.inset.200
    ) {
        // Zero-config card
        androidx.compose.material3.Text("Zero-Config Card", style = androidx.compose.material3.MaterialTheme.typography.titleMedium)
        ContainerCardBase {
            androidx.compose.material3.Text("Default card with all opinionated defaults")
        }
        
        // Interactive card
        androidx.compose.material3.Text("Interactive Card", style = androidx.compose.material3.MaterialTheme.typography.titleMedium)
        ContainerCardBase(
            interactive = true,
            accessibilityLabel = "Tap to view details",
            onPress = { /* Handle press */ }
        ) {
            androidx.compose.foundation.layout.Column {
                androidx.compose.material3.Text("Interactive Card", style = androidx.compose.material3.MaterialTheme.typography.titleSmall)
                androidx.compose.material3.Text("Tap or hover to see state changes", style = androidx.compose.material3.MaterialTheme.typography.bodySmall)
            }
        }
        
        // Custom styling
        androidx.compose.material3.Text("Custom Styling", style = androidx.compose.material3.MaterialTheme.typography.titleMedium)
        ContainerCardBase(
            padding = CardPadding.P200,
            background = CardBackground.SurfaceSecondary,
            border = CardBorder.Default,
            borderColor = CardBorderColor.BorderSubtle,
            borderRadius = CardBorderRadius.Loose
        ) {
            androidx.compose.material3.Text("Custom styled card with border and loose radius")
        }
        
        // Directional padding
        androidx.compose.material3.Text("Directional Padding", style = androidx.compose.material3.MaterialTheme.typography.titleMedium)
        ContainerCardBase(
            paddingVertical = CardVerticalPadding.P050,
            paddingHorizontal = CardHorizontalPadding.P200
        ) {
            androidx.compose.material3.Text("Card with asymmetric padding")
        }
    }
}
