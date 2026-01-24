/**
 * Test utilities for Badge-Label-Base component testing
 * 
 * Provides helper functions for:
 * - Custom element registration
 * - Shadow DOM rendering waits
 * - Component cleanup
 * - CSS custom property setup for token-based styling
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Badge-Label-Base
 * Component Type: Type Primitive (Label)
 * 
 * @module Badge-Label-Base/__tests__/test-utils
 */

import { BadgeLabelBase } from '../platforms/web/BadgeLabelBase.web';
import { BadgeLabelSize } from '../types';
import { IconBaseName } from '../../Icon-Base/types';

/**
 * Set up required CSS custom properties for Badge-Label-Base token-based styling.
 * 
 * Badge-Label-Base uses CSS custom properties for all styling (zero hard-coded values).
 * This function sets up the required properties in the test environment.
 */
export function setupBadgeLabelTokens(): void {
  // Color tokens
  document.documentElement.style.setProperty('--color-surface', '#F5F5F5');
  document.documentElement.style.setProperty('--color-text-default', '#1A1A1A');
  document.documentElement.style.setProperty('--color-icon-default', '#1A1A1A');
  
  // Radius tokens
  document.documentElement.style.setProperty('--radius-subtle', '2px');
  
  // Base typography tokens
  document.documentElement.style.setProperty('--font-family-body', 'Inter, sans-serif');
  document.documentElement.style.setProperty('--font-size-050', '13px');
  document.documentElement.style.setProperty('--font-size-075', '14px');
  document.documentElement.style.setProperty('--font-size-100', '16px');
  document.documentElement.style.setProperty('--line-height-050', '1.538');
  document.documentElement.style.setProperty('--line-height-075', '1.429');
  document.documentElement.style.setProperty('--line-height-100', '1.5');
  document.documentElement.style.setProperty('--font-weight-500', '500');
  document.documentElement.style.setProperty('--letter-spacing-100', '0');
  
  // Composite typography tokens (used by badge components)
  document.documentElement.style.setProperty('--typography-label-xs-font-family', 'var(--font-family-body)');
  document.documentElement.style.setProperty('--typography-label-xs-font-size', 'var(--font-size-050)');
  document.documentElement.style.setProperty('--typography-label-xs-line-height', 'var(--line-height-050)');
  document.documentElement.style.setProperty('--typography-label-xs-font-weight', 'var(--font-weight-500)');
  document.documentElement.style.setProperty('--typography-label-xs-letter-spacing', 'var(--letter-spacing-100)');
  
  document.documentElement.style.setProperty('--typography-label-sm-font-family', 'var(--font-family-body)');
  document.documentElement.style.setProperty('--typography-label-sm-font-size', 'var(--font-size-075)');
  document.documentElement.style.setProperty('--typography-label-sm-line-height', 'var(--line-height-075)');
  document.documentElement.style.setProperty('--typography-label-sm-font-weight', 'var(--font-weight-500)');
  document.documentElement.style.setProperty('--typography-label-sm-letter-spacing', 'var(--letter-spacing-100)');
  
  document.documentElement.style.setProperty('--typography-label-md-font-family', 'var(--font-family-body)');
  document.documentElement.style.setProperty('--typography-label-md-font-size', 'var(--font-size-100)');
  document.documentElement.style.setProperty('--typography-label-md-line-height', 'var(--line-height-100)');
  document.documentElement.style.setProperty('--typography-label-md-font-weight', 'var(--font-weight-500)');
  document.documentElement.style.setProperty('--typography-label-md-letter-spacing', 'var(--letter-spacing-100)');
  
  // Spacing tokens
  document.documentElement.style.setProperty('--space-025', '2px');
  document.documentElement.style.setProperty('--space-050', '4px');
  document.documentElement.style.setProperty('--space-100', '8px');
  document.documentElement.style.setProperty('--space-150', '12px');
  
  // Component token (using correct generated name)
  document.documentElement.style.setProperty('--badge-label-base-max-width', '120px');
  
  // Icon stroke width token (required by Icon-Base)
  document.documentElement.style.setProperty('--icon-stroke-width', '2');
}

/**
 * Clean up CSS custom properties set by setupBadgeLabelTokens
 */
