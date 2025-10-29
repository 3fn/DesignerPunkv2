"use strict";
/**
 * iOSFormatGenerator Semantic Token Tests
 *
 * Tests for semantic token formatting methods added in task 3.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iOSFormatGenerator_1 = require("../iOSFormatGenerator");
const SemanticToken_1 = require("../../types/SemanticToken");
describe('iOSFormatGenerator - Single-Reference Token Generation', () => {
    let generator;
    beforeEach(() => {
        generator = new iOSFormatGenerator_1.iOSFormatGenerator();
    });
    describe('formatSingleReferenceToken', () => {
        test('should generate correct Swift syntax with primitive reference', () => {
            const semanticToken = {
                name: 'colorPrimary',
                primitiveReferences: {
                    value: 'purple300'
                },
                category: SemanticToken_1.SemanticCategory.COLOR,
                context: 'Primary brand color',
                description: 'Main brand color for primary actions'
            };
            const result = generator.formatSingleReferenceToken(semanticToken);
            // Verify Swift syntax: static let colorPrimary = purple300
            expect(result).toContain('public static let');
            expect(result).toContain('colorPrimary');
            expect(result).toContain('purple300');
            expect(result).toMatch(/public static let colorPrimary = purple300/);
        });
        test('should use primitive token name, not value', () => {
            const semanticToken = {
                name: 'spacingGroupedNormal',
                primitiveReferences: {
                    value: 'space100'
                },
                category: SemanticToken_1.SemanticCategory.SPACING,
                context: 'Standard grouping spacing',
                description: 'Spacing for elements within the same logical group'
            };
            const result = generator.formatSingleReferenceToken(semanticToken);
            // Verify it references the primitive token name (space100), not a resolved value
            expect(result).toContain('space100');
            expect(result).not.toMatch(/= \d+$/); // Should not end with a standalone numeric value
            expect(result).toMatch(/public static let spacingGroupedNormal = space100/);
        });
        test('should handle default key in primitiveReferences', () => {
            const semanticToken = {
                name: 'borderDefault',
                primitiveReferences: {
                    default: 'borderWidth100'
                },
                category: SemanticToken_1.SemanticCategory.BORDER,
                context: 'Default border width',
                description: 'Standard border width for UI elements'
            };
            const result = generator.formatSingleReferenceToken(semanticToken);
            expect(result).toContain('borderDefault');
            expect(result).toContain('borderWidth100');
            expect(result).toMatch(/public static let borderDefault = borderWidth100/);
        });
        test('should handle color semantic tokens', () => {
            const semanticToken = {
                name: 'colorError',
                primitiveReferences: {
                    value: 'red500'
                },
                category: SemanticToken_1.SemanticCategory.COLOR,
                context: 'Error state color',
                description: 'Color for error messages and states'
            };
            const result = generator.formatSingleReferenceToken(semanticToken);
            expect(result).toContain('colorError');
            expect(result).toContain('red500');
            expect(result).toMatch(/public static let colorError = red500/);
        });
        test('should handle spacing semantic tokens', () => {
            const semanticToken = {
                name: 'spacingRelatedTight',
                primitiveReferences: {
                    value: 'space050'
                },
                category: SemanticToken_1.SemanticCategory.SPACING,
                context: 'Tight related spacing',
                description: 'Minimal spacing for closely related elements'
            };
            const result = generator.formatSingleReferenceToken(semanticToken);
            expect(result).toContain('spacingRelatedTight');
            expect(result).toContain('space050');
            expect(result).toMatch(/public static let spacingRelatedTight = space050/);
        });
        test('should throw error when no primitive reference exists', () => {
            const semanticToken = {
                name: 'invalidToken',
                primitiveReferences: {},
                category: SemanticToken_1.SemanticCategory.COLOR,
                context: 'Invalid token',
                description: 'Token with no references'
            };
            expect(() => generator.formatSingleReferenceToken(semanticToken)).toThrow('Semantic token invalidToken has no primitive reference');
        });
        test('should handle tokens with dots in name', () => {
            const semanticToken = {
                name: 'color.primary',
                primitiveReferences: {
                    value: 'purple300'
                },
                category: SemanticToken_1.SemanticCategory.COLOR,
                context: 'Primary brand color',
                description: 'Main brand color for primary actions'
            };
            const result = generator.formatSingleReferenceToken(semanticToken);
            // Dots should be removed from semantic token name (may be lowercased by naming rules)
            expect(result).not.toContain('color.primary');
            expect(result).toContain('purple300');
            // Verify the token name is present (case may vary based on naming rules)
            expect(result).toMatch(/public static let \w+primary = purple300/);
        });
    });
    describe('formatMultiReferenceToken', () => {
        test('should generate Swift struct instance with all parameters', () => {
            const semanticToken = {
                name: 'typographyBodyMd',
                primitiveReferences: {
                    fontSize: 'fontSize100',
                    lineHeight: 'lineHeight100',
                    fontFamily: 'fontFamilyBody',
                    fontWeight: 'fontWeight400',
                    letterSpacing: 'letterSpacing100'
                },
                category: SemanticToken_1.SemanticCategory.TYPOGRAPHY,
                context: 'Medium body text',
                description: 'Standard body text for content'
            };
            const result = generator.formatMultiReferenceToken(semanticToken);
            // Verify Swift struct initialization syntax
            expect(result).toContain('public static let');
            expect(result).toContain('typographyBodyMd');
            expect(result).toContain('Typography(');
            // Verify all primitive references are included
            expect(result).toContain('fontSize: fontSize100');
            expect(result).toContain('lineHeight: lineHeight100');
            expect(result).toContain('fontFamily: fontFamilyBody');
            expect(result).toContain('fontWeight: fontWeight400');
            expect(result).toContain('letterSpacing: letterSpacing100');
        });
        test('should use primitive token names, not values', () => {
            const semanticToken = {
                name: 'typographyLabelSm',
                primitiveReferences: {
                    fontSize: 'fontSize075',
                    lineHeight: 'lineHeight075',
                    fontFamily: 'fontFamilyBody',
                    fontWeight: 'fontWeight500',
                    letterSpacing: 'letterSpacing050'
                },
                category: SemanticToken_1.SemanticCategory.TYPOGRAPHY,
                context: 'Small label text',
                description: 'Label text for small UI elements'
            };
            const result = generator.formatMultiReferenceToken(semanticToken);
            // Verify it references primitive token names, not resolved values
            expect(result).toContain('fontSize075');
            expect(result).toContain('lineHeight075');
            expect(result).toContain('fontWeight500');
            expect(result).not.toMatch(/fontSize: \d+/); // Should not have numeric values
            expect(result).not.toMatch(/lineHeight: \d+/);
        });
        test('should handle partial typography token references', () => {
            const semanticToken = {
                name: 'typographyHeadingLg',
                primitiveReferences: {
                    fontSize: 'fontSize200',
                    lineHeight: 'lineHeight200',
                    fontFamily: 'fontFamilyHeading'
                },
                category: SemanticToken_1.SemanticCategory.TYPOGRAPHY,
                context: 'Large heading text',
                description: 'Heading text for major sections'
            };
            const result = generator.formatMultiReferenceToken(semanticToken);
            // Verify included references
            expect(result).toContain('fontSize: fontSize200');
            expect(result).toContain('lineHeight: lineHeight200');
            expect(result).toContain('fontFamily: fontFamilyHeading');
            // Verify it doesn't include references that weren't provided
            expect(result).not.toContain('fontWeight:');
            expect(result).not.toContain('letterSpacing:');
        });
        test('should throw error when no multi-reference properties exist', () => {
            const semanticToken = {
                name: 'invalidToken',
                primitiveReferences: {
                    value: 'someValue' // Only single-reference key
                },
                category: SemanticToken_1.SemanticCategory.TYPOGRAPHY,
                context: 'Invalid token',
                description: 'Token with no multi-references'
            };
            expect(() => generator.formatMultiReferenceToken(semanticToken)).toThrow('Multi-reference semantic token invalidToken has no primitive references');
        });
        test('should handle all five typography properties', () => {
            const semanticToken = {
                name: 'typographyComplete',
                primitiveReferences: {
                    fontSize: 'fontSize100',
                    lineHeight: 'lineHeight100',
                    fontFamily: 'fontFamilyBody',
                    fontWeight: 'fontWeight400',
                    letterSpacing: 'letterSpacing100'
                },
                category: SemanticToken_1.SemanticCategory.TYPOGRAPHY,
                context: 'Complete typography token',
                description: 'Typography token with all properties'
            };
            const result = generator.formatMultiReferenceToken(semanticToken);
            // Verify all five properties are present
            const properties = ['fontSize', 'lineHeight', 'fontFamily', 'fontWeight', 'letterSpacing'];
            properties.forEach(prop => {
                expect(result).toContain(`${prop}:`);
            });
        });
    });
    describe('generateSectionComment', () => {
        test('should generate primitive section comment', () => {
            const result = generator.generateSectionComment('primitive');
            expect(result).toContain('PRIMITIVE TOKENS');
            expect(result).toContain('Mathematical foundation');
            expect(result).toContain('//');
            expect(result).toContain('============================================');
        });
        test('should generate semantic section comment', () => {
            const result = generator.generateSectionComment('semantic');
            expect(result).toContain('SEMANTIC TOKENS');
            expect(result).toContain('Use these for UI development');
            expect(result).toContain('//');
            expect(result).toContain('============================================');
        });
    });
});
describe('iOSFormatGenerator - Opacity Generation', () => {
    let generator;
    beforeEach(() => {
        generator = new iOSFormatGenerator_1.iOSFormatGenerator();
    });
    describe('generateOpacityModifier', () => {
        test('should generate SwiftUI opacity modifier with correct syntax', () => {
            const result = generator.generateOpacityModifier(0.48);
            expect(result).toBe('.opacity(0.48)');
        });
        test('should handle full opacity (1.0)', () => {
            const result = generator.generateOpacityModifier(1.0);
            expect(result).toBe('.opacity(1)');
        });
        test('should handle full transparency (0.0)', () => {
            const result = generator.generateOpacityModifier(0.0);
            expect(result).toBe('.opacity(0)');
        });
        test('should handle various opacity values', () => {
            expect(generator.generateOpacityModifier(0.08)).toBe('.opacity(0.08)');
            expect(generator.generateOpacityModifier(0.16)).toBe('.opacity(0.16)');
            expect(generator.generateOpacityModifier(0.32)).toBe('.opacity(0.32)');
            expect(generator.generateOpacityModifier(0.64)).toBe('.opacity(0.64)');
            expect(generator.generateOpacityModifier(0.88)).toBe('.opacity(0.88)');
        });
    });
    describe('generateColorWithOpacity', () => {
        test('should generate SwiftUI Color with opacity parameter', () => {
            const result = generator.generateColorWithOpacity(0.42, 0.31, 0.64, 0.48);
            expect(result).toBe('Color(red: 0.42, green: 0.31, blue: 0.64, opacity: 0.48)');
        });
        test('should handle full opacity color', () => {
            const result = generator.generateColorWithOpacity(1.0, 0.0, 0.0, 1.0);
            expect(result).toBe('Color(red: 1, green: 0, blue: 0, opacity: 1)');
        });
        test('should handle fully transparent color', () => {
            const result = generator.generateColorWithOpacity(0.5, 0.5, 0.5, 0.0);
            expect(result).toBe('Color(red: 0.5, green: 0.5, blue: 0.5, opacity: 0)');
        });
        test('should handle various RGB and opacity combinations', () => {
            // Purple with 48% opacity
            expect(generator.generateColorWithOpacity(0.42, 0.31, 0.64, 0.48))
                .toBe('Color(red: 0.42, green: 0.31, blue: 0.64, opacity: 0.48)');
            // Blue with 80% opacity
            expect(generator.generateColorWithOpacity(0.0, 0.5, 1.0, 0.8))
                .toBe('Color(red: 0, green: 0.5, blue: 1, opacity: 0.8)');
            // Black with 32% opacity
            expect(generator.generateColorWithOpacity(0.0, 0.0, 0.0, 0.32))
                .toBe('Color(red: 0, green: 0, blue: 0, opacity: 0.32)');
        });
    });
    describe('generateConstant', () => {
        test('should generate Swift constant with correct syntax', () => {
            const result = generator.generateConstant('opacity600', 0.48);
            expect(result).toBe('static let opacity600 = 0.48');
        });
        test('should handle full opacity constant', () => {
            const result = generator.generateConstant('opacity1300', 1.0);
            expect(result).toBe('static let opacity1300 = 1');
        });
        test('should handle full transparency constant', () => {
            const result = generator.generateConstant('opacity000', 0.0);
            expect(result).toBe('static let opacity000 = 0');
        });
        test('should handle various opacity token constants', () => {
            expect(generator.generateConstant('opacity100', 0.08))
                .toBe('static let opacity100 = 0.08');
            expect(generator.generateConstant('opacity200', 0.16))
                .toBe('static let opacity200 = 0.16');
            expect(generator.generateConstant('opacity400', 0.32))
                .toBe('static let opacity400 = 0.32');
            expect(generator.generateConstant('opacity800', 0.64))
                .toBe('static let opacity800 = 0.64');
            expect(generator.generateConstant('opacity1100', 0.88))
                .toBe('static let opacity1100 = 0.88');
        });
        test('should handle semantic opacity token constants', () => {
            expect(generator.generateConstant('opacityDisabled', 0.48))
                .toBe('static let opacityDisabled = 0.48');
            expect(generator.generateConstant('opacityOverlay', 0.32))
                .toBe('static let opacityOverlay = 0.32');
            expect(generator.generateConstant('opacityHover', 0.08))
                .toBe('static let opacityHover = 0.08');
        });
    });
});
//# sourceMappingURL=iOSFormatGenerator-semantic.test.js.map