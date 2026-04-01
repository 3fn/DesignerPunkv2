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

import android.provider.Settings
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.input.nestedscroll.NestedScrollConnection
import androidx.compose.ui.input.nestedscroll.NestedScrollSource
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import kotlin.math.roundToInt

// Composition: IconBase( via ButtonIcon slots), ButtonIcon( via consumer slots)

// MARK: - Tokens

object NavHeaderPageTokens {
    // Token values are raw floats — platform builder generates unitless constants
    val titleColor = DesignTokens.colorActionNavigation
    val closeGap = DesignTokens.spaceGroupedTight
    val androidPadding = DesignTokens.spaceInset100
    val scrollThreshold = 8f
    val animationDuration = DesignTokens.duration150.toInt()
}

enum class PageTitleAlignment { CENTER, LEADING }
enum class NavHeaderScrollBehavior { FIXED, COLLAPSIBLE }

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
    // Collapsible state
    var isHidden by remember { mutableStateOf(false) }
    val offsetY = remember { Animatable(0f) }
    val reduceMotion = isReduceMotionEnabled()

    // Animate offset when hidden state changes
    LaunchedEffect(isHidden) {
        val target = if (isHidden) -NavHeaderTokens.minHeight.value else 0f
        if (reduceMotion) {
            offsetY.snapTo(0f) // Reduced motion: never hide
        } else {
            offsetY.animateTo(
                targetValue = target,
                animationSpec = tween(durationMillis = NavHeaderPageTokens.animationDuration)
            )
        }
    }

    // Provide scroll connection when collapsible
    val scrollConnection = if (scrollBehavior == NavHeaderScrollBehavior.COLLAPSIBLE && !reduceMotion) {
        remember {
            navHeaderCollapsibleConnection(
                onHide = { isHidden = true },
                onReveal = { isHidden = false },
            )
        }
    } else null

    NavHeaderBase(
        leadingSlot = { leadingAction?.invoke() },
        titleSlot = {
            Text(
                text = title,
                color = NavHeaderPageTokens.titleColor,
                fontSize = DesignTokens.typographyLabelMd.fontSize,
                fontWeight = DesignTokens.typographyLabelMd.fontWeight,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                textAlign = when (titleAlignment) {
                    PageTitleAlignment.CENTER -> TextAlign.Center
                    PageTitleAlignment.LEADING -> TextAlign.Start
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = NavHeaderPageTokens.androidPadding.dp)
                    .semantics { heading() },
            )
        },
        trailingSlot = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                trailingActions?.invoke()
                if (closeAction != null) {
                    Spacer(modifier = Modifier.width(NavHeaderPageTokens.closeGap.dp))
                    closeAction()
                }
            }
        },
        appearance = appearance,
        showSeparator = showSeparator,
        testID = testID,
        modifier = Modifier.offset { IntOffset(0, offsetY.value.roundToInt()) },
    )
}

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

/** Check if reduce motion is enabled on Android. */
@Composable
private fun isReduceMotionEnabled(): Boolean {
    val context = LocalContext.current
    val scale = Settings.Global.getFloat(
        context.contentResolver,
        Settings.Global.ANIMATOR_DURATION_SCALE,
        1f
    )
    return scale == 0f
}
