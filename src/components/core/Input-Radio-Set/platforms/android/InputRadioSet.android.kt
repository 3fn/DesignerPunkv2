/**
 * Input-Radio-Set Component for Android Platform
 * 
 * Orchestrator component that manages a group of Input-Radio-Base children,
 * providing mutual exclusivity, controlled selection state, validation,
 * and error display.
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Input-Radio-Set
 * Component Type: Pattern (Set)
 * 
 * Architectural Principle: ORCHESTRATION, NOT DUPLICATION
 * This component orchestrates child Input-Radio-Base components via Jetpack
 * Compose CompositionLocal. It does NOT duplicate radio circle/dot rendering
 * logic from Base.
 * 
 * Platform State Coordination (Android):
 * - Uses CompositionLocalProvider to pass selectedValue to children
 * - Uses CompositionLocalProvider to pass onSelectionChange to children
 * - Uses CompositionLocalProvider to pass size to children
 * - Children read CompositionLocal values to determine their selected state
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered.
 * 
 * @module Input-Radio-Set/platforms/android
 * @see Requirements: 9.1, 9.3, 9.4, 9.8, 11.3
 */

package com.designerpunk.components.core

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.selectableGroup
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.sp
import com.designerpunk.tokens.DesignTokens


// MARK: - CompositionLocal Definitions

/**
 * CompositionLocal for passing the currently selected value from
 * Input-Radio-Set to child Input-Radio-Base components.
 * 
 * Default is null (no selection).
 * 
 * @see Requirement 11.3 - Android uses CompositionLocal to pass selection state
 */
val LocalRadioSetSelectedValue = compositionLocalOf<String?> { null }

/**
 * CompositionLocal for passing the selection change callback from
 * Input-Radio-Set to child Input-Radio-Base components.
 * 
 * Default is a no-op lambda. Children call this when selected to
 * notify the Set of the new selection (mutual exclusivity).
 * 
 * @see Requirement 9.4 - Call onSelectionChange with selected value
 */
val LocalRadioSetOnSelectionChange = compositionLocalOf<(String) -> Unit> { {} }

/**
 * CompositionLocal for passing the size variant from Input-Radio-Set
 * to all child Input-Radio-Base components.
 * 
 * Default is null, meaning children use their own size prop.
 * When set, children should prefer this value for group consistency.
 * 
 * @see Requirement 9.10 - Size prop applied to all child radios
 */
val LocalRadioSetSize = compositionLocalOf<RadioSize?> { null }

// MARK: - Component Tokens

/**
 * Radio Set-specific design tokens.
 * 
 * These tokens are component-level tokens specific to the Radio Set component.
 * They reference the core DesignTokens where possible.
 */
private object RadioSetTokens {
    /** Error text color
     * References: color.feedback.error.text
     * @see Requirement 9.8 - Error message display
     */
    val errorTextColor: Color
        get() = Color(DesignTokens.color_feedback_error_text)

    /** Error text font size
     * References: fontSize050 (12sp)
     */
    val errorFontSize: Float = DesignTokens.font_size_050

    /** Spacing between error message and radio group content
     * References: space.grouped.normal (8dp)
     */
    val groupSpacing = DesignTokens.space_grouped_normal
}

// MARK: - InputRadioSet Composable

/**
 * InputRadioSet Composable
 * 
 * Orchestrates child Input-Radio-Base components to provide group behavior:
 * - Mutual exclusivity via shared selectedValue through CompositionLocal
 * - Controlled selection state passed through CompositionLocalProvider
 * - Group-level error message display with liveRegion for TalkBack
 * - Consistent sizing across all children via CompositionLocal
 * - RadioGroup semantics for TalkBack accessibility
 * 
 * Usage:
 * ```kotlin
 * var selectedPlan by remember { mutableStateOf<String?>(null) }
 * 
 * InputRadioSet(
 *     selectedValue = selectedPlan,
 *     onSelectionChange = { selectedPlan = it }
 * ) {
 *     InputRadioBase(
 *         value = "basic",
 *         label = "Basic Plan",
 *         selectedValue = selectedPlan,
 *         onSelectedChange = { selectedPlan = it }
 *     )
 *     InputRadioBase(
 *         value = "pro",
 *         label = "Pro Plan",
 *         selectedValue = selectedPlan,
 *         onSelectedChange = { selectedPlan = it }
 *     )
 * }
 * 
 * // With validation and error
 * InputRadioSet(
 *     selectedValue = selectedPlan,
 *     onSelectionChange = { selectedPlan = it },
 *     required = true,
 *     error = true,
 *     errorMessage = "Please select a plan"
 * ) {
 *     // ... child radios
 * }
 * ```
 * 
 * Requirements:
 * - 9.1: Orchestrates child Input-Radio-Base components (not duplicate rendering)
 * - 9.3: Passes selected state to matching child via CompositionLocal
 * - 9.4: Calls onSelectionChange when selection changes
 * - 9.8: Displays error message when error is true
 * - 11.3: Uses CompositionLocal to pass selection state
 * 
 * @param selectedValue Currently selected value (controlled)
 * @param onSelectionChange Callback when selection changes
 * @param modifier Additional Compose modifiers
 * @param required Whether a selection is required for validation
 * @param error Error state indicator
 * @param errorMessage Error message to display above the radio group
 * @param size Size variant applied to all children
 * @param testTag Test identifier for automated testing
 * @param content Child composable content (Input-Radio-Base components)
 */
