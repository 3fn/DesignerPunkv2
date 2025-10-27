"use strict";
/**
 * iOSColorResolver Unit Tests
 *
 * Tests for iOS UIColor.dynamicColor generation and trait collection detection.
 * Covers Swift code generation, native mode detection, and theme switching support.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iOSColorResolver_1 = require("../iOSColorResolver");
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
describe('iOSColorResolver', () => {
    let resolver;
    beforeEach(() => {
        resolver = new iOSColorResolver_1.iOSColorResolver();
    });
    describe('UIColor.dynamicColor Generation', () => {
        test('should generate dynamic color with default options', () => {
            const colorToken = createMockColorToken();
            const swift = resolver.generateDynamicColor('purple300', colorToken);
            expect(swift).toContain('static var purple300: UIColor');
            expect(swift).toContain('UIColor { traitCollection in');
            expect(swift).toContain('traitCollection.userInterfaceStyle');
            expect(swift).toContain('case (.dark,'); // With theme switching by default
        });
        test('should convert token name to camelCase', () => {
            const colorToken = createMockColorToken();
            const swift = resolver.generateDynamicColor('Purple300', colorToken);
            expect(swift).toContain('static var purple300: UIColor'); // Lowercase first letter
        });
        test('should generate dynamic color with theme switching', () => {
            const colorToken = createMockColorToken();
            const swift = resolver.generateDynamicColor('purple300', colorToken, { includeThemeSwitching: true });
            expect(swift).toContain('UserDefaults.standard.string(forKey: "designSystemTheme")');
            expect(swift).toContain('case (.dark, "wcag")');
            expect(swift).toContain('case (.dark, _)');
            expect(swift).toContain('case (_, "wcag")');
            expect(swift).toContain('default:');
        });
        test('should generate dynamic color without theme switching', () => {
            const colorToken = createMockColorToken();
            const swift = resolver.generateDynamicColor('purple300', colorToken, { includeThemeSwitching: false });
            expect(swift).not.toContain('UserDefaults');
            expect(swift).not.toContain('designSystemTheme');
            expect(swift).toContain('case .dark:');
            expect(swift).toContain('default:');
        });
        test('should use wcag as default theme when specified', () => {
            const colorToken = createMockColorToken();
            const swift = resolver.generateDynamicColor('purple300', colorToken, { defaultTheme: 'wcag' });
            expect(swift).toContain('"designSystemTheme") ?? "wcag"');
        });
    });
    describe('Hex to UIColor Conversion', () => {
        test('should convert purple hex to UIColor', () => {
            const colorToken = createMockColorToken();
            const swift = resolver.generateDynamicColor('purple300', colorToken);
            // #8B5CF6 = RGB(139, 92, 246) = (0.545, 0.361, 0.965)
            expect(swift).toContain('UIColor(red: 0.545, green: 0.361, blue: 0.965, alpha: 1.0)');
        });
        test('should convert orange hex to UIColor', () => {
            const colorToken = {
                light: { base: '#FF6B35', wcag: '#E65A2A' },
                dark: { base: '#FFB8A0', wcag: '#FFA380' }
            };
            const swift = resolver.generateDynamicColor('orange300', colorToken);
            // #FF6B35 = RGB(255, 107, 53) = (1.000, 0.420, 0.208)
            expect(swift).toContain('UIColor(red: 1.000, green: 0.420, blue: 0.208, alpha: 1.0)');
        });
        test('should convert pure black to UIColor', () => {
            const colorToken = {
                light: { base: '#000000', wcag: '#000000' },
                dark: { base: '#000000', wcag: '#000000' }
            };
            const swift = resolver.generateDynamicColor('black', colorToken);
            expect(swift).toContain('UIColor(red: 0.000, green: 0.000, blue: 0.000, alpha: 1.0)');
        });
        test('should convert pure white to UIColor', () => {
            const colorToken = {
                light: { base: '#FFFFFF', wcag: '#FFFFFF' },
                dark: { base: '#FFFFFF', wcag: '#FFFFFF' }
            };
            const swift = resolver.generateDynamicColor('white', colorToken);
            expect(swift).toContain('UIColor(red: 1.000, green: 1.000, blue: 1.000, alpha: 1.0)');
        });
    });
    describe('Trait Collection Detection', () => {
        test('should use userInterfaceStyle for mode detection', () => {
            const colorToken = createMockColorToken();
            const swift = resolver.generateDynamicColor('purple300', colorToken);
            expect(swift).toContain('traitCollection.userInterfaceStyle');
        });
        test('should handle dark mode trait', () => {
            const colorToken = createMockColorToken();
            const swift = resolver.generateDynamicColor('purple300', colorToken);
            expect(swift).toContain('case (.dark,'); // With theme switching by default
            // #A78BFA = RGB(167, 139, 250) = (0.655, 0.545, 0.980)
            expect(swift).toContain('UIColor(red: 0.655, green: 0.545, blue: 0.980, alpha: 1.0)');
        });
        test('should handle light mode as default', () => {
            const colorToken = createMockColorToken();
            const swift = resolver.generateDynamicColor('purple300', colorToken);
            expect(swift).toContain('default:');
            // #8B5CF6 = RGB(139, 92, 246) = (0.545, 0.361, 0.965)
            expect(swift).toContain('UIColor(red: 0.545, green: 0.361, blue: 0.965, alpha: 1.0)');
        });
    });
    describe('Complete Swift Extension Generation', () => {
        test('should generate complete Swift extension', () => {
            const tokens = createMultipleColorTokens();
            const swift = resolver.generateSwiftExtension(tokens);
            expect(swift).toContain('import UIKit');
            expect(swift).toContain('extension UIColor');
            expect(swift).toContain('enum DesignSystemColors');
            expect(swift).toContain('static var purple300: UIColor');
            expect(swift).toContain('static var orange300: UIColor');
            expect(swift).toContain('static var cyan300: UIColor');
        });
        test('should generate extension with custom name', () => {
            const tokens = createMultipleColorTokens();
            const swift = resolver.generateSwiftExtension(tokens, { extensionName: 'CustomColors' });
            expect(swift).toContain('enum CustomColors');
            expect(swift).toContain('//  CustomColors.swift');
        });
        test('should include file header comments', () => {
            const tokens = createMultipleColorTokens();
            const swift = resolver.generateSwiftExtension(tokens);
            expect(swift).toContain('//  DesignSystemColors.swift');
            expect(swift).toContain('//  Design System Color Tokens');
            expect(swift).toContain('//  Generated with mode-aware and theme-aware support');
            expect(swift).toContain('//  Supports native iOS light/dark mode via UITraitCollection');
        });
        test('should include theme switching helper', () => {
            const tokens = createMultipleColorTokens();
            const swift = resolver.generateSwiftExtension(tokens);
            expect(swift).toContain('// MARK: - Theme Switching Helper');
            expect(swift).toContain('extension UserDefaults');
            expect(swift).toContain('var designSystemTheme: String');
            expect(swift).toContain('func setDesignSystemTheme(_ theme: String)');
        });
        test('should include notification for theme changes', () => {
            const tokens = createMultipleColorTokens();
            const swift = resolver.generateSwiftExtension(tokens);
            expect(swift).toContain('NotificationCenter.default.post');
            expect(swift).toContain('name: NSNotification.Name("DesignSystemThemeDidChange")');
        });
        test('should generate extension without theme switching', () => {
            const tokens = createMultipleColorTokens();
            const swift = resolver.generateSwiftExtension(tokens, { includeThemeSwitching: false });
            // The extension still includes the UserDefaults helper, but individual colors don't use theme switching
            expect(swift).toContain('static var purple300: UIColor');
            expect(swift).toContain('case .dark:'); // Simple dark mode without theme
            expect(swift).not.toContain('case (.dark, "wcag")'); // No theme switching in color definitions
        });
    });
    describe('Theme Switching Support', () => {
        test('should support base theme', () => {
            const colorToken = createMockColorToken();
            const swift = resolver.generateDynamicColor('purple300', colorToken, { defaultTheme: 'base' });
            expect(swift).toContain('"designSystemTheme") ?? "base"');
        });
        test('should support wcag theme', () => {
            const colorToken = createMockColorToken();
            const swift = resolver.generateDynamicColor('purple300', colorToken, { defaultTheme: 'wcag' });
            expect(swift).toContain('"designSystemTheme") ?? "wcag"');
        });
        test('should handle all mode/theme combinations', () => {
            const colorToken = createMockColorToken();
            const swift = resolver.generateDynamicColor('purple300', colorToken, { includeThemeSwitching: true });
            // Dark + WCAG: #C4B5FD = RGB(196, 181, 253) = (0.769, 0.710, 0.992)
            expect(swift).toContain('case (.dark, "wcag")');
            expect(swift).toContain('UIColor(red: 0.769, green: 0.710, blue: 0.992, alpha: 1.0)');
            // Dark + Base: #A78BFA = RGB(167, 139, 250) = (0.655, 0.545, 0.980)
            expect(swift).toContain('case (.dark, _)');
            expect(swift).toContain('UIColor(red: 0.655, green: 0.545, blue: 0.980, alpha: 1.0)');
            // Light + WCAG: #7C3AED = RGB(124, 58, 237) = (0.486, 0.227, 0.929)
            expect(swift).toContain('case (_, "wcag")');
            expect(swift).toContain('UIColor(red: 0.486, green: 0.227, blue: 0.929, alpha: 1.0)');
            // Light + Base: #8B5CF6 = RGB(139, 92, 246) = (0.545, 0.361, 0.965)
            expect(swift).toContain('default:');
            expect(swift).toContain('UIColor(red: 0.545, green: 0.361, blue: 0.965, alpha: 1.0)');
        });
    });
    describe('Usage Example Generation', () => {
        test('should generate usage examples', () => {
            const example = resolver.generateUsageExample();
            expect(example).toContain('// MARK: - Basic Usage');
            expect(example).toContain('view.backgroundColor = UIColor.DesignSystemColors.purple300');
            expect(example).toContain('label.textColor = UIColor.DesignSystemColors.gray300');
        });
        test('should include theme switching examples', () => {
            const example = resolver.generateUsageExample();
            expect(example).toContain('// MARK: - Theme Switching');
            expect(example).toContain('UserDefaults.standard.setDesignSystemTheme("wcag")');
            expect(example).toContain('UserDefaults.standard.setDesignSystemTheme("base")');
        });
        test('should include notification observer example', () => {
            const example = resolver.generateUsageExample();
            expect(example).toContain('// MARK: - Observing Theme Changes');
            expect(example).toContain('NotificationCenter.default.addObserver');
            expect(example).toContain('NSNotification.Name("DesignSystemThemeDidChange")');
            expect(example).toContain('self.updateColors()');
        });
        test('should include automatic mode detection note', () => {
            const example = resolver.generateUsageExample();
            expect(example).toContain('// MARK: - Automatic Mode Detection');
            expect(example).toContain('Colors automatically adapt to light/dark mode');
            expect(example).toContain('UITraitCollection.userInterfaceStyle');
        });
        test('should use custom extension name in examples', () => {
            const example = resolver.generateUsageExample('CustomColors');
            expect(example).toContain('UIColor.CustomColors.purple300');
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
    describe('Swift Code Validity', () => {
        test('should generate valid Swift syntax', () => {
            const colorToken = createMockColorToken();
            const swift = resolver.generateDynamicColor('purple300', colorToken);
            // Check for proper Swift structure
            expect(swift).toMatch(/static var \w+: UIColor \{/);
            expect(swift).toMatch(/UIColor \{ traitCollection in/);
            expect(swift).toMatch(/switch.*\{/);
            expect(swift).toMatch(/case.*:/);
            expect(swift).toMatch(/return UIColor\(/);
            expect(swift).toMatch(/\}/);
        });
        test('should use proper Swift naming conventions', () => {
            const tokens = createMultipleColorTokens();
            const swift = resolver.generateSwiftExtension(tokens);
            // camelCase for properties
            expect(swift).toMatch(/static var [a-z][a-zA-Z0-9]*: UIColor/);
            // PascalCase for types
            expect(swift).toContain('enum DesignSystemColors');
            expect(swift).toContain('extension UIColor');
            expect(swift).toContain('extension UserDefaults');
        });
        test('should include proper Swift documentation', () => {
            const tokens = createMultipleColorTokens();
            const swift = resolver.generateSwiftExtension(tokens);
            expect(swift).toContain('///');
            expect(swift).toContain('Design System color tokens');
        });
    });
    describe('Edge Cases', () => {
        test('should handle empty token object', () => {
            const swift = resolver.generateSwiftExtension({});
            expect(swift).toContain('extension UIColor');
            expect(swift).toContain('enum DesignSystemColors');
        });
        test('should handle single token', () => {
            const tokens = { purple300: createMockColorToken() };
            const swift = resolver.generateSwiftExtension(tokens);
            expect(swift).toContain('static var purple300: UIColor');
        });
        test('should handle token names with numbers', () => {
            const tokens = { color100: createMockColorToken() };
            const swift = resolver.generateSwiftExtension(tokens);
            expect(swift).toContain('static var color100: UIColor');
        });
        test('should handle uppercase hex values', () => {
            const colorToken = {
                light: { base: '#8B5CF6', wcag: '#7C3AED' },
                dark: { base: '#A78BFA', wcag: '#C4B5FD' }
            };
            const swift = resolver.generateDynamicColor('purple300', colorToken);
            expect(swift).toContain('UIColor(red: 0.545, green: 0.361, blue: 0.965, alpha: 1.0)');
        });
        test('should handle lowercase hex values', () => {
            const colorToken = {
                light: { base: '#8b5cf6', wcag: '#7c3aed' },
                dark: { base: '#a78bfa', wcag: '#c4b5fd' }
            };
            const swift = resolver.generateDynamicColor('purple300', colorToken);
            expect(swift).toContain('UIColor(red: 0.545, green: 0.361, blue: 0.965, alpha: 1.0)');
        });
    });
    describe('Custom Configuration', () => {
        test('should support all configuration options together', () => {
            const colorToken = createMockColorToken();
            const options = {
                includeThemeSwitching: true,
                defaultTheme: 'wcag',
                extensionName: 'CustomColors'
            };
            const swift = resolver.generateDynamicColor('purple300', colorToken, options);
            expect(swift).toContain('static var purple300: UIColor');
            expect(swift).toContain('"designSystemTheme") ?? "wcag"');
            expect(swift).toContain('case (.dark, "wcag")');
        });
        test('should support minimal configuration', () => {
            const colorToken = createMockColorToken();
            const options = {
                includeThemeSwitching: false
            };
            const swift = resolver.generateDynamicColor('purple300', colorToken, options);
            expect(swift).toContain('static var purple300: UIColor');
            expect(swift).not.toContain('UserDefaults');
            expect(swift).toContain('case .dark:');
        });
    });
});
//# sourceMappingURL=iOSColorResolver.test.js.map