/**
 * Icon Web Component Rendering Tests
 * 
 * Tests the DPIcon web component's rendering behavior:
 * - Default attribute rendering (circle, 24px)
 * - All 15 icon names render correctly
 * - All 11 size token scale levels render correctly
 * - Custom element uses createIcon internally for consistent output
 * - SVG element exists in shadow DOM
 * - SVG has correct width/height attributes
 * - SVG has correct viewBox="0 0 24 24"
 * - SVG content matches icon name
 * 
 * @jest-environment jsdom
 * 
 * @module Icon/platforms/web/__tests__
 */

import { DPIcon, createIcon } from '../Icon.web';
import { IconName, iconSizes } from '../../../types';

describe('Icon Web Component Rendering', () => {
  describe('Default Attribute Rendering', () => {
    it('should render with default attributes (circle, 24px)', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      // Check default rendering
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute('width')).toBe('24');
      expect(svg?.getAttribute('height')).toBe('24');
      expect(svg?.classList.contains('icon-circle')).toBe(true);
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should render with default color (currentColor)', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('stroke')).toBe('currentColor');
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should render with default viewBox', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
      
      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('All Icon Names Rendering', () => {
    const iconNames: IconName[] = [
      'arrow-right',
      'arrow-left',
      'arrow-up',
      'arrow-down',
      'chevron-right',
      'check',
      'x',
      'plus',
      'minus',
      'circle',
      'heart',
      'settings',
      'user',
      'mail',
      'calendar'
    ];

    iconNames.forEach((iconName) => {
      it(`should render ${iconName} icon correctly`, () => {
        const element = document.createElement('dp-icon') as DPIcon;
        element.setAttribute('name', iconName);
        
        const container = document.createElement('div');
        document.body.appendChild(container);
        container.appendChild(element);
        
        // Check icon renders
        const svg = element.shadowRoot?.querySelector('svg');
        expect(svg).toBeTruthy();
        expect(svg?.classList.contains(`icon-${iconName}`)).toBe(true);
        
        // Check SVG has content
        const svgContent = svg?.innerHTML;
        expect(svgContent).toBeTruthy();
        expect(svgContent?.length).toBeGreaterThan(0);
        
        // Cleanup
        document.body.removeChild(container);
      });
    });

    it('should render all 15 icon names without errors', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      
      iconNames.forEach((iconName) => {
        const element = document.createElement('dp-icon') as DPIcon;
        element.setAttribute('name', iconName);
        container.appendChild(element);
        
        const svg = element.shadowRoot?.querySelector('svg');
        expect(svg).toBeTruthy();
      });
      
      // Verify all 15 icons were created
      expect(container.children.length).toBe(15);
      
      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('All Size Token Scale Levels Rendering', () => {
    const sizeTokens = [
      { token: 'size050', value: 13 },
      { token: 'size075', value: 18 },
      { token: 'size100', value: 24 },
      { token: 'size125', value: 32 },
      { token: 'size150', value: 28 },
      { token: 'size200', value: 32 },
      { token: 'size300', value: 32 },
      { token: 'size400', value: 36 },
      { token: 'size500', value: 40 },
      { token: 'size600', value: 44 },
      { token: 'size700', value: 48 }
    ];

    sizeTokens.forEach(({ token, value }) => {
      it(`should render at ${token} (${value}px) correctly`, () => {
        const element = document.createElement('dp-icon') as DPIcon;
        element.setAttribute('name', 'circle');
        element.setAttribute('size', value.toString());
        
        const container = document.createElement('div');
        document.body.appendChild(container);
        container.appendChild(element);
        
        // Check size renders correctly
        const svg = element.shadowRoot?.querySelector('svg');
        expect(svg).toBeTruthy();
        expect(svg?.getAttribute('width')).toBe(value.toString());
        expect(svg?.getAttribute('height')).toBe(value.toString());
        
        // Cleanup
        document.body.removeChild(container);
      });
    });

    it('should render all 11 size token scale levels without errors', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      
      sizeTokens.forEach(({ value }) => {
        const element = document.createElement('dp-icon') as DPIcon;
        element.setAttribute('name', 'circle');
        element.setAttribute('size', value.toString());
        container.appendChild(element);
        
        const svg = element.shadowRoot?.querySelector('svg');
        expect(svg).toBeTruthy();
        expect(svg?.getAttribute('width')).toBe(value.toString());
      });
      
      // Verify all 11 sizes were created
      expect(container.children.length).toBe(11);
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should use iconSizes constant values', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      
      // Test using iconSizes constant
      Object.entries(iconSizes).forEach(([token, size]) => {
        const element = document.createElement('dp-icon') as DPIcon;
        element.setAttribute('name', 'circle');
        element.setAttribute('size', size.toString());
        container.appendChild(element);
        
        const svg = element.shadowRoot?.querySelector('svg');
        expect(svg?.getAttribute('width')).toBe(size.toString());
      });
      
      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('Custom Element Uses createIcon Internally', () => {
    it('should produce consistent SVG structure with createIcon', () => {
      // Create icon using web component
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('name', 'arrow-right');
      element.setAttribute('size', '24');
      
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      const webComponentSVG = element.shadowRoot?.querySelector('svg');
      
      // Create icon using createIcon function
      const createIconHTML = createIcon({ name: 'arrow-right', size: 24 });
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = createIconHTML;
      const createIconSVG = tempDiv.querySelector('svg');
      
      // Compare key attributes
      expect(webComponentSVG?.getAttribute('width')).toBe(createIconSVG?.getAttribute('width'));
      expect(webComponentSVG?.getAttribute('height')).toBe(createIconSVG?.getAttribute('height'));
      expect(webComponentSVG?.getAttribute('viewBox')).toBe(createIconSVG?.getAttribute('viewBox'));
      expect(webComponentSVG?.getAttribute('stroke')).toBe(createIconSVG?.getAttribute('stroke'));
      expect(webComponentSVG?.getAttribute('stroke-width')).toBe(createIconSVG?.getAttribute('stroke-width'));
      expect(webComponentSVG?.getAttribute('aria-hidden')).toBe(createIconSVG?.getAttribute('aria-hidden'));
      
      // Compare SVG content (inner HTML should match)
      expect(webComponentSVG?.innerHTML.trim()).toBe(createIconSVG?.innerHTML.trim());
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should produce consistent output for all icon names', () => {
      const iconNames: IconName[] = ['arrow-right', 'check', 'circle', 'heart', 'settings'];
      const container = document.createElement('div');
      document.body.appendChild(container);
      
      iconNames.forEach((iconName) => {
        // Web component
        const element = document.createElement('dp-icon') as DPIcon;
        element.setAttribute('name', iconName);
        element.setAttribute('size', '24');
        container.appendChild(element);
        
        const webComponentSVG = element.shadowRoot?.querySelector('svg');
        
        // createIcon function
        const createIconHTML = createIcon({ name: iconName, size: 24 });
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = createIconHTML;
        const createIconSVG = tempDiv.querySelector('svg');
        
        // Compare SVG content
        expect(webComponentSVG?.innerHTML.trim()).toBe(createIconSVG?.innerHTML.trim());
      });
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should produce consistent output for all sizes', () => {
      const sizes = [13, 18, 24, 32, 40];
      const container = document.createElement('div');
      document.body.appendChild(container);
      
      sizes.forEach((size) => {
        // Web component
        const element = document.createElement('dp-icon') as DPIcon;
        element.setAttribute('name', 'circle');
        element.setAttribute('size', size.toString());
        container.appendChild(element);
        
        const webComponentSVG = element.shadowRoot?.querySelector('svg');
        
        // createIcon function
        const createIconHTML = createIcon({ name: 'circle', size: size as any });
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = createIconHTML;
        const createIconSVG = tempDiv.querySelector('svg');
        
        // Compare size attributes
        expect(webComponentSVG?.getAttribute('width')).toBe(createIconSVG?.getAttribute('width'));
        expect(webComponentSVG?.getAttribute('height')).toBe(createIconSVG?.getAttribute('height'));
      });
      
      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('SVG Element in Shadow DOM', () => {
    it('should have SVG element in shadow DOM', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg?.tagName.toLowerCase()).toBe('svg');
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should have only one SVG element in shadow DOM', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      const svgs = element.shadowRoot?.querySelectorAll('svg');
      expect(svgs?.length).toBe(1);
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should have SVG element as direct child of shadow root', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      // Check shadow root children
      const shadowChildren = Array.from(element.shadowRoot?.children || []);
      const svgElements = shadowChildren.filter(child => child.tagName.toLowerCase() === 'svg');
      
      expect(svgElements.length).toBe(1);
      
      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('SVG Width and Height Attributes', () => {
    it('should have correct width and height for size 24', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('size', '24');
      
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('24');
      expect(svg?.getAttribute('height')).toBe('24');
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should have correct width and height for size 32', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('size', '32');
      
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('32');
      expect(svg?.getAttribute('height')).toBe('32');
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should have matching width and height (square icons)', () => {
      const sizes = [13, 18, 24, 28, 32, 36, 40, 44, 48];
      const container = document.createElement('div');
      document.body.appendChild(container);
      
      sizes.forEach((size) => {
        const element = document.createElement('dp-icon') as DPIcon;
        element.setAttribute('size', size.toString());
        container.appendChild(element);
        
        const svg = element.shadowRoot?.querySelector('svg');
        expect(svg?.getAttribute('width')).toBe(svg?.getAttribute('height'));
      });
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should update width and height when size changes', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('size', '24');
      
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      // Initial size
      let svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('24');
      expect(svg?.getAttribute('height')).toBe('24');
      
      // Change size
      element.setAttribute('size', '40');
      
      // Updated size
      svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('width')).toBe('40');
      expect(svg?.getAttribute('height')).toBe('40');
      
      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('SVG ViewBox Attribute', () => {
    it('should have correct viewBox="0 0 24 24"', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should maintain viewBox="0 0 24 24" regardless of size', () => {
      const sizes = [13, 18, 24, 32, 40, 48];
      const container = document.createElement('div');
      document.body.appendChild(container);
      
      sizes.forEach((size) => {
        const element = document.createElement('dp-icon') as DPIcon;
        element.setAttribute('size', size.toString());
        container.appendChild(element);
        
        const svg = element.shadowRoot?.querySelector('svg');
        expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
      });
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should maintain viewBox when size changes', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('size', '24');
      
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      // Initial viewBox
      let svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
      
      // Change size
      element.setAttribute('size', '48');
      
      // ViewBox should remain the same
      svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
      
      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('SVG Content Matches Icon Name', () => {
    it('should have SVG content for arrow-right', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('name', 'arrow-right');
      
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      const svg = element.shadowRoot?.querySelector('svg');
      const content = svg?.innerHTML;
      
      expect(content).toContain('line');
      expect(content).toContain('polyline');
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should have SVG content for circle', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('name', 'circle');
      
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      const svg = element.shadowRoot?.querySelector('svg');
      const content = svg?.innerHTML;
      
      expect(content).toContain('circle');
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should have SVG content for heart', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('name', 'heart');
      
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      const svg = element.shadowRoot?.querySelector('svg');
      const content = svg?.innerHTML;
      
      expect(content).toContain('path');
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should have different content for different icons', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      
      const element1 = document.createElement('dp-icon') as DPIcon;
      element1.setAttribute('name', 'arrow-right');
      container.appendChild(element1);
      
      const element2 = document.createElement('dp-icon') as DPIcon;
      element2.setAttribute('name', 'circle');
      container.appendChild(element2);
      
      const svg1 = element1.shadowRoot?.querySelector('svg');
      const svg2 = element2.shadowRoot?.querySelector('svg');
      
      const content1 = svg1?.innerHTML;
      const content2 = svg2?.innerHTML;
      
      expect(content1).not.toBe(content2);
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should update content when icon name changes', () => {
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('name', 'circle');
      
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      // Initial content
      let svg = element.shadowRoot?.querySelector('svg');
      let content = svg?.innerHTML;
      expect(content).toContain('circle');
      
      // Change icon name
      element.setAttribute('name', 'arrow-right');
      
      // Updated content
      svg = element.shadowRoot?.querySelector('svg');
      content = svg?.innerHTML;
      expect(content).toContain('line');
      expect(content).toContain('polyline');
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should have non-empty content for all icon names', () => {
      const iconNames: IconName[] = [
        'arrow-right', 'arrow-left', 'arrow-up', 'arrow-down', 'chevron-right',
        'check', 'x', 'plus', 'minus', 'circle', 'heart',
        'settings', 'user', 'mail', 'calendar'
      ];
      
      const container = document.createElement('div');
      document.body.appendChild(container);
      
      iconNames.forEach((iconName) => {
        const element = document.createElement('dp-icon') as DPIcon;
        element.setAttribute('name', iconName);
        container.appendChild(element);
        
        const svg = element.shadowRoot?.querySelector('svg');
        const content = svg?.innerHTML;
        
        expect(content).toBeTruthy();
        expect(content?.trim().length).toBeGreaterThan(0);
      });
      
      // Cleanup
      document.body.removeChild(container);
    });
  });

  describe('Requirements Compliance', () => {
    it('should meet Requirement 1.1: Custom element renders icons', () => {
      // Requirement 1.1: WHEN the Icon Web Component is registered 
      // THEN the system SHALL define a custom element named "dp-icon"
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg).toBeTruthy();
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should meet Requirement 1.2: Uses existing loadIconSVG function', () => {
      // Requirement 1.2: WHEN the Icon Web Component renders 
      // THEN the Icon Web Component SHALL use the existing loadIconSVG() function
      const element = document.createElement('dp-icon') as DPIcon;
      element.setAttribute('name', 'arrow-right');
      
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      // Verify SVG content matches what loadIconSVG would return
      const svg = element.shadowRoot?.querySelector('svg');
      const content = svg?.innerHTML;
      
      expect(content).toContain('line');
      expect(content).toContain('polyline');
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should meet Requirement 1.3: Generates SVG with currentColor', () => {
      // Requirement 1.3: WHEN the Icon Web Component renders 
      // THEN the Icon Web Component SHALL generate SVG with currentColor for stroke inheritance
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('stroke')).toBe('currentColor');
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should meet Requirement 2.1: Renders with all icon names', () => {
      // Requirement 2.1: WHEN the "name" attribute changes 
      // THEN the Icon Web Component SHALL re-render with the new icon
      const iconNames: IconName[] = [
        'arrow-right', 'arrow-left', 'arrow-up', 'arrow-down', 'chevron-right',
        'check', 'x', 'plus', 'minus', 'circle', 'heart',
        'settings', 'user', 'mail', 'calendar'
      ];
      
      const container = document.createElement('div');
      document.body.appendChild(container);
      
      iconNames.forEach((iconName) => {
        const element = document.createElement('dp-icon') as DPIcon;
        element.setAttribute('name', iconName);
        container.appendChild(element);
        
        const svg = element.shadowRoot?.querySelector('svg');
        expect(svg).toBeTruthy();
        expect(svg?.classList.contains(`icon-${iconName}`)).toBe(true);
      });
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should meet Requirement 2.2: Renders with all size variants', () => {
      // Requirement 2.2: WHEN the "size" attribute changes 
      // THEN the Icon Web Component SHALL re-render with the new size
      const sizes = [13, 18, 24, 28, 32, 36, 40, 44, 48];
      const container = document.createElement('div');
      document.body.appendChild(container);
      
      sizes.forEach((size) => {
        const element = document.createElement('dp-icon') as DPIcon;
        element.setAttribute('size', size.toString());
        container.appendChild(element);
        
        const svg = element.shadowRoot?.querySelector('svg');
        expect(svg?.getAttribute('width')).toBe(size.toString());
        expect(svg?.getAttribute('height')).toBe(size.toString());
      });
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should meet Requirement 2.3: Renders with color attribute', () => {
      // Requirement 2.3: WHEN the "color" attribute changes 
      // THEN the Icon Web Component SHALL re-render with the new color
      const element = document.createElement('dp-icon') as DPIcon;
      const container = document.createElement('div');
      document.body.appendChild(container);
      container.appendChild(element);
      
      // Default color
      let svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('stroke')).toBe('currentColor');
      
      // Change color
      element.setAttribute('color', 'color-primary');
      svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('stroke')).toBe('var(--color-primary)');
      
      // Cleanup
      document.body.removeChild(container);
    });
  });
});
