/**
 * Badge-Count-Base Component for Android Platform
 * 
 * Stemma System: Badge Family
 * Component Type: Type Primitive (Count)
 * Naming Convention: [Family]-[Type]-[Variant] = Badge-Count-Base
 * 
 * A read-only, non-interactive visual indicator for displaying numeric values
 * like notification counts or quantities. Follows True Native Architecture with
 * build-time platform separation.
 * 
 * Key Characteristics:
 * - Read-only: Display-only, no click/tap behavior
 * - Non-interactive: Not focusable, not in tab order
 * - Compact: Small footprint, designed for inline use
 * - Shape-adaptive: Circular for single digits, pill for multi-digit
 * - Informational: Conveys counts or quantities at a glance
 * 
 * @module Badge-Count-Base/platforms/android
 * @see Requirements: 2.1-2.13, 4.3, 4.4, 5.3
 * @see .kiro/specs/044-badge-base/design.md for design specification
 */

package com.designerpunk.components.core

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.designerpunk.tokens.DesignTokens
import kotlin.math.abs
import kotlin.math.max

// MARK: - Badge-Count-Base Size Enum

/**
 * Badge-Count-Base size variants.
 * 
 * Each size maps to specific typography and spacing tokens:
 * - SM: typography.labelXs, space.inset.none (v), space.inset.050 (h), min-width = line-height
 * - MD: typography.labelSm, space.inset.none (v), space.inset.050 (h), min-width = line-height
 * - LG: typography.labelMd, space.inset.050 (v), space.inset.100 (h), min-width = line-height
 * 
 * @see Requirements: 2.9, 2.10 - Size variants with default md
 */
enum class BadgeCountBaseSize {
    SM,
    MD,
    LG
}

// MARK: - Badge-Count-Base Tokens

/**
 * Badge-Count-Base specific design tokens.
 * 
 * These tokens are component-level tokens specific to the Badge-Count-Base component.
 * They reference or extend the core DesignTokens where possible.
 * 
 * @see Requirements: 4.3, 4.4 - Token integration
 */
private object BadgeCountBaseTokens {
    // MARK: - Shape Token
    
    /** Border radius for badge shape (circular/pill)
     * References: radiusHalf → 50% (creates circle from square)
     * For Compose, we use CircleShape which automatically creates pill/circular shapes
     * @see Requirements: 4.3 - radiusHalf for border radius
     */
    
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
}

// MARK: - Badge-Count-Base Default Values

/**
 * Default values for Badge-Count-Base props matching web component.
 * 
 * @see Requirements: 2.5, 2.8, 2.10 - Default values
 */
object BadgeCountBaseDefaults {
    /** Default maximum before showing "[max]+"
     * @see Requirements: 2.5 - Default max to 99 when prop omitted
     */
    const val MAX: Int = 99
    
    /** Default showZero behavior
     * @see Requirements: 2.8 - Default showZero to false when prop omitted
     */
    const val SHOW_ZERO: Boolean = false
    
    /** Default size variant
     * @see Requirements: 2.10 - Default to "md" size when prop omitted
     */
    val SIZE: BadgeCountBaseSize = BadgeCountBaseSize.MD
}

/**
 * Size-specific token configuration for Badge-Count-Base.
 * 
 * @see Requirements: 4.3, 4.4 - Token mappings per size
 */
private data class BadgeCountBaseSizeConfig(
    val fontSize: Float,
    val lineHeight: Float,
    val paddingVertical: Dp,
    val paddingHorizontal: Dp,
    val minWidth: Dp,
    val typographyTokenReference: String
)

/**
 * Get size configuration for a given size variant.
 * 
 * @param size Badge size variant
 * @return Size-specific token configuration
 * 
 * @see Requirements: 4.3, 4.4 - Token mappings per size
 */
