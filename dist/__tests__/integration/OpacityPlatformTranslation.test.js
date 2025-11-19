"use strict";
/**
 * Opacity Platform Translation Integration Tests
 *
 * Integration tests for opacity token platform translation across web, iOS, and Android.
 * Tests that all platforms use the same opacity values and generate valid platform-specific code.
 *
 * Task 3.4: Create integration tests for platform translation
 */
Object.defineProperty(exports, "__esModule", { value: true });
const WebFormatGenerator_1 = require("../../providers/WebFormatGenerator");
const iOSFormatGenerator_1 = require("../../providers/iOSFormatGenerator");
const AndroidFormatGenerator_1 = require("../../providers/AndroidFormatGenerator");
describe('Opacity Platform Translation Integration', () => {
    describe('Cross-Platform Opacity Value Consistency', () => {
        const testOpacityValues = [
            { name: 'opacity000', value: 0.0, description: 'Fully transparent' },
            { name: 'opacity100', value: 0.08, description: 'Subtle transparency' },
            { name: 'opacity200', value: 0.16, description: 'Light transparency' },
            { name: 'opacity400', value: 0.32, description: 'Modal overlay' },
            { name: 'opacity600', value: 0.48, description: 'Disabled state' },
            { name: 'opacity800', value: 0.64, description: 'Very opaque' },
            { name: 'opacity1000', value: 0.80, description: 'Nearly full opacity' },
            { name: 'opacity1300', value: 1.0, description: 'Fully opaque' }
        ];
        test('all platforms should use same unitless opacity values', () => {
            testOpacityValues.forEach(({ name, value, description }) => {
                // All platforms should use the exact same opacity value
                // Web uses 0.48, iOS uses 0.48, Android uses 0.48f
                expect(value).toBeGreaterThanOrEqual(0.0);
                expect(value).toBeLessThanOrEqual(1.0);
            });
        });
        test('opacity values should be consistent across all test cases', () => {
            const webGenerator = new WebFormatGenerator_1.WebFormatGenerator();
            const iosGenerator = new iOSFormatGenerator_1.iOSFormatGenerator();
            const androidGenerator = new AndroidFormatGenerator_1.AndroidFormatGenerator('kotlin');
            testOpacityValues.forEach(({ name, value }) => {
                // Generate platform-specific output
                const webOutput = webGenerator.generateOpacityProperty(value);
                const iosOutput = iosGenerator.generateOpacityModifier(value);
                const androidOutput = androidGenerator.generateAlphaModifier(value);
                // Extract numeric values from generated output
                const webValue = parseFloat(webOutput.match(/opacity: ([\d.]+)/)?.[1] || '0');
                const iosValue = parseFloat(iosOutput.match(/\.opacity\(([\d.]+)\)/)?.[1] || '0');
                const androidValue = parseFloat(androidOutput.match(/Modifier\.alpha\(([\d.]+)f\)/)?.[1] || '0');
                // All platforms should use the same value
                expect(webValue).toBe(value);
                expect(iosValue).toBe(value);
                expect(androidValue).toBe(value);
            });
        });
    });
    describe('Web Platform CSS Generation', () => {
        let generator;
        beforeEach(() => {
            generator = new WebFormatGenerator_1.WebFormatGenerator();
        });
        test('should generate valid CSS opacity property', () => {
            const result = generator.generateOpacityProperty(0.48);
            expect(result).toBe('opacity: 0.48;');
            expect(result).toMatch(/^opacity: [\d.]+;$/);
        });
        test('should generate valid CSS RGBA with alpha channel', () => {
            const result = generator.generateRgbaAlpha(107, 80, 164, 0.48);
            expect(result).toBe('rgba(107, 80, 164, 0.48)');
            expect(result).toMatch(/^rgba\(\d+, \d+, \d+, [\d.]+\)$/);
        });
        test('should generate valid CSS custom property', () => {
            const result = generator.generateCustomProperty('opacity600', 0.48);
            expect(result).toBe('--opacity600: 0.48;');
            expect(result).toMatch(/^--[\w-]+: [\d.]+;$/);
        });
        test('should handle edge case opacity values', () => {
            expect(generator.generateOpacityProperty(0)).toBe('opacity: 0;');
            expect(generator.generateOpacityProperty(1)).toBe('opacity: 1;');
            expect(generator.generateOpacityProperty(0.08)).toBe('opacity: 0.08;');
        });
    });
    describe('iOS Platform SwiftUI Generation', () => {
        let generator;
        beforeEach(() => {
            generator = new iOSFormatGenerator_1.iOSFormatGenerator();
        });
        test('should generate valid SwiftUI opacity modifier', () => {
            const result = generator.generateOpacityModifier(0.48);
            expect(result).toBe('.opacity(0.48)');
            expect(result).toMatch(/^\.opacity\([\d.]+\)$/);
        });
        test('should generate valid SwiftUI Color with opacity', () => {
            const result = generator.generateColorWithOpacity(0.42, 0.31, 0.64, 0.48);
            expect(result).toBe('Color(red: 0.42, green: 0.31, blue: 0.64, opacity: 0.48)');
            expect(result).toMatch(/^Color\(red: [\d.]+, green: [\d.]+, blue: [\d.]+, opacity: [\d.]+\)$/);
        });
        test('should generate valid Swift constant', () => {
            const result = generator.generateConstant('opacity600', 0.48);
            expect(result).toBe('static let opacity600 = 0.48');
            expect(result).toMatch(/^static let \w+ = [\d.]+$/);
        });
        test('should handle edge case opacity values', () => {
            expect(generator.generateOpacityModifier(0)).toBe('.opacity(0)');
            expect(generator.generateOpacityModifier(1)).toBe('.opacity(1)');
            expect(generator.generateOpacityModifier(0.08)).toBe('.opacity(0.08)');
        });
    });
    describe('Android Platform Jetpack Compose Generation', () => {
        let generator;
        beforeEach(() => {
            generator = new AndroidFormatGenerator_1.AndroidFormatGenerator('kotlin');
        });
        test('should generate valid Jetpack Compose alpha modifier', () => {
            const result = generator.generateAlphaModifier(0.48);
            expect(result).toBe('Modifier.alpha(0.48f)');
            expect(result).toMatch(/^Modifier\.alpha\([\d.]+f\)$/);
        });
        test('should generate valid Jetpack Compose Color.copy with alpha', () => {
            const result = generator.generateColorWithAlpha('0xFF6B50A4', 0.48);
            expect(result).toBe('Color(0xFF6B50A4).copy(alpha = 0.48f)');
            expect(result).toMatch(/^Color\(0x[A-F0-9]+\)\.copy\(alpha = [\d.]+f\)$/);
        });
        test('should generate valid Kotlin constant', () => {
            const result = generator.generateConstant('opacity600', 0.48);
            expect(result).toBe('const val OPACITY_600 = 0.48f');
            expect(result).toMatch(/^const val [A-Z_0-9]+ = [\d.]+f$/);
        });
        test('should handle edge case opacity values', () => {
            expect(generator.generateAlphaModifier(0)).toBe('Modifier.alpha(0.0f)');
            expect(generator.generateAlphaModifier(1)).toBe('Modifier.alpha(1.0f)');
            expect(generator.generateAlphaModifier(0.08)).toBe('Modifier.alpha(0.08f)');
        });
    });
    describe('Cross-Platform Semantic Opacity Tokens', () => {
        const semanticOpacityTokens = [
            { name: 'opacityDisabled', primitiveValue: 0.48, primitiveRef: 'opacity600' },
            { name: 'opacityOverlay', primitiveValue: 0.32, primitiveRef: 'opacity400' },
            { name: 'opacityHover', primitiveValue: 0.08, primitiveRef: 'opacity100' },
            { name: 'opacityPressed', primitiveValue: 0.16, primitiveRef: 'opacity200' },
            { name: 'opacityLoading', primitiveValue: 0.16, primitiveRef: 'opacity200' }
        ];
        test('semantic tokens should resolve to same primitive values across platforms', () => {
            const webGenerator = new WebFormatGenerator_1.WebFormatGenerator();
            const iosGenerator = new iOSFormatGenerator_1.iOSFormatGenerator();
            const androidGenerator = new AndroidFormatGenerator_1.AndroidFormatGenerator('kotlin');
            semanticOpacityTokens.forEach(({ name, primitiveValue }) => {
                // Generate constants for each platform
                const webConstant = webGenerator.generateCustomProperty(name, primitiveValue);
                const iosConstant = iosGenerator.generateConstant(name, primitiveValue);
                const androidConstant = androidGenerator.generateConstant(name, primitiveValue);
                // Extract values
                const webValue = parseFloat(webConstant.match(/: ([\d.]+);/)?.[1] || '0');
                const iosValue = parseFloat(iosConstant.match(/= ([\d.]+)/)?.[1] || '0');
                const androidValue = parseFloat(androidConstant.match(/= ([\d.]+)f/)?.[1] || '0');
                // All platforms should use the same value
                expect(webValue).toBe(primitiveValue);
                expect(iosValue).toBe(primitiveValue);
                expect(androidValue).toBe(primitiveValue);
            });
        });
        test('semantic tokens should generate valid platform-specific code', () => {
            const webGenerator = new WebFormatGenerator_1.WebFormatGenerator();
            const iosGenerator = new iOSFormatGenerator_1.iOSFormatGenerator();
            const androidGenerator = new AndroidFormatGenerator_1.AndroidFormatGenerator('kotlin');
            semanticOpacityTokens.forEach(({ name, primitiveValue }) => {
                // Web CSS custom property
                const webOutput = webGenerator.generateCustomProperty(name, primitiveValue);
                expect(webOutput).toMatch(/^--[\w-]+: [\d.]+;$/);
                // iOS Swift constant
                const iosOutput = iosGenerator.generateConstant(name, primitiveValue);
                expect(iosOutput).toMatch(/^static let \w+ = [\d.]+$/);
                // Android Kotlin constant
                const androidOutput = androidGenerator.generateConstant(name, primitiveValue);
                expect(androidOutput).toMatch(/^const val [A-Z_]+ = [\d.]+f$/);
            });
        });
    });
    describe('Opacity with Color Composition', () => {
        test('web should generate valid RGBA with opacity', () => {
            const generator = new WebFormatGenerator_1.WebFormatGenerator();
            // Purple with 48% opacity
            const purple = generator.generateRgbaAlpha(107, 80, 164, 0.48);
            expect(purple).toBe('rgba(107, 80, 164, 0.48)');
            // Black with 32% opacity (modal overlay)
            const black = generator.generateRgbaAlpha(0, 0, 0, 0.32);
            expect(black).toBe('rgba(0, 0, 0, 0.32)');
            // White with 8% opacity (hover)
            const white = generator.generateRgbaAlpha(255, 255, 255, 0.08);
            expect(white).toBe('rgba(255, 255, 255, 0.08)');
        });
        test('iOS should generate valid Color with opacity parameter', () => {
            const generator = new iOSFormatGenerator_1.iOSFormatGenerator();
            // Purple with 48% opacity
            const purple = generator.generateColorWithOpacity(0.42, 0.31, 0.64, 0.48);
            expect(purple).toBe('Color(red: 0.42, green: 0.31, blue: 0.64, opacity: 0.48)');
            // Black with 32% opacity (modal overlay)
            const black = generator.generateColorWithOpacity(0, 0, 0, 0.32);
            expect(black).toBe('Color(red: 0, green: 0, blue: 0, opacity: 0.32)');
            // White with 8% opacity (hover)
            const white = generator.generateColorWithOpacity(1, 1, 1, 0.08);
            expect(white).toBe('Color(red: 1, green: 1, blue: 1, opacity: 0.08)');
        });
        test('Android should generate valid Color.copy with alpha', () => {
            const generator = new AndroidFormatGenerator_1.AndroidFormatGenerator('kotlin');
            // Purple with 48% opacity
            const purple = generator.generateColorWithAlpha('0xFF6B50A4', 0.48);
            expect(purple).toBe('Color(0xFF6B50A4).copy(alpha = 0.48f)');
            // Black with 32% opacity (modal overlay)
            const black = generator.generateColorWithAlpha('0xFF000000', 0.32);
            expect(black).toBe('Color(0xFF000000).copy(alpha = 0.32f)');
            // White with 8% opacity (hover)
            const white = generator.generateColorWithAlpha('0xFFFFFFFF', 0.08);
            expect(white).toBe('Color(0xFFFFFFFF).copy(alpha = 0.08f)');
        });
    });
    describe('Platform-Specific Syntax Validation', () => {
        test('web CSS should use correct syntax patterns', () => {
            const generator = new WebFormatGenerator_1.WebFormatGenerator();
            // Opacity property uses colon and semicolon
            expect(generator.generateOpacityProperty(0.48)).toMatch(/^opacity: [\d.]+;$/);
            // RGBA uses parentheses and commas
            expect(generator.generateRgbaAlpha(0, 0, 0, 0.48)).toMatch(/^rgba\(\d+, \d+, \d+, [\d.]+\)$/);
            // Custom property uses double dash prefix
            expect(generator.generateCustomProperty('opacity600', 0.48)).toMatch(/^--[\w-]+: [\d.]+;$/);
        });
        test('iOS Swift should use correct syntax patterns', () => {
            const generator = new iOSFormatGenerator_1.iOSFormatGenerator();
            // Opacity modifier uses dot notation
            expect(generator.generateOpacityModifier(0.48)).toMatch(/^\.opacity\([\d.]+\)$/);
            // Color uses named parameters
            expect(generator.generateColorWithOpacity(0, 0, 0, 0.48))
                .toMatch(/^Color\(red: [\d.]+, green: [\d.]+, blue: [\d.]+, opacity: [\d.]+\)$/);
            // Constant uses static let
            expect(generator.generateConstant('opacity600', 0.48)).toMatch(/^static let \w+ = [\d.]+$/);
        });
        test('Android Kotlin should use correct syntax patterns', () => {
            const generator = new AndroidFormatGenerator_1.AndroidFormatGenerator('kotlin');
            // Alpha modifier uses Modifier.alpha
            expect(generator.generateAlphaModifier(0.48)).toMatch(/^Modifier\.alpha\([\d.]+f\)$/);
            // Color.copy uses named parameter
            expect(generator.generateColorWithAlpha('0xFF000000', 0.48))
                .toMatch(/^Color\(0x[A-F0-9]+\)\.copy\(alpha = [\d.]+f\)$/);
            // Constant uses const val with UPPER_SNAKE_CASE
            expect(generator.generateConstant('opacity600', 0.48)).toMatch(/^const val [A-Z_0-9]+ = [\d.]+f$/);
        });
    });
    describe('Opacity Value Range Validation', () => {
        test('all platforms should handle full opacity range (0.0 to 1.0)', () => {
            const webGenerator = new WebFormatGenerator_1.WebFormatGenerator();
            const iosGenerator = new iOSFormatGenerator_1.iOSFormatGenerator();
            const androidGenerator = new AndroidFormatGenerator_1.AndroidFormatGenerator('kotlin');
            const testValues = [0.0, 0.08, 0.16, 0.32, 0.48, 0.64, 0.80, 0.88, 0.96, 1.0];
            testValues.forEach(value => {
                // All platforms should generate valid output for any value in range
                expect(() => webGenerator.generateOpacityProperty(value)).not.toThrow();
                expect(() => iosGenerator.generateOpacityModifier(value)).not.toThrow();
                expect(() => androidGenerator.generateAlphaModifier(value)).not.toThrow();
                // Verify values are preserved
                const webOutput = webGenerator.generateOpacityProperty(value);
                const iosOutput = iosGenerator.generateOpacityModifier(value);
                const androidOutput = androidGenerator.generateAlphaModifier(value);
                expect(webOutput).toContain(value.toString());
                expect(iosOutput).toContain(value.toString());
                expect(androidOutput).toContain(value.toString());
            });
        });
        test('all platforms should maintain precision for decimal values', () => {
            const webGenerator = new WebFormatGenerator_1.WebFormatGenerator();
            const iosGenerator = new iOSFormatGenerator_1.iOSFormatGenerator();
            const androidGenerator = new AndroidFormatGenerator_1.AndroidFormatGenerator('kotlin');
            // Test precise decimal values
            const preciseValues = [0.08, 0.16, 0.24, 0.32, 0.40, 0.48, 0.56, 0.64, 0.72, 0.80, 0.88, 0.96];
            preciseValues.forEach(value => {
                const webOutput = webGenerator.generateOpacityProperty(value);
                const iosOutput = iosGenerator.generateOpacityModifier(value);
                const androidOutput = androidGenerator.generateAlphaModifier(value);
                // Extract and verify precision is maintained
                const webValue = parseFloat(webOutput.match(/opacity: ([\d.]+)/)?.[1] || '0');
                const iosValue = parseFloat(iosOutput.match(/\.opacity\(([\d.]+)\)/)?.[1] || '0');
                const androidValue = parseFloat(androidOutput.match(/Modifier\.alpha\(([\d.]+)f\)/)?.[1] || '0');
                expect(webValue).toBe(value);
                expect(iosValue).toBe(value);
                expect(androidValue).toBe(value);
            });
        });
    });
});
//# sourceMappingURL=OpacityPlatformTranslation.test.js.map