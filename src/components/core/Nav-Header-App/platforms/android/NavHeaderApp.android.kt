/**
 * Nav-Header-App — Android Implementation
 * Thin wrapper composing NavHeaderBase with permissive slots.
 * @module Nav-Header-App/platforms/android
 */

package com.designerpunk.components.core

import androidx.compose.runtime.Composable

@Composable
fun NavHeaderApp(
    leadingContent: @Composable () -> Unit = {},
    centerContent: @Composable () -> Unit = {},
    trailingContent: @Composable () -> Unit = {},
    appearance: NavHeaderAppearance = NavHeaderAppearance.OPAQUE,
    showSeparator: Boolean = true,
    testID: String? = null,
) {
    NavHeaderBase(
        leadingSlot = leadingContent,
        titleSlot = centerContent,
        trailingSlot = trailingContent,
        appearance = appearance,
        showSeparator = showSeparator,
        testID = testID,
    )
}
