/**
 * Progress-Stepper-Detailed Component for Android Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Semantic (Detailed)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Stepper-Detailed
 * 
 * Detailed stepper composing Node-Base, Connector-Base, and Label-Base primitives.
 * Supports state derivation with priority: error > completed > current > incomplete.
 * Icon precedence: completed = checkmark always, user icon for current/incomplete/error.
 * 
 * @module Progress-Stepper-Detailed/platforms/android
 * @see Requirements: 4.1-4.16, 11.14-11.22
 * @see .kiro/specs/048-progress-family/design.md
 */

package com.designerpunk.components.core

import android.util.Log
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.CollectionInfo
import androidx.compose.ui.semantics.CollectionItemInfo
import androidx.compose.ui.semantics.collectionInfo
import androidx.compose.ui.semantics.collectionItemInfo
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import com.designerpunk.tokens.DesignTokens

// MARK: - Constants

/** Maximum number of steps supported */
private const val STEPPER_DETAILED_MAX_STEPS = 8

private const val TAG = "ProgressStepperDetailed"


// MARK: - Gap Token Values

/**
 * Gap values between stepper elements per size variant.
 * References progress.node.gap.* component tokens.
 * Note: SM is not supported for steppers.
 */
private fun stepperDetailedGap(size: ProgressNodeSize): Dp {
    return when (size) {
        ProgressNodeSize.SM -> throw IllegalArgumentException(
            "Steppers require size 'md' or 'lg'. Size 'sm' is only supported for Pagination-Base."
        )
        ProgressNodeSize.MD -> DesignTokens.space_100   /* progress.node.gap.md */
        ProgressNodeSize.LG -> DesignTokens.space_150   /* progress.node.gap.lg */
    }
}

// MARK: - Step Definition

/**
 * Step definition for Stepper-Detailed.
 * 
 * @see Requirements 4.1-4.8
 */
data class StepDefinitionAndroid(
    val label: String,
    val helperText: String? = null,
    val icon: String? = null,
    val optional: Boolean = false
)

// MARK: - State Derivation

/**
 * Derive node state for a step in the detailed stepper.
 * Priority: error > completed > current > incomplete
 * 
 * @see Requirements 4.3, 10.3-10.7
 */
private fun deriveDetailedNodeState(index: Int, currentStep: Int, errorSteps: List<Int>): ProgressNodeState {
    if (index in errorSteps) return ProgressNodeState.ERROR
    if (index < currentStep) return ProgressNodeState.COMPLETED
    if (index == currentStep) return ProgressNodeState.CURRENT
    return ProgressNodeState.INCOMPLETE
}

/**
 * Derive content for a node based on its state and step definition.
 * Icon precedence: completed = checkmark always, user icon for others.
 * 
 * @see Requirements 4.4-4.6, 11.17-11.19
 */
private fun deriveDetailedNodeContent(state: ProgressNodeState, step: StepDefinitionAndroid): ProgressNodeContent {
    if (state == ProgressNodeState.COMPLETED) return ProgressNodeContent.CHECKMARK
    if (step.icon != null) return ProgressNodeContent.ICON
    return ProgressNodeContent.NONE
}

/**
 * Derive connector state between two adjacent nodes.
 * Active when both adjacent nodes are completed.
 * 
 * @see Requirements 11.21-11.22
 */
private fun deriveDetailedConnectorState(leftState: ProgressNodeState, rightState: ProgressNodeState): ProgressConnectorState {
    return if (leftState == ProgressNodeState.COMPLETED && rightState == ProgressNodeState.COMPLETED) {
        ProgressConnectorState.ACTIVE
    } else {
        ProgressConnectorState.INACTIVE
    }
}

/**
 * Build accessibility label for a single step.
 * @see Requirements 4.13-4.15, 7.5-7.6
 */
private fun stepAccessibilityLabel(
    index: Int,
    totalSteps: Int,
    step: StepDefinitionAndroid,
    errorSteps: List<Int>
): String {
    var label = "Step ${index + 1} of $totalSteps: ${step.label}"
    if ((index + 1) in errorSteps) {
        label += ", error"
    }
    if (step.optional) {
        label += ", optional"
    }
    return label
}

// MARK: - Progress-Stepper-Detailed Composable

/**
 * Progress-Stepper-Detailed Composable
 * 
 * Composes ProgressIndicatorNodeBase, ProgressIndicatorConnectorBase,
 * and ProgressIndicatorLabelBase primitives to create a detailed stepper
 * with labels and optional icons for complex multi-step flows.
 * 
 * @param steps Array of step definitions (max 8)
 * @param currentStep Current active step (1-indexed)
 * @param size Size variant. Only MD and LG supported. Defaults to MD
 * @param errorSteps List of step indices in error state. Defaults to empty
 * @param accessibilityLabel Custom accessibility label override
 * @param testTag Test identifier. Defaults to null
 * @param modifier Additional Compose modifiers
 * 
 * @see Requirements: 4.1-4.16, 11.14-11.22
 */
