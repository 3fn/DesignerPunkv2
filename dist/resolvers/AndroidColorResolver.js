"use strict";
/**
 * Android Color Resolver
 *
 * Generates resource qualifiers (values/values-night) with configuration detection.
 * Supports native Android light/dark mode via resource qualifiers and theme switching.
 *
 * Output Format:
 * - XML color resources in values/ and values-night/ directories
 * - Automatic mode detection via Android configuration
 * - Theme switching via custom theme attributes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndroidColorResolver = void 0;
const ModeThemeResolver_1 = require("./ModeThemeResolver");
/**
 * AndroidColorResolver generates XML color resources for Android platform
 */
class AndroidColorResolver {
    constructor() {
        this.resolver = new ModeThemeResolver_1.ModeThemeResolver();
    }
    /**
     * Convert hex color to Android color resource format
     * Android uses #AARRGGBB or #RRGGBB format
     *
     * @param hex - Hex color string (e.g., '#FF6B35')
     * @returns Android color resource value
     */
    hexToAndroidColor(hex) {
        // Ensure hex starts with #
        return hex.startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
    }
    /**
     * Generate XML color resource for a single color token
     *
     * @param tokenName - Name of the color token (e.g., 'purple300')
     * @param colorValue - Hex color value
     * @returns XML color resource line
     */
    generateColorResource(tokenName, colorValue) {
        const snakeCaseName = tokenName.replace(/([A-Z])/g, '_$1').toLowerCase();
        return `    <color name="${snakeCaseName}">${this.hexToAndroidColor(colorValue)}</color>`;
    }
    /**
     * Generate values/colors.xml for light mode
     *
     * @param tokens - Object mapping token names to color values
     * @param options - Android output options
     * @returns XML content for values/colors.xml
     */
    generateLightModeColors(tokens, options = {}) {
        const { defaultTheme = 'base' } = options;
        let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
        xml += '<!--\n';
        xml += '  Design System Color Tokens - Light Mode\n';
        xml += '  Generated with mode-aware and theme-aware support\n';
        xml += '-->\n';
        xml += '<resources>\n';
        Object.entries(tokens).forEach(([tokenName, colorValue]) => {
            const allValues = this.resolver.resolveAll(colorValue);
            xml += this.generateColorResource(tokenName, allValues.light[defaultTheme]);
            xml += '\n';
        });
        xml += '</resources>\n';
        return xml;
    }
    /**
     * Generate values-night/colors.xml for dark mode
     *
     * @param tokens - Object mapping token names to color values
     * @param options - Android output options
     * @returns XML content for values-night/colors.xml
     */
    generateDarkModeColors(tokens, options = {}) {
        const { defaultTheme = 'base' } = options;
        let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
        xml += '<!--\n';
        xml += '  Design System Color Tokens - Dark Mode\n';
        xml += '  Generated with mode-aware and theme-aware support\n';
        xml += '-->\n';
        xml += '<resources>\n';
        Object.entries(tokens).forEach(([tokenName, colorValue]) => {
            const allValues = this.resolver.resolveAll(colorValue);
            xml += this.generateColorResource(tokenName, allValues.dark[defaultTheme]);
            xml += '\n';
        });
        xml += '</resources>\n';
        return xml;
    }
    /**
     * Generate WCAG theme colors for light mode
     *
     * @param tokens - Object mapping token names to color values
     * @returns XML content for values/colors_wcag.xml
     */
    generateLightModeWcagColors(tokens) {
        let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
        xml += '<!--\n';
        xml += '  Design System Color Tokens - Light Mode (WCAG Theme)\n';
        xml += '  Generated with WCAG 2.2 compliant colors\n';
        xml += '-->\n';
        xml += '<resources>\n';
        Object.entries(tokens).forEach(([tokenName, colorValue]) => {
            const allValues = this.resolver.resolveAll(colorValue);
            const snakeCaseName = tokenName.replace(/([A-Z])/g, '_$1').toLowerCase();
            xml += `    <color name="${snakeCaseName}_wcag">${this.hexToAndroidColor(allValues.light.wcag)}</color>\n`;
        });
        xml += '</resources>\n';
        return xml;
    }
    /**
     * Generate WCAG theme colors for dark mode
     *
     * @param tokens - Object mapping token names to color values
     * @returns XML content for values-night/colors_wcag.xml
     */
    generateDarkModeWcagColors(tokens) {
        let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
        xml += '<!--\n';
        xml += '  Design System Color Tokens - Dark Mode (WCAG Theme)\n';
        xml += '  Generated with WCAG 2.2 compliant colors\n';
        xml += '-->\n';
        xml += '<resources>\n';
        Object.entries(tokens).forEach(([tokenName, colorValue]) => {
            const allValues = this.resolver.resolveAll(colorValue);
            const snakeCaseName = tokenName.replace(/([A-Z])/g, '_$1').toLowerCase();
            xml += `    <color name="${snakeCaseName}_wcag">${this.hexToAndroidColor(allValues.dark.wcag)}</color>\n`;
        });
        xml += '</resources>\n';
        return xml;
    }
    /**
     * Generate Kotlin extension functions for color access
     *
     * @param tokens - Object mapping token names to color values
     * @param options - Android output options
     * @returns Kotlin extension code
     */
    generateKotlinExtension(tokens, options = {}) {
        const { includeThemeSwitching = true } = options;
        let kotlin = '/**\n';
        kotlin += ' * Design System Color Tokens\n';
        kotlin += ' * Generated with mode-aware and theme-aware support\n';
        kotlin += ' */\n\n';
        kotlin += 'package com.designsystem.tokens\n\n';
        kotlin += 'import android.content.Context\n';
        kotlin += 'import android.content.SharedPreferences\n';
        kotlin += 'import androidx.annotation.ColorRes\n';
        kotlin += 'import androidx.core.content.ContextCompat\n\n';
        kotlin += '/**\n';
        kotlin += ' * Design System color token extensions\n';
        kotlin += ' */\n';
        kotlin += 'object DesignSystemColors {\n\n';
        // Generate color getters
        Object.keys(tokens).forEach(tokenName => {
            const snakeCaseName = tokenName.replace(/([A-Z])/g, '_$1').toLowerCase();
            const camelCaseName = tokenName.charAt(0).toLowerCase() + tokenName.slice(1);
            kotlin += `    /**\n`;
            kotlin += `     * Get ${tokenName} color with theme support\n`;
            kotlin += `     */\n`;
            kotlin += `    fun ${camelCaseName}(context: Context): Int {\n`;
            if (includeThemeSwitching) {
                kotlin += `        val prefs = context.getSharedPreferences("design_system", Context.MODE_PRIVATE)\n`;
                kotlin += `        val theme = prefs.getString("theme", "base") ?: "base"\n`;
                kotlin += `        \n`;
                kotlin += `        val colorRes = if (theme == "wcag") {\n`;
                kotlin += `            R.color.${snakeCaseName}_wcag\n`;
                kotlin += `        } else {\n`;
                kotlin += `            R.color.${snakeCaseName}\n`;
                kotlin += `        }\n`;
                kotlin += `        \n`;
                kotlin += `        return ContextCompat.getColor(context, colorRes)\n`;
            }
            else {
                kotlin += `        return ContextCompat.getColor(context, R.color.${snakeCaseName})\n`;
            }
            kotlin += `    }\n\n`;
        });
        // Add theme switching helper
        if (includeThemeSwitching) {
            kotlin += `    /**\n`;
            kotlin += `     * Set design system theme\n`;
            kotlin += `     */\n`;
            kotlin += `    fun setTheme(context: Context, theme: String) {\n`;
            kotlin += `        val prefs = context.getSharedPreferences("design_system", Context.MODE_PRIVATE)\n`;
            kotlin += `        prefs.edit().putString("theme", theme).apply()\n`;
            kotlin += `    }\n\n`;
            kotlin += `    /**\n`;
            kotlin += `     * Get current design system theme\n`;
            kotlin += `     */\n`;
            kotlin += `    fun getTheme(context: Context): String {\n`;
            kotlin += `        val prefs = context.getSharedPreferences("design_system", Context.MODE_PRIVATE)\n`;
            kotlin += `        return prefs.getString("theme", "base") ?: "base"\n`;
            kotlin += `    }\n`;
        }
        kotlin += '}\n';
        return kotlin;
    }
    /**
     * Generate complete Android resource structure
     * Returns object with all necessary files
     *
     * @param tokens - Object mapping token names to color values
     * @param options - Android output options
     * @returns Object containing all Android resource files
     */
    generateAndroidResources(tokens, options = {}) {
        const { includeThemeSwitching = true } = options;
        const resources = {
            'values/colors.xml': this.generateLightModeColors(tokens, options),
            'values-night/colors.xml': this.generateDarkModeColors(tokens, options),
            'kotlin/DesignSystemColors.kt': this.generateKotlinExtension(tokens, options)
        };
        if (includeThemeSwitching) {
            resources['values/colors_wcag.xml'] = this.generateLightModeWcagColors(tokens);
            resources['values-night/colors_wcag.xml'] = this.generateDarkModeWcagColors(tokens);
        }
        return resources;
    }
    /**
     * Generate usage example documentation
     *
     * @returns Kotlin usage example code
     */
    generateUsageExample() {
        let example = '/**\n';
        example += ' * Usage Examples\n';
        example += ' */\n\n';
        example += '// MARK: - Basic Usage\n\n';
        example += '// Use color tokens in your views\n';
        example += 'view.setBackgroundColor(DesignSystemColors.purple300(context))\n';
        example += 'textView.setTextColor(DesignSystemColors.gray300(context))\n\n';
        example += '// MARK: - Theme Switching\n\n';
        example += '// Switch to WCAG theme\n';
        example += 'DesignSystemColors.setTheme(context, "wcag")\n\n';
        example += '// Switch back to base theme\n';
        example += 'DesignSystemColors.setTheme(context, "base")\n\n';
        example += '// Get current theme\n';
        example += 'val currentTheme = DesignSystemColors.getTheme(context)\n\n';
        example += '// MARK: - Automatic Mode Detection\n\n';
        example += '// Colors automatically adapt to light/dark mode\n';
        example += '// based on system configuration (values/values-night)\n';
        example += '// No additional code needed!\n';
        return example;
    }
    /**
     * Get resolver instance for direct color resolution
     */
    getResolver() {
        return this.resolver;
    }
}
exports.AndroidColorResolver = AndroidColorResolver;
//# sourceMappingURL=AndroidColorResolver.js.map