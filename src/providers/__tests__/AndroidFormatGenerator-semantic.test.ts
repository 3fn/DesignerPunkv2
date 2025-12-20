/**
 * @category evergreen
 * @purpose Verify Android format generator produces correct platform-specific output
 */
/**
 * AndroidFormatGenerator Semantic Token Tests
 * 
 * Tests for semantic token formatting methods added in task 4.1
 * Tests for opacity generation methods added in task 3.3
 */

import { AndroidFormatGenerator } from '../AndroidFormatGenerator';
import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

describe('AndroidFormatGenerator - Opacity Generation', () => {
  let generator: AndroidFormatGenerator;

  beforeEach(() => {
    generator = new AndroidFormatGenerator('kotlin');
  });

  describe('generateAlphaModifier', () => {
    test('should generate correct Jetpack Compose alpha modifier syntax', () => {
      const result = generator.generateAlphaModifier(0.48);
      expect(result).toBe('Modifier.alpha(0.48f)');
    });

    test('should handle full opacity (1.0)', () => {
      const result = generator.generateAlphaModifier(1.0);
      expect(result).toBe('Modifier.alpha(1.0f)');
    });

    test('should handle full transparency (0.0)', () => {
      const result = generator.generateAlphaModifier(0.0);
      expect(result).toBe('Modifier.alpha(0.0f)');
    });

    test('should handle various opacity values', () => {
      expect(generator.generateAlphaModifier(0.08)).toBe('Modifier.alpha(0.08f)');
      expect(generator.generateAlphaModifier(0.16)).toBe('Modifier.alpha(0.16f)');
      expect(generator.generateAlphaModifier(0.32)).toBe('Modifier.alpha(0.32f)');
      expect(generator.generateAlphaModifier(0.64)).toBe('Modifier.alpha(0.64f)');
      expect(generator.generateAlphaModifier(0.88)).toBe('Modifier.alpha(0.88f)');
    });
  });

  describe('generateColorWithAlpha', () => {
    test('should generate correct Jetpack Compose Color.copy syntax', () => {
      const result = generator.generateColorWithAlpha('0xFF6B50A4', 0.48);
      expect(result).toBe('Color(0xFF6B50A4).copy(alpha = 0.48f)');
    });

    test('should handle full opacity color', () => {
      const result = generator.generateColorWithAlpha('0xFF3B82F6', 1.0);
      expect(result).toBe('Color(0xFF3B82F6).copy(alpha = 1.0f)');
    });

    test('should handle fully transparent color', () => {
      const result = generator.generateColorWithAlpha('0xFFEF4444', 0.0);
      expect(result).toBe('Color(0xFFEF4444).copy(alpha = 0.0f)');
    });

    test('should handle various color and alpha combinations', () => {
      expect(generator.generateColorWithAlpha('0xFF6B50A4', 0.8)).toBe('Color(0xFF6B50A4).copy(alpha = 0.8f)');
      expect(generator.generateColorWithAlpha('0xFF3B82F6', 0.72)).toBe('Color(0xFF3B82F6).copy(alpha = 0.72f)');
      expect(generator.generateColorWithAlpha('0xFFEF4444', 0.48)).toBe('Color(0xFFEF4444).copy(alpha = 0.48f)');
    });
  });

  describe('generateConstant', () => {
    test('should generate correct Kotlin constant syntax', () => {
      const result = generator.generateConstant('opacity600', 0.48);
      expect(result).toBe('const val OPACITY_600 = 0.48f');
    });

    test('should handle full opacity constant', () => {
      const result = generator.generateConstant('opacity1300', 1.0);
      expect(result).toBe('const val OPACITY_1300 = 1.0f');
    });

    test('should handle full transparency constant', () => {
      const result = generator.generateConstant('opacity000', 0.0);
      expect(result).toBe('const val OPACITY_000 = 0.0f');
    });

    test('should convert camelCase to UPPER_SNAKE_CASE', () => {
      expect(generator.generateConstant('opacityDisabled', 0.48)).toBe('const val OPACITY_DISABLED = 0.48f');
      expect(generator.generateConstant('opacityOverlay', 0.32)).toBe('const val OPACITY_OVERLAY = 0.32f');
      expect(generator.generateConstant('opacityHover', 0.08)).toBe('const val OPACITY_HOVER = 0.08f');
    });

    test('should handle various primitive opacity token constants', () => {
      expect(generator.generateConstant('opacity100', 0.08)).toBe('const val OPACITY_100 = 0.08f');
      expect(generator.generateConstant('opacity200', 0.16)).toBe('const val OPACITY_200 = 0.16f');
      expect(generator.generateConstant('opacity400', 0.32)).toBe('const val OPACITY_400 = 0.32f');
      expect(generator.generateConstant('opacity800', 0.64)).toBe('const val OPACITY_800 = 0.64f');
    });

    test('should handle semantic opacity token constants', () => {
      expect(generator.generateConstant('opacityDisabled', 0.48)).toBe('const val OPACITY_DISABLED = 0.48f');
      expect(generator.generateConstant('opacityPressed', 0.16)).toBe('const val OPACITY_PRESSED = 0.16f');
      expect(generator.generateConstant('opacityLoading', 0.16)).toBe('const val OPACITY_LOADING = 0.16f');
    });
  });
});

