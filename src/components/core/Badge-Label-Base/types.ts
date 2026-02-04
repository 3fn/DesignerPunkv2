/**
 * Badge-Label-Base Type Definitions
 * 
 * Stemma System: Badge Family
 * Component Type: Type Primitive (Label)
 * Naming Convention: [Family]-[Type]-[Variant] = Badge-Label-Base
 * 
 * Provides type-safe props for the Badge-Label-Base component across all platforms.
 * Badge-Label-Base is a read-only, non-interactive visual indicator for displaying
 * categorization, status, or metadata text.
 * 
 * @module Badge-Label-Base/types
 * @see .kiro/specs/044-badge-base/design.md for design specification
 * @see Requirements 1.1-1.10 in .kiro/specs/044-badge-base/requirements.md
 */

import { IconBaseName } from '../Icon-Base/types';

/**
 * Badge size variants.
 * 
 * Each size maps to specific typography and spacing tokens:
 * - sm: typography.labelXs, space.inset.none (v), space.inset.050 (h), icon.size050
 * - md: typography.labelSm, space.inset.050 (v), space.inset.100 (h), icon.size075
 * - lg: typography.labelMd, space.inset.100 (v), space.inset.150 (h), icon.size100
 * 
 * @see Requirements 1.2, 1.3 in .kiro/specs/044-badge-base/requirements.md
 */
export type BadgeLabelSize = 'sm' | 'md' | 'lg';

/**
 * Default values for Badge-Label-Base props.
 * 
 * @see Requirements 1.3, 1.7 in .kiro/specs/044-badge-base/requirements.md
 */
export const BADGE_LABEL_DEFAULTS = {
  /** Default size variant */
  size: 'md' as BadgeLabelSize,
  /** Default truncation behavior */
  truncate: false,
} as const;

/**
 * Token mappings for Badge-Label-Base sizes.
 * 
 * Maps size variants to their corresponding design tokens for typography,
 * spacing, and icon sizing.
 * 
 * @see Requirements 4.1, 4.4, 4.5, 4.6 in .kiro/specs/044-badge-base/requirements.md
 */
export const BADGE_LABEL_SIZE_TOKENS = {
  sm: {
    typography: 'typography.labelXs',
    paddingVertical: 'space.inset.none',
    paddingHorizontal: 'space.inset.050',
    iconSize: 13, // icon.size050
    iconGap: 'space.grouped.minimal',
  },
  md: {
    typography: 'typography.labelSm',
    paddingVertical: 'space.inset.050',
    paddingHorizontal: 'space.inset.100',
    iconSize: 20, // icon.size075
    iconGap: 'space.grouped.tight',
  },
  lg: {
    typography: 'typography.labelMd',
    paddingVertical: 'space.inset.100',
    paddingHorizontal: 'space.inset.150',
    iconSize: 24, // icon.size100
    iconGap: 'space.grouped.tight',
  },
} as const;

/**
 * Props interface for Badge-Label-Base component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * Platform-specific implementations may extend this interface with additional
 * platform-specific properties.
 * 
 * @see Requirements 1.1-1.10 in .kiro/specs/044-badge-base/requirements.md
 * 
 * @example
 * ```typescript
 * // Web usage
 * <badge-label-base label="Draft" size="md"></badge-label-base>
 * 
 * // With icon
 * <badge-label-base label="Status" icon="check" size="sm"></badge-label-base>
 * 
 * // With truncation
 * <badge-label-base label="Very long category name" truncate="true"></badge-label-base>
 * ```
 */
export interface BadgeLabelBaseProps {
  /**
   * Badge text content (required).
   * 
   * The label text to display inside the badge.
   * 
   * @see Requirement 1.1 in .kiro/specs/044-badge-base/requirements.md
   */
  label: string;
  
  /**
   * Size variant.
   * 
   * Determines typography, spacing, and icon size tokens applied.
   * 
   * @default 'md'
   * @see Requirements 1.2, 1.3 in .kiro/specs/044-badge-base/requirements.md
   */
  size?: BadgeLabelSize;
  
  /**
   * Optional leading icon.
   * 
   * When provided, renders an icon before the label text using Icon-Base.
   * Icon size is automatically determined by badge size.
   * Icon is marked as decorative (aria-hidden="true").
   * 
   * @see Requirements 1.4, 6.2 in .kiro/specs/044-badge-base/requirements.md
   */
  icon?: IconBaseName;
  
  /**
   * Enable truncation at component-defined max-width.
   * 
   * When true, text is truncated with ellipsis at badge.label.maxWidth (120px).
   * Full text is accessible via title attribute (web) or accessibility label (native).
   * 
   * @default false
   * @see Requirements 1.5, 1.6, 1.7, 4.8 in .kiro/specs/044-badge-base/requirements.md
   */
  truncate?: boolean;
  
  /**
   * Optional test ID for automated testing.
   * 
   * Used to identify badges in automated tests across all platforms:
   * - Web: data-testid attribute
   * - iOS: accessibilityIdentifier
   * - Android: testTag
   */
  testID?: string;
}

