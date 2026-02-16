/**
 * @category evergreen
 * @purpose Verify Progress Indicator token formulas produce correct values
 */
/**
 * Progress Token Formula Validation Tests
 *
 * Validates that formula-based current size tokens derive correct values
 * from SPACING_BASE_VALUE × multiplier, maintain the +4px offset relationship
 * with base sizes, and align to the 4px baseline grid.
 *
 * @see .kiro/specs/048-progress-family/requirements.md (Requirement 15.1)
 * @see .kiro/specs/048-progress-family/design.md (Size Variant, Current Size Formula)
 */

import { ProgressTokens } from '../component/progress';
import { SPACING_BASE_VALUE } from '../SpacingTokens';

describe('Progress Token Formula Validation', () => {
  /**
   * Expected current size values derived from SPACING_BASE_VALUE × multiplier:
   * - sm: 8 × 2   = 16px
   * - md: 8 × 2.5 = 20px
   * - lg: 8 × 3.5 = 28px
   */
  const expectedCurrentSizes = {
    sm: { multiplier: 2, expected: 16 },
    md: { multiplier: 2.5, expected: 20 },
    lg: { multiplier: 3.5, expected: 28 },
  };

  /**
   * Expected base sizes (from spacing primitives):
   * - sm: space150 = 12px
   * - md: space200 = 16px
   * - lg: space300 = 24px
   */
  const expectedBaseSizes = {
    sm: 12,
    md: 16,
    lg: 24,
  };

  describe('Current Size Formulas Derive Correct Values', () => {
    it.each([
      ['sm', expectedCurrentSizes.sm],
      ['md', expectedCurrentSizes.md],
      ['lg', expectedCurrentSizes.lg],
    ] as const)(
      'should calculate node.size.%s.current correctly (SPACING_BASE_VALUE × %s)',
      (size, { multiplier, expected }) => {
        const calculated = SPACING_BASE_VALUE * multiplier;
        expect(calculated).toBe(expected);

        const tokenKey = `node.size.${size}.current` as keyof typeof ProgressTokens;
        expect(ProgressTokens[tokenKey]).toBe(expected);
      }
    );
  });

  describe('Mathematical Relationship: current = base + 4px', () => {
    it.each([
      ['sm', expectedBaseSizes.sm, expectedCurrentSizes.sm.expected],
      ['md', expectedBaseSizes.md, expectedCurrentSizes.md.expected],
      ['lg', expectedBaseSizes.lg, expectedCurrentSizes.lg.expected],
    ] as const)(
      'should maintain +4px offset for %s (base %dpx → current %dpx)',
      (size, base, current) => {
        const baseKey = `node.size.${size}` as keyof typeof ProgressTokens;
        const currentKey = `node.size.${size}.current` as keyof typeof ProgressTokens;

        expect(ProgressTokens[baseKey]).toBe(base);
        expect(ProgressTokens[currentKey]).toBe(current);
        expect(ProgressTokens[currentKey] - ProgressTokens[baseKey]).toBe(4);
      }
    );
  });

  describe('Baseline Grid Alignment (divisible by 4px)', () => {
    it.each([
      ['node.size.sm.current', expectedCurrentSizes.sm.expected],
      ['node.size.md.current', expectedCurrentSizes.md.expected],
      ['node.size.lg.current', expectedCurrentSizes.lg.expected],
    ] as const)(
      'should align %s (%dpx) to 4px baseline grid',
      (tokenName, expected) => {
        const tokenKey = tokenName as keyof typeof ProgressTokens;
        expect(ProgressTokens[tokenKey]).toBe(expected);
        expect(ProgressTokens[tokenKey] % 4).toBe(0);
      }
    );
  });
});
