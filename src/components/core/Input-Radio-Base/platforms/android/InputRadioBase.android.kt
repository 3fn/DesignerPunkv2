/**
 * Input-Radio-Base Component for Android Platform
 * 
 * Cross-platform radio button component with three size variants (sm, md, lg),
 * configurable label alignment, and support for selected/unselected states.
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Input-Radio-Base
 * Component Type: Primitive (Base)
 * 
 * Follows True Native Architecture with platform-specific Jetpack Compose implementation
 * while maintaining API consistency with web and iOS platforms.
 * 
 * Key Differences from Checkbox:
 * - Single-select (mutual exclusivity within a group) vs multi-select
 * - Circular shape with filled dot indicator vs rounded square with checkmark
 * - No indeterminate state (not applicable to radio buttons)
 * - Uses selectedValue: String? for group coordination
 * 
 * Part of the DesignerPunk Form Inputs Component system.
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered.
 * 
 * @module Input-Radio-Base/platforms/android
 * @see Requirements: 1.1-1.7, 2.1-2.9, 3.1-3.4, 4.1-4.6, 7.3, 8.5
 */

package com.designerpunk.components.core

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.ripple.rememberRipple
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
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.designerpunk.tokens.BlendTokenValues
import com.designerpunk.tokens.DesignTokens

// MARK: - Enums

/**
 * Radio size variants
 * 
 * Defines three size options that follow the 8px baseline grid.
 * Each size determines dot size, inset padding, circle size, gap, and typography.
 * 
 * Circle Size Formula: dotSize + (inset × 2)
 * - Small: 24dp circle (16dp dot + 4dp inset × 2)
 * - Medium: 32dp circle (20dp dot + 6dp inset × 2)
 * - Large: 40dp circle (24dp dot + 8dp inset × 2)
 * 
 * @see Requirement 2.1-2.9 in .kiro/specs/047-input-radio-base/requirements.md
 */
enum class RadioSize {
    Small,
    Medium,
    Large;

    /** Dot size token for this radio size (matches icon size tokens)
     * @see Requirement 4.3 - Dot size matching size variant
     */
    val dotSize: Dp
        get() = when (this) {
            Small -> DesignTokens.icon_size_050   // 16dp
            Medium -> DesignTokens.icon_size_075  // 20dp
            Large -> DesignTokens.icon_size_100   // 24dp
        }

    /** Inset padding for this radio size
     * @see Requirement 2.1-2.3 - Circle size calculations
     */
    val inset: Dp
        get() = when (this) {
            Small -> DesignTokens.space_inset_050   // 4dp
            Medium -> DesignTokens.space_inset_075  // 6dp
            Large -> DesignTokens.space_inset_100   // 8dp
        }

    /** Computed circle size (dot + inset padding on both sides)
     * @see Requirement 2.1-2.3 - Circle size calculations
     */
    val circleSize: Dp
        get() = dotSize + (inset * 2)

