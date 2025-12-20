/**
 * @category evergreen
 * @purpose Verify Motion tokens are correctly defined and structured
 */
/**
 * Motion Tokens Unit Tests
 * 
 * Tests for primitive motion tokens (duration, easing, scale) covering:
 * - Token existence and type correctness
 * - Utility function behavior
 * - Cross-platform consistency
 * - Mathematical relationships
 * 
 * Requirements: 1.1, 2.1, 3.1
 */

import { TokenCategory } from '../../types/PrimitiveToken';
import {
  durationTokens,
  durationTokenNames,
  getDurationToken,
  getAllDurationTokens,
  DURATION_BASE_VALUE
} from '../DurationTokens';
import {
  easingTokens,
  easingTokenNames,
  getEasingToken,
  getAllEasingTokens
} from '../EasingTokens';
import {
  scaleTokens,
  scaleTokenNames,
  getScaleToken,
  getAllScaleTokens,
  SCALE_BASE_VALUE
} from '../ScaleTokens';

describe('Duration Tokens', () => {
  describe('Token Existence and Type Correctness', () => {
    test('should have all three duration tokens defined', () => {
      expect(durationTokens.duration150).toBeDefined();
      expect(durationTokens.duration250).toBeDefined();
      expect(durationTokens.duration350).toBeDefined();
    });

    test('should have valid numeric values for all duration tokens', () => {
      const allTokens = getAllDurationTokens();
      
      allTokens.forEach(token => {
        expect(typeof token.baseValue).toBe('number');
        expect(token.baseValue).toBeGreaterThan(0);
        expect(Number.isFinite(token.baseValue)).toBe(true);
      });
    });

    test('should have correct duration values', () => {
      expect(durationTokens.duration150.baseValue).toBe(150);
      expect(durationTokens.duration250.baseValue).toBe(250);
      expect(durationTokens.duration350.baseValue).toBe(350);
    });

    test('should have correct token category', () => {
      const allTokens = getAllDurationTokens();
      
      allTokens.forEach(token => {
        expect(token.category).toBe(TokenCategory.SPACING); // Temporary until DURATION category added
      });
    });

    test('should have correct family base value', () => {
      const allTokens = getAllDurationTokens();
      
      allTokens.forEach(token => {
        expect(token.familyBaseValue).toBe(DURATION_BASE_VALUE);
        expect(token.familyBaseValue).toBe(250);
      });
    });
  });

  describe('Utility Functions', () => {
    test('getDurationToken should return correct token by name', () => {
      const duration150 = getDurationToken('duration150');
      expect(duration150).toBeDefined();
      expect(duration150?.name).toBe('duration150');
      expect(duration150?.baseValue).toBe(150);

      const duration250 = getDurationToken('duration250');
      expect(duration250).toBeDefined();
      expect(duration250?.name).toBe('duration250');
      expect(duration250?.baseValue).toBe(250);

      const duration350 = getDurationToken('duration350');
      expect(duration350).toBeDefined();
      expect(duration350?.name).toBe('duration350');
      expect(duration350?.baseValue).toBe(350);
    });

    test('getDurationToken should return undefined for invalid token name', () => {
      const invalidToken = getDurationToken('duration999');
      expect(invalidToken).toBeUndefined();
    });

    test('getAllDurationTokens should return all tokens as array', () => {
      const allTokens = getAllDurationTokens();
      
      expect(Array.isArray(allTokens)).toBe(true);
      expect(allTokens).toHaveLength(3);
      expect(allTokens.every(token => token.category === TokenCategory.SPACING)).toBe(true);
    });

    test('durationTokenNames should contain all token names', () => {
      expect(durationTokenNames).toEqual(['duration150', 'duration250', 'duration350']);
      expect(durationTokenNames).toHaveLength(3);
    });
  });

  describe('Cross-Platform Consistency', () => {
    test('should have platform values for all tokens', () => {
      const allTokens = getAllDurationTokens();
      
      allTokens.forEach(token => {
        expect(token.platforms.web).toBeDefined();
        expect(token.platforms.ios).toBeDefined();
        expect(token.platforms.android).toBeDefined();
      });
    });

    test('should have correct platform units', () => {
      const allTokens = getAllDurationTokens();
      
      allTokens.forEach(token => {
        expect(token.platforms.web.unit).toBe('unitless');
        expect(token.platforms.ios.unit).toBe('unitless');
        expect(token.platforms.android.unit).toBe('unitless');
      });
    });

    test('should have correct platform value conversions', () => {
      // Web and Android use milliseconds (same as baseValue)
      expect(durationTokens.duration150.platforms.web.value).toBe(150);
      expect(durationTokens.duration150.platforms.android.value).toBe(150);
      
      // iOS uses seconds (baseValue / 1000)
      expect(durationTokens.duration150.platforms.ios.value).toBe(0.15);
      expect(durationTokens.duration250.platforms.ios.value).toBe(0.25);
      expect(durationTokens.duration350.platforms.ios.value).toBe(0.35);
    });
  });
});

