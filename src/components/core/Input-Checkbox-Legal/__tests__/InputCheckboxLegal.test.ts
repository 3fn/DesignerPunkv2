/**
 * @category evergreen
 * @purpose Verify Input-Checkbox-Legal web component behavior: consent enforcement, audit trail, fixed configuration
 * @jest-environment jsdom
 */
/**
 * Input-Checkbox-Legal Web Component Tests
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic Variant (wraps Base)
 * 
 * Tests the Input-Checkbox-Legal component's web component behavior:
 * - Explicit consent enforcement (pre-check override + console warning)
 * - ISO 8601 timestamp format in callback
 * - Audit trail data (legalTextId, version) in callback
 * - Fixed configuration (size, alignment not configurable)
 * - Required indicator default visibility
 * - Indeterminate state rejection
 * 
 * Following Test Development Standards:
 * - Explicit custom element registration pattern
 * - Wait for customElements.whenDefined() before tests
 * - Wait after appendChild() before querying shadow DOM
 * - Clean up DOM after each test
 * - Test behavior, NOT implementation details
 * 
 * Implementation Note:
 * Input-Checkbox-Legal wraps Input-Checkbox-Base, so some queries need to
 * traverse through nested shadow DOMs. Helper functions are provided for this.
 * 
 * @module Input-Checkbox-Legal/__tests__
 * @see Requirements: 9.1-9.11, 11.7 in .kiro/specs/046-input-checkbox-base/requirements.md
 */

import { InputCheckboxLegalElement } from '../platforms/web/InputCheckboxLegal.web';
import { InputCheckboxBaseElement } from '../../Input-Checkbox-Base/platforms/web/InputCheckboxBase.web';
import { IconBaseElement } from '../../Icon-Base/platforms/web/IconBase.web';
import { ConsentChangeData } from '../types';

/**
 * Helper to get the wrapped Base checkbox from Legal component.
 * Legal wraps Base, so we need to query through the nested shadow DOM.
 */
function getBaseCheckbox(legal: InputCheckboxLegalElement): InputCheckboxBaseElement | null {
  return legal.shadowRoot?.querySelector('input-checkbox-base') as InputCheckboxBaseElement | null;
}

/**
 * Helper to get the native input from the wrapped Base checkbox.
 * Traverses: Legal shadow DOM -> Base element -> Base shadow DOM -> input
 */
function getNativeInput(legal: InputCheckboxLegalElement): HTMLInputElement | null {
  const base = getBaseCheckbox(legal);
  return base?.shadowRoot?.querySelector('.checkbox__input') as HTMLInputElement | null;
}

/**
 * Helper to get the checkbox wrapper from the wrapped Base checkbox.
 */
function getCheckboxWrapper(legal: InputCheckboxLegalElement): Element | null {
  const base = getBaseCheckbox(legal);
  return base?.shadowRoot?.querySelector('.checkbox') ?? null;
}

/**
 * Helper to get the checkbox box from the wrapped Base checkbox.
 */
function getCheckboxBox(legal: InputCheckboxLegalElement): Element | null {
  const base = getBaseCheckbox(legal);
  return base?.shadowRoot?.querySelector('.checkbox__box') ?? null;
}

