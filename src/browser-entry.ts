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

// Import all web components - Stemma System naming convention
import { InputTextBase } from './components/core/Input-Text-Base/platforms/web/InputTextBase.web';
import { InputTextEmail } from './components/core/Input-Text-Email/platforms/web/InputTextEmail.web';
import { InputTextPassword } from './components/core/Input-Text-Password/platforms/web/InputTextPassword.web';
import { InputTextPhoneNumber } from './components/core/Input-Text-PhoneNumber/platforms/web/InputTextPhoneNumber.web';
// Button-CTA - Stemma System naming (standalone component, no behavioral variants)
import { ButtonCTA } from './components/core/Button-CTA/platforms/web/ButtonCTA.web';
// Icon-Base - Stemma System naming (foundational primitive component)
import { IconBaseElement } from './components/core/Icon-Base/platforms/web/IconBase.web';
// Button-Icon - Stemma System naming (circular icon-only button)
import { ButtonIcon } from './components/core/Button-Icon/platforms/web/ButtonIcon.web';
// Container-Base - Stemma System naming (foundational primitive component)
import { ContainerBaseWeb } from './components/core/Container-Base/platforms/web/ContainerBase.web';
// Button-VerticalList-Item - Stemma System naming (vertical list button item)
import { ButtonVerticalListItem } from './components/core/Button-VerticalList-Item/platforms/web/ButtonVerticalListItem.web';

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

// Auto-register all components - Stemma System naming
// Requirements: 4.1, 4.2, 4.3, 4.4
safeDefine('input-text-base', InputTextBase);
safeDefine('input-text-email', InputTextEmail);
safeDefine('input-text-password', InputTextPassword);
safeDefine('input-text-phone-number', InputTextPhoneNumber);
// Button-CTA - Primary registration (Stemma System naming)
safeDefine('button-cta', ButtonCTA);
// Icon-Base - Stemma System naming (foundational primitive component)
safeDefine('icon-base', IconBaseElement);
// Button-Icon - Stemma System naming (circular icon-only button)
safeDefine('button-icon', ButtonIcon);
// Container-Base - Stemma System naming (foundational primitive component)
safeDefine('container-base', ContainerBaseWeb);
// Button-VerticalList-Item - Stemma System naming (vertical list button item)
safeDefine('button-vertical-list-item', ButtonVerticalListItem);

// Check tokens after DOM is ready and CSS is applied
// Uses requestAnimationFrame to ensure stylesheets have been fully parsed and applied
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Defer to next frame to ensure CSS is applied
      requestAnimationFrame(() => checkTokensLoaded());
    });
  } else {
    // DOM is already ready, defer to next frame for CSS
    requestAnimationFrame(() => checkTokensLoaded());
  }
}

// Export all components for UMD global access and ESM imports
// Requirements: 1.2, 2.3
export { InputTextBase, InputTextEmail, InputTextPassword, InputTextPhoneNumber, ButtonCTA, IconBaseElement, ButtonIcon, ContainerBaseWeb, ButtonVerticalListItem };

// Also export with more intuitive names for the UMD global
export const Icon = IconBaseElement;
export const IconBase = IconBaseElement;
export const Container = ContainerBaseWeb;
export const ContainerBase = ContainerBaseWeb;
export const VerticalListButtonItem = ButtonVerticalListItem;
// Legacy alias for backward compatibility
export const TextInputField = InputTextBase;
