/**
 * Input-Checkbox-Base Component for Android Platform
 * 
 * Cross-platform checkbox component with three size variants (sm, md, lg),
 * configurable label alignment, and support for checked, unchecked, and indeterminate states.
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Input-Checkbox-Base
 * Component Type: Primitive (Base)
 * 
 * Follows True Native Architecture with platform-specific Jetpack Compose implementation
 * while maintaining API consistency with web and iOS platforms.
 * 
 * Uses Icon-Base component for checkmark/minus icon rendering.
 * Uses theme-aware blend utilities for state colors.
 * 
 * Part of the DesignerPunk Form Inputs Component system.
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered.
 * 
 * @module Input-Checkbox-Base/platforms/android
 * @see Requirements: 1.1-1.7, 2.1-2.9, 4.1-4.5, 6.1-6.6, 7.3, 8.5
 */

package com.designerpunk.components.core

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.ripple.rememberRipple
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.semantics.toggleableState
import androidx.compose.ui.state.ToggleableState
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.designerpunk.tokens.BlendTokenValues
import com.designerpunk.tokens.DesignTokens
import com.designerpunk.tokens.pressedBlend

// MARK: - Enums

/**
 * Checkbox size variants
 * 
 * Defines three size options that follow the 8px baseline grid.
 * Each size determines icon size, inset padding, gap, and typography.
 * 
 * - Small: 24dp box (16dp icon + 4dp inset × 2)
 * - Medium: 32dp box (20dp icon + 6dp inset × 2)
 * - Large: 40dp box (24dp icon + 8dp inset × 2)
 * 
 * @see Requirement 2.1-2.9 in .kiro/specs/046-input-checkbox-base/requirements.md
 */
enum class CheckboxSize {
    Small,
    Medium,
    Large;
    
    /** Icon size token for this checkbox size
     * @see Requirement 4.3 - Icon size matching checkbox size variant
     */
    val iconSize: Dp
        get() = when (this) {
            Small -> DesignTokens.icon_size_050   // 16dp
            Medium -> DesignTokens.icon_size_075  // 20dp
            Large -> DesignTokens.icon_size_100   // 24dp
        }
    
    /** Inset padding for this checkbox size
     * @see Requirement 2.1-2.3 - Box size calculations
     */
    val inset: Dp
        get() = when (this) {
            Small -> DesignTokens.space_inset_050   // 4dp
            Medium -> DesignTokens.space_inset_075  // 6dp
            Large -> DesignTokens.space_inset_100   // 8dp
        }
    
    /** Computed box size (icon + inset padding on both sides)
     * @see Requirement 2.1-2.3 - Box size calculations
     */
    val boxSize: Dp
        get() = iconSize + (inset * 2)
    
    /** Gap between checkbox box and label
     * @see Requirement 2.7-2.8 - Gap tokens
     */
    val gap: Dp
        get() = when (this) {
            Small, Medium -> DesignTokens.space_grouped_normal  // 8dp
            Large -> DesignTokens.space_grouped_loose           // 12dp
        }
    
    /** Border radius for checkbox box
     * @see Design document - radiusSubtle for sm, radiusSmall for md/lg
     */
    val radius: Dp
        get() = when (this) {
            Small -> DesignTokens.radius_subtle   // 2dp
            Medium, Large -> DesignTokens.radius_small  // 4dp
        }
    
    /** Typography font size for label
     * @see Requirement 2.4-2.6 - Label typography
     */
    val labelFontSize: Float
        get() = when (this) {
            Small -> DesignTokens.font_size_075   // 14sp (labelSm)
            Medium -> DesignTokens.font_size_100  // 16sp (labelMd)
            Large -> DesignTokens.font_size_125   // 18sp (labelLg)
        }
}

/**
 * Label alignment options relative to checkbox box.
 * 
 * - Center: Vertically centers the label with the checkbox box (default)
 * - Top: Aligns the label to the top of the checkbox box (for multi-line labels)
 * 
 * @see Requirement 3.1-3.4 in .kiro/specs/046-input-checkbox-base/requirements.md
 */
enum class LabelAlignment {
    Center,
    Top;
    
    /** Compose vertical alignment for Row */
    val verticalAlignment: Alignment.Vertical
        get() = when (this) {
            Center -> Alignment.CenterVertically
            Top -> Alignment.Top
        }
}

