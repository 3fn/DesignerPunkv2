/**
 * Progress-Indicator-Connector-Base Component for Android Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Indicator-Connector-Base
 * 
 * Connecting line element between progress indicator nodes.
 * Renders as a horizontal line with state-based color treatment.
 * 
 * @module Progress-Indicator-Connector-Base/platforms/android
 * @see Requirements: 1.6-1.7, 12.10-12.12
 * @see .kiro/specs/048-progress-family/design.md
 */

package com.designerpunk.components.core

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.designerpunk.tokens.DesignTokens

// MARK: - Connector State Enum

/**
 * Visual states for the progress indicator connector.
 * 
 * @see Requirement 1.6 - Two states: active, inactive
 */
enum class ProgressConnectorState {
    ACTIVE,
    INACTIVE
}

// MARK: - Color Helpers

/**
 * Get color for a given connector state.
 * References semantic color.progress.*.connector tokens.
 * - ACTIVE: color.progress.completed.connector (green100)
 * - INACTIVE: color.progress.pending.connector (white200)
 * 
 * @see Requirements 12.10-12.11 - Color application per state
 */
private fun connectorColor(state: ProgressConnectorState): Color {
    return when (state) {
        ProgressConnectorState.ACTIVE   -> Color(DesignTokens.color_progress_completed_connector)
        ProgressConnectorState.INACTIVE -> Color(DesignTokens.color_progress_pending_connector)
    }
}

/**
 * Connector thickness.
 * References progress.connector.thickness → borderDefault → borderWidth100 (1dp).
 * 
 * @see Requirement 1.7 - 1px thickness (borderDefault token)
 * @see Requirement 12.12 - Uses borderDefault token
 */
private val connectorThickness = DesignTokens.border_width_100  // 1dp

// MARK: - Progress-Indicator-Connector-Base Composable

/**
 * Progress-Indicator-Connector-Base Composable
 * 
 * Renders a horizontal connecting line between progress indicator nodes
 * with state-based color treatment.
 * 
 * @param state Visual state of the connector (required)
 * @param testTag Test identifier. Defaults to null
 * @param modifier Additional Compose modifiers
 * 
 * @see Requirements: 1.6-1.7, 12.10-12.12
 */
@Composable
fun ProgressIndicatorConnectorBase(
    state: ProgressConnectorState,
    testTag: String? = null,
    modifier: Modifier = Modifier
) {
    val color = connectorColor(state)

    val connectorModifier = modifier
        .then(if (testTag != null) Modifier.testTag(testTag) else Modifier)
        .clearAndSetSemantics { } // Primitive is decorative; semantic variant handles a11y
        .fillMaxWidth()
        .height(connectorThickness)
        .background(color)

    Box(modifier = connectorModifier)
}

// MARK: - Preview

@Preview(showBackground = true, name = "ProgressIndicatorConnectorBase Variants")
@Composable
fun ProgressIndicatorConnectorBasePreview() {
    Column(
        modifier = Modifier.padding(DesignTokens.space_200),
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_300)
    ) {
        Text(text = "Progress-Indicator-Connector-Base")

        // Active connector
        Text(text = "Active (green100)")
        ProgressIndicatorConnectorBase(state = ProgressConnectorState.ACTIVE)

        // Inactive connector
        Text(text = "Inactive (white200)")
        ProgressIndicatorConnectorBase(state = ProgressConnectorState.INACTIVE)

        // Both states in context
        Text(text = "Both States in Context")
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(0.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Box(
                modifier = Modifier
                    .size(ProgressNodeSize.MD.baseDp)
                    .clip(CircleShape)
                    .background(Color.Green)
            )
            Box(modifier = Modifier.weight(1f)) {
                ProgressIndicatorConnectorBase(state = ProgressConnectorState.ACTIVE)
            }
            Box(
                modifier = Modifier
                    .size(ProgressNodeSize.MD.baseDp)
                    .clip(CircleShape)
                    .background(Color.Green)
            )
            Box(modifier = Modifier.weight(1f)) {
                ProgressIndicatorConnectorBase(state = ProgressConnectorState.INACTIVE)
            }
            Box(
                modifier = Modifier
                    .size(ProgressNodeSize.MD.baseDp)
                    .clip(CircleShape)
                    .background(Color.Gray)
            )
        }
    }
}
