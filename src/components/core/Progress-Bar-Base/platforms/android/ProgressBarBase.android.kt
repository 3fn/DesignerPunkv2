/**
 * Progress-Bar-Base — Android Implementation
 *
 * Stemma System: ProgressIndicator Family, Primitive (standalone)
 *
 * @module Progress-Bar-Base/platforms/android
 * @see .kiro/specs/090-linear-progress-bar/design.md
 */

package com.designerpunk.components.core

import android.provider.Settings
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp

private const val INDETERMINATE_STATIC_FILL = 0.33f
private val MILESTONES = listOf(0, 25, 50, 75, 100)

object ProgressBarTokens {
    val trackColor = DesignTokens.colorProgressPendingBackground
    val determinateFillColor = DesignTokens.colorProgressCompletedBackground
    val indeterminateFillColor = DesignTokens.colorProgressCurrentBackground
    val animationDuration = DesignTokens.duration150.toInt()
    val pulseDuration = DesignTokens.duration350.toInt()

    fun height(size: ProgressBarSize) = when (size) {
        ProgressBarSize.SM -> DesignTokens.size050
        ProgressBarSize.MD -> DesignTokens.size100
        ProgressBarSize.LG -> DesignTokens.size150
    }
}

enum class ProgressBarSize { SM, MD, LG }

@Composable
fun ProgressBarBase(
    mode: ProgressBarMode,
    accessibilityLabel: String,
    size: ProgressBarSize = ProgressBarSize.MD,
    testID: String? = null,
) {
    val reduceMotion = isReduceMotionEnabled()
    val capsule = RoundedCornerShape(percent = 50)
    val barHeight = ProgressBarTokens.height(size)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(barHeight.dp)
            .clip(capsule)
            .background(ProgressBarTokens.trackColor)
            .then(if (testID != null) Modifier.testTag(testID) else Modifier)
            .semantics {
                contentDescription = accessibilityLabel
                when (mode) {
                    is ProgressBarMode.Determinate ->
                        progressBarRangeInfo = androidx.compose.ui.semantics.ProgressBarRangeInfo(
                            current = mode.value,
                            range = 0f..1f,
                        )
                    is ProgressBarMode.Indeterminate -> {}
                }
            },
        contentAlignment = Alignment.CenterStart,
    ) {
        when (mode) {
            is ProgressBarMode.Determinate -> {
                require(mode.value in 0f..1f) {
                    "Progress-Bar-Base: value must be between 0 and 1, received ${mode.value}"
                }
                val animatedWidth by animateFloatAsState(
                    targetValue = mode.value,
                    animationSpec = if (reduceMotion) tween(0) else tween(ProgressBarTokens.animationDuration),
                    label = "progress-fill",
                )
                Box(
                    modifier = Modifier
                        .fillMaxWidth(animatedWidth)
                        .fillMaxHeight()
                        .clip(capsule)
                        .background(ProgressBarTokens.determinateFillColor)
                )
            }
            is ProgressBarMode.Indeterminate -> {
                val opacity = if (reduceMotion) {
                    1f
                } else {
                    val transition = rememberInfiniteTransition(label = "pulse")
                    val animated by transition.animateFloat(
                        initialValue = 0.3f,
                        targetValue = 1f,
                        animationSpec = infiniteRepeatable(
                            animation = tween(ProgressBarTokens.pulseDuration),
                            repeatMode = RepeatMode.Reverse,
                        ),
                        label = "pulse-opacity",
                    )
                    animated
                }
                Box(
                    modifier = Modifier
                        .fillMaxWidth(INDETERMINATE_STATIC_FILL)
                        .fillMaxHeight()
                        .clip(capsule)
                        .alpha(opacity)
                        .background(ProgressBarTokens.indeterminateFillColor)
                )
            }
        }
    }
}

sealed class ProgressBarMode {
    data class Determinate(val value: Float) : ProgressBarMode()
    object Indeterminate : ProgressBarMode()
}

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
