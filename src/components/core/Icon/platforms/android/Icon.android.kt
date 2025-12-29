package com.designerpunk.components.core

import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Icon
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.graphics.Color
import com.designerpunk.tokens.DesignTokens
// Import blend utilities from generated BlendUtilities.android.kt
import com.designerpunk.blend.lighterBlend

// Blend token value for icon optical balance (from semantic blend tokens)
// This matches the design token: color.icon.opticalBalance (blend200 = 8% lighter)
private const val BLEND_ICON_LIGHTER: Float = 0.08f

/**
 * Icon component for Android platform
 * 
 * Renders Icon from VectorDrawable resources with automatic color inheritance.
 * Icons are decorative (contentDescription = null) and inherit tint from LocalContentColor.
 * 
 * Uses blend utilities for optical balance adjustment when icons are paired with text.
 * The lighterBlend function compensates for icons appearing heavier than adjacent text
 * due to stroke density and fill area.
 * 
 * This component serves as the reference implementation for Rosetta pattern token usage.
 * 
 * @param name Icon name (e.g., "arrow-right", "check", "settings")
 * @param size Icon size in Dp (use DesignTokens.icon_size_050 through icon_size_700 tokens)
 * @param color Optional color override for optical weight compensation (null = inherit)
 * @param opticalBalance Whether to apply lighterBlend for optical weight compensation (default = false)
 * @param modifier Optional modifier for additional styling
 * 
 * Requirements:
 * - 10.1, 10.2: Optical balance using blend utilities (lighterBlend instead of CSS filters)
 * - 13.2: No filter: brightness() workarounds
 */
@Composable
fun Icon(
    name: String,
    size: Dp,
    color: Color? = null,
    opticalBalance: Boolean = false,
    modifier: Modifier = Modifier
) {
    // Compute final color with optional optical balance adjustment
    val finalColor = when {
        color != null && opticalBalance -> {
            // Apply optical balance using lighterBlend with blend.iconLighter token (8% lighter)
            // This uses blend utilities instead of opacity or filter workarounds
            color.lighterBlend(BLEND_ICON_LIGHTER)
        }
        color != null -> color
        else -> LocalContentColor.current
    }
    
    Icon(
        painter = painterResource(id = getIconResource(name)),
        contentDescription = null, // Decorative icon - hidden from TalkBack
        modifier = modifier.size(size),
        tint = finalColor
    )
}

/**
 * Map icon name to drawable resource ID
 * 
 * Converts kebab-case icon names to snake_case drawable resource names.
 * Falls back to circle icon if name is not found.
 * 
 * @param name Icon name in kebab-case (e.g., "arrow-right")
 * @return Drawable resource ID
 */
private fun getIconResource(name: String): Int {
    return when (name) {
        // Navigation icons
        "arrow-right" -> R.drawable.arrow_right
        "arrow-left" -> R.drawable.arrow_left
        "arrow-up" -> R.drawable.arrow_up
        "arrow-down" -> R.drawable.arrow_down
        "chevron-right" -> R.drawable.chevron_right
        
        // Action icons
        "check" -> R.drawable.check
        "x" -> R.drawable.x
        "plus" -> R.drawable.plus
        "minus" -> R.drawable.minus
        
        // UI element icons
        "circle" -> R.drawable.circle
        "heart" -> R.drawable.heart
        "info" -> R.drawable.info
        
        // Complex icons
        "settings" -> R.drawable.settings
        "user" -> R.drawable.user
        "mail" -> R.drawable.mail
        "calendar" -> R.drawable.calendar
        
        // Fallback to circle for unknown icons
        else -> {
            android.util.Log.w("Icon", "Icon not found: $name, using fallback (circle)")
            R.drawable.circle
        }
    }
}

/**
 * Preview for Icon component showing different sizes, colors, and optical balance
 * 
 * Demonstrates:
 * - Five common size variants (icon_size_050 through icon_size_150)
 * - Note: Additional sizes available (icon_size_200 through icon_size_700)
 * - Multiple icon types at standard size
 * - Color inheritance with different tint colors
 * - Optical balance comparison (with and without)
 */
