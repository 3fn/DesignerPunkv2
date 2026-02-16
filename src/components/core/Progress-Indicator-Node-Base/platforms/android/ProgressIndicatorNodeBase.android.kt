/**
 * Progress-Indicator-Node-Base Component for Android Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Indicator-Node-Base
 * 
 * Individual indicator element with state-based visual treatment.
 * Renders as a circular node with color, size, and content determined by state.
 * 
 * @module Progress-Indicator-Node-Base/platforms/android
 * @see Requirements: 1.1-1.5, 12.1-12.16
 * @see .kiro/specs/048-progress-family/design.md
 */

package com.designerpunk.components.core

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalAccessibilityManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.designerpunk.tokens.DesignTokens
import com.designerpunk.tokens.motionDurationFast
import com.designerpunk.tokens.motionEasingStandard

// MARK: - Node State Enum

/**
 * Visual states for the progress indicator node.
 * 
 * @see Requirement 1.1 - Four states: incomplete, current, completed, error
 */
enum class ProgressNodeState {
    INCOMPLETE,
    CURRENT,
    COMPLETED,
    ERROR
}

// MARK: - Node Size Enum

/**
 * Size variants for the progress indicator node.
 * 
 * @see Requirement 1.2 - Three sizes: sm (12dp), md (16dp), lg (24dp)
 * @see Requirement 1.5 - Current state applies +4dp emphasis
 */
enum class ProgressNodeSize {
    SM,
    MD,
    LG;

    /// Base size (references primitive spacing tokens)
    val base: Float
        get() = when (this) {
            SM -> DesignTokens.space_150  // progress.node.size.sm = 12
            MD -> DesignTokens.space_200  // progress.node.size.md = 16
            LG -> DesignTokens.space_300  // progress.node.size.lg = 24
        }

    /// Current (emphasized) size (+4 emphasis)
    val current: Float
        get() = when (this) {
            SM -> DesignTokens.space_200  // progress.node.size.sm.current = 16 (space200)
            MD -> DesignTokens.space_250  // progress.node.size.md.current = 20 (space250)
            LG -> DesignTokens.space_300 + DesignTokens.space_050  // progress.node.size.lg.current = 28 (space300 + space050)
        }

    /// Base size in Dp
    val baseDp: Dp get() = base.dp

    /// Current size in Dp
    val currentDp: Dp get() = current.dp
}

// MARK: - Node Content Enum

/**
 * Content types for the progress indicator node.
 * 
 * @see Requirements 1.3-1.4 - Content support per size
 */
enum class ProgressNodeContent {
    NONE,
    CHECKMARK,
    ICON
}


// MARK: - Color Helpers

/**
 * Get background color for a given node state.
 * References semantic color.progress.* tokens.
 * 
 * @see Requirements 12.13-12.16 - Color application per state
 */
private fun nodeBackgroundColor(state: ProgressNodeState): Color {
    return when (state) {
        ProgressNodeState.INCOMPLETE -> Color(DesignTokens.color_progress_pending_background)
        ProgressNodeState.CURRENT    -> Color(DesignTokens.color_progress_current_background)
        ProgressNodeState.COMPLETED  -> Color(DesignTokens.color_progress_completed_background)
        ProgressNodeState.ERROR      -> Color(DesignTokens.color_progress_error_background)
    }
}

/**
 * Get foreground (text/icon) color for a given node state.
 */
private fun nodeForegroundColor(state: ProgressNodeState): Color {
    return when (state) {
        ProgressNodeState.INCOMPLETE -> Color(DesignTokens.color_progress_pending_text)
        ProgressNodeState.CURRENT    -> Color(DesignTokens.color_progress_current_text)
        ProgressNodeState.COMPLETED  -> Color(DesignTokens.color_progress_completed_text)
        ProgressNodeState.ERROR      -> Color(DesignTokens.color_progress_error_text)
    }
}

// MARK: - Progress-Indicator-Node-Base Composable

