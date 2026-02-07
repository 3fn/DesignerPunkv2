/**
 * @category evergreen
 * @purpose Verify Input-Radio-Set web component behavior: orchestration, mutual exclusivity, keyboard nav, validation, accessibility
 * @jest-environment jsdom
 */
/**
 * Input-Radio-Set Web Component Tests
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Pattern (Set)
 * 
 * Tests the Input-Radio-Set component's web component behavior:
 * - Custom element registration
 * - Orchestration pattern (Set does not duplicate Base rendering)
 * - Mutual exclusivity (selecting one deselects others)
 * - Keyboard navigation (arrow keys, Tab, Space, Home, End)
 * - Validation (required, error display)
 * - Accessibility (radiogroup role, error announcement)
 * 
 * Following Test Development Standards:
 * - Explicit custom element registration pattern
 * - Wait for customElements.whenDefined() before tests
 * - Wait after appendChild() before querying shadow DOM
 * - Clean up DOM after each test
 * - Test behavior, NOT implementation details
 * 
 * @module Input-Radio-Set/__tests__
 * @see Requirements: 12.7, 12.8 in .kiro/specs/047-input-radio-base/requirements.md
 */

import { InputRadioSetElement } from '../platforms/web/InputRadioSet.web';
import { InputRadioBaseElement } from '../../Input-Radio-Base/platforms/web/InputRadioBase.web';

