/**
 * @category evergreen
 * @purpose Verify Chip-Input web component behavior: dismiss, X icon, accessibility
 * @jest-environment jsdom
 */
/**
 * Chip-Input Web Component Tests
 * 
 * Stemma System: Chip Family
 * Component Type: Semantic Variant
 * Inherits: Chip-Base
 * 
 * Tests the Chip-Input component's web component behavior:
 * - X icon always visible
 * - Both leading and trailing icons when icon prop provided
 * - onDismiss callback on press
 * - X icon accessible label "Remove [label]"
 * 
 * Following Test Development Standards:
 * - Explicit custom element registration pattern
 * - Wait for customElements.whenDefined() before tests
 * - Wait after appendChild() before querying shadow DOM
 * - Clean up DOM after each test
 * - Test behavior, NOT implementation details
 * 
 * @module Chip-Input/__tests__
 * @see Requirements: 5.1-5.6, 7.5, 13.1, 13.5 in .kiro/specs/045-chip-base/requirements.md
 */

import { ChipInputElement } from '../platforms/web/ChipInput.web';

describe('Chip-Input Web Component', () => {
  beforeAll(() => {
    // Ensure custom element is registered
    if (!customElements.get('chip-input')) {
      customElements.define('chip-input', ChipInputElement);
    }
  });

  beforeEach(async () => {
    // Wait for custom element to be defined
    await customElements.whenDefined('chip-input');
  });

  afterEach(() => {
    // Clean up any created elements
    document.body.innerHTML = '';
  });

  // ============================================================================
  // Custom Element Registration
  // ============================================================================
  
  describe('Custom Element Registration', () => {
    it('should be registered as "chip-input" custom element', () => {
      const ElementClass = customElements.get('chip-input');
      expect(ElementClass).toBe(ChipInputElement);
    });

    it('should be creatable via document.createElement', () => {
      const chip = document.createElement('chip-input');
      expect(chip).toBeInstanceOf(ChipInputElement);
    });
  });

  // ============================================================================
  // X Icon Always Visible
  // ============================================================================
  
  describe('X Icon Always Visible', () => {
    /**
     * @see Requirement 5.2 - Always display X icon as trailing element
     * Validates: Requirements 5.2
     */
    it('should always show X icon as trailing element', async () => {
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'Tag');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const trailingIconContainer = chip.shadowRoot?.querySelector('.chip-input__trailing-icon');
      expect(trailingIconContainer).toBeTruthy();
      
      const iconElement = trailingIconContainer?.querySelector('icon-base');
      expect(iconElement).toBeTruthy();
      expect(iconElement?.getAttribute('name')).toBe('x');
    });

    it('should show X icon even without leading icon', async () => {
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'Simple Tag');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Leading icon should be hidden
      const leadingIconContainer = chip.shadowRoot?.querySelector('.chip-base__icon') as HTMLElement;
      expect(leadingIconContainer?.style.display).toBe('none');
      
      // Trailing X icon should be visible
      const trailingIconContainer = chip.shadowRoot?.querySelector('.chip-input__trailing-icon');
      expect(trailingIconContainer).toBeTruthy();
      
      const xIcon = trailingIconContainer?.querySelector('icon-base');
      expect(xIcon?.getAttribute('name')).toBe('x');
    });

    it('should show X icon after label update', async () => {
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'Original');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Update label
      chip.setAttribute('label', 'Updated');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // X icon should still be visible
      const trailingIconContainer = chip.shadowRoot?.querySelector('.chip-input__trailing-icon');
      const xIcon = trailingIconContainer?.querySelector('icon-base');
      expect(xIcon?.getAttribute('name')).toBe('x');
    });
  });

  // ============================================================================
  // Both Leading and Trailing Icons
  // ============================================================================
  
  describe('Both Leading and Trailing Icons', () => {
    /**
     * @see Requirement 5.3 - Support both leading icon AND trailing X icon
     * Validates: Requirements 5.3
     */
    it('should show both leading icon and trailing X icon when icon prop provided', async () => {
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'Category');
      chip.setAttribute('icon', 'tag');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Leading icon should be visible with correct name
      const leadingIconContainer = chip.shadowRoot?.querySelector('.chip-base__icon') as HTMLElement;
      expect(leadingIconContainer?.style.display).not.toBe('none');
      
      const leadingIcon = leadingIconContainer?.querySelector('icon-base');
      expect(leadingIcon?.getAttribute('name')).toBe('tag');
      
      // Trailing X icon should also be visible
      const trailingIconContainer = chip.shadowRoot?.querySelector('.chip-input__trailing-icon');
      const trailingIcon = trailingIconContainer?.querySelector('icon-base');
      expect(trailingIcon?.getAttribute('name')).toBe('x');
    });

    it('should update leading icon while keeping X icon', async () => {
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'Category');
      chip.setAttribute('icon', 'star');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify initial leading icon
      let leadingIcon = chip.shadowRoot?.querySelector('.chip-base__icon icon-base');
      expect(leadingIcon?.getAttribute('name')).toBe('star');
      
      // Change leading icon
      chip.setAttribute('icon', 'heart');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Leading icon should be updated
      leadingIcon = chip.shadowRoot?.querySelector('.chip-base__icon icon-base');
      expect(leadingIcon?.getAttribute('name')).toBe('heart');
      
      // X icon should still be present
      const trailingIcon = chip.shadowRoot?.querySelector('.chip-input__trailing-icon icon-base');
      expect(trailingIcon?.getAttribute('name')).toBe('x');
    });

    it('should hide leading icon when icon attribute is removed but keep X icon', async () => {
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'Category');
      chip.setAttribute('icon', 'tag');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Remove leading icon
      chip.removeAttribute('icon');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Leading icon should be hidden
      const leadingIconContainer = chip.shadowRoot?.querySelector('.chip-base__icon') as HTMLElement;
      expect(leadingIconContainer?.style.display).toBe('none');
      
      // X icon should still be visible
      const trailingIcon = chip.shadowRoot?.querySelector('.chip-input__trailing-icon icon-base');
      expect(trailingIcon?.getAttribute('name')).toBe('x');
    });
  });

  // ============================================================================
  // onDismiss Callback
  // ============================================================================
  
  describe('onDismiss Callback', () => {
    /**
     * @see Requirement 5.4 - Tap anywhere calls onDismiss
     * Validates: Requirements 5.4
     */
    it('should call onDismiss when chip is clicked', async () => {
      const onDismiss = jest.fn();
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'Dismissible');
      chip.onDismiss = onDismiss;
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-input') as HTMLElement;
      chipEl?.click();
      
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('should call onDismiss on Enter key', async () => {
      const onDismiss = jest.fn();
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'Keyboard');
      chip.onDismiss = onDismiss;
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-input') as HTMLElement;
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      chipEl?.dispatchEvent(enterEvent);
      
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('should call onDismiss on Space key', async () => {
      const onDismiss = jest.fn();
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'Keyboard');
      chip.onDismiss = onDismiss;
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-input') as HTMLElement;
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      chipEl?.dispatchEvent(spaceEvent);
      
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('should dispatch dismiss event when clicked', async () => {
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'Event Test');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const eventHandler = jest.fn();
      chip.addEventListener('dismiss', eventHandler);
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-input') as HTMLElement;
      chipEl?.click();
      
      expect(eventHandler).toHaveBeenCalledTimes(1);
    });

    it('should not throw when clicked without onDismiss callback', async () => {
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'No Callback');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-input') as HTMLElement;
      
      expect(() => chipEl?.click()).not.toThrow();
    });

    it('should call onDismiss multiple times on repeated clicks', async () => {
      const onDismiss = jest.fn();
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'Multi Click');
      chip.onDismiss = onDismiss;
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-input') as HTMLElement;
      chipEl?.click();
      chipEl?.click();
      chipEl?.click();
      
      expect(onDismiss).toHaveBeenCalledTimes(3);
    });
  });

  // ============================================================================
  // X Icon Accessible Label
  // ============================================================================
  
  describe('X Icon Accessible Label', () => {
    /**
     * @see Requirement 7.5 - X icon accessible label "Remove [label]"
     * Validates: Requirements 7.5
     */
    it('should have aria-label "Remove [label]" on chip', async () => {
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'JavaScript');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-input');
      expect(chipEl?.getAttribute('aria-label')).toBe('Remove JavaScript');
    });

    it('should have visually hidden dismiss label text', async () => {
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'Python');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const dismissLabel = chip.shadowRoot?.querySelector('.chip-input__dismiss-label');
      expect(dismissLabel).toBeTruthy();
      expect(dismissLabel?.textContent).toBe('Remove Python');
    });

    it('should update accessible label when label changes', async () => {
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'Original');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let chipEl = chip.shadowRoot?.querySelector('.chip-input');
      expect(chipEl?.getAttribute('aria-label')).toBe('Remove Original');
      
      // Change label
      chip.setAttribute('label', 'Updated');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      chipEl = chip.shadowRoot?.querySelector('.chip-input');
      expect(chipEl?.getAttribute('aria-label')).toBe('Remove Updated');
    });

    it('should update visually hidden text when label changes', async () => {
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'First');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let dismissLabel = chip.shadowRoot?.querySelector('.chip-input__dismiss-label');
      expect(dismissLabel?.textContent).toBe('Remove First');
      
      // Change label
      chip.setAttribute('label', 'Second');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      dismissLabel = chip.shadowRoot?.querySelector('.chip-input__dismiss-label');
      expect(dismissLabel?.textContent).toBe('Remove Second');
    });

    it('should have aria-hidden on trailing icon container', async () => {
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'Tag');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const trailingIconContainer = chip.shadowRoot?.querySelector('.chip-input__trailing-icon');
      expect(trailingIconContainer?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  // ============================================================================
  // Accessibility - Role and Tabindex
  // ============================================================================
  
  describe('Accessibility - Role and Tabindex', () => {
    it('should have role="button"', async () => {
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'Accessible');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-input');
      expect(chipEl?.getAttribute('role')).toBe('button');
    });

    it('should have tabindex="0" for keyboard focus', async () => {
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'Focusable');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-input');
      expect(chipEl?.getAttribute('tabindex')).toBe('0');
    });
  });

  // ============================================================================
  // Observed Attributes
  // ============================================================================
  
  describe('Observed Attributes', () => {
    it('should observe label attribute', () => {
      expect(ChipInputElement.observedAttributes).toContain('label');
    });

    it('should observe icon attribute', () => {
      expect(ChipInputElement.observedAttributes).toContain('icon');
    });

    it('should observe test-id attribute', () => {
      expect(ChipInputElement.observedAttributes).toContain('test-id');
    });

    it('should NOT observe selected attribute (Chip-Input has no selected state)', () => {
      expect(ChipInputElement.observedAttributes).not.toContain('selected');
    });
  });

  // ============================================================================
  // Test ID
  // ============================================================================
  
  describe('Test ID', () => {
    it('should apply data-testid attribute', async () => {
      const chip = document.createElement('chip-input') as ChipInputElement;
      chip.setAttribute('label', 'Test');
      chip.setAttribute('test-id', 'my-chip-input');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-input');
      expect(chipEl?.getAttribute('data-testid')).toBe('my-chip-input');
    });
  });
});
