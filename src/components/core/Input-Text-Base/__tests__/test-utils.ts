/**
 * Test utilities for Input-Text-Base component testing
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Primitive (Base)
 * 
 * Provides helper functions for:
 * - CSS custom property setup for blend utilities
 * - Custom element registration
 * - Component cleanup
 * 
 * Input-Text-Base uses blend utilities that read base colors from CSS custom properties.
 * These utilities ensure the required properties are available in the test environment.
 */

import { InputTextBase } from '../platforms/web/InputTextBase.web';

/**
 * Set up required CSS custom properties for Input-Text-Base blend utilities.
 * 
 * Input-Text-Base uses blend utilities that read base colors from CSS custom properties.
 * This function sets up the required properties in the test environment.
 * 
 * Required properties:
 * - --color-primary: Base primary color for blend calculations
 * 
 * @see InputTextBase._calculateBlendColors() for usage
 */
export function setupBlendColorProperties(): void {
  // Set up required CSS custom properties on document root
  // These values match the design system's semantic color tokens
  document.documentElement.style.setProperty('--color-primary', '#A855F7');
}

/**
 * Clean up CSS custom properties set by setupBlendColorProperties
 */
export function cleanupBlendColorProperties(): void {
  document.documentElement.style.removeProperty('--color-primary');
}

/**
 * Register the Input-Text-Base custom element if not already registered
 * Prevents "already defined" errors in test suites
 * 
 * Also sets up required CSS custom properties for blend utilities.
 */
export function registerInputTextBase(): void {
  // Set up CSS custom properties required for blend utilities
  setupBlendColorProperties();
  
  if (!customElements.get('input-text-base')) {
    customElements.define('input-text-base', InputTextBase);
  }
}

/**
 * Create an Input-Text-Base element with required setup
 * 
 * @param attributes - Attributes to set on the element
 * @returns The created Input-Text-Base element
 */
export function createInputTextBase(attributes: Record<string, string> = {}): InputTextBase {
  registerInputTextBase();
  
  const element = document.createElement('input-text-base') as InputTextBase;
  
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  
  return element;
}

// Legacy aliases for backward compatibility during migration
/** @deprecated Use registerInputTextBase instead */
export const registerTextInputField = registerInputTextBase;
/** @deprecated Use createInputTextBase instead */
export const createTextInputField = createInputTextBase;
