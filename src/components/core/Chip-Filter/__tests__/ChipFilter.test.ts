/**
 * @category evergreen
 * @purpose Verify Chip-Filter web component behavior: toggle, selection, accessibility
 * @jest-environment jsdom
 */
/**
 * Chip-Filter Web Component Tests
 * 
 * Stemma System: Chip Family
 * Component Type: Semantic Variant
 * Inherits: Chip-Base
 * 
 * Tests the Chip-Filter component's web component behavior:
 * - Toggle behavior (selected state changes on press)
 * - onSelectionChange callback
 * - Checkmark icon when selected
 * - Checkmark replaces leading icon when both present
 * - aria-pressed attribute for accessibility
 * 
 * Following Test Development Standards:
 * - Explicit custom element registration pattern
 * - Wait for customElements.whenDefined() before tests
 * - Wait after appendChild() before querying shadow DOM
 * - Clean up DOM after each test
 * - Test behavior, NOT implementation details
 * 
 * @module Chip-Filter/__tests__
 * @see Requirements: 4.1-4.6, 7.4, 13.1, 13.5 in .kiro/specs/045-chip-base/requirements.md
 */

import { ChipFilterElement } from '../platforms/web/ChipFilter.web';

describe('Chip-Filter Web Component', () => {
  beforeAll(() => {
    // Ensure custom element is registered
    if (!customElements.get('chip-filter')) {
      customElements.define('chip-filter', ChipFilterElement);
    }
  });

  beforeEach(async () => {
    // Wait for custom element to be defined
    await customElements.whenDefined('chip-filter');
  });

  afterEach(() => {
    // Clean up any created elements
    document.body.innerHTML = '';
  });

  // ============================================================================
  // Custom Element Registration
  // ============================================================================
  
  describe('Custom Element Registration', () => {
    it('should be registered as "chip-filter" custom element', () => {
      const ElementClass = customElements.get('chip-filter');
      expect(ElementClass).toBe(ChipFilterElement);
    });

    it('should be creatable via document.createElement', () => {
      const chip = document.createElement('chip-filter');
      expect(chip).toBeInstanceOf(ChipFilterElement);
    });
  });

  // ============================================================================
  // Toggle Behavior
  // ============================================================================
  
  describe('Toggle Behavior', () => {
    /**
     * @see Requirement 4.5 - Toggle selected state on press
     * Validates: Requirements 4.1, 4.5
     */
    it('should toggle selected state when clicked', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Initially not selected
      expect(chip.selected).toBe(false);
      
      // Click to select
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter') as HTMLElement;
      chipEl?.click();
      
      expect(chip.selected).toBe(true);
      
      // Click again to deselect
      chipEl?.click();
      
      expect(chip.selected).toBe(false);
    });

    it('should toggle selected state on Enter key', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(chip.selected).toBe(false);
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter') as HTMLElement;
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      chipEl?.dispatchEvent(enterEvent);
      
      expect(chip.selected).toBe(true);
    });

    it('should toggle selected state on Space key', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(chip.selected).toBe(false);
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter') as HTMLElement;
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      chipEl?.dispatchEvent(spaceEvent);
      
      expect(chip.selected).toBe(true);
    });

    it('should start selected when selected attribute is present', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      chip.setAttribute('selected', '');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(chip.selected).toBe(true);
    });

    it('should start selected when selected property is set', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.label = 'Category';
      chip.selected = true;
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(chip.selected).toBe(true);
    });
  });

  // ============================================================================
  // onSelectionChange Callback
  // ============================================================================
  
  describe('onSelectionChange Callback', () => {
    /**
     * @see Requirement 4.5 - Call onSelectionChange callback
     * Validates: Requirements 4.5
     */
    it('should call onSelectionChange with true when selecting', async () => {
      const onSelectionChange = jest.fn();
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      chip.onSelectionChange = onSelectionChange;
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter') as HTMLElement;
      chipEl?.click();
      
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledWith(true);
    });

    it('should call onSelectionChange with false when deselecting', async () => {
      const onSelectionChange = jest.fn();
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      chip.setAttribute('selected', '');
      chip.onSelectionChange = onSelectionChange;
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter') as HTMLElement;
      chipEl?.click();
      
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledWith(false);
    });

    it('should dispatch selectionchange event with detail', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const eventHandler = jest.fn();
      chip.addEventListener('selectionchange', eventHandler);
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter') as HTMLElement;
      chipEl?.click();
      
      expect(eventHandler).toHaveBeenCalledTimes(1);
      expect(eventHandler.mock.calls[0][0].detail).toEqual({ selected: true });
    });

    it('should not throw when clicked without onSelectionChange callback', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'No Callback');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter') as HTMLElement;
      
      expect(() => chipEl?.click()).not.toThrow();
    });
  });

  // ============================================================================
  // Checkmark Icon When Selected
  // ============================================================================
  
  describe('Checkmark Icon When Selected', () => {
    /**
     * @see Requirement 4.3 - Display checkmark icon when selected
     * Validates: Requirements 4.3
     */
    it('should show checkmark icon when selected', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      chip.setAttribute('selected', '');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const iconContainer = chip.shadowRoot?.querySelector('.chip-base__icon') as HTMLElement;
      const iconElement = iconContainer?.querySelector('icon-base');
      
      expect(iconContainer?.style.display).not.toBe('none');
      expect(iconElement?.getAttribute('name')).toBe('check');
    });

    it('should hide icon when not selected and no icon prop', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const iconContainer = chip.shadowRoot?.querySelector('.chip-base__icon') as HTMLElement;
      expect(iconContainer?.style.display).toBe('none');
    });

    it('should show checkmark after clicking to select', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Initially no icon visible
      let iconContainer = chip.shadowRoot?.querySelector('.chip-base__icon') as HTMLElement;
      expect(iconContainer?.style.display).toBe('none');
      
      // Click to select
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter') as HTMLElement;
      chipEl?.click();
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Now checkmark should be visible
      iconContainer = chip.shadowRoot?.querySelector('.chip-base__icon') as HTMLElement;
      const iconElement = iconContainer?.querySelector('icon-base');
      
      expect(iconContainer?.style.display).not.toBe('none');
      expect(iconElement?.getAttribute('name')).toBe('check');
    });

    it('should hide checkmark after clicking to deselect', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      chip.setAttribute('selected', '');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Initially checkmark visible
      let iconContainer = chip.shadowRoot?.querySelector('.chip-base__icon') as HTMLElement;
      expect(iconContainer?.style.display).not.toBe('none');
      
      // Click to deselect
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter') as HTMLElement;
      chipEl?.click();
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Now icon should be hidden
      iconContainer = chip.shadowRoot?.querySelector('.chip-base__icon') as HTMLElement;
      expect(iconContainer?.style.display).toBe('none');
    });
  });

  // ============================================================================
  // Checkmark Replaces Leading Icon
  // ============================================================================
  
  describe('Checkmark Replaces Leading Icon', () => {
    /**
     * @see Requirement 4.4 - Checkmark replaces leading icon when selected
     * Validates: Requirements 4.4
     */
    it('should show leading icon when not selected', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      chip.setAttribute('icon', 'star');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const iconContainer = chip.shadowRoot?.querySelector('.chip-base__icon') as HTMLElement;
      const iconElement = iconContainer?.querySelector('icon-base');
      
      expect(iconContainer?.style.display).not.toBe('none');
      expect(iconElement?.getAttribute('name')).toBe('star');
    });

    it('should replace leading icon with checkmark when selected', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      chip.setAttribute('icon', 'star');
      chip.setAttribute('selected', '');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const iconContainer = chip.shadowRoot?.querySelector('.chip-base__icon') as HTMLElement;
      const iconElement = iconContainer?.querySelector('icon-base');
      
      expect(iconContainer?.style.display).not.toBe('none');
      expect(iconElement?.getAttribute('name')).toBe('check');
    });

    it('should restore leading icon when deselected', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      chip.setAttribute('icon', 'star');
      chip.setAttribute('selected', '');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Initially checkmark (selected)
      let iconElement = chip.shadowRoot?.querySelector('.chip-base__icon icon-base');
      expect(iconElement?.getAttribute('name')).toBe('check');
      
      // Click to deselect
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter') as HTMLElement;
      chipEl?.click();
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Now should show original icon
      iconElement = chip.shadowRoot?.querySelector('.chip-base__icon icon-base');
      expect(iconElement?.getAttribute('name')).toBe('star');
    });

    it('should toggle between leading icon and checkmark on repeated clicks', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      chip.setAttribute('icon', 'star');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter') as HTMLElement;
      
      // Initially star icon
      let iconElement = chip.shadowRoot?.querySelector('.chip-base__icon icon-base');
      expect(iconElement?.getAttribute('name')).toBe('star');
      
      // Click to select - should show checkmark
      chipEl?.click();
      await new Promise(resolve => setTimeout(resolve, 0));
      iconElement = chip.shadowRoot?.querySelector('.chip-base__icon icon-base');
      expect(iconElement?.getAttribute('name')).toBe('check');
      
      // Click to deselect - should show star again
      chipEl?.click();
      await new Promise(resolve => setTimeout(resolve, 0));
      iconElement = chip.shadowRoot?.querySelector('.chip-base__icon icon-base');
      expect(iconElement?.getAttribute('name')).toBe('star');
    });
  });

  // ============================================================================
  // aria-pressed Attribute
  // ============================================================================
  
  describe('aria-pressed Attribute', () => {
    /**
     * @see Requirement 7.4 - aria-pressed attribute for accessibility
     * Validates: Requirements 7.4
     */
    it('should have aria-pressed="false" when not selected', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter');
      expect(chipEl?.getAttribute('aria-pressed')).toBe('false');
    });

    it('should have aria-pressed="true" when selected', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      chip.setAttribute('selected', '');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter');
      expect(chipEl?.getAttribute('aria-pressed')).toBe('true');
    });

    it('should update aria-pressed when selected state changes via click', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter') as HTMLElement;
      
      // Initially false
      expect(chipEl?.getAttribute('aria-pressed')).toBe('false');
      
      // Click to select
      chipEl?.click();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(chipEl?.getAttribute('aria-pressed')).toBe('true');
      
      // Click to deselect
      chipEl?.click();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(chipEl?.getAttribute('aria-pressed')).toBe('false');
    });

    it('should update aria-pressed when selected attribute changes', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter');
      
      // Initially false
      expect(chipEl?.getAttribute('aria-pressed')).toBe('false');
      
      // Set selected attribute
      chip.setAttribute('selected', '');
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(chipEl?.getAttribute('aria-pressed')).toBe('true');
      
      // Remove selected attribute
      chip.removeAttribute('selected');
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(chipEl?.getAttribute('aria-pressed')).toBe('false');
    });

    it('should update aria-pressed when selected property changes', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.label = 'Category';
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter');
      
      // Initially false
      expect(chipEl?.getAttribute('aria-pressed')).toBe('false');
      
      // Set selected property
      chip.selected = true;
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(chipEl?.getAttribute('aria-pressed')).toBe('true');
    });
  });

  // ============================================================================
  // Selected State CSS Class
  // ============================================================================
  
  describe('Selected State CSS Class', () => {
    it('should have chip-filter--selected class when selected', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      chip.setAttribute('selected', '');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter');
      expect(chipEl?.classList.contains('chip-filter--selected')).toBe(true);
    });

    it('should not have chip-filter--selected class when not selected', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter');
      expect(chipEl?.classList.contains('chip-filter--selected')).toBe(false);
    });

    it('should toggle chip-filter--selected class on click', async () => {
      const chip = document.createElement('chip-filter') as ChipFilterElement;
      chip.setAttribute('label', 'Category');
      document.body.appendChild(chip);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const chipEl = chip.shadowRoot?.querySelector('.chip-filter') as HTMLElement;
      
      // Initially no selected class
      expect(chipEl?.classList.contains('chip-filter--selected')).toBe(false);
      
      // Click to select
      chipEl?.click();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(chipEl?.classList.contains('chip-filter--selected')).toBe(true);
      
      // Click to deselect
      chipEl?.click();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(chipEl?.classList.contains('chip-filter--selected')).toBe(false);
    });
  });

  // ============================================================================
  // Observed Attributes
  // ============================================================================
  
  describe('Observed Attributes', () => {
    it('should observe selected attribute', () => {
      expect(ChipFilterElement.observedAttributes).toContain('selected');
    });

    it('should observe label attribute (inherited)', () => {
      expect(ChipFilterElement.observedAttributes).toContain('label');
    });

    it('should observe icon attribute (inherited)', () => {
      expect(ChipFilterElement.observedAttributes).toContain('icon');
    });

    it('should observe test-id attribute (inherited)', () => {
      expect(ChipFilterElement.observedAttributes).toContain('test-id');
    });
  });
});
