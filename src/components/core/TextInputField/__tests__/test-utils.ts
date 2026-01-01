/**
 * Test utilities for TextInputField component testing
 * 
 * Provides helper functions for:
 * - CSS custom property setup for blend utilities
 * - Custom element registration
 * - Component cleanup
 * 
 * TextInputField uses blend utilities that read base colors from CSS custom properties.
 * These utilities ensure the required properties are available in the test environment.
 */

import { TextInputField } from '../platforms/web/TextInputField.web';

/**
 * Set up required CSS custom properties for TextInputField blend utilities.
 * 
 * TextInputField uses blend utilities that read base colors from CSS custom properties.
 * This function sets up the required properties in the test environment.
 * 
 * Required properties:
 * - --color-primary: Base primary color for blend calculations
 * 
 * @see TextInputField._calculateBlendColors() for usage
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
 * Register the TextInputField custom element if not already registered
 * Prevents "already defined" errors in test suites
 * 
 * Also sets up required CSS custom properties for blend utilities.
 */
export function registerTextInputField(): void {
  // Set up CSS custom properties required for blend utilities
  setupBlendColorProperties();
  
  if (!customElements.get('text-input-field')) {
    customElements.define('text-input-field', TextInputField);
  }
}

/**
 * Create a TextInputField element with required setup
 * 
 * @param attributes - Attributes to set on the element
 * @returns The created TextInputField element
 */
export function createTextInputField(attributes: Record<string, string> = {}): TextInputField {
  registerTextInputField();
  
  const element = document.createElement('text-input-field') as TextInputField;
  
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  
  return element;
}
