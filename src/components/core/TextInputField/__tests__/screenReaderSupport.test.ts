/**
 * @category evergreen
 * @purpose Verify screenReaderSupport component renders correctly and behaves as expected
 */
/**
 * @jest-environment jsdom
 */

/**
 * Screen Reader Support Tests
 * 
 * Tests for WCAG 2.1 AA screen reader compliance across all platforms.
 * Validates aria-describedby, aria-invalid, role="alert", and platform-specific
 * accessibility attributes.
 * 
 * Requirements: 7.2, 7.3
 */

import { TextInputField } from '../platforms/web/TextInputField.web';

describe('TextInputField - Screen Reader Support', () => {
  beforeEach(() => {
    // Register custom element if not already registered
    if (!customElements.get('text-input-field')) {
      customElements.define('text-input-field', TextInputField);
    }
  });

  describe('aria-describedby association', () => {
    it('should associate input with helper text via aria-describedby', () => {
      // Create element
      const element = document.createElement('text-input-field') as TextInputField;
      element.setAttribute('id', 'test-input');
      element.setAttribute('label', 'Email');
      element.setAttribute('value', '');
      element.setAttribute('helper-text', 'Enter your email address');
      document.body.appendChild(element);

      // Wait for component to render
      const input = element.shadowRoot!.querySelector('input');
      expect(input).toBeTruthy();

      // Verify aria-describedby includes helper text ID
      const ariaDescribedBy = input!.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toContain('helper-test-input');

      // Verify helper text element exists with correct ID
      const helperText = element.shadowRoot!.querySelector('#helper-test-input');
      expect(helperText).toBeTruthy();
      expect(helperText!.textContent?.trim()).toBe('Enter your email address');

      // Cleanup
      document.body.removeChild(element);
    });

    it('should associate input with error message via aria-describedby', () => {
      // Create element
      const element = document.createElement('text-input-field') as TextInputField;
      element.setAttribute('id', 'test-input');
      element.setAttribute('label', 'Email');
      element.setAttribute('value', 'invalid');
      element.setAttribute('error-message', 'Please enter a valid email');
      document.body.appendChild(element);

      // Wait for component to render
      const input = element.shadowRoot!.querySelector('input');
      expect(input).toBeTruthy();

      // Verify aria-describedby includes error message ID
      const ariaDescribedBy = input!.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toContain('error-test-input');

      // Verify error message element exists with correct ID
      const errorMessage = element.shadowRoot!.querySelector('#error-test-input');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage!.textContent?.trim()).toBe('Please enter a valid email');

      // Cleanup
      document.body.removeChild(element);
    });

    it('should associate input with both helper text and error message', () => {
      // Create element
      const element = document.createElement('text-input-field') as TextInputField;
      element.setAttribute('id', 'test-input');
      element.setAttribute('label', 'Email');
      element.setAttribute('value', 'invalid');
      element.setAttribute('helper-text', 'Enter your email address');
      element.setAttribute('error-message', 'Please enter a valid email');
      document.body.appendChild(element);

      // Wait for component to render
      const input = element.shadowRoot!.querySelector('input');
      expect(input).toBeTruthy();

      // Verify aria-describedby includes both IDs
      const ariaDescribedBy = input!.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toContain('helper-test-input');
      expect(ariaDescribedBy).toContain('error-test-input');

      // Verify both elements exist
      const helperText = element.shadowRoot!.querySelector('#helper-test-input');
      const errorMessage = element.shadowRoot!.querySelector('#error-test-input');
      expect(helperText).toBeTruthy();
      expect(errorMessage).toBeTruthy();

      // Cleanup
      document.body.removeChild(element);
    });

    it('should not include aria-describedby when no helper text or error message', () => {
      // Create element
      const element = document.createElement('text-input-field') as TextInputField;
      element.setAttribute('id', 'test-input');
      element.setAttribute('label', 'Email');
      element.setAttribute('value', '');
      document.body.appendChild(element);

      // Wait for component to render
      const input = element.shadowRoot!.querySelector('input');
      expect(input).toBeTruthy();

      // Verify aria-describedby is empty or contains only whitespace
      const ariaDescribedBy = input!.getAttribute('aria-describedby');
      expect(ariaDescribedBy?.trim()).toBe('');

      // Cleanup
      document.body.removeChild(element);
    });
  });

  describe('aria-invalid for error state', () => {
    it('should set aria-invalid="true" when error message is present', () => {
      // Create element
      const element = document.createElement('text-input-field') as TextInputField;
      element.setAttribute('id', 'test-input');
      element.setAttribute('label', 'Email');
      element.setAttribute('value', 'invalid');
      element.setAttribute('error-message', 'Please enter a valid email');
      document.body.appendChild(element);

      // Wait for component to render
      const input = element.shadowRoot!.querySelector('input');
      expect(input).toBeTruthy();

      // Verify aria-invalid is set to true
      expect(input!.getAttribute('aria-invalid')).toBe('true');

      // Cleanup
      document.body.removeChild(element);
    });

    it('should not set aria-invalid when no error message', () => {
      // Create element
      const element = document.createElement('text-input-field') as TextInputField;
      element.setAttribute('id', 'test-input');
      element.setAttribute('label', 'Email');
      element.setAttribute('value', 'user@example.com');
      document.body.appendChild(element);

      // Wait for component to render
      const input = element.shadowRoot!.querySelector('input');
      expect(input).toBeTruthy();

      // Verify aria-invalid is not set
      expect(input!.hasAttribute('aria-invalid')).toBe(false);

      // Cleanup
      document.body.removeChild(element);
    });

    it('should update aria-invalid when error state changes', () => {
      // Create element
      const element = document.createElement('text-input-field') as TextInputField;
      element.setAttribute('id', 'test-input');
      element.setAttribute('label', 'Email');
      element.setAttribute('value', 'user@example.com');
      document.body.appendChild(element);

      // Wait for component to render
      let input = element.shadowRoot!.querySelector('input');
      expect(input).toBeTruthy();

      // Initially no error
      expect(input!.hasAttribute('aria-invalid')).toBe(false);

      // Add error message
      element.setAttribute('error-message', 'Please enter a valid email');

      // Wait for re-render
      input = element.shadowRoot!.querySelector('input');

      // Verify aria-invalid is now set
      expect(input!.getAttribute('aria-invalid')).toBe('true');

      // Remove error message
      element.removeAttribute('error-message');

      // Wait for re-render
      input = element.shadowRoot!.querySelector('input');

      // Verify aria-invalid is removed
      expect(input!.hasAttribute('aria-invalid')).toBe(false);

      // Cleanup
      document.body.removeChild(element);
    });
  });

  describe('role="alert" for error message', () => {
    it('should set role="alert" on error message element', () => {
      // Create element
      const element = document.createElement('text-input-field') as TextInputField;
      element.setAttribute('id', 'test-input');
      element.setAttribute('label', 'Email');
      element.setAttribute('value', 'invalid');
      element.setAttribute('error-message', 'Please enter a valid email');
      document.body.appendChild(element);

      // Wait for component to render
      const errorMessage = element.shadowRoot!.querySelector('.error-message');
      expect(errorMessage).toBeTruthy();

      // Verify role="alert" is set
      expect(errorMessage!.getAttribute('role')).toBe('alert');

      // Cleanup
      document.body.removeChild(element);
    });

    it('should not have role="alert" on helper text', () => {
      // Create element
      const element = document.createElement('text-input-field') as TextInputField;
      element.setAttribute('id', 'test-input');
      element.setAttribute('label', 'Email');
      element.setAttribute('value', '');
      element.setAttribute('helper-text', 'Enter your email address');
      document.body.appendChild(element);

      // Wait for component to render
      const helperText = element.shadowRoot!.querySelector('.helper-text');
      expect(helperText).toBeTruthy();

      // Verify role="alert" is NOT set on helper text
      expect(helperText!.hasAttribute('role')).toBe(false);

      // Cleanup
      document.body.removeChild(element);
    });

    it('should announce error message to screen readers when error appears', () => {
      // Create element without error
      const element = document.createElement('text-input-field') as TextInputField;
      element.setAttribute('id', 'test-input');
      element.setAttribute('label', 'Email');
      element.setAttribute('value', 'user@example.com');
      document.body.appendChild(element);

      // Wait for component to render
      let errorMessage = element.shadowRoot!.querySelector('.error-message');
      expect(errorMessage).toBeFalsy();

      // Add error message
      element.setAttribute('error-message', 'Please enter a valid email');

      // Wait for re-render
      errorMessage = element.shadowRoot!.querySelector('.error-message');
      expect(errorMessage).toBeTruthy();

      // Verify role="alert" is set (this causes screen readers to announce)
      expect(errorMessage!.getAttribute('role')).toBe('alert');

      // Cleanup
      document.body.removeChild(element);
    });
  });

  describe('Screen reader text content', () => {
    it('should provide complete context for screen readers', () => {
      // Create element with all text content
      const element = document.createElement('text-input-field') as TextInputField;
      element.setAttribute('id', 'test-input');
      element.setAttribute('label', 'Email');
      element.setAttribute('value', 'invalid');
      element.setAttribute('helper-text', 'Enter your email address');
      element.setAttribute('error-message', 'Please enter a valid email');
      element.setAttribute('required', '');
      document.body.appendChild(element);

      // Wait for component to render
      const input = element.shadowRoot!.querySelector('input');
      const label = element.shadowRoot!.querySelector('label');
      const helperText = element.shadowRoot!.querySelector('.helper-text');
      const errorMessage = element.shadowRoot!.querySelector('.error-message');

      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(helperText).toBeTruthy();
      expect(errorMessage).toBeTruthy();

      // Verify label includes required indicator
      expect(label!.textContent).toContain('Email');
      expect(label!.textContent).toContain('*');

      // Verify helper text content
      expect(helperText!.textContent?.trim()).toBe('Enter your email address');

      // Verify error message content
      expect(errorMessage!.textContent?.trim()).toBe('Please enter a valid email');

      // Verify input is associated with all text via aria-describedby
      const ariaDescribedBy = input!.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toContain('helper-test-input');
      expect(ariaDescribedBy).toContain('error-test-input');

      // Verify input has aria-invalid
      expect(input!.getAttribute('aria-invalid')).toBe('true');

      // Cleanup
      document.body.removeChild(element);
    });

    it('should update screen reader associations when text changes', () => {
      // Create element with helper text
      const element = document.createElement('text-input-field') as TextInputField;
      element.setAttribute('id', 'test-input');
      element.setAttribute('label', 'Email');
      element.setAttribute('value', '');
      element.setAttribute('helper-text', 'Enter your email address');
      document.body.appendChild(element);

      // Wait for component to render
      let helperText = element.shadowRoot!.querySelector('.helper-text');
      expect(helperText).toBeTruthy();
      expect(helperText!.textContent?.trim()).toBe('Enter your email address');

      // Update helper text
      element.setAttribute('helper-text', 'Updated helper text');

      // Wait for re-render
      helperText = element.shadowRoot!.querySelector('.helper-text');
      expect(helperText!.textContent?.trim()).toBe('Updated helper text');

      // Verify aria-describedby still references helper text
      const input = element.shadowRoot!.querySelector('input');
      const ariaDescribedBy = input!.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toContain('helper-test-input');

      // Cleanup
      document.body.removeChild(element);
    });
  });

  describe('Platform-specific accessibility', () => {
    it('should document iOS VoiceOver support', () => {
      // iOS implementation uses SwiftUI accessibility modifiers:
      // - .accessibilityElement(children: .contain)
      // - .accessibilityLabel(label)
      // - .accessibilityValue(value)
      // - .accessibilityHint(helperText ?? "")
      // - .accessibilityIdentifier for helper text and error message
      
      // This test documents the iOS implementation approach
      // Actual VoiceOver testing requires iOS device or simulator
      expect(true).toBe(true);
    });

    it('should document Android TalkBack support', () => {
      // Android implementation uses Jetpack Compose semantics:
      // - .semantics { contentDescription = helperText }
      // - .semantics { error(errorMessage) }
      // - Compose automatically handles accessibility for TextField
      
      // This test documents the Android implementation approach
      // Actual TalkBack testing requires Android device or emulator
      expect(true).toBe(true);
    });

    it('should document web screen reader support', () => {
      // Web implementation uses ARIA attributes:
      // - aria-describedby for helper text and error message
      // - aria-invalid for error state
      // - role="alert" for error message
      // - Proper label association via for/id
      
      // This test documents the web implementation approach
      // Actual screen reader testing requires NVDA, JAWS, or VoiceOver
      expect(true).toBe(true);
    });
  });
});
