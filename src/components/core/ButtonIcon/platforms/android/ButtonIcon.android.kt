/**
 * Button-Icon Component for Android Platform
 * 
 * Stemma System: Buttons Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type] = Button-Icon
 * 
 * Circular icon-only interactive button with three size variants, three visual styles,
 * and comprehensive interaction states. Follows True Native Architecture with
 * build-time platform separation.
 * 
 * Uses IconBase component for icon rendering, following the same component
 * composition pattern as web and iOS platforms. This ensures cross-platform
 * consistency and single source of truth for icon rendering.
 * 
 * Design Decisions:
 * - No `disabled` prop by design (see Requirement 11.1)
 * - Required `ariaLabel` for accessibility (see Requirement 4.1)
 * - Self-contained focus ring buffer (see Requirement 6.3)
 * - Circular shape via CircleShape (see Requirement 3.4)
 * - Platform-specific press feedback: Material ripple (see Requirement 8.5)
 * 
 * @module Button-Icon/platforms/android
 * @see Requirements: 1.5, 2.4, 4.1, 11.1, 14.3
 */

package com.designerpunk.components.core

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.ripple.rememberRipple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.designerpunk.tokens.DesignTokens

// MARK: - Enums

/**
 * Button-Icon size variants.
 * 
 * Determines icon size and padding tokens used:
 * - `SMALL`: icon.size050 (16dp icon) + buttonIcon.inset.small (8dp padding)
 * - `MEDIUM`: icon.size075 (20dp icon) + buttonIcon.inset.medium (10dp padding)
 * - `LARGE`: icon.size100 (24dp icon) + buttonIcon.inset.large (12dp padding)
 * 
 * All sizes include a 4dp transparent focus buffer on all sides
 * (accessibility.focus.offset + accessibility.focus.width).
 * 
 * @see Requirements 1.1, 1.2, 1.3, 1.4, 1.5
 */
enum class ButtonIconSize {
    SMALL,
    MEDIUM,
    LARGE;
    
    /**
     * Icon size token value for this size variant
     * - SMALL: iconSize050 (16dp)
     * - MEDIUM: iconSize075 (20dp)
     * - LARGE: iconSize100 (24dp)
     * @see Requirements 1.1, 1.2, 1.3
     */
    val iconSize: Dp
        get() = when (this) {
            SMALL -> DesignTokens.icon_size_050   // 16dp
            MEDIUM -> DesignTokens.icon_size_075  // 20dp
            LARGE -> DesignTokens.icon_size_100   // 24dp
        }
    
    /**
     * Inset (padding) token value for this size variant
     * 
     * Token mapping:
     * - SMALL: buttonIcon.inset.small (8dp) → references space.inset.100
     * - MEDIUM: buttonIcon.inset.medium (10dp) → unique value, no semantic equivalent
     * - LARGE: buttonIcon.inset.large (12dp) → references space.inset.150
     * 
     * Note: SMALL and LARGE use semantic token references from DesignTokens.
     * MEDIUM uses a component-specific value (10dp) as there's no semantic equivalent.
     * 
     * @see Requirements 10.1, 10.2, 10.3
     */
    val inset: Dp
        get() = when (this) {
            SMALL -> DesignTokens.space_inset_100.dp   // buttonIcon.inset.small (8dp)
            MEDIUM -> 10.dp                            // buttonIcon.inset.medium (unique value)
            LARGE -> DesignTokens.space_inset_150.dp   // buttonIcon.inset.large (12dp)
        }
    
    /**
     * Total button size (icon + padding × 2)
     */
    val buttonSize: Dp
        get() = iconSize + (inset * 2)
}

/**
 * Button-Icon visual style variants.
 * 
 * Determines background, border, and icon color styling:
 * - `PRIMARY`: Solid color.primary background, color.contrast.onPrimary icon
 * - `SECONDARY`: Transparent background, borderDefault border with color.primary, color.primary icon
 * - `TERTIARY`: Transparent background, no border, color.primary icon
 * 
 * @see Requirements 2.1, 2.2, 2.3, 2.4
 */
enum class ButtonIconVariant {
    PRIMARY,
    SECONDARY,
    TERTIARY
}

// MARK: - ButtonIcon Composable