describe('Input-Checkbox-Legal Web Component', () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeAll(() => {
    // Ensure custom elements are registered
    if (!customElements.get('icon-base')) {
      customElements.define('icon-base', IconBaseElement);
    }
    if (!customElements.get('input-checkbox-base')) {
      customElements.define('input-checkbox-base', InputCheckboxBaseElement);
    }
    if (!customElements.get('input-checkbox-legal')) {
      customElements.define('input-checkbox-legal', InputCheckboxLegalElement);
    }
  });

  beforeEach(async () => {
    // Wait for custom elements to be defined
    await customElements.whenDefined('input-checkbox-legal');
    await customElements.whenDefined('input-checkbox-base');
    await customElements.whenDefined('icon-base');
    
    // Spy on console.warn for consent warning tests
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean up any created elements
    document.body.innerHTML = '';
    // Restore console.warn
    consoleWarnSpy.mockRestore();
  });

  // ============================================================================
  // Custom Element Registration
  // ============================================================================
  
  describe('Custom Element Registration', () => {
    it('should be registered as "input-checkbox-legal" custom element', () => {
      const ElementClass = customElements.get('input-checkbox-legal');
      expect(ElementClass).toBe(InputCheckboxLegalElement);
    });

    it('should be creatable via document.createElement', () => {
      const checkbox = document.createElement('input-checkbox-legal');
      expect(checkbox).toBeInstanceOf(InputCheckboxLegalElement);
    });

    it('should have correct tag name', () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      expect(checkbox.tagName.toLowerCase()).toBe('input-checkbox-legal');
    });
  });

  // ============================================================================
  // Explicit Consent Enforcement
  // ============================================================================
  
  describe('Explicit Consent Enforcement', () => {
    /**
     * @see Requirements: 9.3-9.4 - Explicit consent enforcement
     * @see Requirements: 11.7 - Test explicit consent enforcement
     */
    it('should override pre-checked state when requiresExplicitConsent is true (default)', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.setAttribute('checked', '');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Should be overridden to unchecked
      expect(checkbox.checked).toBe(false);
    });

    it('should emit console warning when pre-check is attempted', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.setAttribute('checked', '');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Pre-checked state not allowed')
      );
    });

    it('should override checked when set via property with requiresExplicitConsent', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Try to set checked via property
      checkbox.checked = true;
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Should be overridden to unchecked
      expect(checkbox.checked).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should allow pre-checked state when requiresExplicitConsent is false', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.setAttribute('requires-explicit-consent', 'false');
      checkbox.setAttribute('checked', '');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Should remain checked
      expect(checkbox.checked).toBe(true);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should default requiresExplicitConsent to true', () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      expect(checkbox.requiresExplicitConsent).toBe(true);
    });
  });

  // ============================================================================
  // ISO 8601 Timestamp Format
  // ============================================================================
  
  describe('ISO 8601 Timestamp Format', () => {
    /**
     * @see Requirements: 9.5 - ISO 8601 timestamp in callback
     * @see Requirements: 11.7 - Test ISO 8601 timestamp format
     */
    it('should provide ISO 8601 timestamp in onConsentChange callback', async () => {
      const onConsentChange = jest.fn();
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.onConsentChange = onConsentChange;
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Click to toggle - use the native input from wrapped Base
      const input = getNativeInput(checkbox);
      expect(input).toBeTruthy();
      input!.click();
      
      expect(onConsentChange).toHaveBeenCalledTimes(1);
      const callData = onConsentChange.mock.calls[0][0] as ConsentChangeData;
      
      // Verify ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
      expect(callData.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should provide ISO 8601 timestamp in consent-change event', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const eventHandler = jest.fn();
      checkbox.addEventListener('consent-change', eventHandler);
      
      // Click to toggle
      const input = getNativeInput(checkbox);
      expect(input).toBeTruthy();
      input!.click();
      
      expect(eventHandler).toHaveBeenCalledTimes(1);
      const eventData = eventHandler.mock.calls[0][0].detail as ConsentChangeData;
      
      // Verify ISO 8601 format
      expect(eventData.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should provide valid parseable timestamp', async () => {
      const onConsentChange = jest.fn();
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.onConsentChange = onConsentChange;
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = getNativeInput(checkbox);
      expect(input).toBeTruthy();
      input!.click();
      
      const callData = onConsentChange.mock.calls[0][0] as ConsentChangeData;
      const parsedDate = new Date(callData.timestamp);
      
      // Should be a valid date
      expect(parsedDate.toString()).not.toBe('Invalid Date');
      // Should be recent (within last minute)
      expect(Date.now() - parsedDate.getTime()).toBeLessThan(60000);
    });
  });

  // ============================================================================
  // Audit Trail Data
  // ============================================================================
  
  describe('Audit Trail Data', () => {
    /**
     * @see Requirements: 9.6-9.7 - Audit trail (legalTextId, version)
     * @see Requirements: 11.7 - Test audit trail data
     */
    it('should include legalTextId in callback when provided', async () => {
      const onConsentChange = jest.fn();
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.setAttribute('legal-text-id', 'tos-v2');
      checkbox.onConsentChange = onConsentChange;
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = getNativeInput(checkbox);
      expect(input).toBeTruthy();
      input!.click();
      
      const callData = onConsentChange.mock.calls[0][0] as ConsentChangeData;
      expect(callData.legalTextId).toBe('tos-v2');
    });

    it('should include legalTextVersion in callback when provided', async () => {
      const onConsentChange = jest.fn();
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.setAttribute('legal-text-version', '2.0.0');
      checkbox.onConsentChange = onConsentChange;
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = getNativeInput(checkbox);
      expect(input).toBeTruthy();
      input!.click();
      
      const callData = onConsentChange.mock.calls[0][0] as ConsentChangeData;
      expect(callData.legalTextVersion).toBe('2.0.0');
    });

    it('should include both legalTextId and version in callback', async () => {
      const onConsentChange = jest.fn();
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.setAttribute('legal-text-id', 'privacy-policy');
      checkbox.setAttribute('legal-text-version', '1.5.0');
      checkbox.onConsentChange = onConsentChange;
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = getNativeInput(checkbox);
      expect(input).toBeTruthy();
      input!.click();
      
      const callData = onConsentChange.mock.calls[0][0] as ConsentChangeData;
      expect(callData.legalTextId).toBe('privacy-policy');
      expect(callData.legalTextVersion).toBe('1.5.0');
    });

    it('should not include legalTextId when not provided', async () => {
      const onConsentChange = jest.fn();
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.onConsentChange = onConsentChange;
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = getNativeInput(checkbox);
      expect(input).toBeTruthy();
      input!.click();
      
      const callData = onConsentChange.mock.calls[0][0] as ConsentChangeData;
      expect(callData.legalTextId).toBeUndefined();
    });

    it('should include consented boolean in callback', async () => {
      const onConsentChange = jest.fn();
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.onConsentChange = onConsentChange;
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // First click - consent given
      let input = getNativeInput(checkbox);
      expect(input).toBeTruthy();
      input!.click();
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(onConsentChange).toHaveBeenCalledTimes(1);
      expect(onConsentChange.mock.calls[0][0].consented).toBe(true);
      
      // Get fresh reference to input after re-render
      input = getNativeInput(checkbox);
      expect(input).toBeTruthy();
      
      // Second click - consent withdrawn
      input!.click();
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(onConsentChange).toHaveBeenCalledTimes(2);
      expect(onConsentChange.mock.calls[1][0].consented).toBe(false);
    });

    it('should include audit trail in consent-change event detail', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.setAttribute('legal-text-id', 'gdpr-consent');
      checkbox.setAttribute('legal-text-version', '3.0');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const eventHandler = jest.fn();
      checkbox.addEventListener('consent-change', eventHandler);
      
      const input = getNativeInput(checkbox);
      expect(input).toBeTruthy();
      input!.click();
      
      const eventData = eventHandler.mock.calls[0][0].detail as ConsentChangeData;
      expect(eventData.consented).toBe(true);
      expect(eventData.legalTextId).toBe('gdpr-consent');
      expect(eventData.legalTextVersion).toBe('3.0');
      expect(eventData.timestamp).toBeDefined();
    });
  });

  // ============================================================================
  // Fixed Configuration
  // ============================================================================
  
  describe('Fixed Configuration', () => {
    /**
     * @see Requirements: 9.1-9.2 - Fixed sizing and alignment
     * @see Requirements: 11.7 - Test fixed configuration
     */
    it('should render with fixed lg box size (checkbox--legal class on container)', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Legal container should have checkbox--legal class
      const container = checkbox.shadowRoot?.querySelector('.checkbox-container');
      expect(container?.classList.contains('checkbox--legal')).toBe(true);
      
      // Wrapped Base should have lg size
      const base = getBaseCheckbox(checkbox);
      expect(base?.getAttribute('size')).toBe('lg');
    });

    it('should not have size attribute in observed attributes', () => {
      // Legal component should not observe size attribute
      const observedAttrs = InputCheckboxLegalElement.observedAttributes;
      expect(observedAttrs).not.toContain('size');
    });

    it('should not have label-align attribute in observed attributes', () => {
      // Legal component should not observe label-align attribute
      const observedAttrs = InputCheckboxLegalElement.observedAttributes;
      expect(observedAttrs).not.toContain('label-align');
    });

    it('should not have indeterminate attribute in observed attributes', () => {
      // Legal component should not observe indeterminate attribute
      const observedAttrs = InputCheckboxLegalElement.observedAttributes;
      expect(observedAttrs).not.toContain('indeterminate');
    });

    it('should configure Base with top alignment', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to the Terms of Service and Privacy Policy which may span multiple lines');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Wrapped Base should have top alignment
      const base = getBaseCheckbox(checkbox);
      expect(base?.getAttribute('label-align')).toBe('top');
    });

    it('should configure Base with sm label typography', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Wrapped Base should have sm label typography
      const base = getBaseCheckbox(checkbox);
      expect(base?.getAttribute('label-typography')).toBe('sm');
    });
  });

  // ============================================================================
  // Required Indicator
  // ============================================================================
  
  describe('Required Indicator', () => {
    /**
     * @see Requirements: 9.8-9.9 - Required indicator default visible
     * @see Requirements: 11.7 - Test required indicator default visibility
     */
    it('should show required indicator by default', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const requiredIndicator = checkbox.shadowRoot?.querySelector('.checkbox__required');
      expect(requiredIndicator).toBeTruthy();
      expect(requiredIndicator?.textContent).toBe('Required');
    });

    it('should default showRequiredIndicator to true', () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      expect(checkbox.showRequiredIndicator).toBe(true);
    });

    it('should hide required indicator when show-required-indicator is false', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.setAttribute('show-required-indicator', 'false');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const requiredIndicator = checkbox.shadowRoot?.querySelector('.checkbox__required');
      expect(requiredIndicator).toBeNull();
    });

    it('should show required indicator when show-required-indicator is explicitly true', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.setAttribute('show-required-indicator', 'true');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const requiredIndicator = checkbox.shadowRoot?.querySelector('.checkbox__required');
      expect(requiredIndicator).toBeTruthy();
    });
  });

  // ============================================================================
  // Indeterminate State Rejection
  // ============================================================================
  
  describe('Indeterminate State Rejection', () => {
    /**
     * @see Requirements: 9.10 - No indeterminate state support
     * @see Requirements: 11.7 - Test indeterminate state rejection
     */
    it('should not support indeterminate state', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Legal checkbox should not have indeterminate property
      expect((checkbox as any).indeterminate).toBeUndefined();
    });

    it('should not render indeterminate visual state', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      // Try to set indeterminate attribute (should be ignored)
      checkbox.setAttribute('indeterminate', '');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Wrapped Base should not have indeterminate class
      const wrapper = getCheckboxWrapper(checkbox);
      expect(wrapper?.classList.contains('checkbox--indeterminate')).toBe(false);
    });

    it('should only render check icon when checked (no minus icon)', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.setAttribute('requires-explicit-consent', 'false');
      checkbox.setAttribute('checked', '');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Should have check icon, not minus icon - query through Base's shadow DOM
      const box = getCheckboxBox(checkbox);
      const icon = box?.querySelector('svg.icon-base');
      expect(icon).toBeTruthy();
      expect(icon?.classList.contains('icon-base-check')).toBe(true);
      expect(icon?.classList.contains('icon-base-minus')).toBe(false);
    });
  });

  // ============================================================================
  // Form Integration
  // ============================================================================
  
  describe('Form Integration', () => {
    it('should reset to unchecked on form reset', async () => {
      const form = document.createElement('form');
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.setAttribute('requires-explicit-consent', 'false');
      checkbox.setAttribute('checked', '');
      form.appendChild(checkbox);
      document.body.appendChild(form);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(checkbox.checked).toBe(true);
      
      form.reset();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(checkbox.checked).toBe(false);
    });

    it('should include name attribute on native input', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.setAttribute('name', 'consent');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Name should be forwarded to Base's native input
      const input = getNativeInput(checkbox);
      expect(input?.getAttribute('name')).toBe('consent');
    });
  });

  // ============================================================================
  // Accessibility
  // ============================================================================
  
  describe('Accessibility', () => {
    it('should set aria-invalid when error is present', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.setAttribute('error-message', 'You must accept the terms');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // aria-invalid should be on Base's native input
      const input = getNativeInput(checkbox);
      expect(input?.getAttribute('aria-invalid')).toBe('true');
    });

    it('should associate error message via aria-describedby', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.setAttribute('error-message', 'Required');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // aria-describedby should be on Base's native input
      const base = getBaseCheckbox(checkbox);
      const input = getNativeInput(checkbox);
      const error = base?.shadowRoot?.querySelector('.checkbox__error');
      const describedBy = input?.getAttribute('aria-describedby');
      
      expect(describedBy).toContain(error?.id);
    });

    it('should have aria-hidden on required indicator', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Required indicator is in Legal's shadow DOM (not Base's)
      const requiredIndicator = checkbox.shadowRoot?.querySelector('.checkbox__required');
      expect(requiredIndicator?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  // ============================================================================
  // Events
  // ============================================================================
  
  describe('Events', () => {
    it('should dispatch consent-change event with bubbles and composed', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const eventHandler = jest.fn();
      checkbox.addEventListener('consent-change', eventHandler);
      
      const input = getNativeInput(checkbox);
      expect(input).toBeTruthy();
      input!.click();
      
      const event = eventHandler.mock.calls[0][0] as CustomEvent;
      expect(event.bubbles).toBe(true);
      expect(event.composed).toBe(true);
    });

    it('should also dispatch standard change event', async () => {
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const changeHandler = jest.fn();
      checkbox.addEventListener('change', changeHandler);
      
      const input = getNativeInput(checkbox);
      expect(input).toBeTruthy();
      input!.click();
      
      expect(changeHandler).toHaveBeenCalledTimes(1);
      expect(changeHandler.mock.calls[0][0].detail.checked).toBe(true);
    });

    it('should call onChange callback when toggled', async () => {
      const onChange = jest.fn();
      const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
      checkbox.setAttribute('label', 'I agree to terms');
      checkbox.onChange = onChange;
      document.body.appendChild(checkbox);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const input = getNativeInput(checkbox);
      expect(input).toBeTruthy();
      input!.click();
      
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });
});
