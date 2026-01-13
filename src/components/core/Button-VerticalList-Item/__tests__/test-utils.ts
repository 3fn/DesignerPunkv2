/**
 * Test utilities for Button-VerticalList-Item component testing
 * 
 * Provides helper functions for:
 * - Custom element registration
 * - Shadow DOM rendering waits
 * - Component cleanup
 * - CSS custom property setup for token validation
 * 
 * Stemma System Naming: [Family]-[Type] = Button-VerticalList-Item
 * Component Type: Primitive (VerticalList-Item)
 * Custom Element Tag: <button-vertical-list-item>
 */

import { ButtonVerticalListItem } from '../platforms/web/ButtonVerticalListItem.web';
import { VisualState, CheckmarkTransition } from '../types';
import { IconBaseName } from '../../Icon-Base/types';

/**
 * Set up required CSS custom properties for Button-VerticalList-Item.
 * 
 * Button-VerticalList-Item requires these tokens to be present for fail-loudly validation.
 * This function sets up all required properties in the test environment.
 */
export function setupRequiredTokens(): void {
  const root = document.documentElement;
  
  // Color tokens
  root.style.setProperty('--color-background', '#FFFFFF');
  root.style.setProperty('--color-text-default', '#1A1A1A');
  root.style.setProperty('--color-text-muted', '#6B7280');
  root.style.setProperty('--color-select-selected-strong', '#06B6D4');
  root.style.setProperty('--color-select-selected-subtle', '#ECFEFF');
  root.style.setProperty('--color-select-not-selected-strong', '#6B7280');
  root.style.setProperty('--color-select-not-selected-subtle', '#F3F4F6');
  root.style.setProperty('--color-error-strong', '#DC2626');
  root.style.setProperty('--color-error-subtle', '#FEF2F2');
  
  // Border tokens
  root.style.setProperty('--border-default', '1px');
  root.style.setProperty('--border-emphasis', '2px');
  
  // Radius tokens (semantic + primitive for reference resolution)
  root.style.setProperty('--radius-100', '8px');
  root.style.setProperty('--radius-normal', '8px');
  
  // Spacing tokens
  root.style.setProperty('--space-inset-200', '16px');
  root.style.setProperty('--space-grouped-loose', '12px');
  
  // Accessibility tokens
  root.style.setProperty('--tap-area-recommended', '48px');
  root.style.setProperty('--accessibility-focus-width', '2px');
  root.style.setProperty('--accessibility-focus-offset', '2px');
  root.style.setProperty('--accessibility-focus-color', '#2563EB');
  
  // Motion tokens (semantic)
  root.style.setProperty('--motion-selection-transition-duration', '250ms');
  root.style.setProperty('--motion-selection-transition-easing', 'ease-in-out');
}

/**
 * Clean up CSS custom properties set by setupRequiredTokens
 */
export function cleanupRequiredTokens(): void {
  const root = document.documentElement;
  
  // Color tokens
  root.style.removeProperty('--color-background');
  root.style.removeProperty('--color-text-default');
  root.style.removeProperty('--color-text-muted');
  root.style.removeProperty('--color-select-selected-strong');
  root.style.removeProperty('--color-select-selected-subtle');
  root.style.removeProperty('--color-select-not-selected-strong');
  root.style.removeProperty('--color-select-not-selected-subtle');
  root.style.removeProperty('--color-error-strong');
  root.style.removeProperty('--color-error-subtle');
  
  // Border tokens
  root.style.removeProperty('--border-default');
  root.style.removeProperty('--border-emphasis');
  
  // Radius tokens
  root.style.removeProperty('--radius-100');
  root.style.removeProperty('--radius-normal');
  
  // Spacing tokens
  root.style.removeProperty('--space-inset-200');
  root.style.removeProperty('--space-grouped-loose');
  
  // Accessibility tokens
  root.style.removeProperty('--tap-area-recommended');
  root.style.removeProperty('--accessibility-focus-width');
  root.style.removeProperty('--accessibility-focus-offset');
  root.style.removeProperty('--accessibility-focus-color');
  
  // Motion tokens
  root.style.removeProperty('--motion-selection-transition-duration');
  root.style.removeProperty('--motion-selection-transition-easing');
}

/**
 * Register the Button-VerticalList-Item custom element if not already registered.
 * Also sets up required CSS custom properties for token validation.
 */
