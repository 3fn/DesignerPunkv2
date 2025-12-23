/**
 * Browser Entry Point for DesignerPunk Web Components
 * 
 * This file aggregates all web components for direct browser consumption.
 * It provides auto-registration of custom elements and token detection.
 * 
 * Supports both ESM and UMD bundle formats:
 * - ESM: <script type="module" src="dist/browser/designerpunk.esm.js">
 * - UMD: <script src="dist/browser/designerpunk.umd.js"> (exposes window.DesignerPunk)
 * 
 * @module browser-entry
 * @see .kiro/specs/028-web-component-browser-distribution/design.md
 */

// Import all web components
import { TextInputField } from './components/core/TextInputField/platforms/web/TextInputField.web';
import { ButtonCTA } from './components/core/ButtonCTA/platforms/web/ButtonCTA.web';
import { DPIcon } from './components/core/Icon/platforms/web/Icon.web';
import { ContainerWeb } from './components/core/Container/platforms/web/Container.web';

/**
 * Check if design tokens are loaded in the document.
 * 
 * Tests for the presence of a known CSS custom property (--color-primary)
 * to determine if tokens.css has been loaded. If tokens are not detected,
 * logs a warning to help developers diagnose styling issues.
 * 
 * This function is called automatically when the bundle loads, after the
 * DOM is ready.
 * 
 * @remarks
 * - Uses getComputedStyle to check for CSS custom property
 * - Logs a warning (not error) to avoid breaking the page
 * - Provides actionable guidance in the warning message
 * 
 * @see Requirements 3.4
 */
function checkTokensLoaded(): void {
  // Check for a known CSS custom property from the token system
  const testProperty = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-primary');
  
  if (!testProperty || testProperty.trim() === '') {
    console.warn(
      '[DesignerPunk] Design tokens not detected. ' +
      'Include tokens.css before using components: ' +
      '<link rel="stylesheet" href="dist/browser/tokens.css">'
    );
  }
}

/**
 * Safely define a custom element with idempotency check.
 * 
 * Wraps customElements.define() to prevent errors when:
 * - The bundle is accidentally loaded twice
 * - A consumer has already registered a component with the same name
 * - Multiple versions of the library are loaded
 * 
 * @param name - The custom element tag name (e.g., 'button-cta')
 * @param constructor - The custom element class constructor
 * 
 * @remarks
 * - Checks if element is already registered before defining
 * - Silently skips registration if already defined
 * - Does not throw errors for duplicate registration attempts
 * 
 * @see Requirements 4.5
 */
function safeDefine(name: string, constructor: CustomElementConstructor): void {
  if (!customElements.get(name)) {
    customElements.define(name, constructor);
  }
}

// Auto-register all components
// Requirements: 4.1, 4.2, 4.3, 4.4
safeDefine('text-input-field', TextInputField);
safeDefine('button-cta', ButtonCTA);
safeDefine('dp-icon', DPIcon);
safeDefine('dp-container', ContainerWeb);

// Check tokens after DOM is ready
// This ensures the check runs after stylesheets have been parsed
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkTokensLoaded);
  } else {
    // DOM is already ready, check immediately
    checkTokensLoaded();
  }
}

// Export all components for UMD global access and ESM imports
// Requirements: 1.2, 2.3
export { TextInputField, ButtonCTA, DPIcon, ContainerWeb };

// Also export with more intuitive names for the UMD global
export const Icon = DPIcon;
export const Container = ContainerWeb;
