/**
 * Opacity Composition Parser Tests
 * 
 * Tests parsing and validation of "color at opacity" composition syntax.
 */

import { OpacityCompositionParser } from '../OpacityCompositionParser';
import { PrimitiveTokenRegistry } from '../../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../../registries/SemanticTokenRegistry';
import { TokenCategory } from '../../types/PrimitiveToken';
import { SemanticCategory } from '../../types/SemanticToken';
import { BlendDirection } from '../../tokens/BlendTokens';
import type { PrimitiveToken } from '../../types/PrimitiveToken';
import type { SemanticToken } from '../../types/SemanticToken';
import type { BlendOpacityComposition } from '../OpacityComposition';

describe('OpacityCompositionParser', () => {
  let parser: OpacityCompositionParser;
  let primitiveRegistry: PrimitiveTokenRegistry;
  let semanticRegistry: SemanticTokenRegistry;

  beforeEach(() => {
    // Create registries
    primitiveRegistry = new PrimitiveTokenRegistry();
    semanticRegistry = new SemanticTokenRegistry(primitiveRegistry);

    // Register test color tokens
    const purple500: PrimitiveToken = {
      name: 'purple500',
      category: TokenCategory.COLOR,
      baseValue: 0, // N/A for color tokens
      familyBaseValue: 0,
      description: 'Purple 500',
      mathematicalRelationship: 'N/A',
      baselineGridAlignment: false,
      isStrategicFlexibility: false,
      isPrecisionTargeted: false,
      platforms: {
        web: { value: '#6B50A4', unit: 'hex' },
        ios: { value: '#6B50A4', unit: 'hex' },
        android: { value: '#6B50A4', unit: 'hex' }
      }
    };

    const black500: PrimitiveToken = {
      name: 'black500',
      category: TokenCategory.COLOR,
      baseValue: 0, // N/A for color tokens
      familyBaseValue: 0,
      description: 'Black 500',
      mathematicalRelationship: 'N/A',
      baselineGridAlignment: false,
      isStrategicFlexibility: false,
      isPrecisionTargeted: false,
      platforms: {
        web: { value: '#000000', unit: 'hex' },
        ios: { value: '#000000', unit: 'hex' },
        android: { value: '#000000', unit: 'hex' }
      }
    };

    primitiveRegistry.register(purple500, { skipValidation: true });
    primitiveRegistry.register(black500, { skipValidation: true });

    // Register test opacity tokens
    const opacity600: PrimitiveToken = {
      name: 'opacity600',
      category: TokenCategory.OPACITY,
      baseValue: 0.48,
      familyBaseValue: 0.08,
      description: 'Opacity 600 - 48%',
      mathematicalRelationship: 'base × 6 = 0.08 × 6 = 0.48',
      baselineGridAlignment: false,
      isStrategicFlexibility: false,
      isPrecisionTargeted: false,
      platforms: {
        web: { value: 0.48, unit: 'unitless' },
        ios: { value: 0.48, unit: 'unitless' },
        android: { value: 0.48, unit: 'unitless' }
      }
    };

    const opacity1000: PrimitiveToken = {
      name: 'opacity1000',
      category: TokenCategory.OPACITY,
      baseValue: 0.80,
      familyBaseValue: 0.08,
      description: 'Opacity 1000 - 80%',
      mathematicalRelationship: 'base × 10 = 0.08 × 10 = 0.80',
      baselineGridAlignment: false,
      isStrategicFlexibility: false,
      isPrecisionTargeted: false,
      platforms: {
        web: { value: 0.80, unit: 'unitless' },
        ios: { value: 0.80, unit: 'unitless' },
        android: { value: 0.80, unit: 'unitless' }
      }
    };

    primitiveRegistry.register(opacity600, { skipValidation: true });
    primitiveRegistry.register(opacity1000, { skipValidation: true });

    // Register semantic opacity token
    const opacityDisabled: SemanticToken = {
      name: 'opacityDisabled',
      primitiveReferences: { default: 'opacity600' },
      category: SemanticCategory.INTERACTION,
      context: 'Disabled UI elements',
      description: 'Opacity for disabled states (48% opacity)'
    };

    semanticRegistry.register(opacityDisabled, { skipValidation: true });

    // Register test blend tokens
    const blend200: PrimitiveToken = {
      name: 'blend200',
      category: TokenCategory.BLEND,
      baseValue: 0.08,
      familyBaseValue: 0.04,
      description: 'Blend 200 - 8%',
      mathematicalRelationship: 'base × 2 = 0.04 × 2 = 0.08',
      baselineGridAlignment: false,
      isStrategicFlexibility: false,
      isPrecisionTargeted: false,
      platforms: {
        web: { value: 0.08, unit: 'unitless' },
        ios: { value: 0.08, unit: 'unitless' },
        android: { value: 0.08, unit: 'unitless' }
      }
    };

    const blend300: PrimitiveToken = {
      name: 'blend300',
      category: TokenCategory.BLEND,
      baseValue: 0.12,
      familyBaseValue: 0.04,
      description: 'Blend 300 - 12%',
      mathematicalRelationship: 'base × 3 = 0.04 × 3 = 0.12',
      baselineGridAlignment: false,
      isStrategicFlexibility: false,
      isPrecisionTargeted: false,
      platforms: {
        web: { value: 0.12, unit: 'unitless' },
        ios: { value: 0.12, unit: 'unitless' },
        android: { value: 0.12, unit: 'unitless' }
      }
    };

    primitiveRegistry.register(blend200, { skipValidation: true });
    primitiveRegistry.register(blend300, { skipValidation: true });

    // Create parser
    parser = new OpacityCompositionParser(primitiveRegistry, semanticRegistry);
  });

  describe('parse()', () => {
    describe('Valid Compositions', () => {
      test('parses simple "color at opacity" composition', () => {
        const result = parser.parse('purple500 at opacity600');
        
        expect(result.valid).toBe(true);
        expect(result.composition).toBeDefined();
        expect(result.composition?.color).toBe('purple500');
        expect(result.composition?.opacity).toBe('opacity600');
        expect(result.composition?.original).toBe('purple500 at opacity600');
      });

      test('parses composition with semantic opacity token', () => {
        const result = parser.parse('black500 at opacityDisabled');
        
        expect(result.valid).toBe(true);
        expect(result.composition).toBeDefined();
        expect(result.composition?.color).toBe('black500');
        expect(result.composition?.opacity).toBe('opacityDisabled');
      });

      test('handles extra whitespace', () => {
        const result = parser.parse('  purple500   at   opacity1000  ');
        
        expect(result.valid).toBe(true);
        expect(result.composition?.color).toBe('purple500');
        expect(result.composition?.opacity).toBe('opacity1000');
      });
    });

    describe('Invalid Syntax', () => {
      test('rejects composition without "at" keyword', () => {
        const result = parser.parse('purple500 opacity600');
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid composition syntax');
        expect(result.error).toContain('Expected format: "color at opacity"');
      });

      test('rejects composition with multiple "at" keywords', () => {
        const result = parser.parse('purple500 at opacity600 at opacity1000');
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Expected exactly one "at" keyword');
      });

      test('rejects empty string', () => {
        const result = parser.parse('');
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid composition syntax');
      });
    });

    describe('Invalid Token References', () => {
      test('rejects non-existent color token', () => {
        const result = parser.parse('invalidColor at opacity600');
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Color token "invalidColor" not found');
      });

      test('rejects non-existent opacity token', () => {
        const result = parser.parse('purple500 at invalidOpacity');
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Opacity token "invalidOpacity" not found');
      });

      test('rejects both invalid tokens', () => {
        const result = parser.parse('invalidColor at invalidOpacity');
        
        expect(result.valid).toBe(false);
        // Should fail on color first
        expect(result.error).toContain('Color token "invalidColor" not found');
      });
    });
  });

  describe('parseOrThrow()', () => {
    test('returns composition for valid input', () => {
      const composition = parser.parseOrThrow('purple500 at opacity600');
      
      expect(composition.color).toBe('purple500');
      expect(composition.opacity).toBe('opacity600');
      expect(composition.original).toBe('purple500 at opacity600');
    });

    test('throws error for invalid syntax', () => {
      expect(() => {
        parser.parseOrThrow('purple500 opacity600');
      }).toThrow('Invalid composition syntax');
    });

    test('throws error for invalid color token', () => {
      expect(() => {
        parser.parseOrThrow('invalidColor at opacity600');
      }).toThrow('Color token "invalidColor" not found');
    });

    test('throws error for invalid opacity token', () => {
      expect(() => {
        parser.parseOrThrow('purple500 at invalidOpacity');
      }).toThrow('Opacity token "invalidOpacity" not found');
    });
  });

  describe('isOpacityComposition()', () => {
    test('returns true for valid composition syntax', () => {
      expect(parser.isOpacityComposition('purple500 at opacity600')).toBe(true);
      expect(parser.isOpacityComposition('color at opacity')).toBe(true);
      expect(parser.isOpacityComposition('  a  at  b  ')).toBe(true);
    });

    test('returns false for invalid syntax', () => {
      expect(parser.isOpacityComposition('purple500 opacity600')).toBe(false);
      expect(parser.isOpacityComposition('purple500')).toBe(false);
      expect(parser.isOpacityComposition('')).toBe(false);
      expect(parser.isOpacityComposition('at')).toBe(false);
    });

    test('returns false for multiple "at" keywords', () => {
      expect(parser.isOpacityComposition('a at b at c')).toBe(false);
    });

    test('does not validate token existence', () => {
      // Should return true even if tokens don't exist
      expect(parser.isOpacityComposition('invalid at invalid')).toBe(true);
    });
  });

  describe('Integration with Registries', () => {
    test('validates against primitive color tokens', () => {
      const result = parser.parse('purple500 at opacity600');
      expect(result.valid).toBe(true);
    });

    test('validates against semantic opacity tokens', () => {
      const result = parser.parse('black500 at opacityDisabled');
      expect(result.valid).toBe(true);
    });

    test('rejects non-color primitive tokens', () => {
      // Register a spacing token
      const space100: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Space 100',
        mathematicalRelationship: 'base × 1 = 8 × 1 = 8',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };
      primitiveRegistry.register(space100, { skipValidation: true });

      const result = parser.parse('space100 at opacity600');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Color token "space100" not found');
    });

    test('rejects non-opacity primitive tokens', () => {
      // Register a spacing token
      const space100: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Space 100',
        mathematicalRelationship: 'base × 1 = 8 × 1 = 8',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };
      primitiveRegistry.register(space100, { skipValidation: true });

      const result = parser.parse('purple500 at space100');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Opacity token "space100" not found');
    });
  });

  describe('Blend + Opacity Composition', () => {
    describe('Valid Blend + Opacity Compositions', () => {
      test('parses "color with blend direction at opacity" composition', () => {
        const result = parser.parse('purple500 with blend200 darker at opacity600');
        
        expect(result.valid).toBe(true);
        expect(result.composition).toBeDefined();
        
        const composition = result.composition as BlendOpacityComposition;
        expect(composition.color).toBe('purple500');
        expect(composition.blend).toBe('blend200');
        expect(composition.blendDirection).toBe('darker');
        expect(composition.opacity).toBe('opacity600');
        expect(composition.original).toBe('purple500 with blend200 darker at opacity600');
      });

      test('parses composition with "lighter" direction', () => {
        const result = parser.parse('black500 with blend300 lighter at opacity1000');
        
        expect(result.valid).toBe(true);
        const composition = result.composition as BlendOpacityComposition;
        expect(composition.color).toBe('black500');
        expect(composition.blend).toBe('blend300');
        expect(composition.blendDirection).toBe('lighter');
        expect(composition.opacity).toBe('opacity1000');
      });

      test('parses composition with "saturate" direction', () => {
        const result = parser.parse('purple500 with blend200 saturate at opacity600');
        
        expect(result.valid).toBe(true);
        const composition = result.composition as BlendOpacityComposition;
        expect(composition.blendDirection).toBe('saturate');
      });

      test('parses composition with "desaturate" direction', () => {
        const result = parser.parse('purple500 with blend200 desaturate at opacity600');
        
        expect(result.valid).toBe(true);
        const composition = result.composition as BlendOpacityComposition;
        expect(composition.blendDirection).toBe('desaturate');
      });

      test('handles extra whitespace in blend composition', () => {
        const result = parser.parse('  purple500   with   blend200   darker   at   opacity600  ');
        
        expect(result.valid).toBe(true);
        const composition = result.composition as BlendOpacityComposition;
        expect(composition.color).toBe('purple500');
        expect(composition.blend).toBe('blend200');
        expect(composition.blendDirection).toBe('darker');
        expect(composition.opacity).toBe('opacity600');
      });

      test('parses composition with semantic opacity token', () => {
        const result = parser.parse('purple500 with blend200 darker at opacityDisabled');
        
        expect(result.valid).toBe(true);
        const composition = result.composition as BlendOpacityComposition;
        expect(composition.opacity).toBe('opacityDisabled');
      });
    });

    describe('Invalid Blend + Opacity Syntax', () => {
      test('rejects composition without "at" keyword', () => {
        const result = parser.parse('purple500 with blend200 darker opacity600');
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid composition syntax');
      });

      test('rejects composition without "with" keyword', () => {
        const result = parser.parse('purple500 blend200 darker at opacity600');
        
        expect(result.valid).toBe(false);
        // Without "with", it's parsed as simple composition where "purple500 blend200 darker" is treated as color
        expect(result.error).toContain('Color token "purple500 blend200 darker" not found');
      });

      test('rejects composition with multiple "with" keywords', () => {
        const result = parser.parse('purple500 with blend200 with darker at opacity600');
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Expected exactly one "with" keyword');
      });

      test('rejects composition with multiple "at" keywords', () => {
        const result = parser.parse('purple500 with blend200 darker at opacity600 at opacity1000');
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Expected exactly one "at" keyword');
      });

      test('rejects composition without blend direction', () => {
        const result = parser.parse('purple500 with blend200 at opacity600');
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid blend syntax');
        expect(result.error).toContain('Expected format: "blendXXX direction"');
      });

      test('rejects composition with too many blend parts', () => {
        const result = parser.parse('purple500 with blend200 darker extra at opacity600');
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid blend syntax');
      });
    });

    describe('Invalid Blend + Opacity Token References', () => {
      test('rejects non-existent color token', () => {
        const result = parser.parse('invalidColor with blend200 darker at opacity600');
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Color token "invalidColor" not found');
      });

      test('rejects non-existent blend token', () => {
        const result = parser.parse('purple500 with invalidBlend darker at opacity600');
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Blend token "invalidBlend" not found');
      });

      test('rejects invalid blend direction', () => {
        const result = parser.parse('purple500 with blend200 invalid at opacity600');
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid blend direction "invalid"');
        expect(result.error).toContain('Valid directions: darker, lighter, saturate, desaturate');
      });

      test('rejects non-existent opacity token', () => {
        const result = parser.parse('purple500 with blend200 darker at invalidOpacity');
        
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Opacity token "invalidOpacity" not found');
      });
    });

    describe('Order Enforcement: Blend First, Then Opacity', () => {
      test('enforces correct order in syntax', () => {
        // Correct order: color with blend direction at opacity
        const result = parser.parse('purple500 with blend200 darker at opacity600');
        expect(result.valid).toBe(true);
      });

      test('syntax enforces blend before opacity', () => {
        // The syntax "with...at" enforces the order
        // There's no way to express opacity before blend in this syntax
        const result = parser.parse('purple500 with blend200 darker at opacity600');
        
        expect(result.valid).toBe(true);
        const composition = result.composition as BlendOpacityComposition;
        
        // Verify the structure reflects the order
        expect(composition).toHaveProperty('color');
        expect(composition).toHaveProperty('blend');
        expect(composition).toHaveProperty('blendDirection');
        expect(composition).toHaveProperty('opacity');
      });
    });
  });

  describe('isBlendOpacityComposition()', () => {
    test('returns true for valid blend + opacity composition syntax', () => {
      expect(parser.isBlendOpacityComposition('purple500 with blend200 darker at opacity600')).toBe(true);
      expect(parser.isBlendOpacityComposition('color with blend direction at opacity')).toBe(true);
      expect(parser.isBlendOpacityComposition('  a  with  b  c  at  d  ')).toBe(true);
    });

    test('returns false for simple opacity composition', () => {
      expect(parser.isBlendOpacityComposition('purple500 at opacity600')).toBe(false);
    });

    test('returns false for invalid syntax', () => {
      expect(parser.isBlendOpacityComposition('purple500 with blend200')).toBe(false);
      expect(parser.isBlendOpacityComposition('purple500 at opacity600')).toBe(false);
      expect(parser.isBlendOpacityComposition('')).toBe(false);
    });

    test('does not validate token existence', () => {
      // Should return true even if tokens don't exist
      expect(parser.isBlendOpacityComposition('invalid with invalid invalid at invalid')).toBe(true);
    });
  });
});
