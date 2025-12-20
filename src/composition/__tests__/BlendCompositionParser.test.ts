/**
 * @category evergreen
 * @purpose Verify BlendCompositionParser functionality works correctly
 */
/**
 * Blend Composition Parser Tests
 * 
 * Tests for parsing "color with blend direction" syntax
 */

import { BlendCompositionParser } from '../BlendCompositionParser';
import { PrimitiveTokenRegistry } from '../../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../../registries/SemanticTokenRegistry';
import { TokenCategory } from '../../types/PrimitiveToken';
import { SemanticCategory } from '../../types/SemanticToken';
import { BlendDirection } from '../../tokens/BlendTokens';

describe('BlendCompositionParser', () => {
  let parser: BlendCompositionParser;
  let primitiveRegistry: PrimitiveTokenRegistry;
  let semanticRegistry: SemanticTokenRegistry;

  beforeEach(() => {
    primitiveRegistry = new PrimitiveTokenRegistry();
    semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);

    // Add test color tokens (using baseValue: 0 for color tokens as they're not mathematical)
    primitiveRegistry.register({
      name: 'purple500',
      category: TokenCategory.COLOR,
      baseValue: 0,
      familyBaseValue: 0,
      description: 'Purple 500',
      mathematicalRelationship: 'N/A',
      baselineGridAlignment: false,
      isStrategicFlexibility: false,
      isPrecisionTargeted: false,
      platforms: {
        web: { value: { light: { base: '#A855F7', wcag: '#A855F7' }, dark: { base: '#A855F7', wcag: '#A855F7' } }, unit: 'hex' },
        ios: { value: { light: { base: '#A855F7', wcag: '#A855F7' }, dark: { base: '#A855F7', wcag: '#A855F7' } }, unit: 'hex' },
        android: { value: { light: { base: '#A855F7', wcag: '#A855F7' }, dark: { base: '#A855F7', wcag: '#A855F7' } }, unit: 'hex' }
      }
    });

    primitiveRegistry.register({
      name: 'blue500',
      category: TokenCategory.COLOR,
      baseValue: 0,
      familyBaseValue: 0,
      description: 'Blue 500',
      mathematicalRelationship: 'N/A',
      baselineGridAlignment: false,
      isStrategicFlexibility: false,
      isPrecisionTargeted: false,
      platforms: {
        web: { value: { light: { base: '#3B82F6', wcag: '#3B82F6' }, dark: { base: '#3B82F6', wcag: '#3B82F6' } }, unit: 'hex' },
        ios: { value: { light: { base: '#3B82F6', wcag: '#3B82F6' }, dark: { base: '#3B82F6', wcag: '#3B82F6' } }, unit: 'hex' },
        android: { value: { light: { base: '#3B82F6', wcag: '#3B82F6' }, dark: { base: '#3B82F6', wcag: '#3B82F6' } }, unit: 'hex' }
      }
    });

    // Add test blend tokens
    primitiveRegistry.register({
      name: 'blend200',
      category: TokenCategory.BLEND,
      baseValue: 0.08,
      familyBaseValue: 0.04,
      description: 'Standard modification',
      mathematicalRelationship: 'base × 2 = 0.04 × 2 = 0.08',
      baselineGridAlignment: false,
      isStrategicFlexibility: false,
      isPrecisionTargeted: false,
      platforms: {
        web: { value: 0.08, unit: 'unitless' },
        ios: { value: 0.08, unit: 'unitless' },
        android: { value: 0.08, unit: 'unitless' }
      }
    });

    primitiveRegistry.register({
      name: 'blend300',
      category: TokenCategory.BLEND,
      baseValue: 0.12,
      familyBaseValue: 0.04,
      description: 'Strong modification',
      mathematicalRelationship: 'base × 3 = 0.04 × 3 = 0.12',
      baselineGridAlignment: false,
      isStrategicFlexibility: false,
      isPrecisionTargeted: false,
      platforms: {
        web: { value: 0.12, unit: 'unitless' },
        ios: { value: 0.12, unit: 'unitless' },
        android: { value: 0.12, unit: 'unitless' }
      }
    });

    parser = new BlendCompositionParser(primitiveRegistry, semanticRegistry);
  });

  describe('parse', () => {
    test('parses valid "color with blend darker" composition', () => {
      const result = parser.parse('purple500 with blend200 darker');

      expect(result.valid).toBe(true);
      expect(result.composition).toEqual({
        color: 'purple500',
        blend: 'blend200',
        direction: BlendDirection.DARKER,
        original: 'purple500 with blend200 darker'
      });
    });

    test('parses valid "color with blend lighter" composition', () => {
      const result = parser.parse('blue500 with blend300 lighter');

      expect(result.valid).toBe(true);
      expect(result.composition).toEqual({
        color: 'blue500',
        blend: 'blend300',
        direction: BlendDirection.LIGHTER,
        original: 'blue500 with blend300 lighter'
      });
    });

    test('parses valid "color with blend saturate" composition', () => {
      const result = parser.parse('purple500 with blend200 saturate');

      expect(result.valid).toBe(true);
      expect(result.composition).toEqual({
        color: 'purple500',
        blend: 'blend200',
        direction: BlendDirection.SATURATE,
        original: 'purple500 with blend200 saturate'
      });
    });

    test('parses valid "color with blend desaturate" composition', () => {
      const result = parser.parse('blue500 with blend300 desaturate');

      expect(result.valid).toBe(true);
      expect(result.composition).toEqual({
        color: 'blue500',
        blend: 'blend300',
        direction: BlendDirection.DESATURATE,
        original: 'blue500 with blend300 desaturate'
      });
    });

    test('handles extra whitespace', () => {
      const result = parser.parse('  purple500   with   blend200   darker  ');

      expect(result.valid).toBe(true);
      expect(result.composition?.color).toBe('purple500');
      expect(result.composition?.blend).toBe('blend200');
      expect(result.composition?.direction).toBe(BlendDirection.DARKER);
    });

    test('returns error for missing "with" keyword', () => {
      const result = parser.parse('purple500 blend200 darker');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Expected format: "color with blend direction"');
    });

    test('returns error for multiple "with" keywords', () => {
      const result = parser.parse('purple500 with blend200 with darker');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Expected exactly one "with" keyword');
    });

    test('returns error for invalid blend syntax (missing direction)', () => {
      const result = parser.parse('purple500 with blend200');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid blend syntax');
      expect(result.error).toContain('Expected format: "blendXXX direction"');
    });

    test('returns error for invalid blend syntax (too many parts)', () => {
      const result = parser.parse('purple500 with blend200 darker extra');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid blend syntax');
    });

    test('returns error for invalid color token', () => {
      const result = parser.parse('invalidColor with blend200 darker');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Color token "invalidColor" not found');
    });

    test('returns error for invalid blend token', () => {
      const result = parser.parse('purple500 with invalidBlend darker');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Blend token "invalidBlend" not found');
    });

    test('returns error for invalid direction', () => {
      const result = parser.parse('purple500 with blend200 invalid');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid blend direction "invalid"');
      expect(result.error).toContain('Valid directions: darker, lighter, saturate, desaturate');
    });
  });

  describe('parseOrThrow', () => {
    test('returns composition for valid syntax', () => {
      const composition = parser.parseOrThrow('purple500 with blend200 darker');

      expect(composition.color).toBe('purple500');
      expect(composition.blend).toBe('blend200');
      expect(composition.direction).toBe(BlendDirection.DARKER);
    });

    test('throws error for invalid syntax', () => {
      expect(() => {
        parser.parseOrThrow('invalid syntax');
      }).toThrow('Expected format: "color with blend direction"');
    });

    test('throws error for invalid color token', () => {
      expect(() => {
        parser.parseOrThrow('invalidColor with blend200 darker');
      }).toThrow('Color token "invalidColor" not found');
    });
  });

  describe('isBlendComposition', () => {
    test('returns true for valid blend composition syntax', () => {
      expect(parser.isBlendComposition('purple500 with blend200 darker')).toBe(true);
      expect(parser.isBlendComposition('blue500 with blend300 lighter')).toBe(true);
    });

    test('returns false for missing "with" keyword', () => {
      expect(parser.isBlendComposition('purple500 blend200 darker')).toBe(false);
    });

    test('returns false for invalid blend part (missing direction)', () => {
      expect(parser.isBlendComposition('purple500 with blend200')).toBe(false);
    });

    test('returns false for invalid blend part (too many parts)', () => {
      expect(parser.isBlendComposition('purple500 with blend200 darker extra')).toBe(false);
    });

    test('returns false for multiple "with" keywords', () => {
      expect(parser.isBlendComposition('purple500 with blend200 with darker')).toBe(false);
    });
  });

  describe('semantic token support', () => {
    beforeEach(() => {
      // Add semantic color token
      semanticRegistry.register({
        name: 'colorPrimary',
        primitiveReferences: { default: 'purple500' },
        category: SemanticCategory.COLOR,
        context: 'Primary brand color',
        description: 'Primary color for brand elements'
      });

      // Add semantic blend token
      semanticRegistry.register({
        name: 'blendHoverDarker',
        primitiveReferences: { default: 'blend200' },
        category: SemanticCategory.INTERACTION,
        context: 'Standard hover feedback',
        description: 'Blend for hover states with darkening'
      });
    });

    test('parses composition with semantic color token', () => {
      const result = parser.parse('colorPrimary with blend200 darker');

      expect(result.valid).toBe(true);
      expect(result.composition?.color).toBe('colorPrimary');
    });

    test('parses composition with semantic blend token', () => {
      const result = parser.parse('purple500 with blendHoverDarker darker');

      expect(result.valid).toBe(true);
      expect(result.composition?.blend).toBe('blendHoverDarker');
    });

    test('parses composition with both semantic tokens', () => {
      const result = parser.parse('colorPrimary with blendHoverDarker darker');

      expect(result.valid).toBe(true);
      expect(result.composition?.color).toBe('colorPrimary');
      expect(result.composition?.blend).toBe('blendHoverDarker');
    });
  });

  describe('all blend directions in composition', () => {
    test('darker direction works in composition', () => {
      const result = parser.parse('purple500 with blend200 darker');
      expect(result.valid).toBe(true);
      expect(result.composition?.direction).toBe(BlendDirection.DARKER);
    });

    test('lighter direction works in composition', () => {
      const result = parser.parse('purple500 with blend200 lighter');
      expect(result.valid).toBe(true);
      expect(result.composition?.direction).toBe(BlendDirection.LIGHTER);
    });

    test('saturate direction works in composition', () => {
      const result = parser.parse('purple500 with blend200 saturate');
      expect(result.valid).toBe(true);
      expect(result.composition?.direction).toBe(BlendDirection.SATURATE);
    });

    test('desaturate direction works in composition', () => {
      const result = parser.parse('purple500 with blend200 desaturate');
      expect(result.valid).toBe(true);
      expect(result.composition?.direction).toBe(BlendDirection.DESATURATE);
    });

    test('all directions work with different colors', () => {
      const directions = [
        BlendDirection.DARKER,
        BlendDirection.LIGHTER,
        BlendDirection.SATURATE,
        BlendDirection.DESATURATE
      ];

      directions.forEach(direction => {
        const result = parser.parse(`blue500 with blend300 ${direction}`);
        expect(result.valid).toBe(true);
        expect(result.composition?.direction).toBe(direction);
      });
    });

    test('all directions work with different blend values', () => {
      const result1 = parser.parse('purple500 with blend200 darker');
      const result2 = parser.parse('purple500 with blend300 darker');
      
      expect(result1.valid).toBe(true);
      expect(result2.valid).toBe(true);
      expect(result1.composition?.blend).toBe('blend200');
      expect(result2.composition?.blend).toBe('blend300');
    });
  });

  describe('composition validation', () => {
    test('validates complete composition structure', () => {
      const result = parser.parse('purple500 with blend200 darker');
      
      expect(result.valid).toBe(true);
      expect(result.composition).toBeDefined();
      expect(result.composition).toHaveProperty('color');
      expect(result.composition).toHaveProperty('blend');
      expect(result.composition).toHaveProperty('direction');
      expect(result.composition).toHaveProperty('original');
    });

    test('validates color token exists before blend token', () => {
      const result = parser.parse('invalidColor with blend200 darker');
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Color token "invalidColor" not found');
    });

    test('validates blend token exists after color token', () => {
      const result = parser.parse('purple500 with invalidBlend darker');
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Blend token "invalidBlend" not found');
    });

    test('validates direction is valid after blend token', () => {
      const result = parser.parse('purple500 with blend200 invalidDirection');
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid blend direction "invalidDirection"');
    });

    test('validates all parts of composition together', () => {
      const validResult = parser.parse('purple500 with blend200 darker');
      expect(validResult.valid).toBe(true);

      const invalidColor = parser.parse('invalid with blend200 darker');
      expect(invalidColor.valid).toBe(false);

      const invalidBlend = parser.parse('purple500 with invalid darker');
      expect(invalidBlend.valid).toBe(false);

      const invalidDirection = parser.parse('purple500 with blend200 invalid');
      expect(invalidDirection.valid).toBe(false);
    });

    test('preserves original composition string', () => {
      const original = 'purple500 with blend200 darker';
      const result = parser.parse(original);
      
      expect(result.valid).toBe(true);
      expect(result.composition?.original).toBe(original);
    });

    test('validates composition with semantic tokens', () => {
      semanticRegistry.register({
        name: 'colorPrimary',
        primitiveReferences: { default: 'purple500' },
        category: SemanticCategory.COLOR,
        context: 'Primary brand color',
        description: 'Primary color for brand elements'
      });

      semanticRegistry.register({
        name: 'blendHoverDarker',
        primitiveReferences: { default: 'blend200' },
        category: SemanticCategory.INTERACTION,
        context: 'Standard hover feedback',
        description: 'Blend for hover states with darkening'
      });

      const result = parser.parse('colorPrimary with blendHoverDarker darker');
      
      expect(result.valid).toBe(true);
      expect(result.composition?.color).toBe('colorPrimary');
      expect(result.composition?.blend).toBe('blendHoverDarker');
    });
  });
});