/**
 * ButtonIcon Jetpack Compose Component
 * 
 * A circular, icon-only button with token-based styling and platform-specific
 * interaction patterns (Material ripple effect).
 * 
 * @remarks
 * - Uses IconBase component for icon rendering
 * - Circular shape via `CircleShape`
 * - Token-based styling via Kotlin constants
 * - Self-contained focus ring buffer (4dp on all sides)
 * - WCAG 2.1 AA compliant:
 *   - Required ariaLabel for TalkBack support
 *   - Minimum 48dp touch targets for all sizes
 * 
 * @param icon Icon name (references drawable resource)
 * @param ariaLabel Accessible label for TalkBack (required)
 * @param onPress Click/tap handler
 * @param size Visual size variant (default: MEDIUM)
 * @param variant Visual style variant (default: PRIMARY)
 * @param testID Optional test identifier for automated testing
 * @param modifier Optional modifier for additional styling
 * 
 * @example
 * ```kotlin
 * // Basic usage
 * ButtonIcon(
 *     icon = "settings",
 *     ariaLabel = "Open settings",
 *     onPress = { println("Settings tapped") }
 * )
 * 
 * // With all parameters
 * ButtonIcon(
 *     icon = "settings",
 *     ariaLabel = "Open settings",
 *     onPress = { println("Settings tapped") },
 *     size = ButtonIconSize.LARGE,
 *     variant = ButtonIconVariant.PRIMARY,
 *     testID = "settings-button"
 * )
 * ```
 * 
 * @see Requirements 1.5, 2.4, 4.1, 11.1, 14.3
 */
@Composable
fun ButtonIcon(
    icon: String,
    ariaLabel: String,
    onPress: () -> Unit,
    size: ButtonIconSize = ButtonIconSize.MEDIUM,
    variant: ButtonIconVariant = ButtonIconVariant.PRIMARY,
    testID: String? = null,
    modifier: Modifier = Modifier
) {
    // Focus ring buffer size (accessibility.focus.offset + accessibility.focus.width)
    // Uses token references: space_025 (2dp offset) + border_width_200 (2dp width) = 4dp total
    // @see Requirements 1.4, 6.3
    val focusBuffer = (DesignTokens.accessibility_focus_offset + DesignTokens.accessibility_focus_width).dp
    
    // Minimum touch target size (tapAreaRecommended = 48dp)
    // Ensures WCAG 2.5.5 and 2.5.8 compliance for all sizes
    // @see Requirements 5.1, 5.2, 5.3, 5.4, 5.5
    val minTouchTarget = DesignTokens.tap_area_recommended.dp  // 48dp
    
    // Get colors based on variant
    val backgroundColor = getBackgroundColor(variant)
    val iconColor = getIconColor(variant)
    val borderWidth = getBorderWidth(variant)
    val borderColor = getBorderColor(variant)
    
    // Get ripple color based on variant
    val rippleColor = getRippleColor(variant)
    
    // Remember interaction source for ripple effect
    val interactionSource = remember { MutableInteractionSource() }
    
    // Outer Box for focus buffer and touch target extension
    Box(
        modifier = modifier
            // Focus buffer margin on all sides
            .padding(focusBuffer)
            // Extend touch target to tapAreaRecommended (48dp) for all sizes
            // @see Requirements 5.1, 5.2, 5.3, 5.4
            .sizeIn(minWidth = minTouchTarget, minHeight = minTouchTarget)
            // Test tag for automated testing
            .then(
                if (testID != null) Modifier.testTag(testID) else Modifier
            )
            // Accessibility: contentDescription for TalkBack
            // @see Requirements 4.1, 4.4
            .semantics {
                contentDescription = ariaLabel
            },
        contentAlignment = Alignment.Center
    ) {
        // Inner Box for the visual button
        Box(
            modifier = Modifier
                // Fixed size based on size variant
                .size(size.buttonSize)
                // Circular shape via CircleShape
                // @see Requirement 3.4
                .clip(CircleShape)
                // Background color based on variant
                .background(backgroundColor, CircleShape)
                // Border for secondary variant
                .then(
                    if (borderWidth > 0.dp) {
                        Modifier.border(borderWidth, borderColor, CircleShape)
                    } else {
                        Modifier
                    }
                )
                // Clickable with Material ripple effect
                // @see Requirement 8.5
                .clickable(
                    interactionSource = interactionSource,
                    indication = rememberRipple(
                        bounded = true,
                        color = rippleColor
                    ),
                    onClick = onPress
                ),
            contentAlignment = Alignment.Center
        ) {
            // Icon using IconBase component
            // Icon is decorative (contentDescription = null) since button has ariaLabel
            // @see Requirements 13.1, 13.2, 13.3, 13.4, 13.7
            IconBase(
                name = icon,
                size = size.iconSize,
                color = iconColor
            )
        }
    }
}