describe('Input-Radio-Set Web Component', () => {
  beforeAll(() => {
    if (!customElements.get('input-radio-base')) {
      customElements.define('input-radio-base', InputRadioBaseElement);
    }
    if (!customElements.get('input-radio-set')) {
      customElements.define('input-radio-set', InputRadioSetElement);
    }
  });

  beforeEach(async () => {
    await customElements.whenDefined('input-radio-set');
    await customElements.whenDefined('input-radio-base');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // Helper to create a radio set with child radios
  async function createRadioSet(
    setAttrs: Record<string, string> = {},
    options: Array<{ label: string; value: string }> = [
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' },
      { label: 'Option C', value: 'c' }
    ]
  ): Promise<InputRadioSetElement> {
    const set = document.createElement('input-radio-set') as InputRadioSetElement;
    for (const [key, val] of Object.entries(setAttrs)) {
      set.setAttribute(key, val);
    }
    for (const opt of options) {
      const radio = document.createElement('input-radio-base');
      radio.setAttribute('label', opt.label);
      radio.setAttribute('value', opt.value);
      set.appendChild(radio);
    }
    document.body.appendChild(set);
    await new Promise(resolve => setTimeout(resolve, 0));
    return set;
  }

  // ============================================================================
  // Custom Element Registration (Requirement 12.7)
  // ============================================================================

  describe('Custom Element Registration', () => {
    it('should be registered as "input-radio-set" custom element', () => {
      const ElementClass = customElements.get('input-radio-set');
      expect(ElementClass).toBe(InputRadioSetElement);
    });

    it('should be creatable via document.createElement', () => {
      const set = document.createElement('input-radio-set');
      expect(set).toBeInstanceOf(InputRadioSetElement);
    });

    it('should have correct tag name', () => {
      const set = document.createElement('input-radio-set') as InputRadioSetElement;
      expect(set.tagName.toLowerCase()).toBe('input-radio-set');
    });

    it('should attach shadow DOM in open mode', () => {
      const set = new InputRadioSetElement();
      expect(set.shadowRoot).not.toBeNull();
      expect(set.shadowRoot?.mode).toBe('open');
    });
  });

  // ============================================================================
  // Orchestration Pattern (Requirement 12.8)
  // ============================================================================

  describe('Orchestration Pattern', () => {
    it('should use slot-based composition for child radios', async () => {
      const set = await createRadioSet();
      const slot = set.shadowRoot?.querySelector('slot');
      expect(slot).not.toBeNull();
    });

    it('should NOT contain radio circle/dot rendering in its shadow DOM', async () => {
      const set = await createRadioSet();
      // Set should NOT have any radio__circle or radio__dot elements
      const circle = set.shadowRoot?.querySelector('.radio__circle');
      const dot = set.shadowRoot?.querySelector('.radio__dot');
      expect(circle).toBeNull();
      expect(dot).toBeNull();
    });

    it('should render child Input-Radio-Base elements in light DOM', async () => {
      const set = await createRadioSet();
      const children = set.querySelectorAll('input-radio-base');
      expect(children.length).toBe(3);
    });
  });

  // ============================================================================
  // Mutual Exclusivity (Requirements 9.3, 9.5, 9.6)
  // ============================================================================

  describe('Mutual Exclusivity', () => {
    it('should set selected attribute on matching child when selectedValue is set', async () => {
      const set = await createRadioSet({ 'selected-value': 'b' });
      const children = set.querySelectorAll('input-radio-base');
      expect(children[0].hasAttribute('selected')).toBe(false);
      expect(children[1].hasAttribute('selected')).toBe(true);
      expect(children[2].hasAttribute('selected')).toBe(false);
    });

    it('should update selection when selectedValue changes', async () => {
      const set = await createRadioSet({ 'selected-value': 'a' });
      const children = set.querySelectorAll('input-radio-base');
      expect(children[0].hasAttribute('selected')).toBe(true);

      set.setAttribute('selected-value', 'c');
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(children[0].hasAttribute('selected')).toBe(false);
      expect(children[2].hasAttribute('selected')).toBe(true);
    });

    it('should deselect previous radio when a new one is selected via event', async () => {
      const set = await createRadioSet({ 'selected-value': 'a' });
      const children = set.querySelectorAll('input-radio-base');

      // Simulate child radio dispatching a select event (as Input-Radio-Base does)
      children[1].dispatchEvent(
        new CustomEvent('select', {
          detail: { value: 'b', selected: true },
          bubbles: true,
          composed: true
        })
      );
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(set.selectedValue).toBe('b');
      expect(children[0].hasAttribute('selected')).toBe(false);
      expect(children[1].hasAttribute('selected')).toBe(true);
    });

    it('should call onSelectionChange when selection changes', async () => {
      const onSelectionChange = jest.fn();
      const set = await createRadioSet({ 'selected-value': 'a' });
      set.onSelectionChange = onSelectionChange;

      const radios = set.querySelectorAll('input-radio-base');
      radios[1].dispatchEvent(
        new CustomEvent('select', {
          detail: { value: 'b', selected: true },
          bubbles: true,
          composed: true
        })
      );

      expect(onSelectionChange).toHaveBeenCalledWith('b');
    });

    it('should not deselect when clicking already-selected radio', async () => {
      const onSelectionChange = jest.fn();
      const set = await createRadioSet({ 'selected-value': 'a' });
      set.onSelectionChange = onSelectionChange;

      const radios = set.querySelectorAll('input-radio-base');
      // Click the already-selected radio
      radios[0].dispatchEvent(
        new CustomEvent('select', {
          detail: { value: 'a', selected: true },
          bubbles: true,
          composed: true
        })
      );

      // Should still be selected, callback should NOT fire
      expect(set.selectedValue).toBe('a');
      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });


  // ============================================================================
  // Keyboard Navigation (Requirements 10.1-10.9)
  // ============================================================================

  describe('Keyboard Navigation', () => {
    it('should move focus to next radio on ArrowDown', async () => {
      const set = await createRadioSet({ 'selected-value': 'a' });
      const radios = set.querySelectorAll('input-radio-base');

      // Focus the first radio
      (radios[0] as HTMLElement).focus();
      await new Promise(resolve => setTimeout(resolve, 0));

      // Press ArrowDown
      set.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 0));

      // Second radio should have tabindex="0"
      expect(radios[1].getAttribute('tabindex')).toBe('0');
      expect(radios[0].getAttribute('tabindex')).toBe('-1');
    });

    it('should move focus to next radio on ArrowRight', async () => {
      const set = await createRadioSet({ 'selected-value': 'a' });
      const radios = set.querySelectorAll('input-radio-base');

      (radios[0] as HTMLElement).focus();
      await new Promise(resolve => setTimeout(resolve, 0));

      set.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(radios[1].getAttribute('tabindex')).toBe('0');
    });

    it('should move focus to previous radio on ArrowUp', async () => {
      const set = await createRadioSet({ 'selected-value': 'b' });
      const radios = set.querySelectorAll('input-radio-base');

      (radios[1] as HTMLElement).focus();
      await new Promise(resolve => setTimeout(resolve, 0));

      set.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(radios[0].getAttribute('tabindex')).toBe('0');
      expect(radios[1].getAttribute('tabindex')).toBe('-1');
    });

    it('should wrap from last to first on ArrowDown', async () => {
      const set = await createRadioSet({ 'selected-value': 'c' });
      const radios = set.querySelectorAll('input-radio-base');

      (radios[2] as HTMLElement).focus();
      await new Promise(resolve => setTimeout(resolve, 0));

      set.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(radios[0].getAttribute('tabindex')).toBe('0');
      expect(radios[2].getAttribute('tabindex')).toBe('-1');
    });

    it('should wrap from first to last on ArrowUp', async () => {
      const set = await createRadioSet({ 'selected-value': 'a' });
      const radios = set.querySelectorAll('input-radio-base');

      (radios[0] as HTMLElement).focus();
      await new Promise(resolve => setTimeout(resolve, 0));

      set.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(radios[2].getAttribute('tabindex')).toBe('0');
      expect(radios[0].getAttribute('tabindex')).toBe('-1');
    });

    it('should select focused radio on Space', async () => {
      const set = await createRadioSet({ 'selected-value': 'a' });
      const radios = set.querySelectorAll('input-radio-base');

      // Move focus to second radio
      (radios[0] as HTMLElement).focus();
      await new Promise(resolve => setTimeout(resolve, 0));
      set.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 0));

      // Press Space to select
      set.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(set.selectedValue).toBe('b');
    });

    it('should move focus to first radio on Home', async () => {
      const set = await createRadioSet({ 'selected-value': 'c' });
      const radios = set.querySelectorAll('input-radio-base');

      (radios[2] as HTMLElement).focus();
      await new Promise(resolve => setTimeout(resolve, 0));

      set.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(radios[0].getAttribute('tabindex')).toBe('0');
      expect(radios[2].getAttribute('tabindex')).toBe('-1');
    });

    it('should move focus to last radio on End', async () => {
      const set = await createRadioSet({ 'selected-value': 'a' });
      const radios = set.querySelectorAll('input-radio-base');

      (radios[0] as HTMLElement).focus();
      await new Promise(resolve => setTimeout(resolve, 0));

      set.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(radios[2].getAttribute('tabindex')).toBe('0');
      expect(radios[0].getAttribute('tabindex')).toBe('-1');
    });

    it('should initialize tabindex on selected radio', async () => {
      const set = await createRadioSet({ 'selected-value': 'b' });
      const radios = set.querySelectorAll('input-radio-base');

      expect(radios[0].getAttribute('tabindex')).toBe('-1');
      expect(radios[1].getAttribute('tabindex')).toBe('0');
      expect(radios[2].getAttribute('tabindex')).toBe('-1');
    });

    it('should initialize tabindex on first radio when none selected', async () => {
      const set = await createRadioSet();
      const radios = set.querySelectorAll('input-radio-base');

      expect(radios[0].getAttribute('tabindex')).toBe('0');
      expect(radios[1].getAttribute('tabindex')).toBe('-1');
      expect(radios[2].getAttribute('tabindex')).toBe('-1');
    });
  });

  // ============================================================================
  // Validation (Requirements 9.7, 9.8, 9.9)
  // ============================================================================

  describe('Validation', () => {
    it('should fail validation when required and no selection', async () => {
      const set = await createRadioSet({ required: '' });
      const result = set.validate();
      expect(result).toBe(false);
      expect(set.error).toBe(true);
    });

    it('should pass validation when required and selection exists', async () => {
      const set = await createRadioSet({ required: '', 'selected-value': 'a' });
      const result = set.validate();
      expect(result).toBe(true);
    });

    it('should set default error message on validation failure', async () => {
      const set = await createRadioSet({ required: '' });
      set.validate();
      expect(set.errorMessage).toBe('Please select an option');
    });

    it('should display error message when error is true', async () => {
      const set = await createRadioSet({ error: '', 'error-message': 'Selection required' });
      const errorEl = set.shadowRoot?.querySelector('.radio-set__error');
      expect(errorEl?.textContent).toBe('Selection required');
    });

    it('should hide error message when error is false', async () => {
      const set = await createRadioSet();
      const errorEl = set.shadowRoot?.querySelector('.radio-set__error');
      expect(errorEl?.textContent).toBe('');
    });

    it('should clear error state when valid selection is made after validation failure', async () => {
      const set = await createRadioSet({ required: '' });
      set.validate();
      expect(set.error).toBe(true);

      set.selectedValue = 'a';
      const result = set.validate();
      expect(result).toBe(true);
      expect(set.error).toBe(false);
    });

    it('should report validity via checkValidity without modifying state', async () => {
      const set = await createRadioSet({ required: '' });
      const result = set.checkValidity();
      expect(result).toBe(false);
      // checkValidity should NOT set error attributes
      expect(set.error).toBe(false);
    });
  });

  // ============================================================================
  // Accessibility (Requirements 9.2, 9.9)
  // ============================================================================

  describe('Accessibility', () => {
    it('should have role="radiogroup" on container', async () => {
      const set = await createRadioSet();
      const container = set.shadowRoot?.querySelector('.radio-set');
      expect(container?.getAttribute('role')).toBe('radiogroup');
    });

    it('should have role="alert" on error message element', async () => {
      const set = await createRadioSet({ error: '', 'error-message': 'Error' });
      const errorEl = set.shadowRoot?.querySelector('.radio-set__error');
      expect(errorEl?.getAttribute('role')).toBe('alert');
    });

    it('should associate error message via aria-describedby when error is active', async () => {
      const set = await createRadioSet({ error: '', 'error-message': 'Error' });
      const container = set.shadowRoot?.querySelector('.radio-set');
      const errorEl = set.shadowRoot?.querySelector('.radio-set__error');
      expect(container?.getAttribute('aria-describedby')).toBe(errorEl?.id);
    });

    it('should not have aria-describedby when no error', async () => {
      const set = await createRadioSet();
      const container = set.shadowRoot?.querySelector('.radio-set');
      expect(container?.hasAttribute('aria-describedby')).toBe(false);
    });
  });

  // ============================================================================
  // Size Propagation (Requirement 9.10)
  // ============================================================================

  describe('Size Propagation', () => {
    it('should propagate size to child radios', async () => {
      const set = await createRadioSet({ size: 'lg' });
      const radios = Array.from(set.querySelectorAll('input-radio-base'));
      for (const radio of radios) {
        expect(radio.getAttribute('size')).toBe('lg');
      }
    });

    it('should update child sizes when size attribute changes', async () => {
      const set = await createRadioSet({ size: 'sm' });
      const radios = Array.from(set.querySelectorAll('input-radio-base'));
      expect(radios[0].getAttribute('size')).toBe('sm');

      set.setAttribute('size', 'lg');
      await new Promise(resolve => setTimeout(resolve, 0));

      for (const radio of radios) {
        expect(radio.getAttribute('size')).toBe('lg');
      }
    });
  });

  // ============================================================================
  // Observed Attributes
  // ============================================================================

  describe('Observed Attributes', () => {
    it('should observe selected-value attribute', () => {
      expect(InputRadioSetElement.observedAttributes).toContain('selected-value');
    });

    it('should observe required attribute', () => {
      expect(InputRadioSetElement.observedAttributes).toContain('required');
    });

    it('should observe error attribute', () => {
      expect(InputRadioSetElement.observedAttributes).toContain('error');
    });

    it('should observe error-message attribute', () => {
      expect(InputRadioSetElement.observedAttributes).toContain('error-message');
    });

    it('should observe size attribute', () => {
      expect(InputRadioSetElement.observedAttributes).toContain('size');
    });

    it('should observe test-id attribute', () => {
      expect(InputRadioSetElement.observedAttributes).toContain('test-id');
    });
  });
});
