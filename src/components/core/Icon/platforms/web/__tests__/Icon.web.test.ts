/**
 * Icon Component Tests for Web Platform
 * 
 * Tests the Icon component's core functionality including:
 * - CSS class-based sizing (token integration)
 * - Color inheritance and override
 * - Accessibility
 * - Invalid name handling
 * - Custom className application
 * 
 * @jest-environment jsdom
 * 
 * @module Icon/platforms/web/__tests__
 */

import { createIcon, Icon } from '../Icon.web';
import { IconProps, IconSize } from '../../../types';

describe('Icon Component (Web)', () => {
  describe('Core Rendering', () => {
    it('should render icon with correct size class', () => {
      const result = createIcon({ name: 'arrow-right', size: 24 });
      
      expect(result).toContain('<svg');
      expect(result).toContain('icon--size-100'); // 24px = size100
      expect(result).toContain('icon-arrow-right');
    });

    it('should render all size variants with correct classes', () => {
      const sizeToClass: Record<IconSize, string> = {
        13: 'icon--size-050',
        18: 'icon--size-075',
        24: 'icon--size-100',
        28: 'icon--size-125',
        32: 'icon--size-200',
        36: 'icon--size-400',
        40: 'icon--size-500',
        44: 'icon--size-600',
        48: 'icon--size-700'
      };
      
      Object.entries(sizeToClass).forEach(([size, className]) => {
        const result = createIcon({ name: 'check', size: Number(size) as IconSize });
        expect(result).toContain(className);
      });
    });

    it('should use currentColor for stroke (color inheritance)', () => {
      const result = createIcon({ name: 'arrow-right', size: 24 });
      expect(result).toContain('stroke="currentColor"');
    });

    it('should be hidden from screen readers', () => {
      const result = createIcon({ name: 'arrow-right', size: 24 });
      expect(result).toContain('aria-hidden="true"');
    });

    it('should handle invalid icon names with fallback', () => {
      const result = createIcon({ name: 'invalid-icon-name' as any, size: 24 });
      
      // Should fallback to circle
      expect(result).toContain('<circle cx="12" cy="12" r="10"></circle>');
      // Should still have the invalid name in the class
      expect(result).toContain('icon-invalid-icon-name');
    });
  });

  describe('Color Override', () => {
    it('should use currentColor by default', () => {
      const result = createIcon({ name: 'arrow-right', size: 24 });
      expect(result).toContain('stroke="currentColor"');
    });

    it('should use currentColor when color is "inherit"', () => {
      const result = createIcon({ name: 'arrow-right', size: 24, color: 'inherit' });
      expect(result).toContain('stroke="currentColor"');
    });

    it('should use CSS custom property for token reference', () => {
      const result = createIcon({ name: 'arrow-right', size: 24, color: 'color-primary' });
      expect(result).toContain('stroke="var(--color-primary)"');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const result = createIcon({ name: 'arrow-right', size: 24, className: 'custom-class' });
      
      expect(result).toContain('custom-class');
      expect(result).toContain('icon'); // Default class
      expect(result).toContain('icon-arrow-right'); // Name class
    });

    it('should include testID as data-testid attribute', () => {
      const result = createIcon({ name: 'arrow-right', size: 24, testID: 'my-icon' });
      expect(result).toContain('data-testid="my-icon"');
    });
  });

  describe('Icon Class API', () => {
    it('should create Icon instance and render', () => {
      const icon = new Icon({ name: 'arrow-right', size: 24 });
      const result = icon.render();
      
      expect(result).toContain('icon-arrow-right');
      expect(result).toContain('icon--size-100');
    });

    it('should update icon properties', () => {
      const icon = new Icon({ name: 'arrow-right', size: 24 });
      icon.update({ size: 32, className: 'updated' });
      
      const result = icon.render();
      expect(result).toContain('icon--size-200'); // 32px = size200
      expect(result).toContain('updated');
    });

    it('should get current icon properties', () => {
      const icon = new Icon({ name: 'check', size: 24, className: 'test' });
      const props = icon.getProps();
      
      expect(props.name).toBe('check');
      expect(props.size).toBe(24);
      expect(props.className).toBe('test');
    });
  });

  describe('Token Integration', () => {
    it('should use icon.strokeWidth token', () => {
      const result = createIcon({ name: 'arrow-right', size: 24 });
      expect(result).toContain('stroke-width="var(--icon-stroke-width)"');
    });

    it('should have correct SVG structure', () => {
      const result = createIcon({ name: 'arrow-right', size: 24 });
      
      expect(result).toContain('viewBox="0 0 24 24"');
      expect(result).toContain('fill="none"');
      expect(result).toContain('stroke-linecap="round"');
      expect(result).toContain('stroke-linejoin="round"');
    });
  });
});
