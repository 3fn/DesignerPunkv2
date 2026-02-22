/**
 * Badge-Count-Notification Component for Android Platform
 * 
 * Stemma System: Badge Family
 * Component Type: Semantic Variant (inherits from Badge-Count-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Badge-Count-Notification
 * 
 * A notification count badge with predefined styling and accessibility announcements
 * for screen readers. Extends Badge-Count-Base behavior with notification-specific
 * colors and live region announcements.
 * 
 * Key Characteristics:
 * - Inherits all Badge-Count-Base behavior (count display, max truncation, showZero)
 * - Fixed notification colors (pink400 background, white100 text)
 * - Live region announcements via LiveRegionMode.Polite
 * - Pluralized announcement text ("1 notification", "5 notifications")
 * - Optional announceChanges prop (default: true)
 * 
 * COLOR TOKENS (Spec 058):
 * Badge notification color tokens are defined in the component directory at
 * src/components/core/Badge-Count-Notification/tokens.ts following the Rosetta
 * System architecture. Android uses generated platform tokens:
 * - DesignTokens.color_feedback_notification_background (references pink400)
 * - DesignTokens.color_feedback_notification_text (references white100)
 * 
 * @module Badge-Count-Notification/platforms/android
 * @see Requirements: 3.1-3.10, 4.7, 5.3, 6.3
 * @see .kiro/specs/044-badge-base/design.md for design specification
 * @see .kiro/specs/058-component-token-architecture-cleanup for color token migration
 */

package com.designerpunk.components.core

import android.view.View
import android.view.accessibility.AccessibilityEvent
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
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
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

// MARK: - Badge-Count-Notification Size Enum

/**
 * Badge-Count-Notification size variants.
 * 
 * Inherits size specifications from Badge-Count-Base:
 * - SM: typography.labelXs, space.inset.none (v), space.inset.050 (h), min-width = line-height
 * - MD: typography.labelSm, space.inset.none (v), space.inset.050 (h), min-width = line-height
 * - LG: typography.labelMd, space.inset.050 (v), space.inset.100 (h), min-width = line-height
 * 
 * @see Requirements: 3.2 - inherits size behavior from Badge-Count-Base
 */
enum class BadgeCountNotificationSize {
    SM,
    MD,
    LG
}

// MARK: - Badge-Count-Notification Tokens

/**
 * Badge-Count-Notification specific design tokens.
 * 
 * Fixed notification colors - not configurable by consumers.
 * These tokens reference the component color tokens defined in
 * src/components/core/Badge-Count-Notification/tokens.ts:
 * - BadgeNotificationColorTokens['notification.background'] → pink400 (#CC2257)
 * - BadgeNotificationColorTokens['notification.text'] → white100 (#FFFFFF)
 * 
 * The Android platform uses generated DesignTokens constants that are produced
 * by the token build pipeline from the component token definitions.
 * 
 * Contrast Ratio: 6.33:1 (exceeds WCAG AA 4.5:1)
 * 
 * @see Requirements: 3.1, 4.7 - notification-specific color tokens
 * @see .kiro/specs/058-component-token-architecture-cleanup for color token migration
 */
private object BadgeCountNotificationTokens {
    // MARK: - Fixed Notification Colors
    
    /** Background color for notification badge
     * Uses generated token: DesignTokens.color_feedback_notification_background
     * Source: BadgeNotificationColorTokens['notification.background'] → pink400 (#CC2257)
     * @see Requirement 3.1 - notification-specific color tokens
     */
    val backgroundColor: Color = Color(DesignTokens.color_feedback_notification_background)
    
    /** Text color for notification badge
     * Uses generated token: DesignTokens.color_feedback_notification_text
     * Source: BadgeNotificationColorTokens['notification.text'] → white100 (#FFFFFF)
     * @see Requirement 3.1 - notification-specific color tokens
     */
    val textColor: Color = Color(DesignTokens.color_feedback_notification_text)
}


// MARK: - Badge-Count-Notification Default Values

/**
 * Default values for Badge-Count-Notification props.
 * 
 * Inherits defaults from Badge-Count-Base and adds notification-specific defaults.
 * 
 * @see Requirements: 3.2, 3.6 - Default values
 */
object BadgeCountNotificationDefaults {
    /** Default maximum before showing "[max]+"
     * @see Requirements: 3.2 - inherits max behavior from Badge-Count-Base
     */
    const val MAX: Int = 99
    
