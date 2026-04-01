/**
 * Nav-Header-Base Type Definitions
 *
 * Stemma System: Navigation Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Nav-Header-Base
 *
 * Structural primitive for top-of-screen navigation bars. Handles safe area,
 * background, layout, and landmark semantics. Never used directly by product
 * agents — semantic variants (Nav-Header-Page, Nav-Header-App) inherit this.
 *
 * @module Nav-Header-Base/types
 * @see .kiro/specs/088-top-bar-component/design.md
 */

import type { IconBaseName } from '../Icon-Base/types';

/** Leading action types for Nav-Header-Page */
export type LeadingAction =
  | { type: 'back'; accessibilityLabel?: string; onPress: () => void }
  | { type: 'menu'; onPress: () => void }
  | { type: 'custom'; icon: IconBaseName; accessibilityLabel: string; onPress: () => void };

/** Trailing action definition */
export interface TrailingAction {
  icon: IconBaseName;
  accessibilityLabel: string;
  onPress: () => void;
  /** Badge count — renders only when present and > 0 */
  badge?: number;
}

/** Close action definition — always positioned at inline-end edge */
export interface CloseAction {
  onPress: () => void;
  accessibilityLabel?: string;
}

/**
 * Nav-Header-Base Props (Primitive — internal only)
 *
 * Generic slot-based interface. Semantic variants compose this
 * and expose purpose-specific props.
 */
export interface NavHeaderBaseProps {
  /** Content for the leading region (inline-start) */
  leadingSlot?: unknown;

  /** Content for the title region */
  titleSlot?: unknown;

  /** Content for the trailing region (inline-end) */
  trailingSlot?: unknown;

  /** Visual style — affects background treatment */
  appearance?: 'opaque' | 'translucent';

  /** Bottom separator visibility */
  showSeparator?: boolean;

  /** Test identifier */
  testID?: string;
}
