/**
 * Test utilities for Badge-Count-Base component testing
 * 
 * Provides helper functions for:
 * - Custom element registration
 * - Shadow DOM rendering waits
 * - Component cleanup
 * - CSS custom property setup for token-based styling
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Badge-Count-Base
 * Component Type: Type Primitive (Count)
 * 
 * @module Badge-Count-Base/__tests__/test-utils
 */

import { BadgeCountBase } from '../platforms/web/BadgeCountBase.web';
import { BadgeCountSize } from '../types';

/**
 * Set up required CSS custom properties for Badge-Count-Base token-based styling.
 * 
 * Badge-Count-Base uses CSS custom properties for all styling (zero hard-coded values).
 * This function sets up the required properties in the test environment.
 */
export function setupBadgeCountTokens(): void {
  // Color tokens
  document.documentElement.style.setProperty('--color-surface', '#F5F5F5');
  document.documentElement.style.setProperty('--color-text-default', '#1A1A1A');
  
  // Radius tokens
  document.documentElement.style.setProperty('--radius-half', '50%');
  
  // Typography tokens
  document.documentElement.style.setProperty('--font-family-primary', 'Inter, sans-serif');
  document.documentElement.style.setProperty('--font-size-050', '13px');
  document.documentElement.style.setProperty('--font-size-075', '14px');
  document.documentElement.style.setProperty('--font-size-100', '16px');
  document.documentElement.style.setProperty('--line-height-050', '16px');
  document.documentElement.style.setProperty('--line-height-075', '20px');
  document.documentElement.style.setProperty('--line-height-100', '24px');
  document.documentElement.style.setProperty('--font-weight-medium', '500');
  document.documentElement.style.setProperty('--letter-spacing-tight', '-0.01em');
  document.documentElement.style.setProperty('--letter-spacing-normal', '0');
  
  // Spacing tokens
  document.documentElement.style.setProperty('--space-050', '4px');
  document.documentElement.style.setProperty('--space-100', '8px');
}

/**
 * Clean up CSS custom properties set by setupBadgeCountTokens
 */
export function cleanupBadgeCountTokens(): void {
  document.documentElement.style.removeProperty('--color-surface');
  document.documentElement.style.removeProperty('--color-text-default');
  document.documentElement.style.removeProperty('--radius-half');
  document.documentElement.style.removeProperty('--font-family-primary');
  document.documentElement.style.removeProperty('--font-size-050');
  document.documentElement.style.removeProperty('--font-size-075');
  document.documentElement.style.removeProperty('--font-size-100');
  document.documentElement.style.removeProperty('--line-height-050');
  document.documentElement.style.removeProperty('--line-height-075');
  document.documentElement.style.removeProperty('--line-height-100');
  document.documentElement.style.removeProperty('--font-weight-medium');
  document.documentElement.style.removeProperty('--letter-spacing-tight');
  document.documentElement.style.removeProperty('--letter-spacing-normal');
  document.documentElement.style.removeProperty('--space-050');
  document.documentElement.style.removeProperty('--space-100');
}

/**
 * Register the Badge-Count-Base custom element if not already registered.
 * Prevents "already defined" errors in test suites.
 * 
 * Also sets up required CSS custom properties for token-based styling.
 */
export function registerBadgeCountBase(): void {
  // Set up CSS custom properties required for token-based styling
  setupBadgeCountTokens();
  
  // BadgeCountBase auto-registers on import, but we ensure it's registered
  if (!customElements.get('badge-count-base')) {
    customElements.define('badge-count-base', BadgeCountBase);
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
 * Create a Badge-Count-Base element with shadow DOM ready.
 * 
 * @param props - Initial properties for the badge
 * @returns Promise resolving to the created badge element
 */
export async function createBadgeCountBase(props: {
  count: number;
  max?: number;
  showZero?: boolean;
  size?: BadgeCountSize;
  testID?: string;
}): Promise<BadgeCountBase> {
  registerBadgeCountBase();
  
  const badge = document.createElement('badge-count-base') as BadgeCountBase;
  
  // Set required properties
  badge.count = props.count;
  
  // Set optional properties
  if (props.max !== undefined) badge.max = props.max;
  if (props.showZero !== undefined) badge.showZero = props.showZero;
  if (props.size) badge.size = props.size;
  if (props.testID) badge.testID = props.testID;
  
  // Append to document to trigger rendering
  document.body.appendChild(badge);
  
  // Wait for shadow DOM to be ready
  await waitForShadowDOM(badge);
  
  return badge;
}

/**
 * Clean up a Badge-Count-Base element from the DOM.
 * 
 * @param badge - The badge element to clean up
 */
export function cleanupBadgeCountBase(badge: BadgeCountBase): void {
  if (badge.parentNode) {
    badge.parentNode.removeChild(badge);
  }
}

/**
 * Get the badge container element from shadow DOM.
 * 
 * @param badge - The Badge-Count-Base custom element
 * @returns The badge container element inside shadow DOM, or null if not found
 */
export function getShadowBadge(badge: BadgeCountBase): HTMLElement | null {
  return badge.shadowRoot?.querySelector('.badge-count') || null;
}

/**
 * Get the text element from a Badge-Count-Base.
 * 
 * @param badge - The Badge-Count-Base custom element
 * @returns The text element inside shadow DOM, or null if not found
 */
export function getTextElement(badge: BadgeCountBase): HTMLElement | null {
  return badge.shadowRoot?.querySelector('.badge-count__text') || null;
}

/**
 * Check if badge has a specific CSS class.
 * 
 * @param badge - The Badge-Count-Base custom element
 * @param className - The class name to check for
 * @returns True if the badge has the class, false otherwise
 */
export function hasClass(badge: BadgeCountBase, className: string): boolean {
  const shadowBadge = getShadowBadge(badge);
  return shadowBadge?.classList.contains(className) || false;
}

/**
 * Check if badge is rendered (has content in shadow DOM).
 * 
 * @param badge - The Badge-Count-Base custom element
 * @returns True if badge has rendered content, false otherwise
 */
export function isRendered(badge: BadgeCountBase): boolean {
  return badge.shadowRoot?.innerHTML !== '';
}

/**
 * Get computed style of the shadow badge.
 * 
 * @param badge - The Badge-Count-Base custom element
 * @returns CSSStyleDeclaration of the shadow badge, or null if not found
 */
export function getBadgeComputedStyle(badge: BadgeCountBase): CSSStyleDeclaration | null {
  const shadowBadge = getShadowBadge(badge);
  if (shadowBadge) {
    return window.getComputedStyle(shadowBadge);
  }
  return null;
}
