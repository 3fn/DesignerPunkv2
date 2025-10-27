"use strict";
/**
 * Letter Spacing Tokens Unit Tests
 *
 * Tests for letter spacing token precision targeting and em-based values.
 * Validates typography refinement adjustments and cross-platform consistency.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const PrimitiveToken_1 = require("../../types/PrimitiveToken");
const LetterSpacingTokens_1 = require("../LetterSpacingTokens");
describe('Letter Spacing Tokens', () => {
    describe('Token Structure and Organization', () => {
        test('should have correct base value', () => {
            expect(LetterSpacingTokens_1.LETTER_SPACING_BASE_VALUE).toBe(0);
        });
        test('should have correct token category for all letter spacing tokens', () => {
            const allTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
            expect(allTokens.length).toBeGreaterThan(0);
            expect(allTokens.every(token => token.category === PrimitiveToken_1.TokenCategory.LETTER_SPACING)).toBe(true);
            expect(allTokens.every(token => token.familyBaseValue === LetterSpacingTokens_1.LETTER_SPACING_BASE_VALUE)).toBe(true);
        });
        test('should have consistent token naming pattern', () => {
            const tokenNames = LetterSpacingTokens_1.letterSpacingTokenNames;
            expect(tokenNames).toContain('letterSpacing025');
            expect(tokenNames).toContain('letterSpacing050');
            expect(tokenNames).toContain('letterSpacing100');
            expect(tokenNames).toContain('letterSpacing125');
            expect(tokenNames).toContain('letterSpacing150');
            // All names should start with 'letterSpacing'
            expect(tokenNames.every(name => name.startsWith('letterSpacing'))).toBe(true);
        });
        test('should be precision targeted for typography refinement', () => {
            const allTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
            expect(allTokens.every(token => token.isPrecisionTargeted)).toBe(true);
        });
        test('should not be strategic flexibility tokens', () => {
            const allTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
            expect(allTokens.every(token => !token.isStrategicFlexibility)).toBe(true);
        });
        test('should not require baseline grid alignment', () => {
            const allTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
            expect(allTokens.every(token => !token.baselineGridAlignment)).toBe(true);
        });
    });
    describe('Em-Based Value Progression', () => {
        test('should have 0 as base letter spacing', () => {
            const letterSpacing100 = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing100');
            expect(letterSpacing100).toBeDefined();
            expect(letterSpacing100?.baseValue).toBe(LetterSpacingTokens_1.LETTER_SPACING_BASE_VALUE);
            expect(letterSpacing100?.description).toContain('base unit');
        });
        test('should have correct em-based values for each token', () => {
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing025')?.baseValue).toBe(-0.025);
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing050')?.baseValue).toBe(-0.05);
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing100')?.baseValue).toBe(0);
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing125')?.baseValue).toBe(0.025);
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing150')?.baseValue).toBe(0.05);
        });
        test('should provide both tight and loose spacing options', () => {
            const allTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
            const baseValue = LetterSpacingTokens_1.LETTER_SPACING_BASE_VALUE;
            const tightSpacing = allTokens.filter(token => token.baseValue < baseValue);
            const looseSpacing = allTokens.filter(token => token.baseValue > baseValue);
            expect(tightSpacing.length).toBe(2); // 025, 050 (negative values)
            expect(looseSpacing.length).toBe(2); // 125, 150 (positive values)
        });
        test('should have appropriate semantic descriptions', () => {
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing025')?.description).toContain('Tight letter spacing');
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing050')?.description).toContain('Very tight letter spacing');
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing100')?.description).toContain('Normal letter spacing');
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing125')?.description).toContain('Loose letter spacing');
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing150')?.description).toContain('Very loose letter spacing');
        });
        test('should reference appropriate use cases in descriptions', () => {
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing025')?.description).toContain('large text');
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing050')?.description).toContain('display text');
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing125')?.description).toContain('small text');
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing150')?.description).toContain('emphasis');
        });
    });
    describe('Mathematical Relationships', () => {
        test('should have correct mathematical relationships from base 0', () => {
            const letterSpacing025 = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing025');
            const letterSpacing050 = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing050');
            const letterSpacing100 = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing100');
            const letterSpacing125 = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing125');
            const letterSpacing150 = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing150');
            expect(letterSpacing025?.mathematicalRelationship).toContain('base - 0.025 = 0 - 0.025 = -0.025');
            expect(letterSpacing050?.mathematicalRelationship).toContain('base - 0.05 = 0 - 0.05 = -0.05');
            expect(letterSpacing100?.mathematicalRelationship).toContain('base × 1 = 0 × 1 = 0');
            expect(letterSpacing125?.mathematicalRelationship).toContain('base + 0.025 = 0 + 0.025 = 0.025');
            expect(letterSpacing150?.mathematicalRelationship).toContain('base + 0.05 = 0 + 0.05 = 0.05');
        });
        test('should maintain symmetric progression around base value', () => {
            const base = LetterSpacingTokens_1.LETTER_SPACING_BASE_VALUE;
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing025')?.baseValue).toBe(base - 0.025);
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing050')?.baseValue).toBe(base - 0.05);
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing100')?.baseValue).toBe(base);
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing125')?.baseValue).toBe(base + 0.025);
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing150')?.baseValue).toBe(base + 0.05);
        });
        test('should use consistent increment values', () => {
            const increment = 0.025;
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing025')?.baseValue).toBe(-increment);
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing050')?.baseValue).toBe(-increment * 2);
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing125')?.baseValue).toBe(increment);
            expect((0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing150')?.baseValue).toBe(increment * 2);
        });
    });
    describe('Cross-Platform Consistency', () => {
        test('should have identical em values across all platforms', () => {
            const allTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
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
        test('should use em unit type across all platforms', () => {
            const allTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
            allTokens.forEach(token => {
                expect(token.platforms.web.unit).toBe('em');
                expect(token.platforms.ios.unit).toBe('em');
                expect(token.platforms.android.unit).toBe('em');
            });
        });
        test('should maintain numeric type for all platform values', () => {
            const allTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
            allTokens.forEach(token => {
                expect(typeof token.platforms.web.value).toBe('number');
                expect(typeof token.platforms.ios.value).toBe('number');
                expect(typeof token.platforms.android.value).toBe('number');
            });
        });
    });
    describe('Precision Targeting for Typography', () => {
        test('should provide fine-grained adjustments', () => {
            const allTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
            const values = allTokens.map(token => Math.abs(token.baseValue)).filter(val => val > 0);
            // Should use small increments for precise typography control
            expect(Math.max(...values)).toBeLessThanOrEqual(0.05);
            expect(Math.min(...values)).toBe(0.025);
        });
        test('should support both tightening and loosening', () => {
            const negativeValues = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)().filter(token => token.baseValue < 0);
            const positiveValues = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)().filter(token => token.baseValue > 0);
            expect(negativeValues.length).toBeGreaterThan(0);
            expect(positiveValues.length).toBeGreaterThan(0);
        });
        test('should be marked as precision targeted', () => {
            const allTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
            expect(allTokens.every(token => token.isPrecisionTargeted)).toBe(true);
        });
    });
    describe('Token Retrieval Functions', () => {
        test('should retrieve tokens by name correctly', () => {
            const letterSpacing025 = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing025');
            const letterSpacing100 = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing100');
            const letterSpacing150 = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing150');
            expect(letterSpacing025?.name).toBe('letterSpacing025');
            expect(letterSpacing100?.name).toBe('letterSpacing100');
            expect(letterSpacing150?.name).toBe('letterSpacing150');
        });
        test('should return undefined for non-existent tokens', () => {
            const nonExistent = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing075');
            const invalid = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing200');
            const wrongFormat = (0, LetterSpacingTokens_1.getLetterSpacingToken)('spacing100');
            expect(nonExistent).toBeUndefined();
            expect(invalid).toBeUndefined();
            expect(wrongFormat).toBeUndefined();
        });
        test('should return all tokens via getAllLetterSpacingTokens', () => {
            const allTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
            const tokenNames = LetterSpacingTokens_1.letterSpacingTokenNames;
            expect(allTokens.length).toBe(tokenNames.length);
            expect(allTokens.length).toBe(5); // 025, 050, 100, 125, 150
            expect(allTokens.every(token => tokenNames.includes(token.name))).toBe(true);
        });
        test('should have consistent token names array', () => {
            const tokenNames = LetterSpacingTokens_1.letterSpacingTokenNames;
            const tokenKeys = Object.keys(LetterSpacingTokens_1.letterSpacingTokens);
            expect(tokenNames.sort()).toEqual(tokenKeys.sort());
        });
    });
    describe('Typography Use Cases', () => {
        test('should support display typography with tight spacing', () => {
            const tightSpacing = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing025');
            const veryTightSpacing = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing050');
            expect(tightSpacing?.baseValue).toBeLessThan(0);
            expect(veryTightSpacing?.baseValue).toBeLessThan(0);
            expect(tightSpacing?.description).toContain('large text');
            expect(veryTightSpacing?.description).toContain('display text');
        });
        test('should support small text with loose spacing', () => {
            const looseSpacing = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing125');
            const veryLooseSpacing = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing150');
            expect(looseSpacing?.baseValue).toBeGreaterThan(0);
            expect(veryLooseSpacing?.baseValue).toBeGreaterThan(0);
            expect(looseSpacing?.description).toContain('small text');
            expect(veryLooseSpacing?.description).toContain('emphasis');
        });
        test('should provide normal spacing as baseline', () => {
            const normalSpacing = (0, LetterSpacingTokens_1.getLetterSpacingToken)('letterSpacing100');
            expect(normalSpacing?.baseValue).toBe(0);
            expect(normalSpacing?.description).toContain('Normal');
            expect(normalSpacing?.description).toContain('base unit');
        });
    });
    describe('Integration with Token System', () => {
        test('should integrate with token registry structure', () => {
            const allTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
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
            const allTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
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
            const allTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
            allTokens.forEach(token => {
                expect(token.familyBaseValue).toBe(LetterSpacingTokens_1.LETTER_SPACING_BASE_VALUE);
                // Mathematical relationship should reference the family base value
                expect(token.mathematicalRelationship).toContain('0');
            });
        });
    });
    describe('Em-Based Unit Standards', () => {
        test('should use relative em units for scalability', () => {
            const allTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
            allTokens.forEach(token => {
                expect(token.platforms.web.unit).toBe('em');
                expect(token.platforms.ios.unit).toBe('em');
                expect(token.platforms.android.unit).toBe('em');
            });
        });
        test('should provide appropriate range for typography', () => {
            const allTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
            const values = allTokens.map(token => token.baseValue);
            const minValue = Math.min(...values);
            const maxValue = Math.max(...values);
            expect(minValue).toBe(-0.05); // Tightest spacing
            expect(maxValue).toBe(0.05); // Loosest spacing
            // Range should be appropriate for typography (not too extreme)
            expect(maxValue - minValue).toBe(0.1);
        });
        test('should maintain precision for fine typography control', () => {
            const allTokens = (0, LetterSpacingTokens_1.getAllLetterSpacingTokens)();
            allTokens.forEach(token => {
                // Values should be precise to 3 decimal places
                const decimalPlaces = (token.baseValue.toString().split('.')[1] || '').length;
                expect(decimalPlaces).toBeLessThanOrEqual(3);
            });
        });
    });
});
//# sourceMappingURL=LetterSpacingTokens.test.js.map