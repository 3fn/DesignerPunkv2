/**
 * Token Categories Unit Tests
 * 
 * Tests for token category organization, mathematical relationships, and family-specific validation.
 * Covers spacing, sizing, and radius token families with their mathematical foundations.
 */

import { TokenCategory } from '../../types/PrimitiveToken';
import {
  spacingTokens,
  getAllSpacingTokens,
  getSpacingToken,
  SPACING_BASE_VALUE
} from '../../tokens/SpacingTokens';
import {
  getAllFontSizeTokens,
  getFontSizeToken,
  FONT_SIZE_BASE_VALUE,
  MODULAR_SCALE_RATIO
} from '../../tokens/FontSizeTokens';
import {
  getAllLineHeightTokens,
  getLineHeightToken,
  LINE_HEIGHT_BASE_VALUE
} from '../../tokens/LineHeightTokens';
import {
  getAllDensityTokens,
  getDensityToken,
  DENSITY_BASE_VALUE
} from '../../tokens/DensityTokens';
import {
  getAllTapAreaTokens,
  getTapAreaToken,
  TAP_AREA_BASE_VALUE
} from '../../tokens/TapAreaTokens';
import {
  radiusTokens,
  getAllRadiusTokens,
  getRadiusToken,
  getBaselineAlignedRadiusTokens,
  getStrategicFlexibilityRadiusTokens,
  RADIUS_BASE_VALUE
} from '../../tokens/RadiusTokens';