private fun getSizeConfig(size: BadgeCountBaseSize): BadgeCountBaseSizeConfig {
    return when (size) {
        BadgeCountBaseSize.SM -> BadgeCountBaseSizeConfig(
            fontSize = DesignTokens.font_size_050,           // 13sp - typography.labelXs
            lineHeight = DesignTokens.line_height_050,       // 1.538
            paddingVertical = DesignTokens.space_000,        // 0dp - space.inset.none
            paddingHorizontal = DesignTokens.space_050,      // 4dp - space.inset.050
            // Min-width = line-height for circular shape (~20dp)
            minWidth = (DesignTokens.font_size_050 * DesignTokens.line_height_050).dp,
            typographyTokenReference = "typography.labelXs"
        )
        BadgeCountBaseSize.MD -> BadgeCountBaseSizeConfig(
            fontSize = DesignTokens.font_size_075,           // 14sp - typography.labelSm
            lineHeight = DesignTokens.line_height_075,       // 1.429
            paddingVertical = DesignTokens.space_000,        // 0dp - space.inset.none
            paddingHorizontal = DesignTokens.space_050,      // 4dp - space.inset.050
            // Min-width = line-height for circular shape (~20dp)
            minWidth = (DesignTokens.font_size_075 * DesignTokens.line_height_075).dp,
            typographyTokenReference = "typography.labelSm"
        )
        BadgeCountBaseSize.LG -> BadgeCountBaseSizeConfig(
            fontSize = DesignTokens.font_size_100,           // 16sp - typography.labelMd
            lineHeight = DesignTokens.line_height_100,       // 1.5
            paddingVertical = DesignTokens.space_050,        // 4dp - space.inset.050
            paddingHorizontal = DesignTokens.space_100,      // 8dp - space.inset.100
            // Min-width = line-height for circular shape (24dp)
            minWidth = (DesignTokens.font_size_100 * DesignTokens.line_height_100).dp,
            typographyTokenReference = "typography.labelMd"
        )
    }
}

// MARK: - Badge-Count-Base Composable

/**
 * Badge-Count-Base Composable
 * 
 * A read-only, non-interactive visual indicator for displaying numeric values
 * like notification counts or quantities.
 * 
 * Shape behavior:
 * - Single digit (1-9): Circular (width = height via min-width = line-height)
 * - Multi-digit (10+): Pill shape (expands horizontally with padding)
 * - Zero (showZero=false): Not rendered
 * - Zero (showZero=true): Circular showing "0"
 * 
 * Usage:
 * ```kotlin
 * // Basic usage
 * BadgeCountBase(count = 5)
 * 
 * // With size variant
 * BadgeCountBase(count = 3, size = BadgeCountBaseSize.SM)
 * 
 * // With max truncation
 * BadgeCountBase(count = 150, max = 99)  // Shows "99+"
 * 
 * // Show zero
 * BadgeCountBase(count = 0, showZero = true)
 * 
 * // With testTag
 * BadgeCountBase(count = 5, testTag = "notification-badge")
 * ```
 * 
 * @param count Numeric value to display (required)
 * @param max Maximum before showing "[max]+". Defaults to 99
 * @param showZero Whether to show badge when count is 0. Defaults to false
 * @param size Size variant. Defaults to MD
 * @param testTag Test identifier for automated testing. Defaults to null
 * @param modifier Additional Compose modifiers. Defaults to Modifier
 * 
 * @see Requirements: 2.1-2.13, 4.3, 4.4, 5.3
 */
@Composable
fun BadgeCountBase(
    count: Int,
    max: Int = BadgeCountBaseDefaults.MAX,
    showZero: Boolean = BadgeCountBaseDefaults.SHOW_ZERO,
    size: BadgeCountBaseSize = BadgeCountBaseDefaults.SIZE,
    testTag: String? = null,
    modifier: Modifier = Modifier
) {
    // Handle negative counts by using absolute value
    // @see Error Handling in design.md - count is negative → Render absolute value or 0
    val normalizedCount = max(0, abs(count))
    
    // Handle invalid max by using default
    // @see Error Handling in design.md - max is 0 or negative → Use default (99)
    val normalizedMax = if (max > 0) max else BadgeCountBaseDefaults.MAX
    
    // Check if badge should be rendered
    // @see Requirements 2.6, 2.7 - showZero behavior
    if (normalizedCount == 0 && !showZero) {
        return
    }
    
    // Get size-specific token configuration
    val sizeConfig = getSizeConfig(size)
    
    // Calculate display text
    // @see Requirements: 2.4 - max truncation logic
    val displayText = if (normalizedCount > normalizedMax) {
        "${normalizedMax}+"
    } else {
        normalizedCount.toString()
    }
    
    // Determine if single digit for circular shape
    // @see Requirements: 2.2, 2.3 - circular vs pill shape
    val isSingleDigit = displayText.length == 1
    
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
            // @see Requirements: 6.1 - Screen reader accessible
            Modifier.semantics {
                contentDescription = displayText
            }
        )
        .clip(CircleShape) // radiusHalf equivalent - creates circular/pill shape
        .background(BadgeCountBaseTokens.backgroundColor)
        .padding(
            horizontal = sizeConfig.paddingHorizontal,
            vertical = sizeConfig.paddingVertical
        )
        .then(
            // Apply min-width for circular single digits
            // @see Requirements: Design.md - Min-width = line-height for circular shape
            if (isSingleDigit) {
                Modifier.defaultMinSize(
                    minWidth = sizeConfig.minWidth,
                    minHeight = sizeConfig.minWidth
                )
            } else {
                Modifier.defaultMinSize(minHeight = sizeConfig.minWidth)
            }
        )
    
    // Badge container
    // @see Requirements: 2.11 - Non-interactive (no clickable, no focusable)
    Box(
        modifier = badgeModifier,
        contentAlignment = Alignment.Center
    ) {
        // Count text
        // @see Requirements: 2.1, 4.3 - Count rendering with typography tokens
        Text(
            text = displayText,
            style = TextStyle(
                fontSize = sizeConfig.fontSize.sp,
                lineHeight = (sizeConfig.fontSize * sizeConfig.lineHeight).sp,
                fontWeight = FontWeight.Medium,
                textAlign = TextAlign.Center
            ),
            color = BadgeCountBaseTokens.textColor,
            maxLines = 1
        )
    }
}

