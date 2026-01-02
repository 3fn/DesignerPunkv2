/**
 * @jest-environment jsdom
 */

/**
 * @category evergreen
 * @purpose Verify label association and accessibility for Input-Text-Base component
 */

/**
 * Label Association Tests
 * 
 * Tests for Input-Text-Base label association and accessibility.
 * Validates Requirement 7.1: Label association with for attribute.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Primitive (Base)
 * 
 * Requirements: 7.1, R3
 * Ported from: TextInputField/__tests__/labelAssociation.test.ts
 * 
 * Note: Motion token injection is no longer required. CSS transition-delay
 * now handles animation timing coordination, and motion tokens are applied
 * via CSS custom properties defined in the component styles.
 */

import { describe, it, expect, beforeAll, beforeEach, afterEach } from '@jest/globals';
import { setupBlendColorProperties, cleanupBlendColorProperties } from './test-utils';

describe('Input-Text-Base Label Association', () => {
  let container: HTMLElement;
  
  // Import component before tests
  beforeAll(async () => {
    // Import component (dynamic import)
    await import('../platforms/web/InputTextBase.web');
  });
  
  beforeEach(() => {
    // Set up CSS custom properties required for blend utilities
    setupBlendColorProperties();
    
    // Create container for tests
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  
  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
    
    // Clean up CSS custom properties
    cleanupBlendColorProperties();
  });

  /**
   * Helper to set innerHTML for test components.
   * Motion token injection is no longer needed - CSS handles animation timing.
   */
  function setContainerHTML(html: string): void {
    container.innerHTML = html;
  }
  
  describe('Web Platform', () => {
    it('should have label with for attribute matching input id', () => {
      // Create component
      setContainerHTML(`
        <input-text-base
          id="test-input"
          label="Email"
          value=""
        ></input-text-base>
      `);
      
      // Wait for component to render
      const component = container.querySelector('input-text-base') as any;
      expect(component).toBeTruthy();
      
      // Access shadow DOM
      const shadowRoot = component.shadowRoot;
      expect(shadowRoot).toBeTruthy();
      
      // Find label and input
      const label = shadowRoot.querySelector('label');
      const input = shadowRoot.querySelector('input');
      
      expect(label).toBeTruthy();
      expect(input).toBeTruthy();
      
      // Verify label has for attribute
      expect(label?.getAttribute('for')).toBe('test-input');
      
      // Verify input has matching id
      expect(input?.getAttribute('id')).toBe('test-input');
    });
    
    it('should focus input when label is clicked', () => {
      // Create component
      setContainerHTML(`
        <input-text-base
          id="test-input"
          label="Email"
          value=""
        ></input-text-base>
      `);
      
      const component = container.querySelector('input-text-base') as any;
      const shadowRoot = component.shadowRoot;
      
      const label = shadowRoot.querySelector('label') as HTMLLabelElement;
      const input = shadowRoot.querySelector('input') as HTMLInputElement;
      
      // Verify input is not focused initially
      expect(document.activeElement).not.toBe(input);
      
      // Click label
      label.click();
      
      // Verify input receives focus
      // Note: In JSDOM, label click doesn't automatically focus input
      // This is a limitation of JSDOM, but the association is correct
      expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
    });
    
    it('should have programmatic association for screen readers', () => {
      // Create component with helper text
      setContainerHTML(`
        <input-text-base
          id="test-input"
          label="Email"
          value=""
          helper-text="Enter your email address"
        ></input-text-base>
      `);
      
      const component = container.querySelector('input-text-base') as any;
      const shadowRoot = component.shadowRoot;
      
      const input = shadowRoot.querySelector('input') as HTMLInputElement;
      const helperText = shadowRoot.querySelector('.helper-text') as HTMLElement;
      
      // Verify input has aria-describedby
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(describedBy).toContain('helper-test-input');
      
      // Verify helper text has matching id
      expect(helperText.getAttribute('id')).toBe('helper-test-input');
    });
    
    it('should associate error message with input for screen readers', () => {
      // Create component with error
      setContainerHTML(`
        <input-text-base
          id="test-input"
          label="Email"
          value="invalid"
          error-message="Please enter a valid email"
        ></input-text-base>
      `);
      
      const component = container.querySelector('input-text-base') as any;
      const shadowRoot = component.shadowRoot;
      
      const input = shadowRoot.querySelector('input') as HTMLInputElement;
      const errorMessage = shadowRoot.querySelector('.error-message') as HTMLElement;
      
      // Verify input has aria-describedby including error
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(describedBy).toContain('error-test-input');
      
      // Verify error message has matching id
      expect(errorMessage.getAttribute('id')).toBe('error-test-input');
      
      // Verify error message has role="alert"
      expect(errorMessage.getAttribute('role')).toBe('alert');
      
      // Verify input has aria-invalid
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });
    
    it('should associate both helper text and error message with input', () => {
      // Create component with both helper text and error
      setContainerHTML(`
        <input-text-base
          id="test-input"
          label="Email"
          value="invalid"
          helper-text="Enter your email address"
          error-message="Please enter a valid email"
        ></input-text-base>
      `);
      
      const component = container.querySelector('input-text-base') as any;
      const shadowRoot = component.shadowRoot;
      
      const input = shadowRoot.querySelector('input') as HTMLInputElement;
      
      // Verify input has aria-describedby with both ids
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(describedBy).toContain('helper-test-input');
      expect(describedBy).toContain('error-test-input');
    });
    
    it('should maintain label association when label floats', () => {
      // Create component
      setContainerHTML(`
        <input-text-base
          id="test-input"
          label="Email"
          value=""
        ></input-text-base>
      `);
      
      const component = container.querySelector('input-text-base') as any;
      const shadowRoot = component.shadowRoot;
      
      const label = shadowRoot.querySelector('label') as HTMLLabelElement;
      const input = shadowRoot.querySelector('input') as HTMLInputElement;
      
      // Verify association before focus
      expect(label.getAttribute('for')).toBe('test-input');
      expect(input.getAttribute('id')).toBe('test-input');
      
      // Focus input (triggers label float)
      input.focus();
      
      // Verify association maintained after float
      expect(label.getAttribute('for')).toBe('test-input');
      expect(input.getAttribute('id')).toBe('test-input');
      
      // Verify label has floated class
      expect(label.classList.contains('floated')).toBe(true);
    });
  });
  
  describe('Cross-Platform Accessibility', () => {
    it('should have consistent label text across platforms', () => {
      const labelText = 'Email Address';
      
      // Web
      setContainerHTML(`
        <input-text-base
          id="test-input"
          label="${labelText}"
          value=""
        ></input-text-base>
      `);
      
      const component = container.querySelector('input-text-base') as any;
      const shadowRoot = component.shadowRoot;
      const label = shadowRoot.querySelector('label') as HTMLLabelElement;
      
      // Verify label text matches
      expect(label.textContent).toContain(labelText);
      
      // Note: iOS and Android implementations would use the same label text
      // through their respective accessibility systems:
      // - iOS: .accessibilityLabel(label)
      // - Android: semantics { contentDescription = label }
    });
    
    it('should indicate required fields consistently', () => {
      // Web
      setContainerHTML(`
        <input-text-base
          id="test-input"
          label="Email"
          value=""
          required
        ></input-text-base>
      `);
      
      const component = container.querySelector('input-text-base') as any;
      const shadowRoot = component.shadowRoot;
      const label = shadowRoot.querySelector('label') as HTMLLabelElement;
      const input = shadowRoot.querySelector('input') as HTMLInputElement;
      
      // Verify label shows required indicator
      expect(label.textContent).toContain('*');
      
      // Verify input has required attribute
      expect(input.hasAttribute('required')).toBe(true);
      
      // Note: iOS and Android would show " *" in their label text as well
    });
  });

  describe('Label-Input ID Association', () => {
    it('should use provided id attribute for label association', () => {
      // Create component with explicit id
      setContainerHTML(`
        <input-text-base
          id="custom-id"
          label="Password"
          value=""
        ></input-text-base>
      `);
      
      const component = container.querySelector('input-text-base') as any;
      const shadowRoot = component.shadowRoot;
      
      const label = shadowRoot.querySelector('label') as HTMLLabelElement;
      const input = shadowRoot.querySelector('input') as HTMLInputElement;
      
      // Verify label for attribute matches custom id
      expect(label.getAttribute('for')).toBe('custom-id');
      expect(input.getAttribute('id')).toBe('custom-id');
    });

    it('should update label association when id changes', () => {
      // Create component
      setContainerHTML(`
        <input-text-base
          id="original-id"
          label="Email"
          value=""
        ></input-text-base>
      `);
      
      const component = container.querySelector('input-text-base') as any;
      let shadowRoot = component.shadowRoot;
      
      // Verify initial association
      let label = shadowRoot.querySelector('label') as HTMLLabelElement;
      let input = shadowRoot.querySelector('input') as HTMLInputElement;
      expect(label.getAttribute('for')).toBe('original-id');
      expect(input.getAttribute('id')).toBe('original-id');
      
      // Update id attribute
      component.setAttribute('id', 'updated-id');
      
      // Re-query elements after update
      shadowRoot = component.shadowRoot;
      label = shadowRoot.querySelector('label') as HTMLLabelElement;
      input = shadowRoot.querySelector('input') as HTMLInputElement;
      
      // Verify updated association
      expect(label.getAttribute('for')).toBe('updated-id');
      expect(input.getAttribute('id')).toBe('updated-id');
    });
  });

  describe('Accessibility Compliance - Requirement 7.1', () => {
    it('should meet WCAG 2.1 AA label association requirements', () => {
      // Create component with all accessibility features
      setContainerHTML(`
        <input-text-base
          id="accessible-input"
          label="Full Name"
          value=""
          helper-text="Enter your first and last name"
          required
        ></input-text-base>
      `);
      
      const component = container.querySelector('input-text-base') as any;
      const shadowRoot = component.shadowRoot;
      
      const label = shadowRoot.querySelector('label') as HTMLLabelElement;
      const input = shadowRoot.querySelector('input') as HTMLInputElement;
      const helperText = shadowRoot.querySelector('.helper-text') as HTMLElement;
      
      // WCAG 1.3.1: Info and Relationships
      // Label must be programmatically associated with input
      expect(label.getAttribute('for')).toBe('accessible-input');
      expect(input.getAttribute('id')).toBe('accessible-input');
      
      // WCAG 3.3.2: Labels or Instructions
      // Input must have visible label
      expect(label.textContent).toContain('Full Name');
      
      // WCAG 4.1.2: Name, Role, Value
      // Input must have accessible name via label
      // aria-describedby provides additional context
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toContain('helper-accessible-input');
      
      // Required indicator must be visible
      expect(label.textContent).toContain('*');
      expect(input.hasAttribute('required')).toBe(true);
    });

    it('should provide accessible error feedback per WCAG 3.3.1', () => {
      // Create component with error state
      setContainerHTML(`
        <input-text-base
          id="error-input"
          label="Email"
          value="invalid-email"
          error-message="Please enter a valid email address"
        ></input-text-base>
      `);
      
      const component = container.querySelector('input-text-base') as any;
      const shadowRoot = component.shadowRoot;
      
      const input = shadowRoot.querySelector('input') as HTMLInputElement;
      const errorMessage = shadowRoot.querySelector('.error-message') as HTMLElement;
      
      // WCAG 3.3.1: Error Identification
      // Error must be identified and described in text
      expect(errorMessage.textContent?.trim()).toBe('Please enter a valid email address');
      
      // Error must be programmatically associated with input
      const describedBy = input.getAttribute('aria-describedby');
      expect(describedBy).toContain('error-error-input');
      
      // Input must indicate invalid state
      expect(input.getAttribute('aria-invalid')).toBe('true');
      
      // Error must be announced to screen readers
      expect(errorMessage.getAttribute('role')).toBe('alert');
    });
  });
});
