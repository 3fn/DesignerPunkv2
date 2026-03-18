/**
 * Dark Theme — Semantic Color Overrides
 *
 * Complete theme file listing all 61 semantic color tokens.
 * Populated entries have dark mode overrides (Level 2 — primitive name changes).
 * Commented-out entries fall back to base (Level 1 — primitive handles mode).
 *
 * To add an override: uncomment the entry, set primitiveReferences to the
 * dark mode primitive(s), and add to the exported map below.
 *
 * @see audit/semantic-color-token-audit.md for classification rationale
 * @see design.md § "Complete Theme with Fallback"
 */

import type { SemanticOverrideMap } from '../types';

// ======================================================================
// FEEDBACK — SUCCESS
// ======================================================================
// color.feedback.success.text: { value: 'green400' }
// color.feedback.success.background: { value: 'green100' }
// color.feedback.success.border: { value: 'green400' }

// ======================================================================
// FEEDBACK — ERROR
// ======================================================================
// color.feedback.error.text: { value: 'pink400' }
// color.feedback.error.background: { value: 'pink100' }
// color.feedback.error.border: { value: 'pink400' }

// ======================================================================
// FEEDBACK — WARNING
// ======================================================================
// color.feedback.warning.text: { value: 'orange400' }
// color.feedback.warning.background: { value: 'orange100' }
// color.feedback.warning.border: { value: 'orange400' }

// ======================================================================
// FEEDBACK — INFO
// ======================================================================
// color.feedback.info.text: { value: 'teal400' }
// color.feedback.info.background: { value: 'teal100' }
// color.feedback.info.border: { value: 'teal400' }

// ======================================================================
// FEEDBACK — SELECT
// ======================================================================
// color.feedback.select.text.rest: { value: 'cyan400' }
// color.feedback.select.text.default: { value: 'gray200' }
// color.feedback.select.background.rest: { value: 'cyan100' }
// color.feedback.select.background.default: { value: 'gray100' }
// color.feedback.select.border.rest: { value: 'cyan400' }
// color.feedback.select.border.default: { value: 'gray200' }

// ======================================================================
// FEEDBACK — NOTIFICATION
// ======================================================================
// color.feedback.notification.background: { value: 'pink400' }
// color.feedback.notification.text: { value: 'white100' }

// ======================================================================
// IDENTITY
// ======================================================================
// color.identity.human: { value: 'orange300' }
// color.identity.agent: { value: 'teal200' }

// ======================================================================
// ACTION
// ======================================================================
// color.action.primary: { value: 'cyan300' }
// color.action.secondary: { value: 'gray400' }
// color.action.navigation: { value: 'cyan500' }

// ======================================================================
// ATTENTION / HIGHLIGHT
// ======================================================================
// color.attention: { value: 'yellow400' }
// color.highlight: { value: 'yellow300' }

// ======================================================================
// TECH / DATA
// ======================================================================
// color.tech: { value: 'purple400' }
// color.data: { value: 'purple300' }

// ======================================================================
// TEXT HIERARCHY
// ======================================================================
// color.text.default: { value: 'gray300' }
// color.text.muted: { value: 'gray200' }
// color.text.subtle: { value: 'gray100' }

// ======================================================================
// CONTRAST
// ======================================================================
// color.contrast.onLight: { value: 'black500' }
// color.contrast.onDark: { value: 'white100' }
// color.contrast.onAction: { value: 'black500' }

// ======================================================================
// STRUCTURE
// ======================================================================
// color.structure.canvas: { value: 'white100' }
// color.structure.surface: { value: 'white200' }
// color.structure.surface.primary: { value: 'white200' }
// color.structure.surface.secondary: { value: 'white300' }
// color.structure.surface.tertiary: { value: 'white400' }
// color.structure.border: { value: 'gray100' }
// color.structure.border.subtle: { color: 'gray100', opacity: 'opacity048' }

// ======================================================================
// BACKGROUND
// ======================================================================
// color.background.primary.subtle: { value: 'cyan100' }

// ======================================================================
// ICON
// ======================================================================
// color.icon.default: { value: 'gray200' }
// color.icon.navigation.inactive: { value: 'gray300' }

// ======================================================================
// PRINT (MODE-INVARIANT)
// ======================================================================
// color.print.default: { value: 'black100' }

// ======================================================================
// GLOW (MODE-INVARIANT)
// ======================================================================
// glow.neonPurple: { value: 'purple500' }
// glow.neonCyan: { value: 'cyan500' }
// glow.neonYellow: { value: 'yellow500' }
// glow.neonGreen: { value: 'green500' }
// glow.neonPink: { value: 'pink500' }

// ======================================================================
// PROGRESS
// ======================================================================
// color.progress.current.background: { value: 'cyan300' }
// color.progress.current.text: { value: 'cyan400' }
// color.progress.pending.background: { value: 'white300' }
// color.progress.pending.text: { value: 'gray300' }
// color.progress.pending.connector: { value: 'white200' }
// color.progress.completed.background: { value: 'green100' }
// color.progress.completed.text: { value: 'green400' }
// color.progress.completed.connector: { value: 'green100' }
// color.progress.error.background: { value: 'pink100' }
// color.progress.error.text: { value: 'pink400' }

// ======================================================================
// SCRIM (MODE-INVARIANT)
// ======================================================================
// color.scrim.standard: { value: 'black500' } [mode-invariant]

// ======================================================================
// EXPORTED OVERRIDE MAP
// ======================================================================
// Add populated overrides here as they are confirmed by component specs.
// Each key must match a semantic token name in the registry.

export const darkSemanticOverrides: SemanticOverrideMap = {
  // Nav-TabBar-Base overrides (Spec 050 Ada R2, 2026-03-17)
  'color.structure.canvas': { primitiveReferences: { value: 'gray400' } },
  'color.action.navigation': { primitiveReferences: { value: 'cyan100' } },
  'color.background.primary.subtle': { primitiveReferences: { value: 'cyan500' } },
  'color.structure.border.subtle': { primitiveReferences: { color: 'gray500', opacity: 'opacity048' } },
  'color.icon.navigation.inactive': { primitiveReferences: { value: 'gray100' } },
};
