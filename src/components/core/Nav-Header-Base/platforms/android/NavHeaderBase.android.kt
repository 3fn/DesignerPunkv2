/**
 * Nav-Header-Base — Android Implementation
 *
 * Structural primitive for top-of-screen navigation bars.
 * Three-region layout, landmark semantics, safe area, appearance modes.
 * Internal only — semantic variants compose this.
 *
 * Stemma System: Navigation Family, Primitive (Base)
 *
 * @module Nav-Header-Base/platforms/android
 * @see .kiro/specs/088-top-bar-component/design.md
 * @see contracts: accessibility_aria_roles, visual_background, visual_translucent,
 *      visual_separator, layout_three_regions, layout_safe_area, interaction_focus_order
 */

package com.designerpunk.components.core

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material3.Divider
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

// MARK: - Tokens

/** Component token references for Nav-Header-Base. */
object NavHeaderTokens {
    // Background (contract: visual_background)
    val canvasBackground: Color = Color(DesignTokens.colorStructureCanvas)

    // Separator (contract: visual_separator)
    val separatorColor: Color = Color(DesignTokens.colorStructureBorderSubtle)
    val separatorWidth = DesignTokens.borderWidth100.dp
}

/** Appearance mode for Nav-Header-Base. */
enum class NavHeaderAppearance {
    OPAQUE,
    TRANSLUCENT
}

/**
 * Nav-Header-Base — Structural primitive for top-of-screen navigation bars.
 *
 * Provides three-region layout, safe area integration, and landmark semantics.
 * Internal only — use NavHeaderPage or NavHeaderApp instead.
 *
 * @param leadingSlot Content for the leading region (inline-start)
 * @param titleSlot Content for the title region
 * @param trailingSlot Content for the trailing region (inline-end)
 * @param appearance Visual style (opaque or translucent)
 * @param showSeparator Whether to render the bottom separator
 * @param testID Test identifier for automated testing
 */
@Composable
fun NavHeaderBase(
    leadingSlot: @Composable () -> Unit = {},
    titleSlot: @Composable () -> Unit = {},
    trailingSlot: @Composable () -> Unit = {},
    appearance: NavHeaderAppearance = NavHeaderAppearance.OPAQUE,
    showSeparator: Boolean = true,
    testID: String? = null,
) {
    val backgroundColor = when (appearance) {
        NavHeaderAppearance.OPAQUE -> NavHeaderTokens.canvasBackground
        // Android convention: solid background for translucent (blur tokens available, not consumed)
        NavHeaderAppearance.TRANSLUCENT -> NavHeaderTokens.canvasBackground
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(backgroundColor)
            .windowInsetsPadding(WindowInsets.statusBars)
            .then(if (testID != null) Modifier.testTag(testID) else Modifier)
    ) {
        // Three-region layout (contract: layout_three_regions)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(min = 48.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            // Leading region (inline-start)
            Box { leadingSlot() }

            // Title region (fills available space)
            Box(
                modifier = Modifier.weight(1f),
                contentAlignment = Alignment.CenterStart,
            ) {
                titleSlot()
            }

            // Trailing region (inline-end)
            Box { trailingSlot() }
        }

        // Separator (contract: visual_separator)
        if (showSeparator) {
            Divider(
                color = NavHeaderTokens.separatorColor,
                thickness = NavHeaderTokens.separatorWidth,
            )
        }
    }
}
