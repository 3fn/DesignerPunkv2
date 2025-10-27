"use strict";
/**
 * Token Categories Unit Tests
 *
 * Tests for token category organization, mathematical relationships, and family-specific validation.
 * Covers spacing, sizing, and radius token families with their mathematical foundations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const PrimitiveToken_1 = require("../../types/PrimitiveToken");
const SpacingTokens_1 = require("../../tokens/SpacingTokens");
const FontSizeTokens_1 = require("../../tokens/FontSizeTokens");
const LineHeightTokens_1 = require("../../tokens/LineHeightTokens");
const DensityTokens_1 = require("../../tokens/DensityTokens");
const TapAreaTokens_1 = require("../../tokens/TapAreaTokens");
const RadiusTokens_1 = require("../../tokens/RadiusTokens");
const FontFamilyTokens_1 = require("../../tokens/FontFamilyTokens");
const FontWeightTokens_1 = require("../../tokens/FontWeightTokens");
const LetterSpacingTokens_1 = require("../../tokens/LetterSpacingTokens");
const ColorTokens_1 = require("../../tokens/ColorTokens");
describe('Token Categories', () => {
    describe('Spacing Tokens', () => {
        test('should have correct base value and family structure', () => {
            expect(SpacingTokens_1.SPACING_BASE_VALUE).toBe(8);
            const allTokens = (0, SpacingTokens_1.getAllSpacingTokens)();
            expect(allTokens.length).toBeGreaterThan(0);
            expect(allTokens.every(token => token.category === PrimitiveToken_1.TokenCategory.SPACING)).toBe(true);
            expect(allTokens.every(token => token.familyBaseValue === SpacingTokens_1.SPACING_BASE_VALUE)).toBe(true);
        });
        test('should include baseline grid aligned tokens', () => {
            const baselineAlignedTokens = (0, SpacingTokens_1.getAllSpacingTokens)().filter(token => token.baselineGridAlignment);
            expect(baselineAlignedTokens.length).toBeGreaterThan(0);
            baselineAlignedTokens.forEach(token => {
                expect(token.baseValue % 8).toBe(0);
            });
        });
        test('should include strategic flexibility tokens', () => {
            const strategicTokens = (0, SpacingTokens_1.getAllSpacingTokens)().filter(token => token.isStrategicFlexibility);
            expect(strategicTokens.length).toBeGreaterThan(0);
            expect(strategicTokens.some(token => token.baseValue === 6)).toBe(true); // space075
            expect(strategicTokens.some(token => token.baseValue === 10)).toBe(true); // space125
            expect(strategicTokens.some(token => token.baseValue === 20)).toBe(true); // space250
        });
        test('should have correct mathematical relationships', () => {
            const space100 = (0, SpacingTokens_1.getSpacingToken)('space100');
            const space200 = (0, SpacingTokens_1.getSpacingToken)('space200');
            const space075 = (0, SpacingTokens_1.getSpacingToken)('space075');
            expect(space100?.baseValue).toBe(8);
            expect(space200?.baseValue).toBe(16);
            expect(space075?.baseValue).toBe(6); // Strategic flexibility
            expect(space100?.mathematicalRelationship).toContain('base × 1 = 8 × 1 = 8');
            expect(space200?.mathematicalRelationship).toContain('base × 2 = 8 × 2 = 16');
        });
        test('should have correct platform values', () => {
            const space100 = (0, SpacingTokens_1.getSpacingToken)('space100');
            expect(space100?.platforms.web).toEqual({ value: 8, unit: 'px' });
            expect(space100?.platforms.ios).toEqual({ value: 8, unit: 'pt' });
            expect(space100?.platforms.android).toEqual({ value: 8, unit: 'dp' });
        });
        test('should retrieve tokens by name correctly', () => {
            const token = (0, SpacingTokens_1.getSpacingToken)('space100');
            const nonExistent = (0, SpacingTokens_1.getSpacingToken)('non-existent');
            expect(token).toBeDefined();
            expect(token?.name).toBe('space100');
            expect(nonExistent).toBeUndefined();
        });
    });
    describe('FontSize Tokens', () => {
        test('should have correct base value and modular scale progression', () => {
            expect(FontSizeTokens_1.FONT_SIZE_BASE_VALUE).toBe(16);
            expect(FontSizeTokens_1.MODULAR_SCALE_RATIO).toBe(1.125);
            const allTokens = (0, FontSizeTokens_1.getAllFontSizeTokens)();
            expect(allTokens.length).toBeGreaterThan(0);
            expect(allTokens.every((token) => token.category === PrimitiveToken_1.TokenCategory.FONT_SIZE)).toBe(true);
            expect(allTokens.every((token) => token.familyBaseValue === FontSizeTokens_1.FONT_SIZE_BASE_VALUE)).toBe(true);
        });
        test('should follow modular scale mathematical progression', () => {
            const fontSize100 = (0, FontSizeTokens_1.getFontSizeToken)('fontSize100');
            const fontSize125 = (0, FontSizeTokens_1.getFontSizeToken)('fontSize125');
            expect(fontSize100?.baseValue).toBe(16);
            expect(fontSize125?.baseValue).toBe(18); // 16 × 1.125 = 18
        });
        test('should have correct platform values with REM conversion', () => {
            const fontSize100 = (0, FontSizeTokens_1.getFontSizeToken)('fontSize100');
            expect(fontSize100?.platforms.web).toEqual({ value: 1, unit: 'rem' }); // 16 ÷ 16 = 1
            expect(fontSize100?.platforms.ios).toEqual({ value: 16, unit: 'pt' });
            expect(fontSize100?.platforms.android).toEqual({ value: 16, unit: 'sp' });
        });
        test('should not require baseline grid alignment', () => {
            const allTokens = (0, FontSizeTokens_1.getAllFontSizeTokens)();
            // Most fontSize tokens don't align with 8-unit grid due to modular scale
            const nonAlignedTokens = allTokens.filter((token) => !token.baselineGridAlignment);
            expect(nonAlignedTokens.length).toBeGreaterThan(0);
        });
    });
    describe('LineHeight Tokens', () => {
        test('should have correct base value and precision targeting', () => {
            expect(LineHeightTokens_1.LINE_HEIGHT_BASE_VALUE).toBe(1.5);
            const allTokens = (0, LineHeightTokens_1.getAllLineHeightTokens)();
            expect(allTokens.length).toBeGreaterThan(0);
            expect(allTokens.every((token) => token.category === PrimitiveToken_1.TokenCategory.LINE_HEIGHT)).toBe(true);
            expect(allTokens.every((token) => token.familyBaseValue === LineHeightTokens_1.LINE_HEIGHT_BASE_VALUE)).toBe(true);
            expect(allTokens.every((token) => token.isPrecisionTargeted)).toBe(true);
        });
        test('should have unitless platform values', () => {
            const lineHeight100 = (0, LineHeightTokens_1.getLineHeightToken)('lineHeight100');
            expect(lineHeight100?.platforms.web).toEqual({ value: 1.5, unit: 'unitless' });
            expect(lineHeight100?.platforms.ios).toEqual({ value: 1.5, unit: 'unitless' });
            expect(lineHeight100?.platforms.android).toEqual({ value: 1.5, unit: 'unitless' });
        });
        test('should provide range of line height multipliers', () => {
            const lineHeight050 = (0, LineHeightTokens_1.getLineHeightToken)('lineHeight050');
            const lineHeight100 = (0, LineHeightTokens_1.getLineHeightToken)('lineHeight100');
            const lineHeight150 = (0, LineHeightTokens_1.getLineHeightToken)('lineHeight150');
            expect(lineHeight050?.baseValue).toBe(1.0); // Tight
            expect(lineHeight100?.baseValue).toBe(1.5); // Base
            expect(lineHeight150?.baseValue).toBe(1.4); // H6 line height (4pt subgrid aligned)
        });
    });
    describe('Density Tokens', () => {
        test('should have correct base value and selective application', () => {
            expect(DensityTokens_1.DENSITY_BASE_VALUE).toBe(1.0);
            const allTokens = (0, DensityTokens_1.getAllDensityTokens)();
            expect(allTokens.length).toBeGreaterThan(0);
            expect(allTokens.every((token) => token.category === PrimitiveToken_1.TokenCategory.DENSITY)).toBe(true);
            expect(allTokens.every((token) => token.familyBaseValue === DensityTokens_1.DENSITY_BASE_VALUE)).toBe(true);
            expect(allTokens.every((token) => token.isPrecisionTargeted)).toBe(true);
        });
        test('should provide density scaling options', () => {
            const densityCompact = (0, DensityTokens_1.getDensityToken)('densityCompact');
            const densityDefault = (0, DensityTokens_1.getDensityToken)('densityDefault');
            const densityComfortable = (0, DensityTokens_1.getDensityToken)('densityComfortable');
            expect(densityCompact?.baseValue).toBe(0.75); // 25% reduction
            expect(densityDefault?.baseValue).toBe(1.0); // No scaling
            expect(densityComfortable?.baseValue).toBe(1.25); // 25% increase
        });
        test('should have unitless platform values', () => {
            const densityDefault = (0, DensityTokens_1.getDensityToken)('densityDefault');
            expect(densityDefault?.platforms.web).toEqual({ value: 1.0, unit: 'unitless' });
            expect(densityDefault?.platforms.ios).toEqual({ value: 1.0, unit: 'unitless' });
            expect(densityDefault?.platforms.android).toEqual({ value: 1.0, unit: 'unitless' });
        });
    });
    describe('TapArea Tokens', () => {
        test('should have correct base value and accessibility targets', () => {
            expect(TapAreaTokens_1.TAP_AREA_BASE_VALUE).toBe(44);
            const allTokens = (0, TapAreaTokens_1.getAllTapAreaTokens)();
            expect(allTokens.length).toBeGreaterThan(0);
            expect(allTokens.every((token) => token.category === PrimitiveToken_1.TokenCategory.TAP_AREA)).toBe(true);
            expect(allTokens.every((token) => token.familyBaseValue === TapAreaTokens_1.TAP_AREA_BASE_VALUE)).toBe(true);
            expect(allTokens.every((token) => token.isPrecisionTargeted)).toBe(true);
        });
        test('should meet accessibility requirements', () => {
            const tapAreaMinimum = (0, TapAreaTokens_1.getTapAreaToken)('tapAreaMinimum');
            const tapAreaRecommended = (0, TapAreaTokens_1.getTapAreaToken)('tapAreaRecommended');
            expect(tapAreaMinimum?.baseValue).toBe(44); // WCAG 2.1 AA minimum
            expect(tapAreaRecommended?.baseValue).toBe(48); // Enhanced usability
        });
        test('should have correct platform values', () => {
            const tapAreaMinimum = (0, TapAreaTokens_1.getTapAreaToken)('tapAreaMinimum');
            expect(tapAreaMinimum?.platforms.web).toEqual({ value: 44, unit: 'px' });
            expect(tapAreaMinimum?.platforms.ios).toEqual({ value: 44, unit: 'pt' });
            expect(tapAreaMinimum?.platforms.android).toEqual({ value: 44, unit: 'dp' });
        });
        test('should include baseline grid aligned options', () => {
            const tapAreaRecommended = (0, TapAreaTokens_1.getTapAreaToken)('tapAreaRecommended');
            const tapAreaComfortable = (0, TapAreaTokens_1.getTapAreaToken)('tapAreaComfortable');
            expect(tapAreaRecommended?.baseValue).toBe(48); // 8 × 6
            expect(tapAreaRecommended?.baselineGridAlignment).toBe(true);
            expect(tapAreaComfortable?.baseValue).toBe(56); // 8 × 7
            expect(tapAreaComfortable?.baselineGridAlignment).toBe(true);
        });
    });
    describe('Radius Tokens', () => {
        test('should have correct base value and family structure', () => {
            expect(RadiusTokens_1.RADIUS_BASE_VALUE).toBe(8);
            const allTokens = (0, RadiusTokens_1.getAllRadiusTokens)();
            expect(allTokens.length).toBeGreaterThan(0);
            expect(allTokens.every(token => token.category === PrimitiveToken_1.TokenCategory.RADIUS)).toBe(true);
            expect(allTokens.every(token => token.familyBaseValue === RadiusTokens_1.RADIUS_BASE_VALUE)).toBe(true);
        });
        test('should include baseline grid aligned tokens', () => {
            const baselineAlignedTokens = (0, RadiusTokens_1.getBaselineAlignedRadiusTokens)();
            expect(baselineAlignedTokens.length).toBeGreaterThan(0);
            baselineAlignedTokens.forEach(token => {
                if (token.name !== 'radiusFull') { // Special case
                    expect(token.baseValue % 8).toBe(0);
                }
            });
        });
        test('should include strategic flexibility tokens', () => {
            const strategicTokens = (0, RadiusTokens_1.getStrategicFlexibilityRadiusTokens)();
            expect(strategicTokens.length).toBeGreaterThan(0);
            expect(strategicTokens.some(token => token.baseValue === 6)).toBe(true); // radius075
            expect(strategicTokens.some(token => token.baseValue === 10)).toBe(true); // radius125
            expect(strategicTokens.some(token => token.baseValue === 20)).toBe(true); // radius250
        });
        test('should handle special case tokens', () => {
            const radiusFull = (0, RadiusTokens_1.getRadiusToken)('radiusFull');
            const radius000 = (0, RadiusTokens_1.getRadiusToken)('radius000');
            expect(radiusFull?.baseValue).toBe(9999); // Effectively infinite
            expect(radiusFull?.isStrategicFlexibility).toBe(true);
            expect(radius000?.baseValue).toBe(0); // No radius
            expect(radius000?.baselineGridAlignment).toBe(true);
        });
        test('should have correct platform values', () => {
            const radius100 = (0, RadiusTokens_1.getRadiusToken)('radius100');
            expect(radius100?.platforms.web).toEqual({ value: 8, unit: 'px' });
            expect(radius100?.platforms.ios).toEqual({ value: 8, unit: 'pt' });
            expect(radius100?.platforms.android).toEqual({ value: 8, unit: 'dp' });
        });
        test('should retrieve tokens by name correctly', () => {
            const token = (0, RadiusTokens_1.getRadiusToken)('radius100');
            const nonExistent = (0, RadiusTokens_1.getRadiusToken)('non-existent');
            expect(token).toBeDefined();
            expect(token?.name).toBe('radius100');
            expect(nonExistent).toBeUndefined();
        });
    });
    describe('Cross-Category Validation', () => {
        test('should have consistent token naming patterns', () => {
            const spacingNames = Object.keys(SpacingTokens_1.spacingTokens);
            const radiusNames = Object.keys(RadiusTokens_1.radiusTokens);
            // Both should have 100, 200, etc. variants
            expect(spacingNames.some(name => name.includes('100'))).toBe(true);
            expect(spacingNames.some(name => name.includes('200'))).toBe(true);
            expect(radiusNames.some(name => name.includes('100'))).toBe(true);
            expect(radiusNames.some(name => name.includes('200'))).toBe(true);
        });
        test('should have consistent strategic flexibility values across families', () => {
            const spacingStrategic = (0, SpacingTokens_1.getAllSpacingTokens)().filter(token => token.isStrategicFlexibility);
            const radiusStrategic = (0, RadiusTokens_1.getStrategicFlexibilityRadiusTokens)();
            const spacingValues = spacingStrategic.map(token => token.baseValue);
            const radiusValues = radiusStrategic.filter(token => token.name !== 'radiusFull').map(token => token.baseValue);
            // Should share common strategic flexibility values
            expect(spacingValues.some(value => radiusValues.includes(value))).toBe(true);
        });
        test('should maintain mathematical relationships within families', () => {
            // Test spacing family progression
            const space100 = (0, SpacingTokens_1.getSpacingToken)('space100');
            const space200 = (0, SpacingTokens_1.getSpacingToken)('space200');
            expect(space200?.baseValue).toBe((space100?.baseValue || 0) * 2);
            // Test radius family progression
            const radius100 = (0, RadiusTokens_1.getRadiusToken)('radius100');
            const radius200 = (0, RadiusTokens_1.getRadiusToken)('radius200');
            expect(radius200?.baseValue).toBe((radius100?.baseValue || 0) * 2);
        });
        test('should have appropriate precision targeting flags', () => {
            // LineHeight, Density, and TapArea should be precision targeted
            const lineHeightTokens = (0, LineHeightTokens_1.getAllLineHeightTokens)();
            const densityTokens = (0, DensityTokens_1.getAllDensityTokens)();
            const tapAreaTokens = (0, TapAreaTokens_1.getAllTapAreaTokens)();
            expect(lineHeightTokens.every((token) => token.isPrecisionTargeted)).toBe(true);
            expect(densityTokens.every((token) => token.isPrecisionTargeted)).toBe(true);
            expect(tapAreaTokens.every((token) => token.isPrecisionTargeted)).toBe(true);
            // Spacing and Radius should not be precision targeted
            const spacingTokens = (0, SpacingTokens_1.getAllSpacingTokens)();
            const radiusTokens = (0, RadiusTokens_1.getAllRadiusTokens)();
            expect(spacingTokens.every((token) => !token.isPrecisionTargeted)).toBe(true);
            expect(radiusTokens.every((token) => !token.isPrecisionTargeted)).toBe(true);
        });
    });
    describe('Typography Token Integration', () => {
        test('should have correct token categories for typography tokens', () => {
            const fontFamilyTokens = (0, FontFamilyTokens_1.getAllFontFamilyTokens)();
            const fontWeightTokens = (0, FontWeightTokens_1.getAllFontWeightTokens)();
            const letterSpacingTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
            expect(fontFamilyTokens.every(token => token.category === PrimitiveToken_1.TokenCategory.FONT_FAMILY)).toBe(true);
            expect(fontWeightTokens.every(token => token.category === PrimitiveToken_1.TokenCategory.FONT_WEIGHT)).toBe(true);
            expect(letterSpacingTokens.every(token => token.category === PrimitiveToken_1.TokenCategory.LETTER_SPACING)).toBe(true);
        });
        test('should have appropriate base values for typography token families', () => {
            expect(FontWeightTokens_1.FONT_WEIGHT_BASE_VALUE).toBe(400);
            expect(LetterSpacingTokens_1.LETTER_SPACING_BASE_VALUE).toBe(0);
            const fontWeightTokens = (0, FontWeightTokens_1.getAllFontWeightTokens)();
            const letterSpacingTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
            expect(fontWeightTokens.every(token => token.familyBaseValue === FontWeightTokens_1.FONT_WEIGHT_BASE_VALUE)).toBe(true);
            expect(letterSpacingTokens.every(token => token.familyBaseValue === LetterSpacingTokens_1.LETTER_SPACING_BASE_VALUE)).toBe(true);
        });
        test('should have correct precision targeting for typography tokens', () => {
            const fontFamilyTokens = (0, FontFamilyTokens_1.getAllFontFamilyTokens)();
            const fontWeightTokens = (0, FontWeightTokens_1.getAllFontWeightTokens)();
            const letterSpacingTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
            // Font family and weight are not precision targeted
            expect(fontFamilyTokens.every(token => !token.isPrecisionTargeted)).toBe(true);
            expect(fontWeightTokens.every(token => !token.isPrecisionTargeted)).toBe(true);
            // Letter spacing is precision targeted for typography refinement
            expect(letterSpacingTokens.every(token => token.isPrecisionTargeted)).toBe(true);
        });
        test('should have appropriate platform units for typography tokens', () => {
            const fontFamilyToken = (0, FontFamilyTokens_1.getFontFamilyToken)('fontFamilySystem');
            const fontWeightToken = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight400');
            const letterSpacingToken = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing100');
            expect(fontFamilyToken?.platforms.web.unit).toBe('fontFamily');
            expect(fontWeightToken?.platforms.web.unit).toBe('fontWeight');
            expect(letterSpacingToken?.platforms.web.unit).toBe('em');
        });
        test('should maintain cross-platform consistency for typography tokens', () => {
            const fontWeightTokens = (0, FontWeightTokens_1.getAllFontWeightTokens)();
            const letterSpacingTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
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
            const fontSize = (0, FontSizeTokens_1.getFontSizeToken)('fontSize100');
            const lineHeight = (0, LineHeightTokens_1.getLineHeightToken)('lineHeight100');
            const density = (0, DensityTokens_1.getDensityToken)('densityDefault');
            const tapArea = (0, TapAreaTokens_1.getTapAreaToken)('tapAreaMinimum');
            const fontFamily = (0, FontFamilyTokens_1.getFontFamilyToken)('fontFamilySystem');
            const fontWeight = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight400');
            const letterSpacing = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing100');
            expect(fontSize?.category).toBe(PrimitiveToken_1.TokenCategory.FONT_SIZE);
            expect(lineHeight?.category).toBe(PrimitiveToken_1.TokenCategory.LINE_HEIGHT);
            expect(density?.category).toBe(PrimitiveToken_1.TokenCategory.DENSITY);
            expect(tapArea?.category).toBe(PrimitiveToken_1.TokenCategory.TAP_AREA);
            expect(fontFamily?.category).toBe(PrimitiveToken_1.TokenCategory.FONT_FAMILY);
            expect(fontWeight?.category).toBe(PrimitiveToken_1.TokenCategory.FONT_WEIGHT);
            expect(letterSpacing?.category).toBe(PrimitiveToken_1.TokenCategory.LETTER_SPACING);
        });
        test('should return undefined for invalid token names', () => {
            const invalid1 = (0, FontSizeTokens_1.getFontSizeToken)('non-existent');
            const invalid2 = (0, LineHeightTokens_1.getLineHeightToken)('invalid-name');
            const invalid3 = (0, DensityTokens_1.getDensityToken)('does-not-exist');
            const invalid4 = (0, TapAreaTokens_1.getTapAreaToken)('missing-token');
            const invalid5 = (0, FontFamilyTokens_1.getFontFamilyToken)('fontFamilyInvalid');
            const invalid6 = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight050');
            const invalid7 = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing200');
            expect(invalid1).toBeUndefined();
            expect(invalid2).toBeUndefined();
            expect(invalid3).toBeUndefined();
            expect(invalid4).toBeUndefined();
            expect(invalid5).toBeUndefined();
            expect(invalid6).toBeUndefined();
            expect(invalid7).toBeUndefined();
        });
        test('should return all tokens for category getter functions', () => {
            expect((0, FontSizeTokens_1.getAllFontSizeTokens)().length).toBeGreaterThan(0);
            expect((0, LineHeightTokens_1.getAllLineHeightTokens)().length).toBeGreaterThan(0);
            expect((0, DensityTokens_1.getAllDensityTokens)().length).toBeGreaterThan(0);
            expect((0, TapAreaTokens_1.getAllTapAreaTokens)().length).toBeGreaterThan(0);
            expect((0, SpacingTokens_1.getAllSpacingTokens)().length).toBeGreaterThan(0);
            expect((0, RadiusTokens_1.getAllRadiusTokens)().length).toBeGreaterThan(0);
            expect((0, FontFamilyTokens_1.getAllFontFamilyTokens)().length).toBeGreaterThan(0);
            expect((0, FontWeightTokens_1.getAllFontWeightTokens)().length).toBeGreaterThan(0);
            expect((0, LetterSpacingTokens_1.getAllLetterSpacingTokens)().length).toBeGreaterThan(0);
            expect((0, ColorTokens_1.getAllColorTokens)().length).toBeGreaterThan(0);
        });
    });
    describe('Color Token Integration', () => {
        test('should have correct base value and family structure for color tokens', () => {
            expect(ColorTokens_1.COLOR_BASE_VALUE).toBe(0); // N/A for hex color tokens
            const allTokens = (0, ColorTokens_1.getAllColorTokens)();
            expect(allTokens.length).toBe(49); // 9 families × 5 scales + 4 shadow families × 1 scale = 49 tokens
            expect(allTokens.every(token => token.category === PrimitiveToken_1.TokenCategory.COLOR)).toBe(true);
            expect(allTokens.every(token => token.familyBaseValue === ColorTokens_1.COLOR_BASE_VALUE)).toBe(true);
        });
        test('should have mode-aware color token structure integrated with token system', () => {
            const allTokens = (0, ColorTokens_1.getAllColorTokens)();
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
            expect(ColorTokens_1.COLOR_SCALE).toEqual([100, 200, 300, 400, 500]);
            expect(Object.keys(ColorTokens_1.COLOR_FAMILIES)).toHaveLength(13); // 9 original + 4 shadow families
            // Test that main families follow the full scale
            const mainFamilies = ['gray', 'black', 'white', 'yellow', 'orange', 'purple', 'violet', 'cyan', 'teal'];
            mainFamilies.forEach(family => {
                ColorTokens_1.COLOR_SCALE.forEach(scale => {
                    const token = (0, ColorTokens_1.getColorToken)(`${family}${scale}`);
                    expect(token).toBeDefined();
                    expect(token.name).toBe(`${family}${scale}`);
                });
            });
            // Shadow families only have 100 scale
            const shadowFamilies = ['shadowBlack', 'shadowBlue', 'shadowOrange', 'shadowGray'];
            shadowFamilies.forEach(family => {
                const token = (0, ColorTokens_1.getColorToken)(`${family}100`);
                expect(token).toBeDefined();
                expect(token.name).toBe(`${family}100`);
            });
        });
        test('should support mode-aware color resolution in token system integration', () => {
            const testToken = (0, ColorTokens_1.getColorToken)('purple300');
            // Test integration with resolveColorTokenValue utility
            const lightBase = (0, ColorTokens_1.resolveColorTokenValue)(testToken, 'light', 'base');
            const lightWcag = (0, ColorTokens_1.resolveColorTokenValue)(testToken, 'light', 'wcag');
            const darkBase = (0, ColorTokens_1.resolveColorTokenValue)(testToken, 'dark', 'base');
            const darkWcag = (0, ColorTokens_1.resolveColorTokenValue)(testToken, 'dark', 'wcag');
            expect(lightBase).toMatch(/^#[0-9A-F]{6}$/i);
            expect(lightWcag).toMatch(/^#[0-9A-F]{6}$/i);
            expect(darkBase).toMatch(/^#[0-9A-F]{6}$/i);
            expect(darkWcag).toMatch(/^#[0-9A-F]{6}$/i);
        });
        test('should maintain cross-platform consistency for mode-aware color tokens', () => {
            const allTokens = (0, ColorTokens_1.getAllColorTokens)();
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
            const allTokens = (0, ColorTokens_1.getAllColorTokens)();
            // Color tokens should not be precision targeted (like spacing/radius)
            expect(allTokens.every(token => !token.isPrecisionTargeted)).toBe(true);
            // Color tokens should not have baseline grid alignment (like typography)
            expect(allTokens.every(token => !token.baselineGridAlignment)).toBe(true);
            // Color tokens should not be strategic flexibility (different from spacing/radius)
            expect(allTokens.every(token => !token.isStrategicFlexibility)).toBe(true);
        });
        test('should have consistent mathematical relationship descriptions across color families', () => {
            // Test main families with full scale
            const mainFamilies = ['gray', 'black', 'white', 'yellow', 'orange', 'purple', 'violet', 'cyan', 'teal'];
            mainFamilies.forEach(family => {
                ColorTokens_1.COLOR_SCALE.forEach(scale => {
                    const token = (0, ColorTokens_1.getColorToken)(`${family}${scale}`);
                    expect(token.mathematicalRelationship).toContain(`Systematic ${family} scale progression`);
                });
            });
            // Test shadow families (only 100 scale, different description pattern)
            const shadowFamilies = ['shadowBlack', 'shadowBlue', 'shadowOrange', 'shadowGray'];
            shadowFamilies.forEach(family => {
                const token = (0, ColorTokens_1.getColorToken)(`${family}100`);
                expect(token.mathematicalRelationship).toContain(`Systematic shadow color family`);
            });
        });
    });
});
//# sourceMappingURL=TokenCategories.test.js.map