// MARK: - Component Tokens

/**
 * Checkbox-specific design tokens.
 * 
 * These tokens are component-level tokens specific to the Checkbox component.
 * They reference the core DesignTokens where possible.
 * 
 * Note: Semantic color tokens in DesignTokens are defined as `val` (not `const val`)
 * because they reference primitive color tokens. We access them directly.
 * 
 * @see Requirements: 1.1-1.7 - Checkbox states
 */
private object CheckboxTokens {
    // MARK: - Color Tokens
    
    /** Unchecked background color (transparent)
     * @see Requirement 1.1 - Unchecked state
     */
    val uncheckedBackground: Color = Color.Transparent
    
    /** Checked/indeterminate background color
     * References: color.feedback.select.background.rest
     * @see Requirement 1.2, 1.3 - Checked/indeterminate state
     */
    val checkedBackground: Color
        get() = Color(DesignTokens.color_feedback_select_background_rest)
    
    /** Default border color (unchecked)
     * References: color.feedback.select.border.default
     * @see Requirement 1.1 - Unchecked state border
     */
    val defaultBorderColor: Color
        get() = Color(DesignTokens.color_feedback_select_border_default)
    
    /** Active border color (checked/hover)
     * References: color.feedback.select.border.rest
     * @see Requirement 1.2, 1.4 - Checked/hover state border
     */
    val activeBorderColor: Color
        get() = Color(DesignTokens.color_feedback_select_border_rest)
    
    /** Error border color
     * References: color.feedback.error.border
     * @see Requirement 1.6 - Error state border
     */
    val errorBorderColor: Color
        get() = Color(DesignTokens.color_feedback_error_border)
    
    /** Icon color (on dark/filled background)
     * References: color.contrast.onDark
     * @see Requirement 4.4 - Icon color
     */
    val iconColor: Color
        get() = Color(DesignTokens.color_contrast_on_dark)
    
    /** Label text color
     * References: color.text.default
     */
    val labelColor: Color
        get() = Color(DesignTokens.color_text_default)
    
    /** Helper text color
     * References: color.text.muted
     */
    val helperTextColor: Color
        get() = Color(DesignTokens.color_text_muted)
    
    /** Error text color
     * References: color.feedback.error.text
     */
    val errorTextColor: Color
        get() = Color(DesignTokens.color_feedback_error_text)
    
    // MARK: - Border Tokens
    
    /** Border width for checkbox box
     * References: borderEmphasis (2dp)
     * @see Design document - 2px border for better visibility
     */
    val borderWidth: Dp = DesignTokens.border_emphasis
    
    // MARK: - Animation Tokens
    
    /** Animation duration for state transitions
     * References: motion.selectionTransition (250ms)
     * @see Requirement 1.7 - State transition animation
     */
    val animationDuration: Int = DesignTokens.Duration.Duration250
    
    // MARK: - Spacing Tokens
    
    /** Minimum tap area for accessibility
     * References: tapAreaMinimum (44dp)
     * @see Requirement 6.6 - Minimum touch target
     */
    val tapAreaMinimum: Dp = DesignTokens.tap_area_minimum
    
    /** Spacing between helper/error text and checkbox
     * References: space.grouped.tight (4dp)
     */
    val textSpacing: Dp = DesignTokens.space_grouped_tight
    
    /** Minimal spacing between helper and error text
     * References: space.grouped.minimal (2dp)
     */
    val minimalSpacing: Dp = DesignTokens.space_grouped_minimal
    
    // MARK: - Typography Tokens
    
    /** Helper/error text font size
     * References: fontSize050 (12sp)
     */
    val helperFontSize: Float = DesignTokens.font_size_050
}

// MARK: - InputCheckboxBase Composable

