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
// Button-VerticalList-Set - Stemma System naming (vertical list button set container)
import { ButtonVerticalListSet } from './components/core/Button-VerticalList-Set/platforms/web/ButtonVerticalListSet.web';
// Avatar-Base - Stemma System naming (visual representation for users and AI agents)
import { AvatarBaseElement } from './components/core/Avatar/platforms/web/Avatar.web';
// Badge-Label-Base - Stemma System naming (label badge for categorization/status)
import { BadgeLabelBase } from './components/core/Badge-Label-Base/platforms/web/BadgeLabelBase.web';
// Badge-Count-Base - Stemma System naming (count badge for numeric values)
import { BadgeCountBase } from './components/core/Badge-Count-Base/platforms/web/BadgeCountBase.web';
// Badge-Count-Notification - Stemma System naming (notification badge with live regions)
import { BadgeCountNotification } from './components/core/Badge-Count-Notification/platforms/web/BadgeCountNotification.web';
// Input-Checkbox-Base - Stemma System naming (binary selection control)
import { InputCheckboxBaseElement } from './components/core/Input-Checkbox-Base/platforms/web/InputCheckboxBase.web';
// Input-Checkbox-Legal - Stemma System naming (legal consent checkbox with audit trail)
import { InputCheckboxLegalElement } from './components/core/Input-Checkbox-Legal/platforms/web/InputCheckboxLegal.web';
// Chip-Base - Stemma System naming (compact interactive chip primitive)
import { ChipBaseElement } from './components/core/Chip-Base/platforms/web/ChipBase.web';
// Chip-Filter - Stemma System naming (toggleable filter chip)
import { ChipFilterElement } from './components/core/Chip-Filter/platforms/web/ChipFilter.web';
// Chip-Input - Stemma System naming (dismissible input chip)
import { ChipInputElement } from './components/core/Chip-Input/platforms/web/ChipInput.web';
// Container-Card-Base - Stemma System naming (specialized card container with opinionated defaults)
import { ContainerCardBaseWeb } from './components/core/Container-Card-Base/platforms/web/ContainerCardBase.web';
// Input-Radio-Base - Stemma System naming (single-selection radio control)
import { InputRadioBaseElement } from './components/core/Input-Radio-Base/platforms/web/InputRadioBase.web';
// Input-Radio-Set - Stemma System naming (radio group orchestrator with mutual exclusivity)
import { InputRadioSetElement } from './components/core/Input-Radio-Set/platforms/web/InputRadioSet.web';
// Progress-Indicator-Node-Base - Stemma System naming (individual indicator node primitive)
import { ProgressIndicatorNodeBase } from './components/core/Progress-Indicator-Node-Base/platforms/web/ProgressIndicatorNodeBase.web';
// Progress-Indicator-Connector-Base - Stemma System naming (connecting line between nodes)
import { ProgressIndicatorConnectorBase } from './components/core/Progress-Indicator-Connector-Base/platforms/web/ProgressIndicatorConnectorBase.web';
// Progress-Indicator-Label-Base - Stemma System naming (label below indicator node)
import { ProgressIndicatorLabelBase } from './components/core/Progress-Indicator-Label-Base/platforms/web/ProgressIndicatorLabelBase.web';
// Progress-Pagination-Base - Stemma System naming (pagination dot indicator for carousels/multi-page flows)
import { ProgressPaginationBase } from './components/core/Progress-Pagination-Base/platforms/web/ProgressPaginationBase.web';
// Progress-Stepper-Base - Stemma System naming (stepper indicator composing node and connector primitives)
import { ProgressStepperBase } from './components/core/Progress-Stepper-Base/platforms/web/ProgressStepperBase.web';
// Progress-Stepper-Detailed - Stemma System naming (detailed stepper with labels and optional icons)
import { ProgressStepperDetailed } from './components/core/Progress-Stepper-Detailed/platforms/web/ProgressStepperDetailed.web';

/**
 * Check if design tokens are loaded in the document.
 * 
 * Tests for the presence of a known CSS custom property (--color-action-primary)
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
 * - Note: Token name updated from --color-primary to --color-action-primary per Spec 052
 * 
 * @see Requirements 3.4
 */