export function registerVerticalListButtonItem(): void {
  // Set up CSS custom properties required for fail-loudly validation
  setupRequiredTokens();
  
  if (!customElements.get('button-vertical-list-item')) {
    customElements.define('button-vertical-list-item', ButtonVerticalListItem);
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
 * Props interface for creating Button-VerticalList-Item elements
 */
export interface CreateVerticalListButtonItemProps {
  label: string;
  description?: string;
  leadingIcon?: IconBaseName;
  visualState?: VisualState;
  error?: boolean;
  checkmarkTransition?: CheckmarkTransition;
  transitionDelay?: number;
  testID?: string;
}

/**
 * Create a Button-VerticalList-Item element with shadow DOM ready
 * 
 * @param props - Initial properties for the button
 * @returns Promise resolving to the created button element
 */
export async function createVerticalListButtonItem(
  props: CreateVerticalListButtonItemProps
): Promise<ButtonVerticalListItem> {
  registerVerticalListButtonItem();
  
  const button = document.createElement('button-vertical-list-item') as ButtonVerticalListItem;
  
  // Set properties
  button.label = props.label;
  if (props.description) button.description = props.description;
  if (props.leadingIcon) button.leadingIcon = props.leadingIcon;
  if (props.visualState) button.visualState = props.visualState;
  if (props.error !== undefined) button.error = props.error;
  if (props.checkmarkTransition) button.checkmarkTransition = props.checkmarkTransition;
  if (props.transitionDelay !== undefined) button.transitionDelay = props.transitionDelay;
  if (props.testID) button.testID = props.testID;
  
  // Append to document to trigger rendering
  document.body.appendChild(button);
  
  // Wait for shadow DOM to be ready
  await waitForShadowDOM(button);
  
  return button;
}

/**
 * Clean up a Button-VerticalList-Item element from the DOM
 * 
 * @param button - The button element to clean up
 */
export function cleanupVerticalListButtonItem(button: ButtonVerticalListItem): void {
  if (button.parentNode) {
    button.parentNode.removeChild(button);
  }
}

/**
 * Get the shadow button element from a Button-VerticalList-Item
 * 
 * @param button - The Button-VerticalList-Item custom element
 * @returns The button element inside shadow DOM, or null if not found
 */
export function getShadowButton(button: ButtonVerticalListItem): HTMLButtonElement | null {
  return button.shadowRoot?.querySelector('button') || null;
}

/**
 * Get the label element from a Button-VerticalList-Item
 * 
 * @param button - The Button-VerticalList-Item custom element
 * @returns The label element inside shadow DOM, or null if not found
 */
export function getLabelElement(button: ButtonVerticalListItem): HTMLElement | null {
  return button.shadowRoot?.querySelector('.vertical-list-item__label') || null;
}

/**
 * Get the description element from a Button-VerticalList-Item
 * 
 * @param button - The Button-VerticalList-Item custom element
 * @returns The description element inside shadow DOM, or null if not found
 */
export function getDescriptionElement(button: ButtonVerticalListItem): HTMLElement | null {
  return button.shadowRoot?.querySelector('.vertical-list-item__description') || null;
}

/**
 * Get the leading icon container from a Button-VerticalList-Item
 * 
 * @param button - The Button-VerticalList-Item custom element
 * @returns The leading icon container inside shadow DOM, or null if not found
 */
export function getLeadingIconElement(button: ButtonVerticalListItem): HTMLElement | null {
  return button.shadowRoot?.querySelector('.vertical-list-item__leading-icon') || null;
}

/**
 * Get the checkmark container from a Button-VerticalList-Item
 * 
 * @param button - The Button-VerticalList-Item custom element
 * @returns The checkmark container inside shadow DOM, or null if not found
 */
export function getCheckmarkElement(button: ButtonVerticalListItem): HTMLElement | null {
  return button.shadowRoot?.querySelector('.vertical-list-item__checkmark') || null;
}

/**
 * Check if button has a specific CSS class
 * 
 * @param button - The Button-VerticalList-Item custom element
 * @param className - The class name to check for
 * @returns True if the button has the class, false otherwise
 */
export function hasClass(button: ButtonVerticalListItem, className: string): boolean {
  const shadowButton = getShadowButton(button);
  return shadowButton?.classList.contains(className) || false;
}

/**
 * Simulate a click on the button
 * 
 * @param button - The Button-VerticalList-Item custom element
 */
export function clickButton(button: ButtonVerticalListItem): void {
  const shadowButton = getShadowButton(button);
  if (shadowButton) {
    shadowButton.click();
  }
}

/**
 * Simulate focus on the button
 * 
 * @param button - The Button-VerticalList-Item custom element
 */
export function focusButton(button: ButtonVerticalListItem): void {
  const shadowButton = getShadowButton(button);
  if (shadowButton) {
    shadowButton.focus();
  }
}

/**
 * Simulate blur on the button
 * 
 * @param button - The Button-VerticalList-Item custom element
 */
export function blurButton(button: ButtonVerticalListItem): void {
  const shadowButton = getShadowButton(button);
  if (shadowButton) {
    shadowButton.blur();
  }
}