@Composable
fun InputRadioSet(
    selectedValue: String?,
    onSelectionChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    required: Boolean = false,
    error: Boolean = false,
    errorMessage: String? = null,
    size: RadioSize = RadioSize.Medium,
    testTag: String? = null,
    content: @Composable () -> Unit
) {
    Column(
        verticalArrangement = Arrangement.spacedBy(RadioSetTokens.groupSpacing),
        modifier = modifier
            .then(
                if (testTag != null) Modifier.testTag(testTag) else Modifier
            )
            // @see Requirement 9.2 - Apply role="radiogroup" equivalent semantics
            // @see Requirement 9.9 - TalkBack announces group context
            // selectableGroup() tells TalkBack this is a group of selectable items
            // (the Compose equivalent of role="radiogroup")
            .semantics {
                selectableGroup()
            }
    ) {
        // Error message display
        // @see Requirement 9.8 - Display errorMessage when error is true
        // @see Requirement 9.9 - Error message announced to screen readers via liveRegion
        if (error && errorMessage != null) {
            Text(
                text = errorMessage,
                style = TextStyle(
                    fontSize = RadioSetTokens.errorFontSize.sp,
                    fontWeight = FontWeight.Normal
                ),
                color = RadioSetTokens.errorTextColor,
                modifier = Modifier.semantics {
                    // @see Requirement 9.9 - liveRegion for TalkBack announcement
                    liveRegion = LiveRegionMode.Polite
                    contentDescription = "Error: $errorMessage"
                }
            )
        }

        // Child content with CompositionLocal providers
        // @see Requirement 9.1 - Orchestrate children (not duplicate rendering)
        // @see Requirement 11.3 - Use CompositionLocal to pass selection state
        CompositionLocalProvider(
            LocalRadioSetSelectedValue provides selectedValue,
            LocalRadioSetOnSelectionChange provides onSelectionChange,
            LocalRadioSetSize provides size
        ) {
            content()
        }
    }
}

// MARK: - Preview

/**
 * Preview composable for InputRadioSet component.
 * 
 * Demonstrates various radio set configurations:
 * - Basic radio group with mutual exclusivity
 * - Error state with error message
 * - Large size variant propagated to children
 */
@Preview(showBackground = true, name = "InputRadioSet Component")
@Composable
fun InputRadioSetPreview() {
    Column(
        modifier = Modifier.padding(DesignTokens.space_200),
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_300)
    ) {
        // Title
        Text(
            text = "InputRadioSet Component",
            style = androidx.compose.material3.MaterialTheme.typography.titleMedium
        )

        // Basic radio group
        Text(
            text = "Basic Radio Group",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        var selectedBasic by remember { mutableStateOf<String?>("option-b") }
        InputRadioSet(
            selectedValue = selectedBasic,
            onSelectionChange = { selectedBasic = it }
        ) {
            InputRadioBase(
                value = "option-a",
                label = "Option A",
                selectedValue = selectedBasic,
                onSelectedChange = { selectedBasic = it }
            )
            InputRadioBase(
                value = "option-b",
                label = "Option B",
                selectedValue = selectedBasic,
                onSelectedChange = { selectedBasic = it }
            )
            InputRadioBase(
                value = "option-c",
                label = "Option C",
                selectedValue = selectedBasic,
                onSelectedChange = { selectedBasic = it }
            )
        }
        Text(
            text = "Selected: ${selectedBasic ?: "None"}",
            style = TextStyle(fontSize = 12f.sp),
            color = Color.Gray
        )

        // Error state
        Text(
            text = "Error State",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        var selectedError by remember { mutableStateOf<String?>(null) }
        InputRadioSet(
            selectedValue = selectedError,
            onSelectionChange = { selectedError = it },
            required = true,
            error = true,
            errorMessage = "Please select an option"
        ) {
            InputRadioBase(
                value = "yes",
                label = "Yes",
                selectedValue = selectedError,
                onSelectedChange = { selectedError = it }
            )
            InputRadioBase(
                value = "no",
                label = "No",
                selectedValue = selectedError,
                onSelectedChange = { selectedError = it }
            )
        }

        // Large size variant
        Text(
            text = "Large Size",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        var selectedLarge by remember { mutableStateOf("basic") }
        InputRadioSet(
            selectedValue = selectedLarge,
            onSelectionChange = { selectedLarge = it },
            size = RadioSize.Large
        ) {
            InputRadioBase(
                value = "basic",
                label = "Basic Plan - $9/month",
                selectedValue = selectedLarge,
                onSelectedChange = { selectedLarge = it },
                size = RadioSize.Large,
                helperText = "For individuals"
            )
            InputRadioBase(
                value = "pro",
                label = "Pro Plan - $19/month",
                selectedValue = selectedLarge,
                onSelectedChange = { selectedLarge = it },
                size = RadioSize.Large,
                helperText = "For small teams"
            )
            InputRadioBase(
                value = "enterprise",
                label = "Enterprise Plan - $49/month",
                selectedValue = selectedLarge,
                onSelectedChange = { selectedLarge = it },
                size = RadioSize.Large,
                helperText = "For large organizations"
            )
        }
    }
}