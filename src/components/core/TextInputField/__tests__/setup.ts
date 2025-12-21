/**
 * Test Setup for TextInputField Component
 * 
 * This file provides utilities for setting up motion tokens in tests.
 * 
 * CRITICAL: JSDOM does not properly compute CSS custom properties from stylesheets
 * when using getComputedStyle() on Shadow DOM elements. Even with CSS rules that
 * should apply, getComputedStyle().getPropertyValue('--custom-prop') returns empty.
 * 
 * SOLUTION: Directly set inline styles on the elements that need the CSS custom
 * properties, bypassing JSDOM's CSS computation limitations.
 */

/**
 * Motion token values used by TextInputField
 */
export const MOTION_TOKENS = {
  floatLabelDuration: '250ms',
  floatLabelEasing: 'ease-out'
};

/**
 * Injects motion tokens into a TextInputField component's Shadow DOM elements.
 * 
 * JSDOM Limitation: CSS custom properties are not properly computed via
 * getComputedStyle() on Shadow DOM elements, even when set via stylesheets.
 * This function works around that by setting inline styles directly on the
 * elements that need the token values.
 * 
 * @param component - The text-input-field custom element
 */
export function injectMotionTokens(component: HTMLElement): void {
  const shadowRoot = (component as any).shadowRoot;
  if (!shadowRoot) {
    throw new Error('Component does not have a shadowRoot');
  }
  
  // Find the label element and set the CSS custom property directly
  const labelElement = shadowRoot.querySelector('.input-label');
  if (labelElement) {
    (labelElement as HTMLElement).style.setProperty('--motion-float-label-duration', MOTION_TOKENS.floatLabelDuration);
    (labelElement as HTMLElement).style.setProperty('--motion-float-label-easing', MOTION_TOKENS.floatLabelEasing);
  }
  
  // Also set on input-element for transition properties
  const inputElement = shadowRoot.querySelector('.input-element');
  if (inputElement) {
    (inputElement as HTMLElement).style.setProperty('--motion-float-label-duration', MOTION_TOKENS.floatLabelDuration);
    (inputElement as HTMLElement).style.setProperty('--motion-float-label-easing', MOTION_TOKENS.floatLabelEasing);
  }
  
  // Set on the host element as well for inheritance
  component.style.setProperty('--motion-float-label-duration', MOTION_TOKENS.floatLabelDuration);
  component.style.setProperty('--motion-float-label-easing', MOTION_TOKENS.floatLabelEasing);
}

/**
 * Injects motion tokens into all text-input-field components within a container.
 * Call this after setting container.innerHTML with text-input-field elements.
 * 
 * @param container - The container element containing text-input-field components
 */
export function injectMotionTokensInContainer(container: HTMLElement): void {
  const components = container.querySelectorAll('text-input-field');
  components.forEach(component => {
    injectMotionTokens(component as HTMLElement);
  });
}

/**
 * Creates a TextInputField component with motion tokens already injected.
 * Use this helper to avoid "Required motion token missing" errors.
 * 
 * @param attributes - Object of attribute name/value pairs to set on the component
 * @returns The created component with tokens injected
 */
export function createTextInputFieldWithTokens(
  attributes: Record<string, string> = {}
): HTMLElement {
  const component = document.createElement('text-input-field');
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    component.setAttribute(key, value);
  });
  
  // Inject motion tokens into Shadow DOM
  injectMotionTokens(component);
  
  return component;
}

// Also set up tokens on :root for any code that reads from document.documentElement
// (This is a fallback, but won't work for Shadow DOM elements in JSDOM)
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    :root {
      --motion-float-label-duration: 250ms;
      --motion-float-label-easing: ease-out;
    }
  `;
  document.head.appendChild(styleElement);
}

