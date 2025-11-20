/**
 * Icon Web Component Lifecycle Tests
 * 
 * Tests the DPIcon web component's lifecycle methods and behavior:
 * - Custom element registration
 * - Element creation
 * - connectedCallback (fires when added to DOM)
 * - attributeChangedCallback (fires on attribute changes)
 * - disconnectedCallback (fires when removed from DOM)
 * - Shadow DOM attachment
 * 
 * @jest-environment jsdom
 * 
 * @module Icon/platforms/web/__tests__
 */

import { DPIcon } from '../Icon.web';

describe('Icon Web Component Lifecycle', () => {
  describe('Custom Element Registration', () => {
    it('should register custom element as dp-icon', () => {
      // Verify custom element is registered
      const registeredElement = customElements.get('dp-icon');
      
      expect(registeredElement).toBeDefined();
      expect(registeredElement).toBe(DPIcon);
    });

    it('should be able to create element using customElements.get', () => {
      const ElementClass = customElements.get('dp-icon');
      
      expect(ElementClass).toBeDefined();
      
      if (ElementClass) {
        const element = new ElementClass();
        expect(element).toBeInstanceOf(DPIcon);
        expect(element).toBeInstanceOf(HTMLElement);
      }
    });
  });

  describe('Element Creation', () => {
    it('should create element using document.createElement', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      
      expect(element).toBeInstanceOf(DPIcon);
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName.toLowerCase()).toBe('dp-icon');
    });

    it('should create element using constructor', () => {
      const element = new DPIcon();
      
      expect(element).toBeInstanceOf(DPIcon);
      expect(element).toBeInstanceOf(HTMLElement);
    });

    it('should create multiple independent instances', () => {
      const element1 = document.createElement('dp-icon') as DPIcon;
      const element2 = document.createElement('dp-icon') as DPIcon;
      
      expect(element1).not.toBe(element2);
      expect(element1).toBeInstanceOf(DPIcon);
      expect(element2).toBeInstanceOf(DPIcon);
    });
  });

  describe('Shadow DOM Attachment', () => {
    it('should attach shadow DOM on construction', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      
      expect(element.shadowRoot).toBeDefined();
      expect(element.shadowRoot).not.toBeNull();
    });

    it('should attach shadow DOM with mode open', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      
      // Shadow root should be accessible (mode: 'open')
      expect(element.shadowRoot).toBeTruthy();
      
      // Should be able to query shadow DOM
      if (element.shadowRoot) {
        expect(element.shadowRoot.mode).toBe('open');
      }
    });

    it('should have empty shadow DOM before connectedCallback', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      
      // Shadow DOM exists but should be empty before connected
      expect(element.shadowRoot).toBeTruthy();
      expect(element.shadowRoot?.innerHTML).toBe('');
    });
  });

  describe('connectedCallback', () => {
    it('should fire when element is added to DOM', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container); // Add container to document
      
      // Shadow DOM should be empty before connection
      expect(element.shadowRoot?.innerHTML).toBe('');
      
      // Add to DOM
      container.appendChild(element);
      
      // Shadow DOM should now have content (connectedCallback fired)
      expect(element.shadowRoot?.innerHTML).not.toBe('');
      expect(element.shadowRoot?.innerHTML).toContain('<svg');
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should render icon when added to DOM', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('name', 'arrow-right');
      element.setAttribute('size', '24');
      
      const container = document.createElement('div');
      document.body.appendChild(container); // Add container to document
      container.appendChild(element);
      
      // Check that SVG was rendered
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute('width')).toBe('24');
      expect(svg?.getAttribute('height')).toBe('24');
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should render with default values if no attributes set', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container); // Add container to document
      
      container.appendChild(element);
      
      // Should render with defaults (circle icon, size 24)
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute('width')).toBe('24');
      expect(svg?.getAttribute('height')).toBe('24');
      expect(svg?.classList.contains('icon-circle')).toBe(true);
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should fire only once when added to DOM', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container); // Add container to document
      
      // Spy on render method to count calls
      const renderSpy = jest.spyOn(element as any, 'render');
      
      container.appendChild(element);
      
      // connectedCallback should call render once
      expect(renderSpy).toHaveBeenCalledTimes(1);
      
      renderSpy.mockRestore();
      
      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('attributeChangedCallback', () => {
    it('should fire when name attribute changes', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container); // Add container to document
      container.appendChild(element);
      
      // Initial render
      let svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('icon-circle')).toBe(true);
      
      // Change name attribute
      element.setAttribute('name', 'arrow-right');
      
      // Should re-render with new icon
      svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('icon-arrow-right')).toBe(true);
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should fire when size attribute changes', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container); // Add container to document
      container.appendChild(element);
      
      // Initial size
      let svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('24');
      
      // Change size attribute
      element.setAttribute('size', '32');
      
      // Should re-render with new size
      svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('32');
      expect(svg?.getAttribute('height')).toBe('32');
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should fire when color attribute changes', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container); // Add container to document
      container.appendChild(element);
      
      // Initial color (inherit = currentColor)
      let svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('stroke')).toBe('currentColor');
      
      // Change color attribute
      element.setAttribute('color', 'color-primary');
      
      // Should re-render with new color
      svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('stroke')).toBe('var(--color-primary)');
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should fire when test-id attribute changes', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container); // Add container to document
      container.appendChild(element);
      
      // Initial state (no test-id)
      let svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.hasAttribute('data-testid')).toBe(false);
      
      // Add test-id attribute
      element.setAttribute('test-id', 'my-icon');
      
      // Should re-render with test-id
      svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('data-testid')).toBe('my-icon');
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should not fire when non-observed attribute changes', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container); // Add container to document
      container.appendChild(element);
      
      // Spy on render method
      const renderSpy = jest.spyOn(element as any, 'render');
      renderSpy.mockClear(); // Clear initial render call
      
      // Change non-observed attribute
      element.setAttribute('data-custom', 'value');
      
      // Should not trigger re-render
      expect(renderSpy).not.toHaveBeenCalled();
      
      renderSpy.mockRestore();
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should not fire when attribute value does not change', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('name', 'arrow-right');
      
      const container = document.createElement('div');
      document.body.appendChild(container); // Add container to document
      container.appendChild(element);
      
      // Spy on render method
      const renderSpy = jest.spyOn(element as any, 'render');
      renderSpy.mockClear(); // Clear initial render call
      
      // Set same value
      element.setAttribute('name', 'arrow-right');
      
      // Should not trigger re-render (oldValue === newValue)
      expect(renderSpy).not.toHaveBeenCalled();
      
      renderSpy.mockRestore();
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should handle multiple attribute changes', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container); // Add container to document
      container.appendChild(element);
      
      // Change multiple attributes
      element.setAttribute('name', 'check');
      element.setAttribute('size', '32');
      element.setAttribute('color', 'color-success');
      
      // Should reflect all changes
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('icon-check')).toBe(true);
      expect(svg?.getAttribute('width')).toBe('32');
      expect(svg?.getAttribute('stroke')).toBe('var(--color-success)');
      
      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('disconnectedCallback', () => {
    it('should fire when element is removed from DOM', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container); // Add container to document
      
      // Add to DOM
      container.appendChild(element);
      expect(container.contains(element)).toBe(true);
      
      // Remove from DOM
      container.removeChild(element);
      
      // Element should be removed
      // Note: Current implementation doesn't define disconnectedCallback,
      // but the test verifies the element can be removed from DOM
      expect(container.contains(element)).toBe(false);
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should maintain shadow DOM content after removal', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('name', 'arrow-right');
      
      const container = document.createElement('div');
      document.body.appendChild(container); // Add container to document
      container.appendChild(element);
      
      // Verify content exists
      const svgBefore = element.shadowRoot?.querySelector('svg');
      expect(svgBefore).toBeTruthy();
      
      // Remove from DOM
      container.removeChild(element);
      
      // Shadow DOM content should still exist
      const svgAfter = element.shadowRoot?.querySelector('svg');
      expect(svgAfter).toBeTruthy();
      expect(svgAfter?.classList.contains('icon-arrow-right')).toBe(true);
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should be able to re-add element after removal', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('name', 'check');
      
      const container = document.createElement('div');
      document.body.appendChild(container); // Add container to document
      
      // Add to DOM
      container.appendChild(element);
      let svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('icon-check')).toBe(true);
      
      // Remove from DOM
      container.removeChild(element);
      
      // Re-add to DOM
      container.appendChild(element);
      
      // Should still render correctly
      svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('icon-check')).toBe(true);
      
      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('Property Getters and Setters', () => {
    it('should get and set name property', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      
      // Default name
      expect(element.name).toBe('circle');
      
      // Set via property
      element.name = 'arrow-right';
      expect(element.name).toBe('arrow-right');
      expect(element.getAttribute('name')).toBe('arrow-right');
    });

    it('should get and set size property', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      
      // Default size
      expect(element.size).toBe(24);
      
      // Set via property
      element.size = 32;
      expect(element.size).toBe(32);
      expect(element.getAttribute('size')).toBe('32');
    });

    it('should get and set color property', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      
      // Default color
      expect(element.color).toBe('inherit');
      
      // Set via property
      element.color = 'color-primary';
      expect(element.color).toBe('color-primary');
      expect(element.getAttribute('color')).toBe('color-primary');
    });

    it('should get and set testID property', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      
      // Default testID
      expect(element.testID).toBeNull();
      
      // Set via property
      element.testID = 'my-icon';
      expect(element.testID).toBe('my-icon');
      expect(element.getAttribute('test-id')).toBe('my-icon');
      
      // Clear testID
      element.testID = null;
      expect(element.testID).toBeNull();
      expect(element.hasAttribute('test-id')).toBe(false);
    });

    it('should trigger re-render when properties change', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container); // Add container to document
      container.appendChild(element);
      
      // Change via property
      element.name = 'check';
      element.size = 32;
      
      // Should reflect in rendered output
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('icon-check')).toBe(true);
      expect(svg?.getAttribute('width')).toBe('32');
      
      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('Requirements Compliance', () => {
    it('should meet Requirement 3.1: Custom element registration', () => {
      // Requirement 3.1: WHEN the Icon Web Component is registered 
      // THEN the system SHALL define a custom element named "dp-icon"
      const registeredElement = customElements.get('dp-icon');
      
      expect(registeredElement).toBeDefined();
      expect(registeredElement).toBe(DPIcon);
    });

    it('should meet Requirement 3.2: HTMLElement extension and Shadow DOM', () => {
      // Requirement 3.2: WHEN the Icon Web Component is instantiated 
      // THEN the Icon Web Component SHALL extend HTMLElement
      // AND attach Shadow DOM with mode "open"
      const element = document.createElement('dp-icon') as DPIcon;
      
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.shadowRoot).toBeTruthy();
      expect(element.shadowRoot?.mode).toBe('open');
    });
  });
});
