/**
 * Nav-TabBar-Base — Android Implementation
 *
 * Primary bottom navigation with icon-only tabs, dot indicator,
 * radial glow gradients, and three-phase selection animation.
 * Material 3 NavigationBar as base, customized with DesignerPunk tokens.
 *
 * Stemma System: Navigation Family, Primitive (Base)
 *
 * @module Nav-TabBar-Base/platforms/android
 * @see .kiro/specs/050-nav-tabbar-base/design.md
 * @see Requirements: R1-R6, R8-R10
 */

package com.designerpunk.components.core

import android.provider.Settings
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.focusable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Divider
import com.designerpunk.components.core.IconBase
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.selectableGroup
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.testTag
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import com.designerpunk.tokens.DesignTokens
import com.designerpunk.tokens.pressedLighterBlend
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

// MARK: - Tokens

/**
 * Component token references for Nav-TabBar-Base.
 * Contracts: visual_background, visual_state_colors, visual_gradient_glow
 */
private object NavTabBarTokens {
    // Container (contract: visual_background)
    val containerBackground = Color(DesignTokens.color_structure_canvas)
    val borderColor = Color(DesignTokens.color_structure_border_subtle)
    val borderWidth = DesignTokens.border_default

    // Icons (contract: visual_state_colors)
    val activeIconColor = Color(DesignTokens.color_action_navigation)
    val inactiveIconColor = Color(DesignTokens.color_icon_navigation_inactive)

    // Dot (contract: visual_state_colors)
    val dotSize = DesignTokens.size_050
    val dotColor = Color(DesignTokens.color_action_navigation)

    // Glow gradient (contract: visual_gradient_glow)
    val glowActiveCenter = Color(DesignTokens.color_background_primary_subtle)
    val glowInactiveCenter = Color(DesignTokens.color_structure_canvas)
    val glowEdgeColor = Color(DesignTokens.color_structure_canvas)
    val glowEdgeOpacity = DesignTokens.opacity_024

    // Spacing
    val activePaddingTop = DesignTokens.space_150
    val activePaddingInline = DesignTokens.space_150
    val activePaddingBottom = DesignTokens.space_150
    val activeItemSpacing = DesignTokens.space_grouped_minimal
    val inactivePaddingTop = DesignTokens.space_150
    val inactivePaddingInline = DesignTokens.space_150
    val inactivePaddingBottom = DesignTokens.space_075
    val minTapWidth = DesignTokens.tap_area_minimum
    val minTabHeight = DesignTokens.space_600

    // Icon
    val iconSize = DesignTokens.icon_size_100

    // Glow geometry
    val glowHorizontalRadius = DesignTokens.space_700

    // Motion
    val durationShort = DesignTokens.Duration.Duration150
    val durationGlide = DesignTokens.Duration.Duration350
}

// MARK: - Tab Option

/**
 * A tab item definition — icon-only with required accessibility label.
 */
data class TabOption(
    val value: String,
    val icon: String,              // outline-stroke variant (inactive)
    val activeIcon: String,        // solid-fill variant (active)
    val accessibilityLabel: String
)

// MARK: - Composable

/**
 * Nav-TabBar-Base Composable.
 *
 * @param tabs List of tab options (minimum 2, 3-5 recommended)
 * @param selectedValue Currently selected tab value
 * @param onSelectionChange Callback when selection changes
 * @param testTag Optional test tag for automated testing
 * @param modifier Additional Compose modifiers
 */
