/**
 * Dark-WCAG Theme — Semantic Color Overrides
 *
 * Context-specific overrides for tokens that need different primitives in
 * dark mode + WCAG theme than in either dark-base or light-wcag alone.
 *
 * These 2 tokens have dark overrides (cyan→cyan variant) AND wcag overrides
 * (cyan→teal). In dark-wcag, the teal equivalent of the dark primitive is needed.
 *
 * @see regression/wcag-token-inventory.md § "Interaction with Dark Overrides"
 */

import type { SemanticOverrideMap } from '../types';

export const darkWcagSemanticOverrides: SemanticOverrideMap = {
  // dark-base uses cyan100; wcag swaps cyan→teal; so dark-wcag uses teal100
  'color.action.navigation': { primitiveReferences: { value: 'teal100' } },

  // dark-base uses cyan500; wcag swaps cyan→teal; so dark-wcag uses teal500
  'color.background.primary.subtle': { primitiveReferences: { value: 'teal500' } },
};
