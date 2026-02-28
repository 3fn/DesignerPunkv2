/**
 * Chip-Input Component for Android Platform
 * 
 * Stemma System: Chip Family
 * Component Type: Semantic Variant
 * Inherits: Chip-Base
 * Naming Convention: [Family]-[Type] = Chip-Input
 * 
 * A dismissible chip component used for managing user-entered values like tags
 * or selections. Extends Chip-Base with dismiss behavior and always-visible X icon.
 * 
 * Follows True Native Architecture with build-time platform separation.
 * Uses token-based styling for consistent cross-platform appearance.
 * Integrates with IconBase component for icon rendering.
 * 
 * Key Characteristics:
 * - Always displays X icon as trailing element
 * - Supports both leading icon AND trailing X icon
 * - Tap anywhere dismisses (calls onDismiss)
 * - No selected state (dismiss-only behavior)
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered. This ensures users always see actionable
 * UI elements.
 * 
 * @module Chip-Input/platforms/android
 * @see .kiro/specs/045-chip-base/design.md for design specification
 * @see Requirements 5.1-5.6, 6.3, 6.5, 7.5 in .kiro/specs/045-chip-base/requirements.md
 */

package com.designerpunk.components.core

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.designerpunk.tokens.DesignTokens
import com.designerpunk.tokens.pressedBlend

// MARK: - Chip-Input Tokens

/**
 * Chip-Input specific design tokens.
 * 
 * Inherits all tokens from ChipTokens (Chip-Base).
 * No additional tokens needed for Chip-Input.
 * 
 * @see Requirements: 5.1 - Inherits Chip-Base visual styling
 */
private object ChipInputTokens {
    // MARK: - Spacing Tokens (inherited from ChipTokens)
    
    /** Block padding achieving 32px visual height with buttonSm typography
     * References: chip.paddingBlock → space075 (6px)
     */
    val paddingBlock: Dp = DesignTokens.space_075  // 6dp
    
    /** Inline padding for horizontal spacing
     * References: space.inset.150 (12px)
     */
    val paddingInline: Dp = DesignTokens.space_150  // 12dp
    
    /** Gap between icon and label
     * References: space.grouped.tight (4px)
     */
    val iconGap: Dp = DesignTokens.space_050  // 4dp
    
    // MARK: - Size Tokens (inherited from ChipTokens)
    
    /** Icon size for chip icons
     * References: icon.size075 (20px)
     */
    val iconSize: Dp = DesignTokens.icon_size_075  // 20dp
    
    /** Minimum tap area for accessibility
     * References: tapAreaRecommended (48px)
     */
    val tapArea: Dp = DesignTokens.tap_area_recommended  // 48dp
    
    // MARK: - Border Tokens (inherited from ChipTokens)
    
    /** Border width for chip outline
     * References: borderDefault → borderWidth100 (1px)
     */
    val borderWidth: Dp = DesignTokens.border_width_100  // 1dp
    
    // MARK: - Color Tokens (inherited from ChipTokens)
    
    /** Default background color
     * References: color.structure.surface
     */
    val backgroundColor: Color = Color(DesignTokens.color_surface)
    
    /** Default border color
     * References: color.structure.border
     */
    val borderColor: Color = Color(DesignTokens.color_border)
    
    /** Default text color
     * References: color.text.default
     */
    val textColor: Color = Color(DesignTokens.color_text_default)
    
    /** Primary action color for pressed border
     * References: color.action.primary
     */
    val primaryColor: Color = Color(DesignTokens.color_primary)
    
    // MARK: - Animation Tokens
    
    /** Animation duration for state transitions
     * References: motion.selectionTransition (150ms)
     */
    val animationDuration: Int = DesignTokens.Duration.Duration150  // 150ms
}

// MARK: - ChipInput Composable

/**
 * ChipInput Composable
 * 
 * A dismissible chip component with always-visible X icon as trailing element.
 * Tap anywhere on the chip to dismiss.
 * 
 * Usage:
 * ```kotlin
 * // Basic input chip
 * ChipInput(label = "Tag") {
 *     println("Tag dismissed")
 * }
 * 
 * // Input chip with leading icon (shows both leading icon AND trailing X)
 * ChipInput(label = "Category", icon = "tag") {
 *     println("Category dismissed")
 * }
 * 
 * // Input chip with testTag
 * ChipInput(label = "Email", testTag = "email-chip") {
 *     println("Email chip dismissed")
 * }
 * ```
 * 
 * @param label Chip text content (required)
 * @param icon Optional leading icon name
 * @param testTag Test identifier for automated testing
 * @param modifier Additional Compose modifiers
 * @param onDismiss Dismiss callback (tap anywhere on chip)
 * 
 * @see Requirements: 5.1-5.6 in .kiro/specs/045-chip-base/requirements.md
 * @see Requirements: 6.3, 6.5, 7.5 - Cross-platform implementation, accessibility
 */