function checkTokensLoaded(): void {
  // Check for a known CSS custom property from the token system
  // Note: color.primary was renamed to color.action.primary in Spec 052
  const testProperty = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-action-primary');
  
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
// Button-VerticalList-Set - Stemma System naming (vertical list button set container)
safeDefine('button-vertical-list-set', ButtonVerticalListSet);
// Avatar-Base - Stemma System naming (visual representation for users and AI agents)
safeDefine('avatar-base', AvatarBaseElement);
// Badge-Label-Base - Stemma System naming (label badge for categorization/status)
safeDefine('badge-label-base', BadgeLabelBase);
// Badge-Count-Base - Stemma System naming (count badge for numeric values)
safeDefine('badge-count-base', BadgeCountBase);
// Badge-Count-Notification - Stemma System naming (notification badge with live regions)
safeDefine('badge-count-notification', BadgeCountNotification);
// Input-Checkbox-Base - Stemma System naming (binary selection control)
safeDefine('input-checkbox-base', InputCheckboxBaseElement);
// Input-Checkbox-Legal - Stemma System naming (legal consent checkbox with audit trail)
safeDefine('input-checkbox-legal', InputCheckboxLegalElement);
// Chip-Base - Stemma System naming (compact interactive chip primitive)
safeDefine('chip-base', ChipBaseElement);
// Chip-Filter - Stemma System naming (toggleable filter chip)
safeDefine('chip-filter', ChipFilterElement);
// Chip-Input - Stemma System naming (dismissible input chip)
safeDefine('chip-input', ChipInputElement);
// Container-Card-Base - Stemma System naming (specialized card container with opinionated defaults)
safeDefine('container-card-base', ContainerCardBaseWeb);
// Input-Radio-Base - Stemma System naming (single-selection radio control)
safeDefine('input-radio-base', InputRadioBaseElement);
// Input-Radio-Set - Stemma System naming (radio group orchestrator with mutual exclusivity)
safeDefine('input-radio-set', InputRadioSetElement);
// Progress-Indicator-Node-Base - Stemma System naming (individual indicator node primitive)
safeDefine('progress-indicator-node-base', ProgressIndicatorNodeBase);
// Progress-Indicator-Connector-Base - Stemma System naming (connecting line between nodes)
safeDefine('progress-indicator-connector-base', ProgressIndicatorConnectorBase);
// Progress-Indicator-Label-Base - Stemma System naming (label below indicator node)
safeDefine('progress-indicator-label-base', ProgressIndicatorLabelBase);
// Progress-Pagination-Base - Stemma System naming (pagination dot indicator for carousels/multi-page flows)
safeDefine('progress-pagination-base', ProgressPaginationBase);
// Progress-Stepper-Base - Stemma System naming (stepper indicator composing node and connector primitives)
safeDefine('progress-stepper-base', ProgressStepperBase);
// Progress-Stepper-Detailed - Stemma System naming (detailed stepper with labels and optional icons)
safeDefine('progress-stepper-detailed', ProgressStepperDetailed);

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
export { InputTextBase, InputTextEmail, InputTextPassword, InputTextPhoneNumber, ButtonCTA, IconBaseElement, ButtonIcon, ContainerBaseWeb, ButtonVerticalListItem, ButtonVerticalListSet, AvatarBaseElement, BadgeLabelBase, BadgeCountBase, BadgeCountNotification, InputCheckboxBaseElement, InputCheckboxLegalElement, ChipBaseElement, ChipFilterElement, ChipInputElement, ContainerCardBaseWeb, InputRadioBaseElement, InputRadioSetElement, ProgressIndicatorNodeBase, ProgressIndicatorConnectorBase, ProgressIndicatorLabelBase, ProgressPaginationBase, ProgressStepperBase, ProgressStepperDetailed };

// Also export with more intuitive names for the UMD global
export const Icon = IconBaseElement;
export const IconBase = IconBaseElement;
export const Container = ContainerBaseWeb;
export const ContainerBase = ContainerBaseWeb;
export const VerticalListButtonItem = ButtonVerticalListItem;
export const VerticalListButtonSet = ButtonVerticalListSet;
// Avatar - Intuitive alias for AvatarBaseElement
export const Avatar = AvatarBaseElement;
export const AvatarBase = AvatarBaseElement;
// Badge - Intuitive aliases for badge components
export const BadgeLabel = BadgeLabelBase;
export const BadgeCount = BadgeCountBase;
export const BadgeNotification = BadgeCountNotification;
// Checkbox - Intuitive aliases for checkbox components
export const CheckboxBase = InputCheckboxBaseElement;
export const CheckboxLegal = InputCheckboxLegalElement;
// Legacy alias for backward compatibility
export const TextInputField = InputTextBase;
// Chip - Intuitive aliases for chip components
export const ChipBase = ChipBaseElement;
export const ChipFilter = ChipFilterElement;
export const ChipInput = ChipInputElement;
// Container-Card - Intuitive alias for ContainerCardBaseWeb
export const ContainerCard = ContainerCardBaseWeb;
export const ContainerCardBase = ContainerCardBaseWeb;
// Radio - Intuitive aliases for radio components
export const RadioBase = InputRadioBaseElement;
export const RadioSet = InputRadioSetElement;
// Progress-Indicator - Intuitive aliases for progress indicator primitives
export const ProgressNode = ProgressIndicatorNodeBase;
export const ProgressConnector = ProgressIndicatorConnectorBase;
export const ProgressLabel = ProgressIndicatorLabelBase;
// Progress-Pagination - Intuitive alias for ProgressPaginationBase
export const PaginationBase = ProgressPaginationBase;
// Progress-Stepper - Intuitive aliases for stepper components
export const StepperBase = ProgressStepperBase;
export const StepperDetailed = ProgressStepperDetailed;
