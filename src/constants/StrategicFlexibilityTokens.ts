/**
 * Strategic Flexibility Token Definitions
 * 
 * These tokens provide strategic flexibility within the mathematical token system.
 * They are mathematically derived but break systematic progression within their families.
 * Usage should maintain ≥80% appropriate usage patterns.
 * 
 * Strategic Flexibility Values:
 * - 2: Fine-grain spacing for exceptional component-internal needs
 * - 6: Component-level spacing that breaks 8-unit grid
 * - 10: Specific design requirements between standard progressions
 * - 20: Larger spacing needs between standard progressions
 */

export const STRATEGIC_FLEXIBILITY_VALUES = [2, 6, 10, 20] as const;

export type StrategicFlexibilityValue = typeof STRATEGIC_FLEXIBILITY_VALUES[number];

/**
 * Strategic flexibility tokens with their mathematical derivations
 */
export const STRATEGIC_FLEXIBILITY_TOKENS = {
  // space025 = space100 × 0.25 = 2 (fine-grain spacing for exceptional needs)
  space025: {
    value: 2,
    derivation: 'space100 × 0.25',
    baseToken: 'space100',
    multiplier: 0.25,
    category: 'spacing',
    usage: 'Component-internal fine-grain spacing for exceptional design requirements'
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
  
  // space250 = space100 × 2.5 = 20 (larger spacing needs)
  space250: {
    value: 20,
    derivation: 'space100 × 2.5',
    baseToken: 'space100',
    multiplier: 2.5,
    category: 'spacing',
    usage: 'Larger spacing needs between standard progressions'
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