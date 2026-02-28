/**
 * Chip-Filter Component for Android Platform
 * 
 * Stemma System: Chip Family
 * Component Type: Semantic Variant
 * Inherits: Chip-Base
 * Naming Convention: [Family]-[Type] = Chip-Filter
 * 
 * A toggleable chip component used for filtering content by multiple criteria.
 * Extends Chip-Base with selected state styling and checkmark icon when selected.
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
 * @module Chip-Filter/platforms/android
 * @see .kiro/specs/045-chip-base/design.md for design specification
 * @see Requirements 4.1-4.6, 6.3, 6.5 in .kiro/specs/045-chip-base/requirements.md
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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.designerpunk.tokens.DesignTokens
import com.designerpunk.tokens.pressedBlend
import com.designerpunk.tokens.color_feedback_select_background_rest
import com.designerpunk.tokens.color_feedback_select_text_rest

// MARK: - Chip-Filter Tokens

/**
 * Chip-Filter specific design tokens.
 * 
 * Extends ChipTokens with selected state colors.
 * Uses color.feedback.select.* tokens for selected state styling.
 * 
 * @see Requirements: 4.2 - Selected state styling
 */
private object ChipFilterTokens {
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
    
    // MARK: - Default State Color Tokens (inherited from ChipTokens)
    
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
    
    // MARK: - Selected State Color Tokens
    
    /** Selected state background color
     * References: color.feedback.select.background.rest
     * @see Requirement 4.2 - Selected state background
     */
    val selectedBackgroundColor: Color = Color(DesignTokens.color_feedback_select_background_rest)
    
    /** Selected state border color
     * References: color.feedback.select.text.rest (used for border)
     * @see Requirement 4.2 - Selected state border
     */
    val selectedBorderColor: Color = Color(DesignTokens.color_feedback_select_text_rest)
    
    /** Selected state text color
     * References: color.feedback.select.text.rest
     * @see Requirement 4.2 - Selected state text
     */
    val selectedTextColor: Color = Color(DesignTokens.color_feedback_select_text_rest)
    
    // MARK: - Animation Tokens
    
    /** Animation duration for state transitions
     * References: motion.selectionTransition (150ms)
     */
    val animationDuration: Int = DesignTokens.Duration.Duration150  // 150ms
}

// MARK: - ChipFilter Composable

/**
 * ChipFilter Composable
 * 
 * A toggleable chip component with selected state styling and checkmark icon.
 * 
 * Usage:
 * ```kotlin
 * // Basic filter chip (controlled)
 * var isSelected by remember { mutableStateOf(false) }
 * ChipFilter(
 *     label = "Category",
 *     selected = isSelected,
 *     onSelectionChange = { isSelected = it }
 * )
 * 
 * // Filter chip with icon (icon replaced by checkmark when selected)
 * ChipFilter(
 *     label = "Filter",
 *     icon = "settings",
 *     selected = isSelected,
 *     onSelectionChange = { isSelected = it }
 * )
 * 
 * // Filter chip with testTag
 * ChipFilter(
 *     label = "Tag",
 *     selected = isSelected,
 *     testTag = "tag-filter",
 *     onSelectionChange = { isSelected = it }
 * )
 * ```
 * 
 * @param label Chip text content (required)
 * @param selected Whether chip is in selected state
 * @param icon Optional leading icon name (replaced by checkmark when selected)
 * @param testTag Test identifier for automated testing
 * @param modifier Additional Compose modifiers
 * @param onSelectionChange Called when selection state changes
 * @param onClick Press callback (inherited from Chip-Base behavior)
 * 
 * @see Requirements: 4.1-4.6 in .kiro/specs/045-chip-base/requirements.md
 * @see Requirements: 6.3, 6.5 - Cross-platform implementation
 */
@Composable
fun ChipFilter(
    label: String,
    selected: Boolean = false,
    icon: String? = null,
    testTag: String? = null,
    modifier: Modifier = Modifier,
    onSelectionChange: (Boolean) -> Unit = {},
    onClick: () -> Unit = {}
) {
    // Track interaction state for pressed styling
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    
    // Calculate state-based colors
    // @see Requirements: 4.2 - Selected state styling
    val backgroundColor = when {
        selected && isPressed -> {
            // Selected + pressed: slightly darker selected background
            ChipFilterTokens.selectedBackgroundColor.copy(alpha = 0.9f)
        }
        selected -> {
            ChipFilterTokens.selectedBackgroundColor
        }
        isPressed -> {
            // Not selected + pressed: apply pressed blend
            ChipFilterTokens.backgroundColor.pressedBlend()
        }
        else -> {
            ChipFilterTokens.backgroundColor
        }
    }
    
    val borderColor = when {
        selected -> ChipFilterTokens.selectedBorderColor
        isPressed -> ChipFilterTokens.primaryColor
        else -> ChipFilterTokens.borderColor
    }
    
    val textColor = if (selected) {
        ChipFilterTokens.selectedTextColor
    } else {
        ChipFilterTokens.textColor
    }
    
    // Determine which icon to show:
    // - When selected: always show checkmark (replaces leading icon)
    // - When not selected: show leading icon if provided
    // @see Requirement 4.3, 4.4 - Checkmark when selected, replaces leading icon
    val displayIcon = if (selected) "check" else icon
    val showIcon = selected || icon != null
    
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
            // Announce selected state to screen readers
            // @see Requirement 7.4 - aria-pressed equivalent for Android
            stateDescription = if (selected) "Selected" else "Not selected"
        }
    
    // Chip container using Surface for clickable behavior
    // @see Requirements: 2.4 - Pill shape using RoundedCornerShape(50)
    // @see Requirements: 2.6 - 48dp minimum tap area
    Surface(
        onClick = {
            // Toggle selected state
            val newSelected = !selected
            onSelectionChange(newSelected)
            onClick()
        },
        shape = RoundedCornerShape(50),  // Pill shape (radius.full equivalent)
        color = backgroundColor,
        border = BorderStroke(
            width = ChipFilterTokens.borderWidth,
            color = borderColor
        ),
        interactionSource = interactionSource,
        modifier = chipModifier.sizeIn(minHeight = ChipFilterTokens.tapArea)
    ) {
        // Content row with icon and label
        // @see Requirements: 2.1, 2.2, 2.3 - Spacing specifications
        Row(
            horizontalArrangement = Arrangement.spacedBy(ChipFilterTokens.iconGap),
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(
                horizontal = ChipFilterTokens.paddingInline,
                vertical = ChipFilterTokens.paddingBlock
            )
        ) {
            // Icon (checkmark when selected, or leading icon when not selected)
            // @see Requirements: 4.3, 4.4 - Checkmark when selected, replaces leading icon
            if (showIcon && displayIcon != null) {
                IconBase(
                    name = displayIcon,
                    size = ChipFilterTokens.iconSize,
                    color = textColor
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
                color = textColor
            )
        }
    }
}

