/**
 * Button-VerticalList Component Token Definitions
 * 
 * Stemma System naming: [Family]-[Type] = Button-VerticalList
 * Type: Primitive (foundational component)
 * 
 * Platform-agnostic token definitions for the Button-VerticalList component.
 * Uses the defineComponentTokens() API to register tokens with the global
 * ComponentTokenRegistry for pipeline integration.
 * 
 * The build system generates platform-specific values from these definitions:
 * - Web: CSS custom properties (var(--vertical-list-button-padding-vertical))
 * - iOS: Swift constants (VerticalListButtonTokens.paddingVertical)
 * - Android: Kotlin constants (VerticalListButtonTokens.paddingVertical)
 * 
 * Token Relationships:
 * - verticalListButton.padding.vertical (6px) references space075
 * 
 * @see .kiro/specs/038-vertical-list-buttons/design.md for token consumption strategy
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 * @see .kiro/specs/037-component-token-generation-pipeline for pipeline integration
 */

import { defineComponentTokens } from '../../../build/tokens';
import { spacingTokens } from '../../../tokens/SpacingTokens';

/**
 * Button-VerticalList component tokens defined using the hybrid authoring API.
 * 
 * Each token references a primitive spacing token and includes reasoning
 * explaining why the token exists and its purpose in the component.
 * 
 * Token values:
 * - padding.vertical: 6px (0.75 × base, references space075)
 * 
 * @see Requirements 3.4 in .kiro/specs/038-vertical-list-buttons/requirements.md
 * @see Component Tokens Required section in requirements.md
 */
export const VerticalListButtonTokens = defineComponentTokens({
  component: 'VerticalListButton',
  family: 'spacing',
  tokens: {
    'padding.vertical': {
      reference: spacingTokens.space075,
      reasoning: 'Vertical list button requires 6px vertical padding (0.75× base strategic flexibility token) to achieve proper visual balance while maintaining minimum touch target height via accessibility.tapAreaRecommended',
    },
  },
});

/**
 * Get Button-VerticalList vertical padding value
 * 
 * @returns Padding value in pixels (6)
 * 
 * @example
 * ```typescript
 * getVerticalListButtonPaddingVertical() // Returns 6
 * ```
 */
export function getVerticalListButtonPaddingVertical(): number {
  return VerticalListButtonTokens['padding.vertical'];
}

/**
 * Semantic token references for Button-VerticalList padding values
 * 
 * Maps padding properties to their primitive token references.
 * Used for documentation and cross-referencing with the token system.
 */
export const VerticalListButtonTokenReferences = {
  /** Vertical padding references space075 (strategic flexibility token) */
  paddingVertical: 'space075',
} as const;

/**
 * Get the primitive token reference for Button-VerticalList vertical padding
 * 
 * @returns Primitive token reference name
 * 
 * @example
 * ```typescript
 * getVerticalListButtonPaddingTokenReference() // Returns 'space075'
 * ```
 */
export function getVerticalListButtonPaddingTokenReference(): string {
  return VerticalListButtonTokenReferences.paddingVertical;
}
