/**
 * iOSFormatGenerator Semantic Token Tests
 * 
 * Tests for semantic token formatting methods added in task 3.1
 */

import { iOSFormatGenerator } from '../iOSFormatGenerator';
import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

describe('iOSFormatGenerator - Single-Reference Token Generation', () => {
  let generator: iOSFormatGenerator;

  beforeEach(() => {
    generator = new iOSFormatGenerator();
  });

  describe('formatSingleReferenceToken', () => {
    test('should generate correct Swift syntax with primitive reference', () => {
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

      // Verify Swift syntax: static let colorPrimary = purple300
      expect(result).toContain('public static let');
      expect(result).toContain('colorPrimary');
      expect(result).toContain('purple300');
      expect(result).toMatch(/public static let colorPrimary = purple300/);
    });

    test('should use primitive token name, not value', () => {
      const semanticToken: SemanticToken = {
        name: 'spacingGroupedNormal',
        primitiveReferences: {
          value: 'space100'
        },
        category: SemanticCategory.SPACING,
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
      const semanticToken: SemanticToken = {
        name: 'borderDefault',
        primitiveReferences: {
          default: 'borderWidth100'
        },
        category: SemanticCategory.BORDER,
        context: 'Default border width',
        description: 'Standard border width for UI elements'
      };

      const result = generator.formatSingleReferenceToken(semanticToken);

      expect(result).toContain('borderDefault');
      expect(result).toContain('borderWidth100');
      expect(result).toMatch(/public static let borderDefault = borderWidth100/);
    });

    test('should handle color semantic tokens', () => {
      const semanticToken: SemanticToken = {
        name: 'colorError',
        primitiveReferences: {
          value: 'red500'
        },
        category: SemanticCategory.COLOR,
        context: 'Error state color',
        description: 'Color for error messages and states'
      };

      const result = generator.formatSingleReferenceToken(semanticToken);

      expect(result).toContain('colorError');
      expect(result).toContain('red500');
      expect(result).toMatch(/public static let colorError = red500/);
    });

    test('should handle spacing semantic tokens', () => {
      const semanticToken: SemanticToken = {
        name: 'spacingRelatedTight',
        primitiveReferences: {
          value: 'space050'
        },
        category: SemanticCategory.SPACING,
        context: 'Tight related spacing',
        description: 'Minimal spacing for closely related elements'
      };

      const result = generator.formatSingleReferenceToken(semanticToken);

      expect(result).toContain('spacingRelatedTight');
      expect(result).toContain('space050');
      expect(result).toMatch(/public static let spacingRelatedTight = space050/);
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

    test('should handle tokens with dots in name', () => {
      const semanticToken: SemanticToken = {
        name: 'color.primary',
        primitiveReferences: {
          value: 'purple300'
        },
        category: SemanticCategory.COLOR,
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
      const semanticToken: SemanticToken = {
        name: 'typographyLabelSm',
        primitiveReferences: {
          fontSize: 'fontSize075',
          lineHeight: 'lineHeight075',
          fontFamily: 'fontFamilyBody',
          fontWeight: 'fontWeight500',
          letterSpacing: 'letterSpacing050'
        },
        category: SemanticCategory.TYPOGRAPHY,
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
      const semanticToken: SemanticToken = {
        name: 'typographyHeadingLg',
        primitiveReferences: {
          fontSize: 'fontSize200',
          lineHeight: 'lineHeight200',
          fontFamily: 'fontFamilyHeading'
        },
        category: SemanticCategory.TYPOGRAPHY,
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

    test('should handle all five typography properties', () => {
      const semanticToken: SemanticToken = {
        name: 'typographyComplete',
        primitiveReferences: {
          fontSize: 'fontSize100',
          lineHeight: 'lineHeight100',
          fontFamily: 'fontFamilyBody',
          fontWeight: 'fontWeight400',
          letterSpacing: 'letterSpacing100'
        },
        category: SemanticCategory.TYPOGRAPHY,
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