// MARK: - Preview

/**
 * Preview composable for ChipFilter component.
 * 
 * Demonstrates various chip configurations:
 * - Basic filter chip (not selected)
 * - Selected filter chip (with checkmark)
 * - Filter chip with icon (not selected)
 * - Filter chip with icon (selected - shows checkmark instead)
 * - Multiple filter chips in a row
 * - Token reference documentation
 * 
 * @see Requirements: 6.5 - Cross-platform consistency verification
 */
@Preview(showBackground = true, name = "ChipFilter Component")
@Composable
fun ChipFilterPreview() {
    // State for interactive preview
    var isSelected1 by remember { mutableStateOf(false) }
    var isSelected2 by remember { mutableStateOf(true) }
    var isSelected3 by remember { mutableStateOf(false) }
    var isSelected4 by remember { mutableStateOf(true) }
    var isSelectedAll by remember { mutableStateOf(false) }
    var isSelectedActive by remember { mutableStateOf(true) }
    var isSelectedCompleted by remember { mutableStateOf(false) }
    
    androidx.compose.foundation.layout.Column(
        modifier = Modifier.padding(DesignTokens.space_200),
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_300)
    ) {
        // Title
        Text(
            text = "ChipFilter Component",
            style = androidx.compose.material3.MaterialTheme.typography.titleMedium
        )
        
        // Basic filter chip (not selected)
        Text(
            text = "Not Selected",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        ChipFilter(
            label = "Category",
            selected = isSelected1,
            onSelectionChange = { isSelected1 = it }
        )
        
        // Selected filter chip
        Text(
            text = "Selected (with checkmark)",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        ChipFilter(
            label = "Active",
            selected = isSelected2,
            onSelectionChange = { isSelected2 = it }
        )
        
        // Filter chip with icon (not selected)
        Text(
            text = "With Icon (not selected)",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        ChipFilter(
            label = "Settings",
            icon = "settings",
            selected = isSelected3,
            onSelectionChange = { isSelected3 = it }
        )
        
        // Filter chip with icon (selected - shows checkmark instead)
        Text(
            text = "With Icon (selected - checkmark replaces icon)",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        ChipFilter(
            label = "Settings",
            icon = "settings",
            selected = isSelected4,
            onSelectionChange = { isSelected4 = it }
        )
        
        // Multiple filter chips
        Text(
            text = "Multiple Filter Chips",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Row(
            horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100)
        ) {
            ChipFilter(
                label = "All",
                selected = isSelectedAll,
                onSelectionChange = { isSelectedAll = it }
            )
            ChipFilter(
                label = "Active",
                icon = "circle",
                selected = isSelectedActive,
                onSelectionChange = { isSelectedActive = it }
            )
            ChipFilter(
                label = "Completed",
                icon = "check",
                selected = isSelectedCompleted,
                onSelectionChange = { isSelectedCompleted = it }
            )
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
                text = "paddingBlock: ${ChipFilterTokens.paddingBlock.value.toInt()}dp (space075)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "paddingInline: ${ChipFilterTokens.paddingInline.value.toInt()}dp (space150)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "iconGap: ${ChipFilterTokens.iconGap.value.toInt()}dp (space050)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "iconSize: ${ChipFilterTokens.iconSize.value.toInt()}dp (iconSize075)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "tapArea: ${ChipFilterTokens.tapArea.value.toInt()}dp (tapAreaRecommended)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
        }
        
        // Selected state token references
        Text(
            text = "Selected State Tokens",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        androidx.compose.foundation.layout.Column(
            verticalArrangement = Arrangement.spacedBy(DesignTokens.space_050)
        ) {
            Text(
                text = "selectedBackground: color.feedback.select.background.rest",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "selectedBorder: color.feedback.select.text.rest",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
            Text(
                text = "selectedText: color.feedback.select.text.rest",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall
            )
        }
    }
}