@Composable
fun NavTabBarBase(
    tabs: List<TabOption>,
    selectedValue: String,
    onSelectionChange: (String) -> Unit,
    testTag: String? = null,
    modifier: Modifier = Modifier,
    badgeContent: @Composable (String) -> Unit = {}
) {
    // Contract: validation_selection_constraints
    require(tabs.size >= 2) {
        "Nav-TabBar-Base requires at least 2 tabs. Received: ${tabs.size}."
    }

    // Contract: validation_selection_constraints — fallback
    val resolvedSelectedValue = if (tabs.any { it.value == selectedValue }) {
        selectedValue
    } else {
        tabs.first().value
    }

    val selectedIndex = tabs.indexOfFirst { it.value == resolvedSelectedValue }.coerceAtLeast(0)

    // Contract: accessibility_reduced_motion
    val context = LocalContext.current
    val reduceMotion = remember {
        Settings.Global.getFloat(
            context.contentResolver,
            Settings.Global.ANIMATOR_DURATION_SCALE,
            1f
        ) == 0f
    }

    // Animation state
    val density = LocalDensity.current
    val dotOffsetPx = remember { Animatable(0f) }
    val glowAlphas = remember { mutableStateOf(tabs.associate { it.value to 1f }) }
    var hasRendered by remember { mutableStateOf(false) }
    var isAnimating by remember { mutableStateOf(false) }

    // Keyboard focus (contract: interaction_keyboard_navigation)
    val focusRequesters = remember(tabs.size) {
        List(tabs.size) { FocusRequester() }
    }

    BoxWithConstraints(
        modifier = modifier
            .fillMaxWidth()
            .background(
                Brush.verticalGradient(
                    colorStops = arrayOf(
                        0f to NavTabBarTokens.containerBackground.copy(alpha = 0.80f),
                        0.16f to NavTabBarTokens.containerBackground.copy(alpha = 0.88f),
                        0.32f to NavTabBarTokens.containerBackground.copy(alpha = 0.96f),
                        0.48f to NavTabBarTokens.containerBackground
                    )
                )
            )
            .let { mod -> testTag?.let { mod.semantics { this.testTag = it } } ?: mod }
    ) {
        val totalWidthPx = with(density) { maxWidth.toPx() }
        val tabWidthPx = totalWidthPx / tabs.size

        // Top stroke (contract: visual_background)
        Divider(color = NavTabBarTokens.borderColor, thickness = NavTabBarTokens.borderWidth)

        // Contract: animation_initial_render
        LaunchedEffect(Unit) {
            dotOffsetPx.snapTo(selectedIndex * tabWidthPx + tabWidthPx / 2)
            hasRendered = true
        }

        // Contract: animation_coordination — three-phase animation
        LaunchedEffect(resolvedSelectedValue) {
            if (!hasRendered) return@LaunchedEffect

            val newIndex = tabs.indexOfFirst { it.value == resolvedSelectedValue }.coerceAtLeast(0)
            val newOffsetPx = newIndex * tabWidthPx + tabWidthPx / 2

            if (reduceMotion) {
                dotOffsetPx.snapTo(newOffsetPx)
                return@LaunchedEffect
            }

            if (isAnimating) {
                dotOffsetPx.snapTo(newOffsetPx)
                isAnimating = false
                return@LaunchedEffect
            }

            isAnimating = true
            val prevValue = tabs.getOrNull(selectedIndex)?.value

            // Dot glide starts immediately
            launch {
                dotOffsetPx.animateTo(
                    newOffsetPx,
                    tween(NavTabBarTokens.durationGlide, easing = DesignTokens.Easing.EasingGlideDecelerate)
                )
            }

            // At 8%: departing tab settles down, glow dims
            delay((NavTabBarTokens.durationGlide * 0.08).toLong())
            if (prevValue != null) {
                glowAlphas.value = glowAlphas.value.toMutableMap().apply { put(prevValue, 0f) }
            }

            // At 50%: arriving tab lifts up, glow brightens
            delay((NavTabBarTokens.durationGlide * 0.42).toLong()) // 0.50 - 0.08 = 0.42 remaining
            glowAlphas.value = glowAlphas.value.toMutableMap().apply {
                put(resolvedSelectedValue, 1f)
            }
            delay(NavTabBarTokens.durationShort.toLong())

            isAnimating = false
        }

        Box(modifier = Modifier.fillMaxWidth()) {
            // Tab items (contract: accessibility_aria_roles — selectableGroup = tablist)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .semantics { selectableGroup() },
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                tabs.forEachIndexed { index, tab ->
                    val isSelected = tab.value == resolvedSelectedValue
                    val glowAlpha = glowAlphas.value[tab.value] ?: 1f
                    val centerColor = if (isSelected) NavTabBarTokens.glowActiveCenter else NavTabBarTokens.glowInactiveCenter
                    val interactionSource = remember { MutableInteractionSource() }
                    val isPressed by interactionSource.collectIsPressedAsState()

                    // Contract: interaction_pressable — blend.pressedLighter on inactive press
                    val iconTint = when {
                        isSelected -> NavTabBarTokens.activeIconColor
                        isPressed -> NavTabBarTokens.inactiveIconColor.pressedLighterBlend()
                        else -> NavTabBarTokens.inactiveIconColor
                    }

                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center,
                        modifier = Modifier
                            .weight(1f)
                            .width(with(density) { tabWidthPx.toDp() }.coerceAtLeast(NavTabBarTokens.minTapWidth.dp))
                            .heightIn(min = NavTabBarTokens.minTabHeight.dp)
                            .clickable(
                                interactionSource = interactionSource,
                                indication = null, // custom pressed state via blend
                                role = Role.Tab
                            ) {
                                // Contract: interaction_noop_active
                                if (tab.value != resolvedSelectedValue) {
                                    onSelectionChange(tab.value)
                                }
                            }
                            .focusRequester(focusRequesters[index])
                            .focusable()
                            .onKeyEvent { event ->
                                if (event.type != KeyEventType.KeyDown) return@onKeyEvent false
                                when (event.key) {
                                    Key.DirectionLeft -> {
                                        val prev = (index - 1 + tabs.size) % tabs.size
                                        focusRequesters[prev].requestFocus()
                                        true
                                    }
                                    Key.DirectionRight -> {
                                        val next = (index + 1) % tabs.size
                                        focusRequesters[next].requestFocus()
                                        true
                                    }
                                    Key.Enter, Key.Spacebar -> {
                                        if (tab.value != resolvedSelectedValue) {
                                            onSelectionChange(tab.value)
                                        }
                                        true
                                    }
                                    else -> false
                                }
                            }
                            .padding(
                                top = (if (isSelected) NavTabBarTokens.activePaddingTop else NavTabBarTokens.inactivePaddingTop).dp,
                                start = NavTabBarTokens.activePaddingInline.dp,
                                end = NavTabBarTokens.activePaddingInline.dp,
                                bottom = (if (isSelected) NavTabBarTokens.activePaddingBottom else NavTabBarTokens.inactivePaddingBottom).dp
                            )
                            // Glow gradient — active only (contract: visual_gradient_glow)
                            .drawBehind {
                                if (isSelected) {
                                    // Ellipse: space-700 horizontal × 56% of tab height vertical
                                    val hRadius = NavTabBarTokens.glowHorizontalRadius * density.density
                                    val vRadius = size.height * 0.56f
                                    drawOval(
                                        brush = Brush.radialGradient(
                                            colorStops = arrayOf(
                                                0f to centerColor.copy(alpha = glowAlpha),
                                                0.4f to centerColor.copy(alpha = glowAlpha * 0.5f),
                                                0.8f to NavTabBarTokens.glowEdgeColor.copy(alpha = NavTabBarTokens.glowEdgeOpacity),
                                                1f to Color.Transparent
                                            ),
                                            radius = hRadius
                                        ),
                                        topLeft = androidx.compose.ui.geometry.Offset(
                                            (size.width - hRadius * 2) / 2,
                                            (size.height - vRadius * 2) / 2
                                        ),
                                        size = androidx.compose.ui.geometry.Size(hRadius * 2, vRadius * 2)
                                    )
                                }
                            }
                            .semantics {
                                role = Role.Tab
                                selected = isSelected
                                contentDescription = tab.accessibilityLabel
                            }
                    ) {
                        // Icon — solid (active) or outline (inactive)
                        IconBase(
                            name = if (isSelected) tab.activeIcon else tab.icon,
                            size = NavTabBarTokens.iconSize.dp,
                            color = iconTint
                        )
                        // Badge composition slot (empty in v1)
                        badgeContent(tab.value)
                    }
                }
            }

            // Dot indicator — positioned absolutely
            Box(
                modifier = Modifier
                    .offset { IntOffset(dotOffsetPx.value.toInt() - with(density) { (NavTabBarTokens.dotSize / 2).dp.toPx() }.toInt(), 0) }
                    .align(Alignment.BottomStart)
                    .padding(bottom = NavTabBarTokens.activePaddingBottom.dp)
                    .size(NavTabBarTokens.dotSize.dp)
                    .background(NavTabBarTokens.dotColor, CircleShape)
            )
        }
    }
}