/**
 * InputCheckboxBase Composable
 * 
 * A checkbox component with three size variants, configurable label alignment,
 * and support for checked, unchecked, and indeterminate states.
 * 
 * Uses Icon-Base for checkmark/minus icon rendering and theme-aware blend
 * utilities for state colors.
 * 
 * ## Accessibility (TalkBack Support)
 * 
 * This component is fully accessible with TalkBack:
 * - **Role**: Checkbox role is set for proper TalkBack behavior
 * - **State**: TalkBack announces "checked", "not checked", or "partially checked"
 * - **Label**: The label text is announced as the content description
 * - **Hint**: Action hints guide users ("Double tap to check/uncheck")
 * - **Touch Target**: Minimum 44dp touch target for WCAG 2.5.5 compliance
 * - **Helper/Error Text**: Announced separately with clear prefixes
 * 
 * Usage:
 * ```kotlin
 * // Basic usage
 * var isChecked by remember { mutableStateOf(false) }
 * InputCheckboxBase(
 *     checked = isChecked,
 *     onCheckedChange = { isChecked = it },
 *     label = "Accept terms"
 * )
 * 
 * // With size and alignment
 * InputCheckboxBase(
 *     checked = isChecked,
 *     onCheckedChange = { isChecked = it },
 *     label = "Subscribe to newsletter",
 *     size = CheckboxSize.Large,
 *     labelAlign = LabelAlignment.Top
 * )
 * 
 * // With helper text and error
 * InputCheckboxBase(
 *     checked = isChecked,
 *     onCheckedChange = { isChecked = it },
 *     label = "I agree to the terms",
 *     helperText = "Please read the terms carefully",
 *     errorMessage = "You must accept the terms"
 * )
 * ```
 * 
 * Requirements:
 * - 1.1-1.7: Checkbox states (unchecked, checked, indeterminate, error)
 * - 2.1-2.9: Size variants (sm, md, lg)
 * - 3.1-3.4: Label alignment (center, top)
 * - 4.1-4.5: Icon-Base integration
 * - 6.1-6.6: Accessibility (TalkBack, touch targets)
 * - 7.3: Material ripple effect using blend.pressedDarker
 * - 8.5: Compose's native RTL handling (Arrangement.Start/End)
 * 
 * @param checked Whether checkbox is checked
 * @param onCheckedChange Called when checkbox state changes
 * @param label Label text (required for accessibility)
 * @param modifier Additional Compose modifiers
 * @param indeterminate Indeterminate state (overrides checked visually)
 * @param size Size variant (default: Medium)
 * @param labelAlign Label alignment (default: Center)
 * @param helperText Optional helper text displayed below checkbox
 * @param errorMessage Optional error message displayed below helper text
 * @param testTag Test identifier for automated testing
 */
