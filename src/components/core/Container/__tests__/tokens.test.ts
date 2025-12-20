/**
 * @category evergreen
 * @purpose Verify tokens component renders correctly and behaves as expected
 */
/**
 * Container Token Mappings Tests
 * 
 * Tests for component-level token reference mappings.
 * Validates that prop values correctly map to design system token names.
 */

import {
  paddingTokenMap,
  borderTokenMap,
  borderRadiusTokenMap,
  layeringTokenMap,
  getPaddingToken,
  getBorderToken,
  getBorderRadiusToken,
  getLayeringToken,
  BORDER_COLOR_TOKEN,
  type Platform
} from '../tokens';
import type { PaddingValue, BorderValue, BorderRadiusValue, LayeringValue } from '../types';

describe('Container Token Mappings', () => {
  describe('paddingTokenMap', () => {
    it('should map padding values to space.inset tokens', () => {
      expect(paddingTokenMap['none']).toBe('');
      expect(paddingTokenMap['050']).toBe('space.inset.050');
      expect(paddingTokenMap['100']).toBe('space.inset.100');
      expect(paddingTokenMap['150']).toBe('space.inset.150');
      expect(paddingTokenMap['200']).toBe('space.inset.200');
      expect(paddingTokenMap['300']).toBe('space.inset.300');
      expect(paddingTokenMap['400']).toBe('space.inset.400');
    });

    it('should have entries for all PaddingValue types', () => {
      const paddingValues: PaddingValue[] = ['none', '050', '100', '150', '200', '300', '400'];
      paddingValues.forEach(value => {
        expect(paddingTokenMap).toHaveProperty(value);
      });
    });
  });

  describe('borderTokenMap', () => {
    it('should map border values to border tokens', () => {
      expect(borderTokenMap['none']).toBe('');
      expect(borderTokenMap['default']).toBe('border.default');
      expect(borderTokenMap['emphasis']).toBe('border.emphasis');
      expect(borderTokenMap['heavy']).toBe('border.heavy');
    });

    it('should have entries for all BorderValue types', () => {
      const borderValues: BorderValue[] = ['none', 'default', 'emphasis', 'heavy'];
      borderValues.forEach(value => {
        expect(borderTokenMap).toHaveProperty(value);
      });
    });
  });

  describe('borderRadiusTokenMap', () => {
    it('should map border radius values to radius tokens', () => {
      expect(borderRadiusTokenMap['none']).toBe('');
      expect(borderRadiusTokenMap['tight']).toBe('radius050');
      expect(borderRadiusTokenMap['normal']).toBe('radius100');
      expect(borderRadiusTokenMap['loose']).toBe('radius200');
    });

    it('should have entries for all BorderRadiusValue types', () => {
      const borderRadiusValues: BorderRadiusValue[] = ['none', 'tight', 'normal', 'loose'];
      borderRadiusValues.forEach(value => {
        expect(borderRadiusTokenMap).toHaveProperty(value);
      });
    });
  });

  describe('layeringTokenMap', () => {
    const layeringValues: LayeringValue[] = ['container', 'navigation', 'dropdown', 'modal', 'toast', 'tooltip'];

    it('should map layering values to z-index tokens for web', () => {
      expect(layeringTokenMap.web['container']).toBe('zIndex.container');
      expect(layeringTokenMap.web['navigation']).toBe('zIndex.navigation');
      expect(layeringTokenMap.web['dropdown']).toBe('zIndex.dropdown');
      expect(layeringTokenMap.web['modal']).toBe('zIndex.modal');
      expect(layeringTokenMap.web['toast']).toBe('zIndex.toast');
      expect(layeringTokenMap.web['tooltip']).toBe('zIndex.tooltip');
    });

    it('should map layering values to z-index tokens for iOS', () => {
      expect(layeringTokenMap.ios['container']).toBe('zIndex.container');
      expect(layeringTokenMap.ios['navigation']).toBe('zIndex.navigation');
      expect(layeringTokenMap.ios['dropdown']).toBe('zIndex.dropdown');
      expect(layeringTokenMap.ios['modal']).toBe('zIndex.modal');
      expect(layeringTokenMap.ios['toast']).toBe('zIndex.toast');
      expect(layeringTokenMap.ios['tooltip']).toBe('zIndex.tooltip');
    });

    it('should map layering values to elevation tokens for Android', () => {
      expect(layeringTokenMap.android['container']).toBe('elevation.container');
      expect(layeringTokenMap.android['navigation']).toBe('elevation.navigation');
      expect(layeringTokenMap.android['dropdown']).toBe('elevation.dropdown');
      expect(layeringTokenMap.android['modal']).toBe('elevation.modal');
      expect(layeringTokenMap.android['toast']).toBe('elevation.toast');
      expect(layeringTokenMap.android['tooltip']).toBe('elevation.tooltip');
    });

    it('should have entries for all LayeringValue types on all platforms', () => {
      const platforms: Platform[] = ['web', 'ios', 'android'];
      platforms.forEach(platform => {
        layeringValues.forEach(value => {
          expect(layeringTokenMap[platform]).toHaveProperty(value);
        });
      });
    });

    it('should use different token types for web/iOS vs Android', () => {
      // Web and iOS use z-index tokens
      expect(layeringTokenMap.web['modal']).toContain('zIndex');
      expect(layeringTokenMap.ios['modal']).toContain('zIndex');
      
      // Android uses elevation tokens
      expect(layeringTokenMap.android['modal']).toContain('elevation');
    });
  });

  describe('getPaddingToken', () => {
    it('should return correct token name for padding values', () => {
      expect(getPaddingToken('none')).toBe('');
      expect(getPaddingToken('050')).toBe('space.inset.050');
      expect(getPaddingToken('100')).toBe('space.inset.100');
      expect(getPaddingToken('200')).toBe('space.inset.200');
      expect(getPaddingToken('400')).toBe('space.inset.400');
    });
  });

  describe('getBorderToken', () => {
    it('should return correct token name for border values', () => {
      expect(getBorderToken('none')).toBe('');
      expect(getBorderToken('default')).toBe('border.default');
      expect(getBorderToken('emphasis')).toBe('border.emphasis');
      expect(getBorderToken('heavy')).toBe('border.heavy');
    });
  });

  describe('getBorderRadiusToken', () => {
    it('should return correct token name for border radius values', () => {
      expect(getBorderRadiusToken('none')).toBe('');
      expect(getBorderRadiusToken('tight')).toBe('radius050');
      expect(getBorderRadiusToken('normal')).toBe('radius100');
      expect(getBorderRadiusToken('loose')).toBe('radius200');
    });
  });

  describe('getLayeringToken', () => {
    it('should return z-index token for web platform', () => {
      expect(getLayeringToken('container', 'web')).toBe('zIndex.container');
      expect(getLayeringToken('modal', 'web')).toBe('zIndex.modal');
      expect(getLayeringToken('tooltip', 'web')).toBe('zIndex.tooltip');
    });

    it('should return z-index token for iOS platform', () => {
      expect(getLayeringToken('container', 'ios')).toBe('zIndex.container');
      expect(getLayeringToken('modal', 'ios')).toBe('zIndex.modal');
      expect(getLayeringToken('tooltip', 'ios')).toBe('zIndex.tooltip');
    });

    it('should return elevation token for Android platform', () => {
      expect(getLayeringToken('container', 'android')).toBe('elevation.container');
      expect(getLayeringToken('modal', 'android')).toBe('elevation.modal');
      expect(getLayeringToken('tooltip', 'android')).toBe('elevation.tooltip');
    });

    it('should return different tokens for same layering value on different platforms', () => {
      const webToken = getLayeringToken('modal', 'web');
      const androidToken = getLayeringToken('modal', 'android');
      
      expect(webToken).not.toBe(androidToken);
      expect(webToken).toContain('zIndex');
      expect(androidToken).toContain('elevation');
    });
  });

  describe('BORDER_COLOR_TOKEN', () => {
    it('should be defined as color.border', () => {
      expect(BORDER_COLOR_TOKEN).toBe('color.border');
    });

    it('should be a constant string', () => {
      expect(typeof BORDER_COLOR_TOKEN).toBe('string');
    });
  });

  describe('Token naming conventions', () => {
    it('should use dot notation for semantic tokens', () => {
      // Padding tokens use dot notation
      expect(paddingTokenMap['100']).toMatch(/^space\./);
      
      // Border color uses dot notation
      expect(BORDER_COLOR_TOKEN).toMatch(/^color\./);
      
      // Layering tokens use dot notation
      expect(layeringTokenMap.web['modal']).toMatch(/^zIndex\./);
      expect(layeringTokenMap.android['modal']).toMatch(/^elevation\./);
    });

    it('should use direct primitive names for radius tokens', () => {
      // Radius tokens use direct primitive names (no dot notation)
      expect(borderRadiusTokenMap['tight']).toBe('radius050');
      expect(borderRadiusTokenMap['normal']).toBe('radius100');
      expect(borderRadiusTokenMap['loose']).toBe('radius200');
    });

    it('should use direct primitive names for border width tokens', () => {
      // Border width tokens use direct primitive names (no dot notation)
      expect(borderTokenMap['default']).toBe('border.default');
      expect(borderTokenMap['emphasis']).toBe('border.emphasis');
      expect(borderTokenMap['heavy']).toBe('border.heavy');
    });
  });

  describe('Empty string for "none" values', () => {
    it('should return empty string for "none" padding', () => {
      expect(getPaddingToken('none')).toBe('');
    });

    it('should return empty string for "none" border', () => {
      expect(getBorderToken('none')).toBe('');
    });

    it('should return empty string for "none" border radius', () => {
      expect(getBorderRadiusToken('none')).toBe('');
    });
  });
});
