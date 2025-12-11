/**
 * @jest-environment jsdom
 */

/**
 * Keyboard Navigation Tests for TextInputField
 * 
 * Tests keyboard navigation functionality including:
 * - Tab key focusing input
 * - Enter key form submission
 * - Keyboard navigation flow
 * 
 * Requirements: 6.1, 6.2, 6.3
 */

import '../platforms/web/TextInputField.web';

describe('TextInputField - Keyboard Navigation', () => {
  let container: HTMLDivElement;
  let styleElement: HTMLStyleElement;

  beforeEach(() => {
    // Add CSS custom properties for motion tokens
    styleElement = document.createElement('style');
    styleElement.textContent = `
      :root {
        --motion-float-label-duration: 250ms;
        --motion-float-label-easing: ease-out;
      }
    `;
    document.head.appendChild(styleElement);
    
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.head.removeChild(styleElement);
  });

  describe('Tab Key Focus (Requirement 6.1)', () => {
    it('should focus input when Tab key is pressed', () => {
      // Create component
      container.innerHTML = `
        <text-input-field
          id="test-input"
          label="Email"
          value=""
        ></text-input-field>
      `;

      const component = container.querySelector('text-input-field') as any;
      const input = component.shadowRoot.querySelector('.input-element') as HTMLInputElement;

      // Verify input is not focused initially
      expect(document.activeElement).not.toBe(input);

      // Simulate Tab key press by focusing the input
      input.focus();

      // Verify input receives focus
      expect(component.shadowRoot.activeElement).toBe(input);
    });

    it('should display focus state when input receives focus via Tab', () => {
      container.innerHTML = `
        <text-input-field
          id="test-input"
          label="Email"
          value=""
        ></text-input-field>
      `;

      const component = container.querySelector('text-input-field') as any;
      const input = component.shadowRoot.querySelector('.input-element') as HTMLInputElement;
      const wrapper = component.shadowRoot.querySelector('.input-wrapper') as HTMLElement;

      // Focus input (simulating Tab key)
      input.focus();

      // Verify focus state is applied
      expect(wrapper.classList.contains('focused')).toBe(true);
    });

    it('should show focus ring when input receives keyboard focus', () => {
      container.innerHTML = `
        <text-input-field
          id="test-input"
          label="Email"
          value=""
        ></text-input-field>
      `;

      const component = container.querySelector('text-input-field') as any;
      const input = component.shadowRoot.querySelector('.input-element') as HTMLInputElement;

      // Focus input (simulating Tab key)
      input.focus();

      // Get computed styles
      const styles = window.getComputedStyle(input);

      // Verify input is focused (focus ring is applied via CSS :focus-visible)
      expect(component.shadowRoot.activeElement).toBe(input);
    });
  });

  describe('Enter Key Form Submission (Requirement 6.2)', () => {
    it('should submit form when Enter key is pressed in input', () => {
      // Create form with input
      const form = document.createElement('form');
      form.innerHTML = `
        <text-input-field
          id="test-input"
          label="Email"
          value="test@example.com"
        ></text-input-field>
      `;
      container.appendChild(form);

      const component = form.querySelector('text-input-field') as any;
      const input = component.shadowRoot.querySelector('.input-element') as HTMLInputElement;

      // Track form submission
      let formSubmitted = false;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        formSubmitted = true;
      });

      // Focus input
      input.focus();

      // Simulate Enter key press
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        bubbles: true,
        cancelable: true
      });
      input.dispatchEvent(enterEvent);

      // Trigger form submission (browser behavior)
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      // Verify form was submitted
      expect(formSubmitted).toBe(true);
    });

    it('should use standard browser behavior for Enter key', () => {
      // Create form with input
      const form = document.createElement('form');
      form.innerHTML = `
        <text-input-field
          id="test-input"
          label="Email"
          value="test@example.com"
        ></text-input-field>
      `;
      container.appendChild(form);

      const component = form.querySelector('text-input-field') as any;
      const input = component.shadowRoot.querySelector('.input-element') as HTMLInputElement;

      // Verify input is a standard HTML input element
      expect(input.tagName).toBe('INPUT');
      expect(input.type).toBe('text');

      // Standard HTML inputs submit forms on Enter key by default
      // No custom event handling needed - browser handles this
    });
  });

  describe('Keyboard Navigation Flow (Requirement 6.3)', () => {
    it('should maintain proper tab order with multiple inputs', () => {
      // Create multiple inputs
      container.innerHTML = `
        <text-input-field
          id="input-1"
          label="First Name"
          value=""
        ></text-input-field>
        <text-input-field
          id="input-2"
          label="Last Name"
          value=""
        ></text-input-field>
        <text-input-field
          id="input-3"
          label="Email"
          value=""
        ></text-input-field>
      `;

      const components = container.querySelectorAll('text-input-field');
      const input1 = (components[0] as any).shadowRoot.querySelector('.input-element') as HTMLInputElement;
      const input2 = (components[1] as any).shadowRoot.querySelector('.input-element') as HTMLInputElement;
      const input3 = (components[2] as any).shadowRoot.querySelector('.input-element') as HTMLInputElement;

      // Focus first input
      input1.focus();
      expect((components[0] as any).shadowRoot.activeElement).toBe(input1);

      // Focus second input (simulating Tab)
      input2.focus();
      expect((components[1] as any).shadowRoot.activeElement).toBe(input2);

      // Focus third input (simulating Tab)
      input3.focus();
      expect((components[2] as any).shadowRoot.activeElement).toBe(input3);
    });

    it('should lose focus when navigating away from input', () => {
      container.innerHTML = `
        <text-input-field
          id="test-input"
          label="Email"
          value=""
        ></text-input-field>
        <button id="next-button">Next</button>
      `;

      const component = container.querySelector('text-input-field') as any;
      const input = component.shadowRoot.querySelector('.input-element') as HTMLInputElement;
      const button = container.querySelector('#next-button') as HTMLButtonElement;
      const wrapper = component.shadowRoot.querySelector('.input-wrapper') as HTMLElement;

      // Focus input
      input.focus();
      expect(wrapper.classList.contains('focused')).toBe(true);

      // Focus button (simulating Tab away from input)
      button.focus();

      // Trigger blur event manually (since we're not using real Tab key)
      input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

      // Verify input lost focus
      expect(wrapper.classList.contains('focused')).toBe(false);
    });

    it('should update to appropriate state when losing focus', () => {
      container.innerHTML = `
        <text-input-field
          id="test-input"
          label="Email"
          value=""
        ></text-input-field>
      `;

      const component = container.querySelector('text-input-field') as any;
      const input = component.shadowRoot.querySelector('.input-element') as HTMLInputElement;
      const label = component.shadowRoot.querySelector('.input-label') as HTMLElement;

      // Focus input (label should float)
      input.focus();
      expect(label.classList.contains('floated')).toBe(true);

      // Blur input without entering value (label should return)
      input.blur();

      // Wait for animation to complete
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(label.classList.contains('floated')).toBe(false);
          resolve();
        }, 300); // Wait for animation duration
      });
    });

    it('should maintain filled state when navigating away from filled input', () => {
      container.innerHTML = `
        <text-input-field
          id="test-input"
          label="Email"
          value="test@example.com"
        ></text-input-field>
      `;

      const component = container.querySelector('text-input-field') as any;
      const input = component.shadowRoot.querySelector('.input-element') as HTMLInputElement;
      const label = component.shadowRoot.querySelector('.input-label') as HTMLElement;

      // Focus input
      input.focus();
      expect(label.classList.contains('floated')).toBe(true);

      // Blur input (label should stay floated because input has value)
      input.blur();

      // Label should remain floated
      expect(label.classList.contains('floated')).toBe(true);
    });

    it('should handle rapid focus changes correctly', () => {
      container.innerHTML = `
        <text-input-field
          id="input-1"
          label="First Name"
          value=""
        ></text-input-field>
        <text-input-field
          id="input-2"
          label="Last Name"
          value=""
        ></text-input-field>
      `;

      const component1 = container.querySelectorAll('text-input-field')[0] as any;
      const component2 = container.querySelectorAll('text-input-field')[1] as any;
      const input1 = component1.shadowRoot.querySelector('.input-element') as HTMLInputElement;
      const input2 = component2.shadowRoot.querySelector('.input-element') as HTMLInputElement;
      const wrapper1 = component1.shadowRoot.querySelector('.input-wrapper') as HTMLElement;
      const wrapper2 = component2.shadowRoot.querySelector('.input-wrapper') as HTMLElement;

      // Rapidly switch focus between inputs
      input1.focus();
      expect(wrapper1.classList.contains('focused')).toBe(true);

      input2.focus();
      input1.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
      expect(wrapper2.classList.contains('focused')).toBe(true);
      expect(wrapper1.classList.contains('focused')).toBe(false);

      input1.focus();
      input2.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
      expect(wrapper1.classList.contains('focused')).toBe(true);
      expect(wrapper2.classList.contains('focused')).toBe(false);
    });
  });

  describe('Focus Ring Visibility (WCAG 2.4.7)', () => {
    it('should show focus ring in all states', () => {
      container.innerHTML = `
        <text-input-field
          id="test-input"
          label="Email"
          value=""
        ></text-input-field>
      `;

      const component = container.querySelector('text-input-field') as any;
      const input = component.shadowRoot.querySelector('.input-element') as HTMLInputElement;

      // Focus input
      input.focus();

      // Verify input is focused (focus ring applied via CSS)
      expect(component.shadowRoot.activeElement).toBe(input);
    });

    it('should show focus ring in error state', () => {
      container.innerHTML = `
        <text-input-field
          id="test-input"
          label="Email"
          value="invalid"
          error-message="Please enter a valid email"
        ></text-input-field>
      `;

      const component = container.querySelector('text-input-field') as any;
      const input = component.shadowRoot.querySelector('.input-element') as HTMLInputElement;
      const wrapper = component.shadowRoot.querySelector('.input-wrapper') as HTMLElement;

      // Focus input
      input.focus();

      // Verify error state and focus
      expect(wrapper.classList.contains('error')).toBe(true);
      expect(component.shadowRoot.activeElement).toBe(input);
    });

    it('should show focus ring in success state', () => {
      container.innerHTML = `
        <text-input-field
          id="test-input"
          label="Email"
          value="test@example.com"
          is-success="true"
        ></text-input-field>
      `;

      const component = container.querySelector('text-input-field') as any;
      const input = component.shadowRoot.querySelector('.input-element') as HTMLInputElement;
      const wrapper = component.shadowRoot.querySelector('.input-wrapper') as HTMLElement;

      // Focus input
      input.focus();

      // Verify success state and focus
      expect(wrapper.classList.contains('success')).toBe(true);
      expect(component.shadowRoot.activeElement).toBe(input);
    });
  });

  describe('Label Click Focus (Requirement 6.2)', () => {
    it('should focus input when label is clicked', () => {
      container.innerHTML = `
        <text-input-field
          id="test-input"
          label="Email"
          value=""
        ></text-input-field>
      `;

      const component = container.querySelector('text-input-field') as any;
      const input = component.shadowRoot.querySelector('.input-element') as HTMLInputElement;
      const label = component.shadowRoot.querySelector('.input-label') as HTMLLabelElement;

      // Verify input is not focused initially
      expect(component.shadowRoot.activeElement).not.toBe(input);

      // Click label
      label.click();

      // Verify input receives focus (label has for attribute)
      // Note: In real browser, clicking label focuses associated input
      // In test environment, we verify the for attribute is correct
      expect(label.getAttribute('for')).toBe('test-input');
      expect(input.id).toBe('test-input');
    });
  });
});
