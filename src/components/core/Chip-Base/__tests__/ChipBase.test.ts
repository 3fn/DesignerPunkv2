/**
 * @category evergreen
 * @purpose Verify Chip-Base web component behavior: rendering, interaction, accessibility
 * @jest-environment jsdom
 */
/**
 * Chip-Base Web Component Tests
 * 
 * Stemma System: Chip Family
 * Component Type: Primitive (Base)
 * 
 * Tests the Chip-Base component's web component behavior:
 * - Custom element registration
 * - Label and icon rendering
 * - Press callback (click and keyboard)
 * - Accessibility (role, tabindex, keyboard activation, ARIA)
 * 
 * Following Test Development Standards:
 * - Explicit custom element registration pattern
 * - Wait for customElements.whenDefined() before tests
 * - Wait after appendChild() before querying shadow DOM
 * - Clean up DOM after each test
 * - Test behavior, NOT implementation details
 * 
 * @module Chip-Base/__tests__
 * @see Requirements: 13.1-13.7 in .kiro/specs/045-chip-base/requirements.md
 */

import { ChipBaseElement } from '../platforms/web/ChipBase.web';

describe('Chip-Base Web Component', () => {
  beforeAll(() => {
    // Ensure custom element is registered
    if (!customElements.get('chip-base')) {
      customElements.define('chip-base', ChipBaseElement);
    }
  });

  beforeEach(async () => {
    // Wait for custom element to be defined
    await customElements.whenDefined('chip-base');
  });

  afterEach(() => {
    // Clean up any created elements
    document.body.innerHTML = '';
  });

  // ============================================================================
  // Custom Element Registration
  // ============================================================================
  
  describe('Custom Element Registration', () => {
    /**
     * @see Requirements: 13.2 - Use explicit custom element registration pattern
     */
    it('should be registered as "chip-base" custom element', () => {
      const ElementClass = customElements.get('chip-base');
      expect(ElementClass).toBe(ChipBaseElement);
    });

    it('should be creatable via document.createElement', () => {
      const chip = document.createElement('chip-base');
      expect(chip).toBeInstanceOf(ChipBaseElement);
    });

    it('should be creatable via constructor', () => {
      const chip = new ChipBaseElement();
      expect(chip).toBeInstanceOf(ChipBaseElement);
    });

    it('should have correct tag name', () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      expect(chip.tagName.toLowerCase()).toBe('chip-base');
    });
  });

  // ============================================================================
  // Shadow DOM Initialization
  // ============================================================================
  
  describe('Shadow DOM Initialization', () => {
    it('should attach shadow DOM in constructor', () => {
      const chip = new ChipBaseElement();
      expect(chip.shadowRoot).toBeTruthy();
    });

    it('should attach shadow DOM in open mode', () => {
      const chip = new ChipBaseElement();
      expect(chip.shadowRoot).not.toBeNull();
      expect(chip.shadowRoot?.mode).toBe('open');
    });
  });

  // ============================================================================
  // Label Rendering
  // ============================================================================
  
  describe('Label Rendering', () => {
    /**
     * @see Requirements: 1.1 - Display pill-shaped container with label text
     */
    it('should render label text', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Category');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const label = chip.shadowRoot?.querySelector('.chip-base__label');
      expect(label?.textContent).toBe('Category');
    });

    it('should update label when attribute changes', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Original');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let label = chip.shadowRoot?.querySelector('.chip-base__label');
      expect(label?.textContent).toBe('Original');
      
      // Change label
      chip.setAttribute('label', 'Updated');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      label = chip.shadowRoot?.querySelector('.chip-base__label');
      expect(label?.textContent).toBe('Updated');
    });

    it('should update label via property setter', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.label = 'Property Label';
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const label = chip.shadowRoot?.querySelector('.chip-base__label');
      expect(label?.textContent).toBe('Property Label');
    });
  });

  // ============================================================================
  // Icon Rendering
  // ============================================================================
  
  describe('Icon Rendering', () => {
    /**
     * @see Requirements: 1.2 - Display icon before label using Icon-Base
     */
    it('should render icon when icon prop is provided', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Filter');
      chip.setAttribute('icon', 'check');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const iconContainer = chip.shadowRoot?.querySelector('.chip-base__icon');
      expect(iconContainer).toBeTruthy();
      
      const iconElement = iconContainer?.querySelector('icon-base');
      expect(iconElement).toBeTruthy();
      expect(iconElement?.getAttribute('name')).toBe('check');
    });

    it('should hide icon container when no icon is provided', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'No Icon');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const iconContainer = chip.shadowRoot?.querySelector('.chip-base__icon') as HTMLElement;
      expect(iconContainer?.style.display).toBe('none');
    });

    it('should update icon when attribute changes', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Filter');
      chip.setAttribute('icon', 'check');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let iconElement = chip.shadowRoot?.querySelector('.chip-base__icon icon-base');
      expect(iconElement?.getAttribute('name')).toBe('check');
      
      // Change icon
      chip.setAttribute('icon', 'star');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      iconElement = chip.shadowRoot?.querySelector('.chip-base__icon icon-base');
      expect(iconElement?.getAttribute('name')).toBe('star');
    });

    it('should hide icon when icon attribute is removed', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Filter');
      chip.setAttribute('icon', 'check');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let iconContainer = chip.shadowRoot?.querySelector('.chip-base__icon') as HTMLElement;
      expect(iconContainer?.style.display).not.toBe('none');
      
      // Remove icon
      chip.removeAttribute('icon');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      iconContainer = chip.shadowRoot?.querySelector('.chip-base__icon') as HTMLElement;
      expect(iconContainer?.style.display).toBe('none');
    });
  });

  // ============================================================================
  // Press Callback
  // ============================================================================
  
  describe('Press Callback', () => {
    /**
     * @see Requirements: 1.3 - Call onPress callback when pressed
     */
    it('should call onPress when clicked', async () => {
      const onPress = jest.fn();
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Clickable');
      chip.onPress = onPress;
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-base') as HTMLElement;
      chipEl?.click();
      
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should dispatch press event when clicked', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Clickable');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const pressHandler = jest.fn();
      chip.addEventListener('press', pressHandler);
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-base') as HTMLElement;
      chipEl?.click();
      
      expect(pressHandler).toHaveBeenCalledTimes(1);
    });

    it('should not throw when clicked without onPress callback', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'No Callback');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-base') as HTMLElement;
      
      expect(() => chipEl?.click()).not.toThrow();
    });
  });

  // ============================================================================
  // Accessibility - Role and Tabindex
  // ============================================================================
  
  describe('Accessibility - Role and Tabindex', () => {
    /**
     * @see Requirements: 7.1 - Focusable via keyboard (Tab)
     */
    it('should have role="button"', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Accessible');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-base');
      expect(chipEl?.getAttribute('role')).toBe('button');
    });

    it('should have tabindex="0" for keyboard focus', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Focusable');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-base');
      expect(chipEl?.getAttribute('tabindex')).toBe('0');
    });

    it('should have aria-label matching the label text', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Category Filter');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-base');
      expect(chipEl?.getAttribute('aria-label')).toBe('Category Filter');
    });

    it('should update aria-label when label changes', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Original');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let chipEl = chip.shadowRoot?.querySelector('.chip-base');
      expect(chipEl?.getAttribute('aria-label')).toBe('Original');
      
      // Change label
      chip.setAttribute('label', 'Updated');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      chipEl = chip.shadowRoot?.querySelector('.chip-base');
      expect(chipEl?.getAttribute('aria-label')).toBe('Updated');
    });
  });

  // ============================================================================
  // Accessibility - Keyboard Activation
  // ============================================================================
  
  describe('Accessibility - Keyboard Activation', () => {
    /**
     * @see Requirements: 7.3 - Space/Enter activates chip
     */
    it('should call onPress when Enter key is pressed', async () => {
      const onPress = jest.fn();
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Keyboard');
      chip.onPress = onPress;
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-base') as HTMLElement;
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      chipEl?.dispatchEvent(enterEvent);
      
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should call onPress when Space key is pressed', async () => {
      const onPress = jest.fn();
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Keyboard');
      chip.onPress = onPress;
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-base') as HTMLElement;
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      chipEl?.dispatchEvent(spaceEvent);
      
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should dispatch press event on keyboard activation', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Keyboard');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const pressHandler = jest.fn();
      chip.addEventListener('press', pressHandler);
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-base') as HTMLElement;
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      chipEl?.dispatchEvent(enterEvent);
      
      expect(pressHandler).toHaveBeenCalledTimes(1);
    });

    it('should not activate on other keys', async () => {
      const onPress = jest.fn();
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Keyboard');
      chip.onPress = onPress;
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-base') as HTMLElement;
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      chipEl?.dispatchEvent(tabEvent);
      
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // Test ID
  // ============================================================================
  
  describe('Test ID', () => {
    it('should apply data-testid attribute', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Test');
      chip.setAttribute('test-id', 'my-chip');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-base');
      expect(chipEl?.getAttribute('data-testid')).toBe('my-chip');
    });

    it('should update data-testid when attribute changes', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Test');
      chip.setAttribute('test-id', 'original-id');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let chipEl = chip.shadowRoot?.querySelector('.chip-base');
      expect(chipEl?.getAttribute('data-testid')).toBe('original-id');
      
      // Change test-id
      chip.setAttribute('test-id', 'updated-id');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      chipEl = chip.shadowRoot?.querySelector('.chip-base');
      expect(chipEl?.getAttribute('data-testid')).toBe('updated-id');
    });

    it('should remove data-testid when attribute is removed', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Test');
      chip.setAttribute('test-id', 'my-chip');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let chipEl = chip.shadowRoot?.querySelector('.chip-base');
      expect(chipEl?.getAttribute('data-testid')).toBe('my-chip');
      
      // Remove test-id
      chip.removeAttribute('test-id');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      chipEl = chip.shadowRoot?.querySelector('.chip-base');
      expect(chipEl?.hasAttribute('data-testid')).toBe(false);
    });

    it('should apply testID via property setter', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.label = 'Test';
      chip.testID = 'property-id';
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-base');
      expect(chipEl?.getAttribute('data-testid')).toBe('property-id');
    });
  });

  // ============================================================================
  // Observed Attributes
  // ============================================================================
  
  describe('Observed Attributes', () => {
    it('should observe label attribute', () => {
      expect(ChipBaseElement.observedAttributes).toContain('label');
    });

    it('should observe icon attribute', () => {
      expect(ChipBaseElement.observedAttributes).toContain('icon');
    });

    it('should observe test-id attribute', () => {
      expect(ChipBaseElement.observedAttributes).toContain('test-id');
    });

    it('should have exactly 3 observed attributes', () => {
      expect(ChipBaseElement.observedAttributes.length).toBe(3);
    });
  });

  // ============================================================================
  // Icon Container Accessibility
  // ============================================================================
  
  describe('Icon Container Accessibility', () => {
    /**
     * Icon should be hidden from screen readers (decorative)
     */
    it('should have aria-hidden on icon container', async () => {
      const chip = document.createElement('chip-base') as ChipBaseElement;
      chip.setAttribute('label', 'Filter');
      chip.setAttribute('icon', 'check');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const iconContainer = chip.shadowRoot?.querySelector('.chip-base__icon');
      expect(iconContainer?.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