    /** Default showZero behavior
     * @see Requirements: 3.2 - inherits showZero behavior from Badge-Count-Base
     */
    const val SHOW_ZERO: Boolean = false
    
    /** Default size variant
     * @see Requirements: 3.2 - inherits size behavior from Badge-Count-Base
     */
    val SIZE: BadgeCountNotificationSize = BadgeCountNotificationSize.MD
    
    /** Default announceChanges behavior - announce count changes to screen readers
     * @see Requirements: 3.6 - default announceChanges to true
     */
    const val ANNOUNCE_CHANGES: Boolean = true
}

/**
 * Size-specific token configuration for Badge-Count-Notification.
 * 
 * @see Requirements: 4.3, 4.4 - Token mappings per size
 */
private data class BadgeCountNotificationSizeConfig(
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
private fun getSizeConfig(size: BadgeCountNotificationSize): BadgeCountNotificationSizeConfig {
    return when (size) {
        BadgeCountNotificationSize.SM -> BadgeCountNotificationSizeConfig(
            fontSize = DesignTokens.font_size_050,           // 13sp - typography.labelXs
            lineHeight = DesignTokens.line_height_050,       // 1.538
            paddingVertical = DesignTokens.space_000,        // 0dp - space.inset.none
            paddingHorizontal = DesignTokens.space_050,      // 4dp - space.inset.050
            // Min-width = line-height for circular shape (~20dp)
            minWidth = (DesignTokens.font_size_050 * DesignTokens.line_height_050).dp,
            typographyTokenReference = "typography.labelXs"
        )
        BadgeCountNotificationSize.MD -> BadgeCountNotificationSizeConfig(
            fontSize = DesignTokens.font_size_075,           // 14sp - typography.labelSm
            lineHeight = DesignTokens.line_height_075,       // 1.429
            paddingVertical = DesignTokens.space_000,        // 0dp - space.inset.none
            paddingHorizontal = DesignTokens.space_050,      // 4dp - space.inset.050
            // Min-width = line-height for circular shape (~20dp)
            minWidth = (DesignTokens.font_size_075 * DesignTokens.line_height_075).dp,
            typographyTokenReference = "typography.labelSm"
        )
        BadgeCountNotificationSize.LG -> BadgeCountNotificationSizeConfig(
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


// MARK: - Announcement Text Helper

/**
 * Get the announcement text for screen readers.
 * 
 * Implements pluralization logic:
 * - "1 notification" (singular)
 * - "5 notifications" (plural)
 * - "99 or more notifications" (overflow)
 * 
 * @param count The current count value
 * @param max The maximum value before truncation
 * @return Pluralized announcement text
 * 
 * @see Requirements: 3.4, 3.5 - pluralized announcement text
 */
private fun getAnnouncementText(count: Int, max: Int): String {
    // @see Requirement 3.5 - overflow announcement
    if (count > max) {
        return "$max or more notifications"
    }
    
    // @see Requirement 3.4 - pluralized text
    return if (count == 1) {
        "1 notification"
    } else {
        "$count notifications"
    }
}

// MARK: - Badge-Count-Notification Composable

/**
 * Badge-Count-Notification Composable
 * 
 * A notification count badge with predefined styling and accessibility announcements.
 * Extends Badge-Count-Base behavior with notification-specific colors and live region
 * announcements for screen readers.
 * 
 * Fixed Colors (not configurable):
 * - Background: color.badge.notification.background (pink400 #CC2257)
 * - Text: color.badge.notification.text (white100 #FFFFFF)
 * - Contrast Ratio: 6.33:1 (exceeds WCAG AA 4.5:1)
 * 
 * Accessibility Features:
 * - LiveRegionMode.Polite for live region behavior
 * - announceForAccessibility() for count change announcements
 * - Pluralized announcement text ("1 notification", "5 notifications")
 * - Optional announceChanges prop (default: true)
 * 
 * Usage:
 * ```kotlin
 * // Basic usage
 * BadgeCountNotification(count = 5)
 * 
 * // With size variant
 * BadgeCountNotification(count = 3, size = BadgeCountNotificationSize.SM)
 * 
 * // With max truncation
 * BadgeCountNotification(count = 150, max = 99)  // Shows "99+"
 * 
 * // Disable announcements
 * BadgeCountNotification(count = 5, announceChanges = false)
 * 
 * // With testTag
 * BadgeCountNotification(count = 5, testTag = "notification-badge")
 * ```
 * 
 * @param count Notification count (required)
 * @param max Maximum before showing "[max]+". Defaults to 99
 * @param showZero Whether to show badge when count is 0. Defaults to false
 * @param size Size variant. Defaults to MD
 * @param announceChanges Whether to announce count changes to screen readers. Defaults to true
 * @param testTag Test identifier for automated testing. Defaults to null
 * @param modifier Additional Compose modifiers. Defaults to Modifier
 * 
 * @see Requirements: 3.1-3.10, 4.7, 5.3, 6.3
 */
@Composable
fun BadgeCountNotification(
    count: Int,
    max: Int = BadgeCountNotificationDefaults.MAX,
    showZero: Boolean = BadgeCountNotificationDefaults.SHOW_ZERO,
    size: BadgeCountNotificationSize = BadgeCountNotificationDefaults.SIZE,
    announceChanges: Boolean = BadgeCountNotificationDefaults.ANNOUNCE_CHANGES,
    testTag: String? = null,
    modifier: Modifier = Modifier
) {
    // Handle negative counts by using absolute value
    // @see Error Handling in design.md - count is negative → Render absolute value or 0
    val normalizedCount = max(0, abs(count))
    
    // Handle invalid max by using default
    // @see Error Handling in design.md - max is 0 or negative → Use default (99)
    val normalizedMax = if (max > 0) max else BadgeCountNotificationDefaults.MAX
    
    // Check if badge should be rendered
    // @see Requirements 3.2 - inherits showZero behavior from Badge-Count-Base
    if (normalizedCount == 0 && !showZero) {
        return
    }
    
    // Get size-specific token configuration
    val sizeConfig = getSizeConfig(size)
    
    // Calculate display text
    // @see Requirements: 3.2 - inherits max truncation from Badge-Count-Base
    val displayText = if (normalizedCount > normalizedMax) {
        "${normalizedMax}+"
    } else {
        normalizedCount.toString()
    }
    
    // Determine if single digit for circular shape
    // @see Requirements: 3.2 - inherits circular vs pill shape from Badge-Count-Base
    val isSingleDigit = displayText.length == 1
    
    // Get announcement text for accessibility
    val announcementText = getAnnouncementText(normalizedCount, normalizedMax)
    
    // Track previous count for announcement logic
    var previousCount by remember { mutableStateOf<Int?>(null) }
    
    // Get view for accessibility announcements
    val view = LocalView.current
    
    // Handle count changes and post accessibility announcements
    // @see Requirements: 3.3, 3.7, 3.10 - announcement conditions and Android implementation
    LaunchedEffect(normalizedCount) {
        if (announceChanges && previousCount != null && previousCount != normalizedCount) {
            // Post accessibility announcement
            // @see Requirement 3.10 - announceForAccessibility() for announcements
            view.announceForAccessibility(announcementText)
        }
        previousCount = normalizedCount
    }

    
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
            // Apply accessibility semantics with live region
            // @see Requirements: 3.10, 6.1 - LiveRegionMode.Polite for announcements
            Modifier.semantics {
                contentDescription = announcementText
                if (announceChanges) {
                    liveRegion = LiveRegionMode.Polite
                }
            }
        )
        .clip(CircleShape) // radiusHalf equivalent - creates circular/pill shape
        .background(BadgeCountNotificationTokens.backgroundColor)
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
    // @see Requirements: 3.2 - Non-interactive (inherits from Badge-Count-Base)
    Box(
        modifier = badgeModifier,
        contentAlignment = Alignment.Center
    ) {
        // Count text with notification colors
        // @see Requirements: 3.1, 4.7 - notification-specific colors
        Text(
            text = displayText,
            style = TextStyle(
                fontSize = sizeConfig.fontSize.sp,
                lineHeight = (sizeConfig.fontSize * sizeConfig.lineHeight).sp,
                fontWeight = FontWeight.Medium,
                textAlign = TextAlign.Center
            ),
            color = BadgeCountNotificationTokens.textColor,
            maxLines = 1
        )
    }
}


// MARK: - Preview

/**
 * Preview composable for BadgeCountNotification component.
 * 
 * Demonstrates notification colors, size variants, shape behavior, max truncation,
 * showZero behavior, and announceChanges prop.
 * 
 * @see Requirements: 5.3 - Android Jetpack Compose implementation
 */
@Preview(showBackground = true, name = "BadgeCountNotification Variants")
@Composable
fun BadgeCountNotificationPreview() {
    Column(
        modifier = Modifier.padding(DesignTokens.space_200), // space.inset.200 (16dp)
        verticalArrangement = Arrangement.spacedBy(DesignTokens.space_300) // space.separated.300 (24dp)
    ) {
        // Title
        Text(
            text = "Badge-Count-Notification Component",
            style = androidx.compose.material3.MaterialTheme.typography.titleMedium
        )
        
        // Notification colors
        Text(
            text = "Notification Colors (Fixed)",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Column(
            verticalArrangement = Arrangement.spacedBy(DesignTokens.space_100)
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountNotification(count = 5)
                Text(
                    text = "pink400 background, white100 text",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
            Text(
                text = "Contrast Ratio: 6.33:1 (exceeds WCAG AA 4.5:1)",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                color = Color.Gray
            )
        }
        
        // Size variants
        Text(
            text = "Size Variants",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Row(
            horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_200),
            verticalAlignment = Alignment.CenterVertically
        ) {
            BadgeCountNotificationSize.values().forEach { badgeSize ->
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    BadgeCountNotification(count = 5, size = badgeSize)
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
            verticalArrangement = Arrangement.spacedBy(DesignTokens.space_150)
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountNotification(count = 1)
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
                BadgeCountNotification(count = 9)
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
                BadgeCountNotification(count = 10)
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
                BadgeCountNotification(count = 99)
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
                BadgeCountNotification(count = 100)
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
                BadgeCountNotification(count = 99, max = 99)
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
                BadgeCountNotification(count = 100, max = 99)
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
                BadgeCountNotification(count = 50, max = 9)
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
                BadgeCountNotification(count = 999, max = 999)
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
                BadgeCountNotification(count = 0, showZero = false)
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
                BadgeCountNotification(count = 0, showZero = true)
                Text(
                    text = "count=0, showZero=true → Shows 0",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
        }
        
        // announceChanges behavior
        Text(
            text = "announceChanges Behavior",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Column(
            verticalArrangement = Arrangement.spacedBy(DesignTokens.space_150)
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountNotification(count = 5, announceChanges = true)
                Text(
                    text = "announceChanges=true (default)",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountNotification(count = 5, announceChanges = false)
                Text(
                    text = "announceChanges=false",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
            
            Text(
                text = "When announceChanges=true, count changes are announced to screen readers",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                color = Color.Gray
            )
        }

        
        // Announcement text examples
        Text(
            text = "Announcement Text (Pluralization)",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Column(
            verticalArrangement = Arrangement.spacedBy(DesignTokens.space_150)
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountNotification(count = 1)
                Text(
                    text = "\"1 notification\"",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountNotification(count = 5)
                Text(
                    text = "\"5 notifications\"",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                verticalAlignment = Alignment.CenterVertically
            ) {
                BadgeCountNotification(count = 100)
                Text(
                    text = "\"99 or more notifications\"",
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
            BadgeCountNotification(count = 1)
            BadgeCountNotification(count = 5)
            BadgeCountNotification(count = 12)
            BadgeCountNotification(count = 42)
            BadgeCountNotification(count = 99)
            BadgeCountNotification(count = 150)
        }
        
        // With testTag
        Text(
            text = "With testTag",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        BadgeCountNotification(count = 5, testTag = "notification-badge")
        
        // Accessibility features
        Text(
            text = "Accessibility Features",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Column(
            verticalArrangement = Arrangement.spacedBy(DesignTokens.space_100)
        ) {
            Text(
                text = "• LiveRegionMode.Polite for live region behavior",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                color = Color.Gray
            )
            Text(
                text = "• announceForAccessibility() for count change announcements",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                color = Color.Gray
            )
            Text(
                text = "• Pluralized announcement text",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                color = Color.Gray
            )
            Text(
                text = "• testTag for automated testing",
                style = androidx.compose.material3.MaterialTheme.typography.labelSmall,
                color = Color.Gray
            )
        }
        
        // Token references
        Text(
            text = "Token References",
            style = androidx.compose.material3.MaterialTheme.typography.titleSmall
        )
        Column(
            verticalArrangement = Arrangement.spacedBy(DesignTokens.space_100)
        ) {
            BadgeCountNotificationSize.values().forEach { badgeSize ->
                val config = getSizeConfig(badgeSize)
                Row(
                    horizontalArrangement = Arrangement.spacedBy(DesignTokens.space_100),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    BadgeCountNotification(count = 5, size = badgeSize)
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
