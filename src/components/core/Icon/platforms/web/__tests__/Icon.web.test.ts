/**
 * Icon Component Tests for Web Platform
 * 
 * Tests the Icon component's core functionality including:
 * - Size rendering (width, height attributes)
 * - Color inheritance (currentColor for stroke)
 * - Accessibility (aria-hidden="true")
 * - Invalid name handling (fallback to circle)
 * - Custom className application
 * 
 * @module Icon/platforms/web/__tests__
 */

import { createIcon, Icon } from '../Icon.web';
import { IconProps, IconSize } from '../../../types';

describe('Icon Component (Web)', () => {
  describe('createIcon function', () => {
    it('should render icon with correct size (width and height attributes)', () => {
      const props: IconProps = {
        name: 'arrow-right',
        size: 24
      };
      
      const result = createIcon(props);
      
      // Check that SVG has correct width and height attributes
      expect(result).toContain('width="24"');
      expect(result).toContain('height="24"');
    });

    it('should render icon with different sizes', () => {
      const sizes: IconSize[] = [18, 24, 32, 40];
      
      sizes.forEach(size => {
        const props: IconProps = {
          name: 'check',
          size
        };
        
        const result = createIcon(props);
        
        expect(result).toContain(`width="${size}"`);
        expect(result).toContain(`height="${size}"`);
      });
    });

    it('should use currentColor for stroke', () => {
      const props: IconProps = {
        name: 'arrow-right',
        size: 24
      };
      
      const result = createIcon(props);
      
      // Check that SVG uses currentColor for stroke attribute
      expect(result).toContain('stroke="currentColor"');
    });

    it('should be hidden from screen readers (aria-hidden="true")', () => {
      const props: IconProps = {
        name: 'arrow-right',
        size: 24
      };
      
      const result = createIcon(props);
      
      // Check that SVG has aria-hidden="true" attribute
      expect(result).toContain('aria-hidden="true"');
    });

    it('should handle invalid icon names with fallback to circle', () => {
      const props: IconProps = {
        name: 'invalid-icon-name' as any, // Force invalid name
        size: 24
      };
      
      const result = createIcon(props);
      
      // Check that result contains circle SVG content (fallback)
      expect(result).toContain('<circle cx="12" cy="12" r="10"></circle>');
      // Should still have the invalid name in the class
      expect(result).toContain('icon-invalid-icon-name');
    });

    it('should apply custom className', () => {
      const props: IconProps = {
        name: 'arrow-right',
        size: 24,
        className: 'custom-icon-class'
      };
      
      const result = createIcon(props);
      
      // Check that custom className is applied
      expect(result).toContain('custom-icon-class');
      // Should also include default icon classes
      expect(result).toContain('icon');
      expect(result).toContain('icon-arrow-right');
    });

    it('should apply multiple custom classes', () => {
      const props: IconProps = {
        name: 'check',
        size: 24,
        className: 'success-icon large-icon'
      };
      
      const result = createIcon(props);
      
      expect(result).toContain('success-icon');
      expect(result).toContain('large-icon');
    });

    it('should include testID as data-testid attribute', () => {
      const props: IconProps = {
        name: 'arrow-right',
        size: 24,
        testID: 'my-test-icon'
      };
      
      const result = createIcon(props);
      
      expect(result).toContain('data-testid="my-test-icon"');
    });

    it('should render all available icon names', () => {
      const iconNames = [
        'arrow-right', 'arrow-left', 'arrow-up', 'arrow-down',
        'chevron-right', 'check', 'x', 'plus', 'minus',
        'circle', 'heart', 'settings', 'user', 'mail', 'calendar'
      ];
      
      iconNames.forEach(name => {
        const props: IconProps = {
          name: name as any,
          size: 24
        };
        
        const result = createIcon(props);
        
        // Each icon should render successfully
        expect(result).toContain('<svg');
        expect(result).toContain('</svg>');
        expect(result).toContain(`icon-${name}`);
      });
    });

    it('should apply custom styles', () => {
      const props: IconProps = {
        name: 'arrow-right',
        size: 24,
        style: {
          marginRight: '8px',
          color: 'blue'
        }
      };
      
      const result = createIcon(props);
      
      // Check that style attribute is present with converted kebab-case properties
      expect(result).toContain('style="');
      expect(result).toContain('margin-right: 8px');
      expect(result).toContain('color: blue');
    });

    it('should have correct SVG attributes for accessibility and rendering', () => {
      const props: IconProps = {
        name: 'arrow-right',
        size: 24
      };
      
      const result = createIcon(props);
      
      // Check essential SVG attributes
      expect(result).toContain('viewBox="0 0 24 24"');
      expect(result).toContain('fill="none"');
      expect(result).toContain('stroke-width="2"');
      expect(result).toContain('stroke-linecap="round"');
      expect(result).toContain('stroke-linejoin="round"');
    });
  });

  describe('Icon class', () => {
    it('should create Icon instance and render', () => {
      const icon = new Icon({
        name: 'arrow-right',
        size: 24
      });
      
      const result = icon.render();
      
      expect(result).toContain('width="24"');
      expect(result).toContain('height="24"');
      expect(result).toContain('icon-arrow-right');
    });

    it('should update icon properties', () => {
      const icon = new Icon({
        name: 'arrow-right',
        size: 24
      });
      
      icon.update({ size: 32, className: 'updated-class' });
      
      const result = icon.render();
      
      expect(result).toContain('width="32"');
      expect(result).toContain('height="32"');
      expect(result).toContain('updated-class');
    });

    it('should get current icon properties', () => {
      const props: IconProps = {
        name: 'check',
        size: 24,
        className: 'test-class'
      };
      
      const icon = new Icon(props);
      const currentProps = icon.getProps();
      
      expect(currentProps.name).toBe('check');
      expect(currentProps.size).toBe(24);
      expect(currentProps.className).toBe('test-class');
    });

    it('should maintain immutability when getting props', () => {
      const icon = new Icon({
        name: 'arrow-right',
        size: 24
      });
      
      const props1 = icon.getProps();
      const props2 = icon.getProps();
      
      // Should return different objects (copies)
      expect(props1).not.toBe(props2);
      // But with same values
      expect(props1).toEqual(props2);
    });
  });

  describe('Color Override', () => {
    it('should use currentColor by default (inherit)', () => {
      const props: IconProps = {
        name: 'arrow-right',
        size: 24
      };
      
      const result = createIcon(props);
      
      expect(result).toContain('stroke="currentColor"');
    });

    it('should use currentColor when color is explicitly "inherit"', () => {
      const props: IconProps = {
        name: 'arrow-right',
        size: 24,
        color: 'inherit'
      };
      
      const result = createIcon(props);
      
      expect(result).toContain('stroke="currentColor"');
    });

    it('should use CSS custom property for token reference', () => {
      const props: IconProps = {
        name: 'arrow-right',
        size: 24,
        color: 'color-text-secondary'
      };
      
      const result = createIcon(props);
      
      expect(result).toContain('stroke="var(--color-text-secondary)"');
    });

    it('should support different token references', () => {
      const tokens = [
        'color-text-primary',
        'color-text-secondary',
        'color-primary',
        'color-error'
      ];
      
      tokens.forEach(token => {
        const result = createIcon({
          name: 'check',
          size: 24,
          color: token
        });
        
        expect(result).toContain(`stroke="var(--${token})"`);
      });
    });

    it('should work with Icon class and color override', () => {
      const icon = new Icon({
        name: 'arrow-right',
        size: 24,
        color: 'color-text-secondary'
      });
      
      const result = icon.render();
      
      expect(result).toContain('stroke="var(--color-text-secondary)"');
    });

    it('should update color via Icon class update method', () => {
      const icon = new Icon({
        name: 'arrow-right',
        size: 24
      });
      
      // Initially uses currentColor
      let result = icon.render();
      expect(result).toContain('stroke="currentColor"');
      
      // Update to use token
      icon.update({ color: 'color-primary' });
      result = icon.render();
      expect(result).toContain('stroke="var(--color-primary)"');
      
      // Update back to inherit
      icon.update({ color: 'inherit' });
      result = icon.render();
      expect(result).toContain('stroke="currentColor"');
    });
  });

  describe('Requirements Compliance', () => {
    it('should meet Requirement 1.1: Unified icon component API', () => {
      // Icon component provides consistent API with name and size props
      const props: IconProps = {
        name: 'arrow-right',
        size: 24
      };
      
      const result = createIcon(props);
      
      expect(result).toBeTruthy();
      expect(result).toContain('<svg');
    });

    it('should meet Requirement 2.1-2.6: Icon size variants', () => {
      // Test all specified size variants from icon size tokens (Spec 006)
      const sizes: IconSize[] = [13, 18, 24, 28, 32, 36, 40, 44, 48];
      
      sizes.forEach(size => {
        const result = createIcon({ name: 'check', size });
        expect(result).toContain(`width="${size}"`);
        expect(result).toContain(`height="${size}"`);
      });
    });

    it('should meet Requirement 3.1: Color inheritance on web', () => {
      // Icon uses stroke="currentColor" for automatic color inheritance
      const result = createIcon({ name: 'arrow-right', size: 24 });
      
      expect(result).toContain('stroke="currentColor"');
    });

    it('should meet Requirement 7.1: Color override support on web', () => {
      // Icon supports optional color parameter for explicit color control
      const inheritResult = createIcon({ 
        name: 'arrow-right', 
        size: 24, 
        color: 'inherit' 
      });
      expect(inheritResult).toContain('stroke="currentColor"');
      
      const tokenResult = createIcon({ 
        name: 'arrow-right', 
        size: 24, 
        color: 'color-text-secondary' 
      });
      expect(tokenResult).toContain('stroke="var(--color-text-secondary)"');
    });

    it('should meet Requirement 7.1: Accessibility on web', () => {
      // Icon is hidden from screen readers with aria-hidden="true"
      const result = createIcon({ name: 'arrow-right', size: 24 });
      
      expect(result).toContain('aria-hidden="true"');
    });
  });
});