@Preview(showBackground = true, name = "Icon Sizes and Colors")
@Composable
fun IconPreview() {
    androidx.compose.foundation.layout.Column(
        modifier = Modifier.padding(DesignTokens.space_200),
        verticalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(DesignTokens.space_200)
    ) {
        // Different sizes (icon_size_050 through icon_size_150)
        // Note: Additional sizes available (icon_size_200 through icon_size_700)
        androidx.compose.material3.Text(
            text = "Size Variants (5 of 11 available)",
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium
        )
        androidx.compose.foundation.layout.Row(
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(DesignTokens.space_200),
            verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
        ) {
            Icon(name = "arrow-right", size = DesignTokens.icon_size_050)
            Icon(name = "arrow-right", size = DesignTokens.icon_size_075)
            Icon(name = "arrow-right", size = DesignTokens.icon_size_100)
            Icon(name = "arrow-right", size = DesignTokens.icon_size_125)
            Icon(name = "arrow-right", size = DesignTokens.icon_size_150)
        }
        
        // Different icons at standard size (icon_size_100)
        androidx.compose.material3.Text(
            text = "Icon Variety",
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium
        )
        androidx.compose.foundation.layout.Row(
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(DesignTokens.space_200)
        ) {
            Icon(name = "check", size = DesignTokens.icon_size_100)
            Icon(name = "x", size = DesignTokens.icon_size_100)
            Icon(name = "plus", size = DesignTokens.icon_size_100)
            Icon(name = "heart", size = DesignTokens.icon_size_100)
            Icon(name = "settings", size = DesignTokens.icon_size_100)
        }
        
        // Color inheritance (default) - Blue
        androidx.compose.material3.Text(
            text = "Color Inheritance - Blue",
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium
        )
        androidx.compose.material3.CompositionLocalProvider(
            LocalContentColor provides Color.Blue
        ) {
            androidx.compose.foundation.layout.Row(
                horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(DesignTokens.space_200)
            ) {
                Icon(name = "arrow-right", size = DesignTokens.icon_size_100)
                Icon(name = "check", size = DesignTokens.icon_size_100)
                Icon(name = "heart", size = DesignTokens.icon_size_100)
            }
        }
        
        // Color override (explicit) - Red
        androidx.compose.material3.Text(
            text = "Color Override - Red",
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium
        )
        androidx.compose.foundation.layout.Row(
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(DesignTokens.space_200)
        ) {
            Icon(name = "x", size = DesignTokens.icon_size_100, color = Color.Red)
            Icon(name = "minus", size = DesignTokens.icon_size_100, color = Color.Red)
            Icon(name = "circle", size = DesignTokens.icon_size_100, color = Color.Red)
        }
        
        // Color override (explicit) - Green
        androidx.compose.material3.Text(
            text = "Color Override - Green",
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium
        )
        androidx.compose.foundation.layout.Row(
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(DesignTokens.space_200)
        ) {
            Icon(name = "check", size = DesignTokens.icon_size_100, color = Color.Green)
            Icon(name = "plus", size = DesignTokens.icon_size_100, color = Color.Green)
            Icon(name = "arrow-up", size = DesignTokens.icon_size_100, color = Color.Green)
        }
        
        // Optical balance demonstration
        androidx.compose.material3.Text(
            text = "Optical Balance (8% Lighter)",
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium
        )
        androidx.compose.foundation.layout.Row(
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(DesignTokens.space_200)
        ) {
            androidx.compose.foundation.layout.Column(
                horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally
            ) {
                Icon(name = "arrow-right", size = DesignTokens.icon_size_100, color = Color.Blue)
                androidx.compose.material3.Text(
                    text = "Without",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall
                )
            }
            androidx.compose.foundation.layout.Column(
                horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally
            ) {
                Icon(name = "arrow-right", size = DesignTokens.icon_size_100, color = Color.Blue, opticalBalance = true)
                androidx.compose.material3.Text(
                    text = "With Balance",
                    style = androidx.compose.material3.MaterialTheme.typography.labelSmall
                )
            }
        }
    }
}
