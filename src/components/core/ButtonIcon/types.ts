/**
 * Button-Icon Component Type Definitions
 * 
 * Stemma System naming: [Family]-[Type] = Button-Icon
 * Type: Primitive (foundational component)
 * 
 * Shared TypeScript interfaces for the Button-Icon component.
 * These types are used across all platform implementations.
 * 
 * @see .kiro/specs/035-button-icon-component/design.md for component design
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 */

/**
 * Button-Icon size variants
 * 
 * Determines icon size and padding:
 * - small: icon.size050 (16px icon) + buttonIcon.inset.small (8px padding)
 * - medium: icon.size075 (20px icon) + buttonIcon.inset.medium (10px padding)
 * - large: icon.size100 (24px icon) + buttonIcon.inset.large (12px padding)
 * 
 * @see Requirements 1.1, 1.2, 1.3
 */
export type ButtonIconSize = 'small' | 'medium' | 'large';
