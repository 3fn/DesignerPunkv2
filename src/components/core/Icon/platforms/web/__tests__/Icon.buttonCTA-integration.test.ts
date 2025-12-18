/**
 * Icon + ButtonCTA Integration Tests
 * 
 * Tests that verify ButtonCTA component integrates correctly with Icon module
 * and that no code changes are needed in ButtonCTA after Icon web component conversion.
 * 
 * @jest-environment jsdom
 * 
 * @module Icon/platforms/web/__tests__
 */

import { createIcon } from '../Icon.web';
import { ButtonCTA } from '../../../../ButtonCTA/platforms/web/ButtonCTA.web';

describe('Icon + ButtonCTA Integration', () => {
  beforeEach(() => {
    // Ensure custom element is registered
    if (!customElements.get('button-cta')) {
      customElements.define('button-cta', ButtonCTA);
    }
    // Clear any existing elements
    document.body.innerHTML = '';
  });

  // Helper function to wait for component to render
  const waitForRender = () => new Promise(resolve => setTimeout(resolve, 0));

  describe('ButtonCTA imports createIcon successfully', () => {
    it('should import createIcon from Icon module', () => {
      // Verify createIcon is available for import
      expect(typeof createIcon).toBe('function');
    });

    it('should be able to call createIcon with ButtonCTA parameters', () => {
      // Simulate ButtonCTA calling createIcon
      const result = createIcon({
        name: 'arrow-right' as any,
        size: 24,
        color: 'inherit'
      });

      expect(result).toBeTruthy();
      expect(result).toContain('<svg');
    });
  });

  describe('ButtonCTA renders icons using createIcon', () => {
    it('should render button with icon using createIcon', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      // Wait for component to render
      await waitForRender();
      
      const shadowRoot = button.shadowRoot;
      expect(shadowRoot).toBeTruthy();

      // Verify icon is rendered in shadow DOM
      const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      expect(iconSpan).toBeTruthy();
      expect(iconSpan!.innerHTML).toContain('<svg');
      expect(iconSpan!.innerHTML).toContain('arrow-right');
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
      const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      
      // Medium button should use 24px icon (via icon--size-100 CSS class)
      expect(iconSpan!.innerHTML).toContain('icon--size-100');
    });

    it('should use correct icon size for large buttons', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      button.icon = 'arrow-right';
      button.size = 'large';
      document.body.appendChild(button);

      await waitForRender();

      const shadowRoot = button.shadowRoot;
      const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      
      // Large button should use 32px icon (via icon--size-200 CSS class)
      expect(iconSpan!.innerHTML).toContain('icon--size-200');
    });
  });

  describe('ButtonCTA icon rendering unchanged', () => {
    it('should render icon with aria-hidden="true"', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Submit';
      button.icon = 'check';
      document.body.appendChild(button);

      await waitForRender();

      const shadowRoot = button.shadowRoot;
      const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      
      // Icon should have aria-hidden attribute
      expect(iconSpan!.innerHTML).toContain('aria-hidden="true"');
    });

    it('should render icon with currentColor for color inheritance', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Submit';
      button.icon = 'arrow-right';
      document.body.appendChild(button);

      await waitForRender();

      const shadowRoot = button.shadowRoot;
      const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      
      // Icon should use currentColor for stroke
      expect(iconSpan!.innerHTML).toContain('stroke="currentColor"');
    });

    it('should wrap icon in span with button-cta__icon class', async () => {
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
        const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
        
        expect(iconSpan).toBeTruthy();
        expect(iconSpan!.innerHTML).toContain('<svg');
        expect(iconSpan!.innerHTML).toContain(`icon-${iconName}`);
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
      const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      
      // Small button uses 24px icon (via icon--size-100 CSS class)
      expect(iconSpan!.innerHTML).toContain('icon--size-100');
    });

    it('should render medium button with 24px icon', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Medium Button';
      button.icon = 'arrow-right';
      button.size = 'medium';
      document.body.appendChild(button);

      await waitForRender();

      const shadowRoot = button.shadowRoot;
      const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      
      // Medium button uses 24px icon (via icon--size-100 CSS class)
      expect(iconSpan!.innerHTML).toContain('icon--size-100');
    });

    it('should render large button with 32px icon', async () => {
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Large Button';
      button.icon = 'plus';
      button.size = 'large';
      document.body.appendChild(button);

      await waitForRender();

      const shadowRoot = button.shadowRoot;
      const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      
      // Large button uses 32px icon (via icon--size-200 CSS class)
      expect(iconSpan!.innerHTML).toContain('icon--size-200');
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
      const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      
      expect(buttonElement!.classList.contains('button-cta--primary')).toBe(true);
      expect(iconSpan).toBeTruthy();
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
      const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      
      expect(buttonElement!.classList.contains('button-cta--secondary')).toBe(true);
      expect(iconSpan).toBeTruthy();
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
      const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      
      expect(buttonElement!.classList.contains('button-cta--tertiary')).toBe(true);
      expect(iconSpan).toBeTruthy();
    });
  });

  describe('ButtonCTA requires no code changes', () => {
    it('should work with existing ButtonCTA implementation', async () => {
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

      const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      expect(iconSpan).toBeTruthy();

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
      let iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      expect(iconSpan!.innerHTML).toContain('icon-check');

      // Change icon
      button.icon = 'arrow-right';

      await waitForRender();

      shadowRoot = button.shadowRoot;
      iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      expect(iconSpan!.innerHTML).toContain('icon-arrow-right');
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
      const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      
      expect(buttonElement!.hasAttribute('disabled')).toBe(true);
      expect(iconSpan).toBeTruthy();
    });
  });

  describe('Requirements Compliance', () => {
    it('should meet Requirement 6.1: ButtonCTA imports createIcon successfully', () => {
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

    it('should meet Requirement 6.2: ButtonCTA continues working without changes', async () => {
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
      const iconSpan = shadowRoot!.querySelector('.button-cta__icon');
      const labelSpan = shadowRoot!.querySelector('.button-cta__label');
      
      expect(buttonElement).toBeTruthy();
      expect(buttonElement!.classList.contains('button-cta--large')).toBe(true);
      expect(buttonElement!.classList.contains('button-cta--primary')).toBe(true);
      expect(buttonElement!.getAttribute('data-testid')).toBe('test-button');
      expect(iconSpan).toBeTruthy();
      // Large button uses 32px icon (via icon--size-200 CSS class)
      expect(iconSpan!.innerHTML).toContain('icon--size-200');
      expect(labelSpan!.textContent).toBe('Full Featured Button');
    });
  });
});
