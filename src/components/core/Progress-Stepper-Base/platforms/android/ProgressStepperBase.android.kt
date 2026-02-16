/**
 * Progress-Stepper-Base Component for Android Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Semantic (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Stepper-Base
 * 
 * Stepper indicator composing Node-Base and Connector-Base primitives.
 * Supports state derivation with priority: error > completed > current > incomplete.
 * 
 * @module Progress-Stepper-Base/platforms/android
 * @see Requirements: 3.1-3.17, 10.3-10.7, 11.7-11.13
 * @see .kiro/specs/048-progress-family/design.md
 */

package com.designerpunk.components.core

import android.util.Log
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import com.designerpunk.tokens.DesignTokens

// MARK: - Constants

/** Maximum number of steps supported */
private const val STEPPER_MAX_STEPS = 8

private const val TAG = "ProgressStepperBase"


// MARK: - Gap Token Values

/**
 * Gap values between stepper elements per size variant.
 * References progress.node.gap.* component tokens.
 * Note: SM is not supported for steppers.
 */
private fun stepperGap(size: ProgressNodeSize): Dp {
    return when (size) {
        ProgressNodeSize.SM -> throw IllegalArgumentException(
            "Steppers require size 'md' or 'lg'. Size 'sm' is only supported for Pagination-Base."
        )
        ProgressNodeSize.MD -> DesignTokens.space_100   /* progress.node.gap.md */
        ProgressNodeSize.LG -> DesignTokens.space_150   /* progress.node.gap.lg */
    }
}

// MARK: - State Derivation

/**
 * Derive node state for a step in the stepper.
 * Priority: error > completed > current > incomplete
 * 
 * @see Requirements 10.3-10.7
 */
private fun deriveStepperNodeState(index: Int, currentStep: Int, errorSteps: List<Int>): ProgressNodeState {
    if (index in errorSteps) return ProgressNodeState.ERROR
    if (index < currentStep) return ProgressNodeState.COMPLETED
    if (index == currentStep) return ProgressNodeState.CURRENT
    return ProgressNodeState.INCOMPLETE
}

/**
 * Derive content for a node based on its state.
 * Completed nodes get checkmark, all others get none.
 * 
 * @see Requirements 3.8-3.9, 11.10-11.11
 */
private fun deriveStepperNodeContent(state: ProgressNodeState): ProgressNodeContent {
    return if (state == ProgressNodeState.COMPLETED) ProgressNodeContent.CHECKMARK else ProgressNodeContent.NONE
}

/**
 * Derive connector state between two adjacent nodes.
 * Active when both adjacent nodes are completed.
 * 
 * @see Requirements 3.10-3.11, 11.12-11.13
 */
private fun deriveConnectorState(leftState: ProgressNodeState, rightState: ProgressNodeState): ProgressConnectorState {
    return if (leftState == ProgressNodeState.COMPLETED && rightState == ProgressNodeState.COMPLETED) {
        ProgressConnectorState.ACTIVE
    } else {
        ProgressConnectorState.INACTIVE
    }
}

// MARK: - Progress-Stepper-Base Composable

/**
 * Progress-Stepper-Base Composable
 * 
 * Composes ProgressIndicatorNodeBase and ProgressIndicatorConnectorBase
 * primitives to create a stepper indicator for linear multi-step flows.
 * 
 * @param totalSteps Total number of steps (max 8)
 * @param currentStep Current active step (1-indexed)
 * @param size Size variant. Only MD and LG supported. Defaults to MD
 * @param errorSteps List of step indices in error state. Defaults to empty
 * @param accessibilityLabel Custom accessibility label override
 * @param testTag Test identifier. Defaults to null
 * @param modifier Additional Compose modifiers
 * 
 * @see Requirements: 3.1-3.17, 10.3-10.7, 11.7-11.13
 */
