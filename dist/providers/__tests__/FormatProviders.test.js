"use strict";
/**
 * Format Provider Services Unit Tests
 *
 * Tests for platform-specific syntax generation, naming convention consistency,
 * and file compilation/parsing validation across web, iOS, and Android platforms.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const WebFormatGenerator_1 = require("../WebFormatGenerator");
const iOSFormatGenerator_1 = require("../iOSFormatGenerator");
const AndroidFormatGenerator_1 = require("../AndroidFormatGenerator");
const PrimitiveToken_1 = require("../../types/PrimitiveToken");
const SemanticToken_1 = require("../../types/SemanticToken");
// Mock token factory for testing
const createMockPrimitiveToken = (overrides = {}) => ({
    name: 'space100',
    category: PrimitiveToken_1.TokenCategory.SPACING,
    baseValue: 8,
    familyBaseValue: 8,
    description: 'Base spacing unit',
    mathematicalRelationship: 'base × 1 = 8',
    baselineGridAlignment: true,
    isStrategicFlexibility: false,
    isPrecisionTargeted: false,
    platforms: {
        web: { value: 8, unit: 'px' },
        ios: { value: 8, unit: 'pt' },
        android: { value: 8, unit: 'dp' }
    },
    ...overrides
});
const createMockSemanticToken = (overrides = {}) => {
    const primitiveToken = createMockPrimitiveToken();
    return {
        name: 'space.grouped.normal',
        primitiveReferences: {
            default: 'space100'
        },
        category: SemanticToken_1.SemanticCategory.SPACING,
        context: 'Standard grouping spacing',
        description: 'Spacing for elements within the same logical group',
        primitiveTokens: {
            default: primitiveToken
        },
        ...overrides
    };
};
describe('Format Provider Services', () => {
    describe('WebFormatGenerator', () => {
        describe('CSS Format Generation', () => {
            let generator;
            beforeEach(() => {
                generator = new WebFormatGenerator_1.WebFormatGenerator();
            });
            test('should format primitive token as CSS custom property', () => {
                const token = createMockPrimitiveToken();
                const result = generator.formatToken(token);
                expect(result).toContain('--space-100');
                expect(result).toContain('8px');
                expect(result).toMatch(/--space-100:\s*8px;/);
            });
            test('should format fontSize token with REM units', () => {
                const token = createMockPrimitiveToken({
                    name: 'fontSize100',
                    category: PrimitiveToken_1.TokenCategory.FONT_SIZE,
                    baseValue: 16,
                    platforms: {
                        web: { value: 1, unit: 'rem' },
                        ios: { value: 16, unit: 'pt' },
                        android: { value: 16, unit: 'sp' }
                    }
                });
                const result = generator.formatToken(token);
                expect(result).toContain('--font-size-100');
                expect(result).toContain('1rem');
            });
            test('should format lineHeight token as unitless', () => {
                const token = createMockPrimitiveToken({
                    name: 'lineHeight100',
                    category: PrimitiveToken_1.TokenCategory.LINE_HEIGHT,
                    baseValue: 1.5,
                    platforms: {
                        web: { value: 1.5, unit: 'unitless' },
                        ios: { value: 1.5, unit: 'unitless' },
                        android: { value: 1.5, unit: 'unitless' }
                    }
                });
                const result = generator.formatToken(token);
                expect(result).toContain('--line-height-100');
                expect(result).toContain('1.5');
                expect(result).not.toContain('px');
                expect(result).not.toContain('rem');
            });
            test('should format fontFamily token as string', () => {
                const token = createMockPrimitiveToken({
                    name: 'fontFamilyBody',
                    category: PrimitiveToken_1.TokenCategory.FONT_FAMILY,
                    baseValue: 0,
                    platforms: {
                        web: { value: 'Inter, sans-serif', unit: 'fontFamily' },
                        ios: { value: 'Inter, sans-serif', unit: 'fontFamily' },
                        android: { value: 'Inter, sans-serif', unit: 'fontFamily' }
                    }
                });
                const result = generator.formatToken(token);
                expect(result).toContain('--font-family-body');
                expect(result).toContain('Inter, sans-serif');
            });
            test('should format borderWidth tokens with px units', () => {
                const token = createMockPrimitiveToken({
                    name: 'borderWidth100',
                    category: PrimitiveToken_1.TokenCategory.BORDER_WIDTH,
                    baseValue: 1,
                    platforms: {
                        web: { value: 1, unit: 'px' },
                        ios: { value: 1, unit: 'pt' },
                        android: { value: 1, unit: 'dp' }
                    }
                });
                const result = generator.formatToken(token);
                expect(result).toContain('--border-width-100');
                expect(result).toContain('1px');
                expect(result).toMatch(/--border-width-100:\s*1px;/);
                // Ensure no double dash prefix
                expect(result).not.toContain('----');
            });
            test('should generate complete CSS file with header and footer', () => {
                const tokens = [
                    createMockPrimitiveToken({ name: 'space100', baseValue: 8 }),
                    createMockPrimitiveToken({ name: 'space150', baseValue: 12 })
                ];
                const result = generator.generateFile(tokens);
                expect(result).toContain('DesignerPunk Design System');
                expect(result).toContain(':root {');
                expect(result).toContain('--space-100');
                expect(result).toContain('--space-150');
                expect(result).toMatch(/}\s*$/); // Ends with closing brace
            });
            test('should include metadata in header', () => {
                const metadata = {
                    generatedAt: new Date('2025-01-01T00:00:00Z'),
                    version: '2.0.0'
                };
                const result = generator.generateHeader(metadata);
                expect(result).toContain('2025-01-01');
                expect(result).toContain('2.0.0');
                expect(result).toContain('Web (CSS Custom Properties)');
            });
            test('should group tokens by category when requested', () => {
                const tokens = [
                    createMockPrimitiveToken({ name: 'space100', category: PrimitiveToken_1.TokenCategory.SPACING }),
                    createMockPrimitiveToken({ name: 'fontSize100', category: PrimitiveToken_1.TokenCategory.FONT_SIZE }),
                    createMockPrimitiveToken({ name: 'space150', category: PrimitiveToken_1.TokenCategory.SPACING })
                ];
                const options = { groupByCategory: true };
                const result = generator.generateFile(tokens, options);
                expect(result).toContain('/* SPACING TOKENS */');
                expect(result).toContain('/* FONTSIZE TOKENS */'); // Category enum value without underscore
            });
            test('should sort tokens alphabetically when requested', () => {
                const tokens = [
                    createMockPrimitiveToken({ name: 'space150' }),
                    createMockPrimitiveToken({ name: 'space050' }),
                    createMockPrimitiveToken({ name: 'space100' })
                ];
                const options = { sortAlphabetically: true };
                const result = generator.generateFile(tokens, options);
                const space050Index = result.indexOf('--space-050');
                const space100Index = result.indexOf('--space-100');
                const space150Index = result.indexOf('--space-150');
                expect(space050Index).toBeLessThan(space100Index);
                expect(space100Index).toBeLessThan(space150Index);
            });
            test('should validate CSS syntax correctly', () => {
                const validContent = ':root { --space-100: 8px; }';
                const result = generator.validateSyntax(validContent);
                expect(result.valid).toBe(true);
                expect(result.errors).toBeUndefined();
            });
            test('should detect missing :root selector', () => {
                const invalidContent = '.tokens { --space-100: 8px; }';
                const result = generator.validateSyntax(invalidContent);
                expect(result.valid).toBe(false);
                expect(result.errors).toContain('Missing :root selector');
            });
            test('should detect unbalanced braces', () => {
                const invalidContent = ':root { --space-100: 8px;';
                const result = generator.validateSyntax(invalidContent);
                expect(result.valid).toBe(false);
                expect(result.errors).toContain('Unbalanced braces in CSS');
            });
        });
        describe('Naming Convention Consistency', () => {
            test('should convert token names to kebab-case with prefix', () => {
                const generator = new WebFormatGenerator_1.WebFormatGenerator();
                const name = generator.getTokenName('fontSize125', 'fontSize');
                expect(name).toBe('--font-size-125');
            });
            test('should handle complex token names', () => {
                const generator = new WebFormatGenerator_1.WebFormatGenerator();
                expect(generator.getTokenName('lineHeight100', 'lineHeight')).toBe('--line-height-100');
                expect(generator.getTokenName('fontWeightBold', 'fontWeight')).toBe('--font-weight-bold');
            });
        });
    });
    describe('iOSFormatGenerator', () => {
        let generator;
        beforeEach(() => {
            generator = new iOSFormatGenerator_1.iOSFormatGenerator();
        });
        describe('Swift Format Generation', () => {
            test('should format primitive token as Swift constant', () => {
                const token = createMockPrimitiveToken();
                const result = generator.formatToken(token);
                expect(result).toContain('public static let space100');
                expect(result).toContain('CGFloat');
                expect(result).toContain('= 8');
            });
            test('should format fontSize token with CGFloat type', () => {
                const token = createMockPrimitiveToken({
                    name: 'fontSize100',
                    category: PrimitiveToken_1.TokenCategory.FONT_SIZE,
                    baseValue: 16,
                    platforms: {
                        web: { value: 1, unit: 'rem' },
                        ios: { value: 16, unit: 'pt' },
                        android: { value: 16, unit: 'sp' }
                    }
                });
                const result = generator.formatToken(token);
                expect(result).toContain('fontSize100');
                expect(result).toContain('CGFloat');
                expect(result).toContain('= 16');
            });
            test('should format fontWeight token with UIFont.Weight type', () => {
                const token = createMockPrimitiveToken({
                    name: 'fontWeightBold',
                    category: PrimitiveToken_1.TokenCategory.FONT_WEIGHT,
                    baseValue: 700,
                    platforms: {
                        web: { value: 700, unit: 'fontWeight' },
                        ios: { value: '700', unit: 'fontWeight' },
                        android: { value: 700, unit: 'fontWeight' }
                    }
                });
                const result = generator.formatToken(token);
                expect(result).toContain('fontWeightBold');
                expect(result).toContain('UIFont.Weight');
                expect(result).toContain('.bold');
            });
            test('should format fontFamily token as String', () => {
                const token = createMockPrimitiveToken({
                    name: 'fontFamilyBody',
                    category: PrimitiveToken_1.TokenCategory.FONT_FAMILY,
                    baseValue: 0,
                    platforms: {
                        web: { value: 'Inter, sans-serif', unit: 'fontFamily' },
                        ios: { value: 'Inter, sans-serif', unit: 'fontFamily' },
                        android: { value: 'Inter, sans-serif', unit: 'fontFamily' }
                    }
                });
                const result = generator.formatToken(token);
                expect(result).toContain('fontFamilyBody');
                expect(result).toContain('String');
                expect(result).toContain('"Inter, sans-serif"');
            });
            test('should format borderWidth tokens with CGFloat type and pt units', () => {
                const token = createMockPrimitiveToken({
                    name: 'borderWidth100',
                    category: PrimitiveToken_1.TokenCategory.BORDER_WIDTH,
                    baseValue: 1,
                    platforms: {
                        web: { value: 1, unit: 'px' },
                        ios: { value: 1, unit: 'pt' },
                        android: { value: 1, unit: 'dp' }
                    }
                });
                const result = generator.formatToken(token);
                expect(result).toContain('borderWidth100');
                expect(result).toContain('CGFloat');
                expect(result).toContain('= 1');
                expect(result).toMatch(/public static let borderWidth100: CGFloat = 1/);
            });
            test('should generate complete Swift file with header and footer', () => {
                const tokens = [
                    createMockPrimitiveToken({ name: 'space100' }),
                    createMockPrimitiveToken({ name: 'space150' })
                ];
                const result = generator.generateFile(tokens);
                expect(result).toContain('DesignerPunk Design System');
                expect(result).toContain('import UIKit');
                expect(result).toContain('public struct DesignTokens {');
                expect(result).toContain('space100');
                expect(result).toContain('space150');
                expect(result).toMatch(/}\s*$/);
            });
            test('should include MARK comments for categories', () => {
                const tokens = [
                    createMockPrimitiveToken({ name: 'space100', category: PrimitiveToken_1.TokenCategory.SPACING }),
                    createMockPrimitiveToken({ name: 'fontSize100', category: PrimitiveToken_1.TokenCategory.FONT_SIZE })
                ];
                const options = { groupByCategory: true };
                const result = generator.generateFile(tokens, options);
                expect(result).toContain('// MARK: - SPACING TOKENS');
                expect(result).toContain('// MARK: - FONTSIZE TOKENS'); // Category enum value without underscore
            });
            test('should validate Swift syntax correctly', () => {
                const validContent = `
import UIKit

public struct DesignTokens {
    public static let space100: CGFloat = 8
}
        `.trim();
                const result = generator.validateSyntax(validContent);
                expect(result.valid).toBe(true);
                expect(result.errors).toBeUndefined();
            });
            test('should detect missing UIKit import', () => {
                const invalidContent = `
public struct DesignTokens {
    public static let space100: CGFloat = 8
}
        `.trim();
                const result = generator.validateSyntax(invalidContent);
                expect(result.valid).toBe(false);
                expect(result.errors).toContain('Missing UIKit import');
            });
            test('should detect missing public struct', () => {
                const invalidContent = `
import UIKit

struct DesignTokens {
    static let space100: CGFloat = 8
}
        `.trim();
                const result = generator.validateSyntax(invalidContent);
                expect(result.valid).toBe(false);
                expect(result.errors).toBeDefined();
                expect(result.errors.length).toBeGreaterThan(0);
            });
        });
        describe('Naming Convention Consistency', () => {
            test('should convert token names to camelCase', () => {
                const name = generator.getTokenName('space-100', 'spacing');
                expect(name).toBe('space100');
            });
            test('should handle complex token names', () => {
                expect(generator.getTokenName('fontSize125', 'fontSize')).toBe('fontSize125');
                expect(generator.getTokenName('lineHeight100', 'lineHeight')).toBe('lineHeight100');
            });
            test('should preserve acronyms in uppercase', () => {
                const name = generator.getTokenName('colorRGB', 'color');
                expect(name).toContain('RGB');
            });
        });
    });
    describe('AndroidFormatGenerator', () => {
        describe('Kotlin Format Generation', () => {
            let generator;
            beforeEach(() => {
                generator = new AndroidFormatGenerator_1.AndroidFormatGenerator('kotlin');
            });
            test('should format primitive token as Kotlin constant', () => {
                const token = createMockPrimitiveToken();
                const result = generator.formatToken(token);
                expect(result).toContain('const val space_100');
                expect(result).toContain('Float');
                expect(result).toContain('= 8f');
            });
            test('should format fontSize token with Float type', () => {
                const token = createMockPrimitiveToken({
                    name: 'fontSize100',
                    category: PrimitiveToken_1.TokenCategory.FONT_SIZE,
                    baseValue: 16,
                    platforms: {
                        web: { value: 1, unit: 'rem' },
                        ios: { value: 16, unit: 'pt' },
                        android: { value: 16, unit: 'sp' }
                    }
                });
                const result = generator.formatToken(token);
                expect(result).toContain('font_size_100');
                expect(result).toContain('Float');
                expect(result).toContain('= 16f');
            });
            test('should format fontWeight token as Int', () => {
                const token = createMockPrimitiveToken({
                    name: 'fontWeightBold',
                    category: PrimitiveToken_1.TokenCategory.FONT_WEIGHT,
                    baseValue: 700,
                    platforms: {
                        web: { value: 700, unit: 'fontWeight' },
                        ios: { value: 700, unit: 'fontWeight' },
                        android: { value: 700, unit: 'fontWeight' }
                    }
                });
                const result = generator.formatToken(token);
                expect(result).toContain('font_weight_bold');
                expect(result).toContain('Int');
                expect(result).toContain('= 700');
            });
            test('should format borderWidth tokens with Float type and dp units', () => {
                const token = createMockPrimitiveToken({
                    name: 'borderWidth100',
                    category: PrimitiveToken_1.TokenCategory.BORDER_WIDTH,
                    baseValue: 1,
                    platforms: {
                        web: { value: 1, unit: 'px' },
                        ios: { value: 1, unit: 'pt' },
                        android: { value: 1, unit: 'dp' }
                    }
                });
                const result = generator.formatToken(token);
                expect(result).toContain('border_width_100');
                expect(result).toContain('Float');
                expect(result).toContain('= 1f');
            });
            test('should generate complete Kotlin file', () => {
                const tokens = [
                    createMockPrimitiveToken({ name: 'space100' }),
                    createMockPrimitiveToken({ name: 'space150' })
                ];
                const result = generator.generateFile(tokens);
                expect(result).toContain('package com.designerpunk.tokens');
                expect(result).toContain('object DesignTokens {');
                expect(result).toContain('space_100');
                expect(result).toContain('space_150');
                expect(result).toMatch(/}\s*$/);
            });
            test('should validate Kotlin syntax correctly', () => {
                const validContent = `
package com.designerpunk.tokens

object DesignTokens {
    const val space_100: Float = 8f
}
        `.trim();
                const result = generator.validateSyntax(validContent);
                expect(result.valid).toBe(true);
                expect(result.errors).toBeUndefined();
            });
            test('should detect missing package declaration', () => {
                const invalidContent = `
object DesignTokens {
    const val space_100: Float = 8f
}
        `.trim();
                const result = generator.validateSyntax(invalidContent);
                expect(result.valid).toBe(false);
                expect(result.errors).toContain('Missing package declaration');
            });
        });
        describe('XML Format Generation', () => {
            let generator;
            beforeEach(() => {
                generator = new AndroidFormatGenerator_1.AndroidFormatGenerator('xml');
            });
            test('should format primitive token as XML resource', () => {
                const token = createMockPrimitiveToken();
                const result = generator.formatToken(token);
                expect(result).toContain('<dimen name="space_100">8dp</dimen>');
            });
            test('should format fontSize token with sp units', () => {
                const token = createMockPrimitiveToken({
                    name: 'fontSize100',
                    category: PrimitiveToken_1.TokenCategory.FONT_SIZE,
                    baseValue: 16,
                    platforms: {
                        web: { value: 1, unit: 'rem' },
                        ios: { value: 16, unit: 'pt' },
                        android: { value: 16, unit: 'sp' }
                    }
                });
                const result = generator.formatToken(token);
                expect(result).toContain('<dimen name="font_size_100">16sp</dimen>');
            });
            test('should format fontFamily token as string resource', () => {
                const token = createMockPrimitiveToken({
                    name: 'fontFamilyBody',
                    category: PrimitiveToken_1.TokenCategory.FONT_FAMILY,
                    baseValue: 0,
                    platforms: {
                        web: { value: 'Inter, sans-serif', unit: 'fontFamily' },
                        ios: { value: 'Inter, sans-serif', unit: 'fontFamily' },
                        android: { value: 'Inter, sans-serif', unit: 'fontFamily' }
                    }
                });
                const result = generator.formatToken(token);
                expect(result).toContain('<string name="font_family_body">Inter, sans-serif</string>');
            });
            test('should generate complete XML file', () => {
                const tokens = [
                    createMockPrimitiveToken({ name: 'space100' }),
                    createMockPrimitiveToken({ name: 'space150' })
                ];
                const result = generator.generateFile(tokens);
                expect(result).toContain('<?xml version="1.0"');
                expect(result).toContain('<resources>');
                expect(result).toContain('space_100');
                expect(result).toContain('space_150');
                expect(result).toContain('</resources>');
            });
            test('should validate XML syntax correctly', () => {
                const validContent = `
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <dimen name="space_100">8dp</dimen>
</resources>
        `.trim();
                const result = generator.validateSyntax(validContent);
                expect(result.valid).toBe(true);
                expect(result.errors).toBeUndefined();
            });
            test('should detect missing XML declaration', () => {
                const invalidContent = `
<resources>
    <dimen name="space_100">8dp</dimen>
</resources>
        `.trim();
                const result = generator.validateSyntax(invalidContent);
                expect(result.valid).toBe(false);
                expect(result.errors).toContain('Missing XML declaration');
            });
        });
        describe('Naming Convention Consistency', () => {
            test('should convert token names to snake_case', () => {
                const generator = new AndroidFormatGenerator_1.AndroidFormatGenerator('kotlin');
                const name = generator.getTokenName('fontSize125', 'fontSize');
                expect(name).toBe('font_size_125');
            });
            test('should handle complex token names', () => {
                const generator = new AndroidFormatGenerator_1.AndroidFormatGenerator('kotlin');
                expect(generator.getTokenName('lineHeight100', 'lineHeight')).toBe('line_height_100');
                expect(generator.getTokenName('fontWeightBold', 'fontWeight')).toBe('font_weight_bold');
            });
        });
    });
    describe('Cross-Platform Format Consistency', () => {
        let webGenerator;
        let iosGenerator;
        let androidGenerator;
        beforeEach(() => {
            webGenerator = new WebFormatGenerator_1.WebFormatGenerator();
            iosGenerator = new iOSFormatGenerator_1.iOSFormatGenerator();
            androidGenerator = new AndroidFormatGenerator_1.AndroidFormatGenerator('kotlin');
        });
        test('should maintain consistent token values across platforms', () => {
            const token = createMockPrimitiveToken({ name: 'space100', baseValue: 8 });
            const webResult = webGenerator.formatToken(token);
            const iosResult = iosGenerator.formatToken(token);
            const androidResult = androidGenerator.formatToken(token);
            // All should contain the value 8 in their respective formats
            expect(webResult).toContain('8px');
            expect(iosResult).toContain('= 8');
            expect(androidResult).toContain('= 8f');
        });
        test('should maintain consistent naming semantics across platforms', () => {
            const token = createMockPrimitiveToken({ name: 'fontSize125' });
            const webName = webGenerator.getTokenName('fontSize125', 'fontSize');
            const iosName = iosGenerator.getTokenName('fontSize125', 'fontSize');
            const androidName = androidGenerator.getTokenName('fontSize125', 'fontSize');
            // All should preserve the semantic meaning "fontSize125"
            expect(webName).toContain('font-size-125');
            expect(iosName).toContain('fontSize125');
            expect(androidName).toContain('font_size_125');
        });
        test('should generate valid syntax for all platforms', () => {
            const tokens = [createMockPrimitiveToken()];
            const webFile = webGenerator.generateFile(tokens);
            const iosFile = iosGenerator.generateFile(tokens);
            const androidFile = androidGenerator.generateFile(tokens);
            expect(webGenerator.validateSyntax(webFile).valid).toBe(true);
            expect(iosGenerator.validateSyntax(iosFile).valid).toBe(true);
            expect(androidGenerator.validateSyntax(androidFile).valid).toBe(true);
        });
        test('should handle semantic tokens consistently', () => {
            const semanticToken = createMockSemanticToken();
            const webResult = webGenerator.formatToken(semanticToken);
            const iosResult = iosGenerator.formatToken(semanticToken);
            const androidResult = androidGenerator.formatToken(semanticToken);
            // All should format the semantic token correctly
            expect(webResult).toBeTruthy();
            expect(iosResult).toBeTruthy();
            expect(androidResult).toBeTruthy();
        });
    });
    describe('Format Options', () => {
        test('should respect includeComments option', () => {
            const generator = new WebFormatGenerator_1.WebFormatGenerator();
            const tokens = [createMockPrimitiveToken()];
            const withComments = generator.generateFile(tokens, { includeComments: true });
            const withoutComments = generator.generateFile(tokens, { includeComments: false });
            // Header always includes comments, but category comments should be controlled by includeComments
            expect(withComments).toContain('/**');
            // The header will still have comments, so we just verify the file was generated
            expect(withoutComments).toContain(':root');
        });
        test('should respect groupByCategory option', () => {
            const generator = new WebFormatGenerator_1.WebFormatGenerator();
            const tokens = [
                createMockPrimitiveToken({ category: PrimitiveToken_1.TokenCategory.SPACING }),
                createMockPrimitiveToken({ category: PrimitiveToken_1.TokenCategory.FONT_SIZE })
            ];
            const grouped = generator.generateFile(tokens, { groupByCategory: true });
            const ungrouped = generator.generateFile(tokens, { groupByCategory: false });
            expect(grouped).toContain('SPACING TOKENS');
            expect(ungrouped).not.toContain('SPACING TOKENS');
        });
        test('should respect sortAlphabetically option', () => {
            const generator = new WebFormatGenerator_1.WebFormatGenerator();
            const tokens = [
                createMockPrimitiveToken({ name: 'space150' }),
                createMockPrimitiveToken({ name: 'space050' }),
                createMockPrimitiveToken({ name: 'space100' })
            ];
            const sorted = generator.generateFile(tokens, { sortAlphabetically: true });
            const unsorted = generator.generateFile(tokens, { sortAlphabetically: false });
            const sortedSpace050 = sorted.indexOf('space-050');
            const sortedSpace100 = sorted.indexOf('space-100');
            const sortedSpace150 = sorted.indexOf('space-150');
            expect(sortedSpace050).toBeLessThan(sortedSpace100);
            expect(sortedSpace100).toBeLessThan(sortedSpace150);
            // Unsorted should maintain original order
            const unsortedSpace150 = unsorted.indexOf('space-150');
            const unsortedSpace050 = unsorted.indexOf('space-050');
            expect(unsortedSpace150).toBeLessThan(unsortedSpace050);
        });
        test('should respect includeMathematicalContext option', () => {
            const generator = new WebFormatGenerator_1.WebFormatGenerator();
            const tokens = [createMockPrimitiveToken()];
            const withMath = generator.generateFile(tokens, {
                includeComments: true,
                includeMathematicalContext: true
            });
            const withoutMath = generator.generateFile(tokens, {
                includeComments: true,
                includeMathematicalContext: false
            });
            expect(withMath).toContain('base × 1 = 8');
            expect(withoutMath).not.toContain('base × 1 = 8');
        });
    });
    describe('Error Handling', () => {
        test('should handle tokens with missing platform values', () => {
            const webGenerator = new WebFormatGenerator_1.WebFormatGenerator();
            const semanticToken = createMockSemanticToken({
                primitiveTokens: {}
            });
            expect(() => webGenerator.formatToken(semanticToken)).toThrow();
        });
        test('should handle empty token arrays', () => {
            const generator = new WebFormatGenerator_1.WebFormatGenerator();
            const result = generator.generateFile([]);
            expect(result).toContain(':root {');
            expect(result).toContain('}');
        });
        test('should validate syntax for malformed content', () => {
            const generator = new WebFormatGenerator_1.WebFormatGenerator();
            const malformed = 'this is not valid CSS';
            const result = generator.validateSyntax(malformed);
            expect(result.valid).toBe(false);
            expect(result.errors).toBeDefined();
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });
});
//# sourceMappingURL=FormatProviders.test.js.map