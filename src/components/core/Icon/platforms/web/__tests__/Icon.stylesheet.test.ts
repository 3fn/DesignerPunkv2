/**
 * Icon Component Stylesheet Integration Tests
 * 
 * Tests the Icon web component's stylesheet integration with Shadow DOM:
 * - Stylesheet loads correctly in Shadow DOM
 * - Styles apply to SVG element
 * - CSS custom properties pierce Shadow DOM boundary
 * - Token-based color overrides work correctly
 * 
 * @jest-environment jsdom
 * 
 * @module Icon/platforms/web/__tests__
 */

import { DPIcon } from '../Icon.web';
import { IconSize } from '../../../types';

describe('Icon Stylesheet Integration', () => {
  beforeAll(() => {
    // Register the custom element if not already registered
    if (!customElements.get('dp-icon')) {
      customElements.define('dp-icon', DPIcon);
    }
  });

  describe('Shadow DOM Stylesheet Loading', () => {
    it('should include stylesheet link in shadow DOM', () => {
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      icon.size = 24;
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      expect(shadowRoot).toBeTruthy();

      // Check that stylesheet link exists in shadow DOM
      const styleLink = shadowRoot?.querySelector('link[rel="stylesheet"]');
      expect(styleLink).toBeTruthy();
      expect(styleLink?.getAttribute('href')).toBe('./Icon.web.css');

      document.body.removeChild(icon);
    });

    it('should have SVG element in shadow DOM', () => {
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'check';
      icon.size = 24;
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute('width')).toBe('24');
      expect(svg?.getAttribute('height')).toBe('24');

      document.body.removeChild(icon);
    });

    it('should apply icon class to SVG element', () => {
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      icon.size = 24;
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      expect(svg?.classList.contains('icon')).toBe(true);
      expect(svg?.classList.contains('icon-arrow-right')).toBe(true);

      document.body.removeChild(icon);
    });
  });

  describe('Color Inheritance Through Shadow DOM', () => {
    it('should use currentColor for default color inheritance', () => {
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      icon.size = 24;
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      expect(svg?.getAttribute('stroke')).toBe('currentColor');

      document.body.removeChild(icon);
    });

    it('should use currentColor when color attribute is "inherit"', () => {
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      icon.size = 24;
      icon.color = 'inherit';
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      expect(svg?.getAttribute('stroke')).toBe('currentColor');

      document.body.removeChild(icon);
    });

    it('should use CSS custom property for token reference', () => {
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'check';
      icon.size = 24;
      icon.color = 'color-primary';
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      expect(svg?.getAttribute('stroke')).toBe('var(--color-primary)');

      document.body.removeChild(icon);
    });

    it('should update stroke color when color attribute changes', () => {
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      icon.size = 24;
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      let svg = shadowRoot?.querySelector('svg');
      
      // Initially uses currentColor
      expect(svg?.getAttribute('stroke')).toBe('currentColor');

      // Change to token reference
      icon.color = 'color-error';
      svg = shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('stroke')).toBe('var(--color-error)');

      // Change back to inherit
      icon.color = 'inherit';
      svg = shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('stroke')).toBe('currentColor');

      document.body.removeChild(icon);
    });
  });

  describe('Size Attribute Control', () => {
    it('should set width and height attributes on SVG', () => {
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      icon.size = 32;
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      expect(svg?.getAttribute('width')).toBe('32');
      expect(svg?.getAttribute('height')).toBe('32');

      document.body.removeChild(icon);
    });

    it('should update size when size attribute changes', () => {
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      icon.size = 24;
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      let svg = shadowRoot?.querySelector('svg');
      
      expect(svg?.getAttribute('width')).toBe('24');
      expect(svg?.getAttribute('height')).toBe('24');

      // Change size
      icon.size = 40;
      svg = shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('40');
      expect(svg?.getAttribute('height')).toBe('40');

      document.body.removeChild(icon);
    });

    it('should support all icon size token values', () => {
      const sizes: IconSize[] = [13, 18, 24, 28, 32, 36, 40, 44, 48];
      
      sizes.forEach(size => {
        const icon = document.createElement('dp-icon') as DPIcon;
        icon.name = 'check';
        icon.size = size;
        document.body.appendChild(icon);

        const shadowRoot = icon.shadowRoot;
        const svg = shadowRoot?.querySelector('svg');
        
        expect(svg?.getAttribute('width')).toBe(size.toString());
        expect(svg?.getAttribute('height')).toBe(size.toString());

        document.body.removeChild(icon);
      });
    });
  });

  describe('Accessibility Attributes', () => {
    it('should set aria-hidden="true" on SVG element', () => {
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      icon.size = 24;
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      expect(svg?.getAttribute('aria-hidden')).toBe('true');

      document.body.removeChild(icon);
    });

    it('should support test-id attribute', () => {
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      icon.size = 24;
      icon.testID = 'my-test-icon';
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      expect(svg?.getAttribute('data-testid')).toBe('my-test-icon');

      document.body.removeChild(icon);
    });
  });

  describe('Requirements Compliance', () => {
    it('should meet Requirement 3.2: Shadow DOM encapsulation', () => {
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      icon.size = 24;
      document.body.appendChild(icon);

      // Verify shadow DOM exists
      expect(icon.shadowRoot).toBeTruthy();
      expect(icon.shadowRoot?.mode).toBe('open');

      // Verify stylesheet is in shadow DOM
      const styleLink = icon.shadowRoot?.querySelector('link[rel="stylesheet"]');
      expect(styleLink).toBeTruthy();

      document.body.removeChild(icon);
    });

    it('should meet Requirement 4.2: Token-based styling via CSS custom properties', () => {
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'check';
      icon.size = 24;
      icon.color = 'color-success';
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      // Verify CSS custom property is used for color token
      expect(svg?.getAttribute('stroke')).toBe('var(--color-success)');

      document.body.removeChild(icon);
    });
  });
});
