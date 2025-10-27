"use strict";
/**
 * Strategic Flexibility Token Definitions
 *
 * These tokens provide strategic flexibility within the mathematical token system.
 * They are mathematically derived but break systematic progression within their families.
 * Usage should maintain ≥80% appropriate usage patterns.
 *
 * Strategic Flexibility Values:
 * - 2: Fine-grain spacing for exceptional component-internal needs
 * - 4: Sub-grid spacing for medium-scale adjustments
 * - 6: Component-level spacing that breaks 8-unit grid
 * - 10: Specific design requirements between standard progressions
 * - 12: Sub-grid spacing for larger adjustments
 * - 20: Larger spacing needs between standard progressions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRATEGIC_FLEXIBILITY_TOKENS = exports.STRATEGIC_FLEXIBILITY_VALUES = void 0;
exports.isStrategicFlexibilityValue = isStrategicFlexibilityValue;
exports.getStrategicFlexibilityToken = getStrategicFlexibilityToken;
exports.STRATEGIC_FLEXIBILITY_VALUES = [2, 4, 6, 10, 12, 20];
/**
 * Strategic flexibility tokens with their mathematical derivations
 */
exports.STRATEGIC_FLEXIBILITY_TOKENS = {
    // space025 = space100 × 0.25 = 2 (fine-grain spacing for exceptional needs)
    space025: {
        value: 2,
        derivation: 'space100 × 0.25',
        baseToken: 'space100',
        multiplier: 0.25,
        category: 'spacing',
        usage: 'Component-internal fine-grain spacing for exceptional design requirements'
    },
    // space050 = space100 × 0.5 = 4 (sub-grid spacing)
    space050: {
        value: 4,
        derivation: 'space100 × 0.5',
        baseToken: 'space100',
        multiplier: 0.5,
        category: 'spacing',
        usage: 'Sub-grid spacing for medium-scale adjustments and typography alignment'
    },
    // space075 = space100 × 0.75 = 6 (breaks 8-unit baseline grid)
    space075: {
        value: 6,
        derivation: 'space100 × 0.75',
        baseToken: 'space100',
        multiplier: 0.75,
        category: 'spacing',
        usage: 'Component-level spacing that requires breaking 8-unit grid'
    },
    // space125 = space100 × 1.25 = 10 (specific design requirements)
    space125: {
        value: 10,
        derivation: 'space100 × 1.25',
        baseToken: 'space100',
        multiplier: 1.25,
        category: 'spacing',
        usage: 'Specific design requirements between standard progressions'
    },
    // space150 = space100 × 1.5 = 12 (sub-grid spacing)
    space150: {
        value: 12,
        derivation: 'space100 × 1.5',
        baseToken: 'space100',
        multiplier: 1.5,
        category: 'spacing',
        usage: 'Sub-grid spacing for larger adjustments and typography alignment'
    },
    // space250 = space100 × 2.5 = 20 (larger spacing needs)
    space250: {
        value: 20,
        derivation: 'space100 × 2.5',
        baseToken: 'space100',
        multiplier: 2.5,
        category: 'spacing',
        usage: 'Larger spacing needs between standard progressions'
    }
};
/**
 * Check if a value is a strategic flexibility token
 */
function isStrategicFlexibilityValue(value) {
    return exports.STRATEGIC_FLEXIBILITY_VALUES.includes(value);
}
/**
 * Get strategic flexibility token information by value
 */
function getStrategicFlexibilityToken(value) {
    return Object.values(exports.STRATEGIC_FLEXIBILITY_TOKENS).find(token => token.value === value);
}
//# sourceMappingURL=StrategicFlexibilityTokens.js.map