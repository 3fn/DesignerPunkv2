/**
 * Test utilities for ButtonCTA component testing
 * 
 * Provides helper functions for:
 * - Custom element registration
 * - Shadow DOM rendering waits
 * - Component cleanup
 * 
 * Task 6.1: Set up test infrastructure
 */

import { ButtonCTA } from '../platforms/web/ButtonCTA.web';

/**
 * Register the ButtonCTA custom element if not already registered
 * Prevents "already defined" errors in test suites
 */
export function registerButtonCTA(): void {
  if (!customElements.get('button-cta')) {
    customElements.define('button-cta', ButtonCTA);
  }
}

/**
 * Wait for shadow DOM to be initialized and rendered
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
 * Create a ButtonCTA element with shadow DOM ready
 * 
 * @param props - Initial properties for the button
 * @returns Promise resolving to the created button element
 */
export async function createButtonCTA(props: {
  label: string;
  size?: 'small' | 'medium' | 'large';
  buttonStyle?: 'primary' | 'secondary' | 'tertiary';
  icon?: string;
  noWrap?: boolean;
  disabled?: boolean;
  testID?: string;
}): Promise<ButtonCTA> {
  registerButtonCTA();
  
  const button = document.createElement('button-cta') as ButtonCTA;
  
  // Set properties
  button.label = props.label;
  if (props.size) button.size = props.size;
  if (props.buttonStyle) button.buttonStyle = props.buttonStyle;
  if (props.icon) button.icon = props.icon;
  if (props.noWrap !== undefined) button.noWrap = props.noWrap;
  if (props.disabled !== undefined) button.disabled = props.disabled;
  if (props.testID) button.testID = props.testID;
  
  // Append to document to trigger rendering
  document.body.appendChild(button);
  
  // Wait for shadow DOM to be ready
  await waitForShadowDOM(button);
  
  return button;
}

/**
 * Clean up a ButtonCTA element from the DOM
 * 
 * @param button - The button element to clean up
 */
export function cleanupButtonCTA(button: ButtonCTA): void {
  if (button.parentNode) {
    button.parentNode.removeChild(button);
  }
}

/**
 * Get the shadow button element from a ButtonCTA
 * 
 * @param button - The ButtonCTA custom element
 * @returns The button element inside shadow DOM, or null if not found
 */
export function getShadowButton(button: ButtonCTA): HTMLButtonElement | null {
  return button.shadowRoot?.querySelector('button') || null;
}

/**
 * Get the icon element from a ButtonCTA
 * 
 * @param button - The ButtonCTA custom element
 * @returns The icon element inside shadow DOM, or null if not found
 */
export function getIconElement(button: ButtonCTA): HTMLElement | null {
  return button.shadowRoot?.querySelector('.button-cta__icon') || null;
}

/**
 * Get the label element from a ButtonCTA
 * 
 * @param button - The ButtonCTA custom element
 * @returns The label element inside shadow DOM, or null if not found
 */
export function getLabelElement(button: ButtonCTA): HTMLElement | null {
  return button.shadowRoot?.querySelector('.button-cta__label, .button-cta__label--no-wrap') || null;
}

/**
 * Simulate a click on the button
 * 
 * @param button - The ButtonCTA custom element
 */
export function clickButton(button: ButtonCTA): void {
  const shadowButton = getShadowButton(button);
  if (shadowButton) {
    shadowButton.click();
  }
}

/**
 * Check if button has a specific CSS class
 * 
 * @param button - The ButtonCTA custom element
 * @param className - The class name to check for
 * @returns True if the button has the class, false otherwise
 */
export function hasClass(button: ButtonCTA, className: string): boolean {
  const shadowButton = getShadowButton(button);
  return shadowButton?.classList.contains(className) || false;
}