describe('Token Categories', () => {
  describe('Spacing Tokens', () => {
    test('should have correct base value and family structure', () => {
      expect(SPACING_BASE_VALUE).toBe(8);

      const allTokens = getAllSpacingTokens();
      expect(allTokens.length).toBeGreaterThan(0);
      expect(allTokens.every(token => token.category === TokenCategory.SPACING)).toBe(true);
      expect(allTokens.every(token => token.familyBaseValue === SPACING_BASE_VALUE)).toBe(true);
    });

    test('should include baseline grid aligned tokens', () => {
      const baselineAlignedTokens = getAllSpacingTokens().filter(token => token.baselineGridAlignment);

      expect(baselineAlignedTokens.length).toBeGreaterThan(0);
      baselineAlignedTokens.forEach(token => {
        expect(token.baseValue % 8).toBe(0);
      });
    });

    test('should include strategic flexibility tokens', () => {
      const strategicTokens = getAllSpacingTokens().filter(token => token.isStrategicFlexibility);

      expect(strategicTokens.length).toBeGreaterThan(0);
      expect(strategicTokens.some(token => token.baseValue === 6)).toBe(true); // space075
      expect(strategicTokens.some(token => token.baseValue === 10)).toBe(true); // space125
      expect(strategicTokens.some(token => token.baseValue === 20)).toBe(true); // space250
    });

    test('should have correct mathematical relationships', () => {
      const space100 = getSpacingToken('space100');
      const space200 = getSpacingToken('space200');
      const space075 = getSpacingToken('space075');

      expect(space100?.baseValue).toBe(8);
      expect(space200?.baseValue).toBe(16);
      expect(space075?.baseValue).toBe(6); // Strategic flexibility

      expect(space100?.mathematicalRelationship).toContain('base × 1 = 8 × 1 = 8');
      expect(space200?.mathematicalRelationship).toContain('base × 2 = 8 × 2 = 16');
    });

    test('should have correct platform values', () => {
      const space100 = getSpacingToken('space100');

      expect(space100?.platforms.web).toEqual({ value: 8, unit: 'px' });
      expect(space100?.platforms.ios).toEqual({ value: 8, unit: 'pt' });
      expect(space100?.platforms.android).toEqual({ value: 8, unit: 'dp' });
    });

    test('should retrieve tokens by name correctly', () => {
      const token = getSpacingToken('space100');
      const nonExistent = getSpacingToken('non-existent');

      expect(token).toBeDefined();
      expect(token?.name).toBe('space100');
      expect(nonExistent).toBeUndefined();
    });
  });

  describe('FontSize Tokens', () => {
    test('should have correct base value and modular scale progression', () => {
      expect(FONT_SIZE_BASE_VALUE).toBe(16);
      expect(MODULAR_SCALE_RATIO).toBe(1.125);

      const allTokens = getAllFontSizeTokens();
      expect(allTokens.length).toBeGreaterThan(0);
      expect(allTokens.every((token: any) => token.category === TokenCategory.FONT_SIZE)).toBe(true);
      expect(allTokens.every((token: any) => token.familyBaseValue === FONT_SIZE_BASE_VALUE)).toBe(true);
    });

    test('should follow modular scale mathematical progression', () => {
      const fontSize100 = getFontSizeToken('fontSize100');
      const fontSize125 = getFontSizeToken('fontSize125');

      expect(fontSize100?.baseValue).toBe(16);
      expect(fontSize125?.baseValue).toBe(18); // 16 × 1.125 = 18
    });

    test('should have correct platform values with REM conversion', () => {
      const fontSize100 = getFontSizeToken('fontSize100');

      expect(fontSize100?.platforms.web).toEqual({ value: 1, unit: 'rem' }); // 16 ÷ 16 = 1
      expect(fontSize100?.platforms.ios).toEqual({ value: 16, unit: 'pt' });
      expect(fontSize100?.platforms.android).toEqual({ value: 16, unit: 'sp' });
    });

    test('should not require baseline grid alignment', () => {
      const allTokens = getAllFontSizeTokens();

      // Most fontSize tokens don't align with 8-unit grid due to modular scale
      const nonAlignedTokens = allTokens.filter((token: any) => !token.baselineGridAlignment);
      expect(nonAlignedTokens.length).toBeGreaterThan(0);
    });
  });

  describe('LineHeight Tokens', () => {
    test('should have correct base value and precision targeting', () => {
      expect(LINE_HEIGHT_BASE_VALUE).toBe(1.5);

      const allTokens = getAllLineHeightTokens();
      expect(allTokens.length).toBeGreaterThan(0);
      expect(allTokens.every((token: any) => token.category === TokenCategory.LINE_HEIGHT)).toBe(true);
      expect(allTokens.every((token: any) => token.familyBaseValue === LINE_HEIGHT_BASE_VALUE)).toBe(true);
      expect(allTokens.every((token: any) => token.isPrecisionTargeted)).toBe(true);
    });

    test('should have unitless platform values', () => {
      const lineHeight100 = getLineHeightToken('lineHeight100');

      expect(lineHeight100?.platforms.web).toEqual({ value: 1.5, unit: 'unitless' });
      expect(lineHeight100?.platforms.ios).toEqual({ value: 1.5, unit: 'unitless' });
      expect(lineHeight100?.platforms.android).toEqual({ value: 1.5, unit: 'unitless' });
    });

    test('should provide range of line height multipliers', () => {
      const lineHeight050 = getLineHeightToken('lineHeight050');
      const lineHeight100 = getLineHeightToken('lineHeight100');
      const lineHeight150 = getLineHeightToken('lineHeight150');

      expect(lineHeight050?.baseValue).toBe(1.0); // Tight
      expect(lineHeight100?.baseValue).toBe(1.5); // Base
      expect(lineHeight150?.baseValue).toBe(2.0); // Loose
    });
  });

  describe('Density Tokens', () => {
    test('should have correct base value and selective application', () => {
      expect(DENSITY_BASE_VALUE).toBe(1.0);

      const allTokens = getAllDensityTokens();
      expect(allTokens.length).toBeGreaterThan(0);
      expect(allTokens.every((token: any) => token.category === TokenCategory.DENSITY)).toBe(true);
      expect(allTokens.every((token: any) => token.familyBaseValue === DENSITY_BASE_VALUE)).toBe(true);
      expect(allTokens.every((token: any) => token.isPrecisionTargeted)).toBe(true);
    });

    test('should provide density scaling options', () => {
      const densityCompact = getDensityToken('densityCompact');
      const densityDefault = getDensityToken('densityDefault');
      const densityComfortable = getDensityToken('densityComfortable');

      expect(densityCompact?.baseValue).toBe(0.75); // 25% reduction
      expect(densityDefault?.baseValue).toBe(1.0); // No scaling
      expect(densityComfortable?.baseValue).toBe(1.25); // 25% increase
    });

    test('should have unitless platform values', () => {
      const densityDefault = getDensityToken('densityDefault');

      expect(densityDefault?.platforms.web).toEqual({ value: 1.0, unit: 'unitless' });
      expect(densityDefault?.platforms.ios).toEqual({ value: 1.0, unit: 'unitless' });
      expect(densityDefault?.platforms.android).toEqual({ value: 1.0, unit: 'unitless' });
    });
  });

  describe('TapArea Tokens', () => {
    test('should have correct base value and accessibility targets', () => {
      expect(TAP_AREA_BASE_VALUE).toBe(44);

      const allTokens = getAllTapAreaTokens();
      expect(allTokens.length).toBeGreaterThan(0);
      expect(allTokens.every((token: any) => token.category === TokenCategory.TAP_AREA)).toBe(true);
      expect(allTokens.every((token: any) => token.familyBaseValue === TAP_AREA_BASE_VALUE)).toBe(true);
      expect(allTokens.every((token: any) => token.isPrecisionTargeted)).toBe(true);
    });

    test('should meet accessibility requirements', () => {
      const tapAreaMinimum = getTapAreaToken('tapAreaMinimum');
      const tapAreaRecommended = getTapAreaToken('tapAreaRecommended');

      expect(tapAreaMinimum?.baseValue).toBe(44); // WCAG 2.1 AA minimum
      expect(tapAreaRecommended?.baseValue).toBe(48); // Enhanced usability
    });

    test('should have correct platform values', () => {
      const tapAreaMinimum = getTapAreaToken('tapAreaMinimum');

      expect(tapAreaMinimum?.platforms.web).toEqual({ value: 44, unit: 'px' });
      expect(tapAreaMinimum?.platforms.ios).toEqual({ value: 44, unit: 'pt' });
      expect(tapAreaMinimum?.platforms.android).toEqual({ value: 44, unit: 'dp' });
    });

    test('should include baseline grid aligned options', () => {
      const tapAreaRecommended = getTapAreaToken('tapAreaRecommended');
      const tapAreaComfortable = getTapAreaToken('tapAreaComfortable');

      expect(tapAreaRecommended?.baseValue).toBe(48); // 8 × 6
      expect(tapAreaRecommended?.baselineGridAlignment).toBe(true);
      expect(tapAreaComfortable?.baseValue).toBe(56); // 8 × 7
      expect(tapAreaComfortable?.baselineGridAlignment).toBe(true);
    });
  });

  describe('Radius Tokens', () => {
    test('should have correct base value and family structure', () => {
      expect(RADIUS_BASE_VALUE).toBe(8);

      const allTokens = getAllRadiusTokens();
      expect(allTokens.length).toBeGreaterThan(0);
      expect(allTokens.every(token => token.category === TokenCategory.RADIUS)).toBe(true);
      expect(allTokens.every(token => token.familyBaseValue === RADIUS_BASE_VALUE)).toBe(true);
    });

    test('should include baseline grid aligned tokens', () => {
      const baselineAlignedTokens = getBaselineAlignedRadiusTokens();

      expect(baselineAlignedTokens.length).toBeGreaterThan(0);
      baselineAlignedTokens.forEach(token => {
        if (token.name !== 'radiusFull') { // Special case
          expect(token.baseValue % 8).toBe(0);
        }
      });
    });

    test('should include strategic flexibility tokens', () => {
      const strategicTokens = getStrategicFlexibilityRadiusTokens();

      expect(strategicTokens.length).toBeGreaterThan(0);
      expect(strategicTokens.some(token => token.baseValue === 6)).toBe(true); // radius075
      expect(strategicTokens.some(token => token.baseValue === 10)).toBe(true); // radius125
      expect(strategicTokens.some(token => token.baseValue === 20)).toBe(true); // radius250
    });

    test('should handle special case tokens', () => {
      const radiusFull = getRadiusToken('radiusFull');
      const radius000 = getRadiusToken('radius000');

      expect(radiusFull?.baseValue).toBe(9999); // Effectively infinite
      expect(radiusFull?.isStrategicFlexibility).toBe(true);
      expect(radius000?.baseValue).toBe(0); // No radius
      expect(radius000?.baselineGridAlignment).toBe(true);
    });

    test('should have correct platform values', () => {
      const radius100 = getRadiusToken('radius100');

      expect(radius100?.platforms.web).toEqual({ value: 8, unit: 'px' });
      expect(radius100?.platforms.ios).toEqual({ value: 8, unit: 'pt' });
      expect(radius100?.platforms.android).toEqual({ value: 8, unit: 'dp' });
    });

    test('should retrieve tokens by name correctly', () => {
      const token = getRadiusToken('radius100');
      const nonExistent = getRadiusToken('non-existent');

      expect(token).toBeDefined();
      expect(token?.name).toBe('radius100');
      expect(nonExistent).toBeUndefined();
    });
  });

  describe('Cross-Category Validation', () => {
    test('should have consistent token naming patterns', () => {
      const spacingNames = Object.keys(spacingTokens);
      const radiusNames = Object.keys(radiusTokens);

      // Both should have 100, 200, etc. variants
      expect(spacingNames.some(name => name.includes('100'))).toBe(true);
      expect(spacingNames.some(name => name.includes('200'))).toBe(true);
      expect(radiusNames.some(name => name.includes('100'))).toBe(true);
      expect(radiusNames.some(name => name.includes('200'))).toBe(true);
    });

    test('should have consistent strategic flexibility values across families', () => {
      const spacingStrategic = getAllSpacingTokens().filter(token => token.isStrategicFlexibility);
      const radiusStrategic = getStrategicFlexibilityRadiusTokens();

      const spacingValues = spacingStrategic.map(token => token.baseValue);
      const radiusValues = radiusStrategic.filter(token => token.name !== 'radiusFull').map(token => token.baseValue);

      // Should share common strategic flexibility values
      expect(spacingValues.some(value => radiusValues.includes(value))).toBe(true);
    });

    test('should maintain mathematical relationships within families', () => {
      // Test spacing family progression
      const space100 = getSpacingToken('space100');
      const space200 = getSpacingToken('space200');
      expect(space200?.baseValue).toBe((space100?.baseValue || 0) * 2);

      // Test radius family progression
      const radius100 = getRadiusToken('radius100');
      const radius200 = getRadiusToken('radius200');
      expect(radius200?.baseValue).toBe((radius100?.baseValue || 0) * 2);
    });

    test('should have appropriate precision targeting flags', () => {
      // LineHeight, Density, and TapArea should be precision targeted
      const lineHeightTokens = getAllLineHeightTokens();
      const densityTokens = getAllDensityTokens();
      const tapAreaTokens = getAllTapAreaTokens();

      expect(lineHeightTokens.every((token: any) => token.isPrecisionTargeted)).toBe(true);
      expect(densityTokens.every((token: any) => token.isPrecisionTargeted)).toBe(true);
      expect(tapAreaTokens.every((token: any) => token.isPrecisionTargeted)).toBe(true);

      // Spacing and Radius should not be precision targeted
      const spacingTokens = getAllSpacingTokens();
      const radiusTokens = getAllRadiusTokens();

      expect(spacingTokens.every((token: any) => !token.isPrecisionTargeted)).toBe(true);
      expect(radiusTokens.every((token: any) => !token.isPrecisionTargeted)).toBe(true);
    });
  });

  describe('Token Retrieval Functions', () => {
    test('should handle individual token getters for all categories', () => {
      const fontSize = getFontSizeToken('fontSize100');
      const lineHeight = getLineHeightToken('lineHeight100');
      const density = getDensityToken('densityDefault');
      const tapArea = getTapAreaToken('tapAreaMinimum');

      expect(fontSize?.category).toBe(TokenCategory.FONT_SIZE);
      expect(lineHeight?.category).toBe(TokenCategory.LINE_HEIGHT);
      expect(density?.category).toBe(TokenCategory.DENSITY);
      expect(tapArea?.category).toBe(TokenCategory.TAP_AREA);
    });

    test('should return undefined for invalid token names', () => {
      const invalid1 = getFontSizeToken('non-existent');
      const invalid2 = getLineHeightToken('invalid-name');
      const invalid3 = getDensityToken('does-not-exist');
      const invalid4 = getTapAreaToken('missing-token');

      expect(invalid1).toBeUndefined();
      expect(invalid2).toBeUndefined();
      expect(invalid3).toBeUndefined();
      expect(invalid4).toBeUndefined();
    });

    test('should return all tokens for category getter functions', () => {
      expect(getAllFontSizeTokens().length).toBeGreaterThan(0);
      expect(getAllLineHeightTokens().length).toBeGreaterThan(0);
      expect(getAllDensityTokens().length).toBeGreaterThan(0);
      expect(getAllTapAreaTokens().length).toBeGreaterThan(0);
      expect(getAllSpacingTokens().length).toBeGreaterThan(0);
      expect(getAllRadiusTokens().length).toBeGreaterThan(0);
    });
  });
});