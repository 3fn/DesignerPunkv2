"use strict";
/**
 * Spacing Tokens Formula Validation Tests
 *
 * Validates that refactored formulas produce the same values as original hard values.
 * This ensures the refactoring from hard values to formulas is correct.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const SpacingTokens_1 = require("../SpacingTokens");
const StrategicFlexibilityTokens_1 = require("../../constants/StrategicFlexibilityTokens");
describe('SpacingTokens Formula Validation', () => {
    /**
     * Original hard values before refactoring to formulas
     */
    const originalValues = {
        space025: 2,
        space050: 4,
        space075: 6,
        space100: 8,
        space125: 10,
        space150: 12,
        space200: 16,
        space250: 20,
        space300: 24,
        space400: 32,
        space500: 40,
        space600: 48
    };
    describe('Formula Results Match Original Values', () => {
        it('should calculate space025 correctly (SPACING_BASE_VALUE * 0.25)', () => {
            const expected = originalValues.space025;
            const calculated = SpacingTokens_1.SPACING_BASE_VALUE * 0.25;
            expect(calculated).toBe(expected);
            expect(SpacingTokens_1.spacingTokens.space025.baseValue).toBe(expected);
        });
        it('should calculate space050 correctly (SPACING_BASE_VALUE * 0.5)', () => {
            const expected = originalValues.space050;
            const calculated = SpacingTokens_1.SPACING_BASE_VALUE * 0.5;
            expect(calculated).toBe(expected);
            expect(SpacingTokens_1.spacingTokens.space050.baseValue).toBe(expected);
        });
        it('should preserve space075 strategic flexibility value', () => {
            const expected = originalValues.space075;
            const calculated = StrategicFlexibilityTokens_1.STRATEGIC_FLEXIBILITY_TOKENS.space075.value;
            expect(calculated).toBe(expected);
            expect(SpacingTokens_1.spacingTokens.space075.baseValue).toBe(expected);
            expect(SpacingTokens_1.spacingTokens.space075.isStrategicFlexibility).toBe(true);
        });
        it('should calculate space100 correctly (SPACING_BASE_VALUE)', () => {
            const expected = originalValues.space100;
            const calculated = SpacingTokens_1.SPACING_BASE_VALUE;
            expect(calculated).toBe(expected);
            expect(SpacingTokens_1.spacingTokens.space100.baseValue).toBe(expected);
        });
        it('should preserve space125 strategic flexibility value', () => {
            const expected = originalValues.space125;
            const calculated = StrategicFlexibilityTokens_1.STRATEGIC_FLEXIBILITY_TOKENS.space125.value;
            expect(calculated).toBe(expected);
            expect(SpacingTokens_1.spacingTokens.space125.baseValue).toBe(expected);
            expect(SpacingTokens_1.spacingTokens.space125.isStrategicFlexibility).toBe(true);
        });
        it('should calculate space150 correctly (SPACING_BASE_VALUE * 1.5)', () => {
            const expected = originalValues.space150;
            const calculated = SpacingTokens_1.SPACING_BASE_VALUE * 1.5;
            expect(calculated).toBe(expected);
            expect(SpacingTokens_1.spacingTokens.space150.baseValue).toBe(expected);
        });
        it('should calculate space200 correctly (SPACING_BASE_VALUE * 2)', () => {
            const expected = originalValues.space200;
            const calculated = SpacingTokens_1.SPACING_BASE_VALUE * 2;
            expect(calculated).toBe(expected);
            expect(SpacingTokens_1.spacingTokens.space200.baseValue).toBe(expected);
        });
        it('should preserve space250 strategic flexibility value', () => {
            const expected = originalValues.space250;
            const calculated = StrategicFlexibilityTokens_1.STRATEGIC_FLEXIBILITY_TOKENS.space250.value;
            expect(calculated).toBe(expected);
            expect(SpacingTokens_1.spacingTokens.space250.baseValue).toBe(expected);
            expect(SpacingTokens_1.spacingTokens.space250.isStrategicFlexibility).toBe(true);
        });
        it('should calculate space300 correctly (SPACING_BASE_VALUE * 3)', () => {
            const expected = originalValues.space300;
            const calculated = SpacingTokens_1.SPACING_BASE_VALUE * 3;
            expect(calculated).toBe(expected);
            expect(SpacingTokens_1.spacingTokens.space300.baseValue).toBe(expected);
        });
        it('should calculate space400 correctly (SPACING_BASE_VALUE * 4)', () => {
            const expected = originalValues.space400;
            const calculated = SpacingTokens_1.SPACING_BASE_VALUE * 4;
            expect(calculated).toBe(expected);
            expect(SpacingTokens_1.spacingTokens.space400.baseValue).toBe(expected);
        });
        it('should calculate space500 correctly (SPACING_BASE_VALUE * 5)', () => {
            const expected = originalValues.space500;
            const calculated = SpacingTokens_1.SPACING_BASE_VALUE * 5;
            expect(calculated).toBe(expected);
            expect(SpacingTokens_1.spacingTokens.space500.baseValue).toBe(expected);
        });
        it('should calculate space600 correctly (SPACING_BASE_VALUE * 6)', () => {
            const expected = originalValues.space600;
            const calculated = SpacingTokens_1.SPACING_BASE_VALUE * 6;
            expect(calculated).toBe(expected);
            expect(SpacingTokens_1.spacingTokens.space600.baseValue).toBe(expected);
        });
    });
    describe('100% Match Rate Verification', () => {
        it('should have 100% match rate across all spacing tokens', () => {
            const tokenNames = Object.keys(originalValues);
            const totalTokens = tokenNames.length;
            let matchedTokens = 0;
            const mismatches = [];
            tokenNames.forEach((tokenName) => {
                const expected = originalValues[tokenName];
                const actual = SpacingTokens_1.spacingTokens[tokenName].baseValue;
                if (actual === expected) {
                    matchedTokens++;
                }
                else {
                    mismatches.push({ token: tokenName, expected, actual });
                }
            });
            const matchRate = (matchedTokens / totalTokens) * 100;
            // Report any mismatches
            if (mismatches.length > 0) {
                console.error('Formula validation mismatches:');
                mismatches.forEach(({ token, expected, actual }) => {
                    console.error(`  ${token}: expected ${expected}, got ${actual}`);
                });
            }
            expect(matchRate).toBe(100);
            expect(mismatches).toHaveLength(0);
        });
    });
    describe('Platform Values Match Formula Results', () => {
        it('should generate correct platform values for all tokens', () => {
            Object.entries(originalValues).forEach(([tokenName, expectedValue]) => {
                const token = SpacingTokens_1.spacingTokens[tokenName];
                expect(token.platforms.web.value).toBe(expectedValue);
                expect(token.platforms.web.unit).toBe('px');
                expect(token.platforms.ios.value).toBe(expectedValue);
                expect(token.platforms.ios.unit).toBe('pt');
                expect(token.platforms.android.value).toBe(expectedValue);
                expect(token.platforms.android.unit).toBe('dp');
            });
        });
    });
    describe('Strategic Flexibility Tokens Preserved', () => {
        it('should preserve space075 as strategic flexibility token', () => {
            expect(SpacingTokens_1.spacingTokens.space075.isStrategicFlexibility).toBe(true);
            expect(SpacingTokens_1.spacingTokens.space075.baseValue).toBe(StrategicFlexibilityTokens_1.STRATEGIC_FLEXIBILITY_TOKENS.space075.value);
        });
        it('should preserve space125 as strategic flexibility token', () => {
            expect(SpacingTokens_1.spacingTokens.space125.isStrategicFlexibility).toBe(true);
            expect(SpacingTokens_1.spacingTokens.space125.baseValue).toBe(StrategicFlexibilityTokens_1.STRATEGIC_FLEXIBILITY_TOKENS.space125.value);
        });
        it('should preserve space250 as strategic flexibility token', () => {
            expect(SpacingTokens_1.spacingTokens.space250.isStrategicFlexibility).toBe(true);
            expect(SpacingTokens_1.spacingTokens.space250.baseValue).toBe(StrategicFlexibilityTokens_1.STRATEGIC_FLEXIBILITY_TOKENS.space250.value);
        });
    });
});
//# sourceMappingURL=SpacingTokensFormulaValidation.test.js.map