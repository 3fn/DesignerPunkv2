/**
 * @category evergreen
 * @purpose Verify Input-Checkbox-Base web component behavior: rendering, interaction, accessibility
 * @jest-environment jsdom
 */
/**
 * Input-Checkbox-Base Web Component Tests
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Primitive (Base)
 * 
 * Tests the Input-Checkbox-Base component's web component behavior:
 * - Custom element registration
 * - Size variants (sm, md, lg) render correct dimensions
 * - States (unchecked, checked, indeterminate, error)
 * - Attribute reactivity
 * - Form submission and reset
 * - Accessibility (ARIA attributes, keyboard navigation)
 * 
 * Following Test Development Standards:
 * - Explicit custom element registration pattern
 * - Wait for customElements.whenDefined() before tests
 * - Wait after appendChild() before querying shadow DOM
 * - Clean up DOM after each test
 * - Test behavior, NOT implementation details
 * 
 * @module Input-Checkbox-Base/__tests__
 * @see Requirements: 11.1-11.6 in .kiro/specs/046-input-checkbox-base/requirements.md
 */

import { InputCheckboxBaseElement } from '../platforms/web/InputCheckboxBase.web';
import { IconBaseElement } from '../../Icon-Base/platforms/web/IconBase.web';

describe('Input-Checkbox-Base Web Component', () => {
  beforeAll(() => {
    // Ensure custom elements are registered
    if (!customElements.get('icon-base')) {
      customElements.define('icon-base', IconBaseElement);
    }
    if (!customElements.get('input-checkbox-base')) {
      customElements.define('input-checkbox-base', InputCheckboxBaseElement);
    }
  });

  beforeEach(async () => {
    // Wait for custom elements to be defined
    await customElements.whenDefined('input-checkbox-base');
    await customElements.whenDefined('icon-base');
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
     * @see Requirements: 8.1 - Register as <input-checkbox-base> custom element
     * @see Requirements: 11.4 - Test custom element registration
     */
    it('should be registered as "input-checkbox-base" custom element', () => {
      const ElementClass = customElements.get('input-checkbox-base');
      expect(ElementClass).toBe(InputCheckboxBaseElement);
    });

    it('should be creatable via document.createElement', () => {
      const checkbox = document.createElement('input-checkbox-base');
      expect(checkbox).toBeInstanceOf(InputCheckboxBaseElement);
    });

    it('should be creatable via constructor', () => {
      const checkbox = new InputCheckboxBaseElement();
      expect(checkbox).toBeInstanceOf(InputCheckboxBaseElement);
    });

    it('should have correct tag name', () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      expect(checkbox.tagName.toLowerCase()).toBe('input-checkbox-base');
    });
  });

  // ============================================================================
  // Shadow DOM Initialization
  // ============================================================================
  
  describe('Shadow DOM Initialization', () => {
    it('should attach shadow DOM in constructor', () => {
      const checkbox = new InputCheckboxBaseElement();
      expect(checkbox.shadowRoot).toBeTruthy();
    });

    it('should attach shadow DOM in open mode', () => {
      const checkbox = new InputCheckboxBaseElement();
      expect(checkbox.shadowRoot).not.toBeNull();
      expect(checkbox.shadowRoot?.mode).toBe('open');
    });
  });

  // ============================================================================
  // Size Variants
  // ============================================================================
  
  describe('Size Variants', () => {
    /**
     * @see Requirements: 2.1-2.9 - Size variants (sm, md, lg)
     * @see Requirements: 11.6 - Test all three size variants
     */
    it('should render small size variant with correct class', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Small checkbox');
      checkbox.setAttribute('size', 'sm');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const wrapper = checkbox.shadowRoot?.querySelector('.checkbox');
      expect(wrapper?.classList.contains('checkbox--sm')).toBe(true);
    });

    it('should render medium size variant by default', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Medium checkbox');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const wrapper = checkbox.shadowRoot?.querySelector('.checkbox');
      expect(wrapper?.classList.contains('checkbox--md')).toBe(true);
    });

    it('should render large size variant with correct class', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Large checkbox');
      checkbox.setAttribute('size', 'lg');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const wrapper = checkbox.shadowRoot?.querySelector('.checkbox');
      expect(wrapper?.classList.contains('checkbox--lg')).toBe(true);
    });

    it('should default to md size when invalid size provided', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Invalid size');
      checkbox.setAttribute('size', 'invalid');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(checkbox.size).toBe('md');
    });
  });

  // ============================================================================
  // Checkbox States
  // ============================================================================
  
  describe('Checkbox States', () => {
    /**
     * @see Requirements: 1.1-1.7 - Checkbox states
     * @see Requirements: 11.5 - Test all states
     */
    describe('Unchecked State', () => {
      it('should render unchecked by default', async () => {
        const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
        checkbox.setAttribute('label', 'Unchecked');
        document.body.appendChild(checkbox);
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        expect(checkbox.checked).toBe(false);
        const wrapper = checkbox.shadowRoot?.querySelector('.checkbox');
        expect(wrapper?.classList.contains('checkbox--checked')).toBe(false);
      });

      it('should not render icon when unchecked', async () => {
        const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
        checkbox.setAttribute('label', 'Unchecked');
        document.body.appendChild(checkbox);
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const icon = checkbox.shadowRoot?.querySelector('.checkbox__box svg.icon-base');
        expect(icon).toBeNull();
      });
    });

    describe('Checked State', () => {
      it('should render checked state when checked attribute is set', async () => {
        const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
        checkbox.setAttribute('label', 'Checked');
        checkbox.setAttribute('checked', '');
        document.body.appendChild(checkbox);
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        expect(checkbox.checked).toBe(true);
        const wrapper = checkbox.shadowRoot?.querySelector('.checkbox');
        expect(wrapper?.classList.contains('checkbox--checked')).toBe(true);
      });

      it('should render check icon when checked', async () => {
        const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
        checkbox.setAttribute('label', 'Checked');
        checkbox.setAttribute('checked', '');
        document.body.appendChild(checkbox);
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // createIconBase returns an SVG element with class 'icon-base icon-base-check'
        const icon = checkbox.shadowRoot?.querySelector('.checkbox__box svg.icon-base');
        expect(icon).toBeTruthy();
        expect(icon?.classList.contains('icon-base-check')).toBe(true);
      });
    });

    describe('Indeterminate State', () => {
      it('should render indeterminate state when attribute is set', async () => {
        const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
        checkbox.setAttribute('label', 'Indeterminate');
        checkbox.setAttribute('indeterminate', '');
        document.body.appendChild(checkbox);
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        expect(checkbox.indeterminate).toBe(true);
        const wrapper = checkbox.shadowRoot?.querySelector('.checkbox');
        expect(wrapper?.classList.contains('checkbox--indeterminate')).toBe(true);
      });

      it('should render minus icon when indeterminate', async () => {
        const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
        checkbox.setAttribute('label', 'Indeterminate');
        checkbox.setAttribute('indeterminate', '');
        document.body.appendChild(checkbox);
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // createIconBase returns an SVG element with class 'icon-base icon-base-minus'
        const icon = checkbox.shadowRoot?.querySelector('.checkbox__box svg.icon-base');
        expect(icon).toBeTruthy();
        expect(icon?.classList.contains('icon-base-minus')).toBe(true);
      });
    });

    describe('Error State', () => {
      it('should render error state when error-message is set', async () => {
        const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
        checkbox.setAttribute('label', 'Error');
        checkbox.setAttribute('error-message', 'This field is required');
        document.body.appendChild(checkbox);
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const wrapper = checkbox.shadowRoot?.querySelector('.checkbox');
        expect(wrapper?.classList.contains('checkbox--error')).toBe(true);
      });

      it('should display error message text', async () => {
        const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
        checkbox.setAttribute('label', 'Error');
        checkbox.setAttribute('error-message', 'This field is required');
        document.body.appendChild(checkbox);
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const errorEl = checkbox.shadowRoot?.querySelector('.checkbox__error');
        expect(errorEl?.textContent).toBe('This field is required');
      });

      it('should set aria-invalid when error is present', async () => {
        const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
        checkbox.setAttribute('label', 'Error');
        checkbox.setAttribute('error-message', 'Required');
        document.body.appendChild(checkbox);
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const input = checkbox.shadowRoot?.querySelector('.checkbox__input');
        expect(input?.getAttribute('aria-invalid')).toBe('true');
      });
    });
  });

  // ============================================================================
  // Label Alignment
  // ============================================================================
  
  describe('Label Alignment', () => {
    /**
     * @see Requirements: 3.1-3.4 - Label alignment
     */
    it('should default to center alignment', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Center aligned');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(checkbox.labelAlign).toBe('center');
      const wrapper = checkbox.shadowRoot?.querySelector('.checkbox');
      expect(wrapper?.classList.contains('checkbox--align-top')).toBe(false);
    });

    it('should apply top alignment when label-align is top', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Top aligned');
      checkbox.setAttribute('label-align', 'top');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(checkbox.labelAlign).toBe('top');
      const wrapper = checkbox.shadowRoot?.querySelector('.checkbox');
      expect(wrapper?.classList.contains('checkbox--align-top')).toBe(true);
    });
  });

  // ============================================================================
  // Attribute Reactivity
  // ============================================================================
  
  describe('Attribute Reactivity', () => {
    /**
     * @see Requirements: 8.6 - Reactive attribute updates
     * @see Requirements: 11.4 - Test attribute reactivity
     */
    it('should update when checked attribute changes', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Reactive');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(checkbox.checked).toBe(false);
      
      checkbox.setAttribute('checked', '');
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(checkbox.checked).toBe(true);
      const wrapper = checkbox.shadowRoot?.querySelector('.checkbox');
      expect(wrapper?.classList.contains('checkbox--checked')).toBe(true);
    });

    it('should update when size attribute changes', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Reactive');
      checkbox.setAttribute('size', 'sm');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let wrapper = checkbox.shadowRoot?.querySelector('.checkbox');
      expect(wrapper?.classList.contains('checkbox--sm')).toBe(true);
      
      checkbox.setAttribute('size', 'lg');
      await new Promise(resolve => setTimeout(resolve, 0));
      
      wrapper = checkbox.shadowRoot?.querySelector('.checkbox');
      expect(wrapper?.classList.contains('checkbox--lg')).toBe(true);
    });

    it('should update when label attribute changes', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Original');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let label = checkbox.shadowRoot?.querySelector('.checkbox__label');
      expect(label?.textContent).toBe('Original');
      
      checkbox.setAttribute('label', 'Updated');
      await new Promise(resolve => setTimeout(resolve, 0));
      
      label = checkbox.shadowRoot?.querySelector('.checkbox__label');
      expect(label?.textContent).toBe('Updated');
    });

    it('should update via property setters', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.label = 'Property Label';
      checkbox.size = 'lg';
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const label = checkbox.shadowRoot?.querySelector('.checkbox__label');
      expect(label?.textContent).toBe('Property Label');
      
      const wrapper = checkbox.shadowRoot?.querySelector('.checkbox');
      expect(wrapper?.classList.contains('checkbox--lg')).toBe(true);
    });
  });

  // ============================================================================
  // Helper Text
  // ============================================================================
  
  describe('Helper Text', () => {
    /**
     * @see Requirements: 5.1, 5.6 - Helper text
     */
    it('should display helper text when provided', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'With helper');
      checkbox.setAttribute('helper-text', 'This is helpful information');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const helper = checkbox.shadowRoot?.querySelector('.checkbox__helper');
      expect(helper?.textContent).toBe('This is helpful information');
    });

    it('should associate helper text via aria-describedby', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'With helper');
      checkbox.setAttribute('helper-text', 'Helper text');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = checkbox.shadowRoot?.querySelector('.checkbox__input');
      const helper = checkbox.shadowRoot?.querySelector('.checkbox__helper');
      const describedBy = input?.getAttribute('aria-describedby');
      
      expect(describedBy).toContain(helper?.id);
    });
  });

  // ============================================================================
  // Form Integration
  // ============================================================================
  
  describe('Form Integration', () => {
    /**
     * @see Requirements: 8.5, 8.7, 8.8 - Form submission and reset
     */
    it('should include name attribute on native input', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Form field');
      checkbox.setAttribute('name', 'terms');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = checkbox.shadowRoot?.querySelector('.checkbox__input');
      expect(input?.getAttribute('name')).toBe('terms');
    });

    it('should include value attribute on native input', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Form field');
      checkbox.setAttribute('name', 'terms');
      checkbox.setAttribute('value', 'accepted');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = checkbox.shadowRoot?.querySelector('.checkbox__input');
      expect(input?.getAttribute('value')).toBe('accepted');
    });

    it('should default value to "on"', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Form field');
      checkbox.setAttribute('name', 'terms');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(checkbox.value).toBe('on');
    });

    it('should reset to unchecked on form reset', async () => {
      const form = document.createElement('form');
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Form field');
      checkbox.setAttribute('checked', '');
      form.appendChild(checkbox);
      document.body.appendChild(form);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(checkbox.checked).toBe(true);
      
      form.reset();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(checkbox.checked).toBe(false);
    });

    it('should clear indeterminate on form reset', async () => {
      const form = document.createElement('form');
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Form field');
      checkbox.setAttribute('indeterminate', '');
      form.appendChild(checkbox);
      document.body.appendChild(form);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(checkbox.indeterminate).toBe(true);
      
      form.reset();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(checkbox.indeterminate).toBe(false);
    });
  });

  // ============================================================================
  // Accessibility - ARIA Attributes
  // ============================================================================
  
  describe('Accessibility - ARIA Attributes', () => {
    /**
     * @see Requirements: 6.1-6.6 - Accessibility
     */
    it('should have aria-checked reflecting checked state', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Accessible');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = checkbox.shadowRoot?.querySelector('.checkbox__input');
      expect(input?.getAttribute('aria-checked')).toBe('false');
    });

    it('should have aria-checked="true" when checked', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Accessible');
      checkbox.setAttribute('checked', '');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = checkbox.shadowRoot?.querySelector('.checkbox__input');
      expect(input?.getAttribute('aria-checked')).toBe('true');
    });

    it('should have aria-checked="mixed" when indeterminate', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Accessible');
      checkbox.setAttribute('indeterminate', '');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = checkbox.shadowRoot?.querySelector('.checkbox__input');
      expect(input?.getAttribute('aria-checked')).toBe('mixed');
    });

    it('should associate label with input via aria-labelledby', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Accessible');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = checkbox.shadowRoot?.querySelector('.checkbox__input');
      const label = checkbox.shadowRoot?.querySelector('.checkbox__label');
      const labelledBy = input?.getAttribute('aria-labelledby');
      
      expect(labelledBy).toBe(label?.id);
    });

    it('should associate error message via aria-describedby', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Accessible');
      checkbox.setAttribute('error-message', 'Error');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = checkbox.shadowRoot?.querySelector('.checkbox__input');
      const error = checkbox.shadowRoot?.querySelector('.checkbox__error');
      const describedBy = input?.getAttribute('aria-describedby');
      
      expect(describedBy).toContain(error?.id);
    });

    it('should have role="alert" on error message', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Accessible');
      checkbox.setAttribute('error-message', 'Error');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const error = checkbox.shadowRoot?.querySelector('.checkbox__error');
      expect(error?.getAttribute('role')).toBe('alert');
    });
  });

  // ============================================================================
  // Change Callback and Events
  // ============================================================================
  
  describe('Change Callback and Events', () => {
    /**
     * @see Requirements: 6.4 - Space key toggle
     */
    it('should call onChange when checkbox is clicked', async () => {
      const onChange = jest.fn();
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Clickable');
      checkbox.onChange = onChange;
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = checkbox.shadowRoot?.querySelector('.checkbox__input') as HTMLInputElement;
      input.click();
      
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('should dispatch change event when toggled', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Clickable');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const changeHandler = jest.fn();
      checkbox.addEventListener('change', changeHandler);
      
      const input = checkbox.shadowRoot?.querySelector('.checkbox__input') as HTMLInputElement;
      input.click();
      
      expect(changeHandler).toHaveBeenCalledTimes(1);
      expect(changeHandler.mock.calls[0][0].detail.checked).toBe(true);
    });

    it('should clear indeterminate on user interaction', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Indeterminate');
      checkbox.setAttribute('indeterminate', '');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(checkbox.indeterminate).toBe(true);
      
      const input = checkbox.shadowRoot?.querySelector('.checkbox__input') as HTMLInputElement;
      input.click();
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(checkbox.indeterminate).toBe(false);
    });

    it('should not throw when clicked without onChange callback', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'No Callback');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = checkbox.shadowRoot?.querySelector('.checkbox__input') as HTMLInputElement;
      
      expect(() => input.click()).not.toThrow();
    });
  });

  // ============================================================================
  // Test ID
  // ============================================================================
  
  describe('Test ID', () => {
    it('should apply data-testid attribute', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Test');
      checkbox.setAttribute('test-id', 'my-checkbox');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const wrapper = checkbox.shadowRoot?.querySelector('.checkbox');
      expect(wrapper?.getAttribute('data-testid')).toBe('my-checkbox');
    });

    it('should update data-testid when attribute changes', async () => {
      const checkbox = document.createElement('input-checkbox-base') as InputCheckboxBaseElement;
      checkbox.setAttribute('label', 'Test');
      checkbox.setAttribute('test-id', 'original-id');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let wrapper = checkbox.shadowRoot?.querySelector('.checkbox');
      expect(wrapper?.getAttribute('data-testid')).toBe('original-id');
      
      checkbox.setAttribute('test-id', 'updated-id');
      await new Promise(resolve => setTimeout(resolve, 0));
      
      wrapper = checkbox.shadowRoot?.querySelector('.checkbox');
      expect(wrapper?.getAttribute('data-testid')).toBe('updated-id');
    });
  });

  // ============================================================================
  // Observed Attributes
  // ============================================================================
  
  describe('Observed Attributes', () => {
    it('should observe checked attribute', () => {
      expect(InputCheckboxBaseElement.observedAttributes).toContain('checked');
    });

    it('should observe indeterminate attribute', () => {
      expect(InputCheckboxBaseElement.observedAttributes).toContain('indeterminate');
    });

    it('should observe label attribute', () => {
      expect(InputCheckboxBaseElement.observedAttributes).toContain('label');
    });

    it('should observe size attribute', () => {
      expect(InputCheckboxBaseElement.observedAttributes).toContain('size');
    });

    it('should observe label-align attribute', () => {
      expect(InputCheckboxBaseElement.observedAttributes).toContain('label-align');
    });

    it('should observe helper-text attribute', () => {
      expect(InputCheckboxBaseElement.observedAttributes).toContain('helper-text');
    });

    it('should observe error-message attribute', () => {
      expect(InputCheckboxBaseElement.observedAttributes).toContain('error-message');
    });

    it('should observe test-id attribute', () => {
      expect(InputCheckboxBaseElement.observedAttributes).toContain('test-id');
    });

    it('should observe name attribute', () => {
      expect(InputCheckboxBaseElement.observedAttributes).toContain('name');
    });

    it('should observe value attribute', () => {
      expect(InputCheckboxBaseElement.observedAttributes).toContain('value');
    });
  });
});