// MARK: - Helper Functions

/**
 * Get background color based on variant
 * - PRIMARY: color.primary (solid fill)
 * - SECONDARY/TERTIARY: transparent
 * @see Requirements 2.1, 2.2, 2.3
 */
private fun getBackgroundColor(variant: ButtonIconVariant): Color {
    return when (variant) {
        ButtonIconVariant.PRIMARY -> Color(DesignTokens.color_primary)
        ButtonIconVariant.SECONDARY, ButtonIconVariant.TERTIARY -> Color.Transparent
    }
}

/**
 * Get icon color based on variant
 * - PRIMARY: color.contrast.onPrimary (white on primary background)
 * - SECONDARY/TERTIARY: color.primary
 * @see Requirements 2.1, 2.2, 2.3
 */
private fun getIconColor(variant: ButtonIconVariant): Color {
    return when (variant) {
        ButtonIconVariant.PRIMARY -> Color(DesignTokens.color_contrast_on_primary)
        ButtonIconVariant.SECONDARY, ButtonIconVariant.TERTIARY -> Color(DesignTokens.color_primary)
    }
}

/**
 * Get border width for secondary variant
 * - SECONDARY: borderDefault (1dp)
 * - PRIMARY/TERTIARY: no border
 * @see Requirements 2.2
 */
private fun getBorderWidth(variant: ButtonIconVariant): Dp {
    return when (variant) {
        ButtonIconVariant.SECONDARY -> DesignTokens.border_border_default.dp  // borderDefault (1dp)
        ButtonIconVariant.PRIMARY, ButtonIconVariant.TERTIARY -> 0.dp
    }
}

/**
 * Get border color for secondary variant
 * - SECONDARY: color.primary
 * - PRIMARY/TERTIARY: transparent
 * @see Requirements 2.2
 */
private fun getBorderColor(variant: ButtonIconVariant): Color {
    return when (variant) {
        ButtonIconVariant.SECONDARY -> Color(DesignTokens.color_primary)
        ButtonIconVariant.PRIMARY, ButtonIconVariant.TERTIARY -> Color.Transparent
    }
}

/**
 * Get ripple color based on variant for Material ripple effect
 * - PRIMARY: white ripple on primary background
 * - SECONDARY/TERTIARY: primary color ripple on transparent background
 * @see Requirement 8.5
 */
private fun getRippleColor(variant: ButtonIconVariant): Color {
    return when (variant) {
        ButtonIconVariant.PRIMARY -> Color(DesignTokens.color_contrast_on_primary)
        ButtonIconVariant.SECONDARY, ButtonIconVariant.TERTIARY -> Color(DesignTokens.color_primary)
    }
}

// MARK: - Preview

/**
 * Preview for ButtonIcon component showing different sizes and variants
 * 
 * Demonstrates:
 * - Three size variants (SMALL, MEDIUM, LARGE)
 * - Three visual style variants (PRIMARY, SECONDARY, TERTIARY)
 * - testID support for automated testing
 * - Icon variety
 */
