//
// Theme-Aware Blend Utilities for Android (Jetpack Compose)
//
// Provides theme-aware Color extensions that wrap blend utilities with
// automatic theme context awareness. Components can use these extensions
// to get blend colors that automatically use the current theme's color values.
//
// @see Requirements: 11.4 - Theme-aware wrapper functions
//

package com.designerpunk.tokens

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Color

// MARK: - Blend Token Values

/**
 * Blend token values from semantic blend tokens.
 * These match the design token definitions and provide consistent state styling.
 */
object BlendTokenValues {
    /** Hover state darkening - blend200 (8%) */
    const val hoverDarker: Float = 0.08f
    
    /** Pressed state darkening - blend300 (12%) */
    const val pressedDarker: Float = 0.12f
    
    /** Focus state saturation increase - blend200 (8%) */
    const val focusSaturate: Float = 0.08f
    
    /** Disabled state desaturation - blend300 (12%) */
    const val disabledDesaturate: Float = 0.12f
    
    /** Icon optical balance lightening - blend200 (8%) */
    const val iconLighter: Float = 0.08f
}

// MARK: - Theme Context

/**
 * Theme mode for light/dark theme support
 */
enum class ThemeMode {
    LIGHT,
    DARK
}

/**
 * Theme context for blend utilities.
 * Provides color values for the current theme.
 */
data class BlendThemeContext(
    /** Current theme mode (light or dark) */
    val mode: ThemeMode,
    /** Primary color for the current theme */
    val primaryColor: Color,
    /** On-primary color (text/icon color on primary background) */
    val onPrimaryColor: Color,
    /** Surface color for the current theme */
    val surfaceColor: Color,
    /** On-surface color (text/icon color on surface background) */
    val onSurfaceColor: Color
)

/**
 * Composition local for theme mode
 */
val LocalThemeMode = compositionLocalOf { ThemeMode.LIGHT }

// MARK: - Theme-Aware Color Extensions

/**
 * Calculate hover color by darkening the color using blend token value.
 *
 * Uses `BlendTokenValues.hoverDarker` (8%) for consistent hover state styling
 * across all components.
 *
 * @return Darkened color for hover state
 *
 * Example:
 * ```kotlin
 * val hoverBg = MaterialTheme.colorScheme.primary.hoverBlend()
 * ```
 *
 * @see Requirements: 11.4 - Theme-aware wrapper functions
 */
fun Color.hoverBlend(): Color {
    return this.darkerBlend(BlendTokenValues.hoverDarker)
}

/**
 * Calculate pressed color by darkening the color using blend token value.
 *
 * Uses `BlendTokenValues.pressedDarker` (12%) for consistent pressed state styling
 * across all components.
 *
 * @return Darkened color for pressed state
 *
 * Example:
 * ```kotlin
 * val pressedBg = MaterialTheme.colorScheme.primary.pressedBlend()
 * ```
 *
 * @see Requirements: 11.4 - Theme-aware wrapper functions
 */
fun Color.pressedBlend(): Color {
    return this.darkerBlend(BlendTokenValues.pressedDarker)
}

/**
 * Calculate focus color by saturating the color using blend token value.
 *
 * Uses `BlendTokenValues.focusSaturate` (8%) for consistent focus state styling
 * across all components.
 *
 * @return Saturated color for focus state
 *
 * Example:
 * ```kotlin
 * val focusBorder = MaterialTheme.colorScheme.primary.focusBlend()
 * ```
 *
 * @see Requirements: 11.4 - Theme-aware wrapper functions
 */
fun Color.focusBlend(): Color {
    return this.saturate(BlendTokenValues.focusSaturate)
}

/**
 * Calculate disabled color by desaturating the color using blend token value.
 *
 * Uses `BlendTokenValues.disabledDesaturate` (12%) for consistent disabled state styling
 * across all components.
 *
 * @return Desaturated color for disabled state
 *
 * Example:
 * ```kotlin
 * val disabledBg = MaterialTheme.colorScheme.primary.disabledBlend()
 * ```
 *
 * @see Requirements: 11.4 - Theme-aware wrapper functions
 */
fun Color.disabledBlend(): Color {
    return this.desaturate(BlendTokenValues.disabledDesaturate)
}

/**
 * Calculate icon color with optical balance adjustment using blend token value.
 *
 * Uses `BlendTokenValues.iconLighter` (8%) for consistent icon optical balance
 * across all components.
 *
 * @return Lightened color for icon optical balance
 *
 * Example:
 * ```kotlin
 * val iconColor = MaterialTheme.colorScheme.onPrimary.iconBlend()
 * ```
 *
 * @see Requirements: 11.4 - Theme-aware wrapper functions
 */
fun Color.iconBlend(): Color {
    return this.lighterBlend(BlendTokenValues.iconLighter)
}

