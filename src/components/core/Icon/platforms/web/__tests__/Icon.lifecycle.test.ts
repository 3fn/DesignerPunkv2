/**
 * @category evergreen
 * @purpose Verify Icon component lifecycle behavior and rendering
 * @jest-environment jsdom
 */
/**
 * Icon Web Component Lifecycle Tests
 * 
 * Tests the DPIcon web component's lifecycle behavior:
 * - connectedCallback (initial render)
 * - attributeChangedCallback (reactive updates)
 * - Property getters and setters
 * 
 * @module Icon/platforms/web/__tests__
 */

import { DPIcon } from '../Icon.web';

describe('Icon Web Component Lifecycle', () => {
  beforeAll(() => {
    // Ensure custom element is registered
    if (!customElements.get('dp-icon')) {
      customElements.define('dp-icon', DPIcon);
    }
  });

  beforeEach(async () => {
    // Wait for custom element to be defined
    await customElements.whenDefined('dp-icon');
  });

  describe('Icon Rendering', () => {
    it('should render icon when added to DOM', async () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('name', 'arrow-right');
      element.setAttribute('size', '24');
      
      document.body.appendChild(element);
      
      // Wait for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg?.classList.contains('icon-arrow-right')).toBe(true);
      expect(svg?.classList.contains('icon--size-100')).toBe(true);
      
      document.body.removeChild(element);
    });

    it('should render with default values if no attributes set', async () => {
      // This test verifies that missing size attribute throws an error
      // following the "fail loudly" philosophy
      const element = document.createElement('dp-icon') as DPIcon;
      
      // Accessing size without setting it should throw
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        element.size;
      }).toThrow('Missing required "size" attribute on <dp-icon>');
    });
  });

  describe('Reactive Updates', () => {
    it('should update when size attribute changes', async () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('size', '24');
      document.body.appendChild(element);
      
      // Wait for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('icon--size-100')).toBe(true);
      
      // Change size
      element.setAttribute('size', '32');
      
      // Wait for update to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      
      svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('icon--size-200')).toBe(true);
      
      document.body.removeChild(element);
    });

    it('should update when name attribute changes', async () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('size', '24'); // Required attribute - fail loudly philosophy
      element.setAttribute('name', 'arrow-right');
      document.body.appendChild(element);
      
      // Wait for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('icon-arrow-right')).toBe(true);
      
      // Change name
      element.setAttribute('name', 'check');
      
      // Wait for update to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      
      svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('icon-check')).toBe(true);
      
      document.body.removeChild(element);
    });

    it('should update when color attribute changes', async () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('size', '24'); // Required attribute - fail loudly philosophy
      element.setAttribute('color', 'inherit');
      document.body.appendChild(element);
      
      // Wait for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('stroke')).toBe('currentColor');
      
      // Change to token
      element.setAttribute('color', 'color-primary');
      
      // Wait for update to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      
      svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('stroke')).toBe('var(--color-primary)');
      
      document.body.removeChild(element);
    });

    it('should handle multiple attribute changes', async () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('size', '24'); // Required attribute - fail loudly philosophy
      document.body.appendChild(element);
      
      // Wait for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Change multiple attributes
      element.setAttribute('name', 'check');
      element.setAttribute('size', '32');
      element.setAttribute('color', 'color-success');
      
      // Wait for updates to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('icon-check')).toBe(true);
      expect(svg?.classList.contains('icon--size-200')).toBe(true);
      expect(svg?.getAttribute('stroke')).toBe('var(--color-success)');
      
      document.body.removeChild(element);
    });
  });

  describe('Property API', () => {
    it('should get and set name property', async () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('size', '24'); // Required attribute - fail loudly philosophy
      document.body.appendChild(element);
      
      // Wait for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      
      element.name = 'arrow-right';
      expect(element.name).toBe('arrow-right');
      expect(element.getAttribute('name')).toBe('arrow-right');
      
      document.body.removeChild(element);
    });

    it('should get and set size property', async () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('size', '24'); // Required attribute - fail loudly philosophy
      document.body.appendChild(element);
      
      // Wait for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      
      element.size = 32;
      expect(element.size).toBe(32);
      expect(element.getAttribute('size')).toBe('32');
      
      document.body.removeChild(element);
    });

    it('should update rendering when properties change', async () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('size', '24'); // Required attribute - fail loudly philosophy
      document.body.appendChild(element);
      
      // Wait for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      
      element.name = 'check';
      element.size = 32;
      
      // Wait for updates to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('icon-check')).toBe(true);
      expect(svg?.classList.contains('icon--size-200')).toBe(true);
      
      document.body.removeChild(element);
    });
  });
});
