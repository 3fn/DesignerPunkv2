/**
 * @category evergreen
 * @purpose Verify Icon-Base component renders correctly and behaves as expected
 * @jest-environment jsdom
 */
/**
 * Icon-Base Component Core Tests
 * 
 * Stemma System: Icons Family
 * Component Type: Primitive (Base)
 * 
 * Tests the Icon-Base component's core functionality across platforms:
 * - Basic rendering
 * - Size variants (token integration)
 * - Color inheritance and override
 * - IconBase class API
 * - Accessibility
 * 
 * @module Icon-Base/__tests__
 */

import { createIconBase, IconBase } from '../platforms/web/IconBase.web';
import { IconBaseProps, IconBaseSize, iconBaseSizes } from '../types';

describe('Icon-Base Component', () => {
  describe('Core Rendering', () => {
    it('should render icon with correct name', () => {
      const result = createIconBase({ name: 'arrow-right', size: 24 });
      
      expect(result).toContain('<svg');
      expect(result).toContain('icon-base-arrow-right');
    });

    it('should use CSS class for sizing', () => {
      const result = createIconBase({ name: 'arrow-right', size: 24 });
      expect(result).toContain('icon-base--size-100'); // 24px = size100
    });

    it('should use currentColor for stroke', () => {
      const result = createIconBase({ name: 'arrow-right', size: 24 });
      expect(result).toContain('stroke="currentColor"');
    });

    it('should be hidden from screen readers', () => {
      const result = createIconBase({ name: 'arrow-right', size: 24 });
      expect(result).toContain('aria-hidden="true"');
    });
  });

  describe('Size Variants', () => {
    it('should accept all IconBaseSize values from icon size tokens', () => {
      const sizes: IconBaseSize[] = [13, 20, 24, 28, 32, 36, 40, 44, 48];
      
      sizes.forEach(size => {
        const result = createIconBase({ name: 'check', size });
        expect(result).toContain('<svg');
        expect(result).toContain('icon-base-check');
      });
    });

    it('should work with iconBaseSizes constant for type-safe token references', () => {
      // Verify all sizes from iconBaseSizes constant work
      Object.entries(iconBaseSizes).forEach(([key, value]) => {
        const result = createIconBase({ name: 'check', size: value });
        expect(result).toContain('<svg');
        expect(result).toContain('icon-base-check');
      });
    });
  });

  describe('Color Override', () => {
    it('should use currentColor by default', () => {
      const result = createIconBase({ name: 'arrow-right', size: 24 });
      expect(result).toContain('stroke="currentColor"');
    });

    it('should support token reference for color', () => {
      const result = createIconBase({ name: 'arrow-right', size: 24, color: 'color-primary' });
      expect(result).toContain('stroke="var(--color-primary)"');
    });
  });

  describe('IconBase Class API', () => {
    it('should create IconBase instance and render', () => {
      const icon = new IconBase({ name: 'check', size: 24 });
      const result = icon.render();
      
      expect(result).toContain('icon-base-check');
    });

    it('should update icon properties', () => {
      const icon = new IconBase({ name: 'check', size: 24 });
      icon.update({ size: 32, className: 'updated' });
      
      const result = icon.render();
      expect(result).toContain('updated');
    });

    it('should get current icon properties', () => {
      const props: IconBaseProps = { name: 'check', size: 24, className: 'test' };
      const icon = new IconBase(props);
      const currentProps = icon.getProps();
      
      expect(currentProps.name).toBe('check');
      expect(currentProps.size).toBe(24);
      expect(currentProps.className).toBe('test');
    });
  });

  describe('Token Integration', () => {
    it('should use icon.strokeWidth token', () => {
      const result = createIconBase({ name: 'arrow-right', size: 24 });
      expect(result).toContain('stroke-width="var(--icon-stroke-width)"');
    });

    it('should render icon with correct name and accessibility', () => {
      const result = createIconBase({ name: 'arrow-right', size: 24 });
      
      expect(result).toContain('icon-base-arrow-right');
      expect(result).toContain('aria-hidden="true"');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const result = createIconBase({ name: 'arrow-right', size: 24, className: 'custom' });
      
      expect(result).toContain('custom');
      expect(result).toContain('icon-base');
      expect(result).toContain('icon-base-arrow-right');
    });

    it('should include testID', () => {
      const result = createIconBase({ name: 'arrow-right', size: 24, testID: 'my-icon' });
      expect(result).toContain('data-testid="my-icon"');
    });
  });

  describe('Optical Balance', () => {
    it('should not apply optical balance by default', () => {
      const result = createIconBase({ name: 'arrow-right', size: 24, color: '#A855F7' });
      // Without optical balance, the color should be used directly
      expect(result).toContain('stroke="#A855F7"');
    });

    it('should apply lighterBlend when opticalBalance is true with hex color', () => {
      const result = createIconBase({ name: 'arrow-right', size: 24, color: '#A855F7', opticalBalance: true });
      // With optical balance, the color should be lightened (8% lighter)
      // The exact value depends on the blend calculation, but it should NOT be the original color
      expect(result).not.toContain('stroke="#A855F7"');
      // Should contain a hex color (lightened version)
      expect(result).toMatch(/stroke="#[0-9A-Fa-f]{6}"/);
    });

    it('should not apply optical balance when color is inherit', () => {
      const result = createIconBase({ name: 'arrow-right', size: 24, color: 'inherit', opticalBalance: true });
      // With inherit, should use currentColor regardless of opticalBalance
      expect(result).toContain('stroke="currentColor"');
    });

    it('should not apply optical balance when color is a token reference', () => {
      const result = createIconBase({ name: 'arrow-right', size: 24, color: 'color-primary', opticalBalance: true });
      // Token references should become CSS custom properties, not lightened
      expect(result).toContain('stroke="var(--color-primary)"');
    });

    it('should apply optical balance to different hex colors', () => {
      // Test with white
      const whiteResult = createIconBase({ name: 'check', size: 24, color: '#FFFFFF', opticalBalance: true });
      expect(whiteResult).toMatch(/stroke="#[0-9A-Fa-f]{6}"/);
      
      // Test with black
      const blackResult = createIconBase({ name: 'check', size: 24, color: '#000000', opticalBalance: true });
      expect(blackResult).toMatch(/stroke="#[0-9A-Fa-f]{6}"/);
      // Black lightened should not be pure black
      expect(blackResult).not.toContain('stroke="#000000"');
      
      // Test with a mid-tone color
      const midResult = createIconBase({ name: 'check', size: 24, color: '#808080', opticalBalance: true });
      expect(midResult).toMatch(/stroke="#[0-9A-Fa-f]{6}"/);
      expect(midResult).not.toContain('stroke="#808080"');
    });

    it('should use default opticalBalance of false when not specified', () => {
      const withoutProp = createIconBase({ name: 'arrow-right', size: 24, color: '#FF0000' });
      const withFalse = createIconBase({ name: 'arrow-right', size: 24, color: '#FF0000', opticalBalance: false });
      // Both should produce the same result (original color)
      expect(withoutProp).toContain('stroke="#FF0000"');
      expect(withFalse).toContain('stroke="#FF0000"');
    });
  });
});
