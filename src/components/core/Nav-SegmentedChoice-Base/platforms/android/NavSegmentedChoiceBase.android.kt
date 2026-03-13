/**
 * Nav-SegmentedChoice-Base — Android Implementation
 *
 * Navigation control for switching between mutually exclusive content views.
 * Jetpack Compose Composable with tablist/tab accessibility semantics.
 *
 * Stemma System: Navigation Family, Primitive (Base)
 *
 * @module Nav-SegmentedChoice-Base/platforms/android
 * @see .kiro/specs/049-nav-segmentedchoice-base/design-outline.md
 * @see Requirements: 1.1–1.5, 3.1–3.7, 7.1–7.3, 9.1–9.8, 10.3, 10.6
 */

package com.designerpunk.components.core

import android.provider.Settings
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.focusable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.designerpunk.tokens.DesignTokens
import kotlinx.coroutines.launch

// MARK: - Tokens

/**
 * Component token references for Nav-SegmentedChoice-Base.
 * Contracts: visual_background, visual_border, visual_shadow, visual_state_colors
 */
private object NavSegmentedChoiceTokens {
    // Container (contract: visual_background, visual_border)
    val containerBackground = Color(DesignTokens.color_structure_surface)
    val containerBorderColor = Color(DesignTokens.color_structure_border)
    val containerBorderWidth = DesignTokens.border_default
    val containerRadius = DesignTokens.radius_normal
    val containerPadding = DesignTokens.space_050

    // Indicator (contract: visual_shadow, visual_state_colors)
    val indicatorBackground = Color(DesignTokens.color_structure_canvas)
    val indicatorRadius = DesignTokens.radius_small
    // Contract: visual_shadow — shadow.navigation.indicator token
    val indicatorShadow = DesignTokens.shadow_navigation_indicator

    // Segments (contract: visual_state_colors, layout_flexible_length)
    val segmentColor = Color(DesignTokens.color_action_navigation)
    val minSegmentWidth = DesignTokens.tap_area_minimum
}

/**
 * Size-specific tokens.
 * Contract: visual_size_variants
 */
enum class NavSegmentedChoiceSize {
    STANDARD,
    CONDENSED;

    val blockPadding get() = when (this) {
        STANDARD -> DesignTokens.space_150
        CONDENSED -> DesignTokens.space_100
    }

    val inlinePadding get() = when (this) {
        STANDARD -> DesignTokens.space_200
        CONDENSED -> DesignTokens.space_150
    }

    val fontSize: Float get() = when (this) {
        STANDARD -> DesignTokens.font_size_125
        CONDENSED -> DesignTokens.font_size_100
    }

    val lineHeight: Float get() = when (this) {
        STANDARD -> DesignTokens.line_height_125
        CONDENSED -> DesignTokens.line_height_100
    }

    val iconSize get() = when (this) {
        STANDARD -> 28
        CONDENSED -> 24
    }
}

// MARK: - Segment Option

/**
 * A segment is either text or icon, never both.
 */
sealed class SegmentOption(val value: String) {
    class Text(value: String, val label: String) : SegmentOption(value)
    class IconSegment(value: String, val icon: String, val accessibilityLabel: String) : SegmentOption(value)
}

// MARK: - Composable

/**
 * Nav-SegmentedChoice-Base Composable.
 *
 * Contract: validation_selection_constraints — requires minimum 2 segments.
 *
 * @param segments List of segment options (minimum 2)
 * @param selectedValue Currently selected segment value
 * @param onSelectionChange Callback when selection changes
 * @param size Size variant (STANDARD or CONDENSED)
 * @param componentId Optional ID for accessibility panel association
 * @param modifier Additional Compose modifiers
 */
