/**
 * WebFormatGenerator Semantic Token Tests
 * 
 * Tests for semantic token formatting methods added in task 2.1
 * Tests for opacity generation methods added in task 3.1
 */

import { WebFormatGenerator } from '../WebFormatGenerator';
import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

describe('WebFormatGenerator - Semantic Token Methods', () => {
  describe('formatSingleReferenceToken', () => {
    let generator: WebFormatGenerator;

    beforeEach(() => {
      generator = new WebFormatGenerator('javascript');
    });

    test('should format single-reference semantic token for JavaScript', () => {
      const semanticToken: SemanticToken = {
        name: 'colorPrimary',
        primitiveReferences: {
          value: 'purple300'
        },
        category: SemanticCategory.COLOR,
        context: 'Primary brand color',
        description: 'Main brand color for primary actions'
      };

      const result = generator.formatSingleReferenceToken(semanticToken);

      expect(result).toContain('colorPrimary');
      expect(result).toContain('purple300');
      expect(result).toMatch(/colorPrimary:\s*purple300/);
    });

    test('should format single-reference semantic token for CSS', () => {
      const cssGenerator = new WebFormatGenerator('css');
      const semanticToken: SemanticToken = {
        name: 'colorPrimary',
        primitiveReferences: {
          value: 'purple300'
        },
        category: SemanticCategory.COLOR,
        context: 'Primary brand color',
        description: 'Main brand color for primary actions'
      };

      const result = cssGenerator.formatSingleReferenceToken(semanticToken);

      expect(result).toContain('--color-primary');
      expect(result).toContain('var(--purple-300)');
    });

    test('should handle default key in primitiveReferences', () => {
      const semanticToken: SemanticToken = {
        name: 'spacingGroupedNormal',
        primitiveReferences: {
          default: 'space100'
        },
        category: SemanticCategory.SPACING,
        context: 'Standard grouping spacing',
        description: 'Spacing for elements within the same logical group'
      };

      const result = generator.formatSingleReferenceToken(semanticToken);

      expect(result).toContain('spacingGroupedNormal');
      expect(result).toContain('space100');
    });

    test('should throw error when no primitive reference exists', () => {
      const semanticToken: SemanticToken = {
        name: 'invalidToken',
        primitiveReferences: {},
        category: SemanticCategory.COLOR,
        context: 'Invalid token',
        description: 'Token with no references'
      };

      expect(() => generator.formatSingleReferenceToken(semanticToken)).toThrow(
        'Semantic token invalidToken has no primitive reference'
      );
    });
  });

  describe('formatMultiReferenceToken', () => {
    let generator: WebFormatGenerator;

    beforeEach(() => {
      generator = new WebFormatGenerator('javascript');
    });

    test('should format multi-reference semantic token for JavaScript', () => {
      const semanticToken: SemanticToken = {
        name: 'typographyBodyMd',
        primitiveReferences: {
          fontSize: 'fontSize100',
          lineHeight: 'lineHeight100',
          fontFamily: 'fontFamilyBody',
          fontWeight: 'fontWeight400',
          letterSpacing: 'letterSpacing100'
        },
        category: SemanticCategory.TYPOGRAPHY,
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
      const cssGenerator = new WebFormatGenerator('css');
      const semanticToken: SemanticToken = {
        name: 'typographyBodyMd',
        primitiveReferences: {
          fontSize: 'fontSize100',
          lineHeight: 'lineHeight100',
          fontFamily: 'fontFamilyBody'
        },
        category: SemanticCategory.TYPOGRAPHY,
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
      const semanticToken: SemanticToken = {
        name: 'invalidToken',
        primitiveReferences: {
          value: 'someValue' // Only single-reference key
        },
        category: SemanticCategory.TYPOGRAPHY,
        context: 'Invalid token',
        description: 'Token with no multi-references'
      };

      expect(() => generator.formatMultiReferenceToken(semanticToken)).toThrow(
        'Multi-reference semantic token invalidToken has no primitive references'
      );
    });
  });

  describe('generateSectionComment', () => {
    test('should generate primitive section comment for JavaScript', () => {
      const generator = new WebFormatGenerator('javascript');
      const result = generator.generateSectionComment('primitive');

      expect(result).toContain('PRIMITIVE TOKENS');
      expect(result).toContain('Mathematical foundation');
      expect(result).toContain('//');
      expect(result).toContain('============================================');
    });

    test('should generate semantic section comment for JavaScript', () => {
      const generator = new WebFormatGenerator('javascript');
      const result = generator.generateSectionComment('semantic');

      expect(result).toContain('SEMANTIC TOKENS');
      expect(result).toContain('Use these for UI development');
      expect(result).toContain('//');
      expect(result).toContain('============================================');
    });

    test('should generate primitive section comment for CSS', () => {
      const generator = new WebFormatGenerator('css');
      const result = generator.generateSectionComment('primitive');

      expect(result).toContain('PRIMITIVE TOKENS');
      expect(result).toContain('Mathematical foundation');
      expect(result).toContain('/*');
      expect(result).toContain('*/');
      expect(result).toContain('============================================');
    });

    test('should generate semantic section comment for CSS', () => {
      const generator = new WebFormatGenerator('css');
      const result = generator.generateSectionComment('semantic');

      expect(result).toContain('SEMANTIC TOKENS');
      expect(result).toContain('Use these for UI development');
      expect(result).toContain('/*');
      expect(result).toContain('*/');
      expect(result).toContain('============================================');
    });
  });

  describe('Opacity Generation Methods', () => {
    let generator: WebFormatGenerator;

    beforeEach(() => {
      generator = new WebFormatGenerator('css');
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
});
