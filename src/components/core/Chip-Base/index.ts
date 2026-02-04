/**
 * Chip-Base Component Index
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Chip-Base
 * Type: Primitive
 * 
 * Chip-Base is a primitive component that provides compact, interactive elements
 * for filtering, selection, or input management. It serves as the foundation
 * for semantic variants (Chip-Filter, Chip-Input).
 * 
 * Key Characteristics:
 * - Interactive: Responds to press/tap events
 * - Compact: 32px visual height, 48px tap area
 * - Accessible: Keyboard navigable, ARIA compliant
 * - Token-based: Uses design system tokens for all styling
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * This component does not support disabled states. If an action is unavailable,
 * the component should not be rendered.
 * 
 * @see ./README.md for complete documentation
 * @see .kiro/specs/045-chip-base for design specification
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 */

// Export types
export type { 
  IconName, 
  ChipBaseProps, 
  ChipBaseElement as IChipBaseElement,
  ChipBaseObservedAttribute 
} from './types';

export { CHIP_BASE_OBSERVED_ATTRIBUTES } from './types';

// Platform implementations
// - Web: ChipBaseElement
export { ChipBaseElement, default as ChipBaseWeb } from './platforms/web/ChipBase.web';
// - iOS: ChipBase (Task 2.6)
// - Android: ChipBase (Task 2.7)
