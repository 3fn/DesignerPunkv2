/**
 * Icon Component Tests
 * 
 * Focused test suite validating Icon component behavior across platforms.
 * 
 * Test Philosophy:
 * - Tests validate component behavior, not token calculations
 * - Size validation belongs in token system tests (Spec 006)
 * - Platform-specific details documented in README, not tested here
 * - Focus on what the component does, not implementation details
 * 
 * @jest-environment jsdom
 * 
 * @module Icon/__tests__
 */

import { createIcon, Icon } from '../platforms/web/Icon.web';
import { IconProps, IconSize } from '../types';

describe('Icon Component', () => {
  // ============================================================================
  // Core Rendering
  // ============================================================================
  
  describe('Core Rendering', () => {
    it('renders SVG with correct size attributes', () => {
      const result = createIcon({ name: 'arrow-right', size: 24 });
      
      expect(result).toContain('width="24"');
      expect(result).toContain('height="24"');
      expect(result).toContain('viewBox="0 0 24 24"');
    });

    it('renders all available icons', () => {
      const iconNames = [
        'arrow-right', 'arrow-left', 'arrow-up', 'arrow-down',
        'chevron-right', 'check', 'x', 'plus', 'minus',
        'circle', 'heart', 'settings', 'user', 'mail', 'calendar'
      ];
      
      iconNames.forEach(name => {
        const result = createIcon({ name: name as any, size: 24 });
        expect(result).toContain('<svg');
        expect(result).toContain(`icon-${name}`);
      });
    });

    it('handles invalid icon names with fallback', () => {
      const result = createIcon({ 
        name: 'invalid-icon' as any, 
        size: 24 
      });
      
      // Falls back to circle icon
      expect(result).toContain('<circle cx="12" cy="12" r="10"></circle>');
      expect(result).toContain('icon-invalid-icon');
    });

    it('applies custom className', () => {
      const result = createIcon({ 
        name: 'check', 
        size: 24, 
        className: 'custom-class' 
      });
      
      expect(result).toContain('custom-class');
      expect(result).toContain('icon');
      expect(result).toContain('icon-check');
    });

    it('applies custom styles', () => {
      const result = createIcon({ 
        name: 'check', 
        size: 24,
        style: { marginRight: '8px', color: 'blue' }
      });
      
      expect(result).toContain('margin-right: 8px');
      expect(result).toContain('color: blue');
    });

    it('includes testID as data-testid attribute', () => {
      const result = createIcon({ 
        name: 'check', 
        size: 24, 
        testID: 'test-icon' 
      });
      
      expect(result).toContain('data-testid="test-icon"');
    });
  });

  // ============================================================================
  // Color Inheritance and Override
  // ============================================================================
  
  describe('Color Inheritance and Override', () => {
    it('uses currentColor by default for color inheritance', () => {
      const result = createIcon({ name: 'check', size: 24 });
      
      expect(result).toContain('stroke="currentColor"');
    });

    it('uses currentColor when explicitly set to "inherit"', () => {
      const result = createIcon({ 
        name: 'check', 
        size: 24, 
        color: 'inherit' 
      });
      
      expect(result).toContain('stroke="currentColor"');
    });

    it('supports token reference for color override', () => {
      const result = createIcon({ 
        name: 'check', 
        size: 24, 
        color: 'color-text-secondary' 
      });
      
      expect(result).toContain('stroke="var(--color-text-secondary)"');
    });

    it('supports multiple token references', () => {
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
  });

  // ============================================================================
  // Accessibility
  // ============================================================================
  
  describe('Accessibility', () => {
    it('hides icons from screen readers with aria-hidden', () => {
      const result = createIcon({ name: 'check', size: 24 });
      
      expect(result).toContain('aria-hidden="true"');
    });

    it('works in button context without interfering with label', () => {
      const iconHTML = createIcon({ name: 'check', size: 24 });
      const buttonHTML = `
        <button>
          ${iconHTML}
          <span>Submit</span>
        </button>
      `;
      
      // Icon is hidden, button text is visible
      expect(buttonHTML).toContain('aria-hidden="true"');
      expect(buttonHTML).toContain('<span>Submit</span>');
    });
  });

  // ============================================================================
  // Icon Class API
  // ============================================================================
  
  describe('Icon Class API', () => {
    it('creates Icon instance and renders', () => {
      const icon = new Icon({ name: 'check', size: 24 });
      const result = icon.render();
      
      expect(result).toContain('width="24"');
      expect(result).toContain('icon-check');
    });

    it('updates icon properties', () => {
      const icon = new Icon({ name: 'check', size: 24 });
      
      icon.update({ size: 32, className: 'updated' });
      const result = icon.render();
      
      expect(result).toContain('width="32"');
      expect(result).toContain('updated');
    });

    it('gets current properties', () => {
      const icon = new Icon({ 
        name: 'check', 
        size: 24, 
        className: 'test' 
      });
      
      const props = icon.getProps();
      
      expect(props.name).toBe('check');
      expect(props.size).toBe(24);
      expect(props.className).toBe('test');
    });

    it('updates color via update method', () => {
      const icon = new Icon({ name: 'check', size: 24 });
      
      // Default: currentColor
      let result = icon.render();
      expect(result).toContain('stroke="currentColor"');
      
      // Update to token
      icon.update({ color: 'color-primary' });
      result = icon.render();
      expect(result).toContain('stroke="var(--color-primary)"');
      
      // Update back to inherit
      icon.update({ color: 'inherit' });
      result = icon.render();
      expect(result).toContain('stroke="currentColor"');
    });
  });

  // ============================================================================
  // Size Variants (Spec 006: Icon Size Tokens)
  // ============================================================================
  
  describe('Size Variants', () => {
    it('accepts all IconSize values from icon size tokens', () => {
      const allSizes: IconSize[] = [13, 18, 24, 28, 32, 36, 40, 44, 48];
      
      allSizes.forEach(size => {
        const result = createIcon({ name: 'check', size });
        
        expect(result).toContain(`width="${size}"`);
        expect(result).toContain(`height="${size}"`);
        expect(result).toContain(`viewBox="0 0 24 24"`);
      });
    });

    it('renders core sizes correctly (90% use cases)', () => {
      const coreSizes: IconSize[] = [18, 24, 32, 36, 40];
      
      coreSizes.forEach(size => {
        const result = createIcon({ name: 'arrow-right', size });
        
        expect(result).toContain(`width="${size}"`);
        expect(result).toContain(`height="${size}"`);
        expect(result).toContain('icon-arrow-right');
      });
    });

    it('renders available sizes correctly (10% use cases)', () => {
      const availableSizes: IconSize[] = [13, 28, 44, 48];
      
      availableSizes.forEach(size => {
        const result = createIcon({ name: 'heart', size });
        
        expect(result).toContain(`width="${size}"`);
        expect(result).toContain(`height="${size}"`);
        expect(result).toContain('icon-heart');
      });
    });

    it('maintains type safety with IconSize type', () => {
      // TypeScript compile-time validation
      const validSize: IconSize = 24;
      const result = createIcon({ name: 'check', size: validSize });
      
      expect(result).toContain('width="24"');
      
      // These would cause TypeScript errors (compile-time validation):
      // const invalidSize: IconSize = 25; // Error: Type '25' is not assignable to type 'IconSize'
      // const invalidSize: IconSize = 16; // Error: Type '16' is not assignable to type 'IconSize'
    });

    it('works with iconSizes constant for type-safe token references', () => {
      const { iconSizes } = require('../types');
      
      // Test a few key sizes from iconSizes constant
      const testCases = [
        { token: 'size050', value: 13 },
        { token: 'size075', value: 18 },
        { token: 'size100', value: 24 },
        { token: 'size400', value: 36 },
        { token: 'size700', value: 48 }
      ];
      
      testCases.forEach(({ token, value }) => {
        const size = iconSizes[token];
        expect(size).toBe(value);
        
        const result = createIcon({ name: 'check', size });
        expect(result).toContain(`width="${value}"`);
        expect(result).toContain(`height="${value}"`);
      });
    });

    it('maintains backward compatibility with existing size usage', () => {
      // Existing tests use size 24 and 32 - verify these still work
      const existingSizes: IconSize[] = [24, 32];
      
      existingSizes.forEach(size => {
        const result = createIcon({ name: 'check', size });
        
        expect(result).toContain(`width="${size}"`);
        expect(result).toContain(`height="${size}"`);
        expect(result).toContain('<svg');
      });
    });
  });

  // ============================================================================
  // SVG Attributes
  // ============================================================================
  
  describe('SVG Attributes', () => {
    it('includes correct SVG attributes for rendering', () => {
      const result = createIcon({ name: 'check', size: 24 });
      
      expect(result).toContain('viewBox="0 0 24 24"');
      expect(result).toContain('fill="none"');
      expect(result).toContain('stroke-width="2"');
      expect(result).toContain('stroke-linecap="round"');
      expect(result).toContain('stroke-linejoin="round"');
    });
  });

  // ============================================================================
  // Platform Documentation
  // ============================================================================
  
  describe('Platform Documentation', () => {
    it('documents iOS implementation approach', () => {
      // iOS uses SwiftUI Image with Asset Catalog
      // Template rendering mode: .renderingMode(.template)
      // Color inheritance: .foregroundColor(.primary)
      // Accessibility: .accessibilityHidden(true)
      // See: src/components/core/Icon/platforms/ios/Icon.ios.swift
      expect(true).toBe(true);
    });

    it('documents Android implementation approach', () => {
      // Android uses Jetpack Compose Icon with VectorDrawable
      // Color inheritance: tint = LocalContentColor.current
      // Accessibility: contentDescription = null
      // See: src/components/core/Icon/platforms/android/Icon.android.kt
      expect(true).toBe(true);
    });
  });
});
