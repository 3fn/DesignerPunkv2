/**
 * Input-Checkbox-Legal Type Definitions
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic Variant
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Checkbox-Legal
 * 
 * Provides type-safe props for the Input-Checkbox-Legal component across all platforms.
 * Input-Checkbox-Legal is a specialized checkbox for legal consent scenarios
 * (terms of service, privacy policies, GDPR consent) with audit capabilities
 * and stricter validation.
 * 
 * Key Differences from Input-Checkbox-Base:
 * - Fixed sizing: lg box (40px) with labelSm typography
 * - Fixed label alignment: top (for multi-line legal text)
 * - No indeterminate state support
 * - Explicit consent enforcement (prevents pre-checking)
 * - Audit trail support (timestamp, legalTextId, version)
 * - Required indicator visible by default
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered.
 * 
 * @module Input-Checkbox-Legal/types
 * @see .kiro/specs/046-input-checkbox-base/design.md for design specification
 * @see Requirement 9 in .kiro/specs/046-input-checkbox-base/requirements.md
 */

import type { InputCheckboxBaseProps } from '../Input-Checkbox-Base/types';

/**
 * Consent change event data with audit trail information.
 * 
 * This interface defines the data passed to the onConsentChange callback,
 * providing all information needed for legal audit trails.
 * 
 * @see Requirement 9.5-9.7 in .kiro/specs/046-input-checkbox-base/requirements.md
 * 
 * @example
 * ```typescript
 * const handleConsent = (data: ConsentChangeData) => {
 *   console.log('Consented:', data.consented);
 *   console.log('Timestamp:', data.timestamp); // ISO 8601 format
 *   console.log('Legal Text ID:', data.legalTextId);
 *   console.log('Version:', data.legalTextVersion);
 * };
 * ```
 */
export interface ConsentChangeData {
  /**
   * Whether consent was given (true) or withdrawn (false).
   */
  consented: boolean;
  
  /**
   * ISO 8601 timestamp of when consent state changed.
   * 
   * Format: YYYY-MM-DDTHH:mm:ss.sssZ
   * 
   * @example '2026-02-05T14:30:00.000Z'
   */
  timestamp: string;
  
  /**
   * ID linking to full legal text (for audit trail).
   * 
   * Only present if legalTextId prop was provided.
   */
  legalTextId?: string;
  
  /**
   * Version of legal text being consented to.
   * 
   * Only present if legalTextVersion prop was provided.
   */
  legalTextVersion?: string;
}

/**
 * Props interface for Input-Checkbox-Legal component (platform-agnostic).
 * 
 * Extends Input-Checkbox-Base but omits size, indeterminate, and labelAlign
 * as these are fixed for legal consent scenarios:
 * - Size: Always 'lg' box (40px) with labelSm typography
 * - Label alignment: Always 'top' (for multi-line legal text)
 * - Indeterminate: Not supported (legal consent is binary)
 * 
 * @see Requirement 9.1-9.11 in .kiro/specs/046-input-checkbox-base/requirements.md
 * 
 * @example
 * ```typescript
 * // Basic legal consent usage
 * const props: InputCheckboxLegalProps = {
 *   label: 'I agree to the Terms of Service and Privacy Policy',
 *   onConsentChange: (data) => {
 *     console.log('Consent:', data.consented, 'at', data.timestamp);
 *   }
 * };
 * 
 * // With audit trail
 * const auditProps: InputCheckboxLegalProps = {
 *   label: 'I consent to the processing of my personal data as described in the Privacy Policy',
 *   legalTextId: 'privacy-policy-v2',
 *   legalTextVersion: '2.1.0',
 *   requiresExplicitConsent: true,
 *   onConsentChange: (data) => {
 *     // Log to audit system
 *     auditLog.record({
 *       action: data.consented ? 'CONSENT_GIVEN' : 'CONSENT_WITHDRAWN',
 *       timestamp: data.timestamp,
 *       documentId: data.legalTextId,
 *       documentVersion: data.legalTextVersion
 *     });
 *   }
 * };
 * ```
 */
export interface InputCheckboxLegalProps extends Omit<InputCheckboxBaseProps, 'size' | 'indeterminate' | 'labelAlign'> {
  /**
   * Prevents checkbox from being pre-checked (GDPR compliance).
   * 
   * When true, if `checked={true}` is passed, the component will:
   * 1. Override to `checked={false}`
   * 2. Emit a console warning for developer feedback
   * 
   * This ensures explicit user action is required for consent.
   * 
   * @default true
   * @see Requirement 9.3-9.4 in .kiro/specs/046-input-checkbox-base/requirements.md
   */
  requiresExplicitConsent?: boolean;
  
  /**
   * Callback with ISO 8601 timestamp when consent changes.
   * 
   * Called whenever the checkbox state changes, providing:
   * - consented: boolean indicating consent state
   * - timestamp: ISO 8601 formatted timestamp
   * - legalTextId: ID of legal text (if provided)
   * - legalTextVersion: Version of legal text (if provided)
   * 
   * @param data - Consent change data with audit trail information
   * @see Requirement 9.5-9.7 in .kiro/specs/046-input-checkbox-base/requirements.md
   */
  onConsentChange?: (data: ConsentChangeData) => void;
  
  /**
   * ID linking to full legal text (for audit trail).
   * 
   * This ID should reference the specific legal document being consented to.
   * It will be included in the onConsentChange callback for audit purposes.
   * 
   * @example 'terms-of-service-v3', 'privacy-policy-2024', 'gdpr-consent-form'
   * @see Requirement 9.6 in .kiro/specs/046-input-checkbox-base/requirements.md
   */
  legalTextId?: string;
  
