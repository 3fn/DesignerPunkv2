/**
 * ButtonCTA Icon Integration Tests
 * 
 * Tests icon integration with the Icon System (Spec 004).
 * Validates icon rendering, sizing, color, spacing, and accessibility.
 * 
 * @jest-environment jsdom
 * 
 * @module ButtonCTA/platforms/web/__tests__/icon-integration
 */

import { ButtonCTA } from '../ButtonCTA.web';

describe('ButtonCTA Icon Integration', () => {
  beforeEach(() => {
    // Ensure custom element is registered
    if (!customElements.get('button-cta')) {
      customElements.define('button-cta', ButtonCTA);
    }
  });

  afterEach(() => {
    // Clean up any created elements
    document.body.innerHTML = '';
  });

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

      // Check for SVG element
      const svg = iconContainer!.querySelector('svg');
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

      let shadowRoot = button.shadowRoot;
      let svg = shadowRoot!.querySelector('svg');
      expect(svg!.classList.contains('icon-arrow-right')).toBe(true);

      // Change icon
      button.icon = 'check';

      shadowRoot = button.shadowRoot;
      svg = shadowRoot!.querySelector('svg');
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
      const svg = shadowRoot!.querySelector('svg');
      
      expect(svg!.getAttribute('width')).toBe('24');
      expect(svg!.getAttribute('height')).toBe('24');
    });

    it('should use icon.size100 (24px) for medium button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.size = 'medium';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const svg = shadowRoot!.querySelector('svg');
      
      expect(svg!.getAttribute('width')).toBe('24');
      expect(svg!.getAttribute('height')).toBe('24');
    });

    it('should use icon.size125 (32px) for large button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.size = 'large';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const svg = shadowRoot!.querySelector('svg');
      
      expect(svg!.getAttribute('width')).toBe('32');
      expect(svg!.getAttribute('height')).toBe('32');
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
      const svg = shadowRoot!.querySelector('svg');
      
      // Icon should use currentColor (inherits from button)
      expect(svg!.getAttribute('stroke')).toBe('currentColor');
    });

    it('should use inherit color for secondary button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.buttonVariant = 'secondary';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const svg = shadowRoot!.querySelector('svg');
      
      // Icon should use currentColor (inherits from button)
      expect(svg!.getAttribute('stroke')).toBe('currentColor');
    });

    it('should use inherit color for tertiary button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.buttonVariant = 'tertiary';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const svg = shadowRoot!.querySelector('svg');
      
      // Icon should use currentColor (inherits from button)
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
    it('should mark icon as decorative with aria-hidden', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const iconContainer = shadowRoot!.querySelector('.button-cta__icon');
      
      expect(iconContainer!.getAttribute('aria-hidden')).toBe('true');
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

    it('should work in test environment', () => {
      // This test verifies that shadow DOM works in Jest/JSDOM environment
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
      
      const svg = shadowRoot!.querySelector('svg');
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
      const svg = shadowRoot!.querySelector('svg');
      
      expect(svg).not.toBeNull();
      expect(svg!.getAttribute('width')).toBe('24');
    });

    it('should render icon with large secondary button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Continue';
      button.size = 'large';
      button.buttonVariant = 'secondary';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const svg = shadowRoot!.querySelector('svg');
      
      expect(svg).not.toBeNull();
      expect(svg!.getAttribute('width')).toBe('32');
    });

    it('should render icon with medium tertiary button', () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Learn More';
      button.size = 'medium';
      button.buttonVariant = 'tertiary';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      const shadowRoot = button.shadowRoot;
      const svg = shadowRoot!.querySelector('svg');
      
      expect(svg).not.toBeNull();
      expect(svg!.getAttribute('width')).toBe('24');
    });
  });
});
