/**
 * Button-CTA Component for Android Platform
 * 
 * Cross-platform call-to-action button with three size variants (small, medium, large),
 * three visual styles (primary, secondary, tertiary), and comprehensive interaction states.
 * 
 * Stemma System Naming: [Family]-[Type] = Button-CTA
 * Component Type: Standalone (no behavioral variants)
 * 
 * Follows True Native Architecture with platform-specific Jetpack Compose implementation
 * while maintaining API consistency with web and iOS platforms.
 * 
 * Uses theme-aware blend utilities (Color extensions with Compose MaterialTheme) for
 * state colors (hover, pressed, disabled, icon) instead of opacity or Material ripple
 * workarounds. This ensures cross-platform consistency with Web and iOS implementations.
 * 
 * Part of the DesignerPunk CTA Button Component system.
 * 
 * @module Button-CTA/platforms/android
 * @see Requirements: 7.1, 7.2, 7.3, 7.4, 11.1, 11.2, 11.3
 */

package com.designerpunk.components.core

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.designerpunk.tokens.DesignTokens
// Import theme-aware blend utilities (Color extension functions from ThemeAwareBlendUtilities.android.kt)
// These provide semantic blend methods: hoverBlend(), pressedBlend(), disabledBlend(), iconBlend()
// @see Requirements: 11.1, 11.2, 11.3 - Theme-aware utilities
import com.designerpunk.tokens.hoverBlend
import com.designerpunk.tokens.pressedBlend
import com.designerpunk.tokens.disabledBlend
import com.designerpunk.tokens.iconBlend

/**
 * Button size variants
 * 
 * Defines three size options that follow the 8px baseline grid and meet
 * WCAG 2.1 AA touch target requirements (44dp minimum).
 * 
 * - SMALL: 40dp visual height (extends to 44dp touch target)
 * - MEDIUM: 48dp visual height (meets 44dp touch target)
 * - LARGE: 56dp visual height (exceeds 44dp touch target)
 */
enum class ButtonCTASize {
    SMALL,
    MEDIUM,
    LARGE
}

/**
 * Button visual styles
 * 
 * Defines three visual styles that establish clear hierarchy through
 * visual weight progression.
 * 
 * - PRIMARY: Filled background with primary color (highest emphasis)
 * - SECONDARY: Outlined with primary color border (medium emphasis)
 * - TERTIARY: Text-only with primary color (lowest emphasis)
 */
enum class ButtonCTAStyle {
    PRIMARY,
    SECONDARY,
    TERTIARY
}

/**
 * ButtonCTA component for Android platform.
 * 
 * Renders a call-to-action button with Material3 Surface composable, supporting
 * three size variants, three visual styles, optional leading icons, and
 * theme-aware blend utilities for state colors.
 * 
 * Uses theme-aware Color extensions (hoverBlend(), pressedBlend(), disabledBlend(),
 * iconBlend()) with Compose MaterialTheme for automatic theme color updates.
 * 
 * Usage:
 * ```kotlin
 * // Basic usage
 * ButtonCTA(
 *     label = "Submit",
 *     onPress = { println("Submitted") }
 * )
 * 
 * // With size and style
 * ButtonCTA(
 *     label = "Get Started",
 *     size = ButtonCTASize.LARGE,
 *     style = ButtonCTAStyle.PRIMARY,
 *     onPress = { handleStart() }
 * )
 * 
 * // With icon
 * ButtonCTA(
 *     label = "Continue",
 *     size = ButtonCTASize.MEDIUM,
 *     style = ButtonCTAStyle.PRIMARY,
 *     icon = "arrow-right",
 *     onPress = { handleContinue() }
 * )
 * ```
 * 
 * Requirements:
 * - 1.1-1.7: Size variants (small: 40dp, medium: 48dp, large: 56dp)
 * - 2.1-2.4: Visual styles (primary, secondary, tertiary)
 * - 7.1-7.4: Blend utility state colors (hover, pressed, disabled, icon)
 * - 8.1-8.6: Icon support with leading position
 * - 11.1-11.3: Theme-aware blend utilities with Compose MaterialTheme
 * - 13.1-13.4: Touch target accessibility (44dp minimum)
 * 
 * @param label Button text label (required)
 * @param size Button size variant (default: MEDIUM)
 * @param style Button visual style (default: PRIMARY)
 * @param icon Optional leading icon name
 * @param noWrap Prevent text wrapping (default: false)
 * @param onPress Click/tap handler (required)
 * @param testID Optional test identifier
 * @param disabled Optional disabled state (default: false)
 */