@Composable
fun InputCheckboxBase(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    indeterminate: Boolean = false,
    size: CheckboxSize = CheckboxSize.Medium,
    labelAlign: LabelAlignment = LabelAlignment.Center,
    helperText: String? = null,
    errorMessage: String? = null,
    testTag: String? = null
) {
    // Track interaction state for ripple effect
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    
    // Determine visual state
    val hasError = errorMessage != null
    val isActive = checked || indeterminate
    
    // Animated colors for smooth state transitions
    // @see Requirement 1.7 - State transition animation using motion.selectionTransition
    val backgroundColor by animateColorAsState(
        targetValue = if (isActive) CheckboxTokens.checkedBackground else CheckboxTokens.uncheckedBackground,
        animationSpec = tween(durationMillis = CheckboxTokens.animationDuration),
        label = "checkboxBackground"
    )
    
    val borderColor by animateColorAsState(
        targetValue = when {
            hasError -> CheckboxTokens.errorBorderColor
            isActive -> CheckboxTokens.activeBorderColor
            else -> CheckboxTokens.defaultBorderColor
        },
        animationSpec = tween(durationMillis = CheckboxTokens.animationDuration),
        label = "checkboxBorder"
    )
    
    // Accessibility state description
    // @see Requirement 6.2 - Screen reader announces state
    val stateDesc = when {
        indeterminate -> "partially checked"
        checked -> "checked"
        else -> "unchecked"
    }
    
    // Toggleable state for TalkBack checkbox semantics
    // @see Requirement 6.2 - TalkBack announces state changes
    val toggleableState = when {
        indeterminate -> ToggleableState.Indeterminate
        checked -> ToggleableState.On
        else -> ToggleableState.Off
    }
    
    // Accessibility hint providing action context
    // @see Requirement 6.4 - Keyboard/tap interaction guidance
    val accessibilityHint = when {
        indeterminate -> "Double tap to check"
        checked -> "Double tap to uncheck"
        else -> "Double tap to check"
    }
    
    Column(
        modifier = modifier
            .then(
                if (testTag != null) Modifier.testTag(testTag) else Modifier
            )
    ) {
        // Main checkbox row
        Row(
            verticalAlignment = labelAlign.verticalAlignment,
            // @see Requirement 8.5 - Compose's native RTL handling (Arrangement.Start/End)
            horizontalArrangement = Arrangement.spacedBy(size.gap),
            modifier = Modifier
                // @see Requirement 6.6 - Minimum 44dp touch target
                // Ensures WCAG 2.5.5 Target Size compliance
                .sizeIn(minHeight = CheckboxTokens.tapAreaMinimum, minWidth = CheckboxTokens.tapAreaMinimum)
                // @see Requirement 6.5 - Entire label area tappable
                .clickable(
                    onClick = { onCheckedChange(!checked) },
                    interactionSource = interactionSource,
                    // @see Requirement 7.3 - Material ripple effect using blend.pressedDarker
                    indication = rememberRipple(
                        bounded = true,
                        color = CheckboxTokens.activeBorderColor.copy(
                            alpha = BlendTokenValues.pressedDarker
                        )
                    )
                )
                // @see Requirements 6.1-6.4 - Accessibility semantics for TalkBack
                // Merges all child semantics into a single accessible element
                .semantics(mergeDescendants = true) {
                    // Requirement 6.1: Associate label with checkbox via contentDescription
                    contentDescription = "$label, $accessibilityHint"
                    // Requirement 6.2: TalkBack announces state (checked/unchecked/partially checked)
                    stateDescription = stateDesc
                    // Checkbox role for proper TalkBack behavior
                    role = Role.Checkbox
                    // Toggleable state enables TalkBack to announce state changes
                    // This is critical for TalkBack to properly announce "checked" or "not checked"
                    this.toggleableState = toggleableState
                }
        ) {
            // Checkbox box
            CheckboxBox(
                isActive = isActive,
                indeterminate = indeterminate,
                size = size,
                backgroundColor = backgroundColor,
                borderColor = borderColor
            )
            
            // Label text
            // @see Requirement 2.4-2.6 - Label typography
            Text(
                text = label,
                style = TextStyle(
                    fontSize = size.labelFontSize.sp,
                    fontWeight = FontWeight.Medium
                ),
                color = CheckboxTokens.labelColor
            )
        }
        
        // Helper text and error message
        // @see Requirements 5.1-5.6 - Helper text and error messages
        if (helperText != null || errorMessage != null) {
            Spacer(modifier = Modifier.height(CheckboxTokens.textSpacing))
            
            Column(
                verticalArrangement = Arrangement.spacedBy(CheckboxTokens.minimalSpacing),
                modifier = Modifier.padding(start = size.boxSize + size.gap)
            ) {
                // Helper text
                // @see Requirement 5.1 - Helper text below checkbox
                // @see Requirement 5.6 - Associate helper text with checkbox via aria-describedby equivalent
                if (helperText != null) {
                    Text(
                        text = helperText,
                        style = TextStyle(
                            fontSize = CheckboxTokens.helperFontSize.sp,
                            fontWeight = FontWeight.Normal
                        ),
                        color = CheckboxTokens.helperTextColor,
                        modifier = Modifier.clearAndSetSemantics {
                            // Provide clear accessibility label for TalkBack
                            contentDescription = "Helper text: $helperText"
                        }
                    )
                }
                
                // Error message
                // @see Requirement 5.2-5.5 - Error message with error styling
                // @see Requirement 5.5 - Associate error with checkbox via aria-describedby equivalent
                if (errorMessage != null) {
                    Text(
                        text = errorMessage,
                        style = TextStyle(
                            fontSize = CheckboxTokens.helperFontSize.sp,
                            fontWeight = FontWeight.Normal
                        ),
                        color = CheckboxTokens.errorTextColor,
                        modifier = Modifier.clearAndSetSemantics {
                            // Provide clear accessibility label for TalkBack
                            // Error messages are announced with higher priority
                            contentDescription = "Error: $errorMessage"
                        }
                    )
                }
            }
        }
    }
}

/**
 * Checkbox box composable
 * 
 * Renders the checkbox box with border, background, and icon.
 * 
 * @param isActive Whether checkbox is checked or indeterminate
 * @param indeterminate Whether checkbox is in indeterminate state
 * @param size Checkbox size variant
 * @param backgroundColor Animated background color
 * @param borderColor Animated border color
 */
