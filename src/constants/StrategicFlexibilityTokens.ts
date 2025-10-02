/**
 * Strategic Flexibility Token Definitions
 * 
 * These tokens provide strategic flexibility within the mathematical token system.
 * They are mathematically derived but break systematic progression within their families.
 * Usage should maintain ≥80% appropriate usage patterns.
 */

export const STRATEGIC_FLEXIBILITY_VALUES = [6, 10, 20] as const;

export type StrategicFlexibilityValue = typeof STRATEGIC_FLEXIBILITY_VALUES[number];

/**
 * Strategic flexibility tokens with their mathematical derivations
 */
export const STRATEGIC_FLEXIBILITY_TOKENS = {
  // space075 = space100 × 0.75 = 6 (breaks 8-unit baseline grid)
  space075: {
    value: 6,
    derivation: 'space100 × 0.75',
    baseToken: 'space100',
    multiplier: 0.75,
    category: 'spacing'
  },
  
  // Custom 10-unit token for specific design requirements
  space125: {
    value: 10,
    derivation: 'space100 × 1.25',
    baseToken: 'space100', 
    multiplier: 1.25,
    category: 'spacing'
  },
  
  // Custom 20-unit token for larger spacing needs
  space250: {
    value: 20,
    derivation: 'space100 × 2.5',
    baseToken: 'space100',
    multiplier: 2.5,
    category: 'spacing'
  }
} as const;

/**
 * Check if a value is a strategic flexibility token
 */
export function isStrategicFlexibilityValue(value: number): boolean {
  return STRATEGIC_FLEXIBILITY_VALUES.includes(value as StrategicFlexibilityValue);
}

/**
 * Get strategic flexibility token information by value
 */
export function getStrategicFlexibilityToken(value: number) {
  return Object.values(STRATEGIC_FLEXIBILITY_TOKENS).find(token => token.value === value);
}