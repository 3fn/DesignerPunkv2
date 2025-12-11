/**
 * Icon Backward Compatibility Tests
 * 
 * Tests that verify backward compatibility exports work correctly
 * and that ButtonCTA continues to function with the Icon module.
 * 
 * @jest-environment jsdom
 * 
 * @module Icon/platforms/web/__tests__
 */

import { createIcon, Icon } from '../Icon.web';
import { IconProps, IconSize } from '../../../types';

describe('Icon Backward Compatibility', () => {
  describe('loadIconSVG function (internal)', () => {
    it('should be used by createIcon to generate SVG content', () => {
      const result = createIcon({ name: 'arrow-right', size: 24 });
      
      // Verify SVG content is present (from loadIconSVG)
      expect(result).toContain('<line');
      expect(result).toContain('<polyline');
    });

    it('should fallback to circle for invalid icon names', () => {
      const result = createIcon({ name: 'invalid-name' as any, size: 24 });
      
      // Should contain circle SVG content (fallback)
      expect(result).toContain('<circle cx="12" cy="12" r="10"></circle>');
    });
  });

  describe('createIcon function export', () => {
    it('should be exported and callable', () => {
      expect(typeof createIcon).toBe('function');
      
      const result = createIcon({ name: 'check', size: 24 });
      expect(result).toBeTruthy();
      expect(result).toContain('<svg');
    });

    it('should generate same SVG output as before (regression test)', () => {
      const props: IconProps = {
        name: 'arrow-right',
        size: 24,
        color: 'inherit'
      };
      
      const result = createIcon(props);
      
      // Verify essential attributes that ButtonCTA depends on
      expect(result).toContain('width="24"');
      expect(result).toContain('height="24"');
      expect(result).toContain('viewBox="0 0 24 24"');
      expect(result).toContain('stroke="currentColor"');
      expect(result).toContain('aria-hidden="true"');
      expect(result).toContain('class="icon icon-arrow-right"');
    });

    it('should work with all icon names used by ButtonCTA', () => {
      // Common icons that might be used in buttons
      const buttonIcons = ['arrow-right', 'arrow-left', 'check', 'x', 'plus'];
      
      buttonIcons.forEach(iconName => {
        const result = createIcon({ name: iconName as any, size: 24 });
        
        expect(result).toContain('<svg');
        expect(result).toContain(`icon-${iconName}`);
      });
    });

    it('should support different sizes used by ButtonCTA', () => {
      // ButtonCTA uses 24px for small/medium, 32px for large
      const sizes: IconSize[] = [24, 32];
      
      sizes.forEach(size => {
        const result = createIcon({ name: 'arrow-right', size });
        
        expect(result).toContain(`width="${size}"`);
        expect(result).toContain(`height="${size}"`);
      });
    });

    it('should support color inheritance for ButtonCTA', () => {
      const result = createIcon({ 
        name: 'arrow-right', 
        size: 24, 
        color: 'inherit' 
      });
      
      // ButtonCTA passes color: 'inherit' to ensure icon inherits button color
      expect(result).toContain('stroke="currentColor"');
    });
  });

  describe('Icon class export', () => {
    it('should be exported and instantiable', () => {
      expect(typeof Icon).toBe('function');
      
      const icon = new Icon({ name: 'check', size: 24 });
      expect(icon).toBeInstanceOf(Icon);
    });

    it('should have render() method that works', () => {
      const icon = new Icon({ name: 'arrow-right', size: 24 });
      
      const result = icon.render();
      
      expect(result).toBeTruthy();
      expect(result).toContain('<svg');
      expect(result).toContain('arrow-right');
    });

    it('should have update() method that works', () => {
      const icon = new Icon({ name: 'arrow-right', size: 24 });
      
      icon.update({ size: 32, className: 'updated' });
      const result = icon.render();
      
      expect(result).toContain('width="32"');
      expect(result).toContain('updated');
    });

    it('should have getProps() method that works', () => {
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
  });

  describe('ButtonCTA Integration Simulation', () => {
    it('should work exactly as ButtonCTA uses it', () => {
      // Simulate how ButtonCTA uses createIcon
      const icon = 'arrow-right';
      const iconSize = 24; // small/medium button
      
      const iconHTML = icon ? createIcon({ 
        name: icon as any,
        size: iconSize,
        color: 'inherit'
      }) : '';
      
      // Verify the generated HTML works for ButtonCTA
      expect(iconHTML).toBeTruthy();
      expect(iconHTML).toContain('<svg');
      expect(iconHTML).toContain('width="24"');
      expect(iconHTML).toContain('stroke="currentColor"');
      expect(iconHTML).toContain('aria-hidden="true"');
    });

    it('should work for large button size', () => {
      // Simulate large button icon
      const icon = 'check';
      const iconSize = 32; // large button
      
      const iconHTML = createIcon({ 
        name: icon as any,
        size: iconSize,
        color: 'inherit'
      });
      
      expect(iconHTML).toContain('width="32"');
      expect(iconHTML).toContain('height="32"');
    });

    it('should handle no icon case', () => {
      // Simulate ButtonCTA with no icon
      const icon = null;
      const iconSize = 24;
      
      const iconHTML = icon ? createIcon({ 
        name: icon as any,
        size: iconSize,
        color: 'inherit'
      }) : '';
      
      expect(iconHTML).toBe('');
    });
  });

  describe('Requirements Compliance', () => {
    it('should meet Requirement 6.1: createIcon() function unchanged', () => {
      // Verify createIcon() returns HTML string as before
      const result = createIcon({ name: 'arrow-right', size: 24 });
      
      expect(typeof result).toBe('string');
      expect(result).toContain('<svg');
      expect(result).toContain('</svg>');
    });

    it('should meet Requirement 6.2: Existing code works without modifications', () => {
      // Verify all legacy API methods work
      
      // createIcon function
      const iconHTML = createIcon({ name: 'check', size: 24 });
      expect(iconHTML).toBeTruthy();
      
      // Icon class
      const icon = new Icon({ name: 'arrow-right', size: 24 });
      expect(icon.render()).toBeTruthy();
      expect(icon.getProps()).toBeTruthy();
      
      icon.update({ size: 32 });
      expect(icon.render()).toContain('width="32"');
    });

    it('should meet Requirement 6.1: ButtonCTA continues working', () => {
      // Simulate ButtonCTA usage pattern
      const buttonIcon = 'arrow-right';
      const buttonSize = 'medium' as 'small' | 'medium' | 'large';
      
      // Use explicit icon size tokens instead of fallback pattern
      // ButtonCTA should use iconSize100 (24) for small/medium, iconSize125 (32) for large
      const iconSize: IconSize = buttonSize === 'large' ? 32 : 24;
      
      const iconHTML = createIcon({ 
        name: buttonIcon as any,
        size: iconSize,
        color: 'inherit'
      });
      
      // Verify ButtonCTA can use this HTML
      expect(iconHTML).toContain('<svg');
      expect(iconHTML).toContain('aria-hidden="true"');
      expect(iconHTML).toContain('stroke="currentColor"');
    });
  });
});
