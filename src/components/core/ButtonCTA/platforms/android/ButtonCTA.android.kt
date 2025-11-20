/**
 * ButtonCTA Component for Android Platform
 * 
 * Cross-platform call-to-action button with three size variants (small, medium, large),
 * three visual styles (primary, secondary, tertiary), and comprehensive interaction states.
 * 
 * Follows True Native Architecture with platform-specific Jetpack Compose implementation
 * while maintaining API consistency with web and iOS platforms.
 * 
 * Part of the DesignerPunk CTA Button Component system.
 * 
 * @module ButtonCTA/platforms/android
 */

package com.designerpunk.components.core

import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.material.ripple.rememberRipple
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
enum class ButtonSize {
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
enum class ButtonStyle {
    PRIMARY,
    SECONDARY,
    TERTIARY
}

/**
 * ButtonCTA component for Android platform.
 * 
 * Renders a call-to-action button with Material3 Button composable, supporting
 * three size variants, three visual styles, optional leading icons, and
 * platform-specific interaction patterns (Material ripple effect).
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
 *     size = ButtonSize.LARGE,
 *     style = ButtonStyle.PRIMARY,
 *     onPress = { handleStart() }
 * )
 * 
 * // With icon
 * ButtonCTA(
 *     label = "Continue",
 *     size = ButtonSize.MEDIUM,
 *     style = ButtonStyle.PRIMARY,
 *     icon = "arrow-right",
 *     onPress = { handleContinue() }
 * )
 * ```
 * 
 * Requirements:
 * - 1.1-1.7: Size variants (small: 40dp, medium: 48dp, large: 56dp)
 * - 2.1-2.4: Visual styles (primary, secondary, tertiary)
 * - 8.1-8.6: Icon support with leading position
 * - 13.1-13.4: Touch target accessibility (44dp minimum)
 * - 17.3: Platform-specific Material ripple effect
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
    size: ButtonSize = ButtonSize.MEDIUM,
    style: ButtonStyle = ButtonStyle.PRIMARY,
    icon: String? = null,
    noWrap: Boolean = false,
    onPress: () -> Unit,
    testID: String? = null,
    disabled: Boolean = false
) {
    // Remember interaction source for ripple effect
    // Requirement 17.3: Material ripple effect with color.primary at 16% opacity
    val interactionSource = remember { MutableInteractionSource() }
    
    // Get size-based configuration
    val sizeConfig = getSizeConfig(size)
    
    // Get style-based configuration
    val styleConfig = getStyleConfig(style)
    
    Button(
        onClick = onPress,
        modifier = Modifier
            // Requirement 13.1-13.4: Touch target accessibility (44dp minimum)
            // Small buttons extend from 40dp visual to 44dp touch target
            .heightIn(min = sizeConfig.touchTargetHeight.dp)
            // Requirement 6.1-6.3: Minimum width
            .widthIn(min = sizeConfig.minWidth.dp)
            // Requirement 16.5: Test tag for automated testing
            .testTag(testID ?: ""),
        enabled = !disabled,
        // Requirement 2.1-2.3: Button colors based on style
        colors = ButtonDefaults.buttonColors(
            containerColor = styleConfig.backgroundColor,
            contentColor = styleConfig.textColor,
            disabledContainerColor = styleConfig.backgroundColor.copy(alpha = 0.38f),
            disabledContentColor = styleConfig.textColor.copy(alpha = 0.38f)
        ),
        // Requirement 5.1-5.3: Border radius based on size
        shape = MaterialTheme.shapes.small.copy(
            topStart = androidx.compose.foundation.shape.CornerSize(sizeConfig.borderRadius.dp),
            topEnd = androidx.compose.foundation.shape.CornerSize(sizeConfig.borderRadius.dp),
            bottomStart = androidx.compose.foundation.shape.CornerSize(sizeConfig.borderRadius.dp),
            bottomEnd = androidx.compose.foundation.shape.CornerSize(sizeConfig.borderRadius.dp)
        ),
        // Requirement 3.1-3.3, 4.1-4.3: Padding based on size
        contentPadding = PaddingValues(
            horizontal = sizeConfig.horizontalPadding.dp,
            vertical = sizeConfig.verticalPadding.dp
        ),
        // Requirement 2.2: Border for secondary style
        border = if (style == ButtonStyle.SECONDARY) {
            androidx.compose.foundation.BorderStroke(
                width = styleConfig.borderWidth.dp,
                color = styleConfig.borderColor
            )
        } else null,
        interactionSource = interactionSource
    ) {
        // Requirement 8.1-8.6: Icon-text layout with Row
        Row(
            horizontalArrangement = Arrangement.spacedBy(sizeConfig.iconTextSpacing.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Optional leading icon
            // Requirements: 8.1-8.6, 9.1-9.3
            icon?.let { iconName ->
                // TODO: Integrate with Icon component from Icon System (Spec 004)
                // Icon(
                //     name = iconName,
                //     size = sizeConfig.iconSize,
                //     color = styleConfig.iconColor,
                //     contentDescription = null // Requirement 16.3: Mark icon as decorative
                // )
                
                // Placeholder for icon integration
                // This will be implemented when Icon component is available for Android
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
 * @property iconSize Icon size in dp
 * @property iconTextSpacing Spacing between icon and text in dp
 */
private data class SizeConfig(
    val height: Int,
    val touchTargetHeight: Int,
    val typography: TextStyle,
    val horizontalPadding: Int,
    val verticalPadding: Int,
    val borderRadius: Int,
    val minWidth: Int,
    val iconSize: Int,
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
private fun getSizeConfig(size: ButtonSize): SizeConfig {
    return when (size) {
        ButtonSize.SMALL -> SizeConfig(
            height = 40,
            touchTargetHeight = 44, // Requirement 13.1: Extends to 44dp for accessibility
            typography = TextStyle(
                fontSize = 16.sp,
                fontWeight = FontWeight.Normal,
                lineHeight = 24.sp
            ), // typography.bodyMd
            horizontalPadding = 16, // space.inset.spacious
            verticalPadding = 8,    // space.inset.normal
            borderRadius = 8,       // radius100
            minWidth = 56,          // Requirement 6.1
            iconSize = 24,          // icon.size100
            iconTextSpacing = 4     // space.grouped.tight
        )
        ButtonSize.MEDIUM -> SizeConfig(
            height = 48,
            touchTargetHeight = 48, // Requirement 13.2: Meets 44dp minimum
            typography = TextStyle(
                fontSize = 16.sp,
                fontWeight = FontWeight.Normal,
                lineHeight = 24.sp
            ), // typography.bodyMd
            horizontalPadding = 24, // space.inset.expansive
            verticalPadding = 12,   // space.inset.comfortable
            borderRadius = 12,      // radius150
            minWidth = 72,          // Requirement 6.2
            iconSize = 24,          // icon.size100
            iconTextSpacing = 8     // space.grouped.normal
        )
        ButtonSize.LARGE -> SizeConfig(
            height = 56,
            touchTargetHeight = 56, // Requirement 13.2: Exceeds 44dp minimum
            typography = TextStyle(
                fontSize = 18.sp,
                fontWeight = FontWeight.Normal,
                lineHeight = 28.sp
            ), // typography.bodyLg
            horizontalPadding = 32, // space.inset.generous
            verticalPadding = 12,   // space.inset.comfortable
            borderRadius = 16,      // radius200
            minWidth = 80,          // Requirement 6.3
            iconSize = 32,          // icon.size125
            iconTextSpacing = 8     // space.grouped.normal
        )
    }
}

/**
 * Style configuration data class
 * 
 * Encapsulates all style-related properties for a button visual style.
 * 
 * @property backgroundColor Background color
 * @property textColor Text color
 * @property iconColor Icon color (with optical balance for secondary/tertiary)
 * @property borderWidth Border width in dp
 * @property borderColor Border color
 */
private data class StyleConfig(
    val backgroundColor: Color,
    val textColor: Color,
    val iconColor: Color,
    val borderWidth: Int,
    val borderColor: Color
)

/**
 * Get style configuration for a button visual style.
 * 
 * Returns configuration object with all style-related properties based on
 * semantic color tokens and compositional architecture.
 * 
 * Requirements:
 * - 2.1-2.4: Visual styles (primary, secondary, tertiary)
 * - 9.1-9.3: Icon color with optical balance
 * 
 * @param style Button visual style
 * @return Style configuration object
 */
private fun getStyleConfig(style: ButtonStyle): StyleConfig {
    // color.primary = #6750A4 (purple)
    val colorPrimary = Color(0xFF6750A4)
    // color.background = #FFFFFF (white)
    val colorBackground = Color(0xFFFFFFFF)
    // color.text.onPrimary = #FFFFFF (white)
    val colorTextOnPrimary = Color(0xFFFFFFFF)
    // color.icon.opticalBalance = 20% lighter primary for visual weight compensation
    val colorIconOpticalBalance = Color(0xFF8170B8)
    
    return when (style) {
        ButtonStyle.PRIMARY -> StyleConfig(
            backgroundColor = colorPrimary,      // Requirement 2.1
            textColor = colorTextOnPrimary,      // Requirement 2.1
            iconColor = colorTextOnPrimary,      // Requirement 9.1
            borderWidth = 0,
            borderColor = Color.Transparent
        )
        ButtonStyle.SECONDARY -> StyleConfig(
            backgroundColor = colorBackground,   // Requirement 2.2
            textColor = colorPrimary,            // Requirement 2.2
            iconColor = colorIconOpticalBalance, // Requirement 9.2: With optical balance
            borderWidth = 1,                     // border.default
            borderColor = colorPrimary           // Requirement 2.2
        )
        ButtonStyle.TERTIARY -> StyleConfig(
            backgroundColor = Color.Transparent, // Requirement 2.3
            textColor = colorPrimary,            // Requirement 2.3
            iconColor = colorIconOpticalBalance, // Requirement 9.2: With optical balance
            borderWidth = 0,
            borderColor = Color.Transparent
        )
    }
}
