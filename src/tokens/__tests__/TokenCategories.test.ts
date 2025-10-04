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
import {
  getAllFontFamilyTokens,
  getFontFamilyToken
} from '../../tokens/FontFamilyTokens';
import {
  getAllFontWeightTokens,
  getFontWeightToken,
  FONT_WEIGHT_BASE_VALUE
} from '../../tokens/FontWeightTokens';
import {
  getAllLetterSpacingTokens,
  getLetterSpacingToken,
  LETTER_SPACING_BASE_VALUE
} from '../../tokens/LetterSpacingTokens';
import {
  getAllColorTokens,
  getColorToken,
  resolveColorTokenValue,
  COLOR_BASE_VALUE,
  COLOR_FAMILIES,
  COLOR_SCALE
} from '../../tokens/ColorTokens';

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

  describe('Typography Token Integration', () => {
    test('should have correct token categories for typography tokens', () => {
      const fontFamilyTokens = getAllFontFamilyTokens();
      const fontWeightTokens = getAllFontWeightTokens();
      const letterSpacingTokens = getAllLetterSpacingTokens();

      expect(fontFamilyTokens.every(token => token.category === TokenCategory.FONT_FAMILY)).toBe(true);
      expect(fontWeightTokens.every(token => token.category === TokenCategory.FONT_WEIGHT)).toBe(true);
      expect(letterSpacingTokens.every(token => token.category === TokenCategory.LETTER_SPACING)).toBe(true);
    });

    test('should have appropriate base values for typography token families', () => {
      expect(FONT_WEIGHT_BASE_VALUE).toBe(400);
      expect(LETTER_SPACING_BASE_VALUE).toBe(0);

      const fontWeightTokens = getAllFontWeightTokens();
      const letterSpacingTokens = getAllLetterSpacingTokens();

      expect(fontWeightTokens.every(token => token.familyBaseValue === FONT_WEIGHT_BASE_VALUE)).toBe(true);
      expect(letterSpacingTokens.every(token => token.familyBaseValue === LETTER_SPACING_BASE_VALUE)).toBe(true);
    });

    test('should have correct precision targeting for typography tokens', () => {
      const fontFamilyTokens = getAllFontFamilyTokens();
      const fontWeightTokens = getAllFontWeightTokens();
      const letterSpacingTokens = getAllLetterSpacingTokens();

      // Font family and weight are not precision targeted
      expect(fontFamilyTokens.every(token => !token.isPrecisionTargeted)).toBe(true);
      expect(fontWeightTokens.every(token => !token.isPrecisionTargeted)).toBe(true);

      // Letter spacing is precision targeted for typography refinement
      expect(letterSpacingTokens.every(token => token.isPrecisionTargeted)).toBe(true);
    });

    test('should have appropriate platform units for typography tokens', () => {
      const fontFamilyToken = getFontFamilyToken('fontFamilySystem');
      const fontWeightToken = getFontWeightToken('fontWeight400');
      const letterSpacingToken = getLetterSpacingToken('letterSpacing100');

      expect(fontFamilyToken?.platforms.web.unit).toBe('fontFamily');
      expect(fontWeightToken?.platforms.web.unit).toBe('fontWeight');
      expect(letterSpacingToken?.platforms.web.unit).toBe('em');
    });

    test('should maintain cross-platform consistency for typography tokens', () => {
      const fontWeightTokens = getAllFontWeightTokens();
      const letterSpacingTokens = getAllLetterSpacingTokens();

      // Font weight should have identical numeric values across platforms
      fontWeightTokens.forEach(token => {
        expect(token.platforms.web.value).toBe(token.platforms.ios.value);
        expect(token.platforms.ios.value).toBe(token.platforms.android.value);
      });

      // Letter spacing should have identical em values across platforms
      letterSpacingTokens.forEach(token => {
        expect(token.platforms.web.value).toBe(token.platforms.ios.value);
        expect(token.platforms.ios.value).toBe(token.platforms.android.value);
      });
    });
  });

  describe('Token Retrieval Functions', () => {
    test('should handle individual token getters for all categories', () => {
      const fontSize = getFontSizeToken('fontSize100');
      const lineHeight = getLineHeightToken('lineHeight100');
      const density = getDensityToken('densityDefault');
      const tapArea = getTapAreaToken('tapAreaMinimum');
      const fontFamily = getFontFamilyToken('fontFamilySystem');
      const fontWeight = getFontWeightToken('fontWeight400');
      const letterSpacing = getLetterSpacingToken('letterSpacing100');

      expect(fontSize?.category).toBe(TokenCategory.FONT_SIZE);
      expect(lineHeight?.category).toBe(TokenCategory.LINE_HEIGHT);
      expect(density?.category).toBe(TokenCategory.DENSITY);
      expect(tapArea?.category).toBe(TokenCategory.TAP_AREA);
      expect(fontFamily?.category).toBe(TokenCategory.FONT_FAMILY);
      expect(fontWeight?.category).toBe(TokenCategory.FONT_WEIGHT);
      expect(letterSpacing?.category).toBe(TokenCategory.LETTER_SPACING);
    });

    test('should return undefined for invalid token names', () => {
      const invalid1 = getFontSizeToken('non-existent');
      const invalid2 = getLineHeightToken('invalid-name');
      const invalid3 = getDensityToken('does-not-exist');
      const invalid4 = getTapAreaToken('missing-token');
      const invalid5 = getFontFamilyToken('fontFamilyInvalid');
      const invalid6 = getFontWeightToken('fontWeight050');
      const invalid7 = getLetterSpacingToken('letterSpacing200');

      expect(invalid1).toBeUndefined();
      expect(invalid2).toBeUndefined();
      expect(invalid3).toBeUndefined();
      expect(invalid4).toBeUndefined();
      expect(invalid5).toBeUndefined();
      expect(invalid6).toBeUndefined();
      expect(invalid7).toBeUndefined();
    });

    test('should return all tokens for category getter functions', () => {
      expect(getAllFontSizeTokens().length).toBeGreaterThan(0);
      expect(getAllLineHeightTokens().length).toBeGreaterThan(0);
      expect(getAllDensityTokens().length).toBeGreaterThan(0);
      expect(getAllTapAreaTokens().length).toBeGreaterThan(0);
      expect(getAllSpacingTokens().length).toBeGreaterThan(0);
      expect(getAllRadiusTokens().length).toBeGreaterThan(0);
      expect(getAllFontFamilyTokens().length).toBeGreaterThan(0);
      expect(getAllFontWeightTokens().length).toBeGreaterThan(0);
      expect(getAllLetterSpacingTokens().length).toBeGreaterThan(0);
      expect(getAllColorTokens().length).toBeGreaterThan(0);
    });
  });

  describe('Color Token Integration', () => {
    test('should have correct base value and family structure for color tokens', () => {
      expect(COLOR_BASE_VALUE).toBe(0); // N/A for hex color tokens

      const allTokens = getAllColorTokens();
      expect(allTokens.length).toBe(45); // 9 families × 5 scales = 45 tokens
      expect(allTokens.every(token => token.category === TokenCategory.COLOR)).toBe(true);
      expect(allTokens.every(token => token.familyBaseValue === COLOR_BASE_VALUE)).toBe(true);
    });

    test('should have mode-aware color token structure integrated with token system', () => {
      const allTokens = getAllColorTokens();

      allTokens.forEach(token => {
        // Validate mode-aware structure integration
        expect(token.platforms.web.unit).toBe('hex');
        expect(token.platforms.ios.unit).toBe('hex');
        expect(token.platforms.android.unit).toBe('hex');

        // Validate color token flags are appropriate
        expect(token.baselineGridAlignment).toBe(false);
        expect(token.isStrategicFlexibility).toBe(false);
        expect(token.isPrecisionTargeted).toBe(false);
      });
    });

    test('should integrate color families with systematic color scale', () => {
      expect(COLOR_SCALE).toEqual([100, 200, 300, 400, 500]);
      expect(Object.keys(COLOR_FAMILIES)).toHaveLength(9);

      // Test that all families follow the scale
      Object.values(COLOR_FAMILIES).forEach(family => {
        COLOR_SCALE.forEach(scale => {
          const token = getColorToken(`${family}${scale}` as any);
          expect(token).toBeDefined();
          expect(token.name).toBe(`${family}${scale}`);
        });
      });
    });

    test('should support mode-aware color resolution in token system integration', () => {
      const testToken = getColorToken('purple300');

      // Test integration with resolveColorTokenValue utility
      const lightBase = resolveColorTokenValue(testToken, 'light', 'base');
      const lightWcag = resolveColorTokenValue(testToken, 'light', 'wcag');
      const darkBase = resolveColorTokenValue(testToken, 'dark', 'base');
      const darkWcag = resolveColorTokenValue(testToken, 'dark', 'wcag');

      expect(lightBase).toMatch(/^#[0-9A-F]{6}$/i);
      expect(lightWcag).toMatch(/^#[0-9A-F]{6}$/i);
      expect(darkBase).toMatch(/^#[0-9A-F]{6}$/i);
      expect(darkWcag).toMatch(/^#[0-9A-F]{6}$/i);
    });

    test('should maintain cross-platform consistency for mode-aware color tokens', () => {
      const allTokens = getAllColorTokens();

      allTokens.forEach(token => {
        const webValue = token.platforms.web.value;
        const iosValue = token.platforms.ios.value;
        const androidValue = token.platforms.android.value;

        // Color values should be identical across platforms
        expect(webValue).toEqual(iosValue);
        expect(iosValue).toEqual(androidValue);
      });
    });

    test('should integrate color tokens with existing token category validation', () => {
      const allTokens = getAllColorTokens();

      // Color tokens should not be precision targeted (like spacing/radius)
      expect(allTokens.every(token => !token.isPrecisionTargeted)).toBe(true);

      // Color tokens should not have baseline grid alignment (like typography)
      expect(allTokens.every(token => !token.baselineGridAlignment)).toBe(true);

      // Color tokens should not be strategic flexibility (different from spacing/radius)
      expect(allTokens.every(token => !token.isStrategicFlexibility)).toBe(true);
    });

    test('should have consistent mathematical relationship descriptions across color families', () => {
      Object.values(COLOR_FAMILIES).forEach(family => {
        COLOR_SCALE.forEach(scale => {
          const token = getColorToken(`${family}${scale}` as any);
          expect(token.mathematicalRelationship).toContain(`Systematic ${family} scale progression`);
        });
      });
    });
  });
});