@Composable
fun ProgressStepperBase(
    totalSteps: Int,
    currentStep: Int,
    size: ProgressNodeSize = ProgressNodeSize.MD,
    errorSteps: List<Int> = emptyList(),
    accessibilityLabel: String? = null,
    testTag: String? = null,
    modifier: Modifier = Modifier
) {
    // Validate size ≠ SM
    // @see Requirement 3.17, 8.10
    require(size != ProgressNodeSize.SM) {
        "Steppers require size 'md' or 'lg'. Size 'sm' is only supported for Pagination-Base."
    }

    // Validate and clamp totalSteps
    // @see Requirements 3.12-3.13
    val effectiveTotalSteps = if (totalSteps > STEPPER_MAX_STEPS) {
        if (BuildConfig.DEBUG) {
            throw IllegalArgumentException(
                "Progress-Stepper-Base supports a maximum of $STEPPER_MAX_STEPS steps. " +
                "Received $totalSteps steps. " +
                "For longer flows, break into multiple sub-flows."
            )
        } else {
            Log.w(
                TAG,
                "Progress-Stepper-Base: Received $totalSteps steps but maximum is $STEPPER_MAX_STEPS. " +
                "Rendering first $STEPPER_MAX_STEPS steps only."
            )
            STEPPER_MAX_STEPS
        }
    } else {
        totalSteps
    }

    // Clamp currentStep to valid range [1, totalSteps]
    // @see Requirement 3.14
    val effectiveCurrentStep = currentStep.coerceIn(1, effectiveTotalSteps)

    // Filter errorSteps to valid range [1, totalSteps]
    // @see Requirement 3.15
    val effectiveErrorSteps = errorSteps.filter { it in 1..effectiveTotalSteps }

    // Derive all node states
    val nodeStates = (1..effectiveTotalSteps).map { index ->
        deriveStepperNodeState(index, effectiveCurrentStep, effectiveErrorSteps)
    }

    // Accessibility label
    // @see Requirements 3.16, 7.3, 7.12
    val effectiveLabel = accessibilityLabel ?: "Step $effectiveCurrentStep of $effectiveTotalSteps"

    val rowModifier = modifier
        .then(if (testTag != null) Modifier.testTag(testTag) else Modifier)
        .semantics {
            contentDescription = effectiveLabel
            progressBarRangeInfo = ProgressBarRangeInfo(
                current = effectiveCurrentStep.toFloat(),
                range = 1f..effectiveTotalSteps.toFloat()
            )
        }

    Row(
        modifier = rowModifier,
        horizontalArrangement = Arrangement.spacedBy(stepperGap(size)),
        verticalAlignment = Alignment.CenterVertically
    ) {
        for (i in nodeStates.indices) {
            // Render node
            ProgressIndicatorNodeBase(
                state = nodeStates[i],
                size = size,
                content = deriveStepperNodeContent(nodeStates[i])
            )

            // Render connector between nodes (n-1 connectors)
            // @see Requirements 11.8, 11.12-11.13
            if (i < nodeStates.size - 1) {
                Box(modifier = Modifier.weight(1f)) {
                    ProgressIndicatorConnectorBase(
                        state = deriveConnectorState(nodeStates[i], nodeStates[i + 1])
                    )
                }
            }
        }
    }
}

// MARK: - Preview

@Preview(showBackground = true, name = "ProgressStepperBase Variants")
@Composable
fun ProgressStepperBasePreview() {
    Column(
        modifier = Modifier.padding(DesignTokens.space_200),
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_300)
    ) {
        Text(text = "Progress-Stepper-Base")

        // Basic stepper (5 steps, current=3, md)
        Text(text = "5 steps, current=3, md")
        ProgressStepperBase(totalSteps = 5, currentStep = 3, size = ProgressNodeSize.MD)

        // With error step
        Text(text = "5 steps, current=3, error=[2], lg")
        ProgressStepperBase(
            totalSteps = 5,
            currentStep = 3,
            size = ProgressNodeSize.LG,
            errorSteps = listOf(2)
        )

        // All completed except current
        Text(text = "4 steps, current=4, md")
        ProgressStepperBase(totalSteps = 4, currentStep = 4, size = ProgressNodeSize.MD)

        // Both sizes
        Text(text = "Sizes (5 steps, current=3)")
        Column(verticalArrangement = Arrangement.spacedBy(DesignTokens.space_150)) {
            ProgressStepperBase(totalSteps = 5, currentStep = 3, size = ProgressNodeSize.MD)
            ProgressStepperBase(totalSteps = 5, currentStep = 3, size = ProgressNodeSize.LG)
        }
    }
}
