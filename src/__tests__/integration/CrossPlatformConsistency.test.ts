/**
 * Cross-Platform Consistency Integration Tests
 * 
 * Tests mathematical consistency and proportional relationships across
 * web, iOS, and Android platforms to ensure near-identical visual results.
 */

import { TokenEngine } from '../../TokenEngine';
import { TokenCategory } from '../../types';
import type { PrimitiveToken } from '../../types';

describe('Cross-Platform Consistency Integration', () => {
  let engine: TokenEngine;

  beforeEach(() => {
    engine = new TokenEngine({
      autoValidate: true,
      enableCrossPlatformValidation: true,
      strategicFlexibilityThreshold: 0.8
    });
  });

  describe('Platform Unit Conversion Consistency', () => {
    it('should maintain proportional relationships across platforms', () => {
      const tokens: PrimitiveToken[] = [
        {
          name: 'space100',
          category: TokenCategory.SPACING,
          baseValue: 8,
          familyBaseValue: 8,
          description: 'Base spacing',
          mathematicalRelationship: 'base',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8, unit: 'px' },
            ios: { value: 8, unit: 'pt' },
            android: { value: 8, unit: 'dp' }
          }
        },
        {
          name: 'space200',
          category: TokenCategory.SPACING,
          baseValue: 16,
          familyBaseValue: 8,
          description: 'Double spacing',
          mathematicalRelationship: 'base × 2',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 16, unit: 'px' },
            ios: { value: 16, unit: 'pt' },
            android: { value: 16, unit: 'dp' }
          }
        }
      ];

      engine.registerPrimitiveTokens(tokens);

      const space100 = engine.getPrimitiveToken('space100')!;
      const space200 = engine.getPrimitiveToken('space200')!;

      // Verify proportional relationships maintained across platforms
      expect((space200.platforms.web.value as number) / (space100.platforms.web.value as number)).toBe(2);
      expect((space200.platforms.ios.value as number) / (space100.platforms.ios.value as number)).toBe(2);
      expect((space200.platforms.android.value as number) / (space100.platforms.android.value as number)).toBe(2);
    });

    it('should validate cross-platform consistency for spacing tokens', () => {
      const tokens: PrimitiveToken[] = [
        {
          name: 'space100',
          category: TokenCategory.SPACING,
          baseValue: 8,
          familyBaseValue: 8,
          description: 'Base spacing',
          mathematicalRelationship: 'base',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8, unit: 'px' },
            ios: { value: 8, unit: 'pt' },
            android: { value: 8, unit: 'dp' }
          }
        },
        {
          name: 'space300',
          category: TokenCategory.SPACING,
          baseValue: 24,
          familyBaseValue: 8,
          description: 'Triple spacing',
          mathematicalRelationship: 'base × 3',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 24, unit: 'px' },
            ios: { value: 24, unit: 'pt' },
            android: { value: 24, unit: 'dp' }
          }
        }
      ];

      engine.registerPrimitiveTokens(tokens);

      const validationResults = engine.validateCrossPlatformConsistency();
      
      // Should have no errors for consistent tokens
      const errors = validationResults.filter(r => r.level === 'Error');
      expect(errors).toHaveLength(0);
    });

    it('should handle typography tokens with REM conversion on web', () => {
      const token: PrimitiveToken = {
        name: 'fontSize100',
        category: TokenCategory.FONT_SIZE,
        baseValue: 16,
        familyBaseValue: 16,
        description: 'Base font size',
        mathematicalRelationship: 'base',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 1, unit: 'rem' }, // 16px ÷ 16 = 1rem
          ios: { value: 16, unit: 'pt' },
          android: { value: 16, unit: 'sp' }
        }
      };

      const result = engine.registerPrimitiveToken(token);
      expect(result.level).toBe('Pass');

      // Verify mathematical equivalence
      const registered = engine.getPrimitiveToken('fontSize100')!;
      expect((registered.platforms.web.value as number) * 16).toBe(registered.platforms.ios.value);
      expect(registered.platforms.ios.value).toBe(registered.platforms.android.value);
    });
  });

  describe('Mathematical Relationship Consistency', () => {
    it('should maintain modular scale relationships across platforms', () => {
      // Typography tokens with 1.125 modular scale
      const tokens: PrimitiveToken[] = [
        {
          name: 'fontSize100',
          category: TokenCategory.FONT_SIZE,
          baseValue: 16,
          familyBaseValue: 16,
          description: 'Base font size',
          mathematicalRelationship: 'base',
          baselineGridAlignment: false,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 1, unit: 'rem' },
            ios: { value: 16, unit: 'pt' },
            android: { value: 16, unit: 'sp' }
          }
        },
        {
          name: 'fontSize125',
          category: TokenCategory.FONT_SIZE,
          baseValue: 18,
          familyBaseValue: 16,
          description: 'Scaled font size',
          mathematicalRelationship: 'base × 1.125',
          baselineGridAlignment: false,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 1.125, unit: 'rem' },
            ios: { value: 18, unit: 'pt' },
            android: { value: 18, unit: 'sp' }
          }
        }
      ];

      engine.registerPrimitiveTokens(tokens);

      const fontSize100 = engine.getPrimitiveToken('fontSize100')!;
      const fontSize125 = engine.getPrimitiveToken('fontSize125')!;

      // Verify modular scale maintained across platforms
      const webRatio = (fontSize125.platforms.web.value as number) / (fontSize100.platforms.web.value as number);
      const iosRatio = (fontSize125.platforms.ios.value as number) / (fontSize100.platforms.ios.value as number);
      const androidRatio = (fontSize125.platforms.android.value as number) / (fontSize100.platforms.android.value as number);

      expect(webRatio).toBeCloseTo(1.125, 3);
      expect(iosRatio).toBeCloseTo(1.125, 3);
      expect(androidRatio).toBeCloseTo(1.125, 3);
    });

    it('should maintain baseline grid alignment across platforms', () => {
      const tokens: PrimitiveToken[] = [
        {
          name: 'space100',
          category: TokenCategory.SPACING,
          baseValue: 8,
          familyBaseValue: 8,
          description: 'Base spacing',
          mathematicalRelationship: 'base',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8, unit: 'px' },
            ios: { value: 8, unit: 'pt' },
            android: { value: 8, unit: 'dp' }
          }
        },
        {
          name: 'space400',
          category: TokenCategory.SPACING,
          baseValue: 32,
          familyBaseValue: 8,
          description: 'Quadruple spacing',
          mathematicalRelationship: 'base × 4',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 32, unit: 'px' },
            ios: { value: 32, unit: 'pt' },
            android: { value: 32, unit: 'dp' }
          }
        }
      ];

      engine.registerPrimitiveTokens(tokens);

      // All platforms should maintain 8-unit grid alignment
      const space100 = engine.getPrimitiveToken('space100')!;
      const space400 = engine.getPrimitiveToken('space400')!;

      expect((space100.platforms.web.value as number) % 8).toBe(0);
      expect((space100.platforms.ios.value as number) % 8).toBe(0);
      expect((space100.platforms.android.value as number) % 8).toBe(0);

      expect((space400.platforms.web.value as number) % 8).toBe(0);
      expect((space400.platforms.ios.value as number) % 8).toBe(0);
      expect((space400.platforms.android.value as number) % 8).toBe(0);
    });
  });

  describe('Strategic Flexibility Cross-Platform Consistency', () => {
    it('should maintain strategic flexibility values across platforms', () => {
      const token: PrimitiveToken = {
        name: 'space075',
        category: TokenCategory.SPACING,
        baseValue: 6,
        familyBaseValue: 8,
        description: 'Strategic flexibility spacing',
        mathematicalRelationship: 'base × 0.75',
        baselineGridAlignment: false,
        isStrategicFlexibility: true,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 6, unit: 'px' },
          ios: { value: 6, unit: 'pt' },
          android: { value: 6, unit: 'dp' }
        }
      };

      const result = engine.registerPrimitiveToken(token);
      expect(result.level).toBe('Pass');

      // Verify strategic flexibility value consistent across platforms
      const registered = engine.getPrimitiveToken('space075')!;
      expect(registered.platforms.web.value).toBeCloseTo(6, 1);
      expect(registered.platforms.ios.value).toBeCloseTo(6, 1);
      expect(registered.platforms.android.value).toBeCloseTo(6, 1);
    });

    it('should validate strategic flexibility proportions across platforms', () => {
      const tokens: PrimitiveToken[] = [
        {
          name: 'space100',
          category: TokenCategory.SPACING,
          baseValue: 8,
          familyBaseValue: 8,
          description: 'Base spacing',
          mathematicalRelationship: 'base',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8, unit: 'px' },
            ios: { value: 8, unit: 'pt' },
            android: { value: 8, unit: 'dp' }
          }
        },
        {
          name: 'space075',
          category: TokenCategory.SPACING,
          baseValue: 6,
          familyBaseValue: 8,
          description: 'Strategic flexibility',
          mathematicalRelationship: 'base × 0.75',
          baselineGridAlignment: false,
          isStrategicFlexibility: true,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 6, unit: 'px' },
            ios: { value: 6, unit: 'pt' },
            android: { value: 6, unit: 'dp' }
          }
        }
      ];

      engine.registerPrimitiveTokens(tokens);

      const space100 = engine.getPrimitiveToken('space100')!;
      const space075 = engine.getPrimitiveToken('space075')!;

      // Verify 0.75 ratio maintained across platforms
      expect((space075.platforms.web.value as number) / (space100.platforms.web.value as number)).toBe(0.75);
      expect((space075.platforms.ios.value as number) / (space100.platforms.ios.value as number)).toBe(0.75);
      expect((space075.platforms.android.value as number) / (space100.platforms.android.value as number)).toBe(0.75);
    });
  });

  describe('Platform-Specific Unit Handling', () => {
    it('should use correct units for each platform', () => {
      const spacingToken: PrimitiveToken = {
        name: 'space100',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Base spacing',
        mathematicalRelationship: 'base',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 8, unit: 'pt' },
          android: { value: 8, unit: 'dp' }
        }
      };

      engine.registerPrimitiveToken(spacingToken);
      const registered = engine.getPrimitiveToken('space100')!;

      expect(registered.platforms.web.unit).toBe('px');
      expect(registered.platforms.ios.unit).toBe('pt');
      expect(registered.platforms.android.unit).toBe('dp');
    });

    it('should use correct units for typography tokens', () => {
      const fontSizeToken: PrimitiveToken = {
        name: 'fontSize100',
        category: TokenCategory.FONT_SIZE,
        baseValue: 16,
        familyBaseValue: 16,
        description: 'Base font size',
        mathematicalRelationship: 'base',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 1, unit: 'rem' },
          ios: { value: 16, unit: 'pt' },
          android: { value: 16, unit: 'sp' }
        }
      };

      engine.registerPrimitiveToken(fontSizeToken);
      const registered = engine.getPrimitiveToken('fontSize100')!;

      expect(registered.platforms.web.unit).toBe('rem');
      expect(registered.platforms.ios.unit).toBe('pt');
      expect(registered.platforms.android.unit).toBe('sp');
    });

    it('should use unitless values for line height', () => {
      const lineHeightToken: PrimitiveToken = {
        name: 'lineHeight100',
        category: TokenCategory.LINE_HEIGHT,
        baseValue: 1.5,
        familyBaseValue: 1.5,
        description: 'Base line height',
        mathematicalRelationship: 'base',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true,
        platforms: {
          web: { value: 1.5, unit: 'unitless' },
          ios: { value: 1.5, unit: 'unitless' },
          android: { value: 1.5, unit: 'unitless' }
        }
      };

      engine.registerPrimitiveToken(lineHeightToken);
      const registered = engine.getPrimitiveToken('lineHeight100')!;

      expect(registered.platforms.web.unit).toBe('unitless');
      expect(registered.platforms.ios.unit).toBe('unitless');
      expect(registered.platforms.android.unit).toBe('unitless');
    });
  });

  describe('Precision Targeting Consistency', () => {
    it('should maintain precision multipliers across platforms', () => {
      const lineHeightToken: PrimitiveToken = {
        name: 'lineHeight100',
        category: TokenCategory.LINE_HEIGHT,
        baseValue: 1.5,
        familyBaseValue: 1.5,
        description: 'Precision-targeted line height',
        mathematicalRelationship: 'base',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true,
        platforms: {
          web: { value: 1.5, unit: 'unitless' },
          ios: { value: 1.5, unit: 'unitless' },
          android: { value: 1.5, unit: 'unitless' }
        }
      };

      const result = engine.registerPrimitiveToken(lineHeightToken);
      expect(result.level).toBe('Pass');

      const registered = engine.getPrimitiveToken('lineHeight100')!;
      expect(registered.isPrecisionTargeted).toBe(true);
      expect(registered.platforms.web.value).toBe(1.5);
      expect(registered.platforms.ios.value).toBe(1.5);
      expect(registered.platforms.android.value).toBe(1.5);
    });

    it('should validate tap area precision targeting', () => {
      const tapAreaToken: PrimitiveToken = {
        name: 'tapAreaMinimum',
        category: TokenCategory.TAP_AREA,
        baseValue: 44,
        familyBaseValue: 44,
        description: 'Minimum tap area',
        mathematicalRelationship: 'base',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: true,
        platforms: {
          web: { value: 44, unit: 'px' },
          ios: { value: 44, unit: 'pt' },
          android: { value: 44, unit: 'dp' }
        }
      };

      const result = engine.registerPrimitiveToken(tapAreaToken);
      expect(result.level).toBe('Pass');

      const registered = engine.getPrimitiveToken('tapAreaMinimum')!;
      expect(registered.isPrecisionTargeted).toBe(true);
      expect(registered.platforms.web.value).toBe(44);
      expect(registered.platforms.ios.value).toBe(44);
      expect(registered.platforms.android.value).toBe(44);
    });
  });

  describe('Multi-Token Cross-Platform Validation', () => {
    it('should validate consistency across complete token set', () => {
      const tokens: PrimitiveToken[] = [
        // Spacing tokens
        {
          name: 'space100',
          category: TokenCategory.SPACING,
          baseValue: 8,
          familyBaseValue: 8,
          description: 'Base spacing',
          mathematicalRelationship: 'base',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8, unit: 'px' },
            ios: { value: 8, unit: 'pt' },
            android: { value: 8, unit: 'dp' }
          }
        },
        {
          name: 'space200',
          category: TokenCategory.SPACING,
          baseValue: 16,
          familyBaseValue: 8,
          description: 'Double spacing',
          mathematicalRelationship: 'base × 2',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 16, unit: 'px' },
            ios: { value: 16, unit: 'pt' },
            android: { value: 16, unit: 'dp' }
          }
        },
        // Typography tokens
        {
          name: 'fontSize100',
          category: TokenCategory.FONT_SIZE,
          baseValue: 16,
          familyBaseValue: 16,
          description: 'Base font size',
          mathematicalRelationship: 'base',
          baselineGridAlignment: false,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 1, unit: 'rem' },
            ios: { value: 16, unit: 'pt' },
            android: { value: 16, unit: 'sp' }
          }
        },
        {
          name: 'lineHeight100',
          category: TokenCategory.LINE_HEIGHT,
          baseValue: 1.5,
          familyBaseValue: 1.5,
          description: 'Base line height',
          mathematicalRelationship: 'base',
          baselineGridAlignment: false,
          isStrategicFlexibility: false,
          isPrecisionTargeted: true,
          platforms: {
            web: { value: 1.5, unit: 'unitless' },
            ios: { value: 1.5, unit: 'unitless' },
            android: { value: 1.5, unit: 'unitless' }
          }
        }
      ];

      engine.registerPrimitiveTokens(tokens);

      const validationResults = engine.validateCrossPlatformConsistency();
      const errors = validationResults.filter(r => r.level === 'Error');

      expect(errors).toHaveLength(0);
    });

    it('should detect cross-platform inconsistencies', () => {
      // Register token with inconsistent platform values
      const inconsistentToken: PrimitiveToken = {
        name: 'spaceInconsistent',
        category: TokenCategory.SPACING,
        baseValue: 8,
        familyBaseValue: 8,
        description: 'Inconsistent token',
        mathematicalRelationship: 'base',
        baselineGridAlignment: true,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: {
          web: { value: 8, unit: 'px' },
          ios: { value: 9, unit: 'pt' }, // Inconsistent!
          android: { value: 8, unit: 'dp' }
        }
      };

      engine.registerPrimitiveToken(inconsistentToken);

      const validationResults = engine.validateCrossPlatformConsistency();
      const warnings = validationResults.filter(r => 
        r.level === 'Warning' || r.level === 'Error'
      );

      expect(warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Platform Translation Validation', () => {
    it('should generate consistent platform outputs', async () => {
      const tokens: PrimitiveToken[] = [
        {
          name: 'space100',
          category: TokenCategory.SPACING,
          baseValue: 8,
          familyBaseValue: 8,
          description: 'Base spacing',
          mathematicalRelationship: 'base',
          baselineGridAlignment: true,
          isStrategicFlexibility: false,
          isPrecisionTargeted: false,
          platforms: {
            web: { value: 8, unit: 'px' },
            ios: { value: 8, unit: 'pt' },
            android: { value: 8, unit: 'dp' }
          }
        }
      ];

      engine.registerPrimitiveTokens(tokens);

      const outputs = await engine.generatePlatformTokens();

      expect(outputs).toHaveLength(3);
      expect(outputs.every(o => o.validationStatus === 'valid')).toBe(true);
      expect(outputs.map(o => o.platform)).toContain('web');
      expect(outputs.map(o => o.platform)).toContain('ios');
      expect(outputs.map(o => o.platform)).toContain('android');
    });
  });
});