    /** Gap between radio circle and label
     * @see Requirement 2.7-2.8 - Gap tokens
     */
    val gap: Dp
        get() = when (this) {
            Small, Medium -> DesignTokens.space_grouped_normal  // 8dp
            Large -> DesignTokens.space_grouped_loose           // 12dp
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
 * Label alignment options relative to radio circle.
 * 
 * - Center: Vertically centers the label with the radio circle (default)
 * - Top: Aligns the label to the top of the radio circle (for multi-line labels)
 * 
 * @see Requirement 3.1-3.4 in .kiro/specs/047-input-radio-base/requirements.md
 */
enum class RadioLabelAlignment {
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
 * Radio-specific design tokens.
 * 
 * These tokens are component-level tokens specific to the Radio component.
 * They reference the core DesignTokens where possible.
 * 
 * @see Requirements: 1.1-1.7 - Radio states
 */
private object RadioTokens {
    // MARK: - Color Tokens

    /** Default border color (unselected)
     * References: color.feedback.select.border.default
     * @see Requirement 1.1 - Unselected state border
     */
    val defaultBorderColor: Color
        get() = Color(DesignTokens.color_feedback_select_border_default)

    /** Active border color (selected)
     * References: color.feedback.select.border.rest
     * @see Requirement 1.2 - Selected state border
     */
    val activeBorderColor: Color
        get() = Color(DesignTokens.color_feedback_select_border_rest)

    /** Error border color
     * References: color.feedback.error.border
     * @see Requirement 1.5 - Error state border
     */
    val errorBorderColor: Color
        get() = Color(DesignTokens.color_feedback_error_border)

    /** Dot fill color (selected state)
     * References: color.feedback.select.background.rest
     * @see Requirement 4.2 - Dot fill color
     */
    val dotColor: Color
        get() = Color(DesignTokens.color_feedback_select_background_rest)

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

    /** Border width for radio circle
     * References: borderEmphasis (2dp)
     * @see Requirement 4.5 - 2px border width
     */
    val borderWidth: Dp = DesignTokens.border_emphasis

    // MARK: - Animation Tokens

    /** Animation duration for state transitions
     * References: motion.selectionTransition (250ms)
     * @see Requirement 1.6 - State transition animation
     */
    val animationDuration: Int = DesignTokens.Duration.Duration250

    // MARK: - Spacing Tokens

    /** Minimum tap area for accessibility
     * References: tapAreaMinimum (44dp)
     * @see Requirement 6.6 - Minimum touch target
     */
    val tapAreaMinimum: Dp = DesignTokens.tap_area_minimum

    /** Spacing between helper/error text and radio
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

// MARK: - RadioCircle Composable

/**
 * RadioCircle composable
 * 
 * Renders the radio circle with border and animated dot indicator.
 * Uses AnimatedVisibility for dot scale-in/scale-out transitions.
 * 
 * @param selected Whether the radio is currently selected
 * @param size Radio size variant
 * @param hasError Whether the radio has an error state
 * 
 * @see Requirements 1.1-1.7 - Radio states
 * @see Requirements 4.1-4.6 - Selection indicator (dot)
 */
@Composable
private fun RadioCircle(
    selected: Boolean,
    size: RadioSize,
    hasError: Boolean
) {
    // Animated border color for smooth state transitions
    // @see Requirement 1.6 - State transition animation using motion.selectionTransition
    val borderColor by animateColorAsState(
        targetValue = when {
            hasError -> RadioTokens.errorBorderColor
            selected -> RadioTokens.activeBorderColor
            else -> RadioTokens.defaultBorderColor
        },
        animationSpec = tween(durationMillis = RadioTokens.animationDuration),
        label = "radioBorder"
    )

    Box(
        modifier = Modifier
            .size(size.circleSize)
            // @see Requirement 4.5 - borderEmphasis (2px) width
            // @see Requirement 4.6 - radius.full (50%) for circular shape
            .border(
                width = RadioTokens.borderWidth,
                color = borderColor,
                shape = CircleShape
            ),
        contentAlignment = Alignment.Center
    ) {
        // Animated dot indicator
        // @see Requirement 4.1 - Filled circular dot centered within outer circle
        // @see Requirement 1.7 - Dot scales in using motion.selectionTransition timing
        AnimatedVisibility(
            visible = selected,
            enter = scaleIn(
                animationSpec = tween(durationMillis = RadioTokens.animationDuration)
            ),
            exit = scaleOut(
                animationSpec = tween(durationMillis = RadioTokens.animationDuration)
            )
        ) {
            Box(
                modifier = Modifier
                    // @see Requirement 4.3 - Dot size matches icon size token for current variant
                    .size(size.dotSize)
                    // @see Requirement 4.2 - color.feedback.select.background.rest fill
                    .background(RadioTokens.dotColor, CircleShape)
            )
        }
    }
}

// MARK: - InputRadioBase Composable

/**
 * InputRadioBase Composable
 * 
 * A radio button component with three size variants, configurable label alignment,
 * and support for selected/unselected states.
 * 
 * Uses theme-aware blend utilities for Material ripple effect on press.
 * 
 * ## Accessibility (TalkBack Support)
 * 
 * This component is fully accessible with TalkBack:
 * - **Role**: RadioButton role is set for proper TalkBack behavior
 * - **State**: TalkBack announces "selected" or "not selected"
 * - **Label**: The label text is announced as the content description
 * - **Touch Target**: Minimum 44dp touch target for WCAG 2.5.5 compliance
 * - **Helper/Error Text**: Announced separately with clear prefixes
 * 
 * Usage:
 * ```kotlin
 * // Basic usage
 * var selectedValue by remember { mutableStateOf<String?>(null) }
 * InputRadioBase(
 *     value = "option-a",
 *     label = "Option A",
 *     selectedValue = selectedValue,
 *     onSelectedChange = { selectedValue = it }
 * )
 * 
 * // With size and alignment
 * InputRadioBase(
 *     value = "premium",
 *     label = "Premium Plan",
 *     selectedValue = selectedValue,
 *     onSelectedChange = { selectedValue = it },
 *     size = RadioSize.Large,
 *     labelAlign = RadioLabelAlignment.Top
 * )
 * ```
 * 
 * Requirements:
 * - 1.1-1.7: Radio states (unselected, selected, error)
 * - 2.1-2.9: Size variants (sm, md, lg)
 * - 3.1-3.4: Label alignment (center, top)
 * - 4.1-4.6: Selection indicator (dot)
 * - 7.3: Material ripple effect using blend.pressedDarker (12%)
 * - 8.5: Compose's native RTL handling (Arrangement.Start/End)
 * 
 * @param value Value for form submission and group identification (required)
 * @param label Label text (required for accessibility)
 * @param selectedValue Currently selected value in the group
 * @param onSelectedChange Called when this radio is selected
 * @param modifier Additional Compose modifiers
 * @param size Size variant (default: Medium)
 * @param labelAlign Label alignment (default: Center)
 * @param helperText Optional helper text displayed below radio
 * @param errorMessage Optional error message displayed below helper text
 * @param testTag Test identifier for automated testing
 */
@Composable
fun InputRadioBase(
    value: String,
    label: String,
    selectedValue: String?,
    onSelectedChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    size: RadioSize = RadioSize.Medium,
    labelAlign: RadioLabelAlignment = RadioLabelAlignment.Center,
    helperText: String? = null,
    errorMessage: String? = null,
    testTag: String? = null
) {
    val isSelected = selectedValue == value
    val hasError = errorMessage != null
    val interactionSource = remember { MutableInteractionSource() }

    // Accessibility state description
    // @see Requirement 6.2 - Screen reader announces state
    val stateDesc = if (isSelected) "selected" else "not selected"

    Column(
        modifier = modifier
            .then(
                if (testTag != null) Modifier.testTag(testTag) else Modifier
            )
    ) {
        // Main radio row
        Row(
            verticalAlignment = labelAlign.verticalAlignment,
            // @see Requirement 8.5 - Compose's native RTL handling
            horizontalArrangement = Arrangement.spacedBy(size.gap),
            modifier = Modifier
                // @see Requirement 6.6 - Minimum 44dp touch target
                .sizeIn(
                    minHeight = RadioTokens.tapAreaMinimum,
                    minWidth = RadioTokens.tapAreaMinimum
                )
                // @see Requirement 6.5 - Entire label area tappable
                .clickable(
                    onClick = { onSelectedChange(value) },
                    interactionSource = interactionSource,
                    // @see Requirement 7.3 - Material ripple effect using blend.pressedDarker (12%)
                    indication = rememberRipple(
                        bounded = true,
                        color = RadioTokens.activeBorderColor.copy(
                            alpha = BlendTokenValues.pressedDarker
                        )
                    )
                )
                // @see Requirements 6.1-6.2 - Accessibility semantics for TalkBack
                .semantics(mergeDescendants = true) {
                    contentDescription = label
                    stateDescription = stateDesc
                    role = Role.RadioButton
                    selected = isSelected
                }
        ) {
            // Radio circle with dot
            RadioCircle(
                selected = isSelected,
                size = size,
                hasError = hasError
            )

            // Label text
            // @see Requirement 2.4-2.6 - Label typography
            Text(
                text = label,
                style = TextStyle(
                    fontSize = size.labelFontSize,
                    fontWeight = FontWeight.Medium
                ),
                color = RadioTokens.labelColor
            )
        }

        // Helper text and error message
        // @see Requirements 5.1-5.6 - Helper text and error messages
        if (helperText != null || errorMessage != null) {
            Spacer(modifier = Modifier.height(RadioTokens.textSpacing))

            Column(
                verticalArrangement = Arrangement.spacedBy(RadioTokens.minimalSpacing),
                modifier = Modifier.padding(start = size.circleSize + size.gap)
            ) {
                // Helper text
                // @see Requirement 5.1 - Helper text below radio
                if (helperText != null) {
                    Text(
                        text = helperText,
                        style = TextStyle(
                            fontSize = RadioTokens.helperFontSize,
                            fontWeight = FontWeight.Normal
                        ),
                        color = RadioTokens.helperTextColor,
                        modifier = Modifier.clearAndSetSemantics {
                            contentDescription = "Helper text: $helperText"
                        }
                    )
                }

                // Error message
                // @see Requirement 5.2-5.5 - Error message with error styling
                if (errorMessage != null) {
                    Text(
                        text = errorMessage,
                        style = TextStyle(
                            fontSize = RadioTokens.helperFontSize,
                            fontWeight = FontWeight.Normal
                        ),
                        color = RadioTokens.errorTextColor,
                        modifier = Modifier.clearAndSetSemantics {
                            contentDescription = "Error: $errorMessage"
                        }
                    )
                }
            }
        }
    }
}

// MARK: - Preview

/**
 * Preview composable for InputRadioBase component.
 * 
 * Demonstrates various radio configurations:
 * - Size variants (sm, md, lg)
 * - States (unselected, selected, error)
 * - Label alignment (center, top)
 * - Helper text and error messages
 * - Radio group behavior (mutual exclusivity)
 */
@Preview(showBackground = true, name = "InputRadioBase Component")
@Composable
fun InputRadioBasePreview() {
    Column(
        modifier = Modifier.padding(DesignTokens.space_200),
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_300)
    ) {
        // Title
        Text(
            text = "InputRadioBase Component",
            style = androidx.compose.material3.MaterialTheme.typography.titleMedium
        )

        // Size variants
        Text(
            text = "Size Variants",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Column(verticalArrangement = Arrangement.spacedBy(DesignTokens.space_200)) {
            InputRadioBase(
                value = "sm",
                label = "Small radio",
                selectedValue = null,
                onSelectedChange = {},
                size = RadioSize.Small
            )
            InputRadioBase(
                value = "md",
                label = "Medium radio (default)",
                selectedValue = "md",
                onSelectedChange = {},
                size = RadioSize.Medium
            )
            InputRadioBase(
                value = "lg",
                label = "Large radio",
                selectedValue = null,
                onSelectedChange = {},
                size = RadioSize.Large
            )
        }

        // States
        Text(
            text = "States",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Column(verticalArrangement = Arrangement.spacedBy(DesignTokens.space_200)) {
            InputRadioBase(
                value = "unselected",
                label = "Unselected",
                selectedValue = null,
                onSelectedChange = {}
            )
            InputRadioBase(
                value = "selected",
                label = "Selected",
                selectedValue = "selected",
                onSelectedChange = {}
            )
            InputRadioBase(
                value = "error",
                label = "Error state",
                selectedValue = null,
                onSelectedChange = {},
                errorMessage = "This field is required"
            )
        }

        // Label alignment
        Text(
            text = "Label Alignment",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Column(verticalArrangement = Arrangement.spacedBy(DesignTokens.space_200)) {
            InputRadioBase(
                value = "center",
                label = "Center aligned (default)",
                selectedValue = null,
                onSelectedChange = {},
                labelAlign = RadioLabelAlignment.Center
            )
            InputRadioBase(
                value = "top",
                label = "This is a multi-line label that demonstrates top alignment for longer text content",
                selectedValue = null,
                onSelectedChange = {},
                labelAlign = RadioLabelAlignment.Top,
                size = RadioSize.Large
            )
        }

        // Helper text and error
        Text(
            text = "Helper Text & Error",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Column(verticalArrangement = Arrangement.spacedBy(DesignTokens.space_200)) {
            InputRadioBase(
                value = "helper",
                label = "With helper text",
                selectedValue = null,
                onSelectedChange = {},
                helperText = "This is helpful information"
            )
            InputRadioBase(
                value = "error-msg",
                label = "With error message",
                selectedValue = null,
                onSelectedChange = {},
                errorMessage = "You must select an option"
            )
            InputRadioBase(
                value = "both",
                label = "With both",
                selectedValue = null,
                onSelectedChange = {},
                helperText = "Please read carefully",
                errorMessage = "This field is required"
            )
        }

        // Radio group example
        Text(
            text = "Radio Group Example",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        var selectedPlan by remember { mutableStateOf("basic") }
        Column(verticalArrangement = Arrangement.spacedBy(DesignTokens.space_200)) {
            InputRadioBase(
                value = "basic",
                label = "Basic Plan - $9/month",
                selectedValue = selectedPlan,
                onSelectedChange = { selectedPlan = it },
                helperText = "For individuals"
            )
            InputRadioBase(
                value = "pro",
                label = "Pro Plan - $19/month",
                selectedValue = selectedPlan,
                onSelectedChange = { selectedPlan = it },
                helperText = "For small teams"
            )
            InputRadioBase(
                value = "enterprise",
                label = "Enterprise Plan - $49/month",
                selectedValue = selectedPlan,
                onSelectedChange = { selectedPlan = it },
                size = RadioSize.Large,
                helperText = "For large organizations"
            )
            Text(
                text = "Selected: $selectedPlan",
                style = TextStyle(fontSize = RadioTokens.helperFontSizeI made),
                color = RadioTokens.helperTextColor
            )
        }
    }
}
