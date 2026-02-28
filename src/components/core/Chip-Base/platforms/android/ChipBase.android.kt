/**
 * Chip-Base Component for Android Platform
 * 
 * Stemma System: Chip Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type] = Chip-Base
 * 
 * A compact, interactive element used for filtering, selection, or input management.
 * Chip-Base is the primitive component that provides the foundation for semantic
 * variants (Chip-Filter, Chip-Input).
 * 
 * Follows True Native Architecture with build-time platform separation.
 * Uses token-based styling for consistent cross-platform appearance.
 * Integrates with IconBase component for icon rendering.
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered. This ensures users always see actionable
 * UI elements.
 * 
 * @module Chip-Base/platforms/android
 * @see .kiro/specs/045-chip-base/design.md for design specification
 * @see Requirements 6.3, 6.4, 6.5 in .kiro/specs/045-chip-base/requirements.md
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

// MARK: - Chip Tokens

/**
 * Chip-specific design tokens.
 * 
 * These tokens are component-level tokens specific to the Chip component family.
 * They reference or extend the core DesignTokens where possible.
 * 
 * @see Requirements: 8.1, 8.2, 8.3 - Component token definition
 * @see Requirements: 2.1-2.6 - Visual specifications
 */
private object ChipTokens {
    // MARK: - Spacing Tokens
    
    /** Block padding achieving 32px visual height with buttonSm typography
     * References: inset.075 semantic token (6px)
     * Calculation: 6px padding × 2 + 20px content = 32px
     * @see Requirements: 2.1 - Block padding
     */
    val paddingBlock: Dp = DesignTokens.space_inset_075  // 6dp (inset.075)
    
    /** Inline padding for horizontal spacing
     * References: space.inset.150 (12px)
     * @see Requirements: 2.2 - Inline padding
     */
    val paddingInline: Dp = DesignTokens.space_150  // 12dp
    
    /** Gap between icon and label
     * References: space.grouped.tight (4px)
     * @see Requirements: 2.3 - Icon-label gap
     */
    val iconGap: Dp = DesignTokens.space_050  // 4dp
    
    // MARK: - Size Tokens
    
    /** Icon size for chip icons
     * References: icon.size075 (20px)
     * @see Requirements: 1.2 - Icon size
     */
    val iconSize: Dp = DesignTokens.icon_size_075  // 20dp
    
    /** Minimum tap area for accessibility
     * References: tapAreaRecommended (48px)
     * @see Requirements: 2.6, 7.6 - Tap area
     */
    val tapArea: Dp = DesignTokens.tap_area_recommended  // 48dp
    
    // MARK: - Border Tokens
    
    /** Border width for chip outline
     * References: borderDefault → borderWidth100 (1px)
     * @see Requirements: 1.5 - Border width
     */
    val borderWidth: Dp = DesignTokens.border_width_100  // 1dp
    
    // MARK: - Color Tokens
    
    /** Default background color
     * References: color.structure.surface
     * @see Requirements: 3.1 - Default state background
     */
    val backgroundColor: Color = Color(DesignTokens.color_surface)
    
    /** Default border color
     * References: color.structure.border
     * @see Requirements: 3.1 - Default state border
     */
    val borderColor: Color = Color(DesignTokens.color_border)
    
    /** Default text color
     * References: color.text.default
     * @see Requirements: 3.1 - Default state text
     */
    val textColor: Color = Color(DesignTokens.color_text_default)
    
    /** Primary action color for pressed border
     * References: color.action.primary
     * @see Requirements: 3.3 - Pressed state border
     */
    val primaryColor: Color = Color(DesignTokens.color_primary)
    
    // MARK: - Animation Tokens
    
    /** Animation duration for state transitions
     * References: motion.selectionTransition (150ms)
     * @see Requirements: 3.4 - State transition animation
     */
    val animationDuration: Int = DesignTokens.Duration.Duration150  // 150ms
}

// MARK: - ChipBase Composable

/**
 * ChipBase Composable
 * 
 * A compact, interactive element with pill shape for filtering, selection, or input.
 * 
 * Usage:
 * ```kotlin
 * // Basic chip
 * ChipBase(label = "Category") {
 *     println("Chip pressed")
 * }
 * 
 * // Chip with icon
 * ChipBase(label = "Filter", icon = "check") {
 *     println("Filter pressed")
 * }
 * 
 * // Chip with testTag
 * ChipBase(label = "Tag", testTag = "tag-chip") {
 *     println("Tag pressed")
 * }
 * ```
 * 
 * @param label Chip text content (required)
 * @param icon Optional leading icon name
 * @param testTag Test identifier for automated testing
 * @param modifier Additional Compose modifiers
 * @param onClick Press callback
 * 
 * @see Requirements: 1.1, 1.2, 1.3 in .kiro/specs/045-chip-base/requirements.md
 * @see Requirements: 6.3, 6.4, 6.5 - Cross-platform implementation
 */
