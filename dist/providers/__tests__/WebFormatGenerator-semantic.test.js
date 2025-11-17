"use strict";
/**
 * WebFormatGenerator Semantic Token Tests
 *
 * Tests for semantic token formatting methods added in task 2.1
 * Tests for opacity generation methods added in task 3.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
const WebFormatGenerator_1 = require("../WebFormatGenerator");
const SemanticToken_1 = require("../../types/SemanticToken");
describe('WebFormatGenerator - Semantic Token Methods', () => {
    describe('formatSingleReferenceToken', () => {
        let generator;
        beforeEach(() => {
            generator = new WebFormatGenerator_1.WebFormatGenerator();
        });
        test('should format single-reference semantic token for CSS', () => {
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
            expect(result).toContain('--color-primary');
            expect(result).toContain('var(--purple-300)');
        });
        test('should handle default key in primitiveReferences', () => {
            const semanticToken = {
                name: 'spacingGroupedNormal',
                primitiveReferences: {
                    default: 'space100'
                },
                category: SemanticToken_1.SemanticCategory.SPACING,
                context: 'Standard grouping spacing',
                description: 'Spacing for elements within the same logical group'
            };
            const result = generator.formatSingleReferenceToken(semanticToken);
            expect(result).toContain('--spacing-grouped-normal');
            expect(result).toContain('var(--space-100)');
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
    });
    describe('formatMultiReferenceToken', () => {
        let generator;
        beforeEach(() => {
            generator = new WebFormatGenerator_1.WebFormatGenerator();
        });
        test('should format multi-reference semantic token for CSS', () => {
            const semanticToken = {
                name: 'typographyBodyMd',
                primitiveReferences: {
                    fontSize: 'fontSize100',
                    lineHeight: 'lineHeight100',
                    fontFamily: 'fontFamilyBody'
                },
                category: SemanticToken_1.SemanticCategory.TYPOGRAPHY,
                context: 'Medium body text',
                description: 'Standard body text for content'
            };
            const result = generator.formatMultiReferenceToken(semanticToken);
            expect(result).toContain('--typography-body-md-font-size');
            expect(result).toContain('var(--font-size-100)');
            expect(result).toContain('--typography-body-md-line-height');
            expect(result).toContain('var(--line-height-100)');
        });
        test('should throw error when no primitive references exist', () => {
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
    });
    describe('generateSectionComment', () => {
        test('should generate primitive section comment for CSS', () => {
            const generator = new WebFormatGenerator_1.WebFormatGenerator();
            const result = generator.generateSectionComment('primitive');
            expect(result).toContain('PRIMITIVE TOKENS');
            expect(result).toContain('Mathematical foundation');
            expect(result).toContain('/*');
            expect(result).toContain('*/');
            expect(result).toContain('============================================');
        });
        test('should generate semantic section comment for CSS', () => {
            const generator = new WebFormatGenerator_1.WebFormatGenerator();
            const result = generator.generateSectionComment('semantic');
            expect(result).toContain('SEMANTIC TOKENS');
            expect(result).toContain('Use these for UI development');
            expect(result).toContain('/*');
            expect(result).toContain('*/');
            expect(result).toContain('============================================');
        });
    });
    describe('Opacity Generation Methods', () => {
        let generator;
        beforeEach(() => {
            generator = new WebFormatGenerator_1.WebFormatGenerator();
        });
        describe('generateOpacityProperty', () => {
            test('should generate CSS opacity property with correct format', () => {
                const result = generator.generateOpacityProperty(0.48);
                expect(result).toBe('opacity: 0.48;');
            });
            test('should handle opacity value of 0', () => {
                const result = generator.generateOpacityProperty(0);
                expect(result).toBe('opacity: 0;');
            });
            test('should handle opacity value of 1', () => {
                const result = generator.generateOpacityProperty(1);
                expect(result).toBe('opacity: 1;');
            });
            test('should handle decimal opacity values', () => {
                const result = generator.generateOpacityProperty(0.08);
                expect(result).toBe('opacity: 0.08;');
            });
        });
        describe('generateRgbaAlpha', () => {
            test('should generate RGBA with alpha channel', () => {
                const result = generator.generateRgbaAlpha(107, 80, 164, 0.48);
                expect(result).toBe('rgba(107, 80, 164, 0.48)');
            });
            test('should handle alpha value of 0', () => {
                const result = generator.generateRgbaAlpha(255, 0, 0, 0);
                expect(result).toBe('rgba(255, 0, 0, 0)');
            });
            test('should handle alpha value of 1', () => {
                const result = generator.generateRgbaAlpha(0, 255, 0, 1);
                expect(result).toBe('rgba(0, 255, 0, 1)');
            });
            test('should handle various RGB and alpha combinations', () => {
                const result = generator.generateRgbaAlpha(0, 0, 0, 0.32);
                expect(result).toBe('rgba(0, 0, 0, 0.32)');
            });
        });
        describe('generateCustomProperty', () => {
            test('should generate CSS custom property with -- prefix', () => {
                const result = generator.generateCustomProperty('opacity600', 0.48);
                expect(result).toBe('--opacity600: 0.48;');
            });
            test('should not duplicate -- prefix if already present', () => {
                const result = generator.generateCustomProperty('--opacity600', 0.48);
                expect(result).toBe('--opacity600: 0.48;');
            });
            test('should handle opacity value of 0', () => {
                const result = generator.generateCustomProperty('opacity000', 0);
                expect(result).toBe('--opacity000: 0;');
            });
            test('should handle opacity value of 1', () => {
                const result = generator.generateCustomProperty('opacity1300', 1);
                expect(result).toBe('--opacity1300: 1;');
            });
            test('should handle decimal opacity values', () => {
                const result = generator.generateCustomProperty('opacity100', 0.08);
                expect(result).toBe('--opacity100: 0.08;');
            });
        });
    });
    describe('Z-Index Token Formatting', () => {
        describe('formatToken with semantic-only z-index tokens', () => {
            let cssGenerator;
            beforeEach(() => {
                cssGenerator = new WebFormatGenerator_1.WebFormatGenerator();
            });
            test('should format z-index token for CSS with correct prefix and kebab-case', () => {
                // Mock z-index token structure (semantic-only with direct value)
                const zIndexToken = {
                    name: 'zIndex.modal',
                    value: 400,
                    platforms: ['web', 'ios'],
                    category: SemanticToken_1.SemanticCategory.LAYERING,
                    context: 'Modal dialogs',
                    description: 'Z-index for modal overlay content'
                };
                const result = cssGenerator.formatToken(zIndexToken);
                expect(result).toContain('--z-index-modal');
                expect(result).toContain('400');
                expect(result).toMatch(/--z-index-modal:\s*400;/);
            });
            test('should format all z-index semantic levels correctly', () => {
                const zIndexTokens = [
                    { name: 'zIndex.container', value: 100 },
                    { name: 'zIndex.navigation', value: 200 },
                    { name: 'zIndex.dropdown', value: 300 },
                    { name: 'zIndex.modal', value: 400 },
                    { name: 'zIndex.toast', value: 500 },
                    { name: 'zIndex.tooltip', value: 600 }
                ];
                zIndexTokens.forEach(token => {
                    const fullToken = {
                        ...token,
                        platforms: ['web', 'ios'],
                        category: SemanticToken_1.SemanticCategory.LAYERING,
                        context: 'Test context',
                        description: 'Test description'
                    };
                    const result = cssGenerator.formatToken(fullToken);
                    // Extract expected name from token name (e.g., 'zIndex.container' -> 'container')
                    const semanticName = token.name.split('.')[1];
                    expect(result).toContain(`--z-index-${semanticName}`);
                    expect(result).toContain(`${token.value}`);
                });
            });
            test('should handle z-index tokens with unitless values', () => {
                const zIndexToken = {
                    name: 'zIndex.navigation',
                    value: 200,
                    platforms: ['web', 'ios'],
                    category: SemanticToken_1.SemanticCategory.LAYERING,
                    context: 'Navigation',
                    description: 'Navigation z-index'
                };
                const result = cssGenerator.formatToken(zIndexToken);
                // Should not add any unit suffix (px, rem, etc.)
                expect(result).toMatch(/--z-index-navigation:\s*200;/);
                expect(result).not.toContain('px');
                expect(result).not.toContain('rem');
            });
        });
    });
});
//# sourceMappingURL=WebFormatGenerator-semantic.test.js.map