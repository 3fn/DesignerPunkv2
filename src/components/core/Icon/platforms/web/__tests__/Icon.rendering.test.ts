/**
 * @category evergreen
 * @purpose Verify Icon.rendering component renders correctly and behaves as expected
 * @jest-environment jsdom
 */
/**
 * Icon Web Component Rendering Tests
 * 
 * Tests the DPIcon web component's rendering behavior:
 * - Shadow DOM structure
 * - CSS class application for sizing
 * - Icon name rendering
 * - Size variant coverage
 * 
 * @module Icon/platforms/web/__tests__
 */

import { DPIcon } from '../Icon.web';
import { IconName, IconSize, iconSizes } from '../../../types';

describe('Icon Web Component Rendering', () => {
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

  describe('Shadow DOM Structure', () => {
    it('should render SVG in shadow DOM', async () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('size', '24'); // Required attribute - fail loudly philosophy
      document.body.appendChild(element);
      
      // Wait for connectedCallback to fire
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
      
      document.body.removeChild(element);
    });

    it('should apply correct size class', async () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('size', '24');
      document.body.appendChild(element);
      
      // Wait for connectedCallback to fire
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('icon--size-100')).toBe(true);
      
      document.body.removeChild(element);
    });

    it('should use currentColor for stroke', async () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('size', '24'); // Required attribute - fail loudly philosophy
      document.body.appendChild(element);
      
      // Wait for connectedCallback to fire
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('stroke')).toBe('currentColor');
      
      document.body.removeChild(element);
    });
    
    it('should throw error when size attribute is missing', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      
      // Accessing the size getter without setting the attribute should throw
      // This tests the "fail loudly" philosophy - missing required attributes throw errors
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        element.size;
      }).toThrow('Missing required "size" attribute on <dp-icon>');
    });
    
    it('should throw error when size attribute is invalid', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('size', '99'); // Invalid size
      
      // Accessing the size getter with an invalid value should throw
      // This tests the "fail loudly" philosophy - invalid values throw errors
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        element.size;
      }).toThrow('Invalid icon size: 99');
    });
  });

  describe('Icon Name Rendering', () => {
    const sampleIcons: IconName[] = [
      'arrow-right', 'check', 'x', 'circle', 'heart'
    ];

    sampleIcons.forEach((iconName) => {
      it(`should render ${iconName} icon`, async () => {
        const element = document.createElement('dp-icon') as DPIcon;
        // Set size first to avoid error during attribute change callback
        element.setAttribute('size', '24'); // Required attribute - fail loudly philosophy
        element.setAttribute('name', iconName);
        document.body.appendChild(element);
        
        // Wait for connectedCallback to fire
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const svg = element.shadowRoot?.querySelector('svg');
        expect(svg?.classList.contains(`icon-${iconName}`)).toBe(true);
        
        document.body.removeChild(element);
      });
    });
  });

  describe('Size Variant Coverage', () => {
    it('should render all icon size token scale levels', async () => {
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

      for (const [size, className] of Object.entries(sizeToClass)) {
        const element = document.createElement('dp-icon') as DPIcon;
        element.setAttribute('size', size);
        document.body.appendChild(element);
        
        // Wait for connectedCallback to fire
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const svg = element.shadowRoot?.querySelector('svg');
        expect(svg?.classList.contains(className)).toBe(true);
        
        document.body.removeChild(element);
      }
    });

    it('should use iconSizes constant values', async () => {
      // Verify all sizes from iconSizes constant work
      for (const size of Object.values(iconSizes)) {
        const element = document.createElement('dp-icon') as DPIcon;
        element.setAttribute('size', size.toString());
        document.body.appendChild(element);
        
        // Wait for connectedCallback to fire
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const svg = element.shadowRoot?.querySelector('svg');
        expect(svg).toBeTruthy();
        
        document.body.removeChild(element);
      }
    });
  });

  describe('Attribute Changes', () => {
    it('should update when size attribute changes', async () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('size', '24');
      document.body.appendChild(element);
      
      // Wait for connectedCallback to fire
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('icon--size-100')).toBe(true);
      
      // Change size
      element.setAttribute('size', '32');
      
      // Wait for attributeChangedCallback to fire
      await new Promise(resolve => setTimeout(resolve, 0));
      
      svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('icon--size-200')).toBe(true);
      
      document.body.removeChild(element);
    });

    it('should update when name attribute changes', async () => {
      const element = document.createElement('dp-icon') as DPIcon;
      // Set size first to avoid error during attribute change callback
      element.setAttribute('size', '24'); // Required attribute - fail loudly philosophy
      element.setAttribute('name', 'arrow-right');
      document.body.appendChild(element);
      
      // Wait for connectedCallback to fire
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('icon-arrow-right')).toBe(true);
      
      // Change name
      element.setAttribute('name', 'check');
      
      // Wait for attributeChangedCallback to fire
      await new Promise(resolve => setTimeout(resolve, 0));
      
      svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.classList.contains('icon-check')).toBe(true);
      
      document.body.removeChild(element);
    });
  });
});
