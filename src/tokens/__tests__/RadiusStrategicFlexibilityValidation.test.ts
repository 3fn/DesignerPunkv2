/**
 * @category evergreen
 * @purpose Verify RadiusStrategicFlexibilityValidation tokens are correctly defined and structured
 */
/**
 * Validation tests for RadiusTokens strategic flexibility preservation
 * 
 * Verifies that strategic flexibility tokens remain unchanged after formula refactoring:
 * - radius075, radius125, radius250, radiusMax use hard values
 * - isStrategicFlexibility flags remain true
 */

import { radiusTokens, getStrategicFlexibilityRadiusTokens } from '../RadiusTokens';

describe('RadiusTokens Strategic Flexibility Preservation', () => {
  describe('radius075 strategic flexibility token', () => {
    it('should preserve hard value of 6', () => {
      expect(radiusTokens.radius075.baseValue).toBe(6);
    });

    it('should maintain isStrategicFlexibility flag as true', () => {
      expect(radiusTokens.radius075.isStrategicFlexibility).toBe(true);
    });

    it('should preserve mathematical relationship description', () => {
      expect(radiusTokens.radius075.mathematicalRelationship).toBe('base × 0.75 = 8 × 0.75 = 6');
    });
  });

  describe('radius125 strategic flexibility token', () => {
    it('should preserve hard value of 10', () => {
      expect(radiusTokens.radius125.baseValue).toBe(10);
    });

    it('should maintain isStrategicFlexibility flag as true', () => {
      expect(radiusTokens.radius125.isStrategicFlexibility).toBe(true);
    });

    it('should preserve mathematical relationship description', () => {
      expect(radiusTokens.radius125.mathematicalRelationship).toBe('base × 1.25 = 8 × 1.25 = 10');
    });
  });

  describe('radius250 strategic flexibility token', () => {
    it('should preserve hard value of 20', () => {
      expect(radiusTokens.radius250.baseValue).toBe(20);
    });

    it('should maintain isStrategicFlexibility flag as true', () => {
      expect(radiusTokens.radius250.isStrategicFlexibility).toBe(true);
    });

    it('should preserve mathematical relationship description', () => {
      expect(radiusTokens.radius250.mathematicalRelationship).toBe('base × 2.5 = 8 × 2.5 = 20');
    });
  });

  describe('radiusMax strategic flexibility token', () => {
    it('should preserve hard value of 9999', () => {
      expect(radiusTokens.radiusMax.baseValue).toBe(9999);
    });

    it('should maintain isStrategicFlexibility flag as true', () => {
      expect(radiusTokens.radiusMax.isStrategicFlexibility).toBe(true);
    });

    it('should preserve special case mathematical relationship', () => {
      expect(radiusTokens.radiusMax.mathematicalRelationship).toBe('special case = 9999 (effectively infinite)');
    });
  });

  describe('radiusHalf strategic flexibility token', () => {
    it('should preserve hard value of 50 (percentage)', () => {
      expect(radiusTokens.radiusHalf.baseValue).toBe(50);
    });

    it('should maintain isStrategicFlexibility flag as true', () => {
      expect(radiusTokens.radiusHalf.isStrategicFlexibility).toBe(true);
    });

    it('should preserve percentage-based mathematical relationship', () => {
      expect(radiusTokens.radiusHalf.mathematicalRelationship).toBe('percentage = 50% (creates circle from square)');
    });

    it('should have platform-specific percentage values', () => {
      expect(radiusTokens.radiusHalf.platforms.web.value).toBe('50%');
      expect(radiusTokens.radiusHalf.platforms.web.unit).toBe('%');
      expect(radiusTokens.radiusHalf.platforms.ios.value).toBe('Circle');
      expect(radiusTokens.radiusHalf.platforms.ios.unit).toBe('shape');
      expect(radiusTokens.radiusHalf.platforms.android.value).toBe(50);
      expect(radiusTokens.radiusHalf.platforms.android.unit).toBe('percent');
    });
  });

  describe('getStrategicFlexibilityRadiusTokens helper', () => {
    it('should return exactly 5 strategic flexibility tokens', () => {
      const strategicTokens = getStrategicFlexibilityRadiusTokens();
      expect(strategicTokens).toHaveLength(5);
    });

    it('should include radius075, radius125, radius250, radiusMax, and radiusHalf', () => {
      const strategicTokens = getStrategicFlexibilityRadiusTokens();
      const tokenNames = strategicTokens.map(token => token.name);
      
      expect(tokenNames).toContain('radius075');
      expect(tokenNames).toContain('radius125');
      expect(tokenNames).toContain('radius250');
      expect(tokenNames).toContain('radiusMax');
      expect(tokenNames).toContain('radiusHalf');
    });

    it('should verify all strategic tokens have isStrategicFlexibility = true', () => {
      const strategicTokens = getStrategicFlexibilityRadiusTokens();
      
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
        expect(radiusTokens[tokenName].isStrategicFlexibility).toBe(false);
      });
    });
  });
});
