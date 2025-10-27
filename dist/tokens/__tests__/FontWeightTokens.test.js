"use strict";
/**
 * Font Weight Tokens Unit Tests
 *
 * Tests for font weight token numeric progression and mathematical relationships.
 * Validates standard font weight values and cross-platform consistency.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const PrimitiveToken_1 = require("../../types/PrimitiveToken");
const FontWeightTokens_1 = require("../FontWeightTokens");
describe('Font Weight Tokens', () => {
    describe('Token Structure and Organization', () => {
        test('should have correct base value', () => {
            expect(FontWeightTokens_1.FONT_WEIGHT_BASE_VALUE).toBe(400);
        });
        test('should have correct token category for all font weight tokens', () => {
            const allTokens = (0, FontWeightTokens_1.getAllFontWeightTokens)();
            expect(allTokens.length).toBeGreaterThan(0);
            expect(allTokens.every(token => token.category === PrimitiveToken_1.TokenCategory.FONT_WEIGHT)).toBe(true);
            expect(allTokens.every(token => token.familyBaseValue === FontWeightTokens_1.FONT_WEIGHT_BASE_VALUE)).toBe(true);
        });
        test('should have consistent token naming pattern', () => {
            const tokenNames = FontWeightTokens_1.fontWeightTokenNames;
            expect(tokenNames).toContain('fontWeight100');
            expect(tokenNames).toContain('fontWeight200');
            expect(tokenNames).toContain('fontWeight300');
            expect(tokenNames).toContain('fontWeight400');
            expect(tokenNames).toContain('fontWeight500');
            expect(tokenNames).toContain('fontWeight600');
            expect(tokenNames).toContain('fontWeight700');
            expect(tokenNames).toContain('fontWeight800');
            expect(tokenNames).toContain('fontWeight900');
            // All names should start with 'fontWeight' and end with numeric value
            expect(tokenNames.every(name => name.startsWith('fontWeight'))).toBe(true);
            expect(tokenNames.every(name => /\d{3}$/.test(name))).toBe(true);
        });
        test('should not be strategic flexibility or precision targeted', () => {
            const allTokens = (0, FontWeightTokens_1.getAllFontWeightTokens)();
            expect(allTokens.every(token => !token.isStrategicFlexibility)).toBe(true);
            expect(allTokens.every(token => !token.isPrecisionTargeted)).toBe(true);
        });
        test('should not require baseline grid alignment', () => {
            const allTokens = (0, FontWeightTokens_1.getAllFontWeightTokens)();
            expect(allTokens.every(token => !token.baselineGridAlignment)).toBe(true);
        });
    });
    describe('Standard Font Weight Progression', () => {
        test('should include complete 100-900 weight range', () => {
            const expectedWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
            const actualWeights = (0, FontWeightTokens_1.getAllFontWeightTokens)().map(token => token.baseValue).sort((a, b) => a - b);
            expect(actualWeights).toEqual(expectedWeights);
        });
        test('should have 400 as base weight', () => {
            const fontWeight400 = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight400');
            expect(fontWeight400).toBeDefined();
            expect(fontWeight400?.baseValue).toBe(FontWeightTokens_1.FONT_WEIGHT_BASE_VALUE);
            expect(fontWeight400?.description).toContain('base unit');
        });
        test('should have correct weight values for each token', () => {
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight100')?.baseValue).toBe(100);
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight200')?.baseValue).toBe(200);
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight300')?.baseValue).toBe(300);
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight400')?.baseValue).toBe(400);
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight500')?.baseValue).toBe(500);
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight600')?.baseValue).toBe(600);
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight700')?.baseValue).toBe(700);
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight800')?.baseValue).toBe(800);
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight900')?.baseValue).toBe(900);
        });
        test('should have appropriate semantic descriptions', () => {
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight100')?.description).toContain('Thin');
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight200')?.description).toContain('Extra light');
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight300')?.description).toContain('Light');
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight400')?.description).toContain('Normal');
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight500')?.description).toContain('Medium');
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight600')?.description).toContain('Semi-bold');
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight700')?.description).toContain('Bold');
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight800')?.description).toContain('Extra bold');
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight900')?.description).toContain('Black');
        });
    });
    describe('Mathematical Relationships', () => {
        test('should have correct mathematical relationships from base 400', () => {
            const fontWeight100 = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight100');
            const fontWeight200 = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight200');
            const fontWeight300 = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight300');
            const fontWeight400 = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight400');
            const fontWeight500 = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight500');
            const fontWeight600 = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight600');
            const fontWeight700 = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight700');
            const fontWeight800 = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight800');
            const fontWeight900 = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight900');
            expect(fontWeight100?.mathematicalRelationship).toContain('base × 0.25 = 400 × 0.25 = 100');
            expect(fontWeight200?.mathematicalRelationship).toContain('base × 0.5 = 400 × 0.5 = 200');
            expect(fontWeight300?.mathematicalRelationship).toContain('base × 0.75 = 400 × 0.75 = 300');
            expect(fontWeight400?.mathematicalRelationship).toContain('base × 1 = 400 × 1 = 400');
            expect(fontWeight500?.mathematicalRelationship).toContain('base × 1.25 = 400 × 1.25 = 500');
            expect(fontWeight600?.mathematicalRelationship).toContain('base × 1.5 = 400 × 1.5 = 600');
            expect(fontWeight700?.mathematicalRelationship).toContain('base × 1.75 = 400 × 1.75 = 700');
            expect(fontWeight800?.mathematicalRelationship).toContain('base × 2 = 400 × 2 = 800');
            expect(fontWeight900?.mathematicalRelationship).toContain('base × 2.25 = 400 × 2.25 = 900');
        });
        test('should maintain proportional relationships', () => {
            const base = FontWeightTokens_1.FONT_WEIGHT_BASE_VALUE;
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight100')?.baseValue).toBe(base * 0.25);
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight200')?.baseValue).toBe(base * 0.5);
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight300')?.baseValue).toBe(base * 0.75);
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight400')?.baseValue).toBe(base * 1);
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight500')?.baseValue).toBe(base * 1.25);
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight600')?.baseValue).toBe(base * 1.5);
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight700')?.baseValue).toBe(base * 1.75);
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight800')?.baseValue).toBe(base * 2);
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight900')?.baseValue).toBe(base * 2.25);
        });
        test('should have consistent mathematical progression', () => {
            const allTokens = (0, FontWeightTokens_1.getAllFontWeightTokens)().sort((a, b) => a.baseValue - b.baseValue);
            // Check that weights increase in 100-unit increments
            for (let i = 1; i < allTokens.length; i++) {
                const difference = allTokens[i].baseValue - allTokens[i - 1].baseValue;
                expect(difference).toBe(100);
            }
        });
    });
    describe('Cross-Platform Consistency', () => {
        test('should have identical numeric values across all platforms', () => {
            const allTokens = (0, FontWeightTokens_1.getAllFontWeightTokens)();
            allTokens.forEach(token => {
                const webValue = token.platforms.web.value;
                const iosValue = token.platforms.ios.value;
                const androidValue = token.platforms.android.value;
                expect(webValue).toBe(iosValue);
                expect(iosValue).toBe(androidValue);
                expect(webValue).toBe(androidValue);
                expect(webValue).toBe(token.baseValue);
            });
        });
        test('should use fontWeight unit type across all platforms', () => {
            const allTokens = (0, FontWeightTokens_1.getAllFontWeightTokens)();
            allTokens.forEach(token => {
                expect(token.platforms.web.unit).toBe('fontWeight');
                expect(token.platforms.ios.unit).toBe('fontWeight');
                expect(token.platforms.android.unit).toBe('fontWeight');
            });
        });
        test('should maintain numeric type for all platform values', () => {
            const allTokens = (0, FontWeightTokens_1.getAllFontWeightTokens)();
            allTokens.forEach(token => {
                expect(typeof token.platforms.web.value).toBe('number');
                expect(typeof token.platforms.ios.value).toBe('number');
                expect(typeof token.platforms.android.value).toBe('number');
            });
        });
    });
    describe('Token Retrieval Functions', () => {
        test('should retrieve tokens by name correctly', () => {
            const fontWeight100 = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight100');
            const fontWeight400 = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight400');
            const fontWeight700 = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight700');
            const fontWeight900 = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight900');
            expect(fontWeight100?.name).toBe('fontWeight100');
            expect(fontWeight400?.name).toBe('fontWeight400');
            expect(fontWeight700?.name).toBe('fontWeight700');
            expect(fontWeight900?.name).toBe('fontWeight900');
        });
        test('should return undefined for non-existent tokens', () => {
            const nonExistent = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight050');
            const invalid = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight1000');
            const wrongFormat = (0, FontWeightTokens_1.getFontWeightToken)('weight400');
            expect(nonExistent).toBeUndefined();
            expect(invalid).toBeUndefined();
            expect(wrongFormat).toBeUndefined();
        });
        test('should return all tokens via getAllFontWeightTokens', () => {
            const allTokens = (0, FontWeightTokens_1.getAllFontWeightTokens)();
            const tokenNames = FontWeightTokens_1.fontWeightTokenNames;
            expect(allTokens.length).toBe(tokenNames.length);
            expect(allTokens.length).toBe(9); // 100-900 in 100 increments
            expect(allTokens.every(token => tokenNames.includes(token.name))).toBe(true);
        });
        test('should have consistent token names array', () => {
            const tokenNames = FontWeightTokens_1.fontWeightTokenNames;
            const tokenKeys = Object.keys(FontWeightTokens_1.fontWeightTokens);
            expect(tokenNames.sort()).toEqual(tokenKeys.sort());
        });
    });
    describe('Font Weight Usage Patterns', () => {
        test('should provide common weight variations', () => {
            // Most common weights should be available
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight300')).toBeDefined(); // Light
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight400')).toBeDefined(); // Normal
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight500')).toBeDefined(); // Medium
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight600')).toBeDefined(); // Semi-bold
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight700')).toBeDefined(); // Bold
        });
        test('should support extreme weights for special cases', () => {
            // Extreme weights for special typography needs
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight100')).toBeDefined(); // Thin
            expect((0, FontWeightTokens_1.getFontWeightToken)('fontWeight900')).toBeDefined(); // Black
        });
        test('should have base weight as normal reading weight', () => {
            const baseWeight = (0, FontWeightTokens_1.getFontWeightToken)('fontWeight400');
            expect(baseWeight?.baseValue).toBe(400);
            expect(baseWeight?.description).toContain('Normal');
            expect(baseWeight?.description).toContain('base unit');
        });
    });
    describe('Integration with Token System', () => {
        test('should integrate with token registry structure', () => {
            const allTokens = (0, FontWeightTokens_1.getAllFontWeightTokens)();
            // All tokens should have required PrimitiveToken interface properties
            allTokens.forEach(token => {
                expect(token).toHaveProperty('name');
                expect(token).toHaveProperty('category');
                expect(token).toHaveProperty('baseValue');
                expect(token).toHaveProperty('familyBaseValue');
                expect(token).toHaveProperty('description');
                expect(token).toHaveProperty('mathematicalRelationship');
                expect(token).toHaveProperty('baselineGridAlignment');
                expect(token).toHaveProperty('isStrategicFlexibility');
                expect(token).toHaveProperty('isPrecisionTargeted');
                expect(token).toHaveProperty('platforms');
            });
        });
        test('should have valid platform values structure', () => {
            const allTokens = (0, FontWeightTokens_1.getAllFontWeightTokens)();
            allTokens.forEach(token => {
                expect(token.platforms).toHaveProperty('web');
                expect(token.platforms).toHaveProperty('ios');
                expect(token.platforms).toHaveProperty('android');
                expect(token.platforms.web).toHaveProperty('value');
                expect(token.platforms.web).toHaveProperty('unit');
                expect(token.platforms.ios).toHaveProperty('value');
                expect(token.platforms.ios).toHaveProperty('unit');
                expect(token.platforms.android).toHaveProperty('value');
                expect(token.platforms.android).toHaveProperty('unit');
            });
        });
        test('should maintain mathematical consistency with family base value', () => {
            const allTokens = (0, FontWeightTokens_1.getAllFontWeightTokens)();
            allTokens.forEach(token => {
                expect(token.familyBaseValue).toBe(FontWeightTokens_1.FONT_WEIGHT_BASE_VALUE);
                // Mathematical relationship should reference the family base value
                expect(token.mathematicalRelationship).toContain('400');
            });
        });
    });
    describe('Font Weight Standards Compliance', () => {
        test('should follow CSS font-weight standard values', () => {
            const standardWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
            const tokenWeights = (0, FontWeightTokens_1.getAllFontWeightTokens)().map(token => token.baseValue).sort((a, b) => a - b);
            expect(tokenWeights).toEqual(standardWeights);
        });
        test('should use standard font weight terminology', () => {
            const descriptions = (0, FontWeightTokens_1.getAllFontWeightTokens)().map(token => token.description.toLowerCase());
            expect(descriptions.some(desc => desc.includes('thin'))).toBe(true);
            expect(descriptions.some(desc => desc.includes('light'))).toBe(true);
            expect(descriptions.some(desc => desc.includes('normal'))).toBe(true);
            expect(descriptions.some(desc => desc.includes('medium'))).toBe(true);
            expect(descriptions.some(desc => desc.includes('bold'))).toBe(true);
            expect(descriptions.some(desc => desc.includes('black'))).toBe(true);
        });
        test('should provide appropriate weight distribution', () => {
            const allTokens = (0, FontWeightTokens_1.getAllFontWeightTokens)();
            const baseWeight = 400;
            const lighterWeights = allTokens.filter(token => token.baseValue < baseWeight);
            const heavierWeights = allTokens.filter(token => token.baseValue > baseWeight);
            expect(lighterWeights.length).toBe(3); // 100, 200, 300
            expect(heavierWeights.length).toBe(5); // 500, 600, 700, 800, 900
        });
    });
});
//# sourceMappingURL=FontWeightTokens.test.js.map