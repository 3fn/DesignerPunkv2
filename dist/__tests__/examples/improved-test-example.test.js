"use strict";
/**
 * Example of improved test using fixtures
 *
 * This demonstrates how tests should be written to avoid hard-coded values
 * and maintain flexibility when design system constants change.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ThreeTierValidator_1 = require("../../validators/ThreeTierValidator");
const tokenFixtures_1 = require("../fixtures/tokenFixtures");
describe('ThreeTierValidator (Improved)', () => {
    let validator;
    beforeEach(() => {
        validator = new ThreeTierValidator_1.ThreeTierValidator();
    });
    describe('Pass-level validation', () => {
        it('should validate primitive token with correct mathematical foundation', () => {
            // Use fixture instead of hard-coded values
            const token = tokenFixtures_1.TokenBuilder.createBaseSpacingToken();
            const context = {
                token,
                options: {
                    enabledLevels: ['Pass', 'Warning', 'Error']
                }
            };
            const result = validator.validate(context);
            expect(result.primaryResult.level).toBe('Pass');
            expect(result.primaryResult.token).toBe('space100');
            expect(result.summary.level).toBe('Pass');
        });
        it('should validate strategic flexibility token as Pass', () => {
            // Fixture automatically uses correct SF value
            const token = tokenFixtures_1.TokenBuilder.createStrategicFlexibilityToken();
            const context = {
                token
            };
            const result = validator.validate(context);
            expect(result.primaryResult.level).toBe('Pass');
            expect(result.primaryResult.message).toContain('Strategic flexibility');
        });
    });
    describe('Error-level validation', () => {
        it('should error on baseline grid violation', () => {
            // Fixture creates invalid token based on current grid unit
            // Uses a value that is NOT strategic flexibility and NOT grid-aligned
            const token = tokenFixtures_1.TokenBuilder.createInvalidSpacingToken();
            // Verify our test assumptions
            expect((0, tokenFixtures_1.isBaselineGridAligned)(token.baseValue)).toBe(false);
            expect(token.isStrategicFlexibility).toBe(false);
            const context = {
                token,
                mathematicalContext: {
                    baselineGridRequirement: {
                        required: true,
                        gridUnit: tokenFixtures_1.TEST_CONSTANTS.BASELINE_GRID,
                        expectedAlignment: true,
                        actualAlignment: false
                    }
                }
            };
            const result = validator.validate(context);
            // Test still works regardless of what the actual grid unit is
            // The ErrorValidator checks:
            // 1. Token category requires baseline grid alignment (spacing/radius)
            // 2. Token is NOT strategic flexibility (flag AND value check)
            // 3. baseValue % gridUnit !== 0
            expect(result.primaryResult.level).toBe('Error');
            expect(result.primaryResult.message).toContain('Baseline grid');
        });
        it('should validate tokens with different multipliers', () => {
            // Easy to create variations
            const doubleToken = tokenFixtures_1.TokenBuilder.createDoubleSpacingToken();
            const quarterToken = tokenFixtures_1.TokenBuilder.createQuarterSpacingToken();
            expect(doubleToken.baseValue).toBe(tokenFixtures_1.TEST_CONSTANTS.SPACING_DOUBLE);
            expect(quarterToken.baseValue).toBe(tokenFixtures_1.TEST_CONSTANTS.SPACING_QUARTER);
            // Double is 8-unit grid-aligned
            expect((0, tokenFixtures_1.isBaselineGridAligned)(doubleToken.baseValue)).toBe(true);
            // Quarter (2) is strategic flexibility, not grid-aligned
            expect((0, tokenFixtures_1.isBaselineGridAligned)(quarterToken.baseValue)).toBe(false);
            expect(quarterToken.isStrategicFlexibility).toBe(true);
        });
    });
    describe('Custom token variations', () => {
        it('should allow overriding specific properties', () => {
            // Can still customize when needed
            const customToken = tokenFixtures_1.TokenBuilder.createBaseSpacingToken({
                name: 'space100-custom',
                description: 'Custom description'
            });
            expect(customToken.name).toBe('space100-custom');
            expect(customToken.description).toBe('Custom description');
            // But still uses system base value
            expect(customToken.baseValue).toBe(tokenFixtures_1.TEST_CONSTANTS.SPACING_BASE);
        });
    });
});
//# sourceMappingURL=improved-test-example.test.js.map