@Preview(showBackground = true, name = "ButtonIcon Sizes and Variants")
@Composable
fun ButtonIconPreview() {
    Column(
        modifier = Modifier.padding(DesignTokens.space_200.dp),
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_300.dp)
    ) {
        // Size variants
        androidx.compose.material3.Text(
            text = "Size Variants",
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium
        )
        
        Row(
            horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_200.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                ButtonIcon(
                    icon = "settings",
                    ariaLabel = "Settings",
                    onPress = {},
                    size = ButtonIconSize.SMALL
                )
                androidx.compose.material3.Text(
                    text = "Small",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall
                )
            }
            
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                ButtonIcon(
                    icon = "settings",
                    ariaLabel = "Settings",
                    onPress = {},
                    size = ButtonIconSize.MEDIUM
                )
                androidx.compose.material3.Text(
                    text = "Medium",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall
                )
            }
            
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                ButtonIcon(
                    icon = "settings",
                    ariaLabel = "Settings",
                    onPress = {},
                    size = ButtonIconSize.LARGE
                )
                androidx.compose.material3.Text(
                    text = "Large",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall
                )
            }
        }
        
        androidx.compose.material3.Divider()
        
        // Primary variant
        androidx.compose.material3.Text(
            text = "Primary Variant",
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium
        )
        
        Row(horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_200.dp)) {
            ButtonIcon(
                icon = "plus",
                ariaLabel = "Add",
                onPress = {},
                size = ButtonIconSize.SMALL,
                variant = ButtonIconVariant.PRIMARY
            )
            
            ButtonIcon(
                icon = "plus",
                ariaLabel = "Add",
                onPress = {},
                size = ButtonIconSize.MEDIUM,
                variant = ButtonIconVariant.PRIMARY
            )
            
            ButtonIcon(
                icon = "plus",
                ariaLabel = "Add",
                onPress = {},
                size = ButtonIconSize.LARGE,
                variant = ButtonIconVariant.PRIMARY
            )
        }
        
        androidx.compose.material3.Divider()
        
        // Secondary variant
        androidx.compose.material3.Text(
            text = "Secondary Variant",
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium
        )
        
        Row(horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_200.dp)) {
            ButtonIcon(
                icon = "heart",
                ariaLabel = "Favorite",
                onPress = {},
                size = ButtonIconSize.SMALL,
                variant = ButtonIconVariant.SECONDARY
            )
            
            ButtonIcon(
                icon = "heart",
                ariaLabel = "Favorite",
                onPress = {},
                size = ButtonIconSize.MEDIUM,
                variant = ButtonIconVariant.SECONDARY
            )
            
            ButtonIcon(
                icon = "heart",
                ariaLabel = "Favorite",
                onPress = {},
                size = ButtonIconSize.LARGE,
                variant = ButtonIconVariant.SECONDARY
            )
        }
        
        androidx.compose.material3.Divider()
        
        // Tertiary variant
        androidx.compose.material3.Text(
            text = "Tertiary Variant",
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium
        )
        
        Row(horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_200.dp)) {
            ButtonIcon(
                icon = "x",
                ariaLabel = "Close",
                onPress = {},
                size = ButtonIconSize.SMALL,
                variant = ButtonIconVariant.TERTIARY
            )
            
            ButtonIcon(
                icon = "x",
                ariaLabel = "Close",
                onPress = {},
                size = ButtonIconSize.MEDIUM,
                variant = ButtonIconVariant.TERTIARY
            )
            
            ButtonIcon(
                icon = "x",
                ariaLabel = "Close",
                onPress = {},
                size = ButtonIconSize.LARGE,
                variant = ButtonIconVariant.TERTIARY
            )
        }
        
        androidx.compose.material3.Divider()
        
        // testID support
        androidx.compose.material3.Text(
            text = "testID Support",
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium
        )
        
        Row(horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_200.dp)) {
            ButtonIcon(
                icon = "arrow-right",
                ariaLabel = "Next",
                onPress = {},
                testID = "next-button"
            )
            
            ButtonIcon(
                icon = "check",
                ariaLabel = "Confirm",
                onPress = {},
                testID = "confirm-button"
            )
        }
        
        androidx.compose.material3.Divider()
        
        // Icon variety
        androidx.compose.material3.Text(
            text = "Icon Variety",
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium
        )
        
        Row(horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_200.dp)) {
            ButtonIcon(icon = "arrow-left", ariaLabel = "Back", onPress = {})
            ButtonIcon(icon = "arrow-up", ariaLabel = "Up", onPress = {})
            ButtonIcon(icon = "arrow-down", ariaLabel = "Down", onPress = {})
            ButtonIcon(icon = "chevron-right", ariaLabel = "Forward", onPress = {})
        }
        
        Row(horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_200.dp)) {
            ButtonIcon(icon = "plus", ariaLabel = "Add", onPress = {})
            ButtonIcon(icon = "minus", ariaLabel = "Remove", onPress = {})
            ButtonIcon(icon = "user", ariaLabel = "Profile", onPress = {})
            ButtonIcon(icon = "mail", ariaLabel = "Email", onPress = {})
        }
    }
}
