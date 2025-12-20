/**
 * @category evergreen
 * @purpose Verify Icon component renders correctly and behaves as expected
 * @jest-environment jsdom
 */
/**
 * Icon Component Core Tests
 * 
 * Tests the Icon component's core functionality across platforms:
 * - Basic rendering
 * - Size variants (token integration)
 * - Color inheritance and override
 * - Icon class API
 * - Accessibility
 * 
 * @module Icon/__tests__
 */

import { createIcon, Icon } from '../platforms/web/Icon.web';
import { IconProps, IconSize, iconSizes } from '../types';

describe('Icon Component', () => {
  describe('Core Rendering', () => {
    it('should render icon with correct name', () => {
      const result = createIcon({ name: 'arrow-right', size: 24 });
      
      expect(result).toContain('<svg');
      expect(result).toContain('icon-arrow-right');
    });

    it('should use CSS class for sizing', () => {
      const result = createIcon({ name: 'arrow-right', size: 24 });
      expect(result).toContain('icon--size-100'); // 24px = size100
    });

    it('should use currentColor for stroke', () => {
      const result = createIcon({ name: 'arrow-right', size: 24 });
      expect(result).toContain('stroke="currentColor"');
    });

    it('should be hidden from screen readers', () => {
      const result = createIcon({ name: 'arrow-right', size: 24 });
      expect(result).toContain('aria-hidden="true"');
    });
  });

  describe('Size Variants', () => {
    it('should accept all IconSize values from icon size tokens', () => {
      const sizes: IconSize[] = [13, 18, 24, 28, 32, 36, 40, 44, 48];
      
      sizes.forEach(size => {
        const result = createIcon({ name: 'check', size });
        expect(result).toContain('<svg');
        expect(result).toContain('icon-check');
      });
    });

    it('should work with iconSizes constant for type-safe token references', () => {
      // Verify all sizes from iconSizes constant work
      Object.entries(iconSizes).forEach(([key, value]) => {
        const result = createIcon({ name: 'check', size: value });
        expect(result).toContain('<svg');
        expect(result).toContain('icon-check');
      });
    });
  });

  describe('Color Override', () => {
    it('should use currentColor by default', () => {
      const result = createIcon({ name: 'arrow-right', size: 24 });
      expect(result).toContain('stroke="currentColor"');
    });

    it('should support token reference for color', () => {
      const result = createIcon({ name: 'arrow-right', size: 24, color: 'color-primary' });
      expect(result).toContain('stroke="var(--color-primary)"');
    });
  });

  describe('Icon Class API', () => {
    it('should create Icon instance and render', () => {
      const icon = new Icon({ name: 'check', size: 24 });
      const result = icon.render();
      
      expect(result).toContain('icon-check');
    });

    it('should update icon properties', () => {
      const icon = new Icon({ name: 'check', size: 24 });
      icon.update({ size: 32, className: 'updated' });
      
      const result = icon.render();
      expect(result).toContain('updated');
    });

    it('should get current icon properties', () => {
      const props: IconProps = { name: 'check', size: 24, className: 'test' };
      const icon = new Icon(props);
      const currentProps = icon.getProps();
      
      expect(currentProps.name).toBe('check');
      expect(currentProps.size).toBe(24);
      expect(currentProps.className).toBe('test');
    });
  });

  describe('Token Integration', () => {
    it('should use icon.strokeWidth token', () => {
      const result = createIcon({ name: 'arrow-right', size: 24 });
      expect(result).toContain('stroke-width="var(--icon-stroke-width)"');
    });

    it('should render icon with correct name and accessibility', () => {
      const result = createIcon({ name: 'arrow-right', size: 24 });
      
      expect(result).toContain('icon-arrow-right');
      expect(result).toContain('aria-hidden="true"');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const result = createIcon({ name: 'arrow-right', size: 24, className: 'custom' });
      
      expect(result).toContain('custom');
      expect(result).toContain('icon');
      expect(result).toContain('icon-arrow-right');
    });

    it('should include testID', () => {
      const result = createIcon({ name: 'arrow-right', size: 24, testID: 'my-icon' });
      expect(result).toContain('data-testid="my-icon"');
    });
  });
});