export function cleanupBadgeLabelTokens(): void {
  document.documentElement.style.removeProperty('--color-surface');
  document.documentElement.style.removeProperty('--color-text-default');
  document.documentElement.style.removeProperty('--color-icon-default');
  document.documentElement.style.removeProperty('--radius-subtle');
  document.documentElement.style.removeProperty('--font-family-body');
  document.documentElement.style.removeProperty('--font-size-050');
  document.documentElement.style.removeProperty('--font-size-075');
  document.documentElement.style.removeProperty('--font-size-100');
  document.documentElement.style.removeProperty('--line-height-050');
  document.documentElement.style.removeProperty('--line-height-075');
  document.documentElement.style.removeProperty('--line-height-100');
  document.documentElement.style.removeProperty('--font-weight-500');
  document.documentElement.style.removeProperty('--letter-spacing-100');
  // Composite typography tokens
  document.documentElement.style.removeProperty('--typography-label-xs-font-family');
  document.documentElement.style.removeProperty('--typography-label-xs-font-size');
  document.documentElement.style.removeProperty('--typography-label-xs-line-height');
  document.documentElement.style.removeProperty('--typography-label-xs-font-weight');
  document.documentElement.style.removeProperty('--typography-label-xs-letter-spacing');
  document.documentElement.style.removeProperty('--typography-label-sm-font-family');
  document.documentElement.style.removeProperty('--typography-label-sm-font-size');
  document.documentElement.style.removeProperty('--typography-label-sm-line-height');
  document.documentElement.style.removeProperty('--typography-label-sm-font-weight');
  document.documentElement.style.removeProperty('--typography-label-sm-letter-spacing');
  document.documentElement.style.removeProperty('--typography-label-md-font-family');
  document.documentElement.style.removeProperty('--typography-label-md-font-size');
  document.documentElement.style.removeProperty('--typography-label-md-line-height');
  document.documentElement.style.removeProperty('--typography-label-md-font-weight');
  document.documentElement.style.removeProperty('--typography-label-md-letter-spacing');
  document.documentElement.style.removeProperty('--space-025');
  document.documentElement.style.removeProperty('--space-050');
  document.documentElement.style.removeProperty('--space-100');
  document.documentElement.style.removeProperty('--space-150');
  document.documentElement.style.removeProperty('--badge-label-base-max-width');
  document.documentElement.style.removeProperty('--icon-stroke-width');
}

/**
 * Register the Badge-Label-Base custom element if not already registered.
 * Prevents "already defined" errors in test suites.
 * 
 * Also sets up required CSS custom properties for token-based styling.
 */
export function registerBadgeLabelBase(): void {
  // Set up CSS custom properties required for token-based styling
  setupBadgeLabelTokens();
  
  // BadgeLabelBase auto-registers on import, but we ensure it's registered
  if (!customElements.get('badge-label-base')) {
    customElements.define('badge-label-base', BadgeLabelBase);
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
 * Create a Badge-Label-Base element with shadow DOM ready.
 * 
 * @param props - Initial properties for the badge
 * @returns Promise resolving to the created badge element
 */
export async function createBadgeLabelBase(props: {
  label: string;
  size?: BadgeLabelSize;
  icon?: IconBaseName;
  truncate?: boolean;
  testID?: string;
}): Promise<BadgeLabelBase> {
  registerBadgeLabelBase();
  
  const badge = document.createElement('badge-label-base') as BadgeLabelBase;
  
  // Set required properties
  badge.label = props.label;
  
  // Set optional properties
  if (props.size) badge.size = props.size;
  if (props.icon) badge.icon = props.icon;
  if (props.truncate !== undefined) badge.truncate = props.truncate;
  if (props.testID) badge.testID = props.testID;
  
  // Append to document to trigger rendering
  document.body.appendChild(badge);
  
  // Wait for shadow DOM to be ready
  await waitForShadowDOM(badge);
  
  return badge;
}

/**
 * Clean up a Badge-Label-Base element from the DOM.
 * 
 * @param badge - The badge element to clean up
 */
export function cleanupBadgeLabelBase(badge: BadgeLabelBase): void {
  if (badge.parentNode) {
    badge.parentNode.removeChild(badge);
  }
}

/**
 * Get the badge container element from shadow DOM.
 * 
 * @param badge - The Badge-Label-Base custom element
 * @returns The badge container element inside shadow DOM, or null if not found
 */
export function getShadowBadge(badge: BadgeLabelBase): HTMLElement | null {
  return badge.shadowRoot?.querySelector('.badge-label') || null;
}

/**
 * Get the text element from a Badge-Label-Base.
 * 
 * @param badge - The Badge-Label-Base custom element
 * @returns The text element inside shadow DOM, or null if not found
 */
export function getTextElement(badge: BadgeLabelBase): HTMLElement | null {
  return badge.shadowRoot?.querySelector('.badge-label__text') || null;
}

/**
 * Get the icon container element from a Badge-Label-Base.
 * 
 * @param badge - The Badge-Label-Base custom element
 * @returns The icon container element inside shadow DOM, or null if not found
 */
export function getIconContainer(badge: BadgeLabelBase): HTMLElement | null {
  return badge.shadowRoot?.querySelector('.badge-label__icon') || null;
}

/**
 * Get the icon-base element from a Badge-Label-Base.
 * 
 * @param badge - The Badge-Label-Base custom element
 * @returns The icon-base element inside shadow DOM, or null if not found
 */
export function getIconElement(badge: BadgeLabelBase): HTMLElement | null {
  return badge.shadowRoot?.querySelector('icon-base') || null;
}

/**
 * Check if badge has a specific CSS class.
 * 
 * @param badge - The Badge-Label-Base custom element
 * @param className - The class name to check for
 * @returns True if the badge has the class, false otherwise
 */
export function hasClass(badge: BadgeLabelBase, className: string): boolean {
  const shadowBadge = getShadowBadge(badge);
  return shadowBadge?.classList.contains(className) || false;
}

/**
 * Get computed style of the shadow badge.
 * 
 * @param badge - The Badge-Label-Base custom element
 * @returns CSSStyleDeclaration of the shadow badge, or null if not found
 */
export function getBadgeComputedStyle(badge: BadgeLabelBase): CSSStyleDeclaration | null {
  const shadowBadge = getShadowBadge(badge);
  if (shadowBadge) {
    return window.getComputedStyle(shadowBadge);
  }
  return null;
}
