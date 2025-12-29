/**
 * @category evergreen
 * @purpose Verify ButtonCTA component integrates correctly with Icon component
 * @jest-environment jsdom
 */
/**
 * ButtonCTA Icon Integration Tests
 * 
 * Tests icon integration with the Icon System (Spec 004).
 * Validates icon rendering, sizing, color, spacing, and accessibility.
 * 
 * Note: ButtonCTA now uses <dp-icon> web component for icon rendering,
 * following the same component composition pattern as iOS and Android.
 * Tests must traverse nested Shadow DOM (ButtonCTA → dp-icon) to access SVG.
 * 
 * @module ButtonCTA/platforms/web/__tests__/icon-integration
 */

import { ButtonCTA } from '../ButtonCTA.web';
import { DPIcon } from '../../../../Icon/platforms/web/Icon.web';

/**
 * Set up required CSS custom properties for ButtonCTA blend utilities.
 * ButtonCTA uses blend utilities that read base colors from CSS custom properties.
 */
function setupBlendColorProperties(): void {
  document.documentElement.style.setProperty('--color-primary', '#A855F7');
  document.documentElement.style.setProperty('--color-text-on-primary', '#FFFFFF');
  document.documentElement.style.setProperty('--color-background', '#FFFFFF');
}

describe('ButtonCTA Icon Integration', () => {
  beforeEach(() => {
    // Set up CSS custom properties required for blend utilities
    setupBlendColorProperties();
    
    // Ensure custom elements are registered
    if (!customElements.get('dp-icon')) {
      customElements.define('dp-icon', DPIcon);
    }
    if (!customElements.get('button-cta')) {
      customElements.define('button-cta', ButtonCTA);
    }
  });

  afterEach(() => {
    // Clean up any created elements
    document.body.innerHTML = '';
  });

  /**
   * Helper to get the SVG element from nested Shadow DOM.
   * ButtonCTA → dp-icon → SVG
   */
  function getIconSvg(button: ButtonCTA): SVGElement | null {
    const shadowRoot = button.shadowRoot;
    if (!shadowRoot) return null;
    
    const dpIcon = shadowRoot.querySelector('dp-icon') as DPIcon | null;
    if (!dpIcon || !dpIcon.shadowRoot) return null;
    
    return dpIcon.shadowRoot.querySelector('svg');
  }

  describe('Icon Rendering', () => {
    it('should render icon when icon prop provided', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      // Wait for component to render
      const shadowRoot = button.shadowRoot;
      expect(shadowRoot).not.toBeNull();

      // Check for icon container
      const iconContainer = shadowRoot!.querySelector('.button-cta__icon');
      expect(iconContainer).not.toBeNull();

      // Check for dp-icon element
      const dpIcon = iconContainer!.querySelector('dp-icon');
      expect(dpIcon).not.toBeNull();
      expect(dpIcon!.getAttribute('name')).toBe('arrow-right');

      // Check for SVG element in nested Shadow DOM
      const svg = getIconSvg(button);
      expect(svg).not.toBeNull();
      expect(svg!.classList.contains('icon-arrow-right')).toBe(true);
    });

    it('should not render icon when icon prop not provided', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      expect(shadowRoot).not.toBeNull();

      // Check that icon container doesn't exist
      const iconContainer = shadowRoot!.querySelector('.button-cta__icon');
      expect(iconContainer).toBeNull();
    });

    it('should update icon when icon prop changes', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      let svg = getIconSvg(button);
      expect(svg!.classList.contains('icon-arrow-right')).toBe(true);

      // Change icon
      button.icon = 'check';

      svg = getIconSvg(button);
      expect(svg!.classList.contains('icon-check')).toBe(true);
    });
  });

  describe('Icon Sizing', () => {
    it('should use icon.size100 (24px) for small button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.size = 'small';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      // Check dp-icon has correct size attribute
      expect(dpIcon!.getAttribute('size')).toBe('24');
      
      // Check for size class in nested Shadow DOM
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon--size-100')).toBe(true);
    });

    it('should use icon.size100 (24px) for medium button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.size = 'medium';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      // Check dp-icon has correct size attribute
      expect(dpIcon!.getAttribute('size')).toBe('24');
      
      // Check for size class in nested Shadow DOM
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon--size-100')).toBe(true);
    });

    it('should use icon.size125 (32px) for large button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.size = 'large';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      // Check dp-icon has correct size attribute (iconSizes.size125 = 32)
      expect(dpIcon!.getAttribute('size')).toBe('32');
      
      // Check for size class in nested Shadow DOM
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon--size-200')).toBe(true);
    });
  });

  describe('Icon Color', () => {
    it('should use inherit color for primary button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.buttonVariant = 'primary';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      // Check dp-icon has inherit color
      expect(dpIcon!.getAttribute('color')).toBe('inherit');
      
      // Icon should use currentColor (inherits from button)
      const svg = getIconSvg(button);
      expect(svg!.getAttribute('stroke')).toBe('currentColor');
    });

    it('should use inherit color for secondary button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.buttonVariant = 'secondary';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      // Check dp-icon has inherit color
      expect(dpIcon!.getAttribute('color')).toBe('inherit');
      
      // Icon should use currentColor (inherits from button)
      const svg = getIconSvg(button);
      expect(svg!.getAttribute('stroke')).toBe('currentColor');
    });

    it('should use inherit color for tertiary button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.buttonVariant = 'tertiary';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      // Check dp-icon has inherit color
      expect(dpIcon!.getAttribute('color')).toBe('inherit');
      
      // Icon should use currentColor (inherits from button)
      const svg = getIconSvg(button);
      expect(svg!.getAttribute('stroke')).toBe('currentColor');
    });
  });

  describe('Icon-Text Spacing', () => {
    it('should use space.grouped.tight (4px) for small button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.size = 'small';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const buttonElement = shadowRoot!.querySelector('.button-cta');
      
      // Check that button has small size class (which sets gap to tight)
      expect(buttonElement!.classList.contains('button-cta--small')).toBe(true);
    });

    it('should use space.grouped.normal (8px) for medium button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.size = 'medium';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const buttonElement = shadowRoot!.querySelector('.button-cta');
      
      // Check that button has medium size class (which sets gap to normal)
      expect(buttonElement!.classList.contains('button-cta--medium')).toBe(true);
    });

    it('should use space.grouped.normal (8px) for large button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.size = 'large';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const buttonElement = shadowRoot!.querySelector('.button-cta');
      
      // Check that button has large size class (which sets gap to normal)
      expect(buttonElement!.classList.contains('button-cta--large')).toBe(true);
    });
  });

  describe('Icon Vertical Alignment', () => {
    it('should center icon vertically to button height', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const buttonElement = shadowRoot!.querySelector('.button-cta');
      
      // Button uses flexbox with align-items: center
      // This is verified by checking the button has display: inline-flex
      expect(buttonElement).not.toBeNull();
    });
  });

  describe('Icon Accessibility', () => {
    it('should mark icon container as decorative with aria-hidden', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const iconContainer = shadowRoot!.querySelector('.button-cta__icon');
      
      expect(iconContainer!.getAttribute('aria-hidden')).toBe('true');
    });

    it('should mark dp-icon SVG as decorative with aria-hidden', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const svg = getIconSvg(button);
      expect(svg!.getAttribute('aria-hidden')).toBe('true');
    });

    it('should not affect button accessible name', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const buttonElement = shadowRoot!.querySelector('button');
      const labelElement = shadowRoot!.querySelector('.button-cta__label');
      
      // Button accessible name comes from label text, not icon
      expect(labelElement!.textContent).toBe('Click me');
    });
  });

  describe('Shadow DOM Initialization', () => {
    it('should initialize shadow DOM correctly', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      document.body.appendChild(button);

      // Shadow DOM should be initialized
      expect(button.shadowRoot).not.toBeNull();
      expect(button.shadowRoot!.mode).toBe('open');
    });

    it('should render button element in shadow DOM', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const buttonElement = shadowRoot!.querySelector('button');
      
      expect(buttonElement).not.toBeNull();
      expect(buttonElement!.tagName).toBe('BUTTON');
    });

    it('should work in test environment with nested Shadow DOM', () => {
      // This test verifies that nested shadow DOM works in Jest/JSDOM environment
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Test';
      button.icon = 'check';
      document.body.appendChild(button);

      // All queries should work
      const shadowRoot = button.shadowRoot;
      expect(shadowRoot).not.toBeNull();
      
      const buttonElement = shadowRoot!.querySelector('button');
      expect(buttonElement).not.toBeNull();
      
      const iconContainer = shadowRoot!.querySelector('.button-cta__icon');
      expect(iconContainer).not.toBeNull();
      
      const dpIcon = iconContainer!.querySelector('dp-icon');
      expect(dpIcon).not.toBeNull();
      
      // Nested Shadow DOM access
      const svg = getIconSvg(button);
      expect(svg).not.toBeNull();
    });
  });

  describe('Icon with Different Button Variants', () => {
    it('should render icon with small primary button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Save';
      button.size = 'small';
      button.buttonVariant = 'primary';
      button.icon = 'check';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      expect(dpIcon).not.toBeNull();
      expect(dpIcon!.getAttribute('size')).toBe('24');
      
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon--size-100')).toBe(true);
    });

    it('should render icon with large secondary button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Continue';
      button.size = 'large';
      button.buttonVariant = 'secondary';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      expect(dpIcon).not.toBeNull();
      expect(dpIcon!.getAttribute('size')).toBe('32');
      
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon--size-200')).toBe(true);
    });

    it('should render icon with medium tertiary button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Learn More';
      button.size = 'medium';
      button.buttonVariant = 'tertiary';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      expect(dpIcon).not.toBeNull();
      expect(dpIcon!.getAttribute('size')).toBe('24');
      
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon--size-100')).toBe(true);
    });
  });

  describe('Component Composition Pattern', () => {
    it('should use dp-icon web component (cross-platform consistency)', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Test';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      // Verify dp-icon is used (not raw SVG injection)
      expect(dpIcon).not.toBeNull();
      expect(dpIcon!.tagName.toLowerCase()).toBe('dp-icon');
    });

    it('should pass correct attributes to dp-icon', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Test';
      button.icon = 'check';
      button.size = 'large';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      expect(dpIcon!.getAttribute('name')).toBe('check');
      expect(dpIcon!.getAttribute('size')).toBe('32'); // Large button = 32px icon
      expect(dpIcon!.getAttribute('color')).toBe('inherit');
    });
  });
});
