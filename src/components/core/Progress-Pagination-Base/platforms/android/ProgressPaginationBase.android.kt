/**
 * Progress-Pagination-Base Component for Android Platform
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Semantic (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Pagination-Base
 * 
 * Simple pagination indicator composing Node-Base primitives (dots only).
 * Renders all dots in a LazyRow with native scroll centering via
 * animateScrollToItem(). Viewport clips to ~5 visible.
 * 
 * @module Progress-Pagination-Base/platforms/android
 * @see Requirements: 2.1-2.12, 10.1-10.2, 11.1-11.6
 * @see .kiro/specs/048-progress-family/design.md
 */

package com.designerpunk.components.core

import android.provider.Settings
import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.designerpunk.tokens.DesignTokens

// MARK: - Constants

/** Maximum number of items supported */
private const val PAGINATION_MAX_ITEMS = 50

private const val TAG = "ProgressPaginationBase"

// MARK: - Gap Token Values

/**
 * Gap values between pagination nodes per size variant.
 * References progress.node.gap.* component tokens.
 */
private fun paginationGap(size: ProgressNodeSize): Dp {
    return when (size) {
        ProgressNodeSize.SM, ProgressNodeSize.MD -> DesignTokens.space_grouped_tight   /* space.grouped.tight */
        ProgressNodeSize.LG -> DesignTokens.space_grouped_normal                       /* space.grouped.normal */
    }
}

// MARK: - State Derivation

/**
 * Derive node state for pagination.
 * 
 * @see Requirements 10.1-10.2
 */
private fun derivePaginationNodeState(index: Int, currentItem: Int): ProgressNodeState {
    return if (index == currentItem) ProgressNodeState.CURRENT else ProgressNodeState.INCOMPLETE
}

// MARK: - Progress-Pagination-Base Composable

/**
 * Progress-Pagination-Base Composable
 * 
 * Composes ProgressIndicatorNodeBase primitives to create a simple
 * pagination indicator. All nodes use content NONE (dots only).
 * 
 * @param totalItems Total number of items/pages (max 50)
 * @param currentItem Current active item (1-indexed)
 * @param size Size variant. Defaults to MD
 * @param accessibilityLabel Custom accessibility label override
 * @param testTag Test identifier. Defaults to null
 * @param modifier Additional Compose modifiers
 * 
 * @see Requirements: 2.1-2.12, 10.1-10.2, 11.1-11.6
 */
@Composable
fun ProgressPaginationBase(
    totalItems: Int,
    currentItem: Int,
    size: ProgressNodeSize = ProgressNodeSize.MD,
    accessibilityLabel: String? = null,
    testTag: String? = null,
    modifier: Modifier = Modifier
) {
    // Validate and clamp totalItems
    // @see Requirements 2.9-2.10
    val effectiveTotalItems = if (totalItems > PAGINATION_MAX_ITEMS) {
        if (BuildConfig.DEBUG) {
            throw IllegalArgumentException(
                "Progress-Pagination-Base supports a maximum of $PAGINATION_MAX_ITEMS items. " +
                "Received $totalItems items. " +
                "Consider using a different navigation pattern for larger sets."
            )
        } else {
            Log.w(
                TAG,
                "Progress-Pagination-Base: Received $totalItems items but maximum is $PAGINATION_MAX_ITEMS. " +
                "Rendering first $PAGINATION_MAX_ITEMS items only."
            )
            PAGINATION_MAX_ITEMS
        }
    } else {
        totalItems
    }

    // Clamp currentItem to valid range [1, totalItems]
    // @see Requirement 2.11
    val effectiveCurrentItem = currentItem.coerceIn(1, effectiveTotalItems)

    // Accessibility label reflects actual position
    // @see Requirements 2.12, 7.1-7.2, 9.7
    val effectiveLabel = accessibilityLabel ?: "Page $effectiveCurrentItem of $effectiveTotalItems"

    // Viewport width: maxVisible dots + gaps + padding
    val maxVisible = minOf(effectiveTotalItems, 5)
    val stride = size.current
    val gap = paginationGap(size)
    val hPad = if (size == ProgressNodeSize.LG) DesignTokens.space_inset_150 else DesignTokens.space_inset_100
    val vPad = if (size == ProgressNodeSize.LG) DesignTokens.space_inset_100 else DesignTokens.space_inset_075
    val viewportWidth = (stride * maxVisible) + (gap * (maxVisible - 1)) + (hPad * 2)

    // Reduced motion check
    val context = LocalContext.current
    val reduceMotion = remember {
        Settings.Global.getFloat(
            context.contentResolver,
            Settings.Global.ANIMATOR_DURATION_SCALE,
            1f
        ) == 0f
    }

    val listState = rememberLazyListState()

    // Scroll to center current dot
    LaunchedEffect(effectiveCurrentItem) {
        val targetIndex = effectiveCurrentItem - 1
        if (reduceMotion) {
            listState.scrollToItem(targetIndex)
        } else {
            listState.animateScrollToItem(targetIndex)
        }
    }

    val pillShape = RoundedCornerShape(percent = 50)

    LazyRow(
        modifier = modifier
            .then(if (testTag != null) Modifier.testTag(testTag) else Modifier)
            .semantics { contentDescription = effectiveLabel }
            .width(viewportWidth)
            .background(color = DesignTokens.color_scrim_standard, shape = pillShape)
            .clip(pillShape),
        state = listState,
        horizontalArrangement = Arrangement.spacedBy(gap),
        verticalAlignment = Alignment.CenterVertically,
        contentPadding = PaddingValues(horizontal = hPad, vertical = vPad),
        userScrollEnabled = false
    ) {
        items(effectiveTotalItems) { index ->
            ProgressIndicatorNodeBase(
                state = derivePaginationNodeState(index + 1, effectiveCurrentItem),
                size = size,
                content = ProgressNodeContent.NONE
            )
        }
    }
}

// MARK: - Preview

@Preview(showBackground = true, name = "ProgressPaginationBase Variants")
@Composable
fun ProgressPaginationBasePreview() {
    Column(
        modifier = Modifier.padding(DesignTokens.space_200), /* space200 */
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_300) /* space300 */
    ) {
        Text(text = "Progress-Pagination-Base")

        // Basic pagination (5 items)
        Text(text = "5 items, current=3, sm")
        ProgressPaginationBase(totalItems = 5, currentItem = 3, size = ProgressNodeSize.SM)

        // Scroll centering (20 items)
        Text(text = "20 items, current=10, md")
        ProgressPaginationBase(totalItems = 20, currentItem = 10, size = ProgressNodeSize.MD)

        // All sizes
        Text(text = "Sizes (10 items, current=5)")
        Column(verticalArrangement = Arrangement.spacedBy(DesignTokens.space_150)) { /* space150 */
            ProgressPaginationBase(totalItems = 10, currentItem = 5, size = ProgressNodeSize.SM)
            ProgressPaginationBase(totalItems = 10, currentItem = 5, size = ProgressNodeSize.MD)
            ProgressPaginationBase(totalItems = 10, currentItem = 5, size = ProgressNodeSize.LG)
        }
    }
}