@Composable
fun ButtonCTA(
    label: String,
    size: ButtonCTASize = ButtonCTASize.MEDIUM,
    style: ButtonCTAStyle = ButtonCTAStyle.PRIMARY,
    icon: String? = null,
    noWrap: Boolean = false,
    onPress: () -> Unit,
    testID: String? = null,
    disabled: Boolean = false
) {
    // Remember interaction source for tracking pressed state
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    
    // Get size-based configuration
    val sizeConfig = getButtonCTASizeConfig(size)
    
    // Get style-based configuration with blend utilities
    val styleConfig = getButtonCTAStyleConfig(style, isPressed, disabled)
    
    // Use Surface with clickable modifier (no ripple indication for cross-platform consistency)
    Surface(
        modifier = Modifier
            // Requirement 13.1-13.4: Touch target accessibility (44dp minimum)
            // Small buttons extend from 40dp visual to 44dp touch target
            .heightIn(min = sizeConfig.touchTargetHeight.dp)
            // Requirement 6.1-6.3: Minimum width
            .widthIn(min = sizeConfig.minWidth.dp)
            // Requirement 16.5: Test tag for automated testing
            .testTag(testID ?: "")
            // Apply clickable without ripple indication (blend colors handle state feedback)
            .clickable(
                onClick = onPress,
                enabled = !disabled,
                interactionSource = interactionSource,
                indication = null // No ripple - using blend colors for state feedback
            ),
        // Requirement 2.1-2.3, 7.1-7.5: Background color based on style and state
        color = styleConfig.backgroundColor,
        // Requirement 5.1-5.3: Border radius based on size
        shape = RoundedCornerShape(sizeConfig.borderRadius.dp),
        // Requirement 2.2: Border for secondary style
        border = if (style == ButtonCTAStyle.SECONDARY) {
            BorderStroke(
                width = styleConfig.borderWidth.dp,
                color = styleConfig.borderColor
            )
        } else null
    ) {
        // Requirement 3.1-3.3, 4.1-4.3: Padding based on size
        Box(
            modifier = Modifier.padding(
                horizontal = sizeConfig.horizontalPadding.dp,
                vertical = sizeConfig.verticalPadding.dp
            ),
            contentAlignment = Alignment.Center
        ) {
            // Requirement 8.1-8.6: Icon-text layout with Row
            Row(
                horizontalArrangement = Arrangement.spacedBy(sizeConfig.iconTextSpacing.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Optional leading icon
                // Requirements: 8.1-8.6, 9.1-9.3
                icon?.let { iconName ->
                    // Requirement 8.1: Render icon in leading position (left of text)
                    // Requirement 8.2-8.3: Use correct icon size based on button size
                    // Requirement 9.1-9.2: Apply icon color with optical balance using blend utility
                    // Requirement 16.3: Mark icon as decorative (contentDescription = null)
                    // A3: Use Dp directly without conversion
                    Icon(
                        name = iconName,
                        size = sizeConfig.iconSize,
                        color = styleConfig.iconColor
                    )
                }
                
                // Button label text
                // Requirement 16.5: Support TalkBack screen reader
                Text(
                    text = label,
                    style = sizeConfig.typography,
                    color = styleConfig.textColor,
                    // Requirement 7.1-7.4: Text wrapping behavior
                    maxLines = if (noWrap) 1 else Int.MAX_VALUE,
                    overflow = if (noWrap) TextOverflow.Ellipsis else TextOverflow.Visible,
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

/**
 * Size configuration data class
 * 
 * Encapsulates all size-related properties for a button size variant.
 * 
 * @property height Visual button height in dp
 * @property touchTargetHeight Touch target height in dp (44dp minimum for accessibility)
 * @property typography Text style for button label
 * @property horizontalPadding Horizontal padding in dp
 * @property verticalPadding Vertical padding in dp
 * @property borderRadius Corner radius in dp
 * @property minWidth Minimum button width in dp
 * @property iconSize Icon size in Dp (changed from Int to Dp for A3)
 * @property iconTextSpacing Spacing between icon and text in dp
 */
private data class ButtonCTASizeConfig(
    val height: Int,
    val touchTargetHeight: Int,
    val typography: TextStyle,
    val horizontalPadding: Int,
    val verticalPadding: Int,
    val borderRadius: Int,
    val minWidth: Int,
    val iconSize: Dp,
    val iconTextSpacing: Int
)

/**
 * Get size configuration for a button size variant.
 * 
 * Returns configuration object with all size-related properties based on
 * the mathematical token system and 8dp baseline grid.
 * 
 * Requirements:
 * - 1.1-1.7: Size variants with baseline grid alignment
 * - 3.1-3.3: Horizontal padding (2:1 ratio with height)
 * - 4.1-4.3: Vertical padding (calculated from height and line height)
 * - 5.1-5.3: Border radius (proportional to size)
 * - 6.1-6.3: Minimum width
 * - 8.2-8.5: Icon size and spacing
 * - 13.1-13.4: Touch target accessibility
 * 
 * @param size Button size variant
 * @return Size configuration object
 */
private fun getButtonCTASizeConfig(size: ButtonCTASize): ButtonCTASizeConfig {
    return when (size) {
        ButtonCTASize.SMALL -> ButtonCTASizeConfig(
            height = 40,
            touchTargetHeight = DesignTokens.tap_area_minimum.toInt(), // Requirement 13.1: Extends to 44dp for accessibility (tapAreaMinimum)
            typography = TextStyle(
                fontSize = DesignTokens.font_size_100.sp,
                fontWeight = FontWeight(DesignTokens.font_weight_500.toInt()),
                lineHeight = DesignTokens.line_height_100.sp,
                fontFamily = androidx.compose.ui.text.font.FontFamily.Default,
                letterSpacing = DesignTokens.letter_spacing_100.sp
            ), // A2: typography.labelMd (medium weight for button emphasis)
            horizontalPadding = DesignTokens.space_inset_200.toInt(), // space.inset.200 (16dp)
            verticalPadding = DesignTokens.space_inset_100.toInt(),   // space.inset.100 (8dp)
            borderRadius = DesignTokens.radius_100.toInt(),            // radius100 (8dp)
            minWidth = 56,          // Requirement 6.1
            iconSize = DesignTokens.icon_size_100,      // A3: icon.size100 (24dp) - use Dp directly
            iconTextSpacing = DesignTokens.space_grouped_tight.toInt() // space.grouped.tight (4dp)
        )
        ButtonCTASize.MEDIUM -> ButtonCTASizeConfig(
            height = 48,
            touchTargetHeight = 48, // Requirement 13.2: Meets 44dp minimum
            typography = TextStyle(
                fontSize = DesignTokens.font_size_100.sp,
                fontWeight = FontWeight(DesignTokens.font_weight_500.toInt()),
                lineHeight = DesignTokens.line_height_100.sp,
                fontFamily = androidx.compose.ui.text.font.FontFamily.Default,
                letterSpacing = DesignTokens.letter_spacing_100.sp
            ), // A2: typography.labelMd (medium weight for button emphasis)
            horizontalPadding = DesignTokens.space_inset_300.toInt(), // space.inset.300 (24dp)
            verticalPadding = DesignTokens.space_inset_150.toInt(),   // space.inset.150 (12dp)
            borderRadius = DesignTokens.radius_150.toInt(),            // radius150 (12dp)
            minWidth = 72,          // Requirement 6.2
            iconSize = DesignTokens.icon_size_100,      // A3: icon.size100 (24dp) - use Dp directly
            iconTextSpacing = DesignTokens.space_grouped_normal.toInt() // space.grouped.normal (8dp)
        )
        ButtonCTASize.LARGE -> ButtonCTASizeConfig(
            height = 56,
            touchTargetHeight = 56, // Requirement 13.2: Exceeds 44dp minimum
            typography = TextStyle(
                fontSize = DesignTokens.font_size_125.sp,
                fontWeight = FontWeight(DesignTokens.font_weight_500.toInt()),
                lineHeight = DesignTokens.line_height_125.sp,
                fontFamily = androidx.compose.ui.text.font.FontFamily.Default,
                letterSpacing = DesignTokens.letter_spacing_125.sp
            ), // A2: typography.labelLg (medium weight for button emphasis)
            horizontalPadding = DesignTokens.space_inset_400.toInt(), // space.inset.400 (32dp)
            verticalPadding = DesignTokens.space_inset_150.toInt(),   // space.inset.150 (12dp)
            borderRadius = DesignTokens.radius_200.toInt(),            // radius200 (16dp)
            minWidth = 80,          // Requirement 6.3
            iconSize = DesignTokens.icon_size_125,      // A3: icon.size125 (32dp) - use Dp directly
            iconTextSpacing = DesignTokens.space_grouped_normal.toInt() // space.grouped.normal (8dp)
        )
    }
}

/**
 * Style configuration data class
 * 
 * Encapsulates all style-related properties for a button visual style.
 * Uses blend utilities for state colors (pressed, disabled, icon optical balance).
 * 
 * @property backgroundColor Background color (includes state-based blend)
 * @property textColor Text color
 * @property iconColor Icon color (with optical balance using blend utility)
 * @property borderWidth Border width in dp
 * @property borderColor Border color
 */
private data class ButtonCTAStyleConfig(
    val backgroundColor: Color,
    val textColor: Color,
    val iconColor: Color,
    val borderWidth: Int,
    val borderColor: Color
)

/**
 * Get style configuration for a button visual style with state-based blend colors.
 * 
 * Returns configuration object with all style-related properties based on
 * semantic color tokens and theme-aware blend utilities for state colors.
 * 
 * Uses theme-aware Color extensions (hoverBlend(), pressedBlend(), disabledBlend(),
 * iconBlend()) instead of direct blend calculations for cross-platform consistency
 * with Web and iOS implementations.
 * 
 * Requirements:
 * - 2.1-2.4: Visual styles (primary, secondary, tertiary)
 * - 7.1-7.4: Blend utility state colors (hover, pressed, disabled, icon)
 * - 9.1-9.3: Icon color with optical balance using blend utility
 * - 11.1-11.3: Theme-aware blend utilities with Compose MaterialTheme
 * 
 * @param style Button visual style
 * @param isPressed Whether button is currently pressed
 * @param disabled Whether button is disabled
 * @return Style configuration object with blend-calculated colors
 */
private fun getButtonCTAStyleConfig(style: ButtonCTAStyle, isPressed: Boolean, disabled: Boolean): ButtonCTAStyleConfig {
    // Import semantic color tokens from generated constants
    val colorPrimary = Color(DesignTokens.color_primary)           // color.primary (purple)
    val colorBackground = Color(DesignTokens.color_background)     // color.background (white)
    val colorContrastOnPrimary = Color(DesignTokens.color_contrast_on_primary) // color.contrast.onPrimary (white)
    
    // Calculate state-based background colors using theme-aware blend utilities
    // @see Requirements: 7.1, 7.2, 7.3, 11.1, 11.2, 11.3
    val primaryBgColor = when {
        // @see Requirements: 7.3 - Disabled uses desaturate(color.primary, blend.disabledDesaturate)
        disabled -> colorPrimary.disabledBlend()
        // @see Requirements: 7.2 - Pressed uses darkerBlend(color.primary, blend.pressedDarker)
        isPressed -> colorPrimary.pressedBlend()
        else -> colorPrimary
    }
    
    val secondaryBgColor = when {
        disabled -> colorBackground
        // @see Requirements: 7.2 - Pressed uses darkerBlend for secondary background
        isPressed -> colorBackground.pressedBlend()
        else -> colorBackground
    }
    
    // Calculate icon colors with optical balance using theme-aware blend utility
    // iconBlend() applies lighterBlend with blend.iconLighter (8%) for optical weight compensation
    // @see Requirements: 7.4, 11.1, 11.2, 11.3
    val primaryIconColor = colorContrastOnPrimary.iconBlend()
    val secondaryIconColor = colorPrimary.iconBlend()
    
    return when (style) {
        ButtonCTAStyle.PRIMARY -> ButtonCTAStyleConfig(
            backgroundColor = primaryBgColor,        // Requirement 2.1, 7.2, 7.3: color.primary with blend states
            textColor = colorContrastOnPrimary,      // Requirement 2.1: color.contrast.onPrimary
            iconColor = primaryIconColor,            // Requirement 9.1, 7.4: color.contrast.onPrimary with optical balance
            borderWidth = 0,
            borderColor = Color.Transparent
        )
        ButtonCTAStyle.SECONDARY -> ButtonCTAStyleConfig(
            backgroundColor = secondaryBgColor,      // Requirement 2.2, 7.2: color.background with blend states
            textColor = colorPrimary,                // Requirement 2.2: color.primary
            iconColor = secondaryIconColor,          // Requirement 9.2, 7.4: color.primary with optical balance
            borderWidth = DesignTokens.border_border_default.toInt(), // border.default (1dp)
            borderColor = colorPrimary               // Requirement 2.2: color.primary
        )
        ButtonCTAStyle.TERTIARY -> ButtonCTAStyleConfig(
            backgroundColor = Color.Transparent,     // Requirement 2.3: transparent
            textColor = colorPrimary,                // Requirement 2.3: color.primary
            iconColor = secondaryIconColor,          // Requirement 9.2, 7.4: color.primary with optical balance
            borderWidth = 0,
            borderColor = Color.Transparent
        )
    }
}
