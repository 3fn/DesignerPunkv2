"use strict";
/**
 * Validation tests for RadiusTokens strategic flexibility preservation
 *
 * Verifies that strategic flexibility tokens remain unchanged after formula refactoring:
 * - radius075, radius125, radius250, radiusFull use hard values
 * - isStrategicFlexibility flags remain true
 */
Object.defineProperty(exports, "__esModule", { value: true });
const RadiusTokens_1 = require("../RadiusTokens");
describe('RadiusTokens Strategic Flexibility Preservation', () => {
    describe('radius075 strategic flexibility token', () => {
        it('should preserve hard value of 6', () => {
            expect(RadiusTokens_1.radiusTokens.radius075.baseValue).toBe(6);
        });
        it('should maintain isStrategicFlexibility flag as true', () => {
            expect(RadiusTokens_1.radiusTokens.radius075.isStrategicFlexibility).toBe(true);
        });
        it('should preserve mathematical relationship description', () => {
            expect(RadiusTokens_1.radiusTokens.radius075.mathematicalRelationship).toBe('base × 0.75 = 8 × 0.75 = 6');
        });
    });
    describe('radius125 strategic flexibility token', () => {
        it('should preserve hard value of 10', () => {
            expect(RadiusTokens_1.radiusTokens.radius125.baseValue).toBe(10);
        });
        it('should maintain isStrategicFlexibility flag as true', () => {
            expect(RadiusTokens_1.radiusTokens.radius125.isStrategicFlexibility).toBe(true);
        });
        it('should preserve mathematical relationship description', () => {
            expect(RadiusTokens_1.radiusTokens.radius125.mathematicalRelationship).toBe('base × 1.25 = 8 × 1.25 = 10');
        });
    });
    describe('radius250 strategic flexibility token', () => {
        it('should preserve hard value of 20', () => {
            expect(RadiusTokens_1.radiusTokens.radius250.baseValue).toBe(20);
        });
        it('should maintain isStrategicFlexibility flag as true', () => {
            expect(RadiusTokens_1.radiusTokens.radius250.isStrategicFlexibility).toBe(true);
        });
        it('should preserve mathematical relationship description', () => {
            expect(RadiusTokens_1.radiusTokens.radius250.mathematicalRelationship).toBe('base × 2.5 = 8 × 2.5 = 20');
        });
    });
    describe('radiusFull strategic flexibility token', () => {
        it('should preserve hard value of 9999', () => {
            expect(RadiusTokens_1.radiusTokens.radiusFull.baseValue).toBe(9999);
        });
        it('should maintain isStrategicFlexibility flag as true', () => {
            expect(RadiusTokens_1.radiusTokens.radiusFull.isStrategicFlexibility).toBe(true);
        });
        it('should preserve special case mathematical relationship', () => {
            expect(RadiusTokens_1.radiusTokens.radiusFull.mathematicalRelationship).toBe('special case = 9999 (effectively infinite)');
        });
    });
    describe('getStrategicFlexibilityRadiusTokens helper', () => {
        it('should return exactly 4 strategic flexibility tokens', () => {
            const strategicTokens = (0, RadiusTokens_1.getStrategicFlexibilityRadiusTokens)();
            expect(strategicTokens).toHaveLength(4);
        });
        it('should include radius075, radius125, radius250, and radiusFull', () => {
            const strategicTokens = (0, RadiusTokens_1.getStrategicFlexibilityRadiusTokens)();
            const tokenNames = strategicTokens.map(token => token.name);
            expect(tokenNames).toContain('radius075');
            expect(tokenNames).toContain('radius125');
            expect(tokenNames).toContain('radius250');
            expect(tokenNames).toContain('radiusFull');
        });
        it('should verify all strategic tokens have isStrategicFlexibility = true', () => {
            const strategicTokens = (0, RadiusTokens_1.getStrategicFlexibilityRadiusTokens)();
            strategicTokens.forEach(token => {
                expect(token.isStrategicFlexibility).toBe(true);
            });
        });
    });
    describe('Non-strategic flexibility tokens', () => {
        it('should verify non-strategic tokens have isStrategicFlexibility = false', () => {
            const nonStrategicTokenNames = [
                'radius000', 'radius025', 'radius050', 'radius100',
                'radius150', 'radius200', 'radius300', 'radius400'
            ];
            nonStrategicTokenNames.forEach(tokenName => {
                expect(RadiusTokens_1.radiusTokens[tokenName].isStrategicFlexibility).toBe(false);
            });
        });
    });
});
//# sourceMappingURL=RadiusStrategicFlexibilityValidation.test.js.map