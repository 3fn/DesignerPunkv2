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

/**
 * Icon component for Android platform
 * 
 * Renders Icon from VectorDrawable resources with automatic color inheritance.
 * Icons are decorative (contentDescription = null) and inherit tint from LocalContentColor.
 * 
 * @param name Icon name (e.g., "arrow-right", "check", "settings")
 * @param size Icon size in Dp (use DesignTokens.icon_size_050 through icon_size_150 tokens)
 * @param color Optional color override for optical weight compensation (null = inherit)
 * @param modifier Optional modifier for additional styling
 */
@Composable
fun Icon(
    name: String,
    size: Dp,
    color: Color? = null,
    modifier: Modifier = Modifier
) {
    Icon(
        painter = painterResource(id = getIconResource(name)),
        contentDescription = null, // Decorative icon - hidden from TalkBack
        modifier = modifier.size(size),
        tint = color ?: LocalContentColor.current // Use override or default to LocalContentColor
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
 * Preview for Icon component showing different sizes and colors
 * 
 * Demonstrates:
 * - All five size variants (icon_size_050 through icon_size_150)
 * - Multiple icon types at standard size
 * - Color inheritance with different tint colors
 */
@Preview(showBackground = true, name = "Icon Sizes and Colors")
@Composable
fun IconPreview() {
    androidx.compose.foundation.layout.Column(
        modifier = Modifier.padding(DesignTokens.space_200.dp),
        verticalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(DesignTokens.space_200.dp)
    ) {
        // Different sizes (icon_size_050 through icon_size_150)
        androidx.compose.material3.Text(
            text = "Size Variants",
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium
        )
        androidx.compose.foundation.layout.Row(
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(DesignTokens.space_200.dp),
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
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(DesignTokens.space_200.dp)
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
                horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(DesignTokens.space_200.dp)
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
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(DesignTokens.space_200.dp)
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
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(DesignTokens.space_200.dp)
        ) {
            Icon(name = "check", size = DesignTokens.icon_size_100, color = Color.Green)
            Icon(name = "plus", size = DesignTokens.icon_size_100, color = Color.Green)
            Icon(name = "arrow-up", size = DesignTokens.icon_size_100, color = Color.Green)
        }
    }
}