// MARK: - Theme-Aware Composable Provider

/**
 * Provides theme-aware blend utilities to child composables.
 *
 * This composable sets up the theme context for blend utilities,
 * automatically detecting light/dark mode from the system.
 *
 * Example:
 * ```kotlin
 * ThemeAwareBlendProvider {
 *     MyButton(color = MaterialTheme.colorScheme.primary)
 * }
 * ```
 *
 * @param content Child composables that will have access to theme-aware blend utilities
 *
 * @see Requirements: 11.4 - Theme-aware wrapper functions
 */
@Composable
fun ThemeAwareBlendProvider(
    content: @Composable () -> Unit
) {
    val isDarkTheme = isSystemInDarkTheme()
    val themeMode = if (isDarkTheme) ThemeMode.DARK else ThemeMode.LIGHT
    
    CompositionLocalProvider(LocalThemeMode provides themeMode) {
        content()
    }
}

/**
 * Remember and return the current theme mode.
 *
 * This composable function returns the current theme mode from the composition local,
 * which is set by ThemeAwareBlendProvider.
 *
 * Example:
 * ```kotlin
 * @Composable
 * fun MyComponent() {
 *     val themeMode = rememberThemeMode()
 *     val isDark = themeMode == ThemeMode.DARK
 *     // Use theme mode for conditional styling
 * }
 * ```
 *
 * @return Current theme mode (LIGHT or DARK)
 */
@Composable
fun rememberThemeMode(): ThemeMode {
    return LocalThemeMode.current
}

// MARK: - Blend Utilities Provider

/**
 * Provider class for theme-aware blend utilities.
 * Use this for programmatic access to blend functions outside of Compose.
 */
object BlendUtilitiesProvider {
    
    /**
     * Calculate hover color for a given base color
     * @param color Base color
     * @return Darkened color for hover state
     */
    fun hoverColor(color: Color): Color {
        return color.hoverBlend()
    }
    
    /**
     * Calculate pressed color for a given base color
     * @param color Base color
     * @return Darkened color for pressed state
     */
    fun pressedColor(color: Color): Color {
        return color.pressedBlend()
    }
    
    /**
     * Calculate focus color for a given base color
     * @param color Base color
     * @return Saturated color for focus state
     */
    fun focusColor(color: Color): Color {
        return color.focusBlend()
    }
    
    /**
     * Calculate disabled color for a given base color
     * @param color Base color
     * @return Desaturated color for disabled state
     */
    fun disabledColor(color: Color): Color {
        return color.disabledBlend()
    }
    
    /**
     * Calculate icon color with optical balance for a given base color
     * @param color Base color
     * @return Lightened color for icon optical balance
     */
    fun iconColor(color: Color): Color {
        return color.iconBlend()
    }
    
    /**
     * Generic darker blend function
     * @param color Base color
     * @param amount Blend amount (0.0-1.0)
     * @return Darkened color
     */
    fun darkerBlend(color: Color, amount: Float): Color {
        return color.darkerBlend(amount)
    }
    
    /**
     * Generic lighter blend function
     * @param color Base color
     * @param amount Blend amount (0.0-1.0)
     * @return Lightened color
     */
    fun lighterBlend(color: Color, amount: Float): Color {
        return color.lighterBlend(amount)
    }
    
    /**
     * Generic saturate blend function
     * @param color Base color
     * @param amount Blend amount (0.0-1.0)
     * @return Saturated color
     */
    fun saturate(color: Color, amount: Float): Color {
        return color.saturate(amount)
    }
    
    /**
     * Generic desaturate blend function
     * @param color Base color
     * @param amount Blend amount (0.0-1.0)
     * @return Desaturated color
     */
    fun desaturate(color: Color, amount: Float): Color {
        return color.desaturate(amount)
    }
}

// MARK: - Composable Blend Utilities Hook

/**
 * Composable function that provides blend utilities with remembered values.
 *
 * This is the Compose equivalent of the React useBlendUtilities hook.
 * It provides memoized blend functions that automatically use the design system's
 * blend token values for consistent state styling.
 *
 * Example:
 * ```kotlin
 * @Composable
 * fun MyButton(baseColor: Color) {
 *     val blendUtils = rememberBlendUtilities()
 *     
 *     val hoverColor = blendUtils.hoverColor(baseColor)
 *     val pressedColor = blendUtils.pressedColor(baseColor)
 *     val disabledColor = blendUtils.disabledColor(baseColor)
 *     
 *     // Use colors in button styling
 * }
 * ```
 *
 * @return BlendUtilitiesProvider instance for accessing blend functions
 *
 * @see Requirements: 11.4 - Theme-aware wrapper functions
 */
@Composable
fun rememberBlendUtilities(): BlendUtilitiesProvider {
    return remember { BlendUtilitiesProvider }
}
