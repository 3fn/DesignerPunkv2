/**
 * Nav-Header-App Type Definitions
 *
 * Stemma System: Navigation Family
 * Component Type: Semantic (inherits Nav-Header-Base)
 *
 * Permissive app-level header scaffold. Product-defined content.
 * Architectural foundation — not an opinionated component.
 *
 * @module Nav-Header-App/types
 * @see .kiro/specs/088-top-bar-component/design.md
 */

export interface NavHeaderAppProps {
  /** Content for the leading region — product-defined */
  leadingContent?: React.ReactNode;

  /** Content for the center region — product-defined */
  centerContent?: React.ReactNode;

  /** Content for the trailing region — product-defined */
  trailingContent?: React.ReactNode;

  /** Visual style */
  appearance?: 'opaque' | 'translucent';

  /** Bottom separator visibility (default: true) */
  showSeparator?: boolean;

  /** Test identifier */
  testID?: string;
}
