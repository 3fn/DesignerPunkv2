"use strict";
/**
 * Test Fixtures for Token Testing
 *
 * Provides reusable token builders that reference actual system constants
 * rather than hard-coding values. This ensures tests remain valid when
 * design system values change.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_CONSTANTS = exports.TokenBuilder = void 0;
exports.isBaselineGridAligned = isBaselineGridAligned;
exports.getNearestGridValues = getNearestGridValues;
const types_1 = require("../../types");
const BaselineGrid_1 = require("../../constants/BaselineGrid");
const SpacingTokens_1 = require("../../constants/SpacingTokens");
const StrategicFlexibilityTokens_1 = require("../../constants/StrategicFlexibilityTokens");
/**
 * Token builder for creating test tokens with system-aligned values
 */
class TokenBuilder {
    /**
     * Create a base spacing token (space100)
     */
    static createBaseSpacingToken(overrides) {
        return {
            name: 'space100',
            category: types_1.TokenCategory.SPACING,
            baseValue: SpacingTokens_1.SPACING_BASE_VALUE, // References actual system constant
            familyBaseValue: SpacingTokens_1.SPACING_BASE_VALUE,
            description: 'Base spacing unit',
            mathematicalRelationship: 'base value',
            baselineGridAlignment: true,
            isStrategicFlexibility: false,
            isPrecisionTargeted: false,
            platforms: {
                web: { value: SpacingTokens_1.SPACING_BASE_VALUE, unit: 'px' },
                ios: { value: SpacingTokens_1.SPACING_BASE_VALUE, unit: 'pt' },
                android: { value: SpacingTokens_1.SPACING_BASE_VALUE, unit: 'dp' }
            },
            ...overrides
        };
    }
    /**
     * Create a strategic flexibility spacing token (space075)
     */
    static createStrategicFlexibilityToken(overrides) {
        const sfToken = (0, StrategicFlexibilityTokens_1.getStrategicFlexibilityToken)(SpacingTokens_1.SPACING_BASE_VALUE * 0.75);
        const baseValue = sfToken?.value || 6;
        return {
            name: 'space075',
            category: types_1.TokenCategory.SPACING,
            baseValue,
            familyBaseValue: SpacingTokens_1.SPACING_BASE_VALUE,
            description: 'Strategic flexibility spacing',
            mathematicalRelationship: 'base × 0.75',
            baselineGridAlignment: false,
            isStrategicFlexibility: true,
            isPrecisionTargeted: false,
            platforms: {
                web: { value: baseValue, unit: 'px' },
                ios: { value: baseValue, unit: 'pt' },
                android: { value: baseValue, unit: 'dp' }
            },
            ...overrides
        };
    }
    /**
     * Create a double spacing token (space200)
     */
    static createDoubleSpacingToken(overrides) {
        const baseValue = SpacingTokens_1.SPACING_BASE_VALUE * 2;
        return {
            name: 'space200',
            category: types_1.TokenCategory.SPACING,
            baseValue,
            familyBaseValue: SpacingTokens_1.SPACING_BASE_VALUE,
            description: 'Double spacing',
            mathematicalRelationship: 'base × 2',
            baselineGridAlignment: true,
            isStrategicFlexibility: false,
            isPrecisionTargeted: false,
            platforms: {
                web: { value: baseValue, unit: 'px' },
                ios: { value: baseValue, unit: 'pt' },
                android: { value: baseValue, unit: 'dp' }
            },
            ...overrides
        };
    }
    /**
     * Create a quarter spacing token (space025 = 2)
     * This is a strategic flexibility token for fine-grain spacing
     */
    static createQuarterSpacingToken(overrides) {
        const baseValue = SpacingTokens_1.SPACING_BASE_VALUE * 0.25;
        return {
            name: 'space025',
            category: types_1.TokenCategory.SPACING,
            baseValue,
            familyBaseValue: SpacingTokens_1.SPACING_BASE_VALUE,
            description: 'Fine-grain spacing for exceptional needs',
            mathematicalRelationship: 'base × 0.25',
            baselineGridAlignment: false,
            isStrategicFlexibility: true, // 2 is strategic flexibility
            isPrecisionTargeted: false,
            platforms: {
                web: { value: baseValue, unit: 'px' },
                ios: { value: baseValue, unit: 'pt' },
                android: { value: baseValue, unit: 'dp' }
            },
            ...overrides
        };
    }
    /**
     * Create a half spacing token (space050 = 4)
     * Strategic flexibility token for sub-grid spacing
     */
    static createHalfSpacingToken(overrides) {
        const baseValue = SpacingTokens_1.SPACING_BASE_VALUE * 0.5;
        return {
            name: 'space050',
            category: types_1.TokenCategory.SPACING,
            baseValue,
            familyBaseValue: SpacingTokens_1.SPACING_BASE_VALUE,
            description: 'Sub-grid spacing for medium-scale adjustments',
            mathematicalRelationship: 'base × 0.5',
            baselineGridAlignment: false, // 4 is not 8-unit grid aligned
            isStrategicFlexibility: true, // Strategic flexibility
            isPrecisionTargeted: false,
            platforms: {
                web: { value: baseValue, unit: 'px' },
                ios: { value: baseValue, unit: 'pt' },
                android: { value: baseValue, unit: 'dp' }
            },
            ...overrides
        };
    }
    /**
     * Create a 1.5x spacing token (space150 = 12)
     * Strategic flexibility token for sub-grid spacing
     */
    static createOneAndHalfSpacingToken(overrides) {
        const baseValue = SpacingTokens_1.SPACING_BASE_VALUE * 1.5;
        return {
            name: 'space150',
            category: types_1.TokenCategory.SPACING,
            baseValue,
            familyBaseValue: SpacingTokens_1.SPACING_BASE_VALUE,
            description: 'Sub-grid spacing for larger adjustments',
            mathematicalRelationship: 'base × 1.5',
            baselineGridAlignment: false, // 12 is not 8-unit grid aligned
            isStrategicFlexibility: true, // Strategic flexibility
            isPrecisionTargeted: false,
            platforms: {
                web: { value: baseValue, unit: 'px' },
                ios: { value: baseValue, unit: 'pt' },
                android: { value: baseValue, unit: 'dp' }
            },
            ...overrides
        };
    }
    /**
     * Create an invalid spacing token (not aligned to baseline grid)
     * Uses a value that is NOT a strategic flexibility value and NOT grid-aligned
     */
    static createInvalidSpacingToken(overrides) {
        // Use a value that's NOT aligned to baseline grid AND NOT strategic flexibility
        // Strategic flexibility values: 2, 4, 6, 10, 12, 20
        // Grid-aligned values: 8, 16, 24, 32, etc.
        // Valid invalid values: 1, 3, 5, 7, 9, 11, 13, 14, 15, 17, 18, 19, 21, 22, 23, etc.
        const baseValue = BaselineGrid_1.BASELINE_GRID_UNIT + 1; // e.g., 9 if grid is 8
        return {
            name: 'spaceInvalid',
            category: types_1.TokenCategory.SPACING,
            baseValue,
            familyBaseValue: SpacingTokens_1.SPACING_BASE_VALUE,
            description: 'Invalid spacing (not grid-aligned, not strategic flexibility)',
            mathematicalRelationship: `base × ${(baseValue / SpacingTokens_1.SPACING_BASE_VALUE).toFixed(3)}`,
            baselineGridAlignment: false,
            isStrategicFlexibility: false,
            isPrecisionTargeted: false,
            platforms: {
                web: { value: baseValue, unit: 'px' },
                ios: { value: baseValue, unit: 'pt' },
                android: { value: baseValue, unit: 'dp' }
            },
            ...overrides
        };
    }
    /**
     * Create a semantic spacing token
     */
    static createSemanticSpacingToken(primitiveToken, overrides) {
        return {
            name: 'space.normal',
            primitiveReferences: { default: primitiveToken.name },
            category: types_1.SemanticCategory.SPACING,
            context: 'Normal spacing for standard layouts',
            description: 'Semantic token for normal spacing',
            primitiveTokens: { default: primitiveToken },
            ...overrides
        };
    }
}
exports.TokenBuilder = TokenBuilder;
/**
 * Common test constants derived from system values
 */
