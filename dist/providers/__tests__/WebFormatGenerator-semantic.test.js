"use strict";
/**
 * WebFormatGenerator Semantic Token Tests
 *
 * Tests for semantic token formatting methods added in task 2.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
const WebFormatGenerator_1 = require("../WebFormatGenerator");
const SemanticToken_1 = require("../../types/SemanticToken");
describe('WebFormatGenerator - Semantic Token Methods', () => {
    describe('formatSingleReferenceToken', () => {
        let generator;
        beforeEach(() => {
            generator = new WebFormatGenerator_1.WebFormatGenerator('javascript');
        });
        test('should format single-reference semantic token for JavaScript', () => {
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
            expect(result).toContain('colorPrimary');
            expect(result).toContain('purple300');
            expect(result).toMatch(/colorPrimary:\s*purple300/);
        });
        test('should format single-reference semantic token for CSS', () => {
            const cssGenerator = new WebFormatGenerator_1.WebFormatGenerator('css');
            const semanticToken = {
                name: 'colorPrimary',
                primitiveReferences: {
                    value: 'purple300'
                },
                category: SemanticToken_1.SemanticCategory.COLOR,
                context: 'Primary brand color',
                description: 'Main brand color for primary actions'
            };
            const result = cssGenerator.formatSingleReferenceToken(semanticToken);
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
            expect(result).toContain('spacingGroupedNormal');
            expect(result).toContain('space100');
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
            generator = new WebFormatGenerator_1.WebFormatGenerator('javascript');
        });
        test('should format multi-reference semantic token for JavaScript', () => {
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
            expect(result).toContain('typographyBodyMd');
            expect(result).toContain('fontSize: fontSize100');
            expect(result).toContain('lineHeight: lineHeight100');
            expect(result).toContain('fontFamily: fontFamilyBody');
            expect(result).toContain('fontWeight: fontWeight400');
            expect(result).toContain('letterSpacing: letterSpacing100');
        });
        test('should format multi-reference semantic token for CSS', () => {
            const cssGenerator = new WebFormatGenerator_1.WebFormatGenerator('css');
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
            const result = cssGenerator.formatMultiReferenceToken(semanticToken);
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
        test('should generate primitive section comment for JavaScript', () => {
            const generator = new WebFormatGenerator_1.WebFormatGenerator('javascript');
            const result = generator.generateSectionComment('primitive');
            expect(result).toContain('PRIMITIVE TOKENS');
            expect(result).toContain('Mathematical foundation');
            expect(result).toContain('//');
            expect(result).toContain('============================================');
        });
        test('should generate semantic section comment for JavaScript', () => {
            const generator = new WebFormatGenerator_1.WebFormatGenerator('javascript');
            const result = generator.generateSectionComment('semantic');
            expect(result).toContain('SEMANTIC TOKENS');
            expect(result).toContain('Use these for UI development');
            expect(result).toContain('//');
            expect(result).toContain('============================================');
        });
        test('should generate primitive section comment for CSS', () => {
            const generator = new WebFormatGenerator_1.WebFormatGenerator('css');
            const result = generator.generateSectionComment('primitive');
            expect(result).toContain('PRIMITIVE TOKENS');
            expect(result).toContain('Mathematical foundation');
            expect(result).toContain('/*');
            expect(result).toContain('*/');
            expect(result).toContain('============================================');
        });
        test('should generate semantic section comment for CSS', () => {
            const generator = new WebFormatGenerator_1.WebFormatGenerator('css');
            const result = generator.generateSectionComment('semantic');
            expect(result).toContain('SEMANTIC TOKENS');
            expect(result).toContain('Use these for UI development');
            expect(result).toContain('/*');
            expect(result).toContain('*/');
            expect(result).toContain('============================================');
        });
    });
});
//# sourceMappingURL=WebFormatGenerator-semantic.test.js.map