describe('AndroidFormatGenerator - Single-Reference Token Generation', () => {
  describe('Kotlin Format', () => {
    let generator: AndroidFormatGenerator;

    beforeEach(() => {
      generator = new AndroidFormatGenerator('kotlin');
    });

    describe('formatSingleReferenceToken', () => {
      test('should generate correct Kotlin syntax with primitive reference', () => {
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

        // Verify Kotlin syntax: val color_primary = purple_300 (Android uses snake_case)
        expect(result).toContain('val');
        expect(result).toMatch(/color_primary/);
        expect(result).toMatch(/purple_300/);
        expect(result).toMatch(/val \w+ = \w+/);
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

        // Verify it references the primitive token name (space_100), not a resolved value
        expect(result).toMatch(/space_100/);
        expect(result).not.toMatch(/= \d+f$/); // Should not end with a standalone numeric value
        expect(result).toMatch(/val \w+ = space_100/);
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

        expect(result).toMatch(/border_default/);
        expect(result).toMatch(/border_width_100/);
        expect(result).toMatch(/val \w+ = border_width_100/);
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

        expect(result).toMatch(/color_error/);
        expect(result).toMatch(/red_500/);
        expect(result).toMatch(/val \w+ = red_500/);
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

        expect(result).toMatch(/spacing_related_tight/);
        expect(result).toMatch(/space_050/);
        expect(result).toMatch(/val \w+ = space_050/);
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

        // Dots should be removed from semantic token name
        expect(result).not.toContain('color.primary');
        expect(result).toMatch(/purple_300/);
        expect(result).toMatch(/val \w+primary = purple_300/);
      });
    });

    describe('formatMultiReferenceToken', () => {
      test('should generate Kotlin data class instance with all parameters', () => {
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

        // Verify Kotlin data class initialization syntax
        expect(result).toContain('val');
        expect(result).toMatch(/typography_body_md/);
        expect(result).toContain('Typography(');
        
        // Verify all primitive references are included (with snake_case naming)
        expect(result).toMatch(/fontSize = font_size_100/);
        expect(result).toMatch(/lineHeight = line_height_100/);
        expect(result).toMatch(/fontFamily = font_family_body/);
        expect(result).toMatch(/fontWeight = font_weight_400/);
        expect(result).toMatch(/letterSpacing = letter_spacing_100/);
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
        expect(result).toMatch(/font_size_075/);
        expect(result).toMatch(/line_height_075/);
        expect(result).toMatch(/font_weight_500/);
        expect(result).not.toMatch(/fontSize = \d+f/); // Should not have numeric values
        expect(result).not.toMatch(/lineHeight = \d+f/);
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
        expect(result).toMatch(/fontSize = font_size_200/);
        expect(result).toMatch(/lineHeight = line_height_200/);
        expect(result).toMatch(/fontFamily = font_family_heading/);
        
        // Verify it doesn't include references that weren't provided
        expect(result).not.toContain('fontWeight =');
        expect(result).not.toContain('letterSpacing =');
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
          expect(result).toContain(`${prop} =`);
        });
      });
    });

    describe('generateSectionComment', () => {
      test('should generate primitive section comment for Kotlin', () => {
        const result = generator.generateSectionComment('primitive');

        expect(result).toContain('PRIMITIVE TOKENS');
        expect(result).toContain('Mathematical foundation');
        expect(result).toContain('//');
        expect(result).toContain('============================================');
      });

      test('should generate semantic section comment for Kotlin', () => {
        const result = generator.generateSectionComment('semantic');

        expect(result).toContain('SEMANTIC TOKENS');
        expect(result).toContain('Use these for UI development');
        expect(result).toContain('//');
        expect(result).toContain('============================================');
      });
    });
  });

  describe('XML Format', () => {
    let generator: AndroidFormatGenerator;

    beforeEach(() => {
      generator = new AndroidFormatGenerator('xml');
    });

    describe('formatSingleReferenceToken', () => {
      test('should generate correct XML syntax with primitive reference', () => {
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

        // Verify XML syntax: <color name="color_primary">@color/purple_300</color>
        expect(result).toContain('<color');
        expect(result).toMatch(/name="color_primary"/);
        expect(result).toMatch(/@color\/purple_300/);
        expect(result).toContain('</color>');
      });

      test('should use primitive token name reference, not value', () => {
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

        // Verify it references the primitive token name (@dimen/space_100), not a resolved value
        expect(result).toMatch(/@dimen\/space_100/);
        expect(result).not.toMatch(/>\d+dp</); // Should not contain numeric values with dp
        expect(result).toMatch(/name="spacing_grouped_normal"/);
      });

      test('should handle color semantic tokens in XML', () => {
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

        expect(result).toContain('<color');
        expect(result).toMatch(/name="color_error"/);
        expect(result).toMatch(/@color\/red_500/);
        expect(result).toContain('</color>');
      });

      test('should handle spacing semantic tokens in XML', () => {
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

        expect(result).toContain('<dimen');
        expect(result).toMatch(/name="spacing_related_tight"/);
        expect(result).toMatch(/@dimen\/space_050/);
        expect(result).toContain('</dimen>');
      });
    });

    describe('generateSectionComment', () => {
      test('should generate primitive section comment for XML', () => {
        const result = generator.generateSectionComment('primitive');

        expect(result).toContain('PRIMITIVE TOKENS');
        expect(result).toContain('Mathematical foundation');
        expect(result).toContain('<!--');
        expect(result).toContain('-->');
        expect(result).toContain('============================================');
      });

      test('should generate semantic section comment for XML', () => {
        const result = generator.generateSectionComment('semantic');

        expect(result).toContain('SEMANTIC TOKENS');
        expect(result).toContain('Use these for UI development');
        expect(result).toContain('<!--');
        expect(result).toContain('-->');
        expect(result).toContain('============================================');
      });
    });
  });
});
