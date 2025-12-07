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

/**
 * Icon component for Android platform
 * 
 * Renders Icon from VectorDrawable resources with automatic color inheritance.
 * Icons are decorative (contentDescription = null) and inherit tint from LocalContentColor.
 * 
 * @param name Icon name (e.g., "arrow-right", "check", "settings")
 * @param size Icon size in Dp (16.dp, 24.dp, 32.dp, 40.dp)
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
 * - All four size variants (16.dp, 24.dp, 32.dp, 40.dp)
 * - Multiple icon types at standard size
 * - Color inheritance with different tint colors
 */
@Preview(showBackground = true, name = "Icon Sizes and Colors")
@Composable
fun IconPreview() {
    androidx.compose.foundation.layout.Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(16.dp)
    ) {
        // Different sizes (16.dp, 24.dp, 32.dp, 40.dp)
        androidx.compose.material3.Text(
            text = "Size Variants",
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium
        )
        androidx.compose.foundation.layout.Row(
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(16.dp),
            verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
        ) {
            Icon(name = "arrow-right", size = 16.dp)
            Icon(name = "arrow-right", size = 24.dp)
            Icon(name = "arrow-right", size = 32.dp)
            Icon(name = "arrow-right", size = 40.dp)
        }
        
        // Different icons at standard size (24.dp)
        androidx.compose.material3.Text(
            text = "Icon Variety",
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium
        )
        androidx.compose.foundation.layout.Row(
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(16.dp)
        ) {
            Icon(name = "check", size = 24.dp)
            Icon(name = "x", size = 24.dp)
            Icon(name = "plus", size = 24.dp)
            Icon(name = "heart", size = 24.dp)
            Icon(name = "settings", size = 24.dp)
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
                horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(16.dp)
            ) {
                Icon(name = "arrow-right", size = 24.dp)
                Icon(name = "check", size = 24.dp)
                Icon(name = "heart", size = 24.dp)
            }
        }
        
        // Color override (explicit) - Red
        androidx.compose.material3.Text(
            text = "Color Override - Red",
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium
        )
        androidx.compose.foundation.layout.Row(
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(16.dp)
        ) {
            Icon(name = "x", size = 24.dp, color = Color.Red)
            Icon(name = "minus", size = 24.dp, color = Color.Red)
            Icon(name = "circle", size = 24.dp, color = Color.Red)
        }
        
        // Color override (explicit) - Green
        androidx.compose.material3.Text(
            text = "Color Override - Green",
            style = androidx.compose.material3.MaterialTheme.typography.labelMedium
        )
        androidx.compose.foundation.layout.Row(
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(16.dp)
        ) {
            Icon(name = "check", size = 24.dp, color = Color.Green)
            Icon(name = "plus", size = 24.dp, color = Color.Green)
            Icon(name = "arrow-up", size = 24.dp, color = Color.Green)
        }
    }
}
