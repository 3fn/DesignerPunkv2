/**
 * WCAG Theme — Semantic Color Overrides
 *
 * Migrated from inline wcagValue on primitiveReferences (Phase 2, Spec 080).
 * These overrides apply in both light-wcag and dark-wcag contexts.
 * For dark-wcag-specific overrides, see ../dark-wcag/SemanticOverrides.ts.
 *
 * @see regression/wcag-token-inventory.md for migration rationale
 */

import type { SemanticOverrideMap } from '../types';

export const wcagSemanticOverrides: SemanticOverrideMap = {
  // Info feedback: teal → purple (WCAG distinguishability)
  'color.feedback.info.text': { primitiveReferences: { value: 'purple500' } },
  'color.feedback.info.background': { primitiveReferences: { value: 'purple100' } },
  'color.feedback.info.border': { primitiveReferences: { value: 'purple500' } },

  // Action: cyan → teal (contrast improvement)
  'color.action.primary': { primitiveReferences: { value: 'teal300' } },
  'color.action.navigation': { primitiveReferences: { value: 'teal500' } },

  // Contrast inversion: black → white (teal bg requires white content)
  'color.contrast.onAction': { primitiveReferences: { value: 'white100' } },

  // Background: cyan → teal (follows action family swap)
  'color.background.primary.subtle': { primitiveReferences: { value: 'teal100' } },
};