@Composable
fun ChipInput(
    label: String,
    icon: String? = null,
    testTag: String? = null,
    modifier: Modifier = Modifier,
    onDismiss: () -> Unit = {}
) {
    // Track interaction state for pressed styling
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    
    // Calculate state-based colors
    // @see Requirements: 3.1, 3.3 - State styling (inherited from Chip-Base)
    val backgroundColor = if (isPressed) {
        // Apply pressed blend (12% darker)
        ChipInputTokens.backgroundColor.pressedBlend()
    } else {
        ChipInputTokens.backgroundColor
    }
    
    val borderColor = if (isPressed) {
        ChipInputTokens.primaryColor
    } else {
        ChipInputTokens.borderColor
    }
    
    // Accessible label for the chip: "Remove [label]"
    // @see Requirement 7.5 - X icon accessible label
    val dismissLabel = "Remove $label"
    
    // Build modifier chain
    val chipModifier = modifier
        .then(
            if (testTag != null) {
                Modifier.testTag(testTag)
            } else {
                Modifier
            }
        )
        .semantics {
            role = Role.Button
            contentDescription = dismissLabel
        }
    
    // Chip container using Surface for clickable behavior
    // @see Requirements: 2.4 - Pill shape using RoundedCornerShape(50)
    // @see Requirements: 2.6 - 48dp minimum tap area
    // @see Requirements: 5.4 - Tap anywhere calls onDismiss
    Surface(
        onClick = onDismiss,
        shape = RoundedCornerShape(50),  // Pill shape (radius.full equivalent)
        color = backgroundColor,
        border = BorderStroke(
            width = ChipInputTokens.borderWidth,
            color = borderColor
        ),
        interactionSource = interactionSource,
        modifier = chipModifier.sizeIn(minHeight = ChipInputTokens.tapArea)
    ) {
        // Content row with optional leading icon, label, and trailing X icon
        // @see Requirements: 5.2, 5.3 - X icon as trailing element, both icons supported
        Row(
            horizontalArrangement = Arrangement.spacedBy(ChipInputTokens.iconGap),
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(
                horizontal = ChipInputTokens.paddingInline,
                vertical = ChipInputTokens.paddingBlock
            )
        ) {
            // Optional leading icon
            // @see Requirement 5.3 - Support both leading icon AND trailing X icon
            if (icon != null) {
                IconBase(
                    name = icon,
                    size = ChipInputTokens.iconSize,
                    color = ChipInputTokens.textColor
                )
            }
            
            // Label text
            // @see Requirements: 1.1 - Label text with typography.buttonSm
            Text(
                text = label,
                style = TextStyle(
                    fontSize = DesignTokens.font_size_075.sp,  // typography.buttonSm
                    lineHeight = (DesignTokens.font_size_075 * DesignTokens.line_height_075).sp,
                    fontWeight = FontWeight.Medium
                ),
                color = ChipInputTokens.textColor
            )
            
            // Trailing X icon (always visible)
            // @see Requirement 5.2 - Always display X icon as trailing element
            IconBase(
                name = "x",
                size = ChipInputTokens.iconSize,
                color = ChipInputTokens.textColor
            )
        }
    }
}

// MARK: - Preview

/**
 * Preview composable for ChipInput component.
 * 
 * Demonstrates various chip configurations:
 * - Basic input chip with X icon
 * - Input chip with leading icon (shows both icons)
 * - Multiple input chips in a row
 * - Input chip with testTag
 * - Token reference documentation
 * - Accessibility notes
 * 
 * @see Requirements: 6.5 - Cross-platform consistency verification
 */
@Preview(showBackground = true, name = "ChipInput Component")
@Composable
fun ChipInputPreview() {
    androidx.compose.foundation.layout.Column(
        modifier = Modifier.padding(DesignTokens.space_200),
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_300)
    ) {
        // Title
        Text(
            text = "ChipInput Component",
            style = androidx.compose.material3.MaterialTheme.typography.titleMedium
        )
        
        // Basic input chip
        Text(
            text = "Basic Input Chip (with X icon)",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        ChipInput(label = "Tag") {
            println("Tag dismissed")
        }
        
        // Input chip with leading icon
        Text(
            text = "With Leading Icon (both icons visible)",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        ChipInput(label = "Category", icon = "tag") {
            println("Category dismissed")
        }
        
        // Multiple input chips
        Text(
            text = "Multiple Input Chips",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Row(
            horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100)
        ) {
            ChipInput(label = "Kotlin") {
                println("Kotlin dismissed")
            }
            ChipInput(label = "Android", icon = "smartphone") {
                println("Android dismissed")
            }
            ChipInput(label = "Design") {
                println("Design dismissed")
            }
        }
        
        // Input chip with testTag
        Text(
            text = "Input Chip with testTag",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        ChipInput(
            label = "Test Chip",
            testTag = "test-input-chip"
        ) {
            println("Test chip dismissed")
        }
        
        // Token reference documentation
        Text(
            text = "Token References",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        androidx.compose.foundation.layout.Column(
            verticalArrangement = Arrangement.spacedBy(DesignTokens.space_050)
        ) {
            Text(
                text = "paddingBlock: ${ChipInputTokens.paddingBlock.value.toInt()}dp (space075)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "paddingInline: ${ChipInputTokens.paddingInline.value.toInt()}dp (space150)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "iconGap: ${ChipInputTokens.iconGap.value.toInt()}dp (space050)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "iconSize: ${ChipInputTokens.iconSize.value.toInt()}dp (iconSize075)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "tapArea: ${ChipInputTokens.tapArea.value.toInt()}dp (tapAreaRecommended)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "borderWidth: ${ChipInputTokens.borderWidth.value.toInt()}dp (borderWidth100)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
        }
        
        // Accessibility notes
        Text(
            text = "Accessibility",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        androidx.compose.foundation.layout.Column(
            verticalArrangement = Arrangement.spacedBy(DesignTokens.space_050)
        ) {
            Text(
                text = "• X icon has accessible label: \"Remove [label]\"",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "• Tap anywhere on chip dismisses",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "• 48dp minimum tap area",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
        }
    }
}
