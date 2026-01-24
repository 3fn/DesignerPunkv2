/**
 * Badge-Label-Base Component for Android Platform
 * 
 * Stemma System: Badge Family
 * Component Type: Type Primitive (Label)
 * Naming Convention: [Family]-[Type]-[Variant] = Badge-Label-Base
 * 
 * A read-only, non-interactive visual indicator for displaying categorization,
 * status, or metadata text. Follows True Native Architecture with build-time
 * platform separation.
 * 
 * Key Characteristics:
 * - Read-only: Display-only, no click/tap behavior
 * - Non-interactive: Not focusable, not in tab order
 * - Compact: Small footprint, designed for inline use
 * - Informational: Conveys status or metadata at a glance
 * 
 * Uses IconBase component for icon rendering, following the same component
 * composition pattern as web and iOS platforms.
 * 
 * @module Badge-Label-Base/platforms/android
 * @see Requirements: 1.1-1.10, 4.1, 4.2, 4.4, 4.5, 4.6, 4.8, 5.3
 * @see .kiro/specs/044-badge-base/design.md for design specification
 */

package com.designerpunk.components.core

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.designerpunk.tokens.DesignTokens

// MARK: - Badge-Label-Base Size Enum

/**
 * Badge-Label-Base size variants.
 * 
 * Each size maps to specific typography and spacing tokens:
 * - SM: typography.labelXs, space.inset.none (v), space.inset.050 (h), icon.size050
 * - MD: typography.labelSm, space.inset.050 (v), space.inset.100 (h), icon.size075
 * - LG: typography.labelMd, space.inset.100 (v), space.inset.150 (h), icon.size100
 * 
 * @see Requirements: 1.2, 1.3 - Size variants with default md
 */
enum class BadgeLabelBaseSize {
    SM,
    MD,
    LG
}

// MARK: - Badge-Label-Base Tokens

/**
 * Badge-Label-Base component tokens.
 * 
 * In a production Android project, the component token (maxWidth) would be imported
 * from the generated `ComponentTokens.android.kt` file. For this reference implementation,
 * we define the tokens here with the same name and values as the generated file.
 * 
 * Component tokens (from generated ComponentTokens.android.kt):
 * - maxWidth: 120 - Maximum width for truncated badges
 * 
 * Semantic token references (from DesignTokens):
 * - cornerRadius, backgroundColor, textColor, iconColor
 * 
 * @see dist/ComponentTokens.android.kt - Generated component tokens
 * @see Requirements: 4.1, 4.2, 4.4, 4.5, 4.6, 4.8 - Token integration
 */
private object BadgeLabelBaseTokens {
    // MARK: - Component Token (matches generated ComponentTokens.android.kt)
    
    /** Maximum width for truncated badges (120dp)
     * Component token: badge.label.maxWidth
     * Allows ~12-15 characters before ellipsis while maintaining compact badge appearance
     * Value follows spacing family pattern (8 × 15 = 120dp)
     * Unitless value - apply .dp at point of use
     * @see Requirements: 4.8 - badge.label.maxWidth token
     */
    const val maxWidth: Int = 120  // badge.label.maxWidth
    
    // MARK: - Shape Token
    
    /** Border radius for badge shape
     * References: radiusSubtle → radius025 (2dp)
     * @see Requirements: 4.2 - radiusSubtle for border radius
     */
    val cornerRadius: Dp = DesignTokens.radius_025
    
    // MARK: - Color Tokens
    
    /** Background color for badge
     * References: color.surface → white200
     * @see Requirements: Design.md - Default colors
     */
    val backgroundColor: Color = Color(DesignTokens.color_surface)
    
    /** Text color for badge
     * References: color.text.default → gray300
     * @see Requirements: Design.md - Default colors
     */
    val textColor: Color = Color(DesignTokens.color_text_default)
    
    /** Icon color for badge
     * References: color.icon.default → gray200
     * @see Requirements: Design.md - Default colors
     */
    val iconColor: Color = Color(DesignTokens.color_icon_default)
}

/**
 * Size-specific token configuration for Badge-Label-Base.
 * 
 * @see Requirements: 4.1, 4.4, 4.5, 4.6 - Token mappings per size
 */
private data class BadgeLabelBaseSizeConfig(
    val fontSize: Float,
    val lineHeight: Float,
    val paddingVertical: Dp,
    val paddingHorizontal: Dp,
    val iconSize: Dp,
    val iconGap: Dp,
    val typographyTokenReference: String
)

/**
 * Get size configuration for a given size variant.
 * 
 * @param size Badge size variant
 * @return Size-specific token configuration
 * 
 * @see Requirements: 4.1, 4.4, 4.5, 4.6 - Token mappings per size
 */