@Composable
fun ProgressStepperDetailed(
    steps: List<StepDefinitionAndroid>,
    currentStep: Int,
    size: ProgressNodeSize = ProgressNodeSize.MD,
    errorSteps: List<Int> = emptyList(),
    accessibilityLabel: String? = null,
    testTag: String? = null,
    modifier: Modifier = Modifier
) {
    // Validate size ≠ SM
    // @see Requirement 4.16, 8.10
    require(size != ProgressNodeSize.SM) {
        "Steppers require size 'md' or 'lg'. Size 'sm' is only supported for Pagination-Base."
    }

    // Validate and clamp steps count
    // @see Requirements 4.9-4.10
    val effectiveSteps = if (steps.size > STEPPER_DETAILED_MAX_STEPS) {
        if (BuildConfig.DEBUG) {
            throw IllegalArgumentException(
                "Progress-Stepper-Detailed supports a maximum of $STEPPER_DETAILED_MAX_STEPS steps. " +
                "Received ${steps.size} steps. " +
                "For longer flows, break into multiple sub-flows."
            )
        } else {
            Log.w(
                TAG,
                "Progress-Stepper-Detailed: Received ${steps.size} steps but maximum is $STEPPER_DETAILED_MAX_STEPS. " +
                "Rendering first $STEPPER_DETAILED_MAX_STEPS steps only."
            )
            steps.take(STEPPER_DETAILED_MAX_STEPS)
        }
    } else {
        steps
    }

    val totalSteps = effectiveSteps.size

    // Clamp currentStep to valid range [1, totalSteps]
    // @see Requirement 4.11
    val effectiveCurrentStep = currentStep.coerceIn(1, totalSteps)

    // Filter errorSteps to valid range [1, totalSteps]
    // @see Requirement 4.12
    val effectiveErrorSteps = errorSteps.filter { it in 1..totalSteps }

    // Derive all node states
    val nodeStates = (1..totalSteps).map { index ->
        deriveDetailedNodeState(index, effectiveCurrentStep, effectiveErrorSteps)
    }

    // Accessibility label
    val effectiveLabel = accessibilityLabel ?: "Step $effectiveCurrentStep of $totalSteps"

    val rowModifier = modifier
        .then(if (testTag != null) Modifier.testTag(testTag) else Modifier)
        .semantics {
            contentDescription = effectiveLabel
            // Convey list semantics for TalkBack (role="list" equivalent)
            // @see Requirements 4.13, 7.4, 7.13
            collectionInfo = CollectionInfo(rowCount = 1, columnCount = totalSteps)
        }

    Row(
        modifier = rowModifier,
        verticalAlignment = Alignment.Top
    ) {
        for (i in 0 until totalSteps) {
            val state = nodeStates[i]
            val step = effectiveSteps[i]
            val content = deriveDetailedNodeContent(state, step)

            // Each step is a weighted column
            Column(
                modifier = Modifier
                    .weight(1f)
                    .semantics {
                        contentDescription = stepAccessibilityLabel(i, totalSteps, step, effectiveErrorSteps)
                        // Convey listitem semantics for TalkBack (role="listitem" equivalent)
                        // @see Requirements 4.13, 7.4
                        collectionItemInfo = CollectionItemInfo(
                            rowIndex = 0,
                            rowSpan = 1,
                            columnIndex = i,
                            columnSpan = 1
                        )
                    },
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Node row with connectors
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Left side: connector or spacer
                    if (i > 0) {
                        Box(modifier = Modifier.weight(1f)) {
                            ProgressIndicatorConnectorBase(
                                state = deriveDetailedConnectorState(nodeStates[i - 1], nodeStates[i])
                            )
                        }
                    } else {
                        Spacer(modifier = Modifier.weight(1f))
                    }

                    // Node
                    ProgressIndicatorNodeBase(
                        state = state,
                        size = size,
                        content = content,
                        icon = if (content == ProgressNodeContent.ICON) step.icon else null
                    )

                    // Right side: connector or spacer
                    if (i < totalSteps - 1) {
                        Box(modifier = Modifier.weight(1f)) {
                            ProgressIndicatorConnectorBase(
                                state = deriveDetailedConnectorState(nodeStates[i], nodeStates[i + 1])
                            )
                        }
                    } else {
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }

                // Label below node
                // @see Requirements 4.7-4.8, 11.16, 11.20
                Column(
                    modifier = Modifier.padding(top = stepperDetailedGap(size))
                ) {
                    ProgressIndicatorLabelBase(
                        label = step.label,
                        helperText = step.helperText,
                        optional = step.optional
                    )
                }
            }
        }
    }
}

// MARK: - Preview

@Preview(showBackground = true, name = "ProgressStepperDetailed Variants")
@Composable
fun ProgressStepperDetailedPreview() {
    Column(
        modifier = Modifier.padding(DesignTokens.space_200),
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_300)
    ) {
        Text(text = "Progress-Stepper-Detailed")

        // Basic 3-step
        Text(text = "3 steps, current=2, md")
        ProgressStepperDetailed(
            steps = listOf(
                StepDefinitionAndroid(label = "Personal Info"),
                StepDefinitionAndroid(label = "Payment"),
                StepDefinitionAndroid(label = "Review")
            ),
            currentStep = 2,
            size = ProgressNodeSize.MD
        )

        // With icons and error
        Text(text = "4 steps, current=2, error=[3], lg, icons")
        ProgressStepperDetailed(
            steps = listOf(
                StepDefinitionAndroid(label = "Account", icon = "person"),
                StepDefinitionAndroid(label = "Details", helperText = "Address & phone"),
                StepDefinitionAndroid(label = "Verify", icon = "shield"),
                StepDefinitionAndroid(label = "Done")
            ),
            currentStep = 2,
            size = ProgressNodeSize.LG,
            errorSteps = listOf(3)
        )

        // With optional step
        Text(text = "3 steps, current=1, optional step")
        ProgressStepperDetailed(
            steps = listOf(
                StepDefinitionAndroid(label = "Required"),
                StepDefinitionAndroid(label = "Optional", optional = true),
                StepDefinitionAndroid(label = "Submit")
            ),
            currentStep = 1,
            size = ProgressNodeSize.MD
        )
    }
}
