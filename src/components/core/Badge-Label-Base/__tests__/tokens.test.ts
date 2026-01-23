/**
 * @category evergreen
 * @purpose Verify Badge-Label-Base component tokens are correctly defined and registered
 */
/**
 * Badge-Label-Base Token Tests
 * 
 * Tests for the Badge-Label-Base component token definitions.
 * Verifies token values, registry registration, and metadata.
 * 
 * @see Requirements 4.8, 9.3, 9.4, 9.5 in .kiro/specs/044-badge-base/requirements.md
 */

import { ComponentTokenRegistry } from '../../../../registries/ComponentTokenRegistry';
import { 
  BadgeLabelBaseTokens, 
  getBadgeLabelMaxWidth,
  BadgeLabelBaseTokenReferences 
} from '../tokens';

describe('Badge-Label-Base Tokens', () => {
  describe('Token Values', () => {
    test('should define maxWidth token with correct value', () => {
      expect(BadgeLabelBaseTokens['maxWidth']).toBe(120);
    });

    test('getBadgeLabelMaxWidth should return correct value', () => {
      expect(getBadgeLabelMaxWidth()).toBe(120);
    });
  });

  describe('Token References', () => {
    test('should document maxWidth as family-conformant value', () => {
      expect(BadgeLabelBaseTokenReferences.maxWidth.value).toBe(120);
      expect(BadgeLabelBaseTokenReferences.maxWidth.familyConformant).toBe(true);
      expect(BadgeLabelBaseTokenReferences.maxWidth.primitiveReference).toBeNull();
    });

    test('should document correct derivation', () => {
      expect(BadgeLabelBaseTokenReferences.maxWidth.derivation).toBe(
        'SPACING_BASE_VALUE × 15 = 8 × 15 = 120'
      );
    });
  });

  describe('Registry Registration', () => {
    test('should register maxWidth token with ComponentTokenRegistry', () => {
      expect(ComponentTokenRegistry.has('badge-label-base.maxWidth')).toBe(true);
    });

    test('should store correct metadata for maxWidth token', () => {
      const token = ComponentTokenRegistry.get('badge-label-base.maxWidth');
      expect(token).toBeDefined();
      expect(token?.name).toBe('badge-label-base.maxWidth');
      expect(token?.component).toBe('Badge-Label-Base');
      expect(token?.family).toBe('spacing');
      expect(token?.value).toBe(120);
      expect(token?.primitiveReference).toBeUndefined();
      expect(token?.reasoning).toContain('Maximum width for truncated badges');
    });

    test('should be queryable by component name', () => {
      const tokens = ComponentTokenRegistry.getByComponent('Badge-Label-Base');
      expect(tokens).toHaveLength(1);
      expect(tokens[0].name).toBe('badge-label-base.maxWidth');
    });

    test('should be queryable by family', () => {
      const spacingTokens = ComponentTokenRegistry.getByFamily('spacing');
      const badgeToken = spacingTokens.find(t => t.name === 'badge-label-base.maxWidth');
      expect(badgeToken).toBeDefined();
    });
  });

  describe('Mathematical Conformance', () => {
    test('maxWidth value should follow spacing family pattern (8 × multiplier)', () => {
      const SPACING_BASE_VALUE = 8;
      const maxWidth = BadgeLabelBaseTokens['maxWidth'];
      
      // 120 = 8 × 15, so it follows the spacing family pattern
      expect(maxWidth % SPACING_BASE_VALUE).toBe(0);
      expect(maxWidth / SPACING_BASE_VALUE).toBe(15);
    });
  });
});
