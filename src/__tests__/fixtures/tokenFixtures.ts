/**
 * Test Fixtures for Token Testing
 * 
 * Provides reusable token builders that reference actual system constants
 * rather than hard-coding values. This ensures tests remain valid when
 * design system values change.
 */

import { TokenCategory, SemanticCategory, type PrimitiveToken, type SemanticToken } from '../../types';
import { BASELINE_GRID_UNIT } from '../../constants/BaselineGrid';
import { SPACING_BASE_VALUE } from '../../constants/SpacingTokens';
import { getStrategicFlexibilityToken } from '../../constants/StrategicFlexibilityTokens';

/**
 * Token builder for creating test tokens with system-aligned values
 */
export class TokenBuilder {
  /**
   * Create a base spacing token (space100)
   */
  static createBaseSpacingToken(overrides?: Partial<PrimitiveToken>): PrimitiveToken {
    return {
      name: 'space100',
      category: TokenCategory.SPACING,
      baseValue: SPACING_BASE_VALUE, // References actual system constant
      familyBaseValue: SPACING_BASE_VALUE,
      description: 'Base spacing unit',
      mathematicalRelationship: 'base value',
      baselineGridAlignment: true,
      isStrategicFlexibility: false,
      isPrecisionTargeted: false,
      platforms: {
        web: { value: SPACING_BASE_VALUE, unit: 'px' },
        ios: { value: SPACING_BASE_VALUE, unit: 'pt' },
        android: { value: SPACING_BASE_VALUE, unit: 'dp' }
      },
      ...overrides
    };
  }

  /**
   * Create a strategic flexibility spacing token (space075)
   */
  static createStrategicFlexibilityToken(overrides?: Partial<PrimitiveToken>): PrimitiveToken {
    const sfToken = getStrategicFlexibilityToken(SPACING_BASE_VALUE * 0.75);
    const baseValue = sfToken?.value || 6;
    
    return {
      name: 'space075',
      category: TokenCategory.SPACING,
      baseValue,
      familyBaseValue: SPACING_BASE_VALUE,
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
  static createDoubleSpacingToken(overrides?: Partial<PrimitiveToken>): PrimitiveToken {
    const baseValue = SPACING_BASE_VALUE * 2;
    
    return {
      name: 'space200',
      category: TokenCategory.SPACING,
      baseValue,
      familyBaseValue: SPACING_BASE_VALUE,
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
   * Create a half spacing token (space050)
   * Note: This is NOT baseline grid aligned (4 % 8 !== 0)
   */
  static createHalfSpacingToken(overrides?: Partial<PrimitiveToken>): PrimitiveToken {
    const baseValue = SPACING_BASE_VALUE * 0.5;
    
    return {
      name: 'space050',
      category: TokenCategory.SPACING,
      baseValue,
      familyBaseValue: SPACING_BASE_VALUE,
      description: 'Half base spacing',
      mathematicalRelationship: 'base × 0.5',
      baselineGridAlignment: false, // 4 is not divisible by 8
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
   * Create an invalid spacing token (not aligned to baseline grid)
   */
  static createInvalidSpacingToken(overrides?: Partial<PrimitiveToken>): PrimitiveToken {
    // Use a value that's NOT aligned to baseline grid
    const baseValue = BASELINE_GRID_UNIT + 2; // e.g., 10 if grid is 8
    
    return {
      name: 'space125',
      category: TokenCategory.SPACING,
      baseValue,
      familyBaseValue: SPACING_BASE_VALUE,
      description: 'Invalid spacing (not grid-aligned)',
      mathematicalRelationship: `base × ${baseValue / SPACING_BASE_VALUE}`,
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
  static createSemanticSpacingToken(
    primitiveToken: PrimitiveToken,
    overrides?: Partial<SemanticToken>
  ): SemanticToken {
    return {
      name: 'space.normal',
      primitiveReference: primitiveToken.name,
      category: SemanticCategory.SPACING,
      context: 'Normal spacing for standard layouts',
      description: 'Semantic token for normal spacing',
      primitiveToken,
      ...overrides
    };
  }
}

/**
 * Common test constants derived from system values
 */
export const TEST_CONSTANTS = {
  BASELINE_GRID: BASELINE_GRID_UNIT,
  SPACING_BASE: SPACING_BASE_VALUE,
  SPACING_HALF: SPACING_BASE_VALUE * 0.5,
  SPACING_DOUBLE: SPACING_BASE_VALUE * 2,
  SPACING_SF_075: SPACING_BASE_VALUE * 0.75,
  SPACING_INVALID: BASELINE_GRID_UNIT + 2, // Not grid-aligned
};

/**
 * Helper to check if a value aligns with baseline grid
 */
export function isBaselineGridAligned(value: number): boolean {
  return value % BASELINE_GRID_UNIT === 0;
}

/**
 * Helper to get nearest baseline grid values
 */
export function getNearestGridValues(value: number): { lower: number; upper: number } {
  return {
    lower: Math.floor(value / BASELINE_GRID_UNIT) * BASELINE_GRID_UNIT,
    upper: Math.ceil(value / BASELINE_GRID_UNIT) * BASELINE_GRID_UNIT
  };
}
