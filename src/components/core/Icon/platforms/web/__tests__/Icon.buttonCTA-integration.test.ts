/**
 * @category evergreen
 * @purpose Verify Icon.buttonCTA-integration component integration behavior
 * @jest-environment jsdom
 */
/**
 * Icon + ButtonCTA Integration Tests
 * 
 * Tests that verify ButtonCTA component integrates correctly with Icon module.
 * ButtonCTA now uses <dp-icon> web component for icon rendering, following
 * the same component composition pattern as iOS and Android platforms.
 * 
 * @module Icon/platforms/web/__tests__
 */

import { createIcon, DPIcon } from '../Icon.web';
import { ButtonCTA } from '../../../../ButtonCTA/platforms/web/ButtonCTA.web';

/**
 * Set up required CSS custom properties for ButtonCTA blend utilities.
 * ButtonCTA uses blend utilities that read base colors from CSS custom properties.
 */
function setupBlendColorProperties(): void {
  document.documentElement.style.setProperty('--color-primary', '#A855F7');
  document.documentElement.style.setProperty('--color-text-on-primary', '#FFFFFF');
  document.documentElement.style.setProperty('--color-background', '#FFFFFF');
}

describe('Icon + ButtonCTA Integration', () => {
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
    // Clear any existing elements
    document.body.innerHTML = '';
  });

  // Helper function to wait for component to render
  const waitForRender = () => new Promise(resolve => setTimeout(resolve, 0));

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

  describe('createIcon function still available', () => {
    it('should import createIcon from Icon module', () => {
      // Verify createIcon is available for import (backward compatibility)
      expect(typeof createIcon).toBe('function');
    });

    it('should be able to call createIcon with ButtonCTA parameters', () => {
      // Simulate calling createIcon (for backward compatibility)
      const result = createIcon({
        name: 'arrow-right' as any,
        size: 24,
        color: 'inherit'
      });

      expect(result).toBeTruthy();
      expect(result).toContain('<svg');
    });
  });

  describe('ButtonCTA renders icons using dp-icon component', () => {
    it('should render button with icon using dp-icon component', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      // Wait for component to render
      await waitForRender();
      
      const shadowRoot = button.shadowRoot;
      expect(shadowRoot).toBeTruthy();

      // Verify dp-icon is rendered in shadow DOM
      const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      expect(iconSpan).toBeTruthy();
      
      const dpIcon = iconSpan!.querySelector('dp-icon');
      expect(dpIcon).toBeTruthy();
      expect(dpIcon!.getAttribute('name')).toBe('arrow-right');
      
      // Verify SVG is in nested Shadow DOM
      const svg = getIconSvg(button);
      expect(svg).toBeTruthy();
      expect(svg!.classList.contains('icon-arrow-right')).toBe(true);
    });

    it('should render button without icon when icon prop not provided', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      document.body.appendChild(button);

      await waitForRender();

      const shadowRoot = button.shadowRoot;
      const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      
      // No icon span should be present
      expect(iconSpan).toBeNull();
    });

    it('should use correct icon size for small/medium buttons', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.icon = 'check';
      button.size = 'medium';
      document.body.appendChild(button);

      await waitForRender();

      const shadowRoot = button.shadowRoot;
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      // Medium button should use 24px icon
      expect(dpIcon!.getAttribute('size')).toBe('24');
      
      // Verify size class in nested Shadow DOM
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon--size-100')).toBe(true);
    });

    it('should use correct icon size for large buttons', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.icon = 'arrow-right';
      button.size = 'large';
      document.body.appendChild(button);

      await waitForRender();

      const shadowRoot = button.shadowRoot;
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      // Large button should use 32px icon
      expect(dpIcon!.getAttribute('size')).toBe('32');
      
      // Verify size class in nested Shadow DOM
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon--size-200')).toBe(true);
    });
  });

  describe('ButtonCTA icon rendering with dp-icon', () => {
    it('should render icon with aria-hidden="true" on SVG', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Submit';
      button.icon = 'check';
      document.body.appendChild(button);

      await waitForRender();

      // SVG in nested Shadow DOM should have aria-hidden
      const svg = getIconSvg(button);
      expect(svg!.getAttribute('aria-hidden')).toBe('true');
    });

    it('should render icon with currentColor for color inheritance', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Submit';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      await waitForRender();

      // SVG in nested Shadow DOM should use currentColor
      const svg = getIconSvg(button);
      expect(svg!.getAttribute('stroke')).toBe('currentColor');
    });

    it('should wrap dp-icon in span with button-cta__icon class', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Submit';
      button.icon = 'check';
      document.body.appendChild(button);

      await waitForRender();

      const shadowRoot = button.shadowRoot;
      const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      
      expect(iconSpan).toBeTruthy();
      expect(iconSpan!.classList.contains('button-cta__icon')).toBe(true);
      expect(iconSpan!.getAttribute('aria-hidden')).toBe('true');
      
      // dp-icon should be inside the span
      const dpIcon = iconSpan!.querySelector('dp-icon');
      expect(dpIcon).toBeTruthy();
    });

    it('should place icon before label text', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Submit';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      await waitForRender();

      const shadowRoot = button.shadowRoot;
      const buttonElement = shadowRoot!.querySelector('button');
      const children = Array.from(buttonElement!.children);
      
      // First child should be icon span, second should be label span
      expect(children[0].classList.contains('button-cta__icon')).toBe(true);
      expect(children[1].classList.contains('button-cta__label')).toBe(true);
    });
  });

  describe('ButtonCTA with all icon names', () => {
    const allIconNames = [
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

    allIconNames.forEach(iconName => {
      it(`should render button with ${iconName} icon`, async () => {
        const button = document.createElement('button-cta') as ButtonCTA;
        button.label = 'Test Button';
        button.icon = iconName;
        document.body.appendChild(button);

        await waitForRender();

        const shadowRoot = button.shadowRoot;
        const dpIcon = shadowRoot!.querySelector('dp-icon');
        
        expect(dpIcon).toBeTruthy();
        expect(dpIcon!.getAttribute('name')).toBe(iconName);
        
        // Verify SVG in nested Shadow DOM
        const svg = getIconSvg(button);
        expect(svg).toBeTruthy();
        expect(svg!.classList.contains(`icon-${iconName}`)).toBe(true);
      });
    });
  });

  describe('ButtonCTA with different icon sizes', () => {
    it('should render small button with 24px icon', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Small Button';
      button.icon = 'check';
      button.size = 'small';
      document.body.appendChild(button);

      await waitForRender();

      const shadowRoot = button.shadowRoot;
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      // Small button uses 24px icon
      expect(dpIcon!.getAttribute('size')).toBe('24');
      
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon--size-100')).toBe(true);
    });

    it('should render medium button with 24px icon', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Medium Button';
      button.icon = 'arrow-right';
      button.size = 'medium';
      document.body.appendChild(button);

      await waitForRender();

      const shadowRoot = button.shadowRoot;
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      // Medium button uses 24px icon
      expect(dpIcon!.getAttribute('size')).toBe('24');
      
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon--size-100')).toBe(true);
    });

    it('should render large button with 32px icon', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Large Button';
      button.icon = 'plus';
      button.size = 'large';
      document.body.appendChild(button);

      await waitForRender();

      const shadowRoot = button.shadowRoot;
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      // Large button uses 32px icon
      expect(dpIcon!.getAttribute('size')).toBe('32');
      
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon--size-200')).toBe(true);
    });
  });

  describe('ButtonCTA with different button styles', () => {
    it('should render primary button with icon', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Primary';
      button.icon = 'check';
      button.buttonVariant = 'primary';
      document.body.appendChild(button);

      await waitForRender();

      const shadowRoot = button.shadowRoot;
      const buttonElement = shadowRoot!.querySelector('button');
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      expect(buttonElement!.classList.contains('button-cta--primary')).toBe(true);
      expect(dpIcon).toBeTruthy();
    });

    it('should render secondary button with icon', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Secondary';
      button.icon = 'arrow-right';
      button.buttonVariant = 'secondary';
      document.body.appendChild(button);

      await waitForRender();

      const shadowRoot = button.shadowRoot;
      const buttonElement = shadowRoot!.querySelector('button');
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      expect(buttonElement!.classList.contains('button-cta--secondary')).toBe(true);
      expect(dpIcon).toBeTruthy();
    });

    it('should render tertiary button with icon', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Tertiary';
      button.icon = 'x';
      button.buttonVariant = 'tertiary';
      document.body.appendChild(button);

      await waitForRender();

      const shadowRoot = button.shadowRoot;
      const buttonElement = shadowRoot!.querySelector('button');
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      expect(buttonElement!.classList.contains('button-cta--tertiary')).toBe(true);
      expect(dpIcon).toBeTruthy();
    });
  });

  describe('ButtonCTA component composition pattern', () => {
    it('should work with dp-icon component composition', async () => {
      // Create button using existing API
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Test Button';
      button.icon = 'arrow-right';
      button.size = 'medium';
      button.buttonVariant = 'primary';
      document.body.appendChild(button);

      await waitForRender();

      // Verify button renders correctly
      const shadowRoot = button.shadowRoot;
      expect(shadowRoot).toBeTruthy();

      const buttonElement = shadowRoot!.querySelector('button');
      expect(buttonElement).toBeTruthy();

      // Verify dp-icon is used (component composition)
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      expect(dpIcon).toBeTruthy();
      expect(dpIcon!.tagName.toLowerCase()).toBe('dp-icon');

      const labelSpan = shadowRoot!.querySelector('.button-cta__label');
      expect(labelSpan).toBeTruthy();
      expect(labelSpan!.textContent).toBe('Test Button');
    });

    it('should handle dynamic icon changes', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Dynamic Button';
      button.icon = 'check';
      document.body.appendChild(button);

      await waitForRender();

      let shadowRoot = button.shadowRoot;
      let dpIcon = shadowRoot!.querySelector('dp-icon');
      expect(dpIcon!.getAttribute('name')).toBe('check');

      // Change icon
      button.icon = 'arrow-right';

      await waitForRender();

      shadowRoot = button.shadowRoot;
      dpIcon = shadowRoot!.querySelector('dp-icon');
      expect(dpIcon!.getAttribute('name')).toBe('arrow-right');
    });

    it('should handle removing icon', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Toggle Icon';
      button.icon = 'check';
      document.body.appendChild(button);

      await waitForRender();

      let shadowRoot = button.shadowRoot;
      let iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      expect(iconSpan).toBeTruthy();

      // Remove icon
      button.icon = null;

      await waitForRender();

      shadowRoot = button.shadowRoot;
      iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      expect(iconSpan).toBeNull();
    });

    it('should handle disabled state with icon', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Disabled Button';
      button.icon = 'x';
      button.disabled = true;
      document.body.appendChild(button);

      await waitForRender();

      const shadowRoot = button.shadowRoot;
      const buttonElement = shadowRoot!.querySelector('button');
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      
      expect(buttonElement!.hasAttribute('disabled')).toBe(true);
      expect(dpIcon).toBeTruthy();
    });
  });

  describe('Requirements Compliance', () => {
    it('should meet Requirement 6.1: createIcon still available for backward compatibility', () => {
      // Verify createIcon is importable and usable
      expect(typeof createIcon).toBe('function');
      
      const result = createIcon({
        name: 'arrow-right' as any,
        size: 24,
        color: 'inherit'
      });
      
      expect(result).toBeTruthy();
      expect(result).toContain('<svg');
    });

    it('should meet Requirement 6.2: ButtonCTA uses dp-icon for cross-platform consistency', async () => {
      // Create button with all features
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Full Featured Button';
      button.icon = 'check';
      button.size = 'large';
      button.buttonVariant = 'primary';
      button.testID = 'test-button';
      document.body.appendChild(button);

      await waitForRender();

      // Verify all features work
      const shadowRoot = button.shadowRoot;
      const buttonElement = shadowRoot!.querySelector('button');
      const dpIcon = shadowRoot!.querySelector('dp-icon');
      const labelSpan = shadowRoot!.querySelector('.button-cta__label');
      
      expect(buttonElement).toBeTruthy();
      expect(buttonElement!.classList.contains('button-cta--large')).toBe(true);
      expect(buttonElement!.classList.contains('button-cta--primary')).toBe(true);
      expect(buttonElement!.getAttribute('data-testid')).toBe('test-button');
      
      // Verify dp-icon is used with correct attributes
      expect(dpIcon).toBeTruthy();
      expect(dpIcon!.getAttribute('name')).toBe('check');
      expect(dpIcon!.getAttribute('size')).toBe('32'); // Large button = 32px icon
      expect(dpIcon!.getAttribute('color')).toBe('inherit');
      
      // Verify SVG in nested Shadow DOM
      const svg = getIconSvg(button);
      expect(svg!.classList.contains('icon--size-200')).toBe(true);
      
      expect(labelSpan!.textContent).toBe('Full Featured Button');
    });
  });
});
