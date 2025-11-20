/**
 * Icon Web Component - Accessibility Tests
 * 
 * Tests accessibility features of the Icon web component:
 * - aria-hidden attribute for screen reader exclusion
 * - Screen reader behavior verification
 * - Button label interference testing
 * - test-id attribute for automated testing
 * 
 * Requirements: 5.1, 5.2
 * 
 * @jest-environment jsdom
 */

import { DPIcon } from '../Icon.web';

describe('Icon Accessibility', () => {
  beforeEach(() => {
    // Clean up any existing custom elements
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = '';
  });

  describe('aria-hidden Attribute', () => {
    it('should set aria-hidden="true" on SVG element', () => {
      // Requirement 5.1: Icon should be hidden from screen readers
      const icon = new DPIcon();
      icon.setAttribute('name', 'arrow-right');
      icon.setAttribute('size', '24');
      
      // Create container and append to document
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
      
      document.body.removeChild(container);
    });

    it('should have aria-hidden="true" for all icon names', () => {
      // Requirement 5.1: All icons should be hidden from screen readers
      const iconNames = [
        'arrow-right', 'arrow-left', 'arrow-up', 'arrow-down',
        'chevron-right', 'check', 'x', 'plus', 'minus',
        'circle', 'heart', 'settings', 'user', 'mail', 'calendar'
      ];

      iconNames.forEach(iconName => {
        const icon = document.createElement('dp-icon') as DPIcon;
        icon.name = iconName as any;
        document.body.appendChild(icon);

        const shadowRoot = icon.shadowRoot;
        const svg = shadowRoot?.querySelector('svg');
        
        expect(svg?.getAttribute('aria-hidden')).toBe('true');
        
        document.body.removeChild(icon);
      });
    });

    it('should maintain aria-hidden="true" after attribute changes', () => {
      // Requirement 5.1: aria-hidden should persist through updates
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      document.body.appendChild(icon);

      // Change attributes
      icon.name = 'check';
      icon.size = 32;
      icon.color = 'color-primary';

      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
      
      document.body.removeChild(icon);
    });
  });

  describe('Screen Reader Behavior', () => {
    it('should not be announced by screen readers', () => {
      // Requirement 5.1: Icon should not be announced by screen readers
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      // Verify aria-hidden="true" which prevents screen reader announcement
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
      
      // Verify no accessible name or description
      expect(svg?.getAttribute('aria-label')).toBeNull();
      expect(svg?.getAttribute('aria-labelledby')).toBeNull();
      expect(svg?.getAttribute('aria-describedby')).toBeNull();
      expect(svg?.getAttribute('role')).toBeNull();
      
      document.body.removeChild(icon);
    });

    it('should not have focusable elements', () => {
      // Requirement 5.1: Icon should not be focusable
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      // SVG should not have tabindex
      expect(svg?.getAttribute('tabindex')).toBeNull();
      
      // Icon element itself should not be focusable
      expect(icon.getAttribute('tabindex')).toBeNull();
      
      document.body.removeChild(icon);
    });
  });

  describe('Button Label Interference', () => {
    it('should not interfere with button labels', () => {
      // Requirement 5.1: Icon should not interfere with button accessible names
      const button = document.createElement('button');
      button.setAttribute('aria-label', 'Submit form');
      
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      
      button.appendChild(icon);
      document.body.appendChild(button);

      // Button's accessible name should be preserved
      expect(button.getAttribute('aria-label')).toBe('Submit form');
      
      // Icon should be hidden from screen readers
      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
      
      document.body.removeChild(button);
    });

    it('should work correctly in buttons with text content', () => {
      // Requirement 5.1: Icon should not interfere with button text labels
      const button = document.createElement('button');
      
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      
      const text = document.createTextNode('Next');
      
      button.appendChild(icon);
      button.appendChild(text);
      document.body.appendChild(button);

      // Button text should be accessible
      expect(button.textContent).toContain('Next');
      
      // Icon should be hidden from screen readers
      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
      
      document.body.removeChild(button);
    });

    it('should not add to button accessible name calculation', () => {
      // Requirement 5.1: Icon should not contribute to accessible name
      const button = document.createElement('button');
      
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'check';
      
      const text = document.createTextNode('Confirm');
      
      button.appendChild(icon);
      button.appendChild(text);
      document.body.appendChild(button);

      // Icon should be hidden (aria-hidden="true")
      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
      
      // Button's accessible name should only be the text content
      // (aria-hidden elements are excluded from accessible name calculation)
      expect(button.textContent).toBe('Confirm');
      
      document.body.removeChild(button);
    });
  });

  describe('test-id Attribute', () => {
    it('should add data-testid attribute when testID prop provided', () => {
      // Requirement 5.2: test-id attribute should work for automated testing
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      icon.testID = 'my-icon';
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      expect(svg?.getAttribute('data-testid')).toBe('my-icon');
      
      document.body.removeChild(icon);
    });

    it('should not add data-testid when testID not provided', () => {
      // Requirement 5.2: data-testid should only be added when explicitly set
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      expect(svg?.getAttribute('data-testid')).toBeNull();
      
      document.body.removeChild(icon);
    });

    it('should update data-testid when testID changes', () => {
      // Requirement 5.2: data-testid should update reactively
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      icon.testID = 'icon-1';
      document.body.appendChild(icon);

      let shadowRoot = icon.shadowRoot;
      let svg = shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('data-testid')).toBe('icon-1');

      // Update testID
      icon.testID = 'icon-2';
      
      shadowRoot = icon.shadowRoot;
      svg = shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('data-testid')).toBe('icon-2');
      
      document.body.removeChild(icon);
    });

    it('should remove data-testid when testID set to null', () => {
      // Requirement 5.2: data-testid should be removable
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      icon.testID = 'my-icon';
      document.body.appendChild(icon);

      let shadowRoot = icon.shadowRoot;
      let svg = shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('data-testid')).toBe('my-icon');

      // Remove testID
      icon.testID = null;
      
      shadowRoot = icon.shadowRoot;
      svg = shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('data-testid')).toBeNull();
      
      document.body.removeChild(icon);
    });

    it('should work with automated testing tools', () => {
      // Requirement 5.2: test-id should enable automated testing
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      icon.testID = 'submit-icon';
      document.body.appendChild(icon);

      // Simulate automated testing tool query
      const shadowRoot = icon.shadowRoot;
      const testElement = shadowRoot?.querySelector('[data-testid="submit-icon"]');
      
      expect(testElement).toBeTruthy();
      expect(testElement?.tagName.toLowerCase()).toBe('svg');
      
      document.body.removeChild(icon);
    });
  });

  describe('Accessibility Requirements Validation', () => {
    it('should meet Requirement 5.1: Icons hidden from screen readers', () => {
      // Requirement 5.1: WHEN the Icon Web Component renders THEN 
      // the Icon Web Component SHALL set aria-hidden="true" on SVG
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
      
      document.body.removeChild(icon);
    });

    it('should meet Requirement 5.2: test-id attribute for automated testing', () => {
      // Requirement 5.2: WHEN the "test-id" attribute changes THEN 
      // the Icon Web Component SHALL update the data-testid attribute
      const icon = document.createElement('dp-icon') as DPIcon;
      icon.name = 'arrow-right';
      icon.testID = 'test-icon';
      document.body.appendChild(icon);

      const shadowRoot = icon.shadowRoot;
      const svg = shadowRoot?.querySelector('svg');
      
      expect(svg?.getAttribute('data-testid')).toBe('test-icon');
      
      document.body.removeChild(icon);
    });
  });
});