private fun getSizeConfig(size: BadgeLabelBaseSize): BadgeLabelBaseSizeConfig {
    return when (size) {
        BadgeLabelBaseSize.SM -> BadgeLabelBaseSizeConfig(
            fontSize = DesignTokens.font_size_050,           // 13sp - typography.labelXs
            lineHeight = DesignTokens.line_height_050,       // 1.538
            paddingVertical = DesignTokens.space_000,        // 0dp - space.inset.none
            paddingHorizontal = DesignTokens.space_050,      // 4dp - space.inset.050
            iconSize = DesignTokens.icon_size_050,           // 16dp - icon.size050
            iconGap = DesignTokens.space_025,                // 2dp - space.grouped.minimal
            typographyTokenReference = "typography.labelXs"
        )
        BadgeLabelBaseSize.MD -> BadgeLabelBaseSizeConfig(
            fontSize = DesignTokens.font_size_075,           // 14sp - typography.labelSm
            lineHeight = DesignTokens.line_height_075,       // 1.429
            paddingVertical = DesignTokens.space_050,        // 4dp - space.inset.050
            paddingHorizontal = DesignTokens.space_100,      // 8dp - space.inset.100
            iconSize = DesignTokens.icon_size_075,           // 20dp - icon.size075
            iconGap = DesignTokens.space_050,                // 4dp - space.grouped.tight
            typographyTokenReference = "typography.labelSm"
        )
        BadgeLabelBaseSize.LG -> BadgeLabelBaseSizeConfig(
            fontSize = DesignTokens.font_size_100,           // 16sp - typography.labelMd
            lineHeight = DesignTokens.line_height_100,       // 1.5
            paddingVertical = DesignTokens.space_100,        // 8dp - space.inset.100
            paddingHorizontal = DesignTokens.space_150,      // 12dp - space.inset.150
            iconSize = DesignTokens.icon_size_100,           // 24dp - icon.size100
            iconGap = DesignTokens.space_050,                // 4dp - space.grouped.tight
            typographyTokenReference = "typography.labelMd"
        )
    }
}

// MARK: - Badge-Label-Base Composable

/**
 * Badge-Label-Base Composable
 * 
 * A read-only, non-interactive visual indicator for displaying categorization,
 * status, or metadata text.
 * 
 * Usage:
 * ```kotlin
 * // Basic usage
 * BadgeLabelBase(label = "Draft")
 * 
 * // With size variant
 * BadgeLabelBase(label = "Status", size = BadgeLabelBaseSize.SM)
 * 
 * // With icon
 * BadgeLabelBase(label = "Approved", icon = "check", size = BadgeLabelBaseSize.MD)
 * 
 * // With truncation
 * BadgeLabelBase(label = "Very long category name", truncate = true)
 * 
 * // With testTag
 * BadgeLabelBase(label = "Draft", testTag = "status-badge")
 * ```
 * 
 * @param label Badge text content (required)
 * @param size Size variant. Defaults to MD
 * @param icon Optional leading icon name. Defaults to null
 * @param truncate Enable truncation at component-defined max-width. Defaults to false
 * @param testTag Test identifier for automated testing. Defaults to null
 * @param modifier Additional Compose modifiers. Defaults to Modifier
 * 
 * @see Requirements: 1.1-1.10, 4.1, 4.2, 4.4, 4.5, 4.6, 4.8, 5.3
 */
@Composable
fun BadgeLabelBase(
    label: String,
    size: BadgeLabelBaseSize = BadgeLabelBaseSize.MD,
    icon: String? = null,
    truncate: Boolean = false,
    testTag: String? = null,
    modifier: Modifier = Modifier
) {
    // Get size-specific token configuration
    val sizeConfig = getSizeConfig(size)
    
    // Build modifier chain
    val badgeModifier = modifier
        .then(
            // Apply test tag if provided
            if (testTag != null) {
                Modifier.testTag(testTag)
            } else {
                Modifier
            }
        )
        .then(
            // Apply accessibility semantics
            // Full label text is accessible via contentDescription (especially for truncated badges)
            // @see Requirements: 1.6, 6.1 - Accessibility implementation
            Modifier.semantics {
                contentDescription = label
            }
        )
        .clip(RoundedCornerShape(BadgeLabelBaseTokens.cornerRadius))
        .background(BadgeLabelBaseTokens.backgroundColor)
        .padding(
            horizontal = sizeConfig.paddingHorizontal,
            vertical = sizeConfig.paddingVertical
        )
    
    // Badge container
    // @see Requirements: 1.8 - Non-interactive (no clickable, no focusable)
    Row(
        modifier = badgeModifier,
        horizontalArrangement = Arrangement.spacedBy(sizeConfig.iconGap),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Optional leading icon
        // @see Requirements: 1.4, 6.2 - Icon rendering via Icon-Base, decorative
        if (icon != null) {
            IconBase(
                name = icon,
                size = sizeConfig.iconSize,
                color = BadgeLabelBaseTokens.iconColor
                // Icon is decorative (contentDescription = null in IconBase)
            )
        }
        
        // Label text
        // @see Requirements: 1.1, 1.5, 1.6, 4.1 - Label rendering and truncation
        Text(
            text = label,
            style = TextStyle(
                fontSize = sizeConfig.fontSize.sp,
                lineHeight = (sizeConfig.fontSize * sizeConfig.lineHeight).sp,
                fontWeight = FontWeight.Medium
            ),
            color = BadgeLabelBaseTokens.textColor,
            maxLines = 1,
            overflow = if (truncate) TextOverflow.Ellipsis else TextOverflow.Clip,
            modifier = if (truncate) {
                Modifier.widthIn(max = BadgeLabelBaseTokens.maxWidth.dp)  // badge.label.maxWidth
            } else {
                Modifier
            }
        )
    }
}

