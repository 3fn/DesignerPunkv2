/**
 * Button-CTA Component Exports
 * 
 * Central export point for Button-CTA component types, tokens, and utilities.
 * 
 * Stemma System Naming: [Family]-[Type] = Button-CTA
 * Component Type: Standalone (no behavioral variants)
 * 
 * @module Button-CTA
 */

// Type definitions
export type { ButtonProps, ButtonSize, ButtonStyle } from './types';

// Component tokens
export { ButtonCTATokens, getButtonCTAMinWidth } from './Button-CTA.tokens';
export type { ButtonCTAMinWidthVariant } from './Button-CTA.tokens';

// Platform implementations are imported directly from their platform-specific paths
// e.g., import { ButtonCTA } from './platforms/web/ButtonCTA.web';