@Composable
fun ChipBase(
    label: String,
    icon: String? = null,
    testTag: String? = null,
    modifier: Modifier = Modifier,
    onClick: () -> Unit = {}
) {
    // Track interaction state for pressed styling
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    
    // Calculate state-based colors
    // @see Requirements: 3.1, 3.3 - State styling
    val backgroundColor = if (isPressed) {
        // Apply pressed blend (12% darker)
        ChipTokens.backgroundColor.pressedBlend()
    } else {
        ChipTokens.backgroundColor
    }
    
    val borderColor = if (isPressed) {
        ChipTokens.primaryColor
    } else {
        ChipTokens.borderColor
    }
    
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
            contentDescription = label
        }
    
    // Chip container using Surface for clickable behavior
    // @see Requirements: 2.4 - Pill shape using RoundedCornerShape(50)
    // @see Requirements: 2.6 - 48dp minimum tap area
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(50),  // Pill shape (radius.full equivalent)
        color = backgroundColor,
        border = BorderStroke(
            width = ChipTokens.borderWidth,
            color = borderColor
        ),
        interactionSource = interactionSource,
        modifier = chipModifier.sizeIn(minHeight = ChipTokens.tapArea)
    ) {
        // Content row with icon and label
        // @see Requirements: 2.1, 2.2, 2.3 - Spacing specifications
        Row(
            horizontalArrangement = Arrangement.spacedBy(ChipTokens.iconGap),
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(
                horizontal = ChipTokens.paddingInline,
                vertical = ChipTokens.paddingBlock
            )
        ) {
            // Optional leading icon
            // @see Requirements: 1.2 - Icon rendering via Icon-Base at icon.size075
            if (icon != null) {
                IconBase(
                    name = icon,
                    size = ChipTokens.iconSize,
                    color = ChipTokens.textColor
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
                color = ChipTokens.textColor
            )
        }
    }
}

// MARK: - Preview

/**
 * Preview composable for ChipBase component.
 * 
 * Demonstrates various chip configurations:
 * - Basic chip with label only
 * - Chip with icon
 * - Multiple chips in a row
 * - Chip with testTag
 * - Token reference documentation
 * 
 * @see Requirements: 6.5 - Cross-platform consistency verification
 */
@Preview(showBackground = true, name = "ChipBase Component")
@Composable
fun ChipBasePreview() {
    androidx.compose.foundation.layout.Column(
        modifier = Modifier.padding(DesignTokens.space_200),
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_300)
    ) {
        // Title
        Text(
            text = "ChipBase Component",
            style = androidx.compose.material3.MaterialTheme.typography.titleMedium
        )
        
        // Basic chip
        Text(
            text = "Basic Chip",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        ChipBase(label = "Category") {
            println("Category pressed")
        }
        
        // Chip with icon
        Text(
            text = "Chip with Icon",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        ChipBase(label = "Filter", icon = "check") {
            println("Filter pressed")
        }
        
        // Multiple chips
        Text(
            text = "Multiple Chips",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Row(
            horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100)
        ) {
            ChipBase(label = "All") {
                println("All pressed")
            }
            ChipBase(label = "Active", icon = "circle") {
                println("Active pressed")
            }
            ChipBase(label = "Completed", icon = "check") {
                println("Completed pressed")
            }
        }
        
        // Chip with testTag
        Text(
            text = "Chip with testTag",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        ChipBase(
            label = "Test Chip",
            testTag = "test-chip"
        ) {
            println("Test chip pressed")
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
                text = "paddingBlock: ${ChipTokens.paddingBlock.value.toInt()}dp (inset.075)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "paddingInline: ${ChipTokens.paddingInline.value.toInt()}dp (space150)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "iconGap: ${ChipTokens.iconGap.value.toInt()}dp (space050)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "iconSize: ${ChipTokens.iconSize.value.toInt()}dp (iconSize075)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "tapArea: ${ChipTokens.tapArea.value.toInt()}dp (tapAreaRecommended)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "borderWidth: ${ChipTokens.borderWidth.value.toInt()}dp (borderWidth100)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
        }
    }
}