@Composable
fun NavSegmentedChoiceBase(
    segments: List<SegmentOption>,
    selectedValue: String,
    onSelectionChange: (String) -> Unit,
    size: NavSegmentedChoiceSize = NavSegmentedChoiceSize.STANDARD,
    componentId: String? = null,
    modifier: Modifier = Modifier
) {
    // Contract: validation_selection_constraints
    require(segments.size >= 2) {
        "Nav-SegmentedChoice-Base requires at least 2 segments. Received: ${segments.size}."
    }

    // Contract: content_displays_fallback
    val resolvedSelectedValue = if (segments.any { it.value == selectedValue }) {
        selectedValue
    } else {
        segments.first().value
    }

    val containerShape = RoundedCornerShape(NavSegmentedChoiceTokens.containerRadius)
    val indicatorShape = RoundedCornerShape(NavSegmentedChoiceTokens.indicatorRadius)
    val selectedIndex = segments.indexOfFirst { it.value == resolvedSelectedValue }.coerceAtLeast(0)

    // Contract: accessibility_reduced_motion — Settings.Global.TRANSITION_ANIMATION_SCALE
    val context = LocalContext.current
    val reduceMotion = remember {
        Settings.Global.getFloat(
            context.contentResolver,
            Settings.Global.TRANSITION_ANIMATION_SCALE,
            1f
        ) == 0f
    }

    // Animation state (contract: animation_coordination)
    val density = LocalDensity.current
    val indicatorOffsetPx = remember { Animatable(0f) }
    val indicatorWidthPx = remember { Animatable(0f) }
    val shadowAlpha = remember { Animatable(1f) }
    var hasRendered by remember { mutableStateOf(false) }
    var isAnimating by remember { mutableStateOf(false) }

    // Contract: animation_coordination — duration/easing tokens
    val d150 = DesignTokens.Duration.Duration150
    val d350 = DesignTokens.Duration.Duration350

    // Contract: interaction_keyboard_navigation — FocusRequester per segment
    val focusRequesters = remember(segments.size) {
        List(segments.size) { FocusRequester() }
    }

    BoxWithConstraints(
        modifier = modifier
            .clip(containerShape)
            .background(NavSegmentedChoiceTokens.containerBackground)
            .border(
                NavSegmentedChoiceTokens.containerBorderWidth,
                NavSegmentedChoiceTokens.containerBorderColor,
                containerShape
            )
            .padding(NavSegmentedChoiceTokens.containerPadding)
    ) {
        val totalWidthPx = with(density) { maxWidth.toPx() }
        val segmentWidthPx = totalWidthPx / segments.size
        val targetOffsetPx = selectedIndex * segmentWidthPx

        // Contract: animation_initial_render — position without animation on first render
        LaunchedEffect(Unit) {
            indicatorOffsetPx.snapTo(targetOffsetPx)
            indicatorWidthPx.snapTo(segmentWidthPx)
            hasRendered = true
        }

        // Contract: animation_coordination — four-phase indicator animation
        LaunchedEffect(resolvedSelectedValue) {
            if (!hasRendered) return@LaunchedEffect

            val newIndex = segments.indexOfFirst { it.value == resolvedSelectedValue }.coerceAtLeast(0)
            val newOffsetPx = newIndex * segmentWidthPx

            // Contract: accessibility_reduced_motion — snap when animations disabled
            if (reduceMotion) {
                indicatorOffsetPx.snapTo(newOffsetPx)
                indicatorWidthPx.snapTo(segmentWidthPx)
                return@LaunchedEffect
            }

            // Re-entrant: snap if already animating
            if (isAnimating) {
                indicatorOffsetPx.snapTo(newOffsetPx)
                indicatorWidthPx.snapTo(segmentWidthPx)
                shadowAlpha.snapTo(1f)
                isAnimating = false
                return@LaunchedEffect
            }

            isAnimating = true

            // Phase 1: Shadow out (duration150, easingAccelerate)
            shadowAlpha.animateTo(
                0f,
                tween(d150, easing = DesignTokens.Easing.EasingAccelerate)
            )

            // Phase 2+3: Resize + Glide simultaneous
            launch {
                // Resize (duration150, easingStandard)
                indicatorWidthPx.animateTo(
                    segmentWidthPx,
                    tween(d150, easing = DesignTokens.Easing.EasingStandard)
                )
            }
            // Glide (duration350, easingGlideDecelerate)
            indicatorOffsetPx.animateTo(
                newOffsetPx,
                tween(d350, easing = DesignTokens.Easing.EasingGlideDecelerate)
            )

            // Phase 4: Shadow in (duration150, easingDecelerate)
            shadowAlpha.animateTo(
                1f,
                tween(d150, easing = DesignTokens.Easing.EasingDecelerate)
            )

            isAnimating = false
        }

        Box(modifier = Modifier.fillMaxWidth()) {
            // Indicator layer (contract: visual_shadow)
            val shadowToken = NavSegmentedChoiceTokens.indicatorShadow
            val currentShadowAlpha = shadowAlpha.value
            val segmentHeightDp = with(density) {
                ((size.fontSize * size.lineHeight) + (size.blockPadding * 2)).toDp()
            }

            Box(
                modifier = Modifier
                    .offset { IntOffset(indicatorOffsetPx.value.toInt(), 0) }
                    .width(with(density) { indicatorWidthPx.value.toDp() })
                    .height(segmentHeightDp)
                    .shadow(
                        elevation = (shadowToken.blur * currentShadowAlpha).dp,
                        shape = indicatorShape,
                        ambientColor = Color(shadowToken.color).copy(alpha = shadowToken.opacity * currentShadowAlpha),
                        spotColor = Color(shadowToken.color).copy(alpha = shadowToken.opacity * currentShadowAlpha)
                    )
                    .clip(indicatorShape)
                    .background(NavSegmentedChoiceTokens.indicatorBackground)
            )

            // Segments layer (contract: layout_flexible_length)
            Row(modifier = Modifier.fillMaxWidth()) {
                segments.forEachIndexed { index, segment ->
                    val isSelected = segment.value == resolvedSelectedValue

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            // Contract: interaction_keyboard_navigation — arrow keys with wrapping
                            .focusRequester(focusRequesters[index])
                            .onKeyEvent { event ->
                                if (event.type != KeyEventType.KeyDown) return@onKeyEvent false
                                when (event.key) {
                                    Key.DirectionLeft, Key.DirectionUp -> {
                                        val prev = (index - 1 + segments.size) % segments.size
                                        focusRequesters[prev].requestFocus()
                                        true
                                    }
                                    Key.DirectionRight, Key.DirectionDown -> {
                                        val next = (index + 1) % segments.size
                                        focusRequesters[next].requestFocus()
                                        true
                                    }
                                    // Contract: interaction_keyboard_activation — Enter/Space
                                    Key.Enter, Key.Spacebar -> {
                                        if (segment.value != resolvedSelectedValue) {
                                            onSelectionChange(segment.value)
                                        }
                                        true
                                    }
                                    else -> false
                                }
                            }
                            .focusable()
                            // Contract: interaction_pressable
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = null
                            ) {
                                // Contract: interaction_noop_active
                                if (segment.value != resolvedSelectedValue) {
                                    onSelectionChange(segment.value)
                                }
                            }
                            // Contract: accessibility_aria_roles
                            .semantics {
                                role = Role.Tab
                                selected = isSelected
                                // Contract: accessibility_alt_text
                                contentDescription = when (segment) {
                                    is SegmentOption.Text -> segment.label
                                    is SegmentOption.IconSegment -> segment.accessibilityLabel
                                }
                                // Contract: accessibility_aria_controls
                                if (componentId != null) {
                                    testTag = "${componentId}-panel-${segment.value}"
                                }
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        // Contract: content_displays_label, content_supports_icon
                        when (segment) {
                            is SegmentOption.Text -> Text(
                                text = segment.label,
                                color = NavSegmentedChoiceTokens.segmentColor,
                                fontSize = size.fontSize.sp,
                                lineHeight = (size.fontSize * size.lineHeight).sp,
                                fontWeight = FontWeight.Bold,
                                textAlign = TextAlign.Center,
                                modifier = Modifier.padding(
                                    horizontal = size.inlinePadding,
                                    vertical = size.blockPadding
                                )
                            )
                            is SegmentOption.IconSegment -> Icon(
                                painter = painterResource(id = 0),
                                contentDescription = segment.accessibilityLabel,
                                tint = NavSegmentedChoiceTokens.segmentColor,
                                modifier = Modifier
                                    .height(size.iconSize)
                                    .width(size.iconSize)
                                    .padding(
                                        horizontal = size.inlinePadding,
                                        vertical = size.blockPadding
                                    )
                            )
                        }
                    }
                }
            }
        }
    }
}
