/**
 * Test Fixtures for Token Testing
 *
 * Provides reusable token builders that reference actual system constants
 * rather than hard-coding values. This ensures tests remain valid when
 * design system values change.
 */
import { type PrimitiveToken, type SemanticToken } from '../../types';
/**
 * Token builder for creating test tokens with system-aligned values
 */
export declare class TokenBuilder {
    /**
     * Create a base spacing token (space100)
     */
    static createBaseSpacingToken(overrides?: Partial<PrimitiveToken>): PrimitiveToken;
    /**
     * Create a strategic flexibility spacing token (space075)
     */
    static createStrategicFlexibilityToken(overrides?: Partial<PrimitiveToken>): PrimitiveToken;
    /**
     * Create a double spacing token (space200)
     */
    static createDoubleSpacingToken(overrides?: Partial<PrimitiveToken>): PrimitiveToken;
    /**
     * Create a quarter spacing token (space025 = 2)
     * This is a strategic flexibility token for fine-grain spacing
     */
    static createQuarterSpacingToken(overrides?: Partial<PrimitiveToken>): PrimitiveToken;
    /**
     * Create a half spacing token (space050 = 4)
     * Strategic flexibility token for sub-grid spacing
     */
    static createHalfSpacingToken(overrides?: Partial<PrimitiveToken>): PrimitiveToken;
    /**
     * Create a 1.5x spacing token (space150 = 12)
     * Strategic flexibility token for sub-grid spacing
     */
    static createOneAndHalfSpacingToken(overrides?: Partial<PrimitiveToken>): PrimitiveToken;
    /**
     * Create an invalid spacing token (not aligned to baseline grid)
     * Uses a value that is NOT a strategic flexibility value and NOT grid-aligned
     */
    static createInvalidSpacingToken(overrides?: Partial<PrimitiveToken>): PrimitiveToken;
    /**
     * Create a semantic spacing token
     */
    static createSemanticSpacingToken(primitiveToken: PrimitiveToken, overrides?: Partial<SemanticToken>): SemanticToken;
}
/**
 * Common test constants derived from system values
 */
export declare const TEST_CONSTANTS: {
    BASELINE_GRID: number;
    SPACING_BASE: number;
    SPACING_QUARTER: number;
    SPACING_HALF: number;
    SPACING_SF_075: number;
    SPACING_ONE_HALF: number;
    SPACING_DOUBLE: number;
    SPACING_INVALID: number;
};
/**
 * Helper to check if a value aligns with baseline grid
 */
export declare function isBaselineGridAligned(value: number): boolean;
/**
 * Helper to get nearest baseline grid values
 */
export declare function getNearestGridValues(value: number): {
    lower: number;
    upper: number;
};
//# sourceMappingURL=tokenFixtures.d.ts.map