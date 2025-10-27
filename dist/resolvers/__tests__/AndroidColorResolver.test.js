"use strict";
/**
 * AndroidColorResolver Unit Tests
 *
 * Tests for Android resource qualifier generation and configuration detection.
 * Covers XML resource generation, Kotlin extensions, and native mode detection.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const AndroidColorResolver_1 = require("../AndroidColorResolver");
// Mock color token factory for testing
const createMockColorToken = () => ({
    light: {
        base: '#8B5CF6',
        wcag: '#7C3AED'
    },
    dark: {
        base: '#A78BFA',
        wcag: '#C4B5FD'
    }
});
const createMultipleColorTokens = () => ({
    purple300: {
        light: { base: '#8B5CF6', wcag: '#7C3AED' },
        dark: { base: '#A78BFA', wcag: '#C4B5FD' }
    },
    orange300: {
        light: { base: '#FF6B35', wcag: '#E65A2A' },
        dark: { base: '#FFB8A0', wcag: '#FFA380' }
    },
    cyan300: {
        light: { base: '#06B6D4', wcag: '#0891B2' },
        dark: { base: '#67E8F9', wcag: '#A5F3FC' }
    }
});
describe('AndroidColorResolver', () => {
    let resolver;
    beforeEach(() => {
        resolver = new AndroidColorResolver_1.AndroidColorResolver();
    });
    describe('Light Mode Colors Generation', () => {
        test('should generate light mode colors XML', () => {
            const tokens = createMultipleColorTokens();
            const xml = resolver.generateLightModeColors(tokens);
            expect(xml).toContain('<?xml version="1.0" encoding="utf-8"?>');
            expect(xml).toContain('Design System Color Tokens - Light Mode');
            expect(xml).toContain('<resources>');
            expect(xml).toContain('</resources>');
        });
        test('should convert token names to snake_case', () => {
            const tokens = createMultipleColorTokens();
            const xml = resolver.generateLightModeColors(tokens);
            expect(xml).toContain('<color name="purple300">#8B5CF6</color>');
            expect(xml).toContain('<color name="orange300">#FF6B35</color>');
            expect(xml).toContain('<color name="cyan300">#06B6D4</color>');
        });
        test('should use base theme by default', () => {
            const tokens = createMultipleColorTokens();
            const xml = resolver.generateLightModeColors(tokens);
            expect(xml).toContain('#8B5CF6'); // purple300 light base
            expect(xml).toContain('#FF6B35'); // orange300 light base
            expect(xml).toContain('#06B6D4'); // cyan300 light base
        });
        test('should support wcag theme as default', () => {
            const tokens = createMultipleColorTokens();
            const xml = resolver.generateLightModeColors(tokens, { defaultTheme: 'wcag' });
            expect(xml).toContain('#7C3AED'); // purple300 light wcag
            expect(xml).toContain('#E65A2A'); // orange300 light wcag
            expect(xml).toContain('#0891B2'); // cyan300 light wcag
        });
        test('should uppercase hex values', () => {
            const tokens = { purple300: createMockColorToken() };
            const xml = resolver.generateLightModeColors(tokens);
            expect(xml).toContain('#8B5CF6');
            expect(xml).not.toContain('#8b5cf6');
        });
    });
    describe('Dark Mode Colors Generation', () => {
        test('should generate dark mode colors XML', () => {
            const tokens = createMultipleColorTokens();
            const xml = resolver.generateDarkModeColors(tokens);
            expect(xml).toContain('<?xml version="1.0" encoding="utf-8"?>');
            expect(xml).toContain('Design System Color Tokens - Dark Mode');
            expect(xml).toContain('<resources>');
            expect(xml).toContain('</resources>');
        });
        test('should use dark mode values', () => {
            const tokens = createMultipleColorTokens();
            const xml = resolver.generateDarkModeColors(tokens);
            expect(xml).toContain('#A78BFA'); // purple300 dark base
            expect(xml).toContain('#FFB8A0'); // orange300 dark base
            expect(xml).toContain('#67E8F9'); // cyan300 dark base
        });
        test('should support wcag theme for dark mode', () => {
            const tokens = createMultipleColorTokens();
            const xml = resolver.generateDarkModeColors(tokens, { defaultTheme: 'wcag' });
            expect(xml).toContain('#C4B5FD'); // purple300 dark wcag
            expect(xml).toContain('#FFA380'); // orange300 dark wcag
            expect(xml).toContain('#A5F3FC'); // cyan300 dark wcag
        });
    });
    describe('WCAG Theme Colors Generation', () => {
        test('should generate light mode WCAG colors', () => {
            const tokens = createMultipleColorTokens();
            const xml = resolver.generateLightModeWcagColors(tokens);
            expect(xml).toContain('Design System Color Tokens - Light Mode (WCAG Theme)');
            expect(xml).toContain('WCAG 2.2 compliant colors');
            expect(xml).toContain('<color name="purple300_wcag">#7C3AED</color>');
            expect(xml).toContain('<color name="orange300_wcag">#E65A2A</color>');
            expect(xml).toContain('<color name="cyan300_wcag">#0891B2</color>');
        });
        test('should generate dark mode WCAG colors', () => {
            const tokens = createMultipleColorTokens();
            const xml = resolver.generateDarkModeWcagColors(tokens);
            expect(xml).toContain('Design System Color Tokens - Dark Mode (WCAG Theme)');
            expect(xml).toContain('WCAG 2.2 compliant colors');
            expect(xml).toContain('<color name="purple300_wcag">#C4B5FD</color>');
            expect(xml).toContain('<color name="orange300_wcag">#FFA380</color>');
            expect(xml).toContain('<color name="cyan300_wcag">#A5F3FC</color>');
        });
        test('should append _wcag suffix to token names', () => {
            const tokens = { purple300: createMockColorToken() };
            const xml = resolver.generateLightModeWcagColors(tokens);
            expect(xml).toContain('name="purple300_wcag"');
            expect(xml).not.toContain('name="purple300"');
        });
    });
    describe('Kotlin Extension Generation', () => {
        test('should generate Kotlin extension with package declaration', () => {
            const tokens = createMultipleColorTokens();
            const kotlin = resolver.generateKotlinExtension(tokens);
            expect(kotlin).toContain('package com.designsystem.tokens');
            expect(kotlin).toContain('import android.content.Context');
            expect(kotlin).toContain('import android.content.SharedPreferences');
            expect(kotlin).toContain('import androidx.annotation.ColorRes');
            expect(kotlin).toContain('import androidx.core.content.ContextCompat');
        });
        test('should generate color getter functions', () => {
            const tokens = createMultipleColorTokens();
            const kotlin = resolver.generateKotlinExtension(tokens);
            expect(kotlin).toContain('fun purple300(context: Context): Int');
            expect(kotlin).toContain('fun orange300(context: Context): Int');
            expect(kotlin).toContain('fun cyan300(context: Context): Int');
        });
        test('should convert token names to camelCase for functions', () => {
            const tokens = { Purple300: createMockColorToken() };
            const kotlin = resolver.generateKotlinExtension(tokens);
            expect(kotlin).toContain('fun purple300(context: Context): Int');
        });
        test('should include theme switching logic', () => {
            const tokens = createMultipleColorTokens();
            const kotlin = resolver.generateKotlinExtension(tokens, { includeThemeSwitching: true });
            expect(kotlin).toContain('val prefs = context.getSharedPreferences("design_system", Context.MODE_PRIVATE)');
            expect(kotlin).toContain('val theme = prefs.getString("theme", "base") ?: "base"');
            expect(kotlin).toContain('if (theme == "wcag")');
            expect(kotlin).toContain('R.color.purple300_wcag');
            expect(kotlin).toContain('R.color.purple300');
        });
        test('should not include theme switching when disabled', () => {
            const tokens = createMultipleColorTokens();
            const kotlin = resolver.generateKotlinExtension(tokens, { includeThemeSwitching: false });
            // The import is still there, but theme switching logic is not used in functions
            expect(kotlin).toContain('return ContextCompat.getColor(context, R.color.purple300)');
            expect(kotlin).not.toContain('val theme = prefs.getString'); // No theme logic in functions
            expect(kotlin).not.toContain('fun setTheme'); // No theme helper functions
        });
        test('should include theme switching helper functions', () => {
            const tokens = createMultipleColorTokens();
            const kotlin = resolver.generateKotlinExtension(tokens, { includeThemeSwitching: true });
            expect(kotlin).toContain('fun setTheme(context: Context, theme: String)');
            expect(kotlin).toContain('fun getTheme(context: Context): String');
            expect(kotlin).toContain('prefs.edit().putString("theme", theme).apply()');
        });
        test('should use ContextCompat for color resolution', () => {
            const tokens = createMultipleColorTokens();
            const kotlin = resolver.generateKotlinExtension(tokens);
            expect(kotlin).toContain('ContextCompat.getColor(context, colorRes)');
        });
    });
    describe('Complete Android Resources Generation', () => {
        test('should generate all required resource files', () => {
            const tokens = createMultipleColorTokens();
            const resources = resolver.generateAndroidResources(tokens);
            expect(resources['values/colors.xml']).toBeDefined();
            expect(resources['values-night/colors.xml']).toBeDefined();
            expect(resources['values/colors_wcag.xml']).toBeDefined();
            expect(resources['values-night/colors_wcag.xml']).toBeDefined();
            expect(resources['kotlin/DesignSystemColors.kt']).toBeDefined();
        });
        test('should not include WCAG files when theme switching disabled', () => {
            const tokens = createMultipleColorTokens();
            const resources = resolver.generateAndroidResources(tokens, { includeThemeSwitching: false });
            expect(resources['values/colors.xml']).toBeDefined();
            expect(resources['values-night/colors.xml']).toBeDefined();
            expect(resources['values/colors_wcag.xml']).toBeUndefined();
            expect(resources['values-night/colors_wcag.xml']).toBeUndefined();
            expect(resources['kotlin/DesignSystemColors.kt']).toBeDefined();
        });
        test('should generate light mode colors in values directory', () => {
            const tokens = createMultipleColorTokens();
            const resources = resolver.generateAndroidResources(tokens);
            expect(resources['values/colors.xml']).toContain('#8B5CF6'); // Light mode base
        });
        test('should generate dark mode colors in values-night directory', () => {
            const tokens = createMultipleColorTokens();
            const resources = resolver.generateAndroidResources(tokens);
            expect(resources['values-night/colors.xml']).toContain('#A78BFA'); // Dark mode base
        });
        test('should support custom default theme', () => {
            const tokens = createMultipleColorTokens();
            const resources = resolver.generateAndroidResources(tokens, { defaultTheme: 'wcag' });
            expect(resources['values/colors.xml']).toContain('#7C3AED'); // Light mode WCAG
            expect(resources['values-night/colors.xml']).toContain('#C4B5FD'); // Dark mode WCAG
        });
    });
    describe('Resource Qualifier Handling', () => {
        test('should use values directory for light mode', () => {
            const tokens = createMultipleColorTokens();
            const resources = resolver.generateAndroidResources(tokens);
            expect(resources['values/colors.xml']).toContain('Light Mode');
        });
        test('should use values-night directory for dark mode', () => {
            const tokens = createMultipleColorTokens();
            const resources = resolver.generateAndroidResources(tokens);
            expect(resources['values-night/colors.xml']).toContain('Dark Mode');
        });
        test('should support automatic mode detection via resource qualifiers', () => {
            const tokens = createMultipleColorTokens();
            const lightXml = resolver.generateLightModeColors(tokens);
            const darkXml = resolver.generateDarkModeColors(tokens);
            // Same resource name, different values
            expect(lightXml).toContain('<color name="purple300">#8B5CF6</color>');
            expect(darkXml).toContain('<color name="purple300">#A78BFA</color>');
        });
    });
    describe('Usage Example Generation', () => {
        test('should generate usage examples', () => {
            const example = resolver.generateUsageExample();
            expect(example).toContain('// MARK: - Basic Usage');
            expect(example).toContain('view.setBackgroundColor(DesignSystemColors.purple300(context))');
            expect(example).toContain('textView.setTextColor(DesignSystemColors.gray300(context))');
        });
        test('should include theme switching examples', () => {
            const example = resolver.generateUsageExample();
            expect(example).toContain('// MARK: - Theme Switching');
            expect(example).toContain('DesignSystemColors.setTheme(context, "wcag")');
            expect(example).toContain('DesignSystemColors.setTheme(context, "base")');
        });
        test('should include theme getter example', () => {
            const example = resolver.generateUsageExample();
            expect(example).toContain('val currentTheme = DesignSystemColors.getTheme(context)');
        });
        test('should include automatic mode detection note', () => {
            const example = resolver.generateUsageExample();
            expect(example).toContain('// MARK: - Automatic Mode Detection');
            expect(example).toContain('Colors automatically adapt to light/dark mode');
            expect(example).toContain('values/values-night');
        });
    });
    describe('Integration with ModeThemeResolver', () => {
        test('should use ModeThemeResolver for color resolution', () => {
            const colorToken = createMockColorToken();
            const modeThemeResolver = resolver.getResolver();
            const result = modeThemeResolver.resolve(colorToken, 'light', 'base');
            expect(result.color).toBe('#8B5CF6');
        });
        test('should resolve all mode/theme combinations correctly', () => {
            const colorToken = createMockColorToken();
            const modeThemeResolver = resolver.getResolver();
            const allValues = modeThemeResolver.resolveAll(colorToken);
            expect(allValues.light.base).toBe('#8B5CF6');
            expect(allValues.light.wcag).toBe('#7C3AED');
            expect(allValues.dark.base).toBe('#A78BFA');
            expect(allValues.dark.wcag).toBe('#C4B5FD');
        });
    });
    describe('XML Validity', () => {
        test('should generate valid XML syntax', () => {
            const tokens = createMultipleColorTokens();
            const xml = resolver.generateLightModeColors(tokens);
            expect(xml).toMatch(/<\?xml version="1\.0" encoding="utf-8"\?>/);
            expect(xml).toMatch(/<resources>/);
            expect(xml).toMatch(/<color name="[a-z0-9_]+">#[0-9A-F]{6}<\/color>/);
            expect(xml).toMatch(/<\/resources>/);
        });
        test('should include XML comments', () => {
            const tokens = createMultipleColorTokens();
            const xml = resolver.generateLightModeColors(tokens);
            expect(xml).toContain('<!--');
            expect(xml).toContain('Design System Color Tokens');
            expect(xml).toContain('-->');
        });
        test('should properly escape special characters in comments', () => {
            const tokens = createMultipleColorTokens();
            const xml = resolver.generateLightModeColors(tokens);
            // XML comments should not break the structure
            expect(xml).not.toContain('<!-->');
            expect(xml).not.toContain('<!--->');
        });
    });
    describe('Kotlin Code Validity', () => {
        test('should generate valid Kotlin syntax', () => {
            const tokens = createMultipleColorTokens();
            const kotlin = resolver.generateKotlinExtension(tokens);
            expect(kotlin).toMatch(/fun \w+\(context: Context\): Int \{/);
            expect(kotlin).toContain('return ContextCompat.getColor(context, colorRes)'); // With theme switching
            expect(kotlin).toMatch(/\}/);
        });
        test('should use proper Kotlin naming conventions', () => {
            const tokens = createMultipleColorTokens();
            const kotlin = resolver.generateKotlinExtension(tokens);
            // camelCase for functions
            expect(kotlin).toMatch(/fun [a-z][a-zA-Z0-9]*\(context: Context\): Int/);
            // PascalCase for objects
            expect(kotlin).toContain('object DesignSystemColors');
        });
        test('should include proper Kotlin documentation', () => {
            const tokens = createMultipleColorTokens();
            const kotlin = resolver.generateKotlinExtension(tokens);
            expect(kotlin).toContain('/**');
            expect(kotlin).toContain('Design System Color Tokens');
            expect(kotlin).toContain('*/');
        });
    });
    describe('Edge Cases', () => {
        test('should handle empty token object', () => {
            const xml = resolver.generateLightModeColors({});
            expect(xml).toContain('<resources>');
            expect(xml).toContain('</resources>');
        });
        test('should handle single token', () => {
            const tokens = { purple300: createMockColorToken() };
            const xml = resolver.generateLightModeColors(tokens);
            expect(xml).toContain('<color name="purple300">#8B5CF6</color>');
        });
        test('should handle token names with numbers', () => {
            const tokens = { color100: createMockColorToken() };
            const xml = resolver.generateLightModeColors(tokens);
            expect(xml).toContain('<color name="color100">');
        });
        test('should handle camelCase token names', () => {
            const tokens = { primaryColor: createMockColorToken() };
            const xml = resolver.generateLightModeColors(tokens);
            expect(xml).toContain('<color name="primary_color">');
        });
        test('should handle uppercase hex values', () => {
            const colorToken = {
                light: { base: '#8B5CF6', wcag: '#7C3AED' },
                dark: { base: '#A78BFA', wcag: '#C4B5FD' }
            };
            const tokens = { purple300: colorToken };
            const xml = resolver.generateLightModeColors(tokens);
            expect(xml).toContain('#8B5CF6');
        });
        test('should handle lowercase hex values and convert to uppercase', () => {
            const colorToken = {
                light: { base: '#8b5cf6', wcag: '#7c3aed' },
                dark: { base: '#a78bfa', wcag: '#c4b5fd' }
            };
            const tokens = { purple300: colorToken };
            const xml = resolver.generateLightModeColors(tokens);
            expect(xml).toContain('#8B5CF6');
            expect(xml).not.toContain('#8b5cf6');
        });
        test('should handle pure black and white', () => {
            const colorToken = {
                light: { base: '#000000', wcag: '#000000' },
                dark: { base: '#FFFFFF', wcag: '#FFFFFF' }
            };
            const tokens = { black: colorToken };
            const lightXml = resolver.generateLightModeColors(tokens);
            const darkXml = resolver.generateDarkModeColors(tokens);
            expect(lightXml).toContain('#000000');
            expect(darkXml).toContain('#FFFFFF');
        });
    });
    describe('Custom Configuration', () => {
        test('should support all configuration options together', () => {
            const tokens = createMultipleColorTokens();
            const options = {
                includeThemeSwitching: true,
                defaultTheme: 'wcag',
                resourceFileName: 'custom_colors'
            };
            const resources = resolver.generateAndroidResources(tokens, options);
            expect(resources['values/colors.xml']).toContain('#7C3AED'); // WCAG as default
            expect(resources['values/colors_wcag.xml']).toBeDefined();
            expect(resources['kotlin/DesignSystemColors.kt']).toContain('setTheme');
        });
        test('should support minimal configuration', () => {
            const tokens = createMultipleColorTokens();
            const options = {
                includeThemeSwitching: false
            };
            const resources = resolver.generateAndroidResources(tokens, options);
            expect(resources['values/colors.xml']).toBeDefined();
            expect(resources['values-night/colors.xml']).toBeDefined();
            expect(resources['values/colors_wcag.xml']).toBeUndefined();
            expect(resources['kotlin/DesignSystemColors.kt']).not.toContain('setTheme');
        });
    });
});
//# sourceMappingURL=AndroidColorResolver.test.js.map