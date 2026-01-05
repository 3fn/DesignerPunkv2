/**
 * Test utilities for Button-Icon component testing
 * 
 * Provides helper functions for:
 * - Custom element registration
 * - Shadow DOM rendering waits
 * - Component cleanup
 * - CSS custom property setup for token-based styling
 * 
 * Stemma System Naming: [Family]-[Type] = Button-Icon
 * Component Type: Primitive (foundational component)
 * 
 * @module Button-Icon/__tests__/test-utils
 */

import { ButtonIcon } from '../platforms/web/ButtonIcon.web';
import { ButtonIconSize, ButtonIconVariant } from '../types';

/**
 * Set up required CSS custom properties for Button-Icon token-based styling.
 * 
 * Button-Icon uses CSS custom properties for all styling (zero hard-coded values).
 * This function sets up the required properties in the test environment.
 * 
 * Required properties:
 * - --color-primary: Base primary color
 * - --color-contrast-on-primary: Content color on primary background
 * - --color-background-primary-subtle: Subtle background for hover states
 * - --accessibility-focus-*: Focus ring tokens
 * - --border-*: Border width tokens
 * - --duration-150: Animation duration token
 * 
 * @see ButtonIcon._generateStyles() for usage
 */
export function setupButtonIconTokens(): void {
  // Color tokens
  document.documentElement.style.setProperty('--color-primary', '#A855F7');
  document.documentElement.style.setProperty('--color-contrast-on-primary', '#FFFFFF');
  document.documentElement.style.setProperty('--color-background-primary-subtle', '#F3E8FF');
  
  // Focus ring tokens
  document.documentElement.style.setProperty('--accessibility-focus-offset', '2px');
  document.documentElement.style.setProperty('--accessibility-focus-width', '2px');
  document.documentElement.style.setProperty('--accessibility-focus-color', '#A855F7');
  
  // Border tokens
  document.documentElement.style.setProperty('--border-border-default', '1px');
  document.documentElement.style.setProperty('--border-border-emphasis', '2px');
  
  // Animation token
  document.documentElement.style.setProperty('--duration-150', '150ms');
  
  // Icon stroke width token (required by Icon-Base)
  document.documentElement.style.setProperty('--icon-stroke-width', '2');
}

/**
 * Clean up CSS custom properties set by setupButtonIconTokens
 */
export function cleanupButtonIconTokens(): void {
  document.documentElement.style.removeProperty('--color-primary');
  document.documentElement.style.removeProperty('--color-contrast-on-primary');
  document.documentElement.style.removeProperty('--color-background-primary-subtle');
  document.documentElement.style.removeProperty('--accessibility-focus-offset');
  document.documentElement.style.removeProperty('--accessibility-focus-width');
  document.documentElement.style.removeProperty('--accessibility-focus-color');
  document.documentElement.style.removeProperty('--border-border-default');
  document.documentElement.style.removeProperty('--border-border-emphasis');
  document.documentElement.style.removeProperty('--duration-150');
  document.documentElement.style.removeProperty('--icon-stroke-width');
}

/**
 * Register the Button-Icon custom element if not already registered.
 * Prevents "already defined" errors in test suites.
 * 
 * Also sets up required CSS custom properties for token-based styling.
 */
export function registerButtonIcon(): void {
  // Set up CSS custom properties required for token-based styling
  setupButtonIconTokens();
  
  // ButtonIcon auto-registers on import, but we ensure it's registered
  if (!customElements.get('button-icon')) {
    customElements.define('button-icon', ButtonIcon);
  }
}

/**
 * Wait for shadow DOM to be initialized and rendered.
 * 
 * @param element - The custom element to wait for
 * @param timeout - Maximum time to wait in milliseconds (default: 1000ms)
 * @returns Promise that resolves when shadow DOM is ready
 */
export async function waitForShadowDOM(
  element: HTMLElement,
  timeout: number = 1000
): Promise<void> {
  const startTime = Date.now();
  
  while (!element.shadowRoot) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for shadow DOM to initialize');
    }
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  // Additional wait for shadow DOM content to render
  await new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Create a Button-Icon element with shadow DOM ready.
 * 
 * @param props - Initial properties for the button
 * @returns Promise resolving to the created button element
 */
export async function createButtonIcon(props: {
  icon: string;
  ariaLabel: string;
  size?: ButtonIconSize;
  variant?: ButtonIconVariant;
  testID?: string;
}): Promise<ButtonIcon> {
  registerButtonIcon();
  
  const button = document.createElement('button-icon') as ButtonIcon;
  
  // Set required properties
  button.icon = props.icon;
  button.ariaLabel = props.ariaLabel;
  
  // Set optional properties
  if (props.size) button.size = props.size;
  if (props.variant) button.buttonVariant = props.variant;
  if (props.testID) button.testID = props.testID;
  
  // Append to document to trigger rendering
  document.body.appendChild(button);
  
  // Wait for shadow DOM to be ready
  await waitForShadowDOM(button);
  
  return button;
}

/**
 * Clean up a Button-Icon element from the DOM.
 * 
 * @param button - The button element to clean up
 */
export function cleanupButtonIcon(button: ButtonIcon): void {
  if (button.parentNode) {
    button.parentNode.removeChild(button);
  }
}

/**
 * Get the shadow button element from a Button-Icon.
 * 
 * @param button - The Button-Icon custom element
 * @returns The button element inside shadow DOM, or null if not found
 */
export function getShadowButton(button: ButtonIcon): HTMLButtonElement | null {
  return button.shadowRoot?.querySelector('button') || null;
}

/**
 * Get the icon container element from a Button-Icon.
 * 
 * @param button - The Button-Icon custom element
 * @returns The icon container element inside shadow DOM, or null if not found
 */
export function getIconContainer(button: ButtonIcon): HTMLElement | null {
  return button.shadowRoot?.querySelector('.button-icon__icon') || null;
}

/**
 * Get the icon-base element from a Button-Icon.
 * 
 * @param button - The Button-Icon custom element
 * @returns The icon-base element inside shadow DOM, or null if not found
 */
export function getIconElement(button: ButtonIcon): HTMLElement | null {
  return button.shadowRoot?.querySelector('icon-base') || null;
}

/**
 * Simulate a click on the button.
 * 
 * @param button - The Button-Icon custom element
 */
export function clickButton(button: ButtonIcon): void {
  const shadowButton = getShadowButton(button);
  if (shadowButton) {
    shadowButton.click();
  }
}

/**
 * Simulate a keyboard event on the button.
 * 
 * @param button - The Button-Icon custom element
 * @param key - The key to simulate (e.g., 'Enter', ' ')
 */
export function pressKey(button: ButtonIcon, key: string): void {
  const shadowButton = getShadowButton(button);
  if (shadowButton) {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true
    });
    shadowButton.dispatchEvent(event);
  }
}

/**
 * Check if button has a specific CSS class.
 * 
 * @param button - The Button-Icon custom element
 * @param className - The class name to check for
 * @returns True if the button has the class, false otherwise
 */
export function hasClass(button: ButtonIcon, className: string): boolean {
  const shadowButton = getShadowButton(button);
  return shadowButton?.classList.contains(className) || false;
}

/**
 * Get computed style of the shadow button.
 * 
 * @param button - The Button-Icon custom element
 * @returns CSSStyleDeclaration of the shadow button, or null if not found
 */
export function getButtonComputedStyle(button: ButtonIcon): CSSStyleDeclaration | null {
  const shadowButton = getShadowButton(button);
  if (shadowButton) {
    return window.getComputedStyle(shadowButton);
  }
  return null;
}
