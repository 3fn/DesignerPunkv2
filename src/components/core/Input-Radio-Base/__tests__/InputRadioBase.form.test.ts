/**
 * @category evergreen
 * @purpose Verify Input-Radio-Base form integration: name, value, and form submission
 * @jest-environment jsdom
 */
/**
 * Input-Radio-Base Form Integration Tests
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Primitive (Base)
 * 
 * Tests the Input-Radio-Base component's form integration:
 * - Name attribute for radio grouping
 * - Value attribute for form submission
 * - Form submission includes radio value when selected
 * - Form reset behavior
 * 
 * @module Input-Radio-Base/__tests__/form
 * @see Requirements: 8.7, 8.8, 8.9 in .kiro/specs/047-input-radio-base/requirements.md
 */

import { InputRadioBaseElement } from '../platforms/web/InputRadioBase.web';

describe('Input-Radio-Base Form Integration', () => {
  beforeAll(() => {
    // Ensure custom element is registered
    if (!customElements.get('input-radio-base')) {
      customElements.define('input-radio-base', InputRadioBaseElement);
    }
  });

  beforeEach(async () => {
    // Wait for custom element to be defined
    await customElements.whenDefined('input-radio-base');
  });

  afterEach(() => {
    // Clean up any created elements
    document.body.innerHTML = '';
  });

  // ============================================================================
  // Name Attribute (Requirement 8.8)
  // ============================================================================

  describe('Name Attribute', () => {
    /**
     * @see Requirement 8.8 - Name attribute for radio grouping
     */
    it('should include name attribute on native input', async () => {
      const radio = document.createElement('input-radio-base') as InputRadioBaseElement;
      radio.setAttribute('label', 'Option A');
      radio.setAttribute('value', 'option-a');
      radio.setAttribute('name', 'my-group');
      document.body.appendChild(radio);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = radio.shadowRoot?.querySelector('.radio__input');
      expect(input?.getAttribute('name')).toBe('my-group');
    });

    it('should reflect name property to attribute', async () => {
      const radio = document.createElement('input-radio-base') as InputRadioBaseElement;
      radio.setAttribute('label', 'Option A');
      radio.setAttribute('value', 'option-a');
      radio.name = 'test-group';
      document.body.appendChild(radio);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(radio.getAttribute('name')).toBe('test-group');
    });

    it('should update native input when name changes', async () => {
      const radio = document.createElement('input-radio-base') as InputRadioBaseElement;
      radio.setAttribute('label', 'Option A');
      radio.setAttribute('value', 'option-a');
      radio.setAttribute('name', 'initial-group');
      document.body.appendChild(radio);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      radio.setAttribute('name', 'updated-group');
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = radio.shadowRoot?.querySelector('.radio__input');
      expect(input?.getAttribute('name')).toBe('updated-group');
    });
  });

  // ============================================================================
  // Value Attribute (Requirement 8.9)
  // ============================================================================

  describe('Value Attribute', () => {
    /**
     * @see Requirement 8.9 - Value attribute for form submission value
     */
    it('should include value attribute on native input', async () => {
      const radio = document.createElement('input-radio-base') as InputRadioBaseElement;
      radio.setAttribute('label', 'Option A');
      radio.setAttribute('value', 'option-a');
      document.body.appendChild(radio);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = radio.shadowRoot?.querySelector('.radio__input');
      expect(input?.getAttribute('value')).toBe('option-a');
    });

    it('should reflect value property to attribute', async () => {
      const radio = document.createElement('input-radio-base') as InputRadioBaseElement;
      radio.setAttribute('label', 'Option A');
      radio.value = 'test-value';
      document.body.appendChild(radio);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(radio.getAttribute('value')).toBe('test-value');
    });

    it('should update native input when value changes', async () => {
      const radio = document.createElement('input-radio-base') as InputRadioBaseElement;
      radio.setAttribute('label', 'Option A');
      radio.setAttribute('value', 'initial-value');
      document.body.appendChild(radio);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      radio.setAttribute('value', 'updated-value');
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = radio.shadowRoot?.querySelector('.radio__input');
      expect(input?.getAttribute('value')).toBe('updated-value');
    });
  });

  // ============================================================================
  // Form Submission (Requirement 8.7)
  // ============================================================================

  describe('Form Submission', () => {
    /**
     * Note: JSDOM doesn't fully support ElementInternals.setFormValue(),
     * so we can't test actual FormData submission in this environment.
     * These tests verify the native input has correct attributes for form submission.
     * 
     * In real browsers, the Form-Associated Custom Elements API (ElementInternals)
     * enables the component to participate in form submission via FormData.
     * 
     * @see Requirement 8.7 - Form submission includes radio value when selected
     */
    it('should have native input with correct name and value for form submission', async () => {
      const form = document.createElement('form');
      const radio = document.createElement('input-radio-base') as InputRadioBaseElement;
      radio.setAttribute('label', 'Option A');
      radio.setAttribute('value', 'option-a');
      radio.setAttribute('name', 'choice');
      radio.setAttribute('selected', '');
      form.appendChild(radio);
      document.body.appendChild(form);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify native input has correct attributes for form submission
      const input = radio.shadowRoot?.querySelector('.radio__input') as HTMLInputElement;
      expect(input?.getAttribute('name')).toBe('choice');
      expect(input?.getAttribute('value')).toBe('option-a');
      expect(input?.checked).toBe(true);
    });

    it('should have native input unchecked when not selected', async () => {
      const form = document.createElement('form');
      const radio = document.createElement('input-radio-base') as InputRadioBaseElement;
      radio.setAttribute('label', 'Option A');
      radio.setAttribute('value', 'option-a');
      radio.setAttribute('name', 'choice');
      // Not selected
      form.appendChild(radio);
      document.body.appendChild(form);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = radio.shadowRoot?.querySelector('.radio__input') as HTMLInputElement;
      expect(input?.checked).toBe(false);
    });

    it('should update native input checked state when selection changes', async () => {
      const form = document.createElement('form');
      const radio = document.createElement('input-radio-base') as InputRadioBaseElement;
      radio.setAttribute('label', 'Option A');
      radio.setAttribute('value', 'option-a');
      radio.setAttribute('name', 'choice');
      form.appendChild(radio);
      document.body.appendChild(form);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Initially not selected
      let input = radio.shadowRoot?.querySelector('.radio__input') as HTMLInputElement;
      expect(input?.checked).toBe(false);
      
      // Select the radio
      radio.setAttribute('selected', '');
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Now should be checked
      input = radio.shadowRoot?.querySelector('.radio__input') as HTMLInputElement;
      expect(input?.checked).toBe(true);
    });
  });

  // ============================================================================
  // Form Reset
  // ============================================================================

  describe('Form Reset', () => {
    it('should reset to unselected on form reset', async () => {
      const form = document.createElement('form');
      const radio = document.createElement('input-radio-base') as InputRadioBaseElement;
      radio.setAttribute('label', 'Option A');
      radio.setAttribute('value', 'option-a');
      radio.setAttribute('selected', '');
      form.appendChild(radio);
      document.body.appendChild(form);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(radio.selected).toBe(true);
      
      form.reset();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(radio.selected).toBe(false);
    });

    it('should have native input unchecked after form reset', async () => {
      const form = document.createElement('form');
      const radio = document.createElement('input-radio-base') as InputRadioBaseElement;
      radio.setAttribute('label', 'Option A');
      radio.setAttribute('value', 'option-a');
      radio.setAttribute('name', 'choice');
      radio.setAttribute('selected', '');
      form.appendChild(radio);
      document.body.appendChild(form);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Initially selected
      let input = radio.shadowRoot?.querySelector('.radio__input') as HTMLInputElement;
      expect(input?.checked).toBe(true);
      
      // Reset form
      form.reset();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Should be unchecked after reset
      input = radio.shadowRoot?.querySelector('.radio__input') as HTMLInputElement;
      expect(input?.checked).toBe(false);
    });
  });
});
