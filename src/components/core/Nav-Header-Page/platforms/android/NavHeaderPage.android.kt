/**
 * Nav-Header-Page — Android Implementation
 *
 * Opinionated page-level navigation bar. Composes Nav-Header-Base.
 * Back/close actions, h1 title, trailing actions, collapsible scroll.
 *
 * Stemma System: Navigation Family, Semantic (inherits Nav-Header-Base)
 *
 * @module Nav-Header-Page/platforms/android
 * @see .kiro/specs/088-top-bar-component/design.md
 */

package com.designerpunk.components.core

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.input.nestedscroll.NestedScrollConnection
import androidx.compose.ui.input.nestedscroll.NestedScrollSource
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp

object NavHeaderPageTokens {
    val titleColor = DesignTokens.colorActionNavigation
    val trailingGap = DesignTokens.spaceGroupedMinimal.dp
    val closeGap = DesignTokens.spaceGroupedTight.dp
    val androidPadding = DesignTokens.spaceInset100.dp
    val scrollThreshold = 8f
}

enum class PageTitleAlignment { CENTER, LEADING }

@Composable
fun NavHeaderPage(
    title: String,
    leadingAction: @Composable (() -> Unit)? = null,
    trailingActions: @Composable (() -> Unit)? = null,
    closeAction: @Composable (() -> Unit)? = null,
    titleAlignment: PageTitleAlignment = PageTitleAlignment.LEADING, // Android default
    scrollBehavior: NavHeaderScrollBehavior = NavHeaderScrollBehavior.FIXED,
    appearance: NavHeaderAppearance = NavHeaderAppearance.OPAQUE,
    showSeparator: Boolean = true,
    testID: String? = null,
) {
    NavHeaderBase(
        leadingSlot = { leadingAction?.invoke() },
        titleSlot = {
            Text(
                text = title,
                color = NavHeaderPageTokens.titleColor,
                fontSize = DesignTokens.typographyLabelMdFontSize,
                fontWeight = DesignTokens.typographyLabelMdFontWeight,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                textAlign = when (titleAlignment) {
                    PageTitleAlignment.CENTER -> TextAlign.Center
                    PageTitleAlignment.LEADING -> TextAlign.Start
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = NavHeaderPageTokens.androidPadding)
                    .semantics { heading() },
            )
        },
        trailingSlot = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                trailingActions?.invoke()
                if (closeAction != null) {
                    Spacer(modifier = Modifier.width(NavHeaderPageTokens.closeGap))
                    closeAction()
                }
            }
        },
        appearance = appearance,
        showSeparator = showSeparator,
        testID = testID,
    )
}

enum class NavHeaderScrollBehavior { FIXED, COLLAPSIBLE }

/**
 * NestedScrollConnection for collapsible Nav-Header-Page.
 * Attach to the scrollable content's Modifier.nestedScroll().
 */
fun navHeaderCollapsibleConnection(
    onHide: () -> Unit,
    onReveal: () -> Unit,
): NestedScrollConnection = object : NestedScrollConnection {
    private var accumulated = 0f

    override fun onPreScroll(available: Offset, source: NestedScrollSource): Offset {
        accumulated += available.y
        if (accumulated < -NavHeaderPageTokens.scrollThreshold) {
            onHide()
            accumulated = 0f
        } else if (accumulated > NavHeaderPageTokens.scrollThreshold) {
            onReveal()
            accumulated = 0f
        }
        return Offset.Zero
    }
}