describe('Easing Tokens', () => {
  describe('Token Existence and Type Correctness', () => {
    test('should have all three easing tokens defined', () => {
      expect(easingTokens.easingStandard).toBeDefined();
      expect(easingTokens.easingDecelerate).toBeDefined();
      expect(easingTokens.easingAccelerate).toBeDefined();
    });

    test('should have valid cubic-bezier strings for all easing tokens', () => {
      const allTokens = getAllEasingTokens();
      
      allTokens.forEach(token => {
        const value = token.platforms.web.value as string;
        expect(typeof value).toBe('string');
        expect(value).toMatch(/^cubic-bezier\(/);
        expect(value).toContain(',');
      });
    });

    test('should have correct cubic-bezier values', () => {
      expect(easingTokens.easingStandard.platforms.web.value).toBe('cubic-bezier(0.4, 0.0, 0.2, 1)');
      expect(easingTokens.easingDecelerate.platforms.web.value).toBe('cubic-bezier(0.0, 0.0, 0.2, 1)');
      expect(easingTokens.easingAccelerate.platforms.web.value).toBe('cubic-bezier(0.4, 0.0, 1, 1)');
    });

    test('should have correct token category', () => {
      const allTokens = getAllEasingTokens();
      
      allTokens.forEach(token => {
        expect(token.category).toBe(TokenCategory.SPACING); // Temporary until EASING category added
      });
    });

    test('should have baseValue of 0 for categorical tokens', () => {
      const allTokens = getAllEasingTokens();
      
      allTokens.forEach(token => {
        expect(token.baseValue).toBe(0);
        expect(token.familyBaseValue).toBe(0);
      });
    });
  });

  describe('Utility Functions', () => {
    test('getEasingToken should return correct token by name', () => {
      const easingStandard = getEasingToken('easingStandard');
      expect(easingStandard).toBeDefined();
      expect(easingStandard?.name).toBe('easingStandard');
      expect(easingStandard?.platforms.web.value).toBe('cubic-bezier(0.4, 0.0, 0.2, 1)');

      const easingDecelerate = getEasingToken('easingDecelerate');
      expect(easingDecelerate).toBeDefined();
      expect(easingDecelerate?.name).toBe('easingDecelerate');
      expect(easingDecelerate?.platforms.web.value).toBe('cubic-bezier(0.0, 0.0, 0.2, 1)');

      const easingAccelerate = getEasingToken('easingAccelerate');
      expect(easingAccelerate).toBeDefined();
      expect(easingAccelerate?.name).toBe('easingAccelerate');
      expect(easingAccelerate?.platforms.web.value).toBe('cubic-bezier(0.4, 0.0, 1, 1)');
    });

    test('getEasingToken should return undefined for invalid token name', () => {
      const invalidToken = getEasingToken('easingInvalid');
      expect(invalidToken).toBeUndefined();
    });

    test('getAllEasingTokens should return all tokens as array', () => {
      const allTokens = getAllEasingTokens();
      
      expect(Array.isArray(allTokens)).toBe(true);
      expect(allTokens).toHaveLength(3);
      expect(allTokens.every(token => token.category === TokenCategory.SPACING)).toBe(true);
    });

    test('easingTokenNames should contain all token names', () => {
      expect(easingTokenNames).toEqual(['easingStandard', 'easingDecelerate', 'easingAccelerate']);
      expect(easingTokenNames).toHaveLength(3);
    });
  });

  describe('Cross-Platform Consistency', () => {
    test('should have platform values for all tokens', () => {
      const allTokens = getAllEasingTokens();
      
      allTokens.forEach(token => {
        expect(token.platforms.web).toBeDefined();
        expect(token.platforms.ios).toBeDefined();
        expect(token.platforms.android).toBeDefined();
      });
    });

    test('should have correct platform units', () => {
      const allTokens = getAllEasingTokens();
      
      allTokens.forEach(token => {
        expect(token.platforms.web.unit).toBe('unitless');
        expect(token.platforms.ios.unit).toBe('unitless');
        expect(token.platforms.android.unit).toBe('unitless');
      });
    });

    test('should have identical cubic-bezier values across platforms', () => {
      const allTokens = getAllEasingTokens();
      
      allTokens.forEach(token => {
        const webValue = token.platforms.web.value;
        const iosValue = token.platforms.ios.value;
        const androidValue = token.platforms.android.value;
        
        expect(webValue).toBe(iosValue);
        expect(iosValue).toBe(androidValue);
      });
    });
  });
});

describe('Scale Tokens', () => {
  describe('Token Existence and Type Correctness', () => {
    test('should have all six scale tokens defined', () => {
      expect(scaleTokens.scale088).toBeDefined();
      expect(scaleTokens.scale092).toBeDefined();
      expect(scaleTokens.scale096).toBeDefined();
      expect(scaleTokens.scale100).toBeDefined();
      expect(scaleTokens.scale104).toBeDefined();
      expect(scaleTokens.scale108).toBeDefined();
    });

    test('should have valid numeric values for all scale tokens', () => {
      const allTokens = getAllScaleTokens();
      
      allTokens.forEach(token => {
        expect(typeof token.baseValue).toBe('number');
        expect(token.baseValue).toBeGreaterThan(0);
        expect(Number.isFinite(token.baseValue)).toBe(true);
      });
    });

    test('should have correct scale values', () => {
      expect(scaleTokens.scale088.baseValue).toBe(0.88);
      expect(scaleTokens.scale092.baseValue).toBe(0.92);
      expect(scaleTokens.scale096.baseValue).toBe(0.96);
      expect(scaleTokens.scale100.baseValue).toBe(1.00);
      expect(scaleTokens.scale104.baseValue).toBe(1.04);
      expect(scaleTokens.scale108.baseValue).toBe(1.08);
    });

    test('should have correct token category', () => {
      const allTokens = getAllScaleTokens();
      
      allTokens.forEach(token => {
        expect(token.category).toBe(TokenCategory.SPACING); // Temporary until SCALE category added
      });
    });

    test('should have correct family base value', () => {
      const allTokens = getAllScaleTokens();
      
      allTokens.forEach(token => {
        expect(token.familyBaseValue).toBe(SCALE_BASE_VALUE);
        expect(token.familyBaseValue).toBe(1.00);
      });
    });
  });

  describe('Utility Functions', () => {
    test('getScaleToken should return correct token by name', () => {
      const scale088 = getScaleToken('scale088');
      expect(scale088).toBeDefined();
      expect(scale088?.name).toBe('scale088');
      expect(scale088?.baseValue).toBe(0.88);

      const scale100 = getScaleToken('scale100');
      expect(scale100).toBeDefined();
      expect(scale100?.name).toBe('scale100');
      expect(scale100?.baseValue).toBe(1.00);

      const scale108 = getScaleToken('scale108');
      expect(scale108).toBeDefined();
      expect(scale108?.name).toBe('scale108');
      expect(scale108?.baseValue).toBe(1.08);
    });

    test('getScaleToken should return undefined for invalid token name', () => {
      const invalidToken = getScaleToken('scale999');
      expect(invalidToken).toBeUndefined();
    });

    test('getAllScaleTokens should return all tokens as array', () => {
      const allTokens = getAllScaleTokens();
      
      expect(Array.isArray(allTokens)).toBe(true);
      expect(allTokens).toHaveLength(6);
      expect(allTokens.every(token => token.category === TokenCategory.SPACING)).toBe(true);
    });

    test('scaleTokenNames should contain all token names', () => {
      expect(scaleTokenNames).toEqual([
        'scale088',
        'scale092',
        'scale096',
        'scale100',
        'scale104',
        'scale108'
      ]);
      expect(scaleTokenNames).toHaveLength(6);
    });
  });

  describe('Cross-Platform Consistency', () => {
    test('should have platform values for all tokens', () => {
      const allTokens = getAllScaleTokens();
      
      allTokens.forEach(token => {
        expect(token.platforms.web).toBeDefined();
        expect(token.platforms.ios).toBeDefined();
        expect(token.platforms.android).toBeDefined();
      });
    });

    test('should have correct platform units', () => {
      const allTokens = getAllScaleTokens();
      
      allTokens.forEach(token => {
        expect(token.platforms.web.unit).toBe('unitless');
        expect(token.platforms.ios.unit).toBe('unitless');
        expect(token.platforms.android.unit).toBe('unitless');
      });
    });

    test('should have identical scale values across platforms', () => {
      const allTokens = getAllScaleTokens();
      
      allTokens.forEach(token => {
        const webValue = token.platforms.web.value;
        const iosValue = token.platforms.ios.value;
        const androidValue = token.platforms.android.value;
        
        expect(webValue).toBe(iosValue);
        expect(iosValue).toBe(androidValue);
        expect(webValue).toBe(token.baseValue);
      });
    });
  });

  describe('Mathematical Relationships', () => {
    test('should follow 8-interval progression (0.04 increments)', () => {
      const tokens = getAllScaleTokens();
      const sortedTokens = tokens.sort((a, b) => a.baseValue - b.baseValue);
      
      // Check intervals between consecutive tokens
      for (let i = 1; i < sortedTokens.length; i++) {
        const interval = sortedTokens[i].baseValue - sortedTokens[i - 1].baseValue;
        expect(interval).toBeCloseTo(0.04, 2);
      }
    });

    test('should be centered around base value of 1.00', () => {
      expect(scaleTokens.scale100.baseValue).toBe(SCALE_BASE_VALUE);
      expect(scaleTokens.scale100.baseValue).toBe(1.00);
    });

    test('should have symmetric progression around base value', () => {
      // scale088 and scale108 should be equidistant from base
      const distance088 = Math.abs(scaleTokens.scale088.baseValue - SCALE_BASE_VALUE);
      const distance108 = Math.abs(scaleTokens.scale108.baseValue - SCALE_BASE_VALUE);
      expect(distance088).toBeCloseTo(0.12, 2);
      expect(distance108).toBeCloseTo(0.08, 2);
      
      // scale092 and scale104 should be equidistant from base
      const distance092 = Math.abs(scaleTokens.scale092.baseValue - SCALE_BASE_VALUE);
      const distance104 = Math.abs(scaleTokens.scale104.baseValue - SCALE_BASE_VALUE);
      expect(distance092).toBeCloseTo(0.08, 2);
      expect(distance104).toBeCloseTo(0.04, 2);
      
      // scale096 and scale100 should be close to base
      const distance096 = Math.abs(scaleTokens.scale096.baseValue - SCALE_BASE_VALUE);
      expect(distance096).toBeCloseTo(0.04, 2);
    });
  });
});
