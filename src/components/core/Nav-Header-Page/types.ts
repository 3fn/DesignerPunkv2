/**
 * Nav-Header-Page Type Definitions
 *
 * Stemma System: Navigation Family
 * Component Type: Semantic (inherits Nav-Header-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Nav-Header-Page
 *
 * Opinionated page-level navigation bar with back/close actions,
 * title, trailing actions, and scroll behavior. Composes Nav-Header-Base.
 *
 * @module Nav-Header-Page/types
 * @see .kiro/specs/088-top-bar-component/design.md
 */

import type { LeadingAction, TrailingAction, CloseAction } from '../Nav-Header-Base/types';

export type { LeadingAction, TrailingAction, CloseAction };

/**
 * Nav-Header-Page Props
 *
 * Opinionated page-level header for pushed or presented screens.
 * Composes Nav-Header-Base internally.
 */
export interface NavHeaderPageProps {
  /** Screen title — rendered as h1 heading */
  title: string;

  /** Leading action — back, menu, or custom */
  leadingAction?: LeadingAction;

  /** Trailing actions — global-context actions for the page */
  trailingActions?: TrailingAction[];

  /** Close action — always at inline-end edge, separate from trailing actions */
  closeAction?: CloseAction;

  /** Title alignment — defaults to platform convention (iOS: center, Android/Web: leading) */
  titleAlignment?: 'center' | 'leading';

  /** Scroll behavior — fixed (default) or collapsible (hide on scroll down, reveal on scroll up) */
  scrollBehavior?: 'fixed' | 'collapsible';

  /** Web-only: ref to nested scroll container (defaults to window scroll) */
  scrollContainerRef?: { current: HTMLElement | null };

  /** Visual style — affects background treatment */
  appearance?: 'opaque' | 'translucent';

  /** Bottom separator visibility (default: true) */
  showSeparator?: boolean;

  /** Test identifier */
  testID?: string;
}
