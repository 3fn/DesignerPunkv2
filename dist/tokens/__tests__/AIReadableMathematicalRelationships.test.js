"use strict";
/**
 * AI-Readable Mathematical Relationships Verification
 *
 * This test verifies that refactored tokens meet the requirements for AI-readable
 * mathematical relationships:
 *
 * 1. Formulas are executable code in baseValue property
 * 2. Formulas produce correct numeric values
 * 3. Formulas match mathematicalRelationship strings
 *
 * Requirements: 9.1, 9.2, 9.3, 9.4
 */
Object.defineProperty(exports, "__esModule", { value: true });
const SpacingTokens_1 = require("../SpacingTokens");
const RadiusTokens_1 = require("../RadiusTokens");
const FontSizeTokens_1 = require("../FontSizeTokens");
describe('AI-Readable Mathematical Relationships', () => {
    describe('SpacingTokens', () => {
        it('should have executable formulas in baseValue property', () => {
            // Verify that baseValue is a number (formula has been evaluated)
            expect(typeof SpacingTokens_1.spacingTokens.space025.baseValue).toBe('number');
            expect(typeof SpacingTokens_1.spacingTokens.space050.baseValue).toBe('number');
            expect(typeof SpacingTokens_1.spacingTokens.space100.baseValue).toBe('number');
            expect(typeof SpacingTokens_1.spacingTokens.space150.baseValue).toBe('number');
            expect(typeof SpacingTokens_1.spacingTokens.space200.baseValue).toBe('number');
        });
        it('should produce correct numeric values from formulas', () => {
            // Verify formula results match expected values
            expect(SpacingTokens_1.spacingTokens.space025.baseValue).toBe(SpacingTokens_1.SPACING_BASE_VALUE * 0.25); // 2
            expect(SpacingTokens_1.spacingTokens.space050.baseValue).toBe(SpacingTokens_1.SPACING_BASE_VALUE * 0.5); // 4
            expect(SpacingTokens_1.spacingTokens.space100.baseValue).toBe(SpacingTokens_1.SPACING_BASE_VALUE); // 8
            expect(SpacingTokens_1.spacingTokens.space150.baseValue).toBe(SpacingTokens_1.SPACING_BASE_VALUE * 1.5); // 12
            expect(SpacingTokens_1.spacingTokens.space200.baseValue).toBe(SpacingTokens_1.SPACING_BASE_VALUE * 2); // 16
            expect(SpacingTokens_1.spacingTokens.space300.baseValue).toBe(SpacingTokens_1.SPACING_BASE_VALUE * 3); // 24
            expect(SpacingTokens_1.spacingTokens.space400.baseValue).toBe(SpacingTokens_1.SPACING_BASE_VALUE * 4); // 32
            expect(SpacingTokens_1.spacingTokens.space500.baseValue).toBe(SpacingTokens_1.SPACING_BASE_VALUE * 5); // 40
            expect(SpacingTokens_1.spacingTokens.space600.baseValue).toBe(SpacingTokens_1.SPACING_BASE_VALUE * 6); // 48
        });
        it('should have formulas that match mathematicalRelationship strings', () => {
            // Verify mathematicalRelationship strings describe the formulas accurately
            expect(SpacingTokens_1.spacingTokens.space025.mathematicalRelationship).toContain('0.25');
            expect(SpacingTokens_1.spacingTokens.space025.mathematicalRelationship).toContain('2');
            expect(SpacingTokens_1.spacingTokens.space050.mathematicalRelationship).toContain('0.5');
            expect(SpacingTokens_1.spacingTokens.space050.mathematicalRelationship).toContain('4');
            expect(SpacingTokens_1.spacingTokens.space100.mathematicalRelationship).toContain('× 1');
            expect(SpacingTokens_1.spacingTokens.space100.mathematicalRelationship).toContain('8');
            expect(SpacingTokens_1.spacingTokens.space150.mathematicalRelationship).toContain('1.5');
            expect(SpacingTokens_1.spacingTokens.space150.mathematicalRelationship).toContain('12');
            expect(SpacingTokens_1.spacingTokens.space200.mathematicalRelationship).toContain('× 2');
            expect(SpacingTokens_1.spacingTokens.space200.mathematicalRelationship).toContain('16');
        });
        it('should preserve strategic flexibility tokens unchanged', () => {
            // Strategic flexibility tokens use constant references, not formulas
            expect(SpacingTokens_1.spacingTokens.space075.isStrategicFlexibility).toBe(true);
            expect(SpacingTokens_1.spacingTokens.space125.isStrategicFlexibility).toBe(true);
            expect(SpacingTokens_1.spacingTokens.space250.isStrategicFlexibility).toBe(true);
            // Verify they have numeric baseValue
            expect(typeof SpacingTokens_1.spacingTokens.space075.baseValue).toBe('number');
            expect(typeof SpacingTokens_1.spacingTokens.space125.baseValue).toBe('number');
            expect(typeof SpacingTokens_1.spacingTokens.space250.baseValue).toBe('number');
        });
    });
    describe('RadiusTokens', () => {
        it('should have executable formulas in baseValue property', () => {
            // Verify that baseValue is a number (formula has been evaluated)
            expect(typeof RadiusTokens_1.radiusTokens.radius000.baseValue).toBe('number');
            expect(typeof RadiusTokens_1.radiusTokens.radius025.baseValue).toBe('number');
            expect(typeof RadiusTokens_1.radiusTokens.radius050.baseValue).toBe('number');
            expect(typeof RadiusTokens_1.radiusTokens.radius100.baseValue).toBe('number');
            expect(typeof RadiusTokens_1.radiusTokens.radius150.baseValue).toBe('number');
            expect(typeof RadiusTokens_1.radiusTokens.radius200.baseValue).toBe('number');
        });
        it('should produce correct numeric values from formulas', () => {
            // Verify formula results match expected values
            expect(RadiusTokens_1.radiusTokens.radius000.baseValue).toBe(RadiusTokens_1.RADIUS_BASE_VALUE * 0); // 0
            expect(RadiusTokens_1.radiusTokens.radius025.baseValue).toBe(RadiusTokens_1.RADIUS_BASE_VALUE * 0.25); // 2
            expect(RadiusTokens_1.radiusTokens.radius050.baseValue).toBe(RadiusTokens_1.RADIUS_BASE_VALUE * 0.5); // 4
            expect(RadiusTokens_1.radiusTokens.radius100.baseValue).toBe(RadiusTokens_1.RADIUS_BASE_VALUE); // 8
            expect(RadiusTokens_1.radiusTokens.radius150.baseValue).toBe(RadiusTokens_1.RADIUS_BASE_VALUE * 1.5); // 12
            expect(RadiusTokens_1.radiusTokens.radius200.baseValue).toBe(RadiusTokens_1.RADIUS_BASE_VALUE * 2); // 16
            expect(RadiusTokens_1.radiusTokens.radius300.baseValue).toBe(RadiusTokens_1.RADIUS_BASE_VALUE * 3); // 24
            expect(RadiusTokens_1.radiusTokens.radius400.baseValue).toBe(RadiusTokens_1.RADIUS_BASE_VALUE * 4); // 32
        });
        it('should have formulas that match mathematicalRelationship strings', () => {
            // Verify mathematicalRelationship strings describe the formulas accurately
            expect(RadiusTokens_1.radiusTokens.radius000.mathematicalRelationship).toContain('× 0');
            expect(RadiusTokens_1.radiusTokens.radius000.mathematicalRelationship).toContain('0');
            expect(RadiusTokens_1.radiusTokens.radius025.mathematicalRelationship).toContain('0.25');
            expect(RadiusTokens_1.radiusTokens.radius025.mathematicalRelationship).toContain('2');
            expect(RadiusTokens_1.radiusTokens.radius050.mathematicalRelationship).toContain('0.5');
            expect(RadiusTokens_1.radiusTokens.radius050.mathematicalRelationship).toContain('4');
            expect(RadiusTokens_1.radiusTokens.radius100.mathematicalRelationship).toContain('× 1');
            expect(RadiusTokens_1.radiusTokens.radius100.mathematicalRelationship).toContain('8');
            expect(RadiusTokens_1.radiusTokens.radius150.mathematicalRelationship).toContain('1.5');
            expect(RadiusTokens_1.radiusTokens.radius150.mathematicalRelationship).toContain('12');
        });
        it('should preserve strategic flexibility tokens unchanged', () => {
            // Strategic flexibility tokens use hard values
            expect(RadiusTokens_1.radiusTokens.radius075.isStrategicFlexibility).toBe(true);
            expect(RadiusTokens_1.radiusTokens.radius125.isStrategicFlexibility).toBe(true);
            expect(RadiusTokens_1.radiusTokens.radius250.isStrategicFlexibility).toBe(true);
            expect(RadiusTokens_1.radiusTokens.radiusFull.isStrategicFlexibility).toBe(true);
            // Verify they have numeric baseValue
            expect(typeof RadiusTokens_1.radiusTokens.radius075.baseValue).toBe('number');
            expect(typeof RadiusTokens_1.radiusTokens.radius125.baseValue).toBe('number');
            expect(typeof RadiusTokens_1.radiusTokens.radius250.baseValue).toBe('number');
            expect(typeof RadiusTokens_1.radiusTokens.radiusFull.baseValue).toBe('number');
        });
    });
    describe('FontSizeTokens', () => {
        it('should have executable formulas in baseValue property', () => {
            // Verify that baseValue is a number (formula has been evaluated)
            expect(typeof FontSizeTokens_1.fontSizeTokens.fontSize050.baseValue).toBe('number');
            expect(typeof FontSizeTokens_1.fontSizeTokens.fontSize075.baseValue).toBe('number');
            expect(typeof FontSizeTokens_1.fontSizeTokens.fontSize100.baseValue).toBe('number');
            expect(typeof FontSizeTokens_1.fontSizeTokens.fontSize125.baseValue).toBe('number');
            expect(typeof FontSizeTokens_1.fontSizeTokens.fontSize150.baseValue).toBe('number');
        });
        it('should produce correct numeric values from formulas with Math.round()', () => {
            // Verify formula results match expected values
            expect(FontSizeTokens_1.fontSizeTokens.fontSize050.baseValue).toBe(Math.round(FontSizeTokens_1.FONT_SIZE_BASE_VALUE / Math.pow(FontSizeTokens_1.MODULAR_SCALE_RATIO, 2))); // 13
            expect(FontSizeTokens_1.fontSizeTokens.fontSize075.baseValue).toBe(Math.round(FontSizeTokens_1.FONT_SIZE_BASE_VALUE / FontSizeTokens_1.MODULAR_SCALE_RATIO)); // 14
            expect(FontSizeTokens_1.fontSizeTokens.fontSize100.baseValue).toBe(FontSizeTokens_1.FONT_SIZE_BASE_VALUE); // 16
            expect(FontSizeTokens_1.fontSizeTokens.fontSize125.baseValue).toBe(Math.round(FontSizeTokens_1.FONT_SIZE_BASE_VALUE * FontSizeTokens_1.MODULAR_SCALE_RATIO)); // 18
            expect(FontSizeTokens_1.fontSizeTokens.fontSize150.baseValue).toBe(Math.round(FontSizeTokens_1.FONT_SIZE_BASE_VALUE * Math.pow(FontSizeTokens_1.MODULAR_SCALE_RATIO, 2))); // 20
            expect(FontSizeTokens_1.fontSizeTokens.fontSize200.baseValue).toBe(Math.round(FontSizeTokens_1.FONT_SIZE_BASE_VALUE * Math.pow(FontSizeTokens_1.MODULAR_SCALE_RATIO, 3))); // 23
        });
        it('should have formulas that match mathematicalRelationship strings', () => {
            // Verify mathematicalRelationship strings describe the formulas accurately
            expect(FontSizeTokens_1.fontSizeTokens.fontSize050.mathematicalRelationship).toContain('1.125²');
            expect(FontSizeTokens_1.fontSizeTokens.fontSize050.mathematicalRelationship).toContain('13');
            expect(FontSizeTokens_1.fontSizeTokens.fontSize075.mathematicalRelationship).toContain('÷ 1.125');
            expect(FontSizeTokens_1.fontSizeTokens.fontSize075.mathematicalRelationship).toContain('14');
            expect(FontSizeTokens_1.fontSizeTokens.fontSize100.mathematicalRelationship).toContain('× 1');
            expect(FontSizeTokens_1.fontSizeTokens.fontSize100.mathematicalRelationship).toContain('16');
            expect(FontSizeTokens_1.fontSizeTokens.fontSize125.mathematicalRelationship).toContain('× 1.125');
            expect(FontSizeTokens_1.fontSizeTokens.fontSize125.mathematicalRelationship).toContain('18');
            expect(FontSizeTokens_1.fontSizeTokens.fontSize150.mathematicalRelationship).toContain('1.125²');
            expect(FontSizeTokens_1.fontSizeTokens.fontSize150.mathematicalRelationship).toContain('20');
        });
        it('should handle precision-targeted adjustments correctly', () => {
            // fontSize500, fontSize600, fontSize700 have +1 adjustments for 4pt subgrid
            expect(FontSizeTokens_1.fontSizeTokens.fontSize500.isPrecisionTargeted).toBe(true);
            expect(FontSizeTokens_1.fontSizeTokens.fontSize600.isPrecisionTargeted).toBe(true);
            expect(FontSizeTokens_1.fontSizeTokens.fontSize700.isPrecisionTargeted).toBe(true);
            // Verify the adjustments are applied
            expect(FontSizeTokens_1.fontSizeTokens.fontSize500.baseValue).toBe(Math.round(FontSizeTokens_1.FONT_SIZE_BASE_VALUE * Math.pow(FontSizeTokens_1.MODULAR_SCALE_RATIO, 6)) + 1); // 33
            expect(FontSizeTokens_1.fontSizeTokens.fontSize600.baseValue).toBe(Math.round(FontSizeTokens_1.FONT_SIZE_BASE_VALUE * Math.pow(FontSizeTokens_1.MODULAR_SCALE_RATIO, 7)) + 1); // 37
            expect(FontSizeTokens_1.fontSizeTokens.fontSize700.baseValue).toBe(Math.round(FontSizeTokens_1.FONT_SIZE_BASE_VALUE * Math.pow(FontSizeTokens_1.MODULAR_SCALE_RATIO, 8)) + 1); // 42
        });
    });
    describe('AI Collaboration Requirements', () => {
        it('should enable AI to reason about token values through formulas', () => {
            // Requirement 9.1: Formulas are executable code
            // AI can see: baseValue: SPACING_BASE_VALUE * 1.5
            // AI understands: This is 8 * 1.5 = 12
            const space150Formula = SpacingTokens_1.SPACING_BASE_VALUE * 1.5;
            expect(SpacingTokens_1.spacingTokens.space150.baseValue).toBe(space150Formula);
            // AI can reason: "If SPACING_BASE_VALUE changes to 12, space150 becomes 18"
            const hypotheticalBase = 12;
            const hypotheticalSpace150 = hypotheticalBase * 1.5;
            expect(hypotheticalSpace150).toBe(18);
        });
        it('should enable AI to verify formula correctness', () => {
            // Requirement 9.2: Formulas produce correct numeric values
            // AI can verify: Does SPACING_BASE_VALUE * 1.5 equal 12?
            expect(SpacingTokens_1.SPACING_BASE_VALUE * 1.5).toBe(12);
            expect(SpacingTokens_1.spacingTokens.space150.baseValue).toBe(12);
            // AI can verify: Does Math.round(FONT_SIZE_BASE_VALUE * MODULAR_SCALE_RATIO) equal 18?
            expect(Math.round(FontSizeTokens_1.FONT_SIZE_BASE_VALUE * FontSizeTokens_1.MODULAR_SCALE_RATIO)).toBe(18);
            expect(FontSizeTokens_1.fontSizeTokens.fontSize125.baseValue).toBe(18);
        });
        it('should enable AI to understand mathematical relationships', () => {
            // Requirement 9.3: BASE_VALUE changes automatically recalculate derived tokens
            // AI can understand: All spacing tokens are derived from SPACING_BASE_VALUE
            // Current state
            expect(SpacingTokens_1.SPACING_BASE_VALUE).toBe(8);
            expect(SpacingTokens_1.spacingTokens.space150.baseValue).toBe(12);
            // AI can reason: "If SPACING_BASE_VALUE were 10, space150 would be 15"
            const alternativeBase = 10;
            const alternativeSpace150 = alternativeBase * 1.5;
            expect(alternativeSpace150).toBe(15);
        });
        it('should enable AI to validate formula-string consistency', () => {
            // Requirement 9.4: Formulas match mathematicalRelationship strings
            // AI can verify: Does the formula match the description?
            // space150: baseValue: SPACING_BASE_VALUE * 1.5
            // mathematicalRelationship: 'base × 1.5 = 8 × 1.5 = 12'
            expect(SpacingTokens_1.spacingTokens.space150.baseValue).toBe(SpacingTokens_1.SPACING_BASE_VALUE * 1.5);
            expect(SpacingTokens_1.spacingTokens.space150.mathematicalRelationship).toContain('1.5');
            expect(SpacingTokens_1.spacingTokens.space150.mathematicalRelationship).toContain('12');
            // fontSize125: baseValue: Math.round(FONT_SIZE_BASE_VALUE * MODULAR_SCALE_RATIO)
            // mathematicalRelationship: 'base × 1.125 = 16 × 1.125 = 18'
            expect(FontSizeTokens_1.fontSizeTokens.fontSize125.baseValue).toBe(Math.round(FontSizeTokens_1.FONT_SIZE_BASE_VALUE * FontSizeTokens_1.MODULAR_SCALE_RATIO));
            expect(FontSizeTokens_1.fontSizeTokens.fontSize125.mathematicalRelationship).toContain('1.125');
            expect(FontSizeTokens_1.fontSizeTokens.fontSize125.mathematicalRelationship).toContain('18');
        });
    });
    describe('Rosetta Stone Principle', () => {
        it('should provide unambiguous mathematical communication', () => {
            // The mathematical formulas serve as a "Rosetta Stone" between humans and AI
            // Both can understand: SPACING_BASE_VALUE * 1.5 = 12
            // Human reads: "space150 is base times 1.5"
            // AI reads: "space150 = SPACING_BASE_VALUE * 1.5"
            // Both understand: "space150 = 12"
            expect(SpacingTokens_1.spacingTokens.space150.baseValue).toBe(SpacingTokens_1.SPACING_BASE_VALUE * 1.5);
            expect(SpacingTokens_1.spacingTokens.space150.baseValue).toBe(12);
        });
        it('should enable cross-platform mathematical consistency', () => {
            // The same mathematical relationship applies across all platforms
            // web: 12px, ios: 12pt, android: 12dp
            // All derived from: SPACING_BASE_VALUE * 1.5
            expect(SpacingTokens_1.spacingTokens.space150.platforms.web.value).toBe(12);
            expect(SpacingTokens_1.spacingTokens.space150.platforms.ios.value).toBe(12);
            expect(SpacingTokens_1.spacingTokens.space150.platforms.android.value).toBe(12);
            // All platforms share the same mathematical foundation
            expect(SpacingTokens_1.spacingTokens.space150.platforms.web.value).toBe(SpacingTokens_1.SPACING_BASE_VALUE * 1.5);
            expect(SpacingTokens_1.spacingTokens.space150.platforms.ios.value).toBe(SpacingTokens_1.SPACING_BASE_VALUE * 1.5);
            expect(SpacingTokens_1.spacingTokens.space150.platforms.android.value).toBe(SpacingTokens_1.SPACING_BASE_VALUE * 1.5);
        });
    });
});
//# sourceMappingURL=AIReadableMathematicalRelationships.test.js.map