exports.TEST_CONSTANTS = {
    BASELINE_GRID: BaselineGrid_1.BASELINE_GRID_UNIT,
    SPACING_BASE: SpacingTokens_1.SPACING_BASE_VALUE,
    SPACING_QUARTER: SpacingTokens_1.SPACING_BASE_VALUE * 0.25, // 2 (strategic flexibility)
    SPACING_HALF: SpacingTokens_1.SPACING_BASE_VALUE * 0.5, // 4 (strategic flexibility)
    SPACING_SF_075: SpacingTokens_1.SPACING_BASE_VALUE * 0.75, // 6 (strategic flexibility)
    SPACING_ONE_HALF: SpacingTokens_1.SPACING_BASE_VALUE * 1.5, // 12 (strategic flexibility)
    SPACING_DOUBLE: SpacingTokens_1.SPACING_BASE_VALUE * 2, // 16 (8-unit grid)
    SPACING_INVALID: BaselineGrid_1.BASELINE_GRID_UNIT + 1, // 9 (not grid-aligned, not SF)
};
/**
 * Helper to check if a value aligns with baseline grid
 */
function isBaselineGridAligned(value) {
    return value % BaselineGrid_1.BASELINE_GRID_UNIT === 0;
}
/**
 * Helper to get nearest baseline grid values
 */
function getNearestGridValues(value) {
    return {
        lower: Math.floor(value / BaselineGrid_1.BASELINE_GRID_UNIT) * BaselineGrid_1.BASELINE_GRID_UNIT,
        upper: Math.ceil(value / BaselineGrid_1.BASELINE_GRID_UNIT) * BaselineGrid_1.BASELINE_GRID_UNIT
    };
}
//# sourceMappingURL=tokenFixtures.js.map