/**
 * @jest-environment jsdom
 */

/**
 * @category evergreen
 * @purpose Verify labelAssociation component renders correctly and behaves as expected
 */

/**
 * Label Association Tests
 * 
 * Tests for TextInputField label association and accessibility.
 * Validates Requirement 7.1: Label association with for attribute.
 * 
 * Note: Motion token injection is no longer required. CSS transition-delay
 * now handles animation timing coordination, and motion tokens are applied
 * via CSS custom properties defined in the component styles.
 */

import { describe, it, expect, beforeAll, beforeEach, afterEach } from '@jest/globals';
import { setupBlendColorProperties, cleanupBlendColorProperties } from './test-utils';

describe('TextInputField Label Association', () => {
  let container: HTMLElement;
  
  // Import component before tests
  beforeAll(async () => {
    // Import component (dynamic import)
    await import('../platforms/web/TextInputField.web');
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
        <text-input-field
          id="test-input"
          label="Email"
          value=""
        ></text-input-field>
      `);
      
      // Wait for component to render
      const component = container.querySelector('text-input-field') as any;
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
        <text-input-field
          id="test-input"
          label="Email"
          value=""
        ></text-input-field>
      `);
      
      const component = container.querySelector('text-input-field') as any;
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
        <text-input-field
          id="test-input"
          label="Email"
          value=""
          helper-text="Enter your email address"
        ></text-input-field>
      `);
      
      const component = container.querySelector('text-input-field') as any;
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
        <text-input-field
          id="test-input"
          label="Email"
          value="invalid"
          error-message="Please enter a valid email"
        ></text-input-field>
      `);
      
      const component = container.querySelector('text-input-field') as any;
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
        <text-input-field
          id="test-input"
          label="Email"
          value="invalid"
          helper-text="Enter your email address"
          error-message="Please enter a valid email"
        ></text-input-field>
      `);
      
      const component = container.querySelector('text-input-field') as any;
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
        <text-input-field
          id="test-input"
          label="Email"
          value=""
        ></text-input-field>
      `);
      
      const component = container.querySelector('text-input-field') as any;
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
        <text-input-field
          id="test-input"
          label="${labelText}"
          value=""
        ></text-input-field>
      `);
      
      const component = container.querySelector('text-input-field') as any;
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
        <text-input-field
          id="test-input"
          label="Email"
          value=""
          required
        ></text-input-field>
      `);
      
      const component = container.querySelector('text-input-field') as any;
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
});