// MARK: - Preview

/**
 * Preview composable for BadgeLabelBase component.
 * 
 * Demonstrates all size variants, icon support, and truncation behavior.
 * 
 * @see Requirements: 5.3 - Android Jetpack Compose implementation
 */
@Preview(showBackground = true, name = "BadgeLabelBase Variants")
@Composable
fun BadgeLabelBasePreview() {
    androidx.compose.foundation.layout.Column(
        modifier = Modifier.padding(DesignTokens.space_200), // space.inset.200 (16dp)
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_300) // space.separated.300 (24dp)
    ) {
        // Title
        Text(
            text = "Badge-Label-Base Component",
            style = androidx.compose.material3.MaterialTheme.typography.titleMedium
        )
        
        // Size variants
        Text(
            text = "Size Variants",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Row(
            horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_200), // space.separated.200 (16dp)
            verticalAlignment = Alignment.CenterVertically
        ) {
            BadgeLabelBaseSize.values().forEach { badgeSize ->
                androidx.compose.foundation.layout.Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    BadgeLabelBase(label = "Draft", size = badgeSize)
                    Text(
                        text = badgeSize.name.lowercase(),
                        style = androidx.compose.material3.MaterialTheme.typography.labelSmall
                    )
                    Text(
                        text = getSizeConfig(badgeSize).typographyTokenReference,
                        style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                        color = Color.Gray
                    )
                }
            }
        }
        
        // With icons
        Text(
            text = "With Icons",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Row(
            horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_200) // space.separated.200 (16dp)
        ) {
            BadgeLabelBase(label = "Approved", icon = "check", size = BadgeLabelBaseSize.SM)
            BadgeLabelBase(label = "Pending", icon = "clock", size = BadgeLabelBaseSize.MD)
            BadgeLabelBase(label = "Warning", icon = "info", size = BadgeLabelBaseSize.LG)
        }
        
        // Truncation behavior
        Text(
            text = "Truncation Behavior",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        androidx.compose.foundation.layout.Column(
            verticalArrangement = Arrangement.spacedBy(DesignTokens.space_150) // space.separated.150 (12dp)
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100), // space.separated.100 (8dp)
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeLabelBase(label = "Short", truncate = false)
                Text(
                    text = "No truncation",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100), // space.separated.100 (8dp)
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeLabelBase(
                    label = "This is a very long category name that should truncate",
                    truncate = true
                )
                Text(
                    text = "With truncation",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100), // space.separated.100 (8dp)
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeLabelBase(
                    label = "This is a very long category name that should NOT truncate",
                    truncate = false
                )
            }
        }
        
        // Various labels
        Text(
            text = "Various Labels",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Row(
            horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100) // space.separated.100 (8dp)
        ) {
            BadgeLabelBase(label = "New")
            BadgeLabelBase(label = "Featured")
            BadgeLabelBase(label = "Sale")
            BadgeLabelBase(label = "Limited")
        }
        
        // With testTag
        Text(
            text = "With testTag",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        BadgeLabelBase(label = "Status", testTag = "status-badge")
        
        // Token references
        Text(
            text = "Token References",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        androidx.compose.foundation.layout.Column(
            verticalArrangement = Arrangement.spacedBy(DesignTokens.space_100) // space.separated.100 (8dp)
        ) {
            BadgeLabelBaseSize.values().forEach { badgeSize ->
                val config = getSizeConfig(badgeSize)
                Row(
                    horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100), // space.separated.100 (8dp)
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    BadgeLabelBase(label = "Label", size = badgeSize)
                    androidx.compose.foundation.layout.Column {
                        Text(
                            text = "${badgeSize.name.lowercase()}: ${config.typographyTokenReference}",
                            style = androidx.compose.material3.MaterialTheme.typography.labelSmall
                        )
                        Text(
                            text = "Icon: ${config.iconSize.value.toInt()}dp, Gap: ${config.iconGap.value.toInt()}dp",
                            style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                            color = Color.Gray
                        )
                    }
                }
            }
        }
    }
}
