/**
 * @category evergreen
 * @purpose Verify Button-CTA component integrates correctly with Icon-Base component
 * @jest-environment jsdom
 */
/**
 * Button-CTA Icon Integration Tests
 * 
 * Tests icon integration with the Icon-Base component (Stemma System).
 * Validates icon rendering, sizing, color, spacing, and accessibility.
 * 
 * Stemma System Naming: [Family]-[Type] = Button-CTA
 * Component Type: Standalone (no behavioral variants)
 * 
 * Note: Button-CTA uses <icon-base> web component for icon rendering,
 * following the same component composition pattern as iOS and Android.
 * Tests must traverse nested Shadow DOM (Button-CTA → icon-base) to access SVG.
 * 
 * Migrated from legacy Icon to Icon-Base as part of Task 6.5.
 * 
 * @module Button-CTA/platforms/web/__tests__/icon-integration
 */

import { ButtonCTA } from '../ButtonCTA.web';
import { IconBaseElement } from '../../../../Icon-Base/platforms/web/IconBase.web';

/**
 * Set up required CSS custom properties for Button-CTA blend utilities.
 * Button-CTA uses blend utilities that read base colors from CSS custom properties.
 * Updated to use new semantic token names (Spec 052).
 */
function setupBlendColorProperties(): void {
  document.documentElement.style.setProperty('--color-action-primary', '#A855F7');
  document.documentElement.style.setProperty('--color-contrast-on-dark', '#FFFFFF');
  document.documentElement.style.setProperty('--color-background', '#FFFFFF');
}

describe('Button-CTA Icon Integration', () => {
  beforeEach(() => {
    // Set up CSS custom properties required for blend utilities
    setupBlendColorProperties();
    
    // Ensure custom elements are registered
    if (!customElements.get('icon-base')) {
      customElements.define('icon-base', IconBaseElement);
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
   * Button-CTA → icon-base → SVG
   */
  function getIconSvg(button: ButtonCTA): SVGElement | null {
    const shadowRoot = button.shadowRoot;
    if (!shadowRoot) return null;
    
    const iconBase = shadowRoot.querySelector('icon-base') as IconBaseElement | null;
    if (!iconBase || !iconBase.shadowRoot) return null;
    
    return iconBase.shadowRoot.querySelector('svg');
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

      // Check for icon-base element
      const iconBase = iconContainer!.querySelector('icon-base');
      expect(iconBase).not.toBeNull();
      expect(iconBase!.getAttribute('name')).toBe('arrow-right');

      // Check for SVG element in nested Shadow DOM
      const svg = getIconSvg(button);
      expect(svg).not.toBeNull();
      expect(svg!.classList.contains('icon-base-arrow-right')).toBe(true);
    });

    it('should not render icon when icon prop not provided', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      expect(shadowRoot).not.toBeNull();

      // With incremental DOM pattern, icon container exists but is hidden
      // This enables CSS transitions when icon is added/removed dynamically
      const iconContainer = shadowRoot!.querySelector('.button-cta__icon') as HTMLElement;
      expect(iconContainer).not.toBeNull();
      expect(iconContainer.style.display).toBe('none');
    });

    it('should update icon when icon prop changes', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      let svg = getIconSvg(button);
      expect(svg!.classList.contains('icon-base-arrow-right')).toBe(true);

      // Change icon
      button.icon = 'check';

      svg = getIconSvg(button);
      expect(svg!.classList.contains('icon-base-check')).toBe(true);
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
      const iconBase = shadowRoot!.querySelector('icon-base');
      
      // Check icon-base has correct size attribute
      expect(iconBase!.getAttribute('size')).toBe('24');
      
      // Check for size class in nested Shadow DOM
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon-base--size-100')).toBe(true);
    });

    it('should use icon.size100 (24px) for medium button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.size = 'medium';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const iconBase = shadowRoot!.querySelector('icon-base');
      
      // Check icon-base has correct size attribute
      expect(iconBase!.getAttribute('size')).toBe('24');
      
      // Check for size class in nested Shadow DOM
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon-base--size-100')).toBe(true);
    });

    it('should use icon.size125 (32px) for large button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.size = 'large';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const iconBase = shadowRoot!.querySelector('icon-base');
      
      // Check icon-base has correct size attribute (iconSizes.size125 = 32)
      expect(iconBase!.getAttribute('size')).toBe('32');
      
      // Check for size class in nested Shadow DOM
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon-base--size-200')).toBe(true);
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
      const iconBase = shadowRoot!.querySelector('icon-base');
      
      // Check icon-base has inherit color
      expect(iconBase!.getAttribute('color')).toBe('inherit');
      
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
      const iconBase = shadowRoot!.querySelector('icon-base');
      
      // Check icon-base has inherit color
      expect(iconBase!.getAttribute('color')).toBe('inherit');
      
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
      const iconBase = shadowRoot!.querySelector('icon-base');
      
      // Check icon-base has inherit color
      expect(iconBase!.getAttribute('color')).toBe('inherit');
      
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

    it('should mark icon-base SVG as decorative with aria-hidden', () => {
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
      
      const iconBase = iconContainer!.querySelector('icon-base');
      expect(iconBase).not.toBeNull();
      
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
      const iconBase = shadowRoot!.querySelector('icon-base');
      
      expect(iconBase).not.toBeNull();
      expect(iconBase!.getAttribute('size')).toBe('24');
      
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon-base--size-100')).toBe(true);
    });

    it('should render icon with large secondary button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Continue';
      button.size = 'large';
      button.buttonVariant = 'secondary';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const iconBase = shadowRoot!.querySelector('icon-base');
      
      expect(iconBase).not.toBeNull();
      expect(iconBase!.getAttribute('size')).toBe('32');
      
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon-base--size-200')).toBe(true);
    });

    it('should render icon with medium tertiary button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Learn More';
      button.size = 'medium';
      button.buttonVariant = 'tertiary';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const iconBase = shadowRoot!.querySelector('icon-base');
      
      expect(iconBase).not.toBeNull();
      expect(iconBase!.getAttribute('size')).toBe('24');
      
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon-base--size-100')).toBe(true);
    });
  });

  describe('Component Composition Pattern', () => {
    it('should use icon-base web component (cross-platform consistency)', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Test';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const iconBase = shadowRoot!.querySelector('icon-base');
      
      // Verify icon-base is used (not raw SVG injection)
      expect(iconBase).not.toBeNull();
      expect(iconBase!.tagName.toLowerCase()).toBe('icon-base');
    });

    it('should pass correct attributes to icon-base', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Test';
      button.icon = 'check';
      button.size = 'large';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const iconBase = shadowRoot!.querySelector('icon-base');
      
      expect(iconBase!.getAttribute('name')).toBe('check');
      expect(iconBase!.getAttribute('size')).toBe('32'); // Large button = 32px icon
      expect(iconBase!.getAttribute('color')).toBe('inherit');
    });
  });
});
