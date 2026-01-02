/**
 * Container-Base Component Tests
 * 
 * Stemma System naming: [Family]-[Type] = Container-Base
 * Type: Primitive (foundational component)
 * 
 * Tests for the Container-Base component types, tokens, and web implementation.
 * 
 * @see ../README.md for component documentation
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
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
  BORDER_COLOR_TOKEN
} from '../tokens';

import {
  isPaddingValue,
  isBorderValue,
  isBorderRadiusValue,
  isLayeringValue,
  isSemanticHTMLElement
} from '../types';

import type {
  PaddingValue,
  BorderValue,
  BorderRadiusValue,
  LayeringValue,
  SemanticHTMLElement,
  ContainerBaseProps
} from '../types';

describe('Container-Base Component', () => {
  describe('Token Mappings', () => {
    describe('paddingTokenMap', () => {
      it('should map padding values to correct tokens', () => {
        expect(paddingTokenMap['none']).toBe('');
        expect(paddingTokenMap['050']).toBe('space.inset.050');
        expect(paddingTokenMap['100']).toBe('space.inset.100');
        expect(paddingTokenMap['150']).toBe('space.inset.150');
        expect(paddingTokenMap['200']).toBe('space.inset.200');
        expect(paddingTokenMap['300']).toBe('space.inset.300');
        expect(paddingTokenMap['400']).toBe('space.inset.400');
      });

      it('should have all padding values defined', () => {
        const paddingValues: PaddingValue[] = ['none', '050', '100', '150', '200', '300', '400'];
        paddingValues.forEach(value => {
          expect(paddingTokenMap[value]).toBeDefined();
        });
      });
    });

    describe('borderTokenMap', () => {
      it('should map border values to correct tokens', () => {
        expect(borderTokenMap['none']).toBe('');
        expect(borderTokenMap['default']).toBe('border.border.default');
        expect(borderTokenMap['emphasis']).toBe('border.border.emphasis');
        expect(borderTokenMap['heavy']).toBe('border.border.heavy');
      });

      it('should have all border values defined', () => {
        const borderValues: BorderValue[] = ['none', 'default', 'emphasis', 'heavy'];
        borderValues.forEach(value => {
          expect(borderTokenMap[value]).toBeDefined();
        });
      });
    });

    describe('borderRadiusTokenMap', () => {
      it('should map border radius values to correct tokens', () => {
        expect(borderRadiusTokenMap['none']).toBe('');
        expect(borderRadiusTokenMap['tight']).toBe('radius-050');
        expect(borderRadiusTokenMap['normal']).toBe('radius-100');
        expect(borderRadiusTokenMap['loose']).toBe('radius-200');
      });

      it('should have all border radius values defined', () => {
        const borderRadiusValues: BorderRadiusValue[] = ['none', 'tight', 'normal', 'loose'];
        borderRadiusValues.forEach(value => {
          expect(borderRadiusTokenMap[value]).toBeDefined();
        });
      });
    });

    describe('layeringTokenMap', () => {
      it('should map layering values to correct web tokens', () => {
        expect(layeringTokenMap.web['container']).toBe('zIndex.container');
        expect(layeringTokenMap.web['navigation']).toBe('zIndex.navigation');
        expect(layeringTokenMap.web['dropdown']).toBe('zIndex.dropdown');
        expect(layeringTokenMap.web['modal']).toBe('zIndex.modal');
        expect(layeringTokenMap.web['toast']).toBe('zIndex.toast');
        expect(layeringTokenMap.web['tooltip']).toBe('zIndex.tooltip');
      });

      it('should map layering values to correct iOS tokens', () => {
        expect(layeringTokenMap.ios['container']).toBe('zIndex.container');
        expect(layeringTokenMap.ios['navigation']).toBe('zIndex.navigation');
        expect(layeringTokenMap.ios['dropdown']).toBe('zIndex.dropdown');
        expect(layeringTokenMap.ios['modal']).toBe('zIndex.modal');
        expect(layeringTokenMap.ios['toast']).toBe('zIndex.toast');
        expect(layeringTokenMap.ios['tooltip']).toBe('zIndex.tooltip');
      });

      it('should map layering values to correct Android tokens', () => {
        expect(layeringTokenMap.android['container']).toBe('elevation.container');
        expect(layeringTokenMap.android['navigation']).toBe('elevation.navigation');
        expect(layeringTokenMap.android['dropdown']).toBe('elevation.dropdown');
        expect(layeringTokenMap.android['modal']).toBe('elevation.modal');
        expect(layeringTokenMap.android['toast']).toBe('elevation.toast');
        expect(layeringTokenMap.android['tooltip']).toBe('elevation.tooltip');
      });
    });

    describe('BORDER_COLOR_TOKEN', () => {
      it('should be defined as color.border', () => {
        expect(BORDER_COLOR_TOKEN).toBe('color.border');
      });
    });
  });

  describe('Token Helper Functions', () => {
    describe('getPaddingToken', () => {
      it('should return correct token for padding value', () => {
        expect(getPaddingToken('200')).toBe('space.inset.200');
        expect(getPaddingToken('none')).toBe('');
      });
    });

    describe('getBorderToken', () => {
      it('should return correct token for border value', () => {
        expect(getBorderToken('default')).toBe('border.border.default');
        expect(getBorderToken('none')).toBe('');
      });
    });

    describe('getBorderRadiusToken', () => {
      it('should return correct token for border radius value', () => {
        expect(getBorderRadiusToken('normal')).toBe('radius-100');
        expect(getBorderRadiusToken('none')).toBe('');
      });
    });

    describe('getLayeringToken', () => {
      it('should return correct token for layering value and platform', () => {
        expect(getLayeringToken('modal', 'web')).toBe('zIndex.modal');
        expect(getLayeringToken('modal', 'ios')).toBe('zIndex.modal');
        expect(getLayeringToken('modal', 'android')).toBe('elevation.modal');
      });
    });
  });

  describe('Type Guards', () => {
    describe('isPaddingValue', () => {
      it('should return true for valid padding values', () => {
        expect(isPaddingValue('none')).toBe(true);
        expect(isPaddingValue('050')).toBe(true);
        expect(isPaddingValue('100')).toBe(true);
        expect(isPaddingValue('150')).toBe(true);
        expect(isPaddingValue('200')).toBe(true);
        expect(isPaddingValue('300')).toBe(true);
        expect(isPaddingValue('400')).toBe(true);
      });

      it('should return false for invalid padding values', () => {
        expect(isPaddingValue('invalid')).toBe(false);
        expect(isPaddingValue('500')).toBe(false);
        expect(isPaddingValue('')).toBe(false);
      });
    });

    describe('isBorderValue', () => {
      it('should return true for valid border values', () => {
        expect(isBorderValue('none')).toBe(true);
        expect(isBorderValue('default')).toBe(true);
        expect(isBorderValue('emphasis')).toBe(true);
        expect(isBorderValue('heavy')).toBe(true);
      });

      it('should return false for invalid border values', () => {
        expect(isBorderValue('invalid')).toBe(false);
        expect(isBorderValue('thin')).toBe(false);
        expect(isBorderValue('')).toBe(false);
      });
    });

    describe('isBorderRadiusValue', () => {
      it('should return true for valid border radius values', () => {
        expect(isBorderRadiusValue('none')).toBe(true);
        expect(isBorderRadiusValue('tight')).toBe(true);
        expect(isBorderRadiusValue('normal')).toBe(true);
        expect(isBorderRadiusValue('loose')).toBe(true);
      });

      it('should return false for invalid border radius values', () => {
        expect(isBorderRadiusValue('invalid')).toBe(false);
        expect(isBorderRadiusValue('round')).toBe(false);
        expect(isBorderRadiusValue('')).toBe(false);
      });
    });

    describe('isLayeringValue', () => {
      it('should return true for valid layering values', () => {
        expect(isLayeringValue('container')).toBe(true);
        expect(isLayeringValue('navigation')).toBe(true);
        expect(isLayeringValue('dropdown')).toBe(true);
        expect(isLayeringValue('modal')).toBe(true);
        expect(isLayeringValue('toast')).toBe(true);
        expect(isLayeringValue('tooltip')).toBe(true);
      });

      it('should return false for invalid layering values', () => {
        expect(isLayeringValue('invalid')).toBe(false);
        expect(isLayeringValue('popup')).toBe(false);
        expect(isLayeringValue('')).toBe(false);
      });
    });

    describe('isSemanticHTMLElement', () => {
      it('should return true for valid semantic HTML elements', () => {
        expect(isSemanticHTMLElement('div')).toBe(true);
        expect(isSemanticHTMLElement('section')).toBe(true);
        expect(isSemanticHTMLElement('article')).toBe(true);
        expect(isSemanticHTMLElement('aside')).toBe(true);
        expect(isSemanticHTMLElement('nav')).toBe(true);
        expect(isSemanticHTMLElement('header')).toBe(true);
        expect(isSemanticHTMLElement('footer')).toBe(true);
        expect(isSemanticHTMLElement('main')).toBe(true);
        expect(isSemanticHTMLElement('fieldset')).toBe(true);
      });

      it('should return false for invalid semantic HTML elements', () => {
        expect(isSemanticHTMLElement('span')).toBe(false);
        expect(isSemanticHTMLElement('p')).toBe(false);
        expect(isSemanticHTMLElement('')).toBe(false);
      });
    });
  });

  describe('ContainerBaseProps Interface', () => {
    it('should allow valid props', () => {
      const validProps: ContainerBaseProps = {
        padding: '200',
        background: 'color.surface' as any,
        shadow: 'shadow.container' as any,
        border: 'default',
        borderRadius: 'normal',
        opacity: 'opacity.subtle' as any,
        layering: 'navigation',
        semantic: 'article',
        accessibilityLabel: 'Test container',
        hoverable: true,
        ignoresSafeArea: false
      };

      expect(validProps.padding).toBe('200');
      expect(validProps.background).toBe('color.surface');
      expect(validProps.border).toBe('default');
      expect(validProps.borderRadius).toBe('normal');
      expect(validProps.layering).toBe('navigation');
      expect(validProps.semantic).toBe('article');
      expect(validProps.accessibilityLabel).toBe('Test container');
      expect(validProps.hoverable).toBe(true);
    });

    it('should allow minimal props', () => {
      const minimalProps: ContainerBaseProps = {};
      expect(minimalProps.padding).toBeUndefined();
      expect(minimalProps.background).toBeUndefined();
    });
  });
});