// MARK: - Preview

/**
 * Preview composable for BadgeCountBase component.
 * 
 * Demonstrates all size variants, shape behavior, max truncation, and showZero.
 * 
 * @see Requirements: 5.3 - Android Jetpack Compose implementation
 */
@Preview(showBackground = true, name = "BadgeCountBase Variants")
@Composable
fun BadgeCountBasePreview() {
    Column(
        modifier = Modifier.padding(DesignTokens.space_200), // space.inset.200 (16dp)
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_300) // space.separated.300 (24dp)
    ) {
        // Title
        Text(
            text = "Badge-Count-Base Component",
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
            BadgeCountBaseSize.values().forEach { badgeSize ->
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    BadgeCountBase(count = 5, size = badgeSize)
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
        
        // Shape behavior
        Text(
            text = "Shape Behavior",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Column(
            verticalArrangement = Arrangement.spacedBy(DesignTokens.space_150) // space.separated.150 (12dp)
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100), // space.separated.100 (8dp)
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountBase(count = 1)
                Text(
                    text = "Single digit (1) - Circular",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountBase(count = 9)
                Text(
                    text = "Single digit (9) - Circular",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountBase(count = 10)
                Text(
                    text = "Double digit (10) - Pill",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountBase(count = 99)
                Text(
                    text = "Double digit (99) - Pill",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountBase(count = 100)
                Text(
                    text = "Triple digit (100) - Shows 99+",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
        }
        
        // Max truncation
        Text(
            text = "Max Truncation",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Column(
            verticalArrangement = Arrangement.spacedBy(DesignTokens.space_150)
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountBase(count = 99, max = 99)
                Text(
                    text = "count=99, max=99 → Shows 99",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountBase(count = 100, max = 99)
                Text(
                    text = "count=100, max=99 → Shows 99+",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountBase(count = 50, max = 9)
                Text(
                    text = "count=50, max=9 → Shows 9+",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountBase(count = 999, max = 999)
                Text(
                    text = "count=999, max=999 → Shows 999",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
        }
        
        // showZero behavior
        Text(
            text = "showZero Behavior",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Column(
            verticalArrangement = Arrangement.spacedBy(DesignTokens.space_150)
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountBase(count = 0, showZero = false)
                Text(
                    text = "count=0, showZero=false → Hidden",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountBase(count = 0, showZero = true)
                Text(
                    text = "count=0, showZero=true → Shows 0",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
        }
        
        // Various counts
        Text(
            text = "Various Counts",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Row(
            horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100)
        ) {
            BadgeCountBase(count = 1)
            BadgeCountBase(count = 5)
            BadgeCountBase(count = 12)
            BadgeCountBase(count = 42)
            BadgeCountBase(count = 99)
            BadgeCountBase(count = 150)
        }
        
        // With testTag
        Text(
            text = "With testTag",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        BadgeCountBase(count = 5, testTag = "notification-badge")
        
        // Token references
        Text(
            text = "Token References",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Column(
            verticalArrangement = Arrangement.spacedBy(DesignTokens.space_100)
        ) {
            BadgeCountBaseSize.values().forEach { badgeSize ->
                val config = getSizeConfig(badgeSize)
                Row(
                    horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    BadgeCountBase(count = 5, size = badgeSize)
                    Column {
                        Text(
                            text = "${badgeSize.name.lowercase()}: ${config.typographyTokenReference}",
                            style = androidx.compose.material3.MaterialTheme.typography.labelSmall
                        )
                        Text(
                            text = "Min-width: ${config.minWidth.value.toInt()}dp",
                            style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                            color = Color.Gray
                        )
                    }
                }
            }
        }
    }
}
