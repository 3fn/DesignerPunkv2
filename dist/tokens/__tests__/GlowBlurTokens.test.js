"use strict";
/**
 * Glow Blur Token Tests
 *
 * Tests for glow blur primitive tokens to verify:
 * - Token structure and metadata
 * - Mathematical relationships
 * - Baseline grid alignment
 * - Helper function behavior
 */
Object.defineProperty(exports, "__esModule", { value: true });
const GlowBlurTokens_1 = require("../GlowBlurTokens");
const PrimitiveToken_1 = require("../../types/PrimitiveToken");
describe('GlowBlurTokens', () => {
    describe('Constants', () => {
        test('GLOW_BLUR_BASE_VALUE should be 8', () => {
            expect(GlowBlurTokens_1.GLOW_BLUR_BASE_VALUE).toBe(8);
        });
    });
    describe('Token Structure', () => {
        test('should have 5 glow blur tokens', () => {
            expect(Object.keys(GlowBlurTokens_1.glowBlur)).toHaveLength(5);
            expect(GlowBlurTokens_1.glowBlurNames).toHaveLength(5);
        });
        test('should have correct token names', () => {
            const expectedNames = ['glowBlur100', 'glowBlur200', 'glowBlur300', 'glowBlur400', 'glowBlur500'];
            expect(GlowBlurTokens_1.glowBlurNames).toEqual(expectedNames);
        });
        test('all tokens should have GLOW category', () => {
            Object.values(GlowBlurTokens_1.glowBlur).forEach(token => {
                expect(token.category).toBe(PrimitiveToken_1.TokenCategory.GLOW);
            });
        });
        test('all tokens should have familyBaseValue of 8', () => {
            Object.values(GlowBlurTokens_1.glowBlur).forEach(token => {
                expect(token.familyBaseValue).toBe(GlowBlurTokens_1.GLOW_BLUR_BASE_VALUE);
            });
        });
    });
    describe('Mathematical Relationships', () => {
        test('glowBlur100 should be base value (8)', () => {
            const token = GlowBlurTokens_1.glowBlur.glowBlur100;
            expect(token.baseValue).toBe(8);
            expect(token.mathematicalRelationship).toBe('base × 1 = 8 × 1 = 8');
        });
        test('glowBlur200 should be base × 2 (16)', () => {
            const token = GlowBlurTokens_1.glowBlur.glowBlur200;
            expect(token.baseValue).toBe(16);
            expect(token.mathematicalRelationship).toBe('base × 2 = 8 × 2 = 16');
        });
        test('glowBlur300 should be base × 3 (24)', () => {
            const token = GlowBlurTokens_1.glowBlur.glowBlur300;
            expect(token.baseValue).toBe(24);
            expect(token.mathematicalRelationship).toBe('base × 3 = 8 × 3 = 24');
        });
        test('glowBlur400 should be base × 4 (32)', () => {
            const token = GlowBlurTokens_1.glowBlur.glowBlur400;
            expect(token.baseValue).toBe(32);
            expect(token.mathematicalRelationship).toBe('base × 4 = 8 × 4 = 32');
        });
        test('glowBlur500 should be base × 5 (40)', () => {
            const token = GlowBlurTokens_1.glowBlur.glowBlur500;
            expect(token.baseValue).toBe(40);
            expect(token.mathematicalRelationship).toBe('base × 5 = 8 × 5 = 40');
        });
    });
    describe('Baseline Grid Alignment', () => {
        test('all glow blur tokens should be baseline grid aligned', () => {
            Object.values(GlowBlurTokens_1.glowBlur).forEach(token => {
                expect(token.baselineGridAlignment).toBe(true);
                // Verify actual alignment to 4px grid
                expect(token.baseValue % 4).toBe(0);
            });
        });
    });
    describe('Strategic Flexibility', () => {
        test('no glow blur tokens should be strategic flexibility', () => {
            Object.values(GlowBlurTokens_1.glowBlur).forEach(token => {
                expect(token.isStrategicFlexibility).toBe(false);
            });
        });
        test('no glow blur tokens should be precision targeted', () => {
            Object.values(GlowBlurTokens_1.glowBlur).forEach(token => {
                expect(token.isPrecisionTargeted).toBe(false);
            });
        });
    });
    describe('Platform Values', () => {
        test('all tokens should have correct platform values', () => {
            Object.values(GlowBlurTokens_1.glowBlur).forEach(token => {
                expect(token.platforms.web.value).toBe(token.baseValue);
                expect(token.platforms.web.unit).toBe('px');
                expect(token.platforms.ios.value).toBe(token.baseValue);
                expect(token.platforms.ios.unit).toBe('pt');
                expect(token.platforms.android.value).toBe(token.baseValue);
                expect(token.platforms.android.unit).toBe('dp');
            });
        });
    });
    describe('Helper Functions', () => {
        test('getGlowBlurToken should return token by name', () => {
            const token = (0, GlowBlurTokens_1.getGlowBlurToken)('glowBlur300');
            expect(token).toBeDefined();
            expect(token?.name).toBe('glowBlur300');
            expect(token?.baseValue).toBe(24);
        });
        test('getGlowBlurToken should return undefined for invalid name', () => {
            const token = (0, GlowBlurTokens_1.getGlowBlurToken)('invalidToken');
            expect(token).toBeUndefined();
        });
        test('getAllGlowBlurTokens should return all tokens as array', () => {
            const tokens = (0, GlowBlurTokens_1.getAllGlowBlurTokens)();
            expect(tokens).toHaveLength(5);
            expect(tokens[0].name).toBe('glowBlur100');
            expect(tokens[4].name).toBe('glowBlur500');
        });
    });
    describe('Token Metadata', () => {
        test('all tokens should have descriptions', () => {
            Object.values(GlowBlurTokens_1.glowBlur).forEach(token => {
                expect(token.description).toBeDefined();
                expect(token.description.length).toBeGreaterThan(0);
            });
        });
        test('all tokens should have mathematical relationships', () => {
            Object.values(GlowBlurTokens_1.glowBlur).forEach(token => {
                expect(token.mathematicalRelationship).toBeDefined();
                expect(token.mathematicalRelationship).toContain('base');
            });
        });
    });
});
//# sourceMappingURL=GlowBlurTokens.test.js.map