  /**
   * Version of legal text being consented to.
   * 
   * This version should match the specific version of the legal document.
   * It will be included in the onConsentChange callback for audit purposes.
   * 
   * @example '1.0.0', '2024-01-15', 'v3.2'
   * @see Requirement 9.7 in .kiro/specs/046-input-checkbox-base/requirements.md
   */
  legalTextVersion?: string;
  
  /**
   * Whether to show "Required" indicator.
   * 
   * When true, displays a visual indicator that this consent is required.
   * Defaults to true for legal consent scenarios.
   * 
   * @default true
   * @see Requirement 9.8-9.9 in .kiro/specs/046-input-checkbox-base/requirements.md
   */
  showRequiredIndicator?: boolean;
}

/**
 * Observed attributes for the Input-Checkbox-Legal web component.
 * 
 * These attributes trigger re-rendering when changed via attributeChangedCallback.
 * Extends base attributes with legal-specific attributes.
 * 
 * Note: size, indeterminate, and label-align are NOT included as they are fixed.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
 */
export const INPUT_CHECKBOX_LEGAL_OBSERVED_ATTRIBUTES = [
  'checked',
  'label',
  'helper-text',
  'error-message',
  'test-id',
  'name',
  'value',
  'requires-explicit-consent',
  'legal-text-id',
  'legal-text-version',
  'show-required-indicator'
] as const;

/**
 * Type for observed attribute names.
 * 
 * Derived from INPUT_CHECKBOX_LEGAL_OBSERVED_ATTRIBUTES for type safety.
 */
export type InputCheckboxLegalObservedAttribute = typeof INPUT_CHECKBOX_LEGAL_OBSERVED_ATTRIBUTES[number];

/**
 * Web component interface for Input-Checkbox-Legal.
 * 
 * Extends HTMLElement with Input-Checkbox-Legal specific properties and methods.
 * This interface defines the contract for the InputCheckboxLegalElement web component
 * implementation.
 * 
 * @see Requirement 9.1 in .kiro/specs/046-input-checkbox-base/requirements.md
 * 
 * @example
 * ```typescript
 * // Create element programmatically
 * const checkbox = document.createElement('input-checkbox-legal') as InputCheckboxLegalElement;
 * checkbox.label = 'I agree to the Terms of Service';
 * checkbox.legalTextId = 'tos-v2';
 * checkbox.legalTextVersion = '2.0.0';
 * checkbox.onConsentChange = (data) => console.log('Consent:', data);
 * document.body.appendChild(checkbox);
 * 
 * // Query existing element
 * const existingCheckbox = document.querySelector('input-checkbox-legal') as InputCheckboxLegalElement;
 * console.log(existingCheckbox.checked);
 * ```
 */
export interface InputCheckboxLegalElement extends HTMLElement {
  /**
   * Whether checkbox is checked.
   * 
   * Reflects the 'checked' attribute.
   * Note: If requiresExplicitConsent is true and checked is set to true
   * programmatically, it will be overridden to false with a console warning.
   */
  checked: boolean;
  
  /**
   * Label text.
   * 
   * Reflects the 'label' attribute.
   * Label text is never truncated in legal checkboxes.
   */
  label: string;
  
  /**
   * Helper text.
   * 
   * Reflects the 'helper-text' attribute.
   */
  helperText: string | null;
  
  /**
   * Error message.
   * 
   * Reflects the 'error-message' attribute.
   */
  errorMessage: string | null;
  
  /**
   * Test ID for automated testing.
   * 
   * Reflects the 'test-id' attribute.
   */
  testID: string | null;
  
  /**
   * Form field name.
   * 
   * Reflects the 'name' attribute.
   */
  name: string | null;
  
  /**
   * Form field value when checked.
   * 
   * Reflects the 'value' attribute.
   */
  value: string;
  
  /**
   * Whether explicit consent is required.
   * 
   * Reflects the 'requires-explicit-consent' attribute.
   */
  requiresExplicitConsent: boolean;
  
  /**
   * Legal text ID for audit trail.
   * 
   * Reflects the 'legal-text-id' attribute.
   */
  legalTextId: string | null;
  
  /**
   * Legal text version for audit trail.
   * 
   * Reflects the 'legal-text-version' attribute.
   */
  legalTextVersion: string | null;
  
  /**
   * Whether to show required indicator.
   * 
   * Reflects the 'show-required-indicator' attribute.
   */
  showRequiredIndicator: boolean;
  
  /**
   * Base onChange callback (inherited from Base).
   * 
   * Called when the checkbox state changes via user interaction.
   * This is a JavaScript property, not an HTML attribute.
   */
  onChange: ((checked: boolean) => void) | null;
  
  /**
   * Consent change callback with audit trail data.
   * 
   * Called when the checkbox state changes, providing full audit trail data.
   * This is a JavaScript property, not an HTML attribute.
   */
  onConsentChange: ((data: ConsentChangeData) => void) | null;
}

/**
 * Default values for Input-Checkbox-Legal props.
 * 
 * These defaults are applied when props are not explicitly provided.
 * Note: size is always 'lg', labelAlign is always 'top', and indeterminate
 * is not supported.
 * 
 * @see Design document defaults section
 */
export const INPUT_CHECKBOX_LEGAL_DEFAULTS = {
  checked: false,
  requiresExplicitConsent: true,
  showRequiredIndicator: true
} as const;