/**
 * Progress-Indicator-Node-Base Composable
 * 
 * Renders a circular indicator node with state-based colors, size emphasis
 * for current state, and optional content (checkmark, icon).
 * 
 * @param state Visual state of the node (required)
 * @param size Size variant. Defaults to MD
 * @param content Content type. Defaults to NONE
 * @param icon Icon name when content=ICON. Defaults to null
 * @param testTag Test identifier. Defaults to null
 * @param modifier Additional Compose modifiers
 * 
 * @see Requirements: 1.1-1.5, 12.1-12.16
 */
@Composable
fun ProgressIndicatorNodeBase(
    state: ProgressNodeState,
    size: ProgressNodeSize = ProgressNodeSize.MD,
    content: ProgressNodeContent = ProgressNodeContent.NONE,
    icon: String? = null,
    testTag: String? = null,
    modifier: Modifier = Modifier
) {
    // Determine dimension: current state gets +4dp emphasis
    val targetDimension = if (state == ProgressNodeState.CURRENT) size.currentDp else size.baseDp

    // Animate size transitions, respecting reduced motion
    // @see Requirement 12.5 - prefers-reduced-motion
    val dimension by animateDpAsState(
        targetValue = targetDimension,
        animationSpec = tween(
            durationMillis = motionDurationFast,
            easing = motionEasingStandard
        ),
        label = "node-size"
    )

    // Effective content: sm always renders as dot
    // @see Requirement 1.3
    val effectiveContent = if (size == ProgressNodeSize.SM) ProgressNodeContent.NONE else content

    val bgColor = nodeBackgroundColor(state)
    val fgColor = nodeForegroundColor(state)

    val nodeModifier = modifier
        .then(if (testTag != null) Modifier.testTag(testTag) else Modifier)
        .clearAndSetSemantics { } // Primitive is decorative; semantic variant handles a11y
        .size(dimension)
        .clip(CircleShape)
        .background(bgColor)

    Box(
        modifier = nodeModifier,
        contentAlignment = Alignment.Center
    ) {
        when {
            // sm: always a filled dot
            size == ProgressNodeSize.SM -> {
                Box(
                    modifier = Modifier
                        .size(dimension * 0.5f)
                        .clip(CircleShape)
                        .background(fgColor)
                )
            }
            // md/lg + checkmark
            effectiveContent == ProgressNodeContent.CHECKMARK -> {
                Icon(
                    imageVector = Icons.Filled.Check,
                    contentDescription = null,
                    tint = fgColor,
                    modifier = Modifier.size(dimension * 0.5f)
                )
            }
            // md/lg + custom icon
            effectiveContent == ProgressNodeContent.ICON && icon != null -> {
                IconBase(
                    name = icon,
                    size = dimension * 0.5f,
                    color = fgColor
                )
            }
            // md/lg + none: empty circle (no inner content)
        }
    }
}

// MARK: - Preview

@Preview(showBackground = true, name = "ProgressIndicatorNodeBase Variants")
@Composable
fun ProgressIndicatorNodeBasePreview() {
    Column(
        modifier = Modifier.padding(DesignTokens.space_200),
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_300)
    ) {
        Text(text = "Progress-Indicator-Node-Base")

        // All states at md size
        Text(text = "States (md)")
        Row(horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_200)) {
            ProgressNodeState.values().forEach { nodeState ->
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    ProgressIndicatorNodeBase(state = nodeState, size = ProgressNodeSize.MD)
                    Text(text = nodeState.name.lowercase())
                }
            }
        }

        // All sizes at current state
        Text(text = "Sizes (current)")
        Row(horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_200)) {
            ProgressNodeSize.values().forEach { nodeSize ->
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    ProgressIndicatorNodeBase(state = ProgressNodeState.CURRENT, size = nodeSize)
                    Text(text = nodeSize.name.lowercase())
                }
            }
        }

        // Completed with checkmark
        Text(text = "Completed + Checkmark (lg)")
        ProgressIndicatorNodeBase(
            state = ProgressNodeState.COMPLETED,
            size = ProgressNodeSize.LG,
            content = ProgressNodeContent.CHECKMARK
        )
    }
}
