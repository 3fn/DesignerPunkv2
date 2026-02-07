/**
 * @category evergreen
 * @purpose Verify Input-Radio-Base web component behavior: rendering, interaction, accessibility
 * @jest-environment jsdom
 */
/**
 * Input-Radio-Base Web Component Tests
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Primitive (Base)
 * 
 * Tests the Input-Radio-Base component's web component behavior:
 * - Custom element registration
 * - Size variants (sm, md, lg) render correct classes
 * - States (unselected, selected, error)
 * - Label alignment (center, top)
 * - Attribute reactivity
 * - Accessibility (ARIA attributes, keyboard interaction)
 * 
 * Following Test Development Standards:
 * - Explicit custom element registration pattern
 * - Wait for customElements.whenDefined() before tests
 * - Wait after appendChild() before querying shadow DOM
 * - Clean up DOM after each test
 * - Test behavior, NOT implementation details
 * 
 * @module Input-Radio-Base/__tests__
 * @see Requirements: 12.1, 12.4, 12.5, 12.6 in .kiro/specs/047-input-radio-base/requirements.md
 */

import { InputRadioBaseElement } from '../platforms/web/InputRadioBase.web';

describe('Input-Radio-Base Web Component', () => {
  beforeAll(() => {
    if (!customElements.get('input-radio-base')) {
      customElements.define('input-radio-base', InputRadioBaseElement);
    }
  });

  beforeEach(async () => {
    await customElements.whenDefined('input-radio-base');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // Helper to create, append, and wait for render
  async function createRadio(attrs: Record<string, string> = {}): Promise<InputRadioBaseElement> {
    const radio = document.createElement('input-radio-base') as InputRadioBaseElement;
    for (const [key, val] of Object.entries(attrs)) {
      radio.setAttribute(key, val);
    }
    document.body.appendChild(radio);
    await new Promise(resolve => setTimeout(resolve, 0));
    return radio;
  }

  // ============================================================================
  // Custom Element Registration (Requirement 12.1)
  // ============================================================================

  describe('Custom Element Registration', () => {
    it('should be registered as "input-radio-base" custom element', () => {
      const ElementClass = customElements.get('input-radio-base');
      expect(ElementClass).toBe(InputRadioBaseElement);
    });

    it('should be creatable via document.createElement', () => {
      const radio = document.createElement('input-radio-base');
      expect(radio).toBeInstanceOf(InputRadioBaseElement);
    });

    it('should be creatable via constructor', () => {
      const radio = new InputRadioBaseElement();
      expect(radio).toBeInstanceOf(InputRadioBaseElement);
    });

    it('should have correct tag name', () => {
      const radio = document.createElement('input-radio-base') as InputRadioBaseElement;
      expect(radio.tagName.toLowerCase()).toBe('input-radio-base');
    });
  });

  // ============================================================================
  // Shadow DOM Initialization
  // ============================================================================

  describe('Shadow DOM Initialization', () => {
    it('should attach shadow DOM in open mode', () => {
      const radio = new InputRadioBaseElement();
      expect(radio.shadowRoot).not.toBeNull();
      expect(radio.shadowRoot?.mode).toBe('open');
    });
  });

  // ============================================================================
  // Size Variants (Requirements 2.1-2.9, 12.6)
  // ============================================================================

  describe('Size Variants', () => {
    it('should render small size variant with correct class', async () => {
      const radio = await createRadio({ label: 'Small', value: 'sm-val', size: 'sm' });
      const wrapper = radio.shadowRoot?.querySelector('.radio');
      expect(wrapper?.classList.contains('radio--sm')).toBe(true);
    });

    it('should render medium size variant by default', async () => {
      const radio = await createRadio({ label: 'Medium', value: 'md-val' });
      const wrapper = radio.shadowRoot?.querySelector('.radio');
      expect(wrapper?.classList.contains('radio--md')).toBe(true);
    });

    it('should render large size variant with correct class', async () => {
      const radio = await createRadio({ label: 'Large', value: 'lg-val', size: 'lg' });
      const wrapper = radio.shadowRoot?.querySelector('.radio');
      expect(wrapper?.classList.contains('radio--lg')).toBe(true);
    });

    it('should default to md size when invalid size provided', async () => {
      const radio = await createRadio({ label: 'Invalid', value: 'inv', size: 'invalid' });
      expect(radio.size).toBe('md');
    });
  });

  // ============================================================================
  // Radio States (Requirements 1.1-1.5, 12.5)
  // ============================================================================

  describe('Radio States', () => {
    describe('Unselected State', () => {
      it('should render unselected by default', async () => {
        const radio = await createRadio({ label: 'Unselected', value: 'val' });
        expect(radio.selected).toBe(false);
        const wrapper = radio.shadowRoot?.querySelector('.radio');
        expect(wrapper?.classList.contains('radio--selected')).toBe(false);
      });
    });

    describe('Selected State', () => {
      it('should render selected state when selected attribute is set', async () => {
        const radio = await createRadio({ label: 'Selected', value: 'val', selected: '' });
        expect(radio.selected).toBe(true);
        const wrapper = radio.shadowRoot?.querySelector('.radio');
        expect(wrapper?.classList.contains('radio--selected')).toBe(true);
      });

      it('should have native input checked when selected', async () => {
        const radio = await createRadio({ label: 'Selected', value: 'val', selected: '' });
        const input = radio.shadowRoot?.querySelector('.radio__input') as HTMLInputElement;
        expect(input?.checked).toBe(true);
      });
    });

    describe('Error State', () => {
      it('should render error state when error-message is set', async () => {
        const radio = await createRadio({ label: 'Error', value: 'val', 'error-message': 'Required' });
        const wrapper = radio.shadowRoot?.querySelector('.radio');
        expect(wrapper?.classList.contains('radio--error')).toBe(true);
      });

      it('should display error message text', async () => {
        const radio = await createRadio({ label: 'Error', value: 'val', 'error-message': 'This field is required' });
        const errorEl = radio.shadowRoot?.querySelector('.radio__error');
        expect(errorEl?.textContent).toBe('This field is required');
      });

      it('should set aria-invalid when error is present', async () => {
        const radio = await createRadio({ label: 'Error', value: 'val', 'error-message': 'Required' });
        const input = radio.shadowRoot?.querySelector('.radio__input');
        expect(input?.getAttribute('aria-invalid')).toBe('true');
      });
    });
  });

  // ============================================================================
  // Label Alignment (Requirements 3.1-3.4)
  // ============================================================================

  describe('Label Alignment', () => {
    it('should default to center alignment', async () => {
      const radio = await createRadio({ label: 'Center', value: 'val' });
      expect(radio.labelAlign).toBe('center');
      const wrapper = radio.shadowRoot?.querySelector('.radio');
      expect(wrapper?.classList.contains('radio--align-top')).toBe(false);
    });

    it('should apply top alignment when label-align is top', async () => {
      const radio = await createRadio({ label: 'Top', value: 'val', 'label-align': 'top' });
      expect(radio.labelAlign).toBe('top');
      const wrapper = radio.shadowRoot?.querySelector('.radio');
      expect(wrapper?.classList.contains('radio--align-top')).toBe(true);
    });
  });

  // ============================================================================
  // Attribute Reactivity (Requirement 12.4)
  // ============================================================================

  describe('Attribute Reactivity', () => {
    it('should update when selected attribute changes', async () => {
      const radio = await createRadio({ label: 'Reactive', value: 'val' });
      expect(radio.selected).toBe(false);

      radio.setAttribute('selected', '');
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(radio.selected).toBe(true);
      const wrapper = radio.shadowRoot?.querySelector('.radio');
      expect(wrapper?.classList.contains('radio--selected')).toBe(true);
    });

    it('should update when size attribute changes', async () => {
      const radio = await createRadio({ label: 'Reactive', value: 'val', size: 'sm' });
      let wrapper = radio.shadowRoot?.querySelector('.radio');
      expect(wrapper?.classList.contains('radio--sm')).toBe(true);

      radio.setAttribute('size', 'lg');
      await new Promise(resolve => setTimeout(resolve, 0));

      wrapper = radio.shadowRoot?.querySelector('.radio');
      expect(wrapper?.classList.contains('radio--lg')).toBe(true);
    });

    it('should update when label attribute changes', async () => {
      const radio = await createRadio({ label: 'Original', value: 'val' });
      let label = radio.shadowRoot?.querySelector('.radio__label');
      expect(label?.textContent).toBe('Original');

      radio.setAttribute('label', 'Updated');
      await new Promise(resolve => setTimeout(resolve, 0));

      label = radio.shadowRoot?.querySelector('.radio__label');
      expect(label?.textContent).toBe('Updated');
    });

    it('should update via property setters', async () => {
      const radio = document.createElement('input-radio-base') as InputRadioBaseElement;
      radio.label = 'Property Label';
      radio.value = 'prop-val';
      radio.size = 'lg';
      document.body.appendChild(radio);
      await new Promise(resolve => setTimeout(resolve, 0));

      const label = radio.shadowRoot?.querySelector('.radio__label');
      expect(label?.textContent).toBe('Property Label');

      const wrapper = radio.shadowRoot?.querySelector('.radio');
      expect(wrapper?.classList.contains('radio--lg')).toBe(true);
    });
  });

  // ============================================================================
  // Helper Text (Requirements 5.1, 5.6)
  // ============================================================================

  describe('Helper Text', () => {
    it('should display helper text when provided', async () => {
      const radio = await createRadio({ label: 'With helper', value: 'val', 'helper-text': 'Helpful info' });
      const helper = radio.shadowRoot?.querySelector('.radio__helper');
      expect(helper?.textContent).toBe('Helpful info');
    });

    it('should associate helper text via aria-describedby', async () => {
      const radio = await createRadio({ label: 'With helper', value: 'val', 'helper-text': 'Helper' });
      const input = radio.shadowRoot?.querySelector('.radio__input');
      const helper = radio.shadowRoot?.querySelector('.radio__helper');
      const describedBy = input?.getAttribute('aria-describedby');
      expect(describedBy).toContain(helper?.id);
    });
  });

  // ============================================================================
  // Accessibility - ARIA Attributes (Requirement 12.5)
  // ============================================================================

  describe('Accessibility - ARIA Attributes', () => {
    it('should have aria-checked="false" when unselected', async () => {
      const radio = await createRadio({ label: 'Accessible', value: 'val' });
      const input = radio.shadowRoot?.querySelector('.radio__input');
      expect(input?.getAttribute('aria-checked')).toBe('false');
    });

    it('should have aria-checked="true" when selected', async () => {
      const radio = await createRadio({ label: 'Accessible', value: 'val', selected: '' });
      const input = radio.shadowRoot?.querySelector('.radio__input');
      expect(input?.getAttribute('aria-checked')).toBe('true');
    });

    it('should associate label with input via aria-labelledby', async () => {
      const radio = await createRadio({ label: 'Accessible', value: 'val' });
      const input = radio.shadowRoot?.querySelector('.radio__input');
      const label = radio.shadowRoot?.querySelector('.radio__label');
      const labelledBy = input?.getAttribute('aria-labelledby');
      expect(labelledBy).toBe(label?.id);
    });

    it('should associate error message via aria-describedby', async () => {
      const radio = await createRadio({ label: 'Accessible', value: 'val', 'error-message': 'Error' });
      const input = radio.shadowRoot?.querySelector('.radio__input');
      const error = radio.shadowRoot?.querySelector('.radio__error');
      const describedBy = input?.getAttribute('aria-describedby');
      expect(describedBy).toContain(error?.id);
    });

    it('should have role="alert" on error message', async () => {
      const radio = await createRadio({ label: 'Accessible', value: 'val', 'error-message': 'Error' });
      const error = radio.shadowRoot?.querySelector('.radio__error');
      expect(error?.getAttribute('role')).toBe('alert');
    });

    it('should have native radio input type', async () => {
      const radio = await createRadio({ label: 'Accessible', value: 'val' });
      const input = radio.shadowRoot?.querySelector('.radio__input');
      expect(input?.getAttribute('type')).toBe('radio');
    });
  });

  // ============================================================================
  // Select Callback and Events
  // ============================================================================

  describe('Select Callback and Events', () => {
    it('should call onSelect when radio is clicked', async () => {
      const onSelect = jest.fn();
      const radio = document.createElement('input-radio-base') as InputRadioBaseElement;
      radio.setAttribute('label', 'Clickable');
      radio.setAttribute('value', 'click-val');
      radio.onSelect = onSelect;
      document.body.appendChild(radio);
      await new Promise(resolve => setTimeout(resolve, 0));

      const input = radio.shadowRoot?.querySelector('.radio__input') as HTMLInputElement;
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));

      expect(onSelect).toHaveBeenCalledWith('click-val');
    });

    it('should dispatch select event when toggled', async () => {
      const radio = await createRadio({ label: 'Clickable', value: 'event-val' });
      const selectHandler = jest.fn();
      radio.addEventListener('select', selectHandler);

      const input = radio.shadowRoot?.querySelector('.radio__input') as HTMLInputElement;
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));

      expect(selectHandler).toHaveBeenCalledTimes(1);
      expect(selectHandler.mock.calls[0][0].detail.value).toBe('event-val');
    });

    it('should not throw when clicked without onSelect callback', async () => {
      const radio = await createRadio({ label: 'No Callback', value: 'val' });
      const input = radio.shadowRoot?.querySelector('.radio__input') as HTMLInputElement;
      expect(() => {
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }).not.toThrow();
    });
  });

  // ============================================================================
  // Test ID
  // ============================================================================

  describe('Test ID', () => {
    it('should apply data-testid attribute', async () => {
      const radio = await createRadio({ label: 'Test', value: 'val', 'test-id': 'my-radio' });
      const wrapper = radio.shadowRoot?.querySelector('.radio');
      expect(wrapper?.getAttribute('data-testid')).toBe('my-radio');
    });

    it('should update data-testid when attribute changes', async () => {
      const radio = await createRadio({ label: 'Test', value: 'val', 'test-id': 'original-id' });
      let wrapper = radio.shadowRoot?.querySelector('.radio');
      expect(wrapper?.getAttribute('data-testid')).toBe('original-id');

      radio.setAttribute('test-id', 'updated-id');
      await new Promise(resolve => setTimeout(resolve, 0));

      wrapper = radio.shadowRoot?.querySelector('.radio');
      expect(wrapper?.getAttribute('data-testid')).toBe('updated-id');
    });
  });

  // ============================================================================
  // Observed Attributes
  // ============================================================================

  describe('Observed Attributes', () => {
    it('should observe selected attribute', () => {
      expect(InputRadioBaseElement.observedAttributes).toContain('selected');
    });

    it('should observe label attribute', () => {
      expect(InputRadioBaseElement.observedAttributes).toContain('label');
    });

    it('should observe value attribute', () => {
      expect(InputRadioBaseElement.observedAttributes).toContain('value');
    });

    it('should observe name attribute', () => {
      expect(InputRadioBaseElement.observedAttributes).toContain('name');
    });

    it('should observe size attribute', () => {
      expect(InputRadioBaseElement.observedAttributes).toContain('size');
    });

    it('should observe label-align attribute', () => {
      expect(InputRadioBaseElement.observedAttributes).toContain('label-align');
    });

    it('should observe helper-text attribute', () => {
      expect(InputRadioBaseElement.observedAttributes).toContain('helper-text');
    });

    it('should observe error-message attribute', () => {
      expect(InputRadioBaseElement.observedAttributes).toContain('error-message');
    });

    it('should observe test-id attribute', () => {
      expect(InputRadioBaseElement.observedAttributes).toContain('test-id');
    });
  });
});