@Composable
private fun CheckboxBox(
    isActive: Boolean,
    indeterminate: Boolean,
    size: CheckboxSize,
    backgroundColor: Color,
    borderColor: Color
) {
    Box(
        modifier = Modifier
            .size(size.boxSize)
            .clip(RoundedCornerShape(size.radius))
            .background(backgroundColor)
            .border(
                width = CheckboxTokens.borderWidth,
                color = borderColor,
                shape = RoundedCornerShape(size.radius)
            ),
        contentAlignment = Alignment.Center
    ) {
        // Icon (check or minus)
        // @see Requirements 4.1-4.5 - Icon-Base integration
        if (isActive) {
            IconBase(
                name = if (indeterminate) "minus" else "check",
                size = size.iconSize,
                color = CheckboxTokens.iconColor
            )
        }
    }
}

// MARK: - Preview

/**
 * Preview composable for InputCheckboxBase component.
 * 
 * Demonstrates various checkbox configurations:
 * - Size variants (sm, md, lg)
 * - States (unchecked, checked, indeterminate, error)
 * - Label alignment (center, top)
 * - Helper text and error messages
 */
@Preview(showBackground = true, name = "InputCheckboxBase Component")
@Composable
fun InputCheckboxBasePreview() {
    Column(
        modifier = Modifier.padding(DesignTokens.space_200),
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_300)
    ) {
        // Title
        Text(
            text = "InputCheckboxBase Component",
            style = androidx.compose.material3.MaterialTheme.typography.titleMedium
        )
        
        // Size variants
        Text(
            text = "Size Variants",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Column(verticalArrangement = Arrangement.spacedBy(DesignTokens.space_200)) {
            InputCheckboxBase(
                checked = false,
                onCheckedChange = {},
                label = "Small checkbox",
                size = CheckboxSize.Small
            )
            InputCheckboxBase(
                checked = false,
                onCheckedChange = {},
                label = "Medium checkbox (default)",
                size = CheckboxSize.Medium
            )
            InputCheckboxBase(
                checked = false,
                onCheckedChange = {},
                label = "Large checkbox",
                size = CheckboxSize.Large
            )
        }
        
        // States
        Text(
            text = "States",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Column(verticalArrangement = Arrangement.spacedBy(DesignTokens.space_200)) {
            InputCheckboxBase(
                checked = false,
                onCheckedChange = {},
                label = "Unchecked"
            )
            InputCheckboxBase(
                checked = true,
                onCheckedChange = {},
                label = "Checked"
            )
            InputCheckboxBase(
                checked = false,
                onCheckedChange = {},
                label = "Indeterminate",
                indeterminate = true
            )
            InputCheckboxBase(
                checked = false,
                onCheckedChange = {},
                label = "Error state",
                errorMessage = "This field is required"
            )
        }
        
        // Label alignment
        Text(
            text = "Label Alignment",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Column(verticalArrangement = Arrangement.spacedBy(DesignTokens.space_200)) {
            InputCheckboxBase(
                checked = false,
                onCheckedChange = {},
                label = "Center aligned (default)",
                labelAlign = LabelAlignment.Center
            )
            InputCheckboxBase(
                checked = false,
                onCheckedChange = {},
                label = "This is a multi-line label that demonstrates top alignment for longer text content",
                labelAlign = LabelAlignment.Top,
                size = CheckboxSize.Large,
                modifier = Modifier.fillMaxWidth(0.8f)
            )
        }
        
        // Helper text and error
        Text(
            text = "Helper Text & Error",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Column(verticalArrangement = Arrangement.spacedBy(DesignTokens.space_200)) {
            InputCheckboxBase(
                checked = false,
                onCheckedChange = {},
                label = "With helper text",
                helperText = "This is helpful information"
            )
            InputCheckboxBase(
                checked = false,
                onCheckedChange = {},
                label = "With error message",
                errorMessage = "You must accept the terms"
            )
            InputCheckboxBase(
                checked = false,
                onCheckedChange = {},
                label = "With both",
                helperText = "Please read carefully",
                errorMessage = "This field is required"
            )
        }
    }
}
